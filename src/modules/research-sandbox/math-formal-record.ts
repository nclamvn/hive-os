import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { z } from "zod";

import { sha256 } from "./integrity";
import { formalCheckSchema, PILOT_LEAN_IMAGE } from "./math-formal-check";
import { assembleFormalSource, formalClaimDigest, formalClaimForContractDigest,
  formalClaimSchema } from "./math-formal-claim";

const usageSchema = z.object({
  input_tokens: z.number().int().nonnegative(), cached_input_tokens: z.number().int().nonnegative(),
  output_tokens: z.number().int().nonnegative(), reasoning_output_tokens: z.number().int().nonnegative(),
}).strict();

export const formalRepairTraceSchema = z.array(z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("CHECKED"), round: z.number().int().min(1).max(2),
    modelThreadId: z.string().min(1).max(200), modelUsage: usageSchema,
    proofTactics: z.string().min(1).max(12_000), check: formalCheckSchema,
    checkDigest: z.string().regex(/^[a-f0-9]{64}$/) }).strict(),
  z.object({ kind: z.literal("REPAIR_FAILED"), round: z.literal(2), reason: z.literal("MODEL_CALL_FAILED") }).strict(),
])).min(1).max(3);

export type FormalRepairTrace = z.infer<typeof formalRepairTraceSchema>;

/** Integrity read only. A valid record is not an attested theorem. */
export function validateRecordedMathFormalAttempt(input: {
  record: { contractDigest: string; attemptDigest: string; researchDigest: string;
    target: unknown; targetDigest: string; proofTactics: string; proofSourceDigest: string;
    check: unknown; checkDigest: string; repairTrace: unknown; modelThreadId: string;
    modelUsage: unknown } | null;
  contractDigest: string; attemptDigest: string | null; researchDigest: string;
}) {
  const row = input.record;
  if (!row || !input.attemptDigest || row.contractDigest !== input.contractDigest ||
    row.attemptDigest !== input.attemptDigest || row.researchDigest !== input.researchDigest) return null;
  const target = formalClaimSchema.safeParse(row.target);
  const check = formalCheckSchema.safeParse(row.check);
  const trace = formalRepairTraceSchema.safeParse(row.repairTrace);
  const canonicalTarget = formalClaimForContractDigest(input.contractDigest);
  if (!target.success || !check.success || !trace.success || !canonicalTarget ||
    formalClaimDigest(target.data) !== row.targetDigest ||
    formalClaimDigest(canonicalTarget) !== row.targetDigest ||
    sha256(canonicalJson(check.data)) !== row.checkDigest) return null;
  let source: string;
  try { source = assembleFormalSource(target.data, row.proofTactics); }
  catch { return null; }
  const checked = trace.data.filter((event) => event.kind === "CHECKED");
  const last = checked.at(-1);
  if (!last || trace.data[0]?.kind !== "CHECKED" ||
    trace.data.some((event, index) => event.round !== index + 1) ||
    trace.data.some((event) => event.kind === "REPAIR_FAILED" && event !== trace.data.at(-1)) ||
    checked.some((event) => {
      try { return sha256(assembleFormalSource(target.data, event.proofTactics)) !== event.check.sourceDigest ||
        event.check.targetDigest !== row.targetDigest ||
        sha256(canonicalJson(event.check)) !== event.checkDigest; }
      catch { return true; }
    }) || last.proofTactics !== row.proofTactics || last.checkDigest !== row.checkDigest ||
    last.modelThreadId !== row.modelThreadId || canonicalJson(last.modelUsage) !== canonicalJson(row.modelUsage) ||
    sha256(source) !== row.proofSourceDigest || check.data.sourceDigest !== row.proofSourceDigest ||
    check.data.targetDigest !== row.targetDigest ||
    (check.data.status === "KERNEL_ACCEPTED_ALIGNMENT_PENDING" &&
      (check.data.image !== PILOT_LEAN_IMAGE || check.data.reason !== "ALLOWED_AXIOMS"))) return null;
  return { target: target.data, check: check.data, trace: trace.data };
}
