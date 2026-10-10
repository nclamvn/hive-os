# P3 R3 — exact-fixture parser worksheet, source-only partial

2026-10-08 · SAME081D8 · P3_SYNTHETIC_PRIVATE_SUMMARY_REPLAY.
STATUS: FIVE NAMED INITIALIZATION REGIONS ITEMIZED; WHOLE PARSE FIT OPEN.

This extends the approved R3 worksheet for the unchanged SCRIPT literal
`!!!f()()()()()()()();` (21 UTF16 units). It does not revise the fixture,
criteria, limits or predecessor reports. Evidence is plain source reading and
hand arithmetic only; no parser, program, import, hash, generator, compiler,
test, network or runtime effect was performed. This new document is the only
file authored in this turn. No protected/actual-source path was read or statted.

## Exact source and accounting premises

Anchors below are one-based lines, NOT original Acorn byte offsets:

- Checked P2 emitted text: `scripts/test/generated/private-grammar-tip081-p2.checked.candidate.mjs`, registration1129, getOptions1450, Parser1467–1517, initialContext3179–3182, curPosition4456–4460, Scope4462–4470, enterScope4471–4474.
- Handwritten P2 runtime: `scripts/test/private-grammar-runtime-tip081-p2.mjs`, reserve/meta/object/array114–169; frame/invoke/construct218–257; get/defineData/set258–359; primitiveString374–381; fixedOptions517 onward; linkDepth638 onward; registerNative701; intrinsicProperty735 onward; native push/create/call784 onward.
- Current P3 narrow overlay: `scripts/test/private-summary-runtime-tip081-p3.r3.mjs`, parse seam after knownError and before replayStart. It makes fixedOptions, allocates a capacity-two CONTROL_ARRAY, and performs TWO guarded numeric writes before construct(Parser,args). This is not an emitted `[options,text]` literal.
- Family-policy text: `scripts/test/derive-private-summary-tip081-p3.mjs:82–120`, read without invocation. NODE_SCHEMA includes reserveObject/constructor headers and schema charges even for non-AST objects; it is not an attempted-Node count. ARRAY covers backing/overlap; STRING covers key payload/conversion; CALL_FRAME covers guarded callable frames; BOOKKEEPING covers metadata/sanitization/descriptors.

The table uses these existing formulas rather than anonymous whole-function
cushions. Successful-path logical debits are cumulative and never refunded.
Failure can stop earlier. Captured primitive clock/weak/reflection operations and
handwritten-helper frames belong to the existing itemized startup/workspace T;
their new numerical R3 census remains a separate pre-effect obligation. Do not
add another per-call helper frame in this table or silently omit its T premise.

For a fresh object property with string key length L, absent at both descriptor
reads, set costs `16 + 128 + (72 + 2L) + 128 + 128 = 472 + 2L`, entries2.
Families are NODE_SCHEMA88, STRING2L, BOOKKEEPING384. A first set also creates
metadata224/entry1 once. These objects are private fresh Parser/Scope instances
with no same-name prototype accessor. Metadata created by the first set is
reused by construct's post-call meta lookup, not charged twice.

A fresh literal argument vector of capacity k costs `88 + 8k + 16 + 224 =
328 + 8k`, entries `k+1`. Empty AST lists cost328/entry1. An own data get costs
128+16=144; a Parser prototype-method get costs absent-instance128 plus found
prototype128+16=272. Numeric array key conversion costs96 before conversion.

## A. Fixed options and Parser prefix through its first options property

This region begins at the actual P3 parse seam's fixedOptions call and ends
after Parser's first `this.options = getOptions(e)` assignment. It does not
include later Parser fields or the invocation of `parse()` after construction.

| Event | Count / source shape | Bytes | Entries | Family detail |
| --- | --- | ---: | ---: | --- |
| fixedOptions record backing | 19 fields, 64+19*16; literal keyUnits278 | 368 | 0 | NODE_SCHEMA368 |
| ownObject adoption | sanitize16 + metadata224 | 240 | 1 | BOOKKEEPING240 |
| P3 parse argument vector | capacity2, reserve occupied2, sanitize+metadata | 344 | 3 | ARRAY104; BOOKKEEPING240 |
| Actual guarded numeric writes | args[0]=options and args[1]=text, no growth | 992 | 2 | NODE_SCHEMA32; STRING192; BOOKKEEPING768 |
| Parser callable entry | locals139, parameters3, actual arity2; nested0 | 2368 | 0 | CALL_FRAME2368 |
| Fresh Parser instance header | guarded construct; not Node constructor | 80 | 0 | NODE_SCHEMA80 |
| getOptions argument vector | literal capacity1 | 336 | 2 | ARRAY96; BOOKKEEPING240 |
| getOptions callable entry | locals0, parameters1, arity1; body returns e | 96 | 0 | CALL_FRAME96 |
| Fresh Parser metadata | created once during options set | 224 | 1 | BOOKKEEPING224 |
| Parser options property | L7, fresh slot, content OBJECT so no structural link | 486 | 2 | NODE_SCHEMA88; STRING14; BOOKKEEPING384 |
| **Region A total** | | **5534** | **11** | NODE_SCHEMA568; ARRAY200; STRING206; CALL_FRAME2464; BOOKKEEPING2096 |

The two numeric writes each cost496: schema16, numeric-key string96 and three
descriptor envelopes384. Capacity is already2, so growth is zero; the backing
reserve's two occupied memberships remain charged in addition to the two
actual missing-slot admissions. No source String conversion is performed by
fixedOptions/getOptions. The later Parser input String invocation is excluded.

## B. Initial location call and two undefined location fields

At Parser site530, method lookup272 + empty argument vector328/entry1 +
curPosition frame64 + own `this.options`144 + own options.locations144 =952.
locations is false, so there is no Position construction or location payload.
The two subsequent fresh fields `endLoc` L6 and `startLoc` L8 cost484+488=972,
entries4. Region B total1924/entries5: NODE_SCHEMA176; ARRAY88; STRING28;
CALL_FRAME64; BOOKKEEPING1568. Returned undefined is stored without coercion.

## C. Initial token context and Parser context property

At Parser site543: method lookup272; empty vector328/entry1; initialContext
frame96 (locals2, parameters0, arity0); own table read oe.b_stat144; returned
one-slot ARRAY336/entries2; Parser context property486/entries2. Region C
total1662/entries5: NODE_SCHEMA88; ARRAY184; STRING14; CALL_FRAME96;
BOOKKEEPING1280. The table context is a known OBJECT, not NODE/ARRAY; both
maximumChildDepth and linkDepth therefore create no depth queue/reverse edge.

## D. Three initial empty Parser list properties

Each empty ARRAY is328/entry1; Parser is OBJECT so assigning it does not enter
structural depth bookkeeping. All three properties are initially absent:

| Property / emitted site | L | Empty list | Fresh property | Total / entries |
| --- | ---: | ---: | ---: | ---: |
| labels / 567,569 | 6 | 328 | 484 | 812 / 3 |
| scopeStack / 581,583 | 10 | 328 | 492 | 820 / 3 |
| privateNameStack / 588,590 | 16 | 328 | 504 | 832 / 3 |

Region D total2464/entries9: NODE_SCHEMA264; ARRAY264; STRING64;
CALL_FRAME0; BOOKKEEPING1872. The scopeStack backing is still empty immediately
before Region E. These list creations are not counted again in E.

## E. Complete initial enterScope subtree, including its Parser caller

This region starts with Parser's prototype-method get and literal `[T]` vector
at site584, and ends after the native push inserts the completed Scope. It
excludes the already-counted scopeStack creation/property. T is primitive1.

| Event | Count / shape | Bytes | Entries | Family detail |
| --- | --- | ---: | ---: | --- |
| Caller method lookup | Parser miss then prototype data method | 272 | 0 | BOOKKEEPING272 |
| Caller vector | one literal flag | 336 | 2 | ARRAY96; BOOKKEEPING240 |
| enterScope entry | locals2, parameters1, arity1 | 128 | 0 | CALL_FRAME128 |
| Read scopeStack | own data get; intrinsic push lookup adds zero | 144 | 0 | BOOKKEEPING144 |
| Scope constructor vector | one literal flag | 336 | 2 | ARRAY96; BOOKKEEPING240 |
| Scope entry | locals18, parameters1, arity1 | 384 | 0 | CALL_FRAME384 |
| Scope header | normal private constructor, not Node | 80 | 0 | NODE_SCHEMA80 |
| Scope metadata | first flags set, post-construct reuse | 224 | 1 | BOOKKEEPING224 |
| Five fresh Scope fields | flags5,var3,lexical7,functions9,inClassFieldInit16: sum L40 | 2440 | 10 | NODE_SCHEMA440; STRING80; BOOKKEEPING1920 |
| Three empty Scope lists | var/lexical/functions | 984 | 3 | ARRAY264; BOOKKEEPING720 |
| Native push vector | literal one constructed Scope | 336 | 2 | ARRAY96; BOOKKEEPING240 |
| Captured push entry | native marker locals0, parameters0, arity1 | 80 | 0 | CALL_FRAME80 |
| scopeStack[0] insertion | below, original capacity0 | 592 | 1 | NODE_SCHEMA16; ARRAY96; STRING96; BOOKKEEPING384 |
| **Region E total** | | **6336** | **21** | NODE_SCHEMA536; ARRAY648; STRING176; CALL_FRAME592; BOOKKEEPING4384 |

The insertion consists of numeric key96, schema16, absent-slot descriptors
3*128, one slot membership, and old-plus-new backing `88+8*(0+1)=96`. Scope
is OBJECT, not NODE/ARRAY; linkDepth returns before any queue. Literal native
push argument vector itself does not guarded-set its literal element. The
marker was registered with no private host-prototype adoption at startup;
there is no per-owner function/prototype registration in this subtree.

## Combined new rows, private-call bound and exact remaining gap

The five regions are disjoint despite occurring at separated constructor
positions. Their subtotal is17920 bytes/51 cumulative entries/zero attempted
AST Nodes. Family subtotals: NODE_SCHEMA1632; ARRAY1384; STRING488;
CALL_FRAME3216; BOOKKEEPING11200. These are partial parse debits, not a full
Pp/Qp upper. Same selected grammar/runtime paths apply on replay under the
explicit COMMON_MODE same-source premise; no independent grammar theorem is
claimed. Per-family subtotals are far below their ceilings but cannot stand
in for the excluded paths' costs.

Local guarded private-call coexistence is at most3 from a depth-zero seam:
Parser enters at1; getOptions/curPosition/initialContext/enterScope at2;
Scope construct or captured native push at3, never simultaneously. Direct
runtime helpers and the P3 reserve/guard bridge do not increment the P2 callable
depth counter. No getter, setter or `.call` rest-vector branch is selected in
these five regions. This does not bound later wordsRegexp, strictDirective,
token/context or expression paths, nor prove VM/native stack containment.

Still excluded and specifically requiring numeric rows: four wordsRegexp
subtrees and exact string spelling/regex-descriptor costs; remaining Parser
fresh slots/reads and String/input/hashbang slice; strictDirective scalar
trivia/word branches; parse/startNode/statement/three unary/eight iterative-call
paths; all23 token transitions and context pushes/pops; AST linkDepth queues /
reverse memberships; finishNodeAt.call copied-rest vectors; Program body push,
directive adaptation and final EOF/finish. No arithmetic above establishes
the required full same-parse entries<=8745, five8/4MiB family uppers, total
T+Qp bound or whole private-call<128 bound. No actual unbound native-cost
contradiction was found in the five closed source regions; remaining work is
explicitly outside their claimed subtotal, not silently zero.

## Stop and provenance

Newly established work: actual P3 two-write argument seam, complete fixedOptions
prefix, initial-location/context/list rows, complete initial enterScope subtree,
five-family subtotal and local call-depth bound. This is beyond the earlier
trace skeleton, not another full-parse OPEN paraphrase. A provisional chat
arithmetic error naming fixedOptions656 was corrected before this report:
actual608=368+16+224. No measured result was ever asserted for that number.

Whole normal fixture FIT remains OPEN. Kernel/harness/tooling and effects are
not released by this worksheet. R2/P2 predecessors unchanged; all36 controls
UNRUN, compile OFF and tuples NOT_ISSUED. Stop for Main/non-own source review.
Aggregate870882.767416/900000ms and P3 remaining21440.727166 unchanged;
vibecode-kit author/report separation and preserved no-closure history apply.

## Second bounded checkpoint — F. Complete updateContext dispatch for 23 tokens

This APPEND preserves the preceding five tables/subtotal and their OPEN status.
Region F starts at finishToken's actual `this.updateContext(oldType)` method
lookup/vector and ends when that updateContext invocation returns. It excludes
the finishToken entry/other body writes, its own caller, token reading, scalar
trivia, next/nextToken and expression parsing. It closes the complete context
dispatch subtree, not the complete token subsystem.

Additional exact checked-source anchors: TokenType1357–1371 owns both keyword
and updateContext fields, including undefined/null; updateContext3219–3233;
parenR handler3239–3254; parenL handler3261–3267; name handler3309–3319;
finishToken5071–5081. Runtime native.call/rest-copy and pop/push are at844–862;
remove361–367; set/defineData300–359. Relevant parseSubscripts/ordinary-call,
empty parseExprList and name-only parseIdentNode branches were read as text to
confirm no alternate context mutation is selected by this exact literal.
The earlier broad navigation output was truncated; this checkpoint claims only
the named bounded spans and selected paths, not full coverage from that search.

### Exact dispatch multiplicities and context evolution

| New token type | Count | updateContext branch |
| --- | ---: | --- |
| prefix `!` | 3 | default beforeExpr=true |
| name `f` | 1 | name handler; value is neither of nor yield |
| parenL | 8 | parenL handler, all four keyword-table comparisons false |
| parenR | 8 | parenR handler with context length2 |
| semi | 1 | default beforeExpr=true |
| eof | 2 | default beforeExpr=false; final topLevel next reads EOF again |
| Total | 23 | six default branches, seventeen callable handlers |

All selected token keyword properties are own undefined, so the keyword/dot
special branch never reads m.dot. Initial context is `[b_stat]` with capacity1.
The ordinary `f` path is not async, class/function keyword, optional chain,
arrow or parenthesized expression. Each left parenthesis pushes p_expr at
index1, each right parenthesis pops it back to length1. Neither popped p_expr
equals b_stat, so the second pop/curContext branch is skipped. No context AST
edge/depth queue is formed: the pushed context is OBJECT, not NODE/ARRAY.

Each delete leaves retained fields/keyUnits/capacity charged. Only the first
push grows capacity1 to2, charging `88+8*(1+2)=112`; later pushes reuse capacity2
but still admit an actually absent numeric slot. Eight pops do not refund or
zero this metadata. Parentheses are sequential empty calls, not nested argument
grammar. This is a source-path premise, not an observed parse trace.

### New reusable replacement/call formulas

An existing ordinary own data replacement is416: schema16 plus set's first
descriptor128, defineData's existing descriptor128/sanitize16 and final
descriptor128. Families NODE_SCHEMA16/BOOKKEEPING400, no new memberships.
It is not the472+2L new-slot formula from the first checkpoint.

The existing ARRAY `length` setter instead costs144 (schema16/descriptor128)
and returns through setNative BEFORE defineData; no growth on reducing2 to1.
Removing numeric index1 costs112 (key conversion96 +remove schema16), not a
descriptor call. Reading numeric index1 costs240 (conversion96 +descriptor144).
These distinctions are included below.

Every callable token handler uses the actual `.call(this,oldType)` route:
two-literal vector344/entries3, markerCall frame96, one-slot rest backing336 /
entries2, and one numeric write into its initially missing slot496/entry1.
Dispatch subtotal1272/entries6, BEFORE the handler's separately charged frame.
Both zero-formal parenR and one-formal parenL/name handlers receive actual arity1.
Their frames are288 for locals13/parameters0 and192 for locals6/parameters1.

### Complete region-F event table

| Event group | Source-derived count / formula | Bytes | Entries |
| --- | --- | ---: | ---: |
| updateContext caller and common body | 23 * (method272 +one-vector336 +frame256 +own type/keyword/updateContext reads3*144) | 29808 | 46 |
| Default branch bodies | 6 * (beforeExpr read144 +existing exprAllowed replacement416) | 3360 | 0 |
| `.call` dispatch and copied-rest vector | 17 *1272 | 21624 | 102 |
| Actual handler frames | 8*192 +8*288 +1*192 | 4032 | 0 |
| Eight parenL handler bodies | first2304 +seven2192, detailed below | 17648 | 24 |
| Eight parenR handler bodies | 8*2024, detailed below | 16192 | 8 |
| Singleton f name handler body | five own reads720 +exprAllowed replacement416 | 1136 | 0 |
| **Region F total** | | **93800** | **180** |

ParenL per-body fixed work1696 comprises four m-table comparisons576, own
context144, table p_expr144, native push literal vector336/entries2, native push
frame80, and exprAllowed replacement416. Numeric missing-slot write adds
608/entry1 on the first push (16+96+384+112 growth) and496/entry1 on each later
push (no growth). No body-local function, regex/native conversion, callback or
AST Node is constructed by this handler.

ParenR per-body2024 comprises own context+own array.length288, another context
read144, native pop empty vector328/entry1 and frame64, numeric index read240,
numeric removal112, array.length replacement144, table b_stat read144,
popped-context isExpr read144, and exprAllowed replacement416. Context length
is always2 on entry, so no early return and no second-pop branch is included.

The f name body's five own reads are Parser.options, options.ecmaVersion,
m.dot, Parser.value for of, and Parser.value for yield. Both comparisons are
false, so exprAllowed/inGeneratorContext are not evaluated inside that test.
Its final replacement stores false. Parsing the f word itself remains excluded.

Region F five-family totals: NODE_SCHEMA1024; ARRAY7192; STRING3936;
CALL_FRAME12704; BOOKKEEPING68944. Their sum is93800. There are zero attempted
AST Nodes in this region. Entries180=caller vectors46 +call dispatch102 +left
body24 +right body8; frames, descriptor and replacement attempts add no entries.

Local private-call coexistence from immediately before updateContext invocation
is four guarded calls: updateContext, markerCall, selected handler and native
push/pop; the default branch uses only the first. Thus a finishToken frame
would add one more (five from its own pre-entry boundary). Runtime direct
set/get/clock helpers do not add P2 guarded callDepth. The unknown upstream
grammar/token caller nesting is NOT bounded by this local statement.

### Appended cumulative subtotal and stop

First checkpoint17920/51 plus F93800/180 gives111720 bytes/231 entries, zero
attempted AST Nodes in these disjoint covered regions. Updated family subtotals:
NODE_SCHEMA2656; ARRAY8576; STRING4424; CALL_FRAME15920; BOOKKEEPING80144.
No first table was replaced. This is neither a full parser upper nor a bound
on the uncounted work. In particular finishToken itself, readWord/readToken,
23 skipSpace/nextToken chains and whole upstream private-call coexistence remain
OPEN, as do the earlier constructor/AST/expression/finish paths.

The new closure is ALL23 context dispatches including the f singleton, exact
eight push/pop bodies, retained-capacity/delete semantics and actual native.call
rest-copy costs. Stop at this named bounded region rather than an indefinite
full-token expansion. No whole FIT/normal128 reachability/kernel release,
effects or test results follow. Compile OFF/all36 UNRUN/tuples NOT_ISSUED and
aggregate870882.767416/900000/P3 remaining21440.727166 remain unchanged.
