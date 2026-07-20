import { execSync } from "node:child_process";

import { E2E_ENV } from "./env";

/**
 * Prepare the isolated test database before the E2E app serves: migrate as the
 * owner role, then configure the least-privileged runtime role. (The app is
 * built by the `test:e2e` script before Playwright launches the web server.)
 */
export default function globalSetup() {
  const dbEnv = {
    ...process.env,
    DATABASE_URL: E2E_ENV.DATABASE_URL,
    DATABASE_MIGRATION_URL: E2E_ENV.DATABASE_MIGRATION_URL,
  };
  execSync("npx prisma migrate deploy", { stdio: "inherit", env: dbEnv });
  execSync("node scripts/db/apply-app-role.mjs", { stdio: "inherit", env: dbEnv });
}
