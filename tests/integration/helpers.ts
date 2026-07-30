import { randomUUID } from "node:crypto";

import pg from "pg";

import type { WorkspaceContext } from "@/modules/identity-workspace";
import { provisionWorkspace } from "@/modules/identity-workspace";
import { getDb } from "@/server/db";

export interface TestUser {
  id: string;
  name: string;
  email: string;
}

/** Create a User row directly (identity domain services only need this). */
export async function createUser(prefix = "user"): Promise<TestUser> {
  const id = randomUUID();
  const short = id.slice(0, 8);
  const user = {
    id,
    name: `${prefix} ${short}`,
    email: `${prefix}-${short}@test.local`,
  };
  await getDb().user.create({ data: user });
  return user;
}

/** Run a read query as the OWNER role (for ledger/privilege checks in tests). */
export async function ownerQuery<T = Record<string, unknown>>(
  sql: string,
): Promise<T[]> {
  const url = process.env.DATABASE_MIGRATION_URL || process.env.DATABASE_URL;
  const client = new pg.Client({ connectionString: url });
  await client.connect();
  try {
    const result = await client.query(sql);
    return result.rows as T[];
  } finally {
    await client.end();
  }
}

/**
 * Remove all identity data between tests. Runs as the OWNER role because the
 * least-privileged runtime role deliberately cannot TRUNCATE (least privilege).
 * TRUNCATE bypasses the per-row audit trigger.
 */
export async function truncateAll(): Promise<void> {
  const url = process.env.DATABASE_MIGRATION_URL || process.env.DATABASE_URL;
  const client = new pg.Client({ connectionString: url });
  await client.connect();
  try {
    await client.query(
      'TRUNCATE organization, audit_event, invitation, membership, workspace, "session", account, "user" CASCADE',
    );
  } finally {
    await client.end();
  }
}

/** Provision a workspace for `user` and return their authorized OWNER context. */
export async function asOwner(user: TestUser): Promise<WorkspaceContext> {
  const workspace = await provisionWorkspace(user, "Acme Research");
  const membership = await getDb().membership.findFirstOrThrow({
    where: { workspaceId: workspace.id, userId: user.id },
  });
  return {
    user,
    workspace,
    membership: {
      id: membership.id,
      role: membership.role,
      status: membership.status,
    },
    correlationId: randomUUID(),
  };
}

/** Build an authorized context for an existing membership (any role). */
export async function contextForMembership(
  user: TestUser,
  workspaceId: string,
): Promise<WorkspaceContext> {
  const workspace = await getDb().workspace.findUniqueOrThrow({
    where: { id: workspaceId },
  });
  const membership = await getDb().membership.findFirstOrThrow({
    where: { workspaceId, userId: user.id },
  });
  return {
    user,
    workspace: {
      id: workspace.id,
      slug: workspace.slug,
      name: workspace.name,
      status: workspace.status,
    },
    membership: {
      id: membership.id,
      role: membership.role,
      status: membership.status,
    },
    correlationId: randomUUID(),
  };
}
