import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import {
  buildLrcShiftPhaseCertificate,
  LRC_SHIFT_PREDICATE,
  type LrcMethodUnitFiniteSeed,
  type LrcShiftFiniteInput,
} from "@/modules/research-sandbox/math-lrc-method-unit";

export function shiftReplayFixture(d: 3 | 5 = 3, e: 2 | 3 | 4 = 2): LrcShiftFiniteInput {
  const seed: LrcMethodUnitFiniteSeed = {
    d, e, unitResidues: Array.from({ length: e }, (_, i) => 1 + i % (d - 1)),
    offsets: Array.from({ length: e }, (_, i) => ({ numerator: String(i), denominator: String(d) })),
  };
  seed.offsets[0] = { numerator: "0", denominator: "1" };
  return { version: 1, predicateId: LRC_SHIFT_PREDICATE, ...seed, certificate: buildLrcShiftPhaseCertificate(seed) };
}
export function shiftReplayCustom(seed: LrcMethodUnitFiniteSeed): LrcShiftFiniteInput {
  return { version: 1, predicateId: LRC_SHIFT_PREDICATE, ...seed, certificate: buildLrcShiftPhaseCertificate(seed) };
}
export function copyShiftInput(): LrcShiftFiniteInput {
  return JSON.parse(JSON.stringify(shiftReplayFixture()));
}
export function resealShiftInput(input: LrcShiftFiniteInput): LrcShiftFiniteInput {
  const { certificateDigest: old, ...body } = input.certificate;
  void old;
  input.certificate.certificateDigest = sha256(canonicalJson(body));
  return input;
}

