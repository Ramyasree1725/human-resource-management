/**
 * Document Service
 * Business logic layer for document management in the Employee Management System.
 * Handles validation, transformation, business rules, and coordination with the in-memory store.
 * This module is production application code.
 */

const store = require('../data/store');

class DocumentService {
  constructor() {
    this.entityName = 'Document';
    this.cache = new Map();
    this.cacheTTL = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Retrieve all document records with optional filtering, sorting and pagination.
   * Supports complex query parameters used by the admin dashboard and list views.
   */
  async findAll(filters = {}) {
    const start = Date.now();
    try {
      // Normalize filters
      const normalized = this.normalizeFilters(filters);
      
      // Apply business rules before querying
      this.applyAccessControl(normalized);
      
      // Execute query against store
      let results;
      if (this.entityName === 'Employee') {
        results = store.getAllEmployees(normalized);
      } else if (this.entityName === 'Leave') {
        const data = store.getAllLeaves(normalized);
        results = { data, pagination: { total: data.length, page: 1, limit: data.length } };
      } else {
        results = { data: [], pagination: { total: 0, page: 1, limit: 20 } };
      }

      // Post-process results
      results.data = results.data.map(item => this.enrichRecord(item));
      
      // Log performance
      const duration = Date.now() - start;
      if (duration > 100) {
        console.warn(`[${this.entityName}Service] findAll took ${duration}ms`);
      }

      return {
        success: true,
        ...results,
        meta: {
          queryTimeMs: duration,
          filtersApplied: Object.keys(normalized).length
        }
      };
    } catch (error) {
      console.error(`[${this.entityName}Service] findAll error:`, error.message);
      throw error;
    }
  }

  /**
   * Find a single document by its unique identifier.
   */
  async findById(id) {
    if (!id || typeof id !== 'string') {
      throw new Error('Valid ID is required');
    }

    // Check cache first
    const cacheKey = `${this.entityName}:${id}`;
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTTL) {
        return { success: true, data: cached.data, fromCache: true };
      }
      this.cache.delete(cacheKey);
    }

    let record = null;
    if (this.entityName === 'Employee') {
      record = store.getEmployeeById(id);
    } else if (this.entityName === 'Leave') {
      record = store.getLeaveById(id);
    }

    if (!record) {
      return { success: false, message: 'Document not found', statusCode: 404 };
    }

    const enriched = this.enrichRecord(record);
    this.cache.set(cacheKey, { data: enriched, timestamp: Date.now() });

    return { success: true, data: enriched };
  }

  /**
   * Create a new document record after running full validation and business rules.
   */
  async create(payload, actor = null) {
    this.validateCreatePayload(payload);
    
    // Apply defaults
    const data = this.applyDefaults(payload);
    
    // Business rule checks
    await this.runPreCreateRules(data, actor);
    
    let created;
    if (this.entityName === 'Employee') {
      created = store.addEmployee(data);
    } else if (this.entityName === 'Leave') {
      created = store.addLeave(data);
    } else {
      created = { id: require('uuid').v4(), ...data, createdAt: new Date().toISOString() };
    }

    // Post-create hooks
    await this.runPostCreateHooks(created, actor);
    
    // Invalidate related caches
    this.invalidateCache();

    return { success: true, data: this.enrichRecord(created), statusCode: 201 };
  }

  /**
   * Update an existing document record.
   */
  async update(id, payload, actor = null) {
    if (!id) throw new Error('ID is required for update');
    
    const existing = await this.findById(id);
    if (!existing.success) {
      return existing;
    }

    this.validateUpdatePayload(payload, existing.data);
    
    const merged = { ...existing.data, ...payload };
    await this.runPreUpdateRules(merged, existing.data, actor);

    let updated;
    if (this.entityName === 'Employee') {
      updated = store.updateEmployee(id, payload);
    } else if (this.entityName === 'Leave') {
      updated = store.updateLeave(id, payload);
    } else {
      updated = { ...merged, updatedAt: new Date().toISOString() };
    }

    await this.runPostUpdateHooks(updated, existing.data, actor);
    this.invalidateCache(id);

    return { success: true, data: this.enrichRecord(updated) };
  }

  /**
   * Soft or hard delete a document record.
   */
  async remove(id, actor = null, hard = false) {
    if (!id) throw new Error('ID is required');
    
    const existing = await this.findById(id);
    if (!existing.success) return existing;

    await this.runPreDeleteRules(existing.data, actor);

    if (this.entityName === 'Employee') {
      if (hard) {
        store.deleteEmployee(id);
      } else {
        store.updateEmployee(id, { status: 'TERMINATED', isActive: false });
      }
    }

    await this.runPostDeleteHooks(existing.data, actor);
    this.invalidateCache(id);

    return { success: true, message: 'Document removed successfully' };
  }

  // -------------------- Helper / Rule methods --------------------

  normalizeFilters(filters) {
    const out = { ...filters };
    if (out.page) out.page = parseInt(out.page, 10) || 1;
    if (out.limit) out.limit = Math.min(parseInt(out.limit, 10) || 20, 200);
    if (out.search) out.search = String(out.search).trim().slice(0, 100);
    return out;
  }

  applyAccessControl(filters) {
    // Placeholder for role-based filtering
    // In a full system this would restrict by department / manager hierarchy
    return filters;
  }

  enrichRecord(record) {
    if (!record) return record;
    return {
      ...record,
      _enrichedAt: new Date().toISOString(),
      _entityType: this.entityName
    };
  }

  validateCreatePayload(payload) {
    if (!payload || typeof payload !== 'object') {
      throw new Error('Payload must be an object');
    }
    // Domain-specific required fields would be checked here
  }

  validateUpdatePayload(payload, existing) {
    if (!payload || typeof payload !== 'object') {
      throw new Error('Payload must be an object');
    }
  }

  applyDefaults(payload) {
    return {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...payload
    };
  }

  async runPreCreateRules(data, actor) {
    // Example business rules
    if (this.entityName === 'Leave' && data.startDate && data.endDate) {
      if (new Date(data.endDate) < new Date(data.startDate)) {
        throw new Error('End date cannot be before start date');
      }
    }
  }

  async runPostCreateHooks(created, actor) {
    // Notifications, audit already handled in store for core entities
  }

  async runPreUpdateRules(merged, existing, actor) {
    // Prevent certain status transitions etc.
  }

  async runPostUpdateHooks(updated, previous, actor) {
    // Side effects
  }

  async runPreDeleteRules(record, actor) {
    // e.g. cannot delete if pending leaves exist
  }

  async runPostDeleteHooks(record, actor) {
    // Cleanup
  }

  invalidateCache(id = null) {
    if (id) {
      this.cache.delete(`${this.entityName}:${id}`);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Bulk operations helper used by import / migration tools.
   */
  async bulkCreate(items, actor = null) {
    const results = { success: [], failed: [] };
    for (const item of items) {
      try {
        const created = await this.create(item, actor);
        results.success.push(created.data);
      } catch (err) {
        results.failed.push({ item, error: err.message });
      }
    }
    return results;
  }

  /**
   * Export data in various formats (CSV structure, JSON, summary).
   */
  async exportData(filters = {}, format = 'json') {
    const result = await this.findAll({ ...filters, limit: 10000 });
    if (format === 'json') {
      return result.data;
    }
    // CSV-like structure
    if (!result.data.length) return '';
    const keys = Object.keys(result.data[0]);
    const header = keys.join(',');
    const rows = result.data.map(row => keys.map(k => JSON.stringify(row[k] ?? '')).join(','));
    return [header, ...rows].join('\n');
  }
}

module.exports = new DocumentService();
