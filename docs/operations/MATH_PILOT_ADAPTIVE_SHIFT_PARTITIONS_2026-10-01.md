# Adaptive shifted-factor partitions: exact images and a safe-prime inverse boundary

2026-10-01, TIP-036. Standalone local research; no agent ledger, live model campaign, paid API, app/DB change or new root theorem. Written proofs below are not Lean-formalized. Independent replay and skeptical acceptance are separate gates; novelty is unestablished.

## 1. Known Type-II criterion, with its exact hypotheses

Let p be an odd prime, h>0 with p+h divisible by four and p not dividing h. Put T=(p+h)/4. For the present residual experiment p=1 mod840 and h=3 mod4; hence T is integral, p>h and gcd(T,h)=1.

For positive coprime u,v satisfying uv|T and h|(u+v), define

\[
k=\frac{T}{uv},\qquad A=\frac{u+v}{h}.
\]

Then the denominator multiset is

\[
\{T,\; A p u k,\; A p v k\},\qquad
\frac4p=\frac1T+\frac1{Apuk}+\frac1{Apvk}.
\]

Indeed the last two reciprocals sum to h/(pT), while 4T=p+h. Since 0<T<p, p does not divide T and divides both other entries. When p>h and u<=v, Ap>v, so T<Apuk. If u=v, coprimality forces u=v=1, impossible for h>=7 dividing u+v. Thus u<v and the sorted denominators are strictly increasing. The implementation independently checks the exact cross-product identity and exactly two p-divisible entries; positivity or a modular hit alone is not accepted as a strict witness.

This is the established divisor parametrization, not our new invention. See [Tao, Proposition 1.2 and Remark 1.3](https://arxiv.org/html/1107.1010v2): identifying (a,b,c)=(u,v,h) gives the same coprime conditions and Type-II construction. That paper relates the normalization to Vaughan. We do not claim coverage of Type I, all h, or a minimum denominator.

## 2. The full signed image, not the generated subgroup

Write T=product q_i^e_i, with gcd(T,h)=1. The exact ratio image is

\[
S(T;h)=\left\{\prod_i(q_i\bmod h)^{z_i}: -e_i\le z_i\le e_i\right\}.
\]

For each z_i>0 assign q_i^z_i to u; for z_i<0 assign q_i^(-z_i) to v. No prime appears in both u and v, and the unused exponent e_i−|z_i| goes to k. This gives coprime u,v with uv|T. Conversely every such pair has exactly this signed assignment. Therefore h|(u+v) iff u/v=-1 modulo h iff -1 belongs to S. Neutral residue-one factors remain in T and k; repeated valuations and partially unused mass are not discarded. k is allowed to share a prime with u or v (or A).

For a residue of multiplicative order d, the signed interval fills its cyclic subgroup by exponent floor(d/2). Additional valuations may saturate the image but are still raw mass in the statements below. Computing only the generated subgroup would be incorrect before saturation.

The TS primary accumulates the image one distinct prime block at a time. Per residue it retains the smallest **ordered** pair (u,v) in numeric lexicographic order. For a fixed later assignment, multiplication of each coordinate by positive factors preserves lexicographic order, so discarded larger pairs cannot later beat the retained pair. It never sorts pairs inside the DP, because swapping inverts the ratio. At the final target -1, swapping is valid; a smallest ordered hit therefore automatically has u<=v. The Python replay uses complete positive coprime divisor pairs instead of this DP.

## 3. A quantified safe-prime statement and its proof

Let h=2ell+1 be prime, where ell is an odd prime. Let T be **any** positive integer coprime to h, not necessarily associated with a prime p. Let

\[
W=\sum_{q\mid T,\ q\not\equiv1\ (h)}v_q(T).
\]

Assume at least one prime-factor residue is a quadratic nonresidue. The candidate has two conclusions:

1. If W>=ell, then -1 belongs to S(T;h).
2. If W=ell−1, then -1 is absent **iff every nonidentity prime-factor residue belongs to one inverse pair {r,r^(-1)} with r a primitive quadratic nonresidue of order 2ell**.

If any factor is -1 modulo h, it hits the target immediately. If all factors are quadratic residues, their complete signed image stays in the quadratic-residue subgroup, while -1 is a nonresidue because h=3 mod4. These separate cases are exact, not probabilistic heuristics.

### Stabilizer reduction

Use a primitive-root identification of the multiplicative group with G=C_(2ell), with target ell. Replace every valuation unit by an atom {0,a,-a}. Repeated atoms for the same prime are valid: after summing, cancellations normalize to its net exponent, and canceled mass becomes unused k. Residue one contributes only {0} and does not enter W.

Suppose ell is absent. An atom with a=ell would already hit it, so all W atoms have three elements. Since the image contains zero, a stabilizer of order two or 2ell would place ell in the image. The remaining nontrivial subgroup has order ell: it is the even-log subgroup. A nonresidue atom includes both parity cosets; if this subgroup stabilized the image, both full cosets would be present, also impossible. Thus the stabilizer is trivial.

A period of any partial sumset persists after adding all remaining atoms. Hence every partial sumset is also aperiodic. The aperiodic case of [Kneser's addition theorem, as stated/proved by DeVos](https://arxiv.org/html/1303.3539v1), gives |A+B|>=|A|+|B|−1. Starting from {0}, iteration yields

\[
|S|\ge1+2W.
\]

If W>=ell this exceeds |G|=2ell, contradiction. This proves conclusion 1. It is a known Kneser corollary, not itself a new milestone. The previous [A19 note](MATH_PILOT_A19_OBSTRUCTION_FRONTIER_2026-10-01.md) already proves a stronger mixed-even/odd obstruction bound in the relevant prime-order setting.

### Inverse classification at W=ell−1

First suppose an even nonzero log b and an odd log a both occur. Apart from the immediate target atom, the even atom has three distinct even elements and the odd atom has two distinct odd elements plus zero. In the odd coset, adding the two odd elements to the three-element even atom produces at least four elements when ell>=5: identify the even subgroup with C_ell and apply Kneser there; a non-full sum has trivial stabilizer, while a full sum has ell>=5 elements. The even part contributes three. Thus the merged pair has at least seven elements. Remaining W−2 atoms add at least two each, giving

\[
|S|\ge7+2(W-2)=2W+3=2ell+1,
\]

contradiction. For ell=3 the even atom fills the entire even subgroup; adding a nonresidue fills both parity cosets and hits the target. Thus no mixed-even/odd target-avoiding boundary is possible.

All nonidentity logs are therefore odd, and none equals ell. In C_(2ell), such logs are primitive. If two occurring odd logs a,b are not equal up to sign, their merged atoms have nine distinct sums. The four odd sums ±a,±b are distinct. The five even sums 0,±(a+b),±(a−b) are distinct: collisions would force a=±b or 2a=0 or 2b=0, excluded by primitive order 2ell. Parity separates these two sets. Iteration then gives

\[
|S|\ge9+2(W-2)=2W+5>2ell,
\]

another contradiction. At ell=3 there is only one inverse pair of primitive odd directions after excluding ell, so this second alternative does not arise. Necessity of the single inverse pair follows in all cases.

Conversely, if every nonidentity log is ±a for one primitive odd a, the image is exactly {ja: -W<=j<=W}. At W=ell−1 this contains every group element except ell: the inverse of an odd unit sends ell to ell, outside that interval modulo 2ell. This proves sufficiency and the boundary classification. The same abstract one-direction profile proves the generic W>=ell threshold cannot be uniformly lowered without further directional information; this does not assert realization by every prime-root shift.

### Additional directional corollary, not a new experiment

If two noninverse primitive QNR directions occur and the target is absent, the nine-element argument gives 2W+5<=2ell−1, hence W<=ell−3. Thus W>=ell−2 already forces a hit in this directional class. Sharp abstract control: h=11, residues 2 and 7, each exponent one, have W=2=ell−3 and image {1,...,9}, missing 10. T=14 realizes this group profile, but 4T−h=45 is composite; it is **not** a prime-root counterexample or an added frozen input.

## 4. Frozen complete finite experiment

Inputs were declared before execution: every prime 200000000<p<=201000000 with p=1 mod840; warmups 131433121,159727681,351121,171348241 in that order; shift menu [7,11,23,47,59,83,107]. This is public development data, not held-out. h=7/h=11 controls exhaust nonidentity valuation profiles of weight ell−1, in lexicographic coordinate order for residues 2,...,h−1. No larger profile explosion was run.

The primary independently tested primality and factored T. It completed 275 interval primes, 28 warmup rows plus 1925 interval rows = **1953 rows**, with **971 hit rows**. Its distinct DP state insertions were 130625; the measured finalization checkpoint was about 0.2–0.3 seconds on this local machine, not model latency. Serialized packet size was 1419663 bytes. All are below the frozen 60-second /10000-row /2000000-state /2MiB caps.

| h | Hit rows among the 275 new primes |
| --- | ---: |
| 7 | 120 |
| 11 | 173 |
| 23 | 195 |
| 47 | 164 |
| 59 | 143 |
| 83 | 117 |
| 107 | 54 |

These counts overlap; they must not be summed as covered primes. Exactly **272 of 275** new primes have at least one hit in this menu. The three uncovered primes are **200023321, 200602081, 200656681**. The old warmup **131433121** also misses every menu shift. They remain in the packet, never filtered away or labeled conjecture counterexamples. Existing tools' 200-million ceilings and pinned sources are unchanged; this is a separate finite experiment.

For p=200656681 every prime factor of every T_h in the menu is QR modulo its own h. This is a pure-subgroup obstruction at each of these seven shifts. The other two uncovered primes have sparse QNR directions at some shifts but still miss the exact target. No argument has shown that such constraints cannot coexist across further shifts.

Warmup successes include p159727681 at h47 with (u,v,k,A)=(2,327,61058,7); p351121 at h11 and h47; p171348241 at h83 and h107. Their strict witnesses are retained in the packet. These are exposed known-target arithmetic controls, not discoveries of previously unsolved primes.

There were 161 threshold-applicable rows and 55 inverse-boundary-applicable rows. Candidate rules supplied a non-null prediction for 970 rows; predictions are conditional structural checks, not a claim that the remaining rows miss. The exact image decides all rows, including successes below the sufficient threshold.

| Boundary controls | All profiles | QNR-applicable profiles | All misses | Applicable misses | Classification mismatches |
| --- | ---: | ---: | ---: | ---: | ---: |
| h7 / W2 | 15 | 12 | 6 | 3 | 0 |
| h11 / W4 | 495 | 460 | 45 | 10 | 0 |

The full-row invariant content digest is `ca0edf6ce6ab31d22e801a63db8301039efc20eb3c9d9ee7a613318ef2fcb913`.
The interval-prime manifest digest is `c0a2a8a449bc9eafb46860ba076e40e67b8a1f13c257ab700776b6e2aa5cfa10`.
The h7/h11 boundary profile digests are respectively `d897706f4e59c5fcb2bb330a0dfb087c86b9e56785a163906d68708af8c15dae` and `c3c464023621b168f4db239b548330a82b770a4aea45ceb857b49377a83887d6`.

Runtime fields are excluded from the invariant content digest, not invented to match the other implementation. Full packet digests do include measurements. An interrupted run retains its actual completed prefix, pending input and stop reason, never COMPLETE. Digesting/serialization are deadline-checked too; elapsedMs is an observed checkpoint, not perfect wire-return timing. Synchronous serialization of a PARTIAL diagnostic may finish after the deadline, without becoming a pass.

A candidate/image contradiction is also fail-closed: the bounded exact offending row is retained in a typed investigation error, and the CLI emits a non-COMPLETE diagnostic with exit code 1. The unit control injects a contradiction to verify that retention path; no such mathematical contradiction was observed in the 1953 actual rows.

## 5. Mandatory scope countercontrols

p19=3 mod4 cannot give integer T with any declared menu shift h=3 mod4. It is retained as a wrong-domain control, not a fabricated positive menu row. Its historical h1 split (u,v,k,A)=(1,5,1,6) gives strict (x,y,z)=(5,114,570), outside the residual experiment.

The older auxiliary whole-core minimum bound is still false for arbitrary composite odd cores. Direct exact reconstruction keeps:

- q15: p19,A6,U5,k1,Q1,m30 has canonical residue p0=19, below the integer-floor comparison floor(119/3)=39 from the falsely extended bound.
- q99: p159727681,A3,U11,k6,Q605794,m198 has p0=260, below the integer-floor comparison floor(791/3)=263 from the falsely extended bound; k shares the prime 3 with A. Its strict witness is (39982404,31626080838,1741717274106852).

These controls refute that auxiliary extension, not Erdős–Straus. They are not added rows in the new shifted menu. The new signed-image theorem has separate hypotheses and no whole-q bound. No unused-mass coprimality restriction is silently introduced.

## 6. Source overlap and the still-missing root bridge

The group machinery is established, and inverse-boundary arguments are not assigned novelty. The existing A19 internal note contains a related mixed-packet Kneser argument. An independently inspected [CENTL author note dated 2026-08-15](https://github.com/chasebryan/centl/blob/main/research/erdos-straus/BINARY-R-KNESER-DEFECT.md) studies stabilizer defects and inverse geometry for the full signed box of N=pT in an external-nonresidue binary-rescue setting. Our finite slice uses T alone and Type II. This overlaps conceptually; that repository's self-labeled theorem is an unvetted comparison, not an accepted premise or proof of priority.

[Dahan's August 2026 preprint record](https://arxiv.org/abs/2608.24035) describes fixed-shift obstruction and factorization-free search/sieve results. Only its record/abstract was inspected here; it is a literature lead, not an adopted theorem. No input, method or scope was changed on that basis. No withdrawn-source result is used.

The actual root obligation is a cross-shift **existence** argument: why must a suitable shift have enough nonresidue or directional factor mass to hit its exact target? Pure QR factors and unrestricted residue-one factors can evade these sufficient conditions. A finite shift menu is not universal. Even infinitude of safe primes is unproved, so a root program cannot assume endlessly available safe-prime shifts as a free premise. A possible next theoretical gate studies general primes h=3 mod4 with suitable quadratic character and their stabilizer quotients; existence of primes in congruence classes is not a bound on search depth, factor mass or a successful partition. This note does not implement or prove that missing bridge.

Reproduce the frozen primary with `node --import tsx scripts/operations/adaptive-shift-audit.ts`; it accepts no runtime interval/menu/model/source-code arguments. Its full stdout is bounded JSON, not an agent-cycle event. Independent Python replay, source pins, skeptic report and final Contractor acceptance must be consulted separately.
