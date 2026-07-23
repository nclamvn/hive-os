import { beforeEach, describe, expect, it } from "vitest";

import { createMission } from "@/modules/mission-kernel";
import { getDashboardProjection } from "@/server/dashboard";

import { asOwner, createUser, truncateAll } from "./helpers";

beforeEach(async () => {
  await truncateAll();
});

describe("Dashboard projection", () => {
  it("DB-I01 derives mission rows and totals from the authorized workspace", async () => {
    const ctx = await asOwner(await createUser("dashboard-owner"));
    const mission = await createMission(ctx, { title: "Dashboard mission" });
    const projection = await getDashboardProjection(ctx);

    expect(projection.metrics).toMatchObject({
      missions: 1,
      evidenceSources: 0,
      claims: 0,
      verifications: 0,
      releases: 0,
    });
    expect(projection.missions[0]).toMatchObject({
      id: mission.id,
      progressBasisPoints: null,
      nextGate: null,
    });
    expect(projection.currentMission?.id).toBe(mission.id);
  });

  it("DB-I02 does not leak another workspace totals or current Mission", async () => {
    const ctxA = await asOwner(await createUser("dashboard-a"));
    const ctxB = await asOwner(await createUser("dashboard-b"));
    await createMission(ctxA, { title: "Workspace A only" });

    const projectionB = await getDashboardProjection(ctxB);
    expect(projectionB.metrics.missions).toBe(0);
    expect(projectionB.missions).toEqual([]);
    expect(projectionB.currentMission).toBeNull();
  });
});
