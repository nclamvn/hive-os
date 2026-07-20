import type { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";

/** A Prisma client or an interactive-transaction client. */
export type DbClient = PrismaClient | Prisma.TransactionClient;

const role = z.enum(["OWNER", "ADMIN", "MEMBER", "VIEWER"]);

/**
 * Strict payload contract per event type. `.strict()` rejects unknown keys, so
 * the event type is the ONLY valid payload shape — a request-shaped object with
 * extra fields cannot pass through. Correlation and actor attribution live
 * outside the payload and are never accepted as arbitrary input.
 */
const AUDIT_PAYLOAD_SCHEMAS = {
  "workspace.created": z.object({ name: z.string(), slug: z.string() }).strict(),
  "workspace.updated": z.object({ name: z.string() }).strict(),
  "membership.created": z
    .object({ role, via: z.enum(["onboarding", "invitation"]) })
    .strict(),
  "membership.role_changed": z.object({ from: role, to: role }).strict(),
  "membership.suspended": z.object({ role }).strict(),
  "invitation.created": z.object({ email: z.string(), role }).strict(),
  "invitation.accepted": z.object({ role }).strict(),
  "invitation.revoked": z.object({ email: z.string() }).strict(),

  // Mission Kernel (TIP-004). Actor/correlation live in dedicated columns.
  "mission.created": z
    .object({ referenceCode: z.string(), title: z.string(), assuranceProfile: z.string() })
    .strict(),
  "mission.transitioned": z
    .object({ from: z.string(), to: z.string(), reason: z.string(), version: z.number().int() })
    .strict(),
  "mission.blocked": z
    .object({ from: z.string(), reason: z.string(), version: z.number().int() })
    .strict(),
  "mission.resumed": z
    .object({ to: z.string(), reason: z.string(), version: z.number().int() })
    .strict(),
  "mission.archived": z
    .object({ from: z.string(), reason: z.string(), version: z.number().int() })
    .strict(),
  "contract.created": z.object({ versionNumber: z.number().int() }).strict(),
  "contract.submitted": z.object({ versionNumber: z.number().int() }).strict(),
  "contract.approved": z.object({ versionNumber: z.number().int() }).strict(),
  "contract.superseded": z
    .object({ versionNumber: z.number().int(), supersededBy: z.number().int() })
    .strict(),
  "obligation.started": z.object({ code: z.string() }).strict(),
  "obligation.satisfied": z.object({ code: z.string(), reason: z.string() }).strict(),
  "obligation.blocked": z.object({ code: z.string(), reason: z.string() }).strict(),
  "obligation.waived": z.object({ code: z.string(), decisionId: z.string() }).strict(),
  "gate.evaluated": z
    .object({ code: z.string(), result: z.string(), reason: z.string(), linkedArtifactId: z.string().optional() })
    .strict(),
  "gate.waived": z.object({ code: z.string(), decisionId: z.string() }).strict(),
  "decision.required": z.object({ decisionType: z.string() }).strict(),
  "decision.resolved": z.object({ decisionType: z.string(), status: z.string() }).strict(),
  "escalation.created": z.object({ severity: z.string(), reason: z.string() }).strict(),
  "escalation.acknowledged": z.object({ severity: z.string() }).strict(),
  "escalation.resolved": z.object({ severity: z.string() }).strict(),
} as const;

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
  // Mission Kernel (TIP-004)
  MissionCreated: "mission.created",
  MissionTransitioned: "mission.transitioned",
  MissionBlocked: "mission.blocked",
  MissionResumed: "mission.resumed",
  MissionArchived: "mission.archived",
  ContractCreated: "contract.created",
  ContractSubmitted: "contract.submitted",
  ContractApproved: "contract.approved",
  ContractSuperseded: "contract.superseded",
  ObligationStarted: "obligation.started",
  ObligationSatisfied: "obligation.satisfied",
  ObligationBlocked: "obligation.blocked",
  ObligationWaived: "obligation.waived",
  GateEvaluated: "gate.evaluated",
  GateWaived: "gate.waived",
  DecisionRequired: "decision.required",
  DecisionResolved: "decision.resolved",
  EscalationCreated: "escalation.created",
  EscalationAcknowledged: "escalation.acknowledged",
  EscalationResolved: "escalation.resolved",
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
/**
 * Validate a payload against the strict schema for its event type. Throws on
 * an unknown event type or any shape mismatch (including unknown keys).
 */
export function validateAuditPayload(
  eventType: AuditEventTypeValue,
  payload: Record<string, unknown>,
): Record<string, unknown> {
  const schema = AUDIT_PAYLOAD_SCHEMAS[eventType];
  if (!schema) {
    throw new Error(`Audit payload rejected: unknown event type "${eventType}"`);
  }
  const result = schema.safeParse(payload);
  if (!result.success) {
    const keys = result.error.issues
      .map((i) => i.path.join(".") || "(root)")
      .join(", ");
    throw new Error(
      `Audit payload rejected for "${eventType}": invalid shape at ${keys}`,
    );
  }
  return result.data as Record<string, unknown>;
}

export async function writeAuditEvent(
  db: DbClient,
  input: AuditInput,
): Promise<void> {
  // Strict per-event schema (allowlist) first, then fail-closed redaction.
  const payload = validateAuditPayload(input.eventType, input.payload);
  assertRedactedPayload(payload);
  await db.auditEvent.create({
    data: {
      workspaceId: input.workspaceId,
      actorUserId: input.actorUserId ?? null,
      actorMembershipId: input.actorMembershipId ?? null,
      eventType: input.eventType,
      entityType: input.entityType,
      entityId: input.entityId,
      correlationId: input.correlationId,
      payload: payload as Prisma.InputJsonValue,
    },
  });
}
