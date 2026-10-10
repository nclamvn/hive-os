import { z } from "zod";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { exactInteger, frozen, parseSchema, refuse } from "../bounded-json";
import type { AcceptanceType, DomainAdapter, DomainCheck, DomainMethodCard, Json } from "../types";

const inputSchema = z.object({
  kind: z.enum(["LINEAR_WITNESS", "FINITE_LINEAR_REFUTATION"]),
  coefficients: z.array(z.string().max(22)).min(1).max(4),
  rhs: z.string().max(22),
  maxValue: z.number().int().min(1).max(16).optional(),
}).strict();
type Input = z.infer<typeof inputSchema>;
const witnessSchema = z.object({ kind: z.literal("INTEGER_WITNESS"), values: z.array(z.string().max(22)).min(1).max(4) }).strict();
const refutationSchema = z.object({ kind: z.literal("FINITE_EXHAUSTION"), checkedAssignments: z.number().int().min(1).max(65536) }).strict();
const card = (id: string, type: AcceptanceType, experiment: string, material: string): DomainMethodCard => ({ id,acceptanceTypes: [type],discriminatingExperiment: experiment,material });
const methodCards = frozen([
  card("LINEAR_SUBSTITUTION","INTEGER_WITNESS","Substitute every proposed positive integer into the exact sealed equation; compare integer sums.","Construct a positive tuple and test exact substitution; failed tuple does not refute existence."),
  card("LINEAR_MODULAR_FILTER","INTEGER_WITNESS","Use an exact small modulus to reject a proposed tuple, then require full integer substitution for acceptance.","Modular arithmetic is a candidate filter only, never the witness certificate."),
  card("LINEAR_COEFFICIENT_BOUND","INTEGER_WITNESS","Compare the proposed positive tuple contribution against the signed sealed coefficients and rhs, then test exact equality.","Inspect coefficient signs/bounds to propose a different positive tuple; do not invent finite upper bounds on an unbounded target."),
  card("FINITE_BOX_EXHAUSTION","FINITE_EXHAUSTION","Enumerate every tuple in the exact sealed finite box and detect any equality.","Only exhaustive finite coverage establishes the committed box predicate."),
  card("FINITE_BOX_PARITY_FILTER","FINITE_EXHAUSTION","Check exact congruence as a diagnostic filter, then independently enumerate the entire named box.","Do not replace box coverage with a modulus sample or relabel the bound."),
  card("FINITE_BOX_BOUND_FILTER","FINITE_EXHAUSTION","Inspect exact signed contribution bounds, then require independent full sealed-box enumeration.","A bound suggestion is not itself admitted exhaustive evidence; return exact expected box count."),
]);
export const integerWitnessAdapter: DomainAdapter = frozen<DomainAdapter>({
  id: "INTEGER_WITNESS", version: 1,
  checkerSourceDigest: sha256("RESEARCH_CORE_V3:INTEGER_LINEAR_EXACT:1"),
  limits: { maxInputBytes: 16384, maxCandidateBytes: 8192, maxArrayLength: 16, maxIntegerBits: 64, maxIntermediateBits: 256, maxOperations: 600000, maxCheckMilliseconds: 1000, maxDimensions: { variables: 4, finiteMaxValue: 16, finiteAssignments: 65536 } },
  capabilities: ["INTEGER_WITNESS", "FINITE_EXHAUSTION"],
  methodCards,
  applicableMethods(raw) { const finite = (raw as unknown as Input).kind === "FINITE_LINEAR_REFUTATION"; return methodCards.filter(c => c.acceptanceTypes.includes(finite ? "FINITE_EXHAUSTION" : "INTEGER_WITNESS")); },
  methodMaterial: "Check the exact sealed positive-integer linear equation. A witness proves only existence. A finite box exhaustion proves only the named box has no solutions, not a universal theorem or primality.",
  inputSchema: { type: "object", additionalProperties: false, required: ["kind", "coefficients", "rhs"], properties: { kind: { enum: ["LINEAR_WITNESS", "FINITE_LINEAR_REFUTATION"] }, coefficients: { type: "array", minItems: 1, maxItems: 4, items: { type: "string", maxLength: 22 } }, rhs: { type: "string", maxLength: 22 }, maxValue: { type: "integer", minimum: 1, maximum: 16 } } },
  candidateSchema: { oneOf: [
    { type: "object", additionalProperties: false, required: ["kind", "values"], properties: { kind: { const: "INTEGER_WITNESS" }, values: { type: "array", minItems: 1, maxItems: 4, items: { type: "string", maxLength: 22 } } } },
    { type: "object", additionalProperties: false, required: ["kind", "checkedAssignments"], properties: { kind: { const: "FINITE_EXHAUSTION" }, checkedAssignments: { type: "integer", minimum: 1, maximum: 65536 } } },
  ] },
  parseInput(raw) {
    const input = parseSchema(inputSchema, raw);
    input.coefficients.forEach(v => exactInteger(v, 64)); exactInteger(input.rhs, 64);
    if (input.kind === "FINITE_LINEAR_REFUTATION" ? input.maxValue === undefined : input.maxValue !== undefined) refuse("SCHEMA_REFUSED", "Finite box bound must be explicit and only used for finite refutation");
    return input as Json;
  },
  alignment(raw) {
    const input = raw as unknown as Input;
    const finite = input.kind === "FINITE_LINEAR_REFUTATION";
    return {
      definitions: [{ id: "positive-linear-equation", statement: `sum(coefficients[i]*x[i])=rhs; sealed input=${canonicalJson(input)}` }],
      quantifiers: [{ kind: finite ? "FOR_ALL" : "EXISTS", variable: "x", domain: finite ? `{1,...,${input.maxValue}}^${input.coefficients.length}` : `positive-integer^${input.coefficients.length}` }],
      assumptions: [],
      predicate: { kind: finite ? "NO_SOLUTION_IN_FINITE_BOX" : "EXISTS_POSITIVE_INTEGER_SOLUTION", input },
      acceptanceType: finite ? "FINITE_EXHAUSTION" : "INTEGER_WITNESS",
    };
  },
  parseCandidate(raw, domainInput) {
    const input = domainInput as unknown as Input;
    if (input.kind === "LINEAR_WITNESS") {
      const candidate = parseSchema(witnessSchema, raw);
      if (candidate.values.length !== input.coefficients.length) refuse("SCHEMA_REFUSED", "Witness dimension mismatch");
      candidate.values.forEach(v => { if (exactInteger(v, 64) <= BigInt(0)) refuse("SCHEMA_REFUSED", "Witness must be positive integer"); });
      return candidate as Json;
    }
    return parseSchema(refutationSchema, raw) as Json;
  },
  check(raw, candidate, budget): DomainCheck {
    const input = raw as unknown as Input;
    const coefficients = input.coefficients.map(v => exactInteger(v, 64));
    const rhs = exactInteger(input.rhs, 64);
    const scope = { predicate: integerWitnessAdapter.alignment(raw).predicate, domain: integerWitnessAdapter.alignment(raw).quantifiers[0].domain };
    if (input.kind === "LINEAR_WITNESS") {
      const values = (candidate as unknown as z.infer<typeof witnessSchema>).values.map(v => exactInteger(v, 64));
      let sum = BigInt(0);
      for (let i = 0; i < coefficients.length; i++) sum = budget.integer(sum + budget.integer(coefficients[i] * values[i]));
      return { result: sum === rhs ? "VERIFIED" : "REJECTED", scientificDisposition: sum === rhs ? "VERIFIED_EXACT_SCOPE" : "INVALID_CANDIDATE", refutation: null, reason: sum === rhs ? "Exact positive-integer witness" : "Equation does not hold", checkedScope: scope as Json, coverage: { variables: values.length, equations: 1 } };
    }
    const max = input.maxValue!;
    const total = max ** coefficients.length;
    let checked = 0;
    for (let index = 0; index < total; index++) {
      let cursor = index; let sum = BigInt(0);
      for (let i = 0; i < coefficients.length; i++) {
        const value = cursor % max + 1; cursor = Math.floor(cursor / max);
        sum = budget.integer(sum + budget.integer(coefficients[i] * BigInt(value)));
      }
      checked++;
      if (sum === rhs) return { result: "REJECTED", scientificDisposition: "REFUTED_EXACT_PREDICATE", refutation: { predicate: integerWitnessAdapter.alignment(raw).predicate,checkedScope: scope as Json }, reason: "Finite refutation is false: solution exists in box", checkedScope: scope as Json, coverage: { checkedAssignments: checked, totalAssignments: total } };
    }
    const claimed = (candidate as unknown as z.infer<typeof refutationSchema>).checkedAssignments;
    return { result: claimed === checked ? "VERIFIED" : "REJECTED", scientificDisposition: claimed === checked ? "VERIFIED_EXACT_SCOPE" : "INVALID_CANDIDATE", refutation: null, reason: claimed === checked ? "Independent complete finite box exhaustion" : "Claimed finite coverage mismatch", checkedScope: scope as Json, coverage: { checkedAssignments: checked, totalAssignments: total } };
  },
});
