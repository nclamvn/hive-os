import { beforeEach, describe, expect, it, vi } from "vitest";
import { executeMathResearchCycleRound, requestMathResearchCycle, validateMathCycleTrace, type MathCycleAgents } from "@/modules/research-sandbox/math-cycle-kernel";
import { admitResearchCommitment, projectCommitmentHistory } from "@/modules/research-sandbox/math-research-commitment";
import * as review from "@/modules/research-sandbox/agent-review";
import { commitmentRoot, commitmentRootDigest, commitmentReviewDigest, commitmentAttemptDigest, commitmentGap,
  commitmentTask2, commitmentChoice, makeCommitment, committedProposal,
  commitmentUsage, commitmentAttempt, commitmentDossier, commitmentEventChain, type CommitmentTestEvent } from "../fixtures/math-research-commitment";

vi.mock("@/server/tenant-context", () => ({ withOrganizationTenant: vi.fn(async (_o, _a, f) => f(tx)) }));
vi.mock("@/modules/authorization", () => ({ requireWorkspaceAuthorization: vi.fn(async () => undefined), organizationIdForWorkspace: vi.fn(async () => "org") }));
vi.mock("@/server/env", () => ({ getEnv: () => ({ RESEARCH_CODEX_LOCAL_ENABLED: true, MATH_PILOT_QUEUE_ENABLED: true }) }));
vi.mock("@/modules/command-runtime", () => ({ executeDurableCommand: vi.fn(async (_ctx, command, effect) => {
  commands.push(command); const result = await effect(tx); if (result.outcome?.commitment) cycle.command = { outcome: result.outcome };
  outbox.push(...result.outbox); return { status: "SUCCEEDED", result: result.outcome };
}) }));
vi.mock("@/modules/research-sandbox/math-frontier", async original => {
  const actual = await original<typeof import("@/modules/research-sandbox/math-frontier")>();
  return { ...actual, frontierGate: (input: { analyst?: unknown }) => ({ decision: input.analyst ? "RESEARCH_ONLY" : "HOLD", reason: "Synthetic isolated source boundary; no literature or novelty acceptance" }) };
});
type Row = Record<string, unknown>;
let cycle: Row, job: Row, events: CommitmentTestEvent[], past: Row[], outbox: unknown[], commands: Row[];
function update(row: Row, data: Row) { for (const [k, v] of Object.entries(data)) row[k] = v && typeof v === "object" && "increment" in v ? Number(row[k]) + Number(v.increment) : v; return row; }
const tx = {
  $queryRaw: vi.fn(async (...args: unknown[]) => { void args; return []; }), durableJob: { findFirst: vi.fn(async () => job), update: vi.fn(async ({ data }) => update(job, data)) },
  durableJobEvent: { create: vi.fn(async () => ({})) }, outboxEvent: { create: vi.fn(async ({ data }) => { outbox.push(data); return data; }) },
  mathResearchCycle: { findFirstOrThrow: vi.fn(async () => cycle), findFirst: vi.fn(async () => null),
    findMany: vi.fn(async ({ where, orderBy }) => {
      if (where.rootCaseId?.not) return [];
      return Array.isArray(orderBy) && orderBy[0]?.createdAt === "asc" ? [...past, { ...cycle, events }] : past;
    }), create: vi.fn(async ({ data }) => { cycle = { ...cycle, ...data }; return cycle; }), update: vi.fn(async ({ data }) => update(cycle, data)) },
  mathResearchCycleEvent: { findMany: vi.fn(async () => [...events]), findFirst: vi.fn(async ({ where }) => events.filter(e => (!where.phase || e.phase === where.phase) && (!where.round || e.round === where.round)).at(-1) ?? null),
    create: vi.fn(async ({ data }) => { events.push(data); return data; }) },
  mathPilotCase: { findFirst: vi.fn(async () => ({ id: "root-case", workspaceId: "workspace", missionId: "mission", contract: commitmentRoot, contractDigest: commitmentRootDigest,
    researchRun: { mathModelAttempt: commitmentAttempt, mathModelAttemptDigest: commitmentAttemptDigest, providerName: "codex-local", modelName: "gpt-6-sol", status: "AWAITING_REVIEW", sources: [], findings: [] }, agentReview: { ledgerDigest: commitmentReviewDigest } })) },
};
const ctx = { user: { id: "human" }, workspace: { id: "workspace", slug: "lab" } } as Parameters<typeof requestMathResearchCycle>[0];
beforeEach(() => {
  vi.restoreAllMocks(); vi.clearAllMocks(); events = []; past = []; outbox = []; commands = [];
  const binding = makeCommitment();
  cycle = { id: binding.cycleId, organizationId: "org", workspaceId: "workspace", missionId: "mission", rootCaseId: "root-case", rootContractDigest: commitmentRootDigest,
    rootReviewDigest: commitmentReviewDigest, rootAttemptDigest: commitmentAttemptDigest, commandId: binding.commandId, status: "QUEUED", completedRounds: 0,
    maxRounds: 2, maxCalls: 14, callsStarted: 0, observedTokens: 0, maxObservedTokens: 60000, deadlineAt: new Date(Date.now() + 3000000), command: { outcome: { commitment: binding } } };
  job = { id: "job", workspaceId: "workspace", attempts: 1, payload: { cycleId: cycle.id, round: 1, commitment: binding } };
  vi.spyOn(review, "validateRecordedMathAgentReview").mockReturnValue({ reports: [{ unresolvedGap: commitmentGap }, { unresolvedGap: commitmentGap }] } as never);
});
function binding() { return (cycle.command as { outcome: { commitment: ReturnType<typeof makeCommitment> } }).outcome.commitment; }
function models(): MathCycleAgents {
  return { modelName: "gpt-6-sol", propose: vi.fn(async (_r, gaps, _tasks, _art, _s, _f, _g, _o, _m, _strategy, commitment) => {
    expect(commitment).toEqual(binding()); const round = (job.payload as { round: number }).round;
    return { output: committedProposal(binding(), round - 1, gaps[0]), threadId: "planner", usage: commitmentUsage };
  }), buildFrontierDossier: vi.fn(async () => commitmentDossier),
  assessFrontier: vi.fn(async role => ({ output: { sourceIds: ["source"], relevance: "RELEVANT" as const, quantifiers: "MATCH" as const, overlap: "NOT_SHOWN_IN_CAPTURED_SOURCES" as const,
    explanation: "The isolated synthetic source does not prove the committed target." }, threadId: role, usage: commitmentUsage })),
  verify: vi.fn(async (_r, _g, _t, proposal) => ({ output: { decision: "ACCEPT" as const, sourceGap: proposal.sourceGap,
    scopeCheck: "The exact approved scope is retained in the typed binding.", noveltyCheck: "No novelty is established by this synthetic boundary.",
    falsifiabilityCheck: "An aligned exact counterexample would refute this target only.", unresolvedRisk: "No universal certificate adapter exists." }, threadId: "verifier", usage: commitmentUsage })),
  solve: vi.fn(async () => ({ ...commitmentAttempt, threadId: "solver" })),
  reviewRole: vi.fn(async (role, _contract, attempt) => ({ role, verdict: "INCONCLUSIVE" as const, candidateConclusion: "INCONCLUSIVE" as const, exactQuote: attempt.argument,
    reasoning: "The complete chain remains unproved; a narrowed theorem would not meet this obligation.", checks: ["Check the complete quantified support scope."], unresolvedGap: commitmentTask2,
    threadId: role, usage: commitmentUsage })) };
}
const execute = (agents: MathCycleAgents) => executeMathResearchCycleRound({ organizationId: "org", actorUserId: "human", workerId: "worker", jobId: "job", expectedVersion: 1, agents });
describe("TIP074 actual mocked kernel admission and durable transport", () => {
  it("passes all seven real model reservations and retains an immutable next-round commitment", async () => {
    const agents = models(); await execute(agents);
    expect(events.filter(e => e.phase === "CALL_STARTED")).toHaveLength(7);
    expect(agents.solve).toHaveBeenCalledOnce(); expect(agents.reviewRole).toHaveBeenCalledTimes(2);
    expect(cycle.status).toBe("QUEUED"); expect(outbox).toHaveLength(1);
    expect(outbox[0]).toMatchObject({ payload: { commitment: binding(), round: 2 } });
    expect(validateMathCycleTrace(events, commitmentRootDigest)).not.toBeNull();
    const state = projectCommitmentHistory(admitResearchCommitment(binding(), {}), [{ binding: binding(), trace: events.map(e => e.payload), status: "QUEUED" }]);
    expect(state).toMatchObject({ work: 1, noClosure: 1, scientificScope: "OPEN", stopped: false });
  });
  it("two inconclusive rounds stop before a third outbox regardless of nextGap", async () => {
    const agents = models(); await execute(agents); job.payload = (outbox[0] as { payload: unknown }).payload;
    cycle.status = "QUEUED"; await execute(agents);
    expect(cycle).toMatchObject({ status: "STOPPED", stopReason: "COMMITMENT_NO_CLOSURE_LIMIT" }); expect(outbox).toHaveLength(1);
  });
  it.each(["missing", "copied-foreign", "tampered", "downgraded-job"])("%s binding refuses before any model/tool", async fault => {
    if (fault === "missing") cycle.command = { outcome: {} };
    if (fault === "copied-foreign") cycle.command = { outcome: { commitment: { ...binding(), cycleId: "other" } } };
    if (fault === "tampered") cycle.command = { outcome: { commitment: { ...binding(), commitmentDigest: "f".repeat(64) } } };
    if (fault === "downgraded-job") job.payload = { cycleId: cycle.id, round: 1 };
    const agents = models(); await expect(execute(agents)).rejects.toThrow(); expect(agents.propose).not.toHaveBeenCalled(); expect(agents.buildFrontierDossier).not.toHaveBeenCalled(); expect(outbox).toEqual([]);
  });
  it.each(["mode", "source", "obligation", "domain", "quantifiers", "local-task", "unsupported-probe"])("%s proposal refuses BEFORE source/verifier/solver", async fault => {
    const agents = models(), p = structuredClone(committedProposal(binding()));
    if (fault === "mode") p.workBinding.mode = "DISCOVERY";
    if (fault === "source") p.workBinding.sourceDigest = "f".repeat(64);
    if (fault === "obligation") p.workBinding.obligationId = "renamed-family";
    if (fault === "domain") p.workBinding.predicate.domain = "A conditional local family only";
    if (fault === "quantifiers") p.workBinding.predicate.orderedQuantifiers = ["EXISTS_LOCAL_FAMILY"];
    if (fault === "local-task") p.taskStatement = "Prove only TIP072U's conditional seven-protected-lowers ratio family, not the complete prime chain.";
    if (fault === "unsupported-probe") Object.assign(p, { structuralProbePlan: { kind: "GATE_MUST_OPEN", targetA: 7, failedThroughA: 3, upperInclusive: 10000,
      expectedPrimeResidue: null, divisorConditions: [], nonmultipleConditions: [] } });
    agents.propose = vi.fn(async () => ({ output: p, threadId: "planner", usage: commitmentUsage }));
    await expect(execute(agents)).rejects.toThrow(); expect(agents.propose).toHaveBeenCalledOnce();
    for (const fn of [agents.buildFrontierDossier, agents.assessFrontier, agents.verify, agents.solve, agents.reviewRole]) expect(fn).not.toHaveBeenCalled(); expect(outbox).toEqual([]);
  });
  it("a coherent event rehash cannot execute history whose marker was moved after charged work", async () => {
    events = commitmentEventChain([{ phase: "COMMITMENT_WORK_STARTED", round: 1, commitmentDigest: binding().commitmentDigest }, { phase: "COMMITMENT_BOUND", round: 1, binding: binding() }]);
    const agents = models(); await expect(execute(agents)).rejects.toThrow(); expect(agents.propose).not.toHaveBeenCalled();
  });
  it("complete history overflow refuses rather than reading a last-eight memory window", async () => {
    past = Array.from({ length: 33 }, () => ({ ...cycle, events: [] }));
    const agents = models(); await expect(execute(agents)).rejects.toThrow("overflow"); expect(agents.propose).not.toHaveBeenCalled();
  });
  it("request confirmation is mandatory before creating a durable command", async () => {
    await expect(requestMathResearchCycle(ctx, { caseId: "root-case", maxRounds: 1, maxObservedTokens: 60000 })).rejects.toThrow("confirmation"); expect(commands).toEqual([]);
  });
  it("authenticated initial choice persists host actor/root/cycle/command in outcome and job", async () => {
    tx.mathResearchCycle.findMany.mockResolvedValueOnce([]); await requestMathResearchCycle(ctx, { caseId: "root-case", maxRounds: 1, maxObservedTokens: 60000,
      commitment: { choice: commitmentChoice(), confirmed: true } });
    expect(commands).toHaveLength(1); expect(binding().approvedByUserId).toBe("human"); expect(binding().rootContractDigest).toBe(commitmentRootDigest);
    expect(outbox[0]).toMatchObject({ payload: { commitment: binding() } }); expect(commands[0].idempotencyKey).toBe(`math-cycle:${cycle.id}`);
    const locks = tx.$queryRaw.mock.calls.map(args => String(args[1])); expect(locks.some(x => x.includes("math-cycle-root"))).toBe(true);
  });
  it("revision CAS refuses stale predecessor before appending a cycle or job", async () => {
    cycle.status = "STOPPED"; events = commitmentEventChain([{ phase: "COMMITMENT_BOUND", round: 1, binding: binding() }]);
    const c = { ...commitmentChoice(), revision: "HUMAN_REVISED", expectedPreviousDigest: "f".repeat(64), reason: "Explicit strategic reroute" };
    await expect(requestMathResearchCycle(ctx, { caseId: "root-case", maxRounds: 1, maxObservedTokens: 60000, commitment: { choice: c, confirmed: true } })).rejects.toThrow("STALE_PREDECESSOR");
    expect(tx.mathResearchCycle.create).not.toHaveBeenCalled(); expect(outbox).toEqual([]);
  });
});
