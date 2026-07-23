import { hasCapability, type WorkspaceContext } from "@/modules/identity-workspace";
import { requireTruthCapability } from "@/modules/truth-kernel";
import { getDb } from "@/server/db";

export async function getTruthOperationsProjection(ctx: WorkspaceContext) {
  requireTruthCapability(ctx, "truth.read");

  const [missions, sources, claims, provenanceCount] = await Promise.all([
    getDb().mission.findMany({
      where: {
        workspaceId: ctx.workspace.id,
        status: { in: ["APPROVED", "EXPLORING"] },
      },
      orderBy: { updatedAt: "desc" },
      select: { id: true, referenceCode: true, title: true, status: true },
    }),
    getDb().evidenceSource.findMany({
      where: { workspaceId: ctx.workspace.id },
      orderBy: { createdAt: "desc" },
      include: {
        mission: { select: { referenceCode: true, title: true } },
        snapshots: {
          orderBy: { createdAt: "desc" },
          include: {
            spans: { orderBy: { createdAt: "desc" } },
          },
        },
      },
    }),
    getDb().claim.findMany({
      where: { workspaceId: ctx.workspace.id },
      orderBy: { updatedAt: "desc" },
      include: {
        mission: { select: { referenceCode: true, title: true } },
        versions: {
          orderBy: { versionNumber: "desc" },
          include: {
            evidence: {
              include: {
                evidenceSpan: {
                  include: {
                    snapshot: {
                      include: { evidenceSource: true },
                    },
                  },
                },
              },
            },
          },
        },
        disputes: { orderBy: { createdAt: "desc" } },
        honestNulls: { orderBy: { createdAt: "desc" } },
      },
    }),
    getDb().provenanceEdge.count({
      where: { workspaceId: ctx.workspace.id },
    }),
  ]);

  return {
    missions,
    sources,
    claims,
    provenanceCount,
    permissions: {
      canWrite: hasCapability(ctx.membership.role, "truth.write"),
      canReview: hasCapability(ctx.membership.role, "truth.review"),
    },
  };
}
