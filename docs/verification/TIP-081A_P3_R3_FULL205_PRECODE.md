# R3 full205 serial runner — concrete source seam

2026-10-08 · SAME081D8 · SOURCE_ONLY / PRECODE_FOR_MAIN_FREEZE.

One prospective source: `tests/unit/private-summary-tip081-p3.r3.mjs`.
This document releases neither source authoring nor A/B. No imports, hashes,
parsers, generators, census, checks, tests or effects were run. R2/P2 stay intact.
Aggregate870882.767416/900000; P3remaining21440.727166; all205UNRUN,
accepted0/8, compileOFF, tuple authorityNOT_ISSUED,62OPEN and closureNOT_ACCEPTED.

Read scope: latest handoff/ACTIVE and CORE_INTEGRATION_COMPLETION; complete
TOOL_PRECODE, HARNESS_FREEZE, repaired BASELINE_FREEZE, BOUNDARY_EXPECTATIONS
SOURCE_RELEASE, original467-line test and current baseline/core source.
The original source remains the assertion predecessor, not an execution result.

## 1. Authorable boundary and dependency seam

Use one plain serial Node module, not Node--test, Vitest, Vite, configuration
discovery, setup, environment loading, worker or child spawning. Its only
application imports are the fixed versioned admission module and the two
already reviewed helpers:

`scripts/test/admit-private-summary-tip081-p3.r3.mjs` (still a proposed seam),
`scripts/test/metadata-baseline-tip081-p3.r3.mjs`,
`scripts/test/boundary-expectations-tip081-p3.r3.mjs`.

The fixed TOOL imports are node:assert/strict, node:fs, node:buffer,
node:crypto, node:perf_hooks, node:timers/promises and node:util (fatal UTF8
TextDecoder only). No installed package import. Helpers are imported, not
reimplemented. One baseline factory and one expectations factory per run.

Admission interface to freeze before code: existing zero-argument normal and
alias loaders; zero-argument kernel loader; existing three-text artifact
verifier; and a zero-argument trusted reviewed-context accessor. The accessor
must return a fixed frozen record of normalT, aliasT, kernelT, normal-fixture
Qp/Pp/five-family/private-call upper bounds, independently source-reconciled
`f();` Pp/Pr counter expectations, and four source-composition review receipts.
No caller path/options, runtime metadata, wire base, MODEL ledger or profile
flags supplies these values. Its naming/schema and implementation are Main's
concrete remaining admission dependency, not claimed present by this report.
The normal/alias namespaces retain exactly six product exports; context is a
TOOL module export, never a product export. Kernel retains its sole zero-arity
fixed export. The loader must bind reviewed context to issued exact tuples.

Proposed accessor name `readReviewedContextP3R3`, strict arity0. Closed root keys:
version,purpose,scope,status,normal,alias,kernel,fixtureProof,counterProof,
composition,tuples (11). Fixed version1/purposeTIP081_P3_R3_REVIEWED_TOOL_CONTEXT/
scopeTOOL_DATA_ONLY/statusREVIEWED_CONTEXT_BOUND. normal/alias/kernel each have
toolBytes,sourceCensusHash (2); toolBytes canonical nonnegative safe/cap-bounded,
sourceCensusHash lowercase64hex. tuples has normal/alias/kernel (3), each has
candidateBytes,candidateHash,inventoryBytes,inventoryHash,profileBytes,
profileHash (6); fixed files≤16777216 and canonical64hex. fixtureProof has
fixtureId,sourceUnits,Qp,Pp,nodeSchema,arrayBacking,derivedString,callFrame,
bookkeeping,privateCallDepth,maxToolBytes,proofHash (12). counterProof has
fixtureId,producerGrammarEntries,replayGrammarEntries,producerConstant,
finalConstant,proofHash (6), with fixed f4 constants525/1091 and exact source
entry expectations, not measured entries. composition is four ordered records
caseId,handSourceHash,emittedSourceHash,status (4), for the existing four SOURCE
rows only, statusSOURCE_REVIEWED. All records/arrays recursively null-sanitized
and frozen at trusted bootstrap. No accessors or caller-controlled objects.

The issued accessor must compare its tuple pins with the exact loader pins,
including emitted inventory census provenance; source/pin mismatches refuse
before imports. Before Main issuance, accessor refuses rather than returning a
fake T/proof/receipt. NOT_ISSUED literal source is an admission hold, not a mock
implementation of the successful path. Main approval of this proposed closed
schema and later literal issuance remain separate from product authority.

Driver dispatch is structurally OFF until that fixed context, tuple binding
and required composition receipts exist. Source preparation can use inert
placeholder literals plus an unconditional STOP guard; no fallback census.
Main decides the exact source release. A captures/derives inertly and returns
numerical census/full emitted text; independent/Main review follows; B checks
pins/context and only then imports targets. Actual T is required before B,
not before inert A or as an invented pre-code number.

For the normal21-unit fixture retain the source gate
`T <= 34649500 - Qp`, with Qp/Pp/family/private-call bounds supplied by the
closed source proof. Distinguish normal, alias and kernel T. Kernel context also
satisfies its reviewed `T <= 66797576`. Unknown physical time/RSS/native bytes
are not converted to logical T. Known G totals are not whole normal FIT.

Latest Main-reported repaired full-path numbers, awaiting the final source
receipt rather than independently asserted by this Tool document:
Qp1387262/Pp2165; five-family vector27680/75344/185070/172592/926576;
private-call upper25; corresponding maxT33262238. This supplies the prospective
normal21-unit context row after source proof freezes, not actual T or205 FIT.

## 2. Exact registry, grouping and ordering

Bind the complete literal suffix/input/assertion registry of TOOL_PRECODE §2–3
without generator discovery. Counts in P301..P336 order are:

`1,7,2,12,10,18,3,11,2,1,1,1,1,1,1,3,5,6,6,36,11,12,6,1,1,1,4,4,2,9,11,7,1,1,5,1`.

There are36 handlers and205 evidence rows:181 normal/input/admission,
20 component and4 composition-source. An entire assertion vector is the unit
of evidence, not an assertion call. Four source rows are SOURCE_REVIEWED, not
unit PASS. Each row has fixed ID, lane, group and dependencies; no TODO, omitted
variant, partial interpreter prefix, sampled loop or unexpected-refusal PASS.

Fresh ownership means each original fixture group/make, not each evidence row.
P302's seven probes share one valid normal owner; P304's arity probes share one
owner and must prove survival/touch0. P307 pair identity assertions bind both
contributing rows. P320/P32732-emission histories share their respective one
owner. A row is not finalized until group-wide postconditions and cleanup pass.
Original grouped dependencies are preserved, not silently split into fresh
owners. HARNESS_FREEZE's100-registration/224-read bound uses this grouping.

Run named `runP301` through `runP336`, serial ascending, each arity0. At P319
first perform the P329 kernel-extra-argument prerequisite, asserting the exact
ALLOCATION_COVERAGE_OPEN singleton before K/work. Then invoke the kernel ONCE,
journal the actual primitive output and call core.check ONCE. Its twenty fixed
case indices bind C16384/C16385, P126/P127/PNEG/P128, V equivalents and the ten
E cases in the reviewed core order. P319 closes only its two codec cases;
P321/P322 later close their eight/ten rows through that same raw-evidence span.
At P329 perform the second zero-argument ONE_SHOT refusal and close the earlier
bad-arity dependency. Never invoke a second valid kernel run or reorder handlers.

All original assertions map to H_REFUSE/H_STALE/H_DROP/H_SUM/H_POSITIVE and
the corrected baseline H_META. Preserve native promise fulfillment/rejection
discrimination. Five explicit Main L2 expectation repairs only:
IMPORT end18→17 for unchanged `import x from "m";`; undeclared MEMBER binding
NONE→NO_LOCAL_BINDING in P305.MEMBER_CALL/P306.OPTIONAL/P306.COMPUTED;
P306.COMPUTED CALL computedfalse→true. CALL bindingNONE stays as originally
required. The original impossible NaN checksum remains documented, never PASS.

P309.BASELINE_WITNESS remains the existing205th evidence row, including all
eight bad-M2 copies, wrong-domain/duplicate/tombstone/atomicity probes and the
immutable first-base/source-census provenance checks. No new denominator.

## 3. Prospective callable/local inventory

The following named functions replace dynamic per-assertion callbacks. A
private trusted operation record has exactly fn/args; argument arrays are fixed
literal vectors of0..6 elements. It is never exported or caller-created.
No function/object supplied by an adversarial test is treated as a TOOL callback.

| Function / arity | Closed prospective local bindings |
| --- | --- |
| driverInteger/1; slotFor/2; invoke/2; stale/2; site/8; checkArtifact/3; delay/1; operation/2 | none |
| make/5; makeUnobserved/5 | handle,slot |
| foreignAlias/0 | handle |
| drop/0 | index,slot,failed,first,retireCaught,forgetCaught |
| exactRefusal/2 | keys,codeDescriptor,flagDescriptor,valid,reflectionCaught |
| refusal/2; asyncRefusal/2; toolReject/1 | failed,first,caught,actualCode |
| metadata/3 | slot,record,previous,witnessValue,reconciliation |
| exactKeys/2 | keys,index |
| readSummary/1 | decoded,row,index,value,expectedSeal |
| utf16Hash/1 | bytes,index,hash,digest |
| seal/1 | ledger,sites,row,index,body,bodyText,hash,digest,sealed |
| positive/4 | handle,wire,summary,metadataValue,failed,first,cleanupCaught |
| mutateSummary/2 | index,row |
| changed/3 | handle,summary,wire,failed,first,cleanupCaught |
| mutateWire/2 | result,occurrence |
| readTuple/1 | paths,index,tuple |
| readFixedText/1 | fd,stats,bytes,offset,count,text,failed,first,readCaught,closeCaught |
| emit/3 | record,text,bytes,offset,count |
| beginRow/1; endGroup/1 | index,row |
| ensureKernel/0 | text,index,firstSequence,lastSequence |
| writeResult/1 | text,bytes,offset,count |
| closeJournal/0 | failed,first,caught |
| runSerial/0 | context,index,failed,first,caught,cleanupCaught,report |

This is34 named ordinary helpers, plus36 named handlers. Handler local scope
is a reviewed prospective ceiling of24 distinct bindings from this fixed pool:
handle,other,source,mode,cap,ttl,wire,summary,before,after,record,witnessValue,
expected,actual,index,row,tuple,descriptor,start,last,post,failed,first,caught.
Use the relevant subset, not dummy declarations to pretend an exact census.
Fixed adversarial callbacks are separately named/censused: foreignPhaseGetter/0,
foreignValueOf/0, proxyGet/0, proxyOwnKeys/0, parserGetter/0,
foreignToString/0, foreignFunction/0, candidateGetter/0, candidateToString/0,
candidateFunction/0, zeroNow/0. Their only permitted state mutation is a shared
primitive touch counter (zeroNow returns0); other unexpected calls increment
and throw a captured fixed Error. No unpriced anonymous mutation/test closures.

Actual authored params/locals/bootstrap allocations must be listed in its
source report and independently reconciled before A. These prospective TOOL
bindings are not product C02/T rows and do not claim exact actual source counts.
Any source inventory delta is explicitly reviewed by Main L2, not hidden.

## 4. Capture and state closure

Named captures, no mutable prototype calls during tests: cOk,cDeep;
cParse,cStringify; cKeys,cSetProto,cFreeze,cIs,cIsFrozen,cDescriptor,cPrototype,
cSymbols,cDefine; cSafe; cArray,cIsArray; cApply; cChar,cSlice,cReplace,cIncludes,
cIndexOf,cSplit,cRepeat; cRemove; cAlloc,cFrom,cUtf8,cWriteLE,cEquals,cBase64;
cHash,cNow,cSleep; cOpen,cStat,cRead,cWrite,cClose; cError,cProxy,cBoxedObject,
cTextDecoder,cDecode,cProcess,cStatIsFile. These are46 captures. Fixed fs flags
and module namespaces are separate startup bindings, not omitted native costs.
TextDecoder has one fixed fatal-UTF8 bootstrap instance/options and captured
decode; only fixed public TOOL text uses it. Current helper captures remain
unchanged. Cryptographic native contexts are trusted TOOL operations, distinct
from the private source product's pure SHA/captured primitives.

Private module state: normal/alias/kernel namespaces, reviewed context,
baseline/core, two owner slots,205 fixed row states,36 group states, one current
operation, touchCount, kernelChecked/raw span and bad-arity prerequisite flags,
journalFD/sequence/byte total, source receipts and one raw first-fault cell.
Each slot has handle,registered,lastMetadata,witnessValue. No historical handle
array, raw-journal array, factory per row or retained decoder graph.

Freeze TOOL row states to five scalar fields id,lane,status,group,dependency
(dependency is a fixed bit mask, not an arbitrary nested object), group states
to id,status,firstRow,rowCount (4), and owner slots to the four fields above.
The four source receipts are borrowed immutable reviewed-context records, not
generated from unit results. Each trusted operation allocates at most one
two-field record and one≤6-slot null-sanitized array, releases after invocation;
maximum1024 such operations/arrays per complete run, one live pair. No API args
array supplied by a foreign caller. Bounds are fixed STOP ceilings, not observed
run counts. Per-helper temporary key arrays are≤27(metadata),14(ledger),
11(summary),9(site),6(API),3(artifact tuple), or2(singleton); one at a time.

Foreign handles/domains use boolean-only primitive identity/type assertions
with fixed literal messages. No assert diagnostic receives a foreign object.
Product singleton inspection uses captured own-data descriptors and exact keys;
an accessor/proxy/native fault is not accepted as the requested refusal.
toolReject checks the fixed TOOL failure contract, separately from H_REFUSE.

Actual decoded H_SUM root11/ledger14/sites≤512×9 scalar fields are schema-checked
and null-sanitized, including arrays/records, BEFORE canonical stringify/seal.
Expected trusted site arrays/records are also null-sanitized/frozen before
deepStrictEqual; this prevents Node prototype mismatch without weakening field
equality. Never sanitize/reflect adversarial handles. Numeric fields are safe,
nonnegative and not−0; root/ledger/site exact key order and scalar types remain.
Normal literal expectations are not learned from output. Mutations use closed
labels for the existing variants; mutate then reseal all replay comparisons,
except the separately named gross-seal refusal. No arbitrary mutation callback.

## 5. Host/run bounds and metadata integration

Retain HARNESS_FREEZE's exact grouped table:105 create attempts,101 successful
creates (99normal,2alias),100 successful registrations (99normal,1alias);
102 register attempts,235 read attempts/224 successes,≤233 metadata JSON parses,
100 deletions/102 forget attempts,≤256 witness accesses,≤101 reconciliation
attempts. One WeakMap/WeakSet;100 cumulative weak tombstones, at most2 actual
owners and1 registered owner simultaneously. At most6 strongly retained
metadata records; at most2 live witness/reconciliation roots. The two-slot
capacity is not a two-tombstone lifetime bound. Reconcile only against reviewed
T, never infer T from an observation. The source-census assertion remains a
COMMON_MODE provenance comparison, not independent allocator authority.

Ordinary make performs M1 before analyze. P320/P32732-emission exceptions bind
their first EXISTING loop call, no extra observe. Source M1 is
summary12864/scratch6745432; M2 is25728/6732568. Producer wire with m prior META
has summary90656+12864m/scratch6667640−12864m. M1 wire103520/6654776;
M2 wire116384/6641912. P301/P309 histories use M2 wire then M3/M4/M5;
P322 M1 wire then M2/M3/M4. P320/P327 loop k1..32 uses summary12864k and
scratch6758296−12864k, k32=411648/6346648. All other per-ID histories and
100/224 grouping are exactly HARNESS_FREEZE; no observation after refusal.
Metadata helper atomically commits only after validated null-canonical text;
failed-M2 retries do not consume a fake emission in its private context.

Runner+core native SHA contexts≤164: normal-summary seals≤100,
mutant reseals≤24, literal UTF16 hashes≤36, core's four once-built MODEL hashes.
No extra hash for kernel raw journaling. Source literals≤64UTF16units;
LE buffer≤128bytes. Normal wire≤16384; MODEL pair16384/16385;
P336 enlarged wire≤32769. Strong MODEL pair retained once by core only.

Fixed artifact tuples are R3normal/alias/kernel, R2normal/alias and P2checked,
exact18 known files, never caller paths. `readTuple` accepts a closed selector,
not a path; max16 tuple acquisitions/48 file opens/96 fstats. Each file≤16777216;
one three-text tuple≤50331648 bytes plus one changed text; no18-file cache.
Own bounded regular-file/no-follow FD reads, strict UTF8, positive-progress and
read-close first-fault preservation precede use. Artifact-verifier native work
and loader bootstrap/import closure require their own source census/review;
these bounds do not make them zero-cost or certify physical memory. Normal
artifact-verifier calls≤29; three legitimate loader calls plus one extra-arity
negative. Never import mixed/tampered tuple bytes.

## 6. Raw evidence, first fault and terminal accounting

One create-only/no-follow fixed UNIT_RAW.jsonl journal and UNIT_RESULT.json
under docs/verification with the R3 literal names from TOOL_PRECODE. No overwrite,
retry, new path from JSON or driver process. Limit1024 records,4096 bytes/line,
1048576 cumulative bytes; every write checks positive progress. Base64 raw
chunks use≤512 bytes plus bounded fixed scalar headers; no Error inspection.
No raw[] accumulation. Successful terminal result has fixed scalar counts and
36/205 status arrays; unexpected failure records incomplete counts, not PASS.

The final15 ordered fields are version,purpose,status,requirementIds,
requiredRows,normalRequired,componentRequired,compositionRequired,
completedRows,unitPassedRows,sourceReviewedRows,failedRows,unfinishedRows,
groups,rows. The last two borrow the bounded36/205 state arrays; preceding
fields are scalar (fixed required counts36/205/181/20/4, actual completion/
failure counters). Maximum unitPassedRows201; never label four source rows
unit PASS. Require terminal canonical bytes≤131072 inside the existing
result-file cap, one encoding buffer, with no third output artifact.

Kernel text primitive/ASCII/UTF8≤16384 is journaled BEFORE core.check as at most
32×512-byte base64 chunks (each payload≤684 bytes), with fixed kernel-run ID,
sequence, offset and length. The driver performs NO extra kernel JSON.parse.
core.check validates the actual complete text and clears its graph. All twenty
component row records link that exact first/last raw sequence and fixed case
index; they do not echo an expected vector as an actual observation. Raw text
clears in finally after persistence/check. If persistence/check fails no
component row closes. Partial raw data survives as incomplete evidence.

Capture the first raw thrown value with a separate boolean presence marker,
even undefined/null/false. Every owner retirement, baseline forget, descriptor
restore and FD close is attempted in nested finally; secondary cleanup failure
never masks the first. On no primary fault, cleanup fault becomes primary.
Clear both slots, per-group wire/metadata/witness roots, operation arguments and
kernel raw aliases unconditionally. No product observation after revocation.
Journal fault metadata is fixed scalar phase/presence only; never stringify,
coerce, access getters or native-inspect the raw fault. Preserve the original
thrown value for the enclosing bounded supervisor's failure path. Terminal
success is committed only after group/owner cleanup; finally code does not
return over a failure. Output/journal faults use the same first-fault rule.

Four time-control groups retain captured real performance measurements and five
native sleeps40,600,600,1100,40=2380ms. Unit allowance6500 leaves4120 for all
imports/assertions/hash/parser/IO; actual time fit is UNKNOWN. No fake clock
except the original later host-now replacement test, restored exactly. No
renewal or rerun. Lint/type CLI descendant closure remains a separate pre-effect
STOP; this runner introduces zero subprocesses.

## 7. Main decisions remaining — not a generic no-code T loop

Concrete pre-code decisions are the versioned admission/context seam above,
normal source Qp/Pp/family/private-call closure and f4 exact counter literals,
plus Main/non-own acceptance of this full assertion/host/raw mapping. The fixed
runner helper roles, registry ordering and host bounds are authorable once Main
releases them. Actual source inventories may be reconciled after authoring
before A; actual numeric T is derived in A, reviewed with emitted/pins before B.
Full acceptance, effect dispatch,205 results and physical time are not supplied
by a source-only authoring decision. Retain approved A5500+B15000 ordering and
940.727166 margin; no added process or uncharged pin/read/artifact helper.
