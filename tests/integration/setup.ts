import { execSync } from "node:child_process";

import { config } from "dotenv";

// Integration tests run exclusively against the isolated test database.
config({ path: ".env.test", override: true });

const url = process.env.DATABASE_URL ?? "";
if (!/\/hiveos_test(\?|$)/.test(url)) {
  throw new Error(
    "Integration tests require DATABASE_URL to point at the hiveos_test database (see .env.test). Refusing to run.",
  );
}

// Apply committed migrations (owner role) deterministically before the suite.
execSync("npx prisma migrate deploy", {
  stdio: "pipe",
  env: process.env,
});

// Configure the least-privileged runtime role and grants (owner role).
execSync("node scripts/db/apply-app-role.mjs", {
  stdio: "pipe",
  env: process.env,
});
