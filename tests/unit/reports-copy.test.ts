import { describe, expect, it } from "vitest";

import {
  durationUnavailableReason,
  pilotMetricCopy,
  reportsCopy,
  reportValueLabel,
  reworkLabel,
} from "@/i18n/reports-copy";

describe("Reports localization", () => {
  it("REP-L10N-U01 provides Vietnamese empty, active and export copy", () => {
    expect(reportsCopy.vi.page.title).toBe("Báo cáo");
    expect(reportsCopy.vi.dossiers.view).toBe("Xem báo cáo thí điểm");
    expect(reportsCopy.vi.verification.download).toBe("Tải báo cáo kiểm chứng");
    expect(reportsCopy.vi.releases.download).toBe("Tải manifest phát hành");
    expect(reportsCopy.vi.export.build).toBe("Dựng hồ sơ");
  });

  it("REP-L10N-U02 localizes governed status and pilot measurement values", () => {
    expect(reportValueLabel("vi", "READY_WITH_DEFERRED")).toBe(
      "Sẵn sàng, còn hạng mục hoãn",
    );
    expect(reportValueLabel("vi", "NOT_INDEPENDENT")).toBe("Không độc lập");
    expect(reportValueLabel("vi", "PUBLIC")).toBe("Công khai");
    expect(reworkLabel("vi", "failedVerificationScenarios")).toBe(
      "kịch bản kiểm chứng không đạt",
    );

    const metric = pilotMetricCopy(
      "vi",
      "evidenceRetrievalTime",
      "English source reason",
    );
    expect(metric.name).toBe("Thời gian truy xuất bằng chứng");
    expect(metric.reason).not.toContain("English");
    expect(
      durationUnavailableReason(
        "vi",
        "Both authoritative boundary timestamps are required.",
        "Chưa có dữ liệu",
      ),
    ).toBe("Cần đủ hai mốc thời gian ranh giới có thẩm quyền.");
  });
});
