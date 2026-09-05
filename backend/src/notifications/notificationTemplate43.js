/**
 * Notification Template Module 43
 * Email / in-app notification templates and rendering for Employee Management.
 */

const TEMPLATES = {
  leaveApplied: {
    subject: "Leave application received - {employeeName}",
    body: "Dear {approverName},\n\n{employeeName} ({employeeId}) has applied for {leaveType} from {startDate} to {endDate} ({days} days).\nReason: {reason}\n\nPlease review and approve/reject.\n\nRegards,\nHR System"
  },
  leaveApproved: {
    subject: "Your leave has been approved",
    body: "Dear {employeeName},\n\nYour {leaveType} request from {startDate} to {endDate} has been approved by {approverName}.\n\nEnjoy your time off.\n\nHR Team"
  },
  leaveRejected: {
    subject: "Leave request update",
    body: "Dear {employeeName},\n\nYour {leaveType} request from {startDate} to {endDate} was not approved.\nComments: {comments}\n\nPlease contact your manager if needed.\n\nHR Team"
  },
  welcome: {
    subject: "Welcome to the company, {employeeName}!",
    body: "Dear {employeeName},\n\nWelcome aboard! Your employee ID is {employeeId}.\nDepartment: {department}\nJoining date: {joinDate}\n\nWe are excited to have you.\n\nHR Team"
  },
  birthday: {
    subject: "Happy Birthday {employeeName}!",
    body: "Dear {employeeName},\n\nWishing you a wonderful birthday and a great year ahead!\n\nBest wishes from the entire team."
  },
  anniversary: {
    subject: "Work Anniversary - {years} years",
    body: "Dear {employeeName},\n\nCongratulations on completing {years} years with us! Thank you for your contributions.\n\nHR Team"
  },
  performanceReview: {
    subject: "Performance review cycle started",
    body: "Dear {employeeName},\n\nThe performance review cycle for period {period} is now open. Please complete your self-assessment by {deadline}.\n\nManager: {managerName}"
  },
  documentExpiry: {
    subject: "Document expiring soon",
    body: "Dear {employeeName},\n\nYour document {documentName} is expiring on {expiryDate}. Please renew and upload the updated version.\n\nHR Team"
  }
};

function renderTemplate43(templateKey, variables = {}) {
  const tpl = TEMPLATES[templateKey];
  if (!tpl) return { subject: "Notification", body: "No template found" };
  let subject = tpl.subject;
  let body = tpl.body;
  for (const [k, v] of Object.entries(variables)) {
    const re = new RegExp("\\{" + k + "\\}", "g");
    subject = subject.replace(re, String(v ?? ""));
    body = body.replace(re, String(v ?? ""));
  }
  return {
    module: "notificationTemplate43",
    templateKey,
    subject,
    body,
    renderedAt: new Date().toISOString()
  };
}

function listAvailableTemplates43() {
  return Object.keys(TEMPLATES).map(k => ({ key: k, subject: TEMPLATES[k].subject }));
}

function buildNotificationPayload43(templateKey, variables, recipients = []) {
  const rendered = renderTemplate43(templateKey, variables);
  return {
    ...rendered,
    recipients,
    channel: "email",
    priority: "normal",
    moduleIndex: 43
  };
}

module.exports = {
  TEMPLATES,
  renderTemplate43,
  listAvailableTemplates43,
  buildNotificationPayload43
};
