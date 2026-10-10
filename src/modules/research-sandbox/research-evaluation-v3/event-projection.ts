import { campaignDigest, initialCampaignState, reduceCampaignEvent } from "../research-campaign/ledger";
import type { CampaignView, Resources } from "../research-campaign/contracts";
import { prepareProblemContract } from "../research-core-v3";
import { boundedObservation, evaluationDigest, EvaluationRefusal, known, unknown, type Measurement } from "./contracts";

/** Integrity projection, NOT a mathematical receipt minting function.
 * Production callers supply the authenticated loadCampaignView result. Even a
 * coherently forged caller chain cannot be used to close a scored obligation:
 * the postgrader re-admits retained bytes and invokes the independent checker.
 */
export function projectCampaignMeasurements(raw: CampaignView) {
  const v = boundedObservation(raw, 1048576, 1024) as CampaignView;
  if (!v.complete || !Array.isArray(v.events) || !v.events.length || v.events.length > 256 ||
    v.eventCut.sequence !== v.events.length || prepareProblemContract(v.contract).contractDigest !== v.contractDigest ||
    campaignDigest(v.envelope) !== v.envelopeDigest) throw new EvaluationRefusal("INTEGRITY", "Incomplete or mismatched campaign projection");
  let state = initialCampaignState(v.envelope), tail: string | null = null;
  for (const [index, event] of v.events.entries()) {
    const body = { campaignId: v.id, organizationId: v.organizationId, workspaceId: v.workspaceId,
      sequence: event.sequence, eventType: event.eventType, actionKey: event.actionKey, payload: event.payload,
      previousDigest: event.previousDigest, jobId: event.jobId, createdAt: event.createdAt };
    if (event.campaignId !== v.id || event.sequence !== index + 1 || event.previousDigest !== tail ||
      campaignDigest(body) !== event.digest || index === 0 && event.eventType !== "APPROVED") throw new EvaluationRefusal("INTEGRITY", "Campaign event chain drift");
    state = reduceCampaignEvent(state, v.envelope, event.eventType, event.payload.detail);
    if (campaignDigest(state) !== campaignDigest(event.payload.state)) throw new EvaluationRefusal("INTEGRITY", "Campaign event state drift");
    tail = event.digest;
  }
  if (tail !== v.eventCut.digest || campaignDigest(state) !== campaignDigest(v.state) || state.status !== v.status) throw new EvaluationRefusal("INTEGRITY", "Campaign cut or final state changed");
  const starts = v.events.filter(e => e.eventType === "STARTED");
  const results = v.events.filter(e => e.eventType === "RESULT_RETAINED");
  const knownTokens = results.reduce((sum, e) => sum + (e.payload.detail.observedTokens === null ? 0 : Number(e.payload.detail.observedTokens)), 0);
  const unknownUsageActions = starts.length - results.length + results.filter(e => e.payload.detail.observedTokens === null).length;
  const actualModels = results.map(e => e.payload.detail.attestedModel);
  const actualVersions = results.map(e => e.payload.detail.attestedModelVersion);
  const identity = (values: unknown[]): Measurement<string> => values.length === starts.length && values.length > 0 &&
    values.every(value => typeof value === "string" && value.length > 0) && new Set(values).size === 1
    ? known(String(values[0]), "TRANSPORT_ATTESTATION") : unknown("MISSING_OR_MIXED_ACTUAL_IDENTITY");
  const terminalEvent = v.events.find(e => ["COMPLETED", "FAILED", "RESOURCE_STOP"].includes(e.payload.state.status));
  const first = Date.parse(v.events[0].createdAt), last = Date.parse((terminalEvent ?? v.events.at(-1)!).createdAt);
  const terminal = !!terminalEvent;
  const wall = Number.isFinite(first) && Number.isFinite(last) && last >= first
    ? known(last - first, terminal ? "DURABLE_APPROVAL_TO_TERMINAL_CUT" : "DURABLE_APPROVAL_TO_OPEN_CUT") : unknown<number>("INVALID_TIMESTAMPS");
  const active = results.map(e => e.payload.detail.elapsedMilliseconds);
  const activeProcessing = active.length === starts.length && active.length > 0 && active.every(n => typeof n === "number" && Number.isFinite(n) && n >= 0)
    ? known(active.reduce<number>((s, n) => s + Number(n), 0), "HOST_PROVIDER_RETURN_WINDOW_INCLUDING_SOURCE_SCAN_AND_RETENTION") : unknown<number>("RETURN_WINDOW_NOT_RETAINED_FOR_EVERY_STARTED_ACTION");
  const queue = starts.at(0)?.payload.detail.queueLatencyMilliseconds;
  const queueLatency = Number.isSafeInteger(queue) && Number(queue) >= 0 ? known(Number(queue), "FIRST_STAGE_DURABLE_JOB_CREATED_TO_FIRST_CLAIM") : unknown<number>("FIRST_STAGE_QUEUE_BOUNDARIES_NOT_RETAINED");
  const checks = v.events.filter(e => e.eventType === "VERIFIED");
  const observedCheckerOperations = checks.reduce((s, e) => s + Number((e.payload.detail.receipt as { operations: number }).operations), 0);
  const spent = structuredClone(state.spent) as Resources;
  for (const amount of [knownTokens, unknownUsageActions, observedCheckerOperations]) if (!Number.isSafeInteger(amount) || amount < 0) throw new EvaluationRefusal("INTEGRITY", "Invalid event accounting");
  return { campaignId: v.id, cut: v.eventCut, cutDigest: evaluationDigest(v.eventCut), status: v.status,
    authorityEpoch: v.authorityEpoch, requestedModel: v.envelope.requestedModel,
    actualModel: identity(actualModels), actualModelVersion: identity(actualVersions),
    dispatchFences: known(starts.length, "DURABLE_START_NOT_PROOF_PROVIDER_INVOKED"),
    retainedReturns: known(results.length, "DURABLE_PROVIDER_RETURN_RECORDS"),
    actualCalls: unknown<number>("START_IS_NOT_INVOCATION_LOG_AND_RETURNLESS_CALLS_UNATTESTED"), knownTokens,
    unknownUsageActions, tokenUsage: unknownUsageActions ? unknown<number>("INCOMPLETE_USAGE_INCLUDING_STARTED_WITHOUT_RETURN") : known(knownTokens, "CONTROLLED_TRANSPORT_SIMULATED_TOKENS"),
    reservations: spent, observedCheckerOperations, accountingComplete: state.accountingComplete && unknownUsageActions === 0,
    thresholdOvershoot: Math.max(0, knownTokens - v.envelope.total.tokens),
    wallMilliseconds: wall, activeProcessingMilliseconds: activeProcessing,
    pureCpuMilliseconds: unknown<number>("CPU_PROFILE_NOT_RETAINED"), queueLatencyMilliseconds: queueLatency, queueCoverage: "FIRST_STAGE_ONLY",
    routinePrompts: state.routinePrompts, consequentialPrompts: state.consequentialPrompts,
    userMinutes: unknown<number>("NO_ATTRIBUTABLE_SELF_REPORT"), monetaryCost: unknown<number>("NO_ACTUAL_MODEL_VERSION_PRICE_AND_DISAGGREGATED_USAGE"),
    recoveries: state.replacements, verifierReplays: state.verifierReplays, diagnosticIncidents: state.diagnosticSpent.incidents,
    noInformation: state.noInformation, rounds: state.rounds,
    postgradeReservations: structuredClone(state.postgradeSpent), postgradeActions: state.postgradeActions,
    obligationDelta: state.closure?.status === "CLOSED_EXACT_SCOPE" ? 1 : 0,
    scope: "DURABLE_SOFTWARE_TELEMETRY_NOT_FRESH_MATHEMATICAL_AUTHORITY" as const };
}
