#!/usr/bin/env node

import { randomUUID } from "node:crypto";
import pg from "pg";

function option(name) {
  const prefix = `--${name}=`;
  return process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length);
}

function required(name) {
  const value = option(name)?.trim();
  if (!value) throw new Error(`Missing --${name}=...`);
  return value;
}

if (option("confirm") !== "TIP-024D") {
  throw new Error("Refusing to provision without --confirm=TIP-024D");
}

const databaseUrl = process.env.DATABASE_MIGRATION_URL;
if (!databaseUrl) throw new Error("DATABASE_MIGRATION_URL is required");

const organizationId = required("organization-id");
const workspaceId = required("workspace-id");
const authorizedByUserId = required("authorized-by-user-id");
const actorKey = (option("actor-key") ?? "research-worker").trim().toLowerCase();
if (!/^[a-z0-9][a-z0-9-]{2,62}$/.test(actorKey)) {
  throw new Error("actor-key must contain 3-63 lowercase letters, digits or hyphens");
}

const client = new pg.Client({ connectionString: databaseUrl });
await client.connect();

try {
  await client.query("BEGIN");
  const authority = await client.query(
    `SELECT om.id AS organization_membership_id, m.id AS workspace_membership_id,
            o.slug AS organization_slug
       FROM organization o
       JOIN organization_membership om
         ON om.organization_id = o.id
        AND om.user_id = $3
        AND om.status = 'ACTIVE'
        AND om.role IN ('OWNER', 'ADMIN')
       JOIN workspace w
         ON w.organization_id = o.id
        AND w.id = $2
        AND w.status = 'ACTIVE'
       JOIN membership m
         ON m.workspace_id = w.id
        AND m.user_id = $3
        AND m.status = 'ACTIVE'
        AND m.role IN ('OWNER', 'ADMIN')
      WHERE o.id = $1
        AND o.status = 'ACTIVE'`,
    [organizationId, workspaceId, authorizedByUserId],
  );
  if (authority.rowCount !== 1) {
    throw new Error("Active organization and workspace Owner/Admin authority is required");
  }

  const email = `svc+${actorKey}.${organizationId}@hiveos.invalid`;
  const existing = await client.query(
    `SELECT id, principal_type FROM "user" WHERE email = $1 FOR UPDATE`,
    [email],
  );
  let actorUserId;
  let created = false;
  if (existing.rowCount) {
    if (existing.rows[0].principal_type !== "SERVICE") {
      throw new Error("The deterministic service address is already held by a human principal");
    }
    actorUserId = existing.rows[0].id;
  } else {
    actorUserId = `svc_${randomUUID()}`;
    await client.query(
      `INSERT INTO "user"
         (id, name, email, email_verified, principal_type, created_at, updated_at)
       VALUES ($1, $2, $3, false, 'SERVICE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [actorUserId, "HIVE OS Research Worker", email],
    );
    created = true;
  }

  const membershipId = randomUUID();
  const membership = await client.query(
    `INSERT INTO organization_membership
       (id, organization_id, user_id, role, status, created_by_id, created_at, updated_at, version)
     VALUES ($1, $2, $3, 'MEMBER', 'ACTIVE', $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1)
     ON CONFLICT (organization_id, user_id)
     DO UPDATE SET status = 'ACTIVE', updated_at = CURRENT_TIMESTAMP, version = organization_membership.version + 1
     RETURNING id, role, status`,
    [membershipId, organizationId, actorUserId, authorizedByUserId],
  );
  if (membership.rows[0].role === "OWNER" || membership.rows[0].role === "ADMIN") {
    throw new Error("Existing service principal has a forbidden administrative role");
  }

  const accountCount = await client.query(
    `SELECT (SELECT count(*)::int FROM account WHERE user_id = $1) AS accounts,
            (SELECT count(*)::int FROM "session" WHERE user_id = $1) AS sessions`,
    [actorUserId],
  );
  if (accountCount.rows[0].accounts !== 0 || accountCount.rows[0].sessions !== 0) {
    throw new Error("Service principal unexpectedly has an account or session");
  }

  await client.query(
    `INSERT INTO audit_event
       (id, workspace_id, actor_user_id, actor_membership_id, event_type,
        entity_type, entity_id, correlation_id, payload, created_at)
     VALUES ($1, $2, $3, $4, 'service_principal.provisioned',
             'ServicePrincipal', $5, $6, $7::jsonb, CURRENT_TIMESTAMP)`,
    [
      randomUUID(),
      workspaceId,
      authorizedByUserId,
      authority.rows[0].workspace_membership_id,
      actorUserId,
      randomUUID(),
      JSON.stringify({
        actorKey,
        organizationMembershipId: membership.rows[0].id,
        created,
        credentialless: true,
      }),
    ],
  );

  await client.query("COMMIT");
  process.stdout.write(`${JSON.stringify({
    schema: "hive-os.service-principal.v1",
    organizationId,
    workspaceId,
    actorUserId,
    actorKey,
    created,
    credentialless: true,
    organizationRole: membership.rows[0].role,
  })}\n`);
} catch (error) {
  await client.query("ROLLBACK").catch(() => undefined);
  throw error;
} finally {
  await client.end();
}
