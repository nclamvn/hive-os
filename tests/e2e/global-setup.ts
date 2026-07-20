import { execSync } from "node:child_process";

import { E2E_ENV } from "./env";

/** Ensure the isolated test database is migrated before the E2E app starts. */
export default function globalSetup() {
  execSync("npx prisma migrate deploy", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: E2E_ENV.DATABASE_URL },
  });
}
