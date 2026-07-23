import { beforeEach, describe, expect, it } from "vitest";

import {
  acceptInvitation,
  createInvitation,
} from "@/modules/identity-workspace";
import {
  activateSkillVersion,
  changeSkillStatus,
  discoverCompatibleSkills,
  getSkillRegistryEntry,
  listSkills,
  registerSkill,
  registerSkillVersion,
  type SkillContractInput,
} from "@/modules/skill-runtime";
import { getDb } from "@/server/db";

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

function contract(
  semanticVersion: string,
  overrides: Partial<SkillContractInput> = {},
): SkillContractInput {
  return {
    semanticVersion,
    capabilities: [
      "web_evidence_ingestion",
      "deterministic_registry",
    ],
    inputSchema: {
      type: "object",
      properties: { query: { type: "string" } },
    },
    outputSchema: {
      type: "object",
      properties: { registry: { type: "array" } },
    },
    requiredEvidence: ["source_snapshot", "exact_span"],
    failureStates: ["OPEN_INCOMPLETE", "BLOCKED"],
    verifierBinding: {
      kind: "DETERMINISTIC",
      verifierKey: "registry-hygiene",
    },
    resourceEstimate: {
      maxDurationSeconds: 900,
      maxMemoryMb: 1024,
    },
    assuranceCompatibility: ["RESEARCH", "REGULATED"],
    ...overrides,
  };
}

async function refinery(
  ctx: Awaited<ReturnType<typeof asOwner>>,
) {
  return registerSkill(
    ctx,
    {
      skillKey: "refinery",
      displayName: "Refinery",
      description: "Evidence ingestion and deterministic registry output",
    },
    contract("1.0.0"),
  );
}

describe("Skill Registry", () => {
  it("SKL-01 atomically registers an active, hashed and audited initial contract", async () => {
    const ctx = await asOwner(await createUser("skill-owner"));
    const skill = await refinery(ctx);

    expect(skill.skillKey).toBe("refinery");
    expect(skill.activeVersion.semanticVersion).toBe("1.0.0");
    expect(skill.activeVersion.contentHash).toMatch(/^[a-f0-9]{64}$/);
    expect(skill.version).toBe(1);
    expect(
      await getDb().auditEvent.count({
        where: {
          workspaceId: ctx.workspace.id,
          eventType: {
            in: ["skill.created", "skill.version_registered"],
          },
        },
      }),
    ).toBe(2);
  });

  it("SKL-02 appends an inert version and activates it explicitly", async () => {
    const ctx = await asOwner(await createUser("skill-owner"));
    const skill = await refinery(ctx);
    const candidate = await registerSkillVersion(
      ctx,
      skill.id,
      contract("1.1.0", {
        capabilities: [
          "web_evidence_ingestion",
          "deterministic_registry",
          "registry_audit",
        ],
      }),
    );

    expect((await listSkills(ctx))[0].activeVersion.semanticVersion).toBe(
      "1.0.0",
    );
    const activated = await activateSkillVersion(
      ctx,
      skill.id,
      candidate.id,
      {
        expectedVersion: 1,
        reason: "Approved registry audit capability",
      },
    );
    expect(activated.activeVersion.semanticVersion).toBe("1.1.0");
    expect(activated.version).toBe(2);
    expect(
      await getDb().auditEvent.count({
        where: {
          workspaceId: ctx.workspace.id,
          eventType: "skill.version_activated",
        },
      }),
    ).toBe(1);
  });

  it("SKL-03 rejects duplicate semantic versions and immutable contract mutation", async () => {
    const ctx = await asOwner(await createUser("skill-owner"));
    const skill = await refinery(ctx);

    await expect(
      registerSkillVersion(ctx, skill.id, contract("1.0.0")),
    ).rejects.toMatchObject({ code: "SKILL_CONFLICT" });
    await expect(
      ownerQuery(
        `UPDATE skill_version SET semantic_version='9.9.9' WHERE id='${skill.activeVersion.id}'`,
      ),
    ).rejects.toThrow(/append-only/i);
    await expect(
      getDb().skillVersion.delete({
        where: { id: skill.activeVersion.id },
      }),
    ).rejects.toThrow(/append-only|permission denied/i);
    await expect(
      ownerQuery(
        `UPDATE skill SET skill_key='changed-key' WHERE id='${skill.id}'`,
      ),
    ).rejects.toThrow(/stable identity is immutable/i);
  });

  it("SKL-04 fail-closes cross-workspace registry access", async () => {
    const ctxA = await asOwner(await createUser("skill-a"));
    const ctxB = await asOwner(await createUser("skill-b"));
    const skillA = await refinery(ctxA);

    await expect(
      getSkillRegistryEntry(ctxB, skillA.id),
    ).rejects.toMatchObject({ code: "SKILL_NOT_FOUND" });
    await expect(
      registerSkillVersion(ctxB, skillA.id, contract("1.1.0")),
    ).rejects.toMatchObject({ code: "SKILL_NOT_FOUND" });
    expect(await listSkills(ctxB)).toEqual([]);
  });

  it("SKL-05 permits Viewer discovery but rejects registry mutation", async () => {
    const owner = await asOwner(await createUser("skill-owner"));
    await refinery(owner);
    const viewerUser = await createUser("skill-viewer");
    const invitation = await createInvitation(owner, {
      email: viewerUser.email,
      role: "VIEWER",
    });
    await acceptInvitation(viewerUser, invitation.rawToken);
    const viewer = await contextForMembership(
      viewerUser,
      owner.workspace.id,
    );

    expect(await listSkills(viewer)).toHaveLength(1);
    await expect(
      registerSkill(
        viewer,
        {
          skillKey: "unauthorized",
          displayName: "Unauthorized",
          description: "Must not be registered",
        },
        contract("1.0.0"),
      ),
    ).rejects.toMatchObject({ code: "SKILL_FORBIDDEN" });
  });

  it("SKL-06 discovers only active contracts matching all capabilities and assurance", async () => {
    const ctx = await asOwner(await createUser("skill-owner"));
    await refinery(ctx);
    const vibecode = await registerSkill(
      ctx,
      {
        skillKey: "vibecode",
        displayName: "Vibecode",
        description: "Bounded implementation workflow",
      },
      contract("2.0.0", {
        capabilities: ["implementation_planning"],
        assuranceCompatibility: ["PROFESSIONAL"],
      }),
    );

    expect(
      (
        await discoverCompatibleSkills(ctx, {
          requiredCapabilities: ["web_evidence_ingestion"],
          assuranceProfile: "RESEARCH",
        })
      ).map((skill) => skill.skillKey),
    ).toEqual(["refinery"]);
    expect(
      await discoverCompatibleSkills(ctx, {
        requiredCapabilities: ["web_evidence_ingestion"],
        assuranceProfile: "QUICK",
      }),
    ).toEqual([]);
    expect(
      (
        await discoverCompatibleSkills(ctx, {
          requiredCapabilities: ["implementation_planning"],
          assuranceProfile: "PROFESSIONAL",
        })
      ).map((skill) => skill.skillKey),
    ).toEqual(["vibecode"]);

    await changeSkillStatus(ctx, vibecode.id, "DEPRECATED", {
      expectedVersion: 1,
      reason: "Superseded operating method",
    });
    expect(
      await discoverCompatibleSkills(ctx, {
        requiredCapabilities: ["implementation_planning"],
        assuranceProfile: "PROFESSIONAL",
      }),
    ).toEqual([]);
  });

  it("SKL-07 serializes competing activations with optimistic version checks", async () => {
    const ctx = await asOwner(await createUser("skill-owner"));
    const skill = await refinery(ctx);
    const first = await registerSkillVersion(
      ctx,
      skill.id,
      contract("1.1.0"),
    );
    const second = await registerSkillVersion(
      ctx,
      skill.id,
      contract("1.2.0", {
        requiredEvidence: ["source_snapshot", "exact_span", "audit_receipt"],
      }),
    );

    const outcomes = await Promise.allSettled([
      activateSkillVersion(ctx, skill.id, first.id, {
        expectedVersion: 1,
        reason: "Candidate one",
      }),
      activateSkillVersion(ctx, skill.id, second.id, {
        expectedVersion: 1,
        reason: "Candidate two",
      }),
    ]);
    expect(
      outcomes.filter((outcome) => outcome.status === "fulfilled"),
    ).toHaveLength(1);
    expect(
      outcomes.filter((outcome) => outcome.status === "rejected"),
    ).toHaveLength(1);

    const final = await getSkillRegistryEntry(ctx, skill.id);
    expect(final.version).toBe(2);
    expect(["1.1.0", "1.2.0"]).toContain(
      final.activeVersion.semanticVersion,
    );
  });

  it("SKL-08 database rejects an active version from another skill", async () => {
    const ctx = await asOwner(await createUser("skill-owner"));
    const first = await refinery(ctx);
    const second = await registerSkill(
      ctx,
      {
        skillKey: "registry-hygiene",
        displayName: "Registry Hygiene",
        description: "Registry verification contract",
      },
      contract("1.0.0", {
        capabilities: ["registry_audit"],
      }),
    );
    const foreignCandidate = await registerSkillVersion(
      ctx,
      second.id,
      contract("1.1.0", {
        capabilities: ["registry_audit", "deterministic_registry"],
      }),
    );

    await expect(
      ownerQuery(
        `UPDATE skill SET active_version_id='${foreignCandidate.id}' WHERE id='${first.id}'`,
      ),
    ).rejects.toThrow(/same skill and workspace/i);
  });

  it("SKL-09 treats archived registry entries as terminal", async () => {
    const ctx = await asOwner(await createUser("skill-owner"));
    const skill = await refinery(ctx);
    const archived = await changeSkillStatus(ctx, skill.id, "ARCHIVED", {
      expectedVersion: 1,
      reason: "Contract family retired",
    });
    expect(archived.status).toBe("ARCHIVED");

    await expect(
      changeSkillStatus(ctx, skill.id, "ACTIVE", {
        expectedVersion: 2,
        reason: "Attempt to reopen",
      }),
    ).rejects.toMatchObject({ code: "SKILL_INVARIANT" });
  });
});
