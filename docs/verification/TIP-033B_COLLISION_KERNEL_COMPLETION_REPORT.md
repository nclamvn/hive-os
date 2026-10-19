# Completion Report: TIP-033B collision-kernel agent evidence

Date: 2026-10-01. Builder role under Vibecode Kit v6.2.

## STATUS

DONE within the bounded implementation/test scope. Live subscription scientific
E2E, browser visual validation of a newly retained V2 cycle, production build,
formal proof, novelty review, worker startup, publication and deployment were
NOT executed or claimed. Contractor review remains a separate gate.

## FILES CHANGED

Created:

- `src/modules/research-sandbox/math-mixed-core-kernel.ts`: existing reviewed
  fixed TS tool moved unchanged into the module layer; 1..1,000,000 diagnostic
  cap and the six-row/nine-control packet remain identical.
- `src/modules/research-sandbox/math-mixed-core-kernel-replay.ts`: source-pinned
  isolated Python execution, exact comparison and sanitized failure record.
- `tests/unit/math-mixed-core-v2.test.ts`: six scenarios including both failure
  statuses, fixed controls, stripping/tamper/order/version compatibility.
- This Completion Report.

Modified:

- `scripts/operations/mixed-core-kernel.ts`: compatibility re-export preserves
  the existing operational CLI and research test import path.
- `math-mixed-core-agent.ts`: strict V1/V2 union, fresh dual replay, marker
  matching, prime-only typed registry ID/refutation and version-specific mandate.
- `math-cycle.ts`: explicit V1/V2 retained method marker without a migration.
- `math-cycle-kernel.ts`: new cycles select V2; continued historical rounds use
  the retained marker. Both replays must pass before any model call. Version
  mismatch, duplicate/late evidence and post-refutation calls are rejected.
- `adapters/codex-local-cycle.ts`, `adapters/codex-local-review.ts`: same root-bound
  envelope supplied to planner/portfolio, verifier, solver, critic and adversary,
  plus source analyst/challenger. V1 prompts do not receive newer V2 facts.
- Existing Math Pilot page: retained V2 prime examples, energy bounds, finite
  controls versus written infinite proof, source/output hashes and version.
  Historical V1 records explicitly say they do not contain V2 kernel evidence.
- `tests/unit/math-mixed-core-agent.test.ts`: unchanged V1 scenarios explicitly
  limited to its two refutable IDs, retaining historical schema/digest semantics.
- `tests/integration/math-pilot.test.ts`: seven-role transport, ordering,
  prime-only pruning and failure-before-dispatch fixtures on isolated test DB.

No changes to V1 packet producer, its Python source/pin, historical caps, source
ledgers, mathematical note or Contractor handoff/TIP. Unrelated dirty screenshots,
`pnpm-workspace.yaml` and Python bytecode were preserved.

## TEST RESULTS

Acceptance criteria implemented: 6/6. Live visual/scientific gates are explicitly
deferred rather than counted as evidence from test adapters.

| Criterion | Result | Evidence |
|---|---|---|
| K-01 | PASS | Fresh V2 dual replay; isolated DB confirms evidence committed before planner; injected baseline UNAVAILABLE and kernel MISMATCH/UNAVAILABLE retain failure and stop INTEGRITY_FAILURE with zero model calls. |
| K-02 | PASS | Seven-role fixture observes one envelope digest; portfolio existing signature also transports it. Version-specific mandates distinguish 6 fixed atlases, 9 controls and written infinite-family argument; no formal/novelty/root/target-hit promotion. |
| K-03 | PASS | Exact prime-only ID pruned after one planner call, before source/verifier/solver; V1 cannot refute that ID; V2 uses m132840/s531359, 527 versus 525. |
| K-04 | PASS | Rehashed corrupt/stripped/swapped-version evidence, root/hash drift, duplicate/late events and post-refutation calls rejected. Reordered JSONB accepted. Historical V1/older traces and round-2 marker behavior tested unchanged. |
| K-05 | PASS implementation | Existing cycle UI conditionally renders retained V2 only and marks V1 limitations. Operational CLI returns unchanged packet digest and PASS. New-cycle visual browser check not run. |
| K-06 | PASS | Unit and strict hiveos_test integration fixtures cover requirements; no real provider campaign inferred from fixtures. |

Commands and final results:

- `npm run typecheck`: PASS, zero type errors.
- `npm run lint`: PASS, zero errors/warnings.
- `npm run test:unit -- --maxWorkers=1`: **362/362 PASS, 69 files**.
- `npm run test:integration:strict -- tests/integration/math-pilot.test.ts tests/integration/math-formal-gate.test.ts`:
  **9/9 PASS, 2 files**, `--throw-deprecation`, only `hiveos_test`.
- `node --import tsx scripts/operations/erdos-straus-kernel-audit.ts`: PASS;
  packet SHA-256 unchanged
  `e4d7b0a4c03ab08c80a6d8a032dc9c8f4d117dd611ac61d981ffd25eb2820cf4`.
- `git diff --check`: PASS.

Kernel Python source pin:
`92414bdfe8bf351e19e07a4a6a7e6a4db322b279e2d34172643d52af54c30ec0`.
Execution uses `python3 -I -S -B`, fixed source/no arguments, allowlisted env,
10-second timeout and 256,000-byte stdout cap. No model code is executed.
The V2 replay output digest hashes trimmed JSON, unlike the historical CLI's
raw newline-inclusive stdout digest; neither historical CLI format nor V1 pin
was changed.

## ISSUES DISCOVERED

- Environment-only: sandbox denied the integration migration's local DB access.
  A scoped approved rerun used only the setup-guarded `hiveos_test`; passed.
- Initial full unit run exposed Contractor manifest omission of new TIP-033B
  and TIP-033C. Contractor refreshed the current manifest; founding manifest
  unchanged. Final full run passed.
- No remaining implementation blocker identified within this TIP. A live V2
  visual/scientific cycle remains unexecuted, as required by the boundary.

## DEVIATIONS / IMPLEMENTATION DECISIONS

- Reused the exact six-row/nine-control packet and Python source unchanged,
  moving TS into the module layer with a compatibility export.
- Kept `runMixedCoreAgentEvidence` default V1 for existing direct callers/tests;
  the cycle explicitly selects V2 for new roots and retained V1/V2 on later
  rounds. New writes cannot infer version from default alone.
- Prior TIP-033A transported evidence to five roles but not source reviewers.
  Under K-02 and Contractor approval, this TIP adds an optional envelope to
  source analyst/challenger, with no new calls or historical signature break.

## SUGGESTIONS FOR CONTRACTOR

Independently inspect a retained V2 cycle panel when an explicitly authorized
bounded live campaign is next run. Do not rewrite historical cycles to make
the newer evidence visible. The next mathematical target should concern the
specific target residue and escape/hitting conditions; occupancy counts and
energy alone do not establish a solution or research breakthrough.

## Contractor-discovered real-worker wiring correction

Independent inspection during the bounded live follow-up found an omitted
production wiring detail after the initial Builder report: the kernel and
adapter signatures accepted the envelope, but
`src/server/workers/research-sandbox-cycle.ts` dropped its fifth argument when
forwarding source analyst/challenger calls. Its solver scope also interpolated
the static baseline mandate rather than the version-aware mandate. The initial
seven-role integration fixture validated the kernel using injected agents and
therefore did not catch this worker composition gap. The initial K-02 evidence
was incomplete for actual worker transport, not a claim of live scientific E2E.

Fixed under the unchanged K-02 boundary:

- Actual worker now forwards `mixed` to both source-role adapter calls.
- Solver scope now uses `mixedCoreAgentMandate(mixed)`, retaining V1 isolation
  and the V2 scope/finite-controls/prime-counterexample cautions.
- Added `tests/unit/math-cycle-worker-transport.test.ts`, exercising the real
  `runResearchSandboxWorkerCycle` composition with mocked job/model boundaries,
  then calling its actual portfolio/planner/verifier/source/solver/review
  callbacks for both V1 and V2. It asserts exact envelope identity for all
  role adapters and full envelope plus correct version-specific mandate in
  solver scope. No DB, worker process, CLI model or network request is used.

Post-correction checks:

- Fresh `npm run typecheck`: PASS, zero type errors.
- Worker transport + V2 + V1 targeted tests: **16/16 PASS, 3 files**.
- Targeted lint on worker and regression test: PASS, zero warnings/errors.
- `git diff --check`: PASS.

The complete unit/integration counts earlier in this report describe the
pre-correction bounded slice; Contractor runs a separate final full suite.
No extra campaign, historical ledger rewrite, architecture change, Git write
or formal/novelty acceptance was introduced by this correction.

## Live launch conflict: safe UI correction

A subsequent Contractor browser check of an existing OPEN root hit
`CommandRuntimeError / IDEMPOTENCY_CONFLICT` before a cycle/job was submitted.
Read-only source diagnosis established that an unsteered request intentionally
uses `math-cycle:${caseId}` as its permanent organization-scoped key. The
durable-command guard correctly refuses reuse with a different actor,
workspace or payload hash, including changed limits. Its admission handler
also intentionally allows only one unsteered campaign per root. No command
key, actor guard, root admission or retained database record was changed.
The historical conflicting actor/limits were not guessed from this error.

The actual presentation defect was in `requestMathResearchCycleAction`: it
neither caught this expected conflict nor checked a stable `FAILED` outcome,
causing a runtime screen or apparently silent non-launch respectively.
Contractor authorized a minimal UI-only correction and will create a fresh
root through normal UI rather than bypassing historical keys.

Changes:

- `src/app/actions/research-sandbox.ts`: catch only the precise command
  conflict and expected research-domain rejection; preserve unexpected errors
  and the workspace-authentication boundary. Recognize `FAILED` outcome,
  revalidate and redirect outside try/catch to safe feedback.
- Existing Math Pilot page: bilingual notices explain history preservation,
  no automatic retry and the normal fresh-OPEN-root route. Both launch forms
  carry missionId solely for preserving the selected mission in navigation;
  it is not added to trusted command scope or used for authorization.
- `tests/unit/math-cycle-action.test.ts`: six regressions cover conflict,
  failed outcome, domain rejection, unknown error propagation, authentication
  boundary and successful revalidation. Real command key logic unchanged.

Next.js local server-actions and redirect guides were read before this edit.
Fresh typecheck PASS; action/worker targeted unit tests **8/8 PASS, 2 files**;
targeted lint zero errors/warnings; diff-check PASS. No direct DB mutation,
new model request, worker startup or Git action was performed by the Builder.
This is safe failure presentation, not proof that an existing root can launch
a second unsteered campaign.

## Live UI refresh backpressure correction

Contractor observed full-route polling every five seconds during slow reads
(3–10 seconds), with auth transaction expiry and a stalled browser session.
The existing refresh component used an unconditional interval without an
in-flight guard. This correction addresses that client-side load amplification;
it does not diagnose every transaction expiry or relax the five-second auth
transaction boundary.

- `research-refresh-scheduler.ts`: a 15-second **post-completion** timeout,
  synchronous shared lock for automatic/manual refresh, visibility pause,
  automatic idle pause and disposal cleanup. Returning from the void refresh
  callback is never treated as completion. The lock releases only after an
  observed pending-to-settled transition. Visibility return starts a fresh
  15-second wait, without catch-up bursts. Manual refresh remains available on
  a visible idle page, still single-flight.
- `research-live-refresh.tsx`: connects lifecycle/visibility/React transition
  observations to that scheduler, retains pending button feedback, and removes
  the old timestamp which falsely recorded “updated” at request dispatch. The
  existing `updatedLabel` prop is retained for call-site compatibility but no
  completion timestamp is rendered: transition settlement alone does not prove
  server data freshness or scientific completion.
- Nine fake-timer regression cases cover the 15-second boundary, dispatch-time
  locking, slow pending requests, completion-relative scheduling, hidden tabs,
  visibility changes during a flight, idle/manual behavior, disposal and
  synchronous failure without automatic retry. No DOM test dependencies added.
- Per Contractor's small observation, the occupancy paragraph changes only
  standalone `$92$` to plain `92` in both locales. The renderer intentionally
  leaves pure numeric dollar expressions literal; no renderer behavior changed.

Local Next.js 16 `use-router` and `refresh` guides were read before this edit.
Fresh typecheck PASS; refresh/action/worker targeted unit tests **17/17 PASS,
3 files**; targeted lint zero errors/warnings; `git diff --check` PASS.
No auth/DB timeout, durable command, pagination, provider, worker process or Git
change. Hiding/unmounting stops future client refreshes, not an already-sent
server request. If no pending transition is ever observable, the scheduler
fails closed rather than guessing completion or launching overlapping work.
Live browser responsiveness and server timeout frequency remain for Contractor
to inspect; these unit checks are not a browser or server-load benchmark.

## Authorized case-history presentation filter

After interval backpressure was corrected, Contractor still observed the full
mission's accumulated history hanging browser CDP on reload. Under a second
explicitly bounded UI follow-up, the Math Pilot page now accepts an optional
`caseId` search parameter and exposes a visible bilingual GET “Hồ sơ / Case”
selector with “Tất cả / All” plus actual cases from the already-authorized
selected-mission loader. The selector carries the current missionId; choosing
another mission via the existing separate form naturally resets the case filter.

- Missing/empty caseId preserves All compatibility. An exact loaded case ID
  renders only that case and its loaded cycle history, retaining latest/prior
  order. Unknown, cross-mission, non-string or repeated query IDs fail closed
  with no case history and a safe selection notice. No query ID is sent to a
  new loader or used to widen authorization. The selector labels include the
  first eight ID characters so the fresh root `9cc36477` is distinguishable.
- Calibration is computed on ALL authorized loaded cases BEFORE presentation
  selection; all calibration/request-admission UI gates likewise retain the
  full input. Only displayed history and its active-work refresh indicator are
  scoped to the chosen case. This does not change durable admission or review
  trust boundaries.
- The pure `selectMathPilotHistory` helper has ten regression cases covering
  missing/empty All, selected/latest+prior order, non-mutating calibration input,
  unknown/cross-mission/repeated IDs and a cycle with no authorized loaded root.

Next.js local page/searchParams guide read completely before editing. Fresh
typecheck PASS; selection/refresh targeted units **19/19 PASS, 2 files**;
targeted lint zero errors/warnings and diff-check PASS. No data loader, DB/auth
timeout, provider, worker, record or Git mutation. This reduces SSR history
validation/rendering and DOM size, not the original loader's database reads or
payload caps. Existing take100 cases/take20 cycles remain unchanged; a case
outside the loaded window deliberately cannot be selected here. Contractor
will navigate using the visible selector and inspect terminal retained evidence
live; these pure tests are not that browser acceptance evidence.
