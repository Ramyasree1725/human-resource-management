import { generateMockEmployees, generateInitialLeaves, generateInitialAttendance, generateAttendanceForEmployeesAndDate, generateInitialWorkReports } from './mockData';
import { DEPARTMENTS } from '../constants/metaConstants';

const STORAGE_KEY = 'technova_ems_local_data_v4';

class LocalMockStore {
  constructor() {
    this.initStore();
  }

  initStore() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.employees = parsed.employees || [];
        this.leaves = parsed.leaves || [];
        this.attendance = parsed.attendance || [];
        this.workReports = parsed.workReports || [];
        this.auditLogs = parsed.auditLogs || [];
        if (this.employees.length >= 80 && this.workReports.length > 0) return;
      } catch (e) {
        console.error('Failed to parse cached store', e);
      }
    }

    // Default Seed with 80 employees
    this.employees = generateMockEmployees(80);
    this.leaves = generateInitialLeaves(this.employees);
    this.attendance = generateInitialAttendance(this.employees);
    this.workReports = generateInitialWorkReports(this.employees);
    this.auditLogs = [
      {
        id: 'log_1',
        action: 'SYSTEM_INITIALIZED',
        details: 'Initial database dataset seeded with comprehensive employee directory and activity logs.',
        timestamp: new Date().toISOString()
      }
    ];
    this.persist();
  }

  persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        employees: this.employees,
        leaves: this.leaves,
        attendance: this.attendance,
        workReports: this.workReports,
        auditLogs: this.auditLogs
      }));
    } catch (e) {
      console.warn('LocalStorage limit reached', e);
    }
  }

  // Dashboard Stats
  getDashboardStats() {
    const totalEmployees = this.employees.length;
    const activeEmployees = this.employees.filter(e => e.status === 'ACTIVE' || e.status === 'ON_PROBATION').length;
    const onLeave = this.employees.filter(e => e.status === 'ON_LEAVE').length;
    const pendingLeaves = this.leaves.filter(l => l.status === 'PENDING').length;

    const departmentDistribution = {};
    DEPARTMENTS.forEach(dept => {
      departmentDistribution[dept.id] = this.employees.filter(e => e.departmentId === dept.id).length;
    });

    const statusDistribution = {};
    ['ACTIVE', 'ON_PROBATION', 'ON_LEAVE', 'NOTICE_PERIOD', 'INACTIVE', 'TERMINATED'].forEach(st => {
      statusDistribution[st] = this.employees.filter(e => e.status === st).length;
    });

    const totalMonthlyPayroll = this.employees.reduce((acc, curr) => acc + (curr.salary ? Math.round(curr.salary / 12) : 0), 0);

    return {
      totalEmployees,
      activeEmployees,
      onLeave,
      pendingLeaves,
      totalMonthlyPayroll,
      departmentDistribution,
      statusDistribution,
      lastUpdated: new Date().toISOString()
    };
  }

  // Employee Methods
  getAllEmployees(filters = {}) {
    let result = [...this.employees];

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(e =>
        `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
        (e.email && e.email.toLowerCase().includes(q)) ||
        (e.employeeId && e.employeeId.toLowerCase().includes(q)) ||
        (e.designation && e.designation.toLowerCase().includes(q)) ||
        (e.phone && e.phone.includes(q))
      );
    }

    // 1. Department Filter
    if (filters.departmentId && filters.departmentId !== 'ALL') {
      const deptFilter = String(filters.departmentId).toLowerCase();
      result = result.filter(e =>
        (e.departmentId && e.departmentId.toLowerCase() === deptFilter) ||
        (e.department && e.department.toLowerCase() === deptFilter) ||
        (e.departmentCode && e.departmentCode.toLowerCase() === deptFilter)
      );
    }

    // 2. Status Filter
    if (filters.status && filters.status !== 'ALL') {
      const statusFilter = String(filters.status).toLowerCase().replace(/[\s_-]+/g, '');
      result = result.filter(e => {
        const empStatus = String(e.status || '').toLowerCase().replace(/[\s_-]+/g, '');
        return empStatus === statusFilter;
      });
    }

    // 3. Employment Type Filter
    if (filters.employmentType && filters.employmentType !== 'ALL') {
      const typeFilter = String(filters.employmentType).toLowerCase().replace(/[\s_-]+/g, '');
      result = result.filter(e => {
        const empType = String(e.employmentType || '').toLowerCase().replace(/[\s_-]+/g, '');
        return empType === typeFilter;
      });
    }

    // 4. Location Filter
    if (filters.locationId && filters.locationId !== 'ALL') {
      const locFilter = String(filters.locationId).toLowerCase().replace(/[\s_-]+/g, '');
      result = result.filter(e => {
        const locId = String(e.workLocationId || '').toLowerCase().replace(/[\s_-]+/g, '');
        const locCity = String(e.location || e.workLocationName || '').toLowerCase().replace(/[\s_-]+/g, '');
        return locId === locFilter || locCity.includes(locFilter) || locFilter.includes(locCity);
      });
    }

    // Sort
    if (filters.sortBy) {
      const dir = filters.sortDir === 'desc' ? -1 : 1;
      result.sort((a, b) => {
        let valA = a[filters.sortBy];
        let valB = b[filters.sortBy];
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA < valB) return -1 * dir;
        if (valA > valB) return 1 * dir;
        return 0;
      });
    }

    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const total = result.length;
    const start = (page - 1) * limit;
    const data = result.slice(start, start + limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    };
  }

  getEmployeeById(id) {
    return this.employees.find(e => e.id === id || e.employeeId === id) || null;
  }

  addEmployee(employeeData) {
    const nextNum = this.employees.length + 1001;
    const employeeId = `EMP${String(nextNum).padStart(5, '0')}`;
    const newEmp = {
      id: `emp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      employeeId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'ACTIVE',
      ...employeeData
    };
    this.employees.unshift(newEmp);

    this.auditLogs.unshift({
      id: `log_${Date.now()}`,
      action: 'EMPLOYEE_CREATED',
      details: `Added new employee ${newEmp.firstName} ${newEmp.lastName} (${newEmp.employeeId})`,
      timestamp: new Date().toISOString()
    });

    this.persist();
    return newEmp;
  }

  updateEmployee(id, updates) {
    const idx = this.employees.findIndex(e => e.id === id || e.employeeId === id);
    if (idx === -1) return null;

    this.employees[idx] = {
      ...this.employees[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.auditLogs.unshift({
      id: `log_${Date.now()}`,
      action: 'EMPLOYEE_UPDATED',
      details: `Updated details for ${this.employees[idx].firstName} ${this.employees[idx].lastName} (${this.employees[idx].employeeId})`,
      timestamp: new Date().toISOString()
    });

    this.persist();
    return this.employees[idx];
  }

  deleteEmployee(id) {
    const idx = this.employees.findIndex(e => e.id === id || e.employeeId === id);
    if (idx === -1) return false;

    const removed = this.employees.splice(idx, 1)[0];
    this.auditLogs.unshift({
      id: `log_${Date.now()}`,
      action: 'EMPLOYEE_DELETED',
      details: `Removed employee ${removed.firstName} ${removed.lastName} (${removed.employeeId})`,
      timestamp: new Date().toISOString()
    });

    this.persist();
    return true;
  }

  // Leave Management
  getAllLeaves(filters = {}) {
    let result = [...this.leaves];
    if (filters.status && filters.status !== 'ALL') {
      result = result.filter(l => l.status === filters.status);
    }
    if (filters.employeeId) {
      result = result.filter(l => l.employeeId === filters.employeeId);
    }
    return result;
  }

  addLeave(leaveData) {
    const emp = this.getEmployeeById(leaveData.employeeId);
    const newLeave = {
      id: `lv_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      leaveId: `LV${String(5000 + this.leaves.length + 1).padStart(6, '0')}`,
      createdAt: new Date().toISOString(),
      status: 'PENDING',
      employeeName: emp ? `${emp.firstName} ${emp.lastName}` : leaveData.employeeName || 'Unknown Employee',
      departmentId: emp ? emp.departmentId : 'dept_eng_001',
      ...leaveData
    };
    this.leaves.unshift(newLeave);

    this.auditLogs.unshift({
      id: `log_${Date.now()}`,
      action: 'LEAVE_APPLIED',
      details: `${newLeave.employeeName} applied for ${newLeave.leaveType} leave (${newLeave.days} days).`,
      timestamp: new Date().toISOString()
    });

    this.persist();
    return newLeave;
  }

  updateLeaveStatus(leaveId, status, managerNotes = '') {
    const idx = this.leaves.findIndex(l => l.id === leaveId || l.leaveId === leaveId);
    if (idx === -1) return null;

    this.leaves[idx].status = status;
    this.leaves[idx].managerNotes = managerNotes;
    this.leaves[idx].updatedAt = new Date().toISOString();

    this.auditLogs.unshift({
      id: `log_${Date.now()}`,
      action: `LEAVE_${status}`,
      details: `Leave request ${this.leaves[idx].leaveId} for ${this.leaves[idx].employeeName} was marked as ${status}.`,
      timestamp: new Date().toISOString()
    });

    this.persist();
    return this.leaves[idx];
  }

  // Attendance Management
  getAllAttendance(date) {
    const targetDate = date || new Date().toISOString().split('T')[0];
    let records = this.attendance.filter(a => a.date === targetDate);

    // If no records exist for this specific date yet, dynamically generate and store them!
    if (records.length === 0 && this.employees.length > 0) {
      records = generateAttendanceForEmployeesAndDate(this.employees, targetDate);
      this.attendance.push(...records);
      this.persist();
    }

    return records;
  }

  markAttendance(record) {
    const emp = this.getEmployeeById(record.employeeId);
    const targetDate = record.date || new Date().toISOString().split('T')[0];
    const existingIdx = this.attendance.findIndex(a => a.employeeId === record.employeeId && a.date === targetDate);

    const formatted = {
      id: existingIdx !== -1 ? this.attendance[existingIdx].id : `att_${targetDate}_${record.employeeId}`,
      employeeId: record.employeeId,
      employeeName: emp ? `${emp.firstName} ${emp.lastName}` : (record.employeeName || 'Employee'),
      departmentId: emp ? emp.departmentId : 'dept_eng_001',
      date: targetDate,
      status: record.status || 'PRESENT',
      checkIn: record.checkIn || '09:30 AM',
      checkOut: record.checkOut || '06:30 PM',
      workLocation: record.workLocation || 'Office',
      hoursWorked: record.hoursWorked !== undefined ? record.hoursWorked : 8.5
    };

    if (existingIdx !== -1) {
      this.attendance[existingIdx] = formatted;
    } else {
      this.attendance.unshift(formatted);
    }

    this.persist();
    return formatted;
  }

  // Work Reports & Daily Standup Submission
  getAllWorkReports(filters = {}) {
    let result = [...this.workReports];

    if (filters.date) {
      result = result.filter(r => r.date === filters.date);
    }
    if (filters.slot && filters.slot !== 'ALL') {
      result = result.filter(r => r.slot === filters.slot);
    }
    if (filters.departmentId && filters.departmentId !== 'ALL') {
      result = result.filter(r => r.departmentId === filters.departmentId);
    }
    if (filters.employeeId) {
      result = result.filter(r => r.employeeId === filters.employeeId);
    }
    if (filters.status && filters.status !== 'ALL') {
      result = result.filter(r => r.status === filters.status);
    }

    return result;
  }

  addWorkReport(reportData) {
    const emp = this.getEmployeeById(reportData.employeeId);
    const targetDate = reportData.date || new Date().toISOString().split('T')[0];
    const isMorning = reportData.slot === 'MORNING_TO_AFTERNOON';

    const newReport = {
      id: `wr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      employeeId: reportData.employeeId,
      employeeName: emp ? `${emp.firstName} ${emp.lastName}` : (reportData.employeeName || 'Staff Member'),
      departmentId: emp ? emp.departmentId : (reportData.departmentId || 'dept_eng_001'),
      designation: emp ? emp.designation : 'Specialist',
      date: targetDate,
      slot: reportData.slot || 'MORNING_TO_AFTERNOON',
      slotLabel: isMorning ? 'Morning to Afternoon (First Half)' : 'Afternoon to Evening / EOD (Second Half)',
      timeWindow: isMorning ? '09:30 AM - 01:30 PM' : '02:00 PM - 06:30 PM',
      taskTitle: reportData.taskTitle || 'Daily Task Updates',
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

    this.workReports.unshift(newReport);
    this.auditLogs.unshift({
      id: `log_${Date.now()}`,
      action: 'WORK_REPORT_SUBMITTED',
      details: `${newReport.employeeName} submitted ${newReport.slotLabel} work update for ${targetDate}`,
      timestamp: new Date().toISOString()
    });

    this.persist();
    return newReport;
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

    this.auditLogs.unshift({
      id: `log_${Date.now()}`,
      action: 'WORK_REPORT_REVIEWED',
      details: `${reviewerName} reviewed work report of ${this.workReports[idx].employeeName}`,
      timestamp: new Date().toISOString()
    });

    this.persist();
    return this.workReports[idx];
  }

  // Bulk Generator
  generateDataset(count = 60) {
    const newEmployees = generateMockEmployees(count);
    this.employees = newEmployees;
    this.leaves = generateInitialLeaves(newEmployees);
    this.attendance = generateInitialAttendance(newEmployees);
    this.auditLogs.unshift({
      id: `log_${Date.now()}`,
      action: 'BULK_DATA_GENERATED',
      details: `Regenerated fresh dataset with ${count} employees and activity records.`,
      timestamp: new Date().toISOString()
    });
    this.persist();
    return { count: this.employees.length };
  }

  resetToDefault() {
    localStorage.removeItem(STORAGE_KEY);
    this.initStore();
    return true;
  }
}

export const localStore = new LocalMockStore();
