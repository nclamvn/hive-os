# TIP-026 — Mathematics pilot runtime accounting

Status: local implementation; live calibration remains pending.

## Context and decision

TIP-025 sealed the problem and kept the open case behind two independent
calibrations. The first browser E2E found no active worker, provider credential,
second reviewer or authorized spend ceiling. The existing source collector is
not a theorem prover. This TIP does not change that boundary.

The Owner authorized careful implementation for open mathematics research. We
reuse the existing research worker, durable job and Math Pilot gate instead of
introducing a new execution architecture. The blueprint checkpoint is omitted
for this bounded local hardening; no live provider request is authorized by
this TIP alone.

## Requirements

| ID | Requirement |
| --- | --- |
| MATH-RUN-01 | A provider response must be completed, from the requested model, and carry valid usage before it can produce a governed research dossier. |
| MATH-RUN-02 | One Responses request has explicit output-token and hosted-tool-call ceilings; the collector sends no automatic second API request. |
| MATH-RUN-03 | Token and hosted-tool usage are retained in the durable job result and visible to the math operator; cost is not guessed from token counts. |
| MATH-RUN-04 | Math-pilot provider failures are never automatically retried because a timed-out or incomplete call may already have incurred a charge. |
| MATH-RUN-05 | A real OpenAI math assessment cannot be recorded if its completed job lacks verified usage for the bound model. Existing separation of duties and digest checks remain in force. |
| MATH-RUN-06 | Readiness and runbook state explicitly that project spend limits and alerts are not a hard per-run budget; live activation requires Owner budget, service actor, provider credential, and distinct human reviewer. |

## Acceptance scenarios

1. Given a mismatched, incomplete, or usage-free response, when the adapter
   processes it, then no research result is accepted.
2. Given a successful response, when the worker completes its job, then the
   job result retains response ID, model, token counts, and hosted-tool count.
3. Given a math-pilot API failure after dispatch, when the worker fails the
   job, then it is terminal, not automatically retried.
4. Given a real-provider math dossier without verified job usage, when a human
   tries to assess it, then the gate refuses the assessment.
5. Given no Owner-approved spend cap, credential, or independent reviewer,
   then no live API calibration is run merely to make a readiness flag green.

## Boundaries

- No claim of a hard USD cap from `max_output_tokens` or `max_tool_calls`;
  web-search charges, pricing changes and ambiguous charges remain external.
- No provider key in the web process, source tree, audit, or dossier.
- No synthetic calibration, direct database edits, production activation,
  billing change, deployment, commit, or push.
- Open-problem results remain research dossiers requiring mathematical review,
  not formal proof certificates.
