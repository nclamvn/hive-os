import { afterAll, expect, it } from "vitest";

import { rebuildWorkspaceProjectionInTransaction } from "@/modules/projections/operational";
import { getDb } from "@/server/db";
import { withOrganizationTenant } from "@/server/tenant-context";

const organizationId = process.env.TIP024Q_ORGANIZATION_ID ?? "";
const workspaceId = process.env.TIP024Q_WORKSPACE_ID ?? "";
const actorUserId = process.env.TIP024Q_ACTOR_USER_ID ?? "";
const expectedMissionCount = Number(
  process.env.TIP024Q_EXPECTED_MISSION_COUNT ?? "-1",
);
const databaseName = new URL(
  process.env.DATABASE_URL ?? "postgresql://invalid/invalid",
).pathname.slice(1);

if (
  databaseName !== "hiveos_recovery_tip024q_r1" ||
  !organizationId ||
  !workspaceId ||
  !actorUserId ||
  !Number.isSafeInteger(expectedMissionCount) ||
  expectedMissionCount < 0
) {
  throw new Error(
    "TIP-024Q-R1 recovery test requires the explicit disposable restore boundary",
  );
}

afterAll(async () => getDb().$disconnect());

it("REC-M01 rebuilds the real operational projection in the isolated managed restore", async () => {
  const projection = await withOrganizationTenant(
    organizationId,
    actorUserId,
    async (tx) => {
      await tx.workspaceOperationalProjection.update({
        where: {
          organizationId_workspaceId: { organizationId, workspaceId },
        },
        data: {
          counts: { missions: 0 },
          status: "FAILED",
          sourceWatermarkAt: null,
          refreshedAt: null,
          version: { increment: 1 },
        },
      });
      return rebuildWorkspaceProjectionInTransaction(tx, {
        organizationId,
        workspaceId,
        jobId: "tip024q-r1-managed-recovery",
      });
    },
  );

  expect(projection.status).toBe("READY");
  expect(projection.counts.missions).toBe(expectedMissionCount);
  expect(projection.lastJobId).toBe("tip024q-r1-managed-recovery");
  expect(projection.sourceWatermarkAt).toBeInstanceOf(Date);
  expect(await getDb().mission.count({ where: { workspaceId } })).toBe(
    expectedMissionCount,
  );
});
