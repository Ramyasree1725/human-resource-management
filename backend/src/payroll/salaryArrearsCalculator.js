/**
 * Salary Arrears, Retrospective Increments & Section 89(1) Tax Relief Engine
 * Calculates retrospective salary increments, Dearness Allowance (DA) adjustments,
 * and computes tax relief under Section 89(1) with Form 10E compliance.
 */

class SalaryArrearsCalculator {
  constructor() {
    this.pfRate = 0.12;
    this.esicRate = 0.0075;
    this.esicWageCeiling = 21000;
  }

  calculateRetrospectiveIncrementArrears(employeeDetails, revisionDetails = {}) {
    const {
      effectiveFromDate, // e.g. '2026-04-01'
      disbursementDate = new Date().toISOString().split('T')[0], // e.g. '2026-08-31'
      oldAnnualCTC = employeeDetails.salary || 0,
      newAnnualCTC,
      includePF = true,
      includePT = true
    } = revisionDetails;

    if (!newAnnualCTC || newAnnualCTC <= oldAnnualCTC) {
      return {
        hasArrears: false,
        totalArrearsGross: 0,
        totalArrearsNet: 0,
        message: 'New CTC must be greater than current CTC for positive arrears calculation.'
      };
    }

    const startDate = new Date(effectiveFromDate);
    const endDate = new Date(disbursementDate);

    // Calculate month difference
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth();

    const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth);
    if (totalMonths <= 0) {
      return {
        hasArrears: false,
        totalArrearsGross: 0,
        totalArrearsNet: 0,
        message: 'Effective date must be prior to disbursement date.'
      };
    }

    const oldMonthlyGross = Math.round(oldAnnualCTC / 12);
    const newMonthlyGross = Math.round(newAnnualCTC / 12);
    const monthlyGrossDiff = newMonthlyGross - oldMonthlyGross;

    const oldMonthlyBasic = Math.round(oldMonthlyGross * 0.50);
    const newMonthlyBasic = Math.round(newMonthlyGross * 0.50);
    const monthlyBasicDiff = newMonthlyBasic - oldMonthlyBasic;

    const oldMonthlyHRA = Math.round(oldMonthlyGross * 0.20);
    const newMonthlyHRA = Math.round(newMonthlyGross * 0.20);
    const monthlyHRADiff = newMonthlyHRA - oldMonthlyHRA;

    const oldMonthlySpecial = Math.round(oldMonthlyGross * 0.30);
    const newMonthlySpecial = Math.round(newMonthlyGross * 0.30);
    const monthlySpecialDiff = newMonthlySpecial - oldMonthlySpecial;

    const monthlyPFDiff = includePF ? Math.round(monthlyBasicDiff * this.pfRate) : 0;
    const monthlyNetDiff = monthlyGrossDiff - monthlyPFDiff;

    const monthlyBreakdown = [];
    let currentCursor = new Date(startDate);

    for (let i = 0; i < totalMonths; i++) {
      const monthYearLabel = currentCursor.toLocaleString('default', { month: 'short', year: 'numeric' });
      monthlyBreakdown.push({
        monthIndex: i + 1,
        monthYear: monthYearLabel,
        grossDifference: monthlyGrossDiff,
        basicDifference: monthlyBasicDiff,
        hraDifference: monthlyHRADiff,
        specialAllowanceDifference: monthlySpecialDiff,
        pfDeductionDifference: monthlyPFDiff,
        netArrearsPayable: monthlyNetDiff
      });
      currentCursor.setMonth(currentCursor.getMonth() + 1);
    }

    const totalGrossArrears = monthlyGrossDiff * totalMonths;
    const totalPFDeduction = monthlyPFDiff * totalMonths;
    const totalNetArrears = monthlyNetDiff * totalMonths;

    return {
      hasArrears: true,
      employeeId: employeeDetails.employeeId,
      employeeName: `${employeeDetails.firstName} ${employeeDetails.lastName}`,
      effectiveFrom: effectiveFromDate,
      disbursedIn: disbursementDate,
      monthsCount: totalMonths,
      oldMonthlyGross,
      newMonthlyGross,
      monthlyGrossDifference: monthlyGrossDiff,
      totalArrearsGross: totalGrossArrears,
      totalPFDeductions: totalPFDeduction,
      totalArrearsNet: totalNetArrears,
      monthlySchedule: monthlyBreakdown
    };
  }

  computeSection89Relief(taxData = {}) {
    const {
      currentYearIncomeWithoutArrears = 1200000,
      currentYearArrearsReceived = 200000,
      previousYearIncomeWithoutArrears = 900000,
      currentYearTaxOnTotalIncome, // Step 1: Tax on (Current Income + Arrears)
      currentYearTaxOnBaseIncome,  // Step 2: Tax on (Current Income without Arrears)
      previousYearTaxOnTotalIncome,// Step 3: Tax on (Past Income + Arrears)
      previousYearTaxOnBaseIncome  // Step 4: Tax on (Past Income without Arrears)
    } = taxData;

    // Step 1: Calculate Tax on Total Income in Current Year (Including Arrears)
    const taxCurrentWithArrears = currentYearTaxOnTotalIncome || this.estimateTax(currentYearIncomeWithoutArrears + currentYearArrearsReceived);

    // Step 2: Calculate Tax on Current Year Base Income (Excluding Arrears)
    const taxCurrentWithoutArrears = currentYearTaxOnBaseIncome || this.estimateTax(currentYearIncomeWithoutArrears);

    // Difference in Current Year Tax
    const deltaCurrentYear = Math.max(0, taxCurrentWithArrears - taxCurrentWithoutArrears);

    // Step 3: Calculate Tax in Past Year(s) adding relevant portion of arrears
    const taxPastWithArrears = previousYearTaxOnTotalIncome || this.estimateTax(previousYearIncomeWithoutArrears + currentYearArrearsReceived);

    // Step 4: Calculate Tax in Past Year(s) without arrears
    const taxPastWithoutArrears = previousYearTaxOnBaseIncome || this.estimateTax(previousYearIncomeWithoutArrears);

    // Difference in Past Year Tax
    const deltaPastYear = Math.max(0, taxPastWithArrears - taxPastWithoutArrears);

    // Relief = (Tax Difference in Current Year) - (Tax Difference in Past Year)
    const reliefUnder89 = Math.max(0, deltaCurrentYear - deltaPastYear);

    return {
      reliefEligible: reliefUnder89 > 0,
      currentYearAnalysis: {
        incomeWithArrears: currentYearIncomeWithoutArrears + currentYearArrearsReceived,
        taxWithArrears: taxCurrentWithArrears,
        incomeWithoutArrears: currentYearIncomeWithoutArrears,
        taxWithoutArrears: taxCurrentWithoutArrears,
        additionalTaxDueToArrears: deltaCurrentYear
      },
      pastYearAnalysis: {
        incomeWithArrears: previousYearIncomeWithoutArrears + currentYearArrearsReceived,
        taxWithArrears: taxPastWithArrears,
        incomeWithoutArrears: previousYearIncomeWithoutArrears,
        taxWithoutArrears: taxPastWithoutArrears,
        taxHadArrearsBeenPaidInPast: deltaPastYear
      },
      section89_1_ReliefAmount: reliefUnder89,
      form10ERequired: reliefUnder89 > 0,
      summary: reliefUnder89 > 0
        ? `Employee is entitled to Section 89(1) tax relief of ₹${reliefUnder89.toLocaleString('en-IN')}. File Form 10E before filing ITR.`
        : 'No Section 89(1) relief available as current tax delta does not exceed past year tax delta.'
    };
  }

  estimateTax(income) {
    if (income <= 700000) return 0;
    if (income <= 1000000) return Math.round((income - 700000) * 0.10 + 20000);
    if (income <= 1200000) return Math.round((income - 1000000) * 0.15 + 50000);
    if (income <= 1500000) return Math.round((income - 1200000) * 0.20 + 80000);
    return Math.round((income - 1500000) * 0.30 + 140000);
  }
}

const salaryArrearsCalculator = new SalaryArrearsCalculator();

module.exports = {
  SalaryArrearsCalculator,
  salaryArrearsCalculator
};
