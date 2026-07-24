import { beforeEach, describe, expect, it } from "vitest";

import {
  enforceManualProviderPolicy,
  getWorkspacePolicy,
  updateWorkspacePolicy,
} from "@/modules/identity-workspace";
import { createMission } from "@/modules/mission-kernel";
import { getDb } from "@/server/db";

import { asOwner, createUser, truncateAll } from "./helpers";

beforeEach(async () => {
  await truncateAll();
});

describe("Workspace operating policy", () => {
  it("POL-01 persists, audits and applies the default assurance profile", async () => {
    const ctx = await asOwner(await createUser("policy-owner"));
    await updateWorkspacePolicy(ctx, {
      defaultAssuranceProfile: "RESEARCH",
      providerPolicyMode: "OPEN_MANUAL",
      allowedProviders: [],
      artifactRetentionDays: 730,
      evidenceRetentionDays: 1_095,
      auditRetentionDays: 2_555,
      publicReleasePolicy: "INTERNAL_ONLY",
    });

    const policy = await getWorkspacePolicy(ctx);
    expect(policy).toMatchObject({
      defaultAssuranceProfile: "RESEARCH",
      storageMode: "DATABASE",
      publicReleasePolicy: "INTERNAL_ONLY",
      version: 2,
    });
    const mission = await createMission(ctx, {
      title: "Policy-derived mission",
    });
    expect(mission.assuranceProfile).toBe("RESEARCH");
    expect(
      await getDb().auditEvent.findFirst({
        where: {
          workspaceId: ctx.workspace.id,
          eventType: "workspace.policy_updated",
        },
      }),
    ).toBeTruthy();
  });

  it("POL-02 enforces provider and model allowlists case-insensitively", async () => {
    const ctx = await asOwner(await createUser("provider-policy-owner"));
    await updateWorkspacePolicy(ctx, {
      defaultAssuranceProfile: "PROFESSIONAL",
      providerPolicyMode: "ALLOWLIST_MANUAL",
      allowedProviders: [
        {
          providerName: "Approved Provider",
          modelNames: ["Builder-V1", "Verifier-V1"],
        },
      ],
      artifactRetentionDays: 2_555,
      evidenceRetentionDays: 2_555,
      auditRetentionDays: 2_555,
      publicReleasePolicy: "GOVERNED_PUBLIC",
    });

    await expect(
      enforceManualProviderPolicy(
        getDb(),
        ctx.workspace.id,
        "approved provider",
        "builder-v1",
      ),
    ).resolves.toBeUndefined();
    await expect(
      enforceManualProviderPolicy(
        getDb(),
        ctx.workspace.id,
        "unapproved",
        "builder-v1",
      ),
    ).rejects.toMatchObject({ code: "PROVIDER_POLICY_BLOCKED" });
  });

  it("POL-03 rejects an empty allowlist and unsafe retention bounds", async () => {
    const ctx = await asOwner(await createUser("invalid-policy-owner"));
    await expect(
      updateWorkspacePolicy(ctx, {
        defaultAssuranceProfile: "PROFESSIONAL",
        providerPolicyMode: "ALLOWLIST_MANUAL",
        allowedProviders: [],
        artifactRetentionDays: 1,
        evidenceRetentionDays: 1,
        auditRetentionDays: 1,
        publicReleasePolicy: "GOVERNED_PUBLIC",
      }),
    ).rejects.toMatchObject({ code: "WORKSPACE_POLICY_INVALID" });
  });
});
