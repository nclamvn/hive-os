import "dotenv/config";

import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

import pg from "pg";

const ownerUrl = process.env.DATABASE_MIGRATION_URL;
if (!ownerUrl) {
  throw new Error("rehearse-tip023a: DATABASE_MIGRATION_URL is required");
}

const freshName = "hiveos_tip023a_fresh_rehearsal";
const upgradeName = "hiveos_tip023a_upgrade_rehearsal";
const targetMigration = "20260730160000_enterprise_organization_graph";
const migrationsRoot = path.resolve("prisma/migrations");
const migrations = readdirSync(migrationsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
const targetIndex = migrations.indexOf(targetMigration);
if (targetIndex < 0) {
  throw new Error(`rehearse-tip023a: missing ${targetMigration}`);
}
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

await admin.connect();
try {
  await recreate(freshName);
  execFileSync("npx", ["prisma", "migrate", "deploy"], {
    env: {
      ...process.env,
      DATABASE_URL: urlFor(freshName),
      DATABASE_MIGRATION_URL: urlFor(freshName),
    },
    stdio: "pipe",
  });
  const fresh = new pg.Client({ connectionString: urlFor(freshName) });
  await fresh.connect();
  try {
    const result = await fresh.query(
      `SELECT
         (SELECT COUNT(*)::int FROM _prisma_migrations WHERE finished_at IS NOT NULL) AS migrations,
         to_regclass('public.organization') IS NOT NULL AS organization,
         to_regclass('public.org_unit_closure') IS NOT NULL AS closure,
         EXISTS (
           SELECT 1 FROM pg_trigger
           WHERE tgname = 'org_unit_move_closure' AND NOT tgisinternal
         ) AS move_trigger`,
    );
    if (
      result.rows[0]?.migrations !== migrations.length ||
      !result.rows[0]?.organization ||
      !result.rows[0]?.closure ||
      !result.rows[0]?.move_trigger
    ) {
      throw new Error("TIP-023A fresh migration verification failed");
    }
  } finally {
    await fresh.end();
  }

  await recreate(upgradeName);
  const upgrade = new pg.Client({ connectionString: urlFor(upgradeName) });
  await upgrade.connect();
  try {
    for (const migration of migrations.slice(0, targetIndex)) {
      await upgrade.query(
        readFileSync(
          path.join(migrationsRoot, migration, "migration.sql"),
          "utf8",
        ),
      );
    }

    const userId = randomUUID();
    const workspaceId = randomUUID();
    const membershipId = randomUUID();
    await upgrade.query(
      `INSERT INTO "user"
         (id, name, email, email_verified, created_at, updated_at)
       VALUES ($1, 'Legacy Owner', 'legacy-tip023a@test.local', true, now(), now())`,
      [userId],
    );
    await upgrade.query(
      `INSERT INTO workspace
         (id, slug, name, status, created_by_id, created_at, updated_at, version)
       VALUES ($1, 'legacy-enterprise', 'Legacy Enterprise', 'ACTIVE', $2, now(), now(), 7)`,
      [workspaceId, userId],
    );
    await upgrade.query(
      `INSERT INTO membership
         (id, workspace_id, user_id, role, status, created_by_id, created_at, updated_at, version)
       VALUES ($1, $2, $3, 'OWNER', 'ACTIVE', $3, now(), now(), 4)`,
      [membershipId, workspaceId, userId],
    );

    await upgrade.query(
      readFileSync(
        path.join(migrationsRoot, targetMigration, "migration.sql"),
        "utf8",
      ),
    );
    const preserved = await upgrade.query(
      `SELECT
         w.name,
         w.version AS workspace_version,
         w.organization_id,
         w.org_unit_id,
         o.name AS organization_name,
         u.type,
         u.parent_id,
         c.depth,
         om.role,
         om.version AS membership_version
       FROM workspace w
       JOIN organization o ON o.id = w.organization_id
       JOIN org_unit u ON u.id = w.org_unit_id
       JOIN org_unit_closure c
         ON c.organization_id = w.organization_id
        AND c.ancestor_id = w.org_unit_id
        AND c.descendant_id = w.org_unit_id
       JOIN organization_membership om
         ON om.organization_id = w.organization_id
        AND om.user_id = $2
       WHERE w.id = $1`,
      [workspaceId, userId],
    );
    const row = preserved.rows[0];
    if (
      row?.name !== "Legacy Enterprise" ||
      row?.workspace_version !== 7 ||
      row?.organization_id !== workspaceId ||
      row?.org_unit_id !== workspaceId ||
      row?.organization_name !== "Legacy Enterprise" ||
      row?.type !== "ROOT" ||
      row?.parent_id !== null ||
      row?.depth !== 0 ||
      row?.role !== "OWNER" ||
      row?.membership_version !== 4
    ) {
      throw new Error("TIP-023A compatibility backfill verification failed");
    }
  } finally {
    await upgrade.end();
  }

  console.log(
    `rehearse-tip023a: PASS (${migrations.length} fresh migrations; legacy Workspace and Membership preserved)`,
  );
} finally {
  await drop(freshName);
  await drop(upgradeName);
  await admin.end();
}
