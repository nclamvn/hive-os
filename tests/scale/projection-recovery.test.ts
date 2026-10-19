import { afterAll, expect, it } from "vitest";

import { rebuildWorkspaceProjectionInTransaction } from "@/modules/projections/operational";
import { getDb } from "@/server/db";
import { withOrganizationTenant } from "@/server/tenant-context";

const organizationId = process.env.TIP023H_ORGANIZATION_ID ?? "";
const workspaceId = process.env.TIP023H_WORKSPACE_ID ?? "";
const actorUserId = process.env.TIP023H_ACTOR_USER_ID ?? "";
const databaseName = new URL(process.env.DATABASE_URL ?? "postgresql://invalid/invalid")
  .pathname.slice(1);

if (
  databaseName !== "hiveos_tip023h_restore" ||
  !organizationId ||
  !workspaceId ||
  !actorUserId
) {
  throw new Error("TIP-023H scale test requires the explicit disposable restore database");
}

afterAll(async () => getDb().$disconnect());

it("REC-01 rebuilds the real projection to an authoritative watermark", async () => {
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
        jobId: "tip023h-recovery-rebuild",
      });
    },
  );

  expect(projection.status).toBe("READY");
  expect(projection.counts.missions).toBe(10_000);
  expect(projection.lastJobId).toBe("tip023h-recovery-rebuild");
  expect(projection.sourceWatermarkAt).toBeInstanceOf(Date);
  expect(
    await getDb().mission.count({ where: { workspaceId } }),
  ).toBe(10_000);
});
