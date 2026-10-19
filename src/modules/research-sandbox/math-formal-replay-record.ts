import { canonicalJson } from "@/modules/execution-fabric/contracts";

import { sha256 } from "./integrity";
import { formalReplaySchema } from "./math-formal-replay";

/** Read-time integrity check. A valid fresh replay still does not prove semantic alignment. */
export function validateRecordedMathFormalReplay(input: {
  replay: { contractDigest: string; targetDigest: string; sourceDigest: string;
    primaryCheckDigest: string; result: unknown; resultDigest: string } | null;
  formalAttempt: { contractDigest: string; targetDigest: string; proofSourceDigest: string;
    checkDigest: string };
}) {
  const row = input.replay;
  if (!row || row.contractDigest !== input.formalAttempt.contractDigest ||
    row.targetDigest !== input.formalAttempt.targetDigest ||
    row.sourceDigest !== input.formalAttempt.proofSourceDigest ||
    row.primaryCheckDigest !== input.formalAttempt.checkDigest) return null;
  const result = formalReplaySchema.safeParse(row.result);
  if (!result.success || sha256(canonicalJson(result.data)) !== row.resultDigest ||
    result.data.targetDigest !== row.targetDigest || result.data.sourceDigest !== row.sourceDigest ||
    result.data.primaryCheckDigest !== row.primaryCheckDigest) return null;
  return result.data;
}
