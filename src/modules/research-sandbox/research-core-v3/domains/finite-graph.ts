import { z } from "zod";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { frozen, parseSchema, refuse } from "../bounded-json";
import type { DomainAdapter, DomainCheck, DomainMethodCard, Json } from "../types";

const inputSchema = z.object({ kind: z.enum(["COLORING", "ODD_CYCLE"]), vertexCount: z.number().int().min(1).max(64), edges: z.array(z.tuple([z.number().int().nonnegative(), z.number().int().nonnegative()])).max(256), colorCount: z.number().int().min(1).max(16).optional() }).strict();
type Input = z.infer<typeof inputSchema>;
const coloringSchema = z.object({ kind: z.literal("COLORING"), colors: z.array(z.number().int().nonnegative()).min(1).max(64) }).strict();
const oddCycleSchema = z.object({ kind: z.literal("ODD_CYCLE"), cycle: z.array(z.number().int().nonnegative()).min(3).max(63) }).strict();
const card = (id: string, experiment: string, material: string): DomainMethodCard => ({ id,acceptanceTypes: ["FINITE_GRAPH_CERTIFICATE"],discriminatingExperiment: experiment,material });
const methodCards = frozen([
  card("COLOR_GREEDY","Construct colors in vertex order and check every edge of the full graph.","A greedy failure is not non-colorability; the certificate must cover isolated vertices too."),
  card("COLOR_COMPONENTS","Construct complete component-wise colors, then check the full sealed graph.","Connected-component decomposition must not omit vertices or edges."),
  card("COLOR_BACKTRACK","Try bounded candidate color assignments and check all edges.","Return one complete valid coloring, not an unreviewed search transcript or infinite-family claim."),
  card("ODD_CYCLE_BFS","Seek an odd cycle using parity conflict and check every consecutive sealed edge.","A candidate cycle must be simple and odd; missing cycles do not certify bipartiteness."),
  card("ODD_CYCLE_COMPONENTS","Inspect components for a simple odd cycle and independently validate the complete input.","Subgraph witness is allowed only after full graph input validation."),
  card("ODD_CYCLE_EDGE_SEARCH","Inspect edge-linked candidate cycles and check odd length/distinct vertices/closing edge.","Do not accept a walk with repeated vertices as a simple odd-cycle certificate."),
]);
export const finiteGraphAdapter: DomainAdapter = frozen<DomainAdapter>({
  id: "FINITE_GRAPH", version: 1, checkerSourceDigest: sha256("RESEARCH_CORE_V3:FINITE_GRAPH_EXACT:1"),
  limits: { maxInputBytes: 32768, maxCandidateBytes: 16384, maxArrayLength: 256, maxIntegerBits: 32, maxIntermediateBits: 64, maxOperations: 4096, maxCheckMilliseconds: 1000, maxDimensions: { vertices: 64, edges: 256, colors: 16, oddCycleVertices: 63 } },
  capabilities: ["FINITE_GRAPH_CERTIFICATE"],
  methodCards,
  applicableMethods(raw) { const prefix = (raw as unknown as Input).kind === "COLORING" ? "COLOR_" : "ODD_CYCLE_"; return methodCards.filter(c => c.id.startsWith(prefix)); },
  methodMaterial: "Use the entire sealed simple undirected graph. Coloring must cover every vertex and satisfy every edge. A simple odd cycle certifies only this graph is not bipartite, not a universal infinite-family theorem.",
  inputSchema: { type: "object", additionalProperties: false, required: ["kind", "vertexCount", "edges"], properties: { kind: { enum: ["COLORING", "ODD_CYCLE"] }, vertexCount: { type: "integer", minimum: 1, maximum: 64 }, edges: { type: "array", maxItems: 256, items: { type: "array", minItems: 2, maxItems: 2, items: { type: "integer", minimum: 0, maximum: 63 } } }, colorCount: { type: "integer", minimum: 1, maximum: 16 } } },
  candidateSchema: { oneOf: [
    { type: "object", additionalProperties: false, required: ["kind", "colors"], properties: { kind: { const: "COLORING" }, colors: { type: "array", minItems: 1, maxItems: 64, items: { type: "integer", minimum: 0, maximum: 15 } } } },
    { type: "object", additionalProperties: false, required: ["kind", "cycle"], properties: { kind: { const: "ODD_CYCLE" }, cycle: { type: "array", minItems: 3, maxItems: 63, items: { type: "integer", minimum: 0, maximum: 63 } } } },
  ] },
  parseInput(raw) {
    const input = parseSchema(inputSchema, raw);
    if (input.kind === "COLORING" ? input.colorCount === undefined : input.colorCount !== undefined) refuse("SCHEMA_REFUSED", "Color bound required only for coloring");
    const seen = new Set<string>();
    for (const [a, b] of input.edges) {
      if (a >= input.vertexCount || b >= input.vertexCount || a >= b) refuse("SCHEMA_REFUSED", "Edges must be distinct increasing valid vertex pairs");
      const key = `${a}:${b}`;
      if (seen.has(key)) refuse("SCHEMA_REFUSED", "Duplicate graph edge"); seen.add(key);
    }
    return input as Json;
  },
  alignment(raw) {
    const input = raw as unknown as Input;
    return {
      definitions: [{ id: "sealed-simple-graph", statement: `Vertices 0..${input.vertexCount - 1}, complete input=${canonicalJson(input)}` }],
      quantifiers: [{ kind: "EXISTS", variable: input.kind === "COLORING" ? "colors" : "cycle", domain: input.kind === "COLORING" ? `{0,...,${input.colorCount! - 1}}^${input.vertexCount}` : "distinct-vertex odd cycles in sealed graph" }],
      assumptions: [], predicate: { kind: input.kind === "COLORING" ? "SEALED_GRAPH_COLORABLE" : "SEALED_GRAPH_NOT_BIPARTITE", input }, acceptanceType: "FINITE_GRAPH_CERTIFICATE",
    };
  },
  parseCandidate(raw, domainInput) {
    const input = domainInput as unknown as Input;
    if (input.kind === "COLORING") {
      const candidate = parseSchema(coloringSchema, raw);
      if (candidate.colors.length !== input.vertexCount || candidate.colors.some(c => c >= input.colorCount!)) refuse("SCHEMA_REFUSED", "Coloring must cover every vertex within color bound");
      return candidate as Json;
    }
    const candidate = parseSchema(oddCycleSchema, raw);
    if (candidate.cycle.length % 2 !== 1 || new Set(candidate.cycle).size !== candidate.cycle.length || candidate.cycle.some(v => v >= input.vertexCount)) refuse("SCHEMA_REFUSED", "Cycle must contain odd number of distinct valid vertices");
    return candidate as Json;
  },
  check(raw, candidate, budget): DomainCheck {
    const input = raw as unknown as Input;
    const scope = { predicate: finiteGraphAdapter.alignment(raw).predicate, fullInputValidated: true };
    // Every input edge is inspected, even when the witness uses only a subgraph.
    const edgeSet = new Set<string>();
    for (const [a,b] of input.edges) { budget.tick(); edgeSet.add(`${a}:${b}`); }
    if (input.kind === "COLORING") {
      const colors = (candidate as unknown as z.infer<typeof coloringSchema>).colors;
      let valid = true;
      for (const [a,b] of input.edges) { budget.tick(); if (colors[a] === colors[b]) valid = false; }
      return { result: valid ? "VERIFIED" : "REJECTED", scientificDisposition: valid ? "VERIFIED_EXACT_SCOPE" : "INVALID_CANDIDATE", refutation: null, reason: valid ? "Every vertex and edge checked" : "Adjacent vertices share a color", checkedScope: scope as Json, coverage: { inputVertices: input.vertexCount, coveredVertices: colors.length, checkedEdges: input.edges.length } };
    }
    const cycle = (candidate as unknown as z.infer<typeof oddCycleSchema>).cycle;
    let valid = true;
    for (let i = 0; i < cycle.length; i++) { budget.tick(); const a = cycle[i], b = cycle[(i + 1) % cycle.length]; if (!edgeSet.has(`${Math.min(a,b)}:${Math.max(a,b)}`)) valid = false; }
    return { result: valid ? "VERIFIED" : "REJECTED", scientificDisposition: valid ? "VERIFIED_EXACT_SCOPE" : "INVALID_CANDIDATE", refutation: null, reason: valid ? "Exact simple odd cycle in complete sealed input" : "Cycle contains a missing edge", checkedScope: scope as Json, coverage: { inputVertices: input.vertexCount, validatedEdges: input.edges.length, witnessVertices: cycle.length, checkedCycleEdges: cycle.length } };
  },
});
