import type { DbClient, WorkspaceContext } from "@/modules/identity-workspace";
import { AuditEventType, writeAuditEvent } from "@/modules/identity-workspace";
import { getDb } from "@/server/db";

import { requireMissionCapability } from "./context";
import { MissionError, MissionErrorCode } from "./errors";

async function loadObligation(ctx: WorkspaceContext, obligationId: string) {
  const obligation = await getDb().runtimeObligation.findFirst({
    where: { id: obligationId, workspaceId: ctx.workspace.id },
    include: { contractObligation: true },
  });
  if (!obligation) throw new MissionError(MissionErrorCode.NotFound);
  return obligation;
}

/** Ordinary progress update: OPEN → IN_PROGRESS → SATISFIED, or → BLOCKED. */
export async function updateObligationStatus(
  ctx: WorkspaceContext,
  obligationId: string,
  next: "IN_PROGRESS" | "SATISFIED" | "BLOCKED" | "OPEN",
  reason: string,
): Promise<void> {
  requireMissionCapability(ctx, "obligations.update");
  // WAIVED is never reachable through ordinary updates — it requires an
  // approved material Decision (see resolveDecision / OBLIGATION_WAIVER).
  if (!["IN_PROGRESS", "SATISFIED", "BLOCKED", "OPEN"].includes(next)) {
    throw new MissionError(
      MissionErrorCode.Invariant,
      "Waiving a required obligation requires an approved decision",
    );
  }
  const obligation = await loadObligation(ctx, obligationId);
  if (obligation.status === "WAIVED") {
    throw new MissionError(MissionErrorCode.Invariant, "Waived obligations are closed");
  }

  await getDb().$transaction(async (tx) => {
    await tx.runtimeObligation.update({
      where: { id: obligation.id },
      data: {
        status: next,
        closedByMembershipId: next === "SATISFIED" ? ctx.membership.id : null,
        closedAt: next === "SATISFIED" ? new Date() : null,
        closureReason: next === "SATISFIED" ? reason : null,
        version: { increment: 1 },
      },
    });
    const eventType =
      next === "SATISFIED"
        ? AuditEventType.ObligationSatisfied
        : next === "BLOCKED"
          ? AuditEventType.ObligationBlocked
          : AuditEventType.ObligationStarted;
    const payload =
      next === "SATISFIED" || next === "BLOCKED"
        ? { code: obligation.contractObligation.code, reason }
        : { code: obligation.contractObligation.code };
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType,
      entityType: "RuntimeObligation",
      entityId: obligation.id,
      correlationId: ctx.correlationId,
      payload,
    });
  });
}

/**
 * Internal: waive a required obligation. Only called by resolveDecision with an
 * approved OBLIGATION_WAIVER decision — never a direct public path.
 */
export async function waiveObligationInTx(
  tx: DbClient,
  ctx: WorkspaceContext,
  obligationId: string,
  decisionId: string,
): Promise<void> {
  const obligation = await tx.runtimeObligation.findFirst({
    where: { id: obligationId, workspaceId: ctx.workspace.id },
    include: { contractObligation: true },
  });
  if (!obligation) throw new MissionError(MissionErrorCode.NotFound);
  await tx.runtimeObligation.update({
    where: { id: obligation.id },
    data: {
      status: "WAIVED",
      closedByMembershipId: ctx.membership.id,
      closedAt: new Date(),
      closureReason: `waived by decision ${decisionId}`,
      version: { increment: 1 },
    },
  });
  await writeAuditEvent(tx, {
    workspaceId: ctx.workspace.id,
    actorUserId: ctx.user.id,
    actorMembershipId: ctx.membership.id,
    eventType: AuditEventType.ObligationWaived,
    entityType: "RuntimeObligation",
    entityId: obligation.id,
    correlationId: ctx.correlationId,
    payload: { code: obligation.contractObligation.code, decisionId },
  });
}
