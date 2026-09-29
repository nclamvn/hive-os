# Mathematics pilot — local runbook

Research-method milestone and reproducible residual-prime survey: [MATH_PILOT_MILESTONE_2026-09-28.md](./MATH_PILOT_MILESTONE_2026-09-28.md). The finite certificate checker does not certify a universal theorem.

This is a local research exercise, not a production release or a claim that
HIVE OS can solve open mathematics autonomously.

## 1. Preflight

From `/Users/os/hiveos`:

```bash
npm run math-pilot:readiness
```

The command refuses a non-local database, checks the TIP-025 through TIP-032
migrations and forced RLS, and reports Docker availability. It never prints
credentials. `queue: DISABLED` is the safe default; the UI also disables its
Run buttons. Enabling queueing does not prove the worker, provider, reviewer,
or USD budget controller is ready.
`retainedLocalModelAttempts` counts completed model attempts, not certified
calibrations. Retained AI reviews are reported as `RETAINED_NOT_CERTIFIED`;
the production/live-open-problem readiness verdict stays closed.
`worker: UNVERIFIED` is expected until a real dossier completes. Do not treat
an available Docker daemon or a queued job as proof that a research worker is
running. For a fresh local database, apply the committed migrations and the
least-privileged role using the existing `db:migrate` and `db:setup-role`
scripts. Do not reset an existing development database to make the gate pass.

## 2. Subscription-backed local Codex rehearsal (TIP-027)

This is an operator-started, loopback-only alternative for acceptance testing;
it is **not** a replacement for a production model API. Confirm `codex login
status` reports ChatGPT sign-in. Do not use API-key login for this path.
Apply the local migration and app role, provision a credentialless SERVICE actor
for this organization, and start the web runtime with
`MATH_PILOT_QUEUE_ENABLED=true RESEARCH_CODEX_LOCAL_ENABLED=true npm run
dev:demo`. Start a separate `research-worker` process with the same two flags,
`RESEARCH_WORKER_ENABLED=true`, the exact local organization and SERVICE actor
IDs, and `RESEARCH_WORKER_CLAIM_FIRST=1`; see the TIP-024D worker command for
the remaining variables. Never put the Codex auth cache, app database URL, or
provider credential in a browser form. Stop the worker after the test.

Only sealed Math Pilot cases route to `math-pilot.codex-local.execute`. The
worker passes no application secrets to the Codex process, runs it from an
ephemeral directory with a read-only sandbox, and retains model-authored math
attempts and session token counts. It captures no external source and makes no
claim of a verified proof or API-dollar cost. An interrupted or failed attempt
is terminal and must not be automatically replayed. ChatGPT subscription usage
limits still apply. On completion, the worker queues
`math-pilot.codex-local.review`: a fresh critic and adversary write an
append-only AI review ledger. The human lane remains separate. The
`ResearchRun` can remain `AWAITING_REVIEW` even when its AI lane says
`AI_REVIEWED`; this is deliberate and must not be described as human approval.
Two AI-reviewed calibrations can unlock a **local** open case without a second
member, but do not certify any open-problem result. For a historical completed
attempt, use the dossier's AI review request once. Never replay an ambiguous
attempt/review or edit the database to manufacture a pass.

### Known-answer benchmark (IMO 1988, Problem 6)

The `BENCHMARK_PROOF` lane unlocks after both calibrations for the same Mission
and model. It creates a new, sealed case; it never reclassifies a historical
`OPEN` dossier. The solver receives the theorem statement and boundary only.
The reference identity and Vieta-descent review rubric are held separately and
shown to the two review roles only after the attempt is retained. The UI labels
this lane as a benchmark, not an open-problem discovery.

The gate requires a matching fixed contract, a proof attempt, exact quotations
from the attempt, two separate AI contexts, favorable aligned reviews and no
unresolved gap. A challenge, partial attempt, mismatched contract or tampered
ledger remains inconclusive. The reference establishes that the theorem is
true; it does **not** formally validate generated proof text. `AI_REVIEWED` /
`SUPPORTED_ARGUMENT` means AI-supported argument, never human approval,
independent-model verification, formal proof or new mathematical discovery.
The prior `OPEN` IMO exercise and its `PARTIAL` conclusion remain intact.

## 3. Controlled local research loop (TIP-030)

On an OPEN dossier with a valid AI review and explicit unresolved gap, the
Owner can start a linked loop with one or two rounds and a selected observed
token threshold. The local worker must be restarted after deploying this code
so it claims `math-pilot.cycle.round`. It processes one Codex-backed job at a
time, retains an intent before each call, and never automatically retries an
ambiguous call. A round proposes one task, verifies it in a separate context,
attempts it only if accepted, and runs critic/adversary review. The dossier
shows the event trace and stop reason. A rejected task or missing gap stops the
cycle. Do not edit the ledger or force a new dispatch after failure; start a
new root case for a new experiment.

The call cap and per-call timeout are hard; the token threshold and overall
deadline are checked between calls, not during an in-flight call. These are
not USD controls and do not justify enabling the paid API path. A fresh
verifier session of the same model is not an independent scientific referee.

### TIP-032 frontier-source gate

Apply the `20260928183000_math_frontier_gate` migration and restart the local
worker before requesting a **new** cycle. The worker discovers up to five
Crossref metadata leads, retains a bounded problem-specific primary-passage
dossier and runs separate source analyst/challenger sessions. The gate runs
before the task verifier and solver. Inspect its `KNOWN`, `HOLD`, or
`RESEARCH_ONLY` decision on the Math Pilot dossier. `RESEARCH_ONLY` means a
bounded experiment may proceed; literature novelty remains unverified. The
source agents may agree that cited theorems have narrower quantifiers than the
task, but that is not a novelty certificate. `quantifiers` compares the task to
the sealed root statement: a finite interval under a universal root is
`NARROWER`. `MATCH` and `NARROWER` are both research-eligible if neither agent
is uncertain and both agree on relevance and non-coverage; the independent
task verifier separately rejects any unsupported transfer to the root. A
missing/corrupt passage, failed discovery outside the exact finite fallback,
or unresolved source-scope uncertainty stops that round. Do not force-dispatch
a held task or alter its ledger.

For a proposed *exact finite residual survey only*, live Crossref unavailability
does not block local arithmetic if the retained primary-passage dossier is
digest-valid and both source agents agree on its limited scope. The gate records
`RESEARCH_ONLY` with an explicit offline-discovery embargo. This does **not**
authorize novelty, a theorem claim, or an unbounded task; absent captured
primary passages, source disagreement, or invalid survey bounds still HOLD.
The Erdős–Straus intake recognizes equivalent `4/n` and `4/p` notation when
the variables are explicitly positive integers; it does not treat an unrelated
equation or an unspecified domain as this problem. This guards against an
accidental empty source dossier caused solely by a conventional variable name.

The initial primary-passage corpus is limited to eight Erdős–Straus facts, including
the first/second conditional denominator criteria and general divisor-residue
reduction in Bhattacharjee's 2026 preprint; its
hashes cover retained normalized excerpts, not entire publisher pages. Crossref
hits are leads, not full-text evidence. A generic open problem without a
captured primary passage will HOLD. The mathematical statement is sent to
Crossref for discovery, so do not use this local pilot with confidential
statements until an external-discovery policy is agreed. The new hard call cap
is seven per round, while observed-token and time thresholds remain checked
only between calls. Old five-call cycles remain historical and are not replayed.

### Exact bounded computation after the E2E gap

A new Erdős–Straus residual-prime task may include a typed interval and A-bound
plan. The independent task verifier sees this plan before the kernel runs the
fixed exact survey. Bounds are `p≤2·10^8`, interval width at most `2·10^7`, and
`A≤107` with `A≡3 (mod 4)`. The `COMPUTED` event is appended before the solver;
solver, critic and adversary receive its explicitly finite evidence. On read,
the trace validator reruns the survey rather than trusting even a digest-valid
event. New V3 failure records require a separate per-A factor-pair audit;
historical V2 events with or without it remain immutable and readable. This is finite
machine evidence, not independent academic review or formal theorem proof.
For new V3 cycles, a separate fixed Python standard-library replay now runs
after `COMPUTED` and before solver dispatch. `INDEPENDENT_REPLAY / PASS` requires
the full per-prime witness manifest, interval counts, first-failure rescue and
each first-failure A row to match. A mismatch stops the cycle; script/output
hashes and the report digest remain in the event chain. Historical cycles are
not retroactively certified. The structural proof baseline and exact local
smoke evidence are in
`docs/operations/MATH_PILOT_INDEPENDENT_REPLAY_AND_STRUCTURE_2026-09-29.md`.
Do not equate a
finite zero-failure interval with the unbounded conjecture or claim that the
same-model verifier is a separate mathematical referee. Reproduction and the
`10^8` milestone and later `2·10^8` interval audit are in the linked
milestone and E2E reports. A fresh
browser E2E needs a new OPEN root case; do not replay or edit a terminal cycle.

### Human-steered autonomous campaigns (local)

For a valid Erdős–Straus OPEN dossier, the user can choose a structural lemma
or bounded falsification, select a later `A=11,15,...,47` gate, optionally add
a short adjustment, choose an observed-token threshold, and explicitly
confirm. Each campaign has exactly one round and at most seven model calls.
The server records the actor, time, sealed-root digest and directive digest;
the first hash-chained event is `HUMAN_STEERED`. Planner and task verifier
receive the directive in separate contexts. A deterministic check rejects a
proposal that changes the selected gate, treats a finite survey as a
structural proof, or loosens the finite A-bound. Existing source, tool
replay, exact-certificate and critic/adversary gates still apply. The
optional note is task data, not authorization to override those gates.

After a campaign reaches `STOPPED`, its original event log remains immutable.
The UI presents the stop reason, task, source decision and digest in campaign
history; the user may adjust and confirm another campaign on the same sealed
root. An active or failed campaign cannot be bypassed. Tasks from the eight
most recent stopped campaigns are passed to the planner and screened for exact
duplication; deeper semantic novelty still requires separate review. This is a human checkpoint
**between** autonomous rounds, not human certification of a theorem or a
mid-call cancellation mechanism. The form is available at
`http://localhost:3000/w/<workspace-slug>/research/math-pilot` when the local
web process uses `MATH_PILOT_QUEUE_ENABLED=true`; a separate worker is required
for execution. A submitted campaign remains queued if no worker runs. Use
isolated test fixtures for automated submission tests; do not mark the live
confirmation checkbox on behalf of the human.

## 4. Paid API worker path — separately gated

Follow `docs/operations/TIP-024D_RESEARCH_WORKER_ACTIVATION.md`, adapted to the
local organization. Keep the provider key in the worker process environment,
not the web process, source tree, form, audit or dossier. Use a credentialless
SERVICE actor with one organization binding. The Owner approved a ceiling of
**USD 20 for the entire local pilot**, not for each request. This ceiling is
not yet enforced by a hard per-run controller. A project spend limit or alert
does not stop a request immediately, and token/tool-call ceilings do not cover
every charge. Until a verified reservation or equivalent hard stop is in place,
and a provider credential plus a distinct human reviewer are ready, keep
`MATH_PILOT_QUEUE_ENABLED=false` and do not make a paid API call. When those
conditions are met, explicitly enable the queue only in the local web runtime.
Do not enable the Docker computation adapter just to complete the two
source-research calibrations. A computation run needs a separately reviewed
digest-pinned runtime and input artifact.

The research worker permanently records a dispatch fence before each Math
Pilot provider call. If the process crashes or times out after this point,
reconcile the potentially charged attempt manually; never replay it merely
to obtain a pass. Completed-response model and token/tool usage are retained
before source parsing. No usage record means **unknown cost**, not zero cost.

## 5. Calibrate

Open `/w/<workspace-slug>/research/math-pilot` and select one Mission. Queue
the proof case and counterexample case. In the Codex-local lane, wait for the
two role-separated AI reviews and inspect their checks, disagreement/gaps,
exact attempt quotes and digests. The fixed calibration oracle must also pass.
A correct label alone is insufficient. If a distinct mathematician later
reviews the dossier, they use the separate three-stage human desk: verify the
sealed protocol and model-attempt digest, decide every retained research
finding with reasons, then complete the five-item mathematical review ledger.
Do not mistake AI review for that human attestation.

Record for each case: ResearchRun ID, contract digest, approved research
digest, model identity, provider usage/cost, elapsed time, worker state,
reviewer identity, assessment and any failure. A source-backed citation is
evidence of a source, not of a novel proof.

## 6. Open case

Only after both calibrations pass for the same Mission and model, enter the
exact statement, definitions, assumptions, falsification criterion, success
criterion and exclusions. Do not paste a known answer into the prompt. The
server seals this contract; revisions require a new case, not an edit.

Permitted result labels are `SUPPORTED_ARGUMENT`, `VALID_COUNTEREXAMPLE`,
`PARTIAL`, and `INCONCLUSIVE`. An AI-only open result must not be presented as
an accepted theorem; unresolved gaps remain visible. For a theorem claim,
engage independent mathematical scrutiny and, where possible, a formal
checker. Check that a formalized statement faithfully matches the original
natural-language problem; retain the checker version and axioms.

### Repeated structural campaigns

Read the latest sealed campaign and its stop reason before confirming another
one-round direction. A stopped verifier is not a failed theorem proof; inspect
whether the task addressed the exact retained gap. For residual-prime
Erdős–Straus work, the next planner and verifier receive only prior finite
exclusions with a complete per-A audit and a PASS from the fixed independent
Python replay. The new `PRIOR_FINDINGS` event preserves the source cycle's
ledger digest and replay digest. Treat these as hard counterexample constraints
on proposed universal statements, never as proof of coverage outside the
finite scope. The Math Pilot page shows the carried finding explicitly.

The 2026-09-29 A=11 attempt stopped at `VERIFICATION_REJECTED`, before the
solver. Prime 10,051,441 already refutes the bare claim that every A=3/A=7
survivor must succeed at A=11. A next campaign must pursue a genuinely
narrower structural condition or classification that explains this case and
must be separately confirmed by the human operator. Do not label the old
finite exclusion or model agreement a mathematical breakthrough.

The subsequent unrestricted-root campaign transfers that finite fact only
after digest-chain validation and an independent replay of its source trace.
Its proposed square-and-two-gate A=11 lemma was falsified at `p=131041` by a
separate read-only Python audit; the cycle itself remains `TOKEN_LIMIT` with
one inconclusive critic and no adversary. See the open-root campaign report.
Do not treat an outside-cycle replay as an in-cycle certificate. A new
structural-counterexample certificate path must bind primality, every premise
and the exact target-gate exclusion before AI classification. Keep the
historical event chain unchanged when tightening future admission rules.

For new structural `COUNTEREXAMPLE_ATTEMPT` rounds, the solver must emit the
typed `{prime, failedThroughA}` candidate, not only a prose number. The cycle
recomputes residual-prime primality, all A=3,7,...,failedThroughA factor-pair
exclusions and the square/divisor facts, then invokes the fixed, SHA-pinned
Python replay before calling CRITIC or ADVERSARY. Inspect the
`COUNTEREXAMPLE_REPLAY` event's PASS/FAIL, per-A rows and script/output hashes
in the dossier. A FAIL or missing/misbound candidate stops as
`COUNTEREXAMPLE_REJECTED` without AI classification. A PASS does **not** attest
the wording of a proposed lemma, novelty, or the unrestricted conjecture; the
review agents must assess those separately. Later campaigns may carry the
validated finite replay as `PRIOR_FINDINGS` with its structural premise flags,
but may not reuse a disproved implication as a fresh hypothesis.

To force a known counterexample into a *new* structural campaign before
planning, enter both `Prime p` and `Failed through A` in the campaign form,
with a target A strictly later than the failed gate. The server seals these
inputs in `HUMAN_STEERED`; the worker appends a
`PRIOR_COUNTEREXAMPLE_REPLAY` PASS/FAIL before `CALL_STARTED` for PLANNER and
passes only validated finite facts to the planner/verifier. On FAIL the cycle
stops without an AI call. The event is a bounded exclusion certificate, not
evidence that the proposed next lemma is true or new. Inspect event order,
script/output digests, and any new proposal before claiming an e2e pass.
The 2026-09-29 browser replay and the two A=23 campaign outcomes are recorded
in `MATH_PILOT_STRUCTURAL_COUNTEREXAMPLE_2026-09-29.md`; neither campaign
established a general lemma.

## Stop conditions

- Any credential or private source enters an audit, source record or log.
- The worker cannot advance a queued case or fails its retained source check.
- A human reviewer is the same person who requested the case, or AI is
  represented as a human reviewer.
- A calibration is mislabeled, lacks an independently checked argument, or
  its digest fails recomputation.
- The provider spend cap or agreed time box is exhausted.

Stop and retain the failed dossier. Do not weaken the gate or substitute a
manually edited database row. The UI and tests may be locally ready while live
calibration remains unverified.
