import { describe, expect, it } from "vitest";

import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { sha256 } from "@/modules/research-sandbox/integrity";
import { FORMAL_CLAIMS, assembleFormalSource, formalClaimDigest } from "@/modules/research-sandbox/math-formal-claim";
import { PILOT_LEAN_IMAGE } from "@/modules/research-sandbox/math-formal-check";
import { formalReplaySchema } from "@/modules/research-sandbox/math-formal-replay";
import { runFormalLeanReplay } from "@/modules/research-sandbox/math-formal-replay-runner";
import { validateRecordedMathFormalReplay } from "@/modules/research-sandbox/math-formal-replay-record";

const target = FORMAL_CLAIMS.EVEN_SQUARE_V1;
const tactics = "obtain ⟨k, hk⟩ := h\nrefine ⟨2 * k * k, ?_⟩\nrw [hk]\nsimp only [Int.mul_assoc, Int.mul_comm, Int.mul_left_comm]";
const sourceDigest = sha256(assembleFormalSource(target, tactics));
const targetDigest = formalClaimDigest(target);
const primaryCheck = {
  version: 1 as const, method: "PINNED_LEAN_AXIOM_AUDIT_V1" as const,
  status: "KERNEL_ACCEPTED_ALIGNMENT_PENDING" as const, reason: "ALLOWED_AXIOMS" as const,
  targetDigest, sourceDigest, image: PILOT_LEAN_IMAGE,
  toolchain: "Lean 4.10.0 / no mathlib import" as const, axioms: ["propext"],
  outputDigest: "a".repeat(64), diagnostic: "Lean accepted the fixed statement; semantic alignment is not yet attested",
  compilerFeedback: null,
};

describe("formal fresh-replay integrity", () => {
  it("refuses a primary check detached from the exact source before any Docker call", async () => {
    await expect(runFormalLeanReplay({ target, tactics, primaryCheck: { ...primaryCheck, sourceDigest: "0".repeat(64) },
      imageId: "sha256:" + "b".repeat(64) })).rejects.toThrow(/bound, kernel-accepted/);
    expect(await runFormalLeanReplay({ target, tactics, primaryCheck })).toMatchObject({ status: "UNAVAILABLE" });
  });

  it("rejects forged replay status or a changed retained digest", () => {
    const result = formalReplaySchema.parse({ version: 1, method: "LEAN4CHECKER_FRESH_V1",
      status: "REPLAY_ACCEPTED", reason: "FRESH_REPLAY_OK", targetDigest, sourceDigest,
      primaryCheckDigest: sha256(canonicalJson(primaryCheck)), imageId: "sha256:" + "b".repeat(64),
      checkerCommit: "0c3323271991c2dfe75f8be7d21bf93886419736",
      toolchain: "Lean 4.10.0 / Std / lean4checker --fresh", outputDigest: "c".repeat(64),
      diagnostic: "The compiled olean was replayed through a fresh Lean kernel environment" });
    expect(formalReplaySchema.safeParse({ ...result, outputDigest: null }).success).toBe(false);
    const formalAttempt = { contractDigest: target.contractDigest, targetDigest,
      proofSourceDigest: sourceDigest, checkDigest: result.primaryCheckDigest };
    const replay = { ...formalAttempt, sourceDigest, primaryCheckDigest: result.primaryCheckDigest,
      result, resultDigest: sha256(canonicalJson(result)) };
    expect(validateRecordedMathFormalReplay({ replay, formalAttempt })).toMatchObject({ status: "REPLAY_ACCEPTED" });
    expect(validateRecordedMathFormalReplay({ replay: { ...replay, sourceDigest: "0".repeat(64) }, formalAttempt })).toBeNull();
  });
});
