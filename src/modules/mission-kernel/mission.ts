import {
  type AssuranceProfile,
  type MissionStatus,
  Prisma,
} from "@prisma/client";

import {
  AuditEventType,
  type DbClient,
  getWorkspacePolicy,
  type WorkspaceContext,
  writeAuditEvent,
} from "@/modules/identity-workspace";
import { getDb } from "@/server/db";

import { createInitialContract } from "./contract";
import { loadMission, requireMissionCapability } from "./context";
import { MissionError, MissionErrorCode } from "./errors";
import { computeProgress, type Progress } from "./progress";
import { classifyTransition } from "./state-machine";

type Tx = DbClient;

async function lockMission(tx: Tx, missionId: string): Promise<void> {
  await tx.$queryRaw`SELECT id FROM "mission" WHERE id = ${missionId} FOR UPDATE`;
}

export interface CreateMissionInput {
  title: string;
  assuranceProfile?: AssuranceProfile;
  objective?: string;
  scope?: string;
  successDefinition?: string;
  idempotencyKey?: string;
}

export async function createMission(
  ctx: WorkspaceContext,
  input: CreateMissionInput,
) {
  requireMissionCapability(ctx, "missions.create");
  const profile =
    input.assuranceProfile ??
    (await getWorkspacePolicy(ctx)).defaultAssuranceProfile;
  const key = input.idempotencyKey ?? null;

  if (key) {
    const existing = await getDb().mission.findUnique({
      where: {
        workspaceId_idempotencyKey: {
          workspaceId: ctx.workspace.id,
          idempotencyKey: key,
        },
      },
    });
    if (existing) return existing;
  }

  try {
    return await getDb().$transaction(async (tx) => {
      // Concurrency-safe per-workspace reference code.
      const rows = await tx.$queryRaw<{ next_ref: number }[]>`
        INSERT INTO "workspace_mission_counter" (workspace_id, next_ref)
        VALUES (${ctx.workspace.id}, 2)
        ON CONFLICT (workspace_id)
        DO UPDATE SET next_ref = "workspace_mission_counter".next_ref + 1
        RETURNING next_ref`;
      const allocated = Number(rows[0].next_ref) - 1;
      const referenceCode = `M-${String(allocated).padStart(4, "0")}`;

      const mission = await tx.mission.create({
        data: {
          workspaceId: ctx.workspace.id,
          referenceCode,
          title: input.title,
          status: "DRAFT",
          assuranceProfile: profile,
          idempotencyKey: key,
          createdByMembershipId: ctx.membership.id,
        },
      });
      const contract = await createInitialContract(tx, {
        workspaceId: ctx.workspace.id,
        missionId: mission.id,
        membershipId: ctx.membership.id,
        objective: input.objective ?? "",
        scope: input.scope ?? "",
        successDefinition: input.successDefinition ?? "",
        assuranceProfile: profile,
      });
      const withContract = await tx.mission.update({
        where: { id: mission.id },
        data: { currentContractId: contract.id },
      });
      await writeAuditEvent(tx, {
        workspaceId: ctx.workspace.id,
        actorUserId: ctx.user.id,
        actorMembershipId: ctx.membership.id,
        eventType: AuditEventType.MissionCreated,
        entityType: "Mission",
        entityId: mission.id,
        correlationId: ctx.correlationId,
        payload: {
          referenceCode,
          title: input.title,
          assuranceProfile: profile,
        },
      });
      return withContract;
    });
  } catch (error) {
    // Idempotency race: another request created the mission with this key.
    if (
      key &&
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const existing = await getDb().mission.findUnique({
        where: {
          workspaceId_idempotencyKey: {
            workspaceId: ctx.workspace.id,
            idempotencyKey: key,
          },
        },
      });
      if (existing) return existing;
    }
    throw error;
  }
}

/** Internal: apply a governed status change with audit inside a transaction. */
export async function internalTransition(
  tx: Tx,
  ctx: WorkspaceContext,
  missionId: string,
  from: MissionStatus,
  to: MissionStatus,
  reason: string,
  version: number,
): Promise<void> {
  await tx.mission.update({
    where: { id: missionId },
    data: { status: to, version: { increment: 1 } },
  });
  await writeAuditEvent(tx, {
    workspaceId: ctx.workspace.id,
    actorUserId: ctx.user.id,
    actorMembershipId: ctx.membership.id,
    eventType: AuditEventType.MissionTransitioned,
    entityType: "Mission",
    entityId: missionId,
    correlationId: ctx.correlationId,
    payload: { from, to, reason, version },
  });
}

export interface TransitionOptions {
  reason: string;
  expectedVersion?: number;
}

/**
 * Publicly executable Mission transitions include the kernel-governed
 * execution, verification, and release path. CONTRACT_REVIEW and APPROVED are
 * reached via submitContract/approveContract; decision-gated side states
 * (CANCELLED/PARTIAL/REFUTED) are reached via resolveDecision.
 */
export async function transitionMission(
  ctx: WorkspaceContext,
  missionId: string,
  to: MissionStatus,
  options: TransitionOptions,
): Promise<void> {
  requireMissionCapability(ctx, "missions.transition");
  if (!options.reason?.trim()) {
    throw new MissionError(
      MissionErrorCode.Invariant,
      "A transition reason is required",
    );
  }

  await getDb().$transaction(async (tx) => {
    await lockMission(tx, missionId);
    const mission = await tx.mission.findFirst({
      where: { id: missionId, workspaceId: ctx.workspace.id },
    });
    if (!mission) throw new MissionError(MissionErrorCode.NotFound);
    if (
      options.expectedVersion !== undefined &&
      mission.version !== options.expectedVersion
    ) {
      throw new MissionError(MissionErrorCode.MissionVersionConflict);
    }

    const rule = classifyTransition(mission.status, to);

    // The forward path into review/approval goes through submit/approve, but a
    // resume back to a recorded APPROVED prior state is legitimate.
    if (
      rule.kind === "primary" &&
      (to === "CONTRACT_REVIEW" || to === "APPROVED")
    ) {
      throw new MissionError(
        MissionErrorCode.InvalidTransition,
        "Use submitContract/approveContract for review and approval",
      );
    }

    switch (rule.kind) {
      case "primary":
        await internalTransition(
          tx,
          ctx,
          mission.id,
          mission.status,
          to,
          options.reason,
          mission.version,
        );
        return;

      case "execution": {
        const [
          tipCount,
          unreadyTipCount,
          openMaterialDeviationCount,
          awaitingReportCount,
        ] = await Promise.all([
          tx.executionTip.count({
            where: { workspaceId: ctx.workspace.id, missionId: mission.id },
          }),
          tx.executionTip.count({
            where: {
              workspaceId: ctx.workspace.id,
              missionId: mission.id,
              status: { not: "DONE" },
            },
          }),
          tx.executionDeviation.count({
            where: {
              workspaceId: ctx.workspace.id,
              missionId: mission.id,
              status: "OPEN",
              materiality: "MATERIAL",
            },
          }),
          tx.agentRun.count({
            where: {
              workspaceId: ctx.workspace.id,
              missionId: mission.id,
              status: "AWAITING_REPORT",
            },
          }),
        ]);
        if (
          tipCount === 0 ||
          unreadyTipCount > 0 ||
          openMaterialDeviationCount > 0 ||
          awaitingReportCount > 0
        ) {
          throw new MissionError(
            MissionErrorCode.ExecutionFabricRequired,
            "Execution readiness requires completed TIPs, imported reports, and no open material deviations",
          );
        }
        await internalTransition(
          tx,
          ctx,
          mission.id,
          mission.status,
          to,
          options.reason,
          mission.version,
        );
        return;
      }

      case "verification": {
        if (mission.status === "BUILDING" && to === "VERIFYING") {
          const activeRun = await tx.verificationRun.findFirst({
            where: {
              workspaceId: ctx.workspace.id,
              missionId: mission.id,
              status: "IN_PROGRESS",
            },
            select: { id: true },
          });
          if (!activeRun) {
            throw new MissionError(
              MissionErrorCode.VerificationKernelRequired,
              "Use beginVerificationRun to enter verification atomically",
            );
          }
        } else {
          const report = await tx.verificationReport.findFirst({
            where: {
              workspaceId: ctx.workspace.id,
              missionId: mission.id,
              overallStatus: { not: "NOT_READY" },
            },
            orderBy: { createdAt: "desc" },
            include: {
              verificationRun: true,
              signoffs: true,
            },
          });
          const requiresGovernance =
            mission.assuranceProfile === "RESEARCH" ||
            mission.assuranceProfile === "REGULATED";
          const rejected = report?.signoffs.some(
            (signoff) => signoff.decision === "REJECTED",
          );
          const approved = report?.signoffs.some(
            (signoff) =>
              signoff.signoffType === "VERIFICATION" &&
              signoff.decision === "APPROVED",
          );
          if (
            !report ||
            (requiresGovernance &&
              (report.verificationRun.independenceStatus !== "INDEPENDENT" ||
                !approved)) ||
            rejected
          ) {
            throw new MissionError(
              MissionErrorCode.VerificationKernelRequired,
              "Review requires a ready Verify Report, required independence, and approval with no rejected sign-off",
            );
          }
        }
        await internalTransition(
          tx,
          ctx,
          mission.id,
          mission.status,
          to,
          options.reason,
          mission.version,
        );
        return;
      }

      case "release": {
        const release = await tx.governedRelease.findFirst({
          where: {
            workspaceId: ctx.workspace.id,
            missionId: mission.id,
            status: "APPROVED",
            manifest: { isNot: null },
          },
          orderBy: { approvedAt: "desc" },
          select: { id: true },
        });
        const failedRequiredGateCount = await tx.runtimeGate.count({
          where: {
            workspaceId: ctx.workspace.id,
            missionId: mission.id,
            contractGate: { required: true },
            status: { not: "PASSED" },
          },
        });
        if (!release || failedRequiredGateCount > 0) {
          throw new MissionError(
            MissionErrorCode.ReleaseAuthorizationRequired,
            "Release requires an approved manifest and all required runtime gates passed",
          );
        }
        await internalTransition(
          tx,
          ctx,
          mission.id,
          mission.status,
          to,
          options.reason,
          mission.version,
        );
        return;
      }

      case "later":
        throw new MissionError(
          rule.errorCode!,
          `Transition ${mission.status} → ${to} requires a later kernel`,
        );

      case "block": {
        await tx.mission.update({
          where: { id: mission.id },
          data: {
            status: "BLOCKED",
            blockedFromStatus: mission.status,
            version: { increment: 1 },
          },
        });
        const escalation = await tx.escalation.create({
          data: {
            workspaceId: ctx.workspace.id,
            missionId: mission.id,
            severity: "P2",
            status: "OPEN",
            reason: options.reason,
            sourceType: "MISSION_BLOCK",
            sourceId: mission.id,
            createdByMembershipId: ctx.membership.id,
          },
        });
        await writeAuditEvent(tx, {
          workspaceId: ctx.workspace.id,
          actorUserId: ctx.user.id,
          actorMembershipId: ctx.membership.id,
          eventType: AuditEventType.MissionBlocked,
          entityType: "Mission",
          entityId: mission.id,
          correlationId: ctx.correlationId,
          payload: {
            from: mission.status,
            reason: options.reason,
            version: mission.version,
          },
        });
        await writeAuditEvent(tx, {
          workspaceId: ctx.workspace.id,
          actorUserId: ctx.user.id,
          actorMembershipId: ctx.membership.id,
          eventType: AuditEventType.EscalationCreated,
          entityType: "Escalation",
          entityId: escalation.id,
          correlationId: ctx.correlationId,
          payload: { severity: "P2", reason: options.reason },
        });
        return;
      }

      case "resume": {
        if (!mission.blockedFromStatus || to !== mission.blockedFromStatus) {
          throw new MissionError(
            MissionErrorCode.InvalidTransition,
            "Resume must return to the recorded prior state",
          );
        }
        await tx.mission.update({
          where: { id: mission.id },
          data: {
            status: to,
            blockedFromStatus: null,
            version: { increment: 1 },
          },
        });
        await writeAuditEvent(tx, {
          workspaceId: ctx.workspace.id,
          actorUserId: ctx.user.id,
          actorMembershipId: ctx.membership.id,
          eventType: AuditEventType.MissionResumed,
          entityType: "Mission",
          entityId: mission.id,
          correlationId: ctx.correlationId,
          payload: { to, reason: options.reason, version: mission.version },
        });
        return;
      }

      case "archive": {
        await tx.mission.update({
          where: { id: mission.id },
          data: { status: "ARCHIVED", version: { increment: 1 } },
        });
        await writeAuditEvent(tx, {
          workspaceId: ctx.workspace.id,
          actorUserId: ctx.user.id,
          actorMembershipId: ctx.membership.id,
          eventType: AuditEventType.MissionArchived,
          entityType: "Mission",
          entityId: mission.id,
          correlationId: ctx.correlationId,
          payload: {
            from: mission.status,
            reason: options.reason,
            version: mission.version,
          },
        });
        return;
      }

      case "decision":
        throw new MissionError(
          MissionErrorCode.MaterialDecisionRequired,
          `Transition ${mission.status} → ${to} requires an approved material decision`,
        );

      default:
        throw new MissionError(
          MissionErrorCode.InvalidTransition,
          `Transition ${mission.status} → ${to} is not allowed`,
        );
    }
  });
}

// --- Queries ---

export async function listMissions(ctx: WorkspaceContext) {
  requireMissionCapability(ctx, "missions.read");
  return getDb().mission.findMany({
    where: { workspaceId: ctx.workspace.id },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: 100,
  });
}

export async function getMissionDetail(
  ctx: WorkspaceContext,
  missionId: string,
) {
  requireMissionCapability(ctx, "missions.read");
  const mission = await loadMission(ctx, missionId);
  const [contract, obligations, gates, decisions, escalations] =
    await Promise.all([
      mission.currentContractId
        ? getDb().missionContract.findUnique({
            where: { id: mission.currentContractId },
            include: {
              requirements: true,
              assumptions: true,
              constraints: true,
              inputs: true,
              obligationDefs: true,
              gateDefs: true,
            },
          })
        : null,
      getDb().runtimeObligation.findMany({
        where: { missionId, workspaceId: ctx.workspace.id },
        include: { contractObligation: true },
        orderBy: { id: "asc" },
        take: 100,
      }),
      getDb().runtimeGate.findMany({
        where: { missionId, workspaceId: ctx.workspace.id },
        include: {
          contractGate: true,
          runs: {
            orderBy: [{ createdAt: "desc" }, { id: "desc" }],
            take: 100,
          },
        },
        orderBy: { id: "asc" },
        take: 100,
      }),
      getDb().decision.findMany({
        where: { missionId, workspaceId: ctx.workspace.id },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: 100,
      }),
      getDb().escalation.findMany({
        where: { missionId, workspaceId: ctx.workspace.id },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: 100,
      }),
    ]);
  return { mission, contract, obligations, gates, decisions, escalations };
}

/**
 * Deterministic progress from runtime obligations of the approved contract.
 * Unavailable (null) before approval — never fabricated.
 */
export async function getMissionProgress(
  ctx: WorkspaceContext,
  missionId: string,
): Promise<Progress | null> {
  requireMissionCapability(ctx, "missions.read");
  const mission = await loadMission(ctx, missionId);
  if (!mission.approvedContractId) return null;

  const obligations = await getDb().runtimeObligation.findMany({
    where: { missionId, workspaceId: ctx.workspace.id },
    include: { contractObligation: true },
  });
  return computeProgress(
    obligations.map((o) => ({
      status: o.status,
      weight: o.contractObligation.weight,
    })),
  );
}
