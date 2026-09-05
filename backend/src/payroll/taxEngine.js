/**
 * Tax Computation & Statutory Deduction Engine
 * Implements Indian Income Tax (Old & New Regimes), Surcharges, Cess, Section 80 Deductions,
 * HRA Exemptions, and State-wise Professional Tax Slabs.
 */

const STATE_PT_SLABS = {
  KARNATAKA: [
    { minMonthly: 0, maxMonthly: 15000, tax: 0 },
    { minMonthly: 15001, maxMonthly: Infinity, tax: 200 }
  ],
  MAHARASHTRA: [
    { minMonthly: 0, maxMonthly: 7500, tax: 0 },
    { minMonthly: 7501, maxMonthly: 10000, tax: 175 },
    { minMonthly: 10001, maxMonthly: Infinity, tax: 200, febTax: 300 }
  ],
  TELANGANA: [
    { minMonthly: 0, maxMonthly: 15000, tax: 0 },
    { minMonthly: 15001, maxMonthly: 20000, tax: 150 },
    { minMonthly: 20001, maxMonthly: Infinity, tax: 200 }
  ],
  ANDHRA_PRADESH: [
    { minMonthly: 0, maxMonthly: 15000, tax: 0 },
    { minMonthly: 15001, maxMonthly: 20000, tax: 150 },
    { minMonthly: 20001, maxMonthly: Infinity, tax: 200 }
  ],
  TAMIL_NADU: [
    { minMonthly: 0, maxMonthly: 21000, tax: 0 },
    { minMonthly: 21001, maxMonthly: 30000, tax: 100 },
    { minMonthly: 30001, maxMonthly: 45000, tax: 235 },
    { minMonthly: 45001, maxMonthly: 60000, tax: 510 },
    { minMonthly: 60001, maxMonthly: 75000, tax: 760 },
    { minMonthly: 75001, maxMonthly: Infinity, tax: 1095 }
  ],
  DELHI: [
    { minMonthly: 0, maxMonthly: Infinity, tax: 0 }
  ],
  WEST_BENGAL: [
    { minMonthly: 0, maxMonthly: 10000, tax: 0 },
    { minMonthly: 10001, maxMonthly: 15000, tax: 110 },
    { minMonthly: 15001, maxMonthly: 25000, tax: 130 },
    { minMonthly: 25001, maxMonthly: 40000, tax: 150 },
    { minMonthly: 40001, maxMonthly: Infinity, tax: 200 }
  ],
  GUJARAT: [
    { minMonthly: 0, maxMonthly: 12000, tax: 0 },
    { minMonthly: 12001, maxMonthly: Infinity, tax: 200 }
  ]
};

const NEW_REGIME_SLABS_FY26 = [
  { min: 0, max: 300000, rate: 0.00 },
  { min: 300000, max: 700000, rate: 0.05 },
  { min: 700000, max: 1000000, rate: 0.10 },
  { min: 1000000, max: 1200000, rate: 0.15 },
  { min: 1200000, max: 1500000, rate: 0.20 },
  { min: 1500000, max: Infinity, rate: 0.30 }
];

const OLD_REGIME_SLABS_FY26 = [
  { min: 0, max: 250000, rate: 0.00 },
  { min: 250000, max: 500000, rate: 0.05 },
  { min: 500000, max: 1000000, rate: 0.20 },
  { min: 1000000, max: Infinity, rate: 0.30 }
];

const SURCHARGE_SLABS = [
  { threshold: 5000000, max: 10000000, rate: 0.10 },
  { threshold: 10000000, max: 20000000, rate: 0.15 },
  { threshold: 20000000, max: 50000000, rate: 0.25 },
  { threshold: 50000000, max: Infinity, rate: 0.37 }
];

class TaxEngine {
  constructor(options = {}) {
    this.financialYear = options.financialYear || '2026-2027';
    this.assessmentYear = options.assessmentYear || '2027-2028';
    this.standardDeductionNew = 75000;
    this.standardDeductionOld = 50000;
    this.rebateLimitNew = 700000;
    this.rebateLimitOld = 500000;
    this.cessRate = 0.04;
  }

  calculateProfessionalTax(monthlyGross, state = 'KARNATAKA', month = 1) {
    const normalizedState = state.toUpperCase().replace(/\s+/g, '_');
    const slabs = STATE_PT_SLABS[normalizedState] || STATE_PT_SLABS.KARNATAKA;

    for (const slab of slabs) {
      if (monthlyGross >= slab.minMonthly && monthlyGross <= slab.maxMonthly) {
        if (month === 2 && slab.febTax) {
          return slab.febTax;
        }
        return slab.tax;
      }
    }
    return 200;
  }

  calculateAnnualPT(annualGross, state = 'KARNATAKA') {
    const monthlyGross = Math.round(annualGross / 12);
    let totalPT = 0;
    for (let month = 1; month <= 12; month++) {
      totalPT += this.calculateProfessionalTax(monthlyGross, state, month);
    }
    return totalPT;
  }

  calculateHRAExemption(basicSalary, hraReceived, actualRentPaid, isMetro = true) {
    if (!actualRentPaid || actualRentPaid <= 0) return 0;
    const rentMinusTenPercentBasic = Math.max(0, actualRentPaid - (0.10 * basicSalary));
    const percentageCap = isMetro ? (0.50 * basicSalary) : (0.40 * basicSalary);
    const exemption = Math.min(hraReceived, rentMinusTenPercentBasic, percentageCap);
    return Math.max(0, Math.round(exemption));
  }

  calculateSection80C(declarations = {}) {
    const {
      epfEmployee = 0,
      ppf = 0,
      elss = 0,
      lifeInsurancePremium = 0,
      homeLoanPrincipal = 0,
      tuitionFees = 0,
      nsc = 0,
      sukanyaSamriddhi = 0
    } = declarations;

    const totalClaimed = epfEmployee + ppf + elss + lifeInsurancePremium + homeLoanPrincipal + tuitionFees + nsc + sukanyaSamriddhi;
    const maxLimit = 150000;
    return {
      claimed: totalClaimed,
      allowed: Math.min(totalClaimed, maxLimit),
      breakdown: {
        epfEmployee,
        ppf,
        elss,
        lifeInsurancePremium,
        homeLoanPrincipal,
        tuitionFees,
        nsc,
        sukanyaSamriddhi
      }
    };
  }

  calculateSection80D(declarations = {}) {
    const {
      selfFamilyPremium = 0,
      selfFamilySenior = false,
      parentsPremium = 0,
      parentsSenior = false,
      preventiveCheckup = 0
    } = declarations;

    const selfLimit = selfFamilySenior ? 50000 : 25000;
    const parentsLimit = parentsSenior ? 50000 : 25000;
    const allowedCheckup = Math.min(preventiveCheckup, 5000);

    const allowedSelf = Math.min(selfFamilyPremium + allowedCheckup, selfLimit);
    const remainingCheckup = Math.max(0, allowedCheckup - (allowedSelf - selfFamilyPremium));
    const allowedParents = Math.min(parentsPremium + remainingCheckup, parentsLimit);

    return {
      allowedSelf,
      allowedParents,
      totalAllowed: allowedSelf + allowedParents
    };
  }

  calculateSection80CCD(npsEmployee = 0, npsEmployer = 0, basicSalary = 0) {
    const max80CCD1B = 50000;
    const allowed80CCD1B = Math.min(npsEmployee, max80CCD1B);
    const maxEmployerAllowed = 0.14 * basicSalary;
    const allowed80CCD2 = Math.min(npsEmployer, maxEmployerAllowed);

    return {
      allowed80CCD1B,
      allowed80CCD2,
      totalAllowed: allowed80CCD1B + allowed80CCD2
    };
  }

  calculateSection24(homeLoanInterest = 0, isSelfOccupied = true) {
    if (isSelfOccupied) {
      return Math.min(homeLoanInterest, 200000);
    }
    return homeLoanInterest;
  }

  computeTaxUnderNewRegime(taxableIncome) {
    let income = Math.max(0, taxableIncome);
    let tax = 0;
    const slabBreakdown = [];

    for (const slab of NEW_REGIME_SLABS_FY26) {
      if (income > slab.min) {
        const taxableAmountInSlab = Math.min(income, slab.max) - slab.min;
        const slabTax = taxableAmountInSlab * slab.rate;
        tax += slabTax;
        slabBreakdown.push({
          slabRange: `${slab.min} - ${slab.max === Infinity ? 'Above' : slab.max}`,
          taxableAmount: taxableAmountInSlab,
          rate: `${slab.rate * 100}%`,
          tax: slabTax
        });
      }
    }

    let rebate = 0;
    if (income <= this.rebateLimitNew) {
      rebate = tax;
      tax = 0;
    }

    const surcharge = this.computeSurcharge(income, tax);
    const cess = (tax + surcharge) * this.cessRate;
    const totalTax = Math.round(tax + surcharge + cess);

    return {
      regime: 'NEW',
      taxableIncome,
      baseTax: Math.round(tax + rebate),
      rebate: Math.round(rebate),
      netBaseTax: Math.round(tax),
      surcharge: Math.round(surcharge),
      cess: Math.round(cess),
      totalTax,
      effectiveRate: taxableIncome > 0 ? ((totalTax / taxableIncome) * 100).toFixed(2) : '0.00',
      slabBreakdown
    };
  }

  computeTaxUnderOldRegime(taxableIncome) {
    let income = Math.max(0, taxableIncome);
    let tax = 0;
    const slabBreakdown = [];

    for (const slab of OLD_REGIME_SLABS_FY26) {
      if (income > slab.min) {
        const taxableAmountInSlab = Math.min(income, slab.max) - slab.min;
        const slabTax = taxableAmountInSlab * slab.rate;
        tax += slabTax;
        slabBreakdown.push({
          slabRange: `${slab.min} - ${slab.max === Infinity ? 'Above' : slab.max}`,
          taxableAmount: taxableAmountInSlab,
          rate: `${slab.rate * 100}%`,
          tax: slabTax
        });
      }
    }

    let rebate = 0;
    if (income <= this.rebateLimitOld) {
      rebate = Math.min(tax, 12500);
      tax = Math.max(0, tax - rebate);
    }

    const surcharge = this.computeSurcharge(income, tax);
    const cess = (tax + surcharge) * this.cessRate;
    const totalTax = Math.round(tax + surcharge + cess);

    return {
      regime: 'OLD',
      taxableIncome,
      baseTax: Math.round(tax + rebate),
      rebate: Math.round(rebate),
      netBaseTax: Math.round(tax),
      surcharge: Math.round(surcharge),
      cess: Math.round(cess),
      totalTax,
      effectiveRate: taxableIncome > 0 ? ((totalTax / taxableIncome) * 100).toFixed(2) : '0.00',
      slabBreakdown
    };
  }

  computeSurcharge(taxableIncome, baseTax) {
    if (baseTax <= 0) return 0;
    for (let i = SURCHARGE_SLABS.length - 1; i >= 0; i--) {
      const slab = SURCHARGE_SLABS[i];
      if (taxableIncome > slab.threshold) {
        return baseTax * slab.rate;
      }
    }
    return 0;
  }

  compareRegimesAndRecommend(employeeSalaryData, investmentDeclarations = {}) {
    const annualCTC = employeeSalaryData.salary || 0;
    const basicPay = Math.round(annualCTC * 0.50);
    const hraReceived = Math.round(annualCTC * 0.20);
    const state = employeeSalaryData.workLocationState || 'KARNATAKA';
    const annualPT = this.calculateAnnualPT(annualCTC, state);

    // New Regime Computation
    const newRegimeTaxable = Math.max(0, annualCTC - this.standardDeductionNew);
    const newRegimeResult = this.computeTaxUnderNewRegime(newRegimeTaxable);

    // Old Regime Computation
    const hraExempt = this.calculateHRAExemption(
      basicPay,
      hraReceived,
      investmentDeclarations.annualRentPaid || 0,
      investmentDeclarations.isMetroCity !== false
    );
    const sec80C = this.calculateSection80C(investmentDeclarations.section80C || {});
    const sec80D = this.calculateSection80D(investmentDeclarations.section80D || {});
    const sec80CCD = this.calculateSection80CCD(
      investmentDeclarations.npsEmployee || 0,
      investmentDeclarations.npsEmployer || 0,
      basicPay
    );
    const homeLoanInt = this.calculateSection24(investmentDeclarations.homeLoanInterest || 0);

    const totalOldDeductions =
      this.standardDeductionOld +
      annualPT +
      hraExempt +
      sec80C.allowed +
      sec80D.totalAllowed +
      sec80CCD.totalAllowed +
      homeLoanInt;

    const oldRegimeTaxable = Math.max(0, annualCTC - totalOldDeductions);
    const oldRegimeResult = this.computeTaxUnderOldRegime(oldRegimeTaxable);

    const savings = Math.abs(oldRegimeResult.totalTax - newRegimeResult.totalTax);
    const recommendedRegime = newRegimeResult.totalTax <= oldRegimeResult.totalTax ? 'NEW' : 'OLD';

    return {
      annualCTC,
      basicPay,
      annualPT,
      newRegime: {
        standardDeduction: this.standardDeductionNew,
        taxableIncome: newRegimeTaxable,
        ...newRegimeResult
      },
      oldRegime: {
        standardDeduction: this.standardDeductionOld,
        hraExemption: hraExempt,
        section80CAllowed: sec80C.allowed,
        section80DAllowed: sec80D.totalAllowed,
        section80CCDAllowed: sec80CCD.totalAllowed,
        homeLoanInterestAllowed: homeLoanInt,
        totalDeductions: totalOldDeductions,
        taxableIncome: oldRegimeTaxable,
        ...oldRegimeResult
      },
      recommendation: {
        bestRegime: recommendedRegime,
        annualTaxSavings: savings,
        monthlyTaxSavings: Math.round(savings / 12),
        rationale: recommendedRegime === 'NEW'
          ? `New Tax Regime saves ₹${savings.toLocaleString('en-IN')} annually due to lower slab rates & ₹75k standard deduction.`
          : `Old Tax Regime saves ₹${savings.toLocaleString('en-IN')} annually due to high investment & rent deductions.`
      }
    };
  }

  generateMonthlyTDSProjection(employeeSalaryData, investmentDeclarations = {}, currentMonthIndex = 1) {
    const comparison = this.compareRegimesAndRecommend(employeeSalaryData, investmentDeclarations);
    const chosenRegime = employeeSalaryData.taxRegime || comparison.recommendation.bestRegime;
    const taxResult = chosenRegime === 'NEW' ? comparison.newRegime : comparison.oldRegime;
    const totalAnnualTax = taxResult.totalTax;

    const monthsRemaining = Math.max(1, 12 - currentMonthIndex + 1);
    const taxAlreadyDeducted = employeeSalaryData.ytdTaxDeducted || 0;
    const remainingTax = Math.max(0, totalAnnualTax - taxAlreadyDeducted);
    const monthlyTDS = Math.round(remainingTax / monthsRemaining);

    return {
      chosenRegime,
      totalAnnualTax,
      taxAlreadyDeducted,
      remainingTax,
      monthsRemaining,
      monthlyTDS,
      tdsSchedule: Array.from({ length: 12 }, (_, i) => {
        const monthNum = i + 1;
        const isPast = monthNum < currentMonthIndex;
        return {
          month: monthNum,
          projectedDeduction: isPast ? (employeeSalaryData.monthlyDeductionHistory?.[i] || monthlyTDS) : monthlyTDS,
          status: isPast ? 'DEDUCTED' : (monthNum === currentMonthIndex ? 'CURRENT' : 'PROJECTED')
        };
      })
    };
  }
}

const taxEngine = new TaxEngine();

module.exports = {
  TaxEngine,
  taxEngine,
  STATE_PT_SLABS,
  NEW_REGIME_SLABS_FY26,
  OLD_REGIME_SLABS_FY26
};
