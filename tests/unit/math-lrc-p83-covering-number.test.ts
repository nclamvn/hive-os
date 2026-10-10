import { readFileSync } from "node:fs";
import { describe,expect,it } from "vitest";
import { canonicalJson,sha256 } from "@/modules/execution-fabric/contracts";
import { P83_COVERING_RETAINED_PATH,P83_COVERING_RETAINED_SHA256,reconstructP83CoveringNumberBody,p83CoveringReplayBytes,p83CoveringReportDigest,validateRetainedP83CoveringNumberReport,type P83CoveringNumberReport } from "@/modules/research-sandbox/math-lrc-p83-covering-number";
const bytes=readFileSync(P83_COVERING_RETAINED_PATH,"utf8"),retained=JSON.parse(bytes) as P83CoveringNumberReport;
function rehash(r:P83CoveringNumberReport){for(const root of r.certificate.roots)root.traceSha256=sha256(canonicalJson(root.nodes));const out=p83CoveringReplayBytes(r);r.receipt.stdoutBytes=Buffer.byteLength(out);r.receipt.stdoutSha256=sha256(out);r.reportDigest=p83CoveringReportDigest(r);return r;}
describe("complete actualp83 covering-number stage",()=>{
  it("admits frozen complete stage with every7172node certificate, never whole prime",()=>{
    expect(sha256(bytes)).toBe(P83_COVERING_RETAINED_SHA256);expect(validateRetainedP83CoveringNumberReport(retained)).toEqual(retained);
    expect(retained.certificate.roots.map(r=>r.nodeCount)).toEqual([836,1477,419,668,733,480,769,539,447,804]);expect(retained.certificate.totalNodes).toBe(7172);
    expect(retained.certificate.roots.reduce((n,r)=>n+r.nodes.length,0)).toBe(7172);expect(retained.result.tau).toBe(12);expect(retained.stageVerdict).toBe("COMPLETE");expect(retained.fullPrimeVerdict).toBe("NOT_ESTABLISHED");expect(retained.remaining.applicationObligationsOpen).toBe(23);
  });
  it("independently calculates all41 masks, all12cover witnesses and all41 unit symmetries",()=>{
    const masks=Array.from({length:41},(_,i)=>Array.from({length:41},(_,j)=>j+1).filter(t=>{const r=t*(i+1)%83;return Math.min(r,83-r)<=5;}));expect(masks).toEqual(retained.certificate.maskTable);expect(masks.every(m=>m.length===5)).toBe(true);
    const support=retained.result.cover12;expect(support).toHaveLength(12);expect(new Set(support).size).toBe(12);
    for(let t=1;t<=41;t++)expect(support.filter(v=>masks[v-1].includes(t))).toEqual(retained.certificate.witnessCoverage[t-1]);
    for(let g=1;g<=41;g++){const folded=(x:number)=>Math.min(x%83,83-x%83);for(let v=1;v<=41;v++)for(let t=1;t<=41;t++)expect(masks[v-1].includes(folded(g*t))).toBe(masks[folded(g*v)-1].includes(t));}
  });
  it("retains10 exhaustive private triples and domains; private bound implies a triple",()=>{
    expect(retained.certificate.roots.map(r=>r.triple)).toEqual([[1,2,3],[1,2,4],[1,2,5],[1,3,4],[1,3,5],[1,4,5],[2,3,4],[2,3,5],[2,4,5],[3,4,5]]);
    for(const r of retained.certificate.roots)expect(r.available).toEqual(retained.certificate.maskTable.flatMap((mask,i)=>i>0&&!r.triple.some(t=>mask.includes(t))?[i+1]:[]));
    for(let s=1;s<=11;s++)expect(82-5*s).toBeGreaterThan(2*s);
    expect(retained.mathematicalScope.zeroGainPurpose).toBe("DECISION_EXISTENCE_ONLY_NOT_ALL13_ENUMERATION");expect(retained.mathematicalScope.lowerLrcNeeded).toBe(false);
  });
  it("checks every encoded child is unique, reachable and preorder-covered",()=>{
    for(const root of retained.certificate.roots){const seen=new Set<number>();function walk(index:number){expect(seen.has(index)).toBe(false);seen.add(index);const node=root.nodes[index];expect(node).toBeDefined();if(node[0]===3){expect(node.length%2).toBe(0);let previous=0;for(let i=2;i<node.length;i+=2){expect(node[i]).toBeGreaterThan(previous);previous=node[i];expect(node[i+1]).toBeGreaterThan(index);walk(node[i+1]);}}else expect(node).toEqual([node[0]]);}walk(0);expect(seen.size).toBe(root.nodeCount);}
  });
  it("keeps synthetic equality control and author provenance distinct",()=>{
    expect(retained.certificate.boundaryPolicy).toBe("STRICT_OPEN_BAD");expect(retained.certificate.equalityControl).toEqual({modulus:14,speed:1,time:1,blocked:false,scope:"SYNTHETIC_BOUNDARY_CONTROL_NOT_P83"});
    expect(retained.source.authorTau).toEqual({nodes:63986,status:"REFERENCE_AUTHOR_REPORTED",authorCodeExecuted:false});expect(retained.source.archive.status).toBe("CHECKSUM_IDENTITY_NOT_PROOF");expect(retained.formalProof).toBe(false);expect(retained.remaining.all61PrimesAccepted).toBe(false);
    expect(reconstructP83CoveringNumberBody().certificate).toEqual(retained.certificate);
  });
});
const attacks:[string,(r:P83CoveringNumberReport)=>void][]=[
  ["threshold policy",r=>Object.assign(r.certificate,{boundaryPolicy:"CLOSED_BAD"})],
  ["equality blocked",r=>Object.assign(r.certificate.equalityControl,{blocked:true})],
  ["wrong mask",r=>{r.certificate.maskTable[0][0]=6;}],
  ["omitted root",r=>{r.certificate.roots.pop();}],
  ["duplicate root",r=>{r.certificate.roots[1]=structuredClone(r.certificate.roots[0]);}],
  ["changed triple",r=>{r.certificate.roots[0].triple[0]=2;}],
  ["changed available",r=>{r.certificate.roots[0].available.pop();}],
  ["omitted branch",r=>{r.certificate.roots[0].nodes[0].splice(2,2);}],
  ["duplicate branch",r=>{r.certificate.roots[0].nodes[0][4]=r.certificate.roots[0].nodes[0][2];}],
  ["changed child exclusion",r=>{r.certificate.roots[0].nodes[0][3]++;}],
  ["changed pivot",r=>{r.certificate.roots[0].nodes[0][1]++;}],
  ["changed prune",r=>{const node=r.certificate.roots[0].nodes.find(n=>n[0]!==3)!;node[0]=(node[0]+1)%3;}],
  ["false emptyU cover",r=>{r.certificate.roots[0].nodes[1]=[4];}],
  ["missing node",r=>{r.certificate.roots[0].nodes.pop();r.certificate.roots[0].nodeCount--;}],
  ["forged total",r=>{r.certificate.totalNodes--;}],
  ["invalid12cover",r=>{Object.assign(r.result.cover12,{0:2});}],
  ["wrong witness evidence",r=>{r.certificate.witnessCoverage[0]=[];}],
  ["unit normalization misuse",r=>Object.assign(r.mathematicalScope,{normalization:"TIMES_BY_INVERSE"})],
  ["zero-gain reused for13",r=>Object.assign(r.mathematicalScope,{zeroGainPurpose:"ALL13_ENUMERATION"})],
  ["author source promoted",r=>Object.assign(r.source.authorTau,{status:"INDEPENDENTLY_REPLAYED"})],
  ["archive identity promoted",r=>Object.assign(r.source.archive,{status:"PROOF_ACCEPTED"})],
  ["wholeprime promoted",r=>Object.assign(r,{fullPrimeVerdict:"COMPLETE"})],
  ["global promoted",r=>Object.assign(r,{globalVerdict:"PROVED"})],
  ["formal promoted",r=>Object.assign(r,{formalProof:true})],
  ["all61 accepted",r=>Object.assign(r.remaining,{all61PrimesAccepted:true})],
  ["old obligation closed",r=>Object.assign(r.remaining,{applicationObligationsOpen:22})],
  ["generation closed",r=>Object.assign(r.remaining,{generation:"COMPLETE"})],
  ["extra claim",r=>Object.assign(r,{novelty:"PROVED"})],
];
describe("independent semantic admission, coherent hashes insufficient",()=>{
  it.each(attacks)("rejects coherent rehash %s",(_name,mutate)=>{const r=structuredClone(retained);mutate(r);expect(validateRetainedP83CoveringNumberReport(rehash(r))).toBeNull();});
  it("rejects malformed, oversize, cyclic and forged unsigned receipts",()=>{
    const cyclic:{self?:unknown}={};cyclic.self=cyclic;for(const raw of [null,{},cyclic,{data:"x".repeat(262145)}])expect(validateRetainedP83CoveringNumberReport(raw)).toBeNull();
    for(const mutate of [(r:P83CoveringNumberReport)=>{r.generatedAt="invalid";},(r:P83CoveringNumberReport)=>{r.receipt.elapsedMs=0;},(r:P83CoveringNumberReport)=>{r.receipt.elapsedMs=5001;},(r:P83CoveringNumberReport)=>{r.receipt.sourceSha256="a".repeat(64);},(r:P83CoveringNumberReport)=>Object.assign(r.receipt,{externalAttestation:true})]){const r=structuredClone(retained);mutate(r);r.reportDigest=p83CoveringReportDigest(r);expect(validateRetainedP83CoveringNumberReport(r)).toBeNull();}
  });
});
