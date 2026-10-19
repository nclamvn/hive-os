import { beforeEach, describe, expect, it } from "vitest";

import { claimJobs, dispatchOutboxBatch } from "@/modules/command-runtime";
import {
  executeMissionDossierExportJob,
  DOSSIER_PART_MAX_BYTES,
  getMissionDossierExport,
  readMissionDossierManifest,
  readMissionDossierPart,
  requestMissionDossierExport,
} from "@/modules/dossier-export";
import {
  addObligation,
  addRequirement,
  approveContract,
  createMission,
  submitContract,
  transitionMission,
} from "@/modules/mission-kernel";
import { createEvidenceSource, captureSnapshot } from "@/modules/truth-kernel";
import { getDb } from "@/server/db";
import { getPilotMeasurementReport } from "@/server/pilot-measurement";
import { withOrganizationTenant } from "@/server/tenant-context";
import { runOrganizationWorkerCycle } from "@/server/workers/organization-cycle";

import { asOwner, createUser, truncateAll } from "./helpers";

beforeEach(async () => {
  await truncateAll();
});

async function pilotMission() {
  const ctx = await asOwner(await createUser("pilot-owner"));
  const mission = await createMission(ctx, {
    title: "Flight controller revision",
    objective: "Verify revision B",
    scope: "Flight controller only",
    successDefinition: "Governed dossier retained",
  });
  await addRequirement(ctx, mission.currentContractId!, {
    code: "REQ-FC-001",
    title: "Controller remains stable",
    description: "Verify the bounded controller change",
    acceptanceCriteria: "Bench scenario passes with retained evidence",
  });
  await addObligation(ctx, mission.currentContractId!, {
    code: "OBL-FC-001",
    title: "Retain verification dossier",
    description: "Complete the governed record",
    weight: 4,
    closureRule: "Authorized member closes after verification",
  });
  await transitionMission(ctx, mission.id, "INTAKE", { reason: "intake" });
  await transitionMission(ctx, mission.id, "SCOPED", { reason: "scoped" });
  await submitContract(ctx, mission.id);
  await approveContract(ctx, mission.id);
  const source = await createEvidenceSource(ctx, mission.id, {
    title: "Controller specification",
    canonicalUri: "urn:rtr:flight-controller:revision-b",
    sourceType: "SPECIFICATION",
    independenceKey: "rtr-engineering",
  });
  await captureSnapshot(ctx, source.id, {
    content: "Revision B must retain bounded stability.",
    capturedAt: new Date("2026-07-29T00:00:00.000Z"),
  });
  return { ctx, mission, source };
}

describe("TIP-022 governed pilot exports", () => {
  it("DOSSIER-I01 exports a stable complete mission envelope", async () => {
    const { ctx, mission } = await pilotMission();
    const first = await requestMissionDossierExport(ctx, {
      missionId: mission.id,
      idempotencyKey: "pilot-dossier-stable",
    });
    const duplicate = await requestMissionDossierExport(ctx, {
      missionId: mission.id,
      idempotencyKey: "pilot-dossier-stable",
    });
    expect(first).toEqual(duplicate);
    expect(first.status).toBe("SUCCEEDED");
    if (first.status !== "SUCCEEDED") throw new Error("request failed");
    const exportId = String(first.outcome.exportId);
    const organization = await getDb().workspace.findUniqueOrThrow({
      where: { id: ctx.workspace.id },
      select: { organizationId: true },
    });
    await dispatchOutboxBatch({
      organizationId: organization.organizationId,
      actorUserId: ctx.user.id,
      workerId: "pilot-dispatcher",
    });
    const [job] = await claimJobs({
      organizationId: organization.organizationId,
      actorUserId: ctx.user.id,
      workerId: "pilot-worker",
      jobTypes: ["export.mission.dossier"],
      leaseSeconds: 300,
    });
    expect(job).toBeDefined();
    await executeMissionDossierExportJob({
      organizationId: organization.organizationId,
      actorUserId: ctx.user.id,
      workerId: "pilot-worker",
      jobId: job!.id,
      expectedVersion: job!.version,
      correlationId: ctx.correlationId,
    });
    const completed = await getMissionDossierExport(ctx, exportId);
    expect(completed).toMatchObject({ status: "SUCCEEDED", manifestAvailable: true });
    const manifest = JSON.parse(
      Buffer.from(await readMissionDossierManifest(ctx, exportId)).toString("utf8"),
    ) as { schema: string; missionId: string; partCount: number };
    expect(manifest).toMatchObject({
      schema: "hive-os.mission-dossier-manifest.v2",
      missionId: mission.id,
      partCount: completed.partCount,
    });
    const firstPart = await readMissionDossierPart(ctx, exportId, 0);
    expect(Buffer.from(firstPart.body).toString("utf8")).toContain(mission.id);
    expect(
      await withOrganizationTenant(
        organization.organizationId,
        ctx.user.id,
        (tx) => tx.dossierExport.count({ where: { missionId: mission.id } }),
      ),
    ).toBe(1);
  });

  it("DOSSIER-I02 and PILOT-I02 fail closed across workspaces", async () => {
    const { mission } = await pilotMission();
    const foreignCtx = await asOwner(await createUser("pilot-foreign"));

    await expect(
      requestMissionDossierExport(foreignCtx, {
        missionId: mission.id,
        idempotencyKey: "foreign-dossier",
      }),
    ).rejects.toMatchObject({ code: "SCOPED_AUTHORIZATION_DENIED" });
    await expect(
      getPilotMeasurementReport(foreignCtx, mission.id),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("EXP-02/03 and OBS-01 chunk a large row and publish the manifest last", async () => {
    const { ctx, mission, source } = await pilotMission();
    await captureSnapshot(ctx, source.id, {
      content: "x".repeat(DOSSIER_PART_MAX_BYTES + 16_384),
      capturedAt: new Date("2026-07-30T00:00:00.000Z"),
    });
    const requested = await requestMissionDossierExport(ctx, {
      missionId: mission.id,
      idempotencyKey: "pilot-dossier-large-row",
    });
    if (requested.status !== "SUCCEEDED") throw new Error("request failed");
    const exportId = String(requested.outcome.exportId);
    expect(await getMissionDossierExport(ctx, exportId)).toMatchObject({
      status: "READY",
      manifestAvailable: false,
    });
    await expect(
      readMissionDossierManifest(ctx, exportId),
    ).rejects.toMatchObject({ code: "INVALID_TRANSITION" });
    const organization = await getDb().workspace.findUniqueOrThrow({
      where: { id: ctx.workspace.id },
      select: { organizationId: true },
    });
    const cycle = await runOrganizationWorkerCycle({
      organizationId: organization.organizationId,
      actorUserId: ctx.user.id,
      workerId: "bounded-export-worker",
      correlationId: ctx.correlationId,
      claimFirst: 5,
    });
    expect(cycle).toMatchObject({ succeeded: 1, failed: 0 });
    const completed = await getMissionDossierExport(ctx, exportId);
    expect(completed).toMatchObject({ status: "SUCCEEDED", manifestAvailable: true });
    expect(completed.partCount).toBeGreaterThan(1);
    const sizes = await withOrganizationTenant(
      organization.organizationId,
      ctx.user.id,
      (tx) =>
        tx.dossierExportPart.findMany({
          where: { exportId },
          select: { sizeBytes: true },
          orderBy: { sequence: "asc" },
          take: 10_000,
        }),
    );
    expect(sizes.every((part) => part.sizeBytes <= DOSSIER_PART_MAX_BYTES)).toBe(true);
  });

  it("EXP-04 fails closed when a related source changes after capture", async () => {
    const { ctx, mission, source } = await pilotMission();
    const requested = await requestMissionDossierExport(ctx, {
      missionId: mission.id,
      idempotencyKey: "pilot-dossier-consistency-fence",
    });
    if (requested.status !== "SUCCEEDED") throw new Error("request failed");
    const exportId = String(requested.outcome.exportId);

    await captureSnapshot(ctx, source.id, {
      content: "A post-boundary evidence mutation must invalidate the export.",
      capturedAt: new Date("2026-07-31T00:00:00.000Z"),
    });
    const organization = await getDb().workspace.findUniqueOrThrow({
      where: { id: ctx.workspace.id },
      select: { organizationId: true },
    });
    const cycle = await runOrganizationWorkerCycle({
      organizationId: organization.organizationId,
      actorUserId: ctx.user.id,
      workerId: "consistency-fence-worker",
      correlationId: ctx.correlationId,
    });

    expect(cycle).toMatchObject({ succeeded: 0, failed: 1 });
    expect(await getMissionDossierExport(ctx, exportId)).toMatchObject({
      status: "FAILED",
      failureCode: "SOURCE_CHANGED",
      manifestAvailable: false,
    });
  });

  it("PILOT-I01 reports only derivable measures and honest unavailable fields", async () => {
    const { ctx, mission } = await pilotMission();
    const report = await getPilotMeasurementReport(ctx, mission.id);

    expect(report.schema).toBe("hive-os.pilot-measurement.v1");
    expect(report.phaseDurations.creationToContractApproval.status).toBe(
      "AVAILABLE",
    );
    expect(report.phaseDurations.approvalToBuilding.status).toBe("UNAVAILABLE");
    expect(report.coverage.requirements).toMatchObject({
      total: 1,
      withEvidence: 0,
      passedVerification: 0,
    });
    expect(report.unavailableMeasurements.map((item) => item.metric)).toEqual(
      expect.arrayContaining([
        "evidenceRetrievalTime",
        "reworkHours",
        "defectsCaughtBeforeProduction",
      ]),
    );
    expect(report.governedThroughputEligibility.eligible).toBe(false);
  });
});
