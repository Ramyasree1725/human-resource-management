/**
 * Employee Management System - Backend Server
 * Express server with in-memory storage
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const store = require('./data/store');
const { generateLargeDataset } = require('./data/generateLargeData');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ==================== HEALTH & INFO ====================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    employees: store.employees.length,
    leaves: store.leaves.length,
    attendance: store.attendance.length
  });
});

app.get('/api/info', (req, res) => {
  res.json({
    name: 'Employee Management System API',
    version: '1.0.0',
    storage: 'In-Memory',
    company: store.settings.companyName
  });
});

// ==================== DASHBOARD ====================

app.get('/api/dashboard/stats', (req, res) => {
  try {
    const stats = store.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== EMPLOYEES ====================

app.get('/api/employees', (req, res) => {
  try {
    const result = store.getAllEmployees(req.query);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/employees/:id', (req, res) => {
  try {
    const employee = store.getEmployeeById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, data: employee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/employees', (req, res) => {
  try {
    const employee = store.addEmployee(req.body);
    res.status(201).json({ success: true, data: employee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/employees/:id', (req, res) => {
  try {
    const employee = store.updateEmployee(req.params.id, req.body);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, data: employee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/employees/:id', (req, res) => {
  try {
    const deleted = store.deleteEmployee(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== LEAVES ====================

app.get('/api/leaves', (req, res) => {
  try {
    const leaves = store.getAllLeaves(req.query);
    res.json({ success: true, data: leaves });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/leaves', (req, res) => {
  try {
    const leave = store.addLeave(req.body);
    res.status(201).json({ success: true, data: leave });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/leaves/:id', (req, res) => {
  try {
    const leave = store.updateLeave(req.params.id, req.body);
    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave not found' });
    }
    res.json({ success: true, data: leave });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/leaves/employee/:employeeId', (req, res) => {
  try {
    const leaves = store.getLeavesByEmployee(req.params.employeeId);
    res.json({ success: true, data: leaves });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== ATTENDANCE ====================

app.get('/api/attendance', (req, res) => {
  try {
    const targetDate = req.query.date || new Date().toISOString().split('T')[0];
    let records = store.attendance.filter(a => a.date === targetDate);
    if (records.length === 0 && store.employees.length > 0) {
      const { generateAttendanceForEmployee } = require('./data/generateLargeData');
      const sample = store.employees.filter(e => e.isActive).slice(0, 100);
      sample.forEach(emp => {
        const gen = generateAttendanceForEmployee(emp, 1);
        gen.forEach(r => {
          r.date = targetDate;
          store.addAttendance(r);
        });
      });
      records = store.attendance.filter(a => a.date === targetDate);
    }
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/attendance/employee/:employeeId', (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const records = store.getAttendanceByEmployee(req.params.employeeId, startDate, endDate);
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/attendance', (req, res) => {
  try {
    const record = store.addAttendance(req.body);
    res.status(201).json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== WORK REPORTS (TWICE DAILY) ====================

app.get('/api/work-reports', (req, res) => {
  try {
    const reports = store.getAllWorkReports(req.query);
    res.json({ success: true, data: reports });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/work-reports', (req, res) => {
  try {
    const report = store.addWorkReport(req.body);
    res.status(201).json({ success: true, data: report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/work-reports/:id/review', (req, res) => {
  try {
    const { feedback, reviewerName } = req.body;
    const report = store.reviewWorkReport(req.params.id, feedback, reviewerName || 'Office Head');
    if (!report) {
      return res.status(404).json({ success: false, message: 'Work report not found' });
    }
    res.json({ success: true, data: report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== DEPARTMENTS ====================

app.get('/api/departments', (req, res) => {
  try {
    const { DEPARTMENT_LIST, DEPARTMENT_HIERARCHY } = require('./constants/departments');
    res.json({
      success: true,
      data: DEPARTMENT_LIST,
      hierarchy: DEPARTMENT_HIERARCHY
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== CONSTANTS / META ====================

app.get('/api/meta', (req, res) => {
  try {
    const statusConsts = require('./constants/employeeStatus');
    const deptConsts = require('./constants/departments');
    res.json({
      success: true,
      data: {
        employmentTypes: statusConsts.EMPLOYMENT_TYPES,
        employeeStatuses: statusConsts.EMPLOYEE_STATUSES,
        workLocations: statusConsts.WORK_LOCATIONS,
        leaveTypes: statusConsts.LEAVE_TYPES,
        roles: statusConsts.ROLES,
        genders: statusConsts.GENDERS,
        departments: deptConsts.DEPARTMENT_LIST
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== DATA GENERATION ====================

app.post('/api/admin/generate-data', (req, res) => {
  try {
    const count = parseInt(req.body.count) || 2000;
    const result = generateLargeDataset(count);
    res.json({
      success: true,
      message: `Generated ${count} employees and related data`,
      data: result
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/admin/audit-logs', (req, res) => {
  try {
    const logs = store.getAuditLogs(parseInt(req.query.limit) || 100);
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== START ====================

// Auto-generate some data on startup if empty
if (store.employees.length === 0) {
  console.log('No data found. Generating initial dataset (1500 employees)...');
  generateLargeDataset(1500);
}

app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`  Employee Management System Backend`);
  console.log(`  Running on http://localhost:${PORT}`);
  console.log(`  Employees loaded: ${store.employees.length}`);
  console.log(`========================================\n`);
});

module.exports = app;
