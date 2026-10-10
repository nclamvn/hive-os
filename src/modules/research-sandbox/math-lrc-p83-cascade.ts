import { createHash } from "node:crypto";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";

/** Fixed, offline WHOLE cascade. No IO or job is performed by passive GET. */
export const P83_CASCADE_LIMITS = {nodes:3000000,roots:600000,forces:8000000,treeBytes:32*1024*1024,datasetBytes:16*1024*1024,predecessorBytes:2*1024*1024,summaryBytes:262144,pythonBytes:30000,requestBytes:64*1024*1024,stdoutBytes:1024*1024,collectorMs:240000,replayMs:120000} as const;
export const P83_CASCADE_RETAINED_PATH="docs/research/lrc-allikvere-v2/retained-p83-cascade.json";
export const P83_CASCADE_RETAINED_SHA256="0872e1bd95533fea3cfbdd2eab2834607283739c5796ef4c82e5636a57affbb1";
export const P83_CASCADE_PYTHON_SHA256="cd48f5c2138495fe66cb6527d3df923511c80059029b94907936986125046ded";
export const P83_CASCADE_DEPENDENCY={path:"docs/research/lrc-allikvere-v2/retained-p83-generation.json",sha256:"72d26052dd11ddc2c46ca5d08676975cefe398f701580a00e6499076ca2a08ef",datasetPath:"docs/research/lrc-allikvere-v2/retained-p83-generation.cover13.bin",datasetSha256:"3c2c2286a6a79895c6ba2d688be483861b3d03621d318b98c4e79f951f90c41f",datasetBytes:1506739} as const;
export const P83_CASCADE_KEYS=["tree","level2","level4","level8","level16","level32","ancestors2"] as const;
export type CascadeKey=typeof P83_CASCADE_KEYS[number];
export const P83_CASCADE_PATHS=Object.fromEntries(P83_CASCADE_KEYS.map(k=>[k,`docs/research/lrc-allikvere-v2/retained-p83-cascade.${k==="tree"?"tree":k}.bin`])) as Record<CascadeKey,string>;
export const P83_CASCADE_BINARY_PINS:Record<CascadeKey,string>={tree:"bf5d9802fa7e02c606692eb6380c6aad0defe012b0cc71e9b0b74ddcdd18b760",level2:"8dc02ad527df1f1d28c2f28c88629483a8c14849141aa2ecb18e4399398853c1",level4:"706bf573ee32319f36f769fb2c043c64960d1d2170c83892168626489877a8d0",level8:"0377aa5cf18cbe24b2bc755600970da53863a9046b1828e24eaefdf5735135ff",level16:"d4bad3d351eab949b4c5ecffee36c8b2b76c80f084e9555034a50878554684f5",level32:"de0402bad5e8e7c142476583d49743c7584f37d77640246667fa3079b6037aca",ancestors2:"ece61da2bd3a3c447d919da64e6ece4d755a36bf14a0417c5cfe9f045d0b2998"};
export type P83CascadeStage={fromLevel:number;toLevel:number;parentCount:number;nodes:number;forces:number;conflicts:number;splits:number;satCubes:number;satAssignments:number;gcdProper:number;improperRaw:number;survivors:number;partitionMassPerRoot:8192};
export type P83CascadeMetadata={stages:P83CascadeStage[];counts:{roots:number;nodes:number;forces:number;conflicts:number;splits:number;satCubes:number};ancestors:{level:2;rows:number[][];count:number};encoding:{tree:"P83CAS1_BE_STAGE10_ROOT8_PREORDER";datasets:"ROW_MAJOR_U16BE_13_NUMERIC_LEX"}};
export type P83CascadeEvidence=Record<CascadeKey,Uint8Array>&{metadata:P83CascadeMetadata};
type DatasetReceipt={path:string;bytes:number;sha256:string;rows?:number};
export type P83CascadeReport=P83CascadeMetadata&{version:1;status:"COMPLETE_BINARY_CASCADE_STAGE";target:{prime:83;movingSpeeds:13;totalRunners:14;primeSet:"P13";primeSetSize:61};dependency:typeof P83_CASCADE_DEPENDENCY;datasets:Record<CascadeKey,DatasetReceipt>;trust:{get:"PASSIVE_PINNED_SUMMARY_NOT_FRESH_REPLAY";semanticAdmission:"EXPLICIT_OFFLINE_FULL_TREE_AND_EVERY_ROW";localUnsigned:true;externalAttestation:false};source:{primaryUrl:string;authorCodeExecuted:false;noveltyClaimed:false};remaining:{terminal:"OPEN";fullPrime:"NOT_ESTABLISHED";global:"NOT_ESTABLISHED";applicationObligationsOpen:23;all61PrimesAccepted:false;formalProof:false};generatedAt:string;receipt:{method:"LOCAL_UNSIGNED_FRESH_PYTHON_REPLAY";sourceSha256:string;inputSha256:string;stdoutSha256:string;stdoutBytes:number;elapsedMs:number;externalAttestation:false};reportDigest:string};
export const p83CascadeBinarySha256=(b:Uint8Array)=>createHash("sha256").update(b).digest("hex");
export const p83CascadeReportDigest=(b:Omit<P83CascadeReport,"reportDigest">)=>sha256(canonicalJson(b));
const pop=(n:number)=>{let c=0;for(;n;n&=n-1)c++;return c;};
const gcd=(a:number,b:number):number=>{while(b){const c=a%b;a=b;b=c;}return a;};
const rowKey=(r:number[])=>String.fromCharCode(...r);
const rowValues=(k:string)=>Array.from(k,c=>c.charCodeAt(0));
const encodeRows=(rows:string[])=>{const b=Buffer.alloc(rows.length*26);let o=0;for(const r of rows)for(let i=0;i<13;i++,o+=2)b.writeUInt16BE(r.charCodeAt(i),o);return b;};
function predecessorRows(b:Uint8Array){if(!(b instanceof Uint8Array)||b.length!==P83_CASCADE_DEPENDENCY.datasetBytes||p83CascadeBinarySha256(b)!==P83_CASCADE_DEPENDENCY.datasetSha256)throw new Error("p83 cascade predecessor drift");const r:string[]=[];for(let o=0;o<b.length;o+=13)r.push(rowKey(Array.from(b.subarray(o,o+13))));return r;}

/** Finalized tree: magic8 'P83CAS1\n'; each stage10 bytes (from/to U8,
 * roots/eventAndRootBytes U32BE); each implicit predecessor-order root8 bytes
 * (nodes/events U32BE). Force tag1+2*i+bit,time U16BE; conflict0,timeU16BE;
 * split254,iU8 BOTH0/1; SAT255 ALL free assignments. No omitted root/event. */
export function reconstructP83CascadeEvidence(predecessor:Uint8Array,availableMs:number=P83_CASCADE_LIMITS.collectorMs):P83CascadeEvidence{
  const started=performance.now();if(!Number.isSafeInteger(availableMs)||availableMs<=0)throw new Error("p83 cascade deadline unavailable");
  const budget=Math.min(availableMs,P83_CASCADE_LIMITS.collectorMs),check=()=>{if(performance.now()-started>=budget)throw new Error("p83 cascade deadline exhausted");};
  let parents=predecessorRows(predecessor),at=8,totalNodes=0,totalRoots=0,totalForces=0,datasetBytes=0;
  const tree=Buffer.alloc(P83_CASCADE_LIMITS.treeBytes);tree.write("P83CAS1\n",0,"ascii");
  const emit=(...v:number[])=>{if(at+v.length>tree.length)throw new Error("p83 cascade tree cap");for(const x of v)tree[at++]=x;};
  const u32=(o:number,v:number)=>tree.writeUInt32BE(v,o);
  const outputs:Partial<Record<CascadeKey,Uint8Array>>={},stages:P83CascadeStage[]=[];
  for(const level of [1,2,4,8,16]){
    check();const M=83*level,stageStart=at;emit(level,level*2,0,0,0,0,0,0,0,0);
    const stage:P83CascadeStage={fromLevel:level,toLevel:level*2,parentCount:parents.length,nodes:0,forces:0,conflicts:0,splits:0,satCubes:0,satAssignments:0,gcdProper:0,improperRaw:0,survivors:0,partitionMassPerRoot:8192};
    const bad=new Map<number,[number[],number[]]>(),directGrid=new Map<number,Uint32Array>(),words=Math.ceil(M/32);
    for(const k of parents)for(const w of rowValues(k))if(!bad.has(w)){
      const byBit:[number[],number[]]=[[],[]];for(let j=0;j<2;j++){const x=w+j*M;for(let t=1;t<=M;t+=2){const r=t*x%(2*M);if(14*Math.min(r,2*M-r)<2*M)byBit[j].push((t-1)/2);}}
      bad.set(w,byBit);
      for(const x of [w,M-w])if(!directGrid.has(x)){const mask=new Uint32Array(words);for(let t=1;t<=M;t++){const r=t*x%(2*M);if(14*Math.min(r,2*M-r)<2*M)mask[(t-1)>>>5]|=1<<((t-1)&31);}directGrid.set(x,mask);}
    }
    const output=new Set<string>();
    for(let root=0;root<parents.length;root++){
      if(!(root%512))check();if(++totalRoots>P83_CASCADE_LIMITS.roots)throw new Error("p83 cascade root cap");
      const row=rowValues(parents[root]),times=Math.ceil(M/2),pos=new Uint16Array(times),neg=new Uint16Array(times);
      row.forEach((w,i)=>{const b=bad.get(w)!;for(const t of b[0])neg[t]|=1<<i;for(const t of b[1])pos[t]|=1<<i;});
      const seen=new Set<number>(),clauses:{p:number;n:number;t:number}[]=[];for(let j=0;j<times;j++){const key=pos[j]*8192+neg[j];if(!seen.has(key)){seen.add(key);clauses.push({p:pos[j],n:neg[j],t:2*j+1});}}
      const rootHeader=at,nodesBefore=stage.nodes;emit(0,0,0,0,0,0,0,0);let mass=0;
      const visit=(assigned:number,ones:number)=>{
        stage.nodes++;if(++totalNodes>P83_CASCADE_LIMITS.nodes)throw new Error("p83 cascade node cap");
        while(true){let changed=false;for(const {p,n,t} of clauses){if((p&ones)||(n&(assigned^ones)))continue;const rem=(p|n)&~assigned;if(!rem){stage.conflicts++;emit(0,t>>>8,t&255);mass+=1<<(13-pop(assigned));return;}if(!(rem&(rem-1))){if(++totalForces>P83_CASCADE_LIMITS.forces)throw new Error("p83 cascade force cap");stage.forces++;const digit=(p&rem)?1:0;emit(1+2*(31-Math.clz32(rem))+digit,t>>>8,t&255);mass+=1<<(12-pop(assigned));assigned|=rem;if(digit)ones|=rem;changed=true;}}if(!changed)break;}
        let chosen=0,width=14;for(const {p,n} of clauses){if((p&ones)||(n&(assigned^ones)))continue;const rem=(p|n)&~assigned,c=pop(rem);if(c<width){chosen=rem;width=c;}}
        if(!chosen){stage.satCubes++;emit(255);const free=8191^assigned;mass+=1<<pop(free);for(let sub=free;;sub=(sub-1)&free){const digits=ones|sub,child=row.map((w,i)=>(digits&(1<<i))?M-w:w),grid=new Uint32Array(words),prefix=[level*2];for(const x of child){const b=directGrid.get(x)!;for(let j=0;j<words;j++)grid[j]|=b[j];prefix.push(gcd(prefix[prefix.length-1],x));}for(let j=0;j<words;j++){const expected=j===words-1&&M%32?0xffffffff>>>(32-M%32):0xffffffff;if(grid[j]!==expected)throw new Error("p83 cascade original grid discrepancy");}let suffix=level*2,proper=false;for(let i=12;i>=0;i--){if(gcd(prefix[i],suffix)>1)proper=true;suffix=gcd(suffix,child[i]);}stage.satAssignments++;if(proper)stage.gcdProper++;else{stage.improperRaw++;output.add(rowKey(child.sort((a,b)=>a-b)));}if(!sub)break;}return;}
        stage.splits++;const variable=chosen&-chosen;emit(254,31-Math.clz32(variable));visit(assigned|variable,ones);visit(assigned|variable,ones|variable);
      };
      visit(0,0);if(mass!==8192)throw new Error("p83 cascade incomplete root partition");u32(rootHeader,stage.nodes-nodesBefore);u32(rootHeader+4,at-rootHeader-8);
    }
    const rows=[...output].sort(),data=encodeRows(rows);datasetBytes+=data.length;if(datasetBytes>P83_CASCADE_LIMITS.datasetBytes)throw new Error("p83 cascade dataset cap");
    outputs[`level${2*level}` as CascadeKey]=data;stage.survivors=rows.length;stages.push(stage);u32(stageStart+2,parents.length);u32(stageStart+6,at-stageStart-10);parents=rows;
  }
  const ancestors=[...new Set(parents.map(k=>rowKey(rowValues(k).map(w=>{const r=w%166;return Math.min(r,166-r);}).sort((a,b)=>a-b))))].sort(),ancestorBytes=encodeRows(ancestors);datasetBytes+=ancestorBytes.length;if(datasetBytes>P83_CASCADE_LIMITS.datasetBytes)throw new Error("p83 cascade ancestor cap");outputs.ancestors2=ancestorBytes;
  const metadata:P83CascadeMetadata={stages,counts:{roots:totalRoots,nodes:totalNodes,forces:totalForces,conflicts:stages.reduce((s,t)=>s+t.conflicts,0),splits:stages.reduce((s,t)=>s+t.splits,0),satCubes:stages.reduce((s,t)=>s+t.satCubes,0)},ancestors:{level:2,rows:ancestors.map(rowValues),count:ancestors.length},encoding:{tree:"P83CAS1_BE_STAGE10_ROOT8_PREORDER",datasets:"ROW_MAJOR_U16BE_13_NUMERIC_LEX"}};
  check();return {...outputs,tree:tree.subarray(0,at),metadata} as P83CascadeEvidence;
}

/** Bounded structural rejection. Positive admission additionally reconstructs
 * EVERY state/event/output. No digest-only positive acceptance. */
export function inspectP83CascadeEvidence(e:unknown):e is P83CascadeEvidence{
  try{if(!e||typeof e!=="object")return false;const v=e as P83CascadeEvidence;if(P83_CASCADE_KEYS.some(k=>!(v[k] instanceof Uint8Array)))return false;const b=Buffer.from(v.tree.buffer,v.tree.byteOffset,v.tree.byteLength);if(b.length> P83_CASCADE_LIMITS.treeBytes||b.subarray(0,8).toString()!=="P83CAS1\n")return false;let at=8,nodes=0,roots=0,forces=0,totalData=0,previousCount=115903;
    for(const level of [1,2,4,8,16]){if(at+10>b.length||b[at]!==level||b[at+1]!==2*level)return false;const count=b.readUInt32BE(at+2),stageEnd=at+10+b.readUInt32BE(at+6);at+=10;if(count!==previousCount||roots+count>P83_CASCADE_LIMITS.roots||stageEnd>b.length)return false;roots+=count;
      for(let r=0;r<count;r++){if(at+8>stageEnd)return false;const expectedNodes=b.readUInt32BE(at),end=at+8+b.readUInt32BE(at+4);at+=8;if(!expectedNodes||expectedNodes>P83_CASCADE_LIMITS.nodes-nodes||end>stageEnd)return false;let visited=0;
        const walk=(assigned:number,depth:number):boolean=>{if(depth>13||++nodes>P83_CASCADE_LIMITS.nodes||++visited>expectedNodes)return false;while(at<end&&b[at]>=1&&b[at]<=26){if(at+3>end||++forces>P83_CASCADE_LIMITS.forces)return false;const i=(b[at]-1)>>>1,t=b.readUInt16BE(at+1);if((assigned&(1<<i))||t<1||t>83*level||!(t%2))return false;assigned|=1<<i;at+=3;}if(at>=end)return false;const tag=b[at++];if(tag===0){if(at+2>end)return false;const t=b.readUInt16BE(at);at+=2;return t>=1&&t<=83*level&&Boolean(t%2);}if(tag===255)return true;if(tag!==254||at>=end)return false;const i=b[at++];return i<13&&!(assigned&(1<<i))&&walk(assigned|(1<<i),depth+1)&&walk(assigned|(1<<i),depth+1);};
        if(!walk(0,0)||visited!==expectedNodes||at!==end)return false;
      }if(at!==stageEnd)return false;const data=v[`level${2*level}` as CascadeKey];if(data.length%26)return false;previousCount=data.length/26;totalData+=data.length;
    }
    if(at!==b.length||v.ancestors2.length%26)return false;totalData+=v.ancestors2.length;if(totalData>P83_CASCADE_LIMITS.datasetBytes)return false;
    for(const k of P83_CASCADE_KEYS.slice(1)){const data=Buffer.from(v[k].buffer,v[k].byteOffset,v[k].byteLength),max=k==="ancestors2"?83:83*Number(k.slice(5))/2;let last="";for(let o=0;o<data.length;o+=26){const r:number[]=[];for(let i=0;i<13;i++){const x=data.readUInt16BE(o+2*i);if(x<1||x>max||(i&&x<r[i-1]))return false;r.push(x);}const key=rowKey(r);if(last&&key<=last)return false;last=key;}}
    return true;
  }catch{return false;}
}
export function validateP83CascadeEvidence(e:unknown,predecessor:Uint8Array,availableMs:number=P83_CASCADE_LIMITS.collectorMs):P83CascadeMetadata|null{
  const start=performance.now(),budget=Math.min(availableMs,P83_CASCADE_LIMITS.collectorMs);try{if(!Number.isSafeInteger(availableMs)||availableMs<=0||!inspectP83CascadeEvidence(e))return null;for(const k of P83_CASCADE_KEYS)if(P83_CASCADE_BINARY_PINS[k]!=="PENDING"&&p83CascadeBinarySha256(e[k])!==P83_CASCADE_BINARY_PINS[k])return null;const fresh=reconstructP83CascadeEvidence(predecessor,Math.floor(budget-(performance.now()-start)));for(const k of P83_CASCADE_KEYS)if(!Buffer.from(e[k]).equals(Buffer.from(fresh[k])))return null;if(performance.now()-start>=budget)return null;return fresh.metadata;}catch{return null;}
}
export function p83CascadeRequest(e:P83CascadeEvidence,predecessor:Uint8Array){return {version:1,prime:83,movingSpeeds:13,totalRunners:14,boundary:"STRICT_OPEN_BAD",predecessor:Buffer.from(predecessor).toString("base64"),blobs:Object.fromEntries(P83_CASCADE_KEYS.map(k=>[k,Buffer.from(e[k]).toString("base64")]))};}
/** Passive identity of an already admitted unsigned local summary, NOT fresh
 * math. Never imports binary evidence, runs a large walker or starts Python. */
export function validateRetainedP83CascadeReport(raw:unknown):P83CascadeReport|null{
  try{const text=`${canonicalJson(raw)}\n`;if(Buffer.byteLength(text)>P83_CASCADE_LIMITS.summaryBytes||sha256(text)!==P83_CASCADE_RETAINED_SHA256)return null;const r=raw as P83CascadeReport;const {reportDigest,...body}=r;if(r.version!==1||r.status!=="COMPLETE_BINARY_CASCADE_STAGE"||r.trust.get!=="PASSIVE_PINNED_SUMMARY_NOT_FRESH_REPLAY"||p83CascadeReportDigest(body)!==reportDigest)return null;return r;}catch{return null;}
}
