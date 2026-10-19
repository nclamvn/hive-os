import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { performance } from "node:perf_hooks";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { characterShiftPacket } from "../../scripts/operations/character-shift-partitions";
import { characterShiftHash, characterShiftPacketSchema, characterShiftRouting, compareCharacterShiftReplay,
  verifyCharacterShiftPacket, type CharacterShiftPacket } from "../../scripts/operations/character-shift-check";
import { CHARACTER_SHIFT_REPLAY_SHA256, replayCharacterShiftPartitions } from "../../scripts/operations/character-shift-replay";
vi.mock("node:child_process", { spy: true });
vi.mock("node:fs", { spy: true });
vi.mock("node:perf_hooks", async importOriginal => {
  const actual = await importOriginal<typeof import("node:perf_hooks")>();
  return { ...actual, performance: { now: vi.fn(() => actual.performance.now()) } };
});
let primary: CharacterShiftPacket, replay: CharacterShiftPacket;
function seal(p: CharacterShiftPacket) {
  for (const r of p.rows) {
    r.count = String(r.image.length); r.imageDigest = characterShiftHash(r.image);
    r.witnessDigest = r.canonical ? characterShiftHash(r.canonical) : null; r.defectDigest = r.defect ? characterShiftHash(r.defect) : null;
    const { rowDigest, ...body } = r; void rowDigest; r.rowDigest = characterShiftHash(body);
  }
  p.shiftManifestDigest = characterShiftHash((p.inputs as { shifts: string[] }).shifts);
  p.rowsDigest = characterShiftHash(p.rows); p.routing = characterShiftRouting(p.rows); p.routingDigest = characterShiftHash(p.routing);
  p.contentDigest = characterShiftHash({ inputs: p.inputs, shiftManifestDigest: p.shiftManifestDigest, rows: p.rows,
    rowsDigest: p.rowsDigest, routing: p.routing, routingDigest: p.routingDigest });
  for (let i = 0; i < 16; i++) {
    const { packetDigest, ...body } = p; void packetDigest; p.packetDigest = characterShiftHash(body);
    const bytes = String(Buffer.byteLength(canonicalJson(p))); if (bytes === p.runtime.outputBytes) return p;
    p.runtime.outputBytes = bytes;
  }
  throw new Error("Byte fixed point");
}
function python(code: string) {
  return spawnSync("python3", ["-I", "-S", "-B", "-c", `import runpy,json\nm=runpy.run_path('scripts/operations/character-shift-replay.py')\ng=m['packet'].__globals__\n${code}`],
    { encoding: "utf8", timeout: 60000, maxBuffer: 2097152, env: { PATH: process.env.PATH ?? "/usr/bin:/bin", NODE_ENV: "test" } });
}
function pyPacket(code: string) { const r = python(code); expect(r.status).toBe(0); return JSON.parse(r.stdout) as CharacterShiftPacket; }

describe("TIP037 independent general-prime character-shift replay", () => {
  beforeAll(() => {
    const raw = characterShiftPacket(); expect(verifyCharacterShiftPacket(raw)).toBe(true); primary = characterShiftPacketSchema.parse(raw);
    const result = replayCharacterShiftPartitions(primary); expect(result.status).toBe("PASS");
    expect(verifyCharacterShiftPacket(result.replay)).toBe(true); replay = result.replay as CharacterShiftPacket;
  }, 60000);

  it("agrees on every full image, strict canonical tuple, character, defect and routing without claiming new root coverage", () => {
    expect(primary.rows).toHaveLength(60); expect(primary.rows.filter(r => r.hit)).toHaveLength(11);
    expect(primary.rows.filter(r => r.hit && !r.character.preferred)).toHaveLength(5);
    expect(primary.routing.map(r => [r.smallestSuccessfulFull, r.smallestSuccessfulPreferred])).toEqual([["3", "103"], ["3", "31"], ["3", "19"], ["71", "71"]]);
    expect(replay.runtime).toMatchObject({ pairChecks: "30512" });
    expect(compareCharacterShiftReplay(primary, replay)).toBe("PASS");
    expect(replay.contentDigest).toBe("a6e29476a065de13e0de34d64458579b96e74ec9da35196e74eac1275f4e767c");
    expect(replay.shiftManifestDigest).toBe("0ba105aa0a26ab5b67d6e0f0dd861948755210a4ad76726c58a05b6207d03ada");
    const controls = replay.rows.filter(r => r.h === "31" && ["200023321", "131433121"].includes(r.p));
    expect(controls).toHaveLength(2);
    for (const r of controls) expect(r).toMatchObject({ hit: false, character: { preferred: true }, defect: {
      stabilizer: ["1", "2", "4", "8", "16"], size: "5", index: "6", visibleMass: "1", visibleFactors: [{ residue: "17", quotientOrder: "6" }] } });
    expect(primary.rows.some(r => r.factors.some(([, e]) => Number(e) > 1))).toBe(true);
    expect(primary.rows.some(r => r.canonical && Number(r.canonical.k) > 1)).toBe(true);
  });

  it("fully rehashed scope/character/factor/image/strict-tuple/stabilizer/quotient-order/mass mutations fail", () => {
    const mutations: ((p: CharacterShiftPacket) => void)[] = [
      p => { (p.inputs as { targets: string[] }).targets[0] = "200023322"; },
      p => { (p.inputs as { shifts: string[] }).shifts.pop(); }, p => { p.scope = "forged" as never; },
      p => { p.rows[0].p = "19"; }, p => { p.rows[0].h = "15"; }, p => { p.rows[0].T = "1"; },
      p => { p.rows[0].factors[0][1] = "20"; }, p => { p.rows[0].character.preferred = !p.rows[0].character.preferred; },
      p => { p.rows[0].character.legendre = "-1"; }, p => { p.rows.find(r => r.canonical)!.canonical!.z = "1"; },
      p => { p.rows.find(r => r.defect)!.defect!.stabilizer.push("2"); },
      p => { p.rows.find(r => r.defect?.visibleFactors.length)!.defect!.visibleFactors[0].quotientOrder = "3"; },
      p => { p.rows.find(r => r.defect)!.defect!.visibleMass = "99"; },
      p => { p.rows.find(r => r.defect)!.defect!.conditions.indexEven = false; }, p => { p.rows.pop(); },
    ];
    for (const mutate of mutations) { const p = structuredClone(primary); mutate(p); seal(p); expect(compareCharacterShiftReplay(p, replay)).toBe("MISMATCH"); }
    const p = structuredClone(primary), r = p.rows.find(r => r.hit && r.image.length > 3)!;
    r.image.splice(1, 1); seal(p); expect(compareCharacterShiftReplay(p, replay)).toBe("MISMATCH");
    const route = structuredClone(primary); route.routing[0].smallestSuccessfulFull = "103";
    route.routingDigest = characterShiftHash(route.routing); expect(verifyCharacterShiftPacket(route)).toBe(false);
  }, 30000);

  it("COMPLETE elapsed60s/pair overshoot and internally contradicted miss conditions are rejected", () => {
    for (const time of ["60000", "60001"]) { const p = structuredClone(replay); p.runtime.elapsedMs = time; seal(p); expect(verifyCharacterShiftPacket(p)).toBe(false); }
    const p = structuredClone(replay); if ("pairChecks" in p.runtime) p.runtime.pairChecks = "50000001";
    seal(p); expect(verifyCharacterShiftPacket(p)).toBe(false);
    const broken = structuredClone(primary), r = broken.rows.find(r => r.defect)!; r.defect!.conditions.visibleMassBound = false;
    seal(broken); expect(verifyCharacterShiftPacket(broken)).toBe(false);
  });

  it("resource partials retain completed exact row prefix/routing and cannot PASS", () => {
    const p = characterShiftPacket({ maxRows: 16 }); expect(verifyCharacterShiftPacket(p)).toBe(true);
    expect(replayCharacterShiftPartitions(p)).toMatchObject({ status: "PARTIAL", reason: "PRIMARY_PARTIAL", verifiedScriptDigest: null });
    expect(p.routing.map(r => r.complete)).toEqual([true, false, false, false]);
    const forged = characterShiftPacketSchema.parse(p); forged.pending = { phase: "ROW", p: "200656681", h: "107" };
    seal(forged); expect(verifyCharacterShiftPacket(forged)).toBe(false);
    const replayPartial = pyPacket("p=m['packet'](pair_limit=0)\nprint(m['compact'](p),end='')");
    expect(replayPartial).toMatchObject({ status: "PARTIAL", reason: "REPLAY_PAIR_LIMIT", pending: { phase: "ROW", p: "200023321", h: "3" } });
    expect(verifyCharacterShiftPacket(replayPartial)).toBe(true); expect(compareCharacterShiftReplay(primary, replayPartial)).toBe("PARTIAL");
  });

  it("independent first/internal/midpoint/finalize timeouts retain precise row and finalization prefix", () => {
    const cases = ["self.pending.get('p')=='200023321'", "self.pending.get('p')=='200602081' and self.pending.get('h')=='31'", "self.pending['phase']=='FINALIZE'"];
    for (const condition of cases) {
      const p = pyPacket(`original=g['Budget'].check\ndef check(self):\n    if ${condition}: raise g['LimitReached']('REPLAY_TIME_LIMIT')\n    original(self)\ng['Budget'].check=check\np=m['packet']()\nprint(m['compact'](p),end='')`);
      expect(p.status).toBe("PARTIAL"); expect(verifyCharacterShiftPacket(p)).toBe(true); expect(compareCharacterShiftReplay(primary, p)).toBe("PARTIAL");
      if (condition.includes("FINALIZE")) expect(p.rows).toHaveLength(60);
    }
    const internal = pyPacket("original=g['Budget'].pair\ndef pair(self):\n    if self.pairs==100: raise g['LimitReached']('REPLAY_TIME_LIMIT')\n    original(self)\ng['Budget'].pair=pair\np=m['packet']()\nprint(m['compact'](p),end='')");
    expect(verifyCharacterShiftPacket(internal)).toBe(true); expect(internal.status).toBe("PARTIAL");
  }, 30000);

  it("postserialization deadline and bounded-output prefix/head controls never return COMPLETE", () => {
    const late = pyPacket("clock=[0.0]\noriginal=g['compact']\ndef compact(v):\n    if isinstance(v,dict) and v.get('packetDigest') and v.get('status')=='COMPLETE': clock[0]=61.0\n    return original(v)\ng['compact']=compact\np=m['packet'](clock=lambda:clock[0])\nprint(original(p),end='')");
    expect(late).toMatchObject({ status: "PARTIAL", reason: "REPLAY_TIME_LIMIT", pending: { phase: "FINALIZE" } }); expect(verifyCharacterShiftPacket(late)).toBe(true);
    const stdoutLate = pyPacket("clock=[0.0]\nreturned=[False]\noriginal_packet=g['packet']\noriginal_compact=g['compact']\ndef packet(clock):\n    p=original_packet(clock=clock)\n    returned[0]=True\n    return p\ndef compact(v):\n    if returned[0]: clock[0]=61.0\n    return original_compact(v)\ng['packet']=packet\ng['compact']=compact\ng['time'].monotonic=lambda:clock[0]\ng['main']()");
    expect(stdoutLate).toMatchObject({ status: "PARTIAL", reason: "REPLAY_TIME_LIMIT", pending: { phase: "FINALIZE" } }); expect(verifyCharacterShiftPacket(stdoutLate)).toBe(true);
    const small = pyPacket("g['MAX_OUTPUT_BYTES']=15000\np=m['packet']()\nprint(m['compact'](p),end='')");
    expect(small.status).toBe("PARTIAL"); expect(small.reason).toBe("OUTPUT_LIMIT"); expect(Number(small.runtime.outputBytes)).toBeLessThanOrEqual(15000);
    expect(verifyCharacterShiftPacket(small)).toBe(true); expect(compareCharacterShiftReplay(primary, small)).toBe("PARTIAL");
    const head = python("g['MAX_OUTPUT_BYTES']=10\nm['packet']()"); expect(head.status).not.toBe(0); expect(head.stdout).toBe("");
  }, 30000);

  it("simulated defect contradiction retains the offending row and exits1 without normal certificate", () => {
    const r = python("original=g['defect']\ndef broken(fs,image,h,budget=None):\n    d=original(fs,image,h,budget)\n    d['conditions']['visibleMassBound']=False\n    return d\ng['defect']=broken\ng['main']()");
    expect(r.status).toBe(1); const d = JSON.parse(r.stdout);
    expect(d).toMatchObject({ status: "INVESTIGATION", reason: "MISS_DEFECT_CONTRADICTION" });
    expect(d.row.rowDigest).toMatch(/^[a-f0-9]{64}$/); expect(verifyCharacterShiftPacket(d)).toBe(false);
  });

  it("source drift exposes actual versus expected provenance and launches no child", () => {
    const source = readFileSync("scripts/operations/character-shift-replay.py"), child = vi.mocked(spawnSync), file = vi.mocked(readFileSync);
    child.mockClear(); file.mockReturnValueOnce(Buffer.concat([source, Buffer.from("\n# drift\n")]));
    try { const r = replayCharacterShiftPartitions(primary); expect(r).toMatchObject({ status: "UNAVAILABLE", reason: "SOURCE_PIN_MISMATCH",
      expectedScriptDigest: CHARACTER_SHIFT_REPLAY_SHA256, verifiedScriptDigest: null }); expect(r.observedScriptDigest).not.toBe(r.expectedScriptDigest); expect(child).not.toHaveBeenCalled(); }
    finally { file.mockReset(); child.mockClear(); }
  });

  it("executes only fixed pinned isolated bytes/env; missing tool/output/parse/process errors fail closed", () => {
    const source = readFileSync("scripts/operations/character-shift-replay.py", "utf8"), child = vi.mocked(spawnSync);
    try {
      child.mockImplementation((...args) => {
        expect(args[0]).toBe("python3"); expect(args[1]).toEqual(["-I", "-S", "-B", "-c", source]);
        expect(Object.keys((args[2] as { env: object }).env).sort()).toEqual(["NODE_ENV", "PATH", "PYTHONDONTWRITEBYTECODE"]);
        return { error: new Error("ENOENT"), status: null, stdout: "", stderr: "", output: [], pid: 0 } as never;
      }); expect(replayCharacterShiftPartitions(primary).status).toBe("UNAVAILABLE");
      child.mockReturnValue({ error: new Error("ETIMEDOUT"), status: null, stdout: "", output: [], pid: 0 } as never); expect(replayCharacterShiftPartitions(primary).status).toBe("UNAVAILABLE");
      child.mockReturnValue({ status: 0, stdout: "x".repeat(2097153), output: [], pid: 0 } as never); expect(replayCharacterShiftPartitions(primary)).toMatchObject({ status: "UNAVAILABLE", reason: "REPLAY_OUTPUT_LIMIT" });
      child.mockReturnValue({ status: 0, stdout: "malformed", output: [], pid: 0 } as never); expect(replayCharacterShiftPartitions(primary)).toMatchObject({ status: "MISMATCH", reason: "REPLAY_JSON_INVALID" });
      child.mockReturnValue({ status: 0, stdout: "{}", output: [], pid: 0 } as never); expect(replayCharacterShiftPartitions(primary)).toMatchObject({ status: "MISMATCH", reason: "REPLAY_INVARIANT_INVALID" });
    } finally { child.mockReset(); }
  });

  it("final observed receipt elapsed>=60000 downgrades child COMPLETE to UNAVAILABLE", () => {
    const child = vi.mocked(spawnSync), clock = vi.mocked(performance.now), ticks = [0, 0, 59999, 60000];
    try { child.mockReturnValue({ status: 0, stdout: canonicalJson(replay), output: [], pid: 0 } as never);
      clock.mockImplementation(() => ticks.shift() ?? 60000);
      expect(replayCharacterShiftPartitions(primary)).toMatchObject({ status: "UNAVAILABLE", reason: "WRAPPER_TIME_LIMIT", elapsedMs: 60000 }); expect(ticks).toHaveLength(0);
    } finally { child.mockReset(); clock.mockReset(); }
  });
});
