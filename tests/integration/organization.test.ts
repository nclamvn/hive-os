import { beforeEach, describe, expect, it } from "vitest";

import {
  addOrganizationGroupMember,
  createOrganizationGroup,
  createOrgUnit,
  createPortfolio,
  getOrganizationHierarchy,
  listOrganizationCollections,
  moveOrgUnit,
} from "@/modules/organization";
import { getDb } from "@/server/db";
import { withOrganizationTenant } from "@/server/tenant-context";

import { asOwner, createUser, truncateAll } from "./helpers";

beforeEach(async () => {
  await truncateAll();
});

describe("Enterprise organization graph (TIP-023A)", () => {
  it("ORG-02 provisions organization, root closure and compatibility membership atomically", async () => {
    const ctx = await asOwner(await createUser("org-owner"));
    const workspace = await getDb().workspace.findUniqueOrThrow({
      where: { id: ctx.workspace.id },
    });
    const [organization, root, closure, organizationMembership] =
      await withOrganizationTenant(
        workspace.organizationId,
        ctx.user.id,
        (tx) =>
          Promise.all([
            tx.organization.findUnique({
              where: { id: workspace.organizationId },
            }),
            tx.orgUnit.findUnique({ where: { id: workspace.orgUnitId } }),
            tx.orgUnitClosure.findUnique({
              where: {
                organizationId_ancestorId_descendantId: {
                  organizationId: workspace.organizationId,
                  ancestorId: workspace.orgUnitId,
                  descendantId: workspace.orgUnitId,
                },
              },
            }),
            tx.organizationMembership.findUnique({
              where: {
                organizationId_userId: {
                  organizationId: workspace.organizationId,
                  userId: ctx.user.id,
                },
              },
            }),
          ]),
      );

    expect(organization).toMatchObject({
      name: ctx.workspace.name,
      status: "ACTIVE",
    });
    expect(root).toMatchObject({
      organizationId: workspace.organizationId,
      parentId: null,
      unitKey: "root",
      type: "ROOT",
    });
    expect(closure).toMatchObject({ depth: 0 });
    expect(organizationMembership).toMatchObject({
      role: "OWNER",
      status: "ACTIVE",
    });
    expect(
      await getDb().auditEvent.findFirst({
        where: {
          workspaceId: ctx.workspace.id,
          eventType: "organization.provisioned",
        },
      }),
    ).toBeTruthy();
  });

  it("ORG-03 maintains correct bounded closure depths", async () => {
    const ctx = await asOwner(await createUser("hierarchy-owner"));
    const initial = await getOrganizationHierarchy(ctx);
    const root = initial.units.find((unit) => unit.type === "ROOT")!;
    const division = await createOrgUnit(ctx, {
      parentId: root.id,
      unitKey: "mobility",
      name: "Mobility",
      type: "BUSINESS_UNIT",
    });
    const team = await createOrgUnit(ctx, {
      parentId: division.id,
      unitKey: "autonomy-team",
      name: "Autonomy Team",
      type: "TEAM",
    });

    const hierarchy = await getOrganizationHierarchy(ctx, 10);
    expect(hierarchy.units).toHaveLength(3);
    expect(hierarchy.pageInfo).toEqual({
      limit: 10,
      truncated: false,
      pathsTruncated: false,
    });
    expect(
      hierarchy.paths.find(
        (path) => path.ancestorId === root.id && path.descendantId === team.id,
      )?.depth,
    ).toBe(2);
    expect(
      hierarchy.paths.find(
        (path) =>
          path.ancestorId === division.id && path.descendantId === team.id,
      )?.depth,
    ).toBe(1);
  });

  it("ORG-04 serializes concurrent moves and rejects the resulting cycle", async () => {
    const ctx = await asOwner(await createUser("cycle-owner"));
    const root = (await getOrganizationHierarchy(ctx)).units[0]!;
    const alpha = await createOrgUnit(ctx, {
      parentId: root.id,
      unitKey: "alpha-unit",
      name: "Alpha",
      type: "DEPARTMENT",
    });
    const beta = await createOrgUnit(ctx, {
      parentId: root.id,
      unitKey: "beta-unit",
      name: "Beta",
      type: "DEPARTMENT",
    });

    const outcomes = await Promise.allSettled([
      moveOrgUnit(ctx, {
        unitId: alpha.id,
        parentId: beta.id,
        expectedVersion: alpha.version,
      }),
      moveOrgUnit(ctx, {
        unitId: beta.id,
        parentId: alpha.id,
        expectedVersion: beta.version,
      }),
    ]);
    expect(
      outcomes.filter((outcome) => outcome.status === "fulfilled"),
    ).toHaveLength(1);
    expect(
      outcomes.filter((outcome) => outcome.status === "rejected"),
    ).toHaveLength(1);

    const hierarchy = await getOrganizationHierarchy(ctx);
    expect(hierarchy.units).toHaveLength(3);
    expect(
      hierarchy.paths.filter(
        (path) =>
          path.ancestorId !== path.descendantId &&
          [alpha.id, beta.id].includes(path.ancestorId) &&
          [alpha.id, beta.id].includes(path.descendantId),
      ),
    ).toHaveLength(1);
  });

  it("ORG-05 rejects foreign parents without changing either hierarchy", async () => {
    const ctxA = await asOwner(await createUser("tenant-a-owner"));
    const ctxB = await asOwner(await createUser("tenant-b-owner"));
    const rootA = (await getOrganizationHierarchy(ctxA)).units[0]!;
    const rootB = (await getOrganizationHierarchy(ctxB)).units[0]!;
    const unitA = await createOrgUnit(ctxA, {
      parentId: rootA.id,
      unitKey: "tenant-a-unit",
      name: "Tenant A Unit",
      type: "TEAM",
    });

    await expect(
      createOrgUnit(ctxA, {
        parentId: rootB.id,
        unitKey: "foreign-parent",
        name: "Foreign parent",
        type: "TEAM",
      }),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
    await expect(
      moveOrgUnit(ctxA, {
        unitId: unitA.id,
        parentId: rootB.id,
        expectedVersion: unitA.version,
      }),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });

    expect((await getOrganizationHierarchy(ctxA)).units).toHaveLength(2);
    expect((await getOrganizationHierarchy(ctxB)).units).toHaveLength(1);
  });

  it("ORG-06 creates tenant-scoped portfolios, groups and memberships", async () => {
    const ctx = await asOwner(await createUser("collection-owner"));
    const hierarchy = await getOrganizationHierarchy(ctx);
    const root = hierarchy.units[0]!;
    const portfolio = await createPortfolio(ctx, {
      orgUnitId: root.id,
      portfolioKey: "future-mobility",
      name: "Future Mobility",
    });
    const group = await createOrganizationGroup(ctx, {
      groupKey: "independent-verifiers",
      name: "Independent Verifiers",
    });
    const organizationMembership = await withOrganizationTenant(
      hierarchy.organization.id,
      ctx.user.id,
      (tx) =>
        tx.organizationMembership.findFirstOrThrow({
          where: { userId: ctx.user.id },
        }),
    );
    const groupMembership = await addOrganizationGroupMember(ctx, {
      groupId: group.id,
      organizationMembershipId: organizationMembership.id,
    });

    const collections = await listOrganizationCollections(ctx);
    expect(collections.limit).toBe(200);
    expect(collections.portfolios).toEqual([
      expect.objectContaining({ id: portfolio.id }),
    ]);
    expect(collections.groups).toEqual([
      expect.objectContaining({
        id: group.id,
        _count: { memberships: 1 },
      }),
    ]);
    expect(groupMembership.organizationId).toBe(hierarchy.organization.id);
  });
});
