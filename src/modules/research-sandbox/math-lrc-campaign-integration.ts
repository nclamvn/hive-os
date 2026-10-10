import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { ResearchSandboxError } from "./errors";
import { digestMathPilotContract, mathPilotContractSchema, MATH_LRC_CAMPAIGN_CONTRACT, type MathPilotContract } from "./math-pilot";
import { mathModelAttemptSchema } from "./contracts";
import {
  cloneLrcCampaignValue, snapshotLrcCampaignValue, unchangedLrcCampaignSnapshot,
  validateRetainedLrcCampaignEvidence, type LrcCampaignEvidence,
} from "./math-lrc-campaign";

export function requireLrcCampaignCapability(enabled: boolean, nodeEnv: string | undefined = process.env.NODE_ENV,
  deploymentEnv: string | undefined = process.env.DEPLOYMENT_ENV): void {
  if (!enabled || !["development", "test"].includes(nodeEnv ?? "") ||
    (deploymentEnv !== undefined && !["development", "test"].includes(deploymentEnv))) {
    throw new ResearchSandboxError("INVALID_TRANSITION", "Campaign references require explicit local development/test capability");
  }
}

/** Checks fixed host identity, not fresh semantic execution. No IO in read guards. */
export function assertLrcCampaignBinding(contract: MathPilotContract, evidence: unknown,
  attempt?: unknown): asserts evidence is LrcCampaignEvidence {
  const parsed = mathPilotContractSchema.safeParse(contract);
  if (!parsed.success || parsed.data.version !== 2 || !parsed.data.lrcCampaignScope ||
    canonicalJson(parsed.data)!==canonicalJson(MATH_LRC_CAMPAIGN_CONTRACT) ||
    !validateRetainedLrcCampaignEvidence(evidence, parsed.data.lrcCampaignScope, digestMathPilotContract(parsed.data))) {
    throw new ResearchSandboxError("INTEGRITY_FAILURE", "Campaign scope or retained host admission is invalid");
  }
  if (attempt !== undefined) {
    const value = mathModelAttemptSchema.safeParse(attempt);
    if (!value.success || ["lrcEvidence","exactAnswer","computationPython","computationOrigin",
      "erdosStrausWitnesses","erdosStrausPolynomialFamilies","erdosStrausGateCounterexample"].some(key=>key in value.data) ||
      canonicalJson(value.data.lrcCampaignEvidence) !== canonicalJson(evidence)) {
      throw new ResearchSandboxError("INTEGRITY_FAILURE", "Campaign attempt is mixed, missing or bound to different evidence");
    }
  }
}

/** Independent snapshot strings outlive all aliases, including a mutated clone. */
export async function guardedLrcCampaignCall<T, R>(input: T, call: (defensive: T) => Promise<R>): Promise<R> {
  const snapshot = snapshotLrcCampaignValue(input);
  const defensive = cloneLrcCampaignValue(input);
  const freeze = (value: unknown) => {if (value && typeof value === "object") {
    Object.values(value).forEach(freeze); Object.freeze(value);
  }};
  freeze(defensive); // A role cannot temporarily alter and restore its supplied facts.
  const defensiveSnapshot = snapshotLrcCampaignValue(defensive);
  let result: R;
  try { result = await call(defensive); }
  catch (error) {
    if (!unchangedLrcCampaignSnapshot(input, snapshot) || !unchangedLrcCampaignSnapshot(defensive, defensiveSnapshot)) {
      throw new ResearchSandboxError("INTEGRITY_FAILURE", "Campaign inputs mutated during failed dispatch");
    }
    throw error;
  }
  if (!unchangedLrcCampaignSnapshot(input, snapshot) || !unchangedLrcCampaignSnapshot(defensive, defensiveSnapshot)) {
    throw new ResearchSandboxError("INTEGRITY_FAILURE", "Campaign inputs mutated during dispatch");
  }
  return result;
}

export function lrcCampaignLedgerReference(evidence: LrcCampaignEvidence) {
  return { scopeDigest: evidence.scopeDigest, evidenceDigest: evidence.evidenceDigest,
    factsDigest: evidence.factsDigest, claimId: evidence.claimId };
}

export function assertNoProviderCampaignEvidence(output: unknown): void {
  if (output && typeof output === "object") {
    const value = output as Record<string, unknown>;
    if ("lrcCampaignEvidence" in value || (value.mathAttempt && typeof value.mathAttempt === "object" &&
      "lrcCampaignEvidence" in value.mathAttempt)) {
      throw new ResearchSandboxError("INTEGRITY_FAILURE", "Provider output cannot author any host campaign evidence");
    }
  }
}
