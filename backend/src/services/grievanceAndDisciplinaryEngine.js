/**
 * Employee Grievance Redressal, Ethics Hotline & Disciplinary Action Engine
 * Governs workplace conduct and employee relations:
 * - Code of Conduct violation severity classification
 * - Principles of Natural Justice inquiry workflows (Show Cause, Inquiry Officer, Final Order)
 * - Anonymous Ethics & Whistleblower hotline intake & tracking
 * - Corrective Action Plans (PIP, Written Warnings, Demotions, Termination).
 */

export const MISCONDUCT_SEVERITY_LEVELS = {
  LEVEL_1_MINOR: {
    category: 'Minor Misconduct',
    examples: ['Unexcused tardiness / late check-ins', 'Failure to wear ID badge', 'Occasional unnotified absence (<2 days)'],
    actionProtocol: 'Verbal Counseling followed by First Written Warning; 30-day monitoring.',
    escalationThresholdCount: 3
  },
  LEVEL_2_MODERATE: {
    category: 'Moderate Misconduct',
    examples: ['Repeated insubordination', 'Negligence resulting in minor operational loss', 'Abuse of company computing resources', 'Unauthorized moonlighting without conflict'],
    actionProtocol: 'Formal Show Cause Notice, written explanation within 48 hours, Final Written Warning or suspension up to 4 days.',
    escalationThresholdCount: 2
  },
  LEVEL_3_MAJOR: {
    category: 'Gross Misconduct',
    examples: ['Data theft / breach of IP & customer confidentiality', 'Financial fraud / embezzlement', 'Physical altercation / violence', 'Severe sexual harassment (POSH violation)', 'Falsification of employment records / resume fraud'],
    actionProtocol: 'Immediate suspension pending domestic inquiry; formal charge-sheet; termination without notice pay if proven.',
    escalationThresholdCount: 1
  }
};

export class GrievanceAndDisciplinaryEngine {
  constructor() {
    this.statutoryInquiryTimelineDays = 30;
  }

  intakeEmployeeGrievance(grievanceSubmission = {}) {
    const {
      complainantId,
      isAnonymous = false,
      category = 'WORKPLACE_DISPUTE', // 'POSH', 'DISCRIMINATION', 'MANAGEMENT_FAIRNESS', 'COMPENSATION_DISPUTE'
      incidentDate,
      respondentId,
      incidentDescription,
      witnessNames = [],
      evidenceDocuments = []
    } = grievanceSubmission;

    const caseId = `GRV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const isPriorityHigh = category === 'POSH' || category === 'DISCRIMINATION' || category === 'FRAUD';

    return {
      caseId,
      intakeTimestamp: new Date().toISOString(),
      isAnonymous,
      complainantId: isAnonymous ? 'REDACTED_ANONYMOUS_WHISTLEBLOWER' : complainantId,
      respondentId,
      category,
      priority: isPriorityHigh ? 'P1_CRITICAL_HIGH' : 'P2_STANDARD',
      slaResolutionDays: isPriorityHigh ? 15 : 30,
      investigationStages: [
        { stage: 'PRELIMINARY_SCRUTINY', status: 'IN_PROGRESS', targetDays: 3, owner: 'HR Ethics Officer' },
        { stage: 'NOTICE_TO_RESPONDENT', status: 'PENDING', targetDays: 5, owner: 'Disciplinary Committee' },
        { stage: 'DOMESTIC_INQUIRY_HEARINGS', status: 'PENDING', targetDays: 14, owner: 'Independent Inquiry Officer' },
        { stage: 'FINAL_FINDINGS_REPORT', status: 'PENDING', targetDays: 5, owner: 'Internal Committee' },
        { stage: 'DISCIPLINARY_ACTION_EXECUTION', status: 'PENDING', targetDays: 3, owner: 'Head of HR / Legal' }
      ],
      caseNotes: incidentDescription,
      witnessesCount: witnessNames.length,
      evidenceAttachmentsCount: evidenceDocuments.length
    };
  }

  evaluateDisciplinaryAction(misconductType = 'LEVEL_1_MINOR', priorIncidentsCount = 0) {
    const severityConfig = MISCONDUCT_SEVERITY_LEVELS[misconductType] || MISCONDUCT_SEVERITY_LEVELS.LEVEL_1_MINOR;
    let recommendedSanction = 'VERBAL_WARNING';

    if (misconductType === 'LEVEL_3_MAJOR') {
      recommendedSanction = 'SUMMARY_DISMISSAL_WITH_LEGAL_ACTION';
    } else if (misconductType === 'LEVEL_2_MODERATE') {
      recommendedSanction = priorIncidentsCount >= 1 ? 'FINAL_WRITTEN_WARNING_WITH_SUSPENSION' : 'FIRST_WRITTEN_WARNING';
    } else {
      recommendedSanction = priorIncidentsCount >= 2 ? 'FIRST_WRITTEN_WARNING' : 'RECORDED_VERBAL_COUNSELING';
    }

    return {
      evaluatedSeverity: severityConfig.category,
      priorViolationsRecorded: priorIncidentsCount,
      protocolGuideline: severityConfig.actionProtocol,
      recommendedSanction,
      requiresDomesticInquiry: misconductType === 'LEVEL_3_MAJOR',
      naturalJusticeAuditPassed: true,
      documentationChecklist: [
        'Signed copy of Show Cause Notice served on employee',
        'Written explanation from employee received within stipulated time',
        'Minutes of Inquiry Committee meetings recorded with witness signatures',
        'Formal Speaking Order issued by Competent Authority'
      ]
    };
  }
}

export const grievanceAndDisciplinaryEngine = new GrievanceAndDisciplinaryEngine();
