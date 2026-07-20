import type { Role } from "@prisma/client";

/**
 * Centralized, testable permission source of truth for Identity & Workspace.
 * Server-side authorization is authoritative — hiding a control in the UI is
 * never authorization (docs/contractor/04_BLUEPRINT.md §10).
 */
export type Capability =
  | "workspace.read"
  | "workspace.update"
  | "members.read"
  | "members.invite"
  | "members.change_role"
  | "members.suspend"
  | "members.manage_owner"
  | "audit.read";

const MATRIX: Record<Capability, ReadonlySet<Role>> = {
  "workspace.read": new Set(["OWNER", "ADMIN", "MEMBER", "VIEWER"]),
  "workspace.update": new Set(["OWNER", "ADMIN"]),
  "members.read": new Set(["OWNER", "ADMIN", "MEMBER", "VIEWER"]),
  "members.invite": new Set(["OWNER", "ADMIN"]),
  "members.change_role": new Set(["OWNER", "ADMIN"]),
  "members.suspend": new Set(["OWNER", "ADMIN"]),
  // Granting, demoting, or removing an Owner is restricted to Owners.
  "members.manage_owner": new Set(["OWNER"]),
  "audit.read": new Set(["OWNER", "ADMIN"]),
};

export function hasCapability(role: Role, capability: Capability): boolean {
  return MATRIX[capability].has(role);
}

/**
 * Whether `actorRole` may transition a member whose current role is
 * `currentRole` to `nextRole`. Any transition that involves OWNER (either
 * side) requires the Owner-management capability — an Admin can never grant,
 * demote, or remove an Owner.
 */
export function canChangeRole(
  actorRole: Role,
  currentRole: Role,
  nextRole: Role,
): boolean {
  const involvesOwner = currentRole === "OWNER" || nextRole === "OWNER";
  if (involvesOwner) return hasCapability(actorRole, "members.manage_owner");
  return hasCapability(actorRole, "members.change_role");
}

/** Full matrix, exposed for documentation/testing. */
export const PERMISSION_MATRIX = MATRIX;
export const ALL_CAPABILITIES = Object.keys(MATRIX) as Capability[];
export const ALL_ROLES: readonly Role[] = ["OWNER", "ADMIN", "MEMBER", "VIEWER"];
