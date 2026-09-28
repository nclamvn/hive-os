# TIP-027 — Subscription-backed local mathematics bridge

Status: local E2E executed; independent mathematical assessment pending.

## Decision

The Owner asked to exercise the actual browser-to-worker-to-LLM flow without
a separately billed API request. A locally authenticated Codex CLI process is
an operator-started test adapter, not a production API substitute. Only a
loopback development/test runtime may enable it. The existing OpenAI adapter
and paid-API accounting remain separate and disabled for this rehearsal.

## Acceptance contract

| ID | Requirement |
| --- | --- |
| MATH-LOCAL-01 | The web process only queues a sealed Math Pilot case; a separate worker invokes Codex after confirming ChatGPT subscription sign-in. |
| MATH-LOCAL-02 | `codex-local` uses its own job type and cannot be selected for ordinary research; provider/model/job identity must match the sealed request. |
| MATH-LOCAL-03 | The worker gives the child no app secrets, uses an ephemeral working directory and read-only sandbox, bounds time/output, and never automatically replays an uncertain attempt. |
| MATH-LOCAL-04 | The mathematical attempt, model/session token counts and SHA-256 digest are retained; the UI calls the result model-authored and unverified, not a proof or API-dollar charge. |
| MATH-LOCAL-05 | Only a distinct authorized human may record mathematical assessment after independent checks. A model response alone does not pass calibration or unlock the open case. |

## Observed local E2E

On 2026-09-28 the two fixed calibrations were dispatched from the browser in
the local demo workspace and completed through `math-pilot.codex-local.execute`
with `gpt-6-sol`. The first retained a proof attempt for even `n²`; the second
retained `2` as a counterexample to “every prime is odd.” Both are
`AWAITING_REVIEW`; no distinct reviewer exists, so neither was marked passed
and the open case remained locked. An initial login-status parsing fault made
one terminal failed dossier before model invocation; it is retained rather
than overwritten or replayed.

## Boundaries

- No external source retrieval, formal checker, independent verifier, or
  theorem-certification claim.
- No API-key use or API USD charge in this local rehearsal; subscription
  limits and terms still apply. Paid production inference needs a distinct
  credential, budget controls and operational review.
- No deployment, Git push, billing change, reviewer impersonation or hidden
  database edit to pass the gate.
- Local Codex can read from its host sandbox according to CLI policy; this
  operator-only test mode must never be exposed as a public multi-tenant
  service.
