# TIP109 — Exact holes on the natural apex chain; general relaxation

This is an auxiliary all-offset identity/inequality, NOT a global K6 lower
bound. The committed root remains F6>=20/93 on ALL real offsets. Mathematical
subprocesses used for this note: ZERO. Main hand derivation, 2026-10-11.

## Coordinates and the actual convex hull

Use top height t=1-y and scaled horizontal coordinates. Triangle j has interval

    I_j(t)=[L_j(t),R_j(t)]=[A_j-j*t,A_j-(j-1)*t], 0<=t<=1.

Every interval has width t. Put U(t)=union_j I_j(t), v_j=L_j, and
H(t)=[min_j v_j,max_j v_j+t]. Thus the area of the actual horizontal hull is

    H = integral_0^1 (t+max_j v_j-min_j v_j) dt.

This uses both envelopes, NOT an assumed order of the moving intervals. With
D_i=A_(i+1)-A_i, p_j=A_j-j, the exact algebraic identity is

    H=sum_i D_i-2+B_L+B_R,
    B_L=integral_0^1 max(0,max_j[p1-p_j-(j-1)*y]) dy,
    B_R=integral_0^1 max(0,max_j[p_j-p6-(6-j)*y]) dy.

Indeed hullwidth=t+v6-v1+max_j(v_j-v6)+max_j(v1-v_j).
Integral(t+v6-v1)=A6-A1-2. Neither envelope correction may be dropped,
especially when this signed baseline becomes negative near t=1.

## Universal fixed-label-chain hole relaxation

For every real D_i, define the two OPEN facing gaps

    W_i^+(t)=(R_i,L_(i+1)) if R_i<L_(i+1), otherwise empty;
    W_i^-(t)=(R_(i+1),L_i) if R_(i+1)<L_i, otherwise empty.

Their widths are respectively (D_i-2t)_+ and (-D_i)_+. They cannot both
be nonempty at the same t. Let W_i=W_i^+ union W_i^-.

Any z in H(t) but outside U(t) lies strictly to the left or right of every
closed interval, and there is at least one interval on EACH side of z.
As labels1,...,6 are read, at least one adjacent pair changes side. That
transition puts z in its corresponding W_i. Consequently

    H(t)\U(t) subset union_i (W_i(t)\U(t)),
    |U(t)| >= |H(t)|-sum_i |W_i(t)\U(t)|,
    G >= H-sum_i integral_0^1 |W_i(t)\U(t)| dt.             (GEN)

Any explicit subset of U intersected with W_i can replace U in the subtracted
uncovered term, yielding a weaker but VALID lower bound. This keeps clipping
and multiplicity. Overlapping potential gaps do not justify adding their
covered pieces without subtracting each gap's full width first.

## Exact identity for strict natural apex order

Assume D_i>0 for ALL i. Then W_i^- is empty. A right-to-left side transition
in the preceding side sequence is impossible: it would require L_i>z>R_(i+1),
whereas R_(i+1)-L_i=D_i>0. Therefore the side sequence for each actual hole is
exactly LEFT,...,LEFT,RIGHT,...,RIGHT, with ONE transition. It follows that

    H(t)\U(t) = disjoint union_i (W_i^+(t)\U(t)),
    G = H-sum_i integral_0^1 |W_i^+(t)\U(t)| dt.          (NAT)

Potential wedges themselves need not be disjoint; their UNCOVERED pieces are.
Endpoints and t=0 have zero horizontal/integrated measure. The proof is valid
on closed limits D_i>=0 as well (a reverse transition would still contradict
L_i<=R_(i+1)); the separate predecessor excludes adjacent-apex equality at
a global minimum. No bottom order, common base overlap or reflection used.

### Exact cut envelopes and monotone component merging

The actual uncovered gap indexed by cut i is precisely

    J_i(t)=(max_{a<=i}R_a(t), min_{b>i}L_b(t)), if the left end is smaller,
    q_i(t)=[min_{a<=i<b}(A_b-A_a-(b-a+1)*t)]_+.

For the forward inclusion, a point in W_i outside U has all labels<=i on its
LEFT and all labels>i on its RIGHT, by the unique side transition. It therefore
lies between these two envelopes. Conversely every point strictly between
these envelopes is outside ALL intervals and lies in W_i. Thus NAT becomes

    G=H-sum_{i=1}^5 integral_0^1 q_i(t)dt.                  (CUT)

For strict natural apices all cross differences A_b-A_a are positive and
all cut-line slopes -(b-a+1) are at most-2. Consequently each q_i decreases
until it becomes zero, at exactly

    tau_i=min_{a<=i<b}(A_b-A_a)/(b-a+1)>0.

It cannot reappear at a greater t. At t<tau_i the two label sides are separated
by a positive gap; at t>=tau_i they cannot be separated in the closed union.
Every connected component consists of consecutive labels: if a component
contained labels a<c but omitted b between them, the omitted interval lies in
another component to one side. A separating point between the two components
would then produce either LEFT,RIGHT,LEFT or RIGHT,LEFT,RIGHT in the label
sequence, contradicting its single forward transition. This holds for closed
components and handles isolated touching heights by limits.

Hence the component partition MERGES monotonically as top-height t grows;
it never splits. This conclusion requires the WHOLE contiguous natural label
chain, but does NOT require any common bottom overlap clique. With a single
closed component at t=1, every tau_i<=1. Therefore the area removed by cut i
can alternatively be integrated on[0,infinity): q_i already vanishes by1.
Simultaneous cut closures and envelope switches require no tie-breaking.

This extends the predecessor's internally-clique laminar observation to the
entire naturally ordered six-label chain. It still says nothing about the
12 inverted-apex continua and supplies no sharp global energy calibration.

## Nearest-neighbor restoration on NAT

At wedge i let g=(D_i-2t)_+. Triangle i-1, if present, covers an attached LEFT
portion of width min(g,(t-D_(i-1))_+); triangle i+2, if present, covers an
attached RIGHT portion min(g,(t-D_(i+1))_+). To check the latter, its left
edge is D_(i+1)-t to the right of L_(i+1), and its right edge is
D_(i+1)>0 to the right of L_(i+1). The left formula follows identically.

Thus, with absent neighbors contributing zero fill, their UNION inside the
wedge has width min(g,(t-D_(i-1))_++(t-D_(i+1))_+). In particular

    |W_i^+\U| <= [D_i-2t-(t-D_(i-1))_+-(t-D_(i+1))_+]_+.

An absent term is omitted, not assigned D=0. This yields a common, explicitly
clipped hull-minus-residual-gap functional for the WHOLE natural-order domain.
It has NOT been calibrated to40/31 globally.

## Withdrawn extension — sorted apex words do not suffice

Main initially proposed extending NAT to all13 disjoint-adjacent-swap apex
orders merely because their successive label jumps r are >=-1. WITHDRAWN:
for consecutive sorted-apex labels a,b, D=A_b-A_a>0 and r=b-a,

    R_b-L_a=D-(r-1)*t.

For r=2 or3 this can be negative. Such a sorted chain can have reverse gaps
near the bottom even though its apices are strictly increasing. Hence the
unique-hole argument needs D>=(r-1)*t, not just r>=-1. Main caught the sign
error and Builder independently supplied this exact hand counter to the premise:

    p=(3/2,0,3/2,0,3/4,3/4),
    apex order=(2,1,4,3,5,6), range(p)=3/2<49/31.

The bottom intervals are connected via the3/4 offsets. At the sorted-chain
edge1->4, D=3/2,r=3, R4-L1=-1/2 at t=1. This refutes the claimed wall order,
not necessarily NAT's conclusion after other coverage, and NOT the global
target. The universal fixed-label GEN remains valid for every one of the13
continua. No sample or chart inventory has been promoted to coverage.

## Scientific status

GEN supplies a valid common lower-bound framework for ALL13 necessary order
domains; NAT is a sharper exact structural identity for the natural-order
continuum. Nearest-neighbor restoration is valid throughout NAT, including
moving-order switches and touching boundaries. These are preliminary lemmas.
The exact envelope/residual functional still needs a whole-domain40/31
calibration OR a complete necessary-stationary exclusion/value theorem.
Without that step, R1 and the global C_T(6) root remain OPEN.
