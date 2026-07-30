import type {
  EnterpriseRole,
  GrantEffect,
  GrantScopeType,
} from "@prisma/client";

import type {
  Capability,
  WorkspaceContext,
} from "@/modules/identity-workspace";
import { AuditEventType, writeAuditEvent } from "@/modules/identity-workspace";
import { getDb } from "@/server/db";
import {
  type TenantTransaction,
  withOrganizationTenant,
} from "@/server/tenant-context";

import { AuthorizationError } from "./errors";
import { enterpriseRoleAllows } from "./roles";

export interface AuthorizationResource {
  organizationId: string;
  orgUnitId?: string;
  workspaceId?: string;
  missionId?: string;
}

export interface AuthorizationDecision {
  allowed: boolean;
  capability: Capability;
  policyVersion: number;
  matchedGrantIds: string[];
  reasonCodes: string[];
}

function timeValid(
  grant: { validFrom: Date; validUntil: Date | null; status: string },
  now: Date,
) {
  return (
    grant.status === "ACTIVE" &&
    grant.validFrom <= now &&
    (!grant.validUntil || grant.validUntil > now)
  );
}

async function resolveResource(
  tx: TenantTransaction,
  resource: AuthorizationResource,
) {
  let workspaceId = resource.workspaceId;
  let orgUnitId = resource.orgUnitId;
  if (resource.missionId) {
    const mission = await tx.mission.findFirst({
      where: { id: resource.missionId },
      select: {
        workspaceId: true,
        workspace: { select: { organizationId: true, orgUnitId: true } },
      },
    });
    if (
      !mission ||
      mission.workspace.organizationId !== resource.organizationId
    ) {
      return null;
    }
    workspaceId = mission.workspaceId;
    orgUnitId = mission.workspace.orgUnitId;
  } else if (workspaceId) {
    const workspace = await tx.workspace.findFirst({
      where: { id: workspaceId, organizationId: resource.organizationId },
      select: { orgUnitId: true },
    });
    if (!workspace) return null;
    orgUnitId = workspace.orgUnitId;
  } else if (orgUnitId) {
    const unit = await tx.orgUnit.findFirst({
      where: { id: orgUnitId, organizationId: resource.organizationId },
      select: { id: true },
    });
    if (!unit) return null;
  }
  return { ...resource, workspaceId, orgUnitId };
}

async function validDelegationChain(
  tx: TenantTransaction,
  grant: {
    organizationId: string;
    delegatedFromGrantId: string | null;
  },
  now: Date,
  maxDepth: number,
) {
  let parentId = grant.delegatedFromGrantId;
  const seen = new Set<string>();
  for (let depth = 0; parentId; depth++) {
    if (depth >= maxDepth || seen.has(parentId)) return false;
    seen.add(parentId);
    const parent = await tx.scopedGrant.findFirst({
      where: { id: parentId, organizationId: grant.organizationId },
      select: {
        id: true,
        status: true,
        effect: true,
        validFrom: true,
        validUntil: true,
        delegatedFromGrantId: true,
      },
    });
    if (!parent || parent.effect !== "ALLOW" || !timeValid(parent, now)) {
      return false;
    }
    parentId = parent.delegatedFromGrantId;
  }
  return true;
}

async function separationOfDutyReasons(
  tx: TenantTransaction,
  actorUserId: string,
  capability: Capability,
  resource: AuthorizationResource,
  policy: {
    requireIndependentVerification: boolean;
    requireIndependentReleaseApproval: boolean;
  },
) {
  if (
    !resource.missionId ||
    !["verification.review", "release.approve"].includes(capability)
  ) {
    return [];
  }
  const mission = await tx.mission.findUnique({
    where: { id: resource.missionId },
    select: { assuranceProfile: true },
  });
  if (
    !mission ||
    !["RESEARCH", "REGULATED"].includes(mission.assuranceProfile)
  ) {
    return [];
  }
  const [builderRun, verifierRun] = await Promise.all([
    tx.agentRun.findFirst({
      where: {
        missionId: resource.missionId,
        executionRole: "BUILDER",
        performedBy: { userId: actorUserId },
      },
      select: { id: true },
    }),
    tx.agentRun.findFirst({
      where: {
        missionId: resource.missionId,
        executionRole: "VERIFIER",
        performedBy: { userId: actorUserId },
      },
      select: { id: true },
    }),
  ]);
  const reasons: string[] = [];
  if (
    capability === "verification.review" &&
    policy.requireIndependentVerification &&
    builderRun
  ) {
    reasons.push("SOD_BUILDER_CANNOT_VERIFY");
  }
  if (
    capability === "release.approve" &&
    policy.requireIndependentReleaseApproval &&
    (builderRun || verifierRun)
  ) {
    reasons.push("SOD_EXECUTOR_CANNOT_RELEASE");
  }
  return reasons;
}

async function evaluateInTransaction(
  tx: TenantTransaction,
  actorUserId: string,
  capability: Capability,
  resource: AuthorizationResource,
  now: Date,
): Promise<AuthorizationDecision> {
  const policy = await tx.organizationPolicy.findUnique({
    where: { organizationId: resource.organizationId },
  });
  if (!policy) {
    return {
      allowed: false,
      capability,
      policyVersion: 0,
      matchedGrantIds: [],
      reasonCodes: ["POLICY_MISSING"],
    };
  }
  const resolved = await resolveResource(tx, resource);
  if (!resolved) {
    return {
      allowed: false,
      capability,
      policyVersion: policy.version,
      matchedGrantIds: [],
      reasonCodes: ["RESOURCE_NOT_FOUND"],
    };
  }
  const membership = await tx.organizationMembership.findUnique({
    where: {
      organizationId_userId: {
        organizationId: resource.organizationId,
        userId: actorUserId,
      },
    },
    select: {
      status: true,
      groupMemberships: { select: { groupId: true } },
    },
  });
  if (!membership || membership.status !== "ACTIVE") {
    return {
      allowed: false,
      capability,
      policyVersion: policy.version,
      matchedGrantIds: [],
      reasonCodes: ["SUBJECT_INACTIVE"],
    };
  }
  const ancestorIds = resolved.orgUnitId
    ? (
        await tx.orgUnitClosure.findMany({
          where: {
            organizationId: resource.organizationId,
            descendantId: resolved.orgUnitId,
          },
          select: { ancestorId: true },
          take: 64,
        })
      ).map((row) => row.ancestorId)
    : [];
  const groupIds = membership.groupMemberships.map((row) => row.groupId);
  const grants = await tx.scopedGrant.findMany({
    where: {
      organizationId: resource.organizationId,
      status: "ACTIVE",
      validFrom: { lte: now },
      OR: [{ validUntil: null }, { validUntil: { gt: now } }],
      AND: [
        {
          OR: [
            { subjectType: "USER", subjectUserId: actorUserId },
            ...(groupIds.length
              ? [
                  {
                    subjectType: "GROUP" as const,
                    subjectGroupId: { in: groupIds },
                  },
                ]
              : []),
          ],
        },
        {
          OR: [
            { scopeType: "ORGANIZATION" },
            ...(ancestorIds.length
              ? [
                  {
                    scopeType: "ORG_UNIT" as const,
                    orgUnitId: { in: ancestorIds },
                  },
                ]
              : []),
            ...(resolved.workspaceId
              ? [
                  {
                    scopeType: "WORKSPACE" as const,
                    workspaceId: resolved.workspaceId,
                  },
                ]
              : []),
            ...(resolved.missionId
              ? [
                  {
                    scopeType: "MISSION" as const,
                    missionId: resolved.missionId,
                  },
                ]
              : []),
          ],
        },
      ],
    },
    orderBy: [{ effect: "asc" }, { createdAt: "asc" }, { id: "asc" }],
    take: 200,
  });
  const applicable = [];
  for (const grant of grants) {
    if (
      enterpriseRoleAllows(grant.role, capability) &&
      (await validDelegationChain(tx, grant, now, policy.maxDelegationDepth))
    ) {
      applicable.push(grant);
    }
  }
  const denied = applicable.filter((grant) => grant.effect === "DENY");
  const allowed = applicable.filter((grant) => grant.effect === "ALLOW");
  if (denied.length) {
    return {
      allowed: false,
      capability,
      policyVersion: policy.version,
      matchedGrantIds: denied.map((grant) => grant.id),
      reasonCodes: ["EXPLICIT_DENY"],
    };
  }
  if (!allowed.length) {
    return {
      allowed: false,
      capability,
      policyVersion: policy.version,
      matchedGrantIds: [],
      reasonCodes: ["NO_APPLICABLE_GRANT"],
    };
  }
  const sodReasons = await separationOfDutyReasons(
    tx,
    actorUserId,
    capability,
    resolved,
    policy,
  );
  return {
    allowed: sodReasons.length === 0,
    capability,
    policyVersion: policy.version,
    matchedGrantIds: allowed.map((grant) => grant.id),
    reasonCodes: sodReasons.length ? sodReasons : ["ALLOW"],
  };
}

export async function authorize(
  actorUserId: string,
  capability: Capability,
  resource: AuthorizationResource,
  now = new Date(),
) {
  return withOrganizationTenant(resource.organizationId, actorUserId, (tx) =>
    evaluateInTransaction(tx, actorUserId, capability, resource, now),
  );
}

export async function requireAuthorization(
  actorUserId: string,
  capability: Capability,
  resource: AuthorizationResource,
) {
  const decision = await authorize(actorUserId, capability, resource);
  if (!decision.allowed) {
    throw new AuthorizationError(
      `Missing scoped capability: ${capability}`,
      decision.reasonCodes,
    );
  }
  return decision;
}

export async function organizationIdForWorkspace(workspaceId: string) {
  const workspace = await getDb().workspace.findUnique({
    where: { id: workspaceId },
    select: { organizationId: true },
  });
  if (!workspace) {
    throw new AuthorizationError("Workspace not found", ["RESOURCE_NOT_FOUND"]);
  }
  return workspace.organizationId;
}

export async function requireWorkspaceAuthorization(
  ctx: WorkspaceContext,
  capability: Capability,
  missionId?: string,
) {
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  const decision = await authorize(ctx.user.id, capability, {
    organizationId,
    workspaceId: ctx.workspace.id,
    missionId,
  });
  if (!decision.allowed) {
    await getDb().$transaction((tx) =>
      writeAuditEvent(tx, {
        workspaceId: ctx.workspace.id,
        actorUserId: ctx.user.id,
        actorMembershipId: ctx.membership.id,
        eventType: AuditEventType.AuthorizationDenied,
        entityType: missionId ? "Mission" : "Workspace",
        entityId: missionId ?? ctx.workspace.id,
        correlationId: ctx.correlationId,
        payload: {
          capability,
          reasonCodes: decision.reasonCodes.slice(0, 8),
          policyVersion: decision.policyVersion,
        },
      }),
    );
    throw new AuthorizationError(
      `Missing scoped capability: ${capability}`,
      decision.reasonCodes,
    );
  }
  return decision;
}

export type ScopedGrantCreateInput = {
  subjectType: "USER" | "GROUP";
  subjectUserId?: string;
  subjectGroupId?: string;
  role: EnterpriseRole;
  effect: GrantEffect;
  scopeType: GrantScopeType;
  orgUnitId?: string;
  workspaceId?: string;
  missionId?: string;
  delegatedFromGrantId?: string;
  validFrom?: Date;
  validUntil?: Date;
  reason: string;
};

export async function createScopedGrant(
  ctx: WorkspaceContext,
  input: ScopedGrantCreateInput,
) {
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  const managementCapability: Capability =
    input.role === "ORG_OWNER" ? "members.manage_owner" : "members.change_role";
  await requireAuthorization(ctx.user.id, managementCapability, {
    organizationId,
  });
  const reason = input.reason.trim();
  if (!reason || reason.length > 500) {
    throw new AuthorizationError("Grant reason is required", ["INVALID_INPUT"]);
  }
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    const issuer = await tx.organizationMembership.findUniqueOrThrow({
      where: {
        organizationId_userId: {
          organizationId,
          userId: ctx.user.id,
        },
      },
    });
    if (input.delegatedFromGrantId) {
      const parent = await tx.scopedGrant.findFirst({
        where: {
          id: input.delegatedFromGrantId,
          organizationId,
          role: input.role,
          effect: "ALLOW",
          status: "ACTIVE",
        },
      });
      const actorGroupIds = (
        await tx.organizationGroupMembership.findMany({
          where: {
            organizationId,
            organizationMembership: { userId: ctx.user.id, status: "ACTIVE" },
          },
          select: { groupId: true },
          take: 200,
        })
      ).map((membership) => membership.groupId);
      if (
        !parent ||
        (parent.subjectUserId !== ctx.user.id &&
          (!parent.subjectGroupId ||
            !actorGroupIds.includes(parent.subjectGroupId))) ||
        !timeValid(parent, new Date()) ||
        parent.scopeType !== input.scopeType ||
        parent.orgUnitId !== (input.orgUnitId ?? null) ||
        parent.workspaceId !== (input.workspaceId ?? null) ||
        parent.missionId !== (input.missionId ?? null)
      ) {
        throw new AuthorizationError("Delegation exceeds parent authority", [
          "DELEGATION_INVALID",
        ]);
      }
    }
    const grant = await tx.scopedGrant.create({
      data: {
        organizationId,
        subjectType: input.subjectType,
        subjectUserId: input.subjectUserId,
        subjectGroupId: input.subjectGroupId,
        role: input.role,
        effect: input.effect,
        scopeType: input.scopeType,
        orgUnitId: input.orgUnitId,
        workspaceId: input.workspaceId,
        missionId: input.missionId,
        delegatedFromGrantId: input.delegatedFromGrantId,
        grantedByOrganizationMembershipId: issuer.id,
        reason,
        validFrom: input.validFrom,
        validUntil: input.validUntil,
      },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.AuthorizationGrantCreated,
      entityType: "ScopedGrant",
      entityId: grant.id,
      correlationId: ctx.correlationId,
      payload: {
        role: grant.role,
        effect: grant.effect,
        scopeType: grant.scopeType,
        subjectType: grant.subjectType,
      },
    });
    return grant;
  });
}

export async function revokeScopedGrant(
  ctx: WorkspaceContext,
  grantId: string,
  expectedVersion: number,
  reason: string,
) {
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  await requireAuthorization(ctx.user.id, "members.change_role", {
    organizationId,
  });
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    const revoker = await tx.organizationMembership.findUniqueOrThrow({
      where: {
        organizationId_userId: {
          organizationId,
          userId: ctx.user.id,
        },
      },
    });
    const normalizedReason = reason.trim();
    if (!normalizedReason || normalizedReason.length > 500) {
      throw new AuthorizationError("Revocation reason is required", [
        "INVALID_INPUT",
      ]);
    }
    const result = await tx.scopedGrant.updateMany({
      where: {
        id: grantId,
        organizationId,
        status: "ACTIVE",
        version: expectedVersion,
      },
      data: {
        status: "REVOKED",
        revokedAt: new Date(),
        revokedByOrganizationMembershipId: revoker.id,
        version: { increment: 1 },
      },
    });
    if (result.count !== 1) {
      throw new AuthorizationError("Grant changed or was not found", [
        "STALE_OR_MISSING_GRANT",
      ]);
    }
    const revoked = await tx.scopedGrant.findUniqueOrThrow({
      where: { id: grantId },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.AuthorizationGrantRevoked,
      entityType: "ScopedGrant",
      entityId: grantId,
      correlationId: ctx.correlationId,
      payload: { reason: normalizedReason, version: revoked.version },
    });
  });
}
