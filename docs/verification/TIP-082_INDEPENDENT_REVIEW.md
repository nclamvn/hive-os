# TIP-082 independent review

2026-10-09 · non-own review · LEAN_RESEARCH_DEVELOPMENT_082 / ENGINEERING

Verdict: no concrete source blocker in the reviewed developer slice. This is
source review, not a syntax/type/test PASS or acceptance of the deferred R3 work.

Reviewed in full: `scripts/research/check.mjs`, `scripts/research/replay.ts`,
`tsconfig.research.json`, `vitest.research.config.ts`,
`tests/unit/research-development.test.ts`, the two research script entries in
`package.json`, TIP-082 and `DEVELOPMENT_DIRECTION.md`. Required AGENTS,
commitment protocol/latest checkpoint and Vibecode Kit v6.2 were read. No
execution, import, hash, API, Git, protected-path or old frozen-source inspection.
Only this review document was written.

| AC | Source finding |
|---|---|
| AC1 | Tests call the actual `runResearchChecks` orchestration with a substituted native runner. Syntax/type failure returns immediately; native-error/timeout result and remaining overall deadline have explicit controls. No downstream stage runs after these failures. |
| AC2 | Strict/noEmit/checkJs configuration names actual orchestration/replay/config/test sources; TypeScript follows their actual imports. No noCheck, ignored-source error or any facade was introduced in these files. Scope is this slice, not the whole repository. |
| AC3 | Vitest explicitly includes the existing permutation checker tests and the new development tests. Existing hostile/tiny-exhaustive test execution and totals require the Builder/Main's actual test output; this reviewer did not execute or re-audit those existing cases. |
| AC4 | Replay invokes the existing checker and labels its synthetic binding/known answer. Tests require the expected exact floor, strict rational bounds, arithmetic-under-lemma status and nonvalidated proof/formal-proof/official-score labels; changed floor must be rejected. It claims neither fresh solver capability nor novelty/authority. |
| AC5 | Two discoverable package commands and one direction document; no reviewed new source imports the frozen R3 lane or adds DB/API/issuance/build operations. The product security gates are not replaced by these trusted developer commands. |

The focused Vitest configuration sets envDir:false, setupFiles:[], node
environment and exact two-file inclusion, with no production setup/DB activation.
The check uses standard Node/TypeScript/Vitest, reports stage elapsed time and
nonzero results, and uses the remaining120s envelope instead of renewing each
stage. No custom dependency census, interpreter, authority engine or source-gate
stack is added.

Technical health: reviewer ran zero checks. Actual syntax/type/test/replay
results and aggregate validation time belong to the Builder/Main completion;
source confidence cannot substitute for them. The timeout test simulates the
native failure result at the real orchestration seam; it is not a measured
subprocess-kill/descendant-containment theorem. Standard tooling here is trusted
checkout tooling, not a sandbox for arbitrary model-generated programs.

Current package entries are `research:check = node scripts/research/check.mjs`
and `research:replay = tsx scripts/research/replay.ts`. No claim is made about an
unprovided whole-package predecessor diff or preservation hashes. No old R3
obligation, theorem closure, benchmark score or autonomous campaign is accepted
by this review. Main must retain its prior failure/deferred history.

## Narrow repaired alias readback

Main independently supplied the package diff: only the two research aliases were
added; existing dependency entries were unchanged. Initial actual check: strict
types passed and59 tests passed (~2946.6ms). Initial replay failed BEFORE the
checker because the tsx CLI's IPC setup returned EPERM; no arithmetic replay
success is claimed for that attempt.

Main authorized the one narrow repair. Updated actual package source was read:
`research:replay = node --import tsx scripts/research/replay.ts`.
This uses standard Node with the installed TS loader and leaves replay source,
candidate, arithmetic acceptance and authority labels unchanged. No source
blocker in that alias change. This is not a claim of an executed repaired replay;
Main's final actual validation remains necessary. Direct replay is an explicit
optional command, not a live grant; AC1 fail-fast applies to the check pipeline.
Reviewer still ran zero checks/imports/hashes/Git operations.

## Explicit ESM and actual-entrypoint smoke review

Preserved second failure: Main's repaired `.ts` standalone launch failed before
checker execution because it was transformed as CommonJS while containing
top-level await/import.meta. The passing strict typecheck and59 unit tests did
not detect that CLI configuration defect. Amended TIP-082 retires only the
Contractor's developer-repair count; the600s/120s limits and old R3 gates remain.

Read the actual repaired check.mjs/replay.mts/package alias/type configuration/
development tests and Builder completion append. No concrete source blocker.
The explicit `.mts` ESM entrypoint is named by the package command, focused
typecheck and test import; allowImportingTsExtensions is paired with noEmit.
Checker/candidate semantics and truth/authority labels are unchanged.

`research:check` now invokes the actual Node+tsx-loader `.mts` CLI as stage4,
after syntax/types/tests, within the same remaining120s budget. It refuses
nonzero/error/signal and also empty exit0; success requires the labelled known
arithmetic observation, support status, exact derived floor and completion
footer. Output is bounded by native maxBuffer1MiB and displayed. This is a
trusted developer smoke check, not an authenticated-output parser or proof
validator. The CLI completion footer is emitted only after arithmetic support.

Actual orchestration controls now exercise failure at all four stages, signal,
empty CLI, timeout, unchanged deadline/order and arithmetic mismatch. Source
denominator is11 new controls +52 existing =63 prospective tests, not a reviewer
execution result. Main's final actual combined check/standalone replay must
establish executable success; this source reread does not manufacture it.
Reviewer execution/import/hash count remains0; only this report was edited.
