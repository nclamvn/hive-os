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
      take: 100,
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
      take: 100,
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
      take: 100,
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
          take: 100,
          select: {
            predecessor: {
              select: { id: true, code: true, status: true },
            },
          },
        },
        skillRuns: {
          take: 100,
          include: {
            agentRuns: {
              orderBy: { attemptNumber: "desc" },
              take: 100,
              include: {
                inputArtifact: true,
                outputArtifact: true,
                completionReport: {
                  include: {
                    resourceUsageRecords: {
                      orderBy: [{ metric: "asc" }, { unit: "asc" }],
                      take: 100,
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
      take: 100,
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
