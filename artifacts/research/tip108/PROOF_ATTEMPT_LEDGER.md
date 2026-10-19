# TIP108 — Builder exact dual attempts and remaining analytic gap

This is not closure of TIP108 or of global K6. All mathematical support below
concerns the one difficult oriented signature L={4,5,6}, R={1,2,3}. The other
41 necessary signatures, and the continuous geometry even of this signature,
are not certified by these relaxations.

## Scaling and valid inequalities

Set p_j=6x_j. The scaled slice is [p_j+jy,p_j+1+(j-1)y], 0<=y<=1,
and G=6F. A two-component bottom has slice width 2+S, so its radial defect is
D=2G-(2+S). We do not impose radial stationarity. Under the assumed S<=18/31,
G>40/31 is sufficient for D>0 (not necessary), but that bound was not obtained.

For a rank gap r, two slices have intersection width
max(0,1-y-|d-r*y|), with d the appropriately signed relative offset.
Intra-group offsets obey d in [-18/31,18/31]. A separated cross pair can
overlap only if its left label exceeds its right label by r>=2. In that case
d>1, and d>=r gives zero area, so [1,r] is a conservative closed domain.
Intra-pair full-area cap is 1/(r+2); separated cross cap is
(r-1)/(r(r+1)). The latter is attained only in the closure d=1, and follows
from full overlap (r-d)^2/[r(r^2-1)] for 1<=d<=r.

At any planar point, its triangle-membership set must be a clique of the
possible-pair graph. We enumerate *every* nonempty clique, not a sampled set.
Nonnegative coefficients a_i,b_ij,c_B obeying, on each permitted atom T,

    sum_{i in T} a_i - sum_{ij in T} b_ij
      + sum_B c_B 1(T intersects B) <= 1

give, after integration,

    G >= (1/2)sum_i a_i - sum_ij b_ij cap_ij
           + (70/61)(c_12345+c_23456).

The consecutive-five lower bounds 70/61 are retained K5 theorem dependencies.
They are not a proof of global K6. Coefficients a_i are deliberately restricted
to nonnegative values. Since individual triangle areas are exact, signed a_i
would be another admissible dual class; the optimality claims here do NOT
exclude that strengthening.

## L1: complete atom pilot, one signature

`atom_dual.py` enumerates 47 atoms and 22 coefficients. Rational Bland simplex
uses 76 pivots. It emits a feasible exact pointwise inequality together with
matching nonnegative upper multipliers. `check_certificate` independently
checks both vectors against the original matrix/objective, not its tableau.

The optimum of the stated nonnegative dual class is exactly 70/61. Its gap
to 40/31 is -270/1891. Its defect lower bound at S=18/31 is -540/1891.
The feasible lower certificate merely selects the first consecutive-five
union (c_12345=1), so no K6 improvement is obtained. The upper multiplier
certificate establishes a limitation of this relaxation, not feasibility of
any actual six-triangle geometry.

Evidence: `BUILDER_ATOM_DUAL_PILOT.json`.

## L2: complete five-band pilot, one signature

Bands are [0,1/3], [1/3,1/2], [1/2,2/3], [2/3,4/5], [4/5,1]. Each band
has its own a_i,b_ij, and the two c_B are global. Triangle mass on [l,h] is
(h-l)-(h^2-l^2)/2. Only pairs with positive band caps may occur in an atom.
There are 186 atom-band constraints; 415 exact pivots.

`height_dual.py` maximizes each pair's overlap on each entire offset domain.
The event heights are d/r, (d-1)/(r-1) for r>1, and (d+1)/(r+1), besides
the band endpoints. Parameter breakpoints are their incidences with band
endpoints. Event-to-event crossings occur at d=r, outside an intra domain
or at the cross domain endpoint. For r=1 the horizontal zero branch has
parameter d=1, also outside the intra domain. Hence on each open parameter
cell the event order and affine-integrand branch are fixed and the exact
integral is a polynomial of degree at most two.

Three rational interior evaluations recover that polynomial algebraically;
this is interpolation of a proved degree-two piece, not sampled optimization.
Every cell endpoint and every interior concave critical point is evaluated.
Endpoint agreement with the independent affine-slab integral is checked.
The saved cap certificates contain every cell, polynomial, and maximizer.
Zero integral caps justify omitting pair memberships almost everywhere;
measure-zero slice contacts do not affect the area inequality.

The stronger relaxation still has exact optimum 70/61, with matching
upper-multiplier certificate in the same nonnegative coefficient class.
No expansion to the other 41 signatures was run. The individual band caps
allow different pairs and bands to attain incompatible offset maximizers.
They do not retain the single common inter-group displacement q or each
constituent p_j across heights. A proof needs that coupling or an equivalent
geometric tradeoff.

Evidence: `BUILDER_HEIGHT_DUAL_PILOT.json`.

## Analytic lead, NOT a theorem

For zero spans and L456/R123, relative displacement q=7/6 minimizes scaled
union area G=107/72. Differentiating the exact low-height envelope and
high-height pair intersections gives gradients, in increasing label order,

    R123: (-7/36,-7/72,7/24)
    L456: (-7/24,7/72,7/36).

Each group's coefficients sum to zero. Minimizing the linearized change
over boxes of spans a,b gives loss 7(a+b)/24. Thus the tangent expression
for defect is 35/36-19S/12, which equals 59/1116 at S=18/31.

This suggests the candidate supporting inequality

    G >= 107/72 - 7(a+b)/24.

It is NOT proved: full union area need not be convex in translations, and
a local tangent does not provide a global support plane. Even proving this
for L456/R123 would leave the other signatures. No finite control or family
has been substituted for this gap.

## New hand lemma: consecutive common-base groups, k<=5

This lemma is universal for the stated subgroup, not an equal-step family:
for k<=5 *consecutive* labels, arbitrary offsets of range s<1, the scaled
group area obeys G_group >= (k+1)/4-s/2. Nonconsecutive labels and the
whole two-component defect still require proof.

Translate offsets to [0,s]. If s=0 the common-base fan has area (k+1)/4.
For s>0, write p_i=s v_i with 0<=v_i<=1. Put n=k-1,
A=v_0,C=v_n, Delta=C-A, and E=sum_i(v_{i+1}-v_i)^2.

At any height, two disjoint slice intervals cannot appear in reversed label
order: that would require p_i-p_j>1+(j-i-1)y>=1, contradicting s<1.
At an uncovered point inside the slice hull, every triangle is either wholly
left or wholly right of that point. The left labels are a prefix, and the
right labels its suffix. Thus the actual gap is contained in the gap wedge
between some adjacent labels. Longer-label bridges can only reduce the true
complement; we do NOT claim a missing adjacent overlap disconnects the group.

Here "hull" means the horizontal slice hull: the interval from the minimum
left endpoint to the maximum right endpoint at that same height. It need
not be the ordinary two-dimensional convex hull of the triangles. Convex
hulls of the separate points (label_i,p_i) are used only to integrate those
endpoint envelopes and their excess B.

The adjacent wedge has area (1+p_{i+1}-p_i)^2/4. The slice hull has area
k/2+(p_n-p_0)+B, where B is the nonnegative endpoint-envelope excess. Hence

    G_group >= (k+1)/4 + s Delta/2 + s^2 (B_tilde-E/4).

The envelope excess scales exactly as B=s^2 B_tilde: all positive envelope
crossings occur at height<=s<1. Define

    u=max_{1<=i<=n} (A-v_i)_+^2/i,
    z=max_{0<=i<n} (v_i-C)_+^2/(n-i).

Each individual envelope line has triangular integral half of its displayed
quantity, so B_tilde>=u/2+z/2. The needed discrete path inequality is

    E <= 2u+2z+2(1-A+C) <= 4B_tilde+2(1+Delta).

For n=4 write the path (A,a,b,c,C) and h=1-A+C. Four interior-order cases
prove it, including all endpoint positions:

* Peak b>=a,c. First two squares are <=2(A-a)_+^2+2(1-A);
  last two are <=(b-C)_+^2+2C. Use u>=(A-a)_+^2 and
  z>=(b-C)_+^2/2.
* Valley b<=a,c. First two squares are <=(A-b)_+^2+2(1-A);
  last two are <=2(c-C)_+^2+2C. Use u>=(A-b)_+^2/2 and
  z>=(c-C)_+^2.
* Increasing a<=b<=c. The middle energy is <=(c-a)^2. This is bounded
  both by (A-a)_+^2+2(1-A) and by (c-C)_+^2+2C, so averaging bounds
  it by half the sum of the positive-boundary squares plus h. The endpoint
  energy is at most that same sum plus h, because the adverse squares are
  <=(1-A)^2+C^2<=h. Thus E<=1.5 times that sum+2h<=2u+2z+2h.
* Decreasing a>=b>=c. The middle energy is <=(a-c)^2. The resulting
  convex expression (A-a)^2+(a-c)^2+(c-C)^2 is maximized over
  0<=c<=a<=1 at (a,c)=(0,0),(1,0),(1,1). Each of these three values is
  <=(A-C)_+^2+2h. Both endpoint-line bounds u,z are at least
  (A-C)_+^2/4, giving the claim.

The elementary two-edge bounds in the peak and valley cases follow by
splitting at the relevant endpoint A or C. For example if b>=a and a<A<b,
(A-a)^2+(b-a)^2-2(A-a)^2 is
2(A-a)(b-A)+(b-A)^2 <=2(1-A); the other orderings are weaker.
For the decreasing case, when A>=C subtracting (A-C)^2 gives, at the
three vertices, respectively 2AC, 2(1-A+AC), and
2(1-A-C+AC), all <=2h. When A<C, the positive drop is zero;
the same comparisons follow from A^2+C^2<=2C and C<=1.

For n<4 append copies of the last endpoint C to obtain length4. E and
Delta do not change, the left envelope stays unchanged, and the right
envelope can only decrease as its label distances grow. Thus the n=4
inequality implies the original shorter-path inequality. k=1 is immediate.

Substitution now gives

    G_group-(k+1)/4+s/2
       >= s(1+Delta)/2+s^2(B_tilde-E/4)
       >= s(1-s)(1+Delta)/2 >=0.

This proves the consecutive-group linear bound, even with offset ties,
nonmonotone offsets, and changes in actual left-endpoint order. It does NOT
prove it for nonconsecutive labels. For gaps r_i between actual labels the
valid hull-minus-wedge formula is instead

    G_group >= 1/2 + sum_i [r_i/(2(r_i+1))
                   +delta_i/(r_i+1)-delta_i^2/(2(r_i+1))] + B.

Its direct terms gain (r_i-1)(1-delta_i)^2/[4(r_i+1)] relative to a
compressed-label formula, but its envelope denominators also grow. The next
argument proves this compensation for s<=18/31; it does not assume actual
union area is monotone under changing labels. An extrema-only envelope bound
is insufficient: normalized path (1,1/10,9/10,1/10,0) gives bound B>=1/4,
whereas E=21/10, so the relaxed path margin is negative. No guaranteed-weak
pilot of that relaxation was executed.

## Extension: all proper label groups in {1,...,6}

Insert one unit into an existing label gap by varying its size g from r to
r+1, r>=1, keeping offsets fixed. Write delta=p_next-p_prev. The direct
hull-minus-wedge expression increases by exactly

    (1-delta)^2/[2(r+1)(r+2)].

The hull excess B can decrease. It is piecewise C1 in g. On a fixed hull,
each negative-slope hull edge crossing the inserted gap contributes
alpha^2/(2d) to B, with vertical drop alpha and horizontal length d. Its
derivative is -alpha^2/(2d^2). At collinearity, merging or splitting edges
preserves their common slope, both the energy and this derivative agree.
Zero-slope events contribute zero derivative. Ties therefore do not create
an omitted jump. At most one edge of each of the lower and upper hulls
crosses the inserted gap.

For delta>=0, a negative lower-hull edge cannot end at the next point:
the previous point would lie above its negative chord and force
p_prev>p_next. Hence it ends strictly later. If it starts at the previous
point, alpha<=s-delta and d>=g+1. Otherwise let R>=1 be the distance from
the next point to the edge's later endpoint. Its lower-hull constraint at
the previous point gives p_prev>=alpha(g+R)/d, using the nonnegative later
offset. Since p_next=p_prev+delta<=s, alpha/d<=(s-delta)/(g+1).
The upper-hull proof is reflected: it starts strictly earlier, and the next
point lies below its chord while p_next>=delta and the earlier offset<=s.
Both give the same slope bound. Therefore total B loss is at most

    (s-delta)^2/[(r+1)(r+2)]
        <= (1-delta)^2/[2(r+1)(r+2)],

because (s-delta)/(1-delta)<=s and 2s^2<=648/961<1.

For delta=-u<=0, an adjacent negative hull edge has slope u/g; any proper
crossing edge has d>=g+1 and slope<=s/(g+1). Thus -B' is bounded by
max(u^2/g^2,s^2/(g+1)^2), the sum of the two half contributions.
For r>=2, integrating the sum (a conservative bound on the maximum) gives
loss<=u^2/[r(r+1)]+s^2/[(r+1)(r+2)]. This is at most the direct gain iff

    (1+4/r)u^2-2u+2s^2-1 <=0.

This convex expression in u in [0,s] is maximized at an endpoint. At u=0
it is <=-313/961. At u=s, r>=2, it is <=5s^2-2s-1, whose maximum on
s in [0,18/31] is at 0 or18/31 and is <=-457/961.

For r=1, if u>=2s/3 then u/g>=s/(g+1) throughout g in [1,2]. The loss
is at most u^2/2 and the comparison is 5u^2-2u-1<=0. This holds on
u in [0,18/31], by endpoint convexity. If u<=2s/3, the sum bound suffices:
the comparison is 5u^2-2u+2s^2-1<=0. Its endpoint values on that u interval
are at most -313/961 and -337/961, respectively, again using endpoint
convexity in s.

Every unit gap insertion thus preserves or increases the *lower bound*
relative to the consecutive group. Iterating reaches any proper label
subset of {1,...,6}. The already proved consecutive bound establishes

    G_group >= (k+1)/4-s/2,

for every proper group k<=5 with arbitrary integer labels from1,...,6,
offset range s<=18/31, including ties. The proof does NOT claim actual
group area is monotone in its label gaps.

## Whole 1+5 / 5+1 two-component exclusion

For a singleton on the left of the other five bottom intervals, its offset
is separated from every other offset by more than1. At height y<=1/5,
every other left endpoint exceeds the singleton's left endpoint by more
than1-5y. The singleton slice width1-y is at least1-5y. It therefore has
exclusive area at least integral_0^{1/5}(1-5y)dy=1/10. A singleton on the
right is the reflected endpoint argument. This uses neither radial
stationarity nor any assumed group label order.

The five-group span is S, and its just-proved weak bound is 3/2-S/2.
Thus G_total>=8/5-S/2 and

    D=2G_total-(2+S) >=6/5-2S >=6/155>0.

This is the ENTIRE1+5 and5+1 subgroup, not a selected family. The2+4,
4+2 and3+3 continuum remains unproved. Consequently TIP108's whole
two-component obligation and global K6 are still OPEN.

Vietnamese scope: Chặn tuyến tính cho mọi nhóm con gồm tối đa năm nhãn đã
được chứng minh bằng bao lồi–nêm khe và bất đẳng thức năng lượng đường.
Từ đó loại được toàn bộ trường hợp hai thành phần đáy có kích thước1+5
hoặc5+1, với D>=6/155. Đây không phải đóng nghĩa vụTIP108: các trường
hợp2+4,4+2,3+3 còn mở, và bài toánK6 toàn cục còn miền một thành phần đáy.

## Execution ledger

1. `python3 -B .../atom_dual.py --out .../BUILDER_ATOM_DUAL_PILOT.json`:
   PASS exact certificate; internal elapsed 0.1212501669942867 seconds.
   Conservative charged duration 0.2 seconds because displayed shell timing
   was lower than internal elapsed. Hard mathematical cap 25 seconds.
2. `python3 -B .../height_dual.py --out .../BUILDER_HEIGHT_DUAL_PILOT.json`:
   PASS exact certificate; internal elapsed 6.2403784590133 seconds.
   Conservative charged duration 6.25 seconds. Hard mathematical cap25seconds.
3. `python3 -B .../point_control.py --x 491/1860 491/1860 401/1860 3/62 0 0
   --out .../BUILDER_NEAR_TOUCH_CONTROL.json`: PASS both immutable exact area
   routines. Hand-chosen point, not navigation: p=(491,491,401,90,0,0)/310,
   S=18/31, bottom gap1/310, connected positive-overlap graph, endpoint
   degrees5. F=814013/3459600 and D=70013/288300>0. Neither an auxiliary
   countercertificate nor a root improvement. Internal elapsed
   0.002184416021918878 seconds; conservative charged duration0.01seconds.
4. `python3 -B .../atom_dual.py --signed-a --out
   .../BUILDER_SIGNED_A_DUAL_PILOT.json`: PASS47atoms,28splitvariables,
   92pivots; exact optimum still70/61. Matching upper multipliers now enforce
   all six individual triangle moments exactly. Internal elapsed
   0.1559697919874452seconds; conservative charge0.2seconds; hardcap5seconds.
   No signed-a height expansion or other signatures were run.
5. `python3 -B .../atom_dual.py --signed-a --group-bound --out
   .../BUILDER_GROUP_MASS_DUAL_PILOT.json`: PASS47atoms,29splitvariables,
   81pivots. Adds newly proved G_L+G_R>=2-S/2>=53/31 as a pointwise
   atom coefficient counting the group's union memberships. Exact optimum
   still70/61, with matching upper multipliers. Internal elapsed
   0.13221675000386313seconds; conservative charge0.2seconds; hardcap5seconds.
   No expansion to42signatures was run.

Builder mathematical charge so far: 6.86/75 seconds. No failures, compiles,
installs, random/nav/search/cellwalk, app/API/UI/DB/Git/build operations.
Source writes used apply_patch. Old artifacts and source were not changed.

## Remaining branch-independent functional and exact obstruction

For h=1/2, write slice hulls K_L(y),K_R(y). A universally valid upper bound
on cross-group intersection is

    O <= integral_0^h |K_L(y) intersect K_R(y)|dy
          +sum_crosspairs integral_h^1 |I_i(y) intersect I_j(y)|dy.

Combining this with the hull-minus-adjacent-gap lower bounds gives an explicit
lower functional for the whole union. Unlike independent pair-band caps it
retains the single common inter-group displacement q and every constituent
offset. At the zero-span consecutive3+3 anchor it is EXACT: each group is
connected below1/2 and internally disjoint above1/2. Its value is107/72.
Thus it does not lose the anchor as plain full-height hull intersection does.

The missing step is to prove a sufficiently strong lower inequality for this
coupled functional throughout all internal-offset ranges and all applicable
group label signatures. Above1/2 the pair sum can overcount high-height triple
intersections; below1/2 potential gap wedges can be covered by longer-label
bridges. Neither an unproved fixed-envelope calibration nor separate group
and pair maxima justify such an inequality. No new continuous geometry cover,
unqualified branch enumeration, or additional weak LP iteration was launched.

For consecutive2+4 zero spans, another *tangent-only* candidate is
G>=123/80-2S/5. The zero-span optimum q=11/10 has exact area gradient
L56=(-3/20,3/20), R1234=(-1/4,-1/40,-1/8,2/5); worst box loss is
3a/20+2b/5<=2S/5. If a universal support proof existed it would yield
D>=43/40-9S/5>=37/1240. No such support proof is claimed here.

Finally k<=5 is essential to the proper-group lemma. The normalized
six-point path (1,0,1,0,1,0) has E=5,B_tilde=1,Delta=-1 and fails the
required path inequality. For sufficiently small actual span s<1/3,
actual start order is natural wherever gaps open, and its one-group area
is 7/4-s/2-s^2/4. The k6 weakline would be false. This is not an auxiliary
countercertificate because that construction has one bottom component.
