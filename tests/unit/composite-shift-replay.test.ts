import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { performance } from "node:perf_hooks";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { compositeShiftPacket } from "../../scripts/operations/composite-shift-partitions";
import { compositeShiftHash, compositeShiftPacketSchema, compositeShiftSummary, compositeShiftDefect, compositeShiftPow, compositeShiftInvolutions,
  compareCompositeShiftReplay, verifyCompositeShiftPacket, type CompositeShiftPacket } from "../../scripts/operations/composite-shift-check";
import { COMPOSITE_SHIFT_REPLAY_SHA256, replayCompositeShift } from "../../scripts/operations/composite-shift-replay";
vi.mock("node:child_process", { spy: true }); vi.mock("node:fs", { spy: true });
vi.mock("node:perf_hooks", async importOriginal => {
  const actual = await importOriginal<typeof import("node:perf_hooks")>();
  return { ...actual, performance: { now: vi.fn(() => actual.performance.now()) } };
});
let primary: CompositeShiftPacket, replay: CompositeShiftPacket;
function seal(p: CompositeShiftPacket, derive = true) {
  for (const r of p.rows) {
    r.count = String(r.image.length); r.imageDigest = compositeShiftHash(r.image); r.crtDigest = compositeShiftHash(r.crt);
    r.defectDigest = r.defect ? compositeShiftHash(r.defect) : null; r.witnessDigest = r.canonical ? compositeShiftHash(r.canonical) : null;
    const { rowDigest, ...body } = r; void rowDigest; r.rowDigest = compositeShiftHash(body);
  }
  p.rowsDigest = compositeShiftHash(p.rows); if (derive) p.summary = compositeShiftSummary(p.rows, p.status === "COMPLETE");
  p.contentDigest = compositeShiftHash({ inputs: p.inputs, rows: p.rows, rowsDigest: p.rowsDigest, summary: p.summary });
  for (let i = 0; i < 16; i++) {
    const { packetDigest, ...body } = p; void packetDigest; p.packetDigest = compositeShiftHash(body);
    const bytes = String(Buffer.byteLength(canonicalJson(p))); if (bytes === p.runtime.outputBytes) return p; p.runtime.outputBytes = bytes;
  }
  throw new Error("Output fixed point");
}
function python(code: string) { return spawnSync("python3", ["-I", "-S", "-B", "-c", `import runpy,json\nm=runpy.run_path('scripts/operations/composite-shift-replay.py')\ng=m['packet'].__globals__\n${code}`],
  { encoding: "utf8", timeout: 60000, maxBuffer: 2097152, env: { PATH: process.env.PATH ?? "/usr/bin:/bin", NODE_ENV: "test" } }); }
function pyPacket(code: string) { const r = python(code); expect(r.status).toBe(0); return JSON.parse(r.stdout) as CompositeShiftPacket; }

describe("TIP039 independent exact composite shifts and synchronized CRT", () => {
  beforeAll(() => {
    primary = compositeShiftPacketSchema.parse(compositeShiftPacket()); expect(verifyCompositeShiftPacket(primary)).toBe(true);
    const r = replayCompositeShift(primary); expect(r.status).toBe("PASS"); expect(verifyCompositeShiftPacket(r.replay)).toBe(true); replay = r.replay as CompositeShiftPacket;
  }, 60000);
  it("actual verified bytes agree on every provenance/factor/image/projection/minimum/H/order and C4", () => {
    expect(compareCompositeShiftReplay(primary, replay)).toBe("PASS"); expect(replay.rows).toHaveLength(11);
    expect(replay.contentDigest).toBe("ff01bdbd52abbb55e98ab912b2c201968cecb210a5fd6449725dd8804731831e");
    expect(replay.runtime).toMatchObject({ pairChecks: "1076", workSteps: "4413" });
    expect(replay.summary).toMatchObject({ complete: true, classificationCounts: { HIT: "0", LOCAL_3_OBSTRUCTION: "0", LOCAL_Q_OBSTRUCTION: "9",
      LOCAL_BOTH_OBSTRUCTION: "2", CRT_SYNCHRONIZATION_OBSTRUCTION: "0" }, C4: { status: "REFUTED", firstRefutation: { rowId: "r0", classification: "LOCAL_Q_OBSTRUCTION" } } });
    expect(replay.rows.filter(r => r.classification === "LOCAL_BOTH_OBSTRUCTION").map(r => r.id)).toEqual(["r5", "r11"]);
    expect(replay.rows.every(r => r.defect?.size === "1" && r.canonical === null && r.crt.modQ.canonicalPair === null)).toBe(true);
    expect(replay.rows[0].crt.mod3.canonicalPair).toEqual({ u: "1", v: "17", k: "2964989" });
    expect(replay.rows[0]).toMatchObject({ count: "27", crt: { mod3: { count: "2" }, modQ: { count: "27" }, productCount: "54" } });
  });

  it("fully rehashed scope/provenance/CRT/subgroup/order/mass/character/classification/canonical attacks reject", () => {
    const mutations: ((p: CompositeShiftPacket) => void)[] = [
      p => { (p.inputs as { multiplier: string }).multiplier = "7"; }, p => { (p.inputs as { blockers: unknown[] }).blockers.pop(); },
      p => { (p.inputs as { sourceContentDigest: string }).sourceContentDigest = "0".repeat(64); }, p => { p.scope = "forged" as never; },
      p => { p.rows[0].provenance.parentH = "7"; }, p => { p.rows[0].provenance.valuation = "2"; },
      p => { p.rows[0].provenance.parentFactors[0][1] = "2"; }, p => { p.rows[0].provenance.sourceResidue = "1"; },
      p => { p.rows[0].provenance.legendre = "+1" as never; }, p => { p.rows[0].p = "19"; }, p => { p.rows[0].q = "239"; },
      p => { p.rows[0].c = p.rows[0].q; }, p => { p.rows[0].T = "1"; }, p => { p.rows[0].factors[0][1] = "2"; },
      p => { p.rows[0].jacobi = "+1" as never; }, p => { p.rows[0].image.push(p.rows[0].c); },
      p => { p.rows[0].crt.modQ.modulus = "3"; }, p => { p.rows[0].crt.mod3.image = ["1"]; p.rows[0].crt.mod3.count = "1"; },
      p => { p.rows[0].crt.modQ.hit = true; }, p => { p.rows[0].crt.mod3.canonicalPair!.k = "1"; },
      p => { p.rows[0].crt.productCount = p.rows[0].count; }, p => { p.rows[0].classification = "HIT"; },
      p => { p.rows[0].involutions.pop(); }, p => { p.rows[0].involutions[1].modQ = "1"; },
      p => { p.rows[0].defect!.stabilizer.push("2"); p.rows[0].defect!.size = "2"; }, p => { p.rows[0].defect!.groupOrder = p.rows[0].q; },
      p => { p.rows[0].defect!.index = "3"; }, p => { p.rows[0].defect!.visibleMass = "1"; },
      p => { p.rows[0].defect!.visibleFactors[0].quotientOrder = "2"; }, p => { p.rows[0].defect!.involutionIntersection.push(p.rows[0].involutions[1].residue); },
      p => { p.rows[0].defect!.conditions.visibleMassBound = false; }, p => { p.rows[0].defect = null; },
      p => { p.rows.reverse(); },
    ];
    for (const mutate of mutations) { const p = structuredClone(primary); mutate(p); seal(p); expect(verifyCompositeShiftPacket(p)).toBe(false); }
  }, 30000);

  it("scoped validator alone does not certify complete images/minima; fresh full comparison rejects a plausible omission", () => {
    const p = structuredClone(primary), r = p.rows[0]; r.image.splice(1, 1);
    for (const projection of [r.crt.mod3, r.crt.modQ]) {
      projection.image = [...new Set(r.image.map(v => Number(v) % Number(projection.modulus)))].sort((a, b) => a - b).map(String);
      projection.count = String(projection.image.length);
    }
    r.crt.productCount = String(r.crt.mod3.image.length * r.crt.modQ.image.length);
    r.defect = compositeShiftDefect(r.factors, r.image, Number(r.c), Number(r.q)); seal(p);
    expect(verifyCompositeShiftPacket(p)).toBe(true); expect(compareCompositeShiftReplay(primary, p)).toBe("MISMATCH");
    const larger = structuredClone(primary); larger.rows[0].crt.mod3.canonicalPair = { u: "1", v: "29", k: "1738097" }; seal(larger);
    expect(verifyCompositeShiftPacket(larger)).toBe(true); expect(compareCompositeShiftReplay(primary, larger)).toBe("MISMATCH");
  });

  it("rehashed C4/fabricated strict tuple/imported prime parity clauses and successful over-budget receipts reject", () => {
    const noRef = structuredClone(primary); noRef.summary.C4 = { status: "NO_REFUTATION_IN_COMPUTED_ROWS", firstRefutation: null }; seal(noRef, false); expect(verifyCompositeShiftPacket(noRef)).toBe(false);
    const later = structuredClone(primary); later.summary.C4.firstRefutation!.rowId = "r1"; seal(later, false); expect(verifyCompositeShiftPacket(later)).toBe(false);
    const tuple = structuredClone(primary); tuple.rows[0].canonical = { u: "1", v: "17", k: "2964989", A: "1", x: "1", y: "2", z: "3" }; seal(tuple); expect(verifyCompositeShiftPacket(tuple)).toBe(false);
    const parity = structuredClone(primary); Object.assign(parity.rows[0].defect!.conditions, { indexTwoModFour: true }); seal(parity); expect(verifyCompositeShiftPacket(parity)).toBe(false);
    for (const elapsed of ["60000", "60001"]) { const p = structuredClone(primary); p.runtime.elapsedMs = elapsed; seal(p); expect(verifyCompositeShiftPacket(p)).toBe(false); }
    const work = structuredClone(primary); work.runtime.workSteps = "50000001"; seal(work); expect(verifyCompositeShiftPacket(work)).toBe(false);
    const pairs = structuredClone(replay); if ("pairChecks" in pairs.runtime) pairs.runtime.pairChecks = "50000001"; seal(pairs); expect(verifyCompositeShiftPacket(pairs)).toBe(false);
    const states = structuredClone(primary); if ("stateInsertions" in states.runtime) states.runtime.stateInsertions = "2000001"; seal(states); expect(verifyCompositeShiftPacket(states)).toBe(false);
  }, 30000);

  it("abstract c15 controls: both projected targets may hit without joint hit; evenH/index2 allowed, not campaign data", () => {
    const out = python("b=g['Budget']()\nimage,best=g['image_pairs'](4,15,5,b)\nd=g['generic_defect']([(2,2)],image,15,5,b)\nimage7=[1,4,7,13]\nd7=g['generic_defect']([(7,2)],image7,15,5,b)\nprint(json.dumps([image,best,d,d7]))");
    expect(out.status).toBe(0); const [image, best, d, d7] = JSON.parse(out.stdout);
    expect(image).toEqual([1, 2, 4, 8]); expect(best).toEqual({ joint: null, local3: { u: "1", v: "2", k: "2" }, localQ: { u: "1", v: "4", k: "1" } });
    expect(d).toMatchObject({ stabilizer: ["1", "2", "4", "8"], size: "4", index: "2", visibleMass: "0", involutionIntersection: ["1", "4"] });
    expect(d7).toMatchObject({ stabilizer: ["1", "4", "7", "13"], size: "4", index: "2", visibleMass: "0" });
    expect(compositeShiftDefect([["2", "2"]], image.map(String), 15, 5)).toEqual(d);
    expect(compositeShiftDefect([["7", "2"]], ["1", "4", "7", "13"], 15, 5)).toEqual(d7);
    expect(compositeShiftInvolutions(5)).toEqual([{ residue: "1", mod3: "1", modQ: "1" }, { residue: "4", mod3: "1", modQ: "4" },
      { residue: "11", mod3: "2", modQ: "1" }, { residue: "14", mod3: "2", modQ: "4" }]);
    const character = python("b=g['Budget']()\nprint(json.dumps([g['legendre'](7,3,b)*g['legendre'](7,5,b),g['power'](7,4,15,b)]))");
    expect(character.status).toBe(0); expect(JSON.parse(character.stdout)).toEqual([-1, 1]);
    // Euler exponent phi(c)/2 is not the Jacobi character in a composite unit group.
    // These abstract controls do not authorize an additional discovery row or asserted root witness.
  });

  it("BigInt products stay exact for declared large composite groups without adding experiment inputs", () => {
    const c = 19714971, r = c - 2, exponent = 12345;
    let expected = BigInt(1); for (let i = 0; i < exponent; i++) expected = expected * BigInt(r) % BigInt(c);
    expect(compositeShiftPow(r, exponent, c)).toBe(Number(expected));
  });

  it("primary and independent caps retain atomicROW pending and cannotPASS; forged pending rejected", () => {
    for (const options of [{ maxRows: 1 }, { maxStateInsertions: 1 }, { maxWorkSteps: 1 }]) {
      const p = compositeShiftPacket(options); expect(verifyCompositeShiftPacket(p)).toBe(true); expect(replayCompositeShift(p).status).toBe("PARTIAL"); expect(p.summary.complete).toBe(false);
    }
    const wrong = compositeShiftPacketSchema.parse(compositeShiftPacket({ maxRows: 1 })); wrong.pending = { phase: "ROW", recordId: "r13" }; seal(wrong); expect(verifyCompositeShiftPacket(wrong)).toBe(false);
    for (const args of ["pair_limit=0", "work_limit=0"]) {
      const p = pyPacket(`p=m['packet'](${args})\nprint(m['compact'](p),end='')`); expect(p.status).toBe("PARTIAL"); expect(p.pending).toEqual({ phase: "ROW", recordId: "r0" });
      expect(verifyCompositeShiftPacket(p)).toBe(true); expect(compareCompositeShiftReplay(primary, p)).toBe("PARTIAL");
    }
  });

  it("first/internal/midpoint/finalROW and FINALIZE time limits preserve exact completed prefix", () => {
    for (const condition of ["self.pending.get('recordId')=='r0'", "self.pending.get('recordId')=='r5'", "self.pending.get('recordId')=='r13'", "self.pending.get('phase')=='FINALIZE'"]) {
      const p = pyPacket(`original=g['Budget'].check\ndef check(self):\n    if ${condition}: raise g['Stop']('REPLAY_TIME_LIMIT')\n    original(self)\ng['Budget'].check=check\np=m['packet']()\nprint(m['compact'](p),end='')`);
      expect(p.status).toBe("PARTIAL"); expect(verifyCompositeShiftPacket(p)).toBe(true); expect(compareCompositeShiftReplay(primary, p)).toBe("PARTIAL");
      if (condition.includes("FINALIZE")) expect(p.rows).toHaveLength(11);
    }
    const internal = pyPacket("original=g['Budget'].pair\ndef pair(self):\n    if self.pairs==50: raise g['Stop']('REPLAY_TIME_LIMIT')\n    original(self)\ng['Budget'].pair=pair\np=m['packet']()\nprint(m['compact'](p),end='')");
    expect(verifyCompositeShiftPacket(internal)).toBe(true); expect(internal.rows).toHaveLength(0); expect(internal.pending).toEqual({ phase: "ROW", recordId: "r0" });
  }, 30000);

  it("constructor/stdout serialization expiry and bounded output prefix/head failure remain failclosed", () => {
    const late = pyPacket("clock=[0.0]\noriginal=g['compact']\ndef compact(v):\n    if isinstance(v,dict) and v.get('packetDigest') and v.get('status')=='COMPLETE': clock[0]=61.0\n    return original(v)\ng['compact']=compact\np=m['packet'](clock=lambda:clock[0])\nprint(original(p),end='')");
    expect(late).toMatchObject({ status: "PARTIAL", reason: "REPLAY_TIME_LIMIT", pending: { phase: "FINALIZE" } }); expect(verifyCompositeShiftPacket(late)).toBe(true);
    const stdout = pyPacket("clock=[0.0]\nreturned=[False]\noriginal_packet=g['packet']\noriginal_compact=g['compact']\ndef packet(clock):\n    p=original_packet(clock=clock)\n    returned[0]=True\n    return p\ndef compact(v):\n    if returned[0]: clock[0]=61.0\n    return original_compact(v)\ng['packet']=packet\ng['compact']=compact\ng['time'].monotonic=lambda:clock[0]\ng['main']()");
    expect(stdout.status).toBe("PARTIAL"); expect(verifyCompositeShiftPacket(stdout)).toBe(true);
    const small = pyPacket("g['MAX_OUTPUT']=10000\np=m['packet']()\nprint(m['compact'](p),end='')");
    expect(small.status).toBe("PARTIAL"); expect(verifyCompositeShiftPacket(small)).toBe(true); expect(Number(small.runtime.outputBytes)).toBeLessThanOrEqual(10000);
    const head = python("g['MAX_OUTPUT']=10\nm['packet']()"); expect(head.status).not.toBe(0); expect(head.stdout).toBe("");
    const args = spawnSync("python3", ["-I", "-S", "-B", "scripts/operations/composite-shift-replay.py", "--arbitrary"], { encoding: "utf8" });
    expect(args.status).not.toBe(0); expect(args.stdout).toBe("");
  }, 30000);

  it("mocked arithmetic contradiction retains full offending hashed row and exits1, never normal admission", () => {
    const out = python("original=g['generic_defect']\ndef bad(fs,image,c,q,b):\n    d=original(fs,image,c,q,b)\n    d['conditions']['visibleMassBound']=False\n    return d\ng['generic_defect']=bad\ng['main']()");
    expect(out.status).toBe(1); const r = JSON.parse(out.stdout); expect(r).toMatchObject({ status: "INVESTIGATION", reason: "COMPOSITE_ARITHMETIC_CONTRADICTION" });
    expect(r.row.rowDigest).toMatch(/^[a-f0-9]{64}$/); expect(verifyCompositeShiftPacket(r)).toBe(false);
  });

  it("source drift/missingIO, isolatedfixedbytes/environment and process/output/parser faults never fabricate verified receipts", () => {
    const source = readFileSync("scripts/operations/composite-shift-replay.py"), file = vi.mocked(readFileSync), child = vi.mocked(spawnSync); child.mockClear();
    try {
      file.mockReturnValueOnce(Buffer.concat([source, Buffer.from("\n# drift\n")])); const drift = replayCompositeShift(primary);
      expect(drift).toMatchObject({ status: "UNAVAILABLE", reason: "SOURCE_PIN_MISMATCH", expectedScriptDigest: COMPOSITE_SHIFT_REPLAY_SHA256, verifiedScriptDigest: null });
      expect(drift.observedScriptDigest).not.toBe(drift.expectedScriptDigest); expect(child).not.toHaveBeenCalled();
      file.mockImplementationOnce(() => { throw new Error("ENOENT"); }); expect(replayCompositeShift(primary)).toMatchObject({ status: "UNAVAILABLE", observedScriptDigest: null, verifiedScriptDigest: null });
      child.mockImplementation((...args) => { expect(args[0]).toBe("python3"); expect(args[1]).toEqual(["-I", "-S", "-B", "-c", source.toString("utf8")]);
        expect(Object.keys((args[2] as { env: object }).env).sort()).toEqual(["NODE_ENV", "PATH", "PYTHONDONTWRITEBYTECODE"]);
        return { error: new Error("ENOENT"), status: null, stdout: "", output: [], pid: 0 } as never; }); expect(replayCompositeShift(primary).status).toBe("UNAVAILABLE");
      child.mockReturnValue({ error: new Error("ETIMEDOUT"), status: null, stdout: "", output: [], pid: 0 } as never); expect(replayCompositeShift(primary).status).toBe("UNAVAILABLE");
      child.mockReturnValue({ status: 0, stdout: "x".repeat(2097153), output: [], pid: 0 } as never); expect(replayCompositeShift(primary)).toMatchObject({ status: "UNAVAILABLE", reason: "REPLAY_OUTPUT_LIMIT" });
      child.mockReturnValue({ status: 0, stdout: "invalid", output: [], pid: 0 } as never); expect(replayCompositeShift(primary)).toMatchObject({ status: "MISMATCH", reason: "REPLAY_JSON_INVALID" });
      child.mockReturnValue({ status: 0, stdout: "{}", output: [], pid: 0 } as never); expect(replayCompositeShift(primary)).toMatchObject({ status: "MISMATCH", reason: "REPLAY_INVARIANT_INVALID" });
    } finally { file.mockReset(); child.mockReset(); }
  });

  it("final receipt cannotPASS after childCOMPLETE and fullcomparison consumes observed deadline", () => {
    const child = vi.mocked(spawnSync), clock = vi.mocked(performance.now), ticks = [0, 0, 59999, 60000];
    try { child.mockReturnValue({ status: 0, stdout: canonicalJson(replay), output: [], pid: 0 } as never); clock.mockImplementation(() => ticks.shift() ?? 60000);
      expect(replayCompositeShift(primary)).toMatchObject({ status: "UNAVAILABLE", reason: "WRAPPER_TIME_LIMIT", elapsedMs: 60000 }); expect(ticks).toHaveLength(0);
    } finally { child.mockReset(); clock.mockReset(); }
  });
});
