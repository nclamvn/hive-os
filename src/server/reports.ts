import type { WorkspaceContext } from "@/modules/identity-workspace";
import { requireVerificationCapability } from "@/modules/verification-governance";
import { getDb } from "@/server/db";

export async function getReportsProjection(ctx: WorkspaceContext) {
  requireVerificationCapability(ctx, "verification.read");
  const workspaceId = ctx.workspace.id;
  const [reports, releases, missions] = await Promise.all([
    getDb().verificationReport.findMany({
      where: { workspaceId },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 100,
      select: {
        id: true,
        overallStatus: true,
        deferredItems: true,
        contentHash: true,
        createdAt: true,
        mission: {
          select: { id: true, referenceCode: true, title: true, status: true },
        },
        verificationRun: {
          select: {
            independenceStatus: true,
            corruptionRuns: { select: { result: true }, take: 100 },
          },
        },
      },
    }),
    getDb().governedRelease.findMany({
      where: { workspaceId },
      orderBy: [{ approvedAt: "desc" }, { id: "asc" }],
      take: 100,
      select: {
        id: true,
        status: true,
        visibility: true,
        approvedAt: true,
        mission: {
          select: { id: true, referenceCode: true, title: true, status: true },
        },
        manifest: {
          select: {
            id: true,
            contentHash: true,
            methods: true,
            limitations: true,
            claimVersions: true,
            artifacts: true,
            approverMembershipIds: true,
          },
        },
      },
    }),
    getDb().mission.findMany({
      where: { workspaceId },
      orderBy: { updatedAt: "desc" },
      take: 50,
      select: {
        id: true,
        referenceCode: true,
        title: true,
        status: true,
        assuranceProfile: true,
        updatedAt: true,
      },
    }),
  ]);
  return { reports, releases, missions };
}
