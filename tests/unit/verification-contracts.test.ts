import { describe, expect, it } from "vitest";

import {
  computeVerificationStatus,
  validateReleaseInput,
  validateScenario,
  validateVerificationReport,
} from "@/modules/verification-governance/contracts";

const requirementId = "11111111-1111-4111-8111-111111111111";
const scenarioId = "22222222-2222-4222-8222-222222222222";
const artifactId = "33333333-3333-4333-8333-333333333333";

const validReport = {
  requirementCoverage: [
    {
      requirementId,
      result: "PASS" as const,
      method: "Trace the approved requirement to the retained evidence.",
      evidenceArtifactIds: [artifactId],
    },
  ],
  scenarioResults: [
    {
      scenarioId,
      result: "PASS" as const,
      severity: null,
      detail: "Expected behavior was observed.",
      evidenceArtifactIds: [artifactId],
    },
  ],
  technicalHealth: {
    build: "PASS" as const,
    typecheck: { errors: 0, warnings: 0 },
    lint: { errors: 0, warnings: 0 },
    unit: { passed: 12, failed: 0, skipped: 0 },
    integration: { passed: 8, failed: 0, skipped: 0 },
    e2e: { passed: 4, failed: 0, skipped: 0 },
    accessibilityViolations: 0,
    vulnerabilities: { critical: 0, high: 0, moderate: 0, low: 0 },
  },
  corruptionTests: [
    {
      code: "VG-CORRUPT-01",
      title: "Tampered evidence hash",
      method: "Mutate a retained digest and require deterministic rejection.",
      result: "PASS" as const,
      severity: "P0" as const,
      detail: "The corrupt digest was rejected.",
      evidenceArtifactIds: [artifactId],
    },
  ],
  overallStatus: "READY" as const,
  deferredItems: [],
};

describe("Verification Governance contracts", () => {
  it("accepts strict scenarios and a complete four-section Verify Report", () => {
    expect(
      validateScenario({
        code: "VG-01",
        title: "Approved requirement coverage",
        kind: "REQUIREMENT",
        method: "Compare against the approved contract.",
        expectedOutcome: "Every requirement has an explicit result.",
        required: true,
        requirementId,
      }),
    ).toMatchObject({ code: "VG-01", required: true });
    expect(validateVerificationReport(validReport)).toEqual(validReport);
  });

  it("rejects missing sections, duplicate coverage, and ambiguous severity", () => {
    const missing = { ...validReport } as Record<string, unknown>;
    Reflect.deleteProperty(missing, "technicalHealth");
    expect(() =>
      validateVerificationReport(missing as typeof validReport),
    ).toThrowError(
      expect.objectContaining({ code: "VERIFY_REPORT_INVALID" }),
    );
    expect(() =>
      validateVerificationReport({
        ...validReport,
        requirementCoverage: [
          validReport.requirementCoverage[0],
          validReport.requirementCoverage[0],
        ],
      }),
    ).toThrowError(expect.objectContaining({ code: "VERIFY_REPORT_INVALID" }));
    expect(() =>
      validateVerificationReport({
        ...validReport,
        scenarioResults: [
          {
            ...validReport.scenarioResults[0],
            result: "DEFERRED",
            severity: null,
          },
        ],
      }),
    ).toThrowError(expect.objectContaining({ code: "VERIFY_REPORT_INVALID" }));
  });

  it("computes READY, deferred, and fail-closed outcomes deterministically", () => {
    const parsed = validateVerificationReport(validReport);
    const requirements = [{ id: requirementId, required: true }];
    const scenarios = [{ id: scenarioId, required: true }];
    expect(computeVerificationStatus(parsed, requirements, scenarios, true)).toBe(
      "READY",
    );
    expect(
      computeVerificationStatus(
        {
          ...parsed,
          deferredItems: ["Moderate dependency update is scheduled."],
        },
        requirements,
        scenarios,
        true,
      ),
    ).toBe("READY_WITH_DEFERRED");
    expect(
      computeVerificationStatus(
        { ...parsed, corruptionTests: [] },
        requirements,
        scenarios,
        true,
      ),
    ).toBe("NOT_READY");
    expect(
      computeVerificationStatus(
        {
          ...parsed,
          technicalHealth: {
            ...parsed.technicalHealth,
            vulnerabilities: {
              ...parsed.technicalHealth.vulnerabilities,
              high: 1,
            },
          },
        },
        requirements,
        scenarios,
        false,
      ),
    ).toBe("NOT_READY");
  });

  it("requires exact coverage and unique release manifest inputs", () => {
    const parsed = validateVerificationReport(validReport);
    expect(() =>
      computeVerificationStatus(
        parsed,
        [{ id: "44444444-4444-4444-8444-444444444444", required: true }],
        [{ id: scenarioId, required: true }],
        false,
      ),
    ).toThrowError(expect.objectContaining({ code: "VERIFY_REPORT_INVALID" }));
    expect(() =>
      validateReleaseInput({
        verificationReportId: requirementId,
        visibility: "PUBLIC",
        claimVersionIds: [scenarioId, scenarioId],
        methods: ["Verify Report"],
        limitations: ["Bounded to retained evidence."],
      }),
    ).toThrowError(expect.objectContaining({ code: "VERIFY_REPORT_INVALID" }));
  });
});
