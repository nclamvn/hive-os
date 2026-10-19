# TIP-029 local verification — autonomous mathematical peer review

Date: 2026-09-28. Scope: local development database and isolated test database.

| Check | Result |
| --- | --- |
| Two Codex-local elementary calibrations, distinct critic/adversary sessions, digest-bound ledger | PASS; observed in authenticated browser and retained database |
| Same Mission/model calibration gate unlocks a sealed open case without a second member | PASS; actual browser submission |
| Erdős–Straus open case, real local Codex attempt and automatic role-separated review | PASS; no paid model API call |
| Open-case uncertainty boundary | PASS; `INCONCLUSIVE`, with uncovered residue classes, not a theorem claim |
| Append-only review, tamper rejection and Authoring AI label/digest | PASS; unit and integration coverage |
| No invented external source or source finding on AI-only Authoring import | PASS; integration coverage |
| Readiness and paid-API safety | PASS; `RETAINED_NOT_CERTIFIED`, `readyForLiveOpenProblem: false`, hard USD control not established |
| Independent human or formal mathematical certification | NOT DONE; no such reviewer/checker was used |

The retained open attempt supplied exact constructions for even `n`, multiples
of three and `n ≡ 3 (mod 4)`. Its own limitations and both review roles leave
uncovered classes. This is useful partial work, not a solution of the
conjecture. The `ResearchRun` remains `AWAITING_REVIEW` because the AI ledger
does not silently write a human attestation. A previous failed attempt is
also retained rather than replayed or deleted.

Automated verification: 226 unit tests, 176 strict integration tests, two
targeted browser E2E tests, typecheck, lint and production build passed. The
browser E2E suite checks queueing plus mobile accessibility/overflow; the
authenticated live browser check additionally followed the actual Codex
attempt and AI review. The first browser E2E setup collided with a concurrent
test-database role update; rerunning it after integration finished passed.
