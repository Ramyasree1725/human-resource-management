/**
 * Workforce Forecasting & Headcount Predictive Engine
 * Models employee turnover risk, departmental budget forecasting,
 * tenure distribution, promotion readiness, and skills supply/demand gaps.
 */

class WorkforceForecastingEngine {
  constructor() {
    this.defaultAnnualGrowthRate = 0.15; // 15% planned growth
    this.marketInflationAdjustment = 0.08; // 8% annual merit increase
    this.standardSpanOfControl = 7; // Manager to reportee optimal ratio
  }

  calculateFlightRiskScore(employee, recentLogs = []) {
    let score = 0;
    const factors = [];

    // Factor 1: Tenure in current role without promotion
    const tenureYears = this.computeTenureYears(employee.joiningDate);
    if (tenureYears >= 3.0 && (!employee.lastPromotionDate || tenureYears > 3)) {
      score += 30;
      factors.push({ factor: 'ROLE_STAGNATION', points: 30, description: 'Over 3 years in current role without grade advancement.' });
    } else if (tenureYears >= 2.0) {
      score += 15;
      factors.push({ factor: 'MILD_STAGNATION', points: 15, description: 'Over 2 years tenure in position.' });
    }

    // Factor 2: High Performance vs Compensation (Underpaid high performer)
    if (employee.performanceRating >= 4.5 && employee.salary < 1500000) {
      score += 25;
      factors.push({ factor: 'COMPENSATION_GAP', points: 25, description: 'Top performer with below-benchmark compensation.' });
    }

    // Factor 3: Notice Period or Leave Surges
    if (employee.status === 'NOTICE_PERIOD') {
      score = 100;
      factors.push({ factor: 'ACTIVE_RESIGNATION', points: 100, description: 'Currently serving formal notice period.' });
    }

    // Factor 4: Commute / Location Discordance
    if (employee.workLocationId === 'loc_remote' && employee.departmentId === 'dept_ops_001') {
      score += 15;
      factors.push({ factor: 'OPERATIONAL_MISALIGNMENT', points: 15, description: 'Remote operational role with high synchronous demands.' });
    }

    const riskLevel = score >= 60 ? 'HIGH' : score >= 35 ? 'MEDIUM' : 'LOW';

    return {
      employeeId: employee.employeeId,
      name: `${employee.firstName} ${employee.lastName}`,
      departmentId: employee.departmentId,
      flightRiskScore: Math.min(100, score),
      riskLevel,
      contributingFactors: factors,
      retentionAction: riskLevel === 'HIGH'
        ? 'Schedule 1-on-1 career mapping & review compensation band alignment.'
        : riskLevel === 'MEDIUM'
        ? 'Engage in quarterly growth review & project leadership allocation.'
        : 'Maintain standard engagement and recognition cadence.'
    };
  }

  computeTenureYears(joiningDate) {
    if (!joiningDate) return 1.0;
    const diffMs = Date.now() - new Date(joiningDate).getTime();
    return Math.max(0.1, Number((diffMs / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1)));
  }

  forecastDepartmentBudget(employees = [], targetYear = 2027) {
    const deptMap = {};

    employees.forEach(emp => {
      const dept = emp.departmentId || 'dept_gen_001';
      if (!deptMap[dept]) {
        deptMap[dept] = {
          departmentId: dept,
          currentHeadcount: 0,
          currentAnnualCTC: 0,
          employees: []
        };
      }
      deptMap[dept].currentHeadcount += 1;
      deptMap[dept].currentAnnualCTC += (emp.salary || 0);
      deptMap[dept].employees.push(emp);
    });

    const projections = Object.keys(deptMap).map(deptKey => {
      const data = deptMap[deptKey];
      const avgSalary = Math.round(data.currentAnnualCTC / Math.max(1, data.currentHeadcount));

      // Forecast headcount expansion based on strategic department multiplier
      const expansionRate = deptKey === 'dept_eng_001' || deptKey === 'dept_res_001' ? 0.25 : 0.10;
      const plannedAdditions = Math.ceil(data.currentHeadcount * expansionRate);
      const projectedHeadcount = data.currentHeadcount + plannedAdditions;

      // Merit increment on existing staff (8%) + new hires cost
      const existingStaffProjectedCTC = Math.round(data.currentAnnualCTC * (1 + this.marketInflationAdjustment));
      const newHiresProjectedCTC = Math.round(plannedAdditions * avgSalary * 1.05);
      const totalProjectedAnnualCTC = existingStaffProjectedCTC + newHiresProjectedCTC;

      return {
        departmentId: deptKey,
        currentHeadcount: data.currentHeadcount,
        currentAnnualCTC: data.currentAnnualCTC,
        avgSalaryPerEmployee: avgSalary,
        projectedAdditions: plannedAdditions,
        targetHeadcount: projectedHeadcount,
        projectedAnnualCTC: totalProjectedAnnualCTC,
        budgetDelta: totalProjectedAnnualCTC - data.currentAnnualCTC,
        percentageIncrease: Number((((totalProjectedAnnualCTC - data.currentAnnualCTC) / data.currentAnnualCTC) * 100).toFixed(1))
      };
    });

    const totalCurrentBudget = projections.reduce((acc, p) => acc + p.currentAnnualCTC, 0);
    const totalProjectedBudget = projections.reduce((acc, p) => acc + p.projectedAnnualCTC, 0);

    return {
      forecastYear: targetYear,
      totalCurrentAnnualBudget: totalCurrentBudget,
      totalProjectedAnnualBudget: totalProjectedBudget,
      overallBudgetGrowthPercentage: Number((((totalProjectedBudget - totalCurrentBudget) / totalCurrentBudget) * 100).toFixed(1)),
      departmentalProjections: projections
    };
  }

  analyzeSkillsGapAndTalentPipeline(employees = []) {
    const requiredSkillFrequencies = {
      'React': 15,
      'TypeScript': 15,
      'Python': 12,
      'AWS': 12,
      'Docker': 10,
      'Kubernetes': 8,
      'Machine Learning': 6,
      'System Architecture': 8,
      'UI/UX Design': 6,
      'Talent Acquisition': 5,
      'Financial Modeling': 6
    };

    const currentSkillCounts = {};
    employees.forEach(emp => {
      (emp.skills || []).forEach(skill => {
        currentSkillCounts[skill] = (currentSkillCounts[skill] || 0) + 1;
      });
    });

    const gapAnalysis = Object.keys(requiredSkillFrequencies).map(skillName => {
      const required = requiredSkillFrequencies[skillName];
      const available = currentSkillCounts[skillName] || 0;
      const deficit = Math.max(0, required - available);
      const coverageRate = Number(((available / required) * 100).toFixed(0));

      return {
        skill: skillName,
        requiredCount: required,
        availableCount: available,
        deficit,
        coverageRate: `${Math.min(100, coverageRate)}%`,
        status: deficit === 0 ? 'HEALTHY' : deficit <= 2 ? 'MODERATE_SHORTAGE' : 'CRITICAL_DEFICIT'
      };
    });

    return {
      timestamp: new Date().toISOString(),
      skillsAudited: gapAnalysis.length,
      criticalDeficits: gapAnalysis.filter(g => g.status === 'CRITICAL_DEFICIT'),
      fullSkillReport: gapAnalysis
    };
  }

  evaluatePromotionReadiness(employees = []) {
    return employees.map(emp => {
      const tenure = this.computeTenureYears(emp.joiningDate);
      const rating = emp.performanceRating || 3;
      const skillsCount = (emp.skills || []).length;

      let readinessScore = 0;
      if (rating >= 4.5) readinessScore += 45;
      else if (rating >= 4.0) readinessScore += 30;
      else if (rating >= 3.5) readinessScore += 15;

      if (tenure >= 2.5) readinessScore += 35;
      else if (tenure >= 1.5) readinessScore += 20;
      else if (tenure >= 1.0) readinessScore += 10;

      if (skillsCount >= 5) readinessScore += 20;
      else if (skillsCount >= 3) readinessScore += 10;

      const isReady = readinessScore >= 75;

      return {
        employeeId: emp.employeeId,
        name: `${emp.firstName} ${emp.lastName}`,
        designation: emp.designation,
        departmentId: emp.departmentId,
        readinessScore,
        promotionStatus: isReady ? 'RECOMMENDED_FOR_PROMOTION' : readinessScore >= 55 ? 'HIGH_POTENTIAL' : 'IN_DEVELOPMENT',
        tenureYears: tenure,
        performanceRating: rating
      };
    });
  }
}

const workforceForecastingEngine = new WorkforceForecastingEngine();

module.exports = {
  WorkforceForecastingEngine,
  workforceForecastingEngine
};
