import pg from "pg";
import { beforeEach, describe, expect, it } from "vitest";

import {
  acceptInvitation,
  createInvitation,
} from "@/modules/identity-workspace";
import {
  approveLifecycleDisposition,
  createLifecycleDisposition,
  executeLifecycleDisposition,
  placeLegalHold,
  releaseLegalHold,
} from "@/modules/lifecycle";
import {
  approveContract,
  addObligation,
  addRequirement,
  createMission,
  submitContract,
  transitionMission,
} from "@/modules/mission-kernel";
import {
  captureEvidenceFile,
  createEvidenceSource,
} from "@/modules/truth-kernel";
import { getDb } from "@/server/db";
import { getObjectStorage } from "@/server/storage";
import { withOrganizationTenant } from "@/server/tenant-context";

import {
  asOwner,
  contextForMembership,
  createUser,
  truncateAll,
} from "./helpers";

beforeEach(async () => {
  await truncateAll();
});

describe("TIP-023G governed lifecycle", () => {
  it("LIFE-01/02 blocks on hold and retains metadata after two-person disposition", async () => {
    const owner = await asOwner(await createUser("lifecycle-owner"));
    const adminUser = await createUser("lifecycle-admin");
    const invitation = await createInvitation(owner, {
      email: adminUser.email,
      role: "ADMIN",
    });
    await acceptInvitation(adminUser, invitation.rawToken);
    const admin = await contextForMembership(adminUser, owner.workspace.id);
    const mission = await createMission(owner, {
      title: "Retained evidence lifecycle",
      objective: "Govern evidence lifecycle",
      scope: "One retained object",
      successDefinition: "Disposition preserves metadata",
    });
    await addRequirement(owner, mission.currentContractId!, {
      code: "REQ-LIFE-001",
      title: "Preserve governed metadata",
      description: "Object disposal must retain its metadata",
      acceptanceCriteria: "Snapshot and audit rows remain queryable",
    });
    await addObligation(owner, mission.currentContractId!, {
      code: "OBL-LIFE-001",
      title: "Dispose through governance",
      description: "Use legal hold and independent approval",
      weight: 1,
      closureRule: "Approved lifecycle disposition executes",
    });
    await transitionMission(owner, mission.id, "INTAKE", { reason: "intake" });
    await transitionMission(owner, mission.id, "SCOPED", { reason: "scoped" });
    await submitContract(owner, mission.id);
    await approveContract(owner, mission.id);
    const source = await createEvidenceSource(owner, mission.id, {
      title: "Historic retained object",
      canonicalUri: "urn:hiveos:lifecycle:historic-object",
      sourceType: "TEST_RECORD",
      independenceKey: "lifecycle-test",
    });
    const snapshot = await captureEvidenceFile(owner, source.id, {
      bytes: new TextEncoder().encode("governed retained bytes"),
      filename: "retained.txt",
      mediaType: "text/plain",
      capturedAt: new Date("2000-01-01T00:00:00.000Z"),
    });
    const candidate = await createLifecycleDisposition(owner, {
      snapshotId: snapshot.id,
      reason: "Retention period elapsed",
      now: new Date("2026-08-04T00:00:00.000Z"),
    });
    expect(candidate.status).toBe("CANDIDATE");
    await expect(
      approveLifecycleDisposition(owner, {
        dispositionId: candidate.id,
        expectedVersion: candidate.version,
        reason: "Self approval must fail",
      }),
    ).rejects.toMatchObject({ code: "SEPARATION_OF_DUTIES" });
    const hold = await placeLegalHold(owner, {
      missionId: mission.id,
      reason: "Investigation requires preservation",
    });
    await expect(
      approveLifecycleDisposition(admin, {
        dispositionId: candidate.id,
        expectedVersion: candidate.version,
        reason: "Approve after policy review",
      }),
    ).rejects.toMatchObject({ code: "LEGAL_HOLD" });
    const released = await releaseLegalHold(owner, {
      holdId: hold.id,
      expectedVersion: hold.version,
      reason: "Investigation closed",
    });
    expect(released.status).toBe("RELEASED");
    const approved = await approveLifecycleDisposition(admin, {
      dispositionId: candidate.id,
      expectedVersion: candidate.version,
      reason: "Independent approval after hold release",
    });
    expect(approved.status).toBe("APPROVED");
    expect(await getObjectStorage().head(snapshot.storageReference!)).not.toBeNull();
    const executed = await executeLifecycleDisposition(admin, {
      dispositionId: candidate.id,
      expectedVersion: approved.version,
      reason: "Remove retained object body under approved policy",
    });
    expect(executed.status).toBe("EXECUTED");
    expect(await getObjectStorage().head(snapshot.storageReference!)).toBeNull();
    expect(
      await getDb().snapshot.findUnique({ where: { id: snapshot.id } }),
    ).toMatchObject({ id: snapshot.id, contentHash: snapshot.contentHash });
    expect(
      await getDb().auditEvent.count({
        where: {
          workspaceId: owner.workspace.id,
          eventType: "lifecycle.disposition_executed",
        },
      }),
    ).toBe(1);
  });

  it("LIFE-03 rejects direct governed root deletion", async () => {
    const owner = await asOwner(await createUser("delete-guard-owner"));
    const mission = await createMission(owner, { title: "Deletion guard" });
    const organization = await getDb().workspace.findUniqueOrThrow({
      where: { id: owner.workspace.id },
      select: { organizationId: true },
    });
    await expect(
      withOrganizationTenant(organization.organizationId, owner.user.id, (tx) =>
        tx.mission.delete({ where: { id: mission.id } }),
      ),
    ).rejects.toThrow(/governed root deletion requires lifecycle disposition/);
    expect(await getDb().mission.findUnique({ where: { id: mission.id } })).not.toBeNull();
  });

  it("EXP-04 forces tenant RLS on lifecycle and export records", async () => {
    const ownerA = await asOwner(await createUser("lifecycle-rls-a"));
    const ownerB = await asOwner(await createUser("lifecycle-rls-b"));
    await placeLegalHold(ownerA, { reason: "Tenant A hold" });
    await placeLegalHold(ownerB, { reason: "Tenant B hold" });
    const workspaces = await getDb().workspace.findMany({
      where: { id: { in: [ownerA.workspace.id, ownerB.workspace.id] } },
      select: { id: true, organizationId: true },
      take: 2,
    });
    const orgA = workspaces.find((item) => item.id === ownerA.workspace.id)!.organizationId;
    const orgB = workspaces.find((item) => item.id === ownerB.workspace.id)!.organizationId;
    const runtime = new pg.Client({ connectionString: process.env.DATABASE_URL });
    await runtime.connect();
    try {
      await runtime.query("BEGIN");
      await runtime.query("SELECT set_config('hiveos.organization_id', $1, true)", [orgA]);
      expect((await runtime.query("SELECT organization_id FROM legal_hold")).rows).toEqual([
        { organization_id: orgA },
      ]);
      expect(
        (await runtime.query("SELECT id FROM legal_hold WHERE organization_id = $1", [orgB])).rows,
      ).toEqual([]);
      await runtime.query("ROLLBACK");
    } finally {
      await runtime.end();
    }
  });
});
