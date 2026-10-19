# TIP-075D — fixed streaming wire and module APIs

BUILD_ONLY. Preserve075C logical event grammar/prologue/cursor exactly; change
transport/sessionformat to WHOLE_G_P139_STREAM_V2. No v3session migration.
Math scopes BUILD_TINY or declared P139_RELEASE_DISABLED. All three sources
have independent P139_EXECUTION_ENABLED=False gates before clock/Budget/masks/
streams/files; no argument/token/header/limits can override compiled denial.
This applies to public profile/core/session admission. A private framed worker
must first read its mandatory bounded inert CONTROL to identify an untrusted
header; it refuses a disabled profile before source compilation, prefix payload
consumption or semantic engine construction. That CONTROL preflight is not a
139 computation or session admission. No whole execution path is opened.
Future release needs a new authorized source revision/pins, not metadataedit.

## Pure modules / bounded snapshots

Producer Engine(prime,divisor,target,limits=None,profile='BUILD_TINY'), existing
next_event/cursor/tables/dataset. New iter_table_rows(size), iter_dataset_rows(),
return actual fixed-width bytes perrow. Snapshot captures event-count fence on
API CALL (not deferred firstnext); any later next_event changesfence and rejects
iterator. Poison on mismatch/I/O/allocation/time/refusal, close/release bounded
sort workspace in generatorfinally. Emptytable yields none. No snapshot iterator
implemented through dataset()/tables() rawcopy. Precharge sorted pointerlist and
row conversion beforeallocating; time poll eachrow and aftersort/hash. Semantic
sets/compact finalized supports capped, no disk-run/sharedoracle helper.
Cursor hashes current sorted DISTINCT tables/UNION by row iteration. Cache at
same event-count cut OPTIONAL, explicitmemory/accounting/invalidation required.
Repeated fullsort/hash still charged to engine time/memory, not O(1) claim.

Checker Verifier sameprofile/feed/cursor/tinycompat tables/dataset/finish.
OWN scalar/SET derivations, no import/exec producer/host/test/shared semantics.
Add own iter_table_rows(size), iter_dataset_rows() with same fence/poison/bounds,
compare_snapshot(tables:dict[str,iterator[bytes]],dataset:iterator[bytes]): exact
tablekeys and independent stream row equality to BOTH EOF; enforcebytes type,
width/range/sort/DISTINCT andsupportDISTINCTentries (finalrows multiplicity allowed).
Streams may be lazy protocol readers. Snapshot verified marker only after ALL
equality/EOF checks at current event count; feed invalidates it. finish_verified()
requires TERMINAL AND sameeventcount verifiedmarker; returns exact075C tiny
status/semanticVerified/wholeGrant0/wholeAttempts4/rows. Bad final/finish/snapshot
permanentlypoisons, no caught-error recovery. Never adopt supplied rows as state.
Streaming marker is a local pinned-process state, not a saved receipt authority.

Both provide profile_spec(profile='BUILD_TINY') returning a defensive inert
declaration of domain/bounds/disabledstatus/rootcounts (for139static409 only).
Exact declaration keys: profile,domain,bounds,executionEnabled,rootCounts,
wholeAttempts,wholeGrant. Tiny domain ranges prime[3,23]/divisor[2,24]/target[1,5],
rootCountsnull. Disabled full domain exact prime139/divisor14/target13,
rootCounts[1,36,126,126,84,36], executionEnabledfalse. Both history4/grant0.
Whole core may contain fixed139 branches, but never constructed/tested thisturn.
Unknownprofile/falsealiases/raisedcaps/unknownkeys reject. Default CLIs deny.

## Binary transport

Inputmagic b'LRC139S2\n'; outputmagic b'LRC139O2\n'. Everyframe is tag(u8),
length(u64 littleendian), exactbody. Metadata<=65536 canonicalASCII JSON with
exact keys, unique keys, strict types/no boolintaliases/nonfinite/depthoverflow;
preparsememory/depth/token bound. Rawblob may be larger thanchunk, but readers
use requested bounded reads<=65536, framing can split anywhere. No base64,
paths, code, serialized engine state, unbounded read/wholeprefixbody.

Input sequence:
1 CONTROL JSON exactkeys header,action,maxEvents,cursor. action VERIFY or
GENERATE; verify maxEvents0/cursorNone; GEN positiveboundedmaxEvents/exactcursor.
Then0..boundedsegments each:
2 COMMIT JSON,3 DESCRIPTOR JSON (same075C keys/bindings, newheaderformat).
4 EVENTS rawpayload (u32 length+event frames), SHA/length/count exactdescriptor.
5 TABLE raw perdescriptor tablekey in ascending NUMERIC size order, rowwidth
andcount exact;6 DATA raw fixedtargetwidth;7 SEGMENT_END zero length.
8 STREAM_END canonicalJSON exactkeys segments,tail,headerSha256, thenmandatoryEOF.
No unknown/extra/reorder/tag/trailing bytes. Child independently checks header/
profile/pins/history, contiguous index/predecessor/descriptor digest/payloadhash,
derived start/end cursor and allrows. Worker relies on hostledger authentication,
is not a standalone authority for arbitrary ledger JSON. ALL prefix events fed
fromgenesis on eachchild; GEN independently reconstructs beforefreshcursorcompare.

Output VERIFY:1 CONTROL JSON {cursor,verdict},8 RESULT_END zero length, EOF.
Output GEN:1 CONTROL JSON {startCursor,endCursor,tables,dataset}; tables maps
size->{width,count,sha256}, dataset->{width,count,sha256}. Then4 EVENTS payload,
5 TABLE raws ascendingnumericsize,6 DATA raw,8 RESULT_END zero length, EOF.
Host-generated filenames only; no childfilepath. Cursor derivesallhashes/counts.
Worker buffers AT MOST ONE bounded outgoing eventsegment with prechargedspace,
notprefix. Stop BEFORE nextevent if remainingpayload<46B (4+maxlogicalevent42),
so no applied-butunpublishedcut. NonemptyGEN only; maxEvents may stop earlier.
Tables/data emitted by genuine rowiterators, not copies. Resultcontrolandallraw
framing/payload hash/rows independently validated byparent beforecommit.

## Durable host / contract APIs

create_session(directory,domain,limits=None,profile='BUILD_TINY'); advance(directory,
max_events=32); inspect_session(directory); proposed_contract() returns defensive
DRAFT_NOT_GRANTED full139 planning declaration matchingRESOURCEdoc, not token.
Exact proposed_contract keys: status,profile,domain,root,wholeAttempts,wholeGrant,
campaigns,nextWholeAttempt,limits,engineLimits,concurrentWorkingMemory; values
DRAFT_NOT_GRANTED/P139_RELEASE_DISABLED, fixed139/14/13, SAME root, history4/
grant0/campaigns1/nextWholeAttempt5, full declared flat limits/engine caps,
concurrentWorkingMemory671088640. Pure deep copy, not authority.
Hostlimits flat exactkeys, lower-only; engine profiledefaults fixed inheader.
Exact flat host keys: invocations,auditInvocations,producerInvocations,
checkerInvocations,segments; producerNodes,producerEvents,producerExtensions,
producerEngineSeconds,checkerNodes,checkerEvents,checkerExtensions,
checkerEngineSeconds; totalReadBytes,totalWrittenBytes,totalStreamInBytes,
totalStreamOutBytes,totalSeconds,reservedFiles; auditReadBytes,auditWrittenBytes,
auditSeconds,auditScanSeconds,childReadBytes,childWrittenBytes,childSeconds,
processSeconds,streamInBytes,streamOutBytes,phaseFiles,liveBytes,files,
metadataBytes,chunkBytes,segmentBytes,stderrBytes,openDescriptors,memory.
Integers reject bool; seconds finite strict int/float. Lowered auditSeconds must
still cover auditScanSeconds+12, childSeconds must cover processSeconds+12.
Pure engines permit lower-only engine limits; host session engine defaults are
fixed. Caller host limits cannot alter the engine header. Genesis write allowance
65536 and one reserved file are separate from complete phase reservations.
Sessionheader exactformat/profile/root/domain/history/limits/engineLimits/pins;
history{wholeAttempts:4,wholeGrant:0,predecessorSha256:
217322cfb4972a74122e833ebb01bb9df0ee02d4565339fdcacd1a094274ba66}.
No p139session files/header/starts orconstructor underthisBUILD.

Header/ledgerbootstrap bounds filesize/count/metadata/types BEFOREexpensive work.
Use scandir incrementalfilelimit/prechargedinventory, not listdir thencheck.
Retain onlybounded filenameinventory +ONE currentdescriptor/chain tail/totals;
never listofallpayloads/tables/rawsegments. Stream rawfiles via retained safe
dirfd andoneblobfd, no follow/link/nonregular; incrementalhash/strictrows.
Metadata body andmaxsemanticrowstate separatelybounded, no wholeprefixJSON.

New ordinary phase pattern: HOST_AUDIT -> VERIFY -> GENERATE -> VERIFY. Reserve
FULL perphase quota uniquely/create-only/fsynced BEFORESTART. Audit is actual
host work validating ALL blobhashes/lengths/sortedrows/chain fromgenesis, separately
charged, nochild. Laterphase streams also chargeallactualread/write/streambytes.
Resourcecounter exactschema includes audit/producer/checker invocations/nodes/
events/extensions/engineSeconds; totalreadBytes/writtenBytes/streamInBytes/
streamOutBytes/seconds/files, segments; perphase caps boundactualI/O BEFOREeffects.
Metadatabootstrap allowance itself bounded/accounted inhostphase; no freeblobscan.

Reservations retain exact id/type/predecessor/quota/header binding, START and
terminalreceipt; immutable commit/descriptor schema075C.
New075D receipt adds exact chargedIo object with keys readBytes,writtenBytes,
streamInBytes,streamOutBytes,files, each strict integer<=phase cap. These are
conservative before-effect I/O charges: fixed worst-case child-source read budget
may exceed measured bytes. Never label them measured cost or refund/rebase the
permanently reserved quotas from them.075C receipts remain immutable.
Segment invocations are actualGEN ids (first3), notoldv3phase ids. Perphase expectedtype modulo4,
allfailed/orphanstarts STOP/no refunds. SuccessfulGENreceipt with no startednext
VERIFY is phase3 recovery: newlycharged VERIFYonly, noGEN. Otherpartialphases
or missing/errorreceipt refuse. Unknown/invalidtail preserved, never rollback.

inspect_session does ONLYboundedmetadata/ledger/inventory/header/pin checks, no
largeblobreads/hash/rowsearch andNO fresh semanticverdict. Reports
semanticVerifiedFalse,lastRecordedVerdict,metadataOnlyTrue,blobIntegrityVerifiedFalse
plus history/totals. It does not quietly starta freeHOST_AUDIT.

Parent real Popen -I-S-B shellFalse executesSAME boundedhashverified OWN hostbody
via-c, no Pythonpath reread; worker compilesonlysameverifiedOWN producer ORchecker.
Boundednonblockingstdin iterator simultaneousstdout/stderr drain, sourcebefore/
afterpins, exactsixfalse childenv. Stdoutspool create-only/fsynced inownsession,
charge ALLspool/staging/error bytes/files, preserve evidence; parse it streaming
afterchildexit0/no stderr. No communicate/readall/subprocess.run inputbuffer.
Fault/timeout/unreapedwait closesallpipes/selector, no acceptedpositive result;
one2s cleanupwait. Checkcooperative host deadlinebeforepublication/verdict.
Pipe read requests are bounded by remaining output/stderr quota before allocation.
When exhausted, only a one-byte EOF probe is permitted and charged as readBytes;
nonempty probe refuses, never becomes accepted/captured output. Cleanup attempts
every remaining resource even when a selector/pipe/fsync close operation fails;
any cleanup failure prevents a positive result.

BoundActualIo counters include metadata/source/bootstrap reads, streamedblob reads,
spool writes andpublication, notonly logicaldata. Hostmemory/FD/chunk/storage/
source/frame bounds explicitly enforced. Filesystemfsync/RSS remainscooperative,
not hardOS containment/hostileprivilegedFS attestation. Reconciliationnotfree.
Parent and worker transport share ONE host-memory allowance, not an extra host
allowance per process. Before child/payload allocation, conservatively require
parentUpper+workerUpper<=memory, where parentUpper=inventoryBytes+
128*metadataBytes+6*131072+2*chunkBytes+8388608 and workerUpper=
128*metadataBytes+6*131072+2*segmentBytes+2*chunkBytes+8388608.
inventoryBytes conservatively bounds two bounded filename sets; semantic engine
has its separate fixed working allowance. Over-budget configuration refuses,
no implicit raise. These are cooperative workspace checks, not measured RSS.

## Acceptance / future fullprofile

Smallcontrols exercise exactlythisprotocol andresourceledger. Full139 constructor/
masks/replay forbidden; numbers and static409 declaration tested without it.
Allcurrentwholeverdicts impossible: onlyPREFIX_VERIFIED_G_OPEN or
TINY_G_VERIFIED_CTB_OPEN. Error/missingEOF/incorrectstreamhash/extrarow cannot
accept. ProfileDRAFT is notanexecutionpermit; source37/liveauth/lease/replay/G2
gates remainSOURCE_REFUSED. Fourhistoricalattemptsneverreset; actualwhole5requires
separatelyapprovedlaterrelease/sourcepin/envelope revision. No UI/DB/API/Gitwrites.
