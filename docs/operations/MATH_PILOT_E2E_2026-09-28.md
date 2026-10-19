# Math Pilot browser E2E — 2026-09-28

Scope: local Codex subscription bridge, not the paid OpenAI API. The live browser mission is
`31943653-4a30-462a-af11-ecd99f9ebfa2` in workspace `mathematics-pilot-lab-156de0`.
Both calibration cases had passed before the OPEN cases below. These are audit notes, not
a claim to have proved or advanced the full Erdős–Straus conjecture.

## Runs and decisions

1. Broad root case `a2a2cb4f-9ee9-4832-85d2-7b1900c257f0` asked for all integers
   `n >= 2`. Its model attempt gave standard elementary families and AI review was
   inconclusive. Cycle `4e545439-30d9-4a39-9c90-397a2b0eedb7` completed one round
   (7/7 calls; 120,509 observed tokens) and stopped at `ROUND_LIMIT`; final ledger
   digest `ffdc0a678dba46c235fe41b0d09096f99ccc2015f549fefb979ec32994417284`.
   It proposed `n=120k+97`; that class is `2 (mod 5)` and already covered by
   [López (2024)](https://arxiv.org/html/2404.01508v3). The old solver task also
   dropped the hypothesis, so its objection at `n=2` addressed the wrong domain.
   The sealed subtask now includes both hypothesis and task, and the current UI
   marks this historical overlap without editing the immutable ledger.

2. Focused root case `630df90b-0e4d-490e-b9d1-fabcdd9fd4d1` asked only for prime
   `n ≡ 1 (mod 840)`. Its conditional `A=3` construction is valid, but already
   Proposition 4.2 of [Bhattacharjee (2026), an author-uploaded preprint](https://www.researchgate.net/publication/405220221_Erdos--Straus_Decompositions).
   AI review retained the missing condition, not a proof of the root conjecture.
   Cycle `4140679a-1d08-4af1-b6ee-eb9f4892b11d` proposed the `A=7` conditional
   construction; this is Proposition 4.4(i) in the same preprint. Its two source
   reviewers disagreed on quantifier classification, so the gate stopped it as
   `FRONTIER_HOLD` before solver dispatch (3/7 calls; 58,424 observed tokens).
   The retained final digest is
   `6a08b36dfaf5e007243bf4f3ef774fcfdb7effdccd25615992e0bceba44b5301`.
   The current UI flags Proposition 4.4 retrospectively; the captured six-passage
   dossier and historical decision remain unchanged.

## Exact finite certificates

All equalities here were rechecked with integer arithmetic, not floating point.
For a tuple `(n,x,y,z)`, test `4xyz = n(xy+xz+yz)` with positive integers.
Trial division confirms the three displayed `n` values are prime, and each is
`1 (mod 840)`. These finite witnesses do not prove a universal statement or novelty.

| n | x | y | z | Role |
| ---: | ---: | ---: | ---: | --- |
| 3361 | 841 | 942210 | 91836266490 | Model's `A=3` conditional example |
| 2521 | 636 | 69748 | 131876031 | Independent local search after AI found first-gate failure |
| 14281 | 3572 | 7287393 | 19565396773404 | Source challenger found `A=7` conditional example |

For `n=2521`, the first denominator `x=636` has `A=4x-n=23`, `B=nx=1603356`;
the certificate divisor pair is `d=848`, `e=3031545357`, with `de=B²` and
`y=(B+d)/A=69748`, `z=(B+e)/A=131876031`. This verifies the exact decomposition.
It is a single solved input, not a counterexample or new infinite family.

## What this test validates and does not

- The browser, durable queue, local model attempts, separate AI review roles,
  controlled cycle, source dossier, integrity ledger, and fail-closed source gate
  operated on live local state without paid API dispatch.
- An adversary found that the first conditional method does not cover `n=2521`;
  exact arithmetic then produced a valid triple for that input. A failed method
  was not mislabeled a counterexample to the conjecture.
- A bounded static excerpt corpus was not adequate to detect Proposition 4.4
  before the second cycle. The catalog now includes both conditional criteria
  and the general divisor-residue lemma, but this still is not an exhaustive
  prior-art search or a mathematical novelty certificate.
- No new theorem or full solution was obtained. The next research-grade gate
  needs proposal-specific retrieval of primary full text and a checkable
  certificate pipeline before any novelty or proof claim can be considered.
