import { getEnv } from "@/server/env";

import { createLocalMailSink } from "./local-sink";
import { createSmtpMailSender } from "./smtp";
import type { AuthMailSender } from "./types";

export type {
  AuthMailDeliveryResult,
  AuthMailMessage,
  AuthMailPurpose,
  AuthMailSender,
} from "./types";
export {
  clearCapturedMail,
  findCapturedMail,
  readCapturedMail,
  type CapturedMail,
} from "./local-sink";

const globalForMail = globalThis as unknown as {
  authMailSender?: AuthMailSender;
};

/**
 * Resolve the identity-recovery mail sender for the current environment.
 * Production fails closed onto SMTP; the local sink is refused there.
 */
export function getAuthMailSender(): AuthMailSender {
  if (globalForMail.authMailSender) return globalForMail.authMailSender;
  const env = getEnv();
  const sender =
    env.MAIL_DRIVER === "smtp"
      ? createSmtpMailSender()
      : createLocalMailSink();
  if (env.NODE_ENV !== "production") globalForMail.authMailSender = sender;
  return sender;
}

/** Absolute recovery-link base (validated, same-origin in production). */
export function mailBaseUrl(): string {
  return getEnv().MAIL_BASE_URL.replace(/\/+$/, "");
}
