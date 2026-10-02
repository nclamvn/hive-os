import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { performance } from "node:perf_hooks";
import type { BlockCoveragePacket, BlockCoverageRow, BlockCoverageFactors, BlockCoverageWitness } from "./block-coverage";

const targets=["200023321","200602081","200656681","131433121"],shifts=["3","7","11","19","23","31","43","47","59","67","71","79","83","103","107"];
const newRoots=["199000201","199002721","199003561","199006921","199014481","199031281","199035481","199039681"];
const compositeRows=[["r0","200023321","1595931"],["r1","200023321","183"],["r2","200023321","3000351"],["r3","200602081","25075263"],["r4","200602081","2550027"],["r5","200602081","4227"],["r6","200602081","247047"],["r7","200656681","68127"],["r10","131433121","7179"],["r11","131433121","19714971"],["r13","200656681","206439"]];
const BASELINE_INPUTS=Object.freeze({
  rows:Object.freeze([...targets.flatMap((p,i)=>shifts.map(m=>Object.freeze({id:`P${i}_h${m}`,p,m,source:"TIP037" as const,sourceRowId:`${p}:${m}`,cohort:"EXPOSED_71" as const}))),
    ...compositeRows.map(([sourceRowId,p,m])=>Object.freeze({id:`C_${sourceRowId}`,p,m,source:"TIP039" as const,sourceRowId,cohort:"EXPOSED_71" as const})),
    ...newRoots.flatMap((p,i)=>shifts.map(m=>Object.freeze({id:`N${i}_h${m}`,p,m,source:"TIP041" as const,sourceRowId:`${p}:${m}`,cohort:"PRIMALITY_ONLY_120" as const})))]),
  sourceContentDigests:Object.freeze({TIP037:"a6e29476a065de13e0de34d64458579b96e74ec9da35196e74eac1275f4e767c",TIP039:"ff01bdbd52abbb55e98ab912b2c201968cecb210a5fd6449725dd8804731831e",TIP040:"48b455470ecb38da669d372206841a65fbc34facb0b684763a01b3df5d96fa72"}),
  newCohort:Object.freeze({roots:Object.freeze(newRoots),shifts:Object.freeze(shifts),selection:"FIRST_8_ASCENDING_PRIMES_P1MOD840_IN_199000000_TO_199100000_PRIMALITY_ONLY",identity:"0dce735540a95a5087c5d624b8f85faab6e20a009b3071bfdc4ba4b126f9806a"}),
  policy:"ASCENDING_INDIVIDUAL_THEN_CARDINALITY_MASK_BLOCK_THEN_ENERGY_V1"
});
export const BLOCK_COVERAGE_LIMITS=Object.freeze({seconds:60,maxRows:191,maxStateInsertions:2000000,maxWorkSteps:50000000,maxOutputBytes:8388608,maxSmallGroupElements:53,maxSubgroupsPerAttempt:4096});

export const OCCUPIED_DENSITY_INPUTS=Object.freeze({baselineInputs:BASELINE_INPUTS,policy:"INHERIT_TIP041_THEN_ASCENDING_ORIGINAL_OCCUPIED_HALF_DENSITY_V1",exposure:"ALL_191_EXPOSED_DEVELOPMENT"});
export const OCCUPIED_DENSITY_SOURCE_PINS=Object.freeze({primary:"1ac9f30c699e52e7d3e2784ce20535758323f76cbbb206431ab585a222c1338d",checker:"8b60055f1146212894e954e103723db4bc57e15fc55a7ed09ca544e55f80ff1a",replay:"5dbe06e076f0a8b010b03c248305d2601a4688b9bbd4711f849a437bc32dd0d0"});
export const OCCUPIED_DENSITY_BASE_CONTENT="4d00cb143ae028bcda5f636df617c049ed4d006bcd54bed3f585c1c58e048347";
export const OCCUPIED_DENSITY_BASE_ROWS="e51794b81610642e49920bd9016835891f046d909de7a00ecdd0da61e52c5bee";
export const OCCUPIED_DENSITY_SCOPE="FIXED_191_EXPOSED_ROWS_OCCUPIED_HALF_SUFFICIENT_ONLY_NOT_ROOT_EXCLUSION_OR_MINIMUM";
export const OCCUPIED_DENSITY_LIMITS=Object.freeze({seconds:60,maxRows:191,maxStateInsertions:2000000,maxWorkSteps:50000000,maxPairChecks:50000000,maxOutputBytes:8388608,checkerWorkCeiling:50000000});
export type DensityDecision={attemptIndex:string;baselineAttemptDigest:string;halfADigest:string;halfBDigest:string;mask:string;occupiedA:string;occupiedB:string;quotientOrder:string;sufficient:boolean};
export type DensityMatch={cosetA:string;cosetB:string;exponentsA:string[];exponentsB:string[];liftResidue:string;liftExponents:string[]};
export type DensityCertificate={kind:"OCCUPIED_DENSITY";attemptIndex:string;partitionMask:string;match:DensityMatch;exponents:string[];orientation:"AS_CONSTRUCTED"|"INVERTED";witness:BlockCoverageWitness};
export type DensityRow={id:string;baselineRowDigest:string;baselineStatus:BlockCoverageRow["status"];status:"INHERITED_CERTIFIED"|"DENSITY_CERTIFIED"|"NOT_CERTIFIED";decisions:DensityDecision[];allocation:{totalPartitions:string;evaluatedPartitions:string;notEvaluatedPartitions:string};certificate:DensityCertificate|null;rowDigest:string};
export function occupiedDensityCanonicalJson(value:unknown):string { if(Array.isArray(value))return `[${value.map(occupiedDensityCanonicalJson).join(",")}]`;if(value!==null&&typeof value==="object")return `{${Object.entries(value).sort(([a],[b])=>a<b?-1:a>b?1:0).map(([k,v])=>`${JSON.stringify(k)}:${occupiedDensityCanonicalJson(v)}`).join(",")}}`;return JSON.stringify(value);}
export const occupiedDensityDigest=(value:unknown)=>createHash("sha256").update(occupiedDensityCanonicalJson(value)).digest("hex");
type Reason="TIME_LIMIT"|"ROW_LIMIT"|"STATE_LIMIT"|"WORK_LIMIT"|"PAIR_LIMIT"|"OUTPUT_LIMIT"|"BASELINE_PARTIAL"|"DEPENDENCY_UNAVAILABLE"|"DEPENDENCY_DRIFT"|"BASELINE_INVALID";
class Stop extends Error {constructor(readonly reason:Reason){super(reason);}}
export type DensityRunOptions={now?:()=>number;seconds?:number;maxRows?:number;maxStateInsertions?:number;maxWorkSteps?:number;maxPairChecks?:number;maxOutputBytes?:number};
function budget(options:DensityRunOptions) {if(Object.keys(options).some(k=>!["now","seconds","maxRows","maxStateInsertions","maxWorkSteps","maxPairChecks","maxOutputBytes"].includes(k)))throw new RangeError("No arbitrary campaign options");const {now=()=>performance.now(),...tighter}=options,limits={...OCCUPIED_DENSITY_LIMITS,...tighter};
 for(const k of Object.keys(OCCUPIED_DENSITY_LIMITS) as Array<keyof typeof OCCUPIED_DENSITY_LIMITS>)if(!Number.isFinite(limits[k])||limits[k]<=0||limits[k]>OCCUPIED_DENSITY_LIMITS[k]||(k!=="seconds"&&!Number.isSafeInteger(limits[k])))throw new RangeError("Only tighter frozen limits");
 if(limits.maxOutputBytes<32768)throw new RangeError("Bounded diagnostic must retain fixed input identities");
 const origin=now(),pairs=0;let baseStates=0,baseWork=0,basePairs=0,states=0,work=0;
 const tick=()=>{if(now()-origin>=limits.seconds*1000)throw new Stop("TIME_LIMIT");};
 const seed=(base:BlockCoveragePacket)=>{baseStates=Number(base.runtime.stateInsertions);baseWork=Number(base.runtime.workSteps);basePairs=Number((base.runtime as typeof base.runtime&{pairChecks?:string}).pairChecks??0);
 if(baseStates>limits.maxStateInsertions)throw new Stop("STATE_LIMIT");if(baseWork>limits.maxWorkSteps)throw new Stop("WORK_LIMIT");if(basePairs>limits.maxPairChecks)throw new Stop("PAIR_LIMIT");};
 return {origin,now,limits,tick,seed,insert:()=>{tick();if(baseStates+states>=limits.maxStateInsertions)throw new Stop("STATE_LIMIT");states++;},
 work:()=>{tick();if(baseWork+work>=limits.maxWorkSteps)throw new Stop("WORK_LIMIT");work++;},
 stats:()=>({baseStates:String(baseStates),baseWork:String(baseWork),basePairs:String(basePairs),additionalStates:String(states),additionalWork:String(work),additionalPairs:String(pairs),stateInsertions:String(baseStates+states),workSteps:String(baseWork+work),pairChecks:String(basePairs+pairs),elapsedMs:String(Math.max(0,Math.round(now()-origin))),outputBytes:"0"})};
}
type Budget=ReturnType<typeof budget>;
const B=BigInt,one=B(1),zero=B(0);
function multiply(a:number,b:number,m:number,run:Budget){run.work();return Number(B(a)*B(b)%B(m));}
function power(a:number,e:number,m:number,run:Budget){let r=1;for(;e;e=Math.floor(e/2),a=multiply(a,a,m,run))if(e%2)r=multiply(r,a,m,run);return r;}
function gcd(a:bigint,b:bigint){while(b)[a,b]=[b,a%b];return a;}
function pair(factors:BlockCoverageFactors,z:string[]){if(z.length!==factors.length)throw new Error("Coordinate length");let u=one,v=one;for(let i=0;i<z.length;i++){if(!/^(0|-?[1-9][0-9]{0,2})$/.test(z[i])||Math.abs(Number(z[i]))>Number(factors[i][1]))throw new Error("Actual signed valuations");if(Number(z[i])>0)u*=B(factors[i][0])**B(z[i]);if(Number(z[i])<0)v*=B(factors[i][0])**B(-Number(z[i]));}return {u,v};}
function canonical(r:number,base:BlockCoverageRow,run:Budget){return Math.min(...base.chain.covered.map(k=>multiply(r,Number(k.residue),Number(base.m),run)));}
export function occupiedDensityAbstract(order:number,A:readonly number[],D:readonly number[]){if(!Number.isSafeInteger(order)||order<1||order>201000000||![A,D].every(S=>Array.isArray(S)&&new Set(S).size===S.length&&S.every(c=>Number.isSafeInteger(c)&&c>=0&&c<order)))throw new RangeError("Distinct represented abstract cosets only");
 return {occupiedA:String(A.length),occupiedB:String(D.length),quotientOrder:String(order),sufficient:A.length+D.length>order};}
function witness(base:BlockCoverageRow,z:string[]):BlockCoverageWitness {const {u,v}=pair(base.factors,z),T=B(base.T),m=B(base.m),p=B(base.p);
 if(u>v||gcd(u,v)!==one||T%(u*v)||(u+v)%m)throw new Error("Disjoint paid lift identity");
 const k=T/(u*v),A=(u+v)/m,ds=[T,A*p*u*k,A*p*v*k].sort((a,b)=>a<b?-1:a>b?1:0);
 if(ds[0]>=ds[1]||ds[1]>=ds[2]||ds.filter(d=>d%p===zero).length!==2||B(4)*ds[0]*ds[1]*ds[2]!==p*(ds[0]*ds[1]+ds[1]*ds[2]+ds[2]*ds[0]))throw new Error("Strict Type-II identity");
 return {u:String(u),v:String(v),k:String(k),A:String(A),x:String(ds[0]),y:String(ds[1]),z:String(ds[2])};}
function densityRow(base:BlockCoverageRow,run:Budget):DensityRow {const decisions:DensityDecision[]=[],total=base.status==="NOT_CERTIFIED"?base.attempts.length:0;let certificate:DensityCertificate|null=null;
 if(base.status==="NOT_CERTIFIED")for(let i=0;i<base.attempts.length;i++){run.tick();const a=base.attempts[i],occupiedA=a.A.frequencies.length,occupiedB=a.B.frequencies.length,Q=Number(base.groupOrder)/base.chain.covered.length;
 run.work();const sufficient=occupiedA+occupiedB>Q;run.insert();decisions.push({attemptIndex:String(i),baselineAttemptDigest:a.attemptDigest,halfADigest:occupiedDensityDigest(a.A),halfBDigest:occupiedDensityDigest(a.B),mask:a.mask,occupiedA:String(occupiedA),occupiedB:String(occupiedB),quotientOrder:String(Q),sufficient});
 if(!sufficient)continue;const m=Number(base.m),M=Number(base.groupOrder),mapB=new Map<string,typeof a.B.frequencies[number]>();for(const f of a.B.frequencies){run.insert();mapB.set(f.coset,f);}let match:DensityMatch|null=null;
 for(const f of a.A.frequencies){run.work();const target=canonical(multiply(m-1,power(Number(f.coset),M-1,m,run),m,run),base,run),g=mapB.get(String(target));if(!g)continue;
 const liftResidue=multiply(m-1,power(multiply(Number(f.residue),Number(g.residue),m,run),M-1,m,run),m,run),lift=base.chain.covered.find(k=>k.residue===String(liftResidue));if(!lift)throw new Error("Missing actually paid K lift");
 match={cosetA:f.coset,cosetB:g.coset,exponentsA:f.exponents,exponentsB:g.exponents,liftResidue:String(liftResidue),liftExponents:lift.exponents};break;}
 if(!match)throw new Error("Strict occupied density contradiction");
 const raw=base.factors.map((_,j)=>String(Number(match!.exponentsA[j])+Number(match!.exponentsB[j])+Number(match!.liftExponents[j]))),initial=pair(base.factors,raw),invert=initial.u>initial.v,exponents=invert?raw.map(x=>String(-Number(x))):raw;
 certificate={kind:"OCCUPIED_DENSITY",attemptIndex:String(i),partitionMask:a.mask,match,exponents,orientation:invert?"INVERTED":"AS_CONSTRUCTED",witness:witness(base,exponents)};break;}
 const body={id:base.id,baselineRowDigest:base.rowDigest,baselineStatus:base.status,status:base.status!=="NOT_CERTIFIED"?"INHERITED_CERTIFIED" as const:certificate?"DENSITY_CERTIFIED" as const:"NOT_CERTIFIED" as const,
 decisions,allocation:{totalPartitions:String(total),evaluatedPartitions:String(decisions.length),notEvaluatedPartitions:String(total-decisions.length)},certificate};return {...body,rowDigest:occupiedDensityDigest(body)};}
function summary(rows:readonly DensityRow[],complete:boolean){const empty=()=>({INHERITED_CERTIFIED:"0",DENSITY_CERTIFIED:"0",NOT_CERTIFIED:"0"}),counts=empty(),cohorts={EXPOSED_71:empty(),PRIMALITY_ONLY_120:empty()};
 rows.forEach((r,i)=>{counts[r.status]=String(Number(counts[r.status])+1);const c=cohorts[BASELINE_INPUTS.rows[i].cohort];c[r.status]=String(Number(c[r.status])+1);});return {complete,counts,cohorts};}
export type DensityPending={phase:"BASELINE"|"ROW"|"FINALIZE";id?:string};
function bytes(value:unknown){return Buffer.byteLength(JSON.stringify(value),"utf8");}
function actualBaselineValid(base:BlockCoveragePacket,run:Budget){const {packetDigest,...body}=base;
 const invariant={inputs:base.inputs,rows:base.rows,rowsDigest:base.rowsDigest,summary:base.summary};
 if(packetDigest!==occupiedDensityDigest(body)||Number(base.runtime.outputBytes)!==bytes(base)||occupiedDensityDigest(base.inputs)!==occupiedDensityDigest(BASELINE_INPUTS)||base.contentDigest!==occupiedDensityDigest(invariant)||base.rowsDigest!==occupiedDensityDigest(base.rows))return false;
 const expected={seconds:run.limits.seconds,maxRows:191,maxStateInsertions:run.limits.maxStateInsertions,maxWorkSteps:run.limits.maxWorkSteps,maxOutputBytes:run.limits.maxOutputBytes,maxSmallGroupElements:53,maxSubgroupsPerAttempt:4096};
 if(occupiedDensityDigest(base.limits)!==occupiedDensityDigest(expected)||Number(base.runtime.stateInsertions)>expected.maxStateInsertions||Number(base.runtime.workSteps)>expected.maxWorkSteps||bytes(base)>expected.maxOutputBytes)return false;
 if(base.status!=="COMPLETE")return true;
 return base.rows.length===191&&base.pending===null&&base.reason===null&&base.summary.complete&&Number(base.runtime.elapsedMs)<expected.seconds*1000&&base.contentDigest===OCCUPIED_DENSITY_BASE_CONTENT&&base.rowsDigest===OCCUPIED_DENSITY_BASE_ROWS;
}
/** Async source loading starts after the shared origin; import alone performs no campaign. */
export async function occupiedDensityPacket(options:DensityRunOptions={}) {
 const run=budget(options),rows:DensityRow[]=[],observedSourcePins:{primary:string|null;checker:string|null;replay:string|null}={primary:null,checker:null,replay:null};let base:BlockCoveragePacket|null=null;
 let pending:DensityPending|null={phase:"BASELINE"},reason:Reason|null=null;
 const dependencies={primary:"scripts/operations/block-coverage.ts",checker:"scripts/operations/block-coverage-check.ts",replay:"scripts/operations/block-coverage-replay.py"};
 const verifySources=()=>{for(const key of Object.keys(dependencies) as Array<keyof typeof dependencies>){run.tick();let source:Buffer;try{source=readFileSync(resolve(dependencies[key]));}catch{throw new Stop("DEPENDENCY_UNAVAILABLE");}
 observedSourcePins[key]=createHash("sha256").update(source).digest("hex");if(observedSourcePins[key]!==OCCUPIED_DENSITY_SOURCE_PINS[key])throw new Stop("DEPENDENCY_DRIFT");run.tick();}};
 try{verifySources();const [producer,checker]=await Promise.all([import("./block-coverage"),import("./block-coverage-check")]);run.tick();verifySources();
 let first=true;base=producer.blockCoveragePacket({seconds:run.limits.seconds,maxStateInsertions:run.limits.maxStateInsertions,maxWorkSteps:run.limits.maxWorkSteps,maxOutputBytes:run.limits.maxOutputBytes,
 now:()=>{if(first){first=false;return run.origin;}return run.now();}});run.seed(base);verifySources();run.tick();
 if(!checker.blockCoveragePacketSchema.safeParse(base).success||!actualBaselineValid(base,run))throw new Stop("BASELINE_INVALID");run.tick();
 if(base.status!=="COMPLETE")throw new Stop("BASELINE_PARTIAL");
 // Leave dependency evidence immutable. The new additive rows bind it by hashes.
 for(const input of base.rows){pending={phase:"ROW",id:input.id};run.tick();if(rows.length>=run.limits.maxRows)throw new Stop("ROW_LIMIT");const next=densityRow(input,run);run.insert();rows.push(next);}
 pending={phase:"FINALIZE"};run.tick();pending=null;
 }catch(error){if(!(error instanceof Stop))throw error;reason=error.reason==="TIME_LIMIT"&&base?.status==="PARTIAL"?"BASELINE_PARTIAL":error.reason;}
 const body={method:"ERDOS_STRAUS_OCCUPIED_HALF_DENSITY_V1" as const,status:reason?"PARTIAL" as const:"COMPLETE" as const,inputs:OCCUPIED_DENSITY_INPUTS,
 baseline:{packet:base,expectedSourcePins:OCCUPIED_DENSITY_SOURCE_PINS,observedSourcePins,omitted:base===null},baselineContentDigest:base?.contentDigest??null,baselineRowsDigest:base?.rowsDigest??null,
 rows,rowsDigest:"",summary:summary(rows,reason===null),limits:run.limits,pending,reason,scope:OCCUPIED_DENSITY_SCOPE,contentDigest:"",runtime:run.stats()};
 return finishPacket(body,run);
}
type DensityBody={
 method:"ERDOS_STRAUS_OCCUPIED_HALF_DENSITY_V1";status:"COMPLETE"|"PARTIAL";inputs:typeof OCCUPIED_DENSITY_INPUTS;
 baseline:{packet:BlockCoveragePacket|null;expectedSourcePins:typeof OCCUPIED_DENSITY_SOURCE_PINS;observedSourcePins:{primary:string|null;checker:string|null;replay:string|null};omitted:boolean};
 baselineContentDigest:string|null;baselineRowsDigest:string|null;rows:DensityRow[];rowsDigest:string;summary:ReturnType<typeof summary>;limits:{[K in keyof typeof OCCUPIED_DENSITY_LIMITS]:number};
 pending:DensityPending|null;reason:Reason|null;scope:string;contentDigest:string;runtime:ReturnType<Budget["stats"]>;
};
function seal(body:DensityBody){body.rowsDigest=occupiedDensityDigest(body.rows);body.summary=summary(body.rows,body.status==="COMPLETE");
 body.contentDigest=occupiedDensityDigest({inputs:body.inputs,baselineContentDigest:body.baselineContentDigest,baselineRowsDigest:body.baselineRowsDigest,rows:body.rows,rowsDigest:body.rowsDigest,summary:body.summary});
 let packet={...body,packetDigest:occupiedDensityDigest(body)};for(let i=0;i<12;i++){const n=String(bytes(packet));if(n===body.runtime.outputBytes)break;body.runtime.outputBytes=n;packet={...body,packetDigest:occupiedDensityDigest(body)};}return packet;}
function finishPacket(body:DensityBody,run:Budget){let packet=seal(body);body.runtime.elapsedMs=run.stats().elapsedMs;packet=seal(body);
 if(Number(packet.runtime.outputBytes)>body.limits.maxOutputBytes){body.status="PARTIAL";body.reason="OUTPUT_LIMIT";
 while(body.rows.length&&Number(packet.runtime.outputBytes)>body.limits.maxOutputBytes){body.rows.pop();body.pending={phase:"ROW",id:BASELINE_INPUTS.rows[body.rows.length].id};packet=seal(body);}
 if(Number(packet.runtime.outputBytes)>body.limits.maxOutputBytes){body.baseline.packet=null;body.baseline.omitted=true;body.baselineContentDigest=null;body.baselineRowsDigest=null;body.rows=[];body.pending={phase:"BASELINE"};packet=seal(body);}}
 // Refresh every receipt after suffix trimming/omission, including prior PARTIAL.
 body.runtime.elapsedMs=run.stats().elapsedMs;packet=seal(body);
 try{if(body.status==="COMPLETE")run.tick();}catch(error){if(!(error instanceof Stop))throw error;body.status="PARTIAL";body.reason=error.reason;body.pending={phase:"FINALIZE"};body.runtime.elapsedMs=run.stats().elapsedMs;packet=seal(body);}
 if(Number(packet.runtime.outputBytes)>body.limits.maxOutputBytes)throw new Error("No oversized density diagnostic emitted");return packet;}
export type OccupiedDensityPacket=Awaited<ReturnType<typeof occupiedDensityPacket>>;
export function finalizeOccupiedDensityForOutput(packet:OccupiedDensityPacket,observedMs:number):OccupiedDensityPacket{if(!Number.isFinite(observedMs)||observedMs<0)throw new RangeError("Monotonic output checkpoint");const {packetDigest,...original}=packet;void packetDigest;
 const body={...original,runtime:{...original.runtime,elapsedMs:String(Math.round(observedMs))}};if(body.status==="COMPLETE"&&observedMs>=body.limits.seconds*1000){body.status="PARTIAL";body.reason="TIME_LIMIT";body.pending={phase:"FINALIZE"};}const final=seal(body);if(bytes(final)>body.limits.maxOutputBytes)throw new Error("Bounded output checkpoint");return final;}
