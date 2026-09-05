/**
 * Candidate Applicant Tracking & Offer Generation Engine
 * Coordinates the full recruitment lifecycle:
 * - Resume screening score matrix
 * - Multi-stage interview scorecard synthesis (Bar Raiser rubric)
 * - Formal Offer Letter compensation structure generator
 * - Background Verification (BGV) checklist & compliance tracking.
 */

export const INTERVIEW_ROUND_WEIGHTS = {
  ROUND_1_SCREENING: { name: 'Initial Technical & HR Screen', weight: 15, passingScore: 3.0 },
  ROUND_2_DEEP_DIVE: { name: 'Hands-on Coding / Technical Deep Dive', weight: 35, passingScore: 3.5 },
  ROUND_3_SYSTEM_DESIGN: { name: 'System Architecture & Problem Solving', weight: 25, passingScore: 3.5 },
  ROUND_4_CULTURAL_FIT: { name: 'Values, Culture & Leadership Principles', weight: 15, passingScore: 4.0 },
  ROUND_5_BAR_RAISER: { name: 'Independent Bar Raiser / VP Assessment', weight: 10, passingScore: 3.5 }
};

export class RecruitmentPipelineEngine {
  constructor() {
    this.standardJoiningBonusClawbackMonths = 12;
  }

  scoreCandidateInterviewRounds(candidateId, candidateName, scorecards = []) {
    let totalWeighted = 0;
    let totalWeightApplied = 0;
    const stageDetails = [];

    scorecards.forEach(card => {
      const stageConfig = INTERVIEW_ROUND_WEIGHTS[card.roundId] || { weight: 20, passingScore: 3.0, name: card.roundName || 'Interview' };
      const weightedScore = (card.rating * stageConfig.weight) / 100;
      totalWeighted += weightedScore;
      totalWeightApplied += stageConfig.weight;

      stageDetails.push({
        roundId: card.roundId,
        roundName: stageConfig.name,
        interviewer: card.interviewerName,
        rating: card.rating,
        feedbackNotes: card.notes || 'Meets technical bar.',
        passed: card.rating >= stageConfig.passingScore
      });
    });

    const normalizedTotalScore = totalWeightApplied > 0 ? Number(((totalWeighted / totalWeightApplied) * 5).toFixed(2)) : 0;
    const allPassed = stageDetails.every(s => s.passed);
    const hiringDecision = (normalizedTotalScore >= 3.6 && allPassed) ? 'STRONG_HIRE' : (normalizedTotalScore >= 3.2 ? 'HIRE' : 'DO_NOT_HIRE');

    return {
      candidateId,
      candidateName,
      overallCompositeScore: normalizedTotalScore,
      hiringRecommendation: hiringDecision,
      allRoundsCleared: allPassed,
      interviewRoundsEvaluated: stageDetails.length,
      roundDetails: stageDetails
    };
  }

  generateOfferLetterStructure(candidateDetails = {}, compensationOffer = {}) {
    const {
      proposedAnnualCTC = 1800000,
      joiningBonus = 150000,
      retentionBonus = 200000,
      targetJoiningDate = '2026-10-01',
      jobLevel = 'IC3',
      designation = 'Senior Software Engineer',
      department = 'Engineering',
      reportingManager = 'Sunil Verma - Director of Engineering',
      workLocation = 'Bangalore Office'
    } = compensationOffer;

    const monthlyGross = Math.round(proposedAnnualCTC / 12);
    const basicPayMonthly = Math.round(monthlyGross * 0.50);
    const basicPayAnnual = basicPayMonthly * 12;

    const hraMonthly = Math.round(monthlyGross * 0.20);
    const hraAnnual = hraMonthly * 12;

    const specialAllowanceMonthly = Math.round(monthlyGross * 0.30);
    const specialAllowanceAnnual = specialAllowanceMonthly * 12;

    const pfEmployerMonthly = Math.round(basicPayMonthly * 0.12);
    const pfEmployerAnnual = pfEmployerMonthly * 12;

    const gratuityMonthlyProvision = Math.round((basicPayMonthly * 15) / (26 * 12));
    const gratuityAnnual = gratuityMonthlyProvision * 12;

    return {
      offerId: `OFFER-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      candidateName: `${candidateDetails.firstName} ${candidateDetails.lastName}`,
      candidateEmail: candidateDetails.email,
      position: {
        designation,
        level: jobLevel,
        department,
        reportingManager,
        workLocation,
        targetJoiningDate
      },
      annualSalaryBreakdown: {
        totalCostToCompany: proposedAnnualCTC,
        monthlyGrossSalary: monthlyGross,
        components: {
          basicSalary: { monthly: basicPayMonthly, annual: basicPayAnnual },
          houseRentAllowance: { monthly: hraMonthly, annual: hraAnnual },
          specialAllowance: { monthly: specialAllowanceMonthly, annual: specialAllowanceAnnual },
          employerPFContribution: { monthly: pfEmployerMonthly, annual: pfEmployerAnnual },
          gratuityStatutoryProvision: { monthly: gratuityMonthlyProvision, annual: gratuityAnnual }
        }
      },
      variableAndOneTimeBenefits: {
        joiningBonus: {
          amount: joiningBonus,
          disbursementTerms: 'Payable in the first payroll cycle; subject to 12-month clawback on voluntary exit.'
        },
        annualPerformanceBonus: {
          targetPercentage: '10% of Annual Base CTC',
          contingentOnCompanyPerformance: true
        }
      },
      statutoryComplianceChecklist: [
        'Identity Verification (Aadhaar & PAN card mandatory)',
        'Educational Degree Certificate Authenticity Check',
        'Past Employment Relieving Letters & Experience Verification',
        'Criminal & Civil Background Court Record Verification'
      ]
    };
  }

  validateBackgroundVerificationChecklist(bgvSubmission = {}) {
    const checks = [
      { check: 'IDENTITY_PROOF', verified: Boolean(bgvSubmission.hasAadhaar && bgvSubmission.hasPAN), mandatory: true },
      { check: 'PREVIOUS_EMPLOYMENT_VERIFICATION', verified: Boolean(bgvSubmission.relievingLetterPresent), mandatory: true },
      { check: 'CRIMINAL_BACKGROUND_CHECK', verified: Boolean(bgvSubmission.policeClearanceCertificate), mandatory: true },
      { check: 'ADDRESS_PROOF', verified: Boolean(bgvSubmission.addressVerified), mandatory: true },
      { check: 'DEGREE_AUTHENTICATION', verified: Boolean(bgvSubmission.degreeVerified), mandatory: true }
    ];

    const failedMandatory = checks.filter(c => c.mandatory && !c.verified);

    return {
      isBGVCleared: failedMandatory.length === 0,
      overallStatus: failedMandatory.length === 0 ? 'GREEN_CLEARED' : 'AMBER_PENDING_DOCS',
      totalChecksEvaluated: checks.length,
      passedChecksCount: checks.filter(c => c.verified).length,
      actionRequired: failedMandatory.map(f => `Upload valid document for: ${f.check}`)
    };
  }
}

export const recruitmentPipelineEngine = new RecruitmentPipelineEngine();
