import type { Prisma } from "@prisma/client";

import { withOrganizationTenant } from "@/server/tenant-context";
import { getEnv } from "@/server/env";

import { mathModelAttemptSchema } from "./contracts";
import { ResearchSandboxError } from "./errors";
import { digestResearchResult, researchDossierDigest } from "./integrity";
import { digestExactNumericAddendum } from "./math-exact-numeric-addendum";
import { exactIntervalSchema, validExactInterval, type ExactInterval } from "./math-exact-interval";
import { runExactInterval101Gon } from "./math-exact-interval-runner";
import { digestMathPilotContract, mathPilotContractSchema } from "./math-pilot";

interface NumericJobInput {
  organizationId: string; actorUserId: string; workerId: string; jobId: string; expectedVersion: number;
  verify?: (image: string) => Promise<ExactInterval>;
}

export async function executeMathExactNumericVerificationJob(input: NumericJobInput) {
  const loaded = await withOrganizationTenant(input.organizationId, input.actorUserId, async (tx) => {
    const job = await tx.durableJob.findFirst({
      where: { id: input.jobId, organizationId: input.organizationId, jobType: "math-pilot.exact-interval.verify",
        status: "RUNNING", lockedBy: input.workerId, version: input.expectedVersion, leaseExpiresAt: { gt: new Date() } },
    });
    if (!job || job.attempts !== 1) throw new ResearchSandboxError("JOB_CONFLICT", "Numeric verification lease is invalid");
    const payload = job.payload as Record<string, unknown>;
    if (typeof payload.caseId !== "string") throw new ResearchSandboxError("INVALID_INPUT", "Numeric verification has no case identity");
    const pilotCase = await tx.mathPilotCase.findFirst({
      where: { id: payload.caseId, organizationId: input.organizationId, workspaceId: job.workspaceId! },
      include: { numericVerification: true, researchRun: { include: {
        sources: { orderBy: [{ canonicalUri: "asc" }, { id: "asc" }] },
        findings: { include: { decision: true }, orderBy: [{ findingKey: "asc" }, { id: "asc" }] },
      } } },
    });
    if (!pilotCase || pilotCase.caseType !== "BENCHMARK_EXACT" || pilotCase.numericVerification) {
      throw new ResearchSandboxError("INVALID_TRANSITION", "Exact case is missing or already verified");
    }
    const run = pilotCase.researchRun;
    const contract = mathPilotContractSchema.safeParse(pilotCase.contract);
    const attempt = mathModelAttemptSchema.safeParse(run.mathModelAttempt);
    const attemptJob = run.jobId ? await tx.durableJob.findFirst({
      where: { id: run.jobId, organizationId: input.organizationId, status: "SUCCEEDED",
        jobType: "math-pilot.codex-local.execute" }, select: { result: true },
    }) : null;
    if (!contract.success || digestMathPilotContract(contract.data) !== pilotCase.contractDigest ||
      !attempt.success || !attempt.data.exactAnswer || !run.mathModelAttemptDigest ||
      digestResearchResult(attempt.data) !== run.mathModelAttemptDigest ||
      (attemptJob?.result as Record<string, unknown> | null)?.mathModelAttemptDigest !== run.mathModelAttemptDigest ||
      run.providerName !== "codex-local" || !["AWAITING_REVIEW", "APPROVED"].includes(run.status)) {
      throw new ResearchSandboxError("INTEGRITY_FAILURE", "Sealed numeric verification inputs are invalid");
    }
    // A failed Docker attempt must not be silently retried as a new certificate.
    await tx.durableJob.update({ where: { id: job.id }, data: { maxAttempts: 1 } });
    return { caseId: pilotCase.id, contractDigest: pilotCase.contractDigest,
      attemptDigest: run.mathModelAttemptDigest, researchDigest: researchDossierDigest(run),
      claimedAnswer: attempt.data.exactAnswer };
  });

  const image = getEnv().MATH_EXACT_REPLAY_IMAGE;
  if (!image) throw new ResearchSandboxError("INVALID_TRANSITION", "Digest-pinned numeric image is missing");
  const certificate = exactIntervalSchema.parse(await (input.verify ?? ((pinnedImage) =>
    runExactInterval101Gon({ image: pinnedImage })))(image));
  if (!validExactInterval(certificate, loaded.claimedAnswer)) {
    throw new ResearchSandboxError("INTEGRITY_FAILURE", "Independent interval did not certify the claimed floor");
  }
  const certificateDigest = digestExactNumericAddendum(certificate);

  return withOrganizationTenant(input.organizationId, input.actorUserId, async (tx) => {
    await tx.$queryRaw`SELECT 1::INTEGER AS locked FROM pg_advisory_xact_lock(hashtextextended(${`${input.organizationId}:math-numeric:${loaded.caseId}`}, 0))`;
    const job = await tx.durableJob.findFirst({
      where: { id: input.jobId, organizationId: input.organizationId, jobType: "math-pilot.exact-interval.verify",
        status: "RUNNING", lockedBy: input.workerId, version: input.expectedVersion, leaseExpiresAt: { gt: new Date() } },
    });
    if (!job) throw new ResearchSandboxError("JOB_CONFLICT", "Numeric verification lease expired before retention");
    const pilotCase = await tx.mathPilotCase.findFirst({
      where: { id: loaded.caseId, organizationId: input.organizationId, workspaceId: job.workspaceId! },
      include: { numericVerification: true, researchRun: { include: {
        sources: { orderBy: [{ canonicalUri: "asc" }, { id: "asc" }] },
        findings: { include: { decision: true }, orderBy: [{ findingKey: "asc" }, { id: "asc" }] },
      } } },
    });
    if (!pilotCase || pilotCase.numericVerification || pilotCase.contractDigest !== loaded.contractDigest ||
      pilotCase.researchRun.mathModelAttemptDigest !== loaded.attemptDigest ||
      researchDossierDigest(pilotCase.researchRun) !== loaded.researchDigest) {
      throw new ResearchSandboxError("INTEGRITY_FAILURE", "Numeric verification inputs changed during execution");
    }
    const record = await tx.mathPilotNumericVerification.create({ data: {
      organizationId: input.organizationId, workspaceId: pilotCase.workspaceId, missionId: pilotCase.missionId,
      caseId: pilotCase.id, contractDigest: loaded.contractDigest, attemptDigest: loaded.attemptDigest,
      researchDigest: loaded.researchDigest, claimedAnswer: loaded.claimedAnswer,
      certificate: certificate as Prisma.InputJsonValue, certificateDigest, jobId: job.id,
    } });
    await tx.durableJob.update({ where: { id: job.id }, data: {
      status: "SUCCEEDED", result: { caseId: pilotCase.id, certificateDigest, floor: certificate.floor },
      lockedBy: null, leaseExpiresAt: null, completedAt: new Date(), version: { increment: 1 },
    } });
    await tx.durableJobEvent.create({ data: {
      organizationId: input.organizationId, workspaceId: pilotCase.workspaceId, jobId: job.id,
      eventType: "SUCCEEDED", attemptNumber: job.attempts, workerId: input.workerId,
    } });
    return record;
  });
}
