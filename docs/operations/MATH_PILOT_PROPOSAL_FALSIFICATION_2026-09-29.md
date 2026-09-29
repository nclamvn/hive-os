# Math Pilot proposal-time structural falsification (local)

## Why this gate exists

The prior A=23 browser cycle spent seven model calls before two precise, universal-looking structural implications were checked against small primes. One was false already at `p=99961`; the conditional with cross-gate divisor premises was false at `p=4037881`. The old solver-time counterexample replay could not stop an invalid *proposal* before source review or task verification.

## New bounded procedure

The planner's new, typed `structuralProbePlan` is the exact machine-tested conditional. It supports two predicates over primes `p≡1 (mod 840)`: earlier first-denominator gates force the next gate to open, or failure through a gate forces a specified prime residue. Optional, bounded divisor and non-multiple premises bind to explicit `x_A=(p+A)/4` values. The fixed tool searches from `p=2521` to a declared ceiling no greater than `10^7`, with no model-supplied code. Its first candidate is checked against all gates in TypeScript and by the existing digest-pinned, read-only Python factor-pair auditor. A digest-chained `STRUCTURAL_PROBED` event records the plan, scanned-prime count, exact divisor witnesses, candidate, independent replay, and result.

If the typed predicate is refuted, the cycle stops at `STRUCTURAL_REFUTED` before source agents, task verifier, solver, critic or adversary. If none is found, the result is only `NOT_REFUTED_IN_BOUND`; the independent task verifier receives it and must still compare the typed predicate with the natural-language claim, assess scope and literature, and reject if uncertain. New subscription-backed steered structural proposals must return a typed plan; `null` stops at `STRUCTURAL_PROBE_HOLD`. Historical sealed proposals without the field remain readable. No old event is rewritten.

## Reproducible local checks

- Residue implication: first typed counterexample `p=99961` through `A=23` (`p mod 23 ≠ 4`), with Python replay PASS.
- Cross-gate implication: first typed counterexample `p=4037881` through `A=23`; divisor witnesses `739` for `x_15 mod 23 = 3` and `1355` for `x_19 mod 23 = 21`, with Python replay PASS.
- Unit tests recompute each scan and reject tampering; integration verifies the cycle records the event and launches only the planner before stopping.

This is a falsification filter for specified fixed-A auxiliary claims, not a general theorem prover, a guarantee that a model's prose matches its typed plan, a full independent rerun of the entire finite interval, or a novelty certificate. The pinned Python tool independently replays the *candidate*, while the read validator recomputes the deterministic TypeScript scan. The Erdős–Straus conjecture remains open and no unbounded structural milestone is claimed.
