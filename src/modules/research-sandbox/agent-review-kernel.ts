import { randomUUID } from "node:crypto";

import type { Prisma } from "@prisma/client";

import { executeDurableCommand } from "@/modules/command-runtime";
import { requireWorkspaceAuthorization, organizationIdForWorkspace } from "@/modules/authorization";
import { AuditEventType, type WorkspaceContext, writeAuditEvent } from "@/modules/identity-workspace";
import { withOrganizationTenant } from "@/server/tenant-context";
import { getEnv } from "@/server/env";

import { digestMathAgentLedger, evaluateMathAgentReview, mathAgentLedgerSchema, type MathAgentReport } from "./agent-review";
import { mathModelAttemptSchema } from "./contracts";
import { ResearchSandboxError } from "./errors";
import { digestResearchResult, researchDossierDigest } from "./integrity";
import { digestMathPilotContract, mathPilotContractSchema } from "./math-pilot";

export async function requestMathPilotAgentReview(ctx: WorkspaceContext, caseId: string) {
  await requireWorkspaceAuthorization(ctx, "research.request");
  if (!getEnv().RESEARCH_CODEX_LOCAL_ENABLED) {
    throw new ResearchSandboxError("INVALID_TRANSITION", "AI peer review is enabled only in the local Codex test runtime");
  }
  if (!caseId || caseId.length > 160) throw new ResearchSandboxError("INVALID_INPUT", "Invalid mathematics case identity");
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  return executeDurableCommand(ctx, {
    commandId: randomUUID(),
    commandType: "math-pilot.agent-review.request",
    idempotencyKey: `math-agent-review:${caseId}`,
    requiredCapability: "research.request",
    payload: { caseId },
  }, async (tx) => {
    const pilotCase = await tx.mathPilotCase.findFirst({
      where: { id: caseId, organizationId, workspaceId: ctx.workspace.id },
      include: { researchRun: true, agentReview: true },
    });
    if (!pilotCase) throw new ResearchSandboxError("NOT_FOUND", "Mathematics case not found");
    if (pilotCase.researchRun.providerName !== "codex-local" ||
      !["AWAITING_REVIEW", "APPROVED"].includes(pilotCase.researchRun.status) ||
      !pilotCase.researchRun.mathModelAttemptDigest || pilotCase.agentReview) {
      throw new ResearchSandboxError("INVALID_TRANSITION", "A completed, unreviewed local Codex attempt is required");
    }
    const attemptJob = pilotCase.researchRun.jobId ? await tx.durableJob.findFirst({
      where: { id: pilotCase.researchRun.jobId, organizationId, status: "SUCCEEDED",
        jobType: "math-pilot.codex-local.execute" }, select: { id: true },
    }) : null;
    if (!attemptJob) throw new ResearchSandboxError("INVALID_TRANSITION", "The original model attempt job must be complete");
    const priorDispatch = await tx.outboxEvent.findFirst({
      where: { organizationId, workspaceId: ctx.workspace.id, topic: "math-pilot.codex-local.review",
        aggregateType: "MathPilotCase", aggregateId: caseId }, select: { id: true },
    });
    if (priorDispatch) throw new ResearchSandboxError("INVALID_TRANSITION", "AI peer review is already queued for this case");
    return {
      outcome: { caseId, status: "QUEUED" },
      outbox: [{ topic: "math-pilot.codex-local.review", aggregateType: "MathPilotCase", aggregateId: caseId, payload: { caseId } }],
    };
  });
}

interface AgentReviewJobInput {
  organizationId: string;
  actorUserId: string;
  workerId: string;
  jobId: string;
  expectedVersion: number;
  correlationId: string;
  reviewer: { modelName: string; review: (contract: ReturnType<typeof mathPilotContractSchema.parse>,
    attempt: ReturnType<typeof mathModelAttemptSchema.parse>) => Promise<[MathAgentReport, MathAgentReport]> };
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
      attempt.data.modelName !== run.modelName || input.reviewer.modelName !== run.modelName) {
      throw new ResearchSandboxError("INTEGRITY_FAILURE", "Sealed AI review inputs are not valid");
    }
    // An expired lease must never trigger a second subscription-backed review.
    await tx.durableJob.update({ where: { id: job.id }, data: { maxAttempts: 1 } });
    return { caseId: pilotCase.id, runId: run.id, contract: contract.data, contractDigest: pilotCase.contractDigest,
      attempt: attempt.data, attemptDigest: run.mathModelAttemptDigest!, researchDigest: researchDossierDigest(run) };
  });

  const reports = await input.reviewer.review(loaded.contract, loaded.attempt);
  const verdict = evaluateMathAgentReview({ contract: loaded.contract, contractDigest: loaded.contractDigest, attempt: loaded.attempt, reports });
  const ledger = mathAgentLedgerSchema.parse({ version: 1, reviewerModelName: input.reviewer.modelName, reports, ...verdict });
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
