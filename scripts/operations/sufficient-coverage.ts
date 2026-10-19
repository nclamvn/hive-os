import { createHash } from "node:crypto";
import { performance } from "node:perf_hooks";

/** Fixed exposed calibration rows. Import is inert; no ground-truth image input. */
const targets=["200023321","200602081","200656681","131433121"],shifts=["3","7","11","19","23","31","43","47","59","67","71","79","83","103","107"];
const compositeRows=[["r0","200023321","1595931"],["r1","200023321","183"],["r2","200023321","3000351"],["r3","200602081","25075263"],["r4","200602081","2550027"],["r5","200602081","4227"],["r6","200602081","247047"],["r7","200656681","68127"],["r10","131433121","7179"],["r11","131433121","19714971"],["r13","200656681","206439"]];
export const SUFFICIENT_COVERAGE_INPUTS=Object.freeze({
  rows:Object.freeze([...targets.flatMap((p,i)=>shifts.map(m=>Object.freeze({id:`P${i}_h${m}`,p,m,source:"TIP037" as const,sourceRowId:`${p}:${m}`}))),
    ...compositeRows.map(([sourceRowId,p,m])=>Object.freeze({id:`C_${sourceRowId}`,p,m,source:"TIP039" as const,sourceRowId}))]),
  sourceContentDigests:Object.freeze({TIP037:"a6e29476a065de13e0de34d64458579b96e74ec9da35196e74eac1275f4e767c",TIP039:"ff01bdbd52abbb55e98ab912b2c201968cecb210a5fd6449725dd8804731831e"}),
  policy:"ASCENDING_SINGLE_FACTOR_CHAIN_THEN_UNORDERED_SUPPORT_ENERGY_V1"
});
export const SUFFICIENT_COVERAGE_LIMITS=Object.freeze({seconds:60,maxRows:71,maxStateInsertions:2000000,maxWorkSteps:50000000,maxOutputBytes:2097152});
export const SUFFICIENT_COVERAGE_SCOPE="FIXED_71_EXPOSED_ROWS_SUFFICIENT_ONLY_NOT_ROOT_EXCLUSION_OR_MINIMUM";
const B=BigInt,one=B(1),four=B(4);
export type CoverageFactors=Array<[string,string]>;
export type CoverageEntry={residue:string;exponents:string[]};
export type CoverageStage={factorIndex:string;prime:string;exponent:string;relativeOrder:string;previousCoveredDigest:string;covered:CoverageEntry[];stageDigest:string};
export type CoverageChain={stages:CoverageStage[];consumed:string[];unused:string[];covered:CoverageEntry[]};
export type CoverageFrequency={coset:string;mu:string;u:string;v:string;residue:string;exponents:string[]};
export type CoverageHalf={factorIndices:string[];N:string;E:string;L:string;frequencies:CoverageFrequency[]};
export type CoverageAttempt={mask:string;A:CoverageHalf;B:CoverageHalf;quotientOrder:string;sufficient:boolean;attemptDigest:string};
export type CoverageWitness={u:string;v:string;k:string;A:string;x:string;y:string;z:string};
type Orientation="AS_CONSTRUCTED"|"INVERTED";
type CoreCertificate=({kind:"CHAIN"}|{kind:"ENERGY";partitionMask:string;match:{cosetA:string;cosetB:string;exponentsA:string[];exponentsB:string[];liftResidue:string;liftExponents:string[]}})&{exponents:string[];orientation:Orientation};
export type CoverageCertificate=CoreCertificate&{witness:CoverageWitness};
export type CoverageRow={id:string;p:string;m:string;T:string;groupOrder:string;factors:CoverageFactors;chain:CoverageChain;attempts:CoverageAttempt[];
  allocation:{totalPartitions:string;evaluatedPartitions:string;notEvaluatedPartitions:string};status:"CHAIN_CERTIFIED"|"ENERGY_CERTIFIED"|"NOT_CERTIFIED";certificate:CoverageCertificate|null;rowDigest:string};
export function coverageCanonicalJson(value:unknown):string{
  if(Array.isArray(value))return `[${value.map(coverageCanonicalJson).join(",")}]`;
  if(value!==null&&typeof value==="object")return `{${Object.entries(value).sort(([a],[b])=>a<b?-1:a>b?1:0).map(([k,v])=>`${JSON.stringify(k)}:${coverageCanonicalJson(v)}`).join(",")}}`;
  return JSON.stringify(value);
}
export const coverageDigest=(value:unknown)=>createHash("sha256").update(coverageCanonicalJson(value)).digest("hex");
const gcd = (a: bigint, b: bigint): bigint => { while (b) [a, b] = [b, a % b]; return a; };
const cmp = (a: bigint, b: bigint) => a < b ? -1 : a > b ? 1 : 0;
function bounded(n: unknown, max: number): n is number { return typeof n === "number" && Number.isSafeInteger(n) && n >= 1 && n <= max; }
function prime(n: number, tick: () => void = () => {}) {
  if (!bounded(n, 201_000_000) || n < 2) return false;
  if (n % 2 === 0) return n === 2;
  for (let d = 3; d * d <= n; d += 2) { if (d % 255 === 0) tick(); if (n % d === 0) return false; }
  return true;
}
function groupOrder(m:number){if(!bounded(m,201000000)||m<3)throw new RangeError("Bounded odd unit modulus");if(prime(m))return m-1;const q=m/3;if(!Number.isInteger(q)||!prime(q)||q===3)throw new RangeError("Prime or squarefree 3q modulus");return 2*(q-1);}
function mul(a: number, b: number, h: number, run?: Budget) { run?.work(); return Number(B(a) * B(b) % B(h)); }
function pow(a: number, e: number, h: number, run?: Budget) { let r = 1; for (; e; e = Math.floor(e / 2), a = mul(a, a, h, run)) if (e % 2) r = mul(r, a, h, run); return r; }
type StopReason = "TIME_LIMIT" | "ROW_LIMIT" | "STATE_LIMIT" | "WORK_LIMIT" | "OUTPUT_LIMIT";
class RunStop extends Error { constructor(readonly reason: StopReason) { super(reason); } }
export type CoverageRunOptions = { now?: () => number; seconds?: number; maxRows?: number; maxStateInsertions?: number; maxWorkSteps?: number; maxOutputBytes?: number };
function budget(options: CoverageRunOptions = {}) {
  const { now = () => performance.now(), ...lowered } = options, limits = { ...SUFFICIENT_COVERAGE_LIMITS, ...lowered };
  for (const key of Object.keys(SUFFICIENT_COVERAGE_LIMITS) as Array<keyof typeof SUFFICIENT_COVERAGE_LIMITS>) {
    if (!Number.isFinite(limits[key]) || limits[key] <= 0 || limits[key] > SUFFICIENT_COVERAGE_LIMITS[key] || (key !== "seconds" && !Number.isSafeInteger(limits[key]))) throw new RangeError("Only tighter frozen resource caps");
  }
  if (limits.maxOutputBytes < 16384) throw new RangeError("Output cap must fit all frozen input provenance");
  const start = now(); let states = 0, steps = 0;
  const tick = () => { if (now() - start >= limits.seconds * 1000) throw new RunStop("TIME_LIMIT"); };
  const insert = () => { tick(); if (states >= limits.maxStateInsertions) throw new RunStop("STATE_LIMIT"); states++; };
  const work = () => { tick(); if (steps >= limits.maxWorkSteps) throw new RunStop("WORK_LIMIT"); steps++; };
  return { limits, tick, insert, work, stateCount: () => states, workCount: () => steps, elapsed: () => Math.max(0, Math.round(now() - start)) };
}
type Budget = ReturnType<typeof budget>;
export function validateCoverageFactors(raw: unknown, expected: bigint): asserts raw is CoverageFactors {
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
function factor(n: number, run: Budget): CoverageFactors {
  if (!bounded(n, 100_500_000)) throw new RangeError("Frozen factor domain");
  let left = n; const factors: CoverageFactors = [];
  for (let q = 2; q * q <= left; q += q === 2 ? 1 : 2) {
    run.work(); if (left % q) continue;
    let e = 0; while (left % q === 0) { left /= q; e++; } factors.push([String(q), String(e)]);
  }
  if (left > 1) factors.push([String(left), "1"]); validateCoverageFactors(factors, B(n)); return factors;
}

function divisors(n:number,run:Budget){const qs:number[]=[];let left=n;for(let q=2;q*q<=left;q+=q===2?1:2){run.work();if(left%q)continue;qs.push(q);while(left%q===0)left/=q;}if(left>1)qs.push(left);return qs;}
function relativeOrder(r:number,m:number,M:number,K:ReadonlySet<number>,qs:readonly number[],run:Budget){let d=M;for(const q of qs)while(d%q===0&&K.has(pow(r,d/q,m,run)))d/=q;return d;}
function vectorPair(factors:CoverageFactors,vector:readonly string[]){
  if(vector.length!==factors.length)throw new RangeError("Full factor coordinates");
  let u=one,v=one;for(let i=0;i<vector.length;i++){if(!/^-?(0|[1-9][0-9]*)$/.test(vector[i]))throw new RangeError("Integer signed coordinates");
    const z=Number(vector[i]);if(!Number.isSafeInteger(z)||Math.abs(z)>Number(factors[i][1]))throw new RangeError("Actual valuation budget");
    if(z>0)u*=B(factors[i][0])**B(z);if(z<0)v*=B(factors[i][0])**B(-z);}
  return {u,v};
}
function vectorResidue(factors:CoverageFactors,vector:readonly string[],m:number,M:number,run:Budget){const {u,v}=vectorPair(factors,vector);return mul(Number(u%B(m)),pow(Number(v%B(m)),M-1,m,run),m,run);}
function coset(r:number,m:number,K:readonly CoverageEntry[],run:Budget){let c=m;for(const k of K)c=Math.min(c,mul(r,Number(k.residue),m,run));return c;}
function half(indices:readonly number[],factors:CoverageFactors,m:number,M:number,K:readonly CoverageEntry[],run:Budget):CoverageHalf{
  type State={mu:bigint;u:bigint;v:bigint;residue:number;exponents:string[]};
  let states=new Map<number,State>([[1,{mu:one,u:one,v:one,residue:1,exponents:factors.map(()=>"0")}]]);run.insert();
  for(const i of indices){const q=B(factors[i][0]),e=Number(factors[i][1]),r=Number(q%B(m)),inverse=pow(r,M-1,m,run),next=new Map<number,State>();
    for(const [s,entry] of [...states.entries()].sort(([a],[b])=>a-b))for(let z=-e;z<=e;z++){const power=q**B(Math.abs(z)),choice=pow(z<0?inverse:r,Math.abs(z),m,run),target=coset(mul(s,choice,m,run),m,K,run);
      const candidate={mu:entry.mu,u:entry.u*(z>0?power:one),v:entry.v*(z<0?power:one),residue:mul(entry.residue,choice,m,run),exponents:entry.exponents.map((a,j)=>j===i?String(z):a)},old=next.get(target);
      if(!old){run.insert();next.set(target,candidate);}
      else {const mu=old.mu+entry.mu;if(candidate.u<old.u||candidate.u===old.u&&candidate.v<old.v)next.set(target,{...candidate,mu});else old.mu=mu;}}
    states=next;
  }
  const N=[...states.values()].reduce((sum,e)=>sum+e.mu,B(0)),E=[...states.values()].reduce((sum,e)=>sum+e.mu*e.mu,B(0)),L=(N*N+E-one)/E;
  const frequencies=[...states.entries()].sort(([a],[b])=>a-b).map(([c,e])=>({coset:String(c),mu:String(e.mu),u:String(e.u),v:String(e.v),residue:String(e.residue),exponents:e.exponents}));
  return {factorIndices:indices.map(String),N:String(N),E:String(E),L:String(L),frequencies};
}
function normalize(factors:CoverageFactors,exponents:string[]){const {u,v}=vectorPair(factors,exponents),invert=u>v;return {exponents:invert?exponents.map(z=>String(-Number(z))):exponents,orientation:invert?"INVERTED" as const:"AS_CONSTRUCTED" as const};}
function engine(m:number,factors:CoverageFactors,run:Budget){
  const M=groupOrder(m);
  if(!Array.isArray(factors)||factors.length>16)throw new RangeError("Bounded abstract factor support");
  let T=one,previous=1;
  for(const entry of factors){if(!Array.isArray(entry)||entry.length!==2||!entry.every(v=>typeof v==="string"&&/^[1-9][0-9]{0,8}$/.test(v)))throw new RangeError("Bounded decimal factors");
    const [q,e]=entry.map(Number);if(!prime(q,run.tick)||q<=previous||!bounded(e,26))throw new RangeError("Exact sorted prime valuations");previous=q;T*=B(q)**B(e);if(T>B(100500000))throw new RangeError("Bounded abstract factor product");}
  validateCoverageFactors(factors,T);
  if(gcd(T,B(m))!==one)throw new RangeError("Unit factor support");
  const qs=divisors(M,run),stages:CoverageStage[]=[],consumed:string[]=[],remaining=new Set(factors.map((_,i)=>i));
  let covered:CoverageEntry[]=[{residue:"1",exponents:factors.map(()=>"0")}];run.insert();
  let certificate:CoreCertificate|null=null;
  while(true){run.tick();const K=new Set(covered.map(k=>Number(k.residue)));let selected:{i:number;d:number}|null=null;
    for(const i of remaining){const d=relativeOrder(Number(B(factors[i][0])%B(m)),m,M,K,qs,run);if(d<=2*Number(factors[i][1])+1){selected={i,d};break;}}
    if(!selected)break;
    const {i,d}=selected,q=B(factors[i][0]),e=Number(factors[i][1]),r=Number(q%B(m)),inverse=pow(r,M-1,m,run),oldDigest=coverageDigest(covered),next:CoverageEntry[]=[];
    for(const entry of covered)for(let z=-e;z<-e+d;z++){run.insert();const residue=mul(Number(entry.residue),pow(z<0?inverse:r,Math.abs(z),m,run),m,run);
      next.push({residue:String(residue),exponents:entry.exponents.map((a,j)=>j===i?String(z):a)});}
    next.sort((a,b)=>Number(a.residue)-Number(b.residue));if(new Set(next.map(k=>k.residue)).size!==next.length)throw new Error("Exact relative-order coset collision");
    covered=next;remaining.delete(i);consumed.push(String(i));const body={factorIndex:String(i),prime:factors[i][0],exponent:factors[i][1],relativeOrder:String(d),previousCoveredDigest:oldDigest,covered};stages.push({...body,stageDigest:coverageDigest(body)});
    const target=covered.find(k=>k.residue===String(m-1));if(target){certificate={kind:"CHAIN",...normalize(factors,target.exponents)};break;}
  }
  const unused=[...remaining],attempts:CoverageAttempt[]=[],total=unused.length>=2?2**(unused.length-1)-1:0;
  if(!certificate&&unused.length>=2){const quotientOrder=M/covered.length,targetCoset=coset(m-1,m,covered,run);
    for(let mask=1;mask<2**unused.length-1;mask++){if(!(mask&1))continue;run.tick();
      const a=unused.filter((_,i)=>mask&(1<<i)),b=unused.filter((_,i)=>!(mask&(1<<i))),A=half(a,factors,m,M,covered,run),D=half(b,factors,m,M,covered,run),sufficient=B(A.L)+B(D.L)>B(quotientOrder);
      const body={mask:String(mask),A,B:D,quotientOrder:String(quotientOrder),sufficient};attempts.push({...body,attemptDigest:coverageDigest(body)});
      if(!sufficient)continue;
      const mapB=new Map(D.frequencies.map(f=>[f.coset,f]));let match:Extract<CoreCertificate,{kind:"ENERGY"}>["match"]|null=null;
      for(const f of A.frequencies){const wanted=coset(mul(targetCoset,pow(Number(f.coset),M-1,m,run),m,run),m,covered,run),g=mapB.get(String(wanted));if(!g)continue;
        const liftResidue=mul(m-1,pow(mul(Number(f.residue),Number(g.residue),m,run),M-1,m,run),m,run),lift=covered.find(k=>k.residue===String(liftResidue));if(!lift)throw new Error("Invalid quotient lift");
        match={cosetA:f.coset,cosetB:g.coset,exponentsA:f.exponents,exponentsB:g.exponents,liftResidue:String(liftResidue),liftExponents:lift.exponents};break;}
      if(!match)throw new Error("Strict energy intersection contradiction");
      const exponents=factors.map((_,i)=>String(Number(match!.exponentsA[i])+Number(match!.exponentsB[i])+Number(match!.liftExponents[i])));
      certificate={kind:"ENERGY",partitionMask:String(mask),match,...normalize(factors,exponents)};break;
    }
  }
  if(certificate&&vectorResidue(factors,certificate.exponents,m,M,run)!==m-1)throw new Error("Final sufficient target identity");
  return {chain:{stages,consumed,unused:unused.map(String),covered},attempts,allocation:{totalPartitions:String(total),evaluatedPartitions:String(attempts.length),notEvaluatedPartitions:String(total-attempts.length)},
    status:certificate?(certificate.kind==="CHAIN"?"CHAIN_CERTIFIED" as const:"ENERGY_CERTIFIED" as const):"NOT_CERTIFIED" as const,certificate};
}
/** Abstract finite-group control only: no arbitrary root/campaign inputs. */
export function analyzeCoverageAbstract(m:number,factors:CoverageFactors,options:CoverageRunOptions={}){return engine(m,factors,budget(options));}
export function reconstructCoverageWitness(p:bigint,m:bigint,T:bigint,factors:CoverageFactors,exponents:string[]):CoverageWitness{
  if(![p,m,T].every(n=>typeof n==="bigint"&&n> B(0)&&n.toString().length<=10)||p>B(201000000)||!prime(Number(p))||p%B(840)!==one||p<=m||
    !SUFFICIENT_COVERAGE_INPUTS.rows.some(s=>s.p===String(p)&&s.m===String(m))||four*T!==p+m||gcd(T,m)!==one)throw new RangeError("Fixed root-bound sufficient witness");
  validateCoverageFactors(factors,T);const {u,v}=vectorPair(factors,exponents);
  if(u>v||gcd(u,v)!==one||T%(u*v)||(u+v)%m)throw new RangeError("Actual disjoint valuation lift");
  const A=(u+v)/m,k=T/(u*v),ds=[T,A*p*u*k,A*p*v*k].sort(cmp);
  if(!(ds[0]<ds[1]&&ds[1]<ds[2])||ds.filter(d=>d%p===B(0)).length!==2||four*ds[0]*ds[1]*ds[2]!==p*(ds[0]*ds[1]+ds[1]*ds[2]+ds[2]*ds[0]))throw new Error("Strict Type-II identity failure");
  return {u:String(u),v:String(v),k:String(k),A:String(A),x:String(ds[0]),y:String(ds[1]),z:String(ds[2])};
}
function row(input:typeof SUFFICIENT_COVERAGE_INPUTS.rows[number],run:Budget):CoverageRow{
  const p=Number(input.p),m=Number(input.m);
  if(!prime(p,run.tick)||p%840!==1||m>=p||(p+m)%4||!(input.source==="TIP037"?prime(m,run.tick)&&m%4===3:m%3===0&&prime(m/3,run.tick)&&(m/3)%4===1))throw new RangeError("Fixed sufficient row domain");
  const T=(p+m)/4;if(gcd(B(T),B(m))!==one)throw new RangeError("Unit root denominator");
  const factors=factor(T,run),result=engine(m,factors,run),certificate=result.certificate?{...result.certificate,witness:reconstructCoverageWitness(B(p),B(m),B(T),factors,result.certificate.exponents)}:null;
  const body={id:input.id,p:input.p,m:input.m,T:String(T),groupOrder:String(groupOrder(m)),factors,...result,certificate};
  return {...body,rowDigest:coverageDigest(body)};
}
function summarize(rows:readonly CoverageRow[],complete:boolean){const counts={CHAIN_CERTIFIED:"0",ENERGY_CERTIFIED:"0",NOT_CERTIFIED:"0"};for(const r of rows)counts[r.status]=String(Number(counts[r.status])+1);return {complete,counts};}
export type CoveragePending={phase:"ROW"|"FINALIZE";id?:string};
export function sufficientCoveragePacket(options:CoverageRunOptions={}){
  const run=budget(options),rows:CoverageRow[]=[];let pending:CoveragePending|null={phase:"ROW",id:SUFFICIENT_COVERAGE_INPUTS.rows[0].id},reason:StopReason|null=null,retainedBytes=0;
  try{for(const input of SUFFICIENT_COVERAGE_INPUTS.rows){pending={phase:"ROW",id:input.id};run.tick();if(rows.length>=run.limits.maxRows)throw new RunStop("ROW_LIMIT");
    const next=row(input,run),bytes=Buffer.byteLength(coverageCanonicalJson(next),"utf8");if(retainedBytes+bytes+16384>run.limits.maxOutputBytes)throw new RunStop("OUTPUT_LIMIT");rows.push(next);retainedBytes+=bytes;}
    pending={phase:"FINALIZE"};run.tick();pending=null;
  }catch(error){if(!(error instanceof RunStop))throw error;reason=error.reason;}
  const invariant={inputs:SUFFICIENT_COVERAGE_INPUTS,rows,rowsDigest:coverageDigest(rows),summary:summarize(rows,reason===null)};
  const body={method:"ERDOS_STRAUS_SUFFICIENT_COVERAGE_V1" as const,status:reason?"PARTIAL" as const:"COMPLETE" as const,...invariant,limits:run.limits,pending,reason,scope:SUFFICIENT_COVERAGE_SCOPE,
    contentDigest:coverageDigest(invariant),runtime:{stateInsertions:String(run.stateCount()),workSteps:String(run.workCount()),elapsedMs:String(run.elapsed()),outputBytes:"0"}};
  const seal=()=>{let sealed={...body,packetDigest:coverageDigest(body)};for(let i=0;i<8;i++){const bytes=String(Buffer.byteLength(JSON.stringify(sealed),"utf8"));if(bytes===body.runtime.outputBytes)break;body.runtime.outputBytes=bytes;sealed={...body,packetDigest:coverageDigest(body)};}return sealed;};
  let packet=seal();body.runtime.elapsedMs=String(run.elapsed());packet=seal();
  try{if(body.status==="COMPLETE")run.tick();}catch(error){if(!(error instanceof RunStop))throw error;body.status="PARTIAL";body.reason=error.reason;body.pending={phase:"FINALIZE"};body.summary=summarize(rows,false);body.contentDigest=coverageDigest({...invariant,summary:body.summary});body.runtime.elapsedMs=String(run.elapsed());packet=seal();}
  if(Number(packet.runtime.outputBytes)>run.limits.maxOutputBytes)throw new Error("No oversized sufficient diagnostic emitted");return packet;
}
export type SufficientCoveragePacket=ReturnType<typeof sufficientCoveragePacket>;
export function finalizeCoverageForOutput(packet:SufficientCoveragePacket,observedMs:number):SufficientCoveragePacket{
  if(!Number.isFinite(observedMs)||observedMs<0)throw new RangeError("Monotonic output checkpoint");const {packetDigest,...original}=packet;void packetDigest;
  const body={...original,runtime:{...original.runtime,elapsedMs:String(Math.round(observedMs))}};
  if(body.status==="COMPLETE"&&observedMs>=body.limits.seconds*1000){body.status="PARTIAL";body.reason="TIME_LIMIT";body.pending={phase:"FINALIZE"};body.summary=summarize(body.rows,false);body.contentDigest=coverageDigest({inputs:body.inputs,rows:body.rows,rowsDigest:body.rowsDigest,summary:body.summary});}
  let sealed={...body,packetDigest:coverageDigest(body)};for(let i=0;i<8;i++){const bytes=String(Buffer.byteLength(JSON.stringify(sealed),"utf8"));if(bytes===body.runtime.outputBytes)break;body.runtime.outputBytes=bytes;sealed={...body,packetDigest:coverageDigest(body)};}
  if(Number(sealed.runtime.outputBytes)>body.limits.maxOutputBytes)throw new RangeError("Bounded CLI output");return sealed;
}
