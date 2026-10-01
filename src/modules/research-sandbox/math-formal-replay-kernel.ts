import type { Prisma } from "@prisma/client";

import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { getEnv } from "@/server/env";
import { withOrganizationTenant } from "@/server/tenant-context";

import { ResearchSandboxError } from "./errors";
import { researchDossierDigest, sha256 } from "./integrity";
import { validateRecordedMathFormalAttempt } from "./math-formal-record";
import { formalReplaySchema } from "./math-formal-replay";
import { runFormalLeanReplay } from "./math-formal-replay-runner";

type ReplayJobInput = {
  organizationId: string; actorUserId: string; workerId: string; jobId: string; expectedVersion: number;
  replayer?: typeof runFormalLeanReplay;
};

/** Retain an independent kernel replay of a previously accepted exact source. */
export async function executeMathPilotFormalReplayJob(input: ReplayJobInput) {
  const imageId = getEnv().MATH_FORMAL_REPLAY_IMAGE;
  if (!imageId) throw new ResearchSandboxError("INVALID_TRANSITION", "Fresh checker image is not configured");
  const loaded = await withOrganizationTenant(input.organizationId, input.actorUserId, async (tx) => {
    const job = await tx.durableJob.findFirst({ where: { id: input.jobId,
      organizationId: input.organizationId, jobType: "math-pilot.formal-replay.check",
      status: "RUNNING", lockedBy: input.workerId, version: input.expectedVersion,
      leaseExpiresAt: { gt: new Date() } } });
    if (!job || job.attempts !== 1) throw new ResearchSandboxError("JOB_CONFLICT", "Fresh replay lease is invalid");
    const payload = job.payload as Record<string, unknown>;
    if (typeof payload.formalAttemptId !== "string") throw new ResearchSandboxError("INVALID_INPUT", "Fresh replay has no formal attempt identity");
    const attempt = await tx.mathPilotFormalAttempt.findFirst({
      where: { id: payload.formalAttemptId, organizationId: input.organizationId, workspaceId: job.workspaceId! },
      include: { replay: true, case: { include: { researchRun: { include: {
        sources: { orderBy: [{ canonicalUri: "asc" }, { id: "asc" }] },
        findings: { include: { decision: true }, orderBy: [{ findingKey: "asc" }, { id: "asc" }] },
      } } } } },
    });
    if (!attempt || attempt.replay) throw new ResearchSandboxError("INVALID_TRANSITION", "Formal attempt is absent or already replayed");
    const valid = validateRecordedMathFormalAttempt({ record: attempt,
      contractDigest: attempt.case.contractDigest,
      attemptDigest: attempt.case.researchRun.mathModelAttemptDigest,
      researchDigest: researchDossierDigest(attempt.case.researchRun) });
    if (!valid || valid.check.status !== "KERNEL_ACCEPTED_ALIGNMENT_PENDING") {
      throw new ResearchSandboxError("INTEGRITY_FAILURE", "Primary formal check is not retained and valid");
    }
    await tx.durableJob.update({ where: { id: job.id }, data: { maxAttempts: 1 } });
    return { formalAttemptId: attempt.id, caseId: attempt.caseId, contractDigest: attempt.contractDigest,
      attemptDigest: attempt.attemptDigest, researchDigest: attempt.researchDigest,
      targetDigest: attempt.targetDigest, sourceDigest: attempt.proofSourceDigest,
      primaryCheckDigest: attempt.checkDigest, target: valid.target, tactics: attempt.proofTactics,
      primaryCheck: valid.check };
  });

  const result = formalReplaySchema.parse(await (input.replayer ?? runFormalLeanReplay)({
    target: loaded.target, tactics: loaded.tactics, primaryCheck: loaded.primaryCheck, imageId,
  }));
  if (result.targetDigest !== loaded.targetDigest || result.sourceDigest !== loaded.sourceDigest ||
    result.primaryCheckDigest !== loaded.primaryCheckDigest || result.imageId !== imageId) {
    throw new ResearchSandboxError("INTEGRITY_FAILURE", "Fresh checker result does not bind the retained source");
  }
  if (result.status === "UNAVAILABLE") throw new ResearchSandboxError("INVALID_TRANSITION", "Fresh checker runtime was unavailable");
  const resultDigest = sha256(canonicalJson(result));

  return withOrganizationTenant(input.organizationId, input.actorUserId, async (tx) => {
    await tx.$queryRaw`SELECT 1::INTEGER AS locked FROM pg_advisory_xact_lock(hashtextextended(${`${input.organizationId}:math-formal-replay:${loaded.formalAttemptId}`}, 0))`;
    const job = await tx.durableJob.findFirst({ where: { id: input.jobId,
      organizationId: input.organizationId, jobType: "math-pilot.formal-replay.check",
      status: "RUNNING", lockedBy: input.workerId, version: input.expectedVersion,
      leaseExpiresAt: { gt: new Date() } } });
    if (!job) throw new ResearchSandboxError("JOB_CONFLICT", "Fresh replay lease expired before retention");
    const attempt = await tx.mathPilotFormalAttempt.findFirst({
      where: { id: loaded.formalAttemptId, organizationId: input.organizationId, workspaceId: job.workspaceId! },
      include: { replay: true, case: { include: { researchRun: { include: {
        sources: { orderBy: [{ canonicalUri: "asc" }, { id: "asc" }] },
        findings: { include: { decision: true }, orderBy: [{ findingKey: "asc" }, { id: "asc" }] },
      } } } } },
    });
    if (!attempt || attempt.replay || attempt.caseId !== loaded.caseId ||
      attempt.contractDigest !== loaded.contractDigest || attempt.attemptDigest !== loaded.attemptDigest ||
      attempt.researchDigest !== loaded.researchDigest || attempt.targetDigest !== loaded.targetDigest ||
      attempt.proofSourceDigest !== loaded.sourceDigest || attempt.checkDigest !== loaded.primaryCheckDigest ||
      researchDossierDigest(attempt.case.researchRun) !== loaded.researchDigest) {
      throw new ResearchSandboxError("INTEGRITY_FAILURE", "Formal source changed during fresh replay");
    }
    const record = await tx.mathPilotFormalReplay.create({ data: {
      organizationId: input.organizationId, workspaceId: attempt.workspaceId,
      missionId: attempt.missionId, caseId: attempt.caseId, formalAttemptId: attempt.id,
      contractDigest: loaded.contractDigest, targetDigest: loaded.targetDigest,
      sourceDigest: loaded.sourceDigest, primaryCheckDigest: loaded.primaryCheckDigest,
      result: result as Prisma.InputJsonValue, resultDigest, jobId: job.id,
    } });
    await tx.durableJob.update({ where: { id: job.id }, data: {
      status: "SUCCEEDED", result: { formalAttemptId: attempt.id, replayStatus: result.status, resultDigest },
      lockedBy: null, leaseExpiresAt: null, completedAt: new Date(), version: { increment: 1 },
    } });
    await tx.durableJobEvent.create({ data: {
      organizationId: input.organizationId, workspaceId: attempt.workspaceId,
      jobId: job.id, eventType: "SUCCEEDED", attemptNumber: job.attempts, workerId: input.workerId,
    } });
    return record;
  });
}
