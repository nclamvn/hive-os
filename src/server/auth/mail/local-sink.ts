import { randomUUID } from "node:crypto";

import { getEnv } from "@/server/env";

import type {
  AuthMailDeliveryResult,
  AuthMailMessage,
  AuthMailSender,
} from "./types";

/**
 * Non-production mail sink. It captures full messages (including the action
 * link) in memory so development and tests can exercise recovery flows without
 * a real provider. It refuses to construct in production, and it exposes no
 * route or artifact — captured data stays inside the dev/test data boundary.
 */

export interface CapturedMail extends AuthMailMessage {
  correlationId: string;
  capturedAt: number;
}

const captured: CapturedMail[] = [];

class LocalMailSink implements AuthMailSender {
  readonly driver = "local" as const;

  async send(message: AuthMailMessage): Promise<AuthMailDeliveryResult> {
    const correlationId = randomUUID();
    captured.push({ ...message, correlationId, capturedAt: Date.now() });
    return { delivered: true, correlationId };
  }
}

export function createLocalMailSink(): AuthMailSender {
  if (getEnv().NODE_ENV === "production") {
    throw new Error(
      "local mail sink is unavailable in production (fail-closed)",
    );
  }
  return new LocalMailSink();
}

/** Test/dev helper: read captured messages (never available in production). */
export function readCapturedMail(): readonly CapturedMail[] {
  return captured;
}

/** Test/dev helper: most recent captured message for a recipient + purpose. */
export function findCapturedMail(
  to: string,
  purpose: AuthMailMessage["purpose"],
): CapturedMail | undefined {
  for (let i = captured.length - 1; i >= 0; i -= 1) {
    if (captured[i].to === to && captured[i].purpose === purpose) {
      return captured[i];
    }
  }
  return undefined;
}

/** Test/dev helper: clear captured messages between runs. */
export function clearCapturedMail(): void {
  captured.length = 0;
}
