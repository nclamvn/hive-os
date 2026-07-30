# TIP-022Q: Comprehensive QA and Local Stress Verification

## HEADER

- TIP-ID: TIP-022Q
- Project: HIVE OS
- Module: Cross-cutting verification and local operations
- Depends on: TIP-022
- Priority: P0
- Authorized by: Owner, 2026-07-30

## CONTEXT

- Working directory: `/Users/os/hiveos`
- Baseline commit: `330f4c9`
- Existing verification stack: Vitest unit/integration, Playwright E2E,
  production startup checks, migration/recovery rehearsal, dependency policy,
  and bounded local load observation.
- Existing regenerated visual baselines are Owner work and must not be staged,
  reverted, or overwritten outside the normal E2E capture behavior.

## TASK

Execute a comprehensive local release-candidate verification of the current
HIVE OS repository. Exercise the complete automated E2E suite and production
health/load behavior, strengthen the local load harness where necessary to
produce a bounded stress profile, fix any in-scope correctness defects found,
and record quantitative evidence without claiming production capacity.

## REQUIREMENTS

### REQ-022Q-01: Full functional regression

Run typecheck, lint, unit, integration, production build, production startup,
dependency policy, and the complete Playwright E2E suite. Record exact pass,
fail, retry, and test counts.

### REQ-022Q-02: Comprehensive E2E coverage

Run every committed E2E specification, including authentication, workspace and
tenant isolation, mission lifecycle, Truth, execution, verification, reports,
preferences, responsive shell, accessibility, and visual scenarios. A retry
must be reported rather than silently treated as a clean first-pass result.

### REQ-022Q-03: Bounded local stress profile

Exercise production standalone health and sign-in surfaces at multiple
concurrency levels. Record request count, throughput, p50, p95, p99, maximum
latency, HTTP status classes, failures, and process resource observations.
The run must fail on transport errors or HTTP 5xx responses.

### REQ-022Q-04: Safety and claim boundary

The stress run must use only local test/rehearsal configuration, start and stop
its own server, avoid external providers, and label results
`LOCAL_LOOPBACK_NON_SLO`. It must not be represented as production capacity,
an external staging result, or a production SLO.

### REQ-022Q-05: Evidence and disposition

Create Completion and Verify reports. Every failure must be fixed, explicitly
deferred with severity and rationale, or recorded as an external blocker.

## ACCEPTANCE CRITERIA

1. Given the current repository, when all local quality gates run, then their
   exact outcomes and counts are retained in the Completion Report.
2. Given the complete Playwright suite, when it runs, then every committed E2E
   specification is collected and all final scenario outcomes are recorded.
3. Given the production standalone build, when the stress profile runs, then
   multiple bounded concurrency stages complete with zero transport and HTTP
   5xx failures.
4. Given each stress stage, when results are emitted, then throughput, p50,
   p95, p99, maximum latency, status classes, and process resource observations
   are machine-readable.
5. Given any test or stress failure, when QA completes, then its severity,
   affected requirement, evidence, and disposition are documented.
6. Given only local loopback evidence, when readiness is reported, then remote
   CI, external staging, production SLO, production release, and public release
   remain explicitly unverified or unauthorized.

## CONSTRAINTS

- Do not change approved architecture or product behavior merely to improve a
  benchmark.
- Do not contact external provider APIs or use production data.
- Do not silently accept retries, 5xx responses, transport errors, or data
  corruption.
- Do not claim that finite local stress testing proves absence of all defects.
- Preserve unrelated working-tree changes, especially regenerated screenshots.

## REPORT FORMAT

Create `TIP-022Q_COMPLETION_REPORT.md` and `TIP-022Q_VERIFY_REPORT.md` with
requirement coverage, scenario results, technical health, issues, deviations,
and a bounded readiness conclusion.
