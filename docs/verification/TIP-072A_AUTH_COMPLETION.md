# TIP-072A Integration Builder completion

Date: 2026-10-04. STATUS: PARTIAL_OFFLINE_FOUNDATION_PENDING_MAIN_VERIFY.
Sealed TIP SHA dbe979f4148b61625b8ebc0a421c42c884a441516072fa56138e6ff2b1ff90f5.
This closes this Builder's authenticated read-validation foundation only, NOT
full TIP-072, production execution, source attestation, replay admission or M1.

## Files created / frozen

- src/server/operations/math-lrc-phase-auth.ts:
  0af85f8f66f6d7d311c0498a0fe3c09bb076eb5b6c9d21b6ff44ac20781fe107.
- tests/unit/math-lrc-phase-auth.test.ts:
  fb2c445f3eee254130af748169368f2dbfcb5ac324536120ac582075812c9904.
- tests/unit/math-lrc-phase-auth-fixture.ts:
  4a1c2076f746ef5b085b71fea3e0aeadaddd61c68acd4ed451dd94e2e95acef2.
- This new completion report. No prior product/test/report was edited.

## Implementation

Only exports a server-only first-party actual-session read validator and opaque
READ handle registry. BetterAuth getSession disables cookie cache and refresh;
fresh native session row must match session ID/user/expiry. HUMAN user, exact
active workspace/member/organization membership and explicit mission workspace/
organization precede all three mission capability checks. Cloned Headers and
strict frozen Core input cannot be redirected after handle creation.

Original actor/session and both membership identities stay private. Current
phase's owned job, exact payload/outbox/type/status/version/unchanged lease,
attempt1/maxAttempts1 are rechecked around every evidence lookup, with fresh
principal validation before/after asynchronous lookup. Solver phase never queries
a nonexistent future review job. Review reads completed solver and owns only the
active review. Terminal reads cleared native SUCCEEDED jobs with version+1,
retained bounded attempt/ledger hash and actual native result payloads.

Native solver result is exactly the existing six-field worker payload, with NO
invented status property: runId/resultDigest/sourceCount/findingCount/providerUsage/
mathModelAttemptDigest. Native review result is exactly caseId/disposition/
ledgerDigest. Native payload digests are not expanded fixture worker projections.
Two fresh phase snapshots must agree before sanitized return. Observed missing/
changed claims, rows, native results, retained hashes and post-IO identity drift
refuse. This is not an atomic statement of latest ownership at return.

DTO readBinding is OBSERVED_MATCH and observationConsistency is always
COOPERATIVE_NON_ATOMIC. It is not VERIFIED/latest-current ownership authority.
DTO always reports sourceClosure UNSEALED, durableReplay NOT_INSPECTED,
admission NOT_GRANTED, executionGate G2_NOT_AUTHORIZED, dispatchAllowed false,
proofClosure false and global/formal/external/novelty NOT_ESTABLISHED. It contains
no raw rows, mathematical text, ledger, IDs, session, Headers, cookie, handles,
private root or stdout. Constant safe errors; failed handle refresh quarantines
that handle. No callbacks/fixture factory can mint production authority.

## Acceptance / self-test evidence

Two named new unit suites: 232/232 PASS (123Core+109Auth), start22:13:09,
duration678ms. This includes all109 controls in this Builder's own auth selector.
Prior checkpoint counts are not added. All six execution flags OFF. First-party boundaries mocked
offline; zero actual DB/private-root/provider/model/browser calls.
Targeted eslint on all three new files PASS (exit0, no diagnostics).
Main whole type/lint/build and frozen consequential review remain Main-owned.

| Scoped AC | Builder evidence / remaining ownership |
|---|---|
| A1 | Core strict schemas/progression dependency; Integration rejects malformed input before auth/DB. Core owns full A1 coverage. |
| A2 | Four phase positive controls; 21 principal/tenant/session/capability substitution controls, mission denial before caps; post-IO revocation. |
| A3 | No future review lookup; 27 solver contract/command/claim/outbox/early-result substitution controls; current-phase pre/post ownership fences. |
| A4 | Completed solver with cleared claim and owned review positive; 12 review drift controls; four coherent null/primitive attempt refusals; seven native solver payload shape controls. |
| A5 | Native terminal positive; 13 terminal result/ledger/job/cleared-lock controls; explicit historical-claim caveat below. No semantic ledger acceptance. |
| A6 | PARTIAL against strict current-at-return reading: ordinary pre/post observed drift, copied/foreign handles, nonrenewal and safe DTO controls pass. Three hostile final-boundary controls explicitly demonstrate observed-only/non-atomic DTO can return after ownership changes, then next refresh refuses. No execution/admission allowed. |
| A7 | New module performs only bounded native reads/auth checks; no FS/provider/worker/action/route/replay/command/receipt imports or execution mint. Historical refusal regressions remain Main QA. |
| A8 | Standalone tests/targeted lint pass; Main whole QA, preservation audit and peer review pending. |

Four directly owned behavioral ACs A2–A5 have offline controls. A6 remains
PARTIAL: exact atomic current ownership at return is not established. A1/A7/A8
require the declared Core/Main and independent review evidence. Contractor plans
at most7/8 foundation acceptance after remaining QA; never sealed8/8 or production
security acceptance. Passing hostile controls measure honest limitations, not
repair of the current-at-return gap.

## Decisions / deviations / limits

1. Contractor-directed additive DTO historicalClaims NOT_AUTHENTICATED. Terminal
   locks/leases are cleared in actual native rows. Current terminal status,
   version+1 and native results can be read-validated; caller-provided historical
   worker/lease/dispatch assertions are NOT authenticated provenance. This pack
   does not inspect durable CLAIMED/SUCCEEDED event history or full role captures.
   Future072B must not reuse these READ handles as execution/admission authority.
2. Source/grant/descriptor expiries are caller assertions that only lower this
   read envelope. They are not authenticated G2 approval/source capture lifetime.
   Earliest observed session expiry is immutable within the handle; private
   process session-ceiling registry is bounded1024 entries and refuses new
   entries at capacity, no pruning/reset/automatic recovery. Fresh read handles
   do not constitute durable once-only admission or restart execution permission.
3. Entire actual first-party session/tenant/capability and current job checks are
   intentionally repeated instead of memoized. This can be expensive against a
   live database. No measured production latency claim; the future aggregate5s
   finite IO/check/receipt ceiling must be assessed before072B dispatch wiring.
4. Native attempt/ledger hashes and basic presence/version/row anchors are
   verified, not full mathematical or semantic correctness. Synthetic fixture
   objects deliberately cannot constitute scientific evidence or M1 success.
5. Trusted DAL observations remain bounded cooperative checks, not malicious-host
   attestation or a cross-DB/filesystem atomic transaction. Source closure remains
   UNSEALED (scan77–81 files versus current42 limit); no source omission/widening.
6. Existing tenant helper uses normal transaction-local RLS setup; no application
   table write is invoked. BetterAuth refresh disabled for this read-only path.
7. Main pre-freeze P1 found post-owned-claim principal refresh could lower observed
   expiry without comparing it to handle expiry. Repaired by enforcing the same
   nonrenewing lifetime comparison after each claim lookup; hostile still-valid
   shorter-session control added. Earlier draft hashes/test counts superseded.
8. Independent reviewer reproduced ownership drift after the final job row was
   observed, during subsequent asynchronous principal checks. Contractor narrows
   the DTO to OBSERVED_MATCH/COOPERATIVE_NON_ATOMIC and retains original strictA6
   PARTIAL; three actual hostile final-boundary controls cover solver/review/
   terminal and next-refresh refusal. This does not make read validation atomic.
   NEVER consume these READ handles/DTOs as072B execution/admission authority:
   an actual critical operation requires its own fresh transaction/CAS ownership
   fence. No event-history/CAS implementation or expanded scope in this pack.

No G2, actual private filesystem permission, slots/reservations/claims/commands,
scientific DB fixtures, model/provider calls, routes/actions/UI, receipt admission,
workers/shared queues, old071/37/history/064 repairs, install/schema/migration,
envfile/Git/billing/deploy changes. Full072B and073/M1 remain NOT_RUN.
