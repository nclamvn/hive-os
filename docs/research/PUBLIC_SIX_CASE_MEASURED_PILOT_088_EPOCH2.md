# Completion report — TIP088 epoch2

2026-10-09 · PUBLIC_SIX_CASE_MEASURED_PILOT_088 / METHOD_EVALUATION.

STATUS: DONE for the approved, bounded measurement and honest report.
Not a successful superiority demonstration, official benchmark, or whole-product
investment valuation. No further campaign or resource increase is authorized.

## Decision first

Do not invest further in **mandatory critic/swarm expansion** on this evidence.
Keep the useful thin core: a primary solver, explicit mathematical obligations,
checkable evidence, and review triggered by a concrete unresolved issue. There
is evidence that the underlying LLM can solve several substantial public tasks;
there is **no demonstrated additional solved case from the critic** in this run.
This distinction matters more than presenting the larger final-delivery count as
a method win.

The trial does not establish that HIVE OS as a whole is worthless or profitable.
Retrieval, executable certificates, formal tools, reproducibility and usability
were not compared here. Their potential value remains a separate question, not a
reason to claim a result the critic experiment did not produce.

## Contract and actual execution

Owner approved completing the same six public cases after the earlier batch
timed out. The predecessor failure remains in
`docs/research/PUBLIC_SIX_CASE_MEASURED_PILOT_088.md` and
`artifacts/research/pilot088/attempt1/`; it is not erased or counted as zero
mathematical ability.

Frozen revision: `docs/contractor/tips/TIP-088_EPOCH2_CASEWISE_MEASUREMENT.md`,
SHA256 `f8e872fbf9258f220b1d5721fb39e4a4d0c4f4ddce568a8e86c0c5a375b361bc`.
Activation08:49UTC; deadline10:19UTC (90 minutes). Actual mathematical execution
08:52:51.672–09:27:17.975UTC, about34m26s. Final assessor completed around09:30:35;
this report and cleanup close inside the same allowance.

A: solve / self-check / final. B: solve / fresh critic / repair-final.
Both used identical initial prompts, the same requested `gpt-6.1-sol/high`,
subscription-authenticated Codex CLI0.160.0, read-only child sandbox, explicit
prior-response replay and ephemeral calls. Actual backend model identity is
UNKNOWN. No paid provider API or API key was used.

Per case/arm stage limits240/120/120 seconds, at most36 mathematical requests
across epoch2, plus at most2 shared assessment requests240 seconds each. Output
instruction1400 words for math, raw capture2MiB per call; word count is checked
afterward, not a hard generation-token cap. No web/tools/files/published solutions
were supplied to mathematical roles; zero tool-contamination events observed.

C05 was attempted once and independently accepted before the other five were
released. It is part of the six, not an extra calibration or easier replacement.
There were28 math requests,23 completed turns,5 timeouts,2 completed assessor
requests, zero retries/replacements. Later failed arms stopped their own remaining
stages; the same fixed case denominator was retained. The remaining driver exited1
to flag incomplete pipelines correctly; that is not a code defect to suppress.

## Mathematical results

Grades are the frozen local rubric, not official dataset scores. `—` means no
completed submission / UNASSESSED, not zero ability. Scores alone do not imply a
novel theorem. The table shows initial→final; no missing final inherits its draft.

| Case | Task | A | B | Mathematical outcome |
|---|---|---|---|---|
| C01 | Delayed 2D Navier–Stokes dissipation | 6→— | 6→6 | Supremum1; both drafts prove upper bound and sharpness. A self-check timed out. |
| C02 | Hexary length5 code, agreement≤1 | —→— | 2→2 | B proves30≤M≤36, explicitly unresolved. Reference optimum31 not independently established by these submissions. |
| C03 | Broken one-sided1/3-convexity assertion | —→— | 6→6 | B proves no such function exists, without any regularity assumption. |
| C04 | Broken integer domination-root assertion | 3→— | —→— | A proves only odd-root exclusion/positive-root exclusion; no decisive counterexample. A self-check and B solve time out. |
| C05 | Infinitely many perfect-power divisibility indices | 6→6 | 6→6 | Both prove infinitely many clean square gaps and construct distinct valid indices. |
| C06 | Subset dynamics on120 students | 6→6 | 6→6 | Both prove eventual walk-length periodicity and the stronger boundM(f)<2^68. |

Initial A:4 submitted,3 fully supported,1 honest partial,2 missing.
Final A:2 submitted/fully supported,4 missing.
Initial B:5 submitted,4 fully supported,1 honest partial,1 missing.
Final B:5 submitted,4 fully supported,1 honest partial,1 missing.

Thus final delivery is2/6 versus4/6, **not proof that the critic doubles solving
power**. Every supported B final was already supported in B1. B1 and A1 used the
same prompt; differing stochastic outcomes and near-cap completion times cannot
be attributed to a critic that had not yet run. B1 C03 finished at235.96s versus
A1 censored at240s. A had a supported C01 draft but lost final delivery when its
mandatory self-check timed out. Initial and final counts expose this loss rather
than hiding it.

Confirmed critic-added fully supported cases:0. Confirmed essential mathematical
repairs:0. Confirmed avoided false acceptance:0. Reviews clarified exposition,
normalization and threshold checks; they did not close C02's optimality gap.
No completed submission asserted an invalid full solution under ordinary review;
censored turns cannot be evaluated for that property.

## How mathematical acceptance was checked

Two fresh shared assessor calls received anonymized labels and the frozen rubric;
C05 was graded separately before release, then the remaining five together.
The second assessor's note that C05 was absent reflects this deliberate split,
not a lost sixth case. Label map and raw responses are preserved. Main reviewed
each essential argument separately; all per-case grades agree with the assessor.
This is ordinary mathematical review, **not** Lean/kernel acceptance, a different
model-family replication, or independent human/expert certification.

- C01: checked positivity of the Bessel kernel, H^-1 control, logarithmic local
  mass bound, optimization yielding enstrophy-gradient lower bounds, ODE direction,
  signed-component smoothing, 2D energy-class stability and zero-circulation radial
  sharpness examples. This is not a result about 3D Navier–Stokes regularity.
- C02: replayed B's actual size30 construction; all435 pairs satisfy the agreement
  restriction. Runtime0.000235s. This verifies only the supplied finite construction,
  not the universal optimum31 or an exhaustive nonexistence certificate.
- C03: checked every transition class and barycenter, almost-sure absorption for
  each finite chain, bounded terminal expectations, negative terminal mass≤1/(2N),
  and the limit involving only four fixed finite function values. No unjustified
  continuity/density or unrestricted optional stopping is used.
- C04: checked the parity involution and its reduction to the number of dominating
  sets. This is valid partial work, not a proof of the supplied universal claim or
  its falsity. Behavioral2 credits explicit inability, not a correct false verdict.
- C05: independently reviewed the infinitude argument; a small replay up tom300
  verified255 constructed indices in255 clean blocks (0.003025s). The finite replay
  is a diagnostic, not the infinitude proof.
- C06: checked the bounded-generator residue lemma, closed-walk gcd construction,
  uniform SCC thresholds, both directions of eventual periodicity, global lcm bound
  including exceptional integer3, and explicit arithmetic below2^68.

Reference caveats are retained rather than treating public solutions as axioms.
C05's reference needs small initial-index/counting qualifications; the candidates
avoid them. C06's reference calls a mutual-reachability graph a tournament, which
need not literally hold; candidates instead use the stated condition fori=1.
C02/C04's snapshot metadata alone is not an independent certificate of their
reference answers. Neither case is counted as solved.

## Actual resources and measurement limits

Totals below are observed completed-turn usage only. Cached input is a subset of
input; reasoning output is reported separately, **not added again to output**.
Timeout usage is UNKNOWN, never zero, so these totals cannot price or precisely
compare total spend.

| Resource | A | B | Shared grading (separate) |
|---|---:|---:|---:|
| Requests | 12 | 16 | 2 |
| Completed usage receipts | 8 | 15 | 2 |
| Missing usage receipts | 4 | 1 | 0 |
| Cumulative child wall seconds, including timeouts | 1426.81 | 1640.86 | 185.66 |
| Observed input tokens | 113805 | 217122 | 55323 |
| Of which cached input | 71424 | 140416 | 19712 |
| Cache-write input | 0 | 0 | 0 |
| Observed output tokens | 18805 | 34479 | 5267 |
| Reasoning-output field, not extra output | 9862 | 18801 | 1922 |

Child seconds are summed active process durations, not user-visible elapsed time;
parallel calls overlap. B's10 review/final calls alone cost536.84 child seconds,
149852 input tokens (including cached input) and13961 output tokens, with no added
supported case. This is evidence of overhead relative to B's own drafts, **not**
an exact cost ratio between methods: A also includes self-check/final stages, and
its censored usage is missing. Different cache warmth and latency further confound
causal time comparisons. No dollar cost is inferred from subscription tokens.

The six cases are public, small and selected prospectively from fixed rows/IDs.
Public-recent does not establish unseen training data. One run does not estimate
statistical superiority or FrontierMath performance. This standalone CLI experiment
is not a demonstrated autonomous HIVE application execution loop. It measures
review-role decomposition, not the value of every procedure, external tool or
retrieval technique, and not a token-matched comparison with an unrestricted LLM.

## Files, engineering verification and scope

Created the small casewise driver and14 focused tests; reused the old frozen
transport. Builder completion:
`docs/verification/TIP-088_EPOCH2_BUILDER_COMPLETION.md`.
29 distinct original+new engineering controls PASS; Main rerun0.230s. Syntax2/2
PASS. These verify scheduling, limits, failure retention, no repeat/overwrite,
source preservation, prompt isolation, telemetry and timeout handling—not math.
Maximum completed math response count791 words; all accepted transport outputs
within the1400-word instruction check. Original runner and both frozen source
snapshot hashes were rechecked unchanged after execution.

Evidence: `artifacts/research/pilot088/epoch2/` includes per-call prompts, JSONL,
responses, stderr, receipts; `resource-summary.json`, `adjudicated-results.json`,
label map, per-case Main review notes and original driver summaries. Assessment
prompts are in `docs/research/pilot088/epoch2-*-assessment-prompt.txt`.
The only durable tracking updates are append-only completion checkpoints.

No app/UI/server/account/auth/config/DB/build/install/Git/billing/deploy or protected
oldp139/R3 changes. No project copy or new Next.js output directory. Existing dirty
worktree changes and predecessor evidence were preserved.

CLEANUP: after every math and grading child completed/reaped, inspected the owned
empty `/private/tmp/codex-tmp-pilot088e2-20261009.lvirJB` and removed it withrmdir.
Builder's small unittest scratch directories were auto-cleaned. No user data was
deleted, no Docker operation occurred, and no material recovery is needed.

## Honest closure / routing

E1 C05 real transport+math acceptance:PASS. E2 all six fixed cases attempted once:
PASS. E3 anonymized grading+Main checks+actual resource/investment report:PASS.
Superiority hypothesis:NOT ESTABLISHED. Mathematical completeness of every final:
NOT ACHIEVED; partial and censored outcomes are part of the completed measurement.

Vibecode shaped only a minimal delegated transport change with tests before live
dispatch; it did not add administrative gates or substitute hashes for mathematics.
OpenAI Docs and actual CLI preflight governed telemetry capture; they did not make
unknown backend identity, censored tokens or paid API cost magically observable.

Recommended next decision, not an execution grant: stop expanding mandatory
multi-agent machinery; simplify around first supported solver output, retain
targeted criticism and executable/formal verification where the obligation needs
them. A further comparative campaign requires a new explicit routing/resource
decision and should isolate a concrete unproven benefit. No automatic rerun,
easier replacement or extra infrastructure follows this report.
