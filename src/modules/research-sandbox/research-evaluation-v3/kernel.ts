import { createHash, randomUUID } from "node:crypto";
import { performance } from "node:perf_hooks";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { executeDurableCommand, CommandEffectError } from "@/modules/command-runtime";
import { organizationIdForWorkspace, requireWorkspaceAuthorization } from "@/modules/authorization";
import type { WorkspaceContext } from "@/modules/identity-workspace";
import { withOrganizationTenant } from "@/server/tenant-context";
import { getObjectStorage } from "@/server/storage";
import { createHostVerifier, prepareProblemContract, admitCandidate, resolveDomainAdapter, applicableDomainMethods } from "../research-core-v3";
import { boundedJson } from "../research-core-v3/bounded-json";
import { requestResearchCampaign, getResearchCampaign } from "../research-campaign/commands";
import { appendCampaignEvent, loadCampaignView, lockCampaign } from "../research-campaign/ledger";
import { assertControlledCampaignEnvironment, loadInstalledCampaignBundle } from "../research-campaign/source-bundle";
import { zeroResources, type CampaignView, type Resources } from "../research-campaign/contracts";
import { boundedObservation, evaluationDigest, EvaluationRefusal, type StudyPlan } from "./contracts";
import { verifyPairedStudyPlan, studySlots, slotBinding } from "./plan";
import { gradeRecord, validateHistoricalGrade, type Postgrade } from "./evaluator";
import { derivePairedReport } from "./report";
import { buildBlindedDossier, verifyBlindedDossier, DOSSIER_BYTES } from "./dossier";
import { validateFeedback } from "./feedback";
import { assertFixedPilotReferences } from "./fixed-pilot";

const TERMINAL = ["COMPLETED", "RESOURCE_STOP", "FAILED"];
const POST_READ = 6 * 1048576; // bounded bootstrap/history + two source scans + candidate
const POST_WRITE = 1048576;
function assertStudyKey(key: string) { if (typeof key !== "string" || !/^[A-Za-z0-9:._-]{1,160}$/.test(key)) throw new EvaluationRefusal("AUTHORITY", "Invalid immutable study action identity"); }

/** Plan is durably committed before any child approval/effect. Partial approval
 * failures remain planned slots; no pair is omitted from intention-to-test.
 * Repeating the plan/child command identity cannot mint a second campaign.
 */
export async function requestPairedStudy(ctx: WorkspaceContext, input: { plan: StudyPlan; missionId: string; idempotencyKey: string }) {
  assertControlledCampaignEnvironment(); assertStudyKey(input.idempotencyKey);
  const plan = verifyPairedStudyPlan(input.plan);
  if (plan.purpose === "PUBLIC_PILOT_12") assertFixedPilotReferences(plan);
  await requireWorkspaceAuthorization(ctx, "research.request", input.missionId);
  const planBytes = canonicalJson(plan);
  if (Buffer.byteLength(planBytes) > 60000) throw new EvaluationRefusal("RESOURCE", "Durable study registration byte bound");
  const preregistration = await executeDurableCommand(ctx, { commandType: "research.study.v3.preregister", idempotencyKey: input.idempotencyKey,
    requiredCapability: "research.request", missionId: input.missionId, payload: { planBytes, planDigest: plan.planDigest, missionId: input.missionId } }, async (tx, command) => {
    if (!await tx.mission.findFirst({ where: { id: input.missionId, workspaceId: command.workspaceId } })) throw new CommandEffectError("NOT_FOUND", "Study mission unavailable");
    return { outcome: { planDigest: plan.planDigest, plannedPairs: plan.tasks.length, plannedArms: plan.tasks.length * 2,
      deadlineAt: new Date(Date.now() + plan.ceilings.wallMilliseconds).toISOString(), provenance: "CONTROLLED_ENGINEERING_NOT_LIVE" },
      outbox: [{ topic: "research.study.v3.preregistered", aggregateType: "CommandRecord", aggregateId: command.commandId, payload: { planDigest: plan.planDigest } }] };
  });
  if (preregistration.status !== "SUCCEEDED") return { preregistration, admissions: [] };
  const admissions = [];
  // Preregistration atomically retains one common deadline BEFORE any child.
  // Failed initial admissions and duplicate study commands cannot refresh it.
  const deadlineAt = String(preregistration.outcome.deadlineAt);
  for (const slot of studySlots(plan)) {
    const methods = applicableDomainMethods(prepareProblemContract(slot.task.contract),
      prepareProblemContract(slot.task.contract).contract.obligations[0].id).map(card => card.id);
    admissions.push(await requestResearchCampaign(ctx, { idempotencyKey: `study:${preregistration.commandId}:${slot.order}`, missionId: input.missionId,
      contract: slot.task.contract, envelope: { version: 3, provider: "CONTROLLED_LOCAL", requestedModel: plan.requestedModel,
        ...(plan.requestedModelVersion ? { requestedModelVersion: plan.requestedModelVersion } : {}), methods: methods.slice(0, plan.ceilings.maxRounds),
        total: plan.ceilings.total, perCall: plan.ceilings.perCall, stop: { maxRounds: plan.ceilings.maxRounds, maxNoInformation: plan.ceilings.maxRounds, deadlineAt },
        recovery: { replacementDeliveries: 1, verifierReplays: 1, diagnosticIncidents: 2, diagnosticReadBytes: 2097152, diagnosticMilliseconds: 20000 },
        evaluation: { ...slotBinding(plan, slot.taskId, slot.arm), studyCommandId: preregistration.commandId }, postgrade: plan.ceilings.postgrade } }));
  }
  return { preregistration, admissions };
}
export async function readStudyPlan(ctx: WorkspaceContext, studyCommandId: string): Promise<StudyPlan> {
  await requireWorkspaceAuthorization(ctx, "research.read");
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  return withOrganizationTenant(organizationId, ctx.user.id, async tx => {
    const command = await tx.commandRecord.findFirst({ where: { id: studyCommandId, organizationId, workspaceId: ctx.workspace.id,
      commandType: "research.study.v3.preregister", status: "SUCCEEDED" } });
    if (!command || evaluationDigest(command.payload) !== command.payloadHash) throw new EvaluationRefusal("INTEGRITY", "Authenticated study registration unavailable");
    const payload = boundedJson(command.payload, 524288, 512) as unknown as { planBytes: string; planDigest: string };
    const plan = verifyPairedStudyPlan(payload.planBytes);
    if (plan.planDigest !== payload.planDigest) throw new EvaluationRefusal("INTEGRITY", "Canonical study body changed");
    return plan;
  });
}
async function reserveObservation(ctx: WorkspaceContext, id: string, kind: "EVALUATION" | "DOSSIER" | "FEEDBACK", idempotencyKey: string, resources: Resources) {
  assertControlledCampaignEnvironment(); assertStudyKey(idempotencyKey);
  await requireWorkspaceAuthorization(ctx, "research.review");
  const result = await executeDurableCommand(ctx, { commandType: `research.study.v3.${kind.toLowerCase()}.reserve`, idempotencyKey,
    requiredCapability: "research.review", payload: { campaignId: id, kind, allowanceDigest: evaluationDigest(resources) } }, async (tx, command) => {
    const row = await lockCampaign(tx, command.organizationId, id);
    const view = await loadCampaignView(tx, row);
    if (row.workspaceId !== command.workspaceId || row.revokedAt || !TERMINAL.includes(row.status)) throw new CommandEffectError("INVALID_TRANSITION", "Postgrade requires sealed terminal unrevoked campaign");
    const actionId = randomUUID(), cutDigest = view.eventCut.digest;
    await appendCampaignEvent(tx, row, `${kind}_RESERVED`, `${id}:${actionId}:reserved`, { actionId, cutDigest, resources });
    return { outcome: { actionId, cutDigest }, outbox: [{ topic: "research.study.v3.observation-reserved", aggregateType: "ResearchCampaign", aggregateId: id, payload: { actionId, kind, cutDigest } }] };
  });
  if (result.status !== "SUCCEEDED") throw new EvaluationRefusal("RESOURCE", "Postgrade reservation refused");
  // An already-retained reservation MUST NOT repeat effects. Inspect current
  // pending action; completed action is read through its event, never replayed.
  const current = await getResearchCampaign(ctx, id);
  const pending = current.state.postgradePending;
  if (!pending || pending.actionId !== result.outcome.actionId || pending.cutDigest !== result.outcome.cutDigest) throw new EvaluationRefusal("AUTHORITY", "Observation command already consumed or changed");
  const cut = current.events.find(e => e.digest === pending.cutDigest);
  if (!cut) throw new EvaluationRefusal("INTEGRITY", "Observation pre-effect cut unavailable");
  const snapshot: CampaignView = { ...current, events: current.events.slice(0, cut.sequence), state: cut.payload.state,
    status: cut.payload.state.status, eventCut: { sequence: cut.sequence, digest: cut.digest } };
  await withOrganizationTenant(current.organizationId, ctx.user.id, async tx => {
    const row = await lockCampaign(tx, current.organizationId, id);
    if (row.workspaceId !== ctx.workspace.id || row.revokedAt) throw new EvaluationRefusal("AUTHORITY", "Observation authority changed before effects");
    await appendCampaignEvent(tx, row, `${kind}_STARTED`, `${id}:${String(result.outcome.actionId)}:started`,
      { actionId: String(result.outcome.actionId), cutDigest: String(result.outcome.cutDigest) });
  });
  return { actionId: String(result.outcome.actionId), cutDigest: String(result.outcome.cutDigest), snapshot };
}
async function finishObservation(ctx: WorkspaceContext, reservation: Awaited<ReturnType<typeof reserveObservation>>, kind: "EVALUATION_RETAINED" | "DOSSIER_EXPORTED" | "FEEDBACK_RETAINED", detail: Record<string, unknown>) {
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  return withOrganizationTenant(organizationId, ctx.user.id, async tx => {
    const row = await lockCampaign(tx, organizationId, reservation.snapshot.id);
    if (row.workspaceId !== ctx.workspace.id || row.revokedAt) throw new EvaluationRefusal("AUTHORITY", "Observation authority revoked");
    return appendCampaignEvent(tx, row, kind, `${row.id}:${reservation.actionId}:retained`, { ...detail, actionId: reservation.actionId, cutDigest: reservation.cutDigest });
  });
}
async function readCandidate(view: CampaignView) {
  const stage = view.state.stage;
  if (!stage?.candidateKey || !stage.candidateDigest || stage.candidateBytes === null) throw new EvaluationRefusal("INTEGRITY", "No sealed candidate for independent postgrade");
  const expectedKey = `${view.workspaceId}/research-campaign/${view.id}/${stage.attemptId}.json`;
  if (stage.candidateKey !== expectedKey) throw new EvaluationRefusal("INTEGRITY", "Candidate storage path outside exact action");
  const adapter = resolveDomainAdapter(view.contract.domain.adapterId, view.contract.domain.adapterVersion);
  const storage = getObjectStorage(), head = await storage.head(expectedKey);
  if (!head || head.size !== stage.candidateBytes || head.size > adapter.limits.maxCandidateBytes) throw new EvaluationRefusal("INTEGRITY", "Candidate byte boundary changed");
  const bytes = await storage.get(expectedKey, { maxBytes: adapter.limits.maxCandidateBytes });
  if (!bytes || bytes.byteLength !== stage.candidateBytes || createHash("sha256").update(bytes).digest("hex") !== stage.candidateDigest) throw new EvaluationRefusal("INTEGRITY", "Candidate artifact seal changed");
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}
export async function evaluateRetainedPair(ctx: WorkspaceContext, input: { campaignId: string; idempotencyKey: string }) {
  const initial = await getResearchCampaign(ctx, input.campaignId);
  const adapter = resolveDomainAdapter(initial.contract.domain.adapterId, initial.contract.domain.adapterVersion);
  const resources = { ...zeroResources(), checkerOperations: adapter.limits.maxOperations,
    computeMilliseconds: 20000 + adapter.limits.maxCheckMilliseconds, readBytes: POST_READ, writeBytes: POST_WRITE };
  const reservation = await reserveObservation(ctx, input.campaignId, "EVALUATION", input.idempotencyKey, resources), view = reservation.snapshot;
  const started = performance.now(), binding = view.envelope.evaluation;
  const plan = binding?.studyCommandId ? await readStudyPlan(ctx, binding.studyCommandId) : null;
  if (binding && (!plan || plan.planDigest !== binding.preregistrationDigest)) throw new EvaluationRefusal("INTEGRITY", "Study/campaign registration drift");
  let receipt = null, closure = null, candidateDigest = null, reason = "NO_CHECKED_RESULT";
  let artifactDigest = view.state.stage?.candidateDigest ?? evaluationDigest({ missing: true });
  try {
    const bundle = await loadInstalledCampaignBundle();
    if (bundle.sourceBundleDigest !== view.sourceBundleDigest) throw new EvaluationRefusal("INTEGRITY", "Postgrader source bundle drift");
    const originalBytes = await readCandidate(view), prepared = prepareProblemContract(view.contract);
    const candidate = admitCandidate(prepared, view.contract.obligations[0].id, originalBytes);
    candidateDigest = candidate.candidateDigest; artifactDigest = candidate.candidateDigest;
    let reserved = false;
    const verifier = createHostVerifier({ ...bundle, authorityEpoch: view.authorityEpoch, reserveCheck: check => {
      if (reserved || check.limits.maxOperations > resources.checkerOperations || check.inputDigest !== prepared.inputDigest || check.candidateDigest !== candidate.candidateDigest || check.attemptId !== view.state.stage!.attemptId) throw new EvaluationRefusal("AUTHORITY", "Fresh checker must consume exact durable reservation");
      reserved = true;
    } });
    receipt = verifier.verify({ prepared, obligationId: prepared.contract.obligations[0].id, candidate,
      attemptId: view.state.stage!.attemptId, inputDigest: prepared.inputDigest });
    closure = verifier.projectClosure(prepared, prepared.contract.obligations[0].id, receipt);
    const after = await loadInstalledCampaignBundle();
    if (after.sourceBundleDigest !== bundle.sourceBundleDigest || performance.now() - started > resources.computeMilliseconds) throw new EvaluationRefusal("INTEGRITY", "Source or cooperative postgrade deadline changed");
    reason = receipt.reason;
  } catch (error) {
    receipt = null; closure = null;
    reason = error instanceof EvaluationRefusal ? error.code : "CHECKER_OR_RESOURCE_REFUSED";
  }
  const grade = gradeRecord({ campaignId: view.id, preregistrationDigest: plan?.planDigest ?? view.envelopeDigest, taskId: binding?.taskId ?? view.contract.id,
    artifactDigest, candidateDigest, cutDigest: reservation.cutDigest, actionId: reservation.actionId, receipt, closure, reason });
  if (Buffer.byteLength(canonicalJson(grade)) > 262144) throw new EvaluationRefusal("RESOURCE", "Bounded postgrade result exceeded");
  await finishObservation(ctx, reservation, "EVALUATION_RETAINED", { grade, gradeDigest: evaluationDigest(grade),
    observedComputeMilliseconds: performance.now() - started, resources, provenance: "FRESH_HOST_CHECKER_NOT_ARM_VOTE" });
  return grade;
}
function retainedGrade(view: CampaignView): Postgrade | null {
  const found = view.events.filter(e => e.eventType === "EVALUATION_RETAINED").at(-1);
  if (!found) return null;
  const grade = boundedObservation(found.payload.detail.grade, 262144, 256) as Postgrade;
  validateHistoricalGrade(view, grade);
  if (evaluationDigest(grade) !== found.payload.detail.gradeDigest || grade.actionId !== found.payload.detail.actionId || grade.cutDigest !== found.payload.detail.cutDigest) throw new EvaluationRefusal("INTEGRITY", "Retained grade event changed");
  return grade;
}
export async function getRetainedCampaignGrade(ctx: WorkspaceContext, campaignId: string) {
  return retainedGrade(await getResearchCampaign(ctx, campaignId));
}
export async function getCampaignEvidenceObservation(ctx: WorkspaceContext, campaignId: string) {
  const campaign = await getResearchCampaign(ctx, campaignId);
  return { campaign, grade: retainedGrade(campaign) };
}
export async function getPairedStudyReport(ctx: WorkspaceContext, studyCommandId: string) {
  const plan = await readStudyPlan(ctx, studyCommandId), organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  const views = await withOrganizationTenant(organizationId, ctx.user.id, async tx => {
    const rows = await tx.researchCampaign.findMany({ where: { organizationId, workspaceId: ctx.workspace.id,
      envelope: { path: ["evaluation", "studyCommandId"], equals: studyCommandId } }, take: 25 });
    if (rows.length > 24) throw new EvaluationRefusal("INTEGRITY", "Study arm count exceeded");
    return Promise.all(rows.map(row => loadCampaignView(tx, row)));
  });
  return derivePairedReport(plan, views.map(campaign => ({ campaign, grade: retainedGrade(campaign) })));
}
export async function exportBlindedDossier(ctx: WorkspaceContext, input: { campaignId: string; idempotencyKey: string }) {
  const resources = { ...zeroResources(), readBytes: 2097152, writeBytes: DOSSIER_BYTES, computeMilliseconds: 10000 };
  const reservation = await reserveObservation(ctx, input.campaignId, "DOSSIER", input.idempotencyKey, resources), view = reservation.snapshot;
  const grade = retainedGrade(view);
  if (!grade) throw new EvaluationRefusal("AUTHORITY", "Export requires retained independent postgrade");
  const dossier = buildBlindedDossier(view, grade, grade.receipt ? await readCandidate(view) : null);
  await finishObservation(ctx, reservation, "DOSSIER_EXPORTED", { dossier, dossierDigest: dossier.dossierDigest, resources });
  return dossier;
}
export async function importFeedback(ctx: WorkspaceContext, input: { campaignId: string; idempotencyKey: string; feedback: unknown }) {
  const boundedFeedback = boundedObservation(input.feedback, 16384, 64);
  const resources = { ...zeroResources(), readBytes: 2097152, writeBytes: 32768, computeMilliseconds: 10000 };
  const reservation = await reserveObservation(ctx, input.campaignId, "FEEDBACK", input.idempotencyKey, resources);
  const event = reservation.snapshot.events.filter(e => e.eventType === "DOSSIER_EXPORTED").at(-1);
  if (!event) throw new EvaluationRefusal("AUTHORITY", "Consent feedback requires exact persisted export");
  const dossier = verifyBlindedDossier(event.payload.detail.dossier);
  const feedback = validateFeedback(boundedFeedback, dossier, ctx.user.id);
  await finishObservation(ctx, reservation, "FEEDBACK_RETAINED", { feedback, feedbackDigest: feedback.feedbackDigest, resources,
    authenticatedUserId: ctx.user.id, realUserAcceptance: "NOT_RUN" });
  return feedback;
}
