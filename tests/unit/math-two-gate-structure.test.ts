import { describe, expect, it } from "vitest";

import { searchResidualPrime, verifyErdosStrausWitness } from "@/modules/research-sandbox/math-certificates";
import { analyzeTwoGateResidualPrime, validateTwoGateProfile } from "@/modules/research-sandbox/math-two-gate-structure";

describe("two-gate residual-prime structure", () => {
  it("classifies the three independently replayed hard cases without claiming a global failure", () => {
    for (const p of [2521, 10_051_441, 171_348_241]) {
      const profile = analyzeTwoGateResidualPrime(p);
      expect(profile.bothObstructed).toBe(true);
      expect(profile.gates.map((gate) => gate.status)).toEqual(["OBSTRUCTED", "OBSTRUCTED"]);
      expect(profile.profileDigest).toMatch(/^[a-f0-9]{64}$/);
      expect(validateTwoGateProfile(profile)).toBe(true);
      expect(searchResidualPrime(p, 7).firstA).toBeNull();
    }
    expect(analyzeTwoGateResidualPrime(2521).gates.map((gate) => gate.factors)).toEqual([
      [{ prime: 631, exponent: 1 }],
      [{ prime: 2, exponent: 3 }, { prime: 79, exponent: 1 }],
    ]);
  });

  it("constructs exact witnesses for every A=7 nonresidue branch", () => {
    for (const [p, residue, divisor] of [[9241, 3, 68], [14281, 5, 19], [13441, 6, 82]]) {
      const gate = analyzeTwoGateResidualPrime(p).gates[1];
      expect(gate.factors.some(({ prime }) => prime % 7 === residue)).toBe(true);
      expect(gate.status).toBe("WITNESS");
      expect(gate.divisor).toBe(divisor);
      expect(gate.witness && verifyErdosStrausWitness(gate.witness).valid).toBe(true);
    }
  });

  it("matches the exhaustive A=3 gate and rejects tampering or out-of-domain inputs", () => {
    for (let p = 841; p <= 100_000; p += 840) {
      let profile;
      try { profile = analyzeTwoGateResidualPrime(p); } catch { continue; }
      expect(profile.gates[0].status === "WITNESS").toBe(searchResidualPrime(p, 3).firstA === 3);
      for (const gate of profile.gates) {
        expect(gate.witness ? verifyErdosStrausWitness(gate.witness).valid : gate.status === "OBSTRUCTED").toBe(true);
      }
    }
    const original = analyzeTwoGateResidualPrime(9241);
    expect(validateTwoGateProfile({ ...original, bothObstructed: true })).toBe(false);
    expect(validateTwoGateProfile({ ...original, profileDigest: "0".repeat(64) })).toBe(false);
    expect(() => analyzeTwoGateResidualPrime(841)).toThrow();
    expect(() => analyzeTwoGateResidualPrime(200_000_001)).toThrow();
  });
});
