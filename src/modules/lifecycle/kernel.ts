import {
  organizationIdForWorkspace,
  requireWorkspaceAuthorization,
} from "@/modules/authorization";
import {
  AuditEventType,
  type WorkspaceContext,
  writeAuditEvent,
} from "@/modules/identity-workspace";
import {
  decodeCursor,
  encodeCursor,
  normalizePageSize,
  type PageRequest,
  QueryContractError,
  toConnection,
} from "@/modules/query-contracts";
import { getObjectStorage } from "@/server/storage";
import {
  type TenantTransaction,
  withOrganizationTenant,
} from "@/server/tenant-context";

import { LifecycleError } from "./errors";

function boundedText(value: string, field: string, maximum = 1_000) {
  const normalized = value.trim();
  if (!normalized || normalized.length > maximum) {
    throw new LifecycleError(
      "INVALID_INPUT",
      `${field} must contain 1–${maximum} characters`,
    );
  }
  return normalized;
}

async function organizationActor(
  tx: TenantTransaction,
  organizationId: string,
  actorUserId: string,
) {
  const actor = await tx.organizationMembership.findUnique({
    where: {
      organizationId_userId: { organizationId, userId: actorUserId },
    },
    select: { id: true, status: true },
  });
  if (!actor || actor.status !== "ACTIVE") {
    throw new LifecycleError("INVALID_INPUT", "Active Organization member required");
  }
  return actor;
}

async function activeHold(
  tx: TenantTransaction,
  organizationId: string,
  workspaceId: string,
  missionId: string,
) {
  return tx.legalHold.findFirst({
    where: {
      organizationId,
      workspaceId,
      status: "ACTIVE",
      OR: [{ scope: "WORKSPACE" }, { scope: "MISSION", missionId }],
    },
    select: { id: true, scope: true },
    orderBy: [{ placedAt: "asc" }, { id: "asc" }],
  });
}

export async function placeLegalHold(
  ctx: WorkspaceContext,
  input: { missionId?: string; reason: string },
) {
  await requireWorkspaceAuthorization(ctx, "lifecycle.manage", input.missionId);
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  const reason = boundedText(input.reason, "Hold reason");
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    const actor = await organizationActor(tx, organizationId, ctx.user.id);
    if (input.missionId) {
      const mission = await tx.mission.findFirst({
        where: { id: input.missionId, workspaceId: ctx.workspace.id },
        select: { id: true },
      });
      if (!mission) throw new LifecycleError("NOT_FOUND", "Mission not found");
    }
    const hold = await tx.legalHold.create({
      data: {
        organizationId,
        workspaceId: ctx.workspace.id,
        missionId: input.missionId ?? null,
        scope: input.missionId ? "MISSION" : "WORKSPACE",
        reason,
        placedByOrganizationMembershipId: actor.id,
      },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.LegalHoldPlaced,
      entityType: "LegalHold",
      entityId: hold.id,
      correlationId: ctx.correlationId,
      payload: { scope: hold.scope, missionId: hold.missionId },
    });
    return hold;
  });
}

export async function releaseLegalHold(
  ctx: WorkspaceContext,
  input: { holdId: string; expectedVersion: number; reason: string },
) {
  await requireWorkspaceAuthorization(ctx, "lifecycle.manage");
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  const reason = boundedText(input.reason, "Release reason");
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    const actor = await organizationActor(tx, organizationId, ctx.user.id);
    const hold = await tx.legalHold.findFirst({
      where: {
        id: input.holdId,
        organizationId,
        workspaceId: ctx.workspace.id,
      },
    });
    if (!hold) throw new LifecycleError("NOT_FOUND", "Legal hold not found");
    if (hold.status !== "ACTIVE") {
      throw new LifecycleError("INVALID_TRANSITION", "Legal hold is not active");
    }
    const updated = await tx.legalHold.updateMany({
      where: { id: hold.id, version: input.expectedVersion, status: "ACTIVE" },
      data: {
        status: "RELEASED",
        releasedAt: new Date(),
        releasedByOrganizationMembershipId: actor.id,
        releaseReason: reason,
        version: { increment: 1 },
      },
    });
    if (updated.count !== 1) {
      throw new LifecycleError("VERSION_CONFLICT", "Legal hold version changed");
    }
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.LegalHoldReleased,
      entityType: "LegalHold",
      entityId: hold.id,
      correlationId: ctx.correlationId,
      payload: { scope: hold.scope, missionId: hold.missionId },
    });
    return tx.legalHold.findUniqueOrThrow({ where: { id: hold.id } });
  });
}

export async function createLifecycleDisposition(
  ctx: WorkspaceContext,
  input: { snapshotId: string; reason: string; now?: Date },
) {
  await requireWorkspaceAuthorization(ctx, "lifecycle.manage");
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  const requestReason = boundedText(input.reason, "Disposition reason");
  const now = input.now ?? new Date();
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    const actor = await organizationActor(tx, organizationId, ctx.user.id);
    const snapshot = await tx.snapshot.findFirst({
      where: {
        id: input.snapshotId,
        workspaceId: ctx.workspace.id,
        storageReference: { not: null },
      },
      select: {
        id: true,
        missionId: true,
        storageReference: true,
        contentHash: true,
        capturedAt: true,
      },
    });
    if (!snapshot?.storageReference) {
      throw new LifecycleError("NOT_FOUND", "Stored Snapshot not found");
    }
    const policy = await tx.workspacePolicy.findUnique({
      where: { workspaceId: ctx.workspace.id },
      select: { evidenceRetentionDays: true, version: true },
    });
    if (!policy) throw new LifecycleError("NOT_FOUND", "Workspace policy not found");
    const eligibleAt = new Date(
      snapshot.capturedAt.getTime() + policy.evidenceRetentionDays * 86_400_000,
    );
    if (eligibleAt > now) {
      throw new LifecycleError("NOT_ELIGIBLE", "Snapshot retention period has not elapsed");
    }
    const hold = await activeHold(
      tx,
      organizationId,
      ctx.workspace.id,
      snapshot.missionId,
    );
    const disposition = await tx.lifecycleDisposition.create({
      data: {
        organizationId,
        workspaceId: ctx.workspace.id,
        missionId: snapshot.missionId,
        snapshotId: snapshot.id,
        storageReference: snapshot.storageReference,
        contentHash: snapshot.contentHash,
        policyVersion: policy.version,
        eligibleAt,
        status: hold ? "BLOCKED" : "CANDIDATE",
        blockedReason: hold ? `LEGAL_HOLD:${hold.scope}` : null,
        requestedByOrganizationMembershipId: actor.id,
        requestReason,
      },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.LifecycleDispositionCreated,
      entityType: "LifecycleDisposition",
      entityId: disposition.id,
      correlationId: ctx.correlationId,
      payload: { snapshotId: snapshot.id, eligibleAt: eligibleAt.toISOString() },
    });
    return disposition;
  });
}

function snapshotEvaluationCursor(after?: string) {
  if (!after) return undefined;
  const cursor = decodeCursor("lifecycle-snapshot:captured_asc", after);
  const capturedAt = new Date(cursor.s[0] ?? "");
  if (cursor.s.length !== 1 || Number.isNaN(capturedAt.getTime())) {
    throw new QueryContractError("Lifecycle evaluation cursor is invalid", "INVALID_CURSOR");
  }
  return { capturedAt, id: cursor.i };
}

export async function evaluateLifecycleSnapshotPage(
  ctx: WorkspaceContext,
  input: PageRequest & { reason: string; now?: Date },
) {
  await requireWorkspaceAuthorization(ctx, "lifecycle.manage");
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  const requestReason = boundedText(input.reason, "Evaluation reason");
  const first = normalizePageSize(input.first, 100);
  const cursor = snapshotEvaluationCursor(input.after);
  const now = input.now ?? new Date();
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    const actor = await organizationActor(tx, organizationId, ctx.user.id);
    const policy = await tx.workspacePolicy.findUnique({
      where: { workspaceId: ctx.workspace.id },
      select: { evidenceRetentionDays: true, version: true },
    });
    if (!policy) throw new LifecycleError("NOT_FOUND", "Workspace policy not found");
    const cutoff = new Date(now.getTime() - policy.evidenceRetentionDays * 86_400_000);
    const rows = await tx.snapshot.findMany({
      where: {
        workspaceId: ctx.workspace.id,
        storageReference: { not: null },
        capturedAt: { lte: cutoff },
        lifecycleDisposition: null,
        ...(cursor
          ? {
              OR: [
                { capturedAt: { gt: cursor.capturedAt } },
                { capturedAt: cursor.capturedAt, id: { gt: cursor.id } },
              ],
            }
          : {}),
      },
      select: {
        id: true,
        missionId: true,
        storageReference: true,
        contentHash: true,
        capturedAt: true,
      },
      orderBy: [{ capturedAt: "asc" }, { id: "asc" }],
      take: first + 1,
    });
    const selected = rows.slice(0, first);
    const missionIds = [...new Set(selected.map((row) => row.missionId))];
    const workspaceHold = selected.length
      ? await tx.legalHold.findFirst({
          where: {
            organizationId,
            workspaceId: ctx.workspace.id,
            status: "ACTIVE",
            scope: "WORKSPACE",
          },
          select: { id: true },
        })
      : null;
    const missionHolds =
      selected.length && !workspaceHold
        ? await tx.legalHold.groupBy({
            by: ["missionId"],
            where: {
              organizationId,
              workspaceId: ctx.workspace.id,
              status: "ACTIVE",
              scope: "MISSION",
              missionId: { in: missionIds },
            },
            orderBy: { missionId: "asc" },
            take: first,
          })
        : [];
    const heldMissionIds = new Set(missionHolds.map((item) => item.missionId));
    const dispositions = [];
    for (const snapshot of selected) {
      const holdScope = workspaceHold
        ? "WORKSPACE"
        : heldMissionIds.has(snapshot.missionId)
          ? "MISSION"
          : null;
      const disposition = await tx.lifecycleDisposition.create({
        data: {
          organizationId,
          workspaceId: ctx.workspace.id,
          missionId: snapshot.missionId,
          snapshotId: snapshot.id,
          storageReference: snapshot.storageReference!,
          contentHash: snapshot.contentHash,
          policyVersion: policy.version,
          eligibleAt: new Date(
            snapshot.capturedAt.getTime() + policy.evidenceRetentionDays * 86_400_000,
          ),
          status: holdScope ? "BLOCKED" : "CANDIDATE",
          blockedReason: holdScope ? `LEGAL_HOLD:${holdScope}` : null,
          requestedByOrganizationMembershipId: actor.id,
          requestReason,
        },
      });
      await writeAuditEvent(tx, {
        workspaceId: ctx.workspace.id,
        actorUserId: ctx.user.id,
        actorMembershipId: ctx.membership.id,
        eventType: AuditEventType.LifecycleDispositionCreated,
        entityType: "LifecycleDisposition",
        entityId: disposition.id,
        correlationId: ctx.correlationId,
        payload: {
          snapshotId: snapshot.id,
          eligibleAt: disposition.eligibleAt.toISOString(),
        },
      });
      dispositions.push(disposition);
    }
    const end = selected.at(-1);
    return {
      nodes: dispositions,
      pageInfo: {
        endCursor: end
          ? encodeCursor(
              "lifecycle-snapshot:captured_asc",
              [end.capturedAt],
              end.id,
            )
          : null,
        hasNextPage: rows.length > first,
      },
    };
  });
}

export async function approveLifecycleDisposition(
  ctx: WorkspaceContext,
  input: { dispositionId: string; expectedVersion: number; reason: string },
) {
  await requireWorkspaceAuthorization(ctx, "lifecycle.manage");
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  const reason = boundedText(input.reason, "Approval reason");
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    const actor = await organizationActor(tx, organizationId, ctx.user.id);
    const disposition = await tx.lifecycleDisposition.findFirst({
      where: {
        id: input.dispositionId,
        organizationId,
        workspaceId: ctx.workspace.id,
      },
    });
    if (!disposition) throw new LifecycleError("NOT_FOUND", "Disposition not found");
    if (disposition.requestedByOrganizationMembershipId === actor.id) {
      throw new LifecycleError(
        "SEPARATION_OF_DUTIES",
        "Disposition requester cannot approve the same disposition",
      );
    }
    if (await activeHold(tx, organizationId, ctx.workspace.id, disposition.missionId)) {
      throw new LifecycleError("LEGAL_HOLD", "Active legal hold blocks disposition");
    }
    const updated = await tx.lifecycleDisposition.updateMany({
      where: {
        id: disposition.id,
        version: input.expectedVersion,
        status: { in: ["CANDIDATE", "BLOCKED"] },
      },
      data: {
        status: "APPROVED",
        blockedReason: null,
        approvedAt: new Date(),
        approvedByOrganizationMembershipId: actor.id,
        approvalReason: reason,
        version: { increment: 1 },
      },
    });
    if (updated.count !== 1) {
      throw new LifecycleError("VERSION_CONFLICT", "Disposition version changed");
    }
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.LifecycleDispositionApproved,
      entityType: "LifecycleDisposition",
      entityId: disposition.id,
      correlationId: ctx.correlationId,
      payload: { snapshotId: disposition.snapshotId, policyVersion: disposition.policyVersion },
    });
    return tx.lifecycleDisposition.findUniqueOrThrow({ where: { id: disposition.id } });
  });
}

export async function executeLifecycleDisposition(
  ctx: WorkspaceContext,
  input: { dispositionId: string; expectedVersion: number; reason: string },
) {
  await requireWorkspaceAuthorization(ctx, "lifecycle.manage");
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  const reason = boundedText(input.reason, "Execution reason");
  const storage = getObjectStorage();
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    await tx.$queryRaw`
      SELECT id FROM lifecycle_disposition
      WHERE organization_id = ${organizationId} AND id = ${input.dispositionId}
      FOR UPDATE
    `;
    const actor = await organizationActor(tx, organizationId, ctx.user.id);
    const disposition = await tx.lifecycleDisposition.findFirst({
      where: {
        id: input.dispositionId,
        organizationId,
        workspaceId: ctx.workspace.id,
        version: input.expectedVersion,
        status: "APPROVED",
      },
    });
    if (!disposition) {
      throw new LifecycleError("VERSION_CONFLICT", "Approved disposition version changed");
    }
    if (await activeHold(tx, organizationId, ctx.workspace.id, disposition.missionId)) {
      throw new LifecycleError("LEGAL_HOLD", "Active legal hold blocks disposition");
    }
    await storage.delete(disposition.storageReference);
    const executed = await tx.lifecycleDisposition.update({
      where: { id: disposition.id },
      data: {
        status: "EXECUTED",
        executedAt: new Date(),
        executedByOrganizationMembershipId: actor.id,
        executionReason: reason,
        version: { increment: 1 },
      },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.LifecycleDispositionExecuted,
      entityType: "LifecycleDisposition",
      entityId: disposition.id,
      correlationId: ctx.correlationId,
      payload: { snapshotId: disposition.snapshotId, objectBodyRemoved: true },
    });
    return executed;
  });
}

function dispositionCursor(after?: string) {
  if (!after) return undefined;
  const cursor = decodeCursor("lifecycle-disposition:eligible_asc", after);
  const eligibleAt = new Date(cursor.s[0] ?? "");
  if (cursor.s.length !== 1 || Number.isNaN(eligibleAt.getTime())) {
    throw new QueryContractError("Lifecycle cursor is invalid", "INVALID_CURSOR");
  }
  return { eligibleAt, id: cursor.i };
}

export async function listLifecycleDispositionPage(
  ctx: WorkspaceContext,
  input: PageRequest = {},
) {
  await requireWorkspaceAuthorization(ctx, "lifecycle.read");
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  const first = normalizePageSize(input.first, 100);
  const cursor = dispositionCursor(input.after);
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    const rows = await tx.lifecycleDisposition.findMany({
      where: {
        organizationId,
        workspaceId: ctx.workspace.id,
        ...(cursor
          ? {
              OR: [
                { eligibleAt: { gt: cursor.eligibleAt } },
                { eligibleAt: cursor.eligibleAt, id: { gt: cursor.id } },
              ],
            }
          : {}),
      },
      orderBy: [{ eligibleAt: "asc" }, { id: "asc" }],
      take: first + 1,
    });
    return toConnection(rows, first, (row) =>
      encodeCursor("lifecycle-disposition:eligible_asc", [row.eligibleAt], row.id),
    );
  });
}
