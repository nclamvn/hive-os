import { describe, expect, it } from "vitest";

import { parseEnv } from "@/server/env";

const validBase = {
  NODE_ENV: "test",
  DATABASE_URL: "postgresql://user:pass@localhost:5433/hiveos_test",
  BETTER_AUTH_SECRET: "test-secret-at-least-16-chars",
};

describe("environment schema", () => {
  it("accepts a minimal valid environment with defaults", () => {
    const env = parseEnv(validBase);
    expect(env.STORAGE_DRIVER).toBe("local");
    expect(env.STORAGE_LOCAL_ROOT).toBe(".storage");
    expect(env.DEMO_FIXTURES_ENABLED).toBe(false);
  });

  it("rejects a missing DATABASE_URL and names the variable", () => {
    expect(() => parseEnv({ NODE_ENV: "test" })).toThrowError(/DATABASE_URL/);
  });

  it("rejects a non-postgres DATABASE_URL", () => {
    expect(() =>
      parseEnv({ ...validBase, DATABASE_URL: "mysql://x" }),
    ).toThrowError(/DATABASE_URL/);
  });

  it("never leaks environment values in validation errors", () => {
    const secret = "postgresql-secret-value-abc123";
    try {
      parseEnv({ NODE_ENV: "test", DATABASE_URL: "", S3_BUCKET: secret });
      expect.unreachable("parse should have failed");
    } catch (error) {
      expect(String(error)).not.toContain(secret);
    }
  });

  it("requires S3 credentials when STORAGE_DRIVER=s3", () => {
    expect(() =>
      parseEnv({ ...validBase, STORAGE_DRIVER: "s3" }),
    ).toThrowError(/S3_REGION[\s\S]*S3_BUCKET[\s\S]*S3_ACCESS_KEY_ID[\s\S]*S3_SECRET_ACCESS_KEY/);
  });

  it("accepts s3 driver with full credentials", () => {
    const env = parseEnv({
      ...validBase,
      STORAGE_DRIVER: "s3",
      S3_REGION: "us-east-1",
      S3_BUCKET: "hiveos",
      S3_ACCESS_KEY_ID: "key",
      S3_SECRET_ACCESS_KEY: "secret",
      S3_FORCE_PATH_STYLE: "true",
    });
    expect(env.STORAGE_DRIVER).toBe("s3");
    expect(env.S3_FORCE_PATH_STYLE).toBe(true);
  });

  it("forbids demo fixtures in production", () => {
    expect(() =>
      parseEnv({
        ...validBase,
        NODE_ENV: "production",
        DEMO_FIXTURES_ENABLED: "true",
      }),
    ).toThrowError(/DEMO_FIXTURES_ENABLED/);
  });

  it("allows demo fixtures outside production only when explicitly enabled", () => {
    const env = parseEnv({ ...validBase, DEMO_FIXTURES_ENABLED: "true" });
    expect(env.DEMO_FIXTURES_ENABLED).toBe(true);
  });
});
