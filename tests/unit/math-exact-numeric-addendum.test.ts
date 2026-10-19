import { describe, expect, it } from "vitest";

import { digestExactNumericAddendum, validateRecordedExactNumericAddendum } from "@/modules/research-sandbox/math-exact-numeric-addendum";
import { EXACT_INTERVAL_101GON_PROGRAM_DIGEST, exactIntervalOutputDigest } from "@/modules/research-sandbox/math-exact-interval";

const scale = BigInt(10) ** BigInt(80);
const floor = "4771880153";
const output = {
  method: "INTERVAL_101GON_V1" as const, scaleDigits: 80 as const,
  lowerScaled: String(BigInt(floor) * scale + BigInt(1)),
  upperScaled: String((BigInt(floor) + BigInt(1)) * scale - BigInt(1)),
  floor, eventCount: 80_850, crossingWidthScaled: "1",
};
const certificate = {
  ...output, status: "CERTIFIED" as const, reason: "UNIQUE_FLOOR" as const,
  programDigest: EXACT_INTERVAL_101GON_PROGRAM_DIGEST,
  image: `python@sha256:${"a".repeat(64)}`, outputDigest: exactIntervalOutputDigest(JSON.stringify(output)),
};
const source = {
  contractDigest: "a".repeat(64), attemptDigest: "b".repeat(64), researchDigest: "c".repeat(64), claimedAnswer: floor,
};
const verification = { ...source, certificate, certificateDigest: digestExactNumericAddendum(certificate) };

describe("append-only exact numeric addendum", () => {
  it("accepts a separately bound, numerically valid certificate", () => {
    expect(validateRecordedExactNumericAddendum({ verification, ...source })).toEqual(certificate);
  });

  it("fails closed on changed inputs, claims, bounds and retained digests", () => {
    expect(validateRecordedExactNumericAddendum({ verification, ...source, researchDigest: "d".repeat(64) })).toBeNull();
    expect(validateRecordedExactNumericAddendum({ verification, ...source, claimedAnswer: "4771880152" })).toBeNull();
    expect(validateRecordedExactNumericAddendum({ verification: { ...verification, certificateDigest: "0".repeat(64) }, ...source })).toBeNull();
    expect(validateRecordedExactNumericAddendum({ verification: { ...verification, certificate: { ...certificate, lowerScaled: "1" } }, ...source })).toBeNull();
  });
});
