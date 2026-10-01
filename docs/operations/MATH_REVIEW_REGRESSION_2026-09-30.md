# Math review regression and per-role model provenance — 2026-09-30

## Scope

The operator-started local script `scripts/operations/math-review-regression.ts`
uses five frozen public fixtures with suite SHA-256
`55e05678bad7daf6abe6cf0a5c88017216d0e902770eb3d83bca3210ac027d31`.
The reviewer receives the contract and attempt, not the fixture's validity
label. The suite is intentionally public and is **not** a blind held-out
benchmark. It does not establish a statistical false-accept rate, IMO score,
formal proof or open-problem progress.

## Local observations

One complete run using requested model `gpt-6-sol` in two fresh contexts:

| Fixture class | Count | Result |
| --- | ---: | --- |
| Valid: even-square and IMO 1988 Q6 Vieta proof | 2 | Both `AI_REVIEWED` |
| Invalid: finite extrapolation, circular proof, false root ordering | 3 | All `INCONCLUSIVE` |

False accepts: **0/3**. False rejects: **0/2**. Total observed input plus
output tokens: **161,101**. Sum of per-case elapsed time: **159,620 ms**.
These are one-run observations, not a reliability estimate. In a separate
selected negative-control run, `gpt-6-sol` (CRITIC) and requested
`gpt-6-astra` (ADVERSARY) both challenged the false root-order inference;
observed input plus output tokens: **32,864**, elapsed **41,032 ms**. These
are requested CLI model identifiers, not independently attested provider
identity. Both use the same subscription/provider lane.

## Integrity and remaining gates

New version-3 review ledgers and new in-cycle `REVIEWED` events bind each
role's requested model and fresh context to the digest. Historical version-1/2
ledgers and events remain readable and unchanged. The browser displays requested model provenance without presenting
it as theorem certification. A private suite preregistered before evaluator
access, repeated runs and cross-provider attestation remain open. A bounded
research portfolio now has local deterministic and integration coverage, but
no observed scientific yield from a live portfolio run. Formalization of an
open-problem lemma and human semantic/publication sign-off remain open. None
is silently promoted by this regression.

Reproduce with `./node_modules/.bin/tsx scripts/operations/math-review-regression.ts`
from the repository root. Use `--repeat=2` or `--repeat=3` for stability runs,
or pass a fixture ID for a bounded smoke test. The script uses local Codex
subscription sign-in, makes no application database writes and does not call a
paid API key.
