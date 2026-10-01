# TIP-033D: Certified full-exponent target decisions

2026-10-01. P1 local-only continuation of TIP-033C. Contractor delegates
implementation under Vibecode Kit; checkpoint reuses the approved method and
current continuation, no architecture/provider/gate change.

## Scope and requirements

- D01: For the FOUR fixed TIP-033C targets, enumerate every exponent permitted
  by the written bound `3*2^a-1<=p`. For each exponent enumerate all divisors of
  `p+2^j` and `2^j*p+1`, j0..2a+2, retaining only s=2^(a+2)*ell-1, ell odd prime.
  Use BigInt/integer arithmetic, no Number widening or historical cap changes.
- D02: Persist factorizations with exact product checks and replayable recursive
  Lucas primality certificates (complete factorization of q-1; order witness
  for every prime factor, recursively certified down to2). Probable prime or
  heuristic factorization alone cannot mark a complete decision. Discovery may
  use bounded deterministic Pollard-rho/trial arithmetic; checker must verify
  certificates rather than trusting discovery. No external service required.
- D03: Implement TS and separate stdlib Python checkers of the fixed artifact,
  divisor manifests and all resulting positive strict Type II identities.
  Pin source/artifact hashes and bounded replay. Bound discovery to120seconds
  per fixed target, deterministic iteration ceilings; replay<=30seconds,
  output<=256KiB. If discovery cannot finish, retain explicit incomplete status
  and exact unresolved inputs; do NOT infer no hit or complete coverage.
- D04: Unit controls cover products, prime certificate corruption, missing
  entries, scope/exponent drift, witness identity and fail-closed replay.
  Preserve TIP-033C packet/source/pins unchanged; separate prefixed files only.

## Decisions / boundaries

No app/agent integration, UI redesign, DB, worker, paid API, dependency install,
publication, formal/novelty/root promotion, Git commit/push. The written tail is
not itself a computational certificate. A completed target decision covers
ONLY m=2^a*ell with ell odd prime exponent ONE; all-prime coverage is not implied.
Do not edit Contractor docs/handoff/TIP or other Builder files.

Builder report: docs/verification/TIP-033D_CERTIFIED_TAIL_COMPLETION_REPORT.md
with status, D01..04 results, reproducible commands, artifacts/hashes, exact
coverage and uncomputed remainder. Contractor performs independent review.
