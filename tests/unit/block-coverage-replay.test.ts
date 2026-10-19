import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { performance } from "node:perf_hooks";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { blockCoveragePacket, analyzeBlockCoverageAbstract, analyzeBlockCriterionAbstract } from "../../scripts/operations/block-coverage";
import { blockCoverageHash, blockCoveragePacketSchema, blockCoverageSummary, blockCoveragePow,
  verifyBlockCoverageAbstractAllocation, verifyBlockCoverageAbstractCriterion, compareBlockCoverageReplay, verifyBlockCoveragePacket, type BlockCoveragePacket } from "../../scripts/operations/block-coverage-check";
import { BLOCK_COVERAGE_REPLAY_SHA256, replayBlockCoverage } from "../../scripts/operations/block-coverage-replay";
vi.mock("node:child_process", { spy: true }); vi.mock("node:fs", { spy: true });
vi.mock("node:perf_hooks", async importOriginal => {
  const actual = await importOriginal<typeof import("node:perf_hooks")>();
  return { ...actual, performance: { now: vi.fn(() => actual.performance.now()) } };
});
let primary: BlockCoveragePacket, replay: BlockCoveragePacket;
type Row = BlockCoveragePacket["rows"][number];
function sealRow(row: Row) {
  for (const s of row.chain.stages) { const { stageDigest, ...body } = s; void stageDigest; s.stageDigest = blockCoverageHash(body); }
  for (const a of row.chain.blockAttempts) { const {attemptDigest, ...body} = a; void attemptDigest; a.attemptDigest = blockCoverageHash(body); }
  for (const a of row.attempts) { const { attemptDigest, ...body } = a; void attemptDigest; a.attemptDigest = blockCoverageHash(body); }
  const { rowDigest, ...body } = row; void rowDigest; row.rowDigest = blockCoverageHash(body); return row;
}
function individual(p: BlockCoveragePacket) { return p.rows[0].chain.stages.find(s => s.kind === "INDIVIDUAL")!; }
function energy(p: BlockCoveragePacket) { return p.rows.find(r => r.id === "P0_h47")!; }
function seal(p: BlockCoveragePacket, derive = true) {
  p.rows.forEach(sealRow); p.rowsDigest = blockCoverageHash(p.rows); if (derive) p.summary = blockCoverageSummary(p.rows, p.status === "COMPLETE");
  p.contentDigest = blockCoverageHash({ inputs: p.inputs, rows: p.rows, rowsDigest: p.rowsDigest, summary: p.summary });
  for (let i = 0; i < 16; i++) {
    const { packetDigest, ...body } = p; void packetDigest; p.packetDigest = blockCoverageHash(body);
    const bytes = String(Buffer.byteLength(canonicalJson(p))); if (bytes === p.runtime.outputBytes) return p; p.runtime.outputBytes = bytes;
  } throw new Error("Output fixed point");
}
function python(code: string) { return spawnSync("python3", ["-I", "-S", "-B", "-c", `import runpy,json,math\nm=runpy.run_path('scripts/operations/block-coverage-replay.py')\ng=m['packet'].__globals__\n${code}`],
  { encoding: "utf8", timeout: 60000, maxBuffer: 8388608, env: { PATH: process.env.PATH ?? "/usr/bin:/bin", NODE_ENV: "test" } }); }
function pyPacket(code: string) { const r = python(code); expect(r.status).toBe(0); return JSON.parse(r.stdout) as BlockCoveragePacket; }
function controlRow(m: number, fs: [string, string][]) {
  const out = python(`fs=${JSON.stringify(fs)}\nfs=[(int(q),int(e)) for q,e in fs]\nT=math.prod(q**e for q,e in fs)\nmod=${m}\nM=mod-1 if g['prime'](mod) else 2*(mod//3-1)\np=4*T-mod\nresult=g['coverage'](fs,p,mod,M,T,g['Budget']())\nr={'id':'P0_h${m}','p':str(p),'m':str(mod),'T':str(T),'groupOrder':str(M),'factors':[[str(q),str(e)] for q,e in fs],**result}\nr['rowDigest']=g['digest'](r)\nprint(g['compact'](r),end='')`);
  expect(out.status).toBe(0); return JSON.parse(out.stdout) as Row;
}

describe("TIP041 independent sufficient subgroup and quotient collision certificates", () => {
  beforeAll(() => {
    primary = blockCoveragePacketSchema.parse(blockCoveragePacket()); expect(verifyBlockCoveragePacket(primary)).toBe(true);
    const r = replayBlockCoverage(primary); expect(r.status).toBe("PASS"); replay = r.replay as BlockCoveragePacket;
  }, 60000);
  it("fresh exact source agrees on all191 factors/chains/half frequencies/allocations and constructive strict tuples", () => {
    expect(compareBlockCoverageReplay(primary, replay)).toBe("PASS"); expect(primary.rows).toHaveLength(191);
    expect(primary.contentDigest).toBe("4d00cb143ae028bcda5f636df617c049ed4d006bcd54bed3f585c1c58e048347");
    expect(primary.summary).toMatchObject({ complete: true, counts: { SINGLE_CHAIN_CERTIFIED: "25", BLOCK_CHAIN_CERTIFIED: "8", ENERGY_CERTIFIED: "2", NOT_CERTIFIED: "156" } });
    expect(primary.rows.filter(r => r.certificate)).toHaveLength(35); expect(primary.summary.cohorts.EXPOSED_71).toMatchObject({SINGLE_CHAIN_CERTIFIED:"4",BLOCK_CHAIN_CERTIFIED:"0",ENERGY_CERTIFIED:"0",NOT_CERTIFIED:"67"});
    expect(replay.runtime.pairChecks).toBe("95791"); expect(Number(replay.runtime.workSteps)).toBeLessThanOrEqual(50000000);
    const r = primary.rows.find(r => r.id === "P1_h31")!; expect(r.chain.covered).toHaveLength(10);
    expect(r.certificate).toMatchObject({ kind: "CHAIN", exponents: ["-7", "-1"], witness: { u: "1", v: "50150528", k: "1", x: "50150528", y: "324525821956479", z: "16275141320751414870912" } });
  });

  it("fully rehashed scope/root/source/factor/chain/order/unsaturatedK/overlap/energy/rounding/coset/status attacks failclosed", () => {
    const mutations: ((p: BlockCoveragePacket) => void)[] = [
      p => { (p.inputs as { policy: string }).policy = "freeH"; }, p => { (p.inputs as { rows: unknown[] }).rows.pop(); },
      p => { (p.inputs as { sourceContentDigests: { TIP037: string } }).sourceContentDigests.TIP037 = "0".repeat(64); }, p => { p.scope = "forged" as never; },
      p => { p.rows[0].p = "17"; }, p => { p.rows[0].m = "7"; }, p => { p.rows[0].T = "1"; }, p => { p.rows[0].groupOrder = "1"; },
      p => { p.rows[0].factors[0][1] = "2"; }, p => { individual(p).relativeOrder = "1"; },
      p => { individual(p).factorIndex = "1"; }, p => { p.rows[0].chain.stages[0].previousCoveredDigest = "0".repeat(64); },
      p => { p.rows[0].chain.stages[0].covered.pop(); }, p => { p.rows[0].chain.stages[0].covered[0].exponents[0] = "2"; },
      p => { p.rows[0].chain.consumed.push("0"); }, p => { p.rows[0].chain.unused = ["0"]; },
      p => { p.rows[1].chain.covered = [{ residue: "1", exponents: ["0", "0"] }, { residue: "6", exponents: ["1", "1"] }]; },
      p => { energy(p).attempts[0].A.factorIndices = energy(p).attempts[0].B.factorIndices; },
      p => { energy(p).attempts[0].B.factorIndices = ["0"]; }, p => { energy(p).attempts[0].mask = "2"; },
      p => { energy(p).attempts[0].A.N = "1"; }, p => { energy(p).attempts[0].A.E = "1"; }, p => { energy(p).attempts[0].A.L = "1"; },
      p => { energy(p).attempts[0].A.frequencies[0].mu = "2"; }, p => { energy(p).attempts[0].A.frequencies[0].coset = "2"; },
      p => { energy(p).attempts[0].A.frequencies[0].residue = "2"; }, p => { energy(p).attempts[0].A.frequencies[0].u = "2"; },
      p => { energy(p).attempts[0].quotientOrder = "1"; }, p => { energy(p).attempts[0].sufficient = true; },
      p => { p.rows[2].allocation.notEvaluatedPartitions = "99"; }, p => { p.rows[2].status = "MISS" as never; },
      p => { p.rows[2].status = "ENERGY_CERTIFIED"; }, p => { p.rows[0].certificate!.orientation = "INVERTED"; },
      p => { p.rows[0].certificate!.exponents[0] = "1"; }, p => { p.rows[0].certificate!.witness.y = "1"; },
      p => { p.rows.reverse(); },
    ];
    for (const mutate of mutations) { const p = structuredClone(primary); mutate(p); seal(p); expect(verifyBlockCoveragePacket(p)).toBe(false); }
  }, 30000);

  it("scoped frequency proof identities alone are not multiplicity/canonicality authority: coherent forgery freshMISMATCH", () => {
    const p = structuredClone(primary), half = p.rows.find(r => r.id === "P0_h59")!.attempts[0].B;
    const twos = half.frequencies.filter(f => f.mu === "2"); twos[0].mu = "1"; twos[1].mu = "3";
    const E = half.frequencies.reduce((e, f) => e + BigInt(f.mu) ** BigInt(2), BigInt(0)), N = BigInt(half.N);
    half.E = String(E); half.L = String((N * N + E - BigInt(1)) / E); seal(p);
    expect(verifyBlockCoveragePacket(p)).toBe(true); expect(compareBlockCoverageReplay(primary, p)).toBe("MISMATCH"); expect(replayBlockCoverage(p).status).toBe("MISMATCH");
  }, 30000);

  it("retains complete allproperH lattice and rejects omissions, forged orders, bindings and construction", () => {
    const mutations: ((p: BlockCoveragePacket) => void)[] = [
      p => {p.rows.flatMap(r=>r.chain.blockAttempts).find(a=>a.subgroups.length>1)!.subgroups.pop();},
      p => {p.rows.flatMap(r=>r.chain.blockAttempts).find(a=>a.subgroups.length>1)!.subgroups[0].members.push("2");},
      p => {p.rows.flatMap(r=>r.chain.blockAttempts).find(a=>a.subgroups.length>1)!.subgroups[0].orders[0]="1";},
      p => {p.rows.flatMap(r=>r.chain.blockAttempts).find(a=>a.subgroups.length>1)!.subgroups[0].index="1";},
      p => {p.rows.flatMap(r=>r.chain.blockAttempts).find(a=>a.subgroups.length>1)!.subgroups[0].lowerBound="99";},
      p => {p.rows.flatMap(r=>r.chain.blockAttempts).find(a=>a.decision==="PASS")!.support.reverse();},
      p => {p.rows.flatMap(r=>r.chain.blockAttempts).find(a=>a.decision==="PASS")!.construction!.frequencies.pop();},
      p => {p.rows.find(r=>r.chain.hasBlock)!.chain.hasBlock=false;},
    ];
    for(const mutate of mutations) {const p=structuredClone(primary);mutate(p);seal(p);expect(verifyBlockCoveragePacket(p)).toBe(false);}
  },30000);

  it("abstract allsubgroup controls distinguish nonmaximal/noncyclic obstructions and nonexact prefixes",()=>{
    const profiles:[number,{residue:number;exponent:number}[]][]=[
      [15,[...Array.from({length:5},()=>({residue:11,exponent:1})),{residue:2,exponent:1}]],
      [15,[2,7,8,13].map(residue=>({residue,exponent:1}))],
      [15,[2,7].map(residue=>({residue,exponent:1}))],
    ];
    for(const [m,atoms] of profiles) {
      const result=analyzeBlockCriterionAbstract(m,atoms); expect(verifyBlockCoverageAbstractCriterion(m,atoms,result)).toBe(true);
      const out=python(`fs=[(a['residue'],a['exponent']) for a in ${JSON.stringify(atoms)}]\nn=len(fs)\nb=g['Budget']()\nr=g['block_attempt'](fs,list(range(n)),2**n-1,list(range(n)),{1:[0]*n},${m},8,g['factor'](8,b),b)\nprint(g['compact']({k:r[k] for k in ['exactAtomOrders','closure','subgroups','decision']}),end='')`);
      expect(out.status).toBe(0);expect(JSON.parse(out.stdout)).toEqual(result);
      if(atoms.length===6) {expect(result.decision).toBe("INEQUALITY_FAILED");expect(result.subgroups.find(h=>h.members.join(',')==="1,11")?.passed).toBe(false);}
      if(atoms.length===4) expect(result.decision).toBe("PASS");
      if(atoms.length===2) {expect(result.decision).toBe("GROUP_TOO_LARGE");expect(result.closure.status).toBe("LOWER_BOUND_ONLY");
        const forged=structuredClone(result);forged.closure.status="EXACT";forged.closure.lowerBound=null;expect(verifyBlockCoverageAbstractCriterion(m,atoms,forged)).toBe(false);}
    }
    const atoms40=[17,...Array(7).fill(11),...Array(7).fill(21)].map(residue=>({residue,exponent:1}));
    const u40=analyzeBlockCriterionAbstract(40,atoms40);
    expect(verifyBlockCoverageAbstractCriterion(40,atoms40,u40)).toBe(true);
    expect(u40.subgroups.filter(h=>!h.passed)).toMatchObject([{members:["1","11","21","31"],index:"4",lowerBound:"3"}]);
    const py40=python(`fs=[(a['residue'],a['exponent']) for a in ${JSON.stringify(atoms40)}]\nb=g['Budget']()\nn=len(fs)\nr=g['block_attempt'](fs,list(range(n)),2**n-1,list(range(n)),{1:[0]*n},40,16,g['factor'](16,b),b)\nprint(g['compact']({k:r[k] for k in ['exactAtomOrders','closure','subgroups','decision']}),end='')`);
    expect(py40.status).toBe(0);expect(JSON.parse(py40.stdout)).toEqual(u40);
    const forged40=structuredClone(u40);forged40.subgroups=forged40.subgroups.filter(h=>h.passed);
    expect(verifyBlockCoverageAbstractCriterion(40,atoms40,forged40)).toBe(false);
  },30000);

  it("abstract constructive coverage shared verifier has no arbitrary root witness authority",()=>{
    const fs:[string,string][]=[["3","2"],["5","1"]],row=controlRow(7,fs);
    expect(row.status).toBe("BLOCK_CHAIN_CERTIFIED");expect(verifyBlockCoverageAbstractAllocation(row)).toBe(true);
    const {witness,...core}=row.certificate!;void witness;expect({...row,certificate:core}).toMatchObject(analyzeBlockCoverageAbstract(7,fs));
    const forged=structuredClone(row);forged.certificate!.witness.x="1";expect(verifyBlockCoverageAbstractAllocation(sealRow(forged))).toBe(true);
    const p=structuredClone(primary);p.rows[0]=forged;seal(p);expect(verifyBlockCoveragePacket(p)).toBe(false);
  });

  it("failure of sufficient criteria never impliesMISS; strictdensity equality and composite evenK controls", () => {
    const knownHit = controlRow(11, [["2", "1"], ["5", "1"]]); expect(knownHit.status).toBe("NOT_CERTIFIED"); expect(verifyBlockCoverageAbstractAllocation(knownHit)).toBe(true);
    const boundary = controlRow(7, [["3", "1"], ["17", "1"]]); expect(boundary.status).toBe("NOT_CERTIFIED");
    expect(boundary.attempts[0]).toMatchObject({ sufficient: false, quotientOrder: "6", A: { L: "3" }, B: { L: "3" } });
    const weak = structuredClone(boundary); weak.attempts[0].sufficient = true; expect(verifyBlockCoverageAbstractAllocation(sealRow(weak))).toBe(false);
    const even = controlRow(15, [["7", "2"]]); expect(even.status).toBe("NOT_CERTIFIED"); expect(even.chain.covered.map(k => k.residue)).toEqual(["1", "4", "7", "13"]);
    expect(verifyBlockCoverageAbstractAllocation(even)).toBe(true); expect(even.chain.covered.some(k => k.residue === "14")).toBe(false);
    const proof = python("v,o,w=g['normalize_witness'](29,11,10,[(2,1),(5,1)],[-1,-1])\nprint(json.dumps(w))"); expect(proof.status).toBe(0);
    expect(JSON.parse(proof.stdout)).toMatchObject({ u: "1", v: "10", x: "10", y: "29", z: "290" });
  });

  it("rehashed summary/resource limits and lateCOMPLETE receipts fail; BigInt products remain exact", () => {
    const p = structuredClone(primary); p.summary.counts.NOT_CERTIFIED = "0"; seal(p, false); expect(verifyBlockCoveragePacket(p)).toBe(false);
    for (const [key, value] of [["elapsedMs", "60000"], ["workSteps", "50000001"], ["stateInsertions", "2000001"], ["pairChecks", "50000001"]]) {
      const r = structuredClone(replay); Object.assign(r.runtime, { [key]: value }); seal(r); expect(verifyBlockCoveragePacket(r)).toBe(false);
    }
    const m = 25075263, r = m - 2, exponent = 12345; let expected = BigInt(1);
    for (let i = 0; i < exponent; i++) expected = expected * BigInt(r) % BigInt(m);
    expect(blockCoveragePow(r, exponent, m)).toBe(Number(expected));
  }, 30000);

  it("fully rehashed lowered-cap impossible retained prefixes failclosed",()=>{
    for(const limits of [{maxSmallGroupElements:1},{maxSubgroupsPerAttempt:1}]) {
      const p=structuredClone(primary);Object.assign(p.limits,limits);p.status="PARTIAL";p.reason="SMALL_GROUP_LIMIT";p.pending={phase:"FINALIZE"};seal(p);
      expect(verifyBlockCoveragePacket(p)).toBe(false);
    }
    for(const options of [{maxSmallGroupElements:1},{maxSubgroupsPerAttempt:1}]) {
      const p=blockCoveragePacket(options);expect(verifyBlockCoveragePacket(p)).toBe(true);expect(replayBlockCoverage(p).status).toBe("PARTIAL");
    }
  },30000);

  it("state/work/pair/row caps retain exact atomic ordered prefix and cannotPASS; forged pending rejected", () => {
    for (const options of [{ maxRows: 1 }, { maxStateInsertions: 1 }, { maxWorkSteps: 1 }]) {
      const p = blockCoveragePacket(options); expect(verifyBlockCoveragePacket(p)).toBe(true); expect(replayBlockCoverage(p).status).toBe("PARTIAL"); expect(p.summary.complete).toBe(false);
    }
    const wrong = blockCoveragePacketSchema.parse(blockCoveragePacket({ maxRows: 1 })); wrong.pending = { phase: "ROW", id: "C_r13" }; seal(wrong); expect(verifyBlockCoveragePacket(wrong)).toBe(false);
    for (const args of ["pair_limit=0", "work_limit=0", "state_limit=0", "row_limit=1"]) {
      const p = pyPacket(`p=m['packet'](${args})\nprint(m['compact'](p),end='')`); expect(p.status).toBe("PARTIAL"); expect(verifyBlockCoveragePacket(p)).toBe(true);
      expect(compareBlockCoverageReplay(primary, p)).toBe("PARTIAL");
    }
  });

  it("first/internal/midpoint/finalROW and FINALIZE expiry retains exact completed prefix", () => {
    for (const condition of ["self.pending.get('id')=='P0_h3'", "self.pending.get('id')=='P1_h31'", "self.pending.get('id')=='N7_h107'", "self.pending.get('phase')=='FINALIZE'"]) {
      const p = pyPacket(`original=g['Budget'].check\ndef check(self):\n    if ${condition}: raise g['Stop']('REPLAY_TIME_LIMIT')\n    original(self)\ng['Budget'].check=check\np=m['packet']()\nprint(m['compact'](p),end='')`);
      expect(p.status).toBe("PARTIAL"); expect(verifyBlockCoveragePacket(p)).toBe(true); expect(compareBlockCoverageReplay(primary, p)).toBe("PARTIAL");
      if (condition.includes("FINALIZE")) expect(p.rows).toHaveLength(191);
    }
    const inside = pyPacket("original=g['Budget'].pair\ndef pair(self):\n    if self.pending.get('id')=='P0_h11': raise g['Stop']('REPLAY_TIME_LIMIT')\n    original(self)\ng['Budget'].pair=pair\np=m['packet']()\nprint(m['compact'](p),end='')");
    expect(verifyBlockCoveragePacket(inside)).toBe(true); expect(inside.pending).toEqual({ phase: "ROW", id: "P0_h11" }); expect(inside.rows).toHaveLength(2);
  }, 30000);

  it("constructor/stdout serialization expiry and outputprefix/head limits failclosed", () => {
    const late = pyPacket("clock=[0.0]\noriginal=g['compact']\ndef compact(v):\n    if isinstance(v,dict) and v.get('packetDigest') and v.get('status')=='COMPLETE': clock[0]=61.0\n    return original(v)\ng['compact']=compact\np=m['packet'](clock=lambda:clock[0])\nprint(original(p),end='')");
    expect(late).toMatchObject({ status: "PARTIAL", reason: "REPLAY_TIME_LIMIT", pending: { phase: "FINALIZE" } }); expect(verifyBlockCoveragePacket(late)).toBe(true);
    const stdout = pyPacket("clock=[0.0]\nreturned=[False]\noriginal_packet=g['packet']\noriginal_compact=g['compact']\ndef packet(clock):\n    p=original_packet(clock=clock)\n    returned[0]=True\n    return p\ndef compact(v):\n    if returned[0]: clock[0]=61.0\n    return original_compact(v)\ng['packet']=packet\ng['compact']=compact\ng['time'].monotonic=lambda:clock[0]\ng['main']()");
    expect(stdout.status).toBe("PARTIAL"); expect(verifyBlockCoveragePacket(stdout)).toBe(true);
    const small = pyPacket("g['MAX_OUTPUT']=32768\np=m['packet']()\nprint(m['compact'](p),end='')"); expect(small.status).toBe("PARTIAL");
    expect(verifyBlockCoveragePacket(small)).toBe(true); expect(Number(small.runtime.outputBytes)).toBeLessThanOrEqual(32768);
    const head = python("g['MAX_OUTPUT']=10\nm['packet']()"); expect(head.status).not.toBe(0); expect(head.stdout).toBe("");
  }, 30000);

  it("mocked contradiction retains complete hashed offending row and exits1, not proof/refutation admission", () => {
    const out = python("g['assert_candidate']=lambda row:False\ng['main']()"); expect(out.status).toBe(1); const d = JSON.parse(out.stdout);
    expect(d).toMatchObject({ status: "INVESTIGATION", reason: "COVERAGE_ARITHMETIC_CONTRADICTION" }); expect(d.row.rowDigest).toMatch(/^[a-f0-9]{64}$/); expect(verifyBlockCoveragePacket(d)).toBe(false);
  });

  it("separate exhaustive new120 truth runs only after complete decisions and checks recovery, not NOT_CERT-as-miss accuracy",()=>{
    const r=python("decisions=g['packet']()\nassert decisions['status']=='COMPLETE'\nt=g['new_cohort_truth']()\nprint(g['compact'](t),end='')");
    expect(r.status).toBe(0);
    const truth=JSON.parse(r.stdout) as {status:string;contentDigest:string;rows:{id:string;hit:boolean}[];runtime:{pairChecks:string;workSteps:string;outputBytes:string}};
    expect(truth.status).toBe("COMPLETE");expect(truth.rows).toHaveLength(120);expect(truth.contentDigest).toBe("eea0b1749dd2802d468352639d28f67e05bfc8ab04c9797eaec0117a4ee60058");
    expect(truth.rows.filter(r=>r.hit)).toHaveLength(63);
    const newRows=primary.rows.filter(r=>r.id.startsWith("N"));
    expect(newRows.filter(r=>r.certificate&&truth.rows.find(t=>t.id===r.id)!.hit)).toHaveLength(31);
    expect(newRows.filter(r=>r.certificate&&!truth.rows.find(t=>t.id===r.id)!.hit)).toHaveLength(0);
    expect(newRows.filter(r=>!r.certificate&&truth.rows.find(t=>t.id===r.id)!.hit)).toHaveLength(32);
    expect(Number(truth.runtime.pairChecks)).toBeLessThanOrEqual(50000000);expect(Number(truth.runtime.workSteps)).toBeGreaterThan(0);expect(Number(truth.runtime.workSteps)).toBeLessThanOrEqual(50000000);expect(Number(truth.runtime.outputBytes)).toBeLessThanOrEqual(8388608);
    const limited=python("Original=g['Budget']\ng['Budget']=lambda clock:Original(clock=clock,work_limit=1)\nt=g['new_cohort_truth']()\nprint(g['compact'](t),end='')");
    expect(limited.status).toBe(0);expect(JSON.parse(limited.stdout)).toMatchObject({status:"PARTIAL",reason:"WORK_LIMIT",rows:[],pending:{phase:"ROW",id:"N0_h3"},runtime:{workSteps:"1"}});
  },30000);

  it("source drift/missingIO and exact isolatedbytes/env plus process/output/JSON failures never fabricate verification", () => {
    const source = readFileSync("scripts/operations/block-coverage-replay.py"), file = vi.mocked(readFileSync), child = vi.mocked(spawnSync); child.mockClear();
    try {
      file.mockReturnValueOnce(Buffer.concat([source, Buffer.from("\n# drift\n")])); const drift = replayBlockCoverage(primary);
      expect(drift).toMatchObject({ status: "UNAVAILABLE", expectedScriptDigest: BLOCK_COVERAGE_REPLAY_SHA256, verifiedScriptDigest: null });
      expect(drift.observedScriptDigest).not.toBe(drift.expectedScriptDigest); expect(child).not.toHaveBeenCalled();
      file.mockImplementationOnce(() => { throw new Error("ENOENT"); }); expect(replayBlockCoverage(primary)).toMatchObject({ status: "UNAVAILABLE", observedScriptDigest: null });
      child.mockImplementation((...args) => { expect(args[0]).toBe("python3"); expect(args[1]).toEqual(["-I", "-S", "-B", "-c", source.toString("utf8")]);
        expect(Object.keys((args[2] as { env: object }).env).sort()).toEqual(["NODE_ENV", "PATH", "PYTHONDONTWRITEBYTECODE"]);
        return { error: new Error("ENOENT"), status: null, stdout: "", output: [], pid: 0 } as never; }); expect(replayBlockCoverage(primary).status).toBe("UNAVAILABLE");
      child.mockReturnValue({ error: new Error("ETIMEDOUT"), status: null, stdout: "", output: [], pid: 0 } as never); expect(replayBlockCoverage(primary).status).toBe("UNAVAILABLE");
      child.mockReturnValue({ status: 0, stdout: "x".repeat(8388609), output: [], pid: 0 } as never); expect(replayBlockCoverage(primary)).toMatchObject({ status: "UNAVAILABLE", reason: "REPLAY_OUTPUT_LIMIT" });
      child.mockReturnValue({ status: 0, stdout: "invalid", output: [], pid: 0 } as never); expect(replayBlockCoverage(primary)).toMatchObject({ status: "MISMATCH", reason: "REPLAY_JSON_INVALID" });
      child.mockReturnValue({ status: 0, stdout: "{}", output: [], pid: 0 } as never); expect(replayBlockCoverage(primary)).toMatchObject({ status: "MISMATCH", reason: "REPLAY_INVARIANT_INVALID" });
    } finally { file.mockReset(); child.mockReset(); }
  }, 30000);

  it("last observed receipt deadline cannotPASS after childCOMPLETE and semantic comparison", () => {
    const child = vi.mocked(spawnSync), clock = vi.mocked(performance.now), ticks = [0, 0, 59999, 60000];
    try { child.mockReturnValue({ status: 0, stdout: canonicalJson(replay), output: [], pid: 0 } as never); clock.mockImplementation(() => ticks.shift() ?? 60000);
      expect(replayBlockCoverage(primary)).toMatchObject({ status: "UNAVAILABLE", reason: "WRAPPER_TIME_LIMIT", elapsedMs: 60000 }); expect(ticks).toHaveLength(0);
    } finally { child.mockReset(); clock.mockReset(); }
  });
});
