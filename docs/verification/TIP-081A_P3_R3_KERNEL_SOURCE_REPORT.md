# P3 R3 fixed kernel — handwritten source handoff

2026-10-08 · SAME081D8 · Back Builder · SOURCE_READY, NOT SELF-CLEARED.

New artifact: `scripts/test/private-summary-kernel-tip081-p3.r3.mjs`.
Authored under the complete KERNEL_SOURCE_RELEASE and repaired KERNEL_FREEZE.
This is a lexical template for future fixed offline admission, NEVER a standalone
import. Exact static/workspace constants must be supplied by that later reviewed
tool. Compile constant remains false. No generator/import/parser/hash/syntax/
type/lint/unit/runtime/network/Git effect occurred; no source pins or actual T
were measured. R2/P2 and both normal R3 copies were not changed.

## Actual source layout and retained bodies

Plain-text source readback gives these named anchors (one-based lines):

| Kernel source | Origin and disposition |
| --- | --- |
| 5–120 | Fixed perf_hooks/util/buffer imports; original primitive captures, error tables, descriptor sanitization, two independent SHA tables |
| 49–51,121–141 | Original P2 integer/refuse/timed/plus/product bodies |
| 143–243 | Original P3 u8View/error/dispose/abort/touch/add/mul, real producer depth and entry guards, counters/debit/consume/commonReserve |
| 245–372 | Original put/raw/string/unsigned/field/rotate/producer SHA/ledgerField/encodeSummary bodies |
| 374–450 | Original independent verifier vU/vGuardChild/vShaBlock/vSha256 bodies |
| 453–488 | Compile false, six private lifecycle globals, literal model text/identity, fixed key tables and twenty input-only registry records |
| 490–755 | Fourteen new closed helpers, including the sole zero-arity export |

Original source provenance is the precise P/B/V range list in KERNEL_FREEZE and
PRODUCER_PRECODE, not installed parser code. Bodies were assembled editorially
from those named source strings and retained complete; independent equivalence
and emitted composition review are still mandatory. The P2_dispose alias points
at the actual P3_dispose function, not a stub. New source includes the already
frozen original `P3_setPrototype = P2_setPrototype` primitive alias. No parser,
grammar suffix, auth/create/analyze/replay/source-hash/traversal/decoder body,
JSON serializer, reflection-based fixture access, or normal public API is included.

The source has31 retained named function declarations and14 new ones. None of
the new helpers has a nested function, callback, recursion, parser re-entry or
dynamic helper lookup. The nine bound native captures are clock, charCode, slice,
WeakMap delete, Buffer.alloc, TextDecoder.decode and three typed-array getters.
The Array/U8/U32 aliases receive numeric lengths only; safe u8View uses captured
getters plus captured constructor, not species/subarray. Only bounded public
MODEL/observation ASCII is passed to the native output decoder; no SOURCE exists.

## Actual new helper binding rows

Counts below are source-read declaration/binding-occurrence rows, not a compiler
or emitted census. C02 remains64+16*(parameters+locals), acyclic coexistence1.

| Helper / start | Arity | Local binding occurrences | Frame |
| --- | --- | --- | --- |
| unitTime /490 |0|now|80 |
| unitCharge /497 |2|none|96 |
| unitNewK /506 |1|quota,K|112 |
| unitSite /530 |1|start,loader|112 |
| unitModel /539 |1|sites,index,row,S|144 |
| unitSafeObservation /560 |1|none|80 |
| unitOutcome /563 |3|none|112 |
| unitReadTail /577 |1|at,index,code|128 |
| unitObserve /597 |9|outcome,digest,seal|256 |
| unitFinish /615 |2|none|96 |
| unitCase /645 |2|K,S,wire,result,fault,bytesBefore,entriesBefore,targetStarted,failed,caught,observerCaught,cleanupCaught|288 |
| unitValue /673 |2|none|96 |
| unitOutput /680 |1|K,out,text,index,key,row,field,fault,outputCaught,cleanupCaught|240 |
| runFixedBoundaryCasesP3 /720 |0|root,index,spec,observation,text|144 |

Sum1984 is the accepted1872+64 case-routing+48 output-routing refinement;
fourteen ordinary function/prototype rows remain14*192=2688. No extra helper,
local, case, quota or capture was introduced. The exact source graph follows the
freeze: run→case/output→factory/observe/value/finish→writer/hash/guard/primitives
→clock/error/dispose. Full graph and exact new/retained C01/C02 rows remain a
non-own source-census obligation before effects.

## K / S / actual observation distinction

K is the exact37-field null-prototype656-byte real accounting record at506;
S is the exact25-field null-prototype464-byte MODEL_ONLY writer record at539.
K never receives the modeled65207088 total,10000 entries or118 attempts. S never
funds real allocations. The actual owner is K only; actual snapshots read K.total
and K.entries. The production writer reads S's input model and uses the unchanged
consume body against K. MODEL_ONLY fields are deliberately not normal reachability
or parser FIT evidence.

Fixed registry has20 null-prototype records of six input fields, with the exact
canonical IDs from KERNEL_FREEZE. The two CODECs use106 fixed nine-field EXPORT
rows and literal1053 units/64-zero identity. Piecewise source spans and the11
STATIC_LITERAL rows are fixed, not searched or learned from producer output.
Variant1 changes the modeled summary/scratch transfer by12864, not actual K costs.
All eight producer/verifier depth vectors and ten entry vectors are unchanged.
Invalid numeric observations become null through the actual captured integer
predicate. No registry row stores an expected outcome or PASS bit.

Observation storage has root7 fields, array20 and twenty records15 fields; output
working record has only three fields. Sole exported result is the bounded JSON
STRING containing those observations. Actual successful wire digest uses the
independent verifier SHA body; actualSummaryHash is read from the complete actual
wire's checked suffix. Failed CODEC has no hash/tail operation or prefix export.
Cursor/encoded observations come from actual S.codecPosition, not literal16384.

## Before-growth rows and lifetime

- Outer observation prepayment6520/42 precedes root/list/all twenty record
  constructions. Fixed module literals/tables/captures are C01 startup rows,
  not attempted grammar Nodes; their exact census remains required.
- Every K prepayment656/1 happens before K construction. CODEC quota97328 is
  SUMMARY92736+VERIFY_CODEC4432+META160; guard quota0. Fresh K inherits the original
  invocation start/lastNow and all retired cumulative bytes/entries.
- Model group23464/214 precedes S/array106/all106 row constructions. The23000
  list/row component includes eight slot bytes per row; no double backing charge.
- Unchanged encodeSummary consumes86400 before native buffer/string/SHA work;
 6336 unused SUMMARY remains charged. Successful-only independent SHA4432 and
  actual tail slice160 consume their already-prepaid named buckets. No refill,
  borrowing, refund, GC credit or model ledger borrowing occurs.
- Final OUTPUT is a distinct accounting K, not case21:656/1 plus META49408;
  META consume with one membership precedes output3/buffer/string/view.49408
  includes16384 backing+64 header+32800 string+112 record+48 safe view.

Known invocation capacity beyond T stays311288 and492 memberships exactly as
the freeze. The public JSON upper11162 is prospective algebra, not an observed
output size. Actual T remains OPEN: exact startup literals/bindings/ordinary
functions/retained frames/new1984 frames/native explicit reserves must be counted
and independently validated, with T+311288<=67108864. This report does not assign
a guessed T, claim physical heap/RSS containment, or assert native allocation proof.

## Exception routing, deadline and cleanup

First legitimate zero-arity call consumes ONE_SHOT before work. CompileOFF,
bad arity and subsequent valid call reject before clock/case allocation; bad arity
does not consume the invocation. One captured invocation deadline120000 and
monotone lastNow carry through all cases and OUTPUT. Clock checks accept finite
fractional timestamps; no integer timestamp test or renewal exists.

unitCase marks targetStarted only after factories/snapshots. Factory errors are
fatal, not boundary observations. The target catch preserves the raw first
thrown value, including null/undefined; result=false marks its presence. Observer
and cleanup faults always fail the whole invocation, retaining that first value
without inspecting/coercing error properties. Expected target refusal does not
make a cleanup fault successful. unitOutput likewise distinguishes successful
text from a captured output failure, preserving the first fault against cleanup.

unitFinish has inner try validation/carry followed by unconditional inner finally
calling the original dispose and clearing every held K/S root, including when
abort already nulled the owner. unitCase clears K,S,wire and the result wire alias;
OUTPUT clears its buffer/K/working record. run finally performs owner-null dispose
and private writable-root assignments only, dropping module/observation/local
roots on any failure. Only the intentional returned JSON STRING survives success.
No native error diagnostics, reflection, callback or output hash runs on refused
cases. No output JSON is returned on unexpected factory/observer/cleanup failure.

## Handoff gate

SOURCE_READY for full independent actual-source/body/composition review only.
No self-CLEAR. Handwritten source/body/census, future emitted review, exact T,
normal21-unit FIT, full205 harness/admission/tools and all effects remain distinct
held gates. Runtime0/8, all36UNRUN, compileOFF, tuplesNOT_ISSUED;62OPEN/callergraph
OPEN/fullRuntimeClosureNOT_ACCEPTED preserved. No P4/P5/actual source/native tree/
protected attempt5/grant/failed-root/.env/Git/API authority is added.

Aggregate870882.767416/900000ms; P3remaining21440.727166, effects0/no reset.
