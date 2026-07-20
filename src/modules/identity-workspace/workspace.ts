import type { Prisma, Role } from "@prisma/client";

import { getDb } from "@/server/db";

import { AuditEventType, type DbClient, writeAuditEvent } from "./audit";
import type { WorkspaceContext } from "./context";
import { ForbiddenError, InvariantError, NotFoundError } from "./errors";
import { canChangeRole, type Capability, hasCapability } from "./permissions";

export function requireCapability(
  ctx: WorkspaceContext,
  capability: Capability,
): void {
  if (!hasCapability(ctx.membership.role, capability)) {
    throw new ForbiddenError(`Missing capability: ${capability}`);
  }
}

export interface MemberView {
  membershipId: string;
  userId: string;
  name: string;
  email: string;
  role: Role;
  status: string;
  isSelf: boolean;
}

export async function listMembers(
  ctx: WorkspaceContext,
): Promise<MemberView[]> {
  requireCapability(ctx, "members.read");
  const rows = await getDb().membership.findMany({
    where: { workspaceId: ctx.workspace.id },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  });
  return rows.map((m) => ({
    membershipId: m.id,
    userId: m.userId,
    name: m.user.name,
    email: m.user.email,
    role: m.role,
    status: m.status,
    isSelf: m.userId === ctx.user.id,
  }));
}

export async function updateWorkspaceName(
  ctx: WorkspaceContext,
  name: string,
): Promise<void> {
  requireCapability(ctx, "workspace.update");
  const trimmed = name.trim();
  if (!trimmed) throw new InvariantError("Workspace name is required");
  await getDb().$transaction(async (tx) => {
    await tx.workspace.update({
      where: { id: ctx.workspace.id },
      data: { name: trimmed, version: { increment: 1 } },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.WorkspaceUpdated,
      entityType: "Workspace",
      entityId: ctx.workspace.id,
      correlationId: ctx.correlationId,
      payload: { name: trimmed },
    });
  });
}

/** Number of active Owners in a workspace (used for last-owner protection). */
async function countActiveOwners(
  db: DbClient,
  workspaceId: string,
): Promise<number> {
  return db.membership.count({
    where: { workspaceId, role: "OWNER", status: "ACTIVE" },
  });
}

async function loadScopedMembership(
  ctx: WorkspaceContext,
  membershipId: string,
) {
  const membership = await getDb().membership.findFirst({
    where: { id: membershipId, workspaceId: ctx.workspace.id },
  });
  // Not found and out-of-workspace are indistinguishable to the caller.
  if (!membership) throw new NotFoundError();
  return membership;
}

export async function changeMemberRole(
  ctx: WorkspaceContext,
  membershipId: string,
  nextRole: Role,
): Promise<void> {
  const target = await loadScopedMembership(ctx, membershipId);

  if (!canChangeRole(ctx.membership.role, target.role, nextRole)) {
    throw new ForbiddenError("Not permitted to change this member's role");
  }
  if (target.role === nextRole) return;

  await getDb().$transaction(async (tx) => {
    // Demoting the last active Owner is forbidden.
    if (target.role === "OWNER" && nextRole !== "OWNER") {
      const owners = await countActiveOwners(tx, ctx.workspace.id);
      if (owners <= 1) {
        throw new InvariantError("A workspace must keep at least one Owner");
      }
    }
    await tx.membership.update({
      where: { id: target.id },
      data: { role: nextRole, version: { increment: 1 } },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.MembershipRoleChanged,
      entityType: "Membership",
      entityId: target.id,
      correlationId: ctx.correlationId,
      payload: { from: target.role, to: nextRole },
    });
  });
}

export async function suspendMember(
  ctx: WorkspaceContext,
  membershipId: string,
): Promise<void> {
  const target = await loadScopedMembership(ctx, membershipId);

  // Suspending an Owner requires Owner-management authority.
  const capability: Capability =
    target.role === "OWNER" ? "members.manage_owner" : "members.suspend";
  requireCapability(ctx, capability);
  if (target.status === "SUSPENDED") return;

  await getDb().$transaction(async (tx) => {
    if (target.role === "OWNER") {
      const owners = await countActiveOwners(tx, ctx.workspace.id);
      if (owners <= 1) {
        throw new InvariantError(
          "Cannot suspend the last active Owner of a workspace",
        );
      }
    }
    await tx.membership.update({
      where: { id: target.id },
      data: { status: "SUSPENDED", version: { increment: 1 } },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.MembershipSuspended,
      entityType: "Membership",
      entityId: target.id,
      correlationId: ctx.correlationId,
      payload: { role: target.role },
    });
  });
}

export interface AuditView {
  id: string;
  eventType: string;
  entityType: string;
  entityId: string;
  actorUserId: string | null;
  correlationId: string;
  createdAt: Date;
  payload: Prisma.JsonValue;
}

export async function listAuditEvents(
  ctx: WorkspaceContext,
  limit = 100,
): Promise<AuditView[]> {
  requireCapability(ctx, "audit.read");
  const rows = await getDb().auditEvent.findMany({
    where: { workspaceId: ctx.workspace.id },
    orderBy: { createdAt: "desc" },
    take: Math.min(limit, 200),
  });
  return rows.map((r) => ({
    id: r.id,
    eventType: r.eventType,
    entityType: r.entityType,
    entityId: r.entityId,
    actorUserId: r.actorUserId,
    correlationId: r.correlationId,
    createdAt: r.createdAt,
    payload: r.payload,
  }));
}
