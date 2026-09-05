/**
 * leaveBalanceReport Generator
 * Produces detailed analytical reports for HR and leadership dashboards.
 * All calculations run against the in-memory store.
 */

const store = require('../data/store');
const { groupBy, percentage, formatCurrency, toDateString } = require('../helpers/dateHelpers');

class LeaveBalanceReport {
  constructor() {
    this.name = 'leaveBalanceReport';
    this.generatedAt = null;
  }

  /**
   * Main entry point - generates the full report payload.
   */
  async generate(options = {}) {
    this.generatedAt = new Date().toISOString();
    const employees = store.employees.filter(e => e.isActive !== false);

    const summary = this.buildSummary(employees, options);
    const breakdown = this.buildBreakdown(employees, options);
    const trends = this.buildTrends(employees, options);
    const details = this.buildDetails(employees, options);
    const insights = this.generateInsights(summary, breakdown);

    return {
      reportName: this.name,
      generatedAt: this.generatedAt,
      options,
      summary,
      breakdown,
      trends,
      details,
      insights,
      meta: {
        totalEmployeesConsidered: employees.length,
        generationTimeMs: Date.now() - new Date(this.generatedAt).getTime()
      }
    };
  }

  buildSummary(employees, options) {
    const total = employees.length;
    const byStatus = {};
    const byDept = {};
    const byType = {};
    let totalSalary = 0;

    employees.forEach(e => {
      byStatus[e.status] = (byStatus[e.status] || 0) + 1;
      byDept[e.departmentName || 'Unknown'] = (byDept[e.departmentName || 'Unknown'] || 0) + 1;
      byType[e.employmentType || 'Unknown'] = (byType[e.employmentType || 'Unknown'] || 0) + 1;
      totalSalary += (e.salary || 0);
    });

    return {
      totalEmployees: total,
      activeCount: byStatus['ACTIVE'] || 0,
      onLeaveCount: byStatus['ON_LEAVE'] || 0,
      probationCount: byStatus['ON_PROBATION'] || 0,
      averageSalary: total ? Math.round(totalSalary / total) : 0,
      totalSalaryBudget: totalSalary,
      statusDistribution: byStatus,
      departmentDistribution: byDept,
      employmentTypeDistribution: byType
    };
  }

  buildBreakdown(employees, options) {
    const byDepartment = groupBy(employees, e => e.departmentName || 'Unknown');
    const result = {};

    Object.keys(byDepartment).forEach(dept => {
      const list = byDepartment[dept];
      const salaries = list.map(e => e.salary || 0);
      const avgSal = salaries.length ? Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length) : 0;
      result[dept] = {
        count: list.length,
        averageSalary: avgSal,
        minSalary: salaries.length ? Math.min(...salaries) : 0,
        maxSalary: salaries.length ? Math.max(...salaries) : 0,
        maleCount: list.filter(e => e.gender === 'M').length,
        femaleCount: list.filter(e => e.gender === 'F').length,
        averageExperience: list.length
          ? Math.round(list.reduce((s, e) => s + (e.yearsOfExperience || 0), 0) / list.length * 10) / 10
          : 0
      };
    });

    return result;
  }

  buildTrends(employees, options) {
    // Simulated monthly trend based on join dates
    const monthly = {};
    employees.forEach(e => {
      if (!e.joinDate) return;
      const month = String(e.joinDate).slice(0, 7); // YYYY-MM
      monthly[month] = (monthly[month] || 0) + 1;
    });

    const sortedMonths = Object.keys(monthly).sort();
    return {
      hiringByMonth: sortedMonths.map(m => ({ month: m, count: monthly[m] })),
      peakHiringMonth: sortedMonths.length
        ? sortedMonths.reduce((a, b) => monthly[a] > monthly[b] ? a : b)
        : null
    };
  }

  buildDetails(employees, options) {
    // Top / bottom samples
    const sortedBySalary = [...employees].sort((a, b) => (b.salary || 0) - (a.salary || 0));
    return {
      highestPaid: sortedBySalary.slice(0, 10).map(e => ({
        employeeId: e.employeeId,
        name: e.fullName,
        department: e.departmentName,
        salary: e.salary,
        jobTitle: e.jobTitle
      })),
      lowestPaid: sortedBySalary.slice(-10).reverse().map(e => ({
        employeeId: e.employeeId,
        name: e.fullName,
        department: e.departmentName,
        salary: e.salary,
        jobTitle: e.jobTitle
      })),
      longestTenure: [...employees]
        .filter(e => e.joinDate)
        .sort((a, b) => new Date(a.joinDate) - new Date(b.joinDate))
        .slice(0, 10)
        .map(e => ({
          employeeId: e.employeeId,
          name: e.fullName,
          joinDate: e.joinDate,
          department: e.departmentName
        }))
    };
  }

  generateInsights(summary, breakdown) {
    const insights = [];
    if (summary.totalEmployees > 0) {
      const activePct = percentage(summary.activeCount, summary.totalEmployees);
      insights.push(`Active employees represent ${activePct}% of the total headcount.`);
    }
    const depts = Object.keys(breakdown);
    if (depts.length) {
      const largest = depts.reduce((a, b) => breakdown[a].count > breakdown[b].count ? a : b);
      insights.push(`${largest} is the largest department with ${breakdown[largest].count} employees.`);
    }
    if (summary.averageSalary) {
      insights.push(`Average salary across the organization is ${formatCurrency(summary.averageSalary)}.`);
    }
    return insights;
  }
}

module.exports = new LeaveBalanceReport();
