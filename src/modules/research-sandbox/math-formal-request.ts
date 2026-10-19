import { randomUUID } from "node:crypto";

import { executeDurableCommand } from "@/modules/command-runtime";
import { requireWorkspaceAuthorization, organizationIdForWorkspace } from "@/modules/authorization";
import type { WorkspaceContext } from "@/modules/identity-workspace";
import { getEnv } from "@/server/env";
import { withOrganizationTenant } from "@/server/tenant-context";

import { mathModelAttemptSchema } from "./contracts";
import { ResearchSandboxError } from "./errors";
import { digestResearchResult } from "./integrity";
import { formalClaimForContractDigest } from "./math-formal-claim";
import { PILOT_LEAN_IMAGE } from "./math-formal-check";
import { digestMathPilotContract, mathPilotContractSchema } from "./math-pilot";

export async function requestMathPilotFormalAttempt(ctx: WorkspaceContext, caseId: string) {
  await requireWorkspaceAuthorization(ctx, "research.request");
  if (!getEnv().RESEARCH_CODEX_LOCAL_ENABLED || getEnv().MATH_FORMAL_LEAN_IMAGE !== PILOT_LEAN_IMAGE) {
    throw new ResearchSandboxError("INVALID_TRANSITION", "Local formal proof pilot is not configured");
  }
  if (!caseId || caseId.length > 160) throw new ResearchSandboxError("INVALID_INPUT", "Invalid mathematics case identity");
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  const retryEligible = await withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    const prior = await tx.outboxEvent.findFirst({ where: { organizationId, workspaceId: ctx.workspace.id,
      topic: "math-pilot.formalize.check", aggregateType: "MathPilotCase", aggregateId: caseId },
      select: { id: true } });
    if (!prior) return false;
    return Boolean(await tx.durableJob.findFirst({ where: { organizationId, outboxEventId: prior.id,
      jobType: "math-pilot.formalize.check", status: "DEAD_LETTER" }, select: { id: true } }));
  });
  return executeDurableCommand(ctx, {
    commandId: randomUUID(), commandType: "math-pilot.formal-attempt.request",
    idempotencyKey: `math-formal-attempt:${caseId}${retryEligible ? ":retry-1" : ""}`,
    requiredCapability: "research.request", payload: { caseId },
  }, async (tx) => {
    const pilotCase = await tx.mathPilotCase.findFirst({
      where: { id: caseId, organizationId, workspaceId: ctx.workspace.id },
      include: { researchRun: true, formalAttempts: { select: { id: true }, take: 1 } },
    });
    if (!pilotCase || !["CALIBRATION_PROOF", "BENCHMARK_PROOF"].includes(pilotCase.caseType)) {
      throw new ResearchSandboxError("NOT_FOUND", "Supported formal proof case not found");
    }
    const run = pilotCase.researchRun;
    const contract = mathPilotContractSchema.safeParse(pilotCase.contract);
    const attempt = mathModelAttemptSchema.safeParse(run.mathModelAttempt);
    if (pilotCase.formalAttempts.length || !contract.success ||
      digestMathPilotContract(contract.data) !== pilotCase.contractDigest ||
      !formalClaimForContractDigest(pilotCase.contractDigest) ||
      !attempt.success || !run.mathModelAttemptDigest ||
      digestResearchResult(attempt.data) !== run.mathModelAttemptDigest ||
      run.providerName !== "codex-local" || !["AWAITING_REVIEW", "APPROVED"].includes(run.status)) {
      throw new ResearchSandboxError("INVALID_TRANSITION", "A completed, integrity-valid local proof attempt is required");
    }
    const attemptJob = run.jobId ? await tx.durableJob.findFirst({
      where: { id: run.jobId, organizationId, status: "SUCCEEDED", jobType: "math-pilot.codex-local.execute" },
      select: { result: true },
    }) : null;
    if ((attemptJob?.result as Record<string, unknown> | null)?.mathModelAttemptDigest !== run.mathModelAttemptDigest) {
      throw new ResearchSandboxError("INTEGRITY_FAILURE", "Original model attempt job is not sealed");
    }
    const priorDispatches = await tx.outboxEvent.findMany({
      where: { organizationId, workspaceId: ctx.workspace.id, topic: "math-pilot.formalize.check",
        aggregateType: "MathPilotCase", aggregateId: caseId }, select: { id: true }, take: 2,
    });
    if (priorDispatches.length > 1) throw new ResearchSandboxError("INVALID_TRANSITION", "Formal attempt retry ceiling reached");
    if (priorDispatches.length === 1) {
      const failedJob = await tx.durableJob.findFirst({ where: { organizationId,
        outboxEventId: priorDispatches[0]!.id, jobType: "math-pilot.formalize.check", status: "DEAD_LETTER" },
        select: { id: true } });
      if (!failedJob) throw new ResearchSandboxError("INVALID_TRANSITION", "A previous formal attempt is still active or retained");
    }
    return { outcome: { caseId, status: "QUEUED" }, outbox: [{ topic: "math-pilot.formalize.check",
      aggregateType: "MathPilotCase", aggregateId: caseId, payload: { caseId } }] };
  });
}
