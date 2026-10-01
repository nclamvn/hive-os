import { z } from "zod";

import { canonicalJson } from "@/modules/execution-fabric/contracts";

import { sha256 } from "./integrity";
import { MATH_PILOT_BENCHMARK, MATH_PILOT_CALIBRATIONS, digestMathPilotContract } from "./math-pilot";

export const formalClaimSchema = z.object({
  version: z.literal(1),
  targetId: z.enum(["EVEN_SQUARE_V1", "IMO1988Q6_V1"]),
  contractDigest: z.string().regex(/^[a-f0-9]{64}$/),
  theoremName: z.enum(["hive_even_square", "hive_imo1988_q6"]),
  declaration: z.string().min(30).max(2_000),
  alignmentMap: z.array(z.object({ informal: z.string(), formal: z.string() }).strict()).min(2).max(8),
  alignmentStatus: z.literal("PENDING_INDEPENDENT_REVIEW"),
}).strict();

export type FormalClaim = z.infer<typeof formalClaimSchema>;

/** Trusted targets are selected by sealed contract digest, never written by a model. */
export const FORMAL_CLAIMS: Record<FormalClaim["targetId"], FormalClaim> = {
  EVEN_SQUARE_V1: formalClaimSchema.parse({
    version: 1, targetId: "EVEN_SQUARE_V1",
    contractDigest: digestMathPilotContract(MATH_PILOT_CALIBRATIONS.CALIBRATION_PROOF),
    theoremName: "hive_even_square",
    declaration: "theorem hive_even_square (n : Int) (h : ∃ k : Int, n = 2 * k) :\n    ∃ j : Int, n * n = 2 * j := by",
    alignmentMap: [
      { informal: "every integer n", formal: "(n : Int)" },
      { informal: "n is even", formal: "h : ∃ k : Int, n = 2 * k" },
      { informal: "n squared is even", formal: "∃ j : Int, n * n = 2 * j" },
    ], alignmentStatus: "PENDING_INDEPENDENT_REVIEW",
  }),
  IMO1988Q6_V1: formalClaimSchema.parse({
    version: 1, targetId: "IMO1988Q6_V1", contractDigest: digestMathPilotContract(MATH_PILOT_BENCHMARK),
    theoremName: "hive_imo1988_q6",
    declaration: "theorem hive_imo1988_q6 (a b : Nat) (ha : 0 < a) (hb : 0 < b)\n    (hdiv : a * b + 1 ∣ a * a + b * b) :\n    ∃ k : Nat, a * a + b * b = (a * b + 1) * (k * k) := by",
    alignmentMap: [
      { informal: "a,b positive integers", formal: "(a b : Nat) (ha : 0 < a) (hb : 0 < b)" },
      { informal: "ab+1 divides a²+b²", formal: "hdiv : a * b + 1 ∣ a * a + b * b" },
      { informal: "the quotient is an integer square", formal: "∃ k : Nat, a * a + b * b = (a * b + 1) * (k * k)" },
    ], alignmentStatus: "PENDING_INDEPENDENT_REVIEW",
  }),
};

export function formalClaimForContractDigest(digest: string): FormalClaim | null {
  return Object.values(FORMAL_CLAIMS).find((target) => target.contractDigest === digest) ?? null;
}

export function formalClaimDigest(target: FormalClaim): string {
  return sha256(canonicalJson(formalClaimSchema.parse(target)));
}

export const formalProofTacticsSchema = z.string().trim().min(1).max(12_000).superRefine((value, ctx) => {
  const lines = value.split(/\r?\n/);
  if (lines.length > 160 || lines.some((line) => line.length > 400 || /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(line)) ||
    /\b(sorry|admit|axiom|opaque|unsafe|partial|run_tac|run_cmd|elab|initialize|set_option|native_decide|sorryAx|trace|dbg_trace|Lean\.trustCompiler)\b|IO\.|#|`|\/\*|\*\//i.test(value)) {
    ctx.addIssue({ code: "custom", message: "Proof tactics contain unsupported or unsafe syntax" });
  }
});

export function assembleFormalSource(target: FormalClaim, rawTactics: string): string {
  const tactics = formalProofTacticsSchema.parse(rawTactics);
  // The candidate supplies tactics only, never an import, theorem statement,
  // namespace, axiom audit, or terminal command.
  return `import Std\n\n${target.declaration}\n${tactics.split(/\r?\n/).map((line) => `  ${line}`).join("\n")}\n\n#print axioms ${target.theoremName}\n`;
}
