import { randomUUID } from "node:crypto";

import {
  IdentitySecurityEventType,
  IdentitySecurityOutcome,
  type Prisma,
} from "@prisma/client";
import { z } from "zod";

import { getDb } from "@/server/db";

/**
 * Append-only identity security ledger writer.
 *
 * Every payload is validated against a strict per-event-type schema that
 * rejects unknown keys, and a defensive scan rejects any value that looks like
 * an email address or URL. Payloads never carry email, password, raw token,
 * recovery URL, session token, or secret.
 */

export { IdentitySecurityEventType, IdentitySecurityOutcome };

const rejectReason = z.enum(["expired", "consumed", "invalid"]);
const mailPurpose = z.enum([
  "VERIFY_EMAIL",
  "RESET_PASSWORD",
  "PASSWORD_CHANGED_NOTICE",
  "EXISTING_ACCOUNT_SIGNUP_NOTICE",
]);

const PAYLOAD_SCHEMAS: Record<IdentitySecurityEventType, z.ZodTypeAny> = {
  EMAIL_VERIFICATION_REQUESTED: z.object({ throttled: z.boolean() }).strict(),
  EMAIL_VERIFICATION_COMPLETED: z.object({}).strict(),
  EMAIL_VERIFICATION_REJECTED: z.object({ reason: rejectReason }).strict(),
  PASSWORD_RESET_REQUESTED: z.object({ throttled: z.boolean() }).strict(),
  PASSWORD_RESET_COMPLETED: z.object({}).strict(),
  PASSWORD_RESET_REJECTED: z.object({ reason: rejectReason }).strict(),
  PASSWORD_CHANGED: z.object({}).strict(),
  SESSIONS_REVOKED: z
    .object({ scope: z.enum(["password_reset", "manual"]) })
    .strict(),
  MAIL_DELIVERY_FAILED: z
    .object({ purpose: mailPurpose, reason: z.string().max(120) })
    .strict(),
};

/** Reject any value that looks like an email address or URL. */
function assertNoSensitive(payload: Record<string, unknown>): void {
  for (const value of Object.values(payload)) {
    if (typeof value !== "string") continue;
    if (value.includes("@") || /https?:\/\//i.test(value)) {
      throw new Error("security-event payload may not contain email or URL");
    }
  }
}

/** Validate a payload for an event type; throws on any violation. Testable. */
export function parseSecurityEventPayload(
  eventType: IdentitySecurityEventType,
  payload: unknown,
): Record<string, unknown> {
  const parsed = PAYLOAD_SCHEMAS[eventType].parse(payload ?? {}) as Record<
    string,
    unknown
  >;
  assertNoSensitive(parsed);
  return parsed;
}

export interface SecurityEventInput {
  eventType: IdentitySecurityEventType;
  outcome: IdentitySecurityOutcome;
  correlationId?: string;
  userId?: string | null;
  ipDigest?: string | null;
  userAgentDigest?: string | null;
  payload?: unknown;
}

/**
 * Record an identity security event. Validation failures and write errors are
 * contained: recording must never break an authentication flow.
 */
export async function recordSecurityEvent(
  input: SecurityEventInput,
): Promise<void> {
  try {
    const payload = parseSecurityEventPayload(input.eventType, input.payload);
    await getDb().identitySecurityEvent.create({
      data: {
        eventType: input.eventType,
        outcome: input.outcome,
        correlationId: input.correlationId ?? randomUUID(),
        userId: input.userId ?? null,
        ipDigest: input.ipDigest ?? null,
        userAgentDigest: input.userAgentDigest ?? null,
        payload: payload as Prisma.InputJsonValue,
      },
    });
  } catch (error) {
    // Keep authentication available, but never make a failed security-ledger
    // write invisible. Only schema-safe enum values and the error class are
    // emitted; messages can contain rejected payload values or DB details.
    console.error("[identity-security-event] recording failed", {
      eventType: input.eventType,
      outcome: input.outcome,
      errorType: error instanceof Error ? error.name : "UnknownError",
    });
  }
}
