import { randomUUID } from "node:crypto";

import { Prisma } from "@prisma/client";

import { getDb } from "@/server/db";
import { setOrganizationTenant } from "@/server/tenant-context";

import { AuditEventType, writeAuditEvent } from "./audit";
import type { AuthenticatedUser, WorkspaceRef } from "./context";
import { slugify, withRandomSuffix } from "./slug";

function toRef(w: {
  id: string;
  slug: string;
  name: string;
  status: WorkspaceRef["status"];
}): WorkspaceRef {
  return { id: w.id, slug: w.slug, name: w.name, status: w.status };
}

/**
 * Create a workspace with the founding user as OWNER, atomically with the
 * membership and audit events. Idempotent under retry: if the user already
 * belongs to an active workspace, that workspace is returned and nothing new
 * is created — a failed prior attempt never yields partial workspace authority.
 */
export async function provisionWorkspace(
  user: AuthenticatedUser,
  name: string,
): Promise<WorkspaceRef> {
  const db = getDb();

  const existing = await db.membership.findFirst({
    where: {
      userId: user.id,
      status: "ACTIVE",
      workspace: { status: "ACTIVE" },
    },
    include: { workspace: true },
    orderBy: { createdAt: "asc" },
  });
  if (existing) return toRef(existing.workspace);

  const correlationId = randomUUID();
  const displayName = name.trim() || "Workspace";
  const base = slugify(displayName);

  // Retry slug generation on the rare unique collision.
  for (let attempt = 0; attempt < 5; attempt++) {
    const slug = withRandomSuffix(base);
    try {
      const workspace = await db.$transaction(async (tx) => {
        const organizationId = randomUUID();
        const rootUnitId = randomUUID();
        const workspaceId = randomUUID();
        const membershipId = randomUUID();
        await setOrganizationTenant(tx, organizationId, user.id);
        await tx.organization.create({
          data: {
            id: organizationId,
            slug,
            name: displayName,
            createdById: user.id,
          },
        });
        await tx.orgUnit.create({
          data: {
            id: rootUnitId,
            organizationId,
            unitKey: "root",
            name: displayName,
            type: "ROOT",
            createdById: user.id,
          },
        });
        const ws = await tx.workspace.create({
          data: {
            id: workspaceId,
            organizationId,
            orgUnitId: rootUnitId,
            slug,
            name: displayName,
            createdById: user.id,
          },
        });
        await tx.workspacePolicy.create({
          data: { workspaceId: ws.id },
        });
        await tx.organizationMembership.create({
          data: {
            id: membershipId,
            organizationId,
            userId: user.id,
            role: "OWNER",
            status: "ACTIVE",
            createdById: user.id,
          },
        });
        await tx.organizationPolicy.create({
          data: {
            organizationId,
            updatedByOrganizationMembershipId: membershipId,
          },
        });
        await tx.scopedGrant.create({
          data: {
            organizationId,
            subjectType: "USER",
            subjectUserId: user.id,
            role: "ORG_OWNER",
            effect: "ALLOW",
            scopeType: "ORGANIZATION",
            grantedByOrganizationMembershipId: membershipId,
            reason: "Founding organization authority",
          },
        });
        const membership = await tx.membership.create({
          data: {
            id: membershipId,
            workspaceId: ws.id,
            userId: user.id,
            role: "OWNER",
            status: "ACTIVE",
            createdById: user.id,
          },
        });
        await writeAuditEvent(tx, {
          workspaceId: ws.id,
          actorUserId: user.id,
          actorMembershipId: membership.id,
          eventType: AuditEventType.WorkspaceCreated,
          entityType: "Workspace",
          entityId: ws.id,
          correlationId,
          payload: { name: ws.name, slug: ws.slug },
        });
        await writeAuditEvent(tx, {
          workspaceId: ws.id,
          actorUserId: user.id,
          actorMembershipId: membership.id,
          eventType: AuditEventType.OrganizationProvisioned,
          entityType: "Organization",
          entityId: organizationId,
          correlationId,
          payload: { name: displayName, slug, rootUnitId },
        });
        await writeAuditEvent(tx, {
          workspaceId: ws.id,
          actorUserId: user.id,
          actorMembershipId: membership.id,
          eventType: AuditEventType.MembershipCreated,
          entityType: "Membership",
          entityId: membership.id,
          correlationId,
          payload: { role: "OWNER", via: "onboarding" },
        });
        return ws;
      });
      return toRef(workspace);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002" &&
        attempt < 4
      ) {
        continue;
      }
      throw error;
    }
  }
  throw new Error("Could not allocate a unique workspace slug");
}
