# TIP112 independent hand/source method review

Scope: supplementary AI mathematical/source critic of the minimal K6 certificate
toolchain, not mathematical production, external human review, or a theorem.
No mathematical subprocess, test, random search, web/API call, code execution,
or predecessor edit is being performed by this critic. Only this review note is
owned here. The scientific ALL-real F6>=20/93 root remains OPEN unless a complete
production certificate is separately authorized, generated, and accepted.

Initial method verdict: no blocking mathematical defect found in the proposed
certificate logic. Actual TIP112 producer/checker sources are still being written
at this initial checkpoint; source acceptance is therefore PENDING below.

## 1. Actual-union law and independent coarse polynomial

Read TIP112, its current commitment/handoff, TIP111 MAIN_EVENT_SPLINE and actual
audit source, and the relevant TIP106 collision/C1 and TIP107 radial/13-word
reductions. In p6=0 gauge, Aj=pj+j and the six intervals are
[Aj-jt,Aj-(j-1)t]. Strict word rows ensure all apices differ. Parallel endpoint
coincidences can only be adjacent left/right endpoints; strict apex order excludes
them. Thus, near t=0 all six intervals are disjoint and union-length slope is six.

At a generic positive crossing LOCATION, exposed LL/RR endpoints change a
minimum/maximum boundary and contribute +|s1-s2| to the length slope. Exposed
opposite-kind endpoints create or destroy overlap and contribute -|s1-s2|.
Strict coverage by another interval makes the crossing invisible to union length.
These are all possible changes. Hence

    G=integral_0^1 L(t)dt
     =3+(1/2) sum_(pair events 0<t_e<1) Delta_e*(1-t_e)^2.

Crossing times are affine parameter forms divided by fixed nonzero integer slope
differences. The sum is therefore an exact quadratic on a coarse chamber where
event/exposure/clipping signs are fixed. Equal times at different locations must
remain separate PAIR events: same-interval-pair LL and RR events are structurally
simultaneous but spatially separated for t>0.

Independent endpoint-count integration may deduplicate identical affine HEIGHT
forms as slab boundaries, provided every endpoint still enters the coverage count
within each slab. This is not event-record deduplication. Nonidentical height forms
can be separated at a generic sample while preserving the coarse chamber; both
boundary times and endpoint intercepts are affine forms, so slab integration gives
a symbolic quadratic. Its extension beyond that chosen fine subchamber is justified
by the coarse arrangement theorem, not by numerical agreement at a sample.

More explicitly: triple-concurrence signs fix the position of each crossing
relative to every third endpoint; parallel intercept signs fix parallel ordering;
t=0 and t=1 clipping signs fix the physical crossing range. These determine union
boundary incidence throughout a connected coarse sign chamber. Unrelated crossing
times can swap without changing those incidences. The direct-event quadratic, or
equivalently shoelace on the fixed boundary, is invariant on that coarse chamber.
Therefore any fine-subchamber symbolic derivation yields its unique coarse law.

## 2. Wall and root completeness

All triple and parallel walls are required, together with apex/top and physical
unit-clipping walls. Apex/top walls already arise from triples containing the two
endpoints of one interval; strict roots exclude these collision locations. Unit
clipping is genuinely affine in offsets and cannot be replaced by normalized
homogeneous shape walls. In p coordinates the nonparallel unit events have
conditions p_j-p_i=0, +1, or -1. There are 15 same-kind zero conditions,
15 one-facing-orientation conditions, and 10 other-facing conditions: the missing
five adjacent conditions correspond to PARALLEL lines and are instead their
apex-collision walls. This explains 40 unit-clip planes. The full regenerated
inventory, not these counts alone, must be independently matched to the certificate.

The 13 words are the natural word with disjoint adjacent swaps. At a hypothetical
below-target global minimum, predecessor radial/connected-bottom reductions give
range(p)<49/31<2. Nonadjacent apices differ by at least 2-49/31>0, while adjacent
apex ties cannot be local minima by TIP106. Therefore only disjoint adjacent
inversions occur, and the word classification is complete for such minima.

These STRICT roots cover necessary below-target minima, not every real vector and
not all equality cases. Excluding range=49/31 is justified only because a strictly
below-target minimum has strict range. A universal lower-bound contradiction may
use this reduction; an equality classification could not silently reuse it.

Enforce all 30 directed pairwise range rows and all five neighboring comparisons
in the FULL sorted word. Adjacent NATURAL comparisons alone would be insufficient.
The gauge implies -R<p_i<R, R=49/31, so closed box bounds [-R,R] are a safe
bounded superset and permit shifting p_i=z_i-R with z_i>=0.

## 3. Split forest and all incident faces

Each admitted open parent cell has positive common strict slack, hence full
dimension. Every nonzero affine splitting wall has two declared children, using
strict opposite signs for their interiors. A child with no positive common slack
may have a wall-only feasible set; it is an EMPTY-INTERIOR child, not proof that its
closed set is empty. This distinction is harmless only because incident faces
are covered by closures of nonempty open children.

For any point in the closure of a nonempty parent, approach it by interior points
avoiding the next wall. A subsequence lies in one child, so the point belongs to
that child's closure. Repeating along a finite complete split tree establishes
closure coverage by nonempty leaves. Strict root points admit the same density
argument. Missing roots, missing either child, cycles/shared inconsistent paths,
pending leaves, or unprocessed wall inventory must never yield COMPLETE.

At stationary leaves, all split-wall inequalities must be CLOSED. Root range/word
rows remain STRICT. Actual G is C1 away from persistent adjacent contacts: for
almost every t the endpoint order is locally fixed and gradients are bounded;
dominated convergence gives continuous first derivatives. A minimum on an
internal face therefore satisfies the full FIVE-variable gradient of an incident
quadratic. No face KKT or merely tangential stationarity is a substitute.

## 4. Exact common-slack duals and singular families

In independently regenerated LP form, let all variables (z1,...,z5,epsilon)
be nonnegative, include z_i<=2R and epsilon<=1, and translate p_i=z_i-R.
For strict rows g(p)>0 use g(p)>=epsilon; closed rows use g(p)>=0.
Every finite strictly feasible row family admits some epsilon>0, and every
epsilon>0 feasible point satisfies all strict rows. This equivalence is exact.

For A z<=b, a rational multiplier vector with

    lambda>=0, lambda*A>=e_epsilon, lambda*b<=0

certifies epsilon<=0, since z>=0. A rational vector with

    lambda>=0, lambda*A>=0, lambda*b<0

is a Farkas exclusion even of the relaxed LP. Coefficient DOMINATION rather than
equality is sound precisely because the shifted variables and epsilon are
nonnegative. Checker must regenerate every row, orientation, constant, shift, and
strict coefficient; trusting an LP matrix or solver status would break this proof.

Full stationarity is H p=-linear, inserted as ten paired CLOSED equality rows
in the slack LP. On any consistent stationary affine set p0+ker(H), a quadratic
has constant value because H p0=-linear. A safe value covers the entire family
without a feasibility test. A below-target value requires excluding the ENTIRE
family by the closed-cell/strict-root LP dual above. An infeasible p0 alone is
not sufficient, and a singular status label or incomplete kernel cannot replace
exact rank/full-nullspace checking. A feasible below-target family requires an
actual witness independently checked by both immutable area paths; a producer
polynomial is not by itself that geometric verification.

## Source review checkpoint

PENDING: actual TIP112 producer/checker source was not yet available at the
initial mathematical-method review. Subsequent source findings will be appended
here, preserving this initial status. No full production cost or whole-root
closure is established by this review.

### First actual-source checkpoint — 14:20 UTC, pre-execution

Read the complete initial `producer.py` and `checker.py`, including their CLIs,
exact simplex/dual extraction, resumption traversal, direct-event polynomial,
independent fine-slab integration, full elimination, and forest acceptance.

First concrete finding: native producer model included the explicit `gauge`
field while the checker's exact model-field set excluded it. Native certificates
would therefore be refused as BAD_MODEL_FIELDS. Both builders were alerted;
checker reports the gauge field is now explicitly checked. This is an
interoperability defect caught before a run, not a false-positive proof or a
counterexample to the event law. Preserve this first finding rather than report
the source pair as having been compatible from the outset.

A second pre-run interoperability seam was disclosed by the builders: native
elapsed/limit metadata were floats, but artifact input rejected every JSON float.
Producer is converting such non-proof metadata to strings. The critic did not
run either version and does not count this as executed validation.

No false-positive mathematical acceptance was found in this first full source
pass. Specifically:

- `lp_rows` shifts each row using the correct constant c-R*sum(a), gives each
  strict row epsilon coefficient +1 in <= form, adds five shifted coordinate
  upper bounds and epsilon<=1, and treats all paired stationary equalities as
  closed. The checker independently regenerates this matrix.
- `check_dual` rejects negative multipliers and verifies every combined column
  against the epsilon objective or zero, with the correct final nonpositive or
  strictly negative bound. It does not import or rerun producer simplex.
- The stationary checker independently eliminates the full 5x5 system, checks
  a supplied particular solution, all kernel directions, kernel independence,
  the exact dimension 5-rank, and common value. Below-target cases require the
  full-space stationarity/root-strict/cell-closed dual, not point infeasibility.
- Forest traversal independently requires all 13 roots in declared order,
  both children of each split, one owner per node, no cycles or unreachable
  extras, and all 147 sequential walls before a stationary leaf. A pending
  node or non-COMPLETE declaration refuses root acceptance.
- Fine-slab integration keeps all 12 endpoints. Identical height FORMS alone
  are deduplicated; a moment-direction perturbation avoids nonidentical ties
  while preserving every root/path sign. Each zero tie row has a nonzero
  linear part (identical forms were removed); its restriction to the degree-4
  moment curve has at most four integer roots. The 4*N+1 trials therefore
  suffice for a direction. Exact epsilon then preserves every nonzero sign.
- A witness record is not accepted as lower-bound closure. Producer's witness
  route checks both immutable physical-area algorithms before marking WITNESS;
  checker refuses lower-bound acceptance of it.

Final frozen-source and test status remain pending at this checkpoint. The
predecessor all-real routing additionally relies on TIP108F's two-bottom-component
exclusion; this engineering source review does not freshly re-prove that theorem.

### Second source checkpoint — pre-test repair review

Identified a producer status corner after the first pass: a TimeoutError or
MemoryError set INCOMPLETE, but a subsequent pending==0 assignment could overwrite
it with COMPLETE if interruption arrived just after the final leaf commit or
during validation of a no-pending resume. The current checker already rejects a
COMPLETE artifact with a stop reason, so this was not a false-proof acceptance;
it nevertheless violated the producer's promised terminal status semantics.
Builder repaired the final assignment to require pending==0 AND reason is None.

Also identified absent inner guards during resume traversal and a pre-timer
resume JSON read. Builder moved the outer timer before startup parsing, reduced
resume input to the 64MiB evidence cap, and added guards during every traversal
and wire-size pass. The source now explicitly labels measured RSS refusal as
COOPERATIVE, not hard OS containment. Future production peak memory and complete
generation/checking cost remain unqualified; no input-cap label proves otherwise.

The small run-history addition raised an interruption-bookkeeping issue:
interrupting after node commit but before incrementing processed could leave
valid state whose cumulative processed count was understated. Builder moved the
increment into the same rollback transaction as parent/child mutation; rollback
restores the pending parent, removes newly allocated children, and restores the
old count. I reread this actual repair and the matching checker history/accounting
logic. History preserves successful and refused scoped runs as engineering
metadata; it is not a tamper-proof runtime grant or theorem premise.

Both current source files and both focused-test files have been read through.
Gauge and decimal-string metadata schemas now match. Model integer inventories,
complete root/tree ownership, no-unprocessed-wall terminal acceptance, full
stationarity/nullspace/value checking, matrix-rederived duals, and independent
slab polynomial derivation remain intact after those changes.

The fixed actual-leaf control has stationary p*=(49,43,23,26,6)/31 and value
G=40/31. Its range is exactly 49/31, on the STRICT root boundary. This is valid
as a SAFE-value control: no stationary feasibility is required for a safe value,
and the root reduction is only for strictly smaller minima. It does not classify
target equality or certify an entire root. The test forest intentionally retains
many pending siblings and roots and must refuse whole acceptance. Synthetic
constant/singular dual fixtures exercise helpers, not actual geometric coverage.

## Final hand/source verdict

**NO_BLOCKING_MATHEMATICAL_SOUNDNESS_DEFECT_FOUND** in the reviewed, repaired
source and stated analytic reduction. The pre-run engineering seams above
are preserved as findings, not silently erased. The reviewed code is a logically
complete-capable certificate interface: actual acceptance would require every
root and leaf of an actually complete forest, not counts, a fixed leaf, synthetic
tests, or an INCOMPLETE smoke. I do not certify that a complete K6 forest fits
the current node/time/byte ceilings or that production has run.

This critic executed zero mathematical processes/tests, wrote no producer or
checker code, changed no predecessor, and deleted nothing. Any reported test
PASS belongs to the separately executed Main/Builder ledger, not to this source
review. No external human referee, formalization, novelty, or causal method
advantage is established. Scientific ALL-real K6 closure remains OPEN.
