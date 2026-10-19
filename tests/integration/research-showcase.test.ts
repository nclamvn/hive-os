import { randomUUID,createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { describe,it,expect,vi } from "vitest";
import { createMission } from "@/modules/mission-kernel";
import { createScopedGrant } from "@/modules/authorization";
import { claimJobs,dispatchOutboxBatch } from "@/modules/command-runtime";
import { requestPoly19Showcase,getPoly19Showcase,getPoly19ShowcaseDossier,revokePoly19Showcase } from "@/modules/research-showcase";
import { assertShowcaseEnvironment,loadShowcaseBundle } from "@/modules/research-showcase/source";
import { showcaseJobType,showcaseLimits,type ShowcaseRole } from "@/modules/research-showcase/contracts";
import type { EngineeringQaFault } from "@/modules/research-showcase/engineering";
import { verifyPoly19Certificate } from "@/modules/research-showcase/checker";
import { loadShowcaseCut } from "@/modules/research-showcase/store";
import { getDb } from "@/server/db";
import { getEnv } from "@/server/env";
import { withOrganizationTenant } from "@/server/tenant-context";
import { executePoly19ShowcaseJob,runPoly19ShowcaseWorkerCycle } from "@/server/workers/research-showcase-cycle";
import { asOwner,createUser,ownerQuery } from "./helpers";

// No truncate, delete, shared-source mutation, migrations or native effects.
// Each test owns a fresh organization and retains the exact durable history.
function guard() {
  assertShowcaseEnvironment();
  const url=new URL(getEnv().DATABASE_MIGRATION_URL!);
  if(!["localhost","127.0.0.1"].includes(url.hostname)||url.port!=="5433"||url.pathname!=="/hiveos_test")throw new Error("ISOLATED_OWNER_DATABASE_REQUIRED");
}
async function fixture() {
  guard();const owner=await asOwner(await createUser("TIP079A-QA")),mission=await createMission(owner,{title:"TIP079A owned ENGINEERING_ONLY control"});
  const organizationId=(await getDb().workspace.findUniqueOrThrow({where:{id:owner.workspace.id},select:{organizationId:true}})).organizationId;
  const request={missionId:mission.id,idempotencyKey:`TIP079A:${randomUUID()}`,confirmed:true as const,provenance:"ENGINEERING_ONLY" as const};
  const approved=await requestPoly19Showcase(owner,request);
  const dispatch=await dispatchOutboxBatch({organizationId,actorUserId:owner.user.id,workerId:`TIP079A-dispatch-${randomUUID()}`,outboxIds:approved.outboxEventIds});
  expect(dispatch.jobIds).toHaveLength(1);
  return {owner,mission,organizationId,request,approved,runId:approved.runId,jobId:dispatch.jobIds[0]};
}
type Fixture=Awaited<ReturnType<typeof fixture>>;
async function run(f:Fixture) {
  return runPoly19ShowcaseWorkerCycle({organizationId:f.organizationId,actorUserId:f.owner.user.id,workerId:`TIP079A-${randomUUID()}`,jobIds:[f.jobId],outboxIds:[]});
}
async function claim(f:Fixture) {
  const workerId=`TIP079A-host-${randomUUID()}`;
  const jobs=await claimJobs({organizationId:f.organizationId,actorUserId:f.owner.user.id,workerId,jobTypes:[showcaseJobType],jobIds:[f.jobId],first:1,leaseSeconds:30});
  expect(jobs).toHaveLength(1);return {organizationId:f.organizationId,actorUserId:f.owner.user.id,workerId,jobId:f.jobId,expectedVersion:jobs[0].version};
}
async function expireOwnLease(f:Fixture) {
  guard();const expired=await withOrganizationTenant(f.organizationId,f.owner.user.id,tx=>tx.durableJob.updateMany({where:{id:f.jobId,organizationId:f.organizationId,status:"RUNNING"},data:{leaseExpiresAt:new Date(Date.now()-1000)}}));
  expect(expired.count).toBe(1);
}
async function killAt(f:Fixture,boundary:"BEFORE_START"|"AFTER_START"|"AFTER_RESULT"|"AFTER_CHECK",role?:ShowcaseRole,engineeringFault?:EngineeringQaFault) {
  guard();const child=spawn(process.execPath,["--import","tsx","tests/fixtures/research-showcase-worker.ts",JSON.stringify({organizationId:f.organizationId,actorUserId:f.owner.user.id,
    workerId:`TIP079A-child-${randomUUID()}`,jobId:f.jobId,boundary,role,engineeringFault})],{cwd:process.cwd(),env:{...process.env,VITEST:"true"},stdio:["ignore","pipe","pipe","ipc"]});
  let stderr="";child.stderr?.on("data",b=>{stderr=(stderr+b.toString()).slice(-512);});
  await new Promise<void>((resolve,reject)=>{
    const timer=setTimeout(()=>{child.kill("SIGKILL");reject(new Error(`Owned crash fixture boundary timeout ${boundary}; ${stderr}`));},15000);
    child.on("message",message=>{const m=message as {boundary?:string;failed?:boolean;code?:string};if(m.boundary===boundary){clearTimeout(timer);resolve();}else if(m.failed){clearTimeout(timer);reject(new Error(`Owned fixture refused ${m.code}`));}});
    child.on("exit",(code,signal)=>{if(code!==null||signal){clearTimeout(timer);reject(new Error(`Owned fixture exited before crash boundary ${code??signal}`));}});
  });
  await new Promise<void>(resolve=>{child.once("exit",()=>resolve());child.kill("SIGKILL");});
  await expireOwnLease(f);
}
async function assertCompleted(f:Fixture) {
  const view=await getPoly19Showcase(f.owner,f.runId);
  expect(view.provenance).toBe("ENGINEERING_ONLY");expect(view.status).toBe("COMPLETED");expect(view.state.spent.requests).toBe(4);expect(view.state.spent.replayChecks).toBe(2);
  expect(view.roles).toHaveLength(4);expect(view.roles.every(r=>r.validated&&r.originalComplete&&r.traceComplete)).toBe(true);expect(new Set(view.roles.map(r=>r.threadId)).size).toBe(4);
  expect(view.roles.every(r=>r.usage===null&&r.actualModelVersion===null&&r.remoteEffect==="NONE")).toBe(true);
  expect(view.exactResult?.status).toBe("VERIFIED_POLY19_CYCLOTOMIC_CONSTRUCTION");expect(view.faultResult?.status).toBe("INCONCLUSIVE");expect(view.postreview?.status).toBe("INCONCLUSIVE");
  expect(view.events.filter(e=>e.eventType==="ROLE_STARTED")).toHaveLength(4);return view;
}
describe("TIP079A actual isolated authenticated ENGINEERING_ONLY durable pipeline",()=>{
  it("deduplicates actual approval/outbox and independently replays exact original+fault bytes",async()=>{
    const f=await fixture();expect(await requestPoly19Showcase(f.owner,f.request)).toEqual(f.approved);
    const duplicated=await dispatchOutboxBatch({organizationId:f.organizationId,actorUserId:f.owner.user.id,workerId:"TIP079A-repeat",outboxIds:f.approved.outboxEventIds});expect(duplicated.dispatched).toBe(0);
    await run(f);const view=await assertCompleted(f),dossier=await getPoly19ShowcaseDossier(f.owner,f.runId);
    expect(dossier.view.eventCut).toEqual(view.eventCut);expect(dossier.eventPayloads).toHaveLength(view.events.length);expect(dossier.traces).toHaveLength(4);
    for(const trace of dossier.traces){const bytes=Buffer.from(trace.base64,"base64");expect(bytes.length).toBe(trace.bytes);expect(createHash("sha256").update(bytes).digest("hex")).toBe(trace.digest);}
    const final=JSON.parse(view.originalFinal!);expect(final.certificateJson).toBe(view.certificateJson);expect(view.certificateDigest).toBe(createHash("sha256").update(view.certificateJson!).digest("hex"));
    expect(view.certificateJson).not.toBe(view.faultCertificateJson);
    const bundle=await loadShowcaseBundle(),deadline=()=>new Date(Date.now()+30000).toISOString();
    // Separate disclosed QA checking overhead, not refunded/relabelled as arm work.
    const exact=await verifyPoly19Certificate(view.certificateJson!,new AbortController().signal,deadline(),bundle.sourcePins);
    const fault=await verifyPoly19Certificate(view.faultCertificateJson!,new AbortController().signal,deadline(),bundle.sourcePins);
    expect(exact.status).toBe("VERIFIED_POLY19_CYCLOTOMIC_CONSTRUCTION");expect(fault.status).toBe("INCONCLUSIVE");expect(fault.factorIdentity).toBe(false);
    const originalClaim=view.certificateJson!.match(/"claimed_value"\s*:\s*(-?\d+)/)![1],faultClaim=view.faultCertificateJson!.match(/"claimed_value"\s*:\s*(-?\d+)/)![1];
    expect(originalClaim).toBe(faultClaim);
    const coefficients=view.faultCertificateJson!.match(/"coefficients"\s*:\s*\[([^\]]+)\]/)![1].split(",").map(s=>BigInt(s.trim()));
    let scalar=BigInt(0);for(const coefficient of coefficients.toReversed())scalar=scalar*BigInt(19)+coefficient;
    expect(scalar.toString()).toBe(originalClaim);expect(exact.computedValue).toBe(originalClaim);
  },30000);
  it("refuses native request before any aggregate/outbox/effect",async()=>{
    const f=await fixture();await expect(requestPoly19Showcase(f.owner,{...f.request,idempotencyKey:`TIP079-live:${randomUUID()}`,provenance:"LIVE_NATIVE"})).rejects.toThrow("CONTAINMENT_UNESTABLISHED");
    const counts=await withOrganizationTenant(f.organizationId,f.owner.user.id,async tx=>({runs:await tx.researchShowcaseRun.count(),outbox:await tx.outboxEvent.count({where:{topic:showcaseJobType}})}));expect(counts).toEqual({runs:1,outbox:1});
  });
  it("enforces tenant invisibility and event append-only privileges",async()=>{
    const f=await fixture(),other=await asOwner(await createUser("TIP079-other"));await expect(getPoly19Showcase(other,f.runId)).rejects.toBeDefined();
    const org=(await getDb().workspace.findUniqueOrThrow({where:{id:other.workspace.id},select:{organizationId:true}})).organizationId;
    expect(await withOrganizationTenant(org,other.user.id,tx=>tx.researchShowcaseRun.findMany({where:{id:f.runId}}))).toEqual([]);
    await expect(withOrganizationTenant(f.organizationId,f.owner.user.id,tx=>tx.researchShowcaseEvent.updateMany({where:{runId:f.runId},data:{eventType:"FORGED"}}))).rejects.toBeDefined();
    const privileges=await ownerQuery<{updates:boolean;deletes:boolean}>("SELECT has_table_privilege('hiveos_app','research_showcase_event','UPDATE') AS updates,has_table_privilege('hiveos_app','research_showcase_event','DELETE') AS deletes");expect(privileges[0]).toEqual({updates:false,deletes:false});
  });
  it("two actual concurrent claims cannot double-admit a role",async()=>{const f=await fixture();await Promise.all([run(f),run(f)]);await assertCompleted(f);});
  it("current mission DENY stops an approved run before any role reservation",async()=>{
    const f=await fixture();await createScopedGrant(f.owner,{subjectType:"USER",subjectUserId:f.owner.user.id,role:"CONTRIBUTOR",effect:"DENY",scopeType:"MISSION",missionId:f.mission.id,reason:"TIP079 own QA authority negative control"});
    await run(f);await expect(getPoly19Showcase(f.owner,f.runId)).rejects.toMatchObject({name:"AuthorizationError"});
    // The subject's CONTRIBUTOR DENY also covers research.read. Inspect only
    // this owned fault fixture through its guarded tenant, not a public bypass.
    const cut=await withOrganizationTenant(f.organizationId,f.owner.user.id,async tx=>{const row=await tx.researchShowcaseRun.findFirstOrThrow({where:{id:f.runId,workspaceId:f.owner.workspace.id}});return loadShowcaseCut(tx,row);});
    expect(cut.state.status).toBe("FAILED");expect(cut.state.spent.requests).toBe(0);expect(cut.state.roles).toHaveLength(0);
  });
  it("current inactive workspace membership stops before START",async()=>{
    const f=await fixture();await getDb().membership.update({where:{id:f.owner.membership.id},data:{status:"SUSPENDED"}});await run(f);
    const row=await withOrganizationTenant(f.organizationId,f.owner.user.id,tx=>tx.researchShowcaseRun.findFirstOrThrow({where:{id:f.runId}}));expect((row.state as unknown as {spent:{requests:number}}).spent.requests).toBe(0);expect(row.status).toBe("FAILED");
  });
  it("stale worker version cannot reserve or adopt",async()=>{
    const f=await fixture(),input=await claim(f);await expect(executePoly19ShowcaseJob({...input,expectedVersion:input.expectedVersion-1})).rejects.toBeDefined();
    expect((await getPoly19Showcase(f.owner,f.runId)).state.spent.requests).toBe(0);
  });
  it("a copied same-tenant job payload without approved outbox lineage cannot start",async()=>{
    const f=await fixture(),input=await claim(f);
    await withOrganizationTenant(f.organizationId,f.owner.user.id,tx=>tx.durableJob.update({where:{id:f.jobId},data:{outboxEventId:null}}));
    await expect(executePoly19ShowcaseJob(input)).rejects.toBeDefined();expect((await getPoly19Showcase(f.owner,f.runId)).state.spent.requests).toBe(0);
  });
  it("revocation after durable START fences even engineering provider adoption",async()=>{
    const f=await fixture(),input=await claim(f),observed:{fired:number;outcome:Awaited<ReturnType<typeof revokePoly19Showcase>>|null}={fired:0,outcome:null};
    await executePoly19ShowcaseJob({...input,onBoundary:async(b,role)=>{if(b==="AFTER_START"&&role==="ATTEMPT"){
      observed.fired++;const v=await getPoly19Showcase(f.owner,f.runId);observed.outcome=await revokePoly19Showcase(f.owner,{runId:f.runId,expectedVersion:v.version,idempotencyKey:`TIP079-revoke:${randomUUID()}`});}}});
    expect(observed.fired).toBe(1);expect(observed.outcome?.status).toBe("SUCCEEDED");
    const v=await getPoly19Showcase(f.owner,f.runId);expect(v.status).toBe("REVOKED");expect(v.revokedAt).not.toBeNull();expect(v.state.spent.requests).toBe(1);expect(v.roles[0].original).toBeNull();
  });
  it("original whole-run deadline cannot be renewed by a resumed worker",async()=>{
    const f=await fixture(),input=await claim(f),now=Date.now();const clock=vi.spyOn(Date,"now").mockReturnValue(now+showcaseLimits.wallMilliseconds+1000);
    try{await executePoly19ShowcaseJob(input);}finally{clock.mockRestore();}
    const v=await getPoly19Showcase(f.owner,f.runId);expect(v.status).toBe("RESOURCE_STOP");expect(v.state.spent.requests).toBe(0);
  });
  it("SIGKILL before START resumes its same reservation without a fifth request",async()=>{const f=await fixture();await killAt(f,"BEFORE_START","ATTEMPT");expect((await getPoly19Showcase(f.owner,f.runId)).roles[0].fence).toBe("RESERVED");await run(f);await assertCompleted(f);},30000);
  it("SIGKILL after START pauses and never blindly repeats",async()=>{const f=await fixture();await killAt(f,"AFTER_START","ATTEMPT");await run(f);const v=await getPoly19Showcase(f.owner,f.runId);expect(v.status).toBe("PAUSED_FOR_DECISION");expect(v.state.spent.requests).toBe(1);expect(v.roles[0].original).toBeNull();expect(v.events.filter(e=>e.eventType==="ROLE_STARTED")).toHaveLength(1);},30000);
  it.each(["ATTEMPT","POSTREVIEW"] as const)("SIGKILL after retained %s recovers admission without repeating provider work",async role=>{const f=await fixture();await killAt(f,"AFTER_RESULT",role);const before=await getPoly19Showcase(f.owner,f.runId);expect(before.roles.at(-1)?.validated).toBe(false);await run(f);await assertCompleted(f);},30000);
  it.each(["UNKNOWN","MALFORMED","OVERSIZE","OVERSIZE_UTF8","FAILED"] as const)("SIGKILL after retained fixed %s control cannot advance to CRITIC",async fault=>{
    const f=await fixture();await killAt(f,"AFTER_RESULT","ATTEMPT",fault);await run(f);const v=await getPoly19Showcase(f.owner,f.runId);
    expect(v.status).toBe(fault==="UNKNOWN"?"PAUSED_FOR_DECISION":"FAILED");expect(v.roles).toHaveLength(1);expect(v.roles[0].validated).toBe(false);expect(v.roles[0].original).not.toBeNull();expect(v.state.spent.requests).toBe(1);expect(v.events.filter(e=>e.eventType==="ROLE_STARTED")).toHaveLength(1);
    if(fault==="OVERSIZE_UTF8") {const dossier=await getPoly19ShowcaseDossier(f.owner,f.runId);expect(v.roles[0].originalText).toBeNull();expect(dossier.incompleteOriginals).toHaveLength(1);
      const prefix=Buffer.from(dossier.incompleteOriginals[0].base64,"base64");expect(prefix.length).toBe(showcaseLimits.originalBytes);expect(prefix.at(-1)).toBe(0xe2);expect(()=>new TextDecoder("utf8",{fatal:true}).decode(prefix)).toThrow();
      expect(createHash("sha256").update(prefix).digest("hex")).toBe(v.roles[0].original!.digest);}
  },30000);
  it("known malformed output is retained before the immediate refusal",async()=>{const f=await fixture(),input=await claim(f);await executePoly19ShowcaseJob({...input,engineeringFault:"MALFORMED"});const v=await getPoly19Showcase(f.owner,f.runId);expect(v.status).toBe("FAILED");expect(v.roles[0].originalText).toBe('{"proof":');expect(v.roles[0].trace).not.toBeNull();});
  it("SIGKILL after exact replay preserves the replay charge and continues only the fault stage",async()=>{const f=await fixture();await killAt(f,"AFTER_CHECK");const before=await getPoly19Showcase(f.owner,f.runId);expect(before.state.replayFence).toBe("RETAINED");expect(before.state.spent.replayChecks).toBe(1);await run(f);const after=await assertCompleted(f);expect(after.events.filter(e=>e.eventType==="REPLAY_STARTED")).toHaveLength(1);},30000);
});
