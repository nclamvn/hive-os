# TIP-026 Mathematics Pilot Runtime Accounting — local verification

Date: 2026-09-28

Verdict: **OFFLINE HARDENING PASS; LIVE CALIBRATION NOT AUTHORIZED OR VERIFIED**

## Completion report

**Status:** PARTIAL for a live mathematics pilot; DONE for the bounded local
runtime-accounting and fail-closed controls in TIP-026.

**Implemented:** The Responses adapter requires a completed, model-matched
response with consistent usage and explicit output-token/tool-call ceilings.
Usage is retained before source parsing, persisted on the research run and
durable job, and exposed on the Math Pilot surface. A durable dispatch fence
and terminal failure handling prevent automatic replay of an ambiguous paid
math request. The local queue defaults closed and is rejected in staging or
production. OpenAI-shaped math assessments require matching persisted usage
on a succeeded job.

**Deviation:** A hard USD $20 reservation/stop mechanism is not implemented.
API token and hosted-tool ceilings, project spend limits, and alerts do not
establish an exact cost cap, especially for interrupted requests. The safe
behavior is therefore to leave live dispatch disabled. The Owner's $20 is a
maximum authorization, not a request to spend it or evidence that the
application can enforce it.

## Requirement and scenario coverage

| Contract | Local result | Evidence |
| --- | --- | --- |
| MATH-RUN-01 completed, matching, accounted response | PASS | Adapter unit tests reject missing usage, model mismatch and incomplete response. |
| MATH-RUN-02 bounded single request | PASS | Adapter request asserts output and hosted-tool ceilings; no retry path is invoked. |
| MATH-RUN-03 durable and visible usage | PASS | Integration checks retained run/job usage; UI renders counts or an unverified state. |
| MATH-RUN-04 no automatic paid replay | PASS | Integration checks terminal job and immutable dispatch fence after ambiguous failure. |
| MATH-RUN-05 accounting-gated assessment | PASS | Integration rejects an approved OpenAI-shaped dossier without verified usage. |
| MATH-RUN-06 truthful readiness and live prerequisites | PASS locally; live DEFERRED | Readiness reports queue DISABLED, reviewer/provider/worker UNVERIFIED and hard USD control NOT_ESTABLISHED. |

Five TIP-026 acceptance scenarios were exercised or confirmed in the local
environment. The two real-provider calibration calls and an open problem were
**not** run; synthetic tests do not satisfy those live acceptance criteria.

## Technical evidence

| Gate | Result |
| --- | --- |
| Prisma generation and migrations `20260928130000`, `20260928140000` | PASS; applied to local development and isolated test DBs |
| Forced RLS/app role preflight | PASS |
| TypeScript and ESLint | PASS |
| Unit tests | 219/219 PASS |
| Strict integration tests | 174/174 PASS |
| Browser E2E tests | 102/102 PASS, including Math Pilot mobile overflow and accessibility checks |
| Post-refinement Math Pilot E2E | 2/2 PASS after the assessment-form usability guard |
| Production build and route packaging | PASS |
| Local Math Pilot page after dev-server restart | PASS; authenticated page renders with disabled calibration buttons |
| Live API spend | $0 initiated by this TIP; no provider request made |

The browser initially showed a stale-development-server Prisma Client error
after schema generation. Restarting only the local `dev:demo` process on port
3000 loaded the new client; the same authenticated tab then rendered normally.
The local test link remains
`http://127.0.0.1:3000/w/mathematics-pilot-lab-156de0/research/math-pilot?missionId=31943653-4a30-462a-af11-ecd99f9ebfa2`.

## Critical boundary and next decisions

`npm run math-pilot:readiness` reports database, migrations, RLS READY; Docker
AVAILABLE; queue DISABLED; worker, provider and independent reviewer
UNVERIFIED; hard USD budget control NOT_ESTABLISHED; calibration NOT_RUN;
`readyForLiveOpenProblem: false`.

Before any paid calibration, establish and verify a real provider credential
and dedicated worker/service actor, a separate human mathematical reviewer,
and an enforceable per-run/aggregate spending strategy whose worst-case
exposure stays within the Owner's $20 ceiling. Only then enable the local
queue for two known-answer calibrations. Their mathematical assessments must
remain human-authored and independent of the requester. No production
activation, billing change, deployment, commit or push occurred in this TIP.

Pre-existing modified visual screenshot artifacts were preserved and are not
claimed as evidence for TIP-026.
