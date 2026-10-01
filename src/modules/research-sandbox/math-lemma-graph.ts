import { z } from "zod";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { sha256 } from "./integrity";
import { digestMathPilotContract, mathPilotContractSchema, type MathPilotContract } from "./math-pilot";
import type { MathCycleEventPayload } from "./math-cycle";

const digest = z.string().regex(/^[a-f0-9]{64}$/);
const id = z.string().regex(/^[A-Za-z][A-Za-z0-9_]{0,39}$/);
const text = (max: number) => z.string().trim().min(1).max(max);
const variable = z.object({ symbol: id, domain: text(300) }).strict();
const scope = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("UNIVERSAL"), finiteBounds: z.tuple([]) }).strict(),
  z.object({ kind: z.literal("FINITE"), finiteBounds: z.array(z.object({ variable: id,
    lower: text(100), upper: text(100), boundaryConvention: text(120) }).strict()).min(1).max(8) }).strict(),
]);
export const lemmaNodeDraftSchema = z.object({ id: id.refine((value) => value !== "ROOT"),
  statementVersion: z.literal(1), statement: text(2_000), variables: z.array(variable).min(1).max(8),
  quantifiers: z.array(z.object({ kind: z.enum(["FOR_ALL", "EXISTS"]), variable: id }).strict()).min(1).max(8),
  assumptions: z.array(text(500)).min(1).max(8), scope }).strict();
const edgeDraft = z.object({ id, premiseNodeIds: z.array(id).min(1).max(8),
  conclusionNodeId: id, claimedJustification: text(2_000),
  relation: z.enum(["CLAIMED_IMPLICATION", "RESEARCH_DEPENDENCY"]) }).strict();
export const lemmaGraphDraftSchema = z.object({ nodes: z.array(lemmaNodeDraftSchema).min(1).max(6),
  edges: z.array(edgeDraft).min(1).max(8) }).strict().superRefine((graph, ctx) => {
  const fail = (message: string) => ctx.addIssue({ code: "custom", message });
  const ids = new Set(graph.nodes.map((node) => node.id));
  if (ids.size !== graph.nodes.length || new Set(graph.edges.map((edge) => edge.id)).size !== graph.edges.length) fail("Duplicate graph identity");
  for (const node of graph.nodes) {
    const vars = new Set(node.variables.map((entry) => entry.symbol));
    const quantified = node.quantifiers.map((entry) => entry.variable);
    if (vars.size !== node.variables.length || new Set(quantified).size !== quantified.length ||
      quantified.some((symbol) => !vars.has(symbol)) || vars.size !== quantified.length ||
      node.scope.finiteBounds.some((bound) => !vars.has(bound.variable)) ||
      new Set(node.scope.finiteBounds.map((bound) => bound.variable)).size !== node.scope.finiteBounds.length) fail("Unbound variable, quantifier or finite bound");
  }
  ids.add("ROOT");
  const successors = new Map<string, string[]>();
  for (const edge of graph.edges) {
    if (!ids.has(edge.conclusionNodeId) || edge.premiseNodeIds.some((premise) => !ids.has(premise)) ||
      new Set(edge.premiseNodeIds).size !== edge.premiseNodeIds.length || edge.premiseNodeIds.includes(edge.conclusionNodeId)) fail("Dangling, duplicate or self dependency");
    for (const premise of edge.premiseNodeIds) successors.set(premise, [...(successors.get(premise) ?? []), edge.conclusionNodeId]);
  }
  const visiting = new Set<string>(), done = new Set<string>();
  const walk = (node: string): boolean => {
    if (visiting.has(node)) return false;
    if (done.has(node)) return true;
    visiting.add(node);
    if ((successors.get(node) ?? []).some((next) => !walk(next))) return false;
    visiting.delete(node); done.add(node); return true;
  };
  if ([...ids].some((node) => !walk(node))) fail("Circular lemma dependencies");
  const adjacent = new Map<string, string[]>();
  for (const edge of graph.edges) for (const premise of edge.premiseNodeIds) {
    adjacent.set(premise, [...(adjacent.get(premise) ?? []), edge.conclusionNodeId]);
    adjacent.set(edge.conclusionNodeId, [...(adjacent.get(edge.conclusionNodeId) ?? []), premise]);
  }
  const connected = new Set<string>(), pending = ["ROOT"];
  while (pending.length) { const node = pending.pop()!; if (connected.has(node)) continue;
    connected.add(node); pending.push(...(adjacent.get(node) ?? [])); }
  if (graph.nodes.some((node) => !connected.has(node.id))) fail("Every lemma must be connected to the sealed root; direction is not mathematical certification");
});
export type LemmaGraphDraft = z.infer<typeof lemmaGraphDraftSchema>;
export const lemmaGraphSchema = z.object({ version: z.literal(1), cycleId: z.uuid(), branchId: digest,
  rootContractDigest: digest, rootReviewDigest: digest, methodPacketDigest: digest,
  root: z.object({ id: z.literal("ROOT"), contract: mathPilotContractSchema,
    statementVersion: z.literal(1), statementDigest: digest }).strict(),
  nodes: z.array(lemmaNodeDraftSchema.extend({ statementDigest: digest, nodeDigest: digest }).strict()).min(1).max(6),
  edges: z.array(edgeDraft.extend({ edgeDigest: digest, status: z.literal("CLAIMED"),
    semanticAlignment: z.literal("UNRESOLVED") }).strict()).min(1).max(8),
  authority: z.literal("MODEL_PROPOSED_DEPENDENCIES_NOT_PROOF"), graphDigest: digest }).strict();
export type MathLemmaGraph = z.infer<typeof lemmaGraphSchema>;
const hash = (value: unknown) => sha256(canonicalJson(value));
export function lemmaGraphDraft(graph: MathLemmaGraph): LemmaGraphDraft {
  return { nodes: graph.nodes.map(({ statementDigest, nodeDigest, ...node }) => {
    void statementDigest; void nodeDigest; return node;
  }), edges: graph.edges.map(({ edgeDigest, status, semanticAlignment, ...edge }) => {
    void edgeDigest; void status; void semanticAlignment; return edge;
  }) };
}
export function sealMathLemmaGraph(input: { draft: unknown; root: MathPilotContract; cycleId: string;
  branchId: string; rootReviewDigest: string; methodPacketDigest: string }): MathLemmaGraph {
  const draft = lemmaGraphDraftSchema.parse(input.draft);
  const root = mathPilotContractSchema.parse(input.root);
  const body = { version: 1 as const, cycleId: input.cycleId, branchId: input.branchId,
    rootContractDigest: digestMathPilotContract(root), rootReviewDigest: input.rootReviewDigest,
    methodPacketDigest: input.methodPacketDigest, root: { id: "ROOT" as const, contract: root,
      statementVersion: 1 as const, statementDigest: hash({ statementVersion: 1, contract: root }) },
    nodes: draft.nodes.map((node) => ({ ...node,
      statementDigest: hash({ statementVersion: node.statementVersion, statement: node.statement,
        variables: node.variables, quantifiers: node.quantifiers, assumptions: node.assumptions, scope: node.scope }), nodeDigest: hash(node) })),
    edges: draft.edges.map((edge) => ({ ...edge, edgeDigest: hash(edge), status: "CLAIMED" as const,
      semanticAlignment: "UNRESOLVED" as const })), authority: "MODEL_PROPOSED_DEPENDENCIES_NOT_PROOF" as const };
  return lemmaGraphSchema.parse({ ...body, graphDigest: hash(body) });
}
export function validMathLemmaGraph(raw: unknown, expected?: { cycleId?: string; branchId?: string;
  rootContractDigest?: string; rootReviewDigest?: string; methodPacketDigest?: string }): raw is MathLemmaGraph {
  const parsed = lemmaGraphSchema.safeParse(raw);
  if (!parsed.success) return false;
  const graph = parsed.data;
  if (expected && Object.entries(expected).some(([key, value]) => graph[key as keyof MathLemmaGraph] !== value)) return false;
  try { return canonicalJson(graph) === canonicalJson(sealMathLemmaGraph({ draft: lemmaGraphDraft(graph),
    root: graph.root.contract, cycleId: graph.cycleId, branchId: graph.branchId,
    rootReviewDigest: graph.rootReviewDigest, methodPacketDigest: graph.methodPacketDigest })); }
  catch { return false; }
}

/** No execution or semantic theorem checking. Every dependency remains claimed. */
export function lemmaGraphMandate(graph?: MathLemmaGraph | null): string {
  if (!graph) return "";
  return `Sealed lemma graph ${graph.graphDigest} (root ${graph.rootContractDigest}). All edges are CLAIMED, semantic alignment UNRESOLVED, not verified proof. Check exact assumptions, ordered quantifiers, domains and finite/universal scope; a claimed path to ROOT does not establish root closure. RESEARCH_DEPENDENCY is not logical implication. Finite arithmetic or a registered predicate refutation does not certify unmatched prose, a universal implication, or novelty. AI agreement and kernel acceptance without statement alignment are separate evidence dimensions. Do not promote this graph to theorem status.\n${JSON.stringify(graph)}`;
}

/** Input trace must already have passed command-bound cycle validation. Even
 * exact finite tools do not align arbitrary graph/prose statements. */
export function projectMathLemmaGraphEvidence(graph: MathLemmaGraph, trace: readonly MathCycleEventPayload[]) {
  const plan = trace.find((event) => event.phase === "PORTFOLIO_PLANNED");
  if (!validMathLemmaGraph(graph) || plan?.portfolio.version !== 3 ||
    !plan.portfolio.branches.some((branch) => branch.lemmaGraph.graphDigest === graph.graphDigest)) return null;
  const rounds = new Set(trace.flatMap((event) => event.phase === "BRANCH_SELECTED" && event.branchId === graph.branchId ? [event.round] : []));
  const observations = trace.filter((event) => rounds.has(event.round)).flatMap((event) => {
    if (event.phase === "ATTEMPTED") return [{ round: event.round, kind: "INFORMAL_ATTEMPT", eventDigest: hash(event),
      detail: event.attempt.attemptType }];
    if (event.phase === "REVIEWED") return [{ round: event.round, kind: "AI_REVIEW", eventDigest: hash(event),
      detail: `${event.role}: ${event.report.verdict}` }];
    if (event.phase === "INDEPENDENT_REPLAY" || event.phase === "COUNTEREXAMPLE_REPLAY" || event.phase === "STRUCTURAL_PROBED")
      return [{ round: event.round, kind: "FINITE_TOOL", eventDigest: hash(event), detail: `${event.phase}: ${event.report.status}` }];
    if (event.phase === "CERTIFICATE_CHECKED" || event.phase === "PARAMETRIC_CHECKED")
      return [{ round: event.round, kind: "SCOPED_ARITHMETIC", eventDigest: hash(event), detail: event.phase }];
    if (event.phase === "MIXED_CORE_CLAIM_REFUTED") return [{ round: event.round, kind: "REGISTERED_PREDICATE_ONLY", eventDigest: hash(event), detail: event.claim }];
    return [];
  });
  return { graphDigest: graph.graphDigest, observations,
    observationScope: "ROUND_EVIDENCE_WITHOUT_GRAPH_STATEMENT_ALIGNMENT" as const,
    verifiedImplications: 0 as const, semanticAlignment: "UNRESOLVED" as const,
    formalKernelAcceptance: "NOT_RETAINED_FOR_THIS_GRAPH" as const, rootClosure: "NOT_ESTABLISHED" as const };
}
