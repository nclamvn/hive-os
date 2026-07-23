# TIP-005 verification evidence

Truth Kernel implementation evidence:

- Unit invariants: `tests/unit/truth-rules.test.ts`
- PostgreSQL integration invariants: `tests/integration/truth.test.ts`
- Immutable ledger triggers:
  `prisma/migrations/20260723074606_truth_kernel/migration.sql`
- Policy: `docs/truth/TRUTH_KERNEL_POLICY.md`

Verified scenarios cover exact span matching, independent-source
corroboration, retained disputes, explicit honest-null, queryable falsification,
access-safe projections, and database-level immutability.

Local verification on 2026-07-23:

- Prisma schema validation: PASS
- Lint: PASS, zero warnings
- Typecheck: PASS
- Unit tests: 85 passed
- Integration tests: 67 passed
- E2E tests: 40 passed
- Next.js production build: PASS

Remote CI remains deferred under the pre-existing G3 billing hold.

Unified Control Room UI evidence:

- `control-room-desktop-viewport.png`
- `control-room-mobile-viewport.png`
- `tests/e2e/control-room.spec.ts`
- `tests/e2e/control-room-visual.spec.ts`
