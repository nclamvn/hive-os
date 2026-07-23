import type { WorkspaceContext } from "@/modules/identity-workspace";
import { getDb } from "@/server/db";

import { requireExecutionCapability } from "./context";

export async function getExecutionProjection(
  ctx: WorkspaceContext,
  missionId?: string,
) {
  requireExecutionCapability(ctx, "execution.read");
  const where = {
    workspaceId: ctx.workspace.id,
    ...(missionId ? { missionId } : {}),
  };
  const [tips, openDeviations, awaitingReports, reports, artifacts] =
    await Promise.all([
      getDb().executionTip.findMany({
        where,
        orderBy: [{ createdAt: "asc" }, { code: "asc" }],
        include: {
          skillVersion: {
            select: {
              semanticVersion: true,
              skill: { select: { skillKey: true, displayName: true } },
            },
          },
          predecessorEdges: {
            select: {
              predecessor: { select: { id: true, code: true, status: true } },
            },
          },
          skillRuns: {
            include: {
              agentRuns: {
                orderBy: { attemptNumber: "desc" },
                take: 1,
              },
            },
          },
        },
      }),
      getDb().executionDeviation.findMany({
        where: { ...where, status: "OPEN" },
        orderBy: { createdAt: "asc" },
        include: { tip: { select: { code: true, title: true } } },
      }),
      getDb().agentRun.count({
        where: { ...where, status: "AWAITING_REPORT" },
      }),
      getDb().completionReport.count({ where }),
      getDb().executionArtifact.count({ where }),
    ]);

  return {
    mode: "MANUAL_BRIDGE" as const,
    disclaimer:
      "Imported provider results are execution claims, not independent verification.",
    counts: {
      tips: tips.length,
      openDeviations: openDeviations.length,
      awaitingReports,
      reports,
      artifacts,
    },
    tips,
    openDeviations,
  };
}
