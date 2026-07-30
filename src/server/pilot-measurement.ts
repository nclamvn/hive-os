import { canonicalJson, sha256 } from "@/modules/execution-fabric";
import {
  NotFoundError,
  type WorkspaceContext,
} from "@/modules/identity-workspace";
import { requireExecutionCapability } from "@/modules/execution-fabric";
import { requireMissionCapability } from "@/modules/mission-kernel";
import { requireTruthCapability } from "@/modules/truth-kernel";
import { requireVerificationCapability } from "@/modules/verification-governance";
import { getDb } from "@/server/db";

type Timestamp = Date | string | null | undefined;

interface TransitionRecord {
  createdAt: Date;
  payload: unknown;
}

function iso(value: Timestamp): string | null {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : value;
}

function duration(start: Timestamp, end: Timestamp, source: string) {
  const startIso = iso(start);
  const endIso = iso(end);
  if (!startIso || !endIso) {
    return {
      status: "UNAVAILABLE" as const,
      value: null,
      unit: "milliseconds",
      start: startIso,
      end: endIso,
      source,
      reason: "Both authoritative boundary timestamps are required.",
    };
  }
  const value = new Date(endIso).getTime() - new Date(startIso).getTime();
  if (value < 0) {
    return {
      status: "UNAVAILABLE" as const,
      value: null,
      unit: "milliseconds",
      start: startIso,
      end: endIso,
      source,
      reason: "Retained timestamps are not chronologically valid.",
    };
  }
  return {
    status: "AVAILABLE" as const,
    value,
    unit: "milliseconds",
    start: startIso,
    end: endIso,
    source,
    reason: null,
  };
}

function percent(numerator: number, denominator: number) {
  return denominator === 0
    ? null
    : Math.round((numerator / denominator) * 1000) / 10;
}

function transitionAt(
  events: readonly TransitionRecord[],
  target: string,
): Date | null {
  return (
    events.find((event) => {
      const payload = event.payload as { to?: unknown };
      return payload?.to === target;
    })?.createdAt ?? null
  );
}

function releasedClaimVersionIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (
      item &&
      typeof item === "object" &&
      typeof (item as { claimVersionId?: unknown }).claimVersionId === "string"
    ) {
      return [(item as { claimVersionId: string }).claimVersionId];
    }
    return [];
  });
}

export function derivePilotMeasurements(input: {
  mission: {
    id: string;
    referenceCode: string;
    title: string;
    status: string;
    createdAt: Date;
    approvedContract: {
      id: string;
      approvedAt: Date | null;
      requirements: Array<{ id: string }>;
    } | null;
    decisions: Array<{
      materiality: string;
      status: string;
      resolution: string | null;
      decidedByMembershipId: string | null;
      decidedAt: Date | null;
    }>;
    evidenceSources: Array<{ snapshots: Array<{ id: string }> }>;
    claims: Array<{
      versions: Array<{
        id: string;
        evidence: Array<{ id: string }>;
      }>;
      disputes: Array<{ id: string }>;
    }>;
    skillRuns: Array<{ agentRuns: Array<{ id: string }> }>;
    executionDeviations: Array<{ status: string }>;
    verificationRuns: Array<{
      requirementCoverage: Array<{
        requirementId: string;
        result: string;
        evidenceArtifactIds: string[];
      }>;
      scenarioResults: Array<{ result: string }>;
    }>;
    verificationReports: Array<{ overallStatus: string }>;
    governanceSignoffs: Array<{ decision: string }>;
    governedReleases: Array<{
      approvedAt: Date;
      manifest: { claimVersions: unknown } | null;
    }>;
  };
  transitions: TransitionRecord[];
  provenanceTargets: string[];
}) {
  const { mission } = input;
  const approvedAt = mission.approvedContract?.approvedAt ?? null;
  const buildingAt = transitionAt(input.transitions, "BUILDING");
  const verifyingAt = transitionAt(input.transitions, "VERIFYING");
  const releasedAt =
    transitionAt(input.transitions, "RELEASED") ??
    mission.governedReleases.at(-1)?.approvedAt ??
    null;

  const requirementIds = new Set(
    mission.approvedContract?.requirements.map((item) => item.id) ?? [],
  );
  const coverage = mission.verificationRuns.flatMap(
    (run) => run.requirementCoverage,
  );
  const passedRequirementIds = new Set(
    coverage
      .filter(
        (item) =>
          requirementIds.has(item.requirementId) && item.result === "PASS",
      )
      .map((item) => item.requirementId),
  );
  const evidencedRequirementIds = new Set(
    coverage
      .filter(
        (item) =>
          requirementIds.has(item.requirementId) &&
          item.evidenceArtifactIds.length > 0,
      )
      .map((item) => item.requirementId),
  );

  const materialDecisions = mission.decisions.filter(
    (decision) => decision.materiality === "MATERIAL",
  );
  const accountableDecisions = materialDecisions.filter(
    (decision) =>
      ["APPROVED", "REJECTED"].includes(decision.status) &&
      Boolean(
        decision.decidedByMembershipId &&
          decision.decidedAt &&
          decision.resolution?.trim(),
      ),
  );

  const releasedVersions = new Set(
    mission.governedReleases.flatMap((release) =>
      releasedClaimVersionIds(release.manifest?.claimVersions),
    ),
  );
  const evidenceLinkedVersions = new Set(
    mission.claims.flatMap((claim) =>
      claim.versions
        .filter((version) => version.evidence.length > 0)
        .map((version) => version.id),
    ),
  );
  const provenanceTargets = new Set(input.provenanceTargets);
  const traceableReleasedVersions = [...releasedVersions].filter(
    (id) => evidenceLinkedVersions.has(id) || provenanceTargets.has(id),
  );

  const totalAgentRuns = mission.skillRuns.reduce(
    (sum, run) => sum + run.agentRuns.length,
    0,
  );
  const retryCount = mission.skillRuns.reduce(
    (sum, run) => sum + Math.max(0, run.agentRuns.length - 1),
    0,
  );
  const failedScenarios = mission.verificationRuns
    .flatMap((run) => run.scenarioResults)
    .filter((result) => result.result === "FAIL").length;
  const disputeCount = mission.claims.reduce(
    (sum, claim) => sum + claim.disputes.length,
    0,
  );
  const snapshotCount = mission.evidenceSources.reduce(
    (sum, source) => sum + source.snapshots.length,
    0,
  );

  const dossierChecks = {
    approvedContract: Boolean(mission.approvedContract?.approvedAt),
    requirements: requirementIds.size > 0,
    retainedEvidence: snapshotCount > 0,
    accountableMaterialDecision:
      materialDecisions.length > 0 &&
      accountableDecisions.length === materialDecisions.length,
    verificationReport: mission.verificationReports.length > 0,
    approvedSignoff: mission.governanceSignoffs.some(
      (signoff) => signoff.decision === "APPROVED",
    ),
    releaseManifest: mission.governedReleases.some(
      (release) => Boolean(release.manifest),
    ),
  };
  const missingDossierSections = Object.entries(dossierChecks)
    .filter(([, complete]) => !complete)
    .map(([section]) => section);
  const requirementsComplete =
    requirementIds.size > 0 &&
    passedRequirementIds.size === requirementIds.size &&
    evidencedRequirementIds.size === requirementIds.size;
  const decisionsComplete =
    materialDecisions.length > 0 &&
    accountableDecisions.length === materialDecisions.length;
  const provenanceComplete =
    releasedVersions.size > 0 &&
    traceableReleasedVersions.length === releasedVersions.size;

  return {
    schema: "hive-os.pilot-measurement.v1",
    mission: {
      id: mission.id,
      referenceCode: mission.referenceCode,
      title: mission.title,
      status: mission.status,
    },
    phaseDurations: {
      creationToContractApproval: duration(
        mission.createdAt,
        approvedAt,
        "Mission.createdAt -> approved MissionContract.approvedAt",
      ),
      approvalToBuilding: duration(
        approvedAt,
        buildingAt,
        "approved MissionContract.approvedAt -> mission.transitioned BUILDING",
      ),
      buildingToVerification: duration(
        buildingAt,
        verifyingAt,
        "mission.transitioned BUILDING -> VERIFYING",
      ),
      verificationToRelease: duration(
        verifyingAt,
        releasedAt,
        "mission.transitioned VERIFYING -> RELEASED or GovernedRelease.approvedAt",
      ),
    },
    coverage: {
      requirements: {
        total: requirementIds.size,
        withEvidence: evidencedRequirementIds.size,
        passedVerification: passedRequirementIds.size,
        evidencePercent: percent(
          evidencedRequirementIds.size,
          requirementIds.size,
        ),
        verifiedPercent: percent(
          passedRequirementIds.size,
          requirementIds.size,
        ),
      },
      materialDecisionAccountability: {
        total: materialDecisions.length,
        accountable: accountableDecisions.length,
        percent: percent(accountableDecisions.length, materialDecisions.length),
      },
      releaseClaimProvenance: {
        total: releasedVersions.size,
        traceable: traceableReleasedVersions.length,
        percent: percent(
          traceableReleasedVersions.length,
          releasedVersions.size,
        ),
      },
    },
    reworkSignals: {
      totalAgentRuns,
      retries: retryCount,
      deviations: mission.executionDeviations.length,
      openDeviations: mission.executionDeviations.filter(
        (item) => item.status === "OPEN",
      ).length,
      disputes: disputeCount,
      failedVerificationScenarios: failedScenarios,
    },
    dossierCompleteness: {
      checks: dossierChecks,
      complete: missingDossierSections.length === 0,
      missingSections: missingDossierSections,
    },
    governedThroughputEligibility: {
      eligible:
        mission.status === "RELEASED" &&
        missingDossierSections.length === 0 &&
        requirementsComplete &&
        decisionsComplete &&
        provenanceComplete,
      rule:
        "RELEASED with complete dossier, evidenced PASS coverage, accountable material decisions and traceable release claims.",
    },
    unavailableMeasurements: [
      {
        metric: "evidenceRetrievalTime",
        reason:
          "No retained user-timing event exists; measure during the pilot observation.",
      },
      {
        metric: "reworkHours",
        reason:
          "The ledger retains rework signals but no authoritative human-hours record.",
      },
      {
        metric: "defectsCaughtBeforeProduction",
        reason:
          "Production defect outcomes are external to the current HIVE OS ledger.",
      },
      {
        metric: "changeApprovalImprovementPercent",
        reason:
          "A comparable pre-pilot baseline has not been retained.",
      },
    ],
  };
}

export async function getPilotMeasurementReport(
  ctx: WorkspaceContext,
  missionId: string,
) {
  requireMissionCapability(ctx, "missions.read");
  requireTruthCapability(ctx, "truth.read");
  requireExecutionCapability(ctx, "execution.read");
  requireVerificationCapability(ctx, "verification.read");

  const workspaceId = ctx.workspace.id;
  const mission = await getDb().mission.findFirst({
    where: { id: missionId, workspaceId },
    select: {
      id: true,
      referenceCode: true,
      title: true,
      status: true,
      createdAt: true,
      approvedContractId: true,
      contracts: {
        where: { status: "APPROVED" },
        orderBy: { versionNumber: "desc" },
        take: 1,
        select: {
          id: true,
          approvedAt: true,
          requirements: { select: { id: true } },
        },
      },
      decisions: {
        select: {
          materiality: true,
          status: true,
          resolution: true,
          decidedByMembershipId: true,
          decidedAt: true,
        },
      },
      evidenceSources: {
        select: { snapshots: { select: { id: true } } },
      },
      claims: {
        select: {
          versions: {
            select: { id: true, evidence: { select: { id: true } } },
          },
          disputes: { select: { id: true } },
        },
      },
      skillRuns: {
        select: { agentRuns: { select: { id: true } } },
      },
      executionDeviations: { select: { status: true } },
      verificationRuns: {
        select: {
          requirementCoverage: {
            select: {
              requirementId: true,
              result: true,
              evidenceArtifactIds: true,
            },
          },
          scenarioResults: { select: { result: true } },
        },
      },
      verificationReports: { select: { overallStatus: true } },
      governanceSignoffs: { select: { decision: true } },
      governedReleases: {
        orderBy: { approvedAt: "asc" },
        select: {
          approvedAt: true,
          manifest: { select: { claimVersions: true } },
        },
      },
    },
  });
  if (!mission) throw new NotFoundError();

  const [transitions, provenance] = await Promise.all([
    getDb().auditEvent.findMany({
      where: {
        workspaceId,
        entityType: "Mission",
        entityId: missionId,
        eventType: "mission.transitioned",
      },
      orderBy: { createdAt: "asc" },
      select: { createdAt: true, payload: true },
    }),
    getDb().provenanceEdge.findMany({
      where: { workspaceId, missionId, toKind: "ClaimVersion" },
      select: { toId: true },
    }),
  ]);
  const approvedContract =
    mission.contracts.find(
      (contract) => contract.id === mission.approvedContractId,
    ) ??
    mission.contracts[0] ??
    null;
  const measurements = derivePilotMeasurements({
    mission: {
      ...mission,
      approvedContract,
    },
    transitions,
    provenanceTargets: provenance.map((edge) => edge.toId),
  });
  const canonical = canonicalJson(measurements);
  return {
    ...measurements,
    generatedAt: new Date().toISOString(),
    integrity: {
      algorithm: "sha256",
      canonicalization: "recursive-key-sort.v1",
      contentHash: sha256(canonical),
      contentBytes: Buffer.byteLength(canonical, "utf8"),
    },
  };
}
