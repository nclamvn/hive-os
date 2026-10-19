# Divisor-led escape: exact certificates and unconditional fixed-menu barriers

Date: 2026-10-01. Continuation of the neutral-corridor experiment on Erdős 242.

**Outcome:** the new divisor-led search constructs strict Type II witnesses for all 1,505 retained A≤19 survivors through 200 million. Its largest first divisor is 791, within a predeclared search interval s≤4095. The two independent implementations agree. This closes the earlier depth-eight search miss by a different parameter-selection rule, **not new root coverage**: the earlier A≤63 search already covered the same finite set. No universal escape theorem or novelty has been established.

The more important mathematical safeguards are written below: an exact inverse enumeration, a determinant separation lemma, a quadratic-residue eligibility obstruction, and an **unconditional** obstruction to every fixed divisor menu. These are elementary applications of established mathematics, not claimed original discoveries. They have not been Lean-formalized or externally accepted.

No browser run, agent-cycle event, paid API request, schema mutation, commit, push, or deployment occurred. The implementations remain standalone research tools; their sealed outputs are not yet authoritative agent-cycle ledger entries.

## 1. Invert the search rather than enlarge a box

The known sufficient Type II criterion is

$$\gcd(a,u)=1,\qquad s\mid ap+u,\qquad 4au\mid s+1.$$

Instead of factoring ap+u for every guessed small pair, choose s≡3 mod4 first and write m=(s+1)/4. Necessarily a|m and au|m. Because

$$1\le u\le m/a\le m<s,$$

the congruence determines u uniquely:

$$u=(-ap)\bmod s,\qquad 1\le u<s.$$

Enumerating all a|m, rejecting u=0, checking au|m and gcd(a,u)=1 is **exhaustive for normalized constructions with this s**. It does not assume s prime. It does not establish that some s exists for every prime, nor cover Type I. The independent Python implementation enumerates all divisor pairs a|m, u|m/a instead of deriving a single u from its residue.

Set v=(ap+u)/s and k=m/(au). Reduction modulo a gives a|(u+v), so A=(u+v)/a is integral. Then

$$ap=4auvk-u-v,\qquad A=4uvk-p\equiv3\pmod4,$$

$$\frac4p=\frac1{uvk}+\frac1{apuk}+\frac1{apvk}.$$

Every returned tuple is sorted and checked with exact integer arithmetic for p>2, x<y<z, the cleared identity, and exactly two denominators divisible by p. Ordering is increasing s, then a; a returned first s is **not** a minimum parameter height, shift, or denominator.

The sufficient normal form and coprime normalization are established in [Dahan's preprint, Theorem 3.9 and Lemma 3.10](https://arxiv.org/html/2608.24035v1). Its Lemma 3.12 also uses bounded cross-products to separate normalized ratios modulo a large prime. Our shared-divisor audit below writes the same elementary determinant argument for a specified divisor, which may be composite. No analytic or global completeness claim from the preprint is needed for these computations.

## 2. Retargeting a divisor can be impossible

Suppose s divides both a₀p+u₀ and ap+u, with normalized coprime positive pairs. Cross-multiplication gives

$$s\mid a_0u-au_0.$$

If 1≤a,u≤J and s>J max(a₀,u₀), both positive cross-products are at most J max(a₀,u₀). Their difference has magnitude strictly below s. Therefore it is zero. Coprime normalization then forces (a,u)=(a₀,u₀).

Consequences are narrowly scoped: if the seed is outside the box, **no pair in that box can share this s**; if the seed is inside, it is the only possible pair. This does not exclude another divisor or a different solution family. If the inequality fails, the audit returns `NO_SEPARATION_GUARANTEE`, not an exclusion. For example, modulo 3 the distinct ratios (a,u)=(1,1) and (1,4) coincide; uniqueness without a size premise is false.

For p=131433121, the new search selects s=143 with seed (4,9). At J=8, s>8·9=72. Hence this divisor cannot be repurposed into any of the 43 normalized pairs in the old box. This explains a specific escape that blind reuse of old seed divisors would miss; it is not a proof that all depth-eight pairs fail at every other s. That stronger finite absence is separately retained by the old box verifier.

There is also an unbounded same-divisor obstruction for the unit seed. If s|p+1 and au|m, then u−a≡0 mod s, while |u−a|<s. Thus a=u, and normalization gives a=u=1. A divisor already supporting the p+1 unit branch cannot be converted into a different normalized modulator pair while retaining that same divisor and its construction constraint.

## 3. Fixed divisor menus are unconditionally blind infinitely often

Let S be any finite set of positive s≡3 mod4 and

$$L=\operatorname{lcm}(840,S).$$

For p≡1 mod L, suppose a candidate uses s∈S and au|(s+1)/4=m. Then

$$ap+u\equiv a+u\pmod s,\qquad 0<a+u\le au+1\le m+1<s.$$

The inequality a+u≤au+1 is (a−1)(u−1)≥0. The strict last inequality holds even for s=3. Hence s cannot divide ap+u, and no candidate in this menu works, with or without normalization.

Since gcd(1,L)=1, [Dirichlet's theorem, as stated in Sutherland's MIT notes, Theorem 18.1](https://math.mit.edu/classes/18.785/2019fa/LectureNotes18.pdf), supplies infinitely many primes p≡1 mod L. Thus **every fixed s ceiling misses infinitely many residual primes in this representation**, unconditionally. This application does not prove nonexistence of larger-s Type II witnesses or any Type I witness, and is not a conjecture counterexample.

This is different from the previous **Dickson-conditional** simultaneous neutral-factor arguments for fixed-A gates or fixed (a,u) boxes. Those boxes permit arbitrarily large s. The new Dirichlet argument does not remove their conditional qualifiers; it applies to a finite divisor menu only.

Concrete control: for all s=3,7,11,15,19, L=175560. Prime p=351121=2L+1 has no candidate at s≤19. Both languages verify this absence and a later strict witness at s=31, (a,u,v,k)=(2,1,22653,4):

$$\left(x,y,z\right)=\left(90612,2808968,63631552104\right).$$

The family builder is deliberately limited to s≤63, yielding L=29687129730137880 at 63. The written argument has no such mathematical restriction; the builder's ceiling is an implementation boundary, not a proposed universal bound.

## 4. A nonresidue is necessary, not sufficient

For prime q≡3 mod4, put m=(q+1)/4 and define the exact eligibility set

$$R_q=\{-u a^{-1}\bmod q:\gcd(a,u)=1,\ au\mid m\}.$$

Every prime factor ℓ of m is a quadratic residue modulo q. For odd ℓ, q≡−1 modℓ and quadratic reciprocity gives (ℓ/q)=(−1/ℓ)(−1/ℓ)=1. If ℓ=2, then q≡7 mod8, also giving (2/q)=1. Thus every a,u dividing m is a quadratic residue; multiplying their ratio by −1 makes every member of R_q a nonresidue. There are generally nonresidues outside R_q.

Exact TypeScript and Python atlases demonstrate the distinction:

| q | Normalized factor pairs | Distinct eligible residues | Nonresidues omitted |
| ---: | ---: | ---: | --- |
| 7 | 3 | 3 | none |
| 11 | 3 | 3 | 2,6 |
| 19 | 3 | 3 | 2,3,8,10,12,13 |
| 23 | 9 | 9 | 5,14 |
| 127 | 11 | 7 | 56 of the 63 nonresidues |

At q=127, m=32, the pairs (1,32) and (4,1) both give residue 95. Counting pairs as distinct congruence classes would overstate coverage. A residue-based scheduler must deduplicate classes without erasing their different parameter costs. The atlas is an eligibility certificate, not a strict identity for every integer representative; positivity and distinctness are checked when an actual p is supplied.

The prime-only search is retained as a **diagnostic**, not as a completeness shortcut. Composite witnesses can arrive earlier: p=131433121 first uses 143=11·13, whereas its first prime candidate is 311 with (a,u)=(13,6). All 1,505 retained cases do have a prime candidate within the declared interval; therefore this experiment does **not** demonstrate global necessity of composite s or a prime-only failure through 4095.

## 5. Independent full finite replay

Before the survey, the divisor interval was fixed at s≤4095. Domain: all 57,840 primes p≡1 mod840 through 200 million, retaining exactly the 1,505 whose complete A=3,7,11,15,19 gates close.

TypeScript regenerates survivors with the earlier structural classifiers. Python independently uses complete B²-divisor gate exhaustion, reusing only the prior stdlib arithmetic helpers. Neither reads the other's output. They use different inverse-enumeration algorithms and both check every returned strict identity.

Results agree:

- All 1,505 have a strict divisor-led witness; none misses the interval.
- All 1,505 also have a prime-s candidate within 4095. This is finite only.
- Largest first s among the all-s runs is 791 at p=159727681: (a,u,v,k)=(3,11,605794,6), tuple (39982404,31626080838,1741717274106852).
- Largest max(a,u) among the chosen first-s constructions is 63 at p=64199521, using (a,u,s)=(63,1,251). This is not the minimum depth for that prime.
- p=131433121 has no normalized candidate at any s≤142, then the retained composite escape (4,9,143) gives tuple (33088059,4731592356,1932829716534284). The old box-eight failure remains unchanged.

The common canonical manifest binds each p, finite category, first s, first prime s, construction and exact tuple:

`1288a65e03ec8b17416621509bed04966430b1ee516aa34887d60095d211d45a`.

The structural replay additionally tests 654 unit-retarget pairs for s≤255 and 97,266 determinant comparisons for normalized pairs through eight with the stated size premise. Those finite checks supplement, not replace, the written general proofs.

## 6. Verification, reproducibility and next obligation

```sh
node --import tsx scripts/operations/erdos-straus-divisor-led.ts --limit=200000000
python3 scripts/operations/verify-divisor-led.py --limit=200000000
npx vitest run --project unit tests/unit/math-divisor-led.test.ts
npm run test:unit
npm run typecheck
```

Final verification: **324/324 unit tests in 62 files passed**, including six new tests. Typecheck and targeted ESLint passed. No app-route, React or Next.js code was changed. No provider spending or infrastructure activation was required.

Source SHA-256 fingerprints:

- Module: `8c6341980da1a5a57a15c4eebb8a6e97c6147ad173eecd9e02dcd7902091f16d`.
- TypeScript survey: `2c7010b9fb4fcfe681aeb8439e460ea52dcccd90259e89bd8d598e679035f59d`.
- Python replay: `f81860cf98448c47765fa8ec6e963e914e805d7c98f83b9a65ec3c62a907336a`.
- Unit tests: `8486b82d1f26a4f5d5409c95b19c0c42377c79b7d6cf9c27acf85340c2e6ba46`.

The next research obligation is to control **growing** residue menus with exact overlap and exceptional-set accounting, preserving the Dirichlet progression and old neutral families as adversarial controls. Neither an almost-all estimate nor observed complete finite coverage proves a witness for every prime. The separate product obligation is to place these declared plans, exact outputs and independent replay digests into the sealed agent cycle before model classification. This turn does not claim that integration or a fresh visible E2E cycle.
