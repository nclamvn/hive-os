# Constructive sufficient coverage — TIP-040

2026-10-01. Local exposed-control calibration. Root Erdős–Straus / Erdős242 remains **NOT_ESTABLISHED**. This note proves conditional finite certificates, not an unbounded factor-supply theorem, new root coverage or novelty.

## Preregistered experiment and deterministic policy

Contract SHA45007d95c263301e726006d1d2fb285350ec45e08959dfc87356336f5ed32e60
fixed71 known rows: the60 TIP-037 prime-shift rows in their original target/shift order,
then all11 TIP-039 composite rows in original blocker order. No multiplier, shift,
root, depth, support-allocation rule or fallback was added after results.

Scientific source contents:
TIP-037 a6e29476a065de13e0de34d64458579b96e74ec9da35196e74eac1275f4e767c;
TIP-039 ff01bdbd52abbb55e98ab912b2c201968cecb210a5fd6449725dd8804731831e.
The producer hardcodes these identities and rechecks each p,m,T and its factors;
it does not read old hit outcomes to decide eligibility.

A pre-execution Contractor clarification chose numeric-lex **ordered**
coprime pair(u,v), not signed-vector lex, for each half quotient coset.
Its actual residue and exponent vector are retained for the lift.
Chain maps have the unique representation from consecutive digits and
numeric-sorted prior covered elements. First matching A coset is numeric-sorted.
Final orientation is explicitly recorded; an inversion negates every exponent
and swaps u,v consistently. The witnesses are **CONSTRUCTIVE**, not globally minimal.

## Root-bound arithmetic

For each row, p is a prime1mod840, m<p, p+m=4T and gcd(T,m)=1.
The registered m is a prime3mod4 or3q with q a prime1mod4. Let
G=U(m), M=|G|, and target t=-1. Factor T into sorted distinct primes
\(\prod_i r_i^{e_i}\).
A legal signed vector \(z_i\in[-e_i,e_i]\) gives coprime u,v with uv dividing T.
A hit has m dividing u+v. Then

$$
A=(u+v)/m,\quad k=T/(uv),\quad
(x,y,z)=(T,Apuk,Apvk)
$$

solves4/p=1/x+1/y+1/z. Sorted strict denominators and exactly two p-divisible
entries are checked using the full cross-multiplied BigInt identity.
This uses the known coprime-divisor Type-II parametrization, not a new one;
see [Tao Proposition1.2/Remark1.3, selected historical v2](https://arxiv.org/html/1107.1010v2).

## Lemma1: constructive single-factor chain

Suppose the already allocated support J has signed image containing a
subgroup K, with a legal exponent representation of **each** member.
Choose an unused factor r^e and its exact relative order
\(d=\operatorname{ord}(rK\text{ in }G/K)\).
If d<=2e+1, consecutive digits

$$
-e,-e+1,\ldots,-e+d-1
$$

are legal and represent all d cosets of K in L=<K,r>.
Multiplying each old representation by the appropriate digit therefore
represents every element of L exactly once. The support is disjoint,
so each old coordinate stays legal and the new coordinate is bounded.
This proves subgroup coverage, not equality to the final full image's stabilizer.

The implemented policy starts K={1}; chooses the smallest-prime unused
eligible factor; includes relative order1; reconsiders previously skipped
factors after growth; and stops immediately at the first represented target.
Relative order is factor/power-reduced from M against exact membership in K.
It does not mistake the generated subgroup for a covered subgroup.

## Lemma2: quotient energy sufficient intersection

After the chain, let I_A,I_B be a nonempty proper bipartition of the
**remaining** prime support. Each factor is used in exactly one of J,I_A,I_B.
Let A,B denote the half-box images in the same Q=G/K. For each half let
mu(q) count signed assignments, and retain exact

$$
N=\prod_{i\in I}(2e_i+1),\qquad
E=\sum_{q\in Q}\mu(q)^2,\qquad
L=\left\lceil N^2/E\right\rceil.
$$

Cauchy–Schwarz gives \(N^2\le |S_I|E\), so L is a rigorous lower bound
for the occupied quotient cosets. If

$$
L_A+L_B>|Q|=M/|K|,
$$

then A intersects tB^{-1}. Otherwise these two sets of total size greater
than|Q| would be disjoint subsets of Q. Choose actual half representatives
a,b for a matching pair of cosets. Their discrepancy t/(ab) belongs to K;
use its separately paid chain representation exactly once to lift the match.
Adding the three disjoint-support exponent vectors gives a legal full vector
whose product is t. This is a sufficient certificate, not a scan of the full
signed target image.

The existing [collision-kernel note](MATH_PILOT_COLLISION_KERNEL_2026-10-01.md)
already proves weighted energy and the N²/E lower bound. This implementation
does not rebrand that as a new theorem or claim exact energy is cheaper.
Every diagonal assignment is included in E. A certified upper bound on E
would be safe; partial/sampled collision lower bounds are not.

The policy evaluates unordered bipartitions once: ascending bitmask,
first unused index fixed in A. Every evaluated half retains full quotient
frequency data, exact N/E/L and the numeric-lex ordered pair per coset.
It stops at the first strict sufficient inequality; remaining allocations
are explicitly NOT_EVALUATED, not failed. All coset representatives are the
minimum numeric element of gK. This is not independent local CRT coverage.

## Proof controls, not new experiment rows

- U5 with residue2 valuation1: generated U5 contains target4, but the bounded
  image{1,2,3} does not. The certifier returns NOT_CERTIFIED. Reusing that
  single valuation in two half boxes would spuriously manufacture coverage.
- U15 with residue2 valuation2: chain covers even-size K={1,2,4,8}, which
  excludes target14. Even K does not imply distinguished-target membership.
- U7 with factors3,5 each valuation1: both lower bounds3 sum to quotient
  order6; equality does not force a target. The certifier rejects the shortcut.
- U7 with3² and5: neither factor individually saturates a relative-order6
  quotient, but half N/E/L are5/5/5 and3/3/3, with5+3>6. ENERGY_CERTIFIED
  reconstructs exponents(-2,1), u5,v9. Toy p173,T45 would give tuple
  (45,1730,3114), but p173 is outside the registered p1mod840 campaign.
- U31 with2²,3,13²: chain pays for K=<2>, then energy matching needs
  lift16. Its chain vector(-1,0,0) combines with halves(0,1,0),
  (0,0,-2) into(-1,1,-2). Treating K as a free stabilizer or reusing its
  factor would break the support accounting.
- U19 with2,7,59,97: the chain pays for7 and covers{1,7,11}. First energy
  mask1 needs lift7; normalized vector(-1,-1,-1,-1) is a legal hit.
  Two remaining partitions are explicitly unevaluated.
- U11 with2·3²: the smaller prime2 initially fails eligibility;3 saturates
  order5, then2's new relative order2 becomes eligible. U7 with2,11,17
  exercises consumption of a relative-order1 factor.

Malformed factor budgets, units, quotient lifts, orientation and strict tuple
identities are also guarded. These finite controls supplement written proofs;
they are not independent mathematical peer review or new root data.

## Actual frozen results

Scientific content:
48b455470ecb38da669d372206841a65fbc34facb0b684763a01b3df5d96fa72.
Full TS and isolated Python agree on all71 semantic rows.

| Status | Count |
|---|---:|
| CHAIN_CERTIFIED | 4 |
| ENERGY_CERTIFIED | 0 |
| NOT_CERTIFIED | 67 |

The four certificates are P0_h3, P1_h3, P1_h31, P2_h3.
The three h3 certificates use the elementary order2 factor criterion.
P1_h31 covers K of size10; its constructive vector is(-7,-1) for
T=2^7·391801=50150528, giving u1,v50150528,k1,A1617759,
tuple(50150528,324525821956479,16275141320751414870912).
This very large tuple illustrates why constructive is not minimum/quality-optimal.

Only **after** method generation, the old exhaustive source-pinned rows were
used as a separately attributed comparator. Among11 known hits,4 are
certified (4/11,36.36%) and7 remain NOT_CERTIFIED:
P0_h103,P1_h79,P2_h19,P2_h31,P2_h79,P3_h71,P3_h103.
All60 known misses also remain NOT_CERTIFIED. In particular old root
p131433121 has a known hit at103 but gets no certificate here.
This does not mean the known witness disappeared or that a no-solution
statement was established. No such status exists in the new producer.

All seven uncertified known hits have trivial covered K: no individual factor
triggered the chain. For P1_h79, the largest retained lower-bound sum is77,
below ambient quotient order78. The strict sufficient inequality correctly
refuses a certificate despite the separately known target witness. This
diagnosis motivates a future structural/target-specific proof; it is not
permission to switch method after outcomes.

The energy method works in abstract positive controls but contributes zero
certificates on the registered rows. No alternative split policy, cyclic-block
fallback, extra shift or new root was added to improve this outcome.

## Resource, source and implementation boundary

One frozen-source TS invocation:11,405 state insertions,119,478 group/modular
work,152ms observed packet sealing checkpoint,744,374 packet bytes.
Fixed CLI observed187ms including dynamic import/serialization.
Independent Python:40,399 divisor-pair candidates,7,068 states,14,615 work,
101ms,744,393 stdout bytes. Fresh fixed-source wrapper observed642ms:
PASS / EXACT_FULL_COVERAGE_INVARIANTS_AGREE; Python SHA
57874e09b3c501919c64c611b25d475d2f83419aabc35024fcd06af518983b96;
receipt a4928cf3593cf5b133d53872c323df4a1d7917da6f01912eaf9de376fa2fba8e.
Runtime-dependent receipt/output hashes are observations; content is stable.

Caps remain60seconds/71rows/2Mstates/50Mwork/2MiB output.
Only constructively covered K and proper-half quotient maps are enumerated,
never all m units or the full final signed target image.
All residue products and powers are BigInt-exact. Inputs are validated before
potentially oversized abstract exponentiation; minimum lowered output cap
16384bytes is needed to retain all71 frozen input identities.

Atomic completed-row prefixes have exact pending ROW or FINALIZE.
Late complete sealing becomes PARTIAL; previous row/state/work/output reason
is preserved. Fixed CLI checks import and serialization; in-process timing
excludes inert import. Synchronous partial sealing can overrun after stop but
cannot regain COMPLETE/PASS. Scoped parsing/digest validation is not execution
or half-frequency completeness authority; fresh independent replay is needed.

## Future proof-only extension and unresolved root gate

A multi-factor cyclic-block saturation statement was independently challenged:
over cyclic L/K of order d, if every visible block factor generates that
quotient and2W+1>=d, its signed box covers the quotient. This follows from
the aperiodic quotient and atom-size form of
[Kneser's theorem](https://arxiv.org/html/1303.3539v1).
It is standard, not assigned novelty, and is **not implemented**, evaluated as
an allocation fallback, or part of the71-row results.

Root-wide factor supply is still missing: there is no theorem that every
residual p admits a bounded shift with eligible saturated support or enough
quotient occupancy. Average counts do not yield this pointwise statement.
A valuable next task must explain the seven uncertified known hits through
a predeclared structural mechanism, not merely relax the split or search
more menus after seeing failure. Equal-budget comparative/held-out evaluation,
formal/external review and governed agent/UI admission remain separate gates.
