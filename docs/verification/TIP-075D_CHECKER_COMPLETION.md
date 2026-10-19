# TIP-075D — independent streamed checker completion

2026-10-05. Builder `/root/period_skeptic`; scientific root
LRC_P139_REPRODUCTION_075, REPRODUCTION. Historical whole attempts FOUR, new ZERO;
G/C/T/B OPEN0/4. BUILD_ONLY, not attempt5 or a whole replay grant.

STATUS: owned checker implementation and bounded independent peer review DONE.
Final report freeze supplied separately; overall acceptance belongs to Main.

## Owned changes and frozen code

Only NEW owned paths created with apply_patch:

- scripts/operations/verify-lrc-p139-g-stream.py — 25077B,
  SHA9504e46d74d578bc1c230cb6d2ac50746121cc8d4782084d0c9c7af56bc5b6b0.
- tests/research/test_lrc_p139_g_stream_review.py — 33942B,
  SHA0dd4e9f9a5822c9724795dccfb7b2f99273ac5c9a4a56da71ecd154d8638c820.
- This report. No old source/test/spec/evidence edits or peer-file edits.

Own independently authored075C scalar/SET implementation and its self-contained
finite certificate/direct-multiset fixture were carried forward into a NEW
standalone file; no runtime import of old checker, producer, host, author code,
shared semantic helper or test oracle. The test integration separately loads
the actual new producer solely to compare output. AST control verifies the
checker imports only hashlib/itertools/math/time and has no assert admission.

## Delta scan, decision and implementation

Read AGENTS, latest handoff, active commitment/protocol, Vibecode Kit and its
TIP/report format, complete075B blueprint/075C wire, and all four075D documents.
Scan found full-prefix transport alone cannot remove retained Python sets or
per-cut sorted-set hashing. Proposed external runs/new cursor were NOT adopted:
Main explicitly chose bounded semantic sets and the exact075C cursor schema.

Retain independently reconstructed masks, every private/root/pivot/prune/child,
unit canonicalization, all nondecreasing extras including repetitions and empty
tuple, overlapping-root support dedup and exact final multiset UNION. Keep the
event prologue/bytes, counters/frontier and exact sorted table/UNION hashes.

Added profile_spec defensive declarations and P139_EXECUTION_ENABLED=False.
Actual139 and disabled/unknown/malformed profiles refuse BEFORE clock, memory,
mask/search or stream effects. Caller metadata, declared large caps or fake grant
cannot override it. Static139 declaration only: root counts1/36/126/126/84/36,
sum409, independently checked using small subset arithmetic, not139 masks.
Whole proposal20M nodes/40M events/1M extensions/100k keys/256MiB logical bytes/
512MiB accounted memory/600s is inert and UNUSED in every execution here.

Rows iterator captures event-count fence and reserves sorted-list workspace AT
API CALL, including before first next. Explicit close handles unstarted/partial/
exhausted iterators, idempotently; finally closes owned expected readers on any
comparison failure. Each iterator reserves4096+N*(256+width); live reservations
aggregate with retained storage and cursor32768 workspace. Per-support extension
index storage N*256+4096 remains charged until SIZE_END. Partial initialization,
allocation/time errors and yielded row conversion cannot leak an accepted state.

Normal cursor/barrier hashes use row iteration, not raw tables()/dataset()/_raw
copies. Every sort/hash/row poll remains charged to the same deadline/memory;
there is NO O(1), external-sort or unbounded-memory claim. Tiny compatibility
raw snapshots remain bounded separate APIs, not underneath stream admission.

compare_snapshot requires exact current/finalized table keys, consumes keys in
NUMERIC order, compares independently derived rows through BOTH EOFs, checks
bytes/width/range/nondecreasing entries/strict unique rows and distinct support
entries; final-row multiplicity is preserved. Unique sentinel distinguishes real
StopIteration from any yielded None. Supplied rows never become semantic state.
Verified marker set only after all checks at one event count; feed invalidates
it even on failed feed. finish_verified requires TERMINAL plus same-cut marker,
returns only TINY_G_VERIFIED_CTB_OPEN/semanticVerified true/history4/grant0.
Every semantic/parser/stream/I/O/type/EOF/time/memory/finish error permanently
poisons the object; caught bad final events cannot be rescued by good data.

## Fresh quantitative verification

Final OWN command, external120s timeout/stdinDEVNULL:

```text
python3 -I -S -B -c 'import subprocess,sys; r=subprocess.run([sys.executable,"-I","-S","-B","tests/research/test_lrc_p139_g_stream_review.py"],stdin=subprocess.DEVNULL,timeout=120); raise SystemExit(r.returncode)'
```

66/66 named tests PASS0.331s, wrapper0.350s, exit0. Exactly36 explicitly carried
controls plus30 new stream/profile/resource controls; prior63/65 runs, peer/Main
reruns, loop mutations, domain variants and every-cut repetitions NOT added.
No actual139 constructor/search/replay, unbounded fuzz or math run.

- Independently authored complete event fixture first agrees with a SECOND
  direct enumeration of EVERY multiset (no minimal/private/prune assumptions).
  Domains<=23,target<=5; include empty schedule, empty tables/UNION, repeated
  extras, repeated images and ONE zero-length extension.
- Streaming every-cut reconstruction uses32/109/46 event fixtures:190 cuts,
  full independent genesis replay and exact cursor/row comparison. This is ONE
  named control, not190 tests; corresponding carried raw-cut test not added.
- Actual new producer and checker agree on207 events from five tiny domains
  (10/10/32/109/46); independent oracle final counts1/1/3/18/4. Genuine producer
  iterators are used while producer tables()/dataset() are patched fatal.
  This is ONE named integration test; carried raw cross-replay not added again.
- Coherently rehashed support/UNION omissions, missing root/sibling/extension,
  false prune/pivot/options/support index, footer, overlap/reorder/extra events
  refuse. Nested subtree fixture19/4/5 has244 events, same root122, adjacent
  genuinely different COMPLETE nested blocks[124,127)/[127,132),3/5 events7/13B;
  recomputed footer and total count/bytes stay identical, semantics rejects.
- Actual external readers use read sizes1/2 and require both EOFs. Truncated
  final rows/trailing bytes, missing/extra/duplicate/order/range/type/width/support
  multiplicity, None-at-empty/after-valid/inside-empty-table refuse. Lazy reader
  __iter__/__next__ OSError closes owned workspace and poisons. Reentrant feed
  invalidates cut; same-cut marker never survives mismatched streams.
- Call-time/partial fences, unstarted close, multiple live iterator aggregate,
  cursor simultaneous workspace, retained support-index workspace, sort/row
  allocation errors, post-sort deadline and partial-constructor teardown checked.
- _raw/tables/dataset patched fatal while normal feed/barrier/cursor/streamed
  comparison/finish_verified still succeed. Static profile defensive copy409,
  malformed aliases/huge limits, raised declared caps and forged profiles before
  patched fatal clock/reserve, default CLI refusal and source independence pass.

Pure tiny defaults remain075C:100k nodes/200k events/50k extensions/10k retained
keys/2MiB logical trace+retained bytes/64MiB accounted memory/10s. Lower-only
exact limits. Retained unique support-plus-UNION keys count separately; support
transfer not double charged. Working base65536+1024/key and precharged sort/
cursor/index work is conservative cooperative accounting, not hard RSS.

## Draft findings and corrections before freeze

Main/producer review found a genuine early draft EOF defect (None used as end
sentinel), reader-construction cleanup gap, partially initialized destructor,
nonaggregate cursor workspace, retained extension index and raw-only barrier
hashing. All corrected in own new source before freeze with distinct executable
controls; they were not papered over as harmless. Added normalized iterator
allocation failures and actual producer-genuine-stream integration. Initial
generated test escaping caused a SyntaxError before any suite executed; corrected
only own new test, then63/65/66 fresh passes. No silent peer or old-file fix.

## Independent producer peer review

Read complete frozen new producer and its32-test file. Semantic scan checked
bitset private updates, cumulative earlier-option exclusion, all root schedules,
all extras/multiset images, support transfer/UNION key charge, fenced streams,
compact finalized support table, deadline/sort memory and fixed disabled profile.
No remaining blocking finding. Fresh external120s producer suite32/32 PASS0.059s,
wrapper0.101s; this peer rerun is NOT32 extra independent checker tests.

Peer pins unchanged across review/run:
producer22962B SHA694fccfb5925f86d53863c673ebc0845e311cb40b2613515d246db3494e3278c;
test21035B SHAc39c1fc07e7b2279f466bf03f54aebd497b6c4b931584d135cf477e3ed3d69b5.

## Independent host peer review

Read initial466-line host draft. Flagged exact-str profile validation before
equality effects; owner correcting. Requested bounded/time-accounted metadata
bootstrap and separate HOST_AUDIT before large blob work; public phase/worker
code was not yet present, so no full-host verdict or host-suite PASS is claimed.
Subsequently read the entire approximately1000-line host through public phases,
_worker_input, worker and main. Exact-str correction present. Focused semantic
review found genesis reconstruction of EVERY framed event; exact start/end
cursor and support key binding; numeric lazy TABLE order then DATA through BOTH
EOF; independent compare_snapshot marker; SEGMENT_END plus STREAM_END and real
EOF before output. Terminal VERIFY uses finish_verified and exact tiny/history4/
grant0 fields. Saved receipt is not adopted as a fresh mathematical verdict.
GEN reconstructs every event and compares every row/cursor before appending.
Static profile/header admission precedes OWN-source or Engine loads; tiny CONTROL
bootstrap is necessarily read before parsing its domain, as explicitly specified.
Read the FULL frozen source and its60-test file, then the complete host completion
report. Source55812B SHAb53d717a067f95e72785ef32db7348f03506d5d8bb1e893be1ba12820bd80dc8;
test34636B SHAf19ae349db2d47295f52d890672a55a7fa866386fe930ee6d6c61935f9432af7.
Reviewed permanent TOTAL pools, bootstrap charge carry/deadline, source-byte
pinning, current descriptor only/full-prefix reconstruction, create-only phase
reservation, lazy framing, guarded publication and unconditional pipe/spool/
selector cleanup. Flagged partial metadata-write telemetry before freeze:
recharging every remaining partial write understated the receipt snapshot. Owner
changed to precharge the entire known raw payload ONCE and added a true7-byte
partial-write test; peer sources were not edited by this Builder.

First independent host rerun FAILED:60 named methods,65 error entries including
subtests,1.243s. Concurrent suites contended for the exclusive source-directory
flock; repeated sources()/directory_fd() refusals and downstream child stderr
were not counted as PASS. All four frozen source/test pins remained unchanged.
Main serialized Main then Checker then Producer; no lock weakening, fixture
masking, source change, quota expansion or automatic retries were introduced.

After Main's explicit turn signal, exactly ONE serialized final host rerun:

```text
python3 -I -S -B -c 'import subprocess,sys,time;started=time.monotonic();p=subprocess.run([sys.executable,"-I","-S","-B","tests/research/test_lrc_p139_stream_host.py"],stdin=subprocess.DEVNULL,timeout=120);print("EXTERNAL120_ELAPSED",round(time.monotonic()-started,3));sys.exit(p.returncode)'
```

60/60 PASS9.480s, wrapper9.656s, exit0; no remaining host test process. This is
a rerun of the same60 named methods, not60 additional independent controls.
Source/test pins remain unchanged. No remaining focused blocking finding.
Source-exclusive-lock single-writer limitation is explicit, not a claim of
parallel campaign feasibility. Main independently reviews repository preservation
and final acceptance. Host owns framing/files/pipes/ledger/durability/phase resource
enforcement; these are not established by checker helper tests alone.

## Requirement/scenario boundaries and unresolved gates

Owned R1/R2/R3/R4/R9:5/5 addressed and covered within BUILD_TINY. Owned A1/A2/A3/
A4/A10/A11/A12:7/7 bounded semantic/API scenarios covered. R5/R6/R7/R8 and actual
transport/process/storage A5–A9 are host-owned; their complete source/test/report
read and final60-suite peer verification are recorded above. This does not turn
own5/5 and7/7 ownership mappings into a host-alone or checker-alone9/9 or12/12
claim. Scientific G/C/T/B0/4, whole-cost
feasibility UNKNOWN. All future full declarations/TOTAL values are DRAFT_NOT_GRANTED.

No external runs, new cursor contract, unordered hash, resource/target/counter
wash, sample-to-whole promotion, live agent/source permit, formal verification,
paper/global14/15 result, novelty or breakthrough established. Source/auth/lease/
replay/G2 SOURCE_REFUSED remains separate. Four old whole attempts and old pins
unchanged. No API/browser/private ResearchDiagnostics evenstat/author code/DB/
env file/install/Next UI/TS/schema/Git write/commit/push/billing/deploy actions.
Next build/types/lint/browserE2E SKIP additive stdlib Python-only scope. No new
source37 admission. Main owns repository-wide inventory/hash/prefix preservation.

STOP after bounded075D engineering acceptance; no attempt5/actual139 execution.
Future source-pin release and concrete human-approved TOTAL execution grant
are required, followed by entire409-root and every-extension independent replay;
even complete G would not close C/T/B or J/global LRC.
