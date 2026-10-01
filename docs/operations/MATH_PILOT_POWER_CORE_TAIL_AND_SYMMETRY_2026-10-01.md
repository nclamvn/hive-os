# Power-core tail and denominator-preserving symmetry

2026-10-01. TIP-033G local research. Written elementary proofs and exact
computational checks are not formal certification, literature priority,
an expert sign-off or a solution of Erdős242. No historical agent ledger is
rewritten. New standalone evidence is not yet authoritative in the agent loop.

## 1. A representative bound is not an all-representations bound

Let p>=2 and positive integers A,u,k,Q satisfy gcd(A,u)=1 and

$$Ap+u=(4Auk-1)Q,\qquad m=Auk.$$

Put T=ukQ and h=4T-p. Then u+Q=Ah>0. Exchanging u and Q gives

$$Ap+Q=(4AQk-1)u,\qquad \gcd(A,Q)=\gcd(A,u)=1.$$

The normalized denominator triple

$$\{uQk,\;Apuk,\;ApQk\}$$

is unchanged, including its identity, distinctness and p-divisibility pattern.
Thus one can choose u<=Q when seeking a representative of an existing
strict TypeII solution. This is a change of core, not a new solution.

As (u-1)(Q-1)>=0, T lies between T0=floor(p/4)+1 and floor((p+1)/3).
For the orientation u<=Q,

$$m=\frac{uk(u+Q)}{4T-p}\le\frac{2T}{4T-p}
\le\frac{2T_0}{4T_0-p}.$$

The last rational function decreases for T>p/4. In particular, for p=1 mod4,
every existing solution in the normalized family has an equivalent core

$$\boxed{m_{\rm representative}\le\lfloor(p+3)/6\rfloor.}$$

This DOES NOT bound every core, preserve prime-power shape or justify
truncating a restricted-family certificate. The old quadratic all-core bound
remains valid. More generally, IF the corresponding first-denominator gates
below h0 are independently excluded, then h>=h0 gives the conditional bound
floor((p+h0)/(2h0)). An operator-supplied h0 is not exclusion evidence.

The coprime parametrization and exchange are established background:
[Tao 2011, Proposition1.2 and Remark1.3](https://arxiv.org/html/1107.1010v2)
relate the divisor construction to the symmetric TypeII parameters.
This note recovers that symmetry for a computational normalization; it does
not claim to have discovered a new TypeII parametrization. The standard
TypeI/II equations are also displayed in
[Bello-Hernández–Benito–Fernández, section3](https://arxiv.org/html/2606.10922v1).
These comparisons do not establish priority for every inequality below.

A separate residual-class refinement DOES concern every representation:
for p>=2,p=1 mod840,

$$m\le\left\lfloor\frac{(p+11)(p+15)}{176}\right\rfloor.$$

The proof uses h3=>k>=11 and h7=>k>=13, then the old quadratic monotonic
bound for h>=11. Full modular derivation and positive boundary controls are
in `docs/verification/TIP-033G_BOUND_RESEARCH_COMPLETION_REPORT.md`.
This sharper constant remains quadratic; novelty is unestablished. No old
certificate is narrowed using it, and it must not be conflated with the
linear representative bound.

## 2. A shape-preserving bound for every odd-prime-power core

Let B=2^a>=2, q=ell^b with ell>=3 an odd prime and b>=1, C=4B, s=Cq-1.
Full normalized coprime pairs have signed ratios 2^f ell^g, |f|<=a, |g|<=b.
Using ell^b=C^-1 mod s gives the exact eligible image

$$R_s=\{-2^t:\ |t|\le2a+2\}
\cup\bigcup_{r=1}^{b-1}\{-\ell^r2^t:\ -a\le t\le2a+2\}\pmod s.$$

Unlike an occupancy count, this equality is valid even when classes collide.
The following bound concerns their positive canonical representatives:

$$\boxed{\min R_s\ge
\max\left(3B-1,\left\lceil\frac{4Bq}{B+1}\right\rceil-1\right).}$$

### Positive powers near the upper endpoint

Write t=a+2+d, 0<=d<=a, L=ell^r, J=q/L odd>=3. This also covers pure
powers with L=1. Divide 2^d=Jh+R with 1<=R<J. The positive remainder of
2^t L is CLR+h, strictly less than s, so its negative representative is

$$z=CL(J-R)-1-h.$$

If h=0, (J-2^d)/J>=1/(2^d+1)>=1/(B+1), giving
z>=Cq/(B+1)-1; also z>=C-1>=3B-1.
If h>=1, J<=B and h<=B/J. Then

$$z\ge CL-1-B/J.$$

For the q-bound, it suffices that
Cq(B+1-J)>=B(B+1). This follows from q>=J and
J(B+1-J)>=B for 1<=J<=B, since C=4B and B>=2.
The other bound follows from L>=1,J>=3:
z>=(4-1/3)B-1>=3B-1. The remainder assertion itself follows from
CLR+h<=Cq-CL+B/J<s, as CL>B/J+1.

### Intermediate powers with t between zero and a+1

For 1<=r<b, L<=q/ell and 2^t<=2B. Thus the positive argument is less
than s and z=Cq-2^t L-1>=(4-2/ell)Bq-1. This dominates both claimed
bounds. Pure powers in the same range satisfy the easier corresponding
inequality; at t=0 their representative is s-1.

### Intermediate negative powers

For t=-j, 1<=j<=a, let M=2^j, R=L mod M and K=M-R.
Here R is odd, 1<=R<M, and the exact representative is

$$z=(sK-L)/M.$$

Since q>=3L and L>=R,

$$z\ge12B\,R(M-R)/M-1\ge6B-1.$$

Separately, K>=1, M<=B and L<=q/ell give
z>=(Cq-L-1)/B>=(4-1/(B\ell))q-1/B>=Cq/(B+1)-1.

### Pure negative powers

For 1<=j<=a+2, z=s-Cq/2^j>=Cq/2-1, which dominates both bounds.
For j=a+2+d, 1<=d<=a, write 2^j z+1=sv. Reduction modulo C gives
v=Ck-1 for k>=1 and

$$2^d z=Cqk-q-k.$$

As H=(q+k)/2^d is a positive integer,
z=(Cqk/(q+k)-1)H>=3C/4-1=3B-1.
Also k>=1 and 2^d<=B imply
z>=((C-1)q-1)/B>=Cq/(B+1)-1.
These cases exhaust the exact image, proving the bound. Integer rounding
gives the displayed ceiling without any probabilistic assumption.

## 3. A practical complete search, not a universal hitting theorem

If p is eligible then its remainder mod s is <=p. Consequently

$$B\le(p+1)/3,\qquad
q\le\left\lfloor\frac{(p+1)(B+1)}{4B}\right\rfloor
\le\lfloor3(p+1)/8\rfloor.$$

For b>=2 this restricts ell to the square root of the last bound, and b
to a finite exact power comparison. No integer factorization near p² is
necessary: enumerate these certified small primes and test every original
coprime pair. Both dyadic and odd-power tails are excluded by the written
bound; misses inside the remaining domain must still be computed exactly.

The predeclared four-target domain has 71,951 cores, with maxima a25 and b16.
This decides a restricted family at fixed targets, not all normalized cores,
TypeI solutions, arbitrary p or mathematical novelty. In particular the
partial-factor ratio 11/3 at q99 is not represented by one ell^r window.
No conclusion about that genuinely multi-odd-prime family follows here.

Explicit guard against this incorrect generalization: B2,q15,m30,s119,
prime p19,A6,u5,Q=k1 gives the strict tuple (5,114,570). Its eligible
residue19 is below the falsely generalized power-core bound39. Thus q's
single odd-prime support is essential, not cosmetic. The bound is sharp
within the intended b>=2 family: a1,ell3,b2 has s71,minR23; a2,ell5,b2
has s399,minR79.

The retained residual target supplies the same warning: for B2,q99,s791,
p159727681 mod791 is260 and the normalized pair (A,u)=(3,11) hits it.
The falsely generalized lower bound would be263. E's whole-q block misses
this core, while the full multi-prime image hits; all three distinctions
remain intact.

## 4. Complete four-target results and reproduction

Fresh TS signed boxes and separately implemented stdlib Python integer
factor pairs agree on all 71,951 cores, including misses, and 10,738,865 pair
slots. Larger a/b/ell are excluded by the written theorem, not an arbitrary
search ceiling. Slot counts do not count distinct residues or solutions.

| p | Cores checked | Hit cores | Translated-only cores |
|---:|---:|---:|---:|
|131433121|22060|2|1|
|159727681|23891|0|0|
|351121|1462|1|1|
|171348241|24538|2|0|

The five cores yield five canonical strict tuples. The two translated-only
ones have b3 and are absent from E's recorded canonical tuple packet:

$$p=131433121:\quad (a,b,\ell)=(3,3,5),\quad m=1000,\ s=3999,$$
$$\frac4{131433121}=\frac1{32866500}+
\frac1{131433121000}+\frac1{345579733707720}.$$

$$p=351121:\quad(a,b,\ell)=(2,3,3),\quad m=108,\ s=431,$$
$$\frac4{351121}=\frac1{87984}+\frac1{37921068}+\frac1{92679090192}.$$

These are additional representations of already covered targets. They do
not improve a proven global optimum or add new root-conjecture coverage.
Translated-only means the whole-q exponent differences -b,0,b fail on the
same core; it is not a claim about every equivalent parametrization.

For p159727681 there is NO original normalized hit anywhere in this entire
`2^a*ell^b` family with a>=1,b>=2. Its already certified b1 and q99 mixed
support witnesses remain valid. This exclusion suggests moving attention
to multiple odd-prime supports, not claiming the target has no solution.
For p171348241 the q81 witness is ell3/b4; its F rejection as ell9/b2 was
correct because F required prime ell. F is preserved and restricts exactly
to the same two b2/a1..4 tuples in the new complete packet.

```text
node --import tsx scripts/operations/higherpower-core-audit.ts
node --import tsx scripts/operations/normalized-exchange-audit.ts

Higher-power Python source
4cfbb8c77a2d09c624eb9e2771de2efaea7fbe318d7e617c3ee0b7d57c582fad
Higher-power complete packet/output
0077816c13c6f6ff6fbb490d220396a63cc92f07e0e9bde24a316b5077ee85a9
Exchange Python source
ccd7f19bf33337a45bc22f6cc5043b7249501f8325ba54cd7d1ee4a312bfac5b
Exchange complete control packet/output
3e919c231c80fcde5b8ad639e3bae84d5e5fd97c1e0b426cb6b316dcf5e1ea5b
```

Fixed replay uses Python -I -S -B, a source pin, allowlisted environment,
30s process timeout and 256KiB output cap. Exact deep comparison rejects
extra/changed fields. Target scans use monotonic deadlines beginning before
planning and checked before each core/finalization. PARTIAL retains only a
prefix digest and precise pending core; neither it nor UNAVAILABLE is PASS.
Failure metadata distinguishes expected pin from null unverified source hash.

Independent skeptical checks additionally cover 1,344 finite image/bound
rows, eleven packet corruptions, phase-specific TS/Python deadline expiry,
all coprime pairs of each positive core, scope counterexamples and unchanged
F restriction. Exchange controls match 34,354 inputs, including 22,587
actual swaps and 206 residual-class controls. These implementation checks
support, but do not replace, the written infinite-tail proof.

Full Contractor verification: 436 unit tests in80files, typecheck and full
lint PASS. D/E/F data/replay hashes remain unchanged. No production build,
integration/browser suite, worker/model call, paid API, DB mutation, Git or
deployment is part of this standalone slice.

## 5. Scientific interpretation and next attack

This is a genuine completion of a previously uncomputed RESTRICTED family,
not a breakthrough on the root problem. The new inequality is a reviewed
written lemma with reproducible arithmetic consequences; a focused source
comparison has not established novelty, and formal/expert gates remain open.

The next attack should address ratios whose numerator and denominator both
carry different odd-prime supports. The q15 and q99 controls forbid simply
extending the present bound. A useful target is a support-preserving cutoff
or guaranteed escape condition for those mixed ratios, retaining subgroup
and collision obstructions. Before autonomous reuse, the new target/scope
bound packet must be retained through a typed pre-classification tool in
the agent ledger. That integration remains a separate unfinished product
gate; this note does not claim a new live E2E cycle.
