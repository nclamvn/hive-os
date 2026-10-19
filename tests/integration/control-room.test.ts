import { beforeEach, describe, expect, it } from "vitest";

import {
  acceptInvitation,
  createInvitation,
} from "@/modules/identity-workspace";
import { createMission } from "@/modules/mission-kernel";
import { registerSkill } from "@/modules/skill-runtime";
import { getControlRoomProjection } from "@/server/control-room";
import { exportAuditLedger } from "@/server/governed-exports";

import {
  asOwner,
  contextForMembership,
  createUser,
  truncateAll,
} from "./helpers";

beforeEach(async () => {
  await truncateAll();
});

describe("Control Room projection", () => {
  it("CR-I01 scopes every operational count to the authorized workspace", async () => {
    const ctxA = await asOwner(await createUser("control-a"));
    const ctxB = await asOwner(await createUser("control-b"));
    await createMission(ctxA, { title: "Workspace A mission" });
    await registerSkill(
      ctxA,
      {
        skillKey: "refinery",
        displayName: "Refinery",
        description: "Evidence ingestion",
      },
      {
        semanticVersion: "1.0.0",
        capabilities: ["web_evidence_ingestion"],
        inputSchema: { type: "object" },
        outputSchema: { type: "object" },
        requiredEvidence: ["source_snapshot"],
        failureStates: ["OPEN_INCOMPLETE"],
        verifierBinding: {
          kind: "DETERMINISTIC",
          verifierKey: "registry-hygiene",
        },
        resourceEstimate: {
          maxDurationSeconds: 900,
          maxMemoryMb: 1024,
        },
        assuranceCompatibility: ["RESEARCH"],
      },
    );

    const projectionA = await getControlRoomProjection(ctxA);
    const projectionB = await getControlRoomProjection(ctxB);

    expect(projectionA.counts.missions).toBe(1);
    expect(projectionA.commands).toEqual({
      authoringWrite: true,
      missionsCreate: true,
      researchRequest: true,
      truthWrite: true,
      verificationOperate: true,
    });
    expect(projectionA.recentMissions).toHaveLength(1);
    expect(projectionA.counts.skills).toBe(1);
    expect(projectionA.counts.activeSkills).toBe(1);
    expect(projectionA.counts.skillVersions).toBe(1);
    expect(projectionA.finderObjects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: "skill",
          code: "refinery",
          href: "skills",
        }),
      ]),
    );
    expect(projectionA.counts.verificationReports).toBe(0);
    expect(projectionA.counts.governedReleases).toBe(0);
    expect(projectionA.verification.recentReports).toEqual([]);
    expect(projectionB.counts.missions).toBe(0);
    expect(projectionB.recentMissions).toHaveLength(0);
    expect(projectionB.counts.skills).toBe(0);
    expect(projectionB.counts.skillVersions).toBe(0);
    expect(projectionB.counts.verificationReports).toBe(0);
    expect(projectionB.counts.governedReleases).toBe(0);
    expect(projectionB.finderObjects).toEqual([]);
  });

  it("CR-I02 audit lens fails closed for roles without audit.read", async () => {
    const owner = await asOwner(await createUser("control-owner"));
    const viewerUser = await createUser("control-viewer");
    const invitation = await createInvitation(owner, {
      email: viewerUser.email,
      role: "VIEWER",
    });
    await acceptInvitation(viewerUser, invitation.rawToken);
    const viewer = await contextForMembership(viewerUser, owner.workspace.id);

    const projection = await getControlRoomProjection(viewer);
    expect(projection.commands).toEqual({
      authoringWrite: false,
      missionsCreate: false,
      researchRequest: false,
      truthWrite: false,
      verificationOperate: false,
    });
    expect(projection.audit.allowed).toBe(false);
    expect(projection.audit.events).toEqual([]);
    await expect(exportAuditLedger(viewer)).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });

  it("CR-I03 exports the authorized audit ledger as a governed envelope", async () => {
    const owner = await asOwner(await createUser("control-export"));
    const ledger = await exportAuditLedger(owner);

    expect(ledger).toMatchObject({
      schema: "hive-os.governed-export.v1",
      exportType: "audit-ledger",
      workspace: { id: owner.workspace.id, slug: owner.workspace.slug },
    });
    expect(ledger.events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ eventType: "workspace.created" }),
      ]),
    );
  });
});
