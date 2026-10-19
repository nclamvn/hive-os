# P2 full-grammar closure continuation — source review history

2026-10-07 · SAME081D8 engineering · Owner “kết thúc P2 để chuyển P3”.
P2 full grammar remains OPEN; no P3 work or parser execution accepted.

## Strategy review

Main/Front/Back reviewed the offline fixed-source TypeScript transformation
strategy as an allowed P2 derivation technique, not a source-retention, target or
resource change. The compiler processes pinned Acorn **tool source TEXT**, never
imports installed Acorn or uses it as a target oracle. This is distinct from the
earlier text-inspection audit's no-AST-tool claim. Full adapter review and exact
two-way occurrence coverage remain required; tooling classification alone is not
semantic equivalence, allocation completeness or authority.

Lead Builder authors transformer/private runtime; a second Builder authors scalar
replacement bodies under a shared lexical interface. Main and Back independently
review those bodies; their author may not self-approve the same regions. Existing
accepted kernel/config/fixtures, Acorn/P1/v1/v2 and history remain frozen.

## First transformer draft — no derivation/import/check yet

Main text-read the first inspectable transformer. A later fixed bounded text cut
is retained in `TIP-081A_P2_CLOSURE_FIRST_GENERATOR.json`; it may include edits made
between the initial unpinned read and capture. It is not claimed as identical to
that earliest draft. Only text capture executed; transformer and adapter UNRUN.

| ID | Source finding / required closure |
| --- | --- |
| C-F01 | Source/package/runtime file reads originally precede size bounds. Require fixed named stat/file/size admission before read allocation, especially runtime template; no caller-selected paths or output destinations. |
| C-F02 | Hoisted function registration uses original local count while emitted functions add temporary variables. Compute/register final transformed frame shape, including temporaries, before each call; constructor/body hooks alone do not guard pre-entry frames. |
| C-F03 | Generic SyntaxKind fallback is not a closed coverage policy. Explicitly classify observed allocating/mutating/call and permitted nonallocating kinds; unknown enabled classes must deny derivation/admission. |
| C-F04 | Replacement cross-file lineage, for-in enumeration lowering, new generated spans and independent untouched-node coverage walk are missing in the draft. No source/inventory pin may be issued until these are closed and reviewed. |

First argument-array/literal transforms place scalar reserve calls before literal
construction; this must remain true throughout runtime/helpers. All receiver/key/
RHS evaluation order, compound/postfix return semantics, getter/closed-context
dispatch, actual array/map metadata, source/string overlap, schema/AST depth and
before-reentry guards remain independently reviewable obligations, not assertions
established by these draft observations.

Scalar helper review requirements include actual tokenizer `lastTokEnd` line-gap
semantics for Script HTML comments, decoded private word plus containsEscape, raw
versus cooked strings/templates, ordinary numeric values and BigInt pre-conversion
refusal. P1 public offset classifiers are not drop-in parser helpers. Original
strictDirective's punctuation heuristic omits in/instanceof and EOF strictness;
any deliberate helper correction must be recorded, not silently called identical.
Ordinary expression continuations must not be reduced to a new unsupported grammar
family just to simplify helper work.

## Runtime and scalar draft findings — still UNRUN

Main read the first315-line lexical runtime draft; Back independently reviews
runtime and all ten scalar bodies. Known unresolved symbols are not implemented
fallbacks and provide no source/check clearance.

| ID | Concrete obligation |
| --- | --- |
| C-F05 | Runtime slice uses mutable Math.min/max and property reads compare dynamically resolved global prototypes. Capture trusted targets/prototype identities or use scalar branches; post-import monkeypatches must not alter grammar semantics or receive private data. |
| C-F06 | Native own-property descriptors initially have an ordinary prototype. Reading absent `.get` can invoke a hostile Object.prototype getter with a descriptor containing private `.value`. Sanitize descriptor prototype before optional reads with its own guarded mutation, or use captured own-data access. |
| C-F07 | Disposal must delete the owner WeakMap row and clear all source/parser/AST aliases. Separate pre-auth schema/foreign rejection from owned operational abort, so invalid caller metadata cannot revoke another live owner. |
| C-F08 | New map properties need row/key/value/fanout admission and metadata field/key-unit updates, not only16-byte schema attempt debit. Generator must pass exact own-object field/key metadata. |
| C-F09 | Literal occupied array elements and writes into preallocated capacity need independently declared membership accounting. Fresh helper argument vectors can exhaust conservative internal-entry limits; do not equate those counts with actual P3 catalogue sites or waive a cap silently. |
| C-F10 | Private iterator/Symbol initialization requires an enforceable removed-surface row or closed symbol semantics; string/number-key runtime guards alone cannot admit the unmodified initializer. |
| C-F11 | Constructor/node branding, closed native/property/tool-regex dispatch, empty-argument workspaces, AST parent/depth propagation, trusted owner entry and exact static bootstrap remain unfinished. No runtime import or generated adapter may be admitted while these are unresolved. |
| C-F12 | Scalar identifier and numeric boundary checks initially denied known Unicode whitespace/line terminators. Builder repaired those boundaries. Radix helpers retain the original iterative readInt value; decimal fractional/exponent conversion must not use parseInt. Explicit1024-unit spelling support limit, raw/cooked and template-sentinel behavior still require final transitive review. |

Scalar body library now contains ten replacements and a handoff with original
anchors, parameter remapping and literal UNRUN controls. Its author does not
self-clear the same helper regions. Deliberate EOF/word-operator lookahead repairs
are distinguished from stock equivalence. Shared private helper bodies must also
receive occurrence/transformation review; no blanket trusted-scalar exemption.

## Later draft review and implementation checkpoint — not clearance

Back independently reread the complete ten scalar templates and handoff: scoped
template-text CLEAR for declared ASCII identifiers, <=1024 numeric spellings and
fixed ECMA2024. Parameter alpha-mapping and emitted transitive guards still OPEN.
No code was run to obtain this verdict.

Further concrete draft findings sent to the lead Builder:

- C-F13: reverse-edge/worklist arrays entered AST tracking recursively. Mark
  bookkeeping arrays distinctly; guarded appends must not create reverse edges
  for the tracking data itself. Ancestor propagation needs each edge child's
  current cumulative depth, not the initial child's depth at every level.
- C-F14: numeric property keys may allocate spelling during native reflection.
  Normalize once under guard and use the admitted string at each native boundary;
  retain numeric index semantics separately for capacity/membership accounting.
- C-F15: own-key enumeration of arrays needs numeric key payload reservations,
  not only string headers. For-in to own-key snapshots requires per-occurrence
  inherited-key/mutation justification, not universal equivalence.
- C-F16: scalar parameter metadata strings disagreed with the generator's array
  expectation. Shared helper functions were not yet embedded/transformed. Every
  cross-file replacement and hoisted final frame needs its own source lineage.
- C-F17: allowed AST operator kinds can still invoke ToPrimitive/ToPropertyKey/
  hasInstance. Exact scalar/private-type premises or typed guarded operator paths
  are required; generic SyntaxKind admission does not discharge this obligation.
- C-F18: blindly redefining an existing property with all attributes true differs
  from assignment and may fail on nonconfigurable fields/function prototypes.
  Preserve existing data attributes; classify closed accessor writes separately.

Lead saved repairs for fixed-FD reads, scalar/shared integration and final hoists,
descriptor/prototype/key handling, dictionary/membership accounting, CONTROL_ARRAY
depth work and initial native helpers. These are implementation statements,
**not independent final acceptance**. Still unfinished at this checkpoint: fixed
private owner/profile APIs, all closed native/operator classes, exact static
startup costs, untouched-source coverage walk, generated-span two-way map and
trusted tuple admission. No derived adapter, positive parser result or P3 output
exists yet. One bounded text capture is the only measured continuation effect.

## Resources and release state

Aggregate starts805292.486332/900000ms. First generator TEXT capture3.195417ms
plus1000ms allowance:806295.681749ms,93704.318251ms remains; no reset. Source
review/implementation effort does not itself consume this measured-effect budget.
No generator/runtime/adapter imports, syntax/lint/type/unit checks, original parser,
actual source/root/env/protected files, build/E2E/API/Git/math actions occurred in
this continuation. P2 stays OPEN; P3 is only a dependent next-stage intent.

## Full-source continuation review — no executable clearance

Main read the current637-line transformer and1027-line runtime template in full.
The exact nineteen normalized option keys independently sum278UTF16 units; the
field values and source-class premises still require final-cut review. Back and
Front read the non-own source independently. Front is now authoring literal
positive/negative controls; Main/Back, not their author, will review those controls.
Lead continues the complete derivative, not a reduced grammar or refusal manifest.

Additional obligations before acceptance:

- C-F19: itemize owner/output/runtime workspace and direct-helper frame envelopes.
  Static module-site counts do not automatically prove transitive runtime frames,
  and4096+8192+4096/1024 labels alone are not their cost argument.
- C-F20: classify all emitted private hook calls, including runtime sentinel sites,
  exact argument positions and extra/nonliteral/unknown sites. Silently recognizing
  only valid hook IDs cannot establish the reverse direction of coverage.
- C-F21: original for-in replacement needs exact per-occurrence premises. Enabled
  copyNode has a privately owned NODE, fresh destination and no enumerable grammar
  prototype fields/plugins; excluded getOptions/F09 hasProp are whole-body rows.
  Snapshot equivalence is not asserted for arbitrary objects or mutation.
- C-F22: independently walk every shared/scalar/fixed replacement source, not only
  original Acorn. Enumerate the emitted grammar's allocating/mutating/call/loop
  constructs and verify guarding sequence/dominance or counted local-frame slots.
  A list of hook spans alone does not detect extra unguarded output operations.

Lead's current static-cost/span-map/private-owner implementations are reviewable
drafts. They are not final source clearance, complete grammar coverage, positive
parser results or a P3 grant. Still no new measured effect since the first source
TEXT capture; cumulative806295.681749/900000ms,93704.318251ms remains.

## First inert derivation — FAILED, no parser output

Seven fixed named tool-source inputs were captured with same-FD bounded reads:
`TIP-081A_P2_INERT_FROZEN_CUT.json`. Back independently cleared exactly one inert
diagnostic derivation, not full coverage/admission. Main read the fixed mechanical
capture runner, then supervised one invocation with a15000ms hard subprocess cap,
384MiB Node heap setting and bounded stdout/stderr. Neither output nor installed
Acorn was imported/executed by the derivation tool.

Result: exit1,285.235666ms, no candidate/inventory created. Exact first stderr is
preserved in `TIP-081A_P2_INERT_DERIVATION_FIRST_EFFECT.json`: TypeScript reports
`Cannot start a block scope during initialization`. The transformer factory was
doing its source walk before returning the actual transformer callback. Installed
TypeScript5.9.3 source explicitly rejects that lifecycle. The repair moves the
whole transformation into the returned callback; it does not skip loops or disable
compiler assertions. The failed source cut and evidence remain preserved. No
automatic replay of the old runner or source is authorized.

Additional independent findings retained:

- C-F23: owner-paid wordsRegexp cache additions could outlive ownership. Lead
  replaced the helper with uncached owner-local fixed descriptors.
- C-F24: BUSY clock observations must advance lastNow, without renewing started/TTL.
- C-F25: runtime numeric costs were falsely treated as source-site IDs. The revised
  source restricts linkage to generated grammar plus a literal hook signature/
  family table; output coverage still needs actual independent review.
- C-F26: unconditional Object.prototype.toString alias initialization needs closed
  captured dispatch even though Array.isArray prevents its fallback call.
- C-F27: ordinary function implicit prototype/slot cost is separately modeled;
  ordinary functions192, nonconstructible bound intrinsics96. Source admission also
  needs retained primitive-string header32 in its control base.
- C-F28: TypeScript createNumericLiteral rejects negative numbers; signed generated
  constants must use a canonical prefix-unary node, not suppress that assertion.

Front authored107 literal controls/config; Main/Back independently read them.
Their acceptance/type/count/numeric observations do not prove deep AST semantics;
tuple tamper controls demonstrate immutable byte binding, not isolated semantic
guard detection. P2G097's actual refusal must be bracketed by a post-call trusted
timestamp inside the hypothetical renewed window; its source was repaired. All
107 remain UNRUN; trusted admission remains NOT_ISSUED.

New measured effects: frozen-text-cut18.205ms+1000; first-inert285.235666ms+1000.
Cumulative808599.122415/900000ms;91400.877585ms remains, no reset. No synthetic
grammar test, real-source acquisition, build/E2E/server/API or Git mutation occurred.
P2 remains OPEN; P3 stays dependent on full P2 acceptance. A corrected-source
diagnostic would require a fresh reviewed cut and explicit Main routing within
this same ceiling, never a blind retry of the failed cut.

## Corrected-source diagnostic route — Main, same scope/ceiling

Back independently reread the corrected full source and cleared only one further
INERT diagnostic. Main reviewed the returned-callback lifecycle repair, canonical
signed-number factory, exact guard signatures/families, generated-effect walk,
repaired monotone prototype-key bound, and complete revised mechanical runner.
The new cut is pinned in `TIP-081A_P2_INERT_REPAIRED_CUT.json`; the runner also
preserves its actual three source texts before import, rather than claiming a
reconstruction of the first failed cut. The original failed cut's pins/stderr are
preserved, but its complete source bytes were NOT captured; no contrary provenance
claim is made. Installed TypeScript's own lifecycle/numeric-literal assertions
were read to establish the concrete repair; neither assertion is disabled.

Main routes exactly one corrected-source TEXT generation, <=15000ms hard process
cap, same384MiB Node heap setting, bounded output and new O_EXCL artifacts. This
is an explicit reviewed repair route, not an automatic replay/budget reset. All
generated code remains OFF and quarantined; no parser/test/admission/P3 clearance.
Current cumulative809617.221915/900000ms;90382.778085ms remains. Any further effect
requires distinct source/evidence review and accounting; no silent retry loop.

## Corrected derivation failure and explicit third source route

The second reviewed diagnostic failed before any candidate/inventory output:
TypeScript `Node must have a real position for this operation`,804.535792ms.
Exact stderr and the actual three input TEXTs remain in
`TIP-081A_P2_INERT_DERIVATION_CORRECTED_EFFECT.json` and
`TIP-081A_P2_INERT_REPAIRED_INPUTS.json`. The foreign-tree visitor called
setTextRange on a node returned unchanged by visitEachChild, mutating the source
tree subsequently used by the independent occurrence walker. The repaired visitor
clones identity-original nodes before changing printer ranges. It does not skip
negative-position source nodes or weaken the independent walk/assertion.

Main and Back reviewed this repair, CONTROL-array initial schema fills, all
R01–R30 rule/cost/lifetime/profile bindings and lowered scalar-write lineage.
Back's scoped CLEAR permits exactly one THIRD inert diagnostic, not parsing,
admission or P2 closure. The new named TEXT cut is
`TIP-081A_P2_INERT_V3_CUT.json`; actual input TEXTs must be preserved create-only
in a new V3 snapshot before derivation. Frozen predecessors are not replaced.
Main explicitly routes this distinct corrected-source diagnostic: hard15000ms,
Node heap384MiB, bounded stdout/stderr, no candidate import, no target/original
parser execution. Actual output span/argument/guard-order coverage remains OPEN.

Second effect upper1804.535792ms plus third-cut upper1001.669ms yields
cumulative812423.426707/900000ms;87576.573293ms remains, no reset.
All107 grammar controls remain UNRUN and trusted tuple NOT_ISSUED. P3 remains
dependent on full P2 W1–W6 acceptance; no authentic source/build/E2E/API/Git or
mathematical authority is added.

## Third inert output and actual lifetime blocker

Third diagnostic succeeded,1750.165917ms, with no candidate import. Immutable
V3 candidate929113B SHA256c040b7a2632281b0c62cd0cb3d0a2deafedc73ea16241a9221c31b7c9328d799;
inventory5700732B SHA256e29cf400b12ec0523dc1e587d3b45171251e2855e98d26d1b9e818b86d83be97.
Actual7268 source rows/10339 hook sites/17732 emitted effects/30 rule classes;
open0/unmatched0/emittedUnknown0 are diagnostic classification counts ONLY.
They do not establish all guard arguments, dominance, semantics or lifetimes.
Actual static pool376054B/runtime logical workspace2732736B, native/RSS excluded.
Effect upper2750.165917ms and inventory-summary upper1022.013792ms yield
cumulative816195.606416/900000ms;83804.393584ms remains, no reset.

C-F30: Builder found and Back independently confirmed actual V3 module `ce=[]`
at line3939/source site4395, attached to AST `.arguments` at line3971/site4456.
Structural reverse metadata retains parent Nodes in ce's parents array. Module
closure keeps ce alive, so retired owner Nodes can remain strongly reachable via
WeakMap values and be traversed/charged during a later owner's work. State-only
dispose does not cut this edge. This violates R28/R30 lifetime/ownership despite
zero OPEN classification rows. No synthetic parser/admission release is allowed.

Repair is inside existing W2: review the exact ce source uses and analogous
module-array-to-AST aliases, then derive a fresh privately owned empty list at
the applicable use with exact lineage/cost guards. Preserve V3 artifacts and
failures. A new versioned derivation can be routed only after source review;
do not silently exempt static arrays, change ownership semantics or overwrite
earlier evidence. Full actual-source inspection is incomplete,107 tests UNRUN,
trusted tuple NOT_ISSUED, P2/P3 gate unchanged.

## V4 exact repair review / Main inert route

C-F31: analogous V3 module `te=[]` at line2068/site1501 attaches to side-effect
ImportDeclaration.specifiers at line2739/site2554. Same reverse-parent retention
defect as ce; both fixed source reads require owner-local empty lists.
C-F32: diagnostic stub body `unexpected` used UNSUPPORTED even though an enabled
grammar error should be SYNTAX_REFUSED. Direct diagnostic calls are whole-replaced;
closed bodies now preserve the same taxonomy. InvalidStringToken preserves
private ze throw when inTemplateElement and ecmaVersion>=9, otherwise SYNTAX.

Main/Front/Back read the exact V4 generator delta, static four-direct-array audit,
R31 bindings/dependencies and actual source-use premises. Function-local/parameter
shadow resolution is not generic lexical resolution: catch bindings are collected
at function scope. Exact pinned original only has catch(e), so t/i resolution is
unaffected in this source; do not generalize that approximation. ce/te each have
exactly declaration and one pe.parseNew/pe.parseImport attachment read. Fresh
depth0 guarded list changes private identity, not empty contents or exposed API.
Unused module lists remain prepaid, not silently exempted from accounting.

Front actual V3 partition[55607,500000) and Back[500000,929113) were fully read in
untruncated bounded chunks. Main read complete runtime prefix/template and actual
shared scalar/strict/ASI/let/async output regions. Own Front scalar/test areas
were not self-cleared; Main/Back independent review remains required. Actual
changed V4 emitted branches must be verified, so no parsing/admission yet.

Main/Back reviewed new repeated-owner P2G108/109 source: no-parentheses `new A`
and side-effect import, correct phase SYNTHETIC_ANALYZED, deterministic finite
accounting/retirement only, no GC proof. A pre-execution test phase typo was fixed;
no failed execution is hidden. All109 controls remain UNRUN.

New cut TIP-081A_P2_INERT_V4_CUT.json is pinned. Main reviewed complete updated
mechanical capture runner; new V4 snapshot/candidate/inventory are O_EXCL and V3
is preserved. Explicit one V4 diagnostic <=15000ms hard timeout/384MiB heap,
bounded output/no output import, same scope/ceiling. This is reviewed repair,
not automatic retry or P3 authority. Text-cut upper1001.271208ms brings aggregate
817196.877624/900000ms;82803.122376ms remains.

## V4 diagnostic refusal — exact owner-method alias premise was wrong

V4 diagnostic exit1,247.935708ms, SHARED_EMPTY_OWNER_METHOD_DRIFT before either
candidate/inventory was created. Actual V4 inputs and exact stderr are preserved;
V3 output remains immutable. Source review had incorrectly claimed a common `pe`
receiver for both sites. Actual V3 line2735 installs parseImport through `$`,
while parseNew uses pe. That earlier source-review statement is NOT retroactively
cleared; the exact audited receiver premise needs correction and independent
original-TEXT confirmation. This refusal is not a target/parser failure.

The proper repair keeps the closed owner-method check and uses two exact tuples:
ce/arguments/parseNew/pe; te/specifiers/parseImport/$. It must not delete the
receiver check or accept arbitrary aliases. Any later diagnostic needs a fresh
versioned source/output/snapshot cut and explicit Main review/route; no blind
replay of V4. All109 grammar controls remain UNRUN, admission NOT_ISSUED,
P2/P3 unchanged. Effect upper1247.935708ms: cumulative818444.813332/900000ms,
81555.186668ms remains, no reset.

## Evidence-first V5 correction / explicit Main diagnostic route

After the three distinct failed diagnostic cuts, Main applied Vibecode debug
discipline: preserve complete errors/source cuts, compare exact fixed inputs and
original method text, identify the failed premise before routing another effect.
Hypothesis of common receiver is refuted by original text; pinned-input drift is
not supported by the named checks; source alias premise is the concrete cause.
Main/Front/Back independently read original UTF8[40185,40640) and[65585,66665):
$.parseImport=function(e) assigns e.specifiers=te; pe.parseNew=function() assigns
e.arguments=ce. The V5 two-tuple repair keeps all exact use/count/method/receiver
checks and adds prototypeReceiver to evidence. No weakening or speculative
fallback was accepted. Front/Back explicitly corrected their V4 review error.

Main reviewed the full mechanical V5 runner and exact source delta. It now writes
new V5 source snapshot/candidate/inventory only, preserving V3/V4. Routes ONE
manual inert V5 diagnostic, hard15000ms/384MiB heap/bounded output, no generated
code import or parser run. Exact emitted changes still need independent review
after generation; parser/admission/P3 remain OFF. Existing source-cost/profile
contract unchanged. Cut upper1001.198916ms yields819446.012248/900000ms;
80553.987752ms remains, no reset. Build/E2E/API/Git effects still not authorized.

## V5 generated delta verified / private prototype blocker remains

V5 inert diagnostic succeeded1508.493292ms. Candidate929492B SHA256
e4a80ada0cf4ac8ae86943f4ab02b9b281da7334d9df7014dee853d69cf06b40;
inventory5707632B SHA2566f94aa4bc3e011d7865ac288dc01f54dd0d2d18c1ffba9ea9889c9f5d6ef713d.
7274rows/open0/unmatched0 are diagnostic, not acceptance. Main/Front/Back checked
actual fresh te site2556/ce4459, checkDepth0→reserveArray0→ownArray[] before
enclosing set2554/4457. Whole diagnostic/refusal labels and private ze tagged-
template identity/catch flow verified; Back refreshed actual remaining scanner
replacement bodies. Prior complete V3 partition read plus exact reviewed deltas
does not imply full native/RSS or deep AST-equivalence proof.

C-F33: Lead found, Back independently confirmed, ordinary private function
prototypes are not eagerly branded. Node de has no startup prototype read.
An absent own Node field (observe asks VariableDeclaration.expression) reaches
unbranded de.prototype and incorrectly refuses. Later copyKeys can first-adopt
permanent prototype metadata under active owner, a creation-lifetime debit flaw.
This blocks synthetic checks despite the clear fresh-list/diagnostic hunks.

Main routes narrow existing W1/W2 repair: register ordinary private function's
own data prototype and its own data constructor===fn at function creation
lifetime. Two precharged128-byte captured descriptors are sanitized with16 each
before optional-field reads;224 metadata/one membership, total512 additional
logical debit. Implicit prototype header80 is already in ordinary function192
and must not be double-charged. Captured native registrations explicitly skip
adoption; no host prototype branding or caller flag. Unknown shape fails closed.
Actual helper frame/workspace and R01/R15/R28 cost/lifetime rules need review
before another versioned inert cut. V5 output stays immutable/OFF; no parsing,
admission or P3. New effect upper2508.493292ms yields821954.50554/900000ms,
78045.49446ms remains. No budget reset or extra scope.

## V6 eager-prototype source review / Main inert route

Main/Front/Back independently read complete changed registerFunction/get/native
sections and R01/R15/R28. Exact eager own data descriptors additionally verify
ordinary prototype flags, captured Object.prototype parent, and own normal data
constructor===fn. Debits precede each reflection/sanitize/metadata operation.
Internal sixth boolean defaults true on generated five-argument private function
registrations; registerNative explicitly false. Generic prototype reads now
require already branded ordinary private metadata, refusing unknown/native
replacement adoption. No public adoption flag or host prototype trust expansion.

Function-frame inventory recomputes the helper's actual extra parameter/locals;
new direct edges descriptor/proto/reserve/meta introduce no get/invoke recursion,
so the reviewed direct-helper segment graph remains valid in this logical model.
Full native/physical/RSS closure is not claimed. Actual V6 emitted prefix and
new startup/workspace evidence must still be checked before synthetic admission.

New fixed cut TIP-081A_P2_INERT_V6_CUT.json, complete runner reread, preserved
predecessors/new V6 O_EXCL destinations. Main explicitly routes ONE inert V6
diagnostic <=15000ms hardcap/384MiB heap/bounded output/no candidate import.
All109 controls UNRUN; trusted tuple NOT_ISSUED; P3 not opened. Text-cut upper
1001.413708ms brings822955.919248/900000ms;77044.080752ms remains, no reset.

## Source-reviewed V6 release for bounded synthetic checks only

V6 inert generation succeeded1392.078459ms, candidate931985B SHA256
dac5bda74d57e9e9f0fcfefa614c0802aa6458670307bd610a479923da8fa47a;
inventory5709412B SHA256989f367de85e4b6fa9728e23accc198a3763b72c459d257d4dcf3726a82f8c90.
Actual7274 rows/10349 hook sites/17744 emitted effects/31rules, open/unmatched/
emittedUnknown0. Static377040B; helper segment10688B, workspace2*129*10688=
2757504B. registerFunction locals5/parameters6/frame240; get9/2/frame240.
These counts bind source review, not replace it or certify physical/native costs.

Main/Front/Back independently reviewed actual eager-prototype/nativefalse/bootstrap
output. Complete V3 partitions, actual V5 lists/diagnostics/sentinel/scalar changes,
full changed V6 runtime and exact literal arguments/order/lifetime/cost/profile
reasoning establish scoped SOURCE clearance for controlled synthetic checks.
The unchanged grammar suffix is mechanically pin-compared separately, not assumed
from output size. The unreachable Ue.prototype.raise diagnostic stub now uses
SYNTAX; readRegexp still refuses before entry, so no enabled unsupported RegExp
branch was reclassified. No blanket native equivalence/deep-AST proof is claimed.

Main accepts SOURCE_REVIEWED_SYNTHETIC_CHECK_ONLY, not full P2. Authoring a small
reviewable release-capture helper is routed: fixed-FD V6 tuple, unique compile
constant false→`true ` same byte/UTF16 length, no other executable edit; new O_EXCL
checked candidate/inventory/profile. All generated span coordinates remain stable.
Inert provenance/UNRUN/history preserved; fixed profile says fullP2Accepted:false.
Loader remains NOT_ISSUED until exact Main-captured new pins and independent
helper/tuple/loader/test source review. No parser/import/run yet;109 checks UNRUN.
No real-source/P3/build/E2E/API/Git grant added; aggregate accounting maintained.

## Checked tuple issuance / first focused health failure

Main measured exact V5/V6 suffix equality (871721 UTF16 units); V6 runtime
prefix grew2493 units, all remaining grammar source equal, no imports. Effect
upper1004.785708ms reaches827369.853707/900000ms. This establishes unchanged
reviewed text, not parser behavior or native equivalence.

Main/Front/Back fully reviewed the small release helper and literal profile.
One bounded mechanical capture succeeded136.943708ms. Main independently
same-FD reread all3 written files: checked candidate931985B SHA256
114334cd56f1edd181acf27e89fda40d6fca9c96e6f1a311532f346f43ae62ef;
checked inventory5710072B SHA256
41cfffe1f86a1499a490345ca059a54ace1f33d75bf77f8c8093fe19db3843e9;
checked profile2491B SHA256
9bc54a3542094a08a3d45fbf5b66c2feb8ffde72de4ca6efedfeac57ed6f47b8.
Unique equal-length false→true-space compile edit preserves every span.
V6 predecessors remain OFF and untouched. Inventory's original inert provenance
is retained separately from explicit source-scoped releaseReview; fullP2Accepted
false/checksUNRUN are historical capture state, never mutable admission flags.

Lead issued only fixed loader source status/paths/pins; Main/Back independently
read exact delta matching actual disk evidence and previously reviewed complete
unchanged loaderbody. Front changed3 fixed test paths only, Back read changes.
Focused TS config strict/allowJs/checkJs:false/noEmit/noincremental/exact3files,
Vitest envDir:false/setup[]/onefile source CLEAR; TS is harness typing, not JS
body or full-app proof. Main fixed-cut effect matched20 predecessor files and
captured14 current pins, NOT a whole-root/caller-graph preservation claim.

Main one first scoped check batch:7syntax PASS. Lint stopped with1error:
admission loader local `module` violates @next/next/no-assign-module-variable.
18 runtime-template unused warnings concern hooks referenced only after textual
derivation; they are recorded, not erased or hidden. TS and109unit controls
remain UNRUN; no parser was imported by these syntax/lint checks.
FIRST_CHECK raw logs/source pins preserved. Main routes narrow local variable
rename only; no source adaptation/cost/profile/assertion relaxation, no automatic
retry and no V6 regeneration. Source/delta review required before corrected batch.

Aggregate840847.04729/900000ms;59152.95271ms remains. Release/precheck/firstcheck
helpers count actual duration plus1000ms conservative allowance for each wrapper
and child check (firstcheck8children+wrapper=9000ms). P2 remains OPEN/P3 unopened.

## Corrected health / first actual grammar batch —108 PASS,1 failed

Main/Back reviewed consistent local rename module→admitted only. The corrected
effect mechanically reversed exactly10 identifier occurrences and matched the
first loader pin, capturing the complete newly executed loader TEXT. Issued
tuple, verifier/FD/cache/import logic and generated artifacts stayed unchanged.
Repaired loader syntax PASS, lint exit0 with18 retained template-unused warnings,
focused harness TS exit0 (checkJs:false), first grammar109 controls actually run.
108PASS/1FAIL in one exact file, all63 independent positive-production literals
PASS. No installed parser oracle, root input or authentic consumer work.

P2G107 expected structural DEPTH_REFUSED for a140-member iterative chain, but
observed ENTRY_REFUSED. This is a genuine failed expectation, NOT silently PASS.
All other refusal/authority/tamper/cleanup controls passed. Raw dual default+JSON
report retained, including original-TTL sample start519.531375,
firstElapsed601.741708,lastElapsed1202.4645,postCallElapsed1202.665167ms.
Finite actual no-renewal inequalities passed; no general timing theorem claimed.
Guard-removal P2G100 altered the actual reserveArray call in a supplied copy and
the fixed artifact verifier refused it before import; hash-denial is not a
semantic missing-guard detector or permission to execute the altered adapter.

Main/Back source diagnosis: reserve checks byte→node→entry conjunctively, with
metadata/arg-vector/schema memberships before child-depth attachment. Resource
caps can safely refuse BEFORE a prospective AST-depth crossing. The member test
therefore overclaimed an isolated axis; do not merely relabel it and claim depth
coverage. No cap raise, ledger discount, new options or partial-AST export routed.
Source-only review is examining a lower-allocation iterative empty-callee chain
for a separately measured structural-depth control. No automatic rerun authorized.
Original test TEXT29368B SHA25632e8b7baab7cdefe395afb973e96c77da431851b94b5741f092dee88abe2bfaf
captured same-FD before any test edit in GRAMMAR_FIRST_EXECUTED_TEST.json.

Corrected effect upper9202.617542ms reaches850049.664832/900000ms; original-test
preservation upper1000.42925ms reaches851050.094082/900000ms. Remaining
48949.905918ms. P2 still OPEN; W5 actual structural witness not accepted yet.

## Final W1–W6 scoped engineering acceptance / STOP at P2

The fixed plain-call diagnostic preserved all3 ENTRY outcomes/disposal; no false
depth PASS. Main/Front/Back reviewed a lower-entry fixed unary/call pair, no cap,
runtime/profile/excluded-native/AST-interface changes. Main actual31prefix+94call
analyzed128nodes/19216entries/40573726logicalB;32prefix refusedDEPTH/disposed.
Hand shape includingProgram/ExpressionStatement gives128/129; reviewedprivate
frame path<64 separates the AST limit from callDepth. This finite evidence is not
private AST metadata exposure, deep equivalence or a general timing/physical proof.

Main preserved first executed109test TEXT then routed onlyP107: exact original
member ENTRY refusal remains; add128positive/129DEPTH and authority retirement.
Main/Back source-clear delta; final source capture verified other108 fullprefix/
suffix unchanged. Independently routed final lint changedfixture+2diagnostics+
config0warnings/errors, focusedTSexit0 and109/109uniquecontrolsPASS onefile.
Whole hand-authored lint's18 unusedtemplate warnings remain documented.
Raw finalTTL1000 first602.219209,last1204.583042,postCall1204.768 retained.
First lint and108/109unit failure/rawdiagnostics remain predecessor evidence.

Independent non-own postreview Front/Back CLEAR within their covered source and
evidence; Main aggregates completepartition/delta/allocation/semantic/release
review with actual controls. Final namedpreservation36/36 MATCH20predecessor+
16current, no wholegraphclaim. External Main GRAMMAR_COMPLETION.md and
GRAMMAR_COMPLETION_EVIDENCE.json acceptW1–W6 6/6 for the approved bounded
synthetic private grammar ONLY. Checked profile'sUNRUN/fullP2false are historical
capture flags, not admission authority; no rewrite/repin needed for documentation.

Exact final aggregate867323.494582/900000ms;32676.505418 remains, noreset.
All25continuationeffect records/child-wrapper allowances retained. First failed
47194-byte generator cut was not capturedcompletely;18776-byte earlierdraft is
NOTthatfailure. Available pin/log/history preserved; no complete failedsource
reconstruction claimed. Current acceptance binds complete V6/current evidence.
STOP: P3 producer/private summary/replay is next separately approved stage, not
run/admitted here. Real ownership/receipt/P4–P5/native/physical/deepAST/math and
fullRuntimeClosure remainunaccepted;62OPEN/callergraphOPEN unchanged.

Final written W6 report/25-entry ledger/latest handoff and ACTIVE blocks were
independently read by Back: CLEAR, no concrete scoped blocker. Manual duration
sum18031.00825ms+44000allowances=62031.00825 continuation matches finalaggregate/
remainder. No extra effects, grants or counters reset; STOP confirmed.
