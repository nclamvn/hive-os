# TIP-038 B: independent factor-directed graph replay completion

2026-10-01. Builder: target_builder under Vibecode Kit v6.2.

STATUS: DONE within the approved standalone replay/checker scope, pending separate Contractor acceptance. Scientific ceiling: exact finite selected development graph, not an unbounded termination theorem, root solution, held-out benchmark, formal proof or novelty finding.

## Files and preserved boundaries

Created only:

- `scripts/operations/factor-transfer-replay.py`: stdlib-only independent primality/factorization, positive coprime divisor pairs, complete images/canonical tuples, candidate-S stabilizer, factor/power quotient orders and deterministic all-QNR-factor BFS.
- `scripts/operations/factor-transfer-check.ts`: bounded strict schemas, fixed seed/domain/resource arithmetic, full certificate/hash checks, atomic BFS prefix reconstruction, bounded reachability/cycle/progress reconstruction and invariant comparison.
- `scripts/operations/factor-transfer-replay.ts`: exact fixed-source-byte isolated Python adapter with truthful expected/observed/verified provenance and final observed receipt deadline.
- `tests/unit/factor-transfer-replay.test.ts`: 12 scenarios including actual replay, rehashed corruptions, graph semantics, BigInt precision and resource/process/serialization faults.
- This completion report.

No TIP-036/037 source/test/pin, app/UI, historical ledger, DB, worker, provider/model, dependency/schema, Git or deployment change by this Builder. Dirty work preserved. Read AGENTS, durable handoff, full frozen TIP-038 and Vibecode Kit/ref before implementation. Shared schema coordinated with Builder A before discovery; Python consumes neither TS factors/images nor graph records.

## Frozen experiment and measured result

The exact 13 ordered negative-character miss seeds from accepted TIP-037 content were fixed before execution. Every QNR factor is retained; q3mod4 generates a transfer, q1mod4 or q2 has a nonintegral-shift blocker. Hits stop expansion. Unique initial seeds have depth0; first-discovery BFS with factors ascending computes depths0,1,2 only. No fallback shift, new seed or deeper exploration was added after outcomes.

Fresh independent source-pinned replay agrees on **17 computed nodes**, **15 records** (4 transfers, 11 blockers), **2 hit nodes**, all full images/strict canonical witnesses/QNR factors/H/n/V/quotient orders, exact graph and progress summaries. There are **no actual frontier records, revisits or directed cycles in this fixed graph**; this is not a general acyclicity/closure assertion. Two of 13 seed branches reach a hit within their actual two-transfer distance. The other 11 have no hit in the declared computed graph, not a root impossibility result.

| Seed path | Result | Canonical strictly increasing denominators |
| --- | --- | --- |
| p200656681: h71 -> h239 | HIT at one transfer | 50164230, 42140310890172, 73815777909284620 |
| p131433121: h31 -> h2053643 -> h103 | HIT at two transfers | 32858306, 52424203240786, 209433815288023 |

These are alternative witnesses for already covered targets, not new overall prime coverage or minimal-denominator claims. The known h3 baseline and character-positive successes are not erased by the selected negative-character seeds.

C1 is **REFUTED** by the first computed disproving edge `r9`, p200656681,h103 -> h2027: the child still misses. It has `T=3^6*68813`, image size39, H={1}, n2026 and visible mass7, then factor68813 has a nonintegral-shift blocker. Old p131433121,h31 -> h2053643 also lands at a miss: image size27, H={1}, n2053642, visible mass3, then factor103 gives a hit. C2 and C3 are **NO_REFUTATION_IN_COMPUTED_EDGES**, across only the two missing-child edges. They are not PROVED, empirical universal invariants or termination measures. No claim is inferred by comparing occupancy or H cardinalities across different groups.

Stable content digest:

`952de09e31ded70c7f9f498a6ca9933ba3ca70c404f194712b491dbf00eb9bc4`

Graph digest:

`26ee68f8dedc2c62cd4065eeb864c5551a927923e2a1b4b17b87246274dfe90a`

Final independent Python source pin:

`19fd4294c0b5ace65936a918858a62418eb519559392347237d7e6bc186d64f7`

Final actual fresh run: primary12ms, independent Python18ms, total replay receipt88ms, output28,171bytes. Python examined8,076 ordered divisor pairs and counted6,252 additional bounded work steps. Work counts are implementation-specific (binary-power iterations, stabilizer membership products and accepted pair-residue work), not an operation-by-operation speed comparison with TS. Runtime/output/packet hashes vary; content and graph invariants remain stable. Local observations are not SLO or model-resource/scientific-yield measurements.

## Requirement/acceptance coverage

| Requirement | B coverage | Evidence |
| --- | --- | --- |
| R01 | Replay share PASS; written proof separately owned | Exact eligible prime factors/negative character, q<=T<p and q!=h checked. No false h descent or strict q<T assumption; repeated valuations and unused mass retained. |
| R02 | PASS | All 13 fixed seeds, deterministic all-factor atomic BFS/dedup/hit stopping/depth boundary, explicit blockers/frontier/revisits and actual directed cycle witnesses. |
| R03 | PASS | Every full node image and canonical strict Type-II tuple reproduced independently; exact first C1 refutation and truthful finite C2/C3 status reconstructed. |
| R04 | PASS | Fixed verified-source execution, full graph invariant agreement, rehashed field/scope/resource attacks, exact partial-prefix and late serialization/receipt/process/source controls. |
| R05 | B report supplied | Quantified focused tests, owned lint and full typecheck, stable digests and honest scientific/provenance limits. Separate whole-repository/skeptical/Contractor acceptance remains separately owned. |

Final own checks at20:36:28+07: **12/12 tests**, one file,1.43s total. Owned ESLint **0 errors/0 warnings**; full `npx tsc --noEmit --pretty false` **0 errors**. No integration DB, production build or browser/model campaign run by this Builder.

Failure history retained: the first focused run was11/12 because the mutation harness attempted to derive a normal summary from its deliberately dangling target edge before invoking the validator. The harness now retains the old summary while rehashing those corruptions; production validation already rejects them fail-closed. Next run12/12 exposed one lint-only `prefer-const` finding for an unchanged modulus, repaired. Final run12/12/lint0/type0. Contractor's earlier whole-lint observation of that same finding predates this freeze, not hidden as a successful run.

```sh
npx vitest run --project unit tests/unit/factor-transfer-replay.test.ts
npx eslint scripts/operations/factor-transfer-check.ts scripts/operations/factor-transfer-replay.ts tests/unit/factor-transfer-replay.test.ts
npx tsc --noEmit --pretty false
node --import tsx -e 'const a=require("./scripts/operations/factor-transfer-partitions.ts");const b=require("./scripts/operations/factor-transfer-replay.ts");const r=b.replayFactorTransfer(a.factorTransferPacket());console.log(JSON.stringify({...r,replay:r.replay?{status:r.replay.status,contentDigest:r.replay.contentDigest,graphDigest:r.replay.graphDigest,nodes:r.replay.nodes.length,records:r.replay.records.length,progress:r.replay.progress,runtime:r.replay.runtime}:null}));'
```

## Exact prefix, graph and resource semantics

1. Actual computed nodes, not queued descriptors, bind `targetComputed`/`toDepth`. Records are numbered in source node BFS order and prime-factor order. A PARTIAL retains an atomic completed node/record prefix and the precise next NODE(id), FACTOR(id,q), or FINALIZE. Output limiting trims at traversal action boundaries, not independent node/record slices. Reachability complete=false globally on partials; complete=true means only the declared finite graph was fully executed.
2. Each seed's hit paths contain at most two actual edges. Merging another depth0 seed never resets distance. DEPTH_LIMIT records from every bounded-reachable parent, including a parent at distance2, remain explicit **outside-depth frontier information**. Their uncomputed children cannot count as reachable hits or counterexamples. Synthetic controls cover merged-seed three-edge paths and outer frontiers without pretending those abstract edges are admitted arithmetic transfers.
3. Revisit is not synonymous with cycle. Cycles are canonical DFS backedge closed paths in computed node/edge order, including closing repeated node and matching edge IDs. This lists actual chosen cycle witnesses, not all simple cycles or an unbounded process classification. Synthetic revisit-without-cycle and directed-cycle controls are separately tested.
4. Full images come from ordered positive coprime divisor pairs with uv|T; canonical u<=v is numeric lexicographic. H candidates are restricted to S because1 belongs to S; no silent all-h scan. Quotient order is computed by independent factoring of h-1 and reduction via powers landing in H, not a linear scan up to h. Checker modular multiplication/powering uses BigInt across admitted h<p<=201M, with a precision control beyond Number-product safety. Stabilizer checking reuses one image array, avoiding repeated whole-image allocations outside the work counter.
5. Per-implementation limits:60 monotonic seconds,256 nodes,1,000 records,2M primary states,50M independent pairs,50M additional work steps,2MiB output. Guarded phases include factorization/pairs/H/order, graph finalization, hash/serialization and actual stdout serialization. Final observed wrapper checkpoint includes source/validation/child/JSON/full comparison/receipt construction and downgrades PASS elapsed>=60,000ms. Synchronous JS and OS writes are not hard-preempted by these checkpoints; the child has an actual timeout. No partial result is PASS.
6. Adapter executes only the exact pinned bytes with `python3 -I -S -B -c`; fixed file path, no caller/model executable/code/argument authority. Child env is only PATH, NODE_ENV=test and Python bytecode-disable. PATH selection is not Python-binary attestation. Source and output hashes give integrity/provenance under the trusted collector, not externally signed/authenticated campaign receipts. Supplied matching JSON alone is not a fresh independent execution.
7. Scoped validator verifies certificates against the supplied image and reconstructs all graph actions/summaries; it alone does not certify full image reachability or canonical minimality. Fresh independent comparison supports those finite claims. An injected contradiction retains the hashed offending node in bounded non-COMPLETE INVESTIGATION JSON and exits1; no automatic scientific-refutation authority. No actual defect/proof contradiction was found.

Tests include fixed seeds/depth/digest, fabricated QNR2, exact factor/character/H/quotient/mass mutations, strict tuples, wrong child/disposition/computed status, missing blockers, fabricated progress/cycle/frontier/reachability, work/pair/time overshoot, exact node/factor partials, first/internal/midpoint/finalization/serialization expiry, metadata/output cap, source drift/missingIO, missing Python/process timeout, malformed/oversized output and final receipt expiry. Heavy rehash scenarios have narrow30s test allowances only; production caps are unchanged.

## Issues, deviations and suggestions

No open implementation finding within B's owned scope at freeze. The per-seed reachability clarification and outside-depth frontier meaning were explicitly coordinated with Contractor/Builder A; actual invariant content unchanged. No new execution inputs, root, dependency or scope expansion.

Known coprime divisor, reciprocity and Kneser mechanisms remain prior art; theoretical/literature comparison is separately owned. C1's falsification rules out a shortcut, not the original conjecture. Useful next work needs a justified bridge through blockers/stalls or a genuinely well-founded invariant, not declaring C2/C3 universal from two edges. Formal/expert/novelty/root acceptance, authoritative agent-cycle integration, UI, live comparator and public claims remain separate gates.
