import { randomUUID, createHash } from "node:crypto";
import { type ResearchShowcaseRun } from "@prisma/client";
import { claimJobs, failJob } from "@/modules/command-runtime/jobs";
import { dispatchOutboxBatch } from "@/modules/command-runtime/kernel";
import { authorize } from "@/modules/authorization";
import { withOrganizationTenant, type TenantTransaction } from "@/server/tenant-context";
import { showcaseJobType, ShowcaseRefusal, showcaseLimits, showcaseDigest, parseShowcaseRole, buildShowcasePrompt,
  type ShowcaseRole, type ShowcaseState, type ShowcaseArtifact } from "@/modules/research-showcase/contracts";
import { assertShowcaseEnvironment, loadShowcaseBundle } from "@/modules/research-showcase/source";
import { issueShowcaseTransportPermit, requireNativeShowcaseAuthority } from "@/modules/research-showcase/authority";
import { appendShowcaseEvent, loadShowcaseCut, lockShowcase, readShowcaseArtifact, putShowcaseArtifact, putShowcaseBytes } from "@/modules/research-showcase/store";
import { engineeringShowcaseTransport, executeEngineeringShowcaseQa, assertEngineeringQaFault, type EngineeringQaFault } from "@/modules/research-showcase/engineering";
import { verifyPoly19Certificate, makePoly19Fault } from "@/modules/research-showcase/checker";

export interface ShowcaseWorkerInput { organizationId:string;actorUserId:string;workerId:string;jobId:string;expectedVersion:number;
  /** Host-only VITEST controls; never accepted by service/UI/HTTP/launcher. */
  engineeringFault?:EngineeringQaFault;
  onBoundary?:(boundary:"BEFORE_START"|"AFTER_START"|"AFTER_RESULT"|"AFTER_CHECK",role?:ShowcaseRole)=>Promise<void> }
type Held={tx:TenantTransaction;row:ResearchShowcaseRun;state:ShowcaseState;attemptNumber:number};
async function mutate<T>(input:ShowcaseWorkerInput,operation:(h:Held)=>Promise<T>,failureObservationOnly=false):Promise<T> {
  return withOrganizationTenant(input.organizationId,input.actorUserId,async tx=>{
    await tx.$queryRaw`SELECT id FROM durable_job WHERE organization_id=${input.organizationId} AND id=${input.jobId} FOR UPDATE`;
    const job=await tx.durableJob.findFirst({where:{id:input.jobId,organizationId:input.organizationId,jobType:showcaseJobType,status:"RUNNING",lockedBy:input.workerId,version:input.expectedVersion,leaseExpiresAt:{gt:new Date()}}});
    if(!job)throw new ShowcaseRefusal("AUTHORITY","Current worker lease/version refused");
    const p=job.payload as {runId?:unknown;authorityEpoch?:unknown};if(typeof p.runId!=="string")throw new ShowcaseRefusal("INTEGRITY","Job binding missing");
    const row=await lockShowcase(tx,input.organizationId,p.runId),cut=await loadShowcaseCut(tx,row);
    if(job.workspaceId!==row.workspaceId || p.authorityEpoch!==row.authorityEpoch || row.actorUserId!==input.actorUserId)throw new ShowcaseRefusal("INTEGRITY","Run/job/actor authority binding changed");
    const outbox=job.outboxEventId?await tx.outboxEvent.findFirst({where:{id:job.outboxEventId,organizationId:row.organizationId,workspaceId:row.workspaceId,commandId:row.commandId,
      topic:showcaseJobType,aggregateType:"ResearchShowcaseRun",aggregateId:row.id,status:"DISPATCHED"}}):null;
    const expectedPayload={runId:row.id,authorityEpoch:row.authorityEpoch};
    if(!outbox || showcaseDigest(outbox.payload)!==showcaseDigest(expectedPayload) || showcaseDigest(job.payload)!==showcaseDigest(expectedPayload))throw new ShowcaseRefusal("INTEGRITY","Approved outbox/job lineage changed");
    if(!failureObservationOnly) {
      if(row.revokedAt)throw new ShowcaseRefusal("AUTHORITY","Run revoked");
      const member=await hActiveMembership(tx,row,input.actorUserId);
      if(!member)throw new ShowcaseRefusal("AUTHORITY","Current active workspace membership required");
      const permission=await authorize(input.actorUserId,"research.request",{organizationId:row.organizationId,workspaceId:row.workspaceId,missionId:row.missionId});
      if(!permission.allowed)throw new ShowcaseRefusal("AUTHORITY","Current scoped execution permission refused");
    }
    return operation({tx,row,state:cut.state,attemptNumber:job.attempts});
  });
}
async function hActiveMembership(tx:TenantTransaction,row:ResearchShowcaseRun,userId:string) {
  return tx.membership.findFirst({where:{workspaceId:row.workspaceId,userId,status:"ACTIVE",workspace:{organizationId:row.organizationId,status:"ACTIVE"}},select:{id:true}});
}
async function validateSource(input:ShowcaseWorkerInput) {
  const row=await mutate(input,async h=>{assertDeadline(h.state);await appendShowcaseEvent(h.tx,h.row,"SOURCE_RESERVED",`${h.row.id}:source:${h.row.sequence+1}`,{},input.jobId);return h.row;});
  const bundle=await loadShowcaseBundle();if(bundle.digest!==row.sourceBundleDigest || !bundle.allowedProvenance.includes(row.provenance as "ENGINEERING_ONLY"))throw new ShowcaseRefusal("SOURCE","Reviewed execution source changed");return bundle;
}
function deadline(state:ShowcaseState,role:ShowcaseRole) {
  const phase=role==="POSTREVIEW"?state.reviewDeadlineAt ?? new Date(Date.now()+showcaseLimits.reviewMilliseconds).toISOString():state.solvingDeadlineAt;
  return new Date(Math.min(Date.parse(phase),Date.parse(state.deadlineAt))).toISOString();
}
function assertDeadline(state:ShowcaseState,role?:ShowcaseRole) {
  if(Date.now()>=Date.parse(role?deadline(state,role):state.deadlineAt))throw new ShowcaseRefusal("RESOURCE","Original run/phase deadline exhausted");
}
async function stop(input:ShowcaseWorkerInput,error:unknown) {
  return mutate(input,async h=>{
    const last=h.state.roles.at(-1),kind=error instanceof ShowcaseRefusal?error.code:"TRANSPORT";
    const unknown=last?.fence==="STARTED" || last?.remoteEffect==="UNKNOWN" || h.state.replayFence==="STARTED" || h.state.faultFence==="STARTED";
    const priorStopped=["COMPLETED","FAILED","RESOURCE_STOP","REVOKED","PAUSED_FOR_DECISION"].includes(h.state.status);
    const event=priorStopped?"OBSERVATION":unknown?"PAUSED":kind==="RESOURCE"?"RESOURCE_STOP":"FAILED";
    await appendShowcaseEvent(h.tx,h.row,event,`${h.row.id}:stop:${h.row.sequence+1}`,{reason:unknown?"START_OUTCOME_UNKNOWN":`${kind}_REFUSED`,failure:kind,remoteCancellation:"NOT_ESTABLISHED"},input.jobId);
    await h.tx.durableJob.update({where:{id:input.jobId},data:{status:"DEAD_LETTER",lockedBy:null,leaseExpiresAt:null,version:{increment:1},lastErrorCode:`SHOWCASE_${kind}`,lastErrorMessage:"A bounded local showcase stopped safely"}});
    await h.tx.durableJobEvent.create({data:{organizationId:h.row.organizationId,workspaceId:h.row.workspaceId,jobId:input.jobId,eventType:"DEAD_LETTERED",attemptNumber:h.attemptNumber,workerId:input.workerId,detail:{reason:kind,unknown}}});
    return {runId:h.row.id,status:priorStopped?h.state.status:unknown?"PAUSED_FOR_DECISION":kind==="RESOURCE"?"RESOURCE_STOP":"FAILED"};
  },true);
}
async function roleStage(input:ShowcaseWorkerInput,role:ShowcaseRole) {
  let h=await mutate(input,async h=>h);assertDeadline(h.state,role);
  if(h.state.roles.at(-1)?.role===role && h.state.roles.at(-1)?.fence==="STARTED")throw new ShowcaseRefusal("TRANSPORT","Unknown START is not repeat authority");
  await validateSource(input);h=await mutate(input,async h=>h);
  const prior=[];
  for(const r of h.state.roles.filter(r=>role!=="POSTREVIEW" || r.role==="FINAL"))if(r.fence==="RETAINED" && r.original)prior.push({role:r.role,original:await readShowcaseArtifact(h.row,r.original,`${r.role}.original.txt`,showcaseLimits.originalBytes)});
  const prompt=buildShowcasePrompt(role,prior,h.state.exactResult),promptDigest=showcaseDigest(prompt);
  if(h.state.roles.at(-1)?.role!==role) {
    await mutate(input,async h=>{assertDeadline(h.state,role);return appendShowcaseEvent(h.tx,h.row,"ROLE_RESERVED",`${h.row.id}:${role}:reserved`,{role,actionId:`${h.row.id}:${role}`,promptDigest,
      reviewDeadlineAt:role==="POSTREVIEW"?new Date(Math.min(Date.now()+showcaseLimits.reviewMilliseconds,Date.parse(h.state.deadlineAt))).toISOString():null},input.jobId);});
  }
  h=await mutate(input,async h=>h);const record=h.state.roles.at(-1)!;
  if(record.promptDigest!==promptDigest || record.fence!=="RESERVED")throw new ShowcaseRefusal("INTEGRITY","Reserved role material changed");
  await input.onBoundary?.("BEFORE_START",role);
  await mutate(input,async h=>{assertDeadline(h.state,role);return appendShowcaseEvent(h.tx,h.row,"ROLE_STARTED",`${h.row.id}:${role}:started`,{actionId:record.actionId,startedAt:new Date().toISOString()},input.jobId);});
  await input.onBoundary?.("AFTER_START",role);
  h=await mutate(input,async h=>h);const end=deadline(h.state,role),controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),Math.max(1,Date.parse(end)-Date.now())),started=performance.now();
  // Poll only the exact admitted row/job. Revocation rejects adoption even if
  // termination cannot establish that remote inference stopped.
  const watch=setInterval(()=>{void mutate(input,async()=>undefined).catch(()=>controller.abort());},500);
  try {
    const permit=issueShowcaseTransportPermit({runId:h.row.id,role,deadlineAt:end,authorityEpoch:h.row.authorityEpoch});
    const request={runId:h.row.id,role,prompt,deadlineAt:end,signal:controller.signal,permit};
    const result=input.engineeringFault!==undefined?await executeEngineeringShowcaseQa(request,input.engineeringFault):await engineeringShowcaseTransport.execute(request);
    await validateSource(input);await mutate(input,async h=>{assertDeadline(h.state,role);return undefined;});
    const originalUtf8=new TextEncoder().encode(result.rawOriginal),originalComplete=originalUtf8.length<=showcaseLimits.originalBytes,traceComplete=result.rawTrace.length<=showcaseLimits.traceBytes;
    // Oversize prefixes are explicitly incomplete failure artifacts, never
    // silently trimmed and adopted as the original final proof.
    const keptOriginal=originalUtf8.subarray(0,showcaseLimits.originalBytes);
    const original=await putShowcaseBytes(h.row,`${role}.original.txt`,keptOriginal,showcaseLimits.originalBytes);
    const trace=await putShowcaseBytes(h.row,`${role}.trace.jsonl`,result.rawTrace.subarray(0,showcaseLimits.traceBytes),showcaseLimits.traceBytes);
    await mutate(input,async h=>appendShowcaseEvent(h.tx,h.row,"ROLE_RETAINED",`${h.row.id}:${role}:retained`,{actionId:record.actionId,original,trace,
      originalComplete,traceComplete,observedOriginalBytes:originalUtf8.length,observedTraceBytes:result.rawTrace.length,threadId:result.threadId,usage:result.usage,
      actualModelVersion:result.actualModelVersion,returnedAt:new Date().toISOString(),elapsedMilliseconds:performance.now()-started,
      outcome:originalComplete&&traceComplete?result.outcome:"OVERSIZE",remoteEffect:result.remoteEffect,invocationStarted:result.invocationStarted},input.jobId));
    await input.onBoundary?.("AFTER_RESULT",role);
    if(!originalComplete || !traceComplete || controller.signal.aborted || result.outcome!=="COMPLETED" || result.remoteEffect==="UNKNOWN")throw new ShowcaseRefusal("TRANSPORT","Retained role did not complete its bounded known-effect contract");
    const parsed=parseShowcaseRole(role,result.rawOriginal);
    await mutate(input,async h=>appendShowcaseEvent(h.tx,h.row,"ROLE_VALIDATED",`${h.row.id}:${role}:validated`,{actionId:record.actionId,originalDigest:original.digest,parsedDigest:showcaseDigest(parsed)},input.jobId));
    if(role==="POSTREVIEW")await mutate(input,async h=>appendShowcaseEvent(h.tx,h.row,"POSTREVIEW_RETAINED",`${h.row.id}:postreview`,{review:parsed},input.jobId));
  }finally{clearTimeout(timer);clearInterval(watch);}
}
function certificateSeal(row:ResearchShowcaseRun,suffix:string,certificate:string):ShowcaseArtifact {
  return {key:`${row.workspaceId}/research-showcase/${row.id}/${suffix}`,digest:createHash("sha256").update(certificate,"utf8").digest("hex"),bytes:Buffer.byteLength(certificate)};
}
async function checkerStage(input:ShowcaseWorkerInput) {
  const bundle=await validateSource(input);let h=await mutate(input,async h=>h);assertDeadline(h.state);
  if([h.state.replayFence,h.state.faultFence].includes("STARTED"))throw new ShowcaseRefusal("TRANSPORT","Unfinished replay START is not retry authority");
  const final=h.state.roles.find(r=>r.role==="FINAL")!;
  if(!final?.original)throw new ShowcaseRefusal("INTEGRITY","Sealed original FINAL missing");
  const parsed=parseShowcaseRole("FINAL",await readShowcaseArtifact(h.row,final.original,"FINAL.original.txt",showcaseLimits.originalBytes));
  if(!("certificateJson" in parsed) || typeof parsed.certificateJson!=="string")throw new ShowcaseRefusal("SCHEMA","Exact original certificate missing");const certificate=parsed.certificateJson;
  if(h.state.replayFence!=="RETAINED") {
    if(h.state.replayFence==="NONE")await mutate(input,async h=>appendShowcaseEvent(h.tx,h.row,"REPLAY_RESERVED",`${h.row.id}:replay:reserved`,{certificate:certificateSeal(h.row,"FINAL.certificate.json",certificate),originalFinalDigest:final.original!.digest},input.jobId));
    await mutate(input,async()=>undefined);await putShowcaseArtifact(h.row,"FINAL.certificate.json",certificate,showcaseLimits.certificateBytes);
    await mutate(input,async h=>appendShowcaseEvent(h.tx,h.row,"REPLAY_STARTED",`${h.row.id}:replay:started`,{},input.jobId));
    const result=await guardedReplay(input,h.state,signal=>verifyPoly19Certificate(certificate,signal,new Date(Math.min(Date.now()+30000,Date.parse(h.state.deadlineAt))).toISOString(),bundle.sourcePins));
    await validateSource(input);await mutate(input,async h=>{assertDeadline(h.state);return appendShowcaseEvent(h.tx,h.row,"REPLAY_RETAINED",`${h.row.id}:replay:retained`,{result,checkerSourceDigest:bundle.sourcePins["scripts/research/frontiermath_poly19_verifier.py"],lemmaDigest:bundle.sourcePins["docs/research/FRONTIERMATH_POLY19_CERTIFICATE.md"]},input.jobId);});
    await input.onBoundary?.("AFTER_CHECK");
  }
  h=await mutate(input,async h=>h);
  if(h.state.faultFence!=="RETAINED") {
    if(h.state.faultFence==="NONE")await mutate(input,async h=>appendShowcaseEvent(h.tx,h.row,"FAULT_RESERVED",`${h.row.id}:fault:reserved`,{provenance:"ENGINEERING_ONLY",originalFinalDigest:final.original!.digest},input.jobId));
    await mutate(input,async h=>appendShowcaseEvent(h.tx,h.row,"FAULT_STARTED",`${h.row.id}:fault:started`,{},input.jobId));
    const end=new Date(Math.min(Date.now()+30000,Date.parse(h.state.deadlineAt))).toISOString();
    const result=await guardedReplay(input,h.state,async signal=>{
      const fault=await makePoly19Fault(certificate,signal,end,bundle.sourcePins);
      await mutate(input,async h=>appendShowcaseEvent(h.tx,h.row,"FAULT_CANDIDATE_RESERVED",`${h.row.id}:fault:candidate`,{certificate:certificateSeal(h.row,"FAULT.certificate.json",fault),provenance:"ENGINEERING_ONLY"},input.jobId));
      await mutate(input,async()=>undefined);await putShowcaseArtifact(h.row,"FAULT.certificate.json",fault,showcaseLimits.certificateBytes);
      return verifyPoly19Certificate(fault,signal,end,bundle.sourcePins);
    });
    await validateSource(input);await mutate(input,async h=>{assertDeadline(h.state);return appendShowcaseEvent(h.tx,h.row,"FAULT_RETAINED",`${h.row.id}:fault:retained`,{result,provenance:"ENGINEERING_ONLY"},input.jobId);});
  }
}
async function guardedReplay<T>(input:ShowcaseWorkerInput,state:ShowcaseState,operation:(signal:AbortSignal)=>Promise<T>) {
  assertDeadline(state);const controller=new AbortController(),end=Math.min(Date.now()+30000,Date.parse(state.deadlineAt));
  const timer=setTimeout(()=>controller.abort(),Math.max(1,end-Date.now()));
  const watch=setInterval(()=>{void mutate(input,async()=>undefined).catch(()=>controller.abort());},500);
  let abort=()=>{};
  try{const interrupted=new Promise<never>((_,reject)=>{abort=()=>reject(new ShowcaseRefusal("RESOURCE","Replay interrupted; outcome unknown"));controller.signal.addEventListener("abort",abort,{once:true});});
    const result=await Promise.race([operation(controller.signal),interrupted]);if(controller.signal.aborted || Date.now()>=end)throw new ShowcaseRefusal("RESOURCE","Replay allowance expired");return result;}
  finally{clearTimeout(timer);clearInterval(watch);controller.signal.removeEventListener("abort",abort);}
}
export async function executePoly19ShowcaseJob(input:ShowcaseWorkerInput) {
  assertShowcaseEnvironment();
  try {
    let h=await mutate(input,async h=>h);
    if(h.row.provenance!=="ENGINEERING_ONLY")requireNativeShowcaseAuthority();
    if(input.engineeringFault!==undefined)assertEngineeringQaFault(input.engineeringFault);
    await validateSource(input);
    for(let steps=0;steps<6;steps++) {
      h=await mutate(input,async h=>h);
      // Reconstruct admission from retained original bytes, never a model PASS
      // or a deserialized validation flag. Does not repeat provider work.
      for(const record of h.state.roles.filter(r=>r.fence==="RETAINED")) {
        if(!record.original || record.outcome!=="COMPLETED" || !record.originalComplete || !record.traceComplete || record.remoteEffect==="UNKNOWN")throw new ShowcaseRefusal("SCHEMA","Retained failed/incomplete/unknown-effect role cannot advance");
        const original=await readShowcaseArtifact(h.row,record.original,`${record.role}.original.txt`,showcaseLimits.originalBytes),parsed=parseShowcaseRole(record.role,original);
        if(!record.validated)await mutate(input,async h=>{assertDeadline(h.state,record.role);return appendShowcaseEvent(h.tx,h.row,"ROLE_VALIDATED",`${h.row.id}:${record.role}:validated`,{actionId:record.actionId,originalDigest:record.original!.digest,parsedDigest:showcaseDigest(parsed)},input.jobId);});
        if(record.role==="POSTREVIEW" && !h.state.postreview)await mutate(input,async h=>appendShowcaseEvent(h.tx,h.row,"POSTREVIEW_RETAINED",`${h.row.id}:postreview`,{review:parsed},input.jobId));
      }
      h=await mutate(input,async h=>h);
      if(h.state.status==="COMPLETED") {
        assertDeadline(h.state);
        await validateSource(input);
        await mutate(input,async h=>{assertDeadline(h.state);await h.tx.durableJob.update({where:{id:input.jobId},data:{status:"SUCCEEDED",result:{runId:h.row.id,status:h.state.status},completedAt:new Date(),lockedBy:null,leaseExpiresAt:null,version:{increment:1}}});
          await h.tx.durableJobEvent.create({data:{organizationId:h.row.organizationId,workspaceId:h.row.workspaceId,jobId:input.jobId,eventType:"SUCCEEDED",attemptNumber:h.attemptNumber,workerId:input.workerId,detail:{runId:h.row.id}}});});
        return {runId:h.row.id,status:"COMPLETED"};
      }
      if(["FAILED","RESOURCE_STOP","PAUSED_FOR_DECISION","REVOKED"].includes(h.state.status))throw new ShowcaseRefusal("AUTHORITY","Run stopped; no restart authority");
      assertDeadline(h.state);
      if(h.state.nextAction==="CHECK")await checkerStage(input);
      else if(h.state.nextAction!=="DONE")await roleStage(input,h.state.nextAction);
      else throw new ShowcaseRefusal("INTEGRITY","Missing terminal result");
    }
    throw new ShowcaseRefusal("RESOURCE","Fixed stage count exhausted");
  }catch(e){return stop(input,e);}
}
export async function runPoly19ShowcaseWorkerCycle(config:{organizationId:string;actorUserId:string;workerId:string;jobIds:readonly string[];outboxIds:readonly string[];onBoundary?:ShowcaseWorkerInput["onBoundary"]}) {
  assertShowcaseEnvironment();const dispatched=await dispatchOutboxBatch({organizationId:config.organizationId,actorUserId:config.actorUserId,workerId:`${config.workerId}:dispatch`,outboxIds:config.outboxIds});
  const jobs=await claimJobs({organizationId:config.organizationId,actorUserId:config.actorUserId,workerId:config.workerId,jobTypes:[showcaseJobType],jobIds:[...config.jobIds,...dispatched.jobIds],first:1,leaseSeconds:1000});
  const results=[];for(const job of jobs)try{results.push(await executePoly19ShowcaseJob({...config,jobId:job.id,expectedVersion:job.version}));}
    catch{await failJob({organizationId:config.organizationId,actorUserId:config.actorUserId,workerId:config.workerId,jobId:job.id,expectedVersion:job.version,errorCode:"SHOWCASE_LEASE_REFUSED",errorMessage:"A stale worker could not adopt",retryable:false}).catch(()=>undefined);}
  return {dispatched:dispatched.dispatched,claimed:jobs.length,results,workerCorrelationId:randomUUID()};
}
