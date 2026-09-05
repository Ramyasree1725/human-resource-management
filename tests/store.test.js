/**
 * Basic unit tests for Employee Management System core modules.
 * Run with: npx jest (or node --test on Node 18+)
 */

const store = require('../backend/src/data/store');

describe('InMemoryStore', () => {
  beforeEach(() => {
    store.clearAllData();
  });

  test('addEmployee creates a record with id and employeeId', () => {
    const emp = store.addEmployee({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      status: 'ACTIVE'
    });
    expect(emp).toBeDefined();
    expect(emp.id).toBeDefined();
    expect(emp.employeeId).toMatch(/^EMP/);
    expect(emp.firstName).toBe('Test');
  });

  test('getEmployeeById returns the correct employee', () => {
    const emp = store.addEmployee({ firstName: 'A', lastName: 'B', email: 'a@b.com' });
    const found = store.getEmployeeById(emp.id);
    expect(found).not.toBeNull();
    expect(found.email).toBe('a@b.com');
  });

  test('getAllEmployees supports search filter', () => {
    store.addEmployee({ firstName: 'Alice', lastName: 'Smith', email: 'alice@co.com', status: 'ACTIVE' });
    store.addEmployee({ firstName: 'Bob', lastName: 'Jones', email: 'bob@co.com', status: 'ACTIVE' });
    const result = store.getAllEmployees({ search: 'alice' });
    expect(result.data.length).toBeGreaterThanOrEqual(1);
    expect(result.data[0].firstName).toBe('Alice');
  });

  test('updateEmployee modifies fields', () => {
    const emp = store.addEmployee({ firstName: 'Old', lastName: 'Name', email: 'old@co.com' });
    const updated = store.updateEmployee(emp.id, { firstName: 'New' });
    expect(updated.firstName).toBe('New');
  });

  test('deleteEmployee removes the record', () => {
    const emp = store.addEmployee({ firstName: 'X', lastName: 'Y', email: 'x@y.com' });
    const ok = store.deleteEmployee(emp.id);
    expect(ok).toBe(true);
    expect(store.getEmployeeById(emp.id)).toBeNull();
  });

  test('dashboard stats return expected shape', () => {
    store.addEmployee({ firstName: 'A', lastName: 'B', email: 'a@b.com', status: 'ACTIVE' });
    const stats = store.getDashboardStats();
    expect(stats.totalEmployees).toBe(1);
    expect(stats).toHaveProperty('activeEmployees');
    expect(stats).toHaveProperty('departmentDistribution');
  });
});

describe('Leave operations', () => {
  beforeEach(() => store.clearAllData());

  test('addLeave creates a leave request', () => {
    const emp = store.addEmployee({ firstName: 'L', lastName: 'E', email: 'l@e.com' });
    const leave = store.addLeave({
      employeeId: emp.id,
      leaveType: 'ANNUAL',
      startDate: '2026-09-01',
      endDate: '2026-09-05',
      days: 5,
      reason: 'Vacation'
    });
    expect(leave.id).toBeDefined();
    expect(leave.status).toBe('PENDING');
  });
});
