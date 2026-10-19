# TIP-097 Builder completion report

STATUS: DONE for the finite checker implementation / R3 tool deliverable. Universal
R2 is outside the Builder role and is not established by this report.

Bound to FIRST_PROOF_WEIGHTED_TREE_097, PUBLIC_PROBLEM_SOLVING, and the approved
TIP-097 envelope. Vibecode Contractor/Builder separation was used: Main supplies
mathematical claims and adjudicates the theorem; Builder implemented an offline
independent exact finite checker. No solution source was read by Builder.

## Files created

- `check_weighted_tree.py`: one stdlib-only Python checker and focused controls.
- `checker_self_test_output.json`: actual final self-test stdout, complete.
- `checker_candidate_output.json`: actual final fixed-family stdout, complete.
- `BUILDER_CHECKER_REPORT.md`: this report, including failed-run history.

No existing product, runtime, authentication, DB, package, Next.js or evidence
files were modified. No dependencies, builds, whole-project copies, scratch
directories, distDir, venv, Docker artifacts or installs were made. Nothing was
removed; no cleanup was necessary. Existing unrelated dirty-worktree files were
left alone. No agent, network, paid API, source lookup, Git commit or push.

## Why the finite search is complete

Fix a vertex `u`, standard basis vector `e`, integral `a`, and `b=e-a`.
The integer identity is

`(2a-e)^T Q (2a-e) = w_u - 4 a^T Q b`.

Thus a candidate decomposition with nonnegative inner product lies in the exact
ellipsoid `t^TQt <= w_u`, where `t=2a-e`. In the positive-definite `Q` inner
product, Cauchy-Schwarz applied to `t` and `Q^{-1}e_i` gives

`t_i^2 <= (t^TQt)(Q^{-1})_ii <= w_u(Q^{-1})_ii`.

Compute the rational inverse exactly and let
`r_i = floor(sqrt(w_u(Q^{-1})_ii))`. The code obtains this via integer square root
of the floor of the nonnegative rational. Every admissible `a` is in the box

`ceil((e_i-r_i)/2) <= a_i <= floor((e_i+r_i)/2)`.

Every integral box point is enumerated. The exact quadratic identity is tested;
`a=0` and `b=0` are excluded. Complete ordered-decomposition counts are reported,
with at most four displayed witnesses per vertex. Witness-display truncation does
not truncate the actual search. `a` and `b` are distinguished as ordered pairs.

Connectedness, edge uniqueness and acyclicity are checked. Unique bad vertex is
mandatory in normal mode; `--allow-nonroot` is explicitly for mechanics controls.
Positive definiteness is checked both by exact LDL with reconstruction and by
exact independent leading-principal determinant calculations. Gauss-Jordan inverse
is independently checked by exact multiplication `Q Q^{-1}=I`.

More than eight vertices, weights outside 1..8, or total box work exceeding one
million points is refused before search. Work limits can only be lowered. CLI
invocations have a 55-second alarm, below the authorized 60-second maximum. A
refused or interrupted invocation supplies no completeness claim. The fixed
sample has a bounded explicit set, not random or unbounded adaptive search.

## Actual command history and failures

All commands were run from `/Users/os/hiveos` using `python3 -B`, without installing
anything or producing bytecode. Six checker invocations used (ceiling eight):

1. `python3 -B artifacts/research/tip097/check_weighted_tree.py --self-test`
   returned exit2, stdout
   `{"status":"REFUSED_NO_COMPLETENESS_CLAIM","reason":"NOT_POSITIVE_DEFINITE","seconds":0.0023130409826990217}`.
   Builder had mislabeled chain weights `[3,1,2,2]` as PD. Its determinant is zero.
   This was a fixture error, not a checker counterexample to the theorem. Changed
   that positive fixture to `[4,1,2,2]`; the failed history remains here.
2. Same command, after that correction: exit0, 20 controls PASS,
   elapsed0.003859209013171494 seconds. This predates Main's new star control.
3. `python3 -B artifacts/research/tip097/check_weighted_tree.py --weights '[2,1,3,3]' --edges '[[0,1],[0,2],[0,3]]'`
   exit0, elapsed0.0005944170115981251 seconds, complete44 box points;
   root reducible, leaf1 the sole irreducible vertex.
4. `python3 -B artifacts/research/tip097/check_weighted_tree.py --candidate-sample`
   exit0, elapsed0.19113920797826722 seconds;187 generated cases,160 complete,
   27 non-PD refusals,7438 box points, zero candidate counterexamples. The tool's
   displayed long stdout was truncated; no mathematical count depends on that
   display. Invocation6 preserved a full replay instead.
5. Final `--self-test`: exit0,21 controls PASS, actual complete stdout retained in
   `checker_self_test_output.json` (elapsed in that file).
6. Final `--candidate-sample`: exit0,elapsed0.19436583400238305 seconds,
   actual complete stdout retained in `checker_candidate_output.json`.

A separate read-only `ast.parse` and JSON parse of both retained files PASS.
That command did not invoke the checker or perform mathematical search. Its
actual summary stdout was:

```text
syntax PASS
self-test 21
sample {'generated_cases': 187, 'complete_count': 160, 'refused_count': 27, 'complete_box_points': 7438}
sample counterexamples 0
self-test box points 452
```

## Final controls and exact coverage

Ten complete examples cover452 box points in the final self-test. Six are
root-admissible; four are intentionally nonroot mechanics controls.

| Example | Weights / topology | Box points | Irreducible vertices (0-based) |
| --- | --- | ---: | --- |
| reducible control | `[1,2]`, edge | 8 | 0 |
| norm1 control | `[1]`, singleton | 2 | 0 |
| norm2 control | `[2]`, singleton | 2 | 0 |
| A2 control | `[2,2]`, edge | 4 | 0,1 |
| chain213 | `[2,1,3]`, chain | 38 | 1 |
| star2/222 | `[2,2,2,2]`, center0 star | 20 | 0,1,2,3 |
| star2/234 | `[2,2,3,4]`, center0 star | 12 | 0,1,2,3 |
| star3/3333 | `[3,3,3,3,3]`, center0 star | 10 | 0,1,2,3,4 |
| chain4122 | `[4,1,2,2]`, chain | 312 | 1 |
| bad-root negative control | `[2,1,3,3]`, center0 star | 44 | 1 |

Ten negative controls PASS: semidefinite and indefinite matrix, zero bad vertices,
two bad vertices, disconnected graph, cycle, duplicate edge, oversized weight,
oversized vertex count, and complete-work refusal. One separate direct mechanics
identity check PASS. Total final engineering controls21, not21 mathematical
theorems. Replays are not added to distinct coverage.

## Candidate claims and counterexamples

Main's stronger intermediate claim that the unique bad vertex itself is always
irreducible is FALSE. For the PD star `[2,1,3,3]`, leading principal minors are
`2,1,2,3`, root0 is uniquely bad, and

`e0 = (1,1,0,0) + (0,-1,0,0)`

has norms1 and1 and inner product0. The finite checker found both ordered
orientations. The norm1 leaf still supplies the original theorem conclusion;
this is not a counterexample to that theorem. Main supplied this failed-route
example before Builder tested it.

Binary subset search is not generally sufficient: admissible chain `[2,1,3]`
has decomposition of `e2` with `a=(-1,-2,0)`, `b=(1,2,1)`, inner0, norms2 and1.
Likewise `[1,2]` shows a norm2 basis vector can be reducible. Irreducibility of
the one-dimensional norm2 control is not a blanket norm2 criterion.

Main's narrower candidate, “if every weight is at least2, the unique bad vertex
is irreducible,” remains UNPROVED by this computation. Fixed sample families:

- 4-node stars, center2 and each labeled leaf in2..4:27 cases.
- 5-node stars, center2 or3 and each labeled leaf in2..3:32 cases.
- 6-node stars, center2..4 and each labeled leaf in2..3:96 cases.
- 6-node tree edges `01,12,03,34,05`, root2 and each other weight in2..3:32 cases.

Total187 labeled inputs;160 complete positive-definite/root-admissible cases,
27 non-PD refusals,7438 complete coordinate-box points, zero counterexamples to
the narrower claim. All160 also have at least one irreducible basis vertex.
Vertex relabelings and overlap with self-test are not independent new theorem
coverage. This is not all weighted trees up to six/eight vertices, nor any
universal certification. Exact refusal inputs are retained in the JSON.

ISSUES: no implementation failure currently identified. Universal mathematical
closure, external solution comparison and integrated disposition belong to Main.
DEVIATIONS: corrected one erroneous positive fixture; added Main's requested
failed-route control and fixed finite candidate sample within the original envelope.
SUGGESTION: use the inverse-coordinate-bound proof as the finite completeness
justification; do not describe the sample as an unrestricted brute-force check.

## Append-only Main-requested final-proof controls

Main subsequently disclosed published-source exposure and asked for controls of
the source-assisted final proof. Builder did not consult that source and added
implementation controls from Main's mathematical specification only. Old JSON
outputs above remain unchanged: their unproved-candidate wording is historical.

Added `theorem_assisted_choice(weights, edges)`: validate source tree, unique bad
vertex and exact positive definiteness, then select the first weight1 vertex if
any (`NORM_ONE`), otherwise the unique bad vertex (`ONE_BAD_TREE_DUAL_LEMMA`). Its
return labels this as source-assisted mathematical selection and explicitly sets
machine-certified universal theorem to false. Existing root-admissible self-test
and fixed sample now cross-check the selection against complete decompositions.

Added `forest_controls()` in the SAME script. Four tiny source trees: singleton
weight2; path weights2,2; path3,2,2 distinguished endpoint0; three-vertex star
center3/leaves2 distinguished center0. Build an apex graph with exactly
`w_i-degree(i)` labeled parallel ground edges. Check `B=C^T C`; enumerate all
spanning trees and all two-component spanning forests; compare exact determinant
and tree count, `tau_e/tau` and inverse diagonal, and the scalar forest-sum
identity against the rational inverse for every `z` in `{-1,0,1}^n`.

For each spanning tree containing the distinguished edge and each such `z` with
nonzero distinguished coordinate, deterministically delete the lowest-labeled
incident edge with nonzero extended component sum. Check the sum is nonzero,
the result is a two-component forest, the prescribed recovery reconstructs the
actual deleted edge/tree, and no two trees collide for that fixed `z`. Ground
coordinate is `-sum(z)`. Recovery with the distinguished edge retained explicitly
checks uniqueness of the original-tree edge from `s` into the other component.

Cap these helpers at source vertices<=4, labeled apex edges<=10. Thus at most
`2^10=1024` possible labeled edge subsets and `3^4=81` integer test vectors per
graph; only subset sizes `n` and `n-1` are actually enumerated. Supplied controls
have<=3 source vertices and<=6 apex edges. This is small finite enumeration, not
a universal proof of the forest identity, injection, or branch lemma.

Concrete source-cycle negative control is encoded: original triangle labeled
edges `0=01,1=12,2=02`, apex edge `3=0-ground`, `s=0`, `z=(1,1,0)`. Distinct trees
`{0,1,3}` and `{1,2,3}` select cuts0 and2, both component sums1, yielding the same
forest `{1,3}`. Thus source-tree-specific injection fails without that premise.
This is not claimed to refute the general scalar forest identity.

Builder has NOT EXECUTED these additions, per Main's instruction to preserve the
remaining two checker invocations for Main. Read-only `ast.parse` PASS after both
patches; no checker functions executed. Consequently the previously executed
21-control pass remains valid only for the historical code snapshot. Final
`--self-test` is expected to check26 distinct controls (prior21 plus four forest
graphs plus one cycle negative control), but this is an expectation, not a pass
claim. Main must record actual final invocation7/8 results separately without
overwriting the historical JSON outputs. Builder checker invocation count remains6.
