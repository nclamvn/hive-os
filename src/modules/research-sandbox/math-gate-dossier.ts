import { z } from "zod";

import { canonicalJson } from "@/modules/execution-fabric/contracts";

import { auditResidualFailure, searchResidualPrime, verifyErdosStrausWitness } from "./math-certificates";
import { sha256 } from "./integrity";
import { EXCLUSION_SCRIPT_SHA256, runIndependentExclusionAudit } from "./math-independent-replay";
import { structuralCounterexampleCandidateSchema } from "./math-structural-counterexample";

const hex = z.string().regex(/^[a-f0-9]{64}$/);
const integer = z.number().int().nonnegative();
const factorSchema = z.object({ prime: integer, exponent: integer.positive() }).strict();
const rowSchema = z.object({ a: integer, x: integer, xFactors: z.array(factorSchema),
  factorPairsChecked: integer, admissiblePairs: integer }).strict();
const witnessSchema = z.object({ n: z.string(), x: z.string(), y: z.string(), z: z.string() }).strict();

/** A complete, finite gate chain ending at the first successful target gate. */
export const structuralGateDossierSchema = z.object({
  method: z.literal("ERDOS_STRAUS_GATE_DOSSIER_V1"),
  candidate: structuralCounterexampleCandidateSchema,
  targetA: z.number().int().min(7).max(47).refine((a) => a % 4 === 3),
  rows: z.array(rowSchema).min(2).max(12),
  firstSuccessA: integer,
  witness: witnessSchema,
  exclusionAuditDigest: hex,
  pythonScriptDigest: hex,
  pythonOutputDigest: hex,
  dossierDigest: hex,
}).strict();
export type StructuralGateDossier = z.infer<typeof structuralGateDossierSchema>;

function expectedRows(prime: number, targetA: number) {
  return auditResidualFailure(prime, targetA - 4).rows.map((row) => ({ a: row.a, x: row.x,
    xFactors: row.xFactors, factorPairsChecked: row.factorPairsChecked,
    admissiblePairs: row.admissiblePairs }));
}

/** Run two separately implemented enumerators; never trust the model's gate narrative. */
export async function runStructuralGateDossier(
  candidate: z.infer<typeof structuralCounterexampleCandidateSchema>, targetA: number,
): Promise<StructuralGateDossier | null> {
  const parsed = structuralCounterexampleCandidateSchema.parse(candidate);
  if (targetA <= parsed.failedThroughA || targetA > 47 || targetA % 4 !== 3) return null;
  const search = searchResidualPrime(parsed.prime, targetA);
  if (search.firstA !== targetA || !search.witness) return null;
  const audit = auditResidualFailure(parsed.prime, targetA - 4);
  const rows = expectedRows(parsed.prime, targetA);
  const independent = await runIndependentExclusionAudit(parsed.prime, targetA);
  const output = independent.output;
  if (output.n !== parsed.prime || output.maxA !== targetA || output.firstSuccessfulA !== targetA ||
    output.rows.length !== rows.length + 1) throw new Error("Independent gate dossier scope differs");
  for (const [index, row] of rows.entries()) {
    const other = output.rows[index];
    const factors = Object.fromEntries([[String(parsed.prime), 1],
      ...row.xFactors.map(({ prime, exponent }) => [String(prime), exponent] as const)]);
    if (!other || other.A !== row.a || other.x !== row.x ||
      other.divisorsChecked !== row.factorPairsChecked || other.admissiblePairCount !== 0 ||
      canonicalJson(other.factorB) !== canonicalJson(factors)) {
      throw new Error(`Independent gate dossier differs at A=${row.a}`);
    }
  }
  const target = output.rows.at(-1)!;
  const witness = search.witness;
  const recordedWitness = target.firstWitness as { y?: number; z?: number } | null | undefined;
  if (target.A !== targetA || target.x !== Number(witness.x) || target.admissiblePairCount < 1 ||
    !recordedWitness || !recordedWitness.y || !recordedWitness.z ||
    !verifyErdosStrausWitness({ n: String(parsed.prime), x: String(target.x),
      y: String(recordedWitness.y), z: String(recordedWitness.z) }).valid) {
    throw new Error("Independent target-gate witness differs");
  }
  const body = { method: "ERDOS_STRAUS_GATE_DOSSIER_V1" as const, candidate: parsed, targetA,
    rows, firstSuccessA: targetA, witness, exclusionAuditDigest: audit.auditDigest,
    pythonScriptDigest: independent.scriptDigest, pythonOutputDigest: independent.outputDigest };
  return structuralGateDossierSchema.parse({ ...body, dossierDigest: sha256(canonicalJson(body)) });
}

export function validateStructuralGateDossier(raw: StructuralGateDossier): boolean {
  const parsed = structuralGateDossierSchema.safeParse(raw);
  if (!parsed.success) return false;
  const { dossierDigest, ...body } = parsed.data;
  if (sha256(canonicalJson(body)) !== dossierDigest ||
    body.targetA <= body.candidate.failedThroughA ||
    body.pythonScriptDigest !== EXCLUSION_SCRIPT_SHA256) return false;
  try {
    const audit = auditResidualFailure(body.candidate.prime, body.targetA - 4);
    const search = searchResidualPrime(body.candidate.prime, body.targetA);
    return audit.auditDigest === body.exclusionAuditDigest &&
      canonicalJson(expectedRows(body.candidate.prime, body.targetA)) === canonicalJson(body.rows) &&
      search.firstA === body.targetA && canonicalJson(search.witness) === canonicalJson(body.witness) &&
      verifyErdosStrausWitness(body.witness).valid;
  } catch { return false; }
}
