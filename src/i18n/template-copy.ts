import type { MissionTemplate } from "@/modules/mission-templates";

import type { Locale } from "./config";

type LocalizedTemplateFields = Pick<
  MissionTemplate,
  | "domain"
  | "name"
  | "description"
  | "objective"
  | "scope"
  | "successDefinition"
  | "requirementTitle"
  | "requirementCriteria"
  | "obligationTitle"
>;

const viTemplates: Record<string, LocalizedTemplateFields> = {
  "rapid-operational-brief": {
    domain: "Vận hành",
    name: "Tóm lược vận hành nhanh",
    description:
      "Bản tóm lược quyết định có phạm vi rõ ràng cho công việc vận hành cần xử lý gấp.",
    objective:
      "Xây dựng bản tóm lược vận hành sẵn sàng cho quyết định đối với câu hỏi đã nêu.",
    scope:
      "Chỉ sử dụng bối cảnh được cung cấp và cửa sổ bằng chứng đã xác định rõ.",
    successDefinition:
      "Đưa ra khuyến nghị cô đọng, lưu dấu nguồn, nêu rủi ro và chỉ rõ hành động tiếp theo.",
    requirementTitle: "Câu hỏi quyết định được trả lời",
    requirementCriteria:
      "Bản tóm lược trả lời đúng câu hỏi đã duyệt và phân biệt sự kiện, giả định với khoảng trống còn mở.",
    obligationTitle: "Lưu giữ bằng chứng trọng yếu và các giới hạn",
  },
  "professional-product-delivery": {
    domain: "Sản phẩm",
    name: "Bàn giao sản phẩm chuyên nghiệp",
    description:
      "Hợp đồng bàn giao có quản trị dành cho các hạng mục sản phẩm đạt chất lượng vận hành thực tế.",
    objective:
      "Bàn giao hạng mục sản phẩm đã duyệt theo tiêu chuẩn chất lượng vận hành thực tế.",
    scope:
      "Chỉ triển khai trong các ranh giới chức năng, bảo mật và giao diện đã được duyệt.",
    successDefinition:
      "Các kịch bản chấp nhận đạt yêu cầu, có bằng chứng kiểm toán, hướng dẫn hoàn tác và không tạo trạng thái giả.",
    requirementTitle: "Hành vi sản phẩm đã duyệt được hoàn thiện",
    requirementCriteria:
      "Mọi kịch bản được chấp nhận đều được triển khai, kiểm chứng và truy nguyên tới bằng chứng lưu giữ.",
    obligationTitle: "Vượt qua cổng chất lượng sản phẩm",
  },
  "rtr-engineering-change": {
    domain: "Kỹ thuật deeptech",
    name: "Hồ sơ thay đổi kỹ thuật RtR",
    description:
      "Hồ sơ thay đổi và kiểm chứng có quản trị cho UAV, mô phỏng, điều khiển bay, gimbal hoặc hệ cảm biến.",
    objective:
      "Phê duyệt và phát hành một thay đổi kỹ thuật có phạm vi rõ ràng, quyết định có trách nhiệm, bằng chứng triển khai được lưu giữ và kiểm chứng độc lập.",
    scope:
      "Bao quát phân hệ được chỉ định, giao diện đã duyệt, ràng buộc an toàn, phương pháp chấp nhận và ranh giới hoàn tác; loại trừ các thiết kế lại lân cận không cần thiết.",
    successDefinition:
      "Thay đổi phát hành có hợp đồng đã duyệt, yêu cầu truy nguyên được, bằng chứng nguồn, bản ghi thực thi, kiểm chứng độc lập, phê chuẩn và manifest phát hành bất biến.",
    requirementTitle:
      "Thay đổi kỹ thuật được kiểm chứng theo đường cơ sở đã duyệt",
    requirementCriteria:
      "Phân hệ đã thay đổi đáp ứng phương pháp chấp nhận về chức năng và an toàn đã duyệt, kèm bằng chứng thử nghiệm chính xác, cấu hình định danh, kết quả quan sát và kết luận của người kiểm chứng.",
    obligationTitle: "Khép hồ sơ kiểm chứng thay đổi kỹ thuật",
  },
  "research-evidence-synthesis": {
    domain: "Nghiên cứu",
    name: "Tổng hợp bằng chứng nghiên cứu",
    description:
      "Bản tổng hợp có thể bác bỏ, giữ nguồn gốc, bất đồng và trung thực khi chưa có kết luận.",
    objective:
      "Trả lời câu hỏi nghiên cứu bằng quy trình tổng hợp bằng chứng có thể tái lập.",
    scope:
      "Sử dụng nguồn đã khai báo, tiêu chí lựa chọn và ranh giới tìm kiếm minh bạch.",
    successDefinition:
      "Các luận điểm có nguồn, xung đột được giữ lại, giới hạn được nêu rõ và kết luận có thể bị bác bỏ.",
    requirementTitle: "Quy trình tổng hợp bằng chứng có thể tái lập",
    requirementCriteria:
      "Người rà soát có thể thực hiện lại việc chọn nguồn, xác định đoạn trích và lập luận cho luận điểm.",
    obligationTitle: "Hoàn thành kiểm chứng độc lập",
  },
  "regulated-decision-record": {
    domain: "Quản trị",
    name: "Biên bản quyết định được kiểm soát",
    description:
      "Hồ sơ bảo chứng cao cho quyết định cần rà soát và phê chuẩn độc lập.",
    objective:
      "Lập biên bản quyết định có kiểm soát cho câu hỏi thuộc phạm vi quản lý đã duyệt.",
    scope:
      "Vận hành trong các ràng buộc đã nêu về chính sách, truy cập, lưu giữ và bằng chứng.",
    successDefinition:
      "Bản phát hành chứa luận điểm đã duyệt, kiểm chứng độc lập và phê chuẩn có trách nhiệm.",
    requirementTitle: "Quyết định được kiểm soát có đủ căn cứ bảo vệ",
    requirementCriteria:
      "Yêu cầu, bằng chứng, tính độc lập của người kiểm chứng và phê chuẩn đều đầy đủ, có thể kiểm toán.",
    obligationTitle: "Đáp ứng quản trị phát hành được kiểm soát",
  },
};

export const templatePageCopy = {
  vi: {
    title: "Mẫu",
    subtitle: "Điểm khởi đầu được quản trị cho hợp đồng nhiệm vụ.",
    eyebrow: "Danh mục hợp đồng",
    thesis: "Khởi đầu có quản trị. Luôn có thể chỉnh sửa.",
    description:
      "Mẫu cung cấp ngôn ngữ nháp xác định và cấu hình bảo chứng mặc định. Mẫu không tự phê duyệt hợp đồng hoặc bỏ qua bước rà soát.",
    count: (count: number) => `${count} mẫu tích hợp · danh mục v1`,
    sectionTitle: "Mẫu hợp đồng nhiệm vụ",
    versioned: "Theo phiên bản ứng dụng",
    contractMeta: (version: number) =>
      `v${version} · 1 yêu cầu · 1 nghĩa vụ có trọng số`,
    use: "Dùng mẫu này",
    useAria: (name: string) => `Dùng mẫu ${name}`,
  },
  en: {
    title: "Templates",
    subtitle: "Governed starting points for Mission contracts.",
    eyebrow: "Contract catalog",
    thesis: "Start governed. Stay editable.",
    description:
      "Templates provide deterministic draft language and assurance defaults. They never approve a contract or bypass review.",
    count: (count: number) => `${count} built-in templates · catalog v1`,
    sectionTitle: "Mission contract templates",
    versioned: "Application-versioned",
    contractMeta: (version: number) =>
      `v${version} · 1 requirement · 1 weighted obligation`,
    use: "Use this template",
    useAria: (name: string) => `Use ${name} template`,
  },
} as const;

export function localizeMissionTemplate(
  template: MissionTemplate,
  locale: Locale,
): MissionTemplate {
  if (locale === "en") return template;
  const copy = viTemplates[template.key];
  return copy ? { ...template, ...copy } : template;
}

export function localizedMissionTemplates(
  templates: readonly MissionTemplate[],
  locale: Locale,
): readonly MissionTemplate[] {
  return templates.map((template) => localizeMissionTemplate(template, locale));
}

export function hasVietnameseTemplateCopy(key: string): boolean {
  return key in viTemplates;
}
