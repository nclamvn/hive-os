import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";

export const PREFIX_KZ_LIMITS = Object.freeze({ bytes: 262144, pythonBytes: 30000, replayMs: 5000, collectorMs: 10000, admissionMs: 5000 });
export const PREFIX_KZ_RETAINED_PATH = "docs/research/lrc-allikvere-v2/retained-prefix-kz-audit.json";
export const PREFIX_KZ_PYTHON_SHA256 = "4db152962dd6991e7454cb02922c818aebbdceddfb0ec5d8fee2d687b4baf87c";
export const PREFIX_KZ_RETAINED_SHA256 = "e17d97fa1d4a8f05e899e06cfb2da24fb439376fe25b6783eb9c10da650ab8f6";
export const PREFIX_KZ_SOURCE = Object.freeze({ id: "arXiv:2609.02604v2", url: "https://arxiv.org/html/2609.02604v2", sections: ["S3.SS2", "S3.SS3", "S3.SS4"] });
export type PrefixKzRational = { numerator: string; denominator: string };
type Q = { n: bigint; d: bigint };
const zero = BigInt(0), one = BigInt(1);
function gcd(a: bigint,b: bigint): bigint { while(b) [a,b]=[b,a%b]; return a<zero?-a:a; }
function q(n: bigint,d=one): Q { if(d<=zero) throw new Error("Invalid denominator"); const g=gcd(n,d);return {n:n/g,d:d/g}; }
function add(a: Q,b: Q): Q {return q(a.n*b.d+b.n*a.d,a.d*b.d);}
function sub(a: Q,b: Q): Q {return q(a.n*b.d-b.n*a.d,a.d*b.d);}
function mul(a: Q,b: Q): Q {return q(a.n*b.n,a.d*b.d);}
function div(a: Q,b: Q): Q {if(b.n<=zero) throw new Error("Invalid divisor");return q(a.n*b.d,a.d*b.n);}
function cmp(a: Q,b: Q): bigint {return a.n*b.d-b.n*a.d;}
function wire(a: Q): PrefixKzRational {return {numerator:a.n.toString(),denominator:a.d.toString()};}
function sum(values: Q[]): Q {return values.reduce(add,q(zero));}
function product(values: Q[]): Q {return values.reduce(mul,q(one));}
export const PREFIX_KZ_WRITTEN_BRIDGE = Object.freeze({
  status: "REVIEWED_MATHEMATICAL_BRIDGE" as const, formalProof: false as const,
  vertexCharacterization: "ALL_CONTIGUOUS_CONSTANT_Z_BLOCK_COMPOSITIONS" as const,
  recessionCone: "0<=u_1<=...<=u_d" as const,
  realDomainReduction: "MINKOWSKI_WEYL_COORDINATE_MONOTONE_CONCAVE_LOG_PRODUCT" as const,
  proofKind: "WRITTEN_ARGUMENT_PLUS_EXACT_FINITE_ARITHMETIC" as const,
});
export type PrefixKzTarget = {
  movingSpeeds: number; totalRunners: number; dimension: number;
  prefixes: {r:number;lowerLrcMax:number;separation:PrefixKzRational;errorCapacity:PrefixKzRational;witnessThreshold:PrefixKzRational;B:PrefixKzRational}[];
  increments: PrefixKzRational[]; incrementRatios: PrefixKzRational[];
  blocks: {start:number;end:number;geometricProduct:PrefixKzRational;incrementProduct:PrefixKzRational;ratio:PrefixKzRational}[];
  vertexAudit: {maskCount:number;firstMask:0;lastMask:number;minimum:PrefixKzRational;equalityCount:number;equalityMask:number;streamSha256:string;allFeasible:true};
};
export type PrefixKzBody = {
  version:1;status:"CHECKED_ABSTRACT_KZ_MINIMUM";globalVerdict:"NOT_ESTABLISHED";
  source:typeof PREFIX_KZ_SOURCE;rho:PrefixKzRational;writtenBridge:typeof PREFIX_KZ_WRITTEN_BRIDGE;
  prefixArgument:{status:"REVIEWED_CONDITIONAL_ARGUMENT";formalProof:false;lowerPremise:"NOT_ESTABLISHED";geometricPremise:"NOT_ESTABLISHED";nearestPlaneBound:"sqrt(sum(t_i))/2";equalityYieldsWitness:true};
  targets:PrefixKzTarget[];
  negativeControls:{id:string;B:PrefixKzRational[];t:PrefixKzRational[];actualProduct:PrefixKzRational;claimedMinimum:PrefixKzRational;prefixFeasible:true;kzFeasible:boolean;growthPremise:boolean;isLrcCounterexample:false}[];
};
export type PrefixKzReport = PrefixKzBody & {
  generatedAt:string;receipt:{method:"LOCAL_UNSIGNED_FRESH_PYTHON_REPLAY";sourceSha256:string;stdoutSha256:string;stdoutBytes:number;elapsedMs:number;externalAttestation:false};reportDigest:string;
};
export function prefixKzRequest() {return {version:1,source:PREFIX_KZ_SOURCE,movingSpeeds:[13,14],rho:{numerator:"3",denominator:"4"}};}
/** Fixed source specification only: no caller-selectable dimension or masks.
 * Enumerates EVERY cut mask and checks every real-polyhedron vertex. The
 * written continuous-to-finite bridge remains separate from this arithmetic. */
export function reconstructPrefixKzBody(): PrefixKzBody {
  const started=performance.now(),rho=q(BigInt(3),BigInt(4)),targets:PrefixKzTarget[]=[];
  for(const n of [13,14]) {
    const d=n-1,B=[q(zero)],prefixes:PrefixKzTarget["prefixes"]=[],w:Q[]=[q(one)];
    for(let r=1;r<=d;r++) {
      const separation=q(one,BigInt(n+1-r)),capacity=q(BigInt(r),BigInt((n+1)*(n+1-r))),threshold=sub(separation,capacity);
      if(cmp(threshold,q(one,BigInt(n+1)))!==zero) throw new Error("Prefix threshold mismatch");
      B.push(mul(q(BigInt(4)),mul(capacity,capacity)));
      prefixes.push({r,lowerLrcMax:n-r,separation:wire(separation),errorCapacity:wire(capacity),witnessThreshold:wire(threshold),B:wire(B[r])});
      if(r<d) w.push(mul(w[r-1],rho));
    }
    const c=B.slice(1).map((value,i)=>sub(value,B[i])),K=product(c),ratios=c.slice(1).map((value,i)=>div(value,c[i]));
    if(c.some(value=>value.n<=zero)||ratios.some(value=>cmp(value,q(BigInt(4),BigInt(3)))<=zero)) throw new Error("Growth premise failed");
    const blocks:PrefixKzTarget["blocks"]=[],cache=new Map<string,{t:Q[];prod:Q;scale:Q;prefixFeasible:boolean}>();
    for(let a=0;a<d;a++) for(let b=a+1;b<=d;b++) {
      const scale=div(sub(B[b],B[a]),sum(w.slice(a,b))),t=w.slice(a,b).map(value=>mul(value,scale));
      const gp=product(t),cp=product(c.slice(a,b));
      if(cmp(gp,cp)<zero||(b>a+1&&cmp(gp,cp)===zero)) throw new Error("Block product bound failed");
      let partial=B[a];
      for(let i=a;i<b;i++) {partial=add(partial,t[i-a]);if(cmp(partial,B[i+1])<zero) throw new Error("Internal prefix infeasible");}
      if(cmp(partial,B[b])!==zero) throw new Error("Inactive block end");
      cache.set(`${a}:${b}`,{t,prod:gp,scale,prefixFeasible:true});
      blocks.push({start:a+1,end:b,geometricProduct:wire(gp),incrementProduct:wire(cp),ratio:wire(div(gp,cp))});
    }
    const count=2**(d-1),stream:string[]=[];let minimum:Q|null=null,equalities=0,equalityMask=-1;
    for(let mask=0;mask<count;mask++) {
      const ends:number[]=[];for(let i=1;i<d;i++) if(mask&(1<<(i-1))) ends.push(i);ends.push(d);
      let a=0,p=q(one),previousScale:Q|null=null;
      for(const b of ends) {
        const block=cache.get(`${a}:${b}`)!;
        // Internal prefixes and KZ equalities were checked for every block;
        // check ALL vertices' joining inequalities, active ends and products.
        if(!block.prefixFeasible||(previousScale&&cmp(previousScale,block.scale)>=zero)) throw new Error("Vertex prefix/KZ infeasible");
        p=mul(p,block.prod);previousScale=block.scale;a=b;
      }
      if(!minimum||cmp(p,minimum)<zero) minimum=p;
      if(cmp(p,K)===zero) {equalities++;equalityMask=mask;}
      if(cmp(p,K)<zero) throw new Error("Vertex minimum failure");
      stream.push(`${canonicalJson({mask,ends,product:wire(p)})}\n`);
      if((mask&127)===0&&performance.now()-started>PREFIX_KZ_LIMITS.admissionMs) throw new Error("Prefix/KZ admission deadline");
    }
    if(!minimum||cmp(minimum,K)!==zero||equalities!==1||equalityMask!==count-1) throw new Error("Unique equality failure");
    targets.push({movingSpeeds:n,totalRunners:n+1,dimension:d,prefixes,increments:c.map(wire),incrementRatios:ratios.map(wire),blocks,
      vertexAudit:{maskCount:count,firstMask:0,lastMask:count-1,minimum:wire(minimum),equalityCount:equalities,equalityMask,streamSha256:sha256(stream.join("")),allFeasible:true}});
  }
  const controls=[{id:"OMITTED_KZ",B:[q(one),q(BigInt(5))],t:[q(BigInt(5)),q(BigInt(2),BigInt(5))],growthPremise:true},
    {id:"OMITTED_GROWTH",B:[q(one),q(BigInt(2))],t:[q(BigInt(8),BigInt(7)),q(BigInt(6),BigInt(7))],growthPremise:false}];
  const negativeControls=controls.map(control=>{
    const cp=mul(control.B[0],sub(control.B[1],control.B[0])),actualProduct=product(control.t),kzFeasible=cmp(control.t[1],mul(rho,control.t[0]))>=zero;
    if(cmp(control.t[0],control.B[0])<zero||cmp(sum(control.t),control.B[1])<zero||cmp(actualProduct,cp)>=zero) throw new Error("Negative control failed");
    return {id:control.id,B:control.B.map(wire),t:control.t.map(wire),actualProduct:wire(actualProduct),claimedMinimum:wire(cp),prefixFeasible:true as const,kzFeasible,growthPremise:control.growthPremise,isLrcCounterexample:false as const};
  });
  return {version:1,status:"CHECKED_ABSTRACT_KZ_MINIMUM",globalVerdict:"NOT_ESTABLISHED",source:PREFIX_KZ_SOURCE,rho:wire(rho),writtenBridge:PREFIX_KZ_WRITTEN_BRIDGE,
    prefixArgument:{status:"REVIEWED_CONDITIONAL_ARGUMENT",formalProof:false,lowerPremise:"NOT_ESTABLISHED",geometricPremise:"NOT_ESTABLISHED",nearestPlaneBound:"sqrt(sum(t_i))/2",equalityYieldsWitness:true},targets,negativeControls};
}
export function prefixKzReplayBytes(body:PrefixKzBody):string {return `${canonicalJson(body)}\n`;}
export function prefixKzReportDigest(raw:Omit<PrefixKzReport,"reportDigest">|PrefixKzReport):string {const {reportDigest:_,...body}=raw as PrefixKzReport;void _;return sha256(canonicalJson(body));}
/** Pure retained admission. Fixed formulas, canonical rationals, complete block
 * and mask domains are reconstructed, even for coherently rehashed reports.
 * Never launches Python, fetch, models or historical validators. */
export function validateRetainedPrefixKzReport(raw:unknown):PrefixKzReport|null {
  try {
    if(!raw||typeof raw!=="object"||Buffer.byteLength(JSON.stringify(raw))>PREFIX_KZ_LIMITS.bytes) return null;
    const r=raw as PrefixKzReport;
    const {generatedAt,receipt,reportDigest,...body}=r;
    if(typeof generatedAt!=="string"||!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(generatedAt)||!Number.isFinite(Date.parse(generatedAt))) return null;
    if(!receipt||Object.keys(receipt).sort().join(",")!=="elapsedMs,externalAttestation,method,sourceSha256,stdoutBytes,stdoutSha256") return null;
    if(receipt.method!=="LOCAL_UNSIGNED_FRESH_PYTHON_REPLAY"||receipt.sourceSha256!==PREFIX_KZ_PYTHON_SHA256||receipt.externalAttestation!==false||!Number.isSafeInteger(receipt.elapsedMs)||receipt.elapsedMs<1||receipt.elapsedMs>PREFIX_KZ_LIMITS.replayMs) return null;
    if(canonicalJson(body)!==canonicalJson(reconstructPrefixKzBody())) return null;
    const stdout=prefixKzReplayBytes(body);
    if(receipt.stdoutSha256!==sha256(stdout)||receipt.stdoutBytes!==Buffer.byteLength(stdout)||reportDigest!==prefixKzReportDigest(r)) return null;
    return r;
  } catch {return null;}
}
