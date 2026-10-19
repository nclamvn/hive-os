# Proposed TIP-064 — durable local proof-unit audit

Status: PENDING HUMAN APPROVAL. Date:2026-10-04. This is a proposal, not a
sealed TIP, implementation, live activation or mathematical acceptance.
User “tiếp theo” requested continuation after063; Main performed read-only
focused scans with three Builders under Vibecode Kit. The063 phase explicitly
required a separately approved detailed scope for durable live integration.

## Objective / success definition

Create ONE prospective local case in which real SOLVER, CRITIC and ADVERSARY
receive the full p83 proof unit, address every named premise/inference, and
retain their actual input bindings, feedback, contexts and usage. Reuse the
existing command/outbox/durable-job/attempt/review architecture. Do not create
a third research executor, run more primes or replace the historical062 case.

Success means demonstrable mathematical-input consumption and trustworthy
scope-correct persisted criticism. An INCONCLUSIVE or rejected argument is a
valid experimental outcome, not permission to rerun until agreement. Even
unanimous conditional support is not fresh forest verification, formal proof,
global14/15 LRC, academic acceptance or novelty.

## Evidence-led focused scan

- Prisma already stores MathPilotCase.contract as JSON (schema2830),
  ResearchRun.mathModelAttempt as nullable JSON (2658), and
  MathPilotAgentReview.ledger as JSON (2863). Review caseId is unique (2857).
  Therefore create a NEW case/run/review; no DB migration or old review rewrite.
- math-pilot.ts94–107 has strict separate contractv1/v2 branches. Current
  campaign binding requires exact fixedv2 content; do not broaden it to v3.
- contracts.ts98–130 has an unversioned strict attempt with optional host
  evidence. New optional fields must be absent in old lanes, without defaults,
  so historical canonical encodings/digests remain readable and identical.
- agent-review.ts44–101/242–247 strictly binds ledger5 to campaignv2. Add a
  separate ledger6 branch/guard; do not weaken ledger5 to a version>=5 test.
- worker.ts and agent-review-kernel.ts already provide tenant locks, dispatch
  fences, host attachments, automatic review and immutable result retention.
  Codex adapters already parse actual CLI contexts/usage with subprocess caps.
- observeLrcOnce is062-specific (fixed preset and final ledger5 predicate).
  A new prospective narrow wrapper/runtime may reuse its budget/local guard/
  complete-byte receipts/exact-ID dispatch, but cannot silently repurpose the
  old invocation or change its historical completion predicate.
- The063 preparation/audit is explicitly OFFLINE_INJECTED with offline:
  contexts. It cannot be relabelled live. Reuse only its pure fixed packet
  admission/data formatter and defensive-input principles.
- Current UI recognises campaignv2/ledger5, not a new proof-unit family. New
  passive read model/panel and fail-closed family detection are required before
  generic forms/cycle/polling can be considered.

## Proposed architecture and versioned data

### 1. New request/contract, historical lanes unchanged

Add an explicit local-only fixed request preset for proof-unit audit, resolved
to contractv3/caseType OPEN with NEW lrcProofUnitScope (not lrcCampaignScope or
lrcFiniteScope). Fixed scope identifies conditional common14/32→224 p83 only,
13 moving speeds/14 runners, unit version/id/digest, target and OPEN debts.
The contract binds exact canonical packet identity, not user-edited proof prose.
Reuse ordinary research request creation/calibration/capability checks.

Canonical packet remains
43debef344eb14197d28e9e20446a7d48ee5bcd33758e3d7c8657e0e8a269062,
17990B,8steps/18edges/6premises/14references. No063 byte/digest change.
Its UNEXECUTED/not-provider-consumed language is an immutable preparation-time
snapshot. A separate new host envelope records actual prospective consumption;
the prompt and UI explicitly distinguish snapshot-time from current run state.

### 2. Host-only live preparation and retained attempt

New pure live schemas/preparation are separate from063 offline input/report.
Avoid module cycles: contracts/math-pilot must not import063audit, which itself
imports campaign-integration and those contracts. Low-level shared types may
be isolated in a new dependency-safe pure module; no old schema defaults.

Before provider dispatch, the host admits the fixed packet and checks pinned
retained dependencies by bounded identity import, not a semantic forest replay.
Use existing42-file allowlist identity checks where possible, preserving10s
import/53,211,840B total cap and explicit NOT_FRESH status. Do not issue a new
v2 evidence root for a v3 contract or imply recursive external authenticity.
Failure occurs before the provider fence/model call.

Persist a versioned host proof-unit envelope in the new attempt: full canonical
packet, packet/source-data digest, contract/case/run binding and prepared SOLVER
input reference. Record actual normalised CLI prompt digest including role
instructions, schema and all supplied data. The shared source-data digest is
identical across roles; full prompt/input digests differ by role and review
attempt binding. Retain enough bounded prepared input to recompute those hashes
from the persisted record, not from a mutable current template.

Each complete prepared prompt/input<=49152UTF8B, INCLUDING the attempted argument
for critics. Refuse overflow before dispatch, no silent truncation or selective
dropping of mathematical premises. Per-role structured findings<=8192UTF8B,
summary<=1024/finding reason<=256 characters; host proof-audit summary<=32768B.
New-lane solver mathematical output (argument/self-checks/limitations/findings
together)<=16384UTF8B before embedding in review input; older lane limits stay
unchanged. Actual full prompt still checked, including JSON escaping/metadata.
Existing stream/process caps continue to cover outer provider envelopes.

Host role-input reference carries version/transport/rendererVersion, unit and
packet digest, contractDigest/caseId/runId, role, canonical inputDigest, exact
UTF8 stdin promptDigest/promptBytes, actual output-schema bytes digest and
requestedModelName. Reviewer inputs additionally bind solverAttemptDigest.
Thread/usage are NOT inputs to those pre-dispatch hashes; they are attached
only after actual transport returns, avoiding circular provenance.

Model output may author only mathematical feedback: every named premise and
step exactly once, bounded conditional/open/missing/disputed findings, scoped
argument and limitations. It cannot author packet/envelope/digests, provider
identity, thread, usage or other host evidence. Bind these only from prepared
host input and parsed actual Codex JSONL. Missing actual usage/context refuses
retention as a valid completed audit, not fabricated zeros.

### 3. Existing jobs and prospective ledger6

Reuse requestResearchRun → math-pilot.codex-local.execute → normal worker
attempt persistence → automatic math-pilot.codex-local.review → normal review
kernel persistence. No direct schema-bypassing DB writes or detached executor.
Verify immutable packet/contract/case/run/input identity before/after every
role call and at tenant-bound retention under existing locks/fences.

New ledger6 retains the proof-unit reference, solver input binding, two ordered
critic input bindings/findings and actual per-role model/context/usage provenance.
Reviewers additionally bind the exact solver attempt digest they inspected.
All three contexts distinct. Requested CLI model identity remains requested
provenance, not independent provider/institutional attestation.

At best root PARTIAL plus a separate CONDITIONAL_REVIEWED audit state. OPEN,
MISSING or DISPUTED required findings prevent conditional agreement; any rejection
must remain visible and cannot become root proof/counterexample acceptance.
No SUPPORTED_ARGUMENT, VALID_COUNTEREXAMPLE, PROVED, fresh-forest or global
conclusion from schema validity, samples or reviewer consensus. Existing
AWAITING_REVIEW governed state is not silently converted to human acceptance.

Passive durable admission recomputes contract, packet, prepared-input, attempt,
research and ledger bindings, roles, grounded criticisms and conservative outcome.
Legacy contracts1/2, attempts and ledgers1–5 continue to use their old rules;
cross-lane fields, version downgrade/upgrade, substitutions and missing new
host evidence fail closed, including coherently rehashed malformed records.
Explicitly deny the new family in math-cycle-kernel as well as UI. A worker
must not reconstruct it as generic OPEN and drop its proof-unit fields.

### 4. Passive UI and visible observation

Add a separate proof-unit-run projection/panel to the selected math-pilot case.
Recognise new-family markers even when invalid, before any legacy action,
cycle, generic form or polling fallback. Keep062 v2/v5 projection unchanged.
Keep063 static preparation panel as a snapshot, not a fabricated live report.

Display actual case/run status, fixed snapshot/current consumption distinction,
three roles, original escaped feedback, named findings, inputs/source/packet/
attempt/ledger digests, context/requested model/token provenance and OPEN debts.
Missing/failed/integrity-invalid data is labelled explicitly; successful job
status alone does not attest valid mathematics or a complete review. Reuse
HIVE tokens, disclosures and explicit safe TeX companions, not legacy heuristic
conversion of canonical prose. Links derive from the authorised workspace.
No importer, checker, callback/model, polling or write from rendering/GET.

## Staged authority proposed for approval

A. Implement additive versioned integration/UI, offline adversarial tests,
independent cross-review and whole types/lint/build. No live activity until
the scoped engineering checks pass. Retain current063 packet and all earlier
research/verification evidence; only prospective product code may be extended.

B. Only after A passes, perform one read-only local readiness check for the
explicit actor pilot.demo@hiveos.invalid, workspace mathematics-pilot-lab-156de0,
mission31943653-4a30-462a-af11-ecd99f9ebfa2. Recheck active membership/capabilities,
sealed same-requested-model calibrations, subscription login and no active-case
conflict; do not bypass or backfill missing prerequisites.

C. Only if B passes, create exactly ONE new case, run exactly ONE SOLVER and
its ONE automatic two-role review with gpt-6-sol through existing local Codex
subscription transport. No paid API, retries, extra cases, next-prime research,
fresh forest or author-code execution. Exact captured outbox/job IDs only;
no shared worker loop. Existing one original30min budget,240s child deadline,
1MiB per stream,10s import and1800s lease; reserve all remaining role windows
before creation. Cooperative DB/FS boundaries remain explicitly limited.

D. Persist actual outcomes/complete-byte create-only600/fsynced JSONL receipts,
including failure/uncertainty and known IDs. Never rerun a model to repair a
receipt or incomplete postcheck. Restore web/shared queue/worker/campaign gates
OFF. Perform tenant-scoped readback and show the new selected case in Codex.
An authorised browser observation may be attempted once; if transport again
fails, preserve NOT_RUN visual acceptance, no repeated long-timeout retries.
Do not mutate old062 case or manufacture role content to make the UI complete.

No Git, billing, deployment, install, env-file edit or migration is included.
If implementation needs any of those or a materially different runtime/model,
return to human direction before expanding scope.

## Acceptance matrix

- R1 New fixedv3 request/contract routes correctly; old canonicalv1/v2 digests
  and absence of new fields remain identical; new/old lane substitutions refuse.
- R2 Complete immutable packet and bounded real prepared prompts are retained
  and recomputable for each role; model cannot author host bindings/usage.
- R3 Worker/review use existing exact jobs/fences/tenant locks, enforce all
  three distinct contexts and final ledger6; no duplicate dispatch/retry.
- R4 Complete named role findings and conservative outcome guards reject
  forged promotion, changed sources/quantifiers, missing/deleted findings,
  shared contexts, invalid actual usage and coherent cross-case rehashes.
- R5 Passive VN/EN UI exposes valid actual input/role provenance, fails closed
  for malformed new-family data, suppresses legacy mutations/polling, and
  preserves old062 and063 display semantics; explicit TeX/prose tests pass.
- R6 Original caps,42-file identities, old history/readers and106 sealed
  entries unchanged; new regression suites/types/lint/build pass. No migration.
- R7 One-shot readiness/refusal/failure tests pass without model calls. Real
  execution, if approved gates pass, has create-only receipts, exact new IDs,
  actual accounting and valid tenant readback; otherwise explicit NOT_RUN or
  PARTIAL_OR_FAILED, never backfilled agreement. Browser result separate.

## Task graph / review

Core Builder: new pure live schemas/bindings, additive contract/attempt/ledger
admission/outcomes and frozen legacy regression controls. Integration Builder:
existing adapters/worker/review kernels and prospective exact one-shot runtime/
receipt integration, no alternate workflow. UI Builder: separate passive run
projection/panel and selected-family guards. Cross-review mathematical/binding
and runtime boundaries independently; Main verifies aggregate and owns any
approved one-shot observation/readback. Sealed implementation TIP and completion
reports are created only AFTER this detailed proposal is approved.

## Decision requested

Approve TIP-064 stages A–D as bounded above, including at most one new real
three-role local Codex observation after engineering/readiness gates. A reply
clearly approving this scope is sufficient; no mandatory magic phrase. Until
then, code and live activation remain unchanged.
