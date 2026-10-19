# TIP-076B — Authenticated generic campaigns and effect-aware recovery

2026-10-05. BUILD approved as package2 of RESEARCH_CORE_V3_076, following
TIP-076A. Parent approved blueprint SHA256
35249249e02a4077b6d631304625ed98c36efc9f1097b976c3de7319cc4075c1.
No new human ceremony is required for this already approved engineering scope.

## Scope and ownership

Runtime Builder owns additive Prisma models/migration for ResearchCampaign and
append-only ResearchCampaignEvent, NEW generic campaign command/kernel/worker
modules under the research sandbox, and the minimal versioned job dispatch seam
in `src/server/workers/research-sandbox-cycle.ts`. Reuse current command/outbox/
jobs/leases/tenant authorization/storage, not a second scheduler. New focused
unit/integration/child-process fixtures and report
`docs/verification/TIP-076B_RUNTIME_COMPLETION.md` belong to Builder.
Coordinate core API and evaluator event projection; no ownership collision.

Main inspected the existing job dispatch, claims and integration setup. Read-only
probe on 2026-10-05 confirmed local localhost:5433/hiveos_test is reachable.
Only isolated QA DB writes/migrations are approved here. Do not apply migrations
to hiveos_dev or modify .env/.env.test. Prefer task-owned organizations/fixtures;
any existing truncateAll is limited strictly to explicitly guarded isolated QA.

## Required behavior

Authenticated request/read/revoke campaign commands enforce workspace/organization/
mission permission, exact contract/adapter/source envelope, unique action keys and
authority epochs. Generic actual worker consumes TIP-076A API; no scientific
switch in orchestration. Retain original candidate bytes and exact seals in
existing durable storage. Reviewed installed generic runtime/source bundle is
distinct from legacy37; no bare caller flag may approve arbitrary code.

Aggregate projection and append-only event history carry QUEUED/RUNNING/VERIFYING/
PAUSED_FOR_DECISION/RESOURCE_STOP/FAILED/COMPLETED, immutable target/mode, permanent
resource reservations/observations, next action, exact proofscope/obligation delta,
typed failures, human decisions and monotonic recovery counters. Event chains and
projection tamper/drift must fail closed. Database-level append-only/tenant RLS
and compound tenant bindings are required. Repeat commands cannot duplicate work.

Before each effect reserve all relevant allowances within one sealed TOTAL:
calls/tokens/checker work/compute/time and preapproved diagnostics. No resource
refund on failure/restart/replay. UNKNOWN usage remains UNKNOWN, not zero. Record
requested vs actually attested model identity separately. No actual model call
is authorized in this BUILD; use explicit controlled provider in QA, labelled so.

Effect-aware recovery follows parent blueprint exactly:
- A durable NOT_CROSSED invocation fence permits at most one replacement delivery
  of the same logical action, charging both; missing START alone is insufficient.
- Matching retained output is reused, not regenerated. Exact target/predicate/
  attempt/input/adapter/checker/runtime/source/authority/artifact binding required.
- Stable candidate may receive at most one preapproved separately reserved exact
  re-verification. Deserialized receipt JSON cannot establish mathematical closure;
  reconstruct under reviewed bindings through the host checker.
- START with uncertain completion pauses, never silently calls again.
- Exact mathematical rejection records only that predicate, pivots only within
  the approved method envelope, and cannot recycle rejected predicates or erase
  no-information counts through naming changes.
- Integrity/source/authority/TOTAL failure stops; no budget/source/goal repair.

Diagnostics are exact known stage references with sanitized typed codes, not
arbitrary paths or snippets: <=1MiB/10s per incident; <=8MiB/60s/8 incidents TOTAL,
inside the campaign resource envelope. Revocation and stale leases fence adoption
before effects and again before committing externally returned outputs.

Automatic rounds/pivots require no routine intermediate approval; consequential
target/source/budget changes, uncertain external effects needing a new attempt,
integrity and mathematical/public acceptance remain human gates.

## Acceptance and verification

R1/R2: request via existing authenticated durable commands, dispatch actual job,
verify each of three domains positive/negative, retain source/candidate/checker
scope; helper-only unit tests do not satisfy runtime integration.
R5–R9: actual isolated DB worker process crash BEFORE START, AFTER START, AFTER
retained RESULT against controlled provider durable invocation log. Verify no
duplicate dispatch, charged replacement, matching reuse, pause, resource and
revocation fences, append-only events, tenant isolation, target fidelity.
Boundary injection checks must use actual process/DB writes, not only mocked state.
Production external exactly-once is not established by controlled-provider tests.

Focused suites bounded externally to120s each; total test processes600s, report
timeouts/failures rather than blind repetition. Typecheck/lint separately bounded.
No user research DB changes, live API/LLM/subscription calls, p139/attempt5 reads,
legacy37 reseal, dependencies/env/Git writes. Legacy dispatch semantics must remain
unchanged. New source review and consequential independent review before final
acceptance; preserve source pins and actual test evidence in completion report.

## Routing

Work may begin now in additive files/schema while consuming coordinated core API.
After package2 integrated, evaluator Builder consumes durable event projection.
No full acceptance or release claim until evaluator/transfer/UI packages and Main
fresh verification complete. Report any material architecture deviation first.

## Main routing — standalone import isolation, 2026-10-05

The controlled standalone NFT audit failed twice because D's static import of
the legacy shared worker pulled historical scientific runners into the new UI
bundle. Authorize a NEW `src/server/workers/research-campaign-cycle.ts` facade:
reuse existing dispatchOutboxBatch/claimJobs/leases and the same reviewed campaign
worker, exact job/outbox selection, controlled environment guard, sanitized
failure handling. This is an import boundary, not a second scheduler. The shared
worker's already-added campaign-only branch delegates to it and refuses mixed
live configuration; all original legacy adapters and dispatch behavior remain
unchanged. D imports the new facade directly and updates only matching mocks.
Pin the new facade in the required source inventory. B owns facade/shared seam
and focused tests; D owns UI driver import and tests. Main re-reviews and repins
before any execution. Preserve both failed packaging observations. No legacy
scientific runner edits, old artifact reads, or bypass of the NFT rejection gate.
