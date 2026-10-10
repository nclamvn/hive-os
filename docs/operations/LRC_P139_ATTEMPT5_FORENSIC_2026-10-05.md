# Attempt5 — bounded read-only failure diagnosis

Date: 2026-10-05. SAME root LRC_P139_REPRODUCTION_075, REPRODUCTION, G only.
Status: DIAGNOSIS_COMPLETE / REPAIR_NOT_AUTHORIZED / EXECUTION_STOPPED.
This supplements, does not rewrite, the immutable runtime checkpoint
LRC_P139_ATTEMPT5_RUNTIME_2026-10-05.md, SHA-256
6cf38753f69f8369a98c536df5d0f4a821600c8dbadc205ed327743ef1cb20eb.
G/C/T/B remain OPEN0/4. No new mathematical result or paper refutation.

## Scope and direct approval

Human “tiếp” follows the explicit proposal to read only receipts and stderr,
at most4MiB/30s, accounted, without mathematics, retry, repair or evidence change.
This authorizes that specific diagnostic step, NOT another whole attempt or a
frozen-source mutation. Existing TIP-075E/resource/history stay immutable.
Vibecode Kit used for evidence-first diagnosis, not automatic implementation.
No reproduction, build or regression run needed to identify this code/evidence
inconsistency; such runs would not be authorized by the read-only envelope.

Read-only operator command used Python3.14 -I-S-B with a cooperative30s deadline,
precharged requested reads, total4MiB cap, fixed receipt indices1..32, per-receipt
65536B cap and only the first ERROR phase's stderr8192B cap. Every path component
opened directory/no-follow; files regular/currentUID/single-link/non-writable022,
bounded size, and pre/post stat identity,size,mtime,ctime matched. No directory
listing, metadata tree walk, event/spool/row reads, host import, math engine,
session inspect, file write or receipt/ledger modification. Regular-file reads
are bounded/cooperative; no hard OS latency/attestation claim.

The NEW separately approved diagnostic accounting is external to the frozen
attempt5 ledger and does not refund or alter its reserved quotas.

## Exact observed diagnostic accounting

- Requested read capacity charged BEFORE each read:77280B, including EOF probes.
- Actual bytes returned:6294B.
- Operator measured elapsed:0.009652s, below30s.
- Files read:five; evidence writes0; mathematical core starts0 in this diagnosis.
- Remaining read allowance was NOT spent or converted into a new invocation.

| File | Bytes returned | SHA-256 | Recorded result |
| --- | ---: | --- | --- |
| receipt-000001.json |409|f67751134aedfb215037256a75845b2c30237b61f5088e377faf6c0da103fa76|OK / AUDITED_CAPTURED_G_OPEN|
| receipt-000002.json |414|cd5b32c89e4bb2a66eecbf24cc563556b1efb7f4c2eae314707651e6a670ca12|OK / PREFIX_VERIFIED_G_OPEN|
| receipt-000003.json |422|3fa8d607b084eca8ada4ad22f306c65cdd2981d7732ef86230d438b67190dfb4|OK / CAPTURED_UNACCEPTED|
| receipt-000004.json |408|f0876c4e433eaa328b1d69b4a9f1a6c5092e7571d788caf9c47d3db059de50a7|ERROR / REFUSED|
| stderr-000004.bin |4641|cd92def75765d509b86b7c8d56c203f09caea663bb19b71eca6d3e7dcf38314e|VERIFY phase4 / host deadline|

Receipts were canonical JSON with matching indices. These are recorded host
results, not a fresh ledger/chain/mathematical replay. Reserve/start/header/commit/
descriptor/event/TABLE/UNION files were NOT read in this scope. Thus no fresh full
chain authentication or complete actual root/count determination is claimed.

GEN receipt3 records streamOut33603406B and written67208610B, CAPTURED_UNACCEPTED,
commitSHAc92166b3463c88d2c81fa90f46ee50ca897729c182c2aab7e38f636dae70b55f.
Do not call33603406B a pure event trace or an accepted certificate: it is the
recorded outgoing stream, including framing/control/rows. VERIFY receipt4
records streamIn37142365B, streamOut4641B (stderr), statusERROR. The independent
post-generation verification did not publish an accepted result.

## Cause established by actual stderr plus frozen source

The stderr startup context identifies actionVERIFY, phaseId4, attempt5 and the
same admitted grant/header/source pins. Its final stack is:

```text
worker: sources(io) at worker post source check
sources -> read_meta -> read_chunk -> io.charge -> io.tick
pinned075e_bound_worker.Refused: host deadline
```

Actual frozen host source
scripts/operations/capture-lrc-p139-generation-v5.py:

- line309: Io.__init__ unconditionally sets deadline to started+auditScanSeconds.
- line1123: worker creates Io(lim,'VERIFY'), without a worker deadline override.
- line1134: worker reconstructs/replays prefix through _worker_input.
- line1144: worker calculates cursor before result publication.
- line1151: post-source read triggers the deadline guard.
- line1152: accepted result output would occur only AFTER that read succeeds.

FULL auditScanSeconds is120, whereas processSeconds is660 and engine seconds600.
The independent checker separately enforces600 at its constructor/_tick, lines
232/278 of verify-lrc-p139-g-release.py. The worker's source-I/O context incorrectly
inherits the120s audit deadline across mathematical replay, so a valid-duration
worker can be rejected by its post-source guard. The observed exception is the
host120s guard, NOT a reported mathematical TIME/NODES/MEMORY error or wrong
event. The stack indicates replay returned to post-source code; it is not a
published accepted prefix or a completed whole-G verdict.

Hypotheses distinguished:

1. Host misassigned deadline: supported by actual stack and exact frozen code.
2. Mathematical engine cap exhausted: NOT reported by this stack; not the direct
   observed failure. No actual maximum RSS/node count/precise elapsed was sampled.
3. Invalid mathematical event/snapshot: NOT reported by this stack; this does not
   establish the complete409-root scientific target or accept missing output.

The previous215/215 tiny/fatal-mocked tests did not expose a full worker taking
more than120s but less than its approved660s bound. That QA gap is explicit;
passing those controls cannot be reused to dismiss this real failure.

## Narrow next proposal — not implemented

Correct deadline ownership in a separately reviewed source revision: audit keeps
its existing120s (full bootstrap restriction110s unchanged); worker source-I/O
uses the already approved660s process envelope; math engine remains600s. No
deadline refresh after replay, audit cap increase, disabled timeout or numeric
TOTAL expansion. Preserve tiny-profile restrictions and strict source fences.

Add mocked-clock regression controls crossing120s inside660s, with expired660s
still refused and source checks/engine600/audit deadlines retained. Tests should
not perform a600s whole mathematical computation. Contractor/Builder separation
and fresh source pins/review still required before any revised release.

Attempt5 ERROR ledger and frozen grant remain untouched. A corrected source is
NOT authorized under the old pin; changing pins in its grant or deleting the
ERROR receipt to resume would violate the accepted contract. Any replay of the
retained candidate requires separately reviewed command authority/recovery
design and direct human routing, not an automatic attempt6 or a second grant.
Do not generate again until deciding whether retained evidence can be lawfully
reused under such a design. Whole feasibility remains unknown.

## Scoped verification / stop

Requirements5/5: bounded read-only envelope; accounted reads; concrete phase/error;
frozen-source cause analysis; immutable history/no retry. These are diagnostic
checks, not5 fresh product tests. Scenarios5/5 observed; no repair verification
claimed. Technical health: no build/lint/QA/math replay executed (SKIP, notPASS),
all3 source SHA pins plus frozen Main review reread MATCH. Scope outcome READY
for a human repair/routing decision, NOT READY for a new scientific run.
STOP after diagnosis. No source/test/authority/evidence edit, no agent/live/API/
DB/browser/Git write/commit/push/billing/deploy. No additional evidence reads.
