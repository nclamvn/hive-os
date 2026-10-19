# TIP-075D — concrete TOTAL contract proposal, NOT an execution grant

Status DRAFT_NOT_GRANTED. Fixed intended domain139/14/13, same root, history4;
proposed future whole campaigns1 (next attempt5), invocations32 including8 audits,
8 producer reconstruction/generation and16 independent checker replays;
segments8. No retries/refunds or history reset. All current runtime sources
statically disable p139; this contract cannot activate them.

The values below are finite refusal ceilings chosen for review, not derived
feasibility predictions. Human has approved IMPLEMENTING this contract, NOT
executing its quotas. Unknown whole cost remains UNKNOWN. Changing a cap/profile
requires a later explicit immutable revision and fresh source pins.

## Per semantic engine invocation / future full profile

Nodes20000000; events40000000; extensions1000000; aggregate retained unique
support-plus-UNION keys100000; logical cumulative trace+retained rawbytes268435456;
cooperatively accounted workingmemory536870912; engineSeconds600. Every
reconstruction/replay starts counters atgenesis and charges its FULL reservation;
there is no new-work-only quota. Support transfer is not doublecounted; samekey
in separate support and UNION containers counts twice. Sort/snapshot/hashing is
inside engine deadlines and memory, not a free operation. Root/footer/supportIndex
overflow refuses, no source expected row/node count used.

## Per host phase

| Dimension | HOST_AUDIT | VERIFY / GENERATE |
| --- | ---: | ---: |
| readBytes (incl metadata, pins, blob hashes, replays) | 1073741824 | 1073741824 |
| writtenBytes (all staging/spool/publication/error files) | 83886080 | 83886080 |
| streamInBytes | 0 | 536870912 |
| streamOutBytes | 0 | 37748736 |
| permanently reserved seconds | 132 | 672 |
| files (including staging/orphans) | 46 | 46 |

Audit cooperative host scan deadline120s plus12s terminal allowance. Child hard
wall660s, host publication10s and cleanup2s; engine deadline600s remains inside
it. No hard fsync/RSS claim. Metadata bootstrap before reservation is limited to
bounded ledger/file-count/type checks; large blob reads/hash/rows need AUDIT or
child phase reservation. All actual I/O is charged against phase caps BEFORE read/
write; every fullphase quota permanently charged before START regardless actual
cost. No growing prefix processed for free by inspect or accounting.

## TOTAL / high-water / transport

TOTAL hostReadBytes34359738368, writtenBytes2684420096,
streamInBytes12884901888, streamOutBytes905969664,
seconds17184 (=8*132+24*672), reservedFiles1473 (=1+32*46).
Producer pool8invocations/nodes160000000/events320000000/extensions8000000/
engineSeconds4800; checker pool16invocations/nodes320000000/events640000000/
extensions16000000/engineSeconds9600. Separate host/audit seconds1056,
child hardwall allowances15840, hostpublication/cleanup288 are included in17184.

SegmentBytes33554432; chunkBytes65536; metadataBytes65536; stderrBytes8192;
liveBytes3221225472; files4096; bounded retained file inventory before append,
openDescriptors16 maximum; host cooperative memory134217728. Only one child
at a time: declared concurrent engine+host working allowances671088640, NOT
measured interpreter RSS or OS containment. Snapshots are written persegment,
no silent sharedblob/hardlink reuse. Retained engine rows capped; no unbounded
external-sort feature promised. All stream/snapshot/read/write overhead included.

TOTAL writtenBytes includes a separate65536-byte genesis metadata allowance;
reservedFiles includes its one header file. All subsequent phase reservations
still charge their complete quotas. These TOTALs conservatively cover the full
allowed phase quotas plus genesis. An admission
may stop sooner on any local cap; exhaustion means NOT_ESTABLISHED, never G-empty.
Eight segments are a budget, not a claim all409 roots fit. Generation muststart
fromgenesis; diagnostic298 has no certified prefix. No automatic capincrease.

## BUILD_TINY executable profile

Pure engine075C defaults unchanged: nodes100000/events200000/extensions50000/
rows10000/bytes2097152/memory67108864/seconds10. Host phase pattern AUDIT,
VERIFY, GENERATE, VERIFY. Tiny max128 invocations /32 audits/32 producer/64
checker /32segments; perchild hardwall20, peraudit cooperative10; permanent
auditSeconds22, childSeconds32; TOTALseconds3776 (=32*22+96*32).
Tiny perphase readBytes16777216, writtenBytes8388608, files46;
perchild streamInBytes16777216/streamOutBytes4194304, segmentBytes65536;
TOTALreadBytes2147483648/writtenBytes1073807360/streamInBytes1610612736/
streamOutBytes402653184/reservedFiles5889 (=1+128*46); liveBytes134217728,
files8192, metadata65536/chunk65536/stderr8192/openDescriptors16/hostmemory67108864.
Separate producer32*engine quotas/checker64*engine quotas permanently charged.
Callers may LOWER host/engine profile limits only; exact typed canonical schema.
These are test profile bounds, not numerical authority for139. Tests external120s,
allfreshQA600s. Tiny profile values may refuse late/long prefixes; no falsewholegrant.
