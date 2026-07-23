# TIP-007 — Execution Fabric and Manual Provider Bridge

Status: `READY_WITH_DEFERRED — LOCAL VERIFIED`

Owner authorization: `2026-07-23`

Delivery boundary: local repository and local database only. Billing, remote
GitHub Actions, provider APIs, TIP-008 Verification Governance, and release
authorization remain explicitly out of scope.

## Task

Implement the provider-independent execution domain and deliver the Manual
Provider Bridge first. HIVE OS creates an immutable instruction artifact, an
operator performs the external provider exchange, and HIVE OS imports a
strictly validated Completion Report as a new immutable artifact.

This TIP establishes execution evidence and orchestration only. A provider's
claimed test results are not Verification Kernel evidence and cannot advance a
Mission to `VERIFYING`, `REVIEW`, or `RELEASED`.

## In Scope

- Governed execution TIPs and dependency edges.
- Skill runs and append-only agent attempts for Contractor, Builder, or
  Verifier execution roles.
- Manual provider/model attribution on every attempt.
- Immutable, SHA-256-addressed instruction and report artifacts.
- Strict Completion Report validation using the four Verify Standard sections:
  requirement coverage, scenario results, technical health, and overall status.
- Immutable resource usage records supplied by the report.
- Material deviation records and a fail-closed dependency gate.
- Workspace permissions, audit events, Control Room projection, and local
  migration/test coverage.
- Enabling `EXPLORING → BUILDING` only after execution readiness is proven for
  that Mission. Later lifecycle transitions remain guarded.

## Out of Scope

- Direct Anthropic, OpenAI, Google, or other provider API integration.
- Job queues, background workers, webhooks, billing, or token purchasing.
- Treating imported provider claims as independent verification.
- Verification governance, release authorization, deployment, or production
  migration.
- Editing or deleting immutable artifacts, reports, usage records, or prior
  attempts.

## Completion Report Contract

An import is rejected atomically unless every required field is present and
valid:

- `result`: `DONE`, `PARTIAL`, or `BLOCKED`.
- `summary`: non-empty operator-readable summary.
- `requirementCoverage`: implemented/total counts plus explicit `missing` and
  `deferred` arrays.
- `scenarioResults`: explicit scenario result/evidence entries (the array may be
  empty, but may not be omitted).
- `technicalHealth`: explicit build, static-analysis, test, accessibility, and
  vulnerability counts. `NOT_RUN` is explicit; missing values are not inferred.
- `overallStatus`: `READY`, `READY_WITH_DEFERRED`, or `NOT_READY`.
- `deviations`: explicit array, including an empty array when none exist.
- `resourceUsage`: explicit array, including an empty array when none exists.

The canonical JSON report is stored as a new immutable artifact. Parsed records
retain its artifact ID and the run retains both input and output artifact IDs.

## Dependency and Retry Rules

- A retry always creates a new attempt number and may reuse an existing
  instruction artifact only by reference. It never updates or deletes a prior
  attempt.
- An execution TIP can start only when all predecessors are complete.
- Any open material deviation raised by a predecessor blocks later dependent
  TIPs. Contractor-readable projection must expose the deviation before the
  dependent start can succeed.
- Resolving a deviation creates an audit event; the original imported report
  and deviation content remain unchanged.
- Concurrent start/import/retry operations use optimistic or row-level
  serialization and stable conflict errors.

## Acceptance Criteria

- Instruction artifacts are immutable and hash-addressed.
- Imported Completion Reports require schema validation.
- Provider/model/role and input/output artifact IDs are recorded.
- Retry never overwrites prior runs.
- Builder deviations are visible to Contractor before later dependent TIPs proceed.
- Missing report fields block completion rather than being inferred.
- Resource usage records are immutable and linked to the producing run/report.
- Cross-workspace references fail closed.
- `EXPLORING → BUILDING` requires execution readiness; all Verification and
  Release transitions remain closed.
- Control Room labels imported provider results as execution claims, not
  independent verification.
- Fresh and upgrade migrations, unit tests, integration tests, concurrency
  tests, E2E, lint, typecheck, and production build pass locally.

## Acceptance Scenarios

| ID | Scenario | Expected |
| --- | --- | --- |
| EF-01 | Issue a manual instruction | SHA-256 artifact and attempt 1 are recorded |
| EF-02 | Retry a run | Attempt 2 is created; attempt 1 is unchanged |
| EF-03 | Import a complete valid report | Report artifact, parsed report, usage, and run result commit atomically |
| EF-04 | Omit any required report section | Import fails; no partial records are written |
| EF-05 | Report a Builder deviation | Deviation is visible in Contractor projection |
| EF-06 | Start a dependent TIP with an open deviation | Start fails with a stable dependency-blocked error |
| EF-07 | Resolve the deviation and complete predecessors | Dependent TIP may start |
| EF-08 | Reference another workspace's Mission/TIP/artifact | Operation fails without disclosure |
| EF-09 | Concurrently import two reports for one attempt | Exactly one succeeds |
| EF-10 | Advance an unready Mission to `BUILDING` | Transition fails closed |
| EF-11 | Advance a ready Mission to `BUILDING` | Transition succeeds and is audited |
| EF-12 | Advance `BUILDING → VERIFYING` | Still fails with Verification Kernel required |
