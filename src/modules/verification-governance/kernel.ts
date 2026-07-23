import { Buffer } from "node:buffer";

import {
  type AccessLevel,
  type AssuranceProfile,
  Prisma,
} from "@prisma/client";

import {
  assertNoCredentialMaterial,
  canonicalJson,
  sha256,
} from "@/modules/execution-fabric/contracts";
import {
  AuditEventType,
  type WorkspaceContext,
  writeAuditEvent,
} from "@/modules/identity-workspace";
import { assurancePolicy, internalTransition } from "@/modules/mission-kernel";
import { getDb } from "@/server/db";

import {
  computeVerificationStatus,
  type AuthorizeReleaseInput,
  type CompleteVerificationInput,
  type CreateVerificationScenarioInput,
  validateReleaseInput,
  validateScenario,
  validateVerificationReport,
} from "./contracts";
import { requireVerificationCapability } from "./context";
import {
  VerificationGovernanceError,
  VerificationGovernanceErrorCode,
} from "./errors";

function mapConflict(error: unknown): never {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    ["P2002", "P2034"].includes(error.code)
  ) {
    throw new VerificationGovernanceError(
      VerificationGovernanceErrorCode.Conflict,
      "Verification state changed concurrently",
    );
  }
  throw error;
}

function highAssurance(profile: AssuranceProfile): boolean {
  return profile === "RESEARCH" || profile === "REGULATED";
}

export async function createVerificationScenario(
  ctx: WorkspaceContext,
  missionId: string,
  input: CreateVerificationScenarioInput,
) {
  requireVerificationCapability(ctx, "verification.operate");
  const value = validateScenario(input);
  try {
    return await getDb().$transaction(async (tx) => {
      const mission = await tx.mission.findFirst({
        where: {
          id: missionId,
          workspaceId: ctx.workspace.id,
          status: "BUILDING",
        },
      });
      if (!mission?.approvedContractId) {
        throw new VerificationGovernanceError(
          VerificationGovernanceErrorCode.NotFound,
          "Building Mission with approved contract not found",
        );
      }
      if (value.requirementId) {
        const requirement = await tx.requirement.findFirst({
          where: {
            id: value.requirementId,
            contractId: mission.approvedContractId,
            workspaceId: ctx.workspace.id,
          },
        });
        if (!requirement) {
          throw new VerificationGovernanceError(
            VerificationGovernanceErrorCode.NotFound,
            "Approved requirement not found",
          );
        }
      }
      const scenario = await tx.verificationScenario.create({
        data: {
          workspaceId: ctx.workspace.id,
          missionId,
          requirementId: value.requirementId,
          code: value.code,
          title: value.title,
          kind: value.kind,
          method: value.method,
          expectedOutcome: value.expectedOutcome,
          required: value.required,
          createdByMembershipId: ctx.membership.id,
        },
      });
      await writeAuditEvent(tx, {
        workspaceId: ctx.workspace.id,
        actorUserId: ctx.user.id,
        actorMembershipId: ctx.membership.id,
        eventType: AuditEventType.VerificationScenarioCreated,
        entityType: "VerificationScenario",
        entityId: scenario.id,
        correlationId: ctx.correlationId,
        payload: {
          code: scenario.code,
          kind: scenario.kind,
          required: scenario.required,
        },
      });
      return scenario;
    });
  } catch (error) {
    mapConflict(error);
  }
}

export async function beginVerificationRun(
  ctx: WorkspaceContext,
  missionId: string,
  verifierAgentRunId: string,
) {
  requireVerificationCapability(ctx, "verification.operate");
  try {
    return await getDb().$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM "mission" WHERE id = ${missionId} FOR UPDATE`;
      const mission = await tx.mission.findFirst({
        where: {
          id: missionId,
          workspaceId: ctx.workspace.id,
          status: "BUILDING",
        },
      });
      if (!mission) {
        throw new VerificationGovernanceError(
          VerificationGovernanceErrorCode.NotFound,
          "Building Mission not found",
        );
      }
      const [tipCount, unreadyTips, awaitingReports, openDeviations, scenarios] =
        await Promise.all([
          tx.executionTip.count({
            where: { workspaceId: ctx.workspace.id, missionId },
          }),
          tx.executionTip.count({
            where: {
              workspaceId: ctx.workspace.id,
              missionId,
              status: { not: "DONE" },
            },
          }),
          tx.agentRun.count({
            where: {
              workspaceId: ctx.workspace.id,
              missionId,
              status: "AWAITING_REPORT",
            },
          }),
          tx.executionDeviation.count({
            where: {
              workspaceId: ctx.workspace.id,
              missionId,
              status: "OPEN",
              materiality: "MATERIAL",
            },
          }),
          tx.verificationScenario.count({
            where: {
              workspaceId: ctx.workspace.id,
              missionId,
              required: true,
            },
          }),
        ]);
      if (
        tipCount === 0 ||
        unreadyTips > 0 ||
        awaitingReports > 0 ||
        openDeviations > 0 ||
        scenarios === 0
      ) {
        throw new VerificationGovernanceError(
          VerificationGovernanceErrorCode.NotReady,
          "Execution and required scenarios must be complete before verification",
        );
      }
      const verifier = await tx.agentRun.findFirst({
        where: {
          id: verifierAgentRunId,
          workspaceId: ctx.workspace.id,
          missionId,
          executionRole: "VERIFIER",
          status: "DONE",
        },
        include: { completionReport: true },
      });
      if (
        !verifier?.completionReport ||
        verifier.completionReport.overallStatus === "NOT_READY"
      ) {
        throw new VerificationGovernanceError(
          VerificationGovernanceErrorCode.NotFound,
          "Terminal VERIFIER attempt with valid report not found",
        );
      }
      const builderConflict = await tx.agentRun.count({
        where: {
          workspaceId: ctx.workspace.id,
          missionId,
          executionRole: "BUILDER",
          providerName: { equals: verifier.providerName, mode: "insensitive" },
          modelName: { equals: verifier.modelName, mode: "insensitive" },
        },
      });
      const independenceStatus = highAssurance(mission.assuranceProfile)
        ? builderConflict === 0
          ? "INDEPENDENT"
          : "NOT_INDEPENDENT"
        : "NOT_REQUIRED";
      if (independenceStatus === "NOT_INDEPENDENT") {
        throw new VerificationGovernanceError(
          VerificationGovernanceErrorCode.NotIndependent,
          "Research and Regulated verification must use an independent provider/model pair",
        );
      }
      const run = await tx.verificationRun.create({
        data: {
          workspaceId: ctx.workspace.id,
          missionId,
          verifierAgentRunId: verifier.id,
          independenceStatus,
          createdByMembershipId: ctx.membership.id,
        },
      });
      await internalTransition(
        tx,
        ctx,
        mission.id,
        "BUILDING",
        "VERIFYING",
        "Independent verification run begun",
        mission.version,
      );
      await writeAuditEvent(tx, {
        workspaceId: ctx.workspace.id,
        actorUserId: ctx.user.id,
        actorMembershipId: ctx.membership.id,
        eventType: AuditEventType.VerificationRunBegun,
        entityType: "VerificationRun",
        entityId: run.id,
        correlationId: ctx.correlationId,
        payload: {
          independenceStatus,
          verifierRunId: verifier.id,
        },
      });
      return run;
    });
  } catch (error) {
    mapConflict(error);
  }
}

export async function completeVerificationRun(
  ctx: WorkspaceContext,
  verificationRunId: string,
  input: CompleteVerificationInput,
) {
  requireVerificationCapability(ctx, "verification.operate");
  const value = validateVerificationReport(input);
  const canonical = canonicalJson(value);
  assertNoCredentialMaterial(canonical);

  try {
    return await getDb().$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM "verification_run" WHERE id = ${verificationRunId} FOR UPDATE`;
      const run = await tx.verificationRun.findFirst({
        where: {
          id: verificationRunId,
          workspaceId: ctx.workspace.id,
          status: "IN_PROGRESS",
        },
        include: { mission: true },
      });
      if (!run || run.mission.status !== "VERIFYING") {
        throw new VerificationGovernanceError(
          VerificationGovernanceErrorCode.NotFound,
          "Active VerificationRun not found",
        );
      }
      const [requirements, scenarios] = await Promise.all([
        tx.requirement.findMany({
          where: {
            workspaceId: ctx.workspace.id,
            contractId: run.mission.approvedContractId ?? "",
          },
          select: { id: true, required: true },
        }),
        tx.verificationScenario.findMany({
          where: { workspaceId: ctx.workspace.id, missionId: run.missionId },
          select: { id: true, required: true },
        }),
      ]);
      const computedStatus = computeVerificationStatus(
        value,
        requirements,
        scenarios,
        highAssurance(run.mission.assuranceProfile),
      );
      if (computedStatus !== value.overallStatus) {
        throw new VerificationGovernanceError(
          VerificationGovernanceErrorCode.InvalidReport,
          `Overall status must be ${computedStatus}`,
        );
      }
      const allArtifactIds = [
        ...value.requirementCoverage.flatMap(
          (item) => item.evidenceArtifactIds,
        ),
        ...value.scenarioResults.flatMap(
          (item) => item.evidenceArtifactIds,
        ),
        ...value.corruptionTests.flatMap(
          (item) => item.evidenceArtifactIds,
        ),
      ];
      const uniqueArtifactIds = [...new Set(allArtifactIds)];
      const artifactCount = await tx.executionArtifact.count({
        where: {
          id: { in: uniqueArtifactIds },
          workspaceId: ctx.workspace.id,
          missionId: run.missionId,
        },
      });
      if (artifactCount !== uniqueArtifactIds.length) {
        throw new VerificationGovernanceError(
          VerificationGovernanceErrorCode.NotFound,
          "One or more verification evidence artifacts were not found",
        );
      }

      const reportArtifact = await tx.executionArtifact.create({
        data: {
          workspaceId: ctx.workspace.id,
          missionId: run.missionId,
          tipId: null,
          kind: "RECEIPT",
          mediaType: "application/json",
          content: canonical,
          contentHash: sha256(canonical),
          sizeBytes: Buffer.byteLength(canonical, "utf8"),
          createdByMembershipId: ctx.membership.id,
        },
      });
      await tx.verificationRequirementCoverage.createMany({
        data: value.requirementCoverage.map((item) => ({
          workspaceId: ctx.workspace.id,
          missionId: run.missionId,
          verificationRunId: run.id,
          ...item,
        })),
      });
      await tx.verificationScenarioResult.createMany({
        data: value.scenarioResults.map((item) => ({
          workspaceId: ctx.workspace.id,
          missionId: run.missionId,
          verificationRunId: run.id,
          ...item,
        })),
      });
      await tx.verificationTechnicalHealth.create({
        data: {
          workspaceId: ctx.workspace.id,
          missionId: run.missionId,
          verificationRunId: run.id,
          content: value.technicalHealth as Prisma.InputJsonObject,
        },
      });
      if (value.corruptionTests.length > 0) {
        await tx.corruptionTestRun.createMany({
          data: value.corruptionTests.map((item) => ({
            workspaceId: ctx.workspace.id,
            missionId: run.missionId,
            verificationRunId: run.id,
            ...item,
          })),
        });
      }
      const report = await tx.verificationReport.create({
        data: {
          workspaceId: ctx.workspace.id,
          missionId: run.missionId,
          verificationRunId: run.id,
          artifactId: reportArtifact.id,
          requirementCoverage:
            value.requirementCoverage as unknown as Prisma.InputJsonArray,
          scenarioResults:
            value.scenarioResults as unknown as Prisma.InputJsonArray,
          technicalHealth:
            value.technicalHealth as Prisma.InputJsonObject,
          overallStatus: computedStatus,
          deferredItems: value.deferredItems,
          contentHash: reportArtifact.contentHash,
          createdByMembershipId: ctx.membership.id,
        },
      });
      await tx.verificationRun.update({
        where: { id: run.id },
        data: {
          status: "COMPLETED",
          completedAt: new Date(),
          version: { increment: 1 },
        },
      });
      await writeAuditEvent(tx, {
        workspaceId: ctx.workspace.id,
        actorUserId: ctx.user.id,
        actorMembershipId: ctx.membership.id,
        eventType: AuditEventType.VerificationReportCompleted,
        entityType: "VerificationReport",
        entityId: report.id,
        correlationId: ctx.correlationId,
        payload: {
          overallStatus: report.overallStatus,
          reportArtifactId: reportArtifact.id,
          requirementCount: value.requirementCoverage.length,
          scenarioCount: value.scenarioResults.length,
          corruptionCount: value.corruptionTests.length,
        },
      });
      return { report, artifact: reportArtifact };
    });
  } catch (error) {
    mapConflict(error);
  }
}

export async function recordGovernanceSignoff(
  ctx: WorkspaceContext,
  verificationReportId: string,
  input: {
    signoffType: "VERIFICATION" | "RELEASE";
    decision: "APPROVED" | "REJECTED";
    rationale: string;
  },
) {
  requireVerificationCapability(ctx, "verification.review");
  const rationale = input.rationale?.trim();
  if (!rationale) {
    throw new VerificationGovernanceError(
      VerificationGovernanceErrorCode.InvalidInput,
      "Sign-off rationale is required",
    );
  }
  try {
    return await getDb().$transaction(async (tx) => {
      const report = await tx.verificationReport.findFirst({
        where: {
          id: verificationReportId,
          workspaceId: ctx.workspace.id,
          overallStatus: { not: "NOT_READY" },
        },
        include: { mission: true },
      });
      if (
        !report ||
        !["VERIFYING", "REVIEW"].includes(report.mission.status)
      ) {
        throw new VerificationGovernanceError(
          VerificationGovernanceErrorCode.NotFound,
          "Reviewable VerificationReport not found",
        );
      }
      if (
        input.signoffType === "RELEASE" &&
        report.mission.status !== "REVIEW"
      ) {
        throw new VerificationGovernanceError(
          VerificationGovernanceErrorCode.Invariant,
          "Release sign-off requires Mission review state",
        );
      }
      if (
        input.signoffType === "RELEASE" &&
        report.mission.assuranceProfile === "REGULATED" &&
        ctx.membership.role !== "OWNER"
      ) {
        throw new VerificationGovernanceError(
          VerificationGovernanceErrorCode.Forbidden,
          "Regulated release sign-off is Owner-only",
        );
      }
      const signoff = await tx.governanceSignoff.create({
        data: {
          workspaceId: ctx.workspace.id,
          missionId: report.missionId,
          verificationReportId: report.id,
          signoffType: input.signoffType,
          decision: input.decision,
          rationale,
          signedByMembershipId: ctx.membership.id,
        },
      });
      await writeAuditEvent(tx, {
        workspaceId: ctx.workspace.id,
        actorUserId: ctx.user.id,
        actorMembershipId: ctx.membership.id,
        eventType: AuditEventType.GovernanceSignoffRecorded,
        entityType: "GovernanceSignoff",
        entityId: signoff.id,
        correlationId: ctx.correlationId,
        payload: {
          signoffType: signoff.signoffType,
          decision: signoff.decision,
        },
      });
      return signoff;
    });
  } catch (error) {
    mapConflict(error);
  }
}

const PUBLIC_STATES = new Set([
  "CORROBORATED",
  "VALIDATED_BOUNDED",
  "PROVED_INTERNAL",
  "HONEST_NULL",
]);
const ACCESS_RANK: Record<AccessLevel, number> = {
  PUBLIC: 0,
  WORKSPACE: 1,
  RESTRICTED: 2,
};

export async function authorizeGovernedRelease(
  ctx: WorkspaceContext,
  missionId: string,
  input: AuthorizeReleaseInput,
) {
  requireVerificationCapability(ctx, "release.approve");
  const value = validateReleaseInput(input);

  try {
    return await getDb().$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM "mission" WHERE id = ${missionId} FOR UPDATE`;
      const mission = await tx.mission.findFirst({
        where: {
          id: missionId,
          workspaceId: ctx.workspace.id,
          status: "REVIEW",
        },
      });
      if (!mission) {
        throw new VerificationGovernanceError(
          VerificationGovernanceErrorCode.NotFound,
          "Mission in review not found",
        );
      }
      if (
        mission.assuranceProfile === "REGULATED" &&
        ctx.membership.role !== "OWNER"
      ) {
        throw new VerificationGovernanceError(
          VerificationGovernanceErrorCode.Forbidden,
          "Regulated release approval is Owner-only",
        );
      }
      const report = await tx.verificationReport.findFirst({
        where: {
          id: value.verificationReportId,
          workspaceId: ctx.workspace.id,
          missionId,
          overallStatus: { not: "NOT_READY" },
        },
        include: {
          verificationRun: {
            include: {
              verifierAgentRun: true,
              requirementCoverage: true,
              scenarioResults: true,
              corruptionRuns: true,
            },
          },
          signoffs: true,
        },
      });
      if (!report) {
        throw new VerificationGovernanceError(
          VerificationGovernanceErrorCode.NotFound,
          "Release-ready VerificationReport not found",
        );
      }
      if (
        highAssurance(mission.assuranceProfile) &&
        report.verificationRun.independenceStatus !== "INDEPENDENT"
      ) {
        throw new VerificationGovernanceError(
          VerificationGovernanceErrorCode.ReleaseBlocked,
          "Independent verifier status is required",
        );
      }
      const policy = assurancePolicy(mission.assuranceProfile);
      const rejected = report.signoffs.some(
        (signoff) => signoff.decision === "REJECTED",
      );
      const verificationApproved = report.signoffs.some(
        (signoff) =>
          signoff.signoffType === "VERIFICATION" &&
          signoff.decision === "APPROVED",
      );
      const releaseApproved = report.signoffs.some(
        (signoff) =>
          signoff.signoffType === "RELEASE" &&
          signoff.decision === "APPROVED",
      );
      if (
        rejected ||
        (highAssurance(mission.assuranceProfile) &&
          !verificationApproved) ||
        (policy.requiresReleaseSignoff && !releaseApproved)
      ) {
        throw new VerificationGovernanceError(
          VerificationGovernanceErrorCode.SignoffRequired,
          "Required governance sign-offs are missing or rejected",
        );
      }
      if (
        value.visibility === "PUBLIC" &&
        !policy.publicReleaseEligible
      ) {
        throw new VerificationGovernanceError(
          VerificationGovernanceErrorCode.ReleaseBlocked,
          "Assurance profile is not eligible for public release",
        );
      }
      if (
        value.visibility === "PUBLIC" &&
        value.claimVersionIds.length === 0
      ) {
        throw new VerificationGovernanceError(
          VerificationGovernanceErrorCode.ReleaseBlocked,
          "Public release requires at least one governed ClaimVersion",
        );
      }

      const claimVersions = await tx.claimVersion.findMany({
        where: {
          id: { in: value.claimVersionIds },
          workspaceId: ctx.workspace.id,
          missionId,
        },
        include: {
          claim: {
            include: {
              versions: {
                orderBy: { versionNumber: "desc" },
                take: 1,
                select: { id: true },
              },
              honestNulls: {
                orderBy: { createdAt: "desc" },
                take: 1,
              },
            },
          },
          evidence: {
            where: { relation: "SUPPORTS" },
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
      });
      if (claimVersions.length !== value.claimVersionIds.length) {
        throw new VerificationGovernanceError(
          VerificationGovernanceErrorCode.NotFound,
          "One or more release ClaimVersions were not found",
        );
      }

      const assessments = claimVersions.map((version) => {
        const accessLevels: AccessLevel[] = [
          version.claim.accessLevel,
          version.accessLevel,
          ...version.evidence.map(
            (link) =>
              link.evidenceSpan.snapshot.evidenceSource.accessLevel,
          ),
        ];
        const ceiling = accessLevels.reduce((current, level) =>
          ACCESS_RANK[level] > ACCESS_RANK[current] ? level : current,
        );
        const reasons: string[] = [];
        if (version.claim.versions[0]?.id !== version.id) {
          reasons.push("CLAIM_VERSION_NOT_LATEST");
        }
        if (!PUBLIC_STATES.has(version.claim.state)) {
          reasons.push(`CLAIM_STATE_${version.claim.state}`);
        }
        if (
          version.claim.state === "HONEST_NULL" &&
          (version.claim.honestNulls[0]?.searchCompleteness !==
            "EMPTY_CERTIFIED" ||
            !version.claim.honestNulls[0]?.certificateReference)
        ) {
          reasons.push("HONEST_NULL_NOT_EMPTY_CERTIFIED");
        }
        if (
          version.claim.state !== "HONEST_NULL" &&
          version.evidence.length === 0
        ) {
          reasons.push("SUPPORTING_PROVENANCE_MISSING");
        }
        if (ceiling !== "PUBLIC") {
          reasons.push(`EVIDENCE_CEILING_${ceiling}`);
        }
        return {
          version,
          ceiling,
          reasons,
          eligiblePublic: reasons.length === 0,
        };
      });
      const invalidState = assessments.some((item) =>
        item.reasons.some(
          (reason) =>
            reason.startsWith("CLAIM_STATE_") ||
            reason === "CLAIM_VERSION_NOT_LATEST" ||
            reason === "HONEST_NULL_NOT_EMPTY_CERTIFIED" ||
            reason === "SUPPORTING_PROVENANCE_MISSING",
        ),
      );
      if (
        invalidState ||
        (value.visibility === "PUBLIC" &&
          assessments.some((item) => !item.eligiblePublic))
      ) {
        throw new VerificationGovernanceError(
          VerificationGovernanceErrorCode.ReleaseBlocked,
          "Claim state, provenance, access level, or evidence ceiling blocks release",
        );
      }

      const verifier = report.verificationRun.verifierAgentRun;
      const referencedArtifactIds = new Set([
        report.artifactId,
        verifier.inputArtifactId,
        ...(verifier.outputArtifactId ? [verifier.outputArtifactId] : []),
        ...report.verificationRun.requirementCoverage.flatMap(
          (item) => item.evidenceArtifactIds,
        ),
        ...report.verificationRun.scenarioResults.flatMap(
          (item) => item.evidenceArtifactIds,
        ),
        ...report.verificationRun.corruptionRuns.flatMap(
          (item) => item.evidenceArtifactIds,
        ),
      ]);
      const artifacts = await tx.executionArtifact.findMany({
        where: {
          id: { in: [...referencedArtifactIds] },
          workspaceId: ctx.workspace.id,
          missionId,
        },
        select: {
          id: true,
          kind: true,
          mediaType: true,
          contentHash: true,
          sizeBytes: true,
        },
        orderBy: { id: "asc" },
      });
      if (artifacts.length !== referencedArtifactIds.size) {
        throw new VerificationGovernanceError(
          VerificationGovernanceErrorCode.ReleaseBlocked,
          "Release artifact set is incomplete",
        );
      }
      const approverMembershipIds = [
        ...new Set([
          ctx.membership.id,
          ...report.signoffs
            .filter((signoff) => signoff.decision === "APPROVED")
            .map((signoff) => signoff.signedByMembershipId),
        ]),
      ].sort();
      const claimManifest = assessments
        .map((item) => ({
          claimId: item.version.claimId,
          claimVersionId: item.version.id,
          versionNumber: item.version.versionNumber,
          state: item.version.claim.state,
          statement: item.version.statement,
          statementHash: sha256(item.version.statement),
          accessLevel: item.version.accessLevel,
          evidenceCeiling: item.ceiling,
        }))
        .sort((a, b) =>
          a.claimVersionId.localeCompare(b.claimVersionId),
        );
      const manifestContent = {
        missionId,
        verificationReportId: report.id,
        visibility: value.visibility,
        claimVersions: claimManifest,
        artifacts,
        methods: [...value.methods].sort(),
        limitations: [...value.limitations].sort(),
        approverMembershipIds,
      };
      const manifestHash = sha256(canonicalJson(manifestContent));

      for (const assessment of assessments) {
        await tx.evidenceCeilingAssessment.create({
          data: {
            workspaceId: ctx.workspace.id,
            missionId,
            verificationReportId: report.id,
            claimVersionId: assessment.version.id,
            ceiling: assessment.ceiling,
            eligiblePublic: assessment.eligiblePublic,
            reasons: assessment.reasons,
          },
        });
      }
      const release = await tx.governedRelease.create({
        data: {
          workspaceId: ctx.workspace.id,
          missionId,
          verificationReportId: report.id,
          visibility: value.visibility,
          approvedByMembershipId: ctx.membership.id,
        },
      });
      const manifest = await tx.releaseManifest.create({
        data: {
          workspaceId: ctx.workspace.id,
          missionId,
          releaseId: release.id,
          claimVersions:
            claimManifest as unknown as Prisma.InputJsonArray,
          artifacts: artifacts as unknown as Prisma.InputJsonArray,
          methods: manifestContent.methods,
          limitations: manifestContent.limitations,
          approverMembershipIds,
          contentHash: manifestHash,
        },
      });

      const gates = await tx.runtimeGate.findMany({
        where: { workspaceId: ctx.workspace.id, missionId },
        include: { contractGate: true },
      });
      for (const gate of gates.filter(
        (item) =>
          item.status === "OPEN" &&
          ["INDEPENDENT_VERIFICATION", "HUMAN_RELEASE_SIGNOFF"].includes(
            item.contractGate.code,
          ),
      )) {
        await tx.gateRun.create({
          data: {
            workspaceId: ctx.workspace.id,
            missionId,
            runtimeGateId: gate.id,
            result: "PASS",
            actorType: "DETERMINISTIC_KERNEL",
            actorId: "verification-governance",
            reason: "Governed Verify Report and required sign-offs approved",
            linkedArtifactId: report.artifactId,
          },
        });
        await tx.runtimeGate.update({
          where: { id: gate.id },
          data: { status: "PASSED", version: { increment: 1 } },
        });
      }
      await writeAuditEvent(tx, {
        workspaceId: ctx.workspace.id,
        actorUserId: ctx.user.id,
        actorMembershipId: ctx.membership.id,
        eventType: AuditEventType.ReleaseApproved,
        entityType: "GovernedRelease",
        entityId: release.id,
        correlationId: ctx.correlationId,
        payload: {
          visibility: release.visibility,
          manifestId: manifest.id,
          claimCount: claimManifest.length,
          artifactCount: artifacts.length,
        },
      });
      return { release, manifest };
    });
  } catch (error) {
    mapConflict(error);
  }
}
