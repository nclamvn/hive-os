import { describe, expect, it } from "vitest";

import { parseEnv } from "@/server/env";
import { databasePoolConfig } from "@/server/db";

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
    expect(env.DB_POOL_MAX).toBe(10);
    expect(env.DB_STATEMENT_TIMEOUT_MS).toBe(30_000);
    expect(env.DB_SLOW_QUERY_MS).toBe(1_000);
    expect(env.RESEARCH_WORKER_ENABLED).toBe(false);
  });

  it("TIP-024C fails closed when a worker adapter lacks credentials or a pinned runtime registry", () => {
    expect(() => parseEnv({
      ...validBase,
      RESEARCH_WORKER_ENABLED: "true",
      RESEARCH_OPENAI_ENABLED: "true",
    })).toThrow(/RESEARCH_WORKER_ORGANIZATION_ID[\s\S]*RESEARCH_WORKER_ACTOR_USER_ID[\s\S]*OPENAI_API_KEY/);
    expect(() => parseEnv({
      ...validBase,
      SANDBOX_DOCKER_ENABLED: "true",
    })).toThrow(/SANDBOX_RUNTIME_REGISTRY_JSON/);
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
      S3_SERVER_SIDE_ENCRYPTION: "AES256",
    });
    expect(env.STORAGE_DRIVER).toBe("s3");
    expect(env.S3_FORCE_PATH_STYLE).toBe(true);
  });

  it("PRC-02 requires an explicit safe production deployment contract", () => {
    expect(() =>
      parseEnv({
        ...validBase,
        NODE_ENV: "production",
      }),
    ).toThrowError(/DEPLOYMENT_ENV/);
    expect(() =>
      parseEnv({
        ...validBase,
        NODE_ENV: "production",
        DEPLOYMENT_ENV: "staging",
      }),
    ).toThrowError(/STORAGE_DRIVER/);
  });

  it("accepts a complete provider-neutral production contract", () => {
    const env = parseEnv({
      ...validBase,
      NODE_ENV: "production",
      DEPLOYMENT_ENV: "production",
      STORAGE_DRIVER: "s3",
      S3_REGION: "us-east-1",
      S3_BUCKET: "hiveos-production",
      S3_ACCESS_KEY_ID: "key",
      S3_SECRET_ACCESS_KEY: "secret",
      S3_SERVER_SIDE_ENCRYPTION: "AES256",
      AUTH_THROTTLE_SECRET: "throttle-secret-at-least-16",
      BETTER_AUTH_URL: "https://app.example.com",
      MAIL_DRIVER: "smtp",
      SMTP_HOST: "smtp.example.com",
      MAIL_FROM: "HIVE OS <noreply@example.com>",
      MAIL_BASE_URL: "https://app.example.com",
    });
    expect(env.DEPLOYMENT_ENV).toBe("production");
    expect(env.STORAGE_DRIVER).toBe("s3");
  });

  it("PRC-06 rejects unsafe database pool and timeout values", () => {
    expect(() =>
      parseEnv({ ...validBase, DB_POOL_MAX: "0" }),
    ).toThrowError(/DB_POOL_MAX/);
    expect(() =>
      parseEnv({ ...validBase, DB_STATEMENT_TIMEOUT_MS: "999999" }),
    ).toThrowError(/DB_STATEMENT_TIMEOUT_MS/);
  });

  it("PRC-06 applies validated database pool and timeout values", () => {
    const env = parseEnv({
      ...validBase,
      DB_POOL_MAX: "12",
      DB_CONNECTION_TIMEOUT_MS: "2500",
      DB_IDLE_TIMEOUT_MS: "45000",
      DB_STATEMENT_TIMEOUT_MS: "20000",
      DB_SLOW_QUERY_MS: "750",
    });
    expect(databasePoolConfig(env)).toMatchObject({
      max: 12,
      connectionTimeoutMillis: 2500,
      idleTimeoutMillis: 45000,
      statement_timeout: 20000,
    });
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
