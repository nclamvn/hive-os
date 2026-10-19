import { describe, expect, it } from "vitest";
import { LRC_MATCHED_FIXTURES, prepareMatchedMathBenchmarkManifest, prepareMatchedMathBenchmarkReport,
  validateMatchedMathBenchmarkReport } from "@/modules/research-sandbox/math-lrc-matched-benchmark";

const exposure = { unitDigest: "a".repeat(64), sourceDataDigest: "b".repeat(64), sourceLocator: "OFFLINE_TEST_REGISTRY_NOT_LIVE_SOURCE",
  checkerVersion: "OFFLINE_TEST_CHECKER", checkerSourceSha256: "c".repeat(64), schemaDigest: "d".repeat(64) };
const fixture = LRC_MATCHED_FIXTURES[0].id;
describe("matched source-visible benchmark preparation — no model experiment", () => {
  it.each(LRC_MATCHED_FIXTURES)("$id prepares equal exposure, tools, budgets and three-role allowance", value => {
    const manifest = prepareMatchedMathBenchmarkManifest(value.id, exposure);
    expect(manifest.arms[0].common).toEqual(manifest.arms[1].common);
    expect(manifest.arms[0].common).not.toBe(manifest.arms[1].common);
    expect(manifest.arms[0].common.roleAllowance).toEqual(["SOLVER", "ADVERSARY", "CRITIC"]);
    expect(manifest.laneOrder).toEqual(["SOLVER", "ADVERSARY", "HOST_FINITE_CHECK", "CRITIC"]);
    expect(manifest.criticAdversaryProse).toBe(false); expect(manifest.criticFiniteSummaryBytes).toBe(1024);
    expect(manifest.executionAuthority).toBe("NOT_AUTHORIZED");
    const report = prepareMatchedMathBenchmarkReport(manifest);
    expect(validateMatchedMathBenchmarkReport(report, manifest, exposure)).toBe(true);
    expect(report.actualUsage).toBeNull(); expect(report.actualCalls).toBeNull(); expect(report.actualCheckerResults).toBeNull();
    expect(report.heldOut).toBe(false); expect(report.efficacyClaim).toBe("NONE");
  });
  it.each(["fixture", "exposure", "quantifiersConvention", "sourceVisible", "heldOut", "requestedProvider", "requestedModel", "roleAllowance",
    "maxCalls", "retries", "network", "tools", "formalKernel", "caps"])("refuses matched-field %s drift", field => {
    const manifest = prepareMatchedMathBenchmarkManifest(fixture, exposure); const report = prepareMatchedMathBenchmarkReport(manifest);
    const common = manifest.arms[1].common as unknown as Record<string, unknown>; common[field] = "DRIFT";
    expect(validateMatchedMathBenchmarkReport(report, manifest, exposure)).toBe(false);
  });
  it.each(["actualCalls", "actualElapsedMs", "actualUsage", "roleContexts", "actualCheckerResults", "admittedMathematicalOutcomes"])("refuses fabricated zero or data for NOT_RUN %s", field => {
    const manifest = prepareMatchedMathBenchmarkManifest(fixture, exposure);
    expect(validateMatchedMathBenchmarkReport({ ...prepareMatchedMathBenchmarkReport(manifest), [field]: 0 }, manifest, exposure)).toBe(false);
  });
  it("refuses hash-only manifest acceptance and unknown fields", () => {
    const manifest = prepareMatchedMathBenchmarkManifest(fixture, exposure); const report = prepareMatchedMathBenchmarkReport(manifest);
    expect(validateMatchedMathBenchmarkReport({ ...report, unknown: true }, manifest, exposure)).toBe(false);
    expect(validateMatchedMathBenchmarkReport(report, { ...manifest, manifestDigest: "e".repeat(64) }, exposure)).toBe(false);
    expect(validateMatchedMathBenchmarkReport(report, manifest, { ...exposure, sourceDataDigest: "e".repeat(64) })).toBe(false);
    expect(() => prepareMatchedMathBenchmarkManifest(fixture, { ...exposure, schemaDigest: "PENDING" })).toThrow("REFUSED");
  });
  it("does not expose mutable fixed fixtures or caps", () => {
    expect(() => { (LRC_MATCHED_FIXTURES[0] as unknown as { statement: string }).statement = "MUTATED"; }).toThrow();
    const manifest = prepareMatchedMathBenchmarkManifest(fixture, exposure);
    manifest.arms[0].common.exposure.sourceDataDigest = "e".repeat(64); expect(exposure.sourceDataDigest).toBe("b".repeat(64));
  });
  it("discovery has no answer oracle/preset success and requires exact-domain admission", () => {
    const item = LRC_MATCHED_FIXTURES[3]; expect(item.oracle).toBe("NONE_NOVELTY_PENDING");
    expect(item.input.state).toContain("NOT_DISPATCHABLE");
  });
});

describe("independent exact speed/time linkage of the strengthened-count control", () => {
  const speeds = LRC_MATCHED_FIXTURES[2].input.linkage.speeds;
  const distanceNumerator = (speed: number, shift: number) => {
    const residue = (BigInt(speed) * (BigInt(1) + BigInt(10) * BigInt(shift))) % BigInt(30);
    return residue <= BigInt(15) ? residue : BigInt(30) - residue;
  };
  it("retains fourteen distinct positive speeds, exact two unit residues/phases and no speed30", () => {
    expect(speeds).toHaveLength(14); expect(new Set(speeds).size).toBe(14); expect(speeds.every(v => v > 0)).toBe(true);
    expect(speeds).not.toContain(30); const exceptions = speeds.filter(v => v % 3 !== 0);
    expect(exceptions).toEqual([1, 10]); expect(exceptions.map(v => v % 3)).toEqual([1, 1]);
    expect(exceptions.map(v => v % 30)).toEqual([1, 10]);
  });
  it("all twelve divisible runners stay at distance >=1/10 at every shift", () => {
    for (const v of speeds.filter(v => v % 3 === 0)) for (const j of [0, 1, 2]) {
      expect(distanceNumerator(v, j)).toBeGreaterThanOrEqual(BigInt(3));
      expect(distanceNumerator(v, j)).toBe(distanceNumerator(v, 0));
    }
  });
  it("bad sets are {0} and {2}; exactly shift1 is good, refuting only the strengthened >=2 predicate", () => {
    const bad = (v: number) => [0, 1, 2].filter(j => distanceNumerator(v, j) * BigInt(15) < BigInt(30));
    expect(bad(1)).toEqual([0]); expect(bad(10)).toEqual([2]);
    const good = [0, 1, 2].filter(j => speeds.every(v => distanceNumerator(v, j) * BigInt(15) >= BigInt(30)));
    expect(good).toEqual([1]); expect(good.length).toBeGreaterThanOrEqual(3 - 2 * Math.ceil(6 / 15));
    expect(good.length).toBeLessThan(2);
  });
});
