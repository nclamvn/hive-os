import type { Locale } from "./config";

interface ActionFailure {
  error?: string;
  errorCode?: string;
}

const vi: Record<string, string> = {
  TRUTH_NOT_FOUND: "Không tìm thấy hồ sơ sự thật.",
  TRUTH_FORBIDDEN: "Bạn không có quyền thực hiện thao tác sự thật này.",
  TRUTH_INVARIANT: "Thao tác vi phạm bất biến của Truth Kernel.",
  EVIDENCE_SPAN_MISMATCH: "Đoạn trích không khớp với snapshot bất biến.",
  CORROBORATION_INSUFFICIENT: "Chưa đủ nguồn độc lập để đối chứng.",
  TRUTH_PROJECTION_FORBIDDEN: "Không được phép tạo bản chiếu sự thật này.",
  EXECUTION_NOT_FOUND: "Không tìm thấy hồ sơ thực thi.",
  EXECUTION_FORBIDDEN: "Bạn không có quyền thực hiện thao tác thực thi này.",
  EXECUTION_INPUT_INVALID: "Đầu vào thực thi không hợp lệ.",
  COMPLETION_REPORT_INVALID: "Báo cáo hoàn thành không hợp lệ.",
  EXECUTION_DEPENDENCY_BLOCKED: "Công việc phụ thuộc đang bị chặn.",
  COMPLETION_REPORT_ALREADY_IMPORTED: "Báo cáo hoàn thành đã được nhập.",
  EXECUTION_CONFLICT: "Trạng thái thực thi đã thay đổi; hãy tải lại.",
  EXECUTION_INVARIANT: "Thao tác vi phạm bất biến thực thi.",
  VERIFICATION_NOT_FOUND: "Không tìm thấy hồ sơ kiểm chứng.",
  VERIFICATION_FORBIDDEN:
    "Bạn không có quyền thực hiện thao tác kiểm chứng này.",
  VERIFICATION_INPUT_INVALID: "Đầu vào kiểm chứng không hợp lệ.",
  VERIFY_REPORT_INVALID: "Báo cáo kiểm chứng không hợp lệ.",
  VERIFIER_NOT_INDEPENDENT: "Người kiểm chứng không đạt yêu cầu độc lập.",
  VERIFICATION_NOT_READY: "Kiểm chứng chưa sẵn sàng để chuyển bước.",
  GOVERNANCE_SIGNOFF_REQUIRED: "Cần phê duyệt quản trị.",
  RELEASE_BLOCKED: "Bản phát hành đang bị chặn bởi cổng quản trị.",
  VERIFICATION_CONFLICT: "Trạng thái kiểm chứng đã thay đổi; hãy tải lại.",
  VERIFICATION_INVARIANT: "Thao tác vi phạm bất biến kiểm chứng.",
  INVALID_MISSION_TRANSITION: "Không thể chuyển nhiệm vụ sang trạng thái này.",
  MISSION_VERSION_CONFLICT: "Phiên bản nhiệm vụ đã thay đổi; hãy tải lại.",
  CONTRACT_VERSION_CONFLICT: "Phiên bản hợp đồng đã thay đổi; hãy tải lại.",
  CONTRACT_INCOMPLETE: "Hợp đồng chưa đầy đủ.",
  CONTRACT_ALREADY_APPROVED: "Hợp đồng đã được phê duyệt.",
  CURRENT_CONTRACT_EXISTS: "Nhiệm vụ đã có hợp đồng hiện hành.",
  IDEMPOTENCY_CONFLICT: "Yêu cầu trùng lặp có nội dung khác.",
  MATERIAL_DECISION_REQUIRED:
    "Cần quyết định trọng yếu của người có thẩm quyền.",
  MISSION_NOT_FOUND: "Không tìm thấy nhiệm vụ.",
  MISSION_FORBIDDEN: "Bạn không có quyền thực hiện thao tác nhiệm vụ này.",
  MISSION_INVARIANT: "Thao tác vi phạm bất biến nhiệm vụ.",
  TRUTH_KERNEL_REQUIRED: "Cần hoàn tất điều kiện của Truth Kernel.",
  EXECUTION_FABRIC_REQUIRED: "Cần hoàn tất điều kiện thực thi.",
  VERIFICATION_KERNEL_REQUIRED: "Cần hoàn tất điều kiện kiểm chứng.",
  RELEASE_AUTHORIZATION_REQUIRED: "Cần ủy quyền phát hành.",
};

export function localizedActionError(
  locale: Locale,
  failure: ActionFailure,
): string {
  if (locale === "vi" && failure.errorCode && vi[failure.errorCode]) {
    return vi[failure.errorCode];
  }
  if (failure.errorCode && failure.error) {
    return `${failure.errorCode}: ${failure.error}`;
  }
  return (
    failure.error ??
    (locale === "vi"
      ? "Thao tác không hoàn tất."
      : "The action did not complete.")
  );
}
