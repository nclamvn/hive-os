import { randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { executeDurableCommand } from "@/modules/command-runtime";
import { organizationIdForWorkspace, requireWorkspaceAuthorization } from "@/modules/authorization";
import type { WorkspaceContext } from "@/modules/identity-workspace";
import { withOrganizationTenant } from "@/server/tenant-context";
import { initialShowcaseState, poly19Task, showcaseDigest, showcaseJobType, showcaseLimits, ShowcaseRefusal,
  type Poly19ShowcaseDossier } from "./contracts";
import { assertShowcaseEnvironment, isShowcaseAvailable, loadShowcaseBundle } from "./source";
import { newShowcaseEpoch, requireNativeShowcaseAuthority } from "./authority";
import { appendShowcaseEvent, loadShowcaseCut, lockShowcase, projectShowcaseView, readShowcaseBytes } from "./store";

const requestSchema=z.object({missionId:z.string().min(1).max(200),idempotencyKey:z.string().min(1).max(200),confirmed:z.literal(true),provenance:z.enum(["ENGINEERING_ONLY","LIVE_NATIVE"])}).strict();
export { isShowcaseAvailable };
export async function getPoly19Readiness(ctx:WorkspaceContext,missionId:string) {
  if(!isShowcaseAvailable())return {available:false,engineeringReady:false,nativeReady:false,nativeBlockedReason:"CONTAINMENT_UNESTABLISHED",sourceReady:false} as const;
  await requireWorkspaceAuthorization(ctx,"research.request",missionId);
  try {await loadShowcaseBundle();return {available:true,engineeringReady:true,nativeReady:false,nativeBlockedReason:"CONTAINMENT_UNESTABLISHED",sourceReady:true} as const;}
  catch {return {available:true,engineeringReady:false,nativeReady:false,nativeBlockedReason:"CONTAINMENT_UNESTABLISHED",sourceReady:false} as const;}
}
export async function requestPoly19Showcase(ctx:WorkspaceContext,raw:unknown) {
  assertShowcaseEnvironment();const input=requestSchema.parse(raw);
  await requireWorkspaceAuthorization(ctx,"research.request",input.missionId);
  // No live permit exists in this release. Refuse before source reservation,
  // new aggregate, outbox or transport effects, even from a forged POST.
  if(input.provenance==="LIVE_NATIVE")requireNativeShowcaseAuthority();
  const bundle=await loadShowcaseBundle();
  if(!bundle.allowedProvenance.includes(input.provenance))throw new ShowcaseRefusal("SOURCE","Reviewed purpose refuses this provenance");
  const outcome=await executeDurableCommand(ctx,{commandType:"research.showcase.poly19.approve",idempotencyKey:input.idempotencyKey,requiredCapability:"research.request",missionId:input.missionId,
    payload:{missionId:input.missionId,taskDigest:showcaseDigest(poly19Task),sourceBundleDigest:bundle.digest,provenance:input.provenance,limitsDigest:showcaseDigest(showcaseLimits),confirmed:true}},async(tx,command)=>{
    const mission=await tx.mission.findFirst({where:{id:input.missionId,workspaceId:command.workspaceId}});
    if(!mission)throw new ShowcaseRefusal("AUTHORITY","Scoped mission required");
    const now=new Date(),id=randomUUID(),authorityEpoch=newShowcaseEpoch(),state=initialShowcaseState(authorityEpoch,now);
    let row=await tx.researchShowcaseRun.create({data:{id,organizationId:command.organizationId,workspaceId:command.workspaceId,missionId:input.missionId,commandId:command.commandId,
      actorUserId:command.actorUserId,provenance:input.provenance,taskDigest:showcaseDigest(poly19Task),sourceBundleDigest:bundle.digest,authorityEpoch,
      state:state as unknown as Prisma.InputJsonObject,stateDigest:showcaseDigest(state),createdAt:now}});
    row=await appendShowcaseEvent(tx,row,"APPROVED",`${id}:approved`,{actorUserId:command.actorUserId,confirmed:true,limits:showcaseLimits,
      organizationId:command.organizationId,workspaceId:command.workspaceId,missionId:input.missionId,commandId:command.commandId,
      taskDigest:row.taskDigest,sourceBundleDigest:bundle.digest,authorityEpoch,
      sourceBundle:bundle.manifest,sourcePreflightReadBytes:bundle.readBytes,provenance:input.provenance});
    return {outcome:{runId:id,version:row.version},outbox:[{topic:showcaseJobType,aggregateType:"ResearchShowcaseRun",aggregateId:id,payload:{runId:id,authorityEpoch}}]};
  });
  if(outcome.status!=="SUCCEEDED" || !z.string().uuid().safeParse(outcome.outcome.runId).success)throw new ShowcaseRefusal("AUTHORITY","Authenticated showcase approval refused");
  return {runId:outcome.outcome.runId as string,version:Number(outcome.outcome.version),status:outcome.status,outboxEventIds:outcome.outboxEventIds};
}
export async function getPoly19Showcase(ctx:WorkspaceContext,runId:string) {
  assertShowcaseEnvironment();z.string().uuid().parse(runId);await requireWorkspaceAuthorization(ctx,"research.read");
  const org=await organizationIdForWorkspace(ctx.workspace.id);
  return withOrganizationTenant(org,ctx.user.id,async tx=>{
    const row=await lockShowcase(tx,org,runId,true);if(row.workspaceId!==ctx.workspace.id)throw new ShowcaseRefusal("AUTHORITY","Run unavailable in workspace");
    await requireWorkspaceAuthorization(ctx,"research.read",row.missionId);
    return projectShowcaseView(await loadShowcaseCut(tx,row));
  });
}
export async function listPoly19Showcases(ctx:WorkspaceContext,missionId?:string) {
  assertShowcaseEnvironment();await requireWorkspaceAuthorization(ctx,"research.read",missionId);
  const org=await organizationIdForWorkspace(ctx.workspace.id);
  return withOrganizationTenant(org,ctx.user.id,async tx=>{
    const rows=await tx.researchShowcaseRun.findMany({where:{organizationId:org,workspaceId:ctx.workspace.id,...missionId?{missionId}:{}},orderBy:[{createdAt:"desc"},{id:"desc"}],take:20});
    const views=[];for(const row of rows){const held=await lockShowcase(tx,org,row.id,true);await requireWorkspaceAuthorization(ctx,"research.read",held.missionId);views.push(await projectShowcaseView(await loadShowcaseCut(tx,held)));}return views;
  });
}
export async function revokePoly19Showcase(ctx:WorkspaceContext,raw:unknown) {
  assertShowcaseEnvironment();const input=z.object({runId:z.string().uuid(),expectedVersion:z.number().int().positive(),idempotencyKey:z.string().min(1).max(200)}).strict().parse(raw);
  await requireWorkspaceAuthorization(ctx,"research.review");
  const outcome=await executeDurableCommand(ctx,{commandType:"research.showcase.poly19.revoke",idempotencyKey:input.idempotencyKey,requiredCapability:"research.review",expectedVersion:input.expectedVersion,
    payload:{runId:input.runId,expectedVersion:input.expectedVersion}},async(tx,command)=>{
    const row=await lockShowcase(tx,command.organizationId,input.runId);
    if(row.workspaceId!==command.workspaceId || row.version!==input.expectedVersion || row.revokedAt)throw new ShowcaseRefusal("AUTHORITY","Revocation binding changed");
    await requireWorkspaceAuthorization(ctx,"research.review",row.missionId);
    const updated=await appendShowcaseEvent(tx,row,"REVOKED",`${row.id}:revoked`,{actorUserId:ctx.user.id,reason:"AUTHORITY_REVOKED"});
    return {outcome:{runId:row.id,version:updated.version},outbox:[{topic:"research.showcase.poly19.revoked",aggregateType:"ResearchShowcaseRun",aggregateId:row.id,
      payload:{runId:row.id,version:updated.version}}]};
  });
  const admitted=outcome.status==="SUCCEEDED"?z.object({runId:z.string().uuid(),version:z.number().int().positive()}).strict().safeParse(outcome.outcome):null;
  if(!admitted?.success || admitted.data.runId!==input.runId || admitted.data.version!==input.expectedVersion+1 || outcome.outboxEventIds.length!==1)throw new ShowcaseRefusal("AUTHORITY","Authenticated showcase revocation refused");
  return outcome;
}
export async function getPoly19ShowcaseDossier(ctx:WorkspaceContext,runId:string):Promise<Poly19ShowcaseDossier> {
  assertShowcaseEnvironment();z.string().uuid().parse(runId);await requireWorkspaceAuthorization(ctx,"research.read");
  const org=await organizationIdForWorkspace(ctx.workspace.id);
  return withOrganizationTenant(org,ctx.user.id,async tx=>{
    const row=await lockShowcase(tx,org,runId,true);if(row.workspaceId!==ctx.workspace.id)throw new ShowcaseRefusal("AUTHORITY","Dossier unavailable in workspace");
    await requireWorkspaceAuthorization(ctx,"research.read",row.missionId);
    const cut=await loadShowcaseCut(tx,row),view=await projectShowcaseView(cut);
    const approval=cut.events[0]?.payload as unknown as {detail:{sourceBundle:unknown}};
    const sourceBundle=approval?.detail.sourceBundle as Poly19ShowcaseDossier["sourceBundle"];
    if(!sourceBundle || showcaseDigest(sourceBundle)!==row.sourceBundleDigest)throw new ShowcaseRefusal("INTEGRITY","Retained source manifest binding changed");
    const traces:Poly19ShowcaseDossier["traces"]=[];
    for(const record of cut.state.roles)if(record.trace){const bytes=await readShowcaseBytes(row,record.trace,`${record.role}.trace.jsonl`,showcaseLimits.traceBytes);traces.push({role:record.role,digest:record.trace.digest,bytes:bytes.length,base64:Buffer.from(bytes).toString("base64"),complete:record.traceComplete});}
    const incompleteOriginals:Poly19ShowcaseDossier["incompleteOriginals"]=[];
    for(const record of cut.state.roles)if(record.original&&!record.originalComplete){const bytes=await readShowcaseBytes(row,record.original,`${record.role}.original.txt`,showcaseLimits.originalBytes);incompleteOriginals.push({role:record.role,digest:record.original.digest,bytes:bytes.length,base64:Buffer.from(bytes).toString("base64"),complete:false});}
    const dossier={view,sourceBundle,eventPayloads:cut.events.map(e=>({sequence:e.sequence,payload:e.payload as unknown as {state:typeof cut.state;detail:Record<string,unknown>}})),traces,incompleteOriginals};
    if(Buffer.byteLength(JSON.stringify(dossier))>4194304)throw new ShowcaseRefusal("RESOURCE","Dossier export ceiling");return dossier;
  });
}
