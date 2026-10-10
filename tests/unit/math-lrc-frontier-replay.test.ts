import { execFileSync } from "node:child_process";
import * as processes from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import * as files from "node:fs/promises";
import { beforeAll, beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { lrcCoverCertificateDigest } from "@/modules/research-sandbox/math-lrc-cover-bound";
import { LRC_COVER_REPLAY_SCRIPT_SHA256, runLrcCoverEvidence } from "@/modules/research-sandbox/math-lrc-cover-replay";
import { LRC_FRONTIER_BASE, LRC_FRONTIER_CONTRACT_DIGEST, LRC_FRONTIER_METHOD,
  selectResumePlan, lrcFrontierPacketDigest, lrcResumeJobDigest, lrcResumePlanDigest,
  lrcFrontierOutputBytes, verifyResumeComposition, type LrcFrontierPacket } from "@/modules/research-sandbox/math-lrc-frontier";
import { LRC_FRONTIER_REPLAY_SCRIPT_SHA256, LRC_FRONTIER_COMPOSED_PROGRAM_SHA256,
  runLrcFrontierEvidence, validateRetainedLrcFrontierEvidence, type LrcFrontierEvidence }
  from "@/modules/research-sandbox/math-lrc-frontier-replay";

vi.mock("node:child_process", async (original) => {
  const actual = await original<typeof import("node:child_process")>();
  return { ...actual, execFile: vi.fn(actual.execFile) };
});
vi.mock("node:fs/promises", async (original) => {
  const actual = await original<typeof import("node:fs/promises")>();
  return { ...actual, readFile: vi.fn(actual.readFile) };
});
const hash = (s: string) => createHash("sha256").update(s).digest("hex");
const base = JSON.parse(readFileSync(LRC_FRONTIER_BASE.path, "utf8"));
const cover = readFileSync("scripts/operations/replay-lrc-cover-bound.py", "utf8");
const driver = readFileSync("scripts/operations/replay-lrc-frontier.py", "utf8");
const program = `import hashlib as _lrc_hashlib\n_LRC_COVER_LITERAL = ${JSON.stringify(cover)}\n` +
  `if _lrc_hashlib.sha256(_LRC_COVER_LITERAL.encode()).hexdigest() != "${LRC_COVER_REPLAY_SCRIPT_SHA256}": raise ValueError("SOURCE_PIN")\n` +
  `_LRC_COVER_NAMESPACE = {"__name__": "_lrc_cover_checked"}\n` +
  `exec(compile(_LRC_COVER_LITERAL, "<pinned048>", "exec"), _LRC_COVER_NAMESPACE)\n` +
  `_LRC_COVER_CHECK = _LRC_COVER_NAMESPACE["check"]\n_LRC_COVER_SOURCE_SHA = "${LRC_COVER_REPLAY_SCRIPT_SHA256}"\n${driver}`;
let packet: LrcFrontierPacket, receipt: LrcFrontierEvidence;
function python(raw: unknown, rawBase = base): unknown {
  return JSON.parse(execFileSync("python3", ["-I", "-S", "-B", "-c", program], {
    input: canonicalJson({ base: rawBase, packet: raw }), encoding: "utf8", timeout: 40000, maxBuffer: 1048576,
    env: { NODE_ENV: process.env.NODE_ENV, PATH: process.env.PATH ?? "/usr/bin:/bin", PYTHONDONTWRITEBYTECODE: "1" },
  }));
}
function seal(raw: LrcFrontierPacket): LrcFrontierPacket {
  for (const job of raw.plan.jobs) job.jobDigest = lrcResumeJobDigest(job);
  raw.plan.planDigest = lrcResumePlanDigest(raw.plan);
  for (const child of raw.children) {
    const evidence = child.evidence;
    evidence.certificate.certificateDigest = lrcCoverCertificateDigest(evidence.certificate);
    evidence.primary.certificateDigest = evidence.certificate.certificateDigest;
    evidence.independent.summary.certificateDigest = evidence.certificate.certificateDigest;
    evidence.independent.outputDigest = hash(JSON.stringify({ method: "LRC_COVER_PYTHON_TREE_REPLAY_V1", summary: evidence.independent.summary }) + "\n");
    const unsigned = { ...evidence }; delete (unsigned as Partial<typeof evidence>).evidenceDigest;
    evidence.evidenceDigest = hash(canonicalJson(unsigned));
  }
  raw.packetDigest = lrcFrontierPacketDigest(raw);
  return raw;
}
function reseal(raw: LrcFrontierEvidence): LrcFrontierEvidence {
  const body = { ...raw }; delete (body as Partial<LrcFrontierEvidence>).evidenceDigest;
  raw.evidenceDigest = hash(canonicalJson(body)); return raw;
}
beforeEach(async () => {
  vi.mocked(processes.execFile).mockReset().mockImplementation((await vi.importActual<typeof import("node:child_process")>("node:child_process")).execFile);
  vi.mocked(files.readFile).mockReset().mockImplementation((await vi.importActual<typeof import("node:fs/promises")>("node:fs/promises")).readFile);
});
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs(); });
beforeAll(async () => {
  const plan = selectResumePlan(base), children = [];
  for (const job of plan.jobs) children.push({ jobDigest: job.jobDigest,
    evidence: await runLrcCoverEvidence(job.childScope, job.childRootContractDigest, { maxNodes: 1 }) });
  const body = { version: 1 as const, method: LRC_FRONTIER_METHOD, contractDigest: LRC_FRONTIER_CONTRACT_DIGEST,
    baseReportDigest: base.reportDigest, plan, children };
  packet = { ...body, packetDigest: lrcFrontierPacketDigest(body) };
  receipt = await runLrcFrontierEvidence(base, packet);
}, 40000);

describe("pinned independent frontier composition replay", () => {
  it("executes both checked literal sources and independently preserves all four unknown frontiers", () => {
    expect(hash(cover)).toBe(LRC_COVER_REPLAY_SCRIPT_SHA256);
    expect(hash(driver)).toBe(LRC_FRONTIER_REPLAY_SCRIPT_SHA256);
    expect(hash(program)).toBe(LRC_FRONTIER_COMPOSED_PROGRAM_SHA256);
    expect(receipt.primary.status).toBe("PARTIAL");
    expect(receipt.primary.globalVerdict).toBe("NOT_ESTABLISHED");
    expect(receipt.primary.uncoveredObligations).toHaveLength(5);
    for (const row of receipt.primary.rows) {
      expect(row.current).toEqual(row.previous);
      expect(row.delta.classifiedTuples).toBe("0");
      expect(row.remainingFrontier.filter((leaf) => leaf.origin === "CHILD")).toHaveLength(2);
      expect(row.remainingFrontier.reduce((n, leaf) => n + BigInt(leaf.totalTuples), BigInt(0))).toBe(BigInt(row.current.unresolvedTuples));
    }
    expect(validateRetainedLrcFrontierEvidence(receipt, base)).toBe(true);
    expect(processes.execFile).not.toHaveBeenCalled();
    expect(files.readFile).not.toHaveBeenCalled();
  });
  it.each([[0, 7], [7, 13]])("rejects coherently rehashed defects %i..%i in both interpreters", (start, end) => {
    const mutations: ((raw: LrcFrontierPacket) => void)[] = [
      (raw) => { raw.plan.jobs[0].prefix[0] = 1; },
      (raw) => { raw.plan.jobs[0].childScope.digitAxes[12] = [0]; },
      (raw) => { raw.plan.jobs[0].childScope.parentResidues.reverse(); },
      (raw) => { raw.plan.jobs[0].childRootContractDigest = "a".repeat(64); },
      (raw) => { raw.plan.jobs[0].parentEvidenceDigest = "a".repeat(64); },
      (raw) => { raw.plan.jobs[0].targetNodeDigest = "a".repeat(64); },
      (raw) => { raw.children[1] = structuredClone(raw.children[0]); },
      (raw) => { raw.children.pop(); },
      (raw) => { raw.children[0].evidence.certificate.nodes[0].prefix = [1]; },
      (raw) => { raw.children[0].evidence.certificate.nodes.push(structuredClone(raw.children[0].evidence.certificate.nodes[0])); },
      (raw) => { raw.children[0].evidence.certificate.nodes[0] = { id: "n0", prefix: [], kind: "COVER_BOUND", uncoveredCount: 0, maxBad: Array(13).fill(0) }; },
      (raw) => { raw.children[0].evidence.primary.status = "COMPLETE"; },
      (raw) => { raw.plan.baseRawSha256 = "a".repeat(64); },
    ];
    for (const mutate of mutations.slice(start, end)) {
      const raw = structuredClone(packet); mutate(raw); seal(raw);
      expect(verifyResumeComposition(raw, base)).toBeNull();
      expect(() => python(raw)).toThrow();
    }
  }, 60000);
  it("rejects changed immutable base and boolean masquerading as an integer", () => {
    const changed = structuredClone(base); changed.rows[0].scope.parentResidues[0]++;
    const unsigned = { ...changed }; delete unsigned.reportDigest; changed.reportDigest = hash(canonicalJson(unsigned));
    expect(verifyResumeComposition(packet, changed)).toBeNull();
    expect(() => python(packet, changed)).toThrow();
    const raw = structuredClone(packet) as unknown as Record<string, unknown>;
    raw.version = true; raw.packetDigest = hash(canonicalJson(Object.fromEntries(Object.entries(raw).filter(([key]) => key !== "packetDigest"))));
    expect(verifyResumeComposition(raw, base)).toBeNull();
    expect(() => python(raw)).toThrow();
  }, 15000);
  it("pure admission rejects seven rehashed summary, source and theorem promotions without subprocess or fetch", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const mutations: ((raw: LrcFrontierEvidence) => void)[] = [
      (raw) => { raw.primary.status = "COMPLETE"; },
      (raw) => { raw.primary.rows[0].current.witnessTuples = "96889010407"; },
      (raw) => { raw.primary.rows[0].remainingFrontier.pop(); },
      (raw) => { raw.independent.scriptDigest = "a".repeat(64); },
      (raw) => { raw.independent.coverScriptDigest = "a".repeat(64); },
      (raw) => { raw.independent.programDigest = "a".repeat(64); },
      (raw) => { raw.independent.outputDigest = "a".repeat(64); },
    ];
    for (const [index, mutate] of mutations.entries()) {
      const raw = structuredClone(receipt); mutate(raw);
      if (index < 3) {
        raw.independent.summary = structuredClone(raw.primary);
        raw.independent.status = raw.primary.status;
        raw.independent.outputDigest = hash(lrcFrontierOutputBytes(raw.primary));
      }
      expect(validateRetainedLrcFrontierEvidence(reseal(raw), base)).toBe(false);
    }
    expect(processes.execFile).not.toHaveBeenCalled(); expect(files.readFile).not.toHaveBeenCalled(); expect(fetchSpy).not.toHaveBeenCalled();
  }, 30000);
  it("fails closed on tighter zero clocks, excess limits and production before any IO", async () => {
    expect(validateRetainedLrcFrontierEvidence(receipt, base, { timeoutMs: 0 })).toBe(false);
    expect(validateRetainedLrcFrontierEvidence(receipt, base, { timeoutMs: 30001 })).toBe(false);
    await expect(runLrcFrontierEvidence(base, packet, { timeoutMs: 0 })).rejects.toThrow("deadline");
    await expect(runLrcFrontierEvidence(base, packet, { timeoutMs: 40001 })).rejects.toThrow();
    vi.stubEnv("NODE_ENV", "production");
    await expect(runLrcFrontierEvidence(base, packet)).rejects.toThrow("local development/test");
    expect(processes.execFile).not.toHaveBeenCalled(); expect(files.readFile).not.toHaveBeenCalled();
  });
  it("rejects either checked source drifting and cannot execute unchecked bytes", async () => {
    const actual = (await vi.importActual<typeof import("node:fs/promises")>("node:fs/promises")).readFile;
    for (const tail of ["replay-lrc-cover-bound.py", "replay-lrc-frontier.py"]) {
      vi.mocked(files.readFile).mockImplementation(async (...args: Parameters<typeof files.readFile>) =>
        String(args[0]).endsWith(tail) ? "untrusted source" : actual(...args));
      await expect(runLrcFrontierEvidence(base, packet)).rejects.toThrow("source drift");
    }
    expect(processes.execFile).not.toHaveBeenCalled();
  }, 15000);
  it("fails closed on child timeout and independent arithmetic disagreement", async () => {
    vi.mocked(processes.execFile).mockImplementation((_file, _args, _options, callback) => {
      queueMicrotask(() => (callback as (e: Error | null, out: string, err: string) => void)(new Error("ETIMEDOUT"), "", ""));
      return { stdin: { on: vi.fn(), end: vi.fn() }, kill: vi.fn() } as unknown as ReturnType<typeof processes.execFile>;
    });
    await expect(runLrcFrontierEvidence(base, packet)).rejects.toThrow("failed closed");
    vi.mocked(processes.execFile).mockImplementation((_file, _args, _options, callback) => {
      const altered = structuredClone(receipt.primary); altered.rows[0].delta.classifiedTuples = "1";
      queueMicrotask(() => (callback as (e: Error | null, out: string, err: string) => void)(null,
        canonicalJson({ method: "LRC_FRONTIER_PYTHON_COMPOSITION_V1", summary: altered }) + "\n", ""));
      return { stdin: { on: vi.fn(), end: vi.fn() }, kill: vi.fn() } as unknown as ReturnType<typeof processes.execFile>;
    });
    await expect(runLrcFrontierEvidence(base, packet)).rejects.toThrow("disagreement");
  }, 15000);
});
