# Orbit-safe speed reduction for the critical exception count

Date: 2026-10-05. Status: WRITTEN_ARGUMENT / CONDITIONAL_STRATUM_REDUCTION.
Independent and Main acceptance are recorded separately in
[TIP-072Q Main completion](../verification/TIP-072Q_MAIN_COMPLETION.md).
No global LRC, literature novelty, formal proof or autonomous execution claim.

## The mathematical improvement

The previous method aligns a selected pair of exception phases. A more useful
strategy is to make ONE exception harmless for EVERY common divisor shift.
Then the other exceptions cannot exhaust the shifts. This works without exact
speed ratios, residue diversity, bounded common offsets or pair identities.

In the stratum with nine speeds divisible by five and five units modulo five,
it covers the entire region

$$V\ge2U,$$

where $V$ is the largest exceptional speed and $U$ the largest ACTUAL divisible
speed. The conclusion assumes a lower-nine witness at margin $1/10$ and gives
the full fourteen-moving-speed target $1/15$. The analogous eight-plus-five
stratum for thirteen moving speeds has threshold $V\ge9U/5$ and target $1/14$.
The remaining region is bounded in ratios, not in absolute integer speeds.

## 1. Exact orbit geometry

Write $\|x\|=\operatorname{dist}(x,\mathbb Z)$. Fix an integer $d\ge2$,
a positive integer $v$ with $\gcd(v,d)=1$, and $0<2\eta<1/d$.
The physical shift indices are $j=0,\ldots,d-1$. Multiplication by $v$
permutes their residues, hence

$$
\min_{0\le j<d}\|v(t+j/d)\|
=\min_{0\le j<d}\|vt+j/d\|
=\operatorname{dist}(vt,d^{-1}\mathbb Z)
=\frac{\|dvt\|}{d}.
$$

Thus $v$ forbids NO shift exactly when $\|dvt\|\ge d\eta$. Its orbit-safe
set is closed; its complement is the disjoint union of OPEN intervals

$$
\bigcup_{h\in\mathbb Z}
\left(\frac{h}{dv}-\frac{\eta}{v},
      \frac{h}{dv}+\frac{\eta}{v}\right).
$$

They are disjoint because $2d\eta<1$. Strict BAD means distance $<\eta$;
an endpoint with distance exactly $\eta$ is GOOD.
For $\beta=\|dv t_*\|$, the exact distance from $t_*$ to this closed set is

$$D_v(t_*)=\frac{\max(0,d\eta-\beta)}{dv}\le\frac{\eta}{v}.$$

If $\beta\ge d\eta$, keep $t=t_*$. Otherwise there is a unique nearest
integer $h$ to $dv t_*$, since $\beta<d\eta<1/2$. Put
$\delta=dv t_*-h$. For $\delta>0$ choose $t=(h+d\eta)/(dv)$; for
$\delta<0$ choose $t=(h-d\eta)/(dv)$. When $\delta=0$, the two component
boundaries are equally near: choose the LOWER boundary $(h-d\eta)/(dv)$.
Then $|t-t_*|=D_v(t_*)$, and $v$ is GOOD on all $d$ physical shifts.
This is an exact rational construction when the premises are rational.

## 2. Preserve the lower tuple, then free one exception slot

Suppose lower speeds $u_i$ are positive multiples of $d$, and an exhibited
time $t_*$ satisfies $\|u_i t_*\|\ge L>\eta$ for every lower coordinate.
Let $U=\max_i u_i$ and $R=(L-\eta)/U$.
The circle distance is 1-Lipschitz, so throughout the CLOSED interval
$I=[t_*-R,t_*+R]$,

$$\|u_i t\|\ge L-u_i|t-t_*|\ge L-UR=\eta.$$

Each subsequent $j/d$ leaves these lower phases unchanged because $d\mid u_i$.
This divisibility/shift invariance is essential; a lower tuple without it is
not covered by the argument.

Now assume there are exactly $d$ unit exceptions. If some exception $v$ has
$D_v(t_*)\le R$, Section1 constructs $t\in I$ at which it forbids zero
shifts. Each of the remaining $d-1$ exceptions visits a complete grid of
spacing $1/d$. The strict BAD arc has length $2\eta<1/d$, so each forbids
at most one shift. Their union has at most $d-1$ indices. At least one of the
$d$ physical shifts is GOOD for every exceptional and preserved coordinate.

The worst-phase sufficient condition is

$$vR\ge\eta\qquad\text{or equivalently}\qquad
v\ge\frac{\eta}{L-\eta}\,U.$$

Equality is valid: a closed lower interval can reach an OPEN BAD component's
boundary. The phase-sensitive gate $D_v(t_*)\le R$ may also pass below this
speed threshold. Failure is UNKNOWN, never an LRC counterexample; another
exception, lower witness or mathematical method may still work.

The bound $D_v\le\eta/v$ is sharp as an orbit-geometry statement: equality
occurs at $dv t_*\in\mathbb Z$. This does NOT establish optimality of the
speed threshold for full tuples or of their maximum loneliness.

## 3. Distinguish fourteen and fifteen TOTAL runners

The stationary runner is not included in the moving-speed tuple.
For $n$ moving speeds, $d$ exceptions, and $n-d$ lower speeds, a reduced
lower witness of margin $L=1/(n-d+1)$ at time $\tau$ gives
$t_*=\tau/d$. The full target is $\eta=1/(n+1)$.
Provided $2\eta<1/d$, the speed-only threshold simplifies to

$$V\ge\frac{n-d+1}{d}U.$$

For the two $d=5$ instances:

| Total / moving | Divisible lower count | Lower margin | Full target | Radius | Sufficient region |
|---|---:|---:|---:|---:|---:|
|15 /14|9|$1/10$|$1/15$|$1/(30U)$|$V\ge2U$|
|14 /13|8|$1/9$|$1/14$|$5/(126U)$|$V\ge9U/5$|

These are separate corollaries. A certificate at $1/15$ cannot be used for the
$1/14$ target. They do not independently reprove lower LRC9 or LRC8: an
explicit lower witness is checked per executable instance; invoking the lower
theorem supplies an existence premise in the universal corollary.

## 4. Genuine broadening and a hostile original-base control

Take lower speeds $5,10,\ldots,45$, $\tau=1/10$, $t_*=1/50$, and exceptions

$$(1001,1011,1021,1031,1041).$$

All exceptions have the SAME residue modulo five and no exact doubled pair.
Their original strict BAD index sets are respectively
$\{0\},\{4\},\{3\},\{2\},\{1\}$: every one of the original five
shifts fails. Same-residue signed pair coefficients $\pm1,\pm2$ permit only
$r=1$ here. Nonzero pair differences have magnitudes $10,20,30,40$;
at $t_*$ their phase norms are $1/5,2/5,2/5,1/5$ respectively. The
signed $r=1$ residual band radius is $1/15$, and available phase movement is
at most $40/(30\cdot45)=4/135<1/5-1/15$. None of these pair gates can pass
in that preserved interval. This tests the weakness of the old route, not LRC.

Select $v=1041$. The new adjusted base is

$$t=313/15615,\quad t-t_*=7/156150<1/1350=R.$$

At this base the exceptional BAD sets become
$\{0\},\{4\},\{3\},\{2\},\varnothing$. Physical shift $j=1$
gives $T=3436/15615$ with all fourteen distances at least $1/15$, and the
full minimum is exactly $1/15$. No generic strict slack is promised.
The replay retains every coordinate at every original and adjusted shift.

This is an obstruction on FIVE shifts of the exhibited base, not an archived
full-modulus NO_GRID classification. The broad conclusion comes from Sections1–3,
not this example or a sample sweep. Arbitrary independently varying exceptions
are covered whenever they are positive units and satisfy the speed-ratio region;
there is no fixed common-offset, spread or coupled pair-parameter requirement.

## 5. What has actually been reduced, and what remains

In the nine-plus-five stratum, any tuple not covered by the speed-only theorem
must have $V<2U$; in the eight-plus-five stratum it must have $V<9U/5$.
These statements quantify over ALL actual positive integer tuples satisfying
the lower premise, not only congruence representatives or a finite digit box.
They remove the high-exception tail that previously required isolated families.

They do not bound $U$, so the residual integer domain is infinite. Dividing by
$U$ bounds ratios but does not prove a finite check: lower normalized speeds
can approach zero, strict slack is not guaranteed, and normalized witness
times need not have a uniform bound. Naive compactness is therefore not an
accepted final step. Both lower and exception coordinates may grow independently
in one congruence class while moving in and out of the covered region.

A whole-branch admission still needs the actual branch's divisibility stratum,
the lower premise and a complete argument for EVERY remaining parameter region.
The retained p83 campaign has thirteen moving speeds; it does not automatically
have the eight-plus-five pattern, and the fifteen-total corollary cannot be
applied to it at the wrong target. No old branch/admission predicate is changed.

The next mathematically targeted task is the bounded-ratio core, combining
phase-sensitive gates and exact piecewise-linear lower-valid intervals, with
coverage certificates rather than arbitrarily larger speed searches. This is
a proposed next task, not already performed or silently authorized execution.

## 6. Primary literature and honest positioning

[Allikvere v2, Lemma4.6 / Section4.4](https://arxiv.org/html/2609.02604v2#S4.SS4)
uses common-divisor shifts to handle at most four exceptions for $d=5$.
Five exceptions no longer leave a spare shift automatically. Our argument
creates that spare slot through an explicit lower-preserving time adjustment.
It does not accept the article's entire archive or reprove its global result.

The interval-and-fast-phase principle is established in
[Kravitz, Barely lonely runners and very lonely runners, arXiv v1 Proposition8.1](https://arxiv.org/html/1912.06034v1#S8)
(Proposition6.1 in the published version). With loss $\varepsilon=L-\eta$,
its fast-speed threshold is $\eta U/\varepsilon$. Our construction applies the
principle to the entire divisor-shift orbit before counting the other exceptions;
ordinary one-fast-runner reasoning alone protects only the lower tuple and that
runner, not the other exceptions. We call this an orbit-safe adaptation of
known methods. Literature priority/novelty is NOT established by this comparison.

[Tao's finite reduction, Theorem1.3](https://arxiv.org/html/1701.02048#S1)
requires a separate global finite-reduction argument. The bounded ratio here
must not be described as an equivalent finite absolute-speed bound.

Research outcome: a conditional structural reduction and constructive witnesses,
not a new proof of global LRC14/15, a formal theorem-prover result, an autonomous
agent campaign or an externally adjudicated mathematical breakthrough.

## 7. Complete family: a fixed lower progression, arbitrary five exceptions

The mathematical-only [approved addendum](../contractor/tips/TIP-072Q_ADDENDUM_FULL_EXCEPTION_FAMILY.md)
closes MORE than the high-speed tail on this precise explicit family:

$$\{5,10,\ldots,45,a_1,a_2,a_3,a_4,a_5\},$$

where the $a_i$ are ANY five distinct positive integers not divisible by five.
There is no common-offset or relative-growth restriction on the exceptions.
Every tuple in this family has a time with all fourteen distances at least
$1/15$. No lower LRC input is needed; all lower distances are explicit.

### The high-speed region: a larger exact lower-valid interval

Around $t_*=1/50$, all nine phases are in their first good bands. Their
intersection is exactly

$$I=\bigcap_{u\in\{5,10,\ldots,45\}}
[1/(15u),14/(15u)]=[1/75,14/675],\qquad |I|=1/135.$$

For all $t\in I$, $1/15\le ut\le14/15$ for every lower speed, so each is
GOOD. Each endpoint is consequential: speed5 reaches $1/15$ at the left,
speed45 reaches $14/15$ at the right. Every $j/5$ preserves these phases.
This is a larger, asymmetric exact interval, not the generic symmetric radius.

If $V=\max a_i\ge18$, each orbit-unsafe component has length
$2/(15V)\le1/135$. The closed connected interval $I$ cannot lie inside
their disjoint open union: otherwise it would lie inside one component, which
is impossible even at equality. Therefore some $t\in I$ makes $V$ GOOD on
ALL five shifts. Four exceptions cannot forbid all five shifts, as in Section2.
A constructive choice is to start at $\inf I$; if already orbit-safe, keep it;
otherwise move to the RIGHT endpoint of its unique unsafe component. The move
is at most $2/(15V)\le|I|$ and stays in $I$. Equality is GOOD.

### The complete low-speed region: six exact witnesses

If $V<18$, all five exceptions lie in the exhaustive unit universe

$$A=(1,2,3,4,6,7,8,9,11,12,13,14,16,17).$$

The following table retains every one of the $6\times23=138$ coordinates.
For row $T=p/D$, entries are integer distance NUMERATORS: divide by that
row's $D$ to obtain $\|Tv\|$. The lower order is $5,10,\ldots,45$;
the exceptional order is precisely $A$ above. BAD means $15m<D$.

| Actual time $p/D$ | Nine lower distance numerators | Fourteen $A$ distance numerators | Strict BAD set inside $A$ |
|---|---|---|---|
|$16/75$|5,10,15,20,25,30,35,35,30|16,32,27,11,21,37,22,6,26,33,17,1,31,28|$\{14\}$|
|$46/75$|5,10,15,20,25,30,35,35,30|29,17,12,34,24,22,7,36,19,27,2,31,14,32|$\{13\}$|
|$106/255$|20,40,60,80,100,120,115,95,75|106,43,63,86,126,23,83,66,109,3,103,46,89,17|$\{12\}$|
|$49/60$|5,10,15,20,25,30,25,20,15|11,22,27,16,6,17,28,21,1,12,23,26,4,7|$\{11\}$|
|$23/105$|10,20,30,40,50,45,35,25,15|23,46,36,13,33,49,26,3,43,39,16,7,52,29|$\{9\}$|
|$1/75$|5,10,15,20,25,30,35,35,30|1,2,3,4,6,7,8,9,11,12,13,14,16,17|$\{1,2,3,4\}$|

The lower minima are respectively $1/15,1/15,4/51,1/12,2/21,1/15$;
all meet the target. The third time includes distance $17/255=1/15$ for
speed17; strict BAD rather than a closed exclusion is essential.

Let $B=\{9,11,12,13,14\}$. Any five-element subset $S\subset A$ with
$S\ne B$ omits at least one member of $B$. Choose the corresponding one of
the first five rows, whose sole BAD value in $A$ is that omitted member.
Then all exceptions in $S$ are GOOD. If $S=B$, the sixth row is GOOD for
every member of $B$. These alternatives cover EVERY five-element subset,
not only sampled ones. The $\binom{14}{5}=2002$ exhaustive subset checks
performed separately are calibration of this simple complete-cover proof,
not its logical basis.

Together the two regions $V\ge18$ and $V<18$ prove the entire infinite
exception family. Multiplying ALL fourteen speeds by a common positive factor
preserves the assertion after dividing the witness time by that factor.
This scaling extension does not allow arbitrary independent lower growth.

This is a complete family result, not global LRC15, arbitrary nine lower speeds,
whole archived integer branches, a novelty claim or guaranteed strict slack.
It illustrates the method we want next: exact lower geometry, an analytic
unbounded-tail reduction, then a small COMPLETE residual cover. It does not
enter the agent execution loop merely by appearing in this research dossier.
