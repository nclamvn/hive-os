import { type AssuranceProfile, type DecisionType, Prisma } from "@prisma/client";

import type { DbClient, WorkspaceContext } from "@/modules/identity-workspace";
import { AuditEventType, writeAuditEvent } from "@/modules/identity-workspace";
import { getDb } from "@/server/db";

import { isAssuranceDowngrade } from "./assurance";
import { loadMission, requireMissionCapability } from "./context";
import { MissionError, MissionErrorCode } from "./errors";
import { waiveGateInTx } from "./gates";
import { internalTransition } from "./mission";
import { waiveObligationInTx } from "./obligations";

export interface RequestDecisionInput {
  decisionType: DecisionType;
  question: string;
  proposedAction: string;
  targetKind?: string;
  targetId?: string;
  proposedProfile?: AssuranceProfile;
}

export async function requestDecision(
  ctx: WorkspaceContext,
  missionId: string,
  input: RequestDecisionInput,
) {
  requireMissionCapability(ctx, "decisions.request");
  const mission = await loadMission(ctx, missionId);

  return getDb().$transaction(async (tx) => {
    const decision = await tx.decision.create({
      data: {
        workspaceId: ctx.workspace.id,
        missionId: mission.id,
        decisionType: input.decisionType,
        materiality: "MATERIAL",
        status: "REQUIRED",
        question: input.question,
        proposedAction: input.proposedAction,
        targetKind: input.targetKind ?? null,
        targetId: input.targetId ?? null,
        proposedProfile: input.proposedProfile ?? null,
        requestedByMembershipId: ctx.membership.id,
      },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.DecisionRequired,
      entityType: "Decision",
      entityId: decision.id,
      correlationId: ctx.correlationId,
      payload: { decisionType: input.decisionType },
    });
    return decision;
  });
}

/** Copy an approved contract into a new DRAFT version (amendment). */
async function createAmendmentVersion(
  tx: DbClient,
  ctx: WorkspaceContext,
  missionId: string,
  newProfile: AssuranceProfile | null,
): Promise<void> {
  const mission = await tx.mission.findFirstOrThrow({
    where: { id: missionId, workspaceId: ctx.workspace.id },
  });
  if (!mission.approvedContractId) {
    throw new MissionError(MissionErrorCode.Invariant, "No approved contract to amend");
  }
  const approved = await tx.missionContract.findUniqueOrThrow({
    where: { id: mission.approvedContractId },
    include: { requirements: true, obligationDefs: true, gateDefs: true, assumptions: true, constraints: true, inputs: true },
  });
  const max = await tx.missionContract.aggregate({
    where: { missionId },
    _max: { versionNumber: true },
  });
  const nextVersion = (max._max.versionNumber ?? approved.versionNumber) + 1;
  const profile = newProfile ?? approved.assuranceProfile;

  let draft;
  try {
    draft = await tx.missionContract.create({
      data: {
        workspaceId: ctx.workspace.id,
        missionId,
        versionNumber: nextVersion,
        status: "DRAFT",
        objective: approved.objective,
        scope: approved.scope,
        successDefinition: approved.successDefinition,
        assuranceProfile: profile,
        supersedesContractId: approved.id,
        createdByMembershipId: ctx.membership.id,
      },
    });
  } catch (error) {
    // Partial unique index: a DRAFT/IN_REVIEW contract already exists.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new MissionError(
        MissionErrorCode.CurrentContractExists,
        "A draft or in-review contract already exists for this mission",
      );
    }
    throw error;
  }
  for (const r of approved.requirements) {
    await tx.requirement.create({
      data: {
        workspaceId: ctx.workspace.id, contractId: draft.id, code: r.code, title: r.title,
        description: r.description, acceptanceCriteria: r.acceptanceCriteria, priority: r.priority, required: r.required,
      },
    });
  }
  for (const o of approved.obligationDefs) {
    await tx.contractObligation.create({
      data: {
        workspaceId: ctx.workspace.id, contractId: draft.id, code: o.code, title: o.title,
        description: o.description, weight: o.weight, required: o.required, closureRule: o.closureRule,
      },
    });
  }
  for (const g of approved.gateDefs) {
    await tx.contractGate.create({
      data: {
        workspaceId: ctx.workspace.id, contractId: draft.id, code: g.code, title: g.title,
        requiredBeforeStatus: g.requiredBeforeStatus, required: g.required, evaluationMode: g.evaluationMode,
      },
    });
  }
  await tx.mission.update({
    where: { id: missionId },
    data: { currentContractId: draft.id, version: { increment: 1 } },
  });
  await writeAuditEvent(tx, {
    workspaceId: ctx.workspace.id,
    actorUserId: ctx.user.id,
    actorMembershipId: ctx.membership.id,
    eventType: AuditEventType.ContractCreated,
    entityType: "MissionContract",
    entityId: draft.id,
    correlationId: ctx.correlationId,
    payload: { versionNumber: nextVersion },
  });
}

/**
 * Resolve a material decision. Approval applies the authorized governed action
 * atomically; rejection leaves governed state unchanged.
 */
export async function resolveDecision(
  ctx: WorkspaceContext,
  decisionId: string,
  approve: boolean,
  note: string,
): Promise<void> {
  requireMissionCapability(ctx, "decisions.resolve");

  await getDb().$transaction(async (tx) => {
    const decision = await tx.decision.findFirst({
      where: { id: decisionId, workspaceId: ctx.workspace.id },
    });
    if (!decision) throw new MissionError(MissionErrorCode.NotFound);
    if (decision.status !== "REQUIRED") {
      throw new MissionError(MissionErrorCode.Invariant, "Decision is already resolved");
    }
    await tx.$queryRaw`SELECT id FROM "mission" WHERE id = ${decision.missionId} FOR UPDATE`;

    await tx.decision.update({
      where: { id: decision.id },
      data: {
        status: approve ? "APPROVED" : "REJECTED",
        decidedByMembershipId: ctx.membership.id,
        decidedAt: new Date(),
        resolution: note,
        version: { increment: 1 },
      },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.DecisionResolved,
      entityType: "Decision",
      entityId: decision.id,
      correlationId: ctx.correlationId,
      payload: { decisionType: decision.decisionType, status: approve ? "APPROVED" : "REJECTED" },
    });

    if (!approve) return; // rejection changes no governed state

    const mission = await tx.mission.findFirstOrThrow({ where: { id: decision.missionId } });

    switch (decision.decisionType) {
      case "OBLIGATION_WAIVER":
        if (!decision.targetId) throw new MissionError(MissionErrorCode.Invariant, "Missing obligation target");
        await waiveObligationInTx(tx, ctx, decision.targetId, decision.id);
        return;
      case "GATE_WAIVER":
        if (!decision.targetId) throw new MissionError(MissionErrorCode.Invariant, "Missing gate target");
        await waiveGateInTx(tx, ctx, decision.targetId, decision.id);
        return;
      case "CANCELLATION":
        await internalTransition(tx, ctx, mission.id, mission.status, "CANCELLED", note, mission.version);
        return;
      case "REFUTATION":
        await internalTransition(tx, ctx, mission.id, mission.status, "REFUTED", note, mission.version);
        return;
      case "CONTRACT_AMENDMENT":
      case "SCOPE_CHANGE":
        await createAmendmentVersion(tx, ctx, mission.id, null);
        return;
      case "ASSURANCE_DOWNGRADE":
        await createAmendmentVersion(tx, ctx, mission.id, decision.proposedProfile ?? null);
        return;
      default:
        return;
    }
  });
}

// --- Convenience wrappers ---

export function requestObligationWaiver(ctx: WorkspaceContext, missionId: string, obligationId: string, reason: string) {
  requireMissionCapability(ctx, "obligations.waive");
  return requestDecision(ctx, missionId, {
    decisionType: "OBLIGATION_WAIVER",
    question: "Waive a required obligation?",
    proposedAction: reason,
    targetKind: "obligation",
    targetId: obligationId,
  });
}

export function requestGateWaiver(ctx: WorkspaceContext, missionId: string, gateId: string, reason: string) {
  requireMissionCapability(ctx, "gates.waive");
  return requestDecision(ctx, missionId, {
    decisionType: "GATE_WAIVER",
    question: "Waive a required gate?",
    proposedAction: reason,
    targetKind: "gate",
    targetId: gateId,
  });
}

export function requestCancellation(ctx: WorkspaceContext, missionId: string, reason: string) {
  return requestDecision(ctx, missionId, {
    decisionType: "CANCELLATION",
    question: "Cancel this mission?",
    proposedAction: reason,
  });
}

export async function requestAssuranceChange(
  ctx: WorkspaceContext,
  missionId: string,
  newProfile: AssuranceProfile,
  reason: string,
) {
  const mission = await loadMission(ctx, missionId);
  const downgrade = isAssuranceDowngrade(mission.assuranceProfile, newProfile);
  // Downgrades are always reserved to Owners.
  if (downgrade && ctx.membership.role !== "OWNER") {
    throw new MissionError(MissionErrorCode.Forbidden, "Assurance downgrade is reserved to Owners");
  }
  return requestDecision(ctx, missionId, {
    decisionType: downgrade ? "ASSURANCE_DOWNGRADE" : "CONTRACT_AMENDMENT",
    question: `Change assurance profile to ${newProfile}?`,
    proposedAction: reason,
    proposedProfile: newProfile,
  });
}

export async function listDecisionsRequired(ctx: WorkspaceContext) {
  requireMissionCapability(ctx, "decisions.read");
  return getDb().decision.findMany({
    where: { workspaceId: ctx.workspace.id, status: "REQUIRED" },
    orderBy: { createdAt: "desc" },
  });
}
