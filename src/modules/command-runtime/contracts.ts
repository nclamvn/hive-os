import type { Prisma } from "@prisma/client";

import type { Capability } from "@/modules/identity-workspace";
import type { TenantTransaction } from "@/server/tenant-context";

export interface CommandEnvelope {
  commandId?: string;
  idempotencyKey: string;
  commandType: string;
  correlationId?: string;
  expectedVersion?: number;
  issuedAt?: Date;
  payload: Prisma.InputJsonObject;
  requiredCapability: Capability;
  missionId?: string;
}

export interface CommandOutboxInput {
  topic: string;
  aggregateType: string;
  aggregateId: string;
  payload: Prisma.InputJsonObject;
  availableAt?: Date;
}

export interface CommandEffectResult {
  outcome: Prisma.InputJsonObject;
  outbox: CommandOutboxInput[];
}

export interface CommandExecutionContext {
  commandId: string;
  organizationId: string;
  workspaceId: string;
  actorUserId: string;
  actorOrganizationMembershipId: string;
  correlationId: string;
  expectedVersion?: number;
  issuedAt: Date;
}

export type CommandEffectHandler = (
  tx: TenantTransaction,
  context: CommandExecutionContext,
) => Promise<CommandEffectResult>;

export type StableCommandOutcome =
  | {
      commandId: string;
      status: "SUCCEEDED";
      outcome: Prisma.JsonObject;
      outboxEventIds: string[];
    }
  | {
      commandId: string;
      status: "FAILED";
      errorCode: string;
      errorMessage: string;
      outboxEventIds: string[];
    };
