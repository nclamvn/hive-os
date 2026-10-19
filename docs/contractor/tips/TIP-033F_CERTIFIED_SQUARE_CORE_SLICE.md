# TIP-033F: Certified square-odd-core slice and finite bound

2026-10-01. P1 bounded local research; depends on D and the written
MATH_PILOT_NORMALIZED_CORE_FINITE_BOUND_2026-10-01 derivation. Parallel to E,
not a change to D/E scope or an authorization for a live LLM campaign.

## Requirements

- F01: Implement exact BigInt finite normalized-core bound for p>=2 using
  T0=floor(p/4)+1, floor(T0*(T0+1)/(4T0-p)). Test residual constants, sharp
  p3mod4 controls and independent finite normalized-pair checks.
- F02: Predeclared FOUR D targets, ONLY b=2 and a=1..4, ell odd prime,
  m=2^a*ell^2. NO ell/s ceiling. Exact image is pure-two interval plus
  `-ell*2^t`, -a<=t<=2a+2. Necessary translated candidate factors:
  C*p^2-2^(2t) (t>=0); C*(2^j*p)^2-1 (t=-j<0), C=2^(a+2).
  Include the pure-two windows (D criterion factor tables may be reused).
  Enumerate all divisor candidates and require s+1=C*ell^2, certified ell
  prime and ORIGINAL normalized congruence. Raised congruence alone is NOT
  sufficient, particularly for composite s. Apply the finite bound honestly.
- F03: Bounded discovery <=120s per target and deterministic arithmetic
  iteration limits; recursive exact Lucas prime/product certificate artifact.
  COMPLETE only if every declared factor/candidate is certified. Real timeout
  at any phase retains explicit PARTIAL with exact unresolved input/phase.
  TS and independent stdlib Python verify the new artifact, original
  normalized pair condition and all strict Type II tuples. Fixed source/data
  pins, replay <=30s, output<=256KiB. Existing D sources/artifact unchanged.
- F04: Corruption/missing-factor/scope/false-root/replay tests. Explicit
  UNCOMPUTED higher a/b in output. No whole b2/all-core exclusion claim.
  Report bounded results even if discovery legitimately remains PARTIAL.

## Acceptance

Both implementations agree on exact decisions/witnesses for certified slice
entries. Unresolved factorization or interrupted discovery never becomes a
negative result. Empty COMPLETE means no hit in EXACT declared slice only.
General finite bound does not imply computational completeness or success.

## Constraints and decisions

Standalone modules/scripts/tests, not UI/app/agent integration or migration.
No external factor services, API/provider calls, dependency installations,
historical changes, theorem/novelty promotion, Git or deployment. Reuse pure
arithmetic infrastructure if useful; report shared components and independence
limits. Do not edit E files, handoff, Contractor docs/manifests. Own report:
`docs/verification/TIP-033F_SQUARE_CORE_COMPLETION_REPORT.md`.
Contractor chose this small slice rather than promise the infeasible full
finite a/b search. Existing research queue remains disabled.
