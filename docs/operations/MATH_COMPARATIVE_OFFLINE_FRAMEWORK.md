# Equal-budget mathematical research: offline experiment framework

Date: 2026-10-01. Contract: TIP-035 E01–E04. This is executable software acceptance infrastructure, not a completed model capability comparison.

## Run the fixed local scenarios

From the repository, with already installed dependencies:

```sh
node --import tsx scripts/operations/math-comparative-experiment.ts --scenario=complete
node --import tsx scripts/operations/math-comparative-experiment.ts --scenario=unknown-usage
node --import tsx scripts/operations/math-comparative-experiment.ts --scenario=overshoot
node --import tsx scripts/operations/math-comparative-experiment.ts --scenario=uncooperative-timeout
node --import tsx scripts/operations/math-comparative-experiment.ts --verify=/absolute/path/to/retained-result.json
npx vitest run --project unit tests/unit/math-comparative-experiment.test.ts
```

The runner emits one retained JSON result to stdout. Save that result using the operator's normal artifact workflow if desired. The verifier reads at most 2,097,152 bytes of inert JSON, never executes content, and prints only integrity/authenticity/acceptance-ceiling metadata. Unknown flags, dynamic provider flags, extra arguments, malformed inputs and oversized files fail. `node --import tsx` avoids the additional IPC socket created by the `tsx` CLI, which this local sandbox can reject.

No CLI scenario instantiates a provider, spawns a model, runs model-authored code, accesses the application database, starts a worker, fetches a source, or changes any retained product ledger. The existing local model adapters and live regression scripts are deliberately not reused as executors.

## What is sealed before execution

`ComparativePlan` version 1 binds exact public/development case contracts, contract digests, source content snapshots, the fixed tool source descriptor, requested fixture settings, repetitions, lane order, scoring-reference digests, stop rules and one common resource envelope. All three lane declarations reference identical input/source/tool/settings/envelope digests. Exactly `SINGLE_LLM`, `TOOL_FIRST` and `ADAPTIVE` must appear once in the sealed order. Case/reference IDs are unique and complete. Each complete run must occupy its exact repetition/case/lane slot.

The default suite comprises the existing even-square and prime-2 calibration contracts. They are exposed public development controls, not private or uncontaminated held-out questions. Fixed response labels evaluate only fixture-label fidelity, not proof validity or model accuracy. They cannot become mathematical oracles by rehashing.

The fixed `PARITY_WITNESS` tool uses BigInt arithmetic for `n=2k` and `n²=2(2k²)`. This checks an explicit integer identity at the chosen input, not a general theorem. Its descriptor/version is pinned and it accepts bounded decimal `k` only. There is no arbitrary tool/code selection in input data.

## Lane operation and scoped blinding

Default `SINGLE_LLM` uses one canned solver response and a common canned reviewer response. `TOOL_FIRST` adds the fixed arithmetic tool. `ADAPTIVE` adds a canned planner operation and the same fixed tool. These are **workflow fixtures**, not implementations or measurements of three competing live research algorithms. All lanes receive the same canned mathematical content; the default example deliberately does not manufacture an adaptive win.

Solver projections contain contracts, captured sources, governed tools/settings/envelope and exposure warnings. They omit scoring answers, labels, rubrics, reference digests, lane identity and the plan's case identifiers. Projections are copied so a driver cannot change the sealed plan through them.

After a solver response, a reviewer projection binds the exact attempt and contract digest. It strips policy/lane/session/usage/resource/model labels. This is field-level blinding, not guaranteed semantic anonymity: a proof's prose may reveal its method. A complete record requires a retained successful solver, retained successful reviewer, exact solver/projection request digest, exact review request digest, unchanged attempt and matching review decision. Tool-first/adaptive workflow requirements also remain explicit. A driver returning a result with no calls, changing the sealed attempt, or substituting the decision is stopped rather than scored.

Every tool event has role `VERIFY`; only model operations can occupy `PLAN`, `SOURCE`, `SOLVE` or `REVIEW` (a model may also use `VERIFY`). Tool-first requires a successful tool before its first solver. Adaptive requires a successful **model** planner, bound to the solver input projection, before its first solver and before any tool it uses. Relabeling a tool or moving these steps later does not satisfy the lane semantics.

`ACCEPT`, `REJECT` and `ABSTAIN` are separate. An abstention is not a false rejection. False accepts/rejects in the default fixture refer only to the explicitly sealed expected response label. Every score separately keeps informal proof validity `NOT_ASSESSED`, formal kernel `NOT_RUN`, alignment `NOT_ATTESTED`, and root contribution/novelty `NOT_ESTABLISHED`.

## Accounting, deadlines and ambiguous execution

Every dispatched operation appends `PENDING` before invoking the executor, then a retained outcome. All planner, source, solver, verifier and reviewer model operations use the same broker. It enforces admitted tools, serial calls, call ceilings, bounded request/output sizes, observed-token threshold and monotonic elapsed limits.

Input plus output is the token total. Cached-input and reasoning-output counts are subsets, not additional consumption. Counts are bounded nonnegative integers; inconsistent subsets or malformed accounting fail. Fixture tokens are always `SIMULATED`. Wall time is actual monotonic **framework** time, not invented LLM latency. Known usage on a failed call is retained. Unavailable usage is `UNKNOWN`, not a zero-use claim, and stops that lane with incomplete comparison accounting.

The observed-token threshold is checked before calls; an in-flight call can exceed it. The overshoot is retained and another call is prohibited. This is not a hard dollar cap. Elapsed time covers broker creation through lane finalization, including cancellation acknowledgement; the record preserves actual overrun rather than pretending the timer was an exact hard wall. A bounded 20-ms acknowledgement window follows cancellation. A still-unsettled executor produces `AMBIGUOUS`, never a successful clean timeout. Remaining experiment slots are retained as `NOT_RUN`, because that executor could still affect the shared runtime. A driver that never returns is likewise ambiguous. Cooperative cancellation may still have unknown model usage.

The injectable executor/driver APIs are trusted in-process **test seams**, not a sandbox or a model-identity attestation. JavaScript synchronous code cannot be forcibly preempted here: a bounded blocking test demonstrates that a receipt returning after its deadline is rejected. A future live adapter needs independently governed process isolation, cancellation and trustworthy partial usage retention. No such authority is included in this slice.

## Retained verification and scientific boundary

The verifier reconstructs ordering/coverage, request/attempt/reference/source bindings, token totals/subsets, event pairing, fresh call/context identities, chronology, stop boundaries, output bytes/digests, cancellation ambiguity, scores and aggregate accounting. It rejects omitted/duplicated records and internally inconsistent fully rehashed results. A hash does not authenticate execution: CLI imports explicitly return `executionAuthenticity: UNATTESTED` even when structural integrity passes.

A retained successful operation must finish strictly inside both its per-operation limit and the wall time remaining at its start. A fully rehashed successful receipt that exceeds either limit is invalid even when the whole lane still falls under its overall wall budget or is marked stopped later.

Successful fixed output says `comparison: FIXTURE_WORKFLOW_ONLY`, not a live comparative result. Failure/cancellation/overshoot examples remain `INCOMPLETE`. **Every result retains `scientificYield: NOT_MEASURED`.** Actual budget-matched model comparison, private suite curation, independently judged mathematical outcomes and root progress remain deferred under `MATH_ADAPTIVE_RESEARCH_EVALUATION.md`. A future live experiment must preserve these boundaries and preregister its settings before execution; it cannot relabel this fixture run as that experiment.
