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

const dir = path.dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(path.join(dir, "app-role.sql"), "utf8");

const client = new pg.Client({ connectionString: url });
await client.connect();
try {
  await client.query(sql);
  console.log("apply-app-role: runtime role configured");
} finally {
  await client.end();
}
