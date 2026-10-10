# R3 artifact tooling — actual source handoff

STATUS: SOURCE_READY / SOURCE_FROZEN_FOR_NON_OWN_REVIEW. Builder report, not self-CLEAR.
All syntax/lint/type/unit/derivation/capture/hash/probe/import checks remain UNRUN.
No A/B effect, reservation, issued tuple, actual T census, parser invocation or
protected-root access was performed in this authoring work. P2/R2 and all existing
runtime/template/test assertions are unchanged. Vibecode Builder→Contractor
handoff applies; Main/Back/Ast must review the actual source before any effect.

## 1. Actual files and scope

Created exactly the five approved tool sources:

- `scripts/test/private-summary-tool-manifest-tip081-p3.r3.mjs`
- `scripts/test/capture-private-summary-tip081-p3.r3.mjs`
- `scripts/test/preserve-private-summary-tip081-p3.r3.mjs`
- `scripts/test/check-private-summary-tip081-p3.r3.mjs`
- `scripts/test/supervise-private-summary-tip081-p3.r3.mjs`

Also created `eslint-tip081-p3.r3.config.mjs` and
`eslint-tip081-p3.r3.suppressions.json` (literal `{}` plus POSIX newline, 3 bytes).
No sixth helper, shadow checkout, distDir, scratch project, install, or cleanup
deletion. Source writes used apply_patch; in-tool editorial assembly copied
reviewed literal tables and performed exact textual edits, not derivation.

## 2. Fixed manifest and matching

654 literal rows, six fields each, null-prototype/frozen records and arrays.
Ordered partitions are I57, H16, C16, P51, Prefix2, D447, suppression1, G9,
receipt1, E14, later-completion1, cache1, shadow37, existence1. No runtime discovery.
BASE_INPUTS590; PROBES39; G9 outputs; B accepted rows600. History16 raw bytes are
limited to 64MiB per scan BEFORE each main input-buffer allocation, independently
of the per-file16MiB ceiling. Prefix2 use predecessor length/hash, not equality of
the appended whole file. Suppression is immutable INPUT; cache is ABSENT.

The initial draft runner-before-tools CLI sequence and formatter end-append were
source findings, not executed failures. Current D447 follows Ast's exact table,
including JSON formatter at its table position. The fourteen lint/syntax hand
inputs are runtime, verifier, kernel, derive, admit, metadata, boundary, manifest,
capture, preserve, check, supervise, runner, eslint. Syntax then adds three
generated candidates; type roots12 exclude only raw runtime/kernel text. Ast owns
the independently authored type configuration/internal declarations.

Flat lint config has fixed basePath `/Users/os/hiveos` and fourteen exact relative
files. Four ERROR rules: no-dupe-args, no-dupe-keys, no-unreachable, valid-typeof.
No glob, plugin, processor, import, extends or config lookup. CLI still supplies
the fixed absolute paths, no-ignore/no-cache/no-fix/no-inline-config, concurrency
off, max-warnings0, exact JSON formatter, suppression path and absent cache path.
The original absolute-config-pattern premise was superseded BEFORE effects.

Readonly null-prototype tables are traversed by indexed loops. Native spawn gets
an explicit ordinary array of at most64 string arguments, each at most512 units;
there is no inherited iterator/map/slice/indexOf dependency on these tables.

## 3. Actual callable inventory

Below is a manual named-source inventory, not an executed AST/census. Arity means
declared formal count (defaults included), not JS Function.length. Native TOOL
frames are not charged to a product owner or misrepresented as product T.

| Module | Declared helpers and formal counts |
|---|---|
| manifest | 0 functions; literal DATA initialization only |
| capture, 38 named | cleanupDiagnostic1; fail1; integer2; hex1; beginPhase1; touch0; stage2; budgetSnapshot0; count1; rowIdentity1; utf8Size2; hashBytes1; readFixed3; decodeFixed1; probeFixed1; openOutput1; writeChunk2; finishOutput2; ownRecord1; exactRecord2; sanitizeParsed3; jsonSpace2; jsonString4; jsonValue4; parseData3; writeQuoted2; writeValue4; writeData2; writeFileData2; startCut2; writeCutRecord4; endCut1; faultData1; base64Chunk3; summaryValue3; summaryPart2; writeSummaryStdout1; captureAndDerive0 |
| preserve, 11 named | array2; validatePin1; validateProbe2; readBaseline0; comparePin2; compareProbe2; scan6; captureBaseline0; compareAfterA2; compareBeforeB4; compareAfterB1 |
| check, 19 named | str1; num1; rec2; arr1; appendLiteral2; exactArray2; eq2; eqNum2; sourcePin2; pinById2; validateContext2; renderContextLiteral2; renderTupleBlock2; uniqueAnchor2; reconstructIssuedSource4; readData2; precheck0; syntax1; postcheck1 |
| supervisor, 14 named | argvCopy1; journalRecord2; runChild5; its private latch1/clock0/killKnown0/finish0/abortChild0/receive2; lintResult1; captureResult1; closeJournal3; superviseCapture0; superviseCheck0 |

82 named declarations plus eight anonymous callback source sites inside runChild:
Promise executor1, spawn0, stdout1, stderr1, error1, close2, deadline0, settlement0.
No other dynamic function factory, target callback or target evaluation. Each
serial child creates this same finite closure group; no recursive controller.

Actual own storage is visible in the source, rather than dummy padding locals:

| Region | Own local/call storage and lifetime |
|---|---|
| readFixed | fd/before/after/bytes/probe/offset/reads/first/failed; size/wanted/maximumReads; request/n; sha256; catch/cleanup bindings. One source main buffer plus1-byte probe; fd closed and source/stat roots cleared in nested finally. |
| output primitives | open fd/hash/first/failed; Writer8 fields; write bytes/offset/end/calls/n; finish first/failed/cleanupFailed/cleanupFault/stat/sha256. Writer fd/hash/first cleared, close attempted exactly once even if touch/stat/size validation failed. |
| JSON preflight | pos/nodes state, bounded keys table and numeric/string scalar locals; recursion≤8 generic or≤6 receipt;≤20000 values;≤768 members per array/object. No parsed graph before full text preflight. |
| encoder | depth/nodes state, own descriptor/key/index/piece/end cells; quoted chunk≤1024 units, primitive stringify≤6146 units. File writer grows only after byte-cap check; stdout text/bytes/nodes state≤65536 before concat. |
| A orchestrator | first/failed/result/group/body/emitted/baseline/outputPins; preserve/derive namespaces; nine-loop writer/row/pin/fault locals; emittedPin/after/data. Group source strings cleared after persistence; graph roots cleared in finally. |
| preservation | pins/probes arrays≤600/39; scan read/text/admission/receipt/historyBytes; baseline comparisons; bounded row/pin/source-text locals. No retained multi-file source graph; no placeholder receipt or dummy firstCut witness. |
| precheck | seven clearable large roots firstCut/emittedCut/receiptValue/receiptRead/receiptText/original/issued; validated small pin/context/row tables. Read/source/receipt roots cleared on success and failure. |
| syntax | read/text/module plus fixed row/pin/index; one constructed SourceTextModule at a time, references cleared, link/evaluate0. V8's internal native retention is not asserted reclaimed. |
| runChild | started/endAt; collected buffer; child; deadline/settle timers; first;21-field ChildResult; finished/sequence/last/complete; six nested closures. Stream receive has now/bytes/prior/observed/offset/end; one child's closures/listeners/buffer/timers cleared before next. |
| A/B controllers | one journal, first/failed, resultAttempted; A child/result/ledgerAttempted; B accepted and≤6 records. Result/ledger attempts are create-once, not failure retries against existing paths. Roots cleared in finally. |

Named source cells above are not a fresh computed byte-size certificate for V8
stack/closures/native allocations. The finite recursion/coexistence bounds and
actual source/local census must be reconciled by non-own review, not inferred
from a successful lint/type setting or a fictitious function-cost cushion.

## 4. Captured natives and bootstrap

60 captured operation bindings by module: manifest2, capture33, preserve4,
check9, supervisor12. Capture additionally owns one fixed fatal UTF8 decoder;
this is an instance, not another callable capture. Trusted static module imports
are Node fs/buffer/crypto/util/perf_hooks/vm/child_process and the fixed five-tool
graph. No tool import alone opens a file, starts a child, imports a target, or
dispatches an effect. Static check import constructs closed receipt-schema DATA.

Explicit captured signatures now cover bound isFile/isSymbolicLink(Stats)→bool;
Buffer toString→string/subarray→Buffer/copy→number; Hash update→Hash/digest('hex')
→string; TextDecoder decode(Uint8Array)→string; string charCodeAt→number,
slice→string/indexOf→number; JSON.parse(string)→unknown and primitive-only
JSON.stringify→string. Own descriptor value is unknown, not an any-root graph.
Known native receivers/arguments are required by source guards. Real fs aliases,
spawn, timers, arithmetic and official Node/TS declarations remain actual natives.

File-URL import typing groups the EXACT original literal argument as string,
then narrows the fixed native namespace via REAL typeof import of the relative
preserve/derive MJS modules. This changes no URL or import ordering. Preserve
import follows capture initialization; deriver/TypeScript import follows complete
A first-cut/baseline persistence. No ambient URI stub/ignore/fake implementation.

Native crypto and Buffer views are TOOL-owned only. This is not product private
source-buffer exposure, a product ledger cost proof, or an immunity claim against
host tampering. Stock trusted host, stopped editing and reviewed fixed dependency
graph are explicit premises. Lint-only installed Acorn exception remains ONLY
within the fixed ESLint child; no A installed-Acorn/private-parser shortcut.

## 5. IO, descriptors, diagnostics, receipt

Inputs: internal manifest identity, O_RDONLY|O_NOFOLLOW, regular size1..row cap;
two fstats compare dev/ino/size/mtime/ctime; main buffer priced before allocation;
≤ceil(bytes/32768)+1 progress reads plus independent EOF1-byte probe. Exact bytes
hashed before fatal UTF8 decode. Suppression checked as `{}` newline. Prefix read
uses old length and probes EOF at actual current size, allowing only an unchanged
old prefix. Named lstat probes39 have no content/hash on absence.

Outputs: fixed row, O_EXCL|O_NOFOLLOW0600, pre-size/check before Buffer.from;
≤32768-byte chunks and≤2 positive-progress calls per chunk; incremental digest
of persisted bytes. Finish validates size, unconditionally closes, then returns
a complete pin only after close/digest success. Earlier opaque fault takes
precedence over separate cleanup fault; at most8 primitive cleanup diagnostics
are retained without raw object roots. Partial files remain incomplete—no delete,
overwrite, repair or repeat creation. The original fstat-before-close leak is
preserved as a repaired pre-effect finding, not a test failure.

Every newly obtained descriptor is null-sanitized BEFORE get/set/value field
reads. Parsed JSON graph is null-sanitized before schema reads/canonical work.
Receipt preflight checks decoded UTF16 surrogate pairing (including escaped
units), duplicate keys, forbidden escaped keys, exact ordered schema/cardinality,
safe canonical uint fields, limits and complete end-of-text BEFORE JSON.parse.
Generic numeric data permits bounded finite decimal timing/stat fields; receipt
schema forbids minus/fraction/exponent. No arbitrary caught-value reflection:
faultData only reports presence, typeof, bounded primitive, negativeZero and
rawObjectCaptured:false. The ENOENT descriptor inspection is confined to the
immediately caught exception from captured trusted native lstat, not a generic
foreign error lane; its fresh descriptor is sanitized first.

Receipt is read once in B-precheck and its same-FD pin reused in the B-before
600-row table; B-after rereads once. There is no four-state receipt-hash claim.
A baseline never contains an absent/not-yet-issued receipt. Initial first-cut
read is bound to the baseline firstCut pin, not just to untrusted cut fields.

Four fixed old source spans: NORMAL/ALIAS/KERNEL tuple starts and `\n});` ends;
the fourth WHOLE `const ISSUED_CONTEXT = null;` assignment with dedicated empty
end-anchor convention. Empty indexOf is never used. Each start occurs exactly
once; tuple end must be found; spans must be ordered/non-overlapping. Closed
validated literals render cFreeze/null-records/null-arrays; every growing source
concat checks remainder BEFORE growth. Whole reconstructed source must equal
Main's expectedIssuedLoaderText and actual B loader text. All nonissuance bytes
remain unchanged. Receipt/Main issuance is stopped-edit routing DATA, not host-
tamper cryptographic authority or a changed-loader hash magically granting T.

## 6. Exact logical read schedule and separated native work

Shared preservation scans:590+599+600+600=2389; three baseline/cut DATA rereads
and17 syntax rereads yield2409 shared input opens/hashes/closes and4818 fstats.
Four39-probe sweeps give156 lstats. Adding the G9/E14 output digest contexts
gives the planned2432 shared contexts; tight read bound1228651 or uniform1230695
comes from frozen D447 table. These numbers are NOT whole-process/native totals:
deriver's separately reviewed eight source rereads, its codec/hash/compiler work,
loader/runner IO, CLI dependency loads and actual output/write calls are separate
named inventories, not silently covered by2409 or product T. No scan ran.

Shared output caps remain file16MiB, source cut16MiB, raw/effect journal4MiB,
candidate/hand2228288, profile65536, receipt1MiB, child combined stdout+stderr1MiB.
Large source cuts stream one file at a time; if escaped complete source exceeds
16MiB, STOP rather than truncation or a partial cut presented as COMPLETE.

Controller retention: at most one child and two pipes; parent journal+transient
result output at most two output FDs. A child has at most cut+artifact output FDs
while one input may be read during baseline streaming. A stdout accumulation is
65536; lint accumulation1MiB; successful decode briefly also has an exact copy:
at most2×65536 /2×1048576 respectively, not a single-buffer theorem. Type/unit
accumulation0 (exact raw chunks still journaled). B children serial. Raw event fragments≤32768→base64≤43692 characters,
bounded record growth against4MiB before writes. No Buffer.concat/all-stream
array/lossy chunk decode. Event cap128 per child is a finite failure bound, not a
promise that arbitrarily fragmented native output will be accepted.

## 7. Fixed controller schedule and evidence honesty

Main launch executable `/usr/local/bin/node`, fixed cwd/clean parent launch and
child CLEAN_ENV exactly manifest literals; no PATH or process.execPath equality.
A one capture child; B in-process precheck/syntax, serial lint/type/unit children,
then postcheck. No worker/test framework/plugin/target expression execution.
No scope expansion or extra reservation/process. Fixed elapsed stages are A raw
2500/child2000/settle500; B500/350/750/1200/6500/500/200 under global10000.
Original global clock/deadline remains; stage transitions can enter cleanup
within the remaining GLOBAL envelope, never renew it. Native deadlines are
checked around work/events; timer delay uses remaining absolute child time.

Known positive PID/group only, SIGKILL once on first fault/deadline/cap; bounded
settlement timer, pipes destroyed after settlement and listeners/timers released.
FirstFaultPresent preserves false/null/undefined distinctly; no object callback
or string conversion. Combined stdout+stderr cap is restored BEFORE collection/
journaling (the initial separate-per-stream draft was a pre-effect finding).

Lint validates exact14-file SET without assuming formatter ordering, zero fatal/
error/warning/messages/suppressed messages. Syntax constructs17 modules without
link/evaluate. Type is actual strict/checkJs12-root configuration, not declaration-
only echo. Unit exit0 is recorded as exit0 from the reviewed205-assertion runner;
controller does not manufacture205 PASS counts or reread UNIT_RESULT outside the
frozen IO schedule. Main must inspect actual UNIT_RESULT evidence after B.

A alone creates EXECUTION_LEDGER once; B never reads/hashes/appends it. Current
field machineReservationAuthority:false states the actual distinction: Main owns
reservation; it does NOT falsely assert reserved:false. A/B partial result files
are not retried. Actual enclosing Main raw-clock/budget accounting remains
necessary; controller snapshots before its final write are not an enclosing
wall-time certificate. Late scheduling/blocked native work/close failure may
leave only partial evidence; no physical timing/RSS/GC fit theorem is claimed.

## 8. Remaining gates

Non-own full source + inventory review, lexical/type annotation reconciliation,
Main effect reservation, stopped-edit capture, actual A output/census/emitted-
source review, four-span receipt issuance, B-before exact source check, actual B
syntax/lint/type/unit/preservation evidence are all still mandatory. No current
source report grants any of them. Actual tooling/native/deadline/cut fit is
UNKNOWN until admissible effect evidence. Full runtime/caller graph remains OPEN.

## 9. Full own-local binding inventory for source review

Formal lists are the arity table in§3. Local cells below exclude formals/module
captures and include loop/catch cells. Repeated names in separate scopes are
listed twice; nested helper/anonymous bodies belong to their own row. This is
the actual author hand census, not an executed/source-AST census or byte hash.

| Capture helper | Own cells |
|---|---|
| cleanupDiagnostic; fail; integer; count; rowIdentity; ownRecord; writeData; writeCutRecord; base64Chunk | none |
| hex | i,c |
| beginPhase | start,limit |
| touch; stage | now |
| budgetSnapshot | now,cleanup,i |
| utf8Size | bytes,i,unit,low |
| hashBytes | hash,result |
| readFixed | fd,before,after,bytes,probe,offset,reads,first,failed,size,wanted,maximumReads,request,n,sha256,caught,cleanup |
| decodeFixed | text |
| probeFixed | stat,caught,d |
| openOutput | fd,hash,first,failed,caught,cleanup |
| writeChunk | bytes,offset,end,calls,n,caught |
| finishOutput | first,failed,cleanupFailed,cleanupFault,stat,caught,cleanup,sha256 |
| exactRecord | object,keys,i,d |
| sanitizeParsed | keys,i,d |
| jsonSpace | c |
| jsonString | result,units,pendingHigh,c,e,n,h |
| jsonValue | c,keys,key,i,child,end,count,end,start,digitStart,first,nonInteger,before,before,i,number |
| parseData | scan,value |
| writeQuoted | i,end,piece |
| writeValue | i,d,keys,i,d |
| writeFileData | writer,first,failed,pin,caught,cleanup |
| startCut | writer,caught |
| endCut | pin |
| faultData | primitive,truncation,sanitized,end,kind,i,unit |
| summaryValue | i,end,array,keys,length,i,key,d |
| summaryPart | bytes |
| writeSummaryStdout | bytes,state,offset,calls,end,n |
| captureAndDerive | first,failed,result,group,body,emitted,baseline,outputPins,preserve,derive,i,row,writer,writeFailed,writeFirst,pin,caught,cleanup,emittedPin,after,data,caught,cleanup |

| Preserve helper | Own cells |
|---|---|
| array; comparePin; compareProbe | none |
| validatePin | o,id,row,bytes |
| validateProbe | o,row,key |
| readBaseline | read,text,value,o,rawRows,rawProbes,rows,probes,i,pin,i,firstCut |
| scan | rows,probes,read,text,admission,receipt,historyBytes,total,i,row,expected,full,i,probe |
| captureBaseline | cut,first,failed,result,firstCut,baseline,caught,cleanup |
| compareAfterA | result |
| compareBeforeB | cut,first,failed,result,caught,cleanup |
| compareAfterB | rows,artifacts,i,i,baseline,read,result |

| Check helper | Own cells |
|---|---|
| str; num; rec; arr; appendLiteral; exactArray; eq; eqNum; postcheck | none |
| sourcePin | o |
| pinById | i |
| validateContext | o,tuples,i,name,domain,pins,f,p,composition,i,r |
| renderContextLiteral | output,i,d,keys,i,d |
| renderTupleBlock | output,i,pin,key |
| uniqueAnchor | at |
| reconstructIssuedSource | spans,changes,result,previous,i,start,end,r,at,stop,endAt |
| readData | read,text |
| precheck | firstCut,emittedCut,receiptValue,receiptRead,receiptText,original,issued,baseline,first,cuts,i,r,pin,emitted,artifacts,rawArtifacts,i,r,pin,receipt,pins,i,context |
| syntax | read,text,module,i,row,pin |

| Supervisor helper | Own cells |
|---|---|
| argvCopy | output,i,value |
| journalRecord; latch; abortChild; closeJournal | none |
| clock | now |
| killKnown; finish | caught |
| receive | bytes,prior,observed,now,offset,end,caught |
| runChild | started,endAt,collected,child,deadlineTimer,settleTimer,first,result,finished,sequence,last,complete,latch,clock,killKnown,finish,abortChild,receive,length,exact,caught |
| Promise executor | remaining,caught |
| spawn callback | caught |
| stdout/stderr/error/deadline callbacks | none |
| close callback | now,caught |
| settlement callback | caught |
| lintResult | value,i,matches,j,row |
| captureResult | value,o |
| superviseCapture | journal,first,failed,result,childResult,resultAttempted,ledgerAttempted,rawPin,snapshot,caught,cleanup,cleanup,cleanup |
| superviseCheck | journal,accepted,first,failed,resultAttempted,records,syntaxCount,lint,type,unit,after,rawPin,caught,cleanup,cleanup |

Finite host frame coexistence is constrained structurally: controller has one
serial runChild closure group, not four coexisting groups; event handlers enter
journal/encoder recursion only at≤8, receipt renderer/preflight at≤6, parsed
sanitizer at≤8. Native FS/crypto/codec/VM/compiler/CLI internals remain named host
premises, not invented local cells or measured V8 memory. An author local-cell
omission/typing discrepancy discovered by non-own review must be repaired before
effect; these tables cannot certify product allocator enforcement.

Final source-only repairs also give cProto its genuine identity-preserving
generic signature `<T>(value:T,prototype:object|null)=>T`; Object.setPrototypeOf's
native any return is not used to erase the typed manifest/schema graph. Descriptor
captures expose value as unknown. No native/type probe followed these comments.

## 10. Independent-review reporting repair — new frozen source cut

Ast's complete non-own four-tool review found one concrete§6 reporting gap in
the initial frozen cut: observed bytes were not distinguished from admitted/
retained/journaled bytes, CHUNK omitted observedByteCount/truncation, and a
1024-unit primitive diagnostic prefix was not labeled. This is a pre-effect
source finding; no failed runtime/check is claimed. Main L2 authorizes only this
reporting repair.82 named helpers/8 callback sites/60 capture aliases, two effects,
caps, schedules and criteria remain unchanged. No new helper or output path.

ChildResult now has21 fields (initial14-field source inventory is historical).
The seven new fields are observedStdoutBytes, observedStderrBytes,
journaledStdoutBytes, journaledStderrBytes, retainedStdoutBytes, rawTruncation,
rawScope. `stdoutBytes/stderrBytes` remain bytes admitted within the combined
1MiB cap; they are not claimed persisted. Delivered Buffer lengths are counted
BEFORE deadline/cap/copy/journaling refusal; no over-cap payload is copied, encoded
or stored. Combined observed arithmetic must remain safe. If the counter cannot
be advanced safely, the fixed scope explicitly says delivered-prefix/counter-
refused, not a complete total. Subsequent delivered callbacks after first fault
only advance safe observed counters and mark truncation, without retaining or
journaling further payloads; already released listeners cannot observe future
child emissions. This is delivered-event accounting, not all emitted bytes.

Journaled counts advance ONLY after an entire CHUNK JSONL record succeeds;
partial failed record bytes are not falsely counted as complete raw payload.
retainedStdoutBytes records the collection prefix copied before final release,
not live storage at return. Type/unit retain0. CHUNK records contain cumulative
combined observedByteCount, deliveredChunkBytes, truncation:false and an explicit
complete-payload-fragment scope. CLOSE records also carry observed/journaled/
retained counts, truncation and scope. Abort/uncaptured payload marks rawTruncation
true; FAILED/rawComplete:false and partial-file policy remain unchanged.

faultData remains opaque: no object property/descriptors/coercion. Diagnostic
records now have10 fields, including diagnosticScope/truncation/sanitized/
originalStringUnits. String prefix≤1024 UTF16 units; a pair crossing the cutoff
is not split, and any isolated surrogate inside the retained prefix is replaced
with U+FFFD and explicitly labeled sanitized. Unknown objects still have
primitive:null/rawObjectCaptured:false. No unbounded diagnostic/native hook.
Own-local changes: faultData adds truncation/sanitized/end/i/unit; receive adds
one observed numeric cell. Successful collected+exact copy co-existence is now
explicitly priced at≤2×65536 capture and≤2×1MiB lint, plus their decoded string;
source report no longer implies only one successful collection buffer.

SOURCE_READY / SOURCE_FROZEN_REPAIR_FOR_AST_TARGETED_REREAD. Everything UNRUN;
Main reservation, actual effect evidence and all runtime gates remain held.
