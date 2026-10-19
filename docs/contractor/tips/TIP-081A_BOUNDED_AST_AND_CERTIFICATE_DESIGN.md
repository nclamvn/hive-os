# TIP-081A — Bounded source consumer and explicit certificate design

2026-10-07 · SAME081D8 · engineering · P0 · revision 2.
Status: DESIGN_REVIEWED_IMPLEMENTATION_NOT_RELEASED; scoped design complete.

## Authority, dependency and exact output

Owner's “tốt hãy triển khai theo đề xuất và đúng kế hoạch” follows the explicit
design-only proposal after REAL_LARGEST_SOURCE_LEASE_INDEPENDENTLY_VERIFIED_GRAPH_OPEN.
It authorizes this specification and read-only design review, not a parser run,
new source acquisition, build, E2E, graph resolution or mathematical campaign.
Dependency: TIP-081A_SOURCE_STORE_REAL_VALIDATION.md and its completion/capture.
The open engineering obligation is safe consumption of one authentic private
source without unaccounted AST growth, plus unambiguous certificate hashes.
Admissible closure now is a reviewed implementable contract and explicit release
criteria. It is NOT evidence that parsing fits, dependencies are complete, or a
mathematical result is established. Stop after design completion.

Aggregate execution upper remains 771254.1296670001/900000 ms;
128745.87033299985 ms remains. No reset or new execution grant. Read-only source
inspection here does not acquire or inspect failed-root payloads.

## Context and observations

Working directory: /Users/os/hiveos. Read the commitment protocol, active charter
and latest handoff before implementation. Preserve all unrelated dirty work.
Frozen references:

- scripts/test/store-tip081-inventory-source.mjs: private metadata/source ownership;
  no public text accessor and only copied byte chunks.
- scripts/test/verify-tip081-inventory-source.mjs: independent current-source proof.
- scripts/test/runtime-tip081-manifest.mjs: historical parser/graph, NOT an API for
  the new owner. In particular readManifestSnapshot copies the entire body Map.
- node_modules/next/dist/compiled/acorn/acorn.js, version 8.14.0; source SHA-256
  3c141146168735659c30b29c925fbf9fdf4d12ad85eb83d68e2afb26a1cc248d;
  package SHA-256 aa6eff9593179bc7379017992eda314ce97bd7c6576869d82d514139ce612cca.

Text-only inspection of that pinned parser establishes specific unsafe boundaries:
startNode/startNodeAt/copyNode allocate Node; parseExprList and parse bodies grow
arrays; enterScope/declareName grow scopes and binding arrays; readString,
readWord1 and readTmplToken slice/concatenate before returning; parseLiteral keeps
raw and BigInt text; readRegexp validates then constructs native RegExp; next
constructs Token before calling onToken. These observations are an allocation
coverage starting list, NOT a complete allocation audit. No parser was imported
or invoked in this design step.

Last real lease charged 53217937 B, including base12895300 B, source13448165 B
and decoded26874472 B. Its 13890927 B headroom is not a parser allowance. The
450-file/171-directory creation universe, 278 JS files and 62 OPEN obligations
remain intact; largest-source refusal may not be disguised by choosing a smaller
file or reporting a subset as the full graph.

## Decisions and rejected shortcuts

1. Keep v1 producer/verifier, tests, all 46 predecessor pins and archives frozen.
   Add new versioned modules only after separate implementation approval.
2. New trusted owner-consumer module must own source and bounded parser together.
   Do not reconstruct text from public chunks, add getText(), pass source to a
   caller callback, export AST, or adopt public metadata as private authority.
3. Stock acorn.parse plus post-parse counts or only node/token callbacks is NOT
   admissible. Select an audited bounded adapter of the pinned grammar, with a
   separately pinned new adapter hash. Its allocation coverage must pass review
   before parsing is enabled. Do not mutate installed Acorn or its frozen API.
4. Maintain the 64 MiB logical working-set ceiling, 20k catalogue/site ceiling,
   historical 200k node ceiling and 120s lifetime. A limit is an upper bound, not
   a claim every input can fit. Unsupported/unbounded paths refuse before growth.
5. No streaming/token-only summary may silently substitute for complete syntax
   analysis. Such a different representation needs explicit semantic review.
6. Do not release the source Buffer early merely to make AST fit. That optimization
   changes ownership/replay accounting and is parked, not part of this design.

## B1 — Certificate wire v2 (data, never authority)

New receipts have exact own-data schema, version2, a unique purpose
TIP081_BOUNDED_SOURCE_CONSUMER_RECEIPT, and explicit sourceHash and receiptHash.
sourceHash is SHA-256 of exact source bytes; receiptHash is SHA-256 of the
canonical receipt with ONLY receiptHash omitted. Version and purpose participate
in the seal. Lowercase 64-hex only; no digest alias, unknown fields, getters,
proxies, unsafe integers, duplicate JSON keys or unbounded nested data.
New descriptor has separate sourceHash and descriptorHash with the same explicit
seal rule. Refusal records use a different purpose and cannot satisfy acceptance.

Required binding fields: store/inventory/snapshot/creationReceipt hashes, epoch,
profile, mode, source path/root role, full file identity, bytes/UTF16 units,
descriptorHash, parser and adapter pins, fixed grammar/options/profileHash,
allocationAuditHash, allocation convention version, peak ledger/counters,
analysisHash, scope and invariant statuses. Completion statuses explicitly retain
fullRuntimeClosure=NOT_ACCEPTED, execution=false and materialization=false.
Receipt scope is ONE_AUTHENTIC_SOURCE_BOUNDED_SYNTAX_ANALYSIS, never whole graph.
Existing store/creation v1 hash names are labeled bindings, not reinterpreted seals.

Canonicalization must be bounded BEFORE cloning/serializing: exact schemas,
precomputed encoded sizes, charged scratch and streaming hash or reserved bounded
serialization. Descriptor/receipt each <=16384 encoded bytes. Oversized summaries
are refused, not truncated. Do not insert an unbounded analysis into the receipt.

Archive compatibility is read-only and version-dispatched. For the existing v1
source-verifier receipt, digest is the receipt seal while descriptor.digest is
the source hash. Only after independently verifying descriptor seal and all
epoch/path/identity/accounting bindings, reconstruct the historical seal input
as {...receipt,digest:descriptor.digest}. Label it CONTEXT_BOUND_V1. Do not reseal,
rewrite or accept it as v2/live owner authority. An unbound v1 receipt refuses.
No migration of durable artifacts, database or existing APIs is authorized here.

## B2 — Ownership and lifetime

Future new module exposes create, open, analyze, bounded summary, close and retire
operations with exact arity, opaque same-instance brands and no caller plugins.
The parser entry is lexical/private, not an exported callback accepting text.
Acquisition/whole-creation verification completes before the selected source;
the historical full-body authority is not retained. A shared trusted coordinator
must prevent concurrent v1 and v2 stores, leases or parsers: per-module independent
busy flags are insufficient. Until cross-version exclusion is implemented and
tested, v2 consumption refuses. Do not change frozen v1 just to add the coordinator;
the controlled driver must prove v1 retirement and own exclusive v2 entry.
Hostile arbitrary importers of v1 are outside this trusted-driver claim.

States: CREATING -> METADATA -> SOURCE -> ANALYZING -> ANALYZED -> SOURCE_CLOSED
-> RETIRED. ANALYZING excludes all other consumers. Any failure invalidates partial
analysis; finally closes source and retires owner. Cleanup must work after expiry,
without renewal. No source/AST/list/closure alias escapes; immutable bounded output
is separately charged. Metadata read views are data, not parser capabilities.
Public archive replay can establish archived evidence only, never live authority.

Detailed replay transitions replace the abbreviated ANALYZED transition above:
ANALYZING -> PRODUCER_SUMMARY -> PRODUCER_AST_RETIRED -> VERIFYING -> VERIFIED
-> SOURCE_CLOSED -> RETIRED. During PRODUCER_SUMMARY, AST and charged immutable
summary coexist. AST_RETIRED deletes all AST/traversal references and invalidates
their internal authority. For this first version its allocation charge is NOT
reclaimed: verifier replay must fit on top of the conservatively retained producer
charge. This avoids treating reference disposal as forced garbage collection.
VERIFYING retains only source bytes/text, metadata, summary, tool state and replay
state, plus the unreclaimed ledger reservation. VERIFIED retains bounded evidence
only after replay references are disposed. The owner alone cleans every state;
any refusal closes/retire in finally and returns no partial accepted receipt.

Concrete private seam: one new source-consumer module owns both WeakMap state and
lexical producer/replay routines. The replay routine is independently authored and
reviewed, but has NO public export, caller-supplied function, registration hook or
text-taking API. Public verify(owner,lease) authenticates exact same-instance brands
and VERIFYING transition; its lexical routine reads the authentic private state.
Separate algorithms must not call producer extraction/ledger helpers. Shared
ownership infrastructure is declared common-mode, not independent authority proof.
This avoids exposing source through a callback while permitting independent logic.

Controlled-driver exclusion evidence: start a fresh supervised process with no
pre-existing owner, fixed pinned imports and a single serial dispatch. If it uses
v1 first, retain its owned handles, call close and retire in finally, and record
typed post-retirement authority refusals before entering v2. Any failed cleanup or
unknown prior owner state denies v2 entry. No concurrent tasks/importers are allowed
by that driver. This proves only its own process protocol, not global exclusion
against hostile arbitrary v1 calls; such a stronger claim would require changing
the frozen authority architecture and a new Owner routing decision.

## B3 — Charge before allocation, not after parse

Peak logical ledger L = existing exact source reservation + tool/control reserve
+ parser state + AST objects/properties + list backing capacity + derived strings
+ traversal/bindings + bounded output + verifier/scratch overlap. Every additional
term is separate; existing base cannot be reused for unrelated parser allocations.
Charge <=67108864 B before construction, property/list growth, concatenation,
slice/copy, canonicalization, traversal or verifier allocation. Safe integer
arithmetic and subtraction-before-addition checks prevent overflow. Refuse BEFORE
the mutating operation; never salvage a partial syntax result as complete.

Adapter release prerequisite is a complete static allocation inventory for the
pinned grammar and all enabled options. Each row identifies source site, maximum
logical charge, pre-allocation guard, lifetime, alias handling and adversarial
fixture. The initial list above is insufficient. Every uncovered site is
ALLOCATION_COVERAGE_OPEN and the adapter stays disabled.

Required accounting rules:

- Define documented logical byte costs for each object/property/array capacity,
  not measured V8 object size. Charge backing-array capacity including resize
  old/new overlap; charge temporary copies and copied node properties.
- Pre-reserve UTF16-derived text at 2 bytes/unit, including old/new concatenation
  overlap and raw/cooked/escaped forms. Shared slices conservatively charge their
  represented payload and possible retained parents. Do not assume interning.
- Scopes, label/context/private-name stacks, binding tables, errors and recursive
  control frames are counted; grammar recursion, traversal and metadata depth each
  have maximum128, profile-bound, guarded before entry into level129.
- Pin options: no caller program, callbacks, plugins, locations, ranges,
  directSourceFile or sourceFile. Fixed grammar/options must match verifier.
  Unknown script/module mode is OPEN, not an automatic second parse.
- Native RegExp construction and BigInt conversion from target literals are
  disallowed until a reviewed bounded alternative preserves syntax semantics.
  Refusal is UNSUPPORTED_BOUNDED_SYNTAX, not invalid-JavaScript proof.
- Account trusted tool loading/initialization before source overlap; retained tool
  state still counts during analysis. Source hash pinning is not an allocator bound.
- Retain parser allocations conservatively until stage retirement; do not reclaim
  charge on mere loss of a local reference when aliases remain. No forced-GC claim.
- No all-nodes array plus AST plus second traversal catalogue. Traverse privately
  with explicitly reserved frames; every scope/site/dedup/output table is charged.
- Node<=200000 and catalogue+sites<=20000 are simultaneous additional caps, not
  substitutes for bytes. Check clock at bounded character/operation intervals;
  controlled supervisor deadline is necessary for synchronous uninterruptible work.

Physical RSS, JavaScript heap behavior, native allocator overhead and immediate GC
are NOT certified by this logical ledger. Do not market it as an OS memory sandbox.
If physical 64 MiB is required, obtain a new isolation design/Owner decision.

## B4 — Independent verification and graph boundary

Verifier must independently authenticate owner/lease and source identity/hash,
recompute sizes/ledger with its own literal rules, validate exact v2 schema/seals
and profile pins, and reconstruct syntax-site coverage from the same authentic
private source. It cannot trust producer peak counters, analysisHash or omitted
site lists. A new trusted verifier seam must not expose text to an arbitrary
callback. Budget its replay, output and any retained producer result explicitly;
no simultaneous second full AST. Retire producer AST before verifier reparse,
retaining only a charged bounded canonical site summary. If replay cannot fit,
return VERIFY_RESOURCE_REFUSED and do not issue accepted certificate.

Separate implementation and traversal/ledger code is required. Reusing a pinned
grammar can check producer/traversal inconsistencies but is NOT independent grammar
correctness or a formal proof. Maintain a declared common-mode parser risk. Before
closing semantic dependency completeness, require separately implemented relevant
syntax coverage or reviewed equivalence evidence; until then SEMANTIC_COVERAGE_OPEN.
Source-verifier hash/DFA alone does not verify AST or extraction completeness.

Bounded summary: source identity, parse mode, node count, syntax sites (start/end in
UTF16 units), loader/binding/conditional status, and explicit unresolved items.
Unsupported syntax, unknown calls, dynamic specifiers, eval/Function, computed
loaders, source mode, optional calls, import attributes and filesystem/native
operations remain OPEN. Parse success is not runtime dependency closure.
No resolver, filesystem expansion, target eval/import, native load or NFT traversal.
Exactly62 predecessor OPEN obligations remain; no closing or suppression in this
stage. A future graph consumer must bind every source result to the full universe
and preserve all unresolved entries; that consumer is not implemented here.

## B5 — Required future adversarial controls (UNRUN)

| Control group | Required outcome before release |
| --- | --- |
| Hash schemas | Separate source/receipt hashes; swapped hashes, wrong purpose/version, unknown fields and unbound v1 fail; original v1 archive unchanged |
| Authority | Forged/foreign/expired/retired brands and cross-version overlap fail; no source/AST callback or chunk-reassembly shortcut |
| Memory | Byte cap exact boundary and +1; node/site/depth +1; array resize, raw/cooked strings and traversal overlap refuse BEFORE allocation |
| Grammar | Escaped identifiers, templates, regex, BigInt, classes/private fields, deeply nested syntax, wide call lists; unsupported paths refuse honestly |
| Allocation audit | Every enabled allocation site maps to guard/fixture; a deliberately removed guard disables adapter admission |
| Replay | Producer omissions/duplicates/spans/ledger tampering rejected; common grammar risk explicit; no second live AST |
| Cleanup | Error/time/resource/pin drift invalidates result; close/retire after deadline; stale handles refuse; no retry/reset |
| Scope | Full-union/largest-source selection unchanged; no smaller substitution, graph closure, resolver, eval, .env or protected reads |

Synthetic tests do not license an actual fixed-root parse. Retain first failures
and final changes, hashes and review; do not keep retesting unchanged ancestors.

## B6 — Implementation routing and stop criteria

Suggested next route, NOT granted: implement explicit v2 certificate codec and
private-consumer admission/coordinator using synthetic fixtures ONLY, keeping the
parser disabled. Include bounded schema/hash/ownership/refusal tests and an exact
allocation-inventory deliverable. This isolates tractable work from an unproven
full parser and preserves the remaining budget. Builder must report measured
checks and stop at completed codec/admission, with AST NOT_IMPLEMENTED/UNRUN.
That first inventory covers codec/admission allocations only, plus the known
parser-site precursor list; it does NOT require or certify a complete grammar
audit. Full adapter allocation coverage is a separate subsequent deliverable.

A later bounded-parser implementation needs reviewed complete allocation coverage,
cost constants/grammar profile and synthetic byte-boundary/replay controls before
any actual parse proposal. Real largest-source run needs direct Owner routing,
fresh pins, remaining aggregate/deadline admission and one-attempt stopping rules.
No cap raise, automatic retry, new TIP family, build/server/browser/DB/API/model/
Git/billing/deploy/math/publication is implied by this document.

## Design acceptance and report

B1 explicit hash schema/history; B2 private ownership/lifetime; B3 before-growth
accounting/refusal; B4 independent replay/semantic limits; B5 future control matrix;
B6 authority/stop. For each: Given the current frozen evidence, when a Builder reads
this contract, then allowed operations, acceptance evidence and refusal conditions
must be unambiguous and not claim a parser exists. Independent read-only review
checks contradictions, missing allocation/overlap and false authority. Document
coverage6/6 is NOT code/test coverage. Completion records reviewer findings, fixes,
UNRUN technical checks, unchanged runtime/math status and exact next routing.

## Appendix A — Exact v2 codec contract for the next synthetic route

All fields listed below are REQUIRED; no optional fields or extensions in v2.
H = lowercase64hex SHA-256; U = nonnegative safe integer, excluding -0;
S(k) = string <=k UTF16 units; path strings additionally obey existing inventoryPath
policy. Object prototypes must be plain, data descriptors only; dense arrays only;
no symbols, holes, getters, proxies or cycles. Maximum nesting128, fields per
object64, total visited values4096 and serialized bytes16384 per wire object.
Reject duplicate JSON keys before accepting decoded data. JSON.parse alone cannot
enforce this condition. Preserve byte-exact historical v1 dispatch separately.

Canonical encoding is UTF8 JSON, no whitespace/BOM/newline, no Unicode normalization.
Object keys sort by UTF16 code-unit lexicographic order (not locale); arrays keep
order. Strings use JSON.stringify string escaping; integers use shortest decimal
JSON spelling. No floating numeric values in v2: file times use canonical strings
String(original finite nonnegative timestamp), <=32 units, verified against the
authentic identity's same spelling. They are never rounded/replaced by integer
timestamps. Hash input is exactly this canonical body, without its one named seal
field; sourceHash is NEVER removed or overwritten. Hash counting/encoding scratch
must be admitted before output. Overlarge/malformed data refuses, no truncation.

Common binding object B has exact fields:

- storeHash:H, inventoryHash:H, snapshotHash:H, creationReceiptHash:H;
- epoch:{kind:S(64),id:S(128),hash:H}, values bound to authenticated v1 epoch;
- profile:{runtime:'node',mode:'production',nodeVersion:S(32),platform:S(32),
  arch:S(32),distDir:S(2048)}, exact match with creation profile;
- mode:'SYNTHETIC' or 'FAILED_BUILD4_FEASIBILITY'; path:S(2048),
  source:'project' or 'dependency', sourcePath:S(2048);
- identity:{device:U,inode:U,mode:U,nlink:1,size:U,uid:U,mtimeMs:S(32),
  ctimeMs:S(32),type:'file'}; sourceBytes:U,utf16Units:U,decodedBytes:U,
  sourceHash:H. identity.size=sourceBytes; decodedBytes=2*utf16Units.

Descriptor exact top-level:
{version:2,purpose:'TIP081_BOUNDED_SOURCE_DESCRIPTOR',binding:B,
ownership:'PRIVATE_SINGLE_SOURCE',descriptorHash:H}.
Its hash seals all fields except descriptorHash, no parser claim.

Parser profile P has exact fields:
{grammarVersion:'8.14.0',grammarHash:H,grammarPackageHash:H,adapterHash:H,
allocationAuditHash:H,conventionVersion:1,sourceType:'script' or 'module',
locations:false,ranges:false,callbacks:false,callerProgram:false,plugins:false,
nativeRegex:false,nativeBigInt:false,depthLimit:128,nodeLimit:200000,
entryLimit:20000,byteLimit:67108864,milliseconds:120000}.
H fields must match approved pinned artifacts, not caller-selected hashes.
profileHash seals this exact P using the canonical rule; it is a receipt field,
not added back into P. Synthetic profile uses byteLimit1048576 and entryLimit128;
receipt mode must determine these two values, no caller cap change.

Ledger Q exact fields (each U):
{baseBytes,sourceBufferBytes,decodedBytes,toolBytes,parserBytes,astBytes,listBytes,
derivedStringBytes,traversalBytes,outputBytes,replayBytes,scratchBytes,
unreclaimedProducerBytes,peakBytes,limit,nodeCount,siteCount,maxDepth}.
Each category has disjoint live charge; unreclaimedProducerBytes contains only
already-retired producer categories, removed from their corresponding live
categories, not double-counted there. peakBytes is max sum over transitions,
not the sum of category-wise historical maxima. Authenticated verifier recomputes
it from bounded admitted transition counters; producer's Q is not trusted proof.
Full allocation cost constants and audit required later; the synthetic codec
validates structure/arithmetic/bindings only, NOT allocation enforcement.

Accepted receipt exact top-level:
{version:2,purpose:'TIP081_BOUNDED_SOURCE_CONSUMER_RECEIPT',binding:B,
descriptorHash:H,parserProfile:P,profileHash:H,ledger:Q,analysisHash:H,
scope:'ONE_AUTHENTIC_SOURCE_BOUNDED_SYNTAX_ANALYSIS',
verification:'INDEPENDENT_SOURCE_AND_SYNTAX_REPLAY',
semanticCoverage:'OPEN_COMMON_GRAMMAR_RISK',graphStatus:'ACQUIRED_GRAPH_UNRUN',
fullRuntimeClosure:'NOT_ACCEPTED',execution:false,materialization:false,
receiptHash:H}.
Its hash seals all fields except receiptHash. sourceHash resides unambiguously in B.
Codec synthetically round-tripping this purpose never issues a LIVE acceptance.
Runtime issuance is disabled until reviewed implementation/admission exists.

Refusal exact top-level:
{version:2,purpose:'TIP081_BOUNDED_SOURCE_CONSUMER_REFUSAL',stage:S(64),code:S(64),
bindingHash:null or H,profileHash:null or H,limit:U,requestedBytes:null or U,
graphStatus:'ACQUIRED_GRAPH_UNRUN',fullRuntimeClosure:'NOT_ACCEPTED',
execution:false,materialization:false,refusalHash:H}.
Allowed stage: ADMISSION, SOURCE, PARSER, PRODUCER_SUMMARY, REPLAY or CLEANUP.
Allowed code: AUTHORITY_REFUSED, BUSY_REFUSED, SCHEMA_REFUSED, HASH_REFUSED,
PIN_REFUSED, MODE_OPEN, ALLOCATION_COVERAGE_OPEN, CAP_REFUSED, DEPTH_REFUSED,
NODE_REFUSED, ENTRY_REFUSED, TIME_REFUSED, UNSUPPORTED_BOUNDED_SYNTAX,
VERIFY_RESOURCE_REFUSED, REPLAY_MISMATCH or CLEANUP_REFUSED.
RefusalHash seals all fields except refusalHash. No raw source, exception stack or
unbounded exception text. Unsupported code maps to SCHEMA_REFUSED, not success.

## Completion checkpoint

Independent revision2 read-only review CLEAR for all five revision1 findings;
B1–B6 reader coverage6/6, document-level only. See verification review history and
completion report. No product implementation or executable check in this route.
Parser/AST/traversal/resolution remain NOT_IMPLEMENTED/UNRUN in the new lane;
caller whole graph OPEN, full runtime NOT_ACCEPTED, predecessor62OPEN unchanged.
STOP. Next synthetic codec/admission proposal remains NOT GRANTED.
