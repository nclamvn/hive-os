# TIP-076 — Research Core v3: root-cause upgrade blueprint

2026-10-05. Status: DESIGN_PROPOSED / BUILD_PENDING_HUMAN_APPROVAL.
Owner request: resolve the four weaknesses in the candid project assessment,
particularly coordination cost and cross-problem generalization.
Mode: ENGINEERING_DESIGN; no mathematical experiment is authorized here.

## Decision and predecessor

One approval is requested for the complete local engineering package below,
not approval of every child task. Reuse the current command/job infrastructure;
introduce a versioned generic campaign lane, not another disconnected agent loop.
Keep legacy lanes readable and semantics unchanged. Old p139 execution is NOT
resumed, repaired in place, migrated, regranted or used as a positive fixture.

Predecessor repair is CLOSED, report
`docs/verification/TIP-075E_R1_MAIN_COMPLETION.md`, SHA256
`af18892b777d10d8e9aa258c536377bc8bff76aa9e913ac01c7a051a09a25cae`.
Scientific root LRC_P139_REPRODUCTION_075 remains REPRODUCTION, G/C/T/B OPEN0/4.
This proposal does not change that root into a generic demonstration.

## Focused scan and root causes

Main read the relevant source seams and two read-only Builder scans. This is
not a new whole-repository audit, test run or production readiness attestation.

| Weakness | Inspected cause | Reuse / repair |
| --- | --- | --- |
| Benefit unmeasured | math-lrc-matched-benchmark.ts produces NOT_RUN reports, not comparative outcomes. | Existing usage/trace accounting plus an executable paired evaluator. |
| Excessive intervention | math-cycle-kernel.ts:768 already queues the next round; :795 requires first claim. research-sandbox-cycle.ts:202–221 collapses failures and dead-letters. | Keep outbox/leases/idempotency; add effect-aware stage recovery and reserved diagnostics. |
| Poor transfer | math-research-commitment.ts:12–30 closes only one typed ES survey; math-cycle-kernel.ts:1224 emits ES certificate events. Generic solver schema/prompt contains ES fields. | Separate problem semantics and checkers from lifecycle/admission/provider dispatch. |
| External value unknown | Existing reviewed results do not establish external user acceptance. | Instrument an actual user validation protocol; absent participants stay NOT_RUN. |

Additional inspected seams: worker.ts:313–349 provider admission/result retention;
math-cycle-kernel.ts:913–917 operation admission; :1160–1188 tool/replay/solver flow;
command-runtime/kernel.ts command/outbox transactions; command-runtime/jobs.ts
claims, heartbeat and failure handling. Reuse these, not a second job database.

## Architecture decisions requiring this approval

### A. Generic contract; explicit domain adapters

New lane uses a versioned ProblemContract containing target, mode, definitions,
domain, ordered quantifiers, assumptions/source debt, named obligations,
admissible closure and exclusions. It has no LRC/ES optional fields.

An installed, reviewed DomainAdapter owns applicability, solver/reviewer schemas,
prompt material, capability requirements, certificate normalization and exact
claim alignment. Domain capabilities live outside the orchestration kernel.
ProviderAdapter owns transport/accounting only, never the scientific predicate.
Unknown/unsupported adapter or capability is an actionable UNSUPPORTED result;
it does not silently fall back to an unrelated prompt or emit empty domain checks.
Model output cannot install code, choose arbitrary module paths, grant a tool,
author a host receipt or change closure semantics.

Each adapter declares maximum input/result bytes, graph/array dimensions,
integer/rational coefficient bit sizes, intermediate arithmetic bounds and
checker work/deadline. Host bounds intake before parsing/material allocation,
and reserves checking/replay before invocation. A syntactically valid payload
cannot evade resource admission. Unsupported bounds/profile refuse; callbacks
cannot dynamically import model-selected code or select executable paths.

Verifier results bind predicate/attempt/input/source/runtime identities, actual
checked scope, assumptions, coverage and result. Distinguish integer witness,
exact identity, exhaustive finite coverage, interval enclosure, formal proof,
and reviewed natural-language argument. Replay of submitted code does not alone
prove its mathematical derivation. AI votes, digests and confidence do not close
universal proof or establish novelty. New prose proofs remain REVIEWED_ARGUMENT
unless an applicable formal checker or explicit mathematical acceptance exists.
Human mathematical acceptance binds an actual named reviewer and exact scope;
it is distinct from formal proof and from clicking a generic software approve.
Candidate normalization is lossless and retains original bytes; it cannot invent
missing answers, bounds or proof steps. Interval evidence requires an independent
enclosure derivation/check against the exact sealed expression/input, not merely
equal floors on model-supplied endpoints. False plausible enclosures, wrong input
and boundary-straddling controls must be rejected or remain INCONCLUSIVE.

Legacy contracts/digests remain unchanged; adapters to old records are read-only.
Do not remove safety exclusions to route old LRC records through the ES cycle.

### B. One campaign envelope; recovery at stage boundaries

Human approves exact target/mode, allowed operations/adapters/source assumptions,
TOTAL resources, stop policy and recovery policy once per campaign. The worker
can choose experiments/methods within that envelope; no per-round approval.
Blueprint approval is not an execution grant, provider budget or scientific signoff.

Use existing authenticated commands/outbox/jobs/tenant transactions. Add one
versioned ResearchCampaign aggregate and append-only ResearchCampaignEvent
storage, with a local migration, rather than overloading immutable legacy cycle
semantics or creating an independent scheduler. Stage/call/artifact references
and unique action keys bind to existing durable jobs and object storage.
Builder may select field names/indexes, not silently change this storage decision.

State transitions distinguish QUEUED/RUNNING/VERIFYING, PAUSED_FOR_DECISION,
RESOURCE_STOP, FAILED and COMPLETED. Every stage reserves resources before
effects; every observation records its actual status. Exactly-once external
model execution is NOT assumed. Fencing prevents stale workers adopting results;
reservation/START with uncertain outcome enters PAUSED_FOR_DECISION.

| Failure/effect state | Automatic action within approved allowance |
| --- | --- |
| Proven pre-effect delivery failure | At most one replacement delivery; same logical action identity, new delivery-attempt receipt, all prior and new charges retained within TOTAL. |
| Durable completed stage, matching binding | Reuse retained output; never regenerate or erase old spend. |
| Stable sealed candidate requiring verification | At most one new, explicitly budgeted verifier action if preapproved; preserve prior verdict/failure. |
| Model/tool START but unknown completion | Retain reservation; diagnose; no blind repeat. |
| Mathematical rejection/refutation | Record exact predicate; exclude only that predicate; select another admitted method. |
| Invalid authority/source/integrity or exhausted TOTAL | Stop before further dispatch; no automatic cap/source/goal revision. |

Pre-effect proof requires a durable dispatch fence demonstrating that the
provider/tool invocation boundary was never crossed. Missing START/receipt,
timeout or expired lease alone is NOT proof. Without that proof, pause. Reuse
requires the original target/predicate, input/attempt, adapter/checker source and
runtime pins, authority epoch and valid artifact seal to match. Changed source
or runtime cannot count as a matching output. A new verifier action requires an
admitted reviewed source bundle and its own quota; prior negative results remain.

Diagnostics are preapproved typed, sanitized, read-only operations against known
stage references. Initial maximum: 1MiB read/10s per incident; TOTAL8MiB/60s per
campaign, at most8 incidents. No directory crawling, secrets, arbitrary paths or
model-generated diagnostic code. These quotas are inside the new campaign TOTAL,
not an unaccounted exception and not authority to inspect historical attempt5.

An absent checker is not repaired by bypass. Human intervention is required only
for changed target/mode/source trust/budget, unknown external effects needing a
new attempt, unresolved integrity, or consequential mathematical/public acceptance.
Runtime version/source changes require independent engineering review as one
release bundle; they cannot be approved by a model or a bare flag.

### C. Adaptive science without drift

Reuse method cards, obligation graph and exact refutation history. Planner ranks
applicable methods by the admitted obligation and a discriminating experiment,
not by how easy an existing tool is to run. Reuse source findings by exact
statement/domain/version, not a relevance badge. The in-envelope pivot policy
is declared once; no-information attempts retain cumulative counts across names.
No automatic goal change, retired-predicate recycling or universal claim from a
finite control. A novel theory cannot be guaranteed by a software upgrade.

### D. Measurement and independent acceptance

Measure from actual durable events: scientific obligation delta, accepted-output
rate, false acceptance, tokens/calls, elapsed and active processing time, queue
latency, recovery/rework and human interventions. User-supplied intervention
minutes are labelled self-report; missing minutes/dollar prices stay UNKNOWN,
not zero. Subscription-backed model time has opportunity cost.

Pre-register a 12-task pilot, four tasks per initial domain below, before calls.
Compare DIRECT_WITH_TOOLS and METHOD_ASSISTED with same model/version, source
exposure, tools, total tokens/calls/compute, deadline and post-run evaluator.
These are identical preregistered resource ceilings, not forced equal realized
consumption. Charge every planner/solver/reviewer/tool/checker/failed dispatch/
retry/diagnostic/replay operation inside its arm. The common blinded post-run
evaluator is outside both arm allowances and its cost is reported separately.
Retain in-flight overshoot and UNKNOWN usage as incomplete accounting, never
quietly raise ceilings or omit the pair. Denominators retain all admitted pairs.
If transport attests only requested model identity, actual model/version equality
is UNKNOWN and a disclosed comparison limitation, not an asserted matched fact.
Direct arm has the same total allowance and may use it directly; do not cripple
its tools or count additional method-agent calls as free. Record seeds/order,
failures, exposure/contamination and intention-to-test denominators. Known public
problems are regression/calibration, not blind benchmark evidence. Hidden
references are not placed in solver prompts, schemas, logs or retrieval sources.
Each arm's verdict is evaluated after retention by a fixed evaluator, not its own
agent majority. Exploratory numerical tolerances are not acceptance certificates.

Report per-task pairs and small-sample uncertainty. Do not claim statistical
superiority from 12 tasks. Suggested pilot promotion condition, fixed before
execution: no false acceptance on deliberately invalid controls; and either at
least two additional independently accepted tasks at equal budget or >=25% lower
median human interventions with no loss of accepted-task count. This is a routing
threshold, not a guarantee, population estimate or automatic production release.

Actual user validation: prepare blinded dossier/export + feedback fields for
task completion, error burden, intervention time and willingness to reuse. Need
at least two real independent mathematical users for the first pilot. Recruitment,
messages, consent and external sharing require separate direct authorization;
no accounts, reviewers, feedback or testimonials are fabricated. Engineering
support may close while external validation remains explicitly pending.

## Requirement matrix and acceptance (output, not ceremony)

| ID | Requirement | Required acceptance evidence |
| --- | --- | --- |
| R1 | Generic lifecycle consumes contracts/adapters | Real worker dispatch/retention and operation admission; unused helper FAIL. |
| R2 | Initial transfer across three domains | Number-theory integer witness/refutation, finite graph certificates, rational polynomial identities via same core path; positive + negative exact checks. |
| R3 | Fourth-domain transfer without kernel edits | Freeze explicit orchestration/provider/admission/generic-schema/persistence/scoring source manifest after three-domain integration AND generic recovery/evaluation implementation; separate Builder adds exact rational interval/floor adapter + reviewed registry entry. Domain-owned schema/prompt additions allowed; no generic-core switch/special-case edits. |
| R4 | Verification ceiling/domain alignment | Reject unsupported universal/continuous/novelty conclusions, wrong domains, incomplete coverage, AI-forged host fields. |
| R5 | Single campaign approval | Multiple admitted rounds/within-envelope method pivots; zero intermediate routine human approvals. |
| R6 | Safe restart/recovery | Actual isolated local DB worker killed at pre-START/post-START/post-result boundaries with controlled test provider/durable invocation log; no duplicate test-provider dispatch, matching output reused, unknown effects paused. This does not prove exactly-once live external execution. |
| R7 | Typed diagnostics/failure routing | Distinguish transport/schema/checker/resource/integrity/scientific failure, cap diagnostic read/time and redact sensitive content. |
| R8 | Durable TOTAL and stop | Failed starts/replay/diagnostics charged; restart cannot reset budget/history; revocation and lease fences work. |
| R9 | Adaptive target fidelity | Applicable new method allowed; retired exact predicate cannot return; no-information stop/pivot retains history. |
| R10 | Executable paired evaluator | Actual synthetic replay end-to-end proves evaluation/accounting, separately from live-model NOT_RUN. |
| R11 | Honest evidence/telemetry | Outcome/cost/interventions read from retained events, tampering rejected; UNKNOWN not zero. |
| R12a | External acceptance software support | Export/import/consent/provenance validation with explicitly synthetic engineering controls; synthetic feedback excluded from empirical acceptance. |
| R12b | Real external value | Two actual independent mathematical users and attributable scoped observations; NOT_RUN until separately authorized, never closed by software tests. |
| R13 | Operator/UI usability | Existing research page shows goal, open obligations, next action, verifier scope, spend, recovery and only actionable decisions; existing VN/EN/KaTeX/theme/accessibility preserved. |
| R14 | Backward compatibility/security | Legacy digest fixtures and prior controls pass, tenant isolation, no arbitrary adapter/code/path, source review bundle enforced. |

R2/R3 demonstrate architecture transfer on small exact domains, NOT general
Olympiad/open-problem skill. Live held-out outcomes and expert assessment are
needed for that stronger conclusion. Fourth adapter source review/registry
updates are allowed; generic kernel source digest must stay fixed.
Fourth-domain test traverses the same authenticated command, actual isolated DB
worker, retention, evidence/closure projection and paired evaluator. Re-run shared
core integration with the frozen manifest unchanged after adapter addition.

Operational promotion target for scripted fault/control scenarios: >=50% fewer
routine decision prompts than the frozen legacy trace, no duplicate controlled-
provider dispatch, no false mathematical acceptance. Baseline is saved before implementation;
absolute counts/denominator disclosed. This measures scripted operator burden,
not yet real-user time saved. Do not choose easier scenarios after seeing results.
Use only shared feasible tasks/effect boundaries with a frozen prompt taxonomy;
report new-domain capability separately, not as a reduction against an unsupported
legacy run. If baseline prompts=0, percent reduction is UNDEFINED. Live effect
status stays UNKNOWN unless actual durable provider semantics establish it.

## Task graph and implementation scope

One approved blueprint -> four dependent work packages, not four human approvals:

1. Generic contract/adapter/evidence boundary and three exact-domain checkers;
   integrate actual provider dispatch/admission/retention, retain legacy reader.
2. Durable campaign migration + stage recovery/diagnostics inside existing command
   runtime; integrate #1 and fault-test actual isolated local worker processes.
3. Paired evaluator/telemetry and feedback dossier support; freeze the integrated
   generic boundaries from #1/#2/#3, then independently add/test fourth adapter.
   No fabricated participants or live-model score.
4. Existing research-page integration and visible browser E2E with explicit local
   test provider; consequential peer review, fresh Main verification/report.

Reuse Next/TypeScript/Zod/Postgres/object storage/Vitest/Playwright, no dependency
or scheduler replacement. Before coding read relevant bundled Next16 docs and UI
skill. Builder/independent reviewer roles remain; Main does not author code.
Expected paths: research-sandbox contracts/adapters/worker/kernel; new campaign
modules; additive Prisma migration/models; existing actions/research page/i18n;
unit/integration/E2E tests. Detailed child TIPs after blueprint approval.

After approval, isolated local test database migrations/fixtures, bounded test
processes and browser E2E are in scope. No writes to current user research data,
no old-source reseal, historical evidence access, old-run replay, live LLM/API,
automatic subscription calls, production/deploy/Git actions. Live activation
needs reviewed final source/runtime pins and a separate explicit numeric campaign
grant; a fixture-provider E2E is labelled engineering-only, never real AI success.

QA: focused suites external120s each/600s aggregate; whole typecheck/lint/build
reported separately with bounded process wrappers; first-failure diagnosis before
retry, no shared lock weakening. Isolated DB/browser acceptance only after current
test infrastructure is inspected; no unbounded full-suite/research launch.
Full feature completion requires actual worker + browser evidence, not mocks only.

## Stop, status and human checkpoint

Design stops here. Await approval of versioned generic lane, additive campaign
storage, the bounded recovery policy and the above local build/QA scope.
Do not publish the four weaknesses as resolved merely because this design exists.
Build can close R1–R11/R12a/R13–R14 software requirements, not R12b; measured
superiority, real-user value and mathematical discovery remain empirical
obligations until actual tests.
Request one confirmation: approve this local upgrade package, without reopening
p139, enabling paid APIs or treating synthetic E2E as mathematical progress.
