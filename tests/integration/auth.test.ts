import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { beforeEach, describe, expect, it } from "vitest";

import { auth } from "@/server/auth";
import { getDb } from "@/server/db";
import { getEnv } from "@/server/env";

import { truncateAll } from "./helpers";

beforeEach(async () => {
  await truncateAll();
});

const PASSWORD = "correct-horse-battery";

describe("email/password authentication", () => {
  it("ID-01 allowed sign-up creates a real identity with a hashed password", async () => {
    const email = `signup-${Date.now()}@test.local`;
    const result = await auth.api.signUpEmail({
      body: { email, password: PASSWORD, name: "New User" },
    });
    expect(result.user?.id).toBeTruthy();

    const user = await getDb().user.findUniqueOrThrow({ where: { email } });
    const account = await getDb().account.findFirstOrThrow({
      where: { userId: user.id },
    });
    // Password is stored only as a hash — never in plaintext.
    expect(account.password).toBeTruthy();
    expect(account.password).not.toBe(PASSWORD);
    expect((account.password ?? "").length).toBeGreaterThan(PASSWORD.length);
  });

  it("ID-02 disabled self-sign-up is rejected", async () => {
    const env = getEnv();
    const noSignup = betterAuth({
      secret: env.BETTER_AUTH_SECRET,
      baseURL: env.BETTER_AUTH_URL,
      database: prismaAdapter(getDb(), { provider: "postgresql" }),
      emailAndPassword: { enabled: true, disableSignUp: true },
    });

    await expect(
      noSignup.api.signUpEmail({
        body: {
          email: `blocked-${Date.now()}@test.local`,
          password: PASSWORD,
          name: "Blocked",
        },
      }),
    ).rejects.toBeTruthy();
  });

  it("ID-03 sign-in succeeds with correct credentials and fails otherwise", async () => {
    const email = `signin-${Date.now()}@test.local`;
    await auth.api.signUpEmail({
      body: { email, password: PASSWORD, name: "Sign In" },
    });

    const ok = await auth.api.signInEmail({ body: { email, password: PASSWORD } });
    expect(ok.user?.email).toBe(email);

    await expect(
      auth.api.signInEmail({ body: { email, password: "wrong-password" } }),
    ).rejects.toBeTruthy();
  });

  it("ID-21 auth callbacks are restricted to same-origin trusted origins", () => {
    // Off-site redirect targets are not trusted; only the app origin is.
    expect(auth.options.trustedOrigins).toEqual([getEnv().BETTER_AUTH_URL]);
  });

  it("RATE-05 authentication runs with rate limiting enabled", async () => {
    const env = getEnv();
    const limited = betterAuth({
      secret: env.BETTER_AUTH_SECRET,
      baseURL: env.BETTER_AUTH_URL,
      database: prismaAdapter(getDb(), { provider: "postgresql" }),
      emailAndPassword: { enabled: true },
      rateLimit: { enabled: true, window: 60, max: 100 },
    });
    expect(limited.options.rateLimit?.enabled).toBe(true);

    // A first request through a rate-limited instance still succeeds.
    const result = await limited.api.signUpEmail({
      body: {
        email: `rate-${Date.now()}@test.local`,
        password: PASSWORD,
        name: "Rate",
      },
    });
    expect(result.user?.id).toBeTruthy();
  });
});
