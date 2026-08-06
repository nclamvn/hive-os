import type { Locale } from "./config";

const labels = {
  en: {
    PUBLIC: "Public",
    WORKSPACE: "Workspace",
    RESTRICTED: "Restricted",
    SUPPORTS: "Supports",
    CONTRADICTS: "Contradicts",
    DISPUTED: "Disputed",
    OPEN_INCOMPLETE: "Open, incomplete",
    SOURCED: "sourced",
    QUICK: "Quick",
    PROFESSIONAL: "Professional",
    RESEARCH: "Research",
    REGULATED: "Regulated",
    OPEN: "Open",
    IN_PROGRESS: "In progress",
    DRAFT: "Draft",
    INTAKE: "Intake",
    SCOPED: "Scoped",
    CONTRACT_REVIEW: "Contract review",
    APPROVED: "Approved",
    EXPLORING: "Exploring",
    BUILDING: "Building",
    VERIFYING: "Verifying",
    REVIEW: "Review",
    RELEASED: "Released",
    PARTIAL: "Partial",
    REFUTED: "Refuted",
    CANCELLED: "Cancelled",
    ARCHIVED: "Archived",
    SATISFIED: "Satisfied",
    WAIVED: "Waived",
    BLOCKED: "Blocked",
  },
  vi: {
    PUBLIC: "Công khai",
    WORKSPACE: "Không gian làm việc",
    RESTRICTED: "Hạn chế",
    SUPPORTS: "Ủng hộ",
    CONTRADICTS: "Mâu thuẫn",
    DISPUTED: "Đang tranh chấp",
    OPEN_INCOMPLETE: "Mở, chưa hoàn tất",
    SOURCED: "có nguồn",
    QUICK: "Nhanh",
    PROFESSIONAL: "Chuyên nghiệp",
    RESEARCH: "Nghiên cứu",
    REGULATED: "Được kiểm soát",
    OPEN: "Chưa bắt đầu",
    IN_PROGRESS: "Đang thực hiện",
    DRAFT: "Bản nháp",
    INTAKE: "Tiếp nhận",
    SCOPED: "Đã xác định",
    CONTRACT_REVIEW: "Đang duyệt hợp đồng",
    APPROVED: "Đã duyệt",
    EXPLORING: "Đang khảo sát",
    BUILDING: "Đang xây dựng",
    VERIFYING: "Đang kiểm chứng",
    REVIEW: "Đang rà soát",
    RELEASED: "Đã phát hành",
    PARTIAL: "Hoàn thành một phần",
    REFUTED: "Đã bác bỏ",
    CANCELLED: "Đã hủy",
    ARCHIVED: "Đã lưu trữ",
    SATISFIED: "Đã hoàn thành",
    WAIVED: "Đã miễn trừ",
    BLOCKED: "Đang bị chặn",
  },
} as const;

export function enumLabel(locale: Locale, value: string): string {
  const translated =
    labels[locale][value as keyof (typeof labels)[typeof locale]];
  if (translated) return translated;
  const human = value.toLowerCase().replace(/[._]/g, " ");
  return locale === "en"
    ? human.replace(/(^|\s)\S/g, (letter) => letter.toUpperCase())
    : human;
}

export function formatDate(locale: Locale, value: Date | string): string {
  return new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(value));
}

export function formatDateTime(locale: Locale, value: Date | string): string {
  return new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatNumber(locale: Locale, value: number): string {
  return new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US").format(
    value,
  );
}
