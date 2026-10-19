# P3 R3 verifier — pre-code freeze

2026-10-08 · SAME081D8 · PHASE1 SOURCE-ONLY.
Owner's direct R3 approval is recorded in the latest handoff/ACTIVE checkpoint.
This document freezes this Builder's verifier seam and independently hand-derived
normal fixture, not implementation/effects/admission or self-acceptance.

STATUS: GUARD/SHAPE FREEZE PROPOSED; NORMAL PARSE RESOURCE FIT STILL BLOCKED.
No code/runtime/test/old-report edit, hash/import/derive/parser/check/compile,
network/Git operation or protected/native/actual-source read/stat was performed.
Only this new report is authored. Await Main's reconciled pre-code freeze and
explicit code release. R2/P2 sources/artifacts/history remain unchanged.

## Intended new source and exact independent child guard

Future new file only: `scripts/test/private-summary-verifier-tip081-p3.r3.mjs`.
It will export only a constant lexical snippet, provisionally
`PRIVATE_SUMMARY_VERIFIER_P3_R3`, for offline embedding. No source/AST-taking
public API, kernel export/factory/seed, caller callback or normal brand is added.
Tool Builder must reconcile that constant name before code release.

The independently authored private guard will be
`__HIVE_P3_vGuardChild(parentIndex)`, exact arity1. Frozen proposed body text:

```js
__HIVE_P3_touch();
if (!__HIVE_P3_vU(parentIndex) || parentIndex > 127)
  __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
if (parentIndex === 127) __HIVE_P3_abort("DEPTH_REFUSED");
return true;
```

This is a specification inside the report, NOT a product implementation.
`vU` rejects negative, -0, fractional, non-number, unsafe and nonfinite values
without coercion. Valid parent indices0..126 admit;127 rejects a129th Node;
128 or invalid inputs reject as invalid private state. Return is true only on
admission; refusal throws the actual fixed singleton after owner disposal.
No expected value/fixture flag enters the guard. Producer's separately authored
`pGuardChild` uses its own integer/subtraction formulation; no shared depth
implementation or traversal/classifier is permitted.

The only normal call-site replacement is in `vWalk`, current old source
`scripts/test/private-summary-verifier-tip081-p3.mjs:315`:

```js
__HIVE_P3_vGuardChild(top);
const next = frames[++top];
next.node = child;
```

All other current ancestor-cycle/type/schema/read/escrow checks remain before
this point; all existing inheritance/binding assignments remain afterward.
Guard executes BEFORE top increment, frame selection or child writes. It runs
in both complete passes through that one lexical loop body. Arrays remain on
the current frame and do not invoke child guard until their next NODE child.
The old inline depth condition must be removed only from the new R3 copy;
an unused look-alike helper or testing only a copied predicate is insufficient.

### Direct/transitive lexical dependency closure

Depth component copies the exact guard body and these dependencies:

- `vU` → captured `__HIVE_P3_floor` / retained Math.floor capture; primitive-only
  numeric comparison and reciprocal -0 check. No source, AST or native callback.
- `touch` → original `__HIVE_P2_timed` → captured original perf_hooks clock,
  captured finite check, private owner.lastNow/started/ttl. Expiry goes through
  original `__HIVE_P2_refuse`/dispose bridge. No renewal or dummy clock.
- `abort` → actual `__HIVE_P3_dispose` and `__HIVE_P3_error` → fixed frozen P2/P3
  error tables, private owner/active slots, captured WeakMap delete and private
  owners WeakMap. R3 disposal body/bridge must be identical in normal/kernel
  dependency extraction; no substituted harmless mock.

The UNIT_ONLY K record is the actual charge/clock owner; model parent indices
are NOT AST allocations. Kernel must have neither parser/create/analyze/replay
nor normal authentication/brand/six APIs in its closed dependency graph. K/S
dual cleanup remains mandatory: normal abort clears K, not necessarily S/local
writer roots. No normal owner can select a model case or component tuple.

### Costs and component observations

New guard declaration logical function/prototype192; helper frame
64+16*(parameters1+locals0)=80. It has no recursion, closure, object/vector,
string construction or per-call new membership. Actual literal/key/module-slot
rows and any call-site/local-count changes are independently source-inventoried;
the192/80 are not guessed whole-function cushions. Existing P3 frames stay
charged; no inherited multiplier is reduced to fit. New direct graph remains
acyclic, with terminating P2 failure/dispose bridges reviewed before import.

Mandatory independently expected component records:

| Registry case | Fixed model input | Actual required outcome |
| --- | --- | --- |
| P321.R3.B.V126 | parentIndex126 | ADMIT; guardAdmitted true; no private frame push is performed by the model case |
| P321.R3.B.V127 | parentIndex127 | REFUSE; actual DEPTH_REFUSED singleton; guardAdmitted false |
| P321.R3.B.VNEG | parentIndex-1 | INVALID_ARGUMENT_REFUSED; actual ALLOCATION_COVERAGE_OPEN singleton; guardAdmitted false |
| P321.R3.B.V128 | parentIndex128 | INVALID_ARGUMENT_REFUSED; actual ALLOCATION_COVERAGE_OPEN singleton; guardAdmitted false |

The output's invalid negative parentIndex field is null because R3 numeric
observations are nonnegative safe integers; the independently frozen registry
proves that case's negative input. Observation/error identity must come from the
actual call, not an expected-code echo. Boundary/model values cannot mint NORMAL,
VERIFIED or a source lease. Source/body pin and all transitive closure/cost rows
bind component and normal call-site before effects.

## Verifier SHA observer closure for the isolated writer

Only the existing independently authored `vSha256`/`vShaBlock`/`vShaConstants`
and `vU` are needed from this verifier for the actual complete wire digest.
Retain those bodies unchanged in the new R3 copy. Do NOT pull in vDecode,
vWalk, replayStart, parser or normal module import to observe model writer bytes.
Additional dependencies: real consume/touch/abort; captured charCode/floor,
Uint32Array/Uint8Array; safe u8View with captured typed-array slot getters and
captured constructor; closed captured ASCII TextDecoder. Source hash and wire
digest are separately authored from producer SHA; no native Hash/private-source
buffer route is reintroduced.

Each observer hash consumes4432 BEFORE typed-array construction/output: named
4096 workspace, hex64+header64, digest string160, safe view48. K must actually
pre-reserve/consume its own VERIFY_CODEC quota; S model ledger cannot fund it.
Static64-word K table backing600 plus actual null-sanitization16, function /
literal/capture rows and exact source-derived helper coexistence are inventoried.
Tail reader is a separately frozen bounded captured-string operation. It must
read actual wire tail, not S.sourceIdentity, model seal or an expected digest.
External tests reconstruct canonical MODEL_ONLY fields/order/body seal/wire digest
independently and compare actual digest/length. Writer fixture and observer
records/strings/overlap have their own before-growth rows; this report does not
invent their as-yet-unreconciled factory totals.

## P321.R3.a exact normal integration fixture

Exact literal: `!!!f()()()()()()()();` — SCRIPT,21 ASCII/UTF16 units.
No target expression is evaluated. Use cap67108864 and original TTL120000 for
normal API calls; driver/unit deadlines remain separately frozen and do not
renew this TTL. No caller options/program/offsets/locations/ranges are enabled.

Hand shape: Program→ExpressionStatement→three UnaryExpression nodes→eight
nested CallExpression nodes→Identifier. U=N=grammarAttempts14; Node path depth14;
S8; A1 (Program.body's one slot; eight argument arrays are empty); B0.
Attempts14 presumes this non-arrow/non-destructuring path creates no discarded
Node; declaration-error helper records are not Nodes. Source review must verify
that premise, not replace it with a parser-derived expectation.

Program and ExpressionStatement spans[0,21); unary spans[0,20),[1,20),[2,20);
Identifier[3,4). Canonical eight site rows, increasing end with the same start:

| kind | start | end | binding | loader | conditional | optional | computed | status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CALL | 3 | 6 | NO_LOCAL_BINDING | OTHER | CERTAIN | false | false | OPEN |
| CALL | 3 | 8 | NONE | OTHER | CERTAIN | false | false | OPEN |
| CALL | 3 | 10 | NONE | OTHER | CERTAIN | false | false | OPEN |
| CALL | 3 | 12 | NONE | OTHER | CERTAIN | false | false | OPEN |
| CALL | 3 | 14 | NONE | OTHER | CERTAIN | false | false | OPEN |
| CALL | 3 | 16 | NONE | OTHER | CERTAIN | false | false | OPEN |
| CALL | 3 | 18 | NONE | OTHER | CERTAIN | false | false | OPEN |
| CALL | 3 | 20 | NONE | OTHER | CERTAIN | false | false | OPEN |

Only the innermost callee is Identifier f. Outer callees are CallExpressions;
no ambient/builtin or execution certainty is inferred. Expected lifecycle:
SOURCE_READY→PRODUCER_SUMMARY→PRODUCER_AST_RETIRED→VERIFIED→RETIRED, exact wire
identity/seal/schema and independent field equivalence, grammarPasses2 and stale
AUTHORITY_REFUSED after retirement. Prior R2 normal129 remains unclosed, not PASS.

### Exact traversal/ledger algebra and remaining resource-fit gate

No prior observation is needed for this normal variation (M0). Frozen rows give:

- Visits per stage2*N=28; source units21; Node/structural depth14 below128.
- Producer work304440+16336*14+480=533624.
- Verifier work533624+private replay record128+counts160+result144=534056,
  below unchanged2641208 (unused2107152 remains charged).
- Codec3610440 below unchanged3612704; unused2264 remains charged.
- Let Pp/Pr be exact common grammar entry deltas. Historical producer entries
  =257+Pp+66*14+2+2*8=1199+Pp.
- Full entries before VERIFIED metadata=545+Pp+Pr+132*14+4+14*8
  =2509+Pp+Pr; observations/metadata add no membership. Thus Pp+Pr<=17491 is
  sufficient for this entry axis (same-P bound P<=8745), not yet an established
  parser operation upper bound.
- Let T be actual new R3 tool/startup/workspace bytes and Qp be producer parse
  bytes. Control1536 plus source84 makes base T+1620. Initially reserve25165824
  replay+6758296 scratch+304440 producer capacity. Producer adds229184 work:
  total at producer summary = T+32459364+Qp. Codec/metadata transfers do not
  change that sum, and replay consumes previously reserved categories.
- Separate replay family amounts must EACH fit NODE_SCHEMA8388608 and ARRAY /
  STRING / CALL_FRAME / BOOKKEEPING4194304 each, regardless of total fit.
  Byte condition is T+Qp<=34649500; replay-family sums/individual bounds are
  separate. No cross borrowing or generic whole-parse estimate is accepted.

BLOCKER before code release: exact reachable grammar memberships, helper-call
coexistence/private-call upper, five replay-family cost uppers and new R3 T
are not yet jointly itemized for this21-unit path. The wide margins above do
not authorize inventing a4096/other whole-function cushion or scaling a prior
measured hybrid result. Raw observed counts later compare to frozen bounds,
never supply them retroactively. Main/other Builder must reconcile a finite
source worksheet and exact inventory before calling this fixture FIT. Physical
clock/scheduler/native/RSS behavior remains OPEN even after logical fit.

### One bounded narrow source trace / exact unfinished rows

The permitted single narrow pass establishes the following trace skeleton from
the checked P2 emitted TEXT, not an executed parse or measured trace:

| Region / anchor | Fixed path established | Unclosed cost composition |
| --- | --- | --- |
| runtime `fixedOptions`:517; candidate Parser:1467–1517 | One nineteen-field options record; constructor offset absent; one getOptions; four wordsRegexp descriptor requests; SCRIPT excludes MODULE string append; curPosition returns no location; initialContext; nonquote strictDirective; hashbang two-unit peek is not a comment; one enterScope | Exact option/Parser own-slot/constructor vectors and frames; four owner-local regex-descriptor/keyword-spelling costs, initial context/Scope/list writes and primitive conversion/native dispatch |
| candidate parse:1518; topLevel:1758–1779 | Program creation; initial nextToken; exactly one statement; one body push; non-MODULE undefined-export branch; directive adaptation; final next at EOF; finishProgram | Initial and final vectors, body zero-capacity growth/depth propagation, own dictionary reads, directive-adaptation branch and finish/native.call/rest-vector accounting |
| candidate next/nextToken/readToken:4979–5029; finishToken:5071 | Three bang tokens, one identifier, sixteen parentheses, one semicolon, TWO EOF reads =23 nextToken calls. The second EOF comes from topLevel's final next at site963, not a second source character. onToken/locations/context override are disabled on this path | Each curContext→skipSpace→packed scalarTrivia call chain; fullCharCodeAtPos/isIdentifierStart vectors; getTokenFromCode punctuation and bang/readToken_eq_excl; finishOp slice; finishToken/updateContext; dispatch/native.call copies and slot replacements |
| candidate context handlers:3220,3239,3261,3309 | Eight paren-context pushes and eight pops; three bang/default expression updates; one name update; semicolon/EOF default update | Exact context-array capacity/growth overlap, native.call rest vectors, safe numeric key conversion, captured push/pop/delete and inherited-schema writes |
| candidate parseUnary:3519 onward; parseSubscripts:3596 onward; ExprList:4310 | Three prefix Node wrappers; eight iterative calls; each empty argument list returns after successful eat of closeParen and never enters parseMaybeAssign argument loop | Remaining small eat/checkExpressionErrors/DestructuringErrors/startNodeAt/finishNode vectors; AST links/reverse-parent/depth queue items; fixed call-body coexistence proof |
| candidate Node:4556; start/finish/copy:4570 onward | Primitive Node constructor and normal14 Node shape; no ranges/locations/source-file payload or copyNode branch expected here | All constructor/own-property/metadata plus finishNodeAt.call copied-rest arrays and native dispatch costs must be summed by family, not inferred from14 final Nodes |

Thus the earlier provisional22-token mention is superseded by exact23 transition
count; source21 units and fourteen-Node/eight-site shape remain unchanged. This
pass did NOT close the numeric Pp/Pr/Qp/five-family uppers or private-call bound.
No whole-function cushion, rescaled historical sample or silent successful-fit
claim is supplied. Exact first failing resource/elapsed result is UNRUN/UNKNOWN.

New T is a different kind of pending item: it is the prospective source-derived
static/workspace census of the NEW exact R3 source. It cannot honestly be a
fresh numeric pin before that source exists. The guard's192/80 costs and closed
dependency/body/fixture obligations may be frozen prospectively for narrow
authoring, then exact T/locals/constants/bootstrap rows independently computed
and reviewed before any effect. That permitted post-source census does NOT
remove the genuinely unclosed normal-parser call-path/family uppers above.
Main decides the narrow source-release sequence; this report supplies neither a
full pre-code FIT verdict nor permission to execute the unfrozen normal fixture.

## P321.R3.c / P322.R3.a composition and stop

Retained P2 Node1 / ARRAY0 precommit link invariant means no successful normal
parse exposes129 to either P3 walk. New verifier guard tests its boundary only
as COMPONENT logic, not normal AST129 reachability. Full normal tests remain
mandatory; component success cannot replace them. Bind set→linkDepth→defineData,
reverse-parent propagation, parse-return-before-walk and new guard-before-push
source sites in the complete R3 emitted review. Source-map counts alone do not
close this composition obligation.

P322 normal stage ledger reconstruction continues independently from initial
categories and replay grammar deltas, not producer wire totals: work formula,
metadata-emission snapshot, category sum/peak, disjoint escrow transfer and
producer/replay retirement costs. Exact used19999/20000 model tests belong to
the separately authored actual entry guard; this verifier imports neither that
guard nor producer ledger/extraction helpers. Tampered category/total/peak/
retirement fields remain actual normal replay refusals with stale cleanup.

STOP pending reconciled pre-code dependency/fixture/resource/registry/manifest
freeze and Main's code release. Intended next work is this new R3 verifier copy
only, followed by independent Main/Back review, not author self-CLEAR. No effects
or admission are permitted by this report. Aggregate870882.767416/900000ms and
P3remaining21440.727166 unchanged; predecessor62OPEN/fullRuntimeClosureNOT_ACCEPTED.
