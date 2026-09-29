import { describe, expect, it } from "vitest";

import { surveyResidualInterval } from "@/modules/research-sandbox/math-certificates";
import { priorFiniteFindingFromTrace, type MathCycleEventPayload } from "@/modules/research-sandbox/math-cycle";
import { runIndependentResidualReplay, validateIndependentReplayRecord,
  validateIndependentReplayReport } from "@/modules/research-sandbox/math-independent-replay";

const plan = { kind: "ERDOS_STRAUS_RESIDUAL_A" as const,
  lowerExclusive: 10_050_000, upperInclusive: 10_052_000, maxA: 47 };

describe("independent executable residual replay", () => {
  it("runs fixed Python tools and matches interval plus every first-failure row", async () => {
    const evidence = surveyResidualInterval(plan);
    expect(evidence.firstFailure?.n).toBe(10_051_441);
    const report = await runIndependentResidualReplay(evidence);
    expect(report).toMatchObject({ status: "PASS", firstFailureN: 10_051_441,
      firstFailureRescueA: 59, primeCount: evidence.primeCount, failureCount: evidence.failureCount });
    expect(report.auditedRows).toHaveLength(12);
    expect(validateIndependentReplayReport(evidence, report)).toBe(true);
    expect(validateIndependentReplayReport(evidence, { ...report, failureCount: 0 })).toBe(false);
    expect(validateIndependentReplayRecord(evidence, { ...report, reportDigest: "0".repeat(64) })).toBe(false);
    const trace = [{ phase: "COMPUTED", round: 1, evidence },
      { phase: "INDEPENDENT_REPLAY", round: 1, report }] as MathCycleEventPayload[];
    const source = { cycleId: "11735863-a80f-496e-b4b9-592d5ebed830",
      sourceLedgerDigest: "a".repeat(64), trace };
    expect(priorFiniteFindingFromTrace(source)).toMatchObject({
      prime: 10_051_441, failedThroughA: 47, firstSuccessA: 59,
      replayDigest: report.reportDigest });
    expect(priorFiniteFindingFromTrace({ ...source, trace: [trace[0]!] })).toBeNull();
    expect(priorFiniteFindingFromTrace({ ...source, trace: [trace[0]!, {
      phase: "INDEPENDENT_REPLAY", round: 1, report: { ...report, reportDigest: "0".repeat(64) },
    }] as MathCycleEventPayload[] })).toBeNull();
  }, 30_000);

  it("passes without an exclusion tool when the interval has no bounded-family failure", async () => {
    const evidence = surveyResidualInterval({ ...plan, lowerExclusive: 840, upperInclusive: 2521, maxA: 59 });
    expect(evidence.firstFailure).toBeNull();
    const report = await runIndependentResidualReplay(evidence);
    expect(report).toMatchObject({ status: "PASS", exclusionScriptDigest: null, auditedRows: [] });
    expect(validateIndependentReplayReport(evidence, report)).toBe(true);
  }, 30_000);

  it("retains a valid FAIL report instead of allowing a mismatched survey to reach the solver", async () => {
    const evidence = surveyResidualInterval(plan);
    const forged = { ...evidence, primeCount: evidence.primeCount + 1 };
    const report = await runIndependentResidualReplay(forged);
    expect(report.status).toBe("FAIL");
    expect(report.mismatches).toContain("Interval prime or failure count differs");
    expect(validateIndependentReplayRecord(forged, report)).toBe(true);
    expect(validateIndependentReplayReport(forged, report)).toBe(false);
  }, 30_000);
});
