import { after } from "next/server";

import { getEnv } from "@/server/env";

import { ipDigest, userAgentDigest } from "./digest";
import {
  type AuthMailMessage,
  type AuthMailPurpose,
  getAuthMailSender,
} from "./mail";
import {
  IdentitySecurityEventType,
  IdentitySecurityOutcome,
  recordSecurityEvent,
} from "./security-events";
import { consumeDestinationThrottle } from "./throttle";

/**
 * Identity-recovery orchestration: destination throttle + append-only security
 * events + non-blocking mail dispatch. Delivery runs after the response (via
 * `after`) when a request scope exists, otherwise detached — always observed,
 * so failures are recorded, never silently lost. No recipient, token, or URL is
 * logged or persisted.
 */

interface RequestContext {
  ipDigest: string | null;
  userAgentDigest: string | null;
}

function contextFromRequest(request?: Request): RequestContext {
  const headers = request?.headers;
  const forwarded = headers?.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || headers?.get("x-real-ip") || null;
  return {
    ipDigest: ipDigest(ip),
    userAgentDigest: userAgentDigest(headers?.get("user-agent")),
  };
}

async function dispatchOrSchedule(run: () => Promise<void>): Promise<void> {
  // Tests await delivery inline so captured mail is deterministic; production
  // dispatches after the response to avoid an account-existence timing oracle.
  if (getEnv().NODE_ENV === "test") {
    await run().catch(() => undefined);
    return;
  }
  const guarded = () =>
    run().catch((err) => {
      console.warn(
        `[identity-recovery] dispatch_error reason=${err instanceof Error ? err.name : "unknown"}`,
      );
    });
  try {
    after(guarded);
  } catch {
    void guarded();
  }
}

async function deliver(
  message: AuthMailMessage,
  userId: string | null,
): Promise<void> {
  const result = await getAuthMailSender().send(message);
  if (!result.delivered) {
    await recordSecurityEvent({
      eventType: IdentitySecurityEventType.MAIL_DELIVERY_FAILED,
      outcome: IdentitySecurityOutcome.FAILURE,
      correlationId: result.correlationId,
      userId,
      payload: {
        purpose: message.purpose,
        reason: result.error ?? "unknown",
      },
    });
  }
}

function messageFor(
  purpose: AuthMailPurpose,
  to: string,
  actionUrl?: string,
): AuthMailMessage {
  switch (purpose) {
    case "VERIFY_EMAIL":
      return {
        to,
        purpose,
        subject: "Confirm your HIVE OS email",
        text:
          "Confirm your email to finish setting up HIVE OS.\n\n" +
          `${actionUrl}\n\n` +
          "This link expires in 1 hour and can be used once. " +
          "If you did not create an account, you can ignore this message.",
        actionUrl,
      };
    case "RESET_PASSWORD":
      return {
        to,
        purpose,
        subject: "Reset your HIVE OS password",
        text:
          "We received a request to reset your HIVE OS password.\n\n" +
          `${actionUrl}\n\n` +
          "This link expires in 30 minutes and can be used once. " +
          "If you did not request this, ignore this message; your password stays unchanged.",
        actionUrl,
      };
    case "PASSWORD_CHANGED_NOTICE":
      return {
        to,
        purpose,
        subject: "Your HIVE OS password was changed",
        text:
          "Your HIVE OS password was just changed and all existing sessions were signed out.\n\n" +
          "If this was not you, reset your password again immediately and contact your workspace owner.",
      };
    case "EXISTING_ACCOUNT_SIGNUP_NOTICE":
      return {
        to,
        purpose,
        subject: "A HIVE OS sign-up used your email",
        text:
          "Someone tried to sign up for HIVE OS with this email, which already has an account.\n\n" +
          "If this was you, sign in instead or reset your password. If not, you can ignore this message.",
      };
  }
}

/** Better Auth `sendVerificationEmail` handler. */
export async function onSendVerificationEmail(args: {
  email: string;
  url: string;
  userId: string;
  request?: Request;
}): Promise<void> {
  const ctx = contextFromRequest(args.request);
  const { allowed } = await consumeDestinationThrottle(
    args.email,
    "email-verification",
  );
  await recordSecurityEvent({
    eventType: IdentitySecurityEventType.EMAIL_VERIFICATION_REQUESTED,
    outcome: allowed
      ? IdentitySecurityOutcome.SUCCESS
      : IdentitySecurityOutcome.FAILURE,
    userId: args.userId,
    ipDigest: ctx.ipDigest,
    userAgentDigest: ctx.userAgentDigest,
    payload: { throttled: !allowed },
  });
  if (!allowed) return;
  await dispatchOrSchedule(() =>
    deliver(messageFor("VERIFY_EMAIL", args.email, args.url), args.userId),
  );
}

/** Better Auth `sendResetPassword` handler (existing accounts only). */
export async function onSendResetPassword(args: {
  email: string;
  url: string;
  userId: string;
  request?: Request;
}): Promise<void> {
  const ctx = contextFromRequest(args.request);
  const { allowed } = await consumeDestinationThrottle(
    args.email,
    "password-reset",
  );
  await recordSecurityEvent({
    eventType: IdentitySecurityEventType.PASSWORD_RESET_REQUESTED,
    outcome: allowed
      ? IdentitySecurityOutcome.SUCCESS
      : IdentitySecurityOutcome.FAILURE,
    userId: args.userId,
    ipDigest: ctx.ipDigest,
    userAgentDigest: ctx.userAgentDigest,
    payload: { throttled: !allowed },
  });
  if (!allowed) return;
  await dispatchOrSchedule(() =>
    deliver(messageFor("RESET_PASSWORD", args.email, args.url), args.userId),
  );
}

/** Better Auth `onPasswordReset` handler. */
export async function onPasswordResetCompleted(args: {
  email: string;
  userId: string;
}): Promise<void> {
  await recordSecurityEvent({
    eventType: IdentitySecurityEventType.PASSWORD_RESET_COMPLETED,
    outcome: IdentitySecurityOutcome.SUCCESS,
    userId: args.userId,
  });
  await recordSecurityEvent({
    eventType: IdentitySecurityEventType.PASSWORD_CHANGED,
    outcome: IdentitySecurityOutcome.SUCCESS,
    userId: args.userId,
  });
  await recordSecurityEvent({
    eventType: IdentitySecurityEventType.SESSIONS_REVOKED,
    outcome: IdentitySecurityOutcome.SUCCESS,
    userId: args.userId,
    payload: { scope: "password_reset" },
  });
  await dispatchOrSchedule(() =>
    deliver(messageFor("PASSWORD_CHANGED_NOTICE", args.email), args.userId),
  );
}

/**
 * Better Auth `onExistingUserSignUp` handler. Someone attempted to sign up with
 * an email that already has an account. Better Auth already returns a generic
 * response (no enumeration); here we notify the real owner. We never send a
 * verification email for this and never reveal anything to the requester.
 */
export async function onExistingAccountSignup(args: {
  email: string;
  userId: string;
  request?: Request;
}): Promise<void> {
  const { allowed } = await consumeDestinationThrottle(
    args.email,
    "existing-signup-notice",
  );
  if (!allowed) return;
  await dispatchOrSchedule(() =>
    deliver(messageFor("EXISTING_ACCOUNT_SIGNUP_NOTICE", args.email), args.userId),
  );
}

/** Better Auth `afterEmailVerification` handler. */
export async function onEmailVerified(args: { userId: string }): Promise<void> {
  await recordSecurityEvent({
    eventType: IdentitySecurityEventType.EMAIL_VERIFICATION_COMPLETED,
    outcome: IdentitySecurityOutcome.SUCCESS,
    userId: args.userId,
  });
}
