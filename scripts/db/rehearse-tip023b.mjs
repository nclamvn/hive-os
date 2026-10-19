import "dotenv/config";

import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

import pg from "pg";

const ownerUrl = process.env.DATABASE_MIGRATION_URL;
if (!ownerUrl) {
  throw new Error("rehearse-tip023b: DATABASE_MIGRATION_URL is required");
}

const freshName = "hiveos_tip023b_fresh_rehearsal";
const upgradeName = "hiveos_tip023b_upgrade_rehearsal";
const organizationMigration = "20260730160000_enterprise_organization_graph";
const targetMigration = "20260730193000_delegation_scope_invariant";
const migrationsRoot = path.resolve("prisma/migrations");
const migrations = readdirSync(migrationsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
const organizationIndex = migrations.indexOf(organizationMigration);
const targetIndex = migrations.indexOf(targetMigration);
if (organizationIndex < 0 || targetIndex < 0 || organizationIndex >= targetIndex) {
  throw new Error("rehearse-tip023b: migration order is invalid");
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

function migrationSql(name) {
  return readFileSync(path.join(migrationsRoot, name, "migration.sql"), "utf8");
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
         to_regclass('public.organization_policy') IS NOT NULL AS policy_table,
         to_regclass('public.scoped_grant') IS NOT NULL AS grant_table,
         (
           SELECT COUNT(*)::int
           FROM pg_class
           WHERE relname IN (
             'organization', 'organization_membership',
             'organization_policy', 'org_unit', 'org_unit_closure',
             'portfolio', 'organization_group',
             'organization_group_membership', 'scoped_grant'
           )
             AND relrowsecurity
             AND relforcerowsecurity
         ) AS forced_rls_tables,
         (
           SELECT COUNT(*)::int
           FROM pg_policies
           WHERE schemaname = 'public'
             AND policyname LIKE '%tenant_isolation'
         ) AS tenant_policies`,
    );
    const row = result.rows[0];
    if (
      row?.migrations !== migrations.length ||
      !row?.policy_table ||
      !row?.grant_table ||
      row?.forced_rls_tables !== 9 ||
      row?.tenant_policies !== 9
    ) {
      throw new Error("TIP-023B fresh migration verification failed");
    }
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
    await upgrade.query(
      `INSERT INTO "user"
         (id, name, email, email_verified, created_at, updated_at)
       VALUES ($1, 'Legacy Owner', 'legacy-tip023b@test.local', true, now(), now())`,
      [userId],
    );
    await upgrade.query(
      `INSERT INTO workspace
         (id, slug, name, status, created_by_id, created_at, updated_at, version)
       VALUES ($1, 'legacy-authority', 'Legacy Authority', 'ACTIVE', $2, now(), now(), 7)`,
      [workspaceId, userId],
    );
    await upgrade.query(
      `INSERT INTO membership
         (id, workspace_id, user_id, role, status, created_by_id, created_at, updated_at, version)
       VALUES ($1, $2, $3, 'OWNER', 'ACTIVE', $3, now(), now(), 4)`,
      [membershipId, workspaceId, userId],
    );

    for (const migration of migrations.slice(organizationIndex, targetIndex + 1)) {
      await upgrade.query(migrationSql(migration));
    }

    await upgrade.query(
      "SELECT set_config('hiveos.organization_id', $1, false)",
      [workspaceId],
    );
    const preserved = await upgrade.query(
      `SELECT
         p.organization_id,
         p.require_independent_verification,
         p.require_independent_release_approval,
         g.id,
         g.subject_user_id,
         g.role,
         g.effect,
         g.scope_type,
         g.status,
         g.version
       FROM organization_policy p
       JOIN scoped_grant g ON g.organization_id = p.organization_id
       WHERE p.organization_id = $1`,
      [workspaceId],
    );
    const row = preserved.rows[0];
    if (
      row?.organization_id !== workspaceId ||
      row?.require_independent_verification !== true ||
      row?.require_independent_release_approval !== true ||
      row?.id !== membershipId ||
      row?.subject_user_id !== userId ||
      row?.role !== "ORG_OWNER" ||
      row?.effect !== "ALLOW" ||
      row?.scope_type !== "ORGANIZATION" ||
      row?.status !== "ACTIVE" ||
      row?.version !== 4
    ) {
      throw new Error("TIP-023B compatibility authority verification failed");
    }
  } finally {
    await upgrade.end();
  }

  console.log(
    `rehearse-tip023b: PASS (${migrations.length} fresh migrations; legacy Owner authority preserved; 9 RLS tables forced)`,
  );
} finally {
  await drop(freshName);
  await drop(upgradeName);
  await admin.end();
}
