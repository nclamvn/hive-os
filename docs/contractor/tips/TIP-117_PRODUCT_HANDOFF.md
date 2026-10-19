# TIP-117 — Product polish and research-team handoff

Date: 2026-10-13. Owner authorized implementation, cleanup, commit and push.
Deployment explicitly deferred until a destination is selected.

## Scope

Pause mathematical/method-development work. Preserve all K5/K6 evidence and
open obligations. Improve the existing research entry, responsive navigation,
keyboard usability, startup/build reliability and onboarding documentation.
No new research campaign, provider call, schema migration or authentication
bypass. Existing development-only tools remain development-only.

## Acceptance

- Research entry offers clear bilingual paths and truthful capability limits.
- Navigation works for nested research pages and small screens; account actions
  remain reachable by keyboard.
- Startup follows the selected existing build profile; packaging excludes local
  build output and credentials.
- A new team can follow documented setup, roles, backup and recovery guidance.
- Current-product regression results and immutable historical-source refusals
  are reported separately, without resealing old research evidence.
- Reviewed source/evidence is committed and pushed; no automatic cloud publish
  accompanies this deferred-deployment release.

## Verification

Typecheck, lint, product unit tests, focused UI regression and browser checks;
one reusable LOCAL_QA build if disk/preflight permits. Do not label unexecuted
integration/security/production acceptance as passed. No broad artifact deletion.
