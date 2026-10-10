# Blueprint proposal — TIP-061: whole-campaign evidence inside the agent loop

Date: 2026-10-04, Asia/Ho_Chi_Minh. Status: **PENDING HUMAN APPROVAL**.
This is a design proposal, not an implemented feature, sealed TIP, accepted
certificate, model run, or authorization to enable a worker. Contractor uses
Vibecode Kit; a Builder implements only after approval of this scope.

## 1. Outcome and why this is the next step

Give solver, critic and adversary the same host-admitted, digest-bound facts
from the complete p83 campaign **before** they make mathematical judgments.
Stop treating the completed offline campaign as a separate dashboard result.
Use it to distinguish established finite facts, conditional structural lemmas,
and genuine remaining proof obligations. Do not start another prime campaign
or repeat small shards as a substitute for understanding the proof.

The current accepted result is a reproduction of a known-source finite step:
`I(13,83,224) = empty` and `J(13,83) = empty`, under the reviewed bridge and
source assumptions. It is not a proof of unrestricted LRC for 14/15 runners,
not a novelty claim, and not formal or external academic verification.
Other 60 P13 primes, independent lower-case reproduction, all 23 APPLICATION
gates and global acceptance remain OPEN.

TIP-060 additionally supplies a reviewed conditional prime-lift lemma. Its
complete `C_q` subset has `1 + n(q-1)` labelled tuples: one NO_GRID lift and
`n(q-1)` constructive GRID witnesses, conditional on a NO_GRID parent and
same-threshold deletion witnesses for every coordinate. Its p83 application
contains all 158 tuples / 156 constructive witnesses for both ancestors.
This subset result is not the full terminal certificate and must never replace
TIP-059. Its standalone outside-subset OPEN boundary does not reopen TIP-059.

## 2. Code-backed gap and compatibility baseline

| Existing seam | Current behavior | Proposed additive behavior |
|---|---|---|
| `contracts.ts:97–122,238–241` | Attempt/provider support host-only small `lrcEvidence` | Separate campaign field; never widen the old field |
| `math-pilot.ts:85–98` | Version-1 sealed contract, optional finite scope | Explicit prospective campaign contract branch; old v1 parses and digests unchanged |
| `worker.ts:150–201` | Old finite replay before solver, then host attachment | Separate campaign admission before dispatch; provider cannot author evidence |
| `adapters/codex-local-math.ts:215–250` | Validates finite evidence and constructs solver prompt | Validate campaign binding and use a common immutable facts block |
| `adapters/codex-local-review.ts:93–158` | Both roles validate small evidence; unrelated OPEN route includes Erdős-specific mandates | Explicit campaign route using the same facts; no Erdős mandate leakage |
| `agent-review-kernel.ts:60–94` | Pre-review check, version-4 finite ledger | Campaign-only prospective version 5; validate again before each role |
| `agent-review.ts:43–87,203–230` | Strict versions 1–4, read-time recomputation and binding | Explicit version-5 validation and read-time recomputation; no downgrade |
| `math-cycle-kernel.ts` | Erdős controlled-cycle route excludes LRC | Keep exclusion; no reuse of an incompatible autonomous loop |

The old finite verifier retains modulus <=128, <=10,000 Cartesian tuples,
<=20,000 nodes and its existing 10-second lane. Full p83 has repeated entries,
larger moduli and much larger complete domains. Raising old caps or squeezing
the campaign into disjoint positive axes is prohibited.
Existing Prisma contract, attempt and review payloads use JSON. This suggests
no migration is needed, but Builder must verify all consumers rather than
claim database compatibility from column types alone. No DB mutation in the
first implementation/acceptance phase. A later live run creates a prospective
case; the existing per-case unique, append-only review must not be retrofitted.
The research dossier digest does not bind the attempt by itself: keep both
attempt and research digest bindings, plus the campaign evidence binding.

## 3. Decision: separate, host-owned, versioned envelope

Recommended names are prospective, not current APIs:

- `lrcCampaignScope`: contract metadata selecting a fixed allowlisted p83
  campaign and exact claim/domain. Public callers select a preset, not files,
  shell commands, source code, receipts or certificate contents.
- `lrcCampaignEvidence`: optional host-only attempt field, mutually exclusive
  with small `lrcEvidence`, exact/interval and Erdős certificate fields.
- Campaign contract v2: OPEN only, mandatory campaign scope, no old finite
  scope. Version-1 contracts and absent-field historical digests remain exactly
  as before; no defaults, backfill, reinterpretation or resealing.
- Campaign review ledger v5: mandatory campaign binding and matching oracle
  validity. Versions 1–4 retain their old invariants. A v5 payload without
  evidence, or campaign evidence on an older version, is rejected.

Envelope content must include:

1. Contract digest, campaign scope digest, fixed claim identifier, envelope
   version and canonical evidence digest.
2. Exact dimension/threshold: 13 nonzero relative velocities, 14 total runners,
   bad iff `14*d < M`, equality GOOD, labelled multiplicity retained.
3. Required stage identities and complete lineage: the 056 covering-number
   prerequisite, 057 generation, 058 cascade,
   059 terminal; full datasets, reports and fixed verifier source fingerprints.
   060 is a separately labelled conditional structural supplement.
4. Coverage facts, all ancestors and roots, terminal mass partitions, original
   omitted-gcd predicate, and the non-comparable level14/32 -> LCM224 bridge.
   Never replace these with survivor counts or a selected successful branch.
5. Admission mode and receipt; original source attribution, local unsigned
   trust boundary, semantic proof assumptions, novelty=false and global=OPEN.

Hash equality detects drift; it does not prove mathematics or independent
identity. A provider-supplied value with perfectly matching hashes is still
rejected. Evidence must enter through a host capability, never through model
output, public request text, model-authored code or arbitrary filesystem paths.
Snapshot canonical host bytes and expected digests before dispatch. Pass a
defensive clone/frozen view to each adapter and compare against the independent
snapshot after return, before retention. Two references to the same mutable
object are not independent validation. Refuse in-place mutation even when
the provider returns no campaign field. Apply the same rule to review inputs,
contract/scope and attempt, not only the evidence object.

## 4. Initial retained-only mode; fresh replay is a later architecture gate

| Mode | What it actually establishes | Agent-visible label |
|---|---|---|
| Initial TIP-061 retained reference | Fixed local artifact/report pins and complete recorded acceptance lineage match | `RETAINED_REFERENCE_NOT_FRESH` |
| Future fresh admission, not part of TIP-061 | All required stage verifiers execute, compare complete domains/forests/roots/masses, and retain one new bound receipt under this invocation | `FRESH_LOCAL_SEMANTIC_REPLAY` |

TIP-061 accepts exactly one fixed preset, `ALLIKVERE_P83_14_V1`. No arbitrary
prime, runner count, source or path selection. The initial envelope schema
requires retained-reference mode and literal `freshFullCampaign=false`.
It has no valid fresh branch; a forged fresh mode is rejected. Implementing
the future collector/receipt schema needs a separate approved specification.

Retained-reference validation does not claim a new mathematical replay. A
summary-only read, an old PASS receipt, a timestamp, a source citation or
successful hashing cannot produce fresh admission. A structural-supplement
replay alone cannot fresh-admit the entire 057–059 campaign.

For that future specification, fresh admission is an explicit local CLI
capability, not an HTTP GET feature.
Whole-prerequisite freshness also requires fresh 056 verification; otherwise
name the result fresh057–059 conditional on retained056. Record produced-at
and consumed-at separately: reusing a receipt is not replay at model dispatch.
Use fixed host verifier programs and existing isolated Python implementations;
no execution of author or LLM code. Verify source/input/output pins and compare
entire stage outputs, not only totals. Reject incomplete stage chains, invalid
bridge premises, missed roots, early cutoffs and changes coherently rehashed
inside a candidate report. New receipts/artifacts are create-only, mode600;
never overwrite any frozen 057–060 file. Failure leaves no accepted receipt.

Proposed outer replay budget: 300 seconds from one original monotonic start,
with all existing smaller stage/child limits preserved. Parsing, hashing,
comparison and retention are charged to the same budget. No timer reset per
retry; no automatic retry. Pin an allowlist of expected files and exact byte
sizes, enforce individual and cumulative bounds before allocation, and refuse
symlinks/path traversal. Specify the concrete bounded file budget in the sealed
TIP from the actual retained manifest. JS cooperative checks do not promise
hard RSS or preemption; subprocesses require remaining-deadline SIGKILL.
If existing runners cannot support this safely without a broader redesign,
Builder reports the conflict instead of removing caps or fabricating freshness.
The worker consumes and validates an already-produced admission receipt; it
does not run the long replay under the existing durable lease. Review does not
replace a retained-reference receipt with a fresh receipt or silently rerun
anything. A future heavy worker lane needs its own lease/budget approval.
Any future receipt selection is from fixed host-owned admission retention
through an explicit capability, never arbitrary JSON with internally consistent
hashes. The host must authenticate selection; digests alone cannot do so.

## 5. Dispatch and conclusion flow

```text
sealed campaign contract + fixed complete recorded artifact lineage
  -> host retained-reference admission (explicitly NOT FRESH)
  -> solver [shared facts digest]
  -> immutable attempt + host evidence + attempt digest
  -> pre-review revalidation
  -> critic [same shared facts digest, fresh context]
  -> adversary [same shared facts digest, fresh context]
  -> host oracle + version-5 ledger
  -> passive read-time validation + scope-aware presentation
```

Use one canonical, bounded facts serializer for all three roles. Role prompts
can differ; scope/evidence/assumptions cannot. Critic does not see adversary's
report, and vice versa. Each uses a context distinct from solver and the other
reviewer. Distinct contexts mean reasoning separation, not independent models
or independent institutions. Record requested model provenance honestly.

Pre-dispatch admission refusal must occur before model execution or dispatch
fence consumption. Recheck before each reviewer invocation, and before final
retention if input identity changed. Preserve existing single-dispatch,
accounting, lease, tenant, audit and immutable digest fences; never auto-retry
possibly charged calls. The no-DB harness tests this explicitly with stubs.

Separate two judgments:

- **Finite evidence status:** retained-reference / refused for TIP-061;
  a future fresh checked status requires a separately approved collector,
  with exact domain and missing obligation information.
- **Research-root conclusion:** PARTIAL or INCONCLUSIVE for this OPEN case.
  Even three supportive agents cannot establish the global theorem, source
  novelty, formal verification or human/external mathematical acceptance.

The next research output is a claim/dependency map: facts already available,
conditional lemmas and precise unfulfilled obligations. It must not regenerate
another small shard or infer arbitrary missing source premises from citation.
An agent may propose a direction, not silently enlarge the accepted domain.

## 6. Bounded implementation and activation phases

**A — after Blueprint approval:** retained-only schema/pure admission/facts serializer,
offline orchestration harness, v5 oracle/read validator and adversarial tests.
Wire provider and worker seams behind a separate default-OFF local campaign
capability while keeping existing queue/worker flags OFF. No network model,
DB write or new research run is needed to accept these changes.

**B — deterministic acceptance:** actual retained-reference import against
the pinned prerequisite/stage reports and dependency set, mutation/refusal
suite, all old focused regressions, whole type/lint/build, frozen pins and
append-only reports. No full replay, model execution or DB mutation.
Do not label reference import as fresh replay or stubbed three-role tests
as live agent E2E.

**C — separately operator-confirmed live observation:** one solver, one critic,
one adversary through the existing subscription-backed local adapter; fixed
model/time/output/accounting limits, no paid API or autonomous multi-round loop.
Record actual tokens and missing outputs. Any DB/UI activation requires its
explicit run scope, tenant case identity and operator action; no implicit
activation from approval of A/B. Browser E2E is separately evidenced and may
be NOT_RUN if the browser-control bridge remains unavailable.

UI changes, if included after approval, are limited to an admission/mode/scope
panel and read-only ledger display using the existing design and MathText.
Passive page reads must never execute replay, dispatch models or enqueue jobs.
Before changing Next code, Builder must read installed Next16 guides required
by AGENTS. Any aesthetic redesign beyond this panel needs a separate scope.

## 7. Requirement / acceptance matrix

| ID | Required evidence before technical acceptance |
|---|---|
| R1 | Historical v1 contracts/attempts and v1–4 ledgers keep exact digests and semantics; old finite limits unchanged |
| R2 | Campaign OPEN v2 + host envelope + v5 bind one exact claim, contract and complete stage chain; non-OPEN and cross-domain payloads refused |
| R3 | All roles receive byte-identical facts/digest; fresh distinct contexts; no Erdős-specific mandates on the campaign route |
| R4 | Retained reference never becomes fresh by hash/status/time; initial schema refuses all fresh-mode payloads |
| R5 | Missing/extra/reordered stage, coherent rehash, changed root/multiplicity/threshold/gcd, omitted tree branch and invalid14->32 bridge refused |
| R6 | Provider injection, request paths/code, forged receipts, ledger downgrade, case/attempt substitution and role-context reuse refused |
| R7 | Admission failure makes zero solver/reviewer dispatches; deadline/output/file limits, partial writes and interrupted execution fail closed |
| R8 | Read-time drift refuses the positive projection; passive GET causes zero replay/model/job side effects |
| R9 | Even supportive reports cannot promote global LRC14/15, other60 primes, all23 gates, novelty or formal/external acceptance |
| R10 | Actual reference import, measured tests, regression/type/lint/build and unchanged frozen pins reported separately from full replay, stub, browser, model and DB tests |

R6 includes hostile in-place mutation of provider/reviewer inputs without an
output evidence field. R2 includes the already-complete worker/read guard and
explicit campaign rejection at the Erdős controlled-cycle entry point.
R3 compares captured canonical facts-block bytes, not just the presence of
equal digest strings. The scope mutation tests include wrong N=13 instead of
14, equality made BAD, erased multiplicities, prime83 replaced by89, and
coherently rehashed v5 downgraded to v4/v3.

Builder supplies a Completion Report; a separate reviewer challenges stage
coverage, universal implications and negative mutations. Contractor writes a
Verify Report with numerical test results and explicit NOT_RUN categories.
Do not reuse acceptance of old artifacts as acceptance of a newly authored
verifier or new whole-campaign gate.

## 8. Scope exclusions and approval

No paid API, billing, deployment, dependency installation, migration, source
author code, new prime campaign, modification of frozen artifacts, git commit
or push. No unrestricted agent loop. Existing local server remains available;
existing workers/queues stay disabled.

**Decision requested:** approve this additive campaign-evidence architecture
and phases A/B. Live model/DB/browser activation in C remains a separate
explicit operator decision. Until approval, only design/review documents may
be written; no product schema, provider, ledger or worker changes.

## 9. Design review record (not runtime acceptance)

Two read-only Builder/reviewer scans checked current schema, adapter, worker,
ledger, cycle and JSON persistence seams. Their decisive findings are included
above: preserve absent-field digests, create a new case, explicit cycle refusal,
exact v5 variant, immutable snapshots and in-place mutation checks, and no
freshness laundering. No source or runtime state was changed by those scans.
The historical sealed manifest's 102 entries passed SHA-256 validation during
proposal preparation; tracked whitespace check passed. No new test, replay,
live model, DB, worker or browser E2E was run for this proposed architecture.
