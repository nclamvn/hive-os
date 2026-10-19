# Blueprint TIP-071–073: durable mathematical replay and one authenticated M1

Date: 2026-10-04. STATUS: PROPOSED_SECURITY_DESIGN_G1_PENDING.
This proposal is not a permit, implementation, durable certificate, or executable G2 manifest.
Latest human request authorizes preparing the next security design and implementation plan.
The concrete private-storage and execution-authority decisions below need approval before code.
No old approval, UI link, copied context, filesystem flag, or this document grants G2.

## 1. Decision: one verifiable vertical slice, not another campaign

Reuse existing Better Auth/workspace capabilities, durable command/outbox/exact jobs,
bounded Codex transport and three-role review. Add versioned durable evidence and
purpose-scoped authenticated ingestion around those components. Do not add a third executor,
a background swarm, new database tables, automatic retry, or automatic human impersonation.

First M1 is REPRODUCTION of FEW_EXCEPTION_SHIFT_14_V1 (14 moving / 15 total runners).
Assumptions LRC(1)..LRC(12), lower continuous witness and analytic alignment remain explicit.
Initial finite classes are only d=3,e=2 and d=5,e=2..4, canonical rational offsets,
strict bad <1/15, equality GOOD. It is a source-visible conditional-method acceptance test,
not discovery, an independent proof of the article, or global LRC14/15 closure.

A separate small replay checker, separately pinned, derives boundaries/cell completeness/
adjacency and tuple masks using its own bounded arithmetic helpers. It may share strict
wire schemas, not producer/checker arithmetic functions, computed masks or verdicts.
This is stronger implementation diversity than invoking the existing consumer twice;
still NOT independent institutions, a proof assistant, or a malicious-host attestation.

## 2. Evidence found in the current repository

| Existing seam | Reuse / limitation |
| --- | --- |
| math-diagnostic-auth.ts | Actual session/original actor/tenant/capabilities/exact job binding; reuse, add post-IO fences and new purpose-scoped admissions |
| math-diagnostic-capture.ts | 0700/0600, no-follow, complete writes, fsync, charged abandoned slots; frozen V1 has five allowed files and no receipt extension |
| math-diagnostic-replay.ts | Parser replay only, NO_RESEARCH_RETENTION; never label it mathematical replay |
| math-lrc-method-unit.ts | Original producer/consumer, exact finite schema/pins; consumer avoids producer but shares helpers in same file |
| math-method-unit-review-orchestration.ts | SOLVER -> ADVERSARY -> original finite check -> CRITIC; critic slot reserved first, but no durable read-back replay gate |
| math-method-unit-authority.ts | Production mint deliberately refuses; fixture authority is Vitest-only |
| research-sandbox/kernel.ts:requestResearchRun | Method-unit creation deliberately refuses; internal fresh ID allocation means caller IDs cannot bootstrap authority |
| lrc-method-unit-observation.ts | Existing one-shot exact-job protocol; requires prospective target before create, so needs an explicit two-stage bootstrap seam |
| math-lrc-research-loop.ts | Pure host tokens/planning; V1 reservation and completed accounting require checkerCalls=1 |
| math-lrc-loop-readiness.ts | Approved passive authenticated retained lineage; source hashes alone do not execute a checker |

## 3. Trust and authentication

Keep actual request headers exclusively in the server-only DAL. Resolve current original actor,
active membership/workspace and mission-scoped research.read/research.request/jobs.manage;
revalidate before and after every evidence read/check/commit and immediately before use.
Every next asynchronous read/check/write begins with a fresh source/state/owned-claim/auth
fence and ends with another fence, not only a check after already doing privileged work.
No client WorkspaceContext, IDs, grant, digest, receipt body, or ADMITTED literal creates authority.
IDs in a request select an object; host rereads ownership and contents. Revocation/tenant drift,
expiry, source drift or lost local permission causes safe refusal without foreign detail.

Three distinct opaque purposes:
- Prospective M1 bootstrap: permits only ONE sealed command identity within exact actor/tenant/
  mission/contract/model/caps/expiry; not a capture grant or general queue permission.
- Active role capture/replay: exact bound created rows, job/outbox/attempt=1, claimed version,
  active lease, role and dispatch ID. Host staged finite read uses this purpose.
  Bind host-generated owned worker identity to durableJob.lockedBy, exact claimed
  version and lease expiry on every fence, including cleanup. RUNNING alone is not
  ownership; a renewed/reclaimed/foreign worker claim cannot inherit the permit.
  Require RUNNING, lockedBy===workerId, exact version, live lease, attempt1 and
  exact tenant/payload/outbox; reuse the existing proof-unit owned-target fence.
- Post-commit evidence admission: original actor, terminal succeeded exact jobs and immutable
  retained results; no active-job capture grant reused after the job becomes SUCCEEDED.

Ordinary Better Auth session housekeeping remains allowed. No session credential in receipts,
browser DTOs, URLs, files, stdout logs or model prompts. There is no service-principal bypass.
After restart, newly resolve session and validate evidence; serialized tokens confer no authority.
Restart may inspect/reconcile read-only, NEVER resume model execution or restore an unused permit.

## 4. Storage choice: V2 layout, one quota, unchanged ceilings

Fixed private root remains:
 /Users/os/Library/Application Support/HIVE OS/ResearchDiagnostics
No fallback to repository, webroot, temporary root or Codex history. Actual external-root access
requires host filesystem permission when later requested; this planning turn does not access it.
Local public-mathematics opt-in only. No encryption or protection against the same OS user claimed.

Add a reviewed V2 capture coordinator/store; historical V1 bytes/read semantics remain immutable.
Same root/quota.lock allocator counts V1, V2, partial, orphan and expired slots. V1 is read-only
for this M1 lane; a legacy writer cannot allocate alongside V2. Unknown versions/files fail closed.
Do NOT append new files through the old five-file V1 store or create a second uncharged quota.

Each allocated slot is charged at least 1,146,880 bytes:
49,152 prepared + 1,048,576 stdout + 32,768 finite + 16,384 aggregate control.
All reservation, bootstrap/binding, final manifest, replay and admission/consumption control
records for that slot share ONE 16KiB envelope, not 16KiB per file. Worst-case serialization
must fit before dispatch. Duplicated verbose source pins stay in one immutable binding descriptor;
receipts reference its digest. If bounded controls cannot fit, stop and request a scope change.

Global cap stays100 slots/128MiB. New M1 requires upfront reservation for all three role slots,
including critic receipt/control headroom. A server-generated provisional solver slot can
hold the spent bootstrap intent before row creation; it cannot become an admitted capture until
the actual server-created row binding is appended and fsynced exactly once. No uncharged
activation journal. Shared allocator checks all reserved/partial bytes and the final commit slot.

All files create-only0600, directories0700, owner/ancestor/inode/no-follow checks, full writes,
file+parent directory fsync, bounded reads and explicit UTF-8/JSON schemas. Re-read through
opened handles, verify exact bytes/digests/identity, and fresh-authorize at post-IO boundaries.
No path from client/receipt text; only host opaque IDs mapped under the fixed root.

A fully fsynced content file is not an admission. Partial write/sync, final marker failure,
unknown outcome or lock crash remains charged and INCOMPLETE/QUARANTINED.
Never delete a stale lock just because its age exceeds a timeout. No new lock recovery/purge
implementation here: identity-checked maintenance and deletion need explicit separate authority.
24h replay/admission expiry is NOT deletion; expired bytes stay charged and UI shows unavailable.
Receipt expiry cannot exceed the earliest source capture, sealed descriptor or grant validity.
Re-authentication/restart/re-replay never extends the original source lifetime or G2 lease.
No automatic cleanup, expired-data resurrection or retry.

## 5. Two non-circular receipts

PRE-CRITIC replay receipt, created after independently reading exact durable finite.json:
- exact actor/org/workspace/mission, command/case/run/solver and review jobs/outboxes/claims;
- immutable descriptor/executable-manifest digest; contract, solver attempt, adversary report;
- seed/predicate/unit, exact finite byte digest and recordDigest, input and certificate digests;
- original checker result digest and NEW replay checker version/source/input/result digests;
- actual new elapsed time/charged operations, aggregate finite budget, replay identity and expiry;
- explicit scope FINITE_ONLY and global/real-time/formal/external/novelty NOT_ESTABLISHED.
It cannot include a final critic ledger digest that does not exist yet.

POST-LEDGER admission receipt:
- binds that exact replay receipt digest to the actual retained final ledger7/review/dossier/
  worker-result anchors, role inputs, final transport manifests and original actor/tenant;
- created only after normal DB review retention and exact scoped readback succeeds;
- stores evidence, not a persisted authority token. A final fsynced commit marker is required.

No circular hash or metadata copied back into the immutable solver attempt/ledger7.
DB commit without admission receipt durability: retained ledger exists, loop admission remains
INCOMPLETE. Receipt without valid DB anchors: quarantined/unavailable. These are intentional
two-system failure states, not a claim of cross-filesystem/database atomic transactions.
Read-only reconciliation can report them; it cannot rerun roles or silently complete a permit.

## 6. Actual process and resource accounting

Prospective approval -> spent bootstrap intent -> server-created exact command/rows ->
bind opaque authority -> SOLVER -> ADVERSARY -> original finite producer/consumer ->
fsync finite.json -> fresh bounded read -> NEW independent replay checker ->
fsync pre-critic receipt -> CRITIC -> normal retained ledger7 ->
post-commit identity/digest readback -> fsync admission marker -> loop consumes evidence -> STOP.

The new replay does not regenerate a certificate or use original computed masks/results as
inputs to its arithmetic. Compare independently computed result digest to the exact old result.
Corrupted boundary/cell/tuple data with recomputed hashes must still fail the mathematical check.

The fresh checker is call TWO. Preserve historical checker invocation/ledger7 and V1 usage.
Add a V2 aggregate resource/admission projection; never feed checkerCalls=2 into V1 pretending1.
Reserve/charge original producer+consumer and fresh replay under the SAME aggregate
5s/2,000,000 operations and256-bit bounds. Outer finite wall ceiling includes staged read,
checks and receipt commit; each stage only receives the remaining ceiling, never a fresh cap.
Original consumer metrics are charged; independent replay reports its own actual metrics.
Filesystem/JS deadlines remain cooperative, not hard OS quotas. Incomplete metrics hardstop.
Missing seed has no replay call and remains MISSING/INCONCLUSIVE; no fabricated seed.
Resource/storage/integrity failures stop before further roles. Semantically refused certificate
may retain a scoped refusal and conservative critique, never a positive admission.

Original outer30min/child240s/lease1800s, three fresh role contexts, one attempt per exact job,
prepared49152B, streams1MiB each, math16384B, feedback8192B, finite32768B unchanged.
No paid API, provider fallback, extra roles, retry/resume, old064 reset or private-history read.
M1 requests the sealed codex-local/gpt-6-sol lane only if current readiness actually permits it.

## 7. One-use bootstrap and prospective IDs

Do not remove the current requestResearchRun refusal for generic calls.
Add a narrow server-only approved M1 command seam reusing the same durable command/outbox/
worker/review kernel. Bootstrap grant is distinct from execution/capture/admission grants.

Before scientific row creation, exact manifest/current session/private-quota/source readiness
must pass and a unique spent intent must be durable. Allocate new IDs ONLY on the server
inside this controlled seam. Bind generated rows and original command outcome to opaque
authority after transaction commit; no caller-selected target masquerading as authentication.
Before role dispatch re-read exact IDs/claims and fsync actual binding. Ambiguous commit/claim/
receipt failure spends the attempt, refuses dispatch and reports exact known ownership.
Do not infer cleanup ownership from an uncertain callback return.

Final approval binds exact server descriptor/manifest, original actor/tenant/mission and nonce;
the resulting created-ID binding is separately retained, not rewritten into the human-approved
manifest. This is two-phase allocation, not claiming all final row IDs existed before creation.
Duplicate click/concurrent POST/idempotency conflict/restart cannot allocate another experiment.
The spent-intent identity is the approved descriptor digest plus approved nonce, not a new
random key per request. Under ONE allocator lock, refuse an existing intent, reserve all
three role slots and durably create that intent before releasing the lock. Partial allocation
or ambiguous intent state remains charged/spent; no competing request may allocate again.
Once dispatch may have occurred, uncertainty is spent; no reset-to-unused. Owned failures only.
No model on page GET, prefetch, render, refresh, polling or hydration.
Thin same-origin POST must authenticate/authorize itself; Next action IDs are not permission.
All long work stays bounded on the existing owned exact-job path, not a new generic daemon.

## 8. Evidence consumption in the agent loop

Authenticated same-process host validates the committed certificate+terminal job anchors,
then mints a new opaque V2 admission token for this exact record. Token must belong to the
current registry/session/descriptor; copied/deserialized tokens and foreign bindings refuse.
Consume only the approved one-experiment M1 envelope, account both checkers, then STOP.
The host may classify result/review and propose root-linked tasks with source finding digests.
No next experiment or hypothesis execution is authorized by M1 success.

KNOWN_FINITE_PASS is replayed known control evidence, not new mathematical information.
Do not manufacture associations, refutations, bidirectional relations or uncertainty deltas
from model votes/prose/hash changes. Missing semantic alignment remains UNROUTABLE.
Record/root proofClosure=false and global LRC/formal/external/novelty NOT_ESTABLISHED.
Later discovery-batch control needs separately sealed predicate/evidence/relations/resources.

## 9. Executable manifest and visible acceptance

The old37 registry is only historical support, not the new runtime closure.
Freeze separately reviewed first-party entrypoint and transitive local runtime dependency
closure including authority/store/parser/checkers/orchestration/kernels/V2 loop/DTO path,
exact versions, package-lock and installed dependency/runtime identity, prepared schema/
renderer and canonical contract/source data. Enumerate dynamic imports explicitly.
Manifest bounds/canonical parser must refuse omitted/unreviewed dependencies.

A fresh isolated reviewed process verifies actual installed bytes before mint; HMR/cached
imports cannot attest new source bytes. Source hash verification is not a malicious-host/
OS/binary remote attestation. Unexpected executable path or provider/tool capability refuses.
If identity verification cannot fit the existing bounded import ceiling, STOP—not widen it.

Browser UI uses sanitized passive states: auth -> exact jobs -> durable finite bytes ->
independent replay -> ledger admission -> one-run outcome. No raw transport/session/root paths.
Show both checker invocations and actual resource/role accounting; missing usage unavailable.
Observe ONE authorized M1, screenshots of actual lineage/outcome, desktop/mobile; no fixture
persisted as scientific evidence. Source-visible reproduction is not held-out benchmark.
Technical success requires actual full engineering trace, not a promised mathematical breakthrough.
The positive durable-replay objective additionally requires a real supported certificate and
passed fresh replay. Missing/refused seed can be an honest negative E2E observation, not a
PASS of that positive objective; no automatic retry is authorized to obtain a green result.

## 10. Phases and approval boundary

| Pack | Outcome | Authority |
| --- | --- | --- |
| TIP-071 | Versioned private store, separate finite replay checker/receipts, offline fault-injection tests | G1 OFFLINE after approval; unique temp fixtures only |
| TIP-072 | Purpose-scoped bootstrap/admission, exact-job integration, V2 loop accounting, passive DTO/UI; adversarial QA | G1 OFFLINE after approval; no production mint/dispatch without approved exact manifest |
| TIP-073 | Fresh actual session/preflight, external filesystem permission, fresh executable descriptor, exact G2 approval, ONE M1 visible E2E | Separate G2; no campaign, retry or automatic next run |

Minimal architecture/security decision requested now: APPROVE G1 for071–072 with this exact
privacy/quota/crash/auth/two-checker/one-use design. Contractor then seals TIPs and delegates
Core/Integration/Review/UI as needed, runs Main QA and reports scope coverage.
This approval does not grant production private-root access, M1 model calls or G2.
TIP073 remains pending an actually bound descriptor and current permission/readiness.

## 11. Named acceptance criteria

S1: Actual original-actor/tenant/capabilities must pass before and after all IO/check/commit/use.
S2: Plain/copied/fixture grants, forged IDs/metadata/ADMITTED flags never grant production authority.
S3: Correct retained finite certificate freshly passes separate arithmetic checker without producer calls.
S4: Changed/missing/duplicate/reordered cells/boundaries/tuple masks fail even with recalculated hashes.
S5: Foreign/stale/cross-predicate/source/version/job/claim/lease/attempt/result anchors refuse.
S6: Pre-critic receipt and post-ledger receipt have distinct non-circular bindings and immutable bytes.
S7: Full write/fsync/path/owner/nofollow/hardlink/ancestor-swap faults leave charged inadmissible state.
S8: One quota includes V1/V2/partial/orphan/expired/control bytes; cap/lock exhaustion blocks dispatch.
S9: Crash lock/commit failure/restart admits no authority or automatic replay/dispatch/recovery.
S10: Actual two-checker metrics fit aggregate5s/2M/256bits; missing metrics or exceeded quota hardstop.
S11: Missing/unsupported/refused seed retains honest state; no synthetic positive or regenerated certificate.
S12: One fresh server-allocated command/ID binding; duplicate/concurrent/ambiguous creation spends one intent.
S13: Normal exact solver+review jobs only; no generic method-lane unlock/shared worker/third executor.
S14: Retained ledger/job results and durable receipt disagree or one is missing -> loop INCOMPLETE.
S15: Current session restart hydration validates immutable anchors before new opaque admission.
S16: M1 consumes only one bounded envelope and STOP; known finite PASS/votes never creates novelty/root proof.
S17: Public DTO hides private raw data/paths/session/authority; GET never executes mathematical replay.
S18: Final whole types/lint/build and declared regression/independent review pass on exact frozen bytes.
S19: Actual bounded E2E shows real role/checker/receipt lineage; fixture evidence is labeled separately.
S20: Old064 FAILED/UNKNOWN, V1 captures/ledger7/source registry/history/proposals/unrelated dirty files preserved.

Coverage now:20 criteria DESIGNED,0 newly implemented/executed this planning turn.
No perfection, research breakthrough, formal proof or autonomous-campaign completion claimed.
