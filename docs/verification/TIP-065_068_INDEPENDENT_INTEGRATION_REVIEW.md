# TIP-065–068 independent Integration review by Core Builder

Date: 2026-10-04. Reviewer: `/root/tip062_core`, not author of Integration product files.
Status: **SOURCE REVIEW PASS AFTER FOUR REPAIRS; MAIN SERIAL ACCEPTANCE PASS.**
No remaining consequential finding in this reviewed G1 slice. This is not G2
authorization, a live experiment, a mathematical theorem certificate, or a claim
that the reviewer's contended test run passed completely.

## Scope and authority

Read the sealed TIP, accepted scope, full new diagnostics/admission/auth/capture/
replay/authority/transport/orchestration/source-loader/observation modules, static
CLI, new tests and fixture. Inspected the complete new-family branches of existing
worker, review kernel, request kernel, cycle kernel, actions and both existing
Codex adapters, including the optional raw-byte observer. The review changed no
product/test/scope/history file. Only this new review report is authored here.

Sealed TIP SHA: `9cbc6282169101a5e5cb303834c9cdeeaaf916dfdc6fb46fabd5dd413cbedfa7`.
Seal acceptance SHA: `b3f149b3b42cb487e379ef90e1518c3be8afc60e78ad7d457801728147fc56e2`.
Vibecode Kit v6.2 verification was used to separate source findings, actual test
outputs, Main acceptance, and unexecuted live/private-root work.

## Consequential findings, repaired before final freeze

1. **MR17: stale durable solver input between roles.** The original new
   orchestration fenced once, allowing a current DB attempt/job change after
   ADVERSARY to reach the finite stage or CRITIC before final retention refusal.
   Final orchestration lines22–24/33 fences before every role and after its return,
   and before finite work. Review-kernel lines133–141 reread actual locked worker,
   version, lease, attempt1, exact payload, case/run/contract/current attempt and
   original SUCCEEDED solver-job result. Drift controls stop host checker and
   critic, not merely ledger retention.
2. **MR18: reviewer receiver lost by bare callback.** Passing the reviewer method
   unbound lost the real adapter's `this`. Review-kernel line133 now calls it through
   the original reviewer instance. A receiver-sensitive class fixture covers both
   role callbacks and ledger7; no alternative executor was added.
3. **MR19: wrong claimed job obtained cleanup authority.** Observation originally
   assigned `owned` before checking the claimed identity. Final lines29/34 check
   exact job/outbox/attempt and solver/review separation inside the claim callback
   before assigning it. Wrong claims never call that role or `failOwned`; genuine
   owned jobs remain known if a later receipt/deadline fails.
4. **MR20: mutable auth-refresh closure.** The grant stored a frozen binding but
   refreshed against caller-owned binding/Headers. Auth line30 now parses/freezes
   the binding and clones Headers before closure creation. Caller mutations cannot
   redirect refresh to another otherwise-valid job when the original expires.

All four were sent to Contractor immediately, repaired only by Integration under
approved scope, then reread at the final source hashes below. Their regression
controls are in worker, observation and session-auth suites. No broader redesign
or retrospective repair of historical records occurred.

## Safety and semantic conclusions

- G1 has no production execution-authority mint. WeakMap fixture grants require
  test/Vitest; flags, copied IDs, ordinary POSTs/default adapters and standalone
  CLI cannot substitute for G2. The dedicated action resolves real session then
  refuses; CLI preflight is static, not authenticated readiness or a live command.
- Current diagnostic authority rechecks original actor, active membership,
  tenant, capabilities/local permission and actual command/outbox/job/run/case
  lineage. Refresh and worker ownership are distinct checks. Missing grants fail
  closed; no silent queue fallback.
- Existing jobs implement SOLVER → ADVERSARY → actual HOST_FINITE_CHECK → CRITIC.
  Critic's worst-case capture is reserved before finite work. Actual finite record
  binds retained seed/attempt, adversary report and external review job/source
  pins and is captured even if critic never dispatches. MISSING has null execution;
  RESOURCE_REFUSED stops later models, not a fabricated successful receipt.
- Full prepared stdin/schema are retained before dispatch; raw bounded stdout is
  durable before parser admission. Strict UTF8/JSONL/role/model schemas refuse
  host echoes, tool events and ambiguous lifecycle/context/usage. Recoverable
  rejected usage is TRANSPORT_OBSERVED_UNACCEPTED, not admitted research usage;
  unavailable accounting stays null/UNAVAILABLE, not zero. Independent contexts
  do not mean independent institutions or provider-internal model attestation.
- Private storage uses fixed production root but this review never accesses it.
  Temp-fixture tests exercise identity/no-follow/private-mode/create-only files,
  complete-byte/fsync writes, exclusive reservation lock, 100 slots/128MiB, full
  1,146,880B reservation, bounded reads and charged orphan/partial slots. Replay
  binds independent manifest/source anchors and registered parser identity/role;
  it is pure NO_RESEARCH_RETENTION, not a checker/provider/DB/history promotion.
  Maintenance is exact authorized IDs, bounded deletion with actual receipts;
  expiry is not deletion and stale lock is not automatically reclaimed.
- Prospective observation uses exact outbox/job IDs, attempt1/no retries,
  automatic review only, owned cancellation and retained ledger7 inspection.
  It has no production runtime or cross-process session-grant fallback in G1.
  New-family cycles/generic request paths refuse, rather than route as legacy.
- Mathematical ceilings remain conditional scoped PARTIAL or conservative
  INCONCLUSIVE. Finite masks are not lower continuous witness existence, universal
  phase/formal proof, independent reproduction, global14/15, novelty or external
  acceptance. Diagnostic preservation/replay does not improve those ceilings.

## Actual verification and attribution

Independent final frozen-selector command:

```sh
npx vitest run tests/unit/math-transport-diagnostics.test.ts tests/unit/math-diagnostic-capture.test.ts tests/unit/math-diagnostic-session-auth.test.ts tests/unit/math-diagnostic-codex-transport.test.ts tests/unit/math-method-unit-worker.test.ts tests/unit/lrc-method-unit-observation.test.ts tests/unit/math-lrc-method-unit.test.ts tests/unit/math-lrc-research-program.test.ts tests/unit/math-lrc-method-unit-live.test.ts --maxWorkers=1
```

Observed **9 suites, 244 passed / 1 failed / 245 total**, exit1, start19:29:54,
duration56.75s. Sole failure: capture-suite line38 full-root orphan/concurrent
reservation fixture timed out at20,000ms. No assertion mismatch was reported.
The run overlapped build/type/peer workload, but concurrency alone is not treated
as proof of the cause. No production/checker/model cap or test timeout was edited.
No further reviewer test runs were launched after Main requested serial isolation.

**Main's separate final serial acceptance:** 29 suites, **614/614 PASS**, exit0,
start19:31:51, duration33.71s, unchanged caps, communicated by Contractor. This is
Main's run, not the reviewer's rerun and not additional unique controls to sum.
Main also owns final whole build/types/lint; they are not independently rerun here.

Independent identity-only read/hash check: all **37** installed fixed registry
entries match actual current file bytes, zero mismatches. Ordered
`[relativePath, sha256]` JSON map digest:
`ac203f48a19fc2edcd72e0e752e5bb4a9977c6504924e6771a80c89f35e3b5b3`.
Registry file SHA below supersedes pre-repair `d0af974d927d0fa459226f32b04d5f158244b77852373114ab15f86024da1c72`.

These are **reviewed fixed dependency pins**, NOT a recursively complete import
closure or loaded-code/runtime attestation. Nested auth/workspace imports exist
outside the registry. Fresh process/restart after freeze is required before any
future separately approved G2; disk hashes alone do not validate cached dev/HMR
modules, binaries, host or a malicious same-OS-user administrator.

## Final independently observed owned-file pins

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
4d348e3925baf10df200401bff748aea83af52f1e76cdaf94ca61d361d2d42c4  src/app/actions/research-sandbox.ts
d6a8b8f2022d53e473064914f8f3af8bb9669f9ec3964a4647f7f246e8c83bbb  src/modules/research-sandbox/worker.ts
03912151a298e746b4465e94ca6c2b1166c248125a5d60dea79483682c073dcf  src/modules/research-sandbox/agent-review-kernel.ts
9259f77c5fc97bbffd07866d2fc61c6425afd80f8e534c46eb02d8aa0c9d7658  src/modules/research-sandbox/kernel.ts
fea72203a175ff651f8c346e24955c3bb2f8ddb526d2540b0c787c291ae23045  src/modules/research-sandbox/math-cycle-kernel.ts
ecf2d7649916d6465758d87b1be31f5947931d89dec45a1a0bf0f5bf23780c86  src/modules/research-sandbox/adapters/codex-local-math.ts
a1351b4cf22f4e2f99e35e6c3628d4e6a8b5b0f9599968936c9345c7078d9f5a  src/modules/research-sandbox/adapters/codex-local-review.ts
fb64eefc185e25bcd93b7a0f0309a591168f8a39d0d164de15522cf27bd98a1c  tests/unit/math-transport-diagnostics.test.ts
a56e5403450989556ba6ab4dc8c287a15f76f31280b3000ac2c8a6830584cc5a  tests/unit/math-diagnostic-capture.test.ts
985c9140ab0ab242143ddf1a099ce7443fbc034524873b09b4bd0dff04744c26  tests/unit/math-diagnostic-session-auth.test.ts
3fefe2202a547eee41ad61f7d6b3686abc1f4199ca1ecb91bea9e50e677ca6d7  tests/unit/math-diagnostic-codex-transport.test.ts
b1efb1f7da93f981a8ab2e014cab6875ac6df11ee524f5e9b399702723054a1d  tests/unit/math-method-unit-worker.test.ts
0b4339a77326bb9b73c784607b0e30ef4ba885515a27d0a8b6f4f052ac0925dc  tests/unit/lrc-method-unit-observation.test.ts
14f877cc05498b92f6b520a69bdcd7006b5a7496a4e7c1202c028353bf34ccf1  tests/fixtures/lrc-method-unit-live.ts
```

The final three Core selectors are pinned in `TIP-066_067_CORE_COMPLETION.md`,
SHA `5587fc8056dfb6bebab6ea2e1a581b229c23a453bc51fa02bb8566d69ba72f18`;
they were dependencies of this review, not authored as independent Integration
controls. Integration completion was read fully at checkpoint SHA
`8ee3a95e69b75949b8944a6fb221d8d065545c4fb9678d66994ec0098eb276f1`,
then read fully again at final SHA
`6077df84dfd54ed8c3b9609a9c20318fc2bef3fc51af9d80070675b362644fc7`.
The final report transparently supersedes the provisional acceptance status,
preserves its failed independent checkpoint, adds Main's serial acceptance and
corrects static preflight literals. Its 26-file inventory matches the independent
hashes above. No product/test pin changed; no retest is asserted for report prose.

## Residual limits and unexecuted work

No provider/login/model/DB/browser/private production root/real forest/archive
collector/author checker was run; no environment, Git, installation or paid API
action. Bounded finite controls ran only through the explicit offline selectors.
Storage/DB/JS deadlines are cooperative, not hard OS preemption. Crash before
child close may leave charged incomplete raw/control artifacts; power-loss and
same-user hostile filesystem races are not eliminated. Tool-event refusal cannot
undo tool activity already performed by a provider. Production authenticated
replay/observation ingress and empirical paired efficacy remain deferred; passive
UI has no invented private metadata reader. Historical failed064 remains UNKNOWN.
This PASS certifies only the reviewed offline implementation slice, not fulfillment
of deferred R5/R8/R12 or mathematical discovery/global proof.
