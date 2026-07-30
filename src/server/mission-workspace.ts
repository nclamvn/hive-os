import type { WorkspaceContext } from "@/modules/identity-workspace";
import { requireExecutionCapability } from "@/modules/execution-fabric";
import { requireMissionCapability } from "@/modules/mission-kernel";
import { requireTruthCapability } from "@/modules/truth-kernel";
import { requireVerificationCapability } from "@/modules/verification-governance";
import { getDb } from "@/server/db";

/**
 * Read-only composition for TIP-009. Every query is scoped independently; this
 * projection coordinates bounded contexts but owns no governed state.
 */
export async function getMissionWorkspaceProjection(
  ctx: WorkspaceContext,
  missionId: string,
) {
  requireMissionCapability(ctx, "missions.read");
  requireTruthCapability(ctx, "truth.read");
  requireExecutionCapability(ctx, "execution.read");
  requireVerificationCapability(ctx, "verification.read");

  const where = { workspaceId: ctx.workspace.id, missionId };
  const mission = await getDb().mission.findFirst({
    where: { id: missionId, workspaceId: ctx.workspace.id },
    select: { id: true },
  });
  if (!mission) return null;

  const [
    evidenceSources,
    claims,
    provenanceEdges,
    disputes,
    executionTips,
    executionDeviations,
    executionCounts,
    verificationScenarios,
    verificationRuns,
    verificationReports,
    signoffs,
    releases,
  ] = await Promise.all([
    getDb().evidenceSource.findMany({
      where,
      orderBy: { createdAt: "asc" },
      take: 100,
      select: {
        id: true,
        title: true,
        sourceType: true,
        publisher: true,
        independenceKey: true,
        qualifiesForCorroboration: true,
        accessLevel: true,
        createdAt: true,
        _count: { select: { snapshots: true } },
      },
    }),
    getDb().claim.findMany({
      where,
      orderBy: { createdAt: "asc" },
      take: 100,
      select: {
        id: true,
        claimKey: true,
        state: true,
        accessLevel: true,
        reviewCadenceDays: true,
        nextReviewAt: true,
        versions: {
          orderBy: { versionNumber: "desc" },
          take: 1,
          select: {
            id: true,
            versionNumber: true,
            statement: true,
            normalizedValue: true,
            falsificationCriterion: true,
          },
        },
        _count: { select: { disputes: true, versions: true } },
      },
    }),
    getDb().provenanceEdge.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        fromKind: true,
        fromId: true,
        toKind: true,
        toId: true,
        relation: true,
        createdAt: true,
      },
    }),
    getDb().dispute.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        reason: true,
        createdAt: true,
        claim: { select: { claimKey: true } },
      },
    }),
    getDb().executionTip.findMany({
      where,
      orderBy: [{ createdAt: "asc" }, { code: "asc" }],
      take: 100,
      select: {
        id: true,
        code: true,
        title: true,
        description: true,
        status: true,
        skillVersion: {
          select: {
            semanticVersion: true,
            skill: { select: { displayName: true } },
          },
        },
        predecessorEdges: {
          take: 100,
          select: {
            predecessor: { select: { code: true, status: true } },
          },
        },
        skillRuns: {
          take: 1,
          select: {
            agentRuns: {
              orderBy: { attemptNumber: "desc" },
              take: 1,
              select: {
                attemptNumber: true,
                executionRole: true,
                providerName: true,
                modelName: true,
                status: true,
              },
            },
          },
        },
      },
    }),
    getDb().executionDeviation.findMany({
      where: { ...where, status: "OPEN" },
      orderBy: { createdAt: "asc" },
      take: 100,
      select: {
        id: true,
        code: true,
        title: true,
        materiality: true,
        tip: { select: { code: true } },
      },
    }),
    Promise.all([
      getDb().agentRun.count({
        where: { ...where, status: "AWAITING_REPORT" },
      }),
      getDb().completionReport.count({ where }),
      getDb().executionArtifact.count({ where }),
    ]),
    getDb().verificationScenario.findMany({
      where,
      orderBy: { createdAt: "asc" },
      take: 100,
      select: {
        id: true,
        code: true,
        title: true,
        kind: true,
        required: true,
        expectedOutcome: true,
      },
    }),
    getDb().verificationRun.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        status: true,
        independenceStatus: true,
        createdAt: true,
        completedAt: true,
      },
    }),
    getDb().verificationReport.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        overallStatus: true,
        deferredItems: true,
        contentHash: true,
        createdAt: true,
        verificationRun: {
          select: {
            independenceStatus: true,
            corruptionRuns: {
              select: { code: true, result: true, severity: true },
              take: 100,
            },
          },
        },
      },
    }),
    getDb().governanceSignoff.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        signoffType: true,
        decision: true,
        rationale: true,
        createdAt: true,
      },
    }),
    getDb().governedRelease.findMany({
      where,
      orderBy: { approvedAt: "desc" },
      take: 100,
      select: {
        id: true,
        status: true,
        visibility: true,
        approvedAt: true,
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
    }),
  ]);

  return {
    evidenceSources,
    claims,
    provenanceEdges,
    disputes,
    execution: {
      mode: "MANUAL_BRIDGE" as const,
      disclaimer:
        "Imported provider results are execution claims, not independent verification.",
      tips: executionTips,
      openDeviations: executionDeviations,
      counts: {
        awaitingReports: executionCounts[0],
        reports: executionCounts[1],
        artifacts: executionCounts[2],
      },
    },
    verification: {
      scenarios: verificationScenarios,
      runs: verificationRuns,
      reports: verificationReports,
      signoffs,
    },
    releases,
  };
}
