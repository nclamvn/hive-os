# TIP-072M Core Builder completion

Date: 2026-10-04. Status: CORE_OFFLINE_COMPLETE; independent consequential review,
Replay wrapper acceptance and Main whole-repository verification pending.

## Scope and deliverable

Implemented only the new pure `math-lrc-shift-margin.ts`, its unit test and this
report. The module imports only `node:crypto`; it does not reuse the previous
LRC arithmetic or modify its 1/15 predicate. It exports a fixed-four-class
builder and a bounded passive full-report reconstruction validator. Neither
function creates a grant, source attestation, execution capability or admission.

The exact phase partition includes every unit residue, all deduplicated critical
points, each boundary cell and every connected open cell including cyclic wrap.
At delta=r/(2d), coincident endpoints are deduplicated to d boundaries per unit,
not counted twice. Equality is good: boundary bad-mask cardinality is r-1; open
cell cardinality is r. All 132 cells are retained. The aggregate attainable-mask
family is deduplicated and ordered by integer bitset. Enumeration visits every
family tuple without a redundant unit/cell product.

| d,e | r | sharp exception delta | family size | tuples | minimum good shifts | conditional 14-moving margin |
| --- | --- | --- | --- | --- | --- | --- |
| 3,2 | 1 | 1/6 | 4 | 16 | 1 | 1/13 |
| 5,2 | 2 | 1/5 | 15 | 225 | 1 | 1/13 |
| 5,3 | 1 | 1/10 | 6 | 216 | 2 | 1/12 |
| 5,4 | 1 | 1/10 | 6 | 1296 | 1 | 1/11 |

There are 1753 total family tuples. Explicit cyclic offsets and all distances
are recorded; max_j min_i distance equals delta exactly for every class.
This is sharpness of the uniform exception-phase **distance threshold**, not
sharpness of the survivor-count witness or an actual full speed tuple. In
particular the d=5,e=2 distance witness has three good shifts at equality while
the exhaustive family's minimum count is one. A dedicated control preserves
that distinction.

The conditional lifting retains explicit LRC(14-e), a lower witness and analytic
alignment assumptions. Enumeration of finitely many representative rational
phases is not itself an all-real proof: the separate Main written count and
continuity argument is required. No novelty or literature-priority claim is
made. Global LRC14/15, speed-tuple sharpness, formal and external validation stay
NOT_ESTABLISHED. Agent loop is NOT_RUN and executionAuthority is false.

## Wire clarification / bounded controls

DEVIATION / implementation-wire clarification approved by Contractor: the
initial verbose `{numerator,denominator}` representation exceeded the existing
32 KiB report cap. It was replaced by reduced exact decimal string tuples
`[numerator,positiveDenominator]`, preserving every fraction, cell and report
field. No cap or mathematical scope was expanded and no evidence was omitted.

Canonical semantic body hash excludes elapsed time and charged work. Report
ordering and fraction reduction are deterministic. Returned generated evidence
is recursively immutable and detached from supplied evidence. Admission compares
the entire bounded reconstructed envelope; coherent rehashes cannot admit
semantic mutations. Strict plain-data inspection refuses getters, prototypes,
symbols, cycles, sparse/hidden/accessor arrays, extra fields, noncanonical
numbers, bad ordering and missing cells. Inherited Object/Array serialization
hooks are refused without invoking them. This is passive-input safety, not an
attestation of a hostile JavaScript runtime.

The pure Core uses exact small safe-integer lattices for its fixed d=3,5 domain.
No untrusted decimal component is converted to arithmetic. The passive fence
enforces 256-bit unsigned decimal component bounds before serialization/hash
comparison, plus 32768-byte, depth and node bounds. Positive integer remaining
time/work descriptors are required; zero/fractional/oversized budgets refuse.
Time and charged work are checked throughout; a refusal exposes no partial
evidence. The fresh Python wrapper owns the aggregate remaining 5s/2M budget,
including Core, process, I/O and comparison; this Core does not reset or manage
that outer budget.

Measured actual Core build: ACCEPTED, 18960-byte full envelope, 30852 charged
operations, about 11.85ms in the recorded local metadata run. Runtime is not a
deterministic promise. Semantic digest:
`bc5e0c35ca92175882b6056edf4ddbe13fa169a085cced57edf256fbf88c92ed`.
Replay Builder independently reported the same body digest from an actual fresh
isolated Python process; final wrapper and independent acceptance remain theirs.

## Verification and freeze

Executed with all six flags OFF:

```sh
RESEARCH_WORKER_ENABLED=false MATH_PILOT_QUEUE_ENABLED=false LRC_CAMPAIGN_LOCAL_ENABLED=false RESEARCH_OPENAI_ENABLED=false RESEARCH_CODEX_LOCAL_ENABLED=false SANDBOX_DOCKER_ENABLED=false node node_modules/vitest/vitest.mjs run --project unit tests/unit/math-lrc-shift-margin.test.ts --maxWorkers=1 --no-file-parallelism
node node_modules/eslint/bin/eslint.js src/modules/research-sandbox/math-lrc-shift-margin.ts tests/unit/math-lrc-shift-margin.test.ts
```

Final own selector: 1 suite, 84/84 PASS (539ms recorded runner duration).
Focused lint PASS. Full `npm run typecheck` PASS after explicit resource-number
and object-refusal TypeScript narrowing fixes. These preserve report semantics;
Main still owns final whole-repository acceptance. Prior checkpoint counts are
not added. Tests include exact
independent integer distance calculations, sharpness/cardinality distinction,
all boundaries/wrap cells/families, coherent rehashed semantic attacks,
assumption/global/authority promotions, passive-input hazards and resource
refusals. Main owns wholetypes/build and historical regression selection.

Frozen source SHA-256:
`86c23ecfd0fd68d28d093dfceebe92abf83929d5c06c17881349f674779d6132`.
Frozen test SHA-256:
`022a5f928b30f208b7b7084a544a6c694d820e99e994a0b37f36cb403dc1fc4f`.
Reviewer flagged ES2017-incompatible BigInt literal in one hostile test; the
test now uses `BigInt(...)` constructors, preserving the same 257-bit control.
The later wholetypes narrowing fixes changed product source bytes, not the
semantic digest. Replay's source pin must use the final product hash above.

## M1–M6 acceptance accounting

| Requirement | Core contribution | Full task status at Builder freeze |
| --- | --- | --- |
| M1 all-real proof | Complete finite phase partition, explicit written-proof requirement | PARTIAL; Main dossier and independent proof review required |
| M2 sharpness | Explicit rational offsets/distances; exact max-min equals delta; own controls pass | PARTIAL; written universal upper bridge and consequential replay acceptance required |
| M3 conditional lifting | Four stronger margins and all assumptions retained | PARTIAL; Main written lifting and independent review required |
| M4 complete reconstruction | All 132 cells, 1753 tuples, exact minima; Core PASS | PARTIAL; Replay wrapper/reviewer acceptance required |
| M5 hostile controls | Core mutations and resource controls PASS; no partial positive | PARTIAL; process/source/timeout/drift controls owned by Replay |
| M6 final verification | Source/test frozen; own tests/lint PASS; no prior product edits | PARTIAL; consequential review/Main QA/preservation audit pending |

No DB, provider, model, worker, campaign, source-root or archive execution was
performed. No case/history/ledger/route/UI/session/env/install/migration/Git/
billing/deploy change was made. This deliverable is a local, conditional method
diagnostic milestone, not a live autonomous agent E2E or research breakthrough.
