# A paired-grid criterion with five exceptions

Date: 2026-10-05. Status: WRITTEN_ARGUMENT / CONDITIONAL_STRUCTURAL_EXTENSION.
Acceptance is separate in [TIP-072O Main report](../verification/TIP-072O_MAIN_COMPLETION.md).
This is not a retained agent result, formal proof or literature-novelty certificate.

## Choose a useful extension, not a larger numerical sweep

The [previous exact doubled-pair result](LRC_CORRELATED_PAIR_SHIFT_2026-10-05.md)
handled three exceptions on three shifts. Here we reuse its correlation mechanism
on five shifts to accommodate five exceptions. The relevant source context is
[Allikvere, §4.4, Lemma 4.6](https://arxiv.org/html/2609.02604v2#S4.SS4): a common
divisor preserves most coordinates while a few exceptions are handled by shifts.
The paired-grid criterion below is separately derived, not attributed to that
article or evidence accepting its full computation.

Two attractive but less useful routes were rejected during independent scans.
At divisor5 an exact doubled pair with just one arbitrary third speed still
has sharp uniform shift margin1/10: speeds1,2,7 at t0=1/10 give minima
[1/10,1/10,0,1/10,1/10]. Harmonic speeds1,2,4 have margin1/5, but the required
lower witness already bottlenecks the whole13/14-moving three-exception lift.
Neither observation should be advertised as a new all-coordinate improvement.
Instead we extend the NUMBER of exceptions beyond the independent-phase limit.

## Reusable all-real pair lemma

Write $\|y\|=\min_{n\in\mathbb Z}|y-n|$ for distance to an integer.
Let $d\ge3$, $r\ge2$ and $q>0$ be integers such that $\gcd(rq,d)=1$. Put

$$\eta=\frac1{d(r+1)}.$$

For every real base time $t_0$, consider the d times $t_j=t_0+j/d$.
The union of the strict BAD shift sets for speeds q and rq has size at most one.
Here BAD means distance STRICTLY less than eta; equality is GOOD.

### Proof, with no sampling or density assumption

Each speed is a unit modulo d, so its d positions modulo one form a rotated
grid of spacing1/d. The open BAD arc has length
$2\eta=2/[d(r+1)]<1/d$. It contains at most one point of either grid, including
arcs wrapping through zero.

Suppose q is BAD at j and rq is BAD at a DIFFERENT k. Since rq is a unit
modulo d and $0<|k-j|<d$,

$$\left\|\frac{rq(k-j)}d\right\|\ge\frac1d.$$

But the triangle inequality on the circle and $\|ry\|\le r\|y\|$ give

$$
\left\|rq t_k-rq t_j\right\|
\le \|rq t_k\|+r\|q t_j\|
<(r+1)\eta=\frac1d,
$$

a contradiction. Thus if the two grids have BAD points they share the same
index, proving the bound on their union. This holds for ALL real t0, including
negative times, and all allowed d,r,q. There is no prime requirement, but the
unit hypothesis cannot be replaced by merely nondivisibility for composite d.
For r2 it forces d odd.

If e unit exceptions include an exact pair q,rq and $2\le e\le d$, each of
the other e-2 speeds forbids at most one more shift. At most e-1 shifts are BAD,
so at least d-e+1 remain GOOD for every exception at threshold eta.
This is a reusable LOWER guarantee; no general optimality statement is made
for arbitrary d,r or every fixed speed tuple.

## Fixed five-exception theorem and exact upper obstruction

Set d5,r2. Let q,2q,v,w,z be positive integers with all five coprime to5.
For EVERY real t0, some j in0,...,4 satisfies

$$
\min_{s\in\{q,2q,v,w,z\}}
\left\|(t_0+j/5)s\right\|\ge\frac1{15}.
$$

The exact relation $2q$ is necessary to apply this criterion. The other three
speeds need no exact relation to the pair, and may have arbitrary third phases
in the counting argument. Pair BAD union at most one plus three single BAD
points leaves at least one of five shifts. Independent phases with five unit
coordinates can instead cover all five shifts and have zero uniform margin.

The bound1/15 is sharp for this common-time family. Use exceptions1,2,3,4,7
and t0=1/15. Their exact per-shift minima are:

|j|time|minimum exception distance|
|---|---|---|
|0|1/15|1/15|
|1|4/15|1/15|
|2|7/15|1/15|
|3|2/3|0|
|4|13/15|1/15|

Together with the lower theorem this establishes the best UNIFORM bound over
the stated family and base times. It is not a fixed tuple's optimum over all
real times. Another choice of base time may give larger loneliness.

## Normalized phase identities and physical carry

For exact computation normalize

$$m=\lfloor5qt_0\rfloor,\qquad x=qt_0-m/5\in[0,1/5).$$

The normalized shift $h=m+qj\pmod5$ is a permutation of physical j. Recover
$j=q^{-1}(h-m)\pmod5$, not merely $q^{-1}h$.
On the closed diagnostic domain[0,1/5], at eta1/15:

|Coordinate|Strict BAD shift indices|
|---|---|
|$x+h/5$|0 if x<1/15; 4 if x>2/15; empty otherwise|
|$2(x+h/5)$|0 if x<1/30; 2 if 1/15<x<2/15; 4 if x>1/6; empty otherwise|

These interval identities follow from intersections with the open integer
neighborhoods of radius1/15. Their union is {0} on[0,1/15), empty at1/15,
{2} on(1/15,2/15), empty at2/15, and {4} on(2/15,1/5]. This separately verifies
the triangle-inequality proof at d5 and treats equality and endpoints explicitly.

Every critical root is $x=(n\pm1/15)/c-h/5$ for c1,2. On the closed domain the
six distinct roots are0,1/30,1/15,2/15,1/6,1/5. They define six point cells and
five adjacent open cells. The strict BAD predicates are constant between these
roots by continuity and the absence of another threshold crossing. Every
endpoint and every full5x2 matrix is retained separately; representative tests
do not replace the all-real proof.

## Conditional lift to fifteen total runners

Let k14 positive moving speeds consist of nine divisible speeds5*w_i and
the five exceptions above. Assume a lower witness
$\|\tau w_i\|\ge1/10$; LRC(9) suffices. Set t0=tau/5. For every j,

$$\|(t_0+j/5)5w_i\|=\|\tau w_i+jw_i\|=\|\tau w_i\|\ge\frac1{10}.$$

The five-exception theorem then gives distance at least1/15 on ALL14 moving
coordinates, the LRC target for15 total runners including the stationary
reference. Lower LRC(9) was not independently reproved here.

The margin is at the target, not strictly above it: no positive uniform slack
or fixed robust-time radius follows from this guarantee alone. With thirteen
moving / fourteen total runners,1/15 is below1/14, so this criterion alone
does not certify that target.

The sharp obstruction has a full14-speed extension with a real lower witness:
divisibles5*[1,2,4,5,7,8,10,11,13], exceptions[1,2,3,4,7], tau1/3 and t0=1/15.
All nine lower distances are1/3, and divisible coordinates remain at1/3 for
every shift. Thus all fourteen minima equal the exception minima in the table.
This does not say the tuple fails global LRC.

## Fixed constructive and adversarial examples

The diagnostic retains eighteen other full14-speed examples with divisible
speeds5,10,...,45, tau1/10 and t0=1/50. Twelve exception tuples are scaled
q*[1,2,3,4,7] for q1,2,3,4,6,7,8,9,11,12,13,14. Six use arbitrary extras:
(q;v,w,z)=(1;3,7,11),(2;1,7,11),(3;1,2,7),(4;1,3,7),(11;2,3,7),(14;1,3,11).
All252 full coordinates were independently recomputed. The chosen shift is the
lowest actual physical good index, not a harmonic selector misapplied to extras.
Their minima are1/10 or2/25, both at least the guaranteed1/15.

Carry is consequential. The q11 scaled example has m1, inverse1, physicalj0,
normalizedh1 and time1/50, with full minimum1/10. Dropping m gives j1 and
time11/50; speed77 then has distance3/50<1/15. Not every omitted carry must
fail every example, but this one does.

A full negative residue alias has exceptions[6,17,11,23,29], with first two
residues1,2 but17 not equal12, and divisible speeds5*[1,2,3,4,5,7,8,9,10].
At tau5/6 each reduced lower coordinate is at least1/6>1/10. Nonetheless at
t0=1/6 the five full14 shift minima are[0,1/30,1/30,1/30,1/30]. This disproves
a residue-only gate for our1/15 common-shift claim, not LRC itself.

In particular, an archived residue-class representative with a doubled pair
does not establish that ALL its integer lifts retain that exact relation.
This criterion cannot discharge a whole Allikvere residue branch from such a
representative alone. The exact relation must be justified for the actual
speed tuple, or separately shown to hold over the entire family being pruned.

For the independent-phase obstruction use residues[1,2,3,4,2] and phases
[0,3/5,4/5,3/5,2/5]. Coordinate i is zero on its assigned shift i, so every
shift has a zero minimum. These first two phases violate the exact doubled
relation; this is not a common-time counterexample to the theorem.

## Conservative mathematical route selection

The strongest applicable exception bound should be retained, not replaced by
the newest method. The prior independent-phase bound is
$\lfloor(d-1)/e\rfloor/(2d)$ for e<d. At e=d, zero denotes no positive
independent-phase guarantee. The pair route requires its exact/unit premises.

|d/e|Prior independent bound|Paired bound|Prefer|
|---|---|---|---|
|3/2|1/6|1/9|independent|
|3/3|0, unsupported|1/9|paired|
|5/2|1/5|1/15|independent|
|5/3|1/10|1/15|independent|
|5/4|1/10|1/15|independent|
|5/5|0, unsupported|1/15|paired|

This is a passive fixed mathematical table, not a worker/registry update or an
execution grant. Final all-coordinate bounds must also take the lower-witness
minimum; a larger exception margin need not improve that final minimum.

## Assurance boundaries

Actual independent Fraction reconstruction compares every fixed report field,
matrix, root, cell, carry, fixture, negative witness, route and scope assertion.
It is not a proof-assistant certificate, literature-priority audit, external
acceptance or signed host/runtime/agent attestation. General mathematical claims
depend on the written proof and its separate review, not rational samples.

No generic unbounded solver, scientific case, result ledger, private certificate,
agent job or campaign is created. Production072B atomic binding/source closure,
authorized phased durable replay, human G2 and a fresh M1 remain unfinished.
Global/formal/external/novelty/breakthrough NOT_ESTABLISHED; agentLoop NOT_RUN;
executionAuthority false. This is a reusable conditional structural method,
not a closed autonomous campaign or a proof of global LRC14/15.
