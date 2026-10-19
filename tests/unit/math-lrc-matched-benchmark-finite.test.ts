import { describe, expect, it } from "vitest";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { LRC_MATCHED_FIXTURES } from "@/modules/research-sandbox/math-lrc-matched-benchmark";
import { buildLrcShiftPhaseCertificate, verifyLrcShiftFiniteCertificate, LRC_SHIFT_PREDICATE } from "@/modules/research-sandbox/math-lrc-method-unit";

function complete(index: 0 | 1 | 2) {
  const fixture = LRC_MATCHED_FIXTURES[index], v = fixture.input;
  const seed = { d: v.d, e: v.e, unitResidues: [...v.unitResidues], offsets: v.offsets.map(value => ({ ...value })) };
  return { version: 1, predicateId: LRC_SHIFT_PREDICATE, ...seed, certificate: buildLrcShiftPhaseCertificate(seed) };
}
const rehash = (input: ReturnType<typeof complete>) => {
  const { certificateDigest: _old, ...body } = input.certificate; void _old;
  input.certificate.certificateDigest = sha256(canonicalJson(body)); return input;
};
describe("matched control fixtures actually use new bounded independent finite consumer", () => {
  it("known conditional control checks only finite units/cells and keeps real/global debts", () => {
    const result = verifyLrcShiftFiniteCertificate(complete(0)); expect(result.status).toBe("FINITE_CERTIFICATE_ACCEPTED");
    expect(result.result?.partitions).toBe(2); expect(result.result?.cells).toBe(24);
    expect(result.result?.realTimeProof).toBe("NOT_ESTABLISHED"); expect(result.result?.globalLrc).toBe("NOT_ESTABLISHED");
    expect(result.chargedOperations).toBeGreaterThan(0);
  });
  it("strengthened-count fixture has exact masks {0}/{2} and good set {1}, not source/LRC refutation", () => {
    const result = verifyLrcShiftFiniteCertificate(complete(2)); expect(result.status).toBe("FINITE_CERTIFICATE_ACCEPTED");
    expect(result.result?.tupleBadMasks).toEqual([[0], [2]]); expect(result.result?.goodShiftIndices).toEqual([1]);
    expect(result.result!.goodShiftIndices.length).toBeLessThan(LRC_MATCHED_FIXTURES[2].input.claimedMinimumGoodShifts);
    expect(result.result?.globalLrc).toBe("NOT_ESTABLISHED");
  });
  it.each(["OPEN_CELL", "BOUNDARY", "UNIT_PARTITION", "BAD_MASK"])("coherently rehashed %s damage refuses certificate coverage", damage => {
    const input = structuredClone(complete(1));
    if (damage === "OPEN_CELL") input.certificate.partitions[0].cells.splice(1, 1);
    if (damage === "BOUNDARY") input.certificate.partitions[0].boundaries.shift();
    if (damage === "UNIT_PARTITION") input.certificate.partitions.shift();
    if (damage === "BAD_MASK") input.certificate.partitions[0].cells[0].badShiftIndices = [0];
    const result = verifyLrcShiftFiniteCertificate(rehash(input)); expect(result.status).toBe("CERTIFICATE_REFUSED"); expect(result.result).toBeNull();
  });
  it("equality1/15 is good, not a counterexample or a widened discovery domain", () => {
    const seed = { d: 3, e: 2, unitResidues: [1, 1], offsets: [{ numerator: "1", denominator: "15" }, { numerator: "0", denominator: "1" }] };
    const result = verifyLrcShiftFiniteCertificate({ version: 1, predicateId: LRC_SHIFT_PREDICATE, ...seed, certificate: buildLrcShiftPhaseCertificate(seed) });
    expect(result.status).toBe("FINITE_CERTIFICATE_ACCEPTED"); expect(result.result?.tupleBadMasks[0]).toEqual([]);
  });
  it("discovery outside registered finite classes remains unsupported without novelty promotion", () => {
    // An absent certificate is malformed; a complete broad input reaches the domain refusal.
    expect(verifyLrcShiftFiniteCertificate({ d: 7, e: 2 }).status).toBe("CERTIFICATE_REFUSED");
    const result = verifyLrcShiftFiniteCertificate({ ...complete(0), d: 7 }); expect(result.status).toBe("UNSUPPORTED"); expect(result.result).toBeNull();
    expect(LRC_MATCHED_FIXTURES[3].oracle).toBe("NONE_NOVELTY_PENDING");
  });
});
