# Lower premises and prime criterion: mathematical audit

Scope TIP-055; independent reasoning and exact small controls, not a replay of
the author archives or a formal proof-kernel certificate. Current targets remain
NOT_ESTABLISHED by HIVE, with all23 application obligations OPEN.

## 1. Imported premises and order of implication

[Sungkawichai–Trakulthongchai v2](https://arxiv.org/html/2604.23906v2),
1Sep2026, Theorem1.3 states LRC(k) for all k≤12, counting moving speeds.
The computer-assisted argument in §6 proceeds from the lower k9 case through
k10,11,12. We located and reviewed the statement, not its complete computation.
The alternative terminal Proposition4.4 requires k+1 and p>k(k+1) odd primes;
the condition must not be silently transferred to composite14 or15.

[Allikvere v2](https://arxiv.org/html/2609.02604v2), 24Sep2026, §§2,5,6,
uses the lower family for moving13 first and then moving14. The lower snapshot
checks described there are author-reported, not newly verified HIVE evidence.
Thus the dependency is lower≤12 → moving13/total14 → moving14/total15.
The first arrow also requires its complete prime coverage and analytic bound;
the second cannot assume its own conclusion. A reviewed source theorem may be
an explicit imported premise without being mislabeled independently replayed.

## 2. Universal implication proved by contraposition

Fix k≥3, a prime p, and a positive primitive pairwise-distinct integer tuple v
with no LR time at threshold δ=1/(k+1). Assume LRC(m) for every m<k.
Suppose p divides none of its entries. Its reduction modulo p lies in the
nonzero-coordinate base domain. A full certificate for that domain must cover
every base class and every lift required by its terminal rule, not a sample.

At a proper level l, write M=lp and w=v mod M. There are two possibilities.

Grid: t=j/M is good for w. Since t(v_i−w_i) is an integer for every i,
the same t is good for v, contradiction. At a larger level cl the witness
numerator becomes cj and every lift differs by multiples of M; this explains
the full c^k-fiber transport, rather than checking only one representative.

Gcd: for an omitted coordinate i, g=gcd(l,w_j:j≠i)>1. Because g|l|M,
g divides every fixed actual speed v_j. Primitive v implies gcd(g,v_i)=1:
a prime factor common to both would divide every entry. The general local
shift argument below needs only g∤v_i, which is weaker and is useful as a
control; it must not be confused with the primitive application hypothesis.
If g divides all modular residues, the leaf is still gcd-proper: its entire
integer class excludes primitive tuples vacuously. The h≥2 condition belongs
to the shift argument, not to the definition of modular gcd-properness.

The lower case for the fixed k−1 speeds gives a t0 with all fixed distances
at least1/k>δ. For t=t0+q/g, those distances do not change. The omitted phases
form a regular h-point orbit, h=g/gcd(g,v_i)≥2, each point repeated gcd(g,v_i)
times as q runs0..g−1. The shortest connected closed arc containing all orbit
points has length1−1/h≥1/2. The bad phase arc is OPEN and has length2δ≤1/2.
It cannot contain all points, including the equality case. Some single q makes
the omitted coordinate good while preserving all fixed coordinates. This is
a common time for the whole tuple, contradiction.

Therefore, under full properness coverage and the stated lower premises, every
primitive counterexample must have p dividing the product of its speeds.
This written universal argument is separate from the finite supporting replay.

## 3. Completeness and the disjunction

Properness persists at integer multiple levels. Grid times embed in the finer
grid, and old gcd divisors divide the new level and fixed residues. If every
base class has a complete terminal level, take the LCM of those levels: there
are finitely many base classes, and every tuple at the LCM level reduces to a
proper tuple at the selected level for its class. This proves a common finite
level, provided every fiber was covered. Missing or duplicate branch entries
cannot replace that universal fiber quantifier.

For Lemma2.2(ii), a class may instead be closed by an independently proved
statement for EVERY positive pairwise-distinct integer tuple in that residue
class. Bounded tuples, primitive-only tuples, or tested representatives do not
satisfy that predicate. No such whole-class certificate is manufactured here.
Generic sign/unit reductions on that third predicate need their own invariance
argument; invariance of grid/gcd properness alone is not sufficient.

## 4. Unit action: repair the reasoning, not declare the theorem false

If u′=b v′ modulo M and j/M is a good grid time for u′, the good time for v′
is bj/M. Indeed (bj/M)v′ and (j/M)u′ differ by an integer vector. The inverse
direction is valid for the opposite relation, not this one. The explicit
control M28,b5,b^-1=17,v′=(1,2,4),j2 gives good numerator10; numerator6 from
the incorrect inverse fails threshold1/4.

The simultaneous construction b≡a^-1 modp, b≡1 modl requires coprime moduli
(or compatible residues). In particular p3,l3,a2 is incompatible. Allikvere
restricts this CRT construction to gcd(l,p)=1. The lower paper Prop5.1's text
does not make that restriction and its witness-direction sentence is not
valid as written. These are localized exposition issues; this audit does not
infer that the stated theorem or the implementation is wrong.

There is a general repair. Factor l=p^e m with gcd(m,p)=1. Choose b≡a^-1 modp
and b≡1 modm. Then b is coprime to lp; it need not equal1 modl. Multiplication
by any unit modulo M preserves all gcd(l,fixed residues) predicates, and grid
times transport as above. Hence unit invariance of properness does not need
the overly strong congruence b≡1 modl. Integer scaling by b may destroy gcd(v)=1,
so an integer-class certificate restricted to primitive tuples is insufficient
for a class-wide argument after scaling.

## 5. Exact controls and what they establish

Fixed replay includes all rational phase boundaries and open-cell midpoints
for k3,13,14 and h2..32. These exhaust those finite phase partitions; the
general proof in §2 covers arbitrary h. Controls k2,h2,phase1/4 and h1,phase0
demonstrate necessary hypotheses; k3,h2,phase1/4 is GOOD at equality.

The ordered residue domains k3,p3,l4 and k3,p5,l4 include repeats and all base
classes/lifts. The first has512 grid witnesses. The second has3472 grid
witnesses,432 gcd-only branches and192 improper branches among4096 lifts:
the latter domain is not closed. In particular (2,4,1) modulo10 has no grid
witness but admits the off-grid time2/3 via a gcd shift from1/6. NO_GRID is
not a counterexample. Report consumers reconstruct these domains and their
canonical row digests; no toy result establishes global k13/14 prime coverage.

## 6. Notation reconciliation with TIP054

The source uses S=Σv and x_i=v_i/S. The shape audit uses G=(∏v)^(1/k),
u_i=v_i/max(v), q_i=1+2u_i−u_i² and Fhat²=H.
Both yield the same product:

G² Fhat² = (∏q_i) Σ v_i²/q_i = S² F_source².

Thus R=k/Fhat equals kG/(S F_source). These are aliases under different
normalizations, not conflicting bounds. This clarification does not reseal
or edit TIP054 evidence. Formal verification, author-archive replay and global
application acceptance remain out of scope.
