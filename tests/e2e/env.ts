/**
 * E2E runtime environment. The app under test runs against the isolated
 * hiveos_test database with self-sign-up enabled, so E2E identities are never
 * created in development or production stores.
 */
export const E2E_ENV = {
  DATABASE_URL: "postgresql://hiveos:hiveos@localhost:5433/hiveos_test",
  BETTER_AUTH_SECRET: "hiveos-e2e-secret-not-for-production-use",
  BETTER_AUTH_URL: "http://localhost:3000",
  AUTH_ALLOW_SELF_SIGNUP: "true",
  AUTH_RATE_LIMIT_ENABLED: "false",
  STORAGE_DRIVER: "local",
  STORAGE_LOCAL_ROOT: ".storage-test",
  DEMO_FIXTURES_ENABLED: "false",
} as const;
