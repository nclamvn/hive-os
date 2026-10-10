import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { identityAdmission, proofAttempt, proofBinding, proofContract, proofFeedback, proofMathematics, proofReport } from "../fixtures/lrc-proof-unit-live";
import { digestResearchResult, researchDossierDigest } from "@/modules/research-sandbox/integrity";
import { validateRecordedMathAgentReview } from "@/modules/research-sandbox/agent-review";
import { mathPilotScope } from "@/modules/research-sandbox/math-pilot";
import { prepareLrcProofUnitSolverInput } from "@/modules/research-sandbox/math-lrc-proof-unit-live";

const f=vi.hoisted(()=>({identity:vi.fn(),complete:vi.fn(),fail:vi.fn(),tenant:vi.fn(),env:vi.fn()}));
vi.mock("@/server/tenant-context",()=>({withOrganizationTenant:f.tenant}));
vi.mock("@/server/env",()=>({getEnv:f.env}));
vi.mock("@/modules/command-runtime/jobs",()=>({completeJob:f.complete,failJob:f.fail}));
vi.mock("@/modules/identity-workspace/audit",()=>({AuditEventType:{ResearchCompleted:"completed"},writeAuditEvent:vi.fn()}));
vi.mock("@/modules/identity-workspace",()=>({AuditEventType:{MathPilotAgentReviewed:"reviewed"},writeAuditEvent:vi.fn()}));
vi.mock("@/modules/identity-workspace/policy",()=>({enforceManualProviderPolicy:vi.fn()}));
vi.mock("@/modules/research-sandbox/math-lrc-proof-unit-identity",()=>({importLrcProofUnitIdentity:f.identity}));
import { executeResearchJob } from "@/modules/research-sandbox/worker";
import { executeMathPilotAgentReviewJob } from "@/modules/research-sandbox/agent-review-kernel";

let run:Record<string,unknown>,pilot:Record<string,unknown>,tx:ReturnType<typeof makeTx>,order:string[];
const common={organizationId:"org",actorUserId:"actor",workerId:"owned-worker",expectedVersion:2,correlationId:"correlation",proofUnitTarget:{caseId:proofBinding.caseId,runId:proofBinding.runId}};
const solverJob={id:"solver-job",organizationId:"org",workspaceId:"workspace",jobType:"math-pilot.codex-local.execute",status:"RUNNING",attempts:1,payload:{runId:proofBinding.runId}};
const reviewJob={id:"review-job",organizationId:"org",workspaceId:"workspace",jobType:"math-pilot.codex-local.review",status:"RUNNING",attempts:1,payload:{caseId:proofBinding.caseId}};
function makeTx(){return {
  $queryRaw:vi.fn(async()=>[]),durableJob:{findFirst:vi.fn(async (query:{where:Record<string,unknown>})=>{
    if(query.where.status==="SUCCEEDED") return {id:"solver-job",result:{mathModelAttemptDigest:run.mathModelAttemptDigest}};
    return query.where.jobType==="math-pilot.codex-local.review"?reviewJob:solverJob;
  }),update:vi.fn(async (query:{data:Record<string,unknown>})=>{if(query.data.maxAttempts)order.push("review-fence");return reviewJob;})},
  researchRun:{findFirst:vi.fn(async()=>({...run,mathPilotCase:pilot})),findUniqueOrThrow:vi.fn(async()=>run),
    update:vi.fn(async (query:{data:Record<string,unknown>})=>{if(query.data.providerDispatchAttemptedAt)order.push("solver-fence");Object.assign(run,query.data);return run;}),updateMany:vi.fn()},
  mathPilotCase:{findFirst:vi.fn(async()=>({...pilot,researchRun:run}))},
  researchSourceSnapshot:{create:vi.fn()},researchFinding:{create:vi.fn(async(query:{data:Record<string,unknown>})=>{(run.findings as unknown[]).push({...query.data,id:"finding",sourceId:null,decision:null});return query.data;})},
  outboxEvent:{create:vi.fn(async(query:{data:Record<string,unknown>})=>({id:"auto-review-outbox",...query.data}))},
  mathPilotAgentReview:{create:vi.fn(async(query:{data:Record<string,unknown>})=>{const review={id:"retained-review",...query.data};pilot.agentReview=review;return review;})},
  durableJobEvent:{create:vi.fn()},
};}
beforeEach(()=>{
  vi.stubEnv("NODE_ENV","test");order=[];
  run={id:proofBinding.runId,organizationId:"org",workspaceId:"workspace",missionId:"mission",documentId:null,commandId:"command",question:proofContract.statement,
    scope:mathPilotScope(proofContract),providerName:"codex-local",modelName:"gpt-6-sol",status:"QUEUED",startedAt:null,jobId:"solver-job",
    providerUsage:null,mathModelAttempt:null,mathModelAttemptDigest:null,providerDispatchAttemptedAt:null,sources:[],findings:[],
    sourcePolicy:{allowedDomains:[],primaryDomains:[],requirePrimary:false,maxSources:1},queryPlan:{queries:[proofContract.statement],languages:["en"]}};
  pilot={id:proofBinding.caseId,caseType:"OPEN",organizationId:"org",workspaceId:"workspace",missionId:"mission",contract:structuredClone(proofContract),contractDigest:proofBinding.contractDigest,agentReview:null};
  tx=makeTx();f.tenant.mockImplementation((_org:string,_actor:string,work:(value:typeof tx)=>unknown)=>work(tx));
  f.env.mockReturnValue({MATH_PILOT_QUEUE_ENABLED:true,LRC_CAMPAIGN_LOCAL_ENABLED:true});
  f.identity.mockImplementation(async()=>{order.push("identity");return identityAdmission;});
  f.complete.mockResolvedValue({id:"solver-job",status:"SUCCEEDED"});f.fail.mockResolvedValue({status:"DEAD_LETTER"});
});
afterEach(()=>{vi.clearAllMocks();vi.unstubAllEnvs();});
function provider(){return {providerName:"codex-local",modelName:"gpt-6-sol",execute:vi.fn(async(input:Parameters<import("@/modules/research-sandbox/contracts").ResearchProvider["execute"]>[0])=>{
  order.push("solver");expect(input.lrcProofUnitInput?.inputDigest).toBe(prepareLrcProofUnitSolverInput(proofBinding).inputDigest);
  expect(input.mathPilot?.caseType).toBe("LRC_PROOF_UNIT");expect(input).not.toHaveProperty("lrcCampaignEvidence");
  return {providerName:"codex-local",modelName:"gpt-6-sol",mathAttempt:{...proofMathematics,providerName:"codex-local" as const,modelName:"gpt-6-sol",threadId:"solver-context",usage:proofAttempt().usage},sources:[],findings:[{key:"honest-null",kind:"HONEST_NULL" as const,claim:"No independently captured source span is asserted.",sourceKey:null,exactExcerpt:"",startOffset:null,endOffset:null,confidence:0}]};
})};}
function reviewer(){return {modelName:"gpt-6-sol",roleModels:{CRITIC:"gpt-6-sol",ADVERSARY:"gpt-6-sol"},review:vi.fn(async()=>{throw new Error("legacy fallback forbidden");}),
  reviewProofUnitRole:vi.fn(async(prepared:ReturnType<typeof prepareLrcProofUnitSolverInput>)=>{
    order.push(prepared.role);if(prepared.role==="SOLVER")throw new Error("wrong role");return {...proofReport(prepared.role),threadId:`${prepared.role}-context`,usage:proofAttempt().usage};
  })};}
async function solve(p=provider(),signal?:AbortSignal){await executeResearchJob({...common,jobId:"solver-job",provider:p,signal});return p;}
async function review(r=reviewer(),signal?:AbortSignal){return executeMathPilotAgentReviewJob({...common,jobId:"review-job",reviewer:r,signal});}
describe("TIP-064 actual worker + automatic review kernels, all external boundaries mocked",()=>{
  it("solver payload substitution racing the driver read refuses inside loaded-row boundary",async()=>{
    run.id="sibling-run";const p=provider();await expect(solve(p)).rejects.toThrow("outside its exact target");expect(f.identity).not.toHaveBeenCalled();expect(p.execute).not.toHaveBeenCalled();expect(tx.outboxEvent.create).not.toHaveBeenCalled();
  });
  it("review payload substitution racing the driver read refuses inside loaded-row boundary",async()=>{
    await solve();pilot.id="sibling-case";const r=reviewer();await expect(review(r)).rejects.toThrow("outside its exact target");expect(order).not.toContain("review-fence");expect(r.reviewProofUnitRole).not.toHaveBeenCalled();expect(tx.mathPilotAgentReview.create).not.toHaveBeenCalled();
  });
  it("imports identity before solver fence, transports three exact bindings, retains genuine v6 shape and automatic event",async()=>{
    const p=await solve();expect(order).toEqual(["identity","solver-fence","solver"]);expect(p.execute).toHaveBeenCalledOnce();
    expect(tx.outboxEvent.create).toHaveBeenCalledWith(expect.objectContaining({data:expect.objectContaining({topic:"math-pilot.codex-local.review",aggregateId:proofBinding.caseId})}));
    const r=reviewer();const retained=await review(r);expect(order.slice(3)).toEqual(["review-fence","CRITIC","ADVERSARY"]);
    expect(r.review).not.toHaveBeenCalled();expect(r.reviewProofUnitRole).toHaveBeenCalledTimes(2);
    const ledger=(retained as {ledger:Record<string,unknown>}).ledger;expect(ledger).toMatchObject({version:6,conclusion:"INCONCLUSIVE",proofUnitAuditStatus:"INCONCLUSIVE"});
    expect(validateRecordedMathAgentReview({caseId:proofBinding.caseId,runId:proofBinding.runId,contract:pilot.contract,contractDigest:proofBinding.contractDigest,
      attempt:run.mathModelAttempt,attemptDigest:run.mathModelAttemptDigest as string,researchDigest:researchDossierDigest(run as never),review:retained})).not.toBeNull();
    expect(tx.durableJob.update).toHaveBeenLastCalledWith(expect.objectContaining({data:expect.objectContaining({status:"SUCCEEDED",lockedBy:null,leaseExpiresAt:null})}));
  });
  it.each(["drift","deadline","bytes"])("identity %s failure never crosses solver fence or calls provider",async failure=>{
    f.identity.mockRejectedValue(new Error(failure));const p=provider();await expect(solve(p)).rejects.toThrow();expect(order).not.toContain("solver-fence");expect(p.execute).not.toHaveBeenCalled();expect(f.fail).toHaveBeenCalledWith(expect.objectContaining({retryable:false}));
  });
  it("malformed v3 proof scope cannot enter generic OPEN provider",async()=>{
    pilot.contract={...proofContract,lrcProofUnitScope:null};const p=provider();await expect(solve(p)).rejects.toThrow();expect(p.execute).not.toHaveBeenCalled();expect(f.identity).not.toHaveBeenCalled();
  });
  it("queue closure refuses after identity but before dispatch fence",async()=>{
    f.env.mockReturnValue({MATH_PILOT_QUEUE_ENABLED:false,LRC_CAMPAIGN_LOCAL_ENABLED:true});const p=provider();await expect(solve(p)).rejects.toThrow();expect(order).not.toContain("solver-fence");expect(p.execute).not.toHaveBeenCalled();
  });
  it.each(["lrcProofUnitEvidence","lrcProofUnitInput"])("provider %s echo refuses retention and never retries",async key=>{
    const p=provider();p.execute.mockImplementation(async()=>({providerName:"codex-local",modelName:"gpt-6-sol",mathAttempt:{...proofAttempt(),[key]:proofAttempt().lrcProofUnitEvidence},sources:[],findings:[]}));
    await expect(solve(p)).rejects.toThrow();expect(p.execute).toHaveBeenCalledOnce();expect(tx.outboxEvent.create).not.toHaveBeenCalled();expect(run.mathModelAttempt).toBeNull();
  });
  it("case drift at provider fence refuses paid dispatch",async()=>{
    tx.mathPilotCase.findFirst.mockImplementation(async()=>({...pilot,contractDigest:"a".repeat(64),researchRun:run}));const p=provider();await expect(solve(p)).rejects.toThrow();expect(p.execute).not.toHaveBeenCalled();
  });
  it.each(["before-fence","before-retention"])("expired solver lease %s refuses dispatch/retention",async stage=>{
    let reads=0;tx.durableJob.findFirst.mockImplementation(async()=>{reads++;return (reads>=(stage==="before-fence"?2:3)?null:solverJob) as never;});
    const p=provider();await expect(solve(p)).rejects.toThrow();expect(p.execute).toHaveBeenCalledTimes(stage==="before-fence"?0:1);expect(tx.outboxEvent.create).not.toHaveBeenCalled();
  });
  it.each(["before-fence","before-retention"])("solver payload drift %s refuses lineage",async stage=>{
    let reads=0;tx.durableJob.findFirst.mockImplementation(async()=>{reads++;return {...solverJob,payload:{runId:reads>=(stage==="before-fence"?2:3)?"sibling":proofBinding.runId}} as never;});
    const p=provider();await expect(solve(p)).rejects.toThrow();expect(p.execute).toHaveBeenCalledTimes(stage==="before-fence"?0:1);expect(tx.outboxEvent.create).not.toHaveBeenCalled();
  });
  it("an already-aborted solver refuses before identity import and fence",async()=>{
    const controller=new AbortController();controller.abort();const p=provider();await expect(solve(p,controller.signal)).rejects.toThrow();expect(f.identity).not.toHaveBeenCalled();expect(p.execute).not.toHaveBeenCalled();
  });
  it("case drift after provider return refuses retention",async()=>{
    const p=provider();const execute=p.execute.getMockImplementation()!;p.execute.mockImplementation(async input=>{const result=await execute(input);pilot.contractDigest="a".repeat(64);return result;});
    await expect(solve(p)).rejects.toThrow();expect(p.execute).toHaveBeenCalledOnce();expect(tx.outboxEvent.create).not.toHaveBeenCalled();
  });
  it("already-retained v3 completes without re-import/provider/backfill",async()=>{
    run.status="AWAITING_REVIEW";run.mathModelAttempt=proofAttempt();run.mathModelAttemptDigest=digestResearchResult(run.mathModelAttempt);const p=provider();await solve(p);
    expect(f.identity).not.toHaveBeenCalled();expect(p.execute).not.toHaveBeenCalled();expect(f.complete).toHaveBeenCalledOnce();
  });
  it("prepared full review escaping overflow refuses before review fence and either role",async()=>{
    await solve();const attempt=run.mathModelAttempt as ReturnType<typeof proofAttempt>;attempt.argument='"'.repeat(10000);run.mathModelAttemptDigest=digestResearchResult(attempt);
    const r=reviewer();await expect(review(r)).rejects.toThrow();expect(order).not.toContain("review-fence");expect(r.reviewProofUnitRole).not.toHaveBeenCalled();
  });
  it("missing prospective review seam never falls back to legacy review",async()=>{
    await solve();const r=reviewer();await expect(executeMathPilotAgentReviewJob({...common,jobId:"review-job",reviewer:{modelName:r.modelName,review:r.review}})).rejects.toThrow();expect(order).not.toContain("review-fence");expect(r.review).not.toHaveBeenCalled();
  });
  it.each(["same-solver-thread","same-review-thread","host-input-echo","wrong-role","missing-usage"])("review %s refuses ledger retention",async failure=>{
    await solve();const r=reviewer();r.reviewProofUnitRole.mockImplementation(async prepared=>{
      const role=prepared.role as "CRITIC"|"ADVERSARY";return {...proofReport(failure==="wrong-role"?"ADVERSARY":role),threadId:failure==="same-solver-thread"?"solver-context":failure==="same-review-thread"?"reused":`${role}-context`,
        usage:failure==="missing-usage"?undefined:proofAttempt().usage,...(failure==="host-input-echo"?{lrcProofUnitInput:prepared}:{})} as never;
    });await expect(review(r)).rejects.toThrow();expect(tx.mathPilotAgentReview.create).not.toHaveBeenCalled();
  });
  it("abort after critic prevents a new adversary role and ledger",async()=>{
    await solve();const controller=new AbortController();const r=reviewer();const execute=r.reviewProofUnitRole.getMockImplementation()!;
    r.reviewProofUnitRole.mockImplementation(async prepared=>{const result=await execute(prepared);controller.abort();return result;});
    await expect(review(r,controller.signal)).rejects.toThrow();expect(r.reviewProofUnitRole).toHaveBeenCalledOnce();expect(tx.mathPilotAgentReview.create).not.toHaveBeenCalled();
  });
  it("critic return survives locally when adversary fails, no retained partial ledger/no retry",async()=>{
    await solve();const r=reviewer();const returned:string[]=[];r.reviewProofUnitRole.mockImplementation(async prepared=>{
      if(prepared.role==="ADVERSARY")throw new Error("provider failure");returned.push(prepared.role);return {...proofReport("CRITIC"),threadId:"CRITIC-context",usage:proofAttempt().usage};
    });await expect(review(r)).rejects.toThrow();expect(returned).toEqual(["CRITIC"]);expect(r.reviewProofUnitRole).toHaveBeenCalledTimes(2);expect(tx.mathPilotAgentReview.create).not.toHaveBeenCalled();
  });
  it("attempt drift during roles refuses retention under advisory/lease fence",async()=>{
    await solve();const r=reviewer();const execute=r.reviewProofUnitRole.getMockImplementation()!;r.reviewProofUnitRole.mockImplementation(async prepared=>{const result=await execute(prepared);run.mathModelAttemptDigest="a".repeat(64);return result;});
    await expect(review(r)).rejects.toThrow();expect(tx.mathPilotAgentReview.create).not.toHaveBeenCalled();
  });
  it("expired review lease after roles refuses retention",async()=>{
    await solve();tx.durableJob.findFirst.mockImplementation(async(query)=>{
      if(query.where.status==="SUCCEEDED")return {id:"solver-job",result:{mathModelAttemptDigest:run.mathModelAttemptDigest}} as never;
      if(order.includes("ADVERSARY"))return null as never;return reviewJob as never;
    });await expect(review()).rejects.toThrow();expect(tx.mathPilotAgentReview.create).not.toHaveBeenCalled();
  });
  it("review payload changed during roles refuses lineage retention",async()=>{
    await solve();tx.durableJob.findFirst.mockImplementation(async(query)=>{
      if(query.where.status==="SUCCEEDED")return {id:"solver-job",result:{mathModelAttemptDigest:run.mathModelAttemptDigest}} as never;
      return {...reviewJob,payload:{caseId:order.includes("ADVERSARY")?"sibling":proofBinding.caseId}} as never;
    });await expect(review()).rejects.toThrow("payload changed");expect(tx.mathPilotAgentReview.create).not.toHaveBeenCalled();
  });
  it("solver post-return abort stops retention and automatic review",async()=>{
    const controller=new AbortController();const p=provider();const execute=p.execute.getMockImplementation()!;p.execute.mockImplementation(async input=>{const result=await execute(input);controller.abort();return result;});
    await expect(solve(p,controller.signal)).rejects.toThrow();expect(p.execute).toHaveBeenCalledOnce();expect(tx.outboxEvent.create).not.toHaveBeenCalled();
  });
  it("invalid feedback is not retained or repaired",async()=>{
    const p=provider();const execute=p.execute.getMockImplementation()!;p.execute.mockImplementation(async input=>{const result=await execute(input);return {...result,mathAttempt:{...result.mathAttempt,lrcProofUnitFeedback:{...proofFeedback,premiseFindings:[]}}} as never;});
    await expect(solve(p)).rejects.toThrow();expect(tx.outboxEvent.create).not.toHaveBeenCalled();
  });
});
