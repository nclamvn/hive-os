# LRC: sharp independent-phase shift margin and conditional stronger separation

Date: 2026-10-04. Claim status: WRITTEN_ARGUMENT / SOURCE_DERIVED_QUANTITATIVE_COROLLARY.
Final computational/review acceptance is tracked separately in
[TIP-072M Main completion](../verification/TIP-072M_MAIN_COMPLETION.md).
This is a local mathematical-method dossier, not a retained scientific case,
formal certificate, actual agent execution, external acceptance or novelty claim.

## Why this is a different target

The all-real open-arc argument at threshold1/15 was already written and reviewed
in TIP-052 and docs/operations/LRC_PROPERNESS_BRIDGE_2026-10-03.md. Repeating it
does not constitute another discovery. The new quantitative question is the
largest separation guaranteed by a finite common shift for independently chosen
exception phases. We establish both a lower guarantee and a matching obstruction.

Source context: [Allikvere, Fourteen and fifteen lonely runners, v2, Lemma4.6](https://arxiv.org/html/2609.02604v2#S4.SS4).
That lemma uses a lower-case witness for speeds sharing a prime divisor and a
union bound over exceptional shifted grids to obtain separation1/15. We reuse
that mechanism, not the author's archived enumeration or global theorem. The
minimax formulation and derivation below are our own quantitative analysis;
they are not attributed as a new theorem from the paper or claimed novel.

## Definitions and exact quantifiers

Let $\|x\|=\min_{z\in\mathbb Z}|x-z|$. Fix integers $d\ge3$ and $2\le e<d$.
For arbitrary real phases $\alpha_1,\ldots,\alpha_e$ modulo one and unit residues
$a_1,\ldots,a_e\in(\mathbb Z/d\mathbb Z)^\times$, write

$$
F(\alpha,a)=\max_{0\le j<d}\min_{1\le i\le e}
\left\|\alpha_i+\frac{a_i j}{d}\right\|.
$$

The same $j$ must work for every exception; phases and units are independently
chosen before that $j$. Units need not differ. Define

$$r=\left\lfloor\frac{d-1}{e}\right\rfloor,
\qquad\delta_*=\frac{r}{2d}.$$

We claim the sharp identity

$$\inf_{\alpha,a}F(\alpha,a)=\delta_*.$$

This is about an abstract discrete shift problem, not the optimal loneliness of
a speed tuple over all real times. A fixed speed tuple constrains its phases by
one common base time; the infimum here does not impose those extra constraints.
The written reasoning works for composite d if every a_i is a unit. The actual
diagnostic deliberately implements only the four preexisting prime d/e classes.

## Lower bound: all real phases, including endpoints

For a fixed i, unit multiplication permutes the d residues. Thus the shifted
positions are a rotated d-point equally spaced grid. Bad means STRICTLY
$\|\alpha_i+a_i j/d\|<\delta_*$. This is an open circle arc of length
$2\delta_*=r/d<1$.

Cut the circle outside that arc and lift it to a real open interval of length
r/d. If it contains k distinct grid points, the first and last span at least
$(k-1)/d$, but their span is strictly less than r/d. Hence $k-1<r$, or $k\le r$.
This also covers a wrapping arc: the real-line lift orders consecutive grid
points without changing their spacing. No rational-density inference is used.

Let B_i be the forbidden shift indices for exception i. We have |B_i|<=r for
every real phase and every allowed unit. Without any independence assumption,

$$\left|\bigcup_i B_i\right|\le\sum_i|B_i|\le er\le d-1.$$

At least d-er shifts avoid every B_i. Each has all distances >=delta_*.
Equality is GOOD. Replacing the bad open arc by a closed one would invalidate
this endpoint count at the sharp threshold.

## Upper bound: an explicit matching obstruction

Set every a_i=1 and, indexing i=0,...,e-1, choose

$$\alpha_i=-\frac{i(r+1)+r/2}{d}\pmod1,
\qquad B_i^{\rm block}=\{i(r+1),\ldots,i(r+1)+r\}\pmod d.$$

The concatenated integer blocks cover 0,...,e(r+1)-1. Since
$d-1=er+s$ with $0\le s<e$, we have $d\le e(r+1)$; consequently their residues
cover every j modulo d. If j belongs to block i, it has a representative
$j=i(r+1)+\ell\pmod d$ with $0\le\ell\le r$, and

$$\left\|\alpha_i+\frac j d\right\|
=\left\|\frac{\ell-r/2}{d}\right\|\le\frac r{2d}=\delta_*.$$

Every shift therefore has at least one distance <=delta_*, so F<=delta_*.
The lower bound proves F=delta_* on this explicit phase tuple. For every larger
threshold delta'>delta_* the same tuple leaves no common good shift. This is
an attained sharp bound, not a limiting numerical fit.

For e=d-1, the guaranteed count is one, not two. This dossier does not revive
the previously refuted universal two-survivor predicate.

## Four exact branches and conditional lifting to 14 moving speeds

| d | e | r | Sharp exception delta* | Guaranteed shifts at delta* | All14 conditional gamma |
| --- | --- | --- | --- | --- | --- |
| 3 | 2 | 1 | 1/6 | >=1 | 1/13 |
| 5 | 2 | 2 | 1/5 | >=1 | 1/13 |
| 5 | 3 | 1 | 1/10 | >=2 | 1/12 |
| 5 | 4 | 1 | 1/10 | >=1 | 1/11 |

Let u_1,...,u_14 be positive integers and d prime, with exactly e entries not
divisible by d. Assume lower LRC cases through14-e (or simply the required
lower witness for the remaining distinct speeds). For divisible entries put
$v_i=u_i/d$. A lower witness tau satisfies
$\|\tau v_i\|\ge1/(15-e)$; repeated speeds can be removed for finding the witness
then reinstated, without losing any inequality. Set t0=tau/d.

For each j, $(t0+j/d)u_i=\tau v_i+jv_i$ on divisible coordinates, preserving
their distances modulo one. Each exceptional residue u_i mod d is a unit, so
the sharp phase theorem supplies a common j achieving delta_* on all exceptions.
With $t=t0+j/d$, all fourteen moving coordinates satisfy

$$\|tu_i\|\ge\gamma,
\qquad\gamma=\min\left\{\frac1{15-e},\frac{\lfloor(d-1)/e\rfloor}{2d}\right\}.$$

The four gamma values in the table exceed1/15. Their increases over1/15 are
respectively2/195,2/195,1/60,4/165. This is a conditional separation improvement
for these divisor classes, not an independently reproved lower LRC theorem or
the classification of every residue class used by the 14/15 article.
Sharpness of delta_* does NOT prove that gamma is the best possible separation
over all real times for any such speed tuple.

### Robustness corollary: a nonzero interval, not merely one exact time

Let $U=\max_i u_i$ and $\sigma=\gamma-1/15>0$. The function distance to the
nearest integer is1-Lipschitz, so for every h with $|h|\le\sigma/U$,

$$\|(t+h)u_i\|\ge\|tu_i\|-|h|u_i
\ge\gamma-\sigma=1/15.$$

Thus the conditional construction gives a closed valid-time interval of radius
$\sigma/U$ around t, with the four exact sigma values above. This does not
construct t without the lower witness or a concrete speed tuple. It does make
the separation slack mathematically usable for later rational witness rounding:
a rational within that interval is valid, rather than an unsupported inference
from a sampled rational grid. Diagnostic code need not mint an actual witness.

### Four concrete speed tuples: no unproved lower witness in these examples

For each branch take divisible speeds $d,2d,\ldots,(14-e)d$ and exceptions
$1,2,\ldots,e$. These are14 distinct positive speeds in each listed branch.
The explicit lower witness is $\tau=1/(15-e)$: each divisible reduced speed
has distance at least $1/(15-e)$. Choosing shift j=1 gives the following exact
times. Direct evaluation of ALL14 coordinates has minimum exactly gamma:

| d,e |14 moving speeds | Exact t | Minimum coordinate distance |
| --- | --- | --- | --- |
|3,2 |3,6,...,36;1,2 |14/39 |1/13 |
|5,2 |5,10,...,60;1,2 |14/65 |1/13 |
|5,3 |5,10,...,55;1,2,3 |13/60 |1/12 |
|5,4 |5,10,...,50;1,2,3,4 |12/55 |1/11 |

For the divisible speeds, t*d*i is congruent to i/(15-e) modulo one. For
the exceptions, direct exact distances are respectively
$(14/39,11/39)$, $(14/65,28/65)$,
$(13/60,13/30,7/20)$ and $(12/55,24/55,19/55,7/55)$.
All exceed the corresponding lower margin. These examples need no appeal to
the full lower LRC theorem; they are explicit rational witnesses for four
tuples, not a proof for all tuples in a branch and not newly solved open cases.
The independent review must separately recompute every coordinate, not trust
this table or the general theorem as its numerical oracle.

## Exact controls: what they establish and what they do not

At delta_* derive every critical phase
$\pm\delta_*-a j/d\pmod1$ for each unit a. Canonical deduplication is essential:
2d*delta_*=r is integral, so the plus/minus lists can coincide. Each boundary
and each open cell between successive boundaries, including the wrap cell, must
be checked. Predicate constancy within a cell follows from continuity: no
distance crosses its threshold away from those critical phases. Boundary
evaluation treats equality separately. This written bridge covers irrational
phases as well as the exact rational representatives used by diagnostics.

Aggregate the distinct attainable forbidden masks over every unit and complete
phase partition. Exhaust its e-fold product, not a sparse random sample. Check
the exact minimum of surviving shifts and the explicit sharpness phase tuple.
Fresh independent Python Fraction arithmetic must reconstruct the same complete
content, without importing JS arithmetic or trusting supplied masks/verdicts.

These computations test implementation, finite partition completeness and
explicit rational sharpness witnesses. The universal argument is the written
proof above, reviewed independently; a passing executable test is not a proof
assistant certificate or external mathematical acceptance.

## Research value and remaining gates

This turns a binary “some shift works” mechanism into a quantitative boundary
with a matching obstruction and stronger conditional separation. It supplies
falsifiable invariants for future solver/adversary planning: distinguish necessary
independent-phase limits from phase correlations forced by actual speed tuples.
A worthwhile future direction is exploiting those correlations, not rerunning
the same four-class grid sweep and calling it a discovery.

No actual solver/review job, provider/API call, paid computation, private capture
access, DB mutation, M1 or campaign is authorized or represented by this dossier.
Old1/15 predicate, source pins, ledger7, historical refutations and UNKNOWN/FAILED
runs remain untouched. Global LRC14/15, formal proof, external acceptance and
literature novelty remain NOT_ESTABLISHED. Live loop still requires072B operation
ownership, complete executable closure, purpose-bound durable capture and exact G2.
