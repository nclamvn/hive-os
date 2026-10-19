import { readFileSync } from "node:fs";
import { describe,expect,it } from "vitest";
import { canonicalJson,sha256 } from "@/modules/execution-fabric/contracts";
import { P83_TERMINAL_RETAINED_PATH,P83_TERMINAL_TREE_PATH,P83_TERMINAL_RETAINED_SHA256,P83_TERMINAL_TREE_SHA256,P83_TERMINAL_DEPENDENCY,p83TerminalBinarySha256,p83TerminalReportDigest,p83TerminalBoundaryControl,p83TerminalBridgeControls,validateP83TerminalInputs,validateP83TerminalEvidence,validateRetainedP83TerminalReport,type P83TerminalReport } from "@/modules/research-sandbox/math-lrc-p83-terminal";
const raw=readFileSync(P83_TERMINAL_RETAINED_PATH,"utf8"),report=JSON.parse(raw) as P83TerminalReport;
const ancestors=readFileSync(P83_TERMINAL_DEPENDENCY.ancestorPath),final32=readFileSync(P83_TERMINAL_DEPENDENCY.final32Path),tree=readFileSync(P83_TERMINAL_TREE_PATH);
const metadata={roots:report.roots,counts:report.counts,boundary:report.boundary,bridge:report.bridge,finiteConclusion:report.finiteConclusion,encoding:report.encoding};
const gcd=(a:number,b:number):number=>{while(b){const r=a%b;a=b;b=r;}return a;};
describe("entire p83 terminal and finite224 inference",()=>{
  it("pins only passive admitted summary, scopedONEprime with allglobal applicationsOPEN",()=>{
    expect(sha256(raw)).toBe(P83_TERMINAL_RETAINED_SHA256);expect(validateRetainedP83TerminalReport(report)).toEqual(report);expect(p83TerminalBinarySha256(tree)).toBe(P83_TERMINAL_TREE_SHA256);expect(report.counts).toEqual({roots:2,nodes:607854,forces:668179});
    expect(report.finiteConclusion).toEqual({I:"EMPTY_AT_224",J:"EMPTY",scope:"ONE_ACTUAL_PRIME_ONLY"});expect(report.remaining).toEqual({otherP13PrimesUnaccepted:60,global:"NOT_ESTABLISHED",lowerLrcIndependentReproduction:"OPEN",applicationObligationsOpen:23,formalProof:false});expect(report.receipt.externalAttestation).toBe(false);
  });
  it("accounts weighted7^13 at EACH root, disjointcertificate regions notglobal gcd-only counts",()=>{
    expect(report.roots.map(r=>[r.gridCertifiedMass,r.gcdCertifiedMass])).toEqual([[96889010402,5],[96889010401,6]]);for(const r of report.roots){expect(r.domainMass).toBe(7**13);expect(r.totalMass).toBe(r.domainMass);expect(r.gridCertifiedMass+r.gcdCertifiedMass).toBe(r.totalMass);expect(r.originalGcdCompletionsChecked).toBe(r.gcdCertifiedMass);expect(r.gcdLeaves).toBe(1);expect(Number.isSafeInteger(r.totalMass)).toBe(true);expect(r.maxDepth).toBeLessThanOrEqual(13);}
    // Global gcd-proper domain has79 distinct tuples per root. The5/6 mass
    // above is a particular disjoint certificate region, not all gcd tuples.
    for(const root of report.roots){const base=root.ancestor.map(v=>v+166*((7-(3*v%7))%7)),tuples=new Set<string>();for(let omit=0;omit<13;omit++)for(let a=0;a<7;a++){const v=base.slice();v[omit]=root.ancestor[omit]+166*a;tuples.add(v.join(","));}expect(tuples.size).toBe(79);for(const s of tuples){const v=s.split(",").map(Number);let valid=false;for(let omit=0;omit<13;omit++){let g=14;for(let i=0;i<13;i++)if(i!==omit)g=gcd(g,v[i]);if(g>1)valid=true;}expect(valid).toBe(true);}}
  });
  it("checks ACTUAL equality endpoints and all7choices; closedbad breaks uniqueness",()=>{
    expect(p83TerminalBoundaryControl()).toEqual(report.boundary);expect(report.boundary.choices.map(c=>c.bad)).toEqual(Array(7).fill(false));expect(report.boundary.closedBadDigits).toEqual([0,1]);expect(report.boundary.choices.slice(0,2).map(c=>[c.residue,c.distance])).toEqual([[83,83],[1079,83]]);for(const c of report.boundary.choices){expect(14*c.distance>=1162).toBe(true);expect(c.bad).toBe(14*c.distance<1162);}
  });
  it("checks lcm224 (NOT14→32) and every82CRT unit lift exactly",()=>{
    expect(p83TerminalBridgeControls()).toEqual(report.bridge);expect(14*32/gcd(14,32)).toBe(224);expect(32%14).not.toBe(0);expect(14%32).not.toBe(0);expect(report.bridge.crtUnits).toHaveLength(82);for(const {baseUnit,multiplier,gcd:g} of report.bridge.crtUnits){expect(multiplier%83).toBe(baseUnit);expect(multiplier%224).toBe(1);expect(gcd(multiplier,83*224)).toBe(1);expect(g).toBe(1);}expect(report.bridge.level1WitnessBranchesIncluded).toBe(true);expect(report.bridge.writtenProofNotFormal).toBe(true);
  });
  it("consumes entire058ancestor/final32 dataset and independently reduces ALL32rows",()=>{expect(validateP83TerminalInputs(ancestors,final32)).toEqual(report.roots.map(r=>r.ancestor));expect(ancestors.length).toBe(52);expect(final32.length).toBe(832);});
  it("actual positive admission fully regenerates ALL nodes/forces/partition masses",()=>{expect(validateP83TerminalEvidence({tree,metadata},ancestors,final32)).toEqual(metadata);},180000);
  it("does not dispatch heavy replay or oldsemanticadmission from passiveGET",()=>{
    const source=readFileSync("src/modules/research-sandbox/math-lrc-p83-terminal.ts","utf8"),fn=source.slice(source.indexOf("export function validateRetainedP83TerminalReport"));expect(fn).toContain("P83_TERMINAL_RETAINED_SHA256");for(const word of ["reconstructP83TerminalEvidence(","validateP83TerminalEvidence(","readFile","execFile","validateRetainedP83CascadeReport"])expect(fn).not.toContain(word);expect(source).toContain("incomplete local partition");expect(source).toContain("terminal improper SAT");expect(source).toContain("bad arc overlap");
  });
});
const faults:[string,(r:P83TerminalReport)=>void][]=[
  ["missing root",r=>{r.roots.pop();}],["duplicate root",r=>{r.roots[1]=r.roots[0];}],["changed ancestor",r=>{r.roots[1].ancestor[12]++;}],["mass lost",r=>{r.roots[0].totalMass--;}],["gcd region inflated",r=>{r.roots[0].gcdCertifiedMass++;}],["forged node",r=>{r.counts.nodes--;}],["wrong gain",r=>{r.roots[0].gainPrunes--;}],["raw overlap forged",r=>{r.roots[0].gcdRegionGridWitnessOverlap++;}],["closed boundary",r=>{r.boundary.choices[0].bad=true;}],["wrong commonlevel",r=>Object.assign(r.bridge,{commonLevel:32})],["omitted CRT unit",r=>{r.bridge.crtUnits.pop();}],["wrong CRT lift",r=>{r.bridge.crtUnits[1].multiplier++;}],["level1 branch omitted",r=>Object.assign(r.bridge,{level1WitnessBranchesIncluded:false})],["global promoted",r=>Object.assign(r.remaining,{global:"PROVED"})],["other primes promoted",r=>Object.assign(r.remaining,{otherP13PrimesUnaccepted:0})],["lower premise promoted",r=>Object.assign(r.remaining,{lowerLrcIndependentReproduction:"COMPLETE"})],["old applications closed",r=>Object.assign(r.remaining,{applicationObligationsOpen:22})],["formal promoted",r=>Object.assign(r.remaining,{formalProof:true})],["external promoted",r=>Object.assign(r.receipt,{externalAttestation:true})],["fresh GET promoted",r=>Object.assign(r.trust,{get:"FRESH_REPLAY"})],["tree drift",r=>{r.datasets.tree.sha256="b".repeat(64);}],["dependency drift",r=>Object.assign(r.dependency,{sha256:"a".repeat(64)})]
];
describe("terminal completeness and passive promotion failures",()=>{
  it.each(faults)("rejects coherent summary rehash: %s",(_name,mutate)=>{const r=structuredClone(report);mutate(r);const {reportDigest:discard,...body}=r;void discard;r.reportDigest=p83TerminalReportDigest(body);expect(validateRetainedP83TerminalReport(JSON.parse(canonicalJson(r)))).toBeNull();});
  it("rejects malformed/oversize/cyclic summaries",()=>{const cycle:{self?:unknown}={};cycle.self=cycle;for(const r of [null,{},cycle,{data:"x".repeat(262145)}])expect(validateRetainedP83TerminalReport(r)).toBeNull();});
  it("rejects skipped/duplicated/orphan/truncated roots and falseforce/digit/time/gain/gcd/SAT nodes",()=>{
    for(const mutate of [(b:Buffer)=>b.subarray(0,-1),(b:Buffer)=>Buffer.concat([b,Buffer.from([0])]),(b:Buffer)=>{b[8]=1;return b;},(b:Buffer)=>{b[9]++;return b;},(b:Buffer)=>{b.writeUInt32BE(1000001,35);return b;},(b:Buffer)=>{b[43]=255;return b;},(b:Buffer)=>{b[43]=253;return b;},(b:Buffer)=>{b[43]=252;return b;},(b:Buffer)=>{b[44]=255;return b;},(b:Buffer)=>{b[45]=255;return b;}])expect(validateP83TerminalEvidence({tree:mutate(Buffer.from(tree)),metadata},ancestors,final32)).toBeNull();
  });
  it("rejects missing/drifted final32 or ancestor inputs and exhaustedoriginaldeadline despiteexacttreepin",()=>{
    expect(validateP83TerminalInputs(ancestors.subarray(0,26),final32)).toBeNull();const a=Buffer.from(ancestors);a[51]++;expect(validateP83TerminalInputs(a,final32)).toBeNull();const f=Buffer.from(final32);f[831]++;expect(validateP83TerminalInputs(ancestors,f)).toBeNull();for(const ms of [0,-1,0.5,Infinity,1])expect(validateP83TerminalEvidence({tree,metadata},ancestors,final32,ms)).toBeNull();expect(validateP83TerminalEvidence({tree,metadata},a,final32)).toBeNull();
  });
});
