# Split-support canonical quotients and complete fixed rays

2026-10-01, TIP-033H H05/H06. Local standalone mathematical diagnostic;
not retained V3 agent evidence, a root proof, formal certification or novelty.
Existing D/E/F/G scope statements and source pins are unchanged.

## The mechanism, not a whole-q bound

Let A,U,k be positive integers with gcd(A,U)=1, m=AUk and s=4m-1.
The normalized original condition is `Ap+U=sQ` for an integer Q>=1.
Set Q0 to the least **positive** integer congruent to -U modulo A, and
h0=(U+Q0)/A. For A=1 choose Q0=1; for A>1, coprimality ensures
1<=Q0<A. The canonical usable residue for this particular partition is

\[
p_0(k)=\frac{sQ_0-U}{A}=4UkQ_0-h_0.
\]

This identity is exact at composite s as well. It keeps the original A,U,k;
no exchange of U and Q is used. The small quotient Q0 explains why several
odd-prime factors can escape the minimum-residue bound for a single odd
prime power. Increasing unused mass k on one fixed ratio ray makes its
canonical residue grow **linearly**, but the coefficient depends on the
actual partition rather than just on its whole odd block q.

### Proof, positivity and the necessary tail

Since s=-1 mod A, Q0=-U mod A is precisely the condition for
`sQ0-U` to be divisible by A. For A>1,
`h0=(U+Q0)/A<=U`: use Q0<=A-1 and
`U+A-1<=AU`. Hence `p0>=4U-U=3U>0`. Since Q0<A and U>0,
`p0=(sQ0-U)/A<s`. For A=1, `p0=s-U=(4k-1)U-1`, which is
positive and below s for every U,k>=1. Thus this is the least-positive
representative of -U/A modulo s, not merely some congruent number.

For any original hit Q=Q0+A*t for an integer t. Q>=1 and minimality of
Q0 force t>=0, and substitution gives `p=p0+s*t`. In particular p0<=p,
so **every** hit on this ray satisfies

\[
k\le K_{\max}(p;A,U)=\left\lfloor\frac{p+h_0}{4UQ_0}\right\rfloor.
\]

The next integer k=Kmax+1 has p0>p and is excluded. The bound is only
necessary: many k below it still miss the original condition. If A>1,
the preceding proof also gives `p0>=U(4kQ0-1)>=3Uk`, a partition-sensitive
necessary inequality, not a useful whole-q or universal occupancy bound.

### Exact all-k divisor test (necessary AND sufficient)

A hit on the fixed (p,A,U) ray is exactly a positive divisor d of Ap+U
such that

\[
d\equiv-1\pmod{4AU},\qquad
k=\frac{d+1}{4AU},\quad Q=\frac{Ap+U}{d}.
\]

Both k,Q are then positive integers, s=d=4AUk-1, and the original equation
holds. Conversely every original hit supplies that divisor. No raised-root
criterion is used. The first positive d in that progression is 4AU-1>=3,
so the test cannot generate k=0 from a positive divisor. For fixed p,A,U,
factoring Ap+U and checking **every** divisor therefore decides all k,
without scanning an enormous arbitrary k interval.

Every positive construction gives the rational identity with denominators
`(UQk, ApUk, ApQk)`: their reciprocal numerator is
`A*p+Q+U=(4AUk-1)Q+Q=4AUkQ`. Positivity alone does not assert distinctness
or TypeII classification. The tools separately sort the triple, check exact
`4xyz=p(xy+yz+zx)`, strict inequalities and exactly two p-divisible entries.

### Support boundary and two mandatory controls

In a specific m=2^a*q partition A=2^i*d, U=2^j*e, gcd(d,e)=1,
de divides q and i*j=0. The unused odd mass `r=q/(de)` can share primes
with d or e; only A and U must be coprime. Fixing A,U preserves the ratio
partition. Varying k can introduce new primes or increase their valuations,
so an all-k ray is **not** an all-cores family with fixed full support.

- p19,A6,U5,k1 gives m30,s119,Q0=Q=1,h0=1,p0=19 and the strict
  triple (5,114,570). The would-be extension of G to B2,q15 would require
  p0>=ceil(8*15/3)-1=39 and is false.
- p159727681,A3,U11,k6 gives m198,s791,Q0=1,h0=4,p0=260,
  Q605794 and t201931. The strict triple is
  (39982404,31626080838,1741717274106852). G's incorrectly generalized
  B2,q99 bound would require p0>=263. Here k contains another factor3;
  requiring unused mass coprime to A would wrongly discard this control.

These are countercontrols to an auxiliary bound, not conjecture counterexamples.
The p19 control is intentionally outside the residual p1mod840 domain.

## Predeclared exact ray slice

Targets: `[19,131433121,159727681,351121,171348241]`.
Pairs, in this order: `[(6,5),(3,11),(4,9),(2,25),(3,1),(162,1),(1,1)]`.
They comprise mandatory split controls, G witnesses and an A1 boundary.
They are selected examples, not a discovered complete partition menu.

Thirty-five rows decide **all k>=1 on exactly those rays**. There are 366
positive-divisor candidate rows, including every miss, and 12 hit rows;
all twelve satisfy strict TypeII checks. The packet also checks 2,544
canonical-residue controls over coprime A,U<=16 and k<=16. Counts are not
minimum-depth claims, all-core coverage, a count of all solutions, or new
root coverage. Every target already had a certified solution.

| p | (A,U) | complete list of successful k on that ray |
|---|---|---|
| 19 | (6,5) | 1 |
| 131433121 | (4,9) | 1 |
| 131433121 | (2,25) | 20,986 |
| 159727681 | (3,11) | 6 |
| 351121 | (3,1) | 4,36,51,467 |
| 351121 | (1,1) | 105 |
| 171348241 | (2,25) | 1 |
| 171348241 | (162,1) | 1 |

The other 27 declared rays miss for all k. Those misses do not exclude other
partitions or support types. In particular p131433121/(2,25) also has
k986,m49300,s197199 and the strict sorted triple
`(32858450,6479652865300,345495090777796)`. Its core is
`2^2*5^2*17*29`, illustrating introduced mass/support on the same ratio ray.
This is an additional packet representation; no globally new or minimal
solution assertion is made without comparison to all historical data.

## Replay, resource contract and provenance

Reproduce:

```
node --import tsx scripts/operations/split-support-audit.ts
npx vitest run tests/unit/split-support.test.ts
```

TS factors the exact safe-integer numerator, generates divisors from its
prime-power product and checks BigInt original congruences/identities. Python
isolated stdlib instead enumerates quotient-paired divisors up to exact isqrt,
recovers the factor product from its complete divisor list and derives the
canonical residue via modular inverse. It neither imports TS nor consumes
its factors. Finite arithmetic implementation independence is not independent
foundational or formal certification of the written lemma.

Resource caps: 30s monotonic clock for the complete run, <=100000 candidate
core/divisor rows and <=166608 square-root scan iterations per ray. Exact
fixed inputs require 871256 such Python scan iterations total; iterations
are not core rows. The earlier preliminary root estimate166606 was corrected
to166608 before source creation. The output is below256KiB. The wrapper
uses fixed code paths and a source pin, `python3 -I -S -B`, environment
allowlist, 30s subprocess timeout and256KiB output cap. No model code or
arguments are executed. Timeout at controls/factoring/divisor/finalization
returns PARTIAL with exact pending input and complete earlier rays only.
The partial current-ray divisor count is not a complete manifest. Runtime
failure or missing Python is UNAVAILABLE; no partial comparison is PASS.
Unavailable provenance has actual scriptDigest=null, expected pin separately.

Complete packet SHA256:
`d1fb21ec5ae382ddbf26a26e33ebd61b3d0731ef6e319bc386ede5bbad39952a`.
Ray manifest:
`99469d36791bf21dd8e6ed8d60b493ea5eceba4039c74b6a5279f23fbc50aaab`.
Control rows:
`25218e37a94605d1a689468a209c9881ddab20b706660f119fc859b91cc7b65c`.
Python source pin:
`877cbe16fd4a3f58eeae83e9344122151b2d1f15553883c49cc7aa0cce8e6c8b`.

Each ray's divisor rows are compact JSON+LF, ascending d, with
`[d,hit,k|null,Q|null]`; large integers are decimal strings. Full ray records
include exact numerator prime factors, Kmax, counts, row digest and all strict
tuples. Packet/ray hashes use compact JSON UTF-8 with no trailing newline.
The complete packet is regenerated and freshly compared, not an artifact
whose byte provenance is inferred from semantic validity alone.

## Primary-source comparison and remaining scientific gap

The underlying normalization is known. The Builder compared equations2.13–2.15
in the authors' [Elsholtz–Tao paper, section2](https://terrytao.wordpress.com/wp-content/uploads/2011/07/egyptian-count13.pdf).
The Contractor also checked [Tao2011, Proposition1.2 and Remark1.3](https://arxiv.org/html/1107.1010v2):
the coprime divisor conditions and symmetric TypeII construction are already
established background. The canonical quotient is an elementary modular
representative of that framework, not a claimed novel discovery.

The Builder could not fetch the newer Jiang source, but the Contractor read
its [September2026 preprint, sections1.1 and1.6](https://arxiv.org/html/2609.09204v1).
It studies divisor counts and explicitly disclaims new solvability cases for
the root conjecture. This is a bounded prior-art comparison, not adoption or
independent verification of its results. Search, a preprint and model agreement
do not establish novelty. The literature's unconstrained solutions also require
separate strict checking for the public Erdős242 task.

This checkpoint supplies a precise split-dependent escape/tail seam and
complete all-k examples, not a support-uniform bound or an autonomous
scientific breakthrough. The unresolved question is how to control or
force a good partition/Q0 across **all** several-prime cores as the support
varies. Fixing a few rays or observing their success does not answer it.
The next research proposal should explicitly preserve unused mass, repeated
prime valuations and these low-Q0 controls before claiming any whole-q cutoff.

## Appended source-status correction: 2026-10-01, TIP-034

The [current official record for Jiang 2609.09204](https://arxiv.org/abs/2609.09204)
shows latest v2 withdrawn on 2026-09-13, with author comments reporting errors.
The older v1 comparison above is retained as historical context, but the
publication is now quarantined across all version/HTML/PDF/DOI aliases and none
of its results may authorize an accepted mathematical premise. This correction
does not assert that independently checked ray identities are false, and it
does not rewrite the fixed ray packet or historical evidence. Current health
and the partial method map are documented in
`MATH_RESEARCH_LITERATURE_STATUS_2026-10-01.md`.
