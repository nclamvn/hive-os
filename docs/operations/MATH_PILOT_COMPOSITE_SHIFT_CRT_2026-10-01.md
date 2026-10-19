# Composite shifts and synchronized CRT obstruction — TIP-039

2026-10-01. Builder A mathematical note. Root Erdős–Straus / Erdős242 remains **NOT_ESTABLISHED**. This is a finite, exposed-control investigation, not a held-out benchmark or a novel theorem certificate.

## Frozen experiment and disclosed clarification

The initial contract SHA was
`3c7607ad72039d17c8b0c46b838412b907ffda70b7513e9430553b99106703f4`.
It fixed all eleven TIP-038 NONINTEGRAL_SHIFT blockers, original record order,
the sole multiplier c=3q, and resource caps before composite discovery.
Builder A challenged the original unqualified “negative Jacobi is necessary”
wording before adopting it. Contractor approved the narrower, correct
registered-provenance statement; amended contract SHA
`2269fea155b62f0a15e67b0011a99d044618a0b8ea33d9428cde6170f0f23059`.
Inputs, caps and C4 were not changed.

Source TIP-038 invariant:
`952de09e31ded70c7f9f498a6ca9933ba3ca70c404f194712b491dbf00eb9bc4`.
No fallback multiplier or additional row was selected after observing results.

## Known construction, not a new parametrization

Let p be a positive prime and c<p an odd positive integer with
p+c divisible by4. Put T=(p+c)/4. For positive coprime u,v with uv dividing T
and c dividing u+v, write A=(u+v)/c and k=T/(uv). Then

$$
4T=p+c,\qquad x=T,\quad y=Apuk,\quad z=Apvk,
$$
$$
\frac1T+\frac1{Apuk}+\frac1{Apvk}
=\frac1T+\frac{u+v}{Apuvk}
=\frac1T+\frac c{pT}=\frac4p.
$$

For the registered roots, T<p and gcd(T,c)=1. Since uv<=T and c=3q>2,
u=v would force u=v=1 and c dividing2, impossible. Choosing u<v gives
y<z and y/T=Ap/v>1; exactly y,z are p-divisible. The producer still checks
the sorted strict tuple and cross-multiplied integer identity directly,
rather than treating ratio membership alone as a complete tuple certificate.
There were **no joint hits**, so no strict tuple is issued in this experiment.

This is the established coprime-divisor Type-II construction, with our u,v
corresponding to Tao's a,b; no primality of c is needed for it. See
[Tao, Proposition1.2 and Remark1.3, selected historical v2](https://arxiv.org/html/1107.1010v2).
That historical source is background, not a claim that this local application
or the conjecture is new or proved.

## Registered character consequence, not general eligibility

For every original parent, h is prime, h=3mod4, q divides (p+h)/4,
q is prime1mod4, and (q|h)=-1. The quadratic reciprocity sign is +1
because q=1mod4, so (h|q)=-1. Also p=-h modq and (-1|q)=+1;
hence (p|q)=-1. Registered p=1mod840 gives (p|3)=+1.
Consequently (p|3q)=-1. Since 4T=p+3q and4 is a unit square,
(T|3q)=-1 as well. The implementation recomputes both local characters.
The identities used here are standard
[quadratic reciprocity and Jacobi multiplicativity](https://dlmf.nist.gov/27.9).

This proves a property of **these registered transfers**, not a necessary
condition for arbitrary successful composite-shift partitions, and certainly
not sufficient for success. Abstract c15, T=29² has Jacobi(T,15)=+1 but
29=14=-1 mod15 supplies a signed exponent-one hit. That is an abstract
unit control, not an extra registered p/T pair.

## Exact signed box and CRT coupling

Factor T into distinct primes, T=product r_i^{e_i}, with gcd(T,c)=1. The
complete image is

$$
S=\left\{\prod_i r_i^{z_i}\pmod c:-e_i\le z_i\le e_i\right\}.
$$

For any exponent vector set u=product r_i^{max(z_i,0)} and
v=product r_i^{max(-z_i,0)}. Then gcd(u,v)=1 and uv divides T; unused
valuation mass is permitted. Conversely every such coprime pair gives one
vector. Repeated prime valuations cannot be replaced by one-use factors.
The desired condition is -1 in S. Swapping u,v inverts the ratio, while
-1 is self-inverse.

The TS DP keeps the numerically lexicographically smallest **ordered** pair
for each residue; it does not sort intermediate pairs. Extension multiplies
both coordinates by fixed positive integers, preserving lexicographic
dominance. At a self-inverse target the final minimum has u<=v.
For local targets, minimize over all global residue states projecting to
-1, not over an invented Cartesian product.

CRT identifies U(3q) with U(3)×U(q). Thus a joint hit needs the **same**
signed vector to hit (-1,-1). The row retains both projections and their
separate canonical pairs, but neither projected pair is a three-denominator
witness without the joint condition.

Two abstract countercontrols:

- c15 with residue2 valuation2 gives S={1,2,4,8}. Local projections hit
  -1 modulo3 and5, but14 is absent. Local minima are (1,2) and(1,4);
  image size4 is not the product8 of projected sizes.
- c39 with residues5 valuation2 and28 valuation1 gives
  S={1,5,7,8,17,19,23,25,28,29,35,37}, exact H={1,5,8,25}.
  Both projections are full, the total Jacobi character is negative, yet38
  is absent. The quotient has order6 and visible mass1. Negative character
  plus local successes still does not solve synchronization.

These are proof/unit controls, not campaign rows or new root results.

## Generic finite-abelian miss lemma

**Statement.** Let G be a finite abelian group, let r_i be units and e_i>=1,
and form S as the product of signed intervals [-e_i,e_i]r_i. Suppose the
distinguished target t has order2 and is absent from S. Let H be the
**exact** stabilizer of S, n=|G/H|, and
V=sum of e_i over factors r_i outside H. Then:

1. tH has order2, so n is even.
2. Every visible factor has order in G/H strictly greater than2e_i+1.
3. 2V<=n-2.

**Proof.** Identity belongs to S. Every h in H therefore belongs to S, so
t is not in H; its image has order2. Quotienting by the exact stabilizer
makes S/H aperiodic. If a visible generator's quotient order d were at most
2e_i+1, its consecutive signed interval would fill its entire nontrivial
cyclic subgroup. That subgroup would stabilize the complete sumset,
contradicting aperiodicity. Thus d>2e_i+1.

Expand visible intervals into e_i atoms {0,a_i,-a_i}. Each atom has size3
because its visible quotient order exceeds3. Invisible factors disappear
in the quotient. A period of any prefix sumset persists after adding any
other subset; hence every prefix is aperiodic when the final sumset is.
The aperiodic case of Kneser's addition theorem, iterated from {0}, gives
|S/H|>=1+2V. The target coset is absent, so |S/H|<=n-1, proving the bound.
This derivation uses the standard theorem in
[DeVos, A short proof of Kneser's addition theorem for abelian groups](https://arxiv.org/abs/1303.3539);
it is independently derived here, not a novelty assertion.

For composite U(c), multiple involutions change the prime-specific
consequences. H need not have odd size, n need not equal2mod4, and negative
Jacobi factors may lie inside H. No universal QNR index>=6 rule is admitted.
For c15/residue7/valuation2, H=S={1,4,7,13} has even size4, index2,
and the negative-Jacobi residue7 lies inside H. For residue4/valuation1,
H={1,4} has index4. Both miss14 and satisfy the generic lemma.

The producer computes H only among S because H⊆S, testing exact set
stabilization. It computes quotient orders by factor/power reduction of
phi(3q)=2(q-1), not by assuming that the full composite unit group is cyclic.
All modular multiplication and exponentiation use BigInt. Four involutions
and their intersection with H are retained explicitly.

Skeptical independent-context proof review accepted this statement before
it was used as a consistency predicate. This is not formal proof-assistant
checking or external expert peer review.

## Frozen results, including all misses

Both implementations independently factor and compute full images:
TS signed-exponent DP versus isolated stdlib Python positive coprime-divisor
pairs. Full content agrees on
`ff01bdbd52abbb55e98ab912b2c201968cecb210a5fd6449725dd8804731831e`.

| Record | p | c=3q | T | Image size | Mod3 size | Modq size | V | n | Classification |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| r0 | 200023321 | 1595931 | 50404813 | 27 | 2 | 27 | 3 | 1063952 | LOCAL_Q |
| r1 | 200023321 | 183 | 50005876 | 45 | 2 | 41 | 4 | 120 | LOCAL_Q |
| r2 | 200023321 | 3000351 | 50755918 | 27 | 2 | 27 | 3 | 2000232 | LOCAL_Q |
| r3 | 200602081 | 25075263 | 56419336 | 21 | 2 | 21 | 4 | 16716840 | LOCAL_Q |
| r4 | 200602081 | 2550027 | 50788027 | 27 | 2 | 27 | 3 | 1700016 | LOCAL_Q |
| r5 | 200602081 | 4227 | 50151577 | 73 | 1 | 73 | 4 | 2816 | LOCAL_BOTH |
| r6 | 200602081 | 247047 | 50212282 | 27 | 2 | 27 | 3 | 164696 | LOCAL_Q |
| r7 | 200656681 | 68127 | 50181202 | 27 | 2 | 27 | 3 | 45416 | LOCAL_Q |
| r10 | 131433121 | 7179 | 32860075 | 45 | 2 | 45 | 4 | 4784 | LOCAL_Q |
| r11 | 131433121 | 19714971 | 37787023 | 3 | 1 | 3 | 1 | 13143312 | LOCAL_BOTH |
| r13 | 200656681 | 206439 | 50215780 | 45 | 2 | 45 | 4 | 137624 | LOCAL_Q |

All H={1}, all joint canonical tuples null. There are zero hits, nine
LOCAL_Q_OBSTRUCTION and two LOCAL_BOTH_OBSTRUCTION. The actual data do not
contain a synchronization-only obstruction: they all fail already at the
q projection. C4 “every registered c3q branch succeeds” is **REFUTED** by
the first row r0, with row digest
`7acc7f616cb9580175b6da8bc65f65c362e2acae21930c0e311ee6c64e15d16e`.
This is a registered branch-rule refutation, not a root counterexample.

The local3 interpretation is exact: a signed image contains2mod3 iff some
positive-valuation prime factor of T is2mod3. If so, its smallest such prime
gives the canonical (u,v)=(1,r), with k=T/r. Otherwise every signed factor is1
and the projection is {1}. This explains the two local3 misses without
inventing a new general existence assertion.

For all q=1mod4, -1 is QR modulo q. The registered T has negative character
modulo q. Character alone nevertheless supplies no particular bounded
signed vector reaching -1. The small images and very large quotient
indices make the generic mass inequality loose here.

## Resource and provenance checkpoints

One measured TS invocation: 544 state insertions, 19,427 work steps, 9ms
observed through sealing checkpoint, 25,218 bytes. A fresh Python replay:
1,076 pair checks, 4,413 work steps, 12ms, 25,214 stdout bytes.
Source-pinned wrapper observed77ms and PASS on the complete invariant;
verified Python SHA
`d2eb19e4c199e29744f5a6410b4bd35991777c3bb53da8d5ba939ac38f52425f`,
receipt digest
`8bf3923dc97cd5680b58e02459324a073a66f6cbddfa642ad1408b83af4b6795`.
Wall/runtime/packet receipt hashes can vary between runs; scientific content
does not include algorithm-specific runtime.

The fixed CLI starts before dynamic import and checks after serialization.
In-process packet timing excludes its inert module import. Synchronous
PARTIAL diagnostic sealing may finish after a cap, but cannot regain COMPLETE.
Earlier atomic-prefix stops keep their original reason and next ROW.
Injected candidate-contradiction tests retain the bounded offending row as
non-COMPLETE diagnostics. No real candidate contradiction was observed.

## Research decision and next bridge

This experiment justifies rejecting a blind c=3q success rule, not adding
larger multipliers post hoc. The useful next question is conditional:
what root-bound factor-supply or bounded-image-occupancy mechanism forces the
target in a chosen exact signed image? A useful proposed lemma must control
the actual support and missing q target, not merely restore integrality,
show a negative character, shrink H or enlarge V in another group.
Such a bridge needs its own predeclared hypotheses and falsification test.
It is not proved, implemented or admitted by TIP-039.

The eleven inputs were chosen from already-exposed misses and already-solved
roots. No new root coverage, statistical rate, novelty, termination theorem,
AI-native agent acceptance or live-browser E2E completion follows.
