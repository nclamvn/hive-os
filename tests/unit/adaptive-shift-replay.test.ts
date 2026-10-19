import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { performance } from "node:perf_hooks";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { adaptiveShiftPacket } from "../../scripts/operations/adaptive-shift-partitions";
import { adaptiveShiftHash, adaptiveShiftReplayPacketSchema, compareAdaptiveShiftReplay, verifyAdaptiveShiftPacket, type AdaptiveShiftReplayPacket } from "../../scripts/operations/adaptive-shift-check";
import { ADAPTIVE_SHIFT_REPLAY_SHA256, replayAdaptiveShiftPartitions } from "../../scripts/operations/adaptive-shift-replay";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
vi.mock("node:child_process", { spy: true });
vi.mock("node:fs", { spy: true });
vi.mock("node:perf_hooks", async importOriginal => {
  const actual = await importOriginal<typeof import("node:perf_hooks")>();
  return { ...actual, performance: { now: vi.fn(() => actual.performance.now()) } };
});

let primary: AdaptiveShiftReplayPacket, replay: AdaptiveShiftReplayPacket;
function seal(p: AdaptiveShiftReplayPacket) {
  for (const row of p.rows) {
    row.imageDigest = adaptiveShiftHash(row.image); row.count = String(row.image.length);
    row.witnessDigest = row.canonical ? adaptiveShiftHash(row.canonical) : null;
    const { rowDigest, ...body } = row; void rowDigest; row.rowDigest = adaptiveShiftHash(body);
  }
  p.primeManifestDigest = adaptiveShiftHash(p.primes); p.rowsDigest = adaptiveShiftHash(p.rows);
  p.contentDigest = adaptiveShiftHash({ inputs: p.inputs, primes: p.primes, primeManifestDigest: p.primeManifestDigest,
    rows: p.rows, rowsDigest: p.rowsDigest, separateControl: p.separateControl, groupControls: p.groupControls });
  for (let i = 0; i < 16; i++) {
    const { packetDigest, ...body } = p; void packetDigest; p.packetDigest = adaptiveShiftHash(body);
    const bytes = String(Buffer.byteLength(canonicalJson(p)));
    if (bytes === p.runtime.outputBytes) return p;
    p.runtime.outputBytes = bytes;
  }
  throw new Error("Seal byte fixed point");
}
function python(code: string) {
  const result = spawnSync("python3", ["-I", "-S", "-B", "-c", `import runpy,json\nm=runpy.run_path('scripts/operations/adaptive-shift-replay.py')\ng=m['packet'].__globals__\n${code}`],
    { encoding: "utf8", timeout: 60000, maxBuffer: 2097152, env: { PATH: process.env.PATH ?? "/usr/bin:/bin", NODE_ENV: "test" } });
  expect(result.status).toBe(0); return JSON.parse(result.stdout) as AdaptiveShiftReplayPacket;
}

describe("TIP036 independent shifted-factor replay", () => {
  beforeAll(() => {
    const raw = adaptiveShiftPacket(); expect(verifyAdaptiveShiftPacket(raw)).toBe(true); primary = adaptiveShiftReplayPacketSchema.parse(raw);
    const result = replayAdaptiveShiftPartitions(primary);
    expect(result.status).toBe("PASS"); expect(verifyAdaptiveShiftPacket(result.replay)).toBe(true);
    replay = result.replay as AdaptiveShiftReplayPacket;
  }, 60000);

  it("agrees on all primes/full images/canonical tuples/factor and boundary-control manifests with separate runtime", () => {
    expect(primary.primes).toHaveLength(275); expect(primary.rows).toHaveLength(1953);
    expect(primary.rows.filter(r => r.hit)).toHaveLength(971);
    expect(compareAdaptiveShiftReplay(primary, replay)).toBe("PASS");
    expect(replay.contentDigest).toBe("ca0edf6ce6ab31d22e801a63db8301039efc20eb3c9d9ee7a613318ef2fcb913");
    expect(replay.primeManifestDigest).toBe("c0a2a8a449bc9eafb46860ba076e40e67b8a1f13c257ab700776b6e2aa5cfa10");
    expect(replay.runtime).toMatchObject({ pairChecks: "1742040" });
    expect(replay.groupControls.map(c => [c.profiles, c.applicableProfiles, c.misses, c.classificationMismatches]))
      .toEqual([["15", "12", "6", "0"], ["495", "460", "45", "0"]]);
    expect(replay.rows.slice(0, 28).every(r => Number(r.p) < 200000000)).toBe(true);
    expect(replay.rows.slice(28).every(r => Number(r.p) > 200000000)).toBe(true);
    expect(replay).toHaveProperty("separateControl.menuDomain", "NONINTEGER_T");
  });

  it("rejects fully rehashed interval/menu/p19/domain/factor/image/witness/candidate/prime-omission mutations", () => {
    const mutations: ((p: AdaptiveShiftReplayPacket) => void)[] = [
      p => { (p.inputs as { interval: { upperInclusive: string } }).interval.upperInclusive = "202000000"; },
      p => { (p.inputs as { shifts: string[] }).shifts.pop(); },
      p => { p.rows[0].p = "19"; }, p => { p.rows[0].T = String(Number(p.rows[0].T) + 1); },
      p => { p.rows[0].factors[0][1] = String(Number(p.rows[0].factors[0][1]) + 1); },
      p => { p.rows[0].image = [...p.rows[0].image].reverse(); },
      p => { p.rows.find(r => r.canonical)!.canonical!.x = "1"; },
      p => { p.rows[0].candidate.weight = "99"; }, p => { p.primes.pop(); },
      p => { p.rows.pop(); }, p => { p.groupControls[0].profilesDigest = "a".repeat(64); },
    ];
    for (const mutate of mutations) {
      const p = structuredClone(primary); mutate(p); seal(p);
      expect(compareAdaptiveShiftReplay(p, replay)).toBe("MISMATCH");
    }
    // A plausible image omission may pass scoped identity checks, never the independent full-image comparison.
    const changed = structuredClone(primary), row = changed.rows.find(r => r.image.length > 2)!;
    row.image.splice(1, 1); seal(changed); expect(compareAdaptiveShiftReplay(changed, replay)).toBe("MISMATCH");
  }, 30000);

  it("a rehashed contradictory prediction and complete elapsed deadline cannot pass invariant admission", () => {
    for (const elapsed of ["60000", "60001"]) {
      const p = structuredClone(primary); p.runtime.elapsedMs = elapsed; seal(p); expect(verifyAdaptiveShiftPacket(p)).toBe(false);
    }
    const p = structuredClone(primary), row = p.rows.find(r => r.candidate.predictedHit === true)!;
    row.hit = false; row.canonical = null; row.image = row.image.filter(r => r !== String(Number(row.h) - 1));
    seal(p); expect(verifyAdaptiveShiftPacket(p)).toBe(false);
  });

  it("primary resource partial is never replayed as PASS and pending row binds its exact prefix", () => {
    const raw = adaptiveShiftPacket({ maxRows: 1 }); expect(verifyAdaptiveShiftPacket(raw)).toBe(true);
    expect(replayAdaptiveShiftPartitions(raw)).toMatchObject({ status: "PARTIAL", reason: "PRIMARY_PARTIAL", verifiedScriptDigest: null });
    const p = structuredClone(raw) as AdaptiveShiftReplayPacket;
    p.pending = { phase: "ROW", p: "159727681", h: "107" }; seal(p); expect(verifyAdaptiveShiftPacket(p)).toBe(false);
    const partial = python("p=m['packet'](pair_limit=0)\nprint(m['compact'](p),end='')");
    expect(partial).toMatchObject({ status: "PARTIAL", reason: "REPLAY_PAIR_LIMIT", pending: { phase: "ROW", p: "131433121", h: "7" } });
    expect(verifyAdaptiveShiftPacket(partial)).toBe(true); expect(compareAdaptiveShiftReplay(primary, partial)).toBe("PARTIAL");
  }, 60000);

  it("Python time interruptions preserve first/group-completed/row/finalization prefix and no COMPLETE", () => {
    for (const [phase, h] of [["PRIME_SCAN", null], ["GROUP_CONTROLS", "11"], ["ROW_PAIRS", null], ["FINALIZE", null]]) {
      const condition = `self.pending['phase']=='${phase}'${h ? ` and str(self.pending.get('h'))=='${h}'` : ""}`;
      const p = python(`original=g['ReplayBudget'].check\ndef injected(self):\n    if ${condition}: raise g['LimitReached']('REPLAY_TIME_LIMIT')\n    original(self)\ng['ReplayBudget'].check=injected\np=m['packet']()\nprint(m['compact'](p),end='')`);
      expect(p.status).toBe("PARTIAL"); expect(verifyAdaptiveShiftPacket(p)).toBe(true);
      if (phase === "GROUP_CONTROLS") expect(p.groupControls).toHaveLength(1);
      if (phase === "FINALIZE") expect(p.rows).toHaveLength(1953);
      expect(compareAdaptiveShiftReplay(primary, p)).toBe("PARTIAL");
    }
  }, 60000);

  it("Python post-serialization deadline and output cap retain exact partial/pending rather than COMPLETE", () => {
    const late = python("clock=[0.0]\noriginal=g['compact']\ndef compact(v):\n    if isinstance(v,dict) and v.get('packetDigest') and v.get('status')=='COMPLETE': clock[0]=61.0\n    return original(v)\ng['compact']=compact\np=m['packet'](clock=lambda:clock[0])\nprint(original(p),end='')");
    expect(late).toMatchObject({ status: "PARTIAL", pending: { phase: "FINALIZE" }, reason: "REPLAY_TIME_LIMIT" });
    expect(verifyAdaptiveShiftPacket(late)).toBe(true);
    const small = python("g['MAX_OUTPUT_BYTES']=20000\np=m['packet']()\nprint(m['compact'](p),end='')");
    expect(small.status).toBe("PARTIAL"); expect(small.reason).toBe("OUTPUT_LIMIT");
    expect(Number(small.runtime.outputBytes)).toBeLessThanOrEqual(20000);
    expect(verifyAdaptiveShiftPacket(small)).toBe(true);
  }, 60000);

  it("keeps historical q15/q99 identities separate and retains unused/repeated valuations", () => {
    const control = python("print(json.dumps([m['strict_witness'](19,1,5,1,5),m['strict_witness'](159727681,201935,39982404,11,605794)]))") as unknown as { x: string; y: string; z: string }[];
    expect(control.map(c => [c.x, c.y, c.z])).toEqual([["5", "114", "570"], ["39982404", "31626080838", "1741717274106852"]]);
    expect(primary.rows.some(r => r.factors.some(([, e]) => Number(e) > 1))).toBe(true);
    expect(primary.rows.some(r => r.canonical && Number(r.canonical.k) > 1)).toBe(true);
  });

  it("simulated contradictory prediction emits bounded investigation row with nonzero exit, never a certificate", () => {
    const child = spawnSync("python3", ["-I", "-S", "-B", "-c",
      "import runpy,json,sys\nm=runpy.run_path('scripts/operations/adaptive-shift-replay.py')\ng=m['packet'].__globals__\noriginal=g['candidate']\ndef broken(fs,h):\n    c=original(fs,h)\n    c['predictedHit']=not c['predictedHit'] if c['predictedHit'] is not None else False\n    return c\ng['candidate']=broken\ng['main']()"],
    { encoding: "utf8", timeout: 60000, maxBuffer: 2097152, env: { PATH: process.env.PATH, NODE_ENV: "test" } });
    expect(child.status).toBe(1); const diagnostic = JSON.parse(child.stdout);
    expect(diagnostic).toMatchObject({ status: "INVESTIGATION", reason: "STRUCTURAL_PREDICTION_CONTRADICTION", row: { p: "131433121", h: "7" } });
    expect(verifyAdaptiveShiftPacket(diagnostic)).toBe(false);
  });

  it("source drift reports observed versus expected pin separately without launching a process", () => {
    const source = readFileSync("scripts/operations/adaptive-shift-replay.py");
    const file = vi.mocked(readFileSync).mockReturnValueOnce(Buffer.concat([source, Buffer.from("\n# drift\n")]));
    const child = vi.mocked(spawnSync); child.mockClear();
    try {
      const r = replayAdaptiveShiftPartitions(primary);
      expect(r).toMatchObject({ status: "UNAVAILABLE", reason: "SOURCE_PIN_MISMATCH", expectedScriptDigest: ADAPTIVE_SHIFT_REPLAY_SHA256, verifiedScriptDigest: null });
      expect(r.observedScriptDigest).not.toBe(r.expectedScriptDigest); expect(child).not.toHaveBeenCalled();
    } finally { file.mockReset(); child.mockClear(); }
  });

  it("fixed verified bytes run isolated without secrets, missing tool/timeouts/oversized/malformed outputs fail closed", () => {
    const source = readFileSync("scripts/operations/adaptive-shift-replay.py", "utf8");
    const child = vi.mocked(spawnSync);
    try {
      child.mockImplementation((...args) => {
        expect(args[0]).toBe("python3"); expect(args[1]).toEqual(["-I", "-S", "-B", "-c", source]);
        expect(args[2]).toMatchObject({ maxBuffer: 2097152 });
        expect(Object.keys((args[2] as { env: object }).env).sort()).toEqual(["NODE_ENV", "PATH", "PYTHONDONTWRITEBYTECODE"]);
        return { error: new Error("ENOENT"), status: null, stdout: "", stderr: "", pid: 0, output: [] } as never;
      });
      expect(replayAdaptiveShiftPartitions(primary).status).toBe("UNAVAILABLE");
      child.mockReturnValue({ error: new Error("ETIMEDOUT"), status: null, stdout: "", pid: 0, stderr: "", output: [] } as never);
      expect(replayAdaptiveShiftPartitions(primary).status).toBe("UNAVAILABLE");
      child.mockReturnValue({ status: 0, stdout: "x".repeat(2097153), pid: 0, stderr: "", output: [] } as never);
      expect(replayAdaptiveShiftPartitions(primary)).toMatchObject({ status: "UNAVAILABLE", reason: "REPLAY_OUTPUT_LIMIT" });
      child.mockReturnValue({ status: 0, stdout: "not-json", pid: 0, stderr: "", output: [] } as never);
      expect(replayAdaptiveShiftPartitions(primary)).toMatchObject({ status: "MISMATCH", reason: "REPLAY_JSON_INVALID" });
    } finally { child.mockReset(); }
  });

  it("final observed wrapper checkpoint crossing deadline cannot return PASS after successful comparison", () => {
    const child = vi.mocked(spawnSync), clock = vi.mocked(performance.now);
    const times = [0, 0, 59999, 60000];
    try {
      child.mockReturnValue({ status: 0, stdout: canonicalJson(replay), pid: 0, stderr: "", output: [] } as never);
      clock.mockImplementation(() => times.shift() ?? 60000);
      expect(replayAdaptiveShiftPartitions(primary)).toMatchObject({ status: "UNAVAILABLE", reason: "WRAPPER_TIME_LIMIT", elapsedMs: 60000 });
      expect(times).toHaveLength(0);
    } finally { child.mockReset(); clock.mockReset(); }
  });
});
