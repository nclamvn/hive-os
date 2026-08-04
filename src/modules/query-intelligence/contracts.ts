import { z } from "zod";

const boundedText = (maximum: number) =>
  z.string().trim().min(1).max(maximum);

export const queryLanguageSchema = z.enum(["vi", "en", "unknown"]);

export const queryIntentSchema = z.enum([
  "LOOKUP",
  "NAVIGATE",
  "COMPARE",
  "SUMMARIZE",
  "TRACE_PROVENANCE",
  "FIND_GAP",
  "UNKNOWN",
]);

export const entityKindSchema = z.enum([
  "PRODUCT",
  "MODULE",
  "VERSION",
  "PROJECT",
  "CUSTOMER",
  "PARTNER",
  "PERSON",
  "ORG_UNIT",
  "POLICY",
  "PROCESS",
  "CONTRACT",
  "TECHNICAL_TERM",
  "MISSION",
  "OTHER",
]);

export const entityMatchBasisSchema = z.enum([
  "EXACT_CANONICAL",
  "EXACT_ALIAS",
  "NORMALIZED_ALIAS",
  "FUZZY",
  "PROVIDER_PROPOSAL_CONFIRMED_BY_REGISTRY",
]);

/**
 * Output from a language analyzer is untrusted. It may describe language and
 * intent, but it cannot select tenant IDs, permissions, evidence, or an
 * authoritative entity ID.
 */
export const queryAnalysisSchema = z
  .object({
    normalizedQuestion: boundedText(1_000),
    language: queryLanguageSchema,
    intent: queryIntentSchema,
    requestedAttributes: z.array(boundedText(120)).max(20),
    entityMentions: z.array(boundedText(200)).max(20),
    ambiguitySignals: z.array(boundedText(300)).max(20),
    interpretationConfidence: z.number().min(0).max(1),
  })
  .strict();

export const queryScopeSchema = z
  .object({
    organizationId: z.string().uuid(),
    workspaceId: z.string().uuid(),
    missionIds: z.array(z.string().uuid()).max(25),
    asOf: z.iso.datetime().nullable(),
  })
  .strict();

export const entityCandidateSchema = z
  .object({
    entityId: boundedText(200),
    entityKind: entityKindSchema,
    canonicalName: boundedText(300),
    confidence: z.number().min(0).max(1),
    matchBasis: entityMatchBasisSchema,
    lifecycle: z.enum(["ACTIVE", "DEPRECATED"]),
    registryRevision: z.number().int().positive(),
  })
  .strict();

export const queryTrustPolicySchema = z
  .object({
    minimumInterpretationConfidence: z.number().min(0).max(1),
    autoRetrieveMinimum: z.number().min(0).max(1),
    clarificationMinimum: z.number().min(0).max(1),
    minimumCandidateSeparation: z.number().min(0).max(1),
  })
  .strict()
  .refine(
    (value) => value.clarificationMinimum <= value.autoRetrieveMinimum,
    {
      message:
        "clarificationMinimum cannot exceed autoRetrieveMinimum",
      path: ["clarificationMinimum"],
    },
  );

export const queryDispositionSchema = z.enum([
  "RETRIEVE",
  "CLARIFY",
  "KNOWLEDGE_GAP",
]);

export const queryDispositionReasonSchema = z.enum([
  "CONFIDENT_ENTITY",
  "ENTITY_NOT_REQUIRED",
  "ANALYZER_AMBIGUITY",
  "UNKNOWN_INTENT",
  "LOW_INTERPRETATION_CONFIDENCE",
  "NO_REGISTRY_CANDIDATE",
  "LOW_ENTITY_CONFIDENCE",
  "MEDIUM_ENTITY_CONFIDENCE",
  "CANDIDATES_TOO_CLOSE",
  "DEPRECATED_ENTITY",
]);

export const queryPlanSchema = z
  .object({
    version: z.literal(1),
    rawQuestion: boundedText(1_000),
    analysis: queryAnalysisSchema,
    scope: queryScopeSchema,
    entityRequirement: z.enum(["REQUIRED", "OPTIONAL", "NONE"]),
    policy: queryTrustPolicySchema,
    candidates: z.array(entityCandidateSchema).max(10),
    disposition: queryDispositionSchema,
    dispositionReasons: z.array(queryDispositionReasonSchema).min(1).max(10),
    authorizationState: z.literal("REQUIRED_AT_RETRIEVAL"),
    authority: z.literal("READ_ONLY_NON_AUTHORITATIVE"),
  })
  .strict();

export type QueryAnalysis = z.output<typeof queryAnalysisSchema>;
export type QueryScope = z.output<typeof queryScopeSchema>;
export type EntityCandidate = z.output<typeof entityCandidateSchema>;
export type QueryTrustPolicy = z.output<typeof queryTrustPolicySchema>;
export type QueryPlan = z.output<typeof queryPlanSchema>;

export class QueryTrustContractError extends Error {
  readonly code = "INVALID_QUERY_TRUST_CONTRACT";

  constructor(message: string) {
    super(message);
    this.name = "QueryTrustContractError";
  }
}

function parseOrThrow<T>(schema: z.ZodType<T>, value: unknown, label: string): T {
  const result = schema.safeParse(value);
  if (!result.success) {
    throw new QueryTrustContractError(
      `${label} is invalid: ${result.error.issues
        .map((issue) => issue.path.join(".") || "(root)")
        .join(", ")}`,
    );
  }
  return result.data;
}

function uniqueCandidates(candidates: EntityCandidate[]) {
  const identifiers = candidates.map((candidate) => candidate.entityId);
  if (new Set(identifiers).size !== identifiers.length) {
    throw new QueryTrustContractError("Entity candidate IDs must be unique");
  }
  return [...candidates].sort(
    (left, right) =>
      right.confidence - left.confidence ||
      left.entityId.localeCompare(right.entityId),
  );
}

export function compileQueryPlan(input: {
  rawQuestion: unknown;
  analysis: unknown;
  trustedScope: unknown;
  entityRequirement: "REQUIRED" | "OPTIONAL" | "NONE";
  registryCandidates: unknown;
  policy: unknown;
}): QueryPlan {
  const rawQuestion = parseOrThrow(
    boundedText(1_000),
    input.rawQuestion,
    "Raw question",
  );
  const analysis = parseOrThrow(
    queryAnalysisSchema,
    input.analysis,
    "Query analysis",
  );
  const scope = parseOrThrow(
    queryScopeSchema,
    input.trustedScope,
    "Trusted query scope",
  );
  const candidates = uniqueCandidates(
    parseOrThrow(
      z.array(entityCandidateSchema).max(10),
      input.registryCandidates,
      "Registry candidates",
    ),
  );
  const policy = parseOrThrow(
    queryTrustPolicySchema,
    input.policy,
    "Query trust policy",
  );

  let disposition: z.output<typeof queryDispositionSchema>;
  const reasons: z.output<typeof queryDispositionReasonSchema>[] = [];
  const top = candidates[0];
  const second = candidates[1];

  if (analysis.intent === "UNKNOWN") {
    disposition = "CLARIFY";
    reasons.push("UNKNOWN_INTENT");
  } else if (
    analysis.interpretationConfidence <
    policy.minimumInterpretationConfidence
  ) {
    disposition = "CLARIFY";
    reasons.push("LOW_INTERPRETATION_CONFIDENCE");
  } else if (analysis.ambiguitySignals.length > 0) {
    disposition = "CLARIFY";
    reasons.push("ANALYZER_AMBIGUITY");
  } else if (input.entityRequirement === "NONE") {
    disposition = "RETRIEVE";
    reasons.push("ENTITY_NOT_REQUIRED");
  } else if (!top) {
    if (input.entityRequirement === "OPTIONAL") {
      disposition = "RETRIEVE";
      reasons.push("ENTITY_NOT_REQUIRED");
    } else {
      disposition = "KNOWLEDGE_GAP";
      reasons.push("NO_REGISTRY_CANDIDATE");
    }
  } else if (top.lifecycle === "DEPRECATED") {
    disposition = "CLARIFY";
    reasons.push("DEPRECATED_ENTITY");
  } else if (top.confidence < policy.clarificationMinimum) {
    disposition = "KNOWLEDGE_GAP";
    reasons.push("LOW_ENTITY_CONFIDENCE");
  } else if (
    second &&
    top.confidence - second.confidence < policy.minimumCandidateSeparation
  ) {
    disposition = "CLARIFY";
    reasons.push("CANDIDATES_TOO_CLOSE");
  } else if (top.confidence < policy.autoRetrieveMinimum) {
    disposition = "CLARIFY";
    reasons.push("MEDIUM_ENTITY_CONFIDENCE");
  } else {
    disposition = "RETRIEVE";
    reasons.push("CONFIDENT_ENTITY");
  }

  return parseOrThrow(
    queryPlanSchema,
    {
      version: 1,
      rawQuestion,
      analysis,
      scope,
      entityRequirement: input.entityRequirement,
      policy,
      candidates,
      disposition,
      dispositionReasons: reasons,
      authorizationState: "REQUIRED_AT_RETRIEVAL",
      authority: "READ_ONLY_NON_AUTHORITATIVE",
    },
    "Compiled query plan",
  );
}
