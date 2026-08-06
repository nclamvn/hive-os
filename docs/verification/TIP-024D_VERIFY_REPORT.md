# TIP-024D Verification Report

Status: `PASS — RUNTIME ACTIVATION DEFERRED TO CREDENTIAL INJECTION`

Date: `2026-08-06`

## Verified scope

- Guided research brief with a bounded question fallback query.
- Advanced source controls and computational sandbox collapsed by default.
- Durable research and job state rendered as a four-stage workflow.
- Five-second refresh while work is queued or running.
- Worker signal distinguishes dispatching, unclaimed, active, expired lease,
  human review and terminal states without inventing progress.
- Separate non-root worker image and staging publication contract.
- Vietnamese and English copy for all new product states.

## Evidence

| Gate | Result |
| --- | --- |
| TypeScript | PASS |
| ESLint | PASS |
| Production Next.js build | PASS |
| Unit suite | PASS, 207 tests |
| Integration suite | PASS, 168 tests |
| TIP-024D Playwright | PASS, 2 tests |
| Accessibility | PASS, no serious or critical WCAG A/AA findings |
| Mobile 390 px overflow | PASS |
| Worker container build | PASS |
| Worker container user | PASS, `node` |
| Worker command | PASS, `npm run worker:research-sandbox` |
| Contractor checksum manifest | PASS |

One integration attempt was discarded because two local suites overlapped on
the same destructive test database and produced PostgreSQL deadlocks. After
all competing processes ended, the isolated full suite passed 168/168. No
product code was changed to conceal that infrastructure race.

## Activation boundary

Code and container packaging are complete. Managed staging is not yet declared
worker-active because this change does not inject `OPENAI_API_KEY`, choose a
service actor or start a new external process. Those operator actions must use
`docs/operations/TIP-024D_RESEARCH_WORKER_ACTIVATION.md` and retain the worker
image digest and first completed dossier as acceptance evidence.
