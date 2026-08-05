import { describe, expect, it } from "vitest";

import { settingsCopy, settingsValueLabel } from "@/i18n/settings-copy";
import { skillsCopy, skillValueLabel } from "@/i18n/skills-copy";

describe("settings and skill library copy", () => {
  it("keeps complete English and Vietnamese settings surfaces", () => {
    expect(settingsCopy.en.policy.pageTitle).toBe("Settings");
    expect(settingsCopy.vi.policy.pageTitle).toBe("Cài đặt");
    expect(settingsCopy.vi.workspace.sectionTitle).toBe(
      "Hồ sơ không gian làm việc",
    );
    expect(settingsCopy.vi.members.pendingTitle).toBe("Lời mời đang chờ");
    expect(settingsCopy.vi.audit.download).toBe("Tải sổ cái");
    expect(settingsValueLabel("vi", "OWNER")).toBe("Chủ sở hữu");
    expect(settingsValueLabel("en", "INTERNAL_ONLY")).toBe("Internal Only");
  });

  it("keeps technical identifiers while localizing skill governance copy", () => {
    expect(skillsCopy.en.page.title).toBe("Skill Library");
    expect(skillsCopy.vi.page.title).toBe("Thư viện kỹ năng");
    expect(skillsCopy.vi.form.inputSchema).toBe("JSON Schema đầu vào");
    expect(skillValueLabel("vi", "DETERMINISTIC")).toBe("Tất định");
    expect(skillValueLabel("en", "DEPRECATED")).toBe("Deprecated");
  });
});
