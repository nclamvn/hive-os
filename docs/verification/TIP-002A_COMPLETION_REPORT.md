# TIP-002A Builder Completion Report

Status: `COMPLETE`

Date: `2026-07-29`

## Delivered

- Vietnamese-first (`vi`) and English (`en`) locale foundation using stable
  translation keys and a persistent locale cookie.
- System-first appearance with persistent `system`, `light`, and `dark`
  choices, operating-system change tracking, browser `color-scheme`, and a
  pre-paint bootstrap.
- Literata thesis, Be Vietnam Pro UI, and IBM Plex Mono data roles.
- Precision Instrument light/dark semantic tokens.
- Workflow-plane navigation groups and accessible preference controls in the
  authenticated shell, mobile drawer, tablet rail, and auth surfaces.
- Governed Provenance Rail shared by Dashboard, Mission Workspace, and Control
  Room.
- Dashboard command thesis and mission composer without synthetic metrics.
- Localized Dashboard, shell, Mission lifecycle/header/navigation, and Control
  Room thesis/lenses. Governed user/source content remains unchanged.
- Port-configurable E2E harness so tests do not require terminating another
  local application on port 3000.

## Principal files

- `src/i18n/config.ts`
- `src/i18n/server.ts`
- `src/components/preferences/preferences-provider.tsx`
- `src/components/preferences/preferences-controls.tsx`
- `src/components/ui/provenance-rail.tsx`
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/components/shell/*`
- `src/components/dashboard/*`
- `src/components/mission/mission-workspace.tsx`
- `src/components/control-room/control-room.tsx`
- `tests/e2e/preferences.spec.ts`
- `tests/e2e/precision-instrument-visual.spec.ts`
- `tests/unit/preferences.test.ts`

## Evidence

- Typecheck: PASS.
- Lint: PASS.
- Production build: PASS.
- Unit: 143 PASS.
- Integration: 123 PASS.
- E2E: all 79 scenarios PASS in one full run.
- Accessibility: existing Dashboard, Mission, Control Room, auth, settings, and
  mobile Axe scenarios pass with no serious/critical violations.
- Visual evidence: `artifacts/tip-002a/` contains 16 dashboard screenshots for
  `vi/en × light/dark × 4 viewports`. Existing Mission and Control Room visual
  suites were also refreshed.

## Deviations

- TIP-002A intentionally localizes only the shell and three representative
  product surfaces. Full copy and information-architecture migration of every
  operational form remains the explicitly deferred TIP-002B boundary.
- The existing PostgreSQL client concurrency deprecation warning remains
  unrelated to this UI TIP.

## Restricted actions

No external provisioning, billing, push, deployment, production release, or
public release occurred.
