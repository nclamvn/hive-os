# Button rhythm: Builder completion

Date: 2026-10-14. Scope: `TIP.md` UI small task only.

STATUS: PARTIAL pending Contractor's independent live browser geometry, clipping,
and keyboard checks. Implementation and scoped static/unit verification are done.
This is not acceptance of the separate UAV comparison or any research milestone.

## Files changed

- `src/components/mission/mission-actions.tsx`: presentation wrappers only. A
  one-column grid below 760px deliberately stacks full-width peer actions. At the
  existing mission-header breakpoint, implicit equal-fraction columns give peers
  equal intrinsic widths. One peer creates one column, never a reserved slot.
  Errors remain outside the peer-sizing grid. Shared Button, parent workspace,
  labels, status conditions, permission checks, handlers and busy state are unchanged.
- `tests/unit/mission-actions.test.ts`: 28 focused EN/VI tests. Real SSR and shared
  Button styles are retained; server actions/router are mocked to prevent any
  live mutation. Pending/error state seeds and captured callbacks exercise the
  component contract, not a real browser lifecycle.
- This completion report. Existing PDF/export/tests/handoff edits preserved.

## Acceptance evidence

| AC | Builder result | Evidence / remaining check |
|---|---|---|
| AC1 | Implemented; geometry pending | Both locales assert equal-column responsive classes and two shared `h-10` buttons; Contractor to measure actual narrow/wide pixels. |
| AC2 | Implemented; clipping pending | Visibility matrix covers zero/one/two actions and no fixed two-column slot; single mobile action spans available width. Contractor to inspect long EN/VI labels at 320px and wide layout. |
| AC3 | PASS | Status/permission matrix, labels, all three exact action arguments, success refresh, localized failure, and busy-disabled peers pass in both locales. Source change is wrappers/indentation only. |
| AC4 | Static/unit PASS; browser pending | Commands below pass; Contractor owns independent visual/keyboard QA without invoking live actions. |

## Technical health

- `npm run test:unit -- tests/unit/mission-actions.test.ts`: 28/28 PASS, one file.
- `npx eslint src/components/mission/mission-actions.tsx tests/unit/mission-actions.test.ts`:
  PASS, zero errors/warnings.
- `npm run typecheck`: PASS, zero errors.
- `git diff --check`: PASS.
- Build: deliberately not run, per TIP. No dependency install, server restart,
  live mission mutation, schema/API change, paid call, commit/push or deployment.
- Existing Vite configuration compatibility advisory appears during tests;
  it is unrelated to this change and is not an ESLint finding.

## Decisions and limits

Vibecode small-task BUILD/VERIFY split used; no architecture change or new gate.
The current 760px mission-header breakpoint is reused to avoid an extra responsive
transition. This is an in-scope implementation choice, not a deviation.
Browser geometry and keyboard focus must not be inferred from static class tests.
No scratch copies, extra dist directories, dependencies or Docker resources were
created. Nothing was deleted; cleanup not needed. K6 remains paused and OPEN.

## Contractor verification (supersedes pending browser status above)

Live Codex browser, existing M-0002, no mission action submitted:
- 390px: VN and EN peers each 324 × 40px; scrollWidth does not exceed clientWidth.
- 1440px: EN peers each 149.390625 × 40px; VN peers each 104.46875 × 40px.
- Natural 901px screenshot inspected and saved as `buttons-desktop.jpg`.
- Tab from primary reaches Block, visible 2px focus outline; no click/approval.
- Locale restored to VN; viewport override reset.
- Single/zero/approval-action variants covered by the 28 unit cases, not live
  state mutation. Only the SCOPED pair is live-tested in this session.

Requirement coverage 4/4 (100%); scenarios pass, no observed clipping/focus fail.
Technical health: 28 unit passes, typecheck/scoped lint pass as above, production
build NOT RUN. READY for this scoped local UI fix; not full-product QA/deployment.
