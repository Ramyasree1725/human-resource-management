/**
 * Flexible Benefit Plan (FBP) & Expense Reimbursement Engine
 * Validates tax-free flexible allowances & expense submissions:
 * - Leave Travel Allowance (LTA) block year verification
 * - Driver & Fuel reimbursement allowance rules (Rule 3)
 * - Telecommunication / Broadband business expense limits
 * - Books, Periodicals & Professional Certification claims
 * - Relocation & Transfer allowance reimbursement validation.
 */

export const FBP_COMPONENT_LIMITS = {
  LEAVE_TRAVEL_ALLOWANCE: {
    code: 'LTA',
    name: 'Leave Travel Concession / Allowance',
    currentBlock: '2026-2029',
    maxJourneysPerBlock: 2,
    taxExemptionRules: 'Air economy fare on national carrier or AC 1st class rail fare via shortest route.'
  },
  FUEL_AND_MAINTENANCE: {
    code: 'FUEL_CAR',
    name: 'Motor Car Fuel & Maintenance Allowance',
    engineCapacityUpto1600cc: 1800, // ₹1,800/month
    engineCapacityAbove1600cc: 2400, // ₹2,400/month
    driverSalaryAllowance: 900 // ₹900/month
  },
  TELEPHONE_INTERNET: {
    code: 'TELECOM',
    name: 'Broadband & Mobile Bill Reimbursement',
    monthlyLimit: 3000,
    annualLimit: 36000,
    requiresTaxInvoice: true
  },
  BOOKS_AND_PERIODICALS: {
    code: 'BOOKS',
    name: 'Professional Books & Learning Subscriptions',
    monthlyLimit: 2500,
    annualLimit: 30000,
    requiresTaxInvoice: true
  },
  FOOD_MEAL_COUPONS: {
    code: 'MEAL_VOUCHERS',
    name: 'Meal Coupons / Sodexo Card',
    perMealExemption: 50,
    monthlyLimit: 2200 // ₹50 * 2 meals * 22 working days
  },
  RELOCATION_ALLOWANCE: {
    code: 'RELOCATION',
    name: 'Employee Transfer & Relocation Package',
    components: ['Packing & Moving', 'Initial 15 Days Hotel Stay', 'Air/Train Fare for Family', 'Brokerage Assistance'],
    maxLimit: 150000
  }
};

export class ReimbursementClaimEngine {
  constructor() {
    this.currentLtaBlock = '2026-2029';
  }

  validateTelecomClaim(claimData = {}) {
    const { monthlyBillAmount = 0, invoiceAttached = true, gstinPresent = true } = claimData;
    const maxAllowed = FBP_COMPONENT_LIMITS.TELEPHONE_INTERNET.monthlyLimit;

    const issues = [];
    if (!invoiceAttached) issues.push('Tax invoice receipt mandatory for telecom reimbursement.');
    if (monthlyBillAmount <= 0) issues.push('Claim amount must be greater than zero.');

    const approvedAmount = Math.min(monthlyBillAmount, maxAllowed);
    const taxableSurplus = Math.max(0, monthlyBillAmount - maxAllowed);

    return {
      component: 'TELEPHONE_INTERNET',
      claimSubmitted: monthlyBillAmount,
      maxMonthlyCap: maxAllowed,
      approvedTaxFreeAmount: issues.length === 0 ? approvedAmount : 0,
      taxableSurplus,
      isValid: issues.length === 0,
      validationIssues: issues
    };
  }

  validateLTAClaim(claimData = {}) {
    const {
      journeyDate,
      modeOfTravel = 'AIR', // 'AIR', 'RAIL', 'ROAD'
      originCity,
      destinationCity,
      totalFareAmount = 0,
      claimsUsedInBlock = 0,
      isShortestRoute = true,
      hasTicketsAttached = true
    } = claimData;

    const issues = [];
    if (claimsUsedInBlock >= 2) {
      issues.push(`LTA block quota exhausted (${claimsUsedInBlock}/2 claims already utilized in block ${this.currentLtaBlock}).`);
    }
    if (!hasTicketsAttached) {
      issues.push('Original travel boarding passes and e-tickets mandatory for audit.');
    }
    if (!isShortestRoute) {
      issues.push('Travel was not undertaken via the shortest direct route; fare capped to standard direct itinerary.');
    }

    return {
      component: 'LTA',
      currentBlockYear: this.currentLtaBlock,
      travelMode: modeOfTravel,
      origin: originCity,
      destination: destinationCity,
      claimSubmitted: totalFareAmount,
      approvedTaxFreeAmount: issues.length === 0 ? totalFareAmount : 0,
      isValid: issues.length === 0,
      validationIssues: issues,
      remainingClaimsInBlock: Math.max(0, 2 - claimsUsedInBlock - (issues.length === 0 ? 1 : 0))
    };
  }

  validateCarFuelClaim(engineCapacityCC = 1500, hasChauffeur = false, monthlyExpense = 0) {
    const isOver1600 = engineCapacityCC > 1600;
    const carLimit = isOver1600
      ? FBP_COMPONENT_LIMITS.FUEL_AND_MAINTENANCE.engineCapacityAbove1600cc
      : FBP_COMPONENT_LIMITS.FUEL_AND_MAINTENANCE.engineCapacityUpto1600cc;

    const driverLimit = hasChauffeur ? FBP_COMPONENT_LIMITS.FUEL_AND_MAINTENANCE.driverSalaryAllowance : 0;
    const totalTaxFreeMonthlyLimit = carLimit + driverLimit;

    const approvedAmount = Math.min(monthlyExpense, totalTaxFreeMonthlyLimit);

    return {
      component: 'CAR_FUEL_AND_MAINTENANCE',
      engineCapacity: `${engineCapacityCC} cc`,
      hasChauffeur,
      carAllowanceLimit: carLimit,
      driverAllowanceLimit: driverLimit,
      totalMonthlyLimit: totalTaxFreeMonthlyLimit,
      claimSubmitted: monthlyExpense,
      approvedTaxFreeAmount: approvedAmount,
      taxableSurplus: Math.max(0, monthlyExpense - approvedAmount)
    };
  }
}

export const reimbursementClaimEngine = new ReimbursementClaimEngine();
