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

// Apply committed migrations deterministically before the suite runs.
execSync("npx prisma migrate deploy", {
  stdio: "pipe",
  env: process.env,
});
