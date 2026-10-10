import { createHash } from "node:crypto";
import { canonicalJson,sha256 } from "@/modules/execution-fabric/contracts";

export const PRIME_LIFT_LIMITS=Object.freeze({collectorMs:30000,replayMs:15000,pythonBytes:30000,requestBytes:262144,stdoutBytes:262144,summaryBytes:524288});
export const PRIME_LIFT_RETAINED_PATH="docs/research/lrc-allikvere-v2/retained-prime-lift-structure.json";
export const PRIME_LIFT_PYTHON_SHA256="5fe551a89b279493bee97de0a35f88409c9855c714ba1ce1a025184e161c7027";
export const PRIME_LIFT_DEPENDENCY=Object.freeze({ancestorPath:"docs/research/lrc-allikvere-v2/retained-p83-cascade.ancestors2.bin",ancestorBytes:52,ancestorSha256:"ece61da2bd3a3c447d919da64e6ece4d755a36bf14a0417c5cfe9f045d0b2998",terminalPath:"docs/research/lrc-allikvere-v2/retained-p83-terminal.json",terminalSha256:"f5e85bcad566519149f4a5267672b08bbb0f0064882a4585215d2280f4ab3230"});
export type PrimeLiftInput={n:number;M:number;q:number;parent:number[];boundary:"STRICT_OPEN_BAD"};
export type PrimeLiftRow={digits:number[];tuple:number[];exception:number|null;classification:"GRID"|"NO_GRID";gcdProper:boolean;witness:null|{s:number;j0:number;h:number;j:number;distances:number[];preservedParentDistances:number[]}};
export type PrimeLiftEvidence={input:PrimeLiftInput;Q:number;qInverse:number;gcdModulus:number;divisibleDigits:number[];deletionWitnesses:number[];rows:PrimeLiftRow[];counts:{subset:number;grid:number;noGrid:number;gcdProper:number};fullGcdSubset:boolean};
export type PrimeLiftReport={version:1;status:"COMPLETE_CONDITIONAL_PRIME_LIFT_SUBSET";roots:PrimeLiftEvidence[];dependency:typeof PRIME_LIFT_DEPENDENCY;counts:{roots:2;tuples:158;grid:156;noGrid:2};boundary:{N:14;Q:1162;time:83;speed:1;digits:number[];distances:number[];strictBad:number;closedBad:number};trust:{localUnsigned:true;freshFullCampaign:false;semanticAdmission:"EXPLICIT_OFFLINE_EVERY_SUBSET_TUPLE_AND_WITNESS"};scope:{allQPowerNEnumerated:false;noveltyClaimed:false;global:"NOT_ESTABLISHED";applicationObligationsOpen:23;otherLiftDomain:"OPEN";formalProof:false};generatedAt:string;receipt:{method:"LOCAL_UNSIGNED_FRESH_PYTHON_REPLAY";sourceSha256:string;inputSha256:string;stdoutSha256:string;stdoutBytes:number;elapsedMs:number;externalAttestation:false};reportDigest:string};
const gcd=(a:number,b:number):number=>{while(b)[a,b]=[b,a%b];return a;};
export const primeLiftDistance=(t:number,v:number,m:number)=>{const r=t*v%m;return Math.min(r,m-r);};
function exactInput(raw:unknown):PrimeLiftInput{
  if(!raw||typeof raw!=="object"||Array.isArray(raw)||Object.keys(raw).sort().join()!=="M,boundary,n,parent,q")throw new Error("prime lift malformed input");const x=raw as PrimeLiftInput;
  if(!Number.isSafeInteger(x.n)||x.n<3||x.n>14||!Number.isSafeInteger(x.M)||x.M<2||x.M>4096||!Number.isSafeInteger(x.q)||x.q<2||x.q>31||x.M*x.q>65536||gcd(x.M,x.q)!==1||x.boundary!=="STRICT_OPEN_BAD"||!Array.isArray(x.parent)||x.parent.length!==x.n||x.parent.some(v=>!Number.isSafeInteger(v)||v<0||v>=x.M))throw new Error("prime lift input bounds/policy");
  for(let d=2;d*d<=x.q;d++)if(x.q%d===0)throw new Error("prime lift requires prime q");return {...x,parent:x.parent.slice()};
}
/** Exact bounded instance of the written conditional lemma; not a sampled universal proof. */
export function constructPrimeLiftStructure(raw:unknown,availableMs:number=PRIME_LIFT_LIMITS.collectorMs):PrimeLiftEvidence{
  const start=performance.now();if(!Number.isSafeInteger(availableMs)||availableMs<=0)throw new Error("prime lift deadline unavailable");const budget=Math.min(availableMs,PRIME_LIFT_LIMITS.collectorMs),check=()=>{if(performance.now()-start>=budget)throw new Error("prime lift deadline exhausted");};check();const input=exactInput(raw),{n,M,q,parent}=input,N=n+1,Q=M*q;
  // Reflection t -> modulus-t preserves every distance, including endpoints and labels.
  const firstWitness=(tuple:number[],m:number,omit:number|null=null)=>{for(let t=1;t<=Math.floor(m/2);t++){if(!(t%64))check();if(tuple.every((v,i)=>i===omit||N*primeLiftDistance(t,v,m)>=m))return t;}return null;};
  if(firstWitness(parent,M)!==null)throw new Error("prime lift parent NO_GRID premise false");const deletionWitnesses=parent.map((_,e)=>{const t=firstWitness(parent,M,e);if(t===null)throw new Error("prime lift same-threshold deletion premise false");return t;});
  let qInverse=1;while(q*qInverse%M!==1)qInverse++;const divisibleDigits=parent.map(v=>{for(let a=0;a<q;a++)if((v+M*a)%q===0)return a;throw new Error("prime lift inverse failure");});
  // Actual p83 uses ORIGINAL level14, not Q=1162. Generic facts are only q-proper.
  const gcdModulus=q===7&&M===166?14:q;
  const proper=(tuple:number[])=>tuple.some((_,e)=>{let g=gcdModulus;for(let i=0;i<n;i++)if(i!==e)g=gcd(g,tuple[i]);return g>1;});const rows:PrimeLiftRow[]=[];
  const add=(digits:number[],exception:number|null)=>{check();const tuple=parent.map((v,i)=>v+M*digits[i]),rawWitness=firstWitness(tuple,Q);let witness:PrimeLiftRow["witness"]=null;
    if(exception===null){if(rawWitness!==null)throw new Error("prime lift all-divisible NO_GRID contradiction");}else{const s=deletionWitnesses[exception],j0=q*s%M;for(let h=0;h<q;h++){const j=j0+M*h,distances=tuple.map(v=>primeLiftDistance(j,v,Q));if(distances.every(d=>N*d>=Q)){const preservedParentDistances=parent.map(v=>primeLiftDistance(s,v,M));for(let i=0;i<n;i++)if(i!==exception&&distances[i]!==q*preservedParentDistances[i])throw new Error("prime lift phase identity failed");witness={s,j0,h,j,distances,preservedParentDistances};break;}}if(!witness||rawWitness===null)throw new Error("prime lift constructive witness failed");}
    rows.push({digits:digits.slice(),tuple,exception,classification:exception===null?"NO_GRID":"GRID",gcdProper:proper(tuple),witness});};
  add(divisibleDigits,null);for(let e=0;e<n;e++)for(let a=0;a<q;a++)if(a!==divisibleDigits[e]){const digits=divisibleDigits.slice();digits[e]=a;add(digits,e);}rows.sort((a,b)=>{for(let i=0;i<n;i++)if(a.tuple[i]!==b.tuple[i])return a.tuple[i]-b.tuple[i];return 0;});check();
  // Only q=7,M=166 with two odd inherited coordinates closes the other gcd factor2.
  const fullGcdSubset=q===7&&M===166&&parent.filter(v=>v%2).length>=2;
  return {input,Q,qInverse,gcdModulus,divisibleDigits,deletionWitnesses,rows,counts:{subset:rows.length,grid:rows.filter(x=>x.classification==="GRID").length,noGrid:rows.filter(x=>x.classification==="NO_GRID").length,gcdProper:rows.filter(x=>x.gcdProper).length},fullGcdSubset};
}
/** Semantic admission has NO fixed report/hash prefilter; changed or omitted labelled rows fail. */
export function validatePrimeLiftStructure(raw:unknown,expectedInput:unknown,availableMs:number=PRIME_LIFT_LIMITS.collectorMs):PrimeLiftEvidence|null{
  const start=performance.now(),budget=Math.min(availableMs,PRIME_LIFT_LIMITS.collectorMs);try{if(!Number.isSafeInteger(availableMs)||availableMs<=0||Buffer.byteLength(canonicalJson(raw))>PRIME_LIFT_LIMITS.requestBytes)return null;const fresh=constructPrimeLiftStructure(expectedInput,Math.floor(budget-(performance.now()-start)));if(canonicalJson(raw)!==canonicalJson(fresh)||performance.now()-start>=budget)return null;return fresh;}catch{return null;}
}
export function validatePrimeLiftAncestors(bytes:Uint8Array):number[][]|null{if(bytes.length!==52||createHash("sha256").update(bytes).digest("hex")!==PRIME_LIFT_DEPENDENCY.ancestorSha256)return null;
  const expected=[[1,2,3,4,5,6,7,8,9,10,11,12,13],[1,2,3,4,5,6,7,8,9,10,11,13,24]],result:number[][]=[];for(let r=0;r<2;r++){const row:number[]=[];for(let i=0;i<13;i++)row.push((bytes[26*r+2*i]<<8)|bytes[26*r+2*i+1]);result.push(row);}return canonicalJson(result)===canonicalJson(expected)?result:null;
}
export function primeLiftBoundary(){const digits=Array.from({length:7},(_,i)=>i),distances=digits.map(a=>primeLiftDistance(83,1+166*a,1162));return {N:14 as const,Q:1162 as const,time:83 as const,speed:1 as const,digits,distances,strictBad:distances.filter(d=>14*d<1162).length,closedBad:distances.filter(d=>14*d<=1162).length};}
export const primeLiftReportDigest=(body:Omit<PrimeLiftReport,"reportDigest">)=>sha256(canonicalJson(body));
export const primeLiftRequest=(roots:PrimeLiftEvidence[],boundary:ReturnType<typeof primeLiftBoundary>)=>({version:1,boundary:"STRICT_OPEN_BAD",roots,control:boundary});
