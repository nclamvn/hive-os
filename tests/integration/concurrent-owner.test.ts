import { beforeEach, describe, expect, it } from "vitest";

import {
  acceptInvitation,
  changeMemberRole,
  createInvitation,
  suspendMember,
  type WorkspaceContext,
} from "@/modules/identity-workspace";
import { getDb } from "@/server/db";

import { asOwner, contextForMembership, createUser, truncateAll } from "./helpers";

beforeEach(async () => {
  await truncateAll();
});

interface TwoOwners {
  workspaceId: string;
  ctx1: WorkspaceContext;
  ctx2: WorkspaceContext;
  membership1: string;
  membership2: string;
}

async function twoOwnerWorkspace(): Promise<TwoOwners> {
  const owner1 = await createUser("owner1");
  const ctx1 = await asOwner(owner1);
  const owner2 = await createUser("owner2");
  const invite = await createInvitation(ctx1, {
    email: owner2.email,
    role: "OWNER",
  });
  await acceptInvitation(owner2, invite.rawToken);
  const ctx2 = await contextForMembership(owner2, ctx1.workspace.id);

  return {
    workspaceId: ctx1.workspace.id,
    ctx1,
    ctx2,
    membership1: ctx1.membership.id,
    membership2: ctx2.membership.id,
  };
}

async function activeOwners(workspaceId: string): Promise<number> {
  return getDb().membership.count({
    where: { workspaceId, role: "OWNER", status: "ACTIVE" },
  });
}

function fulfilledCount(results: PromiseSettledResult<unknown>[]): number {
  return results.filter((r) => r.status === "fulfilled").length;
}

describe("last-owner concurrency (SEC-01)", () => {
  it("C-OWNER-01 two concurrent demotes of different Owners → exactly one succeeds", async () => {
    const w = await twoOwnerWorkspace();

    const results = await Promise.allSettled([
      changeMemberRole(w.ctx1, w.membership2, "ADMIN"),
      changeMemberRole(w.ctx2, w.membership1, "ADMIN"),
    ]);

    expect(fulfilledCount(results)).toBe(1);
    expect(await activeOwners(w.workspaceId)).toBeGreaterThanOrEqual(1);
  });

  it("C-OWNER-02 concurrent demote of A and suspend of B → exactly one authority reduction", async () => {
    const w = await twoOwnerWorkspace();

    const results = await Promise.allSettled([
      changeMemberRole(w.ctx1, w.membership2, "ADMIN"),
      suspendMember(w.ctx2, w.membership1),
    ]);

    expect(fulfilledCount(results)).toBe(1);
    expect(await activeOwners(w.workspaceId)).toBeGreaterThanOrEqual(1);
  });

  it("C-OWNER-03 concurrent duplicate demotes of the sole Owner → both fail safely", async () => {
    const owner = await createUser("solo");
    const ctx = await asOwner(owner);
    const membershipId = ctx.membership.id;

    const results = await Promise.allSettled([
      changeMemberRole(ctx, membershipId, "ADMIN"),
      changeMemberRole(ctx, membershipId, "ADMIN"),
    ]);

    expect(fulfilledCount(results)).toBe(0);
    expect(await activeOwners(ctx.workspace.id)).toBe(1);
  });
});
