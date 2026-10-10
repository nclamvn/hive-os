import { readFileSync } from "node:fs";
import { describe,expect,it,vi } from "vitest";
import { canonicalJson,sha256 } from "@/modules/execution-fabric/contracts";
import { createDomainProblemContract,admitCandidate,createHostVerifier,prepareProblemContract,prepareSolverRequest } from "@/modules/research-sandbox/research-core-v3";
import { createCheckBudget } from "@/modules/research-sandbox/research-core-v3/check-budget";
import { rationalIntervalFloorAdapter as adapter } from "@/modules/research-sandbox/research-core-v3/domains/rational-interval-floor";
import { ResearchCoreRefusal } from "@/modules/research-sandbox/research-core-v3/types";
import { controlledCampaignProfile,publicCampaignProfiles } from "@/modules/research-sandbox/research-evaluation-v3/fixed-campaign-catalog";

const r=(numerator:string,denominator="1")=>({numerator,denominator});
const q=(n:string,d="1")=>({op:"Q",...r(n,d)});
const binary=(op:string,left:unknown,right:unknown)=>({op,left,right});
const input=(expression:unknown)=>({kind:"RATIONAL_EXPRESSION",expression});
const base=input(binary("DIV",q("-7"),q("3")));
const make=(raw:unknown=base)=>createDomainProblemContract({id:"r3-interval",rootId:"RESEARCH_CORE_V3_076",target:"Floor only the sealed exact rational expression",mode:"ENGINEERING",adapterId:adapter.id,input:raw,obligationId:"exact"});
const claim=(raw:unknown=base)=>({kind:"INTERVAL_FLOOR_CERTIFICATE",inputDigest:sha256(canonicalJson(raw)),lower:r("-5","2"),upper:r("-9","4"),floor:"-3"});
const actualPin=sha256(readFileSync("src/modules/research-sandbox/research-core-v3/domains/rational-interval-floor.ts","utf8"));
function run(raw:unknown=base,candidate:unknown=claim(raw),now=()=>0){
  const prepared=make(raw),c=admitCandidate(prepared,"exact",canonicalJson(candidate)),reserveCheck=vi.fn();
  const verifier=createHostVerifier({runtimeSourceDigest:actualPin,sourceBundleDigest:actualPin,authorityEpoch:"r3-unit",checkerSourceDigests:{[adapter.id]:actualPin},reserveCheck,now});
  const receipt=verifier.verify({prepared,obligationId:"exact",candidate:c,attemptId:"unit-1",inputDigest:prepared.inputDigest});
  return {prepared,c,receipt,closure:verifier.projectClosure(prepared,"exact",receipt),verifier,reserveCheck};
}
function refused(fn:()=>unknown,code:string){try{fn();throw Error("Expected refusal");}catch(e){expect(e).toBeInstanceOf(ResearchCoreRefusal);expect((e as ResearchCoreRefusal).code).toBe(code);}}

describe("R3 independently authored sealed rational interval/floor adapter",()=>{
  it("registers only a domain catalog extension and exact declared caps",()=>{
    expect(adapter.limits).toMatchObject({maxInputBytes:16384,maxCandidateBytes:4096,maxIntegerBits:64,maxIntermediateBits:256,maxOperations:32768,maxCheckMilliseconds:1000});
    expect(adapter.limits.maxDimensions).toMatchObject({expressionNodes:31,expressionDepth:6});
    expect(Object.isFrozen(adapter.limits)).toBe(true);
  });
  it("accepts independently derived negative floor, not truncation",()=>{const v=run();expect(v.receipt.result).toBe("VERIFIED");expect(v.closure.status).toBe("CLOSED_EXACT_SCOPE");expect(v.closure.wholeProblemSolved).toBe(false);expect(v.receipt.checkerSourceDigest).toBe(actualPin);expect(v.reserveCheck).toHaveBeenCalledOnce();});
  it("rejects negative truncation toward zero",()=>expect(run(base,{...claim(),floor:"-2"}).receipt.scientificDisposition).toBe("INVALID_CANDIDATE"));
  it("independently checks value even when both supplied endpoints share a floor",()=>{const v=run(base,{...claim(),lower:r("-2"),upper:r("-3","2"),floor:"-2"});expect(v.receipt.result).toBe("REJECTED");expect(v.receipt.refutation).toBeNull();});
  it("rejects false enclosure even with correct floor",()=>expect(run(base,{...claim(),lower:r("-3"),upper:r("-5","2")}).receipt.result).toBe("REJECTED"));
  it("rejects lower bound above exact value",()=>expect(run(base,{...claim(),lower:r("-9","4"),upper:r("-2")}).receipt.result).toBe("REJECTED"));
  it("keeps valid straddle inconclusive without inventing narrower endpoints",()=>{const v=run(base,{...claim(),lower:r("-3"),upper:r("-2")});expect(v.receipt.result).toBe("INCONCLUSIVE");expect(v.closure.status).toBe("OPEN");expect(v.c.normalized).toEqual({...claim(),lower:r("-3"),upper:r("-2")});});
  it("rejects wrong inputDigest despite numerically valid enclosure",()=>expect(run(base,{...claim(),inputDigest:sha256("different AST")}).receipt.result).toBe("REJECTED"));
  it("rejects malformed input digest at intake",()=>refused(()=>admitCandidate(make(),"exact",canonicalJson({...claim(),inputDigest:"approved"})),"SCHEMA_REFUSED"));
  it("accepts exact integer singleton enclosure",()=>{const raw=input(q("2"));expect(run(raw,{...claim(raw),lower:r("2"),upper:r("2"),floor:"2"}).receipt.result).toBe("VERIFIED");});
  it("treats upper endpoint at next integer as straddling",()=>{const raw=input(q("1","2"));expect(run(raw,{...claim(raw),lower:r("0"),upper:r("1"),floor:"0"}).receipt.result).toBe("INCONCLUSIVE");});
  it.each(["ADD","SUB","MUL","DIV"])("derives %s independently",op=>{const raw=input(binary(op,q("6"),q("2"))),n={ADD:"8",SUB:"4",MUL:"12",DIV:"3"}[op]!;expect(run(raw,{...claim(raw),lower:r(n),upper:r(n),floor:n}).receipt.result).toBe("VERIFIED");});
  it("normalizes derived denominator sign without changing submitted constants",()=>{const raw=input(binary("DIV",q("7"),q("-3")));expect(run(raw,claim(raw)).receipt.result).toBe("VERIFIED");});
  it("refuses constant division by zero at input admission",()=>refused(()=>make(input(binary("DIV",q("1"),q("0")))),"SCHEMA_REFUSED"));
  it("refuses composite zero divisor before any candidate",()=>refused(()=>make(input(binary("DIV",q("1"),binary("SUB",q("1"),q("1"))))),"SCHEMA_REFUSED"));
  it.each([r("2","4"),r("0","2"),r("1","-2"),r("1","0"),r("-0"),r("01"),r("1.5"),r("+1")])("refuses noncanonical rational %#",v=>refused(()=>make(input({op:"Q",...v})),"SCHEMA_REFUSED"));
  it("refuses noncanonical candidate endpoint",()=>refused(()=>admitCandidate(make(),"exact",canonicalJson({...claim(),lower:r("-10","4")})),"SCHEMA_REFUSED"));
  it("refuses reversed endpoints before verification",()=>refused(()=>admitCandidate(make(),"exact",canonicalJson({...claim(),lower:r("-2"),upper:r("-3")})),"SCHEMA_REFUSED"));
  it("refuses unknown AST operator or array alias",()=>{for(const op of ["SIN",["ADD"]])refused(()=>make(input({op,left:q("1"),right:q("1")})),"SCHEMA_REFUSED");});
  it("refuses extra AST or certificate fields",()=>{refused(()=>make(input({...q("1"),execute:"arbitrary"})),"SCHEMA_REFUSED");refused(()=>admitCandidate(make(),"exact",canonicalJson({...claim(),receiptDigest:actualPin})),"SCHEMA_REFUSED");});
  it("bounds operand bits before arithmetic",()=>refused(()=>make(input(q((BigInt(1)<<BigInt(64)).toString()))),"RESOURCE_REFUSED"));
  it("bounds nodes before large semantic work",()=>{const tree=(depth:number):unknown=>depth?binary("ADD",tree(depth-1),tree(depth-1)):q("1");refused(()=>make(input(tree(5))),"RESOURCE_REFUSED");});
  it("bounds expression depth independently of node count",()=>{let expr:unknown=q("1");for(let i=0;i<6;i++)expr=binary("ADD",q("1"),expr);refused(()=>make(input(expr)),"RESOURCE_REFUSED");});
  it("admits exact31node depth5 maximum shape",()=>{const tree=(d:number):unknown=>d?binary("ADD",tree(d-1),tree(d-1)):q("1");const raw=input(tree(4));expect(run(raw,{...claim(raw),lower:r("16"),upper:r("16"),floor:"16"}).receipt.coverage).toMatchObject({expressionNodes:31});});
  it("refuses intermediate product BEFORE its allocation",()=>{const n=((BigInt(1)<<BigInt(63))-BigInt(1)).toString();const e=binary("MUL",binary("MUL",q(n),q(n)),binary("MUL",q(n),binary("MUL",q(n),q(n))));refused(()=>make(input(e)),"RESOURCE_REFUSED");});
  it("refuses input/candidate bytes before shape or hashing",()=>{refused(()=>adapter.parseInput(" ".repeat(16385)),"RESOURCE_REFUSED");refused(()=>admitCandidate(make(),"exact"," ".repeat(4097)),"RESOURCE_REFUSED");});
  it("operation exhaustion is not exact closure",()=>{const raw=adapter.parseInput(base),candidate=adapter.parseCandidate(claim(),raw);const b=createCheckBudget({...adapter.limits,maxOperations:1},()=>0).budget;refused(()=>adapter.check(raw,candidate,b),"RESOURCE_REFUSED");});
  it("host timeout retains INCONCLUSIVE, never clamps elapsed",()=>{let calls=0;const v=run(base,claim(),()=>calls++===0?0:1001);expect(v.receipt.result).toBe("INCONCLUSIVE");expect(v.receipt.elapsedMilliseconds).toBe(1001);expect(v.closure.status).toBe("OPEN");});
  it("retains original candidate bytes and refuses serialized receipt authority",()=>{const v=run();expect(v.c.candidateDigest).toBe(sha256(v.c.originalBytes));refused(()=>v.verifier.projectClosure(v.prepared,"exact",JSON.parse(canonicalJson(v.receipt))),"AUTHORITY_REFUSED");});
  it("restores exact contract through generic admission and refuses target drift",()=>{const p=make();expect(prepareProblemContract(canonicalJson(p.contract)).inputDigest).toBe(p.inputDigest);const c=structuredClone(p.contract);c.obligations[0].predicate={globalTheorem:true};refused(()=>prepareProblemContract(c),"ALIGNMENT_REFUSED");});
  it("generic request exposes methods/schema but not hidden references",()=>{const request=prepareSolverRequest(make(),"exact");expect(JSON.stringify(request)).toContain("INTERVAL_FLOOR_CERTIFICATE");expect(JSON.stringify(request)).not.toContain("referenceDigest");});
  it("public fourth profile carries no private candidate/reference fields",()=>{const profile=controlledCampaignProfile("RATIONAL_NEGATIVE_FLOOR");expect(profile.envelopeMethods).toHaveLength(2);expect(publicCampaignProfiles()).toHaveLength(4);expect(JSON.stringify(publicCampaignProfiles())).not.toContain("candidateBytes");expect(JSON.stringify(publicCampaignProfiles())).not.toContain("referenceDigest");});
  it("checks only sealed expression scope, no mathematical target refutation",()=>{const v=run(base,{...claim(),floor:"3"});expect(v.receipt.refutation).toBeNull();expect(v.closure.noveltyEstablished).toBe(false);expect(v.receipt.checkedScope).toMatchObject({arithmetic:"EXACT_Q",certificate:"SUBMITTED_INTERVAL_AND_FLOOR_ONLY"});});
  it("direct parses reject getters without invoking them",()=>{let reads=0;refused(()=>adapter.parseInput({get kind(){reads++;return "RATIONAL_EXPRESSION";},expression:q("1")}),"SCHEMA_REFUSED");expect(reads).toBe(0);});
  it("pins entire frozen generic/QA manifest without any core edit",()=>{const text=readFileSync("docs/verification/TIP-076_R3_GENERIC_FREEZE.json","utf8");expect(sha256(text)).toBe("1c9592bc88e10cfc2efe0ab0ce59a654d95b1f7bfefb075394f25ad97724facf");const m=JSON.parse(text);for(const pins of [m.frozenSourcePins,m.frozenQaPresentationPins])for(const [path,pin]of Object.entries(pins))expect(sha256(readFileSync(path as string,"utf8"))).toBe(pin);});
});
