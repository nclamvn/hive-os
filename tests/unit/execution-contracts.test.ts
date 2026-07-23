import { describe, expect, it } from "vitest";

import {
  canonicalJson,
  sha256,
  validateCompletionReport,
  validateManualRun,
} from "@/modules/execution-fabric/contracts";

const validReport = {
  result: "DONE" as const,
  summary: "Implementation completed",
  requirementCoverage: {
    implemented: 2,
    total: 2,
    missing: [],
    deferred: [],
  },
  scenarioResults: [
    {
      scenarioId: "EF-01",
      result: "PASS" as const,
      severity: null,
      evidenceArtifactIds: [],
    },
  ],
  technicalHealth: {
    build: "PASS" as const,
    typecheck: { errors: 0, warnings: 0 },
    lint: { errors: 0, warnings: 0 },
    unit: { passed: 1, failed: 0, skipped: 0 },
    integration: { passed: 1, failed: 0, skipped: 0 },
    e2e: { passed: 0, failed: 0, skipped: 1 },
    accessibilityViolations: 0,
    vulnerabilities: { critical: 0, high: 0, moderate: 0, low: 0 },
  },
  overallStatus: "READY" as const,
  deviations: [],
  resourceUsage: [{ metric: "duration_ms", quantity: 10, unit: "ms" }],
};

describe("Execution Fabric contracts", () => {
  it("EF-03 accepts the complete four-section report", () => {
    expect(validateCompletionReport(validReport)).toEqual(validReport);
  });

  it("EF-04 rejects missing sections rather than inferring values", () => {
    const incomplete: Record<string, unknown> = { ...validReport };
    Reflect.deleteProperty(incomplete, "technicalHealth");
    expect(() => validateCompletionReport(incomplete)).toThrowError(
      expect.objectContaining({ code: "COMPLETION_REPORT_INVALID" }),
    );
  });

  it("rejects contradictory status and duplicate usage keys", () => {
    expect(() =>
      validateCompletionReport({
        ...validReport,
        result: "BLOCKED",
        overallStatus: "READY",
      }),
    ).toThrow();
    expect(() =>
      validateCompletionReport({
        ...validReport,
        resourceUsage: [
          validReport.resourceUsage[0],
          validReport.resourceUsage[0],
        ],
      }),
    ).toThrow();
  });

  it("canonicalizes and hashes artifacts deterministically", () => {
    const a = canonicalJson({ z: 1, a: { y: true, x: false } });
    const b = canonicalJson({ a: { x: false, y: true }, z: 1 });
    expect(a).toBe(b);
    expect(sha256(a)).toMatch(/^[0-9a-f]{64}$/);
  });

  it("rejects obvious credential material in instructions", () => {
    expect(() =>
      validateManualRun({
        executionRole: "BUILDER",
        providerName: "manual",
        modelName: "external",
        instruction: "authorization: Bearer should-not-be-stored",
      }),
    ).toThrowError(expect.objectContaining({ code: "EXECUTION_INPUT_INVALID" }));
  });
});
