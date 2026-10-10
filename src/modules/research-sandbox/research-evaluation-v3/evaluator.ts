import type { ExactClosure, HostVerifierReceipt } from "../research-core-v3/types";
import { evaluationDigest, EvaluationRefusal } from "./contracts";
import type { CampaignView } from "../research-campaign/contracts";
import { prepareProblemContract } from "../research-core-v3";

export interface Postgrade {
  version: 3; campaignId: string; preregistrationDigest: string; taskId: string;
  artifactDigest: string; candidateDigest: string | null; cutDigest: string; actionId: string;
  status: "ACCEPTED_EXACT_SCOPE" | "REJECTED" | "INCONCLUSIVE" | "UNAVAILABLE";
  receipt: HostVerifierReceipt | null; closure: ExactClosure | null;
  reason: string; accountingPool: "SEPARATE_PREREGISTERED_POSTGRADER";
  wholeProblemSolved: false; noveltyEstablished: false; externalAcceptance: "NOT_RUN";
}
// This function records a trusted fresh result, not a deserialized receipt grant.
// Only kernel invokes it after same-host verify/projectClosure. Reports load its
// authenticated event and artifact; arm-produced PASS/majority is ignored.
export function gradeRecord(input: Omit<Postgrade, "version" | "status" | "accountingPool" | "wholeProblemSolved" | "noveltyEstablished" | "externalAcceptance">): Postgrade {
  if (input.receipt && (!input.closure || input.closure.receiptDigest !== input.receipt.receiptDigest || input.candidateDigest !== input.receipt.candidateDigest)) throw new EvaluationRefusal("INTEGRITY", "Postgrade receipt scope mismatch");
  if (input.closure && (!input.receipt || input.closure.wholeProblemSolved !== false || input.closure.noveltyEstablished !== false || input.closure.externalAcceptance !== "NOT_RUN" ||
    input.closure.status === "CLOSED_EXACT_SCOPE" && input.receipt.result !== "VERIFIED")) throw new EvaluationRefusal("INTEGRITY", "Unsafe historical closure classification");
  if (input.receipt) { const { receiptDigest, ...body } = input.receipt;
    if (evaluationDigest(body) !== receiptDigest) throw new EvaluationRefusal("INTEGRITY", "Historical receipt body digest changed"); }
  const status = !input.receipt ? "UNAVAILABLE" : input.closure?.status === "CLOSED_EXACT_SCOPE" ? "ACCEPTED_EXACT_SCOPE"
    : input.receipt.result === "REJECTED" ? "REJECTED" : "INCONCLUSIVE";
  return { ...input, version: 3, status, accountingPool: "SEPARATE_PREREGISTERED_POSTGRADER", wholeProblemSolved: false,
    noveltyEstablished: false, externalAcceptance: "NOT_RUN" };
}
export function verifyGradeRecord(raw: Postgrade): void {
  const { version, status, accountingPool, wholeProblemSolved, noveltyEstablished, externalAcceptance, ...input } = raw;
  if (evaluationDigest(gradeRecord(input)) !== evaluationDigest(raw) || version !== 3 || !status || accountingPool !== "SEPARATE_PREREGISTERED_POSTGRADER" ||
    wholeProblemSolved !== false || noveltyEstablished !== false || externalAcceptance !== "NOT_RUN") throw new EvaluationRefusal("INTEGRITY", "Stored grade changed");
}

/** Historical provenance only: never imports JSON into a fresh host's authority.
 * Caller supplies the authenticated complete ledger. Every receipt is tied to
 * the pre-reservation cut and the exact retained original artifact at that cut.
 */
export function validateHistoricalGrade(view: CampaignView, grade: Postgrade): void {
  verifyGradeRecord(grade);
  const cut = view.events.find(e => e.digest === grade.cutDigest);
  const reserve = view.events.find(e => e.eventType === "EVALUATION_RESERVED" && e.payload.detail.actionId === grade.actionId);
  const start = view.events.find(e => e.eventType === "EVALUATION_STARTED" && e.payload.detail.actionId === grade.actionId);
  const retained = view.events.find(e => e.eventType === "EVALUATION_RETAINED" && e.payload.detail.actionId === grade.actionId);
  const binding = view.envelope.evaluation;
  if (grade.campaignId !== view.id || grade.preregistrationDigest !== (binding?.preregistrationDigest ?? view.envelopeDigest) ||
    grade.taskId !== (binding?.taskId ?? view.contract.id) || !cut || !reserve || !start || !retained ||
    reserve.sequence !== cut.sequence + 1 || start.sequence <= reserve.sequence || retained.sequence <= start.sequence ||
    reserve.payload.detail.cutDigest !== cut.digest || start.payload.detail.cutDigest !== cut.digest || retained.payload.detail.cutDigest !== cut.digest ||
    retained.payload.detail.gradeDigest !== evaluationDigest(grade) || evaluationDigest(retained.payload.detail.grade) !== evaluationDigest(grade))
    throw new EvaluationRefusal("INTEGRITY", "Historical postgrade cut/action/provenance changed");
  const stage = cut.payload.state.stage;
  const artifact = stage?.candidateDigest ?? evaluationDigest({ missing: true });
  if (grade.artifactDigest !== artifact || grade.candidateDigest !== null && grade.candidateDigest !== artifact)
    throw new EvaluationRefusal("INTEGRITY", "Historical grade artifact changed");
  if (!grade.receipt) return;
  const r = grade.receipt, prepared = prepareProblemContract(view.contract), obligation = prepared.contract.obligations[0];
  if (!stage || r.contractDigest !== view.contractDigest || r.rootId !== view.contract.rootId || r.obligationId !== obligation.id ||
    r.predicateDigest !== evaluationDigest(obligation.predicate) || r.inputDigest !== prepared.inputDigest ||
    r.candidateDigest !== artifact || r.attemptId !== stage.attemptId || r.adapterId !== view.contract.domain.adapterId ||
    r.adapterVersion !== view.contract.domain.adapterVersion || r.sourceBundleDigest !== view.sourceBundleDigest ||
    r.runtimeSourceDigest !== stage.runtimeSourceDigest || r.checkerSourceDigest !== stage.checkerSourceDigest ||
    r.authorityEpoch !== view.authorityEpoch || r.acceptanceType !== obligation.acceptanceType || grade.closure?.obligationId !== obligation.id ||
    grade.closure.acceptanceType !== r.acceptanceType || evaluationDigest(grade.closure.checkedScope) !== evaluationDigest(r.checkedScope))
    throw new EvaluationRefusal("INTEGRITY", "Historical postgrade exact checker binding changed");
}
