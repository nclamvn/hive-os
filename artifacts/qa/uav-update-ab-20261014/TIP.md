# Lean UAV document update — approved product experiment

Owner approved proposal: update existing dossier from changed inputs; deterministic
checks and scoped edits; fair same-model A/B; visible local browser; no deploy.
Contractor applies Vibecode small scope, one Builder and independent browser QA.
No new architecture approval needed: reuse editor/save/revision/export.

## Requirements

R1. Add optional collapsed update panel to authoring. Plain-language request,
bounded structured patch input, before/after by section, and Apply to draft.
Clearly state manual Codex bridge, no automatic provider. Existing explicit Save
persists revision; applying does not save/export. EN/VI labels, keyboard usable.
Provide a copyable prompt/context so no hidden database access is required.

R2. Patch binds documentId/baseRevision and each existing section's exact old body;
reject stale/mismatched/duplicate/unknown edits atomically at apply. Preserve
headings/kinds, citations/artifacts/imports and untouched sections. Editing after
preview invalidates affected proposals. No hidden replace-all or automatic save.

R3. Tiny deterministic checker, no eval or new dependencies: cost lines quantity
times unit price plus sum, compatible area units ha/km2/m2, explicit currency,
optional excluded bundled line with reason; unknown quantity/price stays unknown,
not zero. Claimed total checked with explicit numeric precision/limits. Also a
simple measured-value versus threshold comparison with compatible units. Display
input provenance and limitations: correct arithmetic is not verified field data,
quotation validity, commercial approval, or technical acceptance. Checks never
rewrite numbers silently. Invalid/mismatched calculations cannot be labeled pass.
No generic workflow engine or math research module coupling. Report bounded shape
of helper before implementing if simpler alternative materially changes scope.

R4. Persist request/source context/check summary on normal revision via concise
changeSummary; retain full provided evidence as one ordinary appendix section
(previewed, labeled scenario/unknowns, not a new database/schema). Respect section
limits, do not overwrite existing user section. Never manufacture a citation.
Checks are reviewer assistance, not a new global export gate. Applying failed
checks may be blocked locally until proposal corrected, without altering normal
editor/export permissions.

R5. Tests: stale doc/revision/body, duplicate/unknown keys, atomic apply,
provenance preserved, unknown vs zero, ha/km2 equivalence, bundle exclusions,
incorrect total, invalid numbers/units, compare boundaries, same packet changed
after preview, no write permission. Typecheck/scoped lint/focused regression;
Main browser: create separate TEST dossier, intake/preview/reject invalid/apply/
save/reload/export. Original DOC-BD12906E unchanged. No full build unless needed.

## Experiment boundary

Separate COMMON_INPUT/PROTOCOL/EXPECTED files will be frozen before solvers run.
Six independent update scenarios from same source proposal, same output contract,
same inherited Codex model, equal600-second branch cap; no paid API/web/new source.
Both can calculate and self-check. A uses direct tools; B additionally receives
the actual HIVE update checker feedback, repair only for concrete detected gaps.
This measures tool-assisted update behavior, not autonomous API integration or
model intelligence. Main exposes outputs through browser. No guessed human time:
human30% saving criterion remains unmeasured without a human timed trial.

## Constraints / delivery

No dependencies, DB migration, new worker/provider, campaign, auth change, commit,
push or deployment. Do not read environment credentials. Reuse .next dev; no new
build/temp copy. Keep scope small. Builder returns scan, patch contract for solvers,
tests and Completion Report. Main maintains experiment and independently verifies.
