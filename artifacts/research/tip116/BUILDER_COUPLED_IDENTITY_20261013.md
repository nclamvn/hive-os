# Exact saved coupled SOS template — Builder rejection proof

Status: rigorous rejection argument for the FROZEN 409-PSD template;
FULL literal review ACCEPTED by Main and independent critic. NOT a K6
counterexample or all-SOS impossibility.
Same all-real finite K6 `G6>=40/31`, PUBLIC_DISCOVERY.
Activation 2026-10-12 23:39:19 UTC; hard stop 2026-10-13 00:09:19 UTC.
Only hand mathematics/source reads/this new note. No mathematical process.

## 1. Precisely the template being tested

The model and grammar are frozen in section 10 of
`BUILDER_SPARSE_SOS_20261012.md`: 578 variables, five original apices A
(A6=0), five Boolean/sign flags b, forty distinct clip variables tau_e,
and explicit coverage-sort/union-max wires.

Write `P=G_lifted-40/31`. Its polynomial degree is two. A proposed identity is

    P = sum_e F_e(A,b,tau_e) + R(A,b,tau,wires),

where each F_e is the clip parent's free degree4 SOS plus the four clip
generators times SOS multipliers of degree2. Thus its free SOS rows have
degree at most two and its multiplier rows are AFFINE in (A,b,tau_e).
The clip generators are

    tau_e, 1-tau_e,
    g_e+ = (c_e(A)-tau_e)*tau_e,
    g_e- = (tau_e-c_e(A))*(1-tau_e).

They do not contain any flag b. Each c_e is a nonzero linear form in A.

EVERY summand of R has total degree at most two: free quadratic SOS on
paired-sort, max and flag parents; constant inequality/product multipliers;
constant multipliers for quadratic equations; affine multipliers for linear
equations. In particular the Boolean/sign equations do NOT have higher-degree
multipliers. No product of a clip-quadratic generator and another generator
is listed. These are essential frozen restrictions, not new assumptions on K6.

The identity must hold as a POLYNOMIAL in freely independent variables, not
only after substituting Boolean flags, comparator roots or a sign pattern.

## 2. Flag scaling removes quadratic-in-flag parts of free SOS rows

Fix a real vector v of length five and formally substitute `b=t*v`, keeping
A, all tau and all coverage wires fixed as independent variables.

Only a clip free SOS can contribute a t^4 term. For each of its degree2
rows r, write its homogeneous quadratic-in-b part as q_r(b). The t^4
coefficient of the identity is

    0 = sum_(e,r) q_r(v)^2.

Clip multiplier rows are affine, so their squares have flag degree at most
two; their generators are flag-independent. P and R have total degree two.
Thus no hidden fourth-degree cancellation was omitted.

Every q_r(v) is zero for every real v, so every q_r is the zero polynomial.
Each free clip SOS row now has the form

    r(A,b,tau_e)=r0(A,tau_e)+sum_j b_j*ell_j(A,tau_e),

with ell_j affine. Each clip multiplier row has the form

    s(A,b,tau_e)=s0(A,tau_e)+beta dot b,

where beta is a CONSTANT vector.

## 3. The second flag coefficient is a constant positive sum on actual clips

Take the t^2 coefficient after the elimination above. It gives

    C_v(A,tau)
      = sum_(e,r) (sum_j v_j*ell_j(A,tau_e))^2
        + sum_(e,g,s) g_e(A,tau_e)*(beta_(e,g,s) dot v)^2
      = K_v,

where g ranges over all four clipping generators. K_v is a constant,
independent of A, tau and every coverage wire: the t^2 coefficient of ANY
polynomial of total degree at most two is its pure flag-quadratic coefficient.
This applies equally to signed equality-multiplier terms in R.

Now set ALL tau_e to their actual values `clip(c_e(A),0,1)` for arbitrary
real A. Every clipping generator is nonnegative. Hence C_v is a sum of
nonnegative terms, each bounded above by the finite constant K_v. This step
does not require Boolean v, actual sign flags or a feasible coverage-wire
assignment: it evaluates an unrestricted coefficient identity.

For any fixed e choose an apex ray A=R*a with c_e(a)>0. For large R,
tau_e=1 and g_e+=R*c_e(a)-1 grows without bound. Its constant weight
`(beta dot v)^2` must therefore vanish. A negative ray c_e(a)<0 similarly
sets tau_e=0 and g_e-=-R*c_e(a), forcing its weight to vanish.

Since v was arbitrary, EVERY beta belonging to g_e+ or g_e- is zero.
Thus NONE of the quadratic-clip SOS multipliers can depend on ANY flag b.
The purported b_j^2*g_e- escape cannot extend into this exact frozen identity.
The linear clip generators' multipliers are not eliminated and need not be.

## 4. Negative-tail boundedness then forces multiplier k*tau_e^2

Assume the certificate exists. On a true feasible graph, all SOS/inequality/
pair-product terms are nonnegative and all equation terms vanish. Since the
union of six area-1/2 triangles has area at most 3, each nonnegative summand
is bounded above by `P<=53/31`.

By section 3 a multiplier row for g_e- is affine only in A and tau_e.
On any ray A=R*a with c_e(a)<0, actual tau_e=0 and g_e- grows linearly.
If the A-linear coefficient of a row were nonzero on that ray, its weighted
square would grow cubically. Boundedness forces that linear form to vanish
on the entire open negative cone, hence identically. The remaining constant
row value at tau_e=0 must also vanish. Each row is therefore k_r*tau_e,
and its full SOS multiplier is

    k_e*tau_e^2, k_e>=0.

Unbounded-apex directions are valid in this ALL-real model. No range bound,
stationarity, compactification or generic contact hypothesis is imported.

## 5. Exact two-atom contradiction

Use Z=1 with weight 3/4 and Z=-3 with weight 1/4, and assign

    A_j=(j-6)*Z, all tau_e=0,
    all b_j=1 at Z=1 and all b_j=0 at Z=-3.

Every raw clip form is c_e=alpha_e*Z with alpha_e>0. Assign the coverage
sort/max wires their actual min/max values for the resulting height intervals.
Nonparallel intervals are [0,0]; the parallel intervals are [0,b].
All equations then vanish pointwise, and all NON-clip-quadratic generators
are nonnegative pointwise. Their listed linear-generator pair products are
also nonnegative pointwise. All free SOS have nonnegative values at both atoms.

The boundary polynomial gives

    G_lifted = 3-5*b*Z,
    G_lifted(1)=-2, G_lifted(-3)=3,
    E[G_lifted]=-3/4, E[P]=-253/124<0.

Each g_e+ vanishes because tau_e=0. Each weighted g_e- term also vanishes,
because section 4 made its multiplier k_e*tau_e^2. Linear clipping bounds
are 0 and 1, so their SOS-weighted terms are nonnegative pointwise even if
the multipliers still contain flags. Equation terms vanish pointwise regardless
of their permitted coefficients. Applying expectation to the proposed identity
would therefore give E[P]>=0, a contradiction.

These are deliberately INFEASIBLE clipped assignments, not actual K6 placements.
The argument rejects a polynomial certificate class; it does not refute K6.

## 6. Exact conclusion and boundaries

The saved 409-PSD, 155709-coefficient template cannot contain an identity
certifying P>=0. Its apparent clip/sign-flag coupling is blocked by the
free-variable fourth/second flag coefficients and the total-degree2 treatment
of all nonclip terms. No SDP execution of THIS template is justified.

The proof does not reject grammars with higher-degree Boolean/sign equation
multipliers, higher-degree nonclip summands, clip-generator products, additional
constraints or a different lifting. None is adopted or explored here.
No new K6 lower bound, inverted-class exclusion, novelty/formal acceptance or
general impossibility result is claimed. K6 remains OPEN.

Only this one new Builder mathematical note is written. All earlier reports,
template data and scripts remain frozen. Mathematical processes/SDP/code runs:
ZERO. No installs, infrastructure, new agents, UI/API/DB/Git/build, copies or
deletion; nothing removed. Vibecode Kit only governs the existing scope/review
and truthful completion workflow, not the mathematical conclusion.

## 7. Completion and observed times

Builder new derivation STOP was observed at 2026-10-12 23:42:59 UTC,
well before the unchanged 2026-10-13 00:09:19 UTC hard stop. Subsequent work
is limited to literal review and recording; no new route, degree expansion,
diagnostic process or solver is authorized or performed.

Builder fully read `COUPLED_IDENTITY_COMPLETION_20261013.md` at observed
23:42:04 UTC and found no blocking mathematical error. Its shorter ending
is also valid: after sections 3–4, the single diagnostic assignment Z=1
already has P=-102/31 while every surviving right-hand summand is
nonnegative and every equation term vanishes. This is the same rejection,
not a new candidate or a K6 configuration counterexample.

Main's full literal acceptance of this Builder note was received before the
23:42:59 stop checkpoint. Main's own new-derivation STOP is separately
reported as 23:41:40 UTC; no synchronous team stop is invented.

Independent critic FULL literal read of sections 1–6 was observed at
23:43:03 UTC: ACCEPT fixed-template rejection, no blocking error. The
critic specifically checked unrestricted coefficient comparison, all-clip
positivity, the distinct true-graph tail boundedness step and the exact
two-atom contradiction. Critic's own STOP remains 23:42:38 UTC; this later
literal read is not new mathematical derivation. Main's independent proof
had already received critic FULL acceptance at 23:41:53 UTC.

Disposition: exact saved-template feasibility question REJECTED by hand;
all-real K6 mathematical root remains OPEN, with zero new root closure.
Resource ledger for this run: mathematical processes 0, code execution 0,
numerical/SDP trials 0, installs 0, new agents 0, infrastructure 0. Only
source reads, clocks and this one new Markdown note; no predecessor edits
or deletions and no cleanup needed.
