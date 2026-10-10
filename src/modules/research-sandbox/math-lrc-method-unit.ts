import { z } from "zod";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { freezeLrcData } from "./math-lrc-research-program";

export const LRC_SHIFT_LIMITS=freezeLrcData({bytes:32768,bits:256,milliseconds:5000,operations:2000000,seedBytes:2048} as const);
export const LRC_FEW_EXCEPTION_SHIFT_UNIT=freezeLrcData({
  "id": "FEW_EXCEPTION_SHIFT_14_V1",
  "mode": "REPRODUCTION",
  "sourceLocator": "arXiv:2609.02604v2#S4.SS4, Lemma 4.6",
  "statement": "Assume LRC(m) for every m in {1,...,12}. For every u in Z_{>0}^{14} and every prime d, let E={i in {1,...,14}: d does not divide u_i}, e=|E| and m_d=ceil(2d/15). If e>=2 and e*m_d<d, then there exists t in R such that for every i in {1,...,14}, norm(t*u_i)>=1/15.",
  "repeatedAndNonprimitiveSpeeds": "Allowed by this statement; any distinct/primitive restriction for the larger source proof remains a separate reduction obligation",
  "premiseIds": [
    "LOWER_LRC_1_TO_12",
    "POSITIVE_INTEGER_14_SPEED_DOMAIN",
    "PRIME_UNIT_EXCEPTION_PERMUTATION",
    "STRICT_UNION_BOUND",
    "LOWER_CONTINUOUS_WITNESS",
    "PHASE_CELL_SYMBOLIC_ALIGNMENT"
  ],
  "stepIds": [
    "DIVISIBLE_SUBPROBLEM",
    "LOWER_WITNESS",
    "SHIFT_INVARIANCE",
    "UNIT_PERMUTATION",
    "BAD_ARC_COUNT",
    "UNION_BOUND",
    "COMMON_SHIFT_WITNESS"
  ],
  "analyticalDebt": [
    "Existence and domain alignment of the lower continuous witness",
    "Real-time phase partition argument and its independently admitted statement alignment"
  ],
  "ceiling": "REVIEWED_CONDITIONAL_ARGUMENT_PLUS_EXACT_FINITE_CONTROLS",
  "global14Or15Closure": false,
  "finitePredicateId": "SHIFT_PHASE_PARTITION_AND_COMMON_SHIFT_FINITE_V1",
  "finiteDomain": {
    "totalRunners": 15,
    "dAndE": [
      {
        "d": 3,
        "e": [
          2
        ]
      },
      {
        "d": 5,
        "e": [
          2,
          3,
          4
        ]
      }
    ],
    "shiftIndices": "j in {0,...,d-1}",
    "unitResidues": "a in {1,...,d-1}",
    "phases": "Canonical reduced rational offsets in [0,1); supplied tuple has exactly e entries",
    "bad": "norm(alpha_i+a_i*j/d)<1/15",
    "good": "norm(alpha_i+a_i*j/d)>=1/15",
    "equality": "GOOD"
  },
  "quotas": {
    "inputAndCertificateBytes": 32768,
    "integerComponentBits": 256,
    "milliseconds": 5000,
    "chargedOperations": 2000000,
    "certificateBytes": 32768,
    "phasePartitions": 4,
    "boundariesPerPartition": 10,
    "cellsPerPartition": 20,
    "feedbackBytes": 8192,
    "summaryBytes": 32768
  },
  "capMeaning": "Explicit charged arithmetic/comparison/partition work model plus cooperative monotonic deadline; not hard OS preemption. Parse bytes and component lengths before BigInt work; refuse any intermediate component beyond 256 bits.",
  "unsupported": "Well-formed d/e/domain outside the four sealed classes returns UNSUPPORTED without mathematical verdict; malformed data is REFUSED. No silent domain widening.",
  "checkerVersion": "LRC_SHIFT_FINITE_CHECKER_V1_PENDING_IMPLEMENTATION_HASH",
  "checkerMustNotImport": [
    "historical producer/verifier execution",
    "author code",
    "forest collectors",
    "provider adapters",
    "DB",
    "source network"
  ],
  "resultKinds": [
    "FINITE_CERTIFICATE_ACCEPTED",
    "CERTIFICATE_REFUSED",
    "UNSUPPORTED",
    "RESOURCE_REFUSED"
  ],
  "finiteResultIsUniversalProof": false
} as const);
export const LRC_METHOD_UNIT_DIGEST=sha256(canonicalJson(LRC_FEW_EXCEPTION_SHIFT_UNIT));
export const LRC_SHIFT_PREDICATE="SHIFT_PHASE_PARTITION_AND_COMMON_SHIFT_FINITE_V1" as const;
const hash=z.string().regex(/^[a-f0-9]{64}$/),id=z.string().min(1).max(160);
const decimal=z.string().regex(/^(0|[1-9][0-9]{0,77})$/);
export const lrcShiftRationalSchema=z.object({numerator:decimal,denominator:z.string().regex(/^[1-9][0-9]{0,77}$/)}).strict();
export type LrcShiftRational=z.infer<typeof lrcShiftRationalSchema>;
const mask=z.array(z.number().int().min(0).max(4)).max(5);
const cell=z.object({kind:z.enum(["BOUNDARY","OPEN"]),left:lrcShiftRationalSchema,right:lrcShiftRationalSchema,representative:lrcShiftRationalSchema,badShiftIndices:mask}).strict();
const partition=z.object({unitResidue:z.number().int().min(1).max(4),boundaries:z.array(lrcShiftRationalSchema).min(6).max(10),cells:z.array(cell).min(12).max(20)}).strict();
export const lrcShiftPhaseCertificateSchema=z.object({version:z.literal(1),totalRunners:z.literal(15),d:z.union([z.literal(3),z.literal(5)]),partitions:z.array(partition).min(2).max(4),maximumBadPerException:z.number().int().min(0).max(5),m_d:z.literal(1),tupleBadMasks:z.array(mask).min(2).max(4),goodShiftIndices:mask,certificateDigest:hash}).strict();
const canonicalPhase=(v:LrcShiftRational)=>{let n=BigInt(v.numerator),d=BigInt(v.denominator);if(n.toString(2).length>256||d.toString(2).length>256||n>=d)return false;while(d){[n,d]=[d,n%d];}return n===BigInt(1);};
export const lrcMethodUnitFiniteSeedSchema=z.object({d:z.union([z.literal(3),z.literal(5)]),e:z.number().int().min(2).max(4),unitResidues:z.array(z.number().int().min(1).max(4)).min(2).max(4),offsets:z.array(lrcShiftRationalSchema).min(2).max(4)}).strict().superRefine((v,c)=>{if(v.unitResidues.length!==v.e||v.offsets.length!==v.e||v.d===3&&(v.e!==2||v.unitResidues.some(a=>a>=3))||v.unitResidues.some(a=>a>=v.d)||!v.offsets.every(canonicalPhase)||Buffer.byteLength(canonicalJson(v))>2048)c.addIssue({code:"custom",message:"Exact canonical finite seed scope/bytes differ"});});
export type LrcMethodUnitFiniteSeed=z.infer<typeof lrcMethodUnitFiniteSeedSchema>;
export const lrcShiftFiniteInputSchema=z.object({version:z.literal(1),predicateId:z.literal(LRC_SHIFT_PREDICATE),d:z.union([z.literal(3),z.literal(5)]),e:z.number().int().min(2).max(4),unitResidues:z.array(z.number().int().min(1).max(4)).min(2).max(4),offsets:z.array(lrcShiftRationalSchema).min(2).max(4),certificate:lrcShiftPhaseCertificateSchema}).strict();
export type LrcShiftPhaseCertificate=z.infer<typeof lrcShiftPhaseCertificateSchema>;
export type LrcShiftFiniteInput=z.infer<typeof lrcShiftFiniteInputSchema>;
type Q={n:bigint;d:bigint};
export type LrcShiftBudgetOptions={maxMs?:number;maxOperations?:number};
class Budget {
 start=performance.now();operations=0;ms:number;max:number;
 constructor(options:LrcShiftBudgetOptions={}){this.ms=options.maxMs===undefined?5000:options.maxMs;this.max=options.maxOperations===undefined?2000000:options.maxOperations;if(!Number.isInteger(this.ms)||this.ms<1||this.ms>5000||!Number.isInteger(this.max)||this.max<1||this.max>2000000)throw new Error("RESOURCE_REFUSED");}
 charge(n=1){if(this.operations+n>this.max||performance.now()-this.start>this.ms)throw new Error("RESOURCE_REFUSED");this.operations+=n;}
 integer(x:bigint){this.charge();if((x<BigInt(0)?-x:x).toString(2).length>256)throw new Error("RESOURCE_REFUSED");return x;}
}
function q(b:Budget,n:bigint,d=BigInt(1)):Q {b.integer(n);b.integer(d);if(d<=BigInt(0))throw new Error("CERTIFICATE_REFUSED");let a=n<BigInt(0)?-n:n,c=d;while(c){b.charge(3);[a,c]=[c,a%c];}return {n:n/a,d:d/a};}
function add(b:Budget,a:Q,c:Q){return q(b,b.integer(b.integer(a.n*c.d)+b.integer(c.n*a.d)),b.integer(a.d*c.d));}
function compare(b:Budget,a:Q,c:Q){b.charge(3);return b.integer(b.integer(a.n*c.d)-b.integer(c.n*a.d));}
function mod(b:Budget,a:Q){b.charge(3);return q(b,b.integer(b.integer(a.n%a.d)+a.d)%a.d,a.d);}
const wire=(a:Q):LrcShiftRational=>({numerator:a.n.toString(),denominator:a.d.toString()});
function read(b:Budget,a:LrcShiftRational):Q {const x=q(b,BigInt(a.numerator),BigInt(a.denominator));if(canonicalJson(wire(x))!==canonicalJson(a))throw new Error("CERTIFICATE_REFUSED");return x;}
const same=(a:unknown,c:unknown)=>canonicalJson(a)===canonicalJson(c);
function assertRationalComponentResources(raw:unknown,depth=0):void {if(depth>32)throw new Error("RESOURCE_REFUSED");if(!raw||typeof raw!=="object")return;const v=raw as Record<string,unknown>;if(typeof v.numerator==="string"&&typeof v.denominator==="string"){for(const x of [v.numerator,v.denominator])if(/^(0|[1-9][0-9]*)$/.test(x)&&(x.length>78||BigInt(x).toString(2).length>256))throw new Error("RESOURCE_REFUSED");}for(const child of Object.values(v))assertRationalComponentResources(child,depth+1);}
const bodyDigest=(c:LrcShiftPhaseCertificate)=>{const {certificateDigest:_,...body}=c;void _;return sha256(canonicalJson(body));};
function seedFor(raw:unknown,b:Budget):LrcMethodUnitFiniteSeed {if(Buffer.byteLength(canonicalJson(raw))>2048)throw new Error("RESOURCE_REFUSED");assertRationalComponentResources(raw);const s=lrcMethodUnitFiniteSeedSchema.parse(raw);for(const a of s.offsets){const r=read(b,a);if(r.n<BigInt(0)||r.n>=r.d)throw new Error("CERTIFICATE_REFUSED");}return s;}
function bad(b:Budget,phase:Q,a:number,d:number) {const out:number[]=[];for(let j=0;j<d;j++){b.charge(2);const r=mod(b,add(b,phase,q(b,BigInt(a*j),BigInt(d))));const dist=r.n<r.d-r.n?r.n:r.d-r.n;if(b.integer(BigInt(15)*dist)<r.d)out.push(j);}return out;}
function producer(seed:LrcMethodUnitFiniteSeed,b:Budget):LrcShiftPhaseCertificate {
 const partitions:LrcShiftPhaseCertificate["partitions"]=[];let maximum=0;
 for(let a=1;a<seed.d;a++){
  b.charge(2);const map=new Map<string,Q>();
  for(let j=0;j<seed.d;j++)for(const sign of [-1,1]){b.charge(3);const p=mod(b,q(b,BigInt(sign*seed.d-15*a*j),BigInt(15*seed.d)));map.set(canonicalJson(wire(p)),p);}
  const points=[...map.values()].sort((x,y)=>{const c=compare(b,x,y);return c<BigInt(0)?-1:c>BigInt(0)?1:0;}),cells:LrcShiftPhaseCertificate["partitions"][number]["cells"]=[];
  for(let i=0;i<points.length;i++){b.charge(2);const left=points[i],right=i+1<points.length?points[i+1]:add(b,points[0],q(b,BigInt(1)));const mid=q(b,b.integer(b.integer(left.n*right.d)+b.integer(right.n*left.d)),b.integer(b.integer(BigInt(2)*left.d)*right.d));
    for(const open of [false,true]){b.charge();const representative=open?mod(b,mid):left,mask=bad(b,representative,a,seed.d);maximum=Math.max(maximum,mask.length);cells.push({kind:open?"OPEN":"BOUNDARY",left:wire(left),right:wire(open?right:left),representative:wire(representative),badShiftIndices:mask});}
  }
  partitions.push({unitResidue:a,boundaries:points.map(wire),cells});
 }
 const tupleBadMasks=seed.offsets.map((a,i)=>bad(b,read(b,a),seed.unitResidues[i],seed.d)),union=new Set(tupleBadMasks.flat());
 const body={version:1 as const,totalRunners:15 as const,d:seed.d,partitions,maximumBadPerException:maximum,m_d:1 as const,tupleBadMasks,goodShiftIndices:Array.from({length:seed.d},(_,j)=>j).filter(j=>!union.has(j))};
 return freezeLrcData(lrcShiftPhaseCertificateSchema.parse({...body,certificateDigest:sha256(canonicalJson(body))}));
}
export function buildLrcShiftPhaseCertificate(raw:unknown,options:LrcShiftBudgetOptions={}):LrcShiftPhaseCertificate {const b=new Budget(options);return producer(seedFor(raw,b),b);}
function consumer(raw:unknown,b:Budget) {
 b.charge();if(Buffer.byteLength(canonicalJson(raw))>32768)throw new Error("RESOURCE_REFUSED");
 const v=lrcShiftFiniteInputSchema.parse(raw),s=seedFor({d:v.d,e:v.e,unitResidues:v.unitResidues,offsets:v.offsets},b),c=v.certificate;
 if(c.d!==s.d||c.partitions.length!==s.d-1||c.certificateDigest!==bodyDigest(c))throw new Error("CERTIFICATE_REFUSED");
 let maximum=0,cellCount=0;
 // Independently enumerate every predicate zero, cell adjacency and mask; never call producer.
 for(let a=1;a<s.d;a++){b.charge(2);const points=new Map<string,Q>();
  for(let j=0;j<s.d;j++){b.charge();for(const side of [BigInt(1),-BigInt(1)]){const root=mod(b,add(b,q(b,side,BigInt(15)),q(b,-BigInt(a*j),BigInt(s.d))));points.set(canonicalJson(wire(root)),root);}}
  const roots=[...points.values()].sort((x,y)=>{const r=compare(b,x,y);return r<BigInt(0)?-1:r>BigInt(0)?1:0;}),p=c.partitions[a-1];
  if(p.unitResidue!==a||!same(p.boundaries,roots.map(wire))||p.cells.length!==roots.length*2)throw new Error("CERTIFICATE_REFUSED");
  for(let i=0;i<roots.length;i++)for(let kind=0;kind<2;kind++){b.charge(3);const left=roots[i],right=kind?(i+1<roots.length?roots[i+1]:add(b,roots[0],q(b,BigInt(1)))):left;
   const actual=p.cells[2*i+kind],rep=read(b,actual.representative),expectedRep=kind?mod(b,q(b,b.integer(b.integer(left.n*right.d)+b.integer(right.n*left.d)),b.integer(b.integer(BigInt(2)*left.d)*right.d))):left;
   if(actual.kind!==(kind?"OPEN":"BOUNDARY")||!same(actual.left,wire(left))||!same(actual.right,wire(right))||compare(b,rep,expectedRep)!==BigInt(0))throw new Error("CERTIFICATE_REFUSED");
   const mask:number[]=[];for(let j=0;j<s.d;j++){b.charge(5);const den=b.integer(rep.d*BigInt(s.d)),rawNumer=b.integer(b.integer(rep.n*BigInt(s.d))+b.integer(BigInt(a*j)*rep.d)),num=b.integer(b.integer(rawNumer%den)+den)%den,dist=num<den-num?num:den-num;if(b.integer(BigInt(15)*dist)<den)mask.push(j);}
   if(!same(mask,actual.badShiftIndices))throw new Error("CERTIFICATE_REFUSED");maximum=Math.max(maximum,mask.length);cellCount++;
  }
 }
 // Independent tuple arithmetic, rather than trust producer masks or representative coverage.
 const tuple=s.offsets.map((r,i)=>{const p=read(b,r),out:number[]=[];for(let j=0;j<s.d;j++){b.charge(5);const den=b.integer(p.d*BigInt(s.d)),x=b.integer(b.integer(p.n*BigInt(s.d))+b.integer(BigInt(s.unitResidues[i]*j)*p.d)),n=b.integer(b.integer(x%den)+den)%den;if(b.integer(BigInt(15)*(n<den-n?n:den-n))<den)out.push(j);}return out;});
 const union=new Set(tuple.flat()),good=Array.from({length:s.d},(_,j)=>j).filter(j=>!union.has(j));
 if(maximum>1||c.maximumBadPerException!==maximum||c.m_d!==1||s.e>=s.d||!same(tuple,c.tupleBadMasks)||!same(good,c.goodShiftIndices)||!good.length)throw new Error("CERTIFICATE_REFUSED");
 return {tupleBadMasks:tuple,goodShiftIndices:good,maximumBadPerException:maximum,m_d:1 as const,partitions:s.d-1,cells:cellCount,globalLrc:"NOT_ESTABLISHED" as const,realTimeProof:"NOT_ESTABLISHED" as const};
}
export type LrcShiftFiniteResult=ReturnType<typeof consumer>;
function unsupportedSeed(raw:unknown):boolean {const broad=z.object({d:z.number().int().min(2).max(1000000),e:z.number().int().min(2).max(14),unitResidues:z.array(z.number().int().min(1).max(999999)).min(2).max(14),offsets:z.array(lrcShiftRationalSchema).min(2).max(14)}).strict().safeParse(raw);return broad.success&&broad.data.unitResidues.length===broad.data.e&&broad.data.offsets.length===broad.data.e&&broad.data.unitResidues.every(a=>a<broad.data.d)&&broad.data.offsets.every(canonicalPhase)&&(![3,5].includes(broad.data.d)||broad.data.d===3&&broad.data.e!==2||broad.data.d===5&&![2,3,4].includes(broad.data.e));}
export function verifyLrcShiftFiniteCertificate(raw:unknown,options:LrcShiftBudgetOptions={}):{status:"FINITE_CERTIFICATE_ACCEPTED"|"CERTIFICATE_REFUSED"|"UNSUPPORTED"|"RESOURCE_REFUSED";result:LrcShiftFiniteResult|null;elapsedMs:number|null;chargedOperations:number|null} {
 let b:Budget|undefined;try{b=new Budget(options);if(Buffer.byteLength(canonicalJson(raw))>32768)throw new Error("RESOURCE_REFUSED");assertRationalComponentResources(raw);const broad=lrcShiftFiniteInputSchema.extend({d:z.number().int().min(2).max(1000000),e:z.number().int().min(2).max(14),unitResidues:z.array(z.number().int().min(1).max(999999)).min(2).max(14),offsets:z.array(lrcShiftRationalSchema).min(2).max(14)}).strict().safeParse(raw);if(broad.success&&unsupportedSeed({d:broad.data.d,e:broad.data.e,unitResidues:broad.data.unitResidues,offsets:broad.data.offsets}))return {status:"UNSUPPORTED",result:null,elapsedMs:null,chargedOperations:null};
 const result=consumer(raw,b);b.charge();return {status:"FINITE_CERTIFICATE_ACCEPTED",result,elapsedMs:performance.now()-b.start,chargedOperations:b.operations};
 }catch(e){return {status:e instanceof Error&&e.message==="RESOURCE_REFUSED"?"RESOURCE_REFUSED":"CERTIFICATE_REFUSED",result:null,elapsedMs:b?performance.now()-b.start:null,chargedOperations:b?.operations??null};}
}
export const lrcMethodUnitFiniteBindingSchema=z.object({caseId:id,runId:id,contractDigest:hash,reviewJobId:id,solverAttemptDigest:hash,adversaryReportDigest:hash}).strict();
export type LrcMethodUnitFiniteBinding=z.infer<typeof lrcMethodUnitFiniteBindingSchema>;
export const lrcMethodUnitSourcePinsSchema=z.object({producerSourceSha256:hash,checkerSourceSha256:hash}).strict();
export type LrcMethodUnitSourcePins=z.infer<typeof lrcMethodUnitSourcePinsSchema>;
const resultSchema=z.object({tupleBadMasks:z.array(mask).min(2).max(4),goodShiftIndices:mask,maximumBadPerException:z.number().int().min(0).max(1),m_d:z.literal(1),partitions:z.number().int().min(2).max(4),cells:z.number().int().min(12).max(80),globalLrc:z.literal("NOT_ESTABLISHED"),realTimeProof:z.literal("NOT_ESTABLISHED")}).strict();
const finiteRecordBodySchema=z.object({version:z.literal(1),status:z.enum(["CHECKED_FINITE","MISSING","UNSUPPORTED","CERTIFICATE_REFUSED","RESOURCE_REFUSED"]),predicateId:z.literal(LRC_SHIFT_PREDICATE),unitDigest:z.literal(LRC_METHOD_UNIT_DIGEST),binding:lrcMethodUnitFiniteBindingSchema,seedDigest:hash.nullable(),input:lrcShiftFiniteInputSchema.nullable(),inputDigest:hash.nullable(),certificateDigest:hash.nullable(),producer:z.object({version:z.literal("LRC_SHIFT_PRODUCER_V1"),sourceSha256:hash}).strict().nullable(),checker:z.object({version:z.literal("LRC_SHIFT_FINITE_CHECKER_V1"),sourceSha256:hash,inputDigest:hash.nullable(),outputDigest:hash.nullable(),elapsedMs:z.number().finite().min(0),chargedOperations:z.number().int().min(0).max(2000000)}).strict().nullable(),result:resultSchema.nullable(),summary:z.string().max(1024)}).strict();
export const lrcMethodUnitFiniteEvidenceSchema=finiteRecordBodySchema.extend({recordDigest:hash}).strict().superRefine((r,c)=>{
 const {recordDigest,...body}=r;if(sha256(canonicalJson(body))!==recordDigest||Buffer.byteLength(canonicalJson(r))>32768)c.addIssue({code:"custom",message:"Finite record bytes/digest"});
 if(r.status==="CHECKED_FINITE"? !r.input||!r.inputDigest||!r.certificateDigest||!r.producer||!r.checker||!r.result||r.seedDigest===null : r.result!==null)c.addIssue({code:"custom",message:"Finite status/evidence differs"});
 if(r.status==="MISSING"&&[r.seedDigest,r.input,r.inputDigest,r.certificateDigest,r.producer,r.checker,r.result].some(v=>v!==null))c.addIssue({code:"custom",message:"Missing seed cannot manufacture execution"});
 if(r.input&&(r.inputDigest!==sha256(canonicalJson(r.input))||r.certificateDigest!==r.input.certificate.certificateDigest||bodyDigest(r.input.certificate)!==r.certificateDigest))c.addIssue({code:"custom",message:"Finite input/certificate hashes"});
 if(r.input&&r.seedDigest!==sha256(canonicalJson({d:r.input.d,e:r.input.e,unitResidues:r.input.unitResidues,offsets:r.input.offsets})))c.addIssue({code:"custom",message:"Retained input differs from exact solver seed"});
 if(r.result&&r.input&&(r.result.partitions!==r.input.certificate.partitions.length||r.result.cells!==r.input.certificate.partitions.reduce((n,p)=>n+p.cells.length,0)||!same(r.result.tupleBadMasks,r.input.certificate.tupleBadMasks)||!same(r.result.goodShiftIndices,r.input.certificate.goodShiftIndices)||r.result.maximumBadPerException!==r.input.certificate.maximumBadPerException))c.addIssue({code:"custom",message:"Passive result and certificate content differ"});
 if(r.checker&&(r.checker.inputDigest!==r.inputDigest||r.checker.outputDigest!==(r.result?sha256(canonicalJson(r.result)):null)))c.addIssue({code:"custom",message:"Finite actual result differs"});
 if(r.status==="CHECKED_FINITE"&&r.checker&&r.checker.elapsedMs>5000)c.addIssue({code:"custom",message:"Over-deadline check cannot gain finite coverage"});
 if(r.summary!==finiteSummary(r.status,r.result))c.addIssue({code:"custom",message:"Finite summary not derived"});
});
export type LrcMethodUnitFiniteEvidence=z.infer<typeof lrcMethodUnitFiniteEvidenceSchema>;
function finiteSummary(status:LrcMethodUnitFiniteEvidence["status"],result:LrcShiftFiniteResult|null){return canonicalJson({status,goodShiftIndices:result?.goodShiftIndices??null,partitions:result?.partitions??null,cells:result?.cells??null,globalLrc:"NOT_ESTABLISHED",realTimeProof:"NOT_ESTABLISHED"});}
export function buildLrcMethodUnitFiniteEvidence(input:{binding:LrcMethodUnitFiniteBinding;seed:unknown;pins:LrcMethodUnitSourcePins;budget?:LrcShiftBudgetOptions}):LrcMethodUnitFiniteEvidence {
 const binding=lrcMethodUnitFiniteBindingSchema.parse(input.binding),pins=lrcMethodUnitSourcePinsSchema.parse(input.pins);
 let status:LrcMethodUnitFiniteEvidence["status"]="MISSING",seedDigest:string|null=null,finiteInput:LrcShiftFiniteInput|null=null,result:LrcShiftFiniteResult|null=null,producerRecord:LrcMethodUnitFiniteEvidence["producer"]=null,checker:LrcMethodUnitFiniteEvidence["checker"]=null;
 if(input.seed!==undefined&&input.seed!==null){
  let budget:Budget|undefined,consumerInvoked=false;try{budget=new Budget(input.budget);const seedText=canonicalJson(input.seed);seedDigest=sha256(seedText);if(Buffer.byteLength(seedText)>2048)throw new Error("RESOURCE_REFUSED");assertRationalComponentResources(input.seed);if(unsupportedSeed(input.seed)){status="UNSUPPORTED";}else {const seed=seedFor(input.seed,budget);const cert=producer(seed,budget);finiteInput={version:1,predicateId:LRC_SHIFT_PREDICATE,...seed,certificate:cert};producerRecord={version:"LRC_SHIFT_PRODUCER_V1",sourceSha256:pins.producerSourceSha256};consumerInvoked=true;result=consumer(finiteInput,budget);budget.charge();status="CHECKED_FINITE";}
  }catch(e){status=e instanceof Error&&e.message==="RESOURCE_REFUSED"?"RESOURCE_REFUSED":"CERTIFICATE_REFUSED";result=null;}
  if(budget&&consumerInvoked)checker={version:"LRC_SHIFT_FINITE_CHECKER_V1",sourceSha256:pins.checkerSourceSha256,inputDigest:finiteInput?sha256(canonicalJson(finiteInput)):null,outputDigest:result?sha256(canonicalJson(result)):null,elapsedMs:performance.now()-budget.start,chargedOperations:budget.operations};
 }
 const body={version:1 as const,status,predicateId:LRC_SHIFT_PREDICATE,unitDigest:LRC_METHOD_UNIT_DIGEST,binding,seedDigest,input:finiteInput,inputDigest:finiteInput?sha256(canonicalJson(finiteInput)):null,certificateDigest:finiteInput?.certificate.certificateDigest??null,producer:producerRecord,checker,result,summary:finiteSummary(status,result)};
 return freezeLrcData(lrcMethodUnitFiniteEvidenceSchema.parse({...body,recordDigest:sha256(canonicalJson(body))}));
}
/** Passive admission: digest/registry/identity checks only, never producer or consumer. */
export function validateLrcMethodUnitFiniteEvidence(raw:unknown,expected:{binding:LrcMethodUnitFiniteBinding;pins:LrcMethodUnitSourcePins;seed:unknown}):raw is LrcMethodUnitFiniteEvidence {try{const r=lrcMethodUnitFiniteEvidenceSchema.parse(raw),pins=lrcMethodUnitSourcePinsSchema.parse(expected.pins);return same(r.binding,lrcMethodUnitFiniteBindingSchema.parse(expected.binding))&&r.seedDigest===(expected.seed===undefined||expected.seed===null?null:sha256(canonicalJson(expected.seed)))&&(!r.producer||r.producer.sourceSha256===pins.producerSourceSha256)&&(!r.checker||r.checker.sourceSha256===pins.checkerSourceSha256);}catch{return false;}}
