# Editorial checker precision — Builder completion

Date: 2026-10-14. STATUS: DONE for scoped implementation and local checks;
Contractor owns independent browser/audit acceptance. No build or deployment.

## Scan and decisions

Read repository instructions, handoff's product routing/latest checkpoints,
approved TIP, Vibecode Builder/report protocol and installed Next use-client
guide. Existing checker used sentence-wide numeric checks, context-free
certainty patterns and punctuation/AI-disclosure blockers. Editor recomputed
checks but list/export trusted stored reports. Existing strict v1 schema fits
the change without migration: categories are derived by issue code.

## Files changed

- `src/modules/authoring/quality.ts`: content/style helper; local input attribution,
  negation and technical accuracy handling; corrected percent/number boundaries;
  style advisory only; no new AI-disclosure finding; unknown codes remain content.
- `src/modules/authoring/kernel.ts`: list computes current checks from retained
  content and actual type. Historical read path remains unchanged.
- `src/modules/authoring/export.ts`: both renderers require `(content, documentType)`
  and independently compute current checks. No default OTHER or stored-report
  override. Existing PDF font repair is preserved.
- Export API route and `scripts/authoring/render-sample.ts`: updated the only
  production/sample callers to the required-type signature. Sample not executed.
- Authoring workspace/list UI and EN/VI copy: content/structure separated from
  style, heuristic/non-verification explanation, saved-only export explanation,
  and history scores labeled as recorded at save.
- Authoring README, expanded `tests/unit/authoring.test.ts`, new
  `tests/unit/authoring-current-rules.test.ts`.

No edit to report schema, database/revisions, mission button implementation,
dependencies, deployment configuration or research work.

## Verification

Final focused command (after final JSX cleanup):

```
npm run test:unit -- tests/unit/authoring.test.ts tests/unit/authoring-current-rules.test.ts tests/unit/mission-actions.test.ts tests/unit/current-build-profiles.test.ts
```

PASS: 4 files, 86 tests, 0 failures (09:20:54 local runner timestamp).
Includes 49 authoring cases, 3 current-rule/UI cases, 28 existing mission-button
cases and 6 existing build-profile cases. Existing Vite CommonJS/native-loader
future-compatibility warning remains; it is not a test failure.

`npm run typecheck`: PASS, 0 errors. First run exposed the sample-export caller;
updated it and reran successfully.

Scoped ESLint on all 10 changed TypeScript/TSX files: PASS, 0 errors/warnings.
`git diff --check`: PASS. No full build, integration DB suite, server restart or
new dependency install. Browser verification is independently performed by Main.

## Acceptance coverage

1. PASS: original B_FINAL fixture reads unchanged; current 100/PASS, no warnings.
   B_DRAFT still reviews its unattributed input quantity, but its technical
   accuracy/negated certainty no longer false-positive. Style remains visible.
2. PASS: EN/VI local attributed inputs accepted; same-sentence comma/conjunction,
   semicolon and later-sentence unsupported 99% remain reviewable. Decimal,
   thousands and percent cases covered. Technical phrase plus positive guarantee
   and negated guarantee plus positive certainty are independently inspected.
   Contractor's live finding of negated100% numeric warning was repaired narrowly:
   `cannot guarantee100%`/`không thể đảm bảo100%` forms (with normal spaces) do
   not assert a measured result; later99% or positive100% still warns.
3. PASS: style-only scores/status unchanged; AI disclosure alone creates no error.
   Broken citations, empty sections, raw traces and unsourced authority still
   block; unknown codes classify as content. Strict v1 round-trip unchanged.
4. PASS locally: mocked list actual-function checks, history unchanged and EN/VI
   server rendering; actual type required by renderer. Both PDF/DOCX style-only
   allowed and real blockers rejected. No stale report can authorize export.
5. PASS focused regressions/typecheck/lint. Contractor separately reports live
   EN/VI checks, current list100 vs stored history90/26, synthetic edits discarded
   and successful PDF/DOCX downloads. This report does not replace that audit.

## Limits and deviations

No scope expansion. Required renderer signature change intentionally removes
the stored quality report as export authority; all discovered callers updated.
Heuristics are deliberately narrow, not NLP/factual verification. They do not
recognize every paraphrase, prove claims, verify the cited source's contents or
validate a user-provided measurement. Citation checks still use same-sentence
markers; title/abstract quantitative checks were not expanded in this TIP.
Legacy issue-code names remain for v1 compatibility; current UI uses advisory
wording. A 100 score means no findings under these rules, not technical approval.

## Disk hygiene

No project copy, dependency install, build output or Docker work created.
Existing PDF font regression test created only its tiny
`codex-tmp-authoring-fonts-<date>-*` fixture and removed it in `finally` on every
run; no task scratch remains. No user/research data or material files deleted.
