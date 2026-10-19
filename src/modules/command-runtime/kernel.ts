import { createHash, randomUUID } from "node:crypto";

import { Prisma } from "@prisma/client";

import {
  organizationIdForWorkspace,
  requireWorkspaceAuthorization,
} from "@/modules/authorization";
import { AuditEventType, writeAuditEvent } from "@/modules/identity-workspace/audit";
import type { WorkspaceContext } from "@/modules/identity-workspace/context";
import {
  type TenantTransaction,
  withOrganizationTenant,
} from "@/server/tenant-context";

import {
  type CommandEffectHandler,
  type CommandEffectResult,
  type CommandEnvelope,
  type StableCommandOutcome,
} from "./contracts";
import { CommandEffectError, CommandRuntimeError } from "./errors";

const SECRET_KEY =
  /(password|secret|token|authorization|cookie|credential|database.?url|api.?key)/i;

function boundedText(value: string, field: string, maximum: number) {
  const normalized = value.trim();
  if (!normalized || normalized.length > maximum) {
    throw new CommandRuntimeError(
      "INVALID_INPUT",
      `${field} must contain 1–${maximum} characters`,
    );
  }
  return normalized;
}

function boundedInteger(
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

function stableJson(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableJson(item)).join(",")}]`;
  }
  const object = value as Record<string, unknown>;
  return `{${Object.keys(object)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableJson(object[key])}`)
    .join(",")}}`;
}

function validateJsonObject(
  value: Prisma.InputJsonObject,
  field: string,
  maximumBytes = 65_536,
) {
  const serialized = stableJson(value);
  if (Buffer.byteLength(serialized, "utf8") > maximumBytes) {
    throw new CommandRuntimeError(
      "INVALID_INPUT",
      `${field} exceeds ${maximumBytes} bytes`,
    );
  }
  const visit = (candidate: unknown): void => {
    if (!candidate || typeof candidate !== "object") return;
    if (Array.isArray(candidate)) {
      for (const item of candidate) visit(item);
      return;
    }
    for (const [key, nested] of Object.entries(candidate)) {
      if (SECRET_KEY.test(key)) {
        throw new CommandRuntimeError(
          "INVALID_INPUT",
          `${field} contains a forbidden secret-bearing key`,
        );
      }
      visit(nested);
    }
  };
  visit(value);
  return serialized;
}

function payloadHash(value: Prisma.InputJsonObject) {
  return createHash("sha256")
    .update(validateJsonObject(value, "Command payload"))
    .digest("hex");
}

async function actorMembership(
  tx: TenantTransaction,
  organizationId: string,
  actorUserId: string,
) {
  const actor = await tx.organizationMembership.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId: actorUserId,
      },
    },
    select: { id: true, status: true },
  });
  if (!actor || actor.status !== "ACTIVE") {
    throw new CommandRuntimeError(
      "INVALID_INPUT",
      "Active organization membership required",
    );
  }
  return actor;
}

async function stableOutcome(
  tx: TenantTransaction,
  record: {
    id: string;
    status: "PROCESSING" | "SUCCEEDED" | "FAILED";
    outcome: Prisma.JsonValue | null;
    errorCode: string | null;
    errorMessage: string | null;
  },
): Promise<StableCommandOutcome> {
  if (record.status === "PROCESSING") {
    throw new CommandRuntimeError(
      "INVALID_TRANSITION",
      "Command outcome is not terminal",
    );
  }
  const events = await tx.outboxEvent.findMany({
    where: { commandId: record.id },
    select: { id: true },
    orderBy: { id: "asc" },
    take: 20,
  });
  if (record.status === "SUCCEEDED") {
    return {
      commandId: record.id,
      status: "SUCCEEDED",
      outcome: record.outcome as Prisma.JsonObject,
      outboxEventIds: events.map((event) => event.id),
    };
  }
  return {
    commandId: record.id,
    status: "FAILED",
    errorCode: record.errorCode ?? "COMMAND_FAILED",
    errorMessage: record.errorMessage ?? "Command effect failed",
    outboxEventIds: events.map((event) => event.id),
  };
}

function safeFailure(error: unknown) {
  if (error instanceof CommandEffectError) {
    return {
      code: boundedText(error.code, "Error code", 100),
      message: boundedText(error.message, "Error message", 1_000),
    };
  }
  return {
    code: "COMMAND_FAILED",
    message: "Command effect failed",
  };
}

function validateEffect(effect: CommandEffectResult) {
  validateJsonObject(effect.outcome, "Command outcome");
  if (effect.outbox.length < 1 || effect.outbox.length > 20) {
    throw new CommandEffectError(
      "INVALID_EFFECT",
      "Command effect must emit 1–20 outbox events",
    );
  }
  return effect.outbox.map((event) => ({
    topic: boundedText(event.topic, "Outbox topic", 120),
    aggregateType: boundedText(
      event.aggregateType,
      "Aggregate type",
      120,
    ),
    aggregateId: boundedText(event.aggregateId, "Aggregate id", 200),
    payload: event.payload,
    availableAt: event.availableAt,
    serialized: validateJsonObject(event.payload, "Outbox payload"),
  }));
}

export async function executeDurableCommand(
  ctx: WorkspaceContext,
  envelope: CommandEnvelope,
  handler: CommandEffectHandler,
): Promise<StableCommandOutcome> {
  await requireWorkspaceAuthorization(
    ctx,
    envelope.requiredCapability,
    envelope.missionId,
  );
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  const idempotencyKey = boundedText(
    envelope.idempotencyKey,
    "Idempotency key",
    200,
  );
  const commandType = boundedText(envelope.commandType, "Command type", 120);
  const hash = payloadHash(envelope.payload);
  const commandId = envelope.commandId ?? randomUUID();
  const issuedAt = envelope.issuedAt ?? new Date();
  const correlationId = envelope.correlationId ?? ctx.correlationId;
  boundedText(correlationId, "Correlation id", 200);
  if (
    envelope.expectedVersion !== undefined &&
    (!Number.isInteger(envelope.expectedVersion) ||
      envelope.expectedVersion < 0)
  ) {
    throw new CommandRuntimeError(
      "INVALID_INPUT",
      "Expected version must be a non-negative integer",
    );
  }

  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    await tx.$queryRaw<Array<{ locked: number }>>`
      SELECT 1::INTEGER AS locked
      FROM pg_advisory_xact_lock(
        hashtextextended(${`${organizationId}:${idempotencyKey}`}, 0)
      )
    `;
    const existing = await tx.commandRecord.findUnique({
      where: {
        organizationId_idempotencyKey: {
          organizationId,
          idempotencyKey,
        },
      },
    });
    if (existing) {
      if (
        existing.commandType !== commandType ||
        existing.payloadHash !== hash ||
        existing.workspaceId !== ctx.workspace.id ||
        existing.actorUserId !== ctx.user.id
      ) {
        throw new CommandRuntimeError(
          "IDEMPOTENCY_CONFLICT",
          "Idempotency key was already used for another command identity",
        );
      }
      return stableOutcome(tx, existing);
    }

    const actor = await actorMembership(tx, organizationId, ctx.user.id);
    const record = await tx.commandRecord.create({
      data: {
        id: commandId,
        organizationId,
        workspaceId: ctx.workspace.id,
        idempotencyKey,
        commandType,
        actorUserId: ctx.user.id,
        actorOrganizationMembershipId: actor.id,
        correlationId,
        expectedVersion: envelope.expectedVersion,
        issuedAt,
        payload: envelope.payload,
        payloadHash: hash,
      },
    });
    await tx.$executeRawUnsafe("SAVEPOINT command_effect");
    try {
      const effect = await handler(tx, {
        commandId: record.id,
        organizationId,
        workspaceId: ctx.workspace.id,
        actorUserId: ctx.user.id,
        actorOrganizationMembershipId: actor.id,
        correlationId,
        expectedVersion: envelope.expectedVersion,
        issuedAt,
      });
      const events = validateEffect(effect);
      const createdEvents = [];
      for (const event of events) {
        createdEvents.push(
          await tx.outboxEvent.create({
            data: {
              organizationId,
              workspaceId: ctx.workspace.id,
              commandId: record.id,
              topic: event.topic,
              aggregateType: event.aggregateType,
              aggregateId: event.aggregateId,
              payload: event.payload,
              availableAt: event.availableAt,
            },
          }),
        );
      }
      await writeAuditEvent(tx, {
        workspaceId: ctx.workspace.id,
        actorUserId: ctx.user.id,
        actorMembershipId: ctx.membership.id,
        eventType: AuditEventType.CommandSucceeded,
        entityType: "CommandRecord",
        entityId: record.id,
        correlationId,
        payload: {
          commandType,
          commandId: record.id,
          outboxEventId: createdEvents[0]!.id,
        },
      });
      const completed = await tx.commandRecord.update({
        where: { id: record.id },
        data: {
          status: "SUCCEEDED",
          outcome: effect.outcome,
          completedAt: new Date(),
        },
      });
      await tx.$executeRawUnsafe("RELEASE SAVEPOINT command_effect");
      return stableOutcome(tx, completed);
    } catch (error) {
      await tx.$executeRawUnsafe("ROLLBACK TO SAVEPOINT command_effect");
      const failure = safeFailure(error);
      const failureEvent = await tx.outboxEvent.create({
        data: {
          organizationId,
          workspaceId: ctx.workspace.id,
          commandId: record.id,
          topic: "command.failed",
          aggregateType: "CommandRecord",
          aggregateId: record.id,
          payload: { commandType, errorCode: failure.code },
        },
      });
      await writeAuditEvent(tx, {
        workspaceId: ctx.workspace.id,
        actorUserId: ctx.user.id,
        actorMembershipId: ctx.membership.id,
        eventType: AuditEventType.CommandFailed,
        entityType: "CommandRecord",
        entityId: record.id,
        correlationId,
        payload: {
          commandType,
          commandId: record.id,
          errorCode: failure.code,
        },
      });
      const completed = await tx.commandRecord.update({
        where: { id: record.id },
        data: {
          status: "FAILED",
          errorCode: failure.code,
          errorMessage: failure.message,
          completedAt: new Date(),
        },
      });
      await tx.$executeRawUnsafe("RELEASE SAVEPOINT command_effect");
      return {
        ...(await stableOutcome(tx, completed)),
        outboxEventIds: [failureEvent.id],
      };
    }
  });
}

function exactOutboxIds(value: readonly string[] | undefined) {
  if (value === undefined) return undefined;
  if (
    !Array.isArray(value) ||
    value.length > 100 ||
    [...value].some((id) =>
      typeof id !== "string" || !id || id.length > 200 ||
      /\s|[\u0000-\u001f\u007f]/u.test(id),
    )
  ) {
    throw new CommandRuntimeError(
      "INVALID_INPUT",
      "Outbox selector must contain at most 100 exact bounded IDs",
    );
  }
  return [...new Set(value)];
}

export async function dispatchOutboxBatch(input: {
  organizationId: string;
  actorUserId: string;
  workerId: string;
  /** Omitted preserves batch behavior; an empty list selects no work. */
  outboxIds?: readonly string[];
  first?: number;
  now?: Date;
}) {
  const first = boundedInteger(input.first ?? 50, "Dispatch limit", 1, 100);
  const workerId = boundedText(input.workerId, "Worker id", 120);
  const now = input.now ?? new Date();
  const outboxIds = exactOutboxIds(input.outboxIds);
  const idFilter = outboxIds === undefined
    ? Prisma.empty
    : outboxIds.length
      ? Prisma.sql`AND id IN (${Prisma.join(outboxIds)})`
      : Prisma.sql`AND FALSE`;
  return withOrganizationTenant(
    input.organizationId,
    input.actorUserId,
    async (tx) => {
      const locked = await tx.$queryRaw<Array<{ id: string }>>`
        SELECT id
        FROM outbox_event
        WHERE organization_id = ${input.organizationId}
          ${idFilter}
          AND status = 'PENDING'
          AND available_at <= ${now}
        ORDER BY available_at ASC, id ASC
        FOR UPDATE SKIP LOCKED
        LIMIT ${first}
      `;
      const rows = locked.length
        ? await tx.outboxEvent.findMany({
            where: {
              organizationId: input.organizationId,
              id: { in: locked.map((row) => row.id) },
            },
            orderBy: [{ availableAt: "asc" }, { id: "asc" }],
            take: first,
          })
        : [];
      const jobIds: string[] = [];
      for (const row of rows) {
        const job = await tx.durableJob.upsert({
          where: {
            organizationId_outboxEventId: {
              organizationId: input.organizationId,
              outboxEventId: row.id,
            },
          },
          create: {
            organizationId: input.organizationId,
            workspaceId: row.workspaceId,
            outboxEventId: row.id,
            jobType: row.topic,
            payload: row.payload as Prisma.InputJsonValue,
            availableAt: row.availableAt,
          },
          update: {},
        });
        await tx.outboxEvent.update({
          where: { id: row.id, organizationId: input.organizationId },
          data: {
            status: "DISPATCHED",
            dispatchedAt: now,
            version: { increment: 1 },
          },
        });
        jobIds.push(job.id);
      }
      return { workerId, dispatched: rows.length, jobIds };
    },
  );
}
