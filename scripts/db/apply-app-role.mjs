// Apply scripts/db/app-role.sql through the OWNER connection.
// Uses DATABASE_MIGRATION_URL (falls back to DATABASE_URL). Never prints the URL.
import "dotenv/config";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import pg from "pg";

const url = process.env.DATABASE_MIGRATION_URL || process.env.DATABASE_URL;
if (!url) {
  console.error("apply-app-role: no DATABASE_MIGRATION_URL/DATABASE_URL set");
  process.exit(1);
}

const deployment = process.env.DEPLOYMENT_ENV || process.env.NODE_ENV || "development";
const external = ["staging", "production"].includes(deployment);
const runtimeUrl = process.env.DATABASE_URL;
let runtimePassword = "hiveos_app";

if (runtimeUrl) {
  let parsedRuntimeUrl;
  try {
    parsedRuntimeUrl = new URL(runtimeUrl);
  } catch {
    console.error("apply-app-role: DATABASE_URL is not a valid URL");
    process.exit(1);
  }
  if (decodeURIComponent(parsedRuntimeUrl.username) === "hiveos_app") {
    runtimePassword = decodeURIComponent(parsedRuntimeUrl.password);
  } else if (external) {
    console.error("apply-app-role: external DATABASE_URL must use the hiveos_app role");
    process.exit(1);
  }
} else if (external) {
  console.error("apply-app-role: external deployment requires a runtime DATABASE_URL");
  process.exit(1);
}

if (external && runtimePassword.length < 24) {
  console.error("apply-app-role: external runtime database password must be at least 24 characters");
  process.exit(1);
}

const dir = path.dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(path.join(dir, "app-role.sql"), "utf8");

const client = new pg.Client({ connectionString: url });
await client.connect();
try {
  await client.query(sql);
  const passwordStatement = await client.query(
    "SELECT format('ALTER ROLE hiveos_app PASSWORD %L', $1::text) AS sql",
    [runtimePassword],
  );
  await client.query(passwordStatement.rows[0].sql);
  console.log("apply-app-role: runtime role configured");
} finally {
  await client.end();
}
