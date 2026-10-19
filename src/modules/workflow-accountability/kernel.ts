import {
  type AccountabilityRole,
  type ApprovalWorkflowType,
  type AssuranceProfile,
  Prisma,
  type WorkItemType,
  type WorkflowApprovalDecision,
  type WorkflowApprovalStatus,
} from "@prisma/client";

import {
  organizationIdForWorkspace,
  requireWorkspaceAuthorization,
} from "@/modules/authorization";
import {
  ALL_CAPABILITIES,
  AuditEventType,
  type Capability,
  type WorkspaceContext,
  writeAuditEvent,
} from "@/modules/identity-workspace";
import {
  type TenantTransaction,
  withOrganizationTenant,
} from "@/server/tenant-context";

import { WorkflowError } from "./errors";

const TERMINAL_MISSION = new Set([
  "RELEASED",
  "PARTIAL",
  "REFUTED",
  "CANCELLED",
  "ARCHIVED",
]);

export interface WorkflowTarget {
  targetType: WorkItemType;
  targetId: string;
}

type ResolvedTarget = {
  missionId: string;
  assuranceProfile: AssuranceProfile;
  complete: boolean;
};

function text(value: string, field: string, maximum = 500) {
  const normalized = value.trim();
  if (!normalized || normalized.length > maximum) {
    throw new WorkflowError(
      "INVALID_INPUT",
      `${field} must contain 1–${maximum} characters`,
    );
  }
  return normalized;
}

function integer(
  value: number,
  field: string,
  minimum: number,
  maximum: number,
) {
  if (!Number.isInteger(value) || value < minimum || value > maximum) {
    throw new WorkflowError(
      "INVALID_INPUT",
      `${field} must be an integer between ${minimum} and ${maximum}`,
    );
  }
  return value;
}

async function organizationMembership(
  tx: TenantTransaction,
  organizationId: string,
  userId: string,
) {
  const membership = await tx.organizationMembership.findUnique({
    where: {
      organizationId_userId: { organizationId, userId },
    },
  });
  if (!membership || membership.status !== "ACTIVE") {
    throw new WorkflowError("FORBIDDEN", "Active organization membership required");
  }
  return membership;
}

async function resolveTarget(
  tx: TenantTransaction,
  workspaceId: string,
  target: WorkflowTarget,
): Promise<ResolvedTarget> {
  switch (target.targetType) {
    case "MISSION": {
      const mission = await tx.mission.findFirst({
        where: { id: target.targetId, workspaceId },
        select: { id: true, assuranceProfile: true, status: true },
      });
      if (!mission) break;
      return {
        missionId: mission.id,
        assuranceProfile: mission.assuranceProfile,
        complete: TERMINAL_MISSION.has(mission.status),
      };
    }
    case "RUNTIME_OBLIGATION": {
      const obligation = await tx.runtimeObligation.findFirst({
        where: { id: target.targetId, workspaceId },
        select: {
          status: true,
          mission: { select: { id: true, assuranceProfile: true } },
        },
      });
      if (!obligation) break;
      return {
        missionId: obligation.mission.id,
        assuranceProfile: obligation.mission.assuranceProfile,
        complete: ["SATISFIED", "WAIVED"].includes(obligation.status),
      };
    }
    case "DECISION": {
      const decision = await tx.decision.findFirst({
        where: { id: target.targetId, workspaceId },
        select: {
          status: true,
          mission: { select: { id: true, assuranceProfile: true } },
        },
      });
      if (!decision) break;
      return {
        missionId: decision.mission.id,
        assuranceProfile: decision.mission.assuranceProfile,
        complete: decision.status !== "REQUIRED",
      };
    }
    case "ESCALATION": {
      const escalation = await tx.escalation.findFirst({
        where: { id: target.targetId, workspaceId },
        select: {
          status: true,
          mission: { select: { id: true, assuranceProfile: true } },
        },
      });
      if (!escalation) break;
      return {
        missionId: escalation.mission.id,
        assuranceProfile: escalation.mission.assuranceProfile,
        complete: escalation.status === "RESOLVED",
      };
    }
    case "EXECUTION_TIP": {
      const tip = await tx.executionTip.findFirst({
        where: { id: target.targetId, workspaceId },
        select: {
          status: true,
          mission: { select: { id: true, assuranceProfile: true } },
        },
      });
      if (!tip) break;
      return {
        missionId: tip.mission.id,
        assuranceProfile: tip.mission.assuranceProfile,
        complete: ["DONE", "CANCELLED"].includes(tip.status),
      };
    }
    case "VERIFICATION_REPORT": {
      const report = await tx.verificationReport.findFirst({
        where: { id: target.targetId, workspaceId },
        select: {
          mission: { select: { id: true, assuranceProfile: true } },
        },
      });
      if (!report) break;
      return {
        missionId: report.mission.id,
        assuranceProfile: report.mission.assuranceProfile,
        complete: true,
      };
    }
  }
  throw new WorkflowError("NOT_FOUND", "Workflow target not found");
}

async function lockTarget(
  tx: TenantTransaction,
  workspaceId: string,
  target: WorkflowTarget,
) {
  switch (target.targetType) {
    case "MISSION":
      await tx.$queryRaw`
        SELECT id FROM mission
        WHERE workspace_id = ${workspaceId} AND id = ${target.targetId}
        FOR SHARE
      `;
      return;
    case "RUNTIME_OBLIGATION":
      await tx.$queryRaw`
        SELECT id FROM runtime_obligation
        WHERE workspace_id = ${workspaceId} AND id = ${target.targetId}
        FOR SHARE
      `;
      return;
    case "DECISION":
      await tx.$queryRaw`
        SELECT id FROM decision
        WHERE workspace_id = ${workspaceId} AND id = ${target.targetId}
        FOR SHARE
      `;
      return;
    case "ESCALATION":
      await tx.$queryRaw`
        SELECT id FROM escalation
        WHERE workspace_id = ${workspaceId} AND id = ${target.targetId}
        FOR SHARE
      `;
      return;
    case "EXECUTION_TIP":
      await tx.$queryRaw`
        SELECT id FROM execution_tip
        WHERE workspace_id = ${workspaceId} AND id = ${target.targetId}
        FOR SHARE
      `;
      return;
    case "VERIFICATION_REPORT":
      await tx.$queryRaw`
        SELECT id FROM verification_report
        WHERE workspace_id = ${workspaceId} AND id = ${target.targetId}
        FOR SHARE
      `;
  }
}

async function selectSlaPolicy(
  tx: TenantTransaction,
  organizationId: string,
  workspaceId: string,
  targetType: WorkItemType,
  assuranceProfile: AssuranceProfile,
  requestedPolicyId?: string,
) {
  if (requestedPolicyId) {
    const policy = await tx.slaPolicy.findFirst({
      where: {
        id: requestedPolicyId,
        organizationId,
        status: "ACTIVE",
        targetType,
        AND: [
          { OR: [{ workspaceId }, { workspaceId: null }] },
          { OR: [{ assuranceProfile }, { assuranceProfile: null }] },
        ],
      },
    });
    if (!policy) {
      throw new WorkflowError("NOT_FOUND", "Applicable SLA policy not found");
    }
    return policy;
  }
  const candidates = await tx.slaPolicy.findMany({
    where: {
      organizationId,
      status: "ACTIVE",
      targetType,
      AND: [
        { OR: [{ workspaceId }, { workspaceId: null }] },
        { OR: [{ assuranceProfile }, { assuranceProfile: null }] },
      ],
    },
    orderBy: [{ version: "desc" }, { id: "asc" }],
    take: 20,
  });
  return (
    candidates.sort(
      (a, b) =>
        Number(Boolean(b.workspaceId)) - Number(Boolean(a.workspaceId)) ||
        Number(Boolean(b.assuranceProfile)) -
          Number(Boolean(a.assuranceProfile)) ||
        b.version - a.version ||
        a.id.localeCompare(b.id),
    )[0] ?? null
  );
}

export async function createSlaPolicy(
  ctx: WorkspaceContext,
  input: {
    policyKey: string;
    name: string;
    targetType: WorkItemType;
    assuranceProfile?: AssuranceProfile;
    organizationWide?: boolean;
    dueAfterMinutes: number;
    warningBeforeMinutes: number;
    escalateAfterMinutes: number;
    escalationSeverity: "P0" | "P1" | "P2" | "P3";
  },
) {
  await requireWorkspaceAuthorization(ctx, "workflow.manage");
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  const policyKey = text(input.policyKey, "Policy key", 100);
  const name = text(input.name, "Policy name", 200);
  integer(input.dueAfterMinutes, "Due time", 1, 525_600);
  integer(
    input.warningBeforeMinutes,
    "Warning time",
    0,
    input.dueAfterMinutes,
  );
  integer(input.escalateAfterMinutes, "Escalation delay", 0, 525_600);
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    await tx.$queryRaw`
      SELECT id FROM organization WHERE id = ${organizationId} FOR UPDATE
    `;
    const actor = await organizationMembership(tx, organizationId, ctx.user.id);
    const aggregate = await tx.slaPolicy.aggregate({
      where: { organizationId, policyKey },
      _max: { version: true },
    });
    const policy = await tx.slaPolicy.create({
      data: {
        organizationId,
        workspaceId: input.organizationWide ? null : ctx.workspace.id,
        policyKey,
        name,
        targetType: input.targetType,
        assuranceProfile: input.assuranceProfile,
        dueAfterMinutes: input.dueAfterMinutes,
        warningBeforeMinutes: input.warningBeforeMinutes,
        escalateAfterMinutes: input.escalateAfterMinutes,
        escalationSeverity: input.escalationSeverity,
        createdByOrganizationMembershipId: actor.id,
        version: (aggregate._max.version ?? 0) + 1,
      },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.WorkflowSlaPolicyCreated,
      entityType: "SlaPolicy",
      entityId: policy.id,
      correlationId: ctx.correlationId,
      payload: {
        policyKey,
        targetType: policy.targetType,
        version: policy.version,
      },
    });
    return policy;
  });
}

export async function createWorkflowAssignment(
  ctx: WorkspaceContext,
  input: WorkflowTarget & {
    accountabilityRole?: AccountabilityRole;
    assigneeUserId: string;
    reason: string;
    dueAt?: Date;
    slaPolicyId?: string;
  },
) {
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  const resolved = await withOrganizationTenant(
    organizationId,
    ctx.user.id,
    (tx) => resolveTarget(tx, ctx.workspace.id, input),
  );
  await requireWorkspaceAuthorization(ctx, "workflow.manage", resolved.missionId);
  const reason = text(input.reason, "Assignment reason");
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    await lockTarget(tx, ctx.workspace.id, input);
    const actor = await organizationMembership(tx, organizationId, ctx.user.id);
    const assignee = await organizationMembership(
      tx,
      organizationId,
      input.assigneeUserId,
    );
    const target = await resolveTarget(tx, ctx.workspace.id, input);
    const policy = await selectSlaPolicy(
      tx,
      organizationId,
      ctx.workspace.id,
      input.targetType,
      target.assuranceProfile,
      input.slaPolicyId,
    );
    const now = new Date();
    const dueAt =
      input.dueAt ??
      (policy
        ? new Date(now.getTime() + policy.dueAfterMinutes * 60_000)
        : null);
    try {
      const assignment = await tx.workflowAssignment.create({
        data: {
          organizationId,
          workspaceId: ctx.workspace.id,
          missionId: target.missionId,
          targetType: input.targetType,
          targetId: input.targetId,
          accountabilityRole: input.accountabilityRole ?? "ACCOUNTABLE",
          assigneeOrganizationMembershipId: assignee.id,
          assignedByOrganizationMembershipId: actor.id,
          reason,
          dueAt,
          slaPolicyId: policy?.id,
          slaPolicyVersion: policy?.version,
          validFrom: now,
        },
      });
      await writeAssignmentCreatedAudit(tx, ctx, assignment);
      return assignment;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new WorkflowError(
          "CONFLICT",
          "An active assignment already exists for this target and role",
        );
      }
      throw error;
    }
  });
}

async function writeAssignmentCreatedAudit(
  tx: TenantTransaction,
  ctx: WorkspaceContext,
  assignment: {
    id: string;
    targetType: WorkItemType;
    targetId: string;
    accountabilityRole: AccountabilityRole;
    assigneeOrganizationMembershipId: string;
    dueAt: Date | null;
    slaPolicyVersion: number | null;
  },
) {
  await writeAuditEvent(tx, {
    workspaceId: ctx.workspace.id,
    actorUserId: ctx.user.id,
    actorMembershipId: ctx.membership.id,
    eventType: AuditEventType.WorkflowAssignmentCreated,
    entityType: "WorkflowAssignment",
    entityId: assignment.id,
    correlationId: ctx.correlationId,
    payload: {
      targetType: assignment.targetType,
      targetId: assignment.targetId,
      accountabilityRole: assignment.accountabilityRole,
      assigneeOrganizationMembershipId:
        assignment.assigneeOrganizationMembershipId,
      dueAt: assignment.dueAt?.toISOString() ?? null,
      slaPolicyVersion: assignment.slaPolicyVersion,
    },
  });
}

export async function reassignWorkflowAssignment(
  ctx: WorkspaceContext,
  input: {
    assignmentId: string;
    expectedVersion: number;
    assigneeUserId: string;
    reason: string;
    dueAt?: Date;
  },
) {
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  const snapshot = await withOrganizationTenant(
    organizationId,
    ctx.user.id,
    (tx) =>
      tx.workflowAssignment.findFirst({
        where: {
          id: input.assignmentId,
          organizationId,
          workspaceId: ctx.workspace.id,
        },
      }),
  );
  if (!snapshot) throw new WorkflowError("NOT_FOUND", "Assignment not found");
  await requireWorkspaceAuthorization(ctx, "workflow.manage", snapshot.missionId);
  const reason = text(input.reason, "Reassignment reason");
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    await tx.$queryRaw`
      SELECT id FROM workflow_assignment
      WHERE organization_id = ${organizationId}
        AND id = ${input.assignmentId}
      FOR UPDATE
    `;
    const current = await tx.workflowAssignment.findFirst({
      where: {
        id: input.assignmentId,
        organizationId,
        workspaceId: ctx.workspace.id,
        status: "ACTIVE",
        version: input.expectedVersion,
      },
    });
    if (!current) {
      throw new WorkflowError(
        "STALE_VERSION",
        "Assignment changed, ended or was not found",
      );
    }
    const actor = await organizationMembership(tx, organizationId, ctx.user.id);
    const assignee = await organizationMembership(
      tx,
      organizationId,
      input.assigneeUserId,
    );
    const endedAt = new Date();
    await tx.workflowAssignment.update({
      where: { id: current.id },
      data: {
        status: "ENDED",
        endedAt,
        endedByOrganizationMembershipId: actor.id,
        validUntil: endedAt,
        version: { increment: 1 },
      },
    });
    const replacement = await tx.workflowAssignment.create({
      data: {
        organizationId,
        workspaceId: current.workspaceId,
        missionId: current.missionId,
        targetType: current.targetType,
        targetId: current.targetId,
        accountabilityRole: current.accountabilityRole,
        assigneeOrganizationMembershipId: assignee.id,
        assignedByOrganizationMembershipId: actor.id,
        reason,
        dueAt: input.dueAt ?? current.dueAt,
        slaPolicyId: current.slaPolicyId,
        slaPolicyVersion: current.slaPolicyVersion,
        validFrom: endedAt,
      },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.WorkflowAssignmentEnded,
      entityType: "WorkflowAssignment",
      entityId: current.id,
      correlationId: ctx.correlationId,
      payload: {
        targetType: current.targetType,
        targetId: current.targetId,
        replacementAssignmentId: replacement.id,
        reason,
      },
    });
    await writeAssignmentCreatedAudit(tx, ctx, replacement);
    return replacement;
  });
}

export type BulkReassignmentResult =
  | {
      assignmentId: string;
      status: "SUCCEEDED";
      replacementAssignmentId: string;
    }
  | {
      assignmentId: string;
      status: "FAILED";
      code: string;
      message: string;
    };

export async function bulkReassignWorkflowAssignments(
  ctx: WorkspaceContext,
  input: {
    items: Array<{ assignmentId: string; expectedVersion: number }>;
    assigneeUserId: string;
    reason: string;
  },
): Promise<BulkReassignmentResult[]> {
  if (input.items.length < 1 || input.items.length > 100) {
    throw new WorkflowError(
      "INVALID_INPUT",
      "Bulk reassignment requires 1–100 items",
    );
  }
  if (new Set(input.items.map((item) => item.assignmentId)).size !== input.items.length) {
    throw new WorkflowError(
      "INVALID_INPUT",
      "Bulk reassignment items must be unique",
    );
  }
  const results: BulkReassignmentResult[] = [];
  for (const item of input.items) {
    try {
      const replacement = await reassignWorkflowAssignment(ctx, {
        ...item,
        assigneeUserId: input.assigneeUserId,
        reason: input.reason,
      });
      results.push({
        assignmentId: item.assignmentId,
        status: "SUCCEEDED",
        replacementAssignmentId: replacement.id,
      });
    } catch (error) {
      results.push({
        assignmentId: item.assignmentId,
        status: "FAILED",
        code:
          error instanceof WorkflowError ? error.code : "COMMAND_FAILED",
        message:
          error instanceof WorkflowError
            ? error.message.slice(0, 300)
            : "Reassignment failed",
      });
    }
  }
  return results;
}

export async function createApprovalChain(
  ctx: WorkspaceContext,
  input: {
    chainKey: string;
    name: string;
    workflowType: ApprovalWorkflowType;
    organizationWide?: boolean;
    steps: Array<{
      name: string;
      requiredCapability: Capability;
      minimumApprovals?: number;
      requireIndependentFromPrevious?: boolean;
    }>;
  },
) {
  await requireWorkspaceAuthorization(ctx, "workflow.manage");
  if (input.steps.length < 1 || input.steps.length > 20) {
    throw new WorkflowError("INVALID_INPUT", "Approval chain requires 1–20 steps");
  }
  for (const step of input.steps) {
    if (!ALL_CAPABILITIES.includes(step.requiredCapability)) {
      throw new WorkflowError("INVALID_INPUT", "Unknown approval capability");
    }
    text(step.name, "Step name", 200);
    integer(step.minimumApprovals ?? 1, "Minimum approvals", 1, 20);
  }
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  const chainKey = text(input.chainKey, "Chain key", 100);
  const name = text(input.name, "Chain name", 200);
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    await tx.$queryRaw`
      SELECT id FROM organization WHERE id = ${organizationId} FOR UPDATE
    `;
    const actor = await organizationMembership(tx, organizationId, ctx.user.id);
    const aggregate = await tx.approvalChainDefinition.aggregate({
      where: { organizationId, chainKey },
      _max: { version: true },
    });
    const chain = await tx.approvalChainDefinition.create({
      data: {
        organizationId,
        workspaceId: input.organizationWide ? null : ctx.workspace.id,
        chainKey,
        name,
        workflowType: input.workflowType,
        createdByOrganizationMembershipId: actor.id,
        version: (aggregate._max.version ?? 0) + 1,
        steps: {
          create: input.steps.map((step, index) => ({
            sequence: index + 1,
            name: step.name.trim(),
            requiredCapability: step.requiredCapability,
            minimumApprovals: step.minimumApprovals ?? 1,
            requireIndependentFromPrevious:
              step.requireIndependentFromPrevious ?? false,
          })),
        },
      },
      include: { steps: { orderBy: { sequence: "asc" } } },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.WorkflowApprovalChainCreated,
      entityType: "ApprovalChainDefinition",
      entityId: chain.id,
      correlationId: ctx.correlationId,
      payload: {
        chainKey,
        workflowType: chain.workflowType,
        stepCount: chain.steps.length,
        version: chain.version,
      },
    });
    return chain;
  });
}

export async function requestWorkflowApproval(
  ctx: WorkspaceContext,
  input: WorkflowTarget & { chainDefinitionId: string },
) {
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  const resolved = await withOrganizationTenant(
    organizationId,
    ctx.user.id,
    (tx) => resolveTarget(tx, ctx.workspace.id, input),
  );
  await requireWorkspaceAuthorization(ctx, "workflow.request", resolved.missionId);
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    await lockTarget(tx, ctx.workspace.id, input);
    const actor = await organizationMembership(tx, organizationId, ctx.user.id);
    const chain = await tx.approvalChainDefinition.findFirst({
      where: {
        id: input.chainDefinitionId,
        organizationId,
        status: "ACTIVE",
        OR: [{ workspaceId: ctx.workspace.id }, { workspaceId: null }],
      },
      include: { steps: { orderBy: { sequence: "asc" }, take: 1 } },
    });
    if (!chain || !chain.steps[0]) {
      throw new WorkflowError("NOT_FOUND", "Active approval chain not found");
    }
    await resolveTarget(tx, ctx.workspace.id, input);
    let request;
    try {
      request = await tx.workflowApprovalRequest.create({
        data: {
          organizationId,
          workspaceId: ctx.workspace.id,
          missionId: resolved.missionId,
          chainDefinitionId: chain.id,
          targetType: input.targetType,
          targetId: input.targetId,
          currentStepSequence: chain.steps[0].sequence,
          requestedByOrganizationMembershipId: actor.id,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new WorkflowError(
          "CONFLICT",
          "A pending approval request already exists for this target and chain",
        );
      }
      throw error;
    }
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.WorkflowApprovalRequested,
      entityType: "WorkflowApprovalRequest",
      entityId: request.id,
      correlationId: ctx.correlationId,
      payload: {
        chainDefinitionId: chain.id,
        targetType: request.targetType,
        targetId: request.targetId,
      },
    });
    return request;
  });
}

export async function recordWorkflowApprovalAction(
  ctx: WorkspaceContext,
  input: {
    requestId: string;
    expectedVersion: number;
    decision: WorkflowApprovalDecision;
    rationale: string;
  },
) {
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  const snapshot = await withOrganizationTenant(
    organizationId,
    ctx.user.id,
    (tx) =>
      tx.workflowApprovalRequest.findFirst({
        where: {
          id: input.requestId,
          organizationId,
          workspaceId: ctx.workspace.id,
        },
        include: {
          chainDefinition: {
            include: { steps: { orderBy: { sequence: "asc" }, take: 100 } },
          },
        },
      }),
  );
  if (!snapshot) throw new WorkflowError("NOT_FOUND", "Approval request not found");
  const currentStep = snapshot.chainDefinition.steps.find(
    (step) => step.sequence === snapshot.currentStepSequence,
  );
  if (!currentStep) {
    throw new WorkflowError("CONFLICT", "Approval step is missing");
  }
  await requireWorkspaceAuthorization(
    ctx,
    currentStep.requiredCapability as Capability,
    snapshot.missionId,
  );
  const rationale = text(input.rationale, "Approval rationale", 2_000);
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    await tx.$queryRaw`
      SELECT id FROM workflow_approval_request
      WHERE organization_id = ${organizationId}
        AND id = ${input.requestId}
      FOR UPDATE
    `;
    const request = await tx.workflowApprovalRequest.findFirst({
      where: {
        id: input.requestId,
        organizationId,
        workspaceId: ctx.workspace.id,
        version: input.expectedVersion,
      },
      include: {
        chainDefinition: {
          include: { steps: { orderBy: { sequence: "asc" }, take: 100 } },
        },
        actions: {
          include: { step: { select: { sequence: true } } },
          orderBy: { createdAt: "asc" },
          take: 2_000,
        },
      },
    });
    if (!request) {
      throw new WorkflowError("STALE_VERSION", "Approval request changed");
    }
    if (request.status !== "PENDING") {
      throw new WorkflowError("APPROVAL_CLOSED", "Approval request is closed");
    }
    const step = request.chainDefinition.steps.find(
      (item) => item.sequence === request.currentStepSequence,
    );
    if (!step || step.id !== currentStep.id) {
      throw new WorkflowError("STALE_VERSION", "Approval step changed");
    }
    const actor = await organizationMembership(tx, organizationId, ctx.user.id);
    const policy = await tx.organizationPolicy.findUnique({
      where: { organizationId },
      select: { preventSelfApproval: true },
    });
    if (
      policy?.preventSelfApproval &&
      request.requestedByOrganizationMembershipId === actor.id
    ) {
      throw new WorkflowError(
        "INDEPENDENCE_REQUIRED",
        "The requester cannot approve their own workflow request",
      );
    }
    if (
      step.requireIndependentFromPrevious &&
      request.actions.some(
        (action) =>
          action.step.sequence < step.sequence &&
          action.actorOrganizationMembershipId === actor.id,
      )
    ) {
      throw new WorkflowError(
        "INDEPENDENCE_REQUIRED",
        "This approval step requires an independent actor",
      );
    }
    const action = await tx.workflowApprovalAction.create({
      data: {
        organizationId,
        workspaceId: ctx.workspace.id,
        requestId: request.id,
        stepId: step.id,
        decision: input.decision,
        rationale,
        actorOrganizationMembershipId: actor.id,
      },
    });
    let status: WorkflowApprovalStatus = request.status;
    let nextSequence = request.currentStepSequence;
    let completedAt: Date | null = null;
    if (input.decision === "REJECTED") {
      status = "REJECTED";
      completedAt = new Date();
    } else {
      const approvals =
        request.actions.filter(
          (item) =>
            item.stepId === step.id && item.decision === "APPROVED",
        ).length + 1;
      if (approvals >= step.minimumApprovals) {
        const next = request.chainDefinition.steps.find(
          (item) => item.sequence > step.sequence,
        );
        if (next) {
          nextSequence = next.sequence;
        } else {
          status = "APPROVED";
          completedAt = new Date();
        }
      }
    }
    const updated = await tx.workflowApprovalRequest.update({
      where: { id: request.id },
      data: {
        status,
        currentStepSequence: nextSequence,
        completedAt,
        version: { increment: 1 },
      },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.WorkflowApprovalActionRecorded,
      entityType: "WorkflowApprovalAction",
      entityId: action.id,
      correlationId: ctx.correlationId,
      payload: {
        stepSequence: step.sequence,
        decision: action.decision,
        requestStatus: updated.status,
      },
    });
    return { action, request: updated };
  });
}

export async function evaluateSlaEscalations(
  ctx: WorkspaceContext,
  now = new Date(),
  first = 100,
) {
  await requireWorkspaceAuthorization(ctx, "workflow.manage");
  integer(first, "Evaluation limit", 1, 100);
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    const assignments = await tx.workflowAssignment.findMany({
      where: {
        organizationId,
        workspaceId: ctx.workspace.id,
        status: "ACTIVE",
        dueAt: { lte: now },
        slaPolicyId: { not: null },
      },
      include: { slaPolicy: true },
      orderBy: [{ dueAt: "asc" }, { id: "asc" }],
      take: first,
    });
    const created: string[] = [];
    for (const assignment of assignments) {
      if (
        !assignment.dueAt ||
        !assignment.slaPolicy ||
        now.getTime() <
          assignment.dueAt.getTime() +
            assignment.slaPolicy.escalateAfterMinutes * 60_000
      ) {
        continue;
      }
      const target = await resolveTarget(tx, ctx.workspace.id, assignment);
      if (target.complete) continue;
      try {
        const escalation = await tx.escalation.create({
          data: {
            workspaceId: ctx.workspace.id,
            missionId: assignment.missionId,
            severity: assignment.slaPolicy.escalationSeverity,
            reason: `SLA breached for ${assignment.targetType}:${assignment.targetId}`,
            sourceType: "WORKFLOW_ASSIGNMENT",
            sourceId: assignment.id,
            createdByMembershipId: ctx.membership.id,
          },
        });
        await writeAuditEvent(tx, {
          workspaceId: ctx.workspace.id,
          actorUserId: ctx.user.id,
          actorMembershipId: ctx.membership.id,
          eventType: AuditEventType.WorkflowSlaEscalated,
          entityType: "WorkflowAssignment",
          entityId: assignment.id,
          correlationId: ctx.correlationId,
          payload: {
            assignmentId: assignment.id,
            dueAt: assignment.dueAt.toISOString(),
            severity: escalation.severity,
          },
        });
        created.push(escalation.id);
      } catch (error) {
        if (
          !(
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
          )
        ) {
          throw error;
        }
      }
    }
    return { evaluated: assignments.length, escalationIds: created };
  });
}
