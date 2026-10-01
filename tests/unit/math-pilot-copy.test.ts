import { describe, expect, it } from "vitest";

import { getMathPilotCopy } from "@/i18n/math-pilot-copy";

describe("Math Pilot dispatch governance copy", () => {
  it("describes approved resources and separated AI review roles without requiring a human for AI dispatch", () => {
    const vi = getMathPilotCopy("vi").dispatchLocked;
    const en = getMathPilotCopy("en").dispatchLocked;
    expect(vi).toContain("Chưa kích hoạt chạy live");
    expect(vi).toContain("worker, provider");
    expect(vi).toContain("giới hạn tài nguyên đã được phê duyệt");
    expect(vi).toContain("các vai AI phản biện trong ngữ cảnh riêng");
    expect(vi).not.toContain("người phản biện");
    expect(en).toContain("Live dispatch is disabled");
    expect(en).toContain("worker, provider");
    expect(en).toContain("approved resource limits");
    expect(en).toContain("separate-context AI review roles");
    expect(en).not.toContain("independent reviewer");
  });

  it("keeps the separate human acceptance and mathematical-certification cautions", () => {
    const vi = getMathPilotCopy("vi");
    const en = getMathPilotCopy("en");
    expect(vi.reviewerNeeded).toBe("Cần một tài khoản khác có quyền phản biện. Người giao ca không thể tự nghiệm thu.");
    expect(en.reviewerNeeded).toBe("A different account with review permission is required. The requester cannot accept their own case.");
    expect(vi.codexMode).toContain("không tạo chứng chỉ định lý");
    expect(en.positiveCaution).toContain("not a formal proof certificate");
  });
});
