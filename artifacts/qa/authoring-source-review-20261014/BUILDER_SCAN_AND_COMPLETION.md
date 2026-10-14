# Builder scan and completion: local numeric-source classification

STATUS: implementation complete; Contractor owns independent final verification,
visible browser QA and commit/push. No deployment.

## Focused scan

Existing TypeScript/React authoring shares `assessAuthoringQuality` across editor,
library and export. Historical revision quality reports are stored separately
and remain immutable. The prior source rule split text by sentence/newline,
accepted narrow immediate user-area attribution, and otherwise warned on units
without a same-sentence citation. It could not distinguish explicitly synthetic
quote inputs, locally checkable arithmetic or generated JSON evidence from
external numeric assertions.

The frozen saved-S3 content has exactly ten such warnings: five narrative and
five evidence-appendix warnings. Builder reproduced these without database
access or content changes. The existing `checkUpdatePack` provides bounded,
exact-decimal cost/unit arithmetic and was reused without modification.

## Files changed for this follow-up

- New `src/modules/authoring/source-classification.ts`: bounded local declaration
  syntax, two cost-expression forms, strict evidence-envelope parsing/replay and
  free-text projection. No generic expression interpreter or model call.
- `src/modules/authoring/quality.ts`: integrates those classifications; retains
  all original citation/trace checks and adds calculation/evidence review issues.
  Plain `m` and `cm` now also receive numeric-source checks.
- `src/i18n/authoring-copy.ts`: VI/EN source label updated; calculation/evidence
  warnings explicitly distinguish arithmetic review from missing citations.
- New `tests/unit/authoring-source-classification.test.ts`: 50 regressions.

## Acceptance evidence

1. Frozen S3 base plus packet are read unchanged. Current quality is 100/100,
   zero blockers/warnings and four unchanged style notes. No case, source or
   document IDs are special-cased in production logic.
2. Position-scoped arithmetic and local declared-price syntax do not grant
   immunity to adjacent real claims. Same-value actual survey quantities,
   measured accuracy, actual money, paid/invoiced amounts, unsupported `MATCH`
   text and bare TEST headings retain review warnings in VI/EN.
3. Evidence numeric detail is classified only after a bounded strict envelope,
   known unique section targets and exact regenerated transcript match. Wrong
   totals, altered transcripts, unknown/duplicate targets, malformed JSON and
   extra properties retain evidence warnings. Recomputed MISMATCH yields a
   calculation warning. Every request/source/unknown/label/reason string remains
   scanned; an inserted empirical assertion cannot inherit typed numeric status.
4. Existing unresolved citation and raw trace blockers operate on original text,
   including synthetic equations and evidence fields. They are never filtered
   by the numeric-source projection.
5. Assessment returns a current report without content or historic-report writes.
   Existing current-rules regression preserves historic stored quality; Main
   separately observed historical50 unchanged on saved revision3 in live QA.

## Technical checks

- New source-classification tests: 50/50 PASS.
- Baseline authoring/current-rules/update helper tests: 76/76 PASS before final
  tightening. Final combined rerun: **126/126 PASS** across four files, including
  all 50 new cases and the existing 76; no skipped tests locally.
- Typecheck and scoped ESLint: PASS, zero errors/warnings.
- Repository diff check: PASS.
- Frozen helper SHA-256 unchanged:
  `136e09c2f53a162c0288779559b67daa0372557c163ae49c000237365d282e4e`.
- No A/B packet/report rewritten, benchmark rerun/rescore, schema/dependency,
  database write, worker, provider call, research run, build, commit or push.

## Deliberate limitations

This is classification, not authentication of declarations or empirical truth.
The generated envelope establishes self-consistent typed inputs, section names
and replay output, not document-identity authority, quote validity, field data,
or technical acceptance. The quality API receives content, not a runtime grant.

Only quantity × currency price = amount and up to eight currency summands =
total are parsed. Units/currency and limits use the existing helper. Ambiguous
numeric separators or unsupported calculation syntax remain reviewable, not
guessed. Multiple grouped thousands establish a grouping character; otherwise
only integers and unambiguous one/two-place decimals are recognized in prose.
The underlying structured checker retains its broader exact JSON decimal scope.

Hypothetical declarations are intentionally narrow monetary/area phrases. A
synthetic header alone does not suppress later free-form clauses; supported
later clauses require their own local price/quantity/exclusion syntax. This is
not a natural-language fact checker and cannot promise recognition of every
paraphrase. Source warnings do not establish that a claim is false.

Vibecode was used as a focused scan/TIP/Builder report workflow. No new process
gate or UI panel was introduced. Existing small font-test scratch fixtures are
automatically removed by their test cleanup; no project copy, build folder or
user data was removed.
