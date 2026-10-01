# Neutral cross-shift barriers and an adaptive Type II attack

Date: 2026-10-01. Continuation of the A11/A19 structural work on Erdős 242.

**Outcome:** neutral factors really can preserve several closed gates. There is an elementary unbounded implication explaining this, and a **Dickson-conditional**, not unconditional, obstruction to every fixed finite menu of shifts. An analogous conditional barrier affects every fixed modulator box. The practical response is a new alternative Type II search; it finds strict witnesses for 1,504 of the 1,505 retained A≤19 survivors through 200 million. The remaining prime explicitly refutes the proposed depth-eight universal shortcut. None of these results solves the root or establishes novelty.

No new browser case, agent-cycle event, paid request, migration, commit, push or deployment was created. The new arithmetic modules remain standalone local research tools. Existing immutable research verdicts are unchanged.

## 1. Neutral factors: an exact cross-shift obstruction

Let S be any nonempty finite set of positive shifts A≡3 mod4. Define

$$c_A=(A+1)/4,\qquad L=\operatorname{lcm}\bigl(840,\{A(A+1):A\in S\}\bigr),$$

$$p(t)=Lt+1,\qquad Q_A(t)=\frac{L}{A+1}t+1.$$

Then

$$x_A=(p+A)/4=c_AQ_A,\qquad p\equiv Q_A\equiv1\pmod A.$$

### Unconditional implication, with a stated premise

If p(t) and every Q_A(t) are prime, every declared fixed-A gate is closed, **including both Type I and Type II**. More generally Q_A may be any positive integer whose prime factors are all 1 mod A; primality of Q_A is a convenient sufficient premise, not necessary.

Here is the proof for one A. Put B=px_A. Since gcd(c_A,A)=1, B is a unit mod A. The exact binary-fraction criterion is

$$(Ay-B)(Az-B)=B^2.$$

Thus a solution would give d|B² with d≡−B≡−c_A mod A. Separate the part of d supported on the prime factors of c_A from the neutral p,Q_A factors. It is a divisor d₀ of c_A² with d₀≡−c_A mod A. Its complementary core divisor e₀=c_A²/d₀ has the same residue, since all core divisors are units mod A. At least one of d₀,e₀ is ≤c_A. Write it as h. Then

$$0<h+c_A\le2c_A<4c_A-1=A,$$

contradicting A|(h+c_A). The argument is exact for composite shifts too. It does not replace a bounded exponent box by its generated subgroup. Prime variables are larger than the core, so their factor supports do not overlap it.

This proof is a general algebraic reduction, not an extrapolation from the prime scan. It also shows why the coprimality x19−x11=2 does not by itself make their splitting constraints incompatible.

### Conditional infinitude: do not remove this qualifier

All the displayed forms have positive integral slopes and constant term 1. They are distinct. For every prime ℓ, choose t≡0 mod ℓ: every form is then 1 mod ℓ. Consequently there is no local fixed prime divisor; the forms are admissible.

**Assuming Dickson's prime-tuples conjecture**, there are infinitely many positive t for which all these forms are prime. Under that assumption every finite S, however large, misses infinitely many residual primes. In particular, no fixed universal A ceiling would work in this first-denominator family. This implication is not an unconditional disproof of an arbitrary ceiling, and certainly not a counterexample to Erdős–Straus. A successful shift may grow with p or a different parameterization may find a witness.

The conjectural input is the general-linear-form prime-tuples hypothesis described by [Granville, *Primes in intervals of bounded length*, §1.2](https://dms.umontreal.ca/~andrew/CEBBrochureFinal.pdf). The source is used for the hypothesis, not as certification of this application's novelty. The elementary neutral reduction above is written out separately.

For S={3,7,…,63}, the computed L is `237497037841103040`; the admissible family has 17 forms. **No all-prime member of that 17-form family was found or tested here.** Existence of infinitely many such members remains conditional.

## 2. Actual neutral tuples, independent of Dickson

For S={11,19}, L=175560. TypeScript exact primality and core-residue replay, and Python primality plus full B²-divisor exhaustion, agree on exactly eleven all-prime tuples with p≤200 million. Their parameter t values are

`102, 131, 156, 182, 204, 534, 557, 627, 639, 765, 776`.

For example p=17907121 has

$$x_{11}=3\cdot1492261=4476783,\qquad x_{19}=5\cdot895357=4476785.$$

Both cofactors and p are neutral for their respective gates. The core divisor residues are {1,3,9} mod11 (target 8) and {1,5,6} mod19 (target 14). The A11 classifier reports pure QR; the A19 profile is the forced base (0,1,0,0,0,0,0,0,0). That base lies in **all twelve overlapping boxes**, including QR box 5; box IDs are not disjoint class labels.

For S={3,7,11,15,19}, L=351120. A preliminary bounded tuple search at 1≤t≤100000 located four all-prime tuples. The retained independent program replays these **named controls**, not a claimed full interval survey at 35 billion:

| t | p |
| ---: | ---: |
| 21900 | 7689528001 |
| 42858 | 15048300961 |
| 52140 | 18307396801 |
| 99418 | 34907648161 |

For each named control, Python exhausts trial divisors for all six prime values, then all B² divisor pairs at each of the five gates. All five close. It also produces and exactly checks a positive strict Type II witness outside those five gates. For the first control, the neutral cofactors are

`1922382001, 961191001, 640794001, 480595501, 384476401`.

These named controls do not extend the existing full residual-prime verification range. The TypeScript *search* keeps its 200-million domain unchanged; the existing BigInt strict identity checker can replay the larger named tuples without claiming primality or interval coverage.

## 3. Escape the fixed shifts: restore the modulator

The sufficient search criterion is

$$\gcd(u,a)=1,\quad s\mid ap+u,\quad s\equiv-1\pmod{4ua}.$$

Set v=(ap+u)/s, k=(s+1)/(4ua). Since s≡−1 mod a, a|(u+v). Thus

$$ap=4auvk-u-v,\qquad A=(u+v)/a,\qquad x=uvk=(p+A)/4.$$

Direct substitution gives

$$\frac4p=\frac1{uvk}+\frac1{apuk}+\frac1{apvk}.$$

The implementation sorts the exact BigInt denominators, checks n>2 and x<y<z, verifies the cleared identity, and checks that exactly two denominators are divisible by p. It searches all coprime pairs by increasing max(a,u), then a,u, and ascending s. A reported minimum depth is minimum **inside this parameterization**, not minimum A or minimum denominator.

This is established Type II mathematics, not a new existence theorem. The divisor normal form is given in [Dahan's August 2026 preprint, Theorem 3.9](https://arxiv.org/html/2608.24035v1); the surrounding Type I/II framework is in [Elsholtz–Tao](https://arxiv.org/abs/1107.1010). Only the algebraic sufficient construction is used here; the preprint's analytic density and claimed enumeration results are not used to validate the local experiment.

### Full finite replay on the retained hard set

The experiment independently regenerates the 1,505 prime survivors of **all** A=3,7,11,15,19 gates through 200 million, from the same 57,840 residual primes. It compares the unit-modulator slice a=1,u≤8 with the full coprime box a,u≤8.

| Outcome on the 1,505 survivors | Count |
| --- | ---: |
| Unit slice finds a strict witness | 1425 |
| Unit slice misses; free-modulator box succeeds | 79 |
| Both searches miss the declared box | 1 |

The full-box minimum-depth distribution is 607 at depth1, 574 at depth2, 231 at depth3, 59 at depth4, 30 at depth5, 3 at depth6, and one miss. No success first occurs at depth7 or8 in this finite set. “Free modulator needed” means **within this declared box**; it does not prove absence of all a=1 solutions at larger u.

TypeScript uses the A11/A19 group classifiers to form the survivor set; Python instead exhausts complete B² divisor pairs at those later gates. Both then independently factor ap+u, enumerate its divisors, and reconstruct/check their own tuples. The shared canonical per-survivor manifest, binding category, unit depth, full depth, construction and exact witness, is

`3086c5bf7d5224c45b83e63a36c6682b192302f6e53e597c2f7f6fdbd630f877`.

This measures an alternative parameter search, not new root coverage: the earlier A≤63 family already solved all these finite primes.

**Hard positive control.** For p=171348241, previously obstructed through A=59, the free box selects a=4,u=1,s=127,v=5396795,k=8. Its shift is A=1349199, not a small-shift improvement. It gives

$$\left(x,y,z\right)=\left(43174360,5483143712,29591402569203040\right).$$

**Mandatory negative control.** Prime p=131433121 has no hit at any of the 43 coprime pairs a,u≤8. This falsifies the auxiliary universal depth-eight claim. It is not an Erdős–Straus counterexample: the earlier fixed-family branch first opens at A=27, with

$$\left(32858287,159950639361414,13378152923682965722878\right).$$

A separate, named depth-nine exploration finds a=4,u=9,s=143,v=3676451,k=1 and shift A=919115. This does **not** change the depth-eight experiment or its miss. The callable TypeScript search remains capped at eight; the independent replay preserves both outcomes.

## 4. Even the new finite box has a neutral barrier

It would be a mistake to replace a universal small-A guess with a universal small-(a,u) guess. For any fixed J≥1, consider all coprime pairs 1≤a,u≤J and choose

$$L_J=\operatorname{lcm}\bigl(840,\{4u(a+u):1\le a,u\le J,\ (a,u)=1\}\bigr).$$

Define p=L_Jt+1 and

$$Q_{a,u}=\frac{aL_J}{a+u}t+1,\qquad ap+u=(a+u)Q_{a,u}.$$

The slope is an integer multiple of m=4au, hence Q_{a,u}≡1 mod m. If every Q_{a,u} and p are prime, every divisor of ap+u has the same mod-m residue as a divisor h of a+u. But

$$1\le h\le a+u<4au-1=m-1,$$

so no divisor has the required residue −1. Every pair in the box misses. The elementary inequality follows from 2au≥a+u for a,u≥1.

All these forms are again admissible using t≡0. Their slopes are distinct: equality a/(a+u)=a'/(a'+u') implies au'=a'u, and normalized coprime pairs must coincide. Dickson therefore **conditionally** supplies infinitely many residual primes blind to any fixed J. This is not an unconditional infinitude theorem and does not exclude Type I or Type II at parameters outside the box.

At J=8 the algebraic replay obtains L_J=1441440, 43 cofactor forms plus p. No simultaneous all-prime member of that 44-form family was produced. Raising the cap after each miss is not a proof strategy.

## 5. Verification and next obligation

New files:

- `src/modules/research-sandbox/math-adaptive-corridor.ts`: sealed algebraic family descriptions, bounded neutral-tuple checks, strict constructive Type II box search and recomputation validation.
- `scripts/operations/erdos-straus-adaptive-corridor.ts`: finite survey using the existing structural classifiers.
- `scripts/operations/verify-adaptive-corridor.py`: stdlib-only, complete-divisor/primality replay and separately scoped named controls.
- `tests/unit/math-adaptive-corridor.test.ts`: conditional-status boundaries, overlapping boxes, exact identities, corruption/domain rejection, finite misses and independent old-family rescue.

Reproduce the full finite manifest:

```sh
node --import tsx scripts/operations/erdos-straus-adaptive-corridor.ts --limit=200000000
python3 scripts/operations/verify-adaptive-corridor.py --limit=200000000
npx vitest run --project unit tests/unit/math-adaptive-corridor.test.ts
```

The elementary cross-shift and box-barrier proofs are written proofs; **they have not been formalized in Lean or independently accepted for publication**. The separate TS/Python replay checks concrete arithmetic and matching finite outcomes, not the conjectural input or universal scientific acceptance. No claim of originality follows from the literature search.

The next substantive target is a **growth/escape lemma**, not another fixed ceiling: connect factor residues in several linear forms ap+u to a guaranteed adaptive witness, or rigorously control the residual set as parameter depth grows. Density tending to zero does not imply an empty exceptional set. The prime 131433121 and the neutral families are mandatory negative controls for that work. Before a model classifies new results, these typed computations and independent outputs should be retained in its sealed cycle; this standalone implementation has not yet changed that ledger contract.

Final verification: **318/318 unit tests across 61 files passed**, including all six new controls; typecheck, lint and tracked diff whitespace checks passed. Both final full-survey runs reproduced the shared manifest above. An initial new-test expectation incorrectly treated QR box 5 as a disjoint label; it was corrected to check the exact base weights and inclusion of box 5. No mathematical classifier, resource ceiling or historical record was changed to make that assertion pass.

Source fingerprints (SHA-256):

- Research module: `b1e94388a3ed47ed120bd4fae4116d5bbd92ff6ac67b0e10a18679a758cb2019`.
- TypeScript survey: `42a8a8a717f1710f1df88772ea1f21e721fc335c828e11d18ca506d874cfc361`.
- Independent Python replay: `82c8687437b0f4bca77aba6188ba31fcdcebce75fa23e44e478586c288cea246`.
- Unit controls: `de1fb7049a44f38ec399d5867034f8fef48997f37d78034a52d5453c92949fb0`.
