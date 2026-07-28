import { describe, expect, it } from "vitest";

import { parseEnv } from "@/server/env";

const base = {
  DATABASE_URL: "postgresql://u:p@localhost:5433/hiveos_test",
  BETTER_AUTH_SECRET: "test-secret-at-least-16-chars",
};

// A production environment that satisfies the TIP-021A fail-closed rules
// (throttle secret + real SMTP mail driver + https same-origin base), used to
// assert unrelated rate-limit defaults under NODE_ENV=production.
const prod = {
  ...base,
  NODE_ENV: "production",
  BETTER_AUTH_URL: "https://app.example.com",
  AUTH_THROTTLE_SECRET: "throttle-secret-at-least-16-chars",
  MAIL_DRIVER: "smtp",
  SMTP_HOST: "smtp.example.com",
  MAIL_FROM: "HIVE OS <noreply@example.com>",
  MAIL_BASE_URL: "https://app.example.com",
};

describe("production rate-limit fail-closed guard (SEC-04)", () => {
  it("RATE-01 production + disabled is rejected", () => {
    expect(() =>
      parseEnv({ ...base, NODE_ENV: "production", AUTH_RATE_LIMIT_ENABLED: "false" }),
    ).toThrow(/AUTH_RATE_LIMIT_ENABLED/);
  });

  it("RATE-02 development + disabled is rejected", () => {
    expect(() =>
      parseEnv({ ...base, NODE_ENV: "development", AUTH_RATE_LIMIT_ENABLED: "false" }),
    ).toThrow(/AUTH_RATE_LIMIT_ENABLED/);
  });

  it("RATE-03 test + disabled is accepted", () => {
    const env = parseEnv({
      ...base,
      NODE_ENV: "test",
      AUTH_RATE_LIMIT_ENABLED: "false",
    });
    expect(env.AUTH_RATE_LIMIT_ENABLED).toBe(false);
  });

  it("RATE-04 unset defaults to enabled", () => {
    const env = parseEnv(prod);
    expect(env.AUTH_RATE_LIMIT_ENABLED).toBe(true);
  });

  it("tunable limits default to production-safe values", () => {
    const env = parseEnv(prod);
    expect(env.AUTH_RATE_LIMIT_MAX).toBe(100);
    expect(env.AUTH_RATE_LIMIT_WINDOW).toBe(60);
  });
});
