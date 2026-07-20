# Decisions & Escalations (TIP-004)

## Material decisions
These create a `Decision` in status REQUIRED rather than applying silently:
contract amendment, material scope change, assurance downgrade, waiver of a
required obligation, gate waiver, cancellation, refutation, release exception.

- Resolution is atomic with the authorized governed action (`resolveDecision`):
  approval applies the action (waive/cancel/refute/amend) in the same
  transaction; rejection leaves governed state unchanged.
- Decisions are retained (never hard-deleted). Every REQUIRED decision is a real
  decision-required item on the mission surface. No synthetic decisions or fake
  timestamps.

## Escalations
- Entering BLOCKED creates an OPEN Escalation atomically and records the prior
  state in `blockedFromStatus`.
- Escalations are acknowledged and resolved by authorized roles
  (`escalations.manage`), each emitting an audit event.
Tests: MK-22..24, MK-28.
