# TIP-062 UI independent review

STATUS: PASS_WITH_SCOPE_LIMITS after consequential R6 repairs.
Reviewer: tip062_core, not the UI author. Date: 2026-10-04.
Reviewed implementation, shared validation dependencies and UI Builder completion
report. Frontend-design guidance applied to existing HIVE token/structure reuse,
not to a redesign. Reviewer did not change product or tests.

## Findings and resolution

Initial review found two R6 violations outside the new passive panel:

1. Selected campaign source-review and human-assessment forms remained reachable
   through legacy predicates. Another authorized reviewer could write on the
   observation case even though AI-review/cycle/polling were suppressed.
2. Legacy usage display used only the generic attempt schema/digest. A coherently
   hashed attempt with input=1, cached=2, output=1, reasoning=2 was accepted by
   that generic schema while campaign projection correctly returned INVALID,
   roles=0. Thus the surrounding route could inconsistently display usage that
   the campaign panel refused. This was reproduced by a no-write Node/tsx probe.

Both findings were immediately sent to Contractor and UI Builder. Builder's
repair encloses the entire legacy usage/attempt/reviewdesk/assessment workflow
in `!campaignCase` and additionally guards the two manual form predicates.
Campaign mathematical evidence, usage and ledger content now appear only via
the stronger validated projection. Noncampaign behavior remains in the original
fragment. No review/assessment fixture, authority or old resource cap was relaxed.

Independent TypeScript-AST probe on final page enumerated all nine selected-case
action forms: one numeric, two formal replay, one formal alignment, two formal
attempt, one source review, one AI review and one human assessment. All nine
are descendants of the true branch of the `!campaignCase` conditional. The
MathCycleDesk callsite is also inside that excluded branch. This is syntax-tree
and code-inspection evidence, not whole-page/browser execution.

Initial page pin was
`800db829446bbfbc81f1752b1ec45d029a2e476210d75425472f553061d61c78`;
initial test pin was
`26a84d212b82a78fd6e53464976a2bbbafdd43046f2306b5bcaa08747c840017`.
Final reviewed/tested pins below supersede only those new TIP-062 drafts, not
historical records. Panel/presentation bytes did not change during repair.

No known open finding in the bounded offline UI review.

## R6 checks

- Projection checks the entire fixed campaign contract body, canonical digest,
  attempt schema/digest, usage bounds and host evidence binding. Coherently
  rehashed different claims cannot gain admitted status. Campaign markers catch
  malformed v2/scope/attempt/ledger5 records and suppress legacy cycle routes.
- Shared read guard validates exact ledger5, matching evidence/facts references,
  root/attempt/research/ledger digests and recomputed oracle. Required CRITIC/
  ADVERSARY order, separate contexts (including solver separation), per-role
  requested CLI provenance and accounting are preserved. Invalid reviewer
  content/accounting are withheld; absent review never invents usage.
- VN/EN render explicitly retains NOT_FRESH mode, recorded import timestamp,
  unsigned local identity checks of 42 files, no fresh forest replay, finite
  one-prime I/J conclusions and PARTIAL/INCONCLUSIVE root restriction. Other60,
  lower independent cases, all23 APPLICATION, global14/15, formal/external and
  novelty boundaries are clear. Hash consistency is not transcript/execution
  or independent-model attestation.
- Actual KaTeX SSR includes empty-set glyph and `application/x-tex` annotation
  for the fixed finite formula, without katex-error, unsupported-TeX fallback or
  accidental form-feed/vertical-tab. `String.raw` preserves TeX escapes.
- Untrusted role prose is escaped by React; KaTeX uses existing `trust:false`,
  bounded expansion/size and source fallback. No executable HTML is admitted.
- New panel/projection introduce no importer/worker/provider calls, filesystem
  operations, effects, timers or write controls. Existing inert module imports
  are not invoked as runtime runners. Selected campaign skips cycle loading and
  substitutes a static manual-reload notice for ResearchLiveRefresh. Existing
  ordinary creation/calibration and GET selection forms remain unchanged; no
  campaign creation UI was added.
- Existing Panel/StatusBadge/MathText, surface/ink/status tokens and typography
  remain in use. Named region, status/alert semantics, native disclosures, list/
  definition semantics and non-color-only invalidity messages are present.
  `min-w-0`, wrap/break classes, flex wrapping and 2-to-4-column usage layout
  support narrow structures. Existing math CSS bounds internal overflow.

## Independent offline evidence

Initial run: 152/152 tests, 11/11 files PASS, 2.43s total, 719ms tests,
started09:10:52 local. It passed despite the route-level findings above, exposing
the limit of prior string-presence assertions.

Final repaired run: 153/153 tests, 11/11 files PASS, 2.57s total, 739ms tests,
started09:12:14 local. New panel suite contains26 tests; other127 are adjacent
existing cases. These are153 unique tests, not305 unique tests across reruns.
The independent invalid-accounting probe and AST form-containment probe both
exited0; they are separate diagnostics, not added Vitest test cases.

Command: installed `node node_modules/vitest/vitest.mjs run --project unit`
with `--maxWorkers=1` and these exact files:

- tests/unit/math-lrc-campaign-panel.test.ts
- tests/unit/math-lrc-campaign.test.ts
- tests/unit/math-lrc-campaign-reference.test.ts
- tests/unit/math-lrc-campaign-integration.test.ts
- tests/unit/math-lrc-campaign-adapters.test.ts
- tests/unit/math-text-render.test.ts
- tests/unit/math-agent-review.test.ts
- tests/unit/math-pilot.test.ts
- tests/unit/math-pilot-copy.test.ts
- tests/unit/math-pilot-history-selection.test.ts
- tests/unit/math-dossier-pagination.test.ts

Adapters/importers here use offline seams/temp fixtures, not live CLI/models/DB.
SSR wrappers at320/390/768/1366 validate markup/classes, not box geometry. Whole
async-page SSR, browser visual/overflow, screenshots/interactions, production
build and live R8 are NOT_RUN by this reviewer. Full final types/lint/build and
conditional readiness remain Contractor-owned. UI Builder's report separately
records its types/lint results and concurrent Driver typing limitation.

## Final reviewed pins

| File | SHA256 |
|---|---|
| src/components/research/math-lrc-campaign-presentation.ts | 80b6d2409a87cec31ce8711dabfd97c868cce4f1f1a29a3408a94dd8435c2b46 |
| src/components/research/math-lrc-campaign-panel.tsx | 2b062261a9c921e97f244e77b96fc2aae10f2cc34350ea5be3c570773ebba7c7 |
| src/app/w/[workspaceSlug]/research/math-pilot/page.tsx | e7309969093ea993d667ed972395c1315542a960ab53c1d2561d1ed0e8fe8594 |
| tests/unit/math-lrc-campaign-panel.test.ts | 3a8cdfbbe8f27d98a93f9f4bc459c39a7fa008f1c91200efeb0645335d672aaa |

UI completion snapshot read:
`docs/verification/TIP-062_UI_COMPLETION.md`
SHA256 `e522fc90ea0cd80d42e23cf132db638db8b7dcb649a3ed6be17427edcc9378bc`.
Builder may append/update report-only final whole-type results; Contractor must
pin that final report separately. Product/test freeze above is final reviewed
scope. This independent report's self-pin is sent separately to Contractor.

No product/test edits, DB connection/write, model/CLI login, browser/server/
worker/env/Git/install/migration/billing/deployment action by reviewer. Existing
dirty work and historical acceptance boundaries remain unchanged. This review
does not establish global mathematical proof, formal/external acceptance,
fresh semantic campaign replay or independent-model identity.
