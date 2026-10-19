# TIP-081A — Complete pinned-text inspection / allocation-family audit

2026-10-07 · SAME081D8 engineering · revision 1 · parser OFF.

Status: TEXT_INSPECTION_COMPLETE_ALLOCATION_ENFORCEMENT_OPEN. This is an audit of
the installed pinned source as text, not an executed parser, AST or allocator
coverage proof. The stock parser is not admitted. No actual-root payload was read.

## Provenance and coverage

Only `node_modules/next/dist/compiled/acorn/acorn.js` and its named package metadata
were captured. Version string: 8.14.0. Source: 121634 UTF8 bytes / 119565 UTF16 units;
SHA256 `3c141146168735659c30b29c925fbf9fdf4d12ad85eb83d68e2afb26a1cc248d`.
Package: 51 bytes; SHA256
`aa6eff9593179bc7379017992eda314ce97bd7c6576869d82d514139ce612cca`.
Exact original bytes are preserved as 34574-byte gzip/base64 in
`TIP-081A_PARSER_TEXT_INDEX.json`, with metadata capture driver. No AST formatting,
import, require, eval, tokenization or target execution was used.

Locations below are **zero-based original UTF8 byte offsets of the function
keyword**, not line numbers or assignment prefixes. Non-ASCII Unicode tables make
byte offsets differ from UTF16 indices. The capture has both indices for 350 raw
textual function candidates. That index is navigation only: it does not delimit
bodies, detect every expression/allocation, or establish semantic completeness.

Inspection intervals (half-open):

| Reader | Entire contiguous partition read |
| --- | --- |
| Main | [0,20000), [20000,40000), [40000,60000), [60000,80000), [80000,100000), [100000,121634); truncated first-call gap repaired with [19200,20800) |
| Front auditor | [0,10000), [10000,20000), [20000,30000), [30000,40000), [40000,50000), [50000,62000) |
| Back auditor | [62000,72000), [72000,82000), [82000,92000), [92000,102000), [102000,112000), [112000,121634) |

Union: 121634/121634 bytes inspected, with Main plus partition auditor coverage.
This is **text coverage**, not 350/350 functions allocation-enforced. Helpers and
call-through across 62000 were reconciled rather than treated as free boundaries.

## Allocation-family catalogue and required controls

Every row describes observed explicit source operations and their required future
control. All stock input-dependent guard statuses are UNGUARDED. These rows do
not contain implemented guard identities or admitted cost constants. An adapter
release requires a separate exact occurrence-to-guard/fixture map; absent one,
`ALLOCATION_COVERAGE_OPEN` remains mandatory. Pop/delete/overwrite/reset/discard
must not return credit in the monotone producer/replay ledger.

### F01 — Module initialization / fixed tables / caches

Anchors: anonymous wrappers 17/32/66; TokenType7487, binop7776, kw7891,
wordsRegexp10863; TokContext48064; buildUnicodeData83518; export/footer after Word1.
Objects, option records, arrays of astral ranges, Unicode strings and concatenated
tables, token/context singleton objects, descriptors, closures and regex literals
allocate at initialization. `wordsRegexp` also replaces text, compiles native
RegExp and retains cache entries. Unicode initialization builds version maps,
nonBinary maps, aliases and regexes. Shared side-effect-import `te=[]`, new-args
`ce=[]` and template-error sentinel `ze={}` have module lifetime. Footer creates
export dictionaries; optional bundler `.ab=__dirname+"/"` has host side effects.

Required: private fixed loading surface, module/tool reservation **before source
overlap**, no inherited zero-cost cache assumption; fixed cache entry bounds.
Each slot/reference is charged even when the object it references is shared.
Host loaders/intrinsics/setters and native compilation internals remain separate
trust assumptions/OPEN costs, not target dependency closure.

### F02 — Public options / coercion / constructors / entry surfaces

Anchors: getOptions11951, callback closures12517/12614/12647, Parser12939,
prototype getters14757–15781, extend15843, public parse15984/expression16054/
tokenizer16164. Options `{}` and writes, callback closures, array normalization,
`String(input)`, regex/cache calls, keyword strings, source-offset slice/split,
context/labels/scope/private-name arrays and undefinedExports map precede AST work.
Input/options getters, plugins and caller program can execute arbitrary code.

Required: prohibit public APIs, caller objects, plugins, program, offsets,
callbacks, external token/comment arrays, locations/ranges/source-file options.
Only private primitive authentic text and internally constructed fixed options.
Parser state, all initializer effects and controlled internal context call targets
must have guards/pins. No callback counter makes the constructor safe.

### F03 — Strictness / whitespace / lookahead / directive scanning

Anchors: strictDirective16344, canInsertSemicolon17203, isLet19615,
isAsyncFunction20120, adaptDirectivePrologue42687, braceIsBlock48705;
import lookahead inside parseStatement20475. Native regex exec/test, match arrays,
captures and whole-tail slices occur repeatedly, including **before the first
node**. Directive raw slices remain retained in AST properties.

Required: reviewed index-based scanners with equivalent semantics, or explicitly
bounded before-call slice/match/capture reservations. No whole-source tail clone
without prior admission. Fixed regex hidden match/cache costs stay OPEN unless
replaced/accounted; source pin alone is not an allocation bound.

### F04 — Nodes / schemas / shallow copies / tentative productions

Anchors: parseStatement20475, buildBinary54645, Literal63627,
ParenAndDistinguish64074, Node78105, copyNode78782; every startNode/startNodeAt and
finishNode call-through. Node header/fields, optional location/range objects,
raw strings and `.regex={pattern,flags}` cost separately. copyNode creates default
fields then overwrites with aliases. Parenthesized/arrow/destructuring exploration
creates nodes, arrays and error records even when the branch is abandoned.

Required: node/header/property-schema guards before each growth, including copy
transients and failed attempts. Do not infer allocation count from final node
count. No all-node mirror array. Type rewrites and `delete operator` in
toAssignable43072 require a reviewed logical schema-mutation convention; native
hidden-class/dictionary transition size is not certified.

### F05 — Program / statement / declaration / export-import lists

Anchors: TopLevel19125, Switch25546, Block28645, Var29832, Class31529,
Export37134/specifiers40002, Import40226/specifiers41302, WithClause41704.
Body/case/consequent/declaration/class/specifier/attribute arrays, push slots,
per-entry nodes, exports/key dictionaries, Object.keys(undefinedExports),
initializer blocks and nested expressions all allocate. Abandoned branches still
charge. Shared empty arrays may not escape as mutable aliases.

Required: headers, capacity and resize old/new overlap reserved before growth;
independent caps for nodes and catalogue/sites. Guard every schema/list/map write,
including dense null slots. Static metadata is not free dynamic backing storage.

### F06 — Bindings / scopes / labels / context / private names

Anchors: Labeled27950; ClassStaticBlock35155; enterClassBody35679/
exitClassBody35800; BindingList45619; LValSimple46519/Pattern47436;
initialContext48590/updateContext49326; checkPropClash51287; Scope76451,
enterScope76571, declareName76765, LocalExport77619.
Scope records and three binding arrays; parameter/clash/private/export maps;
labels records and pushes; replacement label arrays with old aliases; token
context stack growth and `.call`; private-used propagation to parents. declareName
can add one var-name slot to **each enclosing scope**, not only the current one.
Keys/tags may allocate through concatenation or String conversion. Helper records
include DestructuringErrors17910 and per-call option/default records.

Required: dictionary key/header/row costs, fanout slot reservations before each
insert; bounded closed context dispatch; aliases and overwritten/popped stacks
retain charges. Scope depth alone does not bound entries or fanout work.

### F07 — Expression / pattern / function / template grammar

Anchors: Expression52036, MaybeAssign52335, ExprOp54000, MaybeUnary54931,
Subscripts57172/Subscript57827, ExprAtom59550, New65621, TemplateElement66659/
Template67100, Obj67895/PropertyValue69636, Method71202/Arrow71817/
FunctionBody72257/Params73106/ExprList73257, PrivateIdent75169.
Sequence `[first]`, arrow `[identifier]`, argument/parameter/object/property lists,
rest/spread/computed/meta/import nodes, template `{raw,cooked}` records,
`{isTagged:true}` or defaults, template quasis/expressions and clash maps allocate.
Function bodies reset labels, enter scopes and run directives. Literal/string
raw/cooked lookahead calls through to F03/F09/F10/F11.

Required: guards before tentative and successful allocation, not finishNode-only;
schema writes and list backing separate from node count. Entire supported grammar
and call graph must be mapped; an expression-family sample cannot admit the rest.

### F08 — Independent recursion and CPU dimensions

Anchors: ExprOp54000, MaybeUnary54931, toAssignable43072/LValPattern47436,
pattern-export38884; tokenizer plus/min/lt/gt; regex disjunction87836/group calls.
Grammar/pattern/validation helpers recurse before complete AST depth is known.
Legacy HTML-comment paths in readToken_plus_min/readToken_lt_gt skip a comment
then recursively call nextToken. Regex groups/classes and BranchID ancestry are
independent depth/work axes. String/comment/number scans can be long with no node.

Required: guarded pre-entry recursion frames, reviewed helper-chain multiplier or
explicit bounded stack; remove iterative-comment tail recursion in the adapter.
Depth128 applies to grammar/traversal/metadata as specified, not an assertion that
all JS call stacks equal AST depth. Bounded char/operation clock checkpoints and
controlled supervisor deadline; synchronous native calls cannot be interrupted
by a later token callback. No stack/time proof established in this audit.

### F09 — Regex validation / branches / native literal compilation

Anchors: BranchID83989, RegExpState84293/reset84925/raise85288,
flags86588/pattern87079/disjunction87836, readRegexp112727.
Source/flag strings, regex state/map/backreference arrays; per-validation map
reset; named-group lists and BranchID sibling records. Validation may run twice.
Modifiers/identifiers/Unicode properties concatenate code-point strings;
class-set lookahead repeatedly constructs literal arrays `[38,38]`, `[45,45]`,
`[92,113]` even for unsuccessful attempts. After validation stock readRegexp invokes
**native `new RegExp(pattern,flags)`** and creates token literal value records.

Required: refuse regex-literal entry before slicing/validation/native construction
until a bounded syntax-preserving alternative is separately admitted. Do not
classify this refusal as invalid JavaScript. A future validation-only replacement
must guard all state, two passes, literals, recursion and diagnostics; native
execution value is not needed for syntax analysis. Current path UNGUARDED/OPEN.

### F10 — Numeric / BigInt conversions

Anchors: stringToNumber114275, stringToBigInt114369, Radix114492, Number114907,
Literal63627. Digit scanning, radix/source slices, underscore replace regex and
copies, native parseInt/parseFloat and BigInt, legacy-octal test on a slice;
literal BigInt spelling is sliced/replaced and retained separately.

Required: bound scan/digit/derived-string work before native conversion; exclude
target BigInt before its conversion until equivalent bounded syntax-only handling
is reviewed. Number conversion result does not prove memory/time of its input
work. Never evaluate target numeric expressions.

### F11 — Strings / templates / escaped identifiers / token APIs

Anchors: Token104923/next105150/iterator105594/nextToken105710,
comments106369/106815, String116216, Tmpl117169, invalid118060,
Escaped118510, Word119824. Tokens, optional positions/ranges/comment objects,
iterator closures and `{done,value}` records; character/code-point strings;
slices and cumulative concatenation of raw/cooked/escaped forms. Template failure
keeps attempted cooked allocations before invalid raw fallback. Octal escape
uses substr+`.match(/^[0-7]+/)` match array plus strings. Comments and non-ASCII
whitespace invoke native strings/tests; keywords use retained regex tables.

Required: private token path only; no exported iterator/getToken/comment hook.
Charge all source-derived UTF16 payloads and old/new concatenation overlap
without assuming interning/ropes/shared slices or GC. Replace fixed match/test
helpers with reviewed scalar scanning where needed. Failed cooked/raw paths may
not refund producer charge. Character work uses F08 time controls.

### F12 — Errors / outputs / native and host unknowns

Anchors: unexpected17839 and transitive raise76142/curPosition/getLineInfo11420,
RegExpRaise85288, footer exports. Dynamic labels/names/source-pattern error
messages, Position and SyntaxError objects/native stacks allocate on failing
paths. Receipt/summary canonical output is outside the grammar and needs its
own bounded codec/admission inventory; old synthetic codec proves only its scope.

Required: reserve a fixed refusal record before work; map failures to bounded codes
without unbounded message/source excerpt or native stack creation in the adapter.
Caught exceptions do not make allocations free. Native regex/replace/match,
coercion, BigInt, number conversion, object shape/capacity, string representation,
JIT/GC, physical RSS and hostile host hooks are not portable byte bounds. Logical
ledger conventions must state these exclusions/assumptions. No physical sandbox
or independently correct grammar theorem follows from full-text inspection.

## Feasibility, independence and disposition

Existing bounds remain conjunctive: 67108864 logical bytes, 20000 catalogue/sites,
200000 nodes, depth128, lifetime120000ms, remaining aggregate below. Historical
largest-source reservation is 53217937 bytes, leaving **13890927 bytes** for every
tool/parser/AST/list/string/output/replay addition, not AST alone. Source is
13448165 bytes / 13437236 UTF16 units / 26874472 decoded bytes; base12895300.
No actual source/node count was read or measured this turn.

Illustration only, NOT adopted costs: at 256 logical bytes/node, 200000 nodes
would reserve 51200000 bytes before lists/strings/replay, already more than that
headroom. Thus node limit is a ceiling, not a promised capacity. Feasibility must
use admitted costs and transition peaks; one cannot declare fit or impossibility
from this illustration. Producer charge remains unreclaimed through replay.

Native costs, occurrence-to-guard completeness, bounded-helper replacements,
semantic equivalence and shared grammar/ownership common-mode risks remain OPEN.
Both auditors independently catalogued source families; neither ran Acorn or
claims enforced-site coverage. Main completed the full source read and reconciled
anchors against its pinned index. Implementation plan is in
`../contractor/tips/TIP-081A_REAL_CONSUMER_IMPLEMENTATION_PLAN.md`.

Measured capture helper: 26.929292ms; conservative capture/wrapper allowance1000ms.
Upper increment1026.929292ms; cumulative782840.4011670001/900000ms,
remaining117159.59883299994ms. Read-only review does not reset these values.
No tests/type/lint/build/E2E/runtime/source-integration/math/Git actions. Frozen
product modules/tests/config/history untouched; no fresh predecessor-pin scan or
full-root claim. Whole graph OPEN, fullRuntimeClosure NOT_ACCEPTED, predecessor
62 OPEN obligations unchanged. Audit/plan completion does not remove these gates.
