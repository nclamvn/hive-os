import { z } from "zod";

import { technicalHealthSchema } from "@/modules/execution-fabric/contracts";

import {
  VerificationGovernanceError,
  VerificationGovernanceErrorCode,
} from "./errors";

const CODE = /^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)*$/;
const artifactIds = z.array(z.string().uuid()).min(1).max(100);

const coverageSchema = z
  .object({
    requirementId: z.string().uuid(),
    result: z.enum(["PASS", "FAIL", "DEFERRED"]),
    method: z.string().trim().min(1).max(2_000),
    evidenceArtifactIds: artifactIds,
  })
  .strict();

const scenarioResultSchema = z
  .object({
    scenarioId: z.string().uuid(),
    result: z.enum(["PASS", "FAIL", "DEFERRED"]),
    severity: z.enum(["P0", "P1", "P2", "P3"]).nullable(),
    detail: z.string().trim().min(1).max(4_000),
    evidenceArtifactIds: artifactIds,
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.result !== "PASS" && value.severity === null) {
      ctx.addIssue({
        code: "custom",
        path: ["severity"],
        message: "FAIL and DEFERRED require explicit severity",
      });
    }
  });

const corruptionSchema = z
  .object({
    code: z.string().trim().min(1).max(80).regex(CODE),
    title: z.string().trim().min(1).max(200),
    method: z.string().trim().min(1).max(2_000),
    result: z.enum(["PASS", "FAIL", "INCONCLUSIVE"]),
    severity: z.enum(["P0", "P1", "P2", "P3"]),
    detail: z.string().trim().min(1).max(4_000),
    evidenceArtifactIds: artifactIds,
  })
  .strict();

const completeReportSchema = z
  .object({
    requirementCoverage: z.array(coverageSchema).min(1).max(1_000),
    scenarioResults: z.array(scenarioResultSchema).min(1).max(2_000),
    technicalHealth: technicalHealthSchema,
    corruptionTests: z.array(corruptionSchema).max(500),
    overallStatus: z.enum(["READY", "READY_WITH_DEFERRED", "NOT_READY"]),
    deferredItems: z.array(z.string().trim().min(1).max(500)).max(500),
  })
  .strict();

const scenarioSchema = z
  .object({
    code: z.string().trim().min(1).max(80).regex(CODE),
    title: z.string().trim().min(1).max(200),
    kind: z.enum([
      "REQUIREMENT",
      "FUNCTIONAL",
      "SECURITY",
      "ACCESSIBILITY",
      "PERFORMANCE",
      "OTHER",
    ]),
    method: z.string().trim().min(1).max(2_000),
    expectedOutcome: z.string().trim().min(1).max(2_000),
    required: z.boolean().default(true),
    requirementId: z.string().uuid().optional(),
  })
  .strict();

const releaseSchema = z
  .object({
    verificationReportId: z.string().uuid(),
    visibility: z.enum(["INTERNAL", "PUBLIC"]),
    claimVersionIds: z.array(z.string().uuid()).max(1_000),
    methods: z.array(z.string().trim().min(1).max(1_000)).min(1).max(200),
    limitations: z
      .array(z.string().trim().min(1).max(2_000))
      .min(1)
      .max(200),
  })
  .strict();

export type CompleteVerificationInput = z.input<typeof completeReportSchema>;
export type ValidatedVerificationInput = z.output<typeof completeReportSchema>;
export type CreateVerificationScenarioInput = z.input<typeof scenarioSchema>;
export type AuthorizeReleaseInput = z.input<typeof releaseSchema>;

function invalid(code: string, message: string): never {
  throw new VerificationGovernanceError(code, message);
}

function ensureUnique(values: string[], label: string): void {
  if (new Set(values).size !== values.length) {
    invalid(
      VerificationGovernanceErrorCode.InvalidReport,
      `${label} must not contain duplicates`,
    );
  }
}

export function validateScenario(input: CreateVerificationScenarioInput) {
  const result = scenarioSchema.safeParse(input);
  if (!result.success) {
    invalid(
      VerificationGovernanceErrorCode.InvalidInput,
      "Verification scenario is invalid",
    );
  }
  return result.data;
}

export function validateVerificationReport(
  input: CompleteVerificationInput,
): ValidatedVerificationInput {
  const result = completeReportSchema.safeParse(input);
  if (!result.success) {
    invalid(
      VerificationGovernanceErrorCode.InvalidReport,
      `Verify Report is invalid: ${result.error.issues
        .map((issue) => issue.path.join(".") || "(root)")
        .join(", ")}`,
    );
  }
  ensureUnique(
    result.data.requirementCoverage.map((item) => item.requirementId),
    "requirementCoverage",
  );
  ensureUnique(
    result.data.scenarioResults.map((item) => item.scenarioId),
    "scenarioResults",
  );
  ensureUnique(
    result.data.corruptionTests.map((item) => item.code),
    "corruptionTests",
  );
  ensureUnique(result.data.deferredItems, "deferredItems");
  return result.data;
}

export function validateReleaseInput(input: AuthorizeReleaseInput) {
  const result = releaseSchema.safeParse(input);
  if (!result.success) {
    invalid(
      VerificationGovernanceErrorCode.InvalidInput,
      "Release authorization input is invalid",
    );
  }
  ensureUnique(result.data.claimVersionIds, "claimVersionIds");
  ensureUnique(result.data.methods, "methods");
  ensureUnique(result.data.limitations, "limitations");
  return result.data;
}

export function computeVerificationStatus(
  input: ValidatedVerificationInput,
  requirements: Array<{ id: string; required: boolean }>,
  scenarios: Array<{ id: string; required: boolean }>,
  corruptionRequired: boolean,
): "READY" | "READY_WITH_DEFERRED" | "NOT_READY" {
  const coverage = new Map(
    input.requirementCoverage.map((item) => [item.requirementId, item]),
  );
  const results = new Map(
    input.scenarioResults.map((item) => [item.scenarioId, item]),
  );
  if (
    requirements.some((item) => !coverage.has(item.id)) ||
    [...coverage.keys()].some(
      (id) => !requirements.some((item) => item.id === id),
    ) ||
    scenarios
      .filter((item) => item.required)
      .some((item) => !results.has(item.id)) ||
    [...results.keys()].some(
      (id) => !scenarios.some((item) => item.id === id),
    )
  ) {
    invalid(
      VerificationGovernanceErrorCode.InvalidReport,
      "Coverage must exactly match requirements and required scenarios",
    );
  }

  const health = input.technicalHealth;
  const healthFailed =
    health.build !== "PASS" ||
    health.typecheck.errors > 0 ||
    health.lint.errors > 0 ||
    health.unit.failed > 0 ||
    health.integration.failed > 0 ||
    health.e2e.failed > 0 ||
    health.accessibilityViolations > 0 ||
    health.vulnerabilities.critical > 0 ||
    health.vulnerabilities.high > 0;
  const requiredFailed =
    requirements.some(
      (requirement) =>
        requirement.required &&
        coverage.get(requirement.id)?.result !== "PASS",
    ) ||
    scenarios.some(
      (scenario) =>
        scenario.required && results.get(scenario.id)?.result !== "PASS",
    );
  const corruptionFailed =
    corruptionRequired &&
    (input.corruptionTests.length === 0 ||
      input.corruptionTests.some((test) => test.result !== "PASS"));
  if (healthFailed || requiredFailed || corruptionFailed) return "NOT_READY";

  const hasDeferred =
    input.deferredItems.length > 0 ||
    input.requirementCoverage.some((item) => item.result === "DEFERRED") ||
    input.scenarioResults.some((item) => item.result === "DEFERRED") ||
    input.corruptionTests.some((item) => item.result === "INCONCLUSIVE") ||
    health.vulnerabilities.moderate > 0 ||
    health.vulnerabilities.low > 0;
  return hasDeferred ? "READY_WITH_DEFERRED" : "READY";
}
