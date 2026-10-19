import { execSync } from "node:child_process";

import { config } from "dotenv";

// Integration tests run exclusively against the isolated test database.
config({ path: ".env.test", override: true });
process.env.MATH_PILOT_QUEUE_ENABLED = "true";
process.env.RESEARCH_CODEX_LOCAL_ENABLED = "true";
process.env.MATH_FORMAL_LEAN_IMAGE = "leanprovercommunity/mathlib@sha256:e251cad58fa2b8010782259d7df19eda2529dfbc1dcd0d511d3412d62eee7e3f";
process.env.MATH_FORMAL_REPLAY_IMAGE = "sha256:" + "a".repeat(64);

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
