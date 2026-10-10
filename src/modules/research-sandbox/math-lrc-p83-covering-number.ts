import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";

export const P83_COVERING_LIMITS=Object.freeze({nodes:20000,bytes:262144,pythonBytes:30000,replayMs:5000,collectorMs:10000});
export const P83_COVERING_RETAINED_PATH="docs/research/lrc-allikvere-v2/retained-p83-covering-number.json";
export const P83_COVERING_PYTHON_SHA256="30bac287e67182d564f10e4c04009e621150e26f266926298cb6f0b47cd41fba";
export const P83_COVERING_RETAINED_SHA256="540adb5504a3c3b1ed9e277c304ccc20027711a0bbd29dd3d8f765c91cdd9d06";
export const P83_COVERING_DEPENDENCY=Object.freeze({path:"docs/research/lrc-allikvere-v2/retained-prime-criterion-audit.json",sha256:"3387eca4befe5d67845278c3120e65b098764a742af26f6e615b6da2512bf693"});
const witness=[1,6,8,10,11,13,17,19,21,23,25,38];
const bit=(v:number)=>BigInt(1)<<BigInt(v-1);
const full=(BigInt(1)<<BigInt(41))-BigInt(1);
function members(mask:bigint):number[]{const out:number[]=[];for(let i=1;i<=41;i++)if(mask&bit(i))out.push(i);return out;}
function count(mask:bigint):number {let n=0;while(mask){mask&=mask-BigInt(1);n++;}return n;}
export type P83CoverRoot={triple:number[];available:number[];nodeCount:number;traceSha256:string;nodes:number[][]};
export type P83CoverCertificate={encoding:"PREORDER_NODE_ARRAY_V1";legend:readonly string[];boundaryPolicy:"STRICT_OPEN_BAD";equalityControl:{modulus:14;speed:1;time:1;blocked:false;scope:"SYNTHETIC_BOUNDARY_CONTROL_NOT_P83"};maskTable:number[][];roots:P83CoverRoot[];totalNodes:number;witnessCoverage:number[][]};
function blocked(distance:number,modulus:number):boolean{return 14*distance<modulus;}
/** Complete decision trees, NOT an all13-tuple generator. Code0: capacity;
 * 1: union missing; 2: top-gain bound; 3: split [3,pivot,v,childIndex,...].
 * Zero-gain dropping is sound only for existence of a <=11 support cover. */
export function reconstructP83CoverCertificate():P83CoverCertificate {
  if(blocked(1,14))throw new Error("Strict boundary violated");
  const masks=Array.from({length:41},(_,v)=>{let mask=BigInt(0);for(let t=1;t<=41;t++){const r=t*(v+1)%83;if(blocked(Math.min(r,83-r),83))mask|=bit(t);}if(count(mask)!==5)throw new Error("p83 mask cardinality");return mask;});
  const maskTable=masks.map(members),roots:P83CoverRoot[]=[];let totalNodes=0;
  for(let a=1;a<=3;a++)for(let b=a+1;b<=4;b++)for(let c=b+1;c<=5;c++){
    const triple=[a,b,c],privateMask=triple.reduce((m,t)=>m|bit(t),BigInt(0)),available=masks.flatMap((m,i)=>i>0&&!(m&privateMask)?[i+1]:[]),nodes:number[][]=[];
    function visit(uncovered:bigint,avail:number[],slots:number):number {
      const index=nodes.length;nodes.push([]);totalNodes++;if(totalNodes>P83_COVERING_LIMITS.nodes)throw new Error("p83 node limit");
      if(!uncovered)throw new Error("p83 forbidden <=11 cover");
      const need=count(uncovered);if(slots===0||need>5*slots){nodes[index]=[0];return index;}
      const useful=avail.filter(v=>Boolean(masks[v-1]&uncovered));let union=BigInt(0);for(const v of useful)union|=masks[v-1];
      if(uncovered&~union){nodes[index]=[1];return index;}
      const gains=useful.map(v=>count(masks[v-1]&uncovered)).sort((x,y)=>y-x);if(gains.slice(0,slots).reduce((n,x)=>n+x,0)<need){nodes[index]=[2];return index;}
      let pivot=0,options:number[]=[];
      for(const t of members(uncovered)){const next=useful.filter(v=>Boolean(masks[v-1]&bit(t)));if(pivot===0||next.length<options.length){pivot=t;options=next;}}
      const node=[3,pivot];let remaining=useful;
      for(const v of options){remaining=remaining.filter(x=>x!==v);node.push(v,visit(uncovered&~masks[v-1],remaining,slots-1));}
      nodes[index]=node;return index;
    }
    visit(full&~masks[0],available,10);
    roots.push({triple,available,nodeCount:nodes.length,traceSha256:sha256(canonicalJson(nodes)),nodes});
  }
  const witnessCoverage=Array.from({length:41},(_,i)=>witness.filter(v=>Boolean(masks[v-1]&bit(i+1))));
  if(witnessCoverage.some(row=>!row.length))throw new Error("p83 12cover invalid");
  return {encoding:"PREORDER_NODE_ARRAY_V1",legend:["SLOTS_ZERO_OR_5BOUND","UNION_MISSING","TOP_GAIN_BOUND","SPLIT"],boundaryPolicy:"STRICT_OPEN_BAD",equalityControl:{modulus:14,speed:1,time:1,blocked:false,scope:"SYNTHETIC_BOUNDARY_CONTROL_NOT_P83"},maskTable,roots,totalNodes,witnessCoverage};
}
export function p83CoveringRequest(){return {version:1,prime:83,totalRunners:14,targetCover:11,witness:[...witness]};}
export function reconstructP83CoveringNumberBody(){return {
  version:1,status:"COMPLETE_COVERING_NUMBER_STAGE",stageVerdict:"COMPLETE",fullPrimeVerdict:"NOT_ESTABLISHED",globalVerdict:"NOT_ESTABLISHED",formalProof:false,
  target:{prime:83,movingSpeeds:13,totalRunners:14,primeSet:"P13",primeSetSize:61,sourceSection:"5"},
  result:{tau:12,noCoverAtMost11:true,cover12:[...witness],writtenBridge:"REVIEWED_PRIVATE_TIME_NORMALIZATION"},
  mathematicalScope:{allSupportsAtMost11:true,normalization:"SPEEDS_BY_INVERSE_TIMES_BY_PRIVATE_CLASS",privateIncidenceBound:"82-5s",privateTripleRoots:10,badArcStrict:true,zeroGainPurpose:"DECISION_EXISTENCE_ONLY_NOT_ALL13_ENUMERATION",lowerLrcNeeded:false,noveltyClaimed:false},
  dependency:{...P83_COVERING_DEPENDENCY},
  source:{primary:{url:"https://arxiv.org/html/2609.02604v2",revisionDate:"2026-09-24",sections:["4.1","5","6"]},archive:{url:"https://zenodo.org/records/22066772",revision:13,modified:"2026-09-25",metadataReviewed:"2026-10-03",bytes:174600959,md5:"9b6564895671a1d5e03d4ff21e124f7c",sha256:"c9428bfe14fd15fe45a3eade1f49e0b0fc28bb3a3c206bd00235424f10b46cc6",status:"CHECKSUM_IDENTITY_NOT_PROOF"},authorTau:{nodes:63986,status:"REFERENCE_AUTHOR_REPORTED",authorCodeExecuted:false}},
  remaining:{generation:"OPEN",cascade:"OPEN",terminal:"OPEN",lowerSource:"OPEN",formal:"OPEN",global:"OPEN",applicationObligationsOpen:23,all61PrimesAccepted:false},
  certificate:reconstructP83CoverCertificate(),
} as const;}
export type P83CoveringNumberBody=ReturnType<typeof reconstructP83CoveringNumberBody>;
export type P83CoveringNumberReport=P83CoveringNumberBody&{generatedAt:string;receipt:{method:"LOCAL_UNSIGNED_FRESH_PYTHON_REPLAY";sourceSha256:string;stdoutSha256:string;stdoutBytes:number;elapsedMs:number;externalAttestation:false};reportDigest:string};
export function p83CoveringReplayBytes(body:P83CoveringNumberBody):string{return `${canonicalJson(body.certificate)}\n`;}
export function p83CoveringReportDigest(raw:Omit<P83CoveringNumberReport,"reportDigest">|P83CoveringNumberReport):string {const {reportDigest:_digest,...body}=raw as P83CoveringNumberReport;void _digest;return sha256(canonicalJson(body));}
/** Fixed bounded GET admission. Reconstructs every node, root, pivot, option,
 * cumulative exclusion and reason; never admits a tree by hashes/counts alone.
 * No filesystem, subprocess, network, legacy validator or campaign dispatch. */
export function validateRetainedP83CoveringNumberReport(raw:unknown):P83CoveringNumberReport|null {
  try {
    const bytes=canonicalJson(raw);if(Buffer.byteLength(bytes)>P83_COVERING_LIMITS.bytes||!raw||typeof raw!=="object"||Array.isArray(raw))return null;
    const report=raw as P83CoveringNumberReport,{generatedAt,receipt,reportDigest,...body}=report;
    if(typeof generatedAt!=="string"||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(generatedAt)||!Number.isFinite(Date.parse(generatedAt)))return null;
    if(canonicalJson(body)!==canonicalJson(reconstructP83CoveringNumberBody()))return null;
    const replay=p83CoveringReplayBytes(body),expected={method:"LOCAL_UNSIGNED_FRESH_PYTHON_REPLAY",sourceSha256:P83_COVERING_PYTHON_SHA256,stdoutSha256:sha256(replay),stdoutBytes:Buffer.byteLength(replay),elapsedMs:receipt?.elapsedMs,externalAttestation:false};
    if(!Number.isSafeInteger(receipt?.elapsedMs)||receipt.elapsedMs<1||receipt.elapsedMs>P83_COVERING_LIMITS.replayMs||canonicalJson(receipt)!==canonicalJson(expected)||reportDigest!==p83CoveringReportDigest(report))return null;
    return report;
  }catch{return null;}
}
