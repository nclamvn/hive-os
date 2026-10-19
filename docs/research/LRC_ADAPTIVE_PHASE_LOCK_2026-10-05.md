# Adaptive phase locking across integer lifts

Date2026-10-05. Status WRITTEN_ARGUMENT / CONDITIONAL_METHOD_EXTENSION.
Acceptance separate in [Main report](../verification/TIP-072P_MAIN_COMPLETION.md).
No formal/literature-priority/global LRC or retained-agent-result assertion.

## Why the previous result cannot prune an entire residue branch

The primary [Allikvere article, §2 and §4.4](https://arxiv.org/html/2609.02604v2#S2)
defines independent coordinate lifts and its third prime-criterion alternative
requires every positive distinct integer vector in the specified congruence class.
The article's common-divisor predicates persist under its lifts; an exact doubled
speed identity need not. We do not independently accept its complete archive.

The repository matches those quantifiers:
[modular axes](../../src/modules/research-sandbox/math-lrc-modular-certificates.ts)
are independent; [properness](../../src/modules/research-sandbox/math-lrc-properness.ts)
uses inherited divisibility, and [prime criterion](../../src/modules/research-sandbox/math-lrc-prime-criterion.ts)
requires EVERY positive distinct integer lift. Finite digit boxes and infinite
integer congruence classes are different domains.

For actual integer lifts $v_i=w_i+Mz_i$,

$$v_j-2v_i=(w_j-2w_i)+M(z_j-2z_i).$$

Thus the identity requires a coupled parameter equation, not just the residue
relation $w_j\equiv2w_i\pmod M$. For a general affine parametrization
$v_i(z)=a_i+B_i z$, fixed-pair identity holds throughout a full-dimensional
parameter cone exactly when $a_j=2a_i$ and $B_j=2B_i$.

Allowing the chosen pair to change does not fix this obstruction on a full
integer orthant. Suppose no candidate pair defect polynomial is identically
zero. Their finite product is nonzero, since a polynomial ring over the reals
is an integral domain. A polynomial vanishing on every integer orthant point
must be zero: induct on the number of variables, using infinitely many roots
in the last variable, then the same argument on every coefficient polynomial.
Therefore finitely many proper pair hyperplanes cannot cover that orthant.
This does not assert the same conclusion for a small finite prime-digit box
or a family with extra parameter coupling.

A direct independent-lift construction is also available: for residues
$0\le w_i<M$, take $z_i=4^{i+1}$ in label order. Each next actual speed is
strictly more than twice its predecessor, hence no two actual speeds form a
doubled pair. This is a property of the unrestricted class, not an assertion
about canonical survivor predicates.

Concrete14-speed relation-loss control: $M=15\cdot83=1245$,
nine divisibles $5,10,\ldots,45$, representative exceptions $(1,2,3,7,11)$.
The congruent exceptions $(1,1247,3,7,11)$ contain no exact doubled pair.
Both full tuples are positive, distinct and primitive, with no speed divisible
by83. This generic class is NOT asserted to be retained improper in the archive.
It is not an LRC counterexample.

## Residual phase lemma: exact speed equality is stronger than needed

Let integers $d\ge3,r\ge2$, and positive unit speeds $a,b$ modulo $d$ satisfy
$b\equiv ra\pmod d$. Put $\Delta=b-ra$ and $\beta=\|\Delta t_0\|$.
Choose $\eta>0$ with $2\eta<1/d$ and

$$(r+1)\eta+\beta\le1/d.$$

On the $d$ shifts $t_j=t_0+j/d$, the union of strict BAD indices for $a,b$
has size at most one. BAD means distance strictly below $\eta$; equality is GOOD.

Each coordinate visits a complete unit grid and the BAD open arc has length
$2\eta<1/d$, so each coordinate forbids at most one index. Because $d\mid\Delta$,
$\|\Delta t_j\|=\beta$ for EVERY shift. If $a$ is BAD at $j$ and $b$ at a
different $k$, unit spacing and the circle triangle inequality give

$$
1/d\le\|b(k-j)/d\|
\le\|bt_k\|+r\|at_j\|+\|\Delta t_j\|
<(r+1)\eta+\beta\le1/d,
$$

a contradiction. With $e\le d$ unit exceptions containing the pair, at most
$1+(e-2)=e-1$ shifts are forbidden. There are at least $d-e+1$ common GOOD shifts.
This condition is sufficient, not necessary.

At $d=5,r=2,\eta=1/15$ it requires $\beta=0$. At $d=3,r=2$, targets1/15
and1/14 allow residual norms at most2/15 and5/42 respectively. No executable
general-divisor solver is included in this task.

## Adaptive time theorem: preserve lower coordinates while aligning phases

Suppose all lower-preserved positive integer speeds are divisible by $d$
(or their phases are separately proved invariant under EVERY $j/d$).
At a real time $t_*$ their distances are all at least $L>\eta$.
Let $U$ be their largest ACTUAL speed, not the largest exceptional speed.
Set

$$R=(L-\eta)/U,\qquad \rho=1/d-(r+1)\eta\ge0.$$

The distance-to-integer function is1-Lipschitz. For every
$t\in[t_*-R,t_*+R]$ and every preserved speed $u$,

$$\|ut\|\ge\|ut_*\|-u|t-t_*|\ge L-UR=\eta.$$

Divisibility by $d$ then preserves these coordinates at EVERY later $t+j/d$.
That premise is essential: a nearby lower witness alone does not guarantee
invariance at the subsequently selected shift.

For $\Delta\ne0$, the set of phase-lockable base times is

$$\mathcal B=\{t:\|\Delta t\|\le\rho\}.$$

Since $0\le\rho<1/2$, this is a periodic union of closed bands with halfwidth
$\rho/|\Delta|$ around $n/\Delta$. The exact distance from $t_*$ to this set is

$$
\operatorname{dist}(t_*,\mathcal B)
=\frac{\max(0,\|\Delta t_*\|-\rho)}{|\Delta|}.
$$

This follows by first taking the nearest integer in the $\Delta t$ coordinate,
then subtracting the band's closed radius. Consequently, if

$$
|\Delta|R\ge\max(0,\|\Delta t_*\|-\rho),
$$

some adjusted base remains inside the lower-valid interval and satisfies the
residual lemma. One of its common shifts is GOOD for all coordinates.
The worst-phase sufficient condition is $|\Delta|R\ge1/2-\rho$.
Failure of either sufficient test is UNKNOWN, not a mathematical counterexample.
If $\Delta=0$, the old exact-pair theorem applies directly at $t_*$.

This is an all-real interval argument, not inference from a sampled sweep.

## Fixed constructive corollary for15 total runners

Let14 positive distinct moving speeds consist of nine speeds divisible by5 and
five units modulo5. Among the five exceptions select $a,b$ with $b\equiv2a\pmod5$.
For reduced lower speeds $w_i=u_i/5$, exhibit $\tau$ with
$\|\tau w_i\|\ge1/10$. Lower LRC9 suffices for existence; it is not reproved.
Set

$$t_*=\tau/5,\quad U=\max_i u_i,\quad R=1/(30U),\quad\Delta=b-2a.$$

If $\Delta=0$, or

$$|\Delta|/(30U)\ge\|\Delta t_*\|,$$

the tuple has a constructive common-shift witness at threshold1/15.
For nonzero defect choose a nearest integer $n$ to $\Delta t_*$,
breaking ties toward the LOWER integer, and set $t=n/\Delta$.
Then $\Delta t=n$ and $|t-t_*|=\|\Delta t_*\|/|\Delta|\le R$.
The residual relation remains zero at $t+j/5$, and at least one of the five
shifts passes all fourteen coordinates. The offline helper chooses the LOWEST
physical passing index, not a normalized shift without carry.

A sufficient speed-only condition is

$$|\Delta|\ge15U.$$

Unlike the old exact pair, this covers tuples with a large nonzero defect.
It is not necessary: $\Delta t_*$ can already be an integer for smaller defects.
No primitive-gcd restriction is needed by this corollary; all coordinates are
handled directly. A scaled valid tuple remains valid after adjusting its witness.

The guaranteed all-coordinate margin is1/15, not strict slack. This does not
certify the1/14 target for14 total runners, nor prove global LRC14/15.

## An infinite congruence subfamily, not an entire unconstrained branch

Take divisible speeds5,10,...,45, and exceptions

$$(1,\;2+1245z,\;3,\;7,\;11),\qquad z\in\mathbb Z_{\ge0}.$$

The fourteen speeds are positive and distinct. All have constant residues
mod1245. The lower witness is $\tau=1/10$, reduced speeds1,...,9,
lower minimum1/10, $t_*=1/50$, $U=45$.
For $z=0$ use the exact pair. For every $z\ge1$,

$$|\Delta|=1245z\ge1245>15\cdot45=675.$$

The adaptive theorem therefore proves the LR property for ALL $z$ in this
infinite subfamily, using the explicit witness construction, not finite samples.
This is a derivation new to these program artifacts, not a literature-priority claim.
The instance checker has finite speed/component limits; the written proof has
the stated infinite quantifier independently of those executable limits.

This does NOT cover the full congruence class where the nine divisible speeds
can also grow independently. For example change45 to $45+1245=1290$ while keeping
the exceptions at $z=1$. The same reduced lower witness remains valid
(last lower distance1/5), but $U=1290$, defect1245, and the speed-only dominance
test fails. Even the exhibited-witness test fails:
$\|\Delta/50\|=1/10>1245/(30\cdot1290)$.
There may be another base witness or another method; no LRC failure follows.

### Stronger explicit margin on precisely this subfamily

The separately reviewed mathematical-only TIP addendum strengthens this SAME
family, not the generic adaptive criterion. For $z\ge1$ put

$$h_z=\lfloor(z+5)/10\rfloor,\quad n_z=25z-h_z,\quad
t_z=n_z/(1245z),\quad T_z=t_z+1/5.$$

This gives the LOWER nearest-integer tie for $1245z/50=249z/10$.
For $1\le z\le4$, $h_z=0$ and rounding error is $z/10$.
For $z\ge5$, the nearest-integer error is at most $1/2\le z/10$.
Consequently

$$|t_z-1/50|=\frac{|z/10-h_z|}{1245z}\le1/12450.$$

For $z=0$ take $t_0=1/50,T_0=11/50$ separately.
The nine lower coordinates at $T_z$ therefore have minimum at least

$$1/10-45/12450=8/83>1/15.$$

This uses only their actual maximum45 and divisibility-preserved phases.
Moreover

$$T_z\in[11/50-1/12450,11/50+1/12450]\subset[1/5,5/22].$$

On the latter interval $\|T\|\ge1/5$, $\|2T\|\ge2/5$,
$\|3T\|=1-3T\ge7/22$, $\|7T\|\ge2/5$, and
$\|11T\|=11T-2\ge1/5$. For the second exception,
$(1245z)T_z=n_z+249z$ is integral, so its phase equals $2T_z$.
Thus all five exception distances exceed the lower bound8/83.
The full fourteen-speed minimum is uniformly at least8/83 for ALL $z\ge0$.

At $z=1$, $T_1=274/1245$ and speed45 has distance8/83, so this bound is
sharp for the PRESCRIBED CONSTRUCTED WITNESS FAMILY. It is NOT a tuple's
best loneliness over every possible time. The particular subfamily has
certified slack $8/83-1/15=37/1245$. This does not supply strict slack for
the generic adaptive criterion or the full independent integer-lift cone.
The universal basis is the two parameter regions and interval inequalities,
not finite enumeration of $z$.

## Avoid a circular modular “improvement”

If $d\mid M$, $b\equiv ra\pmod M$, and $t_0=h/M$, the pair is phase aligned for
EVERY integer lift in that class, even without exact speed equality.
But every subsequent shift $t_0+j/d$ is still on the SAME $M$-grid.
If the lower witness and common-shift argument give a full witness there, the
class was already GRID-good. This cannot newly eliminate a branch declared
NO_GRID on that grid without contradicting its finite premise.
Adaptive phase locking above can use a different rational time and is not
restricted to that grid; it still needs its own quantitative lower interval.

## Reproducible exact instances and honest result categories

The small fixed diagnostic keeps six full14-speed cases, not an unbounded
search. Divisibles5..45 and $\tau=1/10$ throughout:

| Exceptions | Defect | Purpose |
|---|---:|---|
|1,2,3,7,11|0|old exact-pair specialization|
|1,52,3,7,11|50|below dominance but already phase aligned|
|1,677,3,7,11|675|dominance boundary, closed radius and positive tie|
|338,1,3,7,11|-675|negative defect, lower-integer tie|
|1,1247,3,7,11|1245|same-residue subfamily z1 without exact pair|
|1,7,3,4,11|5|alignment gate not applicable, but original grid has witnesses|

For675, $\Delta t_*=27/2$, lower tie chooses13, adjusted base13/675;
for−675, lower tie chooses−14, adjusted base14/675.
Both adjustments have absolute value1/1350, exactly the allowed radius.
Closed endpoint admissibility is consequential.

The small-defect control has pair BAD indices0 and2 at the initial base, and
cannot reach phase alignment in this preserved interval. Yet initial shift
minima are1/50,1/10,3/50,1/10,1/50: indices1 and3 already work.
It must remain UNKNOWN_GATE_NOT_APPLICABLE with separately retained observed
full-coordinate witness. Do not relabel sufficient-test failure as refutation.

## Architectural and research limits

The new script/test are explicit offline research arithmetic only; no TS,
Next.js, UI, schema, worker, registry, case, job, DB or provider integration.
Complete matrices and scopes are retained under unchanged5s/2M/32KiB ceilings.
Independent proof review and direct exact replay are separate acceptance evidence.
No signed host/runtime/interpreter attestation or scientific admission is granted.

Actual072B CAS/current lease/native provenance/executable closure, authorized
phased durable capture/pre-critic independent replay/humanG2 before one freshM1
remain unfinished. Existing private capture root stays untouched/unauthorized.
Global/formal/external/novelty/breakthrough NOT_ESTABLISHED; agentLoop NOT_RUN;
executionAuthority false. The next research decision is to partition remaining
parameter space and choose a different structural route for unclassified regions,
not to keep testing one representative or claim this infinite SUBfamily is whole
branch coverage.
