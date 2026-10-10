import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { performance } from "node:perf_hooks";
import { describe, expect, it, vi } from "vitest";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { ALLIKVERE_PROOF_LIMITS, ALLIKVERE_PROOF_PYTHON_SHA256, ALLIKVERE_PROOF_RETAINED_PATH,
  allikvereProofPrimes, buildAllikvereProofPlan, exactLogInterval, isProofPrime,
  proofArithmeticReportDigest, reconstructProofArithmetic, validateRetainedProofArithmetic,
  type ProofArithmeticReport, type RationalString } from "@/modules/research-sandbox/math-lrc-proof-plan";

const report: ProofArithmeticReport = JSON.parse(readFileSync(ALLIKVERE_PROOF_RETAINED_PATH,"utf8"));
const less = (a: RationalString, b: RationalString) => BigInt(a.numerator)*BigInt(b.denominator)<BigInt(b.numerator)*BigInt(a.denominator);
const rational = (n: bigint,d=BigInt("1")): RationalString => ({numerator:String(n),denominator:String(d)});
function reseal(raw: ProofArithmeticReport, outputAlso=false) {
  if(outputAlso) {
    const {generatedAt,planDigest,receipt,reportDigest,...arithmetic}=raw;
    void generatedAt;void planDigest;void receipt;void reportDigest;
    const stdout=`${canonicalJson(arithmetic)}\n`;
    raw.receipt.stdoutSha256=sha256(stdout); raw.receipt.stdoutBytes=Buffer.byteLength(stdout);
  }
  raw.reportDigest=proofArithmeticReportDigest(raw); return raw;
}

describe("theorem-first source-specific conditional proof arithmetic",()=>{
  it("pins v2, separates moving speeds, published claim, open reproduction and paused novelty",()=>{
    const p=buildAllikvereProofPlan();
    expect(p.source.id).toBe("arXiv:2609.02604v2"); expect(p.source.date).toBe("2026-09-24");
    expect(p.targets.map(t=>[t.totalRunners,t.movingSpeeds])).toEqual([[14,13],[15,14]]);
    expect(p.lowerCaseConvention).toEqual({movingSpeeds:12,totalRunners:13});
    expect(p.reproductionStatus).toBe("NOT_ESTABLISHED");expect(p.noveltyStatus).toBe("PAUSED");
    expect(p.targets.every(t=>t.dependencies.every(d=>d.status==="OPEN"))).toBe(true);
    expect(p.targets[1].dependencies[0].id).toBe("ESTABLISHED_LRC_13");
  });
  it("has no dangling dependency IDs, preserves separate complete-generation/lift/terminal obligations",()=>{
    const deps=buildAllikvereProofPlan().targets.flatMap(t=>t.dependencies), ids=new Set(deps.map(d=>d.id));
    expect(deps.every(d=>d.dependsOn.every(id=>ids.has(id)))).toBe(true);
    expect(deps.filter(d=>d.id.includes("COMPLETENESS")).length).toBe(4);
    expect(deps.every(d=>d.sourceUrl.startsWith("https://arxiv.org/html/2609.02604v2#"))).toBe(true);
  });
  it("selects properness and analytic audit with a global-obligation stop rule, not a campaign",()=>{
    const next=buildAllikvereProofPlan().nextObligation;
    expect(next.status).toBe("SELECTED_PENDING_FULL_REVIEW");
    expect(next.scope[0]).toContain("PRIMITIVE_NORMALIZATION");
    expect(next.stopRule).toContain("global obligation");expect(next.stopRule).toContain("partial local coverage");
  });
  it("exact log1 is zero, log2 encloses rational controls, reciprocal sign reverses endpoints",()=>{
    const zero=exactLogInterval(BigInt("1"));expect(zero.lower).toEqual(rational(BigInt("0")));expect(zero.upper).toEqual(rational(BigInt("0")));
    const two=exactLogInterval(BigInt("2")), half=exactLogInterval(BigInt("1"),BigInt("2"));
    expect(less(rational(BigInt("693147180559"),BigInt("1000000000000")),two.upper)).toBe(true);
    expect(less(two.lower,rational(BigInt("693147180560"),BigInt("1000000000000")))).toBe(true);
    expect(half.lower).toEqual({...two.upper,numerator:String(-BigInt(two.upper.numerator))});
    expect(half.upper).toEqual({...two.lower,numerator:String(-BigInt(two.lower.numerator))});
    expect(()=>exactLogInterval(BigInt("0"))).toThrow();expect(()=>exactLogInterval(-BigInt("1"))).toThrow();
  });
  it("reconstructs ci increments/K/ratio hypotheses, exact safe bounds and strictly positive margins",()=>{
    const a=reconstructProofArithmetic();
    expect(a.targets[0].K).toEqual(rational(BigInt("89348172069691"),BigInt("3616460531462492894939937597619200000000")));
    expect(a.targets[1].K).toEqual(rational(BigInt("2289670297"),BigInt("97243124257250844122250000000000000000")));
    for(const t of a.targets){
      expect(t.ci.length).toBe(t.movingSpeeds-1);expect(t.ratios.every(r=>less(rational(BigInt("4"),BigInt("3")),r))).toBe(true);
      expect(less(t.logBound.upper,t.publishedUpperBound)).toBe(true);
      expect(less(rational(BigInt("0")),t.margin.lower)).toBe(true);
    }
    expect(a.targets.map(t=>t.display.margin)).toEqual(["[12.740568, 12.740569]","[6.838811, 6.838812]"]);
  });
  it("checks 61/71 unique genuine primes, includes239 once and241 once, no factor double count",()=>{
    const a=allikvereProofPrimes(13),b=allikvereProofPrimes(14);
    expect(a.length).toBe(61);expect(b.length).toBe(71);expect(new Set(b).size).toBe(71);
    expect(b.filter(p=>p===239)).toHaveLength(1);expect(b.filter(p=>p===241)).toHaveLength(1);
    expect([...a,...b].every(isProofPrime)).toBe(true);expect(isProofPrime(49)).toBe(false);
    expect(report.targets.map(t=>t.forcedDivisor)).toEqual(["1","360360"]);
    expect(report.targets.every(t=>t.lcm2Through15==="360360"&&t.coprime)).toBe(true);
  });
  it("freshly executes only pinned Python bytes and independently matches exact serialized arithmetic",()=>{
    const source=readFileSync("scripts/operations/replay-lrc-proof-arithmetic.py","utf8");
    expect(sha256(source)).toBe(ALLIKVERE_PROOF_PYTHON_SHA256);
    const stdout=execFileSync("python3",["-I","-S","-B","-c",source],{encoding:"utf8",timeout:ALLIKVERE_PROOF_LIMITS.replayMs,maxBuffer:ALLIKVERE_PROOF_LIMITS.stdoutBytes,
      env:{PATH:"/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin",LANG:"C.UTF-8",TMPDIR:"/private/tmp",NODE_ENV:"test"}});
    expect(stdout).toBe(`${canonicalJson(reconstructProofArithmetic())}\n`);
    expect(sha256(stdout)).toBe(report.receipt.stdoutSha256);
  });
  it("admits compact unsigned retained arithmetic, without subprocess/network/Math.log",()=>{
    const fetch=vi.spyOn(globalThis,"fetch"), log=vi.spyOn(Math,"log");
    try { const t=performance.now();expect(validateRetainedProofArithmetic(report)?.globalVerdict).toBe("NOT_ESTABLISHED");
      expect(performance.now()-t).toBeLessThan(5000);expect(fetch).not.toHaveBeenCalled();expect(log).not.toHaveBeenCalled();
      expect(report.receipt.externalAttestation).toBe(false);
    } finally {fetch.mockRestore();log.mockRestore();}
    const source=readFileSync("src/modules/research-sandbox/math-lrc-proof-plan.ts","utf8");
    expect(source).not.toMatch(/from ["']node:(child_process|fs|https?)["']/);
    expect(Buffer.byteLength(JSON.stringify(report))).toBeLessThan(10000);
  });
  it.each([
    ["version",(r:ProofArithmeticReport)=>{r.version=2 as 1;}],
    ["source rehashed",(r:ProofArithmeticReport)=>{(r.source as {version:number}).version=1;}],
    ["source URL",(r:ProofArithmeticReport)=>{(r.source as {url:string}).url="https://example.invalid";}],
    ["Python source rehashed",(r:ProofArithmeticReport)=>{r.receipt.sourceSha256="a".repeat(64);}],
    ["plan source rehashed",(r:ProofArithmeticReport)=>{r.planDigest="b".repeat(64);}],
    ["theorem scope",(r:ProofArithmeticReport)=>{(r as unknown as {globalVerdict:string}).globalVerdict="PASS";}],
    ["assumptions closed",(r:ProofArithmeticReport)=>{(r as unknown as {assumptionsDischarged:boolean}).assumptionsDischarged=true;}],
    ["runner convention",(r:ProofArithmeticReport)=>{r.targets[0].movingSpeeds=14;}],
    ["prime doublecount",(r:ProofArithmeticReport)=>{r.targets[1].primes.push(239);}],
    ["composite replacement",(r:ProofArithmeticReport)=>{r.targets[0].primes[0]=85;}],
    ["missing prime",(r:ProofArithmeticReport)=>{r.targets[0].primes.pop();}],
    ["ci constant",(r:ProofArithmeticReport)=>{r.targets[0].ci[0].numerator="2";}],
    ["shape constant",(r:ProofArithmeticReport)=>{r.targets[0].shapeConstant.numerator="100";}],
    ["wrong signed logK",(r:ProofArithmeticReport)=>{r.targets[1].logBound.lower.numerator="-414";}],
    ["doublecount forced divisor",(r:ProofArithmeticReport)=>{r.targets[1].forcedDivisor="720720";}],
    ["fabricated margin",(r:ProofArithmeticReport)=>{r.targets[1].margin.lower.numerator="0";}],
    ["external attestation",(r:ProofArithmeticReport)=>{(r.receipt as unknown as {externalAttestation:boolean}).externalAttestation=true;}],
    ["unchecked field",(r:ProofArithmeticReport)=>{(r as unknown as {extra:string}).extra="unknown";}],
  ] as const)("rejects outer+output rehashed %s",(_name,mutate)=>{
    const r=structuredClone(report);mutate(r);expect(validateRetainedProofArithmetic(reseal(r,true))).toBeNull();
  });
  it("rejects oversized, cyclic, null, missing target and raw hash faults",()=>{
    expect(validateRetainedProofArithmetic({padding:"x".repeat(ALLIKVERE_PROOF_LIMITS.reportBytes)})).toBeNull();
    const cycle:{cycle?:unknown}={};cycle.cycle=cycle;expect(validateRetainedProofArithmetic(cycle)).toBeNull();
    expect(validateRetainedProofArithmetic(null)).toBeNull();
    const missing=structuredClone(report);missing.targets.pop();expect(validateRetainedProofArithmetic(reseal(missing,true))).toBeNull();
    const stale=structuredClone(report);stale.reportDigest="0".repeat(64);expect(validateRetainedProofArithmetic(stale)).toBeNull();
  });
});
