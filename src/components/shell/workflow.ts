/**
 * Canonical mission lifecycle from docs/contractor/04_BLUEPRINT.md §3.
 * Rendered as an INACTIVE explanatory sequence in TIP-002 — it describes the
 * governed workflow; it does not represent any running mission's state.
 */
export const WORKFLOW_STAGES: readonly string[] = [
  "Draft",
  "Intake",
  "Scoped",
  "Contract review",
  "Approved",
  "Exploring",
  "Building",
  "Verifying",
  "Review",
  "Released",
];

/**
 * Canonical mission types from docs/contractor/03_VISION.md.
 * Presented as composer affordances; selecting one mutates no governed state.
 */
export const MISSION_TYPES: readonly string[] = [
  "Research",
  "Analysis",
  "Build",
  "Evaluate",
];
