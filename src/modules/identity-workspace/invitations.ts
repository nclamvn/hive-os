import { createHash, randomBytes, randomUUID } from "node:crypto";

import { Prisma, type Role } from "@prisma/client";

import { getDb } from "@/server/db";
import { setOrganizationTenant } from "@/server/tenant-context";
import { legacyRoleToEnterpriseRole } from "@/modules/authorization/roles";

import { AuditEventType, writeAuditEvent } from "./audit";
import type { AuthenticatedUser, WorkspaceContext } from "./context";
import { ForbiddenError, InvariantError, NotFoundError } from "./errors";
import { hasCapability } from "./permissions";
import { normalizeEmail } from "./slug";

const INVITATION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/** Raw token is shown once to the inviter; only its hash is ever persisted. */
function hashToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}

export interface CreatedInvitation {
  id: string;
  emailNormalized: string;
  role: Role;
  expiresAt: Date;
  /** Present only at creation time; never stored, never re-derivable. */
  rawToken: string;
}

export async function createInvitation(
  ctx: WorkspaceContext,
  input: { email: string; role: Role },
): Promise<CreatedInvitation> {
  if (!hasCapability(ctx.membership.role, "members.invite")) {
    throw new ForbiddenError("Not permitted to invite members");
  }
  // Only Owners may invite someone as an Owner.
  if (
    input.role === "OWNER" &&
    !hasCapability(ctx.membership.role, "members.manage_owner")
  ) {
    throw new ForbiddenError("Only an Owner may invite an Owner");
  }

  const emailNormalized = normalizeEmail(input.email);
  if (!emailNormalized.includes("@")) {
    throw new InvariantError("A valid email is required");
  }

  const rawToken = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + INVITATION_TTL_MS);
  const correlationId = ctx.correlationId;

  const invitation = await getDb().$transaction(async (tx) => {
    const created = await tx.invitation.create({
      data: {
        workspaceId: ctx.workspace.id,
        emailNormalized,
        role: input.role,
        tokenHash: hashToken(rawToken),
        status: "PENDING",
        expiresAt,
        invitedByMembershipId: ctx.membership.id,
      },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.InvitationCreated,
      entityType: "Invitation",
      entityId: created.id,
      correlationId,
      // Email is PII, not a secret; the raw token is deliberately excluded.
      payload: { email: emailNormalized, role: input.role },
    });
    return created;
  });

  return {
    id: invitation.id,
    emailNormalized,
    role: input.role,
    expiresAt,
    rawToken,
  };
}

export interface InvitationView {
  id: string;
  emailNormalized: string;
  role: Role;
  status: string;
  expiresAt: Date;
  createdAt: Date;
}

/** Pending invitations for the workspace (management view). */
export async function listInvitations(
  ctx: WorkspaceContext,
): Promise<InvitationView[]> {
  if (!hasCapability(ctx.membership.role, "members.read")) {
    throw new ForbiddenError("Not permitted to read invitations");
  }
  const rows = await getDb().invitation.findMany({
    where: { workspaceId: ctx.workspace.id, status: "PENDING" },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: 100,
  });
  return rows.map((r) => ({
    id: r.id,
    emailNormalized: r.emailNormalized,
    role: r.role,
    status: r.status,
    expiresAt: r.expiresAt,
    createdAt: r.createdAt,
  }));
}

export async function revokeInvitation(
  ctx: WorkspaceContext,
  invitationId: string,
): Promise<void> {
  if (!hasCapability(ctx.membership.role, "members.invite")) {
    throw new ForbiddenError("Not permitted to manage invitations");
  }
  const invitation = await getDb().invitation.findFirst({
    where: { id: invitationId, workspaceId: ctx.workspace.id },
  });
  if (!invitation) throw new NotFoundError();
  if (invitation.status !== "PENDING") {
    throw new InvariantError("Only pending invitations can be revoked");
  }
  await getDb().$transaction(async (tx) => {
    await tx.invitation.update({
      where: { id: invitation.id },
      data: { status: "REVOKED" },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.InvitationRevoked,
      entityType: "Invitation",
      entityId: invitation.id,
      correlationId: ctx.correlationId,
      payload: { email: invitation.emailNormalized },
    });
  });
}

export interface AcceptedInvitation {
  workspaceSlug: string;
  membershipId: string;
}

/**
 * Accept an invitation. Validates email match, expiry, status and single-use.
 * Acceptance, membership creation and the status transition are one atomic
 * transaction; a failure creates no membership and leaves the invitation
 * consumable only if it was never actually consumed.
 */
export async function acceptInvitation(
  user: AuthenticatedUser,
  rawToken: string,
): Promise<AcceptedInvitation> {
  const db = getDb();
  const tokenHash = hashToken(rawToken);
  const invitation = await db.invitation.findUnique({
    where: { tokenHash },
    include: { workspace: true },
  });
  if (!invitation) throw new NotFoundError();

  if (invitation.status !== "PENDING") {
    throw new ForbiddenError("This invitation is no longer valid");
  }
  if (invitation.expiresAt.getTime() < Date.now()) {
    // Mark expired (best effort) and refuse.
    await db.invitation.updateMany({
      where: { id: invitation.id, status: "PENDING" },
      data: { status: "EXPIRED" },
    });
    throw new ForbiddenError("This invitation has expired");
  }
  if (normalizeEmail(user.email) !== invitation.emailNormalized) {
    throw new ForbiddenError("This invitation was issued to a different email");
  }
  if (invitation.workspace.status !== "ACTIVE") {
    throw new ForbiddenError("This workspace is not active");
  }

  const correlationId = randomUUID();

  try {
    const membershipId = await db.$transaction(async (tx) => {
      // Single-use guard: only the transaction that flips PENDING wins.
      const consumed = await tx.invitation.updateMany({
        where: { id: invitation.id, status: "PENDING" },
        data: {
          status: "ACCEPTED",
          acceptedByUserId: user.id,
          acceptedAt: new Date(),
        },
      });
      if (consumed.count !== 1) {
        throw new ForbiddenError("This invitation has already been used");
      }

      const workspace = await tx.workspace.findUniqueOrThrow({
        where: { id: invitation.workspaceId },
        select: { organizationId: true },
      });
      await setOrganizationTenant(tx, workspace.organizationId, user.id);
      const organizationMembership = await tx.organizationMembership.upsert({
        where: {
          organizationId_userId: {
            organizationId: workspace.organizationId,
            userId: user.id,
          },
        },
        create: {
          organizationId: workspace.organizationId,
          userId: user.id,
          role: invitation.role,
          status: "ACTIVE",
          createdById: user.id,
        },
        update: {},
      });
      const existingGrant = await tx.scopedGrant.findFirst({
        where: {
          organizationId: workspace.organizationId,
          subjectType: "USER",
          subjectUserId: user.id,
          role: legacyRoleToEnterpriseRole(invitation.role),
          effect: "ALLOW",
          scopeType: "ORGANIZATION",
          status: "ACTIVE",
        },
        select: { id: true },
      });
      if (!existingGrant) {
        await tx.scopedGrant.create({
          data: {
            organizationId: workspace.organizationId,
            subjectType: "USER",
            subjectUserId: user.id,
            role: legacyRoleToEnterpriseRole(invitation.role),
            effect: "ALLOW",
            scopeType: "ORGANIZATION",
            grantedByOrganizationMembershipId: organizationMembership.id,
            reason: "Workspace invitation compatibility authority",
          },
        });
      }
      const membership = await tx.membership.create({
        data: {
          workspaceId: invitation.workspaceId,
          userId: user.id,
          role: invitation.role,
          status: "ACTIVE",
          createdById: user.id,
        },
      });
      await writeAuditEvent(tx, {
        workspaceId: invitation.workspaceId,
        actorUserId: user.id,
        actorMembershipId: membership.id,
        eventType: AuditEventType.InvitationAccepted,
        entityType: "Invitation",
        entityId: invitation.id,
        correlationId,
        payload: { role: invitation.role },
      });
      await writeAuditEvent(tx, {
        workspaceId: invitation.workspaceId,
        actorUserId: user.id,
        actorMembershipId: membership.id,
        eventType: AuditEventType.MembershipCreated,
        entityType: "Membership",
        entityId: membership.id,
        correlationId,
        payload: { role: invitation.role, via: "invitation" },
      });
      return membership.id;
    });

    return { workspaceSlug: invitation.workspace.slug, membershipId };
  } catch (error) {
    // Already a member → fail safely without leaving a broken state.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new InvariantError("You are already a member of this workspace");
    }
    throw error;
  }
}
