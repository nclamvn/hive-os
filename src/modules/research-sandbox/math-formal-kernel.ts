import type { Prisma } from "@prisma/client";

import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { withOrganizationTenant } from "@/server/tenant-context";
import { getEnv } from "@/server/env";

import { CodexLocalFormalizer } from "./adapters/codex-local-formalizer";
import { mathModelAttemptSchema } from "./contracts";
import { ResearchSandboxError } from "./errors";
import { digestResearchResult, researchDossierDigest, sha256 } from "./integrity";
import { formalCheckSchema, type FormalCheck } from "./math-formal-check";
import { runFormalLeanCheck } from "./math-formal-check-runner";
import { assembleFormalSource, formalClaimDigest, formalClaimForContractDigest, type FormalClaim } from "./math-formal-claim";
import { formalRepairTraceSchema, type FormalRepairTrace } from "./math-formal-record";
import { digestMathPilotContract, mathPilotContractSchema } from "./math-pilot";

type FormalizerResult = Awaited<ReturnType<CodexLocalFormalizer["formalize"]>>;

interface FormalJobInput {
  organizationId: string; actorUserId: string; workerId: string; jobId: string; expectedVersion: number;
  formalizer?: { modelName: string; formalize: (target: FormalClaim, argument: string,
    revision?: { priorTactics: string; compilerFeedback: string }) => Promise<FormalizerResult> };
  checker?: (target: FormalClaim, tactics: string, image: string) => Promise<FormalCheck>;
}

/** Immutable AI attempt + exploratory kernel check, never a root theorem verdict. */
export async function executeMathPilotFormalAttemptJob(input: FormalJobInput) {
  const loaded = await withOrganizationTenant(input.organizationId, input.actorUserId, async (tx) => {
    const job = await tx.durableJob.findFirst({
      where: { id: input.jobId, organizationId: input.organizationId, jobType: "math-pilot.formalize.check",
        status: "RUNNING", lockedBy: input.workerId, version: input.expectedVersion, leaseExpiresAt: { gt: new Date() } },
    });
    if (!job || job.attempts !== 1) throw new ResearchSandboxError("JOB_CONFLICT", "Formal attempt lease is invalid");
    const payload = job.payload as Record<string, unknown>;
    if (typeof payload.caseId !== "string") throw new ResearchSandboxError("INVALID_INPUT", "Formal attempt has no case identity");
    const pilotCase = await tx.mathPilotCase.findFirst({
      where: { id: payload.caseId, organizationId: input.organizationId, workspaceId: job.workspaceId! },
      include: { formalAttempts: { select: { id: true }, take: 1 }, researchRun: { include: {
        sources: { orderBy: [{ canonicalUri: "asc" }, { id: "asc" }] },
        findings: { include: { decision: true }, orderBy: [{ findingKey: "asc" }, { id: "asc" }] },
      } } },
    });
    if (!pilotCase || pilotCase.formalAttempts.length) throw new ResearchSandboxError("INVALID_TRANSITION", "Formal case is missing or already attempted");
    const run = pilotCase.researchRun;
    const contract = mathPilotContractSchema.safeParse(pilotCase.contract);
    const attempt = mathModelAttemptSchema.safeParse(run.mathModelAttempt);
    const target = formalClaimForContractDigest(pilotCase.contractDigest);
    const attemptJob = run.jobId ? await tx.durableJob.findFirst({
      where: { id: run.jobId, organizationId: input.organizationId, status: "SUCCEEDED",
        jobType: "math-pilot.codex-local.execute" }, select: { result: true },
    }) : null;
    if (!contract.success || digestMathPilotContract(contract.data) !== pilotCase.contractDigest || !target ||
      !attempt.success || !run.mathModelAttemptDigest || digestResearchResult(attempt.data) !== run.mathModelAttemptDigest ||
      (attemptJob?.result as Record<string, unknown> | null)?.mathModelAttemptDigest !== run.mathModelAttemptDigest ||
      run.providerName !== "codex-local" || !["AWAITING_REVIEW", "APPROVED"].includes(run.status) ||
      !["CALIBRATION_PROOF", "BENCHMARK_PROOF"].includes(pilotCase.caseType)) {
      throw new ResearchSandboxError("INTEGRITY_FAILURE", "Sealed formal attempt inputs are invalid");
    }
    await tx.durableJob.update({ where: { id: job.id }, data: { maxAttempts: 1 } });
    return { caseId: pilotCase.id, contractDigest: pilotCase.contractDigest,
      attemptDigest: run.mathModelAttemptDigest, researchDigest: researchDossierDigest(run),
      target, modelName: run.modelName, argument: attempt.data.argument };
  });

  const image = getEnv().MATH_FORMAL_LEAN_IMAGE;
  if (!image) throw new ResearchSandboxError("INVALID_TRANSITION", "Pinned Lean image is missing");
  const formalizer = input.formalizer ?? new CodexLocalFormalizer();
  if (formalizer.modelName !== loaded.modelName) throw new ResearchSandboxError("PROVIDER_MISMATCH", "Formalizer model differs from sealed case");
  const checker = input.checker ?? ((target: FormalClaim, tactics: string, pinnedImage: string) =>
    runFormalLeanCheck({ target, tactics, image: pinnedImage }));
  const trace: FormalRepairTrace = [];
  const inspect = async (candidate: FormalizerResult, round: 1 | 2) => {
    if (candidate.modelName !== loaded.modelName) throw new ResearchSandboxError("PROVIDER_MISMATCH", "Formalizer output model differs from sealed case");
    const proofSourceDigest = sha256(assembleFormalSource(loaded.target, candidate.proofTactics));
    const check = formalCheckSchema.parse(await checker(loaded.target, candidate.proofTactics, image));
    if (check.targetDigest !== formalClaimDigest(loaded.target) || check.sourceDigest !== proofSourceDigest ||
      check.image !== image) throw new ResearchSandboxError("INTEGRITY_FAILURE", "Formal checker output is not bound to the sealed target and candidate");
    const checkDigest = sha256(canonicalJson(check));
    trace.push({ kind: "CHECKED", round, modelThreadId: candidate.threadId,
      modelUsage: candidate.usage, proofTactics: candidate.proofTactics, check, checkDigest });
    return { candidate, check, checkDigest, proofSourceDigest };
  };
  let outcome = await inspect(await formalizer.formalize(loaded.target, loaded.argument), 1);
  if (outcome.check.reason === "COMPILER_ERROR" && outcome.check.compilerFeedback) {
    try {
      outcome = await inspect(await formalizer.formalize(loaded.target, loaded.argument, {
        priorTactics: outcome.candidate.proofTactics, compilerFeedback: outcome.check.compilerFeedback,
      }), 2);
    } catch (error) {
      if (error instanceof ResearchSandboxError && ["PROVIDER_MISMATCH", "INTEGRITY_FAILURE"].includes(error.code)) throw error;
      trace.push({ kind: "REPAIR_FAILED", round: 2, reason: "MODEL_CALL_FAILED" });
    }
  }
  formalRepairTraceSchema.parse(trace);
  const { candidate: generated, check, checkDigest, proofSourceDigest } = outcome;

  return withOrganizationTenant(input.organizationId, input.actorUserId, async (tx) => {
    await tx.$queryRaw`SELECT 1::INTEGER AS locked FROM pg_advisory_xact_lock(hashtextextended(${`${input.organizationId}:math-formal:${loaded.caseId}`}, 0))`;
    const job = await tx.durableJob.findFirst({
      where: { id: input.jobId, organizationId: input.organizationId, jobType: "math-pilot.formalize.check",
        status: "RUNNING", lockedBy: input.workerId, version: input.expectedVersion, leaseExpiresAt: { gt: new Date() } },
    });
    if (!job) throw new ResearchSandboxError("JOB_CONFLICT", "Formal attempt lease expired before retention");
    const pilotCase = await tx.mathPilotCase.findFirst({
      where: { id: loaded.caseId, organizationId: input.organizationId, workspaceId: job.workspaceId! },
      include: { formalAttempts: { select: { id: true }, take: 1 }, researchRun: { include: {
        sources: { orderBy: [{ canonicalUri: "asc" }, { id: "asc" }] },
        findings: { include: { decision: true }, orderBy: [{ findingKey: "asc" }, { id: "asc" }] },
      } } },
    });
    if (!pilotCase || pilotCase.formalAttempts.length || pilotCase.contractDigest !== loaded.contractDigest ||
      pilotCase.researchRun.mathModelAttemptDigest !== loaded.attemptDigest ||
      researchDossierDigest(pilotCase.researchRun) !== loaded.researchDigest) {
      throw new ResearchSandboxError("INTEGRITY_FAILURE", "Formal attempt inputs changed during execution");
    }
    const record = await tx.mathPilotFormalAttempt.create({ data: {
      organizationId: input.organizationId, workspaceId: pilotCase.workspaceId, missionId: pilotCase.missionId,
      caseId: pilotCase.id, contractDigest: loaded.contractDigest, attemptDigest: loaded.attemptDigest,
      researchDigest: loaded.researchDigest, target: loaded.target as Prisma.InputJsonValue,
      targetDigest: formalClaimDigest(loaded.target), proofTactics: generated.proofTactics,
      proofSourceDigest, modelName: generated.modelName, modelThreadId: generated.threadId,
      modelUsage: generated.usage as Prisma.InputJsonValue,
      repairTrace: trace as Prisma.InputJsonValue,
      check: check as Prisma.InputJsonValue, checkDigest, jobId: job.id,
    } });
    await tx.durableJob.update({ where: { id: job.id }, data: {
      status: "SUCCEEDED", result: { caseId: pilotCase.id, checkStatus: check.status, checkDigest },
      lockedBy: null, leaseExpiresAt: null, completedAt: new Date(), version: { increment: 1 },
    } });
    await tx.durableJobEvent.create({ data: {
      organizationId: input.organizationId, workspaceId: pilotCase.workspaceId, jobId: job.id,
      eventType: "SUCCEEDED", attemptNumber: job.attempts, workerId: input.workerId,
    } });
    return record;
  });
}
