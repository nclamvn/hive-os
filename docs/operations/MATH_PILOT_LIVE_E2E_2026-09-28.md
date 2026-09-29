# Local Math Pilot live E2E — 2026-09-28

## Outcome and boundary

The first *new* browser-created case after the typed exact-survey gate completed
one controlled, seven-call Codex-local research round. This is a **method and
finite-computation milestone**, not a solution or a new result for the general
Erdős–Straus conjecture. The same two negative examples were already identified
by earlier local work; the new achievement is that a live, contract-bound cycle
selected the bounded test, passed its source/task gates, retained `COMPUTED`
evidence, and exposed its limits and dissenting AI reviews in the UI.

The tested auxiliary claim was: every prime `n ≡ 1 (mod 840)` admits a positive
decomposition `4/n = 1/x + 1/y + 1/z` with `x=(n+A)/4` for at least one
`A ∈ {3,7,11,…,51}`. The exact interval was `10,000,000 < n ≤ 20,000,000`.
The finite interval contains 3,130 eligible primes. Exactly two have **no
witness in that constrained A-family**: `10,051,441` and `16,467,361`.
The first has a solution at `A=59`; the second at `A=55`. Thus these are not
counterexamples to the original three-unit-fraction equation.

## Browser-to-ledger trace

- Workspace: `mathematics-pilot-lab-156de0`; mission:
  `31943653-4a30-462a-af11-ecd99f9ebfa2`.
- New case: `8c82073e-6034-48d5-91fd-bb1820b02d7a`.
- Frozen contract SHA-256:
  `555cda5887df78d9304a43b928b41c5ea781e72fe66212693f33d045ef3a5fc9`.
- Controlled cycle: `8462c082-19c5-40b0-8729-80d1f587c27a`.
- The initial Codex-local attempt gave a valid factor-pair equivalence but no
  interval survey; independent AI roles marked it inconclusive. Its explicit
  gap became the next research task.
- The planner proposed exactly the 10M–20M, `A≤51` survey. Two source agents
  found no theorem in the partial captured passages that decides this scope;
  the source gate allowed `RESEARCH_ONLY`, not a novelty claim. A distinct
  verifier context accepted the bounded task.
- The deterministic kernel emitted event `COMPUTED` (sequence 12):
  `primeCount=3130`, `failureCount=2`, first failure `n=10051441`, and a
  rescue witness at `A=59`. Its product manifest SHA-256 is
  `3da72cfe52432d6d68c0608da9d105fad1738728180049ccf4dba8a102336d9a`.
- The solver labeled its output `COUNTEREXAMPLE_ATTEMPT`; both subsequent AI
  peer reviews remained `INCONCLUSIVE`, requesting per-A exclusion certificates
  rather than accepting only a count/digest. This is an important evidence-
  presentation gap, not a reason to discard the exact computation or to claim
  theorem acceptance.
- The cycle stopped at its declared one-round/seven-call limit, with 127,140
  observed Codex-session tokens against the 120,000 threshold. The threshold
  is checked *between* calls and may be exceeded by the final call. Final
  event-chain digest:
  `c561ecfe6a79bb61153d0e4a048d3f26b17ff386259f3bc2f6e313060cb4da30`.

## Independent arithmetic audit

The separate stdlib-only Python implementation re-enumerates the residue-class
primes, factors each candidate first denominator, and checks the exact
factor-pair condition. It does not import the product's TypeScript survey:

```sh
python3 scripts/operations/verify-residual-interval-independent.py \
  --lower-exclusive=10000000 --upper-inclusive=20000000 --max-a=51
python3 scripts/operations/verify-residual-counterexample.py 10051441 --max-a=59
python3 scripts/operations/verify-residual-counterexample.py 16467361 --max-a=59
```

The first command independently returns 3,130 eligible primes and exactly
`[10051441, 16467361]` as failures through `A=51`; its differently encoded
manifest SHA-256 is
`dedc1852ec60f4386d786f956985abe196110e082db06d6cc2f713ad6adbc4d6`.
The other two commands verify primality by trial division, enumerate admissible
factor pairs for each allowed A, find none through 51, and verify an exact
positive-integer identity for the first successful A (59 and 55 respectively).

## Acceptance status and next gate

This E2E proves the local orchestration path runs from browser case creation
through AI decomposition, source screening, independent-context task check,
deterministic bounded computation, model attempt, adversarial AI review, and
safe stop with an intact ledger. It does **not** prove the unbounded auxiliary
claim, the general conjecture, mathematical novelty, or independent-model
agreement. The critical next product improvement is to retain and present a
machine-checkable per-A exclusion certificate to the reviewers and human
reader, instead of only the first failure/count/manifest. Any theorem-level
milestone still requires a universal argument and independent expert or formal
verification.

UI: [local mathematics pilot](http://localhost:3000/w/mathematics-pilot-lab-156de0/research/math-pilot?missionId=31943653-4a30-462a-af11-ecd99f9ebfa2)

Screenshot: `artifacts/math-pilot-e2e-2026-09-28.jpg`.
