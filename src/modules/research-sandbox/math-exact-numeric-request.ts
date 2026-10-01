import { randomUUID } from "node:crypto";

import { executeDurableCommand } from "@/modules/command-runtime";
import { requireWorkspaceAuthorization, organizationIdForWorkspace } from "@/modules/authorization";
import type { WorkspaceContext } from "@/modules/identity-workspace";
import { getEnv } from "@/server/env";

import { mathModelAttemptSchema } from "./contracts";
import { ResearchSandboxError } from "./errors";
import { digestResearchResult } from "./integrity";
import { digestMathPilotContract, mathPilotContractSchema } from "./math-pilot";

export async function requestMathExactNumericVerification(ctx: WorkspaceContext, caseId: string) {
  await requireWorkspaceAuthorization(ctx, "research.request");
  if (!getEnv().RESEARCH_CODEX_LOCAL_ENABLED || !getEnv().MATH_EXACT_REPLAY_IMAGE) {
    throw new ResearchSandboxError("INVALID_TRANSITION", "Local fixed-tool verification is not configured");
  }
  if (!caseId || caseId.length > 160) throw new ResearchSandboxError("INVALID_INPUT", "Invalid mathematics case identity");
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  return executeDurableCommand(ctx, {
    commandId: randomUUID(), commandType: "math-pilot.numeric-verification.request",
    idempotencyKey: `math-numeric-verification:${caseId}`, requiredCapability: "research.request", payload: { caseId },
  }, async (tx) => {
    const pilotCase = await tx.mathPilotCase.findFirst({
      where: { id: caseId, organizationId, workspaceId: ctx.workspace.id },
      include: { researchRun: true, numericVerification: true },
    });
    if (!pilotCase || pilotCase.caseType !== "BENCHMARK_EXACT") {
      throw new ResearchSandboxError("NOT_FOUND", "Exact benchmark case not found");
    }
    const run = pilotCase.researchRun;
    const contract = mathPilotContractSchema.safeParse(pilotCase.contract);
    const attempt = mathModelAttemptSchema.safeParse(run.mathModelAttempt);
    if (pilotCase.numericVerification || !contract.success ||
      digestMathPilotContract(contract.data) !== pilotCase.contractDigest ||
      !attempt.success || !attempt.data.exactAnswer ||
      !run.mathModelAttemptDigest || digestResearchResult(attempt.data) !== run.mathModelAttemptDigest ||
      run.providerName !== "codex-local" || !["AWAITING_REVIEW", "APPROVED"].includes(run.status)) {
      throw new ResearchSandboxError("INVALID_TRANSITION", "A completed, integrity-valid local exact attempt is required");
    }
    const attemptJob = run.jobId ? await tx.durableJob.findFirst({
      where: { id: run.jobId, organizationId, status: "SUCCEEDED", jobType: "math-pilot.codex-local.execute" },
      select: { id: true, result: true },
    }) : null;
    if ((attemptJob?.result as Record<string, unknown> | null)?.mathModelAttemptDigest !== run.mathModelAttemptDigest) {
      throw new ResearchSandboxError("INTEGRITY_FAILURE", "Original model attempt job is not sealed");
    }
    const priorDispatch = await tx.outboxEvent.findFirst({
      where: { organizationId, workspaceId: ctx.workspace.id, topic: "math-pilot.exact-interval.verify",
        aggregateType: "MathPilotCase", aggregateId: caseId }, select: { id: true },
    });
    if (priorDispatch) throw new ResearchSandboxError("INVALID_TRANSITION", "Numeric verification is already queued");
    return {
      outcome: { caseId, status: "QUEUED" },
      outbox: [{ topic: "math-pilot.exact-interval.verify", aggregateType: "MathPilotCase", aggregateId: caseId, payload: { caseId } }],
    };
  });
}
