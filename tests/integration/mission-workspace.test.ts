import { beforeEach, describe, expect, it } from "vitest";

import { createMission } from "@/modules/mission-kernel";
import { getMissionWorkspaceProjection } from "@/server/mission-workspace";

import { asOwner, createUser, truncateAll } from "./helpers";

beforeEach(async () => {
  await truncateAll();
});

describe("Mission Workspace projection", () => {
  it("MW-I01 returns honest empty ledgers for a real scoped Mission", async () => {
    const ctx = await asOwner(await createUser("workspace-owner"));
    const mission = await createMission(ctx, { title: "Scoped dossier" });
    const projection = await getMissionWorkspaceProjection(ctx, mission.id);

    expect(projection).not.toBeNull();
    expect(projection?.evidenceSources).toEqual([]);
    expect(projection?.claims).toEqual([]);
    expect(projection?.execution.tips).toEqual([]);
    expect(projection?.operations.researchRuns).toEqual([]);
    expect(projection?.operations.computationRuns).toEqual([]);
    expect(projection?.operations.jobs).toEqual([]);
    expect(projection?.verification.reports).toEqual([]);
    expect(projection?.releases).toEqual([]);
  });

  it("MW-I02 fails closed for a Mission in another Workspace", async () => {
    const ctxA = await asOwner(await createUser("workspace-a"));
    const ctxB = await asOwner(await createUser("workspace-b"));
    const mission = await createMission(ctxA, { title: "Private dossier" });

    expect(await getMissionWorkspaceProjection(ctxB, mission.id)).toBeNull();
  });
});
