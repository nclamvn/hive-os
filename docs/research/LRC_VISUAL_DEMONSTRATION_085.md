# LRC visual presentation — completion and verification

2026-10-09 · TIP-085 · LRC_VISUAL_DEMONSTRATION_085 · UI_PRESENTATION.
**Requirement coverage U1–U5: 5/5 (100%). READY for the scoped local UI.**
Wider development-environment defects below remain deferred, not concealed.

## Delivered

Actual browser URL:
http://localhost:3000/w/mathematics-pilot-lab-156de0/research/lrc-demo

One workspace route with existing authentication, `research.read`, dev/test
NODE_ENV/DEPLOYMENT_ENV guards, shell, preferences and MathText. One link from
the existing mathematics workbench. One client atlas, a small exact display
helper and scoped CSS. No new framework, API route, persistence or campaign.

The frontend-design skill shaped an atlas-first scientific layout: actual
interval geometry, quiet controls and exact annotations, not KPI-card theatre.
Existing HIVE typography and semantic success/danger tokens preserve theme
contrast. Vibecode was kept to one TIP, this completion and inline Builder/critic
messages; no separate blueprint/interview/report stack.

- **U1 PASS:** normal demo sign-in at the configured localhost origin, authorized
  workspace page loaded. Workbench's retained `?view=allikvere-proof` navigation
  exposed the new link; clicking it returned to the atlas. No auth bypass.
- **U2 PASS:** 59 actual interval facts on 13 speed rows, t=1/14 marker, closed
  endpoints and exact optimality equation. Enter on Next interval selected the
  second interval with [1/14,15/182]; last option disabled Next. SVG count59.
- **U3 PASS:** all five buttons exercised in the browser: j0,1,2,3 each blocked
  by exception0,1,2,3 respectively; j4 passed. Enter also switched j3→j4.
  Opening the details by Enter displayed all14 original velocities, phases and
  reduced distances. Exact selected t4 matched the retained fraction.
- **U4 PASS:** offline retained receipt, public source and restricted conclusions
  visible; KaTeX formulas rendered in VI/EN. Focused tests reject missing,
  unaccepted, incomplete or scope-altered records. No fresh independent Python
  replay, solver, model or autonomous job is claimed by these controls.
- **U5 PASS:** actual375px and1440px widths in light/dark themes; document width
  equals viewport width. Native button/summary keyboard operation and solid focus
  observed. Figures scroll internally. After repair, both long exact equations
  are named focusable scroll regions: at375 the GW equation had client328/
  content342/scrollLeft14; SHIFT equation client328/content359/scrollLeft2.
  Exact decisions use original BigInt physical products, not rounded SVG values.

The SVG is explanatory; it does not newly establish continuous coverage or the
family theorem. Mathematical closure and exposed-source limits remain exactly
those in `LRC_METHOD_VALIDATION_084.md` and its original JSON, both unchanged.
This is local presentation E2E, not research-agent execution E2E or global LRC.

## Checks and non-own review

Builder initial15 tests/lint passed, then16 after the environment-ordering control.
Main's final actual selected test run: **16/16 PASS**, one file, Vitest248ms,
enclosing0.736511459s. Targeted ESLint five files: exit0, no diagnostics,
enclosing2.092933042s. Strict display-helper typecheck: exit0/no errors,
0.439183125s. This is not whole-app typechecking or a production build.

All UI checks including earlier iterations: Builder10.715358s;
Main8.536650959s, each invocation<120s. The retired auth candidate's mocked25
tests/lint/invalid-argument smoke took1.390277208s separately; it is not shipped
and those tests do not count toward final product acceptance. No install/build.

Main read the changed source and checked the real browser. A separate critic
rechecked arithmetic, scope labels, gates and final CSS/render-class match;
no remaining essential source gap. The critic ran no checks; source review is
distinct from Main's browser evidence. Authenticated walkthrough completed in
approximately13min; temporary viewport overrides reset, tab retained as output.

## Findings retained, corrections and restrained cleanup

1. Initial Turbopack dev failed resolving PostCSS `new URL("./src",...)`.
   Official `--webpack` dev mode worked using ordinary `.next`; configuration
   files were not changed. The Turbopack issue remains deferred outside this UI.
2. Initial Vietnamese draft had French strings; replaced and covered by a locale
   regression before acceptance. Scientific accents now reuse semantic tokens.
3. Non-own review found the route missing the workbench dev/test guard; restored
   the same guard and added a source-ordering regression. This is not a full
   runtime unauthorized/production-denial security suite.
4. Mobile E2E found the long fraction's scroll owner lacked keyboard focus.
   The first scoped wrapper repair had a delimiter/class mismatch: a replacement
   string collapsed `$$` to `$`. Restored display delimiters, asserted the actual
   nested `.math-tex-block`, and verified BOTH regions by real keyboard scrolling.
5. CSS HMR emitted `removeChild` errors during updates. Fresh reload cleared the
   issue; no captured new error/warning after06:58UTC in final walkthrough. Those
   earlier errors remain recorded, not a claim of an error-free entire session.
6. Login UI reported email verification, but server logs showed **INVALID_ORIGIN**
   for127.0.0.1. Main's earlier diagnosis was wrong. Canonical localhost sign-in
   succeeded with the already verified public demo account. No email-verification
   UPDATE, password reset, new account/workspace/role or auth weakening was done.
   The legacy error-message mapping remains deferred; use the canonical URL.

Owner had approved narrowly recovering the demo account, so a guarded candidate
script/test was prepared. Once actual login showed recovery unnecessary, ONLY
that newly created `tests/unit/provision-local-demo.test.ts` was removed and our
edits to `scripts/dev/provision-local-demo.ts` were restored to their initial
source. Existing `local-demo-login.test.ts` was preserved. No recovery command
or live DB write was executed. Process-only DEMO_FIXTURES_ENABLED enables prefill;
no `.env` edit. Normal login sessions/preferences are ordinary UI effects.

## Evidence and stop

Screenshots are in `artifacts/research/lrc-demo` (about1.1MiB). Final images:
`atlas-final.jpg`, `gw14-vi-dark-1440.jpg`, `shift15-j4-vi-dark-1440.jpg`,
`gw14-vi-dark-375-final.jpg`, `shift15-j4-vi-light-375-final.jpg`.
Earlier screenshots are retained to distinguish pre-repair observations.

No scratch project copy, new distDir, Docker use, scientific run, paid API,
production build, Git mutation, billing or deployment. Disk preflight85Gi free.
Old p139/R3 targets, attempts, frozen artifacts and budgets remain unchanged.
STOP at this presentation. No further campaign or infrastructure authorized.
