# TIP-081A P1 — Independent source/semantics review history

2026-10-07 · SAME081D8 engineering · parser OFF · source review pending.
No executable check has been run. Previous codec/audit results are not P1 tests.

## Contract review before implementation

Main: Owner explicitly approved P1 only; new synthetic modules/fixtures/config,
no frozen-code changes, real source/issuer/AST/parser or P2–P5 transition. Independent
review precedes Main-owned bounded checks under remaining aggregate. Single opaque
owner, fixed distinct Script/Module fixture exports, primitive lower cap/shorterTTL
are permitted details, not caller grammar/options. Full text cost before retention;
no private text/AST accessor/callback. Logical costs do not certify RSS/native host.

Front semantic reader's constraints (relayed to Builder):

1. Strict detection supports raw exact spelling, not escaped cooked equality;
   validate earlier quoted-expression termination and stop at a nondirective. EOF
   must be supported or honestly refused. This is not full directive grammar.
2. Quote+linebreak followed by bracket/paren/member/template/operators may continue
   the expression. `!=` differs from `!`; newline `++`/`--` must follow a pinned
   rule or refuse OPEN. Escaped line continuation is not inter-token ASI.
3. CRLF/CR/LF/LS/PS, block-comment linebreak, fixed modern scalar whitespace,
   NBSP/BOM are explicit. U200B/U180E are not modern whitespace. Unterminated or
   unsupported quote/comment cannot be skipped to discover later strict.
4. Script `<!--` is a linecomment at token boundary; `-->` only at first-token
   position or after linebreak in previous-token gap. Module does not skip these.
   Prior context must be privately pinned or ambiguous close-comment context refused.
   No recursive next-token comment loop.
5. Escaped ASCII IDStart/IDContinue and full identifier boundary; retain
   containsEscape. Escaped contextual keyword cannot be unescaped contextual match;
   reserved-keyword text is not valid-statement proof. Unknown Unicode refuses,
   never silently becomes no-match or accepted invalid identifier.
6. ASI helper exposes line/span facts only, not universal insertion decisions.
7. Regex/BigInt preflight with unknown context refuses OPEN/UNSUPPORTED before native
   conversion; guard/scanner success does not release parser.

Reader used only bounded named parser TEXT spans/previous pinned anchors, not parser
oracle/helper/tests/hash/root reads. Literal fixture outcomes must be independently
reviewed. Source allocations/first-code findings will be recorded below before
executable checks, with failed versions and repairs retained.

## First module source review — UNRUN findings

First complete module text is archived in TIP-081A_P1_FIRST_MODULE.json:
16897bytes / SHA256 a313df883aa860997cc23971a6b4fe71dca00c09fb36c41d1aff9c947e79f80f.
Main read full text; front reader reviews semantics, back reader guards/lifecycle.
No executable check preceded these findings. Builder repair requested, not yet
accepted. Counterexamples below are source reasoning, not observed runtime tests.

| ID | Severity / obligation | Finding / required repair |
| --- | --- | --- |
| P1-F01 | P1/R1 | multiply division guard lacks safe-integer check of final product; guard product before use, retaining no mutation on overflow |
| P1-F02 | P1/R2 | authenticated parser/native-literal refusal leaves active private text; clarify pre-auth foreign/schema vs authenticated operational failure and retire the latter, including wrong-phase/out-of-range operations |
| P1-F03 | P1/R2 | dynamically looked-up WeakMap get/set/delete can leak/forge state under post-import monkeypatch; capture trusted intrinsic calls or narrow privacy claim explicitly |
| P1-F04 | P1/R2 | create rejects BUSY without checking existing deadline, leaving dropped-handle expired state retained; clean expired active state without renewal before new admission |
| P1-F05 | P1/R3 | quote+LF+in/instanceof continuing expression can be falsely marked RAW_STRICT_DIRECTIVE; bounded complete-identifier lookahead, escaped/unknown context refusal, no prefix false positives |
| P1-F06 | P1/R3 | valid leading hashbang then directive returns semantic NO; support pinned absolute-start hashbang or honestly UNSUPPORTED before classification |
| P1-F07 | P1/R3 | public arbitrary numeric start lacks prior tokenizer boundary context for script -->; constrain/document admitted prefix/gap boundary semantics or refuse ambiguity, not stock-tokenizer equivalence |

The module's fixed initialization/state/scratch/output cost derivation and every
new allocation occurrence still require the Builder inventory and independent
review. Parser/native/real source admission remains disabled throughout repairs.

Additional pre-check findings:

- P1-F08 (R5): first P117 timing waited a full TTL after the read, so it would pass
  even with renewal. Repair uses TTL1000ms, read/reserve at approximately600ms,
  final observation at approximately1200ms: original expired, renewed still live.
- P1-F09 (R1): fixed internal scratch does not bound caller argument vectors/VM
  implicit arguments materialization before entry. Explicit host exclusion added;
  exact-arity rejection is not physical call-time allocation proof.

Builder source-ready revision repairs F01–F07, adds captured clock/Number controls,
and documents fixed G00–G15 logical costs,23 state fields, bounded10-frame scratch,
startup/owner/output/refusal reserves and caller/VM exclusions. No parser or real
authority is admitted. Literal P101–P150 authored (50 controls), all still UNRUN;
final independent source/document clearance precedes executable checks.

## Pre-check source clearance

Back reader final CLEAR: F01–F04 resolved, current inventory23 fixed fields and10
conservative nonrecursive frames, explicit caller/VM argument exclusion, private
captured intrinsics, lifecycle, original deadline and monotone reservations. No
additional new-module allocation blocker found; no physical/grammar claim.

Front reader final CLEAR: repaired supported semantics, independently hand-checked
literal spans and word-operator/hashbang/HTML gap outcomes, documented known-boundary
and Unicode/context refusal limits. P117 additionally records trusted timestamps
and asserts observation<renewed deadline; Main read/accepted that fixture-only
refinement before checks. No parser oracle, shared expected-result generator or
executable review used. P148/P149 restore host monkeypatch before assertions.

Main accepted scoped pre-check source/fixture/config/inventory clearance. F01–F09
resolved for P1 scope; general grammar/native/physical/authentic source OPEN.
Exactly50 controls P101–P150 authored. No code-check PASS is claimed here; the
first specifically bounded Main dispatch/capture is the next authorized operation.

Runner boundary refinement before first check (P1-F10/R4/R6): Main inspected the
installed Vite primary source/type declaration. Default envDir could load `.env`;
new focused config now sets `envDir:false`. Installed getEnvFilesForMode returns
[] for false; resolution passes false to loadEnv. No .env file was read to discover
this. Only the new config/invocation documentation changed, not old configs,
module, fixtures or acceptance strength. Prior reviewed source cut is preserved;
final pre-dispatch cut binds the new config. Main accepted this guard before any
test import. This is runner isolation, not a full dependency/runtime audit.

## Post-check evidence review — scoped CLEAR

Main dispatched exactly one reviewed four-job batch: module syntax PASS; one new
fixture file50/50 unique P101–P150 controls PASS; three-file lint PASS; focused
TypeScript errors0 with unchanged strict/allowJs and repo checkJs=false. No app
glob, build, real source or parser invocation. Driver/stdout/stderr/timing retained
in FIRST_CHECK; no retry or second test run was needed.

JSON reporter did not emit P117's console numeric timestamps. Record
RAWTIMESTAMPS_NOT_CAPTURED, not invented values. Its pinned trusted-clock inequality
assertions (originalElapsed>=1000, sinceBeforeRead<1000) and TIME_REFUSED all PASS;
duration1203.663750ms is archived. Front/back readers independently accepted this
as finite discriminating fixture evidence; neither calls it a no-renewal theorem
or independently reconstructable raw numeric window. No extra rerun requested.

AFTER_PINS14/14 MATCH:11 named frozen files +3 executed new module/test/config,
not full predecessor universe/root revalidation. Installed Vite envDir:false
disables automatic environment-file loading; no formal filesystem trace claimed.
Both independent post-check reviews CLEAR/Main accepted. Physical/native/host,
full grammar/syntax, actual owner/replay and runtime/math remain OPEN.

Final cumulative793967.657875/900000ms;106032.34212499997ms remains, no reset.
FIRST_CHECK preserves its own earlier792962.524459ms checkpoint. STOP at scoped P1.

Final independent document-consistency review CLEAR: completion/evidence/current
inventory header/Builder addendum and handoff/ACTIVE agree on scoped6/6, one50-
control batch, P117/type/pin limits, budget and parser-OFF/P2–P5 ungranted STOP.
No further effects or code changes. Main accepted final report.
