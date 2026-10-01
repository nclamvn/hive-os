# Target-sensitive two-core reduction

2026-10-01. Scope: the normalized sufficient family only. Written elementary
proofs plus finite arithmetic controls; not a root theorem, formal certificate,
novelty verdict or live agent-cycle result.

## Exact target criterion

Let `m=2^a ell`, where `a>=1` and `ell` is an odd prime with exponent ONE.
Set `C=2^(a+2)` and `s=C ell-1`. Every admissible coprime pair with `au | m`
corresponds to a signed exponent `(f,g)` with `-a<=f<=a`, `g in {-1,0,1}`.
Since `ell=2^(-(a+2)) mod s`, its unit ratio is `2^(f-(a+2)g)`.
The three integer intervals are

$$[-2a-2,-2],\quad[-a,a],\quad[2,2a+2].$$

Their union is the full interval `[-2a-2,2a+2]`, including when `a=1`.
Consequently the normalized eligible set is exactly

$$\boxed{R_s=\{-2^t\pmod s:\ -2a-2\le t\le2a+2\}.}$$

This is an equality of sets, not an assertion that the powers are distinct.
In particular

$$|R_s|=\min\{\operatorname{ord}_s(2),4a+5\}.$$

No primality of `s` is needed. For any fixed positive integer target `p`,
eligibility is therefore equivalent to at least one of the finite conditions

$$\boxed{s\mid p+2^j\quad\text{or}\quad s\mid2^jp+1,
\qquad 0\le j\le2a+2.}$$

The negative exponents use multiplication by the unit `2^j`. Every interval
exponent has an admissible `(f,g)`, hence an actual normalized pair. When
constructing an Erdős 242 witness, strictness and the Type II condition still
receive their own exact check. This criterion does not cover `ell^e` with
`e>=2`, two odd-prime generators, or all Type I solutions.

## Monotone exponent cutoff for one target

**Lemma.** Every canonical representative of `R_s` lies at least at

$$\boxed{3\cdot2^a-1=\tfrac34C-1.}$$

Proof, four explicit cases (plus exponent zero):

1. For `1<=j<=a+1`, `2^j<s`, so `-2^j mod s=s-2^j>=5C/2-1`.
   At zero the representative is `s-1`.
2. For `j=a+2+t`, `0<=t<=a`, write `2^t=ell q+r`, `1<=r<=ell-1`.
   The remainder of `2^j` is `Cr+q`, strictly between zero and `s`, since
   `q<=2^a/ell=C/(4ell)`. Its negative representative is
   `C(ell-r)-1-q>=C-1-C/(4ell)>=11C/12-1`.
3. For `1<=j<=a+2`, the representative of `-2^(-j)` is
   `s-C ell/2^j>=C ell/2-1>=3C/2-1`.
4. For `j=a+2+t`, `1<=t<=a`, write the canonical representative `z` as
   `2^j z+1=s v`. Reduction modulo `C` gives `v=Ck-1`, `k>=1`, and
   `2^t z=C ell k-ell-k`. Since `2^t | C`, let
   `h=(ell+k)/2^t`, a positive integer. Then
   `z=(C ell k/(ell+k)-1)h`. The inequality
   `ell k/(ell+k)>=3/4`, for `ell>=3,k>=1`, gives `z>=3C/4-1`.

These exhaust the exponent interval. QED. The bound is sharp: for `ell=3`,
`a>=2`, the exponent `t=-(a+4)` has representative `3*2^a-1`.

**Corollary.** If `p` is eligible then

$$2^a\le(p+1)/3.$$

Indeed `p mod s<=p`, and the lemma bounds that remainder from below. Thus a
fixed target has only finitely many dyadic exponents to test. For every such
exponent, factoring the finitely many `p+2^j` and `2^j p+1` and retaining
divisors `s=C ell-1` with odd-prime `ell` is a complete algorithm for this
ENTIRE subclass, without an `s` ceiling. Completeness is a written theorem;
efficient certified factorization for all exponents is a separate obligation.
No universal bound independent of `p`, or success for every `p`, follows.

## Finite replay and actual targets

Independent signed-box TypeScript and integer-divisor-pair Python checks agree
on all `a=1..8`, odd primes `ell<=997`: 1,336 rows, each with `(a,ell,m,s,R,
minimumResidue,residueSetDigest)`. They check the exact set equality and lower
bound. Joint row digest:
`c1d4916f901fa2958e54906dd70be40e184487bfb3fe70b303e9588788082758`.
This finite check supports implementation correctness, not the infinite proof.

Two implementations also factor ALL criterion integers for `a=1..4`, for four
named residual primes; these slices have no `s` ceiling:

| p | a=1 eligible s | a=2 eligible s | a=3 eligible s | a=4 eligible s |
|---:|---|---|---|---|
| 131433121 | 164407 | none | 12536095 | none |
| 159727681 | none | 1135, 5007 | none | none |
| 351121 | 87 | 47, 1167, 6415, 7471 | 32287 | 191 |
| 171348241 | 487 | none | none | none |

Corresponding ordered `[a,[[s,ell],...]]` manifests:

- p131433121: `dd9dbf6fad33777fee6c6a283c12f2a719ae6674ff777ca25bf3f14f57c6fbe7`.
- p159727681: `c8916bbb5c5df7f538e65100bfdd6bfc27b7d492744a6e3d2029b8df0f67d9fb`.
- p351121: `7b3044385060a9302a895f3ff682b1df0f6677fbc16a7d4670554ed68e293433`.
- p171348241: `42db9a004759eb4389322798f54226d5c396dd6f695d6d3ed57ad86baab66b20`.

Only `a<=4` was exhaustively audited for these targets. Do not describe this
as an all-exponent computational certificate, despite the proven finite tail.

For p131433121, `a=1,ell=20551` gives `(a_pair,u,s,v,k)=(2,20551,164407,1599,1)`
and strict denominators

$$32861049,\quad420323120958,\quad5402164139342.$$

Strict identity digest:
`8034dd394c6b7ec41fc4af0f7cd2d99fc4af3c737b1b04be48e023bea5913f03`.
At dyadic exponent3, `ell=391753` gives `(2,391753,12536095,21,4)` and
`(32907252,22080764328,411914555608904)` with digest
`22d1727e7880f89720ce01338d41e00d478f9b98e7e898354e37466c5c28fa63`.
Both were independently checked by exact integer identity and exactly two
p-divisible denominators. The previously smaller witness `m=36,s=143` remains
valid and better in `s`; it has exponent2 at its odd prime and lies outside
this subclass. No minimum denominator, new root coverage or optimum is claimed.

For p159727681, `a=2,ell=71` reproduces the prior `s=1135` two-core witness.
The other hit, `ell=313,s=5007`, gives `(a_pair,u,v,k)=(1,626,31901,2)` and
strict tuple `(39940052,199979056612,10190945503162)` with digest
`200af215039f2f6e0b37f0bcc5ba1a9bfb32ee392b1c59650d94ccd63942fce9`.
These larger-s diagnostics do not widen historical application search caps.

## Prior art and next obligation

The background divisor/Type II framework is established; see
[Bello-Hernández–Benito–Fernández](https://arxiv.org/html/2606.10922v1).
Public author-owned [signed-box research](https://github.com/chasebryan/centl/blob/main/research/erdos-straus/ES-TWO-TARGET-SIGNED-BOX-EQUIVALENCE.md)
also uses finite multiplicative boxes. Searches for the specific two-core
reduction were inconclusive and do not establish novelty. These simple
consequences may already be known; expert/full-text comparison remains open.

The earned gain is a target-sensitive exact decision and a proven tail bound,
rather than an occupancy heuristic. Next: a replayed all-exponent decision
for chosen targets (with bounded certified factorization), then analyze whether
the odd-prime higher-exponent or two-odd-prime slices have analogous cutoffs.
General adaptive escape and the root conjecture remain open. This new lemma
must not be assumed to be present in the separate collision-kernel V2 packet.
