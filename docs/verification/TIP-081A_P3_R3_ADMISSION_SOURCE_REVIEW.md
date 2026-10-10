# P3 R3 fixed admission/context — independent actual-source review

2026-10-08 · SAME081D8 · SOURCE_REVIEWED / SOURCE_ONLY CLEAR.
Reviewer Front; author Ast. ONE full read of
`scripts/test/admit-private-summary-tip081-p3.r3.mjs`, corrected complete
ADMISSION_PRECODE and Main ADMISSION_SOURCE_RELEASE; ONE read of the subsequently
ready ADMISSION_SOURCE_REPORT reconciles the inventory below. No import, hash,
census, derive, parser, syntax/check/test, target/native effect or code edit.
Only this review receipt is authored. R2/P2 and unrelated changes are preserved.

## Verdict and preserved proposal history

No remaining concrete actual-source blocker found against this narrow release.
The first proposal snapshot displayed the obsolete kernel-loader name; the
author/Main corrected it while review messages crossed. That stale-snapshot
finding is preserved as proposal history, not a frozen-source or runtime
failure. The EOF-buffer prose repair also remains: one main exact-size Buffer
PLUS its separately priced one-byte probe. Actual source matches both repairs.

Five exact exports/arities: loadAdmittedSyntheticSummaryP3/0,
loadAliasFaultSyntheticSummaryP3/0, loadBoundaryKernelP3R3/0,
verifySyntheticSummaryArtifactP3/3, readReviewedContextP3R3/0. No sixth export,
caller path/selector/context/fault switch. Kernel domain is
TIP081_P3_BOUNDARY_KERNEL_UNIT_ONLY; composition IDs exactly P319.C_SOURCE,
P321.C_P2_LINK, P321.C_P3_CALLS, P322.C_COUNTER_CALLS.

## Actual source inventory, independently reconciled

| Named function | Params | Locals including catch bindings | Frame |
| --- | ---: | ---: | ---: |
| integer |1|0|80|
| hex |1|1|96|
| gate |2|6|192|
| utf8Size |2|4|160|
| hash |1|2|112|
| exactText |3|2|144|
| exactTuple |4|0|128|
| readFixed |2|13|304|
| moduleShape |2|5|176|
| fixedLoad |1|13|288|
| readReviewedContextP3R3 |0|0|64|
| verifySyntheticSummaryArtifactP3 |3|0|112|
| loadAdmittedSyntheticSummaryP3 |0|0|64|
| loadAliasFaultSyntheticSummaryP3 |0|0|64|
| loadBoundaryKernelP3R3 |0|0|64|

15 functions,22 parameters,46 local bindings. Under the approved TOOL formula
64+16*(params+locals), total is2048, not an inherited258 workspace multiplier.
No anonymous callback or dummy local is added. readFixed's caught/closeCaught
and fixedLoad's caught are counted. The actual acyclic graph includes helper
hash→hex, exactText→utf8Size/hash, fixedLoad→readFixed/moduleShape; native await
suspends the existing loader frames, not another generated owner frame.

Exactly20 capture bindings: cOpen,cStat,cRead,cClose,cFlags,cIsFile,cAlloc,cFrom,
cBase64,cHash,cHashUpdate,cHashDigest,cDecoder,cDecode,cChar,cSafe,cIs,cFreeze,
cSetProto,cKeys. Eight are bound native functions as reported. Static imports
are ONLY node:fs/node:buffer/node:crypto/node:util, ten named imported bindings.
Hash methods are captured from Hash.prototype without a bootstrap Hash instance.
Trusted clean TOOL bootstrap is explicit, not a target-owner privacy theorem.

Bootstrap: three five-field tuple records, nine three-field pin records,
two-field FAILURE, two-data-field decoder options (null prototype syntax is not
a data field):14 records/46 fields. Tuple/pin/FAILURE records are frozen; decoder
options are a private null-prototype constructor argument, not falsely called
frozen. One fixed fatal UTF8 decoder; three null API caches; contextnull.
Eleven frozen null-prototype arrays have lengths6,6,1,1,11,2,3,6,12,6,4:
58 slots. Logical convention rows1608 for arrays and1632 for literal records
reconcile the author report, not native heap or actual numerical owner T.

## Context, namespace and literal authority hold

All three source tuple statuses NOT_ISSUED, all nine pin bytes0/hashNOT_ISSUED,
ISSUED_CONTEXT=null. Correct public arity reaches a fast false gate before
context enumeration, FS/native hash/target import; wrong arity refuses earlier.
No successful context/T/receipt is invented. Standard-library imports and
bootstrap captures are not misreported as absent effects of a future import.

After separately reviewed issuance, gate checks all three domains, exact ordered
11-key root and nested schemas, byte/hash equality to fixed immutable pins,
sourceCensusHash===inventoryHash, correct statuses and all four receipts.
Normal/alias T<=33262238; kernel T<=66797576. Fixture upper1387262/2165 and its
five families/depth25 are distinct from exact f4 grammar715/715 with525/1091.
Registry IDs P321.A_NORMAL/P322.A_MONOTONE match Main's literal clarification.
Gate accepts no caller context; recursive frozen/null-prototype issued literals
and provenance remain the separately reviewed Main source-delta premise.
Shape/range/hash spelling checks alone do not prove receipt semantics or T.

Issued gate has15 sequential temporary cKeys arrays,76 total key slots, maximum
12 per array; finally drops its key/domain/pin/proof aliases. The approved serial
schedule's35 complete gates yields<=525 arrays. Unissued/extra-arity paths yield0.
These are schedule-scoped operation bounds, not a global caller invocation quota.

moduleShape checks namespace cardinality plus every required named function and
arity. For an ESM own-export namespace this establishes the exact export SET,
without incorrectly demanding insertion order. It builds frozen/null-prototype
APIs in the prescribed six-key order (kernel one key), never calls any export,
and commits the selected cache only after complete shape validation/freezing.

## FD, native work, first fault and retention

Nine literal internal pin identities only; positive canonical bounded bytes and
SHA64hex precede open. O_RDONLY|O_NOFOLLOW, first regular-file/exact-size fstat,
one exact Buffer, <=32768-byte positive-progress reads with a finite call limit,
separate one-byte EOF probe returning0, second dev/ino/size/mtime/ctime fstat,
hash and fatal UTF8 decode all precede import. ignoreBOM:true retains a BOM so
the valid UTF8 text re-encoding preserves the authenticated bytes. There is no
manifest/caller path, inventory evaluation or second-path candidate read.

readFixed's failed boolean preserves thrown null/undefined/false. Unconditional
close is attempted; its fault cannot replace an earlier selected failure, but
becomes first when alone. Public normalization occurs only after internal fault
selection/cleanup. No raw error property read, coercion or diagnostic discovery.
FD/buffer/stat/text/first aliases are cleared in finally, including probe failure.

exactText rejects nonprimitive values and unpaired surrogates, bounds UTF8 scalar
bytes before Buffer.from, and holds at most one file-bounded buffer/hash context.
Verifier returns false for all faults and performs no FS/import. fixedLoad hashes
the three FD buffers once, then bounds candidate Buffer2228288/base642971052/
28-unit prefix/data URI2971080 before target import. Inventory/profile stay DATA.
All file text/URI/namespace/API temporaries are cleared on success or failure;
only frozen APIs/context and unavoidable Node module records are retained.

Within the approved serial once-per-domain/no-retry full205 schedule, limits
reconcile:9opens/18fstats/9hashes/9decodes/9closes/1767reads; verifier29calls
<=87contexts; loader+verifier<=96, plus reviewed runner/core<=164 gives<=260.
Bootstrap hashes0. At most one main read buffer plus EOF1byte coexists; physical
native allocation/GC/RSS/time is not certified. Serial caches give<=3 successful
imports for that schedule, NOT a concurrent/global loader lock or import quota.
Native async promise/reaction counts remain schedule-scoped as the report says.

## Separate gates and stop

SOURCE_ONLY CLEAR is not syntax/type/runtime PASS, actual T/FIT, artifact pin
verification, issuance, full205 integration, math or caller-graph closure.
Fresh reserved inert A → full emitted/numeric-census/T/body/import/composition
review → Main literal context/pin issuance and recapture → separately reserved B
remains mandatory. Issued-context graph changes require their own inventory and
review. Full205 runner/tool/process/preservation gates are not cleared here.

All36/205 UNRUN,accepted0/8,compileOFF,tuplesNOT_ISSUED,62OPEN;
aggregate870882.767416/900000ms/P3remaining21440.727166ms unchanged.
Effects/reservations0; proposed20500 NOT reserved. STOP for Main handoff.
