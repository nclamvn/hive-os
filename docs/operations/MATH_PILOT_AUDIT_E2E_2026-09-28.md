# Math Pilot per-A audit browser E2E — 2026-09-28

## Outcome

An authenticated browser submission created a new OPEN case and one Codex-local
controlled cycle. The contract declared an exploratory interval but not the
candidate prime or result. The planner selected the exact interval survey;
source agents permitted bounded research only; the task verifier accepted;
the product computed a survey and new per-A arithmetic audit before the solver
and two peer-review calls.

- Browser: <http://localhost:3000/w/mathematics-pilot-lab-156de0/research/math-pilot?missionId=31943653-4a30-462a-af11-ecd99f9ebfa2>
- Case `5ff82930-d543-4faf-8814-ff9b26737ba7`; contract digest
  `f6a36195c851abf29c73125087b4033eec7e5034744696f82e139b4b9c526c98`.
- Cycle `9147f53f-d7c1-4aba-b149-ead0d9e7c72c`, `STOPPED / ROUND_LIMIT`;
  one completed round, 7/7 model calls, 21 append-only events, final digest
  `a8899ce767838540f95550b99ebc4407210ee2cecfd53a25ea391fdc3d8427ac`.
- Observed Codex-session tokens: 133,038 against a 120,000 between-call
  threshold. This is not API-USD accounting or a hard mid-call stop.
- Product survey: 5,483 primes `160,000,000 < p ≤ 180,000,000`,
  `p ≡ 1 (mod 840)`; one failure for `A=3,7,...,59`, at `p=171,348,241`.
  `A=63` has an exact positive-integer rescue tuple. Survey manifest digest:
  `7e7f6fbbf624306116b9cbfc6dad7e6ba5ad107400cafed591f3fc35a6aa8f4a`.
- The new audit retains primality trial limit `⌊√p⌋=13090`, factorization of
  each `x=(p+A)/4`, the complete factor-pair count for all 15 A values and
  zero admissible pairs in each row. It is recomputed when validating the
  event trace, not trusted merely because a digest matches. Historical V2
  events without this optional audit remain readable and unchanged. This live
  cycle used V2 with the added audit. After the run, the next-write format was
  advanced to V3, which requires an audit whenever it records a first failure
  and rejects audit-stripping; V3 has passed tests but has not had a separate
  live browser cycle.
- An independent stdlib-only Python interval checker reproduced 5,483/1 and
  the same prime. Its manifest is
  `9e86abcc3480fb80cfc5bb85dcdd4ff46c0c71fbfbacd17b3f5eb7b54a331625`.
  A separate factor-pair checker matched every one of the 15 pair counts.
- Browser screenshot: `artifacts/math-pilot-audit-e2e-2026-09-28.jpg`.

## Scientific disposition and next gap

Both fresh AI reviewers returned `INCONCLUSIVE`. They recognized the
candidate's residue, algebraic divisor criterion, and all 15 audit rows, but
their tool-free contexts could not independently execute trial division and
congruence tests. Their objection concerns the *review procedure*, not
evidence that the candidate is composite or that a listed pair succeeds.
The external Python checker supplies a separate finite reproduction; those
AI reviewers did not invoke it. A later iteration should give a separate
verifier an executable, digest-bound, read-only replay tool and retain its
result before asking AI to classify a finite counterexample. The verifier
must not rewrite an immutable survey. A passing finite check would not
certify the unbounded Erdős–Straus conjecture or literature novelty.

## Verification

`npx vitest run tests/unit/math-certificates.test.ts tests/unit/math-cycle.test.ts tests/integration/math-pilot.test.ts`:
23 passed. `npm run typecheck`, `npm run lint`, and `npm run build` passed.
Trace tests reject a tampered per-A count even with a recomputed ledger digest
and the V3 audit-stripping downgrade, while accepting a historical V2 event
without the optional audit. No paid API,
billing change, deployment, commit or push was performed.
