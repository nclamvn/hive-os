# Critical 30-phase obstructions and exact connected-component coverage

Date: 2026-10-05. Written argument for TIP-072T; acceptance is in separate
Builder/independent/Main reports. No global LRC, literature novelty, formal
verification, whole archived-branch admission or native agent-loop claim.

## 1. Actual tuples, normalization and the finite phase domain

Take thirteen distinct positive integer moving speeds. Eight designated lower
speeds $u_i$ are divisible by five; the other five $v_i$ are units modulo five.
The target is $\eta=1/14$, corresponding to fourteen TOTAL runners.
Put

$$H=\gcd(u_1,\ldots,u_8,v_1,\ldots,v_5),\qquad
g=\gcd(u_1/5,\ldots,u_8/5).$$

Assume $g/H=6$. Since the exceptions are units modulo five, so is $H$.
After WHOLE-tuple division by $H$, the lower gcd is exactly30 and the whole
tuple is primitive. Write $w_i=v_i/H$. The effective periods are

$$q_i=\frac{g}{\gcd(v_i,g)}=\frac6{\gcd(w_i,6)}\in\{1,2,3,6\}.$$

The identity from072S gives $\operatorname{lcm}(q_1,\ldots,q_5)=6$.
It also follows directly prime by prime from whole-tuple primitivity.

Let $t_*$ be a supplied rational base whose EVERY lower distance is at least
$\eta$. The physical times

$$t_*+\frac{\ell}{30H},\qquad0\le\ell<30$$

preserve every lower phase. They are an ACTUAL complete30-point preserved orbit,
not thirty sample speeds. Dividing by $H$ never allows dropping its factor
from the physical time denominator. Primary groups are residue classes of
$\ell$ modulo6, with five points each. Physical $j/5$ increments correspond
to index increments $6Hj$; $H$ is a unit modulo5, so these permute the same
five-point group. A final lowest physical index must use the actual30 times.

Strict BAD means distance $<\eta$; equality is GOOD.

## 2. A complete rigidity theorem for full coverage

For a single exception, the30 phases have $5q_i$ distinct values, each repeated
$6/q_i$ times. The BAD open arc has length $1/7$. A translated $N$-grid has at
most $\lceil N/7\rceil$ points in that arc. In the four possible cases:

| $q$ | Distinct phase count | Maximum distinct BAD | Multiplicity | Maximum physical BAD |
|---:|---:|---:|---:|---:|
|1|5|1|6|6|
|2|10|2|3|6|
|3|15|3|2|6|
|6|30|5|1|5|

Thus if all30 times are blocked by the five exceptions, no $q=6$ can occur,
and ALL five BAD sets have exactly six points and are pairwise disjoint.
Otherwise their union has size strictly less than30. As the periods have lcm6,
both2 and3 occur among the remaining1/2/3 periods.

Identify indices by CRT with
$\mathbb Z_5\times\mathbb Z_2\times\mathbb Z_3$. A $q=2$ BAD set depends
only on residues modulo10; a $q=3$ set only on residues modulo15; a $q=1$
set only on residues modulo5. For a fixed residue $a\pmod5$, the disjoint
cover equation is

$$N_2(a,b)+N_3(a,c)+N_1(a)=1\qquad(b\in\mathbb Z_2,c\in\mathbb Z_3).$$

Varying $b$ and $c$ separately forces $N_2$ to be constant in $b$ and $N_3$
constant in $c$. The counts are nonnegative integers; each fiber is therefore
entirely assigned to just one type.

A saturated $q=2$ set comes from two CONSECUTIVE phase indices modulo10,
pulled back by a unit. Their physical indices have different residues modulo5
and opposite parities. It occupies two fibers partially. To complete either
fiber assigned to type2 requires a second type2 mask. Hence at least two $q=2$
exceptions occur. A saturated $q=3$ set comes from three consecutive phase
indices modulo15 pulled back by a unit. They have three distinct residues
modulo5 and all three ternary residues. Completing a type3 fiber requires
at least three type3 masks. There are only five exceptions, so their counts
must be EXACTLY two type2 and three type3, with no type1.

With just two type2 masks, each of their two touched fibers needs both masks:
their mod5 supports are the SAME two-element set $A$, with opposite parity
occupancies at each residue. The three type3 masks likewise have the SAME
three-element support $B=A^c$, with complete ternary partitions at each residue.

Conversely, saturated masks with precisely these complementary support and
occupancy properties give a disjoint cover of the30 CRT points. This is a
necessary AND sufficient condition for the ACTUAL masks. Merely having two
type2 and three type3 speeds does not assert that these properties hold.

## 3. Exactly twenty unlabeled critical signatures

The set $A$ can be chosen in $\binom52=10$ ways. For a chosen $A$, there
are exactly two type2 masks, the two opposite-parity assignments. They form
a unique unordered complementary pair. All are realizable as unit preimages
of two consecutive indices modulo10.

Every three-element subset $B$ of $\mathbb Z_5$ has exactly one three-term
arithmetic-progression ordering up to reversal. To see uniqueness, at most one
of its elements can be the midpoint: two midpoint equations would give three
times their difference equal to zero modulo5. Counting the5 possible centers
and two nonzero difference classes up to sign gives ten progressions, hence
all ten three-element subsets.

Fix one such ordering on $B$. A type3 physical progression step is a unit
modulo15: its mod5 step is fixed while its mod3 step is $+1$ or $-1$.
The ternary start is arbitrary. Consequently ALL six bijections
$B\to\mathbb Z_3$ occur, and no others. This gives60 type3 masks overall;
similarly the type2 universe has20 masks overall.

Three bijections partition the fibers precisely when their assignments are
pairwise different at every input. After one bijection is fixed, the other
two must be its two cyclic value rotations. The six bijections therefore
split into exactly two unordered triples. Thus there are

$$10\times2=20$$

UNLABELED saturated full-cover signatures. Coordinate labels can permute the
two/three exceptions; they do not create another unlabeled signature.
Lexicographically sorted masks and explicit ID tables give a deterministic
catalogue. A bounded generator using units modulo10/15 and the support
partitions is complete by the preceding proof. Its finite computation checks
a finite PHASE catalogue, not a conjectured bound on actual speeds.

### Every catalogue signature really occurs at a valid lower witness

Use $N=211$, $t_*=1/(30N)=1/6330$ and lower speeds $30(100,\ldots,107)$.
Their gcd is30 and their distances at this base exceed $1/14$.

For a desired type2 mask, choose a unit $c\pmod{10}$ and consecutive phase
indices $b,b+1$. Its central raw phase is $x=-(b+1/2)/10$ modulo1;
its two BAD phase distances are $1/20$, with strict margin $3/140$.
Prescribe the actual speed residue $v\equiv3c\pmod{30}$.
For type3 use a unit $c\pmod{15}$ and indices $b,b+1,b+2$, central phase
$x=-(b+1)/15$; BAD distances are $0,1/15,1/15$, with strict margin $1/210$.
Prescribe $v\equiv2c\pmod{30}$.

For either prescribed residue $r$, speeds $r+30k$ produce211 equally spaced
raw phases at $t_*$. Choose the nearest one to $x$, with error at most
$1/422<1/210$. All intended BAD and GOOD memberships are unchanged: outside
the two-point block the type2 distances are at least $3/20$; outside the
three-point block type3 distances are at least $2/15$. Add distinct multiples
of6330 to the chosen speeds if needed; this preserves both residues and raw
phases and ensures positive distinct exceptions separate from the lowers.
Both a type2 gcd3 and a type3 gcd2 are present, so the whole gcd is1.

This constructs ALL20 signatures at a valid lower witness. They are genuine
original-orbit obstructions, NOT LRC counterexamples. Their actual speeds
can vary without bound; no one signature has been universally eliminated.

## 4. Why another joint search in the same radius cannot improve the gate

Let $D_v$ be the exact full-period distance from072S to a base where $v$ is
GOOD on all five points of SOME primary group. Suppose the original30 points
are all blocked. In each primary group every exception forbids at most one
point (BAD arc length $1/7<1/5$). Five exceptions cover five points, so every
exception forbids exactly one in every group.

Let a joint exception-GOOD physical point be obtained after any base displacement
$\delta$. Pick an exception that originally blocked that point. On the segment
from0 to $\delta$, it first leaves strict BAD at a closed GOOD boundary.
At that boundary it cannot block another point in the same primary group:
the grid spacing $1/5$ exceeds the BAD arc length $1/7$. It is therefore GOOD
on all five points there. Thus some $D_v\le|\delta|$.

Conversely, a nearest full-period safe boundary with displacement
$\min_vD_v$ makes one exception block zero points in some primary group.
The remaining four each block at most one, so a joint exception-GOOD point
exists at that same displacement. Therefore

$$\inf\{|\delta|:\text{a joint GOOD point occurs among30 translates}\}
=\min_vD_v.$$

The closed endpoints supply an attained minimum. This statement concerns
EXCEPTIONS at a fixed preserved orbit; it does not discard lower constraints.
Simultaneous endpoint events are harmless because equality is GOOD.
When the original30 already contains a joint GOOD point, the minimum is0
even if no exception is safe on an entire primary group.

In particular, inside the SAME symmetric lower radius
$R=(L-\eta)/U$, no full-cover/all072S-fail/joint-success example can exist.
An implementation that promised such a fixture would be chasing an impossibility.

## 5. Replace the radius by the exact connected lower-GOOD component

For every actual lower $u$, put $k_u=\lfloor ut_*\rfloor$ and

$$I_u=\left[\frac{k_u+\eta}{u},\frac{k_u+1-\eta}{u}\right],\qquad
I=\bigcap_u I_u=[A,B].$$

The base is GOOD, hence lies in a unique such band for each speed. Their
intersection is the maximal connected lower-GOOD component containing $t_*$:
leaving an active endpoint enters an open BAD gap for that lower coordinate.
Degenerate single-point components and equality endpoints are legal.
Lipschitz continuity proves $[t_*-R,t_*+R]\subseteq I$, but I can be strongly
asymmetric. It can have substantial one-sided width when $R=0$.
Every translate of I by $\ell/(30H)$ is still lower-GOOD.

If the original30 contains a full GOOD point, use displacement0. Otherwise
every exception is unsafe on every primary group. For each $v$ use

$$q=g/\gcd(v,g),\quad\rho=5\eta,\quad\alpha=5vt_*,\quad
r=\rho-\frac{q-1}{2q}>0.$$

Write $y=q\alpha-(q+1)/2$, let $z$ be its nearest integer and $s=y-z$.
The nearest center is unique inside an unsafe gap. Both neighboring safe
boundary displacements are

$$\delta_v^-=-\frac{r+s/q}{5v}<0,\qquad
\delta_v^+=\frac{r-s/q}{5v}>0.$$

Their smaller magnitude is $D_v$; choosing only that nearer endpoint loses
valid possibilities in an asymmetric component.

**Exact component criterion.** A full witness exists in the thirty preserved
translates of I iff there is an original orbit witness OR some
$t_*+\delta_v^-$ or $t_*+\delta_v^+$ lies in I.

Proof: the forward implication follows the first-exit segment argument in
Section4. The segment from $t_*$ to the representation of a joint witness
stays in I. Its originally blocking exception reaches the nearest safe
boundary on that side no later than that witness; this boundary therefore
also lies in I. The reverse implication is the five-shift counting argument
at the safe boundary, with all lower coordinates GOOD throughout I.
No enumeration of other gap components, phase bands or absolute speeds occurs.

Selecting the feasible boundary by $(|\delta|,\delta,\text{original index})$
gives a nearest component witness: any joint witness would imply a boundary
no farther away, and each eligible boundary supplies a witness at its exact
displacement. Equal distances choose negative displacement, then lower original
index. The final lowest GOOD physical index is obtained from the actual30 rows.

If no boundary lies inside I and the original orbit is covered, there is no
witness in THESE preserved translates of THIS component. This is a rigorous
local exhaustion certificate, not a global LRC refutation. Other connected
components remain untouched; their systematic selection is the next problem.

## 6. A genuine upgrade and a rigorous local failure control

Use lower $7170,7200,\ldots,7380$, exceptions
$(4989,54999,86656,19996,53326)$, $t_*=1/100003$.
Every original30 point is blocked. In retained exception order, the BAD masks are

- $(0,3,10,13,20,23)$;
- $(5,8,15,18,25,28)$;
- $(2,4,6,17,19,21)$;
- $(7,9,11,22,24,26)$;
- $(1,12,14,16,27,29)$.

They exhibit the two/three saturated complementary-support shape.
The old radius is $R=377/10332309960$. Every old nearest gate fails;
the minimum nearest distance is $97217/1819830593280>R$.
But the exact lower component is

$$I=[1/100380,13/103320].$$

Every left safe boundary lies outside I, whereas every right boundary lies
inside. The closest eligible choice is speed86656's RIGHT boundary

$$\delta=34263/606610197760>R,\qquad t'=61/6065920.$$

Full GOOD physical indices are6 and21; the lowest gives

$$T=\frac{242649}{1213184},\qquad
\min_i\|v_iT\|=\frac1{14}.$$

This is a positive-displacement success on an ORIGINAL full30 cover that the
old symmetric gate misses. Its nearer LEFT boundary was invalid in I.
At base $1/100380$ for the same speeds, $L=\eta$ and $R=0$, yet a RIGHT
move $409/4349264640$ reaches the same $t'$ and final T. No strict-slack
premise can replace the exact component criterion.

Changing only the last exception to53332 gives original GOOD indices
$1,12,14,16,27,29$ while all old nearest gates still fail. Lowest index1 at
displacement0 yields $T=100033/3000090$, minimum $7170/100003$.
This is a direct-secondary observation, not a positive perturbation or an
originally covered orbit.

Conversely, use lower $(7170,7200,7230,7260,7290,7320,7350,92850)$ with the
original exceptions and base $1/100003$. The same original30 cover remains,
but $I=[1/100380,13/1299900]$ is narrow on both sides. ALL ten safe boundaries
are outside it. No witness exists in these preserved component translates;
the correct diagnostic result is UNKNOWN_COMPONENT_EXHAUSTED.

## 7. Provenance, exact replay and remaining research

The code stores full matrices losslessly using an explicit common denominator
$D=\operatorname{lcm}(\operatorname{den}(\text{base}),30H)$. Each nonnegative
integer numerator divided by D is the exact nearest-integer distance. This
representation is not coordinate omission, and does not require each entry
to be individually reduced. Complete contexts and scope are digest-bound.

Established foundations are compared directly with
[Allikvere v2 Lemmas2.2/4.6](https://arxiv.org/html/2609.02604v2) and
[Kravitz Section4/Proposition8.1](https://arxiv.org/html/1912.06034v1).
Pre-jumps, divisor-shift counting and lower-margin fast-phase intervals are
established tools. The current rigidity/catalogue/local-optimality/component
adaptation is a program-level improvement; novelty/priority has not been
externally adjudicated. Allikvere's global claim is not independently
reproduced merely by this local dossier.

The twenty signatures are complete obstruction SHAPES, not twenty bounded
speed tuples. Whole-branch admission still requires every relevant integer
lift, and global proof still requires other lower components or a justified
global selection principle. Next work should exploit exact lower components
and signature rigidity to choose a new component analytically, not enlarge
the same already-optimal local search radius or keep adding arbitrary examples.

Bounded offline replay is not browser E2E, signed runtime attestation, native
agent-loop acceptance, formal proof or external peer review. Full072 remains
PARTIAL / NOT_READY_FOR_M1; global/whole-branch/novelty/breakthrough unestablished.
