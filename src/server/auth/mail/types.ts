/**
 * Provider-independent identity-recovery mail boundary.
 *
 * HIVE OS owns mail delivery; Better Auth only asks this boundary to send a
 * message. No provider SDK leaks past this interface, and no raw token, full
 * recovery URL, or SMTP credential is ever logged by an implementation.
 */

export type AuthMailPurpose =
  | "VERIFY_EMAIL"
  | "RESET_PASSWORD"
  | "PASSWORD_CHANGED_NOTICE"
  | "EXISTING_ACCOUNT_SIGNUP_NOTICE";

export interface AuthMailMessage {
  to: string;
  purpose: AuthMailPurpose;
  subject: string;
  text: string;
  /**
   * Absolute action link, present only for VERIFY_EMAIL and RESET_PASSWORD.
   * The link carries a single-use token and must never be logged or persisted.
   */
  actionUrl?: string;
}

export interface AuthMailDeliveryResult {
  delivered: boolean;
  /** Correlation id for tracing a delivery without exposing recipient/token. */
  correlationId: string;
  /** Non-sensitive failure summary (never contains recipient, token, or URL). */
  error?: string;
}

export interface AuthMailSender {
  readonly driver: "local" | "smtp";
  send(message: AuthMailMessage): Promise<AuthMailDeliveryResult>;
}
