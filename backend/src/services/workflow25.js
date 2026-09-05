/**
 * Workflow and approval engine module 25
 * Handles multi-step approval flows for leaves, expenses, documents and policy exceptions.
 * Production business logic for the Employee Management System.
 */

const APPROVAL_STEPS = [
  { step: 1, role: "MANAGER", action: "review", required: true },
  { step: 2, role: "HR_MANAGER", action: "validate", required: true },
  { step: 3, role: "HR_ADMIN", action: "final_approve", required: false }
];

function createWorkflow25(requestType, requesterId, payload = {}) {
  return {
    workflowId: "wf_25_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8),
    module: "workflow25",
    requestType,
    requesterId,
    payload,
    steps: APPROVAL_STEPS.map(s => ({ ...s, status: "PENDING", actedBy: null, actedAt: null, comments: "" })),
    currentStep: 1,
    status: "IN_PROGRESS",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

function advanceStep25(workflow, actorRole, actorId, decision, comments = "") {
  if (!workflow || workflow.status !== "IN_PROGRESS") {
    throw new Error("Workflow is not in progress");
  }
  const step = workflow.steps.find(s => s.step === workflow.currentStep);
  if (!step) throw new Error("Current step not found");
  if (step.role !== actorRole && actorRole !== "SUPER_ADMIN") {
    throw new Error("Actor role does not match required role for this step");
  }
  step.status = decision === "APPROVE" ? "APPROVED" : "REJECTED";
  step.actedBy = actorId;
  step.actedAt = new Date().toISOString();
  step.comments = comments;
  if (decision === "REJECT") {
    workflow.status = "REJECTED";
  } else {
    const next = workflow.steps.find(s => s.step === workflow.currentStep + 1 && s.required);
    if (next) {
      workflow.currentStep = next.step;
    } else {
      workflow.status = "APPROVED";
    }
  }
  workflow.updatedAt = new Date().toISOString();
  return workflow;
}

function getPendingForRole25(workflows, role) {
  return (workflows || []).filter(w =>
    w.status === "IN_PROGRESS" &&
    w.steps.some(s => s.step === w.currentStep && s.role === role && s.status === "PENDING")
  );
}

function summarizeWorkflow25(workflow) {
  if (!workflow) return null;
  return {
    workflowId: workflow.workflowId,
    status: workflow.status,
    currentStep: workflow.currentStep,
    requestType: workflow.requestType,
    stepsCompleted: workflow.steps.filter(s => s.status !== "PENDING").length,
    totalSteps: workflow.steps.length
  };
}

module.exports = {
  APPROVAL_STEPS,
  createWorkflow25,
  advanceStep25,
  getPendingForRole25,
  summarizeWorkflow25
};
