# TIP114 independent hand/source review — early incidence cells

Initial status: **HAND DESIGN SOUND; ACTUAL NEW SOURCE REVIEW PENDING**.
This is a supplementary AI critic, not an external human referee or a K6 proof.
The ALL-real finite F6>=20/93 target and production cost remain OPEN. This critic
executes no mathematical process, test, code, web/API call, or prior-file edit.
Only this note is owned here. Original TIP112/113 sources and evidence stay intact.

Read TIP113's actual cost report, TIP112's source/proof and prior review, then
TIP114's complete charter and EARLY_CELL_SOUNDNESS. The current engineering scope
is 15:24:33–16:24:33 UTC with <=120s aggregate mathematical tests, no production.

## 1. Genuine partition reduction and the cheapest sound obligations

The proposed change is not BFS-to-DFS, caching, or longer enumeration. It allows
a partial-wall cell to terminate when exact certificates establish ONE actual
union-area quadratic throughout that entire cell. Some of the 147 arrangement
walls may cut the cell without changing this area law; those walls need not be
split. Affordable total production cost does not follow merely from this logic.

Let U be a nonempty root-STRICT/path-STRICT region, verified by an interior sample.
It is open and full-dimensional in the five offset coordinates. Let C be the
larger root-CLOSED/path-CLOSED polyhedron used for implication certificates.
Certifying on C is stronger than needed and is logically safe. The relevant
incident-face domain is root-STRICT/path-CLOSED. Every point there lies in the
closure of U: convex-combine it with the strict sample and take the coefficient
of the sample to zero. The nonempty strict sample is indispensable; a wall-only
sample would not justify ambient polynomial or gradient continuation.

For each nonparallel endpoint PAIR e, the height h_e and crossing position are
affine forms in p. The generic jump is zero for a covered crossing, positive
|s1-s2| for exposed LL/RR, and negative |s1-s2| for exposed opposite kinds.
Every pair must be enumerated, including equal-height events at separate places.
Deduplicating the REQUIRED ROWS after regeneration is safe; deduplicating EVENTS
by height would not be safe.

The adopted sufficient clauses are sound:

- An outside event has -h>=0 or h-1>=0 throughout C. Its generic contribution
  is zero. Structurally h=0 own-triangle pairs are zero events, not clipping rows.
- A covered event has BOTH pos-L_k(h)>=0 and R_k(h)-pos>=0 throughout C for
  one genuine third interval k. No upper/lower clipping obligation is needed:
  whenever the event is physically active it is covered, and when it is outside
  the physical strip it contributes nothing anyway. These two inequalities
  themselves imply h>=0, since their sum is the third interval width h.
- An exposed event has h>=0 and 1-h>=0 throughout C and, for EVERY genuine
  third interval k, one fixed outside-side condition L_k(h)-pos>=0 or
  pos-R_k(h)>=0. Thus no third interval hides its boundary change.

The checker must regenerate this complete inventory from the supplied interior
sample and independently reconstructed model, not trust provided exposed/covered
bits, event subsets, or a polynomial value at one point. Choosing the lowest
covering third label and a deterministic outside side makes the wire unambiguous.
It is sufficient, not necessarily the cheapest witness for every parent.

## 2. Critical genuine-third condition and zero forms

The covering or outside interval label must differ from BOTH owner labels of the
crossing pair. Otherwise an owner's own endpoint gives an identically zero
containment row and could falsely classify an exposed LL/RR boundary as covered.
This was flagged to Main before source implementation and must be enforced by
independent regeneration, not left to producer convention.

For a genuine third label, the comparison forms are nonzero affine triple/order
forms in the full five-dimensional parameter space. If a nonconstant affine
g>=0 on C vanished at an interior point of U, perturbing that point slightly
in direction -normal(g) would stay in U but make g negative, a contradiction.
Therefore every selected nonconstant decision row is STRICTLY positive on U.
Discarding identically nonnegative constants is harmless; negative constants
must refuse. Own-triangle h=0 is the legitimate structural zero event.

Consequently classifications are fixed throughout U at generic points. Any
remaining unused-wall coincidences are either irrelevant covered events or
otherwise handled by continuity. The event identity

    G=3+(1/2) sum_active_pairs Delta_e*(1-h_e)^2

defines the SAME quadratic throughout U. An unused clipping wall may pass through
U for a uniformly covered crossing, but its contribution is zero on both sides.
At h=1 an exposed squared term vanishes; physical clipping does not create a
value discontinuity. Continuity of actual area extends the polynomial to the
root-strict closed-path incident faces.

Independent endpoint-count slab integration on a generic fine neighborhood gives
polynomial coefficients, not a fitted scalar. The preceding event-incidence
proof supplies a global degree-two law first; equality on that open neighborhood
then proves polynomial identity over U. The generic perturbation must preserve
every strict root/path row; it may cross unused walls because the certified law
is already invariant there. Same-height forms can be slab-boundary deduplicated
only while all endpoints remain in the coverage-count sweep.

## 3. Affine implication dual reviewed directly

For a required row g=a.p+c, shift p=z-R, z>=0, and put
d=c-R*sum(a). Regenerate the closed-parent inequalities A(z,epsilon)<=b,
including valid coordinate and epsilon bounds. The objective coefficient on
epsilon is zero. If exact multipliers satisfy

    lambda>=0,
    lambda*A>=(-a,0) coefficientwise,
    lambda*b<=d,

then -a.z<=lambda*A.(z,epsilon)<=lambda*b<=d, giving g>=0. Coefficient
domination is sound because every shifted coordinate AND epsilon is nonnegative.
No simplex status or producer-supplied LP matrix is trusted. Positive-only
primitive normalization is essential: flipping a row would reverse its assertion.
The checker must reconstruct each normalized row, orientation, LP shift, and
dual target constant before acceptance.

Cheap direct row/cone proofs can avoid LP solves. Root-word comparisons telescope
to give the apex difference for any pair; dividing by the fixed slope difference
fixes the crossing height SIGN. Thus initial ordering, nonpositive crossings,
and parallel-order conditions can often be certified directly from root rows.
An incidence row already equal to a positive multiple of a used cut likewise has
a trivial exact implication certificate. LP is a fallback, not the truth source.

At full 147-wall depth, the required clipping/exposure forms are declared walls,
so fixed signs supply direct certificates. The new early criterion therefore
does not remove the original finite fallback. If a row is not proved at a partial
parent, splitting its unused canonical wall is sound; dropping it is not.

An optional stronger pruning design, NOT required by the adopted charter, would
condition coverage implications only on 0<h<1 or certify joint noncoverage
infeasibility rather than a fixed outside side. It could avoid some proofs on
physically inactive portions, but adds conditional/disjunctive checker logic.
The adopted closed-parent fixed-row criterion is simpler and conservatively safe.

## 4. Arbitrary split order, faces, and entire stationary families

Any unused declared wall can split a node, provided both oriented children are
present and wall indices do not repeat along a path. Exact empty-interior duals
remain valid. Every nonempty parent is covered by closures of its nonempty
children; a finite complete forest's terminal closures therefore cover every
strict root point, including omitted-wall/concurrent/clipping faces. Missing
roots/children, cycles, unreachable evidence, pending leaves or an uncertified
incidence row prevents whole acceptance.

Actual G is C1 on the strict apex roots because persistent parallel contacts are
excluded and all other endpoint ties occupy a null set of heights. A hypothetical
minimum in an early-leaf closure consequently has ZERO FULL FIVE-VARIABLE
gradient of its area polynomial, not merely a constrained-face KKT condition.

Consistent stationary systems retain the complete affine family p0+ker(H) and
constant quadratic value. A safe value needs no feasibility claim. An unsafe
value still requires exclusion of the ENTIRE family with root-STRICT/path-CLOSED
rows and all five stationarity equalities. No partial-cell incidence pruning
licenses particular-point-only feasibility or deletion of a nullspace direction.

The strict range/root reduction still targets hypothetical STRICT subtarget
minima, not equality on range(p)=49/31. Reusing old prefix forest nodes and history
is an evidence-preservation requirement; an origin hash is integrity metadata,
not proof, authority, or a runtime grant.

## Initial design verdict and pending source acceptance

**NO_BLOCKING_HAND-DESIGN_GAP_FOUND** for the chosen sufficient criterion.
The early law legitimately joins some full-sign chambers and can eliminate
unnecessary splits. It does not establish actual work reduction, whole generation
cost, or K6 closure. Source review remains PENDING until the complete changed
producer/checker and focused tests are available. This critic has run zero math
processes/tests and does not attribute others' test outcomes to this review.

## First actual-source checkpoint — producer read, checker pending

Read all of the initial TIP114 `producer.py`, not merely its header or proposed
method. No blocking mathematical source defect was found in that pass.

Specific checks: `signed_primitive` uses positive lcm/gcd only; `incidence_rows`
enumerates all pairs and explicitly rejects owner labels as third intervals;
covered contributions have exactly two containment rows and no clipping rows;
exposed contributions retain both clip rows and every third's outside-side row.
All required rows are regenerated, normalized, deduplicated and checked against
the existing wall inventory. Structural own-apex zero events are discarded.

`closed_rows` calls the immutable LP assembler with closed paths and explicitly
zeroes the epsilon coefficient of all 35 root rows. Thus its implication domain
really is the closed parent. `check_implication` checks nonnegative multipliers,
all six combined columns, and the correct shifted constant. Its direct-row fast
path still produces and checks an exact certificate; failure falls back to exact
simplex rather than accepting a cached boolean.

The in-memory proof cache is legitimate evidence reuse, not an omitted obligation:
for a child it inserts a zero multiplier at the new path-row position BEFORE
the six bounding rows. A proof on the larger parent is valid on either child,
and the classifier rechecks it against the current regenerated matrix. A new
leaf serializes only its fully regenerated required inventory and matching
proofs. Missing proofs force splitting of the unused canonical wall.

Moment refinement preserves every strict root/path sign and avoids all 147
sample walls, so the immutable event-polynomial routine receives a genuinely
generic point. Early stationary records still call the immutable full-five-
variable solver and entire-family root-strict/path-closed feasibility logic.
Import changes v1 schema and adds the raw-input origin hash, without replacing
its nodes/roots/history; v2 resumes preserve that origin. These are source
observations, not an executed preservation test.

Arbitrary used indices and dual row order are reconstructed from the actual
path; duplicate split indices are rejected. Time/byte/status/transaction/history
semantics retain the repaired TIP112 boundary. Cooperative RSS guards are not
hard containment or a qualified production peak. Independent checker and focused
tests remain PENDING at this source checkpoint; critic mathematical executions
remain zero.

## Second actual-source checkpoint — independent checker and both tests read

Read the complete new `checker.py`, complete producer test source and complete
checker test source. Neither checker nor checker tests import producer algorithms.
The checker reuses only the separately implemented immutable TIP112 checker,
not the producer's LP, event/exposure, RREF or wall implementation.

The actual independent incidence routine enumerates every nonparallel endpoint
pair, skips only structurally zero height forms, reconstructs both third-interval
endpoints, excludes BOTH owner labels, and deterministically selects the lowest
genuine covering label or EVERY required outside side. Its `put` additionally
requires a strict decision at the generic interior sample, preserves primitive
row orientation, and checks each nonconstant row against the full wall inventory.
The supplied integer row list must equal the full sorted regenerated inventory;
missing, reordered, sign-flipped, noninteger or extra rows cannot substitute.

The independent closed LP assembler closes BOTH root and path rows, regenerates
the shift c-R*sum(a), and includes all six coordinate/epsilon bounds. Implication
checking verifies exact multiplier count/signs, all six dominating columns, and
the shifted constant bound. The checker does not rerun producer simplex and
does not accept a provided incidence boolean or supplied matrix.

After implication checking, it independently integrates actual union coverage
to recover all 21 polynomial coefficients. Full five-variable stationary/RREF,
complete nullspace and constant-value acceptance still use the independent
TIP112 implementation. Unsafe feasibility remains root-strict/path-closed with
every stationary equality, regardless of early path depth. The larger closed
LP used for INCIDENCE has not leaked into those strict-family truth conditions.

Forest traversal requires every old root, both children of every new arbitrary
unused wall, no shared ownership/cycles/unreachable extras, and genuine evidence
for every terminal leaf. Early and legacy stationary leaves share accounting;
legacy leaves still require all 147 distinct walls. Missing incidence cannot be
hidden by relabeling a shallow early node as legacy stationary. Pending branches
and non-COMPLETE declarations still refuse whole acceptance. Source metadata
origin validation does not pretend to prove provenance or grant execution.

Focused test sources correctly keep their real early-cell forest INCOMPLETE.
The fixed sign control demands fewer than 147 rows only IF the exact regenerated
inventory really has that size; its G=40/31/rank-five anchor remains a local
control, not a whole-root proof. Tests separately target missing/sign-flipped
incidence, invalid implication bounds, false polynomials/values, repeated walls,
missing roots/children, old full-depth leaves, and whole singular-family logic.
Synthetic constant or contradictory helper rows are not presented as geometric
coverage. These observations are from reading tests, not executing them.

## Final hand/source verdict

**NO_BLOCKING_SOUNDNESS_DEFECT_FOUND** in the reviewed design and complete new
sources. The strongest important checks are whole-parent incidence implications,
genuine third coverage, positive-only normalization, complete pair inventory,
full-dimensional sample/face continuation, independent polynomial derivation,
and unchanged ENTIRE unsafe stationary-family requirements. They are actual
mathematical/source arguments, not a count of tests or hashes.

What is established here is a sound sufficient early-leaf proof criterion and
source implementation consistent with it. What is NOT established is actual
native speedup, an affordable remaining-work bound, complete whole production,
K6 optimality, external human review, formalization, novelty, or causal advantage.
Measurements and PASS results belong to the Main/Builder execution ledger.

Critic mathematical executions/tests: ZERO. Code changes by this critic: NONE.
Only this new review note was written; no predecessor edited, no scratch/build
artifact created, and nothing deleted. Engineering and scientific claim
boundaries from the initial checkpoint remain in force.

## Preserved first checker-test finding — fixture-only correction

Main reports the first checker run passed 15 of 16 controls and failed only the
assertion that the retained stationary vector p* was nongeneric for the 147 event
walls. Its first failed ledger remains preserved and charged. Being on the root
RANGE boundary p1*=49/31 does NOT imply lying on any event-arrangement wall;
those are different constraint inventories. The original test assertion was
therefore not licensed by the range observation in this review. My initial
static test reading had not independently proved that assertion either.

Read the actual narrowly patched `test_checker.py` lines 196–198. Only the fixture
and explanatory comment replace `self.star` by `(F(0),)*5` for the nongeneric
event-sample refusal. This fixture is verified by hand: for LL1/LL2,

    L1(t)=p1+1-t, L2(t)=p2+2-2t,
    crossing height =1+p2-p1.

At zero offsets it is exactly t=1, so the declared unit-clip event wall
p2-p1=0 vanishes. Zero offsets still have strict natural apex order and strict
pairwise range, making this an appropriate EVENT-wall fixture rather than a
root-boundary surrogate. No incidence, implication, polynomial, stationary,
forest, or checker source semantics changed. The source soundness verdict above
is preserved; this is a test-fixture defect, not an erased proof counterexample.

Main separately reports producer controls 12/12 PASS and a fixed-cell inventory
of 94 required signs versus the legacy 147. These are others' executed engineering
results, not critic executions or whole-root coverage. At this checkpoint the
native old/new continuation comparison has not yet run; corrected checker replay
results belong to its subsequent ledger, not to this acknowledgment.
