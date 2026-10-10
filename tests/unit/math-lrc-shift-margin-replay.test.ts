import * as childProcess from "node:child_process";
import * as fs from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { buildLrcSharpShiftMarginReport, type ShiftMarginEvidence } from "@/modules/research-sandbox/math-lrc-shift-margin";
import { auditLrcSharpShiftMargin, LRC_SHIFT_MARGIN_PYTHON, LRC_SHIFT_MARGIN_PYTHON_SHA256, LRC_SHIFT_MARGIN_CORE_SHA256 } from "../../scripts/operations/lrc-shift-margin-audit";

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
const freshCore = (): ShiftMarginEvidence => {
  const report = buildLrcSharpShiftMarginReport(budget());
  expect(report.status).toBe("ACCEPTED");
  return JSON.parse(JSON.stringify(report.evidence)) as ShiftMarginEvidence;
};
const rehash = (value: ShiftMarginEvidence) => { value.reportDigest = sha256(canonicalJson(value.report)); return value; };
function mockProcess(evidence: unknown, metrics: Record<string, unknown> = {}) {
  return vi.spyOn(childProcess, "spawnSync").mockReturnValue({
    pid: 123, status: 0, signal: null, output: [], stderr: "",
    stdout: JSON.stringify({ status: "ACCEPTED", evidence, chargedOperations: 200, elapsedMs: 1, ...metrics }),
  } as ReturnType<typeof childProcess.spawnSync>);
}
function rawPython(input: string, source?: string) {
  return childProcess.spawnSync(LRC_SHIFT_MARGIN_PYTHON, ["-I", "-S", "-B", "-c", source ?? fs.readFileSync("scripts/research/lrc-shift-margin-replay.py", "utf8")], {
    input, encoding: "utf8", env: { NODE_ENV: "test" }, shell: false, timeout: 5000, maxBuffer: 32768,
  });
}

describe("TIP-072M isolated independent Fraction shift-margin replay", () => {
  it("actually runs fresh Python and matches the entire rebuilt Core report", () => {
    const run = auditLrcSharpShiftMargin(budget());
    expect(run.status).toBe("MATCH");
    expect(run.evidence).toEqual(freshCore());
    expect(run.evidence?.reportDigest).toBe("bc5e0c35ca92175882b6056edf4ddbe13fa169a085cced57edf256fbf88c92ed");
    expect(run.sourcePins).toEqual({ python: LRC_SHIFT_MARGIN_PYTHON_SHA256, core: LRC_SHIFT_MARGIN_CORE_SHA256 });
    expect(run.metrics.python?.chargedOperations).toBeGreaterThan(0);
    expect(run.metrics.core?.chargedOperations).toBeGreaterThan(0);
    expect(run.metrics.chargedOperations).toBeGreaterThan(run.metrics.python!.chargedOperations + run.metrics.core!.chargedOperations);
    expect(run.metrics.chargedOperations).toBeLessThanOrEqual(2000000);
    expect(run.metrics.elapsedMs).toBeLessThanOrEqual(5000);
    expect(run.executionAuthority).toBe(false);
    expect(run.agentLoop).toBe("NOT_RUN");
    expect(run.assurance).toContain("NOT_SIGNED_ATTESTATION");
  });
  it("independently derives exactly all132 cells and1753 attainable-mask tuples", () => {
    const run = rawPython(JSON.stringify({ version: "LRC_SHARP_SHIFT_MARGIN_REPLAY_V1", ...budget() }));
    expect(run.status).toBe(0);
    expect(run.stderr).toBe("");
    expect(Buffer.byteLength(run.stdout)).toBeLessThanOrEqual(32768);
    const parsed = JSON.parse(run.stdout);
    expect(parsed.status).toBe("ACCEPTED");
    expect(parsed.evidence).toEqual(freshCore());
    const classes = parsed.evidence.report.classes as ShiftMarginEvidence["report"]["classes"];
    expect(classes.map(item => item.tupleCount)).toEqual([16, 225, 216, 1296]);
    expect(classes.map(item => item.minimumGoodShifts)).toEqual([1, 1, 2, 1]);
    expect(classes.map(item => item.delta)).toEqual([["1", "6"], ["1", "5"], ["1", "10"], ["1", "10"]]);
    expect(classes.map(item => item.conditional.guaranteedMargin)).toEqual([["1", "13"], ["1", "13"], ["1", "12"], ["1", "11"]]);
    expect(classes.flatMap(item => item.partitions.flatMap(p => p.cells))).toHaveLength(132);
    for (const item of classes) {
      expect(item.sharpness.maximumMinimumDistance).toEqual(item.delta);
      for (const p of item.partitions) {
        expect(p.cells).toHaveLength(2 * item.d);
        const wrap = p.cells.at(-1)!;
        expect(wrap.kind).toBe("OPEN");
        expect(BigInt(wrap.right[0])).toBeGreaterThanOrEqual(BigInt(wrap.right[1]));
        expect(BigInt(wrap.representative[0])).toBeLessThan(BigInt(wrap.representative[1]));
        expect(p.cells.filter(c => c.kind === "BOUNDARY").every(c => c.badShiftIndices.length === item.r - 1)).toBe(true);
        expect(p.cells.filter(c => c.kind === "OPEN").every(c => c.badShiftIndices.length === item.r)).toBe(true);
      }
    }
    // A witness for the sharp distance is not a witness for minimum survivors.
    expect(classes[1].sharpness.minimumDistanceByShift.filter(x => Number(x[0]) / Number(x[1]) >= 1 / 5)).toHaveLength(3);
    expect(classes[1].minimumGoodShifts).toBe(1);
  });
  const corruptions: [string, (report: ShiftMarginEvidence) => void][] = [
    ["wrongendpoint", x => { x.report.classes[0].partitions[0].cells[0].right = ["1", "2"]; }],
    ["nonunit", x => { x.report.classes[0].partitions[0].unitResidue = 3; }],
    ["missingcell", x => { x.report.classes[0].partitions[0].cells.pop(); }],
    ["reorderedcells", x => { x.report.classes[0].partitions[0].cells.reverse(); }],
    ["wrongwrap", x => { x.report.classes[0].partitions[0].cells.at(-1)!.right = ["0", "1"]; }],
    ["equalitybad", x => { x.report.classes[0].partitions[0].cells[0].badShiftIndices.push(0); }],
    ["badsharpness", x => { x.report.classes[0].sharpness.maximumMinimumDistance = ["1", "5"]; }],
    ["badsharpdistances", x => { x.report.classes[0].sharpness.distances[0][0] = ["0", "1"]; }],
    ["redundantfamily", x => { x.report.classes[0].attainableMasks.push(x.report.classes[0].attainableMasks[0]); }],
    ["wrongtuplecount", x => { x.report.classes[0].tupleCount++; }],
    ["promotedminimum", x => { x.report.classes[0].minimumGoodShifts = 2; }],
    ["missingassumption", x => { delete (x.report.classes[0].conditional as Partial<ShiftMarginEvidence["report"]["classes"][number]["conditional"]>).lowerLrcAssumption; }],
    ["globalpromotion", x => { (x.report.scope as Record<string, unknown>).globalLrc = "PROVED"; }],
    ["agentpromotion", x => { (x.report.scope as Record<string, unknown>).agentLoop = "COMPLETE"; }],
    ["extraauthority", x => { (x.report.scope as Record<string, unknown>).admissionAuthority = true; }],
    ["componentoverflow", x => { x.report.classes[0].delta[0] = (BigInt(1) << BigInt(257)).toString(); }],
  ];
  it.each(corruptions)("refuses coherent rehashed semantic corruption: %s", (_, corrupt) => {
    const evidence = freshCore(); corrupt(evidence); rehash(evidence);
    const process = mockProcess(evidence);
    const run = auditLrcSharpShiftMargin(budget());
    expect(process).toHaveBeenCalledOnce();
    expect(run.status).toBe("MISMATCH");
    expect(run.evidence).toBeNull();
  });
  it("does not reset child time or operation limits after Core and IO", () => {
    const process = mockProcess(freshCore());
    const run = auditLrcSharpShiftMargin(budget());
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
    expect(auditLrcSharpShiftMargin({ ...budget(), remainingMs }).status).toBe("RESOURCE_REFUSED");
    expect(process).not.toHaveBeenCalled();
  });
  it.each([0, -1, 0.5, 2000000.5, 2000001, NaN, Infinity])("refuses invalid operation allowance %s before process", remainingOperations => {
    const process = vi.spyOn(childProcess, "spawnSync");
    expect(auditLrcSharpShiftMargin({ ...budget(), remainingOperations }).status).toBe("RESOURCE_REFUSED");
    expect(process).not.toHaveBeenCalled();
  });
  it("bounded operations are shared even before Core", () => {
    const process = vi.spyOn(childProcess, "spawnSync");
    const run = auditLrcSharpShiftMargin({ remainingMs: 5000, remainingOperations: 1 });
    expect(run.status).toBe("RESOURCE_REFUSED"); expect(run.evidence).toBeNull();
    expect(process).not.toHaveBeenCalled();
  });
  it("actual child cannot spend a fresh allowance after Core consumed the shared one", () => {
    const run = auditLrcSharpShiftMargin({ remainingMs: 5000, remainingOperations: 50000 });
    expect(run.status).toBe("RESOURCE_REFUSED"); expect(run.evidence).toBeNull();
    expect(run.metrics.core?.chargedOperations).toBeGreaterThan(0);
    expect(run.metrics.chargedOperations).toBeLessThanOrEqual(50000);
  });
  it("a process returning after the shared outer deadline cannot produce a positive", () => {
    const evidence = freshCore();
    vi.spyOn(performance, "now").mockReturnValue(100);
    mockProcess(evidence).mockImplementation(() => {
      vi.mocked(performance.now).mockReturnValue(5101);
      return { pid: 123, status: 0, signal: null, output: [], stderr: "", stdout: JSON.stringify({ status: "ACCEPTED", evidence, chargedOperations: 200, elapsedMs: 1 }) } as ReturnType<typeof childProcess.spawnSync>;
    });
    const run = auditLrcSharpShiftMargin(budget());
    expect(run.status).toBe("RESOURCE_REFUSED"); expect(run.evidence).toBeNull();
  });
  it.each(flags)("requires exactfalse flag %s", flag => {
    process.env[flag] = "true";
    const processSpy = vi.spyOn(childProcess, "spawnSync");
    expect(auditLrcSharpShiftMargin(budget()).status).toBe("FLAGS_REFUSED");
    expect(processSpy).not.toHaveBeenCalled();
  });
  it("undefined execution flag is also refused", () => {
    delete process.env.RESEARCH_WORKER_ENABLED;
    expect(auditLrcSharpShiftMargin(budget()).status).toBe("FLAGS_REFUSED");
  });
  it("does not invoke an untrusted budget getter", () => {
    let calls = 0;
    const hostile = { get remainingMs() { calls++; return 5000; }, remainingOperations: 2000000 };
    expect(auditLrcSharpShiftMargin(hostile).status).toBe("RESOURCE_REFUSED");
    expect(calls).toBe(0);
  });
  it("refuses pre-process source drift", () => {
    vi.spyOn(fs, "readFileSync").mockReturnValueOnce(Buffer.from("changed"));
    const process = vi.spyOn(childProcess, "spawnSync");
    expect(auditLrcSharpShiftMargin(budget()).status).toBe("SOURCE_REFUSED");
    expect(process).not.toHaveBeenCalled();
  });
  it("refuses source drift after exact process success", () => {
    mockProcess(freshCore());
    const python = fs.readFileSync("scripts/research/lrc-shift-margin-replay.py");
    const core = fs.readFileSync("src/modules/research-sandbox/math-lrc-shift-margin.ts");
    vi.spyOn(fs, "readFileSync").mockReturnValueOnce(python).mockReturnValueOnce(core).mockReturnValueOnce(Buffer.from("changed"));
    const run = auditLrcSharpShiftMargin(budget());
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
    const run = auditLrcSharpShiftMargin(budget());
    expect(run.status).not.toBe("MATCH"); expect(run.evidence).toBeNull();
  });
  it.each([{ chargedOperations: 2000001 }, { chargedOperations: 0 }, { chargedOperations: 0.5 }, { elapsedMs: 5001 }, { elapsedMs: -1 }])("refuses inconsistent processmetrics %j", metrics => {
    mockProcess(freshCore(), metrics);
    const run = auditLrcSharpShiftMargin(budget());
    expect(run.status).toBe("RESOURCE_REFUSED"); expect(run.evidence).toBeNull();
  });
  it.each([
    { remainingMs: 0, remainingOperations: 2000000 }, { remainingMs: 0.5, remainingOperations: 2000000 },
    { remainingMs: 5001, remainingOperations: 2000000 }, { remainingMs: 5000, remainingOperations: 0 },
    { remainingMs: 5000, remainingOperations: 0.5 }, { remainingMs: 5000, remainingOperations: 2000001 },
    { remainingMs: 5000, remainingOperations: 1 },
  ])("actual Python refuses resource control %j", input => {
    const run = rawPython(JSON.stringify({ version: "LRC_SHARP_SHIFT_MARGIN_REPLAY_V1", ...input }));
    expect(run.status).toBe(0);
    expect(JSON.parse(run.stdout)).toMatchObject({ status: "RESOURCE_REFUSED", evidence: null });
  });
  it.each(["{" + '"version":"LRC_SHARP_SHIFT_MARGIN_REPLAY_V1","version":"LRC_SHARP_SHIFT_MARGIN_REPLAY_V1","remainingMs":5000,"remainingOperations":2000000}',
    '{"version":"LRC_SHARP_SHIFT_MARGIN_REPLAY_V1","remainingMs":NaN,"remainingOperations":2000000}',
    '{"version":"WRONG","remainingMs":5000,"remainingOperations":2000000}',
    '{"version":"LRC_SHARP_SHIFT_MARGIN_REPLAY_V1","remainingMs":5000,"remainingOperations":2000000,"class":[7,2]}',
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
    const source = fs.readFileSync("scripts/research/lrc-shift-margin-replay.py", "utf8");
    expect(source).toContain("from fractions import Fraction");
    expect(source).not.toMatch(/import (os|pathlib|subprocess|socket|requests)|open\(|write_text|math-lrc-method-unit|math-lrc-shift-replay|math-lrc-shift-margin/);
    expect(source).toContain("itertools.product(masks, repeat=e)");
  });
});
