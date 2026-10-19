# TIP-062 core exact-target selector completion

STATUS: DONE (bounded offline Core scope only).
Builder: tip062_core. Date: 2026-10-04, Asia/Ho_Chi_Minh.

## Delivered interface

`dispatchOutboxBatch` now accepts optional `outboxIds?: readonly string[]`;
`claimJobs` now accepts optional `jobIds?: readonly string[]`. Driver Builder
confirmed use of one captured exact ID and `first: 1` for each call.

- Omitted/undefined selector preserves historical tenant/type batch behavior.
- Supplied empty selector adds `AND FALSE`, selecting and mutating no work.
- Supplied selectors have at most 100 entries, each an exact nonempty string
  of at most 200 characters with no whitespace/control characters. Null,
  scalar, object, sparse, mixed-type and oversized lists refuse INVALID_INPUT
  before opening a tenant transaction. No trimming/ID rewriting occurs.
- Valid duplicates deduplicate after the original entry-count check. A fresh
  snapshot is made before asynchronous work, preserving caller-selected IDs.
- Bound ID predicates occur before every candidate LIMIT, including exhausted
  expired-lease cleanup. Exact IDs intersect existing tenant, job-type, status,
  availability, expiry and attempt predicates; they never replace them.
- Mutations retain exact IDs from locked rows and now also explicitly carry
  organizationId. Outbox follow-up reads retain tenant and locked-ID filters;
  job upserts retain the exact organization/outbox compound identity.
- `FOR UPDATE SKIP LOCKED`, transaction-local tenant identity, event writes,
  counters, versions and lease behavior are retained. Existing complete/fail/
  heartbeat expected-version functions and audit/authorization paths are not
  changed. No schema or resource-cap change.

## Files and final SHA256 pins

| Change | File | SHA256 |
|---|---|---|
| Modified | src/modules/command-runtime/jobs.ts | 052a37800a57d8541af4d071b69b5f2dc9f7cdd27a36e76d72fe47a491130789 |
| Modified | src/modules/command-runtime/kernel.ts | 81eab8a58400f0ebe5f61c12ac275c3c6c63ce22ad30c20a53c51e77521bfcc9 |
| Created | tests/unit/command-runtime-exact-selectors.test.ts | e8507370d916bf9527f89a1553d3b89bcbfadcf0943b3f59db76a7b2518260ac |
| Created | docs/verification/TIP-062_CORE_COMPLETION.md | Self-pin reported separately to Contractor |

Pre-edit source pins were jobs
`1e25c26d9018ed49ea6cd0a0e5b13b3ba109ea60e89c43626292f482eebd6b17`
and kernel
`307ed0c7e95bd51c8fe9ff7f8c70ea79ac54288f420ff67811910ee839a3fe6c`.
Existing integration suite remains unchanged:
`tests/integration/command-runtime.test.ts`
SHA256 `e154ee1bbb22f97fc7f7cb1a02bd76034ba0ab4ed7b31e2f521f948a4aa3a6fd`.
No historical source/test/report resealing or unrelated file edit by Core.

## Requirement evidence and checks

R1: PASS offline. New transaction harness exercises the actual exported
production functions and materializes real Prisma SQL fragments. Snapshot
assertions cover unrelated READY, expired retryable, exhausted RUNNING and
foreign-tenant jobs; unrelated, foreign and premature pending outboxes.
Selected cleanup, exact claims, terminal events, type/readiness intersections,
empty/foreign/missing selectors, duplicate dispatch prevention, snapshotting,
bound placeholders, SKIP LOCKED and predicate-before-LIMIT are covered.

R7 Core compatibility: PASS offline assertions for absent-selector legacy
behavior, unchanged existing first/lease bounds and untouched historical suite.
Full repository/browser/live acceptance belongs to Contractor, not this report.

Final command:
`node node_modules/vitest/vitest.mjs run --project unit tests/unit/command-runtime-exact-selectors.test.ts --maxWorkers=1`

Final result: 46/46 tests, 1/1 file, 222 ms total; tests 23 ms.
Started 09:06:14 local. Owned-file ESLint: exit 0, no diagnostics.
Whole offline TypeScript `--noEmit --incremental false`: exit 0 at initial
42-test implementation snapshot; final change only formats helpers and adds
four tests. Contractor should include final bytes in final whole-type QA.

Failure history: initial 36/42 passed; six new negative cases incorrectly used
Vitest `it.each` nested arrays, causing argument spreading (empty became
undefined; singleton became scalar). Converted cases to objects. Then 42/42
passed, strengthened with four additional assertions, final 46/46 passed.
No product guard/cap change or old test weakening was used to repair fixtures.

## Limits and handoff

The harness is not PostgreSQL/RLS/lock/concurrency execution or a live driver.
It interprets only emitted query predicates and asserts their SQL shape. Actual
DB integration, full historical regression, final whole types/lint/build,
R2–R6 and R8 are NOT_RUN by Core; no model/browser acceptance is claimed.

Builders performed no DB connection/write, server/worker/model/CLI login,
environment-file edit, install, migration, browser or Git action. Source selector
restriction does not independently establish actor authority; existing tenant/
authorization mechanisms remain authoritative. Mathematical freshness/root
classification is outside this runtime change and remains unchanged.

No known open Core finding. Suggested Contractor checks: independently inspect
all query/mutation constraints and run final types/lint plus relevant offline
regressions before any conditional live preflight. Keep exact selectors supplied
in the one-shot driver; generic worker defaults remain intentionally unfiltered.
