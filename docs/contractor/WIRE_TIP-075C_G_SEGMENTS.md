# TIP-075C executable wire contract v1 — BUILD_TINY only

Implements reviewed075B semantics; not a new goal or whole execution grant.
Three OWN stdlib modules, producer/independent checker/host; no shared semantics.
BUILD_TINY domain prime3..23, divisor2..24, target1..5, all exact ints; nonzero
equal mask cardinality required. Actual p139 construction/search/replay is denied.
Whole139 format/domain declaration remains a future release, not current code
acceptance. Default CLIs refuse without --build-tiny; no network or arbitrary code.

## Common pure engine interface

Producer Engine(prime,divisor,target,limits=None): next_event()->bytes|None,
cursor()->dict, tables()->dict[str,bytes], dataset()->bytes. next_event applies
the entire event effects before returning. None ONLY after terminal.
Checker Verifier(prime,divisor,target,limits=None): feed(event:bytes), cursor(),
tables(), dataset(), finish(dataset:bytes,tables:dict[str,bytes])->dict. It has
its OWN independently derived state/next-event grammar; feed rejects mismatch.
finish requires terminal and exact bytes equality for every table and dataset;
verdict TINY_G_VERIFIED_CTB_OPEN, never WHOLE_G/J/global14/15. Both expose a
Refused exception (checker may name VerificationRefused) with bounded reason.
No checker import/exec of producer, host validator or prior test module.

All limits exact-key dict, positive exact int except seconds positive finite
numeric; may LOWER defaults, never raise. Defaults (per cooperative engine):
nodes100000, events200000, extensions50000, rows10000, bytes2097152,
memory67108864, seconds10. rows is aggregate retained UNIQUE keys across all
finalized/current support tables and final UNION; transferring a current table
does not count twice, but a support key also in UNION occupies two containers.
bytes bounds total retained raw tables/data plus
generated/parsed event bytes; precharge sets/sorting/snapshots before allocating.
No hard RSS claim. Time covers reconstruction, masks/canonicalization/parsing/
sort/hash/cursor/finish, not only node traversal. Invalid/unknown limits refuse.

## Mathematical event grammar

Logical PROLOGUE b'LRC139G2\n' once. All fields unsigned little endian; u8 domain
classes, u32 root count/length/support index; u64 barrier counts; SHA256 raw32B.
Overflow/unknown/truncation/extra event refuses. Event lengths derived, not trusted.

-244 ROOT_START: [244,s,q,P...] (3+q bytes), exact ascending schedule of ALL
  combinations of M(1), q=max(1,ceil((2n-ms)/s)), s=ceil(n/m)..target.
-0..5 NODE: one byte, same first-applicable prune priority as075B/v2.
-6 NODE_BRANCH: [6,pivot,count,options...] (3+count bytes); options ascending,
  pivot minimizing (available-coverer count,time). Root selected1; children remove
  their option and every earlier option, never later options/nonoptions.
-245 ROOT_END: tag+u32 rootNodes+u32 rootBytes (9B). rootBytes includes ROOT_START
  and all NODE records, excludes this footer/transport wrappers.
-247 SUPPORT_END: tag+s(u8)+count(u64)+sha256(table)(32B),42B. Sorted DISTINCT
  canonical minimal-support table width s; derive independently BEFORE extension.
-246 EXTENSION: tag+s+extraLen+supportIndex(u32)+extras+canonical target-row,
  7+extraLen+target B. Every lexicographic combinations-with-replacement tuple,
  including repeats/old members, duplicate images, ONE empty tuple for length0.
-248 SIZE_END: tag+s+extensionCountForSize(u64)+support-table hash32B,42B;
  permitted only after every support/index/extra, including empty tables.
-249 FINAL_END: tag+distinct finalRowCount(u64)+dataset hash32B,41B. Exact sorted
  DISTINCT canonical UNION, NOT source expected counts. Only then TERMINAL.

Schedule: PROLOGUE -> per size SEARCH roots -> SUPPORT_END -> all EXTENSION ->
SIZE_END -> after last size FINAL_END -> TERMINAL. If size schedule empty, directly
FINAL_END after PROLOGUE. Inclusion-minimal support proof/generalized incidence
bound applies; no tau/source metadata. Current tiny arithmetic independently
tested; p139409-root DECLARATION may be checked without actually traversing it.

## Cursor / event cuts

Exact cursor keys:
phase,size,rootIndex,private,frames,supportIndex,extraRank,rootNodes,rootBytes,
searchNodes,eventCount,extensions,traceBytes,supportHashes,unionHash.
phase is PROLOGUE/ROOT_START/SEARCH/ROOT_END/SUPPORT_END/EXTEND/SIZE_END/
FINAL_END/TERMINAL. size0 only before initial size/after terminal, private[] when
outside root, nonnegative counters, extras rank0 at each support. supportHashes
maps finalized size strings to {count,width,sha256}; unionHash hashes raw sorted
DISTINCT current final rows, empty bytes before extensions. Current minimal-set
hash must also be bound: supportHashes may include CURRENT size during search,
then freezes that table at SUPPORT_END. Exact deterministic contents required.
tables() MUST expose finalized tables PLUS the CURRENT partial minimal table
(including its initial empty table), same exact keys as supportHashes; finalized
tables remain available across sizes. Empty size schedule has no tables.

frames ordered root-to-top, each exact keys selected,available,slots,options,next.
selected path order (not sorted); available ascending DISTINCT classes; options
null for a pending unvisited node, ascending list for visited branch; next is
index of the next child not yet scheduled. After BRANCH event, first child frame
is pushed and parent.next becomes1 before returning cursor. After a leaf/prune,
pop it, repeatedly pop exhausted parents or push their next child; when empty,
phase ROOT_END. Depth<=target. Thus cursor after any event identifies the unique
next event; no pickle/generator object or producer hint adoption. ROOT_END moves
to next root or SUPPORT_END, resetting root fields at next ROOT_START. SUPPORT_END
starts first support/extras or SIZE_END; EXTENSION increments rank then next
support; SIZE_END clears current support and moves to next size or FINAL_END.
Inside root means SEARCH/ROOT_END pending footer; private[] in other phases.
rootIndex increments globally after each footer; rootNodes/rootBytes retained
until the next ROOT_START resets them. Finalize terminal size0/private[]/frames[];
deterministic counters retained.

Canonical metadata bytes are json.dumps(sort_keys=True,separators=(',',':'),
ensure_ascii=True,allow_nan=False)+'\n', UTF8. SHA over those exact bytes. cursor
snapshots are comparison witnesses, NEVER authorization/trusted resume state.
Checker restart replays every prefix event from genesis. Producer reconstructs
with its OWN next_event grammar then compares the independently verified cursor.

## Host durable profile/interface

Host provides create_session(directory,domain,limits=None), advance(directory,
max_events=32) and inspect_session(directory). New owned test directories only;
no private diagnostics or old evidence directory. Default tiny host limits may
be reduced only: invocations256, nodes25600000, events51200000, seconds5120,
writtenBytes134217728, liveBytes67108864, files4096, segmentBytes65536,
metadataBytes65536, stdoutBytes2097152, stderrBytes8192, processSeconds20,
memory67108864. These cooperative TINY ceilings are not whole139 grants; real
QA suites external120s/aggregate600s. Bind exact limits to immutable header.
create_session limits accepts ONLY the host-limit keys, lower-only, not a nested
engineLimits override. Session engineLimits use the fixed pure-engine defaults;
pure engine tests may individually lower their own limits.
Engine quotas per invocation remain fixed defaults
and FULLY permanently precharged; totals are NOT inferred from child telemetry.
Checker replay/reconstruction separately charged; no counter refund at early end.
Conservative per-invocation seconds reservation is processSeconds+12 (host
validation/publication allowance10 plus kill/wait cleanup2); TOTALseconds5120
unchanged. Host cooperatively checks its deadline before any verdict/admission;
fsync/local OS blocking is not a claimed hard wall-clock containment guarantee.

Session header exact keys format,profile,root,domain,history,limits,engineLimits,
pins. format WHOLE_G_P139_SEGMENTS_V1; profile BUILD_TINY;
root LRC_P139_REPRODUCTION_075; domain {prime,divisor,target}; history
{wholeAttempts:4,wholeGrant:0,predecessorSha256:a1348524642b4fb77c046664b9df3d3ceaeba6029536397eed8ee0d24d422f32};
pins {producer,checker,host} fixed OWN file digests, no caller-provided source paths.
Future full profile is REFUSED, not accepted because metadata says approved.

Segment descriptor exact fields headerSha256,index,predecessor,payloadSha256,
payloadBytes,eventCount,startCursor,endCursor,tables,dataset,invocation.
tables sorted size entries {width,count,sha256,file}; dataset {width,count,sha256,
file} snapshot; names fixed host-generated basenames, no paths/links. Byte files
fixed width, strict lexicographic rows; tables DISTINCT support entries. Event
payload frames each u32 event length followed by exact event bytes, safe cuts
after complete effects. Descriptors bound actual producer tables/data snapshots,
checker separately compares bytes. Empty segments forbidden.

Commit exact keys headerSha256,index,predecessor,descriptorSha256,reservation,
start. SHA binds canonical commit bytes; genesis predecessor=header digest.
Segments indexed contiguous; no drop/replacement, orphan/duplicate/tail refuses.
Reservation unique create-only ID with pinned quotas/predecessor/type GENERATE or
VERIFY, full charge fsynced BEFORE START. Ledger derived from ALL reservations,
not a mutable self-reported total. Each started invocation has terminal receipt;
orphan reservation/start/missing receipt requires STOP/reconciliation, no retry.
Permanent charges include max bounded writes per invocation, its process time,
node/event budgets; all artifacts/failed staging count in disk/file high-water.

inspect_session is structural/accounting inspection and may report a SAVED
verdict, not fresh mathematical verification or a resume grant. advance always
performs newly charged independent prefix replay.

Host holds exclusive flock on retained dirfd, walks/rejects symlink dirs/nonregular
files, writes fd-relative O_EXCL/O_NOFOLLOW, fsync blobs/descriptor, publishes
create-only COMMIT last atomically (complete temporary+hardlink or equivalent
no-overwrite mechanism), fsync directory. Staging without commit not proof. Pin
OWN source bytes before load/spawn and after; no external code. Real subprocess
Popen shell=False, stdin bounded/DEVNULL as appropriate, six-flag exactfalse env,
bounded streaming pipes/time kill-wait-close; error cannot emit acceptance.

advance first verifies FULL committed tail from genesis in independent checker,
including files/exact cursors/pins/chain; then separate producer reconstruction
and append next segment, then checker replay before any final acceptance. Charge
each phase as its own invocation. Invalid captured tail stops; never discard it
or accept a saved verifier receipt as a replacement for replay. Generation commits
CAPTURED_UNACCEPTED; checker receipt PREFIX_VERIFIED_G_OPEN or tiny terminal
TINY_G_VERIFIED_CTB_OPEN only. WHOLE_G/J acceptance prohibited in current profile.

Crash fault points and exact filename/key refinements belong in Host report and
tests, may not weaken this contract. Fixed p139/no-grant CLI MUST refuse before
any Engine/search constructor. No automatic new campaign/attempt5/live/API/Git.
