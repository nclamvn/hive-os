import "dotenv/config";

import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";

import pg from "pg";

const ownerUrl = process.env.DATABASE_MIGRATION_URL;
if (!ownerUrl) throw new Error("rehearse-tip019: DATABASE_MIGRATION_URL is required");

const FRESH = "hiveos_tip019_fresh_rehearsal";
const UPGRADE = "hiveos_tip019_upgrade_rehearsal";
const RECOVERY = "hiveos_tip019_recovery_rehearsal";
const POLICY_MIGRATION = "20260724090000_workspace_policy";
const migrationsRoot = path.resolve("prisma/migrations");
const migrations = readdirSync(migrationsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
const adminUrl = new URL(ownerUrl);
adminUrl.pathname = "/postgres";
const admin = new pg.Client({ connectionString: adminUrl.toString() });

function urlFor(name) {
  const url = new URL(ownerUrl);
  url.pathname = `/${name}`;
  return url.toString();
}

async function recreate(name) {
  await admin.query(
    "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname=$1 AND pid<>pg_backend_pid()",
    [name],
  );
  await admin.query(`DROP DATABASE IF EXISTS "${name}"`);
  await admin.query(`CREATE DATABASE "${name}"`);
}

async function drop(name) {
  await admin.query(
    "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname=$1 AND pid<>pg_backend_pid()",
    [name],
  );
  await admin.query(`DROP DATABASE IF EXISTS "${name}"`);
}

async function tableCounts(url) {
  const client = new pg.Client({ connectionString: url });
  await client.connect();
  try {
    const tables = await client.query(
      "SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename <> '_prisma_migrations' ORDER BY tablename",
    );
    const counts = {};
    for (const { tablename } of tables.rows) {
      const result = await client.query(`SELECT COUNT(*)::int AS count FROM "${tablename}"`);
      counts[tablename] = result.rows[0].count;
    }
    return counts;
  } finally {
    await client.end();
  }
}

await admin.connect();
const backupDir = mkdtempSync(path.join(os.tmpdir(), "hiveos-tip019-"));
try {
  await recreate(FRESH);
  execFileSync("npx", ["prisma", "migrate", "deploy"], {
    env: { ...process.env, DATABASE_URL: urlFor(FRESH), DATABASE_MIGRATION_URL: urlFor(FRESH) },
    stdio: "pipe",
  });
  execFileSync("node", ["scripts/db/apply-app-role.mjs"], {
    env: { ...process.env, DATABASE_URL: urlFor(FRESH), DATABASE_MIGRATION_URL: urlFor(FRESH) },
    stdio: "pipe",
  });
  const fresh = new pg.Client({ connectionString: urlFor(FRESH) });
  await fresh.connect();
  try {
    const verified = await fresh.query(
      `SELECT
        (SELECT COUNT(*)::int FROM _prisma_migrations WHERE finished_at IS NOT NULL) AS migrations,
        to_regclass('public.workspace_policy') IS NOT NULL AS policy,
        NOT has_table_privilege('hiveos_app', 'audit_event', 'UPDATE') AS audit_append_only,
        NOT has_table_privilege('hiveos_app', 'release_manifest', 'DELETE') AS manifest_append_only`,
    );
    if (
      verified.rows[0].migrations !== 12 ||
      !verified.rows[0].policy ||
      !verified.rows[0].audit_append_only ||
      !verified.rows[0].manifest_append_only
    ) {
      throw new Error("fresh install or runtime privilege verification failed");
    }
  } finally {
    await fresh.end();
  }

  await recreate(UPGRADE);
  const upgrade = new pg.Client({ connectionString: urlFor(UPGRADE) });
  await upgrade.connect();
  try {
    for (const migration of migrations.filter((name) => name !== POLICY_MIGRATION)) {
      await upgrade.query(
        readFileSync(path.join(migrationsRoot, migration, "migration.sql"), "utf8"),
      );
    }
    const userId = randomUUID();
    const workspaceId = randomUUID();
    const membershipId = randomUUID();
    const missionId = randomUUID();
    await upgrade.query(
      `INSERT INTO "user" (id, name, email, email_verified, created_at, updated_at)
       VALUES ($1, 'TIP-019 Owner', 'tip019-upgrade@test.local', true, now(), now())`,
      [userId],
    );
    await upgrade.query(
      `INSERT INTO workspace (id, slug, name, status, created_by_id, created_at, updated_at, version)
       VALUES ($1, 'tip019-upgrade', 'TIP-019 Upgrade', 'ACTIVE', $2, now(), now(), 7)`,
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
       VALUES ($1, $2, 'M-019', 'Preserved upgrade Mission', 'BUILDING',
        'RESEARCH', $3, now(), now(), 9)`,
      [missionId, workspaceId, membershipId],
    );
    await upgrade.query(
      readFileSync(
        path.join(migrationsRoot, POLICY_MIGRATION, "migration.sql"),
        "utf8",
      ),
    );
    const preserved = await upgrade.query(
      `SELECT m.title, m.status, m.version, p.default_assurance_profile
       FROM mission m
       JOIN workspace_policy p ON p.workspace_id = m.workspace_id
       WHERE m.id = $1`,
      [missionId],
    );
    if (
      preserved.rows[0]?.title !== "Preserved upgrade Mission" ||
      preserved.rows[0]?.status !== "BUILDING" ||
      preserved.rows[0]?.version !== 9 ||
      preserved.rows[0]?.default_assurance_profile !== "PROFESSIONAL"
    ) {
      throw new Error("TIP-017 upgrade/backfill preservation failed");
    }
  } finally {
    await upgrade.end();
  }

  execFileSync("node", ["scripts/db/backup-local.mjs", `--output=${backupDir}/backup`], {
    env: { ...process.env, DATABASE_MIGRATION_URL: ownerUrl },
    stdio: "pipe",
  });
  const sourceCounts = await tableCounts(ownerUrl);
  await recreate(RECOVERY);
  execFileSync(
    "node",
    [
      "scripts/db/restore-local.mjs",
      `--backup=${backupDir}/backup`,
      `--database-url=${urlFor(RECOVERY)}`,
      `--confirm-target=${RECOVERY}`,
    ],
    { stdio: "pipe" },
  );
  const restoredCounts = await tableCounts(urlFor(RECOVERY));
  if (JSON.stringify(sourceCounts) !== JSON.stringify(restoredCounts)) {
    throw new Error("recovery table-count preservation failed");
  }
  console.log(
    `rehearse-tip019: PASS (12 fresh migrations; TIP-017 upgrade preserved; ${Object.keys(sourceCounts).length} restored tables preserved)`,
  );
} finally {
  await drop(FRESH);
  await drop(UPGRADE);
  await drop(RECOVERY);
  await admin.end();
  rmSync(backupDir, { recursive: true, force: true });
}
