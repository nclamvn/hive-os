# Blueprint proposal — TIP-062: controlled live campaign observation

Date: 2026-10-04, Asia/Ho_Chi_Minh. Status: PENDING HUMAN APPROVAL.
This proposal follows accepted TIP-061 A/B. It is not a sealed TIP, a live
result, or authorization to activate the shared research worker.

## Outcome

Run one prospective Allikvere p83 campaign case through the existing local
Codex solver, critic and adversary; retain a validated version-5 review and
display its scope in the existing research UI. The scientific deliverable is
a claim/dependency map and a prioritized next research direction, not another
small shard or a claim that unrestricted LRC has been proved.

TIP-061's evidence remains RETAINED_REFERENCE_NOT_FRESH. The known-source
finite conclusions I(13,83,224)=empty and J(13,83)=empty remain distinct from
global LRC for 14/15 runners. Other 60 P13 primes, independent lower cases,
all 23 APPLICATION gates, formal/external acceptance and novelty remain OPEN.
No fresh full-campaign semantic replay is included here.

## Read-only scan: why phase C needs this addition

- `src/modules/command-runtime/jobs.ts`, `claimJobs`: selects eligible jobs
  by tenant and job type, not exact job identity. Its expired/exhausted lease
  cleanup also changes matching jobs before the claim.
- `src/modules/command-runtime/kernel.ts`, `dispatchOutboxBatch`: selects
  pending outboxes across the tenant; it has no exact-outbox selector.
- `src/server/workers/research-sandbox-cycle.ts`: dispatches up to 50 tenant
  outboxes, then claims by research job type. The worker script polls forever.
  Activating it for one case can therefore mutate or execute unrelated work.
- The research page validates version-5 records, but has no dedicated campaign
  evidence panel. Its cycle-action condition excludes finite LRC, not campaign
  LRC; the backend correctly refuses both. The UI must match that refusal.
- The existing local adapters have strict process/output limits and separate
  contexts, but do not impose a hard pre-dispatch token quota. Distinct contexts
  are not independent models, institutions or formal verification.

These are additions beyond TIP-061's accepted offline scope. Existing A/B
acceptance is not reopened. No model, DB, CLI login, browser, environment or
worker activation was performed by this scan; actual DB readiness is UNKNOWN.

## Proposed bounded architecture

1. Add optional exact-ID selection to the existing command-runtime dispatch
   and claim seams. Selection must constrain all affected queries, including
   exhausted-lease cleanup, before mutations or limits. Preserve tenant checks,
   authorization, atomic claiming, lease/version fences and existing unfiltered
   behavior. A supplied empty selector must never mean “all”.
2. Add an explicit local one-shot driver using normal authorized command APIs.
   Resolve and pin workspace, mission, tenant and requesting actor before any
   write. Never select an arbitrary first administrator or hand-edit jobs.
3. Create exactly one new case with the fixed preset ALLIKVERE_P83_14_V1 and
   the existing sealed campaign statement/success criteria. Capture the case,
   run, command and outbox IDs from the authorized outcome.
4. Dispatch only its solver outbox; claim only the resulting solver job;
   execute the existing solver handler once. On success consume only the
   automatically created review outbox/job. Do not enqueue a second review.
5. Execute the existing critic/adversary review handler once, retaining host
   evidence, immutable input checks, accounting and version-5 oracle gates.
   No automatic retry, polling loop, new case after failure or scope expansion.
6. Add a passive campaign panel to the existing research page. Reuse its
   Panel, StatusBadge, MathText, theme and VN/EN patterns; show evidence mode,
   finite claim, scope/digests, outstanding obligations, ledger validity, role
   contexts, requested model and actual usage. Hide the incompatible cycle
   action. GET/render must not import evidence, enqueue work or call a model.
   No campaign creation form or new UI write controls are required.

## Preflight and operational limits

Target workspace: mathematics-pilot-lab-156de0.
Target mission: 31943653-4a30-462a-af11-ecd99f9ebfa2.
Tenant/actor IDs must be resolved and authorized read-only before creation.
Both required sealed calibrations for the same mission/provider/model must
already be valid; conflicting active cases must be absent. Missing, ambiguous
or invalid prerequisites stop the run, with no calibration backfill or bypass.

Use the existing requested model gpt-6-sol for all three roles; no model
override. Require the existing ChatGPT subscription login check, refusing
API-key mode. This is a local subscription-backed adapter test, not a paid
API-provider benchmark or an attestation of model/institution independence.
Prompts prohibit tools, but prompt instructions are not a hard tool-isolation
attestation. Preserve the existing read-only sandbox and child-env allowlist.

Process-local capabilities may enable the local campaign/Codex/queue path
only inside the one-shot driver. Leave the web server's queue, campaign and
worker flags OFF; continuous worker, OpenAI paid API and Docker execution OFF.
Do not persist flag changes to environment files or start the generic worker.

Use one original monotonic outer budget of 30 minutes for preflight, dispatch,
execution and retention. Preserve each existing 240-second login/exec process
deadline, per-stream 1 MiB cap, parser/string limits, 10-second evidence import
budget and 1800-second job lease. Do not widen these or naively heartbeat a
version-fenced job. Before starting a stage, require sufficient remaining
budget; stop and terminate owned children at expiry. No timer reset on retry.
Completion within the outer budget is not guaranteed. Bytes/time limits are
not token quotas: record actual input/cached/output/reasoning token usage,
and do not invent zero usage when accounting is unavailable.

Retain a create-only, mode-600 operator receipt with exact identities, stage
starts/ends, process outcomes, usage availability and job/attempt/review IDs.
Failure must remain visible as failure/partial completion. Never forge a
review, replace an old receipt, reseal historical artifacts or relabel retained
evidence as fresh. Root conclusion remains PARTIAL or INCONCLUSIVE even when
all model roles support the bounded finite result.

## Acceptance and sequencing

| Requirement | Required evidence |
|---|---|
| R1 Exact tenant/ID isolation | Tests show unrelated pending/ready/expired/exhausted work unchanged; empty/cross-tenant selectors refuse |
| R2 One-shot dispatch | Only one solver and its one automatic review; no duplicate dispatch or retry after uncertain execution |
| R3 Preconditions | Missing calibration, wrong actor/tenant, conflict or disabled capability refuses before creation/model |
| R4 Resource handling | Original caps unchanged; shared deadline, remaining-budget refusal and owned-child cleanup tested |
| R5 Evidence integrity | Same fixed campaign facts across roles; mutation/injection/context/usage failures retain no accepted v5 review |
| R6 Passive UI | VN/EN and narrow/wide layouts show NOT_FRESH, OPEN boundary and role provenance; cycle action absent; no read-side work |
| R7 Compatibility | Historical contracts/ledgers/receipts/pins unchanged; type/lint/build and relevant old regressions pass |
| R8 Bounded live observation | One new authorized case, three attempted role calls at most, real persisted outcomes and honest observation status |

After approval: seal a TIP and delegate implementation to Builders, then
independently verify R1–R7 offline. Only then perform the read-only live
preflight. Run R8 only if all prerequisites pass. If readiness fails, report
the exact blocker; do not broaden the task to repair historical calibration.

Browser observation is separate from HTTP health and persisted DB evidence.
Prior Cua sessions hung; no browser retry is authorized in this proposal-only
turn. Record browser observation NOT_RUN if unavailable and never report
HTTP200 or stub execution as browser E2E. After approval, show the selected
new-case URL in Codex; any browser-control retry must be bounded, not a loop.

No migration, install, billing, deployment, commit/push, new prime/shard,
LLM-authored code execution, formal proof or unrestricted autonomous campaign
is authorized by this proposal. Human decision requested: approve TIP-062's
exact-target additions and one conditional bounded local observation run.
