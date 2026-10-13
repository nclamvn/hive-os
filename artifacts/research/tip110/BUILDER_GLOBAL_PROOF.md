# TIP110 — Builder global-calibration challenge

Status: all-real finite K6 root OPEN; hand-only campaign, mathematical
subprocess grant0 and actual mathematical executions0. Old109 sources remain
immutable. Its region C theorem is retained; provisional farther-restoration
and timing-flow sections are not assumed accepted or used as root evidence.

## Exact natural proxy under challenge

Put D_i=A_(i+1)-A_i>=0, A_j=p_j+j. The accepted natural nearest-neighbor
bound is G>=f_NAT, with

    f_NAT=sum D_i-2+B_LEFT+B_RIGHT-sum D_i^2/4+sum R_i,
    B_LEFT=integral_0^1 max_j(p1-p_j-(j-1)y,0)dy,
    B_RIGHT=integral_0^1 max_j(p_j-p6-(6-j)y,0)dy.

End restoration is(D-2E)_+^2/12. Interior restoration, m=min(E,F),
M=max(E,F), is(D-2m)_+^2/12+(D+m-3M)_+^2/24. All clamps and switches
are retained. A GLOBAL f_NAT>=40/31 on the relevant natural domain would
be sufficient; an actual minimum need not be a minimum of this proxy.
No such global calibration has been proved here.

## A concrete obstruction to reflection reduction

A tempting new whole route is reflection averaging, followed by a symmetric
scalar calibration. It is FALSE for this proxy even on natural, range-bounded,
strictly bottom-connected points satisfying both bottom-slope conditions.

For0<|e|<1/16 set

    p(e)=(5/4,5/4,3/4-e,1/2-e,0,0),
    D(e)=(1,1/2-e,3/4,1/2+e,1).

Natural apices are strict. The bottom offset range is5/4<49/31, and the
bottom interval union is strictly connected. The leftmost base tie is5/6,
the rightmost base tie1/2. The depth-side slopes are4 for t<1 (labels5/2)
and6 for t>1 (labels6/1), hence both are>=3. No full-gradient/radial
stationarity is claimed.

Both envelope integrals are exactly25/128. For LEFT the line5/4-4y,
coming from label5, dominates all other positive candidates until it vanishes
at y=5/16. The competing lines are1/2+e-2y and3/4+e-3y; their difference
from the selected line stays strictly positive through that height, and
their own positive parts have already vanished thereafter. Label6 is below
label5 and label2 contributes no positive part. RIGHT is the reflected
argument with selected label2 and competitors3/4-e-3y,1/2-e-2y.

Thus

    H=7/4+25/64=137/64,
    sum D_i^2/4=49/64+e^2/2.

All interior restorations vanish in this interval. The two end arguments
are2e and-2e, so their combined restoration is e^2/3. Consequently

    f_NAT(p(e))=11/8-e^2/6.

Horizontal reflection sends p(e) to p(-e); their average is p(0).
Therefore f_NAT(p(0)) is STRICTLY LARGER than the average of the two proxy
values. The raw-gap negative curvature exceeds the compensating end-hinge
curvature here. Symmetry cannot be imposed by Jensen, by convexity of hull
energy/restoration separately, or by the existence of a symmetric construction.

This does NOT refute f_NAT>=40/31: the displayed values remain above the
target. It is not an actual-area computation or a smaller rational witness.
It refutes precisely the proposed averaging implication. The initial message
incorrectly called both slopes4; the4/6 correction was sent immediately and
is preserved here. The admissibility claim itself is unchanged.

### Hand strengthening, preserving the scope restriction

The exact natural cut formula also gives G=f_NAT on this family. For cuts2/4
the closure time is D2/2 or D4/2, at most9/32; all neighboring and farther
cross-cut lines stay above the adjacent gap until that closure. Cut3 closes
at3/8 before either adjacent filler reaches it. Correctly retaining the
neighbor-fill clamps, T1=1/2-(e)_+/3 and T5=1/2-(-e)_+/3. Both are<=1/2.
The initial strengthening incorrectly used the neighbor-active formula on
both ends, even on the end whose neighbor never reaches it before closure.
Main caught this, and the correction is preserved rather than hiding that
failed free-formula continuation.

It suffices by reflection to consider e>=0. For end1, compare each farther
cross line to the nearest residual on its two linear pieces. Check0, the
kink t=D2, and T1=1/2-e/3. At the kink the
length3,4,5 differences are respectively D3-D2=1/4+e,
D3+D4-2D2=1/4+3e, and D3+D4+D5-3D2=3/4+4e, all positive.
At closure the three farther lines have values1/4+e/3,
1/4+5e/3, and3/4+2e. They are positive. End5 has no active neighbor before
its closure1/2, so a single affine comparison suffices; at closure its three
farther lines have values1/4+e,1/4,3/4, all positive. Reflection handles e<0.
Hence no farther line creates an earlier
hole reduction, and the displayed proxy value is the actual scaled area.
This is a HAND cut-identity verification, not a subprocess replay. It refutes
actual-area Jensen as well, while still giving no stationary point or smaller
area than40/31. In particular its range5/4 is below the retained79/61 lower
range forced at a competing stationary minimum; that condition is NOT claimed.

### Main's corrected range-admissible version

The same failure persists inside the retained stationary RANGE interval,
without claiming actual stationarity. Keep the earlier point/history and put

    p=(4/3,4/3,5/6-e,1/2-e,0,0),
    D=(1,1/2-e,2/3,1/2+e,1), 0<|e|<1/16.

The range4/3 is in[79/61,49/31]; the bottom is strictly connected and its
two depth-side slopes remain4/6. Each hull envelope is2/9: the selected
left line4/3-4y dominates through y=1/3, since its differences from the
label3/4 competitors at that height are1/6-e>0; the competitors vanish
before that height. Reflection proves the right statement. Therefore

    H=5/3+4/9=19/9,
    raw gaps=53/72+e^2/2,
    total restoration=e^2/3,
    f_NAT=G=11/8-e^2/6.

For the actual-cut equality, work with e>=0. Cuts2/4 close by9/32, cut3 at
1/3 before either adjacent filler. End1's two-piece closure is1/2-e/3,
and its farther lines at closure have positive values1/6+e/3,
1/6+5e/3,2/3+2e. At its kink the corresponding differences from the nearest
residual are1/6+e,1/6+3e,2/3+4e. End5 has no active neighbor before1/2;
its farther-line closure margins are1/6+e,1/6,2/3. All initial differences
are nonnegative; affine comparison on each piece proves equality. Reflection
handles e<0. This hand diagnostic was proposed and independently checked by
Main; it does not claim an area-routine replay or competing-minimum conditions.
Indeed 2G=11/4-e^2/3 is NOT1+range=7/3. Full gradient stationarity is also
unclaimed. The sole conclusion is failure of reflection averaging even after
the retained lower and upper RANGE filters, not failure of the root target.

## Attempted whole sharp-anchor domination

The requested complete route was to compare the clamped global proxy to the
accepted sharp quadratic Q, retaining all deficits rather than extending Q
outside its validity region. Let a,b,c,d,e be the reflection coordinates of
TIP109 (d and e are NOT set to zero). The three selected free restoration
energies are

    E_END=(a-2b)^2/6+(d-2e)^2/6,
    E_CENTRAL=(c-2b)^2/8+e^2.

Their actual nonnegative-conjugate values subtract metric projection deficits
from these free energies. The selected hull free-cut expressions have further
ordered/nonnegative-cut projection deficits. Thus a whole comparison must
control the SUM of those deficits by Q-40/31, plus any retained R2/R4 and
additional full-hull support. None may be silently discarded in the wrong
direction.

A natural first attempt uses nonexpansiveness of each metric projection from
the feasible sharp anchor. It bounds each restoration deficit by that free
energy applied to the perturbation. This is valid separately but fails as a
complete Loewner domination. Write perturbations as (u,v,w,d,e). Subtracting
both END and CENTRAL curvature bounds from Q-distance leaves the symmetric
quadratic

    u^2+v^2/2+w^2/4+u*v+v*w,

and the antisymmetric quadratic d^2+e^2/2+d*e. The symmetric direction
(u,v,w)=(0,1,-2) has value-1/2. This failure occurs BEFORE adding the hull
pooling deficits. Subtracting central curvature alone remains positive
definite; it is the joint independent upper bounds which fail.

This negative direction is NOT a feasible negative-area example. The sharp
anchor has nonzero feasibility margins, and D>=0 together with the full range,
ordered-cut and restoration constraints limit simultaneous activation. The
failed implication is precisely: separate projection Lipschitz bounds imply
the global sharp calibration. A repair requires a complete JOINT inequality
on those constraints, or a complete actual-minimum argument. No symmetry,
stationarity of the lower proxy, or unaccepted timing-flow inequality licenses
that repair. A finite analytic active-cone classification would have to cover
every hull pooling/nonnegativity face AND every restoration/contact switch,
including nonsymmetric points; no such complete classification is supplied.

## Current exact gap

The natural whole joint cone/hinge inequality remains uncalibrated outside C.
Frozen selected supports lose pooling/nonnegativity deficits; a symmetric
reduction is now explicitly refuted. No unproved8/49 flow bound is assumed.
All12 inverted continua remain part of the root, being investigated by Main
and the scoped critic. These observations do not prove impossibility or
license another target, execution, family count or finite-sample conclusion.

## Terminal Builder verdict — scientific STOP

The complete sharp NAT calibration has NOT been obtained, and no complete
actual-stationary reduction into C has been proved. The concrete whole-method
obstruction is the missing JOINT clamp/pooling inequality after the separate
sharp-anchor domination fails. Applying stationary equations to the lower
proxy would not repair it: an actual minimum need not minimize the proxy.
Applying the provisional timing sum without a proved flow inequality would
likewise replace the open obligation rather than close it.

An analytic active-cone approach remains a possible METHOD, not a completed
proof: it must jointly cover all two-envelope pooled/nonnegative cones,
restoration activation faces and actual bottom-contact conditions, retaining
nonsymmetric points. No classification, coverage assertion, regional proof
extension or further sample collection is supplied as a substitute here.
STOP is on this named unclosed implication, not mathematical impossibility,
wall-time exhaustion or a request for a new execution grant. The accepted
TIP109 theorem on C and all predecessor evidence remain unchanged; finite
all-real K6 and TIP110 R1 remain OPEN.

## Ledger

Mathematical subprocesses0, seconds0, failed scientific starts0. Source reads,
ordinary clock requests and apply_patch only. One aggregate source-read result
truncated the protocol; it was reread completely before mathematical work.
An overly broad ordinary rg source search matched large saved JSON and was
truncated; it was replaced by an md-only source search. It generated no
mathematical data and is not a scientific execution. Two hand wording/formula
errors were corrected explicitly: the4/6 bottom slopes and the inactive-end
closure clamp. Ordinary apply_patch context failures0.
No code, enumeration, random, optimizer, box/chamber generation, app/UI/API/
DB/Git/build/install/scratch operation or old-file edit.

## Tiếng Việt

Chưa chứng minh được cận sắc trên TOÀN miền thứ tự đỉnh tự nhiên ngoài C,
và chưa chứng minh mọi cực tiểu thực phải vào C. Đã xác định rõ hai bước
không hợp lệ: ép đối xứng bằng trung bình phản xạ, và cộng các cận tổn thất
chiếu riêng lẻ để suy ra bất đẳng thức toàn miền. Phản ví dụ Jensen có diện
tích LỚN HƠN40/31 và không thỏa điều kiện cực tiểu; nó không phản bác cận K6.

Dừng nghiên cứu tại khoảng trống bất đẳng thức GHÉP giữa các phép kẹp/phân
khối đường bao và khe phục hồi. Không kết luận bất khả thi, không nói hết
ngân sách/thời gian, không thay nghĩa vụ bằng một định lý trên miền con.
Không chạy tiến trình toán học nào. Cận K6 toàn bộ số thực vẫn MỞ.
