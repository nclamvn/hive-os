# COMPLETION REPORT — TIP-024Q-R1 P1 Enterprise UAT Closure

Date: `2026-08-05`

## STATUS

`TECHNICAL_P1_CLOSED — READY_FOR_HUMAN_FUNCTIONAL_SIGN_OFF`

Immutable revision: `5c73448a5897339f359764b425581f181a32b582`

Managed staging: `https://d366nm3yse819q.cloudfront.net`

## FOUR P1 OBLIGATIONS

| Obligation | Result | Retained evidence |
| --- | --- | --- |
| VN/EN identity, onboarding and security UX | PASS | First visit is VI; appearance follows the system; complete EN switch; localized validation, busy, recovery and accessibility states; full E2E remained no-retry |
| Staging OS security closure | PASS | Ubuntu 24.04 host patched to kernel `7.0.0-1010-aws`; zero standard updates remain; post-patch app health, revision, restart and OOM checks passed |
| Managed soak plus backup/restore/projection rebuild | PASS | 30-minute AWS soak, 1,745 HTTP 200 responses, zero transport/5xx; isolated PostgreSQL restore inventory matched; real projection rebuild passed; temporary database removed |
| Five governed enterprise pilot Missions | PASS_MACHINE / HUMAN_SIGN_OFF_READY | 5 Missions, 3 roles, separation of duties, two-step approvals, 10 attributable actions, 5 evidence records, 5 deterministic exports and cross-tenant denial; human attestation template retained separately |

## QUALITY GATES

| Gate | Result |
| --- | --- |
| ESLint | PASS |
| TypeScript/build | PASS |
| Unit | PASS, 175/175 |
| Strict integration | PASS, 163/163 |
| Full E2E | PASS, 87/87, zero retries |
| Production startup contract | PASS |
| Dependency policy/audit | PASS, no accepted moderate/high/critical regression |
| Staging image publication | PASS, GitHub Actions run `30975805298` |
| Exact-revision quality gates | PASS, GitHub Actions run `30975808219` |

## MANAGED RECOVERY

- Logical dump: `467551` bytes; SHA-256
  `dedf276a019cd16057e7dfef137b234ea5c2ae6c094276931fdf9ee4003eae57`.
- Source and isolated restore inventories matched exactly: 1 organization,
  1 workspace, 0 current Missions, 3 audit events, 1 projection and 25
  completed migrations.
- `REC-M01` rebuilt the real operational projection in the disposable restore:
  1/1 test passed in 2,596 ms.
- The managed connection retained its TLS query contract. This fixed the
  discovered fail-closed denial caused by stripping `sslmode` from the restore
  URL.
- The live governed dataset was not mutated. The temporary database count was
  verified as zero after cleanup; the temporary migration environment was
  shredded.

## MANAGED SOAK

The acceptance run executed from the AWS staging host but called the public
CloudFront URL, so it retained the viewer edge and origin path without relying
on the operator Mac.

| Metric | Result |
| --- | --- |
| Window | 1,800.18 seconds |
| Requests | 1,745 at 0.97 requests/second |
| Completion gap max | 2,886.64 ms |
| Transport errors / 5xx | 0 / 0 |
| Live | 582/582 HTTP 200; p95 33.09 ms; max 280.63 ms |
| Ready | 582/582 HTTP 200; p95 46.71 ms; max 1,614.31 ms |
| Sign-in | 581/581 HTTP 200; p95 47.35 ms; max 1,805.70 ms |
| Runtime | restart 0; OOM false; 57.04 MiB / 360 MiB at finish |
| CPU | 1.84% average; 5.56% maximum across six Lightsail samples |

The earlier operator-client attempts remain retained rather than hidden.
Attempts 1 and 2 exposed sleep/transport gaps. Attempt 3 returned only HTTP
200 responses but recorded nine local DNS failures and one client timeout, so
it was rejected as acceptance evidence. The independent AWS run is the
authoritative PASS.

## OPERATIONS CLEANUP

- Removed and shredded the temporary migration credential file.
- Removed temporary recovery/soak scripts, logs and reports from the host.
- Logged Docker out of the temporary ECR dual-stack session.
- Deleted the temporary pre-patch instance snapshot
  `hiveos-staging-prepatch-20260805` after post-patch recovery and soak passed.
  That snapshot deletion is not recoverable; the managed database backup
  retention remains enabled.
- No new paid resource was created. The approved AWS Singapore topology and
  USD 20/month ceiling remain unchanged.

## HUMAN BOUNDARY

Machine certification is complete. The Builder did not fabricate functional
team testimony. Representatives must still execute and sign
`docs/operations/TIP-024Q-R1_FUNCTIONAL_TEAM_ATTESTATION.md` before the product
is described as business-accepted by a real enterprise team. This is a human
governance boundary, not an unresolved code or staging P1 defect.

