# Analytic transfer to a complete lower band

2026-10-05. TIP-072U written mathematics; bounded replay and independent review
are separate. No global LRC14/15, formal proof or literature novelty claim.

## Setting

There are13 distinct positive integer moving speeds (14 total runners), target
$\eta=1/14$. Eight lower speeds are divisible by5; five exceptions are units
modulo5. Let $H$ be the gcd of ALL actual speeds and
$g=\gcd(u_1/5,\ldots,u_8/5)$, with $g/H=6$. The effective periods
$q_v=g/\gcd(g,v)$ lie in1,2,3,6. An actual original full cover, by072T,
forces exactly two2 and three3 with saturated disjoint masks. Type count alone
does not imply an actual original cover.

Physical translates by $\ell/(30H)$ preserve ALL lower phases. Every primary
group (indices congruent modulo6) has5 points, and each exceptional unit5
blocks at most one: its strict BAD arc length1/7 is smaller than1/5.
If one exception blocks none in some primary group, the other four cannot
block the entire group. Thus an exhibited lower-GOOD base at which some
exception is primary-orbit-safe supplies a full13-coordinate witness.

## 1. Exact selection of a new full band

Start with an actual lower-GOOD rational base $t_*$, and choose one lower
speed $W$ to leave temporarily unprotected. For each of the other seven
lowers $u$, set $k_u=\lfloor ut_*\rfloor$ and its containing closed band

$$I_u=[(k_u+\eta)/u,(k_u+1-\eta)/u].$$

Their intersection is $C=[c_L,c_R]$. For $W$ set $k_W=\lfloor Wt_*\rfloor$;
the old all-eight component ends at

$$B_0=\min(c_R,(k_W+1-\eta)/W).$$

Put $a=\max(c_L,B_0)$ and choose

$$K=\lceil Wa-\eta\rceil,\qquad
K_{\max}=\lfloor Wc_R-1+\eta\rfloor.$$

Then $K\le K_{\max}$ iff a COMPLETE $W$-GOOD band whose start is at least
$B_0$ exists inside this protected component. The earliest such band is

$$J=[(K+\eta)/W,(K+1-\eta)/W],\qquad |J|=6/(7W).$$

Proof: its start constraint is precisely $k\ge Wa-\eta$; its end constraint
is precisely $k\le Wc_R-1+\eta$. Taking ceiling/floor gives the exact integer
range, including equality. No search through speed-dependent numbers of bands
is necessary. If the range is empty, later complete bands cannot fit either.

When it fits, $J$ is an actual new maximal connected all-eight lower-GOOD
component: its endpoints are inside every protected band, and immediately
outside each endpoint $W$ is BAD. The band is strictly later than the old
component because its positive width prevents selecting the current $W$ band.

Failure is ONLY absence of a complete subsequent $W$ band in THIS protected
component. Partial intersections, other protected components, other choices
of $W$, and globally translated solutions are not excluded.

## 2. A phase-independent width guarantee

Fix exception $v$, effective period $q=2$ or3, and put $\rho=5\eta=5/14$.
Writing $\alpha=5vt$, primary-orbit safety on SOME secondary group is

$$\alpha\in\bigcup_{z\in\mathbb Z}
[\rho+z/q,1-\rho+z/q].$$

This follows either from the effective secondary grid or from the nearest
grid-point criterion of072S/T. The sign of the shifted grid is irrelevant
because the full residue set is symmetric. These closed SAFE intervals have
length2/7 in $\alpha$. Consecutive starts are separated by1/q. Their strict
UNSAFE complement consists of open gaps of length $1/q-2/7$. In physical time,
the largest such gaps have lengths

$$G_2(v)=3/(70v),\qquad G_3(v)=1/(105v).$$

Any closed interval of length at least $G_q(v)$ must meet the SAFE set. Otherwise
it would be contained in a single OPEN unsafe gap, impossible even at equal
length. In particular, a complete lower band $J$ contains a safe base whenever

$$W\le20v\quad(q=2),\qquad W\le90v\quad(q=3).$$

These are sufficient, not necessary, and are phase-independent. Failure of
every width gate does NOT imply there is no safe base or no LRC witness.

An exact non-enumerating witness selector is available. Let $l=\min J$,
$\alpha_0=5vl$, and set

$$z=\lceil q(\alpha_0-(1-\rho))\rceil,\quad
\alpha'=\max(\alpha_0,\rho+z/q),\quad t_v=\alpha'/(5v).$$

The chosen interval has the first right endpoint not below $\alpha_0$.
Since $2/7<1/q$, earlier intervals have already ended; hence this is the
earliest SAFE point at or after $l$. Under the width gate $t_v\le\max J$.
Equality at either endpoint is legal. Among exceptions with an actual
$t_v\in J$, choose minimum $(t_v,\text{original coordinate label})$; retain
all failed candidates. A width guarantee ensures that such a candidate exists,
but a computed phase-specific fit is valid even when every width gate fails.
Then replay the30 ACTUAL physical times, and select the lowest GOOD index.
This gives an explicit witness for every tuple satisfying the premises.

## 3. An explicit independently varying, unbounded family

Let the seven protected lower speeds have minimum $m$ and maximum $M$.
Suppose

$$27M/13\le W\le13m.$$

At the analytically chosen base $t_*=1/(14m)$ all eight lowers are GOOD in
their zeroth bands. Indeed $W>M$, $M\le13m$ and every lower lies between
$m$ and $13m$. The protected component is

$$C=[1/(14m),13/(14M)],$$

the old component ends at $13/(14W)$, and the exact selector yields $K=1$.
The COMPLETE next component is

$$J=[15/(14W),27/(14W)]\subseteq C.$$

The left inclusion follows from $W\le13m<15m$; the right inclusion is exactly
the lower bound $W\ge27M/13$.

Crucially NO extra exceptional-speed ratio is necessary for this family.
If the original30 orbit already has a full GOOD point, take it. Otherwise072T
forces exactly two type2 and three type3 exceptions with disjoint BAD masks.
Every exception $v<m$ satisfies $0<vt_*=v/(14m)<\eta$ and is BAD at physical
index0. Disjointness therefore permits AT MOST ONE such exception. At least
two of the three type3 exceptions have $v\ge m$. For either,

$$W\le13m\le13v<90v,$$

so Section2 guarantees a witness in the complete next component. This proves
LRC for EVERY tuple in this stated lower-speed family, with arbitrary five
unit5 exceptions satisfying the whole-gcd premises; no extra effective-type
count, lower-LRC assumption or exceptional-tail bound is needed. The argument
is a dichotomy, not an assertion that the original orbit must be covered.

The assumptions still include13 distinct positive speeds, exact divisibility
and whole normalization. They constrain a family rather
than all critical covers. Absolute speeds are unbounded in the written theorem;
the diagnostic's speed cap is an execution bound, not a mathematical premise.
The seven protected coordinates and exceptional speeds can vary independently
subject to the inequalities/gcd conditions. Original full cover is NOT required:
the theorem supplies either an original witness or a new-component witness.

## 4. Concrete transfer and honest refusal controls

Protected lowers7170,7200,...,7350, omitted $W=92850$, exceptions
4989,54999,86656,19996,53326. At $t_*=1/100003$ the old component from072T
is exhausted. Here $C=[1/100380,13/102900]$, $K=1$, and

$$J=[1/86660,9/433300].$$

All five width gates pass. The earliest candidate is speed19996, original
coordinate11; it is already SAFE at the new left endpoint. Actual GOOD indices
are4,5,6,14,16,19,26,29. Thus $T=34667/259980$ has full minimum1/14.
This tuple also satisfies the unbounded-family speed inequalities; that
corollary uses its own base $1/(14m)$, not the supplied base1/100003.

Replacing $W$ by7380 leaves no complete next band inside this protected C.
That is NOT an LRC failure:072T already finds a witness in its old component.
Replacing $W$ by9285000 admits a complete next band but all width guarantees
fail. Nevertheless exact phase-specific candidates86656 and53326 fit.
Selecting86656 reaches base61/6065920, GOOD indices6,21 and final
$T=242649/1213184$ with minimum1/14. The implementation accepts this exact
witness, not a deliberately weak UNKNOWN. If every phase-specific candidate
fails, absence is only of this primary-orbit-safe construction in J, not of
all joint witnesses, other components or global LRC.

## 5. Foundations and remaining gap

The interval-length argument is an adaptation of established fast-runner
interval methods, compared with [Kravitz Proposition8.1](https://arxiv.org/html/1912.06034v1).
The final few-exception shift counting
is compared with [Allikvere Lemma4.6](https://arxiv.org/html/2609.02604v2).
We do not claim that periodic-gap/interval methods were invented here.

This closes the stated conditional family and supplies a constructive band
transfer, not all20 unbounded critical signatures, all protected components,
integer-lift admission or independent reproduction of the paper's global proof.
Next work should attack the complement: failure of protected complete-band fit
or all width guarantees, using phase-aware multiple protected-band transitions
or a stronger structural argument. No browser E2E/native job/M1/campaign or
scientific admission is supplied by this unsigned offline proof/replay.
