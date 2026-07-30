export type DerivedSlaState =
  | "UNASSIGNED"
  | "TARGET_MISSING"
  | "COMPLETE"
  | "ON_TRACK"
  | "DUE_SOON"
  | "OVERDUE"
  | "ESCALATION_DUE";

export function deriveSlaState(input: {
  assigned: boolean;
  targetExists?: boolean;
  complete?: boolean;
  dueAt?: Date | null;
  warningBeforeMinutes?: number | null;
  escalateAfterMinutes?: number | null;
  now: Date;
}): DerivedSlaState {
  if (!input.assigned) return "UNASSIGNED";
  if (input.targetExists === false) return "TARGET_MISSING";
  if (input.complete) return "COMPLETE";
  if (!input.dueAt) return "ON_TRACK";

  const dueAt = input.dueAt.getTime();
  const now = input.now.getTime();
  const escalationAt =
    dueAt + (input.escalateAfterMinutes ?? 0) * 60_000;
  if (now >= escalationAt) return "ESCALATION_DUE";
  if (now >= dueAt) return "OVERDUE";
  const warningAt =
    dueAt - (input.warningBeforeMinutes ?? 0) * 60_000;
  return now >= warningAt ? "DUE_SOON" : "ON_TRACK";
}
