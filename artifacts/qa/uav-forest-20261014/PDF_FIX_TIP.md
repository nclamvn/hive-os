# Narrow PDF export fix

Owner approved 2026-10-14 after live export returned HTTP 500.

## Scope

Fix runtime font resolution in the existing authoring PDF exporter; preserve saved document revision 2, authorization and export quality policy. No data changes, paid API, deploy, dependency installation or unrelated cleanup.

## Acceptance

- Font loading resolves real bundled/dependency assets rather than a webpack virtual `(rsc)` path; no machine-specific absolute path.
- Focused regression tests pass; typecheck and scoped lint are checked.
- Native PDF export is downloaded through the visible browser from the same document.
- Every exported PDF page is inspected for Vietnamese text, clipping and pagination.
- Saved revision remains 2 and content is unchanged. Word regression remains passing.

## Roles and decisions

Vibecode Builder implements code/test changes; main reviews and performs browser acceptance. Reuse existing QA artifacts, no new infrastructure. A full production build is not prerequisite for this local defect reproduction; do not claim production packaging acceptance without testing it.
