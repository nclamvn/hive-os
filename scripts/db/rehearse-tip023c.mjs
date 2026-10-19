import "dotenv/config";

import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

import pg from "pg";

const ownerUrl = process.env.DATABASE_MIGRATION_URL;
if (!ownerUrl) {
  throw new Error("rehearse-tip023c: DATABASE_MIGRATION_URL is required");
}

const freshName = "hiveos_tip023c_fresh_rehearsal";
const upgradeName = "hiveos_tip023c_upgrade_rehearsal";
const organizationMigration = "20260730160000_enterprise_organization_graph";
const targetMigration = "20260730200000_bounded_query_search_indexes";
const migrationsRoot = path.resolve("prisma/migrations");
const migrations = readdirSync(migrationsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
const organizationIndex = migrations.indexOf(organizationMigration);
const targetIndex = migrations.indexOf(targetMigration);
if (organizationIndex < 0 || targetIndex < 0 || organizationIndex >= targetIndex) {
  throw new Error("rehearse-tip023c: migration order is invalid");
}

const adminUrl = new URL(ownerUrl);
adminUrl.pathname = "/postgres";
const admin = new pg.Client({ connectionString: adminUrl.toString() });

function urlFor(name) {
  const url = new URL(ownerUrl);
  url.pathname = `/${name}`;
  return url.toString();
}

function migrationSql(name) {
  return readFileSync(path.join(migrationsRoot, name, "migration.sql"), "utf8");
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

async function verifyIndexes(client) {
  const result = await client.query(
    `SELECT COUNT(*)::int AS count
     FROM pg_indexes
     WHERE schemaname = 'public'
       AND indexname IN (
         'mission_workspace_updated_id_idx',
         'mission_workspace_created_id_idx',
         'claim_workspace_updated_id_idx',
         'skill_workspace_updated_id_idx',
         'execution_tip_workspace_updated_id_idx',
         'verification_report_workspace_created_id_idx',
         'audit_event_workspace_created_id_idx',
         'governed_release_workspace_approved_id_idx',
         'skill_version_capabilities_gin_idx',
         'skill_version_assurance_compatibility_gin_idx',
         'mission_search_fts_idx',
         'evidence_source_search_fts_idx',
         'claim_search_fts_idx',
         'claim_version_search_fts_idx',
         'skill_search_fts_idx',
         'execution_tip_search_fts_idx'
       )`,
  );
  if (result.rows[0]?.count !== 16) {
    throw new Error("TIP-023C index verification failed");
  }
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
    const applied = await fresh.query(
      "SELECT COUNT(*)::int AS count FROM _prisma_migrations WHERE finished_at IS NOT NULL",
    );
    if (applied.rows[0]?.count !== migrations.length) {
      throw new Error("TIP-023C fresh migration count failed");
    }
    await verifyIndexes(fresh);
  } finally {
    await fresh.end();
  }

  await recreate(upgradeName);
  const upgrade = new pg.Client({ connectionString: urlFor(upgradeName) });
  await upgrade.connect();
  try {
    for (const migration of migrations.slice(0, organizationIndex)) {
      await upgrade.query(migrationSql(migration));
    }
    const userId = randomUUID();
    const workspaceId = randomUUID();
    const membershipId = randomUUID();
    const missionId = randomUUID();
    await upgrade.query(
      `INSERT INTO "user"
         (id, name, email, email_verified, created_at, updated_at)
       VALUES ($1, 'Legacy Query Owner', 'legacy-tip023c@test.local', true, now(), now())`,
      [userId],
    );
    await upgrade.query(
      `INSERT INTO workspace
         (id, slug, name, status, created_by_id, created_at, updated_at, version)
       VALUES ($1, 'legacy-query', 'Legacy Query', 'ACTIVE', $2, now(), now(), 3)`,
      [workspaceId, userId],
    );
    await upgrade.query(
      `INSERT INTO membership
         (id, workspace_id, user_id, role, status, created_by_id, created_at, updated_at, version)
       VALUES ($1, $2, $3, 'OWNER', 'ACTIVE', $3, now(), now(), 2)`,
      [membershipId, workspaceId, userId],
    );
    await upgrade.query(
      `INSERT INTO mission
         (id, workspace_id, reference_code, title, status,
          assurance_profile, created_by_membership_id, created_at, updated_at, version)
       VALUES ($1, $2, 'LEGACY-SEARCH-001', 'Legacy indexed mission', 'DRAFT',
               'PROFESSIONAL', $3, now(), now(), 5)`,
      [missionId, workspaceId, membershipId],
    );
    for (const migration of migrations.slice(organizationIndex, targetIndex + 1)) {
      await upgrade.query(migrationSql(migration));
    }
    await verifyIndexes(upgrade);
    const preserved = await upgrade.query(
      "SELECT title, version FROM mission WHERE id = $1",
      [missionId],
    );
    if (
      preserved.rows[0]?.title !== "Legacy indexed mission" ||
      preserved.rows[0]?.version !== 5
    ) {
      throw new Error("TIP-023C legacy row preservation failed");
    }
  } finally {
    await upgrade.end();
  }

  console.log(
    `rehearse-tip023c: PASS (${migrations.length} fresh migrations; 16 query/search indexes; legacy mission preserved)`,
  );
} finally {
  await drop(freshName);
  await drop(upgradeName);
  await admin.end();
}
