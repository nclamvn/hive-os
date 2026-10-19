# TIP-037 B: independent character-shift replay completion

Date: 2026-10-01. Builder: target_builder under Vibecode Kit v6.2.

STATUS: DONE within the approved standalone replay/checker scope, pending separate Contractor acceptance. Scientific ceiling: exact finite public development arithmetic, not a root proof, official benchmark, formal proof, authenticated campaign receipt or novelty certificate.

## Files created and ownership

- `scripts/operations/character-shift-replay.py`: fixed stdlib-only independent primality, positive-divisor scan, recovered prime valuations, ordered coprime divisor-pair image/canonical enumeration and direct stabilizer/quotient calculations.
- `scripts/operations/character-shift-check.ts`: bounded strict schemas, frozen domain/limits, exact character/routing and miss-defect arithmetic, hash and strict-tuple verification plus finite invariant comparison.
- `scripts/operations/character-shift-replay.ts`: fixed source-pinned adapter executing exactly verified bytes with isolated Python flags and allowlisted environment. Expected, observed and verified source provenance remain distinct.
- `tests/unit/character-shift-replay.test.ts`: 10 focused scenarios with actual full replay and rehashed/resource/process/late-receipt faults.
- This completion report.

No TIP-036 source/pin, product app/page, historical ledger, DB, worker, model/provider, dependency/schema, Git or deployment changes by this Builder. Existing dirty work remains preserved.

## Frozen inputs and actual replay

Before execution the approved target order was `[200023321,200602081,200656681,131433121]`. The first three are selected exposed TIP-036 menu misses; the fourth is an old exposed control. This is **development data**, not held-out evaluation. The entire independently prime-checked pool is `[3,7,11,19,23,31,43,47,59,67,71,79,83,103,107]`: every prime h=3 mod4 through 107, including nonsafe primes. No input or bound was expanded after observing outcomes.

Fresh primary signed-image DP and fixed independent positive coprime divisor-pair replay agree on all **60 complete rows**, full sorted residue images, exact prime valuations, canonical numeric lexicographic `(u,v)` with `u<=v`, strict Type-II identities, character preference, exact H/visible valuation/quotient-order certificates and routing summaries. The replay inspected **30,512 ordered divisor-pair candidates**, under the 50-million cap. There are **11 hit rows and 49 miss rows**, not 11 new roots or new overall coverage. Five hit rows have positive character: prioritizing negative character does **not** imply that excluded positive-character rows are impossible.

| Target p | Smallest successful full-pool h | Smallest successful preferred h | Hit rows | Preferred hit rows |
| --- | --- | --- | --- | --- |
| 200023321 | 3 | 103 | 2 | 1 |
| 200602081 | 3 | 31 | 3 | 1 |
| 200656681 | 3 | 19 | 4 | 2 |
| 131433121 | 71 | 71 | 2 | 2 |

The first three have trivial h3 rescues outside the older safe-prime menu. This exposes an earlier menu omission, not a breakthrough. No superiority/yield/latency advantage of character preference is measured here.

At h31 the p200023321 and p131433121 negative-character misses independently have `H=[1,2,4,8,16]`, `|H|=5`, quotient index `n=6`, visible mass `V=1`, one visible residue 17 of quotient order 6, and image cardinality 15. Quotient order means the least positive d with `r^d in H`, **not** full multiplicative order. Repeated valuations count with multiplicity outside H; neutral factors and unused mass remain retained. These are T-only images, not the external N=pT five-of-six-coset scenario.

Stable invariant content SHA-256:

`a6e29476a065de13e0de34d64458579b96e74ec9da35196e74eac1275f4e767c`

Shift manifest SHA-256:

`0ba105aa0a26ab5b67d6e0f0dd861948755210a4ad76726c58a05b6207d03ada`

Final fixed Python source SHA-256:

`65ce7d5c3bab0a9e871baa9588987c1ad4b8a73814b8541910f2bed304830ca4`

Final actual run: primary 18 ms, Python arithmetic/sealing 57 ms, total replay receipt 142 ms, compact Python output 56,821 bytes. These are local observations, not an SLO, model resource observation or comparison of scientific performance. Runtime and packet/output hashes vary; shared `contentDigest` excludes implementation-specific resource counters/timings. The content is independent of the primary execution's factors and generated image.

## Requirement/acceptance evidence

| Requirement | B coverage | Evidence |
| --- | --- | --- |
| R01 | Replay share PASS; proof owned separately | All 49 misses satisfy independently recomputed index-even, index2mod4, conditional QNR index>=6, visible mass and quotient-order conditions. No claim that finite tests prove the general theorem. |
| R02 | PASS | Exact four-target/all-prime pool and complete matched control rows, including five QR successes; preferred/full minima remain distinct. |
| R03 | PASS | All strict canonical tuples and direct stabilizers/quotient orders; fully rehashed scope, domain, factor, character, subgroup, order, mass, identity, routing and pending-input controls. |
| R04 | PASS | Actual fresh full-row replay using pinned verified bytes; missing tool, source drift, process timeout/output overflow, parse failure and false invariant packets fail closed. Partial cannot PASS. |
| R05 | B report supplied | 10 focused tests, clean owned lint/full typecheck, exact manifests/provenance and scientific limits. Separate Contractor/skeptic acceptance remains separately owned. |

Self-check: `npx vitest run --project unit tests/unit/character-shift-replay.test.ts` passed **10/10**, one file, at 20:18:27+07, 1.64 seconds total. Owned ESLint passed **0 errors/0 warnings**. Full `npx tsc --noEmit --pretty false` passed **0 errors**. No integration DB, build or browser/model campaign run in this Builder slice. Initial and final local focused runs both passed; no failed arithmetic assertion was concealed.

Owned lint command:

```sh
npx eslint scripts/operations/character-shift-check.ts scripts/operations/character-shift-replay.ts tests/unit/character-shift-replay.test.ts
```

Actual fresh reproduction from repository root:

```sh
node --import tsx -e 'const a=require("./scripts/operations/character-shift-partitions.ts");const b=require("./scripts/operations/character-shift-replay.ts");const r=b.replayCharacterShiftPartitions(a.characterShiftPacket());console.log(JSON.stringify({...r,replay:r.replay?{status:r.replay.status,contentDigest:r.replay.contentDigest,routing:r.replay.routing,rows:r.replay.rows.length,runtime:r.replay.runtime}:null}));'
```

## Resource, provenance and diagnostic boundaries

1. Fixed caps are 60 monotonic seconds, 1,000 rows, 2 million primary states, 50 million independent pairs, and 2 MiB output. PARTIAL retains the completed ordered row prefix and exact next `(p,h)`; routing `complete=false` distinguishes not-yet-computed targets from complete no-hit targets. Finalization retains all 60 rows on late completion; it does not pretend that a partial packet is PASS.
2. Python deadlines cover discovery, divisor-pair scans, direct H/order computation, packet sealing/serialization and the final actual stdout-serialization checkpoint. Output overflow retains the largest exact prefix that fits; metadata-only overflow fails without an oversized packet. Wrapper deadlines include source reading, primary validation, child execution, parse/full comparison and final observed receipt checkpoint. The last elapsed check downgrades would-be PASS at >=60,000 ms. These are observed checkpoints and child timeout enforcement, not hard preemption of synchronous JavaScript or absolute OS scheduling guarantees.
3. Adapter runs `python3 -I -S -B -c` with **the verified source bytes**, never a mutable path reread or supplied code/arguments. Environment contains only PATH, fixed NODE_ENV=test and Python bytecode-disable. Local PATH executable selection is not Python-binary attestation. Hash equality and retained output hashes are provenance/integrity under the trusted local collector, not signed/authenticated external execution receipts.
4. Scoped validator reconstructs H and all fields from the supplied image but cannot establish full image reachability or canonical minimality by itself. Only actual fresh full independent comparison supports those finite claims. Supplied mutually matching JSON is not equivalent to executing the fixed replay.
5. An injected miss-condition contradiction retains its complete offending hashed row as non-COMPLETE `INVESTIGATION`, prints bounded JSON and exits 1. The wrapper cannot PASS that diagnostic. No actual mathematical contradiction was found. The diagnostic flags an arithmetic/proof/premise investigation, not automatic scientific refutation authority.
6. Tests include first/internal/midpoint/finalization interruptions, serialization-induced expiry, metadata/output cap, rehashed successful elapsed>=60s, final receipt crossing deadline, repeated prime valuations, unused mass, positive-character hits, nonsafe h31 stabilizer and quotient-order mutations. The large mutation scenario has its own bounded 30-second test allowance; production caps are unchanged.

## Issues, deviations and next boundary

No unresolved implementation finding within B's owned scope. The original row schema/inputs were coordinated with Builder A before execution; implementation choices are independent divisor enumeration and direct set stabilizer rather than DP or logs. No scope deviation or extra runtime dependency.

Written general-prime proof, skeptical theorem review and literature attribution are owned by the other research outputs. Known coprime divisor construction, Kneser-style machinery and earlier A19 overlap must remain credited. No novelty/formal/expert/root-bridge acceptance was manufactured. Source/menu/target choices are intentionally partial. Authoritative agent-cycle tool admission, product UI, live scientific comparator, held-out benchmark, unrestricted cross-shift existence and a root breakthrough remain separate gates.
