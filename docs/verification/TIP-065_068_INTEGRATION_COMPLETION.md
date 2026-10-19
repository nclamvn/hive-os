# TIP-065–068 Integration completion — G1 offline lane

Date: 2026-10-04. Status: PRODUCT_SOURCE_FROZEN; Main final serial offline acceptance PASS, final post-freeze build pending.
Builder: Integration, Vibecode Kit v6.2. G2/live authority NOT granted.

## Authority and outcome

Sealed TIP SHA `9cbc6282169101a5e5cb303834c9cdeeaaf916dfdc6fb46fabd5dd413cbedfa7`; seal acceptance SHA `b3f149b3b42cb487e379ef90e1518c3be8afc60e78ad7d457801728147fc56e2`. Integration pre-seal JSON/notes remain `d4b9d71b219ee424392a4921d7f7b93cc58f5cdda3ad6076785b0de75a06fe3b` / `3ebcb2c9e41f252addf33788069bfde75e357aedb53ead1bbdde0a4e843c0cc9`.

Implemented private diagnostics, pinned pure replay, authenticated opaque grants, mandatory capture orchestration and prospective bounded observation protocol, integrated into existing solver/automatic review jobs. New family LRC_METHOD_UNIT / FEW_EXCEPTION_SHIFT_14_V1 uses contract4/ledger7; it is not an old lane relabel or third executor. The G1 production G2 grant has no mint: ordinary flags, caller actor IDs, generic POSTs and default adapters cannot dispatch this family. An authenticated dedicated request action resolves existing session context then refuses absent future G2 authority. Tests alone use explicit fixture authority under test/Vitest guards.

## Implemented boundaries and APIs

- `authorizeMathDiagnosticAction` uses actual original authenticated actor, current tenant membership, existing research.read/research.request/jobs.manage and local diagnostic permission. Captured grant IDs authenticate nothing. Refresh crosschecks underlying command/outbox/job/run/case/requester, exact payload, version, lease and role lineage. Parsed binding is frozen and Headers cloned before refresh closure. Test contexts cannot mint production grants.
- `MathDiagnosticCaptureStore`: fixed production root `/Users/os/Library/Application Support/HIVE OS/ResearchDiagnostics`, never accessed during this work. Explicit canonical temporary fixture roots only in tests; no production fallback. Ancestor device/inode identity is pinned and rechecked before/after sensitive operations; regular single-link/no-follow files, private0700 dirs and create-only0600 files. Complete-byte write loops, fsync file and directory; capped read loops check size/stat/deadline.
- Atomic O_EXCL lock reserves worst-case1,146,880B per actual dispatch before model work, at most100 slots/128MiB. Prepared49152B, stdout1048576B, finite32768B and combined reservation+manifest16384B are charged. Source pins bounded42 entries/4096B. Same actual dispatch UUID cannot reserve twice. Partial/orphan slots remain fully charged; no automated stale-lock reclamation.
- Maintenance intent/final receipts are private immutable bounded controls, included in quota: at most100 operations/200 files, each<=16384B. Authorized purge max10 compatible capture IDs/16MiB/5s cooperative; target authorization is not weakened to fill a batch. Deadline checks occur through scan/read/unlink. A partial purge records actual removal and leaves surviving orphan charge. Receipt completion may finish after budget, with no further deletion.
- Exact prepared stdin/schema are retained before dispatch. Existing runCodex observer durably retains bounded raw bytes before parser admission; raw rejection is never public. MR16 carries actual observed stdout total separately from stored prefix:2MiB+1234-byte injected chunks record2098386 observed while storing1048576. Stderr/auth messages are not retained or surfaced.
- `parseMathTransportAdmission` rejects invalid UTF8/JSONL, unknown lifecycle, observed tool activity, ambiguous context/usage, missing final output, host-field echoes, oversized or invalid mathematical outputs. Precise bounded reason/stage/schema/version/source pins are retained. Uniquely recoverable rejected context/usage is TRANSPORT_OBSERVED_UNACCEPTED; unavailable data is null UNAVAILABLE, not fabricated zeros or admitted accounting.
- Installed parser registry is host allowlisted and private identity checked; fixture callbacks are test-only. Original replay binds captured role, version/source, independent manifest/source anchors and complete unexpired capture. Same-version different-role or coherently forged parser object refuses before callback. Candidate parsing is separate counterfactual. Replay is pure, bounded, NO_RESEARCH_RETENTION: no provider/checker/DB/history reads or promotion. Twenty-four hours limits replay, NOT deletion; overdue raw stays charged until authorized maintenance.
- `runMethodUnitOrderedReview` uses SOLVER -> ADVERSARY -> HOST_FINITE_CHECK -> CRITIC. Critic capture slot reserves full finite bytes before producer/consumer. Actual finite record is retained even if critic never dispatches. Missing seed produces honest MISSING/null execution; well-formed semantic UNSUPPORTED/CERTIFICATE_REFUSED may be inspected conservatively. Operational/integrity/capture/binding failure stops next role; RESOURCE_REFUSED retains truth and hardstops models.
- Actual Core producer/independent consumer share5s/2Moperations/256bit/32KiB limits, invoked only explicitly in new host stage. Model owns small mathematical seed, never receipt/certificate/provenance. Critic receives compact<=1024B summary/digest, not adversary prose/full duplicate certificate. Full evidence binds actual review job, retained solver seed/attempt, adversary digest and external frozen source pins.
- Worker and review kernel require opaque same-process runtime authority/capture; there is no generic default-provider fallback. Malformed/null/string-version scope, method markers in historical lanes and cycles refuse. Fresh solver/review job payload, lease/version, case/run/contract/current solver attempt and original succeeded solver job are fenced before every role, after role return, and before finite check. Review retention requires actual external review job.
- `observeLrcMethodUnitOnce` reuses old30min budget/complete-byte receipt primitives, exact single outbox/job selectors, immediate known-ID capture, owned cancellation and no retry/backfill. Solver and automatic review remain two existing jobs. Success needs strict host-inspected ledger7, actual three contexts, two succeeded attempt1 jobs and PARTIAL/INCONCLUSIVE root. Wrong claim cannot obtain cleanup authority. Caps remain240s child/1MiB stdout+stderr/49152B prepared/1800s lease; stage reserve covers original three login+exec pairs (1510s), never widens caps.
- `verifyInstalledMethodUnitSources` checks actual bytes of37 fixed reviewed dependency pins. This is NOT a complete recursive import closure or runtime-code attestation. Registry itself is excluded to avoid self-hashing; nested auth/workspace imports exist beyond this set. Future G2 must use a fresh process/restart after reviewed freeze, not stale dev/HMR modules. Same-OS-user mutation remains outside this local unsigned trust ceiling.

## Consequential review repairs and supersession

MR17: current job/solver-attempt fence before every dispatch, after return and before host checker; between-role retained attempt/job drift regression verifies no checker/critic.
MR18: receiver-preserving wrapper for actual reviewer method; receiver-sensitive class fixture verifies both callbacks and valid ledger7.
MR19: exact solver/review claim validation inside callback before assigning owned cleanup target; wrong claims never call failOwned or role, valid later receipt/deadline failures preserve known cleanup.
MR20: immutable parsed binding and cloned Headers in auth refresh; caller mutation cannot redirect expired original job authorization.

Registry final SHA `1f664c01e327b70c2e64b55b5e45af5604a52b4104dceb2337f37912cf539bfa` supersedes stale pre-repair checkpoint `d0af974d927d0fa459226f32b04d5f158244b77852373114ab15f86024da1c72`. No historical report/failed064 case is overwritten.

## Acceptance coverage and honest deferrals

D1–D5: offline capture/privacy/auth/quota/mutation/replay controls implemented and tested; no actual rejected private provider history inspected.
M1–M4: strict preparation, actual finite host stage, role independence/ledger binding and conservative method audit integrated in injected existing jobs; mathematical truth/global proof not claimed.
R5 PARTIAL: method card stopPivot text and fixed-unit operational hardstop exist. Automatic root-linked gap→task creation, two-nondiscriminating-batch stop/pivot and discovery execution are not implemented.
R8 PARTIAL: pure authorized replay/metadata APIs and fixtures exist; standalone production authenticated replay CLI/reader ingress is deferred. Passive UI therefore does not read private raw or invent metadata.
R9/R10 full-delivery PARTIAL per Main: UI-owned passive cockpit and offline control harness do not constitute browser-validated end-to-end live observability or a real empirical mathematical-effectiveness benchmark. Integration does not claim UI/browser/benchmark completion beyond its owned seams.
R12 G1 ONLY: prospective injected observation protocol and safe static refusal preflight exist. Production observation runtime, cross-process authenticated grant mint/activation, ready live run/replay invocation, empirical quality benchmark and browser validation are deferred. No `lrc-method-unit-observation-runtime.ts` or standalone replay CLI was created. Ordinary session/flags are intentionally insufficient.
No provider/model/login, DB, production private-root, forest/author collector/checker, browser, paid API, Git/install or environment activity by this Builder. Existing historical packet/case/contracts/ledgers1–6, source archives, manifests and old062 invocation are excluded; no retrospective backfill.

Safe static invocation: `node --import tsx scripts/operations/lrc-method-unit-observation.ts --preflight`. It reports G2_AUTHORITY_NOT_AUTHORIZED / AUTHENTICATED_SAME_PROCESS_INGRESS_REQUIRED with zero model/DB/private-root access. There is no authorized ready live command in G1.

## Verification

Final own unique selector checkpoint, started19:29:45:
`npx vitest run tests/unit/math-transport-diagnostics.test.ts tests/unit/math-diagnostic-capture.test.ts tests/unit/math-diagnostic-codex-transport.test.ts tests/unit/math-diagnostic-session-auth.test.ts tests/unit/math-method-unit-worker.test.ts tests/unit/lrc-method-unit-observation.test.ts tests/unit/math-lrc-proof-unit-worker.test.ts tests/unit/codex-local-proof-unit.test.ts tests/unit/math-lrc-proof-unit-cycle-refusal.test.ts tests/unit/lrc-controlled-observation-abort.test.ts tests/unit/math-lrc-proof-unit-request.test.ts tests/unit/math-lrc-method-unit.test.ts tests/unit/math-lrc-research-program.test.ts tests/unit/math-lrc-method-unit-live.test.ts --maxWorkers=1 --reporter=verbose`

Observed14 files/326 controls:325 passed,1 failed,68.04s. Sole failure: math-diagnostic-capture full-root orphan/concurrent reservation fixture hit its20,000ms test-harness timeout (line38) while independent build/types/test work overlapped. No product error text or relaxed cap; cause is not asserted solely from concurrency. Core's three frozen selectors passed138/138 within this run. This report does not falsely claim this checkpoint fully passed. Earlier focused MR17–19 worker/observation23/23 and MR20 session-auth19/19 passed. Do not add repeated checkpoints as unique controls.
Distinct final acceptance by Main: serial29 suites614/614 PASS, started19:31:51,33.71s, unchanged caps. Main whole types/lint exit0, actual source loader verified all37 reviewed files. Final post-registry-freeze build is owned by Main and was pending at report freeze. These Main results supersede the unresolved acceptance status, not the recorded failed independent checkpoint.
Whole `npx tsc --noEmit` exit0 after safe test cast fix. Scoped eslint of26 owned source/test/fixture files exit0, zero warnings. Main owns whole lint/build and final combined selector; no Builder build.

Storage/DB/JS deadlines are cooperative, not hard OS preemption. Node nofollow/identity checks do not prove protection from malicious same-OS-user races. stdout is bounded-memory until child close then durable before parsing; crash before close leaves charged incomplete orphan, not guaranteed raw completion. Partial fsync/power loss can leave incomplete JSONL/control files; no fake complete receipt or automatic retry/research promotion. Tool-event rejection cannot undo an already executed tool. Requested CLI model/context/usage is transport observation, not provider-internal attestation or independent institutions.

## Final owned source/test SHA-256 inventory

```text
6654a2abadbc5892828aef7321eb8fee6e70f079cc10cac1e6448c44bd6ce4e9  src/modules/research-sandbox/math-transport-diagnostics.ts
b2c508bc567e8bc49184bcfb8a0519f4e31dc38a52060614b56fab566148ab3d  src/modules/research-sandbox/math-transport-admission.ts
1f664c01e327b70c2e64b55b5e45af5604a52b4104dceb2337f37912cf539bfa  src/modules/research-sandbox/math-method-unit-source-registry.ts
6c588f70e83a1a320dc26bc66ea33c6e4e4915ac2370fee5b39a357ebf704538  src/server/operations/math-diagnostic-auth.ts
b55e1c2ad9ea95e4e96602760c1a4c34af20cd9877b3c48399a8620a9be8486a  src/server/operations/math-diagnostic-capture.ts
7e3ccceb1154c4f3e73aa89fbbb322893ef058c1faeb57bb45dddf6547c53d9c  src/server/operations/math-diagnostic-replay.ts
08c5f65ef36dcc03f86bda0b9f5aa6bc980f5c0660423b6da2bfb61f80b46d91  src/server/operations/math-method-unit-authority.ts
f422819fc756cb629876976734a510b48bf6a2f21aedb6514d81589267c71935  src/server/operations/math-method-unit-transport.ts
6bf1abaa91381246c6458e1e7a046dd32184eda329aabcb4c1b029dfab61ec49  src/server/operations/math-method-unit-review-orchestration.ts
2c243c8a49302e2709b5f1c778b95fc8ce0f45326314ed0cd7d0c7ed5a5c2256  src/server/operations/math-method-unit-source-loader.ts
65d6007ec374bd7d07d9c4b27419bec5caeace508e9254302220f2d6c92d7617  src/server/operations/lrc-method-unit-observation.ts
2895455da985da9d7f96005363660fdf07d0cf43e86cd70ec13aaf0f6e83c1c7  scripts/operations/lrc-method-unit-observation.ts
d6a8b8f2022d53e473064914f8f3af8bb9669f9ec3964a4647f7f246e8c83bbb  src/modules/research-sandbox/worker.ts
03912151a298e746b4465e94ca6c2b1166c248125a5d60dea79483682c073dcf  src/modules/research-sandbox/agent-review-kernel.ts
9259f77c5fc97bbffd07866d2fc61c6425afd80f8e534c46eb02d8aa0c9d7658  src/modules/research-sandbox/kernel.ts
fea72203a175ff651f8c346e24955c3bb2f8ddb526d2540b0c787c291ae23045  src/modules/research-sandbox/math-cycle-kernel.ts
ecf2d7649916d6465758d87b1be31f5947931d89dec45a1a0bf0f5bf23780c86  src/modules/research-sandbox/adapters/codex-local-math.ts
a1351b4cf22f4e2f99e35e6c3628d4e6a8b5b0f9599968936c9345c7078d9f5a  src/modules/research-sandbox/adapters/codex-local-review.ts
4d348e3925baf10df200401bff748aea83af52f1e76cdaf94ca61d361d2d42c4  src/app/actions/research-sandbox.ts
fb64eefc185e25bcd93b7a0f0309a591168f8a39d0d164de15522cf27bd98a1c  tests/unit/math-transport-diagnostics.test.ts
a56e5403450989556ba6ab4dc8c287a15f76f31280b3000ac2c8a6830584cc5a  tests/unit/math-diagnostic-capture.test.ts
3fefe2202a547eee41ad61f7d6b3686abc1f4199ca1ecb91bea9e50e677ca6d7  tests/unit/math-diagnostic-codex-transport.test.ts
985c9140ab0ab242143ddf1a099ce7443fbc034524873b09b4bd0dff04744c26  tests/unit/math-diagnostic-session-auth.test.ts
b1efb1f7da93f981a8ab2e014cab6875ac6df11ee524f5e9b399702723054a1d  tests/unit/math-method-unit-worker.test.ts
0b4339a77326bb9b73c784607b0e30ef4ba885515a27d0a8b6f4f052ac0925dc  tests/unit/lrc-method-unit-observation.test.ts
14f877cc05498b92f6b520a69bdcd7006b5a7496a4e7c1202c028353bf34ccf1  tests/fixtures/lrc-method-unit-live.ts
```

The frozen registry contains the37 reviewed dependency pins; it is the source of external finite producer/checker identity, never model/ledger data. UI/Core owned files were not edited by Integration. Independent Core review is recorded separately.
