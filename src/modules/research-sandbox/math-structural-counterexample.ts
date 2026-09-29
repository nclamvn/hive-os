import { z } from "zod";

import { canonicalJson } from "@/modules/execution-fabric/contracts";

import { auditResidualFailure, MAX_RESIDUAL_SURVEY_N } from "./math-certificates";
import { sha256 } from "./integrity";
import { EXCLUSION_SCRIPT_SHA256, runIndependentExclusionAudit,
  type ExclusionOutput } from "./math-independent-replay";

const hex = z.string().regex(/^[a-f0-9]{64}$/);
const count = z.number().int().nonnegative();

export const structuralCounterexampleCandidateSchema = z.object({
  prime: z.number().int().min(841).max(MAX_RESIDUAL_SURVEY_N),
  failedThroughA: z.number().int().min(3).max(107).refine((a) => a % 4 === 3),
}).strict();
export type StructuralCounterexampleCandidate = z.infer<typeof structuralCounterexampleCandidateSchema>;

const rowSchema = z.object({ a: count, x: count, factorPairsChecked: count,
  admissiblePairs: count }).strict();
export const structuralCounterexampleReportSchema = z.object({
  method: z.literal("ERDOS_STRAUS_STRUCTURAL_EXCLUSION_V1"),
  status: z.enum(["PASS", "FAIL"]),
  candidate: structuralCounterexampleCandidateSchema,
  tsAuditDigest: hex.nullable(),
  pythonScriptDigest: hex.nullable(),
  pythonOutputDigest: hex.nullable(),
  rows: z.array(rowSchema).max(27),
  a3Square: z.boolean().nullable(),
  a3NoPrime2Mod3: z.boolean().nullable(),
  a7NoDivisor5Mod7: z.boolean().nullable(),
  mismatches: z.array(z.string().min(1).max(160)).max(16),
  reportDigest: hex,
}).strict();
export type StructuralCounterexampleReport = z.infer<typeof structuralCounterexampleReportSchema>;

function noDivisorFiveModSeven(factors: Array<{ prime: number; exponent: number }>): boolean {
  let residues = new Set([1]);
  for (const { prime, exponent } of factors) {
    const next = new Set<number>();
    let power = 1;
    for (let i = 0; i <= exponent; i += 1) {
      for (const residue of residues) next.add((residue * power) % 7);
      power = (power * prime) % 7;
    }
    residues = next;
  }
  return !residues.has(5);
}

function facts(rows: ReturnType<typeof auditResidualFailure>["rows"]) {
  const first = rows.find((row) => row.a === 3);
  const second = rows.find((row) => row.a === 7);
  return {
    a3Square: first ? Number.isInteger(Math.sqrt(first.x)) : null,
    a3NoPrime2Mod3: first ? first.xFactors.every(({ prime }) => prime % 3 !== 2) : null,
    a7NoDivisor5Mod7: second ? noDivisorFiveModSeven(second.xFactors) : null,
  };
}

function seal(body: Omit<StructuralCounterexampleReport, "reportDigest">): StructuralCounterexampleReport {
  return structuralCounterexampleReportSchema.parse({ ...body, reportDigest: sha256(canonicalJson(body)) });
}

function comparePython(candidate: StructuralCounterexampleCandidate,
  audit: ReturnType<typeof auditResidualFailure>, output: ExclusionOutput): string[] {
  const mismatches: string[] = [];
  if (output.n !== candidate.prime || output.maxA !== candidate.failedThroughA ||
    output.firstSuccessfulA !== null || output.rows.length !== audit.rows.length) {
    mismatches.push("Python replay scope or first successful A differs");
  }
  for (const [index, expected] of audit.rows.entries()) {
    const actual = output.rows[index];
    const factors = Object.fromEntries([[String(candidate.prime), 1],
      ...expected.xFactors.map(({ prime, exponent }) => [String(prime), exponent] as const)]);
    if (!actual || actual.A !== expected.a || actual.x !== expected.x ||
      actual.divisorsChecked !== expected.factorPairsChecked || actual.admissiblePairCount !== 0 ||
      canonicalJson(actual.factorB) !== canonicalJson(factors)) {
      mismatches.push(`Independent factor-pair replay differs at A=${expected.a}`);
    }
  }
  return mismatches;
}

/** A PASS certifies a bounded prime and every fixed first-denominator gate through A. */
export async function runStructuralCounterexampleReplay(raw: StructuralCounterexampleCandidate): Promise<StructuralCounterexampleReport> {
  const candidate = structuralCounterexampleCandidateSchema.parse(raw);
  let audit: ReturnType<typeof auditResidualFailure>;
  try { audit = auditResidualFailure(candidate.prime, candidate.failedThroughA); }
  catch {
    return seal({ method: "ERDOS_STRAUS_STRUCTURAL_EXCLUSION_V1", status: "FAIL", candidate,
      tsAuditDigest: null, pythonScriptDigest: null, pythonOutputDigest: null, rows: [],
      a3Square: null, a3NoPrime2Mod3: null, a7NoDivisor5Mod7: null,
      mismatches: ["Candidate is not a residual prime or a declared A gate admits a witness"] });
  }
  const independent = await runIndependentExclusionAudit(candidate.prime, candidate.failedThroughA);
  const mismatches = comparePython(candidate, audit, independent.output);
  return seal({ method: "ERDOS_STRAUS_STRUCTURAL_EXCLUSION_V1",
    status: mismatches.length ? "FAIL" : "PASS", candidate,
    tsAuditDigest: audit.auditDigest, pythonScriptDigest: independent.scriptDigest,
    pythonOutputDigest: independent.outputDigest,
    rows: audit.rows.map((row) => ({ a: row.a, x: row.x,
      factorPairsChecked: row.factorPairsChecked, admissiblePairs: row.admissiblePairs })),
    ...facts(audit.rows), mismatches });
}

/** Synchronous read gate: recompute the exact product audit; old ledgers need no new event. */
export function validateStructuralCounterexampleReport(candidate: StructuralCounterexampleCandidate,
  raw: StructuralCounterexampleReport): boolean {
  const parsed = structuralCounterexampleReportSchema.safeParse(raw);
  if (!parsed.success) return false;
  const report = parsed.data;
  const { reportDigest, ...body } = report;
  if (sha256(canonicalJson(body)) !== reportDigest ||
    canonicalJson(report.candidate) !== canonicalJson(candidate)) return false;
  if (report.status !== "PASS") return report.mismatches.length > 0;
  if (report.mismatches.length || report.pythonScriptDigest !== EXCLUSION_SCRIPT_SHA256 ||
    !report.pythonOutputDigest || !report.tsAuditDigest) return false;
  try {
    const audit = auditResidualFailure(candidate.prime, candidate.failedThroughA);
    return report.tsAuditDigest === audit.auditDigest &&
      canonicalJson(report.rows) === canonicalJson(audit.rows.map((row) => ({ a: row.a, x: row.x,
        factorPairsChecked: row.factorPairsChecked, admissiblePairs: row.admissiblePairs }))) &&
      canonicalJson({ a3Square: report.a3Square, a3NoPrime2Mod3: report.a3NoPrime2Mod3,
        a7NoDivisor5Mod7: report.a7NoDivisor5Mod7 }) === canonicalJson(facts(audit.rows));
  } catch { return false; }
}
