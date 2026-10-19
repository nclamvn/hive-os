# P3 R3 — complete selected NORMAL parser path, source-derived upper

2026-10-08 · SAME081D8 · P3_SYNTHETIC_PRIVATE_SUMMARY_REPLAY · engineering.
STATUS: AUTHOR_COMPLETE_SELECTED_PATH_UPPER / NON_OWN_REVIEW_PENDING.

CURRENT AUTHOR BOUND: the final correction appendix below supersedes the first
author K/full arithmetic. Corrected Qp1387262/2165; maximum guarded coexistence25
is unchanged after source-order reconciliation. Independent reread is pending.

Exact unchanged SCRIPT fixture: `!!!f()()()()()()()();`, 21 UTF16 units.
This follows PARSER_PORT_CLOSURE and latest CORE_INTEGRATION_COMPLETION, not a
new family, resource limit, experiment or effect grant. Full PARSER_WORKSHEET,
PARSER_FIT_FREEZE (including preserved/superseded keyword proof), G_SOURCE_REVIEW,
approved R3 plan, frozen contract, protocol and latest handoff/ACTIVE were read.
All evidence here is named synthetic source TEXT and explicit arithmetic.
No parser, import, hash, census, derive, generator, syntax/check/test, runtime,
network or protected/actual-source operation occurred. Only this new report is
authored. Predecessor A–G history and all code/artifacts remain unchanged.

## Boundary, source anchors and upper conventions

The covered parse starts at actual `__HIVE_P3_parse` fixed-options/control-vector
seam and ends with its returned Program. Owner creation, static initialization,
P3 producer/verifier extraction/codec and observation are NOT grammar Qp. Their
source/capacity/T gates stay separate. Replay repeats this same fixed grammar
path under the expressly COMMON_MODE premise; this is not independent grammar
semantics or allocation enforcement proof.

One-based anchors below refer to
`scripts/test/generated/private-grammar-tip081-p2.checked.candidate.mjs`, NOT
original Acorn byte offsets. Bounded selected source spans were read fully:
parse1519–1525; accessors1528–1542/1572–1576; eat/isContextual1646–1660;
semicolon1685–1690; DestructuringErrors1710–1715; checkExpressionErrors1726–1741;
topLevel1758–1784; isLet/isAsync selected false entries1787–1817;
statement1818–1892; expressionStatement2199–2204; directive2899–2912;
curContext3183–3187; expression/assignment/conditional/ops3375–3518;
unary/subscripts3519–3706; name atom3707–3748 plus registered footer3800;
empty exprList4310–4340; identifier/checkUnreserved4341–4402;
scopes4533–4555; Node/finish4556–4597; next/token4979–5034;
skipSpace/finishToken5066–5083; eq/excl5187–5201; selected getToken5235–5254,
5306–5323; word5669–5718; hook registrations5733–5739;
scalar entry/body1160–1243 and identifier-start1347–1352.
Incidental large declaration/navigation truncations are NOT coverage evidence;
only selected finite bodies/branches and their visible registration tuples are
used. Unselected arrow/member/template/regexp/native branches are not enabled
by this fixture or counted as executed.

Handwritten `private-grammar-runtime-tip081-p2.mjs`: reserve/adopt114–169;
depth checks170–178; frame/invoke/construct218–257; get/set258–359;
increment/string366–387; slice480–491; empty args/links/depthItem610–683;
native registrations701–705/1066–1090; intrinsic/native735–864;
keyword test942–982. Normal P3 `.r3` parse seam180–188 and unchanged family
mapping in derive-private-summary-tip081-p3.mjs82–120 were also read as TEXT.

Use family order NODE_SCHEMA / ARRAY / STRING / CALL_FRAME / BOOKKEEPING.
Every generated literal control vector of arity k costs `328+8k`, entries k+1,
families ARRAY `88+8k`, BOOKKEEPING240. Frame is exactly
`64+16*(registered locals+registered formal parameters+ACTUAL arity)`, not just
locals/formals. Registered nested count is zero for all selected calls.

Prior fresh set formula `472+2L`/entries2 and existing replacement416 remain.
Numeric absent ARRAY write at retained capacity costs496/entry1; first growth
0→1 adds96, giving592. These do not include structural link work.

For remaining ordinary generated data-get occurrences, deliberately use the
uniform safe upper272 BOOKKEEPING: own data144; a missing Node field traverses
instance and its private Node prototype256; Parser prototype method272.
Captured host prototypes are stopped before reflection. String length/intrinsic
lookups are zero but finite explicitly named length occurrences may retain this
upper; this is excess on those operations, not an anonymous function cushion.
Method lookups are separately counted, never also in the data-read tables.
Native intrinsic method lookup is0; direct lexical helper lookup is0.
Numeric-key spelling96 is additional where listed.

Getter reads cannot be bounded merely by272. The three selected Parser accessors
inGenerator/inAsync/inClassStaticBlock are explicitly expanded below, including
implicit empty argument vectors, their frames, called scope helpers and loops.
No canAwait/canInsertSemicolon/other accessor is reached for this exact path.
Direct handwritten helper workspace/captured reflection/clock/weak operations
remain the inherited source-inventoried T premise; do not duplicate them as
per-call grammar frames or claim T is presently known.

## Fixed path and all loop multiplicities

One Program, one expression statement; no directive, label, assignment, comma,
binary, postfix, arrow, optional chain, member, spread or nonempty argument.
The three prefix UnaryExpressions recurse into one name atom, then a single
iterative parseSubscripts loop produces eight ordinary CallExpressions.
It runs nine times including the final unchanged-callee exit.
Each empty parseExprList evaluates its eat(parenR) condition once and executes
ZERO loop-body iterations. No recursive parseMaybeAssign inside those lists.

AST Nodes14: Program1, ExpressionStatement1, UnaryExpression3,
CallExpression8, Identifier1. Structural depth14; f1, Calls2..9, Unaries10..12,
statement13, body ARRAY13 (zero contribution), Program14. No tentative extra
Node/copy is selected. Eight empty args arrays plus Program body are created;
only body has one occupied structural slot.

Tokens: !3, f1, parenL8, parenR8, semi1, EOF2 =23. Initial parse nextToken1
plus next22. next sources: prefix3, parseIdent1, successful eat17, final topLevel1.
eat50: four tests per nine parseSubscript passes36; empty-list close tests8;
four unary starstar tests4; conditional question1; semicolon1.
Success17=parenL8+parenR8+semi1; other33 fail without next. No ASI helper runs.
TopLevel loop condition twice/body once. adaptDirectivePrologue checks its sole
statement once, sees its expression is UnaryExpression, and runs zero body loops.
Scope helper loops each see only initial Scope(flags1), return at index0, and
do not decrement/re-enter.

The23 scalarTrivia calls made by skipSpace have21 single-iteration nontrivia
breaks and two EOF zero-iteration paths. First characters are !/f/()/; only;
there is no comment/hashbang/line/gap/Unicode branch. readWord1 runs two iterations:
f admitted/increments once, then '(' fails continuation/breaks; one final slice
and concat, no escape. Constructor strictDirective's separate first-! path is
already G, not counted here again.

## H. ALL14 Node creations, including callers and wrappers

Six startNode callers: Program, statement, three unary nodes, identifier.
Eight startNodeAt callers: Call nodes. No copyNode/other constructor.

- Node body/header/meta: frame496 + header80 + first metadata224 + three fresh
  type/start/end sets (key units12:1440) + six fixed options/data reads864 =3104,
  entries7, attempted Node1. Family vector344/0/24/496/2240.
- Each actual Node constructor literal vector3 costs352/entries4, A112/B240.
- Each startNode caller/wrapper excluding the preceding construct vector/body
  costs lookup272+empty vector328+wrapper64+start/startLoc reads288 =952/entry1.
- Each startNodeAt caller/wrapper costs lookup272+vector344+wrapper128 =744/
  entries3; no extra this.start/startLoc reads in that wrapper.

H=`6*952+8*744+14*(352+3104)=60048`, entries184, attempted Nodes14.
Families4816/2928/336/8352/43616. H includes ALL start-node caller lookups,
vectors/wrappers/construct vectors and bodies; outer rows do not repeat them.

## I. ALL14 finishes, including actual native.call rest copying

Each finish: lookup272 + caller vector344 + finishNode frame160 + two Parser
last-token reads288 + five-slot `.call` vector368 + markerCall frame144 +
four-slot rest360 + FOUR actually missing numeric writes1984 + finishNodeAt
frame384 + two existing type/end replacements832 + four option reads576
=5712/entries18. The rest backing reserves four occupied slots and writes admit
four more memberships, both cumulative. No location/range payload branch runs.
The native `.call` lookup itself is intrinsic0, not another prototype read.

I=79968/252; families1344/4928/5376/9632/58688. No direct finishNodeAt wrapper
or additional Node is called. All outer finish caller work is included here.

## J. ALL structural links, ancestor queues and reverse memberships

22 links: eight callee, eight arguments ARRAY, three unary argument, statement
expression, Program.body, and body[0]. Program.body is attached EMPTY before
statement parsing, so the final body insertion traverses ARRAY then Program;
other21 new parents have no parents yet and use one queue item each.

Queue one-item cost: empty328 + two-field item336 + first numeric push592
=1256/entries3. Queue two-items: preceding1256 + item336 + second push608
=2200/entries5. Every child gets its first reverse CONTROL_ARRAY plus first
push328+592=920/entries2. Reverse lists are bookkeeping and create no recursive
structural edges. All22 are first such child-parent affiliations.

J=`21*1256+2200+22*920=48816`/112.
Equivalently44 empty lists,23 two-field depth records and45 numeric pushes
(44 first592, one second608). Families2928/8208/4320/0/33360.
Depth checks precede edge commits; maximum proposed14. No queue work is silently
omitted when a proposed depth equals a previously known depth.

## K. Remaining grammar, identifier, empty calls and accessor paths

All caller vectors/lookups/frames below are outside H/I/J/F/A–E/G and token L.
Calls to next/nextToken and all their caller vectors are included in L, not K.
The Z constructor vectors/bodies are in a separate K row below.

| Callee | Count | Actual arity | Registered locals/formals | Frame per call | Method lookups |
| --- | ---: | ---: | --- | ---: | ---: |
| parse |1|0|7/0|176|1|
| parseTopLevel |1|1|26/1|512|1|
| parseStatement |1|3|73/3|1328|1|
| isLet |1|1|6/1|192|1|
| isAsyncFunction |1|0|5/0|144|1|
| isContextual |7|1|0/1|96|7|
| parseExpression |1|0|21/2|432|1|
| parseMaybeAssign |1|2|77/3|1376|1|
| parseMaybeConditional |1|2|29/2|592|1|
| parseExprOps |1|2|9/2|272|1|
| parseExprOp |1|5|18/5|512|1|
| parseMaybeUnary |4|4|62/4|1184|4|
| parseExprSubscripts |1|2|19/2|432|1|
| parseExprAtom |1|2|119/3|2048|1|
| parseIdent |1|1|12/1|288|1|
| parseIdentNode |1|0|16/0|320|1|
| checkUnreserved |1|1|14/1|320|1|
| parseSubscripts |1|5|15/5|464|1|
| parseSubscript |9|7|113/7|2096|9|
| parseExprList |8|4|19/4|496|8|
| checkExpressionErrors |12+3|2 /1|2/2|160 /144|15|
| eat |50|1|2/1|128|50|
| semicolon |1|0|4/0|128|1|
| adaptDirectivePrologue |1|1|10/1|256|1|
| isDirectiveCandidate |1|1|0/1|96|1|
| native regex.test |2|1|0/0|80|0|
| native Object.create |1|1|0/0|80|0|
| native body.push |1|1|0/0|80|0|
| implicit inGenerator getter |1|0|4/0|128|1|
| implicit inAsync getter |1|0|4/0|128|1|
| implicit inClassStaticBlock getter |1|0|2/0|96|1|
| currentVarScope |3|0|4/0|128|3|
| currentThisScope |1|0|4/0|128|1|

123 calls, arity sum228, literal/implicit vectors42168/entries351:
ARRAY12648, BOOKKEEPING29520. Frames sum48064;119 real method/accessor lookups
at272 add32368 BOOKKEEPING. Intrinsic/direct lookup-zero cases are shown, not
rounded into an anonymous invocation fee. Call subtotal122600/351.

isContextual7=let, async, yield and four await tests. Six prefix-start tests stop
at token!=name; f's await test stops at value mismatch. No canAwait getter.
checkExpressionErrors15=three prefix, base unary, eight calls, exprOps,
conditional, maybeAssign. Twelve two-argument and three one-argument calls.
Its null-input early returns are upper-counted as at most two reads, never
assumed to allocate a new error object. Z9=initial maybeAssign plus eight calls.

### Bounded data-get occurrence table (method lookups excluded)

| Region | Selected-path occurrence upper | Breakdown |
| --- | ---: | --- |
| parse |2|options/program|
| topLevel |10|body1 + twice(type/eof)4 + push body1 + inModule1 + directive arg body1 + sourceType options2|
| statement |23|type1 + twenty switch-case table comparisons + value1 + name table1; initial ! prevents label test continuation|
| seven isContextual |21|at most type/name/value3 each; all fail before containsEsc|
| expression |4|start/startLoc/type/comma|
| maybeAssign |8|start/startLoc2 + two(type/table) comparisons4 + final type/isAssign2|
| conditional |3|start/startLoc + question table|
| exprOps |4|start/startLoc + result.start/type|
| exprOp |2|type/binop; semicolon binop null, no binary body|
| four unary bodies |37|three prefix ten each (start2,prefix2,incDec2,value,strict,operator,starstar) + base seven (start2,prefix2,postfix2,starstar); t=true skips privateId|
| exprSubscripts |3|start/startLoc + result.type; e=null|
| name atom |14|slash pair2 + potentialArrow/start2 + type1 + super/this/name case tables3 + start/startLoc/containsEsc3 + options/ecma/name3; r=false skips arrow branches|
| parseIdent / parseIdentNode |1+3|returned name1; type/name/value3|
| checkUnreserved |9|Node start/end/name3, scope class-field1, keywords1, options/ecma2, strict1, reservedWords1; three accessors separate|
| parseSubscripts |21|initial options/ecma/type/name4 + optional9 + changed-result type8|
| nine parseSubscript bodies |128|nine common options/ecma2+four token tables4 =54; eight calls each saved positions3+parenR1+options/ecma2+restore reads3 =72; final backQuote pair2|
| checkExpressionErrors |30|at most shorthandAssign/doubleProto two each|
| eat |50|type once per invocation|
| semicolon |1|semi table|
| directive adaptation |2|body length/index0; loop body zero|
| isDirectiveCandidate |5|options/ecma2 + statement type1 + expression/type2, not Literal|
| three accessor bodies |3|returned scope flags once each; false bit prevents additional scope calls|
| three currentVarScope |15|five each: scopeStack/length2 + scopeStack/index2 + flags1|
| currentThisScope |6|scopeStack/length2 + scopeStack/index2 + two flag reads|
| **Total** |**405**|**110160 BOOKKEEPING at272**|

Five numeric gets (adapt index0, three currentVarScope indices, one currentThisScope)
add480 STRING. No implicit native numeric-key conversion remains unpriced.

### Other K allocation attempts

| Event | Formula / count | Bytes | Entries | Families N/A/S/F/B |
| --- | --- | ---: | ---: | --- |
| Nine complete DestructuringErrors constructs | each empty vector328, frame304, header80, meta224, five fresh fields keyUnits75 at2360+150; not AST Node |31014|108|4680/792/1350/2736/21456|
|37 fresh additional AST fields | keyUnits278,37*472+556 |18020|74|3256/0/556/0/14208|
| Nine empty AST arrays | eight args plus body;9*328 |2952|9|0/792/0/0/2160|
|48 existing Parser position replacements | eight calls reset/restore yieldPos/awaitPos/awaitIdentPos (6 each),48*416 |19968|0|768/0/0/0/19200|
| body[0] write excluding J links |0→1 retained backing592 |592|1|16/96/96/0/384|
| TopLevel create(null) object excluding caller |64+16+224 |304|1|64/0/0/0/240|
| Two native keyword/reserved tests' tail slice |each suffix2,64+2*2 |136|0|0/0/136/0/0|

Fresh37 fields: Program.body4/sourceType10; Identifier.name4; eight calls each
callee6/arguments9/optional8; three unary each operator8/prefix6/argument8;
ExpressionStatement.expression10. Lists and structural work are separate.
DestructuringErrors keys: shorthandAssign15/trailingComma13/
parenthesizedAssign19/parenthesizedBind17/doubleProto11, total75.
The regex test loops only over fixed private descriptor spelling; it can create
only the named suffix2 slice68 on this keyword pattern path, no native RegExp,
capture list or target callback. indexOf/character comparisons are scalar.

K total306226/544; family8784/14328/2618/50800/229696.

## L. ALL23 token transitions outside already covered F

The following includes all next/nextToken CALLER vectors/lookups. F alone owns
updateContext invocation, handler `.call` copying, context mutations and their
reads. No F amount is repeated. FinishToken's frame/other writes are L.
Direct hooks have their registered guarded frames, not free native calls.

| Callee | Count | Actual arity | Registered locals/formals | Frame | Real method lookups |
| --- | ---: | ---: | --- | ---: | ---: |
| next |21+1|0 /1|16/1|336 /352|22|
| nextToken |23|0|21/0|400|23|
| curContext |23|0|0/0|64|23|
| skipSpace |23|0|4/0|128|23|
| scalarTrivia |23|5|19/5|528|0|
| tick hook |23|0|0/0|64|0|
| char hook |23|2|0/2|128|0|
| scalarSpace |23|1|0/1|96|0|
| scalarLine |23|1|0/1|96|0|
| fullCharCodeAtPos |21|0|6/0|160|21|
| native charCodeAt |24|1|0/0|80|0|
| readToken |21|1|4/1|160|21|
| isIdentifierStart |21|2|0/2|128|0|
| getTokenFromCode |20|1|55/1|976|20|
| readToken_eq_excl |3|1|14/1|320|3|
| finishOp |3|2|8/2|256|3|
| native slice for bang |3|2|0/0|96|0|
| readWord |1|0|8/0|192|1|
| readWord1 |1|0|14/0|288|1|
| scalarStart |2|1|0/1|96|0|
| scalarContinue |1|1|0/1|96|0|
| slice hook |1|3|0/3|160|0|
| concat hook |1|2|0/2|128|0|
| native keyword test |1|1|0/0|80|0|
| finishToken |19+4|1 /2|17/2|384 /400|23|

353 calls, total arity366. Vector histogram k0=136,k1=138,k2=55,k3=1,k5=23;
all other counts0. Vectors118712/entries719, ARRAY33992/BOOKKEEPING84720.
Frames84896;184 real method lookups50048 BOOKKEEPING. No hidden dynamic helper
creation/registration/prototype adoption occurs per token; those are T/static.

tick/char/space/line23 each:21 nontrivia scalarTrivia iterations + two word1
iterations. Two EOF trivia calls add only scalarTrivia's entry/frame/vector,
not fictitious while work. Native char24=21 ASCII fullChar peeks plus three
eq/excl next-character peeks. ScalarStart2=first f test + scalarContinue's
internal start test for '('; no third word iteration.

finishToken arity1 on seventeen paren/semi plus two EOF; arity2 on three bangs
and one name. No override/context token hook is enabled; no onToken/location
callback or Position construction. getTokenFromCode20=bang3+paren16+semi1.
Its scalar numeric switch tests create no data reads; selected20 bodies never
reach any other token reader. FullChar sees only ASCII and returns before the
surrogate second-peek branch.

### Remaining token data reads and replacements

| Region | Occurrence upper | Named derivation |
| --- | ---: | --- |
| next |176|22*(type/keyword2+options/onToken2+end/start/endLoc/startLoc4)|
| nextToken |184|23*(preserveSpace1+pos1+options/locations2+pos/input/length3) + nonEOF override21 + EOF table2|
| curContext |92|23*(context2+length1+numeric index1)|
| skipSpace |138|23*(input,pos,inModule,lastTokEnd,options,allowHashBang)|
| scalarTrivia loop condition |23|one primitive length test per call (upper-charged even though dynamic cost0)|
| fullChar |42|21*(input,pos)|
| readToken |42|21*(options,ecmaVersion)|
| getToken selected bodies |34|seventeen pos-increment reads + seventeen token tables|
| eq/excl |9|three*(input,pos,prefix table)|
| finishOp |12|three*(input,pos,pos,increment-pos read)|
| readWord |2|name table,keywords|
| readWord1 |14|chunk pos1+two loop-condition pos/input/length6+two char args input/pos4+final slice input/pos2+increment pos1|
| finishToken excluding F |92|23*(pos,options,locations,old type)|
| **Total** |**860**|**233920 BOOKKEEPING at272**|

Numeric curContext index gets add23*96=2208 STRING. Existing writes225:
next88(last4 each), nextToken23(start), skipSpace23(pos), finishToken69
(end/type/value), selected punctuator increments17, finishOp pos3,
readWord1 containsEsc/pos2. `225*416=93600`, N3600/B90000, no memberships.
Increment's read is in the data table and its replacement here, not omitted.

Remaining strings398: three bang slices66 each, final word slice66 and
empty+f concat66, keyword-test suffix68. All spans are exact one/two units;
no keyword spelling, normalization, numeric/BigInt/RegExp native work is invoked.

L total583782/719; families3600/33992/2606/84896/458688.

## Disjoint full Qp and all simultaneous grammar ceilings

| Region | Byte upper | Entries | N/A/S/F/B |
| --- | ---: | ---: | --- |
| Reviewed A–F+G |307566|351|6208/10856/169814/18672/102016|
| H all Node creations |60048|184|4816/2928/336/8352/43616|
| I all finishes |79968|252|1344/4928/5376/9632/58688|
| J structural queues/reverse links |48816|112|2928/8208/4320/0/33360|
| K remaining grammar/accessors |306226|544|8784/14328/2618/50800/229696|
| L remaining tokens/trivia |583782|719|3600/33992/2606/84896/458688|
| **FULL SELECTED-PATH UPPER Qp** |**1386406**|**2162**|**27680/75240/185070/172352/926064**|

This is conservative on named descriptor reads and G's bounded fixed keyword
replacement, not an exact observed total. Entries are a full upper, including
occupied argument-vector admissions, missing writes, weak metadata, reverse
lists and queue items; no refund or dedup is used. Attempted Nodes exactly14
on this source-path premise. Entries2162<=8745 (margin6583).
NODE_SCHEMA27680<=8388608; each other family75240/185070/172352/926064
<=4194304. All families retain their own budgets; no borrowing.

### Guarded private-call coexistence (not physical/native stack)

Constructor maximum4 is the reviewed G premise. Parsing spine depths:
parse1 → topLevel2 → statement3 → expression4 → maybeAssign5 → conditional6 →
exprOps7 → unary8/9/10/11 → exprSubscripts12 → parseSubscripts13 →
parseSubscript14 → empty exprList15 → eat16 → next17 → nextToken18 →
readToken19 → getTokenFromCode20 → finishToken21 → updateContext22 →
markerCall23 → selected paren handler24 → native push/pop25.
The list's zero-iteration body prevents another expression recursion.
Each of the eight calls reuses this finite spine sequentially, not cumulatively.

Other branches are shorter: Identifier path exprAtom13→parseIdent14→
parseIdentNode15→startNode16→Node17; identifier-next path peaks23 in context
dispatch. Deepest scalar path nextToken18→skipSpace19→scalarTrivia20→
char/space/line/tick21. Direct scope getters add at most two guarded levels
from checkUnreserved15, including their single-iteration scope helper.
Finish at parseSubscript14 adds finishNode15→markerCall16→finishNodeAt17.
Data get/set/linkDepth direct helper loops do not increment P2 callDepth;
their bounded named workspace is T, not an ignored JS stack theorem.
All selected private guarded frames coexist at most25<128. AST precommit
depth14<128 independently. No recursion argument relies on lexical Node count
alone or a parser execution/oracle.

## Exact T feasibility ordering and stop

Complete source-path Qp supplies the conditional inequality required by
PARSER_PORT_CLOSURE: `T+1386406<=34649500`, equivalently `T<=33263094`.
No actual new R3 numerical census/T is known or inferred from owner observations,
old T, a source-size residual or this worksheet. Source authoring may be bound
to that maximum T; actual independent new static/bootstrap/workspace census,
source/emitted/composition review must satisfy it BEFORE effects/admission.
This ordering is not circular and does not waive the T gate or host/native costs.

This author report closes the previously unsummed selected-path obligation only
subject to Back/Main non-own reconciliation. It is NOT actual NORMAL FIT/PASS,
full205 integration, semantic/math/physical-memory closure or effect release.
Scalar semantics were authored earlier by this reviewer and are NOT self-cleared
here; unchanged independent semantic acceptance remains a separate premise.
COMMON_MODE grammar/replay assumptions, real gate/caller graph and62OPEN remain.

All36/205 UNRUN/runtime0/8/compileOFF/tuples NOT_ISSUED. ZERO effects/reservations;
aggregate870882.767416/900000ms/P3remaining21440.727166 unchanged. No code,
caps, fixture, grammar, predecessor record or native-cost convention was changed.
STOP for independent source review; full harness waits its named source release,
and effects wait complete source/census/emitted/process/admission/reservations.

## Final independent-review correction — missing expression-statement invocation

2026-10-08 · AUTHOR_REPAIRED / NON_OWN_REPAIRED_REREAD_PENDING.
Back's ONE full selected-path review found exactly one missing ordinary invoke:
candidate default-branch caller1890 → parseExpressionStatement2199–2206.
The original K123-call arithmetic and original full1386406/2162 remain above as
preserved UNDERCOUNTED author history, expressly superseded here. They are not
the current source upper or a previously accepted FIT result.

The invocation's actual arity2, registered locals7/formals2, gives frame
`64+16*(7+2+2)=240`. Caller method lookup272 plus literal vector344/entries3
(ARRAY104, BOOKKEEPING240) plus frame240 gives **856 bytes /3 memberships**,
family delta **0/104/0/240/512**. No extra Node, AST-field write, structural link,
finish or data-get is added: those expression-statement actions were already
priced in H/I/J and K's fresh-field row. This is one omitted caller/vector/frame,
not a new fixture, source family, resource convention or anonymous cushion.

### Current K invocation and region totals

Add this one row to the preserved K callee table:

| Callee | Count | Actual arity | Registered locals/formals | Frame | Method lookups |
| --- | ---: | ---: | --- | ---: | ---: |
| parseExpressionStatement |1|2|7/2|240|1|

Current K calls124; arity sum230; vectors42512/entries354, ARRAY12752 and
BOOKKEEPING29760; frames48304;120 method/accessor lookups at272 =32640.
Current ordinary-call subtotal123456/354. All other K rows remain unchanged.
**K307082/547; families8784/14432/2618/51040/230208.**

### Current authoritative full selected-path upper

| Region | Byte upper | Entries | N/A/S/F/B |
| --- | ---: | ---: | --- |
| Reviewed A–F+G, unchanged |307566|351|6208/10856/169814/18672/102016|
| H all Node creations, unchanged |60048|184|4816/2928/336/8352/43616|
| I all finishes, unchanged |79968|252|1344/4928/5376/9632/58688|
| J structural queues/reverse links, unchanged |48816|112|2928/8208/4320/0/33360|
| K corrected remaining grammar/accessors |307082|547|8784/14432/2618/51040/230208|
| L remaining tokens/trivia, unchanged |583782|719|3600/33992/2606/84896/458688|
| **CURRENT Qp** |**1387262**|**2165**|**27680/75344/185070/172592/926576**|

2165<=8745, margin6580. NODE_SCHEMA27680<=8388608; ARRAY75344,
STRING185070, CALL_FRAME172592 and BOOKKEEPING926576 each<=4194304.
No category borrowing/refund. Attempted Nodes14 and structural depth14 remain.

Preserved correction history: this appendix's first editorial cut incorrectly
assumed expressionStatement was live around parseExpression and proposed26.
Main identified the source-order error before independent acceptance. The exact
caller1878–1893 first evaluates parseExpression at site1139 into local c; only
AFTER its return does site1148 invoke parseExpressionStatement(r,c). The helper
2199–2206 sets the already returned expression, calls semicolon, and finishes;
it does not call parseExpression. The proposed26 interpretation is superseded.

The original 25-frame expression spine and its shorter expression-branch ranks
therefore remain valid, as does constructor maximum4. The newly priced helper
has a separate shorter branch: statement3 → expressionStatement4 → semicolon5
→ eat6 → next7 → nextToken8, followed by the same finite token/context suffix.
It cannot overlap the returned expression descendants. Current maximum guarded
coexistence remains **25<128**, not a physical/native-stack theorem.

### Current T inequality and inert-A / admission-B order

Current conditional inequality is `T+1387262<=34649500`, equivalently
**T<=33262238**. The old33263094 threshold is superseded. Actual numerical
new R3 T/census remains UNKNOWN, never reconstructed from observations or old T.

Apply Main's PARSER_PORT_CLOSURE final clarification exactly: source/dependency/
cost-schema review → separately reserved inert A capture/derive (evaluation0,
no target import) → independent full emitted/numeric-census/T+Qp/body/pin review
→ separately reserved B admission/checks. Prospective source rows/formulas and
host/process safety precede A; actual emitted T is an A output. No TARGET
admission/check effect precedes reviewed actual T. This appendix issues neither
reservation nor dispatch and does not waive any native/host or composition gate.

This is only the reviewed omission's author repair. No parser/import/hash/census/
derive/generator/check/runtime effect, code/fixture/cap change or new source
region occurred. Old arithmetic history is preserved; all36/205 remain UNRUN,
runtime0/8/compileOFF/tuplesNOT_ISSUED/62OPEN. Budgets remain unchanged.
STOP for ONE narrow non-own repaired reread; no actual NORMAL FIT/PASS claimed.

## Existing P322 `f();` — exact source-path membership literals

2026-10-08 · AUTHOR_SOURCE_DERIVATION / NON_OWN_REVIEW_PENDING.
This is the existing P322 SCRIPT literal `f();`, four UTF16 units, not another
fixture family or revised acceptance experiment. Its parse membership count is
derived independently from the same source/cost map above. This appendix does
not substitute Main's provisional711 guess for evidence, execute the parser,
claim measured counters, or establish an exact byte debit. The21-unit Qp upper
and its corrected856/3 invocation row remain unchanged.

### Selected shape, extra name-arrow test and disjoint memberships

Normal shape: Program → body[0] ExpressionStatement → CallExpression →
Identifier(f), with one empty arguments array. Four distinct Nodes/four Node
occurrences, one occupied AST array slot, one CALL site `[0,3)`, no declaration
binding. Site/depth classifiers do not expose a private AST. Both producer and
verifier traverse these same four occurrences twice; B=0, N=4, A=1, S=1.

Unlike `!!!f...`, parseMaybeAssign on initial name sets potentialArrowAt to0;
name-atom candidate r is true. Exact caller sites3994 and3996 therefore make
canInsertSemicolon and the failed eat(arrow) calls after parseIdent consumes f.
Next token is parenL, neither EOF nor braceR. canInsertSemicolon1673–1675 calls
__scalarGapLine through the three-slot vector at site826. Gap endpoints are
lastTokEnd1/start1, so helper1175–1183 executes ZERO loop-body iterations.
Its guarded invocation/vector still admits4 memberships; zero iterations do
not make its argument vector free. Added name-arrow memberships are
canInsertSemicolon(empty vector)1 + gapLine(arity3 vector)4 + eat(arrow)2 =7.
The arrow test fails and f is not async, so no arrow/async Node or parser branch
is entered. This seven-membership path was not present in the21-unit fixture.

| Disjoint region | Exact membership derivation | Memberships |
| --- | --- | ---: |
| Constructor A–E+G | unchanged SCRIPT/options/35fields/Scope/word descriptors; strictDirective sees first f rather than ! but takes the same single nontrivia/noquote branch, no source-dependent membership difference |171|
| F context dispatch |6tokens=f,parenL,parenR,semi,EOF,EOF;caller6*2 +3handler dispatches*6 +left3 +right1 |34|
| H Node creations |3startNode vectors*1 +1startNodeAt vector*3 +4*(constructor vector4+Node metadata/schema7) |50|
| I finishes |4*18 |72|
| J structural links |5links=callee,args,ESexpression,Program.body,body[0];4queue1*3+1queue2*5+5reverse-list/push*2 |27|
| K remaining grammar |143caller-vector memberships +2Zconstructs*12 +7freshASTfields*2 +2emptyASTarrays +body[0]1 +topLevelobject1 |185|
| L token/trivia outside F |86vectors, actual-arity sum90; vector slots plus metadata86+90 |176|
| **Per successful common parse Pp** |**171+34+50+72+27+185+176** |**715**|

K's two Z constructs are initial maybeAssign and the one empty call. Fresh
seven fields are Program.body/sourceType, Identifier.name, Call.callee/
arguments/optional and ExpressionStatement.expression. Existing writes, reads,
guarded frames and primitive strings add bytes but no memberships. J's final
body insertion is the sole two-item queue, because the empty body was attached
before its statement. No shared identity/dedup/refund decreases these counts.

#### K invocation reconciliation (ordinary vectors only)

| Caller group | Vector memberships |
| --- | ---: |
| parse/topLevel/statement/expressionStatement |1+2+4+3=10|
| isLet/isAsync/four isContextual(let,async,yield,await) |2+1+8=11|
| expression/assign/conditional/ops/op |1+3+3+3+6=16|
| baseUnary/exprSubscripts/atom/ident/identNode/unreserved |5+3+3+2+1+2=16|
| parseSubscripts/two parseSubscript/one exprList |6+16+5=27|
| five checkExpressionErrors |two arity2 and three arity1:6+6=12|
| thirteen eat |eight subscript tests+one list-close+one starstar+question+semicolon+arrow;13*2=26|
| semicolon/directive adaptation/candidate |1+2+2=5|
| two keyword tests/create(null)/body.push |4+2+2=8|
| three accessors/three varScope/one thisScope |3+3+1=7|
| name-arrow canInsertSemicolon/gapLine |1+4=5|
| **Total** |**143**|

There are59 K calls with actual arity sum84, hence59+84=143. Before the three
name-arrow calls, the reduced21-unit table gives56calls/arity80, vectors136,
and K178; adding7 gives185. Main's provisionalK181/parse711 included the
canInsert and eat vectors but missed the required four gapLine memberships.
That provisional arithmetic is explicitly superseded, not a failed runtime
result or prior accepted count.

#### L token-vector reconciliation

next5 calls have arities0 four times and1 once. nextToken/curContext/skipSpace/
scalarTrivia each6; tick/char/space/line each6 (four nonEOF trivia iterations
plus two readWord1 iterations); fullChar/nativeChar/readToken/idStart each4;
getToken3; readWord/readWord1 each1; scalarStart2; scalarContinue1; slice1;
concat1; keywordTest1; finishToken6 (five arity1, name arity2).
The vector histogram is k0=34,k1=33,k2=12,k3=1,k5=6:86calls/arity90 and
176memberships. Six token transitions include initial name and two EOF; no
prefix reader or bang slice runs. GapLine's separate caller belongs to K and
has zero iterations, so it adds no token/char/tick vectors to L.

### P322 producer and final stage literals — source reconstruction

Use the runtime's authentic producer initial257, not a caller/wire flag. Two
producer passes admit66*N node visits and2*A indexed reads, each site2 and each
unique declaration binding1. Thus historical producer entries are
`257+Pp+66*4+2*1+2*1+0 = 525+Pp = 1240`.
The producerWork policy is independently reconstructed as
`304440+16336*4+480*1=370264`; it is not the common parse byte total.
Metadata emissions add zero memberships and do not change this literal.

The verifier's additional nonparse memberships are itemized, not assumed equal
to producer work:

| Verifier event | Memberships |
| --- | ---: |
| fixed verifier frames capacity |256|
| counts record |1|
| two four-Node passes,33 each occurrence |264|
| two occupied body-slot reads |2|
| one independently extracted site |2|
| extracted result record |1|
| decode exact preflight shape,28+10*S |38|
| independently reconstructed ledger record |1|
| canonical expected-summary record |1|
| **Nonparse verifier increment** |**566**|

ReplayStart's private result record128bytes consumes0memberships, so is not an
extra1. Hash/encoder/metadata guards consume0memberships; no bindings are added.
These facts are explicit at runtime replayStart192–203 and verifier consume
sites258/264/278/294/339/373/563/601. Final entries therefore are
`525+Pp+566+Pr =1091+Pp+Pr`.
Under the explicitly COMMON_MODE identical fixed SCRIPT grammar/source/path,
successful replay admits Pr=Pp=715, yielding **final2521**, not2513. Equality
is a same-adapter path premise, not independent grammar semantics or evidence
of an executed replay. Four attemptedNodes per parse gives cumulative8 after
replay; historical producerAttempts remains4.

Selected narrow source reads confirm existing branches only; no program,
parser/import/hash/census/derive/check/effect occurred. This author count awaits
Back/Main independent reconciliation before full-port literal use. No T value,
byte-observed total, NORMAL FIT, PASS, closure or execution grant is claimed.
