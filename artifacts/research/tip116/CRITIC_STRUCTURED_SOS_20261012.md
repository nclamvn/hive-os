# Structured global K6 SOS — independent critic

Status: PARTIAL; exact support-localized representation and a SOUND restricted
certificate grammar reviewed, but no target identity or K6 lower bound.
Owner continuation14:01:17UTC / original hardstop14:18:12UTC on2026-10-12.
No reset of the one-search/resource ceiling. Prior feasibility and R9 files
are frozen. Only this new critic note is writable.

The new scope, latest active/handoff, FULL local Vibecode skill and TIP/report
reference were read. The skill influences scoped review/reporting only.
The exact committed target remains all-real G6>=40/31, not a natural-order
or actual-minimum subfamily. No false geometry-only(P) is imported.

## 1. Expanded graph retains the whole domain

Builder replaces expanded comparator-max expressions by explicit maximum
wires and introduces five left-endpoint wires at each of41 heights.
The preceding exact circuit has1130 variables. Add388 time maxima,
492 spatial maxima and205 endpoint initializers, giving2215 variables.
There are1085 unchanged quadratic equations and1085 new linear equations
(880 maximum links plus205 initializers). Inequalities remain2250 linear
and80 quadratic. A6=0 fixes translation; all other apices are unrestricted.

The max link is m+M-a-b=0 together with the exact min graph. Initializers
are B_j=A_j-j*tau, j1..5; B6=-6tau uses no new wire. Every gate has support
at most4; clip/initializer supports at most3. The added variables uniquely
give their actual affine values on the feasible graph. Thus arbitrary apex
orders, disconnected states, unbounded positions and every contact face
remain represented exactly. Local wire constraints are not being replaced
by unrelated local geometries.

The trapezoid width contribution telescopes identically to1/2. Consequently

    P=-49/62
      +.5 sum_(k=1..40,i=1..5) m_ki*(tau_(k+1)-tau_(k-1))
      +.5 sum_(i=1..5) m_41i*(1-tau40).

Every displayed term has support at most3 and degree2. This is the EXACT
target polynomial, not a proof that the weighted cap sum pays49/62.

## 2. Sound local grammar, not a sparse-equivalence theorem

Use one free degree4 SOS block on each of880 comparator-parent4-cliques,
205 cap-parent4-cliques,40 clip3-cliques,205 initializer3-cliques and205
objective supports of size at most3. Total1535 list entries. Duplicated
or contained free subclique blocks can be embedded in and added to the
parent PSD block; this aggregation is valid. It is not a theorem that
every dense certificate has those local supports.

For each inequality, permit a degree2 SOS multiplier on its corresponding
parent clique. Permit degree3 polynomial multipliers for linear equations
and degree2 polynomial multipliers for quadratic equations. A candidate

    P=sum_C SOS_C +sum_g g*SOS_Cg +sum_h h*polynomial_Ch

with exact matching coefficients and exact PSD verification would be a
GLOBAL proof: all g are nonnegative and all h vanish on every feasible
full graph. Running-intersection/chordal convergence is unnecessary for
this SUFFICIENT implication. Neither existence of such coefficients nor
completeness of this restricted grammar follows from its small blocks.

## 3. Actual count ceilings, including matching and storage

FULL Builder structured note was read at observed14:09:42UTC. Its safe
parent-clique ceilings check independently:

    free SOS parameters:450*55+1085*120=154950;
    inequality Gram parameters:2170*15+160*10=34150;
    linear equation coefficients:880*35+205*20=34900;
    quadratic equation coefficients:1085*15=16275;
    TOTAL unknown ceiling:240275.

The450 smaller free blocks include some true2-variable objective supports,
so this is a conservative ceiling, not an exact minimal parameter count.
Raw Gram storage totals2,767,480 double bytes. This does NOT measure solver
canonicalization, fill-in, iterations or recovery.

All products and objective terms remain supported in one of the listed
parent cliques. Hence distinct matching rows are at most
450*35+1085*70=91700. The317186 contribution-slot count before merging
is not the distinct equation count. The coefficient incidence ceiling
154950+3*34150+4*34900+6*16275+411=495061 also checks.

A dense91700-by240275 coefficient array needs roughly176GB, so a dense
matching model is excluded by the1GiB envelope. Raw sparse triplets are
about11.9MB at that incidence ceiling, but total sparse solver memory and
120-second success are UNQUALIFIED. No solver exists in the previously
inspected Python environments; this does not assert absence everywhere.
No SDP was released, and no new structured subprocess was executed.

## 4. Prior moment obstruction: what persists and what does not

The earlier exact two-atom assignments extend to the new max and initializer
wires by their affine values. Every new linear equation vanishes pointwise,
including when multiplied by an affine polynomial. Thus the minimal standard
degree2 module remains obstructed for this expanded graph.

Adding the valid40 products tau_e*(1-tau_e)>=0 defeats that PARTICULAR
construction whenever its raw coefficient q is nonzero: its expectation
is-4q^2. Such redundant strengthening does not alter the exact geometric
graph, but changes the relaxation; it is not a certificate by itself.

The proposed degree4 local grammar also defeats the old dual without those
new generators: take one ORIGINAL clip variable tau_e whose raw diagnostic
coefficient isq1, so tau_e=X. Its existing linear generator g=tau_e and
allowed local SOS multiplier(1-tau_e)^2 give expectation-8. This refers to
an original clip generator, not an implicitly positive sorted output.
Therefore the old functional is not positive on the degree4 grammar.
Removing one obstruction does not establish certificate existence.

## 5. Alternative exact all-order gap grammar, not a qualified certificate

I also checked a direct all-subset identity. For every nonempty proper
label subset S (62 total), put

    q_S(t)=[min_(j notin S)L_j(t)-max_(i in S)R_i(t)]_+
          =[min_(i in S,j notin S)(Aj-Ai-(j-i+1)t)]_+.

Whenever this is positive, it is precisely an actual spatial hole with
left-label set S. Conversely each actual hole has one unique such set.
Hence, on every real placement and contact face,

    ell(t)=max_j R_j(t)-min_j L_j(t)-sum_(62 S)q_S(t).

Each min has at most9 affine lines and its positive support is an interval,
but slopes can be negative, zero or positive. The natural one-sided
projection/waterfill formula cannot simply be imported. I derived no compact
exact integrated-QP encoding or sharp local SOS payment from this grammar;
its certificate size and usefulness are therefore not qualified. This
alternative is recorded as an attempted representation, not root progress.

## 6. Honest outcome and resource boundary

No exact coefficients solving the structured identity, PSD certificate,
global lower bound or whole inversion exclusion was obtained. Root K6
remains OPEN. The smaller explicit block grammar is a scoped feasibility
observation, not a small guaranteed computation or whole-proof milestone.

Critic used hand derivation and ordinary source/clock reads only. No new
calculation script, optimizer/SDP process, installation, random samples,
chamber enumeration, UI/API/DB/Git mutation, new infrastructure/agent,
scratch copy or deletion. Frozen predecessor bytes remained untouched.
Actual stop/final literal-review records will be appended below.

## 7. Completion and literal-review record

Critic NEW DERIVATION STOP was observed at14:11:21UTC on2026-10-12.
This is early finalization after obtaining no certificate and leaving total
execution unqualified; it is NOT hard-cap exhaustion or proof that the
structured degree4 grammar is impossible.

FULL Builder note review was observed at14:09:42UTC. Final corrected
addendum/header/stop review was observed at14:13:10UTC. The original-clip
tau_e notation correction is accepted. Builder's distinct stop14:09:48UTC
is preserved; no synchronized team stop is invented.

Own structured mathematical subprocesses0, SDP searches0, solver seconds0,
failed mathematical starts0. No scratch or generated build files required
cleanup. Root closure evidence0: all-real G6>=40/31 is unproved, all required
faces remain in the exact model, and no conditional domain is called K6.

At this checkpoint, no final Main structured completion has been routed for
literal review. This record does not claim review of an absent final report.
Any subsequent literal-only disposition must use its actual observed time
and stay within the unchanged14:18:12UTC hard stop.

Final critic recording check observed14:17:13UTC. No Main structured final
file had appeared in the inspected note/report paths and none was routed.
Final Main review remains UNPERFORMED, not inferred from Builder acceptance.
Critic outcome is FINAL PARTIAL / root OPEN; no further derivation or process
is authorized by this completion. The original hard stop is unchanged.
