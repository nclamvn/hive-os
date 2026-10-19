# Erdős 242: strict benchmark alignment and bounded replay

Status: local research-method checkpoint, 2026-10-01. **No proof of the open conjecture, no formal benchmark score, and no novelty claim.**

## Exact target and the gap closed

Epoch's FrontierMath Erdős entry and the public `Erdos242.erdos_242` Lean declaration quantify over every natural `n>2` and require `1≤x<y<z` with `4/n=1/x+1/y+1/z`. The older HIVE OS finite certificate checked only positive `n≥2` and the equality. It could accept, for example, `(n,x,y,z)=(4,3,3,3)`, which does **not** meet the benchmark's distinctness requirement. We preserve that historical identity checker and add a separate strict, versioned checker. Historical case contracts and digests are not relabeled.

## Elementary bridge for the fixed-A search family

Let `n>A≥3`, with `A` odd, `gcd(n,A)=1`, and `x=(n+A)/4` an integer. If positive `y,z` satisfy `4/n=1/x+1/y+1/z`, then, after possibly exchanging `y,z`, necessarily `x<y<z`.

Proof. Since `A<n`, we have `x<n/2`. If `y≤x`, then `1/x+1/y≥2/x>4/n`, impossible; similarly `z>x`. If `y=z`, subtracting `1/x` gives `A/(nx)=2/y`, so `Ay=2nx`. Because `A` is odd and coprime to `n`, it divides `x`. But `n=4x−A` then says `A|n`, contradicting `gcd(n,A)=1` with `A≥3`. Thus `y≠z`; order the two remaining denominators. ∎

For the local residual-prime survey, `n=p≡1 (mod 840)` is prime, `A∈{3,7,…,63}`, and `p≥841>A`, so the bridge applies to every emitted witness. This is a direct algebraic lemma about **valid witnesses**, not an existence theorem. Bradford's published divisor construction already covers the surrounding first-denominator method; the strict bridge is not presented as new mathematics.

## Independent finite replay

The existing TypeScript factor-pair search was run through `p≤200,000,000`. A new stdlib-only Python program independently reads the entire `--full` stream. It builds an odd-only prime sieve, checks every eligible prime appears exactly once and in order, recomputes the source manifest, then checks `n>2`, `x<y<z`, the exact integer cross-product, and `4x−n=A` for each tuple. It does **not** independently re-enumerate all factor pairs or prove that a reported `A` is minimal. The existing independent per-A Python auditor separately replays the hard prime below.

| Declared domain | Eligible primes | Strict positive witnesses | Unresolved within A bound |
| --- | ---: | ---: | ---: |
| `p≡1 (mod 840), p≤10^8, A≤59` | 30,061 | 30,061 | 0 |
| `p≡1 (mod 840), p≤2·10^8, A≤63` | 57,840 | 57,840 | 0 |

For the larger run, source manifest SHA-256 is `61e4eaa91f55bb7215a74e07f4bfce867dd56cc009b7a3d76281f02a17f1b7a0`; the auditor's ordered strict-witness SHA-256 is `95ba5d985e2f547e2db38413538ae28428df0e7acc947c773da28929242591e9`. The `A≤59` scan through the same `2·10^8` domain has exactly one unresolved prime *in this denominator family*: `p=171,348,241` (manifest `4a69d160883d32d1747bf4b4a1e59d79a575f7465aa7f5cf0db22cd7dfa7476c`). The separate Python factor-pair auditor checks primality, exhausts all `A=3,7,…,59` for this `p` with zero admissible pairs, then finds five admissible pairs at `A=63`. Its first strict tuple is

`(p,x,y,z)=(171348241,42837076,116508851145768,12576201189769349676475494216)`.

Thus the auxiliary universal **fixed-family** assertion `A≤59` is false. The prime above has a valid strict Erdős 242 decomposition at `A=63`; it is not a counterexample to Erdős–Straus. The `A≤63` result is a finite observation and must not be generalized to unbounded `p`.

Reproduce locally (the full-range replay uses roughly 100 MB for its independent odd-prime sieve):

```sh
node --import tsx scripts/operations/erdos-straus-residual-survey.ts --limit=200000000 --max-a=63 --full | python3 scripts/operations/verify-erdos242-strict.py
node --import tsx scripts/operations/erdos-straus-residual-survey.ts --limit=200000000 --max-a=59
python3 scripts/operations/verify-residual-counterexample.py 171348241 --max-a=63
npx vitest run --project unit tests/unit/math-certificates.test.ts
```

## Scientific boundary and next attack

This corrects a target-contract mismatch and yields a replayable finite baseline for the **public strict wording**. It is not an official Epoch evaluation: Epoch requires an accepted Lean proof/disproof of the full declaration, not a finite witness collection. Salez's published computation already reaches much farther for the original conjecture, so no record or literature novelty is asserted here. The high-value next obligation is an unbounded structural statement about primes whose early fixed-A gates all close, with a written proof, counterexample probe before AI acceptance, primary-literature comparison, and a faithful Lean target/alignment review. Do not recycle a constant `A≤63` conjecture merely from this scan.

Primary scope references: [Epoch benchmark](https://epoch.ai/benchmarks/frontiermath-erdos), [Erdos242 Lean source](https://github.com/google-deepmind/formal-conjectures/blob/main/FormalConjectures/ErdosProblems/242.lean), [Bradford 2025](https://math.colgate.edu/~integers/z54/z54.pdf), [Salez 2014](https://arxiv.org/abs/1406.6307).
