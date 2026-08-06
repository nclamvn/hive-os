import { randomUUID } from "node:crypto";

import { beforeEach, describe, expect, it } from "vitest";

import { claimJobs } from "@/modules/command-runtime";
import { getDb } from "@/server/db";
import { withOrganizationTenant } from "@/server/tenant-context";

import { asOwner, createUser, truncateAll } from "./helpers";

beforeEach(async () => {
  await truncateAll();
});

describe("credentialless service-principal boundary (TIP-024D)", () => {
  it("permits bounded worker attribution but rejects credentials and privileged roles", async () => {
    const owner = await asOwner(await createUser("service-owner"));
    const workspace = await getDb().workspace.findUniqueOrThrow({
      where: { id: owner.workspace.id },
      select: { organizationId: true },
    });
    const service = await getDb().user.create({
      data: {
        id: `svc_${randomUUID()}`,
        name: "Research worker",
        email: `research-worker-${randomUUID()}@hiveos.invalid`,
        principalType: "SERVICE",
      },
    });

    await withOrganizationTenant(
      workspace.organizationId,
      owner.user.id,
      async (tx) => {
        await tx.organizationMembership.create({
          data: {
            organizationId: workspace.organizationId,
            userId: service.id,
            role: "MEMBER",
            status: "ACTIVE",
            createdById: owner.user.id,
          },
        });
      },
    );

    await expect(
      getDb().account.create({
        data: {
          id: randomUUID(),
          accountId: service.id,
          providerId: "credential",
          userId: service.id,
          password: "must-never-be-retained",
        },
      }),
    ).rejects.toThrow();
    await expect(
      getDb().session.create({
        data: {
          id: randomUUID(),
          expiresAt: new Date(Date.now() + 60_000),
          token: randomUUID(),
          userId: service.id,
        },
      }),
    ).rejects.toThrow();
    await expect(
      getDb().user.update({
        where: { id: service.id },
        data: { principalType: "HUMAN" },
      }),
    ).rejects.toThrow();

    await expect(
      withOrganizationTenant(
        workspace.organizationId,
        owner.user.id,
        (tx) =>
          tx.organizationMembership.update({
            where: {
              organizationId_userId: {
                organizationId: workspace.organizationId,
                userId: service.id,
              },
            },
            data: { role: "ADMIN" },
          }),
      ),
    ).rejects.toThrow();

    const ownerOrganizationMembership = await withOrganizationTenant(
      workspace.organizationId,
      owner.user.id,
      (tx) =>
        tx.organizationMembership.findUniqueOrThrow({
          where: {
            organizationId_userId: {
              organizationId: workspace.organizationId,
              userId: owner.user.id,
            },
          },
        }),
    );
    await expect(
      withOrganizationTenant(
        workspace.organizationId,
        owner.user.id,
        (tx) =>
          tx.scopedGrant.create({
            data: {
              organizationId: workspace.organizationId,
              subjectType: "USER",
              subjectUserId: service.id,
              role: "CONTRIBUTOR",
              effect: "ALLOW",
              scopeType: "ORGANIZATION",
              grantedByOrganizationMembershipId:
                ownerOrganizationMembership.id,
              reason: "Must fail closed",
            },
          }),
      ),
    ).rejects.toThrow();

    await expect(
      claimJobs({
        organizationId: workspace.organizationId,
        actorUserId: service.id,
        workerId: "research-worker-test",
        jobTypes: ["research.run.execute"],
        first: 1,
      }),
    ).resolves.toEqual([]);
  });
});
