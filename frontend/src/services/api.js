import { localStore } from './mockStore';

const PRIMARY_URL = '/api';
const BACKUP_URL = 'http://localhost:5000/api';

async function fetchWithFallback(endpoint, options = {}, fallbackFn) {
  // Try relative proxy first, then direct port 5000
  const urlsToTry = [
    `${PRIMARY_URL}${endpoint}`,
    `${BACKUP_URL}${endpoint}`
  ];

  for (const url of urlsToTry) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const json = await res.json();
        return { success: true, fromServer: true, ...json };
      }
    } catch (err) {
      // Try next or fall back
    }
  }

  // Fallback to local store (100% crash-proof offline mode)
  const data = fallbackFn();
  return { success: true, fromServer: false, ...(data && data.data !== undefined ? data : { data }) };
}

export const api = {
  // Check backend server status
  async checkHealth() {
    for (const base of [PRIMARY_URL, BACKUP_URL]) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1000);
        const res = await fetch(`${base}/health`, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) return { connected: true, data: await res.json() };
      } catch (e) {}
    }
    return { connected: false, data: null };
  },

  // Dashboard Stats
  async getDashboardStats() {
    return fetchWithFallback('/dashboard/stats', {}, () => ({
      data: localStore.getDashboardStats()
    }));
  },

  // Employees
  async getEmployees(params = {}) {
    const query = new URLSearchParams(params).toString();
    return fetchWithFallback(`/employees?${query}`, {}, () => {
      return localStore.getAllEmployees(params);
    });
  },

  async getEmployeeById(id) {
    return fetchWithFallback(`/employees/${id}`, {}, () => ({
      data: localStore.getEmployeeById(id)
    }));
  },

  async createEmployee(employeeData) {
    try {
      const res = await fetch(`${BACKUP_URL}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeData)
      });
      if (res.ok) {
        const json = await res.json();
        localStore.addEmployee(employeeData);
        return json;
      }
    } catch (e) {}
    const created = localStore.addEmployee(employeeData);
    return { success: true, fromServer: false, data: created };
  },

  async updateEmployee(id, employeeData) {
    try {
      const res = await fetch(`${BACKUP_URL}/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeData)
      });
      if (res.ok) {
        const json = await res.json();
        localStore.updateEmployee(id, employeeData);
        return json;
      }
    } catch (e) {}
    const updated = localStore.updateEmployee(id, employeeData);
    return { success: true, fromServer: false, data: updated };
  },

  async deleteEmployee(id) {
    try {
      const res = await fetch(`${BACKUP_URL}/employees/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        localStore.deleteEmployee(id);
        return await res.json();
      }
    } catch (e) {}
    const deleted = localStore.deleteEmployee(id);
    return { success: deleted, fromServer: false };
  },

  // Leaves
  async getLeaves(params = {}) {
    const query = new URLSearchParams(params).toString();
    return fetchWithFallback(`/leaves?${query}`, {}, () => ({
      data: localStore.getAllLeaves(params)
    }));
  },

  async applyLeave(leaveData) {
    try {
      const res = await fetch(`${BACKUP_URL}/leaves`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leaveData)
      });
      if (res.ok) {
        const json = await res.json();
        localStore.addLeave(leaveData);
        return json;
      }
    } catch (e) {}
    const created = localStore.addLeave(leaveData);
    return { success: true, fromServer: false, data: created };
  },

  async updateLeaveStatus(id, status, notes = '') {
    try {
      const res = await fetch(`${BACKUP_URL}/leaves/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, managerNotes: notes })
      });
      if (res.ok) {
        localStore.updateLeaveStatus(id, status, notes);
        return await res.json();
      }
    } catch (e) {}
    const updated = localStore.updateLeaveStatus(id, status, notes);
    return { success: true, fromServer: false, data: updated };
  },

  // Attendance
  async getAttendance(date) {
    const query = date ? `?date=${encodeURIComponent(date)}` : '';
    return fetchWithFallback(`/attendance${query}`, {}, () => {
      return { data: localStore.getAllAttendance(date) };
    });
  },

  async markAttendance(record) {
    try {
      const res = await fetch(`${BACKUP_URL}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });
      if (res.ok) {
        localStore.markAttendance(record);
        return await res.json();
      }
    } catch (e) {}
    const saved = localStore.markAttendance(record);
    return { success: true, fromServer: false, data: saved };
  },

  // Admin Data Generation
  async generateDataset(count = 50) {
    try {
      const res = await fetch(`${BACKUP_URL}/admin/generate-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count })
      });
      if (res.ok) {
        localStore.generateDataset(count);
        return await res.json();
      }
    } catch (e) {}
    const res = localStore.generateDataset(count);
    return { success: true, fromServer: false, message: `Generated ${count} records`, data: res };
  },

  // Audit Logs
  async getAuditLogs() {
    return {
      success: true,
      data: localStore.auditLogs
    };
  },

  // Work Reports (Morning & Afternoon Updates)
  async getWorkReports(params = {}) {
    return {
      success: true,
      data: localStore.getAllWorkReports(params)
    };
  },

  async submitWorkReport(reportData) {
    const saved = localStore.addWorkReport(reportData);
    return {
      success: true,
      data: saved
    };
  },

  async reviewWorkReport(id, feedback = '', reviewerName = 'Office Head') {
    const updated = localStore.reviewWorkReport(id, feedback, reviewerName);
    return {
      success: true,
      data: updated
    };
  },

  // Reset
  resetData() {
    localStore.resetToDefault();
    return { success: true };
  }
};
