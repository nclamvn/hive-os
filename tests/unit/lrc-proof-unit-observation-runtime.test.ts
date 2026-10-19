import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ObservationBudget } from "@/server/operations/lrc-controlled-observation";
import { observeLrcProofUnitOnce } from "@/server/operations/lrc-proof-unit-observation";
import { proofAttempt,proofBinding,proofMathematics,proofReport } from "../fixtures/lrc-proof-unit-live";
import { prepareLrcProofUnitReviewInput,prepareLrcProofUnitSolverInput } from "@/modules/research-sandbox/math-lrc-proof-unit-live";
import { digestResearchResult } from "@/modules/research-sandbox/integrity";

const fixtures = vi.hoisted(() => ({
  db: { user: { findUnique: vi.fn() }, workspace: { findMany: vi.fn() }, membership: { findUnique: vi.fn() } },
  tx: { organizationMembership: { findUnique: vi.fn() }, mathPilotCase: { findMany: vi.fn(), findFirst: vi.fn() }, durableJob: { findFirst: vi.fn(),findMany:vi.fn() },outboxEvent:{findFirst:vi.fn()} },
  authorize: vi.fn(), calibration: vi.fn(), getEnv: vi.fn(), request: vi.fn(),
}));
vi.mock("@/server/db", () => ({ getDb: () => fixtures.db }));
vi.mock("@/server/env", () => ({ getEnv: fixtures.getEnv }));
vi.mock("@/server/tenant-context", () => ({ withOrganizationTenant: (_organization: string, _actor: string,
  work: (tx: typeof fixtures.tx) => unknown) => work(fixtures.tx) }));
vi.mock("@/modules/authorization", () => ({ authorize: fixtures.authorize }));
vi.mock("@/modules/command-runtime/jobs", () => ({ claimJobs: vi.fn(), failJob: vi.fn() }));
vi.mock("@/modules/command-runtime/kernel", () => ({ dispatchOutboxBatch: vi.fn() }));
vi.mock("@/modules/research-sandbox/kernel", () => ({ requestResearchRun: fixtures.request, listMathPilotCases: vi.fn() }));
vi.mock("@/modules/research-sandbox/math-dossier-loader", () => ({ loadMathCalibrationReadiness: fixtures.calibration }));
vi.mock("@/modules/research-sandbox/worker", () => ({ executeResearchJob: vi.fn() }));
vi.mock("@/modules/research-sandbox/agent-review-kernel", () => ({ executeMathPilotAgentReviewJob: vi.fn() }));

import { createProofUnitObservationRuntime } from "@/server/operations/lrc-proof-unit-observation-runtime";
import { executeResearchJob } from "@/modules/research-sandbox/worker";
import { executeMathPilotAgentReviewJob } from "@/modules/research-sandbox/agent-review-kernel";
import { CodexLocalMathProvider } from "@/modules/research-sandbox/adapters/codex-local-math";
import { CodexLocalMathReviewer } from "@/modules/research-sandbox/adapters/codex-local-review";
import { claimJobs,failJob } from "@/modules/command-runtime/jobs";
import { dispatchOutboxBatch } from "@/modules/command-runtime/kernel";
beforeEach(() => {
  vi.stubEnv("NODE_ENV", "development"); vi.stubEnv("DATABASE_URL", "postgresql://offline@127.0.0.1/hiveos_dev?schema=public");
  vi.stubEnv("DEPLOYMENT_ENV", "development");
  for (const key of ["RESEARCH_WORKER_ENABLED", "RESEARCH_OPENAI_ENABLED", "SANDBOX_DOCKER_ENABLED"]) vi.stubEnv(key, "false");
  vi.stubEnv("MATH_REVIEW_ADVERSARY_MODEL", "gpt-6-sol");
  fixtures.db.user.findUnique.mockResolvedValue({ id: "explicit", name: "Explicit actor", email: "explicit@test.invalid" });
  fixtures.db.workspace.findMany.mockResolvedValue([{ id: "workspace", organizationId: "org", slug: "mathematics-pilot-lab-156de0", status: "ACTIVE", name: "Math" }]);
  fixtures.db.membership.findUnique.mockResolvedValue({ id: "membership", status: "ACTIVE", role: "OWNER" });
  fixtures.tx.organizationMembership.findUnique.mockResolvedValue({ status: "ACTIVE" });
  fixtures.authorize.mockResolvedValue({ allowed: true });
  fixtures.calibration.mockResolvedValue({ passed: new Set(["CALIBRATION_PROOF", "CALIBRATION_COUNTEREXAMPLE"]), complete: true, inspected: 2 });
  fixtures.getEnv.mockReturnValue({ RESEARCH_CODEX_LOCAL_ENABLED: true, MATH_PILOT_QUEUE_ENABLED: false, LRC_CAMPAIGN_LOCAL_ENABLED: false, RESEARCH_WORKER_ENABLED: false });
  fixtures.tx.durableJob.findFirst.mockResolvedValue({ id: "old-terminal-review" });
  fixtures.tx.mathPilotCase.findFirst.mockResolvedValue({ id: "created-case" });
  fixtures.request.mockResolvedValue({ commandId: "created-command", status: "SUCCEEDED", outcome: { runId: "created-run" }, outboxEventIds: ["created-outbox"] });
});
afterEach(() => { vi.unstubAllEnvs(); vi.clearAllMocks(); vi.restoreAllMocks(); });
function preflight(activeCycles: Array<{ id: string }>, status = "AWAITING_REVIEW") {
  fixtures.tx.mathPilotCase.findMany.mockResolvedValue([{ id: "old-case", researchRun: { status }, agentReview: null, researchCycles: activeCycles }]);
  return createProofUnitObservationRuntime({ actor: { userId: "explicit" }, mode: "preflight",
    receipt: { append: async () => {} }, budget: new ObservationBudget(performance.now()) }).preflight();
}
describe("TIP-064 runtime preflight mocked DB only", () => {
  it("actual wrapper retains solver and completed critic usage/bindings even when adversary fails",async()=>{
    fixtures.tx.mathPilotCase.findMany.mockResolvedValue([]);const records:Record<string,unknown>[]=[];
    const runtime=createProofUnitObservationRuntime({actor:{userId:"explicit"},mode:"preflight",receipt:{append:async record=>{records.push(record);}},budget:new ObservationBudget(performance.now())});
    const ready=await runtime.preflight();const created=await runtime.create(ready.identity);
    const binding={...proofBinding,caseId:created.caseId,runId:created.runId};
    fixtures.tx.durableJob.findFirst.mockResolvedValue({jobType:"math-pilot.codex-local.execute",outboxEventId:"created-outbox",attempts:1,payload:{runId:created.runId}});
    vi.spyOn(CodexLocalMathProvider.prototype,"execute").mockResolvedValue({providerName:"codex-local",modelName:"gpt-6-sol",mathAttempt:{...proofMathematics,providerName:"codex-local",modelName:"gpt-6-sol",threadId:"actual-solver",usage:proofAttempt().usage},sources:[],findings:[]});
    vi.mocked(executeResearchJob).mockImplementation(async input=>{await input.provider.execute({missionId:"mission",documentId:null,question:"offline",scope:"offline",providerName:"codex-local",modelName:"gpt-6-sol",sourcePolicy:{allowedDomains:[],primaryDomains:[],requirePrimary:false,maxSources:1},queryPlan:{queries:["offline"],languages:["en"]},lrcProofUnitInput:prepareLrcProofUnitSolverInput(binding)});return {} as never;});
    await runtime.solver(ready.identity,created,{id:"solver",version:2,attempts:1,outboxId:"created-outbox"},new AbortController().signal);
    vi.spyOn(CodexLocalMathReviewer.prototype,"reviewProofUnitRole").mockImplementation(async prepared=>{
      if(prepared.role==="ADVERSARY")throw new Error("opaque model failure");return {...proofReport("CRITIC"),threadId:"actual-critic",usage:proofAttempt().usage};
    });
    vi.mocked(executeMathPilotAgentReviewJob).mockImplementation(async input=>{
      const attempt=proofAttempt();for(const role of ["CRITIC","ADVERSARY"] as const)await input.reviewer.reviewProofUnitRole!(prepareLrcProofUnitReviewInput({...binding,role,solverAttempt:attempt,solverAttemptDigest:digestResearchResult(attempt)}),attempt);return {} as never;
    });
    fixtures.tx.durableJob.findFirst.mockResolvedValue({jobType:"math-pilot.codex-local.review",outboxEventId:"review-outbox",attempts:1,payload:{caseId:created.caseId}});
    await expect(runtime.review(ready.identity,created,{id:"review",version:2,attempts:1,outboxId:"review-outbox"},new AbortController().signal,()=>{})).rejects.toThrow();
    const returns=records.filter(row=>row.event==="ROLE_RETURNED");expect(returns.map(row=>row.role)).toEqual(["SOLVER","CRITIC"]);
    for(const row of returns)expect(row).toMatchObject({usage:{inputTokens:100,outputTokens:50},packetDigest:expect.any(String),sourceDataDigest:expect.any(String),inputDigest:expect.any(String),promptDigest:expect.any(String),promptBytes:expect.any(Number),outputSchemaDigest:expect.any(String)});
    expect(records.filter(row=>row.event==="ROLE_STARTED").map(row=>row.attemptedRoles)).toEqual([1,2,3]);
    expect(JSON.stringify(records)).not.toContain("opaque model failure");
  });
  it.each(["outbox","dispatched-job","claimed-job","preexecute-job","prepared-role"])("poisoned %s cannot call any model",async stage=>{
    fixtures.tx.mathPilotCase.findMany.mockResolvedValue([]);const records:Record<string,unknown>[]=[];
    const runtime=createProofUnitObservationRuntime({actor:{userId:"explicit"},mode:"preflight",receipt:{append:async record=>{records.push(record);}},budget:new ObservationBudget(performance.now())});
    const ready=await runtime.preflight();const created=await runtime.create(ready.identity);
    const job={id:"solver-job",version:2,attempts:1,outboxId:created.outboxId};
    const model=vi.spyOn(CodexLocalMathProvider.prototype,"execute").mockRejectedValue(new Error("must not dispatch"));
    if(stage==="outbox" || stage==="dispatched-job") {
      fixtures.tx.outboxEvent.findFirst.mockResolvedValue({topic:"math-pilot.codex-local.execute",aggregateId:created.runId,aggregateType:"ResearchRun",status:"PENDING",payload:{runId:stage==="outbox"?"sibling":created.runId}});
      vi.mocked(dispatchOutboxBatch).mockResolvedValue({dispatched:1} as never);fixtures.tx.durableJob.findMany.mockResolvedValue([{id:job.id,version:1,attempts:0,payload:{runId:"sibling"}}]);
      await expect(runtime.dispatch(ready.identity,created.outboxId)).rejects.toThrow();
      if(stage==="outbox")expect(dispatchOutboxBatch).not.toHaveBeenCalled();
    } else if(stage==="claimed-job") {
      vi.mocked(failJob).mockResolvedValue({status:"DEAD_LETTER"} as never);
      vi.mocked(claimJobs).mockResolvedValue([{id:job.id,version:2,attempts:1,outboxEventId:created.outboxId,payload:{runId:"sibling"}}] as never);
      await expect(runtime.claim(ready.identity,job)).rejects.toThrow("CLAIMED_JOB_TARGET");expect(failJob).toHaveBeenCalledWith(expect.objectContaining({jobId:job.id,retryable:false}));
      expect(records).toEqual(expect.arrayContaining([expect.objectContaining({event:"CLAIMED_TARGET_REJECTED",jobId:job.id})]));
    } else {
      fixtures.tx.durableJob.findFirst.mockResolvedValue({jobType:"math-pilot.codex-local.execute",outboxEventId:created.outboxId,attempts:1,payload:{runId:stage==="preexecute-job"?"sibling":created.runId}});
      vi.mocked(executeResearchJob).mockImplementation(async input=>{await input.provider.execute({missionId:"mission",documentId:null,question:"offline",scope:"offline",providerName:"codex-local",modelName:"gpt-6-sol",sourcePolicy:{allowedDomains:[],primaryDomains:[],requirePrimary:false,maxSources:1},queryPlan:{queries:["offline"],languages:["en"]},lrcProofUnitInput:prepareLrcProofUnitSolverInput({...proofBinding,caseId:created.caseId,runId:"sibling"})});return {} as never;});
      await expect(runtime.solver(ready.identity,created,job,new AbortController().signal)).rejects.toThrow();
      if(stage==="preexecute-job")expect(executeResearchJob).not.toHaveBeenCalled();
    }
    expect(model).not.toHaveBeenCalled();
  });
  it("claim cleanup failure retains captured owned identity and explicit uncertainty without retry",async()=>{
    fixtures.tx.mathPilotCase.findMany.mockResolvedValue([]);const records:Record<string,unknown>[]=[];
    const runtime=createProofUnitObservationRuntime({actor:{userId:"explicit"},mode:"preflight",receipt:{append:async record=>{records.push(record);}},budget:new ObservationBudget(performance.now())});
    const ready=await runtime.preflight();const created=await runtime.create(ready.identity);
    vi.mocked(claimJobs).mockResolvedValue([{id:"claimed-job",version:7,attempts:1,outboxEventId:created.outboxId,payload:{runId:"sibling"}}] as never);
    vi.mocked(failJob).mockRejectedValue(new Error("private cleanup diagnostics"));
    await expect(runtime.claim(ready.identity,{id:"claimed-job",version:6,attempts:0,outboxId:created.outboxId})).rejects.toThrow("CLAIMED_JOB_TARGET");
    expect(records.slice(-2)).toEqual([expect.objectContaining({event:"CLAIMED_TARGET_REJECTED",jobId:"claimed-job",version:7,attempts:1}),
      expect.objectContaining({event:"REJECTED_CLAIM_CLEANUP",jobId:"claimed-job",version:7,cleanupStatus:"FAILED_UNCERTAIN"})]);
    expect(failJob).toHaveBeenCalledOnce();expect(JSON.stringify(records)).not.toContain("private cleanup diagnostics");
  });
  it.each(["QUEUED", "RUNNING"])("terminal old review cannot exempt an active %s cycle", async status => {
    const ready = await preflight([{ id: `active-${status}` }]);
    expect(ready.conflictingActiveCase).toBe(true); expect(fixtures.tx.durableJob.findFirst).not.toHaveBeenCalled();
    expect(fixtures.tx.mathPilotCase.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ organizationId: "org", workspaceId: "workspace" }),
      select: expect.objectContaining({ researchCycles: { where: { status: { in: ["QUEUED", "RUNNING"] } }, select: { id: true }, take: 1 } }),
    }));
  });
  it("preserves DEAD_LETTER exception only without any active cycle", async () => {
    const ready = await preflight([]); expect(ready.conflictingActiveCase).toBe(false);
    expect(fixtures.tx.durableJob.findFirst).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({
      organizationId: "org", workspaceId: "workspace", status: "DEAD_LETTER", payload: { path: ["caseId"], equals: "old-case" },
    }) }));
  });
  it("missing terminal review remains an active conflict", async () => {
    fixtures.tx.durableJob.findFirst.mockResolvedValue(null); expect((await preflight([])).conflictingActiveCase).toBe(true);
  });
  it("running root cannot receive the awaiting-review exception", async () => {
    expect((await preflight([], "RUNNING")).conflictingActiveCase).toBe(true); expect(fixtures.tx.durableJob.findFirst).not.toHaveBeenCalled();
  });
  it("actor is resolved by operator's exact ID, never arbitrary first administrator", async () => {
    await preflight([]); expect(fixtures.db.user.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "explicit" } }));
  });
  it("successful actual create binding returns IDs before any success receipt append", async () => {
    const append = vi.fn(async (record: Record<string, unknown>) => { if (record.event === "COMMAND_OUTCOME") throw new Error("journal fault"); });
    fixtures.tx.mathPilotCase.findMany.mockResolvedValue([]);
    const runtime = createProofUnitObservationRuntime({ actor: { userId: "explicit" }, mode: "preflight",
      receipt: { append }, budget: new ObservationBudget(performance.now()) });
    const ready = await runtime.preflight();
    expect(await runtime.create(ready.identity)).toEqual({ caseId: "created-case", runId: "created-run", commandId: "created-command", outboxId: "created-outbox" });
    expect(append).not.toHaveBeenCalledWith(expect.objectContaining({ event: "COMMAND_OUTCOME" }));
  });
  it.each(["CREATED_RECEIPT", "CASE_LOOKUP"])("actual runtime path preserves known IDs after %s failure", async failure => {
    fixtures.getEnv.mockReturnValue({ RESEARCH_CODEX_LOCAL_ENABLED: true, MATH_PILOT_QUEUE_ENABLED: true, LRC_CAMPAIGN_LOCAL_ENABLED: true, RESEARCH_WORKER_ENABLED: false });
    fixtures.tx.mathPilotCase.findMany.mockResolvedValue([]);
    if (failure === "CASE_LOOKUP") fixtures.tx.mathPilotCase.findFirst.mockRejectedValue(new Error("lookup fault"));
    const records: Record<string, unknown>[] = [];
    const receipt = { append: async (record: Record<string, unknown>) => {
      if (failure === "CREATED_RECEIPT" && record.event === "CREATED") throw new Error("receipt fault"); records.push(record);
    } };
    const budget = new ObservationBudget(performance.now());
    const runtime = createProofUnitObservationRuntime({ actor: { userId: "explicit" }, mode: "run", receipt, budget });
    runtime.login = async () => {}; // Explicit offline seam: never start Codex/login.
    expect((await observeLrcProofUnitOnce({ mode: "run", runtime, receipt, budget })).status).toBe("PARTIAL_OR_FAILED");
    expect(records.at(-1)).toMatchObject({ runId: "created-run", commandId: "created-command", outboxId: "created-outbox" });
    if (failure === "CREATED_RECEIPT") expect(records.at(-1)).toMatchObject({ caseId: "created-case" });
    expect(fixtures.request).toHaveBeenCalledOnce();
  });
});
