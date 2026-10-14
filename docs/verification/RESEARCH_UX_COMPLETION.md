# Research UX completion — 2026-10-14

Engineering continuation of TIP-117, implementing the approved independent UX
review. Research stays paused; K6 is OPEN. No deployment or new research run.

## Shipped scope

- R1: New mission links to the workspace intake on desktop, icon rail and mobile.
  Without workspace context the label honestly asks the user to choose one.
- R2: Research opens with the goal, then recent work, then examples/workbenches.
  Expert campaign controls are collapsed. The submit button says it sends a
  request; execution readiness is not asserted.
- R3: Recent work groups whitespace-normalized exact questions within a mission,
  newest by creation time with ID tie-breaking. Five groups are visible initially.
  All older attempts, failures, findings and permission-dependent review/import
  controls remain available. Closed groups expose counts requiring attention.
  Technical failure codes and HONEST_NULL details have disclosures, with the
  non-proven outcome explained in ordinary language.
- R4: Mission intake foregrounds title, objective, scope and desired result.
  Editable contract details use explicit deterministic draft suggestions, not
  an AI plan. Template contents and server governance remain unchanged. Invalid
  hidden fields open before native validation; pending submit is disabled.
- R5: The manual workbench starts with the problem. Original JSON and tool schemas
  are progressively disclosed. Explicit input-only drafts use sessionStorage,
  scoped by authenticated user/workspace, versioned, bounded and expired at 24h.
  Restore is explicit and clears observations; it never restores verified status
  or dispatches a model. Storage failures and deletion are handled visibly.

Frontend-design guidance preserved existing typography/tokens and improved visual
hierarchy rather than adding a dashboard. Vibecode separated implementation from
Main verification with one compact specification, no additional product gate.

## Verification on final source

- TypeScript: PASS. Scoped ESLint for all changed TS/TSX: PASS, zero output.
- Focused unit tests: 121 PASS across eight files (119 + 2 render regressions).
  Includes draft parsing/storage/isolation, existing manual-bridge/core/actions,
  intake defaults/validation, exact grouping, navigation and preserved reviews.
- LOCAL_QA webpack build: PASS in reusable `.next-build`; standalone environment
  scrub and asset preparation: PASS. Two builds total: the final build synchronized
  a late bilingual count-label edit. No task-specific build folder or project copy.
- Final isolated Playwright suite: **19 PASS, 24.0s, one worker, zero retries**:
  mission-intake-ux, mission, preferences, research-shell-handoff,
  research-ux-journey, templates-skills.
- EN/VI mission intake tested at 1440/900/390px; mobile drawer and keyboard flow;
  invalid hidden field submits zero POSTs; untouched defaults persist a real draft
  contract. Existing mission/template accessibility checks pass.
- Research sections align at 1440/900/390px without horizontal overflow. Manual
  draft import/check/save/reload/restore/delete and blocked storage tested in both
  languages; original synthetic output bytes preserved, no verified result restored.
- Live Codex browser on the user's authenticated local workspace: verified goal-first
  layout, correct New mission route, keyboard disclosure, manual workbench import
  disclosure and return to Research. No live form submission or data modification.
- Visual inspection: live 901px viewport, saved desktop Research and Vietnamese
  390px intake screenshots. Local ephemeral evidence is under `test-results/`;
  `research-ux-live-vi.jpg` records the final user workspace UI.
- First E2E launch was sandbox-blocked at port3108 (EPERM), not a test assertion
  failure. Authorized local rerun passed17/17; final expanded suite passed19/19.

## Boundaries and remaining limitations

No provider/model/API call, research campaign, schema change, runtime permission
change, deployment, commit or push in this task. E2E uses synthetic `hiveos_test`
data and existing test role/migrations, not the user's research workspace.
No research evidence removed or recertified. No full historical test-suite claim.

The workbench is still a **manual** LLM-output bridge, not automated solving.
Drafts are local tab-session convenience, not durable team storage or encryption;
reload/close warns on unsaved input, but client-route navigation is save-first and
not intercepted. Grouping covers the existing recent-run query, not all history.
Near-duplicate but mathematically different questions are deliberately not merged.
Previously documented dependency audit/deployment debts remain unchanged.

No scratch project, dependency install, new build directory or Docker image was
created; no cleanup of user/research data was needed. Final source remains
uncommitted pending a separate commit/push instruction.
