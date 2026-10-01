# TIP-034 independent skeptical review

Date: 2026-10-01. Scope: source-status/method-map contracts, adaptive portfolio,
command-bound trace validation, actual worker callback transport and retained UI.

Verdict: **PASS for the reviewed deterministic implementation boundary, with
the scientific, live-browser and database gates explicitly separate.** This is
an independently exercised review context, not formal verification, a
different-model review or a certificate of mathematical novelty. The reviewer
did not edit product code, run providers/models, start a live worker, mutate an
application database, commit or push.

## Instructions and evidence boundary

Read AGENTS.md, the complete current CODEX_CHAT_HANDOFF.md, Vibecode Kit v6.2
and its QA/report references, the approved TIP-034 contract, both Builder
interfaces and the scientific evaluation protocol. The concurrent dirty
checkout and historical arithmetic packets were preserved. Only this report
is reviewer-owned.

Inspection covered `math-source-status.ts`, its fixed fetch adapter,
`math-method-map.ts`, `math-adaptive-strategy.ts`, `math-portfolio.ts`,
`math-cycle.ts`, `math-cycle-kernel.ts`, cycle/reviewer adapters, actual worker
wiring, the new strategy panel and its Math Pilot page placement. New source,
adaptive and worker tests were read; legacy portfolio tests were rerun.

## Primary-source precision

Independent official-page browsing confirmed the latest Jiang v2 withdrawal
and author-reported errors, Tao/Elsholtz–Tao latest v6, and Salez v1:
[Jiang](https://arxiv.org/abs/2609.09204),
[Elsholtz–Tao](https://arxiv.org/abs/1107.1010),
[Salez](https://arxiv.org/abs/1406.6307).

- ACTIVE means no withdrawal observed at capture; it does not certify a paper's
  mathematics. Historical Tao v2 cards are not silently relabeled as current v6.
- Jiang never appeared in the old runtime frontier/prior-art arrays. The two
  historical research notes cited it; dated corrections are appended there.
  This review does not claim a historical live agent relied on that source.
- Publication-wide quarantine removes citation authority, not every separately
  checked arithmetic conclusion. It is not a proof that every lemma is false.
- Builder B reports actual unchanged Node collector capture/parsing of all
  three official HTML pages after an initial unavailable-network path. The
  reviewer independently checked official status pages but did not repeat that
  Node network collection. Its exact normalized fingerprints are in the
  literature-status audit note.
- Digests cover normalized retained status evidence, not raw HTTP, full papers
  or publisher signatures. Collector provenance depends on the trusted fixed
  runtime, not a hash alone.

## Adversarial findings, repairs and retests

1. **Future observation masked by withdrawal.** Initially a future Jiang
   observation retained WITHDRAWN, allowing a status-only freshness check to
   miss its future timestamp. Separate freshness now preserves quarantine but
   rejects new admission. Independently reproduced and retested.
2. **Historical version mislabeling.** Historical v2 method cards initially
   inherited current applicability from the latest v6 observation. They now
   remain historical background; latest/source-selected versions are explicit.
3. **Duplicate history parsing.** A malformed duplicate-v1 submission history
   initially yielded ACTIVE. Unique, contiguous history plus exact count now
   rejects it as unavailable. Independently reproduced and retested.
4. **V2 rehashing and diversity.** Initial sealing/replay admitted repeated
   method families or a recomputed required STRUCTURAL_PROBE field without a
   corresponding typed plan. Current seal and historical replay recheck tool
   plan compatibility, fixed method/family identity, quarantine, evaluation
   scope and family/hypothesis diversity. Rehashing cannot bypass these checks.
5. **Preplanner phase collision.** Reusing FRONTIER_DOSSIER before planning
   incorrectly marked the round as having reached its later frontier gate,
   invalidating exact structural refutations. Separate
   RESEARCH_FRONTIER_BASELINE now leaves the later phase semantics intact. The
   real bounded GATE_MUST_OPEN probe/refutation trace passes before the solver.
6. **Withdrawn alias bypass.** Rehashed frontier dossiers with a withdrawn HTML,
   PDF or DOI URI could initially pass the new-policy boundary; subsequent
   guard hardening still missed legacy HTTP, dx.doi.org and Crossref-style
   encoded DOI slashes. Those exact cases were independently reproduced.
   Identity normalization now covers them without expanding fetch authority.
   New-policy replay rejects all eight alias/unsafe-URI cases in the regression;
   four repaired identity aliases were independently checked again. Unsafe
   credentials and nonstandard ports are rejected at the dossier boundary.
   Legacy dossiers are not retroactively rewritten.
7. **Finite replay falsely treated as hypothesis refutation.** Generic
   COUNTEREXAMPLE_REPLAY PASS was initially enough to label the prose hypothesis
   REFUTED despite inconclusive reviewers. That inference is removed. Exact
   typed refutations now use TYPED_PREDICATE_REFUTED with
   REGISTERED_PREDICATE_ONLY scope, exact registered claim/evidence digest or
   probe plan/plan digest/report digest. Prose equivalence is not certified.
   Mandate and UI say so explicitly. Four independent schema mutations—missing
   metadata, inconsistent outcome, altered plan digest, broadened scope—were
   rejected. A valid mixed-core predicate/evidence binding was preserved.

8. **Declared-policy arithmetic evidence stripping (final narrow audit).**
   Although the actual new Erdős producer emits MIXED_CORE_REPLAY_V3, a fully
   rehashed declaration/baseline/map/CALL_STARTED prefix with the arithmetic
   marker and evidence omitted initially validated. The reviewer independently
   reproduced this without model/network/database calls. The trusted adaptive
   declaration now requires fixed V3 method and validated matching PASS evidence
   before downstream calls. The reviewer independently retested the original
   stripped prefix: it now rejects. Declared-policy V1 and V2 downgrade markers
   also reject before evidence; a historical no-policy V1 marker remains
   readable. Focused new-policy and legacy tests passed after this repair.
9. **False steering seed before source discovery.** Parent isolated integration
   exposed a false seed reaching source discovery before its independent replay
   rejection. The intake block now follows seed/gate replay but still precedes
   every planner reservation. Inspection confirms no new declaration/V3/map
   ordering collision: an exact failed seed can retain diagnostic evidence and
   stop without a map or any call. The new composition regression checks no
   source/method producer or model call and validates the retained stop trace.

The earlier findings are repaired implementation findings, not claims of historical data
corruption or newly discovered mathematical results.

## Requirement coverage

| Requirement | Independently reviewed evidence | Remaining boundary |
| --- | --- | --- |
| R01 | Strict status/version/time/schema, withdrawal floor, malformed history, bounded exact-target fetcher and alias tests | Status is not mathematical authority; fixed corpus only |
| R02 | Root/dossier/card/packet digest binding, semantic card reconstruction, six families and non-authoritative ceilings | Partial curated map, not exhaustive literature discovery |
| R03 | Preplanner baseline/map retention and exact context through planner, both source roles, verifier, solver and both reviewer callbacks | Model/job boundaries mocked in worker transport; no live campaign |
| R04 | V1 preserved; V2 semantic sealing/replay, typed plans, distinct families and warmup scope | Natural-language root contribution is proposed, not proven relevant |
| R05 | Deterministic relevance ranking, outcome/diversity memory, repeated/warmup exclusion, retained DEFERRED needs, best READY alternative | Utility and family penalties are routing heuristics, not measured research yield |
| R06 | Retained validated trace only, bilingual static rendering, no fetch or tool run, absent historical panel explicitly labeled | No new-policy visual/browser acceptance in this review |
| R07 | Rehashed/root/status/alias/downgrade/order/selection mutations, actual transport test, legacy portfolio regression | Parent owns final full suite, isolated DB integration and build/browser checks |
| R08 | Both withdrawal corrections and Builder audit/completion evidence inspected | Parent owns handoff, current manifest and final acceptance reconciliation |

## Checks actually run by reviewer

```sh
npx vitest run tests/unit/math-method-map.test.ts --maxWorkers=1
npx vitest run tests/unit/math-adaptive-strategy.test.ts tests/unit/math-method-map.test.ts tests/unit/math-cycle-worker-transport.test.ts tests/unit/math-portfolio.test.ts --maxWorkers=1
npx vitest run tests/unit/math-adaptive-strategy.test.ts --maxWorkers=1
npx vitest run tests/unit/math-adaptive-kernel.test.ts tests/unit/math-adaptive-strategy.test.ts tests/unit/math-portfolio.test.ts --maxWorkers=1
```

Results: first focused source run **9 tests / 1 file PASS**; final focused
adaptive/source/actual-worker/legacy-portfolio rerun **35 tests / 4 files PASS**.
The latter includes eight fully rehashed frontier-alias rejections and the
actual bounded structural-refutation ordering control. Worker transport
executes the real callback wiring with job/model boundaries mocked; it does
not run a live worker or model.

After the Builder added explicit typed-memory/schema and prior-inconclusive
routing regressions, the final adaptive-only rerun passed **20 tests / 1 file**.
The report does not sum overlapping reruns as distinct tests.

The post-V3-guard composition/adaptive/legacy-portfolio run passed **35 tests /
3 files**. It exercises the real cycle composition with tenant/database and
model-result boundaries replaced, including two-round routing and seven role
callbacks. These are not live application database/model runs.

The same three-file command rerun after the false-seed ordering repair passed
**36 tests / 3 files**, including the newly added ninth composition scenario.

Independent stdin TypeScript checks, without shared artifact writes, also
rejected twenty source/card/packet mutations after digest recomputation,
checked stale/future admission, exercised the repaired identity aliases and
checked the four exact-refutation schema mutations described above. No numeric
test total is used as a mathematical confidence percentage.

## Trusted boundary and scientific limitations

- New eligible creation stores the root/cycle policy in the tenant-scoped
  CommandRecord and mirrors it to the outbox. The first legitimate claimed job
  appends the declaration first; no fabricated event job or migration is used.
  New calls/portfolios require map admission. Execution and UI-read validation
  derive expected policy from the command, so rehashed event-marker stripping
  cannot downgrade a declared new cycle. Outbox disagreement fails.
- Historical integrity uses recorded admission time rather than today's clock;
  old V1 portfolios and source semantics are not silently regraded. Future
  corpus/quarantine revisions require a new policy/schema.
- A database superuser rewriting the trusted command, outbox and complete
  ledger is outside this trust boundary. It is not an exposed normal mutation
  route or a claim that hashes provide publisher/runtime authentication.
- FrontierDossier itself has no intrinsic root identity; the new method packet
  binds its retained digest to the root. The real producer constructs it from
  that root, but a hash cannot establish semantic relevance of arbitrary
  captured passages. Source assessments and the map remain non-certifying.
- Exact repeated prose may be pruned to avoid repeated work. That scheduling
  rule must not be read as proof that the prose is mathematically false.
- Missing tools remain needs, not model-authored executable authority. Existing
  resource envelopes remain bounded. No unbounded budget or autonomous campaign
  was authorized by this implementation review.
- The four fixed targets are development/warmup, not holdout. The evaluation
  protocol is a preregistration plan, not a completed same-budget comparison.
  **Scientific method improvement: NOT_MEASURED.** No breakthrough, all-prime
  theorem, novelty or formal-proof claim follows from these tests.
- Parent reports the full serial unit suite **501 tests / 85 files PASS**, full
  lint/typecheck clean and production build PASS. These are parent-run checks,
  not an independently duplicated global suite. Final guarded integration
  rerun remained separate at this revision. Parent reports historical IAB
  attachment timeouts; HTTP sign-in
  health is not browser E2E and static rendering is not visual acceptance.

No remaining blocking defect was observed after the final declared-policy
arithmetic-strip and false-seed ordering repairs. Final Contractor acceptance must retain the
distinction between implementation checks and unperformed scientific/live
gates.
