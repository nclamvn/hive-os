import { readFileSync } from "node:fs";
import { describe,expect,it } from "vitest";
import { canonicalJson,sha256 } from "@/modules/execution-fabric/contracts";
import { P83_CASCADE_KEYS,P83_CASCADE_PATHS,P83_CASCADE_RETAINED_PATH,P83_CASCADE_RETAINED_SHA256,P83_CASCADE_BINARY_PINS,P83_CASCADE_DEPENDENCY,p83CascadeBinarySha256,p83CascadeReportDigest,inspectP83CascadeEvidence,validateP83CascadeEvidence,validateRetainedP83CascadeReport,type P83CascadeEvidence,type P83CascadeReport } from "@/modules/research-sandbox/math-lrc-p83-cascade";
const raw=readFileSync(P83_CASCADE_RETAINED_PATH,"utf8"),report=JSON.parse(raw) as P83CascadeReport;
const predecessor=readFileSync(P83_CASCADE_DEPENDENCY.datasetPath);
const evidence={...Object.fromEntries(P83_CASCADE_KEYS.map(k=>[k,readFileSync(P83_CASCADE_PATHS[k])])),metadata:{stages:report.stages,counts:report.counts,ancestors:report.ancestors,encoding:report.encoding}} as P83CascadeEvidence;
const clone=()=>({...evidence,tree:Uint8Array.from(evidence.tree)});
const gcd=(a:number,b:number):number=>{while(b){const r=a%b;a=b;b=r;}return a;};
describe("whole p83 binary cascade retained evidence",()=>{
  it("pins ONLY passive admitted summary; terminal and all applications stay OPEN",()=>{
    expect(sha256(raw)).toBe(P83_CASCADE_RETAINED_SHA256);expect(validateRetainedP83CascadeReport(report)).toEqual(report);
    expect(report.counts).toEqual({roots:582761,nodes:2330389,forces:6994519,conflicts:940033,splits:873814,satCubes:516542});
    expect(report.stages.map(s=>s.survivors)).toEqual([461780,4990,56,32,32]);expect(report.stages.map(s=>s.parentCount)).toEqual([115903,461780,4990,56,32]);
    expect(report.remaining).toEqual({terminal:"OPEN",fullPrime:"NOT_ESTABLISHED",global:"NOT_ESTABLISHED",applicationObligationsOpen:23,all61PrimesAccepted:false,formalProof:false});expect(report.receipt.externalAttestation).toBe(false);
  });
  it("retains EVERY root/event and fixed-width multiplicity-preserving sorted dataset",()=>{
    expect(inspectP83CascadeEvidence(evidence)).toBe(true);expect(evidence.tree.length).toBe(30729972);
    for(const k of P83_CASCADE_KEYS)expect(p83CascadeBinarySha256(evidence[k])).toBe(P83_CASCADE_BINARY_PINS[k]);
    expect(report.stages.map(s=>s.partitionMassPerRoot)).toEqual([8192,8192,8192,8192,8192]);expect(report.stages.every(s=>s.satAssignments===s.gcdProper+s.improperRaw)).toBe(true);
  });
  it("checks raw strict full-grid AND every omitted-gcd definition for ALL retained rows",()=>{
    for(const level of [2,4,8,16,32]){const modulus=83*level,half=modulus/2,words=Math.ceil(half/32),masks=new Map<number,Uint32Array>(),data=Buffer.from(evidence[`level${level}` as keyof P83CascadeEvidence] as Uint8Array);
      for(let o=0;o<data.length;o+=26){const row=Array.from({length:13},(_,i)=>data.readUInt16BE(o+2*i)),grid=new Uint32Array(words),prefix=[level];for(const x of row){let mask=masks.get(x);if(!mask){mask=new Uint32Array(words);for(let t=1;t<=half;t++){const r=t*x%modulus;if(14*Math.min(r,modulus-r)<modulus)mask[(t-1)>>>5]|=1<<((t-1)&31);}masks.set(x,mask);}for(let j=0;j<words;j++)grid[j]|=mask[j];prefix.push(gcd(prefix[prefix.length-1],x));}for(let j=0;j<words;j++){const all=j===words-1&&half%32?0xffffffff>>>(32-half%32):0xffffffff;if(grid[j]!==all)throw new Error(`retained grid failure ${level}/${o}`);}let suffix=level;for(let i=12;i>=0;i--){if(gcd(prefix[i],suffix)>1)throw new Error(`retained gcd proper row ${level}/${o}`);suffix=gcd(suffix,row[i]);}}
    }
    expect(true).toBe(true);
  },30000);
  it("derives ALL final32 ancestors by reduction, retaining exactly both live classes",()=>{
    const derived=new Set<string>(),b=Buffer.from(evidence.level32);for(let o=0;o<b.length;o+=26){const r=Array.from({length:13},(_,i)=>{const x=b.readUInt16BE(o+2*i)%166;return Math.min(x,166-x);}).sort((a,b)=>a-b);derived.add(JSON.stringify(r));}
    expect([...derived].sort()).toEqual(report.ancestors.rows.map(r=>JSON.stringify(r)).sort());expect(report.ancestors.rows).toEqual([Array.from({length:13},(_,i)=>i+1),[1,2,3,4,5,6,7,8,9,10,11,13,24]]);expect(evidence.ancestors2.length).toBe(52);
  });
  it("positive semantic admission still regenerates entire domain rather than accepting pins",()=>{expect(validateP83CascadeEvidence(evidence,predecessor)).toEqual(evidence.metadata);},240000);
  it("keeps small GET separate from large IO/subprocess/semantic replay",()=>{
    const source=readFileSync("src/modules/research-sandbox/math-lrc-p83-cascade.ts","utf8"),fn=source.slice(source.indexOf("export function validateRetainedP83CascadeReport"));expect(fn).toContain("P83_CASCADE_RETAINED_SHA256");for(const word of ["reconstructP83CascadeEvidence(","validateP83CascadeEvidence(","inspectP83CascadeEvidence(","readFile","execFile"])expect(fn).not.toContain(word);
    expect(source).toContain("original grid discrepancy");expect(source).toContain("stage.satAssignments++");expect(source).toContain("mass!==8192");
  });
});
const promotions:[string,(r:P83CascadeReport)=>void][]=[
  ["missing stage",r=>{r.stages.pop();}],["skipped parent",r=>{r.stages[0].parentCount--;}],["forged mass",r=>Object.assign(r.stages[0],{partitionMassPerRoot:8191})],["forged SAT",r=>{r.stages[0].satAssignments--;}],["forged gcd",r=>{r.stages[0].gcdProper--;}],["forged rows",r=>{r.stages[0].survivors--;}],["missing ancestor",r=>{r.ancestors.rows.pop();}],["source changed",r=>Object.assign(r.source,{authorCodeExecuted:true})],["fresh GET",r=>Object.assign(r.trust,{get:"FRESH_REPLAY"})],["terminal closed",r=>Object.assign(r.remaining,{terminal:"COMPLETE"})],["prime closed",r=>Object.assign(r.remaining,{fullPrime:"COMPLETE"})],["global closed",r=>Object.assign(r.remaining,{global:"PROVED"})],["applications closed",r=>Object.assign(r.remaining,{applicationObligationsOpen:22})],["all61 closed",r=>Object.assign(r.remaining,{all61PrimesAccepted:true})],["formal claimed",r=>Object.assign(r.remaining,{formalProof:true})],["external claimed",r=>Object.assign(r.receipt,{externalAttestation:true})],["dependency drift",r=>Object.assign(r.dependency,{sha256:"a".repeat(64)})],["tree pin drift",r=>{r.datasets.tree.sha256="b".repeat(64);}]
];
describe("whole cascade fail-closed adversarial inputs",()=>{
  it.each(promotions)("rejects coherent rehash: %s",(_name,mutate)=>{const r=structuredClone(report);mutate(r);const {reportDigest:discard,...body}=r;void discard;r.reportDigest=p83CascadeReportDigest(body);expect(validateRetainedP83CascadeReport(JSON.parse(canonicalJson(r)))).toBeNull();});
  it("rejects malformed/oversized/cyclic summaries",()=>{const cycle:{self?:unknown}={};cycle.self=cycle;for(const r of [null,{},cycle,{data:"x".repeat(262145)}])expect(validateRetainedP83CascadeReport(r)).toBeNull();});
  it("rejects truncated/orphan/stage-order/root-count/node-cap certificates before replay",()=>{
    for(const mutate of [(e:P83CascadeEvidence)=>{e.tree=e.tree.slice(0,-1);},(e:P83CascadeEvidence)=>{e.tree=Buffer.concat([e.tree,Buffer.from([0])]);},(e:P83CascadeEvidence)=>{e.tree[8]=2;},(e:P83CascadeEvidence)=>{new DataView(e.tree.buffer).setUint32(10,115902);},(e:P83CascadeEvidence)=>{new DataView(e.tree.buffer).setUint32(18,3000001);},(e:P83CascadeEvidence)=>{e.tree[26]=253;}]){const e=clone();mutate(e);expect(validateP83CascadeEvidence(e,predecessor)).toBeNull();}
  });
  it("rejects structurally coherent false FORCE reason/bit/SPLIT even if summary counters rehashed",()=>{
    const e=clone();let offset=26;while(e.tree[offset]>=1&&e.tree[offset]<=26)offset+=3;
    const firstForce=26;if(e.tree[firstForce]>=1&&e.tree[firstForce]<=26){const f=clone();f.tree[firstForce]=1+((f.tree[firstForce]-1)^1);expect(inspectP83CascadeEvidence(f)).toBe(true);expect(validateP83CascadeEvidence(f,predecessor)).toBeNull();}
    if(e.tree[offset]===254){e.tree[offset+1]=(e.tree[offset+1]+1)%13;expect(validateP83CascadeEvidence(e,predecessor)).toBeNull();}
    const t=clone();t.tree[28]=255;expect(validateP83CascadeEvidence(t,predecessor)).toBeNull();
  });
  it("rejects stage row loss/order/duplication/multiplicity/zero/outofrange/ancestor drift",()=>{
    for(const mutate of [(e:P83CascadeEvidence)=>{e.level2=e.level2.slice(0,-26);},(e:P83CascadeEvidence)=>{e.level2=Uint8Array.from(e.level2);e.level2.set(e.level2.slice(0,26),26);},(e:P83CascadeEvidence)=>{e.level4=Uint8Array.from(e.level4);e.level4[1]=0;},(e:P83CascadeEvidence)=>{e.level8=e.level8.slice(1);},(e:P83CascadeEvidence)=>{e.ancestors2=e.ancestors2.slice(0,26);},(e:P83CascadeEvidence)=>{e.level32=Uint8Array.from(e.level32);e.level32[0]=255;}]){const e=clone();mutate(e);expect(validateP83CascadeEvidence(e,predecessor)).toBeNull();}
  });
  it("rejects exhausted/original-clamped deadline and wrong predecessor even with exact evidence pins",()=>{for(const ms of [0,-1,0.5,Infinity,1])expect(validateP83CascadeEvidence(evidence,predecessor,ms)).toBeNull();expect(validateP83CascadeEvidence(evidence,new Uint8Array(13))).toBeNull();});
});
