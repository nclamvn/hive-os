import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";

import { z } from "zod";

import type { ResidualSurveyEvidence } from "./math-certificates";

const runFile = promisify(execFile);
const digest = (value: string) => createHash("sha256").update(value, "utf8").digest("hex");
// Reviewed tool bodies are part of this local gate. Any drift stops dispatch.
const INTERVAL_SCRIPT_SHA256 = "4c4cfe9839888720d0a52ce60feb5f6efd69a51fc1bbc72c9d563dad0731fbfe";
export const EXCLUSION_SCRIPT_SHA256 = "b5cd78ce93d8100621e164c0f05c2c1df64976bcd069d00b34dc670ca8c425d1";
const hex = z.string().regex(/^[a-f0-9]{64}$/);
const integer = z.number().int().nonnegative();

const intervalOutputSchema = z.object({
  scope: z.object({ lowerExclusive: integer, upperInclusive: integer, maxA: integer }).passthrough(),
  primeCount: integer, failureCount: integer, failurePrimes: z.array(integer).max(24_000),
  firstFailureRescueA: integer.nullable(), manifestSha256: hex, productManifestSha256V3: hex,
}).passthrough();
const exclusionOutputSchema = z.object({
  n: integer, primeByTrial: z.literal(true), residue840: z.literal(1), maxA: integer,
  rows: z.array(z.object({
    A: integer, x: integer, factorB: z.record(z.string(), integer),
    divisorsChecked: integer, admissiblePairCount: integer,
  }).passthrough()).max(27), firstSuccessfulA: integer.nullable(),
}).passthrough();

export const independentReplayReportSchema = z.object({
  method: z.literal("PYTHON_STDLIB_INDEPENDENT_REPLAY_V1"),
  status: z.enum(["PASS", "FAIL"]),
  computedManifestDigest: hex,
  intervalScriptDigest: hex,
  exclusionScriptDigest: hex.nullable(),
  intervalOutputDigest: hex,
  independentManifestDigest: hex,
  exclusionOutputDigest: hex.nullable(),
  primeCount: integer,
  failureCount: integer,
  firstFailureN: integer.nullable(),
  firstFailureRescueA: integer.nullable(),
  auditedRows: z.array(z.object({ a: integer, x: integer, factorPairsChecked: integer,
    admissiblePairs: integer }).strict()).max(27),
  mismatches: z.array(z.string().min(1).max(160)).max(32),
  reportDigest: hex,
}).strict();

export type IndependentReplayReport = z.infer<typeof independentReplayReportSchema>;
type IntervalOutput = z.infer<typeof intervalOutputSchema>;
export type ExclusionOutput = z.infer<typeof exclusionOutputSchema>;

/** Pure comparison: both programs must agree on the full interval counts and the first failure audit. */
export function compareIndependentReplay(input: {
  evidence: ResidualSurveyEvidence;
  interval: IntervalOutput;
  exclusion: ExclusionOutput | null;
  intervalScriptDigest: string;
  exclusionScriptDigest: string | null;
  intervalOutputDigest: string;
  exclusionOutputDigest: string | null;
}): IndependentReplayReport {
  const { evidence, interval, exclusion } = input;
  const mismatches: string[] = [];
  if (interval.scope.lowerExclusive !== evidence.plan.lowerExclusive ||
    interval.scope.upperInclusive !== evidence.plan.upperInclusive || interval.scope.maxA !== evidence.plan.maxA) {
    mismatches.push("Interval scope differs from the sealed computation plan");
  }
  if (interval.primeCount !== evidence.primeCount || interval.failureCount !== evidence.failureCount ||
    interval.failurePrimes.length !== interval.failureCount) mismatches.push("Interval prime or failure count differs");
  if (interval.productManifestSha256V3 !== evidence.manifestDigest) {
    mismatches.push("Full per-prime result manifest differs");
  }
  const firstFailureN = interval.failurePrimes[0] ?? null;
  if (firstFailureN !== (evidence.firstFailure?.n ?? null)) mismatches.push("First failure prime differs");
  if (interval.firstFailureRescueA !== (evidence.firstFailureRescue?.firstA ?? null)) {
    mismatches.push("First failure rescue A differs");
  }
  const auditedRows = exclusion?.rows.map((row) => ({ a: row.A, x: row.x,
    factorPairsChecked: row.divisorsChecked, admissiblePairs: row.admissiblePairCount })) ?? [];
  if (evidence.firstFailure) {
    if (!exclusion || !evidence.firstFailureAudit || exclusion.n !== evidence.firstFailure.n ||
      exclusion.maxA !== evidence.plan.maxA || exclusion.firstSuccessfulA !== null ||
      exclusion.rows.length !== evidence.firstFailureAudit.rows.length) {
      mismatches.push("First failure exclusion audit is absent or out of scope");
    } else {
      for (const [index, row] of evidence.firstFailureAudit.rows.entries()) {
        const independent = exclusion.rows[index];
        if (!independent || independent.A !== row.a || independent.x !== row.x ||
          independent.divisorsChecked !== row.factorPairsChecked ||
          independent.admissiblePairCount !== row.admissiblePairs ||
          Number(independent.factorB[String(evidence.firstFailure.n)] ?? 0) !== 1 ||
          row.xFactors.some(({ prime, exponent }) => independent.factorB[String(prime)] !== exponent) ||
          Object.keys(independent.factorB).length !== row.xFactors.length + 1) {
          mismatches.push(`Exclusion audit differs at A=${row.a}`);
        }
      }
    }
  } else if (exclusion || evidence.firstFailureAudit) {
    mismatches.push("Unexpected exclusion audit without a failure");
  }
  const body = {
    method: "PYTHON_STDLIB_INDEPENDENT_REPLAY_V1" as const,
    status: mismatches.length ? "FAIL" as const : "PASS" as const,
    computedManifestDigest: evidence.manifestDigest,
    intervalScriptDigest: input.intervalScriptDigest,
    exclusionScriptDigest: input.exclusionScriptDigest,
    intervalOutputDigest: input.intervalOutputDigest,
    independentManifestDigest: interval.productManifestSha256V3,
    exclusionOutputDigest: input.exclusionOutputDigest,
    primeCount: interval.primeCount,
    failureCount: interval.failureCount,
    firstFailureN,
    firstFailureRescueA: interval.firstFailureRescueA,
    auditedRows,
    mismatches,
  };
  return independentReplayReportSchema.parse({ ...body, reportDigest: digest(JSON.stringify(body)) });
}

export function validateIndependentReplayRecord(evidence: ResidualSurveyEvidence, report: IndependentReplayReport): boolean {
  const parsed = independentReplayReportSchema.safeParse(report);
  if (!parsed.success) return false;
  const { reportDigest, ...body } = parsed.data;
  return digest(JSON.stringify(body)) === reportDigest && report.computedManifestDigest === evidence.manifestDigest &&
    report.intervalScriptDigest === INTERVAL_SCRIPT_SHA256 &&
    report.exclusionScriptDigest === (evidence.firstFailure ? EXCLUSION_SCRIPT_SHA256 : null) &&
    (report.status === "PASS") === (report.mismatches.length === 0);
}

export function validateIndependentReplayReport(evidence: ResidualSurveyEvidence, report: IndependentReplayReport): boolean {
  return validateIndependentReplayRecord(evidence, report) &&
    report.status === "PASS" && report.mismatches.length === 0 &&
    report.primeCount === evidence.primeCount && report.failureCount === evidence.failureCount &&
    report.independentManifestDigest === evidence.manifestDigest &&
    report.firstFailureN === (evidence.firstFailure?.n ?? null) &&
    report.firstFailureRescueA === (evidence.firstFailureRescue?.firstA ?? null) &&
    JSON.stringify(report.auditedRows) === JSON.stringify(evidence.firstFailureAudit?.rows.map((row) => ({
      a: row.a, x: row.x, factorPairsChecked: row.factorPairsChecked, admissiblePairs: row.admissiblePairs,
    })) ?? []);
}

async function executePython(script: string, args: string[], expectedDigest: string) {
  const source = await readFile(script, "utf8");
  const scriptDigest = digest(source);
  if (scriptDigest !== expectedDigest) throw new Error("Independent replay tool changed without review");
  const { stdout } = await runFile("python3", ["-I", "-S", "-B", script, ...args], {
    timeout: 120_000, maxBuffer: 1_000_000,
    env: { NODE_ENV: process.env.NODE_ENV, PATH: process.env.PATH ?? "/usr/bin:/bin", PYTHONDONTWRITEBYTECODE: "1" },
  });
  return { scriptDigest, outputDigest: digest(stdout), parsed: JSON.parse(stdout) as unknown };
}

/** Fixed single-prime replay for a model-nominated structural counterexample. */
export async function runIndependentExclusionAudit(n: number, maxA: number) {
  const script = join(process.cwd(), "scripts", "operations", "verify-residual-counterexample.py");
  const result = await executePython(script, [String(n), `--max-a=${maxA}`], EXCLUSION_SCRIPT_SHA256);
  return { scriptDigest: result.scriptDigest, outputDigest: result.outputDigest,
    output: exclusionOutputSchema.parse(result.parsed) };
}

/** Fixed, read-only local tools; neither script path nor code is supplied by a model. */
export async function runIndependentResidualReplay(evidence: ResidualSurveyEvidence): Promise<IndependentReplayReport> {
  const scripts = join(process.cwd(), "scripts", "operations");
  const interval = await executePython(join(scripts, "verify-residual-interval-independent.py"), [
    `--lower-exclusive=${evidence.plan.lowerExclusive}`,
    `--upper-inclusive=${evidence.plan.upperInclusive}`,
    `--max-a=${evidence.plan.maxA}`,
  ], INTERVAL_SCRIPT_SHA256);
  const exclusion = evidence.firstFailure ? await executePython(
    join(scripts, "verify-residual-counterexample.py"), [String(evidence.firstFailure.n), `--max-a=${evidence.plan.maxA}`],
    EXCLUSION_SCRIPT_SHA256,
  ) : null;
  return compareIndependentReplay({
    evidence, interval: intervalOutputSchema.parse(interval.parsed),
    exclusion: exclusion ? exclusionOutputSchema.parse(exclusion.parsed) : null,
    intervalScriptDigest: interval.scriptDigest, exclusionScriptDigest: exclusion?.scriptDigest ?? null,
    intervalOutputDigest: interval.outputDigest, exclusionOutputDigest: exclusion?.outputDigest ?? null,
  });
}
