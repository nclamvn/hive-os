import { randomUUID } from "node:crypto";

import { executeDurableCommand } from "@/modules/command-runtime";
import { requireWorkspaceAuthorization, organizationIdForWorkspace } from "@/modules/authorization";
import type { WorkspaceContext } from "@/modules/identity-workspace";
import { getEnv } from "@/server/env";

import { ResearchSandboxError } from "./errors";

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
