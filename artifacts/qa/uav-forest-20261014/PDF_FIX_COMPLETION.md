# PDF font repair: completion and verification

Date: 2026-10-14. Status: DONE for local export. No deployment or production-build acceptance.

## Root cause and fix

The bundled server rewrote package resolution to a virtual `(rsc)` location, which was incorrectly treated as a real directory by readFileSync. The exporter now loads the existing traced regular/bold TTF files relative to the runtime project root. Next standalone's generated server changes cwd to its own root. PDFKit receives the regular font at construction, avoiding its default Helvetica AFM filesystem dependency. No font package, quality gate, authentication or saved content was changed.

Changed application files:
- src/modules/authoring/export.ts
- tests/unit/authoring.test.ts

The regression renders from a relocated font-only fixture without a package manifest or virtual path, verifies TTF reads and no AFM reads, and cleans up even if setup fails. Existing scoped outputFileTracingIncludes already includes both font files; configuration did not need changing.

## Verification

- Authoring unit tests: 8/8 passed, including DOCX/PDF smoke and new relocated-font regression.
- Build-profile unit tests: 6/6 passed, including existing font tracing assertions.
- Typecheck and scoped ESLint passed; git diff --check passed.
- Live browser, same authenticated document: two successful native PDF downloads, second after final source lock. Server logged HTTP 200.
- Revision remains 2/DRAFT; no edit/save submitted in this repair. Export auditing is the normal existing route behavior.
- Final native PDF: seven A4 pages, Producer HIVE OS Governed Authoring. Both NotoSans-Regular and NotoSans-Bold are embedded with Unicode maps.
- Visual review: all seven pages readable; no clipping, overlap or broken Vietnamese glyphs observed. Some paragraphs naturally continue on the next page. PDF is not tagged for accessibility; PDF/UA compliance is not claimed.
- Text comparison: 64/64 paragraphs from the previously downloaded Word document appear in extracted PDF text after Unicode/whitespace normalization and removing page headers. No replacement glyph detected.
- Final source-lock export renders pixel-identically to the seven inspected page PNGs; extracted text is identical.

Artifact: uav-forest-proposal-v2.pdf

SHA-256: a085eac21d2f9288ae89ba8237b37f41255e148c6a7c1c616989a0ea8dcfdbf7

UI: http://localhost:3000/w/mathematics-pilot-lab-156de0/authoring/62f367d5-b09b-4f1c-8ef2-695ceee6ad5e

Screenshot: test-results/uav-forest-e2e/pdf-export-verified.jpg

## Boundaries

This closes the native export defect and the six local operator-assisted E2E criteria, not the underlying forest survey or autonomous AI workflow. The user-input area warning remains intentionally visible. No full build, dependency install, DB-content mutation, paid API, commit, push or deploy. Temporary font test fixtures (including an initial failed-test leftover) were removed. No project copies, new Next output directories or Docker resources were created.

Vibecode kept implementation and final browser acceptance separate; PDF skill supplied the full-page render review. No extra product gate was added.
