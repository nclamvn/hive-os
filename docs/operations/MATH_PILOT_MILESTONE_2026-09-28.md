# Math Pilot research-method milestone — 2026-09-28

## Claim ledger

| Level | Claim | Evidence | Status |
| --- | --- | --- | --- |
| Exact finite identity | `4/n = 1/x + 1/y + 1/z` for each emitted tuple | Independent BigInt cross-product check and SHA-256 tuple digest | Checked for emitted tuples |
| Bounded survey | For every prime `p ≡ 1 (mod 840)` with `p ≤ 10,000,000`, this implementation finds a tuple with `x=(p+A)/4`, `A ∈ {3,7,…,47}` | Exhaustive prime and factor-pair enumeration, manifest digest below | Reproducible computational result, not peer-certified |
| Bounded-A hypothesis | Every prime `p ≡ 1 (mod 840)` has a solution in the first-denominator family with `A≤47` | Exact negative certificate at `p=10,051,441`, checked by independent Python implementation | **Refuted for this restricted family**; Erdős–Straus itself is not refuted |
| Universal conjecture | Every integer `n ≥ 2` has a decomposition | No finite search can establish this | Open; not claimed |
| Novelty | The finite bound or a divisor criterion is new | Current curated corpus and Crossref metadata are incomplete | Not claimed |

## Exact method and completeness within the declared family

For `p ≡ 1 (mod 4)`, set `x=(p+A)/4` for `A ≡ 3 (mod 4)`. With `B=px`, the remaining equation is `1/y + 1/z = A/B`. Rearrangement gives `(Ay−B)(Az−B)=B²`. For `y≤z`, put `d=Ay−B`; then `d` is a positive divisor of `B²` with `d≤B`, and both `B+d` and `B+B²/d` must be divisible by `A`. Conversely every such divisor produces positive integers `y,z` satisfying the equation. The survey factors `p` and `x` by trial division, enumerates every divisor of `B²`, applies both congruence tests, and separately checks the final cross-product using BigInt. Primality of each candidate is checked by trial division through its square root. This proves the *search is exhaustive for the stated first-denominator family and bounds*, not that all positive solutions or unbounded primes are covered.

Reproduce:

```sh
npm run math-pilot:residual-survey -- --limit=10000000 --max-a=107
npm run math-pilot:residual-survey -- --limit=10000000 --max-a=107 --full
```

The second command emits every per-prime record. The SHA-256 manifest hashes JSON of `{methodVersion,limit,maxA,records}` in ascending `p` order. `methodVersion=ERDOS_STRAUS_RESIDUAL_SURVEY_V1`; manifest digest: `1390d71ada2ff589c51d15e2ce5260057bcde87df74a8480530911cbbcf2ff5a`.

## Observed finite milestone

There are 3,426 primes in the declared domain. All 3,426 have a certificate by `A≤47`; 0 remain unresolved through `A≤107`. The first successful `A` distribution is:

| A | 3 | 7 | 11 | 15 | 19 | 23 | 27 | 31 | 35 | 39 | 43 | 47 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Count | 1481 | 764 | 694 | 168 | 167 | 95 | 20 | 24 | 3 | 5 | 1 | 4 |

The four cases whose first successful `A` in this family is 47 are `526681`, `1071841`, `1915201`, and `7559161`. Their exact tuples are emitted by the `--full` run. These show the tail of the finite baseline; the `A≤47` pattern does **not** continue to all primes.

Example certificate at the smallest case requiring `A>7`: `p=2521`, `A=23`, `(x,y,z)=(636,69748,131876031)`. A separate direct-`y` scan in unit tests confirms no earlier `A` in the bounded family for this case; the factor-pair algorithm and direct scan are different implementations.

## Falsification milestone for the auxiliary bound

The next prime in this residue class requiring a larger tested `A` is `p=10,051,441` (the 3,447th such prime in the ascending scan). It is prime by trial division and `p mod 840 = 1`. For each `A=3,7,…,47`, an independent stdlib-only Python checker factors `B=p(p+A)/4`, enumerates every divisor `d≤B` of `B²`, and finds zero pairs satisfying both congruences. It also finds zero pairs for `A=51,55`. At `A=59` it finds one pair, yielding `x=2,512,875`, `y=429,699,102,750`, `z=115,176,547,501,110`; the cross-product identity passes exactly. Thus this **refutes only the auxiliary universal claim with `A≤47`**, not the original conjecture: this same prime has a positive solution.

Reproduce the independent audit:

```sh
python3 scripts/operations/verify-residual-counterexample.py 10051441 --max-a=59
npm run math-pilot:residual-survey -- --limit=10051441 --max-a=47
```

The second command hashes all 3,447 prime records, with exactly one unresolved *within the A≤47 family*: `3b52b52e8e8bf332ea7d3f0078a4948fba98c7535b1a1285d8f8184ff7614bc5`. This scan establishes "first" only inside its declared ascending range, not a global minimality claim for other denominator families. The Python audit independently checks this prime's negative certificate, but a third-party formal proof/kernel review of both programs and machine execution has not occurred; do not call the result peer-certified or new to the literature.

In the separately checked interval `10,000,000 < p ≤ 20,000,000`, the TypeScript scan found exactly two primes unresolved **within A≤47**: `10,051,441` and `16,467,361` (manifest for all primes through `20,000,000` at `maxA=47`: `317664aa6e042fad55a4e21ad8958a9c7dd7119a8d7ad1a319ca77a12393b313`). The independent Python checker confirms the second has no admissible pair through `A=47`, while `A=55` gives `(x,y,z)=(4116854,1232613109371,6373535904238248338334)`. Neither is a counterexample to the original equation.

## Live browser E2E and architectural finding

The new OPEN case `406a9816-ebe2-45f7-945d-00daa75d4758` tested the universal `A≤47` auxiliary claim in the local Math Pilot. The subscription-backed solver retained one typed tuple at `p=2521`; the UI displayed `EXACT_IDENTITY` and its digest, while the two AI reviewers gave the universal claim `INCONCLUSIVE`. Its controlled cycle `611e2e2d-54e8-4e45-b631-9792445b4e63` independently proposed precisely the finite interval `10^7<p≤2·10^7`, passed the source/scope gate only as `RESEARCH_ONLY`, and asked for exhaustive factor-pair checking. The solver had no computation tool, returned `INCONCLUSIVE` with no tuple, and the ledger correctly recorded `CERTIFICATE_CHECKED` with an empty check list. The round stopped at `ROUND_LIMIT` after seven calls and 126,940 observed tokens; the observed-token threshold is checked between calls, so overshoot of the selected 120,000 threshold is permitted by the current contract.

The independent exact harness refutes that cycle's finite hypothesis with the two primes above. This is a **procedural gap**, not a false mathematical conclusion by the AI: its output was candidly inconclusive. The next implementation gate is a typed computation plan emitted by the planner, verified against the sealed task, executed by a bounded local oracle, and retained as a digest-checked event *before* solver/critic calls. Do not patch the immutable historical cycle or silently inject a result into its model output. An LLM-only loop cannot be considered a closed mathematical research procedure while exact tools remain out-of-band.

## Procedure upgrade and limits

- Solver output can include at most four typed decimal witness tuples. They remain part of the digest-bound model attempt. The UI shows exact acceptance or rejection; it never labels the argument a proof because of a passing tuple.
- A research-loop round now appends `CERTIFICATE_CHECKED` after `ATTEMPTED`. Trace validation recomputes every result against the retained attempt and rejects a digest-consistent but mathematically false certificate. Old immutable rounds without this event remain readable.
- A model-supplied tuple is not an independent literature source. Curated sources and two separate model contexts remain necessary for claim review; they do not establish completeness of prior art or substitute for an external mathematical referee.
- The local survey uses no paid API, external service or floating-point arithmetic for the identity. The current implementation caps `p≤10^8` and `A≤107`; the published baseline above uses `p≤10^7`. It does not run general theorem proving.

Primary comparison sources: [López 2024, residual classes](https://arxiv.org/html/2404.01508v3); [Bhattacharjee 2026 preprint, conditional divisor criteria](https://www.researchgate.net/publication/405220221_Erdos--Straus_Decompositions); [Mihnea & Dumitru 2025, much larger finite verification claim](https://arxiv.org/abs/2509.00128). These are scope checks, not endorsements or a novelty certificate. In particular, a separate author's much larger finite verification means our `10^7` computation cannot be presented as a first verification of the conjecture.

## Next research gate

Before claiming a theorem-level milestone: use the `p=10,051,441` counterexample to revise or abandon the `A≤47` hypothesis, identify a defensible narrower infinite subclass or asymptotic question, find full-text primary literature with exact quantifiers, and have an independent proof checker or human referee audit every universal inference. Preserve counterexample-search bounds and failed branches in the ledger. If these gates are not met, the honest disposition is *computational baseline, falsified auxiliary hypothesis, and open proof obligation*.

## Follow-on bounded milestone: 100 million, 28 September 2026

The post-E2E method correction is implemented for **new** cycles. A planner may emit a typed `ERDOS_STRAUS_RESIDUAL_A` plan, with `840≤lowerExclusive<upperInclusive≤10^8`, interval width at most `2·10^7`, and `A∈{3,7,…,107}`. The independent-context verifier must compare that plan to the task. The kernel rejects unsupported roots and invalid bounds, computes the finite interval without model-supplied code, records a `COMPUTED` event before solver dispatch, and passes the same scoped data to solver, critic and adversary. Trace reading recomputes the entire interval and rejects a false computation even if its hash-chain digest was recreated. The event states prime count, failures *within the A-bound*, first failure, a possible larger-A rescue, and a SHA-256 per-prime manifest. It cannot certify an infinite statement, novelty, or mathematical peer review. The older live cycle was **not** rewritten; a new root case is needed for a live subscription-backed run of this path.

The separate command-line survey was extended to its already-declared cap:

Replaying the historical planner's selected `10,000,000<p≤20,000,000`, `A≤47` plan through the new typed oracle yields 3,130 eligible primes, two bounded-family failures, first failure `p=10,051,441`, rescue at `A=59`, and interval manifest `a2bfb3c393c3a43e43b1ca11f908ac6c5f462a2cd13aaa37bae42ec4bd502e2d`. This is a deterministic replay **outside** the old immutable cycle, not a newly retained live `COMPUTED` event.

```sh
npm run math-pilot:residual-survey -- --limit=100000000 --max-a=47
npm run math-pilot:residual-survey -- --limit=100000000 --max-a=59
```

For all **30,061** primes `p≡1 (mod 840)` with `p≤10^8`, this exact implementation found a tuple in the declared `x=(p+A)/4` family with `A≤59`. The `A≤59` manifest is `5f52ba2de27d2e63d58ec93c5602010edc69e563a088e435569ce14f6d435c16`; the `A≤47` manifest is `e503a9eecf666c5e42b2c8aba53afc42e74347aaf3dac0e971ab467f5e5645fd`. An independent stdlib Python sieve separately counted 30,061 primes in this residue class. The TypeScript survey verifies the exact integer identity of every emitted tuple.

The new in-cycle oracle separately replayed the complete range as five non-overlapping ≤20-million plans: prime counts `6556, 6120, 5905, 5768, 5712`, each with zero `A≤59` failures, summing to 30,061. Its five manifest digests, in interval order, are `39b2232360282bac24206202aea05ed2706676e3803668c389faa85bbb18a5f8`, `a57309a23aed334a4b1314eee02e52d6572869b4b7699e4ccb1dd0b7f4272836`, `6a3a9a0ec1134d99805a88237a1a482491613d5dfda108296ca0611bffb27c46`, `d63258895374f3887a1d283e83d608f8df67bbc9ae89e3fabbb7f5ed22ede9e9`, and `ece21dabc585152a7d2bac3af31392f6081ee504aef86bf28d5920d298ac7f10`. This cross-check uses a different calling/manifest path but shares the same core search routine; it is not an independent second algorithm.

Exactly seven of these 30,061 primes have no witness for `A≤47` **within this denominator family**. The separate Python factor-pair auditor checked every `A=3,7,…,59` for each of the seven and reproduced these first successful values:

| Prime `p` | First `A` in tested family |
| ---: | ---: |
| 10,051,441 | 59 |
| 16,467,361 | 55 |
| 32,794,441 | 59 |
| 54,720,961 | 55 |
| 55,653,361 | 55 |
| 74,290,441 | 51 |
| 99,078,841 | 55 |

The count distribution at the first successful `A` is `3:14149, 7:7000, 11:5556, 15:1326, 19:1141, 23:560, 27:132, 31:116, 35:15, 39:37, 43:5, 47:17, 51:1, 55:4, 59:2`; it sums to 30,061. This is a **finite computational baseline**, not a new theorem. A much larger finite verification of the original conjecture was already described by [Salez (2014)](https://arxiv.org/abs/1406.6307), so we make no novelty claim for the range. The seven-case independent audit does not independently reproduce every one of the 30,061 positive witnesses; a reproducible second full-range implementation and external proof review remain open gates.

Next mathematical target: understand why these seven cases escape `A≤47`, seek a rigorous *infinite* criterion for an explicitly stated subclass, and actively search beyond `10^8` for a counterexample to the new auxiliary `A≤59` bound. Until such work is checked, the product milestone is a functioning finite computation/AI-review handoff and a strictly bounded observation only.
