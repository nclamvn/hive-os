# TIP-076A — Generic research core Builder completion

2026-10-05. Root RESEARCH_CORE_V3_076, ENGINEERING_BUILD.
STATUS: DONE_PURE_CORE / INDEPENDENT_REVIEW_PENDING / INTEGRATION_OPEN.
Owner approved the complete TIP-076 blueprint; this report covers its first
bounded pure TypeScript prerequisite only, not whole-package acceptance.

## Delivered scope

Created only the NEW `src/modules/research-sandbox/research-core-v3/` sources,
NEW `tests/unit/research-core-v3.test.ts`, and this report. No legacy source,
schema, migration, environment, UI, dependencies, registry37, historical source
pins or p139 evidence were edited/accessed by this Builder. No DB, browser,
model/API, mathematical campaign, reseal, Git write, deploy or billing operation.
Temporary isolated typecheck config is `/private/tmp/hiveos-core-v3.tsconfig.json`.

Vibecode Kit supplied Builder/Contractor separation, explicit scope/results and
pending independent acceptance. Read AGENTS, research protocol/active latest
activation and handoff completion, approved blueprint/TIP-076A, full Vibecode
skill/report/QA references and bundled Next docs index. Pure TS has no UI work.

## Files created and purpose

| File under research-core-v3 | Purpose |
| --- | --- |
| types.ts | Generic contract, domain, evidence, transport and refusal types |
| bounded-json.ts | Bounded intake, plain-data/cycle/getter/proxy refusal, duplicate-key/depth guard |
| check-budget.ts | Cooperative operation/deadline/intermediate arithmetic accounting |
| contract.ts | Exact domain definition/ordered-quantifier/assumption/predicate alignment |
| registry.ts | Frozen generic static resolution, capabilities/limits/schema projection |
| domains/installed-adapters.ts | Reviewed domain-owned extension catalog, separated from resolver |
| domains/integer-witness.ts | Positive integer linear witness and independent finite-box exhaustion |
| domains/finite-graph.ts | Full sealed input coloring and odd-cycle certificates |
| domains/polynomial-identity.ts | Independent exact rational convolution/coefficient comparison |
| verification.ts | Original candidate retention, host-scoped receipt minting and closure ceiling |
| provider-boundary.ts | Public solver/reviewer requests, transport/accounting and pre-admission retention |
| index.ts | Public exports consumed by subsequent worker integration |

12 new source files plus one unit test and one report. The generic registry
resolver does not change for fourth-domain transfer; only its domain-owned
installed-adapters catalog and a new reviewed adapter module may change.

## Requirement and scenario coverage

The child TIP does not number its required behavior; the following local IDs
make its six output groups and acceptance scenarios auditable.

| Local ID / parent requirement | Delivered and actual test evidence | Status |
| --- | --- | --- |
| A-CORE-1 / R1 prerequisite | Version3 generic contract, domain-owned ordered semantics, sealed preparation and durable reconstruction | PASS pure core; actual worker OPEN |
| A-CORE-2 / R2 | Three exact domains, valid/invalid witness, complete finite refutation, full graph validation/coverage, independent rational expansion | PASS finite controls |
| A-CORE-3 / R4 | Predicate/quantifier/definition/assumption/acceptance mismatch; universal/formal/interval capability refusals; no global/novelty/external claims | PASS |
| A-CORE-4 / R14 prerequisite | Static unknown-version refusal, getters/proxies/cycles/nonplain/sparse/key/schema refusal; exact candidate/input/source binding | PASS pure core; old-fixture regression not run here |
| A-CORE-5 / R8 prerequisite | Input/candidate bytes and dimensions bounded; exact integer bits; polynomial operation/deadline/preallocation ceilings; reservation before checker effects | PASS cooperative controls; durable TOTAL OPEN |
| A-CORE-6 / R1,R11 prerequisite | Same generic public solver/reviewer provider path, host receipt separation, original malformed bounded output retention, unknown usage remains null | PASS controlled in-memory transport; live/worker NOT_RUN |

6/6 local output groups have pure-core finite evidence, not 6/6 complete parent
requirements. R3 fourth transfer/frozen integrated manifest, R5–R9 durable campaign,
R10 evaluator, R12a support, R13 UI and whole actual-worker/browser acceptance are
outside this child ownership. R12b real independent users remains NOT_RUN.

Named controls in the test file include: static adapter enumeration/version,
immutable canonical preparation, restart preparation, mutable-input isolation,
getter/proxy/cycle/class/sparse refusal, byte/depth/duplicate escaped-key admission,
unsafe numeric input, strict schema, exact definition/quantifier/assumption/predicate
alignment, absent checker/formal capability, mandatory exclusions, duplicate
obligations, copied host capability/candidate/receipt refusal, original candidate
bytes, source-map authority, exact input/attempt binding, pre-check reservation,
deadline overrun, fresh charged re-verification, integer witnesses/refutations,
graph coloring/odd cycles/full input validation, rational identities/denominators/
degree/intermediate limits, generic projections, actual reviewer dispatch,
forged reviewer/request getters, honest usage and malformed-output retention.

## Actual QA and retained failures

Each command used a Node spawnSync external timeout120000ms and bounded output.
No whole unbounded test suite. No failed test outcome was erased or relabelled.

| Run | Result | Actual timing |
| --- | --- | --- |
| Initial focused Vitest | 68/68 PASS | 275ms / wrapper722ms |
| Arithmetic/time hardening rerun | 68/68 PASS | 263ms / wrapper608ms |
| Reviewer/retention controls | 73/73 PASS | 231ms / wrapper471ms |
| Latest duplicate-key/depth/intermediate controls | 76/76 PASS | 233ms / wrapper467ms |
| Scoped ESLint | exit0, errors0/warnings0 | wrapper1762ms |
| Whole tsc first | exit2, core2 + concurrent runtime2 errors | wrapper25048ms |
| Whole tsc second | exit2, core2 + concurrent campaign9 errors | wrapper23700ms |
| Isolated core tsc first setup | exit2,5 missing Node type-resolution diagnostics | wrapper618ms |
| Isolated core tsc corrected config | exit0,errors0 | wrapper1034ms |

Core tsc first failures were TypeScript union inference adding optional undefined
schema fields; explicit generic context fixed schemas. Second core failures were
union return inference on coverage; explicit DomainCheck return annotations fixed
them. Concurrent runtime errors were reported to its owner, not edited here.
Isolated config missing Node typeRoots was a test-wrapper setup failure; adding
the existing `/Users/os/hiveos/node_modules/@types` path fixed it without any
dependency/product/source-cap change. Whole build is NOT_RUN, repository typecheck
remains an integration obligation, and repeated passing tests are not counted as
additional distinct controls. Latest distinct named count76, not cumulative reruns.

## Public API and durable admission

- `createDomainProblemContract({id,rootId,target,mode,adapterId,adapterVersion?,input,obligationId})`
  assembles reviewed domain semantics for host-authoring; `prepareProblemContract`
  validates every explicit semantic field and returns `{contract,contractDigest,inputDigest}`.
- `listDomainAdapters` / `resolveDomainAdapter` expose capabilities, JSON schemas,
  explicit byte/dimension/arithmetic/work/time ceilings. No model-selected imports,
  code, executable paths or install hooks.
- `prepareSolverRequest(prepared,obligationId,role?)` and
  `prepareReviewerRequest(prepared,obligationId,admittedCandidate)` produce frozen
  host-bound public requests. Neither includes checker/source authority or hidden
  evaluator references. Reviewer candidates are checked as host capabilities
  before property access.
- `invokeResearchProvider(port,request,prepared,retainOriginal)` uses only admitted
  public requests, requires a host retention callback before dispatch, and retains
  bounded malformed candidate text before schema rejection. Streaming transport
  must enforce response bytes before allocating its returned string; oversized
  transport results are refused, never silently truncated into certificates.
- `admitCandidate(prepared,obligationId,originalBytes)` preserves the exact original
  UTF-8 JSON text and digest; parsed projection is lossless, no missing evidence
  invented. Candidate is not verifier authority.
- `createHostVerifier({runtimeSourceDigest,sourceBundleDigest,authorityEpoch,
  checkerSourceDigests,reserveCheck,now?})` yields `verify` and `projectClosure`.
  Mandatory checkerSourceDigests come from the runtime-authenticated actual source
  manifest, not semantic implementation digests or caller AI assertions. `verify`
  reserves exact binding/limits before checker clock/material work. Async runtime
  DB reservation can precede it and a sync callback consume the one matching token.

Receipt binding includes contract/root/obligation/predicate/input/candidate/attempt,
adapter/version/actual checker SHA, source bundle/runtime SHA and authority epoch;
actual checked scope/coverage/result/assumptions/limits/work/elapsed are retained.
Only this verifier factory's frozen receipts can project closure. Persisted JSON
receipts are informative, not authority: restart reconstructs prepared contract
and candidate from exact retained bytes, then charges fresh exact verification
under the authenticated pinned bundle. No hash/body-based receipt rehydration.

Trust boundary is the authenticated reviewed runtime's private host namespace,
not cryptographic protection against arbitrary hostile same-process JavaScript.
Tests deliberately supply synthetic SHA pins and controlled transports; they do
not establish release/source authenticity or live model identity.

## Exact supported scientific scope and limitations

INTEGER_WITNESS: signed64-bit linear coefficients/rhs, up to4 positive witness
integers; optional finite-box refutation max16 per dimension, at most65536
assignments. No primality inference or unrestricted nonexistence.
FINITE_GRAPH: simple undirected sealed input, vertices<=64/edges<=256/colors<=16;
all vertices covered for coloring, every input edge validated for either witness.
Odd cycle certifies only the named full graph is not bipartite; it need not span
unrelated vertices and is not an infinite-family claim.
POLYNOMIAL_IDENTITY: exact rational constants, positive nonzero denominators,
up to4 factors/side, factor degree<=16/total degree<=32; exact coefficient
convolution, not samples, proves the stated polynomial identity on Q. Intermediate
512-bit/200000-operation/1000ms ceilings are conservative cooperative admission;
oversized products/sums refuse before allocation and return INCONCLUSIVE. No
variable denominators, analytic continuation or unrelated universal proof.

Declared limits are conservative accounting, not OS hard RSS/time containment.
Original UTF-8 text preservation does not validate arbitrary byte-encoding beyond
the transport's string contract. UNKNOWN transport usage is not zero. Formal
theorems/reviewed arguments require distinct applicable capabilities not installed
here. No AI vote, confidence, receipt digest or positive finite control establishes
novelty, external value, global LRC or p139 closure.

## Decisions/deviations and next action

Main approved L2 source identity seam: required actual checker-source SHA map
from the authenticated reviewed bundle, separate semantic implementationDigest.
Domain-owned catalog separation is an implementation choice preserving approved
fourth-transfer architecture, not a new scheduler or source authority.
No architectural change, new research target or resource grant was inferred.

Next within approved package: independently review consequential core code/tests,
then integrate actual authenticated worker/admission/persistence/recovery via
package2. Main performs fresh acceptance/source-pinning; do not call this unused
pure core integrated. Preserve p139 G/C/T/B OPEN0/4 and failedattempt5 history.
What changed: exact generic domain/evidence APIs and76 finite controls now exist.
What prevents full closure: independent acceptance, real worker/DB/recovery,
evaluator/fourth transfer, UI/browser and separately authorized empirical users.

## Append-only Main-routed extension-ready test refinement

Main requested a test-only change BEFORE the R3 integrated freeze: initial registry
test asserts the first three installed domain IDs/capabilities, not exactly three
total installed adapters. It therefore remains meaningful when an independently
reviewed fourth domain is appended; no later test weakening is needed. All12
generic/domain source files unchanged. No scientific predicate/limit/API altered.
Fresh focused Vitest76/76 PASS,253ms/wrapper577ms,external120s; distinct count
still76. NEW test SHA256
`b005af81c696382a6199fd2ad2e33e2ad7b3bec30dc4d7e8e4cc6f780c13bf27`.
Predecessor12296-byte report prefix SHA
`f26477a7f9966346d049fa3ab25bae35730c8d5c58fa89427e404149010f9252`
is preserved; this is an explicit append, not failure/history replacement.
Final scoped lint after the preceding report publication also passed exit0,
errors0/warnings0,wrapper912ms. No additional source edits followed. A remains
pure-core-only pending independent/Main acceptance and actual worker integration.

## Append-only Main-approved R9 refinement before integrated freeze

Main explicitly approved L2 narrow refinement after runtime integration review
identified missing domain-applicable method cards and candidate-vs-predicate
failure distinction. This remains ONE RESEARCH_CORE_V3_076 ENGINEERING_BUILD;
no target, domain, source authority or resource ceiling was added. Predecessor
13353-byte report SHA
`5a6731d017ab28f0075718bb96e8a4e4a51631c65423fa181c1e1b4ad78e6f8c`
and the earlier checkpoints remain as preserved prefixes/history, not erased.

`DomainAdapter.methodCards`/`applicableMethods` are reviewed domain-owned static
cards with IDs, acceptance types, method material and explicit discriminating
experiment. Generic `applicableDomainMethods(prepared,obligationId)` filters exact
input applicability and seals the returned installed cards; runtime can select
only within the approved card envelope without a copied scientific switch.
`prepareSolverRequest(...,role?,selectedMethodId?)` and
`prepareReviewerRequest(...,candidate,selectedMethodId?)` bind selected method and
experiment into the exact host-minted public projection. These are bounded policy
choices, not empirical evidence of intelligent research or method superiority.

Receipt scientificDisposition is now mandatory: VERIFIED_EXACT_SCOPE,
INVALID_CANDIDATE, REFUTED_EXACT_PREDICATE or INCONCLUSIVE. Wrong linear witness,
graph coloring/cycle or expansion is only an invalid candidate, not a false goal.
The finite-box checker finding an actual solution refutes ONLY its exact sealed
no-solution predicate; independent unequal polynomial expansions refute ONLY the
sealed exact identity. Descriptor binds exact predicate and checked scope. Generic
host validates result/disposition/refutation consistency before minting evidence.
Runtime must STOP if its exact committed goal predicate is refuted, not silently
pivot the goal or recycle a retired predicate. No global/root theorem implied.

Fresh focused Vitest79/79 PASS,255ms/wrapper492ms,external120s; three NEW distinct
method-card controls, strengthened existing refutation controls not recounted.
Fresh isolated core tsc exit0/errors0 wrapper933ms; scoped ESLint exit0/errors0/
warnings0 wrapper1677ms. The final generic disposition consistency guard is a
subsequent source-only hardening step requiring Main fresh rerun/review before
acceptance. Actual worker integration, source bundle re-pinning and R3 complete
generic freeze remain pending; original A source/test pins are predecessor pins,
not falsely advertised as unchanged current source. Builder will send current pins
externally after Main-routed review; report cannot contain its own future digest.
