import { describe, expect, it } from "vitest";

import {
  getMissionTemplate,
  MISSION_TEMPLATES,
} from "@/modules/mission-templates";

describe("Mission template catalog", () => {
  it("TPL-U01 has stable unique keys and covers every assurance profile", () => {
    expect(new Set(MISSION_TEMPLATES.map((template) => template.key)).size).toBe(
      MISSION_TEMPLATES.length,
    );
    expect(
      MISSION_TEMPLATES.map((template) => template.assuranceProfile).sort(),
    ).toEqual(["PROFESSIONAL", "QUICK", "REGULATED", "RESEARCH"]);
    expect(MISSION_TEMPLATES.every((template) => template.version === 1)).toBe(
      true,
    );
  });

  it("TPL-U02 resolves only exact catalog keys", () => {
    expect(
      getMissionTemplate("research-evidence-synthesis")?.assuranceProfile,
    ).toBe("RESEARCH");
    expect(getMissionTemplate("unknown")).toBeUndefined();
    expect(getMissionTemplate(undefined)).toBeUndefined();
  });
});
