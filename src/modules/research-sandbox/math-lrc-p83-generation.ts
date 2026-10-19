import { createHash } from "node:crypto";
import { canonicalJson,sha256 } from "@/modules/execution-fabric/contracts";

export const P83_GENERATION_LIMITS=Object.freeze({nodes:2500000,traceBytes:8388608,cover12Bytes:32768,cover13Bytes:2097152,summaryBytes:262144,childBytes:16777216,pythonBytes:30000,collectorMs:120000,replayMs:60000});
export const P83_GENERATION_RETAINED_PATH="docs/research/lrc-allikvere-v2/retained-p83-generation.json";
export const P83_GENERATION_RETAINED_SHA256="72d26052dd11ddc2c46ca5d08676975cefe398f701580a00e6499076ca2a08ef";
export const P83_GENERATION_PYTHON_SHA256="feb6a4affbb06e98440b391435454f9468d4bf50e93781bd38b7c83b72b0dae2";
export const P83_GENERATION_DEPENDENCY=Object.freeze({path:"docs/research/lrc-allikvere-v2/retained-p83-covering-number.json",sha256:"540adb5504a3c3b1ed9e277c304ccc20027711a0bbd29dd3d8f765c91cdd9d06"});
export const P83_GENERATION_PATHS=Object.freeze({tree:"docs/research/lrc-allikvere-v2/retained-p83-generation.tree.bin",cover12:"docs/research/lrc-allikvere-v2/retained-p83-generation.cover12.bin",cover13:"docs/research/lrc-allikvere-v2/retained-p83-generation.cover13.bin"});
export const P83_GENERATION_BINARY_PINS=Object.freeze({tree:"0bd714c3fbf32365f972e7e9146d5d6da5736e339c5a0f60bd38fbac7630847c",cover12:"28cf550cc56516e49f91046090c02d55a9928020998ff8a585105fd35173b880",cover13:"3c2c2286a6a79895c6ba2d688be483861b3d03621d318b98c4e79f951f90c41f"});
export type P83GenerationRoot={targetSize:12|13;pair:number[];nodes:number;leafOccurrences:number;traceBytes:number};
export type P83GenerationCounts={canonical12:number;irredundant13:number;reducible13:number;canonical13:number;repeated13:number;totalNodes:number};
export type P83GenerationEvidence={tree:Uint8Array;cover12:Uint8Array;cover13:Uint8Array};
export type P83GenerationMetadata={encoding:"P83GEN1_PREORDER_REASON_OPTIONS_V1";roots:P83GenerationRoot[];counts:P83GenerationCounts};
export function p83GenerationBinarySha256(bytes:Uint8Array):string{return createHash("sha256").update(bytes).digest("hex");}
const magic=Buffer.from("P83GEN1\n","ascii");
function pc(x:number){x-=x>>>1&0x55555555;x=(x&0x33333333)+(x>>>2&0x33333333);return ((x+(x>>>4)&0x0f0f0f0f)*0x01010101)>>>24;}
function folded(x:number){const r=x%83;return Math.min(r,83-r);}
function masks83(){return Array.from({length:41},(_,i)=>{let lo=0,hi=0;for(let t=1;t<=41;t++)if(14*folded((i+1)*t)<83){if(t<=32)lo|=1<<(t-1);else hi|=1<<(t-33);}if(pc(lo)+pc(hi)!==5)throw new Error("Generation mask cardinality");return [lo>>>0,hi] as const;});}
const pairs=()=>{const out:number[][]=[];for(let a=1;a<=4;a++)for(let b=a+1;b<=5;b++)out.push([a,b]);return out;};
function rowKey(row:number[]):string{return String.fromCharCode(...row.sort((a,b)=>a-b));}
function rowBytes(rows:string[],width:number,cap:number):Uint8Array {if(rows.length*width>cap)throw new Error("Generation dataset limit");const out=new Uint8Array(rows.length*width);for(let r=0;r<rows.length;r++)for(let c=0;c<width;c++)out[r*width+c]=rows[r].charCodeAt(c);return out;}
/** Complete fixed generation. JS uses two32-bit words; independent Python uses
 * arbitrary-width integer masks. Deadline is cooperative, NOT hard preemption.
 * Trace:8-byte magic, then20 roots each11-byte LE header(size,pair,nodeCount,
 * eventByteCount), then preorder events: leaf reason0..4 onebyte; split5 then
 * pivot/count/allascendingoptions bytes, followed by allchildsubtrees. */
export function reconstructP83GenerationEvidence(availableMs:number=P83_GENERATION_LIMITS.collectorMs):P83GenerationEvidence&{metadata:P83GenerationMetadata}{
  if(!Number.isSafeInteger(availableMs)||availableMs<=0)throw new Error("Generation deadline unavailable");
  const deadline=performance.now()+Math.min(availableMs,P83_GENERATION_LIMITS.collectorMs),masks=masks83(),trace=new Uint8Array(P83_GENERATION_LIMITS.traceBytes),view=new DataView(trace.buffer);trace.set(magic);let offset=8,totalNodes=0;const roots:P83GenerationRoot[]=[];
  const check=()=>{if(performance.now()>=deadline)throw new Error("Generation cooperative deadline exhausted");};
  const byte=(x:number)=>{if(offset>=trace.length)throw new Error("Generation tree limit");trace[offset++]=x;};
  function generate(size:12|13):Set<string>{
    const raw=new Set<string>();
    for(const pair of pairs()){
      check();const header=offset;offset+=11;if(offset>trace.length)throw new Error("Generation tree limit");let nodes=0,leaves=0;
      const available=Array.from({length:40},(_,i)=>i+2).filter(v=>pair.every(t=>!(masks[v-1][0]&(1<<(t-1)))));
      function visit(selected:number[],coveredLo:number,coveredHi:number,privateLo:number[],privateHi:number[],avail:number[],slots:number):void {
        nodes++;totalNodes++;if(totalNodes>P83_GENERATION_LIMITS.nodes)throw new Error("Generation node limit");if((totalNodes&4095)===0)check();
        if(privateLo.some((lo,i)=>lo===0&&privateHi[i]===0)){byte(0);return;}
        const uLo=(~coveredLo)>>>0,uHi=(~coveredHi)&511,need=pc(uLo)+pc(uHi);
        if(slots===0){if(need===0){byte(1);leaves++;raw.add(rowKey([...selected]));}else byte(2);return;}
        if(need===0||need>5*slots||avail.length<slots){byte(2);return;}
        let unionLo=0,unionHi=0;const gains:number[]=[];
        for(const v of avail){const [lo,hi]=masks[v-1];unionLo|=lo;unionHi|=hi;gains.push(pc(lo&uLo)+pc(hi&uHi));}
        if((uLo&~unionLo)||(uHi&~unionHi)){byte(3);return;}
        gains.sort((a,b)=>b-a);if(gains.slice(0,slots).reduce((n,x)=>n+x,0)<need){byte(4);return;}
        let pivot=0,options:number[]=[];
        for(let t=1;t<=41;t++){const word=t<=32?uLo:uHi,flag=1<<(t<=32?t-1:t-33);if(!(word&flag))continue;const next=avail.filter(v=>Boolean(masks[v-1][t<=32?0:1]&flag));if(pivot===0||next.length<options.length){pivot=t;options=next;}}
        byte(5);byte(pivot);byte(options.length);for(const v of options)byte(v);
        let remaining=avail;
        for(const v of options){remaining=remaining.filter(x=>x!==v);const [lo,hi]=masks[v-1];visit([...selected,v],(coveredLo|lo)>>>0,coveredHi|hi,[...privateLo.map(p=>(p&~lo)>>>0),(lo&~coveredLo)>>>0],[...privateHi.map(p=>p&~hi),hi&~coveredHi],remaining,slots-1);}
      }
      const [lo,hi]=masks[0];visit([1],lo,hi,[lo],[hi],available,size-1);
      trace[header]=size;trace[header+1]=pair[0];trace[header+2]=pair[1];view.setUint32(header+3,nodes,true);view.setUint32(header+7,offset-header-11,true);roots.push({targetSize:size,pair,nodes,leafOccurrences:leaves,traceBytes:offset-header-11});
    }
    return raw;
  }
  const actions=Array.from({length:41},(_,i)=>Array.from({length:41},(_,j)=>folded((i+1)*(j+1))));
  function canonicalOrbits(input:Set<string>):Set<string>{
    const pending=new Set(input),out=new Set<string>();let iterations=0;
    while(pending.size){if((iterations++&255)===0)check();const row=pending.values().next().value as string;let best:string|undefined;
      for(const action of actions){const image=rowKey(Array.from(row,c=>action[c.charCodeAt(0)-1]));if(best===undefined||image<best)best=image;pending.delete(image);}
      if(best===undefined)throw new Error("Missing generation orbit");out.add(best);
    }return out;
  }
  const canonical12=canonicalOrbits(generate(12)),ir13=canonicalOrbits(generate(13)),extensions=new Set<string>();
  let extensionRows=0;for(const row of canonical12)for(let v=1;v<=41;v++){if((extensionRows++&4095)===0)check();extensions.add(rowKey([...Array.from(row,c=>c.charCodeAt(0)),v]));}
  const red13=canonicalOrbits(extensions),union=new Set([...ir13,...red13]);if(ir13.size+red13.size!==union.size)throw new Error("Generation partition overlap");
  const rows12=[...canonical12].sort(),rows13=[...union].sort(),cover12=rowBytes(rows12,12,P83_GENERATION_LIMITS.cover12Bytes),cover13=rowBytes(rows13,13,P83_GENERATION_LIMITS.cover13Bytes);
  const repeated13=rows13.filter(row=>new Set(row).size<13).length;check();
  return {tree:trace.slice(0,offset),cover12,cover13,metadata:{encoding:"P83GEN1_PREORDER_REASON_OPTIONS_V1",roots,counts:{canonical12:canonical12.size,irredundant13:ir13.size,reducible13:red13.size,canonical13:union.size,repeated13,totalNodes}}};
}
function validRows(raw:Uint8Array,width:number,cap:number):boolean{
  if(!(raw instanceof Uint8Array)||raw.length===0||raw.length>cap||raw.length%width)return false;
  for(let i=0;i<raw.length;i++){if(raw[i]<1||raw[i]>41||(i%width>0&&raw[i]<raw[i-1]))return false;if(i%width===0&&i>0){let comparison=0;for(let j=0;j<width&&comparison===0;j++)comparison=raw[i+j]-raw[i-width+j];if(comparison<=0)return false;}}
  return true;
}
/** Strict bounded structural parser; entire preorder and each root must finish.
 * Semantics are subsequently checked by full independent reconstruction. */
export function inspectP83GenerationEvidence(raw:P83GenerationEvidence):boolean {
  try{if(!(raw?.tree instanceof Uint8Array)||raw.tree.length<8||raw.tree.length>P83_GENERATION_LIMITS.traceBytes||!magic.every((b,i)=>raw.tree[i]===b)||!validRows(raw.cover12,12,P83_GENERATION_LIMITS.cover12Bytes)||!validRows(raw.cover13,13,P83_GENERATION_LIMITS.cover13Bytes))return false;
    let pos=8,total=0;const view=new DataView(raw.tree.buffer,raw.tree.byteOffset,raw.tree.byteLength);
    for(const size of [12,13])for(const pair of pairs()){
      if(pos+11>raw.tree.length||raw.tree[pos]!==size||raw.tree[pos+1]!==pair[0]||raw.tree[pos+2]!==pair[1])return false;const nodes=view.getUint32(pos+3,true),bytes=view.getUint32(pos+7,true);pos+=11;const end=pos+bytes;if(nodes<1||nodes>P83_GENERATION_LIMITS.nodes-total||end>raw.tree.length)return false;let visited=0;
      function walk(depth:number):boolean{if(depth>size||pos>=end||++visited>nodes)return false;const code=raw.tree[pos++];if(code<=4)return true;if(code!==5||pos+2>end)return false;const pivot=raw.tree[pos++],n=raw.tree[pos++];if(pivot<1||pivot>41||n<1||n>41||pos+n>end)return false;let prev=0;for(let i=0;i<n;i++){const v=raw.tree[pos++];if(v<=prev||v>41)return false;prev=v;}for(let i=0;i<n;i++)if(!walk(depth+1))return false;return true;}
      if(!walk(1)||pos!==end||visited!==nodes)return false;total+=visited;if(total>P83_GENERATION_LIMITS.nodes)return false;
    }return pos===raw.tree.length;
  }catch{return false;}
}
export function validateP83GenerationEvidence(raw:P83GenerationEvidence,availableMs:number=P83_GENERATION_LIMITS.collectorMs):P83GenerationMetadata|null {
  const started=performance.now();if(!Number.isSafeInteger(availableMs)||availableMs<=0)return null;const budget=Math.min(availableMs,P83_GENERATION_LIMITS.collectorMs);
  if(!inspectP83GenerationEvidence(raw))return null;
  // Fixed byte identity is only a fast negative prefilter. Positive admission
  // STILL regenerates every node/row below; no digest-only proof acceptance.
  for(const key of ["tree","cover12","cover13"] as const)if(p83GenerationBinarySha256(raw[key])!==P83_GENERATION_BINARY_PINS[key])return null;
  try{const remaining=Math.floor(budget-(performance.now()-started));if(remaining<=0)return null;const expected=reconstructP83GenerationEvidence(remaining);for(const key of ["tree","cover12","cover13"] as const){if(raw[key].length!==expected[key].length)return null;for(let i=0;i<raw[key].length;i++)if(raw[key][i]!==expected[key][i])return null;}return performance.now()-started<=budget?expected.metadata:null;}catch{return null;}
}
export function p83GenerationRequest(evidence:P83GenerationEvidence){return {version:1,prime:83,movingSpeeds:13,totalRunners:14,boundaryPolicy:"STRICT_OPEN_BAD",encoding:"P83GEN1_PREORDER_REASON_OPTIONS_V1",tree:Buffer.from(evidence.tree).toString("base64"),cover12:Buffer.from(evidence.cover12).toString("base64"),cover13:Buffer.from(evidence.cover13).toString("base64")};}
export type P83GenerationReport={version:1;status:"COMPLETE_LEVEL_ONE_GENERATION_STAGE";target:{prime:83;movingSpeeds:13;totalRunners:14;primeSet:"P13";primeSetSize:61};counts:P83GenerationCounts;roots:P83GenerationRoot[];encoding:P83GenerationMetadata["encoding"];dependency:typeof P83_GENERATION_DEPENDENCY;datasets:{tree:{path:string;bytes:number;sha256:string};cover12:{path:string;bytes:number;sha256:string;rows:number};cover13:{path:string;bytes:number;sha256:string;rows:number}};
  trust:{get:"PASSIVE_PINNED_SUMMARY_NOT_FRESH_REPLAY";semanticAdmission:"EXPLICIT_OFFLINE_FULL_TREE_AND_EVERY_ROW";localUnsigned:true;externalAttestation:false};source:{primaryUrl:string;authorCodeExecuted:false;noveltyClaimed:false};remaining:{cascade:"OPEN";terminal:"OPEN";fullPrime:"NOT_ESTABLISHED";global:"NOT_ESTABLISHED";applicationObligationsOpen:23;all61PrimesAccepted:false;formalProof:false};generatedAt:string;receipt:{method:"LOCAL_UNSIGNED_FRESH_PYTHON_REPLAY";sourceSha256:string;inputSha256:string;stdoutSha256:string;stdoutBytes:number;elapsedMs:number;externalAttestation:false};reportDigest:string};
export function p83GenerationReportDigest(raw:Omit<P83GenerationReport,"reportDigest">|P83GenerationReport):string{const {reportDigest:_digest,...body}=raw as P83GenerationReport;void _digest;return sha256(canonicalJson(body));}
/** Passive fixed storage integrity ONLY. Trusts explicitly admitted unsigned
 * local collector evidence; NOT a new mathematical replay on GET. No binary
 * import, IO, full reconstruction, subprocess, oldvalidator or dispatch. */
export function validateRetainedP83GenerationReport(raw:unknown):P83GenerationReport|null{
  try{const bytes=`${canonicalJson(raw)}\n`;if(Buffer.byteLength(bytes)>P83_GENERATION_LIMITS.summaryBytes||sha256(bytes)!==P83_GENERATION_RETAINED_SHA256||!raw||typeof raw!=="object"||Array.isArray(raw))return null;const r=raw as P83GenerationReport;if(r.version!==1||r.status!=="COMPLETE_LEVEL_ONE_GENERATION_STAGE"||r.reportDigest!==p83GenerationReportDigest(r)||r.trust.get!=="PASSIVE_PINNED_SUMMARY_NOT_FRESH_REPLAY")return null;return r;}catch{return null;}
}
