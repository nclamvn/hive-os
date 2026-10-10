import type {CommandRecord} from "@prisma/client";
import {z} from "zod";
import type {TenantTransaction} from "@/server/tenant-context";
import {getObjectStorage} from "@/server/storage";
import {BridgeRefusal,digest,eventDigest,hashBytes,id,sha,task,limits,project,originalText,type Binding,type LedgerEvent,type Kind,type State,type Original} from "./contracts";
import {manifestSchema,assertPrivateStorage} from "./source";
import {canonicalJson} from "@/modules/execution-fabric/contracts";
import {boundedJson} from "@/modules/research-sandbox/research-core-v3/bounded-json";

export const commandPrefix="permutation.bridge.080.";
export const observedTopic="permutation.bridge.080.observed";
export interface Cut {binding:Binding;events:LedgerEvent[];state:State;failed:{commandId:string;kind:string;code:string|null}[];source:z.infer<typeof manifestSchema>}
const eventSchema=z.object({runId:id,organizationId:id,workspaceId:id,missionId:z.string().min(1).max(200),actorUserId:z.string().min(1).max(200),sourceDigest:sha,taskDigest:sha,provenance:z.literal("CODEX_ASSISTED"),sequence:z.number().int().min(1).max(64),previousDigest:sha.nullable(),commandId:id,kind:z.enum(["DRAFT","START","ROLE_RESERVED","IMPORT_RETAINED","REVOKED","CHECKED"]),at:z.string().max(40),detail:z.record(z.string(),z.unknown()),eventDigest:sha}).strict();
function fail():never{throw new BridgeRefusal("INTEGRITY");}
export function makeEvent(binding:Binding,events:LedgerEvent[],commandId:string,kind:Kind,detail:Record<string,unknown>,now=new Date()):LedgerEvent {
  const body={...binding,sequence:events.length+1,previousDigest:events.at(-1)?.eventDigest??null,commandId,kind,at:now.toISOString(),detail};
  return {...body,eventDigest:eventDigest(body)};
}
export async function lockRoot(tx:TenantTransaction,org:string,runId:string,shared=false) {
  id.parse(runId);
  if(shared)await tx.$queryRaw`SELECT id FROM command_record WHERE organization_id=${org} AND id=${runId} FOR SHARE`;
  else await tx.$queryRaw`SELECT id FROM command_record WHERE organization_id=${org} AND id=${runId} FOR UPDATE`;
  const row=await tx.commandRecord.findFirst({where:{id:runId,organizationId:org,commandType:commandPrefix+"DRAFT",status:"SUCCEEDED"}});
  if(!row)throw new BridgeRefusal("AUTHORITY");return row;
}
export async function loadCut(tx:TenantTransaction,root:CommandRecord,current?:{commandId:string;kind:Kind}):Promise<Cut> {
  const first=eventSchema.parse((root.outcome as {event?:unknown})?.event),binding:Binding={runId:first.runId,organizationId:first.organizationId,workspaceId:first.workspaceId,missionId:first.missionId,actorUserId:first.actorUserId,sourceDigest:first.sourceDigest,taskDigest:first.taskDigest,provenance:first.provenance};
  if(binding.runId!==root.id||binding.taskDigest!==digest(task)||root.commandType!==commandPrefix+"DRAFT"||root.status!=="SUCCEEDED")fail();
  const sourceText=first.detail.sourceBundleText;
  if(typeof sourceText!=="string"||sourceText.length>32768||Buffer.byteLength(sourceText,"utf8")>32768||first.detail.sourceBundle!==undefined)fail();
  const source=manifestSchema.parse(boundedJson(sourceText,6*32768));if(canonicalJson(source)!==sourceText||digest(source)!==binding.sourceDigest)fail();
  const rows=await tx.commandRecord.findMany({where:{organizationId:root.organizationId,workspaceId:root.workspaceId,actorUserId:root.actorUserId,commandType:{startsWith:commandPrefix},OR:[{id:root.id},{payload:{path:["runId"],equals:root.id}}]},take:limits.ledgerRecords+1,orderBy:[{createdAt:"asc"},{id:"asc"}],include:{outboxEvents:{take:21}}});
  if(rows.length>limits.ledgerRecords||!rows.some(r=>r.id===root.id))fail();
  const events:LedgerEvent[]=[],failed:Cut["failed"]=[];let currentFound=false;
  for(const row of rows) {
    if(current&&row.id===current.commandId) {
      const payload=row.payload as Record<string,unknown>;
      if(row.status!=="PROCESSING"||row.commandType!==commandPrefix+current.kind||row.actorUserId!==binding.actorUserId||row.organizationId!==binding.organizationId||row.workspaceId!==binding.workspaceId||payload.runId!==root.id||payload.missionId!==binding.missionId||payload.sourceDigest!==binding.sourceDigest||payload.taskDigest!==binding.taskDigest||payload.provenance!=="CODEX_ASSISTED"||digest(payload)!==row.payloadHash||row.outboxEvents.length)fail();
      currentFound=true;continue;
    }
    if(row.status==="FAILED"){failed.push({commandId:row.id,kind:row.commandType,code:row.errorCode});continue;}
    if(row.status!=="SUCCEEDED")fail();
    const e=eventSchema.parse((row.outcome as {event?:unknown})?.event),payload=row.payload as Record<string,unknown>;
    if(e.commandId!==row.id||row.organizationId!==binding.organizationId||row.workspaceId!==binding.workspaceId||row.actorUserId!==binding.actorUserId||row.commandType!==commandPrefix+e.kind||digest(payload)!==row.payloadHash||payload.taskDigest!==binding.taskDigest||payload.sourceDigest!==binding.sourceDigest||payload.missionId!==binding.missionId||payload.provenance!=="CODEX_ASSISTED")fail();
    if(e.kind!=="DRAFT"&&(payload.runId!==root.id||payload.expectedSequence!==e.sequence-1||payload.expectedDigest!==e.previousDigest))fail();
    if(e.kind==="ROLE_RESERVED"||e.kind==="IMPORT_RETAINED")if(payload.role!==e.detail.role)fail();
    if(e.kind==="IMPORT_RETAINED"&&payload.importDigest!==(e.detail.original as Original)?.digest)fail();
    if(e.kind==="IMPORT_RETAINED"){const original=e.detail.original as Original;
      if(payload.declaredModel!==original.model||payload.declaredThread!==original.thread||payload.freshContextAttested!==original.freshContextAttested)fail();}
    const at=Date.parse(e.at);if(!Number.isFinite(at)||new Date(at).toISOString()!==e.at||at<row.createdAt.getTime()||!row.completedAt||at>row.completedAt.getTime())fail();
    const outbox=row.outboxEvents;
    if(outbox.length!==1||outbox[0].topic!==observedTopic||outbox[0].aggregateType!=="PermutationBridge"||outbox[0].aggregateId!==root.id||outbox[0].organizationId!==binding.organizationId||outbox[0].workspaceId!==binding.workspaceId||digest(outbox[0].payload)!==digest({runId:root.id,eventDigest:e.eventDigest,sequence:e.sequence}))fail();
    events.push(e);
  }
  if(current&&!currentFound)fail();events.sort((a,b)=>a.sequence-b.sequence);const state=project(binding,events);
  // Failed retained-transfer/check commands remain visible and prohibit blind
  // continuation. Stale/duplicate pre-effect commands cannot erase originals.
  if(failed.some(f=>f.kind===commandPrefix+"IMPORT_RETAINED"||f.kind===commandPrefix+"CHECKED")&&state.status==="RUNNING"){state.status="STOPPED";state.reason="Failed import/check command; no automatic retry.";}
  return {binding,events,state,failed,source};
}
export async function putOriginal(binding:Binding,role:string,bytes:Uint8Array) {
  return putArtifact(binding,role,bytes,limits.originalBytes);
}
export async function putArtifact(binding:Binding,role:string,bytes:Uint8Array,max:number) {
  if(bytes.length<1||bytes.length>max)throw new BridgeRefusal("RESOURCE");await assertPrivateStorage();
  const seal=hashBytes(bytes),key=`${binding.organizationId}/permutation-080/${binding.runId}/${role}/${seal}.txt`,storage=getObjectStorage();
  const existing=await storage.get(key,{maxBytes:max});
  if(existing){if(existing.length!==bytes.length||hashBytes(existing)!==seal||!Buffer.from(existing).equals(Buffer.from(bytes)))fail();}
  else await storage.put(key,bytes,{contentType:"text/plain; charset=utf-8"});
  const retained=await storage.get(key,{maxBytes:max});if(!retained||retained.length!==bytes.length||hashBytes(retained)!==seal)fail();
  return {key,digest:seal,bytes:bytes.length};
}
export async function readOriginal(binding:Binding,role:string,original:Original):Promise<Uint8Array> {
  return readArtifact(binding,role,original,limits.originalBytes);
}
export async function readArtifact(binding:Binding,role:string,original:{key:string;digest:string;bytes:number},max:number):Promise<Uint8Array> {
  const expected=`${binding.organizationId}/permutation-080/${binding.runId}/${role}/${original.digest}.txt`;
  if(original.key!==expected||original.bytes<1||original.bytes>max)fail();await assertPrivateStorage();
  const bytes=await getObjectStorage().get(expected,{maxBytes:max});if(!bytes||bytes.length!==original.bytes||hashBytes(bytes)!==original.digest)fail();return bytes;
}
export async function admittedTexts(cut:Cut) {
  const prior=[];for(const stage of cut.state.stages){if(!stage.original?.accepted)break;const bytes=await readOriginal(cut.binding,stage.role,stage.original);prior.push({role:stage.role,text:originalText(bytes),digest:stage.original.digest});}return prior;
}
