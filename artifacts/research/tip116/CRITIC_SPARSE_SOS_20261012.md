# Smaller structured global K6 SOS — independent critic

Status: FINAL PARTIAL / new derivation STOP16:48:00UTC; scoped reviews below.
Root OPEN. Owner activation16:36:53UTC and hard stop
17:06:53UTC on2026-10-12 are unchanged. Same PUBLIC_DISCOVERY target:
G6>=40/31 for every real translation vector, including all order/contact
faces. Predecessor notes are frozen; this is the only new critic file.

The new scope, commitment protocol, latest active/handoff checkpoint, FULL
local Vibecode skill and TIP/report reference were read. The skill governs
scope and reporting, not mathematical evidence. Hand derivation/review only;
no mathematical subprocess, SDP, numerical samples, new agent or infrastructure.

## 1. Local block size does not measure geometric coupling

The preceding expanded exact lift remains valid: comparator maximum wires
and endpoint initializer wires keep each gate supported on at most four
lifted variables. A polynomial identity consisting of nonnegative SOS
terms, inequality times SOS multipliers, and equation times unrestricted
multipliers would imply the all-real bound on that exact graph. Small
supports do not imply existence of this identity, dense-equivalence,
running-intersection convergence, or qualified execution cost.

In particular, a wire can depend on all six original apices through earlier
gates. A gate-local certificate is NOT a sum of unary/pair functions of
original apices. Obstructions to the latter cannot be silently applied
to the former. Shared original-apex variables are another possible coupling,
not a certificate merely because their number is five after translation.

## 2. Exact obstruction to an original-apex pairwise area decomposition

This rejects only an exact decomposition G6=sum_i f_i(A_i)+sum_ij f_ij(A_i,A_j).
It does not reject a pairwise lower calibration with a nonnegative residual,
or a lifted local SOS identity containing coupled gate wires.

Keep labels4,5,6 arbitrarily far from each other and from labels1,2,3 in
the neighborhoods under consideration, so they contribute exactly3/2.
Set a=A2-A1, d=A3-A1. For0<d<1 and d/2<a<2d/3, compute actual three-union
area using its hull and actual holes. The lower hull switches between
labels1/3 at t=d/2. The upper hull uses3,2,1, switching at d-a and a.
Their integrals are

    integral(min L)=d-3/2-d^2/4,
    integral(max R)=a^2-ad+d^2/2.

Before the early adjacent overlaps, the two actual gaps have areas
a^2/4 and(d-a)^2/4. Both adjacent overlaps persist after birth; after
t=a/2 the three-union is connected. The stated restrictions ensure that
the endpoint-order switches happen after those gap deaths. Therefore

    G3=3/2-d+a^2/2-ad/2+d^2/2,
    partial_A1 partial_A3 G6=-1/2.

With the SAME pair A1/A3 and A2 far away, all other labels isolated, the
only interacting pair is1/3. Its overlap is(3t-d) for d/3<t<d/2 and
(d-t) for d/2<t<d, hence its area d^2/6. Thus

    G6=3-d^2/6,
    partial_A1 partial_A3 G6=+1/3.

For any exact unary/pair original-apex decomposition, the mixed finite
difference in A1/A3 depends only on f13 and is independent of A2. On
small common A1/A3 rectangles inside these open regimes the displayed
quadratics give different mixed differences. This is a contradiction
without requiring differentiability of the proposed functions.

Consequently an exact pairwise decomposition of area is impossible. The
contact-exposure coupling through a third triangle cannot be discarded.
This is an exact representational obstruction, NOT a new K6 lower bound
or a rejection of every pairwise sufficient inequality.

## 3. New exact two-atom obstruction: full degree-two preordering

Main proposed the following diagnostic; independent hand review accepted
it at16:41UTC. It applies to the original exact lift and the expanded lift
with maximum/initializer wires. Fix A6=0 and use the probability law

    B=0 with probability3/4; B=4 with probability1/4;
    Z=1-B; A_j=(j-6)Z; E[Z]=0.

Every raw crossing time has form c_e=alpha_e Z with alpha_e>0.
Assign EVERY original clipped time tau_e=0 and every sorted time0.
At all spatial gates, including the fixed height1, assign the ACTUAL
pointwise min/max/sort/cap values of the diagnostic inputs. Added maxima
and initializer links use their actual values. This is not a feasible
geometry: when c_e>0, setting tau_e=0 violates a clip quadratic.

All equations vanish pointwise. All LINEAR inequality generators are
nonnegative pointwise, so all products of them are nonnegative pointwise.
The two original quadratic clip generators have expectations

    E[(c_e-tau_e)tau_e]=0,
    E[(tau_e-c_e)(1-tau_e)]=-alpha_e E[Z]=0.

At all variable heights the cap length is zero. At height1,

    A_j-j=-j B-6Z,
    ell(1)=1+5 min(1,B),

so the formal trapezoid objective G is1/2 or3. Its expectation is

    E[G]=9/8; E[G-40/31]=-41/248<0.

The expectation functional is nonnegative on every degree-two SOS, on
every degree-two product of linear inequalities, and on each quadratic
clip inequality with a nonnegative constant multiplier. Equation terms
vanish even with the allowed affine multiplier for a linear equation.
These exhaust the usual total-degree-two truncated PREORDERING: quadratic
generators cannot receive positive-degree multipliers at that degree.
Therefore NO such exact certificate exists for this specified lift.

The valid redundant products tau_e(1-tau_e) are zero pointwise here and
do not remove this NEW diagnostic. This does not contradict the older
fact that these products removed the older +/-2 diagnostic.

The obstruction is not asserted for arbitrary additional quadratic
generators: their expectations must be checked separately. Nor is it
asserted for degree-three/four products, graph-reduced degree conventions,
or a different lifted model. It is not a K6 counterexample.

## 4. Local degree four rejects this particular diagnostic

At an ORIGINAL clip gate with c=alpha Z and tau=0, take its existing
generator g=(tau-c)(1-tau) and the local SOS multiplier(c+3alpha)^2.
This product has total degree4 and stays inside the original clip support.
On the Z=-3 atom the multiplier is zero; on Z=1 it is16alpha^2. Hence

    E[g*(c+3alpha)^2]=-12alpha^3<0.

The new functional is not positive on a grammar permitting that local
degree-four clip multiplier. This gives a concrete reason why the specified
degree-two class fails and why local higher-degree clip coupling changes
the test. It does NOT establish feasibility or existence of a degree-four
certificate, and does not release an SDP or blind degree increase.

## 5. Sharp-zero consistency is required, not a feasibility theorem

At the accepted sharp graph, P=G6-40/31=0. For any candidate exact
nonnegative-term identity, every free SOS summand must vanish there, and
every inequality multiplier SOS must vanish whenever its generator is
strictly positive. In Gram form, the corresponding sharp monomial vector
must lie in the PSD matrix kernel. These are mandatory coefficient
conditions; they do not prove that a sparse grammar is inconsistent or
consistent. No exact target coefficients or global identity are in hand.

## 6. Pending review and honest outcome

The new full-degree-two restricted-class obstruction is a mathematical
feasibility constraint, not root closure. The original-apex pairwise
obstruction has the narrower scope stated above. Whole G6>=40/31 remains
OPEN. Main/Builder final architecture and reporting will be reviewed
literally when saved, within the unchanged hard stop. No solver run,
sample/chamber campaign, install, UI/API/DB/Git mutation, scratch copy or
deletion has been performed by the critic. Stop/review times will be
recorded when actually observed; no synchronized team time is invented.

## 7. Boundary-area model: exact contact rule

For each of the twelve endpoint rays, let C0 be the measure of heights
covered by another triangle and C1 the corresponding first height moment.
Except at finitely many nonparallel contact heights, deleting covered
endpoints from the signed endpoint sum gives the actual union length.
Integration therefore gives

    G=3-sum_right(Aj*C0-(j-1)*C1)
         +sum_left(Aj*C0-j*C1).

For right ray j and a lower label k, n=j-k and d=Aj-Ak, its coverage band
is [clip(d/n),clip(d/(n-1))] when n>1. For n=1 it is
[clip(d),b], where b is the sign flag of d. Against higher labels the
reflected band uses the denominators n+1,n. The left-ray versions use
the same forty raw forms with denominators n,n+1 or n-1,n.

The only persistent parallel contact is R_(j+1)=L_j when
Delta=A_(j+1)-A_j=0. Use the SAME sign flag b for their paired band
[clip(Delta),b]. At Delta0 either binary flag is allowed. Their coverage
by the other four triangles is identical at every height; adding the
same paired band leaves their covered-height sets identical. Equal rays
then cancel in the signed formula. This also covers simultaneous coapex
chains. It is not a generic-face argument.

The binary graph b(1-b)=0, b*Delta>=0, -(1-b)*Delta>=0 fixes b for
nonzero Delta and permits both choices at zero. A five-band union can be
computed by sorting paired lower/upper endpoints. A comparator must keep
the upper multiset even at tied lower endpoints: in addition to conditional
route products and sums, require (u-r)(u-s)=0 for the routed upper u.
Without this equation equal lower endpoints could create fake uppers.

After lower endpoints l_k are sorted, set H1=v1,
Hk=max(H_(k-1),v_k), Sk=max(H_(k-1),l_k). The exact new union interval
has length Hk-Sk and moment (Hk^2-Sk^2)/2. This works for contained bands,
gaps and all ties. Four explicit outputs per paired comparator, nine
comparators per ray, and eight prefix/max wires per ray give

    5 apices+40 clips+5 flags+12*9*4+12*8=578 variables.

This count assumes the stated paired sorting network is correct; its
saved construction and full equation inventory still require literal
review. Each individual routing equation can have support at most four,
although the entire paired comparator contains eight wires. No global
certificate is implied by either support count.

## 8. The same degree-two diagnostic rejects the boundary model

Use Section3's two atoms and actual parallel signs b=1 or0. All nonparallel
bands have endpoints [0,0] because all clips were assigned zero. Each
paired parallel band is [0,b]. Choose actual paired sort/prefix values.
Then the boundary objective is

    G=3-5*Z*b=-2 or3,
    E[G]=-3/4; E[G-40/31]=-253/124.

All graph equations vanish pointwise. Linear inequalities and their
products are nonnegative pointwise; sign-flag quadratic inequalities
are also nonnegative pointwise; original clip quadratic expectations are
zero. Thus the usual total-degree-two preordering is obstructed for
this exact boundary model as well. The negative formal objective belongs
to an infeasible lift, not an actual negative union area or K6 counter.

## 9. Restricted clip-only degree-four hybrid is also obstructed

Builder proposed this class: permit degree-two SOS multipliers on the
original clip QUADRATIC generators, depending only on the five shared
apices and that original tau_e; require every OTHER certificate summand
to have total degree at most two. This is much narrower than permitting
general degree-four free SOS or degree-four equation terms.

Suppose such an identity exists. On the true all-real feasible graph,
0<=G<=3, so P is bounded above by53/31. Every nonnegative certificate
summand is individually bounded by that number. Write each affine row
of the multiplier SOS as L(A,tau). Along A=R*v with c_e(v)>0,
tau_e=1 for sufficiently large R and
g+=(c_e-tau_e)tau_e grows linearly in R. Hence each L(Rv,1) tends to zero.
Its original-apex coefficient must vanish on this open halfspace, and
therefore vanish identically; its value at tau1 must be zero. Thus
sigma+=a(1-tau)^2 with a>=0. The negative halfspace similarly gives
sigma-=b*tau^2, b>=0, for g-=(tau-c_e)(1-tau).

In the formal polynomial identity, the pure tau_e^4 coefficient of these
two terms is -a-b. Distinct original clip variables are independent formal
variables; every other summand has degree at most two. Thus this coefficient
must be zero, forcing a=b=0 for every clip. The purported hybrid reduces
to the already obstructed degree-two preordering and cannot certify P.

This proof uses the declared affine-in-(A,tau) multiplier support and the
degree limit on all other summands. It does NOT reject multipliers involving
additional gate wires, general degree-four free SOS, higher-degree equation
terms, or the full local degree-four grammar. Their coupling remains open.

## 10. Stronger no-go: independent clip multipliers cannot be repaired elsewhere

Main supplied a simpler strengthening; independent hand check accepts it.
Keep each original clip-quadratic SOS multiplier of degree at most two,
with affine rows depending only on the five shared original apices and
that clip's own tau_e. Do NOT allow products containing a clip quadratic
with another inequality. Other free SOS blocks may be globally coupled;
other equation terms may have higher degree; other inequality products
may be used PROVIDED their generators are pointwise nonnegative at the
two diagnostic atoms. This statement applies to the specified circuit
generators, not arbitrary additional valid inequalities.

Only the negative-c ray is needed. On the true graph, c_e tends to minus
infinity and tau_e=0, so g-=(tau_e-c_e)(1-tau_e) tends to infinity.
Every affine row L(A,tau_e) in its SOS multiplier must vanish on tau0:
boundedness of g-*L^2 on the open negative-c cone forces all original-apex
coefficients and its constant to zero. Thus sigma-=b_e*tau_e^2.
On the two atoms all tau_e=0, so every g-*sigma- term is ZERO; every g+
term is zero because g+=(c_e-tau_e)tau_e is already zero.

All remaining free SOS evaluate nonnegatively at each real atom; all
nonclip circuit inequalities/products are pointwise nonnegative there;
all equations vanish pointwise regardless of their multipliers. The
negative expectation of P therefore contradicts ANY identity in this
class. Higher-degree free SOS or equation terms elsewhere cannot rescue
independent affine-in-(A,tau_e) clip multipliers. No coefficient-matching
or univariate replacement theorem is needed for this stronger conclusion.

There is a genuine small coupled escape from THIS diagnostic. For an
adjacent raw c=Delta and its shared sign flag b, permit sigma-=b^2.
This lives in {Aj,Aj+1,tau_e,b}, has total product degree4, and gives

    E[g-*b^2]=-3/4

under the new diagnostic. The sign flag changes across the two atoms;
it is excluded by the independent-clip support assumption. In fact this
term vanishes on the true graph when the flag is the sign of that same
Delta. Its diagnostic sign shows that the previous obstruction does NOT
apply to a grammar containing this coupled term. It establishes neither
certificate existence nor a complete feasibility bound.

This is the exact architectural seam: small blocks need some genuinely
coupled clip/gate information, rather than shared apices alone. No claim
that all sparse degree-four SOS is impossible or feasible is made.

## 11. Actual stop record

Critic NEW DERIVATION STOP was observed16:48:00UTC on2026-10-12, after
the scoped independent-clip class obstruction. This is neither hard-cap
exhaustion nor failure of the global K6 proposition. Subsequent work is
literal review/recording only, within the unchanged17:06:53UTC hard stop.
Own mathematical subprocesses0; SDP searches0; solver seconds0; failed
mathematical starts0. No scratch/build output or deletion; predecessors
preserved. Builder/Main saved final proofs have not yet been routed or
read at this checkpoint. No final-report review is inferred.

## 12. Final independent literal reviews and completion

FULL Builder sections1-9 were read at observed16:51:01UTC. Accepted:
the boundary formula, all-real interval graph and persistent-parallel
cancellation, paired-sort tie root, actual union moments, graph counts,
new degree-two diagnostic, stronger restricted-class obstruction and
the cross-wire escape. The nine-comparator network was also hand checked:
stage5 fixes wire0 as minimum; stage7 fixes wire1 next; stage8 fixes wire4
as maximum; the last comparator sorts the remaining wires2/3. This does
not rely on sampled geometry or executing the diagnostic.

The final mixed-template section10 was read16:52:24UTC; independent
static-count review completed16:53:53UTC. Accepted the specified sufficient
grammar with40 clip parents of at most11 variables and degree4 free SOS;
other whole-gate parents have at most13/8/6 variables and degree2 free SOS.
All multiplier PRODUCTS, not merely their multiplier degrees, stay at
total degree at most four. The earlier wording ambiguity was flagged.

Reviewed ceilings:409 PSD blocks, maximum order78;155709 scalar unknowns,
including632 nonnegative scalar coefficients and3557 unrestricted equation
coefficients;70400 coefficient-row ceiling;192375 operator incidences,
with target occurrences separately at most241. Raw Gram storage2364712
bytes and sparse triplets4617000 bytes check. Dense operator storage
87695308800 bytes is refused. None of these counts qualifies solver
canonicalization/factorization memory, runtime or exact recovery.

FULL Main SPARSE_SOS_COMPLETION_20261012.md was read at observed16:54:05UTC.
Accepted mathematical scope/count consistency and honest no-certificate,
no-SDP, root-OPEN disposition. One Vietnamese phrase suggesting uniquely
necessary sign information was flagged for tightening: the proved class
must change an assumption, but sign flags are ONE explicit escape, not
the only possible coupling or generator-product mechanism.

The stronger no-go actually needs independent affine SOS support ONLY for
the negative-tail clip multiplier; positive-tail clip generators are zero
at the diagnostic atoms regardless of their multiplier support. Builder's
broader accepted statement is consistent with Section10's narrower version.

Own processes/searches/solver seconds/failed mathematical starts are0.
Builder reports ONE approved tiny standard-library diagnostic, not a full
graph replay, sampled K6 verification or SDP; critic did not execute it.
The hand proofs do not use that process as universal closure evidence.
No existing proof byte was edited, no install/infrastructure/agent/build
or external mutation occurred, and no scratch/deletion required cleanup.

What was established here: an exact smaller representation and rigorous
specified-class exclusions, with one demonstrated coupling escape. What
was NOT established: exact coefficients/PSD identity, algebraic feasibility
of the surviving template, qualified solver execution, or ANY new global
K6 lower bound/whole inversion exclusion. The root remains OPEN, with no
automatic successor/resource increase. This is independent AI hand review,
not external/formal mathematical acceptance. Original17:06:53UTC hard stop
and the distinct observed derivation-stop/review times remain unchanged.
