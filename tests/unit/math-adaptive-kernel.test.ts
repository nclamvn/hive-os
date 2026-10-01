import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { sha256 } from "@/modules/research-sandbox/integrity";
import { digestMathPilotContract, resolveMathPilotContract } from "@/modules/research-sandbox/math-pilot";
import { executeMathResearchCycleRound, validateMathCycleTrace, type MathCycleAgents } from "@/modules/research-sandbox/math-cycle-kernel";
import { mathCycleEventDigest, mathCycleSteeringDigest, type MathCycleEventPayload } from "@/modules/research-sandbox/math-cycle";
import { runMixedCoreAgentEvidence, type MixedCoreAgentEvidence } from "@/modules/research-sandbox/math-mixed-core-agent";
import * as mixedModule from "@/modules/research-sandbox/math-mixed-core-agent";
import * as reviewModule from "@/modules/research-sandbox/agent-review";
import type { AdaptivePolicy, AdaptiveResearchContext } from "@/modules/research-sandbox/math-adaptive-strategy";
import type { FrontierDossier } from "@/modules/research-sandbox/math-frontier";
import * as methodModule from "@/modules/research-sandbox/math-method-map";
import { lemmaDraft } from "../fixtures/math-lemma-graph";
import { sealMathPortfolio } from "@/modules/research-sandbox/math-portfolio";

// Real cycle composition with only tenant/database and model-result boundaries
// replaced. No live database, provider, worker process, or source network calls.
vi.mock("@/server/tenant-context", () => ({ withOrganizationTenant: vi.fn(async (_org, _actor, callback) => callback(tx)) }));
vi.mock("@/modules/research-sandbox/math-method-map", async (original) => {
  const actual = await original<typeof import("@/modules/research-sandbox/math-method-map")>();
  return { ...actual, buildResearchMethodPacket: (root: Parameters<typeof actual.buildResearchMethodPacket>[0], digest: string) =>
    actual.buildResearchMethodPacket(root, digest, { statusLoader: async () => { throw new Error("offline fixed fixture"); } }) };
});
const root = resolveMathPilotContract({ caseType: "OPEN", statement: "For every prime p ≡ 1 (mod 840), does 4/p = 1/x + 1/y + 1/z hold?",
  definitions: "p is prime and x, y, z are strictly positive integers.", assumptions: "Exact arithmetic applies.",
  falsificationCriterion: "A checked counterexample is required.", successCriterion: "A general proof is required.",
  exclusions: "Finite computation is not a universal proof." });
const rootDigest = digestMathPilotContract(root), reviewDigest = "a".repeat(64), attemptDigest = "b".repeat(64);
const gap = "The residual prime domain lacks a general support bridge.";
const narrowGap = "An old narrow finite gate still has an unresolved premise.";
const policy: AdaptivePolicy = { policyId: "ADAPTIVE_RESEARCH_V1", cycleId: "00000000-0000-4000-8000-000000000034",
  rootContractDigest: rootDigest, rootReviewDigest: reviewDigest };
const usage = { inputTokens: 5, cachedInputTokens: 0, outputTokens: 2, reasoningOutputTokens: 0 };
const attempt = { providerName: "codex-local" as const, modelName: "gpt-6-sol", threadId: "root-solver", attemptType: "INCONCLUSIVE" as const,
  argument: "The structural bridge remains unproved in this scoped attempt.", candidateCounterexample: null, selfChecks: [], limitations: [], usage };
const sourceText = "The residual prime question needs an exact structural bridge, not a finite count.";
const dossierBody = { coverage: "PARTIAL_NOT_NOVELTY_CERTIFICATE" as const, sources: [{ id: "composition-source",
  canonicalUri: "https://example.org/primary/structural-bridge", title: "Structural bridge background", authors: "Fixture author",
  publicationYear: 2025, version: "v1", captureMethod: "CURATED_PRIMARY_EXCERPT" as const, scope: "ROOT_DOMAIN" as const,
  content: sourceText, contentDigest: sha256(sourceText), exactQuote: sourceText, startOffset: 0, endOffset: sourceText.length }],
  discovery: { provider: "CROSSREF" as const, query: "residual prime structural bridge", status: "COMPLETE" as const, candidates: [] } };
const dossier: FrontierDossier = { ...dossierBody, dossierDigest: sha256(canonicalJson(dossierBody)) };
const proposal = { sourceGap: gap, hypothesis: "A target-sensitive support partition may bridge the residual prime domain.",
  taskStatement: "Derive a target-sensitive partition for every prime p congruent to 1 modulo 840.",
  falsificationPlan: "Check whether an exact normalized pair violates the proposed partition.",
  successEvidence: "A complete derivation preserving every premise and quantifier.",
  rationale: "This attacks the structural support obstruction instead of collecting more counts.",
  exactSurveyPlan: null, structuralProbePlan: null };
const branch = { strategy: "STRUCTURAL_LEMMA" as const, proposal,
  anticipatedFalsifier: "A normalized pair meets every premise but violates the proposed partition.",
  expectedInformationGain: "HIGH" as const, toolNeeds: ["SOURCE_REVIEW" as const], methodId: "SUPPORT_UNIFORM_BRIDGE" as const,
  methodFamily: "GLOBAL_BRIDGE" as const, rootContribution: { kind: "ROOT_BRIDGE" as const, statement: "Remove a target-sensitive root bottleneck without assuming finite counts suffice." },
  applicabilityAssumptions: "All normalized parameters are positive and prime quantifiers remain intact.",
  discriminatingExperiment: { question: "Does the exact support partition remove the residual prime obstruction?",
    supportOutcome: "Seek independent proof checking before any theorem certification.",
    refutationOutcome: "Abandon the exact partition and choose a different method family.",
    inconclusiveOutcome: "Retain the missing estimate and route to a distinct local obstruction." },
  requiredTools: ["PROOF_ATTEMPT" as const], evaluationScope: "UNVALIDATED_RESEARCH" as const };
type Event = { sequence: number; round: number; phase: string; payload: MathCycleEventPayload; previousDigest: string | null; digest: string };
let events: Event[] = [], cycle: Record<string, unknown>, job: Record<string, unknown>, evidence: MixedCoreAgentEvidence;
let priorCycles: unknown[] = [], outbox: unknown[] = [];
function updateRecord(record: Record<string, unknown>, data: Record<string, unknown>) {
  for (const [key, value] of Object.entries(data)) record[key] = value && typeof value === "object" && "increment" in value
    ? Number(record[key]) + Number(value.increment) : value;
  return record;
}
const tx = {
  $queryRaw: vi.fn(async () => [{ locked: 1 }]),
  durableJob: { findFirst: vi.fn(async () => job), update: vi.fn(async ({ data }) => updateRecord(job, data)) },
  durableJobEvent: { create: vi.fn(async () => ({})) },
  outboxEvent: { create: vi.fn(async ({ data }) => { outbox.push(data); return data; }) },
  mathResearchCycle: { findFirstOrThrow: vi.fn(async () => cycle), findMany: vi.fn(async ({ where }) => where.rootCaseId?.not ? [] : priorCycles),
    update: vi.fn(async ({ data }) => updateRecord(cycle, data)) },
  mathResearchCycleEvent: { findMany: vi.fn(async () => [...events]),
    findFirst: vi.fn(async ({ where }) => events.filter((event) => (!where.phase || event.phase === where.phase) &&
      (!where.round || event.round === where.round)).at(-1) ?? null),
    create: vi.fn(async ({ data }) => { events.push(data); return data; }) },
  mathPilotCase: { findFirst: vi.fn(async () => ({ id: "root-case", workspaceId: "workspace", contract: root, contractDigest: rootDigest,
    researchRun: { mathModelAttempt: attempt, mathModelAttemptDigest: attemptDigest, providerName: "codex-local", modelName: "gpt-6-sol",
      status: "AWAITING_REVIEW", sources: [], findings: [] }, agentReview: { ledgerDigest: reviewDigest } })) },
};
beforeAll(async () => { evidence = await runMixedCoreAgentEvidence(rootDigest, "MIXED_CORE_REPLAY_V3"); }, 45_000);
beforeEach(() => {
  vi.restoreAllMocks(); events = []; priorCycles = []; outbox = [];
  cycle = { id: policy.cycleId, organizationId: "org", workspaceId: "workspace", missionId: "mission", rootCaseId: "root-case",
    rootContractDigest: rootDigest, rootReviewDigest: reviewDigest, rootAttemptDigest: attemptDigest, commandId: "command",
    status: "QUEUED", completedRounds: 0, maxRounds: 2, maxCalls: 14, callsStarted: 0, observedTokens: 0,
    maxObservedTokens: 60_000, deadlineAt: new Date(Date.now() + 3_000_000), command: { outcome: { strategyPolicy: policy } } };
  job = { id: "claimed-job", workspaceId: "workspace", attempts: 1, status: "RUNNING", payload: { cycleId: policy.cycleId, round: 1, strategyPolicy: policy } };
  vi.spyOn(reviewModule, "validateRecordedMathAgentReview").mockReturnValue({ reports: [{ unresolvedGap: gap }, { unresolvedGap: gap }] } as never);
  vi.spyOn(mixedModule, "runMixedCoreAgentEvidence").mockResolvedValue(evidence);
});
function agents() {
  const seen: { role: string; strategy: AdaptiveResearchContext }[] = [];
  const capture = (role: string, strategy?: AdaptiveResearchContext | null) => {
    expect(strategy?.packet.rootDigest).toBe(rootDigest);
    expect(events.findIndex((event) => event.phase === "RESEARCH_METHOD_MAP")).toBeLessThan(
      events.findIndex((event) => event.phase === "CALL_STARTED"));
    seen.push({ role, strategy: strategy! });
  };
  let round = 0;
  const result: MathCycleAgents = { modelName: "gpt-6-sol",
    proposePortfolio: vi.fn(async (_root, gaps, _tasks, _art, _findings, _gate, _obligations, _mixed, strategy) => {
      capture("PLANNER", strategy); expect(gaps).toContain(gap); round += 1;
      return { output: { version: 2, branches: [branch, { ...branch, methodId: "TAO_LOCAL_OBSTRUCTION", methodFamily: "LOCAL_OBSTRUCTION",
        rootContribution: { kind: "STRUCTURAL_REDUCTION", statement: "A different local obstruction tests the missing premise independently." },
        proposal: { ...proposal, hypothesis: "A distinct local obstruction may separate survivors in the sealed prime domain.",
          taskStatement: "Derive a different local obstruction criterion for every prime p congruent to 1 modulo 840." } }] },
      threadId: "composition-planner", usage };
    }),
    propose: vi.fn(async () => { throw new Error("immutable portfolio must be reused"); }),
    buildFrontierDossier: vi.fn(async () => dossier),
    assessFrontier: vi.fn(async (role, _root, _proposal, _dossier, _mixed, strategy) => {
      capture(role, strategy); return { output: { sourceIds: ["composition-source"], relevance: "RELEVANT" as const, quantifiers: "MATCH" as const,
        overlap: "NOT_SHOWN_IN_CAPTURED_SOURCES" as const, explanation: "The captured background does not establish the proposed universal partition." },
      threadId: `${role}-${job.payload && (job.payload as { round: number }).round}`, usage };
    }),
    verify: vi.fn(async (_root, _gaps, _tasks, proposal, _art, _steer, _findings, _assessments, _gate, _probe, _obligations, _mixed, strategy) => {
      capture("VERIFIER", strategy); return { output: { decision: "ACCEPT" as const, sourceGap: proposal.sourceGap,
        scopeCheck: "The prime domain and all positive parameters are retained.", noveltyCheck: "A partial source catalog cannot establish novelty.",
        falsifiabilityCheck: "The partition has a precisely stated finite counterexample criterion.", unresolvedRisk: "A symbolic attempt is not a checked universal theorem." },
      threadId: `verifier-${(job.payload as { round: number }).round}`, usage };
    }),
    solve: vi.fn(async (_root, _computation, _replay, _gate, _mixed, strategy) => {
      capture("SOLVER", strategy); round = (job.payload as { round: number }).round;
      return { ...attempt, threadId: `solver-${round}` };
    }),
    reviewRole: vi.fn(async (role, _root, attempt, _computation, _replay, _counterexample, _gate, _mixed, strategy) => {
      capture(role, strategy); return { role, verdict: "INCONCLUSIVE" as const, candidateConclusion: "INCONCLUSIVE" as const, exactQuote: attempt.argument,
        reasoning: "The symbolic bridge has no complete derivation yet; source status does not fix the mathematical gap.",
        checks: ["Check each structural assumption rather than assuming source health is proof."], unresolvedGap: null,
        threadId: `${role}-${round}`, usage };
    }) };
  return { result, seen };
}
async function execute(result: MathCycleAgents) { return executeMathResearchCycleRound({ organizationId: "org", actorUserId: "actor",
  workerId: "worker", jobId: "claimed-job", expectedVersion: 1, agents: result }); }

describe("actual adaptive cycle kernel composition", () => {
  it("executes fresh policy V2 graph portfolio through all seven existing roles without extra calls", async () => {
    const graphPolicy: AdaptivePolicy = { ...policy, policyId: "ADAPTIVE_RESEARCH_V2" };
    cycle.command = { outcome: { strategyPolicy: graphPolicy } }; job.payload = { cycleId: policy.cycleId, round: 1, strategyPolicy: graphPolicy };
    const { result, seen } = agents();
    const original = result.proposePortfolio!;
    result.proposePortfolio = vi.fn(async (...args: Parameters<NonNullable<MathCycleAgents["proposePortfolio"]>>) => {
      const output = await original(...args);
      const draft = output.output as { branches: typeof branch[] };
      return { ...output, output: { version: 3, branches: draft.branches.map((entry) => ({ ...entry, lemmaGraph: lemmaDraft(entry.proposal.hypothesis) })) } };
    });
    await execute(result);
    const plan = events.find((event) => event.phase === "PORTFOLIO_PLANNED")!.payload;
    if (plan.phase !== "PORTFOLIO_PLANNED" || plan.portfolio.version !== 3) throw new Error("fixture");
    const selected = events.find((event) => event.phase === "BRANCH_SELECTED")!.payload;
    if (selected.phase !== "BRANCH_SELECTED") throw new Error("fixture");
    const graph = plan.portfolio.branches.find((entry) => entry.branchId === selected.branchId)!.lemmaGraph;
    expect(graph.cycleId).toBe(policy.cycleId); expect(graph.rootContractDigest).toBe(rootDigest);
    expect(events.findIndex((event) => event.phase === "PORTFOLIO_PLANNED")).toBeLessThan(events.findIndex((event) => event.phase === "PROPOSED"));
    expect(new Set(seen.map((entry) => entry.role))).toEqual(new Set(["PLANNER", "SOURCE_ANALYST", "SOURCE_CHALLENGER", "VERIFIER", "SOLVER", "CRITIC", "ADVERSARY"]));
    for (const entry of seen.filter((entry) => entry.role !== "PLANNER")) expect(entry.strategy.lemmaGraph).toEqual(graph);
    expect(result.proposePortfolio).toHaveBeenCalledTimes(1); expect(events.filter((event) => event.phase === "CALL_STARTED")).toHaveLength(7);
    expect(validateMathCycleTrace(events, rootDigest, graphPolicy)).not.toBeNull();
    const map = events.find((event) => event.phase === "RESEARCH_METHOD_MAP")!.payload;
    if (map.phase !== "RESEARCH_METHOD_MAP") throw new Error("fixture");
    const old = sealMathPortfolio({ draft: { version: 2, branches: plan.portfolio.branches.map(({ lemmaGraph, branchId, parentObligationIds, maxObservedTokens, maxWallSeconds, ...entry }) => {
      void lemmaGraph; void branchId; void parentObligationIds; void maxObservedTokens; void maxWallSeconds; return entry;
    }) }, rootReviewDigest: reviewDigest, availableGaps: [gap], priorObligations: [], maxObservedTokens: 60_000, maxRounds: 2, methodPacket: map.packet });
    const downgraded = events.map((event) => event.payload.phase === "PORTFOLIO_PLANNED" ? { ...event.payload, portfolio: old } : event.payload);
    const rebuilt: Event[] = []; for (const payload of downgraded) { const previousDigest = rebuilt.at(-1)?.digest ?? null;
      rebuilt.push({ sequence: rebuilt.length + 1, round: payload.round, phase: payload.phase, payload, previousDigest, digest: mathCycleEventDigest(previousDigest, payload) }); }
    expect(validateMathCycleTrace(rebuilt, rootDigest, graphPolicy)).toBeNull();
    const beforePortfolio = events.slice(0, events.findIndex((event) => event.phase === "PORTFOLIO_PLANNED"));
    const earlyCall: MathCycleEventPayload = { phase: "CALL_STARTED", round: 1, role: "SOURCE_ANALYST" };
    const previousDigest = beforePortfolio.at(-1)!.digest;
    expect(validateMathCycleTrace([...beforePortfolio, { sequence: beforePortfolio.length + 1, round: 1,
      phase: earlyCall.phase, payload: earlyCall, previousDigest, digest: mathCycleEventDigest(previousDigest, earlyCall) }], rootDigest, graphPolicy)).toBeNull();
    expect(outbox[0]).toMatchObject({ payload: { strategyPolicy: graphPolicy, round: 2 } });
    job.status = "RUNNING"; job.payload = { cycleId: policy.cycleId, round: 2, strategyPolicy: graphPolicy };
    await execute(result);
    expect(result.proposePortfolio).toHaveBeenCalledTimes(1); expect(result.buildFrontierDossier).toHaveBeenCalledTimes(1);
    expect(cycle).toMatchObject({ status: "STOPPED", stopReason: "ROUND_LIMIT", completedRounds: 2 });
    const nextSelection = events.find((event) => event.phase === "BRANCH_SELECTED" && event.round === 2)!.payload;
    if (nextSelection.phase !== "BRANCH_SELECTED") throw new Error("fixture");
    const nextGraph = plan.portfolio.branches.find((entry) => entry.branchId === nextSelection.branchId)!.lemmaGraph;
    expect(nextGraph.graphDigest).not.toBe(graph.graphDigest);
    for (const entry of seen.slice(7)) expect(entry.strategy.lemmaGraph).toEqual(nextGraph);
    expect(events.filter((event) => event.phase === "CALL_STARTED")).toHaveLength(13);
    expect(validateMathCycleTrace(events, rootDigest, graphPolicy)).not.toBeNull();
  });
  it("rejects missing required graph before any source agent or solver dispatch", async () => {
    const graphPolicy: AdaptivePolicy = { ...policy, policyId: "ADAPTIVE_RESEARCH_V2" };
    cycle.command = { outcome: { strategyPolicy: graphPolicy } }; job.payload = { cycleId: policy.cycleId, round: 1, strategyPolicy: graphPolicy };
    const { result } = agents(); await expect(execute(result)).rejects.toThrow();
    expect(result.assessFrontier).not.toHaveBeenCalled(); expect(result.verify).not.toHaveBeenCalled();
    expect(result.solve).not.toHaveBeenCalled(); expect(result.reviewRole).not.toHaveBeenCalled();
    expect(events.filter((event) => event.phase === "CALL_STARTED")).toHaveLength(1);
  });
  it("retains before planning, forwards all seven roles, reroutes within two rounds, and mirrors policy", async () => {
    const { result, seen } = agents();
    await execute(result);
    expect(cycle.status).toBe("QUEUED");
    expect(events[0].phase).toBe("ADAPTIVE_POLICY_DECLARED");
    expect(seen.map((item) => item.role)).toEqual(["PLANNER", "SOURCE_ANALYST", "SOURCE_CHALLENGER", "VERIFIER", "SOLVER", "CRITIC", "ADVERSARY"]);
    const digest = seen[0].strategy.packet.packetDigest;
    expect(seen.every((item) => item.strategy.packet.packetDigest === digest)).toBe(true);
    expect(outbox[0]).toMatchObject({ payload: { strategyPolicy: policy, round: 2 } });
    job.status = "RUNNING"; job.payload = { cycleId: policy.cycleId, round: 2, strategyPolicy: policy };
    await execute(result);
    expect(result.proposePortfolio).toHaveBeenCalledTimes(1);
    expect(result.buildFrontierDossier).toHaveBeenCalledTimes(1);
    expect(cycle).toMatchObject({ status: "STOPPED", stopReason: "ROUND_LIMIT", completedRounds: 2 });
    expect(validateMathCycleTrace(events, rootDigest, policy)).not.toBeNull();
    const selected = events.filter((event) => event.payload.phase === "BRANCH_SELECTED");
    expect(selected).toHaveLength(2);
    expect(selected[0].payload).not.toEqual(selected[1].payload);
  });
  it("rejects a mismatched outbox mirror before any model or source call", async () => {
    job.payload = { cycleId: policy.cycleId, round: 1, strategyPolicy: { ...policy, rootReviewDigest: "f".repeat(64) } };
    const { result } = agents();
    await expect(execute(result)).rejects.toMatchObject({ code: "INTEGRITY_FAILURE" });
    expect(result.proposePortfolio).not.toHaveBeenCalled(); expect(result.buildFrontierDossier).not.toHaveBeenCalled();
  });
  it("keeps root gaps available beside a narrow historical next-gap", async () => {
    const payloads: MathCycleEventPayload[] = [{ phase: "PROPOSED", round: 1,
      proposal: { ...proposal, hypothesis: "An older finite gate statement still has an unresolved separate premise.", taskStatement: "Test an older finite criterion without addressing the complete support bridge." },
      context: { threadId: "old-planner", usage } },
      { phase: "ROUND_CLOSED", round: 1, disposition: "INCONCLUSIVE", conclusion: "INCONCLUSIVE", nextGap: narrowGap }];
    let previous: string | null = null;
    const priorEvents = payloads.map((payload, index) => { const digest = mathCycleEventDigest(previous, payload);
      const event = { sequence: index + 1, round: 1, phase: payload.phase, payload, previousDigest: previous, digest }; previous = digest; return event; });
    priorCycles = [{ ...cycle, id: "old-cycle", command: { outcome: {} }, events: priorEvents }];
    const { result } = agents(); await execute(result);
    expect(vi.mocked(result.proposePortfolio!).mock.calls[0][1]).toEqual([gap, narrowGap]);
  });
  it("retains a missing-tool direction but never sends it to an unsupported solver", async () => {
    const { result, seen } = agents();
    result.proposePortfolio = vi.fn(async (_root, _gaps, _tasks, _art, _findings, _gate, _obligations, _mixed, strategy) => ({
      output: { version: 2, branches: [{ ...branch, requiredTools: ["GLOBAL_SUPPORT_CERTIFICATE"] },
        { ...branch, methodId: "TAO_LOCAL_OBSTRUCTION", methodFamily: "LOCAL_OBSTRUCTION",
          rootContribution: { kind: "STRUCTURAL_REDUCTION", statement: "A local obstruction remains safely investigable without inventing a runtime." },
          proposal: { ...proposal, hypothesis: "A different local obstruction may isolate a root-relevant missing premise." } }] },
      threadId: "composition-planner", usage, strategy }));
    await execute(result);
    expect(seen.find((item) => item.role === "SOLVER")?.strategy.selectedBranch?.methodFamily).toBe("LOCAL_OBSTRUCTION");
    const selected = events.find((event) => event.payload.phase === "BRANCH_SELECTED")?.payload;
    expect(selected?.phase === "BRANCH_SELECTED" && selected.adaptiveSelection?.ranking[0]).toMatchObject({ state: "DEFERRED" });
  });
  it("fresh malformed/root-rebound packet stops before the first model call", async () => {
    const packet = await methodModule.buildResearchMethodPacket(root, dossier.dossierDigest);
    vi.spyOn(methodModule, "buildResearchMethodPacket").mockResolvedValue({ ...packet, rootDigest: "f".repeat(64) });
    const { result } = agents(); await execute(result);
    expect(cycle).toMatchObject({ status: "STOPPED", stopReason: "INTEGRITY_FAILURE" });
    expect(events.some((event) => event.phase === "CALL_STARTED")).toBe(false);
    expect(result.proposePortfolio).not.toHaveBeenCalled(); expect(result.solve).not.toHaveBeenCalled();
  });
  it("actual typed refutation closes before source agents and solver despite preplanner baseline", async () => {
    const { result } = agents();
    result.proposePortfolio = vi.fn(async () => ({ output: { version: 2, branches: [
      { ...branch, proposal: { ...proposal, structuralProbePlan: { kind: "GATE_MUST_OPEN", targetA: 11, failedThroughA: 7,
        upperInclusive: 131_041, expectedPrimeResidue: null, divisorConditions: [], nonmultipleConditions: [] } },
      toolNeeds: ["STRUCTURAL_PROBE"], requiredTools: ["STRUCTURAL_PROBE"] },
      { ...branch, methodId: "TAO_LOCAL_OBSTRUCTION", methodFamily: "LOCAL_OBSTRUCTION", requiredTools: ["GLOBAL_SUPPORT_CERTIFICATE"],
        proposal: { ...proposal, hypothesis: "A separate obstruction could bridge the residual support without relying on the refuted gate." } },
    ] }, threadId: "composition-planner", usage }));
    await execute(result);
    expect(events.some((event) => event.phase === "RESEARCH_FRONTIER_BASELINE")).toBe(true);
    expect(events.find((event) => event.phase === "STRUCTURAL_PROBED")?.payload).toMatchObject({ report: { status: "REFUTED" } });
    expect(validateMathCycleTrace(events, rootDigest, policy)).not.toBeNull();
    expect(result.assessFrontier).not.toHaveBeenCalled(); expect(result.solve).not.toHaveBeenCalled();
  });
  it("a fully rehashed stripped declaration cannot resume against intact command policy", async () => {
    const { result } = agents(); await execute(result);
    const remaining = events.slice(1).map((event) => event.payload);
    let previous: string | null = null;
    events = remaining.map((payload, index) => { const digest = mathCycleEventDigest(previous, payload);
      const event = { sequence: index + 1, round: payload.round, phase: payload.phase, payload, previousDigest: previous, digest };
      previous = digest; return event; });
    job.status = "RUNNING"; job.payload = { cycleId: policy.cycleId, round: 2, strategyPolicy: policy };
    const solverCalls = vi.mocked(result.solve).mock.calls.length;
    await expect(execute(result)).rejects.toMatchObject({ code: "INTEGRITY_FAILURE" });
    expect(vi.mocked(result.solve).mock.calls).toHaveLength(solverCalls);
  });
  it("stops METHOD_DEFERRED only when no new safe ready branch remains", async () => {
    const { result } = agents();
    result.proposePortfolio = vi.fn(async () => ({ output: { version: 2, branches: [
      { ...branch, requiredTools: ["GLOBAL_SUPPORT_CERTIFICATE"] },
      { ...branch, methodId: "TAO_LOCAL_OBSTRUCTION", methodFamily: "LOCAL_OBSTRUCTION", requiredTools: ["POINTWISE_ANALYTIC_BOUND"],
        proposal: { ...proposal, hypothesis: "A separate local estimate may remove the remaining pointwise obstruction." } },
    ] }, threadId: "composition-planner", usage }));
    await execute(result);
    expect(cycle).toMatchObject({ status: "STOPPED", stopReason: "METHOD_DEFERRED" });
    expect(events.find((event) => event.phase === "METHOD_DEFERRED")?.payload).toMatchObject({ selection: { selectedBranchId: null } });
    expect(events.some((event) => event.phase === "BRANCH_SELECTED")).toBe(false);
    expect(result.solve).not.toHaveBeenCalled();
    expect(validateMathCycleTrace(events, rootDigest, policy)).not.toBeNull();
  });
  it("rejects an independently false steering seed before method/source discovery or model calls", async () => {
    const steering = { method: "HUMAN_STEERED_TWO_GATE_V1" as const, focus: "STRUCTURAL_LEMMA" as const,
      targetA: 27, note: "Reject this deliberately false replay seed before spending source requests.",
      replayCandidate: { prime: 131_041, failedThroughA: 23 }, approvedByUserId: "actor",
      approvedAt: new Date().toISOString(), rootContractDigest: rootDigest };
    job.payload = { cycleId: policy.cycleId, round: 1, strategyPolicy: policy, steering,
      steeringDigest: mathCycleSteeringDigest(steering) };
    cycle.maxRounds = 1;
    const methodProducer = vi.spyOn(methodModule, "buildResearchMethodPacket");
    const { result } = agents(); await execute(result);
    expect(cycle).toMatchObject({ status: "STOPPED", stopReason: "COUNTEREXAMPLE_REJECTED" });
    expect(events.find((event) => event.phase === "PRIOR_COUNTEREXAMPLE_REPLAY")?.payload).toMatchObject({ report: { status: "FAIL" } });
    expect(result.buildFrontierDossier).not.toHaveBeenCalled(); expect(methodProducer).not.toHaveBeenCalled();
    expect(events.some((event) => event.phase === "CALL_STARTED")).toBe(false);
    expect(validateMathCycleTrace(events, rootDigest, policy)).not.toBeNull();
  });
});
