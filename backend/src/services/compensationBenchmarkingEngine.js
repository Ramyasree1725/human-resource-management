/**
 * Industry Compensation Benchmarking, Compa-Ratio & Pay Equity Engine
 * Evaluates salary competitiveness and pay parity:
 * - Market salary percentiles (P10, P25, P50 Median, P75, P90) by role
 * - Compa-Ratio (CR) = Employee Actual Salary / Midpoint of Salary Band
 * - Range Penetration (RP) percentage inside grade boundaries
 * - Equal Pay & Gender Pay Equity statistical variance analysis.
 */

export const INDUSTRY_SALARY_BENCHMARKS = {
  'Software Architect': { p10: 2200000, p25: 2500000, p50: 2800000, p75: 3200000, p90: 3800000, minBand: 2000000, maxBand: 4000000 },
  'Senior Backend Engineer': { p10: 1400000, p25: 1650000, p50: 1950000, p75: 2300000, p90: 2700000, minBand: 1300000, maxBand: 2800000 },
  'Frontend Specialist': { p10: 1200000, p25: 1450000, p50: 1750000, p75: 2100000, p90: 2500000, minBand: 1100000, maxBand: 2600000 },
  'Product Manager': { p10: 1600000, p25: 1850000, p50: 2150000, p75: 2600000, p90: 3100000, minBand: 1500000, maxBand: 3200000 },
  'HR Specialist': { p10: 850000, p25: 1050000, p50: 1250000, p75: 1500000, p90: 1800000, minBand: 800000, maxBand: 1900000 },
  'Senior Financial Analyst': { p10: 1100000, p25: 1300000, p50: 1550000, p75: 1850000, p90: 2200000, minBand: 1000000, maxBand: 2300000 },
  'Sales Director': { p10: 1600000, p25: 1900000, p50: 2300000, p75: 2800000, p90: 3500000, minBand: 1500000, maxBand: 3600000 },
  'Operations Specialist': { p10: 750000, p25: 900000, p50: 1150000, p75: 1400000, p90: 1650000, minBand: 700000, maxBand: 1700000 },
  'Customer Support Lead': { p10: 700000, p25: 850000, p50: 1050000, p75: 1300000, p90: 1500000, minBand: 650000, maxBand: 1600000 }
};

export class CompensationBenchmarkingEngine {
  constructor() {
    this.targetCompaRatio = 1.0; // 1.0 = exactly on market median
  }

  calculateCompaRatio(actualSalary, designation) {
    const benchmark = INDUSTRY_SALARY_BENCHMARKS[designation] || { minBand: 1000000, maxBand: 2000000, p50: 1500000 };
    const bandMidpoint = (benchmark.minBand + benchmark.maxBand) / 2;
    const compaRatio = Number((actualSalary / bandMidpoint).toFixed(2));
    const rangePenetration = Number((((actualSalary - benchmark.minBand) / (benchmark.maxBand - benchmark.minBand)) * 100).toFixed(1));

    let positioning = 'AT_MARKET_MIDPOINT';
    if (compaRatio < 0.85) positioning = 'UNDERPAID_BELOW_RANGE';
    else if (compaRatio < 0.95) positioning = 'ENTRY_OF_BAND';
    else if (compaRatio > 1.15) positioning = 'OVERPAID_ABOVE_RANGE';
    else if (compaRatio > 1.05) positioning = 'TOP_OF_BAND';

    return {
      designation,
      actualSalary,
      bandMin: benchmark.minBand,
      bandMidpoint,
      bandMax: benchmark.maxBand,
      compaRatio,
      rangePenetrationPercentage: `${rangePenetration}%`,
      positioning,
      marketPercentiles: {
        p25: benchmark.p25 || benchmark.minBand,
        p50Median: benchmark.p50,
        p75: benchmark.p75 || benchmark.maxBand
      }
    };
  }

  auditGenderPayEquity(employees = []) {
    const roleStats = {};

    employees.forEach(emp => {
      const role = emp.designation || 'Associate';
      if (!roleStats[role]) {
        roleStats[role] = { maleSalaries: [], femaleSalaries: [] };
      }
      if (emp.gender === 'Female') {
        roleStats[role].femaleSalaries.push(emp.salary || 0);
      } else {
        roleStats[role].maleSalaries.push(emp.salary || 0);
      }
    });

    const parityReport = Object.keys(roleStats).map(role => {
      const data = roleStats[role];
      const avgMale = data.maleSalaries.length > 0 ? Math.round(data.maleSalaries.reduce((a, b) => a + b, 0) / data.maleSalaries.length) : 0;
      const avgFemale = data.femaleSalaries.length > 0 ? Math.round(data.femaleSalaries.reduce((a, b) => a + b, 0) / data.femaleSalaries.length) : 0;

      const variance = avgMale > 0 ? Number((((avgMale - avgFemale) / avgMale) * 100).toFixed(1)) : 0;
      const isParityEquitable = Math.abs(variance) <= 5.0; // Within 5% variance is compliant

      return {
        designation: role,
        maleHeadcount: data.maleSalaries.length,
        femaleHeadcount: data.femaleSalaries.length,
        avgMaleSalary: avgMale,
        avgFemaleSalary: avgFemale,
        variancePercentage: `${variance}%`,
        status: isParityEquitable ? 'EQUITABLE_PAY_PARITY' : (variance > 0 ? 'MALE_LEANING_GAP' : 'FEMALE_LEANING_GAP')
      };
    });

    return {
      auditDate: new Date().toISOString().split('T')[0],
      totalRolesAudited: parityReport.length,
      equitableRolesCount: parityReport.filter(p => p.status === 'EQUITABLE_PAY_PARITY').length,
      rolesRequiringAdjustment: parityReport.filter(p => p.status !== 'EQUITABLE_PAY_PARITY'),
      fullReport: parityReport
    };
  }
}

export const compensationBenchmarkingEngine = new CompensationBenchmarkingEngine();
