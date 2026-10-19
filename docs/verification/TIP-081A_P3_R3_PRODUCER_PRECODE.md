# P3 R3 producer / unit-kernel pre-code freeze — source only

2026-10-08 · Owner approved R3; PHASE1 PRE-CODE, implementation NOT released.
This is a prospective freeze for Main/non-own review, not source self-clear,
emitted-cost validation, admission, runtime PASS or mathematical closure. Only
original handwritten templates/docs were read. No parser/import/hash/check/
derivation/test effects occurred; predecessors are unchanged.

## Exact body extraction closure

Abbreviations: P=`scripts/test/private-summary-runtime-tip081-p3.mjs`;
B=`scripts/test/private-grammar-runtime-tip081-p2.mjs`;
V=`scripts/test/private-summary-verifier-tip081-p3.mjs`.
Ranges are current original handwritten line ranges, not freshly hashed pins.
Extraction must bind entire original named declaration bodies, not copy a similar
implementation or use a generic node-kind fallback. Source changes invalidate
these ranges and stop preparation until Main/non-own reconciliation.

| Body | Original range | Direct dependencies / frozen frame bytes |
| --- | --- | --- |
| P __HIVE_P3_encodeSummary |516–565| consume, allocBuffer, put, field, unsigned, string, raw, ledgerField, touch, decodeAscii, u8View, sha256, PROFILE; params1/locals3:128 |
| P __HIVE_P3_put |435–438| abort; params2/locals0:96 |
| P __HIVE_P3_raw |439–441| touch, put, P2_charCode;2/1:112 |
| P __HIVE_P3_string |442–451| abort, put, P2_charCode;2/2:128 |
| P __HIVE_P3_unsigned |452–460| P2_integer, abort, floor, put;2/2:128 |
| P __HIVE_P3_field |461| put, string;3/0:112 |
| P __HIVE_P3_ledgerField |515| field, unsigned;4/0:128 |
| P __HIVE_P3_rotate |462| numeric operations only;2/0:96 |
| P __HIVE_P3_sha256 |463–510| Uint32Array, Uint8Array, floor, touch, charCode, rotate, shaConstants, decodeAscii;3/37:704 |
| P __HIVE_P3_u8View |62–69| three captured typed getters, P2_integer, abort, Uint8Array;3/1:128 |
| P __HIVE_P3_error |70| P3/P2 closed error tables;1/0:80 |
| P __HIVE_P3_dispose |71–83| owner/active/owners, captured deleteWeak;0/1:80 |
| P __HIVE_P3_abort |84| dispose, error;1/0:80 |
| P __HIVE_P3_touch/add/mul |85/86/87| P2_timed/plus/product; frames64/96/96 |
| P __HIVE_P3_counters |88–94| owner, P2_integer, abort;2/1:112; R3 replaces entry comparison with actual factored entry guard |
| P __HIVE_P3_debit |95–102| touch, owner, integer, hasOwn, abort, counters, add;4/1:144 |
| P __HIVE_P3_consume |103–122| touch, owner, integer, abort, counters, add;5/2:176 |
| P __HIVE_P3_commonReserve |123–148| touch, integer, abort, toolBytes, owner, debit, counters;4/2:160; kernel bootstrap uses only owner-null branch |
| B __HIVE_P2_integer |76–78| captured safe/is;1/0:80 |
| B __HIVE_P2_timed |98–103| owner, clock, finite, P2_refuse;0/1:80 |
| B __HIVE_P2_plus/product |104–107/108–113| integer,maxInteger,P2_refuse;2/0:96 and2/1:112 |
| B __HIVE_P2_refuse |88–91| P2_dispose alias and closed errors;1/0:80 |
| V __HIVE_P3_vU |247–249| floor;1/0:80 |
| V __HIVE_P3_vShaBlock |391–419| touch,vShaConstants;3/22:464 |
| V __HIVE_P3_vSha256 |420–456| consume,Uint32Array,Uint8Array,vU,abort,floor,touch,charCode,vShaBlock,decodeAscii,u8View;2/16:352 |

All frame rows use C02 `64+16*(parameters+local-binding occurrences)`;
loop/shadow binding declarations are counted separately. The whole closure is
acyclic; source helper frames coexist at most once each. No inherited258 grammar
multiplier belongs to this parser-free kernel. Counts are hand-derived and must
be independently compared with actual R3 source before effects. Native/implicit
VM frames are not claimed physically bounded by this convention.

P2_dispose in P2_refuse must use the SAME existing P3 substitution (P71–83), not
B79–84's smaller cleanup. This is an explicit alias binding, not a no-op. Keep
P2_active=null; no WeakMap handle is issued. Owners WeakMap/deleteWeak remain in
the closed disposal dependency, but no register/auth/native/parser API is included.

Captures: B3–6 performance clock/charCode/slice; B11–17 safe/maxInteger/finite/is/
freeze/setPrototype/descriptor; B21 proto; B26 hasOwn; B37 floor; B42 deleteWeak;
B51–53 owners/active/owner. P4–12 TextDecoder/Buffer/allocBuffer/decoder/decodeAscii;
P13 slice alias, P18–21 Uint8/Uint32/charCode/typedPrototype; P22–33 three
descriptor captures/getters; P35 floor; P38 PROFILE; P44–53 shaConstants;
P54–60 five P3 errors. B61–75 twelve P2 error singletons. V381–390 independent
vShaConstants. No JSONParse, producer sourceHash, traversal/classifier, vDecoder,
vWalk, replayStart, parser initialization, normal-owner import, six normal APIs,
caller callback, source lease, private AST, get/reflection helper, or generic
registerFunction enters the closure.

All native calls are exact captured standard primitives, under the inherited
trusted bootstrap/native logical-cost premise. Receiver/property accesses at
capture require the same descriptor sanitation and clean bootstrap as P2/P3.
No raw source or source-derived typed view is constructed in this kernel.

## Fixed model writer cases — exact algebra, no parser inference

S is a25-field null-prototype MODEL_ONLY record, independent of K. Exact fields:
profile,text,sourceIdentity,producerOccurrences,producerParseAttempts,
producerSiteCount,producerSites,baseBytes,producerParseBytes,producerWorkBytes,
summaryBytes,replayReservedBytes,replayLiveBytes,scratchBytes,
unreclaimedProducerBytes,unreclaimedReplayBytes,total,peakBytes,
historicalProducerEntries,codecBuffer,codecPosition,codecLimit,sealBody,summary,
hashBuffer. Cost464. All future-written properties already exist, initially null
or0. S.text is a fixed1053-character ASCII `x` module literal, never parsed;
sourceIdentity is a fixed64-zero lowercase-hex MODEL_ONLY literal. No claim that
that hash authenticates S.text. profile MODULE; PROFILE remains exact P3 constant.
N/G118 and siteCount106 are model scalars, not actual allocated Nodes/attempts.

Freeze106 EXPORT records, ordered by start. For index i=0..105:

- i<12: start9*i,end9*i+9, loader NONE.
- 12<=i<23: start108+18*(i-12),end=start+18, loader STATIC_LITERAL.
- i>=23: start306+9*(i-23),end=start+9, loader NONE.

All other fields: kind EXPORT,binding NONE,conditional CERTAIN,optional false,
computed false,status OPEN. This is a closed model span construction, not source
execution/search. Every numeric field is nonnegative safe; spans end<=1053.

Explicit14-field model ledger in encoder order:

| Field | C16384 | C16385 |
| --- | --- | --- |
| baseBytes |30000000|30000000|
| producerParseBytes |1000000|1000000|
| producerWorkBytes |2282968|2282968|
| summaryBytes |90656|103520|
| replayReservedBytes |25165824|25165824|
| replayLiveBytes |0|0|
| scratchBytes |6667640|6654776|
| unreclaimedProducerBytes |0|0|
| unreclaimedReplayBytes |0|0|
| totalBytes |65207088|65207088|
| peakBytes |65207088|65207088|
| producerEntries |10000|10000|
| producerAttempts |118|118|
| siteCount |106|106|

Category sum65207088 is exact and <=67108864, but remains MODEL_ONLY, never K's
actual charged total. Selected width vector W72 is explicit, not inferred from
its sum: (8,7,7,5,8,1,7,1,1,8,8,5,3,3). C16385 changes only summary/scratch by
12864 (transfer), adding one serialized digit. Site fixed payload140; coordinates
sum621; STATIC_LITERAL replacements add110. Full wire:
`625+141*106+110+621+4+3+3+72=16384`.
Second wire attempted size16385. Body-before-seal length is16303/16304;
the expected first denied write is the final closing brace at cursor16384.
The kernel must observe actual cursor/error, not return that expected number.
No raw incomplete/complete wire leaves it. Successful actual length plus actual
whole-wire digest and actual summaryHash are independently compared by tests;
literal hash values are computed only in Main's later authorized effect, not here.

## Actual K, lifetime and concrete allocation rows

Each fixed case is a distinct UNIT instance; its escrow is never replenished.
K37 fields are exactly: the20 disposal roots/flags from P74–79; summaryRemaining,
verifyCodecRemaining,verifyWorkRemaining,metadataRemaining,scratchBytes,
summaryBytes,replayLiveBytes; started,lastNow,ttl; entries,nodes; limit,total,
peakBytes,producerWorkBytes,baseBytes. Cost656. All actual category sums include
baseBytes; modelUsed is never assigned to actual K.entries. No handle/weak member.
K.clock start is the ONE invocation start, TTL120000; all cases retain that
deadline. New K is not permission to renew it or erase invocation costs.

An invocation-level numeric ledger retains all retired UNIT charges (no GC/refund)
and every live observation/output overlap, before each new K allocation. K.baseBytes
includes module/workspace plus prior retired UNIT charges. Require cumulative
invocation total<=64MiB, not merely each case individually. Original consume/
counters/touch/debit/abort semantics remain, with distinct private K/S identities.
SUMMARY consumes K, writer encodes S. Finally clears BOTH records' roots plus
local wire, even when original abort has cleared only K. Only scalar observations
survive. Any unexpected singleton/type/dependency/resource failure stops the run.

| Before allocation / lifetime | Exact planned logical charge |
| --- | --- |
| Both SHA constant arrays, module lifetime |2*(88+8*64+16)=1232 |
| Twelve P2 error objects +table |12*96+256=1408 |
| Five P3 error objects +table |5*96+144=624 |
| Owners WeakMap, no handles |96 |
| Nine bound captures: clock,charCode,slice,allocBuffer,decodeAscii,three typed getters,deleteWeak |9*96=864 |
| Native decoder options/receiver sanitation |options96+named decoder4096+sanitize16=4208 |
| Three captured native descriptors |3*(128+16)=432 |
| Future module declarations/literals/functions |C01 binding16,each fixed string/key32+2*units,ordinary function/prototype192; exact site census still required |
| Twenty-row closed registry, six fields/row |20*160+(88+8*20)+16=3464; module lifetime |
| Fixed S1053-character padding +zero64 strings |2138+160; module literals, counted once in C01, not charged twice |
| CODEC K/S/106sites |656+464+106*216+104=24120 per case |
| CODEC SUMMARY quota |92736; SAME encodeSummary consumes86400, unused6336 remains charged; sourceHash is excluded |
| Successful actual whole-wire observer |VERIFY_CODEC4432, exactly V420–456; no native crypto in private kernel |
| Successful bounded tail copy |160 before64-char captured slice; verify fixed tail syntax via charCode; never read fixture seal as actual |
| Retained20 case observations, fifteen fields |20*(64+16*15)=6080 |
| Observation list/root |(88+8*20)+16=264; seven-field root176 |
| Output codec backing/header/string overlap |16384+64+32800=49248; hard16384 write limit |
| Model guard cases |K656 each; no fake19999 membership allocations or allocated129-node AST |

Per-CODEC planned amount121448 conservatively includes observer/tail even for
the refused case; no refund of unused quotas. Two CODECs +18 scalar cases +
retained observation/list/root/output capacities =310472 beyond module/workspace
T. This includes every known case/output row above; registry/literals are part T.
Necessarily `T<=66798392` for this planned closure. T is NOT the old grammar T
or a guessed65536; exact new C01/C02 and native bootstrap census remain OPEN.
Therefore overall fit is conditional, not proved. Membership policy: charge K
record1, S record1, site-list membership1,106*2 site memberships, observation
record/list2, giving217 actual entries per CODEC (no attempted grammar Nodes).
Scalar case K/observation memberships3; output/registry memberships separately
bounded20 each. No actual boundary fixture needs thousands of allocator entries.

## Prospective new seams and closed registry

Normal producer __HIVE_P3_pGuardChild(parentIndex), arity1/frame80: real touch;
invalid captured P2_integer or index>=128 ->ALLOCATION_COVERAGE_OPEN; index+1>=128
->DEPTH_REFUSED; otherwise true. Used before ++depth/frame writes in Pwalk;
no guard is removed. Verifier's independently authored __HIVE_P3_vGuardChild is
owned by Front; see its separate pre-code report. Neither body calls the other.
Entry __HIVE_P3_guardEntries(used,delta), arity2/frame96: real touch; invalid
P2_integer or used>20000 ->ALLOCATION_COVERAGE_OPEN; delta>20000-used ->ENTRY_REFUSED;
otherwise true. Actual counters call it before their addition; model probes use
same body without pretending to allocate used entries. No unchecked addition.

Final kernel registry is20 (earlier18/8 proposal superseded BEFORE code):

| IDs | Model input / actual expected outcome |
| --- | --- |
| C16384,C16385 |fixed S above; EMITTED/SUMMARY_REFUSED |
| P126,P127,PNEG,P128 |producer index126,127,-1,128; ADMIT/REFUSE/INVALID_ARGUMENT_REFUSED/INVALID_ARGUMENT_REFUSED |
| V126,V127,VNEG,V128 |independent verifier same literal indices/outcomes |
| E19999_1 |used19999,delta1:ADMIT |
| E20000_1 |20000,1:REFUSE |
| E20000_0 |20000,0:ADMIT |
| E0_MAX |0,9007199254740991:REFUSE before addition |
| EMAX_1 |9007199254740991,1:INVALID_ARGUMENT_REFUSED |
| ENEGZERO_1 |-0,1:INVALID_ARGUMENT_REFUSED |
| E0_NEG |0,-1:INVALID_ARGUMENT_REFUSED |
| E19999_FRACTION |19999,1.5:INVALID_ARGUMENT_REFUSED |
| EUNSAFE_1 |9007199254740992,1:INVALID_ARGUMENT_REFUSED |
| E0_INFINITY |0,Infinity:INVALID_ARGUMENT_REFUSED |

Invalid/noncanonical/negative/unsafe observations become null, not strings or
unsafe output numbers. Error observation uses actual singleton identity only;
no message/stack/getter read. Kernel is exact zero-arity sole export. Extra caller
arguments refuse before any case; no source, AST, callback, registry/seed/options
setter or normal brand/API is exposed. Output uses exact approved seven-key root
and fifteen-field case schema, no PASS/self-expectations. New normal artifact has
no kernel exports/factories and normal admission rejects kernel/alias domains.

Prospective factory/observer functions (body code not yet authored):
unitNewK(params2,locals3,frame144); unitModel(params1,locals4,144);
unitSite(params1,locals2,112); unitObserve(params4,locals4,192);
unitReadTail(params1,locals3,128); unitOutput(params1,locals5,160);
runFixedBoundaryCasesP3(params0,locals12,256). Exact local names/occurrences must
be frozen at source release and charged at these finite capacities, or stop if
source requires more. No new recursion; no dynamic/reflected helper invocation.
Case/error observers and output must not invoke a normal-owner module. Every
extra local/function/string/capture gets a named row, not a lowered cost.

## Remaining gates / STOP

Pre-code model fixture/registry/known rows are proposed-frozen for independent
review. Remaining T rows are exact future module binding/key/literal occurrences,
function/prototype declarations including factory/observer/predicates, their
actual local counts, closure graph and output serializer/tail reader source.
K/S construction/cleanup and output schema require complete non-own source review.
No unresolved dynamic dependency may be satisfied by a stub or omission.
No empirical deadline or process-fit claim follows from these arithmetic rows.
Main must freeze/release source code explicitly; this author stops before code.

Budget unchanged870882.767416/900000ms; P3remaining21440.727166; no effects or
reservation spent. Preserve R2/P2/all cuts; compile OFF/tuplesNOT_ISSUED;
no P4/P5/math/source/API/Git/protected-path authority follows.
