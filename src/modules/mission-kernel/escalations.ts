import type { WorkspaceContext } from "@/modules/identity-workspace";
import { AuditEventType, writeAuditEvent } from "@/modules/identity-workspace";
import { getDb } from "@/server/db";

import { requireMissionCapability } from "./context";
import { MissionError, MissionErrorCode } from "./errors";

async function loadEscalation(ctx: WorkspaceContext, id: string) {
  const escalation = await getDb().escalation.findFirst({
    where: { id, workspaceId: ctx.workspace.id },
  });
  if (!escalation) throw new MissionError(MissionErrorCode.NotFound);
  return escalation;
}

export async function acknowledgeEscalation(ctx: WorkspaceContext, id: string): Promise<void> {
  requireMissionCapability(ctx, "escalations.manage");
  const escalation = await loadEscalation(ctx, id);
  if (escalation.status !== "OPEN") return;
  await getDb().$transaction(async (tx) => {
    await tx.escalation.update({
      where: { id: escalation.id },
      data: { status: "ACKNOWLEDGED", acknowledgedByMembershipId: ctx.membership.id, version: { increment: 1 } },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.EscalationAcknowledged,
      entityType: "Escalation",
      entityId: escalation.id,
      correlationId: ctx.correlationId,
      payload: { severity: escalation.severity },
    });
  });
}

export async function resolveEscalation(ctx: WorkspaceContext, id: string): Promise<void> {
  requireMissionCapability(ctx, "escalations.manage");
  const escalation = await loadEscalation(ctx, id);
  if (escalation.status === "RESOLVED") return;
  await getDb().$transaction(async (tx) => {
    await tx.escalation.update({
      where: { id: escalation.id },
      data: { status: "RESOLVED", resolvedByMembershipId: ctx.membership.id, resolvedAt: new Date(), version: { increment: 1 } },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.EscalationResolved,
      entityType: "Escalation",
      entityId: escalation.id,
      correlationId: ctx.correlationId,
      payload: { severity: escalation.severity },
    });
  });
}
