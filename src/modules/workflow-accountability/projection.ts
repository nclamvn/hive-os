import { type Prisma, type WorkItemType } from "@prisma/client";

import {
  organizationIdForWorkspace,
  requireWorkspaceAuthorization,
} from "@/modules/authorization";
import type { WorkspaceContext } from "@/modules/identity-workspace";
import {
  decodeCursor,
  encodeCursor,
  normalizePageSize,
  type PageRequest,
  QueryContractError,
  toConnection,
} from "@/modules/query-contracts";
import {
  type TenantTransaction,
  withOrganizationTenant,
} from "@/server/tenant-context";

import { WorkflowError } from "./errors";
import { deriveSlaState } from "./sla";

export { deriveSlaState, type DerivedSlaState } from "./sla";

function obligationCursor(after?: string) {
  if (!after) return undefined;
  const cursor = decodeCursor("obligation-accountability:code_asc", after);
  if (cursor.s.length !== 1 || !cursor.s[0]) {
    throw new QueryContractError(
      "Obligation cursor is invalid",
      "INVALID_CURSOR",
    );
  }
  return { code: cursor.s[0], id: cursor.i };
}

export async function listObligationAccountability(
  ctx: WorkspaceContext,
  missionId: string,
  input: PageRequest & { includeTotalCount?: boolean } = {},
  now = new Date(),
) {
  await requireWorkspaceAuthorization(ctx, "workflow.read", missionId);
  const first = normalizePageSize(input.first);
  const cursor = obligationCursor(input.after);
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);

  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    const mission = await tx.mission.findFirst({
      where: { id: missionId, workspaceId: ctx.workspace.id },
      select: { id: true },
    });
    if (!mission) throw new WorkflowError("NOT_FOUND", "Mission not found");

    const baseWhere: Prisma.RuntimeObligationWhereInput = {
      workspaceId: ctx.workspace.id,
      missionId,
    };
    const where: Prisma.RuntimeObligationWhereInput = {
      ...baseWhere,
      ...(cursor
        ? {
            OR: [
              { contractObligation: { code: { gt: cursor.code } } },
              {
                contractObligation: { code: cursor.code },
                id: { gt: cursor.id },
              },
            ],
          }
        : {}),
    };
    const rows = await tx.runtimeObligation.findMany({
      where,
      orderBy: [
        { contractObligation: { code: "asc" } },
        { id: "asc" },
      ],
      take: first + 1,
    });
    const definitions = rows.length
      ? await tx.contractObligation.findMany({
          where: { id: { in: rows.map((row) => row.contractObligationId) } },
          take: rows.length,
        })
      : [];
    const definitionById = new Map(
      definitions.map((definition) => [definition.id, definition]),
    );
    const obligationRows = rows.map((row) => {
      const contractObligation = definitionById.get(row.contractObligationId);
      if (!contractObligation) {
        throw new WorkflowError(
          "NOT_FOUND",
          "Contract obligation definition not found",
        );
      }
      return { ...row, contractObligation };
    });
    const totalCount = input.includeTotalCount
      ? await tx.runtimeObligation.count({ where: baseWhere })
      : undefined;
    const visibleRows = obligationRows.slice(0, first);
    const assignmentRows = visibleRows.length
      ? await tx.workflowAssignment.findMany({
          where: {
            organizationId,
            workspaceId: ctx.workspace.id,
            targetType: "RUNTIME_OBLIGATION",
            targetId: { in: visibleRows.map((row) => row.id) },
            accountabilityRole: "ACCOUNTABLE",
            status: "ACTIVE",
          },
          orderBy: { id: "asc" },
          take: visibleRows.length,
        })
      : [];
    const assignees = assignmentRows.length
      ? await tx.organizationMembership.findMany({
          where: {
            organizationId,
            id: {
              in: assignmentRows.map(
                (assignment) => assignment.assigneeOrganizationMembershipId,
              ),
            },
          },
          select: { id: true, userId: true },
          take: assignmentRows.length,
        })
      : [];
    const users = assignees.length
      ? await tx.user.findMany({
          where: { id: { in: assignees.map((assignee) => assignee.userId) } },
          select: { id: true, name: true, email: true },
          take: assignees.length,
        })
      : [];
    const policies = assignmentRows.some((assignment) => assignment.slaPolicyId)
      ? await tx.slaPolicy.findMany({
          where: {
            organizationId,
            id: {
              in: assignmentRows.flatMap((assignment) =>
                assignment.slaPolicyId ? [assignment.slaPolicyId] : [],
              ),
            },
          },
          take: assignmentRows.length,
        })
      : [];
    const userById = new Map(users.map((user) => [user.id, user]));
    const assigneeById = new Map(
      assignees.map((assignee) => [
        assignee.id,
        { ...assignee, user: userById.get(assignee.userId)! },
      ]),
    );
    const policyById = new Map(policies.map((policy) => [policy.id, policy]));
    const assignments = assignmentRows.map((assignment) => ({
      ...assignment,
      assignee: assigneeById.get(
        assignment.assigneeOrganizationMembershipId,
      )!,
      slaPolicy: assignment.slaPolicyId
        ? (policyById.get(assignment.slaPolicyId) ?? null)
        : null,
    }));
    const assignmentByTarget = new Map(
      assignments.map((assignment) => [assignment.targetId, assignment]),
    );
    const projected = obligationRows.map((row) => {
      const assignment = assignmentByTarget.get(row.id) ?? null;
      return {
        obligation: row,
        assignment,
        slaState: deriveSlaState({
          assigned: Boolean(assignment),
          complete: ["SATISFIED", "WAIVED"].includes(row.status),
          dueAt: assignment?.dueAt,
          warningBeforeMinutes: assignment?.slaPolicy?.warningBeforeMinutes,
          escalateAfterMinutes: assignment?.slaPolicy?.escalateAfterMinutes,
          now,
        }),
      };
    });
    return toConnection(
      projected,
      first,
      (row) =>
        encodeCursor(
          "obligation-accountability:code_asc",
          [row.obligation.contractObligation.code],
          row.obligation.id,
        ),
      totalCount,
    );
  });
}

const NULL_DUE_CURSOR = "9999-12-31T23:59:59.999Z";

function inboxCursor(after?: string) {
  if (!after) return undefined;
  const cursor = decodeCursor("work-inbox:due_asc", after);
  if (cursor.s.length !== 1) {
    throw new QueryContractError("Inbox cursor is invalid", "INVALID_CURSOR");
  }
  if (cursor.s[0] === NULL_DUE_CURSOR) {
    return { dueAt: null, id: cursor.i };
  }
  const dueAt = new Date(cursor.s[0] ?? "");
  if (Number.isNaN(dueAt.getTime())) {
    throw new QueryContractError("Inbox cursor is invalid", "INVALID_CURSOR");
  }
  return { dueAt, id: cursor.i };
}

type InboxAssignment = Prisma.WorkflowAssignmentGetPayload<{
  include: {
    mission: { select: { referenceCode: true; title: true } };
    assignee: {
      select: {
        id: true;
        userId: true;
        user: { select: { name: true; email: true } };
      };
    };
    slaPolicy: true;
  };
}>;

async function targetCompletion(
  tx: TenantTransaction,
  workspaceId: string,
  assignments: InboxAssignment[],
) {
  const ids = (targetType: WorkItemType) =>
    assignments
      .filter((assignment) => assignment.targetType === targetType)
      .map((assignment) => assignment.targetId);
  const missionIds = ids("MISSION");
  const obligationIds = ids("RUNTIME_OBLIGATION");
  const decisionIds = ids("DECISION");
  const escalationIds = ids("ESCALATION");
  const tipIds = ids("EXECUTION_TIP");
  const reportIds = ids("VERIFICATION_REPORT");

  const missions = missionIds.length
    ? await tx.mission.findMany({
        where: { workspaceId, id: { in: missionIds } },
        select: { id: true, status: true },
        take: missionIds.length,
      })
    : [];
  const obligations = obligationIds.length
    ? await tx.runtimeObligation.findMany({
        where: { workspaceId, id: { in: obligationIds } },
        select: { id: true, status: true },
        take: obligationIds.length,
      })
    : [];
  const decisions = decisionIds.length
    ? await tx.decision.findMany({
        where: { workspaceId, id: { in: decisionIds } },
        select: { id: true, status: true },
        take: decisionIds.length,
      })
    : [];
  const escalations = escalationIds.length
    ? await tx.escalation.findMany({
        where: { workspaceId, id: { in: escalationIds } },
        select: { id: true, status: true },
        take: escalationIds.length,
      })
    : [];
  const tips = tipIds.length
    ? await tx.executionTip.findMany({
        where: { workspaceId, id: { in: tipIds } },
        select: { id: true, status: true },
        take: tipIds.length,
      })
    : [];
  const reports = reportIds.length
    ? await tx.verificationReport.findMany({
        where: { workspaceId, id: { in: reportIds } },
        select: { id: true },
        take: reportIds.length,
      })
    : [];

  const result = new Map<string, boolean>();
  for (const row of missions) {
    result.set(
      `MISSION:${row.id}`,
      ["RELEASED", "PARTIAL", "REFUTED", "CANCELLED", "ARCHIVED"].includes(
        row.status,
      ),
    );
  }
  for (const row of obligations) {
    result.set(
      `RUNTIME_OBLIGATION:${row.id}`,
      ["SATISFIED", "WAIVED"].includes(row.status),
    );
  }
  for (const row of decisions) {
    result.set(`DECISION:${row.id}`, row.status !== "REQUIRED");
  }
  for (const row of escalations) {
    result.set(`ESCALATION:${row.id}`, row.status === "RESOLVED");
  }
  for (const row of tips) {
    result.set(
      `EXECUTION_TIP:${row.id}`,
      ["DONE", "CANCELLED"].includes(row.status),
    );
  }
  for (const row of reports) {
    result.set(`VERIFICATION_REPORT:${row.id}`, true);
  }
  return result;
}

export async function getWorkInbox(
  ctx: WorkspaceContext,
  input: PageRequest = {},
  now = new Date(),
) {
  await requireWorkspaceAuthorization(ctx, "workflow.read");
  const first = normalizePageSize(input.first);
  const cursor = inboxCursor(input.after);
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);

  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    const actor = await tx.organizationMembership.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId: ctx.user.id,
        },
      },
      select: { id: true, status: true },
    });
    if (!actor || actor.status !== "ACTIVE") {
      throw new WorkflowError(
        "FORBIDDEN",
        "Active organization membership required",
      );
    }
    const seek: Prisma.WorkflowAssignmentWhereInput = cursor
      ? cursor.dueAt
        ? {
            OR: [
              { dueAt: { gt: cursor.dueAt } },
              { dueAt: cursor.dueAt, id: { gt: cursor.id } },
              { dueAt: null },
            ],
          }
        : { dueAt: null, id: { gt: cursor.id } }
      : {};
    const assignmentRows = await tx.workflowAssignment.findMany({
      where: {
        organizationId,
        workspaceId: ctx.workspace.id,
        assigneeOrganizationMembershipId: actor.id,
        status: "ACTIVE",
        ...seek,
      },
      orderBy: [
        { dueAt: { sort: "asc", nulls: "last" } },
        { id: "asc" },
      ],
      take: first + 1,
    });
    const missions = assignmentRows.length
      ? await tx.mission.findMany({
          where: {
            workspaceId: ctx.workspace.id,
            id: { in: assignmentRows.map((assignment) => assignment.missionId) },
          },
          select: { id: true, referenceCode: true, title: true },
          take: assignmentRows.length,
        })
      : [];
    const assignees = assignmentRows.length
      ? await tx.organizationMembership.findMany({
          where: {
            organizationId,
            id: {
              in: assignmentRows.map(
                (assignment) => assignment.assigneeOrganizationMembershipId,
              ),
            },
          },
          select: { id: true, userId: true },
          take: assignmentRows.length,
        })
      : [];
    const users = assignees.length
      ? await tx.user.findMany({
          where: { id: { in: assignees.map((assignee) => assignee.userId) } },
          select: { id: true, name: true, email: true },
          take: assignees.length,
        })
      : [];
    const policies = assignmentRows.some((assignment) => assignment.slaPolicyId)
      ? await tx.slaPolicy.findMany({
          where: {
            organizationId,
            id: {
              in: assignmentRows.flatMap((assignment) =>
                assignment.slaPolicyId ? [assignment.slaPolicyId] : [],
              ),
            },
          },
          take: assignmentRows.length,
        })
      : [];
    const missionById = new Map(missions.map((mission) => [mission.id, mission]));
    const userById = new Map(users.map((user) => [user.id, user]));
    const assigneeById = new Map(
      assignees.map((assignee) => [
        assignee.id,
        { ...assignee, user: userById.get(assignee.userId)! },
      ]),
    );
    const policyById = new Map(policies.map((policy) => [policy.id, policy]));
    const rows: InboxAssignment[] = assignmentRows.map((assignment) => {
      const mission = missionById.get(assignment.missionId);
      const assignee = assigneeById.get(
        assignment.assigneeOrganizationMembershipId,
      );
      if (!mission || !assignee?.user) {
        throw new WorkflowError("NOT_FOUND", "Workflow assignment relation not found");
      }
      return {
        ...assignment,
        mission: {
          referenceCode: mission.referenceCode,
          title: mission.title,
        },
        assignee,
        slaPolicy: assignment.slaPolicyId
          ? (policyById.get(assignment.slaPolicyId) ?? null)
          : null,
      };
    });
    const completion = await targetCompletion(
      tx,
      ctx.workspace.id,
      rows.slice(0, first),
    );
    const projected = rows.map((assignment) => {
      const key = `${assignment.targetType}:${assignment.targetId}`;
      return {
        assignment,
        slaState: deriveSlaState({
          assigned: true,
          targetExists: completion.has(key),
          complete: completion.get(key),
          dueAt: assignment.dueAt,
          warningBeforeMinutes: assignment.slaPolicy?.warningBeforeMinutes,
          escalateAfterMinutes: assignment.slaPolicy?.escalateAfterMinutes,
          now,
        }),
      };
    });
    return toConnection(projected, first, (row) =>
      encodeCursor(
        "work-inbox:due_asc",
        [row.assignment.dueAt ?? NULL_DUE_CURSOR],
        row.assignment.id,
      ),
    );
  });
}
