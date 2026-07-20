# TIP-003 Visual & Evidence Artifacts

Screenshots produced by `tests/e2e/identity-visual.spec.ts` for sign-in,
onboarding, workspace settings, members, and audit at desktop (1440x900) and
mobile (390x844). `*-viewport.png` are exact-viewport captures (fullPage:false).

All surfaces render real authenticated state only; no synthetic users, member
records, metrics, or activity.

`audit-immutability.txt` is the database evidence that audit rows reject
UPDATE/DELETE. Regenerate with `npm run test:e2e`.
