import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import type { AuthoringContent } from "../../src/modules/authoring/contracts";
import {
  renderAuthoringDocx,
  renderAuthoringPdf,
} from "../../src/modules/authoring/export";
import { assessAuthoringQuality } from "../../src/modules/authoring/quality";

const outputDirectory = resolve(process.argv[2] ?? "/tmp/hiveos-authoring-qa");

const content: AuthoringContent = {
  title: "Đề án khảo sát và giám sát tài nguyên rừng bằng UAV",
  abstract:
    "Đề án xác lập phương pháp thu thập dữ liệu, kiểm chứng hiện trường, quản trị nguồn và trách nhiệm nghiệm thu cho một chương trình khảo sát quy mô lớn.",
  sections: [
    {
      key: "context",
      heading: "1. Bối cảnh và mục tiêu",
      kind: "NARRATIVE",
      body: "Hồ sơ khảo sát phải cho phép truy nguyên từ kết luận đến nguồn dữ liệu gốc. Mỗi khu vực bay được gắn với nhiệm vụ, thời điểm thu nhận và người chịu trách nhiệm. Quy trình kỹ thuật tham chiếu tài liệu đã được lưu trong kho bằng chứng [@uav-protocol].",
    },
    {
      key: "methodology",
      heading: "2. Phương pháp nghiên cứu và khảo sát",
      kind: "METHODOLOGY",
      body: "Nhóm thực hiện chia khu vực thành các lô công tác có ranh giới rõ. Kế hoạch bay, kiểm tra an toàn, điểm khống chế và tiêu chí chất lượng được phê duyệt trước khi thu nhận. Dữ liệu ảnh được đối soát với mẫu kiểm tra hiện trường, sau đó mới được đưa vào phân tích [@uav-protocol].\n\nMọi sai lệch giữa dữ liệu ảnh và ghi nhận hiện trường được giữ lại như một vấn đề cần giải quyết. Báo cáo không thay giá trị thiếu bằng suy đoán và không mở rộng kết luận ra ngoài phạm vi quan sát.",
    },
    {
      key: "risk-limitations",
      heading: "3. Rủi ro, giới hạn và trách nhiệm",
      kind: "RISK",
      body: "Chủ nhiệm đề án chịu trách nhiệm xác nhận phạm vi và phương pháp. Trưởng nhóm bay chịu trách nhiệm về nhật ký vận hành. Bộ phận kiểm chứng độc lập xác nhận mẫu đối soát và ghi nhận ngoại lệ. Mây che, giới hạn tiếp cận, sai số định vị và thiếu mẫu hiện trường phải được công bố trong kết luận.",
    },
    {
      key: "references",
      heading: "4. Tài liệu tham khảo",
      kind: "EVIDENCE",
      body: "Nguồn kỹ thuật chính được giữ dưới snapshot bất biến và trích dẫn bằng mã [@uav-protocol].",
    },
  ],
  citations: [
    {
      key: "uav-protocol",
      title: "Quy trình kỹ thuật khảo sát hiện trường và thu nhận ảnh UAV",
      authors: "Hội đồng kỹ thuật",
      year: "2026",
      publisher: "Real-time Robotics Vietnam",
      canonicalUri: "https://example.com/uav-survey-protocol",
      locator: "Mục 2 và Mục 5",
      evidenceSourceId: null,
      researchRunId: null,
      researchSourceId: null,
      sourceDigest: null,
    },
  ],
  computationalArtifacts: [
    {
      type: "JUPYTER_NOTEBOOK",
      label: "Đối soát mẫu hiện trường",
      storageReference: "s3://hiveos-evidence/notebooks/field-validation.ipynb",
      contentHash: "a".repeat(64),
      mediaType: "application/x-ipynb+json",
      verifierNote: "Notebook được chạy trong môi trường tách biệt và lưu kết quả kiểm chứng.",
    },
  ],
  researchImports: [],
};

const quality = assessAuthoringQuality("RESEARCH_PROPOSAL", content);
if (quality.blockerCount > 0) {
  throw new Error(`Sample has ${quality.blockerCount} blocking findings`);
}

await mkdir(outputDirectory, { recursive: true });
await Promise.all([
  writeFile(
    resolve(outputDirectory, "governed-authoring-sample.docx"),
    await renderAuthoringDocx(content, quality),
  ),
  writeFile(
    resolve(outputDirectory, "governed-authoring-sample.pdf"),
    await renderAuthoringPdf(content, quality),
  ),
]);

process.stdout.write(`${outputDirectory}\n`);
