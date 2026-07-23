import { createHash } from "node:crypto";

import { z } from "zod";

import { ExecutionError, ExecutionErrorCode } from "./errors";

const CODE = /^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)*$/;
const METRIC = /^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/;
const UNIT = /^[a-zA-Z][a-zA-Z0-9_/%.-]*$/;

const count = z.number().int().nonnegative();
const healthCounts = z
  .object({
    passed: count,
    failed: count,
    skipped: count,
  })
  .strict();

const requirementCoverageSchema = z
  .object({
    implemented: count,
    total: count,
    missing: z.array(z.string().trim().min(1).max(200)).max(500),
    deferred: z.array(z.string().trim().min(1).max(200)).max(500),
  })
  .strict()
  .refine((value) => value.implemented <= value.total, {
    message: "implemented cannot exceed total",
  });

const scenarioResultSchema = z
  .object({
    scenarioId: z.string().trim().min(1).max(120),
    result: z.enum(["PASS", "FAIL"]),
    severity: z.enum(["P0", "P1", "P2", "P3"]).nullable(),
    evidenceArtifactIds: z.array(z.string().uuid()).max(100),
  })
  .strict();

export const technicalHealthSchema = z
  .object({
    build: z.enum(["PASS", "FAIL", "NOT_RUN"]),
    typecheck: z.object({ errors: count, warnings: count }).strict(),
    lint: z.object({ errors: count, warnings: count }).strict(),
    unit: healthCounts,
    integration: healthCounts,
    e2e: healthCounts,
    accessibilityViolations: count,
    vulnerabilities: z
      .object({
        critical: count,
        high: count,
        moderate: count,
        low: count,
      })
      .strict(),
  })
  .strict();

const deviationSchema = z
  .object({
    code: z.string().trim().min(1).max(80).regex(CODE),
    title: z.string().trim().min(1).max(200),
    description: z.string().trim().min(1).max(4_000),
    materiality: z.enum(["MATERIAL", "ADVISORY"]),
    proposedResolution: z.string().trim().min(1).max(4_000),
  })
  .strict();

const resourceUsageSchema = z
  .object({
    metric: z.string().trim().min(1).max(80).regex(METRIC),
    quantity: count.max(2_147_483_647),
    unit: z.string().trim().min(1).max(32).regex(UNIT),
  })
  .strict();

export const completionReportSchema = z
  .object({
    result: z.enum(["DONE", "PARTIAL", "BLOCKED"]),
    summary: z.string().trim().min(1).max(8_000),
    requirementCoverage: requirementCoverageSchema,
    scenarioResults: z.array(scenarioResultSchema).max(2_000),
    technicalHealth: technicalHealthSchema,
    overallStatus: z.enum(["READY", "READY_WITH_DEFERRED", "NOT_READY"]),
    deviations: z.array(deviationSchema).max(500),
    resourceUsage: z.array(resourceUsageSchema).max(500),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.result === "DONE" && value.overallStatus === "NOT_READY") {
      ctx.addIssue({
        code: "custom",
        path: ["overallStatus"],
        message: "DONE cannot declare NOT_READY",
      });
    }
    if (value.result === "BLOCKED" && value.overallStatus !== "NOT_READY") {
      ctx.addIssue({
        code: "custom",
        path: ["overallStatus"],
        message: "BLOCKED must declare NOT_READY",
      });
    }
    const deviationKeys = value.deviations.map((item) => item.code);
    if (new Set(deviationKeys).size !== deviationKeys.length) {
      ctx.addIssue({
        code: "custom",
        path: ["deviations"],
        message: "deviation codes must be unique",
      });
    }
    const usageKeys = value.resourceUsage.map(
      (item) => `${item.metric}\u0000${item.unit}`,
    );
    if (new Set(usageKeys).size !== usageKeys.length) {
      ctx.addIssue({
        code: "custom",
        path: ["resourceUsage"],
        message: "resource metric/unit pairs must be unique",
      });
    }
  });

export type CompletionReportInput = z.input<typeof completionReportSchema>;
export type ValidatedCompletionReport = z.output<typeof completionReportSchema>;

export interface CreateExecutionTipInput {
  code: string;
  title: string;
  description: string;
  skillVersionId: string;
  predecessorTipIds?: string[];
}

export interface ManualRunInput {
  executionRole: "CONTRACTOR" | "BUILDER" | "VERIFIER";
  providerName: string;
  modelName: string;
  instruction: string;
}

const tipSchema = z
  .object({
    code: z.string().trim().min(1).max(80).regex(CODE),
    title: z.string().trim().min(1).max(200),
    description: z.string().trim().min(1).max(4_000),
    skillVersionId: z.string().uuid(),
    predecessorTipIds: z.array(z.string().uuid()).max(100).default([]),
  })
  .strict();

const manualRunSchema = z
  .object({
    executionRole: z.enum(["CONTRACTOR", "BUILDER", "VERIFIER"]),
    providerName: z.string().trim().min(1).max(120),
    modelName: z.string().trim().min(1).max(160),
    instruction: z.string().trim().min(1).max(1_000_000),
  })
  .strict();

function invalid(code: string, message: string): never {
  throw new ExecutionError(code, message);
}

export function validateExecutionTip(
  input: CreateExecutionTipInput,
): Required<CreateExecutionTipInput> {
  const parsed = tipSchema.safeParse(input);
  if (!parsed.success) {
    invalid(ExecutionErrorCode.InvalidInput, "Execution TIP is invalid");
  }
  if (
    new Set(parsed.data.predecessorTipIds).size !==
    parsed.data.predecessorTipIds.length
  ) {
    invalid(
      ExecutionErrorCode.InvalidInput,
      "Predecessor TIP IDs must be unique",
    );
  }
  return parsed.data;
}

export function validateManualRun(input: ManualRunInput): ManualRunInput {
  const parsed = manualRunSchema.safeParse(input);
  if (!parsed.success) {
    invalid(ExecutionErrorCode.InvalidInput, "Manual run input is invalid");
  }
  assertNoCredentialMaterial(parsed.data.instruction);
  return parsed.data;
}

export function validateCompletionReport(
  input: unknown,
): ValidatedCompletionReport {
  const parsed = completionReportSchema.safeParse(input);
  if (!parsed.success) {
    invalid(
      ExecutionErrorCode.InvalidReport,
      `Completion Report is invalid: ${parsed.error.issues
        .map((issue) => issue.path.join(".") || "(root)")
        .join(", ")}`,
    );
  }
  return parsed.data;
}

export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalJson(item)).join(",")}]`;
  }
  return `{${Object.keys(value as Record<string, unknown>)
    .sort()
    .map(
      (key) =>
        `${JSON.stringify(key)}:${canonicalJson(
          (value as Record<string, unknown>)[key],
        )}`,
    )
    .join(",")}}`;
}

export function sha256(content: string): string {
  return createHash("sha256").update(content, "utf8").digest("hex");
}

export function assertNoCredentialMaterial(content: string): void {
  const credentialPatterns = [
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i,
    /\bauthorization\s*:\s*bearer\s+\S+/i,
    /\b(?:api[_-]?key|password|database_url)\s*[:=]\s*["']?\S{8,}/i,
  ];
  if (credentialPatterns.some((pattern) => pattern.test(content))) {
    invalid(
      ExecutionErrorCode.InvalidInput,
      "Execution artifacts must not contain credential material",
    );
  }
}
