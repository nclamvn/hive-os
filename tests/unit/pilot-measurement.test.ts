import { describe, expect, it, vi } from "vitest";

vi.hoisted(() => {
  process.env.DATABASE_URL =
    "postgresql://hiveos_app:hiveos_app@localhost:5433/hiveos_test";
  process.env.BETTER_AUTH_SECRET = "unit-test-auth-secret";
  process.env.AUTH_RATE_LIMIT_ENABLED = "false";
});

import { derivePilotMeasurements } from "@/server/pilot-measurement";

function fixture(): Parameters<typeof derivePilotMeasurements>[0] {
  const createdAt = new Date("2026-07-01T00:00:00.000Z");
  return {
    mission: {
      id: "mission-1",
      referenceCode: "MSN-0001",
      title: "Flight controller change",
      status: "RELEASED",
      createdAt,
      approvedContract: {
        id: "contract-1",
        approvedAt: new Date("2026-07-01T01:00:00.000Z"),
        requirements: [{ id: "req-1" }],
      },
      decisions: [
        {
          materiality: "MATERIAL",
          status: "APPROVED",
          resolution: "Adopt controller revision B",
          decidedByMembershipId: "member-1",
          decidedAt: new Date("2026-07-01T02:00:00.000Z"),
        },
      ],
      evidenceSources: [{ snapshots: [{ id: "snapshot-1" }] }],
      claims: [
        {
          versions: [{ id: "claim-version-1", evidence: [{ id: "link-1" }] }],
          disputes: [],
        },
      ],
      skillRuns: [{ agentRuns: [{ id: "run-1" }, { id: "run-2" }] }],
      executionDeviations: [{ status: "RESOLVED" }],
      verificationRuns: [
        {
          requirementCoverage: [
            {
              requirementId: "req-1",
              result: "PASS",
              evidenceArtifactIds: ["artifact-1"],
            },
          ],
          scenarioResults: [{ result: "PASS" }],
        },
      ],
      verificationReports: [{ overallStatus: "READY" }],
      governanceSignoffs: [{ decision: "APPROVED" }],
      governedReleases: [
        {
          approvedAt: new Date("2026-07-01T05:00:00.000Z"),
          manifest: {
            claimVersions: [{ claimVersionId: "claim-version-1" }],
          },
        },
      ],
    },
    transitions: [
      {
        createdAt: new Date("2026-07-01T03:00:00.000Z"),
        payload: { to: "BUILDING" },
      },
      {
        createdAt: new Date("2026-07-01T04:00:00.000Z"),
        payload: { to: "VERIFYING" },
      },
      {
        createdAt: new Date("2026-07-01T05:00:00.000Z"),
        payload: { to: "RELEASED" },
      },
    ],
    provenanceTargets: ["claim-version-1"],
  };
}

describe("TIP-022 pilot measurement", () => {
  it("PILOT-U01 derives complete governed throughput from retained records", () => {
    const report = derivePilotMeasurements(fixture());
    expect(report.phaseDurations.approvalToBuilding).toMatchObject({
      status: "AVAILABLE",
      value: 7_200_000,
    });
    expect(report.coverage.requirements).toMatchObject({
      total: 1,
      withEvidence: 1,
      passedVerification: 1,
      evidencePercent: 100,
      verifiedPercent: 100,
    });
    expect(report.reworkSignals).toMatchObject({
      totalAgentRuns: 2,
      retries: 1,
      deviations: 1,
    });
    expect(report.governedThroughputEligibility.eligible).toBe(true);
  });

  it("PILOT-U02 reports missing boundaries and denominators as unavailable", () => {
    const input = fixture();
    input.mission.status = "APPROVED";
    input.mission.approvedContract = null;
    input.mission.decisions = [];
    input.mission.governedReleases = [];
    input.transitions = [];
    const report = derivePilotMeasurements(input);
    expect(report.phaseDurations.approvalToBuilding.status).toBe("UNAVAILABLE");
    expect(report.coverage.requirements.verifiedPercent).toBeNull();
    expect(report.coverage.releaseClaimProvenance.percent).toBeNull();
    expect(report.governedThroughputEligibility.eligible).toBe(false);
    expect(report.unavailableMeasurements).toHaveLength(4);
  });
});
