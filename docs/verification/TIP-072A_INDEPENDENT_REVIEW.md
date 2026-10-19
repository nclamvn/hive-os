# TIP-072A independent consequential review

Date: 2026-10-04. Reviewer: tip071_store_builder, separate from both builders.
STATUS: FOUNDATION_ONLY / A6_PARTIAL / NOT_READY_M1.
Sealed TIP SHA256:
dbe979f4148b61625b8ebc0a421c42c884a441516072fa56138e6ff2b1ff90f5.

## Scope and outcome

Reviewed both final product modules, their complete new test/fixture files and
completion reports. Reviewed relevant existing native command, solver-worker and
review result construction read-only. No peer product edits were made. Only this
new review report was created. First-party boundaries were mocked offline; no
actual session, DB, private capture root, provider/model, browser, network,
installation, Git, billing or deployment operation was performed.

No P0/P1 execution/admission authority escape was identified in the final CLOSED
read-foundation scope. This is deliberately NOT a statement that all security
requirements or full TIP-072 are complete. The final asynchronous ownership
observation gap remains real: original strict A6 is PARTIAL, not repaired by
relabeling the DTO. Source closure, authenticated capture lifetime, historical
claim provenance, actual-operation linearization, durable replay admission and
M1 remain unestablished.

## Independent evidence

Final named run, all six execution flags OFF:

```sh
RESEARCH_WORKER_ENABLED=false MATH_PILOT_QUEUE_ENABLED=false \
LRC_CAMPAIGN_LOCAL_ENABLED=false RESEARCH_OPENAI_ENABLED=false \
RESEARCH_CODEX_LOCAL_ENABLED=false SANDBOX_DOCKER_ENABLED=false \
node node_modules/vitest/vitest.mjs run --project unit \
tests/unit/math-lrc-phase-binding.test.ts tests/unit/math-lrc-phase-auth.test.ts \
--maxWorkers=1 --no-file-parallelism
```

Start22:13:53 local; 2 suites / 232 tests PASS; duration838ms, exit0.
This is the final 123Core+109Auth run, not a sum of earlier checkpoints.
Earlier independent 123Core and 229Core/Auth runs passed on their then-current
pins; their counts are superseded by the final named run.

Additional in-memory Core harness: 10/10 controls passed with no file creation:
inherited array toJSON, array-index getter, descriptor toJSON, hidden nested
accessor (all zero invocations), negative-zero expiry, UTF-8 key budget,
changed earlier lifetime during progression, no authority literal in parsed
assertions, an undefined future review claim and a typed array. Initial harness
without test environment correctly refused fixture access with
PHASE_FIXTURE_REFUSED; rerun explicitly NODE_ENV=test/VITEST=1 passed. No fixture
guard was bypassed or modified.

An independent in-memory Auth harness first exposed the final-owned-row boundary
below. Actual Auth/DAL imports were intercepted with offline mocks, not called.
Its three observations were subsequently retained by the Auth builder as named
regression controls and rerun independently in the final232 result above.
Whole-repository lint/type/build/preservation checks remain Main-owned; this
report does not claim those results.

## Consequential findings and disposition

1. **Native solver result mismatch, repaired.** Earlier draft required an
   invented status field and did not require every native field. Final code
   matches the actual six-field worker result exactly: runId, resultDigest,
   sourceCount, findingCount, providerUsage, mathModelAttemptDigest. Digest and
   counter bounds and missing/extra-field controls pass. Native review result
   remains exactly caseId/disposition/ledgerDigest, not a fixture projection.
2. **Coherent null/primitive attempt hashes, repaired.** Final code requires a
   non-null non-array mathematical object before bounded recomputation. Four
   coherent forged-shape controls refuse. This is presence/hash validation, not
   semantic acceptance of its mathematics or a full proof schema.
3. **Post-claim shortened session envelope, repaired.** Main found a principal
   refresh after claim lookup could lower the observed lifetime without checking
   the original handle envelope. Final code compares the refreshed effective
   expiry after each claim lookup; the still-valid-but-shorter session control
   refuses. Nonrenewal and failed-handle quarantine remain enforced.
4. **Final asynchronous owned-row observation, unresolved for strict A6.** At the
   final fence, the job SELECT returns an observed row, then subsequent async
   principal checks finish before assertJob uses that earlier row. In the
   independent harness, changing backing lockedBy immediately after that final
   row observation still allowed the earlier matching DTO: solver final lookup
   16/16, review and terminal48/48. A later refresh sees the drift and refuses.
   Contractor-approved narrowing now returns OBSERVED_MATCH with constant
   COOPERATIVE_NON_ATOMIC; comments and report prohibit reuse as072B execution
   or admission authority. Three final-boundary controls explicitly demonstrate
   this limitation and next-refresh refusal. **Passing these controls does not
   establish latest ownership at return.** A critical072B operation needs its
   own current transaction/CAS fence; adding another finite observational read
   is not a general atomicity proof.
5. **Historical claims are assertions, explicitly deferred.** Native terminal
   SUCCEEDED rows clear worker locks and leases. Version+1 and retained native
   hashes are observable; caller-supplied earlier worker/lease/dispatch assertions
   are not authenticated history. DTO historicalClaims is always
   NOT_AUTHENTICATED. No historical-event or full role-capture proof was added.

## Scoped acceptance assessment

| Criterion | Independent assessment |
| --- | --- |
| A1 | PASS within pure foundation: strict bounded four phases, safe schema preflight, immutable detached data, exact-next append-only progression. |
| A2 | PASS within mocked read scope: actual first-party entry points, session/native identity, HUMAN actor, exact tenant/member/mission before three capabilities. Not a live-auth E2E result. |
| A3 | PASS within observed read scope: solver-only active claim, exact command/outbox/job/contract, no invented future review. |
| A4 | PASS within observed read scope: completed native solver with cleared lease, current owned review, bounded attempt/native result hash. No mathematical acceptance. |
| A5 | PASS within observed terminal read scope: native version+1/cleared locks, exact native results and retained ledger hash. Historical claim provenance and semantic admission explicitly not authenticated. |
| A6 | PARTIAL: ordinary observed pre/post drift, lifetime nonrenewal, opaque handles, safe errors and DTO privacy pass; strict current-at-return ownership is not established. |
| A7 | PASS for reviewed new-module boundaries: no execution/storage/replay/receipt/worker authority API; all gates stay CLOSED. Old refusal/preservation regression acceptance is Main-owned. |
| A8 | Independent source/test/fixture review and final named232 PASS complete; whole-pack QA and final Contractor acceptance remain Main-owned. |

No sealed8/8 acceptance or READY_M1 claim is supported by this review.

## Mandatory remaining boundaries

- Descriptor/source/grant expiries only lower this read envelope; no filesystem
  or durable source/G2 lease is authenticated by them. Fresh read handles and the
  bounded process-local session-ceiling map are not durable once-only admission,
  restart permission, or execution grants.
- Final DTO is immutable and sanitized: no raw IDs, session/cookie/Headers,
  private root, stdout, mathematical text, ledger, or opaque handles. Constant
  sourceClosure UNSEALED, durableReplay NOT_INSPECTED, admission NOT_GRANTED,
  G2_NOT_AUTHORIZED, dispatchAllowed false and proofClosure false; mathematical,
  formal, external and novelty conclusions stay NOT_ESTABLISHED.
- Full072B must separately complete historical/current-operation trust design,
  source/dependency closure, authenticated storage/transport lifecycle, bounded
  read-only V1 maintenance interoperability, actual agent replay integration,
  postledger/restart handling and passive UI. Do not reinterpret this foundation
  as completion of those items or change frozen071 production refusals.
- Repeated real auth/DAL calls were not latency-tested; mock timing is not proof
  of meeting the future aggregate5s finite-operation cap. An actual fresh M1
  remains NOT_RUN and requires separately authorized073 conditions.

## Final reviewed SHA256 pins

- src/modules/research-sandbox/math-lrc-phase-binding.ts:
  b034c4eca6722dcb9bf99c76688a908565af17eff0edf17c91e1067c9ba9f908
- src/server/operations/math-lrc-phase-auth.ts:
  0af85f8f66f6d7d311c0498a0fe3c09bb076eb5b6c9d21b6ff44ac20781fe107
- tests/unit/math-lrc-phase-binding.test.ts:
  011d810d86f05c5a993e7c51b0138baa95b6a25b7cbf633e0b0aac5c16fcb46e
- tests/unit/math-lrc-phase-auth.test.ts:
  fb2c445f3eee254130af748169368f2dbfcb5ac324536120ac582075812c9904
- tests/unit/math-lrc-phase-binding-fixture.ts:
  eb497d9a48220a5471803c73bcf1fd23ae299543608a286ade38d795dae09063
- tests/unit/math-lrc-phase-auth-fixture.ts:
  4a1c2076f746ef5b085b71fea3e0aeadaddd61c68acd4ed451dd94e2e95acef2
- docs/verification/TIP-072A_CORE_COMPLETION.md:
  29d6a1bad9f2fcb544ed8c7f63950484e49ca3f6610edefa5f11a664be2bafab
- docs/verification/TIP-072A_AUTH_COMPLETION.md:
  4e5a2d7ad5b8b9cbdd9ed00ef14bcc6a3a14d58739e9f5b582b8d267e69a8e20
