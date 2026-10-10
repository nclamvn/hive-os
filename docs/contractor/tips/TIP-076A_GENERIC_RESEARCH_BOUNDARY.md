# TIP-076A — Generic research contract and three domain adapters

2026-10-05. BUILD approved by direct Owner: “triển khai lần lươt và trọn vẹn
các dề xuất cải tiến”. Parent TIP-076 blueprint SHA256
35249249e02a4077b6d631304625ed98c36efc9f1097b976c3de7319cc4075c1.
Mode ENGINEERING_BUILD; this is package1 of one approved four-package upgrade.

## Scope and ownership

Builder owns NEW `src/modules/research-sandbox/research-core-v3/` contract,
adapter registry, verifier, provider-boundary and three domain files; NEW unit
tests `tests/unit/research-core-v3*.test.ts`; report
`docs/verification/TIP-076A_CORE_COMPLETION.md`. No existing legacy source edits.
Communicate public exports/input/output contracts early to runtime Builder.
Main owns design/routing/review only. Independently review consequential code.

Package1 pure core is a prerequisite, NOT full R1 closure. Actual authenticated
worker/persistence integration is mandatory in package2 and whole acceptance.
Do not call an unused helper integrated or a local fake provider live AI.

## Required behavior

Versioned generic ProblemContract: exact target/mode/domain/ordered quantifiers,
assumptions/source debt/obligations/closure/exclusions, no ES/LRC optional fields.
Bound untrusted JSON before schema/hash/material allocation; reject getters,
cycles, unsupported keys, huge graph/coefficients, invalid numbers and unsafe
arithmetic inputs. Use existing canonical JSON/digest conventions; no deps.

Reviewed static adapter registry owns domain-specific request/candidate schemas,
prompt/method material and verifier capabilities. Generic schema holds bounded
adapter payload; no dynamic imports/eval/module paths selected by model/client.
Expose host-driven resolution, admission and verification APIs so worker package2
does not implement scientific switches. Registry rejects unknown adapter/version.
Provider transport/accounting is a separate port, independent of predicates.
Provide generic solver/reviewer input/output projection; keep host receipts and
hidden evaluation references out of solver schema/prompt/returns. Original model
candidate bytes retained; normalization cannot fill in missing evidence.

Three initial domains, exact small support ceilings explicitly declared:
- INTEGER_WITNESS: exact positive-integer equation/witness or exact typed finite
  predicate refutation; a witness is not a universal theorem or primality claim
  unless the checker actually establishes the necessary predicate.
- FINITE_GRAPH: sealed graph coloring or odd-cycle witness, including complete
  graph input validation/vertex coverage/edge checks, no infinite-family claim.
- POLYNOMIAL_IDENTITY: rational coefficient identity via independent exact
  arithmetic; samples cannot establish identity, denominator/domain assumptions
  explicit. Input/intermediate bit sizes, operation count/deadline capped.

Separate candidate from host-created verifier evidence. Receipt binds contract,
obligation, checked predicate/scope, attempt/input, adapter/checker/runtime source
identity, actual result/coverage and limits. Callers/LLMs cannot mint host authority
by supplying a PASS/status/hash; generic scientific closure consumes admitted
host evidence with exact matching, not votes or arbitrary receipt objects.
Acceptance types distinguish witness/finite exhaustion/identity/reviewed argument/
formal theorem and novelty/external acceptance remain separate. Unsupported
universal/continuous proof or missing capability remains UNSUPPORTED/INCONCLUSIVE.

Sufficient provisional API surface: prepare/validate contract; list/resolve adapter
capabilities; prepare solver/reviewer request; admit candidate; verify candidate;
project exact obligation closure from host result. Choose ergonomic names and
share them early; runtime Builder consumes types without copying scientific logic.

## Acceptance scenarios

Given each domain and a sealed exact obligation, when a valid candidate is checked,
then obtain only its applicable exact scope; actual positive and negative tests.
Given plausible invalid/wrong-input/coherently rehashed candidate or forged receipt,
then refuse or retain unverified, never certify from matching hashes.
Given absent adapter/checker, unsupported claim, oversized/arithmetic resource
input, then typed refusal before provider/checker effects or costly allocation.
Given generic input, solver schema/prompt has no ES/LRC fields, published answer
or host-only authority. Old legacy source/fixtures remain byte-identical.

## QA and boundaries

Read AGENTS, approved blueprint and latest active/handoff; full Vibecode skill and
its report/QA references; bundled Next docs index before any code. Pure TS has no
UI work. Use apply_patch. Focused Vitest wrappers <=120s/suite and bounded typecheck;
retain failures, no full unbounded runs/shared legacy source lock changes.
No DB/migration/browser/live model/API/new research/actual p139/evidence access,
source37 reseal/dependency/env/Git changes. Freeze final report+source pins after
consequential independent review; do not claim mathematical breakthrough.

Completion: named requirements/scenarios, files, tests/time/errors, remaining
integration obligations and exported API. Main routes package2 without another
human ceremony inside the approved architecture.

## Integrated R9 refinement routed before final freeze

Main independent read/fresh76controls passed for the initial pure core. This is
a prerequisite checkpoint, not final integrated source freeze. Runtime integration
identified the missing typed domain method/refutation seam required by parentC/R9.
Main explicitly routes the original core Builder to add reviewed domain-owned
methodcards (applicability, discriminating experiment, selectedMethodId in public
request projection) and exact scientific disposition/refutation descriptor now,
BEFORE the final generic manifest is frozen. No new target, adapter domain,
provider grant or closure authority. Preserve initial report/pins as history and
append delta/fresh test evidence, then Main independently verifies the refinement.

Incorrect candidate/witness is INVALID_CANDIDATE, not a refuted root predicate.
Only an actual independent checker may emit a named typed refuted predicate within
its exact finite scope and assumptions. Do not reuse that exact retired predicate
under a renamed method; do not retire the mathematical target merely because one
proposed witness fails. Ranked admitted controls are bounded software policy, not
proof of intelligent autonomous discovery. Original core author owns this narrow
refinement; runtime author consumes API without domain-specific switches.
