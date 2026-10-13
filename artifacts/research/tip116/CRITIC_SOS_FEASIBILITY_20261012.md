# K6 global SOS feasibility — independent critic

Status: exact full-domain model/count review accepted; a STANDARD truncated
degree-2 quadratic-module obstruction is proved below. No K6 lower bound,
numerical SDP infeasibility or all-SOS impossibility is asserted.
Owner activation13:48:12UTC / hardstop14:18:12UTC on2026-10-12.
This owner-approved feasibility scope is distinct from frozen R9 hand-only
records. Only this new critic note is writable here.

Required AGENTS, commitment protocol, latest active/handoff checkpoint,
TIP116 charter, new SOS scope, FULL local Vibecode skill and its TIP/report
reference were read before task actions. The skill governs scope/review and
truthful reporting, not mathematical evidence.

## 1. Full-domain exactness and ties

Normalize A6=0 by common translation; five unrestricted real apices remain.
For i<j and d=j-i, all nonconstant event-height forms are

    (Aj-Ai)/d, (Aj-Ai)/(d+1), and (Aj-Ai)/(d-1) if d>1.

There are15+15+10=40 forms. Left/left and right/right events agree because
all intervals have the SAME width t. Own left/right events are t=0;
the five other parallel edge pairs are either disjoint or persistently
coincident. They create no missing isolated height. Clip all40 forms to
[0,1], sort, and append0,1:42 slots and41 slabs, with repeated heights
retained. Between distinct consecutive heights the entire endpoint order
is fixed; union length is affine. Persistent/multiple contacts do not
require a generic-position argument or additional event.

Builder's one-variable clipping graph is exact:

    tau>=0, 1-tau>=0,
    (c-tau)tau>=0, (tau-c)(1-tau)>=0.

Interior tau forces c=tau; tau0 requires c<=0 and tau1 requires c>=1.
The ordinary min gate `(m-a)(m-b)=0, a-m>=0, b-m>=0` also uniquely gives
the actual minimum, including equality; maximum is a+b-m. All inputs are
affine expressions, so these gate polynomials have degree at most2.

At every variable event height and at1, sort the six left endpoints s_k.
The actual union length is

    ell(t)=t+sum_(k=1)^5 min(t,s_(k+1)-s_k).

This equal-width identity includes arbitrary spatial order, detached
components, repeated endpoints and t=0. At height0 the length is identically
0. Trapezoidal integration over all41 slabs is consequently EXACT, giving
a quadratic objective G6-40/31 on the lifted graph. All-real apices and
unbounded translations modulo the fixed gauge are covered. No K5 minimum,
connected bottom, natural order or actual-minimum restriction is introduced.

## 2. Actual specified sizes, not original dimension

FULL Builder note and retained count-script source were inspected. I did
not execute its script. The specified40-input padded/pruned bitonic sorter
has388 variable comparators; Builder's separately authorized exact count
records establish that number. Each of41 union evaluations uses12 six-sort
comparators plus5 min-gap gates. The resulting model has

    5 originals +40 clips +388 time-sort +697 union auxiliaries =1130 variables;
    1085 quadratic equalities;
    2250 linear inequalities and80 quadratic inequalities;
    objective degree2.

No length/area/maximum variables are hidden. The six-sort network is validated
by Builder's64 binary words and the zero-one principle, which is a sorter
check, not K6 sampling. The pruned fixed sorter treats padding as a known
upper sentinel; ties at1 preserve values. These counts describe THIS circuit,
not a minimum possible lift.

Dense free SOS Gram orders are1131 at degree2 and640146 at degree4.
Raw full-double storage is10,233,288 bytes and3,278,295,210,528 bytes,
respectively. Degree2's approximately10MB matrix alone is not an impossibility
argument. The specified dense degree4 matrix alone exceeds the approved1GiB
envelope by orders of magnitude, even before multipliers. Sparse/chordal or
different formulations are not ruled out by that dense count.

## 3. Exact obstruction to the minimal STANDARD degree-2 module

Consider only the conventional total-degree<=2 quadratic-module certificate

    F = sigma0 +sum_i lambda_i g_i +sum_j nu_j h_j,

where F=G6-40/31, sigma0 is a sum of squares of affine polynomials,
lambda_i>=0 are constants, and nu_j are arbitrary constants. All nonconstant
SOS multipliers would exceed this degree for the stated linear/quadratic
constraints. This is NOT a preordering containing products of inequalities.

Use the real two-atom expectation X=+2 or-2 with equal weights. Assign the
five original apices A1,...,A5=-X and A6=0. Every raw event form is qX with
q>=0; some q=1 and some q=0. Set every clip output equal to its RAW input
c rather than its actual clipped value. Both quadratic clip margins vanish
pointwise, while the linear margins have expectations0 and1.

At each comparator choose a fixed input branch, so every min-gate equation
vanishes POINTWISE. For time sorting, select branches according to descending
coefficient q: the fake minimum is the larger coefficient. A comparison
network sorts any imposed total order; regard the pruned sentinels as above
all variable ranks. Its final values therefore have tau1=X and tau40=0.
Every variable time comparator inequality is linear in X with mean0.

At every variable knot, select six-sort branches by label order1,2,...,6,
not by the actual random endpoint values. Choose each gap-cap min output
equal to its GAP input. All of those gate equations vanish pointwise;
all their linear margins have mean0. Since the sorted first/last left
endpoints are L1=-X-tau and L6=-6tau, the resulting formal length is

    ell_k=tau_k+(L6-L1)=X-4tau_k,  k1..40.

At fixed height1 select label order6,5,...,1, whose EXPECTED endpoints
are correctly ordered -6,...,-1. Choose each gap cap equal to its gap.
Comparator inequalities have nonnegative expectation; gap-cap margins
have expectation0. The resulting length is ell41=6-X. Set ell0=0.

The exact objective polynomial, evaluated on this deliberately NONFEASIBLE
pointwise assignment, is

    first slab = -3X^2/2;
    middle39 slabs = X(tau40-tau1)-2(tau40^2-tau1^2)=X^2;
    last slab =3;
    G_formal=3-X^2/2=1.

Thus E(F)=-9/31<0. But E(sigma0)>=0 for any affine-square SOS, E(g_i)>=0
for every stated generator, and E(h_j)=0. Applying this expectation to
the proposed degree2 identity gives a contradiction. Hence this STANDARD
minimal quadratic-module certificate does not exist for the specified lift.
The atoms are not actual feasible geometry and are NOT a K6 counterexample;
their use is a rigorous linear-functional obstruction to a truncated proof.

Important limitation: the valid redundant inequality tau(1-tau)>=0, or its
degree2 preordering product, has expectation -q^2 E(X^2)<0 whenever q>0.
It defeats this construction. Therefore neither all degree2 SOS methods,
strengthened quadratic modules, full preorderings, degree4 certificates,
nor the mathematical target are ruled out. High-degree equality multipliers
with cancellations are also outside the explicitly truncated identity.

## 4. Why a single original-variable polynomial does not replace the lift

G6 is bounded above by3 everywhere, equals3 on an open set of separated
apices, and equals40/31 at the retained sharp construction. No single
polynomial in the five original unrestricted variables can equal G6:
agreement with3 on an open set would make that polynomial identically3.
The same argument excludes a single everywhere-defined rational formula.

An original-variable polynomial p certified globally as p>=40/31 and
satisfying p<=G6 everywhere is bounded above AND below, hence constant.
This rules out a nonconstant unconstrained polynomial/SOS lower calibration,
not domain-constrained, min/max-lifted, signed or sparse certificates. A
constant lower bound would still need the missing actual union proof.

## 5. Review/resource boundary

FULL Builder initial note was read after the13:56:17UTC clock and reviewed
before the13:58:33UTC recording checkpoint; representation and counts accepted.
Its degree2 wording must distinguish module from preordering;
that correction was sent and then applied. Main and Builder independently checked the above
expectation construction and its limited scope. No numeric search or solver
subprocess was performed by critic. Builder's counting/environment checks
are separately authorized preflight, not mathematical K6 samples and not
the single reserved SOS search.

Global K6 remains OPEN. Exact representation and scoped feasibility are not
a new lower bound, whole inversion closure, formal acceptance or novelty claim.
No predecessor file, dependency, UI/API/DB/Git state or infrastructure changed
by critic. Only this new Markdown was created; no scratch copies or deletion.

## 6. Completion and actual stop

Critic NEW DERIVATION STOP observed13:59:02UTC following Main's finalization
routing. No further mathematical exploration, new degree/template or search
follows. This is early scoped feasibility completion, not exhaustion of the
14:18:12 hard stop and not an impossibility result for every SOS route.

FULL Main completion draft, Builder's revised sections7–8 and the complete
retained count/replay script were inspected before final recording. The
exact graph/circuit counts and standard-degree2 dual obstruction check.
Main was asked to state the pruned padding's artificial +infinity ordering
tag explicitly; its numeric assignment remains1, and its fixed pruning
routes are unchanged. No other blocking mathematical correction was found.
That initial review did not include the final Main metadata version. FULL final
Main completion was subsequently read at observed14:00:27UTC, including the
explicit padding-tag clarification, five authorized preflight/replay process
records and separate stops. Accepted without blocking correction: no SDP
search ran, no solver infeasibility or global SOS impossibility is claimed,
and the root remains OPEN. Main/critic stops are13:59:02UTC; Builder records
13:59:11UTC. These are distinct observed records, not an inferred synchronous
team stop. The reviews are independent AI hand review, not formal/external
acceptance. Final critic recording is after that read, with no new derivation.

S1/S2 are established for the stated exact circuit. S3: the minimal standard
degree2 module is analytically obstructed; the specified dense degree4
formulation is refused on size; strengthened degree2/preordering searches
remain untried and no suitable SDP package was found in the two INSPECTED
environments. This is not global software absence, and the reserved SOS
search was not used. S4: no target certificate or PSD recovery to verify.

Whole K6 lower-bound closure: ZERO. No whole competing-minimum class is
excluded. This is a prerequisite/feasibility assessment only, independently
AI hand-reviewed and exactly replayed, not external or formal mathematical
acceptance. Earlier history and false geometry-only(P) remain frozen.

Critic ran no arithmetic/calibration/solver subprocess. Builder/Main's
separately authorized tiny exact preflight/replay runs are not counted as
K6 samples or numerical SOS trials. No installation, new infrastructure,
new agent, build, UI/API/DB/Git mutation, scratch copy or deletion. One
ordinary source read initially used the wrong TIP116 path; the correct
charter path was resolved and read. This was not a failed solver start.

EN: The exact all-domain lift is verified, but its minimal degree2 module
cannot prove the bound; dense degree4 exceeds the envelope. Stronger
formulations are not ruled out. K6 remains OPEN.

VI: Biểu diễn nâng biến toàn miền là chính xác; môđun bậc2 tối giản bị
loại bằng chặn đối ngẫu đúng, còn bậc4 dạng đặc vượt ngân sách. Chưa loại
mọi mẫu mạnh hơn và chưa có chứng chỉ cận dưới K6. K6 vẫn OPEN.
