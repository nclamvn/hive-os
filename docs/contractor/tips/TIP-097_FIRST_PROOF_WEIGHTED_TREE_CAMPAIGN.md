# TIP-097 — one complete weighted-tree mathematical campaign

Start: 2026-10-10 07:27:53 UTC. Hard stop: 08:57:53 UTC (90 minutes).
Mode: PUBLIC_PROBLEM_SOLVING / mathematical reconstruction, not novelty or blind benchmark.
Owner routing: direct request to implement a substantial task demonstrating AI mathematical
strength and useful method outputs, rather than fragmented small tasks.

## Root and evidence

Solve First Proof second-batch prob-006, published at
https://raw.githubusercontent.com/1stproof/batch-2/main/batch-2-raw-outputs/Batch2Problems/problems.json .
For a finite weighted tree, integer diagonal weights and off-diagonal -1 on edges,
assume the lattice form is positive definite and exactly one vertex has weight
smaller than its degree. Prove that at least one vertex cannot split into two
nonzero integral vectors with nonnegative inner product.

R1: retain a first complete attempted proof before consulting the published solution.
R2: discharge the universal implication with a written proof, or retain a concrete
counterexample / exact unresolved inference. Finite searches cannot close R2.
R3: independently implemented bounded finite decomposition search tests the first
argument's claims, then Main checks mathematics and compares the published proof.
R4: deliver one integrated report containing the theorem/result, verification scope,
failures, source exposure, resources and limits of any method-value claim.

## Work envelope and decisions

Main does mathematics and adjudication. One Builder implements a small offline
stdlib checker with rigorous finite search bounds and retains its own report. This
delegation is implementation under Vibecode's Contractor/Builder separation, not a
default mathematical swarm. No fresh solver/reviewer dispatch is authorized by this
charter. No paid API, product/UI/backend/auth/DB/Git/build/install/infra changes.
Only new tip097 math notes/checker/evidence and append-only checkpoints may change.
Keep numerical tests explicitly finite. No claim of Lean verification, official score,
research novelty, independent human review, superiority or equal compute A/B.

The small TIP096 A/B remains CEILING/TIE_PRIMARY_ONLY. Its immutable charter digest
86d21f29b48881d9983d7986f37e32c8a07dea2dc6a2d2da0997415b62745f37 is preserved.
This is new owner routing, not its prohibited posthoc harder replacement. A fair new
solver A/B is not being smuggled into a tool-builder task. The present campaign shows
useful mathematical output and error detection if achieved, not causal advantage.
Public statement seen by Main; published solutions not yet read for this problem.
Other public Epoch solutions were exposed during selection, not used as this target.

## Acceptance and stop

Accept R2 only if every universal inference has a proof or a precisely identified
external theorem with matched assumptions. Main may fix actual gaps within the same
root; source-assisted revisions are labeled, never retroactively first-pass successes.
At hard stop or completion, record SOLVED_WITH_SCOPE / UNRESOLVED / REFUTED as evidence
permits, preserve all attempts and stop. No change of problem to manufacture success.
Checker limits: <=8 vertices, weights <=8, <=60 seconds per invocation, <=8 invocations,
no unbounded brute force; account refused examples. These are maxima, not coverage claims.
No temporary project, new distDir, dependencies, Docker or scratch copy is needed.
