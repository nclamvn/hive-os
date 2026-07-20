import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import {
  listWorkspacesForUser,
  NotFoundError,
  resolveWorkspaceContext,
  UnauthenticatedError,
  type WorkspaceContext,
  type WorkspaceMembershipSummary,
} from "@/modules/identity-workspace";

export interface WorkspacePageData {
  ctx: WorkspaceContext;
  workspaces: WorkspaceMembershipSummary[];
}

/**
 * Resolve the authorized workspace context for a page. Unauthenticated →
 * sign-in; unknown workspace or non-member → 404 (no existence leak).
 */
export async function loadWorkspacePage(
  slug: string,
): Promise<WorkspacePageData> {
  const h = await headers();
  try {
    const ctx = await resolveWorkspaceContext(h, slug);
    const workspaces = await listWorkspacesForUser(ctx.user.id);
    return { ctx, workspaces };
  } catch (error) {
    if (error instanceof UnauthenticatedError) redirect("/sign-in");
    if (error instanceof NotFoundError) notFound();
    throw error;
  }
}
