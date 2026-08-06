export type MissionNextAction = {
  description: string;
  href: string;
  label: string;
  phase: number;
  phaseLabel: string;
};

type ActionCapabilities = {
  canResearch?: boolean;
};

export function getMissionNextAction({
  basePath,
  locale,
  missionId,
  status,
  capabilities = {},
}: {
  basePath: string;
  locale: "vi" | "en";
  missionId: string;
  status: string;
  capabilities?: ActionCapabilities;
}): MissionNextAction {
  const dossier = `${basePath}/missions/${missionId}`;
  const research = `${basePath}/research?missionId=${missionId}`;

  if (["DRAFT", "INTAKE", "SCOPED", "CONTRACT_REVIEW"].includes(status)) {
    return {
      phase: status === "DRAFT" || status === "INTAKE" ? 0 : 1,
      phaseLabel: copy(locale, "Define the work", "Xác định công việc"),
      label: copy(
        locale,
        "Continue the contract",
        "Tiếp tục hoàn thiện hợp đồng",
      ),
      description: copy(
        locale,
        "Complete the scope, success definition and review before execution begins.",
        "Hoàn thiện phạm vi, định nghĩa thành công và phê duyệt trước khi bắt đầu thực hiện.",
      ),
      href: dossier,
    };
  }

  if (status === "APPROVED") {
    return capabilities.canResearch
      ? {
          phase: 2,
          phaseLabel: copy(
            locale,
            "Build the evidence base",
            "Xây dựng nền bằng chứng",
          ),
          label: copy(locale, "Start governed research", "Bắt đầu nghiên cứu"),
          description: copy(
            locale,
            "The contract is approved. Define the research question and source boundary for the first retained run.",
            "Hợp đồng đã được duyệt. Hãy xác định câu hỏi và ranh giới nguồn cho lượt nghiên cứu đầu tiên.",
          ),
          href: research,
        }
      : {
          phase: 2,
          phaseLabel: copy(
            locale,
            "Build the evidence base",
            "Xây dựng nền bằng chứng",
          ),
          label: copy(locale, "Open the mission dossier", "Mở hồ sơ nhiệm vụ"),
          description: copy(
            locale,
            "The contract is approved. Open the dossier to continue with an authorized action.",
            "Hợp đồng đã được duyệt. Mở hồ sơ để tiếp tục bằng một hành động được cấp quyền.",
          ),
          href: dossier,
        };
  }

  if (status === "EXPLORING") {
    return {
      phase: 2,
      phaseLabel: copy(
        locale,
        "Research and evidence",
        "Nghiên cứu và bằng chứng",
      ),
      label: capabilities.canResearch
        ? copy(locale, "Continue research", "Tiếp tục nghiên cứu")
        : copy(locale, "Open the mission dossier", "Mở hồ sơ nhiệm vụ"),
      description: copy(
        locale,
        "Continue collecting sources, resolving claims and retaining the evidence trail.",
        "Tiếp tục thu thập nguồn, xử lý luận điểm và lưu giữ dấu vết bằng chứng.",
      ),
      href: capabilities.canResearch ? research : dossier,
    };
  }

  if (status === "BUILDING") {
    return {
      phase: 3,
      phaseLabel: copy(
        locale,
        "Execute the approved work",
        "Thực hiện công việc đã duyệt",
      ),
      label: copy(locale, "Continue execution", "Tiếp tục thực thi"),
      description: copy(
        locale,
        "Review the active work package, retained instructions and completion obligations.",
        "Rà soát gói công việc, chỉ dẫn được lưu giữ và các nghĩa vụ hoàn thành đang hoạt động.",
      ),
      href: `${basePath}/execution`,
    };
  }

  if (["VERIFYING", "REVIEW", "PARTIAL"].includes(status)) {
    return {
      phase: 4,
      phaseLabel: copy(
        locale,
        "Verify before release",
        "Kiểm chứng trước phát hành",
      ),
      label: copy(locale, "Continue verification", "Tiếp tục kiểm chứng"),
      description: copy(
        locale,
        "Resolve outstanding scenarios, independent review and release evidence.",
        "Hoàn tất kịch bản còn thiếu, rà soát độc lập và bằng chứng phát hành.",
      ),
      href: `${basePath}/verification`,
    };
  }

  if (status === "RELEASED") {
    return {
      phase: 5,
      phaseLabel: copy(locale, "Released", "Đã phát hành"),
      label: copy(locale, "Open the released record", "Mở hồ sơ đã phát hành"),
      description: copy(
        locale,
        "Inspect the retained report, manifest and evidence ceiling.",
        "Xem báo cáo, manifest và trần bằng chứng đã được lưu giữ.",
      ),
      href: `${basePath}/reports`,
    };
  }

  return {
    phase: status === "BLOCKED" ? 2 : 0,
    phaseLabel: copy(locale, "Review required", "Cần rà soát"),
    label: copy(locale, "Review the mission", "Rà soát nhiệm vụ"),
    description: copy(
      locale,
      "Open the governed dossier to understand the current state and available recovery actions.",
      "Mở hồ sơ được quản trị để xem trạng thái hiện tại và các hành động khôi phục được phép.",
    ),
    href: dossier,
  };
}

function copy(locale: "vi" | "en", en: string, vi: string) {
  return locale === "vi" ? vi : en;
}
