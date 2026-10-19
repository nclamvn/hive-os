# TIP-072A: authenticated sequential phase validation (offline foundation)

## Header
- Project: HIVE OS mathematical research; priority P0.
- Depends on: independently verified TIP-071; approved G1 parent blueprint071–073.
- Authority: latest human continuation, G1 OFFLINE implementation only.
- Working directory: /Users/os/hiveos.
- Contractor decision: split072 into072A phase/auth foundation and072B actual
  storage/bootstrap/worker/admission integration. Do not call072 complete after072A.
- Parent blueprint SHA256: 5ca4ae11a5f5a353664e94e73464caf3128f49a79cffc6a37cef40591ca999e5.

## Evidence / design decision
Real solver creates the review outbox only after retaining its result. Frozen071
fixture store requires simultaneous solver/review claims; it is not a production
sequential lease protocol. Add strict phase-specific read bindings, never fabricate
future claims or require completed solver to remain RUNNING during review.
Read-only scans report77–81 transitive runtime files (different roots), exceeding
the existing42-file source ceiling. Neither count is an executable attestation.
Keep source closure UNSEALED and all production dispatch/admission refused until
a separately approved closure fits or its security bounds are explicitly revised.
No silent expansion, omitted dynamic imports, or edited historical37 registry.

## Task / ownership
Core Builder: additive src/modules/research-sandbox/math-lrc-phase-binding.ts,
tests/unit/math-lrc-phase-binding.test.ts and optionally own new test fixture.
Integration Builder: additive src/server/operations/math-lrc-phase-auth.ts,
tests/unit/math-lrc-phase-auth.test.ts and optionally own new test fixture.
Each owns only those new files plus its new completion report. Main owns this
TIP, manifest append, handoff and Main completion; no Main product coding.
Third Builder performs independent consequential review after files freeze.

## Specifications
1. Pure strict bounded wire request: descriptor (071 V2 wire), workspaceSlug,
   phase PROSPECTIVE/SOLVER_ACTIVE/REVIEW_ACTIVE/TERMINAL, sourceExpiresAt,
   grantExpiresAt; created binding(caseId/runId/commandId/solverOutboxId),
   solverClaim(SOLVER071 claim), reviewClaim(actual review job/outbox/worker/
   version/lease/attempt1 and distinct adversaryDispatchId/criticDispatchId),
   solverAttemptDigest and ledgerDigest only as appropriate for the phase.
   PROSPECTIVE has no created IDs/claims/results. SOLVER_ACTIVE has created+solver
   claim only. REVIEW_ACTIVE additionally has review claim+solver attempt digest.
   TERMINAL additionally has ledger digest. Reject unknown/extra/missing fields,
   getters/prototypes/cycles/oversized values before schemas/hash work.
   These are assertions selecting server rows, NEVER approved manifests or grants.
2. Freeze original descriptor/input. Effective read lifetime never exceeds earliest
   descriptor/source/grant/initial session/solver claim/review claim lifetime.
   Schema rejects requested lifetime extension. Phase progression is append-only:
   prospective -> solver -> review -> terminal; previous descriptor/created/claim/
   digest and expiry anchors unchanged, distinct solver/review IDs/dispatches.
   Pure validation creates no token or dispatch authority.
3. First-party server-only DAL resolves real BetterAuth session from cloned Headers,
   verifies fresh database session(id/user/expiry) and HUMAN user, active exact
   workspace/member/org, explicit mission+workspace+organization BEFORE mission
   capability evaluation. Require research.read/research.request/jobs.manage.
   Keep exact original actor/session/membership and initial session lifetime in
   private registry, never serialize headers/credentials/session IDs.
   Tests mock first-party session/DB boundaries; no production callback authority.
4. A versioned opaque READ-VALIDATION handle may bind exactly one request/phase.
   Every read and return revalidates original session/tenant/membership/capability/
   lifetime before and after asynchronous evidence lookup and before using it.
   Refresh reads actual rows, does not reuse caller context. Copied/deserialized/
   foreign-phase handles refuse. Errors expose only constant safe reason codes.
5. Nonprospective reads exact run/case/command/outboxes/jobs. Verify canonical
   sealed v4 LRC_METHOD_UNIT contract/digest, fixed codex-local/gpt-6-sol lane,
   original requester, mission, question/scope, command actor/type/succeeded/
   outcome and outbox exact topic/aggregate/payload/status and tenant.
   Current active claim requires RUNNING/lockedBy===workerId/exact version/
   exact unchanged live lease/attempt1/maxAttempts1. SOLVER_ACTIVE has no invented
   review row. REVIEW_ACTIVE reads solver SUCCEEDED (version=claimed+1, cleared
   lock/lease), run retained attempt digest and native solver result matching it,
   while only review job is RUNNING and owned. TERMINAL checks both actual jobs
   SUCCEEDED with cleared locks/leases, exact native review result matching actual
   review ledger digest/disposition; bounded recomputed attempt/ledger hashes.
   Use actual native result payload digests, not expanded071 fixture worker shape.
   Terminal read validation is not semantic ledger/replay/admission acceptance.
6. Minimal immutable DTO: phase, read-binding verification, actual native solver/
   review result digest if available (otherwise null), effective lifetime, and
   explicit sourceClosure UNSEALED, durableReplay NOT_INSPECTED, admission NOT_GRANTED,
   executionGate G2_NOT_AUTHORIZED, dispatchAllowed=false, proofClosure=false,
   globalLrc/formal/external/novelty NOT_ESTABLISHED. No raw DB rows, solver text,
   ledger/prompt/stdout, root paths, session, handles or foreign existence detail.
   No new route/action/UI/model call; consumers remain future072B.
7. Reads only; no slots/FS allocator/source manifest mint/durable commands/DB writes/
   worker dispatch/replay computation/receipt consumption/cleanup. Preserve071,
   all prior product/tests/history/proposals/old37/064 FAILED or UNKNOWN and all
   unrelated dirty work. No install/schema/migration/envfile/Git/billing/deploy.

## Acceptance criteria (scoped foundation, not full072)
- A1: strict bounded phase schemas and legal nonrenewing append-only progression
  pass; fabricated early review/extra fields/changed anchors fail.
- A2: actual-session DAL validates original HUMAN/session/member/exact mission
  tenant and all caps; revocation/drift/expiry before or after read refuses.
- A3: active solver exact ownership/version/lease/attempt/job/outbox/contract
  substitutions fail; no future review claim needed.
- A4: review succeeds with terminal solver+native retained attempt/result and only
  owned active review; changed solver result/foreign/reclaimed review fails.
- A5: terminal native jobs/results and recomputed attempt/ledger anchors verified;
  RUNNING/partial/mismatch refused; no synthetic expanded fixture result treated
  as native actual result and no proof/replay acceptance inferred.
- A6: copied handle/phase mismatch/mutated Headers/request/nonrenewing session
  and adversarial post-IO drift fail; sanitized DTO and bounded errors leak no data.
- A7: production G2/generic request/store refusal unchanged, no IO/model/DB write
  via validators, fixture helpers unavailable in production, source closure UNSEALED.
- A8: named new/declared regression tests, Main whole type/lint/build, independent
  consequential review on frozen bytes, preservation/fingerprint audit pass.

## Reports / remaining gaps
Completion reports quantify8 scoped ACs with tests/limitations and exact file SHA.
Full072 remains PARTIAL: upfront V2 reservation/maintenance compatibility, spent
bootstrap intent+fresh actual IDs, phased production storage and transport,
worker precritic replay hooks, native postledger+restart inspector, durable one-use
V2 loop consumption and sanitized UI. Full new executable closure and exact G2/
actual private-root permission remain pending;073 and fresh M1 NOT_RUN.
