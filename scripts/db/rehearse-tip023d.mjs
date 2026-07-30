import "dotenv/config";

import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

import pg from "pg";

const ownerUrl = process.env.DATABASE_MIGRATION_URL;
if (!ownerUrl) {
  throw new Error("rehearse-tip023d: DATABASE_MIGRATION_URL is required");
}

const freshName = "hiveos_tip023d_fresh_rehearsal";
const upgradeName = "hiveos_tip023d_upgrade_rehearsal";
const organizationMigration = "20260730160000_enterprise_organization_graph";
const targetMigration = "20260730214500_workflow_idempotency_invariants";
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
  throw new Error("rehearse-tip023d: migration order is invalid");
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

async function verifyWorkflowPlane(client) {
  const result = await client.query(
    `SELECT
       (
         SELECT COUNT(*)::int
         FROM pg_class
         WHERE relname IN (
           'sla_policy', 'workflow_assignment',
           'approval_chain_definition', 'approval_chain_step',
           'workflow_approval_request', 'workflow_approval_action'
         )
           AND relrowsecurity
           AND relforcerowsecurity
       ) AS forced_rls_tables,
       (
         SELECT COUNT(*)::int
         FROM pg_policies
         WHERE schemaname = 'public'
           AND tablename IN (
             'sla_policy', 'workflow_assignment',
             'approval_chain_definition', 'approval_chain_step',
             'workflow_approval_request', 'workflow_approval_action'
           )
       ) AS tenant_policies,
       (
         SELECT COUNT(*)::int
         FROM pg_indexes
         WHERE indexname IN (
           'workflow_assignment_one_active_role',
           'workflow_approval_request_one_pending',
           'escalation_workflow_assignment_once'
         )
       ) AS invariant_indexes`,
  );
  const row = result.rows[0];
  if (
    row?.forced_rls_tables !== 6 ||
    row?.tenant_policies !== 6 ||
    row?.invariant_indexes !== 3
  ) {
    throw new Error("TIP-023D workflow-plane verification failed");
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
      throw new Error("TIP-023D fresh migration count failed");
    }
    await verifyWorkflowPlane(fresh);
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
       VALUES ($1, 'Legacy Workflow Owner', 'legacy-tip023d@test.local',
               true, now(), now())`,
      [userId],
    );
    await upgrade.query(
      `INSERT INTO workspace
         (id, slug, name, status, created_by_id, created_at, updated_at, version)
       VALUES ($1, 'legacy-workflow', 'Legacy Workflow', 'ACTIVE',
               $2, now(), now(), 6)`,
      [workspaceId, userId],
    );
    await upgrade.query(
      `INSERT INTO membership
         (id, workspace_id, user_id, role, status, created_by_id,
          created_at, updated_at, version)
       VALUES ($1, $2, $3, 'OWNER', 'ACTIVE', $3, now(), now(), 3)`,
      [membershipId, workspaceId, userId],
    );
    await upgrade.query(
      `INSERT INTO mission
         (id, workspace_id, reference_code, title, status,
          assurance_profile, created_by_membership_id,
          created_at, updated_at, version)
       VALUES ($1, $2, 'LEGACY-WORK-001', 'Legacy accountable mission',
               'DRAFT', 'PROFESSIONAL', $3, now(), now(), 4)`,
      [missionId, workspaceId, membershipId],
    );
    await upgrade.query(
      `INSERT INTO mission_contract
         (id, workspace_id, mission_id, version_number, status,
          objective, scope, success_definition, assurance_profile,
          created_by_membership_id, created_at, updated_at, version)
       VALUES ($1, $2, $3, 1, 'DRAFT', 'objective', 'scope', 'success',
               'PROFESSIONAL', $4, now(), now(), 2)`,
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
       VALUES ($1, $2, $3, 'LEGACY-OBL-001', 'Legacy obligation',
               'Must survive upgrade', 5, true, 'manual')`,
      [definitionId, workspaceId, contractId],
    );
    await upgrade.query(
      `INSERT INTO runtime_obligation
         (id, workspace_id, mission_id, contract_obligation_id, status, version)
       VALUES ($1, $2, $3, $4, 'OPEN', 7)`,
      [obligationId, workspaceId, missionId, definitionId],
    );

    for (const migration of migrations.slice(
      organizationIndex,
      targetIndex + 1,
    )) {
      await upgrade.query(migrationSql(migration));
    }
    await verifyWorkflowPlane(upgrade);
    const preserved = await upgrade.query(
      `SELECT m.title, m.version AS mission_version,
              r.status, r.version AS obligation_version
       FROM mission m
       JOIN runtime_obligation r ON r.mission_id = m.id
       WHERE m.id = $1 AND r.id = $2`,
      [missionId, obligationId],
    );
    const workflowRows = await upgrade.query(
      `SELECT
         (SELECT COUNT(*)::int FROM workflow_assignment) AS assignments,
         (SELECT COUNT(*)::int FROM workflow_approval_request) AS approvals`,
    );
    if (
      preserved.rows[0]?.title !== "Legacy accountable mission" ||
      preserved.rows[0]?.mission_version !== 4 ||
      preserved.rows[0]?.status !== "OPEN" ||
      preserved.rows[0]?.obligation_version !== 7 ||
      workflowRows.rows[0]?.assignments !== 0 ||
      workflowRows.rows[0]?.approvals !== 0
    ) {
      throw new Error("TIP-023D legacy work preservation failed");
    }
  } finally {
    await upgrade.end();
  }

  console.log(
    `rehearse-tip023d: PASS (${migrations.length} fresh migrations; 6 workflow RLS tables; legacy obligation preserved)`,
  );
} finally {
  await drop(freshName);
  await drop(upgradeName);
  await admin.end();
}
