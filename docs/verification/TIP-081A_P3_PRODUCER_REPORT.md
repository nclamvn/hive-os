# P3 producer/lifecycle source report — UNRUN / release OFF

2026-10-08 · SAME081D8 · Owner-approved synthetic P3 only.

Authored only `scripts/test/private-summary-runtime-tip081-p3.mjs`. P2 files and
the checked predecessor tuple are untouched. The file is lexical embedding TEXT,
not a standalone module to import. Main alone owns all capture, derivation,
hash/import/parser/check effects. This Builder performed none of those effects.
No implementation or source self-clear is claimed.

## Integration / authority

The fixed deriver retains the reviewed P2 grammar/scalar initializer suffix
byte-for-byte, replaces P2 reserve/dispose, removes its four public operations and
its scalar observation helper, and embeds this overlay and Front's independently
authored verifier snippet. Every common-runtime reserve occurrence needs a closed
source-issued family mapping. Missing/ambiguous mappings deny before effects;
there is no fallback family. New compile constant
`__HIVE_P3_COVERAGE_RELEASED=false` is not caller authority.

Exact six frozen public names/arities are implemented. Only primitive input data
and the exact live WeakMap handle are accepted; no AST/text accessor, parser,
callback, caller path, registration, hash/profile authority or fault flag exists.
Bad arity/foreign/non-string pre-authentication inputs do not revoke an owner.
An authenticated operational refusal disposes it. Wrong primitive mode is
MODE_OPEN; other invalid primitive/type/range inputs are SCHEMA_REFUSED.

R311 fixed private negative derivative has one unique source marker:
`state.producerRoot = null; // P3_ALIAS_CLEAR`. It must retain that root while
other retirement operations run, be independently reviewed/pinned under a
separate test-only domain, and be rejected by normal admission. No public hook.

## Allocation / lifetime inventory (logical conventions, not physical sizes)

| Region / function anchors | Before-operation accounting and lifetime |
| --- | --- |
| Imports/captures/bootstrap | Native TextDecoder startup workspace4096, null-sanitize16; three native typed-array slot descriptors128+sanitize16 each; bound capture96 each; module slots16, keys/literals32+2units, ordinary functions/prototypes192 and constant arrays by exact source inventory. C01 source census must precede any import. Decoder handles only ASCII metadata/digests, never raw source. |
| `createSyntheticSummaryP3` | All base/control/source and escrow capacity checked by subtraction before state/handle/storage allocation. Owner literal currently71 fields, snapshot7 fields, handle2 fields, weak row32, source header32+4units. Independent deriver must verify actual counts, not trust this manual count. One original clock start, no renewal. |
| `producerStorage`, `frame` | 128 reusable16-field frames40960 +frame backing1112+sanitize16 =42088. Private frame array nulled on retirement. No all-node catalog. Actual frame creation/slot memberships256 before construction. |
| Binding storage | List512 backing4184+sanitize16,512 copied-name headers16384 and65536 UTF16 units131072 =151656. Entire finite policy prepaid. Actual unique membership before copy; name/unit exhaustion refuses. Names never leave owner; inventory and copies retire with producer. |
| Site storage | 512 nine-field objects/slots at216 each +array header88+sanitize16 =110696. Every actual site consumes two memberships before creating/writing. Stable insertion sort creates no copies. Rows contain spans/enums/booleans only, status OPEN. |
| `enter`, `nodeRead` | Each reachable Node occurrence/pass consumes named8168 capacity BEFORE native keys/descriptors: keys backing344, key payload2048, sanitation16,40 descriptors at144=5760. Require private NODE metadata, retained own-field bound32/key-unit bound512, known node kind and known key names. Read meter increments before reflection; accessors refuse. Unused quota stays charged. |
| `arrayRead` | Trusted private ARRAY indices are traversed individually, never native-key-enumerated; no32-key/fanout truncation on arrays. Before each slot, numeric String normalization96 +descriptor128+sanitize16 =240, actual membership1. Captured primitive String conversion precedes reflection. |
| `walk`, `declaration`, `binding`, `site`, `sortSites` | Two explicit-stack passes: complete declaration inventory, then all taxonomy sites. Combined visits at most200000; cycles checked on current ancestor path. Structural frame depth128, independent of attempted grammar nodes. Shared nodes counted per edge. Fixed storage reused; no global dedup/all-nodes array. |
| `commonReserve` | Producer common grammar costs add to producerParseBytes and total. Replay consumes only its exact one of five source-mapped quotas:8MiB Node/schema and4MiB each array, derived string, call frame, bookkeeping. Consumption transfers reserved→live once; total/nodes/entries/deadline never reset. Unknown family/stage refuses. |
| `debit`, `consume`, `counters` | Subtraction-before-addition safe arithmetic; actual attempted counters guard before growth. Escrow decreases its remaining quota and transfers the same bytes out of scratch into the disjoint category. Passing category scratch preserves total scratch: consumed and unused scratch remain charged. No GC/refund credit. |
| `sha256`, `rotate`, source hash | Independent producer-only pure numeric SHA-256. Direct UTF16 code-unit LE projection; ASCII seal reads only its private byte buffer. No native Hash object/raw-source buffer/view/callback. Before hash:4096 named state8/words64/block64/digest64 workspace and160 digest string; typed constructors receive numeric lengths only, no iterable/species. Native decoder sees64 ASCII hex bytes only. |
| `encodeSummary`, scalar writers | Fixed16384 ASCII backing plus64 logical header; body/wire strings32800 each; SHA workspace4096, digest160, two standard48 views. Unsigned decimal digit writer creates no token strings; all output guards BEFORE writes. Actual producer codec consumption90656, from quota92736. Unused2080 remains scratch, not falsely spent/refunded. No JSON.stringify/from/toBuffer source conversion. |
| `u8View` | Captured native typed-array buffer/offset/length GETTERS plus captured Uint8Array constructor; caller prepays48. No subarray/species/constructor lookup. Views apply to public-data-domain ASCII output only, not source. |
| `metadata` | Max32 including verify/observe; each preconsumes12864 =object27fields496 +string8224 +buffer4096 +view48 before growth. One bounded scalar-only object/string, no source or AST. Exhaustion retires with VERIFY_RESOURCE_REFUSED. Fixed retirement strings are module literals. |
| Producer retirement | Clear ast/parser/root/frames/scopes/bindings/sites and traversal flag before phase transition. Transfer parse+work live categories into unreclaimedProducer once; null live categories; no refund/peak reset. Summary/source/tool stay charged. Marker fault must be ALIAS_REFUSED before replay parser. |
| Replay seam/retirement | `replayStart` checks all producer roots before parser, returns private128-byte record with AST and common deltas after a guarded replay parse. Front owns independent extraction/decoder/hash/canonicalizer/ledger. `replayRetire` clears owner roots, transfers replay live→unreclaimed; Front must clear lexical/local aliases before returning to VERIFIED metadata. |
| `dispose` / every public catch | Clear source/parser/AST/producer/replay/frame/name/site/codec roots and flags; remove weak authority even after expiry. Native/unknown thrown objects are compared only by fixed singleton identity; no message/stack/getter reads, dynamic error strings or salvage. |

Initial producer capacities =304440. Initially scratch6758296 comprises
SUMMARY_CODEC92736 +VERIFY_CODEC3612704 +VERIFY_WORK2641208 +META411648.
Replay grammar reservation25165824 is separate. Initial entries257 comprise
owner weak membership1 plus frame records/list slots256.

Historical producer work is
304440+16336*N+480*A: two passes, Node occurrences N and array slots A measured
per one pass, both-pass equality checked. Historical entries independently
reconstruct as257+commonParseEntries+66*N+2*A+2*siteCount+uniqueBindingCount.
Metadata emissions captured at wire construction M remain immutable afterward:
historical summary90656+12864*M; scratch6667640-12864*M. Front separately sums
these literal rules and repeat common parse deltas, never trusts caller wire
totals/seal/phase. Common grammar/allocator correctness remains COMMON_MODE.

## Source semantics / coverage

IMPORT, every EXPORT form, DYNAMIC_IMPORT, CALL, NEW and MEMBER are emitted per
reachable occurrence; each site is OPEN. Full known AST own children are scanned,
including declaration patterns, labels and reused shorthand identifiers. Only
TemplateElement's fixed raw/cooked OBJECT payload is a reviewed non-node leaf.
Native RegExp/BigInt/unsupported P2 modes are not enabled. All unknown kinds,
key families or object payloads refuse rather than publish a prefix.

Global conservative declaration collection covers import, variable/function/
class identifiers, parameters, catch and destructuring. Declared names are
AMBIGUOUS; absence is syntactic NO_LOCAL_BINDING only. Calls/news recognize bare
require/eval/Function syntax, not runtime permission. Member binding examines
Identifier object only. CALL/NEW computed flags inherit Member callee syntax;
MEMBER flags describe that node's own property, not an inner computed object.
Function/class/control ancestry is conservative; OPTIONAL propagates via chain.
CERTAIN never means guaranteed execution. Canonical order is stable
(start,end,kind); legitimate equal tuples preserve occurrence multiplicity.

The producer direct-helper graph is acyclic: data traversal/hash/sort loops use
bounded explicit state, not JS recursion. New producer helpers coexist at most
once each; inherited private grammar re-entry is a separate reviewed dependency.
Do NOT extend the old2*129 multiplier blindly to new helpers. Independent exact
callgraph/frame/native bootstrap inventory is still required before effects.

## Findings / remaining gates / history

1. **Repaired source cost finding:** numeric array-index descriptor calls
   implicitly convert ToPropertyKey. Main froze inherited96 normalization plus
   reflection128/sanitize16=240 per slot, work480*A and VERIFY_WORK2641208
   (+98304). Producer now explicitly converts after charge; Front repair still
   needs independent reread. This source review repair is not a runtime failure.
2. C00/C01/C02 actual source rows/frame counts/direct graph, all common reserve
   families/mixed costs, startup native constructor rows and full emitted delta
   are not yet captured/independently closed. Source OFF is deliberate.
3. Independent Front verifier full first draft was read; computed outer-member
   inheritance and missing explicit class element uncertainty were found and
   repaired by Front. Pure Front SHA/ledger amended source was separately read;
   no concrete SHA algorithm mismatch found by text inspection. This is not a
   semantic/allocator proof or own-source clearance.
4. Normal128/129 resource-axis controls may be masked by the same byte/entry/
   private-frame bounds. P321 remains OPEN until a genuine discriminator; no
   fault AST, cap increase, first-N slice or broadened expected refusal substitutes.
5. Early unexecuted draft native Hash wrappers and subarray/toString capture
   premises were rejected during source review and replaced by independent pure
   SHA and captured-slot standard views/ASCII decoder. These are SOURCE findings,
   not runtime failures; no new P3 effect has run. Current accepted source cuts
   must be completely captured BEFORE the first Main effect.

No R1–R8 control is claimed RUN/PASS. No P3 admission/acceptance, physical native
memory/stack/RSS/GC, deep AST semantic independence, full graph/root/math/P4/P5,
real source/authentic receipt/API or reset is claimed. Inherited budget remains
867323.494582/900000; P3 effects≤25000 including every wrapper/child allowance.
