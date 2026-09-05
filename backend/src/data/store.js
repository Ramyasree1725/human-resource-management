/**
 * In-Memory Data Store
 * Central store for all application data since no database is used.
 * Supports employees, leaves, attendance, departments, users, and audit logs.
 */

const { v4: uuidv4 } = require('uuid');

class InMemoryStore {
  constructor() {
    this.employees = [];
    this.leaves = [];
    this.attendance = [];
    this.workReports = [];
    this.users = [];
    this.departments = [];
    this.auditLogs = [];
    this.performanceReviews = [];
    this.notifications = [];
    this.settings = {
      companyName: 'TechNova Solutions Pvt Ltd',
      companyCode: 'TECHNOVA',
      fiscalYearStart: '04-01',
      defaultWorkingHours: { start: '09:30', end: '18:30' },
      weekendDays: [0, 6], // Sunday, Saturday
      leaveYearStart: '01-01',
      maxEmployees: 10000
    };
    this.counters = {
      employee: 1000,
      leave: 5000,
      attendance: 10000,
      user: 100
    };
  }

  // ==================== EMPLOYEE METHODS ====================

  generateEmployeeId() {
    this.counters.employee += 1;
    return `EMP${String(this.counters.employee).padStart(5, '0')}`;
  }

  addEmployee(employeeData) {
    const employee = {
      id: uuidv4(),
      employeeId: this.generateEmployeeId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...employeeData
    };
    this.employees.push(employee);
    this.addAuditLog({
      action: 'EMPLOYEE_CREATED',
      entityType: 'employee',
      entityId: employee.id,
      details: { employeeId: employee.employeeId, name: `${employee.firstName} ${employee.lastName}` }
    });
    return employee;
  }

  getEmployeeById(id) {
    return this.employees.find(e => e.id === id) || null;
  }

  getEmployeeByEmployeeId(employeeId) {
    return this.employees.find(e => e.employeeId === employeeId) || null;
  }

  getEmployeeByEmail(email) {
    return this.employees.find(e => e.email && e.email.toLowerCase() === email.toLowerCase()) || null;
  }

  updateEmployee(id, updates) {
    const index = this.employees.findIndex(e => e.id === id);
    if (index === -1) return null;
    this.employees[index] = {
      ...this.employees[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.addAuditLog({
      action: 'EMPLOYEE_UPDATED',
      entityType: 'employee',
      entityId: id,
      details: { fields: Object.keys(updates) }
    });
    return this.employees[index];
  }

  deleteEmployee(id) {
    const index = this.employees.findIndex(e => e.id === id);
    if (index === -1) return false;
    const removed = this.employees.splice(index, 1)[0];
    this.addAuditLog({
      action: 'EMPLOYEE_DELETED',
      entityType: 'employee',
      entityId: id,
      details: { employeeId: removed.employeeId }
    });
    return true;
  }

  getAllEmployees(filters = {}) {
    let result = [...this.employees];

    if (filters.status && filters.status !== 'ALL') {
      const statusFilter = String(filters.status).toLowerCase().replace(/[\s_-]+/g, '');
      result = result.filter(e => {
        const empStatus = String(e.status || '').toLowerCase().replace(/[\s_-]+/g, '');
        return empStatus === statusFilter;
      });
    }

    if (filters.departmentId && filters.departmentId !== 'ALL') {
      const deptFilter = String(filters.departmentId).toLowerCase();
      result = result.filter(e =>
        (e.departmentId && e.departmentId.toLowerCase() === deptFilter) ||
        (e.departmentCode && e.departmentCode.toLowerCase() === deptFilter) ||
        (e.department && e.department.toLowerCase() === deptFilter)
      );
    }

    if (filters.employmentType && filters.employmentType !== 'ALL') {
      const typeFilter = String(filters.employmentType).toLowerCase().replace(/[\s_-]+/g, '');
      result = result.filter(e => {
        const empType = String(e.employmentType || '').toLowerCase().replace(/[\s_-]+/g, '');
        return empType === typeFilter;
      });
    }

    if (filters.locationId && filters.locationId !== 'ALL') {
      const locFilter = String(filters.locationId).toLowerCase().replace(/[\s_-]+/g, '');
      result = result.filter(e => {
        const locId = String(e.workLocationId || '').toLowerCase().replace(/[\s_-]+/g, '');
        const locCity = String(e.location || e.workLocationName || '').toLowerCase().replace(/[\s_-]+/g, '');
        return locId === locFilter || locCity.includes(locFilter) || locFilter.includes(locCity);
      });
    }

    if (filters.managerId) {
      result = result.filter(e => e.managerId === filters.managerId);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(e =>
        (e.firstName && e.firstName.toLowerCase().includes(q)) ||
        (e.lastName && e.lastName.toLowerCase().includes(q)) ||
        (e.email && e.email.toLowerCase().includes(q)) ||
        (e.employeeId && e.employeeId.toLowerCase().includes(q)) ||
        (e.phone && e.phone.includes(q))
      );
    }

    if (filters.minSalary !== undefined) {
      result = result.filter(e => e.salary >= filters.minSalary);
    }

    if (filters.maxSalary !== undefined) {
      result = result.filter(e => e.salary <= filters.maxSalary);
    }

    // Sorting
    if (filters.sortBy) {
      const dir = filters.sortDir === 'desc' ? -1 : 1;
      result.sort((a, b) => {
        const aVal = a[filters.sortBy];
        const bVal = b[filters.sortBy];
        if (aVal < bVal) return -1 * dir;
        if (aVal > bVal) return 1 * dir;
        return 0;
      });
    }

    // Pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 20;
    const total = result.length;
    const start = (page - 1) * limit;
    const data = result.slice(start, start + limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    };
  }

  getEmployeeCountByDepartment() {
    const counts = {};
    this.employees.forEach(e => {
      const dept = e.departmentId || 'unknown';
      counts[dept] = (counts[dept] || 0) + 1;
    });
    return counts;
  }

  getEmployeeCountByStatus() {
    const counts = {};
    this.employees.forEach(e => {
      const status = e.status || 'unknown';
      counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
  }

  // ==================== LEAVE METHODS ====================

  generateLeaveId() {
    this.counters.leave += 1;
    return `LV${String(this.counters.leave).padStart(6, '0')}`;
  }

  addLeave(leaveData) {
    const leave = {
      id: uuidv4(),
      leaveId: this.generateLeaveId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'PENDING',
      ...leaveData
    };
    this.leaves.push(leave);
    this.addAuditLog({
      action: 'LEAVE_CREATED',
      entityType: 'leave',
      entityId: leave.id,
      details: { leaveId: leave.leaveId, employeeId: leave.employeeId }
    });
    return leave;
  }

  getLeaveById(id) {
    return this.leaves.find(l => l.id === id) || null;
  }

  updateLeave(id, updates) {
    const index = this.leaves.findIndex(l => l.id === id);
    if (index === -1) return null;
    this.leaves[index] = {
      ...this.leaves[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return this.leaves[index];
  }

  getLeavesByEmployee(employeeId) {
    return this.leaves.filter(l => l.employeeId === employeeId);
  }

  getAllLeaves(filters = {}) {
    let result = [...this.leaves];
    if (filters.status) result = result.filter(l => l.status === filters.status);
    if (filters.employeeId) result = result.filter(l => l.employeeId === filters.employeeId);
    if (filters.leaveType) result = result.filter(l => l.leaveType === filters.leaveType);
    return result;
  }

  // ==================== ATTENDANCE METHODS ====================

  addAttendance(record) {
    const attendance = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      ...record
    };
    this.attendance.push(attendance);
    return attendance;
  }

  getAttendanceByEmployee(employeeId, startDate, endDate) {
    return this.attendance.filter(a => {
      if (a.employeeId !== employeeId) return false;
      if (startDate && a.date < startDate) return false;
      if (endDate && a.date > endDate) return false;
      return true;
    });
  }

  // ==================== USER / AUTH METHODS ====================

  addUser(userData) {
    const user = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      ...userData
    };
    this.users.push(user);
    return user;
  }

  getUserByEmail(email) {
    return this.users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  getUserById(id) {
    return this.users.find(u => u.id === id) || null;
  }

  // ==================== AUDIT LOG ====================

  addAuditLog(logData) {
    const log = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      ...logData
    };
    this.auditLogs.push(log);
    // Keep only last 5000 logs to prevent memory issues
    if (this.auditLogs.length > 5000) {
      this.auditLogs = this.auditLogs.slice(-5000);
    }
    return log;
  }

  getAuditLogs(limit = 100) {
    return this.auditLogs.slice(-limit).reverse();
  }

  // ==================== WORK REPORTS (TWICE DAILY) ====================

  addWorkReport(reportData) {
    const employee = this.getEmployeeById(reportData.employeeId);
    const targetDate = reportData.date || new Date().toISOString().split('T')[0];
    const isMorning = reportData.slot === 'MORNING_TO_AFTERNOON';

    const report = {
      id: uuidv4(),
      employeeId: reportData.employeeId,
      employeeName: employee ? `${employee.firstName} ${employee.lastName}` : (reportData.employeeName || 'Staff Member'),
      departmentId: employee ? employee.departmentId : (reportData.departmentId || 'dept_eng_001'),
      designation: employee ? employee.designation : 'Specialist',
      date: targetDate,
      slot: reportData.slot || 'MORNING_TO_AFTERNOON',
      slotLabel: isMorning ? 'Morning to Afternoon (First Half)' : 'Afternoon to Evening / EOD (Second Half)',
      timeWindow: isMorning ? '09:30 AM - 01:30 PM' : '02:00 PM - 06:30 PM',
      taskTitle: reportData.taskTitle || 'Daily Task Update',
      taskDescription: reportData.taskDescription || '',
      deliverables: reportData.deliverables || '',
      hoursSpent: parseFloat(reportData.hoursSpent) || (isMorning ? 4.0 : 4.5),
      status: reportData.status || 'COMPLETED',
      blockers: reportData.blockers || 'None',
      submittedAt: new Date().toISOString(),
      managerReview: {
        status: 'PENDING',
        feedback: '',
        reviewedBy: ''
      }
    };

    this.workReports.unshift(report);
    this.addAuditLog('WORK_REPORT_SUBMITTED', `${report.employeeName} submitted ${report.slotLabel} for ${targetDate}`);
    return report;
  }

  getAllWorkReports(filters = {}) {
    let result = [...this.workReports];
    if (filters.date) result = result.filter(r => r.date === filters.date);
    if (filters.slot && filters.slot !== 'ALL') result = result.filter(r => r.slot === filters.slot);
    if (filters.departmentId && filters.departmentId !== 'ALL') result = result.filter(r => r.departmentId === filters.departmentId);
    if (filters.employeeId) result = result.filter(r => r.employeeId === filters.employeeId);
    if (filters.status && filters.status !== 'ALL') result = result.filter(r => r.status === filters.status);
    return result;
  }

  reviewWorkReport(id, feedback = '', reviewerName = 'Office Head') {
    const idx = this.workReports.findIndex(r => r.id === id);
    if (idx === -1) return null;

    this.workReports[idx].managerReview = {
      status: 'REVIEWED',
      feedback,
      reviewedBy: reviewerName,
      reviewedAt: new Date().toISOString()
    };

    this.addAuditLog('WORK_REPORT_REVIEWED', `${reviewerName} reviewed work report of ${this.workReports[idx].employeeName}`);
    return this.workReports[idx];
  }

  // ==================== STATS ====================

  getDashboardStats() {
    const totalEmployees = this.employees.length;
    const activeEmployees = this.employees.filter(e => e.status === 'ACTIVE' || e.status === 'ON_PROBATION').length;
    const onLeave = this.employees.filter(e => e.status === 'ON_LEAVE').length;
    const pendingLeaves = this.leaves.filter(l => l.status === 'PENDING').length;
    const deptCounts = this.getEmployeeCountByDepartment();
    const statusCounts = this.getEmployeeCountByStatus();

    return {
      totalEmployees,
      activeEmployees,
      onLeave,
      pendingLeaves,
      departmentDistribution: deptCounts,
      statusDistribution: statusCounts,
      lastUpdated: new Date().toISOString()
    };
  }

  // ==================== BULK OPERATIONS ====================

  bulkAddEmployees(employeesArray) {
    const added = [];
    employeesArray.forEach(emp => {
      added.push(this.addEmployee(emp));
    });
    return added;
  }

  clearAllData() {
    this.employees = [];
    this.leaves = [];
    this.attendance = [];
    this.users = [];
    this.auditLogs = [];
    this.performanceReviews = [];
    this.notifications = [];
    this.counters = {
      employee: 1000,
      leave: 5000,
      attendance: 10000,
      user: 100
    };
  }
}

// Singleton instance
const store = new InMemoryStore();

module.exports = store;
