import { parseLrcPhaseReadRequest, type LrcPhaseReadRequest, type LrcReadPhase } from "@/modules/research-sandbox/math-lrc-phase-binding";

/** Synthetic read assertions only. Never retained as scientific or authenticated evidence. */
export function makeLrcPhaseReadFixture(phase: LrcReadPhase = "PROSPECTIVE", createdAt = Date.now()): LrcPhaseReadRequest {
  if (process.env.NODE_ENV !== "test" || !process.env.VITEST) throw new Error("PHASE_FIXTURE_REFUSED");
  const hash = "a".repeat(64);
  const raw = {
    phase, workspaceSlug: "fixture-lrc-lab", sourceExpiresAt: createdAt + 60000, grantExpiresAt: createdAt + 60000,
    descriptor: { version: "LRC_DURABLE_DESCRIPTOR_V2", context: { actorUserId: "fixture-actor", organizationId: "fixture-org", workspaceId: "fixture-workspace", missionId: "fixture-mission" },
      approvedNonce: "00000000-0000-4000-8000-000000000001", executableManifestDigest: hash, contractDigest: hash,
      sourcePins: { original: hash, replay: hash }, predicateId: "FEW_EXCEPTION_SHIFT_14_V1", seedDigest: hash, unitDigest: hash,
      createdAt, expiresAt: createdAt + 60000 },
    ...(phase !== "PROSPECTIVE" ? {
      created: { caseId: "00000000-0000-4000-8000-000000000002", runId: "00000000-0000-4000-8000-000000000003", commandId: "00000000-0000-4000-8000-000000000004", solverOutboxId: "fixture-solver-outbox" },
      solverClaim: { role: "SOLVER", jobId: "fixture-solver-job", outboxId: "fixture-solver-outbox", dispatchId: "00000000-0000-4000-8000-000000000005", workerId: "fixture-solver-worker", claimedVersion: 2, leaseExpiresAt: createdAt + 45000, attemptNumber: 1 },
    } : {}),
    ...(phase === "REVIEW_ACTIVE" || phase === "TERMINAL" ? {
      reviewClaim: { jobId: "fixture-review-job", outboxId: "fixture-review-outbox", workerId: "fixture-review-worker", claimedVersion: 2, leaseExpiresAt: createdAt + 55000, attemptNumber: 1,
        adversaryDispatchId: "00000000-0000-4000-8000-000000000006", criticDispatchId: "00000000-0000-4000-8000-000000000007" }, solverAttemptDigest: hash,
    } : {}),
    ...(phase === "TERMINAL" ? { ledgerDigest: hash } : {}),
  };
  return structuredClone(parseLrcPhaseReadRequest(raw));
}
