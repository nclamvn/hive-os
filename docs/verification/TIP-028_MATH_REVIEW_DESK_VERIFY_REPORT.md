# TIP-028 local verification

Date: 2026-09-28. Scope: local development and isolated test databases.

| Check | Result |
| --- | --- |
| Review stages integrated in Math Pilot dossier and visible to logged-in requester | PASS |
| Distinct reviewer, complete finding decisions, source approval before math assessment | Existing server gate retained; integration PASS |
| Five-item independent checklist, positive conclusion guard, digest-bound append-only assessment | Unit and integration PASS |
| Calibration/import reject missing or mismatched review ledger | Unit/integration PASS |
| Authoring bundle retains mathematical disposition and review digest | Integration PASS |
| Local database migration and least-privileged role | PASS |
| Browser queue flow and mobile accessibility/overflow | E2E PASS |
| Actual independent scientific assessment of the two local Codex attempts | NOT DONE; no independent reviewer account |

The two completed `codex-local` calibrations remain `AWAITING_REVIEW`, and the
open-problem gate remains locked. Test-only reviewer identities in the isolated
integration database are synthetic fixtures, not live scientific sign-off.

Automated checks: 223 unit tests, 175 strict integration tests, two targeted
Math Pilot browser E2E tests (including mobile accessibility/overflow),
typecheck, lint and production build passed. The mathematical integration
test additionally exercises the authoring import and retained ledger text.
