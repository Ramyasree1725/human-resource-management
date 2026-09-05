/**
 * Employee Wellbeing, Health Insurance & Group Benefits Engine
 * Manages corporate wellness and insurance plans:
 * - Group Mediclaim (GMC) family floater sum insured matrices
 * - Group Personal Accident (GPA) & Group Term Life (GTL) coverage calculation
 * - Employee Assistance Program (EAP) session allowances
 * - Annual health checkup benefit entitlement and claim processing.
 */

export const INSURANCE_BAND_COVERAGE = {
  BAND_1_ASSOCIATES: {
    gmcSumInsured: 500000, // 5 Lakhs
    gtlCoverageMultiplier: 3.0, // 3x Annual CTC
    gpaCoverageMultiplier: 3.0,
    maternityCover: 75000,
    corporateBufferAccessLimit: 100000,
    coveredDependents: 'Self + Spouse + 2 Children',
    parentsCoverageOption: 'Optional Co-pay (80:20)'
  },
  BAND_2_LEADS: {
    gmcSumInsured: 750000, // 7.5 Lakhs
    gtlCoverageMultiplier: 3.5,
    gpaCoverageMultiplier: 3.5,
    maternityCover: 100000,
    corporateBufferAccessLimit: 200000,
    coveredDependents: 'Self + Spouse + 2 Children + 2 Dependent Parents',
    parentsCoverageOption: 'Employer Subsidized (90:10)'
  },
  BAND_3_DIRECTORS: {
    gmcSumInsured: 1000000, // 10 Lakhs
    gtlCoverageMultiplier: 4.0,
    gpaCoverageMultiplier: 4.0,
    maternityCover: 150000,
    corporateBufferAccessLimit: 500000,
    coveredDependents: 'Self + Spouse + 3 Children + 2 Dependent Parents / In-laws',
    parentsCoverageOption: '100% Employer Funded'
  }
};

export const WELLNESS_BENEFIT_CATALOGUE = [
  { benefitId: 'wb_gym_01', name: 'Fitness / Gym Membership Reimbursement', annualAllowance: 18000, monthlyLimit: 1500, category: 'PHYSICAL_WELLNESS' },
  { benefitId: 'wb_health_02', name: 'Comprehensive Annual Executive Health Checkup', annualAllowance: 5000, frequency: 'Once per financial year', category: 'PREVENTIVE_HEALTH' },
  { benefitId: 'wb_eap_03', name: 'Confidential EAP Mental Health & Counseling Sessions', annualSessions: 8, freePerEmployee: true, category: 'MENTAL_WELLNESS' },
  { benefitId: 'wb_dental_04', name: 'Preventive Dental & Vision Care Package', annualAllowance: 6000, coPayPercentage: 10, category: 'OUTPATIENT_CARE' },
  { benefitId: 'wb_ergonomic_05', name: 'Ergonomic Work-From-Home Chair / Desk Setup Grant', oneTimeAllowance: 15000, validityYears: 3, category: 'WORKPLACE_HEALTH' }
];

export class EmployeeWellbeingAndBenefitsEngine {
  constructor() {
    this.tpaName = 'MediAssist / Vidal Health TPA';
  }

  evaluateInsuranceEntitlement(employee = {}) {
    const salary = employee.salary || 1000000;
    let applicableBand = INSURANCE_BAND_COVERAGE.BAND_1_ASSOCIATES;

    if (salary >= 2500000) {
      applicableBand = INSURANCE_BAND_COVERAGE.BAND_3_DIRECTORS;
    } else if (salary >= 1500000) {
      applicableBand = INSURANCE_BAND_COVERAGE.BAND_2_LEADS;
    }

    const annualCTC = employee.salary || 1000000;
    const gtlSumAssured = Math.round(annualCTC * applicableBand.gtlCoverageMultiplier);
    const gpaSumAssured = Math.round(annualCTC * applicableBand.gpaCoverageMultiplier);

    return {
      employeeId: employee.employeeId,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      tpaPartner: this.tpaName,
      policyValidUntil: '2027-03-31',
      groupMediclaim: {
        sumInsured: applicableBand.gmcSumInsured,
        formattedSumInsured: `₹${(applicableBand.gmcSumInsured / 100000).toFixed(1)} Lakhs`,
        maternityBenefitCap: applicableBand.maternityCover,
        corporateBufferEligibility: applicableBand.corporateBufferAccessLimit,
        coveredMembers: applicableBand.coveredDependents,
        parentalCoverageTerms: applicableBand.parentsCoverageOption
      },
      groupTermLife: {
        multiplier: `${applicableBand.gtlCoverageMultiplier}x Annual CTC`,
        sumAssured: gtlSumAssured,
        formattedSumAssured: `₹${(gtlSumAssured / 100000).toFixed(1)} Lakhs`
      },
      groupPersonalAccident: {
        multiplier: `${applicableBand.gpaCoverageMultiplier}x Annual CTC`,
        sumAssured: gpaSumAssured,
        formattedSumAssured: `₹${(gpaSumAssured / 100000).toFixed(1)} Lakhs`,
        permanentDisabilityCoverPercentage: 100,
        temporaryTotalDisabilityWeeklyAllowance: Math.min(25000, Math.round(annualCTC / 52))
      }
    };
  }

  processHealthInsuranceClaim(claimData = {}) {
    const {
      claimType = 'CASHLESS', // 'CASHLESS' or 'REIMBURSEMENT'
      hospitalName,
      isNetworkHospital = true,
      admissionDate,
      dischargeDate,
      totalHospitalBillAmount = 0,
      roomRentDailyCharged = 4500,
      gmcSumInsured = 500000
    } = claimData;

    // Room rent cap is standard 1% of Sum Insured per day, ICU 2%
    const standardRoomRentDailyCap = Math.round(gmcSumInsured * 0.01);
    const isRoomRentExcess = roomRentDailyCharged > standardRoomRentDailyCap;
    const roomRentDeductionFactor = isRoomRentExcess ? standardRoomRentDailyCap / roomRentDailyCharged : 1.0;

    const nonMedicalExpensesDeduction = Math.round(totalHospitalBillAmount * 0.05); // approx 5% non-payable consumables
    const proportionateMedicalBill = Math.round((totalHospitalBillAmount - nonMedicalExpensesDeduction) * roomRentDeductionFactor);
    const finalApprovedSettlement = Math.min(proportionateMedicalBill, gmcSumInsured);
    const outOfPocketEmployeeCost = Math.max(0, totalHospitalBillAmount - finalApprovedSettlement);

    return {
      claimId: `CLM-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      claimType,
      hospitalDetails: {
        name: hospitalName,
        isNetworkHospital,
        settlementMode: isNetworkHospital ? 'DIRECT_TPA_CASHLESS' : 'POST_DISCHARGE_REIMBURSEMENT'
      },
      admissibilityBreakdown: {
        totalClaimedAmount: totalHospitalBillAmount,
        roomRentDailyCap: standardRoomRentDailyCap,
        roomRentDailyCharged,
        roomRentProportionatePenaltyApplied: isRoomRentExcess,
        nonMedicalConsumablesDeduction: nonMedicalExpensesDeduction,
        netApprovedAmount: finalApprovedSettlement,
        employeeCoPayOrOutOfPocket: outOfPocketEmployeeCost
      },
      claimSettlementStatus: 'APPROVED_BY_TPA',
      turnaroundTimeDays: isNetworkHospital ? 1 : 7
    };
  }

  evaluateWellnessBenefitUsage(employeeId, benefitClaims = []) {
    const usageReport = WELLNESS_BENEFIT_CATALOGUE.map(benefit => {
      const claimsForBenefit = benefitClaims.filter(c => c.benefitId === benefit.benefitId);
      const totalClaimed = claimsForBenefit.reduce((acc, c) => acc + (c.amount || 0), 0);
      const limit = benefit.annualAllowance || 0;
      const remainingBalance = Math.max(0, limit - totalClaimed);

      return {
        benefitId: benefit.benefitId,
        benefitName: benefit.name,
        category: benefit.category,
        annualAllowance: limit,
        totalUtilizedAmount: totalClaimed,
        availableRemainingBalance: remainingBalance,
        isFullyUtilized: limit > 0 && remainingBalance === 0
      };
    });

    return {
      employeeId,
      evaluationFinancialYear: '2026-2027',
      totalBenefitsAvailable: WELLNESS_BENEFIT_CATALOGUE.length,
      benefitsUsageSummary: usageReport
    };
  }
}

export const employeeWellbeingAndBenefitsEngine = new EmployeeWellbeingAndBenefitsEngine();
