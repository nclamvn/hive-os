# TIP-030 local verification — controlled mathematics research loop

Date: 2026-09-28. Scope: local development and isolated test database.

| Check | Result |
| --- | --- |
| Schema, migration, forced RLS, append-only event trigger, sealed/monotonic cycle projection | PASS; applied to local DB and isolated test DB |
| Exact retained critique gap, separate verifier context, duplicate-task guard | PASS; unit and integration tests |
| Full fake-adapter round: proposal → independent check → solver → critic → adversary → next-round dispatch | PASS; strict integration test |
| Next round rejected by verifier; solver/review must not run | PASS; strict integration test |
| Idempotency, digest chain, immutable ledger and terminal projection | PASS; strict integration and unit tests |
| Full project automated suite | 230 unit tests and 176 strict integration tests passed after final UI and guard additions; typecheck and lint passed |
| Production build and targeted browser E2E | PASS; Next.js 16.2.11 build and both Math Pilot browser tests completed after final UI changes |
| Actual authenticated browser run, Erdős–Straus OPEN case | PASS for live dispatch and resource stop; planner, verifier, solver and critic executed and retained |
| Complete live five-role round | NOT COMPLETE: the selected 60,000 observed-token threshold was crossed after the fourth call; the fifth (adversary) was correctly not dispatched |
| Mobile visual/overflow | PASS at 390 px; document horizontal overflow was zero and the cycle ledger remained readable |
| Independent mathematical certification | NOT DONE; no human, different-model provider or formal checker certified the candidate argument |

The live cycle selected one exact root review gap concerning the remaining
`n ≡ 1 or 5 (mod 12)` classes. The planner proposed a narrower task for the
`n ≡ 5 (mod 12)` class. A fresh verifier context accepted the task, and the
solver retained a proof *attempt* for that subtask. The critic supported its
reasoning while explicitly leaving the universal root conjecture unresolved.
Observed usage reached 66,939 tokens against a 60,000 threshold. Because
usage is known only after each call, the threshold was crossed during the
fourth call. The fifth call was not started. The cycle therefore reports
`STOPPED / TOKEN_LIMIT`, `0/1` completed rounds and `4/5` calls, not an
`AI_REVIEWED` conclusion. No job was automatically retried or replayed.

This validates the controlled stop, not an end-to-end live mathematical
discovery. The fake-adapter path validates the complete workflow and the
rejection branch. A future live full-round acceptance needs a fresh root case
and an explicitly selected larger resource envelope; it must not mutate or
resume this sealed cycle. Billing, Git and deployment remain paused.
