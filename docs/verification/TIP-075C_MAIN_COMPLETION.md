# TIP-075C Main completion — segmented G BUILD checkpoint

2026-10-05. STATUS: DONE / accepted for BUILD_ONLY, BUILD_TINY only.
Same scientific root `LRC_P139_REPRODUCTION_075`, REPRODUCTION, target entire
`J(13,139)=empty` through G/C/T/B. Scientific gates remain **OPEN, 0/4 closed**.
Historical whole attempts FOUR; new whole attempts and execution grants ZERO.

## What was established

The reviewed075B architecture now has three executable, separately authored
stdlib Python modules: an optimized explicit-event producer, a standalone
scalar/SET semantic checker, and a create-only durable capture host. Actual tiny
generation, process reconstruction, full-prefix independent replay, exact final
table/data checking and permanent TOTAL reservation accounting have run together.
This discharges the approved prerequisite BUILD obligation. It does not discharge
the scientific whole-p139 G obligation, close C/T/B, or prove LRC14/15.

Human “duyệt và triển khai” approved the preceding BUILD_ONLY proposal, not a
fifth whole attempt. The BUILD charter is immutable after this checkpoint. The
Vibecode Kit separated Contractor specification/verification from three Builders
with disjoint source/test/report ownership. Each Builder read the applicable
instructions and recorded a focused delta scan; existing075B scan/design was
reused. Main wrote no product/test code and independently inspected the actual
modules, hostile controls and completion reports before rerunning tests.

## Files and frozen implementation pins

Only thirteen NEW files belong to this change:

- `docs/research/commitments/LRC_P139_REPRODUCTION_075_BUILD.md`: approved scope.
- `docs/contractor/tips/TIP-075C_SEGMENTED_G_BUILD.md`: R1–R8/A1–A12 contract.
- `docs/contractor/WIRE_TIP-075C_G_SEGMENTS.md`: exact executable tiny wire.
- Three sources, three tests and three Builder reports listed below.
- This Main completion report.

Only three OLD documents may be appended: active commitment, contractor manifest
and handoff. No existing source, test, evidence, charter or pin is replaced.

| New source/test | SHA-256 |
| --- | --- |
| scripts/operations/attempt-lrc-p139-generation-v3.py | 0f8c161e25f7c5803e13d9f2ee986011c355390eb22aa05343e318bf26a2213f |
| scripts/operations/verify-lrc-p139-g-segments.py | d74fb7953b88864acaf44ec5126e5b99d026a46b8d67d1d6a9de4b1b9cce151a |
| scripts/operations/capture-lrc-p139-generation-v3.py | 010b59b330181cfc88103ea5d289558e401e93f01d6a427cab735a100177ca76 |
| tests/research/test_lrc_p139_generation_v3.py | 250c3de12e0d234efa89fc40f9801437c9fa24efa2d41dd4c6c10aaa44e43a5d |
| tests/research/test_lrc_p139_g_segments_review.py | 935acb57fdc437687906e1d54d65a6de784dccf2ba3c322a7ddf787fd722987a |
| tests/research/test_lrc_p139_g_segments_host.py | 29975320cb5bf3d51b47816a1de7cd632f00e32bd8642dc69b1b7449aab189ce |

TIP SHA `aee3acb98167873b293a6cd91ae0505403b45e0a0af4da8a6939c76efac34d83`;
wire SHA `d48a4aa8c7a6fe960edb1f2dd4ae608ef8fc334793f444e3f246093e532eb5da`;
BUILD charter SHA `3c5bd62110ec7918098e65509a80bd2b1bbc148dd8528bc494b1327d436635c6`.
Builder reports are `docs/verification/TIP-075C_PRODUCER_COMPLETION.md`,
`TIP-075C_CHECKER_COMPLETION.md`, `TIP-075C_HOST_COMPLETION.md`; publication
handoff records their final hashes and the external hash of this report.

## Fresh Main verification

For each of the three exact test paths above, Main executed an isolated child
with a fresh external120s watchdog, captured stdout/stderr, and checked exit0:

```python
subprocess.run([sys.executable, "-I", "-S", "-B", test_path, "-v"],
               env={name: "false" for name in six_flags},
               capture_output=True, timeout=120)
```

The six flags are RESEARCH_WORKER_ENABLED, MATH_PILOT_QUEUE_ENABLED,
LRC_CAMPAIGN_LOCAL_ENABLED, RESEARCH_OPENAI_ENABLED, RESEARCH_CODEX_LOCAL_ENABLED
and SANDBOX_DOCKER_ENABLED. No bytecode/dependency/runtime environment-file write.

| Final suite | Named tests | PASS / FAIL | unittest seconds | Wrapper seconds |
| --- | ---: | --- | ---: | ---: |
| Producer | 19 | 19 / 0 | 0.035 | 0.125 |
| Independent checker | 36 | 36 / 0 | 0.197 | 0.288 |
| Durable host | 49 | 49 / 0 | 5.584 | 5.686 |
| Total distinct controls | 104 | 104 / 0 | 5.816 | 6.099 |

All final source pins were unchanged across the relevant Main reruns. The earlier
35-test checker rerun PASS0.262s and Builder/peer reruns are NOT extra controls.
190 prefix cuts, 207 cross-module events, fault variants and loop iterations
are likewise not added to the104 named tests. Suites remain inside the approved
120s-per-suite/600s bounded QA envelope; no unbounded fuzz/search was authorized.

Actual host cycle `(prime,divisor,target)=(7,3,3)` used three real children and
one committed segment with23 logical events. Terminal verdict was ONLY
`TINY_G_VERIFIED_CTB_OPEN`. Permanent reservations:3 invocations, nodes300000,
events600000, seconds96. A1-event cut followed by completion used6 invocations,
nodes600000/seconds192, with fresh full-genesis replay and independent producer
reconstruction. Structural inspect returned `semanticVerified=false`; saved
receipts never substitute for a new semantic replay.

## Requirement and scenario coverage

Eight implementation requirements and twelve scenario groups accepted **within
BUILD_TINY**. No scenario is an executed whole-p139 test.

| Requirement | Actual evidence |
| --- | --- |
| R1 | Explicit DFS/event cuts; complete root/support/extension/UNION grammar; exhaustive independent tiny multiset/table oracle equality. |
| R2 | Checker imports only hashlib/itertools/math/time, no producer/shared/test/author semantic code or assert admission. Independently derives masks, private sets, first-prune, pivot/options, unit images and exact UNION. |
| R3 | Every-cut fresh genesis reconstruction and pending siblings; actual host continuation replays whole committed prefix and compares independently reconstructed cursors/tables/data before generation. |
| R4 | Retained dirfd/flock, no-follow/create-only files, ordered fsync and atomic complete commit LAST; reservation before START, crash/orphan/invalid-tail STOP without rollback. |
| R5 | Ledger derived from every unique reservation, conservative FULL quota permanently spent for VERIFY/GENERATE/reconstruction, no refunds or counter reset. TOTAL exhaustion refuses before another START. |
| R6 | Strict tiny admission; lower-only node/event/extension/row/byte/time/allocation caps; preparse/pre-base64 preflights; bounded real pipes/process lifecycle/files/storage. Cooperative, not hard OS RSS/fsync containment. |
| R7 | Exact semantic sequence and all table/data byte equality, terminal-only tiny verdict. Recomputed transport hashes cannot legitimize omitted/reordered/mismatched semantics. Prefix, inspector, checker failure and positive JSON/nonzero exit do not establish G. |
| R8 | p139 before-constructor denial, default CLI refusal, old298 diagnostic not a checkpoint; attempts4/grant0 retained. No old source/pins or runtime/source authority change. |

A1/A2: producer and checker independently compare complete finite covers and
support tables to brute force, including empty schedules/tables and repeated
extras/duplicate images. Checker restarts at190 actual cuts; one integration
test compares every event/cursor/table/data on five actual producer domains.
Actual two-advance host test establishes process restart separately.

A3/A4: missing root, branch sibling or extension, false prune, changed pivot/
option/support index, coherently rehashed support/final UNION omission, and
missing/extra/duplicated/wrong-type table/data are rejected. Actual host coherent
event omission reaches the REAL checker and retains an ERROR receipt/no new GEN.

A5: duplicate, overlap, reorder, extra/truncated events, typed wrong cursor and
orphan chain reject. Main's final test audit found subtree-swap was not explicitly
covered; checker Builder added ONE genuinely nested full-subtree control.
Fixture `(19,4,5)` has244 events. Within SAME root starting at122, adjacent full
child blocks `[124,127)` and `[127,132)` contain3 versus5 NODE events,7 versus13
bytes, BOTH nested branches. Swapping them preserves total event count/bytes;
the root footer is recomputed identically and table/barrier bytes retained.
The independent checker rejects the modified stream. This is a semantic swap
control, not a separate host-chain hash test; host coherent-rehash rejection is
already exercised by A3. The initial `(13,3,4)` fixture lacked the needed distinct
siblings and was corrected transparently, without relaxing code admission.

A6/A7: actual owned files and injected crashes after reservation, VERIFY/GEN
START, staging, commit, capture receipt and final receipt; permanent slot/quota
retained, missing/error receipt STOP. A successful CAPTURED tail without any
started next VERIFY can receive a newly charged VERIFY-only recovery, never a
new GEN or refund. TOTAL node/invocation/file exhaustion and forged ledger reject.

A8/A9: actual directory/file symlink, hardlink, FIFO and exclusive lock controls;
pin mismatch and injected post-child drift; actual isolated children and bounded
stdout/stderr/timeout/nonzero exit, observed exactfalse flags, kill/wait/close.
Verified OWN host bytes are executed with `-c`, not a source-path reread. The
unreaped-wait fault uses actual pipes plus a wait proxy and always closes handles;
it is not an assertion the OS can always reap a process. No concurrent hostile
source overwrite or intermediate-parent symlink fixture is claimed executed.

A10/A11/A12: prefix and failed final/finish cannot be accepted; refusals/allocation
faults poison the engine, including caught failures; strict scalar/key/nonfinite/
huge-int/tag/frame/parser limits; whole139/default/grant and old298 restore deny.

## Independent review and repairs before freeze

The separate checker owner completely reviewed final producer and host, reran
producer19/19 and host49/49, and found no remaining BUILD_TINY blocker. Producer
owner reviewed checker and host; host owner independently reviewed checker.
These are independently authored implementations and read-only source reviews,
not a claim of statistical model independence, formal proof or whole reproduction.

Actual findings fixed before source freeze: poison all failed admissions/snapshots;
aggregate support-plus-UNION row accounting; producer sort/join workspace256N;
range-before-finite conversion for enormous integer limits; bool/float integer
aliases; JSON preparse bounds before allocations and request forecasting before
base64/JSON; exact verified OWN host-byte execution; unconditional cleanup even
after unreaped wait; worker scalar/frame shapes before engine construction.

Approved wire refinements bind CURRENT partial support tables and retained footer
counters, host-only lower-limit input/fixed engine defaults, and seconds charge
`processSeconds+12` (host10 + cleanup2), retaining TOTALseconds5120. No scientific
target or whole allowance changed. Checker CLI is stricter API-only; tiny host
loads only pinned OWN definitions, never an arbitrary executable cursor.

## Preservation, issues and explicit limitations

Turn-start baseline1763 files matched075B final. Prepublication audit found
exactly12 assigned NEW files, no old removal, only active-pointer append. Adding
this report produces13 NEW files/1776 total. Full postpublication audit and the
three original append-prefix digests are recorded in the handoff after all appends.
All other old hashes must match, including old scientific evidence, source37,
cap42, ledger7, prior charters/checkpoints and unrelated user changes.

Fresh contractor inventory after adding ONLY the two075C contractor entries:
131 listed hashes ALL MATCH, actual138 (exclude founding/current manifest files),
same7 pre-existing unlisted research-program-v2 files. Issue074-INV-01/P2 remains
DEFERRED, not resealed, deleted, excluded, or falsely declared green. No new
BUILD_TINY P0 remains; this is not a global repository readiness certificate.
`git diff --check` passed. Next build/types/lint/browser E2E SKIP: additive stdlib
Python/docs-only; no Next/TS/UI/live changes. Bundled Next documentation was read
before deciding no framework API is involved.

Remaining research release debt is material: current profile REFUSES prime139/
target13 and limits can only be lowered. Merely granting a larger number or
editing header approval metadata cannot make these frozen sources a whole runner.
A separately reviewed full-domain profile/implementation and concrete TOTAL
envelope are required. Full-prefix replay/JSON/request retention grows with the
entire chain; p139 memory/time/storage/feasibility is UNKNOWN. Tiny timings are not
a whole cost estimate. Resource accounting is cooperative, not hard interpreter
RSS, privileged-host attestation, hard fsync timeout or a power-loss theorem.
Trust remains fixed OWN code and an owned local single-writer environment.

No author code/private ResearchDiagnostics read/stat/write, real DB/session/case/
history mutation, browser/API/provider/native job/M1/campaign, environment-file/
schema/dependency/source37 reseal, Git write/commit/push/billing/deploy. Child six
flags were actually exactfalse; inherited shell UNSET is not an OFF runtime audit.
Source/auth/lease/replay/G2 and SOURCE_REFUSED remain separate. No Markdown grant
bypass or integration with the live agent lane is claimed by this offline build.

## STOP / next routing decision

BUILD checkpoint closed. SAME scientific target remains open; no automatic
follow-up research, attempt5, counterwash, larger cap or different prime/family.
The next proposal is narrowly a reviewed p139 release profile plus an explicit
TOTAL producer/reconstruction/checker/host/time/storage/attempt/invocation
contract, followed ONLY after direct approval by whole generation and independent
whole replay. A G result alone still cannot close C/T/B or the global14/15 theorem.
No new paper validation/refutation, novelty, method superiority or mathematical
breakthrough was established in this turn.
