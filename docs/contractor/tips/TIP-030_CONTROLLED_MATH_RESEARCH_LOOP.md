# TIP-030 — Controlled AI-native mathematics research loop

Status: implemented in the local pilot. This is a research procedure, not an
autonomous theorem prover or scientific certification.

## Decision

An OPEN Math Pilot case with a retained, valid AI review and an explicit
unresolved review gap may start one linked research cycle. The original case,
attempt and review remain unchanged. Each round uses fresh local Codex
contexts to (1) propose one falsifiable hypothesis and task from an exact
review gap, (2) independently challenge that task, (3) attempt it only if the
check accepts, and (4) run critic and adversary review on the new attempt.
The next round, if any, is generated only from the new review gaps. The cycle
stops rather than silently substituting a task or claiming a theorem.

## Acceptance contract

| ID | Requirement |
| --- | --- |
| MATH-LOOP-01 | Start only for an integrity-valid OPEN case, completed `codex-local` attempt and digest-bound AI review with at least one explicit unresolved gap. One cycle per root case, same organization/workspace/Mission. |
| MATH-LOOP-02 | Keep exact root contract, attempt and review digests; preserve root definitions, assumptions and exclusions in each narrower task. Record the selected exact gap, hypothesis, task, falsification plan and evidence criterion. |
| MATH-LOOP-03 | A fresh verifier context must accept the task; deterministic checks reject fabricated gap, duplicate task, altered gap binding and reused planner context. A rejection is terminal before solver dispatch. |
| MATH-LOOP-04 | Reserve and record every model call before invoking it. Maximum two rounds/five model calls per round, a 50-minute cycle window checked before each call, a 240-second per-call timeout, and an operator-selected observed-token threshold. There is no automatic retry after an ambiguous call. |
| MATH-LOOP-05 | Retain each phase and model usage in an append-only, SHA-256-chained event ledger protected by forced organization RLS and least-privilege grants. Validate the chain on read. A crash leaves its call-start marker and a terminal failed job; never replay it automatically. |
| MATH-LOOP-06 | The two peer-review roles run in different contexts from planner, verifier, solver and each other. The open-case verdict is at most `PARTIAL`, never theorem certification. Only a new explicit review gap permits the next round. |
| MATH-LOOP-07 | The dossier shows budget, progress, hypothesis/task, verifier decision, attempt, role-specific gaps, stop reason and the limits of AI-only independence. Billing, Git and deployment remain paused. |

## Resource and scientific boundaries

The call count and per-call timeout are hard. The token threshold is evaluated
only from completed Codex usage, and the deadline is checked before starting
each call; either can be crossed by one in-flight call. They are not a
hard-dollar billing control. A plan and a verifier from separate sessions of
the same model family are procedurally independent contexts, not independent
mathematicians or independent model providers. The deterministic gate checks
exact provenance and task uniqueness, not semantic mathematical validity.

No cycle output mutates a Mission claim, approves a ResearchRun, changes a
human assessment, or imports a theorem as truth. A consequential positive
claim still requires a separate mathematical review and, when possible, a
faithfully formalized checker. Local Codex subscription use is for product
acceptance testing only, not a production worker contract.

The first authenticated live local cycle stopped after the fourth of five
possible calls when observed usage crossed its selected 60,000-token
threshold. It retained the proposed task, independent-context check, solver
attempt and first critic review, but did not dispatch the adversary. The
round remains incomplete by design; see the TIP-030 verification report.
