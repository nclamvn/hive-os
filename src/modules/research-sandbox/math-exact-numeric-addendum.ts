import { canonicalJson } from "@/modules/execution-fabric/contracts";

import { sha256 } from "./integrity";
import { exactIntervalSchema, validExactInterval, type ExactInterval } from "./math-exact-interval";

export function digestExactNumericAddendum(certificate: ExactInterval): string {
  return sha256(canonicalJson(exactIntervalSchema.parse(certificate)));
}

export function validateRecordedExactNumericAddendum(input: {
  verification: { contractDigest: string; attemptDigest: string; researchDigest: string;
    claimedAnswer: string; certificate: unknown; certificateDigest: string } | null;
  contractDigest: string; attemptDigest: string | null; researchDigest: string;
  claimedAnswer: string | null;
}): ExactInterval | null {
  const record = input.verification;
  if (!record || !input.attemptDigest || !input.claimedAnswer ||
    record.contractDigest !== input.contractDigest ||
    record.attemptDigest !== input.attemptDigest ||
    record.researchDigest !== input.researchDigest ||
    record.claimedAnswer !== input.claimedAnswer) return null;
  const parsed = exactIntervalSchema.safeParse(record.certificate);
  if (!parsed.success || digestExactNumericAddendum(parsed.data) !== record.certificateDigest ||
    !validExactInterval(parsed.data, input.claimedAnswer)) return null;
  return parsed.data;
}
