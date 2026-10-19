# TIP-033E: Certified aggregate odd-part window

2026-10-01. P1 local research continuation, depends on TIP-033D.
Vibecode Kit v6.2: Contractor specifies scope, Builder implements, independent
skeptic and Contractor verify. Small additive diagnostic; existing architecture
and gates unchanged, no new Blueprint approval required.

## Requirements / scope

- E01: FOUR fixed D targets; `m=2^a*q`, q>=3 odd (prime OR composite).
  Restrict normalized ratios to `2^f*q^g`, f in[-a,a], g in{-1,0,1}.
  This is an aggregate-block subfamily, NOT all divisors of composite q.
  Prove/declare pure-two image `-2^t`, |t|<=2a+2, and cutoff
  `3*2^a-1<=p`. Reuse D's immutable fully certified factor artifact to
  enumerate every qualifying q, without its prime-only filter.
- E02: New method/version/scope/output digest, TS check and separately
  implemented stdlib Python replay. D artifact/source/pins must remain intact.
  Verify Lucas/product certificates and exact criterion enumeration, normalized
  coprimality, identity, strict distinct denominators, exactly two p-divisible
  denominators. Report candidate/core witnesses and distinct tuple count
  separately; report which q are composite using certified factors.
- E03: Fixed source/artifact pin, bounded isolated replay <=30s, output<=256KiB.
  No arbitrary paths/model code. Invalid/missing/divisor-scope drift fail closed.
- E04: Regressions for composite q, prime compatibility with D, corruption,
  omission, scope/tail drift, no silent general-core promotion. Completion
  report maps E01..04, reproducible CLI, exact counts/hashes and open remainder.

## Acceptance

Given unchanged certified D inputs, both independently regenerate every
aggregate-block hit and strict witness at all allowed a and agree canonically.
Given q composite, its partial prime divisors are never included as g blocks.
Given corrupt/missing certificates or replay mismatch, no COMPLETE/PASS.

## Constraints

New prefixed files only except necessary test registration. No DB, app/UI,
worker, provider, dependency, historical evidence, root/theorem/novelty
promotion, Git or deployment. Do not edit other Builder files, handoff,
Contractor manifest/TIP or founding package. Builder owns completion report
`docs/verification/TIP-033E_AGGREGATE_CORE_COMPLETION_REPORT.md`.
