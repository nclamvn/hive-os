import { beforeEach, describe, expect, it } from "vitest";

import { canonicalJson, sha256 } from "@/modules/execution-fabric";
import {
  addObligation,
  addRequirement,
  approveContract,
  createMission,
  submitContract,
  transitionMission,
} from "@/modules/mission-kernel";
import { createEvidenceSource, captureSnapshot } from "@/modules/truth-kernel";
import { exportMissionDossier } from "@/server/governed-exports";
import { getPilotMeasurementReport } from "@/server/pilot-measurement";

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
  return { ctx, mission };
}

describe("TIP-022 governed pilot exports", () => {
  it("DOSSIER-I01 exports a stable complete mission envelope", async () => {
    const { ctx, mission } = await pilotMission();
    const first = await exportMissionDossier(ctx, mission.id);
    const second = await exportMissionDossier(ctx, mission.id);

    expect(first.schema).toBe("hive-os.mission-dossier.v1");
    expect(first.dossier.mission.id).toBe(mission.id);
    expect(first.dossier.mission.contracts).toHaveLength(1);
    expect(first.dossier.mission.evidenceSources[0].snapshots).toHaveLength(1);
    expect(first.dossier.auditEvents.length).toBeGreaterThan(0);
    expect(first.integrity.contentHash).toBe(second.integrity.contentHash);
    expect(first.integrity.contentHash).toBe(
      sha256(canonicalJson(first.dossier)),
    );
  });

  it("DOSSIER-I02 and PILOT-I02 fail closed across workspaces", async () => {
    const { mission } = await pilotMission();
    const foreignCtx = await asOwner(await createUser("pilot-foreign"));

    await expect(
      exportMissionDossier(foreignCtx, mission.id),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
    await expect(
      getPilotMeasurementReport(foreignCtx, mission.id),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
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
