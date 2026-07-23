import { hasCapability, type WorkspaceContext } from "@/modules/identity-workspace";
import { requireExecutionCapability } from "@/modules/execution-fabric";
import { getDb } from "@/server/db";

export async function getExecutionOperationsProjection(ctx: WorkspaceContext) {
  requireExecutionCapability(ctx, "execution.read");
  const workspaceId = ctx.workspace.id;

  const [missions, skills, tips, deviations, counts] = await Promise.all([
    getDb().mission.findMany({
      where: {
        workspaceId,
        status: { in: ["APPROVED", "EXPLORING", "BUILDING"] },
      },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        referenceCode: true,
        title: true,
        status: true,
        assuranceProfile: true,
      },
    }),
    getDb().skill.findMany({
      where: { workspaceId, status: "ACTIVE" },
      orderBy: { skillKey: "asc" },
      select: {
        id: true,
        skillKey: true,
        displayName: true,
        activeVersion: {
          select: {
            id: true,
            semanticVersion: true,
            assuranceCompatibility: true,
          },
        },
      },
    }),
    getDb().executionTip.findMany({
      where: { workspaceId },
      orderBy: [{ createdAt: "desc" }, { code: "asc" }],
      include: {
        mission: {
          select: {
            referenceCode: true,
            title: true,
            status: true,
            assuranceProfile: true,
          },
        },
        skillVersion: {
          select: {
            semanticVersion: true,
            contentHash: true,
            skill: {
              select: { skillKey: true, displayName: true },
            },
          },
        },
        predecessorEdges: {
          select: {
            predecessor: {
              select: { id: true, code: true, status: true },
            },
          },
        },
        skillRuns: {
          include: {
            agentRuns: {
              orderBy: { attemptNumber: "desc" },
              include: {
                inputArtifact: true,
                outputArtifact: true,
                completionReport: {
                  include: {
                    resourceUsageRecords: {
                      orderBy: [{ metric: "asc" }, { unit: "asc" }],
                    },
                  },
                },
              },
            },
          },
        },
      },
    }),
    getDb().executionDeviation.findMany({
      where: { workspaceId, status: "OPEN" },
      orderBy: { createdAt: "asc" },
      include: {
        tip: { select: { code: true, title: true } },
        report: { select: { result: true, overallStatus: true } },
      },
    }),
    Promise.all([
      getDb().agentRun.count({
        where: { workspaceId, status: "AWAITING_REPORT" },
      }),
      getDb().completionReport.count({ where: { workspaceId } }),
      getDb().executionArtifact.count({ where: { workspaceId } }),
    ]),
  ]);

  return {
    mode: "MANUAL_BRIDGE" as const,
    disclaimer:
      "Imported provider results are execution claims, not independent verification.",
    missions,
    skills,
    tips,
    deviations,
    counts: {
      tips: tips.length,
      awaitingReports: counts[0],
      reports: counts[1],
      artifacts: counts[2],
      openDeviations: deviations.length,
    },
    permissions: {
      canOperate: hasCapability(ctx.membership.role, "execution.operate"),
      canReview: hasCapability(ctx.membership.role, "execution.review"),
    },
  };
}
