import { describe, expect, it } from "vitest";

import { validateTip023hReport } from "../../scripts/scale/report-contract.mjs";

const passingReport = {
  schema: "hive-os.enterprise-scale-certification.v1",
  classification: "LOCAL_CERTIFICATION_NON_SLO",
  parameters: { requestedSoakSeconds: 3_600 },
  gates: Object.fromEntries(
    ["SCALE-01", "CONC-01", "TEN-01", "WORK-01", "SOAK-01", "REC-01"].map(
      (gate) => [gate, "PASS"],
    ),
  ),
  observations: {
    soak: {
      actualDurationSeconds: 3_600,
      continuity: {
        maxIntervalGapSeconds: 10,
        expectedMinimumSamples: 324,
        retainedSamples: 360,
      },
    },
  },
  failures: [],
  overallStatus: "PASS",
};

describe("TIP-023H certification evidence contract", () => {
  it("accepts a complete non-SLO certification record", () => {
    expect(validateTip023hReport(passingReport)).toBe(passingReport);
  });

  it("rejects a shortened soak presented as certification", () => {
    expect(() =>
      validateTip023hReport({
        ...passingReport,
        observations: { soak: { actualDurationSeconds: 3_599 } },
      }),
    ).toThrow(/less than 3,600/);
  });

  it("requires severity and disposition on every failure", () => {
    expect(() =>
      validateTip023hReport(
        { ...passingReport, failures: [{ gate: "TEN-01", message: "leak" }] },
        { requireCertification: false },
      ),
    ).toThrow(/severity/);
  });

  it("rejects a wall-clock run interrupted by a long sample gap", () => {
    expect(() =>
      validateTip023hReport({
        ...passingReport,
        observations: {
          soak: {
            actualDurationSeconds: 3_676,
            continuity: {
              maxIntervalGapSeconds: 1_006,
              expectedMinimumSamples: 324,
              retainedSamples: 263,
            },
          },
        },
      }),
    ).toThrow(/continuity gap/);
  });
});
