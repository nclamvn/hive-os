import type { OrgUnitType } from "@prisma/client";

import {
  AuditEventType,
  type DbClient,
  InvariantError,
  NotFoundError,
  type WorkspaceContext,
  writeAuditEvent,
} from "@/modules/identity-workspace";
import { requireWorkspaceAuthorization } from "@/modules/authorization";
import { getDb } from "@/server/db";
import { withOrganizationTenant } from "@/server/tenant-context";

const MAX_TREE_ROWS = 500;
const MAX_COLLECTION_ROWS = 200;
const MAX_CLOSURE_ROWS = 5_000;
const keyPattern = /^[a-z][a-z0-9-]{1,62}[a-z0-9]$/;

function normalizedKey(value: string, label: string): string {
  const key = value.trim().toLowerCase();
  if (!keyPattern.test(key)) {
    throw new InvariantError(
      `${label} must be 3-64 lowercase letters, numbers, or hyphens`,
    );
  }
  return key;
}

function requiredName(value: string): string {
  const name = value.trim();
  if (!name || name.length > 160) {
    throw new InvariantError("Name must be between 1 and 160 characters");
  }
  return name;
}

async function organizationScope(ctx: WorkspaceContext) {
  const workspace = await getDb().workspace.findFirst({
    where: { id: ctx.workspace.id },
    select: { organizationId: true },
  });
  if (!workspace) throw new NotFoundError();
  return workspace.organizationId;
}

async function lockOrganization(organizationId: string, tx: DbClient) {
  await tx.$queryRaw`SELECT id FROM "organization" WHERE id = ${organizationId} FOR UPDATE`;
}

export async function getOrganizationHierarchy(
  ctx: WorkspaceContext,
  limit = MAX_TREE_ROWS,
) {
  const organizationId = await organizationScope(ctx);
  await requireWorkspaceAuthorization(ctx, "workspace.read");
  const bounded = Math.max(1, Math.min(limit, MAX_TREE_ROWS));
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    const [organization, unitRows] = await Promise.all([
      tx.organization.findUniqueOrThrow({
        where: { id: organizationId },
        select: {
          id: true,
          slug: true,
          name: true,
          status: true,
          version: true,
        },
      }),
      tx.orgUnit.findMany({
        where: { organizationId },
        orderBy: [{ type: "asc" }, { unitKey: "asc" }, { id: "asc" }],
        take: bounded + 1,
      }),
    ]);
    const units = unitRows.slice(0, bounded);
    const visibleIds = units.map((unit) => unit.id);
    const pathRows = await tx.orgUnitClosure.findMany({
      where: {
        organizationId,
        ancestorId: { in: visibleIds },
        descendantId: { in: visibleIds },
      },
      orderBy: [
        { ancestorId: "asc" },
        { depth: "asc" },
        { descendantId: "asc" },
      ],
      take: MAX_CLOSURE_ROWS + 1,
    });
    const paths = pathRows.slice(0, MAX_CLOSURE_ROWS);
    return {
      organization,
      units,
      paths,
      pageInfo: {
        limit: bounded,
        truncated: unitRows.length > bounded,
        pathsTruncated: pathRows.length > MAX_CLOSURE_ROWS,
      },
    };
  });
}

export async function createOrgUnit(
  ctx: WorkspaceContext,
  input: {
    parentId: string;
    unitKey: string;
    name: string;
    type: Exclude<OrgUnitType, "ROOT">;
  },
) {
  const organizationId = await organizationScope(ctx);
  await requireWorkspaceAuthorization(ctx, "workspace.update");
  const unitKey = normalizedKey(input.unitKey, "Unit key");
  const name = requiredName(input.name);

  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    await lockOrganization(organizationId, tx);
    const parent = await tx.orgUnit.findFirst({
      where: { id: input.parentId, organizationId },
      select: { id: true },
    });
    if (!parent) throw new NotFoundError();
    const unit = await tx.orgUnit.create({
      data: {
        organizationId,
        parentId: parent.id,
        unitKey,
        name,
        type: input.type,
        createdById: ctx.user.id,
      },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.OrganizationUnitCreated,
      entityType: "OrgUnit",
      entityId: unit.id,
      correlationId: ctx.correlationId,
      payload: { unitKey, name, type: input.type, parentId: parent.id },
    });
    return unit;
  });
}

export async function moveOrgUnit(
  ctx: WorkspaceContext,
  input: { unitId: string; parentId: string; expectedVersion: number },
) {
  const organizationId = await organizationScope(ctx);
  await requireWorkspaceAuthorization(ctx, "workspace.update");
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    await lockOrganization(organizationId, tx);
    const [unit, parent] = await Promise.all([
      tx.orgUnit.findFirst({
        where: { id: input.unitId, organizationId },
      }),
      tx.orgUnit.findFirst({
        where: { id: input.parentId, organizationId },
        select: { id: true },
      }),
    ]);
    if (!unit || !parent) throw new NotFoundError();
    if (unit.type === "ROOT") {
      throw new InvariantError("The root organizational unit cannot be moved");
    }
    if (unit.version !== input.expectedVersion) {
      throw new InvariantError("Organizational unit changed concurrently");
    }
    if (unit.parentId === parent.id) return unit;

    const updated = await tx.orgUnit.update({
      where: { id: unit.id },
      data: { parentId: parent.id, version: { increment: 1 } },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.OrganizationUnitMoved,
      entityType: "OrgUnit",
      entityId: unit.id,
      correlationId: ctx.correlationId,
      payload: {
        fromParentId: unit.parentId!,
        toParentId: parent.id,
        version: updated.version,
      },
    });
    return updated;
  });
}

export async function createPortfolio(
  ctx: WorkspaceContext,
  input: { orgUnitId: string; portfolioKey: string; name: string },
) {
  const organizationId = await organizationScope(ctx);
  await requireWorkspaceAuthorization(ctx, "workspace.update");
  const portfolioKey = normalizedKey(input.portfolioKey, "Portfolio key");
  const name = requiredName(input.name);
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    await lockOrganization(organizationId, tx);
    const unit = await tx.orgUnit.findFirst({
      where: { id: input.orgUnitId, organizationId },
      select: { id: true },
    });
    if (!unit) throw new NotFoundError();
    const portfolio = await tx.portfolio.create({
      data: {
        organizationId,
        orgUnitId: unit.id,
        portfolioKey,
        name,
        createdById: ctx.user.id,
      },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.OrganizationPortfolioCreated,
      entityType: "Portfolio",
      entityId: portfolio.id,
      correlationId: ctx.correlationId,
      payload: { portfolioKey, name, orgUnitId: unit.id },
    });
    return portfolio;
  });
}

export async function createOrganizationGroup(
  ctx: WorkspaceContext,
  input: { groupKey: string; name: string },
) {
  const organizationId = await organizationScope(ctx);
  await requireWorkspaceAuthorization(ctx, "members.change_role");
  const groupKey = normalizedKey(input.groupKey, "Group key");
  const name = requiredName(input.name);
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    await lockOrganization(organizationId, tx);
    const group = await tx.organizationGroup.create({
      data: { organizationId, groupKey, name, createdById: ctx.user.id },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.OrganizationGroupCreated,
      entityType: "OrganizationGroup",
      entityId: group.id,
      correlationId: ctx.correlationId,
      payload: { groupKey, name },
    });
    return group;
  });
}

export async function addOrganizationGroupMember(
  ctx: WorkspaceContext,
  input: { groupId: string; organizationMembershipId: string },
) {
  const organizationId = await organizationScope(ctx);
  await requireWorkspaceAuthorization(ctx, "members.change_role");
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    await lockOrganization(organizationId, tx);
    const [group, membership] = await Promise.all([
      tx.organizationGroup.findFirst({
        where: { id: input.groupId, organizationId },
        select: { id: true },
      }),
      tx.organizationMembership.findFirst({
        where: { id: input.organizationMembershipId, organizationId },
        select: { id: true },
      }),
    ]);
    if (!group || !membership) throw new NotFoundError();
    const row = await tx.organizationGroupMembership.upsert({
      where: {
        organizationId_groupId_organizationMembershipId: {
          organizationId,
          groupId: group.id,
          organizationMembershipId: membership.id,
        },
      },
      create: {
        organizationId,
        groupId: group.id,
        organizationMembershipId: membership.id,
        createdById: ctx.user.id,
      },
      update: {},
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.OrganizationGroupMemberAdded,
      entityType: "OrganizationGroupMembership",
      entityId: row.id,
      correlationId: ctx.correlationId,
      payload: {
        groupId: group.id,
        organizationMembershipId: membership.id,
      },
    });
    return row;
  });
}

export async function listOrganizationCollections(ctx: WorkspaceContext) {
  const organizationId = await organizationScope(ctx);
  await requireWorkspaceAuthorization(ctx, "workspace.read");
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    const [portfolios, groups] = await Promise.all([
      tx.portfolio.findMany({
        where: { organizationId },
        orderBy: [{ portfolioKey: "asc" }, { id: "asc" }],
        take: MAX_COLLECTION_ROWS,
      }),
      tx.organizationGroup.findMany({
        where: { organizationId },
        orderBy: [{ groupKey: "asc" }, { id: "asc" }],
        take: MAX_COLLECTION_ROWS,
        include: { _count: { select: { memberships: true } } },
      }),
    ]);
    return { portfolios, groups, limit: MAX_COLLECTION_ROWS };
  });
}
