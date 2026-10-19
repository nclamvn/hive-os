import { readFileSync } from "node:fs";
import { describe,expect,it } from "vitest";
import { canonicalJson,sha256 } from "@/modules/execution-fabric/contracts";
import { P83_GENERATION_RETAINED_PATH,P83_GENERATION_RETAINED_SHA256,P83_GENERATION_PATHS,P83_GENERATION_BINARY_PINS,p83GenerationBinarySha256,p83GenerationReportDigest,inspectP83GenerationEvidence,validateP83GenerationEvidence,validateRetainedP83GenerationReport,type P83GenerationEvidence,type P83GenerationReport } from "@/modules/research-sandbox/math-lrc-p83-generation";
const raw=readFileSync(P83_GENERATION_RETAINED_PATH,"utf8"),report=JSON.parse(raw) as P83GenerationReport;
const evidence:P83GenerationEvidence={tree:readFileSync(P83_GENERATION_PATHS.tree),cover12:readFileSync(P83_GENERATION_PATHS.cover12),cover13:readFileSync(P83_GENERATION_PATHS.cover13)};
const clone=()=>({tree:Uint8Array.from(evidence.tree),cover12:Uint8Array.from(evidence.cover12),cover13:Uint8Array.from(evidence.cover13)});
function folded(x:number){const r=x%83;return Math.min(r,83-r);}
describe("complete p83 generator passive summary and exact retained datasets",()=>{
  it("pins locally admitted summary only; all gates beyond generation remain open",()=>{
    expect(sha256(raw)).toBe(P83_GENERATION_RETAINED_SHA256);expect(validateRetainedP83GenerationReport(report)).toEqual(report);
    expect(report.counts).toEqual({canonical12:2042,irredundant13:41552,reducible13:74351,canonical13:115903,repeated13:24504,totalNodes:1939746});expect(report.roots).toHaveLength(20);
    expect(report.trust.get).toBe("PASSIVE_PINNED_SUMMARY_NOT_FRESH_REPLAY");expect(report.remaining).toEqual({cascade:"OPEN",terminal:"OPEN",fullPrime:"NOT_ESTABLISHED",global:"NOT_ESTABLISHED",applicationObligationsOpen:23,all61PrimesAccepted:false,formalProof:false});
    expect(report.source.authorCodeExecuted).toBe(false);expect(report.receipt.externalAttestation).toBe(false);
  });
  it("retains complete structurally covered forest and all fixed-width sorted rows",()=>{
    expect(inspectP83GenerationEvidence(evidence)).toBe(true);expect(evidence.tree.length).toBe(5030766);expect(evidence.cover12.length).toBe(24504);expect(evidence.cover13.length).toBe(1506739);
    for(const key of ["tree","cover12","cover13"] as const)expect(p83GenerationBinarySha256(evidence[key])).toBe(P83_GENERATION_BINARY_PINS[key]);
    expect(report.roots.reduce((n,r)=>n+r.nodes,0)).toBe(1939746);expect(report.roots.reduce((n,r)=>n+r.traceBytes,0)+20*11+8).toBe(evidence.tree.length);
  });
  it("checks all2042 seed covers are distinct/minimal and all115903 rows cover every time",()=>{
    const masks=Array.from({length:41},(_,i)=>{let lo=0,hi=0;for(let t=1;t<=41;t++)if(folded((i+1)*t)<=5){if(t<=32)lo|=1<<(t-1);else hi|=1<<(t-33);}return [lo>>>0,hi];});
    for(const [key,width]of [["cover12",12],["cover13",13]] as const){const data=evidence[key];let repeated=0;
      for(let offset=0;offset<data.length;offset+=width){let lo=0,hi=0;const row=Array.from(data.slice(offset,offset+width));for(const v of row){lo|=masks[v-1][0];hi|=masks[v-1][1];}expect(lo>>>0).toBe(0xffffffff);expect(hi).toBe(511);
        if(new Set(row).size<width)repeated++;
        if(width===12)for(let omit=0;omit<12;omit++){let otherLo=0,otherHi=0;for(let j=0;j<12;j++)if(j!==omit){otherLo|=masks[row[j]-1][0];otherHi|=masks[row[j]-1][1];}expect((masks[row[omit]-1][0]&~otherLo)!==0||(masks[row[omit]-1][1]&~otherHi)!==0).toBe(true);}
      }
      expect(repeated).toBe(width===12?0:24504);
    }
  });
  it("does not erase repeats in canonicalization or restrict extensions to new classes",()=>{
    const seed=Array.from(evidence.cover12.slice(0,12)),extended=[...seed,seed[0]];
    const images=Array.from({length:41},(_,i)=>extended.map(v=>folded((i+1)*v)).sort((a,b)=>a-b)),canonical=images.map(r=>String.fromCharCode(...r)).sort()[0],found=Buffer.from(canonical,"latin1");
    let present=false;for(let i=0;i<evidence.cover13.length;i+=13)if(evidence.cover13.slice(i,i+13).every((v,j)=>v===found[j])){present=true;break;}
    expect(present).toBe(true);expect(new Set(canonical).size).toBe(12);
  });
  it("keeps passiveGET separate from full semantic reconstruction and documents encoding",()=>{
    const source=readFileSync("src/modules/research-sandbox/math-lrc-p83-generation.ts","utf8"),fn=source.slice(source.indexOf("export function validateRetainedP83GenerationReport"));
    expect(fn).toContain("P83_GENERATION_RETAINED_SHA256");expect(fn).not.toContain("reconstructP83GenerationEvidence(");expect(fn).not.toContain("validateP83GenerationEvidence(");expect(fn).not.toContain("inspectP83GenerationEvidence(");
    expect(source).toContain("Positive admission");expect(source).toContain("STILL regenerates every node/row");expect(source).toContain("slots===0");
  });
});
const summaryFaults:[string,(r:P83GenerationReport)=>void][]=[
  ["missing root",r=>{r.roots.pop();}],["forged nodes",r=>{r.counts.totalNodes--;}],["forged rows",r=>{r.counts.canonical13--;}],["wrong dataset hash",r=>{r.datasets.cover13.sha256="a".repeat(64);}],
  ["source promoted",r=>Object.assign(r.source,{authorCodeExecuted:true})],["freshGET claim",r=>Object.assign(r.trust,{get:"FRESH_SEMANTIC_REPLAY"})],["cascade promoted",r=>Object.assign(r.remaining,{cascade:"COMPLETE"})],["terminal promoted",r=>Object.assign(r.remaining,{terminal:"COMPLETE"})],["wholeprime promoted",r=>Object.assign(r.remaining,{fullPrime:"COMPLETE"})],["global promoted",r=>Object.assign(r.remaining,{global:"PROVED"})],["formal promoted",r=>Object.assign(r.remaining,{formalProof:true})],["old gate closed",r=>Object.assign(r.remaining,{applicationObligationsOpen:22})],["all61 promoted",r=>Object.assign(r.remaining,{all61PrimesAccepted:true})],["receipt source drift",r=>{r.receipt.sourceSha256="b".repeat(64);}],
];
describe("fixed passive identity and full-evidence failclosed inputs",()=>{
  it.each(summaryFaults)("rejects coherently rehashed summary %s",(_name,mutate)=>{const r=structuredClone(report);mutate(r);r.reportDigest=p83GenerationReportDigest(r);expect(validateRetainedP83GenerationReport(JSON.parse(canonicalJson(r)))).toBeNull();});
  it("rejects malformed/oversized/cyclic summaries",()=>{const cyclic:{self?:unknown}={};cyclic.self=cyclic;for(const r of [null,{},cyclic,{data:"x".repeat(262145)}])expect(validateRetainedP83GenerationReport(r)).toBeNull();});
  it("rejects missing/orphan/duplicate root or branch and truncated certificates",()=>{
    for(const mutate of [(e:P83GenerationEvidence)=>{e.tree=e.tree.slice(0,-1);},(e:P83GenerationEvidence)=>{e.tree=Uint8Array.from([...e.tree,0]);},(e:P83GenerationEvidence)=>{e.tree[9]=2;},(e:P83GenerationEvidence)=>{e.tree[19]=6;},(e:P83GenerationEvidence)=>{e.tree[22]=e.tree[23];},(e:P83GenerationEvidence)=>{new DataView(e.tree.buffer).setUint32(11,1,true);},(e:P83GenerationEvidence)=>{new DataView(e.tree.buffer).setUint32(11,2500001,true);}]){const e=clone();mutate(e);expect(validateP83GenerationEvidence(e)).toBeNull();}
  });
  it("rejects semantically wrong pivot/prune even when byte structure remains valid",()=>{
    const e=clone();expect(e.tree[19]).toBe(5);e.tree[20]=e.tree[20]===41?40:41;expect(inspectP83GenerationEvidence(e)).toBe(true);expect(validateP83GenerationEvidence(e)).toBeNull();
    const p=clone();let firstLeaf=19;while(p.tree[firstLeaf]===5)firstLeaf+=3+p.tree[firstLeaf+2];p.tree[firstLeaf]=(p.tree[firstLeaf]+1)%5;expect(inspectP83GenerationEvidence(p)).toBe(true);expect(validateP83GenerationEvidence(p)).toBeNull();
  });
  it("rejects missing/duplicate/wrong/multiplicity-erased/noncanonical/unsorted rows",()=>{
    for(const mutate of [(e:P83GenerationEvidence)=>{e.cover13=e.cover13.slice(0,-13);},(e:P83GenerationEvidence)=>{e.cover13.set(e.cover13.slice(0,13),13);},(e:P83GenerationEvidence)=>{e.cover12[0]=0;},(e:P83GenerationEvidence)=>{e.cover13[0]=42;},(e:P83GenerationEvidence)=>{e.cover13[12]=1;},(e:P83GenerationEvidence)=>{e.cover12=e.cover12.slice(1);},(e:P83GenerationEvidence)=>{e.cover13[13]++;}]){const e=clone();mutate(e);expect(validateP83GenerationEvidence(e)).toBeNull();}
  });
  it("never accepts data by pins alone when a full reconstruction deadline is exhausted",()=>{expect(validateP83GenerationEvidence(evidence,0)).toBeNull();});
});
