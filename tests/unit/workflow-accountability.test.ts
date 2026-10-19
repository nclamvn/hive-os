import { describe, expect, it } from "vitest";

import { deriveSlaState } from "@/modules/workflow-accountability/sla";

const now = new Date("2026-07-30T12:00:00.000Z");

describe("workflow accountability projections", () => {
  it("WORK-03 derives SLA state without persisting clock-dependent labels", () => {
    expect(deriveSlaState({ assigned: false, now })).toBe("UNASSIGNED");
    expect(
      deriveSlaState({ assigned: true, targetExists: false, now }),
    ).toBe("TARGET_MISSING");
    expect(
      deriveSlaState({ assigned: true, complete: true, now }),
    ).toBe("COMPLETE");
    expect(
      deriveSlaState({
        assigned: true,
        dueAt: new Date("2026-07-30T13:00:00.000Z"),
        warningBeforeMinutes: 30,
        escalateAfterMinutes: 60,
        now,
      }),
    ).toBe("ON_TRACK");
    expect(
      deriveSlaState({
        assigned: true,
        dueAt: new Date("2026-07-30T12:15:00.000Z"),
        warningBeforeMinutes: 30,
        escalateAfterMinutes: 60,
        now,
      }),
    ).toBe("DUE_SOON");
    expect(
      deriveSlaState({
        assigned: true,
        dueAt: new Date("2026-07-30T11:30:00.000Z"),
        escalateAfterMinutes: 60,
        now,
      }),
    ).toBe("OVERDUE");
    expect(
      deriveSlaState({
        assigned: true,
        dueAt: new Date("2026-07-30T10:00:00.000Z"),
        escalateAfterMinutes: 60,
        now,
      }),
    ).toBe("ESCALATION_DUE");
  });
});
