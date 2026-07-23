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
  | "audit.read"
  // Mission Kernel (TIP-004)
  | "missions.read"
  | "missions.create"
  | "missions.update_draft"
  | "missions.submit_contract"
  | "missions.approve_contract"
  | "missions.transition"
  | "obligations.update"
  | "obligations.waive"
  | "gates.evaluate"
  | "gates.waive"
  | "decisions.read"
  | "decisions.request"
  | "decisions.resolve"
  | "escalations.read"
  | "escalations.manage"
  // Truth Kernel (TIP-005)
  | "truth.read"
  | "truth.write"
  | "truth.review"
  | "truth.export"
  // Skill Registry (TIP-006)
  | "skills.read"
  | "skills.manage"
  // Execution Fabric (TIP-007)
  | "execution.read"
  | "execution.operate"
  | "execution.review"
  // Verification & Governance (TIP-008)
  | "verification.read"
  | "verification.operate"
  | "verification.review"
  | "release.approve";

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

  // Mission Kernel (TIP-004). Contextual restrictions (Regulated approval,
  // assurance downgrade) are enforced in services on top of this matrix.
  "missions.read": new Set(["OWNER", "ADMIN", "MEMBER", "VIEWER"]),
  "missions.create": new Set(["OWNER", "ADMIN", "MEMBER"]),
  "missions.update_draft": new Set(["OWNER", "ADMIN", "MEMBER"]),
  "missions.submit_contract": new Set(["OWNER", "ADMIN", "MEMBER"]),
  "missions.approve_contract": new Set(["OWNER", "ADMIN"]),
  "missions.transition": new Set(["OWNER", "ADMIN", "MEMBER"]),
  "obligations.update": new Set(["OWNER", "ADMIN", "MEMBER"]),
  "obligations.waive": new Set(["OWNER", "ADMIN"]),
  "gates.evaluate": new Set(["OWNER", "ADMIN"]),
  "gates.waive": new Set(["OWNER", "ADMIN"]),
  "decisions.read": new Set(["OWNER", "ADMIN", "MEMBER", "VIEWER"]),
  "decisions.request": new Set(["OWNER", "ADMIN", "MEMBER"]),
  "decisions.resolve": new Set(["OWNER", "ADMIN"]),
  "escalations.read": new Set(["OWNER", "ADMIN", "MEMBER", "VIEWER"]),
  "escalations.manage": new Set(["OWNER", "ADMIN"]),
  "truth.read": new Set(["OWNER", "ADMIN", "MEMBER", "VIEWER"]),
  "truth.write": new Set(["OWNER", "ADMIN", "MEMBER"]),
  "truth.review": new Set(["OWNER", "ADMIN"]),
  "truth.export": new Set(["OWNER", "ADMIN"]),
  "skills.read": new Set(["OWNER", "ADMIN", "MEMBER", "VIEWER"]),
  "skills.manage": new Set(["OWNER", "ADMIN"]),
  "execution.read": new Set(["OWNER", "ADMIN", "MEMBER", "VIEWER"]),
  "execution.operate": new Set(["OWNER", "ADMIN", "MEMBER"]),
  "execution.review": new Set(["OWNER", "ADMIN"]),
  "verification.read": new Set(["OWNER", "ADMIN", "MEMBER", "VIEWER"]),
  "verification.operate": new Set(["OWNER", "ADMIN", "MEMBER"]),
  "verification.review": new Set(["OWNER", "ADMIN"]),
  "release.approve": new Set(["OWNER", "ADMIN"]),
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
