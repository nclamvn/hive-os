import {createHash} from "node:crypto";
import {z} from "zod";
import {canonicalJson,assertNoCredentialMaterial} from "@/modules/execution-fabric/contracts";
import type {PermutationCheckerResult} from "./checker";

export const roles=["ATTEMPT","CRITIC","FINAL","POSTREVIEW"] as const;
export type Role=typeof roles[number];
export const task=Object.freeze({id:"PUBLIC_PERMUTATION_DEMO_080",n:"1000000000000",title:"A recursive construction on large permutations",source:"https://epoch.ai/frontiermath/tiers-1-4/benchmark-problems#tier-2",
  statement:"Let W be the finite words of distinct positive integers. Define F(empty)=empty. If w=L m R with maximum letter m, define F(w)=F(L)F(R)m. Let sigma be uniformly random among permutations of {1,...,n}, n=1000000000000. Let X=E[#{i:1<=i<n, pos_F(sigma)(i+1)<pos_F(sigma)(i)}]. Compute floor(X), with a complete mathematical justification.",
  exposure:"Known public FrontierMath Tier 2 sample. Not blind, official score or discovery. Standard S_n means permutations on n letters."});
export const limits=Object.freeze({roles:4,wallSeconds:900,originalBytes:32768,promptBytes:131072,exportBytes:1048576,ledgerRecords:64});
export class BridgeRefusal extends Error {constructor(public readonly code:"INPUT"|"AUTHORITY"|"SOURCE"|"INTEGRITY"|"RESOURCE",message="Permutation bridge refused") {super(message);}}
export const hashBytes=(bytes:Uint8Array|string)=>createHash("sha256").update(bytes).digest("hex");
export const digest=(value:unknown)=>hashBytes(canonicalJson(value));
export function assertExportBytesSafe(bytes:Uint8Array) {
  const marker=/"(?:api[_-]?key|password|database_url|authorization|cookies?|set-cookie|access[_-]?token|refresh[_-]?token|id[_-]?token)"\s*:/i;
  const text=new TextDecoder("utf-8",{ignoreBOM:true}).decode(bytes);let nodes=0;
  const scan=(value:unknown,depth=0):void=>{
    if(++nodes>4096||depth>16)throw new BridgeRefusal("RESOURCE");
    if(typeof value==="string") {
      const shadow=value.replace(/\\u([a-f0-9]{4})/gi,(_,hex:string)=>String.fromCharCode(parseInt(hex,16))).replace(/\\+"/g,'"');
      assertNoCredentialMaterial(shadow);if(marker.test(shadow))throw new BridgeRefusal("INPUT");
    } else if(Array.isArray(value))for(const item of value)scan(item,depth+1);
    else if(value&&typeof value==="object")for(const [key,item]of Object.entries(value)){scan(`"${key}":`,depth+1);scan(item,depth+1);}
  };
  scan(text);let parsed:unknown;try{parsed=JSON.parse(text);}catch{/* plain or malformed originals remain exact */}if(parsed!==undefined)scan(parsed);
}
export const sha=z.string().regex(/^[a-f0-9]{64}$/),id=z.string().uuid();
export interface Binding {runId:string;organizationId:string;workspaceId:string;missionId:string;actorUserId:string;sourceDigest:string;taskDigest:string;provenance:"CODEX_ASSISTED"}
export interface Original {key:string;digest:string;bytes:number;accepted:boolean;model:string|null;thread:string|null;freshContextAttested:true}
export interface Stage {role:Role;promptDigest:string;reservedAt:string;original:Original|null}
export interface State {status:"DRAFT"|"RUNNING"|"COMPLETED"|"REVOKED"|"STOPPED";startedAt:string|null;deadlineAt:string|null;stages:Stage[];reason:string|null;checker:PermutationCheckerResult|null}
export type Kind="DRAFT"|"START"|"ROLE_RESERVED"|"IMPORT_RETAINED"|"REVOKED"|"CHECKED";
export interface LedgerEvent extends Binding {sequence:number;previousDigest:string|null;commandId:string;kind:Kind;at:string;detail:Record<string,unknown>;eventDigest:string}
export const initial=():State=>({status:"DRAFT",startedAt:null,deadlineAt:null,stages:[],reason:null,checker:null});
function fail():never{throw new BridgeRefusal("INTEGRITY");}
const rational=z.object({numerator:z.string().max(2048).regex(/^-?(0|[1-9][0-9]*)$/),denominator:z.string().max(2048).regex(/^[1-9][0-9]*$/)}).strict();
const bounds=z.object({lower:rational,upper:rational,strict:z.literal(true)}).strict();
const checkerSchema=z.object({status:z.enum(["SUPPORTED_UNDER_LEMMA_ARITHMETIC","ARITHMETIC_CLAIM_MISMATCH","INCONCLUSIVE"]),reason:z.string().max(1000),
  binding:z.object({runId:id,finalDigest:sha,sourceBundleDigest:sha,taskDigest:sha}).strict(),candidateDigest:sha,certificateDigest:sha.nullable(),claimedFloor:z.string().max(32).regex(/^(0|[1-9][0-9]*)$/).nullable(),
  arithmetic:z.object({n:z.literal("1000000000000"),seriesTerms:z.literal(16),derivedFloor:z.string().max(32).regex(/^(0|[1-9][0-9]*)$/),log10:z.object({partial:rational,remainderUpper:rational,lower:rational,upper:rational}).strict(),harmonicBounds:bounds,expectationBounds:bounds}).strict().nullable(),
  assumptions:z.array(z.string().max(2000)).max(12),proofValidation:z.literal("NOT_VALIDATED_NON_FORMAL_REVIEW_REQUIRED"),formalProof:z.literal("NOT_ESTABLISHED"),officialScore:z.literal("NOT_ESTABLISHED"),
  measurements:z.object({elapsedMilliseconds:z.number().finite().min(0).max(2000),rationalOperations:z.number().int().min(0).max(4096),gcdIterations:z.number().int().min(0).max(4096),peakIntegerBits:z.number().int().min(0).max(4096)}).strict()}).strict();
export function reduce(state:State,event:Pick<LedgerEvent,"kind"|"at"|"detail">&Partial<Binding>):State {
  const next=structuredClone(state),at=Date.parse(event.at);if(!Number.isFinite(at))fail();
  if(event.kind==="DRAFT") {if(next.startedAt||next.stages.length||next.status!=="DRAFT")fail();return next;}
  if(event.kind==="REVOKED") {if(next.status==="COMPLETED"||next.status==="REVOKED")fail();next.status="REVOKED";next.reason="Future admissions revoked; external Codex work cannot be forcibly cancelled.";return next;}
  if(event.kind==="START") {if(next.status!=="DRAFT"||next.startedAt)fail();next.startedAt=event.at;next.deadlineAt=new Date(at+limits.wallSeconds*1000).toISOString();next.status="RUNNING";return next;}
  if(next.status!=="RUNNING"||!next.deadlineAt||at>=Date.parse(next.deadlineAt))throw new BridgeRefusal("RESOURCE");
  const last=next.stages.at(-1);
  if(event.kind==="ROLE_RESERVED") {
    const role=event.detail.role;if(role!==roles[next.stages.length]||next.stages.length>=4||last&&!last.original?.accepted||role==="POSTREVIEW"&&!next.checker||!sha.safeParse(event.detail.promptDigest).success)fail();
    next.stages.push({role:role as Role,promptDigest:String(event.detail.promptDigest),reservedAt:event.at,original:null});
  } else if(event.kind==="IMPORT_RETAINED") {
    if(!last||last.original||event.detail.role!==last.role)fail();
    const original=z.object({key:z.string().min(1).max(300),digest:sha,bytes:z.number().int().min(1).max(limits.originalBytes),accepted:z.boolean(),model:z.string().max(160).nullable(),thread:z.string().max(200).nullable(),freshContextAttested:z.literal(true)}).strict().parse(event.detail.original);
    last.original=original;
    if(!original.accepted){next.status="STOPPED";next.reason="Retained original refused; no replacement or retry.";}
    else if(last.role==="POSTREVIEW")next.status="COMPLETED";
  } else if(event.kind==="CHECKED") {
    if(next.checker||last?.role!=="FINAL"||!last.original?.accepted)fail();
    const result=checkerSchema.parse(event.detail.result);
    if(result.candidateDigest!==last.original.digest||result.binding.finalDigest!==last.original.digest||result.binding.runId!==event.runId||result.binding.sourceBundleDigest!==event.sourceDigest||result.binding.taskDigest!==event.taskDigest||result.status!=="INCONCLUSIVE"&&!result.arithmetic)fail();
    next.checker=structuredClone(result);
  } else fail();
  return next;
}
export function originalText(bytes:Uint8Array):string {
  if(!bytes.length||bytes.length>limits.originalBytes)throw new BridgeRefusal("RESOURCE");
  const text=new TextDecoder("utf-8",{fatal:true,ignoreBOM:true}).decode(bytes);assertExportBytesSafe(bytes);
  if(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(text))throw new BridgeRefusal("INPUT");
  // No trim, JSON canonicalization, fence extraction or mathematical repair.
  if(!text.trim())throw new BridgeRefusal("INPUT");return text;
}
export function prompt(role:Role,binding:Binding,prior:{role:Role;text:string;digest:string}[]):string {
  const expected:readonly Role[]=role==="POSTREVIEW"?["FINAL"]:roles.slice(0,roles.indexOf(role));
  if(prior.length!==expected.length||prior.some((p,index)=>p.role!==expected[index]||hashBytes(p.text)!==p.digest))throw new BridgeRefusal("INTEGRITY");
  const instructions:Record<Role,string>={ATTEMPT:"Develop an original solution and justification. Give the requested integer and the mathematical argument. State unresolved gaps honestly.",CRITIC:"Critique the retained ATTEMPT. Identify concrete mathematical gaps or errors; do not rely on its confidence.",FINAL:"Produce your final answer and complete justification using the retained attempt and critique. If unresolved, explicitly report inconclusive.",POSTREVIEW:"Independently review the exact retained FINAL argument. Check every mathematical step and premise. Arithmetic support does not validate the proof; a matching number is not acceptance. State SUPPORTED, ESSENTIAL_GAP, INCORRECT or INCONCLUSIVE and justify. This is NON-FORMAL review, not an official score."};
  const format=role==="FINAL"?'Return one strict JSON object {"proof":"complete argument","certificate":{"version":1,"kind":"EXPECTED_INVERSE_DESCENT_FLOOR","n":"1000000000000","floor":"canonical unsigned decimal integer"}}. Maximum32768UTF8bytes. No extra fields or markdown fences.':"Return the original reasoning as plain UTF8 text, maximum32768bytes.";
  const text=["CODEX_ASSISTED — fresh separate context; one visible request for this reserved role. No paid API. Tools/hidden work may be UNKNOWN; no inference-only guarantee.",
    task.statement,task.exposure,`Fixed n=${task.n}. Role=${role}. Run=${binding.runId}. TaskSHA=${binding.taskDigest}. SourceSHA=${binding.sourceDigest}.`,instructions[role],format,
    ...prior.map(p=>`Retained ${p.role}; exact received UTF8 SHA256=${p.digest}\n${p.text}`)].join("\n\n");
  if(Buffer.byteLength(text)>limits.promptBytes)throw new BridgeRefusal("RESOURCE");return text;
}
export function eventDigest(event:Omit<LedgerEvent,"eventDigest">){return digest(event);}
export function project(binding:Binding,events:LedgerEvent[]):State {
  if(!events.length||events.length>limits.ledgerRecords)fail();let state=initial(),previous:string|null=null;
  let lastTime=-Infinity;for(let index=0;index<events.length;index++) {
    const e=events[index],{eventDigest:seal,...body}=e;
    const time=Date.parse(e.at);if(!Number.isFinite(time)||time<lastTime||Object.keys(binding).some(key=>e[key as keyof Binding]!==binding[key as keyof Binding])||e.sequence!==index+1||e.previousDigest!==previous||seal!==eventDigest(body)||index===0&&e.kind!=="DRAFT"||index>0&&e.kind==="DRAFT")fail();
    state=reduce(state,e);previous=seal;lastTime=time;
  }return state;
}
