import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { mathModelAttemptSchema } from "@/modules/research-sandbox/contracts";
import { digestResearchResult } from "@/modules/research-sandbox/integrity";
import { MATH_LRC_CAMPAIGN_CONTRACT, digestMathPilotContract, mathPilotContractSchema } from "@/modules/research-sandbox/math-pilot";
import { assertLrcCampaignBinding } from "@/modules/research-sandbox/math-lrc-campaign-integration";
import { validateRecordedMathAgentReview } from "@/modules/research-sandbox/agent-review";

type ReadInput = Parameters<typeof validateRecordedMathAgentReview>[0];
export type LrcCampaignPresentationInput = ReadInput & {reviewJobStatus?: string | null};
const object = (value: unknown): Record<string, unknown> | null => value && typeof value === "object" && !Array.isArray(value)
  ? value as Record<string, unknown> : null;

/** Includes malformed campaign records so they cannot fall back to a cycle UI. */
export function isLrcCampaignRecord(contract: unknown, attempt?: unknown, ledger?: unknown): boolean {
  const c = object(contract), a = object(attempt), l = object(ledger);
  return Boolean(c && (c.version === 2 || "lrcCampaignScope" in c) || a && "lrcCampaignEvidence" in a || l?.version === 5);
}

function validUsage(usage: {inputTokens:number;cachedInputTokens:number;outputTokens:number;reasoningOutputTokens:number}) {
  return usage.cachedInputTokens <= usage.inputTokens && usage.reasoningOutputTokens <= usage.outputTokens;
}

/** Pure retained-record projection. Never imports or runs an evidence importer. */
export function projectLrcCampaignPresentation(input: LrcCampaignPresentationInput) {
  if (!isLrcCampaignRecord(input.contract,input.attempt,input.review?.ledger)) return null;
  const parsed = mathPilotContractSchema.safeParse(input.contract);
  const contractValid = parsed.success && parsed.data.version === 2 &&
    digestMathPilotContract(parsed.data) === input.contractDigest &&
    canonicalJson(parsed.data) === canonicalJson(MATH_LRC_CAMPAIGN_CONTRACT);
  const attempt = mathModelAttemptSchema.safeParse(input.attempt);
  let admitted = false;
  if (contractValid && parsed.success && attempt.success && input.attemptDigest &&
    digestResearchResult(attempt.data) === input.attemptDigest && validUsage(attempt.data.usage)) {
    try {assertLrcCampaignBinding(parsed.data,attempt.data.lrcCampaignEvidence,attempt.data);admitted = true;} catch { /* fail closed */ }
  }
  const ledger = admitted ? validateRecordedMathAgentReview(input) : null;
  const validLedger = ledger?.version === 5 && ledger.reports.every(report => validUsage(report.usage)) ? ledger : null;
  const state = !contractValid || input.attempt != null && !admitted ? "INVALID"
    : admitted ? "ADMITTED" : "MISSING";
  const reviewState = validLedger ? "VALID" : input.review ? "INVALID" : "MISSING";
  const evidence = admitted && attempt.success ? attempt.data.lrcCampaignEvidence! : null;
  const roles = admitted && attempt.success ? [{role:"SOLVER" as const,requestedModel:attempt.data.modelName,
    threadId:attempt.data.threadId,usage:attempt.data.usage,result:attempt.data.attemptType,
    text:attempt.data.argument,gap:attempt.data.limitations.join(" ")},...(validLedger ? validLedger.reports.map(report => ({
      role:report.role,requestedModel:validLedger.reviewerModels!.find(model=>model.role===report.role)!.requestedModelName,
      threadId:report.threadId,usage:report.usage,result:report.verdict,text:report.reasoning,gap:report.unresolvedGap,
    })) : [])] : [];
  return {state,reviewState,evidence,roles,ledger:validLedger,
    jobStatus: ["PENDING","READY","RUNNING","SUCCEEDED","DEAD_LETTER","FAILED"].includes(input.reviewJobStatus ?? "") ? input.reviewJobStatus : null,
    digests: contractValid ? {contract:input.contractDigest,scope:evidence?.scopeDigest,facts:evidence?.factsDigest,
      evidence:evidence?.evidenceDigest,attempt:admitted?input.attemptDigest:null,
      research:validLedger?input.researchDigest:null,ledger:validLedger?input.review?.ledgerDigest:null} : null};
}

export type LrcCampaignPresentation = NonNullable<ReturnType<typeof projectLrcCampaignPresentation>>;
