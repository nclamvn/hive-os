import { researchSourcePolicySchema, researchSteeringBrief } from "@/modules/research-sandbox/research-steering";

/** Presentation only: validate the existing bounded contract, never rewrite the
 * problem or turn an entered idea into an AI result. No host mandate is exported. */
export function prepareMathematicalResearchNote(input: Parameters<typeof researchSteeringBrief>[0] & { relatedDocument?: { title: string | null } }, locale: "en" | "vi") {
  researchSteeringBrief(input);
  const en = locale === "en";
  const policy = researchSourcePolicySchema.parse(input.parent?.sourcePolicy ?? input.sourcePolicy ?? {});
  const prior = input.parent?.snapshot;
  return [
    en ? "Research note" : "Ghi chú nghiên cứu",
    en ? "Prepared from your entered problem and ideas. No AI answer, source lookup or mathematical verification has been produced by preparing this note." : "Được chuẩn bị từ đề bài và ý tưởng bạn nhập. Việc tạo ghi chú không sinh câu trả lời AI, tra cứu nguồn hay kiểm chứng toán học.",
    `${en ? "Problem and intended result" : "Bài toán và kết quả mong muốn"}\n${input.goal}`,
    `${en ? "Proposed way forward" : "Hướng nghiên cứu dự kiến"}\n${input.mode === "HUMAN" ? (en ? "I propose the direction." : "Tôi đề xuất hướng đi.") : (en ? "Ask AI to suggest a direction when connected; none has been generated yet." : "Đề nghị AI gợi ý hướng đi khi được kết nối, hiện chưa có gợi ý được sinh ra.")}\n${input.guidance}`,
    ...(input.relatedDocument ? [`${en ? "Selected related document" : "Tài liệu liên quan đã chọn"}\n${input.relatedDocument.title ?? (en ? "A related document is selected; its title is not available in this view." : "Đã chọn tài liệu liên quan, tiêu đề chưa có trong khung nhìn này.")}\n${en ? "Its contents have not been read or verified by preparing this note. This is a reference to an existing record, not an uploaded attachment." : "Soạn ghi chú chưa đọc hay kiểm chứng nội dung tài liệu. Đây là tham chiếu hồ sơ có sẵn, không phải tệp vừa được tải lên."}`] : []),
    ...(input.parent ? [`${en ? "Retained scope" : "Phạm vi được giữ lại"}\n${input.parent.scope}`] : []),
    [en ? "Reference boundaries" : "Giới hạn tài liệu tham khảo",
      `${en ? "Use sources from" : "Chỉ dùng nguồn từ"}: ${policy.allowedDomains.join(", ") || (en ? "No domain restriction specified" : "Chưa giới hạn tên miền")}`,
      `${en ? "Primary source domains" : "Miền nguồn sơ cấp"}: ${policy.primaryDomains.join(", ") || (en ? "Not specified" : "Chưa chỉ định")}`,
      `${en ? "Require primary sources" : "Bắt buộc có nguồn sơ cấp"}: ${policy.requirePrimary ? (en ? "Yes" : "Có") : (en ? "No" : "Không")}`,
      `${en ? "Maximum sources to retain" : "Số nguồn giữ lại tối đa"}: ${policy.maxSources}`,
    ].join("\n"),
    ...(input.queries?.length ? [`${en ? "Questions for the literature search" : "Các câu hỏi khi tìm tài liệu"}\n${input.queries.join("\n")}`] : []),
    ...(prior ? [
      en ? "Earlier observations (not rechecked in this note)" : "Ghi nhận trước đây (chưa được kiểm lại trong ghi chú này)",
      ...prior.findings.map((finding, index) => `${index + 1}. ${finding.claim}${finding.claimTruncated ? (en ? " [excerpt shortened; original retained in the record]" : " [trích đoạn được rút gọn, bản gốc vẫn ở hồ sơ]") : ""}\n${en ? "Earlier review" : "Rà soát trước đây"}: ${finding.decision === "APPROVED" ? (en ? "Accepted in the earlier record" : "Đã chấp nhận trong hồ sơ trước") : finding.decision === "REJECTED" ? (en ? "Rejected in the earlier record" : "Đã từ chối trong hồ sơ trước") : (en ? "Not accepted or not yet reviewed" : "Chưa được chấp nhận hoặc chưa rà soát")}.`),
      `${en ? "Retained references" : "Tài liệu được giữ lại"}\n${prior.sources.map((source, index) => `${index + 1}. ${source.title}\n${source.uri}`).join("\n\n") || (en ? "No references in this excerpt." : "Chưa có tài liệu trong trích đoạn này.")}`,
      `${en ? "Not included in this bounded note" : "Chưa đưa vào ghi chú có giới hạn này"}: ${prior.omittedFindings} ${en ? "observations" : "ghi nhận"}, ${prior.omittedSources} ${en ? "references" : "tài liệu"}.`,
    ] : []),
    en ? "Working status: draft for discussion, not a proof or an accepted research result. Earlier records remain unchanged. This note is not saved to the server; download it if you want to keep it." : "Trạng thái: bản nháp để trao đổi, không phải chứng minh hay kết quả nghiên cứu đã nghiệm thu. Hồ sơ trước không thay đổi. Ghi chú này chưa được lưu lên hệ thống, hãy tải xuống nếu muốn giữ lại.",
  ].join("\n\n");
}
