# TIP-002B Builder Completion Report

Status: `COMPLETE`

Date: `2026-07-29`

## Delivered

- Completed Vietnamese/English migration of the core Mission → Truth →
  Execution → Verification → Release operating loop.
- Migrated all nine Mission Workspace lenses, Missions list, New Mission, deep
  Control Room lenses/finder/inspector, Evidence, Claims, Execution Operations,
  Verification Operations, and scoped action controls.
- Preserved Vietnamese as first-visit default and system theme as first-visit
  appearance; explicit `vi/en` and `system/light/dark` preferences still
  persist.
- Added typed copy contracts with 295 English/Vietnamese leaf entries across
  Truth (100), Execution (96), and Verification (99), plus typed shell,
  Mission, and Control Room keys.
- Centralized enum, assurance, number, and date presentation. Unknown English
  technical values remain readable title case without changing stored values.
- Added stable `errorCode` results to scoped Mission, Truth, Execution, and
  Verification server actions. Vietnamese presentation maps 40 domain codes to
  safe localized messages; English retains the canonical code and kernel
  message.
- Kept mission titles, objectives, requirements, source text, exact spans,
  claim statements, imported artifacts, hashes, identifiers, provider/model
  names, reports, decisions, methods, and limitations byte-identical.
- Applied the Precision Instrument grammar: route authority/thesis, real
  provenance/process rail, bounded operation bay, and immutable ledger. The
  Governed Provenance Rail remains the single signature.

## Principal files

- `src/i18n/{copy-types,format,action-errors}.ts`
- `src/i18n/{truth-copy,execution-copy,verification-copy,use-core-copy}.ts`
- `src/i18n/config.ts`
- `src/app/actions/{missions,truth,execution,verification}.ts`
- `src/app/w/[workspaceSlug]/{evidence,claims,execution,verification}/page.tsx`
- `src/app/w/[workspaceSlug]/missions/{page,new/page}.tsx`
- `src/components/{truth,execution,verification}/*-forms.tsx`
- `src/components/mission/*.tsx`
- `src/components/control-room/control-room.tsx`
- `tests/unit/core-i18n.test.ts`
- `tests/e2e/core-operational-visual.spec.ts`

## Evidence

- Typecheck: PASS.
- Lint: PASS.
- Production build: PASS.
- Unit: 149 PASS.
- Integration: 123 PASS in a single database-safe run.
- E2E: 80/80 PASS in the final full-suite run after correcting the runtime
  server/client copy boundary and retaining canonical English error codes.
- Accessibility: existing Mission, Truth, Execution, Verification, Control
  Room, shell, auth, and settings Axe scenarios report no serious/critical
  violations.
- Literal audit: no unregistered visible English product-copy literal remained
  in the scoped components; `Manual Provider Bridge` is the explicit technical
  product-name allowlist.
- Visual evidence: `artifacts/tip-002b/` contains 40 screenshots for five core
  routes across `vi/en × light/dark × mobile/desktop`.

## Deviations and observations

- The visual matrix contains five surfaces rather than the minimum four:
  Missions, Truth, Execution, Verification, and Control Room.
- A first integration attempt was invalidated by two concurrent runners sharing
  the same test database. The required single-run repeat passed 123/123.
- PostgreSQL continues to emit the pre-existing `client.query()` concurrency
  deprecation warning; no failure is associated with this UI TIP.
- Auth, recovery, workspace administration, Templates, Skill Library,
  Observatory, and Reports remain outside this authorization and are deferred
  to TIP-002C.

## Restricted actions

No external provisioning, billing, push, deployment, production release, public
release, or remote mutation occurred.
