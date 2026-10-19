# TIP-081A — Private real-source consumer/replay implementation plan

2026-10-07 · SAME081D8 engineering · revision 2 · PLAN ONLY / NOT RELEASED.

Dependency: complete pinned-text audit in
`../../verification/TIP-081A_PARSER_ALLOCATION_AUDIT.md`, not an admitted allocator.
Owner's current route stops after reviewed audit/plan. The steps below do not grant
implementation, source access, parser invocation, tests, build, E2E or runtime.
This refines the approved bounded-consumer design; it changes no resource ceiling,
research target, predecessor scope, receipt history or admission gate.

## Architecture decisions

1. Keep installed Acorn, old manifest/source-store/verifier and synthetic v2
   codec/admission frozen. Create separately pinned new versioned modules only
   after routing. Do not patch installed parser or expose an old private lease.
2. New source-owner module owns one authentic source Buffer/text and lexical
   producer/replay code. Internal capability is never exported: no getText,
   callback registration, caller-provided parser, public AST, chunk reassembly or
   metadata-to-authority adoption. Public operations accept only exact-arity
   same-instance opaque owner/lease brands and bounded JSON text metadata.
3. Bounded adapter is a private new artifact derived from the pinned grammar;
   stock parse+counts, post-parse AST guards and token/node callbacks are rejected.
   It stays OFF until occurrence-level allocation and supported-semantics reviews
   pass. Text audit identifies work, not a release certificate.
4. Replay is independently authored extraction/traversal and literal ledger
   arithmetic, lexically inside the private owner. It must not call producer
   extraction/ledger helpers. Shared grammar/infrastructure risk is recorded;
   separately implemented relevant syntax or reviewed equivalence is required
   before semantic completeness. Source hash/DFA does not verify syntax sites.
5. Real receipt codec/profile issuance is a **new pinned lane**, not relaxation of
   synthetic fixed-domain pins. Existing synthetic acceptance remains inert and
   cannot issue live authority. Preserve schema/version/purpose/seals; any necessary
   schema departure needs new Owner routing with predecessor history retained.

## Ordered packages and exit evidence

### P1 — Guard kernel and fixed-source scanner replacements, synthetic only

Proposed immediate implementation package; not currently granted. Builder creates
new private ledger/control/scanner modules and focused synthetic fixtures only.
Main does not implement product code. No real receipt/owner/source bridge yet;
parser entry remains `ALLOCATION_COVERAGE_OPEN`.

Deliver: reviewed logical cost convention for object/header/properties, arrays and
resize overlap, keys/maps, derived UTF16 old/new strings, helper records/frames,
fixed error/output scratch and tool initialization. Safe-integer subtraction-before-
addition guards; permanent producer debit; separate category transitions; captured
monotonic deadline and bounded loop checkpoints. No actual V8/RSS-size assertions.

Replace strictDirective/whitespace-comment/directive/newline/escaped-identifier
lookahead with bounded scalar index scanning, preserving script/module and escape
semantics. Prevent legacy-comment recursion. Exclude user options/coercion/hooks,
target regex/BigInt before conversion; no native target literal construction.
Such scanners are internal building blocks, **not a streaming/token-only substitute
for full syntax analysis**. Their completion cannot turn on the parser.

Acceptance: independent read-only source review maps each new allocation to
before-growth guard and fixture; exact byte boundary/+1, deadline/expired cleanup,
lookahead at EOF/comments/directives/escapes, failed tentative work and fanout
controls. Pin the complete new source and first/final check logs. Synthetic test
imports may run only after specific implementation/check approval and within
aggregate117159.59883299994ms; no silent retry/reset. If this package is too large,
report PARTIAL rather than shrink semantic claims or spend past the ceiling.

### P2 — Complete bounded grammar adaptation, still synthetic only

Depends on accepted P1 and separate routing. Cover every enabled constructor/node/
schema/list/dictionary/context/scanner/error allocation occurrence in F01–F12,
including cross-family calls, failed branches, copied defaults and reset caches.
Each inventory row needs exact adapter span, operation, guard ID, charge expression,
lifetime/alias handling, supported-profile condition and adversarial fixture.
Closed function call targets and excluded options must be enforceable, not comments.

Fixed ECMAScript grammar/options and sourceType are pinned before entry. Unknown
mode refuses MODE_OPEN, not an automatic second parse. Target regex/BigInt remain
UNSUPPORTED_BOUNDED_SYNTAX unless independently reviewed bounded syntax alternatives
are implemented. Report legitimate-source refusals as support limitations, not
invalid-JavaScript or graph completeness. No syntax-family subset masquerades as
complete supported grammar. Guard recursion before calls; review helper-stack bound.

Acceptance: occurrence-to-guard inventory independently reviewed; deliberate missing
guard denies adapter admission; synthetic deep/wide/tentative/class/private/template/
binding/error fixtures demonstrate pre-growth refusal. Tool startup and scalar
native-helper replacements must be included. Adapter+inventory+profile hashes bind
exact approved artifacts, not caller-selected values. Parser remains OFF if any
enabled cost/semantic path is uncovered. This package is not granted with P1.

### P3 — Private producer summary and independent replay, synthetic only

Depends on accepted P2 and separately approved controls. Producer holds AST privately
and traverses with bounded frames, not a second catalogue of all nodes. Emit charged
canonical syntax-site summary with UTF16 spans, binding/loader/conditional and OPEN
statuses. Summary size <=16KiB; oversize refuses, never truncates.

Transitions: ANALYZING -> PRODUCER_SUMMARY -> PRODUCER_AST_RETIRED -> VERIFYING ->
VERIFIED. Remove producer AST/traversal aliases before verifier AST construction.
Transfer retired-category reservations to unreclaimedProducerBytes without double
counting or refund; verifier allocations are additional. Dispose replay references
before VERIFIED output. Refusal in any state invalidates result and closes/retires
in finally even after deadline; cleanup may not renew lifetime.

Verifier recomputes source sizes/identity, sites, summary seal and logical transitions
using separately authored rules; producer peak/count/hash is not evidence by itself.
Tampered omissions/duplicates/spans/category shifts/peaks must fail. Shared parser
common-mode remains OPEN even after replay agrees; no formal-proof claim.

### P4 — Authentic source ownership and real receipt lane (implementation only)

Requires separate direct routing; implementation approval is not actual root access.
Use a fresh controlled supervised process, fixed imports and single serial driver.
If v1 creation runs first, driver owns all handles, verifies the full creation scope,
closes/retires in finally, and proves typed post-retirement refusals before v2 entry.
Unknown prior state/failed cleanup denies entry. This proves controlled-driver
exclusion only, not hostile arbitrary v1-importer exclusion or global revocation.

The new v2 owner must independently enforce its **own** sequence, even if the
driver has already retired a predecessor v1 owner: acquire -> independent full-
inventory verification -> creation-body/reference retirement -> metadata-only
ownership -> selected-source allocation. Deny selected-source allocation while
any creation-body Map, Buffer, decoded string, iterator, closure or verification
alias remains live. A historical receipt/public metadata cannot substitute for
this authenticated same-owner transition. Bound verification/metadata output and
account the entire transition peak, including temporary overlap, before growth.
The creation/retirement cost convention requires independent review; no implicit
credit, aggregate reset or immediate-GC claim is authorized by deleting references.
Capture the owner deadline at initial creation and retain it through all transitions,
source analysis and replay without renewal; expiry/error invalidates authority and
finally performs close/retire. Failure to verify or retire yields refusal, not a
partial source owner. Synthetic transition/alias/expiry controls precede release.

Selected-source acquisition then uses the frozen source-store discipline: exact full FD identity
before source allocation, full private Buffer/hash, fatal UTF8 count and one full
private text decode; full backing plus decoded text charge, no body-Map adoption.
Preserve creation/inventory/epoch/full-universe/largest-source selection. Source
Buffer stays retained through replay; no early-release optimization is authorized.
Creation history and current selected-source verification have different freshness
scopes; do not label the whole historical universe freshly revalidated.

Pin real adapter, allocation inventory/cost convention, grammar/package, options,
trusted issuer/verifier and profile. Real descriptor/receipt bind sourceHash,
descriptorHash, receiptHash and all exact file/creation/epoch/ledger fields from
the authentic owner. Synthetic domain labels must be rejected on real issuance.
Old context-bound v1 archive seal replay remains read-only, never migration or live
capability. Bounded real codec plus private issuer need fresh reviewed allocations;
synthetic test success is not authority to reuse its public profile as real.

Public data boundaries retain JSON-text-only rejection before reflection. No source
or AST escaping, bounded refusal codes only, no exception stack/raw-source logs.
Until owner/coordinator/replay/admission all pass synthetic controls, real operations
must refuse. No filesystem expansion/resolver/target import/eval/native/NFT reads.

### P5 — One authentic largest-source attempt, separately authorized later

Only after P1–P4 accepted, fresh named pins checked, actual-source access routed,
remaining aggregate/deadline admitted and complete allocation coverage released.
New Owner routing identifies exact attempt/evidence/stop; no historical permission
or “continue” supplies it. There is no actual run grant now.

Before parser construction, calculate source+tool+control peak and reserve error/
output/replay space; preserve67108864B/20k sites/200k nodes/depth128/120000ms.
Historical source53217937B leaves13890927B for **all** additions. Incremental guards
may refuse below node ceiling; no cap raise, smaller-source substitution or retry.
Supervisor terminates time overruns; no unsafe synchronous recovery claimed.

Accepted bounded syntax receipt requires successful independent private replay.
Otherwise retain a typed CAP_REFUSED / UNSUPPORTED_BOUNDED_SYNTAX /
ALLOCATION_COVERAGE_OPEN / VERIFY_RESOURCE_REFUSED (or exact admitted code), then
STOP. A truthful bounded refusal is safety evidence, not successful parsing.
Neither result closes62 OPEN dependency obligations, whole graph or runtime/math.

## Definition of done and remaining decisions

This plan is done when a reviewer can distinguish each package's code/evidence,
dependencies, scope, exact caps and release authority. No package is marked built
or tested here. Whole graph remains OPEN/fullRuntimeClosure NOT_ACCEPTED;
no mathematical closure or showcase/E2E claim. Resource budget has not reset.

Next decision recommended: **P1 only**, synthetic guard/scanner implementation plus
bounded focused checks, parser still OFF; P2–P5 explicitly deferred. A new cost
convention may be approved for logical accounting, not physical64MiB isolation.
If actual fit ultimately fails, report that result and request a strategic decision;
do not quietly change representation, source-buffer lifetime, cap or research target.
