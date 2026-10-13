# Conditional equation multiples — exact support obstruction

Status: decisive hand obstruction, FULL critic reviewed with the essential
adjacent-generator correction applied and explicitly preserved in section 5.
Same TIP116 PUBLIC_DISCOVERY, all-real finite K6 G>=40/31 remains OPEN.
Activation 2026-10-12 23:45:48 UTC; hard stop 2026-10-13 00:15:48 UTC.
No mathematical subprocess, SDP, code, sampling or degree expansion.

## 1. Precisely the authorized class

Keep the exact 578-variable boundary graph and all free-SOS/inequality
supports from section 10 of BUILDER_SPARSE_SOS_20261012.md. In particular
each clipping generator's SOS multiplier has degree at most two, so its
rows are AFFINE in the five A, five parallel sign flags b, and its OWN tau.
No other coverage wire or second clip variable enters those rows. The four
generators are tau, 1-tau, g+=(c-tau)*tau, g-=(tau-c)*(1-tau).
All forty raw forms c are (A_j-A_i)/k with k>0.

Equality multiples may now be chosen with total degree at most four:
quadratic equations times arbitrary quadratic multipliers and linear
equations times cubic multipliers, with any selected support. No dense
expansion is performed. The proof below actually rejects ANY choices of
these equality multipliers, since they vanish pointwise on the diagnostic.

All remaining SOS/inequality summands retain their previous supports and
total degree ceiling. There is NO added product involving a quadratic clip
generator and another generator, and no new inequality. The conclusion is
not about grammars relaxing these restrictions.

## 2. Actual-graph boundedness forces nonadjacent multiplier normal forms

Suppose an identity P=G_lifted-40/31 exists in this class. On any TRUE full
geometric graph all equality terms vanish and all other summands are
nonnegative. Since actual union area is at most 3, every nonnegative
summand is bounded above by P<=53/31. This uses the proposed identity only
as a necessary condition; no K6 theorem is assumed.

Put Delta_j=A_(j+1)-A_j. With A6=0 the five Delta are independent linear
coordinates. A sign vector b in {0,1}^5 can be realized by the open cone
Delta_j>0 when b_j=1 and Delta_j<0 when b_j=0. Those strict sign cones
are enough for the following recession argument; no singular-face transfer
is needed.

Fix a NONADJACENT form c=(Delta_i+...+Delta_(j-1))/k with j-i>=2.
A multiplier row is

    r=u dot A + beta dot b + gamma*tau + d.

On a ray A=R*a with c(a)<0, actual tau=0 and g-=-R*c(a) grows linearly.
If u dot a is nonzero, g-*r^2 grows cubically, contradicting boundedness.
For any sign cone admitting c<0, this forces u to vanish on an open set,
hence u=0. The remaining constant beta dot b+d must vanish on every sign
pattern admitting c<0.

Such a negative ray exists for EVERY Boolean pattern except those with all
flags of i,...,j-1 equal to one: a negative Delta in that interval can be
made larger in magnitude than the positive ones. In particular the zero
vertex and EVERY unit vertex admit a negative ray because the interval has
at least two indices. Vanishing on zero and all unit vertices gives d=0
and beta=0. Consequently every g- row equals gamma*tau and

    sigma_- = kappa_-*tau^2, kappa_->=0.

For g+, take rays with c(a)>0, actual tau=1 and g+=R*c(a)-1. The same
argument gives u=0 and beta dot b+gamma+d=0 on all patterns except those
with every interval flag zero. The all-one vertex and each all-one-minus-
unit vertex admit a positive ray (again the interval has at least two
indices). Their differences force beta=0 and gamma+d=0. Thus

    sigma_+ = kappa_+*(1-tau)^2, kappa_+>=0.

Both weighted quadratic-clip terms therefore vanish when this nonadjacent
tau is EITHER zero OR one. The result survives arbitrary equation multiples:
the tail argument used their vanishing on the true graph, not coefficient
comparison in free flags.

For adjacent clips, the exceptional sign patterns are larger: possible
rows include beta*b_i+gamma*tau for g- and beta*(b_i-1)+gamma*(tau-1) for
g+. They need not collapse. The diagnostic below deliberately uses ACTUAL
adjacent clips, so their quadratic generators are nonnegative. They need
not vanish, and their nonnegative SOS-weighted terms are sufficient below.

## 3. A single exact partially clipped diagnostic

Assign A6=0 and

    A=(-10,-8,-6,-4,-2,0), all five b=1.

All adjacent Delta=2. Set their ten raw clipping variables to actual clip
values: clip(Delta)=clip(Delta/2)=1. For EVERY nonadjacent form set tau=0,
with ONE exception:

    tau for (A6-A1)/(6-1-1) = (A6-A1)/4 is set to 1.

Assign every paired-sort and union-max wire its actual routing/min/max value
for the resulting formal height intervals. All equations, including Boolean,
sign routing, upper-root and max-root equations, vanish POINTWISE.

For adjacent pairs their coverage intervals are [1,1], which have zero
measure. For other nonadjacent pairs both height endpoints are zero, hence
[0,0], except pair 1/6. Its three clips, denominators 6,5,4, are 0,0,1.
It gives [0,0] coverage on R1 and L6, and FULL [0,1] coverage on L1 and R6.
Thus every interval supplied to union sorting has valid ordered endpoints.
There is no fake comparator routing or omitted degeneracy.

The exact boundary objective is

    G_lifted = 3 - integral_0^1 R6(t) dt + integral_0^1 L1(t) dt
             = 3 - integral(-5t) dt + integral(-10-t) dt
             = -5.

Hence P=-5-40/31=-195/31<0. This slope calculation uses L1=A1-t and
R6=A6-5t; the two slopes differ by FOUR, not five.

Every ordinary linear inequality and its listed pair product is nonnegative
pointwise, as are the flag bounds/signs (Delta=2,b=1) and all free SOS.
Every clip linear bound is 0 or 1. Adjacent g+ and g- are nonnegative because
their clips are actual values (for c=2,tau=1, g+=1, not zero). Thus their
SOS-weighted terms are nonnegative. For each nonadjacent clip, section 2 makes
its weighted g+ and g- terms zero at the assigned binary tau. Thus ALL
remaining right-hand terms are nonnegative, while every equation term is
zero regardless of its multiplier. This contradicts P<0.

The diagnostic is NOT an actual clipped geometric placement: most
nonadjacent raw times are positive but their tau are artificially zero.
It is a polynomial-certificate contradiction, NOT a K6 counterexample.

## 4. Exact feasibility outcome

No real-coefficient identity in the preserved free-SOS/inequality supports
can certify P>=0, even after arbitrary selected equation multiples of
total degree at most four. Indeed the same argument is indifferent to the
degrees/supports of equality multiples alone. Therefore no choice of ONLY
authorized equation multiples rescues this grammar, and no SDP is justified
for it. No particular equation-multiplier inventory needs allocation.

This does NOT exclude adding coupled clip multiplier wires, clip-generator
products, new inequalities, different SOS degrees/supports or a different
representation. None is adopted or explored here. The exact 578-variable
geometric model remains valid. K6 remains OPEN with zero new root closure.

Only this one new note is written; predecessor proofs/templates/scripts are
frozen. Mathematical processes/SDP/code/numerics 0; installs/agents/infra/
UI/API/DB/Git/build/copies/deletion 0. Nothing removed. Vibecode Kit is used
only for the existing minimal scope/report/independent-review workflow.

## 5. Completion and preserved correction

Builder new mathematical derivation STOP was observed at 2026-10-12
23:49:22 UTC, before the unchanged 2026-10-13 00:15:48 UTC hard stop.
Only literal review and correction recording follow.

Independent critic FULL read of sections 1–4 was observed at 23:49:16 UTC.
The critic checked sign-cone normal forms, all coverage bands and G=-5,
accepting the contradiction with one essential wording correction: the
initial draft incorrectly said actual adjacent clips make both quadratic
generators zero. In fact c=2,tau=1 makes g+=1. The corrected proof uses
only their NONNEGATIVITY; the nonadjacent weighted terms still vanish.
The false zero assertion is explicitly withdrawn, not silently retained.

Builder FULL literal read of `CONDITIONAL_D4_COMPLETION_20261013.md`
completed at observed 23:50:12 UTC: ACCEPT, no blocking mathematical
error. Its preserved-support theorem, exact coverage-band assignment,
G=-5 calculation and scientific limits match the corrected argument here.
Main's separate new-derivation STOP is reported as 23:48:53 UTC; the
team's stop times are not conflated.

Disposition: equality-multiplier-only rescue REJECTED for the unchanged
clip SOS/inequality supports. No K6 lower bound or whole-minimum class is
proved; global root remains OPEN. No selected multiplier expansion,
allocation, solver or further mathematical route is performed.
