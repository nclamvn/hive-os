import { describe, expect, it } from "vitest";

import { getMissionNextAction } from "@/components/mission/mission-next-action";

describe("mission next action", () => {
  const basePath = "/w/workspace";

  it("routes an approved mission into governed research when permitted", () => {
    expect(
      getMissionNextAction({
        basePath,
        locale: "vi",
        missionId: "mission-1",
        status: "APPROVED",
        capabilities: { canResearch: true },
      }),
    ).toMatchObject({
      phase: 2,
      label: "Bắt đầu nghiên cứu",
      href: "/w/workspace/research?missionId=mission-1",
    });
  });

  it("fails closed to the mission dossier without research permission", () => {
    expect(
      getMissionNextAction({
        basePath,
        locale: "en",
        missionId: "mission-2",
        status: "APPROVED",
      }),
    ).toMatchObject({
      label: "Open the mission dossier",
      href: "/w/workspace/missions/mission-2",
    });
  });

  it.each([
    ["DRAFT", "/w/workspace/missions/mission-3", 0],
    ["BUILDING", "/w/workspace/execution", 3],
    ["VERIFYING", "/w/workspace/verification", 4],
    ["RELEASED", "/w/workspace/reports", 5],
  ])("maps %s to its bounded operating surface", (status, href, phase) => {
    expect(
      getMissionNextAction({
        basePath,
        locale: "en",
        missionId: "mission-3",
        status,
      }),
    ).toMatchObject({ href, phase });
  });
});
