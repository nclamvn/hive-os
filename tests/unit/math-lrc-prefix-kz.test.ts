import { readFileSync } from "node:fs";
import { describe,expect,it } from "vitest";
import { canonicalJson,sha256 } from "@/modules/execution-fabric/contracts";
import { PREFIX_KZ_RETAINED_PATH,PREFIX_KZ_RETAINED_SHA256,reconstructPrefixKzBody,validateRetainedPrefixKzReport,prefixKzReplayBytes,prefixKzReportDigest,type PrefixKzReport } from "@/modules/research-sandbox/math-lrc-prefix-kz";

const bytes=readFileSync(PREFIX_KZ_RETAINED_PATH,"utf8"),retained=JSON.parse(bytes) as PrefixKzReport;
function rehash(r:PrefixKzReport) {
  const {generatedAt:_,receipt:__,reportDigest:___,...body}=r;void _;void __;void ___;
  const stdout=prefixKzReplayBytes(body);r.receipt.stdoutSha256=sha256(stdout);r.receipt.stdoutBytes=Buffer.byteLength(stdout);r.reportDigest=prefixKzReportDigest(r);return r;
}
describe("complete abstract prefix/KZ source audit",()=>{
  it("pins retained bytes and admits independently reconstructed complete domain",()=>{
    expect(sha256(bytes)).toBe(PREFIX_KZ_RETAINED_SHA256);expect(validateRetainedPrefixKzReport(retained)).toEqual(retained);
    const body=reconstructPrefixKzBody();expect(body.targets.map(t=>[t.movingSpeeds,t.dimension,t.prefixes.length,t.blocks.length,t.vertexAudit.maskCount])).toEqual([[13,12,12,78,2048],[14,13,13,91,4096]]);
    expect(body.globalVerdict).toBe("NOT_ESTABLISHED");expect(body.prefixArgument.lowerPremise).toBe("NOT_ESTABLISHED");expect(body.prefixArgument.geometricPremise).toBe("NOT_ESTABLISHED");
    expect(body.writtenBridge.formalProof).toBe(false);expect(body.writtenBridge.realDomainReduction).toContain("MINKOWSKI_WEYL");
  });
  it("retains exact source minima with a unique all-singleton equality vertex",()=>{
    expect(retained.targets.map(t=>t.vertexAudit.minimum)).toEqual([
      {numerator:"89348172069691",denominator:"3616460531462492894939937597619200000000"},
      {numerator:"2289670297",denominator:"97243124257250844122250000000000000000"},
    ]);
    for(const t of retained.targets) {
      expect(t.vertexAudit.equalityCount).toBe(1);expect(t.vertexAudit.equalityMask).toBe(2**(t.dimension-1)-1);expect(t.vertexAudit.firstMask).toBe(0);expect(t.vertexAudit.lastMask).toBe(t.vertexAudit.equalityMask);
      expect(t.blocks.filter(b=>b.start===b.end).every(b=>b.ratio.numerator==="1"&&b.ratio.denominator==="1")).toBe(true);
      expect(t.blocks.filter(b=>b.start!==b.end).every(b=>BigInt(b.ratio.numerator)>BigInt(b.ratio.denominator))).toBe(true);
    }
  });
  it("checks all25 exact prefix error capacities including equality witness threshold",()=>{
    let count=0;
    for(const t of retained.targets) for(const p of t.prefixes) {
      count++;expect(p.lowerLrcMax).toBe(t.movingSpeeds-p.r);expect(p.witnessThreshold).toEqual({numerator:"1",denominator:String(t.totalRunners)});
      const sn=BigInt(p.separation.numerator),sd=BigInt(p.separation.denominator),en=BigInt(p.errorCapacity.numerator),ed=BigInt(p.errorCapacity.denominator);
      expect((sn*ed-en*sd)*BigInt(t.totalRunners)).toBe(sd*ed);
      expect(BigInt(p.B.numerator)*ed*ed).toBe(BigInt(4)*en*en*BigInt(p.B.denominator));
    }
    expect(count).toBe(25);expect(retained.prefixArgument.equalityYieldsWitness).toBe(true);
  });
  it("keeps necessary-premise negative controls apart from LRC counterexamples",()=>{
    const [kz,growth]=retained.negativeControls;
    expect(kz).toMatchObject({id:"OMITTED_KZ",actualProduct:{numerator:"2",denominator:"1"},claimedMinimum:{numerator:"4",denominator:"1"},prefixFeasible:true,kzFeasible:false,growthPremise:true,isLrcCounterexample:false});
    expect(growth).toMatchObject({id:"OMITTED_GROWTH",actualProduct:{numerator:"48",denominator:"49"},claimedMinimum:{numerator:"1",denominator:"1"},prefixFeasible:true,kzFeasible:true,growthPremise:false,isLrcCounterexample:false});
  });
});
const attacks:[string,(r:PrefixKzReport)=>void][]=[
  ["missing block",r=>{r.targets[0].blocks.pop();}],
  ["duplicate block",r=>{r.targets[0].blocks[1]=structuredClone(r.targets[0].blocks[0]);}],
  ["reordered blocks",r=>{r.targets[0].blocks.reverse();}],
  ["forged block product",r=>{r.targets[0].blocks[2].geometricProduct.numerator="1";}],
  ["noncanonical rational",r=>{r.targets[0].prefixes[0].separation={numerator:"2",denominator:"26"};}],
  ["missing prefix",r=>{r.targets[0].prefixes.pop();}],
  ["lower premise promotion",r=>{(r.prefixArgument as unknown as {lowerPremise:string}).lowerPremise="PROVED";}],
  ["formal proof promotion",r=>{(r.writtenBridge as unknown as {formalProof:boolean}).formalProof=true;}],
  ["global theorem promotion",r=>{(r as unknown as {globalVerdict:string}).globalVerdict="PROVED";}],
  ["wrong stream",r=>{r.targets[0].vertexAudit.streamSha256="a".repeat(64);}],
  ["incomplete masks",r=>{r.targets[0].vertexAudit.maskCount--;r.targets[0].vertexAudit.lastMask--;}],
  ["minimum forgery",r=>{r.targets[0].vertexAudit.minimum={numerator:"1",denominator:"1"};}],
  ["equality forgery",r=>{r.targets[0].vertexAudit.equalityCount=2;}],
  ["wrong equality mask",r=>{r.targets[0].vertexAudit.equalityMask=0;}],
  ["wrong rho",r=>{r.rho={numerator:"1",denominator:"2"};}],
  ["unbounded dimension",r=>{r.targets[0].movingSpeeds=1000000;}],
  ["false feasibility",r=>{(r.targets[0].vertexAudit as unknown as {allFeasible:boolean}).allFeasible=false;}],
  ["unknown top field",r=>{Object.assign(r,{novelty:"ESTABLISHED"});}],
];
describe("consumer does not trust coherently rehashed certificates",()=>{
  it.each(attacks)("rejects %s",(_name,mutate)=>{const r=structuredClone(retained);mutate(r);expect(validateRetainedPrefixKzReport(rehash(r))).toBeNull();});
  it("rejects absent/cyclic/oversized input, receipts and source-version drift",()=>{
    const cyclic:{self?:unknown}={};cyclic.self=cyclic;
    for(const raw of [null,{},cyclic,{padding:"x".repeat(262145)}]) expect(validateRetainedPrefixKzReport(raw)).toBeNull();
    for(const mutate of [(r:PrefixKzReport)=>{r.receipt.elapsedMs=5001;},(r:PrefixKzReport)=>{r.receipt.elapsedMs=0;},(r:PrefixKzReport)=>{r.receipt.sourceSha256="b".repeat(64);},(r:PrefixKzReport)=>{r.receipt.stdoutBytes++;},(r:PrefixKzReport)=>{r.generatedAt="invalid";},(r:PrefixKzReport)=>{(r.receipt as unknown as {externalAttestation:boolean}).externalAttestation=true;}]) {
      const r=structuredClone(retained);mutate(r);r.reportDigest=prefixKzReportDigest(r);expect(validateRetainedPrefixKzReport(r)).toBeNull();
    }
  });
  it("derives exact stream semantics rather than accepting a hash-only enumeration",()=>{
    const source=readFileSync("src/modules/research-sandbox/math-lrc-prefix-kz.ts","utf8");
    expect(source).toContain("mask<count");expect(source).toContain("const block=cache.get");expect(source).toContain("Internal prefix infeasible");
    expect(canonicalJson(retained.targets.map(t=>t.vertexAudit.streamSha256))).toBe('["34c1eefa103ff1bff192b1737a2fbcc4a2bec93c62336e579b5134535dc7f03f","041244221e716b5e8cdf19f2ca7c5e1dbd422f99bd8732286fa4143d19af450c"]');
  });
});
