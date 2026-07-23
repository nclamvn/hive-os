# Truth Kernel

TIP-005 deterministic truth ledger.

- Source snapshots and exact spans are append-only.
- Claim versions retain every asserted value and its evidence links.
- `CORROBORATED` requires two qualifying, independent source keys.
- Conflicting retained values deterministically produce `DISPUTED`.
- `HONEST_NULL` is an explicit human action; bounded search does not invent it.
- `FALSIFIED` and `RETRACTED` remain queryable.
- Public/export projections apply field-level access ceilings server-side.

The database is authoritative. Provider prose may propose assertions, but only
these services may mutate governed truth state.
