import { describe, expect, it } from "vitest";

import { DEFAULT_LOCALE, normalizeLocale, translate } from "@/i18n/config";

describe("TIP-002A locale contract", () => {
  it("defaults every unknown or absent locale to Vietnamese", () => {
    expect(DEFAULT_LOCALE).toBe("vi");
    expect(normalizeLocale(undefined)).toBe("vi");
    expect(normalizeLocale("fr")).toBe("vi");
  });

  it("keeps stable keys complete in Vietnamese and English", () => {
    expect(translate("vi", "dashboard.title")).toBe("Tổng quan");
    expect(translate("en", "dashboard.title")).toBe("Dashboard");
    expect(translate("vi", "common.accountSecurity")).toBe(
      "Bảo mật tài khoản",
    );
    expect(translate("en", "common.accountSecurity")).toBe(
      "Account security",
    );
    expect(translate("vi", "dashboard.countSubtitle", { count: 3 })).toContain(
      "3",
    );
  });
});
