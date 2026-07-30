import { Buffer } from "node:buffer";

import { Prisma, type ExecutionArtifactKind } from "@prisma/client";

import {
  AuditEventType,
  type DbClient,
  enforceManualProviderPolicy,
  type WorkspaceContext,
  writeAuditEvent,
} from "@/modules/identity-workspace";
import { getDb } from "@/server/db";

import {
  assertNoCredentialMaterial,
  canonicalJson,
  type CompletionReportInput,
  type CreateExecutionTipInput,
  type ManualRunInput,
  sha256,
  validateCompletionReport,
  validateExecutionTip,
  validateManualRun,
} from "./contracts";
import { requireExecutionCapability } from "./context";
import { ExecutionError, ExecutionErrorCode } from "./errors";

type Tx = DbClient;

function mapConflict(error: unknown): never {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    ["P2002", "P2034"].includes(error.code)
  ) {
    throw new ExecutionError(
      ExecutionErrorCode.Conflict,
      "Execution state changed concurrently",
    );
  }
  throw error;
}

async function createArtifact(
  tx: Tx,
  ctx: WorkspaceContext,
  input: {
    missionId: string;
    tipId: string;
    kind: ExecutionArtifactKind;
    mediaType: string;
    content: string;
  },
) {
  return tx.executionArtifact.create({
    data: {
      workspaceId: ctx.workspace.id,
      missionId: input.missionId,
      tipId: input.tipId,
      kind: input.kind,
      mediaType: input.mediaType,
      content: input.content,
      contentHash: sha256(input.content),
      sizeBytes: Buffer.byteLength(input.content, "utf8"),
      createdByMembershipId: ctx.membership.id,
    },
  });
}

async function assertDependenciesReady(
  tx: Tx,
  workspaceId: string,
  tipId: string,
): Promise<void> {
  const dependencies = await tx.executionTipDependency.findMany({
    where: { workspaceId, dependentTipId: tipId },
    include: {
      predecessor: {
        include: {
          deviations: {
            where: { status: "OPEN", materiality: "MATERIAL" },
            select: { id: true },
          },
        },
      },
    },
  });
  const blocked = dependencies.find(
    ({ predecessor }) =>
      predecessor.status !== "DONE" || predecessor.deviations.length > 0,
  );
  if (blocked) {
    throw new ExecutionError(
      ExecutionErrorCode.DependencyBlocked,
      `Predecessor ${blocked.predecessor.code} is incomplete or has an open material deviation`,
    );
  }
}

export async function createExecutionTip(
  ctx: WorkspaceContext,
  missionId: string,
  input: CreateExecutionTipInput,
) {
  requireExecutionCapability(ctx, "execution.operate");
  const value = validateExecutionTip(input);

  try {
    return await getDb().$transaction(async (tx) => {
      const mission = await tx.mission.findFirst({
        where: {
          id: missionId,
          workspaceId: ctx.workspace.id,
          status: { in: ["EXPLORING", "BUILDING"] },
        },
      });
      if (!mission) {
        throw new ExecutionError(
          ExecutionErrorCode.NotFound,
          "Exploring or building Mission not found",
        );
      }

      const skillVersion = await tx.skillVersion.findFirst({
        where: { id: value.skillVersionId, workspaceId: ctx.workspace.id },
        include: { skill: true },
      });
      if (
        !skillVersion ||
        skillVersion.skill.activeVersionId !== skillVersion.id ||
        skillVersion.skill.status !== "ACTIVE"
      ) {
        throw new ExecutionError(
          ExecutionErrorCode.NotFound,
          "Active Skill version not found",
        );
      }
      if (
        !skillVersion.assuranceCompatibility.includes(mission.assuranceProfile)
      ) {
        throw new ExecutionError(
          ExecutionErrorCode.Invariant,
          "Skill version is incompatible with the Mission assurance profile",
        );
      }

      const predecessors = await tx.executionTip.findMany({
        where: {
          id: { in: value.predecessorTipIds },
          workspaceId: ctx.workspace.id,
          missionId,
        },
        select: { id: true },
      });
      if (predecessors.length !== value.predecessorTipIds.length) {
        throw new ExecutionError(
          ExecutionErrorCode.NotFound,
          "One or more predecessor TIPs were not found",
        );
      }

      const tip = await tx.executionTip.create({
        data: {
          workspaceId: ctx.workspace.id,
          missionId,
          skillVersionId: skillVersion.id,
          code: value.code,
          title: value.title,
          description: value.description,
          createdByMembershipId: ctx.membership.id,
        },
      });
      if (predecessors.length > 0) {
        await tx.executionTipDependency.createMany({
          data: predecessors.map((predecessor) => ({
            workspaceId: ctx.workspace.id,
            missionId,
            predecessorTipId: predecessor.id,
            dependentTipId: tip.id,
            createdByMembershipId: ctx.membership.id,
          })),
        });
      }
      const skillRun = await tx.skillRun.create({
        data: {
          workspaceId: ctx.workspace.id,
          missionId,
          tipId: tip.id,
          skillVersionId: skillVersion.id,
          createdByMembershipId: ctx.membership.id,
        },
      });
      await writeAuditEvent(tx, {
        workspaceId: ctx.workspace.id,
        actorUserId: ctx.user.id,
        actorMembershipId: ctx.membership.id,
        eventType: AuditEventType.ExecutionTipCreated,
        entityType: "ExecutionTip",
        entityId: tip.id,
        correlationId: ctx.correlationId,
        payload: {
          code: tip.code,
          dependencyCount: predecessors.length,
        },
      });
      return { ...tip, skillRun };
    });
  } catch (error) {
    mapConflict(error);
  }
}

async function startAttempt(
  tx: Tx,
  ctx: WorkspaceContext,
  input: ManualRunInput,
  state: {
    skillRunId: string;
    missionId: string;
    tipId: string;
    attemptNumber: number;
    previousRunId?: string;
  },
) {
  await enforceManualProviderPolicy(
    tx,
    ctx.workspace.id,
    input.providerName,
    input.modelName,
  );
  if (input.performedByMembershipId) {
    const performer = await tx.membership.findFirst({
      where: {
        id: input.performedByMembershipId,
        workspaceId: ctx.workspace.id,
        status: "ACTIVE",
      },
      select: { id: true },
    });
    if (!performer) {
      throw new ExecutionError(
        ExecutionErrorCode.InvalidInput,
        "Named performer is not an active Workspace member",
      );
    }
  }
  const artifact = await createArtifact(tx, ctx, {
    missionId: state.missionId,
    tipId: state.tipId,
    kind: "INSTRUCTION",
    mediaType: "text/markdown",
    content: input.instruction,
  });
  const run = await tx.agentRun.create({
    data: {
      workspaceId: ctx.workspace.id,
      missionId: state.missionId,
      skillRunId: state.skillRunId,
      attemptNumber: state.attemptNumber,
      executionRole: input.executionRole,
      providerName: input.providerName,
      modelName: input.modelName,
      inputArtifactId: artifact.id,
      previousRunId: state.previousRunId,
      createdByMembershipId: ctx.membership.id,
      performedByMembershipId: input.performedByMembershipId,
    },
  });
  await tx.skillRun.update({
    where: { id: state.skillRunId },
    data: { status: "IN_PROGRESS", version: { increment: 1 } },
  });
  await tx.executionTip.update({
    where: { id: state.tipId },
    data: { status: "IN_PROGRESS", version: { increment: 1 } },
  });
  await writeAuditEvent(tx, {
    workspaceId: ctx.workspace.id,
    actorUserId: ctx.user.id,
    actorMembershipId: ctx.membership.id,
    eventType: AuditEventType.ExecutionRunStarted,
    entityType: "AgentRun",
    entityId: run.id,
    correlationId: ctx.correlationId,
    payload: {
      attemptNumber: run.attemptNumber,
      role: run.executionRole,
      provider: run.providerName,
      model: run.modelName,
      inputArtifactId: artifact.id,
    },
  });
  return { run, artifact };
}

export async function issueManualRun(
  ctx: WorkspaceContext,
  tipId: string,
  input: ManualRunInput,
) {
  requireExecutionCapability(ctx, "execution.operate");
  const value = validateManualRun(input);
  try {
    return await getDb().$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM "execution_tip" WHERE id = ${tipId} FOR UPDATE`;
      const tip = await tx.executionTip.findFirst({
        where: { id: tipId, workspaceId: ctx.workspace.id },
        include: { skillRuns: { include: { agentRuns: true } } },
      });
      if (!tip) {
        throw new ExecutionError(
          ExecutionErrorCode.NotFound,
          "Execution TIP not found",
        );
      }
      if (tip.skillRuns[0].agentRuns.length > 0) {
        throw new ExecutionError(
          ExecutionErrorCode.Invariant,
          "Use retryManualRun after the first attempt",
        );
      }
      await assertDependenciesReady(tx, ctx.workspace.id, tip.id);
      return startAttempt(tx, ctx, value, {
        skillRunId: tip.skillRuns[0].id,
        missionId: tip.missionId,
        tipId: tip.id,
        attemptNumber: 1,
      });
    });
  } catch (error) {
    mapConflict(error);
  }
}

export async function retryManualRun(
  ctx: WorkspaceContext,
  previousRunId: string,
  input: ManualRunInput,
) {
  requireExecutionCapability(ctx, "execution.operate");
  const value = validateManualRun(input);
  try {
    return await getDb().$transaction(async (tx) => {
      const previous = await tx.agentRun.findFirst({
        where: { id: previousRunId, workspaceId: ctx.workspace.id },
        include: { skillRun: true },
      });
      if (!previous) {
        throw new ExecutionError(
          ExecutionErrorCode.NotFound,
          "Previous run not found",
        );
      }
      await tx.$queryRaw`SELECT id FROM "skill_run" WHERE id = ${previous.skillRunId} FOR UPDATE`;
      const lockedPrevious = await tx.agentRun.findFirstOrThrow({
        where: { id: previous.id, workspaceId: ctx.workspace.id },
      });
      if (lockedPrevious.status === "AWAITING_REPORT") {
        throw new ExecutionError(
          ExecutionErrorCode.Invariant,
          "An awaiting run cannot be retried",
        );
      }
      const latestRun = await tx.agentRun.findFirstOrThrow({
        where: { skillRunId: previous.skillRunId },
        orderBy: { attemptNumber: "desc" },
      });
      if (latestRun.id !== lockedPrevious.id) {
        throw new ExecutionError(
          ExecutionErrorCode.Invariant,
          "Only the latest terminal attempt can be retried",
        );
      }
      await assertDependenciesReady(
        tx,
        ctx.workspace.id,
        previous.skillRun.tipId,
      );
      return startAttempt(tx, ctx, value, {
        skillRunId: previous.skillRunId,
        missionId: previous.missionId,
        tipId: previous.skillRun.tipId,
        attemptNumber: latestRun.attemptNumber + 1,
        previousRunId: previous.id,
      });
    });
  } catch (error) {
    mapConflict(error);
  }
}

export async function importCompletionReport(
  ctx: WorkspaceContext,
  runId: string,
  input: CompletionReportInput,
) {
  requireExecutionCapability(ctx, "execution.operate");
  const reportValue = validateCompletionReport(input);
  const reportContent = canonicalJson(reportValue);
  assertNoCredentialMaterial(reportContent);

  try {
    return await getDb().$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM "agent_run" WHERE id = ${runId} FOR UPDATE`;
      const run = await tx.agentRun.findFirst({
        where: { id: runId, workspaceId: ctx.workspace.id },
        include: { skillRun: true },
      });
      if (!run) {
        throw new ExecutionError(
          ExecutionErrorCode.NotFound,
          "Agent run not found",
        );
      }
      if (run.status !== "AWAITING_REPORT") {
        throw new ExecutionError(
          ExecutionErrorCode.ReportAlreadyImported,
          "This attempt already has a Completion Report",
        );
      }

      const artifact = await createArtifact(tx, ctx, {
        missionId: run.missionId,
        tipId: run.skillRun.tipId,
        kind: "COMPLETION_REPORT",
        mediaType: "application/json",
        content: reportContent,
      });
      const report = await tx.completionReport.create({
        data: {
          workspaceId: ctx.workspace.id,
          missionId: run.missionId,
          runId: run.id,
          artifactId: artifact.id,
          result: reportValue.result,
          summary: reportValue.summary,
          requirementCoverage:
            reportValue.requirementCoverage as Prisma.InputJsonObject,
          scenarioResults: reportValue.scenarioResults as Prisma.InputJsonArray,
          technicalHealth:
            reportValue.technicalHealth as Prisma.InputJsonObject,
          overallStatus: reportValue.overallStatus,
          importedByMembershipId: ctx.membership.id,
        },
      });
      if (reportValue.deviations.length > 0) {
        await tx.executionDeviation.createMany({
          data: reportValue.deviations.map((deviation) => ({
            workspaceId: ctx.workspace.id,
            missionId: run.missionId,
            tipId: run.skillRun.tipId,
            reportId: report.id,
            ...deviation,
          })),
        });
      }
      if (reportValue.resourceUsage.length > 0) {
        await tx.resourceUsageRecord.createMany({
          data: reportValue.resourceUsage.map((usage) => ({
            workspaceId: ctx.workspace.id,
            missionId: run.missionId,
            runId: run.id,
            reportId: report.id,
            ...usage,
          })),
        });
      }
      const hasMaterialDeviation = reportValue.deviations.some(
        (deviation) => deviation.materiality === "MATERIAL",
      );
      const terminalStatus = reportValue.result;
      await tx.agentRun.update({
        where: { id: run.id },
        data: {
          status: terminalStatus,
          outputArtifactId: artifact.id,
          completedAt: new Date(),
          version: { increment: 1 },
        },
      });
      await tx.skillRun.update({
        where: { id: run.skillRunId },
        data: {
          status: hasMaterialDeviation ? "BLOCKED" : terminalStatus,
          version: { increment: 1 },
        },
      });
      await tx.executionTip.update({
        where: { id: run.skillRun.tipId },
        data: {
          status: hasMaterialDeviation ? "BLOCKED_DEVIATION" : terminalStatus,
          version: { increment: 1 },
        },
      });
      await writeAuditEvent(tx, {
        workspaceId: ctx.workspace.id,
        actorUserId: ctx.user.id,
        actorMembershipId: ctx.membership.id,
        eventType: AuditEventType.ExecutionReportImported,
        entityType: "CompletionReport",
        entityId: report.id,
        correlationId: ctx.correlationId,
        payload: {
          result: report.result,
          overallStatus: report.overallStatus,
          outputArtifactId: artifact.id,
          deviationCount: reportValue.deviations.length,
          resourceRecordCount: reportValue.resourceUsage.length,
        },
      });
      return { report, artifact };
    });
  } catch (error) {
    mapConflict(error);
  }
}

export async function resolveExecutionDeviation(
  ctx: WorkspaceContext,
  deviationId: string,
  input: { resolution: string; expectedVersion?: number },
) {
  requireExecutionCapability(ctx, "execution.review");
  const resolution = input.resolution?.trim();
  if (!resolution) {
    throw new ExecutionError(
      ExecutionErrorCode.InvalidInput,
      "Deviation resolution is required",
    );
  }

  return getDb().$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM "execution_deviation" WHERE id = ${deviationId} FOR UPDATE`;
    const deviation = await tx.executionDeviation.findFirst({
      where: { id: deviationId, workspaceId: ctx.workspace.id },
      include: { report: true },
    });
    if (!deviation) {
      throw new ExecutionError(
        ExecutionErrorCode.NotFound,
        "Execution deviation not found",
      );
    }
    if (deviation.status !== "OPEN") {
      throw new ExecutionError(
        ExecutionErrorCode.Invariant,
        "Execution deviation is already resolved",
      );
    }
    if (
      input.expectedVersion !== undefined &&
      input.expectedVersion !== deviation.version
    ) {
      throw new ExecutionError(
        ExecutionErrorCode.Conflict,
        "Execution deviation changed after it was read",
      );
    }
    const updated = await tx.executionDeviation.update({
      where: { id: deviation.id },
      data: {
        status: "RESOLVED",
        resolution,
        resolvedByMembershipId: ctx.membership.id,
        resolvedAt: new Date(),
        version: { increment: 1 },
      },
    });
    const remaining = await tx.executionDeviation.count({
      where: {
        tipId: deviation.tipId,
        status: "OPEN",
        materiality: "MATERIAL",
      },
    });
    if (remaining === 0) {
      await tx.executionTip.update({
        where: { id: deviation.tipId },
        data: {
          status: deviation.report.result,
          version: { increment: 1 },
        },
      });
      await tx.skillRun.updateMany({
        where: { tipId: deviation.tipId },
        data: {
          status: deviation.report.result,
          version: { increment: 1 },
        },
      });
    }
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.ExecutionDeviationResolved,
      entityType: "ExecutionDeviation",
      entityId: deviation.id,
      correlationId: ctx.correlationId,
      payload: { code: deviation.code, resolution },
    });
    return updated;
  });
}
