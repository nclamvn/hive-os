import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";

import { getDb } from "../db";
import { getEnv } from "../env";
import {
  onEmailVerified,
  onPasswordResetCompleted,
  onSendResetPassword,
  onSendVerificationEmail,
} from "./recovery-mail";

/**
 * Better Auth owns users, accounts, sessions, and verification records plus
 * the secure authentication endpoints and cookies. HIVE OS retains authority
 * over Workspace / Membership / Invitation / audit semantics — the
 * Organization plugin is intentionally NOT used.
 */
function createAuth() {
  const env = getEnv();
  return betterAuth({
    appName: "HIVE OS",
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    database: prismaAdapter(getDb(), { provider: "postgresql" }),
    emailAndPassword: {
      enabled: true,
      // Production defaults to self-sign-up disabled (env-controlled).
      disableSignUp: !env.AUTH_ALLOW_SELF_SIGNUP,
      // TIP-021A: a credential user cannot hold a session until verified.
      requireEmailVerification: true,
      // Length-only policy: no arbitrary composition requirements.
      minPasswordLength: 12,
      maxPasswordLength: 128,
      // Reset tokens are short-lived and single-use; all sessions drop on reset.
      resetPasswordTokenExpiresIn: 1800,
      revokeSessionsOnPasswordReset: true,
      // The reset request never reveals whether the account exists; delivery is
      // throttled and dispatched off the response path (recovery-mail).
      sendResetPassword: async ({ user, url }, request) => {
        await onSendResetPassword({
          email: user.email,
          url,
          userId: user.id,
          request,
        });
      },
      // Fired after a successful reset: notify, revoke sessions, record events.
      onPasswordReset: async ({ user }) => {
        await onPasswordResetCompleted({ email: user.email, userId: user.id });
      },
    },
    emailVerification: {
      sendOnSignUp: true,
      sendOnSignIn: false,
      autoSignInAfterVerification: false,
      // 1 hour, single-use.
      expiresIn: 3600,
      sendVerificationEmail: async ({ user, url }, request) => {
        await onSendVerificationEmail({
          email: user.email,
          url,
          userId: user.id,
          request,
        });
      },
      afterEmailVerification: async (user) => {
        await onEmailVerified({ userId: user.id });
      },
    },
    // Store verification/reset identifiers hashed at rest (SHA-256): the raw
    // token is never recoverable from the database.
    verification: {
      storeIdentifier: "hashed",
    },
    // Keep auth callbacks same-origin.
    trustedOrigins: [env.BETTER_AUTH_URL],
    // Rate limiting is on by default (production-safe). It can be disabled only
    // under NODE_ENV=test (enforced by the env schema); limits are tunable.
    rateLimit: {
      enabled: env.AUTH_RATE_LIMIT_ENABLED,
      window: env.AUTH_RATE_LIMIT_WINDOW,
      max: env.AUTH_RATE_LIMIT_MAX,
      // Stricter per-endpoint IP limits for recovery/abuse surfaces. Destination
      // throttling (keyed digest) is layered on top in TIP-021A Phase 2.
      customRules: {
        "/sign-up/email": { window: 3600, max: 10 },
        "/send-verification-email": { window: 900, max: 5 },
        "/request-password-reset": { window: 900, max: 5 },
        "/forget-password": { window: 900, max: 5 },
        "/reset-password": { window: 900, max: 10 },
      },
    },
    plugins: [nextCookies()],
  });
}

const globalForAuth = globalThis as unknown as {
  auth?: ReturnType<typeof createAuth>;
};

export const auth = globalForAuth.auth ?? createAuth();
if (process.env.NODE_ENV !== "production") globalForAuth.auth = auth;

export type Auth = typeof auth;
