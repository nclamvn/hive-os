import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { performance } from "node:perf_hooks";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { sufficientCoveragePacket, analyzeCoverageAbstract } from "../../scripts/operations/sufficient-coverage";
import { sufficientCoverageHash, sufficientCoveragePacketSchema, sufficientCoverageSummary, sufficientCoveragePow,
  verifySufficientCoverageAbstractAllocation, compareSufficientCoverageReplay, verifySufficientCoveragePacket, type SufficientCoveragePacket } from "../../scripts/operations/sufficient-coverage-check";
import { SUFFICIENT_COVERAGE_REPLAY_SHA256, replaySufficientCoverage } from "../../scripts/operations/sufficient-coverage-replay";
vi.mock("node:child_process", { spy: true }); vi.mock("node:fs", { spy: true });
vi.mock("node:perf_hooks", async importOriginal => {
  const actual = await importOriginal<typeof import("node:perf_hooks")>();
  return { ...actual, performance: { now: vi.fn(() => actual.performance.now()) } };
});
let primary: SufficientCoveragePacket, replay: SufficientCoveragePacket;
type Row = SufficientCoveragePacket["rows"][number];
function sealRow(row: Row) {
  for (const s of row.chain.stages) { const { stageDigest, ...body } = s; void stageDigest; s.stageDigest = sufficientCoverageHash(body); }
  for (const a of row.attempts) { const { attemptDigest, ...body } = a; void attemptDigest; a.attemptDigest = sufficientCoverageHash(body); }
  const { rowDigest, ...body } = row; void rowDigest; row.rowDigest = sufficientCoverageHash(body); return row;
}
function seal(p: SufficientCoveragePacket, derive = true) {
  p.rows.forEach(sealRow); p.rowsDigest = sufficientCoverageHash(p.rows); if (derive) p.summary = sufficientCoverageSummary(p.rows, p.status === "COMPLETE");
  p.contentDigest = sufficientCoverageHash({ inputs: p.inputs, rows: p.rows, rowsDigest: p.rowsDigest, summary: p.summary });
  for (let i = 0; i < 16; i++) {
    const { packetDigest, ...body } = p; void packetDigest; p.packetDigest = sufficientCoverageHash(body);
    const bytes = String(Buffer.byteLength(canonicalJson(p))); if (bytes === p.runtime.outputBytes) return p; p.runtime.outputBytes = bytes;
  } throw new Error("Output fixed point");
}
function python(code: string) { return spawnSync("python3", ["-I", "-S", "-B", "-c", `import runpy,json,math\nm=runpy.run_path('scripts/operations/sufficient-coverage-replay.py')\ng=m['packet'].__globals__\n${code}`],
  { encoding: "utf8", timeout: 60000, maxBuffer: 2097152, env: { PATH: process.env.PATH ?? "/usr/bin:/bin", NODE_ENV: "test" } }); }
function pyPacket(code: string) { const r = python(code); expect(r.status).toBe(0); return JSON.parse(r.stdout) as SufficientCoveragePacket; }
function controlRow(m: number, fs: [string, string][]) {
  const out = python(`fs=${JSON.stringify(fs)}\nfs=[(int(q),int(e)) for q,e in fs]\nT=math.prod(q**e for q,e in fs)\nmod=${m}\nM=mod-1 if g['prime'](mod) else 2*(mod//3-1)\np=4*T-mod\nresult=g['coverage'](fs,p,mod,M,T,g['Budget']())\nr={'id':'P0_h${m}','p':str(p),'m':str(mod),'T':str(T),'groupOrder':str(M),'factors':[[str(q),str(e)] for q,e in fs],**result}\nr['rowDigest']=g['digest'](r)\nprint(g['compact'](r),end='')`);
  expect(out.status).toBe(0); return JSON.parse(out.stdout) as Row;
}

describe("TIP040 independent sufficient subgroup and quotient collision certificates", () => {
  beforeAll(() => {
    primary = sufficientCoveragePacketSchema.parse(sufficientCoveragePacket()); expect(verifySufficientCoveragePacket(primary)).toBe(true);
    const r = replaySufficientCoverage(primary); expect(r.status).toBe("PASS"); replay = r.replay as SufficientCoveragePacket;
  }, 60000);
  it("fresh exact source agrees on all71 factors/chains/half frequencies/allocations and constructive strict tuples", () => {
    expect(compareSufficientCoverageReplay(primary, replay)).toBe("PASS"); expect(primary.rows).toHaveLength(71);
    expect(primary.contentDigest).toBe("48b455470ecb38da669d372206841a65fbc34facb0b684763a01b3df5d96fa72");
    expect(primary.summary).toMatchObject({ complete: true, counts: { CHAIN_CERTIFIED: "4", ENERGY_CERTIFIED: "0", NOT_CERTIFIED: "67" } });
    expect(primary.rows.filter(r => r.certificate).map(r => r.id)).toEqual(["P0_h3", "P1_h3", "P1_h31", "P2_h3"]);
    expect(replay.runtime).toMatchObject({ pairChecks: "40399", stateInsertions: "7068", workSteps: "14615" });
    const r = primary.rows.find(r => r.id === "P1_h31")!; expect(r.chain.covered).toHaveLength(10);
    expect(r.certificate).toMatchObject({ kind: "CHAIN", exponents: ["-7", "-1"], witness: { u: "1", v: "50150528", k: "1", x: "50150528", y: "324525821956479", z: "16275141320751414870912" } });
  });

  it("fully rehashed scope/root/source/factor/chain/order/unsaturatedK/overlap/energy/rounding/coset/status attacks failclosed", () => {
    const mutations: ((p: SufficientCoveragePacket) => void)[] = [
      p => { (p.inputs as { policy: string }).policy = "freeH"; }, p => { (p.inputs as { rows: unknown[] }).rows.pop(); },
      p => { (p.inputs as { sourceContentDigests: { TIP037: string } }).sourceContentDigests.TIP037 = "0".repeat(64); }, p => { p.scope = "forged" as never; },
      p => { p.rows[0].p = "17"; }, p => { p.rows[0].m = "7"; }, p => { p.rows[0].T = "1"; }, p => { p.rows[0].groupOrder = "1"; },
      p => { p.rows[0].factors[0][1] = "2"; }, p => { p.rows[0].chain.stages[0].relativeOrder = "1"; },
      p => { p.rows[0].chain.stages[0].factorIndex = "1"; }, p => { p.rows[0].chain.stages[0].previousCoveredDigest = "0".repeat(64); },
      p => { p.rows[0].chain.stages[0].covered.pop(); }, p => { p.rows[0].chain.stages[0].covered[0].exponents[0] = "2"; },
      p => { p.rows[0].chain.consumed.push("0"); }, p => { p.rows[0].chain.unused = ["0"]; },
      p => { p.rows[1].chain.covered = [{ residue: "1", exponents: ["0", "0"] }, { residue: "6", exponents: ["1", "1"] }]; },
      p => { p.rows[2].attempts[0].A.factorIndices = p.rows[2].attempts[0].B.factorIndices; },
      p => { p.rows[2].attempts[0].B.factorIndices = ["0"]; }, p => { p.rows[2].attempts[0].mask = "2"; },
      p => { p.rows[2].attempts[0].A.N = "1"; }, p => { p.rows[2].attempts[0].A.E = "1"; }, p => { p.rows[2].attempts[0].A.L = "1"; },
      p => { p.rows[2].attempts[0].A.frequencies[0].mu = "2"; }, p => { p.rows[2].attempts[0].A.frequencies[0].coset = "2"; },
      p => { p.rows[2].attempts[0].A.frequencies[0].residue = "2"; }, p => { p.rows[2].attempts[0].A.frequencies[0].u = "2"; },
      p => { p.rows[2].attempts[0].quotientOrder = "1"; }, p => { p.rows[2].attempts[0].sufficient = true; },
      p => { p.rows[2].allocation.notEvaluatedPartitions = "99"; }, p => { p.rows[2].status = "MISS" as never; },
      p => { p.rows[2].status = "ENERGY_CERTIFIED"; }, p => { p.rows[0].certificate!.orientation = "INVERTED"; },
      p => { p.rows[0].certificate!.exponents[0] = "1"; }, p => { p.rows[0].certificate!.witness.y = "1"; },
      p => { p.rows.reverse(); },
    ];
    for (const mutate of mutations) { const p = structuredClone(primary); mutate(p); seal(p); expect(verifySufficientCoveragePacket(p)).toBe(false); }
  }, 30000);

  it("scoped frequency proof identities alone are not multiplicity/canonicality authority: coherent forgery freshMISMATCH", () => {
    const p = structuredClone(primary), half = p.rows.find(r => r.id === "P0_h11")!.attempts[0].B;
    half.frequencies[1].mu = "1"; half.frequencies[2].mu = "3";
    const E = half.frequencies.reduce((e, f) => e + BigInt(f.mu) ** BigInt(2), BigInt(0)), N = BigInt(half.N);
    half.E = String(E); half.L = String((N * N + E - BigInt(1)) / E); seal(p);
    expect(verifySufficientCoveragePacket(p)).toBe(true); expect(compareSufficientCoverageReplay(primary, p)).toBe("MISMATCH"); expect(replaySufficientCoverage(p).status).toBe("MISMATCH");
  }, 30000);

  it("abstract positiveENERGY and nontrivial quotient lifts exercise shared verifier, never root/campaign admission", () => {
    for (const [m, fs] of [[7, [["3", "2"], ["5", "1"]]], [31, [["2", "2"], ["3", "1"], ["13", "2"]]],
      [19, [["2", "1"], ["7", "1"], ["59", "1"], ["97", "1"]]]] as [number, [string, string][]][]) {
      const row = controlRow(m, fs); expect(row.status).toBe("ENERGY_CERTIFIED"); expect(verifySufficientCoverageAbstractAllocation(row)).toBe(true);
      const { witness, ...core } = row.certificate!; void witness;
      expect({ ...row, certificate: core }).toMatchObject(analyzeCoverageAbstract(m, fs));
      if (row.certificate?.kind === "ENERGY") {
        const bad = structuredClone(row); if (bad.certificate?.kind === "ENERGY") bad.certificate.match.liftResidue = "1";
        if (row.certificate.match.liftResidue !== "1") expect(verifySufficientCoverageAbstractAllocation(sealRow(bad))).toBe(false);
        const overlap = structuredClone(row); overlap.attempts[overlap.attempts.length - 1].A.factorIndices = overlap.chain.consumed;
        expect(verifySufficientCoverageAbstractAllocation(sealRow(overlap))).toBe(false);
      }
      const inserted = structuredClone(primary); inserted.rows[0] = row; seal(inserted); expect(verifySufficientCoveragePacket(inserted)).toBe(false);
      // This seam verifies group allocation only; it intentionally does NOT verify root witness fields.
      const fakeWitness = structuredClone(row); fakeWitness.certificate!.witness.x = "1"; expect(verifySufficientCoverageAbstractAllocation(sealRow(fakeWitness))).toBe(true);
    }
  }, 30000);

  it("failure of sufficient criteria never impliesMISS; strictdensity equality and composite evenK controls", () => {
    const knownHit = controlRow(11, [["2", "1"], ["5", "1"]]); expect(knownHit.status).toBe("NOT_CERTIFIED"); expect(verifySufficientCoverageAbstractAllocation(knownHit)).toBe(true);
    const boundary = controlRow(7, [["3", "1"], ["17", "1"]]); expect(boundary.status).toBe("NOT_CERTIFIED");
    expect(boundary.attempts[0]).toMatchObject({ sufficient: false, quotientOrder: "6", A: { L: "3" }, B: { L: "3" } });
    const weak = structuredClone(boundary); weak.attempts[0].sufficient = true; expect(verifySufficientCoverageAbstractAllocation(sealRow(weak))).toBe(false);
    const even = controlRow(15, [["7", "2"]]); expect(even.status).toBe("NOT_CERTIFIED"); expect(even.chain.covered.map(k => k.residue)).toEqual(["1", "4", "7", "13"]);
    expect(verifySufficientCoverageAbstractAllocation(even)).toBe(true); expect(even.chain.covered.some(k => k.residue === "14")).toBe(false);
    const proof = python("v,o,w=g['normalize_witness'](29,11,10,[(2,1),(5,1)],[-1,-1])\nprint(json.dumps(w))"); expect(proof.status).toBe(0);
    expect(JSON.parse(proof.stdout)).toMatchObject({ u: "1", v: "10", x: "10", y: "29", z: "290" });
  });

  it("rehashed summary/resource limits and lateCOMPLETE receipts fail; BigInt products remain exact", () => {
    const p = structuredClone(primary); p.summary.counts.NOT_CERTIFIED = "0"; seal(p, false); expect(verifySufficientCoveragePacket(p)).toBe(false);
    for (const [key, value] of [["elapsedMs", "60000"], ["workSteps", "50000001"], ["stateInsertions", "2000001"], ["pairChecks", "50000001"]]) {
      const r = structuredClone(replay); Object.assign(r.runtime, { [key]: value }); seal(r); expect(verifySufficientCoveragePacket(r)).toBe(false);
    }
    const m = 25075263, r = m - 2, exponent = 12345; let expected = BigInt(1);
    for (let i = 0; i < exponent; i++) expected = expected * BigInt(r) % BigInt(m);
    expect(sufficientCoveragePow(r, exponent, m)).toBe(Number(expected));
  }, 30000);

  it("state/work/pair/row caps retain exact atomic ordered prefix and cannotPASS; forged pending rejected", () => {
    for (const options of [{ maxRows: 1 }, { maxStateInsertions: 1 }, { maxWorkSteps: 1 }]) {
      const p = sufficientCoveragePacket(options); expect(verifySufficientCoveragePacket(p)).toBe(true); expect(replaySufficientCoverage(p).status).toBe("PARTIAL"); expect(p.summary.complete).toBe(false);
    }
    const wrong = sufficientCoveragePacketSchema.parse(sufficientCoveragePacket({ maxRows: 1 })); wrong.pending = { phase: "ROW", id: "C_r13" }; seal(wrong); expect(verifySufficientCoveragePacket(wrong)).toBe(false);
    for (const args of ["pair_limit=0", "work_limit=0", "state_limit=0"]) {
      const p = pyPacket(`p=m['packet'](${args})\nprint(m['compact'](p),end='')`); expect(p.status).toBe("PARTIAL"); expect(verifySufficientCoveragePacket(p)).toBe(true);
      expect(compareSufficientCoverageReplay(primary, p)).toBe("PARTIAL");
    }
  });

  it("first/internal/midpoint/finalROW and FINALIZE expiry retains exact completed prefix", () => {
    for (const condition of ["self.pending.get('id')=='P0_h3'", "self.pending.get('id')=='P1_h31'", "self.pending.get('id')=='C_r13'", "self.pending.get('phase')=='FINALIZE'"]) {
      const p = pyPacket(`original=g['Budget'].check\ndef check(self):\n    if ${condition}: raise g['Stop']('REPLAY_TIME_LIMIT')\n    original(self)\ng['Budget'].check=check\np=m['packet']()\nprint(m['compact'](p),end='')`);
      expect(p.status).toBe("PARTIAL"); expect(verifySufficientCoveragePacket(p)).toBe(true); expect(compareSufficientCoverageReplay(primary, p)).toBe("PARTIAL");
      if (condition.includes("FINALIZE")) expect(p.rows).toHaveLength(71);
    }
    const inside = pyPacket("original=g['Budget'].pair\ndef pair(self):\n    if self.pairs==50: raise g['Stop']('REPLAY_TIME_LIMIT')\n    original(self)\ng['Budget'].pair=pair\np=m['packet']()\nprint(m['compact'](p),end='')");
    expect(verifySufficientCoveragePacket(inside)).toBe(true); expect(inside.pending).toEqual({ phase: "ROW", id: "P0_h11" }); expect(inside.rows).toHaveLength(2);
  }, 30000);

  it("constructor/stdout serialization expiry and outputprefix/head limits failclosed", () => {
    const late = pyPacket("clock=[0.0]\noriginal=g['compact']\ndef compact(v):\n    if isinstance(v,dict) and v.get('packetDigest') and v.get('status')=='COMPLETE': clock[0]=61.0\n    return original(v)\ng['compact']=compact\np=m['packet'](clock=lambda:clock[0])\nprint(original(p),end='')");
    expect(late).toMatchObject({ status: "PARTIAL", reason: "REPLAY_TIME_LIMIT", pending: { phase: "FINALIZE" } }); expect(verifySufficientCoveragePacket(late)).toBe(true);
    const stdout = pyPacket("clock=[0.0]\nreturned=[False]\noriginal_packet=g['packet']\noriginal_compact=g['compact']\ndef packet(clock):\n    p=original_packet(clock=clock)\n    returned[0]=True\n    return p\ndef compact(v):\n    if returned[0]: clock[0]=61.0\n    return original_compact(v)\ng['packet']=packet\ng['compact']=compact\ng['time'].monotonic=lambda:clock[0]\ng['main']()");
    expect(stdout.status).toBe("PARTIAL"); expect(verifySufficientCoveragePacket(stdout)).toBe(true);
    const small = pyPacket("g['MAX_OUTPUT']=16384\np=m['packet']()\nprint(m['compact'](p),end='')"); expect(small.status).toBe("PARTIAL");
    expect(verifySufficientCoveragePacket(small)).toBe(true); expect(Number(small.runtime.outputBytes)).toBeLessThanOrEqual(16384);
    const head = python("g['MAX_OUTPUT']=10\nm['packet']()"); expect(head.status).not.toBe(0); expect(head.stdout).toBe("");
  }, 30000);

  it("mocked contradiction retains complete hashed offending row and exits1, not proof/refutation admission", () => {
    const out = python("g['assert_candidate']=lambda row:False\ng['main']()"); expect(out.status).toBe(1); const d = JSON.parse(out.stdout);
    expect(d).toMatchObject({ status: "INVESTIGATION", reason: "COVERAGE_ARITHMETIC_CONTRADICTION" }); expect(d.row.rowDigest).toMatch(/^[a-f0-9]{64}$/); expect(verifySufficientCoveragePacket(d)).toBe(false);
  });

  it("source drift/missingIO and exact isolatedbytes/env plus process/output/JSON failures never fabricate verification", () => {
    const source = readFileSync("scripts/operations/sufficient-coverage-replay.py"), file = vi.mocked(readFileSync), child = vi.mocked(spawnSync); child.mockClear();
    try {
      file.mockReturnValueOnce(Buffer.concat([source, Buffer.from("\n# drift\n")])); const drift = replaySufficientCoverage(primary);
      expect(drift).toMatchObject({ status: "UNAVAILABLE", expectedScriptDigest: SUFFICIENT_COVERAGE_REPLAY_SHA256, verifiedScriptDigest: null });
      expect(drift.observedScriptDigest).not.toBe(drift.expectedScriptDigest); expect(child).not.toHaveBeenCalled();
      file.mockImplementationOnce(() => { throw new Error("ENOENT"); }); expect(replaySufficientCoverage(primary)).toMatchObject({ status: "UNAVAILABLE", observedScriptDigest: null });
      child.mockImplementation((...args) => { expect(args[0]).toBe("python3"); expect(args[1]).toEqual(["-I", "-S", "-B", "-c", source.toString("utf8")]);
        expect(Object.keys((args[2] as { env: object }).env).sort()).toEqual(["NODE_ENV", "PATH", "PYTHONDONTWRITEBYTECODE"]);
        return { error: new Error("ENOENT"), status: null, stdout: "", output: [], pid: 0 } as never; }); expect(replaySufficientCoverage(primary).status).toBe("UNAVAILABLE");
      child.mockReturnValue({ error: new Error("ETIMEDOUT"), status: null, stdout: "", output: [], pid: 0 } as never); expect(replaySufficientCoverage(primary).status).toBe("UNAVAILABLE");
      child.mockReturnValue({ status: 0, stdout: "x".repeat(2097153), output: [], pid: 0 } as never); expect(replaySufficientCoverage(primary)).toMatchObject({ status: "UNAVAILABLE", reason: "REPLAY_OUTPUT_LIMIT" });
      child.mockReturnValue({ status: 0, stdout: "invalid", output: [], pid: 0 } as never); expect(replaySufficientCoverage(primary)).toMatchObject({ status: "MISMATCH", reason: "REPLAY_JSON_INVALID" });
      child.mockReturnValue({ status: 0, stdout: "{}", output: [], pid: 0 } as never); expect(replaySufficientCoverage(primary)).toMatchObject({ status: "MISMATCH", reason: "REPLAY_INVARIANT_INVALID" });
    } finally { file.mockReset(); child.mockReset(); }
  }, 30000);

  it("last observed receipt deadline cannotPASS after childCOMPLETE and semantic comparison", () => {
    const child = vi.mocked(spawnSync), clock = vi.mocked(performance.now), ticks = [0, 0, 59999, 60000];
    try { child.mockReturnValue({ status: 0, stdout: canonicalJson(replay), output: [], pid: 0 } as never); clock.mockImplementation(() => ticks.shift() ?? 60000);
      expect(replaySufficientCoverage(primary)).toMatchObject({ status: "UNAVAILABLE", reason: "WRAPPER_TIME_LIMIT", elapsedMs: 60000 }); expect(ticks).toHaveLength(0);
    } finally { child.mockReset(); clock.mockReset(); }
  });
});
