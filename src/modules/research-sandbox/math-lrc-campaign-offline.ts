import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { mathModelAttemptSchema } from "./contracts";
import { digestMathAgentLedger, evaluateMathAgentReview, mathAgentLedgerSchema, mathAgentReportSchema,
  validateRecordedMathAgentReview, type MathAgentReport } from "./agent-review";
import { digestMathPilotContract, mathPilotContractSchema, type MathPilotContract } from "./math-pilot";
import { digestResearchResult } from "./integrity";
import { ResearchSandboxError } from "./errors";
import { lrcCampaignFactsPrompt, type LrcCampaignEvidence, snapshotLrcCampaignValue, unchangedLrcCampaignSnapshot } from "./math-lrc-campaign";
import { assertLrcCampaignBinding, assertNoProviderCampaignEvidence, guardedLrcCampaignCall,
  lrcCampaignLedgerReference, requireLrcCampaignCapability } from "./math-lrc-campaign-integration";

/** Deterministic no-DB seam; callbacks are explicit stubs, never model adapters. */
export async function runOfflineLrcCampaignAgents(input: {
  enabled: boolean; caseId: string; contract: unknown; evidence: unknown; researchDigest: string;
  modelName: string; roleModels: { CRITIC: string; ADVERSARY: string };
  fence: () => Promise<void>;
  solve: (view: { contract: MathPilotContract; evidence: LrcCampaignEvidence; facts: string; caseId: string }) => Promise<unknown>;
  reviewRole?: (view: { role: MathAgentReport["role"]; contract: MathPilotContract;
    attempt: ReturnType<typeof mathModelAttemptSchema.parse>; evidence: LrcCampaignEvidence; facts: string; caseId: string }) => Promise<unknown>;
  retain: (view: { caseId: string; attemptDigest: string; ledgerDigest: string }) => Promise<void>;
}) {
  requireLrcCampaignCapability(input.enabled);
  const contract = mathPilotContractSchema.parse(input.contract);
  assertLrcCampaignBinding(contract, input.evidence);
  if (!input.reviewRole || !input.caseId || !/^[a-f0-9]{64}$/.test(input.researchDigest)) {
    throw new ResearchSandboxError("INTEGRITY_FAILURE", "Campaign requires distinct per-role review and sealed case/research identity");
  }
  const evidence = input.evidence;
  const host = { caseId: input.caseId, contract: input.contract, evidence, researchDigest: input.researchDigest };
  const snapshot = snapshotLrcCampaignValue(host);
  const revalidate = () => {
    if (!unchangedLrcCampaignSnapshot(host, snapshot) || input.caseId !== host.caseId ||
      input.researchDigest !== host.researchDigest || canonicalJson(input.contract) !== canonicalJson(host.contract) ||
      canonicalJson(input.evidence) !== canonicalJson(evidence)) throw new ResearchSandboxError("INTEGRITY_FAILURE", "Campaign host inputs changed");
    assertLrcCampaignBinding(contract, evidence);
  };
  const facts = lrcCampaignFactsPrompt(evidence);
  revalidate(); // The initial admission is before the single-dispatch fence.
  await input.fence();
  revalidate();
  const output = await guardedLrcCampaignCall({ contract, evidence, facts, caseId: host.caseId }, input.solve);
  revalidate(); assertNoProviderCampaignEvidence(output);
  const providerAttempt = mathModelAttemptSchema.parse(output);
  if (providerAttempt.modelName !== input.modelName) throw new ResearchSandboxError("PROVIDER_MISMATCH", "Stub solver model provenance differs");
  const attempt = mathModelAttemptSchema.parse({ ...providerAttempt, lrcCampaignEvidence: evidence });
  assertLrcCampaignBinding(contract, evidence, attempt);
  const attemptSnapshot = snapshotLrcCampaignValue(attempt);
  const reports: MathAgentReport[] = [];
  for (const role of ["CRITIC", "ADVERSARY"] as const) {
    revalidate(); assertLrcCampaignBinding(contract, evidence, attempt);
    const report = mathAgentReportSchema.parse(await guardedLrcCampaignCall({ role, contract, attempt, evidence, facts, caseId: host.caseId }, input.reviewRole));
    revalidate();
    if (!unchangedLrcCampaignSnapshot(attempt, attemptSnapshot) || report.role !== role ||
      report.threadId === attempt.threadId || reports.some((prior) => prior.threadId === report.threadId)) {
      throw new ResearchSandboxError("INTEGRITY_FAILURE", "Campaign role input mutated or context reused");
    }
    reports.push(report);
  }
  assertLrcCampaignBinding(contract, evidence, attempt);
  const contractDigest = digestMathPilotContract(contract), attemptDigest = digestResearchResult(attempt);
  const verdict = evaluateMathAgentReview({ contract, contractDigest, attempt, reports: reports as [MathAgentReport, MathAgentReport] });
  const ledger = mathAgentLedgerSchema.parse({ version: 5, reports,
    reviewerModels: reports.map((report) => ({ role: report.role, providerName: "codex-local", identityEvidence: "REQUESTED_CLI_MODEL",
      requestedModelName: input.roleModels[report.role], threadId: report.threadId })),
    lrcCampaignEvidence: lrcCampaignLedgerReference(evidence), ...verdict });
  const ledgerDigest = digestMathAgentLedger(ledger);
  const review = { ...verdict, contractDigest, attemptDigest, researchDigest: host.researchDigest, ledger, ledgerDigest };
  revalidate();
  if (!validateRecordedMathAgentReview({ contract, contractDigest, attempt, attemptDigest, researchDigest: host.researchDigest, review })) {
    throw new ResearchSandboxError("INTEGRITY_FAILURE", "Campaign stub ledger failed passive read validation");
  }
  await input.retain({ caseId: host.caseId, attemptDigest, ledgerDigest });
  revalidate();
  return { attempt, attemptDigest, review, facts };
}
