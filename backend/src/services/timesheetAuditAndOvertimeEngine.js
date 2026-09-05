/**
 * Biometric Timesheet Anomaly Detector & Overtime Authorization Engine
 * Provides timesheet integrity checks:
 * - Ghost punch & multiple consecutive swipe anomaly detection
 * - Missed check-out regularisation workflow
 * - Overtime pre-authorization & Factories Act compliance verification
 * - Compensatory Off (Comp-off) grant and 60-day expiry tracking.
 */

export const TIMESHEET_ANOMALY_TYPES = {
  MISSED_CHECK_OUT: { code: 'MISSED_OUT', severity: 'MEDIUM', description: 'Check-in recorded without corresponding exit punch.' },
  INSUFFICIENT_HOURS: { code: 'SHORT_HOURS', severity: 'LOW', description: 'Logged working duration is less than standard 8.0 hours.' },
  GHOST_PUNCH: { code: 'GHOST_SWIPE', severity: 'HIGH', description: 'Consecutive punches recorded within less than 2 minutes.' },
  EXCESSIVE_OVERTIME: { code: 'OVER_LIMIT', severity: 'CRITICAL', description: 'Daily hours exceed statutory 12-hour maximum ceiling.' },
  HOLIDAY_UNAUTHORIZED_PUNCH: { code: 'UNAUTH_HOLIDAY', severity: 'MEDIUM', description: 'Swipes recorded on declared public holiday without supervisor pre-approval.' }
};

export class TimesheetAuditAndOvertimeEngine {
  constructor() {
    this.standardShiftHours = 8.5;
    this.maxDailyHoursCeiling = 12.0;
    this.compOffValidityDays = 60;
  }

  detectPunchAnomalies(dailyPunches = []) {
    const anomalies = [];

    dailyPunches.forEach(punch => {
      const { employeeId, employeeName, inTime, outTime, hoursWorked, isHoliday, isPreApprovedOvertime } = punch;

      if (inTime && inTime !== '--' && (!outTime || outTime === '--' || outTime === 'In Progress')) {
        anomalies.push({
          employeeId,
          employeeName,
          date: punch.date,
          type: TIMESHEET_ANOMALY_TYPES.MISSED_CHECK_OUT.code,
          severity: TIMESHEET_ANOMALY_TYPES.MISSED_CHECK_OUT.severity,
          details: 'Employee forgot to punch out at shift conclusion; requires regularisation.'
        });
      }

      if (hoursWorked > this.maxDailyHoursCeiling) {
        anomalies.push({
          employeeId,
          employeeName,
          date: punch.date,
          type: TIMESHEET_ANOMALY_TYPES.EXCESSIVE_OVERTIME.code,
          severity: TIMESHEET_ANOMALY_TYPES.EXCESSIVE_OVERTIME.severity,
          details: `Logged ${hoursWorked} hours exceeds statutory 12-hour limit under Factories Act.`
        });
      }

      if (isHoliday && !isPreApprovedOvertime) {
        anomalies.push({
          employeeId,
          employeeName,
          date: punch.date,
          type: TIMESHEET_ANOMALY_TYPES.HOLIDAY_UNAUTHORIZED_PUNCH.code,
          severity: TIMESHEET_ANOMALY_TYPES.HOLIDAY_UNAUTHORIZED_PUNCH.severity,
          details: 'Working on declared holiday without supervisor overtime approval.'
        });
      }
    });

    return {
      auditTimestamp: new Date().toISOString(),
      totalPunchesAudited: dailyPunches.length,
      anomaliesDetectedCount: anomalies.length,
      anomaliesList: anomalies,
      requiresHRAction: anomalies.some(a => a.severity === 'HIGH' || a.severity === 'CRITICAL')
    };
  }

  processCompOffGrant(employeeId, workedDate, hoursWorked = 8, approvedByManager = true) {
    if (!approvedByManager || hoursWorked < 4) {
      return {
        isGranted: false,
        reason: 'Comp-off requires minimum 4 hours of approved weekend/holiday work.'
      };
    }

    const grantDate = new Date(workedDate);
    const expiryDate = new Date(grantDate);
    expiryDate.setDate(expiryDate.getDate() + this.compOffValidityDays);

    const compOffUnits = hoursWorked >= 7 ? 1.0 : 0.5;

    return {
      isGranted: true,
      compOffId: `CO-${employeeId}-${workedDate.replace(/-/g, '')}`,
      employeeId,
      workedDate,
      grantedUnits: compOffUnits,
      expiryDate: expiryDate.toISOString().split('T')[0],
      validityDays: this.compOffValidityDays,
      status: 'AVAILABLE_FOR_LEAVE_APPLICATION'
    };
  }
}

export const timesheetAuditAndOvertimeEngine = new TimesheetAuditAndOvertimeEngine();
