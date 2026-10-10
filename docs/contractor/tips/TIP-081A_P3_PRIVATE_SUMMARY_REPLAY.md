# TIP-081A P3 — Private syntax summary and independent replay

2026-10-08 · SAME081D8 engineering · P0 · revision2 (pre-approval review fixes).
**DRAFT_CONTROLS_FOR_OWNER_APPROVAL — no implementation/execution release.**
Owner “P3 kế tiếp” requests the next package after accepted P2. This document
specifies that package; it does not treat the request as approval of unspecified
controls, a new resource ceiling, source ownership or a scientific campaign.

## Dependency, exact obligation and admissible closure

Accepted predecessor: docs/verification/TIP-081A_P2_GRAMMAR_COMPLETION.md,
W1–W6 scoped6/6,109 synthetic controls. All accepted P2 code, tuple, profile,
inventory, tests, source cuts and failure history stay frozen. Current plan:
TIP-081A_REAL_CONSUMER_IMPLEMENTATION_PLAN.md, P3, and the reviewed B2–B4 contract
in TIP-081A_BOUNDED_AST_AND_CERTIFICATE_DESIGN.md. Later appended checkpoints
supersede the old plans' historical budget/progress statements, not their limits.

ONE proposed milestone: **P3_SYNTHETIC_PRIVATE_SUMMARY_REPLAY**.
Implement actual bounded extraction from a privately held complete supported AST,
retire producer aliases, independently reconstruct and verify the result from the
same privately owned synthetic source, and emit bounded metadata only. A hash
comparison, scalar-only mock, public AST wrapper or reused producer extraction
cannot discharge this obligation. No mathematical milestone is authorized.

Closure requires complete new source/allocation/semantic review, actual literal
positive controls and adversarial controls P301–P336, independently authored
replay rules, raw first/final evidence, named preservation and explicit limits.
Document completeness or tests alone cannot prove semantic dependency completeness.

## Architecture and implementation decisions

1. Create a separately versioned P3 private owner/derivative and trusted admission
   lane. Reuse reviewed P2 grammar SOURCE/premises only through an explicit new
   derivation/pin/review. Do not patch P2 or bypass its four-API privacy boundary
   to get an AST: its public result is deliberately insufficient for P3.
2. Producer and verifier remain lexical/private inside the same trusted owner.
   No getText/getAST, caller parser/callback/registration hook, arbitrary path,
   module URL, caller-selected hash/profile or public flags as authority.
3. Different Builders author producer extraction and verifier extraction/ledger
   rules. Verifier must not call producer traversal, classification,
   canonicalization or ledger helpers. Captured standard primitives and the
   shared grammar/ownership layer are explicit common-mode dependencies.
4. Full supported syntax is parsed before extraction. Traverse with admitted
   bounded frames, not an all-nodes catalogue. Charge scope/site/dedup/output
   tables and derived values BEFORE creation/growth. Unknown node/operation or
   coverage hole refuses; no reduced language relabelled as full P3.
5. Before Builder product code, Main must freeze the exact new public arities,
   wire/schema, site taxonomy, ordering,
   field/depth limits and cost/lifetime rows in the implementation proposal
   and record their independent source/design review. These are not already
   approved/frozen because the eight requirement groups are outlined. Ordinary
   within-contract details can be settled by Main after Owner routing; a material
   contract ambiguity returns to Main and,
   for security/schema/scope departures, Owner. No guessed authority seam.

## Required lifecycle and accounting

SOURCE_READY -> ANALYZING -> PRODUCER_SUMMARY -> PRODUCER_AST_RETIRED
-> VERIFYING -> VERIFIED -> RETIRED.

BEFORE first producer parser construction, calculate and reserve itemized fixed
error/output space and the permitted replay/scratch overlap. This reservation
must fit alongside source/tool/control/producer work within the same64MiB, not
hope that freeing AST will make replay fit. The cost/lifetime inventory defines
each reserved category and its guarded consumption/transfer. Consuming escrow
reclassifies an already charged amount into its actual live category exactly
once; it cannot charge both copies, refund producer work or reset peak history.
Keep unused reservation charged until owned retirement. Unknown required costs
keep admission OFF; no anonymous whole-function allowance or guaranteed-fit claim.

At PRODUCER_SUMMARY the charged immutable summary may coexist with producer AST.
Before VERIFYING remove parser/AST references, traversal frames, scope tables,
retained closures and any other producer aliases that can retain the tree.
Do not claim forced GC. Move only retired producer categories into
unreclaimedProducerBytes; remove them from their corresponding live categories
exactly once, with NO refund and NO double counting. Source/tool/summary remain
live and are not falsely relabelled retired. Replay allocations are additional;
never reset byte/node/entry/work counters or create a fresh deadline for replay.

Verifier independently reconstructs relevant syntax sites, binding/loader/
conditional classifications, unresolved statuses, node counts, source identity,
canonical summary seal and transition/peak arithmetic using literal rules.
Producer totals/hash/phase assertions are not the verification evidence.
Retire replay AST/traversal aliases before VERIFIED metadata is emitted.
Any refusal invalidates the result and disposes all owned state in finally,
including after expiry. Pre-auth refusal must not revoke another live owner.

## Summary/data contract to pin before code release

- Exact bounded JSON TEXT, unique SYNTHETIC purpose/version, mode/profile pins,
  synthetic text identity, node-count definition, canonically ordered syntax-site
  records with UTF16 start/end and binding/loader/conditional/OPEN statuses,
  bounded unresolved records and one explicit summaryHash seal rule.
- Encoded summary ceiling **16384 UTF8 bytes**. Preflight and reserve before
  cloning/encoding/serialization. Exact boundary allowed; +1 refuses, never
  truncates or publishes an accepted prefix. Duplicate keys, extra fields,
  unsafe integers, out-of-source spans and altered ordering refuse.
- Input decoding is also an allocation boundary: bound encoded size, nesting,
  record fields/array length/visited values and reserve duplicate-key detection,
  decode/materialization, canonical seal scratch and native hash buffers/state
  BEFORE JSON.parse/clone/encode/hash work. Use captured primitives/no reviver;
  no producer canonicalization helper in the verifier. A post-parse cap alone is
  inadmissible. Exact concrete limits/cost rows belong in the pre-code freeze.
- Define synthetic identity over the EXACT UTF16 code-unit sequence, including
  lone surrogates; no implicit Unicode normalization or replacement collision.
  Name it separately from an authentic UTF8 file sourceHash. No synthetic byte
  count, identity or hash may masquerade as a filesystem/receipt binding.
- Raw source, ASTs, raw identifier/specifier excerpts, callbacks and native error
  stacks must not leave the owner. Bounded site spans/enums/hashes are data,
  never owner capabilities. JSON decoding must not reflect caller objects.
- Site/extraction rules must address static import/export, dynamic import,
  potentially relevant call/new/member/computed/optional forms, shadowing/binding
  ambiguity and control-flow uncertainty. Define complete coverage for the pinned
  taxonomy; no first-N selection. Unknown/eval/Function/filesystem/native/dynamic
  resolution remains OPEN. Do not resolve/import/evaluate any target.
- Output retains semanticCoverage=OPEN_COMMON_GRAMMAR_RISK, graphStatus=OPEN,
  fullRuntimeClosure=NOT_ACCEPTED, execution=false, materialization=false.
  P3 summaries do NOT issue the real v2 receipt or alter that frozen codec.

## R1–R8 / proposed exact controls (36, all UNRUN)

| Requirement | IDs | Required independent literal/adversarial evidence |
| --- | --- | --- |
| R1 private authority | P301–P304 | Valid opaque same-owner sequence; foreign/forged object rejected without getters/coercion; retired/expired handle rejected; callback/parser/options substitution rejected |
| R2 canonical complete summary | P305–P308 | Independent literal import/export/site/spans; dynamic/shadowed/conditional statuses stay OPEN where required; UTF16 Unicode/lone-surrogate identity does not collide; duplicate/extra/noncanonical wire rejected |
| R3 retirement/ledger transition | P309–P313 | Full successful transition; premature verifier denied before second AST; retained producer alias prevents verification; retirement transfers charge exactly once/no refund; replay references gone before VERIFIED and stale authority refused |
| R4 independently authored replay | P314–P318 | Omitted site, duplicate site, shifted span, changed binding/loader/conditional status and substituted source/mode/count/seal each fail despite superficially valid metadata |
| R5 before-growth resource bounds | P319–P323 | Summary16384/+1; total logical cap/exact-minus-one; discriminating traversal-depth limit/+1; combined cumulative entry/site cap; altered retirement/peak/category arithmetic rejected |
| R6 original deadline and cleanup | P324–P327 | Observation cannot renew; verifier cannot restart deadline; captured clock unaffected by later host replacement; time/error/resource refusal cleans all owned stages and never salvages partial verification |
| R7 fixed artifact/domain admission | P328–P332 | Only exact new tuple admitted; actual guard-removal copy denied before import; profile/pin/metadata flags cannot self-admit; P2/real-receipt domain confusion rejected; old OFF/UNRUN capture flags are not authority |
| R8 scope, output and stopping | P333–P336 | JSON-only bounded metadata/no source or AST escape; explicit common-mode/62OPEN limits preserved; unsupported mode/native branches refuse without automatic second parse; oversized/failed analysis yields no accepted partial result/retry |

Literal expected sites/UTF16 spans and semantic flags must be authored independently
of producer output, not learned from its first result. Separate resource axes:
if a conjunctive bound masks a proposed depth/node/site fixture, record that
truthfully and design a source-justified discriminator; do not accept any refusal
as the originally claimed boundary. Each multi-mutation control records every
named variation, not one representative with blanket coverage claims.

P2 109 controls are historical dependency evidence, not automatically rerun or
counted as36 new replay controls. They do not prove any R1–R8 implementation here.

## Proposed work order / acceptance gate

A. Main freezes approved controls/schema decisions and the concrete P3 TIP route.
B. Producer/lifecycle Builder and independent replay Builder author new source;
   independent non-own reviewers inspect allocation sites, lifetimes, semantics,
   before-operation guards, alias retirement, ledger arithmetic and fixtures.
C. Main captures COMPLETE first source text/pins before effects, avoiding P2's
   unavailable full first-failed generator cut. Trusted offline derivation only
   after transformation review; generated adapter/manifest reviewed before import.
D. Main issues fixed new SYNTHETIC tuple only after coverage CLEAR; one supervised
   focused syntax/lint/harness-type/unit batch, exact new config envDir:false,
   setupFiles:[], explicit new tests, no application/old-suite globs.
E. Independent postreview, named predecessor/current preservation, resource ledger
   and Main Completion Report. READY requires8/8 implemented/reviewed obligations
   and all36 named controls/variations actually passing; otherwise PARTIAL with
   exact uncovered obligations, refusal/failure evidence and STOP.

Builder/reviewers execute ZERO generators/imports/parsers/hashes/tests. Main owns
all measured effects. All executed source versions and first failures are retained.
No automatic reruns; a corrected effect requires concrete diagnosis, source review,
new Main reservation inside the already approved ceiling, or a human revision.

## Resource proposal — no reset / no expanded grant

Latest accepted aggregate **867323.494582/900000ms**; remaining32676.505418ms.
These are inherited measured-effect upper bounds, not wall-clock coding time.
Propose a P3 incremental reservation **<=25000ms**, INCLUDING derivation, complete
source/artifact capture, hash/preservation helpers, focused checks and1000ms
conservative allowance for EVERY effect wrapper/child. Preserve at least
7676.505418ms of the existing remainder for reporting/refusal handling.

Before any command, reserve its concrete hard timeouts, output/heap caps and all
allowances so their sum fits the current incremental/aggregate remainder. Unit
batch hard timeout<=8000ms; other command timeouts sized inside the25000ms total.
If complete generation/review/checks cannot fit, do not run partially with a fake
completion label: report the remaining work and request an explicit resource
decision. No additional CPU/API budget is inferred from “P3 kế tiếp”.

Per-owner logical ceilings remain67108864B,200000 attempted nodes,20000 cumulative
internal entries and bounded syntax sites/catalogue, structural/private-frame
depth128, originalTTL<=120000ms. Producer+unreclaimed charges+replay coexist within
the SAME ceiling. Old source53217937B/13890927B headroom is not a P3 allowance.
Physical/native/JIT/RSS/GC costs remain uncertified; common grammar risk stays OPEN.

## Boundaries / approval / stop

Working directory /Users/os/hiveos; preserve unrelated dirty work. All pre-P3 code,
installed Acorn and P2 pins remain frozen; no import/invocation of installed parser.
No protected attempt5/grant/failed-root reads or stats, .env reads, actual-source
acquisition/resolution, NFT/native-tree scans, target eval/import, server/browser/
build/E2E/DB/providerAPI/billing/deploy/Git mutation/math/publication. No P4/P5.
No historical real source lease or synthetic profile adopted as current authority.
Earlier62OPEN/callergraphOPEN/fullRuntimeClosureNOT_ACCEPTED remain unchanged.

Owner decision requested: approve **R1–R8/P301–P336, synthetic-only source
implementation and the <=25000ms Main-owned incremental check envelope**, with
review-before-execution and the unchanged900000ms aggregate. Until direct approval,
this stays a planning document; code/checks/admission are NOT RELEASED.

STOP after scoped P3 acceptance or exact coverage/resource refusal. New stage,
schema/security departure, resource reset or real-source operation requires direct
human routing. This draft is not permission for an experiment or theorem claim.

## Independent planning review checkpoint

Back completed the initial draft/predecessor review, identified two safeguards,
then reread the repaired sections, pre-code freeze and revised checkpoint.
Result: **PLAN_READY_FOR_OWNER_REVIEW**, with no remaining concrete planning
blocker. Review history: docs/verification/TIP-081A_P3_PLANNING_REVIEW.md.

This is not P3 acceptance, Owner approval, a resource reservation or an executable
grant. Implementation remains0/8 and all36controlsUNRUN.
