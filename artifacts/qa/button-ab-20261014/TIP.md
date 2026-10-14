# Button rhythm and exploratory UAV comparison

Owner-approved scope: consistent action buttons, then a same-Codex, no-paid-API
comparison on the UAV proposal. No deployment, mission state changes, or K6 work.

## UI small-task specification
Keep HIVE's current navy primary/outlined secondary, existing typography and 40px
control rhythm. Fix the mission action group: equal-width peer buttons, deliberate
responsive alignment rather than accidental wrapping. Do not force every icon
button or unrelated navigation control to the same width. Preserve labels,
permissions, disabled states, handlers and visible keyboard focus.

AC1: review/block peers have equal dimensions in EN/VI, narrow and wide layouts.
AC2: single action does not create an empty slot; long labels do not clip/overflow.
AC3: state/permission logic and action invocation remain unchanged and tested.
AC4: local browser visual/geometry and keyboard QA; scoped unit/type/lint checks.

Decision: small presentation-only fix; no full build, new dependency or architecture.
Builder implements; Contractor independently verifies. Existing PDF edits preserved.
