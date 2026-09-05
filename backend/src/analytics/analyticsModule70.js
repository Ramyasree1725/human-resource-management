/**
 * Analytics Module 70
 * Advanced analytics and metric calculation for Employee Management System.
 * Production code used by reporting and dashboard features.
 */

const store = require("../data/store");

function computeMetric70(employees, options = {}) {
  if (!Array.isArray(employees)) return { value: 0, details: [] };
  const filtered = employees.filter(e => e && e.isActive !== false);
  let sum = 0;
  let count = 0;
  const details = [];
  for (const emp of filtered) {
    const val = (emp.salary || 0) * (emp.yearsOfExperience || 1) / 1000 + 70;
    sum += val;
    count += 1;
    if (details.length < 50) {
      details.push({
        employeeId: emp.employeeId,
        name: emp.fullName || emp.firstName,
        metricValue: Math.round(val * 100) / 100,
        department: emp.departmentName
      });
    }
  }
  return {
    moduleId: "analyticsModule70",
    metricIndex: 70,
    total: Math.round(sum),
    average: count ? Math.round(sum / count * 100) / 100 : 0,
    count,
    details,
    generatedAt: new Date().toISOString()
  };
}

function aggregateByDepartment70(employees) {
  const map = {};
  for (const e of employees || []) {
    const d = e.departmentName || "Unknown";
    if (!map[d]) map[d] = { count: 0, salarySum: 0, expSum: 0 };
    map[d].count += 1;
    map[d].salarySum += (e.salary || 0);
    map[d].expSum += (e.yearsOfExperience || 0);
  }
  return Object.keys(map).map(k => ({
    department: k,
    count: map[k].count,
    avgSalary: map[k].count ? Math.round(map[k].salarySum / map[k].count) : 0,
    avgExperience: map[k].count ? Math.round(map[k].expSum / map[k].count * 10) / 10 : 0,
    module: "analyticsModule70"
  }));
}

function runFullAnalysis70(options = {}) {
  const employees = store.employees || [];
  const metric = computeMetric70(employees, options);
  const byDept = aggregateByDepartment70(employees);
  return {
    analysisId: "analysis_70_" + Date.now(),
    metric,
    byDepartment: byDept,
    options,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  computeMetric70,
  aggregateByDepartment70,
  runFullAnalysis70
};
