# Progress Semantics (TIP-004)

Source: `src/modules/mission-kernel/progress.ts`, `getMissionProgress`.

- Progress is a projection, never stored. It derives only from the runtime
  obligations of the currently approved contract.
- `totalWeight` = sum of all obligation weights; `closedWeight` = SATISFIED +
  authorized WAIVED. OPEN / IN_PROGRESS / BLOCKED remain in the denominator.
- `basisPoints = floor(closedWeight * 10000 / totalWeight)`; the exact numerator
  and denominator are returned. Rounding to a percentage happens only in
  presentation code.
- Before contract approval, progress is **unavailable** (null) — never fabricated.
- Obligation weights are immutable after approval (DB `contract_obligation`
  frozen trigger). Obligations cannot be removed to inflate progress.
- Waiving a required obligation requires an approved material Decision; ordinary
  updates cannot reach WAIVED.
- A model-generated percentage is never treated as authority.
Tests: MK-17..21 (+ unit progress tests).
