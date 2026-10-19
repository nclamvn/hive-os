import type { WorkspaceContext } from "@/modules/identity-workspace";
import { getDb } from "@/server/db";

import { requireVerificationCapability } from "./context";

export async function getVerificationProjection(
  ctx: WorkspaceContext,
  missionId?: string,
) {
  requireVerificationCapability(ctx, "verification.read");
  const where = {
    workspaceId: ctx.workspace.id,
    ...(missionId ? { missionId } : {}),
  };
  const [scenarios, activeRuns, reports, notReady, signoffs, releases] =
    await Promise.all([
      getDb().verificationScenario.count({ where }),
      getDb().verificationRun.count({
        where: { ...where, status: "IN_PROGRESS" },
      }),
      getDb().verificationReport.count({ where }),
      getDb().verificationReport.count({
        where: { ...where, overallStatus: "NOT_READY" },
      }),
      getDb().governanceSignoff.count({ where }),
      getDb().governedRelease.count({ where }),
    ]);
  return {
    counts: {
      scenarios,
      activeRuns,
      reports,
      notReady,
      signoffs,
      releases,
    },
    recentReports: await getDb().verificationReport.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        overallStatus: true,
        deferredItems: true,
        contentHash: true,
        createdAt: true,
        mission: {
          select: { referenceCode: true, title: true, status: true },
        },
        verificationRun: {
          select: {
            independenceStatus: true,
            corruptionRuns: { select: { result: true } },
          },
        },
      },
    }),
  };
}

/**
 * Future Observatory source: reads only immutable PUBLIC manifests attached to
 * APPROVED releases whose Mission is already RELEASED. No Truth tables join.
 */
export async function listApprovedReleaseProjections(
  ctx: WorkspaceContext,
) {
  requireVerificationCapability(ctx, "verification.read");
  return getDb().governedRelease.findMany({
    where: {
      workspaceId: ctx.workspace.id,
      status: "APPROVED",
      visibility: "PUBLIC",
      mission: { status: "RELEASED" },
      manifest: { isNot: null },
    },
    orderBy: [{ approvedAt: "desc" }, { id: "asc" }],
    take: 100,
    select: {
      id: true,
      approvedAt: true,
      mission: {
        select: { id: true, referenceCode: true, title: true },
      },
      manifest: {
        select: {
          id: true,
          claimVersions: true,
          artifacts: true,
          methods: true,
          limitations: true,
          approverMembershipIds: true,
          contentHash: true,
        },
      },
    },
  });
}
