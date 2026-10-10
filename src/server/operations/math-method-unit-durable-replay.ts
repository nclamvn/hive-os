import "server-only";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { LRC_METHOD_UNIT_DIGEST, lrcMethodUnitFiniteEvidenceSchema, type LrcMethodUnitFiniteEvidence } from "@/modules/research-sandbox/math-lrc-method-unit";
import { lrcMethodUnitLedgerSchema, lrcMethodUnitAgentReportSchema, validateRecordedLrcMethodUnitReview } from "@/modules/research-sandbox/math-lrc-method-unit-review";
import { lrcMethodUnitLiveEvidenceSchema, assertLrcMethodUnitAttemptBinding, lrcMethodUnitSolverMathematics,
  validatePreparedLrcMethodUnitInput } from "@/modules/research-sandbox/math-lrc-method-unit-live";
import { replayLrcShiftFiniteCertificate, LRC_SHIFT_REPLAY_VERSION } from "@/modules/research-sandbox/math-lrc-shift-replay";
import { durableJson, durableDigest, parseDurableBytes, durableHashSchema, lrcDurableBindingSchema, lrcDurableDescriptorSchema,
  lrcDurableMetricsSchema, lrcPreCriticReceiptSchema, lrcPostLedgerReceiptSchema, type LrcDurableBinding, type LrcDurableDescriptor,
  type LrcPreCriticReceipt, type LrcPostLedgerReceipt } from "@/modules/research-sandbox/math-lrc-durable-replay";
import { MathDiagnosticCaptureV2Store, type LrcCaptureV2Handle } from "./math-diagnostic-capture-v2";

const originalPath = "src/modules/research-sandbox/math-lrc-method-unit.ts";
const replayPath = "src/modules/research-sandbox/math-lrc-shift-replay.ts";
const limits = Object.freeze({ milliseconds: 5000, operations: 2000000, bytes: 32768 });
const ceiling = Object.freeze({ scope: "FINITE_ONLY" as const, globalLrc: "NOT_ESTABLISHED" as const,
  realTime: "NOT_ESTABLISHED" as const, formal: "NOT_ESTABLISHED" as const, external: "NOT_ESTABLISHED" as const,
  novelty: "NOT_ESTABLISHED" as const });
type Metrics = z.infer<typeof lrcDurableMetricsSchema>;
type Purpose = "ACTIVE_CAPTURE" | "POST_COMMIT";
const retainedSchema = z.object({ binding: lrcDurableBindingSchema, solverStatus: z.literal("SUCCEEDED"),
  reviewStatus: z.literal("SUCCEEDED"), contractDigest: durableHashSchema, attempt: z.unknown(), ledger: z.unknown(),
  ledgerDigest: durableHashSchema, review: z.unknown(), reviewDigest: durableHashSchema,
  dossier: z.unknown(), dossierDigest: durableHashSchema, workerResult: z.unknown(), workerResultDigest: durableHashSchema,
  roleInputDigests: z.tuple([durableHashSchema, durableHashSchema, durableHashSchema]),
  preparedByteDigests: z.tuple([durableHashSchema, durableHashSchema, durableHashSchema]),
  transportManifestDigests: z.tuple([durableHashSchema, durableHashSchema, durableHashSchema]),
  transportManifests: z.tuple([z.unknown(), z.unknown(), z.unknown()]) }).strict();
const readbackReviewSchema = z.object({ context: lrcDurableBindingSchema.shape.context, caseId: z.uuid(), runId: z.uuid(),
  reviewJobId: z.string(), contractDigest: durableHashSchema, attemptDigest: durableHashSchema,
  ledger: z.unknown(), ledgerDigest: durableHashSchema, disposition: z.string(), conclusion: z.string() }).strict();
const readbackDossierSchema = z.object({ context: lrcDurableBindingSchema.shape.context, caseId: z.uuid(), runId: z.uuid(),
  contractDigest: durableHashSchema, attemptDigest: durableHashSchema, ledgerDigest: durableHashSchema,
  finiteRecordDigest: durableHashSchema, roleInputDigests: z.tuple([durableHashSchema, durableHashSchema, durableHashSchema]) }).strict();
const readbackWorkerResultSchema = z.object({ caseId: z.uuid(), runId: z.uuid(), solverJobId: z.string(), reviewJobId: z.string(),
  contractDigest: durableHashSchema, attemptDigest: durableHashSchema, ledgerDigest: durableHashSchema,
  disposition: z.string(), conclusion: z.string(), dossierDigest: durableHashSchema }).strict();
const readbackTransportSchema = z.object({ version: z.literal("LRC_ROLE_TRANSPORT_V2"),
  bindingDigest: durableHashSchema, role: z.enum(["SOLVER", "ADVERSARY", "CRITIC"]),
  preparedByteDigest: durableHashSchema, roleInputDigest: durableHashSchema, stdoutDigest: durableHashSchema }).strict();

export type MethodUnitReplayCriticPermit = Readonly<{ version: 2; replayReceiptDigest: string }>;
export type MethodUnitReplayAdmission = Readonly<{ version: 2; admissionReceiptDigest: string }>;
export type MethodUnitReplayOutcome = Readonly<{ status: "KNOWN_FINITE_PASS"; checkerCalls: 2; metrics: Metrics;
  dispatchAllowed: false; proofClosure: false; stop: true; independentInformation: "NOT_BOUND";
  batch: "NOT_BOUND"; relations: readonly []; associations: readonly []; novelty: "NOT_ESTABLISHED" }>;

interface FixtureOptions {
  store: MathDiagnosticCaptureV2Store;
  handle: LrcCaptureV2Handle;
  /** Trusted fixture host fences validate original actor/tenant/source and exact owned lease.
   * Production request headers and actual ingress are deliberately NOT implemented here. */
  fence: (purpose: Purpose) => Promise<void>;
  originalFiniteCheck: (remaining: Readonly<{ maxMs: number; maxOperations: number }>) => Promise<unknown> | unknown;
  readOriginalArtifacts: () => Promise<unknown>;
  readRetainedLedger: () => Promise<unknown>;
  now?: () => number;
  monotonicNow?: () => number;
}
function fixtureOnly(): void {
  if (process.env.NODE_ENV !== "test" || !process.env.VITEST) throw new Error("AUTHENTICATION_REQUIRED");
}
function refuse(reason: string): never { throw new Error(reason); }
function freeze<T>(raw: T): T {
  if (raw && typeof raw === "object") { for (const value of Object.values(raw)) freeze(value); Object.freeze(raw); }
  return raw;
}
function digest(raw: unknown, cap = 32768): string { durableJson(raw, cap); return sha256(canonicalJson(raw)); }
function same(a: unknown, b: unknown): boolean { return canonicalJson(a) === canonicalJson(b); }

/** New offline fixture bridge only. It never imports or unlocks the existing executor,
 * cannot mint production G2, and does NOT complete TIP-072 ingress/agent-loop wiring. */
export class MethodUnitDurableReplayFixtureHost {
  private stage: "NEW" | "REPLAYING" | "PRECRITIC" | "CRITIC" | "SEALING" | "ADMITTED" | "STOPPED" = "NEW";
  private readonly permits = new WeakMap<MethodUnitReplayCriticPermit, boolean>();
  private readonly admissions = new WeakMap<MethodUnitReplayAdmission, boolean>();
  private descriptor?: LrcDurableDescriptor;
  private binding?: LrcDurableBinding;
  private descriptorDigest?: string;
  private bindingDigest?: string;
  private finite?: LrcMethodUnitFiniteEvidence;
  private pre?: LrcPreCriticReceipt;
  private preDigest?: string;
  private finalMetrics?: Metrics;
  private expiry = 0;
  private started = 0;
  private originalOperations = 0;
  private originalElapsed = 0;
  private replayOperations = 0;
  private replayElapsed = 0;
  private readonly now: () => number;
  private readonly clock: () => number;
  private postHandle?: LrcCaptureV2Handle;
  private retainedSnapshotDigest?: string;
  constructor(private readonly options: FixtureOptions) {
    fixtureOnly();
    if (!(options.store instanceof MathDiagnosticCaptureV2Store)) refuse("FOREIGN_STORE");
    this.now = options.now ?? Date.now;
    this.clock = options.monotonicNow ?? (() => performance.now());
  }
  private elapsed(): number {
    const value = this.clock() - this.started;
    if (!Number.isFinite(value) || value < 0 || value >= limits.milliseconds) refuse("RESOURCE_REFUSED");
    return value;
  }
  private remaining() {
    const ms = limits.milliseconds - this.elapsed(), operations = limits.operations - this.originalOperations - this.replayOperations;
    if (ms <= 0 || operations <= 0) refuse("RESOURCE_REFUSED");
    return Object.freeze({ remainingMs: ms, remainingOperations: operations });
  }
  private metrics(): Metrics {
    return lrcDurableMetricsSchema.parse({ checkerCalls: 2, originalOperations: this.originalOperations,
      replayOperations: this.replayOperations, originalElapsedMs: this.originalElapsed,
      replayElapsedMs: this.replayElapsed, aggregateElapsedMs: this.elapsed() });
  }
  private async fence(purpose: Purpose): Promise<void> {
    fixtureOnly();
    await this.options.fence(purpose);
    const raw = await this.options.store.describe(purpose === "POST_COMMIT" ? this.postHandle ?? refuse("POST_PURPOSE_REQUIRED") : this.options.handle);
    durableJson(raw, 16384);
    const descriptor = lrcDurableDescriptorSchema.parse(raw.descriptor), binding = lrcDurableBindingSchema.parse(raw.binding);
    if (!same(descriptor.context, binding.context) || raw.descriptorDigest !== durableDigest(durableJson(descriptor)) || raw.bindingDigest !== durableDigest(durableJson(binding))) refuse("HOST_BINDING_REFUSED");
    if (this.descriptor && (!same(this.descriptor, descriptor) || !same(this.binding, binding))) refuse("HOST_BINDING_REFUSED");
    const expiry = Math.min(descriptor.expiresAt, binding.solver.leaseExpiresAt, binding.adversary.leaseExpiresAt, binding.critic.leaseExpiresAt);
    if (this.now() < descriptor.createdAt || this.now() >= expiry) refuse("CAPTURE_EXPIRED");
    if (!descriptor.sourcePins[originalPath] || !descriptor.sourcePins[replayPath] || descriptor.unitDigest !== LRC_METHOD_UNIT_DIGEST) refuse("SOURCE_PINS_REFUSED");
    this.descriptor = freeze(descriptor); this.binding = freeze(binding);
    this.descriptorDigest = raw.descriptorDigest; this.bindingDigest = raw.bindingDigest; this.expiry = expiry;
    await this.options.fence(purpose);
  }
  private requirePre(): LrcPreCriticReceipt {
    if (!this.pre || !this.preDigest || !this.finalMetrics || this.now() >= this.expiry) refuse("REPLAY_ADMISSION_REFUSED");
    return this.pre;
  }
  async replayBeforeCritic(): Promise<Readonly<{ status: "ACCEPTED"; permit: MethodUnitReplayCriticPermit; receipt: LrcPreCriticReceipt; finalFiniteMetrics: Metrics }> | Readonly<{ status: "MISSING" | "UNSUPPORTED" | "CERTIFICATE_REFUSED"; permit: null; checkerCalls: 0 | 1 }>> {
    if (this.stage !== "NEW") refuse("ATTEMPT_ALREADY_SPENT");
    this.stage = "REPLAYING";
    try {
      await this.fence("ACTIVE_CAPTURE");
      // Outer clock begins BEFORE the host's original producer+consumer, not when replay starts.
      this.started = this.clock();
      const remaining = this.remaining();
      const originalMs = Math.floor(remaining.remainingMs);
      if (originalMs < 1) refuse("RESOURCE_REFUSED");
      const raw = await this.options.originalFiniteCheck(Object.freeze({ maxMs: originalMs, maxOperations: remaining.remainingOperations }));
      this.originalElapsed = this.elapsed();
      await this.fence("ACTIVE_CAPTURE"); this.remaining();
      const bytes = durableJson(raw, limits.bytes), finite = lrcMethodUnitFiniteEvidenceSchema.parse(raw);
      if (finite.status === "RESOURCE_REFUSED") refuse("RESOURCE_REFUSED");
      if (finite.status !== "CHECKED_FINITE") {
        this.stage = "STOPPED";
        return freeze({ status: finite.status, permit: null, checkerCalls: finite.checker ? 1 as const : 0 as const });
      }
      if (!finite.checker || !finite.producer || !finite.input || !finite.result || !finite.inputDigest || !finite.seedDigest || !finite.certificateDigest) refuse("ACCOUNTING_REFUSED");
      await this.fence("ACTIVE_CAPTURE"); this.remaining();
      const artifactRaw = await this.options.readOriginalArtifacts();
      await this.fence("ACTIVE_CAPTURE"); this.remaining(); durableJson(artifactRaw, 98304);
      const artifacts = z.object({ attempt: z.unknown(), adversary: z.unknown() }).strict().parse(artifactRaw);
      const liveBinding = { caseId: this.binding!.caseId, runId: this.binding!.runId, contractDigest: this.descriptor!.contractDigest, requestedModelName: "gpt-6-sol" };
      assertLrcMethodUnitAttemptBinding(artifacts.attempt, liveBinding);
      const adversary = lrcMethodUnitAgentReportSchema.parse(artifacts.adversary), actualAttemptDigest = digest(artifacts.attempt);
      if (adversary.role !== "ADVERSARY" || finite.binding.solverAttemptDigest !== actualAttemptDigest || finite.binding.adversaryReportDigest !== digest(adversary) ||
        finite.seedDigest !== digest(lrcMethodUnitSolverMathematics(artifacts.attempt).lrcMethodUnitFiniteSeed) ||
        !validatePreparedLrcMethodUnitInput(adversary.lrcMethodUnitInput, { ...liveBinding, role: "ADVERSARY", solverAttempt: artifacts.attempt, solverAttemptDigest: actualAttemptDigest })) refuse("ORIGINAL_ARTIFACT_REFUSED");
      if (finite.binding.caseId !== this.binding!.caseId || finite.binding.runId !== this.binding!.runId || finite.binding.reviewJobId !== this.binding!.critic.jobId || finite.binding.contractDigest !== this.descriptor!.contractDigest || finite.seedDigest !== this.descriptor!.seedDigest ||
        finite.producer.sourceSha256 !== this.descriptor!.sourcePins[originalPath] || finite.checker.sourceSha256 !== this.descriptor!.sourcePins[originalPath]) refuse("FINITE_BINDING_REFUSED");
      this.originalOperations = finite.checker.chargedOperations;
      if (finite.checker.elapsedMs > this.originalElapsed) refuse("ACCOUNTING_REFUSED");
      this.originalElapsed = Math.max(this.originalElapsed, finite.checker.elapsedMs);
      if (!Number.isSafeInteger(this.originalOperations) || this.originalOperations <= 0 || this.originalElapsed > this.elapsed()) refuse("ACCOUNTING_REFUSED");
      this.finite = freeze(finite); this.remaining();
      await this.fence("ACTIVE_CAPTURE"); this.remaining();
      await this.options.store.writeFinite(this.options.handle, bytes, durableDigest(bytes));
      await this.fence("ACTIVE_CAPTURE"); this.remaining();
      const freshBytes = await this.options.store.readStagedFinite(this.options.handle);
      await this.fence("ACTIVE_CAPTURE"); this.remaining();
      if (durableDigest(freshBytes) !== durableDigest(bytes) || !freshBytes.equals(bytes)) refuse("FINITE_BYTES_REFUSED");
      const fresh = lrcMethodUnitFiniteEvidenceSchema.parse(parseDurableBytes(freshBytes, limits.bytes));
      if (!same(fresh, finite)) refuse("FINITE_BYTES_REFUSED");
      await this.fence("ACTIVE_CAPTURE");
      const replay = replayLrcShiftFiniteCertificate(fresh.input, this.remaining());
      this.replayOperations = replay.chargedOperations; this.replayElapsed = replay.elapsedMs;
      await this.fence("ACTIVE_CAPTURE"); this.remaining();
      if (replay.status !== "ACCEPTED" || !replay.result || replay.resultDigest !== fresh.checker!.outputDigest || !same(replay.result, fresh.result)) refuse(replay.status === "RESOURCE_REFUSED" ? "RESOURCE_REFUSED" : "INDEPENDENT_REPLAY_REFUSED");
      const pre = lrcPreCriticReceiptSchema.parse({ version: "LRC_PRECRITIC_REPLAY_V2", descriptorDigest: this.descriptorDigest,
        bindingDigest: this.bindingDigest, finiteByteDigest: durableDigest(freshBytes), finiteRecordDigest: fresh.recordDigest,
        inputDigest: fresh.inputDigest, certificateDigest: fresh.certificateDigest, seedDigest: fresh.seedDigest, unitDigest: LRC_METHOD_UNIT_DIGEST,
        replayInputDigest: digest(fresh.input), originalResultDigest: fresh.checker!.outputDigest, replayResultDigest: replay.resultDigest,
        replayCheckerVersion: LRC_SHIFT_REPLAY_VERSION, replayCheckerSourceDigest: this.descriptor!.sourcePins[replayPath],
        solverAttemptDigest: fresh.binding.solverAttemptDigest, adversaryReportDigest: fresh.binding.adversaryReportDigest,
        metrics: this.metrics(), replayId: randomUUID(), createdAt: this.now(), expiresAt: this.expiry, ...ceiling });
      await this.fence("ACTIVE_CAPTURE"); this.remaining();
      const preDigest = await this.options.store.writePreCriticReceipt(this.options.handle, pre);
      await this.fence("ACTIVE_CAPTURE"); this.remaining();
      const retained = await this.options.store.readPreCriticReceipt(this.options.handle);
      await this.fence("ACTIVE_CAPTURE"); this.remaining();
      if (retained.digest !== preDigest || retained.digest !== durableDigest(durableJson(pre)) || !same(retained.receipt, pre)) refuse("REPLAY_RECEIPT_REFUSED");
      // This actual observation includes receipt file+parent fsync AND fresh read-back.
      // It is stored later in the post-ledger receipt; pre's metrics were precommit.
      this.finalMetrics = freeze(this.metrics()); this.pre = freeze(pre); this.preDigest = preDigest;
      const permit = Object.freeze({ version: 2 as const, replayReceiptDigest: preDigest });
      this.permits.set(permit, false); this.stage = "PRECRITIC";
      return freeze({ status: "ACCEPTED" as const, permit, receipt: pre, finalFiniteMetrics: this.finalMetrics });
    } catch (error) { this.stage = "STOPPED"; throw error; }
  }
  /** One-use planning permission for the fixture critic stage, not model execution authority. */
  async claimCriticStage(permit: MethodUnitReplayCriticPermit): Promise<Readonly<{ dispatchAllowed: false; replayReceiptDigest: string }>> {
    if (this.stage !== "PRECRITIC" || this.permits.get(permit) !== false) refuse("FORGED_OR_SPENT_CRITIC_PERMIT");
    this.permits.set(permit, true); this.stage = "CRITIC";
    try {
      await this.fence("ACTIVE_CAPTURE"); const pre = this.requirePre(); this.remaining();
      const finiteBytes = await this.options.store.readStagedFinite(this.options.handle);
      await this.fence("ACTIVE_CAPTURE"); this.remaining();
      const actual = await this.options.store.readPreCriticReceipt(this.options.handle);
      await this.fence("ACTIVE_CAPTURE"); this.remaining();
      if (actual.digest !== this.preDigest || !same(actual.receipt, pre) || durableDigest(finiteBytes) !== pre.finiteByteDigest ||
        !same(lrcMethodUnitFiniteEvidenceSchema.parse(parseDurableBytes(finiteBytes, limits.bytes)), this.finite)) refuse("REPLAY_RECEIPT_REFUSED");
      this.finalMetrics = freeze(this.metrics());
      return Object.freeze({ dispatchAllowed: false, replayReceiptDigest: permit.replayReceiptDigest });
    }
    catch (error) { this.stage = "STOPPED"; throw error; }
  }
  async sealPostLedger(): Promise<MethodUnitReplayAdmission> {
    if (this.stage !== "CRITIC") refuse("CRITIC_STAGE_REQUIRED");
    this.stage = "SEALING";
    try {
      await this.options.fence("POST_COMMIT");
      this.postHandle = await this.options.store.purpose(this.options.handle, "POST_COMMIT");
      await this.options.fence("POST_COMMIT");
      await this.fence("POST_COMMIT"); const pre = this.requirePre();
      const raw = await this.options.readRetainedLedger();
      await this.fence("POST_COMMIT"); durableJson(raw, 262144);
      const retained = retainedSchema.parse(raw);
      if (!same(retained.binding, this.binding) || retained.contractDigest !== this.descriptor!.contractDigest) refuse("TERMINAL_BINDING_REFUSED");
      const ledger = lrcMethodUnitLedgerSchema.parse(retained.ledger);
      const attemptRecord = retained.attempt as Record<string, unknown>;
      const solverInput = lrcMethodUnitLiveEvidenceSchema.parse(attemptRecord.lrcMethodUnitEvidence).solverInput;
      const preparedByteDigests = [solverInput, ...ledger.reports.map(report => report.lrcMethodUnitInput)].map(input => durableDigest(durableJson(input, 49152)));
      const review = readbackReviewSchema.parse(retained.review), dossier = readbackDossierSchema.parse(retained.dossier), worker = readbackWorkerResultSchema.parse(retained.workerResult);
      const expectedDossier = { context: this.binding!.context, caseId: this.binding!.caseId, runId: this.binding!.runId,
        contractDigest: this.descriptor!.contractDigest, attemptDigest: pre.solverAttemptDigest, ledgerDigest: retained.ledgerDigest,
        finiteRecordDigest: pre.finiteRecordDigest, roleInputDigests: retained.roleInputDigests };
      if (!same(dossier, expectedDossier) || !same(review.context, this.binding!.context) || review.caseId !== this.binding!.caseId || review.runId !== this.binding!.runId || review.reviewJobId !== this.binding!.critic.jobId ||
        review.contractDigest !== this.descriptor!.contractDigest || review.attemptDigest !== pre.solverAttemptDigest || review.ledgerDigest !== retained.ledgerDigest || !same(review.ledger, ledger) || review.disposition !== ledger.disposition || review.conclusion !== ledger.conclusion ||
        !same(worker, { caseId: this.binding!.caseId, runId: this.binding!.runId, solverJobId: this.binding!.solver.jobId, reviewJobId: this.binding!.critic.jobId,
          contractDigest: this.descriptor!.contractDigest, attemptDigest: pre.solverAttemptDigest, ledgerDigest: retained.ledgerDigest, disposition: ledger.disposition, conclusion: ledger.conclusion, dossierDigest: retained.dossierDigest })) refuse("TERMINAL_RESULT_REFUSED");
      for (const [i, rawManifest] of retained.transportManifests.entries()) {
        const manifest = readbackTransportSchema.parse(rawManifest), claim = [this.binding!.solver, this.binding!.adversary, this.binding!.critic][i];
        if (manifest.bindingDigest !== this.bindingDigest || manifest.role !== claim.role || manifest.roleInputDigest !== retained.roleInputDigests[i] || manifest.preparedByteDigest !== retained.preparedByteDigests[i] ||
          durableDigest(durableJson(manifest)) !== retained.transportManifestDigests[i]) refuse("TRANSPORT_BINDING_REFUSED");
      }
      const originalPins = { producerSourceSha256: this.descriptor!.sourcePins[originalPath], checkerSourceSha256: this.descriptor!.sourcePins[originalPath] };
      if (!validateRecordedLrcMethodUnitReview({ caseId: this.binding!.caseId, runId: this.binding!.runId,
        contractDigest: this.descriptor!.contractDigest, requestedModelName: "gpt-6-sol", attempt: retained.attempt,
        ledger, finiteSourcePins: originalPins, reviewJobId: this.binding!.critic.jobId }) ||
        !same(ledger.lrcMethodUnitFiniteEvidence, this.finite) || digest(retained.attempt) !== pre.solverAttemptDigest ||
        digest(ledger.reports[0]) !== pre.adversaryReportDigest || digest(ledger, 131072) !== retained.ledgerDigest ||
        digest(retained.review, 131072) !== retained.reviewDigest || digest(retained.dossier, 131072) !== retained.dossierDigest ||
        digest(retained.workerResult) !== retained.workerResultDigest || !same(preparedByteDigests, retained.preparedByteDigests) ||
        !same(ledger.lrcMethodUnitAuditSummary.roleInputDigests, retained.roleInputDigests)) refuse("LEDGER_ANCHOR_REFUSED");
      this.retainedSnapshotDigest = digest(retained, 262144);
      const post: LrcPostLedgerReceipt = lrcPostLedgerReceiptSchema.parse({ version: "LRC_POSTLEDGER_ADMISSION_V2",
        descriptorDigest: this.descriptorDigest, bindingDigest: this.bindingDigest, preCriticReceiptDigest: this.preDigest,
        ledgerDigest: retained.ledgerDigest, ledgerVersion: 7, reviewDigest: retained.reviewDigest, dossierDigest: retained.dossierDigest,
        workerResultDigest: retained.workerResultDigest, solverAttemptDigest: pre.solverAttemptDigest, adversaryReportDigest: pre.adversaryReportDigest,
        roleInputDigests: retained.roleInputDigests, preparedByteDigests: retained.preparedByteDigests, transportManifestDigests: retained.transportManifestDigests,
        finalFiniteMetrics: this.finalMetrics, createdAt: this.now(), expiresAt: this.expiry, dispatchAllowed: false, proofClosure: false, ...ceiling });
      await this.fence("POST_COMMIT"); this.requirePre();
      const postDigest = await this.options.store.writePostLedgerReceipt(this.postHandle, post);
      await this.fence("POST_COMMIT"); this.requirePre();
      const commitDigest = await this.options.store.commit(this.postHandle);
      await this.fence("POST_COMMIT"); this.requirePre();
      const committed = await this.options.store.readCommitted(this.postHandle);
      await this.fence("POST_COMMIT"); this.requirePre();
      if (committed.commitDigest !== commitDigest || !same(committed.preCritic, pre) || !same(committed.postLedger, post) || postDigest !== durableDigest(durableJson(post))) refuse("FINAL_SEAL_REFUSED");
      const token = Object.freeze({ version: 2 as const, admissionReceiptDigest: postDigest });
      this.admissions.set(token, false); this.stage = "ADMITTED"; return token;
    } catch (error) { this.stage = "STOPPED"; throw error; }
  }
  async consumeAdmission(token: MethodUnitReplayAdmission): Promise<MethodUnitReplayOutcome> {
    if (this.stage !== "ADMITTED" || this.admissions.get(token) !== false) refuse("FORGED_OR_SPENT_ADMISSION");
    this.admissions.set(token, true); this.stage = "STOPPED";
    await this.fence("POST_COMMIT"); this.requirePre();
    const committed = await this.options.store.readCommitted(this.postHandle!);
    await this.fence("POST_COMMIT"); this.requirePre();
    const actualRetained = await this.options.readRetainedLedger();
    await this.fence("POST_COMMIT"); this.requirePre();
    if (digest(actualRetained, 262144) !== this.retainedSnapshotDigest) refuse("RETAINED_LEDGER_DRIFT");
    if (durableDigest(durableJson(committed.postLedger)) !== token.admissionReceiptDigest || committed.postLedger.preCriticReceiptDigest !== this.preDigest) refuse("FINAL_SEAL_REFUSED");
    return freeze({ status: "KNOWN_FINITE_PASS" as const, checkerCalls: 2 as const, metrics: this.finalMetrics!, dispatchAllowed: false as const,
      proofClosure: false as const, stop: true as const, independentInformation: "NOT_BOUND" as const, batch: "NOT_BOUND" as const,
      relations: [] as [], associations: [] as [], novelty: "NOT_ESTABLISHED" as const });
  }
}

/** No production mint, generic caller-fence constructor, executor, or GET replay exists. */
export function authorizeMethodUnitDurableReplay(): never { return refuse("AUTHENTICATION_REQUIRED"); }
