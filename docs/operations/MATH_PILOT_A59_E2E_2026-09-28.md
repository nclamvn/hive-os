# Math Pilot A≤59 browser E2E and next attack — 2026-09-28

## Result, origin, and limits

This was a live browser-created HIVE OS case and one controlled Codex-local
research round, not a paid API run. An exploratory independent screen **before**
the browser run suggested the interval `160,000,000 < n ≤ 180,000,000`.
The root contract gave the agent that interval but **not** the candidate prime
or its outcome. The agent proposed the matching exact bounded survey; the
source/scope gate admitted research only, and a separate context accepted the
task. The deterministic product survey checked 5,483 primes `n ≡ 1 (mod 840)`
and found exactly one with no witness for
`x=(n+A)/4`, `A ∈ {3,7,…,59}`: `n=171,348,241`.

This **refutes the auxiliary universal A≤59 bound**, provided the finite
arithmetic audit is reproduced. It does **not** refute Erdős–Straus: at `A=63`
the exact positive-integer witness is

```
n = 171348241
x = 42837076
y = 116508851145768
z = 12576201189769349676475494216
```

The corresponding integer identity
`4xyz = n(xy+xz+yz)` checks exactly. The product's model-authored solver and
two AI reviewers did not certify the finite exclusion from the summary/digest
alone. Both reviewers remained `INCONCLUSIVE`, specifically requesting
primality and per-A factor-pair exclusion evidence. This is an evidence
presentation and verification gap; neither AI agreement nor AI disagreement
replaces arithmetic proof.

## Browser-to-ledger trace

- UI: <http://localhost:3000/w/mathematics-pilot-lab-156de0/research/math-pilot?missionId=31943653-4a30-462a-af11-ecd99f9ebfa2>
- Root case: `1fd46308-6970-4d8e-acaa-4469342da7c8`.
- Frozen contract digest:
  `5738383b439912f05fdb79dc8fb3bbdf72be52c41a6cce9dc35777b66bf2e2f5`.
- Controlled cycle: `59eafcfc-4a18-4fa4-ad54-726024c55170`.
- Product `COMPUTED` event, sequence 12: 5,483 eligible primes, one A≤59
  failure, first failure `171348241`, first rescue `A=63`. Product manifest
  digest: `7e7f6fbbf624306116b9cbfc6dad7e6ba5ad107400cafed591f3fc35a6aa8f4a`.
- One round, seven of seven calls, 21 retained events, stopped `ROUND_LIMIT`.
  Observed Codex-session tokens: 126,628 against a 120,000 threshold; the
  threshold is checked between calls, so a final call may cross it. Final
  event-chain digest:
  `9ab90d482296fa64c383a39c5317a02d665af42082c4b3ad135eecbd14e07f74`.
- Browser screenshot: `artifacts/math-pilot-a59-e2e-2026-09-28.jpg`.

## Independent finite audit

The stdlib-only Python checker does not import the product's TypeScript code.
It trial-divides for primality, factors each first denominator, enumerates
factor pairs of `(nx)^2`, and checks both residue conditions modulo every A.

```sh
python3 scripts/operations/verify-residual-interval-independent.py \
  --lower-exclusive=160000000 --upper-inclusive=180000000 --max-a=59
python3 scripts/operations/verify-residual-counterexample.py 171348241 --max-a=63
```

The first audit independently returns `primeCount=5483`, `failureCount=1`,
`failurePrimes=[171348241]`, manifest SHA-256
`9e86abcc3480fb80cfc5bb85dcdd4ff46c0c71fbfbacd17b3f5eb7b54a331625`.
The digest differs from the product because the manifest serialization differs.
The second checker finds zero admissible factor pairs separately for all 15
values `A=3,7,…,59`; the first successful A is 63, with five admissible pairs
and the witness above. Each factorization and divisor count is printed, making
the finite exclusion reproducible.

There is also a short independent primality certificate for the candidate:
`171348241−1 = 2^4·3·5·7·29·3517`, where `3517` is prime by trial division
through 59. With base `a=17`, `a^(n−1) ≡ 1 (mod n)`. For the distinct prime
factors `q=(2,3,5,7,29,3517)`, the respective residues
`a^((n−1)/q) mod n` are
`(171348240,103351060,108151137,164580047,118018655,16688102)`;
each `gcd(residue−1,n)` is 1. The fully factored `n−1` and these congruences
give a Lucas primality certificate, independent of the interval enumeration.

A **separate, broader offline audit**, not the browser cycle, covered
`100,000,000 < n ≤ 200,000,000`: 27,779 eligible primes and the same sole
A≤59 failure. Its independent manifest SHA-256 is
`06f55df422143998fccc9eb2a5fa0648fb9b4a423df799a83e8f9c553b4989e2`.
This remains finite evidence, not an unbounded statement.

## Structural attack beyond a single prime

The `A=63`, `d=68` rescue witness suggests a parametric identity. Let

```
t ≥ 0,
n = 73921 + 85680t,
q = 272 + 315t,
u = nq,
x = 68q,
y = 68(u+1)/63,
z = uy.
```

Here `n+63=272q=4x`, `n ≡ 1 (mod 840)`, and
`n ≡ 22 (mod 63)`, `q ≡ 20 (mod 63)`, so `u ≡ −1 (mod 63)`;
therefore `y,z` are positive integers. Furthermore,

```
4/n − 1/x = 63/(68nq) = 63/(68u)
1/y + 1/z = (u+1)/(uy) = 63/(68u).
```

Thus the displayed decomposition holds for **every integer** `t≥0`, without
assuming primality. `t=1999` gives the prime `171348241` and exactly the
finite rescue witness. Since `gcd(73921,85680)=1`, Dirichlet's theorem also
guarantees infinitely many primes in this progression; this is a corollary of
a standard theorem, not a literature novelty claim. See the [MIT 18.785
lecture notes](https://ocw.mit.edu/courses/18-785-number-theory-i-fall-2021/mit18_785f21_full_lec.pdf)
for the theorem statement. A full prior-art review for this specific formula
has **not** been performed.

The promising research question is *not* whether that progression has
A=63 solutions (it does), but whether a mathematically characterized
infinite subfamily can be proven to **require A>59**. A single failed prime,
or a finite survey, cannot establish that. Any such claim needs a modular or
descent argument excluding all 15 smaller A values uniformly, with a separate
literature and independent-proof review.

## Engineering gate exposed by the E2E

The next product improvement is to retain and show a compact, replayable
per-A exclusion artifact beside the computed digest: primality certificate,
factorizations of each `nx`, divisor-pair count, zero admissible pairs, and
the exact verifier version/algorithm. A second implementation should check
that artifact before the AI reviewers see it. The UI should then distinguish
`COMPUTED_AND_INDEPENDENTLY_REPLAYED` from AI acceptance, and continue to forbid
theorem/novelty claims from either. No billing, remote deployment, or paid
provider is implicated in this local E2E.
