# K6 global SOS feasibility — Builder

Status: exact full-domain lifted model and minimal degree-2 module obstruction
established; no SOS certificate/search and no global K6 lower bound.
Same all-real finite K6 target `G6>=40/31`, not a general Kakeya claim.
Owner activation 2026-10-12 13:48:12 UTC; hard stop 14:18:12 UTC.
Predecessor research remains frozen. This scope explicitly permits tiny exact
circuit counting/environment inspection, unlike the earlier hand-only runs.

## 1. Exact event inventory, with only five original parameters

Use `I_j(t)=[A_j-jt,A_j-(j-1)t]`, `0<=t<=1`, and set `A6=0` by common
translation. The five remaining A variables are unrestricted real numbers.
For `i<j`, write `d=j-i`. The distinct potentially nonzero crossing times
of the twelve affine endpoint lines are

    (Aj-Ai)/d, (Aj-Ai)/(d+1),
    and (Aj-Ai)/(d-1) when d>1.

There are exactly 15+15+10=40 affine forms in this inventory. L/L and R/R
crossings agree, accounting for the reduction from the 55 non-own,
nonparallel endpoint pairs. Own L/R crossings occur at zero. The five
other parallel pairs either never meet or coincide persistently; they
introduce no additional event height. Coincident forms need not be removed.

Clip the forty forms to [0,1], sort their values as `tau1<=...<=tau40`,
and append `tau0=0`, `tau41=1`. There are 42 event slots and 41 slabs,
including zero-width slabs. Between distinct consecutive slots every
endpoint ordering is fixed. Thus the union length is affine there.
Persistent coincidences, multiway contacts, exterior events, and all apex
orders are included. No connected-bottom or natural-order hypothesis is used.

## 2. Exact semialgebraic gates of degree at most two

For a scalar `m=min(a,b)` use ONE new variable and

    (m-a)(m-b)=0,  a-m>=0,  b-m>=0.

The equation makes m one of the two inputs; the inequalities make it their
minimum, including equality. The comparator maximum is the affine expression
`a+b-m`, requiring no new variable. Inputs below are affine expressions in
already introduced variables, so every gate equation is quadratic.

Each clipped crossing `tau=clip(c,0,1)` can instead use ONE variable with
NO equality, using

    tau>=0, 1-tau>=0,
    (c-tau)tau>=0, (tau-c)(1-tau)>=0.

For `0<tau<1`, the two quadratic inequalities imply `c>=tau` and `c<=tau`.
At tau=0 the second requires c<=0; at tau=1 the first requires c>=1.
Conversely the actual clipping satisfies them in each of these three cases.
This encoding is exact, not a convex relaxation. It also proves uniqueness.

## 3. Union length and exact quadratic objective

At each of the 41 heights tau1,...,tau41, sort the six left endpoints
`Aj-j*tau` as `s1<=...<=s6`. All interval widths are exactly tau. Hence

    ell(tau)=tau+sum_(k=1)^5 min(tau,s_(k+1)-s_k).

Proof: the first interval contributes tau, and each next interval contributes
its left-endpoint gap capped by tau. Equivalently each adjacent gap exceeding
tau is a genuine hole. Duplicate endpoints and tau=0 cause no exception.
At tau0=0 the union length is identically zero and needs no gates.

The exact objective is the quadratic polynomial in all lifted variables

    P = (1/2) sum_(k=0)^40
          (tau_(k+1)-tau_k)*(ell_(k+1)+ell_k) - 40/31.

The trapezoid formula is exact because ell is affine on every nonzero slab;
zero-width slabs contribute zero. All geometric switching heights were
included in section 1. Thus on this semialgebraic set P equals the ACTUAL
six-triangle union area minus 40/31. Every real five-apex input has a unique
value assignment for all gates, and every feasible gate assignment gives
those actual clipped/sorted values. Consequently P>=0 on this full lifted
set is equivalent to the committed all-real K6 inequality.

## 4. Specified circuit and actual counts

Sort forty clipped numbers by the standard 64-wire bitonic sorting network,
padding with twenty-four constant ones. The unpruned network has 672
comparators. Since every variable input lies in [0,1], comparisons involving
a known constant one can be performed deterministically without a variable.
Propagating this fact through the fixed network leaves exactly 388 variable
comparators, as counted by the retained tiny script. Ties at one remain exact.

Sort six left endpoints using the following 12-comparator network (zero-based
indices, each comparator places its minimum on the lower-indexed wire):

    (0,4),(1,5),(2,3), (0,2),(1,3),(4,5),
    (0,1),(2,4),(3,5), (1,2),(3,4), (2,3).

The script checks all 64 binary input words. By the sorting-network zero-one
principle this proves that the fixed network sorts arbitrary real inputs;
it is circuit validation, NOT enumeration of K6 chambers or triangle samples.
Each height then uses 12 sorting gates plus five gap-capping min gates.

For the one-variable clipping model the exact counts are:

- Original variables: 5 unrestricted apices.
- Clipping variables: 40.
- Time-sort variables: 388.
- Union-sort/capping variables: 41*(12+5)=697.
- TOTAL VARIABLES: 1130.
- Quadratic equalities: 388+697=1085.
- Linear inequalities: 2*1085+2*40=2250.
- Quadratic inequalities: 2*40=80.
- Objective degree: 2; constraint degrees: at most 2.

No separate area, endpoint, length, maximum, or trapezoid variables are hidden:
they are affine/quadratic expressions. These are counts of THIS exact circuit,
not an assertion of minimal possible semialgebraic dimension.

For comparison, encoding each clip by two ordinary min/max gates gives 1170
variables, 1165 quadratic equalities and 2330 linear inequalities. That earlier
count is correct but superseded here by the more compact exact clipping graph.

## 5. Dense low-degree SOS size and the unbounded domain

At SOS degree 2, the dense free SOS Gram has order 1131 and 640146 independent
symmetric entries. Its raw double matrix takes 10233288 bytes (about 9.76 MiB).
This matrix alone does NOT rule out a degree-2 search. Coefficient matching has
640146 monomial slots before exploiting sparsity or analytically eliminating
Gram entries. A naive dense normal system at this scale would already take
3278295210528 bytes, but such a dense normal system is NOT unavoidable.

At SOS degree 4, the dense free SOS Gram has order `C(1132,2)=640146`. Its raw
double matrix alone takes 3278295210528 bytes (about 2.98 TiB), far outside the
approved <=1 GiB intended memory. Additional inequality multipliers increase
the size. The specified dense degree-4 model is refused before construction.

A degree-2 truncated quadratic-module trial would seek an exact
identity P=sigma0+sum sigma_i*g_i+sum lambda_j*h_j at the appropriate degrees,
with SOS multipliers and arbitrary equality multipliers. This note does NOT
prove such a certificate exists or is impossible. The unbounded original
apices also mean that no compact-domain Positivstellensatz degree guarantee
can be imported. Sparse/chordal or eliminated formulations are not silently
treated as equivalent small global certificates.

Earlier exact sixth-variable elimination leaves four continuous original core
parameters, but its <=203 candidates are PER FIXED CORE, with core-dependent
feasibility domains. It is not a single four-variable polynomial certificate
or a globally affordable set of 203 SOS tests. No restriction to K5 minimizers,
positive-pair chambers, or retained minima is made here.

## 6. Existing runtimes and deliberately unexecuted SOS search

The retained script is `sos_feasibility_count_20261012.py` in this directory.
It uses only the standard library and does not construct an SDP, optimize,
sample K6 placements or enumerate geometric chambers.

Inspected runtimes:

1. `/opt/homebrew/bin/python3`: no cvxpy, scipy, sympy, numpy, clarabel, scs,
   mosek or cvxopt detected by importlib.find_spec.
2. Bundled runtime returned by the read-only workspace-dependency tool:
   `/Users/os/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3`.
   numpy 2.3.5 is present; the other seven packages above are absent.

The same count script was run under each runtime; the default runtime was
rerun once after adding the compact-clipping counts. All runs exit zero.
Tool-reported execution wall times: 0.072071042, 0.000008125 and 0.0006115 seconds.
These small counting/environment checks are separately authorized preflight,
not a use of the single reserved SOS search. There was no cvxpy solver query
because cvxpy is absent in both inspected interpreters. This inventory does
not assert that no solver exists anywhere else on the Mac.

No suitable SDP package exists in the inspected environments, and installation
is prohibited. Therefore degree-2 SOS SEARCH NOT EXECUTED. Degree-4 dense
search also refused on size. The single reserved search remains unused;
there is no numerical infeasibility, candidate certificate or PSD acceptance.

## 7. Completion scope

S1/S2: exact full-domain model and explicit counts established; Main and critic
have literally reviewed the model. S3: inspected-environment search unavailable;
dense degree4 exceeds envelope; section 8 rules out ONLY the minimal total-degree2
quadratic module. Strengthened degree2 certificates remain unknown. S4: exact
analytical obstruction checked, but no candidate lower-bound certificate to
verify and no mathematical lower-bound claim. Global K6 remains OPEN.

No dependencies installed, no optimization/SOS search, no UI/API/DB/Git write,
build, new agent, copied project, scratch directory or infrastructure. One small
retained research calculation script and this new Builder note only. Nothing
deleted; frozen predecessors preserved. Vibecode Kit only supplies the existing
review and truthful completion workflow, not mathematical acceptance.

## 8. Exact obstruction to the MINIMAL degree-2 quadratic module only

The critic proposed a two-atom linear functional. Builder independently checked
it by hand, then replayed every constraint with Fraction arithmetic in the SAME
small retained script. This is an analytical certificate-class obstruction, not
an SDP search, a K6 sample test, or a counterexample to K6.

Use equally weighted X=+2 and X=-2. In our A6=0 gauge assign

    A1=...=A5=-X, A6=0.

Every raw event is `c=q*X` with fixed rational `0<=q<=1`, including q=1 and
q=0. Assign its clip variable tau=c, WITHOUT enforcing the clip bounds pointwise.
The two quadratic clip margins vanish pointwise; the linear clip margins have
expectations 0 and 1. Thus this is not a pair of feasible lifted points.

Choose comparator branches using a fake total order of the variable coefficient
tags: larger q first. The bitonic network then outputs `tau1=X, tau40=0` with
all intermediate q descending. Pruned padding ones have artificial rank larger
than every variable tag; their deterministic routing remains the fixed pruned
circuit. Every retained comparator chooses one actual input, so its quadratic
equation vanishes pointwise. Its linear margins are multiples of X and have
zero expectation. No inequality product is being imposed here.

At every variable event slot choose fake left-endpoint order by labels 1,...,6,
and choose each gap as the min-gate output. The union expression telescopes to

    U_k = X-4*tau_k,  1<=k<=40.

All these gate equations vanish pointwise and their linear margins have zero
expectation. At the final fixed height 1 choose fake order 6,...,1, which respects
the expected left endpoints -j. Sorting margins therefore have nonnegative
expectation. Choose each gap in the capping gate again. The gaps are 1-X,1,1,1,1;
the nonzero cap margin is X with zero expectation. This gives `U_41=6-X`.
The stipulated initial length remains `U_0=0`.

The signed trapezoid expression is exact algebra on these auxiliary values:

    first slab = -3*X^2/2,
    all middle slabs = X^2,
    last slab = 3,
    G_lifted = 3-X^2/2 = 1 at both atoms.

Therefore the functional L satisfies

    L(s^2)>=0 for every polynomial s,
    h_j=0 at both atoms for every one of 1085 equations,
    L(g_i)>=0 for every one of 2330 inequality margins,
    L(P)=-9/31<0.

In the STANDARD total-degree-2 quadratic module, the multiplier of either a
linear or quadratic inequality can only be a nonnegative constant (a globally
nonnegative SOS of degree at most one is constant). Each quadratic equality
multiplier is constant. Thus applying L to a putative identity

    P = sigma0 + sum_i c_i*g_i + sum_j lambda_j*h_j,
    sigma0 SOS degree<=2, c_i>=0, lambda_j constant,

would give L(P)>=0, a contradiction. This proves NO certificate of THIS minimal
degree-2 quadratic-module form for the specified exact circuit.

Strict limitation: a full preordering allows products of inequality generators.
Already the valid redundant inequality `tau1*(1-tau1)>=0` has expectation -4
on these assignments and kills the diagnostic. A strengthened degree-2 module,
other lifting, sparse certificate or higher degree is NOT ruled out. The two
atoms are not feasible K6 geometries with these auxiliary values, so neither
the actual model nor K6 is refuted.

Observed replay: exit zero in 0.096778666 seconds, clock 13:57:04 UTC. It checks
all 1085 pointwise equations and all 2330 expected margins with exact rationals;
the two displayed expectations are -9/31 and -4. No numerical solver ran.
Total preflight processes so far: four, all exit zero; no reserved SOS search.

Main independent exact replay: exit zero, reported execution wall 0.05960175
seconds at observed 13:58:16 UTC. This is a fifth preflight process team-wide,
not a Builder rerun or an SDP search. Main also fully read the model and narrow
obstruction. No more process or strengthened-module trial is authorized here.

Updated S3 disposition: minimal degree-2 module analytically obstructed;
strengthened degree-2 search not executed because no SDP solver was found in
the inspected environments; dense degree4 exceeds the envelope. This is model/
certificate feasibility, not a new global lower bound or root milestone.

Builder new derivation STOP observed 13:59:11 UTC, before the unchanged
14:18:12 hard stop. Subsequent work is literal wording/review records only.
Stop reason: chosen model/class feasibility assessment complete, no available
solver for the untested stronger class; not a proof that all SOS routes fail,
and not exhaustion of the time envelope. Only this note and the one retained
small counting/diagnostic script changed. All older proof/report bytes frozen.

Final independent critic FULL section 8 and entire retained script review was
received by Builder at observed 13:59:57 UTC: all 1085/2330 checks, fake ranks,
gauge, -9/31 obstruction and -4 redundant-product distinction accepted within
the stated minimal-module scope, with no blocking correction. Critic reported
its own derivation STOP at 13:59:02 UTC and executed no script or solver.
The padding rank in the replay is explicitly +infinity; it is a logical
sorting tag, not a replacement for the numerical padding value one.
