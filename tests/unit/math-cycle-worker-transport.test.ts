import { afterEach, describe, expect, it, vi } from "vitest";
import { runResearchSandboxWorkerCycle } from "@/server/workers/research-sandbox-cycle";
import { executeMathResearchCycleRound } from "@/modules/research-sandbox/math-cycle-kernel";
import { CodexLocalMathCycleAgent } from "@/modules/research-sandbox/adapters/codex-local-cycle";
import { CodexLocalMathProvider } from "@/modules/research-sandbox/adapters/codex-local-math";
import { CodexLocalMathReviewer } from "@/modules/research-sandbox/adapters/codex-local-review";
import { resolveMathPilotContract } from "@/modules/research-sandbox/math-pilot";
import { runMixedCoreAgentEvidence, mixedCoreAgentMandate } from "@/modules/research-sandbox/math-mixed-core-agent";
import { buildFrontierDossier, type FrontierDossier } from "@/modules/research-sandbox/math-frontier";
import { buildResearchMethodPacket } from "@/modules/research-sandbox/math-method-map";
import { adaptiveAgentMandate, type AdaptiveResearchContext } from "@/modules/research-sandbox/math-adaptive-strategy";
import { sealMathLemmaGraph } from "@/modules/research-sandbox/math-lemma-graph";
import { lemmaDraft } from "../fixtures/math-lemma-graph";

// Exercise real worker callback wiring, with only job/model boundaries mocked.
// No database, worker process, model invocation or source request is made.
vi.mock("@/modules/command-runtime/jobs", () => ({
  claimJobs: vi.fn(async () => [{ id: "transport-job", version: 1,
    jobType: "math-pilot.cycle.round", payload: {} }]), failJob: vi.fn(),
}));
vi.mock("@/modules/command-runtime/kernel", () => ({ dispatchOutboxBatch: vi.fn(async () => ({ dispatched: 1 })) }));
vi.mock("@/modules/research-sandbox/math-cycle-kernel", () => ({ executeMathResearchCycleRound: vi.fn(), markMathResearchCycleFailed: vi.fn() }));
vi.mock("@/server/env", () => ({ getEnv: () => ({}) }));

const root = resolveMathPilotContract({ caseType: "OPEN",
  statement: "For every prime p ≡ 1 (mod 840), does 4/p = 1/x + 1/y + 1/z hold?",
  definitions: "p is prime and x, y, z are strictly positive integers.", assumptions: "Exact arithmetic applies.",
  falsificationCriterion: "A checked counterexample is required.", successCriterion: "A general proof is required.",
  exclusions: "Finite computation is not a universal proof." });
const proposal = { sourceGap: "A target-sensitive criterion is missing.", hypothesis: "A narrow condition may help.",
  taskStatement: "Find a narrower sufficient condition.", falsificationPlan: "Check an exact target.",
  successEvidence: "Written proof and independent replay.", rationale: "Preserve the target quantifiers." };
const attempt = { providerName: "codex-local" as const, modelName: "gpt-6-sol", threadId: "transport-solver",
  attemptType: "INCONCLUSIVE" as const, argument: "This is only a wiring fixture.", candidateCounterexample: null,
  selfChecks: [], limitations: [], usage: { inputTokens: 1, cachedInputTokens: 0, outputTokens: 1, reasoningOutputTokens: 0 } };

describe("actual research worker evidence transport", () => {
  afterEach(() => { vi.restoreAllMocks(); vi.mocked(executeMathResearchCycleRound).mockClear(); });
  it.each(["MIXED_CORE_REPLAY_V1", "MIXED_CORE_REPLAY_V2", "MIXED_CORE_REPLAY_V3"] as const)("forwards %s through every adapter without changing version", async (method) => {
    const evidence = await runMixedCoreAgentEvidence("a".repeat(64), method);
    const portfolio = vi.spyOn(CodexLocalMathCycleAgent.prototype, "proposePortfolio").mockImplementation(async () => undefined as never);
    const planner = vi.spyOn(CodexLocalMathCycleAgent.prototype, "propose").mockImplementation(async () => undefined as never);
    const verifier = vi.spyOn(CodexLocalMathCycleAgent.prototype, "verify").mockImplementation(async () => undefined as never);
    const sources = vi.spyOn(CodexLocalMathCycleAgent.prototype, "assessFrontier").mockImplementation(async () => undefined as never);
    const solver = vi.spyOn(CodexLocalMathProvider.prototype, "execute").mockResolvedValue({
      providerName: "codex-local", modelName: "gpt-6-sol", sources: [], findings: [], mathAttempt: attempt });
    const review = vi.spyOn(CodexLocalMathReviewer.prototype, "reviewRole").mockImplementation(async () => undefined as never);
    expect(await runResearchSandboxWorkerCycle({ organizationId: "transport-org", actorUserId: "transport-user",
      workerId: "transport-worker", correlationId: "transport-correlation", codexLocal: true }))
      .toMatchObject({ claimed: 1, succeeded: 1, failed: 0 });
    const agents = vi.mocked(executeMathResearchCycleRound).mock.calls[0]![0].agents;
    await agents.proposePortfolio!(root, [], [], [], [], null, [], evidence);
    await agents.propose(root, [], [], [], null, [], null, [], evidence);
    await agents.verify(root, [], [], proposal, [], null, [], [], null, null, [], evidence);
    for (const role of ["SOURCE_ANALYST", "SOURCE_CHALLENGER"] as const)
      await agents.assessFrontier(role, root, proposal, {} as FrontierDossier, evidence);
    await agents.solve(root, null, null, null, evidence);
    for (const role of ["CRITIC", "ADVERSARY"] as const)
      await agents.reviewRole(role, root, attempt, null, null, null, null, evidence);
    expect(portfolio.mock.calls[0]![7]).toBe(evidence);
    expect(planner.mock.calls[0]![8]).toBe(evidence);
    expect(verifier.mock.calls[0]![11]).toBe(evidence);
    expect(sources.mock.calls).toHaveLength(2);
    for (const args of sources.mock.calls) expect(args[4]).toBe(evidence);
    expect(review.mock.calls).toHaveLength(2);
    for (const args of review.mock.calls) expect(args[9]).toBe(evidence);
    const scope = solver.mock.calls[0]![0].scope;
    expect(scope).toContain(mixedCoreAgentMandate(evidence));
    expect(scope).toContain(JSON.stringify(evidence));
    if (method !== "MIXED_CORE_REPLAY_V1") expect(scope).toContain("m132840/s531359");
    else expect(scope).not.toContain("m132840/s531359");
    if (method === "MIXED_CORE_REPLAY_V3") expect(scope).toContain("q99/m198/s791");
    else expect(scope).not.toContain("q99/m198/s791");
  }, 45_000);
  it.each(["ADAPTIVE_RESEARCH_V1", "ADAPTIVE_RESEARCH_V2"] as const)("forwards the same adaptive root-bound packet and %s graph context through all actual worker callbacks", async (policyId) => {
    const dossier = await buildFrontierDossier(root, async () => { throw new Error("offline fixture"); });
    const packet = await buildResearchMethodPacket(root, dossier.dossierDigest, {
      statusLoader: async () => { throw new Error("offline fixture"); } });
    const graph = policyId === "ADAPTIVE_RESEARCH_V2" ? sealMathLemmaGraph({ draft: lemmaDraft(), root,
      cycleId: "00000000-0000-4000-8000-000000000035", branchId: "a".repeat(64), rootReviewDigest: "b".repeat(64), methodPacketDigest: packet.packetDigest }) : null;
    const strategy: AdaptiveResearchContext = { packet, outcomes: [], selectedBranch: null, selection: null, policyId, lemmaGraph: graph };
    const portfolio = vi.spyOn(CodexLocalMathCycleAgent.prototype, "proposePortfolio").mockImplementation(async () => undefined as never);
    const planner = vi.spyOn(CodexLocalMathCycleAgent.prototype, "propose").mockImplementation(async () => undefined as never);
    const verifier = vi.spyOn(CodexLocalMathCycleAgent.prototype, "verify").mockImplementation(async () => undefined as never);
    const sources = vi.spyOn(CodexLocalMathCycleAgent.prototype, "assessFrontier").mockImplementation(async () => undefined as never);
    const solver = vi.spyOn(CodexLocalMathProvider.prototype, "execute").mockResolvedValue({
      providerName: "codex-local", modelName: "gpt-6-sol", sources: [], findings: [], mathAttempt: attempt });
    const reviewer = vi.spyOn(CodexLocalMathReviewer.prototype, "reviewRole").mockImplementation(async () => undefined as never);
    await runResearchSandboxWorkerCycle({ organizationId: "transport-org", actorUserId: "transport-user",
      workerId: "transport-worker", correlationId: "transport-correlation", codexLocal: true });
    const agents = vi.mocked(executeMathResearchCycleRound).mock.calls[0]![0].agents;
    await agents.proposePortfolio!(root, [], [], [], [], null, [], null, strategy);
    await agents.propose(root, [], [], [], null, [], null, [], null, strategy);
    await agents.verify(root, [], [], proposal, [], null, [], [], null, null, [], null, strategy);
    for (const role of ["SOURCE_ANALYST", "SOURCE_CHALLENGER"] as const)
      await agents.assessFrontier(role, root, proposal, dossier, null, strategy);
    await agents.solve(root, null, null, null, null, strategy);
    for (const role of ["CRITIC", "ADVERSARY"] as const)
      await agents.reviewRole(role, root, attempt, null, null, null, null, null, strategy);
    for (const spy of [portfolio, planner, verifier, sources, reviewer])
      for (const args of spy.mock.calls) expect(args.at(-1)).toBe(strategy);
    expect(solver.mock.calls[0]![0].scope).toContain(adaptiveAgentMandate(strategy));
    expect(solver.mock.calls[0]![0].scope).toContain(packet.packetDigest);
    expect(solver.mock.calls[0]![0].scope).toContain("not mathematical certification");
    if (graph) {
      for (const spy of [verifier, sources, reviewer]) for (const args of spy.mock.calls)
        expect((args.at(-1) as AdaptiveResearchContext).lemmaGraph).toBe(graph);
      expect(solver.mock.calls[0]![0].scope).toContain(graph.graphDigest);
      expect(solver.mock.calls[0]![0].scope).toContain("semantic alignment UNRESOLVED");
    } else expect(solver.mock.calls[0]![0].scope).toContain("has no required lemma graph");
  });
});
