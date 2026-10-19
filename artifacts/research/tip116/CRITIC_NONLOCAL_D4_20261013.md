# Independent nonlocal-support feasibility review

Status: FINAL PARTIAL / global K6 OPEN. Owner activation2026-10-12 23:53:36UTC;
unchanged hard stop2026-10-13 00:23:36UTC. Same all-real G6>=40/31,
PUBLIC_DISCOVERY. New variables/inequalities/gates and mathematical
subprocesses are not authorized. Only this new critic note is written.

Scope, protocol, latest commitment/handoff checkpoint, TIP116 charter,
FULL local Vibecode skill and TIP/report reference were read. The skill
governs scope/reporting, not proof or computation. Earlier rejections and
the exact578-variable boundary graph remain frozen and valid.

## 1. Same-pair clipping support still cannot suffice

Consider the explicit restricted expansion: affine quadratic-clip SOS
rows may use A, five adjacent sign flags, and ALL two/three clip variables
of that SAME source pair, but no clip or gate from another pair. Existing
equation multiples may be arbitrary. This is narrower than the approved
option to choose any existing wire; its rejection must not be generalized.

For a nonadjacent pair, on a genuine negative raw-crossing recession cone,
all its pair clips are0. Area boundedness forces the A coefficients to
vanish and the remaining affine flag/constant part to vanish on zero and
all five unit sign patterns. The row is therefore sum_k gamma_k*tau_k.
On positive raw-crossing rays all the pair clips become1, yielding the
corresponding sum_k gamma_k*(tau_k-1) positive-tail row. This is the same
open-cone argument as the predecessor, with several own-pair clips rather
than one. No stationary/compact-range restriction is introduced.

Use the exact false-lift assignment

    A=(-8,-31/4,-7,-4,-2,0), all flags1,
    adjacent clips ACTUAL, all nonadjacent clips0.

All intervals in the coverage network have ordered endpoints; sorting,
routing and union maxima take their actual values. All h=0 and all ordinary
inequalities/products are nonnegative. Nonadjacent weighted clip terms
are zero: g+ has tau0 and the negative-tail row is zero because all its
same-pair clips are0. Adjacent terms remain nonnegative.

Only the adjacent interactions1/2 and2/3 have positive-height bands.
Their apex differences are1/4 and3/4. Adjacent pair overlap area is
C(d)=d-3d^2/4 for0<d<=1, so C12=13/64 and C23=21/64.
The right endpoint R2 is covered by BOTH neighbors exactly on
E=(3/8,3/4); no left endpoint is double-covered. Counting the two pair
contributions separately would subtract R2 twice, while the ray-union
network subtracts it once. Therefore the exact formal boundary value is

    G_lifted=3-C12-C23+integral_E R2
            =316/128-399/128=-83/128.

Here R2=-31/4-t. The other adjacent differences are3,2,2, producing only
zero-measure [1,1] bands; nonadjacent assigned bands are [0,0]. Thus there
is no missing coverage term. Since every surviving certificate term is
nonnegative and equations0, P<0 is a contradiction.

This rejects same-pair-only clipping support, not every existing-wire
support. The false-lift is NOT actual clipped geometry or a K6 counterexample.

## 2. Source-specific simultaneous coverage is not yet an affine wire

For the right ray R2, simultaneous coverage by sources1 and3 has length

    D13=[min(b1,tau_(2,3;1))
         -max(tau_(1,2;1),tau_(2,3;2))]_+.

It is zero whenever A3-A1<0 because those two source intervals are disjoint.
It detects the double-covered cluster in Section1. But this nonlinear
function is not automatically a permitted affine SOS row. It needs a
source-specific upper minimum, lower maximum and positive part. The saved
network computes unions of ALL five source bands and reorders interval pairs.

Subtracting the whole ray-union length from the lengths of just the two
selected bands gives D13 only when the other three bands add nothing. In
general that expression can be negative, even when D13=0. Squaring it can
grow on a negative-c recession ray and does not provide the required mask.
No affine expression of D13 in the existing complete wire list has been
proved or disproved here. It cannot be admitted by silently adding a gate.

## 3. One genuinely existing small nonadjacent mask

Declare the initial source order for R2 to be increasing labels[1,3,4,5,6].
The frozen note specifies the zero-based network but had NOT specified this
initial source labeling. The declaration fixes a consistent labeling of
its existing input wires; it must not be reported as a previously fixed
source order or as an added gate.

The existing first comparator(0,3) lower output is

    r15=min(tau_(1,2;1),tau_(2,5;4)).

Both inputs are coverage-band lower endpoints on R2. Since
A5-A1=(A2-A1)+(A5-A2), a negative A5-A1 forces at least one input clip0.
Thus r15=0 on that true negative-crossing halfspace, including contact
limits, and r15 always lies in[0,1]. The term

    g_minus_(1,5)*r15^2

uses only the existing symbols A1,A5,tau_(1,5;k),r15; support at most4 and
total degree4. It vanishes on the genuine graph: negative raw c makes
r15=0, and all other actual clip branches make g_minus0. This is a valid
example of support that is not covered by the old independent-clip theorem.

It is NOT a certificate or an algebraic-feasibility result. In Section1's
false-lift r15=0 because its nonadjacent(2,5) input clip is0. Merely adding
this mask therefore does not remove that obstruction. If a selected class
adds it ONLY to pair15 negative-tail rows, while keeping the others same-pair,
then on true negative c15 both own-pair clips and r15 vanish; the remaining
affine A/flag/constant coefficients collapse as before. Every row also
vanishes at the cluster assignment, so that PARTICULAR enlarged class
is still rejected. This is not a rejection of arbitrary578-wire rows.

## 4. Current truthful limit

Same-pair-only supports have a decisive obstruction. A concrete existing
wire carries some valid nonadjacent information, but it neither encodes the
needed fixed-source double-overlap mask nor supplies coefficients for the
global target. No exact G6-40/31 identity, PSD certificate, whole inversion
exclusion, all-existing-wire impossibility or qualified solver execution
has been obtained. Root K6 remains OPEN.

No process/SDP/code/numerics, install, new agent, infrastructure, API/UI/DB/Git/
build change, scratch or deletion. Only ordinary reads, hand derivation and
this permitted Markdown note. Frozen predecessor bytes remain untouched.
The subsequently observed stop and full literal-review records appear below.

## 5. Completed ten-path source labeling and exact tested support

Section3 records an earlier illustrative source labeling, not the final
ten-path declaration. The frozen architecture left initial source labeling
unspecified. Complete its existing first disjoint comparisons(0,3),(1,4)
with the following source pairs, filling remaining slots in increasing order:

    R2:13; L2:14; R3:15,24; L3:16,25;
    R4:26,35; L4:36; R5:46.

Each displayed target pair i,j is compared on a ray k with i<k<j. Double
assignments have four distinct source labels. This exhausts exactly the ten
nonadjacent pairs without adding wires or changing any ray union. On Rk
the lower inputs are clip((Ak-Ai)/(k-i)) and
clip((Aj-Ak)/(j-k+1)); on Lk the denominators are k-i+1 and j-k.
Their existing min r is zero on Aj-Ai<0; their max v lies in[0,1].
These lower outputs are unambiguous even if associated upper routing ties.

The rejected class permits each quadratic-clip SOS row to be affine in A,
all five flags, its OWN pair's clips, and its OWN selected path min/max.
It does NOT permit all ten masks, unrelated clips or arbitrary coverage
wires in each row. Arbitrary equality multipliers do not help this class;
other certificate summands can be nonnegative terms of arbitrary degree,
provided no additional term involving the erroneous pair13 generators has
support outside the stated class. This caveat is essential.

## 6. Pair13 normal form and outside-index source obstruction

Let x=A2-A1,y=A3-A2. The selected R2 outputs are
r=min(clip(x),clip(y/2)), v=max(clip(x),clip(y/2)). Its three raw
crossings are c=(x+y)/d,d=1,2,3. On the genuine graph a putative
certificate bounds every nonnegative weighted term by P<=53/31.

For any affine negative-tail row, scaling an open x+y<0 cone eliminates
all A coefficients: the bounded wires cannot cancel a growing linear A
part while g_minus grows. Fixing 0<x<1 and sending y to minus infinity
makes own clips and r zero and v=x. The row must vanish for every x,
so its v coefficient is zero. Independent variation of flags3,4,5 kills
their coefficients. This mixed-sign tail gives beta1+constant=0; the
opposite mixed-sign tail gives beta2+constant=0; the both-negative tail
gives constant=0. Hence every row is

    sum_d gamma_d*tau_13,d + rho*r.

No positive-tail normal form is needed at the diagnostic below, because
all erroneous pair13 clips are zero and their g_plus is zero.

Take Main's exact assignment

    A=(-32,-100,-31,-200,-61/2,0).

Keep all clips genuine except pair13's three clips, assigned0. Keep true
flags and evaluate all sorting/routing/max gates on these bands. For the
selected pair13 mask, r=0,v=1. Thus all pair13 negative-tail rows vanish,
every other inequality term is nonnegative and every equality term is0.
All bands have correctly ordered endpoints, including zero-measure ones.

Write T=-32. Sources1,3,5 have apices T,T+1,T+3/2; sources2,4,6 are
disjoint from this cluster throughout0<=t<=1. In the genuine pair13 lens,
the hidden endpoints are L3,R1 on(1/3,1/2) and L1,R3 on(1/2,1).
Source5 covers L3 on[1/4,1/2], R1 on[3/10,3/8], and neither latter
phase endpoint. Removing pair13 coverage therefore changes the integrand
by0 on[1/3,3/8], by R1=T on[3/8,1/2], and by R3-L1=1-t on[1/2,1].
Boundary contacts have measure zero. Consequently

    G_false-G_true = T/8+1/8 = -31/8.

Since genuine G_true<=3, G_false<=-7/8<40/31, whereas every surviving
certificate term is nonnegative. This exactly rejects the specified
OWN-pair-plus-OWN-path-mask class over real coefficients. It is not an
actual geometric placement of the clipped graph and is not a K6 counter.

The failure is a source5 interaction outside the pair's index interval;
an index-intermediate path mask cannot retain that boundary coverage.
It does not establish impossibility for rows using unrelated path masks,
arbitrary existing578 wires, other quadratic-generator products or all SOS.

## 7. Full literal review and terminal record

Own new-derivation STOP was observed2026-10-13 00:03:51UTC, before the
original00:23:36 ceiling, on the exact specified-class failure. This is
not cap exhaustion and does not authorize another route.

FULL Main NONLOCAL_D4_COMPLETION_20261013.md and FULL Builder
BUILDER_NONLOCAL_D4_20261013.md were read starting00:03:51UTC. Main's
normal form, all ten source assignments, full omission table and limits
are accepted as scoped. Builder's independent T=-100,d=1/2,e=1 variant
also checks: genuine G=35/12; four removed boundary portions yield
T/30+5/288; G_false=-115/288 and P_false=-15085/8928. This is a literal
hand check, not external/formal review. Builder was asked to replace its
remaining 'ongoing broader-support attempt' wording with the observed STOP.

No global identity, new area floor, whole inverted-class closure, arbitrary
578-support no-go or qualified solver execution follows. Root K6 remains
OPEN with zero new root closure. Mathematical processes, SDP runs, code,
new variables/gates/constraints, infrastructure, agents and deletions:0.
Only this new critic Markdown note was edited; predecessors remain frozen.

At observed00:04:47UTC, the repaired Builder sections5–6 were reread in full:
terminal wording, separate Builder00:03:41/Main00:02:59/critic00:03:51 stops
and zero-resource ledger are accepted. The earlier requested wording repair
is resolved. Final literal review/recording only; no new mathematical route.
