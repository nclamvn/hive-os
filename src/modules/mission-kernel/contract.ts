import type {
  AssuranceProfile,
  ConstraintType,
  MissionInputType,
  RequirementPriority,
  Severity,
} from "@prisma/client";

import {
  AuditEventType,
  type DbClient,
  type WorkspaceContext,
  writeAuditEvent,
} from "@/modules/identity-workspace";
import { getDb } from "@/server/db";

import { assurancePolicy } from "./assurance";
import { requireMissionCapability } from "./context";
import { MissionError, MissionErrorCode } from "./errors";

type Tx = DbClient;

async function lockMission(tx: Tx, missionId: string): Promise<void> {
  await tx.$queryRaw`SELECT id FROM "mission" WHERE id = ${missionId} FOR UPDATE`;
}

/** The single current DRAFT/IN_REVIEW contract for a mission. */
async function currentContract(tx: Tx, missionId: string) {
  return tx.missionContract.findFirst({
    where: { missionId, status: { in: ["DRAFT", "IN_REVIEW"] } },
    orderBy: { versionNumber: "desc" },
  });
}

async function requireDraftContract(ctx: WorkspaceContext, contractId: string) {
  const contract = await getDb().missionContract.findFirst({
    where: { id: contractId, workspaceId: ctx.workspace.id },
  });
  if (!contract) throw new MissionError(MissionErrorCode.NotFound);
  if (contract.status !== "DRAFT") {
    throw new MissionError(
      MissionErrorCode.Invariant,
      "Only draft contracts can be edited",
    );
  }
  return contract;
}

/** Create the initial DRAFT contract (version 1) with assurance gate templates. */
export async function createInitialContract(
  tx: Tx,
  input: {
    workspaceId: string;
    missionId: string;
    membershipId: string;
    objective: string;
    scope: string;
    successDefinition: string;
    assuranceProfile: AssuranceProfile;
  },
) {
  const contract = await tx.missionContract.create({
    data: {
      workspaceId: input.workspaceId,
      missionId: input.missionId,
      versionNumber: 1,
      status: "DRAFT",
      objective: input.objective,
      scope: input.scope,
      successDefinition: input.successDefinition,
      assuranceProfile: input.assuranceProfile,
      createdByMembershipId: input.membershipId,
    },
  });
  await seedAssuranceGates(tx, contract.id, input.workspaceId, input.assuranceProfile);
  return contract;
}

async function seedAssuranceGates(
  tx: Tx,
  contractId: string,
  workspaceId: string,
  profile: AssuranceProfile,
) {
  const policy = assurancePolicy(profile);
  for (const gate of policy.gateTemplates) {
    await tx.contractGate.create({
      data: {
        workspaceId,
        contractId,
        code: gate.code,
        title: gate.title,
        requiredBeforeStatus: gate.requiredBeforeStatus,
        required: gate.required,
        evaluationMode: gate.evaluationMode,
      },
    });
  }
}

// --- Draft definition editing (DRAFT contracts only) ---

export async function addRequirement(
  ctx: WorkspaceContext,
  contractId: string,
  input: {
    code: string;
    title: string;
    description: string;
    acceptanceCriteria: string;
    priority?: RequirementPriority;
    required?: boolean;
  },
) {
  requireMissionCapability(ctx, "missions.update_draft");
  const contract = await requireDraftContract(ctx, contractId);
  return getDb().requirement.create({
    data: {
      workspaceId: ctx.workspace.id,
      contractId: contract.id,
      code: input.code,
      title: input.title,
      description: input.description,
      acceptanceCriteria: input.acceptanceCriteria,
      priority: input.priority ?? "MEDIUM",
      required: input.required ?? true,
    },
  });
}

export async function addObligation(
  ctx: WorkspaceContext,
  contractId: string,
  input: {
    code: string;
    title: string;
    description: string;
    weight: number;
    required?: boolean;
    closureRule: string;
  },
) {
  requireMissionCapability(ctx, "missions.update_draft");
  if (!Number.isInteger(input.weight) || input.weight <= 0) {
    throw new MissionError(
      MissionErrorCode.Invariant,
      "Obligation weight must be a positive integer",
    );
  }
  const contract = await requireDraftContract(ctx, contractId);
  return getDb().contractObligation.create({
    data: {
      workspaceId: ctx.workspace.id,
      contractId: contract.id,
      code: input.code,
      title: input.title,
      description: input.description,
      weight: input.weight,
      required: input.required ?? true,
      closureRule: input.closureRule,
    },
  });
}

export async function addConstraint(
  ctx: WorkspaceContext,
  contractId: string,
  input: { statement: string; constraintType?: ConstraintType; severity?: Severity },
) {
  requireMissionCapability(ctx, "missions.update_draft");
  const contract = await requireDraftContract(ctx, contractId);
  return getDb().constraint.create({
    data: {
      workspaceId: ctx.workspace.id,
      contractId: contract.id,
      statement: input.statement,
      constraintType: input.constraintType ?? "OTHER",
      severity: input.severity ?? "MEDIUM",
    },
  });
}

export async function addAssumption(
  ctx: WorkspaceContext,
  contractId: string,
  input: { statement: string; validationMethod?: string },
) {
  requireMissionCapability(ctx, "missions.update_draft");
  const contract = await requireDraftContract(ctx, contractId);
  return getDb().assumption.create({
    data: {
      workspaceId: ctx.workspace.id,
      contractId: contract.id,
      statement: input.statement,
      validationMethod: input.validationMethod ?? null,
    },
  });
}

export async function addInput(
  ctx: WorkspaceContext,
  contractId: string,
  input: { label: string; description: string; inputType?: MissionInputType },
) {
  requireMissionCapability(ctx, "missions.update_draft");
  const contract = await requireDraftContract(ctx, contractId);
  return getDb().missionInput.create({
    data: {
      workspaceId: ctx.workspace.id,
      contractId: contract.id,
      label: input.label,
      description: input.description,
      inputType: input.inputType ?? "TEXT",
    },
  });
}

// --- Completeness ---

export interface Completeness {
  ok: boolean;
  issues: string[];
}

const MAX_CONTRACT_DEFINITION_ROWS = 10_000;

export async function evaluateCompleteness(
  tx: Tx,
  contractId: string,
): Promise<Completeness> {
  const contract = await tx.missionContract.findUniqueOrThrow({
    where: { id: contractId },
  });
  // Prisma may expand relation includes into concurrent queries. Interactive
  // transactions use a single pg client, so load each relation explicitly and
  // sequentially to preserve the driver's one-query-at-a-time contract.
  const requirements = await tx.requirement.findMany({
    where: { contractId },
    select: { code: true },
    take: MAX_CONTRACT_DEFINITION_ROWS + 1,
  });
  const obligationDefs = await tx.contractObligation.findMany({
    where: { contractId },
    select: { code: true, weight: true },
    take: MAX_CONTRACT_DEFINITION_ROWS + 1,
  });
  const gateDefs = await tx.contractGate.findMany({
    where: { contractId },
    select: { code: true },
    take: MAX_CONTRACT_DEFINITION_ROWS + 1,
  });
  const policy = assurancePolicy(contract.assuranceProfile);
  const issues: string[] = [];

  if (!contract.objective.trim()) issues.push("objective is empty");
  if (!contract.scope.trim()) issues.push("scope is empty");
  if (!contract.successDefinition.trim()) issues.push("success definition is empty");
  if (
    requirements.length > MAX_CONTRACT_DEFINITION_ROWS ||
    obligationDefs.length > MAX_CONTRACT_DEFINITION_ROWS ||
    gateDefs.length > MAX_CONTRACT_DEFINITION_ROWS
  ) {
    issues.push("contract definition row limit exceeded");
  }

  const requiredRequirements = requirements.length;
  if (requiredRequirements < policy.minRequirements) {
    issues.push(`at least ${policy.minRequirements} requirement(s) needed`);
  }
  if (obligationDefs.length < policy.minObligations) {
    issues.push(`at least ${policy.minObligations} obligation(s) needed`);
  }
  const totalWeight = obligationDefs.reduce((s, o) => s + o.weight, 0);
  if (totalWeight <= 0) issues.push("total obligation weight must be > 0");

  // Duplicate codes (Prisma unique also guards, this yields a friendly error).
  assertNoDuplicates(requirements.map((r) => r.code), issues, "requirement");
  assertNoDuplicates(obligationDefs.map((o) => o.code), issues, "obligation");
  assertNoDuplicates(gateDefs.map((g) => g.code), issues, "gate");

  return { ok: issues.length === 0, issues };
}

function assertNoDuplicates(codes: string[], issues: string[], label: string) {
  const seen = new Set<string>();
  for (const code of codes) {
    if (seen.has(code)) issues.push(`duplicate ${label} code: ${code}`);
    seen.add(code);
  }
}

// --- Submission ---

export async function submitContract(
  ctx: WorkspaceContext,
  missionId: string,
): Promise<void> {
  requireMissionCapability(ctx, "missions.submit_contract");
  await getDb().$transaction(async (tx) => {
    await lockMission(tx, missionId);
    const mission = await tx.mission.findFirst({
      where: { id: missionId, workspaceId: ctx.workspace.id },
    });
    if (!mission) throw new MissionError(MissionErrorCode.NotFound);
    if (mission.status !== "SCOPED") {
      throw new MissionError(
        MissionErrorCode.InvalidTransition,
        "A contract can only be submitted from SCOPED",
      );
    }
    const contract = await currentContract(tx, missionId);
    if (!contract || contract.status !== "DRAFT") {
      throw new MissionError(MissionErrorCode.Invariant, "No draft contract to submit");
    }
    const completeness = await evaluateCompleteness(tx, contract.id);
    if (!completeness.ok) {
      throw new MissionError(
        MissionErrorCode.ContractIncomplete,
        completeness.issues.join("; "),
      );
    }
    await tx.missionContract.update({
      where: { id: contract.id },
      data: {
        status: "IN_REVIEW",
        submittedByMembershipId: ctx.membership.id,
        submittedAt: new Date(),
        version: { increment: 1 },
      },
    });
    await tx.mission.update({
      where: { id: mission.id },
      data: { status: "CONTRACT_REVIEW", version: { increment: 1 } },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.ContractSubmitted,
      entityType: "MissionContract",
      entityId: contract.id,
      correlationId: ctx.correlationId,
      payload: { versionNumber: contract.versionNumber },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.MissionTransitioned,
      entityType: "Mission",
      entityId: mission.id,
      correlationId: ctx.correlationId,
      payload: { from: "SCOPED", to: "CONTRACT_REVIEW", reason: "contract submitted", version: mission.version },
    });
  });
}

// --- Approval (atomic) ---

export async function approveContract(
  ctx: WorkspaceContext,
  missionId: string,
): Promise<void> {
  requireMissionCapability(ctx, "missions.approve_contract");
  await getDb().$transaction(async (tx) => {
    await lockMission(tx, missionId);
    const mission = await tx.mission.findFirst({
      where: { id: missionId, workspaceId: ctx.workspace.id },
    });
    if (!mission) throw new MissionError(MissionErrorCode.NotFound);

    const contract = await tx.missionContract.findFirst({
      where: { missionId, status: "IN_REVIEW" },
    });
    if (!contract) {
      // Already approved? Fail closed without duplicating anything.
      const approved = await tx.missionContract.findFirst({
        where: { missionId, status: "APPROVED" },
      });
      if (approved) {
        throw new MissionError(MissionErrorCode.ContractAlreadyApproved);
      }
      throw new MissionError(MissionErrorCode.Invariant, "No contract in review");
    }
    if (mission.status !== "CONTRACT_REVIEW") {
      throw new MissionError(MissionErrorCode.InvalidTransition, "Mission is not in review");
    }

    const obligationDefs = await tx.contractObligation.findMany({
      where: { contractId: contract.id },
      take: MAX_CONTRACT_DEFINITION_ROWS + 1,
    });
    const gateDefs = await tx.contractGate.findMany({
      where: { contractId: contract.id },
      take: MAX_CONTRACT_DEFINITION_ROWS + 1,
    });

    // Regulated missions may only be approved by an Owner.
    const policy = assurancePolicy(contract.assuranceProfile);
    if (policy.approvalOwnerOnly && ctx.membership.role !== "OWNER") {
      throw new MissionError(
        MissionErrorCode.Forbidden,
        "Regulated missions can only be approved by an Owner",
      );
    }

    const completeness = await evaluateCompleteness(tx, contract.id);
    if (!completeness.ok) {
      throw new MissionError(MissionErrorCode.ContractIncomplete, completeness.issues.join("; "));
    }

    await tx.missionContract.update({
      where: { id: contract.id },
      data: {
        status: "APPROVED",
        approvedByMembershipId: ctx.membership.id,
        approvedAt: new Date(),
        version: { increment: 1 },
      },
    });

    // Runtime obligations + gates from immutable definitions.
    for (const def of obligationDefs) {
      await tx.runtimeObligation.create({
        data: {
          workspaceId: ctx.workspace.id,
          missionId,
          contractObligationId: def.id,
          status: "OPEN",
        },
      });
    }
    for (const def of gateDefs) {
      await tx.runtimeGate.create({
        data: {
          workspaceId: ctx.workspace.id,
          missionId,
          contractGateId: def.id,
          status: "OPEN",
        },
      });
    }

    // Supersede a prior approved contract if this is an amendment.
    if (contract.supersedesContractId) {
      await tx.missionContract.update({
        where: { id: contract.supersedesContractId },
        data: { status: "SUPERSEDED" },
      });
    }

    await tx.mission.update({
      where: { id: mission.id },
      data: {
        status: "APPROVED",
        approvedContractId: contract.id,
        currentContractId: contract.id,
        version: { increment: 1 },
      },
    });

    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.ContractApproved,
      entityType: "MissionContract",
      entityId: contract.id,
      correlationId: ctx.correlationId,
      payload: { versionNumber: contract.versionNumber },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.MissionTransitioned,
      entityType: "Mission",
      entityId: mission.id,
      correlationId: ctx.correlationId,
      payload: { from: "CONTRACT_REVIEW", to: "APPROVED", reason: "contract approved", version: mission.version },
    });
  });
}
