# TIP-074 — Executable research commitment and drift prevention

2026-10-05. P0 method repair, authorized by the direct human request to upgrade
the core so repeatedly corrected commitment drift does not recur.
Depends on existing cycle/auth/command/evidence interfaces; does NOT authorize
any new experiment, LRC live ingress, source reseal, M1 or campaign.

## Context and decision

Main Contractor read AGENTS, normative handoff and relevant current program/
069–072 history, Vibecode Kit and its scan/TIP/QA references, installed Next
Vitest guide, package and actual queue/planner seams. Builder scan and separate
skeptic design review identified the decisive defect: the LRC planner is an
offline sidecar, while actual proposal/call/tool/next-job admission is in
math-cycle-kernel.ts. A helper that callers may omit does not fix this task.

Focused implementation, not a new research architecture: reuse authenticated
WorkspaceContext, existing durable command/outbox/event JSON, current root
exclusions, exact evidence validators, existing resource ceilings. No migration
or new provider/runtime. Human's request approves these anti-drift semantics;
long RRI/visual Blueprint ceremony skipped, NOT authentication or truth gates.
Builder implements; Main writes specification/protocol/reports only; a separate
skeptic verifies frozen changes and adversarial controls.

Fixed37 includes cycle-kernel. Choose deliberate SOURCE_REFUSED after its edit;
DO NOT rewrite old37 hashes, old renderer, historical records or admission pins.
This task cannot claim full-source runtime readiness. New reviewed closure and
exact human G2 remain prerequisites to later live work.

## Requirements (R1–R8)

R1. One immutable bounded commitment per active research scope. It binds exact
root identity/digest, mode, milestone statement, allowed obligation/predicate
definitions (domain, ordered quantifiers, assumptions), approved work envelopes,
success evidence kind, and finite no-progress/work budget. Semantic fields are
canonical/digest-bound; host copies/freezes them. Model text/IDs/confirmation
booleans cannot become a trusted commitment. No automatic commitment from
whatever output the model happens to return.

R2. Mandatory real execution gates. NEW request requires an explicitly confirmed
choice authenticated by the existing human request context. Server owns actor,
time, command/cycle/root binding. Persist it in existing trusted command outcome
and immutable events and exactly propagate it to jobs. Worker load, every model
reservation, each tool/source operation and next-outbox admission must check
the active commitment. Missing/malformed/copied/downgraded marker cannot fall
back to executable legacy. Historical traces remain readable; historical jobs
without a new valid commitment must not newly execute.

R3. Exact work admission before action. Each proposal identifies its committed
obligation and approved typed operation/predicate/scope; matching prose, a root
contribution label or sourceGap alone is insufficient. Check BEFORE probe,
survey/replay, source discovery/review, verifier and solver. Pre-planner tools
also need explicit committed scope; missing supported tool adapter means refuse,
not guess. This may conservatively refuse unsupported research activities.

R4. Evidence-based progress. Existing exact independent validators may discharge
ONLY the committed evidence requirement with full statement/domain/quantifier/
assumption/typed-predicate alignment. No generic ADMITTED receipt from model
output. Reviews/votes, test count, coordinate count, new hash/prose, known finite
PASS, source adoption and conditional narrowing DO NOT close a stronger
obligation or reset the no-closure frontier. Unsupported universal proof adapter
stays OPEN; explicitly distinguish engineering verification and scientific
milestone. A valid exact refutation can close only its registered predicate.
An explicitly committed FINITE_SURVEY/NO_FAILURES obligation may close FINITE
only from same-round exact COMPUTED + independently validated replay over the
complete declared plan. This never closes a universal/prime-full-chain target.

R5. Bounded stagnation survives ordinary churn. Count attempted/completed work
from a complete bounded durable history, not take:8 adaptive-memory snippets.
No fresh candidate, batch/campaign name or failed/restarted lineage resets it.
Overflow, missing/invalid history or ambiguous accounting fails closed. After
the committed no-closure allowance, stop selection, all calls/tools and next
outbox; branchLocal/canSwitch/nextGap cannot override. State the exact identity
scope; do not claim semantic equivalence detection across arbitrary root clones.

R6. Explicit human-only revision. Do not edit old commitment/events. A strategic
change requires a newly authorized confirmed command with exact expected prior
digest and reason, under consistent root-before-cycle locking/CAS. Preserve
predecessor/history; ordinary continuation cannot reset counters. A new
authenticated strategic revision may approve a new bounded epoch, explicitly
reported as HUMAN_REVISED, never autonomous continuation. Stale/missing prior,
same-process fake approval, caller actor/time, model revision or active/failed
conflict refuses. No new endpoint or broadened capability authorization.

R7. Integrate the shared rule into the existing LRC offline planner for sealed
batches: commitment absent => no next candidate/actionable planning; mismatched
mode/root/source/obligation/predicate or stale scope refuses; old batch:null
passive retained diagnostics stay available. This remains offline and grants
NO execution authority. Keep accounting and previous exact refusal checks.

R8. Durable Contractor discipline. Main updates AGENTS and one short canonical
protocol so a later “tiếp tục” resumes the active commitment, not a new TIP family.
Before work: identify the active milestone, exact open obligation, expected
closure evidence and stop condition. If no active approved scope, stop and
request direction; never silently activate 072V or manufacture a new approval.
This turn's milestone is METHOD_REPAIR_074 (engineering), not an LRC result.
After it closes, choosing a specific full-prime research campaign is a separate
direction checkpoint; no automatic activation of p139 or a fresh M1.

## Acceptance scenarios

- A1: missing/unconfirmed/foreign/tampered commitment => no command/job/tool/model.
- A2: valid authenticated choice => exact persisted immutable binding; historical
  read compatibility, no legacy executable downgrade.
- A3: changed mode/source/obligation/predicate/domain/quantifiers/assumptions or
  local-family lemma offered for complete-prime reproduction => refuse pre-tool.
- A4: coherent rehash, new prose/hash/test count/votes/source adoption/finite PASS
  cannot satisfy stronger closure; missing universal adapter remains OPEN.
- A5: two no-closure experiments (or smaller approved allowance) => stop; rename,
  switch, new batch and failed/restarted work cannot wash bounded history.
- A6: malformed/overflow/incomplete history and unknown accounting => stop, not
  reset. No existing resource cap raised.
- A7: stale/missing prior/model/caller-auth revision => refuse; exact confirmed
  authorized revision => append-only predecessor and explicit new epoch.
- A8: all real kernel gates and next-outbox are actually exercised using mocked
  DAL/agents/tools; negative controls assert ZERO off-contract side effects.
- A9: LRC sealed-batch missing guard blocks next work, batch:null stays passive;
  no LRC exclusion relaxed or dispatch authority granted.
- A10: source registry bytes unchanged and stale fixed37 source refusal observed;
  all six execution flags remain OFF and no real scientific state is mutated.
- A11: bounded hostile JSON/cycles/getters/duplicates/copies/cross-scope and
  deterministic frozen output tested. Preserve prior scientific history.
- A12: startup protocol/active method-repair commitment and final report agree
  with actual source/tests and do not declare a mathematical breakthrough.

## Scope and handover

Builder may add a pure commitment module and focused fixture/tests, and modify
only the actual cycle schema/kernel/adapter mandate, offline LRC planner and
their mechanically necessary fixture tests. Report exact changed files before
freeze. Scope ambiguity or need for schema/route/registry/UI/authority expansion
=> report to Main before implementing. Avoid new UI; API admission is evaluated
offline, old UI cannot implicitly approve a new milestone.
Mechanical actual-call propagation may modify the existing
src/server/workers/research-sandbox-cycle.ts and
src/app/actions/research-sandbox.ts; these are not new routes or auth bypasses.
Use an independent optional CommitmentPlanningContext passed to existing agent
interfaces, not a fake adaptive method packet for non-ES roots. No need to edit
the immutable research-program baseline or add a critic adapter just for display.
Old UI submission without an explicit choice is intentionally refused; report
this operational limitation rather than silently generating a default approval.
Complete history must have a bounded limit with overflow refusal. Lock order
must be consistent; human revision must refuse while relevant queued/running/
failed unresolved work exists, so it cannot race an already admitted async tool.

All verification commands set RESEARCH_WORKER_ENABLED, MATH_PILOT_QUEUE_ENABLED,
LRC_CAMPAIGN_LOCAL_ENABLED, RESEARCH_OPENAI_ENABLED, RESEARCH_CODEX_LOCAL_ENABLED,
SANDBOX_DOCKER_ENABLED to false (test-only environment mocks explicit).
No private ResearchDiagnostics read/stat/write, live DB/session/experiment,
model/provider/API, native job/M1/campaign, install/migration/env edits,
Git commit/push, billing/deploy. Preserve 1724 baseline nonignored files except
explicit scoped modifications; Main appends handoff/manifest and AGENTS protocol.

Builder completion must map R1–R8/A1–A12 to fresh tests, list source-pinning/UI/
runtime limitations, failures and deviations. Independent skeptic owns NEW
hostile tests/report only; Main reruns final frozen tests/types/lint and verifies
preservation, not merely report hashes. Full build only if proportionate and
no silent live activation/network allowance; justify any SKIP explicitly.
