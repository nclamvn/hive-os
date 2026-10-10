# P3 R3 normal parser FIT freeze — constructor closed, full FIT still OPEN

2026-10-08 · SAME081D8 · exact SCRIPT fixture `!!!f()()()()()()()();`.
STATUS: SOURCE_DERIVED_INITIALIZATION_UPPER; NOT FULL_PARSER_FIT.

Read the latest handoff/ACTIVE implementation checkpoint and approved R3 plan.
This is ONE bounded continuation of the exact normal P321 fixture obligation.
Only named checked P2 synthetic emitted TEXT and handwritten runtime/helper
maps were read. No parser/program/hash/import/generator/check/runtime/network,
protected/actual-source read/stat, tree scan, fixture/cap/grammar/native-cost
change or code edit occurred. Only this new report is authored; A–F history is
not rewritten. Main/non-own review precedes use of these author-derived bounds.

## Established new region G and anchors

G is the entire constructor complement excluded by A–E in
`TIP-081A_P3_R3_PARSER_WORKSHEET.md`. F is still the separately covered23-token
updateContext subtree. Named one-based checked-candidate anchors (not original
byte offsets): fixed table rows1326–1328; wordsRegexp1417–1420;
Parser1467–1516; strictDirective1579–1645; scalarTrivia1185–1243; scalarSpace /
scalarLine1160–1165; scalar registration1110–1118 and hook declarations1096–1102.
Runtime anchors: meta/object/array128–169; frame/invoke/construct218–257;
set/defineData300–359; primitiveString/concat374–387; slice480–491;
native scalarString/push/create784–864; toolRegex/regexDescriptor/regexNew920–941;
replace1035–1053. Existing source-derived five-family map is retained unchanged.

Accidental large-array/initializer navigation output was truncated and is NOT
used as source coverage. The three required fixed table rows were subsequently
read separately. Only the above finite selected regions support these bounds.

## Fixed wordsRegexp loops — conservative upper, not a generic cushion

ECMA15/SCRIPT/allowReserved=false selects exactly four words lists:

| Constructor field | List bound L | Space replacements m | Derivation |
| --- | ---: | ---: | --- |
| keywords | <=384 | 34 | n has29 words; o6 appends6. All35 ASCII words have length<=10, so35*10+34 spaces<=384 |
| reservedWords | 4 | 0 | a6 is literal enum |
| reservedWordsStrict | 75 | 9 | enum plus space plus strict70; strict's9 word lengths10,9,3,7,7,9,6,6,5 and8 spaces |
| reservedWordsStrictBind | 90 | 11 | preceding75 plus space plus eval arguments14 |

No module await append occurs. Runtime replace receives only the private space
descriptor and pipe replacement, so every replacement preserves string length.
Its loop visits at most L characters and selects exactly m spaces. Captured
char/tick reads in that loop add no dynamic logical allocation; existing helper
workspace T/clock/native premises remain explicit. There is no native RegExp.

For each selected space, one slice is at most64+2L; each of two concats is at
most64+4L (old and new lengths each<=L). Therefore per match<=192+10L, final
slice+concat<=128+6L. These are direct runtime formulas, not a whole-function
reserve. Individual replace uppers are137088,144,9056,12680 STRING bytes,
respectively; total158968. The keyword upper intentionally uses384, not a
guessed exact spelling or observed parser output.

Per wordsRegexp call outside that replacement loop:

- Caller literal one-vector336/entries2; wordsRegexp frame128 (locals2,param1,
  arity1); native replace literal two-vector344/entries3 and frame96.
- `/ /g` tool descriptor: two one-unit slices132 STRING; record backing128
  NODE_SCHEMA; sanitize/meta240 BOOKKEEPING/entry1. Raw constant is startup T.
- Outer pattern concats cost `(80+2L)+(84+4L)=164+6L` STRING, because prefix
  length4 and suffix length2. Replacement preserves length.
- RegExp-special construct literal one-vector336/entries2; regexNew creates
  the fixed descriptor128 NODE_SCHEMA +240 BOOKKEEPING/entry1. The special
  construct branch does not enter a guarded callable frame or native RegExp.

Thus each call outside replace is2272+6L, entries9. Across all four calls,
with sum L bounds553: complete wordsRegexp upper171374/entries36. Families:
NODE_SCHEMA1024, ARRAY1184, STRING163470, CALL_FRAME896, BOOKKEEPING4800.
No per-owner function/prototype registration occurs; those functions/markers
were registered at initialization and belong to T.

## Remaining Parser schema and ordinary paths

Constructor has35 fresh Parser fields. A–D already counted7: options,
startLoc/endLoc, context, labels/scopeStack/privateNameStack. Remaining28 are:

| Key | L | Key | L |
| --- | ---: | --- | ---: |
| sourceFile | 10 | keywords | 8 |
| reservedWords | 13 | reservedWordsStrict | 19 |
| reservedWordsStrictBind | 23 | input | 5 |
| containsEsc | 11 | lineStart | 9 |
| pos | 3 | curLine | 7 |
| type | 4 | value | 5 |
| end | 3 | start | 5 |
| lastTokStartLoc | 15 | lastTokEndLoc | 13 |
| lastTokEnd | 10 | lastTokStart | 12 |
| exprAllowed | 11 | inModule | 8 |
| strict | 6 | potentialArrowAt | 16 |
| potentialArrowInForAwait | 24 | awaitIdentPos | 13 |
| awaitPos | 8 | yieldPos | 8 |
| undefinedExports | 16 | regexpState | 11 |

Sum key units296. All are absent ordinary own slots with no corresponding
prototype accessor. Exact `472+2L` formula gives13808/entries56:
NODE_SCHEMA2464, STRING592, BOOKKEEPING10752. Parser metadata was counted once
in A, so not again here. Parser is OBJECT, not NODE/ARRAY; these assignments
create no linkDepth queue, even for list/descriptor content.

Fifteen additional ordinary own reads outside the separately counted subtrees
are sourceFile456; ecmaVersion462/o6; allowReserved464; ecmaVersion468/a6;
sourceType470; strict477; strictBind486; eof518; pos525; pos540; sourceType549;
inModule552; pos554. They cost2160 BOOKKEEPING. Numeric keys for o6/a6 additionally
cost192 STRING (two primitive-key conversions), not an extra descriptor each.

Four constructor string-building concats outside wordsRegexp are exact1068
STRING: enum+space82, previous+strict224, strict-list+space366, previous+bind396.
Input String call uses literal one-vector336/entries2 and native frame80:
416 total; source is already primitive string, so primitiveString returns it
without another allocation. The retained-source cost was charged at owner create.

Object.create(null) for undefinedExports uses literal one-vector336/entries2,
native frame80 and ownObject empty backing64/adoption240/entry1:720/entries3.
Its Parser field is in the28 schema table, not charged a second time.

Hashbang test reads pos/allowHashBang/input3*144, makes literal two-vector344 /
entries3, native slice frame96 and two-unit string68:940/entries3. Input begins
!!, not #!, so no comment/line loop. Offset i is absent/falsy, so the offset
lastIndexOf/split/location branch is not selected.

## Initial nonquote strictDirective subtree — exact selected path

The caller's inModule and pos reads are in the15-read group above. Its method
lookup272, one-vector336/entries2 and strictDirective frame496 (locals25,
param1,arity1) start this subtree. It reads input144, invokes tick through
empty-vector328/entry1 and frame64, reads inModule/options/allowHashBang432,
passes literal five-vector368/entries6 to scalarTrivia with frame528
(locals19,params5,arity5).

At source position0, scalarTrivia's while enters ONCE: text.length is a primitive
string length read with zero dynamic charge; tick empty-vector328/entry1+frame64;
char two-vector344/entries3+frame128; scalarSpace one-vector336/entries2+frame96;
scalarLine one-vector336/entries2+frame96. First code33 is neither trivia nor
comment opener; width0 breaks, returning packed0. No lookahead, gap-line,
line/comment/Unicode/error/helper loop occurs on this branch. StrictDirective
then reads quote through two-vector344/entries3+frame128, sees33 and returns
false before quoted-prologue scanning. One outer iteration only.

Complete subtree5168/entries20: ARRAY800, CALL_FRAME1600, BOOKKEEPING2768;
zero NODE_SCHEMA/STRING/attempted Nodes. This is a cost/path worksheet, not
self-clearance of this reviewer's previously authored scalar semantics; Main /
non-own review of those exact bodies remains the independent acceptance premise.

## New region-G bound and constructor completion

| Newly covered event group | Byte upper | Entries |
| --- | ---: | ---: |
| Remaining28 Parser fields | 13808 | 56 |
| Fifteen ordinary own reads | 2160 | 0 |
| Two numeric table keys | 192 | 0 |
| Four complete wordsRegexp calls | 171374 | 36 |
| Four constructor list-building concats | 1068 | 0 |
| Primitive String call | 416 | 2 |
| Object.create(null) | 720 | 3 |
| Hashbang two-unit peek | 940 | 3 |
| Nonquote strictDirective subtree | 5168 | 20 |
| **G upper** | **195846** | **120** |

G families: NODE_SCHEMA3552; ARRAY2280; STRING165390; CALL_FRAME2752;
BOOKKEEPING21872. Their sum195846 is a successful-path logical UPPER because
keyword replace slice/concat lengths use conservative384; other rows are exact
on the selected path. Bytes are not measured memory/RSS or source-size counts.

A–E17920/51 plus G gives complete actual parse-seam/Parser-constructor
initialization upper213766/171, zero attempted AST Nodes. Families5184 /
3664 /165878 /5968 /33072 in NODE_SCHEMA/ARRAY/STRING/CALL_FRAME/BOOKKEEPING
order. This includes caller options/control vector, all35 Parser fields, four
word descriptors, noquote strict detection, initial context/Scope and initial
lists; it ends at constructed Parser return, BEFORE parse-method retrieval/call.

Initialization guarded private-call coexistence is at most4 from seam depth0:
Parser1→strictDirective2→scalarTrivia3→char/space/line/tick4. WordsRegexp reaches
native replace at3; Scope/native push reaches3; RegExp-special construction
creates no callable frame. Direct helper loops do not increase the guarded
callDepth counter. This does not prove physical/native stack containment.

With reviewed F93800/180, cumulative DISJOINT covered upper307566/351;
families6208 /10856 /169814 /18672 /102016. A–F predecessor text/results remain
unchanged. Replay selected paths share the same source/runtime COMMON_MODE
premise; these rows alone do not prove whole replay-family admission.

## Minimal unclosed obligation and bounded stop

Full normal parser FIT is NOT closed by constructor completion. Remaining numeric
rows are the actual parse() retrieval/call and Program construction/topLevel /
single expression statement; all23 nextToken/readToken/scalar-trivia transitions
outside F; three unary and eight ordinary iterative calls, name f and empty
argument-list wrappers; DestructuringErrors/private-call vectors; all14 Node
constructor/finish rows and structural set/linkDepth ancestor/reverse-queue
memberships; native.call copied-rest finishNodeAt; Program body push, directive
adaptation, semicolon and final EOF/finish. This is one finite exact path, not
permission for a new fixture family or empirical search.

Need ONE complete bound on those remaining event groups and their guarded
coexistence, then add it to307566/351 and compare: per-parse entries<=8745;
NODE_SCHEMA<=8388608, each other replay family<=4194304; private calls<128;
actual new R3 T plus full Qp<=34649500. New T itself still needs exact future
source census before effects. Current constructor/F margins cannot substitute
for the excluded rows. No missing native-cost contradiction was found in G;
the blocker is unsummed remaining selected paths, not a proved impossibility.

Stop after this ONE bounded concrete region rather than an indefinite full-path
trace. No normal integration code/fixture/effect is released; all36/205 UNRUN,
runtime0/8, compile OFF/tuples NOT_ISSUED. Aggregate870882.767416/900000ms and
P3 remaining21440.727166 unchanged. Normal/kernel/helper/harness/source/emitted /
process/admission/Main-reservation gates remain separately required. No P4/P5,
math, actual source/auth/provider/browser/build/Git authority follows.

## Narrow proof repair — keyword first-space refinement

Main accepted this source-only clarification after Ast's independent review.
The earlier paragraph's generic whole-replacement formula, used without further
refinement, yields `34*(192+10*384)+(128+6*384)=139520`, NOT137088. Its
implicit derivation of the displayed137088 row was mistaken and is explicitly
superseded here. That predecessor text remains as history, not a valid derivation.

The fixed named n literal at checked candidate1327 actually begins `break `;
o6 appends six fixed words to that same string. The first space is at index5,
so the first runtime replacement is exactly slice74, concat(empty,slice)74,
concat(previous,pipe)86, total234. It is not the generic4032 match bound. All
35 fixed words still have length<=10, giving L<=384, and there are exactly34
space replacements. The remaining33 matches are each<=4032; final slice/concat
is<=2432. Consequently the COMPLETE replacement, including its tail, is
`234+33*4032+2432=135722<=137088`.

Thus the existing137088 keyword row is a valid conservative full upper under
this explicit named-source refinement. Reserved enum's no-space final slice /
concat remains72+72=144; other lists'9056/12680 formulas are unchanged. No tail
allocation is dropped, no observed output or arbitrary whole-function cushion
is introduced. No row/family/G/initialization/cumulative total changes: G195846 /
120; initialization213766/171; cumulative307566/351 remain SOURCE upper only.
This is a proof-text repair, not execution, source-family expansion, full FIT or
self-clearance. Request ONE non-own repaired reread before using this refinement.
