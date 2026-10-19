# A=23 structural deepening — local arithmetic and agent-loop evidence

Status: exact finite refutation of two proposed *auxiliary* implications. No
claim about a counterexample to Erdős–Straus, an unbounded theorem, or novelty.

## In-loop method

An operator-seeded residual prime is now checked before the planner as a
`PRIOR_COUNTEREXAMPLE_REPLAY`. When its first success is exactly the selected
later A gate, a separate `PRIOR_GATE_DOSSIER` carries every intervening failed
gate, the factorization of each first denominator, and an exact target witness.
The TypeScript enumerator and pinned stdlib Python program must agree on each
failed gate and the first successful A before the dossier enters the
append-only ledger; each target witness is checked by exact integer identity.
Planner, task verifier, solver,
critic, and adversary receive the same finite evidence; ledger reads recompute
the TypeScript audit and exact witness. Historical cycles remain unchanged.

Cycle `28a2b908-493f-4d2a-b462-7e641f9a2162` sealed the dossier for
`p=131041`: no admissible pair at A=3,7,11,15,19; first success A=23 with
`x=32766`. This is a *premise instance*, not proof of a conditional. The
observed-token threshold was raised from 120,000 to 200,000 for this local
seven-call campaign, with the database constraint migrated accordingly. The
hard call count, per-call timeout, and 50-minute deadline are unchanged; the
token threshold remains check-before-next-call, not a USD ceiling.
The authenticated browser run completed all seven calls and both review roles:
`STOPPED / ROUND_LIMIT`, one closed round, 138,626 observed Codex-session
tokens, final conclusion `INCONCLUSIVE`. The full dossier is visible in the
local Math Pilot UI. It is a product E2E closure, not scientific acceptance.

## Refutation of the previous x15/x19 conditional

The prior planner proposed: for every prime `p≡1 (mod 840)`, if A=3,7,11,15,19
all fail, `23∤x19`, `x15` has a divisor `3 (mod 23)`, and `x19` has a divisor
`21 (mod 23)`, then A=23 succeeds. This implication is false.

Take `p=4037881`. The independent Python auditor proves primality by trial
division, verifies `p≡1 (mod 840)`, and exhausts every factor pair of `(pxA)^2`
for A=3,7,11,15,19,23. All six gates have zero admissible pairs. Also:

- `x15=1009474`, and `739|x15` with `739≡3 (mod 23)`.
- `x19=1009475`, and `1355|x19` with `1355≡21 (mod 23)`.
- `x19≡5 (mod 23)`, so `23∤x19`.
- The first success in this fixed-denominator family is A=27. It has an exact
  Erdős–Straus decomposition, so this is not a counterexample to the root.

There is also a compact modular exclusion certificate. Here `p≡1 (mod A)`
for all six tested gates. With `B=pxA`, a factor-pair solution requires a
divisor of `B²` congruent to `−B (mod A)`. The complete divisor residue sets
below omit the required residue in every row:

| A | factorization of `xA` | required residue | divisor residues of `(pxA)²` modulo A |
|---:|---|---:|---|
| 3 | `37·27283` | 2 | `{1}` |
| 7 | `2^6·15773` | 5 | `{1,2,4}` |
| 11 | `3·336491` | 8 | `{1,3,9}` |
| 15 | `2·683·739` | 11 | `{1,2,4,8}` |
| 19 | `5²·149·271` | 14 | `{1,4,5,6,7,9,11,16,17}` |
| 23 | `2²·3³·13·719` | 17 | `{1,2,3,4,6,8,9,12,13,16,18}` |

The product's exact enumerator and the separate Python auditor agree on all
six zero counts. A bounded exploratory scan of all 30,061 eligible primes
through `10^8` found 42 complete-premise instances and seven A=23 failures.
The independent Python auditor separately replayed the seven failures and
their divisor conditions at `p=4037881,19333441,21922321,52111921,72173641,96522721,99801241`.
These finite counts are diagnostic, not an unbounded density statement.

## Refutation of the current planner's residue implication

The new cycle's planner proposed a different implication: among five-gate
survivors, obstruction at A=23 forces `p≡4 (mod 23)`. The same `p=4037881`
has `p≡1 (mod 23)` and all six gates obstructed, so this implication is also
false. The separate task verifier accepted the proposal for exploration,
but the solver only reconstructed the already-sealed `p=131041` A=23 witness.
Critic and adversary both returned `INCONCLUSIVE`; neither found the finite
refutation because neither could execute a proposal-time search. This
outside-cycle check must **not** rewrite their sealed verdict.

## Reproduction and boundary

`python3 scripts/operations/verify-residual-counterexample.py 4037881 --max-a=23`

`python3 scripts/operations/verify-residual-counterexample.py 4037881 --max-a=27`

`npx vitest run --project unit tests/unit/math-structural-counterexample.test.ts`

The logical next improvement is a typed, bounded *proposal-time falsification
probe* before task acceptance. The current general-language planner can propose
an implication contradicted by a small residual prime not yet in the sealed
planning memory. A probe must never infer an unbounded theorem from a search;
it can, however, reject an exact typed conditional with a checked finite
counterexample before spending solver and reviewer calls.
