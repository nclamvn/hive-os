# LRC: a doubled-pair shift criterion beyond independent phases

Date: 2026-10-05. Status: WRITTEN_ARGUMENT / STRUCTURAL_DIVISOR_CLASS_COROLLARY.
Acceptance is recorded separately in
[TIP-072N Main completion](../verification/TIP-072N_MAIN_COMPLETION.md).
This dossier is not a retained agent result, formal proof or novelty certification.

## Research decision: correlation must earn its place

The previous [sharp independent-phase milestone](LRC_SHARP_SHIFT_MARGIN_2026-10-04.md)
gave a quantitative limit for fewer exceptions than shifts. Merely observing
that phases share a time does not promise a larger margin in those same classes.
Indeed, exact speed tuples with valid lower witnesses attain the previous bounds.
Instead of repeating that sweep, we isolate an EXACT relation between two speeds.

Source context: [Allikvere, Fourteen and fifteen lonely runners, §4.4](https://arxiv.org/html/2609.02604v2#S4.SS4)
uses a few-exception/common-divisor shift method. We reuse that analytical
mechanism, not the author's archive or global conclusion. The doubled-pair
criterion below is our separately derived structural analysis, not attributed
as a statement of that article. No exhaustive literature-priority audit was done.

## Main structural theorem

Write $\|y\|=\min_{z\in\mathbb Z}|y-z|$. Let $q,v$ be positive integers with
$3\nmid qv$. For EVERY real base time $t_0$, there is $j\in\{0,1,2\}$ such that

$$
\left\|(t_0+j/3)q\right\|\ge\frac19,\qquad
\left\|(t_0+j/3)2q\right\|\ge\frac19,\qquad
\left\|(t_0+j/3)v\right\|\ge\frac19.
$$

The third speed need not be $4q$ or share another exact relation with the pair.
The threshold $1/9$ is the best UNIFORM bound over this family and base times.
This is a discrete common-shift statement, not a speed tuple's optimum over
all real times and not global LRC14/15.

### Proof: the doubled pair consumes at most one shift

First normalize to $x\in[0,1/3]$ and shifts $\ell=0,1,2$. BAD means distance
STRICTLY less than $1/9$. Endpoint equality is GOOD.

For $x+\ell/3$, the BAD shift set is:

|Condition on x|BAD first coordinate|
|---|---|
|$0\le x<1/9$|$\{0\}$|
|$1/9\le x\le2/9$|empty|
|$2/9<x\le1/3$|$\{2\}$|

For $2(x+\ell/3)$ it is:

|Condition on x|BAD doubled coordinate|
|---|---|
|$0\le x<1/18$|$\{0\}$|
|$1/9<x<2/9$|$\{1\}$|
|$5/18<x\le1/3$|$\{2\}$|
|all other x|empty|

These formulas follow by intersecting each affine range with the open intervals
$(z-1/9,z+1/9)$ for integers z. They cover all real x, not sampled rationals.
The pair's BAD union is therefore contained in $\{0\}$ on the left third,
$\{1\}$ on the middle third, or $\{2\}$ on the right third. Its size is at most
one everywhere, including each boundary.

For the physical time, put

$$m=\lfloor3qt_0\rfloor,\qquad x=qt_0-m/3\in[0,1/3).$$

Since $3\nmid q$, the map $j\mapsto\ell=m+qj\pmod3$ is a bijection.
The pair's distances are exactly those above; an integer difference does not
affect either $\|\cdot\|$ or its doubled coordinate. Thus the pair forbids at most
one PHYSICAL shift. If a normalized choice $\ell$ is retained, physical
$j=q^{-1}(\ell-m)\pmod3$. Omitting the carry m is incorrect.

The three positions for v also form a rotated grid of spacing $1/3$, because
$3\nmid v$. The open BAD circle arc has length $2/9<1/3$, so it contains at most
one grid point, for any phase. This third speed forbids at most one additional
physical shift. Together at most two of three shifts are BAD. A remaining
shift proves the theorem. This does not require the third phase to be independent;
it is valid even if arbitrary independent third phases are allowed.

### Matching upper obstruction, attained at a real time

Take $q=1$, $v=4$, $t_0=1/9$. The rows below list the distances of speeds1,2,4:

|j|three exact distances|minimum|
|---|---|---|
|0|$1/9,2/9,4/9$|$1/9$|
|1|$4/9,1/9,2/9$|$1/9$|
|2|$2/9,4/9,1/9$|$1/9$|

No shift attains a larger threshold on this one exact tuple/time. Combined with
the lower theorem, the infimum of the best shift over the whole q,2q,v family
is exactly1/9. For any unit q the same obstruction is obtained by v=4q and
t0=1/(9q). This does not assert every fixed v attains that worst case.

## How this exceeds the independent-phase scope

Three independent exception phases on three shifts have no positive uniform
bound, even with the same unit residue pattern1,2,1. Take phases
$(0,1/3,1/3)$: at j0 the first coordinate is zero; at j1 the second is zero;
at j2 the third is zero. Hence the independent-phase max-min is zero.
Those phases do NOT satisfy the exact doubled-coordinate relation.

The new criterion replaces two arbitrary masks by a coupled pair whose union
is provably at most one. It handles THREE exceptions at d=3, whereas the
previous positive independent-phase result required e<d. It is a structural
extension, not just a faster or longer run of the old grid.

## Conditional lifting: both article runner counts

Let k positive moving speeds contain EXACTLY three not divisible by3:
q,2q,v with3 not dividing qv. The remaining k-3 speeds are3w_i.
Assume a lower witness tau with
$\|\tau w_i\|\ge1/(k-2)$; lower LRC(k-3) suffices, with duplicate values
removed then reinstated if needed. Put t0=tau/3.

Every j/3 shift preserves the divisible coordinates:
$(t_0+j/3)3w_i=\tau w_i+jw_i$. The structural theorem treats the three exceptions.
Consequently some actual time has all k coordinate distances at least

$$\gamma_k=\min\left\{\frac1{k-2},\frac19\right\}.$$

|Moving k|Total including stationary reference|Required lower witness|Guaranteed margin|LRC target|
|---|---|---|---|---|
|13|14|LRC(10), margin1/11|1/11|1/14|
|14|15|LRC(11), margin1/12|1/12|1/15|

We did not independently reprove those lower theorems. This conditional criterion
rules out a counterexample having the stated exact-speed/divisor structure;
it does not classify every possible LRC counterexample or prove LRC globally.
The known Lipschitz argument additionally gives radius
$(\gamma_k-1/(k+1))/\max(speed)$ around a constructed time. This robustness
consequence was already used in TIP-072M and is not advertised as this advance.

## Constructive fixed examples, with no missing lower witness

For each k in13,14 use divisible speeds3,6,...,3(k-3), with tau=1/(k-2).
Their reduced distances are explicitly at least1/(k-2). The diagnostic retains
20 exact q,2q,4q tuples for q1,2,4,5,7,8,10,11,13,14, and6 q,2q,v tuples for
(q,v)=(1,5),(2,7),(13,17), paired with both k. Every actual speed and all
coordinate distances are retained; no lower witness is inferred from a label.

For example, k14,q13,v52 has t0=1/36, x=1/36, carry m=1. A normalized h1
maps to physical j0, so t=1/36 and the minimum of all14 distances is1/12.
Carry omission need not fail every tuple, but it is consequential: k13,q14,v56
has t0=1/33, x=1/11, m=1 and q inverse2. Correct physical j0 passes;
omitting m gives j2 and t=23/33, for which the exception56 has distance
1/33<1/9. This is an actual mathematical mapping failure, not a cosmetic
serialization difference.

These fixed examples validate implementation, not the general theorem's scope.
The general conclusion rests on the all-real proof above.

## Negative controls that guide rather than inflate the method

### Correlation does not automatically improve the four older margins

Take t0=1/2, divisible speeds d*(1,3,...,2*(14-e)-1), and the following exceptions.
All reduced lower coordinates at tau=d/2 have distance1/2 and stay invariant:

|d/e|Exceptions|Best full14 distance among j/d shifts|
|---|---|---|
|3/2|1,2|1/6|
|5/2|1,4|1/5|
|5/3|1,2,3|1/10|
|5/4|1,2,3,4|1/10|

These are exact common-time speed tuples with valid lower witnesses, attaining
the previously sharp exception thresholds. They disprove a uniform strict
improvement just from sharing a time. They do NOT rule out improving the base
time or the whole speed tuple's global loneliness.

### A residue alias is not an exact doubled pair

Exceptions1,5,4 have the same residues modulo3 as1,2,4 but not the exact pair1,2.
At t0=1/15 their three shift minima are1/15,0,1/15. Complete14-speed extension:
divisibles3*(1,2,3,4,6,7,8,9,11,12,13), with tau=1/5 and each lower distance
at least1/5. Thus the full14 shift optimum is1/15, strictly below1/9.
This invalidates a residue-only gate for the stronger criterion, not LRC.

## Exact executable checks and boundaries

The fixed1,2,4 phase diagnostic derives all critical x where a coordinate
distance meets1/9:10distinct boundaries on the closed[0,1/3] domain, including
both endpoints;10boundary cells and9open cells. The report retains actual good
shift sets and the first-two BAD union. Continuity makes these predicates
constant between critical points. Endpoints are checked separately.
The three closed affine proof segments also retain all9 coordinate ranges,
which stay inside[1/9,8/9] modulo one without an internal integer crossing.
Independent Fraction reconstruction must agree on all this content, fixtures,
sharpness and negative controls, not merely a digest/verdict.

All-real reasoning is separately reviewed. A passing replay is neither a proof
assistant certificate nor external mathematical acceptance. The paired-speed
criterion is new to these program artifacts; literature novelty NOT_ESTABLISHED.
No agent job, scientific case, durable private certificate or campaign is minted.
Global/formal/external/novelty NOT_ESTABLISHED; agentLoop NOT_RUN; authority false.
Production072B atomic binding/source/runtime/phased capture/exactG2/M1 remain
separate unfinished work, not silently accepted by this mathematical diagnostic.
