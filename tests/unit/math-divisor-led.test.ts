import { describe, expect, it } from "vitest";

import { searchModulatorBox } from "@/modules/research-sandbox/math-adaptive-corridor";
import { auditSharedDivisorSeparation, fixedDivisorProgressionBarrier, primeDivisorResidueAtlas, searchDivisorLed, validateDivisorLedEvidence } from "@/modules/research-sandbox/math-divisor-led";
import { verifyErdos242StrictWitness } from "@/modules/research-sandbox/math-certificates";

describe("divisor-led adaptive Type II search", () => {
  it("rescues the retained box miss without changing that box or assuming prime divisors", () => {
    expect(searchModulatorBox(131433121, 8).status).toBe("NOT_FOUND_IN_BOX");
    expect(searchDivisorLed(131433121, 142)).toMatchObject({ status: "NOT_FOUND_IN_S_INTERVAL", firstS: null });
    const result = searchDivisorLed(131433121, 143);
    expect(result).toMatchObject({ status: "WITNESS", firstS: 143,
      construction: { a: 4, u: 9, s: 143, v: 3676451, k: 1, shift: 919115 } });
    expect(result.witness).toEqual({ n: "131433121", x: "33088059", y: "4731592356", z: "1932829716534284" });
    expect(verifyErdos242StrictWitness(result.witness!).valid).toBe(true);
    expect(searchDivisorLed(131433121, 143, "PRIME_ONLY_DIAGNOSTIC").status).toBe("NOT_FOUND_IN_S_INTERVAL");
  });

  it("uses s ordering, not minimal depth, shift, or denominator", () => {
    expect(searchDivisorLed(2521, 4095)).toMatchObject({ firstS: 47, construction: { a: 3, u: 4, v: 161, k: 1 } });
    expect(searchDivisorLed(131041, 4095)).toMatchObject({ firstS: 23, construction: { a: 2, u: 3 } });
    expect(searchDivisorLed(171348241, 4095)).toMatchObject({ firstS: 83, construction: { a: 3, u: 7 } });
  });

  it("seals exact outcomes and rejects domain/mode/certificate corruption", () => {
    const result = searchDivisorLed(131433121, 143);
    expect(validateDivisorLedEvidence(result)).toBe(true);
    expect(validateDivisorLedEvidence({ ...result, maxS: 142 })).toBe(false);
    expect(validateDivisorLedEvidence({ ...result, digest: "0".repeat(64) })).toBe(false);
    expect(validateDivisorLedEvidence({ ...result, witness: { ...result.witness!, x: "1" } })).toBe(false);
    for (const maxS of [0, 2, 100001, 3.5]) expect(() => searchDivisorLed(2521, maxS)).toThrow();
    for (const n of [841, 2520, 200000001]) expect(() => searchDivisorLed(n, 143)).toThrow();
    expect(() => searchDivisorLed(2521, 143, "BAD" as never)).toThrow();
  });

  it("limits the determinant obstruction to this particular divisor and declared box", () => {
    expect(auditSharedDivisorSeparation(131433121, 143, 4, 9, 8)).toMatchObject({
      determinantBound: 72, seedInsideBox: false, conclusion: "NO_PAIR_IN_BOX_CAN_SHARE_S" });
    expect(auditSharedDivisorSeparation(131433121, 143, 4, 9, 9).conclusion).toBe("ONLY_SEED_PAIR_CAN_SHARE_S_IN_BOX");
    expect(auditSharedDivisorSeparation(131433121, 143, 4, 9, 16).conclusion).toBe("NO_SEPARATION_GUARANTEE");
    expect(() => auditSharedDivisorSeparation(131433121, 143, 8, 18, 8)).toThrow();
    expect(() => auditSharedDivisorSeparation(131433121, 143, 4, 8, 8)).toThrow();
  });

  it("keeps an unconditional progression blind to each declared fixed divisor", () => {
    expect(fixedDivisorProgressionBarrier(19)).toMatchObject({ spacing: "175560", infinitudeBasis: "DIRICHLET_KNOWN_THEOREM" });
    expect(fixedDivisorProgressionBarrier(31).spacing).toBe("1126568520");
    expect(fixedDivisorProgressionBarrier(63).spacing).toBe("29687129730137880");
    expect(searchDivisorLed(351121, 19).status).toBe("NOT_FOUND_IN_S_INTERVAL");
    expect(searchDivisorLed(351121, 4095).status).toBe("WITNESS");
    expect(() => fixedDivisorProgressionBarrier(64)).toThrow();
  });

  it("does not equate a quadratic nonresidue or a pair count with distinct eligible classes", () => {
    expect(primeDivisorResidueAtlas(11)).toMatchObject({ usableResidues: [7, 8, 10], nonresiduesWithoutThisWitness: [2, 6] });
    const q127 = primeDivisorResidueAtlas(127);
    expect(q127.pairs).toHaveLength(11);
    expect(q127.usableResidues).toHaveLength(7);
    expect(q127.duplicatePairResidues).toBe(4);
    expect(q127.pairs.filter((p) => p.residue === 95)).toEqual([
      { a: 1, u: 32, residue: 95 }, { a: 4, u: 1, residue: 95 }]);
    expect(() => primeDivisorResidueAtlas(15)).toThrow();
    expect(() => primeDivisorResidueAtlas(13)).toThrow();
  });
});
