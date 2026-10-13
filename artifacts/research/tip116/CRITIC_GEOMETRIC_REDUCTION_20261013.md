# Independent compactification and area-objective review

Status: FINAL PARTIAL; K6 OPEN. Same all-real G6>=40/31 (F6>=20/93),
TIP116 PUBLIC_DISCOVERY. Owner activation2026-10-13 01:11:58UTC;
unchanged hardstop01:41:58UTC. Hand mathematical subprocess grant0.
Scope/protocol and latest active/handoff read; FULL Vibecode skill and
TIP/report reference read. Skill governs scope/reporting, not proof.
Only this new note may be edited; all predecessors remain frozen.

## 1. Exact projection packing, with optimal fixed shear

Initially, ordinary horizontal projections [Aj-j,Aj] have total lengths21.
Packing their disconnected components is valid but is superseded by the
sharper fixed area-preserving shear x'=x+3t. In sheared coordinates the
triangle projections are Jj=[Aj+ellj,Aj+rj], with

    ell=(0,0,0,-1,-2,-3), r=(3,2,1,0,0,0),
    widths=(3,2,1,1,2,3), total12.

The finite union of these closed projections has closed interval components.
Rigidly translate each whole component's triangles horizontally until the
components abut, retaining their internal geometry and labels. Initially
different groups lie in disjoint projection strips. Afterwards their strips
meet only along vertical lines, which have area0. Thus total union area is
preserved EXACTLY, not merely decreased. Projection contacts already in one
closed component are retained; new contacts cause no area change. No natural
apex ordering, genericity, fixed component tree or minimum assumption is used.
The fixed shear has determinant1, and horizontal translations in that plane
correspond to the same apex shifts in the original plane.

The packed projection hull has width<=12. Apply a common translation so
A6=0; then J6=[-3,0]. If L,R are the hull extremes, L>=-12,R<=9.
Consequently a representative exists with

    A1 in[-12,6], A2 in[-12,7], A3 in[-12,8],
    A4 in[-11,9], A5 in[-10,9], A6=0.

A sharper polytope description uses all30 directed inequalities

    Aj-Ak <= 12-rj+ellk, j!=k.

They are equivalent to max_j(Aj+rj)-min_k(Ak+ellk)<=12; diagonal cases
only restate widths<=12. They imply the ten coordinate bounds above.
These are proven constraints on packed representatives, NOT redundant
constraints on every uncompressed arbitrary placement.

The width12 and individual coordinate extremes are sharp for this packing
rule: place the projection intervals with disjoint interiors, abutting in
an arbitrary chosen order. For a target label j, put J6 first and Jj last
to attain its upper bound; put Jj first and J6 last for its lower bound.
No smaller universal sum-of-widths bound follows from this rule.

Indeed for a fixed shear x'=x+c*t the sum is the convex function

    W(c)=sum_j [max(0,c-j+1)-min(0,c-j)].

On2<c<3 it equals15-c; on3<c<4 it equals9+c. Thus c=3 is its unique
global minimum, value12. This optimizes ONLY this fixed-shear projection
packing estimate, not every conceivable geometric reduction.

## 2. Global infimum equivalence and attainment

Let D be the30-inequality polytope above. It is closed and bounded in the
five-coordinate gauge, and nonempty. Every unrestricted placement has an
area-equal representative in D. Conversely D is a subset of unrestricted
placements. Therefore inf_allreal G = inf_D G exactly.

G is continuous: shifting triangle j by delta_j changes its interval at
each height by symmetric-difference length<=2|delta_j|. The union change
is bounded by the sum of these changes. Integrating gives

    |G(A)-G(B)|<=2*sum_j |Aj-Bj|.

Hence a minimum is attained on compact D, and it is an unrestricted global
minimum too. Boundary representatives do not justify assuming a generic
or interior minimum; singular faces and actual local variations still need
their own treatment. The ten-coordinate box alone also gives an equivalent
infimum, since it contains all packed representatives and is a subset of
the all-real domain; it is a broader but cheaper compact restriction.

Compactness breaks the old recession proof: genuine rays A=s*a cannot stay
in D as s grows; the old false T family violates the new lower bounds.
New linear bound generators can be negative and unbounded on that excluded
family. This does NOT establish a degree-four identity.

Adding30 inequalities retains578 variables,216 linear/533 quadratic
equations,90 quadratic inequalities, and gives528 linear inequalities.
Adding only the ten box inequalities gives508 linear inequalities. Neither
turns the lifted problem into a five-variable SOS nor qualifies a solver.
For comparison a dense full free degree4 Gram on578 variables has order
binomial(580,2)=167910. No allocation/runtime/solve/recovery is authorized.

## 3. Compactness does not repair the old degree-two certificate

For the OLD signed-position boundary objective only, an exact two-atom
test remains: Z=+1 and-1 with equal weights, Aj=(j-6)*Z, all40 clips0,
actual flags b=1/0 respectively, actual gates on the assigned bands.
Sheared projection hulls are[-5,0] and[-3,8], widths5 and11; both belong
to D. All equations0, all nonclip inequalities and D inequalities are
nonnegative pointwise. Clip positive margins0, negative margins=-alpha*Z
have expectation0. Products of linear generators are nonnegative; degree2
only permits constant weights on quadratic generators.

The OLD formal area is-2 and3, giving expectedG=1/2 and target deficit
-49/62. This rejects the degree2 truncated preordering even after adding D,
for that OLD objective. It does NOT reject degree4 and must NOT be transferred
to the distinct velocity objective below.

## 4. Exact apex-free velocity objective on the unchanged graph

Write actual slice union width w(t). It is continuous piecewise affine,
absolutely continuous, with w(0)=0; interval endpoint velocities are fixed.
At regular heights exposed endpoints give

    w'(t)=6+sum_j (j-1)*covered_Rj(t)
              -sum_j j*covered_Lj(t).

Nonpersistent contacts occur at finitely many heights. A persistent adjacent
coapex Lj=R_(j+1) has equal coordinates AND equal velocities=-j. Shared
parallel flags either retain or remove both, and external coverage is equal
at the common point; derivative contributions cancel in either convention.
Routed upper ties do not change the all-source coverage unions. Thus the
formula holds almost everywhere for all real placements, including contacts.

Absolute continuity/Fubini give

    G=integral_0^1 (1-t)*w'(t) dt
     =3+sum_j (j-1)*(C0(Rj)-C1(Rj))
        -sum_j j*(C0(Lj)-C1(Lj)).

This is a NEW exact quadratic objective in the SAME graph wires. No apex
coordinate appears explicitly. No new variable, gate or constraint is
needed. The old positional boundary formula remains exact on genuine
graphs; their two polynomial extensions need not agree on false lifts.

For valid assigned bands, C0-C1 is integral of(1-t) over a height union,
so lies in[0,1/2]. The new formal objective then lies in[-15/2,21/2].
An arbitrary erroneous clip assignment can reverse an original band's
lower/upper endpoints: the existing paired-sort/max equations do NOT
separately impose each original upper>=lower. The narrow bound cannot be
asserted for ALL such false graphs. Nonetheless all H,S wires stay in[0,1],
and each of five increments f(H)-f(S), f(s)=s-s^2/2, lies in[-1/2,1/2].
Thus |C0-C1|<=5/2 and the universally safe coarse objective bound is
[-87,93]. The tighter ordered-band bound and coarse general bound are
different statements. Both remove the old unbounded-apex loss mechanism.

On the OLD T family the difference is exactly-1/8, independent of T:
the newly exposed R1 on[3/8,1/2] has velocity0; the newly exposed R3,L1
on[1/2,1] give velocity difference-2-(-1)=-1. Integrating against(1-t)
gives-1/8. The earlier positional objective had difference(T+1)/8.

Also, on BOTH two-atom assignments in section3, the NEW objective is3:
at Z=+1 the parallel contributions sum15/2-15/2=0; at Z=-1 all are0.
The old degree2 deficit therefore does NOT carry over to this objective.

## 5. Exact scope and unresolved certificate

The global area-equal compactification and the apex-free exact formula are
reviewable whole-domain results, not new area floors. They escape distinct
hypotheses of the prior no-go: compactification removes unrestricted true
recession rays; the new objective removes the divergent false T loss.
The old proofs remain correct for their frozen unrestricted graph/objective.

No degree4 SOS/preordering coefficients, exact target identity, PSD recovery,
whole competing-minimum exclusion or cost-qualified numerical execution has
been obtained. Compactness, the changed fake-loss calculation and defeat of
an old dual do not imply such a certificate. K6 remains OPEN.

Created only this new critic note. Mathematical processes/solver/SDP/code/
build/installs/newagents/UI/API/DB/Git/infra/scratch/deletions:0. Mathematical
definitions and proven domain bounds only; no implementation or predecessor
change. Actual stop and final literal-review records follow below.

## 6. Recommended canonical shear-three objective

Section4 preserves the first apex-free velocity formula, before aligning
it with the compactification shear. In x'=x+3t the endpoint velocities are
Rj'=4-j,Lj'=3-j; membership height bands and all578 existing wires remain
unchanged. Hence the recommended quadratic objective is

    G3=3+sum_j (j-4)*D_Rj-sum_j (j-3)*D_Lj,
    D_ray=C0(ray)-C1(ray).

It is exactly the genuine area for all placements and faces. Positive
coefficients sum6, absolute negative coefficients sum12, so valid ordered
bands imply G3 in[-3,6]. For arbitrary bounded-wire lifts the safe coarse
bound |D_ray|<=5/2 gives G3 in[-42,48]. The tighter range is NOT claimed
for reversed-band false clips. No extra equation or constraint was used.

The genuine pointwise left/right covered-count balance also shows
G3-G0=3*sum_j(D_Lj-D_Rj)=0 on the real geometry. Their false extensions
can differ. On the old T family, the newly exposed R1 contributes velocity3
on[3/8,1/2], with weighted interval integral9/128; the later R3-L1
velocity difference is-1, contributing-1/8. Thus

    G3_false-G_true=27/128-16/128=11/128.

This reverses that particular false bias but is not a universal false-point
repair or an SOS identity. The old exact two-atom dual still gives G3=3
at both atoms, so it cannot refute this new objective.

## 7. Stop and review ledger

Own new-derivation STOP was observed2026-10-13 01:19:35UTC, before the
unchanged01:41:58 ceiling. The reviewed reductions, their escape
mechanisms and unresolved certificate now have a decisive feasibility
assessment: exact representation/domain YES; degree4 target identity,
numerical production and recovery NOT qualified. No new root area floor.
Subsequent activity is literal review/recording only, not cap exhaustion.

## 8. Literal review of the new degree-two obstruction

Builder's newly routed exact dual, reviewed after own derivation STOP,
DOES reject degree2 for the recommended velocity objective, including D.
Take Z=4/5 with weight3/5 and Z=-6/5 with weight2/5, Aj=(j-6)*Z.
The sheared hulls are[-4,0] and[-3,9], widths4 and12, hence both in D.
Assign all clips0 except pair16 denominators5 and4, assigned4/5 at the
positive atom and0 at the negative atom; denominator6 stays0. Flags are
actual; sorting/routing/max gates are actual operations on these bands.

The only positive-length nonparallel coverage is R1/L6=[0,4/5] at the
positive atom; the other pair16 bands are[4/5,4/5]. Parallel baseline
contributions cancel. Thus G3 is3/25 and3, respectively, giving

    expected G3=159/125,
    expected(G3-40/31)=-71/3875.

All equations0; all nonclip generators, D bounds and products of linear
generators are nonnegative pointwise. Ordinary negative clip margins have
expectation0. For the two exceptional clips, denominator5 negative margin
has expectation12/25; denominator4 negative and positive margins have
expectations72/125 and12/125. All these are nonnegative. Degree2 permits
only constant SOS weights on quadratic generators, and every free SOS has
nonnegative expectation. The full degree2 preordering therefore fails.

The degree4 term q16,den6*(tau16,den5)^2 has expectation-32/125 and is
nonnegative on genuine geometry; it escapes this dual. This is neither a
degree4 certificate nor proof that such a certificate exists. The old
dual in section3 and this NEW dual are distinct; their scopes are not mixed.

## 9. Literal review of the490-variable exact representation

In G3, coefficients of R4 and L3 are0. Their coverage networks are
independent conditional on shared clips/flags, so their36 sorting and8
max variables per ray can be omitted from a NEW equivalent mathematical
definition. No frozen file or implemented gate is deleted.

Each omitted ray has18 linear equations,44 quadratic equations and34
linear inequalities. Counts become490 variables,180 linear/445 quadratic
equations,430 linear/90 quadratic inequalities. Optional D adds30 linear
inequalities, giving460. True clip/flag values extend constructively to
the omitted networks, with either legal upper tie routing, so the feasible
geometric projection and area objective are equivalent globally.

This is geometric equivalence, NOT low-degree-certificate equivalence:
a578-variable certificate might use omitted ray masks in its SOS rows.
Deleting auxiliary wires can change certificate power even with identical
feasible geometry. No degree4 feasibility preservation theorem is asserted.
The new degree2 dual and its degree4 escape use retained clips,R1,L6,
so remain valid for490 variables.

A dense full free degree4 Gram on490 variables has order binomial(492,2)
=120786; its raw double-array storage is116714062368 bytes, about116.7GB
decimal. This is only a static dense-array comparison, not total resource
qualification or a requirement for every sparse approach. No array, solver
or process is run. Sparse/structured identity existence, cost and recovery
remain unqualified. All additions here are literal checks of Main/Builder
messages after own01:19:35 mathematical STOP, not another research route.

## 10. Full final-note review

FULL Main GEOMETRIC_REDUCTION_COMPLETION_20261013.md sections1–8
was read by observed2026-10-13 01:23:01UTC: ACCEPTED, no blocking error.
This covers global compactification/attainment, the shear-three formula
and persistent contacts, exact11/128 false-family difference, invalid-band
range caveat,490 counts and the low-degree-certificate-power limitation,
new degree2 dual/margin expectations and degree4 escape, static Gram
storage, and the exact weighted target:

    3D_R1+2D_R2+D_R3+D_L4+2D_L5+3D_L6
       -2D_L1-D_L2-D_R5-2D_R6 <=53/31.

No external/formal acceptance is claimed. Builder messages were reviewed
as supplied; no absent completed Builder file is claimed read. Main's own
reported new-derivation STOP01:22:42UTC is separate from critic01:19:35.
The result is exact whole-domain reduction/representation, NOT the sharp
area inequality. Degree4 certificate, exact recovery and execution remain
unqualified. Only recording/literal review after own STOP; no new route.
One ordinary Markdown patch-context mismatch was corrected from the actual
file tail; it was not a mathematical process or failed solver start.
