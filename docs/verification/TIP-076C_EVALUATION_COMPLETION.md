# TIP-076C — Builder evaluation evidence (WORK IN PROGRESS)

2026-10-05. Root `RESEARCH_CORE_V3_076`, ENGINEERING_BUILD. This is an interim
evidence report, not acceptance or a frozen R3 manifest. Fourth-domain transfer
has NOT_STARTED; first actual paired DB fixture passed after Main reviewed
installed source bundle and a serialized QA turn. No live model/API, user DB,
legacy37 reseal, p139/attempt5 access, Git or dependency changes.

## Implemented scoped paths

NEW `src/modules/research-sandbox/research-evaluation-v3/`: contracts, plan,
fixed-pilot, event-projection, evaluator, report, dossier, feedback, kernel,
index. These ten are generic frozen-manifest candidates. NEW domain-owned
`fixed-campaign-catalog.ts` is a separately reviewed installation exception.
NEW tests: `tests/unit/research-evaluation-v3.test.ts`,
`tests/integration/research-evaluation-v3.test.ts`, and the already-executed
`tests/integration/research-operator-baseline-v3.test.ts`.

Preregistration is an authenticated durable command retaining bounded canonical
planBytes/planDigest and ONE common deadline before child approvals. These are
typed public engineering resource data, not credentials. Canonical text avoids
changing the shared legacy secret-bearing-key command validation. Reservations
carry allowanceDigest; actual amounts remain typed append-only campaign events.
Command outcomes contain action/cut IDs, not oversized campaign snapshots.
The postgrade pre-cut is reconstructed only from an authenticated complete view.
One bounded metadata notification per durable command satisfies the unchanged
1–20 outbox requirement; these are not research invocations/provider calls.

Both arms use the same reviewed applicable method cards and fixed controlled
responses. This exercises matched software and accounting, NOT competing live
LLM strategies. Same preregistered ceilings are required; realized usage need
not be equal. Before ANY fixed pilot calls Main approved a correction to fit
real permanent source-scan/check/end-job reservations: arm compute300000ms,
read32MiB, write8MiB, wall120000ms, calls4, simulated-token ceiling4000,
checker2M, two rounds; same ceilings for both arms and catalog transfers. The
old 60000ms/8MiB/4MiB reservation ceiling was insufficient even one full success
cycle, so it was corrected before outcomes, not selected after a result.

Postgrader, dossier and feedback have a separate preregistered permanent pool:
8actions, zero provider calls/tokens, checker2M, compute120000ms, read16MiB,
write4MiB. Source scans, artifact reads and failed grading stay charged. A fresh
exact host checker is called after durable RESERVED and exactly-once STARTED.
Duplicate commands cannot repeat consumed effects. Unfinished START remains
pending and stops further work, not an automatic retry. Events retain original
receipt and closure; serialized JSON cannot mint a fresh host grant.

Historical grades bind the actual pre-reservation ledger cut, action order,
original artifact SHA, sealed contract/root/predicate/input/adapter/version,
attempt, authority/source/runtime/checker pins, acceptance type, receipt body
digest and safe scoped closure flags. Reports first replay chain/reducer, then
validate historical provenance. They never pass stored receipts into fresh
projectClosure authority. One authenticated same-cut reader supplies UI campaign
and grade together; no race between independently loaded cuts.

START count is dispatch fences, NOT proven actual invocation count. Actual calls
remain UNKNOWN without an attributable invocation log; integration captures
controlled provider invocation logs separately. Returned elapsedMilliseconds
is observational finite monotonic duration spanning provider wait, source scan
and retention, not pure provider/CPU time; pureCpu remains UNKNOWN. First retained
queue latency is labelled first-stage job creation→first claim, not total
multi-stage queue. Arm wall ends
at the first actual terminal transition, not later export/feedback/grade cuts.
Missing model/version/price/minutes/usage remains UNKNOWN; started-without-return
usage debt stays present. Zero intervention/invalid-control denominator is
UNDEFINED. Full planned slots, including missing/failed arms, remain denominators.

The owned object-only boundedObservation admits observational finite decimal
durations with conservative byte/string/array/depth/node admission before clone,
rejecting proxy/getter/cycles/nonplain/nonfinite data. It does not weaken the
integer-only scientific contract or candidate parser. Textual plans still use
the existing duplicate-key/depth/byte-bounded scientific intake.

## Actual fixed legacy baseline — before additive dispatcher integration

Task: positive x,y, x+y=5; exact original argument bytes:
`{"kind":"INTEGER_WITNESS","values":["2","3"]}`; SHA
`9f638946fb185c1cf77482da10d69b235833d648876372607624d516fcf5cf36`.
Actual isolated QA organization `35e88c9f-7d8c-41b7-bed1-64e9a496f222`, workspace
`12f7c988-f502-488f-a201-c86ed2de99d9`, mission
`722872ce-fde0-4892-a5e6-b0b9b9bf246b`. Durable audit observation digest
`ac7f399c04d5895206bd05b15c73249d9064eb069e80cd07a858598cd7766bb4`.
Source snapshot of the actually executed baseline test:
`9ed5cf55a4090256fec2d21927f7f1d6a44924d3876714da5f90d3f3cf1ef2f3`.

Two prerequisite calibrations + one shared OPEN existence control: six actual
jobs SUCCEEDED, nine actual CONTROLLED test-provider invocations, 1350 SIMULATED
tokens. Routine required continuation commands0; one optional duplicate review
command FAILED and is NOT a necessary intervention. OPEN old review disposition
AI_REVIEWED/conclusionPARTIAL, not an exact typed mathematical host certificate.
No real participants, actual model/price/user minutes UNKNOWN. Legacy→new routine
percentage reduction UNDEFINED due baseline0; empirical benefit NOT_ESTABLISHED.

Legacy worker automatically queued review; earlier 1→0 expectation was withdrawn
before execution. We did not disable it or select another favorable task. Main
approved future compatibility fixture tracking additive dispatcher's current
before/after hash while keeping original observation/pins immutable. Such reruns
are explicitly LEGACY_COMPATIBILITY_RERUN, not replacement frozen baselines.

Actual legacy source hashes at baseline:

- worker.ts d6a8b8f2022d53e473064914f8f3af8bb9669f9ec3964a4647f7f246e8c83bbb
- agent-review-request.ts 4dc726143379e12b21ca4001363395a5a3b8207ccbce3037d1561c546840a8cf
- agent-review-kernel.ts 03912151a298e746b4465e94ca6c2b1166c248125a5d60dea79483682c073dcf
- dispatcher dedada6c512b22da37c2e124a57d1eb8f5740464e640d6330a8fff6f83d1f8ff

No original DB rows were updated or truncated. Baseline readback checked both
runtime and migration targets loopback5433/hiveos_test before connecting.

## Recorded QA, including failures

All Vitest commands use `/usr/local/bin/node node_modules/vitest/vitest.mjs run
--project <unit|integration> <exact file>`, supervised by `/opt/homebrew/bin/python3
-I -S -B` subprocess with stdinDEVNULL, own process group, external120seconds,
kill-group/2second bounded cleanup on timeout. No aggregate600second overrun.

1. Baseline sandbox integration FAILED infrastructure (Prisma local socket EPERM),
   zero cases executed, external1.467s. Read-only diagnosis established isolation;
   same focused approved escalated suite then PASS1/1, test620ms, Vitest2.49s,
   external2.767s, exit0. Failure is retained, not counted as product success.
2. First C unit suite31/43 PASS,12failed, tests521ms/Vitest767ms/external1.021s.
   Shared scientific safe-integer parser rejected fractional observation times;
   owned observational parser fixed this without scientific schema weakening.
   Three mutation fixtures accidentally used the identical source pin, and three
   feedback fixtures rebuilt nondeterministic fresh receipt/dossier on each call;
   corrected test fixtures used different pins and one fixed owned dossier.
3. Corrected C43/43PASS, tests541ms/Vitest800ms/external1.041s, exit0.
4. A later unit invocation FAILED before collection, zero tests, external0.562s,
   because B's new queue schema required explicit null missing queue detail;
   owned synthetic fixture updated to explicit null, no runtime weakening.
5. C43/43PASS after current source guards, tests545ms/Vitest802ms,
   external1.088s, exit0. Five newly added observational intake controls have not
   subsequently executed:48/48PASS, tests521ms/Vitest782ms/external1.142s, exit0.
6. Whole tsc initially identified owned outcome/snapshot/nullability/byteSHA and
   peer test type issues; fixed owned code, peers fixed their own. Latest whole
   tsc PASS `node node_modules/typescript/bin/tsc --noEmit --pretty false`,
   external8.224s, exit0. An earlier initial unwrapped tsc was diagnostic only;
   it is not asserted external-deadline supervised.

## Actual paired integration observation, initial reviewed source epoch

Main installed initial reviewed source bundle
`10b003bb55a832115e94cf721eedc8e9b08001b09b01cda718d1c86d0407a9af`.
Serial order B→C; no runtime source edits during C window. Both URLs preflighted
loopback5433/hiveos_test BEFORE migration/connection. Exact targeted two-case
suite PASS2/2, tests9.07s/Vitest11.04s/external11.376s, exit0.

Pilot preregistration `7a329173-6fec-492c-a484-0890d9138b74`, planSHA
`f38fddbb24a84e1a79495cce4333a37a6a93714f63e1671345a0d342d94f747e`,
organization `388fb65e-60b9-47da-86a5-c3a3a8ee9628`, workspace
`b4612729-0339-4598-95e4-ed8d840cdc7a`, mission
`886333da-3b7e-4359-8661-a7d63ec51510`.24 actual arms,28 actual CONTROLLED
provider invocations logged by the test transport,868 SIMULATED tokens,
24 separately reserved fresh grades:18ACCEPTED_EXACT_SCOPE and6REJECTED,
9 accepted per arm, zero false acceptances on six invalid arm-controls.
Audit observation `cc1a7703d7b64a09d2dae4163c00167c74fb1745abedc2cf0a03368f374b9095`,
report `2246095ff552411085e2c6600eee6573546bb1f9754fef123acafb32b64b74ea`.
Routine0→0 produces UNDEFINED reduction, not measured automation benefit.

Small existing-domain transfer preregistration `df6cc6eb-5e48-4499-87f4-92c115850bdc`,
planSHA `bccd49dcc9c1b760584ca1e2b66ed71dc8f4680a369357012969ede42f6e2e68`,
organization `8939229b-7263-4626-9399-76106bf7ff78`, workspace
`eb3f4a32-eca9-4715-a6bf-3396167f0081`, mission
`6e15a891-d7be-4390-ab18-f72685afd5e0`.2 actual arms/calls, both fresh exact
grades ACCEPTED_EXACT_SCOPE. Usage deliberately UNKNOWN, not zero or inferred;
accounting incomplete and NOT_ELIGIBLE_ARCHITECTURE_TRANSFER_ONLY routing.
Audit `40d56bdab55d4b7da1c52a255277247bf775f7e6a65d8d49021d2cbc0a07a8ae`,
report `96fadeb65afb20eadf67cf798dc399b9440106a3f6133b8f95db101309208117`.
This is NOT the fourth-adapter R3 acceptance; its independent addition still waits
complete integrated generic freeze.

Pilot test also traversed actual DOSSIER_RESERVED/STARTED/EXPORTED and
FEEDBACK_RESERVED/STARTED/RETAINED through same tenant-authenticated ledger.
Synthetic1.25minute self-report explicitly SELF_REPORT/excludedempirical,
participant=requester/nonindependent, NOT a real external user. Exact duplicate
grade command refused before a second checker/pool reservation; foreignworkspace
read refused. Arm permanent spent remained unchanged by grader/export/feedback;
separate pool action count became3 for that campaign. Metadata notifications
never dispatched as research effects: fixture uses exact scientific outboxIDs,
their actual returned jobIDs, then shared worker exact IDs/no extra outbox sweep.

Owned audit readback only these two retained observations, both URLs guarded;
no rows truncated/updated, no external publication. QA inspection/readback costs
are engineering inspection outside scientific arm budgets, not asserted zero
experiment usage or folded into the868SIMULATED provider tokens.

After this success Main approved observational label precision delta/one
regression and failclosed known identity-mismatch routing/three negative controls.
UNKNOWN attestation is an explicit comparison limitation, never KNOWN_EQUAL.
Known actual model/version differences or known requested-version violation give
NOT_COMPARABLE_ATTESTED_IDENTITY; no comparative pilot promotion. Final owned
52/52unitPASS, tests573ms/Vitest832ms/external1.087s, exit0.
Generic source no longer identical to first
review epoch, requiring Main repin/fresh integration before final freeze.

## Requirement state at this checkpoint

R10 executable plan/paired scorer has actual24+2arm path evidence, but final
source-epoch rerun/review pending. R11 telemetry/historical provenance has actual
unit+DB evidence, final review pending. R12a bounded blinded export + identity/
consent/import has actual unit+DB evidence. R12b real two independent users NOT_RUN, no
inferred willingness/value from synthetic feedback. R3 fourth adapter NOT_STARTED
until Main freezes complete A/B/C/D integrated generic manifest; no early claimed
transfer and no special-case scientific kernel edit.

Pending: Main refreshed source review/bundle; fresh root
integration/review at finalepoch, complete generic freeze, THEN independent fourth
exact rational interval/floor implementation through same paired/runtime path.

## Final generic owned-source checkpoint before Main refreshed-epoch QA

No further runtime edits under HOLD. These are actual SHA256, not a substitute
for independent review or mathematical closure:

| Owned source | SHA256 |
| --- | --- |
| contracts.ts | 15c4bcc36270e055802f2563ec6a90939af6dc802e761801e7e96d93e567aa31 |
| plan.ts | a9a07e9bf99410eba701a38f5696e42dce7833ef969fd530f560e62e1a2e42be |
| fixed-pilot.ts | 0361a4b6a59330b1635e1c1072353a7259b634f7541d95dfd7639c90ef5058ac |
| event-projection.ts | f78923b3014e33571211b928ac23baa21a007432cd48afef4b5d49708235d0c7 |
| evaluator.ts | cbbe32f3d66b131e0fe6eba95ec4df1fc3c15ca9a41606c04a8c349e0902ea0a |
| report.ts | e413add5c416db43e58fc7c53ae5e31397f725abe82ee98e7d7c31f722662804 |
| dossier.ts | 08424389cfbc100f4ea30a640c033999e8b45a1fe9d76c72be419e08317d0596 |
| feedback.ts | c6f87e3d6902a97e9f35cd161caeb8adb89d58d2c7422cdc999ba0c2677c97de |
| kernel.ts | bc5a7cd5acdccbf47adfaf7b7fb85859e5a66f0b2a820a294cb5c583c6a92429 |
| index.ts | f5a27efe4ff0a70db3943dad75305e3c82f2859f4b8c2095fedd466b47d106b5 |
| fixed-campaign-catalog.ts (reviewed domain exception) | 4e54e3fb3aa2df2a395aa022facc8575f6f4234b803e701c77c7fa0a9bdc7893 |

Current unit test SHA298376e57099f27b2e6bb7fe8be68ec8f598ea72812a2dd140ef1192f4b800c3;
initial actual paired fixture SHA7b4398b80482e44a5be6ca83af28abcc3e650b6af5c6e467cece6b224524a621.
Baseline compatibility fixture SHA4a1edace225de5086c6edeedd9a573548c8257f97b3666c68a252060675ffd3b
does not replace the initial baseline fixture SHA recorded above.

Main approved test-only extraction BEFORE R3 freeze: the unchanged domain-neutral
actual runStudy helper moved into NEW
`tests/fixtures/research-paired-study-v3.ts` SHA
`5122a34ed7cc3c139dfa4d21b4cc36e30429d302555335cf203ec3ff2c733bac`.
Existing two cases import it; actual effects/assertions unchanged, current fixture
SHA`ebe792a353e8d9c73ecbc80ba20fe217e1ddba2abd70678fd5a8139f13905965`.
This exact helper will enter the frozen QA manifest and fourth-domain integration
will import it rather than duplicate the evaluation path. Whole tsc after this
test-only extraction PASS, external4.851s/exit0. Main refreshed52source epoch
installed; B22pass owns its separate evidence. Root fresh paired/legacy independent
reruns and D actual generic UI driver checks remain pending at this checkpoint.

## Subsequent independent checks and narrowly authorized cleanup

Main reports refreshed52 and campaign-only-facade53 epochs each passed the
independent focused B/C/legacy25integrationcases (two separately selected epoch
controls skipped),24.39s/24.53s. These are Main executions, not additional owned
named cases or evidence of improved AI capability. Main current53 pairedreadback
again observed24arms/28controlledcalls/868SIMULATEDtokens/18accepted6rejected,
9/12eacharm; no uplift claim. Main whole208unitcases passed, scopedlint zeroerrors
but owned kernel unused-local warning remained. Generic freeze was NOT created:
D packaging/import and then compiled-browser NODE_ENV guard findings required
reviewed generic runtime fixes. These are real deployment-path failures retained
in Main/D reports, not silently replaced by successful source-level tests.

While the required guard/source epoch was already being replaced, Main explicitly
approved ONLY cleanup of the unused local at kernel.ts24 plus its solely-needed
import. Exactly two lines deleted: unused `const json` and `Prisma` import. No
API, scoring, gate, timing, resource or scientific behavior changed. New kernel
SHA`3ba3fc294c97b0e32cd43d235f8627ebbe69ca31f0329b42796dc3209be4c922`.
Owned external120/DEVNULL sequential QA:52/52unitPASS tests590ms/Vitest860ms,
wrapper1.150s; whole tscPASS8.018s; exactkernelESLintPASS0.826s with zeroerrors/
warnings. No DB/browser/Git operations. All generic files HOLD again.

Read FULL new TIP-076C_R3_INDEPENDENT_INTERVAL_TRANSFER.md, instructions/protocol,
latest active/handoff and Vibecode skill/reports/QA references. Bounded AST,
canonical rationals, independently derived expression/enclosure/floor and
negative/straddle control design sent Main; no domain code yet. R3 remains
NOT_STARTED until exact complete generic + QAhelper manifest is frozen after
actual compiled UI driver acceptance. No unrelated cleanup or scope change.
