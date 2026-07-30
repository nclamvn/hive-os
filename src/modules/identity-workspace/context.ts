import { randomUUID } from "node:crypto";

import type {
  MembershipStatus,
  Role,
  WorkspaceStatus,
} from "@prisma/client";

import { auth } from "@/server/auth";
import { getDb } from "@/server/db";

import { NotFoundError, UnauthenticatedError } from "./errors";

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthorizedMembership {
  id: string;
  role: Role;
  status: MembershipStatus;
}

export interface WorkspaceRef {
  id: string;
  slug: string;
  name: string;
  status: WorkspaceStatus;
}

/**
 * The trusted server context for every workspace-scoped operation. The
 * workspace ID here is resolved server-side from the authenticated session and
 * membership — a slug or ID from the browser is never treated as authorization.
 */
export interface WorkspaceContext {
  user: AuthenticatedUser;
  workspace: WorkspaceRef;
  membership: AuthorizedMembership;
  correlationId: string;
}

export async function getAuthenticatedUser(
  headers: Headers,
): Promise<AuthenticatedUser | null> {
  const session = await auth.api.getSession({ headers });
  if (!session?.user) return null;
  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
  };
}

export async function requireAuthenticatedUser(
  headers: Headers,
): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser(headers);
  if (!user) throw new UnauthenticatedError();
  return user;
}

export interface WorkspaceMembershipSummary {
  workspace: WorkspaceRef;
  role: Role;
}

/** Active workspaces the user belongs to, for root routing and the chooser. */
export async function listWorkspacesForUser(
  userId: string,
): Promise<WorkspaceMembershipSummary[]> {
  const memberships = await getDb().membership.findMany({
    where: { userId, status: "ACTIVE", workspace: { status: "ACTIVE" } },
    include: { workspace: true },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    take: 100,
  });
  return memberships.map((m) => ({
    role: m.role,
    workspace: {
      id: m.workspace.id,
      slug: m.workspace.slug,
      name: m.workspace.name,
      status: m.workspace.status,
    },
  }));
}

/**
 * Resolve the authorized workspace context for a slug. A missing workspace and
 * a missing/inactive membership both surface as NotFound so the caller cannot
 * distinguish "no such workspace" from "not a member" (no existence leak).
 */
export async function resolveWorkspaceContext(
  headers: Headers,
  slug: string,
): Promise<WorkspaceContext> {
  const user = await requireAuthenticatedUser(headers);
  const db = getDb();

  const workspace = await db.workspace.findFirst({
    where: { slug, status: "ACTIVE" },
  });
  if (!workspace) throw new NotFoundError();

  const membership = await db.membership.findUnique({
    where: {
      workspaceId_userId: { workspaceId: workspace.id, userId: user.id },
    },
  });
  if (!membership || membership.status !== "ACTIVE") {
    throw new NotFoundError();
  }

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
