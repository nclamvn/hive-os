# TIP-033G G03: a preserving odd-prime-power tail and complete four-target audit

2026-10-01. Builder research checkpoint, separate from G01/G02. Mathematical
case proof reviewed by Contractor and skeptical agent; independent finite
arithmetic replay passed. This is not formal verification, publication,
external expert review, or a novelty certification.

## Outcome and exact scope

For the full normalized family `m=2^a*ell^b`, **all** a>=1, b>=2 and odd
prime ell, the four fixed targets now have complete original-congruence
decisions. The proof below supplies parameter cutoffs, not an arbitrary
ell/s ceiling. TS signed boxes and isolated stdlib Python coprime divisor
pairs agree on every positive and negative row: 71,951 cores, 10,738,865
pair slots. Pair slots are not distinct residues or a count of solutions.

Five cores have canonical strict witnesses, including two translated-only
cores missed by the whole-odd-block E ratio image. F's b2/a1..4 slice remains
unchanged and agrees exactly as a restriction. These are additional exact
representations, not two newly solved target primes: all targets already
had other certified representations. No claim about every prime, cores
with several odd-prime supports, the original conjecture, or novelty follows.

| p | max a | exact ell upper bound | checked cores | pair slots | hit cores | translated-only |
|---|---:|---:|---:|---:|---:|---:|
| 131433121 | 25 | 7020 | 22060 | 3322548 | 2 | 1 |
| 159727681 | 25 | 7739 | 23891 | 3572941 | 0 | 0 |
| 351121 | 16 | 362 | 1462 | 172150 | 1 | 1 |
| 171348241 | 25 | 8015 | 24538 | 3671226 | 2 | 0 |

The second target's empty result excludes only this entire single
odd-prime-power family with b>=2. Its b1 and multi-odd-prime representations
are not excluded. D/E/F byte pins and historical scopes are preserved.

## Structural theorem (all a>=1, b>=1, odd prime ell)

Write B=2^a, C=4B, q=ell^b, s=Cq-1. For normalized positive coprime A,U
with AU dividing m=Bq, let R_s be the least-positive residue image of
`-U/A mod s`. A and U are units even when s is composite. Then

\[
R_s=\{-2^t: -2a-2\le t\le2a+2\}
\cup\{-\ell^r2^t:1\le r<b,\ -a\le t\le2a+2\}\pmod s,
\]

and

\[
\min R_s\ \ge\ \max\left(3B-1,
\left\lceil\frac{4Bq}{B+1}\right\rceil-1\right).
\]

The image is a set equality: its displayed powers need not be distinct.
The coprime factor valuations give f in [-a,a], g in [-b,b]. Since
ell^(-b)=2^(a+2) mod s, g=0,+/-b gives the pure-two interval. Each other
negative g=-j becomes ell^(b-j)*2^(a+2); the shifted t interval [2,2a+2]
joins [-a,a] from positive g. This gives exactly the displayed image.

### Lower-bound case proof

All quantities z below are the least-positive canonical residues; rounding
an integer inequality z>=Cq/(B+1)-1 gives the stated ceiling.

1. **High positive powers.** Put t=a+2+d, 0<=d<=a, L=ell^r (including
   L=1 for the pure branch), Q=q/L>=3, and 2^d=Qh+R. Q is odd, so
   1<=R<Q. The positive remainder of CL*2^d modulo s is CLR+h, strictly
   between 0 and s, and therefore z=CL(Q-R)-1-h.
   If h=0, `(Q-2^d)/Q>=1/(2^d+1)>=1/(B+1)`, whence
   z>=Cq/(B+1)-1; also z>=CL-1>=3B-1.
   If h>=1, Q<=B and h<=B/Q, so
   z>=Cq/Q-1-B/Q. This is at least Cq/(B+1)-1 because
   `Cq(B+1-Q)>=B(B+1)`: use q>=Q,
   `Q(B+1-Q)>=B`, and C=4B. Furthermore
   z>=CL-1-B/Q>=(4-1/3)B-1>=3B-1.
2. **Intermediate nonnegative powers.** For 1<=r<b and 0<=t<=a+1,
   L<=q/ell, and the ordinary value 2^t L is below s.
   Thus z=Cq-2^t L-1>=(4-2/ell)Bq-1; this dominates both bounds.
   The pure t=0..a+1 branch is smaller in its subtracted value and also
   satisfies them (including t=0, where z=s-1).
3. **Intermediate negative powers.** Set t=-j, 1<=j<=a, M=2^j,
   R=L mod M, K=M-R. L is odd, so 1<=R<M and
   z=(sK-L)/M is an integer strictly between 0 and s. Since q>=3L,
   L>=R and (K+L)/M contributes at most the corresponding linear
   subtraction, z>=12B*R(M-R)/M-1>=6B-1.
   Separately K>=1, M<=B and L<=q/ell give
   z>=(Cq-L-1)/B>=(4-1/(B*ell))q-1/B
   >=Cq/(B+1)-1.
4. **Pure negative powers, j<=a+2.** Here
   z=s-Cq/2^j>=Cq/2-1=2Bq-1, which dominates both bounds.
5. **Remaining pure negative powers.** Put j=a+2+d, 1<=d<=a.
   From 2^j z+1=s*v, reduction modulo C gives v=Ck-1, k>=1,
   and `2^d*z=Cqk-q-k`. Consequently H=(q+k)/2^d is a positive
   integer and `z=(Cqk/(q+k)-1)*H>=3C/4-1=3B-1`, using
   q>=3, k>=1 and qk/(q+k)>=3/4. Also k>=1 and 2^d<=B give
   z>=((C-1)q-1)/B>=Cq/(B+1)-1.

These cases exhaust every term in the exact image. In case 3 the first
inequality can also be seen directly by writing
`z=L*(12B*K-1)/M-K/M` after q>=3L, then minimizing L>=R;
the two subtractions sum to (R+K)/M=1. No primality of s is used.

### Infinite tail to finite target decision

Any original hit requires the canonical residue p mod s<=p, so necessarily

\[
2^a\le\frac{p+1}{3},\qquad
\ell^b\le\left\lfloor\frac{(p+1)(2^a+1)}{4\,2^a}\right\rfloor
\le\left\lfloor\frac{3(p+1)}8\right\rfloor.
\]

For b>=2 the last bound gives the exact integer square-root prime-base
limit in the table; b is advanced only while ell^b fits the tighter bound
for that a. Max b is 16,16,10,16 respectively. There is no additional
finite m restriction and no use of the exchange-symmetry representative
bound, which need not preserve odd-prime-power core support.

**Scope falsification control:** for B=2,q=15,s=119, A=6,U=5,p=19,
`Ap+U=s` gives the strict tuple (5,114,570). Its residue 19 is below
the incorrectly generalized bound ceil(8*15/3)-1=39. Thus this theorem
cannot be extended to arbitrary composite odd q in the full divisor-pair
image. The implementation rejects composite ell.

## Canonical positive certificates

Original equation `Ap+U=(4m-1)v`, gcd(A,U)=1, AU*k=m. Denominators are
the sorted values U*v*k, A*p*U*k, A*p*v*k. Every displayed tuple has
positive distinct denominators, exactly two p-divisible denominators, and
the exact integer identity `4xyz=p(xy+yz+zx)`.

| p | (a,b,ell) | (A,U,v,k) | strict sorted (x,y,z) | translated-only |
|---|---|---|---|---|
| 131433121 | (2,2,3) | (4,9,3676451,1) | (33088059,4731592356,1932829716534284) | no |
| 131433121 | (3,3,5) | (2,25,65733,20) | (32866500,131433121000,345579733707720) | yes |
| 351121 | (2,3,3) | (3,1,2444,36) | (87984,37921068,92679090192) | yes |
| 171348241 | (1,4,3) | (162,1,42903269,1) | (42903269,27758415042,1190926747560572298) | no |
| 171348241 | (1,2,5) | (2,25,1722093,1) | (43052325,8567412050,590155212776826) | no |

Translated-only means no original pair whose odd-prime exponent difference
is -b,0 or b succeeds in that same core, not merely that the chosen pair
uses a partial power. Higher powers therefore cannot always be discarded
in favor of the whole-odd-block ratio tests on the same core.
An exact tuple comparison against E's entire canonical witness packet finds
the two translated-only sorted tuples absent there; the other three are
present. This compares the recorded canonical tuples, not all E solutions
or equivalence classes under every possible transformation.

## Implementation, replay and provenance

New standalone files only:

- `scripts/operations/higherpower-core-check.ts`: exact TS signed boxes,
  sieve prime bases and exact trial-check target primes; BigInt congruences
  and existing strict identity checker.
- `scripts/operations/higherpower-core-replay.py`: independent stdlib trial
  prime verification and coprime integer divisor-pair enumeration; original
  congruences and strict identities implemented separately, no TS imports
  or D/E/F certificate-engine dependency.
- `scripts/operations/higherpower-core-replay.ts`: fixed path, pinned source,
  isolated `python3 -I -S -B`, allowlisted environment, 30s total subprocess
  timeout, 256KiB output cap, exact deep comparison with a fresh complete
  primary computation. PARTIAL is never PASS.
- `scripts/operations/higherpower-core-audit.ts` and unit tests.

The mathematical lower bound is shared as a written premise, not made
independent by two implementations. The enumeration/primality/identity
implementations are separate; finite controls do not replace the proof.
Each target starts a monotonic 30s clock before planning, with <=100000
cores. Deadline expiry at first core or finalization returns PARTIAL with
the exact pending core or null when finalizing; a prefix digest is never
labelled the complete manifest. Runtime failure/outer replay deadline is
UNAVAILABLE. The bounded planning list has at most 24538 entries here.

Every manifest row, including misses, is compact UTF-8 JSON plus LF in
a,ell,b order: `[p,a,b,ell,m,s,hit,wholeBlockHit,A|null,U|null]`; integers
larger than the small parameter indices are decimal strings. Canonical
selection is the smallest numerical (A,U); output includes one tuple per
hit core and separately deduplicates tuples. No stored artifact is falsely
claimed hash-bound by semantic verification: the packet is regenerated.

Python source pin:
`4cfbb8c77a2d09c624eb9e2771de2efaea7fbe318d7e617c3ee0b7d57c582fad`.
Complete packet/replay output digest:
`0077816c13c6f6ff6fbb490d220396a63cc92f07e0e9bde24a316b5077ee85a9`.
Finite 480 control manifest:
`891056b800637fa6c37cb6b585215b3035ca92fc84e2eeaf7fad8d97def5a245`.

Target manifests, in table order:

```
0e743cbf0edd472ecde641443ce06888aa82817cf3c0bdfd846d73068b398ba1
f6048beeee6ad12f01bf04f6f973e24ffd0482034bd2d00cdaa36e47e7bbae10
397f43819c6b46b2e8f679d2a65adadd1a8651e78a48bc59b6f0da0a4bd5a8f5
859aa2556ed4760281c39cd324e1b2bad61b4496ec52292144ba4a51d386d6b9
```

Validation: targeted Vitest 7/7; `npx tsc --noEmit` exit0. Tests cover
480 image/bound controls, exact infinite-tail cutoff boundary, all core/hash
counts, strict translated-only identities, immutable F restricted equality,
multi-prime scope counterexample, injected first/final-row monotonic timeout,
mutated/partial comparison rejection and missing Python fail-closed CLI.
Standalone primary first scan took about0.77s; primary plus isolated replay
uses a bounded process, with actual observed PASS and no API calls.
The independent skeptical reviewer also replayed the full packet, rejected
11 packet corruptions, and injected Python first/mid/final deadline expiry;
all returned PARTIAL or rejected comparisons as required. Contractor fresh
primary/replay agreed on the same complete packet digest.

## Literature comparison and scientific status

The TypeII normalized parametrization is classical; see the authors'
[Elsholtz–Tao paper, section2](https://terrytao.wordpress.com/wp-content/uploads/2011/07/egyptian-count13.pdf).
Proposition numbering differs across versions; this note cites the section,
not an unverified proposition number in that PDF. The author-owned
[signed-box research note](https://github.com/chasebryan/centl/blob/main/research/erdos-straus/ES-TWO-TARGET-SIGNED-BOX-EQUIVALENCE.md)
also uses signed prime-valuation boxes; it is not treated as peer-reviewed
certification. A focused search did not settle whether the particular
minimum-residue inequality above is already known. **Novelty is unresolved**,
not established by failure to find a match. No paper, formal certificate,
new conjecture solution, or historical agent verdict is promoted here.

Useful research progress within this program: an infinite higher-power
tail has a support-preserving linear-in-p odd-power cutoff, replacing the
previously uncomputed higher-b scope with complete, independently replayed
decisions for the fixed four targets. Two exact translated-only examples
expose why aggregate whole-block tests are insufficient on those cores.
The next mathematical question is a preserving structure or bound for
multiple odd-prime supports, where the explicit q15 control forbids blindly
reusing this theorem. No UI/DB/worker/agent-cycle/API/Git changes were made.
