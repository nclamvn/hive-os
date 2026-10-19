# TIP-062 driver completion

STATUS: DONE (local implementation/offline acceptance only). Live readiness,
DB/model/browser observation and R8: NOT_RUN by Builder. Contractor acceptance
and conditional activation remain separate.

## Implementation

Created orchestration, local runtime binding, explicit operations CLI and four
offline unit suites. Modified only the two local Codex adapters with optional
AbortSignal propagation. Defaults remain unchanged: 240000ms/process,
1048576B/stream, existing parsing/string limits, 10000ms reference import and
1800-second lease. No heartbeat, retry, review enqueue, polling or backfill.
Main approved this narrow seam before implementation.

Fixed workspace mathematics-pilot-lab-156de0, mission
31943653-4a30-462a-af11-ecd99f9ebfa2, preset ALLIKVERE_P83_14_V1, provider
codex-local and requested gpt-6-sol across all three roles. Operator must supply
one exact user ID or email; no first-admin fallback. Trusted context derives
from database records and active memberships, with read-only authorization
for research.read, research.request and existing jobs.manage. No new capability
or schema is introduced. Normal command API reauthorizes atomically at creation.

Preflight uses existing bounded loadMathCalibrationReadiness and recorded
ledger checks. Conflict query preserves the existing terminal DEAD_LETTER review
exception only when that case has no active cycle; a 500-candidate uncertainty refuses. Queue/campaign remain OFF in
preflight, which is readiness for explicit activation, not dispatch authority.
Run enables only local process queue/Codex/campaign flags before runtime imports.
Shared worker, OpenAI and Docker must be OFF. No environment files are read or
written by this CLI; its caller supplies existing runtime configuration.

One normal authorized request yields command/run/case/outbox IDs. Only its
solver outbox and exact job are dispatched/claimed, then only the automatically
created review outbox/job. Runtime verifies tenant, workspace, command, topic,
aggregate, attempts and identities. Core outboxIds/jobIds selectors are used
with first1. Only standard executeResearchJob/executeMathPilotAgentReviewJob
handlers perform execution and governed persistence.

One original monotonic 30-minute budget starts before dynamic runtime imports.
Remaining-budget reservations include login+execution per role, reference import
and retention. Owned adapter children receive the same signal; abort SIGKILLs
only those children and waits for close. No detached Promise.race leaves a job
handler running. Every role starts/returns in the private receipt with actual
thread/accounting data; a completed critic remains visible if adversary fails.
Unknown usage is null/unavailable, never invented zero. Preflight login status
checks ChatGPT subscription mode and emits no raw status/stderr.

Create-only wx, mode600, fsynced JSONL receipt begins before runtime loading and
retains stage starts/ends, identities, command outcomes, exact job IDs, role
attempts/usage, persisted outcomes and final status. Side-effect IDs are captured
inside stage callbacks before receipt/deadline postchecks. The final journal event
is authoritative; any expiry during a prior completion sync appends PARTIAL.
CLI errors after orchestration starts report EXECUTION_UNKNOWN, not NOT_RUN.
Disk failure may prevent final retention and is reported explicitly; do not retry.

Completion requires matching case/run/fixed contract, valid v5 review, exactly
3 attempted roles, both exact jobs SUCCEEDED/attempts1 and root conclusion
PARTIAL or INCONCLUSIVE. Existing TIP-061 same-facts, immutable input, context,
evidence, accounting and downgrade gates remain in the normal handlers.

## Acceptance and verification

- R2 PASS offline: exact solver/automatic review only, no retry after uncertainty,
  mismatched claim refusal, role order/count checks and strict persisted outcomes.
- R3 PASS offline: actor/tenant/capability/calibration/conflict failures precede
  login/model/create; CLI local guard runs before importing auth/DB runtime.
- R4 PASS offline: original clock/caps, already-aborted and in-flight owned child
  cancellation, timer/listener cleanup, no new role after expiry; IDs retained
  after immediate creation/claim expiry or receipt failure; final-sync expiry.
- R5 PASS offline: unsafe/missing review refuses completion, missing host outcome
  fields refuse, unknown accounting remains unavailable; adjacent TIP-061
  integration/adapter guards tested with mocked transports.

Final 2026-10-04 local checks:

1. Installed Vitest, 6 suites, 89/89 PASS, 1.95s. Includes 54 new driver tests
   (3 suites) and 35 adjacent existing tests (campaign integration, campaign
   adapters and Codex math). Provider transports are EventEmitter mocks; CLI
   tests spawn only Node with production/invalid environment, refusing before
   runtime imports. No Codex login/model, database query/write or API occurs.
2. Whole installed TypeScript `--noEmit`: exit0.
3. Owned eight-file ESLint: exit0, zero errors/warnings.

The above 89-test checkpoint was the initial freeze. Final supersession after
independent review: seven suites 114/114 PASS in 1.98s (79 new driver tests, four suites,
plus 35 adjacent existing tests); whole TypeScript exit0 and owned nine-file
ESLint exit0. The initial report SHA was
4b0b5cae610bf42f92fd56333997c05d49bd504394031c580f7f574cc8d7cfe6;
this update explicitly supersedes its source/test freeze without resealing any
historical Contractor artifact.

Three consequential findings were repaired before any live activity:

1. Installed pg-connection-string copies query parameters into connection
   configuration before its hostname fallback. The pure pre-import guard now
   admits only one schema=public annotation. Host/encoded host/Unix socket,
   service/port/connectionString/SSL-file and unknown query overrides refuse.
   Sixteen new offline controls preserve schema=public compatibility and reject
   duplicate/noncanonical schema annotations without importing DB runtime.
2. An old DEAD_LETTER review cannot exempt a case that simultaneously has a
   QUEUED/RUNNING cycle. New preflight selects bounded active-cycle presence
   and refuses before that exception; existing kernel/history is unchanged.
   Six mocked-runtime preflight controls exercise both statuses, safe terminal
   exception, missing terminal, running root and exact requester resolution.
3. Successful command outcome must not be journaled before returning known
   creation identities. Runtime now returns the exact target before the outer
   captured CREATED receipt; a case-lookup failure carries known command/run/
   outbox IDs into final PARTIAL reconciliation. Three additional actual-binding
   mocked controls cover success-journal refusal, outer CREATED receipt failure
   and case-lookup failure. No request or execution is retried.

Final narrow storage-robustness supersession: independent reviewer noted that
FileHandle.write may return a short byte count without throwing. Main approved
a complete-byte UTF-8 journal helper on the existing serial handle. It advances
only the returned bytes, rejects impossible/no-progress counts, and fsyncs once
only after the entire record. Write/sync failure remains partial/uncertain,
never durable completion. Eight new injected controls cover multibyte text,
adversarial short writes, zero/negative/oversized/fractional/NaN counts, partial
disk failure and fsync failure. Create-only wx/mode600 and all resource caps
remain unchanged; no DB/model/live action accompanies this repair.

Latest final-freeze checks: seven suites 122/122 PASS in 2.33s (87 new driver tests plus
35 adjacent existing tests); whole TypeScript exit0 and changed three-file
ESLint exit0. This source/test/report freeze supersedes previous completion
SHA60ede35b5e45d1cac74a1bc5b0b89213548cd21303a714174bb239e59b0ca4ed.

Initial whole typecheck identified nonexistent jobs.dispatch capability, then
closure-flow narrowing and table-test typing. Resolved using existing jobs.manage,
immediate captured identifiers and object-shaped test fixtures. Main source review
identified post-stage identity loss, eager guard import, incomplete final outcomes
and final-sync/CLI uncertainty; all repaired before freeze with regressions.
No caps, timeouts, existing tests or scientific contracts were weakened.

No DB integration, live CLI login/provider, server restart, browser, environment
file, schema/migration/install or Git operation by Builder. Whole lint/build and
independent acceptance are Contractor work, not claimed here.

## Operator commands

Run from /Users/os/hiveos with the existing local runtime environment supplied
by the operator. NODE_ENV must be development/test; DATABASE_URL must point to
loopback hiveos_dev/hiveos_test. Do not print secrets. Existing web process and
shared worker flags remain unchanged. The example email is operator-explicit,
not a driver default; replace with the exact authorized requester if appropriate.
Every invocation requires a NEW absolute receipt path; existing paths refuse.

```sh
node --import tsx scripts/operations/lrc-controlled-observation.ts preflight \
  --actor-email pilot.demo@hiveos.invalid \
  --receipt /private/tmp/tip062-preflight-UNIQUE.jsonl
```

Preflight requires Codex enabled but queue/campaign OFF. It checks only
readiness and subscription login, performs no DB writes/job mutation/model call.
If ready and R1–R7 independently accepted, the authorized one conditional run is:

```sh
node --import tsx scripts/operations/lrc-controlled-observation.ts run \
  --actor-email pilot.demo@hiveos.invalid \
  --activate-local --confirm-one-run \
  --receipt /private/tmp/tip062-run-UNIQUE.jsonl
```

An alternative actor form is `--actor-user-id EXACT_ID`; never supply both.
No model/workspace/mission/preset override is accepted. The result/receipt
includes the selected-case URL after retained creation. Failure is terminal for
this observation: do not rerun/create a replacement case without new authority.

## Resource and trust limits

Budget checks bound stage admission and kill owned asynchronous Codex children.
Synchronous JS, FS sync and database transactions are cooperative/non-preemptible
at this boundary; existing DB timeout/version/lease fences remain. A DB commit or
receipt sync may finish after expiry; this is then PARTIAL/unknown, never a
completed within-budget observation. This is not hard OS CPU/RSS or token-quota
attestation. Requested model provenance is not provider identity attestation or
independent-model/formal/external mathematical certification. Retained reference
is NOT_FRESH, all global obligations OPEN; no whole-campaign semantic replay.

## Final SHA256 pins

```text
03964b2764d94122b049a95dbd0d6c37188dbc155cc38ea8f71ecd1e8e5d43da  src/server/operations/lrc-controlled-observation.ts
ae62c093435774e622ff03bf1bd43aff6aa607bfbc9b21c1b2c4798f18c90a0a  src/server/operations/lrc-controlled-observation-runtime.ts
e0531135c8a4135db3f6f4e8389447619e6683a61cb5740c4fa800e96f3a1cdb  scripts/operations/lrc-controlled-observation.ts
55bea4705eee0cb86694841ac55e0db442b1dc29b70ff917dea3173735c2ad52  src/modules/research-sandbox/adapters/codex-local-math.ts
b6758781e1e270196e49728bfc8199f226e2d352ff9b1fe20a5c8e362b9caea2  src/modules/research-sandbox/adapters/codex-local-review.ts
08d6b23601d7a607a55d029ba783e741087c96a710851f70d228ffa1be3cee02  tests/unit/lrc-controlled-observation.test.ts
9f4795e533400dfce707de093d09531eb547ca1078b37abf90363d5c8ccdc9de  tests/unit/lrc-controlled-observation-abort.test.ts
8547bdb13a8346a395a92a6e74955b02f91a2c03aa1292aadd95a73bd2e6cdb1  tests/unit/lrc-controlled-observation-cli.test.ts
3fe9b51b946956706dfb1090d5136066e8b8201b03b32157488ee00e26607552  tests/unit/lrc-controlled-observation-runtime.test.ts
```

No historical source/artifact/report resealing. Receipt and new completion report
are operations evidence, not entries in the sealed Contractor manifest.
