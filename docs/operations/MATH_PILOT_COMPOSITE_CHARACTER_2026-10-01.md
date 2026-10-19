# Erdős 242: composite-character structure and lossless pruning

Date: 2026-10-01. Local research continuation; no paid API, publication,
deployment, benchmark-score claim, or root-theorem acceptance.

## Outcome and epistemic status

Four elementary structural propositions are proved below, with two independently
implemented finite audits. They identify the difference between a necessary
quadratic-character condition and the bounded factor-ratio condition that
actually supplies a witness. This is a methodological refinement of the declared
normalized divisor-led family, not a solution of the Erdős–Straus conjecture.
Novelty is **not established**. In particular, character obstructions already
appear in the literature; these propositions must not be advertised as a new
research breakthrough merely because the project now implements them.

The new TypeScript search prunes character-impossible values of s without losing
the original first witness. On the hardest named control, 124 of the 198 values
of s preceding and including the witness are skipped. This is a reduction in
candidate values, **not a measured wall-clock speedup**: the current atlas also
enumerates all residues at each retained modulus.

The new character tools are standalone reviewed diagnostics. They have not yet
been registered as sealed agent-cycle events. Browser observations below exercise
the existing raw-search/independent-replay workbench, not the new filtered search.

## Declared family

Let p be a prime congruent to 1 modulo 840. For positive integers a,u,s with

\[
s=4m-1,\qquad \gcd(a,u)=1,\qquad au\mid m,\qquad s\mid ap+u,
\]

put v=(ap+u)/s and k=m/(au). Then

\[
ap+u+v=4aukv,\qquad
\frac4p=\frac1{uvk}+\frac1{apuk}+\frac1{apvk}.
\]

The software additionally checks positivity, exact identity, strict ordered
denominators, and exactly two denominators divisible by p. An eligibility
calculation modulo s is not itself that strict certificate. No claim that this
family exhausts every Type I/II representation is made here.

## Proposition A: composite Jacobi necessity

For every admissible normalized pair,

\[
\left(\frac p s\right)=-1.
\]

Here the symbol is Jacobi, including composite s. Proof: gcd(m,s)=1. For any odd
prime ell dividing m, s=-1 modulo ell and s=3 modulo 4. Quadratic reciprocity gives

\[
\left(\frac{\ell}{s}\right)
=(-1)^{(\ell-1)/2}\left(\frac{s}{\ell}\right)
=\left(\frac{-1}{\ell}\right)^2=1.
\]

If 2 divides m, then s=7 modulo 8, so (2/s)=1 too. Every prime factor of a and u
divides m; multiplicativity gives (a/s)=(u/s)=1. The congruence
p=-u/a modulo s then gives (p/s)=(-1/s)=-1. All these quantities are units.
Since p=1 modulo 4, reciprocity also gives (p/s)=(s/p).

Therefore skipping s with Jacobi symbol 0 or +1 is lossless for this family.
The converse is false. At s=11 the usable classes are {7,8,10}, but
p=131433121 has residue 6 with character -1. At s=31 the usable classes are
{15,23,27,29,30}, whereas p=159727681 has residue 26 with character -1.
Also, Jacobi +1 is not generally equivalent to being a square modulo composite s;
the implementation explicitly tests the example 2 modulo 15.

## Proposition B: exact signed-exponent eligibility

Write m as the product of prime powers ell^e. Normalized pairs are in bijection
with signed exponent vectors f_ell in [-e,e]:

\[
a=\prod_\ell \ell^{\max(-f_\ell,0)},\qquad
u=\prod_\ell \ell^{\max(f_\ell,0)}.
\]

Proof: coprimality places each prime exclusively in a or u, and au dividing m
bounds its exponent by e. Conversely every such vector gives exactly one pair.
Consequently there are product(2e+1) pairs, and the exact eligible residue set is

\[
R_s=\left\{-\prod_\ell\ell^{f_\ell}\pmod{s}:
                  -e_\ell\le f_\ell\le e_\ell\right\}.
\]

Negative exponents mean modular inverses, which exist since gcd(m,s)=1.
Distinct vectors can collide modulo s; pair counts must not be substituted for
distinct residue counts. For s=143 there are 25 pairs but 22 usable classes.
By Proposition A, R_s is contained in the character-minus-one classes, usually
strictly. Proving coverage of these bounded signed-product images across varying
s is a stronger obligation than proving the existence of a nonresidue.

## Proposition C: exact first-character threshold

Let q3 be the least prime quadratic nonresidue modulo p congruent to 3 modulo 4,
and q1 the least such prime congruent to 1 modulo 4. Use infinity when absent.
The least positive s=3 modulo 4 with (p/s)=-1 is exactly

\[
\min(q_3,3q_1).
\]

Proof: p=1 modulo 840 implies (2/p)=(3/p)=(5/p)=(7/p)=1. If (s/p)=-1,
some nonresidue prime q occurs to odd exponent in s. If q=3 modulo 4 then
s>=q>=q3. If q=1 modulo 4, the quotient s/q contains a factor congruent to
3 modulo 4 and is at least 3, so s>=3q>=3q1. Conversely s=q3 works directly,
and s=3q1 works because (3/p)=1. This proves both bounds.

The bounded implementation restricts the candidates to q3<=maxS and
3q1<=maxS, returning null when neither fits. This is a **necessary-character
threshold**, not an identity-existence threshold. The named control with p=159727681
opens character at s=31 but its first witness in this family is at s=791.

## Proposition D: exact finite-menu character-blind corridor

Fix Y>=3, take all s=3 modulo 4 with s<=Y, and let
L=lcm(840, all these s). Consider only reduced residue classes c modulo L
with c=1 modulo 840. Define

\[
Q_Y=\{q\notin\{3,5,7\}:q\text{ prime},\quad
(q\equiv3\pmod4,\ q\le Y)\text{ or }
(q\equiv1\pmod4,\ 3q\le Y)\}.
\]

All menu characters (c/s) equal +1 precisely when (c/q)=+1 for every q in Q_Y.
For q=3 modulo 4 the row s=q isolates its coordinate; for q=1 modulo 4 the
row s=3q isolates it since (c/3)=1. Conversely every external prime appearing
to odd exponent in any menu s is in Q_Y: a factor q=1 modulo 4 needs an
additional factor of at least 3 to make s=3 modulo 4. The fixed 3,5,7
coordinates contribute only +1.

By the Chinese remainder theorem, each independent external Legendre coordinate
halves the number of reduced classes, even when L contains higher prime powers.
Thus the exact fraction of these conditional reduced classes with all menu
characters +1 is

\[
2^{-|Q_Y|}.
\]

Every such class prohibits this normalized construction at every s in the menu,
by Proposition A. Dirichlet's theorem supplies infinitely many primes in each
of these reduced classes for each **fixed** Y. This does not exclude larger s,
Type I, or all decompositions. Nor does the shrinking fraction as Y grows prove
pointwise coverage with Y depending on p, or give a distribution of the first
witness among finite primes. It is not the fraction of all search misses.

## Independent finite audit

TypeScript uses signed exponent vectors and a binary Jacobi algorithm. Python
uses explicit coprime factor-pair enumeration and prime-factor Euler tests for
characters. Both enumerate every residue 1..s-1 at all 256 moduli
s=3,7,...,1023. They match the full canonical rows
[s,pairCount,usableResidues,negativeCharacterResidues], not just aggregate counts.

Results: 131,072 inspected residue slots, 3,774 usable (s,residue) cells,
49,363 character-minus-one but unusable cells. Counts include separate moduli;
they are not prime-frequency estimates. The canonical JSON row manifest is
`d9bf1d537935602d95f8ac6db16144a8a69d7ab3049a53fb4277b22d5ef4343f`.

The independent replay also matches first characters, first exact witnesses,
strict witness digests and retained/skipped s counts for four named controls:

| p | First character s | First witness s | Retained s | Skipped s |
|---:|---:|---:|---:|---:|
| 131433121 | 11 | 143 | 13 | 23 |
| 351121 | 31 | 31 | 1 | 7 |
| 171348241 | 51 | 83 | 3 | 18 |
| 159727681 | 31 | 791 | 74 | 124 |

The third control specifically exercises a first character at composite s=3*17.
The hardest control gives (a,u,s,v,k)=(3,11,791,605794,6) and

\[
\frac4{159727681}=
\frac1{39982404}+\frac1{31626080838}+\frac1{1741717274106852}.
\]

Its strict certificate digest is
`267e92ab09de9561d9420619f8fb1767f3e1a60a5133168f9bb81babf05fd6dc`.

Additional raw-versus-filtered regression: every residual prime <=200,000 at
bounds 19,63,143,255 (348 controls) agrees in status, first s, full construction,
denominator tuple and strict digest. This is a finite software regression, not
a replacement for the losslessness proof or a new conjecture-wide survey.

Character-blind ranks |Q_Y| for Y=19,63,143,255,1023 are respectively
2,9,21,35,117. Their exact conditional class fractions are 1/4, 1/512,
1/2097152, 1/34359738368 and 1/166153499473114484112975882535043072.

## Observed browser flow

Authenticated local workspace, existing read-only math-tools form, all-s mode:
p=159727681 with maxS=31 and then 790 produced bounded misses, each with a
matching isolated Python replay. maxS=791 produced the exact identity above
with matching replay and rendered KaTeX. The visible tab was left on this witness.
Screenshot: `/tmp/hive-character-gap-2026-10-01.jpg`.

No new claim, review acceptance, benchmark result or autonomous-loop ledger entry
was created. The session kept the paid queue disabled. These observations prove
this workbench flow, not end-to-end autonomous execution of the new character code.

## Prior art and sources

- [Salez, The Erdős–Straus conjecture: New modular equations and checking up to
  N=10^17 (2014)](https://arxiv.org/pdf/1406.6307), Proposition 2 and its proof,
  pp. 3–4: polynomial-denominator obstructions and a Jacobi calculation with
  modulus 4BCD-1. This is direct prior art for the character-obstruction framework;
  no novelty is claimed for Proposition A.
- [Bloom–Elsholtz author survey (2022)](https://www.math.tugraz.at/~elsholtz/WWW/papers/bloom-elsholtz-naw5-2022-23-4-237.pdf),
  pp. 239–240: square-class barriers, modular covering, and existing counting and
  exceptional-set methods. These distinguish fixed menus from growing coverage.
- [Dahan preprint, version 1 (2026)](https://arxiv.org/html/2608.24035v1),
  Theorem 3.9/Lemma 3.10 and related normal-form discussion: comparison context
  for normalized parametrizations. No new analytic assertion here relies on
  an unreviewed preprint result.
- [MIT Jacobi/reciprocity notes](https://math.mit.edu/~dav/cheatSheetCORR2.pdf):
  multiplicativity, reciprocity and supplementary laws used in the elementary proofs.
- [MIT 18.785, Lecture 18](https://math.mit.edu/classes/18.785/2019fa/LectureNotes18.pdf),
  Theorem 18.1: the classical Dirichlet theorem used for the fixed-menu corridor.

This is a focused comparison, not an exhaustive novelty search. Written proofs
are not Lean formalizations or independent mathematical expert certification.

## Reproduction and source binding

Run from repository root:

```sh
node --import tsx scripts/operations/erdos-straus-character-audit.ts
python3 -I -S -B scripts/operations/verify-character-audit.py
npm run test:unit -- --maxWorkers=2
npm run typecheck
npx eslint src/modules/research-sandbox/math-divisor-character.ts scripts/operations/erdos-straus-character-audit.ts tests/unit/math-divisor-character.test.ts
```

Compare JSON fields maxS, checkedResidues, eligibleResidues, negativeMisses,
manifest, controls and barriers exactly. Independent Python witness replay imports
the reviewed fixed `replay-divisor-led.py` helper; it does not consume TS output
or execute model-authored code. All 332 unit tests in 64 files, typecheck and
targeted ESLint passed. No test timeout was weakened.

SHA-256 bindings:

| Source | SHA-256 |
|---|---|
| src/modules/research-sandbox/math-divisor-character.ts | ede85b47afce3b19df64c7e390b6137a05d210c75d2c7e11f083efa415762f04 |
| scripts/operations/erdos-straus-character-audit.ts | e6bc44eae18b934e19225690ed7f2177eaaa4abf3f975224db0bfc7d2b272af4 |
| scripts/operations/verify-character-audit.py | 9fffd1b4848963a751462a22defdc94a4acab443e4dee83d7e870b752ccd34a2 |
| tests/unit/math-divisor-character.test.ts | 8b92c4dddfc8b799cc8d740c8460ff5f36a7957609ff69e931f997c77dd86d5b |

## Next research obligation

Investigate a precise occupancy/escape statement for R_s as s varies, explicitly
controlling bounded signed products and collisions. Finding a least quadratic
nonresidue alone cannot close the gap. Before allowing an agent to classify a
future structural claim, bind these tools, replay source, exact scope and output
digests into that claim's sealed evidence. Keep counterexamples and bounded misses
append-only; do not promote empirical coverage or classical lemmas into a root
proof, novelty finding, or breakthrough label.
