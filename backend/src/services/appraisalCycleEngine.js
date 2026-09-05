/**
 * Annual Performance Appraisal, 360-Degree Feedback & 9-Box Grid Engine
 * Implements performance management cycles:
 * - OKR/KPI weightage aggregation
 * - Peer & Manager 360 review scoring
 * - Forced distribution bell-curve normalization
 * - McKinsey 9-Box Grid Talent Classification (Performance vs Potential).
 */

export const NINE_BOX_GRID_DEFINITIONS = {
  BOX_1: { id: 'STARS', label: '1A - Future Leaders / Stars', performance: 'HIGH', potential: 'HIGH', action: 'Accelerate promotion, assign executive sponsorship and high-impact strategy mandates.' },
  BOX_2: { id: 'HIGH_PERFORMERS', label: '1B - High Performers', performance: 'HIGH', potential: 'MEDIUM', action: 'Expand current role scope, reward with top-tier compensation & retention bonuses.' },
  BOX_3: { id: 'SOLID_EXPERTS', label: '1C - Solid Professionals / Experts', performance: 'HIGH', potential: 'LOW', action: 'Leverage domain expertise for mentorship; recognize consistent excellence without forced management tracks.' },
  BOX_4: { id: 'HIGH_POTENTIALS', label: '2A - High Potentials / Emerging Talent', performance: 'MEDIUM', potential: 'HIGH', action: 'Provide stretch assignments, leadership coaching, and technical upskilling.' },
  BOX_5: { id: 'CORE_PLAYERS', label: '2B - Core Contributors', performance: 'MEDIUM', potential: 'MEDIUM', action: 'Sustain steady performance, targeted skill training, clear OKR calibration.' },
  BOX_6: { id: 'EFFECTIVE_WORKERS', label: '2C - Effective Contributors', performance: 'MEDIUM', potential: 'LOW', action: 'Focus on motivation, specialized training, and role refinement.' },
  BOX_7: { id: 'ENIGMAS', label: '3A - Enigmas / Rough Diamonds', performance: 'LOW', potential: 'HIGH', action: 'Investigate performance blockers; consider lateral team transfer or role realignment.' },
  BOX_8: { id: 'DILEMMAS', label: '3B - Dilemmas / Inconsistent', performance: 'LOW', potential: 'MEDIUM', action: 'Initiate 60-day Performance Improvement Plan (PIP) with weekly milestone reviews.' },
  BOX_9: { id: 'UNDERPERFORMERS', label: '3C - Risk / Underperformers', performance: 'LOW', potential: 'LOW', action: 'Execute formal 30-day PIP; counsel out or initiate transition if benchmarks not achieved.' }
};

export const STANDARD_BELL_CURVE_DISTRIBUTION = {
  RATING_5_OUTSTANDING: { targetPercentage: 10, label: '5.0 - Outstanding (Significantly Exceeds)', hikeMultiplier: 1.5 },
  RATING_4_EXCEEDS: { targetPercentage: 25, label: '4.0 - Exceeds Expectations', hikeMultiplier: 1.2 },
  RATING_3_MEETS: { targetPercentage: 50, label: '3.0 - Meets Expectations (Solid)', hikeMultiplier: 1.0 },
  RATING_2_NEEDS_IMPROVEMENT: { targetPercentage: 10, label: '2.0 - Needs Improvement', hikeMultiplier: 0.5 },
  RATING_1_UNSATISFACTORY: { targetPercentage: 5, label: '1.0 - Unsatisfactory', hikeMultiplier: 0.0 }
};

export class AppraisalCycleEngine {
  constructor(cycleName = 'FY26 Annual Performance Cycle') {
    this.cycleName = cycleName;
  }

  compute360AppraisalScore(scores = {}) {
    const {
      selfRating = 4.0,
      managerRating = 4.0,
      peerAverageRating = 4.0,
      directReportRating = 4.0,
      okrAchievementPercentage = 95
    } = scores;

    // Weightage: Manager 45%, OKRs 30%, Peers 15%, Self 10%
    const okrNormalizedScore = Math.min(5, (okrAchievementPercentage / 100) * 5);
    const weightedCompositeScore =
      (managerRating * 0.45) +
      (okrNormalizedScore * 0.30) +
      (peerAverageRating * 0.15) +
      (selfRating * 0.10);

    const finalRating = Number(weightedCompositeScore.toFixed(2));

    return {
      cycle: this.cycleName,
      selfScore: selfRating,
      managerScore: managerRating,
      peerScore: peerAverageRating,
      okrNormalizedScore: Number(okrNormalizedScore.toFixed(2)),
      finalRating,
      band: this.determineRatingBand(finalRating)
    };
  }

  determineRatingBand(rating) {
    if (rating >= 4.5) return 'RATING_5_OUTSTANDING';
    if (rating >= 3.8) return 'RATING_4_EXCEEDS';
    if (rating >= 2.8) return 'RATING_3_MEETS';
    if (rating >= 2.0) return 'RATING_2_NEEDS_IMPROVEMENT';
    return 'RATING_1_UNSATISFACTORY';
  }

  classify9BoxTalentGrid(performanceScore, potentialScore) {
    const perfLevel = performanceScore >= 4.0 ? 'HIGH' : performanceScore >= 3.0 ? 'MEDIUM' : 'LOW';
    const potLevel = potentialScore >= 4.0 ? 'HIGH' : potentialScore >= 3.0 ? 'MEDIUM' : 'LOW';

    if (perfLevel === 'HIGH' && potLevel === 'HIGH') return NINE_BOX_GRID_DEFINITIONS.BOX_1;
    if (perfLevel === 'HIGH' && potLevel === 'MEDIUM') return NINE_BOX_GRID_DEFINITIONS.BOX_2;
    if (perfLevel === 'HIGH' && potLevel === 'LOW') return NINE_BOX_GRID_DEFINITIONS.BOX_3;
    if (perfLevel === 'MEDIUM' && potLevel === 'HIGH') return NINE_BOX_GRID_DEFINITIONS.BOX_4;
    if (perfLevel === 'MEDIUM' && potLevel === 'MEDIUM') return NINE_BOX_GRID_DEFINITIONS.BOX_5;
    if (perfLevel === 'MEDIUM' && potLevel === 'LOW') return NINE_BOX_GRID_DEFINITIONS.BOX_6;
    if (perfLevel === 'LOW' && potLevel === 'HIGH') return NINE_BOX_GRID_DEFINITIONS.BOX_7;
    if (perfLevel === 'LOW' && potLevel === 'MEDIUM') return NINE_BOX_GRID_DEFINITIONS.BOX_8;
    return NINE_BOX_GRID_DEFINITIONS.BOX_9;
  }

  calibrateDepartmentBellCurve(employeesWithScores = []) {
    const totalCount = employeesWithScores.length;
    if (totalCount === 0) return { calibratedCount: 0, distribution: {} };

    // Sort descending by final score
    const sorted = [...employeesWithScores].sort((a, b) => b.finalRating - a.finalRating);

    const bucketCounts = {
      RATING_5_OUTSTANDING: Math.max(1, Math.round(totalCount * (STANDARD_BELL_CURVE_DISTRIBUTION.RATING_5_OUTSTANDING.targetPercentage / 100))),
      RATING_4_EXCEEDS: Math.max(1, Math.round(totalCount * (STANDARD_BELL_CURVE_DISTRIBUTION.RATING_4_EXCEEDS.targetPercentage / 100))),
      RATING_2_NEEDS_IMPROVEMENT: Math.max(0, Math.round(totalCount * (STANDARD_BELL_CURVE_DISTRIBUTION.RATING_2_NEEDS_IMPROVEMENT.targetPercentage / 100))),
      RATING_1_UNSATISFACTORY: Math.max(0, Math.round(totalCount * (STANDARD_BELL_CURVE_DISTRIBUTION.RATING_1_UNSATISFACTORY.targetPercentage / 100)))
    };

    const calibratedEmployees = sorted.map((emp, index) => {
      let finalBand = 'RATING_3_MEETS';
      if (index < bucketCounts.RATING_5_OUTSTANDING) {
        finalBand = 'RATING_5_OUTSTANDING';
      } else if (index < bucketCounts.RATING_5_OUTSTANDING + bucketCounts.RATING_4_EXCEEDS) {
        finalBand = 'RATING_4_EXCEEDS';
      } else if (index >= totalCount - bucketCounts.RATING_1_UNSATISFACTORY) {
        finalBand = 'RATING_1_UNSATISFACTORY';
      } else if (index >= totalCount - bucketCounts.RATING_1_UNSATISFACTORY - bucketCounts.RATING_2_NEEDS_IMPROVEMENT) {
        finalBand = 'RATING_2_NEEDS_IMPROVEMENT';
      }

      const multiplier = STANDARD_BELL_CURVE_DISTRIBUTION[finalBand].hikeMultiplier;
      const baseSalaryHikePercentage = 8.0; // 8% company median merit
      const recommendedHikePct = Number((baseSalaryHikePercentage * multiplier).toFixed(1));

      return {
        ...emp,
        calibratedBand: finalBand,
        bellCurveRank: index + 1,
        recommendedSalaryIncrementPercentage: recommendedHikePct,
        projectedNewSalary: Math.round(emp.salary * (1 + (recommendedHikePct / 100)))
      };
    });

    return {
      cycleName: this.cycleName,
      totalStaffCalibrated: totalCount,
      targetVsActualDistribution: {
        outstanding: { target: '10%', actual: `${((bucketCounts.RATING_5_OUTSTANDING / totalCount) * 100).toFixed(0)}%` },
        exceeds: { target: '25%', actual: `${((bucketCounts.RATING_4_EXCEEDS / totalCount) * 100).toFixed(0)}%` },
        meets: { target: '50%', actual: 'Remainder' },
        needsImprovement: { target: '10%', actual: `${((bucketCounts.RATING_2_NEEDS_IMPROVEMENT / totalCount) * 100).toFixed(0)}%` }
      },
      calibratedEmployees
    };
  }
}

export const appraisalCycleEngine = new AppraisalCycleEngine();
