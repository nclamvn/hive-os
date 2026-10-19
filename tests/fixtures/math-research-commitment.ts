import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { digestMathPilotContract, resolveMathPilotContract } from "@/modules/research-sandbox/math-pilot";
import { admitResearchCommitment, commitmentWorkBinding, sealResearchCommitment, type ResearchCommitmentBinding } from "@/modules/research-sandbox/math-research-commitment";
import { mathCycleEventDigest, type MathCycleEventPayload } from "@/modules/research-sandbox/math-cycle";

export const commitmentRoot = resolveMathPilotContract({ caseType: "OPEN", statement: "For every positive integer parameter, determine whether the declared structural support relation holds.",
  definitions: "All parameters belong to the positive integers and witnesses belong to the declared support domain.",
  assumptions: "Exact logical deductions are required.", falsificationCriterion: "An exact aligned counterexample refutes only its registered predicate.",
  successCriterion: "A full independently verified proof is required.", exclusions: "Finite examples and reviewer votes do not constitute a universal proof." });
export const commitmentRootDigest = digestMathPilotContract(commitmentRoot), commitmentReviewDigest = "a".repeat(64), commitmentAttemptDigest = "b".repeat(64);
export const commitmentGap = "The exact structural root obligation is still open and requires a proof.";
export const commitmentTask = "Prove the committed complete-prime reproduction chain including every generation, cascade and terminal obligation.";
export const commitmentTask2 = "Prove the separately committed support implication preserving every declared quantified parameter and assumption.";
export const commitmentChoice = () => ({ mode: "REPRODUCTION" as const, milestone: "Complete the fixed reproduction obligation; not a local-family theorem",
  sourceDigest: sha256("approved-primary-source-identifier"), obligations: [commitmentTask, commitmentTask2].map((statement, i) => ({ id: `obligation-${i + 1}`,
    predicate: { statement, domain: "Every parameter in the exact complete-prime reproduction domain", orderedQuantifiers: ["FORALL_DECLARED_PARAMETERS", "EXISTS_REQUIRED_WITNESS"], assumptions: ["Declared root assumptions only"] },
    scope: "UNIVERSAL" as const, evidence: { kind: "UNIVERSAL_PROOF_UNSUPPORTED" as const },
    operations: ["PLANNER", "SOURCE_REVIEW", "VERIFIER", "PROOF_ATTEMPT", "CRITIC", "ADVERSARY"] })),
  maxNoClosure: 2, maxWork: 8, revision: "INITIAL" as const, expectedPreviousDigest: null, reason: "Human explicitly confirms the exact bounded reproduction scope" });
export const commitmentHost = (cycleId = "cycle-074") => ({ organizationId: "org", workspaceId: "workspace", rootCaseId: "root-case",
  rootContractDigest: commitmentRootDigest, rootReviewDigest: commitmentReviewDigest, cycleId, commandId: `command-${cycleId}`,
  approvedByUserId: "human", approvedAt: "2026-10-05T07:00:00.000Z" });
export const makeCommitment = (cycleId = "cycle-074") => sealResearchCommitment({ choice: commitmentChoice(), confirmed: true, host: commitmentHost(cycleId), previous: null });
export const commitmentUsage = { inputTokens: 5, cachedInputTokens: 0, outputTokens: 2, reasoningOutputTokens: 0 };
export function committedProposal(binding: ResearchCommitmentBinding, index = 0, gap = commitmentGap) {
  const o = binding.choice.obligations[index], token = admitResearchCommitment(binding, {});
  return { workBinding: commitmentWorkBinding(token, o.id), sourceGap: gap, hypothesis: `An exact support derivation for committed obligation ${index + 1} may resolve the missing quantified bridge.`,
    taskStatement: o.predicate.statement, falsificationPlan: "An aligned exact counterexample must invalidate the proposed support implication.",
    successEvidence: "A complete independently checked derivation retaining the exact quantifiers and assumptions.", rationale: "Attack the committed root obligation rather than an easier local family or arbitrary count.", exactSurveyPlan: null, structuralProbePlan: null, mixedCoreClaim: null };
}
export const commitmentAttempt = { providerName: "codex-local" as const, modelName: "gpt-6-sol", threadId: "root-solver", attemptType: "INCONCLUSIVE" as const,
  argument: "The complete reproduction bridge is still unproved; a conditional local family does not establish the requested full chain.",
  candidateCounterexample: null, selfChecks: [], limitations: ["No independent universal proof certificate"], usage: commitmentUsage };
const content = "The exact structural support obligation requires a complete independently verified proof, not a local narrowing.";
const dossierBody = { coverage: "PARTIAL_NOT_NOVELTY_CERTIFICATE" as const, sources: [{ id: "source", canonicalUri: "https://example.org/primary/commitment",
  title: "Synthetic source boundary fixture", authors: "Fixture author", publicationYear: 2025, version: "v1", captureMethod: "CURATED_PRIMARY_EXCERPT" as const,
  scope: "ROOT_DOMAIN" as const, content, contentDigest: sha256(content), exactQuote: content, startOffset: 0, endOffset: content.length }],
  discovery: { provider: "CROSSREF" as const, query: "structural support commitment", status: "COMPLETE" as const, candidates: [] } };
export const commitmentDossier = { ...dossierBody, dossierDigest: sha256(canonicalJson(dossierBody)) };
export type CommitmentTestEvent = { sequence: number; round: number; phase: string; payload: MathCycleEventPayload; previousDigest: string | null; digest: string };
export function commitmentEventChain(payloads: MathCycleEventPayload[]): CommitmentTestEvent[] {
  const result: CommitmentTestEvent[] = [];
  for (const payload of payloads) { const previousDigest = result.at(-1)?.digest ?? null;
    result.push({ sequence: result.length + 1, round: payload.round, phase: payload.phase, payload, previousDigest, digest: mathCycleEventDigest(previousDigest, payload) }); }
  return result;
}
