import type { Locale } from "./config";
import type { DeepCopy } from "./copy-types";

const en = {
  page: {
    title: "Skill Library",
    subtitle: "Immutable capability contracts for governed execution.",
    eyebrow: "Capability authority",
    heading: "Know what can run before anything runs.",
    description:
      "Registry entries declare capabilities, evidence duties, failure states, verifier binding and resource ceilings. This library does not execute providers.",
    registered: "Registered",
    active: "Active",
    registerTitle: "Register a new skill contract",
    registerHint:
      "Initial registration is atomic: the skill and immutable v1 contract become active together.",
    readOnlyNotice:
      "Your role can inspect contracts but cannot manage the registry.",
    registry: "Workspace registry",
    stableOrder: "Stable key order",
    capabilities: "Capabilities",
    assurance: "Assurance",
    verifier: "Verifier",
    resourceCeiling: "Resource ceiling",
    activeVersion: "active v",
    immutableVersion: "immutable version",
    immutableVersions: "immutable versions",
    governance: "Contract governance",
    governedReadOnly: "Read-only governed contract",
    empty: "No registered skill contracts",
    emptyManager: "Register the first bounded capability contract above.",
    emptyViewer:
      "An Owner or Admin must register the first bounded capability contract.",
  },
  form: {
    saving: "Saving…",
    save: "Save governed record",
    semanticVersion: "Semantic version",
    verifierKey: "Verifier key",
    capabilities: "Capabilities",
    requiredEvidence: "Required evidence",
    failureStates: "Failure states",
    inputSchema: "Input JSON Schema",
    outputSchema: "Output JSON Schema",
    verifierKind: "Verifier kind",
    deterministic: "Deterministic",
    human: "Human",
    external: "External",
    maxSeconds: "Max seconds",
    maxMemory: "Max memory MB",
    assuranceCompatibility: "Assurance compatibility",
    registerLabel: "Register skill contract",
    registerSuccess: "Skill and active v1 contract registered",
    skillKey: "Stable skill key",
    displayName: "Display name",
    description: "Operator description",
    registerCandidate: "Register inert candidate",
    registerVersionLabel: "Register version for",
    registerVersionSuccess: "Candidate version registered without activation",
    activateCandidate: "Activate candidate",
    activateLabel: "Activate version for",
    activateSuccess: "Candidate explicitly activated",
    candidateVersion: "Candidate version",
    activationReason: "Activation reason",
    lifecycle: "Change lifecycle status",
    changeStatusLabel: "Change status for",
    changeStatusSuccess: "Skill status changed",
    nextStatus: "Next status",
    governanceReason: "Governance reason",
    archived: "Archived skill families are terminal and cannot be reopened.",
    actionError:
      "Could not save the governed record. Review the contract and try again.",
  },
} as const;

const vi: DeepCopy<typeof en> = {
  page: {
    title: "Thư viện kỹ năng",
    subtitle: "Hợp đồng năng lực bất biến cho hoạt động thực thi có quản trị.",
    eyebrow: "Thẩm quyền năng lực",
    heading: "Biết rõ năng lực nào được phép chạy trước khi thực thi.",
    description:
      "Mỗi mục đăng ký xác định năng lực, nghĩa vụ bằng chứng, trạng thái lỗi, ràng buộc bộ kiểm chứng và trần tài nguyên. Thư viện này không trực tiếp thực thi nhà cung cấp.",
    registered: "Đã đăng ký",
    active: "Đang hoạt động",
    registerTitle: "Đăng ký hợp đồng kỹ năng mới",
    registerHint:
      "Đăng ký ban đầu là một giao dịch nguyên tử: kỹ năng và hợp đồng v1 bất biến cùng được kích hoạt.",
    readOnlyNotice:
      "Vai trò của bạn có thể xem hợp đồng nhưng không thể quản lý sổ đăng ký.",
    registry: "Sổ đăng ký của không gian làm việc",
    stableOrder: "Thứ tự khóa ổn định",
    capabilities: "Năng lực",
    assurance: "Bảo chứng",
    verifier: "Bộ kiểm chứng",
    resourceCeiling: "Trần tài nguyên",
    activeVersion: "đang hoạt động v",
    immutableVersion: "phiên bản bất biến",
    immutableVersions: "phiên bản bất biến",
    governance: "Quản trị hợp đồng",
    governedReadOnly: "Hợp đồng có quản trị chỉ đọc",
    empty: "Chưa có hợp đồng kỹ năng",
    emptyManager: "Đăng ký hợp đồng năng lực có giới hạn đầu tiên ở phía trên.",
    emptyViewer:
      "Chủ sở hữu hoặc Quản trị viên phải đăng ký hợp đồng năng lực đầu tiên.",
  },
  form: {
    saving: "Đang lưu…",
    save: "Lưu bản ghi có quản trị",
    semanticVersion: "Phiên bản ngữ nghĩa",
    verifierKey: "Khóa bộ kiểm chứng",
    capabilities: "Năng lực",
    requiredEvidence: "Bằng chứng bắt buộc",
    failureStates: "Trạng thái lỗi",
    inputSchema: "JSON Schema đầu vào",
    outputSchema: "JSON Schema đầu ra",
    verifierKind: "Loại bộ kiểm chứng",
    deterministic: "Tất định",
    human: "Con người",
    external: "Bên ngoài",
    maxSeconds: "Thời lượng tối đa (giây)",
    maxMemory: "Bộ nhớ tối đa (MB)",
    assuranceCompatibility: "Hồ sơ bảo chứng tương thích",
    registerLabel: "Đăng ký hợp đồng kỹ năng",
    registerSuccess: "Đã đăng ký kỹ năng và kích hoạt hợp đồng v1",
    skillKey: "Khóa kỹ năng ổn định",
    displayName: "Tên hiển thị",
    description: "Mô tả dành cho người vận hành",
    registerCandidate: "Đăng ký phiên bản ứng viên chưa kích hoạt",
    registerVersionLabel: "Đăng ký phiên bản cho",
    registerVersionSuccess:
      "Đã đăng ký phiên bản ứng viên nhưng chưa kích hoạt",
    activateCandidate: "Kích hoạt phiên bản ứng viên",
    activateLabel: "Kích hoạt phiên bản cho",
    activateSuccess: "Đã kích hoạt rõ ràng phiên bản ứng viên",
    candidateVersion: "Phiên bản ứng viên",
    activationReason: "Lý do kích hoạt",
    lifecycle: "Thay đổi trạng thái vòng đời",
    changeStatusLabel: "Đổi trạng thái cho",
    changeStatusSuccess: "Đã thay đổi trạng thái kỹ năng",
    nextStatus: "Trạng thái tiếp theo",
    governanceReason: "Lý do quản trị",
    archived:
      "Nhóm kỹ năng đã lưu trữ là trạng thái kết thúc và không thể mở lại.",
    actionError:
      "Không thể lưu bản ghi có quản trị. Hãy kiểm tra hợp đồng và thử lại.",
  },
};

export const skillsCopy = { en, vi };
export type SkillsCopy = DeepCopy<typeof en>;

const viValues: Record<string, string> = {
  ACTIVE: "Đang hoạt động",
  DEPRECATED: "Không còn khuyến nghị",
  ARCHIVED: "Đã lưu trữ",
  QUICK: "Nhanh",
  PROFESSIONAL: "Chuyên nghiệp",
  RESEARCH: "Nghiên cứu",
  REGULATED: "Có kiểm soát",
  DETERMINISTIC: "Tất định",
  HUMAN: "Con người",
  EXTERNAL: "Bên ngoài",
};

export function skillValueLabel(locale: Locale, value: string): string {
  if (locale === "vi" && viValues[value]) return viValues[value];
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());
}
