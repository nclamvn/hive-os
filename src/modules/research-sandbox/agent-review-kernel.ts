import type { Prisma } from "@prisma/client";

import { AuditEventType, writeAuditEvent } from "@/modules/identity-workspace";
import { withOrganizationTenant } from "@/server/tenant-context";
import { getEnv } from "@/server/env";

import { digestMathAgentLedger, evaluateMathAgentReview, mathAgentLedgerSchema, type MathAgentReport } from "./agent-review";
import { mathModelAttemptSchema } from "./contracts";
import { ResearchSandboxError } from "./errors";
import { digestResearchResult, researchDossierDigest } from "./integrity";
import { digestMathPilotContract, mathPilotContractSchema } from "./math-pilot";
import type { ExactReplay } from "./math-exact-replay";
import type { ExactInterval } from "./math-exact-interval";

interface AgentReviewJobInput {
  organizationId: string;
  actorUserId: string;
  workerId: string;
  jobId: string;
  expectedVersion: number;
  correlationId: string;
  reviewer: { modelName: string; roleModels?: { CRITIC: string; ADVERSARY: string };
    review: (contract: ReturnType<typeof mathPilotContractSchema.parse>,
    attempt: ReturnType<typeof mathModelAttemptSchema.parse>, exactReplay?: ExactReplay,
    exactInterval?: ExactInterval) => Promise<[MathAgentReport, MathAgentReport]> };
}

export async function executeMathPilotAgentReviewJob(input: AgentReviewJobInput) {
  const loaded = await withOrganizationTenant(input.organizationId, input.actorUserId, async (tx) => {
    const job = await tx.durableJob.findFirst({
      where: { id: input.jobId, organizationId: input.organizationId, jobType: "math-pilot.codex-local.review",
        status: "RUNNING", lockedBy: input.workerId, version: input.expectedVersion, leaseExpiresAt: { gt: new Date() } },
    });
    if (!job || job.attempts !== 1) throw new ResearchSandboxError("JOB_CONFLICT", "AI review lease or single-dispatch fence is invalid");
    const payload = job.payload as Record<string, unknown>;
    if (typeof payload.caseId !== "string") throw new ResearchSandboxError("INVALID_INPUT", "AI review job has no case identity");
    const pilotCase = await tx.mathPilotCase.findFirst({
      where: { id: payload.caseId, organizationId: input.organizationId, workspaceId: job.workspaceId! },
      include: { agentReview: true, researchRun: { include: {
        sources: { orderBy: [{ canonicalUri: "asc" }, { id: "asc" }] },
        findings: { include: { decision: true }, orderBy: [{ findingKey: "asc" }, { id: "asc" }] },
      } } },
    });
    if (!pilotCase || pilotCase.agentReview) throw new ResearchSandboxError("INVALID_TRANSITION", "AI review is missing or already retained");
    const run = pilotCase.researchRun;
    const attemptJob = run.jobId ? await tx.durableJob.findFirst({
      where: { id: run.jobId, organizationId: input.organizationId, status: "SUCCEEDED",
        jobType: "math-pilot.codex-local.execute" }, select: { id: true, result: true },
    }) : null;
    const contract = mathPilotContractSchema.safeParse(pilotCase.contract);
    const attempt = mathModelAttemptSchema.safeParse(run.mathModelAttempt);
    if (!["AWAITING_REVIEW", "APPROVED"].includes(run.status) || run.providerName !== "codex-local" ||
      !contract.success || digestMathPilotContract(contract.data) !== pilotCase.contractDigest ||
      !attemptJob || !attempt.success || digestResearchResult(attempt.data) !== run.mathModelAttemptDigest ||
      (attemptJob.result as Record<string, unknown> | null)?.mathModelAttemptDigest !== run.mathModelAttemptDigest ||
      attempt.data.modelName !== run.modelName) {
      throw new ResearchSandboxError("INTEGRITY_FAILURE", "Sealed AI review inputs are not valid");
    }
    // An expired lease must never trigger a second subscription-backed review.
    await tx.durableJob.update({ where: { id: job.id }, data: { maxAttempts: 1 } });
    return { caseId: pilotCase.id, runId: run.id, contract: contract.data, contractDigest: pilotCase.contractDigest,
      attempt: attempt.data, attemptDigest: run.mathModelAttemptDigest!, researchDigest: researchDossierDigest(run) };
  });

  const exactReplay = loaded.contract.caseType === "BENCHMARK_EXACT"
    ? await (await import("./math-exact-replay-runner")).runExactBenchmarkReplay({ code: loaded.attempt.computationPython,
      claimedAnswer: loaded.attempt.exactAnswer, image: getEnv().MATH_EXACT_REPLAY_IMAGE })
    : undefined;
  const exactInterval = loaded.contract.caseType === "BENCHMARK_EXACT"
    ? await (await import("./math-exact-interval-runner")).runExactInterval101Gon({ image: getEnv().MATH_EXACT_REPLAY_IMAGE })
    : undefined;
  const reports = await input.reviewer.review(loaded.contract, loaded.attempt, exactReplay, exactInterval);
  const verdict = evaluateMathAgentReview({ contract: loaded.contract, contractDigest: loaded.contractDigest,
    attempt: loaded.attempt, reports, exactReplay, exactInterval });
  const roleModels = input.reviewer.roleModels ?? {
    CRITIC: input.reviewer.modelName, ADVERSARY: input.reviewer.modelName,
  };
  const ledger = mathAgentLedgerSchema.parse({ version: 3,
    reviewerModels: reports.map((report) => ({ role: report.role,
      providerName: "codex-local", identityEvidence: "REQUESTED_CLI_MODEL",
      requestedModelName: roleModels[report.role], threadId: report.threadId })), reports,
    ...(exactReplay ? { exactReplay } : {}), ...(exactInterval ? { exactInterval } : {}), ...verdict });
  const ledgerDigest = digestMathAgentLedger(ledger);

  return withOrganizationTenant(input.organizationId, input.actorUserId, async (tx) => {
    await tx.$queryRaw`SELECT 1::INTEGER AS locked FROM pg_advisory_xact_lock(hashtextextended(${`${input.organizationId}:math-agent-review:${loaded.caseId}`}, 0))`;
    const job = await tx.durableJob.findFirst({
      where: { id: input.jobId, organizationId: input.organizationId, jobType: "math-pilot.codex-local.review",
        status: "RUNNING", lockedBy: input.workerId, version: input.expectedVersion, leaseExpiresAt: { gt: new Date() } },
    });
    if (!job) throw new ResearchSandboxError("JOB_CONFLICT", "AI review lease expired before retention");
    const pilotCase = await tx.mathPilotCase.findFirst({
      where: { id: loaded.caseId, organizationId: input.organizationId, workspaceId: job.workspaceId! },
      include: { agentReview: true, researchRun: { include: {
        sources: { orderBy: [{ canonicalUri: "asc" }, { id: "asc" }] },
        findings: { include: { decision: true }, orderBy: [{ findingKey: "asc" }, { id: "asc" }] },
      } } },
    });
    if (!pilotCase || pilotCase.agentReview || pilotCase.contractDigest !== loaded.contractDigest ||
      pilotCase.researchRun.mathModelAttemptDigest !== loaded.attemptDigest ||
      researchDossierDigest(pilotCase.researchRun) !== loaded.researchDigest) {
      throw new ResearchSandboxError("INTEGRITY_FAILURE", "AI review inputs changed during review");
    }
    const review = await tx.mathPilotAgentReview.create({ data: {
      organizationId: input.organizationId, workspaceId: pilotCase.workspaceId, missionId: pilotCase.missionId,
      caseId: pilotCase.id, conclusion: ledger.conclusion, disposition: ledger.disposition,
      contractDigest: loaded.contractDigest, attemptDigest: loaded.attemptDigest,
      researchDigest: loaded.researchDigest, ledger: ledger as Prisma.InputJsonValue,
      ledgerDigest, jobId: job.id,
    } });
    await writeAuditEvent(tx, {
      workspaceId: pilotCase.workspaceId, actorUserId: input.actorUserId,
      eventType: AuditEventType.MathPilotAgentReviewed, entityType: "MathPilotCase", entityId: pilotCase.id,
      correlationId: input.correlationId,
      payload: { caseId: pilotCase.id, runId: loaded.runId, disposition: ledger.disposition,
        conclusion: ledger.conclusion, ledgerDigest, attemptDigest: loaded.attemptDigest },
    });
    await tx.durableJob.update({ where: { id: job.id }, data: {
      status: "SUCCEEDED", result: { caseId: pilotCase.id, disposition: ledger.disposition, ledgerDigest },
      lockedBy: null, leaseExpiresAt: null, completedAt: new Date(), version: { increment: 1 },
    } });
    await tx.durableJobEvent.create({ data: {
      organizationId: input.organizationId, workspaceId: pilotCase.workspaceId, jobId: job.id,
      eventType: "SUCCEEDED", attemptNumber: job.attempts, workerId: input.workerId,
    } });
    return review;
  });
}
