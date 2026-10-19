# Certified complete fixed-target two-core decisions

2026-10-01. This extends TIP-033C without changing its historical a1..4
packet, source pins or application search limits. Four targets ONLY, in the
normalized sufficient family `m=2^a*ell`, `a>=1`, odd prime ell exponent ONE.
This is not universal Erdős–Straus coverage or a novelty/formal certificate.

## Why a finite certificate covers every modulus in this subclass

The written criterion and tail proof in
`MATH_PILOT_TWO_CORE_TARGET_2026-10-01.md` give:

$$s=2^{a+2}\ell-1,\qquad
s\mid p+2^j\ \text{or}\ s\mid 2^jp+1,\quad 0\le j\le 2a+2,$$

and every eligible canonical residue is at least `3*2^a-1`. Consequently
only `3*2^a-1<=p` need testing. For each permitted exponent the checker
enumerates ALL divisors of completely certified criterion integers, retains
`s+1` divisible by `2^(a+2)`, and certifies whether the resulting odd ell is
prime. It imposes no ceiling on s or ell. A missing entry, incomplete product,
uncertified factor or unresolved candidate prevents COMPLETE, including a
negative result. The remaining infinite exponent tail is excluded by the
written bound, not by a computation at a guessed maximum.

Discovery uses bounded deterministic factor search. Neither checker trusts
its probable-prime filter. TypeScript verifies ascending recursive prime
dependencies; isolated stdlib Python traverses those dependencies recursively.
Every complete factorization has an exact integer product. The programs then
derive witnesses by different enumerations: signed exponent vectors versus
direct coprime integer-divisor pairs.

## Exact primality certificate argument

For `n>2`, completely factor `n-1=product(q^e)` into already certified primes.
For each distinct q the artifact supplies a base a with

$$a^{n-1}\equiv1\pmod n,\qquad
\gcd\bigl(a^{(n-1)/q}-1,n\bigr)=1.$$

Bases may differ between q. For any prime r dividing n the first condition
makes a a unit and gives `ord_r(a)|(n-1)`. The gcd condition gives
`ord_r(a) NOT dividing (n-1)/q`; hence the full q-power in n-1 divides
`ord_r(a)` and r-1. This holds for every q, so n-1 divides r-1, implying
r>=n. As r divides n, r=n; thus n is prime. The recursion terminates at2.
This elementary per-q gcd/order proof underlies the exact checker; the
[Mathlib Lucas theorem](https://leanprover-community.github.io/mathlib4_docs/Mathlib/NumberTheory/LucasPrimality.html)
documents the standard related single-base order criterion. No Lean theorem
was compiled or semantic alignment attested for this artifact.

## Complete results

| Fixed p | Tested a | All eligible (a, ell, s) | Infinite tail starts |
|---:|---|---|---|
| 131433121 | 1..25 | (1,20551,164407), (3,391753,12536095) | a26, min residue201326591 |
| 159727681 | 1..25 | (2,71,1135), (2,313,5007) | a26, min residue201326591 |
| 351121 | 1..16 | (1,11,87), (2,3,47), (2,73,1167), (2,401,6415), (2,467,7471), (3,1009,32287), (4,3,191), (5,59,7551) | a17, min residue393215 |
| 171348241 | 1..25 | (1,61,487), (5,23,2943), (7,7,3583) | a26, min residue201326591 |

388 kind/j entries comprise384 distinct criterion integers;54 candidate-ell
decisions and1185 recursive prime nodes are checked. Unresolved inputs: ZERO.
All15 construction witnesses pass strict positive ordered integer identity and
exactly two p-divisible denominators. They yield14 distinct denominator tuples:
the p351121 constructions at a1/ell11 and a3/ell1009 share one tuple.

The three additional moduli beyond a4 give:

- p351121, a5/ell59/s7551: `(87792,662916448,61651229664)`.
- p171348241, a5/ell23/s2943: `(42851616,126112305376,10554914224310718)`.
- p171348241, a7/ell7/s3583: `(42849016,153528023936,16781950903270528)`.

For the two hard targets, **no additional hits at a>4** is now a certified
complete decision in this subclass, rather than an uncomputed tail. Their
previous mixed-core witnesses remain valid, so this is not a root exclusion.
No best-denominator or globally minimum-modulus conclusion follows.

## Reproduction and provenance

```text
node --import tsx scripts/operations/certified-two-core-audit.ts
python3 -I -S -B scripts/operations/certified-two-core-replay.py
```

The fixed loader checks artifact bytes, and the wrapper checks the fixed Python
source before execution (30s timeout,256KiB output, no credentials in child env).
Both decisions agree exactly, not merely in a hit count.

```text
artifact ae5abacaddd6027e5875ded6db0448899efeae6f1e977355330a7b26b767a040
Python checker 6c78cc56b61e9497f3610219cfb51ff6583f831c81c07ce3bdd2c8b8ba612c7b
complete decision b8aa9854ef8a16a0e7f02ce30f9c43b0bf2f8c06467713e2756ffbd036f7dcf9
```

This new diagnostic is NOT included in the collision-kernel V2 agent envelope.
The envelope retains a different fixed packet and must not be described as
containing these target decisions. Literature comparison remains inconclusive;
no novelty claim is earned. Next mathematical scope: higher odd-prime exponents
or two odd generators, requiring their own exact criterion and tail analysis.
