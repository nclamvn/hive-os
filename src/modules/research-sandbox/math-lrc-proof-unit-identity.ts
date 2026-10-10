import { MATH_LRC_CAMPAIGN_CONTRACT, digestMathPilotContract } from "./math-pilot";
import { LRC_CAMPAIGN_LIMITS } from "./math-lrc-campaign";
import { assertLrcCampaignBinding } from "./math-lrc-campaign-integration";
import { runLrcCampaignReference } from "./math-lrc-campaign-reference";

/** Observe existing42-file identity ONLY under its unchanged internal v2 binding.
 * The returned v2 evidence is never retained as a v3 root or supplied to a model.
 * No forest/Python/checker execution; inherited fixed paths/caps/symlink guards.
 */
export async function importLrcProofUnitIdentity(options: {
  availableMs?: number; readReference?: typeof runLrcCampaignReference;
} = {}) {
  const start = performance.now();
  const availableMs = options.availableMs === undefined ? LRC_CAMPAIGN_LIMITS.importMs : options.availableMs;
  if (!Number.isSafeInteger(availableMs) || availableMs <= 0 || availableMs > LRC_CAMPAIGN_LIMITS.importMs) throw new Error("Proof-unit identity import cap refused");
  const read = options.readReference ?? runLrcCampaignReference;
  const evidence = await read(MATH_LRC_CAMPAIGN_CONTRACT.lrcCampaignScope!,
    digestMathPilotContract(MATH_LRC_CAMPAIGN_CONTRACT), { permission: true }, availableMs);
  assertLrcCampaignBinding(MATH_LRC_CAMPAIGN_CONTRACT, evidence);
  if (performance.now() - start >= availableMs) throw new Error("Proof-unit identity import deadline exhausted");
  return Object.freeze({ mode: "RETAINED_IDENTITY_ONLY_NOT_FRESH" as const, method: "FIXED_42_FILE_IDENTITY_IMPORT" as const,
    checkedAt: evidence.admission.importedAt, filesVerified: evidence.admission.filesVerified,
    bytesVerified: evidence.admission.bytesVerified, manifestDigest: evidence.manifestDigest,
    semanticReplayExecuted: false as const, externalAttestation: false as const });
}
