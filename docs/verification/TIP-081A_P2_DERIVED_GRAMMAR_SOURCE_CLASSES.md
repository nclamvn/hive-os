# P2 derived-grammar source classes — pre-generation review cut

Status: **INERT DRAFT / NOT ADMITTED**. This document does not close P2, issue
trusted pins, or authorize any parsing. The accepted allocation kernel is frozen;
the following are new full-grammar derivation artifacts, not a smaller parser.

Source files:

- `scripts/test/derive-private-grammar-tip081-p2.mjs`
- `scripts/test/private-grammar-runtime-tip081-p2.mjs`
- `scripts/test/scalar-grammar-bodies-tip081-p2.mjs`
- `scripts/test/admit-private-grammar-tip081-p2.mjs`

## Fixed profile and ownership

Only internally produced options are supplied to the private Parser constructor,
with exactly two arguments: options and primitive source text. The constructor's
optional starting-position argument is never supplied. `getOptions` becomes an
identity on this private options object, not an identity on arbitrary callers.

Nineteen fields, 278 total key UTF16 units:

| Field | Value | Key units |
| --- | --- | ---: |
| ecmaVersion | 15 (ECMAScript 2024) | 11 |
| sourceType | `script` or `module`, exactly | 10 |
| allowReserved | false | 13 |
| allowReturnOutsideFunction | false | 26 |
| allowImportExportEverywhere | false | 27 |
| allowAwaitOutsideFunction | false | 25 |
| allowSuperOutsideMethod | false | 23 |
| allowHashBang | true | 13 |
| locations | false | 9 |
| ranges | false | 6 |
| program | null | 7 |
| sourceFile | null | 10 |
| directSourceFile | null | 16 |
| preserveParens | false | 14 |
| onToken | null | 7 |
| onComment | null | 9 |
| onInsertedSemicolon | null | 19 |
| onTrailingComma | null | 15 |
| checkPrivateFields | true | 18 |

No public source getter, AST/node/map/list export, function/plugin callback,
options object, parser handle or evaluation API exists. An opaque handle is
accepted only by same-instance WeakMap identity. A pre-authentication failure
cannot revoke another active owner. An authenticated operational failure retires
the owner, drops text/parser/AST references and deletes the owner row. Deadlines
remain original; a BUSY clock observation advances `lastNow`, never `started` or
TTL. The 20,000 conservative internal memberships are not P3 catalogue sites.

`wordsRegexp` is replaced with uncached fixed-keyword descriptor creation. The
original module's empty `w` is never populated after initialization. Therefore
owner-paid strings/descriptors cannot remain strongly cached across retirement.
They are reachable only through that owner's private Parser and its weak brands.

## Closed native and scalar classes

These are semantic classes, not permission to pass through unknown native calls.
Generated occurrence rows must bind each actual source span to its class. An
unknown native call remains an admission blocker, not evidence of equivalence.

| Class | Actual replacement / enabled premise |
| --- | --- |
| Target regular-expression literal | Whole `readRegexp` body refuses before target validation/native construction. |
| Target BigInt literal | Scalar number readers refuse the suffix before spelling conversion. `stringToBigInt` is separately stubbed. |
| Unicode identifiers | Identifier predicates and scalar escaped readers refuse before Unicode matcher/astral-set work; ASCII names and escaped ASCII remain enabled. |
| Unicode string/template contents | Guarded UTF16/code-point strings, including lone surrogate representation; not the Unicode-ID exclusion. |
| Numeric conversion | Decimal normalized full spelling uses captured Number; legacy-octal uses captured parseInt; radix readers retain original iterative readInt value. Numeric spelling over1024 units is explicit unsupported input. |
| String property and operations | Captured scalar char, code units, slice/indexOf/substring/substr, fixed replace/split. No ToPrimitive callback. |
| Owned-array operations | Guarded push/pop/slice and strict-equality indexOf. Slice preserves holes; every occupied destination membership is charged separately. |
| Object.hasOwn / Array.isArray | Captured intrinsic markers with private-brand/primitive-key dispatch; no caller reflection/options coercion. |
| Object.create | Null-prototype private dictionary only, with header/schema admission. |
| Object.defineProperties | Fixed initialization only; private registered accessors, declared attributes retained, descriptor and insertion debited before define. |
| Function.call | Private registered function only; guarded argument backing and pre-entry frame. |
| Captured primitive String | Primitive-only, no target object coercion. |
| Fixed keyword regex descriptors | Anchored word membership scanned without native RegExp. Space-to-pipe replacement is guarded. |
| `h` fixed word regex | Exactly `in` or `instanceof`; no generic regex engine. |
| `g` fixed newline regex | CR/LF/LS/PS scalar scan. |
| `E` fixed export-name regex | Scalar lone-surrogate detection: high must be paired with following low; unpaired low fails. Ordinary export string names remain enabled. |
| `y.exec` import lookahead | Exact global whitespace/line-comment/block-comment pattern. Returns guarded private match array with `[0]`, index/input and lastIndex. It does NOT consume HTML comments. |
| Raw template CR normalization | Exact fixed `\\r\\n?` replacement; guarded source pieces and old/new string overlap. |
| Optional-position lastIndexOf/split | Constructor's third argument absent in both admitted profiles; branch cannot execute. |
| Native regex-validator reader | `regexp_*`, validateRegExpFlags/Pattern and Ue.prototype reader bodies stubbed; target readRegexp is already refused before any such call. |
| Native `.match` octal reader | Original escaped-reader body entirely replaced by scalar template; no remaining enabled target `.match` call. |
| Console warning / callback defaults | Entire getOptions replaced on exact internal options; no warning/default/coercion/callback branch remains. |
| getLineInfo / dynamic diagnostics | getLineInfo stubbed, locations false; WHOLE raise/raiseRecoverable/unexpected calls replace argument expressions, not merely the thrown message. |
| Native operator coercion | Typed primitive arithmetic/equality/relations and private-brand `in`/instance checks; no object ToPrimitive or Symbol.hasInstance callback. |

## The only enabled for-in occurrence

Original copyNode anchor78782 contains the literal loop
`for(var i in e){t[i]=e[i]}`. Its source is a private Node; its destination is a
separately fresh Node. The loop only writes the destination and never adds or
deletes source properties. Node's ordinary private prototype has only its
non-enumerable constructor: no derived grammar statement writes `de.prototype`.
Plugins and public AST/prototype exposure are removed. The runtime `copyKeys`
also requires NODE brand and exact private Node-constructor prototype.

Consequently, under this closed profile, an admitted own-key snapshot has the
same key set/order as the original for-in. Host Object.prototype additions are
intentionally never traversed or invoked by the derivative. This is not an
equivalence claim for arbitrary objects, inherited enumerable getters or mutable
caller sources. Original getOptions and regexp-only hasProp for-in regions are
whole-body replaced and must be recorded with descendant lineage.

## Guard order and workspace

Object literals reserve header/slots before literal construction. Arrays evaluate
elements once in original order into precharged frame slots, validate prospective
child depth, then reserve backing/memberships BEFORE attaching those references
in the actual literal. Function expressions reserve before construction; hoisted
objects are reserved before private callee entry. Constructor/node cap admission
precedes actual constructor entry. Schema replacement/deletion never refunds
prior allocation. Array backing growth charges old and new capacities before
mutation. Derived strings charge pieces and retained old/new overlap.

AST depth counts Node contribution1 and list contribution0; private control
arrays never participate. Ancestor traversal checks cycles even on equal-depth
zero-contribution lists. Helper/grammar call depth is a distinct axis; this is not
post-parse AST counting. Native stacks, UTF8 compiler storage, regex/number internals
and physical RSS remain honest unknowns.

The generator derives static module rows from actual emitted string/property-key
pools, ordinary function objects, bindings, captured bound intrinsics, fixed
object schemas and three WeakMap headers. The owner control schema is16 slots:
320 bytes; two-slot handle96; owner WeakMap row32; total448. Retained source header32
is a known next-cut repair, in addition to the synthetic conservative4×UTF16 units.
Observation has14 fixed scalar/literal fields: header64+14×16=288 bytes.

Runtime workspace records each runtime helper's actual local/parameter count and
the logical `64+16×(locals+parameters)` frame. Direct helper segments are acyclic
except linkDepth→push→set→linkDepth, whose second invocation returns immediately
for CONTROL_ARRAY; each helper can therefore occur at most twice per segment.
Framed invocation/constructor boundaries allow at most128 admitted re-entries plus
the public owner segment: `2×129×sum(actual helper frames)` is the declared
conservative logical workspace. It is reserved in fixed module baseline before
private initialization and source overlap. It is not a measured native stack cap.
This graph premise requires independent review; an additional direct cycle would
invalidate the workspace bound.

## Known blockers in first diagnostic cut

- Ordinary function prototype slot/header needs separate precreation accounting;
  proposed192 includes existing96 function, slot16, prototype80. Bound intrinsics
  remain separately classified.
- Retained source header32 must be added before ownership.
- Current generated span inference scans runtime numeric arguments incorrectly;
  runtime reserve(16) must NEVER be credited as original site16. A literal hook
  signature table and initializer-only scan are required.
- A complete independent generated-effect walk must prove guard dominance and
  reject extra raw allocations/writes/calls, not merely find guard IDs.
- Every normalized scalar/shared/fixed replacement tree must independently have
  complete occurrence coverage, including removed-region descendant lineage.
- Trusted exact tuple is NOT_ISSUED; the admission driver returns refusal before
  importing. Its primitive-text verifier cannot turn flags or supplied hashes
  into trusted pins. A real guard-removed candidate must be rejected before any
  modified candidate import.

No diagnostic generation, finite fixture success, pin or hash substitutes for
these obligations. First generated output must stay OFF and undergo complete
independent source review before the newly pinned synthetic grammar can be tested.

## Subsequent source-only repairs (predecessor retained)

Two supervised diagnostic effects failed before writing a candidate/inventory.
The first exposed TypeScript transform lifecycle initialization, repaired by
performing the entire source walk in the returned transformer callback. The
second exposed mutation of original foreign-source ranges: `visitEachChild` may
return the original node. The next cut clones that unchanged node before setting
synthesized printer ranges; independent walks retain real source positions. It
does not skip negative positions or disable either TypeScript assertion.

Other current source repairs, awaiting a newly routed inert generation:

- Signed integer factory uses MinusToken+positive NumericLiteral, never a
  negative argument to TypeScript's numeric-literal factory.
- Ordinary function creation/hoisted/static costs are192; bound intrinsic
  capture remains its separately declared96 class.
- Source header32 makes fixed owner/source base480, plus4×source UTF16 units and
  the itemized module/runtime workspace. This synthetic retention/backing bound
  is not a real consumer's UTF8-source reservation or a physical string-layout claim.
- Captured Object.prototype.toString resolves the unconditional bootstrap alias;
  closed objectTag dispatch never calls generic native toString or Symbol hooks.
- Private prototype keyUnits initializes at minimum11, never reducing a larger
  retained key bound after schema growth.
- CONTROL_ARRAY initial fills now use guarded set, including schema16 and
  canonical key conversion before every write. Initial occupancy plus set's
  first-occupied debit is a deliberate conservative double charge, not a waiver.
- Generated spans now use a literal hook/signature/family table after the exact
  runtime prefix. Byte counts in runtime reserve calls cannot be source-site IDs.
- Generated effects are separately enumerated with literal reserve dominance,
  argument/backing shape, frame/hoist count, raw call/write/coercion/enum and
  first-loop-checkpoint checks. Typed numeric step and bounded own-key loop
  exceptions require their exact origin shape, not merely a temporary-name prefix.

These are implementation progress, not acceptance. The new generator/runtime
cut, actual emitted output, native/reachability premises, inventory, literal
fixtures and fixed tuple driver all still require independent review. P2 stays
PARTIAL and no real parser, root lane, P3 or extra execution grant is opened.

The new generator also supplies30 closed normative rule classes R01–R30. Every
occurrence has a mechanically total `ruleId`/fixed-profile reference; unknown
operation/rule/transitive references stay OPEN. Classes bind exact runtime guard
and logical cost expressions, old/new backing/string overlap, aliases, lifetime,
retirement and finite P2G control-family references. Lowered child spans inherit
their exact parent's debit; fixed local writes use prepaid frame slots instead
of pretending to call object-schema set. Metadata, derived-string and structural
link helpers are explicit transitive classes, not undocumented free operations.
The manifest version is UNADMITTED. Control references are UNRUN and do not
establish per-path/site execution or deep semantic equivalence; P2G100 must remove
a genuine emitted array reserve and be refused before modified code import.

## V3 emitted lifetime blocker and V4 source repair (unrun)

The third supervised inert generation succeeded and produced immutable OFF text
and its diagnostic inventory. The Builder then found, and Back independently
confirmed, an actual lifetime blocker despite the diagnostic `open=0` result:

- V3 emitted line3939/site4395 initializes module-shared `ce=[]`; line3971/site4456
  attaches that ARRAY to an owner NewExpression's `arguments`.
- The analogous module-shared `te=[]` is initialized at line2068/site1501 and
  attached to a side-effect ImportDeclaration's `specifiers` at line2739/site2554.
- Structural reverse edges stored in these permanent arrays' private metadata
  can strongly retain retired owner Nodes, and later owners traverse/add to that
  history. Clearing the public owner state alone does not remove those roots.

V4 changes only the two exact original read occurrences to fresh guarded empty
ARRAYs before their enclosing schema/structural link. Original empty-list contents
are preserved; private AST-list reference identity is deliberately no longer
shared across nodes or owners. No AST or identity escapes the four owner APIs.
The unused empty module declarations remain privately accounted rather than being
silently removed or assigned an unreviewed lifetime exemption.

A closed source audit checks all four direct module ARRAY bindings: `t`/`i` are
numeric tables, while `ce`/`te` are the two empty arrays. Each empty binding must
have exactly its declaration and its single expected attachment read, in
`pe.parseNew` or `pe.parseImport`. A pinned-source function/parameter-shadow-aware
walk checks that root numeric `t` has one reference and root numeric `i` two, all inside the two
WHOLE-replaced Unicode-ID helpers. Unknown binding, content, attachment, alias
read or enabled numeric-table reference refuses diagnostic derivation. The output
`staticArrayAudit` records exact original spans and these dispositions.
This is not a generic JavaScript lexical resolver: catch names are included in
the containing function's set; the exact pinned source has only `catch(e)`, so no
`t`/`i` reference is hidden by that conservative collection. Block-scoped source
variants are not admitted by the fixed original pin.

New class R31 binds each fresh-list occurrence to R04 backing/prototype/metadata,
R09 enclosing schema, and R30 separately guarded reverse-edge work. Its lifetime
is owner-local, not a permanent target-bearing module object. P2G108 (`new A; new
A;`, SCRIPT) and P2G109 (`import 'm';`, MODULE) repeat three fresh/retired owners
with literal scalar expectations and deterministic per-owner counters. They
remain UNRUN and cannot prove garbage
collection/RSS or full runtime semantic equivalence. V3 artifacts are preserved;
V4 has not been generated, imported or admitted. No P3 route is open.

The V4 diagnostic-method replacements also preserve the enabled closed refusal taxonomy:
`raise`, `raiseRecoverable` and `unexpected` bodies refuse `SYNTAX_REFUSED`, not a
native-feature exclusion. `invalidStringToken` retains the original private
`inTemplateElement && ecmaVersion>=9` sentinel branch and otherwise refuses syntax.
All visible diagnostic calls still undergo WHOLE replacement before arguments;
enabled unsupported RegExp/location/BigInt branches are not relabeled as syntax.
The unreachable `Ue.prototype.raise` diagnostic stub also uses SYNTAX_REFUSED;
`readRegexp` still refuses before entering any of that validator's methods. This
does not authorize or reclassify an enabled target-RegExp conversion.

### V4 diagnostic failure preserved; V5 exact receiver correction

The supervised V4 inert derivation refused `SHARED_EMPTY_OWNER_METHOD_DRIFT`
before writing either new candidate or inventory. Its real input snapshot and
effect record are retained. The V4 audit incorrectly assumed both method aliases
were `pe`: the actual original/emitted import method is installed on `$`, while
`parseNew` is installed on `pe`. This was a review assumption error, not a reason
to remove or weaken the owner-method check.

V5 pins separate tuples `ce/arguments/parseNew/pe` and
`te/specifiers/parseImport/$` and includes `prototypeReceiver` in the returned
audit record. Fresh-list guards, caps, retirement, taxonomy and supported grammar
remain unchanged. V5 source has not been generated, imported or admitted; no
automatic retry is authorized and no V3/V4 predecessor artifact is overwritten.

### V6 constructor-prototype lifetime and absent-field repair (unrun)

Source review of V5 found a separate ordinary private-constructor seam. `Node`
(`de`) had no explicit startup prototype read; constructing a Node branded the
instance but not its prototype. Reading an absent legitimate field (for example
the first VariableDeclaration's absent `expression` in the scalar observation)
could refuse at the unbranded private prototype. A later copyNode lookup could
instead first adopt that permanent prototype under an active owner, charging one
owner for metadata retained by the module afterward.

V6 registers an ordinary private function's own prototype immediately after its
function/value brands, in that function's actual creation lifetime. Two captured
own-property descriptor reads are each reserved128 before reflection and
sanitized16 before any optional field read. Their exact data shape must match an
ordinary own `prototype` object and its own `constructor===fn`, with the normal
data flags and captured Object.prototype parent; unknown shapes refuse. Only then
is its metadata224/one weak membership admitted, with monotone constructor key11.
Exact additional cost is512; the implicit prototype backing80 and slot16 were
already prepaid in ordinary function192 and are not charged a second time.

The lexical registration helper has an internal sixth boolean, defaulting true
for generated five-argument private registrations. `registerNative` explicitly
passes false for all captured host/native markers; no String.prototype or other
native-host prototype is adopted. The owner APIs expose no adoption flag. Later
generic function-prototype reads require already-owned ordinary prototype
metadata and reject native/unknown prototypes instead of lazily creating a brand.
The exact captured Object.prototype bootstrap alias remains its separately
reviewed intrinsic case, not a generic adoption permission.

The new parameter and descriptor/prototype locals enter the generator's actual
runtime frame/workspace table automatically. The strict captured-descriptor path
adds no get/invoke/re-entry edge or direct recursion; it only uses the already
reviewed reserve/meta/WeakMap paths. R01/R15/R28 now bind the512 cost, membership,
tool-versus-owner lifetime and native exclusion. Existing P2G005 absent-expression
and P2G108/109 repeated-owner controls remain UNRUN. V5 outputs are immutable;
V6 needs fresh source review, exact tool routing and actual emitted review before
any admission or parser fixture execution.

### Scoped synthetic-check release helper (source only)

Main/Front/Back source-reviewed the actual V6 changed prefix and prior complete
grammar partitions for bounded synthetic checks only, not full P2 acceptance.
The new `release-private-grammar-tip081-p2.mjs` mechanically reads the exact two
same-FD V6 output pins, preserves their inert provenance and UNRUN history, and
changes the unique compile constant `false` to equal-length `true ` only. Source
byte/UTF16 lengths and every generated span remain unchanged. All three fixed
new `.checked` artifacts use O_EXCL and bounded encoding before any write.

The proposed profile lists both exact19-field option records, original/source-cut
pins, unchanged logical caps, source review/cut paths, native/VM/RSS limitations,
`sourceScopedCheck:true`, `realParserDisabled:true`, `fullP2Accepted:false` and
`checks:UNRUN`. This is review metadata, not caller-selectable admission authority.
Only independently source-issued fixed loader pins can admit the new tuple. The
loader remains NOT_ISSUED; the Builder has not executed the helper, generated code
or fixtures. The helper itself needs independent source clearance before Main's
separately bounded effect. No P3/real-root/build/E2E/API/Git lane is opened.

## Current checked-source and synthetic evidence checkpoint

This appended checkpoint supersedes the *current-state* statements in the earlier
dated cuts, without deleting their UNRUN, NOT_ISSUED, failure or review history.
Main performed the supervised V6 derivation, mechanical checked release and
fresh same-FD pin capture. The fixed loader is source-issued
`SOURCE_REVIEWED_SYNTHETIC_ONLY`; it admits the exact checked tuple, not caller
metadata. Neither this checkpoint nor that scoped issuance accepts full P2.
The real parser/root lane remains disabled and P3 is not authorized here.

V6 diagnostic inventory records7274 source/replacement rows,10349 emitted hook
occurrences,17744 classified generated effects and31 normative rule classes.
Its diagnostic open/unmatched/emitted-unknown lists are empty. These counts and
hashes are reproducibility bindings, not independent completeness evidence by
themselves: the actual source, whole replaced-region lineage, guard order,
closed natives, runtime helper graph and permanent-versus-owner lifetimes were
separately reviewed by Main and independent Front/Back partitions before the
scoped checks. The source header32, function192 and eager ordinary prototype512
repairs described above are present; the final owner/source fixed base is480.

Main's first grammar batch recorded108/109 PASS; all63 positive production
controls passed. The sole failure was the *fixture expectation* in P2G107:
`a` followed by140 `.x` members refused `ENTRY_REFUSED`, not the predicted
`DEPTH_REFUSED`. The20k conservative internal-entry limit is conjunctive and
cannot be relaxed to manufacture a depth result. A subsequent fixed, nonadaptive
125/126/140 empty-call diagnostic likewise recorded entry refusal and disposal
for all three cases. Both histories remain evidence, not erased failed tries.

The source-justified two-case hybrid then used31/32 unary `!` prefixes and94
empty calls. Source structure predicts Identifier1 +94 CallExpression nodes
+31/32 UnaryExpression nodes +ExpressionStatement1 +Program1 =128/129; list
containers contribute0. Empty calls run through the iterative subscript loop;
the added unary recursion remains a separate reviewed pre-entry frame axis.
There is no public depth/AST export and no post-parse counting used as admission.
Main's actual fixed diagnostic, retained in
`docs/verification/TIP-081A_P2_HYBRID_AST_DEPTH_DIAGNOSTIC.json`, recorded:

| Fixed source | Actual result | Bounded observation / cleanup |
| --- | --- | --- |
|31 `!` + `a` +94 `()` + `;` | SYNTHETIC_ANALYZED |128 attempted nodes;19216 internal entries;40573726 total logical bytes; one ExpressionStatement; retired handle refused authority |
|32 `!` + `a` +94 `()` + `;` | DEPTH_REFUSED | owner disposed; subsequent observation refused authority |

The positive's128 attempted nodes are not a generally interchangeable AST-depth
measurement: the equality is particular to this independently derived source.
The negative's structural-depth interpretation also relies on the reviewed
private-call-depth and source-shape argument, not the error name alone. Native
stack/RSS/JIT/GC and mathematical-result correctness remain unproved.

Main authorized only P2G107's literal controls to retain the member chain as
exact ENTRY domination and add the hybrid positive/negative boundary. The final
109-control fixture cut is **pending Main's actual rerun at this checkpoint**.
The remaining tests, checked tuple, runtime, caps and profile are unchanged.
Health checks already recorded syntax/lint/focused types PASS (18 intentional
lexical-template unused warnings); the initial forbidden local-name lint failure
and its narrow rename remain preserved. The final acceptance decision and
aggregate execution accounting belong to Main, not this Builder checkpoint.

### Appended final109-control outcome, before Main acceptance/post-pins

Main reports final109/109 PASS in the exact one-file grammar fixture batch;
raw record: `docs/verification/TIP-081A_P2_GRAMMAR_FINAL_CHECK.json`.
The final30762-byte test cut has Main-captured SHA-256
`2bd64e91080980920246513ca2ec5da5ee3f889e6dfac8e48e88085054996744`.
The amended P2G107 preserves exact member ENTRY domination and adds the
source-reviewed hybrid positive128 / negative129 controls, without changing
runtime, caps, fixed profiles, source inputs or checked artifacts. Its earlier
failed expectation and both diagnostic outcomes remain preserved above.

Main's final focused types exited0. Lint of the final fixture, two diagnostic
helpers and focused Vitest config recorded0 errors/0 warnings; this is not a
retroactive claim of zero warnings in the earlier runtime-template check.
Builder appended these Main-reported facts only and ran no effects/hashes/tests.
Main's post-check pins, cumulative ledger and final W1–W6 decision are pending;
full P2/native/physical/math acceptance and P3/real lane are not granted here.

### Appended final post-pin/accounting checkpoint

Main's post-check capture reports36/36 matches (20 frozen +16 current artifacts),
retained in `docs/verification/TIP-081A_P2_GRAMMAR_AFTER_PINS.json`.
Final Main aggregate:867323.494582/900000ms;32676.505418ms remaining, with no
reset or raised ceiling. Independent Back reports no W1–W5 code/control blocker
for this reviewed synthetic engineering cut. Main's separate authoritative
`GRAMMAR_COMPLETION` and ACTIVE/handoff append are being written for scoped full
P2 engineering6/6 acceptance. Earlier pending statuses remain historical cuts;
the Main records supply the final decision, not a Builder-issued permission.
No native/physical/math/P3/real-source scope is added. Builder appended these
Main-reported facts only; frozen code, helpers, tests and artifacts are untouched
and no Builder effect/hash/check ran.
