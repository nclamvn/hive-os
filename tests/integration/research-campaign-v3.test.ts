import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import { appendFile,mkdtemp,readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe,expect,it } from "vitest";
import { claimJobs,dispatchOutboxBatch } from "@/modules/command-runtime";
import { createScopedGrant } from "@/modules/authorization";
import { createMission } from "@/modules/mission-kernel";
import { getResearchCampaign,requestResearchCampaign,revokeResearchCampaign } from "@/modules/research-sandbox/research-campaign";
import type { CampaignEnvelope,ControlledCampaignProvider } from "@/modules/research-sandbox/research-campaign/contracts";
import { getDb } from "@/server/db";
import { getEnv } from "@/server/env";
import { withOrganizationTenant } from "@/server/tenant-context";
import { runResearchSandboxWorkerCycle } from "@/server/workers/research-sandbox-cycle";
import type { Json } from "@/modules/research-sandbox/research-core-v3";
import { campaignQaEnvelope,campaignQaMethods,campaignQaProblem } from "../fixtures/research-campaign-v3";
import { asOwner,contextForMembership,createUser,ownerQuery } from "./helpers";

// No truncate: fixtures own their organizations and retain the frozen legacy
// baseline and this suite's invocation/effect observations for Main review.
async function fixture(adapterId="INTEGER_WITNESS",input?:Json,rounds=1,envelopeEdit?:(envelope:CampaignEnvelope)=>void) {
  const owner=await asOwner(await createUser("TIP076B-QA"));
  const mission=await createMission(owner,{title:"TIP076B isolated engineering campaign"});
  const organizationId=(await getDb().workspace.findUniqueOrThrow({where:{id:owner.workspace.id},select:{organizationId:true}})).organizationId;
  const contract=campaignQaProblem(adapterId,input),envelope=campaignQaEnvelope(campaignQaMethods(contract),rounds);
  envelopeEdit?.(envelope);
  const request={idempotencyKey:`TIP076B:${randomUUID()}`,missionId:mission.id,contract,envelope};
  const approved=await requestResearchCampaign(owner,request);
  expect(approved.status).toBe("SUCCEEDED");
  if(approved.status!=="SUCCEEDED")throw new Error("Approval failed");
  const id=String(approved.outcome.campaignId);
  const jobs=await dispatchOutboxBatch({organizationId,actorUserId:owner.user.id,workerId:"TIP076B-QA-dispatch",outboxIds:approved.outboxEventIds});
  const dir=await mkdtemp(path.join(tmpdir(),"hiveos-076b-process-")),logPath=path.join(dir,"invocations.jsonl");
  return {owner,organizationId,id,jobIds:jobs.jobIds,request,approved,dir,logPath};
}
type Fixture=Awaited<ReturnType<typeof fixture>>;
async function logLines(file:string) {try{return (await readFile(file,"utf8")).trim().split("\n").filter(Boolean).map(line=>JSON.parse(line));}catch(error){if((error as NodeJS.ErrnoException).code==="ENOENT")return [];throw error;}}
function provider(f:Fixture,responses:string[],extra?:{unknownUsage?:boolean;hang?:boolean}):ControlledCampaignProvider {
  let index=0;
  return {kind:"CONTROLLED_LOCAL",requestedModel:"controlled-campaign-v3",async execute(input){
    await appendFile(f.logPath,JSON.stringify({actionId:input.actionId,deliveryId:input.deliveryId,attemptId:input.attemptId,startedAt:new Date().toISOString()})+"\n");
    if(extra?.hang) await new Promise(()=>{});
    return {originalBytes:responses[Math.min(index++,responses.length-1)],attestedModel:null,usage:{tokens:extra?.unknownUsage?null:10,provenance:extra?.unknownUsage?"UNKNOWN":"CONTROLLED_PROVIDER_LOG"}};
  }};
}
async function run(f:Fixture,responses:string[],extra?:{unknownUsage?:boolean;hang?:boolean},jobIds=f.jobIds) {
  return runResearchSandboxWorkerCycle({organizationId:f.organizationId,actorUserId:f.owner.user.id,workerId:`TIP076B-QA-${randomUUID()}`,correlationId:"TIP076B_QA",
    campaign:{provider:provider(f,responses,extra),jobIds,outboxIds:[],leaseSeconds:30}});
}
function child(f:Fixture,boundary:string,response:string) {
  return spawn(process.execPath,["--import","tsx","tests/fixtures/research-campaign-v3-worker.ts",JSON.stringify({organizationId:f.organizationId,
    actorUserId:f.owner.user.id,jobIds:f.jobIds,workerId:`TIP076B-child-${randomUUID()}`,logPath:f.logPath,
    storageRoot:getEnv().STORAGE_LOCAL_ROOT,responses:[response],boundary})],{cwd:process.cwd(),env:{...process.env},stdio:["ignore","pipe","pipe","ipc"]});
}
async function crashAt(f:Fixture,boundary:string,response:string) {
  const worker=child(f,boundary,response);
  const messages:unknown[]=[];let stderr="";
  worker.stderr?.on("data",chunk=>{stderr+=chunk.toString();});
  await new Promise<void>((resolve,reject)=>{
    const timer=setTimeout(()=>{worker.kill("SIGKILL");reject(new Error(`QA child boundary timeout: ${boundary}; ${stderr.slice(0,200)}`));},15000);
    worker.on("message",message=>{messages.push(message);if((message as {boundary?:string}).boundary===boundary){clearTimeout(timer);resolve();}});
    worker.on("exit",code=>{if(code!==null){clearTimeout(timer);reject(new Error(`QA child exited before boundary: ${code}; ${JSON.stringify(messages)}`));}});
  });
  await new Promise<void>(resolve=>{worker.once("exit",()=>resolve());worker.kill("SIGKILL");});
  return messages;
}
async function expireLease(f:Fixture) {
  // This is an actual guarded QA DB fault injection, not a mocked lease object.
  const url=new URL(process.env.DATABASE_URL!);if(url.pathname!=="/hiveos_test"||url.port!=="5433")throw new Error("QA DB guard");
  await withOrganizationTenant(f.organizationId,f.owner.user.id,tx=>tx.durableJob.updateMany({where:{id:{in:f.jobIds},organizationId:f.organizationId,status:"RUNNING"},data:{leaseExpiresAt:new Date(Date.now()-1000)}}));
}
const witness=JSON.stringify({kind:"INTEGER_WITNESS",values:["2","3"]});
const wrongWitness=JSON.stringify({kind:"INTEGER_WITNESS",values:["2","2"]});
describe("TIP076B authenticated actual DB worker integration",()=>{
  it("authenticated idempotent approval creates one campaign/outbox/job",async()=>{
    const f=await fixture();expect(await requestResearchCampaign(f.owner,f.request)).toEqual(f.approved);
    const duplicate=await dispatchOutboxBatch({organizationId:f.organizationId,actorUserId:f.owner.user.id,workerId:"duplicate",outboxIds:f.approved.outboxEventIds});
    expect(duplicate.dispatched).toBe(0);await run(f,[witness]);
    const view=await getResearchCampaign(f.owner,f.id);expect(view.status).toBe("COMPLETED");expect(view.state.closure?.status).toBe("CLOSED_EXACT_SCOPE");expect(view.state.routinePrompts).toBe(0);expect((await logLines(f.logPath)).length).toBe(1);
  });
  it("concurrent actual claims cannot dispatch the same controlled action twice",async()=>{
    const f=await fixture();await Promise.all([run(f,[witness]),run(f,[witness])]);
    expect(await logLines(f.logPath)).toHaveLength(1);expect((await getResearchCampaign(f.owner,f.id)).state.queueLatencyMilliseconds).toBeGreaterThanOrEqual(0);
  });
  const q=(n:string)=>({numerator:n,denominator:"1"});
  const identityInput:Json={kind:"RATIONAL_IDENTITY",left:{factors:[[q("1"),q("1")],[q("1"),q("-1")]]},right:{factors:[[q("1"),q("0"),q("-1")]]}};
  const cases:[string,Json,string,string][]=[
    ["INTEGER_WITNESS",{kind:"LINEAR_WITNESS",coefficients:["1","1"],rhs:"5"},witness,wrongWitness],
    ["FINITE_GRAPH",{kind:"COLORING",vertexCount:3,edges:[[0,1],[1,2]],colorCount:2},JSON.stringify({kind:"COLORING",colors:[0,1,0]}),JSON.stringify({kind:"COLORING",colors:[0,0,0]})],
    ["POLYNOMIAL_IDENTITY",identityInput,JSON.stringify({kind:"IDENTITY_CERTIFICATE",leftCoefficients:[q("1"),q("0"),q("-1")],rightCoefficients:[q("1"),q("0"),q("-1")]}),JSON.stringify({kind:"IDENTITY_CERTIFICATE",leftCoefficients:[q("1")],rightCoefficients:[q("1")]} )],
  ];
  for(const [adapterId,input,positive,negative] of cases) {
    it(`${adapterId} positive actual command/worker/exact retained verifier path`,async()=>{
      const f=await fixture(adapterId,input);await run(f,[positive]);const v=await getResearchCampaign(f.owner,f.id);
      expect(v.state.closure?.status).toBe("CLOSED_EXACT_SCOPE");expect(v.state.stage?.receipt?.adapterId).toBe(adapterId);expect(v.state.stage?.candidateDigest).toMatch(/^[a-f0-9]{64}$/);
    });
    it(`${adapterId} plausible invalid candidate never closes`,async()=>{
      const f=await fixture(adapterId,input);await run(f,[negative]);const v=await getResearchCampaign(f.owner,f.id);
      expect(v.state.closure?.status).not.toBe("CLOSED_EXACT_SCOPE");expect(v.state.stage?.receipt?.scientificDisposition).toBe("INVALID_CANDIDATE");expect(v.state.retiredPredicateDigests).toEqual([]);
    });
  }
  it("invalid witness pivots to fresh applicable experiment without another approval",async()=>{
    const f=await fixture("INTEGER_WITNESS",undefined,2);await run(f,[wrongWitness]);
    const next=await dispatchOutboxBatch({organizationId:f.organizationId,actorUserId:f.owner.user.id,workerId:"next-dispatch"});
    await run(f,[witness],undefined,next.jobIds);const v=await getResearchCampaign(f.owner,f.id);
    expect(v.state.rounds).toBe(2);expect(v.state.noInformation).toBe(1);expect(v.state.retiredCandidateDigests).toHaveLength(1);expect(v.status).toBe("COMPLETED");
    expect(new Set(v.events.filter(e=>e.eventType==="RESERVED").map(e=>e.payload.state.stage?.methodId)).size).toBe(2);expect(v.state.routinePrompts).toBe(0);
  });
  it("finite predicate refutation retires only exact false obligation and stops",async()=>{
    const f=await fixture("INTEGER_WITNESS",{kind:"FINITE_LINEAR_REFUTATION",coefficients:["1"],rhs:"1",maxValue:2});
    await run(f,[JSON.stringify({kind:"FINITE_EXHAUSTION",checkedAssignments:2})]);const v=await getResearchCampaign(f.owner,f.id);
    expect(v.state.stage?.receipt?.scientificDisposition).toBe("REFUTED_EXACT_PREDICATE");expect(v.state.retiredPredicateDigests).toHaveLength(1);expect(v.status).toBe("FAILED");
  });
  it("unknown usage/model attestation is not zero or requested identity",async()=>{
    const f=await fixture();await run(f,[witness],{unknownUsage:true});const v=await getResearchCampaign(f.owner,f.id);
    expect(v.state.observedTokens).toBeNull();expect(v.state.accountingComplete).toBe(false);expect(v.state.attestedModel).toBeNull();
  });
  it("host deadline handles a port ignoring abort without another call",async()=>{
    const f=await fixture("INTEGER_WITNESS",undefined,1,e=>{e.perCall.milliseconds=30;});await run(f,[witness],{hang:true});const v=await getResearchCampaign(f.owner,f.id);
    expect(v.status).toBe("PAUSED_FOR_DECISION");expect(v.state.observedTokens).toBeNull();expect((await logLines(f.logPath)).length).toBe(1);
  });
  it("no TOTAL call allowance stops before controlled-provider dispatch",async()=>{
    const f=await fixture("INTEGER_WITNESS",undefined,1,e=>{e.total.calls=0;});await run(f,[witness]);const v=await getResearchCampaign(f.owner,f.id);
    expect(v.status).toBe("RESOURCE_STOP");expect(await logLines(f.logPath)).toHaveLength(0);
  });
  it("revocation fences dispatch",async()=>{
    const f=await fixture();const before=await getResearchCampaign(f.owner,f.id);
    await revokeResearchCampaign(f.owner,{id:f.id,idempotencyKey:`revoke:${randomUUID()}`,expectedVersion:before.version});
    await run(f,[witness]);expect(await logLines(f.logPath)).toHaveLength(0);expect((await getResearchCampaign(f.owner,f.id)).revokedAt).not.toBeNull();
  });
  it("current enterprise mission DENY blocks approved dispatch despite active membership",async()=>{
    const f=await fixture();await createScopedGrant(f.owner,{subjectType:"USER",subjectUserId:f.owner.user.id,
      role:"CONTRIBUTOR",effect:"DENY",scopeType:"MISSION",missionId:f.request.missionId,reason:"TIP076B owned QA authority fault"});
    await run(f,[witness]);expect(await logLines(f.logPath)).toHaveLength(0);
    const view=await getResearchCampaign(f.owner,f.id);expect(view.state.failure).toBe("AUTHORITY");expect(view.state.closure).toBeNull();
    const member=await getDb().membership.findUniqueOrThrow({where:{id:f.owner.membership.id}});expect(member.status).toBe("ACTIVE");
  });
  it("capability denial during external return prevents candidate adoption",async()=>{
    const f=await fixture();const port=provider(f,[witness]);
    await runResearchSandboxWorkerCycle({organizationId:f.organizationId,actorUserId:f.owner.user.id,workerId:`TIP076B-deny-${randomUUID()}`,correlationId:"TIP076B_QA",
      campaign:{jobIds:f.jobIds,outboxIds:[],leaseSeconds:30,provider:{...port,async execute(input){const result=await port.execute(input);
        await createScopedGrant(f.owner,{subjectType:"USER",subjectUserId:f.owner.user.id,role:"CONTRIBUTOR",effect:"DENY",scopeType:"MISSION",
          missionId:f.request.missionId,reason:"TIP076B owned QA revoke execution before adoption"});return result;}}}});
    const view=await getResearchCampaign(f.owner,f.id);expect(await logLines(f.logPath)).toHaveLength(1);
    expect(view.state.failure).toBe("AUTHORITY");expect(view.state.closure).toBeNull();expect(view.state.stage?.fence).toBe("STARTED");
    expect(view.state.stage?.candidateDigest).toBeNull();expect(view.state.observedTokens).toBeNull();
  });
  it("tenant/workspace reader isolation and append-only runtime privileges",async()=>{
    const f=await fixture();const other=await asOwner(await createUser("TIP076B-other"));
    await expect(getResearchCampaign(other,f.id)).rejects.toBeDefined();
    const invisible=await withOrganizationTenant((await getDb().workspace.findUniqueOrThrow({where:{id:other.workspace.id}})).organizationId,other.user.id,
      tx=>tx.researchCampaign.findMany({where:{id:f.id}}));expect(invisible).toEqual([]);
    await expect(withOrganizationTenant(f.organizationId,f.owner.user.id,tx=>tx.researchCampaignEvent.updateMany({where:{campaignId:f.id},data:{eventType:"FORGED"}}))).rejects.toBeDefined();
    const permissions=await ownerQuery<{update_allowed:boolean;delete_allowed:boolean}>("SELECT has_table_privilege('hiveos_app','research_campaign_event','UPDATE') AS update_allowed,has_table_privilege('hiveos_app','research_campaign_event','DELETE') AS delete_allowed");
    expect(permissions[0]).toEqual({update_allowed:false,delete_allowed:false});
  });
  it("projection mutation cannot be washed by updating its digest",async()=>{
    const f=await fixture();await withOrganizationTenant(f.organizationId,f.owner.user.id,tx=>tx.researchCampaign.update({where:{id:f.id},data:{
      state:{forged:true},stateDigest:"a".repeat(64),version:{increment:1},sequence:{increment:1},tailDigest:"a".repeat(64)}})).catch(()=>undefined);
    // Either the SQL monotonic guard rejects it, or complete-chain replay does.
    const row=await withOrganizationTenant(f.organizationId,f.owner.user.id,tx=>tx.researchCampaign.findUniqueOrThrow({where:{id:f.id}}));
    if(row.sequence!==1) await expect(getResearchCampaign(f.owner,f.id)).rejects.toBeDefined();else expect((await getResearchCampaign(f.owner,f.id)).events).toHaveLength(1);
  });
  for(const boundary of ["BEFORE_START","AFTER_START","AFTER_RESULT"] as const) {
    it(`actual worker SIGKILL ${boundary} preserves effect-aware recovery`,async()=>{
      const f=await fixture();const messages=await crashAt(f,boundary,witness);
      const before=await getResearchCampaign(f.owner,f.id);await expireLease(f);await run(f,[witness]);const after=await getResearchCampaign(f.owner,f.id);
      expect(messages.length).toBeGreaterThan(0);expect((await logLines(f.logPath)).length).toBe(1);
      if(boundary==="BEFORE_START") {expect(before.state.stage?.fence).toBe("NOT_CROSSED");expect(after.state.replacements).toBe(1);expect(after.state.spent.calls).toBe(2);expect(after.status).toBe("COMPLETED");}
      else if(boundary==="AFTER_START") {expect(after.status).toBe("PAUSED_FOR_DECISION");expect(after.state.diagnosticSpent.incidents).toBe(1);expect(after.state.observedTokens).toBeNull();}
      else {expect(before.state.stage?.fence).toBe("RESULT_RETAINED");expect(after.status).toBe("COMPLETED");expect(after.state.spent.calls).toBe(1);}
    },30000);
  }
  it("stale leased worker cannot START or adopt after another lease claim",async()=>{
    const f=await fixture();const [first]=await claimJobs({organizationId:f.organizationId,actorUserId:f.owner.user.id,workerId:"stale-worker",jobIds:f.jobIds,leaseSeconds:5});
    await expireLease(f);const [second]=await claimJobs({organizationId:f.organizationId,actorUserId:f.owner.user.id,workerId:"new-worker",jobIds:f.jobIds,leaseSeconds:30});
    expect(second.version).toBeGreaterThan(first.version);
    const {executeResearchCampaignJob}=await import("@/modules/research-sandbox/research-campaign/worker");
    await expect(executeResearchCampaignJob({organizationId:f.organizationId,actorUserId:f.owner.user.id,workerId:"stale-worker",jobId:first.id,expectedVersion:first.version,provider:provider(f,[witness])})).rejects.toBeDefined();
    expect(await logLines(f.logPath)).toHaveLength(0);
  });
  it.skipIf(process.env.TIP076B_SOURCE_RECOVERY_MODE!=="PREPARE")("post-VERIFIED source epoch control prepare",async()=>{
    const f=await fixture();await crashAt(f,"AFTER_VERIFIED",witness);
    const before=await getResearchCampaign(f.owner,f.id);
    expect(before.state.stage?.fence).toBe("VERIFIED");expect(before.state.closure?.status).toBe("CLOSED_EXACT_SCOPE");
    expect(await logLines(f.logPath)).toHaveLength(1);
    // Sanitized fixture identities only. Main installs the next reviewed epoch;
    // neither this test nor the child writes the installed review bundle.
    console.log("TIP076B_VERIFIED_FIXTURE",JSON.stringify({organizationId:f.organizationId,actorUserId:f.owner.user.id,
      workspaceId:f.owner.workspace.id,campaignId:f.id,jobIds:f.jobIds,logPath:f.logPath,sourceBundleDigest:before.sourceBundleDigest,
      closureDigest:before.state.closure?.receiptDigest,eventCount:before.events.length}));
  },30000);
  it.skipIf(process.env.TIP076B_SOURCE_RECOVERY_MODE!=="RESUME")("post-VERIFIED source epoch control resume",async()=>{
    const data=JSON.parse(process.env.TIP076B_SOURCE_RECOVERY_FIXTURE??"null") as {organizationId:string;actorUserId:string;workspaceId:string;campaignId:string;jobIds:string[];logPath:string;sourceBundleDigest:string};
    if(!data?.campaignId||!data.organizationId||!data.actorUserId)throw new Error("Exact owned recovery fixture required");
    const user=await getDb().user.findUniqueOrThrow({where:{id:data.actorUserId},select:{id:true,name:true,email:true}});
    const owner=await contextForMembership(user,data.workspaceId);
    const before=await getResearchCampaign(owner,data.campaignId);
    expect(before.sourceBundleDigest).toBe(data.sourceBundleDigest);expect(before.state.stage?.fence).toBe("VERIFIED");
    const {loadInstalledCampaignBundle}=await import("@/modules/research-sandbox/research-campaign/source-bundle");
    expect((await loadInstalledCampaignBundle()).sourceBundleDigest).not.toBe(data.sourceBundleDigest);
    const f={owner,organizationId:data.organizationId,id:data.campaignId,jobIds:data.jobIds,logPath:data.logPath} as Fixture;
    await expireLease(f);await run(f,[witness]);const after=await getResearchCampaign(owner,data.campaignId);
    expect(await logLines(f.logPath)).toHaveLength(1);expect(after.state.closure).toEqual(before.state.closure);
    expect(after.state.status).toBe(before.state.status);expect(after.state.executionFailure).toBe("INTEGRITY");
    const job=await withOrganizationTenant(data.organizationId,user.id,tx=>tx.durableJob.findUniqueOrThrow({where:{id:data.jobIds[0]}}));
    expect(job.status).toBe("DEAD_LETTER");expect(after.events.slice(before.events.length).some(e=>e.eventType==="EXECUTION_REFUSED")).toBe(true);
  },30000);
});
