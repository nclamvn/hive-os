# Structured global K6 SOS — Builder feasibility design

Status: a sound small-block certificate grammar, NOT a target identity or proof.
Same all-real finite K6 `G6>=40/31`, PUBLIC_DISCOVERY. Owner continuation
observed 2026-10-12 14:01:17 UTC; unchanged hard stop 14:18:12 UTC.
No SDP search released, no new script, no installation or chamber enumeration.
The preceding exact model/minimal-degree2 obstruction remains frozen.

## 1. Localize the exact circuit, rather than silently splitting a dense Gram

Retain the exact forty clipped crossing forms, pruned 388-comparator time sort,
and twelve-comparator six-left-endpoint sort at forty-one heights from the
preceding Builder proof. It covers arbitrary real apices, every apex order,
all ties/parallel contacts, and disconnected configurations. Set A6=0.

Add an explicit maximum output M for every comparator, with

    m+M-a-b=0, (m-a)(m-b)=0, a-m>=0, b-m>=0.

Now later gates use explicit input wires, not expanded long affine expressions.
At each of the forty-one union heights introduce five endpoint variables

    B_j=A_j-j*tau, j=1,...,5.

For j=6 the expression B6=-6*tau contains one variable and needs no new wire.
At final height tau41=1 this is constant. Initializer equations have support
at most three variables. Comparator equations/inequalities have support at
most four variables, including when an input is -6*tau.

Each gap cap `m_ki=min(tau_k,s_(i+1)-s_i)` uses its ordinary scalar min graph.
Its support is contained in {tau_k,s_i,s_(i+1),m_ki}, at most four variables.
Each clipping graph has support {Ai,Aj,tau_e}, at most three variables.

These extra variables have unique values on the feasible set. The model is
therefore still EXACTLY the actual union objective, not a local-consistency
relaxation or a graph of arbitrary interval arrangements.

Exact model counts:

- Variables: original 1130 + 388 time maxima + 492 spatial maxima + 205
  endpoint initializers = 2215.
- Quadratic equations: 1085 (unchanged min equations).
- Linear equations: 880 maximum links + 205 initializers = 1085.
- Linear inequalities: 2250; quadratic inequalities: 80 (unchanged).
- All constraints have degree at most 2 and support size at most 4.

This INCREASES the lifted variable count. It reduces the size of individual
certificate blocks, not the original five-dimensional mathematical domain.

## 2. Target polynomial with three-variable objective supports

Write M_k=sum_(i=1)^5 m_ki, with M0=0. Exact union lengths are tau_k+M_k.
The pure tau contribution in the trapezoid integral telescopes to 1/2. Thus
the same exact target polynomial becomes

    P = -49/62
        + (1/2) sum_(k=1)^40 sum_(i=1)^5
            m_ki*(tau_(k+1)-tau_(k-1))
        + (1/2) sum_(i=1)^5 m_41i*(1-tau40),

where tau0=0 and tau41=1. Every displayed nonconstant summand involves at
most three variables. There are 205 such supports, with at most 411
coefficient occurrences including the constant, before cancellation.

This formula is EXACT. It is not yet a lower bound on the weighted caps.
The actual required identity must pay the negative constant 49/62 using
the same apices, event order and local wires. No independent minimization
of the summands is admissible.

## 3. A sufficient global structured SOS identity

Let C range over a LIST of cliques, not necessarily distinct: one for each
of 40 clip graphs, 388 time comparators, 205 initializer equations, 492 spatial
comparators, 205 cap gates, and 205 objective supports. There are 1535 entries,
each of size at most four. No chordal extension or region restriction is used.

One can seek an exact polynomial identity

    P = sum_C z2(x_C)^T Q_C z2(x_C)
        + sum_g g * z1(x_Cg)^T R_g z1(x_Cg)
        + sum_(linear h) h * lambda_h(x_Ch)
        + sum_(quadratic h) h * eta_h(x_Ch),

with Q_C,R_g positive semidefinite, lambda_h of degree at most three,
eta_h of degree at most two, and rational coefficients. z_d lists every
monomial of total degree at most d in its listed variables. Cg and Ch are
the corresponding local constraint cliques. Every term has degree at most 4.

Soundness is immediate but important: at ANY feasible full circuit assignment,
each SOS is nonnegative, every inequality g is nonnegative and every equation
h vanishes. Therefore an EXACT verified identity implies P>=0 for every real
five-apex input and hence the desired global K6 bound. It covers the whole
domain without stationarity, natural order, or compactness assumptions.

No running-intersection property is required for this implication. Conversely,
we have NOT proved that a dense SOS or the true K6 inequality admits this
restricted local identity. The correlative sparsity graph could have a much
larger chordal treewidth. A sum of chosen small local Grams is a RESTRICTED
sufficient certificate ansatz, not an equivalent decomposition of every dense
Gram and not a sparse-convergence theorem.

## 4. Explicit certificate size ceilings

Free SOS blocks: 450 cliques of size at most three (clip, initializer,
objective), and 1085 of size at most four (time, spatial, cap). Their degree4
Gram orders are at most 10 and 15. This gives at most

    450*55 + 1085*120 = 154950 symmetric Gram parameters.

Inequality multipliers: 2170 linear gate inequalities use cliques of size
at most four; the 80 linear and 80 quadratic clip inequalities use size at
most three. Degree2 SOS multiplier Gram orders are at most 5 and 4. They
have at most `2170*15+160*10=34150` parameters.

Equation multipliers: 880 linear maximum links use at most four variables,
205 linear initializers use at most three, and 1085 quadratic equations
use at most four. Coefficient ceilings are

    linear: 880*C(7,3)+205*C(6,3)=34900,
    quadratic: 1085*C(6,2)=16275.

TOTAL scalar parameter ceiling: 240275. The 1535 free SOS and 2330
multiplier Grams together have raw double dense storage at most

    (450*10^2+1085*15^2+2170*5^2+160*4^2)*8
      = 2767480 bytes (about 2.64 MiB).

This is not a bound on total solver memory. Local polynomial expansions
give at most 317186 coefficient-row slots before merging duplicate monomials:

    free SOS: 450*35+1085*70 = 91700,
    linear inequality terms: 2170*35+80*20 = 77550,
    quadratic clip terms: 80*35 = 2800,
    linear equation terms: 880*70+205*35 = 68775,
    quadratic equation terms: 1085*70 = 75950,
    target polynomial: at most 411.

An upper incidence count for the sparse identity map is 495061: one monomial
per free Gram entry, at most three per inequality-multiplier entry, at most
four per linear-equation coefficient, and at most six per quadratic-equation
coefficient, plus the target. These ceilings follow from the explicit wire
polynomials, not a chamber catalogue. They do not establish 120-second solving
time, numerical conditioning, certificate existence or exact rational recovery.

The 317186 count is a contribution-row inventory, NOT the required number of
distinct matching equations. Every multiplier/constraint product is supported
inside its own parent clique from the free-SOS list. Each objective support is
also in that list. Thus the distinct polynomial-row count is at most

    450*C(7,4)+1085*C(8,4)=91700.

Free blocks for repeated constraint subcliques can be absorbed into their
parent PSD block by monomial embedding and addition; they need not be counted
again. This is an algebraic aggregation of identical/contained supports, not
a chordal-completeness assertion.

A dense 91700-by-240275 coefficient array would require roughly 176 GB at
eight bytes per entry. Sparse storage is therefore mandatory: the preceding
495061-incidence ceiling would require about 11.9 MB for raw 64-bit row/column/
value triplets. Solver factorization, canonicalization, iterates and exact
recovery overhead are additional and unmeasured. Raw small Gram matrices and
sparse triplets alone do not qualify the whole run under 1 GiB/120 seconds.

## 5. Challenge with the prior exact two-atom functional

The earlier minimal-degree2 diagnostic extends to all explicit max and
initializer variables by assigning their exact affine wire values at X=+2,-2.
Every new linear equation then vanishes pointwise. Consequently that same
functional STILL excludes the minimal degree2 quadratic module of this expanded
model: equality multipliers, including linear ones, contribute zero pointwise.

It does NOT exclude the structured degree4 ansatz in section 3. Choose an
ORIGINAL clip variable tau_e whose raw crossing has coefficient q=1 in the
diagnostic (for example c=A6-A5=X). Its actual generator g=tau_e permits the
local SOS multiplier (1-tau_e)^2 in that clip's parent clique. At the two
atoms tau_e=X its expectation is

    E[X*(1-X)^2] = -8.

Thus the old functional is not positive on this degree4 module. This removes
that particular obstruction; it is NOT evidence that the required identity
exists. No stronger dual functional or positive certificate was obtained.
This generator is not a sorted-time output such as tau1; no unlisted sorted
positivity constraint is added to the model.

## 6. Feasibility/completion boundary

The raw PSD blocks are drastically smaller than the dense degree4 Gram from
the preceding model. The coefficient identity still has up to about 240000
unknowns and at most 91700 distinct matching rows; no solver/build-time
measurement exists.
The inspected Python environments still lack SDP solvers, and none is installed.
Therefore no SDP is released or executed. No new code/process was used in this
structured hand-only assessment. Ordinary source/clock reads are separate.

Exact model/support derivation and a sound target identity grammar are provided
for literal review. There are NO coefficients solving that identity, no PSD
certificate to verify, and no global value floor or inverted class excluded.
K6 remains OPEN. Smaller blocks are a feasibility observation, not root closure.
Only this new note is written; all predecessor files remain frozen.

## 7. Final disposition and timing

Builder new derivation STOP observed 14:09:48 UTC, before unchanged hard stop
14:18:12. Stop reason: structured certificate grammar established but identity
coefficients, solver availability and total execution feasibility unqualified;
not cap exhaustion and not a proof that the stronger class is impossible.
Subsequent activity is literal review/recording only.

No SDP, exact replay script, numerical trial or dependency installation was
performed in this structured continuation. The single search allowance stays
unused. New file: this note only; nothing removed, no new agent/infrastructure,
and all predecessor notes/scripts remain unchanged. Minimal vibecode-kit use
was confined to the existing review/completion workflow.

Independent critic FULL literal review at 14:09:42 UTC accepted the exact
model, objective/support derivation, certificate soundness and stated ceilings.
Its one notation clarification (original clip generator, not sorted output)
is incorporated above. It accepted no identity coefficients, solver-runtime
qualification or K6 lower bound.
