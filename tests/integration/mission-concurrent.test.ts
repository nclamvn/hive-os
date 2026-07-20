import { beforeEach, describe, expect, it } from "vitest";

import {
  createMission,
  transitionMission,
} from "@/modules/mission-kernel";
import { getDb } from "@/server/db";

import { asOwner, createUser, truncateAll } from "./helpers";

beforeEach(async () => {
  await truncateAll();
});

describe("concurrent mission transitions (MK-13)", () => {
  it("two transitions against one version yield one success and one conflict", async () => {
    const ctx = await asOwner(await createUser("o"));
    const mission = await createMission(ctx, { title: "Race" });
    await transitionMission(ctx, mission.id, "INTAKE", { reason: "intake" });

    const current = await getDb().mission.findUniqueOrThrow({ where: { id: mission.id } });
    const version = current.version;

    const results = await Promise.allSettled([
      transitionMission(ctx, mission.id, "SCOPED", { reason: "a", expectedVersion: version }),
      transitionMission(ctx, mission.id, "SCOPED", { reason: "b", expectedVersion: version }),
    ]);

    const fulfilled = results.filter((r) => r.status === "fulfilled");
    const rejected = results.filter((r) => r.status === "rejected") as PromiseRejectedResult[];
    expect(fulfilled.length).toBe(1);
    expect(rejected.length).toBe(1);
    expect(rejected[0].reason).toMatchObject({ code: "MISSION_VERSION_CONFLICT" });

    const after = await getDb().mission.findUniqueOrThrow({ where: { id: mission.id } });
    expect(after.status).toBe("SCOPED");
  });
});
