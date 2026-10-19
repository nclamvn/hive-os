# TIP116 R6 — full minimum, component virial and the barrier

Same PUBLIC_DISCOVERY/R116-1..3, all-real finite K6 F6>=20/93.
Owner activation2026-10-12 07:42:47 UTC; derivation cutoff08:32:47;
hardstop08:42:47. Mathematical subprocess grant0. All predecessor bytes
through R5 frozen. Only this NEW Builder note and its NEW completion may
be written. Final status PARTIAL; global K6/all12 inversions OPEN.
Derivation cutoff08:32:47UTC observed at08:32:53UTC. No new derivation
after the cutoff; literal review/report only. No full-hypothesis failure
or proof is claimed. Last NEW proof text was saved at08:27:44UTC.

## 1. Retained FULL-hypothesis obligation

Use the actual intervals I_j(t)=[A_j-jt,A_j-(j-1)t], A_j=p_j+j.
Let ell(t) be the length of their WHOLE union and c(t) the number of its
positive-length connected components, away from finitely many contact
heights. G=integral_0^1ell=6F6. At a retained actual competing minimum,
all SIX placement gradients/one-sided variations, GLOBAL joint replacements
and actual radial/bottom geometry remain required. Holding four triangles
fixed supplies necessary pair conditions, not a closing predicate.

The frozen direct adjacent-coapex descent excludes A_i=A_(i+1) at an
actual local minimum under r<2. Nonadjacent apex ties are impossible under
the same range. Thus retained actual minima have all apices distinct,
although simultaneous nonparallel contacts and bottom touches remain.
The strict-bottom radial label inequality is not used on a touching face.
No V, relaxed PSD, fixed tree or summed pair-lens shortcut is revived.

## 2. ALL-six affine shear: exact actual component-count virial

Make the actual placement variation A_j(h)=A_j+h*j for ALL six labels.
At fixed physical t its interval is

    [A_j-j(t-h), A_j-(j-1)(t-h)+h].

Thus it is the old interval at t-h with its right endpoint additionally
shifted by h. At any fixed t in(0,1) not an endpoint/contact height,
the start ordering, components and their boundary labels are locally
unchanged. Each actual component then gains h in length after the
t-h reparametrization. Its derivative is therefore

    d ell_h(t)/dh at0 = c(t)-ell'(t).

This includes actual disconnected slices; no laminar or natural-order
assumption is made. For h<0 the expression is used only in the stable
component neighborhood of the fixed regular t, not as a globally exact
shrinking formula. Intersections/splits at exceptional finite heights
are not discarded as stationary faces: they have zero measure for this
FIRST derivative. Distinct apices exclude persistent parallel contacts.

The union-length difference quotient is uniformly bounded by the sum of
the six intervals' ACTUAL endpoint displacements: both endpoints shift
by j*h, hence the safe bound is2*sum_j j=42. Bounded
convergence therefore gives the actual area derivative even at simultaneous
nonparallel contacts and bottom touches:

    dG(A+h*j)/dh at0
      = integral_0^1 c(t)dt - integral_0^1ell'(t)dt
      = integral_0^1 c(t)dt - ell(1),

because ell is continuous piecewise linear and ell(0)=0. At an actual
local minimum this unrestricted SIX-variable derivative is zero. Hence

    integral_0^1 c(t)dt = ell(1).

Combining the reviewed actual radial identity2G=ell(1), and connected
bottom ell(1)=1+r, gives the exact full-minimum restrictions

    2G = integral_0^1c(t)dt = 1+r,
    integral_0^1(c(t)-1)dt = r.

The shear identity is a linear combination of ALL SIX actual placement
gradients (when written individually), not selected inverted-pair balances.
It keeps every actual merge/split and union multiplicity. It is a necessary
condition, NOT a proved lower bound on the component lifetime integral.
No second derivative or generic stationary face transfer is inferred from
this first-variation argument.

Correction preserved: the first draft used36 by omitting the extra h
on each reparametrized right endpoint. Critic correctly observed the
ACTUAL shift is j*h on both endpoints;42 replaces that unjustified
bound. Only domination's harmless constant changed, not the virial.

## 3. What this still must prove

To close the target through the preceding exact identity, one must prove
the true full-minimum lifetime floor integral c>=80/31, or obtain an
actual simultaneous placement decrease exceeding the co-apex barrier.
The identity by itself does neither. The R5 symbolic family violating
selected endpoint necessity is not a failure of these full hypotheses and
is not a STOP criterion for this R6 route.

For an inverted pair the frozen exact ALL-placement envelope still holds:
fplus(v)+fminus(w)-q(v,w)>=mplus+mminus for every v,w, with actual
outside-four-union overlap q. The common-diagonal minimum can exceed
the separate minima by Delta. The needed proof must combine that global
envelope with the complete six-variable geometry, not reverse its sign
or infer argmin intersection without evidence. No whole floor/decrease has
yet been established.

## 4. Actual time-dependent forest: a convex SIX-variable upper comparison

At each regular height freeze the ACTUAL consecutive-start neighbor forest
F_A(t): within each old connected component retain consecutive labels in
their ACTUAL start order, with their start gap<t. This is a time-dependent
forest, not one fixed tree or an exchange of integral and maximization.
Write m=j-i>0 for an edge whose endpoints are relabeled i<j, and define

    J_A(B)=3-integral_0^1 sum_(ij in F_A(t))
                   [t-|B_j-B_i-m*t|]dt.

No positive part appears inside this frozen-edge expression. J_A is convex
in ALL six coordinates. At A its raw edge overlaps are positive, and the
equal-width sorted-neighbor identity gives J_A(A)=G(A).

For any B, dropping negative raw overlaps only raises their sum. A forest
of its positive edges extends to a spanning tree; the maximum spanning-tree
sum of actual positive overlaps is the true one-dimensional kinetic-neighbor
sum at B. Therefore G(B)<=J_A(B) globally. This proof does NOT exchange
integration with a single fixed-tree maximum and does not estimate a whole
union by the sum of all pair lenses. The forest was geometrically realized
at A at every height and only gives an UPPER comparison elsewhere.

An actual local minimum A is consequently a local minimum of convex J_A,
hence a GLOBAL minimum of J_A over all SIX replacement positions. This
uses actual local minimality, not a lower proxy's stationarity. The exact
reselection surplus W_A(B)=J_A(B)-G(B)>=0 keeps every changed neighbor,
component, multiplicity and newly filled gap. At an actual GLOBAL minimum,

    J_A(B)-J_A(A)>=W_A(B) for EVERY B.

A true full replacement defeating the barrier must reverse this inequality
strictly for some geometrically specified B, or yield equality at a forbidden
co-apex configuration. No such full replacement is yet proved.

### Tighter actual component-hull envelope

Critic's saved R6§4 was independently read and handchecked. For the actual
old component labelsets P_A(t), define

    E_P(B)=integral_0^1 sum_(C in P_A(t))
            [t+range{B_j-(j-1/2)*t:j in C}]dt.

Each old group hull covers all its new member intervals, so G(B)<=E_P(B).
Along each old group's frozen neighbor path, range is at most the sum of
absolute edge differences. Hence the FULL comparison is

    G(B)<=E_P(B)<=J_A(B), equality throughout at B=A.

E_P is convex in all SIX apices, and an actual local minimum A globally
minimizes this tighter envelope too. Its deficit D_P(B)=E_P(B)-G(B)
includes BOTH holes inside the new old-group hulls and overlap between
these hulls, counted through the actual union. At a global minimum,

    E_P(B)-E_P(A)>=D_P(B) for EVERY B.

This is a genuine all-six barrier formulation but not a floor: for a sharp
anchor A*, convex minimality gives E_P(A)<=E_P(A*), the UPPER direction.
No arbitrary partition/network relaxation or natural-chart projection
normality is used to reverse that direction. The exact geometrically
realized component history remains essential.

## 5. Literal all-six bottom-compression comparison

Critic's saved R6§3 was independently read and handchecked, retaining all
factors and the indispensable early term. Let0<lambda<1, h=1-lambda,
and replace ALL six bottom starts by lambda*p_j, so
B_j=lambda*A_j+h*j. For t>=h put s=(t-h)/lambda in[0,1].
The new intervals are lambda times the old intervals at s, right-dilated h.
If g_l(s)>0 are the ACTUAL old component holes, the exact union length is

    ell_B(t)=lambda*ell_A(s)+h*c_A(s)
                   -sum_l[h-lambda*g_l(s)]_+.

This is dilation of actual COMPONENTS: filling each intervening hole once.
Define E_h=integral_0^h ell_B(t)dt and
F_h=integral_0^1sum_l[h-lambda*g_l(s)]_+ds. Actual full stationarity
integral c=2G then gives the finite ALL-six change

    G(B)-G(A)=E_h-h^2*G(A)-lambda*F_h.

For an inversion u choose lambda=1/(1+u). Its pair becomes co-apex,
while range and all bottom gaps contract; nonadjacent exterior apices
remain strictly separated. If an actual global minimum existed here,
this change would have to be STRICTLY positive: equality would make B
a global minimum, contradicting direct co-apex descent. Thus the needed
full-hypothesis comparison is E_h<=h^2*G+lambda*F_h. It is UNPROVED.

The convex envelopes in4 supply upper comparison costs, not this missing
early-versus-fill bound. In particular0<=E_h<=3h^2 alone and the exact
shear/radial identities do not reverse the global-minimum inequality.
No small-u class, selected endpoint predicate or arbitrary component
history is offered as a substitute for the WHOLE committed comparison.

## 6. Whole naturalization and exact early multiplicity reduction

For the SAME finite compression route in5, choose u to be the MAXIMUM of
all positive adjacent inverted apex gaps u_i=A_i-A_(i+1). The range bound
gives u<=r-1. With lambda=1/(1+u), h=1-lambda, each old inverted adjacent
new gap is lambda*(u-u_i)>=0; each old natural adjacent gap becomes
lambda*(A_(i+1)-A_i)+h>0. Hence ALL new apices B are naturally ordered,
with at least one adjacent co-apex pair. Original equal maximal inversions
are retained: they yield multiple co-apex pairs, not a genericity deletion.
This does NOT transport old stationarity to B.

There is also a uniform early-overlap restriction, without discarding any
actual union multiplicity. For label distance m>=3,

    B_j-B_i>=m-lambda*r>0,
    first possible pair-overlap height>=(m-lambda*r)/(m+1)>=h.

The last inequality is equivalent to m-r>=u, which follows from
u<=r-1 and r<=49/31<2. In fact m>=3 gives
m-r-u>=m+1-2r>0. Thus no such pair has positive intersection on0<t<h.
Any four labels span at least3, and any nonconsecutive triple also does.
Consequently NO positive quadruple intersection occurs in this early
strip; only pairs of label distance1 or2 and consecutive triples occur.
Writing actual clipped intersection areas over0<t<h as L_ij and T_i,
finite inclusion-exclusion gives the EXACT early term

    E_h=3*h^2-sum_(|i-j|=1 or2)L_ij+sum_(i=1..4)T_i.

Here T_i is the WHOLE three-way common intersection of labels i,i+1,i+2,
not a sum or product of lenses. The chosen co-apex adjacent pair has only
point contacts, hence L_i,i+1=0 and every triple containing it has area0.
All other pair/triple clipping and original contact ties remain actual.

For completeness, on this strip every nonadjacent center difference is
at least m-lambda*r-m*h=lambda*(m-r)>0 for m>=2. Thus center-order changes
can only be adjacent transpositions, but this observation does not license
replacing the early WHOLE union by pair sums. The displayed triple term
is essential. These reductions apply simultaneously to all12 inversion
words/faces and are exact geometry, NOT the missing full-minimum bound.

### Every non-prefix hole is filled by the SAME maximal compression

At a regular old height let S be the labels to the LEFT of one ACTUAL
component hole g>0. If S is not a natural label prefix, some adjacent k
has k outside S and k+1 inside S. All member intervals lie on their
respective sides of the hole. Therefore

    g <= left_endpoint(k)-right_endpoint(k+1)
       = [A_k-k*t]-[A_(k+1)-k*t]
       = A_k-A_(k+1)=u_k<=u.

In particular this downward label transition MUST be an actual inverted
adjacency. No arbitrary partition is inserted. Since h=lambda*u, the
compressed dilation fills this hole completely (possibly to point contact)
and its exact area contribution is h-lambda*g>=0. Natural-prefix holes
remain subject to their ACTUAL positive-part clipping. Thus the full fill
term may be split, without a changed multiplicity, as

    F_h = integral sum_(actual prefix holes)[h-lambda*g]_+
          + h*integral N(t)dt-lambda*integral Q(t)dt,

where N(t) counts ACTUAL non-prefix holes and Q(t) sums their widths.
At exceptional finite contact heights use the consistent exact dilated-
union formula and the fact that these heights have zero measure in the
integrals; no stationary/Hessian face transfer is made. Correction preserved:
the draft said union/FILL continuity. Raw hole-fill sums can jump by h
when an old hole closes; that jump cancels the h*c jump in the continuous
actual dilated union. Raw fill continuity is NOT asserted. This is a whole joint
realizability restriction across all12 words, not a fixed tree or an
arbitrary signed contact graph. The elementary Q<=u*N supplies only
nonnegativity; it does not supply the required quantitative barrier bound.

The unresolved compression comparison now has no unspecified early
multiplicity: it is precisely

    3*h^2-sum L_ij+sum T_i
       <=h^2*G(A)+lambda*integral_0^1 sum_l[h-lambda*g_l(s)]_+ds.

Its RIGHT side still uses every ACTUAL old component hole throughout the
entire height interval. All SIX gradients and actual global optimality
have not yet been shown to imply this inequality. No counter to a relaxed
early-strip necessity is a failure of that full-hypothesis implication.

## 7. Exact FULL-gradient debt, not natural-chart stationarity

The remaining obstruction can also be recorded without a relaxed history.
At every regular height define the actual outer hull length V(t), and

    q_k(t)=[min_(j>k)L_j(t)-max_(j<=k)R_j(t)]_+, k=1..5.

Every positive q_k is exactly one ACTUAL prefix hole, and each such hole
appears once. Let Q(t) sum the ACTUAL non-prefix hole widths from6.
Then, with H_np=integral Q and
G_prefix=integral V-sum_k integral q_k, the exact universal decomposition is

    G=G_prefix-H_np.

G_prefix is not the actual union functional on an inverted chart. Its
gradient is NOT zero at an actual stationary minimum unless the extra
gradient happens to vanish: the correct ALL-six equation is

    grad G_prefix=grad H_np.

The first derivatives here retain the actual exposed endpoints; isolated
contact heights do not permit transport of a generic second-order cone.
Under radial homothety, H_np(lambda*A)=lambda^2*integral_0^(1/lambda)Q(s)ds.
Connected bottom gives Q(1)=0, hence the actual radial Euler identity is

    grad H_np(A) dot A=2H_np(A).

Let A* be the verified natural sharp anchor, G(A*)=40/31. Its non-prefix
term is0. Define each comparison remainder as its value difference from
its own anchor minus one half its ACTUAL gradient dotted with A-A*.
Direct algebra gives

    R_actual(A,A*)=R_prefix(A,A*)
                      -one_half*grad H_np(A) dot A*.

At full actual stationarity R_actual=G(A)-40/31. However NEITHER a
nonnegative R_prefix on inverted charts NOR the required sign of the extra
full-gradient term has been proved. H_np(A*)=0 alone supplies neither.
The active constraint of an actual non-prefix hole need not be its reversed
adjacency cap throughout its life. Thus natural prefix-cone stationarity
or normality cannot silently erase this debt. This is a precise record of
the same full-hypothesis gap, not a new weak closing predicate or its counter.

## Ledger / final reviewed scope

Critic FULL literal acceptance: corrected1--3 at07:49:56UTC;4--5
at08:07:44UTC;6 at08:15:22UTC; its non-prefix refinement at08:20:26UTC,
corrected raw-fill wording at08:21:37UTC;7 at08:27:59UTC. These accept
only the exact stated necessary/UPPER/debt scopes. The WHOLE early-fill
implication, value floor, all12 inversion exclusions and boundary/attainment
assembly remain OPEN. Main's NEW R6 exact comparison note was fully read
before the cutoff; its(M) factors and strict-positive-at-hypothetical-global-
minimum conclusion agree with5. No quantitative dominance follows.

Required AGENTS/protocol/latest active+handoff/R6scope/original charter,
latestR5report/fullVibecode Kit+TIP/report reference reread. Minimal proof
and independent review workflow only, no infrastructure. Ordinary
reads/status/clock/apply_patch to NEW Markdown only. Mathematical
processes0, seconds0, failed starts0. No code/samples/enumeration/LP/
optimizer/replay/UI/DB/auth/API/Git/build/install/copy/Docker/delete/
scratch/distDir/new agents. All prior files and unrelated dirty work intact.
