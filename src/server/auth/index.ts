import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";

import { getDb } from "../db";
import { getEnv } from "../env";

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
      // No fake verification/reset flows are wired in TIP-003.
      requireEmailVerification: false,
    },
    // Keep auth callbacks same-origin.
    trustedOrigins: [env.BETTER_AUTH_URL],
    // Rate limiting is on by default (production-safe). It can be disabled only
    // under NODE_ENV=test (enforced by the env schema); limits are tunable.
    rateLimit: {
      enabled: env.AUTH_RATE_LIMIT_ENABLED,
      window: env.AUTH_RATE_LIMIT_WINDOW,
      max: env.AUTH_RATE_LIMIT_MAX,
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
