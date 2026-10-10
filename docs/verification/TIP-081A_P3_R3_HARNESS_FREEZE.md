# P3 R3 serial harness — host and baseline integration freeze

2026-10-08 · SAME081D8 · SOURCE_ONLY / PRECODE_FOR_MAIN_NONOWN_REVIEW.
ONE document; no harness code, imports, hashes, parser/derivation/check/test or
other execution. Current milestone P3_SYNTHETIC_PRIVATE_SUMMARY_REPLAY remains
engineering. This closes the fixed port's host topology/read/retention proposal;
it does not close normal parser FIT or release full205 execution/source authoring.

Read complete original467-line tests/unit/private-summary-tip081-p3.test.ts,
complete575-line TOOL_PRECODE, repaired BASELINE_FREEZE and current250-line
metadata-baseline-tip081-p3.r3.mjs. Latest handoff/ACTIVE checkpoint and complete
R3_IMPLEMENTATION_COMPLETION were read. Old R2/P2 files remain unchanged.

## Registry and exact count convention

The FULL205 registry remains the literal TOOL_PRECODE registry:36 IDs,181 normal /
input/admission rows,20 component rows,4 source-composition rows. The row is its
entire assertion vector, not each assertion, handle, snapshot or cleanup check.
Joint original postconditions stay joint dependencies of their contributing rows.
No skip/TODO/early prefix is reported as full205. Original P319/P321/P322 replaced
experiments remain unrun predecessor history, not silently renamed successes.

Rows in one original control can share its owner, as the original test does;
fresh-owner helpers still create fresh owners per call. Serial execution never
interleaves owners across controls. The table fixes the complete successful-run
topology; any unexpected failure aborts the run and produces a smaller incomplete
prefix, never retries or allocates an extra owner to rescue the row.

TOOL_PRECODE section4's phrase "Fresh normal/alias ownership per scenario" is
ambiguous against that document's preserved original shared-owner assertions.
Explicit proposed Main L2 clarification: fresh owner per ORIGINAL FIXTURE GROUP,
not per assertion/evidence row. P302's shared normal owner survives all six
foreign handles; P304's shared valid owner survives all valid-handle arity
variants. Their final SOURCE_READY checks are mandatory joint dependencies of
every contributing row. The table100/224 is conditional on Main freezing this
clarification. If205 fresh-per-row owners are instead required,100 is NOT a valid
bound and this freeze must be revised before source release; no silent switch.

R=successful helper registrations; M=ordinary added M1 observations;
U=unobserved registrations whose FIRST EXISTING loop call binds M1;
V=successful product metadata results immediately accepted by baseline.read.

| ID | R | M | U | V | Owner / observation detail |
| --- | ---: | ---: | ---: | ---: | --- |
| P301 |1|1|0|5| original four observations remain after M1 |
| P302 |1|1|0|2| one shared normal owner; additional foreign alias owner unmanaged |
| P303 |2|2|0|2| retired and expiry owners; no read after refusal |
| P304 |1|1|0|2| one shared valid owner; three invalid creates never register |
| P305 |10|10|0|20| ten independent positive owners, verify metadata each |
| P306 |18|18|0|36| eighteen independent positive owners |
| P307 |3|3|0|6| three owners; original Unicode pair assertions preserved |
| P308 |11|11|0|11| ten raw-wire variants plus resealed wrong purpose |
| P309 |2|2|0|10| ADDITIVE and BASELINE_WITNESS, five observations each |
| P310 |2|2|0|4| premature owner then fresh empty owner |
| P311 |1|1|0|2| sole registered alias owner |
| P312 |1|1|0|3| summary and retired observations remain |
| P313 |1|1|0|2| verify metadata, then second verify refusal |
| P314 |1|1|0|1| changed omitted site |
| P315 |1|1|0|1| changed duplicate site |
| P316 |3|3|0|3| each original span mutation has fresh owner |
| P317 |5|5|0|5| each classification mutation has fresh owner |
| P318 |6|6|0|6| five resealed changes and gross seal |
| P319 |3|3|0|4| normal positive plus two input-boundary owners; no seed search |
| P320 |4|3|1|37| reference2, exact2, minus-one1, loop32 |
| P321 |1|1|0|2| normal positive only;20-component portion independent |
| P322 |1|1|0|4| source/summary/retired/verify counter snapshots |
| P323 |6|6|0|6| each arithmetic mutation has fresh owner |
| P324 |1|1|0|2| M1 plus original successful600ms observe |
| P325 |1|1|0|1| replay deadline refusal has no accepted metadata |
| P326 |1|1|0|1| M1 precedes performance.now replacement |
| P327 |4|3|1|36| syntax1, loop32, replay-error1, fresh2 |
| P328 |0|0|0|0| fixed artifact / loader checks |
| P329 |0|0|0|0| guard-removal / normal-no-kernel switch |
| P330 |0|0|0|0| nine artifact-verifier vectors |
| P331 |1|1|0|1| receipt-purpose changed owner only |
| P332 |0|0|0|0| fixed capture/domain authority vectors |
| P333 |1|1|0|2| private metadata positive |
| P334 |1|1|0|2| OPEN labels positive |
| P335 |4|4|0|4| four valid creates; UNKNOWN mode never registers |
| P336 |1|1|0|1| no salvage; all post-refusal calls stay refusals |
| TOTAL |100|98|2|224|99 normal registered,1 alias registered |

Exactly one reviewed baseline factory is called after the normal/alias admitted
identities are available. Its existing arities2/6/3/2/3/2 are unchanged. There
are101 successful product creates:99 normal and2 alias (P311 plus the unmanaged
P302 foreign alias). Four invalid create attempts (three P304 plus UNKNOWN mode)
make105 total product create attempts. All full-run success numbers are conditional
on every mandatory scenario completing; they are not observed counts or FIT.

At most TWO actual product owners coexist, only in P302. At most ONE registered
helper owner is live in this literal port (helper capacity remains two). Each
successful registration is a distinct opaque identity; WeakSet tombstones<=100
per run, WeakMap set calls100 and successful deletes100. No factory-per-owner,
retry/reset, list of old handles or domain API cloning is allowed.

## Helper read attempts and held census reconciliation

V224 means224 SUCCESSFUL reads, not all read attempts. BASELINE_WITNESS additionally
requires eight exact malformed M2 copies, repeated M1, wrong-domain read and a
post-forget read:11 deliberate rejected helper reads. Thus baseline.read attempts
are235, not232. The eight M2 mutations are missing summary,extra,RAW duplicate,
numeric string,RAW minus-zero,unsafe emission,wrong mode,total+peak plus one.
Wrong-domain and absent-context reads refuse before JSON parsing. Repeated M1
and eight copies reach decode: native metadata parse calls<=233, including224
successes plus9 rejected decoded attempts. Failed reads cannot update trackers.

Duplicate registration and post-forget registration add two rejected register
calls:102 attempts/100 successes. Wrong-domain forget and idempotent absent
forget add two calls:102 attempts/100 deletes. Post-forget witness/read/reconcile
must fail without state resurrection. Witness access has a fixed run ceiling256:
one per successful read224, plus<=32 explicit identity/failure assertions in the
single BASELINE_WITNESS vector. These do not add metadata emissions or rows.
WeakMap get operations are bounded by235 reads+256 witness+102 forget+101
reconcile=694; set100/delete100, WeakSet has102/add100. These are call-count
bounds, not opaque native byte/RSS allowances.

No numeric T is supplied now. The future full port compares each first-bound
witness once against separately Main-frozen source/initialization T for its own
normal or alias domain:<=100 successful reconcile records, plus the absent-context
negative call (<=101 attempts). Before that gate, successful reconcile calls0;
full205 acceptance stays held, with COMMON_MODE witness provenance unchanged.
T cannot be inferred from witness residual/wire base/current metadata. The helper
cannot authenticate supplied T provenance or mint domain/admission authority.

## Exact M history, stage assertions and expiry behavior

Every ordinary make registers and immediately performs the actual M1 observe /
baseline.read before analyze. No cached record replaces any original API call.
The eight-byte-category sum starts at the SAME immutable witness base throughout.
The original impossible baseBytes/NaN checksum is replaced explicitly, not marked
R2 PASS; the27-key product schema is unchanged. Each accepted metadata is typed,
ordered, null-sanitized/canonical/frozen by the reviewed helper before arithmetic.

M1 SOURCE_READY: parse0/work304440/summary12864/reserved25165824/live0/
scratch6745432/unreclaimed producer0/replay0; attempts0/entries257/sites0/pass0/
emissions1. M2 SOURCE_READY: summary25728/scratch6732568; unchanged total/base.
Each successful metadata costs one actual12864 transfer and one emission, not
an observation exemption. At wire time, with m prior successful metadata calls:
summaryBytes=90656+12864*m; scratchBytes=6667640−12864*m.

| Controls / pipeline | Wire history | Later successful metadata ordinal |
| --- | --- | --- |
| P301,P309.ADDITIVE,P309.BASELINE_WITNESS |M2:116384/6641912| summaryM3,retiredM4,verifyM5 |
| P305/306/307 positives,P313,P319.A_NORMAL,P321.A_NORMAL,P320 reference/exact,P333/P334 |M1:103520/6654776| verifyM2 |
| P310 premature |M1| summaryM2; verify refuses; fresh owner has M1 then original SOURCE_READY M2 |
| P311 alias |M1| retiredM2; verify ALIAS_REFUSED |
| P312 transfer |M1| summaryM2,retiredM3; second retire refuses |
| P322 monotone |M1| summaryM2,retiredM3,verifyM4 |
| Changed/refusal pipelines,P325,P335/P336 where applicable |M1| no accepted verify result |

Producer-only metadata after wire adds12864 each: summaryM2=116384, M3=129248,
M4=142112,M5=154976, with scratch6641912/6629048/6616184/6603320 respectively.
These are codec/META transfer snapshots, not fabricated parser/replay totals;
actual category/counter and retirement assertions remain separately mandatory.
Verifier scratch-bucket transfers retain rather than refund their prepaid charge.

P320 META01..32 and P327 META_EXHAUSTION use makeUnobserved: register but do NOT
add observe. Their first EXISTING loop result binds M1; every one of the32 actual
results is read/checked in order, retained only until its assertions/journal row.
33rd exact VERIFY_RESOURCE_REFUSED is never passed to baseline.read. Empty-source
loop summary12864*k/scratch6758296−12864*k; k32 gives411648/6346648. No33rd success.

Original deadlines/delays remain25/40,1000/(600+600),1000/1100,25/40. Captured
trusted performance measures actual raw inequalities; no Date/clock spoof or
invented elapsed number. M1 does NOT renew API TTL and is included in the held
unit6500 envelope. Failure of M1 before a short TTL is an incomplete control,
not a broadened expected refusal. No physical scheduling FIT is asserted.

The port additionally retains cross-stage total/peak/attempt/node/entry monotone
checks in its own lastMetadata tracking, not in the utility's once-base arithmetic.
P312 exact equality/transfer assertions and P322 source formula remain explicit;
do not replace either with a weak greater-than-only test. Normal Pp/Pr/five-family
and private-call bounds remain separate source obligations, not guessed here.

## Closed prospective runner helpers, state and native work

New runner remains tests/unit/private-summary-tip081-p3.r3.mjs, plain serial Node,
not --test/Vitest/Vite/esbuild. Imports only fixed .r3 admission and baseline
modules plus node:assert/strict,node:fs,node:crypto,node:perf_hooks,node:buffer,
node:timers/promises for the FOUR fixed sleeps (40,600+600,1100,40;2380ms total).
The repeat600 calls are one deadline control, so there are five timer invocations.
No installed dependency/config/setup/env discovery, dynamic caller path or worker.

Prospective helper arities are closed below; EVERY call uses the explicit argument
list rather than a caller-controlled defaults/options/fixture interface. These
are proposed runner functions, not claims that absent source already exists.

| Helper | Arity | Closed role |
| --- | ---: | --- |
| make |5| text,mode,cap,ttl,known domain; create/register/actual M1/read |
| makeUnobserved |5| same bindings, ONLY two explicit32-emission owners |
| foreignAlias |0| one unmanaged empty alias create in P302; no observe/register |
| drop |0| cleanup both fixed domain slots; no foreign callback |
| refusal |2| fixed trusted operation closure, literal expected code; actual throw discrimination/exact object/raw code |
| invoke |2| retained captured Reflect.apply, trusted function/fixed primitive or adversarial literal argument list |
| stale |2| actual same-handle known-domain observe AUTHORITY_REFUSED; no metadata read |
| metadata |3| handle,known domain,actual text; read+same witness+last-record monotonic checks |
| readSummary |1| bounded actual string; exact root/ledger/site keys and independent seal |
| utf16Hash |1| fixed source literal<=64units; independent LE-UTF16 Node crypto |
| seal |1| bounded sanitized decoded/model summary; ordered reconstruction, never product hash helper |
| site |8| exact literal site fields+fixed OPEN; no defaults learned from output |
| positive |4| literal text,mode,expected sites,optional literal N/null; full original positive vector |
| changed |3| closed trusted mutator,label,exact singleton code; fresh normal f(); reseal except gross seal |
| delay |1| captured native sleep; only the fixed timer list |
| emit |3| fixed row ID,event kind,bounded DATA projection; create-only incremental journal |
| runSerial |0| fixed36-handler order/literal205 registry; no discovery/parallel callback |

Two fixed null-prototype domain slots hold handle,registered,lastMetadata,witness
only (four fields each); domain identities are captured separately, never flags.
Unmanaged foreign alias uses the alias slot with registered=false. No arrays of
handles/errors/source leases. Parsed sanitized metadata strong retention<=6
records during the largest P309 vector (four stage records, current validation /
mutation temporaries); two slot references are aliases or included in that bound.
Witness/reconciliation live records<=2 each;<=100 of each ever constructed.
Exactly one weak map and one weak set,18 existing helper captures/eight bound
functions/seven factory-local method functions are allocated once per unit run.
Weak-table cumulative capacity100 identities is explicitly included, not2.

Native metadata inputs<=4096units/bytes;233 parses maximum, yielding temporary
JSON graphs bounded by those inputs; key arrays27 on accepted records (malformed
copies can have26/28), all freed from context. Temporary raw mutant text<=4096;
one at a time. Summary/wire schema input16384bytes/sites512, one decoded mutable
summary plus one independent ordered seal reconstruction at a time. Fixed model
expected wires are16384/16385; failed P336 input<=32769units (wire+16385 spaces).
No producer-base/search fixture, String.repeat over an unbounded argument or
metadata graph retained in private helper state.

H_SUM invocations<=100 (one per created registered owner); independent mutation
reseals<=24 (25 changed/seal scenarios minus gross seal); normal UTF16 helper
hashes<=36; MODEL body seals2/whole-wire digests2. Thus runner-owned native SHA
contexts<=164, sequentially at most1. UTF16 Buffer<=128bytes, every other hash
input is bounded public TOOL/model JSON, not private actual source. Loader /
artifact-verifier crypto contexts are a separate source closure, never silently
included in164: fixed normal artifact-verifier calls29, loader calls3 legitimate
plus1 extra-arity denial, with no other-domain import. Exact internal native hash
call/FD/input/capture costs must be reconciled from future loader source before
effects. Normal/alias/kernel loads occur once; kernel normal-domain promotion0.

Artifact DATA access uses only the18 fixed files: three each R3 normal, R3 alias,
R3 kernel, R2 normal, R2 alias, P2 checked tuple, in TOOL_PRECODE's exact names.
No filesystem prefix/glob/list supplied by JSON can add a path. At most one
three-text tuple is strongly held for a comparison: each file<=16777216bytes,
aggregate tuple<=50331648bytes; a single changed text is held only for its row.
Do not cache18 entire files or keep artifact strings in the205 result registry.
The generous existing TOOL bounds are NOT physical-memory/FIT guarantees; source
review must inventory decoder/buffer/string/hash coexistence before effects.

Raw output does not retain the original unbounded raw[] array. Preallocated205
small terminal-state slots and scalar counters accompany an incremental O_EXCL /
O_NOFOLLOW fixed UNIT_RAW journal. Emit limit1024 records, per-line4096bytes,
cumulative combined unit stdout/stderr/journal boundary1048576bytes (tool collector
still preserves raw stdout/stderr separately). Ordinary events use bounded scalar
projections<=512bytes; the eight baseline bad copies may use full bounded raw
text/base64<=4096bytes/line. No foreign handle/domain/error reflection in diagnostics.
Fixed refusal/outcome/label and raw byte/clock observations remain; no swallowed
primary fault or PASS-on-any-exception. Unexpected output/capture cap is STOP,
not permission to discard mandatory assertions or increase the envelope.

## First-fault cleanup and exact preservation / concrete blockers

After actual create, install its fixed slot BEFORE registration/M1 work so finally
can retire even if helper validation fails. Each registered owner is forgotten
in an inner unconditional finally after actual product retirement (only exact
already-revoked AUTHORITY_REFUSED tolerated). Clear slots/last metadata/witness /
local wire/summary/mutant roots. Preserve the first raw thrown value, including
null/undefined, with a separate failure-presence flag; a later cleanup/journal /
clock-descriptor restore fault is recorded separately and cannot replace it.
If cleanup fails without a prior failure, the whole row/run fails. P326 descriptor
restoration remains unconditional and may not turn a primary failure into PASS.

Every original assertion is mapped by TOOL_PRECODE, including exact refusal,
H_STALE/H_DROP, all literal site taxonomy/spans, UTF16/lone surrogate pair,
canonical resealing/mutation and OPEN/private/no-retry/export-key assertions.
Do not use opaque foreign values as assert actual/expected diagnostic arguments;
use primitive predicates with fixed literal messages. Product error comparison
retains the exact original two-field/prototype semantics, not a regex/code-only
test, and no product refusal is satisfied by helper/native AssertionError.

NEW original-source contradiction: P305.IMPORT literal `import x from "m";` has
17UTF16units while original assertion/TOOL_PRECODE said end18. Preserve that defect
explicitly. Do not change fixture text, quietly drop the span assertion or label18
correct. Main/Back named finish-semantics reconciliation must freeze the corrected
literal before that handler is authored; this is a specific port blocker, not a
new runtime criterion. Other assertions are not rewritten on this finding.

Full205 driver source remains held on this import-span reconciliation and normal
P321/P322 whole parser/family/private-call FIT/counter closure, plus Main/non-own
freeze. Actual T/census/body/emitted, CLI/process/source/preservation and effect
reservations remain distinct later gates. No broad claim that all source design
is impossible or needs renewed R3 approval follows from those exact blockers.

Narrow authoring route: Main may release the separate IO-free boundary-expectations
CORE after its exact Back contract/non-own review, independent of normal FIT. It
may construct frozen MODEL expectations/check actual UNIT_ONLY scalar JSON under
an explicit trusted T binding, but cannot load files, create normal owners, run
205 handlers or mint normal/alias results. This report neither releases that CORE
nor authors a second helper; await its named precode and Main source release.

All36/205UNRUN, accepted0/8, compileOFF/tuplesNOT_ISSUED;62OPEN/callergraphOPEN /
fullRuntimeClosureNOT_ACCEPTED unchanged. Aggregate870882.767416/900000ms;
P3remaining21440.727166, proposed20500NOTreserved; effects0/no budget reset.
