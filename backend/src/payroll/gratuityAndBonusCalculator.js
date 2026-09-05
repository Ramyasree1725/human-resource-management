/**
 * Gratuity, Statutory Bonus, Leave Encashment and Severance Calculator
 * Compliant with:
 * - Payment of Gratuity Act, 1972 (Formula: 15/26 * Last Drawn Basic * Tenure)
 * - Payment of Bonus Act, 1965 (Statutory 8.33% to 20% limits)
 * - Industrial Disputes Act (Retrenchment / Severance computation)
 * - Factories Act & State Shops/Establishment Acts for Leave Encashment.
 */

class GratuityAndBonusCalculator {
  constructor(config = {}) {
    this.gratuityCap = config.gratuityCap || 2000000; // 20 Lakhs statutory ceiling
    this.minYearsForGratuity = config.minYearsForGratuity || 5;
    this.minDaysForContinuousYear = 240;
    this.bonusMinPercentage = 0.0833; // 8.33%
    this.bonusMaxPercentage = 0.20; // 20.00%
    this.bonusWageCeilingMonthly = 21000;
    this.bonusCalculationCeilingMonthly = 7000;
    this.workingDaysPerMonth = 26;
  }

  calculateTenureInYears(joiningDate, exitDate = new Date()) {
    const start = new Date(joiningDate);
    const end = new Date(exitDate);
    const diffMs = end.getTime() - start.getTime();
    if (diffMs <= 0) return { totalYears: 0, roundedYears: 0, totalMonths: 0, totalDays: 0 };

    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalMonths = Math.floor(totalDays / 30.4375);
    const completedYears = Math.floor(totalMonths / 12);
    const remainingMonths = totalMonths % 12;

    // Rule of Gratuity: Fraction over 6 months counts as 1 full year
    const roundedYears = remainingMonths >= 6 ? completedYears + 1 : completedYears;

    return {
      totalDays,
      totalMonths,
      completedYears,
      remainingMonths,
      roundedYears,
      exactYears: (totalDays / 365.25).toFixed(2)
    };
  }

  calculateGratuity(lastDrawnMonthlyBasic, joiningDate, exitDate = new Date(), isDeceasedOrDisabled = false) {
    const tenure = this.calculateTenureInYears(joiningDate, exitDate);
    const isEligible = isDeceasedOrDisabled || tenure.completedYears >= this.minYearsForGratuity;

    if (!isEligible) {
      return {
        isEligible: false,
        tenure,
        gratuityAmount: 0,
        taxExemptAmount: 0,
        taxableAmount: 0,
        reason: `Tenure (${tenure.completedYears} years ${tenure.remainingMonths} months) is less than the mandatory ${this.minYearsForGratuity} continuous years.`
      };
    }

    // Formula: (15 * Last Drawn Monthly Basic * Tenure in Rounded Years) / 26
    const calculatedAmount = Math.round((15 * lastDrawnMonthlyBasic * tenure.roundedYears) / this.workingDaysPerMonth);
    const payableAmount = Math.min(calculatedAmount, this.gratuityCap);
    const taxExemptAmount = Math.min(payableAmount, this.gratuityCap);
    const taxableAmount = Math.max(0, payableAmount - taxExemptAmount);

    return {
      isEligible: true,
      tenure,
      lastDrawnMonthlyBasic,
      formula: `(15 * ${lastDrawnMonthlyBasic} * ${tenure.roundedYears}) / 26`,
      rawCalculated: calculatedAmount,
      gratuityAmount: payableAmount,
      statutoryCeiling: this.gratuityCap,
      taxExemptAmount,
      taxableAmount,
      isCapped: calculatedAmount > this.gratuityCap
    };
  }

  calculateStatutoryBonus(monthlyBasicAndDA, monthsWorkedInFinancialYear = 12, performanceBonusRate = 0.0833) {
    const isEligibleForStatutory = monthlyBasicAndDA <= this.bonusWageCeilingMonthly;
    const applicableRate = Math.min(Math.max(performanceBonusRate, this.bonusMinPercentage), this.bonusMaxPercentage);

    // Calculation wage basis: min of basic or ₹7,000 / state minimum wage
    const calculationBasisMonthly = isEligibleForStatutory
      ? Math.min(monthlyBasicAndDA, this.bonusCalculationCeilingMonthly)
      : monthlyBasicAndDA;

    const annualWageBasis = calculationBasisMonthly * monthsWorkedInFinancialYear;
    const bonusAmount = Math.round(annualWageBasis * applicableRate);

    return {
      monthlySalary: monthlyBasicAndDA,
      isStatutoryEligible: isEligibleForStatutory,
      calculationBasisMonthly,
      monthsWorked: monthsWorkedInFinancialYear,
      bonusPercentage: (applicableRate * 100).toFixed(2) + '%',
      bonusAmount,
      minStatutoryBonus: Math.round(calculationBasisMonthly * monthsWorkedInFinancialYear * this.bonusMinPercentage),
      maxStatutoryBonus: Math.round(calculationBasisMonthly * monthsWorkedInFinancialYear * this.bonusMaxPercentage)
    };
  }

  calculateLeaveEncashment(dailyBasicWage, unusedPrivilegeLeaves = 0, isAtRetirement = true) {
    const encashmentAmount = Math.round(dailyBasicWage * unusedPrivilegeLeaves);
    // Exemption limit under Section 10(10AA) updated to ₹25 Lakhs for non-government employees
    const statutoryExemptionCap = 2500000;
    const taxExemptAmount = isAtRetirement ? Math.min(encashmentAmount, statutoryExemptionCap) : 0;
    const taxableAmount = Math.max(0, encashmentAmount - taxExemptAmount);

    return {
      unusedPrivilegeLeaves,
      dailyRate: dailyBasicWage,
      encashmentAmount,
      taxExemptAmount,
      taxableAmount,
      exemptionCap: statutoryExemptionCap
    };
  }

  calculateSeverancePackage(employeeDetails, options = {}) {
    const {
      monthlyGross = 0,
      monthlyBasic = 0,
      joiningDate,
      unusedLeaves = 0,
      noticePeriodDays = 60,
      noticeServedDays = 0,
      severanceMultiplierMonths = 0.5
    } = options;

    const tenure = this.calculateTenureInYears(joiningDate);
    const gratuityResult = this.calculateGratuity(monthlyBasic, joiningDate);
    const dailyBasic = monthlyBasic / 26;
    const dailyGross = monthlyGross / 30;

    // Notice pay shortfall
    const shortfallDays = Math.max(0, noticePeriodDays - noticeServedDays);
    const noticePayInLieu = Math.round(dailyGross * shortfallDays);

    // Retrenchment compensation: 15 days average pay for every completed year of service
    const retrenchmentCompensation = Math.round(dailyBasic * 15 * tenure.roundedYears * severanceMultiplierMonths);

    // Leave Encashment
    const leaveEncashment = this.calculateLeaveEncashment(dailyBasic, unusedLeaves, false);

    const totalPayout =
      (gratuityResult.gratuityAmount || 0) +
      noticePayInLieu +
      retrenchmentCompensation +
      leaveEncashment.encashmentAmount;

    return {
      employeeId: employeeDetails.employeeId,
      name: `${employeeDetails.firstName} ${employeeDetails.lastName}`,
      tenureYears: tenure.exactYears,
      breakdown: {
        gratuity: gratuityResult.gratuityAmount,
        noticePayInLieu,
        retrenchmentCompensation,
        leaveEncashment: leaveEncashment.encashmentAmount
      },
      totalSeverancePayout: totalPayout,
      statutoryDetails: {
        gratuityEligible: gratuityResult.isEligible,
        shortfallDays,
        leaveDaysEncashed: unusedLeaves
      }
    };
  }

  calculateOvertime(monthlyGross, standardWorkingHoursPerDay = 8, overtimeHours = 0, multiplier = 2.0) {
    if (overtimeHours <= 0) return { overtimeHours: 0, overtimePay: 0, hourlyRate: 0 };

    const hourlyRate = monthlyGross / (this.workingDaysPerMonth * standardWorkingHoursPerDay);
    const overtimeHourlyRate = hourlyRate * multiplier;
    const overtimePay = Math.round(overtimeHourlyRate * overtimeHours);

    return {
      standardHoursPerDay: standardWorkingHoursPerDay,
      workingDaysPerMonth: this.workingDaysPerMonth,
      standardHourlyRate: Number(hourlyRate.toFixed(2)),
      multiplier,
      overtimeHourlyRate: Number(overtimeHourlyRate.toFixed(2)),
      overtimeHours,
      overtimePay
    };
  }
}

const gratuityAndBonusCalculator = new GratuityAndBonusCalculator();

module.exports = {
  GratuityAndBonusCalculator,
  gratuityAndBonusCalculator
};
