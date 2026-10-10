import {z} from "zod";
import {assertExportBytesSafe, digest, hashBytes, project, roles, task, type Binding, type LedgerEvent, type Role} from "@/modules/permutation-bridge/contracts";
import type {PermutationCheckerResult} from "@/modules/permutation-bridge/checker";
import {editorialSteps, rolePins, stepIds, studioAnchor, type EditorialStep, type StepId} from "./annotations";

export const annotationDigest="5156d3ec78df8b2adc78dc90454c88fb7e9f2146333bbc5f86f54615ab7c3fac";
export const views=["overview","proof","audit"] as const;
export type StudioView=typeof views[number];
export type SelectedQuery={status:"selected";missionId:string;runId:string;view:StudioView;step:StepId;event:number};
export type StudioQuery=SelectedQuery|{status:"empty"|"out-of-scope"};
export function parseStudioQuery(q:Record<string,string|string[]|undefined>):StudioQuery {
  const keys=["missionId","runId","view","step","event"];
  if(Object.keys(q).some(k=>!keys.includes(k))||Object.values(q).some(v=>Array.isArray(v)||typeof v==="string"&&v.length>200))return {status:"out-of-scope"};
  if(!q.missionId&&!q.runId)return {status:"empty"};
  if(q.missionId!==studioAnchor.missionId||q.runId!==studioAnchor.runId)return {status:"out-of-scope"};
  const view=q.view??"overview",step=q.step??"structure",event=q.event??"11";
  if(!views.includes(view as StudioView)||!stepIds.includes(step as StepId)||!/^(?:[1-9]|10|11)$/.test(event as string))return {status:"out-of-scope"};
  return {status:"selected",missionId:q.missionId,runId:q.runId,view:view as StudioView,step:step as StepId,event:Number(event)};
}
export function studioHref(slug:string,selected:SelectedQuery,change:Partial<Pick<SelectedQuery,"view"|"step"|"event">>={}) {
  const q={...selected,...change};return `/w/${encodeURIComponent(slug)}/research/evidence-studio?${new URLSearchParams({missionId:q.missionId,runId:q.runId,view:q.view,step:q.step,event:String(q.event)})}`;
}
export interface StudioOriginal {role:Role;digest:string;bytes:number;text:string;prompt:{digest:string;bytes:number;text:string}}
export interface OriginalReference {role:"FINAL";digest:string;bytes:number;startByte:number;endByte:number;quote:string;quoteDigest:string;runId:string;sourceDigest:string;taskDigest:string;eventCut:string}
export interface BoundStep extends EditorialStep {reference:OriginalReference}
export interface StudioEvent {sequence:number;kind:LedgerEvent["kind"];at:string;digest:string;role:Role|null;originalDigest:string|null;promptDigest:string|null}
export interface StudioModel {
  runId:string;missionId:string;sourceDigest:string;taskDigest:string;title:string;statement:string;sourceUrl:string;
  process:"COMPLETED";provenance:"CODEX_ASSISTED";proofStatus:"NON_FORMAL";startedAt:string;completedAt:string;
  originals:StudioOriginal[];steps:BoundStep[];finalProof:string;events:StudioEvent[];checker:PermutationCheckerResult;
  observations:{expired:boolean;liveReady:boolean;exportDigest:string;exportBytes:number};
  lineage:{annotationDigest:string;renderingDigest:string;archivedDigest:string;archivedBytes:number;eventCut:string};
}
export type StudioResult={status:"ready";model:StudioModel}|{status:"empty"|"unavailable"|"corrupt"|"out-of-scope"};
export class StudioRefusal extends Error {constructor(){super("STUDIO_INTEGRITY_REFUSED");}}
function fail():never {throw new StudioRefusal();}
const sha=z.string().regex(/^[a-f0-9]{64}$/),uuid=z.string().uuid();
const bindingSchema=z.object({runId:uuid,missionId:uuid,organizationId:uuid,workspaceId:uuid,actorUserId:z.string().min(1).max(200),sourceDigest:sha,taskDigest:sha,provenance:z.literal("CODEX_ASSISTED")}).strict();
const eventSchema=bindingSchema.extend({sequence:z.number().int().min(1).max(11),previousDigest:sha.nullable(),commandId:uuid,kind:z.enum(["DRAFT","START","ROLE_RESERVED","IMPORT_RETAINED","REVOKED","CHECKED"]),at:z.string().max(40),detail:z.record(z.string(),z.unknown()),eventDigest:sha}).strict();
const artifactSchema=z.object({role:z.enum(roles),digest:sha,bytes:z.number().int().min(1).max(131072),base64:z.string().max(174764).regex(/^[A-Za-z0-9+/]*={0,2}$/)});
const exportSchema=z.object({schema:z.literal("hive-os.permutation-bridge.v1"),binding:bindingSchema,events:z.array(eventSchema).length(11),state:z.unknown(),failed:z.array(z.unknown()).length(0),sourceBundle:z.unknown(),originals:z.array(artifactSchema.extend({accepted:z.literal(true),text:z.string().max(32768)}).strict()).length(4),prompts:z.array(artifactSchema.strict()).length(4),currentPrompt:z.null(),expired:z.boolean(),liveReady:z.boolean(),checker:z.unknown(),task:z.unknown()});

/** Byte-bound duplicate-key/depth admission. Numbers may include retained observational fractions. */
function parseExport(body:string):unknown {
  if(body.length>1048576||Buffer.byteLength(body)>1048576)fail();
  const stack:(Set<string>|null)[]=[];
  for(let i=0;i<body.length;i++){
    const ch=body[i];
    if(ch==='"'){
      const start=i;for(i++;i<body.length;i++){if(body[i]==="\\")i++;else if(body[i]==='"')break;}
      if(i>=body.length)fail();let next=i+1;while(/\s/.test(body[next]??""))next++;
      if(body[next]===":"){const key=JSON.parse(body.slice(start,i+1)) as string,object=stack.at(-1);if(!object||object.has(key)||object.size>=256||["__proto__","constructor","prototype"].includes(key))fail();object.add(key);}
    }else if(ch==="{"||ch==="["){if(stack.length>=20)fail();stack.push(ch==="{"?new Set():null);}
    else if(ch==="}"||ch==="]")stack.pop();
  }
  assertExportBytesSafe(Buffer.from(body));return JSON.parse(body);
}
function decode(a:z.infer<typeof artifactSchema>,maximum:number):string {
  if(a.bytes>maximum||a.base64.length>Math.ceil(maximum/3)*4)fail();
  const bytes=Buffer.from(a.base64,"base64");if(bytes.length!==a.bytes||bytes.toString("base64")!==a.base64||hashBytes(bytes)!==a.digest)fail();
  assertExportBytesSafe(bytes);return new TextDecoder("utf-8",{fatal:true,ignoreBOM:true}).decode(bytes);
}
export function bindEditorialSteps(rawFinal:string,proof:string,steps:readonly EditorialStep[]=editorialSteps):BoundStep[] {
  if(digest({anchor:studioAnchor,pins:rolePins,steps})!==annotationDigest||hashBytes(rawFinal)!==studioAnchor.finalDigest||Buffer.byteLength(rawFinal)!==studioAnchor.finalBytes)fail();
  const raw=Buffer.from(rawFinal);
  return steps.map(step=>{
    const start=proof.indexOf(step.quoteStart),end=proof.indexOf(step.quoteEnd,start);
    if(start<0||end<start||proof.indexOf(step.quoteStart,start+1)!==-1)fail();
    const quote=JSON.stringify(proof.slice(start,end+step.quoteEnd.length)).slice(1,-1),bytes=Buffer.from(quote),offset=raw.indexOf(bytes);
    if(offset<0||raw.indexOf(bytes,offset+1)!==-1)fail();
    return {...step,reference:{role:"FINAL",digest:studioAnchor.finalDigest,bytes:studioAnchor.finalBytes,startByte:offset,endByte:offset+bytes.length,quote,quoteDigest:hashBytes(bytes),runId:studioAnchor.runId,sourceDigest:studioAnchor.sourceDigest,taskDigest:studioAnchor.taskDigest,eventCut:`${studioAnchor.sequence}:${studioAnchor.eventDigest}`}};
  });
}
/** Pure projection of authorized export bytes; never accepts a path, URL, grant or model output. */
export function projectStudio(body:string,expectedMissionId:string):StudioModel {
  try{
    const p=exportSchema.parse(parseExport(body)),b=p.binding as Binding;
    if(b.runId!==studioAnchor.runId||b.missionId!==studioAnchor.missionId||b.missionId!==expectedMissionId||b.sourceDigest!==studioAnchor.sourceDigest||b.taskDigest!==studioAnchor.taskDigest||digest(p.task)!==b.taskDigest||digest(task)!==b.taskDigest||digest(p.sourceBundle)!==b.sourceDigest)fail();
    const state=project(b,p.events as LedgerEvent[]),last=p.events.at(-1)!;
    if(last.eventDigest!==studioAnchor.eventDigest||state.status!=="COMPLETED"||digest(state)!==digest(p.state)||digest(state.checker)!==digest(p.checker)||!state.checker||!state.startedAt)fail();
    const originals=roles.map(role=>{
      const original=p.originals.filter(o=>o.role===role),prompt=p.prompts.filter(o=>o.role===role),stage=state.stages.find(s=>s.role===role),pin=rolePins[role];
      if(original.length!==1||prompt.length!==1||!stage?.original||original[0].digest!==pin.digest||original[0].bytes!==pin.bytes||stage.original.digest!==pin.digest||stage.original.bytes!==pin.bytes||prompt[0].digest!==pin.promptDigest||stage.promptDigest!==pin.promptDigest)fail();
      const text=decode(original[0],32768),promptText=decode(prompt[0],131072);
      if(text!==original[0].text)fail();
      const reserved=p.events.find(e=>e.kind==="ROLE_RESERVED"&&e.detail.role===role),ref=reserved?.detail.prompt as {digest?:unknown;bytes?:unknown}|undefined;
      if(!ref||ref.digest!==prompt[0].digest||ref.bytes!==prompt[0].bytes)fail();
      return {role,digest:pin.digest,bytes:pin.bytes,text,prompt:{digest:prompt[0].digest,bytes:prompt[0].bytes,text:promptText}};
    });
    const rawFinal=originals.find(o=>o.role==="FINAL")!.text;
    const final=z.object({proof:z.string().min(1).max(32768),certificate:z.object({version:z.literal(1),kind:z.literal("EXPECTED_INVERSE_DESCENT_FLOOR"),n:z.literal("1000000000000"),floor:z.literal("499999999972")}).strict()}).strict().parse(JSON.parse(rawFinal));
    const checker=state.checker;
    if(!checker.binding||checker.status!=="SUPPORTED_UNDER_LEMMA_ARITHMETIC"||checker.candidateDigest!==studioAnchor.finalDigest||checker.binding.runId!==b.runId||checker.binding.taskDigest!==b.taskDigest||checker.binding.sourceBundleDigest!==b.sourceDigest||checker.binding.finalDigest!==studioAnchor.finalDigest||checker.certificateDigest!==digest(final.certificate)||checker.claimedFloor!=="499999999972"||checker.arithmetic?.derivedFloor!=="499999999972")fail();
    const steps=bindEditorialSteps(rawFinal,final.proof),eventCut=`${last.sequence}:${last.eventDigest}`;
    return {runId:b.runId,missionId:b.missionId,sourceDigest:b.sourceDigest,taskDigest:b.taskDigest,title:task.title,statement:task.statement,sourceUrl:task.source,process:"COMPLETED",provenance:"CODEX_ASSISTED",proofStatus:"NON_FORMAL",startedAt:state.startedAt,completedAt:last.at,originals,steps,finalProof:final.proof,
      events:p.events.map(e=>({sequence:e.sequence,kind:e.kind,at:e.at,digest:e.eventDigest,role:roles.includes(e.detail.role as Role)?e.detail.role as Role:null,originalDigest:e.kind==="IMPORT_RETAINED"?(e.detail.original as {digest:string}).digest:null,promptDigest:e.kind==="ROLE_RESERVED"?String(e.detail.promptDigest):null})),checker,
      observations:{expired:p.expired,liveReady:p.liveReady,exportDigest:hashBytes(body),exportBytes:Buffer.byteLength(body)},lineage:{annotationDigest,renderingDigest:digest({version:1,annotationDigest,finalDigest:studioAnchor.finalDigest,eventCut,steps}),archivedDigest:studioAnchor.archivedDigest,archivedBytes:studioAnchor.archivedBytes,eventCut}};
  }catch{throw new StudioRefusal();}
}
