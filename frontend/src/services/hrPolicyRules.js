/**
 * Enterprise HR Policy Rules Engine
 * Implements corporate governance rules:
 * - Leave Accrual & Carry Forward policies
 * - Probation Review Rubrics & Auto-Confirmation milestones
 * - Notice Period Buyout & Early Release policies
 * - Shift Allowance, Night Shift Differential & Travel reimbursement rules.
 */

export const LEAVE_POLICY_MATRIX = {
  ANNUAL_PRIVILEGE_LEAVE: {
    code: 'AL',
    name: 'Annual / Privilege Leave',
    annualQuota: 18,
    monthlyAccrual: 1.5,
    maxCarryForward: 30,
    encashableAtExit: true,
    minNoticeDaysForApply: 3,
    maxContinuousDays: 14,
    prorationOnMidYearJoin: true
  },
  SICK_LEAVE: {
    code: 'SL',
    name: 'Medical / Sick Leave',
    annualQuota: 10,
    monthlyAccrual: 0.833,
    maxCarryForward: 0,
    encashableAtExit: false,
    medicalCertificateThresholdDays: 2,
    prorationOnMidYearJoin: true
  },
  CASUAL_LEAVE: {
    code: 'CL',
    name: 'Casual Leave',
    annualQuota: 8,
    monthlyAccrual: 0.667,
    maxCarryForward: 0,
    encashableAtExit: false,
    maxContinuousDays: 3,
    prorationOnMidYearJoin: true
  },
  MATERNITY_LEAVE: {
    code: 'ML',
    name: 'Maternity Leave',
    totalWeeks: 26,
    paid: true,
    minTenureDaysRequired: 80,
    applicableGenders: ['Female'],
    encashableAtExit: false
  },
  PATERNITY_LEAVE: {
    code: 'PL',
    name: 'Paternity Leave',
    totalDays: 10,
    paid: true,
    applicableGenders: ['Male'],
    validityMonthsFromBirth: 6,
    encashableAtExit: false
  },
  BEREAVEMENT_LEAVE: {
    code: 'BL',
    name: 'Bereavement Leave',
    totalDays: 5,
    paid: true,
    encashableAtExit: false
  }
};

export const PROBATION_EVALUATION_CRITERIA = [
  { id: 'tech_competence', name: 'Technical Competence & Execution', weightage: 30, minScoreForConfirm: 3.5 },
  { id: 'cultural_alignment', name: 'Cultural Alignment & Collaboration', weightage: 20, minScoreForConfirm: 3.5 },
  { id: 'dependability', name: 'Dependability & Attendance Punctuality', weightage: 20, minScoreForConfirm: 4.0 },
  { id: 'communication', name: 'Stakeholder Communication', weightage: 15, minScoreForConfirm: 3.0 },
  { id: 'ownership', name: 'Initiative & Problem Solving', weightage: 15, minScoreForConfirm: 3.0 }
];

export const SHIFT_ALLOWANCE_RATES = {
  GENERAL_SHIFT: { name: 'Day Shift (09:00 - 18:00)', allowancePerDay: 0 },
  AFTERNOON_SHIFT: { name: 'Afternoon Shift (13:00 - 22:00)', allowancePerDay: 250 },
  NIGHT_SHIFT: { name: 'Graveyard Shift (22:00 - 07:00)', allowancePerDay: 500, freeCabProvided: true },
  WEEKEND_ON_CALL: { name: 'On-Call Standby (Saturday/Sunday)', allowancePerDay: 750 }
};

export class HRPolicyRulesEngine {
  constructor() {
    this.standardNoticePeriodDays = 60;
    this.probationPeriodMonths = 6;
  }

  calculateProratedLeaveBalance(employeeJoiningDate, leaveType = 'ANNUAL_PRIVILEGE_LEAVE') {
    const policy = LEAVE_POLICY_MATRIX[leaveType];
    if (!policy) return 0;

    const joinDate = new Date(employeeJoiningDate);
    const joinYear = joinDate.getFullYear();
    const currentYear = new Date().getFullYear();

    if (joinYear < currentYear) {
      return policy.annualQuota;
    }

    const joinMonth = joinDate.getMonth(); // 0-indexed (Jan = 0)
    const monthsRemainingInYear = 12 - joinMonth;
    const prorated = Math.round(monthsRemainingInYear * (policy.monthlyAccrual || (policy.annualQuota / 12)));

    return Math.min(prorated, policy.annualQuota);
  }

  evaluateProbationReview(employee, scores = {}) {
    let totalWeightedScore = 0;
    const criteriaResults = [];

    PROBATION_EVALUATION_CRITERIA.forEach(crit => {
      const givenScore = scores[crit.id] || 4.0;
      const weighted = (givenScore * crit.weightage) / 100;
      totalWeightedScore += weighted;

      criteriaResults.push({
        criterion: crit.name,
        score: givenScore,
        minRequired: crit.minScoreForConfirm,
        meetsBar: givenScore >= crit.minScoreForConfirm
      });
    });

    const meetsOverallBar = totalWeightedScore >= 3.5;
    const allCriteriaMet = criteriaResults.every(c => c.meetsBar);
    const isConfirmed = meetsOverallBar && allCriteriaMet;

    return {
      employeeId: employee.employeeId,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      overallWeightedScore: Number(totalWeightedScore.toFixed(2)),
      decision: isConfirmed ? 'CONFIRM_EMPLOYMENT' : (totalWeightedScore >= 3.0 ? 'EXTEND_PROBATION_3_MONTHS' : 'TERMINATE_DURING_PROBATION'),
      criteriaBreakdown: criteriaResults,
      recommendationNotes: isConfirmed
        ? 'Employee has successfully demonstrated role competency. Transition to regular employee status with revision in notice period.'
        : 'Performance fell short in specific competencies. Recommend targeted 90-day Performance Improvement Plan (PIP).'
    };
  }

  calculateNoticePeriodBuyout(monthlyGrossSalary, totalNoticeDays = 60, servedDays = 0, isCompanyBuyout = false) {
    const shortfallDays = Math.max(0, totalNoticeDays - servedDays);
    const perDayGross = monthlyGrossSalary / 30;
    const buyoutAmount = Math.round(perDayGross * shortfallDays);
    const gstApplicableOnEmployeeRecovery = 0.18; // 18% GST under RCM if recovered from employee

    return {
      totalNoticeDays,
      servedDays,
      shortfallDays,
      perDayGrossRate: Number(perDayGross.toFixed(2)),
      buyoutAmount,
      gstOnRecovery: isCompanyBuyout ? 0 : Math.round(buyoutAmount * gstApplicableOnEmployeeRecovery),
      totalPayable: isCompanyBuyout ? buyoutAmount : buyoutAmount + Math.round(buyoutAmount * gstApplicableOnEmployeeRecovery),
      payer: isCompanyBuyout ? 'EMPLOYER' : 'EMPLOYEE'
    };
  }

  calculateMonthlyShiftAllowance(shiftPunches = []) {
    let totalAllowance = 0;
    const breakdown = {
      generalCount: 0,
      afternoonCount: 0,
      nightCount: 0,
      onCallCount: 0
    };

    shiftPunches.forEach(punch => {
      if (punch.shiftType === 'NIGHT_SHIFT') {
        totalAllowance += SHIFT_ALLOWANCE_RATES.NIGHT_SHIFT.allowancePerDay;
        breakdown.nightCount++;
      } else if (punch.shiftType === 'AFTERNOON_SHIFT') {
        totalAllowance += SHIFT_ALLOWANCE_RATES.AFTERNOON_SHIFT.allowancePerDay;
        breakdown.afternoonCount++;
      } else if (punch.shiftType === 'WEEKEND_ON_CALL') {
        totalAllowance += SHIFT_ALLOWANCE_RATES.WEEKEND_ON_CALL.allowancePerDay;
        breakdown.onCallCount++;
      } else {
        breakdown.generalCount++;
      }
    });

    return {
      totalAllowanceEarned: totalAllowance,
      shiftBreakdown: breakdown
    };
  }
}

export const hrPolicyRulesEngine = new HRPolicyRulesEngine();
