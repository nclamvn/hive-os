import { randomUUID } from "node:crypto";
import { expect } from "vitest";
import { createMission } from "@/modules/mission-kernel";
import { getDb } from "@/server/db";
import { withOrganizationTenant } from "@/server/tenant-context";
import { runResearchSandboxWorkerCycle } from "@/server/workers/research-sandbox-cycle";
import { dispatchOutboxBatch } from "@/modules/command-runtime";
import { getResearchCampaign } from "@/modules/research-sandbox/research-campaign/commands";
import { campaignJobType } from "@/modules/research-sandbox/research-campaign/contracts";
import { requestPairedStudy, evaluateRetainedPair, getPairedStudyReport } from "@/modules/research-sandbox/research-evaluation-v3/kernel";
import { evaluationDigest, type StudyPlan } from "@/modules/research-sandbox/research-evaluation-v3/contracts";
import { asOwner, createUser } from "../integration/helpers";

/** No truncation, no user namespace: controlled provider invocation logs are
 * durable QA evidence, not actual live model or real-user measurements. */
function guard() {
  for (const name of ["DATABASE_URL", "DATABASE_MIGRATION_URL"]) {
    const url=new URL(process.env[name]!);
    if(!["localhost","127.0.0.1"].includes(url.hostname)||url.port!=="5433"||url.pathname!=="/hiveos_test")throw new Error("Both isolated QA database targets required");
  }
}
export async function runStudy(plan: StudyPlan, candidates: Map<string,string>, missingUsage=false) {
  guard();const owner=await asOwner(await createUser("tip076-evaluation")),mission=await createMission(owner,{title:"TIP076 paired controlled engineering study"});
  const workspace=await getDb().workspace.findUniqueOrThrow({where:{id:owner.workspace.id}}),organizationId=workspace.organizationId;
  const result=await requestPairedStudy(owner,{plan,missionId:mission.id,idempotencyKey:`study:${randomUUID()}`});
  expect(result.preregistration.status,JSON.stringify(result.preregistration)).toBe("SUCCEEDED");
  expect(result.admissions).toHaveLength(plan.tasks.length*2);expect(result.admissions.every(r=>r.status==="SUCCEEDED")).toBe(true);
  const ids=result.admissions.flatMap(r=>r.status==="SUCCEEDED"?[String(r.outcome.campaignId)]:[]);
  const provider={kind:"CONTROLLED_LOCAL" as const,requestedModel:plan.requestedModel,async execute(input:{actionId:string;request:unknown}){
    const request=input.request as {contractDigest:string;prompt:string};
    expect(request.prompt).not.toContain("referenceDigest");expect(request.prompt).not.toContain("valid:false");
    const originalBytes=candidates.get(request.contractDigest);if(!originalBytes)throw new Error("Unregistered controlled candidate");
    await getDb().auditEvent.create({data:{workspaceId:owner.workspace.id,actorUserId:owner.user.id,eventType:"tip076.paired-controlled-provider.invoked",
      entityType:"ResearchCampaign",entityId:input.actionId.split(":round:")[0],correlationId:owner.correlationId,
      payload:{actionId:input.actionId,studyCommandId:result.preregistration.commandId,provenance:"ACTUAL_CONTROLLED_TEST_TRANSPORT_NOT_LIVE_MODEL",simulatedTokens:missingUsage?null:31}}});
    return {originalBytes,attestedModel:plan.requestedModel,attestedModelVersion:null,usage:{tokens:missingUsage?null:31,provenance:missingUsage?"UNKNOWN" as const:"CONTROLLED_PROVIDER_LOG" as const}};
  }};
  for(let pass=0;pass<3;pass++) {
    const outbox=await withOrganizationTenant(organizationId,owner.user.id,tx=>tx.outboxEvent.findMany({where:{organizationId,topic:campaignJobType,aggregateId:{in:ids},status:"PENDING"},select:{id:true},take:49}));
    if(!outbox.length)break;expect(outbox.length).toBeLessThanOrEqual(48);
    // Exact IDs exclude metadata-only study/observation notifications and all
    // other retained QA tenants/jobs. Actual shared dispatcher and worker used.
    for(const item of outbox){
      const dispatched=await dispatchOutboxBatch({organizationId,actorUserId:owner.user.id,workerId:`eval-dispatch-${item.id}`,outboxIds:[item.id]});
      expect(dispatched.jobIds).toHaveLength(1);
      await runResearchSandboxWorkerCycle({organizationId,actorUserId:owner.user.id,workerId:`eval-${pass}-${item.id}`,
        correlationId:owner.correlationId,claimFirst:1,campaign:{provider,outboxIds:[],jobIds:dispatched.jobIds}});
    }
  }
  const views=await Promise.all(ids.map(id=>getResearchCampaign(owner,id)));
  expect(views.every(v=>["COMPLETED","RESOURCE_STOP","FAILED"].includes(v.status)),JSON.stringify(views.map(v=>({id:v.id,status:v.status,reason:v.state.stopReason})))).toBe(true);
  const grades=[];
  for(const id of ids)grades.push(await evaluateRetainedPair(owner,{campaignId:id,idempotencyKey:`grade:${id}`}));
  const report=await getPairedStudyReport(owner,result.preregistration.commandId);
  const logs=await getDb().auditEvent.findMany({where:{workspaceId:owner.workspace.id,eventType:"tip076.paired-controlled-provider.invoked"}});
  expect(logs.length).toBe(views.reduce((n,v)=>n+v.events.filter(e=>e.eventType==="STARTED").length,0));
  const observation={version:3,planDigest:plan.planDigest,studyCommandId:result.preregistration.commandId,organizationId,workspaceId:owner.workspace.id,missionId:mission.id,
    campaignIds:ids,actualControlledProviderInvocations:logs.length,simulatedTokens:missingUsage?null:logs.length*31,
    gradeCounts:grades.reduce<Record<string,number>>((s,g)=>({...s,[g.status]:(s[g.status]??0)+1}),{}),reportDigest:report.reportDigest,
    realModels:"NOT_RUN",actualPrice:"UNKNOWN",realUserAcceptance:"NOT_RUN",sourceBundleDigest:views[0].sourceBundleDigest};
  await getDb().auditEvent.create({data:{workspaceId:owner.workspace.id,actorUserId:owner.user.id,eventType:"tip076.paired-study.observed",entityType:"CommandRecord",
    entityId:result.preregistration.commandId,correlationId:owner.correlationId,payload:{...observation,observationDigest:evaluationDigest(observation)}}});
  console.log("TIP076_PAIRED_OBSERVATION",JSON.stringify(observation));
  return {owner,organizationId,ids,grades,views,result,report};
}
