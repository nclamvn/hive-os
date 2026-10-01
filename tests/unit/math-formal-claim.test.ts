import { describe, expect, it } from "vitest";

import { FORMAL_CLAIMS, assembleFormalSource, formalClaimDigest, formalClaimForContractDigest } from "@/modules/research-sandbox/math-formal-claim";

describe("formal claim boundary", () => {
  it("binds the trusted IMO target to its contract without claiming alignment", () => {
    const target = FORMAL_CLAIMS.IMO1988Q6_V1;
    expect(formalClaimForContractDigest(target.contractDigest)).toEqual(target);
    expect(target.alignmentStatus).toBe("PENDING_INDEPENDENT_REVIEW");
    expect(formalClaimDigest(target)).toMatch(/^[a-f0-9]{64}$/);
    expect(assembleFormalSource(target, "exact False.elim (by contradiction)")).toContain(target.declaration);
  });

  it("rejects sorry, axiom injection and output-spoofing syntax before runtime", () => {
    const target = FORMAL_CLAIMS.EVEN_SQUARE_V1;
    for (const tactics of ["sorry", "admit", "exact sorryAx _", "#print axioms fake", "run_tac unsafe", "trace \"spoof\""]) {
      expect(() => assembleFormalSource(target, tactics)).toThrow();
    }
  });
});
