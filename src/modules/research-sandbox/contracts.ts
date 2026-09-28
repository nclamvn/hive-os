import { z } from "zod";

import { mathPilotRequestSchema } from "./math-pilot";

const digest = z.string().regex(/^[a-f0-9]{64}$/);
const identifier = z.string().trim().min(1).max(160);

export const sourcePolicySchema = z
  .object({
    allowedDomains: z.array(z.string().trim().min(1).max(253)).max(50).default([]),
    primaryDomains: z.array(z.string().trim().min(1).max(253)).max(50).default([]),
    requirePrimary: z.boolean().default(false),
    maxSources: z.number().int().min(1).max(50).default(20),
  })
  .strict();

export const queryPlanSchema = z
  .object({
    queries: z.array(z.string().trim().min(1).max(500)).min(1).max(20),
    languages: z.array(z.enum(["vi", "en"])).min(1).max(2).default(["vi", "en"]),
  })
  .strict();

export const requestResearchRunSchema = z
  .object({
    missionId: identifier,
    documentId: identifier.nullable().default(null),
    question: z.string().trim().min(1).max(8_000),
    scope: z.string().trim().min(1).max(8_000),
    providerName: z.string().trim().min(1).max(120),
    modelName: identifier,
    sourcePolicy: sourcePolicySchema,
    queryPlan: queryPlanSchema,
    mathPilot: mathPilotRequestSchema.optional(),
    idempotencyKey: z.string().trim().min(1).max(200),
  })
  .strict();

export const researchProviderSourceSchema = z
  .object({
    key: z.string().trim().min(1).max(80),
    canonicalUri: z.string().url().max(2_000),
    title: z.string().trim().min(1).max(500),
    publisher: z.string().trim().min(1).max(240),
    mediaType: z.string().trim().min(1).max(160),
    content: z.string().min(1).max(1_048_576),
    contentDigest: digest,
    sourceClass: z.enum(["PRIMARY", "SECONDARY", "UNKNOWN"]),
    capturedAt: z.coerce.date(),
  })
  .strict();

export const researchProviderFindingSchema = z
  .object({
    key: z.string().trim().min(1).max(80),
    kind: z.enum(["SUPPORTING", "CONFLICTING", "CONTEXT", "HONEST_NULL"]),
    claim: z.string().trim().min(1).max(8_000),
    sourceKey: z.string().trim().min(1).max(80).nullable(),
    exactExcerpt: z.string().max(20_000),
    startOffset: z.number().int().nonnegative().nullable(),
    endOffset: z.number().int().positive().nullable(),
    confidence: z.number().min(0).max(1),
  })
  .strict();

export const researchProviderUsageSchema = z.object({
  responseId: identifier,
  modelName: identifier,
  inputTokens: z.number().int().nonnegative(),
  cachedInputTokens: z.number().int().nonnegative(),
  outputTokens: z.number().int().nonnegative(),
  reasoningOutputTokens: z.number().int().nonnegative(),
  totalTokens: z.number().int().nonnegative(),
  webSearchCalls: z.number().int().nonnegative(),
}).strict().superRefine((usage, ctx) => {
  if (usage.inputTokens + usage.outputTokens !== usage.totalTokens) {
    ctx.addIssue({ code: "custom", path: ["totalTokens"], message: "Token total does not match input plus output" });
  }
  if (usage.cachedInputTokens > usage.inputTokens) {
    ctx.addIssue({ code: "custom", path: ["cachedInputTokens"], message: "Cached input exceeds input tokens" });
  }
  if (usage.reasoningOutputTokens > usage.outputTokens) {
    ctx.addIssue({ code: "custom", path: ["reasoningOutputTokens"], message: "Reasoning output exceeds output tokens" });
  }
});

export const erdosStrausWitnessSchema = z.object({
  n: z.string().regex(/^[1-9][0-9]{0,39}$/),
  x: z.string().regex(/^[1-9][0-9]{0,39}$/),
  y: z.string().regex(/^[1-9][0-9]{0,39}$/),
  z: z.string().regex(/^[1-9][0-9]{0,39}$/),
}).strict();

export const mathModelAttemptSchema = z.object({
  providerName: z.literal("codex-local"),
  modelName: identifier,
  threadId: identifier,
  attemptType: z.enum(["PROOF_ATTEMPT", "COUNTEREXAMPLE_ATTEMPT", "PARTIAL", "INCONCLUSIVE"]),
  argument: z.string().trim().min(1).max(12_000),
  candidateCounterexample: z.string().trim().max(2_000).nullable(),
  selfChecks: z.array(z.string().trim().min(1).max(1_000)).max(12),
  limitations: z.array(z.string().trim().min(1).max(1_000)).max(12),
  // Optional so immutable pre-certificate attempts remain digest-readable.
  erdosStrausWitnesses: z.array(erdosStrausWitnessSchema).max(4).optional(),
  usage: z.object({
    inputTokens: z.number().int().nonnegative(),
    cachedInputTokens: z.number().int().nonnegative(),
    outputTokens: z.number().int().nonnegative(),
    reasoningOutputTokens: z.number().int().nonnegative(),
  }).strict(),
}).strict();

export const researchProviderResultSchema = z
  .object({
    providerName: z.string().trim().min(1).max(120),
    modelName: identifier,
    usage: researchProviderUsageSchema.optional(),
    mathAttempt: mathModelAttemptSchema.optional(),
    sources: z.array(researchProviderSourceSchema).max(50),
    findings: z.array(researchProviderFindingSchema).min(1).max(500),
  })
  .strict();

export const reviewResearchRunSchema = z
  .object({
    runId: identifier,
    decision: z.enum(["APPROVED", "REJECTED"]),
    rationale: z.string().trim().min(1).max(4_000),
    findings: z
      .array(
        z
          .object({
            findingId: identifier,
            decision: z.enum(["ACCEPTED", "REJECTED", "FLAGGED"]),
            rationale: z.string().trim().min(1).max(4_000),
          })
          .strict(),
      )
      .min(1)
      .max(500),
  })
  .strict();

export const resourceLimitsSchema = z
  .object({
    maxCpuMillis: z.number().int().min(100).max(3_600_000),
    maxWallSeconds: z.number().int().min(1).max(3_600),
    maxMemoryMb: z.number().int().min(64).max(16_384),
    maxOutputBytes: z.number().int().min(1_024).max(100_000_000),
  })
  .strict();

export const requestComputationRunSchema = z
  .object({
    missionId: identifier,
    documentId: identifier.nullable().default(null),
    researchRunId: identifier.nullable().default(null),
    kind: z.enum(["LATEX_BUILD", "CAS", "JUPYTER"]),
    runtimeId: identifier,
    runtimeVersion: identifier,
    entrypoint: z.string().trim().min(1).max(500),
    networkPolicy: z.enum(["DENY_ALL", "ALLOWLIST"]).default("DENY_ALL"),
    networkAllowlist: z.array(z.string().trim().min(1).max(253)).max(20).default([]),
    resourceLimits: resourceLimitsSchema,
    inputReference: z.string().trim().min(1).max(2_000),
    inputDigest: digest,
    idempotencyKey: z.string().trim().min(1).max(200),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.networkPolicy === "DENY_ALL" && value.networkAllowlist.length) {
      ctx.addIssue({ code: "custom", path: ["networkAllowlist"], message: "DENY_ALL cannot include an allowlist" });
    }
    if (value.networkPolicy === "ALLOWLIST" && !value.networkAllowlist.length) {
      ctx.addIssue({ code: "custom", path: ["networkAllowlist"], message: "ALLOWLIST requires at least one domain" });
    }
  });

export const sandboxExecutorResultSchema = z
  .object({
    runtimeId: identifier,
    runtimeVersion: identifier,
    outputReference: z.string().trim().min(1).max(2_000),
    outputDigest: digest,
    outputMediaType: z.string().trim().min(1).max(160),
    outputBody: z.instanceof(Buffer),
    outputBytes: z.number().int().nonnegative(),
    cpuMillis: z.number().int().nonnegative(),
    wallSeconds: z.number().int().nonnegative(),
    peakMemoryMb: z.number().int().nonnegative(),
    observedNetworkHosts: z.array(z.string().trim().min(1).max(253)).max(100),
    isolationAttestation: z
      .object({
        engine: z.literal("docker"),
        imageReference: z.string().trim().min(1).max(500),
        imageDigest: z.string().regex(/^sha256:[a-f0-9]{64}$/),
        networkMode: z.literal("none"),
        readOnlyRootfs: z.literal(true),
        noNewPrivileges: z.literal(true),
        capDropAll: z.literal(true),
        pidsLimit: z.number().int().min(1).max(4_096),
        metricBasis: z.literal("ENFORCED_CEILING"),
      })
      .strict(),
  })
  .strict();

export const reviewComputationRunSchema = z
  .object({
    runId: identifier,
    decision: z.enum(["APPROVED", "REJECTED"]),
    rationale: z.string().trim().min(1).max(4_000),
  })
  .strict();

export type ResearchRequest = z.infer<typeof requestResearchRunSchema>;
export type ResearchProviderResult = z.infer<typeof researchProviderResultSchema>;
export type ComputationRequest = z.infer<typeof requestComputationRunSchema>;
export type SandboxExecutorResult = z.infer<typeof sandboxExecutorResultSchema>;

export interface ResearchProvider {
  readonly providerName: string;
  readonly modelName: string;
  execute(input: Omit<ResearchRequest, "idempotencyKey">): Promise<ResearchProviderResult>;
}

export interface SandboxExecutor {
  readonly runtimeId: string;
  readonly runtimeVersion: string;
  execute(input: Omit<ComputationRequest, "idempotencyKey">): Promise<SandboxExecutorResult>;
}
