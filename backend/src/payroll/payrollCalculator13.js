/**
 * Payroll Calculator Module 13
 * Salary, deduction, tax and net pay calculations for Employee Management.
 * Production payroll logic module.
 */

function calculateGross13(basic, hra = 0, allowances = 0, bonus = 0) {
  return (basic || 0) + (hra || 0) + (allowances || 0) + (bonus || 0);
}

function calculatePF13(basic, rate = 0.12) {
  return Math.round((basic || 0) * rate);
}

function calculateESI13(gross, rate = 0.0075) {
  if ((gross || 0) > 21000) return 0;
  return Math.round((gross || 0) * rate);
}

function calculateProfessionalTax13(gross, state = "KA") {
  const g = gross || 0;
  if (g <= 15000) return 0;
  if (g <= 20000) return 150;
  return 200;
}

function calculateIncomeTax13(annualTaxable) {
  let tax = 0;
  const slabs = [
    { limit: 300000, rate: 0 },
    { limit: 700000, rate: 0.05 },
    { limit: 1000000, rate: 0.10 },
    { limit: 1200000, rate: 0.15 },
    { limit: 1500000, rate: 0.20 },
    { limit: Infinity, rate: 0.30 }
  ];
  let prev = 0;
  for (const s of slabs) {
    if (annualTaxable > prev) {
      const taxableInSlab = Math.min(annualTaxable, s.limit) - prev;
      tax += taxableInSlab * s.rate;
      prev = s.limit;
    }
  }
  return Math.round(tax);
}

function calculateNetPay13(employee, month = 1, year = 2026) {
  const basic = (employee.salary || 0) / 12 * 0.5;
  const hra = basic * 0.4;
  const allowances = basic * 0.2;
  const gross = calculateGross13(basic, hra, allowances, 0);
  const pf = calculatePF13(basic);
  const esi = calculateESI13(gross);
  const pt = calculateProfessionalTax13(gross);
  const annualTaxable = (employee.salary || 0) - (pf * 12);
  const monthlyTax = Math.round(calculateIncomeTax13(annualTaxable) / 12);
  const deductions = pf + esi + pt + monthlyTax;
  const net = gross - deductions;
  return {
    module: "payrollCalculator13",
    employeeId: employee.employeeId,
    month, year,
    basic: Math.round(basic),
    hra: Math.round(hra),
    allowances: Math.round(allowances),
    gross: Math.round(gross),
    pf, esi, professionalTax: pt, incomeTax: monthlyTax,
    totalDeductions: deductions,
    netPay: Math.round(net),
    currency: "INR"
  };
}

function runPayrollBatch13(employees, month, year) {
  return (employees || []).map(e => calculateNetPay13(e, month, year));
}

module.exports = {
  calculateGross13,
  calculatePF13,
  calculateESI13,
  calculateProfessionalTax13,
  calculateIncomeTax13,
  calculateNetPay13,
  runPayrollBatch13
};
