import { beforeEach, describe, expect, it } from "vitest";

import {
  acceptInvitation,
  changeMemberRole,
  createInvitation,
  ForbiddenError,
  InvariantError,
  listAuditEvents,
  listMembers,
  NotFoundError,
  provisionWorkspace,
  revokeInvitation,
  suspendMember,
  updateWorkspaceName,
} from "@/modules/identity-workspace";
import { getDb } from "@/server/db";

import {
  asOwner,
  contextForMembership,
  createUser,
  truncateAll,
} from "./helpers";

beforeEach(async () => {
  await truncateAll();
});

describe("onboarding provisioning", () => {
  it("ID-05 creates Workspace + OWNER Membership + AuditEvents atomically", async () => {
    const user = await createUser("founder");
    const ws = await provisionWorkspace(user, "Lattice Lab");

    const membership = await getDb().membership.findFirstOrThrow({
      where: { workspaceId: ws.id, userId: user.id },
    });
    expect(membership.role).toBe("OWNER");
    expect(membership.status).toBe("ACTIVE");

    const audits = await getDb().auditEvent.findMany({
      where: { workspaceId: ws.id },
    });
    const types = audits.map((a) => a.eventType).sort();
    expect(types).toContain("workspace.created");
    expect(types).toContain("membership.created");
  });

  it("ID-06 is idempotent under retry", async () => {
    const user = await createUser("founder");
    const first = await provisionWorkspace(user, "Lattice Lab");
    const second = await provisionWorkspace(user, "Different Name");
    expect(second.id).toBe(first.id);

    const count = await getDb().membership.count({ where: { userId: user.id } });
    expect(count).toBe(1);
  });
});

describe("workspace isolation", () => {
  it("ID-07 a member of Workspace A cannot mutate Workspace B", async () => {
    const alice = await createUser("alice");
    const bob = await createUser("bob");
    const ctxA = await asOwner(alice);
    const ctxB = await asOwner(bob);

    const bobMembership = await getDb().membership.findFirstOrThrow({
      where: { workspaceId: ctxB.workspace.id, userId: bob.id },
    });

    // Alice's context must not resolve a membership id from Bob's workspace.
    await expect(
      changeMemberRole(ctxA, bobMembership.id, "ADMIN"),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("ID-08 listMembers is scoped to the authorized workspace", async () => {
    const alice = await createUser("alice");
    const bob = await createUser("bob");
    const ctxA = await asOwner(alice);
    await asOwner(bob);

    const members = await listMembers(ctxA);
    expect(members).toHaveLength(1);
    expect(members[0].userId).toBe(alice.id);
  });
});

describe("permissions enforced server-side (ID-09)", () => {
  async function makeAdminAndMember() {
    const owner = await createUser("owner");
    const ownerCtx = await asOwner(owner);

    const admin = await createUser("admin");
    const adminInvite = await createInvitation(ownerCtx, {
      email: admin.email,
      role: "ADMIN",
    });
    await acceptInvitation(admin, adminInvite.rawToken);

    const member = await createUser("member");
    const memberInvite = await createInvitation(ownerCtx, {
      email: member.email,
      role: "MEMBER",
    });
    await acceptInvitation(member, memberInvite.rawToken);

    return {
      ownerCtx,
      adminCtx: await contextForMembership(admin, ownerCtx.workspace.id),
      memberCtx: await contextForMembership(member, ownerCtx.workspace.id),
      owner,
      member,
    };
  }

  it("a Member cannot update the workspace or read audit", async () => {
    const { memberCtx } = await makeAdminAndMember();
    await expect(updateWorkspaceName(memberCtx, "X")).rejects.toBeInstanceOf(
      ForbiddenError,
    );
    await expect(listAuditEvents(memberCtx)).rejects.toBeInstanceOf(
      ForbiddenError,
    );
  });

  it("ID-10 Admin cannot grant, demote, or remove an Owner", async () => {
    const { ownerCtx, adminCtx, memberCtx } = await makeAdminAndMember();

    const ownerMembership = await getDb().membership.findFirstOrThrow({
      where: { workspaceId: ownerCtx.workspace.id, role: "OWNER" },
    });
    const memberMembership = await getDb().membership.findFirstOrThrow({
      where: { id: memberCtx.membership.id },
    });

    // Grant a member Owner → forbidden for Admin.
    await expect(
      changeMemberRole(adminCtx, memberMembership.id, "OWNER"),
    ).rejects.toBeInstanceOf(ForbiddenError);
    // Demote the Owner → forbidden for Admin.
    await expect(
      changeMemberRole(adminCtx, ownerMembership.id, "ADMIN"),
    ).rejects.toBeInstanceOf(ForbiddenError);
    // Suspend the Owner → forbidden for Admin.
    await expect(
      suspendMember(adminCtx, ownerMembership.id),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe("last active Owner protection (ID-11)", () => {
  it("cannot demote or suspend the last Owner", async () => {
    const owner = await createUser("owner");
    const ctx = await asOwner(owner);
    const ownerMembership = await getDb().membership.findFirstOrThrow({
      where: { workspaceId: ctx.workspace.id, role: "OWNER" },
    });

    await expect(
      changeMemberRole(ctx, ownerMembership.id, "ADMIN"),
    ).rejects.toBeInstanceOf(InvariantError);
    await expect(
      suspendMember(ctx, ownerMembership.id),
    ).rejects.toBeInstanceOf(InvariantError);
  });

  it("allows demotion once a second Owner exists", async () => {
    const owner = await createUser("owner");
    const ctx = await asOwner(owner);
    const second = await createUser("second");
    const invite = await createInvitation(ctx, {
      email: second.email,
      role: "OWNER",
    });
    await acceptInvitation(second, invite.rawToken);

    const firstMembership = await getDb().membership.findFirstOrThrow({
      where: { workspaceId: ctx.workspace.id, userId: owner.id },
    });
    await expect(
      changeMemberRole(ctx, firstMembership.id, "ADMIN"),
    ).resolves.toBeUndefined();
  });
});

describe("invitations", () => {
  it("ID-12 stores only a token hash, never the raw token", async () => {
    const owner = await createUser("owner");
    const ctx = await asOwner(owner);
    const invitee = await createUser("invitee");
    const invite = await createInvitation(ctx, {
      email: invitee.email,
      role: "MEMBER",
    });

    const row = await getDb().invitation.findUniqueOrThrow({
      where: { id: invite.id },
    });
    expect(row.tokenHash).not.toBe(invite.rawToken);
    expect(row.tokenHash).toMatch(/^[a-f0-9]{64}$/);
    // The raw token is not persisted in any column.
    const asJson = JSON.stringify(row);
    expect(asJson).not.toContain(invite.rawToken);
  });

  it("ID-13 acceptance checks email, and is single-use", async () => {
    const owner = await createUser("owner");
    const ctx = await asOwner(owner);
    const invitee = await createUser("invitee");
    const wrong = await createUser("wrong");
    const invite = await createInvitation(ctx, {
      email: invitee.email,
      role: "MEMBER",
    });

    // Wrong email cannot accept.
    await expect(
      acceptInvitation(wrong, invite.rawToken),
    ).rejects.toBeInstanceOf(ForbiddenError);

    // Correct email accepts once.
    await expect(
      acceptInvitation(invitee, invite.rawToken),
    ).resolves.toMatchObject({ workspaceSlug: ctx.workspace.slug });

    // Second use is rejected.
    await expect(
      acceptInvitation(invitee, invite.rawToken),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("ID-14 acceptance creates the membership transactionally", async () => {
    const owner = await createUser("owner");
    const ctx = await asOwner(owner);
    const invitee = await createUser("invitee");
    const invite = await createInvitation(ctx, {
      email: invitee.email,
      role: "ADMIN",
    });
    await acceptInvitation(invitee, invite.rawToken);

    const membership = await getDb().membership.findFirstOrThrow({
      where: { workspaceId: ctx.workspace.id, userId: invitee.id },
    });
    expect(membership.role).toBe("ADMIN");
    expect(membership.status).toBe("ACTIVE");
  });

  it("ID-15 revoked invitations fail without creating a membership", async () => {
    const owner = await createUser("owner");
    const ctx = await asOwner(owner);
    const invitee = await createUser("invitee");
    const invite = await createInvitation(ctx, {
      email: invitee.email,
      role: "MEMBER",
    });
    await revokeInvitation(ctx, invite.id);

    await expect(
      acceptInvitation(invitee, invite.rawToken),
    ).rejects.toBeInstanceOf(ForbiddenError);

    const membership = await getDb().membership.findFirst({
      where: { workspaceId: ctx.workspace.id, userId: invitee.id },
    });
    expect(membership).toBeNull();
  });

  it("expired invitations fail without creating a membership", async () => {
    const owner = await createUser("owner");
    const ctx = await asOwner(owner);
    const invitee = await createUser("invitee");
    const invite = await createInvitation(ctx, {
      email: invitee.email,
      role: "MEMBER",
    });
    // Force expiry in the past.
    await getDb().invitation.update({
      where: { id: invite.id },
      data: { expiresAt: new Date(Date.now() - 1000) },
    });

    await expect(
      acceptInvitation(invitee, invite.rawToken),
    ).rejects.toBeInstanceOf(ForbiddenError);
    const membership = await getDb().membership.findFirst({
      where: { workspaceId: ctx.workspace.id, userId: invitee.id },
    });
    expect(membership).toBeNull();
  });
});

describe("audit", () => {
  it("ID-16 emits governed events with actor attribution", async () => {
    const owner = await createUser("owner");
    const ctx = await asOwner(owner);
    await updateWorkspaceName(ctx, "Renamed Lab");

    const events = await listAuditEvents(ctx);
    const update = events.find((e) => e.eventType === "workspace.updated");
    expect(update).toBeTruthy();
    expect(update?.actorUserId).toBe(owner.id);
  });

  it("ID-17 UPDATE and DELETE fail at the database level", async () => {
    const owner = await createUser("owner");
    const ctx = await asOwner(owner);
    const event = await getDb().auditEvent.findFirstOrThrow({
      where: { workspaceId: ctx.workspace.id },
    });

    // Two defense layers: the least-privileged runtime role lacks the
    // UPDATE/DELETE privilege ("permission denied"), and the append-only
    // trigger blocks any role that does hold it. Either way, it fails.
    await expect(
      getDb().$executeRawUnsafe(
        `UPDATE audit_event SET event_type = 'tampered' WHERE id = '${event.id}'`,
      ),
    ).rejects.toThrow(/append-only|permission denied/i);
    await expect(
      getDb().$executeRawUnsafe(
        `DELETE FROM audit_event WHERE id = '${event.id}'`,
      ),
    ).rejects.toThrow(/append-only|permission denied/i);
  });

  it("ID-18 stored audit payloads contain no credential-like keys", async () => {
    const owner = await createUser("owner");
    const ctx = await asOwner(owner);
    const invitee = await createUser("invitee");
    const invite = await createInvitation(ctx, {
      email: invitee.email,
      role: "MEMBER",
    });
    await acceptInvitation(invitee, invite.rawToken);

    const events = await getDb().auditEvent.findMany({
      where: { workspaceId: ctx.workspace.id },
    });
    const forbidden = /pass|token|secret|hash|cookie|authorization|session|credential/i;
    for (const e of events) {
      for (const key of Object.keys(e.payload as Record<string, unknown>)) {
        expect(key).not.toMatch(forbidden);
      }
    }
  });
});

describe("multiple workspaces (ID-20 data)", () => {
  it("a user who joins a second workspace has two active memberships", async () => {
    const owner = await createUser("owner");
    const ownerCtx = await asOwner(owner);

    const joiner = await createUser("joiner");
    await asOwner(joiner); // joiner's own workspace
    const invite = await createInvitation(ownerCtx, {
      email: joiner.email,
      role: "MEMBER",
    });
    await acceptInvitation(joiner, invite.rawToken);

    const memberships = await getDb().membership.count({
      where: { userId: joiner.id, status: "ACTIVE" },
    });
    expect(memberships).toBe(2);
  });
});
