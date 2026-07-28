import { beforeAll, describe, expect, it } from "vitest";

import {
  destinationDigest,
  ipDigest,
  normalizeEmail,
} from "@/server/auth/digest";
import {
  IdentitySecurityEventType,
  parseSecurityEventPayload,
} from "@/server/auth/security-events";
import { parseEnv, resetEnvCache } from "@/server/env";

beforeAll(() => {
  process.env.DATABASE_URL ??=
    "postgresql://u:p@localhost:5433/hiveos_test";
  process.env.BETTER_AUTH_SECRET ??= "test-secret-at-least-16-chars";
  resetEnvCache();
});

const prodBase = {
  NODE_ENV: "production",
  DATABASE_URL: "postgresql://u:p@db/hiveos",
  BETTER_AUTH_SECRET: "prod-secret-at-least-16-chars",
  BETTER_AUTH_URL: "https://app.example.com",
  AUTH_THROTTLE_SECRET: "prod-throttle-secret-16+chars",
};
const prodMail = {
  MAIL_DRIVER: "smtp",
  SMTP_HOST: "smtp.example.com",
  MAIL_FROM: "HIVE OS <noreply@example.com>",
  MAIL_BASE_URL: "https://app.example.com",
};

describe("security-event payload schemas (IR-32)", () => {
  it("accepts a valid payload", () => {
    expect(
      parseSecurityEventPayload(
        IdentitySecurityEventType.EMAIL_VERIFICATION_REQUESTED,
        { throttled: false },
      ),
    ).toEqual({ throttled: false });
  });

  it("rejects unknown keys", () => {
    expect(() =>
      parseSecurityEventPayload(
        IdentitySecurityEventType.EMAIL_VERIFICATION_REQUESTED,
        { throttled: false, email: "x" },
      ),
    ).toThrow();
  });

  it("rejects a value that looks like an email address", () => {
    expect(() =>
      parseSecurityEventPayload(
        IdentitySecurityEventType.MAIL_DELIVERY_FAILED,
        { purpose: "VERIFY_EMAIL", reason: "user@example.com" },
      ),
    ).toThrow(/email or URL/);
  });

  it("rejects a value that looks like a URL", () => {
    expect(() =>
      parseSecurityEventPayload(
        IdentitySecurityEventType.MAIL_DELIVERY_FAILED,
        { purpose: "VERIFY_EMAIL", reason: "https://app.example.com/x" },
      ),
    ).toThrow(/email or URL/);
  });

  it("rejects an out-of-enum reject reason", () => {
    expect(() =>
      parseSecurityEventPayload(
        IdentitySecurityEventType.PASSWORD_RESET_REJECTED,
        { reason: "mystery" },
      ),
    ).toThrow();
  });
});

describe("keyed digests", () => {
  it("is deterministic and email-normalized", () => {
    const a = destinationDigest("User@Example.com ", "password-reset");
    const b = destinationDigest("user@example.com", "password-reset");
    expect(a).toBe(b);
    expect(normalizeEmail("  Foo@Bar.COM ")).toBe("foo@bar.com");
  });

  it("differs across purposes and never contains the raw value", () => {
    const verify = destinationDigest("user@example.com", "email-verification");
    const reset = destinationDigest("user@example.com", "password-reset");
    expect(verify).not.toBe(reset);
    expect(verify).not.toContain("user@example.com");
  });

  it("digests IP without exposing the raw address", () => {
    expect(ipDigest(null)).toBeNull();
    expect(ipDigest("")).toBeNull();
    const d = ipDigest("203.0.113.7");
    expect(d).toBeTruthy();
    expect(d).not.toContain("203.0.113.7");
  });
});

describe("production mail fail-closed (IR-30)", () => {
  it("rejects the local mail sink in production", () => {
    expect(() => parseEnv({ ...prodBase, MAIL_DRIVER: "local" })).toThrow(
      /MAIL_DRIVER/,
    );
  });

  it("rejects smtp without a host", () => {
    expect(() =>
      parseEnv({ ...prodBase, MAIL_DRIVER: "smtp", MAIL_BASE_URL: "https://app.example.com", MAIL_FROM: "x@y.z" }),
    ).toThrow(/SMTP_HOST/);
  });

  it("requires an https same-origin recovery base", () => {
    expect(() =>
      parseEnv({ ...prodBase, ...prodMail, MAIL_BASE_URL: "http://app.example.com" }),
    ).toThrow(/MAIL_BASE_URL/);
  });

  it("accepts a complete production recovery configuration", () => {
    const env = parseEnv({ ...prodBase, ...prodMail });
    expect(env.MAIL_DRIVER).toBe("smtp");
  });

  it("requires the throttle secret outside tests", () => {
    const { AUTH_THROTTLE_SECRET: _omit, ...noSecret } = { ...prodBase, ...prodMail };
    void _omit;
    expect(() => parseEnv(noSecret)).toThrow(/AUTH_THROTTLE_SECRET/);
  });
});
