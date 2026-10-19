import * as childProcess from "node:child_process";
import * as fs from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { buildLrcCorrelatedTripleReport, validateLrcCorrelatedTripleReport, type CorrelatedTripleEvidence, type CorrelatedTripleFraction } from "@/modules/research-sandbox/math-lrc-correlated-triple";
import { auditLrcCorrelatedTriple, LRC_CORRELATED_TRIPLE_PYTHON, LRC_CORRELATED_TRIPLE_PYTHON_SHA256, LRC_CORRELATED_TRIPLE_CORE_SHA256 } from "../../scripts/operations/lrc-correlated-triple-audit";

vi.mock("node:child_process", async importOriginal => {
  const original = await importOriginal<typeof import("node:child_process")>();
  return { ...original, spawnSync: vi.fn(original.spawnSync) };
});
vi.mock("node:fs", async importOriginal => {
  const original = await importOriginal<typeof import("node:fs")>();
  return { ...original, readFileSync: vi.fn(original.readFileSync) };
});
const actualProcess = await vi.importActual<typeof import("node:child_process")>("node:child_process");
const actualFs = await vi.importActual<typeof import("node:fs")>("node:fs");

const flags = ["RESEARCH_WORKER_ENABLED", "MATH_PILOT_QUEUE_ENABLED", "LRC_CAMPAIGN_LOCAL_ENABLED", "RESEARCH_OPENAI_ENABLED", "RESEARCH_CODEX_LOCAL_ENABLED", "SANDBOX_DOCKER_ENABLED"];
const oldFlags = flags.map(flag => process.env[flag]);
const budget = () => ({ remainingMs: 5000, remainingOperations: 2000000 });
beforeEach(() => {
  vi.mocked(childProcess.spawnSync).mockReset().mockImplementation(actualProcess.spawnSync);
  vi.mocked(fs.readFileSync).mockReset().mockImplementation(actualFs.readFileSync);
  for (const flag of flags) process.env[flag] = "false";
});
afterEach(() => {
  vi.restoreAllMocks();
  flags.forEach((flag, index) => { if (oldFlags[index] === undefined) delete process.env[flag]; else process.env[flag] = oldFlags[index]; });
});
const freshCore = (): CorrelatedTripleEvidence => {
  const report = buildLrcCorrelatedTripleReport(budget());
  expect(report.status).toBe("ACCEPTED");
  return JSON.parse(JSON.stringify(report.evidence)) as CorrelatedTripleEvidence;
};
const rehash = (value: CorrelatedTripleEvidence) => { value.reportDigest = sha256(canonicalJson(value.report)); return value; };
function mockProcess(evidence: unknown, metrics: Record<string, unknown> = {}) {
  return vi.spyOn(childProcess, "spawnSync").mockReturnValue({
    pid: 123, status: 0, signal: null, output: [], stderr: "",
    stdout: JSON.stringify({ status: "ACCEPTED", evidence, chargedOperations: 200, elapsedMs: 1, ...metrics }),
  } as ReturnType<typeof childProcess.spawnSync>);
}
function rawPython(input: string, source?: string) {
  return childProcess.spawnSync(LRC_CORRELATED_TRIPLE_PYTHON, ["-I", "-S", "-B", "-c", source ?? fs.readFileSync("scripts/research/lrc-correlated-triple-replay.py", "utf8")], {
    input, encoding: "utf8", env: { NODE_ENV: "test" }, shell: false, timeout: 5000, maxBuffer: 32768,
  });
}
const ratio = (value: CorrelatedTripleFraction) => value.map(BigInt) as [bigint, bigint];
function compare(a: CorrelatedTripleFraction, b: CorrelatedTripleFraction) {
  const [an, ad] = ratio(a), [bn, bd] = ratio(b);
  return an * bd - bn * ad;
}
function distanceAt(speed: number, time: CorrelatedTripleFraction): CorrelatedTripleFraction {
  const [n, d] = ratio(time);
  const rem = (BigInt(speed) * n % d + d) % d;
  let a = rem < d - rem ? rem : d - rem, b = d;
  let g = a, h = b;
  while (h) { const next = g % h; g = h; h = next; }
  a /= g; b /= g;
  return [String(a), String(b)];
}

describe("TIP-072N isolated independent Fraction correlated pair/triple replay", () => {
  it("actually runs fresh Python and matches the entire rebuilt Core report", () => {
    const run = auditLrcCorrelatedTriple(budget());
    expect(run.status).toBe("MATCH");
    expect(run.evidence).toEqual(freshCore());
    expect(run.evidence?.reportDigest).toBe("6190bc46a5d21e202acbdb4cce24cafc5ebba17434d648aa652f2514ac7e8312");
    expect(run.sourcePins).toEqual({ python: LRC_CORRELATED_TRIPLE_PYTHON_SHA256, core: LRC_CORRELATED_TRIPLE_CORE_SHA256 });
    expect(run.metrics.python?.chargedOperations).toBeGreaterThan(0);
    expect(run.metrics.core?.chargedOperations).toBeGreaterThan(0);
    expect(run.metrics.chargedOperations).toBeGreaterThan(run.metrics.python!.chargedOperations + run.metrics.core!.chargedOperations);
    expect(run.metrics.chargedOperations).toBeLessThanOrEqual(2000000);
    expect(run.metrics.elapsedMs).toBeLessThanOrEqual(5000);
    expect(run.executionAuthority).toBe(false);
    expect(run.agentLoop).toBe("NOT_RUN");
    expect(run.assurance).toContain("NOT_SIGNED_ATTESTATION");
  });
  it("independently derives all19 cells,26 complete fixtures and all negative evidence", () => {
    const run = rawPython(JSON.stringify({ version: "LRC_CORRELATED_TRIPLE_REPLAY_V1", ...budget() }));
    expect(run.status).toBe(0);
    expect(run.stderr).toBe("");
    expect(Buffer.byteLength(run.stdout)).toBeLessThanOrEqual(32768);
    const parsed = JSON.parse(run.stdout);
    expect(parsed.status).toBe("ACCEPTED");
    expect(parsed.evidence).toEqual(freshCore());
    const report = parsed.evidence.report as CorrelatedTripleEvidence["report"];
    expect(report.partition.boundaries).toEqual([["0", "1"], ["1", "36"], ["1", "18"], ["1", "9"], ["5", "36"], ["7", "36"], ["2", "9"], ["5", "18"], ["11", "36"], ["1", "3"]]);
    expect(report.partition.cells).toHaveLength(19);
    expect(report.partition.cells.filter(c => c.kind === "BOUNDARY")).toHaveLength(10);
    expect(report.partition.cells.filter(c => c.kind === "OPEN")).toHaveLength(9);
    for (const cell of report.partition.cells) {
      expect(cell.goodShiftIndices).toContain(cell.normalizedShift);
      expect(cell.pairBadUnionIndices.length).toBeLessThanOrEqual(1);
      expect(cell.distances).toHaveLength(3);
      expect(cell.distances.every(row => row.length === 3)).toBe(true);
      if (cell.kind === "BOUNDARY") expect(cell.left).toEqual(cell.right);
    }
    expect(report.partition.cells.at(-1)?.left).toEqual(["1", "3"]);
    expect(report.sharpness.maximumMinimumDistance).toEqual(["1", "9"]);
    expect(report.sharpness.minimumDistanceByShift).toEqual([["1", "9"], ["1", "9"], ["1", "9"]]);
    expect(report.independentObstruction.minima).toEqual([["0", "1"], ["0", "1"], ["0", "1"]]);
    expect(report.positiveFixtures).toHaveLength(26);
    expect(report.positiveFixtures.filter(f => report.legend.fixtureKinds[f.kind] === "HARMONIC")).toHaveLength(20);
    expect(report.positiveFixtures.filter(f => report.legend.fixtureKinds[f.kind] === "ARBITRARY_THIRD")).toHaveLength(6);
    expect(report.positiveFixtures.flatMap(f => f.coordinateDistances)).toHaveLength(351);
    expect(report.positiveFixtures.filter(f => f.carry > 0)).toHaveLength(7);
    for (const f of report.positiveFixtures) {
      expect(f.speeds).toHaveLength(f.movingRunners);
      expect(f.totalRunners).toBe(f.movingRunners + 1);
      expect(new Set(f.speeds).size).toBe(f.movingRunners);
      expect(f.coordinateDistances).toEqual(f.speeds.map(speed => distanceAt(speed, f.time)));
      expect(f.coordinateDistances.every(value => compare(value, f.gamma) >= BigInt(0))).toBe(true);
      expect(f.minimumDistance).toEqual(f.gamma);
      expect(report.legend.lowerLrcAssumptions[f.lowerLrcAssumption]).toBe(`LRC(${f.movingRunners - 3})`);
      expect(f.physicalShift).toBe(((f.qInverse * (f.normalizedShift - f.carry)) % 3 + 3) % 3);
      if (f.kind === 1) expect(f.physicalShift).toBe(f.exceptionDistancesByShift.findIndex(row => row.every(x => compare(x, ["1", "9"]) >= BigInt(0))));
    }
    expect(report.oldClassNegatives.map(f => f.maximumFullMinimum)).toEqual([["1", "6"], ["1", "5"], ["1", "10"], ["1", "10"]]);
    expect(report.residueAlias).toMatchObject({ requiredPairPresent: false, residuePattern: [1, 2, 1], lowerMinimum: ["1", "5"], maximumFullMinimum: ["1", "15"], doesNotDisproveGlobalLrc: true });
  });
  const corruptions: [string, (report: CorrelatedTripleEvidence) => void][] = [
    ["wrongendpoint", x => { x.report.partition.cells[0].right = ["1", "2"]; }],
    ["nonunit", x => { x.report.positiveFixtures[0].q = 3; }],
    ["missingcell", x => { x.report.partition.cells.pop(); }],
    ["reorderedcells", x => { x.report.partition.cells.reverse(); }],
    ["missingfinalendpoint", x => { x.report.partition.boundaries.pop(); }],
    ["equalitybad", x => { x.report.partition.cells[6].pairBadUnionIndices.push(1); }],
    ["badsharpness", x => { x.report.sharpness.maximumMinimumDistance = ["1", "8"]; }],
    ["badsharpdistances", x => { x.report.sharpness.distances[0][0] = ["0", "1"]; }],
    ["missingpositivefixture", x => { x.report.positiveFixtures.pop(); }],
    ["missingoldnegative", x => { x.report.oldClassNegatives.pop(); }],
    ["wrongsegment", x => { x.report.proofSegments[0].normalizedShift = 0; }],
    ["wrongaffinerange", x => { x.report.proofSegments[0].coordinates[0].fractionalRange[1] = ["1", "1"]; }],
    ["wrongaffineintercept", x => { x.report.proofSegments[0].coordinates[0].intercept = ["2", "3"]; }],
    ["wrongfloor", x => { x.report.proofSegments[1].coordinates[2].floor++; }],
    ["wrongphysicalcarry", x => { x.report.positiveFixtures.find(f => f.movingRunners === 13 && f.q === 14)!.carry = 0; }],
    ["wrongphysicalshift", x => { x.report.positiveFixtures.find(f => f.movingRunners === 13 && f.q === 14)!.physicalShift = 2; }],
    ["unverifiedlowerwitness", x => { (x.report.positiveFixtures[0] as unknown as Record<string, unknown>).lowerWitnessVerified = false; }],
    ["missingassumption", x => { delete (x.report.positiveFixtures[0] as Partial<CorrelatedTripleEvidence["report"]["positiveFixtures"][number]>).lowerLrcAssumption; }],
    ["legendmeaningchanged", x => { (x.report.legend.lowerLrcAssumptions as string[])[0] = "NO_ASSUMPTION_REQUIRED"; }],
    ["arbitrarythirdwrongselector", x => { x.report.positiveFixtures[20].selectionRule = 0; }],
    ["residueonlypromotion", x => { (x.report.residueAlias as unknown as Record<string, unknown>).requiredPairPresent = true; }],
    ["residuealiasshiftpromotion", x => { x.report.residueAlias.maximumFullMinimum = ["1", "9"]; }],
    ["globalpromotion", x => { (x.report.scope as Record<string, unknown>).globalLrc = "PROVED"; }],
    ["agentpromotion", x => { (x.report.scope as Record<string, unknown>).agentLoop = "COMPLETE"; }],
    ["extraauthority", x => { (x.report.scope as Record<string, unknown>).admissionAuthority = true; }],
    ["componentoverflow", x => { x.report.threshold[0] = (BigInt(1) << BigInt(257)).toString(); }],
  ];
  it.each(corruptions)("refuses coherent rehashed semantic corruption: %s", (_, corrupt) => {
    const evidence = freshCore(); corrupt(evidence); rehash(evidence);
    const process = mockProcess(evidence);
    const run = auditLrcCorrelatedTriple(budget());
    expect(process).toHaveBeenCalledOnce();
    expect(run.status).toBe("MISMATCH");
    expect(run.evidence).toBeNull();
  });
  it("retains raw affine intercept and exact floor/range semantics on all9 coordinates", () => {
    const report = freshCore().report;
    for (const segment of report.proofSegments) for (const coordinate of segment.coordinates) {
      expect(compare(coordinate.intercept, [String(coordinate.multiplier * segment.normalizedShift), "3"])).toBe(BigInt(0));
      for (const [endpoint, expected] of [[segment.left, coordinate.fractionalRange[0]], [segment.right, coordinate.fractionalRange[1]]] as const) {
        const [n, d] = ratio(endpoint), [bn, bd] = ratio(coordinate.intercept);
        const value: CorrelatedTripleFraction = [String(BigInt(coordinate.slope) * n * bd + bn * d - BigInt(coordinate.floor) * d * bd), String(d * bd)];
        expect(compare(value, expected)).toBe(BigInt(0));
        expect(compare(value, ["1", "9"])).toBeGreaterThanOrEqual(BigInt(0));
        expect(compare(value, ["8", "9"])).toBeLessThanOrEqual(BigInt(0));
      }
    }
  });
  it("dropping carry genuinely fails on k13/q14 rather than merely changing an encoding", () => {
    const f = freshCore().report.positiveFixtures.find(f => f.movingRunners === 13 && f.q === 14)!;
    expect(f.carry).toBe(1); expect(f.qInverse).toBe(2); expect(f.normalizedShift).toBe(1);
    expect(f.physicalShift).toBe(0); expect(f.time).toEqual(["1", "33"]);
    const incorrectShift = f.qInverse * f.normalizedShift % 3;
    expect(incorrectShift).toBe(2);
    const incorrectTime: CorrelatedTripleFraction = ["23", "33"];
    expect(distanceAt(56, incorrectTime)).toEqual(["1", "33"]);
    expect(compare(distanceAt(56, incorrectTime), ["1", "9"])).toBeLessThan(BigInt(0));
  });
  it.each(["getter", "prototype", "sparse", "symbol", "hidden", "cycle"])("passive admission refuses hostile %s data", mode => {
    const evidence = freshCore(); let getters = 0;
    if (mode === "getter") Object.defineProperty(evidence, "reportDigest", { enumerable: true, get() { getters++; return "a".repeat(64); } });
    if (mode === "prototype") Object.setPrototypeOf(evidence, { promotion: true });
    if (mode === "sparse") delete (evidence.report.partition.cells as unknown[])[0];
    if (mode === "symbol") Object.defineProperty(evidence, Symbol("secret"), { value: 1 });
    if (mode === "hidden") Object.defineProperty(evidence, "hidden", { value: 1 });
    if (mode === "cycle") (evidence as unknown as Record<string, unknown>).cycle = evidence;
    const run = validateLrcCorrelatedTripleReport(evidence, budget());
    expect(run.status).not.toBe("ACCEPTED"); expect(run.evidence).toBeNull(); expect(getters).toBe(0);
  });
  it("does not reset child time or operation limits after Core and IO", () => {
    const process = mockProcess(freshCore());
    const run = auditLrcCorrelatedTriple(budget());
    expect(run.status).toBe("MATCH");
    const [binary, args, options] = process.mock.calls[0];
    expect(binary).toBe("/opt/homebrew/bin/python3");
    expect(args?.slice(0, 4)).toEqual(["-I", "-S", "-B", "-c"]);
    const opts = options as childProcess.SpawnSyncOptionsWithStringEncoding;
    expect(opts.env).toEqual({ NODE_ENV: "test" }); expect(opts.shell).toBe(false);
    expect(opts.maxBuffer).toBe(32768);
    const input = JSON.parse(String(opts.input));
    expect(input.remainingMs).toBeLessThan(5000);
    expect(input.remainingOperations).toBeLessThan(2000000 - run.metrics.core!.chargedOperations);
    expect(opts.timeout).toBe(input.remainingMs);
  });
  it.each([0, -1, 0.5, 5000.5, 5001, NaN, Infinity])("refuses invalid milliseconds %s before process", remainingMs => {
    const process = vi.spyOn(childProcess, "spawnSync");
    expect(auditLrcCorrelatedTriple({ ...budget(), remainingMs }).status).toBe("RESOURCE_REFUSED");
    expect(process).not.toHaveBeenCalled();
  });
  it.each([0, -1, 0.5, 2000000.5, 2000001, NaN, Infinity])("refuses invalid operation allowance %s before process", remainingOperations => {
    const process = vi.spyOn(childProcess, "spawnSync");
    expect(auditLrcCorrelatedTriple({ ...budget(), remainingOperations }).status).toBe("RESOURCE_REFUSED");
    expect(process).not.toHaveBeenCalled();
  });
  it("bounded operations are shared even before Core", () => {
    const process = vi.spyOn(childProcess, "spawnSync");
    const run = auditLrcCorrelatedTriple({ remainingMs: 5000, remainingOperations: 1 });
    expect(run.status).toBe("RESOURCE_REFUSED"); expect(run.evidence).toBeNull();
    expect(process).not.toHaveBeenCalled();
  });
  it("a successful actual child cannot escape the shared comparison and IO allowance", () => {
    const run = auditLrcCorrelatedTriple({ remainingMs: 5000, remainingOperations: 80000 });
    expect(run.status).toBe("RESOURCE_REFUSED"); expect(run.evidence).toBeNull();
    expect(run.metrics.core?.chargedOperations).toBeGreaterThan(0);
    expect(run.metrics.python?.chargedOperations).toBeGreaterThan(0);
    expect(run.metrics.chargedOperations).toBeLessThanOrEqual(80000);
  });
  it("a process returning after the shared outer deadline cannot produce a positive", () => {
    const evidence = freshCore();
    vi.spyOn(performance, "now").mockReturnValue(100);
    mockProcess(evidence).mockImplementation(() => {
      vi.mocked(performance.now).mockReturnValue(5101);
      return { pid: 123, status: 0, signal: null, output: [], stderr: "", stdout: JSON.stringify({ status: "ACCEPTED", evidence, chargedOperations: 200, elapsedMs: 1 }) } as ReturnType<typeof childProcess.spawnSync>;
    });
    const run = auditLrcCorrelatedTriple(budget());
    expect(run.status).toBe("RESOURCE_REFUSED"); expect(run.evidence).toBeNull();
  });
  it.each(flags)("requires exactfalse flag %s", flag => {
    process.env[flag] = "true";
    const processSpy = vi.spyOn(childProcess, "spawnSync");
    expect(auditLrcCorrelatedTriple(budget()).status).toBe("FLAGS_REFUSED");
    expect(processSpy).not.toHaveBeenCalled();
  });
  it("undefined execution flag is also refused", () => {
    delete process.env.RESEARCH_WORKER_ENABLED;
    expect(auditLrcCorrelatedTriple(budget()).status).toBe("FLAGS_REFUSED");
  });
  it("does not invoke an untrusted budget getter", () => {
    let calls = 0;
    const hostile = { get remainingMs() { calls++; return 5000; }, remainingOperations: 2000000 };
    expect(auditLrcCorrelatedTriple(hostile).status).toBe("RESOURCE_REFUSED");
    expect(calls).toBe(0);
  });
  it("rejects a nonenumerable budget instead of silently admitting hidden controls", () => {
    const controls = budget();
    Object.defineProperty(controls, "remainingMs", { enumerable: false, value: 5000 });
    expect(auditLrcCorrelatedTriple(controls).status).toBe("RESOURCE_REFUSED");
  });
  it("refuses an inherited serialization getter installed after the process boundary without invoking it", () => {
    const evidence = freshCore(); const stdout = JSON.stringify({ status: "ACCEPTED", evidence, chargedOperations: 200, elapsedMs: 1 });
    let invocations = 0;
    mockProcess(evidence).mockImplementation(() => {
      Object.defineProperty(Object.prototype, "toJSON", { configurable: true, get() { invocations++; return undefined; } });
      return { pid: 123, status: 0, signal: null, output: [], stderr: "", stdout } as ReturnType<typeof childProcess.spawnSync>;
    });
    let run: ReturnType<typeof auditLrcCorrelatedTriple>;
    try { run = auditLrcCorrelatedTriple(budget()); }
    finally { delete (Object.prototype as { toJSON?: unknown }).toJSON; }
    expect(run!.status).toBe("MISMATCH"); expect(run!.evidence).toBeNull(); expect(invocations).toBe(0);
  });
  it("refuses pre-process source drift", () => {
    vi.spyOn(fs, "readFileSync").mockReturnValueOnce(Buffer.from("changed"));
    const process = vi.spyOn(childProcess, "spawnSync");
    expect(auditLrcCorrelatedTriple(budget()).status).toBe("SOURCE_REFUSED");
    expect(process).not.toHaveBeenCalled();
  });
  it("refuses source drift after exact process success", () => {
    mockProcess(freshCore());
    const python = fs.readFileSync("scripts/research/lrc-correlated-triple-replay.py");
    const core = fs.readFileSync("src/modules/research-sandbox/math-lrc-correlated-triple.ts");
    vi.spyOn(fs, "readFileSync").mockReturnValueOnce(python).mockReturnValueOnce(core).mockReturnValueOnce(Buffer.from("changed"));
    const run = auditLrcCorrelatedTriple(budget());
    expect(run.status).toBe("SOURCE_REFUSED"); expect(run.evidence).toBeNull();
  });
  it.each(["exitfailure", "timeout", "signal", "stderr", "malformed", "oversize"])("no partial positive for process %s", mode => {
    const process = mockProcess(freshCore());
    const response = process.mock.results[0];
    expect(response).toBeUndefined();
    const fake = { pid: 123, status: 0, signal: null, output: [], stderr: "", stdout: "{}" } as unknown as ReturnType<typeof childProcess.spawnSync>;
    if (mode === "exitfailure") fake.status = 1;
    if (mode === "timeout") fake.error = Object.assign(new Error("timeout"), { code: "ETIMEDOUT" });
    if (mode === "signal") fake.signal = "SIGKILL";
    if (mode === "stderr") fake.stderr = "unexpected diagnostics";
    if (mode === "malformed") fake.stdout = "{";
    if (mode === "oversize") fake.stdout = " ".repeat(32769);
    process.mockReturnValue(fake);
    const run = auditLrcCorrelatedTriple(budget());
    expect(run.status).not.toBe("MATCH"); expect(run.evidence).toBeNull();
  });
  it.each([{ chargedOperations: 2000001 }, { chargedOperations: 0 }, { chargedOperations: 0.5 }, { elapsedMs: 5001 }, { elapsedMs: -1 }])("refuses inconsistent processmetrics %j", metrics => {
    mockProcess(freshCore(), metrics);
    const run = auditLrcCorrelatedTriple(budget());
    expect(run.status).toBe("RESOURCE_REFUSED"); expect(run.evidence).toBeNull();
  });
  it.each([
    { remainingMs: 0, remainingOperations: 2000000 }, { remainingMs: 0.5, remainingOperations: 2000000 },
    { remainingMs: 5001, remainingOperations: 2000000 }, { remainingMs: 5000, remainingOperations: 0 },
    { remainingMs: 5000, remainingOperations: 0.5 }, { remainingMs: 5000, remainingOperations: 2000001 },
    { remainingMs: 5000, remainingOperations: 1 },
  ])("actual Python refuses resource control %j", input => {
    const run = rawPython(JSON.stringify({ version: "LRC_CORRELATED_TRIPLE_REPLAY_V1", ...input }));
    expect(run.status).toBe(0);
    expect(JSON.parse(run.stdout)).toMatchObject({ status: "RESOURCE_REFUSED", evidence: null });
  });
  it.each(["{" + '"version":"LRC_CORRELATED_TRIPLE_REPLAY_V1","version":"LRC_CORRELATED_TRIPLE_REPLAY_V1","remainingMs":5000,"remainingOperations":2000000}',
    '{"version":"LRC_CORRELATED_TRIPLE_REPLAY_V1","remainingMs":NaN,"remainingOperations":2000000}',
    '{"version":"WRONG","remainingMs":5000,"remainingOperations":2000000}',
    '{"version":"LRC_CORRELATED_TRIPLE_REPLAY_V1","remainingMs":5000,"remainingOperations":2000000,"class":[7,2]}',
    "{", "[]"])("actual Python refuses invalid fixed request %#", input => {
    const run = rawPython(input);
    expect(run.status).toBe(0);
    expect(JSON.parse(run.stdout)).toMatchObject({ status: "REPORT_REFUSED", evidence: null });
  });
  it("actual Python refuses oversized stdin before parsing", () => {
    const run = rawPython(" ".repeat(32769));
    expect(JSON.parse(run.stdout)).toMatchObject({ status: "RESOURCE_REFUSED", evidence: null });
  });
  it("standalone checker imports no Core, old arithmetic, IO/network/provider library", () => {
    const source = fs.readFileSync("scripts/research/lrc-correlated-triple-replay.py", "utf8");
    expect(source).toContain("from fractions import Fraction");
    expect(source).not.toMatch(/import (os|pathlib|subprocess|socket|requests)|open\(|write_text|math-lrc-method-unit|math-lrc-shift-replay|math-lrc-correlated-triple/);
    expect(source).toContain("math.ceil(lower - sign * ETA)");
    expect(source).toContain("min(row[:2]) < ETA");
    expect(source).toContain("inverse * (h - carry) % 3");
  });
});
