# COMPLETION REPORT — TIP-038 / Primary Builder A

**STATUS: DONE — owned standalone implementation/proof.** Independent replay, skeptical and Contractor acceptance are separate receipts. No root result or unbounded progress is asserted.

Date2026-10-01. Vibecode Kit v6.2 Builder role; AGENTS/current handoff/full TIP and report-format references read before implementation. No Next/app code.

## Files created

- `scripts/operations/factor-transfer-partitions.ts`: self-contained signed-factor DP, exact BigInt modular arithmetic, S-only stabilizer and factor-reduced quotient orders; fixed BFS graph, blockers/frontiers/revisits/cycles/two-hop reachability/C1–C3; bounded resources and output checkpoint.
- `scripts/operations/factor-transfer-audit.ts`: fixed CLI with import/discovery/serialization envelope, no runtime seed/shift/depth/program input, bounded fail-closed diagnostics.
- `tests/unit/factor-transfer-partitions.test.ts`:16 focused tests including independent full-image/partition and direct-stabilizer oracles plus explicit synthetic graph controls.
- `docs/operations/MATH_PILOT_FACTOR_TRANSFER_2026-10-01.md`: quantified transfer proof, equality boundary, frozen results, progress refutation, literature limits and deferred alternative.
- This report.

No changes to TIP-036/037 sources/tests/pins or app/UI/DB/ledger/queue/worker/dependencies/Git/deployment. No API/provider/model/paid campaign. Existing dirty work preserved; B owns separate Python/checker/replay.

## Requirement coverage

| ID | Owned coverage | Ceiling |
| --- | --- | --- |
| R01 | Reciprocity transfer proof with q<=T equality; strict construction; actual h-growth and no termination inference; primary sources credited | Standard mechanisms, not novel/open-root proof |
| R02 | Exact13 seed order, all QNR factors, canonical BFS/dedup/depth2, blockers, explicit frontier/revisits, actual-path two-hop reachability and closed-path cycle witnesses | Finite graph; synthetic controls explicitly not campaign evidence |
| R03 | Full node images, canonical strict tuples, exact H/n/V/orders, C1 first refutation and truthful finite C2/C3 survival | Necessary defects/scientific observations, no universal progress |
| R04 | Canonical graph/row/predicate manifests, all primary resource stops, malformed/domain/largeh controls, invocation and fixed-CLI finalization deadlines | B separately owns fresh source-bound replay and rehashed receipt attacks |
| R05 |16 tests, lint/type/diff; frozen source hashes; proof/report with no model/browser claim | Final whole-unit/source preservation/Contractor gate separate |

## Tests and receipts

```text
npx vitest run --project unit tests/unit/factor-transfer-partitions.test.ts --maxWorkers=1
16/16 PASS,433ms,start20:36:11+07

npx eslint scripts/operations/factor-transfer-partitions.ts scripts/operations/factor-transfer-audit.ts tests/unit/factor-transfer-partitions.test.ts
PASS,zero diagnostics

npm run typecheck
PASS

git diff --check
PASS
```

All17 full images and canonical partitions were checked with a distinct coprime divisor-pair oracle. Miss stabilizers were independently tested by direct set multiplication. Resource controls retain atomic completed node/factor prefix and exact pending input; finalization and actual fixed CLI branch are tested with a trusted mocked60000ms observation producing PARTIAL/exit1. A high-h synthetic group verifies modular products above2^53 using a BigInt reference, without adding a graph row. Separate controls distinguish revisit from cycle, prevent depth reset through another seed, retain frontier from a parent reachable in two steps, and exercise C2/C3 refutation projection on explicitly synthetic non-admitted arithmetic. q=T at p17,h11,q7 is a proof boundary control only.

The fixed default run completed17nodes,15records=4edges+11blockers,2hit nodes,0actualfrontiers/revisits/cycles. Primary1405states/15545additionalworksteps/~10ms packet checkpoints/28177bytes, under every cap. Local arithmetic timing, not LLM latency. Full invariant `952de09e31ded70c7f9f498a6ca9933ba3ca70c404f194712b491dbf00eb9bc4` agrees with parent/skeptic independent diagnostics; final B source-bound receipt is separate.

C1 is refuted by recordr9, p200656681:h103→h2027. C2/C3 are NO_REFUTATION_IN_COMPUTED_EDGES, not PROVED. Only two missing children were observed. V rises5→7 and1→3, yet normalized occupancy falls63/102→39/2026 and15/30→27/2053642. The result falsifies an immediate-hit rule and cautions against treating across-group V/H changes as progress. Existing known h3/h103 witnesses remain known controls, not discoveries.

## Issues discovered and decisions

- Parent clarified per-seed reachability≤2actual edges, without reset at merged depth0seed. Implemented and tested; frontier from distance2 parent remains visible as uncomputed next step.
- Large-h arithmetic uses BigInt modular products throughout. H candidates are onlyS; quotient orders reduce h−1 through factor/power tests. No fullh scan.
- Primary packet invocation excludes inert import timing; approved fixed CLI starts before its dynamic import and has post-serialization guard. B wrapper counts source reads/receipt separately. No research-cap increase.
- Initial audit top-level await failed under the repository's CJS tsx mode; replaced with fixed async IIFE, preserving the dynamic import boundary. Real CLI then emitted bounded JSON normally.
- Initial focused lint/type snapshot caught one unused test type and an accidental string-arithmetic test line; both removed. Tests initially14PASS; final additions16PASS and final lint/type clean. No product safety guard was weakened.
- Candidate contradiction error retains a bounded exact node and exit1 diagnostic. Only a unit injection exercised it; no actual theorem contradiction was observed.
- A later composite3q response to1mod4 blockers is a written proposed next gate only; no fallback/depth/input expansion occurred.

## Frozen source hashes

```text
46067b52a11cf7aa6a5335ebaafaf87bf5a8c312bebf1d46f3af6c4acf0dbb40  scripts/operations/factor-transfer-partitions.ts
b57bee55f2755c994f485683d3b341a0c1f4831f96053a303204825a16770cd1  scripts/operations/factor-transfer-audit.ts
6b3e99aca8669fd67e2fcd8f50bc266347e0519dc0ea2177f6f1fe6fdcad3d75  tests/unit/factor-transfer-partitions.test.ts
```

## Deviations / suggestions

No unapproved scope or architecture change. The CLI timing and two-hop-origin clarification were routed and approved. Source/test bytes are frozen for independent verification. Completion means the declared finite experiment and falsification machinery, not closure of the open root. Preserve blockers and C1 refutation as method constraints; adapt to the obstruction under a new preregistered proof/experiment rather than posthoc depth growth. Do not infer universal descent, optimum routing, novelty, held-out yield or root progress from two recovered known partitions. Separate tool/UI/agent admission, governed comparison, formalization and academic review remain deferred.
