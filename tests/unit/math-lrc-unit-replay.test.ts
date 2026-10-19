import { execFileSync } from "node:child_process";
import * as processes from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import * as files from "node:fs/promises";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { LRC_COVER_REPLAY_SCRIPT_SHA256 } from "@/modules/research-sandbox/math-lrc-cover-replay";
import { LRC_FRONTIER_REPLAY_SCRIPT_SHA256 } from "@/modules/research-sandbox/math-lrc-frontier-replay";
import { LRC_UNIT_ACTION_SOURCES, deriveLrcUnitActionPlan, lrcUnitActionPlanDigest,
  verifyLrcUnitActionPlan, lrcUnitActionOutputBytes, mergeLrcUnitIntervals, complementLrcUnitIntervals,
  transportLrcUnitPrefix, lrcUnitPrefixInterval, type LrcUnitActionPlan, type LrcUnitInterval }
  from "@/modules/research-sandbox/math-lrc-unit-action";
import { LRC_UNIT_REPLAY_SCRIPT_SHA256, LRC_UNIT_COMPOSED_PROGRAM_SHA256, runLrcUnitActionEvidence,
  validateRetainedLrcUnitActionEvidence, type LrcUnitActionEvidence }
  from "@/modules/research-sandbox/math-lrc-unit-replay";

vi.mock("node:child_process", async (original) => {
  const actual = await original<typeof import("node:child_process")>();
  return { ...actual, execFile: vi.fn(actual.execFile) };
});
vi.mock("node:fs/promises", async (original) => {
  const actual = await original<typeof import("node:fs/promises")>();
  return { ...actual, readFile: vi.fn(actual.readFile) };
});
const hash = (s: string) => createHash("sha256").update(s).digest("hex");
const base = JSON.parse(readFileSync(LRC_UNIT_ACTION_SOURCES.basePath, "utf8"));
const frontier = JSON.parse(readFileSync(LRC_UNIT_ACTION_SOURCES.frontierPath, "utf8"));
const coverSource = readFileSync("scripts/operations/replay-lrc-cover-bound.py", "utf8");
const frontierSource = readFileSync("scripts/operations/replay-lrc-frontier.py", "utf8");
const driver = readFileSync("scripts/operations/replay-lrc-unit-action.py", "utf8");
const program = `import hashlib as _lrc_hashlib\n_LRC_COVER_LITERAL = ${JSON.stringify(coverSource)}\n` +
  `_LRC_FRONTIER_LITERAL = ${JSON.stringify(frontierSource)}\n` +
  `if _lrc_hashlib.sha256(_LRC_COVER_LITERAL.encode()).hexdigest() != "${LRC_COVER_REPLAY_SCRIPT_SHA256}": raise ValueError("COVER_SOURCE_PIN")\n` +
  `if _lrc_hashlib.sha256(_LRC_FRONTIER_LITERAL.encode()).hexdigest() != "${LRC_FRONTIER_REPLAY_SCRIPT_SHA256}": raise ValueError("FRONTIER_SOURCE_PIN")\n` +
  `_LRC_COVER_NAMESPACE = {"__name__": "_lrc_cover_checked"}\n` +
  `exec(compile(_LRC_COVER_LITERAL, "<pinned048>", "exec"), _LRC_COVER_NAMESPACE)\n` +
  `_LRC_FRONTIER_NAMESPACE = {"__name__": "_lrc_frontier_checked", "_LRC_COVER_CHECK": _LRC_COVER_NAMESPACE["check"], "_LRC_COVER_SOURCE_SHA": "${LRC_COVER_REPLAY_SCRIPT_SHA256}"}\n` +
  `exec(compile(_LRC_FRONTIER_LITERAL, "<pinned049>", "exec"), _LRC_FRONTIER_NAMESPACE)\n` +
  `_LRC_FRONTIER_CHECK = _LRC_FRONTIER_NAMESPACE["check"]\n` +
  `_LRC_COVER_SOURCE_SHA = "${LRC_COVER_REPLAY_SCRIPT_SHA256}"\n_LRC_FRONTIER_SOURCE_SHA = "${LRC_FRONTIER_REPLAY_SCRIPT_SHA256}"\n${driver}`;
const env = { NODE_ENV: process.env.NODE_ENV, PATH: process.env.PATH ?? "/usr/bin:/bin", PYTHONDONTWRITEBYTECODE: "1" };
let plan: LrcUnitActionPlan, receipt: LrcUnitActionEvidence;
function python(rawPlan: unknown, rawFrontier = frontier): unknown {
  return JSON.parse(execFileSync("python3", ["-I", "-S", "-B", "-c", program], {
    input: canonicalJson({ base, frontier: rawFrontier, plan: rawPlan }), encoding: "utf8", timeout: 90000, maxBuffer: 1048576, env,
  }));
}
function sealPlan(raw: LrcUnitActionPlan): LrcUnitActionPlan { raw.planDigest = lrcUnitActionPlanDigest(raw); return raw; }
function sealReceipt(raw: LrcUnitActionEvidence): LrcUnitActionEvidence {
  const body = { ...raw }; delete (body as Partial<LrcUnitActionEvidence>).evidenceDigest;
  raw.evidenceDigest = hash(canonicalJson(body)); return raw;
}
function coherentSummary(raw: LrcUnitActionEvidence): void {
  raw.independent.summary = structuredClone(raw.primary); raw.independent.status = raw.primary.status;
  raw.independent.outputDigest = hash(lrcUnitActionOutputBytes(raw.primary));
}
beforeEach(async () => {
  vi.mocked(processes.execFile).mockReset().mockImplementation((await vi.importActual<typeof import("node:child_process")>("node:child_process")).execFile);
  vi.mocked(files.readFile).mockReset().mockImplementation((await vi.importActual<typeof import("node:fs/promises")>("node:fs/promises")).readFile);
});
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs(); });
beforeAll(async () => { plan = deriveLrcUnitActionPlan(base, frontier); receipt = await runLrcUnitActionEvidence(base, frontier, plan); }, 90000);

describe("independent signed endpoint unit transport", () => {
  it("executes three pinned sources and replays prior composition before exact transport", () => {
    expect(hash(coverSource)).toBe(LRC_COVER_REPLAY_SCRIPT_SHA256);
    expect(hash(frontierSource)).toBe(LRC_FRONTIER_REPLAY_SCRIPT_SHA256);
    expect(hash(driver)).toBe(LRC_UNIT_REPLAY_SCRIPT_SHA256);
    expect(hash(program)).toBe(LRC_UNIT_COMPOSED_PROGRAM_SHA256);
    expect(receipt.primary.status).toBe("PARTIAL"); expect(receipt.primary.globalVerdict).toBe("NOT_ESTABLISHED");
    expect(receipt.primary.uncoveredObligations).toHaveLength(5);
    expect(receipt.primary.rows.map((r) => r.unionWitnessTuples)).toEqual(["1560933318", "1896838020", "960260742", "1314273786"]);
    expect(receipt.primary.rows.map((r) => r.unionIntervals)).toEqual([72, 79, 83, 58]);
    for (const row of receipt.primary.rows) {
      expect(BigInt(row.unionWitnessTuples) + BigInt(row.remainingTuples)).toBe(BigInt(row.totalTuples));
      expect(BigInt(row.unionWitnessTuples) - BigInt(row.originalWitnessTuples)).toBe(BigInt(row.deltaWitnessTuples));
      expect(row.candidateIntervals).toBe(row.sourceLeafCount * 6);
    }
    expect(validateRetainedLrcUnitActionEvidence(receipt, base, frontier)).toBe(true);
    expect(processes.execFile).not.toHaveBeenCalled(); expect(files.readFile).not.toHaveBeenCalled();
  }, 30000);
  it("independent Python sweep, TS merge and a flat49-point oracle agree on60 overlapping/adjacent/duplicate cases", () => {
    const cases: LrcUnitInterval[][] = [[], [{ start: "0", end: "7" }, { start: "7", end: "14" }],
      [{ start: "0", end: "10" }, { start: "5", end: "15" }],
      Array(6).fill({ start: "1", end: "2" }), [{ start: "0", end: "1" }, { start: "48", end: "49" }]];
    let state = 71023;
    while (cases.length < 60) {
      const intervals: LrcUnitInterval[] = [];
      for (let n = 0; n < 8; n++) {
        state = (state * 48271) % 2147483647; const start = state % 49;
        state = (state * 48271) % 2147483647; const end = start + 1 + state % (49 - start);
        intervals.push({ start: String(start), end: String(end) });
      }
      cases.push(intervals);
    }
    const helper = `_ns={"__name__":"_helper_test"}\nexec(${JSON.stringify(driver)},_ns)\n` +
      `rows=json.loads(sys.stdin.read())\nout=[]\nfor row in rows:\n u,c=_ns["sweep_union"]([(int(r["start"]),int(r["end"])) for r in row],7**13,lambda:None,lambda n:None)\n out.append({"union":_ns["interval_records"](u),"complement":_ns["interval_records"](c)})\nprint(json.dumps(out,separators=(",",":")))\n`;
    const outputs = JSON.parse(execFileSync("python3", ["-I", "-S", "-B", "-c", "import json,sys\n" + helper],
      { input: JSON.stringify(cases), encoding: "utf8", timeout: 10000, maxBuffer: 262144, env })) as { union: LrcUnitInterval[]; complement: LrcUnitInterval[] }[];
    for (const [index, intervals] of cases.entries()) {
      const flat = new Set<number>();
      for (const interval of intervals) for (let n = Number(interval.start); n < Number(interval.end); n++) flat.add(n);
      expect(outputs[index].union).toEqual(mergeLrcUnitIntervals(intervals));
      expect(outputs[index].complement).toEqual(complementLrcUnitIntervals(outputs[index].union));
      const covered = outputs[index].union.reduce((sum, r) => sum + BigInt(r.end) - BigInt(r.start), BigInt(0));
      expect(covered).toBe(BigInt(flat.size));
      const remaining = outputs[index].complement.reduce((sum, r) => sum + BigInt(r.end) - BigInt(r.start), BigInt(0));
      expect(covered + remaining).toBe(BigInt("96889010407"));
    }
  });
  it("six unit images of a fixed digit are ONE cylinder, not six times its cardinality", () => {
    const residues = Array(13).fill(1), units = [0, 2, 3, 4, 5, 6];
    const prefixes = units.map((t) => transportLrcUnitPrefix([1], residues, t));
    expect(prefixes).toEqual(Array(6).fill([1]));
    const intervals = prefixes.map(lrcUnitPrefixInterval), union = mergeLrcUnitIntervals(intervals);
    const cardinality = BigInt(union[0].end) - BigInt(union[0].start);
    expect(union).toHaveLength(1); expect(cardinality).toBe(BigInt(7) ** BigInt(12));
    expect(intervals.reduce((sum, r) => sum + BigInt(r.end) - BigInt(r.start), BigInt(0))).toBe(BigInt(6) * cardinality);
    const helper = `_ns={"__name__":"_fixed_test"}\nexec(${JSON.stringify(driver)},_ns)\n` +
      `_images=[_ns["transformed_prefix"]([1],[1]*13,t) for t in [0,2,3,4,5,6]]\n` +
      `_u,_c=_ns["sweep_union"]([_ns["prefix_interval"](p) for p in _images],7**13,lambda:None,lambda n:None)\n` +
      `print(json.dumps({"images":_images,"union":_ns["interval_records"](_u),"complement":_ns["interval_records"](_c)},separators=(",",":")))\n`;
    const result = JSON.parse(execFileSync("python3", ["-I", "-S", "-B", "-c", "import json\n" + helper], { encoding: "utf8", timeout: 10000, maxBuffer: 262144, env }));
    expect(result.images).toEqual(prefixes); expect(result.union).toEqual(union);
    expect(result.complement).toEqual(complementLrcUnitIntervals(union));
    expect(() => transportLrcUnitPrefix([1], residues, 1)).toThrow();
  });
  it.each([0, 1, 2, 3])("refuses rehashed sealed-source/unit defect %i in BOTH interpreters", (which) => {
    const raw = structuredClone(plan);
    if (which === 0) raw.units[1] = { t: 1, s: 399 };
    if (which === 1) raw.rows[0].sourceLeafCount--;
    if (which === 2) raw.rows[0].sourceSelectionDigest = "a".repeat(64);
    if (which === 3) raw.rows[0].parentRootContractDigest = raw.rows[1].parentRootContractDigest;
    sealPlan(raw);
    expect(verifyLrcUnitActionPlan(raw, base, frontier)).toBeNull(); expect(() => python(raw)).toThrow();
  }, 30000);
  it("requires the whole049 report/receipt pin, not merely its unmodified packet", () => {
    const fake = structuredClone(frontier); fake.evidence.independent.programDigest = "a".repeat(64);
    const evidenceBody = { ...fake.evidence }; delete evidenceBody.evidenceDigest;
    fake.evidence.evidenceDigest = hash(canonicalJson(evidenceBody));
    const reportBody = { ...fake }; delete reportBody.reportDigest; fake.reportDigest = hash(canonicalJson(reportBody));
    expect(verifyLrcUnitActionPlan(plan, base, fake)).toBeNull(); expect(() => python(plan, fake)).toThrow();
  }, 30000);
  it.each([0, 1, 2, 3])("pure fresh union reconstruction rejects coherent summary promotion %i with zero tools", (which) => {
    const raw = structuredClone(receipt), row = raw.primary.rows[0];
    if (which === 0) { row.unionWitnessTuples = String(BigInt(row.unionWitnessTuples) - BigInt(1)); row.deltaWitnessTuples = String(BigInt(row.deltaWitnessTuples) - BigInt(1)); row.remainingTuples = String(BigInt(row.remainingTuples) + BigInt(1)); row.overlapTuples = "1"; }
    if (which === 1) row.unionDigest = "a".repeat(64);
    if (which === 2) row.complementExamples.pop();
    if (which === 3) { row.status = "COMPLETE"; row.unionWitnessTuples = row.totalTuples; row.remainingTuples = "0"; row.deltaWitnessTuples = String(BigInt(row.totalTuples) - BigInt(row.originalWitnessTuples)); row.rawTransportTuples = row.totalTuples; raw.primary.status = "COMPLETE"; }
    coherentSummary(raw); sealReceipt(raw);
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    expect(validateRetainedLrcUnitActionEvidence(raw, base, frontier)).toBe(false);
    expect(processes.execFile).not.toHaveBeenCalled(); expect(files.readFile).not.toHaveBeenCalled(); expect(fetchSpy).not.toHaveBeenCalled();
  }, 30000);
  it.each(["coverScriptDigest", "frontierScriptDigest", "scriptDigest", "programDigest", "outputDigest"] as const)("rejects rehashed wrong execution pin %s with fresh arithmetic admission", (key) => {
    const raw = structuredClone(receipt); raw.independent[key] = "a".repeat(64);
    expect(validateRetainedLrcUnitActionEvidence(sealReceipt(raw), base, frontier)).toBe(false);
    expect(processes.execFile).not.toHaveBeenCalled(); expect(files.readFile).not.toHaveBeenCalled();
  }, 30000);
  it("rejects zero/excess clocks and production before IO", async () => {
    expect(validateRetainedLrcUnitActionEvidence(receipt, base, frontier, { timeoutMs: 0 })).toBe(false);
    expect(validateRetainedLrcUnitActionEvidence(receipt, base, frontier, { timeoutMs: 60001 })).toBe(false);
    await expect(runLrcUnitActionEvidence(base, frontier, plan, { timeoutMs: 0 })).rejects.toThrow("deadline");
    await expect(runLrcUnitActionEvidence(base, frontier, plan, { timeoutMs: 90001 })).rejects.toThrow();
    vi.stubEnv("NODE_ENV", "production"); await expect(runLrcUnitActionEvidence(base, frontier, plan)).rejects.toThrow("local development/test");
    expect(processes.execFile).not.toHaveBeenCalled(); expect(files.readFile).not.toHaveBeenCalled();
  });
  it.each(["replay-lrc-cover-bound.py", "replay-lrc-frontier.py", "replay-lrc-unit-action.py"])("refuses source drift in %s before subprocess", async (tail) => {
    const actual = (await vi.importActual<typeof import("node:fs/promises")>("node:fs/promises")).readFile;
    vi.mocked(files.readFile).mockImplementation(async (...args: Parameters<typeof files.readFile>) => String(args[0]).endsWith(tail) ? "unchecked source" : actual(...args));
    await expect(runLrcUnitActionEvidence(base, frontier, plan)).rejects.toThrow("source drift"); expect(processes.execFile).not.toHaveBeenCalled();
  }, 30000);
  it("fails closed on process timeout and coherent independent union disagreement", async () => {
    vi.mocked(processes.execFile).mockImplementation((_file, _args, _options, callback) => {
      queueMicrotask(() => (callback as (e: Error | null, out: string, err: string) => void)(new Error("ETIMEDOUT"), "", ""));
      return { stdin: { on: vi.fn(), end: vi.fn() }, kill: vi.fn() } as unknown as ReturnType<typeof processes.execFile>;
    });
    await expect(runLrcUnitActionEvidence(base, frontier, plan)).rejects.toThrow("failed closed");
    const call = vi.mocked(processes.execFile).mock.calls[0];
    expect(call[0]).toBe("python3"); expect((call[1] as string[]).slice(0, 4)).toEqual(["-I", "-S", "-B", "-c"]);
    const options = call[2] as { shell: boolean; maxBuffer: number; env: Record<string, string> };
    expect(options.shell).toBe(false); expect(options.maxBuffer).toBe(1048576);
    expect(Object.keys(options.env).sort()).toEqual(["NODE_ENV", "PATH", "PYTHONDONTWRITEBYTECODE"]);
    vi.mocked(processes.execFile).mockImplementation((_file, _args, _options, callback) => {
      const raw = structuredClone(receipt.primary); raw.rows[0].unionDigest = "a".repeat(64);
      queueMicrotask(() => (callback as (e: Error | null, out: string, err: string) => void)(null, lrcUnitActionOutputBytes(raw), ""));
      return { stdin: { on: vi.fn(), end: vi.fn() }, kill: vi.fn() } as unknown as ReturnType<typeof processes.execFile>;
    });
    await expect(runLrcUnitActionEvidence(base, frontier, plan)).rejects.toThrow("disagreement");
  }, 30000);
});
