import { randomUUID } from "node:crypto";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { createScopedGrant } from "@/modules/authorization";
import {
  acceptInvitation,
  createInvitation,
} from "@/modules/identity-workspace";
import {
  listMissionPage,
  listSkillPage,
  searchGovernedObjects,
} from "@/modules/query-contracts";
import { registerSkill } from "@/modules/skill-runtime";
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

async function addMember(
  owner: Awaited<ReturnType<typeof asOwner>>,
  prefix: string,
) {
  const user = await createUser(prefix);
  const invitation = await createInvitation(owner, {
    email: user.email,
    role: "MEMBER",
  });
  await acceptInvitation(user, invitation.rawToken);
  return {
    user,
    ctx: await contextForMembership(user, owner.workspace.id),
  };
}

describe("bounded query, grid and search contracts (TIP-023C)", () => {
  it("QUERY-02 traverses a stable mission order without duplicates", async () => {
    const owner = await asOwner(await createUser("query-owner"));
    const createdAt = new Date("2026-07-30T00:00:00.000Z");
    await getDb().mission.createMany({
      data: Array.from({ length: 55 }, (_, index) => ({
        id: randomUUID(),
        workspaceId: owner.workspace.id,
        referenceCode: `GRID-${String(index).padStart(4, "0")}`,
        title: `Grid mission ${index}`,
        status: index % 2 ? ("DRAFT" as const) : ("EXPLORING" as const),
        assuranceProfile: "PROFESSIONAL" as const,
        createdByMembershipId: owner.membership.id,
        createdAt,
        updatedAt: createdAt,
      })),
    });

    const first = await listMissionPage(owner, {
      first: 20,
      sort: "UPDATED_DESC",
    });
    await getDb().mission.create({
      data: {
        workspaceId: owner.workspace.id,
        referenceCode: "GRID-NEW",
        title: "Concurrent insert",
        createdByMembershipId: owner.membership.id,
      },
    });
    const second = await listMissionPage(owner, {
      first: 20,
      sort: "UPDATED_DESC",
      after: first.pageInfo.endCursor!,
    });
    const third = await listMissionPage(owner, {
      first: 20,
      sort: "UPDATED_DESC",
      after: second.pageInfo.endCursor!,
    });
    const ids = [...first.nodes, ...second.nodes, ...third.nodes].map(
      (mission) => mission.id,
    );
    expect(ids).toHaveLength(55);
    expect(new Set(ids).size).toBe(55);
    expect(ids).not.toContain(
      (
        await getDb().mission.findUniqueOrThrow({
          where: {
            workspaceId_referenceCode: {
              workspaceId: owner.workspace.id,
              referenceCode: "GRID-NEW",
            },
          },
        })
      ).id,
    );
  });

  it("QUERY-03 performs capability and assurance filtering in PostgreSQL", async () => {
    const owner = await asOwner(await createUser("skill-query-owner"));
    await registerSkill(
      owner,
      {
        skillKey: "indexed-registry",
        displayName: "Indexed Registry",
        description: "Capability predicate fixture",
      },
      {
        semanticVersion: "1.0.0",
        capabilities: ["registry_audit", "deterministic_registry"],
        inputSchema: { type: "object", properties: {} },
        outputSchema: { type: "object", properties: {} },
        requiredEvidence: ["query_plan"],
        failureStates: ["BLOCKED"],
        verifierBinding: { kind: "HUMAN", verifierKey: "query-review" },
        resourceEstimate: { maxDurationSeconds: 60, maxMemoryMb: 128 },
        assuranceCompatibility: ["REGULATED"],
      },
    );

    const page = await listSkillPage(owner, {
      requiredCapabilities: ["registry_audit"],
      assuranceProfile: "REGULATED",
      first: 10,
    });
    expect(page.nodes.map((skill) => skill.skillKey)).toEqual([
      "indexed-registry",
    ]);
    expect(
      (
        await listSkillPage(owner, {
          requiredCapabilities: ["missing_capability"],
          assuranceProfile: "REGULATED",
        })
      ).nodes,
    ).toEqual([]);
  });

  it("QUERY-05/06 searches indexed descriptors and removes denied missions", async () => {
    const owner = await asOwner(await createUser("search-owner"));
    const foreignOwner = await asOwner(await createUser("foreign-search-owner"));
    const member = await addMember(owner, "search-member");
    const [visible, denied] = await Promise.all([
      getDb().mission.create({
        data: {
          workspaceId: owner.workspace.id,
          referenceCode: "QSEARCH-001",
          title: "Quantum actuator visible",
          createdByMembershipId: owner.membership.id,
        },
      }),
      getDb().mission.create({
        data: {
          workspaceId: owner.workspace.id,
          referenceCode: "QSEARCH-002",
          title: "Quantum actuator restricted",
          createdByMembershipId: owner.membership.id,
        },
      }),
    ]);
    const foreign = await getDb().mission.create({
      data: {
        workspaceId: foreignOwner.workspace.id,
        referenceCode: "QSEARCH-FOREIGN",
        title: "Quantum actuator foreign secret",
        createdByMembershipId: foreignOwner.membership.id,
      },
    });
    await createScopedGrant(owner, {
      subjectType: "USER",
      subjectUserId: member.user.id,
      role: "VIEWER",
      effect: "DENY",
      scopeType: "MISSION",
      missionId: denied.id,
      reason: "Restricted mission search fixture",
    });

    const results = await searchGovernedObjects(member.ctx, {
      query: "quantum actuator",
      first: 10,
    });
    expect(results.nodes.map((result) => result.id)).toContain(visible.id);
    expect(results.nodes.map((result) => result.id)).not.toContain(denied.id);
    expect(results.nodes.map((result) => result.id)).not.toContain(foreign.id);
    expect(results.nodes.every((result) => result.kind === "mission")).toBe(
      true,
    );
    expect(results.pageInfo.hasNextPage).toBe(false);
    await expect(
      searchGovernedObjects(member.ctx, {
        query: "different query",
        first: 10,
        after: results.pageInfo.endCursor!,
      }),
    ).rejects.toMatchObject({ code: "CURSOR_KIND_MISMATCH" });
  });

  it("QUERY-07 holds result, query-call and serialized heap ceilings", async () => {
    const owner = await asOwner(await createUser("scale-query-owner"));
    const timestamp = new Date("2026-07-30T01:00:00.000Z");
    await getDb().mission.createMany({
      data: Array.from({ length: 1_000 }, (_, index) => ({
        id: randomUUID(),
        workspaceId: owner.workspace.id,
        referenceCode: `SCALE-${String(index).padStart(5, "0")}`,
        title: `Scale certification mission ${index}`,
        createdByMembershipId: owner.membership.id,
        createdAt: timestamp,
        updatedAt: timestamp,
      })),
    });
    const findMany = vi.spyOn(getDb().mission, "findMany");
    const count = vi.spyOn(getDb().mission, "count");
    const page = await listMissionPage(owner, { first: 25 });

    expect(page.nodes).toHaveLength(25);
    expect(findMany).toHaveBeenCalledTimes(1);
    expect(count).not.toHaveBeenCalled();
    expect(Buffer.byteLength(JSON.stringify(page), "utf8")).toBeLessThan(
      100_000,
    );
    findMany.mockRestore();
    count.mockRestore();
  });
});
