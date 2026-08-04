/**
 * E2E runtime environment. The app under test runs against the isolated
 * hiveos_test database with self-sign-up enabled, so E2E identities are never
 * created in development or production stores.
 */
export const E2E_BASE_URL =
  process.env.HIVE_E2E_BASE_URL ?? "http://localhost:3108";

export const E2E_ENV = {
  // The E2E app is an automated-test scenario: NODE_ENV=test lets the SEC-04
  // guard permit disabling rate limiting for deterministic parallel runs.
  // A production deploy (NODE_ENV=production) would be rejected with this flag.
  NODE_ENV: "test",
  // App runs as the least-privileged runtime role.
  DATABASE_URL: "postgresql://hiveos_app:hiveos_app@localhost:5433/hiveos_test",
  // Owner role for migrations + role configuration in global setup.
  DATABASE_MIGRATION_URL:
    "postgresql://hiveos:hiveos@localhost:5433/hiveos_test",
  BETTER_AUTH_SECRET: "hiveos-e2e-secret-not-for-production-use",
  BETTER_AUTH_URL: E2E_BASE_URL,
  AUTH_ALLOW_SELF_SIGNUP: "true",
  AUTH_RATE_LIMIT_ENABLED: "false",
  STORAGE_DRIVER: "local",
  STORAGE_LOCAL_ROOT: ".storage-test",
  DEMO_FIXTURES_ENABLED: "false",
} as const;
