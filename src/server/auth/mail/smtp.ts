import { randomUUID } from "node:crypto";

import nodemailer, { type Transporter } from "nodemailer";

import { getEnv } from "@/server/env";

import type {
  AuthMailDeliveryResult,
  AuthMailMessage,
  AuthMailSender,
} from "./types";

/**
 * Generic SMTP adapter. It is the only production-capable driver. Credentials
 * are read from the validated environment and never logged; delivery failures
 * are summarised without recipient, token, or URL.
 */
class SmtpMailSender implements AuthMailSender {
  readonly driver = "smtp" as const;
  #transport: Transporter | null = null;

  #transporter(): Transporter {
    if (this.#transport) return this.#transport;
    const env = getEnv();
    if (!env.SMTP_HOST) {
      // Guarded by env.superRefine, but fail closed if reached.
      throw new Error("SMTP driver selected without SMTP_HOST");
    }
    this.#transport = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT ?? (env.SMTP_SECURE ? 465 : 587),
      secure: env.SMTP_SECURE,
      auth:
        env.SMTP_USERNAME && env.SMTP_PASSWORD
          ? { user: env.SMTP_USERNAME, pass: env.SMTP_PASSWORD }
          : undefined,
    });
    return this.#transport;
  }

  async send(message: AuthMailMessage): Promise<AuthMailDeliveryResult> {
    const correlationId = randomUUID();
    const env = getEnv();
    try {
      await this.#transporter().sendMail({
        from: env.MAIL_FROM,
        replyTo: env.MAIL_REPLY_TO,
        to: message.to,
        subject: message.subject,
        text: message.text,
      });
      return { delivered: true, correlationId };
    } catch {
      // Never surface recipient, token, URL, or SMTP credentials.
      return {
        delivered: false,
        correlationId,
        error: "smtp delivery failed",
      };
    }
  }
}

export function createSmtpMailSender(): AuthMailSender {
  return new SmtpMailSender();
}
