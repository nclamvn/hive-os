import type { Prisma, PrismaClient } from "@prisma/client";

/** A Prisma client or an interactive-transaction client. */
export type DbClient = PrismaClient | Prisma.TransactionClient;

/** Canonical governed event types for Identity & Workspace. */
export const AuditEventType = {
  WorkspaceCreated: "workspace.created",
  WorkspaceUpdated: "workspace.updated",
  MembershipCreated: "membership.created",
  MembershipRoleChanged: "membership.role_changed",
  MembershipSuspended: "membership.suspended",
  InvitationCreated: "invitation.created",
  InvitationAccepted: "invitation.accepted",
  InvitationRevoked: "invitation.revoked",
} as const;

export type AuditEventTypeValue =
  (typeof AuditEventType)[keyof typeof AuditEventType];

export interface AuditInput {
  workspaceId: string;
  actorUserId?: string | null;
  actorMembershipId?: string | null;
  eventType: AuditEventTypeValue;
  entityType: string;
  entityId: string;
  correlationId: string;
  payload: Record<string, unknown>;
}

// Keys whose presence anywhere in a payload indicates a secret leaked in.
const FORBIDDEN_KEY = /pass|token|secret|hash|cookie|authorization|session|credential|api[-_]?key|database[-_]?url/i;

/**
 * Fail closed: reject any payload that contains a key resembling a credential
 * or secret. Callers build payloads from an explicit safe allowlist; this is
 * defense in depth against accidental serialization of sensitive fields.
 */
export function assertRedactedPayload(
  payload: Record<string, unknown>,
  path = "payload",
): void {
  for (const [key, value] of Object.entries(payload)) {
    if (FORBIDDEN_KEY.test(key)) {
      throw new Error(
        `Audit payload rejected: forbidden key "${path}.${key}" may contain a secret`,
      );
    }
    if (value && typeof value === "object" && !Array.isArray(value)) {
      assertRedactedPayload(value as Record<string, unknown>, `${path}.${key}`);
    }
  }
}

/**
 * Append an audit event. There is deliberately no update/delete counterpart;
 * the `audit_event` table also rejects UPDATE/DELETE at the database level.
 */
export async function writeAuditEvent(
  db: DbClient,
  input: AuditInput,
): Promise<void> {
  assertRedactedPayload(input.payload);
  await db.auditEvent.create({
    data: {
      workspaceId: input.workspaceId,
      actorUserId: input.actorUserId ?? null,
      actorMembershipId: input.actorMembershipId ?? null,
      eventType: input.eventType,
      entityType: input.entityType,
      entityId: input.entityId,
      correlationId: input.correlationId,
      payload: input.payload as Prisma.InputJsonValue,
    },
  });
}
