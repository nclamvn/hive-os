import { createHash } from "node:crypto";
import { performance } from "node:perf_hooks";

/** Inert import. Only the preregistered eleven parent blockers are discoverable. */
export const COMPOSITE_SHIFT_INPUTS=Object.freeze({
  blockers:Object.freeze([
    ["r0",200023321,31,531977,1],["r1",200023321,71,61,1],["r2",200023321,79,1000117,1],
    ["r3",200602081,23,8358421,1],["r4",200602081,43,850009,1],["r5",200602081,67,1409,1],
    ["r6",200602081,83,82349,1],["r7",200656681,43,22709,1],["r10",131433121,11,2393,1],
    ["r11",131433121,19,6571657,1],["r13",200656681,2027,68813,1]
  ].map(([recordId,p,parentH,q,valuation])=>Object.freeze({recordId:String(recordId),p:String(p),parentH:String(parentH),q:String(q),valuation:String(valuation)}))),
  sourceContentDigest:"952de09e31ded70c7f9f498a6ca9933ba3ca70c404f194712b491dbf00eb9bc4",multiplier:"3"
});
export const COMPOSITE_SHIFT_LIMITS=Object.freeze({seconds:60,maxRows:11,maxStateInsertions:2000000,maxWorkSteps:50000000,maxOutputBytes:2097152});
export const COMPOSITE_SHIFT_SCOPE="FIXED_ELEVEN_TIP038_BLOCKERS_C_EQ_3Q_ONLY_NO_ROOT_OR_UNIVERSAL_EXCLUSION";
const B=BigInt,one=B(1),four=B(4);
export type CompositeFactors=Array<[string,string]>;
export type CompositeTerm={residue:number;exponent:number};
export type CompositePair={u:string;v:string;k:string};
export type CompositeCanonical=CompositePair&{A:string;x:string;y:string;z:string};
export type CompositeDefect={groupOrder:string;stabilizer:string[];size:string;index:string;visibleMass:string;
  visibleFactors:Array<{prime:string;exponent:string;residue:string;quotientOrder:string}>;involutionIntersection:string[];
  conditions:{targetCosetOrderTwo:boolean;indexEven:boolean;visibleMassBound:boolean;ordersBeyondIntervals:boolean}};
export type CompositeProjection={modulus:string;image:string[];count:string;hit:boolean;canonicalPair:CompositePair|null};
export type CompositeClassification="HIT"|"LOCAL_3_OBSTRUCTION"|"LOCAL_Q_OBSTRUCTION"|"LOCAL_BOTH_OBSTRUCTION"|"CRT_SYNCHRONIZATION_OBSTRUCTION";
export type CompositeRow={id:string;provenance:{recordId:string;p:string;parentH:string;q:string;valuation:string;parentT:string;parentFactors:CompositeFactors;sourceResidue:string;legendre:"-1"};
  p:string;q:string;c:string;T:string;factors:CompositeFactors;image:string[];count:string;jacobi:"-1";hit:boolean;canonical:CompositeCanonical|null;
  crt:{mod3:CompositeProjection;modQ:CompositeProjection;productCount:string};classification:CompositeClassification;
  involutions:Array<{residue:string;mod3:string;modQ:string}>;defect:CompositeDefect|null;imageDigest:string;crtDigest:string;defectDigest:string|null;witnessDigest:string|null;rowDigest:string};
export function compositeCanonicalJson(value:unknown):string{
  if(Array.isArray(value))return `[${value.map(compositeCanonicalJson).join(",")}]`;
  if(value!==null&&typeof value==="object")return `{${Object.entries(value).sort(([a],[b])=>a<b?-1:a>b?1:0).map(([k,v])=>`${JSON.stringify(k)}:${compositeCanonicalJson(v)}`).join(",")}}`;
  return JSON.stringify(value);
}
export const compositeDigest=(value:unknown)=>createHash("sha256").update(compositeCanonicalJson(value)).digest("hex");
const gcd = (a: bigint, b: bigint): bigint => { while (b) [a, b] = [b, a % b]; return a; };
const cmp = (a: bigint, b: bigint) => a < b ? -1 : a > b ? 1 : 0;
function bounded(n: unknown, max: number): n is number { return typeof n === "number" && Number.isSafeInteger(n) && n >= 1 && n <= max; }
function prime(n: number, tick: () => void = () => {}) {
  if (!bounded(n, 201_000_000) || n < 2) return false;
  if (n % 2 === 0) return n === 2;
  for (let d = 3; d * d <= n; d += 2) { if (d % 255 === 0) tick(); if (n % d === 0) return false; }
  return true;
}
function groupComposite(c:number) { const q=c/3; if(!bounded(c,201_000_000)||!Number.isInteger(q)||!prime(q)||q%4!==1||q===3)throw new RangeError("Requires bounded c=3q, prime q=1 mod4"); }
function mul(a: number, b: number, h: number, run?: Budget) { run?.work(); return Number(B(a) * B(b) % B(h)); }
function pow(a: number, e: number, h: number, run?: Budget) { let r = 1; for (; e; e = Math.floor(e / 2), a = mul(a, a, h, run)) if (e % 2) r = mul(r, a, h, run); return r; }
type StopReason = "TIME_LIMIT" | "ROW_LIMIT" | "STATE_LIMIT" | "WORK_LIMIT" | "OUTPUT_LIMIT";
class RunStop extends Error { constructor(readonly reason: StopReason) { super(reason); } }
export type CompositeRunOptions = { now?: () => number; seconds?: number; maxRows?: number; maxStateInsertions?: number; maxWorkSteps?: number; maxOutputBytes?: number };
function budget(options: CompositeRunOptions = {}) {
  const { now = () => performance.now(), ...lowered } = options, limits = { ...COMPOSITE_SHIFT_LIMITS, ...lowered };
  for (const key of Object.keys(COMPOSITE_SHIFT_LIMITS) as Array<keyof typeof COMPOSITE_SHIFT_LIMITS>) {
    if (!Number.isFinite(limits[key]) || limits[key] <= 0 || limits[key] > COMPOSITE_SHIFT_LIMITS[key] || (key !== "seconds" && !Number.isSafeInteger(limits[key]))) throw new RangeError("Only tighter frozen resource caps");
  }
  if (limits.maxOutputBytes < 8192) throw new RangeError("Output cap must fit bounded partial provenance");
  const start = now(); let states = 0, steps = 0;
  const tick = () => { if (now() - start >= limits.seconds * 1000) throw new RunStop("TIME_LIMIT"); };
  const insert = () => { tick(); if (states >= limits.maxStateInsertions) throw new RunStop("STATE_LIMIT"); states++; };
  const work = () => { tick(); if (steps >= limits.maxWorkSteps) throw new RunStop("WORK_LIMIT"); steps++; };
  return { limits, tick, insert, work, stateCount: () => states, workCount: () => steps, elapsed: () => Math.max(0, Math.round(now() - start)) };
}
type Budget = ReturnType<typeof budget>;
export function validateCompositeFactors(raw: unknown, expected: bigint): asserts raw is CompositeFactors {
  if (!Array.isArray(raw) || raw.length > 16 || typeof expected !== "bigint" || expected < one || expected > B(100_500_000)) throw new RangeError("Bounded exact factor packet");
  let product = one, previous = 1;
  for (const entry of raw) {
    if (!Array.isArray(entry) || entry.length !== 2 || !entry.every((v) => typeof v === "string" && /^[1-9][0-9]{0,8}$/.test(v))) throw new RangeError("Decimal factor records");
    const [q, e] = entry.map(Number);
    if (!prime(q) || q <= previous || !bounded(e, 26)) throw new RangeError("Distinct sorted primes and bounded valuations");
    previous = q; product *= B(q) ** B(e); if (product > expected) throw new RangeError("Factor product exceeds target");
  }
  if (product !== expected) throw new RangeError("Factor product mismatch");
}
function factor(n: number, run: Budget): CompositeFactors {
  if (!bounded(n, 100_500_000)) throw new RangeError("Frozen factor domain");
  let left = n; const factors: CompositeFactors = [];
  for (let q = 2; q * q <= left; q += q === 2 ? 1 : 2) {
    run.work(); if (left % q) continue;
    let e = 0; while (left % q === 0) { left /= q; e++; } factors.push([String(q), String(e)]);
  }
  if (left > 1) factors.push([String(left), "1"]); validateCompositeFactors(factors, B(n)); return factors;
}
function validateTerms(h: number, terms: readonly CompositeTerm[]) {
  groupComposite(h);
  if (!Array.isArray(terms) || terms.length > 32 || terms.some((t) => !bounded(t.residue, h - 1) || !bounded(t.exponent, 64) || gcd(B(t.residue),B(h))!==one)) throw new RangeError("Bounded nonzero residue/valuation terms");
}
function imageTerms(h: number, terms: readonly CompositeTerm[], run: Budget) {
  validateTerms(h, terms); let states = new Set([1]); run.insert();
  for (const { residue: r, exponent: e } of terms) {
    const choices = Array.from({ length: 2 * e + 1 }, (_, i) => pow(i < e ? pow(r, 2*(h/3-1) - 1, h, run) : r, Math.abs(i - e), h, run)), next = new Set<number>();
    for (const s of states) for (const c of choices) { run.tick(); const value = mul(s, c, h, run); if (!next.has(value)) { run.insert(); next.add(value); } }
    states = next;
  }
  return [...states].sort((a, b) => a - b);
}
export function compositeSignedImage(h: number, terms: readonly CompositeTerm[]) { return imageTerms(h, terms, budget()); }
function quotientOrder(residue: number, h: number, subgroup: ReadonlySet<number>, divisors: readonly number[], run: Budget) {
  let order = 2*(h/3-1);
  for (const q of divisors) while (order % q === 0 && subgroup.has(pow(residue, order / q, h, run))) order /= q;
  return order;
}
function distinctPrimeDivisors(n: number, run: Budget) { const result: number[] = []; let left = n;
  for (let q = 2; q * q <= left; q += q === 2 ? 1 : 2) { run.work(); if (left % q) continue; result.push(q); while (left % q === 0) left /= q; }
  if (left > 1) result.push(left); return result;
}
function involutions(c:number){const q=c/3,result:Array<{residue:string;mod3:string;modQ:string}>=[],inverse=q%3===1?1:2;
  for(const a of [1,2])for(const b of [1,q-1]){const d=((a-b%3+3)%3*inverse)%3;result.push({residue:String(B(b)+B(q)*B(d)),mod3:String(a),modQ:String(b)});}
  return result.sort((a,b)=>Number(a.residue)-Number(b.residue));}
function defect(h:number,terms:readonly CompositeTerm[],image:readonly number[],primes:readonly string[],run:Budget):CompositeDefect|null{
  if(image.includes(h-1))return null;
  const set=new Set(image),H:number[]=[];
  for(const r of image){run.work();if(image.every(s=>set.has(mul(s,r,h,run))))H.push(r);}
  const groupOrder=2*(h/3-1),index=groupOrder/H.length,subgroup=new Set(H),divisors=distinctPrimeDivisors(groupOrder,run);
  const visibleFactors=terms.flatMap(({residue,exponent},i)=>subgroup.has(residue)?[]:[{prime:primes[i],exponent:String(exponent),residue:String(residue),quotientOrder:String(quotientOrder(residue,h,subgroup,divisors,run))}]);
  const V=visibleFactors.reduce((sum,f)=>sum+Number(f.exponent),0),inv=involutions(h);
  return {groupOrder:String(groupOrder),stabilizer:H.map(String),size:String(H.length),index:String(index),visibleMass:String(V),visibleFactors,involutionIntersection:inv.filter(v=>subgroup.has(Number(v.residue))).map(v=>v.residue),
    conditions:{targetCosetOrderTwo:!subgroup.has(h-1)&&subgroup.has(mul(h-1,h-1,h,run)),indexEven:index%2===0,visibleMassBound:2*V<=index-2,ordersBeyondIntervals:visibleFactors.every(f=>Number(f.quotientOrder)>2*Number(f.exponent)+1)}};
}
/** Abstract group helper: validates the supplied complete image, not just a subgroup. */
export function compositeGroupDefect(h: number, terms: readonly CompositeTerm[], image?: readonly number[]) {
  const run = budget(), expected = imageTerms(h, terms, run);
  if (image && (!Array.isArray(image) || image.length > h - 1 || compositeCanonicalJson(image) !== compositeCanonicalJson(expected))) throw new RangeError("Exact complete signed image binding");
  return defect(h, terms, expected, terms.map((t) => String(t.residue)), run);
}
/** Ordered numeric-lex DP: never sort an intermediate pair and invert its ratio. */
function factorImage(h: number, factors: CompositeFactors, run: Budget) {
  let states = new Map<number, { u: bigint; v: bigint }>([[1, { u: one, v: one }]]); run.insert();
  for (const [qText, eText] of factors) {
    const q = B(qText), r = Number(q % B(h)), e = Number(eText), next = new Map<number, { u: bigint; v: bigint }>();
    if (!r) throw new RangeError("Factored integer not coprime to shift");
    const choices = Array.from({ length: 2 * e + 1 }, (_, i) => { const z = i - e, power = q ** B(Math.abs(z));
      return { residue: pow(z < 0 ? pow(r, 2*(h/3-1) - 1, h, run) : r, Math.abs(z), h, run), u: z > 0 ? power : one, v: z < 0 ? power : one }; });
    for (const [residue, pair] of states) for (const choice of choices) {
      run.tick(); const target = mul(residue, choice.residue, h, run), candidate = { u: pair.u * choice.u, v: pair.v * choice.v }, previous = next.get(target);
      if (!previous) { run.insert(); next.set(target, candidate); }
      else if (candidate.u < previous.u || candidate.u === previous.u && candidate.v < previous.v) next.set(target, candidate);
    }
    states = next;
  }
  return { image: [...states.keys()].sort((a, b) => a - b), states, pair: states.get(h - 1) ?? null };
}

function pairProjection(modulus:number,T:number,states:Map<number,{u:bigint;v:bigint}>):CompositeProjection{
  const image=[...new Set([...states.keys()].map(r=>r%modulus))].sort((a,b)=>a-b);
  let pair:{u:bigint;v:bigint}|null=null;
  for(const [r,entry] of states)if(r%modulus===modulus-1&&(!pair||entry.u<pair.u||entry.u===pair.u&&entry.v<pair.v))pair=entry;
  if(pair&&(pair.u>pair.v||gcd(pair.u,pair.v)!==one||B(T)%(pair.u*pair.v)))throw new Error("Projected numeric-lex partition integrity");
  return {modulus:String(modulus),image:image.map(String),count:String(image.length),hit:pair!==null,canonicalPair:pair?{u:String(pair.u),v:String(pair.v),k:String(B(T)/(pair.u*pair.v))}:null};
}
export function classifyCompositeImage(hit:boolean,local3:boolean,localQ:boolean):CompositeClassification{
  if(hit){if(!local3||!localQ)throw new RangeError("Joint hit requires both projections");return "HIT";}
  return local3?(localQ?"CRT_SYNCHRONIZATION_OBSTRUCTION":"LOCAL_Q_OBSTRUCTION"):(localQ?"LOCAL_3_OBSTRUCTION":"LOCAL_BOTH_OBSTRUCTION");
}
export function reconstructCompositeWitness(p:bigint,c:bigint,T:bigint,u:bigint,v:bigint):CompositeCanonical{
  if(![p,c,T,u,v].every(n=>typeof n==="bigint"&&n> B(0)&&n.toString().length<=10)||p>B(201000000)||!prime(Number(p))||p%B(840)!==one||p<=c||
    !COMPOSITE_SHIFT_INPUTS.blockers.some(s=>s.p===String(p)&&B(s.q)*B(3)===c)||four*T!==p+c||gcd(T,c)!==one||u>v||gcd(u,v)!==one||T%(u*v)||(u+v)%c)throw new RangeError("Exact registered composite Type-II binding");
  const A=(u+v)/c,k=T/(u*v),ds=[T,A*p*u*k,A*p*v*k].sort(cmp);
  if(!(ds[0]<ds[1]&&ds[1]<ds[2])||ds.filter(d=>d%p===B(0)).length!==2||four*ds[0]*ds[1]*ds[2]!==p*(ds[0]*ds[1]+ds[1]*ds[2]+ds[2]*ds[0]))throw new Error("Strict Type-II identity failure");
  return {u:String(u),v:String(v),k:String(k),A:String(A),x:String(ds[0]),y:String(ds[1]),z:String(ds[2])};
}
export class CompositeCandidateContradictionError extends Error{
  readonly row:CompositeRow;
  constructor(row:CompositeRow){super("Generic signed-box candidate disagrees with exact row");
    if(Buffer.byteLength(JSON.stringify(row),"utf8")>65536)throw new RangeError("Bounded contradiction diagnostic");this.row=structuredClone(row);}
}
export function assertCompositeCandidate(row:CompositeRow){
  if(row.jacobi!=="-1"||row.hit&&row.defect!==null||!row.hit&&(!row.defect||Object.values(row.defect.conditions).some(v=>!v)))throw new CompositeCandidateContradictionError(row);
}
function row(input:typeof COMPOSITE_SHIFT_INPUTS.blockers[number],run:Budget):CompositeRow{
  const p=Number(input.p),h=Number(input.parentH),q=Number(input.q),c=3*q,parentT=(p+h)/4;
  if(!prime(p,run.tick)||p%840!==1||!prime(h,run.tick)||h%4!==3||h>=p||!prime(q,run.tick)||q%4!==1||c>=p||(p+h)%4||(p+c)%4)throw new RangeError("Registered parent/composite domain");
  const parentFactors=factor(parentT,run),entry=parentFactors.find(([r])=>r===input.q),sourceResidue=Number(B(q)%B(h));
  if(!entry||entry[1]!==input.valuation||pow(sourceResidue,(h-1)/2,h,run)!==h-1)throw new RangeError("Original factor blocker binding");
  const T=(p+c)/4;if(gcd(B(T),B(c))!==one)throw new RangeError("Composite coprime domain");
  const factors=factor(T,run),result=factorImage(c,factors,run),terms=factors.map(([r,e])=>({residue:Number(B(r)%B(c)),exponent:Number(e)}));
  const canonical=result.pair?reconstructCompositeWitness(B(p),B(c),B(T),result.pair.u,result.pair.v):null;
  const mod3=pairProjection(3,T,result.states),modQ=pairProjection(q,T,result.states),crt={mod3,modQ,productCount:String(mod3.image.length*modQ.image.length)};
  const certificate=defect(c,terms,result.image,factors.map(([r])=>r),run),image=result.image.map(String);
  // Registered branch character follows reciprocity; it is not a general hit filter.
  const character3=pow(T%3,1,3,run)===1?1:-1,characterQ=pow(T%q,(q-1)/2,q,run)===1?1:-1;
  if(character3*characterQ!==-1)throw new Error("Registered Jacobi provenance mismatch");
  const body={id:input.recordId,provenance:{...input,parentT:String(parentT),parentFactors,sourceResidue:String(sourceResidue),legendre:"-1" as const},
    p:input.p,q:input.q,c:String(c),T:String(T),factors,image,count:String(image.length),jacobi:"-1" as const,hit:canonical!==null,canonical,crt,
    classification:classifyCompositeImage(canonical!==null,mod3.hit,modQ.hit),involutions:involutions(c),defect:certificate,
    imageDigest:compositeDigest(image),crtDigest:compositeDigest(crt),defectDigest:certificate?compositeDigest(certificate):null,witnessDigest:canonical?compositeDigest(canonical):null};
  const retained={...body,rowDigest:compositeDigest(body)};assertCompositeCandidate(retained);return retained;
}
function summarize(rows:readonly CompositeRow[],complete:boolean){
  const classificationCounts={HIT:"0",LOCAL_3_OBSTRUCTION:"0",LOCAL_Q_OBSTRUCTION:"0",LOCAL_BOTH_OBSTRUCTION:"0",CRT_SYNCHRONIZATION_OBSTRUCTION:"0"};
  for(const r of rows)classificationCounts[r.classification]=String(Number(classificationCounts[r.classification])+1);
  const first=rows.find(r=>!r.hit);
  return {complete,classificationCounts,C4:{status:first?"REFUTED" as const:"NO_REFUTATION_IN_COMPUTED_ROWS" as const,
    firstRefutation:first?{rowId:first.id,classification:first.classification,rowDigest:first.rowDigest}:null}};
}
export type CompositePending={phase:"ROW"|"FINALIZE";recordId?:string};
export function compositeShiftPacket(options:CompositeRunOptions={}){
  const run=budget(options),rows:CompositeRow[]=[];let pending:CompositePending|null={phase:"ROW",recordId:COMPOSITE_SHIFT_INPUTS.blockers[0].recordId},reason:StopReason|null=null,retainedBytes=0;
  try{for(const input of COMPOSITE_SHIFT_INPUTS.blockers){pending={phase:"ROW",recordId:input.recordId};run.tick();if(rows.length>=run.limits.maxRows)throw new RunStop("ROW_LIMIT");
    const next=row(input,run),bytes=Buffer.byteLength(compositeCanonicalJson(next),"utf8");if(retainedBytes+bytes+8192>run.limits.maxOutputBytes)throw new RunStop("OUTPUT_LIMIT");
    rows.push(next);retainedBytes+=bytes;}
    pending={phase:"FINALIZE"};run.tick();pending=null;
  }catch(error){if(!(error instanceof RunStop))throw error;reason=error.reason;}
  const invariant={inputs:COMPOSITE_SHIFT_INPUTS,rows,rowsDigest:compositeDigest(rows),summary:summarize(rows,reason===null)};
  const body={method:"ERDOS_STRAUS_COMPOSITE_SHIFT_CRT_V1" as const,status:reason?"PARTIAL" as const:"COMPLETE" as const,...invariant,limits:run.limits,pending,reason,scope:COMPOSITE_SHIFT_SCOPE,
    contentDigest:compositeDigest(invariant),runtime:{stateInsertions:String(run.stateCount()),workSteps:String(run.workCount()),elapsedMs:String(run.elapsed()),outputBytes:"0"}};
  const seal=()=>{let sealed={...body,packetDigest:compositeDigest(body)};for(let i=0;i<8;i++){const bytes=String(Buffer.byteLength(JSON.stringify(sealed),"utf8"));if(bytes===body.runtime.outputBytes)break;body.runtime.outputBytes=bytes;sealed={...body,packetDigest:compositeDigest(body)};}return sealed;};
  let packet=seal();body.runtime.elapsedMs=String(run.elapsed());packet=seal();
  try{if(body.status==="COMPLETE")run.tick();}catch(error){if(!(error instanceof RunStop))throw error;body.status="PARTIAL";body.reason=error.reason;body.pending={phase:"FINALIZE"};body.summary=summarize(rows,false);
    body.contentDigest=compositeDigest({...invariant,summary:body.summary});body.runtime.elapsedMs=String(run.elapsed());packet=seal();}
  if(Number(packet.runtime.outputBytes)>run.limits.maxOutputBytes)throw new Error("No oversized diagnostic emitted");return packet;
}
export type CompositeShiftPacket=ReturnType<typeof compositeShiftPacket>;
/** Fixed CLI serialization checkpoint; never restarts or expands discovery. */
export function finalizeCompositeForOutput(packet:CompositeShiftPacket,observedMs:number):CompositeShiftPacket{
  if(!Number.isFinite(observedMs)||observedMs<0)throw new RangeError("Monotonic output checkpoint");
  const {packetDigest,...original}=packet;void packetDigest;
  const body={...original,runtime:{...original.runtime,elapsedMs:String(Math.round(observedMs))}};
  if(body.status==="COMPLETE"&&observedMs>=body.limits.seconds*1000){body.status="PARTIAL";body.reason="TIME_LIMIT";body.pending={phase:"FINALIZE"};body.summary=summarize(body.rows,false);
    body.contentDigest=compositeDigest({inputs:body.inputs,rows:body.rows,rowsDigest:body.rowsDigest,summary:body.summary});}
  let sealed={...body,packetDigest:compositeDigest(body)};for(let i=0;i<8;i++){const bytes=String(Buffer.byteLength(JSON.stringify(sealed),"utf8"));if(bytes===body.runtime.outputBytes)break;body.runtime.outputBytes=bytes;sealed={...body,packetDigest:compositeDigest(body)};}
  if(Number(sealed.runtime.outputBytes)>body.limits.maxOutputBytes)throw new RangeError("Bounded CLI output");return sealed;
}

