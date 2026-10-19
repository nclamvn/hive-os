import {
  hasCapability,
  type WorkspaceContext,
} from "@/modules/identity-workspace";
import { requireExecutionCapability } from "@/modules/execution-fabric";
import { requireMissionCapability } from "@/modules/mission-kernel";
import { getWorkspaceOperationalProjection } from "@/modules/projections";
import { searchGovernedObjects } from "@/modules/query-contracts";
import { requireTruthCapability } from "@/modules/truth-kernel";
import { requireVerificationCapability } from "@/modules/verification-governance";
import { getDb } from "@/server/db";

export interface ControlRoomProjection {
  commands: {
    authoringWrite: boolean;
    missionsCreate: boolean;
    researchRequest: boolean;
    truthWrite: boolean;
    verificationOperate: boolean;
  };
  freshness: {
    status: string;
    sourceWatermarkAt: string | null;
    refreshedAt: string | null;
    ageMs: number | null;
  };
  counts: {
    missions: number;
    approvedMissions: number;
    exploringMissions: number;
    obligations: number;
    decisionsRequired: number;
    evidenceSources: number;
    snapshots: number;
    evidenceSpans: number;
    claims: number;
    disputes: number;
    honestNulls: number;
    provenanceEdges: number;
    skills: number;
    activeSkills: number;
    skillVersions: number;
    runtimeGates: number;
    passedGates: number;
    executionTips: number;
    activeExecutionTips: number;
    awaitingReports: number;
    completionReports: number;
    executionArtifacts: number;
    openExecutionDeviations: number;
    verificationScenarios: number;
    activeVerificationRuns: number;
    verificationReports: number;
    notReadyVerificationReports: number;
    governanceSignoffs: number;
    evidenceCeilingAssessments: number;
    governedReleases: number;
    releaseManifests: number;
  };
  signals: Array<{
    key: string;
    label: string;
    count: number;
    tone: "neutral" | "warning" | "danger";
  }>;
  recentMissions: Array<{
    id: string;
    referenceCode: string;
    title: string;
    status: string;
    assuranceProfile: string;
    updatedAt: string;
  }>;
  finderObjects: Array<{
    id: string;
    kind:
      | "mission"
      | "evidence"
      | "claim"
      | "skill"
      | "execution"
      | "verification"
      | "release";
    code: string;
    title: string;
    description: string;
    status: string;
    href: string;
  }>;
  execution: {
    mode: "MANUAL_BRIDGE";
    disclaimer: string;
    recentTips: Array<{
      id: string;
      code: string;
      title: string;
      status: string;
      missionReferenceCode: string;
      latestAttempt: number | null;
      latestRole: string | null;
      latestProvider: string | null;
    }>;
    openDeviations: Array<{
      id: string;
      code: string;
      title: string;
      materiality: string;
      tipCode: string;
    }>;
  };
  verification: {
    recentReports: Array<{
      id: string;
      overallStatus: string;
      independenceStatus: string;
      corruptionResults: string[];
      deferredCount: number;
      contentHash: string;
      createdAt: string;
      missionReferenceCode: string;
      missionTitle: string;
      missionStatus: string;
    }>;
  };
  audit: {
    allowed: boolean;
    events: Array<{
      id: string;
      eventType: string;
      entityType: string;
      entityId: string;
      createdAt: string;
    }>;
  };
}

/**
 * Read-only, workspace-scoped Control Room projection. Counts describe actual
 * governed rows; planned modules are static UI metadata and never appear here.
 */
export async function getControlRoomProjection(
  ctx: WorkspaceContext,
  searchQuery?: string,
): Promise<ControlRoomProjection> {
  requireMissionCapability(ctx, "missions.read");
  requireTruthCapability(ctx, "truth.read");
  requireExecutionCapability(ctx, "execution.read");
  requireVerificationCapability(ctx, "verification.read");

  const workspaceId = ctx.workspace.id;
  const auditAllowed = hasCapability(ctx.membership.role, "audit.read");
  const now = new Date();
  const materialized = await getWorkspaceOperationalProjection(ctx, now);
  const {
    missions,
    approvedMissions,
    exploringMissions,
    obligations,
    decisionsRequired,
    evidenceSources,
    snapshots,
    evidenceSpans,
    claims,
    disputes,
    honestNulls,
    provenanceEdges,
    skills,
    activeSkills,
    skillVersions,
    runtimeGates,
    passedGates,
    executionTips,
    activeExecutionTips,
    awaitingReports,
    completionReports,
    executionArtifacts,
    openExecutionDeviations,
    verificationScenarios,
    activeVerificationRuns,
    verificationReports,
    notReadyVerificationReports,
    governanceSignoffs,
    evidenceCeilingAssessments,
    governedReleases,
    releaseManifests,
    openEscalations,
  } = materialized.counts;
  const finderObjectsPromise = Promise.all([
    getDb().evidenceSource.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        title: true,
        sourceType: true,
        accessLevel: true,
        mission: { select: { referenceCode: true } },
      },
    }),
    getDb().claim.findMany({
      where: { workspaceId },
      orderBy: { updatedAt: "desc" },
      take: 8,
      select: {
        id: true,
        claimKey: true,
        state: true,
        mission: { select: { referenceCode: true } },
        versions: {
          orderBy: { versionNumber: "desc" },
          take: 1,
          select: { statement: true },
        },
      },
    }),
    getDb().skill.findMany({
      where: { workspaceId },
      orderBy: { updatedAt: "desc" },
      take: 8,
      select: {
        id: true,
        skillKey: true,
        displayName: true,
        description: true,
        status: true,
      },
    }),
    getDb().executionTip.findMany({
      where: { workspaceId },
      orderBy: { updatedAt: "desc" },
      take: 8,
      select: {
        id: true,
        code: true,
        title: true,
        description: true,
        status: true,
      },
    }),
    getDb().verificationReport.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        overallStatus: true,
        mission: { select: { referenceCode: true, title: true } },
      },
    }),
    getDb().governedRelease.findMany({
      where: { workspaceId },
      orderBy: { approvedAt: "desc" },
      take: 8,
      select: {
        id: true,
        status: true,
        visibility: true,
        mission: { select: { referenceCode: true, title: true } },
      },
    }),
  ]);

  const [
    reviewDue,
    recentMissions,
    recentExecutionTips,
    executionDeviations,
    recentVerificationReports,
    auditEvents,
  ] = await Promise.all([
    getDb().claim.count({
      where: {
        workspaceId,
        nextReviewAt: { lte: now },
        state: { notIn: ["FALSIFIED", "RETRACTED"] },
      },
    }),
    getDb().mission.findMany({
      where: { workspaceId },
      orderBy: { updatedAt: "desc" },
      take: 6,
      select: {
        id: true,
        referenceCode: true,
        title: true,
        status: true,
        assuranceProfile: true,
        updatedAt: true,
      },
    }),
    getDb().executionTip.findMany({
      where: { workspaceId },
      orderBy: { updatedAt: "desc" },
      take: 6,
      select: {
        id: true,
        code: true,
        title: true,
        status: true,
        mission: { select: { referenceCode: true } },
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
              },
            },
          },
        },
      },
    }),
    getDb().executionDeviation.findMany({
      where: { workspaceId, status: "OPEN" },
      orderBy: { createdAt: "asc" },
      take: 8,
      select: {
        id: true,
        code: true,
        title: true,
        materiality: true,
        tip: { select: { code: true } },
      },
    }),
    getDb().verificationReport.findMany({
      where: { workspaceId },
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
    auditAllowed
      ? getDb().auditEvent.findMany({
          where: { workspaceId },
          orderBy: { createdAt: "desc" },
          take: 20,
          select: {
            id: true,
            eventType: true,
            entityType: true,
            entityId: true,
            createdAt: true,
          },
        })
      : Promise.resolve([]),
  ]);

  const signals: ControlRoomProjection["signals"] = [];
  const governedSearch = searchQuery?.trim()
    ? await searchGovernedObjects(ctx, {
        query: searchQuery,
        first: 20,
      })
    : null;
  const [
    finderEvidence,
    finderClaims,
    finderSkills,
    finderTips,
    finderReports,
    finderReleases,
  ] = await finderObjectsPromise;
  if (decisionsRequired > 0) {
    signals.push({
      key: "decisions",
      label: "Decisions require an owner",
      count: decisionsRequired,
      tone: "warning",
    });
  }
  if (disputes > 0) {
    signals.push({
      key: "disputes",
      label: "Claims have retained disputes",
      count: disputes,
      tone: "danger",
    });
  }
  if (openEscalations > 0) {
    signals.push({
      key: "escalations",
      label: "Escalations remain open",
      count: openEscalations,
      tone: "danger",
    });
  }
  if (reviewDue > 0) {
    signals.push({
      key: "reviews",
      label: "Claims are due for review",
      count: reviewDue,
      tone: "warning",
    });
  }
  if (awaitingReports > 0) {
    signals.push({
      key: "execution-reports",
      label: "Manual runs await Completion Reports",
      count: awaitingReports,
      tone: "warning",
    });
  }
  if (openExecutionDeviations > 0) {
    signals.push({
      key: "execution-deviations",
      label: "Execution deviations require review",
      count: openExecutionDeviations,
      tone: "danger",
    });
  }
  if (activeVerificationRuns > 0) {
    signals.push({
      key: "verification-runs",
      label: "Verification runs are awaiting a Verify Report",
      count: activeVerificationRuns,
      tone: "warning",
    });
  }
  if (notReadyVerificationReports > 0) {
    signals.push({
      key: "verification-not-ready",
      label: "Verify Reports are not ready for review",
      count: notReadyVerificationReports,
      tone: "danger",
    });
  }

  return {
    commands: {
      authoringWrite: hasCapability(ctx.membership.role, "authoring.write"),
      missionsCreate: hasCapability(ctx.membership.role, "missions.create"),
      researchRequest: hasCapability(ctx.membership.role, "research.request"),
      truthWrite: hasCapability(ctx.membership.role, "truth.write"),
      verificationOperate: hasCapability(
        ctx.membership.role,
        "verification.operate",
      ),
    },
    freshness: materialized.freshness,
    counts: {
      missions,
      approvedMissions,
      exploringMissions,
      obligations,
      decisionsRequired,
      evidenceSources,
      snapshots,
      evidenceSpans,
      claims,
      disputes,
      honestNulls,
      provenanceEdges,
      skills,
      activeSkills,
      skillVersions,
      runtimeGates,
      passedGates,
      executionTips,
      activeExecutionTips,
      awaitingReports,
      completionReports,
      executionArtifacts,
      openExecutionDeviations,
      verificationScenarios,
      activeVerificationRuns,
      verificationReports,
      notReadyVerificationReports,
      governanceSignoffs,
      evidenceCeilingAssessments,
      governedReleases,
      releaseManifests,
    },
    signals,
    recentMissions: recentMissions.map((mission) => ({
      ...mission,
      updatedAt: mission.updatedAt.toISOString(),
    })),
    finderObjects: governedSearch
      ? governedSearch.nodes.map((object) => ({
          id: object.id,
          kind: object.kind,
          code: object.code,
          title: object.title,
          description: object.description,
          status: object.status,
          href: object.href,
        }))
      : [
          ...finderEvidence.map((source) => ({
            id: source.id,
            kind: "evidence" as const,
            code: source.mission.referenceCode,
            title: source.title,
            description: source.sourceType,
            status: source.accessLevel,
            href: "evidence",
          })),
          ...finderClaims.map((claim) => ({
            id: claim.id,
            kind: "claim" as const,
            code: claim.claimKey,
            title: claim.versions[0]?.statement ?? claim.claimKey,
            description: claim.mission.referenceCode,
            status: claim.state,
            href: "claims",
          })),
          ...finderSkills.map((skill) => ({
            id: skill.id,
            kind: "skill" as const,
            code: skill.skillKey,
            title: skill.displayName,
            description: skill.description,
            status: skill.status,
            href: "skills",
          })),
          ...finderTips.map((tip) => ({
            id: tip.id,
            kind: "execution" as const,
            code: tip.code,
            title: tip.title,
            description: tip.description,
            status: tip.status,
            href: "execution",
          })),
          ...finderReports.map((report) => ({
            id: report.id,
            kind: "verification" as const,
            code: report.mission.referenceCode,
            title: report.mission.title,
            description: "Verify Report",
            status: report.overallStatus,
            href: "reports",
          })),
          ...finderReleases.map((release) => ({
            id: release.id,
            kind: "release" as const,
            code: release.mission.referenceCode,
            title: release.mission.title,
            description: `${release.visibility} release`,
            status: release.status,
            href: "reports",
          })),
        ],
    execution: {
      mode: "MANUAL_BRIDGE",
      disclaimer:
        "Imported provider results are execution claims, not independent verification.",
      recentTips: recentExecutionTips.map((tip) => {
        const latest = tip.skillRuns[0]?.agentRuns[0];
        return {
          id: tip.id,
          code: tip.code,
          title: tip.title,
          status: tip.status,
          missionReferenceCode: tip.mission.referenceCode,
          latestAttempt: latest?.attemptNumber ?? null,
          latestRole: latest?.executionRole ?? null,
          latestProvider: latest?.providerName ?? null,
        };
      }),
      openDeviations: executionDeviations.map((deviation) => ({
        id: deviation.id,
        code: deviation.code,
        title: deviation.title,
        materiality: deviation.materiality,
        tipCode: deviation.tip.code,
      })),
    },
    verification: {
      recentReports: recentVerificationReports.map((report) => ({
        id: report.id,
        overallStatus: report.overallStatus,
        independenceStatus: report.verificationRun.independenceStatus,
        corruptionResults: report.verificationRun.corruptionRuns.map(
          (run) => run.result,
        ),
        deferredCount: report.deferredItems.length,
        contentHash: report.contentHash,
        createdAt: report.createdAt.toISOString(),
        missionReferenceCode: report.mission.referenceCode,
        missionTitle: report.mission.title,
        missionStatus: report.mission.status,
      })),
    },
    audit: {
      allowed: auditAllowed,
      events: auditEvents.map((event) => ({
        ...event,
        createdAt: event.createdAt.toISOString(),
      })),
    },
  };
}
