import { randomUUID } from "node:crypto";
import { mkdtemp, realpath } from "node:fs/promises";
import { join } from "node:path";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { buildLrcMethodUnitFiniteEvidence, LRC_METHOD_UNIT_DIGEST } from "@/modules/research-sandbox/math-lrc-method-unit";
import { createLrcMethodUnitLiveEvidence, prepareLrcMethodUnitSolverInput, prepareLrcMethodUnitReviewInput } from "@/modules/research-sandbox/math-lrc-method-unit-live";
import { evaluateLrcMethodUnitReview, lrcMethodUnitLedgerReference, lrcMethodUnitLedgerSchema } from "@/modules/research-sandbox/math-lrc-method-unit-review";
import { MathDiagnosticCaptureV2Store } from "@/server/operations/math-diagnostic-capture-v2";
import { MethodUnitDurableReplayFixtureHost } from "@/server/operations/math-method-unit-durable-replay";
import { durableDigest, durableJson } from "@/modules/research-sandbox/math-lrc-durable-replay";
import { cockpitFixture } from "./math-lrc-research-cockpit-fixture";
import { mathModelAttemptSchema } from "@/modules/research-sandbox/contracts";

export const originalPath = "src/modules/research-sandbox/math-lrc-method-unit.ts", replayPath = "src/modules/research-sandbox/math-lrc-shift-replay.ts";
export const H = (raw: unknown): string => sha256(canonicalJson(raw));
/** Offline only: uniquely allocated synthetic IDs/temp bytes are NEVER research database results. */
export async function durableReplayFixture(options: { missing?: boolean; original?: (raw: unknown) => unknown;
  fault?: (stage: string) => Promise<void>; fence?: (purpose: string) => Promise<void>; clock?: () => number; now?: () => number } = {}) {
  const root = await realpath(await mkdtemp(join("/private/tmp", "hive-tip071-bridge-")));
  const base = cockpitFixture(), time = options.now ?? Date.now, created = time();
  const context = { actorUserId: "fixture-original-actor", organizationId: "fixture-org", workspaceId: "fixture-workspace", missionId: "fixture-mission" };
  const caseId = randomUUID(), runId = randomUUID(), commandId = randomUUID(), reviewJobId = "fixture-review-" + randomUUID();
  const live = { caseId, runId, contractDigest: base.contractDigest, requestedModelName: "gpt-6-sol" };
  const prior = lrcMethodUnitLedgerSchema.parse((base.review as { ledger: unknown }).ledger);
  const attempt = { ...mathModelAttemptSchema.parse(base.attempt), threadId: "fixture-solver-" + randomUUID(),
    lrcMethodUnitEvidence: createLrcMethodUnitLiveEvidence({ solverInput: prepareLrcMethodUnitSolverInput(live) }),
    ...(options.missing ? { lrcMethodUnitFiniteSeed: null } : {}) };
  const attemptDigest = H(attempt);
  const adversary = { ...structuredClone(prior.reports[0]), threadId: "fixture-adversary-" + randomUUID(),
    lrcMethodUnitInput: prepareLrcMethodUnitReviewInput({ ...live, role: "ADVERSARY", solverAttempt: attempt, solverAttemptDigest: attemptDigest }) };
  const originalPins = { producerSourceSha256: sha256("fixture-original-source"), checkerSourceSha256: sha256("fixture-original-source") };
  const descriptor = { version: "LRC_DURABLE_DESCRIPTOR_V2" as const, context, approvedNonce: randomUUID(), executableManifestDigest: sha256("fixture-only-runtime"),
    contractDigest: live.contractDigest, sourcePins: { [originalPath]: originalPins.producerSourceSha256, [replayPath]: sha256("fixture-only-independent-source") },
    predicateId: "FEW_EXCEPTION_SHIFT_14_V1" as const, unitDigest: LRC_METHOD_UNIT_DIGEST, seedDigest: H(attempt.lrcMethodUnitFiniteSeed ?? { missing: true }),
    createdAt: created, expiresAt: created + 60000 };
  const claim = (role: "SOLVER" | "ADVERSARY" | "CRITIC") => ({ role, jobId: role === "SOLVER" ? "fixture-solver-job-" + randomUUID() : reviewJobId,
    outboxId: role === "SOLVER" ? "fixture-solver-outbox" : "fixture-review-outbox", dispatchId: randomUUID(), workerId: role === "SOLVER" ? "fixture-solver-worker" : "fixture-review-worker",
    claimedVersion: 2, leaseExpiresAt: created + 60000, attemptNumber: 1 as const });
  const binding = { context, caseId, runId, commandId, solver: claim("SOLVER"), adversary: claim("ADVERSARY"), critic: claim("CRITIC") };
  let active = true, terminal = false, originalCalls = 0, hostCalls = 0, finite: ReturnType<typeof buildLrcMethodUnitFiniteEvidence> | undefined;
  let retainedMutation: (raw: Record<string, unknown>) => void = () => {};
  let retainedCache: Record<string, unknown> | undefined;
  const store = new MathDiagnosticCaptureV2Store({ mode: "fixture", fixtureRoot: root, now: time, fault: options.fault,
    fence: async (purpose, expectedDescriptor, actualBinding) => { hostCalls++; if (!active) throw new Error("FIXTURE_AUTH_REVOKED");
      if (purpose === "POST_COMMIT" ? !terminal : terminal) throw new Error("FIXTURE_PURPOSE_STATE_REFUSED");
      if (H(expectedDescriptor) !== H(descriptor) || actualBinding && H(actualBinding) !== H(binding)) throw new Error("FIXTURE_OWNED_BINDING_REFUSED"); } });
  const bootstrap = await store.reserveThreeRoles(descriptor), handle = await store.bind(bootstrap, binding);
  const readRetainedLedger = async () => {
    if (retainedCache) { const next = structuredClone(retainedCache); retainedMutation(next); return next; }
    if (!finite) throw new Error("FIXTURE_NO_FINITE");
    const critic = { ...structuredClone(prior.reports[1]), threadId: "fixture-critic-" + randomUUID(),
      lrcMethodUnitInput: prepareLrcMethodUnitReviewInput({ ...live, role: "CRITIC", solverAttempt: attempt, solverAttemptDigest: attemptDigest, finiteEvidence: finite, finiteSourcePins: originalPins }) };
    const reports = [adversary, critic] as const;
    const outcome = evaluateLrcMethodUnitReview({ ...live, attempt, reports, finiteEvidence: finite, finiteSourcePins: originalPins, reviewJobId });
    const ledger = lrcMethodUnitLedgerSchema.parse({ ...structuredClone(prior), ...outcome, reports,
      reviewerModels: reports.map(r => ({ role: r.role, providerName: "codex-local", identityEvidence: "REQUESTED_CLI_MODEL", requestedModelName: "gpt-6-sol", threadId: r.threadId })),
      lrcMethodUnitEvidence: lrcMethodUnitLedgerReference(attempt.lrcMethodUnitEvidence), lrcMethodUnitFiniteEvidence: finite });
    const ledgerDigest = H(ledger), roleInputDigests = ledger.lrcMethodUnitAuditSummary.roleInputDigests,
      preparedByteDigests = [attempt.lrcMethodUnitEvidence.solverInput, ...reports.map(r => r.lrcMethodUnitInput)].map(input => durableDigest(durableJson(input, 49152)));
    const review = { context, caseId, runId, reviewJobId, contractDigest: live.contractDigest, attemptDigest, ledger, ledgerDigest, disposition: ledger.disposition, conclusion: ledger.conclusion };
    const dossier = { context, caseId, runId, contractDigest: live.contractDigest, attemptDigest, ledgerDigest, finiteRecordDigest: finite.recordDigest, roleInputDigests };
    const workerResult = { caseId, runId, solverJobId: binding.solver.jobId, reviewJobId, contractDigest: live.contractDigest, attemptDigest, ledgerDigest,
      disposition: ledger.disposition, conclusion: ledger.conclusion, dossierDigest: H(dossier) };
    const outputs = [attempt, ...reports];
    const transportManifests = [binding.solver, binding.adversary, binding.critic].map((c, i) => ({ version: "LRC_ROLE_TRANSPORT_V2",
      bindingDigest: durableDigest(durableJson(binding)), role: c.role, preparedByteDigest: preparedByteDigests[i], roleInputDigest: roleInputDigests[i], stdoutDigest: durableDigest(durableJson(outputs[i], 1048576)) }));
    const retained: Record<string, unknown> = { binding, solverStatus: "SUCCEEDED", reviewStatus: "SUCCEEDED", contractDigest: live.contractDigest, attempt, ledger,
      ledgerDigest, review, reviewDigest: H(review), dossier, dossierDigest: H(dossier), workerResult, workerResultDigest: H(workerResult),
      roleInputDigests, preparedByteDigests, transportManifestDigests: transportManifests.map(manifest => durableDigest(durableJson(manifest))), transportManifests };
    retainedCache = structuredClone(retained); retainedMutation(retained); return retained;
  };
  const host = new MethodUnitDurableReplayFixtureHost({ store, handle, now: time, monotonicNow: options.clock,
    fence: async purpose => { if (!active) throw new Error("FIXTURE_AUTH_REVOKED"); if (purpose === "POST_COMMIT" ? !terminal : terminal) throw new Error("FIXTURE_PURPOSE_STATE_REFUSED"); await options.fence?.(purpose); },
    originalFiniteCheck: budget => { originalCalls++; finite = buildLrcMethodUnitFiniteEvidence({ seed: attempt.lrcMethodUnitFiniteSeed, pins: originalPins,
      binding: { caseId, runId, contractDigest: live.contractDigest, reviewJobId, solverAttemptDigest: attemptDigest, adversaryReportDigest: H(adversary) }, budget });
      return options.original ? options.original(structuredClone(finite)) : finite; }, readOriginalArtifacts: async () => ({ attempt, adversary }), readRetainedLedger });
  const captureRoles = async () => {
    const retained = await readRetainedLedger(), ledger = lrcMethodUnitLedgerSchema.parse(retained.ledger);
    const inputs = [attempt.lrcMethodUnitEvidence.solverInput, ...ledger.reports.map(r => r.lrcMethodUnitInput)];
    const outputs = [attempt, ...ledger.reports];
    for (let i = 0; i < 3; i++) {
      const role = (["SOLVER", "ADVERSARY", "CRITIC"] as const)[i];
      await store.writeRoleCapture(handle, role, durableJson(inputs[i], 49152), durableJson(outputs[i], 1048576), {
        ...live, role, ...(i ? { solverAttempt: attempt, solverAttemptDigest: attemptDigest } : {}),
        ...(i === 2 ? { finiteEvidence: finite, finiteSourcePins: originalPins } : {}) });
    }
  };
  return { root, store, handle, host, descriptor, binding, captureRoles, revoke: () => { active = false; }, terminal: () => { terminal = true; },
    mutateRetained: (mutation: (raw: Record<string, unknown>) => void) => { retainedMutation = mutation; },
    get originalCalls() { return originalCalls; }, get hostCalls() { return hostCalls; } };
}
