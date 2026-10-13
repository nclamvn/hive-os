# Smaller global K6 SOS — boundary model and restricted-class obstruction

Status: full-domain exact 578-variable model and analytical feasibility challenge;
NO K6 certificate. Same PUBLIC_DISCOVERY, all-real `G6>=40/31`.
Activation 2026-10-12 16:36:53 UTC; hard stop 17:06:53 UTC.
All predecessor proofs, scripts and reports remain frozen.

## 1. Boundary integration avoids sorting forty height events

Set A6=0. Let L_j(t)=A_j-j*t and R_j(t)=A_j-(j-1)*t. For each of the twelve
endpoint rays, let C0 be the length in height of its coverage by the other
five CLOSED intervals, and C1 the first height moment of that coverage.
Then the exact union area is

    G = 3 - sum_j [A_j*C0(R_j)-(j-1)*C1(R_j)]
          + sum_j [A_j*C0(L_j)-j*C1(L_j)].

At a generic height the exposed right minus exposed left endpoints give the
union length. Nonparallel endpoint coincidences occur at finitely many heights
and do not affect the integral. The only persistent coincidences between
different source endpoints are R_(j+1)=L_j when A_(j+1)=A_j. Their coefficients
and coordinates agree with opposite signs, so removing BOTH covered endpoints
is valid. The parallel tie treatment below also permits retaining both.
Thus the formula holds for all real placements, not just strict arrangements.

## 2. The sixty coverage intervals use forty shared clipped crossings

For a ray x=A_j-s*t and another source k, put d=A_j-A_k and m=s-k.
Its closed membership inequalities are

    d-m*t>=0, (m+1)*t-d>=0, 0<=t<=1.

For m>=1 its height interval is

    [clip(d/(m+1)), clip(d/m)].

For m<=-2 put n=-m-1>=1; the interval is

    [clip((-d)/(n+1)), clip((-d)/n)].

Both are exact: with the wrong numerator sign both endpoints clip to zero;
with the correct sign the lower endpoint is no larger than the upper one.
Endpoints outside [0,1] are handled by the same clipping. These fifty
nonparallel membership intervals use the preceding forty distinct crossing
forms `(Aj-Ai)/d`, `/(d+1)`, and `/(d-1)` when d>1. No new crossing variables
are needed. A zero-length interval has zero measure and moment.

For each adjacent pair define Delta_j=A_(j+1)-A_j and ONE shared Boolean b_j:

    b_j*(1-b_j)=0,
    b_j>=0, 1-b_j>=0,
    b_j*Delta_j>=0, -(1-b_j)*Delta_j>=0.

The two parallel membership cases (ray L_j in source j+1, ray R_(j+1) in
source j) use the SAME interval `[clip(Delta_j), b_j]`. If Delta>0, b=1;
if Delta<0, b=0 and the clipped lower endpoint is zero. At Delta=0 the
lower endpoint is zero and b may be 0 or 1. In the latter face the two
rays coincide; coverage by the other four sources is identical. Choosing
either shared b removes or retains their two equal signed contributions
together, so the total area is invariant. It is not legitimate to choose
two independent flags there. There are ten parallel coverage occurrences
but only five flags. No hidden product-defined lower endpoint is used.

Each original clipping variable tau=clip(c) has the same exact graph

    tau>=0, 1-tau>=0,
    (c-tau)*tau>=0, (tau-c)*(1-tau)>=0.

## 3. Sort five interval PAIRS, preserving upper-endpoint routing

For each ray sort its five pairs (lower,upper) by lower endpoint. The nine
comparators on zero-based wires are

    (0,3),(1,4),(0,2),(1,3),(0,1),(2,4),(1,2),(3,4),(2,3).

The one approved tiny script checks all 32 zero-one words. By the zero-one
sorting-network principle this fixed network sorts arbitrary real lower
endpoints; this is NOT a K6 sample or geometric-chamber enumeration.

A paired comparator takes (a,alpha),(b,beta), and has four explicit output
variables (u,p),(v,q), subject to

    u+v=a+b, (u-a)*(u-b)=0, a-u>=0, b-u>=0,
    p+q=alpha+beta, (p-alpha)*(p-beta)=0,
    (a-u)*(p-beta)=0, (b-u)*(p-alpha)=0.

If a<b, u=a and the last equation forces p=alpha; if b<a the other
equation forces p=beta. If a=b the upper root equation makes p one of
alpha,beta and q the other. Either order is valid for tied lowers.
Omitting that upper root would introduce spurious upper endpoints on ties.
Thus each comparator has two linear equations, four quadratic equations,
and two linear inequalities. Every constraint support has at most four
wire variables. The whole paired gate has eight variables, but that is
not the support size of each individual constraint.

## 4. Exact union measure/moment with eight maxima per ray

Let the sorted intervals be (l_i,h_i). Set H1=h1, S1=l1. For i=2,...,5 use

    H_i=max(H_(i-1),h_i), S_i=max(H_(i-1),l_i).

Each max is one variable with `(r-a)*(r-b)=0`, `r-a>=0`, `r-b>=0`.
There are eight such max variables per ray. Since each h_i>=l_i, the
newly covered increment is exactly [S_i,H_i], possibly zero length. Hence

    C0=sum_(i=1)^5 (H_i-S_i),
    C1=(1/2)*sum_(i=1)^5 (H_i^2-S_i^2).

These formulas hold for disjoint, nested and tied intervals alike. C0 is
linear and C1 quadratic in the wires. The boundary objective in section 1
is therefore QUADRATIC, not cubic; no A_j multiplies C1.

Every feasible graph assignment gives actual coverage unions, up to the
irrelevant tied-pair order and the exactly cancelling shared parallel flags.
Thus `P=G-40/31>=0` on this graph is equivalent to the all-real K6 target.

## 5. Exact specified counts, not a five-variable SDP claim

Variables: 5 A + 40 clips + 5 flags + 12*9*4 paired-sort outputs + 12*8
max outputs = 578.

- Linear equations: 12*9*2=216.
- Quadratic equations: 5 flags + 12*9*4 + 12*8 = 533.
- Linear inequalities: 80 clip bounds + 10 flag bounds + 12*9*2 + 12*8*2
  = 498.
- Quadratic inequalities: 80 clip margins + 10 flag sign margins = 90.
- Objective/constraint degrees: at most 2.

There are no separate C0/C1/area variables. All endpoints are shared clip
variables or flags, and maxima/paired-sort outputs are explicit wires.
Attaching the same five A variables to every individual constraint support
gives blocks of at most nine variables (degree4 free Gram order at most 55).
This is a sound sufficient certificate design if an EXACT polynomial identity
is found; it does not imply a running-intersection property, completeness,
small solver fill, or existence of such an identity. Individual answers from
independently optimized blocks cannot be combined into a global proof.

## 6. Strong degree-two preordering failure survives ordinary bound products

Use Z=1 with weight 3/4 and Z=-3 with weight 1/4. Put A_j=(j-6)*Z,
so every raw crossing is c=alpha*Z with a fixed positive rational alpha,
and E[Z]=0. Assign all forty clip variables zero. Choose b_j=1 at Z=1,
b_j=0 at Z=-3, and evaluate ALL paired-sort and union-max gates using their
actual min/max branches on these assigned interval values.

All fifty nonparallel intervals are [0,0]. Each parallel interval is [0,b].
At Z=1 all five parallel pairs are fully covered, giving the lifted formula

    G_lifted=3-sum_(j=1)^5 Delta_j = -2.

At Z=-3 none is covered and G_lifted=3. Therefore

    E[G_lifted]=-3/4, E[P]=-253/124<0.

Every equality vanishes pointwise. Every NON-clip-quadratic inequality is
nonnegative pointwise, including flag signs and any products of their linear
bounds. The clip quadratic margins are zero and -c, with expectation zero.
Consequently a degree2 truncated preordering with the listed generators,
including products of linear generators and products such as tau*(1-tau),
cannot certify P. Its constant quadratic-generator multipliers also have
nonnegative expectation. This is not a feasible K6 configuration or a K6
counterexample: the clipped values deliberately violate actual clipping
pointwise. Arbitrary additional quadratic generators are not ruled out.

## 7. Why clip-only degree-four multipliers still cannot suffice

Consider a certificate class in which each NEGATIVE-tail clip margin
g_minus=(tau-c)*(1-tau) has an SOS degree2 multiplier in only the five
shared A variables and its OWN tau. Free SOS elsewhere is permitted, and every
remaining SUMMAND has total degree at most four; products containing a
clip-quadratic generator and another generator are excluded from this class.

On every true feasible graph, a certificate gives a sum of nonnegative terms
equal to P. Since every six-triangle union has area at most 3, each such
term is bounded above by 53/31. Write its multiplier as a sum of squared
affine forms r(A,tau). For A=R*v with c(v)<0 and R tending to infinity,
the actual clip is tau=0 and g_minus=-R*c(v)>0. Boundedness forces the
A-linear part of EVERY r to vanish on the open cone c(v)<0, hence to
vanish identically. It then forces the constant term r(A,0) to be zero.
Thus every such multiplier is a nonnegative constant times tau^2.

On the two-atom assignment in section 6, tau=0, so these weighted g_minus
terms vanish. The other clip margin g_plus=(c-tau)*tau also vanishes.
All other generators/products are nonnegative pointwise there, all equality
terms vanish pointwise, and all free SOS have nonnegative expectation.
The putative identity would imply E[P]>=0, contradicting -253/124.

This excludes that specified clip-local multiplier class, even with free
quartic SOS on gate blocks. It does NOT exclude clip multipliers containing
additional sign/branch wires, or products involving clip-quadratic generators.
The open cone is in the unrestricted five-real-apex domain; no compact-range
or stationary-minimum assumption is imported.

## 8. Concrete cross-wire escape, and the missing actual identity

For an adjacent crossing c=Delta_j (or a positive multiple), the SAME
parallel flag b_j tracks its sign. The local SOS multiplier b_j^2 has support
in (A_j,A_(j+1),tau_e,b_j), at most four variables. On the two atoms,

    E[g_minus*b_j^2] = -3*alpha/4 <0.

This escapes the obstruction in section 7: on the genuine negative tail,
b=0, so boundedness does not force b to be a polynomial multiple of tau.
Such clip/sign coupling is one explicit escape missing from the rejected
clip-only blocks. It is NOT itself a certificate or a proof of the target.

At the retained sharp placement A*=(-106,-81,-70,-36,-25,0)/31, the exact
boundary model has P=0. Any successful global nonnegative identity must make
every free SOS vanish there, and every weighted SOS with strictly positive
generator vanish there. Those rational evaluation null vectors may reduce
Gram parametrization, but no resulting global coefficients were found.
At tied lower endpoints there may be several exact lifts of the sharp
placement. Every nonnegative certificate term must vanish at EVERY such
lift, not only a generic or conveniently selected routing. The required
simultaneous coverage/cross-wire calibration remains OPEN.

## 9. Authorized tiny diagnostic and remaining scope

The single approved standard-library process ran
`sparse_sos_diagnostic_20261012.py`, exit zero, tool-reported wall
0.000009042 seconds, observed clock 16:45:03 UTC. It verifies the fixed
five-sort network on 32 binary words, forty rational clip-expectation
calculations, the two boundary-objective values/expectations and displayed
quartic leading coefficients. It is NOT a full graph replay, K6 sample,
chamber search, optimizer or SDP. The graph/obstruction proofs are hand-derived.
No second process is released. No packages installed or solver run.

This is a smaller exact global representation plus a specified certificate-
class rejection and explicit required coupling, not merely small-block counts.
Nevertheless no exact SOS identity or new K6 lower bound is obtained. K6 OPEN.
Only this new note and the one approved tiny diagnostic script are created;
no older file changed, no infrastructure/new agent/copy/deletion. Vibecode Kit
is used only for the existing review and truthful completion protocol.

## 10. Concrete mixed template retaining all shared apex/sign coupling

The following is the specified stronger candidate, not a solved identity:

- Forty clip parent blocks contain all five A, all five b flags, and their
  own tau: at most eleven variables. Each has a degree4 free SOS Gram of
  order 78, and four degree2 SOS multiplier Grams of order 12 for its two
  linear/two quadratic clipping inequalities.
- The 108 paired-sort blocks contain all five A and all eight paired-gate
  input/output wires: at most thirteen variables. Their free SOS is degree2,
  Gram order 14. Each of the two linear equalities has an arbitrary affine
  multiplier on that parent (14 coefficients); each of the four quadratic
  equalities has a constant multiplier. Its two linear inequality multipliers
  and their one pair-product coefficient are nonnegative constants.
- The 96 union-max blocks contain all five A and their three input/output
  wires: at most eight variables. Free degree2 SOS Gram order 9, one constant
  equality multiplier, two nonnegative inequality constants and one nonnegative
  pair-product constant.
- Five flag parent blocks contain all five A and their own flag: at most six
  variables. Free degree2 SOS Gram order 7, one constant Boolean-equation
  multiplier, and four nonnegative constants for the two bounds/two sign
  inequalities. No extra flag-product coefficient is counted.

The objective is covered by these supports: each increment expands into
individual terms A_j*H, A_j*S, H^2, S^2. Each wire is present in a paired-sort
or union-max block, and every such block already contains the SAME five A.
One global coefficient identity, not separate local inequalities, is required.
All polynomial terms have total degree at most four. Free SOS elsewhere is
degree2, but clip free/multiplier blocks include the sign flags, so section 7
does NOT rule out this template. Local coverage routing remains coupled through
the exact equations. There is no claim of completeness or convergence/RIP.

The explicit polynomial identity sought is P equal to the sum of those free
SOS terms, SOS-weighted clip generators, constant-weighted other generators
and specified pair products, plus equality-multiplier terms. Its exactness
and PSD/nonnegative coefficients would imply the ALL-real global bound.
No coefficient vector satisfying it has been obtained.

### Exact static ceilings for that specified template

The 409 PSD matrices have raw dense double storage

    8*(40*78^2 + 160*12^2 + 108*14^2 + 96*9^2 + 5*7^2)
      = 2364712 bytes.

There are also 632 nonnegative scalar coefficients and 3557 unrestricted
equality-multiplier coefficients. The scalar unknown ceiling is

    clip: 40*3081+160*78 = 135720,
    paired: 108*(105+2*14+4+2+1) = 15120,
    max: 96*(45+1+2+1) = 4704,
    flag: 5*(28+1+4) = 165,
    TOTAL = 155709.

Distinct coefficient rows are at most

    40*C(15,4)+108*C(15,2)+96*C(10,2)+5*C(8,2)=70400.

All multiplier products and objective monomials are inside these parent
supports, so no larger hidden global monomial catalogue is needed. This is
an upper count, not a statement that all those rows are independent.

The sparse operator has at most 192375 coefficient incidences before
aggregation: clip 160680; paired 26028; max 5472; flag 195. This uses the
actual 1/2/3/6-term clip generators, four-term paired linear/quadratic equations,
four-term max equations/products, and the two/four-term flag sign generators.
The target RHS is separate (at most 241 monomial occurrences).

Dense coefficient storage would take 87695308800 bytes, about 87.7 GB,
and is refused. Raw 64-bit sparse row/column/value triplets instead require
at most 4617000 bytes for that incidence ceiling. Neither raw triplets nor
small PSD blocks bound canonicalization/factorization/iteration memory or
120-second solving time. Total production and exact rational/PSD recovery
remain UNQUALIFIED; no SDP or additional process is released.

This sharper preflight identifies both a smaller exact graph and an actual
clip/sign coupling that survives the proved obstruction. It still does NOT
establish existence of the required identity, any global K6 floor, or an
inverted-class exclusion. The original global root remains OPEN.

## 11. Completion and actual timing

Builder new mathematical derivation STOP observed 16:53:15 UTC, before the
unchanged 17:06:53 hard stop. Early stop: exact smaller model and rejection
of the specified clip-independent multiplier class established, but the
coupled mixed template has no identity coefficients and total execution
feasibility is unqualified. Not cap exhaustion or rejection of all SOS routes.
Subsequent work is literal review/metadata only.

Main read the full sections 1–9 and the script; independent critic FULL
sections 1–9 review observed 16:51:01 accepted the exact model, moments,
constraint counts, dual, restricted no-go and shared-sign escape. Its one
degree-wording repair is incorporated. Final section 10 is separately routed
for literal grammar/count review; no identity certificate is routed.

New files: this note and the one approved tiny diagnostic script. Mathematical
processes in this continuation: ONE exact diagnostic, zero SDP/numerical search,
zero failed starts. No additional count/replay was run. No installs, UI/API/DB/
Git mutation, build, copied project, new infrastructure/agent, scratch/deletion;
nothing removed. Predecessor history and all earlier script/report bytes kept.
P1/P2/P3 are feasibility evidence only; root K6 remains OPEN with no new floor.

Builder FULL Main `SPARSE_SOS_COMPLETION_20261012.md` read at observed
16:54:07 UTC: no blocking factual/proof/count correction. The template ceiling,
restricted-obstruction limits and lack of execution/certificate qualification
are consistent. This is literal review after STOP, not new derivation.

Independent critic FULL section 10 verdict observed 16:53:53 UTC ACCEPTED
the exact specified mixed grammar and every static count within the stated
sufficient-IF-identity scope. It accepted no coefficient existence, sparse
completeness or execution qualification. Critic reported its own derivation
STOP 16:48:00 and final record 16:55:06; these are not synchronized with
Builder's separate STOP time.
