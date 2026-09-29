# TIP-033 local verification — foundation only

Date: 2026-09-29. Branch: `codex/tip-023a-organization-graph`. Base commit:
`e1acc08`. No commit or push was requested for this change.

## Passed checks

- Unit: 51 files, 275 tests passed, including TeX delimiter/security fallback,
  stable obligation DAG, no theorem-state promotion and normalized-repeat
  rejection. The Contractor current manifest was updated for the new TIP file;
  the founding manifest was preserved.
- Strict integration: 29 files, 176 tests passed with deprecations as errors.
- TypeScript, ESLint and optimized production build passed.
- The authenticated Codex in-app browser returned the Math Pilot page and its
  accessibility tree contained the new rendered benchmark fraction. Existing
  sealed case/attempt content remained readable. No browser submission or
  fresh agent cycle was made in this verification.
- The isolated Playwright Math Pilot suite passed 2/2, including a rendered
  KaTeX assertion, no document overflow at 390px and 320px, and no serious or
  critical WCAG A/AA findings. It queued a test calibration in `hiveos_test`,
  not in the user's live local workspace.
- `git diff --check` passed. User-existing screenshot changes and
  `pnpm-workspace.yaml` were not modified by this TIP.

## Open gates and boundaries

- No live proof-obligation cycle has been dispatched with the new prior-memory
  prompt, so its scientific usefulness is unmeasured. The deterministic
  duplicate gate has unit coverage; the full worker path has pre-existing
  integration coverage, not a new live model run.
- A visual design critique across themes was not run. The 320px automated
  no-overflow and accessibility gates passed; a future screenshot review may
  refine spacing without changing the research evidence boundary.
- Lean/mathlib formal replay, semantic-alignment review, independently recorded
  model families and multi-branch scheduling are not implemented. No result
  may be described as formally proved or independently model-certified.
- No paid API request was made. The local Math Pilot dispatch stays off.
- A fresh `npm audit` after adding KaTeX 0.18.9 reported 14 findings in the
  full dependency graph, including 1 critical, and `--omit=dev` reported 12.
  The current package diff only adds KaTeX and its lock entries; the listed
  advisories concern existing Next/Prisma/Nodemailer and transitive packages,
  not KaTeX. This is a separate dependency-security release gate; it was not
  silently remediated by forcing upgrades during the math-method change.

## Historical UI completion follow-up (2026-09-29)

- A presentation-only parser now handles the old IMO Vieta-descent argument and
  common Erdős–Straus algebra/congruence spans without editing sealed records.
  Explicit TeX remains authoritative; unsupported strings remain readable
  source. The full historical proof fixture round-trips byte-for-byte in tests.
- Mathematical prose fields across case boundaries, attempts, checks, agent
  reviews, human assessment and cycle summaries use the same renderer. Each
  main and cycle attempt exposes its untouched source text in a disclosure.
- Unit: 51 files, 282 tests passed. Strict integration: 29 files, 176 tests
  passed. Typecheck, lint, production build and the isolated Math Pilot browser
  suite (2/2) passed. The browser suite includes 390px/320px overflow and
  WCAG A/AA serious/critical checks.
- The authenticated local browser displayed the existing IMO proof with
  throughout-formula typography, no document overflow at 320px and 366
  rendered inline MathML expressions across the loaded dossier page. No case
  was submitted and no worker/provider call was made.
- This is mathematical **typography**, not semantic formula extraction or a
  proof checker. Dense or ambiguous legacy syntax may remain plain; the raw
  sealed source is always available for comparison.
