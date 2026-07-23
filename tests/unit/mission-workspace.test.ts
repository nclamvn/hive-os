import { describe, expect, it } from "vitest";

import {
  MISSION_VIEWS,
  normalizeMissionView,
} from "@/components/mission/workspace-views";

describe("Mission Workspace views", () => {
  it("MW-U01 accepts every declared deep-link lens", () => {
    for (const view of MISSION_VIEWS) {
      expect(normalizeMissionView(view)).toBe(view);
    }
  });

  it("MW-U02 defaults missing and unknown views safely to overview", () => {
    expect(normalizeMissionView()).toBe("overview");
    expect(normalizeMissionView("unknown")).toBe("overview");
    expect(normalizeMissionView("release?internal=true")).toBe("overview");
  });
});
