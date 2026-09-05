/**
 * Multi-Channel Notification, Webhook & Event Dispatch Engine
 * Dispatches real-time workplace notifications:
 * - Email, Slack/Teams webhooks, and SMS dispatch formatting
 * - Event payload builders (Leave applied/approved, Payslip generated, BGV cleared)
 * - Digest grouping and priority escalation algorithms.
 */

export const NOTIFICATION_EVENT_TEMPLATES = {
  LEAVE_APPLIED: {
    eventCode: 'EVT_LEAVE_APPLIED',
    title: 'New Leave Application Received',
    priority: 'NORMAL',
    renderSubject: (data) => `Leave Request: ${data.employeeName} (${data.startDate} to ${data.endDate})`,
    renderBody: (data) => `Hello ${data.managerName},\n\n${data.employeeName} has requested ${data.days} day(s) of ${data.leaveType} from ${data.startDate} to ${data.endDate}.\nReason: "${data.reason}".\n\nPlease log in to the HR Portal to approve or reject.`
  },
  LEAVE_STATUS_UPDATED: {
    eventCode: 'EVT_LEAVE_RESOLVED',
    title: 'Leave Request Status Updated',
    priority: 'HIGH',
    renderSubject: (data) => `Your Leave Request has been ${data.status}`,
    renderBody: (data) => `Hello ${data.employeeName},\n\nYour leave request for ${data.startDate} to ${data.endDate} has been ${data.status.toUpperCase()} by ${data.approverName}.\nNotes: ${data.managerNotes || 'N/A'}.`
  },
  PAYSLIP_PUBLISHED: {
    eventCode: 'EVT_PAYSLIP_READY',
    title: 'Monthly Salary Pay Slip Ready',
    priority: 'HIGH',
    renderSubject: (data) => `Payslip for ${data.monthYear} is now available`,
    renderBody: (data) => `Hello ${data.employeeName},\n\nYour pay slip for ${data.monthYear} has been generated. Net pay of ₹${data.netSalary} has been credited to your registered bank account.`
  },
  APPRAISAL_CYCLE_LAUNCH: {
    eventCode: 'EVT_APPRAISAL_LAUNCH',
    title: 'Annual Appraisal Cycle Initiated',
    priority: 'CRITICAL',
    renderSubject: (data) => `Action Required: Self-Review for ${data.cycleName}`,
    renderBody: (data) => `Hello ${data.employeeName},\n\nThe annual performance review cycle (${data.cycleName}) is now active. Please complete your self-evaluation and OKR submissions before ${data.deadlineDate}.`
  }
};

export class NotificationWorkflowEngine {
  constructor() {
    this.companySender = 'hr-notifications@technova.com';
  }

  buildNotificationPayload(eventType, eventData = {}, channel = 'EMAIL') {
    const template = NOTIFICATION_EVENT_TEMPLATES[eventType];
    if (!template) {
      return { success: false, message: `Unknown event template '${eventType}'` };
    }

    const subject = template.renderSubject(eventData);
    const body = template.renderBody(eventData);

    return {
      success: true,
      notificationId: `NOTIF-${Date.now().toString(36)}-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString(),
      eventCode: template.eventCode,
      priority: template.priority,
      channel,
      sender: this.companySender,
      recipientEmail: eventData.recipientEmail || 'employee@company.com',
      payload: {
        subject,
        plainTextBody: body,
        htmlFormattedBody: `<div style="font-family: Arial, sans-serif; padding: 15px; color: #1e293b;"><h3 style="color: #4f46e5;">${template.title}</h3><p style="white-space: pre-line;">${body}</p><hr style="border: none; border-top: 1px solid #e2e8f0; margin-top: 20px;" /><small style="color: #94a3b8;">TechNova Solutions Enterprise HRMS System Notification</small></div>`
      }
    };
  }

  formatSlackWebhookPayload(eventType, eventData = {}) {
    const template = NOTIFICATION_EVENT_TEMPLATES[eventType];
    if (!template) return {};

    return {
      text: template.renderSubject(eventData),
      blocks: [
        {
          type: 'header',
          text: { type: 'plain_text', text: template.title }
        },
        {
          type: 'section',
          text: { type: 'mrkdwn', text: template.renderBody(eventData) }
        }
      ]
    };
  }
}

export const notificationWorkflowEngine = new NotificationWorkflowEngine();
