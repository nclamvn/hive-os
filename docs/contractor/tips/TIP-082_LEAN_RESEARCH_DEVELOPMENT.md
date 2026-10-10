# TIP-082 — Lean research development recovery

2026-10-09 · Contractor · ENGINEERING · Owner-directed strategic correction.

## Decision and predecessor

Direct Owner instruction: focus on correcting the over-engineered development
direction, reduce complexity, restore basic syntax/type/tests early, demonstrate
value through a short reproducible research flow. This implements that direction,
not another attempt at the failed R3 A/B target.

Predecessor: `TIP-081A_P3_R3_TOOLCHAIN_CLOSURE.md` and
`TIP-081A_P3_R3_ARTIFACT_TOOLING_COMPLETION.md`, latest checkpoint
"R3 A bootstrap failed / first-effect STOP — 2026-10-09". Preserve those exact
files and old frozen source/configuration. A consumed, B not run, 8 obligations
open, aggregate 876382.767416/900000ms, remaining 15940.727166ms: unchanged.
Old target is DEFERRED_UNACCEPTED, not completed, reset or replaced by a test pass.

## One deliverable

An ordinary developer lane that detects cheap defects early and replays one
existing arithmetic result without a custom source interpreter or process-proof
manifest. One check command, one explicit engineering replay, one short direction
document. This is not an autonomous research campaign or production authority.

## Builder task

1. Add `research:check`: standard Node syntax checks, focused strict TypeScript
   checking of actual imported source, then focused tests. Fail fast; nonzero
   status and elapsed time visible. Use installed tooling, not new dependencies.
2. Scope types/tests to the existing permutation checker and its dependencies,
   existing `permutation-checker.test.ts`, plus small orchestration/replay tests.
   Do not pretend this checks the entire dirty repository.
3. Add `research:replay`: invoke the existing exact rational checker on a clearly
   labelled known public engineering candidate, print arithmetic bounds/result
   and explicit proof/novelty/official-score limits. No paid API, fresh-model claim
   or invented authentication. No writes to evidence database or issuance lane.
4. Small orchestration code only: standard child process timeout/exit reporting,
   no custom parser, dependency census, grants, abstract workflow engine or UI.
5. Add focused tests for fail-fast ordering and failed/timeout checks. Reuse
   existing independent small-permutation tests rather than duplicate mathematics.

## Acceptance criteria

- AC1: syntax/type failure prevents downstream test/replay invocation; tests
  exercise the actual orchestration rather than a detached policy helper.
- AC2: focused strict typecheck covers actual checker/replay source and imports;
  no `any` facade, ignored source errors or noCheck. Report scope explicitly.
- AC3: existing hostile intake, wrong-answer and tiny exhaustive tests run.
- AC4: replay distinguishes arithmetic support under a lemma from proof
  validation; exact floor and strict rational bounds visible; tampered answer
  cannot receive arithmetic support.
- AC5: one discoverable command/document; old R3 executable/config/criteria and
  security/authentication/replay gates untouched, no campaign automatically opens.

## Implementation and verification envelope

Owner's change request authorizes ordinary scoped implementation validation.
This is a new DEVELOPMENT_CHECK envelope, NOT a recycled R3 effect grant:
at most 600s aggregate validation subprocess time, each command <=120s, including
Builder and Main; at most one repair-and-validation iteration after first result.
Record actual stage durations; stop on timeout or unresolved second result.
No old R3 imports/checks/derivation/A/B/issuance, protected attempts/leases/native
trees or `.env`; no build/install/DB/browser/API/Git/billing/deployment operations.
Work in current checkout; no scratch project copies or new distDir. Standard
tools are trusted developer tooling, NOT a sandbox for untrusted model code.

## Contractor direction / process decisions

Retain five product responsibilities: problem/source dossier, adaptive strategy,
solver/critic separation, appropriate independent verification, evidence/UI.
Keep research truth and runtime security boundaries. Retire bespoke dependency
census and per-helper accounting from the DEFAULT developer workflow; retain
historical files for diagnosis. Do not delete code or weaken existing live gates.

Use Vibecode Kit with one Builder, one non-own review and one completion report.
No new source-only certificate stack: execute cheap technical checks first.
Next mathematical campaign requires its own target/closure/resource decision.

## Report

Give files changed, stage outputs/durations, AC results, limits and remaining
work. Standard validation success is developer-slice acceptance, not global
architecture readiness, theorem closure or a FrontierMath capability score.

## Contractor correction after actual CLI failure

Initial check passed but tsx CLI IPC failed. A launcher-only repair uncovered a
second real defect: `.ts` was transformed as CommonJS while using top-level await
and import.meta. Tests/typecheck do not establish executable entrypoint health.
Use explicit ESM `.mts` and include the actual replay CLI smoke in research:check.
No mathematical checker or candidate semantics change is authorized.

The one-repair restriction above was Contractor-created, not an Owner resource
condition. Under Vibecode's minimal-process judgment it is retired for this
ordinary new developer lane: scoped repairs may continue within the SAME600s
aggregate bound; each invocation<=120s. Stop on timeout/budget exhaustion or a
new scope/security problem. This does not revise any R3 attempt/time/gate rule.
Both failures remain in completion evidence. No success-by-empty CLI is allowed.
