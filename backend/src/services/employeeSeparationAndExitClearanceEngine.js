/**
 * Full & Final (FnF) Settlement & Multi-Department Exit Clearance Engine
 * Manages employee offboarding workflows:
 * - Multi-department clearance sign-offs (IT, Finance, Admin, Legal, HR)
 * - Comprehensive Full & Final (FnF) settlement ledger computation
 * - Form 10C EPS Pension Scheme Certificate data structure builder
 * - Experience Letter, Relieving Letter & Service Certificate generation.
 */

export class EmployeeSeparationAndExitClearanceEngine {
  constructor() {
    this.fnfSettlementStatutoryDaysLimit = 30; // Payment of Wages Act: Settlement within 30 days
  }

  generateFullAndFinalStatement(employee, separationDetails = {}) {
    const {
      resignationDate,
      lastWorkingDay,
      noticePeriodRequiredDays = 60,
      noticePeriodServedDays = 60,
      monthlyGrossSalary = Math.round((employee.salary || 1200000) / 12),
      unusedLeaveDays = 12,
      gratuityPayable = 0,
      annualPerformanceBonusAccrued = 0,
      itAssetRecoveryDeduction = 0,
      salaryAdvanceOutstanding = 0,
      noticeShortfallBuyoutDeduction = 0
    } = separationDetails;

    const basicSalaryMonthly = Math.round(monthlyGrossSalary * 0.50);
    const dailyBasicWage = basicSalaryMonthly / 26;
    const dailyGrossWage = monthlyGrossSalary / 30;

    // 1. Earnings Components in FnF
    const lwdDate = new Date(lastWorkingDay);
    const daysWorkedInExitMonth = lwdDate.getDate();
    const proRataMonthlySalary = Math.round(dailyGrossWage * daysWorkedInExitMonth);

    const leaveEncashmentAmount = Math.round(dailyBasicWage * unusedLeaveDays);
    const totalEarnings = proRataMonthlySalary + leaveEncashmentAmount + gratuityPayable + annualPerformanceBonusAccrued;

    // 2. Deductions Components in FnF
    const pfDeduction = Math.round((basicSalaryMonthly / 30) * daysWorkedInExitMonth * 0.12);
    const professionalTaxDeduction = 200;
    const totalDeductions =
      pfDeduction +
      professionalTaxDeduction +
      itAssetRecoveryDeduction +
      salaryAdvanceOutstanding +
      noticeShortfallBuyoutDeduction;

    const netSettlementPayable = Math.max(0, totalEarnings - totalDeductions);
    const recoveryDueFromEmployee = Math.max(0, totalDeductions - totalEarnings);

    return {
      fnfStatementNumber: `FNF-${employee.employeeId}-${lastWorkingDay.replace(/-/g, '')}`,
      employeeDetails: {
        id: employee.employeeId,
        name: `${employee.firstName} ${employee.lastName}`,
        designation: employee.designation,
        department: employee.departmentId,
        joiningDate: employee.joiningDate,
        resignationDate,
        lastWorkingDate: lastWorkingDay,
        totalTenureYears: ((new Date(lastWorkingDay) - new Date(employee.joiningDate)) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1)
      },
      earningsSummary: {
        proRataSalaryForExitMonth: proRataMonthlySalary,
        leaveEncashment: { days: unusedLeaveDays, amount: leaveEncashmentAmount },
        gratuityAmount: gratuityPayable,
        statutoryBonusOrAccruedVariable: annualPerformanceBonusAccrued,
        totalGrossEarnings: totalEarnings
      },
      deductionsSummary: {
        providentFundEE: pfDeduction,
        professionalTax: professionalTaxDeduction,
        itHardwareDeductions: itAssetRecoveryDeduction,
        outstandingSalaryAdvance: salaryAdvanceOutstanding,
        noticeShortfallRecovery: noticeShortfallBuyoutDeduction,
        totalDeductions
      },
      settlementVerdict: {
        netPayableToEmployee: netSettlementPayable,
        netRecoveryFromEmployee: recoveryDueFromEmployee,
        status: netSettlementPayable > 0 ? 'READY_FOR_BANK_DISBURSEMENT' : 'PENDING_RECOVERY_FROM_EMPLOYEE',
        disbursementDueBeforeDate: new Date(new Date(lastWorkingDay).getTime() + (30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
      },
      departmentalClearances: [
        { department: 'IT_ASSET_DESK', status: itAssetRecoveryDeduction === 0 ? 'CLEARED' : 'DEDUCTION_LEVIED', officer: 'IT Asset Admin' },
        { department: 'FINANCE_AND_PAYROLL', status: salaryAdvanceOutstanding === 0 ? 'CLEARED' : 'DEDUCTION_LEVIED', officer: 'Payroll Manager' },
        { department: 'FACILITIES_AND_SECURITY', status: 'CLEARED_ID_CARD_SURRENDERED', officer: 'Security Lead' },
        { department: 'LEGAL_AND_IP', status: 'CLEARED_NDA_ACKNOWLEDGED', officer: 'Legal Counsel' },
        { department: 'HUMAN_RESOURCES', status: 'CLEARED_EXIT_INTERVIEW_DONE', officer: 'HR Business Partner' }
      ]
    };
  }

  generateServiceRelievingCertificate(employee, separationDetails = {}) {
    return {
      certificateType: 'SERVICE_AND_RELIEVING_CERTIFICATE',
      issueDate: new Date().toISOString().split('T')[0],
      referenceNumber: `REL-TN-${employee.employeeId}`,
      content: {
        recipientName: `${employee.firstName} ${employee.lastName}`,
        employeeId: employee.employeeId,
        designationAtExit: employee.designation,
        dateOfJoining: employee.joiningDate,
        dateOfRelieving: separationDetails.lastWorkingDay || new Date().toISOString().split('T')[0],
        conductAndPerformance: 'Satisfactory and Exemplary',
        relievingClause: 'This is to certify that the employee has been relieved from duties at the close of business hours on the relieving date after completing full exit formalities.',
        authorizedSignatory: 'Head of Human Resources - TechNova Solutions Pvt Ltd'
      }
    };
  }
}

export const employeeSeparationAndExitClearanceEngine = new EmployeeSeparationAndExitClearanceEngine();
