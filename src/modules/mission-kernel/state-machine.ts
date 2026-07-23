import type { MissionStatus } from "@prisma/client";

import { MissionError, MissionErrorCode } from "./errors";

/**
 * How a requested Mission transition is classified. This table is the single
 * source of truth for the mission lifecycle and drives the table-driven tests.
 */
export type TransitionKind =
  | "primary" // publicly executable in TIP-004 (human command)
  | "execution" // requires TIP-007 execution readiness
  | "verification" // requires TIP-008 verification readiness
  | "release" // requires TIP-008 governed release authorization
  | "later" // recognized but fails closed until later kernels exist
  | "block" // → BLOCKED (reason + escalation, records prior state)
  | "resume" // BLOCKED → recorded prior state
  | "decision" // requires an approved material Decision
  | "archive" // terminal → ARCHIVED
  | "invalid";

export interface TransitionRule {
  kind: TransitionKind;
  /** Later-kernel guard error code, when kind === "later". */
  errorCode?: string;
}

// Primary, publicly executable transitions (human command).
const PRIMARY: Array<[MissionStatus, MissionStatus]> = [
  ["DRAFT", "INTAKE"],
  ["INTAKE", "SCOPED"],
  ["SCOPED", "CONTRACT_REVIEW"],
  ["CONTRACT_REVIEW", "APPROVED"],
  // Enabled by TIP-005: the deterministic Truth Kernel now owns exploration.
  ["APPROVED", "EXPLORING"],
];

// Execution Fabric owns this transition and checks Mission-specific readiness.
const EXECUTION: Array<[MissionStatus, MissionStatus]> = [
  ["EXPLORING", "BUILDING"],
];

// Verification Governance owns these transitions and checks immutable reports,
// verifier independence, and the assurance-profile sign-off policy.
const VERIFICATION: Array<[MissionStatus, MissionStatus]> = [
  ["BUILDING", "VERIFYING"],
  ["VERIFYING", "REVIEW"],
];

// A Mission may be released only after TIP-008 creates an approved immutable
// release and its exact manifest.
const RELEASE: Array<[MissionStatus, MissionStatus]> = [
  ["REVIEW", "RELEASED"],
];

// Recognized later-stage transitions that still fail closed.
const LATER: Array<[MissionStatus, MissionStatus, string]> = [];

// Active governed states that may be blocked (reason + escalation).
const BLOCKABLE: MissionStatus[] = [
  "INTAKE",
  "SCOPED",
  "CONTRACT_REVIEW",
  "APPROVED",
  "EXPLORING",
  "BUILDING",
  "VERIFYING",
  "REVIEW",
];

// Decision-gated side transitions (require an approved material Decision).
const DECISION: Array<[MissionStatus, MissionStatus]> = [
  ["DRAFT", "CANCELLED"],
  ["INTAKE", "CANCELLED"],
  ["SCOPED", "CANCELLED"],
  ["CONTRACT_REVIEW", "CANCELLED"],
  ["APPROVED", "CANCELLED"],
  ["BLOCKED", "CANCELLED"],
  ["APPROVED", "PARTIAL"],
  ["APPROVED", "REFUTED"],
  ["EXPLORING", "CANCELLED"],
  ["EXPLORING", "PARTIAL"],
  ["EXPLORING", "REFUTED"],
];

// Terminal states that may be archived.
const ARCHIVABLE: MissionStatus[] = [
  "RELEASED",
  "PARTIAL",
  "REFUTED",
  "CANCELLED",
];

export function classifyTransition(
  from: MissionStatus,
  to: MissionStatus,
): TransitionRule {
  if (PRIMARY.some(([f, t]) => f === from && t === to)) {
    return { kind: "primary" };
  }
  if (EXECUTION.some(([f, t]) => f === from && t === to)) {
    return { kind: "execution" };
  }
  if (VERIFICATION.some(([f, t]) => f === from && t === to)) {
    return { kind: "verification" };
  }
  if (RELEASE.some(([f, t]) => f === from && t === to)) {
    return { kind: "release" };
  }
  const later = LATER.find(([f, t]) => f === from && t === to);
  if (later) return { kind: "later", errorCode: later[2] };

  if (to === "BLOCKED" && BLOCKABLE.includes(from)) return { kind: "block" };
  // Decision-gated side transitions are checked before the BLOCKED resume
  // catch-all, so e.g. BLOCKED→CANCELLED classifies as a decision.
  if (DECISION.some(([f, t]) => f === from && t === to)) {
    return { kind: "decision" };
  }
  if (to === "ARCHIVED" && ARCHIVABLE.includes(from)) return { kind: "archive" };
  if (from === "BLOCKED" && to !== "BLOCKED" && to !== "ARCHIVED") {
    // Resume target is validated against the recorded prior state at runtime.
    return { kind: "resume" };
  }

  return { kind: "invalid" };
}

/** All non-invalid transitions, for table-driven coverage. */
export function enumerateTransitions(): Array<{
  from: MissionStatus;
  to: MissionStatus;
  kind: TransitionKind;
}> {
  const out: Array<{ from: MissionStatus; to: MissionStatus; kind: TransitionKind }> = [];
  for (const [from, to] of PRIMARY) out.push({ from, to, kind: "primary" });
  for (const [from, to] of EXECUTION) {
    out.push({ from, to, kind: "execution" });
  }
  for (const [from, to] of VERIFICATION) {
    out.push({ from, to, kind: "verification" });
  }
  for (const [from, to] of RELEASE) {
    out.push({ from, to, kind: "release" });
  }
  for (const [from, to] of LATER) out.push({ from, to, kind: "later" });
  for (const from of BLOCKABLE) out.push({ from, to: "BLOCKED", kind: "block" });
  for (const [from, to] of DECISION) out.push({ from, to, kind: "decision" });
  for (const from of ARCHIVABLE) out.push({ from, to: "ARCHIVED", kind: "archive" });
  return out;
}

/** Throw the correct stable error for a non-executable transition. */
export function transitionError(from: MissionStatus, to: MissionStatus): MissionError {
  const rule = classifyTransition(from, to);
  if (rule.kind === "later") {
    return new MissionError(
      rule.errorCode!,
      `Transition ${from} → ${to} requires a later kernel`,
    );
  }
  return new MissionError(
    MissionErrorCode.InvalidTransition,
    `Transition ${from} → ${to} is not allowed`,
  );
}
