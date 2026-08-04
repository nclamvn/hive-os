import { Prisma } from "@prisma/client";

import {
  organizationIdForWorkspace,
  requireWorkspaceAuthorization,
} from "@/modules/authorization";
import {
  AuditEventType,
  type WorkspaceContext,
  writeAuditEvent,
} from "@/modules/identity-workspace";
import {
  decodeCursor,
  encodeCursor,
  normalizePageSize,
  type PageRequest,
  QueryContractError,
  toConnection,
} from "@/modules/query-contracts";
import { withOrganizationTenant } from "@/server/tenant-context";

import { CommandRuntimeError } from "./errors";

function jobCursor(after?: string) {
  if (!after) return undefined;
  const cursor = decodeCursor("durable-job:created_desc", after);
  const createdAt = new Date(cursor.s[0] ?? "");
  if (cursor.s.length !== 1 || Number.isNaN(createdAt.getTime())) {
    throw new QueryContractError("Job cursor is invalid", "INVALID_CURSOR");
  }
  return { createdAt, id: cursor.i };
}

export async function listJobPage(
  ctx: WorkspaceContext,
  input: PageRequest & {
    statuses?: Array<
      "READY" | "RUNNING" | "SUCCEEDED" | "DEAD_LETTER" | "CANCELLED"
    >;
  } = {},
) {
  await requireWorkspaceAuthorization(ctx, "jobs.read");
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  const first = normalizePageSize(input.first);
  const cursor = jobCursor(input.after);
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    const rows = await tx.durableJob.findMany({
      where: {
        organizationId,
        workspaceId: ctx.workspace.id,
        ...(input.statuses?.length
          ? { status: { in: input.statuses } }
          : {}),
        ...(cursor
          ? {
              OR: [
                { createdAt: { lt: cursor.createdAt } },
                { createdAt: cursor.createdAt, id: { lt: cursor.id } },
              ],
            }
          : {}),
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: first + 1,
      include: {
        events: {
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          take: 10,
        },
      },
    });
    return toConnection(rows, first, (row) =>
      encodeCursor("durable-job:created_desc", [row.createdAt], row.id),
    );
  });
}

function text(value: string, field: string, maximum = 1_000) {
  const normalized = value.trim();
  if (!normalized || normalized.length > maximum) {
    throw new CommandRuntimeError(
      "INVALID_INPUT",
      `${field} must contain 1–${maximum} characters`,
    );
  }
  return normalized;
}

function integer(
  value: number,
  field: string,
  minimum: number,
  maximum: number,
) {
  if (!Number.isInteger(value) || value < minimum || value > maximum) {
    throw new CommandRuntimeError(
      "INVALID_INPUT",
      `${field} must be an integer between ${minimum} and ${maximum}`,
    );
  }
  return value;
}

export async function claimJobs(input: {
  organizationId: string;
  actorUserId: string;
  workerId: string;
  jobTypes?: string[];
  first?: number;
  leaseSeconds?: number;
  now?: Date;
}) {
  const workerId = text(input.workerId, "Worker id", 120);
  const first = integer(input.first ?? 10, "Claim limit", 1, 50);
  const leaseSeconds = integer(
    input.leaseSeconds ?? 60,
    "Lease duration",
    5,
    3_600,
  );
  const now = input.now ?? new Date();
  const jobTypes = (input.jobTypes ?? []).map((jobType) =>
    text(jobType, "Job type", 120),
  );
  if (jobTypes.length > 20) {
    throw new CommandRuntimeError("INVALID_INPUT", "At most 20 Job types are allowed");
  }
  const leaseExpiresAt = new Date(now.getTime() + leaseSeconds * 1_000);
  return withOrganizationTenant(
    input.organizationId,
    input.actorUserId,
    async (tx) => {
      const exhausted = await tx.$queryRaw<
        Array<{ id: string; workspace_id: string | null; attempts: number }>
      >`
        SELECT id, workspace_id, attempts
        FROM durable_job
        WHERE organization_id = ${input.organizationId}
          ${jobTypes.length ? Prisma.sql`AND job_type IN (${Prisma.join(jobTypes)})` : Prisma.empty}
          AND status = 'RUNNING'
          AND lease_expires_at <= ${now}
          AND attempts >= max_attempts
        ORDER BY lease_expires_at ASC, id ASC
        FOR UPDATE SKIP LOCKED
        LIMIT ${first}
      `;
      for (const row of exhausted) {
        await tx.durableJob.update({
          where: { id: row.id },
          data: {
            status: "DEAD_LETTER",
            lockedBy: null,
            leaseExpiresAt: null,
            lastErrorCode: "LEASE_EXPIRED",
            lastErrorMessage: "Final worker lease expired",
            version: { increment: 1 },
          },
        });
        await tx.durableJobEvent.create({
          data: {
            organizationId: input.organizationId,
            workspaceId: row.workspace_id,
            jobId: row.id,
            eventType: "DEAD_LETTERED",
            attemptNumber: row.attempts,
            workerId,
            reason: "Final worker lease expired",
            detail: { errorCode: "LEASE_EXPIRED" },
          },
        });
      }

      const locked = await tx.$queryRaw<Array<{ id: string }>>`
        SELECT id
        FROM durable_job
        WHERE organization_id = ${input.organizationId}
          ${jobTypes.length ? Prisma.sql`AND job_type IN (${Prisma.join(jobTypes)})` : Prisma.empty}
          AND attempts < max_attempts
          AND (
            (status = 'READY' AND available_at <= ${now})
            OR
            (status = 'RUNNING' AND lease_expires_at <= ${now})
          )
        ORDER BY priority ASC, available_at ASC, id ASC
        FOR UPDATE SKIP LOCKED
        LIMIT ${first}
      `;
      const claimed = [];
      for (const row of locked) {
        const job = await tx.durableJob.update({
          where: { id: row.id },
          data: {
            status: "RUNNING",
            attempts: { increment: 1 },
            lockedBy: workerId,
            leaseExpiresAt,
            lastErrorCode: null,
            lastErrorMessage: null,
            version: { increment: 1 },
          },
        });
        await tx.durableJobEvent.create({
          data: {
            organizationId: input.organizationId,
            workspaceId: job.workspaceId,
            jobId: job.id,
            eventType: "CLAIMED",
            attemptNumber: job.attempts,
            workerId,
            detail: { leaseExpiresAt: leaseExpiresAt.toISOString() },
          },
        });
        claimed.push(job);
      }
      return claimed;
    },
  );
}

export async function completeJob(input: {
  organizationId: string;
  actorUserId: string;
  workerId: string;
  jobId: string;
  expectedVersion: number;
  result: Prisma.InputJsonObject;
  now?: Date;
}) {
  const workerId = text(input.workerId, "Worker id", 120);
  const now = input.now ?? new Date();
  return withOrganizationTenant(
    input.organizationId,
    input.actorUserId,
    async (tx) => {
      await tx.$queryRaw`
        SELECT id FROM durable_job
        WHERE organization_id = ${input.organizationId}
          AND id = ${input.jobId}
        FOR UPDATE
      `;
      const job = await tx.durableJob.findFirst({
        where: {
          id: input.jobId,
          organizationId: input.organizationId,
          status: "RUNNING",
          lockedBy: workerId,
          version: input.expectedVersion,
          leaseExpiresAt: { gt: now },
        },
      });
      if (!job) {
        throw new CommandRuntimeError(
          "LEASE_CONFLICT",
          "Job lease or version is no longer valid",
        );
      }
      const updated = await tx.durableJob.update({
        where: { id: job.id },
        data: {
          status: "SUCCEEDED",
          result: input.result,
          lockedBy: null,
          leaseExpiresAt: null,
          completedAt: now,
          version: { increment: 1 },
        },
      });
      await tx.durableJobEvent.create({
        data: {
          organizationId: input.organizationId,
          workspaceId: job.workspaceId,
          jobId: job.id,
          eventType: "SUCCEEDED",
          attemptNumber: job.attempts,
          workerId,
        },
      });
      return updated;
    },
  );
}

export async function heartbeatJob(input: {
  organizationId: string;
  actorUserId: string;
  workerId: string;
  jobId: string;
  expectedVersion: number;
  leaseSeconds?: number;
  now?: Date;
}) {
  const workerId = text(input.workerId, "Worker id", 120);
  const leaseSeconds = integer(
    input.leaseSeconds ?? 300,
    "Lease duration",
    5,
    3_600,
  );
  const now = input.now ?? new Date();
  return withOrganizationTenant(
    input.organizationId,
    input.actorUserId,
    async (tx) => {
      const updated = await tx.durableJob.updateMany({
        where: {
          id: input.jobId,
          organizationId: input.organizationId,
          status: "RUNNING",
          lockedBy: workerId,
          version: input.expectedVersion,
          leaseExpiresAt: { gt: now },
        },
        data: {
          leaseExpiresAt: new Date(now.getTime() + leaseSeconds * 1_000),
          version: { increment: 1 },
        },
      });
      if (updated.count !== 1) {
        throw new CommandRuntimeError(
          "LEASE_CONFLICT",
          "Job lease or version is no longer valid",
        );
      }
      return tx.durableJob.findUniqueOrThrow({ where: { id: input.jobId } });
    },
  );
}

export async function failJob(input: {
  organizationId: string;
  actorUserId: string;
  workerId: string;
  jobId: string;
  expectedVersion: number;
  errorCode: string;
  errorMessage: string;
  retryable?: boolean;
  now?: Date;
}) {
  const workerId = text(input.workerId, "Worker id", 120);
  const errorCode = text(input.errorCode, "Error code", 100);
  const errorMessage = text(input.errorMessage, "Error message", 1_000);
  const now = input.now ?? new Date();
  return withOrganizationTenant(
    input.organizationId,
    input.actorUserId,
    async (tx) => {
      await tx.$queryRaw`
        SELECT id FROM durable_job
        WHERE organization_id = ${input.organizationId}
          AND id = ${input.jobId}
        FOR UPDATE
      `;
      const job = await tx.durableJob.findFirst({
        where: {
          id: input.jobId,
          organizationId: input.organizationId,
          status: "RUNNING",
          lockedBy: workerId,
          version: input.expectedVersion,
        },
      });
      if (!job) {
        throw new CommandRuntimeError(
          "LEASE_CONFLICT",
          "Job lease or version is no longer valid",
        );
      }
      const deadLetter = input.retryable === false || job.attempts >= job.maxAttempts;
      const retryDelayMs = Math.min(
        3_600_000,
        30_000 * 2 ** Math.max(0, job.attempts - 1),
      );
      const updated = await tx.durableJob.update({
        where: { id: job.id },
        data: {
          status: deadLetter ? "DEAD_LETTER" : "READY",
          availableAt: deadLetter
            ? job.availableAt
            : new Date(now.getTime() + retryDelayMs),
          lockedBy: null,
          leaseExpiresAt: null,
          lastErrorCode: errorCode,
          lastErrorMessage: errorMessage,
          version: { increment: 1 },
        },
      });
      await tx.durableJobEvent.create({
        data: {
          organizationId: input.organizationId,
          workspaceId: job.workspaceId,
          jobId: job.id,
          eventType: deadLetter ? "DEAD_LETTERED" : "RETRY_SCHEDULED",
          attemptNumber: job.attempts,
          workerId,
          reason: errorMessage,
          detail: {
            errorCode,
            ...(deadLetter
              ? {}
              : { availableAt: updated.availableAt.toISOString() }),
          },
        },
      });
      return updated;
    },
  );
}

export async function disposeDeadLetter(
  ctx: WorkspaceContext,
  input: {
    jobId: string;
    expectedVersion: number;
    action: "REQUEUE" | "CANCEL";
    reason: string;
  },
) {
  await requireWorkspaceAuthorization(ctx, "jobs.manage");
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  const reason = text(input.reason, "Disposition reason");
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    await tx.$queryRaw`
      SELECT id FROM durable_job
      WHERE organization_id = ${organizationId} AND id = ${input.jobId}
      FOR UPDATE
    `;
    const job = await tx.durableJob.findFirst({
      where: {
        id: input.jobId,
        organizationId,
        workspaceId: ctx.workspace.id,
        status: "DEAD_LETTER",
        version: input.expectedVersion,
      },
    });
    if (!job) {
      throw new CommandRuntimeError(
        "STALE_VERSION",
        "Dead-letter job changed or was not found",
      );
    }
    const actor = await tx.organizationMembership.findUniqueOrThrow({
      where: {
        organizationId_userId: {
          organizationId,
          userId: ctx.user.id,
        },
      },
    });
    const completedAt = input.action === "CANCEL" ? new Date() : null;
    const updated = await tx.durableJob.update({
      where: { id: job.id },
      data:
        input.action === "REQUEUE"
          ? {
              status: "READY",
              attempts: 0,
              availableAt: new Date(),
              lastErrorCode: null,
              lastErrorMessage: null,
              version: { increment: 1 },
            }
          : {
              status: "CANCELLED",
              completedAt,
              version: { increment: 1 },
            },
    });
    await tx.durableJobEvent.create({
      data: {
        organizationId,
        workspaceId: job.workspaceId,
        jobId: job.id,
        eventType: input.action === "REQUEUE" ? "REQUEUED" : "CANCELLED",
        attemptNumber: job.attempts,
        actorOrganizationMembershipId: actor.id,
        reason,
      },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.JobDeadLetterDisposed,
      entityType: "DurableJob",
      entityId: job.id,
      correlationId: ctx.correlationId,
      payload: { jobId: job.id, action: input.action, reason },
    });
    return updated;
  });
}
