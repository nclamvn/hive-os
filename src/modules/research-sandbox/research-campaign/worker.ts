import { randomUUID } from "node:crypto";
import { type ResearchCampaign } from "@prisma/client";
import { z } from "zod";
import { sha256 } from "@/modules/execution-fabric/contracts";
import { authorize } from "@/modules/authorization";
import { getObjectStorage } from "@/server/storage";
import { withOrganizationTenant, type TenantTransaction } from "@/server/tenant-context";
import { admitCandidate, applicableDomainMethods,createHostVerifier, prepareProblemContract, prepareSolverRequest, resolveDomainAdapter,
  ResearchCoreRefusal } from "../research-core-v3";
import { CampaignRefusal, campaignJobType, zeroResources, type CampaignView, type CampaignWorkerInput, type Resources } from "./contracts";
import { boundedJson } from "../research-core-v3/bounded-json";
import { appendCampaignEvent, campaignDigest, loadCampaignView, lockCampaign } from "./ledger";
import { assertControlledCampaignEnvironment, campaignSourceScanReservation, loadInstalledCampaignBundle, type InstalledCampaignBundle } from "./source-bundle";

const resultSchema = z.object({originalBytes:z.string(),attestedModel:z.string().min(1).max(200).nullable(),
  attestedModelVersion:z.string().min(1).max(200).nullable().optional(),
  usage:z.object({tokens:z.number().int().nonnegative().max(2_147_483_647).nullable(),provenance:z.enum(["CONTROLLED_PROVIDER_LOG","UNKNOWN"])}).strict()}).strict();
type Mutation = { row:ResearchCampaign; view:CampaignView; tx:TenantTransaction; round:number; attempt:number;jobCreatedAt:string;firstClaimAt:string|null;queueLatencyMilliseconds:number|null };
/** Every effect/adoption checks the current durable job version, lease and campaign authority. */
async function mutate<T>(input:CampaignWorkerInput, operation:(m:Mutation)=>Promise<T>,failureObservationOnly=false):Promise<T> {
  return withOrganizationTenant(input.organizationId,input.actorUserId,async tx=>{
    await tx.$queryRaw`SELECT id FROM durable_job WHERE organization_id=${input.organizationId} AND id=${input.jobId} FOR UPDATE`;
    const job=await tx.durableJob.findFirst({where:{id:input.jobId,organizationId:input.organizationId,jobType:campaignJobType,status:"RUNNING",
      lockedBy:input.workerId,version:input.expectedVersion,leaseExpiresAt:{gt:new Date()}}});
    if(!job) throw new CampaignRefusal("AUTHORITY","Campaign worker lease is stale");
    const payload=job.payload as Record<string,unknown>;
    if(typeof payload.campaignId!=="string" || !Number.isInteger(payload.round)) throw new CampaignRefusal("INTEGRITY","Invalid campaign durable job binding");
    const row=await lockCampaign(tx,input.organizationId,payload.campaignId);
    const view=await loadCampaignView(tx,row);
    if(row.workspaceId!==job.workspaceId || payload.authorityEpoch!==row.authorityEpoch) throw new CampaignRefusal("INTEGRITY","Job/campaign tenant or authority binding changed");
    const orgMember=await tx.organizationMembership.findFirst({where:{organizationId:input.organizationId,userId:input.actorUserId,status:"ACTIVE"}});
    const member=await tx.membership.findFirst({where:{workspaceId:row.workspaceId,userId:input.actorUserId,status:"ACTIVE",role:{in:["OWNER","ADMIN","MEMBER"]}}});
    if(!orgMember || !member || row.revokedAt) throw new CampaignRefusal("AUTHORITY","Campaign authority revoked");
    if(!failureObservationOnly) {
      const decision=await authorize(input.actorUserId,"research.request",{organizationId:row.organizationId,workspaceId:row.workspaceId,missionId:row.missionId});
      if(!decision.allowed) throw new CampaignRefusal("AUTHORITY","Current scoped campaign execution capability refused");
    }
    const firstClaim=await tx.durableJobEvent.findFirst({where:{organizationId:input.organizationId,jobId:job.id,eventType:"CLAIMED",attemptNumber:1},select:{createdAt:true},orderBy:[{createdAt:"asc"},{id:"asc"}]});
    const latency=firstClaim?firstClaim.createdAt.getTime()-job.createdAt.getTime():null;
    return operation({row,view,tx,round:payload.round as number,attempt:job.attempts,jobCreatedAt:job.createdAt.toISOString(),
      firstClaimAt:firstClaim?.createdAt.toISOString()??null,queueLatencyMilliseconds:latency!==null&&latency>=0?latency:null});
  });
}
function checkBundle(view:CampaignView,bundle:InstalledCampaignBundle) {
  if(view.sourceBundleDigest!==bundle.sourceBundleDigest || !bundle.checkerSourceDigests[view.contract.domain.adapterId]) throw new CampaignRefusal("INTEGRITY","Campaign reviewed source epoch changed");
}
function callResources(view:CampaignView):Resources {
  const adapter=resolveDomainAdapter(view.contract.domain.adapterId,view.contract.domain.adapterVersion);
  // Two source scans (before invocation and before returned-output adoption),
  // plus bounded journal/material overhead. Reservations are never refunded.
  return {calls:1,tokens:view.envelope.perCall.tokens,checkerOperations:0,
    computeMilliseconds:view.envelope.perCall.milliseconds+2*campaignSourceScanReservation.computeMilliseconds,
    readBytes:2*campaignSourceScanReservation.readBytes+1048576,
    writeBytes:adapter.limits.maxCandidateBytes+65536};
}
async function endJob(input:CampaignWorkerInput) {
  const admitted=await mutate(input,async({row,view,tx})=>{
    if(view.state.executionFailure) throw new CampaignRefusal("INTEGRITY","Prior execution refusal cannot be washed");
    await appendCampaignEvent(tx,row,"REUSE_RESERVED",`${row.id}:reuse-reserved:${row.sequence+1}`,
      {resources:{...zeroResources(),...campaignSourceScanReservation,readBytes:campaignSourceScanReservation.readBytes+65536,writeBytes:65536}},input.jobId);
    return view;
  });
  const bundle=await loadInstalledCampaignBundle();checkBundle(admitted,bundle);
  const retained=admitted.state.stage!;
  if(retained.runtimeSourceDigest!==bundle.runtimeSourceDigest || retained.checkerSourceDigest!==bundle.checkerSourceDigests[admitted.contract.domain.adapterId]) throw new CampaignRefusal("INTEGRITY","Completed stage runtime/checker binding changed");
  return mutate(input,async({row,view,tx,round,attempt})=>{
    checkBundle(view,bundle);
    const stage=view.state.stage;
    if(!stage || stage.round!==round || stage.fence!=="VERIFIED") throw new CampaignRefusal("INTEGRITY","Durable round is not complete");
    const key=`${stage.actionId}:round-ended`;
    if(!view.events.some(e=>e.actionKey===key)) {
      row=await appendCampaignEvent(tx,row,"ROUND_ENDED",key,{round,actualStatus:view.state.status,actionId:stage.actionId},input.jobId);
      if(view.state.status==="QUEUED") await tx.outboxEvent.create({data:{organizationId:row.organizationId,workspaceId:row.workspaceId,commandId:row.commandId,
        topic:campaignJobType,aggregateType:"ResearchCampaign",aggregateId:row.id,payload:{campaignId:row.id,round:round+1,authorityEpoch:row.authorityEpoch}}});
    }
    await tx.durableJob.update({where:{id:input.jobId},data:{status:"SUCCEEDED",result:{campaignId:row.id,round,status:view.state.status},
      completedAt:new Date(),lockedBy:null,leaseExpiresAt:null,version:{increment:1}}});
    await tx.durableJobEvent.create({data:{organizationId:row.organizationId,workspaceId:row.workspaceId,jobId:input.jobId,eventType:"SUCCEEDED",
      attemptNumber:attempt,workerId:input.workerId,detail:{campaignId:row.id,round}}});
    return {campaignId:row.id,status:view.state.status};
  });
}
async function stopWorker(input:CampaignWorkerInput,error:unknown) {
  const failure=error instanceof CampaignRefusal?error.code:error instanceof ResearchCoreRefusal?error.code==="RESOURCE_REFUSED"?"RESOURCE":error.code==="SCHEMA_REFUSED"?"SCHEMA":"INTEGRITY":"TRANSPORT";
  return mutate(input,async({row,view,tx,attempt})=>{
    // A transport exception after START is not pre-effect proof. Preserve all
    // charges and seal a consequential decision instead of retrying the call.
    const unknown=view.state.stage?.fence==="STARTED" && failure!=="INTEGRITY" && failure!=="AUTHORITY";
    const terminal=["RESOURCE_STOP","FAILED","COMPLETED"].includes(view.status);
    const kind=terminal?"EXECUTION_REFUSED":failure==="RESOURCE"?"RESOURCE_STOP":unknown?"PAUSED":"FAILED";
    row=await appendCampaignEvent(tx,row,kind,`${row.id}:stop:${row.sequence+1}`,{failure,reason:unknown?"START_OUTCOME_UNKNOWN":`${failure}_REFUSED`},input.jobId);
    row=await appendCampaignEvent(tx,row,"HUMAN_PROMPT",`${row.id}:prompt:${row.sequence+1}`,{taxonomy:unknown?"UNCERTAIN_EXTERNAL_EFFECT":"INTEGRITY_OR_RESOURCE_DECISION",
      reason:unknown?"START_OUTCOME_UNKNOWN":`${failure}_REFUSED`,minutes:null,minutesProvenance:"UNKNOWN"},input.jobId);
    await tx.durableJob.update({where:{id:input.jobId},data:{status:"DEAD_LETTER",lockedBy:null,leaseExpiresAt:null,
      lastErrorCode:`CAMPAIGN_${failure}`,lastErrorMessage:"Campaign retained an actionable bounded failure",version:{increment:1}}});
    await tx.durableJobEvent.create({data:{organizationId:row.organizationId,workspaceId:row.workspaceId,jobId:input.jobId,eventType:"DEAD_LETTERED",
      attemptNumber:attempt,workerId:input.workerId,detail:{failure,unknown}}});
    return {campaignId:row.id,status:terminal?"FAILED":row.status,campaignStatus:row.status};
  // A host-only refusal observation is not permission to dispatch or adopt.
  // Retain the reason even when the current execution capability was removed;
  // tenant membership, exact lease and immutable campaign bindings still apply.
  },true);
}
async function diagnoseUnknown(input:CampaignWorkerInput) {
  const known=await mutate(input,async({row,view,tx})=>{
    const stage=view.state.stage!;
    // No filesystem walk or provider body read: one exact known retained stage.
    const readBytes=4096,milliseconds=1000;
    await appendCampaignEvent(tx,row,"DIAGNOSTIC_RESERVED",`${stage.actionId}:diagnostic-reserved`,
      {stageId:stage.actionId,readBytes,milliseconds,resources:{...zeroResources(),readBytes,computeMilliseconds:milliseconds}},input.jobId);
    return {stageId:stage.actionId,fence:stage.fence,readBytes,milliseconds};
  });
    const started=performance.now();
    const actualRead=Buffer.byteLength(JSON.stringify({actionId:known.stageId,fence:known.fence}));
    const elapsedMilliseconds=performance.now()-started;
    if(actualRead>known.readBytes || elapsedMilliseconds>known.milliseconds) throw new CampaignRefusal("RESOURCE","Known-stage diagnostic allowance exceeded");
  await mutate(input,async({row,tx})=>{
    await appendCampaignEvent(tx,row,"DIAGNOSTIC",`${known.stageId}:diagnostic`,{stageId:known.stageId,fence:known.fence,
      code:"START_WITHOUT_DURABLE_RESULT",status:"UNKNOWN_EFFECT",readOnly:true,readBytes:actualRead,
      elapsedMilliseconds,diagnosticProvenance:"HOST_KNOWN_STAGE_METADATA"},input.jobId);
  });
}
export async function executeResearchCampaignJob(input:CampaignWorkerInput) {
  assertControlledCampaignEnvironment();
  if(input.provider.kind!=="CONTROLLED_LOCAL") throw new CampaignRefusal("AUTHORITY","No live campaign provider admitted");
  try {
    let loaded=await mutate(input,async({view,round})=>({view,round}));
    if(input.provider.requestedModel!==loaded.view.envelope.requestedModel) throw new CampaignRefusal("AUTHORITY","Controlled provider identity differs from approval");
    if(["RESOURCE_STOP","FAILED","COMPLETED","PAUSED_FOR_DECISION"].includes(loaded.view.status)) {
      if(loaded.view.state.stage?.fence==="VERIFIED") return await endJob(input);
      throw new CampaignRefusal("AUTHORITY","Campaign is not dispatchable");
    }
    if(Date.now()>=new Date(loaded.view.envelope.stop.deadlineAt).getTime()) throw new CampaignRefusal("RESOURCE","Campaign deadline exhausted");
    let stage=loaded.view.state.stage;
    if(stage?.round===loaded.round && stage.fence==="STARTED") {
      await diagnoseUnknown(input);
      throw new CampaignRefusal("TRANSPORT","Unknown START is not permission to repeat");
    }
    if(stage?.round===loaded.round && stage.fence==="VERIFIED") return await endJob(input);
    if(!stage || stage.round!==loaded.round) {
      await mutate(input,async({row,view,tx,round})=>{
        const prepared=prepareProblemContract(view.contract);
        const obligation=prepared.contract.obligations[0];
        if(view.state.retiredPredicateDigests.includes(campaignDigest(obligation.predicate))) throw new CampaignRefusal("AUTHORITY","Retired exact predicate cannot be recycled");
        const priorMethods=new Set(view.events.filter(e=>e.eventType==="RESERVED").map(e=>e.payload.state.stage!.methodId));
        const card=applicableDomainMethods(prepared,obligation.id).find(card=>view.envelope.methods.includes(card.id) && !priorMethods.has(card.id));
        if(!card) throw new CampaignRefusal("RESOURCE","No fresh applicable discriminating method remains");
        const resources=callResources(view);
        const actionId=`${row.id}:round:${round}`;
        // The initial installed bundle was authenticated by the command. Its
        // epoch remains sealed; fresh source validation follows reservation.
        await appendCampaignEvent(tx,row,"RESERVED",`${actionId}:reserved`,{resources,role:"SOLVER",selectedMethodId:card.id,
          discriminatingExperiment:card.discriminatingExperiment,rankingPolicy:"DOMAIN_APPLICABILITY_THEN_FRESH_EXPERIMENT",priorNoInformation:view.state.noInformation,
          stage:{contractDigest:prepared.contractDigest,rootId:prepared.contract.rootId,obligationId:obligation.id,adapterId:prepared.contract.domain.adapterId,
            adapterVersion:prepared.contract.domain.adapterVersion,actionId,attemptId:randomUUID(),round,methodId:card.id,delivery:1,fence:"NOT_CROSSED",
            candidateKey:null,candidateDigest:null,candidateBytes:null,sourceBundleDigest:view.sourceBundleDigest,inputDigest:prepared.inputDigest,
            predicateDigest:campaignDigest(obligation.predicate),checkerSourceDigest:"PENDING_REVIEWED_SOURCE_SCAN",authorityEpoch:view.authorityEpoch,
            runtimeSourceDigest:"PENDING_REVIEWED_SOURCE_SCAN",checkerReservations:0,startedAt:null,returnedAt:null,receipt:null,closure:null}},input.jobId);
      });
    } else if(stage.fence==="NOT_CROSSED") {
      await mutate(input,async({row,view,tx})=>appendCampaignEvent(tx,row,"DELIVERY_REPLACED",`${stage!.actionId}:delivery:2`,
        {resources:callResources(view),proof:"DURABLE_NOT_CROSSED_FENCE_AND_CURRENT_LEASE",role:"SOLVER",priorDelivery:1,newDelivery:2},input.jobId));
    }
    loaded=await mutate(input,async({view,round})=>({view,round})); stage=loaded.view.state.stage!;
    if(stage.fence==="NOT_CROSSED") {
      const bundle=await loadInstalledCampaignBundle(); checkBundle(loaded.view,bundle);
      await input.onBoundary?.("BEFORE_START");
      await mutate(input,async({row,view,tx,jobCreatedAt,firstClaimAt,queueLatencyMilliseconds})=>{
        checkBundle(view,bundle);
        // Pin the actual reviewed files at the durable invocation boundary.
        await appendCampaignEvent(tx,row,"STARTED",`${stage!.actionId}:start:${stage!.delivery}`,{actionId:stage!.actionId,delivery:stage!.delivery,
          startedAt:new Date().toISOString(),runtimeSourceDigest:bundle.runtimeSourceDigest,
          jobCreatedAt,firstClaimAt,queueLatencyMilliseconds,queueLatencyProvenance:queueLatencyMilliseconds===null?"UNKNOWN":"DURABLE_JOB_FIRST_CLAIM",
          checkerSourceDigest:bundle.checkerSourceDigests[view.contract.domain.adapterId]},input.jobId);
      });
      await input.onBoundary?.("AFTER_START");
      const prepared=prepareProblemContract(loaded.view.contract),obligationId=prepared.contract.obligations[0].id;
      const controller=new AbortController();
      const timer=setTimeout(()=>controller.abort(),loaded.view.envelope.perCall.milliseconds);
      const started=performance.now();
      let response: z.infer<typeof resultSchema>;
      const adapter=resolveDomainAdapter(prepared.contract.domain.adapterId,prepared.contract.domain.adapterVersion);
      let onAbort=()=>{};
      try {
        // The provider receives only the domain-owned public request, not the
        // host verifier receipt, evaluation references or approval envelope.
        const effect=input.provider.execute({actionId:stage.actionId,deliveryId:`${stage.actionId}:delivery:${stage.delivery}`,attemptId:stage.attemptId,
          methodId:stage.methodId,request:prepareSolverRequest(prepared,obligationId,"SOLVER",stage.methodId),maxTokens:loaded.view.envelope.perCall.tokens,signal:controller.signal});
        const deadline=new Promise<never>((_,reject)=>{onAbort=()=>reject(new CampaignRefusal("TRANSPORT","Host provider deadline; outcome unknown"));controller.signal.addEventListener("abort",onAbort,{once:true});});
        const returned=await Promise.race([effect,deadline]);
        response=resultSchema.parse(boundedJson(returned,adapter.limits.maxCandidateBytes*8+4096,32));
      } finally { clearTimeout(timer);controller.signal.removeEventListener("abort",onAbort); }
      if(response.originalBytes.length>adapter.limits.maxCandidateBytes || Buffer.byteLength(response.originalBytes)>adapter.limits.maxCandidateBytes) throw new CampaignRefusal("SCHEMA","Candidate exceeded retention limit");
      const seal=sha256(response.originalBytes),candidateKey=`${loaded.view.workspaceId}/research-campaign/${loaded.view.id}/${stage.attemptId}.json`;
      const fresh=await loadInstalledCampaignBundle();checkBundle(loaded.view,fresh);
      // Recheck the lease and revocation before object write and before ledger
      // adoption. An orphan object after a crash is not a durable result.
      await mutate(input,async()=>undefined);
      await getObjectStorage().put(candidateKey,new TextEncoder().encode(response.originalBytes),{contentType:"application/json"});
      await mutate(input,async({row,view,tx})=>{
        checkBundle(view,fresh);
        await appendCampaignEvent(tx,row,"RESULT_RETAINED",`${stage!.actionId}:result`,{actionId:stage!.actionId,candidateKey,candidateDigest:seal,
          candidateBytes:Buffer.byteLength(response.originalBytes),returnedAt:new Date().toISOString(),observedTokens:response.usage.tokens,
          usageProvenance:response.usage.provenance,attestedModel:response.attestedModel,attestedModelVersion:response.attestedModelVersion??null,requestedModel:input.provider.requestedModel,
          elapsedMilliseconds:performance.now()-started,activeTimeProvenance:"HOST_MONOTONIC",runtimeSourceDigest:fresh.runtimeSourceDigest,
          checkerSourceDigest:fresh.checkerSourceDigests[view.contract.domain.adapterId]},input.jobId);
      });
      await input.onBoundary?.("AFTER_RESULT");
      if(controller.signal.aborted || response.usage.tokens!==null && response.usage.tokens>loaded.view.envelope.perCall.tokens || performance.now()-started>loaded.view.envelope.perCall.milliseconds) throw new CampaignRefusal("RESOURCE","Retained provider overshoot");
    }
    loaded=await mutate(input,async({view,round})=>({view,round}));stage=loaded.view.state.stage!;
    if(stage.fence!=="RESULT_RETAINED") throw new CampaignRefusal("INTEGRITY","No stable candidate for verification");
    const prepared=prepareProblemContract(loaded.view.contract),obligationId=prepared.contract.obligations[0].id;
    const adapter=resolveDomainAdapter(prepared.contract.domain.adapterId,prepared.contract.domain.adapterVersion);
    // Reserving before source scan, object read, candidate parsing and checking
    // charges replays even if a process dies inside the checker.
    await mutate(input,async({row,tx})=>appendCampaignEvent(tx,row,"CHECK_RESERVED",`${stage!.actionId}:check-reserved:${stage!.checkerReservations+1}`,
      {actionId:stage!.actionId,role:"CHECKER",resources:{...zeroResources(),checkerOperations:adapter.limits.maxOperations,
        computeMilliseconds:adapter.limits.maxCheckMilliseconds+2*campaignSourceScanReservation.computeMilliseconds,
        readBytes:adapter.limits.maxCandidateBytes+2*campaignSourceScanReservation.readBytes+65536,writeBytes:65536}},input.jobId));
    const bundle=await loadInstalledCampaignBundle();checkBundle(loaded.view,bundle);
    if(stage.runtimeSourceDigest!==bundle.runtimeSourceDigest || stage.checkerSourceDigest!==bundle.checkerSourceDigests[prepared.contract.domain.adapterId]) throw new CampaignRefusal("INTEGRITY","Retained checker/runtime pins differ");
    const key=stage.candidateKey!;
    if(key!==`${loaded.view.workspaceId}/research-campaign/${loaded.view.id}/${stage.attemptId}.json`) throw new CampaignRefusal("INTEGRITY","Retained object reference changed");
    const storage=getObjectStorage(),head=await storage.head(key);
    if(!head || head.size!==stage.candidateBytes || head.size>adapter.limits.maxCandidateBytes) throw new CampaignRefusal("INTEGRITY","Retained candidate length mismatch");
    const bytes=await storage.get(key,{maxBytes:adapter.limits.maxCandidateBytes});
    if(!bytes || bytes.byteLength!==stage.candidateBytes) throw new CampaignRefusal("INTEGRITY","Retained candidate unavailable");
    const original=new TextDecoder("utf-8",{fatal:true}).decode(bytes);
    if(sha256(original)!==stage.candidateDigest || prepared.inputDigest!==stage.inputDigest || stage.sourceBundleDigest!==bundle.sourceBundleDigest || stage.authorityEpoch!==loaded.view.authorityEpoch) throw new CampaignRefusal("INTEGRITY","Retained candidate binding mismatch");
    let candidate;
    try {
      if(loaded.view.state.retiredCandidateDigests.includes(stage.candidateDigest!)) throw new ResearchCoreRefusal("SCHEMA_REFUSED","Retired exact candidate cannot be recycled");
      candidate=admitCandidate(prepared,obligationId,original);
    } catch(error) {
      if(!(error instanceof ResearchCoreRefusal) || !["SCHEMA_REFUSED","RESOURCE_REFUSED"].includes(error.code)) throw error;
      await mutate(input,async({row,tx})=>appendCampaignEvent(tx,row,"CANDIDATE_REJECTED",`${stage!.actionId}:candidate-rejected`,
        {failure:"SCHEMA",exactCandidateDigest:stage!.candidateDigest,reasonCode:error.code},input.jobId));
      return await endJob(input);
    }
    let token=true;
    const host=createHostVerifier({...bundle,authorityEpoch:loaded.view.authorityEpoch,reserveCheck:binding=>{
      if(!token || binding.attemptId!==stage!.attemptId || binding.inputDigest!==stage!.inputDigest || binding.candidateDigest!==stage!.candidateDigest ||
        binding.contractDigest!==loaded.view.contractDigest || binding.predicateDigest!==stage!.predicateDigest || campaignDigest(binding.limits)!==campaignDigest(adapter.limits)) throw new CampaignRefusal("AUTHORITY","Checker pre-reservation binding mismatch");
      token=false;
    }});
    const receipt=host.verify({prepared,obligationId,candidate,attemptId:stage.attemptId,inputDigest:prepared.inputDigest});
    const closure=host.projectClosure(prepared,obligationId,receipt);
    checkBundle(loaded.view,await loadInstalledCampaignBundle());
    await mutate(input,async({row,tx})=>appendCampaignEvent(tx,row,"VERIFIED",`${stage!.actionId}:verified`,{receipt,closure,
      obligationDelta:closure.status==="CLOSED_EXACT_SCOPE"?1:0,exactRejectedCandidate:receipt.result==="REJECTED"?candidate.candidateDigest:null,
      scientificStatus:receipt.result},input.jobId));
    await input.onBoundary?.("AFTER_VERIFIED");
    return await endJob(input);
  } catch(error) {
    return stopWorker(input,error);
  }
}
