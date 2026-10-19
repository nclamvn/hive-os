# TIP-117 Research mathematics rendering correction

Date: 2026-10-14. Status: READY for this scoped rendering correction.

## Root cause and correction

Research history rendered question/claim/excerpt/rationale directly as text.
The existing historical math adapter also understood only simple expressions,
not the screenshot's compound minimum/modulus inequality. These narrative fields
now use the existing safe MathText renderer. A bounded exact notation-family
adapter handles the entire inequality and range before simple spans; repeat
variables must match. It changes display only, preserves raw source/title and
operator order, and rejects unsupported variants rather than guessing.

Tags, URLs and code spans remain literal. The observed `common14/32-to224` and
`for14/15 runners` remain prose, not accidental equations. Long formulas gain a
keyboard focus stop for the existing horizontal scrolling; short formulas do not.
Existing escaped-text and KaTeX `trust: false` behavior remain in place.

## Files and verification

- Research page narrative fields; existing MathText and math-tex adapter.
- Existing math-tex, math-text-render and Research page layout unit tests.
- 33 focused unit cases PASS, including exact screenshot page markup, MathML,
  source reconstruction, changed symbols/spacing, unsupported suffix/malformed
  input, tags/URLs/code, archived IMO expressions and literal-source fallbacks.
- TypeScript `tsc --noEmit` PASS; scoped ESLint PASS, zero output.
  `git diff --check` PASS.
- No full build or historical-suite claim; Contractor performs live viewport QA.

No DB/evidence writes, mathematical claims, model/API calls, new dependencies,
build output, commit, push or deployment. Existing pending UX edits preserved.
No temporary copy created or user data removed.

## Contractor verification

- Requirement coverage: 4/4 TIP acceptance criteria implemented (100%).
- Independent focused run: 39/39 PASS across math-tex, math-text-render,
  research-question-layout and research-run-grouping; no failed scenarios.
- Live Codex browser: the exact archived LRC question has four complete MathML
  spans (N=6, M=42, range, full modular-distance inequality), with original source
  titles retained. No formula fragments left inside the compound inequality.
- Natural viewport901px and mobile390px checked. On mobile the long formula has
  client width316px/content363px; ArrowRight moves its scrollLeft8.5px with focus,
  while document horizontal overflow remains0. Viewport override reset afterwards.
- Observed prose identifiers stay raw; no live form submitted, no data mutation.
- Screenshot: test-results/research-math-render-fixed.jpg (local transient proof).
- Full build not repeated for this narrow presentation fix; dev compilation,
  TypeScript, focused lint/tests and live-browser verification passed.
- Limitation: legacy recognition is intentionally conservative, not a general
  natural-language math converter. Unsupported notation stays literal; explicit
  TeX remains the reliable input format. No claim of complete archive conversion.
