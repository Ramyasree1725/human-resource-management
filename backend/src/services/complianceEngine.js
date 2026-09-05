/**
 * Statutory & Regulatory HR Compliance Engine
 * Validates corporate alignment with Indian labor laws:
 * - Employees' Provident Fund and Miscellaneous Provisions Act, 1952 (EPFO)
 * - Employees' State Insurance Act, 1948 (ESIC)
 * - Maternity Benefit (Amendment) Act, 2017
 * - Prevention of Sexual Harassment (POSH) Act, 2013
 * - The Equal Remuneration Act & Code on Wages.
 */

class ComplianceEngine {
  constructor() {
    this.epfWageCeiling = 15000;
    this.esicWageCeiling = 21000;
    this.esicDisabilityCeiling = 25000;
    this.maternityBenefitPaidWeeks = 26;
    this.maternityBenefitSubsequentWeeks = 12;
    this.crecheMandatoryStaffCount = 50;
    this.iccMandatoryStaffCount = 10;
  }

  auditEPFCompliance(employeeRecord, monthlySalaryBreakdown) {
    const basicPay = monthlySalaryBreakdown.basic || (employeeRecord.salary / 24);
    const da = monthlySalaryBreakdown.da || 0;
    const epfWages = basicPay + da;
    const isMandatory = epfWages <= this.epfWageCeiling;

    const employeeDeduction = Math.round(epfWages * 0.12);
    const employerContribution = Math.round(epfWages * 0.12);
    const epsContribution = Math.min(Math.round(Math.min(epfWages, this.epfWageCeiling) * 0.0833), 1250);
    const epfEmployerDiff = employerContribution - epsContribution;
    const adminCharges = Math.round(epfWages * 0.005);
    const edliCharges = Math.round(Math.min(epfWages, this.epfWageCeiling) * 0.005);

    const issues = [];
    if (!employeeRecord.panNumber && !employeeRecord.uanNumber) {
      issues.push('Missing UAN / PAN linkage for EPFO member verification.');
    }
    if (epfWages < 10000 && employeeRecord.employmentType === 'FULL_TIME') {
      issues.push('EPF wages fall below standard minimum floor threshold.');
    }

    return {
      module: 'EPFO_COMPLIANCE',
      isCompliant: issues.length === 0,
      isMandatoryEnrollment: isMandatory,
      epfWages,
      contributions: {
        employee12Pct: employeeDeduction,
        employerTotal12Pct: employerContribution,
        epsAccount10: epsContribution,
        epfAccount1Diff: epfEmployerDiff,
        adminChargesAccount2: adminCharges,
        edliChargesAccount21: edliCharges,
        totalMonthlyStatutoryRemittance: employeeDeduction + employerContribution + adminCharges + edliCharges
      },
      auditIssues: issues,
      recommendedActions: issues.map(iss => `Resolve: ${iss}`)
    };
  }

  auditESICCompliance(employeeRecord, monthlyGrossWage) {
    const isApplicableWage = monthlyGrossWage <= this.esicWageCeiling;
    const issues = [];

    let employeeShare = 0;
    let employerShare = 0;

    if (isApplicableWage) {
      employeeShare = Math.round(monthlyGrossWage * 0.0075); // 0.75%
      employerShare = Math.round(monthlyGrossWage * 0.0325); // 3.25%

      if (!employeeRecord.esicInsuranceNumber) {
        issues.push('Employee is under ESIC wage ceiling (₹21,000) but lacks active ESIC Insurance Number.');
      }
    }

    return {
      module: 'ESIC_COMPLIANCE',
      isApplicable: isApplicableWage,
      isCompliant: issues.length === 0,
      monthlyGrossWage,
      deductions: {
        employee0_75Pct: employeeShare,
        employer3_25Pct: employerShare,
        totalRemittance: employeeShare + employerShare
      },
      auditIssues: issues
    };
  }

  auditPOSHCompliance(organizationData = {}) {
    const totalStaff = organizationData.totalEmployees || 0;
    const femaleStaffCount = organizationData.femaleEmployees || 0;
    const iccMembers = organizationData.internalComplaintsCommitteeMembers || [];
    const externalMemberPresent = organizationData.hasExternalNgoMember || false;
    const annualReportFiled = organizationData.annualPoshReportFiled || false;

    const issues = [];
    const isIccRequired = totalStaff >= this.iccMandatoryStaffCount;

    if (isIccRequired) {
      if (iccMembers.length < 4) {
        issues.push(`Internal Committee (ICC) requires minimum 4 members (Currently has ${iccMembers.length}).`);
      }
      const femaleMembers = iccMembers.filter(m => m.gender === 'Female' || m.isFemale);
      if (femaleMembers.length < Math.ceil(iccMembers.length / 2)) {
        issues.push('At least 50% of ICC members must be women.');
      }
      if (!externalMemberPresent) {
        issues.push('ICC must include one external member from an NGO or familiar with women’s rights.');
      }
      if (!annualReportFiled) {
        issues.push('Annual POSH report must be submitted to the District Officer before 31st January.');
      }
    }

    return {
      module: 'POSH_ACT_2013',
      isCompliant: issues.length === 0,
      totalHeadcount: totalStaff,
      femaleStaffCount,
      iccMandatory: isIccRequired,
      committeeStatus: {
        memberCount: iccMembers.length,
        hasExternalMember: externalMemberPresent,
        annualReportFiled
      },
      auditIssues: issues,
      complianceScore: Math.max(0, 100 - (issues.length * 25))
    };
  }

  auditMaternityAndCrecheCompliance(organizationData = {}) {
    const totalStaff = organizationData.totalEmployees || 0;
    const isCrecheMandatory = totalStaff >= this.crecheMandatoryStaffCount;
    const hasCrecheFacility = organizationData.hasCrecheFacility || false;
    const issues = [];

    if (isCrecheMandatory && !hasCrecheFacility) {
      issues.push(`Establishment has ${totalStaff} employees (>= 50 threshold) but lacks mandatory creche facility.`);
    }

    return {
      module: 'MATERNITY_BENEFIT_ACT',
      isCompliant: issues.length === 0,
      crecheMandatory: isCrecheMandatory,
      hasCrecheFacility,
      statutoryLeavesEntitlementWeeks: {
        firstTwoSurvivingChildren: this.maternityBenefitPaidWeeks,
        subsequentChildren: this.maternityBenefitSubsequentWeeks
      },
      auditIssues: issues
    };
  }

  runFullEnterpriseAudit(organizationData = {}, employees = []) {
    const epfIssues = [];
    const esicIssues = [];

    let totalEPFMonthlyLiability = 0;
    let totalESICMonthlyLiability = 0;

    employees.forEach(emp => {
      const monthlyGross = Math.round((emp.salary || 0) / 12);
      const epfResult = this.auditEPFCompliance(emp, { basic: Math.round(monthlyGross * 0.5) });
      const esicResult = this.auditESICCompliance(emp, monthlyGross);

      if (!epfResult.isCompliant) {
        epfIssues.push({ employeeId: emp.employeeId, name: `${emp.firstName} ${emp.lastName}`, issues: epfResult.auditIssues });
      }
      if (!esicResult.isCompliant) {
        esicIssues.push({ employeeId: emp.employeeId, name: `${emp.firstName} ${emp.lastName}`, issues: esicResult.auditIssues });
      }

      totalEPFMonthlyLiability += epfResult.contributions.totalMonthlyStatutoryRemittance;
      totalESICMonthlyLiability += esicResult.deductions.totalRemittance;
    });

    const poshResult = this.auditPOSHCompliance({
      totalEmployees: employees.length,
      femaleEmployees: employees.filter(e => e.gender === 'Female').length,
      ...organizationData
    });

    const maternityResult = this.auditMaternityAndCrecheCompliance({
      totalEmployees: employees.length,
      ...organizationData
    });

    const allModulesCompliant =
      epfIssues.length === 0 &&
      esicIssues.length === 0 &&
      poshResult.isCompliant &&
      maternityResult.isCompliant;

    return {
      auditTimestamp: new Date().toISOString(),
      overallStatus: allModulesCompliant ? 'FULLY_COMPLIANT' : 'ACTION_REQUIRED',
      healthScore: allModulesCompliant ? 100 : Math.max(40, 100 - (epfIssues.length + esicIssues.length + poshResult.auditIssues.length) * 5),
      summary: {
        totalEmployeesAudited: employees.length,
        epfDeficienciesCount: epfIssues.length,
        esicDeficienciesCount: esicIssues.length,
        totalMonthlyEPFRemittance: totalEPFMonthlyLiability,
        totalMonthlyESICRemittance: totalESICMonthlyLiability
      },
      moduleAudits: {
        epfo: { isCompliant: epfIssues.length === 0, nonCompliantRecords: epfIssues.slice(0, 10) },
        esic: { isCompliant: esicIssues.length === 0, nonCompliantRecords: esicIssues.slice(0, 10) },
        posh: poshResult,
        maternityAndCreche: maternityResult
      }
    };
  }
}

const complianceEngine = new ComplianceEngine();

module.exports = {
  ComplianceEngine,
  complianceEngine
};
