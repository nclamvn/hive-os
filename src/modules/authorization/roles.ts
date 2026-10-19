import type { EnterpriseRole, Role } from "@prisma/client";

import type { Capability } from "@/modules/identity-workspace/permissions";

export const ENTERPRISE_CAPABILITIES = [
  "workspace.read",
  "workspace.update",
  "members.read",
  "members.invite",
  "members.change_role",
  "members.suspend",
  "members.manage_owner",
  "audit.read",
  "missions.read",
  "missions.create",
  "missions.update_draft",
  "missions.submit_contract",
  "missions.approve_contract",
  "missions.transition",
  "obligations.update",
  "obligations.waive",
  "gates.evaluate",
  "gates.waive",
  "decisions.read",
  "decisions.request",
  "decisions.resolve",
  "escalations.read",
  "escalations.manage",
  "truth.read",
  "truth.write",
  "truth.review",
  "truth.export",
  "skills.read",
  "skills.manage",
  "execution.read",
  "execution.operate",
  "execution.review",
  "verification.read",
  "verification.operate",
  "verification.review",
  "release.approve",
  "workflow.read",
  "workflow.request",
  "workflow.manage",
  "workflow.approve",
  "jobs.read",
  "jobs.manage",
  "projections.read",
  "projections.manage",
  "lifecycle.read",
  "lifecycle.manage",
  "exports.request",
  "exports.read",
  "authoring.read",
  "authoring.write",
  "authoring.export",
  "research.read",
  "research.request",
  "research.review",
  "sandbox.request",
  "sandbox.review",
] as const satisfies readonly Capability[];

const all = new Set<Capability>(ENTERPRISE_CAPABILITIES);
const read = new Set<Capability>([
  "workspace.read",
  "members.read",
  "missions.read",
  "decisions.read",
  "escalations.read",
  "truth.read",
  "skills.read",
  "execution.read",
  "verification.read",
  "workflow.read",
  "projections.read",
  "authoring.read",
  "research.read",
]);
const contributor = new Set<Capability>([
  ...read,
  "missions.create",
  "missions.update_draft",
  "missions.submit_contract",
  "missions.transition",
  "obligations.update",
  "decisions.request",
  "truth.write",
  "execution.operate",
  "verification.operate",
  "workflow.request",
  "authoring.write",
  "authoring.export",
  "research.request",
  "sandbox.request",
]);

export const ENTERPRISE_ROLE_CAPABILITIES: Record<
  EnterpriseRole,
  ReadonlySet<Capability>
> = {
  ORG_OWNER: all,
  ORG_ADMIN: new Set([...all].filter((cap) => cap !== "members.manage_owner")),
  PORTFOLIO_LEAD: new Set([
    ...contributor,
    "missions.approve_contract",
    "obligations.waive",
    "gates.evaluate",
    "decisions.resolve",
    "escalations.manage",
    "execution.review",
    "verification.review",
    "workflow.manage",
    "workflow.approve",
    "jobs.read",
    "jobs.manage",
    "projections.manage",
    "exports.request",
    "exports.read",
    "research.review",
    "sandbox.review",
  ]),
  MISSION_OWNER: new Set([
    ...contributor,
    "missions.approve_contract",
    "gates.evaluate",
    "decisions.resolve",
    "escalations.manage",
    "execution.review",
    "workflow.manage",
    "workflow.approve",
    "jobs.read",
    "jobs.manage",
    "projections.manage",
    "exports.request",
    "exports.read",
    "research.review",
    "sandbox.review",
  ]),
  CONTRIBUTOR: contributor,
  BUILDER: new Set([...read, "truth.write", "execution.operate"]),
  VERIFIER: new Set([
    ...read,
    "truth.review",
    "verification.operate",
    "verification.review",
    "workflow.approve",
    "research.review",
    "sandbox.review",
  ]),
  RELEASE_APPROVER: new Set([
    ...read,
    "verification.review",
    "release.approve",
    "workflow.approve",
  ]),
  AUDITOR: new Set([
    ...read,
    "audit.read",
    "truth.export",
    "lifecycle.read",
    "exports.request",
    "exports.read",
  ]),
  VIEWER: read,
};

export function enterpriseRoleAllows(
  role: EnterpriseRole,
  capability: Capability,
): boolean {
  return ENTERPRISE_ROLE_CAPABILITIES[role].has(capability);
}

export function legacyRoleToEnterpriseRole(role: Role): EnterpriseRole {
  switch (role) {
    case "OWNER":
      return "ORG_OWNER";
    case "ADMIN":
      return "ORG_ADMIN";
    case "MEMBER":
      return "CONTRIBUTOR";
    case "VIEWER":
      return "VIEWER";
  }
}
