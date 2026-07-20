# Domain Model and Authority Rules

## Authority hierarchy

1. Database records and immutable artifact hashes are authoritative system state.
2. Deterministic kernel services decide governed transitions.
3. Verifier outputs may satisfy obligations when schema-valid and linked to artifacts.
4. Model outputs are proposals or reports until accepted by deterministic rules or human sign-off.
5. UI projections never become source of truth.

## Claim state lattice

Suggested base states:

- `DRAFT`
- `HYPOTHESIS`
- `SOURCED`
- `CORROBORATED`
- `DISPUTED`
- `VALIDATED_BOUNDED`
- `PROVED_INTERNAL`
- `FALSIFIED`
- `RETRACTED`
- `HONEST_NULL`

Transitions require explicit evidence and actor permissions. `DISPUTED`, `FALSIFIED`, and `RETRACTED` are retained permanently for audit.

## Execution result semantics

- `DONE`: all current TIP acceptance criteria passed.
- `PARTIAL`: useful output exists, at least one acceptance criterion remains open.
- `BLOCKED`: execution cannot continue without external dependency or decision.
- `OPEN_INCOMPLETE`: bounded search or verifier did not certify either existence or emptiness.
- `EMPTY_CERTIFIED`: a complete method produced a replayable nonexistence certificate.

## Progress semantics

Mission progress is derived from weighted obligations in the approved contract:

`closed_weight / total_active_weight`

Weights are approved contract metadata. A model cannot invent percentages.
