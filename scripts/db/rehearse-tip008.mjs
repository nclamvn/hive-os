import "dotenv/config";

import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import pg from "pg";

const ownerUrl = process.env.DATABASE_MIGRATION_URL || process.env.DATABASE_URL;
if (!ownerUrl) {
  throw new Error("rehearse-tip008: owner database URL is not configured");
}

const FRESH_DB = "hiveos_tip008_fresh_rehearsal";
const UPGRADE_DB = "hiveos_tip008_upgrade_rehearsal";
const TIP_008 = "20260723170000_verification_governance";
const migrationsDir = path.resolve("prisma/migrations");
const migrationNames = readdirSync(migrationsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

function databaseUrl(databaseName) {
  const url = new URL(ownerUrl);
  url.pathname = `/${databaseName}`;
  return url.toString();
}

async function connect(url) {
  const client = new pg.Client({ connectionString: url });
  await client.connect();
  return client;
}

async function recreateDatabase(admin, databaseName) {
  await admin.query(
    "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = $1 AND pid <> pg_backend_pid()",
    [databaseName],
  );
  await admin.query(`DROP DATABASE IF EXISTS "${databaseName}"`);
  await admin.query(`CREATE DATABASE "${databaseName}"`);
}

async function dropDatabase(admin, databaseName) {
  await admin.query(
    "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = $1 AND pid <> pg_backend_pid()",
    [databaseName],
  );
  await admin.query(`DROP DATABASE IF EXISTS "${databaseName}"`);
}

function runPrismaDeploy(url) {
  execFileSync("npx", ["prisma", "migrate", "deploy"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      DATABASE_URL: url,
      DATABASE_MIGRATION_URL: url,
    },
    stdio: "pipe",
  });
}

function runRoleSetup(url) {
  execFileSync("node", ["scripts/db/apply-app-role.mjs"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      DATABASE_URL: url,
      DATABASE_MIGRATION_URL: url,
    },
    stdio: "pipe",
  });
}

async function applyMigration(client, migrationName) {
  const sql = readFileSync(
    path.join(migrationsDir, migrationName, "migration.sql"),
    "utf8",
  );
  await client.query(sql);
}

const adminUrl = new URL(ownerUrl);
adminUrl.pathname = "/postgres";
const admin = await connect(adminUrl.toString());

try {
  await recreateDatabase(admin, FRESH_DB);
  const freshUrl = databaseUrl(FRESH_DB);
  runPrismaDeploy(freshUrl);
  runRoleSetup(freshUrl);
  const fresh = await connect(freshUrl);
  try {
    const migration = await fresh.query(
      "SELECT COUNT(*)::int AS count FROM _prisma_migrations WHERE finished_at IS NOT NULL",
    );
    const tables = await fresh.query(
      "SELECT to_regclass('public.verification_report') AS report, to_regclass('public.release_manifest') AS manifest",
    );
    const privileges = await fresh.query(
      `SELECT
        has_table_privilege('hiveos_app', 'verification_report', 'UPDATE') AS report_update,
        has_table_privilege('hiveos_app', 'release_manifest', 'DELETE') AS manifest_delete,
        has_table_privilege('hiveos_app', 'verification_run', 'UPDATE') AS run_update`,
    );
    if (
      migration.rows[0].count !== migrationNames.length ||
      !tables.rows[0].report ||
      !tables.rows[0].manifest ||
      privileges.rows[0].report_update ||
      privileges.rows[0].manifest_delete ||
      !privileges.rows[0].run_update
    ) {
      throw new Error("fresh-install verification failed");
    }
  } finally {
    await fresh.end();
  }

  await recreateDatabase(admin, UPGRADE_DB);
  const upgradeUrl = databaseUrl(UPGRADE_DB);
  const upgrade = await connect(upgradeUrl);
  try {
    for (const migrationName of migrationNames.filter(
      (name) => name !== TIP_008,
    )) {
      await applyMigration(upgrade, migrationName);
    }
    const userId = randomUUID();
    const workspaceId = randomUUID();
    const membershipId = randomUUID();
    const missionId = randomUUID();
    await upgrade.query(
      `INSERT INTO "user" (id, name, email, email_verified, created_at, updated_at)
       VALUES ($1, 'Rehearsal Owner', 'tip008-rehearsal@test.local', true, now(), now())`,
      [userId],
    );
    await upgrade.query(
      `INSERT INTO workspace (id, slug, name, status, created_by_id, created_at, updated_at, version)
       VALUES ($1, 'tip008-rehearsal', 'TIP-008 Rehearsal', 'ACTIVE', $2, now(), now(), 7)`,
      [workspaceId, userId],
    );
    await upgrade.query(
      `INSERT INTO membership
       (id, workspace_id, user_id, role, status, created_by_id, created_at, updated_at, version)
       VALUES ($1, $2, $3, 'OWNER', 'ACTIVE', $3, now(), now(), 4)`,
      [membershipId, workspaceId, userId],
    );
    await upgrade.query(
      `INSERT INTO mission
       (id, workspace_id, reference_code, title, status, assurance_profile,
        created_by_membership_id, created_at, updated_at, version)
       VALUES ($1, $2, 'M-0001', 'Preserved TIP-007 Mission', 'BUILDING',
        'RESEARCH', $3, now(), now(), 9)`,
      [missionId, workspaceId, membershipId],
    );

    await applyMigration(upgrade, TIP_008);
    const preserved = await upgrade.query(
      "SELECT title, status, version FROM mission WHERE id = $1",
      [missionId],
    );
    const tables = await upgrade.query(
      "SELECT to_regclass('public.verification_report') AS report, to_regclass('public.release_manifest') AS manifest",
    );
    if (
      preserved.rows[0]?.title !== "Preserved TIP-007 Mission" ||
      preserved.rows[0]?.status !== "BUILDING" ||
      preserved.rows[0]?.version !== 9 ||
      !tables.rows[0].report ||
      !tables.rows[0].manifest
    ) {
      throw new Error("TIP-007 upgrade preservation failed");
    }
  } finally {
    await upgrade.end();
  }

  console.log(
    `rehearse-tip008: PASS (${migrationNames.length} fresh migrations; TIP-007 upgrade preserved)`,
  );
} finally {
  await dropDatabase(admin, FRESH_DB);
  await dropDatabase(admin, UPGRADE_DB);
  await admin.end();
}
