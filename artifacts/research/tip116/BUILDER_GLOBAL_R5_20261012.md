# TIP116 R5 — actual minimum and radial geometry

Same PUBLIC_DISCOVERY/R116-1..3, all-real finite K6 F6>=20/93.
Activation2026-10-12 06:27:32 UTC; new-derivation cutoff07:17:32;
hardstop07:27:32. Mathematical subprocess grant0. All predecessor bytes
frozen. Only this NEW Builder note and its NEW completion may be written.
Current status STOP/PARTIAL; no inverted domain or global theorem closed.
Builder new derivation STOP06:52:38 UTC on the failed endpoint-only
closing mechanism in7. Literal review/recording only after that stop.

## 1. Exact radial variation of the actual union

Write I_j(t)=[A_j-jt,A_j-(j-1)t], A_j=p_j+j, and let ell(t)
be the length of their WHOLE union for t>=0, with the same lines extended
past physical height1 only to describe a variation. G=integral_0^1ell.
Scale all apices A_j to lambda*A_j, leaving slopes fixed. Then

    I_j^lambda(t)=lambda I_j(t/lambda),
    G(lambda)=lambda^2 integral_0^(1/lambda)ell(t)dt.

This is an actual unrestricted placement variation, not a hull/gap proxy.
Since ell is continuous and piecewise linear, G is differentiable at1,
including simultaneous interval contacts. At any actual local minimum,

    G'(1)=2G-ell(1)=0.

For connected bottom, ell(1)=1+r, where r=max p-min p. Thus
2G=1+r. At radial stationarity the one-sided second derivatives are

    G''(1+)=ell'(1-)-ell(1),
    G''(1-)=ell'(1+)-ell(1).

Both must be nonnegative. A subtarget G<=40/31 therefore has
r<=49/31<2. These statements use the full actual area and are not
stationarity for a lower envelope. Extended t>1 is not an extra physical
exposure hypothesis; it is only the exact reparametrization of lambda<1.

## 2. Strictly connected bottom, extrema ties retained

Let a_min/a_max be the smallest/largest labels attaining min p,
and b_min/b_max the smallest/largest labels attaining max p. At t=1-h,
the left endpoints are p_j+jh and right endpoints p_j+1+(j-1)h.
If the bottom is strictly connected (every consecutive distinct bottom
start gap<1), the union stays connected near1. Its leftmost endpoint
below1 is selected by a_min and its rightmost by b_max. Above1 the
selection is a_max and b_min. Therefore

    ell'(1-)=a_min-b_max+1,
    ell'(1+)=a_max-b_min+1.

An actual local minimum must satisfy a_min-b_max>=r and
a_max-b_min>=r; the first is the stronger condition. For an inversion,
r>1, so a_min-b_max>=2 as an integer. It does NOT force bottom extrema
labels1/6 and does NOT itself forbid any interior adjacent inversion.
This is the rederived strict-domain version of R4's unused auxiliary.

## 3. Bottom-touching faces: exact opening-gap correction

Suppose the bottom union is connected but has a touch q separating two
strict-overlap components. At such an interface let L be labels whose
bottom right endpoint equals q (p_j=q-1) and R labels whose bottom left
endpoint equals q (p_j=q). No interval crosses q in its interior.
Use L_min/L_max and R_min/R_max for their extreme labels.

At t=1-h, the rightmost endpoint of the left component is
q+(L_max-1)h and the leftmost of the right component is q+R_min*h.
The opening gap has length h*[R_min-L_max+1]_+. At t=1+h it has
length h*[L_min-R_max-1]_+. Other distinct endpoint distances are
strict, so they cause no additional first-order holes. Summing interfaces,

    kappa_minus=sum_touch[R_min-L_max+1]_+,
    kappa_plus =sum_touch[L_min-R_max-1]_+,
    ell'(1-)=a_min-b_max+1+kappa_minus,
    ell'(1+)=a_max-b_min+1-kappa_plus.

Consequently the ACTUAL necessary radial inequalities are

    a_min-b_max+kappa_minus>=r,
    a_max-b_min-kappa_plus>=r.

The plus sign on kappa_minus is essential: the length below1 loses
the opening gap, so its derivative toward1 gains that coefficient.
For r<2 there can be at most ONE such bottom interface, because two
successive distinct-start gaps equal1 would require range>=2. Extrema
ties and multiple labels at the one touch remain included in the formula.
No generic strict-bottom perturbation is used to transport stationarity.

## 4. Actual first and one-sided second variations at an inversion

Fix an inverted adjacent pair a=A_i>b=A_(i+1), u=a-b>0 and let O
be the actual union of the other four triangles, in x=z+i*t coordinates.
Its two present intervals [a,a+t] and[b-t,b] are disjoint for every t.
They remain disjoint for all sufficiently small independent translations.
Their additions to O are therefore locally EXACTLY additive:

    G=|O|+fplus(a)+fminus(b),
    fplus(v)=integral_0^1|[v,v+t] outside O_t|dt,
    fminus(w)=integral_0^1|[w-t,w] outside O_t|dt.

With C,P,M the actual covered band-union lengths on center/plus/minus
rays, their derivatives at the present positions are

    fplus'(a)=C(a)-P(a),
    fminus'(b)=M(b)-C(b).

The inversion and r<2 keep all exterior apices strictly outside[b,a].
No exterior edge is coincident with either moving boundary over a positive
height interval: any possible parallel slope comes from the neighboring
label and the retained apex separation is strict. Individual first
derivatives thus exist even when O has its own triple/contact coincidences.
At an ACTUAL local minimum,

    C(a)=P(a), M(b)=C(b).

The actual one-sided derivatives of those first derivatives must satisfy
(C-P)'(a-),(C-P)'(a+)>=0 and
(M-C)'(b-),(M-C)'(b+)>=0 whenever the corresponding piecewise-linear
band derivative is used. No generic Hessian is transported to a face.
The i/i+1 mixed quadratic term is zero in this disjoint neighborhood,
but couplings to every exterior placement remain in the full Hessian.
These endpoint equations were absent in R4's movable-V counter. They
are necessary conditions, NOT an averaged inequality or whole exclusion.

## 5. Adjacent co-apex contact: direct actual two-sided descent

This is an actual face statement under the r<2 range filter,
not positive-u inversion closure. Suppose A_i=A_(i+1)=q. Nonadjacent
apex comparison makes every other apex strictly different from q, including
the two exterior neighboring labels. In co-moving coordinates the pair is
[q,q+t] and[q-t,q]. All four exterior intervals miss a neighborhood of
q for sufficiently small positive t. Hence the actual center-ray exposure

    L(q)=integral_0^1 (1-1_(O_t)(q))dt

is strictly positive. Exterior parallel moving-boundary coincidences also
cannot occur, by the same strict neighboring-apex separations. The fixed-O
addition functions fplus/fminus have first derivatives at q, even if the
outside union has singular contacts at finitely many heights.

Set c=fplus'(q)-fminus'(q). Moving the pair to(q+h,q-h), h>0,
separates its intervals and has actual first-order area change c*h.
Moving instead to(q-h,q+h) creates their outside-O overlap. Its length
at every fixed t>0, divided by h, tends to2*(1-1_(O_t)(q)); the
small t lens portion contributes only O(h^2). Bounded convergence thus
gives actual area change

    (-c-2L(q))*h+o(h).

The area at the co-apex pair is |O|+fplus(q)+fminus(q), since its two
intervals share only a point. A local minimum would require simultaneously
c>=0 and c+2L(q)<=0, impossible because L(q)>0. Therefore an adjacent
co-apex configuration in this range is NOT an actual local minimum.

This treats the original face directly; it does not infer PSD/minimum
conditions by perturbing generic configurations. It cannot rule out a
positive-u inverted local minimum separated from the co-apex face by an
area barrier. Such a barrier is the remaining global-minimum problem.

## 6. Full global two-placement envelope and its unresolved barrier

Assume the original inverted configuration is an actual GLOBAL minimum,
not just stationary. For all replacement positions v,w define

    q(v,w)=integral_0^1|[v,v+t] intersect[w-t,w] outside O_t|dt.

The replacement's actual area is |O|+fplus(v)+fminus(w)-q(v,w).
Let mplus=fplus(a), mminus=fminus(b); the old disjoint pair has q(a,b)=0.
Whole global minimality is the exact inequality

    fplus(v)+fminus(w)-q(v,w)>=mplus+mminus  for ALL v,w.

In particular q>=0 implies fplus(v)>=mplus when w=b, and
fminus(w)>=mminus when v=a. Thus a and b are global individual argmins,
not merely stationary points. All actual overlap multiplicities are kept
in q; the outside addition functions themselves are integrals of actual
union complements, not pairwise overlap sums.

If the two individual argmin sets had a common point v in the original
corridor[b,a], setting both positions to v would preserve the same
global value, since q(v,v)=0. The new bottom starts of these two labels
lie between the old pair starts and retain range<2; the other apices
remain strictly outside that corridor. Section5 would then contradict
its global (hence local) minimum, without needing new bottom connectivity.

But intersection of those argmin sets is NOT established. In fact the
combined function phi(v)=fplus(v)+fminus(v) necessarily satisfies
phi(v)>=mplus+mminus. A minimizer of phi may sit above the old value
by a positive barrier Delta. The direct descent from the co-apex
configuration in5 lowers the ACTUAL TWO-PLACEMENT area locally by leaving
the diagonal, but has no proved quantitative bound overcoming Delta.
Claiming phi's common minimum is automatically no higher than the old
separate minima would reverse the actual inequality. Therefore the
co-apex cusp alone does NOT close any positive-u inversion continuum.

The whole missing implication is that the all-placement envelope above,
the SIX actual gradients/one-sided local minimum conditions, and the
retained radial/range/bottom geometry cannot simultaneously hold for u>0,
or else that their complete actual value is >=40/31. No replacement
universal V envelope, relaxed PSD network or small-u class is used as
a substitute for that implication.

Correction history: the initial sentence incorrectly said the co-apex
descent lowers phi locally. Critic correctly distinguished the diagonal
function phi from the two-placement area; the descent leaves the diagonal.
That wording is withdrawn and replaced explicitly above. No accepted
minimum/gradient formula or claimed closure relied on the false wording.

## 7. Endpoint-only closing mechanism fails on an exact symbolic family

The prospective inference that the inversion endpoint balances and their
own diagonal curvature already contradict the retained bottom/range
geometry is FALSE. This is a symbolic actual-union family, not a finite
sample, optimizer output, or actual full-minimum counterexample.

For every11/7<r<=49/31, set

    p=(9/7,2/7,r,0,r-2/7,r-9/7).

Its apices are A1=A2=16/7, A3=3+r, A4=4,
A5=A6=r+33/7. The central pair3/4 is inverted by u=r-1>0.
Distinct bottom starts are, in order,

    0, 2/7, r-9/7, 9/7, r-2/7, r.

Their gaps are2/7, r-11/7, 18/7-r, r-11/7, 2/7,
all strictly below1. The bottom is strictly connected, min uniquely4,
max uniquely3, and its range is the retained r. The two outside co-apex
fans each consist of actual adjacent directions, not relaxed band inputs.

At a=3+r, the lower common-fan distance is r+5/7>2 and the
upper distance is12/7. The whole center union is[4/7,1]; lower
late-plus coverage is empty and upper opposite-plus coverage is
[3/7,6/7]. Hence C(a)=P(a)=3/7. In a neighborhood of a these
strict clipping/containment relations persist, and

    C(x)-P(x)=1-(7/12)*(A5-x),
    (C-P)'(a-)= (C-P)'(a+)=7/12>0.

At b=4 the distances are reversed: lower12/7, upper r+5/7>2.
Center is again[4/7,1], upper late-minus coverage is empty and lower
opposite-minus coverage is[3/7,6/7]. Thus M(b)=C(b)=3/7, with

    M(x)-C(x)=(7/12)*(x-A1)-1,
    (M-C)'(b-)= (M-C)'(b+)=7/12>0.

The inverted pair remains disjoint under small shifts, so its fixed-O
actual area has a strict local minimum with diagonal Hessian(7/12,7/12)
and zero mixed term. All of4's endpoint balances and diagonal local
conditions hold; they cannot force a whole exclusion by themselves.

This family deliberately does NOT satisfy the full six-variable minimum
hypotheses. Its outside adjacent co-apex contacts are excluded by5;
its extrema labels also fail2's strict radial curvature requirement.
No full radial stationarity, global pair-envelope optimality, actual global
minimum or K6 counterexample is asserted. The failure only prevents
promoting selected necessary conditions into a full minimum proof.
The unresolved all-placement/SIX-gradient/radial coupling in6 remains.

## Ledger / final scoped disposition

Applicable AGENTS, protocol, latest active/handoff, original TIP116 charter,
R5 scope, latest R4 report, full Vibecode Kit and required TIP/report-format
reference read. Minimal scoped proof/completion workflow only. Ordinary
reads/clock and NEW Markdown; mathematical processes0, seconds0, failed
mathematical starts0. No code/samples/optimizer/enumeration/LP/replay/UI/API/
Git/build/install/copy/Docker/delete/infra/new agents/scratch/distDir.
Critic FULL literal Sections1–5 accepted their exact necessary/face scopes.
Section6's algebra and conditional criterion were FULL literal accepted
with the diagonal/two-placement wording correction preserved above.
Section7 FULL literal independent acceptance checkpoint06:52:08 UTC,
only as a failed endpoint-only mechanism. Whole six-variable conditions
are not refuted. No all-real closure or actual competing minimum is
constructed. Builder STOP06:52:38 UTC; no new derivation after that
stop, no automatic alternative proxy/branch or resource extension.
One ordinary broad source-text lookup also matched a frozen replay JSON;
its irrelevant output was truncated and was NOT used as proof evidence,
executed as code, or replayed. No mathematical execution occurred.
