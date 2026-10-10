import { z } from "zod";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { lrcFiniteScopeSchema, lrcScopeDigest, type LrcFiniteScope } from "./math-lrc-certificates";

export const PROPERNESS_LIMITS = Object.freeze({ shiftModulus: 32, cells: 128, cases: 32, bytes: 262144, pythonBytes: 20000, replayMs: 5000, work: 100000, milliseconds: 2000 });
export const PROPERNESS_PYTHON_SHA256 = "16acdd9457ef02cfdea0d96f2ddc0ca770cfe1b3ccb46b330b6004f24bb42f1b";
export const PROPERNESS_RETAINED_PATH = "docs/research/lrc-allikvere-v2/retained-properness-bridge.json";
export const PROPERNESS_SOURCE = Object.freeze({ id: "arXiv:2609.02604v2", url: "https://arxiv.org/html/2609.02604v2", sections: ["S2", "S4.SS4", "S6"] });
export const TIP048_REPORT_SHA256 = "40ad2047e804b4ea741d55869eb79c25f089de3951175bc612426bcd9b9772a1";
export const TIP048_FIXED_SCOPE_DIGEST = "28ea85ade2aca637589ea615d7ac45cc2dd42f6f5e264be8c4415afff87421c1";
const hex = z.string().regex(/^[a-f0-9]{64}$/), boundedInt = z.number().int().min(0).max(1000000);
const rationalSchema = z.object({ numerator: z.string().regex(/^\d{1,8}$/), denominator: z.string().regex(/^[1-9]\d{0,7}$/) }).strict();
export type PhaseRational = z.infer<typeof rationalSchema>;
const phaseCellSchema = z.object({ kind: z.enum(["BOUNDARY", "OPEN"]), left: rationalSchema, right: rationalSchema,
  representative: rationalSchema, badShiftIndices: z.array(z.number().int().min(0).max(31)).max(32) }).strict();
export const phaseCertificateSchema = z.object({ totalRunners: z.number().int().min(2).max(15), shiftModulus: z.number().int().min(2).max(32),
  boundaries: z.array(rationalSchema).min(1).max(64), cells: z.array(phaseCellSchema).min(2).max(128),
  maximumBadShifts: z.number().int().min(0).max(32), ceilBound: z.number().int().min(1).max(32), certificateDigest: hex }).strict();
export type PhaseCertificate = z.infer<typeof phaseCertificateSchema>;
export const congruenceClassSchema = z.object({ id: z.string().regex(/^[A-Za-z0-9_-]{1,80}$/), mechanism: z.enum(["NONPRIMITIVE", "OMIT_ONE", "FEW_EXCEPTIONS"]),
  totalRunners: z.number().int().min(3).max(15), modulus: z.number().int().min(2).max(1000000), divisor: z.number().int().min(2).max(32),
  residues: z.array(boundedInt).min(2).max(14), exceptionIndices: z.array(z.number().int().min(0).max(13)).max(14), lowerPremise: z.literal("NOT_ESTABLISHED") }).strict();
export type CongruenceClass = z.infer<typeof congruenceClassSchema>;
const applicationSchema = congruenceClassSchema.extend({ status: z.enum(["NONPRIMITIVE_CLASS_EXCLUDED", "CONDITIONAL_LOWER_WITNESS", "NOT_APPLICABLE"]), reason: z.string().max(100),
  premises: z.array(z.string().max(100)).max(8), phaseCertificateDigest: hex.nullable() });
export type PropernessApplication = z.infer<typeof applicationSchema>;

type Q = { n: bigint; d: bigint };
function gcd(a: bigint, b: bigint): bigint { a = a < BigInt(0) ? -a : a; while (b) [a,b] = [b,a%b]; return a; }
function fraction(n: bigint, d = BigInt(1)): Q { if (d <= BigInt(0)) throw new Error("Invalid rational"); const g=gcd(n,d); return {n:n/g,d:d/g}; }
function add(a: Q,b: Q): Q { return fraction(a.n*b.d+b.n*a.d,a.d*b.d); }
function cmp(a: Q,b: Q): bigint { return a.n*b.d-b.n*a.d; }
function mod1(a: Q): Q { return fraction((a.n%a.d+a.d)%a.d,a.d); }
function wire(a: Q): PhaseRational { return {numerator:a.n.toString(),denominator:a.d.toString()}; }
function readQ(raw: PhaseRational): Q { const q=fraction(BigInt(raw.numerator),BigInt(raw.denominator)); if (canonicalJson(wire(q))!==canonicalJson(raw)) throw new Error("Noncanonical rational"); return q; }
function same(a: unknown,b: unknown): boolean { return canonicalJson(a)===canonicalJson(b); }
function integerGcd(a: number,b: number) { while(b) [a,b]=[b,a%b]; return a; }
function prime(d: number): boolean { for(let i=2;i*i<=d;i++) if(d%i===0) return false; return d>=2; }
function badShifts(phase: Q,N: number,d: number): number[] {
  const result:number[]=[];
  for(let j=0;j<d;j++) { const r=mod1(add(phase,fraction(BigInt(j),BigInt(d)))); const distance=r.n<r.d-r.n?r.n:r.d-r.n;
    if(BigInt(N)*distance<r.d) result.push(j); }
  return result;
}
function criticalPoints(N: number,d: number): Q[] {
  const unique=new Map<string,Q>();
  for(let j=0;j<d;j++) for(const sign of [-1,1]) {
    const point=mod1(fraction(BigInt(sign*d-N*j),BigInt(N*d))); unique.set(canonicalJson(wire(point)),point);
  }
  return [...unique.values()].sort((a,b)=>Number(cmp(a,b)));
}
export function phaseCertificateDigest(c: Omit<PhaseCertificate,"certificateDigest">|PhaseCertificate): string {
  const {certificateDigest: _,...body}=c as PhaseCertificate; void _; return sha256(canonicalJson(body));
}
/** The critical boundaries are ALL points where a bad-open-arc predicate changes.
 * Each component of their circle complement is connected, with no zero of a
 * predicate inside it; the mask is therefore constant on the whole open cell.
 * Equality is GOOD. A representative verifies exact arithmetic, not sampling
 * as a substitute for the written continuity argument. */
export function buildPhaseCertificate(totalRunners: number,shiftModulus: number): PhaseCertificate {
  z.number().int().min(2).max(15).parse(totalRunners); z.number().int().min(2).max(32).parse(shiftModulus);
  const points=criticalPoints(totalRunners,shiftModulus), cells:PhaseCertificate["cells"]=[];
  for(let i=0;i<points.length;i++) {
    const left=points[i], right=i+1<points.length?points[i+1]:add(points[0],fraction(BigInt(1)));
    cells.push({kind:"BOUNDARY",left:wire(left),right:wire(left),representative:wire(left),badShiftIndices:badShifts(left,totalRunners,shiftModulus)});
    const mid=fraction(left.n*right.d+right.n*left.d,BigInt(2)*left.d*right.d);
    cells.push({kind:"OPEN",left:wire(left),right:wire(right),representative:wire(mod1(mid)),badShiftIndices:badShifts(mid,totalRunners,shiftModulus)});
  }
  const body={totalRunners,shiftModulus,boundaries:points.map(wire),cells,maximumBadShifts:Math.max(...cells.map(c=>c.badShiftIndices.length)),ceilBound:Math.ceil(2*shiftModulus/totalRunners)};
  return {...body,certificateDigest:phaseCertificateDigest(body)};
}
/** Consumer derives the necessary boundary set, exact adjacency, wrap and masks;
 * it does NOT call the producer, and never accepts hash-only geometry. */
export function verifyPhaseCertificate(raw: unknown): PhaseCertificate|null {
  const started=performance.now();
  try {
    if(Buffer.byteLength(JSON.stringify(raw))>PROPERNESS_LIMITS.bytes) return null;
    const c=phaseCertificateSchema.parse(raw), N=c.totalRunners,d=c.shiftModulus;
    const required=new Map<string,Q>();
    for(let j=0;j<d;j++) {
      const denominator=BigInt(N*d);
      for(const numerator of [BigInt(d-N*j),BigInt(-d-N*j)]) {
        const p=fraction((numerator%denominator+denominator)%denominator,denominator); required.set(canonicalJson(wire(p)),p);
      }
    }
    const points=[...required.values()].sort((a,b)=>a.n*b.d<b.n*a.d?-1:a.n*b.d>b.n*a.d?1:0);
    if(!same(points.map(wire),c.boundaries)||c.cells.length!==points.length*2||c.certificateDigest!==phaseCertificateDigest(c)) return null;
    let maximum=0,work=0;
    for(let i=0;i<points.length;i++) {
      const left=points[i],right=i+1<points.length?points[i+1]:fraction(points[0].n+points[0].d,points[0].d);
      for(const offset of [0,1]) {
        const cell=c.cells[2*i+offset],representative=readQ(cell.representative);
        if(cell.kind!==(offset?"OPEN":"BOUNDARY")||!same(cell.left,wire(left))||!same(cell.right,wire(offset?right:left))) return null;
        const mid=fraction(left.n*right.d+right.n*left.d,BigInt(2)*left.d*right.d);
        if(!same(wire(representative),wire(offset?mod1(mid):left))) return null;
        const masks:number[]=[];
        for(let j=0;j<d;j++) {
          if(++work>PROPERNESS_LIMITS.work||performance.now()-started>PROPERNESS_LIMITS.milliseconds) return null;
          const den=representative.d*BigInt(d), numer=(representative.n*BigInt(d)+BigInt(j)*representative.d)%den;
          if(BigInt(N)*(numer<den-numer?numer:den-numer)<den) masks.push(j);
        }
        if(!same(masks,cell.badShiftIndices)) return null; maximum=Math.max(maximum,masks.length);
      }
    }
    const bound=Math.floor((2*d+N-1)/N);
    return c.maximumBadShifts===maximum&&c.ceilBound===bound&&maximum<=bound?c:null;
  } catch { return null; }
}

/** Applicability concerns an ENTIRE integer congruence class. Positive distinct
 * primitive lifts and a lower-case continuous witness remain explicit premises.
 * No shift control is claimed to be an author terminal or a produced witness. */
export function classifyCongruenceClass(raw: CongruenceClass, certificate?: PhaseCertificate): PropernessApplication {
  const c=congruenceClassSchema.parse(raw),exceptions=new Set(c.exceptionIndices);
  const fail=(reason:string):PropernessApplication=>({...c,status:"NOT_APPLICABLE",reason,premises:[],phaseCertificateDigest:null});
  if(c.residues.length!==c.totalRunners-1||c.residues.some(v=>v>=c.modulus)||exceptions.size!==c.exceptionIndices.length||c.exceptionIndices.some(i=>i>=c.residues.length)||c.exceptionIndices.some((v,i)=>i>0&&v<=c.exceptionIndices[i-1])) return fail("CLASS_SHAPE");
  if(c.modulus%c.divisor) return fail("DIVISOR_DOES_NOT_DIVIDE_MODULUS");
  if(c.residues.some((v,i)=>!exceptions.has(i)&&v%c.divisor!==0)) return fail("FIXED_COORDINATE_NOT_DIVISIBLE");
  if(c.mechanism==="NONPRIMITIVE") {
    if(exceptions.size||c.residues.some(v=>v%c.divisor)) return fail("NOT_UNIFORMLY_NONPRIMITIVE");
    return {...c,status:"NONPRIMITIVE_CLASS_EXCLUDED",reason:"EVERY_INTEGER_LIFT_HAS_COMMON_DIVISOR",premises:["ONLY_THIS_INTEGER_CLASS", "NO_FIXED_GRID_WITNESS_CLAIM"],phaseCertificateDigest:null};
  }
  if(c.exceptionIndices.some(i=>integerGcd(c.residues[i],c.divisor)!==1)) return fail("EXCEPTION_NOT_UNIT");
  if(!certificate||!verifyPhaseCertificate(certificate)||certificate.totalRunners!==c.totalRunners||certificate.shiftModulus!==c.divisor) return fail("PHASE_CERTIFICATE_MISSING_OR_MISMATCHED");
  if(c.mechanism==="OMIT_ONE"&&exceptions.size!==1) return fail("OMIT_ONE_REQUIRES_ONE_EXCEPTION");
  if(c.mechanism==="FEW_EXCEPTIONS"&&(c.totalRunners!==15||!prime(c.divisor)||exceptions.size<2)) return fail("FEW_EXCEPTION_DOMAIN");
  if(exceptions.size*certificate.ceilBound>=c.divisor) return fail("STRICT_COMMON_SHIFT_BOUND_FAILED");
  return {...c,status:"CONDITIONAL_LOWER_WITNESS",reason:"A_COMMON_SHIFT_EXISTS_IF_LOWER_WITNESS_EXISTS",
    premises:["POSITIVE_DISTINCT_PRIMITIVE_INTEGER_SPEEDS", "LOWER_LRC_NOT_ESTABLISHED_LOCALLY", "LOWER_CASE_CONTINUOUS_WITNESS_REQUIRED", "COMMON_SHIFT_PRESERVES_FIXED_COORDINATES", "NO_ACTUAL_WITNESS_OR_GLOBAL_TERMINAL_CERTIFIED"],phaseCertificateDigest:certificate.certificateDigest};
}

const fixedVectors=[
  [1792,798,2590,203,602,1001,1400,406,2198,1204,210,2002,1008],
  [1792,798,2590,203,602,1001,1400,1799,2198,1204,210,2002,1008],
  [399,798,1197,1596,1995,2394,7,406,805,1204,1603,2002,2401],
  [399,798,1197,1596,1995,2394,7,406,805,1204,1603,2401,1218],
];
export function retainedPropernessCases(): CongruenceClass[] {
  const classes=fixedVectors.map((residues,i):CongruenceClass=>({id:`tip048-fixed-${i}`,mechanism:"NONPRIMITIVE",totalRunners:14,modulus:2786,divisor:7,residues:[...residues],exceptionIndices:[],lowerPremise:"NOT_ESTABLISHED"}));
  for(const [d,e] of [[3,2],[5,2],[5,3],[5,4]]) classes.push({id:`conditional-control-d${d}-e${e}`,mechanism:"FEW_EXCEPTIONS",totalRunners:15,modulus:d*15,divisor:d,
    residues:Array.from({length:14},(_,i)=>i<e?1+d*i:d*(i-e+1)),exceptionIndices:Array.from({length:e},(_,i)=>i),lowerPremise:"NOT_ESTABLISHED"});
  // Controls are symbolic distinct positive lifts; canonical residues can repeat
  // in a small class modulus, so choose a sufficiently large common modulus.
  for(const c of classes.slice(4)) c.modulus=c.divisor*100;
  classes.push({id:"conditional-control-omit-one-d7",mechanism:"OMIT_ONE",totalRunners:14,modulus:700,divisor:7,
    residues:[1,...Array.from({length:12},(_,i)=>7*(i+1))],exceptionIndices:[0],lowerPremise:"NOT_ESTABLISHED"});
  return classes;
}
export function buildPropernessMechanisms(classes: CongruenceClass[]) {
  if(classes.length>PROPERNESS_LIMITS.cases) throw new Error("Case limit");
  const needed=new Map<string,{N:number;d:number}>();
  for(const c of classes) if(c.mechanism!=="NONPRIMITIVE") needed.set(`${c.totalRunners}:${c.divisor}`,{N:c.totalRunners,d:c.divisor});
  const phaseCertificates=[...needed.values()].sort((a,b)=>a.N-b.N||a.d-b.d).map(c=>buildPhaseCertificate(c.N,c.d));
  const applications=classes.map(c=>classifyCongruenceClass(c,phaseCertificates.find(p=>p.totalRunners===c.totalRunners&&p.shiftModulus===c.divisor)));
  return {phaseCertificates,applications};
}
const scopeBindingSchema=z.object({kind:z.enum(["TIP048_FIXED_CLASSES","FINITE_HOST_SCOPE"]),sourceReportSha256:hex.nullable(),sourceScopeDigest:hex,rootContractDigest:hex.nullable()}).strict();
const mechanismBodySchema=z.object({version:z.literal(1),status:z.literal("CHECKED_CONDITIONAL_MECHANISMS"),globalVerdict:z.literal("NOT_ESTABLISHED"),source:z.object({id:z.literal(PROPERNESS_SOURCE.id),url:z.literal(PROPERNESS_SOURCE.url),sections:z.tuple([z.literal("S2"),z.literal("S4.SS4"),z.literal("S6")])}).strict(),
  scopeBinding:scopeBindingSchema,phaseCertificates:z.array(phaseCertificateSchema).max(32),applications:z.array(applicationSchema).max(32)}).strict();
export type PropernessMechanismBody=z.infer<typeof mechanismBodySchema>;
export function buildRetainedPropernessBody():PropernessMechanismBody {
  return {version:1,status:"CHECKED_CONDITIONAL_MECHANISMS",globalVerdict:"NOT_ESTABLISHED",source:{...PROPERNESS_SOURCE,sections:["S2","S4.SS4","S6"]},scopeBinding:{kind:"TIP048_FIXED_CLASSES",sourceReportSha256:TIP048_REPORT_SHA256,sourceScopeDigest:TIP048_FIXED_SCOPE_DIGEST,rootContractDigest:null},...buildPropernessMechanisms(retainedPropernessCases())};
}
export function hostPropernessCases(raw: LrcFiniteScope):CongruenceClass[] {
  const scope=lrcFiniteScopeSchema.parse(raw); if(scope.totalRunners<3) return [];
  const classes:CongruenceClass[]=[];
  for(let g=2;g<=32;g++) if(scope.modulus%g===0&&scope.axes.every(axis=>axis.every(v=>v%g===axis[0]%g))) {
    // This superclass is modulo g, not modulo the finite time-grid modulus:
    // every value of every axis shares its declared coordinate residue mod g.
    const residues=scope.axes.map(axis=>axis[0]%g),exceptionIndices=residues.flatMap((v,i)=>v%g?[i]:[]);
    const mechanism=exceptionIndices.length===0?"NONPRIMITIVE":exceptionIndices.length===1?"OMIT_ONE":"FEW_EXCEPTIONS";
    classes.push({id:`finite-uniform-d${g}`,mechanism,totalRunners:scope.totalRunners,modulus:g,divisor:g,residues,exceptionIndices,lowerPremise:"NOT_ESTABLISHED"});
  }
  return classes;
}
export function buildHostPropernessBody(scope:LrcFiniteScope,root:string):PropernessMechanismBody {
  hex.parse(root); return {version:1,status:"CHECKED_CONDITIONAL_MECHANISMS",globalVerdict:"NOT_ESTABLISHED",source:{...PROPERNESS_SOURCE,sections:["S2","S4.SS4","S6"]},scopeBinding:{kind:"FINITE_HOST_SCOPE",sourceReportSha256:null,sourceScopeDigest:lrcScopeDigest(scope),rootContractDigest:root},...buildPropernessMechanisms(hostPropernessCases(scope))};
}
export const propernessReportSchema=mechanismBodySchema.extend({generatedAt:z.string().datetime(),receipt:z.object({method:z.literal("LOCAL_UNSIGNED_FRESH_PYTHON_REPLAY"),sourceSha256:hex,stdoutSha256:hex,stdoutBytes:z.number().int().min(1).max(PROPERNESS_LIMITS.bytes),elapsedMs:z.number().int().min(0).max(PROPERNESS_LIMITS.replayMs),externalAttestation:z.literal(false)}).strict(),reportDigest:hex}).strict();
export type PropernessReport=z.infer<typeof propernessReportSchema>;
export function propernessReportDigest(raw:Omit<PropernessReport,"reportDigest">|PropernessReport):string { const {reportDigest:_,...body}=raw as PropernessReport; void _; return sha256(canonicalJson(body)); }
export function propernessReplayBytes(body:PropernessMechanismBody):string { return `${canonicalJson(body)}\n`; }
export function propernessRequest(body:PropernessMechanismBody,finiteScope:LrcFiniteScope|null=null) { return {version:1,scopeBinding:body.scopeBinding,finiteScope,classes:body.applications.map(({status:_,reason:__,premises:___,phaseCertificateDigest:____,...c})=>{void _;void __;void ___;void ____;return c;})}; }
export function validateRetainedPropernessReport(raw:unknown,host?:{scope:LrcFiniteScope;rootContractDigest:string}):PropernessReport|null {
  const started=performance.now();
  try {
    if(Buffer.byteLength(JSON.stringify(raw))>PROPERNESS_LIMITS.bytes) return null;
    const report=propernessReportSchema.parse(raw),{generatedAt:_,receipt,reportDigest:__,...body}=report; void _;void __;
    const expected=host?buildHostPropernessBody(host.scope,host.rootContractDigest):buildRetainedPropernessBody();
    if(!same(body,expected)||report.phaseCertificates.some(c=>!verifyPhaseCertificate(c))||receipt.sourceSha256!==PROPERNESS_PYTHON_SHA256||report.reportDigest!==propernessReportDigest(report)) return null;
    const bytes=propernessReplayBytes(expected);
    return receipt.stdoutSha256===sha256(bytes)&&receipt.stdoutBytes===Buffer.byteLength(bytes)&&performance.now()-started<PROPERNESS_LIMITS.milliseconds?report:null;
  } catch { return null; }
}
/** Identical compact conditional facts for all three roles. No raw cells/code. */
export function compactPropernessFacts(report:PropernessReport) {
  return {reportDigest:report.reportDigest,scopeBinding:report.scopeBinding,status:report.status,globalVerdict:report.globalVerdict,
    phaseCompleteness:"ALL_CRITICAL_BOUNDARIES_AND_OPEN_CELLS_INCLUDING_WRAP",phaseBounds:report.phaseCertificates.map(c=>({N:c.totalRunners,d:c.shiftModulus,maximumBadShifts:c.maximumBadShifts,ceilBound:c.ceilBound,certificateDigest:c.certificateDigest})),
    applications:report.applications.map(c=>({id:c.id,mechanism:c.mechanism,status:c.status,reason:c.reason,premises:c.premises,lowerPremise:c.lowerPremise})),
    independent:{method:report.receipt.method,sourceSha256:report.receipt.sourceSha256,stdoutSha256:report.receipt.stdoutSha256,externalAttestation:false},
    limitation:"Conditional shift arithmetic is not an actual witness, full author-domain reproduction, unrestricted theorem, or formal proof."};
}
