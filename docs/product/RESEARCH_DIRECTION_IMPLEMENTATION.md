# Research direction: implementation and verification

Date: 2026-10-19. Owner authorization: refine the proposed manual/auto direction
and implement complete steps. Contractor: main Codex session. Builder: delegated
`research_steering` agent under local Vibecode Kit v6.3. No deployment or new live
research campaign is authorized by this implementation task.

## Outcome and smallest change

The researcher enters an idea in natural language, or delegates method selection,
without becoming a prompt/JSON courier. Both options keep the same objective and
existing results. Reuse the existing research form, durable request/worker,
source snapshots, finding decisions and history. Do not build another agent host.

Two modes are strategic control, not execution transports. `HUMAN` requires an
intuition; `AUTO` delegates method selection, not a new goal or permission. Both
request only one bounded research step. The current generic provider discovers
sources/findings, not unrestricted math/code experiments. The lean manual-import
workbench and sealed historical mathematics runtime are not relabeled as auto.

Baseline is a direct tool-enabled Codex/Cowork agent with the same brief, history,
sources and ability to self-repair. Existing A/B records show ties/losses, not
superiority. This slice targets easier steering and continuity. Actual human-time
savings, paid-runtime quality and customer willingness to pay remain unmeasured.

## Implementation contract (TIP)

- Add a small typed direction contract, derive retained lineage/context server-side.
  No database migration, new provider, dependency, default reviewer or gate family.
- An authenticated request resolves any parent within the same tenant, workspace
  and mission. Preserve its objective and source restrictions; exclude sealed math
  cases. Client-supplied context is not authoritative. Keep old records readable.
- Bound context and label omitted history, source status and unreviewed findings.
  Research text is data, not an authority to change runtime permissions.
- Prompt the existing research provider to examine the human idea critically, or
  choose a reasoned next direction in auto mode, report gaps and limitations, and
  never self-approve a theorem. Keep existing source retrieval and quote binding.
- UI reuses design tokens, shared button sizes and one aligned content width.
  Simple labeled radio options, one natural-language field and optional history
  selection, with advanced controls collapsed. EN/VI, visible focus, mobile reflow.
- Selecting a mode is not dispatch. Keep typed guidance and previous results.
  Rejecting a request must retain inputs with actionable localized feedback.
- Check configured readiness before durable dispatch. Do not queue when disabled;
  configuration is not a healthy-worker heartbeat. A queued request is not running.
  Never turn on a worker/API flag or change authorization as a fallback.
- Provide a readable host handoff when execution is unavailable, if achievable with
  the same data contract. Clearly separate a prepared brief from an actual model
  result. No normal-workflow JSON imports or invented research observations.

## Verification and stop rules

Engineering checks: direction modes and length limits; missing intuition;
unchanged objective/policy; forged context/parent; tenant/mission isolation;
unavailable execution with no command/outbox; source trust status and bounded
context; historical compatibility; one-step/no call on switching; retained inputs
and history. Use deterministic unit/action tests and mock provider tests, labeled
as such. Run typecheck, scoped lint and diff checks. Independently exercise the
real authenticated UI, both languages, keyboard and narrow viewport.

No paid API, CLI solver or K6 execution for QA. Live content quality and dispatch
are NOT_RUN unless separately authorized and configured. No fabricated successful
run is inserted into the local database. No new scratch copy or Next distDir.
Before any substantial build, check disk free space >=20 GB.

Do not widen into generic memory/planner or a new runtime to make this slice look
complete. Report unsupported deep-research tools, takeover/cancellation and model
readiness plainly. After integration verification, stop with a reviewable local
result, remaining steps and evidence rather than adding another campaign.

## Completion / independent verification

Implemented locally on 2026-10-19. Seven production files changed/added, no new
dependency, database migration, provider, swarm, recurring loop or execution grant.
The existing adapter remains `openai / gpt-5.6-sol`, NOT the Codex subscription.
Its existing envelope is one request, 180-second API timeout, <=4 web-tool calls
and <=12,000 output tokens. These are ceilings, not a USD guarantee or evidence
of a healthy worker. Normal UI intent and portable exports require no JSON input.

| Requirement | Evidence and disposition |
| --- | --- |
| Natural-language HUMAN / AUTO choice | PASS: actual authenticated UI; AUTO needs only a goal, HUMAN additionally needs an intuition |
| Keep inputs when changing control | PASS: mouse and radio arrow-key changes retain goal/guidance; mode switch does not dispatch; EN/VI refresh retained inputs |
| Preserve objective, policy and lineage | PASS in mocked real-kernel tests: exact goal/document/provider match, server-derived parent/root and source restrictions; no parent update |
| Tenant/mission and evidence boundaries | PASS in mocked kernel/schema tests: scoped lookup, forged prepared context refused, sealed math/active parents excluded; reviewed context is not fresh verification |
| Bounded and useful inherited context | PASS in unit tests: <=8 findings/sources, truncation and omission counts, source references prioritized; no complete-history or relevance-ranking claim |
| Disabled runtime | PASS in actual UI and mocked kernel: disabled execution with clear explanation; preflight refuses before command/run/outbox; configuration is never called a heartbeat |
| Portable host brief | PASS: original goal/idea and source limits retained, readable text, actual browser download observed; no model invoked or automatic host transport claimed |
| Retry/unknown outcome | PASS in action/kernel mocks: unknown is separate from rejection, same intent uses a stable idempotency payload/key, no automatic retry; actual connection-loss/replay against DB NOT_RUN |
| Layout and accessibility | PASS within observed scope: EN/VI, keyboard radios, 390x844 viewport; document width390/form356, no horizontal overflow. Existing visual language retained |

Independent Contractor rerun of the final focused suite:

```sh
HIVE_TEST_SCOPE=product npx vitest run --project unit \
  tests/unit/research-steering.test.ts \
  tests/unit/research-steering-kernel.test.ts \
  tests/unit/research-steering-action.test.ts \
  tests/unit/research-sandbox-adapters.test.ts \
  tests/unit/research-sandbox.test.ts \
  tests/unit/research-run-grouping.test.ts
npm run typecheck
```

Result: **57 distinct tests across six files passed**, typecheck passed; scoped
ESLint and `git diff --check` passed. Earlier subset reruns are not added to57.
The existing Vite future-native-config-loader warning remains; no unrelated
configuration migration was attempted. No full production build, database
integration suite, provider invocation or mathematical experiment was run.

Browser QA used the real local demo login and existing database on
`http://localhost:3001/w/mathematics-pilot-lab-156de0/research`. Port3000 belongs
to a separate translation app and was left intact. HIVE was started with process-
local research worker/OpenAI/Codex flags explicitly OFF. No demo provisioning,
credential changes, fabricated research records or queue writes were used.
The existing dataset has no eligible completed generic parent for the observed
mission, so actual continuation through a completed live parent is **NOT_RUN**;
its contract is covered by mocks, not misreported as browser E2E success.

Independent QA found and repaired an export bug that dropped new-goal source
limits: `fao.org`, primary-domain policy and maxSources12 now survive export,
and invalid limits are rejected without erasing inputs. Final brief policy is
plain text. Source/model authority was not inferred from the exported file.
Screenshot: [local steering UI](../../artifacts/qa/research-direction-20261019.jpg).

**VALUE EVIDENCE: UNMEASURED.** No claim of stronger mathematics, better content,
lower cost or less human work than a direct tool-enabled agent. Existing A/B ties
and losses remain unchanged. Builder authored implementation/tests; Contractor
independently inspected, reran checks and exercised the browser. This is
engineering review, not independent scientific acceptance.

**Disposition:** READY-with-deferred for the local direction/host-handoff slice;
NOT ACCEPTED as a complete autonomous deep-research product. Next is separately
authorized/configured runtime acceptance on one fresh job, then the same-host
human-effort comparison from PRD section13. Do not add a runtime, extra gate or
another benchmark merely to fill this evidence gap. No commit/push/deploy in this
task. No scratch project copies, extra Next distDirs, installs or Docker builds;
nothing material was deleted. K6 remains OPEN/paused.

## Successor: repair the lean core, keep API simulated

Owner request after the first slice: “vẫn giả lập api hãy chỉnh sửa lõi HIVE để
đạt mindset trên”. This explicitly authorizes engineering the control behavior,
not a paid provider or a scientific campaign. The preceding completion is retained;
its UI/collector success is not relabeled as adaptive research-core acceptance.

### Compact implementation contract

Use the existing `executeLeanResearch` provider and host-verifier ports. Add only
the small state/decision representation required to bind direction to observed
outcomes and the next solver prompt. Preserve the old execution contract when
steering is absent. Do not replace the core by a second agent framework.

1. Host owns stable goal, constraints, history and cumulative work budget.
   A natural-language HUMAN hint is an idea to investigate, not truth or a grant.
   AUTO delegates approach selection, not goal, source policy or access changes.
2. Retain model approach/hypothesis/premise assessment/nearest alternative as
   explicitly unverified self-reports. Keep original attempts and actual checker
   observations. A rejected candidate is not a refutation of an entire method.
3. Feed the retained observations and unresolved obligations into later prompts.
   Block declared retired approaches and exact no-change loops; do not pretend
   string/ID checks detect every semantic paraphrase of a failed method.
4. No default critic. If optional review is supported, it requires a concrete gap
   and an explicit host allowance. Failed calls/critic/repair consume the same
   cumulative budget as solver calls; rounds cannot reset the time/byte/call cap.
5. HUMAN pauses at the strategic fork; AUTO can advance within the finite envelope.
   Takeover preserves the same goal/history. Budget, lack of usable change or a
   requested permission/goal expansion stops instead of creating more work.
6. Connect the same executor to a local authenticated replay surface accessible
   from `/research`. It uses an explicitly selected fixed engineering case and a
   scripted API, not hidden dispatch or a fixture claimed to solve arbitrary goals.
   Show actual generated prompts, original scripted outputs, checker observation,
   cumulative work and next decision separately. No user JSON is required.

Simulation action must recompute any receipts/decisions server-side rather than
accept client-created verified status, budget or authority. Keep local-only auth,
tenant and research capability checks. No real DB records/jobs, live API, CLI
solver or new execution flags. Reuse current styles; controls describe testing,
not a working general-purpose Auto engine. Default test envelope must be small
and enforced by the host, with existing executor absolute ceilings unchanged.

### Acceptance and value boundary

Verify both positive and adverse paths: human hint enters solver context without
formula requirements; false candidate stays rejected; new approach receives
actual feedback; model self-certification cannot close scope; takeover keeps
history; no-progress/retired approach/budget/failed transport stop; continuation
cannot wash used resources; legacy outputs still work. Exercise the real local
action and UI with the labelled simulation; source-free prose remains unverified.

This test is a wiring/control ablation against the previous prompt-only steering,
not an A/B measurement of reasoning superiority. Real-model semantic alignment,
research usefulness and saved human effort remain unmeasured. Stop after scoped
core acceptance; do not open another mathematical target or provider integration
to manufacture a positive result. Contractor owns independent verification.

### Successor completion

**Implemented and locally verified, 2026-10-19.** `directed-research.ts` adds a
small transport-neutral state/step executor over the existing lean executor and
exact verifier, not a second agent framework. The optional direction schema is
backward-compatible. The host retains goal/constraints, original attempts, exact
scope binding and cumulative call/time/output-byte use. Each next prompt includes
bounded historical observations with truncation markers. HUMAN waits at the fork;
AUTO continues only within the same envelope. A mode switch alone never dispatches.

Model-declared refutation is an operational self-report, not mathematical evidence.
Rejected candidates, actual exact refutations and limited exact success are distinct.
Canonical candidate fingerprints stop renamed repetitions; prose normalization
does not detect all semantically equivalent rewordings. Retention/transport failure,
budget exhaustion and no progress terminate rather than resetting the allowance.
Active execution time is cumulative; time spent waiting for a person is excluded.
Output-byte use measures admitted/retained output, not transport billing or tokens.

The authenticated development/test-only replay action accepts bounded control
events, not client-authored state, receipts or budget. It reconstructs the fixed
synthetic transcript through the real core and exact checker. Every click replays
earlier scripted events; this is neither durable research execution nor fresh
model inference. No default critic, live model request, research DB write, new
runtime permission, dependency or migration was introduced. The existing generic
paid collector remains a separate one-step collector and is still disabled here.

Independent Contractor verification of the final core:

```sh
HIVE_TEST_SCOPE=product npx vitest run --project unit \
  tests/unit/directed-research.test.ts \
  tests/unit/lean-execution.test.ts \
  tests/unit/lean-research-action.test.ts \
  tests/unit/research-steering.test.ts \
  tests/unit/research-steering-action.test.ts \
  tests/unit/research-steering-kernel.test.ts \
  tests/unit/research-sandbox-adapters.test.ts \
  tests/unit/research-sandbox.test.ts \
  tests/unit/research-run-grouping.test.ts
npm run typecheck
```

**128 distinct tests across nine files passed.** Subset reruns are not added to
this count. An initial boundary-precedence regression was found and repaired:
output-limit failures now stop as execution boundaries rather than merely missing
strategy metadata. Typecheck and scoped ESLint passed again after the final
presentation/accessibility repair; `git diff --check` passed. No full production
build or DB integration suite was run. Existing Vite future-config warning remains.

Observed in the actual authenticated Codex browser on port3001:

- AUTO rejected `(1,1)`, passed the actual rejection into the next prompt, checked
  `(2,1)` and stopped at limited exact success after two of three scripted calls.
- HUMAN with a natural-language intuition ran one attempt and waited. Switching
  to AUTO did not run anything; explicit continuation retained the first attempt
  and checked the alternative with the same goal and cumulative allowance.
- Unsupported prose had no receipt and stayed unverified. Repeating it stopped
  for no progress at two calls; no third call or critic was created.
- EN/VI switching retained the transcript. Prompt/receipt regions were reachable
  by keyboard, with distinct accessible labels. At390x844, document width390 and
  research form width356: no horizontal document overflow in the observed replay.

Screenshot: [human-to-Auto replay](../../artifacts/qa/directed-core-20261019.jpg).
Scripted English model text/technical receipts are preserved verbatim rather than
translated as if a model had generated a localized answer; surrounding UI is EN/VI.

**Disposition:** local control-core acceptance PASS, general autonomous research
acceptance NOT_RUN. Real-model interpretation of vague ideas, semantic alignment,
deep web research, persistent live takeover and customer advantage over direct
Codex/Cowork remain unmeasured. The simulation cannot solve arbitrary entered goals.
This implementation follows the existing provider/verifier ports and compact UI
tokens; it adds no swarms or approval ceremony. No paid API, mathematical campaign,
commit/push or deploy. K6 remains OPEN/paused. No scratch copies, extra Next output
folders, installs or Docker builds were created; nothing material was deleted.

## Cleanup and Git handoff — 2026-10-20

Owner requested cleaning and committing/pushing the complete preceding slice,
without deploy. Review covered its changed source, tests, documents and two QA
screenshots. No dead imports, debug scaffolding or obsolete branch with safe
removal evidence was found. Only the scripted provider's nested return block was
reindented for clarity; callable positive/negative controls and research evidence
were retained. No broad rewrite, dependency upgrade or ceremonial cleanup.

Contractor reran the same nine-file suite after cleanup:128 distinct tests passed
(not added to earlier runs). Typecheck and scoped lint passed; diff check passed.
Browser evidence remains the preceding EN/VI/keyboard/mobile acceptance: this
formatting-only cleanup did not repeat browser E2E. No full production build or
live API/DB integration test. No scratch folders, build copies or Docker images
were created, and nothing material was deleted. The existing Vite future-loader
warning is deferred rather than hidden. Git delivery is authorized; its actual
commit and remote outcome are reported separately after execution. API remains
simulated, all research-worker settings unchanged, no deploy, K6 still paused.
