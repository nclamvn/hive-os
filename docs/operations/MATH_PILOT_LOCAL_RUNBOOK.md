# Mathematics pilot — local runbook

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
task, but that is not a novelty certificate. A missing/corrupt passage, failed
discovery, unresolved source-scope mismatch or disagreement
stops that round. Do not force-dispatch a held task or alter its ledger.

The initial primary-passage corpus is limited to three Erdős–Straus facts; its
hashes cover retained normalized excerpts, not entire publisher pages. Crossref
hits are leads, not full-text evidence. A generic open problem without a
captured primary passage will HOLD. The mathematical statement is sent to
Crossref for discovery, so do not use this local pilot with confidential
statements until an external-discovery policy is agreed. The new hard call cap
is seven per round, while observed-token and time thresholds remain checked
only between calls. Old five-call cycles remain historical and are not replayed.

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
