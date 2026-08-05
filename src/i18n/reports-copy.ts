import type { Locale } from "./config";
import type { DeepCopy } from "./copy-types";

const en = {
  page: {
    title: "Reports",
    subtitle: "Retained Verify Reports and governed release bundles.",
  },
  dossiers: {
    title: "Pilot dossiers",
    description:
      "Complete governed record and ledger-derived pilot measurement for each mission.",
    empty: "No mission dossiers",
    emptyHint: "Create a Mission to begin the pilot record.",
    view: "View pilot report",
    measurement: "Pilot measurement",
  },
  verification: {
    title: "Verify Reports",
    empty: "No Verify Reports",
    emptyHint: "Completed governed verification appears here.",
    download: "Download Verify Report",
  },
  releases: {
    title: "Release bundles",
    empty: "No release bundles",
    emptyHint: "Approved immutable manifests appear here.",
    manifestUnavailable: "Manifest unavailable",
    methods: "methods",
    limitations: "limitations",
    approvers: "approvers",
    download: "Download release manifest",
  },
  export: {
    unavailable: "Export unavailable",
    statusUnavailable: "Export status unavailable",
    rejected: "Export request rejected",
    failed: "Export request failed",
    download: "Download dossier manifest",
    requesting: "Requesting…",
    building: "Building dossier…",
    build: "Build dossier",
  },
  pilot: {
    title: "Pilot measurement",
    eligibility: "Governed throughput eligibility",
    eligible: "eligible",
    notEligible: "not yet eligible",
    rule: "RELEASED with complete dossier, evidenced PASS coverage, accountable material decisions and traceable release claims.",
    download: "Download measurement JSON",
    openMission: "Open mission",
    durations: "Phase durations",
    creationToApproval: "Creation → approval",
    approvalToBuilding: "Approval → building",
    buildingToVerification: "Building → verification",
    verificationToRelease: "Verification → release",
    unavailable: "Unavailable",
    minute: "min",
    hour: "h",
    coverage: "Coverage and accountability",
    requirementsEvidenced: "Requirements evidenced",
    requirementsPassed: "Requirements passed",
    accountableDecisions: "Accountable decisions",
    traceableClaims: "Traceable release claims",
    rework: "Retained rework signals",
    unavailableMeasurements: "Unavailable measurements",
  },
} as const;

const vi: DeepCopy<typeof en> = {
  page: {
    title: "Báo cáo",
    subtitle:
      "Báo cáo kiểm chứng được lưu giữ và các gói phát hành có quản trị.",
  },
  dossiers: {
    title: "Hồ sơ thí điểm",
    description:
      "Hồ sơ có quản trị đầy đủ và phép đo thí điểm suy ra từ sổ cái cho từng nhiệm vụ.",
    empty: "Chưa có hồ sơ nhiệm vụ",
    emptyHint: "Tạo một nhiệm vụ để bắt đầu hồ sơ thí điểm.",
    view: "Xem báo cáo thí điểm",
    measurement: "Đo lường thí điểm",
  },
  verification: {
    title: "Báo cáo kiểm chứng",
    empty: "Chưa có báo cáo kiểm chứng",
    emptyHint:
      "Kết quả kiểm chứng có quản trị đã hoàn tất sẽ xuất hiện tại đây.",
    download: "Tải báo cáo kiểm chứng",
  },
  releases: {
    title: "Gói phát hành",
    empty: "Chưa có gói phát hành",
    emptyHint: "Manifest bất biến đã duyệt sẽ xuất hiện tại đây.",
    manifestUnavailable: "Manifest chưa sẵn sàng",
    methods: "phương pháp",
    limitations: "giới hạn",
    approvers: "người phê duyệt",
    download: "Tải manifest phát hành",
  },
  export: {
    unavailable: "Không thể xuất hồ sơ",
    statusUnavailable: "Không thể kiểm tra trạng thái xuất hồ sơ",
    rejected: "Yêu cầu xuất hồ sơ bị từ chối",
    failed: "Yêu cầu xuất hồ sơ không thành công",
    download: "Tải manifest hồ sơ",
    requesting: "Đang yêu cầu…",
    building: "Đang dựng hồ sơ…",
    build: "Dựng hồ sơ",
  },
  pilot: {
    title: "Đo lường thí điểm",
    eligibility: "Điều kiện thông lượng có quản trị",
    eligible: "đủ điều kiện",
    notEligible: "chưa đủ điều kiện",
    rule: "Nhiệm vụ phải ĐÃ PHÁT HÀNH với hồ sơ hoàn chỉnh, độ phủ bằng chứng đạt, quyết định trọng yếu có người chịu trách nhiệm và luận điểm phát hành truy nguyên được.",
    download: "Tải JSON đo lường",
    openMission: "Mở nhiệm vụ",
    durations: "Thời lượng theo giai đoạn",
    creationToApproval: "Khởi tạo → phê duyệt",
    approvalToBuilding: "Phê duyệt → xây dựng",
    buildingToVerification: "Xây dựng → kiểm chứng",
    verificationToRelease: "Kiểm chứng → phát hành",
    unavailable: "Chưa có dữ liệu",
    minute: "phút",
    hour: "giờ",
    coverage: "Độ phủ và trách nhiệm giải trình",
    requirementsEvidenced: "Yêu cầu có bằng chứng",
    requirementsPassed: "Yêu cầu đã đạt kiểm chứng",
    accountableDecisions: "Quyết định có người chịu trách nhiệm",
    traceableClaims: "Luận điểm phát hành truy nguyên được",
    rework: "Tín hiệu làm lại được lưu giữ",
    unavailableMeasurements: "Phép đo chưa có dữ liệu",
  },
};

export const reportsCopy = { en, vi };

const viValues: Record<string, string> = {
  DRAFT: "Bản nháp",
  INTAKE: "Tiếp nhận",
  SCOPED: "Đã xác định phạm vi",
  CONTRACT_REVIEW: "Duyệt hợp đồng",
  APPROVED: "Đã duyệt",
  EXPLORING: "Đang khám phá",
  BUILDING: "Đang xây dựng",
  VERIFYING: "Đang kiểm chứng",
  REVIEW: "Đang rà soát",
  RELEASED: "Đã phát hành",
  PARTIAL: "Một phần",
  BLOCKED: "Bị chặn",
  REFUTED: "Bị bác bỏ",
  CANCELLED: "Đã hủy",
  ARCHIVED: "Đã lưu trữ",
  READY: "Sẵn sàng",
  READY_WITH_DEFERRED: "Sẵn sàng, còn hạng mục hoãn",
  NOT_READY: "Chưa sẵn sàng",
  NOT_REQUIRED: "Không bắt buộc",
  INDEPENDENT: "Độc lập",
  NOT_INDEPENDENT: "Không độc lập",
  INTERNAL: "Nội bộ",
  PUBLIC: "Công khai",
};

export function reportValueLabel(locale: Locale, value: string): string {
  if (locale === "vi" && viValues[value]) return viValues[value];
  const human = value.toLowerCase().replaceAll("_", " ");
  return locale === "en"
    ? human.replace(/(^|\s)\S/g, (letter) => letter.toUpperCase())
    : human;
}

const reworkLabels = {
  totalAgentRuns: ["total agent runs", "tổng lượt agent"],
  retries: ["retries", "lần thử lại"],
  deviations: ["deviations", "sai lệch"],
  openDeviations: ["open deviations", "sai lệch đang mở"],
  disputes: ["disputes", "tranh chấp"],
  failedVerificationScenarios: [
    "failed verification scenarios",
    "kịch bản kiểm chứng không đạt",
  ],
} as const;

export function reworkLabel(locale: Locale, key: string): string {
  const label = reworkLabels[key as keyof typeof reworkLabels];
  if (label) return label[locale === "en" ? 0 : 1];
  return key.replaceAll(/([A-Z])/g, " $1").toLowerCase();
}

const pilotMetrics = {
  evidenceRetrievalTime: {
    name: "Thời gian truy xuất bằng chứng",
    reason:
      "Chưa có sự kiện đo thời gian người dùng được lưu giữ; cần đo trong quá trình quan sát thí điểm.",
  },
  reworkHours: {
    name: "Số giờ làm lại",
    reason:
      "Sổ cái giữ lại tín hiệu làm lại nhưng chưa có bản ghi giờ công có thẩm quyền.",
  },
  defectsCaughtBeforeProduction: {
    name: "Lỗi được phát hiện trước production",
    reason: "Kết quả lỗi production nằm ngoài sổ cái HIVE OS hiện tại.",
  },
  changeApprovalImprovementPercent: {
    name: "Mức cải thiện phê duyệt thay đổi",
    reason: "Chưa lưu giữ đường cơ sở trước thí điểm có thể so sánh.",
  },
} as const;

export function pilotMetricCopy(
  locale: Locale,
  metric: string,
  reason: string,
): { name: string; reason: string } {
  if (locale === "en") return { name: metric, reason };
  return (
    pilotMetrics[metric as keyof typeof pilotMetrics] ?? {
      name: metric,
      reason,
    }
  );
}

export function durationUnavailableReason(
  locale: Locale,
  reason: string | null,
  fallback: string,
): string {
  if (locale === "en") return reason || fallback;
  if (reason === "Both authoritative boundary timestamps are required.") {
    return "Cần đủ hai mốc thời gian ranh giới có thẩm quyền.";
  }
  if (reason === "Retained timestamps are not chronologically valid.") {
    return "Các mốc thời gian được lưu giữ không hợp lệ theo thứ tự thời gian.";
  }
  return reason || fallback;
}
