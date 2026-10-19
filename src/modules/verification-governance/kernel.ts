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
import {
  requireScopedVerificationCapability,
  requireVerificationCapability,
} from "./context";
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

const MAX_RELEASE_RELATION_ROWS = 10_000;

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
      const tipCount = await tx.executionTip.count({
        where: { workspaceId: ctx.workspace.id, missionId },
      });
      const unreadyTips = await tx.executionTip.count({
        where: {
          workspaceId: ctx.workspace.id,
          missionId,
          status: { not: "DONE" },
        },
      });
      const awaitingReports = await tx.agentRun.count({
        where: {
          workspaceId: ctx.workspace.id,
          missionId,
          status: "AWAITING_REPORT",
        },
      });
      const openDeviations = await tx.executionDeviation.count({
        where: {
          workspaceId: ctx.workspace.id,
          missionId,
          status: "OPEN",
          materiality: "MATERIAL",
        },
      });
      const scenarios = await tx.verificationScenario.count({
        where: {
          workspaceId: ctx.workspace.id,
          missionId,
          required: true,
        },
      });
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
      const requirements = await tx.requirement.findMany({
        where: {
          workspaceId: ctx.workspace.id,
          contractId: run.mission.approvedContractId ?? "",
        },
        select: { id: true, required: true },
      });
      const scenarios = await tx.verificationScenario.findMany({
        where: { workspaceId: ctx.workspace.id, missionId: run.missionId },
        select: { id: true, required: true },
      });
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
        ...value.scenarioResults.flatMap((item) => item.evidenceArtifactIds),
        ...value.corruptionTests.flatMap((item) => item.evidenceArtifactIds),
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
          technicalHealth: value.technicalHealth as Prisma.InputJsonObject,
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
  const scopedReport = await getDb().verificationReport.findFirst({
    where: { id: verificationReportId, workspaceId: ctx.workspace.id },
    select: { missionId: true },
  });
  if (scopedReport) {
    await requireScopedVerificationCapability(
      ctx,
      "verification.review",
      scopedReport.missionId,
    );
  }
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
      if (!report || !["VERIFYING", "REVIEW"].includes(report.mission.status)) {
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
  await requireScopedVerificationCapability(ctx, "release.approve", missionId);
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
      });
      if (!report) {
        throw new VerificationGovernanceError(
          VerificationGovernanceErrorCode.NotFound,
          "Release-ready VerificationReport not found",
        );
      }
      const verificationRun = await tx.verificationRun.findUniqueOrThrow({
        where: { id: report.verificationRunId },
      });
      const verifierAgentRun = await tx.agentRun.findUniqueOrThrow({
        where: { id: verificationRun.verifierAgentRunId },
      });
      const requirementCoverage =
        await tx.verificationRequirementCoverage.findMany({
          where: { verificationRunId: verificationRun.id },
          take: MAX_RELEASE_RELATION_ROWS + 1,
        });
      const scenarioResults = await tx.verificationScenarioResult.findMany({
        where: { verificationRunId: verificationRun.id },
        take: MAX_RELEASE_RELATION_ROWS + 1,
      });
      const corruptionRuns = await tx.corruptionTestRun.findMany({
        where: { verificationRunId: verificationRun.id },
        take: MAX_RELEASE_RELATION_ROWS + 1,
      });
      const signoffs = await tx.governanceSignoff.findMany({
        where: { verificationReportId: report.id },
        take: MAX_RELEASE_RELATION_ROWS + 1,
      });
      if (
        requirementCoverage.length > MAX_RELEASE_RELATION_ROWS ||
        scenarioResults.length > MAX_RELEASE_RELATION_ROWS ||
        corruptionRuns.length > MAX_RELEASE_RELATION_ROWS ||
        signoffs.length > MAX_RELEASE_RELATION_ROWS
      ) {
        throw new VerificationGovernanceError(
          VerificationGovernanceErrorCode.ReleaseBlocked,
          "Release verification relation row limit exceeded",
        );
      }
      if (
        highAssurance(mission.assuranceProfile) &&
        verificationRun.independenceStatus !== "INDEPENDENT"
      ) {
        throw new VerificationGovernanceError(
          VerificationGovernanceErrorCode.ReleaseBlocked,
          "Independent verifier status is required",
        );
      }
      const policy = assurancePolicy(mission.assuranceProfile);
      const rejected = signoffs.some(
        (signoff) => signoff.decision === "REJECTED",
      );
      const verificationApproved = signoffs.some(
        (signoff) =>
          signoff.signoffType === "VERIFICATION" &&
          signoff.decision === "APPROVED",
      );
      const releaseApproved = signoffs.some(
        (signoff) =>
          signoff.signoffType === "RELEASE" && signoff.decision === "APPROVED",
      );
      if (
        rejected ||
        (highAssurance(mission.assuranceProfile) && !verificationApproved) ||
        (policy.requiresReleaseSignoff && !releaseApproved)
      ) {
        throw new VerificationGovernanceError(
          VerificationGovernanceErrorCode.SignoffRequired,
          "Required governance sign-offs are missing or rejected",
        );
      }
      if (value.visibility === "PUBLIC" && !policy.publicReleaseEligible) {
        throw new VerificationGovernanceError(
          VerificationGovernanceErrorCode.ReleaseBlocked,
          "Assurance profile is not eligible for public release",
        );
      }
      if (value.visibility === "PUBLIC") {
        const workspacePolicy = await tx.workspacePolicy.findUnique({
          where: { workspaceId: ctx.workspace.id },
          select: { publicReleasePolicy: true },
        });
        if (workspacePolicy?.publicReleasePolicy === "INTERNAL_ONLY") {
          throw new VerificationGovernanceError(
            VerificationGovernanceErrorCode.ReleaseBlocked,
            "Workspace policy permits internal releases only",
          );
        }
      }
      if (value.visibility === "PUBLIC" && value.claimVersionIds.length === 0) {
        throw new VerificationGovernanceError(
          VerificationGovernanceErrorCode.ReleaseBlocked,
          "Public release requires at least one governed ClaimVersion",
        );
      }

      const claimVersionRows = await tx.claimVersion.findMany({
        where: {
          id: { in: value.claimVersionIds },
          workspaceId: ctx.workspace.id,
          missionId,
        },
        take: value.claimVersionIds.length,
      });
      if (claimVersionRows.length !== value.claimVersionIds.length) {
        throw new VerificationGovernanceError(
          VerificationGovernanceErrorCode.NotFound,
          "One or more release ClaimVersions were not found",
        );
      }
      const claimIds = [...new Set(claimVersionRows.map((version) => version.claimId))];
      const claims = await tx.claim.findMany({
        where: { id: { in: claimIds }, workspaceId: ctx.workspace.id, missionId },
        take: claimIds.length,
      });
      const latestVersionRows = await tx.claimVersion.findMany({
        where: { claimId: { in: claimIds }, workspaceId: ctx.workspace.id, missionId },
        orderBy: { versionNumber: "desc" },
        distinct: ["claimId"],
        select: { id: true, claimId: true },
        take: claimIds.length,
      });
      const honestNullRows = await tx.honestNullRecord.findMany({
        where: { claimId: { in: claimIds }, workspaceId: ctx.workspace.id, missionId },
        orderBy: { createdAt: "desc" },
        distinct: ["claimId"],
        take: claimIds.length,
      });
      const evidenceLinks = await tx.claimEvidence.findMany({
        where: {
          claimVersionId: { in: claimVersionRows.map((version) => version.id) },
          workspaceId: ctx.workspace.id,
          relation: "SUPPORTS",
        },
        take: MAX_RELEASE_RELATION_ROWS + 1,
      });
      if (evidenceLinks.length > MAX_RELEASE_RELATION_ROWS) {
        throw new VerificationGovernanceError(
          VerificationGovernanceErrorCode.ReleaseBlocked,
          "Release evidence relation row limit exceeded",
        );
      }
      const spans = evidenceLinks.length
        ? await tx.evidenceSpan.findMany({
            where: {
              id: { in: evidenceLinks.map((link) => link.evidenceSpanId) },
              workspaceId: ctx.workspace.id,
              missionId,
            },
            take: evidenceLinks.length,
          })
        : [];
      const snapshots = spans.length
        ? await tx.snapshot.findMany({
            where: {
              id: { in: spans.map((span) => span.snapshotId) },
              workspaceId: ctx.workspace.id,
              missionId,
            },
            take: spans.length,
          })
        : [];
      const sources = snapshots.length
        ? await tx.evidenceSource.findMany({
            where: {
              id: { in: snapshots.map((snapshot) => snapshot.evidenceSourceId) },
              workspaceId: ctx.workspace.id,
              missionId,
            },
            take: snapshots.length,
          })
        : [];
      const latestVersionByClaim = new Map<string, { id: string }>();
      for (const version of latestVersionRows) {
        if (!latestVersionByClaim.has(version.claimId)) {
          latestVersionByClaim.set(version.claimId, { id: version.id });
        }
      }
      const honestNullByClaim = new Map<string, (typeof honestNullRows)[number]>();
      for (const honestNull of honestNullRows) {
        if (!honestNullByClaim.has(honestNull.claimId)) {
          honestNullByClaim.set(honestNull.claimId, honestNull);
        }
      }
      const claimById = new Map(claims.map((claim) => [claim.id, claim]));
      const sourceById = new Map(sources.map((source) => [source.id, source]));
      const snapshotById = new Map(
        snapshots.map((snapshot) => [
          snapshot.id,
          {
            ...snapshot,
            evidenceSource: sourceById.get(snapshot.evidenceSourceId)!,
          },
        ]),
      );
      const spanById = new Map(
        spans.map((span) => [
          span.id,
          { ...span, snapshot: snapshotById.get(span.snapshotId)! },
        ]),
      );
      const evidenceByVersion = new Map<string, Array<(typeof evidenceLinks)[number] & {
        evidenceSpan: (typeof spanById extends Map<string, infer T> ? T : never);
      }>>();
      for (const link of evidenceLinks) {
        const evidenceSpan = spanById.get(link.evidenceSpanId);
        if (!evidenceSpan?.snapshot.evidenceSource) {
          throw new VerificationGovernanceError(
            VerificationGovernanceErrorCode.NotFound,
            "Release evidence provenance was not found",
          );
        }
        const rows = evidenceByVersion.get(link.claimVersionId) ?? [];
        rows.push({ ...link, evidenceSpan });
        evidenceByVersion.set(link.claimVersionId, rows);
      }
      const claimVersions = claimVersionRows.map((version) => {
        const claim = claimById.get(version.claimId);
        if (!claim) {
          throw new VerificationGovernanceError(
            VerificationGovernanceErrorCode.NotFound,
            "Release claim was not found",
          );
        }
        return {
          ...version,
          claim: {
            ...claim,
            versions: latestVersionByClaim.has(claim.id)
              ? [latestVersionByClaim.get(claim.id)!]
              : [],
            honestNulls: honestNullByClaim.has(claim.id)
              ? [honestNullByClaim.get(claim.id)!]
              : [],
          },
          evidence: evidenceByVersion.get(version.id) ?? [],
        };
      });

      const assessments = claimVersions.map((version) => {
        const accessLevels: AccessLevel[] = [
          version.claim.accessLevel,
          version.accessLevel,
          ...version.evidence.map(
            (link) => link.evidenceSpan.snapshot.evidenceSource.accessLevel,
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

      const verifier = verifierAgentRun;
      const referencedArtifactIds = new Set([
        report.artifactId,
        verifier.inputArtifactId,
        ...(verifier.outputArtifactId ? [verifier.outputArtifactId] : []),
        ...requirementCoverage.flatMap(
          (item) => item.evidenceArtifactIds,
        ),
        ...scenarioResults.flatMap(
          (item) => item.evidenceArtifactIds,
        ),
        ...corruptionRuns.flatMap(
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
          ...signoffs
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
        .sort((a, b) => a.claimVersionId.localeCompare(b.claimVersionId));
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
          claimVersions: claimManifest as unknown as Prisma.InputJsonArray,
          artifacts: artifacts as unknown as Prisma.InputJsonArray,
          methods: manifestContent.methods,
          limitations: manifestContent.limitations,
          approverMembershipIds,
          contentHash: manifestHash,
        },
      });

      const gateRows = await tx.runtimeGate.findMany({
        where: { workspaceId: ctx.workspace.id, missionId },
      });
      const contractGates = gateRows.length
        ? await tx.contractGate.findMany({
            where: {
              id: { in: gateRows.map((gate) => gate.contractGateId) },
              workspaceId: ctx.workspace.id,
            },
            take: gateRows.length,
          })
        : [];
      const contractGateById = new Map(
        contractGates.map((gate) => [gate.id, gate]),
      );
      const gates = gateRows.map((gate) => ({
        ...gate,
        contractGate: contractGateById.get(gate.contractGateId)!,
      }));
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
