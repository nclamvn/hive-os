import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { Locale } from "@/i18n/config";

/** Navigation only: opening this overview never dispatches a research run. */
export function ResearchEntryPoints({
  locale, workspaceSlug, missionId, canRequest, localToolsAvailable,
}: {
  locale: Locale;
  workspaceSlug: string;
  missionId?: string;
  canRequest: boolean;
  localToolsAvailable: boolean;
}) {
  const vi = locale === "vi";
  const base = `/w/${workspaceSlug}/research`;
  const query = missionId ? `?missionId=${encodeURIComponent(missionId)}` : "";
  const entries = [
    ...(localToolsAvailable && canRequest ? [{
      href: `${base}/lean?advanced=1`,
      title: vi ? "Bàn tiếp nhận đầu ra AI thủ công" : "Manual AI-output workbench",
      description: vi
        ? "Nhập bài toán và đầu ra LLM thủ công; phản biện có mục tiêu, kiểm chứng đúng phạm vi. Không phải trình chứng minh Lean."
        : "Import a problem and LLM output manually; use focused criticism and scoped checks. This is not the Lean proof assistant.",
    }] : []),
    {
      href: `${base}/math-pilot${query}`,
      title: vi ? "Hồ sơ nghiên cứu" : "Research cases",
      description: vi
        ? "Theo dõi giả thuyết, lần thử, phản biện và các nghĩa vụ chưa khép của nhiệm vụ đã chọn."
        : "Follow hypotheses, attempts, reviews and open obligations for the selected mission.",
    },
    {
      href: `${base}/poly19${query}#poly19-showcase`,
      title: vi ? "Chứng minh và bằng chứng Poly19" : "Poly19 proof and evidence",
      description: vi
        ? "Xem hồ sơ bài mẫu công khai và phạm vi kiểm chứng; không phải điểm benchmark kín."
        : "Inspect the public-sample dossier and verification scope; not a private benchmark score.",
    },
    ...(localToolsAvailable ? [{
      href: `${base}/kakeya`,
      title: vi ? "Hồ sơ Kakeya K5" : "Kakeya K5 dossier",
      description: vi
        ? "Kết quả lưu trữ cho năm tam giác và giới hạn kết luận. Không phải chứng minh giả thuyết Kakeya tổng quát."
        : "Retained five-triangle results and claim boundaries. Not a proof of the general Kakeya conjecture.",
    }] : []),
  ];

  return (
    <section aria-labelledby="research-entry-title" className="mb-6 min-w-0">
      <h2 id="research-entry-title" className="text-section-title text-ink-strong">
        {vi ? "Hồ sơ, ví dụ và bàn làm việc" : "Cases, examples and workbenches"}
      </h2>
      <p className="text-body text-ink-muted mt-2 max-w-[76ch]">
        {vi
          ? "Đọc hồ sơ hoặc mở bàn làm việc. Điều hướng không tự chạy mô hình hay khởi động chiến dịch."
          : "Review a case or open a workbench. Navigation does not run a model or start a campaign."}
      </p>
      <ul className="border-line mt-5 grid border-t sm:grid-cols-2">
        {entries.map((entry) => (
          <li key={entry.href} className="border-line min-w-0 border-b">
            <Link href={entry.href} className="hover:bg-surface-subtle flex h-full min-h-11 gap-3 rounded-sm px-3 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
              <span className="min-w-0 flex-1">
                <span className="text-body text-ink block font-semibold">{entry.title}</span>
                <span className="text-meta text-ink-muted mt-2 block max-w-[60ch] leading-relaxed">{entry.description}</span>
              </span>
              <ArrowUpRight className="text-ink-muted mt-1 size-4 shrink-0" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
      <p className="text-meta text-ink-muted mt-3 max-w-[76ch]">
        {localToolsAvailable
          ? (vi ? "Bàn nghiên cứu gọn và hồ sơ Kakeya hiện chỉ có trong môi trường phát triển/kiểm thử." : "The lean workbench and Kakeya dossier are currently development/test-only tools.")
          : (vi ? "Bàn nghiên cứu gọn và hồ sơ Kakeya chưa được phát hành cho môi trường này; các liên kết thử nghiệm được ẩn." : "The lean workbench and Kakeya dossier are not released for this environment; experimental links are hidden.")}
      </p>
    </section>
  );
}
