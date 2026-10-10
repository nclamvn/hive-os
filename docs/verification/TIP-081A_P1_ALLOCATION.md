# TIP-081A P1 — synthetic logical allocation convention / occurrence inventory

2026-10-07. New private module `scripts/test/guard-scanners-tip081-p1.mjs` only.
Current status: scoped P1 source/inventory review CLEAR; Main's one first batch
passed50/50 unique controls, syntax/lint and focused type diagnostics0. See
TIP-081A_P1_FIRST_CHECK.json and TIP-081A_P1_COMPLETION.md. The prior UNRUN header
is preserved in precheck/dispatch source cuts; no historical evidence rewritten.
No Acorn import/invocation, AST, authentic source, receipt, full-grammar coverage,
native literal conversion or real replay. P2–P5 remain ungranted.

Focused invocation config `vitest-tip081-p1.config.ts` sets `envDir:false` to
prevent Vite automatic .env loading, in addition to exact one-file include and
empty setupFiles. Main confirmed this installed Vite option via primary source
text before execution. This runner boundary does not weaken fixture semantics or
authorize broader imports, application setup or environment-file reads.

## Literal logical costs (not actual V8 bytes)

These constants define an explicit accounting model, not portable physical memory
sizes, OS isolation, native module allocation or immediate-GC claims. The module
is trusted fixed code loaded before input; it cannot reserve host allocations
before the JavaScript loader itself runs. Logical startup is declared before its
own tables and every admitted owner includes the entire startup reservation.

| Logical item | Cost / interpretation |
| --- | --- |
| Object header | 64 bytes |
| Fixed schema property/reference | 16 bytes |
| Dictionary/WeakMap row | 32 bytes, plus referenced payload separately |
| Array/backing slot | 8 bytes; old and new backing both retained in debit |
| String header | 32 bytes; payload 2 bytes / UTF16 unit, no rope/intern credit |
| Helper/frame record | 64 bytes plus scalar schema/arguments |
| Resize attempt record | 24 bytes |
| P1 source alias reservation | 4 × UTF16 length: caller + retained immutable-string payload convention |

The owner does **not** claim to copy a primitive string into an independently
allocated buffer. Source is immutable and private in state; both payload aliases
are conservatively charged. No getter or source-derived text is exported.

Fixed 65536-byte module allowance: 32768 for fixed function objects/bound closure/
lexical storage/imported-clock logical envelope; 16384 for fixed static literal
strings/export/control tables; 8192 for WeakMap and refusal/limits records (10
refusal records with two properties each, table references and the limits schema);
8192 additional fixed logical margin. This enumerates the fixed trusted artifact,
not hidden engine internals, loader/JIT/native RSS. Missing real-engine bounds stay
OPEN and must not be inferred from this logical reserve.

Fixed 4096-byte owner allowance covers one state object (23 fixed fields, including
all scanner scratch scalars), one two-property frozen opaque handle, one WeakMap
row, fixed creation/retirement scalar bookkeeping and logical margin. Scanner
fields exist at construction: no dynamic schema growth. Captured clock and bound
WeakMap methods prevent post-import replacement of those entry points from leaking
state; malicious host manipulation before trusted loading is outside this model.

Fixed 8192-byte scratch allowance covers a maximum helper chain of 10 nonrecursive
frames at <=512 logical bytes/frame plus 3072 margin. The longest chain is public
scanner -> strict/trivia/quoted/identifier -> escape/startOfLine -> at -> tick ->
timed -> abort/dispose on refusal; no scanner function recurses. Frames are bounded
scalar/control scratch, not source-sized strings/arrays. This is reusable fixed
scratch by convention; no dynamic producer debit is reclaimed by reusing it.

The512-byte internal-frame convention does not bound construction of the caller's
argument vector or VM-implicit `arguments` materialization before function entry.
Exact-arity checks reject unexpected arguments without reflection/coercion; they
do **not** certify call-time VM allocation. Fixed trusted invocation is an explicit
host boundary. Hostile preloading, native physical allocation and engine/loader
behavior remain OPEN, separate from captured post-import intrinsic protections.

Fixed 4096-byte refusal allowance precedes work. Failures throw one of the fixed
frozen module records: no Error construction, native stack, source excerpt,
dynamic message, diagnostic concatenation or newly allocated refusal object.
The host/test harness may format exceptions outside this module; that formatting
is not a bounded parser guarantee.

Every metadata/span record is charged **1024 bytes before scanning/creation**:
64-byte header + <=17 properties ×16 + static-value/reference schema and margin.
All returned fields are fixed literals or scalars. No input text is returned.
Charges remain permanent after caller drops the record. Repeated observations can
therefore hit the cap honestly.

Base = 65536 + 4096 + 8192 + 4096 = **81920**. Admission computes full primitive
string length and checks `length <= (cap-base)/4` before state/handle creation.
It cannot accept a lower cap than its own base. Max67108864/default1048576,
node200000, entry20000, depth128 and max lifetime120000ms stay conjunctive.

## Occurrence-to-guard inventory

All source-sized operations below are scalar **cost probes**, not constructed AST
nodes, lists, dictionaries or strings. No successful probe admits real allocations
or full grammar. Atomic guards run before ledger mutation; subtraction-before-
addition and division-before-multiplication plus final safe-integer product checks
prevent overflow. Negative zero, fractions, infinity, NaN and unsafe integers deny.

| ID / exact source occurrence | Before-growth admission / lifetime | Literal controls |
| --- | --- | --- |
| G00 module binds, WeakMap, refusal records/table, P1_LIMITS, exported/internal function objects, fixed keyword literals | Fixed65536 startup logical envelope; no input-dependent initialization, trusted loader assumptions stated | P102/P115/P144 |
| G01 create state object, opaque frozen handle, WeakMap row, source retention | Base81920 +4×UTF16 length checked before any owner allocation; one active owner/instance; scanner scratch schema predeclared | P101–P104/P118–P121/P146 |
| G02 array resize scalar model | `88 + 8×(oldCapacity+newCapacity)`, old/new overlap plus header/resize; entries independently charged/capped | P105/P106/P112 |
| G03 dictionary/key/fanout scalar model | `96 +2×keyUnits +32×rows +8×fanout`, every referenced row/slot retained, entries=rows+fanout | P107/P112/P104 |
| G04 derived-string/failed-attempt scalar model | `attempts×(64+2×(oldUnits+newUnits))`, including old/new string headers, permanently debited even if discarded | P108/P104 |
| G05 node/schema scalar model | `count×(80+16×properties)`, nodes and maxdepth checked before debit; no actual Node or AST | P111/P113/P104 |
| G06 helper/frame scalar model | `64+payloadBytes`, depth and entry fanout independently checked before debit | P113/P112 |
| G07 readSyntheticP1 metadata object |1024 output debit before record construction/freeze; no source/handle/private ledger returned | P102/P109/P114 |
| G08 scanTriviaSyntheticP1 span record |1024 output debit before internal trivia and record construction; all comment/space loops scalar, bounded clock checkpoints; no comment text copies | P123–P128/P140/P142/P147/P150 |
| G09 lineBreakAheadSyntheticP1 span/fact record |1024 output debit before trivia and record; linebreak/brace/EOF facts only, not full ASI decision | P123/P141/P142 |
| G10 identifierAheadSyntheticP1 span record |1024 output debit before scalar identifier/escape scan; fixed scratch, no decoded string | P137–P140/P142 |
| G11 strictDirectiveSyntheticP1 span record |1024 output debit before quote/trivia/word lookahead; every loop checks bounded tick; raw strictness only | P129–P136/P140/P143/P145/P150 |
| G12 private refusal/error paths |Fixed singleton records and4096 owner error reserve; authenticated operational refusal nulls source, deletes WeakMap row and retires; pre-auth wrong arity/foreign metadata cannot revoke another owner | P101/P106/P114/P116/P118–P122/P142/P146/P147 |
| G13 producer retirement/category transfer |No object/string allocation; existing producer reservation moves to unreclaimed category, total unchanged; no refund on overwrite/drop/pop/failed attempt | P108–P110 |
| G14 replay reservation |Scalar reservation only, requires producer retirement; added to retained producer total, no replay implementation/AST | P109/P110 |
| G15 cleanup, timed/tick, arithmetic/counters, position, line/space/id/hex/continuation helpers |Only bounded scalar operations and fixed helper frames; no input-derived string/object allocation. Captured now/check interval64; no renewal; fresh constructor cleans expired lost handle | P104/P113/P115–P117/P144/P146/P148/P149 |

The module contains no input `.slice`, split, match/test/exec/replace, concat,
RegExp/BigInt conversion, JSON parsing, input reflection, dynamic target import,
callbacks or AST constructors. WeakMap operations are captured at trusted load.
Native character-code access is captured, scalar and nonallocating by this logical
convention, not an OS/JIT theorem. Logical output/schema/header conventions do not
certify engine hidden classes/backing/GC sizes.

## Lifetime / authority / cleanup

Ledger total is monotone. Producer category transfer does not lower total; replay
adds charge. Output observations add separate output debit. No time or byte reset
occurs during observations, scans, reservation, phase transition or retirement.
Retiring an owner ends its per-owner synthetic envelope; it does not prove process
RSS reclamation. Caller-retained retired opaque handles contain no text/state.

One active owner per trusted module instance; WeakMap entries are explicitly
deleted at retirement, with no module-level owner history list. Different module
instances have separate brands and limits: this is not process-global hostile
module-loader exclusion. Captured monotonic clock, no caller clock/options; max
64 character-operation ticks between checks, plus fixed bounded scalar helper work.
Native synchronous work is not cooperatively interruptible; no real parser/native
work exists here. Future runtime requires an external supervisor independently.

Malformed pre-auth metadata/wrong arity/foreign brands throw bounded records
without disposing someone else's active owner. Authenticated expiry, byte/counter/
depth limits, unsupported scanner syntax, wrong phase and out-of-range positions
dispose that owner. Parser/native fixture entry authenticates then refuses and
disposes; no flag can enable it. Constructor with expired active owner first
retires it using captured original deadline; alive owner remains BUSY.

## Supported semantics / deliberate OPEN boundaries

Profiles are distinct fixed constructors SCRIPT/MODULE; no ECMAScript options.
Modern hashbang is skipped only at absolute0. Whitespace includes ECMA fixed TAB,
VT/FF/SP/NBSP/BOM/Ogham/U2000–200A/U202F/U205F/U3000; linebreak LF/CR/CRLF/LS/PS.
U200B and U180E are not whitespace. Block/line comments are iterative; script HTML
opening comments at trivia token boundary, closing comments at initial prefix or
confirmed line gap; module HTML never skipped. Ambiguous closing gap refuses.

Public start offsets describe a **known trivia/token-boundary gap** in synthetic
fixtures. P1 does not establish arbitrary-offset tokenizer history, comment/string
interior context, lastTokEnd or full-JavaScript validity. No stock-helper semantic
equivalence claim is made. P2 must supply private tokenizer state/admitted call
contexts, rather than blindly reuse arbitrary public offsets.

ASCII IDStart/Continue is correct for its declared subset. `\\uNNNN`/`\\u{...}` are
scanned scalarly, ASCII only; Unicode identifier characters/escapes refuse. Digit
starts yield NO_IDENTIFIER; invalid escaped starts refuse. Escaped words remain
ESCAPED_WORD and are never classified as unescaped contextual/reserved keywords.
Raw keyword lookup has full boundaries, not prefix matches.

Strict directive detection preserves raw exact `use strict`; cooked x/u escapes
and line continuations do not activate it. Earlier quote expressions must have
supported semicolon/ASI/brace/EOF boundaries. Possible expression continuations
(`(`, `[`, `.`, template, arithmetic/comparison/bitwise/conditional/comma, `!=`,
`in`, `instanceof`, escaped words) refuse instead of reporting false strictness.
LF before `++`/`--` or unary `!` permits the directive under the pinned boundary
rule; these facts do not validate the following statement. Unsupported legacy
octal/malformed/unterminated strings/comments refuse and cannot skip to later
strictness. Escaped ASCII u/x string spellings are scanned, not decoded/retained;
nonASCII u escapes explicitly unsupported.

Native-literal APIs are explicit fixture entry refusals (REGEXP/BIGINT or context
OPEN), **not** a token-only detector or context-sensitive lexer. Shared producer/
replay/grammar common mode remains OPEN, parser OFF, whole graph OPEN and
fullRuntimeClosure NOT_ACCEPTED;62 predecessor OPEN unchanged.
