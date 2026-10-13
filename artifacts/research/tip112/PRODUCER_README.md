# TIP112 producer — proof-only CLI

Engineering implementation and focused verification are complete. Scientific
STOP was recorded14:25:48UTC. Whole147-wall/all13 production remains EXCLUDED
until total generation AND independent checking cost is qualified and directly
routed. The commands below document the interface; they are not a new execution
grant, a continuation instruction or a K6 proof. All-real F6>=20/93 remains OPEN.

## Bounded invocation and resume

From /Users/os/hiveos, after the required fresh authorization:

    python3 -B artifacts/research/tip112/producer.py --seconds 8 --max-nodes 18 --out artifacts/research/tip112/NEW_BOUNDED_OUTPUT.json

An authorized continuation can read an INCOMPLETE checkpoint and MUST write
a different, nonexistent output path:

    python3 -B artifacts/research/tip112/producer.py --seconds 5 --max-nodes 2 --resume artifacts/research/tip112/NEW_BOUNDED_OUTPUT.json --out artifacts/research/tip112/NEW_RESUMED_OUTPUT.json

--max-nodes limits processed pending nodes in THIS invocation, not the cumulative
forest. All13 roots are seeded before any processing. --seconds is positive and
at most28; outer SIGALRM is ceil(seconds)+2, at most30s. Output is create-only.
Only INCOMPLETE input may resume. The complete existing tree and prior run_history
are preserved and validated; no node/face/frontier is silently discarded.

Exit0 means producer statusCOMPLETE, NOT independently verified mathematical
acceptance. Exit3 means INCOMPLETE, REFUSED or WITNESS; read the explicit status
and reason. The checker MUST be run independently under its separately approved
envelope. Pending nodes, missing children/roots and resource refusals are never
complete. A WITNESS is checked by both immutable area paths before output, but
still requires the Contractor's independent review; it is not an automatic claim.

## Exact wire and certificate semantics

Schema tip112-k6-v1 uses p6=0 and A_j=p_j+j. The model contains all13 strict
disjoint-adjacent-swap words,147 canonical integer affine walls and21 quadratic
terms (i,j),0<=i<=j<=5; coordinate5 is the constant1. Target is G=40/31, G=6F.

Flat node IDs form a forest with all13 roots. A split uses wall=path depth and
has BOTH minus and plus children. Empty leaves carry exact rational duals.
Stationary leaves occur only after all147 walls, with a generic sample, actual
event-law polynomial, full five-variable particular/nullspace/value certificate,
and an entire-family dual if the value is unsafe. Independent checking does
not import the producer's algorithms or trust a simplex/status label.

Root rows are the30 TRUE ordered-pair strict range inequalities
49/31-p_i+p_j>0, followed by the5 strict apex-word gap rows. Empty-interior LPs
make all root/path rows strict. Unsafe-stationary LPs keep roots strict but
cell rows CLOSED and append BOTH signs of all5 ambient gradient equations.

LP variables z_i=p_i+49/31 and epsilon are nonnegative; z_i<=98/31 and
epsilon<=1 are appended bounds. An affine row a.p+c>=epsilon (strict) or>=0
(closed) becomes -a.z+strict*epsilon<=c-(49/31)*sum(a). Two-phase Bland simplex
emits nonnegative multipliers lambda. The independent dual conditions are:

- epsilon_bound: lambda*A>=e_epsilon and lambda*b<=0;
- farkas: lambda*A>=0 and lambda*b<0.

These exact identities, not solver status, prove emptiness. A singular unsafe
family is constrained by its ENTIRE Hessian equalities; an infeasible particular
solution is never sufficient. Safe stationary value covers the whole family.
The closed-cell/C1 and root closure-density argument is documented separately
in CERTIFICATE_SOUNDNESS.md and remains part of mathematical acceptance.

## Resource and evidence scope

Source guards are COOPERATIVE measured-peak checks, not hard OS containment.
The process refuses above512MiB measured peak (stricter than the1GiB ceiling),
checks node/state and serialized evidence budgets, and reserves128KiB for
header/serialization accounting. Resume input/output is at most64MiB. Complete
production peak behavior and total cost have NOT been qualified by tiny tests.

BUILDER_TESTS_1.json contains12 focused controls and one real147-wall leaf.
MAIN_SMOKE_1.json and MAIN_RESUME_1.json are bounded INCOMPLETE states only.
Their checker refusals are expected, not complete/root certificates.
Do not turn finite tests, hashes, node counts or a COMPLETE producer label into
coverage/theorem acceptance without the independent full checker and retained
universal reductions. No full production was run in TIP112.
