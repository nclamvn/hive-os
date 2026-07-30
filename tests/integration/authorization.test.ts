import { randomUUID } from "node:crypto";

import pg from "pg";
import { beforeEach, describe, expect, it } from "vitest";

import {
  authorize,
  createScopedGrant,
  requireWorkspaceAuthorization,
  revokeScopedGrant,
} from "@/modules/authorization";
import type { WorkspaceContext } from "@/modules/identity-workspace";
import {
  addOrganizationGroupMember,
  createOrganizationGroup,
  createOrgUnit,
  getOrganizationHierarchy,
} from "@/modules/organization";
import { createExecutionTip, issueManualRun } from "@/modules/execution-fabric";
import { registerSkill } from "@/modules/skill-runtime";
import { getDb } from "@/server/db";
import { withOrganizationTenant } from "@/server/tenant-context";

import {
  asOwner,
  contextForMembership,
  createUser,
  ownerQuery,
  truncateAll,
} from "./helpers";

beforeEach(async () => {
  await truncateAll();
});

async function addWorkspaceMember(
  owner: WorkspaceContext,
  prefix: string,
  role: "ADMIN" | "MEMBER" | "VIEWER" = "MEMBER",
) {
  const user = await createUser(prefix);
  const workspace = await getDb().workspace.findUniqueOrThrow({
    where: { id: owner.workspace.id },
    select: { organizationId: true },
  });
  await getDb().membership.create({
    data: {
      workspaceId: owner.workspace.id,
      userId: user.id,
      role,
      status: "ACTIVE",
      createdById: owner.user.id,
    },
  });
  const organizationMembership = await withOrganizationTenant(
    workspace.organizationId,
    owner.user.id,
    (tx) =>
      tx.organizationMembership.create({
        data: {
          organizationId: workspace.organizationId,
          userId: user.id,
          role,
          status: "ACTIVE",
          createdById: owner.user.id,
        },
      }),
  );
  return {
    user,
    organizationId: workspace.organizationId,
    organizationMembership,
    ctx: await contextForMembership(user, owner.workspace.id),
  };
}

describe("Scoped authorization and RLS (TIP-023B)", () => {
  it("AUTH-01 preserves founding Owner authority", async () => {
    const owner = await asOwner(await createUser("authority-owner"));
    const workspace = await getDb().workspace.findUniqueOrThrow({
      where: { id: owner.workspace.id },
      select: { organizationId: true },
    });

    await expect(
      authorize(owner.user.id, "workspace.update", {
        organizationId: workspace.organizationId,
        workspaceId: owner.workspace.id,
      }),
    ).resolves.toMatchObject({
      allowed: true,
      reasonCodes: ["ALLOW"],
      policyVersion: 1,
    });
  });

  it("AUTH-02 inherits OrgUnit grants only through descendants", async () => {
    const owner = await asOwner(await createUser("scope-owner"));
    const member = await addWorkspaceMember(owner, "scope-member");
    const root = (await getOrganizationHierarchy(owner)).units[0]!;
    const division = await createOrgUnit(owner, {
      parentId: root.id,
      unitKey: "platform-division",
      name: "Platform Division",
      type: "BUSINESS_UNIT",
    });
    const child = await createOrgUnit(owner, {
      parentId: division.id,
      unitKey: "autonomy-department",
      name: "Autonomy Department",
      type: "DEPARTMENT",
    });
    const sibling = await createOrgUnit(owner, {
      parentId: root.id,
      unitKey: "finance-division",
      name: "Finance Division",
      type: "BUSINESS_UNIT",
    });
    await createScopedGrant(owner, {
      subjectType: "USER",
      subjectUserId: member.user.id,
      role: "PORTFOLIO_LEAD",
      effect: "ALLOW",
      scopeType: "ORG_UNIT",
      orgUnitId: division.id,
      reason: "Lead the platform subtree",
    });

    expect(
      await authorize(member.user.id, "missions.approve_contract", {
        organizationId: member.organizationId,
        orgUnitId: child.id,
      }),
    ).toMatchObject({ allowed: true });
    expect(
      await authorize(member.user.id, "missions.approve_contract", {
        organizationId: member.organizationId,
        orgUnitId: sibling.id,
      }),
    ).toMatchObject({
      allowed: false,
      reasonCodes: ["NO_APPLICABLE_GRANT"],
    });
  });

  it("AUTH-03 merges group grants and gives explicit deny precedence", async () => {
    const owner = await asOwner(await createUser("deny-owner"));
    const member = await addWorkspaceMember(owner, "deny-member");
    const group = await createOrganizationGroup(owner, {
      groupKey: "mission-operators",
      name: "Mission Operators",
    });
    await addOrganizationGroupMember(owner, {
      groupId: group.id,
      organizationMembershipId: member.organizationMembership.id,
    });
    await createScopedGrant(owner, {
      subjectType: "GROUP",
      subjectGroupId: group.id,
      role: "CONTRIBUTOR",
      effect: "ALLOW",
      scopeType: "ORGANIZATION",
      reason: "Mission operator group",
    });
    await createScopedGrant(owner, {
      subjectType: "USER",
      subjectUserId: member.user.id,
      role: "CONTRIBUTOR",
      effect: "DENY",
      scopeType: "ORGANIZATION",
      reason: "Temporary mission creation hold",
    });

    expect(
      await authorize(member.user.id, "missions.create", {
        organizationId: member.organizationId,
        workspaceId: owner.workspace.id,
      }),
    ).toMatchObject({
      allowed: false,
      reasonCodes: ["EXPLICIT_DENY"],
    });
  });

  it("AUTH-04 fails a delegated grant closed after parent revocation", async () => {
    const owner = await asOwner(await createUser("delegation-owner"));
    const member = await addWorkspaceMember(owner, "delegation-member");
    const parent = await createScopedGrant(owner, {
      subjectType: "USER",
      subjectUserId: owner.user.id,
      role: "VERIFIER",
      effect: "ALLOW",
      scopeType: "WORKSPACE",
      workspaceId: owner.workspace.id,
      reason: "Delegable verification authority",
    });
    await createScopedGrant(owner, {
      subjectType: "USER",
      subjectUserId: member.user.id,
      role: "VERIFIER",
      effect: "ALLOW",
      scopeType: "WORKSPACE",
      workspaceId: owner.workspace.id,
      delegatedFromGrantId: parent.id,
      validUntil: new Date(Date.now() + 60_000),
      reason: "Bounded verifier delegation",
    });
    await expect(
      withOrganizationTenant(
        member.organizationId,
        owner.user.id,
        async (tx) => {
          const issuer = await tx.organizationMembership.findUniqueOrThrow({
            where: {
              organizationId_userId: {
                organizationId: member.organizationId,
                userId: owner.user.id,
              },
            },
          });
          return tx.scopedGrant.create({
            data: {
              organizationId: member.organizationId,
              subjectType: "USER",
              subjectUserId: member.user.id,
              role: "VERIFIER",
              effect: "ALLOW",
              scopeType: "ORGANIZATION",
              delegatedFromGrantId: parent.id,
              grantedByOrganizationMembershipId: issuer.id,
              reason: "Invalid broader delegation",
            },
          });
        },
      ),
    ).rejects.toThrow(/delegated grant exceeds/i);
    expect(
      await authorize(member.user.id, "verification.review", {
        organizationId: member.organizationId,
        workspaceId: owner.workspace.id,
      }),
    ).toMatchObject({ allowed: true });

    await revokeScopedGrant(
      owner,
      parent.id,
      parent.version,
      "Delegation window closed",
    );
    expect(
      await authorize(member.user.id, "verification.review", {
        organizationId: member.organizationId,
        workspaceId: owner.workspace.id,
      }),
    ).toMatchObject({
      allowed: false,
      reasonCodes: ["NO_APPLICABLE_GRANT"],
    });
  });

  it("AUTH-05 blocks a named Research Builder from verification approval", async () => {
    const owner = await asOwner(await createUser("sod-owner"));
    const builder = await addWorkspaceMember(owner, "sod-builder");
    const mission = await getDb().mission.create({
      data: {
        workspaceId: owner.workspace.id,
        referenceCode: `SOD-${randomUUID().slice(0, 8)}`,
        title: "Research separation mission",
        status: "EXPLORING",
        assuranceProfile: "RESEARCH",
        createdByMembershipId: owner.membership.id,
      },
    });
    const skill = await registerSkill(
      owner,
      {
        skillKey: "sod-builder-skill",
        displayName: "SoD Builder",
        description: "Named human performer separation fixture",
      },
      {
        semanticVersion: "1.0.0",
        capabilities: ["implementation_planning"],
        inputSchema: { type: "object", properties: {} },
        outputSchema: { type: "object", properties: {} },
        requiredEvidence: ["completion_report"],
        failureStates: ["BLOCKED"],
        verifierBinding: { kind: "HUMAN", verifierKey: "independent-review" },
        resourceEstimate: { maxDurationSeconds: 60, maxMemoryMb: 128 },
        assuranceCompatibility: ["RESEARCH"],
      },
    );
    const tip = await createExecutionTip(owner, mission.id, {
      code: "SOD-1",
      title: "Build governed result",
      description: "Named Builder execution",
      skillVersionId: skill.activeVersion.id,
      predecessorTipIds: [],
    });
    await issueManualRun(owner, tip.id, {
      executionRole: "BUILDER",
      providerName: "human",
      modelName: "named-builder",
      instruction: "Execute the named Research build.",
      performedByMembershipId: builder.ctx.membership.id,
    });
    await createScopedGrant(owner, {
      subjectType: "USER",
      subjectUserId: builder.user.id,
      role: "VERIFIER",
      effect: "ALLOW",
      scopeType: "MISSION",
      missionId: mission.id,
      reason: "Deliberate SoD corruption scenario",
    });

    await expect(
      requireWorkspaceAuthorization(
        builder.ctx,
        "verification.review",
        mission.id,
      ),
    ).rejects.toMatchObject({
      reasonCodes: expect.arrayContaining(["SOD_BUILDER_CANNOT_VERIFY"]),
    });
    expect(
      await getDb().auditEvent.findFirst({
        where: {
          workspaceId: owner.workspace.id,
          actorUserId: builder.user.id,
          eventType: "authorization.denied",
        },
      }),
    ).toBeTruthy();
  });

  it("AUTH-06 forces runtime-role RLS with transaction-local tenant context", async () => {
    const ownerA = await asOwner(await createUser("rls-owner-a"));
    const ownerB = await asOwner(await createUser("rls-owner-b"));
    const workspaceA = await getDb().workspace.findUniqueOrThrow({
      where: { id: ownerA.workspace.id },
      select: { organizationId: true },
    });
    const workspaceB = await getDb().workspace.findUniqueOrThrow({
      where: { id: ownerB.workspace.id },
      select: { organizationId: true },
    });
    const runtime = new pg.Client({
      connectionString: process.env.DATABASE_URL,
    });
    await runtime.connect();
    try {
      expect(
        (await runtime.query("SELECT id FROM organization")).rowCount,
      ).toBe(0);
      await runtime.query("BEGIN");
      await runtime.query(
        "SELECT set_config('hiveos.organization_id', $1, true)",
        [workspaceA.organizationId],
      );
      expect((await runtime.query("SELECT id FROM organization")).rows).toEqual(
        [{ id: workspaceA.organizationId }],
      );
      expect(
        (
          await runtime.query("SELECT id FROM organization WHERE id = $1", [
            workspaceB.organizationId,
          ])
        ).rowCount,
      ).toBe(0);
      await expect(
        runtime.query(
          `INSERT INTO org_unit
             (id, organization_id, parent_id, unit_key, name, type,
              status, created_by_id, created_at, updated_at, version)
           VALUES ($1, $2, NULL, 'foreign-root', 'Foreign', 'ROOT',
             'ACTIVE', $3, now(), now(), 1)`,
          [randomUUID(), workspaceB.organizationId, ownerA.user.id],
        ),
      ).rejects.toBeTruthy();
      await runtime.query("ROLLBACK");
    } finally {
      await runtime.end();
    }
    const role = await ownerQuery<{ rolbypassrls: boolean }>(
      "SELECT rolbypassrls FROM pg_roles WHERE rolname='hiveos_app'",
    );
    expect(role[0]?.rolbypassrls).toBe(false);
  });
});
