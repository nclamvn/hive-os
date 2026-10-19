import type { Prisma } from "@prisma/client";

import { getDb } from "@/server/db";

export type TenantTransaction = Prisma.TransactionClient;

/**
 * Bind RLS identity to the current transaction only. `is_local=true` prevents
 * tenant state from leaking when the pooled PostgreSQL connection is reused.
 */
export async function setOrganizationTenant(
  tx: TenantTransaction,
  organizationId: string,
  actorUserId: string,
): Promise<void> {
  await tx.$executeRaw`
    SELECT
      set_config('hiveos.organization_id', ${organizationId}, true),
      set_config('hiveos.actor_user_id', ${actorUserId}, true)
  `;
}

export async function withOrganizationTenant<T>(
  organizationId: string,
  actorUserId: string,
  operation: (tx: TenantTransaction) => Promise<T>,
): Promise<T> {
  return getDb().$transaction(async (tx) => {
    await setOrganizationTenant(tx, organizationId, actorUserId);
    return operation(tx);
  });
}
