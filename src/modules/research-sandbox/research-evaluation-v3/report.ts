import type { CampaignView } from "../research-campaign/contracts";
import { evaluationDigest, EvaluationRefusal, ratio, undefinedMetric, unknown, known, type Measurement, type StudyPlan } from "./contracts";
import { fixedPublicControls, assertFixedPilotReferences } from "./fixed-pilot";
import { projectCampaignMeasurements } from "./event-projection";
import { validateHistoricalGrade, type Postgrade } from "./evaluator";
import { exactMatch, slotBinding, studySlots, verifyPairedStudyPlan } from "./plan";

const median = (values: number[]) => { const sorted = [...values].sort((a, b) => a - b); const i = Math.floor(sorted.length / 2); return sorted.length % 2 ? sorted[i] : (sorted[i - 1] + sorted[i]) / 2; };
export function derivePairedReport(planRaw: StudyPlan, retained: readonly { campaign: CampaignView; grade: Postgrade | null }[]) {
  const plan = verifyPairedStudyPlan(planRaw);
  if (plan.purpose === "PUBLIC_PILOT_12") assertFixedPilotReferences(plan);
  const slots = studySlots(plan), seen = new Set<string>();
  const records = slots.map(slot => {
    const matches = retained.filter(r => r.campaign.envelope.evaluation?.pairId === slot.pairId && r.campaign.envelope.evaluation?.arm === slot.arm);
    if (matches.length > 1) throw new EvaluationRefusal("INTEGRITY", "Duplicate admitted arm");
    const r = matches[0];
    if (!r) return { taskId: slot.taskId, pairId: slot.pairId, arm: slot.arm, admission: "MISSING_RETAINED_ARM" as const, telemetry: null, grade: null };
    const binding = r.campaign.envelope.evaluation!;
    const { studyCommandId, ...projection } = binding as typeof binding & { studyCommandId?: string };
    void studyCommandId;
    if (!exactMatch(projection, slotBinding(plan, slot.taskId, slot.arm)) || r.campaign.contractDigest !== evaluationDigest(slot.task.contract) ||
      !exactMatch(r.campaign.envelope.total, plan.ceilings.total) || !exactMatch(r.campaign.envelope.perCall, plan.ceilings.perCall) ||
      !exactMatch(r.campaign.envelope.postgrade, plan.ceilings.postgrade) || r.campaign.envelope.requestedModel !== plan.requestedModel ||
      (r.campaign.envelope.requestedModelVersion ?? null) !== plan.requestedModelVersion || r.campaign.envelope.provider !== plan.requestedProvider ||
      r.campaign.envelope.stop.maxRounds !== plan.ceilings.maxRounds || r.campaign.envelope.stop.maxNoInformation !== plan.ceilings.maxRounds)
      throw new EvaluationRefusal("INTEGRITY", "Matched preregistration/exposure/ceilings drift");
    seen.add(r.campaign.id);
    const telemetry = projectCampaignMeasurements(r.campaign);
    if (r.grade) {
      validateHistoricalGrade(r.campaign, r.grade);
      if (r.grade.campaignId !== r.campaign.id || r.grade.preregistrationDigest !== plan.planDigest || r.grade.taskId !== slot.taskId) throw new EvaluationRefusal("INTEGRITY", "Cross-pair grade");
    }
    return { taskId: slot.taskId, pairId: slot.pairId, arm: slot.arm, admission: "RETAINED" as const, telemetry, grade: r.grade };
  });
  if (seen.size !== retained.length) throw new EvaluationRefusal("INTEGRITY", "Extraneous or duplicate campaign");
  const sources = new Set(retained.map(r => r.campaign.sourceBundleDigest));
  const deadlines = new Set(retained.map(r => r.campaign.envelope.stop.deadlineAt));
  if (sources.size > 1 || deadlines.size > 1) throw new EvaluationRefusal("INTEGRITY", "Paired source epoch or common deadline drift");
  const identities = records.map(r => r.telemetry && r.telemetry.actualModel.status === "KNOWN" && r.telemetry.actualModelVersion.status === "KNOWN"
    ? `${r.telemetry.actualModel.value}:${r.telemetry.actualModelVersion.value}` : null);
  const actualModelVersionEquality = identities.length && identities.every(i => i !== null) ? new Set(identities).size === 1 ? "KNOWN_EQUAL" : "KNOWN_DIFFERENT" : "UNKNOWN";
  const knownModels = records.flatMap(r => r.telemetry?.actualModel.status === "KNOWN" ? [r.telemetry.actualModel.value] : []);
  const knownVersions = records.flatMap(r => r.telemetry?.actualModelVersion.status === "KNOWN" ? [r.telemetry.actualModelVersion.value] : []);
  const identityMismatch = new Set(knownModels).size > 1 || new Set(knownVersions).size > 1 ||
    knownModels.some(model => model !== plan.requestedModel) || plan.requestedModelVersion !== null && knownVersions.some(version => version !== plan.requestedModelVersion);
  const summary = (arm: "DIRECT_WITH_TOOLS" | "METHOD_ASSISTED") => {
    const rows = records.filter(r => r.arm === arm);
    const accepted = rows.filter(r => r.grade?.status === "ACCEPTED_EXACT_SCOPE").length;
    const unresolved = rows.filter(r => !r.grade || ["UNAVAILABLE", "INCONCLUSIVE"].includes(r.grade.status)).length;
    const falseAccepts = plan.purpose === "PUBLIC_PILOT_12" ? rows.filter(r => r.grade?.status === "ACCEPTED_EXACT_SCOPE" && fixedPublicControls.find(t => t.id === r.taskId)?.valid === false).length : 0;
    const invalidControls = plan.purpose === "PUBLIC_PILOT_12" ? rows.filter(r => fixedPublicControls.find(t => t.id === r.taskId)?.valid === false).length : 0;
    const interventions = rows.flatMap(r => r.telemetry ? [r.telemetry.routinePrompts + r.telemetry.consequentialPrompts] : []);
    const complete = rows.every(r => r.telemetry?.accountingComplete && !r.telemetry.thresholdOvershoot && r.grade);
    return { arm, admittedDenominator: rows.length, retained: rows.filter(r => r.telemetry).length, accepted, unresolved,
      acceptedRate: ratio(accepted, rows.length), invalidControls, falseAccepts, falseAcceptanceRate: ratio(falseAccepts, invalidControls),
      medianInterventions: interventions.length === rows.length ? known(median(interventions), "DURABLE_PROMPT_EVENTS") : unknown<number>("MISSING_ARM_EVENTS"),
      accounting: complete ? "COMPLETE_CONTROLLED" : "INCOMPLETE", actualCost: unknown<number>("MISSING_PRICE_ATTESTED_VERSION_OR_DISAGGREGATED_USAGE") };
  };
  const direct = summary("DIRECT_WITH_TOOLS"), assisted = summary("METHOD_ASSISTED");
  const delta = assisted.accepted - direct.accepted;
  let interventionReduction: Measurement<number> = unknown("MISSING_INTERVENTION_OBSERVATIONS");
  if (direct.medianInterventions.status === "KNOWN" && assisted.medianInterventions.status === "KNOWN") interventionReduction = direct.medianInterventions.value === 0
    ? undefinedMetric("ZERO_LEGACY_OR_DIRECT_INTERVENTION_DENOMINATOR") : known((direct.medianInterventions.value - assisted.medianInterventions.value) / direct.medianInterventions.value, "SCRIPTED_DURABLE_PROMPTS_NOT_REAL_USER_MINUTES");
  const complete = direct.accounting === "COMPLETE_CONTROLLED" && assisted.accounting === "COMPLETE_CONTROLLED" && direct.unresolved === 0 && assisted.unresolved === 0;
  const threshold = complete && direct.falseAccepts + assisted.falseAccepts === 0 && (delta >= 2 || interventionReduction.status === "KNOWN" && interventionReduction.value >= .25 && delta >= 0);
  const body = { version: 3, preregistrationDigest: plan.planDigest, purpose: plan.purpose,
    intentionToTestPairs: plan.tasks.length, intentionToTestArms: plan.tasks.length * 2,
    records, arms: [direct, assisted], pairedAcceptedDifference: delta, interventionReduction,
    pilotRouting: plan.purpose !== "PUBLIC_PILOT_12" ? "NOT_ELIGIBLE_ARCHITECTURE_TRANSFER_ONLY" : identityMismatch ? "NOT_COMPARABLE_ATTESTED_IDENTITY"
      : complete ? threshold ? "SCRIPTED_THRESHOLD_MET_NOT_RELEASE" : "THRESHOLD_NOT_MET" : "INCONCLUSIVE_INCOMPLETE",
    liveModelExperiment: "NOT_RUN", statisticalSuperiority: "NOT_ESTABLISHED", externalUserAcceptance: "NOT_RUN",
    actualModelVersionEquality, identityComparability: identityMismatch ? "NOT_COMPARABLE_ATTESTED_IDENTITY" : actualModelVersionEquality === "KNOWN_EQUAL" ? "KNOWN_EQUAL_CONTROLLED_IDENTITY" : "UNKNOWN_ATTESTATION_LIMITATION",
    heldOut: false, blinding: "ARM_IDENTITY_REMOVED_FROM_POSTGRADER_CANDIDATE_PROJECTION_PROSE_MAY_REVEAL_METHOD",
    limitations: plan.purpose === "PUBLIC_PILOT_12" ? "TWELVE_PUBLIC_CONTROLLED_TASKS_MEASURE_SOFTWARE_NOT_POPULATION_AI_ABILITY_OR_RESEARCH_NOVELTY"
      : "SMALL_EXACT_DOMAIN_ARCHITECTURE_TRANSFER_NOT_PILOT_EFFICACY_OR_GENERAL_MATHEMATICAL_INTELLIGENCE" };
  return { ...body, reportDigest: evaluationDigest(body) };
}
