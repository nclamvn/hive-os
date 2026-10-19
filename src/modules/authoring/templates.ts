import type { AuthoringDocumentType, AuthoringSection } from "./contracts";

const VI: Record<AuthoringDocumentType, readonly [string, string][]> = {
  RESEARCH_PROPOSAL: [
    ["problem", "Vấn đề và câu hỏi nghiên cứu"],
    ["context", "Bối cảnh và tổng quan tài liệu"],
    ["objectives", "Mục tiêu và giả thuyết"],
    ["methodology", "Phương pháp nghiên cứu"],
    ["evidence", "Dữ liệu, bằng chứng và nguồn"],
    ["plan", "Kế hoạch thực hiện"],
    ["risk-limitations", "Rủi ro, giới hạn và trách nhiệm"],
    ["references", "Tài liệu tham khảo"],
  ],
  TECHNICAL_PROPOSAL: [
    ["need", "Nhu cầu và bài toán kỹ thuật"],
    ["scope", "Phạm vi và yêu cầu"],
    ["architecture", "Phương án kỹ thuật"],
    ["methodology", "Phương pháp triển khai"],
    ["verification", "Kiểm thử và tiêu chí nghiệm thu"],
    ["plan", "Kế hoạch, nguồn lực và tiến độ"],
    ["risk-limitations", "Rủi ro, giới hạn và trách nhiệm"],
    ["references", "Căn cứ và tài liệu tham khảo"],
  ],
  CLIENT_PROPOSAL: [
    ["client-need", "Nhu cầu của khách hàng"],
    ["scope", "Phạm vi đề xuất"],
    ["solution", "Giải pháp"],
    ["deliverables", "Sản phẩm bàn giao"],
    ["plan", "Kế hoạch triển khai"],
    ["budget", "Chi phí và điều kiện thương mại"],
    ["risk-limitations", "Rủi ro, giả định và trách nhiệm"],
    ["acceptance", "Tiêu chí nghiệm thu"],
  ],
  COURSE_DOSSIER: [
    ["learners", "Người học và nhu cầu"],
    ["outcomes", "Chuẩn đầu ra"],
    ["curriculum", "Cấu trúc chương trình"],
    ["methodology", "Phương pháp giảng dạy"],
    ["assessment", "Đánh giá kết quả học tập"],
    ["resources", "Học liệu và nguồn"],
    ["quality", "Bảo đảm chất lượng"],
  ],
  RESEARCH_PAPER: [
    ["introduction", "Đặt vấn đề"],
    ["related-work", "Tổng quan nghiên cứu"],
    ["methodology", "Phương pháp"],
    ["results", "Kết quả"],
    ["discussion", "Thảo luận"],
    ["risk-limitations", "Giới hạn nghiên cứu"],
    ["conclusion", "Kết luận"],
    ["references", "Tài liệu tham khảo"],
  ],
  OTHER: [
    ["purpose", "Mục đích"],
    ["scope", "Phạm vi"],
    ["content", "Nội dung"],
    ["risk-limitations", "Rủi ro, giới hạn và trách nhiệm"],
    ["references", "Tài liệu tham khảo"],
  ],
};

const EN: Record<AuthoringDocumentType, readonly [string, string][]> = {
  RESEARCH_PROPOSAL: [
    ["problem", "Research problem and question"],
    ["context", "Context and literature review"],
    ["objectives", "Objectives and hypotheses"],
    ["methodology", "Research methodology"],
    ["evidence", "Data, evidence and sources"],
    ["plan", "Delivery plan"],
    ["risk-limitations", "Risks, limitations and accountability"],
    ["references", "References"],
  ],
  TECHNICAL_PROPOSAL: [
    ["need", "Technical need"],
    ["scope", "Scope and requirements"],
    ["architecture", "Technical approach"],
    ["methodology", "Implementation method"],
    ["verification", "Verification and acceptance"],
    ["plan", "Plan, resources and schedule"],
    ["risk-limitations", "Risks, limitations and accountability"],
    ["references", "Basis and references"],
  ],
  CLIENT_PROPOSAL: [
    ["client-need", "Client need"],
    ["scope", "Proposed scope"],
    ["solution", "Solution"],
    ["deliverables", "Deliverables"],
    ["plan", "Delivery plan"],
    ["budget", "Commercial terms"],
    ["risk-limitations", "Risks, assumptions and accountability"],
    ["acceptance", "Acceptance criteria"],
  ],
  COURSE_DOSSIER: [
    ["learners", "Learners and needs"],
    ["outcomes", "Learning outcomes"],
    ["curriculum", "Curriculum structure"],
    ["methodology", "Teaching methodology"],
    ["assessment", "Learning assessment"],
    ["resources", "Learning resources and sources"],
    ["quality", "Quality assurance"],
  ],
  RESEARCH_PAPER: [
    ["introduction", "Introduction"],
    ["related-work", "Related work"],
    ["methodology", "Methodology"],
    ["results", "Results"],
    ["discussion", "Discussion"],
    ["risk-limitations", "Research limitations"],
    ["conclusion", "Conclusion"],
    ["references", "References"],
  ],
  OTHER: [
    ["purpose", "Purpose"],
    ["scope", "Scope"],
    ["content", "Content"],
    ["risk-limitations", "Risks, limitations and accountability"],
    ["references", "References"],
  ],
};

export function initialAuthoringSections(
  type: AuthoringDocumentType,
  locale: "vi" | "en",
): AuthoringSection[] {
  return (locale === "vi" ? VI : EN)[type].map(([key, heading]) => ({
    key,
    heading,
    kind: key.includes("method")
      ? "METHODOLOGY"
      : key.includes("risk")
        ? "RISK"
        : key.includes("budget")
          ? "BUDGET"
          : key.includes("evidence") || key.includes("reference")
            ? "EVIDENCE"
            : "NARRATIVE",
    body: "",
  }));
}
