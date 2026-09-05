/**
 * Corporate Learning, Upskilling & Mandatory Compliance Engine
 * Tracks professional development:
 * - Continuing Professional Development (CPD) hours
 * - Mandatory annual compliance certifications (POSH, InfoSec, GDPR)
 * - Training course catalog and completion status
 * - Skills progression and certificate verification.
 */

export const MANDATORY_COMPLIANCE_CURRICULUM = [
  { courseId: 'comp_posh_101', title: 'POSH (Prevention of Sexual Harassment) Annual Refresher', requiredHours: 2, validityMonths: 12, mandatoryFor: 'ALL' },
  { courseId: 'comp_infosec_102', title: 'Information Security & Data Privacy (SOC2 / ISO 27001)', requiredHours: 3, validityMonths: 12, mandatoryFor: 'ALL' },
  { courseId: 'comp_insider_103', title: 'Insider Trading & Code of Business Conduct', requiredHours: 1.5, validityMonths: 12, mandatoryFor: 'ALL' },
  { courseId: 'comp_gdpr_104', title: 'GDPR & Global Data Protection Standards', requiredHours: 2.5, validityMonths: 12, mandatoryFor: 'TECH_AND_DATA' },
  { courseId: 'comp_fire_safety_105', title: 'Workplace Fire & Disaster Evacuation Protocols', requiredHours: 1, validityMonths: 24, mandatoryFor: 'IN_OFFICE' }
];

export class LearningAndDevelopmentEngine {
  constructor() {
    this.annualTargetCpdHours = 40; // 40 hours per year
  }

  evaluateEmployeeComplianceStatus(employee, completedCourseRecords = []) {
    const today = new Date();
    const statusReport = [];
    let overdueCount = 0;

    MANDATORY_COMPLIANCE_CURRICULUM.forEach(course => {
      const completion = completedCourseRecords.find(c => c.courseId === course.courseId);

      let isCompliant = false;
      let expiryDate = null;
      let daysRemaining = -1;

      if (completion) {
        const cDate = new Date(completion.completionDate);
        const expDate = new Date(cDate);
        expDate.setMonth(expDate.getMonth() + course.validityMonths);
        expiryDate = expDate.toISOString().split('T')[0];
        daysRemaining = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
        isCompliant = daysRemaining > 0;
      }

      if (!isCompliant) overdueCount++;

      statusReport.push({
        courseId: course.courseId,
        title: course.title,
        requiredHours: course.requiredHours,
        isCompleted: Boolean(completion),
        isCurrentlyValid: isCompliant,
        expiryDate,
        daysUntilExpiry: daysRemaining,
        status: isCompliant ? (daysRemaining <= 30 ? 'EXPIRING_SOON' : 'VALID') : 'OVERDUE'
      });
    });

    return {
      employeeId: employee.employeeId,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      totalMandatoryCourses: MANDATORY_COMPLIANCE_CURRICULUM.length,
      compliantCoursesCount: MANDATORY_COMPLIANCE_CURRICULUM.length - overdueCount,
      overdueCount,
      overallCompliance: overdueCount === 0 ? 'COMPLIANT' : 'ACTION_REQUIRED',
      curriculumStatus: statusReport
    };
  }

  calculateCpdProgress(completedTrainings = []) {
    const currentYear = new Date().getFullYear();
    const currentYearTrainings = completedTrainings.filter(t => new Date(t.date).getFullYear() === currentYear);
    const totalHoursLogged = currentYearTrainings.reduce((sum, t) => sum + (t.hours || 0), 0);
    const progressPercentage = Math.min(100, Math.round((totalHoursLogged / this.annualTargetCpdHours) * 100));

    return {
      year: currentYear,
      targetHours: this.annualTargetCpdHours,
      completedHours: totalHoursLogged,
      remainingHours: Math.max(0, this.annualTargetCpdHours - totalHoursLogged),
      progressPercentage: `${progressPercentage}%`,
      onTrack: totalHoursLogged >= Math.round((this.annualTargetCpdHours / 12) * (new Date().getMonth() + 1)),
      trainingsLogged: currentYearTrainings
    };
  }
}

export const learningAndDevelopmentEngine = new LearningAndDevelopmentEngine();
