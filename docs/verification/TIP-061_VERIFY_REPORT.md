# TIP-061 — Main verification of retained campaign agent evidence

Date: 2026-10-04, Asia/Ho_Chi_Minh. Status: READY_WITH_SCOPE_LIMITS_A_B.
Implemented and accepted requirements: 10/10 (100%). Missing: 0. Deferred
within approved A/B: 0. Live-agent activation C is outside this approval.

## Decision and scope

The user explicitly approved “duyệt TIP-061”. This implements the approved
Blueprint phases A/B: one `ALLIKVERE_P83_14_V1` retained-reference capability,
prospective OPEN contract v2, host-only campaign evidence, three-role fact
binding, exact ledger v5, and deterministic/offline acceptance. Phase C requires
a separate operator decision. No UI redesign, migration, installation, new
prime campaign, paid API, billing, deployment, commit or push is included.

Vibecode Kit governs Contractor specification/QA, two Builders, and a separate
skeptical reviewer. Main did not write product code. Current AGENTS/handoff and
the installed Next16 guides informed implementation and build verification.
The sealed TIP and proposal text are immutable. The proposal's original
PENDING label is a chronological snapshot; explicit approval is recorded in
the sealed TIP and this report, not by rewriting the old proposal.

## Requirement coverage and acceptance

| ID | Implemented boundary and evidence | Acceptance |
|---|---|---|
| R1 | Additive v2/v5 variants; historical v1 contracts, absent attempt fields, ledger1–4 branches and old finite caps preserved. Historical and canonical-absence tests; 145 old file fingerprints unchanged. | PASS |
| R2 | One fixed OPEN preset; whole fixed contract, exact scope, root, evidence and attempt bindings. Public input selects a preset, not files/code/evidence. Complete recorded056–059 plus separate060 supplement. | PASS |
| R3 | Same canonical facts BLOCK bytes captured for solver, critic and adversary; fresh distinct context IDs and requested-model provenance. Real adapter methods tested with mocked transports, not live models. | PASS |
| R4 | Literal RETAINED_REFERENCE_NOT_FRESH and freshFullCampaign=false. Timestamp, PASS labels, hashes and structural supplement cannot mint a fresh campaign. | PASS |
| R5 | Fixed42-file identity manifest and exact recorded facts reject omissions, additions, ordering changes and coherent rehashes. Changed prime, threshold, multiplicity, gcd, LCM, ancestor and terminal partitions refused. | PASS |
| R6 | Provider/public injection, mixed-domain attempts, v5 downgrade, case/attempt substitution and reused contexts refused. Independent snapshots plus deep-frozen defensive views cover mutation on return/throw. | PASS |
| R7 | Initial refusal precedes dispatch fence; explicit local capability defaults OFF. Fixed-path streaming importer enforces original10s deadline, exact byte budget and symlink/race checks. Stub cold paths have zero dispatch/retention. | PASS |
| R8 | Pure compact read validation; no campaign importer/replay/model/job in passive reads. Worker alreadyComplete/pre-dispatch and per-role/retention guards inspected. Erdős controlled-cycle explicitly excludes campaign. DB transactions not executed. | PASS |
| R9 | Three supportive stubs yield ledger5 PARTIAL, never a supported global theorem. Global LRC14/15, other60 primes, lower reproduction, all23 gates, novelty and formal/external acceptance remain OPEN. | PASS |
| R10 | Actual import, mocked/stub tests, historical verifier regressions, types/lint/build, frozen identities and NOT_RUN categories separated. Final serialized58-file regression856/856 PASS. | PASS |

Implemented and accepted 10/10; missing implementation 0. Acceptance is not a claim that
every project feature or global mathematical obligation has been completed.

## Main executions

| Execution | Result |
|---|---|
| Preliminary Core2 suites | 54/54 PASS, 494ms, start08:06:40 local |
| Initial broad historical run, 58 files | 854/856 PASS, 263.16s, start08:11:05; two old frontier timeouts, documented below |
| Isolated unchanged frontier replay file | 8/8 PASS, 116.40s, start08:16:44; original5s/60s/other caps unchanged |
| Final changed Core/Integration plus adjacent regressions, 8 files | 109/109 PASS, 687ms, start08:18:42; 86 new +23 historical |
| Final broad58 with maxWorkers1 | 856/856 PASS, 58/58 files, 677.56s, start08:19:59 local; no deadline, test or product gate weakened |
| Whole repository npm run typecheck | Exit0, 0 TypeScript errors after final tracing repair |
| Whole repository npm run lint | Exit0, 0 lint errors/warnings after final tracing repair |
| Final npm run build | Exit0; compile6.0s, TypeScript23.3s, static3/3/routes/env-scrub/assets PASS, zero NFT warnings |
| Tracked whitespace | git diff --check PASS |
| Sealed manifest | 104/104 PASS; original102 plus new Blueprint/TIP |
| Old-file baseline | 145/145 unchanged; no old source/artifact/report/test resealed |
| Frozen Builder file table audit | 21/21 fingerprints match final Core/Integration Completion tables |

The broad unit run includes existing mathematical verifier/Python regressions.
It is NOT a new full056–060 campaign admission, fresh semantic receipt, model
run or DB/browser E2E. There is no claim that no Python ran anywhere in Main QA.
The NEW campaign importer and stub orchestration themselves never run Python
or reconstruct the forests.

### Initial failures and corrective verification

Two OLD `math-lrc-frontier-replay.test.ts` cases exceeded unchanged timeouts in
the broad concurrent run: first test5560ms versus5s; mutation block7..13
66370ms versus60s. The isolated file passed8/8 with no source/test/deadline
change. This supports contention/timing sensitivity, not a newly discovered
mathematical defect; Main does not claim a measured CPU-level root cause.
The final broad run reduced concurrency to one worker, not validation limits,
and passed ALL856 tests. Both original failures are retained in this audit
trail, not erased or relabelled as first-run successes. No consequential issue
remains within A/B; time sensitivity of old concurrent tests is documented.

Initial optimized build exited0 but emitted two consequential NFT warnings:
the new local importer dynamically traced the whole repository. This was NOT
accepted as a clean build. Core read the installed Next guides and its own
runtime annotation usage, then narrowly annotated runtime-local fs/path
arguments with `turbopackIgnore`. No Next configuration exclusion, permission,
path/symlink/race/hash/byte/deadline check changed. Reviewer independently
read the delta, reran109 tests/68 diagnostics and actual import, then froze
updated pins. Main final build has zero such warnings. Research page NFT has
358 entries and no next.config.ts, archived research/contractor files or .env
candidates; standalone has no archived lrc-allikvere-v2 or .env candidates.
This local-only importer still requires the complete fixed repository at
runtime and refuses production before IO; those inputs are not deploy assets.

## Actual reference import, not a new proof replay

Main final explicit no-write command:
`NODE_ENV=development node --import tsx scripts/operations/allikvere-campaign-reference-audit.ts`.

PASS58ms, ALL42 fixed files /53,211,840 bytes. Streaming64KiB; no full forest
loaded/reconstructed or new stage semantic verifier executed by this importer.
Mode RETAINED_REFERENCE_NOT_FRESH, freshFullCampaign=false,
semanticReplayExecuted=false, retained=false. Original10s deadline includes
hashing/validation/final comparison; JS/filesystem checks are cooperative,
not a hard RSS or preemption guarantee.

| Binding | SHA256 |
|---|---|
| Root contract | 94b678f4bb862c4c46db5f2a754df86fd3a1486fa05c8bc31509aa177c105b1e |
| Scope | e2a81c5f19a3beeb15256b95e8a07aad09b5154c198579c8b1b06446965b6b6d |
| Fixed facts | 14106206f69927501931dd9484cee45c64b8a9679d17430c6b8131f33211be87 |
| Final no-write envelope | ec8266d009cf8e3b96c727cefad9a96a1caecede0b5c42e77e1633ce64ab35b3 |
| Final no-write facts block | 285da77aed284200f69e5b0007d5021dd4a34f5929645ba7c36783cfa21666fe |
| Final no-write audit bytes | 81f5abc7d4350254bbdcc95186e9688cabff5a36d357d0ccb490f6da08340847 |
| Create-only retained audit10370B | 6e9942f68be04604bfdfc520f5fc6426b91ae236f1f9dbfeadc28b3810cf3456 |
| Retained envelope | e5e6ab2a9eb7d4b8afd0faa732b0d191fe7da0adc8886582a3a8e8856ba9032a |
| Retained facts block | 041c92917e76ceaf6fa44a454696c4c44c7a3db0b2681e86ee5c277316a0f4f4 |

Imported-at timestamps legitimately change envelope/facts-block/audit hashes
between separate imports. Fixed root/scope/facts and dependency pins do not
change. A new timestamp is not new semantic execution. Positive role comparisons
use the exact SAME imported envelope, not three independently timed imports.

The pure factory can compose a correctly hashed fixed-body envelope without
IO. Thus internal hash consistency is not host invocation authentication.
Normal worker authority is explicit capability + fixed importer selection +
provider-origin refusal + binding guards; arbitrary saved audit JSON is not
a dispatch receipt. IO-free passive validation cannot discover underlying
filesystem drift after import; a later explicit import can.

## Scientific boundary

The recorded known-source finite p83 result remains
`I(13,83,224)=empty` and `J(13,83)=empty`, conditional on the reviewed bridge
and source premises. Complete recorded056–059 lineage and conditional060
are delivered together, but060's Cq subset never replaces059's terminal proof.
055 summary is a prerequisite reference, not recursive053/054/full-paper
closure. Lower cases remain source-reviewed, not independently reproduced.
The059 certificate gcd regions5/6 include grid overlaps4/5; they are not the
060 parity-conditional79-per-root structural subset counts.

Main is accepting a host/agent trust boundary, not discovering a new LRC
theorem. Other60 P13 primes, unrestricted14/15, all23 application gates,
independent lower cases, novelty and formal/external acceptance remain OPEN.
Independent agents here use the same model family: distinct contexts are not
independent institutions, model identities, formal proof or mathematical truth.
Frozen views prevent supplied-data mutation; snapshots do not attest arbitrary
trusted-adapter closure effects or whether an actual model follows its prompt.

## Independent and Builder evidence

Core final54/54 PASS427ms, actual import64ms, types/scoped lint0. Integration
final32/32 new tests and selected52/52 combined PASS1.20s. Independent reviewer
final109/109 PASS683ms, actual import69ms, and68 coherent adversarial checks
PASS130ms. Its positive harness measures fence1, solver1, critic1, adversary1,
retention1; identical10,396-byte facts BLOCK for all three roles, ledger5 PARTIAL.
Actual adapter methods use EventEmitter transport mocks; worker transaction
guards are source-reviewed, not DB-executed. Main metrics above are independent
executions, not relabelled Builder/reviewer timings.

| Frozen document | SHA256 |
|---|---|
| Approved Blueprint | 4fc1ae0955c0bddcf0b5f665fe1da5e9a21a814e507dfe3bee2ed59332e9057d |
| Sealed TIP | 94e5bf0ddd576483ffac62f54d07ebdbea34c22726efcc04b199470c32d5efd6 |
| Core Completion | 490e9ee43dd8d842fb488c162c9998a0181646dfdbe74ae9feb82a5e2fdb8aa4 |
| Integration Completion | 335767e3039d309c57bd8092ef7cfa00e13f59873e8b3ef795048432b1de9044 |
| Independent Review | 5492d76d9b46132a23a06b159f8d19c5835976ffe12445c04407519885a7dbd3 |
| Manifest104 | edd529e9a59458bd196459d7f63844955df7ae4a1bea1e347abc434b256a43a7 |

Core Completion transparently supersedes its initial importer/reference-test
pins after the tracing repair. Pure module and create-only retained audit pins
stay exact; no historical acceptance record is overwritten.

## Local operation, exclusions and next decision

Old dev session33044 stopped normally for build. Restored session38728/PID27279
Ready242ms on127.0.0.1:3001, demoON, queueOFF, workerOFF, campaignOFF. Actual
health/live returned200 with statusok at2026-10-04T01:20:22.284Z. Leave available.
Existing UI remains:
http://127.0.0.1:3001/w/mathematics-pilot-lab-156de0/research/math-tools?view=allikvere-proof#allikvere-p83-terminal

HTTP liveness is NOT authenticated browser E2E. No Cua retry after repeated
historical transport hangs. New UI/browser observation NOT_RUN. Live solver,
critic/adversary, real CLI/model/API, new case/job/review DB persistence,
tenant transaction runtime, worker activation, whole fresh campaign admission,
author code, formal/external certification and whole-project acceptance NOT_RUN.
No Git commit/push; HEAD4d108227498d3578c9ac3fe60305c10da5aa905b on
codex/tip-023a-organization-graph. Unrelated dirty work is preserved.

Next decision: authorize a prospective local phase-C case and bounded single
solver/critic/adversary run, with exact tenant/case/model/output/time/accounting
limits. Keep API spending absent and global conclusions OPEN. This approval
does not activate that phase or authorize an unrestricted autonomous loop.
Final broad regression and frozen identities pass. Main appends the handoff
without altering its original277753-byte prefix SHA256
8f5b77f3b00fe6a14c2bd877d0ed175b4baf34af61fff7da9f29d1649f11c142.
