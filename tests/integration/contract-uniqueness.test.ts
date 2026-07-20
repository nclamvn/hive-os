import { beforeEach, describe, expect, it } from "vitest";

import type { WorkspaceContext } from "@/modules/identity-workspace";
import {
  addObligation,
  addRequirement,
  approveContract,
  createMission,
  requestAssuranceChange,
  resolveDecision,
  submitContract,
  transitionMission,
} from "@/modules/mission-kernel";
import { getDb } from "@/server/db";

import { asOwner, createUser, ownerQuery, truncateAll } from "./helpers";

beforeEach(async () => {
  await truncateAll();
});

async function approvedMission(ctx: WorkspaceContext) {
  const m = await createMission(ctx, { title: "M", objective: "o", scope: "s", successDefinition: "d" });
  await addRequirement(ctx, m.currentContractId!, { code: "R1", title: "t", description: "d", acceptanceCriteria: "c" });
  await addObligation(ctx, m.currentContractId!, { code: "O1", title: "t", description: "d", weight: 5, closureRule: "x" });
  await transitionMission(ctx, m.id, "INTAKE", { reason: "i" });
  await transitionMission(ctx, m.id, "SCOPED", { reason: "s" });
  await submitContract(ctx, m.id);
  await approveContract(ctx, m.id);
  return m;
}

function draftCount(missionId: string) {
  return getDb().missionContract.count({ where: { missionId, status: { in: ["DRAFT", "IN_REVIEW"] } } });
}

describe("active-contract uniqueness (TIP-004C)", () => {
  it("CONTRACT-CURRENT-04 a new DRAFT is creatable once the current is APPROVED", async () => {
    const ctx = await asOwner(await createUser("o"));
    const m = await approvedMission(ctx);
    // After v1 APPROVED there is no DRAFT/IN_REVIEW; an amendment creates one.
    const d = await requestAssuranceChange(ctx, m.id, "RESEARCH", "add rigor");
    await resolveDecision(ctx, d.id, true, "ok");
    expect(await draftCount(m.id)).toBe(1);
  });

  it("CONTRACT-CURRENT-02 a second DRAFT is rejected while one exists", async () => {
    const ctx = await asOwner(await createUser("o"));
    const m = await approvedMission(ctx);
    const d1 = await requestAssuranceChange(ctx, m.id, "RESEARCH", "first");
    await resolveDecision(ctx, d1.id, true, "ok"); // creates DRAFT v2
    const d2 = await requestAssuranceChange(ctx, m.id, "REGULATED", "second");
    await expect(resolveDecision(ctx, d2.id, true, "ok")).rejects.toMatchObject({ code: "CURRENT_CONTRACT_EXISTS" });
    expect(await draftCount(m.id)).toBe(1);
  });

  it("CONTRACT-CURRENT-03 the index rejects coexisting DRAFT and IN_REVIEW", async () => {
    const ctx = await asOwner(await createUser("o"));
    // Fresh mission has a DRAFT v1; submit moves it to IN_REVIEW.
    const m = await createMission(ctx, { title: "M", objective: "o", scope: "s", successDefinition: "d" });
    await addRequirement(ctx, m.currentContractId!, { code: "R1", title: "t", description: "d", acceptanceCriteria: "c" });
    await addObligation(ctx, m.currentContractId!, { code: "O1", title: "t", description: "d", weight: 5, closureRule: "x" });
    await transitionMission(ctx, m.id, "INTAKE", { reason: "i" });
    await transitionMission(ctx, m.id, "SCOPED", { reason: "s" });
    await submitContract(ctx, m.id); // v1 IN_REVIEW

    // A raw second DRAFT insert is blocked by the partial unique index.
    await expect(
      ownerQuery(
        `INSERT INTO mission_contract (id, workspace_id, mission_id, version_number, status, objective, scope, success_definition, assurance_profile, created_by_membership_id, created_at, updated_at, version)
         VALUES ('dup', '${ctx.workspace.id}', '${m.id}', 2, 'DRAFT', 'o', 's', 'd', 'PROFESSIONAL', '${ctx.membership.id}', now(), now(), 1)`,
      ),
    ).rejects.toThrow(/mission_contract_one_current|unique/i);
    expect(await draftCount(m.id)).toBe(1);
  });

  it("CONTRACT-CURRENT-01 two concurrent amendments create at most one new DRAFT", async () => {
    const ctx = await asOwner(await createUser("o"));
    const m = await approvedMission(ctx);
    const d1 = await requestAssuranceChange(ctx, m.id, "RESEARCH", "a");
    const d2 = await requestAssuranceChange(ctx, m.id, "REGULATED", "b");

    const results = await Promise.allSettled([
      resolveDecision(ctx, d1.id, true, "ok"),
      resolveDecision(ctx, d2.id, true, "ok"),
    ]);
    const fulfilled = results.filter((r) => r.status === "fulfilled").length;
    expect(fulfilled).toBe(1);
    expect(await draftCount(m.id)).toBe(1);
  });
});
