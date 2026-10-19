import "dotenv/config";

import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

import pg from "pg";

const ownerUrl = process.env.DATABASE_MIGRATION_URL;
if (!ownerUrl) {
  throw new Error("rehearse-tip023g: DATABASE_MIGRATION_URL is required");
}

const freshName = "hiveos_tip023g_fresh_rehearsal";
const upgradeName = "hiveos_tip023g_upgrade_rehearsal";
const organizationMigration = "20260730160000_enterprise_organization_graph";
const targetMigration = "20260804092000_mission_source_revision_fence";
const migrationsRoot = path.resolve("prisma/migrations");
const migrations = readdirSync(migrationsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
const organizationIndex = migrations.indexOf(organizationMigration);
const targetIndex = migrations.indexOf(targetMigration);
if (
  organizationIndex < 0 ||
  targetIndex < 0 ||
  organizationIndex >= targetIndex
) {
  throw new Error("rehearse-tip023g: migration order is invalid");
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

async function verifyDurablePlane(client) {
  const result = await client.query(
    `SELECT
       (
         SELECT COUNT(*)::int
         FROM pg_class
         WHERE relname IN (
           'command_record', 'outbox_event', 'durable_job',
           'durable_job_event', 'workspace_operational_projection',
           'portfolio_operational_projection'
         )
           AND relrowsecurity
           AND relforcerowsecurity
       ) AS forced_rls_tables,
       (
         SELECT COUNT(*)::int
         FROM pg_policies
         WHERE schemaname = 'public'
           AND tablename IN (
             'command_record', 'outbox_event', 'durable_job',
             'durable_job_event', 'workspace_operational_projection',
             'portfolio_operational_projection'
           )
       ) AS tenant_policies,
       (
         SELECT COUNT(*)::int
         FROM pg_trigger
         WHERE NOT tgisinternal
           AND tgname LIKE '%_operational_projection'
       ) AS source_triggers`,
  );
  const row = result.rows[0];
  if (
    row?.forced_rls_tables !== 6 ||
    row?.tenant_policies !== 6 ||
    row?.source_triggers !== 26
  ) {
    throw new Error("TIP-023G durable-plane verification failed");
  }
}

async function verifyLifecyclePlane(client) {
  const result = await client.query(
    `SELECT
       (SELECT COUNT(*)::int FROM pg_class
        WHERE relname IN ('legal_hold', 'lifecycle_disposition',
          'dossier_export', 'dossier_export_part', 'mission_source_revision')
          AND relrowsecurity AND relforcerowsecurity) AS forced_rls_tables,
       (SELECT COUNT(*)::int FROM pg_policies
        WHERE schemaname = 'public' AND tablename IN
          ('legal_hold', 'lifecycle_disposition',
           'dossier_export', 'dossier_export_part', 'mission_source_revision')) AS tenant_policies,
       (SELECT COUNT(*)::int FROM pg_trigger
        WHERE NOT tgisinternal AND tgname IN
          ('organization_governed_delete_guard',
           'workspace_governed_delete_guard',
           'mission_governed_delete_guard')) AS delete_guards`,
  );
  const row = result.rows[0];
  if (row?.forced_rls_tables !== 5 || row?.tenant_policies !== 5
      || row?.delete_guards !== 3) {
    throw new Error("TIP-023G lifecycle/export-plane verification failed");
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
      throw new Error("TIP-023G fresh migration count failed");
    }
    await verifyDurablePlane(fresh);
    await verifyLifecyclePlane(fresh);
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
    const contractId = randomUUID();
    const definitionId = randomUUID();
    const obligationId = randomUUID();
    await upgrade.query(
      `INSERT INTO "user"
         (id, name, email, email_verified, created_at, updated_at)
       VALUES ($1, 'Legacy Durable Owner', 'legacy-tip023g@test.local',
               true, now(), now())`,
      [userId],
    );
    await upgrade.query(
      `INSERT INTO workspace
         (id, slug, name, status, created_by_id, created_at, updated_at, version)
       VALUES ($1, 'legacy-durable', 'Legacy Durable', 'ACTIVE',
               $2, now(), now(), 8)`,
      [workspaceId, userId],
    );
    await upgrade.query(
      `INSERT INTO membership
         (id, workspace_id, user_id, role, status, created_by_id,
          created_at, updated_at, version)
       VALUES ($1, $2, $3, 'OWNER', 'ACTIVE', $3, now(), now(), 5)`,
      [membershipId, workspaceId, userId],
    );
    await upgrade.query(
      `INSERT INTO mission
         (id, workspace_id, reference_code, title, status,
          assurance_profile, created_by_membership_id,
          created_at, updated_at, version)
       VALUES ($1, $2, 'LEGACY-DURABLE-001', 'Legacy durable mission',
               'DRAFT', 'PROFESSIONAL', $3, now(), now(), 6)`,
      [missionId, workspaceId, membershipId],
    );
    await upgrade.query(
      `INSERT INTO mission_contract
         (id, workspace_id, mission_id, version_number, status,
          objective, scope, success_definition, assurance_profile,
          created_by_membership_id, created_at, updated_at, version)
       VALUES ($1, $2, $3, 1, 'DRAFT', 'objective', 'scope', 'success',
               'PROFESSIONAL', $4, now(), now(), 3)`,
      [contractId, workspaceId, missionId, membershipId],
    );
    await upgrade.query(
      "UPDATE mission SET current_contract_id = $1 WHERE id = $2",
      [contractId, missionId],
    );
    await upgrade.query(
      `INSERT INTO contract_obligation
         (id, workspace_id, contract_id, code, title, description,
          weight, required, closure_rule)
       VALUES ($1, $2, $3, 'LEGACY-DURABLE-OBL', 'Legacy obligation',
               'Must survive and project', 5, true, 'manual')`,
      [definitionId, workspaceId, contractId],
    );
    await upgrade.query(
      `INSERT INTO runtime_obligation
         (id, workspace_id, mission_id, contract_obligation_id, status, version)
       VALUES ($1, $2, $3, $4, 'OPEN', 9)`,
      [obligationId, workspaceId, missionId, definitionId],
    );

    for (const migration of migrations.slice(
      organizationIndex,
      targetIndex + 1,
    )) {
      await upgrade.query(migrationSql(migration));
    }
    await verifyDurablePlane(upgrade);
    await verifyLifecyclePlane(upgrade);
    await upgrade.query(
      "SELECT set_config('hiveos.organization_id', $1, false)",
      [workspaceId],
    );
    const preserved = await upgrade.query(
      `SELECT m.title, m.version AS mission_version,
              r.status, r.version AS obligation_version,
              (p.counts ->> 'missions')::int AS projected_missions,
              (p.counts ->> 'obligations')::int AS projected_obligations,
              p.status AS projection_status
       FROM mission m
       JOIN runtime_obligation r ON r.mission_id = m.id
       JOIN workspace_operational_projection p
         ON p.workspace_id = m.workspace_id
       WHERE m.id = $1 AND r.id = $2`,
      [missionId, obligationId],
    );
    const durableRows = await upgrade.query(
      `SELECT
         (SELECT COUNT(*)::int FROM command_record) AS commands,
         (SELECT COUNT(*)::int FROM durable_job) AS jobs`,
    );
    const row = preserved.rows[0];
    if (
      row?.title !== "Legacy durable mission" ||
      row?.mission_version !== 6 ||
      row?.status !== "OPEN" ||
      row?.obligation_version !== 9 ||
      row?.projected_missions !== 1 ||
      row?.projected_obligations !== 1 ||
      row?.projection_status !== "READY" ||
      durableRows.rows[0]?.commands !== 0 ||
      durableRows.rows[0]?.jobs !== 0
    ) {
      throw new Error("TIP-023G legacy projection preservation failed");
    }
  } finally {
    await upgrade.end();
  }

  console.log(
    `rehearse-tip023g: PASS (${migrations.length} fresh migrations; 6 durable + 5 lifecycle/export RLS tables; legacy counts rebuilt)`,
  );
} finally {
  await drop(freshName);
  await drop(upgradeName);
  await admin.end();
}
