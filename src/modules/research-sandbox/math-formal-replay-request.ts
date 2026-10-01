import { randomUUID } from "node:crypto";

import { executeDurableCommand } from "@/modules/command-runtime";
import { requireWorkspaceAuthorization, organizationIdForWorkspace } from "@/modules/authorization";
import type { WorkspaceContext } from "@/modules/identity-workspace";
import { getEnv } from "@/server/env";
import { withOrganizationTenant } from "@/server/tenant-context";

import { ResearchSandboxError } from "./errors";
import { researchDossierDigest } from "./integrity";
import { validateRecordedMathFormalAttempt } from "./math-formal-record";

export async function requestMathPilotFormalReplay(ctx: WorkspaceContext, formalAttemptId: string) {
  await requireWorkspaceAuthorization(ctx, "research.request");
  if (!getEnv().MATH_PILOT_QUEUE_ENABLED || !getEnv().MATH_FORMAL_REPLAY_IMAGE) {
    throw new ResearchSandboxError("INVALID_TRANSITION", "Local fresh checker replay is not configured");
  }
  if (!formalAttemptId || formalAttemptId.length > 160) {
    throw new ResearchSandboxError("INVALID_INPUT", "Invalid formal attempt identity");
  }
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  const retryEligible = await withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    const prior = await tx.outboxEvent.findFirst({ where: { organizationId, workspaceId: ctx.workspace.id,
      topic: "math-pilot.formal-replay.check", aggregateType: "MathPilotFormalAttempt", aggregateId: formalAttemptId },
      select: { id: true } });
    if (!prior) return false;
    return Boolean(await tx.durableJob.findFirst({ where: { organizationId, outboxEventId: prior.id,
      jobType: "math-pilot.formal-replay.check", status: "DEAD_LETTER" }, select: { id: true } }));
  });
  return executeDurableCommand(ctx, {
    commandId: randomUUID(), commandType: "math-pilot.formal-replay.request",
    idempotencyKey: `math-formal-replay:${formalAttemptId}${retryEligible ? ":retry-1" : ""}`,
    requiredCapability: "research.request", payload: { formalAttemptId },
  }, async (tx) => {
    const attempt = await tx.mathPilotFormalAttempt.findFirst({
      where: { id: formalAttemptId, organizationId, workspaceId: ctx.workspace.id },
      include: { replay: true, case: { include: { researchRun: { include: {
        sources: { orderBy: [{ canonicalUri: "asc" }, { id: "asc" }] },
        findings: { include: { decision: true }, orderBy: [{ findingKey: "asc" }, { id: "asc" }] },
      } } } } },
    });
    if (!attempt || attempt.replay) throw new ResearchSandboxError("NOT_FOUND", "Replayable formal attempt not found");
    const pilotCase = attempt.case;
    const valid = validateRecordedMathFormalAttempt({ record: attempt,
      contractDigest: pilotCase.contractDigest,
      attemptDigest: pilotCase.researchRun.mathModelAttemptDigest,
      researchDigest: researchDossierDigest(pilotCase.researchRun) });
    if (!valid || valid.check.status !== "KERNEL_ACCEPTED_ALIGNMENT_PENDING") {
      throw new ResearchSandboxError("INTEGRITY_FAILURE", "A bound primary Lean check is required for replay");
    }
    const priorDispatches = await tx.outboxEvent.findMany({ where: { organizationId,
      workspaceId: ctx.workspace.id, topic: "math-pilot.formal-replay.check",
      aggregateType: "MathPilotFormalAttempt", aggregateId: formalAttemptId },
      select: { id: true }, take: 2 });
    if (priorDispatches.length > 1) throw new ResearchSandboxError("INVALID_TRANSITION", "Fresh replay retry ceiling reached");
    if (priorDispatches.length === 1) {
      const failedJob = await tx.durableJob.findFirst({ where: { organizationId,
        outboxEventId: priorDispatches[0]!.id, jobType: "math-pilot.formal-replay.check", status: "DEAD_LETTER" },
        select: { id: true } });
      if (!failedJob) throw new ResearchSandboxError("INVALID_TRANSITION", "A fresh replay is already active or retained");
    }
    return { outcome: { formalAttemptId, status: "QUEUED" }, outbox: [{ topic: "math-pilot.formal-replay.check",
      aggregateType: "MathPilotFormalAttempt", aggregateId: formalAttemptId, payload: { formalAttemptId } }] };
  });
}
