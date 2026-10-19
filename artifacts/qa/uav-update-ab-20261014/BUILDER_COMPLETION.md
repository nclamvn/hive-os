# Builder completion: lean UAV update panel

STATUS: DONE for implementation and focused local checks; independent browser
and paired experiment remain Contractor-owned, not claimed complete here.

## Files

- `src/modules/authoring/update-pack.ts`: bounded packet schema, exact decimal
  arithmetic on canonical JSON number values, unit conversion, threshold checks,
  atomic application, normal evidence appendix and concise revision summary.
- `src/components/authoring/authoring-update-panel.tsx`: collapsed manual bridge,
  copyable context, packet intake, section old/new preview, visible check output,
  evidence preview, explicit unsaved apply and stale-preview invalidation.
- `src/components/authoring/authoring-workspace.tsx`: attaches panel to existing
  draft and explicit revision-save path; no backend action/API changes.
- `tests/unit/authoring-update-pack.test.ts`: 23 new test cases including EN/VI
  read-only render controls.
- `src/modules/authoring/README.md`: scope, numeric policy and limitations.

## Verification

- 75/75 focused unit tests pass across authoring, current rules and update pack.
- Typecheck passes, zero errors.
- Scoped ESLint passes, zero errors/warnings.
- `git diff --check` passes.
- No production build, package install, database write, worker, provider call,
  research run, commit, push or deployment by Builder.
- No temporary project copy, build output or dependency environment created.
  The existing font regression creates and automatically removes its own small
  `codex-tmp-authoring-fonts-20261014-*` fixture (two executions by this Builder);
  no user data was removed.

## Requirement coverage

- R1: collapsed EN/VI panel, plain request, copyable context and explicit manual
  bridge. Before/after preview and Apply do not save; existing Save persists.
- R2: wrong document/revision, exact old-body mismatch, duplicate/unknown keys
  reject atomically. Original headings/kinds/citations/artifacts/imports retained.
  UI invalidates preview on changed content, request or JSON; helper revalidates
  packet at apply. Write permission checked in UI and helper, existing server
  capability gate unchanged.
- R3: quantity/price calculations, area conversions, explicit currency, bundle
  reason, missing values, threshold units/boundaries and numeric limits tested.
  Unknown cost with numeric claimed total rejects as unsupported. Null stays
  UNKNOWN. Decimal 1.005 + 0.105 rounds per line to 1.01 + 0.11 = 1.12.
  Exact 57 cm versus 0.57 m boundary matches without binary float drift.
- R4: request/source/unknowns/declared calculations and resulting checks retained
  in an ordinary appendix and revision summary. Existing appendix not overwritten;
  64-section limit enforced. No citation created. Ordinary export policy retained.
- R5: unit checks complete. Interactive changed-JSON-after-preview, visible
  desktop/mobile browser, save/reload/export and A/B remain Main verification.

## Decisions and limitations

Contractor clarified valid failed threshold result as NOT_MET, retainable and
nonblocking: negative evidence must not be hidden. MISMATCH is reserved for
unsupported/incorrect cost claims; INVALID rejects incompatible or oversized
calculations. No global export gate added.

Checks validate declared structured values, not every number in proposed prose,
source truth, field measurements, quote validity or technical acceptance.
Input JSON is interpreted as JavaScript numeric values then canonical decimal
rationals; callers needing more precision than JSON number representation must
not treat this as arbitrary-precision input ingestion. Amount input limit 1e9,
total limit 1e12, half-up two-decimal currency rounding per line then sum.

The evidence appendix intentionally remains subject to normal editorial rules;
a source/request containing a broken citation marker or raw tool token can block
normal export. No silent sanitization or source verification is implied.

Helper frozen for experiment at SHA-256:
`136e09c2f53a162c0288779559b67daa0372557c163ae49c000237365d282e4e`.
No helper modifications after freeze. UI-only button wrapping and source-context
paragraph polish followed freeze. Existing design tokens retained; no redesign.

## Post-browser follow-up

Main reproduced ten numeric-source warnings on the explicitly synthetic S3
document. Builder independently reproduced the same ten: five in narrative and
five in the generated appendix. The sentence/newline heuristic recognizes only
narrow direct input attribution; it does not bind Q-TEST paragraph provenance,
JSON strings or generated arithmetic lines. Contractor accepted retaining this
known limitation. No scoring exceptions, appendix parser or editorial rule
changes were made; no A/B output or frozen helper changed.

The panel's local message/request/context/packet now remount on the document ID
and persisted revision number. Successful Save refresh clears obsolete panel
state; editing and unsuccessful saves do not change that key. Existing draft
content remains in its parent. A browser regression was added to the existing
authoring E2E scenario, checking context/packet retention before Save and clearing
after revision2. This new E2E assertion is authored but not claimed run here:
the configured isolated E2E setup requires server/build and database setup;
Builder did not run it against the demo database or a stale build.

Post-follow-up focused update/current-rules tests: 26/26 PASS. Typecheck,
scoped lint and diff check PASS. Frozen helper SHA-256 unchanged.

Readonly PDF font inspection found no glyphs for right/left arrows or ≤/≥ in
either bundled NotoSans Regular or Bold (fontkit glyph ID0). Multiplication and
Vietnamese Đ are supported. A narrow PDF-only ASCII fallback was recommended,
not implemented by Builder at this checkpoint. This is a real glyph coverage
limitation, not merely a text-extraction difference.

Contractor then approved that exact four-glyph fallback. `export.ts` now maps
→ to `->`, ← to `<-`, ≤ to `<=`, and ≥ to `>=` only at PDF text rendering.
Stored content, Word export and other Unicode remain unchanged. No fallback
font, dependency or broader transliteration was introduced.

`tests/unit/authoring.test.ts` adds an exported-PDF regression using the existing
`pdftotext` executable through stdin/stdout (no temporary PDF). Extracted text
retains all four ASCII sequences plus supported × and Đ, and source content is
unchanged. This extraction check is conditional on Poppler availability; it ran
and passed locally, not skipped. Final focused result: **76/76 tests PASS**,
typecheck/scoped lint/diff check PASS. Native PDF visual/download recheck and
live successful-revision panel reset remain Main's verification. No new build.
