import type { GateResult } from "@prisma/client";

import type { DbClient, WorkspaceContext } from "@/modules/identity-workspace";
import { AuditEventType, writeAuditEvent } from "@/modules/identity-workspace";
import { getDb } from "@/server/db";

import { requireMissionCapability } from "./context";
import { MissionError, MissionErrorCode } from "./errors";

async function loadGate(ctx: WorkspaceContext, gateId: string) {
  const gate = await getDb().runtimeGate.findFirst({
    where: { id: gateId, workspaceId: ctx.workspace.id },
    include: { contractGate: true },
  });
  if (!gate) throw new MissionError(MissionErrorCode.NotFound);
  return gate;
}

/**
 * Evaluate a gate. Records an append-only GateRun and updates the runtime gate:
 * PASS→PASSED, FAIL→FAILED, INCOMPLETE→OPEN. INCOMPLETE never becomes PASSED.
 */
export async function evaluateGate(
  ctx: WorkspaceContext,
  gateId: string,
  result: GateResult,
  reason: string,
  linkedArtifactId?: string,
): Promise<void> {
  requireMissionCapability(ctx, "gates.evaluate");
  const gate = await loadGate(ctx, gateId);
  if (gate.status === "WAIVED") {
    throw new MissionError(MissionErrorCode.Invariant, "Gate is waived");
  }

  const nextStatus =
    result === "PASS" ? "PASSED" : result === "FAIL" ? "FAILED" : "OPEN";

  await getDb().$transaction(async (tx) => {
    await tx.gateRun.create({
      data: {
        workspaceId: ctx.workspace.id,
        missionId: gate.missionId,
        runtimeGateId: gate.id,
        result,
        actorType: "HUMAN_COMMAND",
        actorId: ctx.membership.id,
        reason,
        linkedArtifactId: linkedArtifactId ?? null,
      },
    });
    await tx.runtimeGate.update({
      where: { id: gate.id },
      data: { status: nextStatus, version: { increment: 1 } },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.GateEvaluated,
      entityType: "RuntimeGate",
      entityId: gate.id,
      correlationId: ctx.correlationId,
      payload: {
        code: gate.contractGate.code,
        result,
        reason,
        ...(linkedArtifactId ? { linkedArtifactId } : {}),
      },
    });
  });
}

/** Internal: waive a gate via an approved GATE_WAIVER decision. */
export async function waiveGateInTx(
  tx: DbClient,
  ctx: WorkspaceContext,
  gateId: string,
  decisionId: string,
): Promise<void> {
  const gate = await tx.runtimeGate.findFirst({
    where: { id: gateId, workspaceId: ctx.workspace.id },
    include: { contractGate: true },
  });
  if (!gate) throw new MissionError(MissionErrorCode.NotFound);
  await tx.runtimeGate.update({
    where: { id: gate.id },
    data: { status: "WAIVED", version: { increment: 1 } },
  });
  await writeAuditEvent(tx, {
    workspaceId: ctx.workspace.id,
    actorUserId: ctx.user.id,
    actorMembershipId: ctx.membership.id,
    eventType: AuditEventType.GateWaived,
    entityType: "RuntimeGate",
    entityId: gate.id,
    correlationId: ctx.correlationId,
    payload: { code: gate.contractGate.code, decisionId },
  });
}
