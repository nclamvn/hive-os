import { z } from "zod";

import { canonicalJson } from "@/modules/execution-fabric/contracts";

import { auditResidualFailure, isPrimeInSurvey, searchResidualPrime } from "./math-certificates";
import { sha256 } from "./integrity";
import { runStructuralCounterexampleReplay, structuralCounterexampleReportSchema,
  validateStructuralCounterexampleReport } from "./math-structural-counterexample";

const gate = z.number().int().min(3).max(47).refine((value) => value % 4 === 3);
const divisorCondition = z.object({ gateA: gate, modulus: z.number().int().min(2).max(47),
  residue: z.number().int().nonnegative().max(46) }).strict();
const nonmultipleCondition = z.object({ gateA: gate, modulus: z.number().int().min(2).max(47) }).strict();

/** The typed statement, not free-form model prose, defines the exact finite falsification target. */
export const structuralProbePlanSchema = z.object({
  kind: z.enum(["GATE_MUST_OPEN", "FAILED_GATE_FORCES_PRIME_RESIDUE"]),
  targetA: gate,
  failedThroughA: gate,
  upperInclusive: z.number().int().min(2_521).max(10_000_000),
  expectedPrimeResidue: z.number().int().nonnegative().max(46).nullable(),
  divisorConditions: z.array(divisorCondition).max(3),
  nonmultipleConditions: z.array(nonmultipleCondition).max(3),
}).strict().superRefine((plan, ctx) => {
  if (plan.failedThroughA !== (plan.kind === "GATE_MUST_OPEN" ? plan.targetA - 4 : plan.targetA) ||
    (plan.kind === "GATE_MUST_OPEN" ? plan.expectedPrimeResidue !== null :
      plan.expectedPrimeResidue === null || plan.expectedPrimeResidue >= plan.targetA) ||
    [...plan.divisorConditions, ...plan.nonmultipleConditions].some((item) => item.gateA > plan.failedThroughA) ||
    plan.divisorConditions.some((item) => item.residue >= item.modulus)) {
    ctx.addIssue({ code: "custom", message: "Probe predicate or gate scope is inconsistent" });
  }
});
export type StructuralProbePlan = z.infer<typeof structuralProbePlanSchema>;

const digest = z.string().regex(/^[a-f0-9]{64}$/);
export const structuralProbeReportSchema = z.object({
  method: z.literal("ERDOS_STRAUS_PROPOSAL_FALSIFICATION_V1"),
  plan: structuralProbePlanSchema,
  status: z.enum(["REFUTED", "NOT_REFUTED_IN_BOUND"]),
  eligiblePrimesTested: z.number().int().nonnegative(),
  candidate: z.object({ prime: z.number().int().positive(), failedThroughA: gate,
    divisorWitnesses: z.array(z.number().int().positive()).max(3) }).strict().nullable(),
  independentReplay: structuralCounterexampleReportSchema.nullable(),
  reportDigest: digest,
}).strict();
export type StructuralProbeReport = z.infer<typeof structuralProbeReportSchema>;

function divisorWitness(x: number, modulus: number, residue: number): number | null {
  for (let d = 1; d * d <= x; d += 1) {
    if (x % d !== 0) continue;
    if (d % modulus === residue) return d;
    const other = x / d;
    if (other % modulus === residue) return other;
  }
  return null;
}

function qualifyingWitnesses(prime: number, plan: StructuralProbePlan): number[] | null {
  if (plan.kind === "FAILED_GATE_FORCES_PRIME_RESIDUE" &&
    prime % plan.targetA === plan.expectedPrimeResidue) return null;
  if (plan.nonmultipleConditions.some(({ gateA, modulus }) => ((prime + gateA) / 4) % modulus === 0)) return null;
  const witnesses: number[] = [];
  for (const { gateA, modulus, residue } of plan.divisorConditions) {
    const witness = divisorWitness((prime + gateA) / 4, modulus, residue);
    if (witness === null) return null;
    witnesses.push(witness);
  }
  return witnesses;
}

/** First counterexample in a capped, exact prime scan. Absence is never a proof. */
export function scanStructuralProbe(raw: StructuralProbePlan) {
  const plan = structuralProbePlanSchema.parse(raw);
  let eligiblePrimesTested = 0;
  for (let prime = 2_521; prime <= plan.upperInclusive; prime += 840) {
    if (!isPrimeInSurvey(prime)) continue;
    eligiblePrimesTested += 1;
    // If an earlier gate opens, the proposed hard-survivor premise is false.
    if (searchResidualPrime(prime, plan.targetA).firstA !== null) continue;
    const divisorWitnesses = qualifyingWitnesses(prime, plan);
    if (divisorWitnesses === null) continue;
    return { eligiblePrimesTested, candidate: { prime, failedThroughA: plan.targetA, divisorWitnesses } };
  }
  return { eligiblePrimesTested, candidate: null };
}

/** The separate, digest-pinned Python factor-pair enumerator checks every failed gate and x factorization. */
export async function runStructuralProbe(raw: StructuralProbePlan): Promise<StructuralProbeReport> {
  const plan = structuralProbePlanSchema.parse(raw);
  const scanned = scanStructuralProbe(plan);
  const independentReplay = scanned.candidate ? await runStructuralCounterexampleReplay({
    prime: scanned.candidate.prime, failedThroughA: plan.targetA }) : null;
  if (scanned.candidate && (!independentReplay || independentReplay.status !== "PASS" ||
    !validateStructuralCounterexampleReport({ prime: scanned.candidate.prime, failedThroughA: plan.targetA }, independentReplay))) {
    throw new Error("Independent structural-probe replay failed");
  }
  const body = { method: "ERDOS_STRAUS_PROPOSAL_FALSIFICATION_V1" as const, plan,
    status: scanned.candidate ? "REFUTED" as const : "NOT_REFUTED_IN_BOUND" as const,
    ...scanned, independentReplay };
  return structuralProbeReportSchema.parse({ ...body, reportDigest: sha256(canonicalJson(body)) });
}

export function validateStructuralProbeReport(plan: StructuralProbePlan, raw: StructuralProbeReport): boolean {
  const parsed = structuralProbeReportSchema.safeParse(raw);
  if (!parsed.success || canonicalJson(parsed.data.plan) !== canonicalJson(plan)) return false;
  const { reportDigest, ...body } = parsed.data;
  if (reportDigest !== sha256(canonicalJson(body))) return false;
  const scanned = scanStructuralProbe(plan);
  if (canonicalJson({ eligiblePrimesTested: scanned.eligiblePrimesTested, candidate: scanned.candidate }) !==
    canonicalJson({ eligiblePrimesTested: raw.eligiblePrimesTested, candidate: raw.candidate })) return false;
  if (!raw.candidate) return raw.status === "NOT_REFUTED_IN_BOUND" && raw.independentReplay === null;
  // Recompute the exact factorization and check the stored divisor witnesses.
  try {
    const audit = auditResidualFailure(raw.candidate.prime, plan.targetA);
    if (plan.divisorConditions.some((item, index) => {
      const witness = raw.candidate!.divisorWitnesses[index];
      const x = audit.rows.find((row) => row.a === item.gateA)?.x;
      return !witness || !x || x % witness !== 0 || witness % item.modulus !== item.residue;
    })) return false;
  } catch { return false; }
  return raw.status === "REFUTED" && Boolean(raw.independentReplay &&
    validateStructuralCounterexampleReport({ prime: raw.candidate.prime, failedThroughA: plan.targetA }, raw.independentReplay) &&
    raw.independentReplay.status === "PASS");
}
