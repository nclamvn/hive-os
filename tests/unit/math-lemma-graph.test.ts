import { beforeAll, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { sha256 } from "@/modules/research-sandbox/integrity";
import { digestMathPilotContract, resolveMathPilotContract } from "@/modules/research-sandbox/math-pilot";
import { lemmaGraphDraftSchema, lemmaGraphSchema, sealMathLemmaGraph, validMathLemmaGraph, projectMathLemmaGraphEvidence } from "@/modules/research-sandbox/math-lemma-graph";
import { buildResearchMethodPacket } from "@/modules/research-sandbox/math-method-map";
import { buildFrontierDossier } from "@/modules/research-sandbox/math-frontier";
import { sealMathPortfolio, validMathPortfolio } from "@/modules/research-sandbox/math-portfolio";
import type { MathCycleEventPayload } from "@/modules/research-sandbox/math-cycle";
import { MathLemmaGraphPanel } from "@/components/research/math-lemma-graph-panel";
import { CodexLocalMathCycleAgent, mathPortfolioOutputJsonSchema } from "@/modules/research-sandbox/adapters/codex-local-cycle";
import { lemmaDraft } from "../fixtures/math-lemma-graph";
import { mixedCoreClaimSchema } from "@/modules/research-sandbox/math-mixed-core-agent";

const root = resolveMathPilotContract({ caseType: "OPEN", statement: "For every prime p ≡ 1 (mod 840), does 4/p = 1/x + 1/y + 1/z hold?",
  definitions: "x, y, z are positive integers and p is prime.", assumptions: "Exact integer arithmetic.",
  successCriterion: "A general proof is needed.", falsificationCriterion: "A checked counterexample is needed.", exclusions: "Finite counts do not prove a universal result." });
const binding = { cycleId: "00000000-0000-4000-8000-000000000035", branchId: "a".repeat(64),
  rootReviewDigest: "b".repeat(64), methodPacketDigest: "c".repeat(64), root };
const seal = (draft: unknown = lemmaDraft()) => sealMathLemmaGraph({ ...binding, draft });
let packet: Awaited<ReturnType<typeof buildResearchMethodPacket>>;
beforeAll(async () => { const dossier = await buildFrontierDossier(root, async () => { throw new Error("offline"); });
  packet = await buildResearchMethodPacket(root, dossier.dossierDigest, { statusLoader: async () => { throw new Error("offline"); } }); });
function portfolio() {
  const base = { strategy: "STRUCTURAL_LEMMA", proposal: { sourceGap: "A root bridge remains unproved.",
    hypothesis: "A new support condition may give a root-directed structural bridge.", taskStatement: "Explore a support condition for the residual prime domain of the sealed root.",
    falsificationPlan: "Find a complete premise instance violating the proposed support condition.", successEvidence: "An independently scrutinized argument with all assumptions stated.",
    rationale: "The proposed structural bridge addresses the root rather than warmup counts." },
    anticipatedFalsifier: "A complete premise instance that violates the support conclusion.", expectedInformationGain: "HIGH", toolNeeds: ["SOURCE_REVIEW"],
    methodId: "SUPPORT_UNIFORM_BRIDGE", methodFamily: "GLOBAL_BRIDGE", rootContribution: { kind: "ROOT_BRIDGE", statement: "A proposed bridge addresses the unbounded root quantifiers." },
    applicabilityAssumptions: "Support conditions and applicability remain unverified.",
    discriminatingExperiment: { question: "Does the missing structural bridge follow under every stated premise?", supportOutcome: "Seek independent proof checking of the proposed implication.",
      refutationOutcome: "Retire the exact registered predicate, not arbitrary prose.", inconclusiveOutcome: "Retain the unresolved bridge and try another method family." },
    requiredTools: ["PROOF_ATTEMPT"], evaluationScope: "UNVALIDATED_RESEARCH", lemmaGraph: lemmaDraft() };
  return sealMathPortfolio({ draft: { version: 3, branches: [base, { ...base, methodId: "TAO_LOCAL_OBSTRUCTION", methodFamily: "LOCAL_OBSTRUCTION",
    proposal: { ...base.proposal, hypothesis: "A distinct local condition may reveal the unresolved structural obstruction." } }] },
    rootReviewDigest: binding.rootReviewDigest, availableGaps: [base.proposal.sourceGap], priorObligations: [],
    maxObservedTokens: 60_000, maxRounds: 2, methodPacket: packet, graphPolicy: { cycleId: binding.cycleId, root } });
}
describe("sealed proposed lemma graphs", () => {
  it("seals exact root, statement versions, quantifier order and separate node/edge digests", () => {
    const graph = seal(); expect(validMathLemmaGraph(graph, { rootContractDigest: digestMathPilotContract(root), cycleId: binding.cycleId })).toBe(true);
    expect(graph.root.contract).toEqual(root); expect(graph.edges[0]).toMatchObject({ status: "CLAIMED", semanticAlignment: "UNRESOLVED" });
    expect(graph.nodes[0].statementDigest).not.toBe(graph.nodes[0].nodeDigest);
    const reordered = JSON.parse(JSON.stringify(graph, Object.keys(graph).reverse()));
    expect(validMathLemmaGraph(reordered)).toBe(false); // replacer intentionally strips nested content
    expect(validMathLemmaGraph({ ...graph, nodes: graph.nodes, version: 1 })).toBe(true);
  });
  it.each(["duplicate", "dangling", "self", "cycle", "disconnected", "free-variable", "duplicate-quantifier", "wrong-bound"])("rejects %s graph", (mode) => {
    const draft = lemmaDraft();
    if (mode === "duplicate") draft.nodes.push(draft.nodes[0]);
    if (mode === "dangling") draft.edges[0].premiseNodeIds = ["Absent"];
    if (mode === "self") draft.edges[0].conclusionNodeId = "Support";
    if (mode === "cycle") draft.edges.push({ ...draft.edges[0], id: "Back", premiseNodeIds: ["ROOT"], conclusionNodeId: "Support" });
    if (mode === "disconnected") draft.nodes.push({ ...draft.nodes[0], id: "Unused" });
    if (mode === "free-variable") draft.nodes[0].quantifiers[0].variable = "q";
    if (mode === "duplicate-quantifier") draft.nodes[0].quantifiers.push(draft.nodes[0].quantifiers[0]);
    if (mode === "wrong-bound") draft.nodes[0].scope = { kind: "FINITE", finiteBounds: [{ variable: "q", lower: "1", upper: "10", boundaryConvention: "inclusive" }] };
    expect(lemmaGraphDraftSchema.safeParse(draft).success).toBe(false);
  });
  it("preserves a necessary-direction research edge without inventing the reverse bridge", () => {
    const draft = lemmaDraft(); draft.edges[0] = { ...draft.edges[0], premiseNodeIds: ["ROOT"], conclusionNodeId: "Support", relation: "RESEARCH_DEPENDENCY" };
    expect(validMathLemmaGraph(seal(draft))).toBe(true);
  });
  it("preserves ordered alternating quantifiers without certifying their semantics", () => {
    const draft = lemmaDraft();
    draft.nodes[0].variables.push({ symbol: "x", domain: "positive integer" });
    draft.nodes[0].quantifiers.push({ kind: "EXISTS", variable: "x" });
    const first = seal(draft);
    const swapped = structuredClone(draft); swapped.nodes[0].quantifiers.reverse();
    const second = seal(swapped);
    expect(first.nodes[0].statementDigest).not.toBe(second.nodes[0].statementDigest);
    expect(first.graphDigest).not.toBe(second.graphDigest);
    expect(second.edges[0].semanticAlignment).toBe("UNRESOLVED");
    const tampered = structuredClone(first); tampered.nodes[0].quantifiers.reverse();
    expect(validMathLemmaGraph(tampered)).toBe(false);
  });
  it.each(["ADAPTIVE_RESEARCH_V1", "ADAPTIVE_RESEARCH_V2"] as const)("production planner prompt consistently selects %s version without extra calls", async (policyId) => {
    const agent = new CodexLocalMathCycleAgent();
    const call = vi.spyOn(agent as unknown as { call: (...args: unknown[]) => Promise<unknown> }, "call").mockResolvedValue({});
    await agent.proposePortfolio(root, ["A root bridge remains unproved."], [], [], [], null, [], null,
      { packet, outcomes: [], selectedBranch: null, selection: null, policyId });
    expect(call).toHaveBeenCalledTimes(1);
    const prompt = call.mock.calls[0][2] as string;
    expect(prompt).toContain(policyId === "ADAPTIVE_RESEARCH_V2" ? "Return version:3 and" : "Return version:2 and");
    expect(prompt).not.toContain(policyId === "ADAPTIVE_RESEARCH_V2" ? "Return version:2 and" : "Return version:3");
    call.mockRestore();
  });
  it("rejects authored verified status and scope stripping, and distinguishes finite from universal", () => {
    const draft = lemmaDraft();
    expect(lemmaGraphDraftSchema.safeParse({ ...draft, edges: [{ ...draft.edges[0], status: "VERIFIED" }] }).success).toBe(false);
    const finite = lemmaDraft(); finite.nodes[0].scope = { kind: "FINITE", finiteBounds: [{ variable: "p", lower: "841", upper: "200000000", boundaryConvention: "inclusive" }] };
    expect(seal(finite).graphDigest).not.toBe(seal().graphDigest);
    expect(lemmaGraphDraftSchema.safeParse({ ...finite, nodes: [{ ...finite.nodes[0], scope: { kind: "FINITE", finiteBounds: [] } }] }).success).toBe(false);
    expect(lemmaGraphSchema.safeParse({ ...seal(), edges: [{ ...seal().edges[0], semanticAlignment: "VERIFIED" }] }).success).toBe(false);
  });
  it("binds even re-sealed root changes to trusted exact root identity", () => {
    const changed = sealMathLemmaGraph({ ...binding, root: { ...root, statement: "A weaker finite statement replacing the root problem." }, draft: lemmaDraft() });
    expect(validMathLemmaGraph(changed)).toBe(true);
    expect(validMathLemmaGraph(changed, { rootContractDigest: digestMathPilotContract(root) })).toBe(false);
    const tampered = { ...seal(), rootContractDigest: "d".repeat(64) }; expect(validMathLemmaGraph(tampered)).toBe(false);
  });
  it("retains required V3 graph and rejects a rehashed graph-stripping portfolio", () => {
    const plan = portfolio(); expect(plan.version).toBe(3); expect(validMathPortfolio(plan, packet)).toBe(true);
    const stripped = JSON.parse(JSON.stringify(plan)); delete stripped.branches[0].lemmaGraph;
    const { portfolioDigest, ...body } = stripped; void portfolioDigest;
    stripped.portfolioDigest = sha256(canonicalJson(body)); expect(validMathPortfolio(stripped, packet)).toBe(false);
  });
  it("production JSON requires graph but never lets a model author sealed authority", () => {
    const output = mathPortfolioOutputJsonSchema(true, true) as { properties: { version: { enum: number[] }; branches: { items: { required: string[]; properties: { lemmaGraph: { properties: object } } } } } };
    expect(output.properties.version.enum).toEqual([3]); expect(output.properties.branches.items.required).toContain("lemmaGraph");
    expect(output.properties.branches.items.properties.lemmaGraph.properties).not.toHaveProperty("authority");
    expect(output.properties.branches.items.properties.lemmaGraph.properties).not.toHaveProperty("root");
  });
  it("does not turn closure/AI agreement/finite evidence into verified graph edges", () => {
    const plan = portfolio(); if (plan.version !== 3) throw new Error("fixture");
    const graph = plan.branches[0].lemmaGraph;
    const trace: MathCycleEventPayload[] = [{ phase: "PORTFOLIO_PLANNED", round: 1, portfolio: plan,
      context: { threadId: "fixture", usage: { inputTokens: 1, cachedInputTokens: 0, outputTokens: 1, reasoningOutputTokens: 0 } } },
    { phase: "BRANCH_SELECTED", round: 1, portfolioDigest: plan.portfolioDigest, branchId: graph.branchId, baselineObservedTokens: 0, selectedAt: new Date().toISOString() },
    { phase: "ROUND_CLOSED", round: 1, disposition: "AI_REVIEWED", conclusion: "PARTIAL", nextGap: null }];
    expect(projectMathLemmaGraphEvidence(graph, trace)).toMatchObject({ observations: [], verifiedImplications: 0,
      rootClosure: "NOT_ESTABLISHED", formalKernelAcceptance: "NOT_RETAINED_FOR_THIS_GRAPH", semanticAlignment: "UNRESOLVED" });
    const usage = { inputTokens: 1, cachedInputTokens: 0, outputTokens: 1, reasoningOutputTokens: 0 };
    const observed: MathCycleEventPayload[] = [...trace,
      { phase: "MIXED_CORE_CLAIM_REFUTED", round: 1, claim: mixedCoreClaimSchema.options[0], evidenceDigest: "d".repeat(64) },
      ...(["CRITIC", "ADVERSARY"] as const).map((role): MathCycleEventPayload => ({ phase: "REVIEWED", round: 1, role,
        report: { role, verdict: "SUPPORTS", candidateConclusion: "SUPPORTED_ARGUMENT", exactQuote: "A proposed support bridge.",
          reasoning: "The model accepts a proposed argument without a formal statement-alignment certificate.",
          checks: ["Check the exact quantifiers and applicability assumptions."], unresolvedGap: null, threadId: role, usage } }))];
    const projection = projectMathLemmaGraphEvidence(graph, observed);
    expect(projection?.observations).toHaveLength(3);
    expect(projection).toMatchObject({ verifiedImplications: 0, rootClosure: "NOT_ESTABLISHED", semanticAlignment: "UNRESOLVED" });
  });
  it("keeps a vacuous or unsupported claimed implication unresolved rather than certifying it", () => {
    const draft = lemmaDraft(); draft.nodes[0].assumptions = ["p is both prime and composite; consistency has not been established."];
    draft.edges[0].claimedJustification = "An unsupported assertion that this inconsistent premise implies the sealed root.";
    const graph = seal(draft);
    expect(validMathLemmaGraph(graph)).toBe(true); // syntax, not premise consistency or truth
    expect(graph).toMatchObject({ authority: "MODEL_PROPOSED_DEPENDENCIES_NOT_PROOF",
      edges: [{ status: "CLAIMED", semanticAlignment: "UNRESOLVED" }] });
  });
  it.each(["vi", "en"] as const)("renders retained graph and legacy absence in %s without GET execution", (locale) => {
    const plan = portfolio(); const fetch = vi.fn(); vi.stubGlobal("fetch", fetch);
    try {
      const html = renderToStaticMarkup(createElement(MathLemmaGraphPanel, { locale, trace: [{ phase: "PORTFOLIO_PLANNED", round: 1, portfolio: plan,
        context: { threadId: "fixture", usage: { inputTokens: 1, cachedInputTokens: 0, outputTokens: 1, reasoningOutputTokens: 0 } } }] }));
      expect(html).toContain("ROOT"); expect(html).toContain(digestMathPilotContract(root)); expect(html).toContain("overflow-wrap:anywhere");
      expect(html).not.toContain("theorem solved");
      expect(renderToStaticMarkup(createElement(MathLemmaGraphPanel, { locale, trace: [] }))).toContain(locale === "vi" ? "chưa lưu đồ thị" : "no new retained lemma graph");
      expect(fetch).not.toHaveBeenCalled();
    } finally { vi.unstubAllGlobals(); }
  });
});
