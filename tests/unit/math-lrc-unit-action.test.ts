import { readFileSync } from "node:fs";
import childProcess from "node:child_process";
import { performance } from "node:perf_hooks";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import * as frontierReports from "@/modules/research-sandbox/math-lrc-frontier-report";
import { type AllikvereFrontierReport } from "@/modules/research-sandbox/math-lrc-frontier-report";
import { type AllikvereCoverReport } from "@/modules/research-sandbox/math-lrc-cover-report";
import { LRC_UNIT_ACTION_CONTRACT_DIGEST, LRC_UNIT_ACTION_METHOD, LRC_UNIT_ACTION_PARAMETERS, LRC_UNIT_ACTION_SOURCES,
  deriveLrcUnitActionPlan, verifyLrcUnitActionPlan, lrcUnitActionPlanDigest, lrcUnitActionOutputBytes,
  transportLrcUnitPrefix, lrcUnitPrefixInterval, mergeLrcUnitIntervals, complementLrcUnitIntervals,
  type LrcUnitActionPlan } from "@/modules/research-sandbox/math-lrc-unit-action";

vi.mock("@/modules/research-sandbox/math-lrc-frontier-report", async (original) => {
  const actual = await original<typeof import("@/modules/research-sandbox/math-lrc-frontier-report")>();
  return { ...actual, validateRetainedAllikvereFrontierReport: vi.fn(actual.validateRetainedAllikvereFrontierReport) };
});
const baseBytes = readFileSync(LRC_UNIT_ACTION_SOURCES.basePath, "utf8"),
  frontierBytes = readFileSync(LRC_UNIT_ACTION_SOURCES.frontierPath, "utf8");
const base: AllikvereCoverReport = JSON.parse(baseBytes), frontier: AllikvereFrontierReport = JSON.parse(frontierBytes);
let plan: LrcUnitActionPlan;
beforeAll(() => { plan = deriveLrcUnitActionPlan(base, frontier); }, 30000);
beforeEach(() => {
  // Policy/interval controls isolate new arithmetic from repeated OLD admission.
  // The real old checker runs in beforeAll and the explicit actual admission case.
  // No mock receipt or source-check bypass is claimed as independent execution.
  vi.mocked(frontierReports.validateRetainedAllikvereFrontierReport).mockReset().mockReturnValue(frontier);
});
afterEach(() => { vi.restoreAllMocks(); });
const seal = (p: LrcUnitActionPlan) => ({ ...p, planDigest: lrcUnitActionPlanDigest(p) });

describe("kernel-unit proof reuse and exact union (policy fixtures isolate old source admission)", () => {
  it("pins exact existing bytes, complete ordered four-parent selection and all fixed units", () => {
    expect(sha256(baseBytes)).toBe(LRC_UNIT_ACTION_SOURCES.baseRawSha256);
    expect(sha256(frontierBytes)).toBe(LRC_UNIT_ACTION_SOURCES.frontierRawSha256);
    expect(sha256(readFileSync("docs/contractor/tips/TIP-050_LRC_UNIT_ACTION_UNION.json", "utf8"))).toBe(LRC_UNIT_ACTION_CONTRACT_DIGEST);
    expect(plan.rows.map((r) => r.parentId)).toEqual(base.rows.slice(4).map((r) => r.id));
    expect(plan.rows.map((r) => r.sourceLeafCount)).toEqual([21569,20658,23385,22429]);
    expect(plan.units).toEqual([0,2,3,4,5,6].map((t) => ({ t, s: 1 + 398*t })));
    expect(Object.isFrozen(LRC_UNIT_ACTION_PARAMETERS.t)).toBe(true);
    expect(Object.isFrozen(LRC_UNIT_ACTION_PARAMETERS.s)).toBe(true);
    expect(plan.rows.every((r, i) => r.childJobDigests.join() === frontier.evidence.packet.plan.jobs.slice(2*i,2*i+2).map((j) => j.jobDigest).join())).toBe(true);
  });
  it("uses full original-coordinate prefix cylinders and exact base7 half-open ordinal ranges", () => {
    expect(lrcUnitPrefixInterval([])).toEqual({ start: "0", end: "96889010407" });
    expect(lrcUnitPrefixInterval([1])).toEqual({ start: "13841287201", end: "27682574402" });
    expect(lrcUnitPrefixInterval(Array(13).fill(6))).toEqual({ start: "96889010406", end: "96889010407" });
    expect(() => lrcUnitPrefixInterval([7])).toThrow();
    expect(() => lrcUnitPrefixInterval(Array(14).fill(0))).toThrow();
  });
  it("preserves the divisor-bearing fixed point, identity and each whole seven-digit axis bijection", () => {
    const residues = Array.from({ length: 13 }, (_, i) => i + 1);
    for (const t of LRC_UNIT_ACTION_PARAMETERS.t) {
      expect(transportLrcUnitPrefix(residues.map((r) => r % 7), residues, t)).toEqual(residues.map((r) => r % 7));
      const images = new Set(Array.from({ length: 7 }, (_, d) => transportLrcUnitPrefix([d], residues, t)[0]));
      expect(images.size).toBe(7);
    }
    expect(transportLrcUnitPrefix([6,2,2,0], residues, 0)).toEqual([6,2,2,0]);
    expect(() => transportLrcUnitPrefix([0], residues, 1)).toThrow();
  });
  it("independently checks one shared time permutation, not an existential time for each coordinate", () => {
    const M = 2786, good = (v: number, j: number, m = M) => 14 * Math.min(v*j % m, m-v*j % m) >= m;
    for (const s of LRC_UNIT_ACTION_PARAMETERS.s) {
      const images = new Set<number>();
      for (let j = 1; j <= M/2; j++) {
        images.add(Math.min(s*j % M,M-s*j % M));
        for (const v of [1,397,399,2389]) expect(good(s*v % M,j)).toBe(good(v,s*j % M));
      }
      expect(images.size).toBe(M/2);
    }
    // M34 is a methodological negative control, not a new p199 source domain.
    // Each coordinate individually has a good time; the thirteen-way meet is empty.
    const individual = Array.from({ length: 13 }, (_, i) => Array.from({ length: 34 }, (_, j) => j).filter((j) => good(i+1,j,34)));
    expect(individual.every((times) => times.length > 0)).toBe(true);
    expect(individual[0].filter((j) => individual.every((times) => times.includes(j)))).toEqual([]);
  });
  it("merges duplicate, overlapping, contained and adjacent intervals without a factor-six multiplier", () => {
    const input = [{start:"5",end:"9"},{start:"0",end:"2"},{start:"1",end:"6"},{start:"2",end:"3"},{start:"0",end:"2"}];
    const union = mergeLrcUnitIntervals(input);
    expect(union).toEqual([{start:"0",end:"9"}]);
    expect(complementLrcUnitIntervals(union)).toEqual([{start:"9",end:"96889010407"}]);
    const fixed = lrcUnitPrefixInterval([1,2,3]);
    expect(mergeLrcUnitIntervals(Array(6).fill(fixed))).toEqual([fixed]);
    expect(complementLrcUnitIntervals([])).toEqual([{start:"0",end:"96889010407"}]);
    expect(complementLrcUnitIntervals([lrcUnitPrefixInterval([])])).toEqual([]);
  });
  it("does not admit reversed, out-of-universe or noncanonical missing-range complements", () => {
    expect(() => mergeLrcUnitIntervals([{start:"3",end:"2"}])).toThrow();
    expect(() => mergeLrcUnitIntervals([{start:"0",end:"96889010408"}])).toThrow();
    expect(() => mergeLrcUnitIntervals([{start:"00",end:"2"}])).toThrow();
    expect(() => complementLrcUnitIntervals([{start:"0",end:"2"},{start:"2",end:"4"}])).toThrow();
    expect(() => complementLrcUnitIntervals([{start:"4",end:"6"},{start:"0",end:"2"}])).toThrow();
    expect(complementLrcUnitIntervals([{start:"2",end:"4"},{start:"6",end:"8"}]))
      .toEqual([{start:"0",end:"2"},{start:"4",end:"6"},{start:"8",end:"96889010407"}]);
  });
  it("reruns actual old sources once, reconstructs all528246 candidates and complete unions/complements without new search", async () => {
    const actual = await vi.importActual<typeof import("@/modules/research-sandbox/math-lrc-frontier-report")>("@/modules/research-sandbox/math-lrc-frontier-report");
    vi.mocked(frontierReports.validateRetainedAllikvereFrontierReport).mockReset().mockImplementation(actual.validateRetainedAllikvereFrontierReport);
    const execute = vi.spyOn(childProcess, "execFile"), fetch = vi.spyOn(globalThis, "fetch");
    const result = verifyLrcUnitActionPlan(plan, base, frontier);
    expect(result?.status).toBe("PARTIAL"); expect(result?.method).toBe(LRC_UNIT_ACTION_METHOD); expect(result?.globalVerdict).toBe("NOT_ESTABLISHED");
    expect(frontierReports.validateRetainedAllikvereFrontierReport).toHaveBeenCalledTimes(1);
    expect(execute).not.toHaveBeenCalled(); expect(fetch).not.toHaveBeenCalled();
    expect(result?.rows.map((r) => r.unionWitnessTuples)).toEqual(["1560933318","1896838020","960260742","1314273786"]);
    expect(result?.rows.map((r) => r.deltaWitnessTuples)).toEqual(["1300777765","1580698350","800217285","1095228155"]);
    expect(result?.rows.map((r) => r.unionIntervals)).toEqual([72,79,83,58]);
    expect(result?.rows.map((r) => r.complementIntervals)).toEqual([72,79,83,58]);
    expect(result?.rows.reduce((n,r) => n+r.candidateIntervals,0)).toBe(528246);
    for (const row of result!.rows) {
      expect(BigInt(row.unionWitnessTuples)+BigInt(row.remainingTuples)).toBe(BigInt(row.totalTuples));
      expect(row.unionExamples).toHaveLength(8); expect(row.complementExamples).toHaveLength(8);
      expect(row.overlapTuples).toBe("0"); // actualinputs only; overlap controls above do NOT have zero
    }
    expect(result?.uncoveredObligations).toEqual(base.uncoveredObligations);
    expect(lrcUnitActionOutputBytes(result!)).toBe(`${canonicalJson({method:"LRC_UNIT_ACTION_PYTHON_UNION_V1",summary:result})}\n`);
    expect(sha256(readFileSync(LRC_UNIT_ACTION_SOURCES.basePath,"utf8"))).toBe(LRC_UNIT_ACTION_SOURCES.baseRawSha256);
    expect(sha256(readFileSync(LRC_UNIT_ACTION_SOURCES.frontierPath,"utf8"))).toBe(LRC_UNIT_ACTION_SOURCES.frontierRawSha256);
  }, 60000);
  it.each([
    ["missing unit", (p:LrcUnitActionPlan)=>{p.units.pop();}],
    ["nonunit t1", (p:LrcUnitActionPlan)=>{p.units[1]={t:1,s:399};}],
    ["wrong shared-time multiplier", (p:LrcUnitActionPlan)=>{p.units[1].s=799;}],
    ["reordered units", (p:LrcUnitActionPlan)=>{p.units.reverse();}],
    ["changed parent", (p:LrcUnitActionPlan)=>{p.rows[0].parentId=p.rows[1].parentId;}],
    ["cross-parent root", (p:LrcUnitActionPlan)=>{p.rows[0].parentRootContractDigest=p.rows[1].parentRootContractDigest;}],
    ["omitted proved leaf", (p:LrcUnitActionPlan)=>{p.rows[0].sourceLeafCount--;}],
    ["source selection substitution", (p:LrcUnitActionPlan)=>{p.rows[0].sourceSelectionDigest="a".repeat(64);}],
    ["reordered child roles", (p:LrcUnitActionPlan)=>{p.rows[0].childJobDigests.reverse();}],
    ["changed source digest", (p:LrcUnitActionPlan)=>{p.sourceManifestDigest="a".repeat(64);}],
    ["changed contract", (p:LrcUnitActionPlan)=>{p.contractDigest="a".repeat(64);}],
  ] as const)("rejects coherently plan-rehashed %s",(_name,mutate)=>{
    const changed=structuredClone(plan);mutate(changed);expect(verifyLrcUnitActionPlan(seal(changed),base,frontier)).toBeNull();
  });
  it("rejects caller-chosen proved prefixes, coordinate times and stale externally pinned sources",()=>{
    expect(verifyLrcUnitActionPlan({...plan,prefixes:[[0]]},base,frontier)).toBeNull();
    expect(verifyLrcUnitActionPlan({...plan,coordinateTimes:Array(13).fill(1)},base,frontier)).toBeNull();
    const stale=structuredClone(base);stale.reportDigest="a".repeat(64);
    expect(verifyLrcUnitActionPlan(plan,stale,frontier)).toBeNull();
    const staleFrontier=structuredClone(frontier);staleFrontier.reportDigest="a".repeat(64);
    vi.mocked(frontierReports.validateRetainedAllikvereFrontierReport).mockReturnValue(staleFrontier);
    expect(verifyLrcUnitActionPlan(plan,base,staleFrontier)).toBeNull();
  });
  it("actual old admission refuses a promoted UNRESOLVED source label even before new reuse",async()=>{
    const actual=await vi.importActual<typeof import("@/modules/research-sandbox/math-lrc-frontier-report")>("@/modules/research-sandbox/math-lrc-frontier-report");
    vi.mocked(frontierReports.validateRetainedAllikvereFrontierReport).mockImplementation(actual.validateRetainedAllikvereFrontierReport);
    const changed=structuredClone(frontier),cert=changed.evidence.packet.children[1].evidence.certificate;
    const index=cert.nodes.findIndex(n=>n.kind==="UNRESOLVED");
    cert.nodes[index]={id:cert.nodes[index].id,prefix:cert.nodes[index].prefix,kind:"COVER_BOUND",uncoveredCount:1,maxBad:[]};
    expect(verifyLrcUnitActionPlan(plan,base,changed)).toBeNull();
  });
  it("fails closed on stricter work/time, unsafe limit raising and observed clock expiry",()=>{
    expect(verifyLrcUnitActionPlan(plan,base,frontier,{timeoutMs:0})).toBeNull();
    expect(verifyLrcUnitActionPlan(plan,base,frontier,{maxWork:0})).toBeNull();
    expect(verifyLrcUnitActionPlan(plan,base,frontier,{maxWork:10})).toBeNull();
    expect(verifyLrcUnitActionPlan(plan,base,frontier,{timeoutMs:60001})).toBeNull();
    expect(verifyLrcUnitActionPlan(plan,base,frontier,{maxWork:50000001})).toBeNull();
    let reads=0;const clock=vi.spyOn(performance,"now").mockImplementation(()=>reads++===0?0:60001);
    try{expect(verifyLrcUnitActionPlan(plan,base,frontier)).toBeNull();}finally{clock.mockRestore();}
  });
  it("caps complete plan-plus-source serialized input before old admission",()=>{
    vi.mocked(frontierReports.validateRetainedAllikvereFrontierReport).mockClear();
    expect(verifyLrcUnitActionPlan({...plan,foreignBytes:"x".repeat(83886080)},base,frontier)).toBeNull();
    expect(frontierReports.validateRetainedAllikvereFrontierReport).not.toHaveBeenCalled();
  });
});
