# Visible Codex browser QA — UAV update

Local only, 2026-10-14. Existing signed-in demo session; no auth changes.

## Setup

Created through Authoring UI, not API/database: TEST document DOC-9CD9B5E9,
de904436-34b1-4d1f-a7e6-a9b671a04c20, under existing UAV mission M-0002.
Saved revision2 with the eight exact B_FINAL base bodies and the three existing
source citations. Abstract/title explicitly label synthetic test purpose.
Original DOC-BD12906E is not the destination of any write in this task.

## Initial UI acceptance

- Optional update panel starts collapsed, no additional gate or mandatory step.
- Plain request -> Prepare context exposes a read-only9759-character context
  with correct document id/revision2, all eight sections and three citations.
- Manual bridge/no automatic AI call and saved-versus-unsaved export limits are
  visible. EN/VI control labels verified by switching and restoring VN.
- 390x844 responsive check: document scrollWidth390, no horizontal overflow;
  panel buttons235.22px and180.57px fit. Viewport restored afterwards.
- Main independent75 focused unit tests, typecheck, scoped ESLint and diffcheck
  pass. Existing Vite future-config-loader warning is not a test failure.

## Deliberate regression inputs — NOT A/B performance evidence

Using a copy of final A/S3 solely as a product fixture, rebound only id/revision:

1. Replaced claimedTotal with115000000. UI computed105000000 and displayed
   MISMATCH; Apply disabled. No draft mutation/save.
2. Changed JSON back to105000000 after preview. Apply remains disabled until
   Check and preview again. Fresh valid preview enables Apply.
3. Changed request after valid preview. Stale warning and Apply disabled.
4. Replaced one oldBody with stale text. Preview rejected `Stale section: need`,
   no Apply button. Draft remains revision2; no bad test saved.

Screenshots01-context.jpg,02-mobile.jpg,03-rejected-total.jpg retained.

## Paired final B inputs, independent previews

All six final B candidates were previewed on seed revision2, each without applying
the preceding candidate. Only documentId/baseRevision rebound; no prose changes.
S1/S2 no quantitative declarations, Apply enabled; S3 MATCH/MATCH/EXCLUDED/MATCH;
S4 threeMATCH with correct ha/km2 conversion; S5 UNKNOWN/MATCH/UNKNOWN, no false
zero; S6 NOT_MET and Apply enabled so negative evidence can be retained. Exact
check text observed in DOM. Screenshots04-unit-conversion,05-S5,06-S6 retained.

Preselected S3 applied atomically:4 changed bodies +1 evidence appendix. Saved
revision3, reloaded, then used UI-generated context to verify all8 original
section bodies exactly match either finalB replacement or unchanged base. Three
citations retained, appendix update-evidence-r3 contains unknown tax, source and
checks. Original DOC-BD12906E visibly remains revision3 when revisited read-only.

## Integration findings and fixes

Existing editorial heuristic reports10 nonblocking numeric-source warnings,
50/100, plus4 optional style items on S3. Five numeric warnings are in narrative,
five in evidence appendix. No fixture-specific exemption or rule weakening was
introduced. This is a known noise/provenance limitation, not mathematical error
or A/Bscore. Zero blockers; normal export allowed.

Panel previously retained 'unsaved' status after successful save/refresh. Fixed
by keying it on persisted document/revision. Regression authored/typechecked,
not run as isolated Playwright suite (would require its own server/migrations).
Main attempted unchanged-content save: server correctly refused duplicate
revision (`Revision 3 already contains this content`) and retained panel input.
No revision4 was created. Positive post-fix reset on a new persisted revision
has NOT been independently re-exercised live; code/regression evidence only.
Do not claim the unrun full Playwright suite passed.

One rapid interaction immediately after dev reload opened details before React
hydration; console reported an open-attribute mismatch and input event was not
reflected until a keyboard event. Subsequent ready-page interactions worked.
Retained as a dev/early-interaction observation, not asserted production QA pass.

## Exports

Downloaded revision3 DOCX/PDF using actual browser export links. Word rendered
through bundled LibreOffice into4pages; all4 visually inspected, no clipping.
NativePDF initially5pages: all5 inspected; arrow glyphs missing. Bundled NotoSans
also lacks ≤/≥/←. Narrow PDF-only fallback ->, <-, <=, >= added, preserving saved
content and DOCX. Focused generated-PDF regression checks extraction of all4
fallbacks and supported Vietnamese/×, unchanged source asserted.

Browser redownload after fix:
- /Users/os/Downloads/TEST-Cap-nhat-ho-so-UAV-Du-lieu-gia-lap-14-10-2026-v3 (1).docx
- /Users/os/Downloads/TEST-Cap-nhat-ho-so-UAV-Du-lieu-gia-lap-14-10-2026-v3 (1).pdf

Fixed nativePDF pages1/2 visually rechecked (affected arrows), fulltext compared:
26/26 Word nonempty paragraphs retained after documented symbol fallback,
whitespace/NFC normalization and page-header removal. Initial default-order PDF
text comparison missed6 paragraphs due extraction order/headers; layout-aware
comparison resolves all6, not a source repair. Numeric105million, EXCLUDED crew,
unknown tax and all references remain. Technical JSON appendix readable but dense.

Main final checks:76/76 focused unit tests; typecheck, scopedlint, diffcheck PASS.
Helper hash remains frozen. No full build or isolated Playwright suite run.
No deployment, commit/push, API charge, database bypass or original-doc mutation.
No task-specific build directory, dependency install, project copy or Docker
image created. Evidence footprint about2.6MB; nothing material deleted.
