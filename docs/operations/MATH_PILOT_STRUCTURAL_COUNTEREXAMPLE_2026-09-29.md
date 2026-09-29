# Structural counterexample in-loop replay — 2026-09-29

## Scope and mathematical distinction

The residual-prime root asks whether every prime `p ≡ 1 (mod 840)` has a
positive Erdős–Straus decomposition. The local fixed-first-denominator family
uses `x=(p+A)/4`, `A=3,7,11,...`. Failure through a finite A is **not** a
counterexample to the root equation. The previous proposed implication from
square `x_3` and failed A=3,7 to success at A=11 is false: `p=131041` meets
the premises and fails A=11. This finding was checked outside its original
cycle, whose historical `INCONCLUSIVE`/`TOKEN_LIMIT` ledger is unchanged.

## New admission path

- A solver claiming a structural counterexample must return typed
  `{prime, failedThroughA}`. A human can also seed that same typed pair for a
  later target A before planning.
- The TypeScript gate checks residual-prime primality and exact factor-pair
  exclusion at every A from 3 through the stated bound. A separate pinned
  stdlib Python script recomputes the full audit. The cycle stores scope,
  per-A counts, square/divisor flags, script/output digests, and a report
  digest as `COUNTEREXAMPLE_REPLAY` or `PRIOR_COUNTEREXAMPLE_REPLAY`.
- A failed replay or missing/mismatched typed candidate stops before the AI
  critic/adversary. A PASS precedes any AI conclusion; it proves only that
  finite first-denominator exclusion, not the natural-language premises,
  a universal theorem, or novelty.
- Historical events remain immutable. New traces validate event ordering and
  digest bindings; old traces do not acquire invented certificates.

The automated tests include PASS for `p=131041, A≤11`, FAIL for the false
`p=131041, A≤23` claim (it succeeds at A=23), event-order and tamper cases,
and an integration check that the planner receives the verified facts only
after `PRIOR_COUNTEREXAMPLE_REPLAY`.

## Browser campaign

The authenticated Math Pilot UI launched cycle
`76075d43-9abb-4130-a8ba-d1320093c6aa` with target A=23 and seed
`{prime:131041, failedThroughA:11}`. The operator directive explicitly
forbids reusing the square/two-gate ⇒ A=11 implication and asks for a
different cross-gate survivor-class hypothesis. The live ledger recorded
`HUMAN_STEERED` (1), `PRIOR_FINDINGS` (2), `PRIOR_ART` (3),
`PRIOR_COUNTEREXAMPLE_REPLAY` PASS (4), and only then `CALL_STARTED` for the
planner (5). The independently replayed A≤47 failure at `p=10051441` remains
another finite constraint. No universal result follows from either prime.

The planner proposed a different but inadequate prime-power condition on
`x_3=(p+3)/4`, combined only with A=3/A=7 obstruction. The independent task
verifier rejected it because it omitted the A=11,15,19 survivor gates required
by the approved A=23 direction. The sealed cycle stopped at
`VERIFICATION_REJECTED` after four model calls and 83,663 observed Codex
subscription-session tokens, before solver and peer review. This is a correct
research gate outcome, **not** a mathematical milestone.

The admission rule now requires every intervening gate between a verified
replay seed and a later structural target to appear explicitly in the new
task; planner and verifier prompts state the same scope. This guards against
merely renaming the disproved early-gate premise. It does not automate the
mathematical truth or novelty assessment.

A second authenticated browser campaign, cycle
`594819fe-309a-4dca-b329-750dcdc26370`, replayed the same seed before
planning. This time the planner specified all five obstructions A=3,7,11,15,19
and a conditional relation between divisors of `x_15`, `x_19` and success at
A=23. The separate task verifier accepted it only as a bounded falsifiable
attempt; it explicitly left the complete premise instance, implication truth,
and external novelty unverified.

The solver returned `PARTIAL`, not a proof or a typed counterexample. It
examined `p=2521`, proved the five early gates obstructed, and gave a checked
A=23 solution `(x,y,z)=(636,69748,131876031)`. The exact-identity checker
recorded PASS, but `p=2521` lacks the hypothesis's two divisor-residue
conditions and therefore is **not** an instance of the complete premise.
The critic agreed and returned `INCONCLUSIVE`. The cycle then stopped at
`TOKEN_LIMIT` (6/7 calls, 126,581 observed subscription-session tokens against
the confirmed 120,000 threshold); adversary review was not dispatched. The
one-call overrun reflects the documented check-before-next-call rule, not an
unbounded run. The conditional lemma remains open and novelty unverified.

A separate fixed-tool audit of `p=131041` shows all five early gates fail and
A=23 succeeds. Integer checks also show `8191 | x_15=32764` with
`8191 ≡ 3 (mod 23)`, `6553 | x_19=32765` with `6553 ≡ 21 (mod 23)`, and
`23 ∤ x_19`. Thus this prime is a finite complete-premise *instance* for the
new conditional, but these extra A=15,19,23 checks were made outside the
sealed second cycle and do not alter its `INCONCLUSIVE` review. This exposes a
specific next method improvement: make the pre-planner certificate carry a
typed, independently replayed full gate dossier through the target, including
the first success and cross-gate divisor facts, so the agents cannot overlook
an already available premise instance. No general theorem follows.
