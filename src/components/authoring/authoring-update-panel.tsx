"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { AuthoringContent } from "@/modules/authoring/contracts";
import { applyAuthoringUpdate, parseUpdatePack, prepareAuthoringUpdate } from "@/modules/authoring/update-pack";

interface Props {
  content: AuthoringContent;
  documentId: string;
  revision: number;
  locale: "en" | "vi";
  canWrite: boolean;
  onApply: (content: AuthoringContent, summary: string) => void;
}
const field = "border-line bg-surface text-body text-ink mt-1 w-full min-w-0 rounded-md border p-3";
export function AuthoringUpdatePanel({ content, documentId, revision, locale, canWrite, onApply }: Props) {
  const t = (vi: string, en: string) => locale === "vi" ? vi : en;
  const [request, setRequest] = useState("");
  const [input, setInput] = useState("");
  const [context, setContext] = useState("");
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState<{ result: ReturnType<typeof prepareAuthoringUpdate>; input: string; snapshot: string; request: string } | null>(null);
  const snapshot = JSON.stringify({ content, documentId, revision });
  const stale = !!preview && (preview.input !== input || preview.snapshot !== snapshot || preview.request !== request);
  function showContext() {
    setContext(`Manual Codex bridge. Propose updates only; never invent missing data or citations. Return one JSON packet matching the example below (replace example fields; null means unknown). Copy exact oldBody from supplied sections; patch existing section bodies only. Human must preview/apply/save. Costs use explicit VND/USD, quantityUnit/priceUnit item|ha|km2|m2, quantity and unitPrice 0..1e9; excludedReason null unless explicitly bundled/excluded. Rounding: two decimals per included line then sum, max1e12. Comparisons use cm|m|km|ha|km2|m2, AT_MOST or AT_LEAST. NOT_MET is a retainable negative finding, not technical acceptance. Checks do not verify the proposal text or input truth.\n\nREQUEST\n${request}\n\nCONTEXT\n${JSON.stringify({ documentId, baseRevision: revision, ...content }, null, 2)}\n\nPACKET EXAMPLE\n${JSON.stringify({ schema: "hive-os.authoring-update.v1", documentId, baseRevision: revision, request, sourceContext: "Describe provided sources and whether scenario, user input or independently verified", unknowns: ["List unresolved inputs"], patches: [{ sectionKey: content.sections[0]?.key, oldBody: content.sections[0]?.body, newBody: "Proposed replacement" }], cost: { currency: "VND", lines: [{ label: "Declared cost", quantity: null, quantityUnit: "ha", unitPrice: null, priceUnit: "ha", excludedReason: null }], claimedTotal: null }, comparisons: [{ label: "Declared measurement", measured: null, unit: "cm", threshold: null, thresholdUnit: "cm", operator: "AT_MOST" }] }, null, 2)}`);
    setMessage("");
  }
  function review() {
    setMessage("");
    setPreview(null);
    try {
      const pack = parseUpdatePack(input);
      if (request.trim() && pack.request !== request.trim()) throw new Error(t("Yêu cầu trong gói khác yêu cầu đang nhập.", "Packet request differs from the entered request."));
      const result = prepareAuthoringUpdate(pack, content, documentId, revision, locale, canWrite);
      setPreview({ result, input, snapshot, request });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t("Gói không hợp lệ.", "Invalid packet."));
    }
  }
  function apply() {
    if (!preview || stale) return;
    try {
      const result = applyAuthoringUpdate(parseUpdatePack(input), content, documentId, revision, locale, canWrite);
      onApply(result.next, result.summary);
      setPreview(null);
      setMessage(t("Đã áp dụng vào bản nháp, chưa lưu. Hãy kiểm tra rồi bấm Lưu phiên bản mới.", "Applied to the unsaved draft. Review, then Save new revision."));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Apply failed");
    }
  }
  return (
    <details className="border-line mt-6 min-w-0 rounded-md border" data-testid="authoring-update-panel">
      <summary className="text-body text-ink min-h-11 cursor-pointer p-3 font-medium">{t("Cập nhật từ yêu cầu mới", "Update from a new request")}</summary>
      <div className="border-line min-w-0 space-y-4 border-t p-3">
        <p className="text-meta text-ink-muted">{t("Cầu nối Codex thủ công, không tự gọi AI. Xem trước và áp dụng vào bản nháp; chỉ Lưu phiên bản mới mới lưu dữ liệu. Xuất bản dùng phiên bản đã lưu.", "Manual Codex bridge, no automatic AI call. Preview and apply to the draft; only Save new revision persists it. Exports use the saved revision.")}</p>
        <label className="text-meta text-ink block" htmlFor="authoring-update-request">{t("Yêu cầu thay đổi", "Change request")}
          <textarea id="authoring-update-request" rows={3} maxLength={2000} value={request} disabled={!canWrite} onChange={(e) => setRequest(e.target.value)} className={field} />
        </label>
        <Button type="button" variant="secondary" className="h-auto min-h-10 max-w-full whitespace-normal py-2" onClick={showContext} disabled={!canWrite || !request.trim()}>{t("Chuẩn bị ngữ cảnh cho Codex", "Prepare context for Codex")}</Button>
        {context ? <label className="text-meta text-ink block" htmlFor="authoring-update-context">{t("Sao chép ngữ cảnh này vào Codex", "Copy this context into Codex")}
          <textarea id="authoring-update-context" readOnly rows={6} value={context} className={`${field} font-mono text-xs`} onFocus={(e) => e.target.select()} />
        </label> : null}
        <label className="text-meta text-ink block" htmlFor="authoring-update-pack">{t("Gói thay đổi JSON từ Codex hoặc người soạn", "JSON update pack from Codex or author")}
          <textarea id="authoring-update-pack" rows={7} maxLength={1_000_000} value={input} disabled={!canWrite} onChange={(e) => setInput(e.target.value)} className={`${field} font-mono text-xs`} />
        </label>
        <Button type="button" variant="secondary" className="h-auto min-h-10 max-w-full whitespace-normal py-2" onClick={review} disabled={!canWrite || !input.trim()}>{t("Kiểm tra và xem trước", "Check and preview")}</Button>
        {preview ? <div className="min-w-0 space-y-4" data-testid="authoring-update-preview">
          <p className="text-meta text-ink whitespace-pre-wrap break-words">{preview.result.pack.request}</p>
          <p className="text-meta text-ink whitespace-pre-wrap break-words">{preview.result.pack.sourceContext}</p>
          <p className="text-meta text-ink-muted whitespace-pre-wrap break-words">{t("Chưa biết: ", "Unknowns: ")}{preview.result.pack.unknowns.join("; ") || t("Không được khai báo; không có nghĩa là đã xác minh.", "None declared; this does not mean verified.")}</p>
          {preview.result.pack.patches.map((patch) => <section key={patch.sectionKey} className="border-line min-w-0 border-t pt-3">
            <h4 className="text-body text-ink font-semibold">{content.sections.find((s) => s.key === patch.sectionKey)?.heading ?? patch.sectionKey}</h4>
            <div className="mt-2 grid min-w-0 gap-3 min-[900px]:grid-cols-2">
              {[{ label: t("Trước", "Before"), body: patch.oldBody }, { label: t("Sau", "After"), body: patch.newBody }].map((part) => <div key={part.label} className="bg-surface-subtle min-w-0 rounded p-3">
                <p className="text-meta text-ink font-semibold">{part.label}</p><p className="text-meta text-ink mt-2 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{part.body}</p>
              </div>)}
            </div>
          </section>)}
          <section className="border-line border-t pt-3">
            <h4 className="text-body text-ink font-semibold">{t("Kiểm số học và ngưỡng", "Arithmetic and threshold checks")}</h4>
            <p className="text-meta text-ink-muted mt-2">{t("Chỉ kiểm dữ liệu khai báo trong gói, không đối chiếu tự động toàn văn. MATCH không xác minh thực địa, báo giá, phê duyệt thương mại hoặc nghiệm thu kỹ thuật. UNKNOWN không phải 0; NOT_MET là kết quả không đạt ngưỡng, vẫn được lưu.", "Checks cover declared packet values, not automatic verification of all prose. MATCH does not verify field data, quotes, commercial approval or technical acceptance. UNKNOWN is not zero; NOT_MET is a retainable failed threshold finding.")}</p>
            <ul className="mt-2 space-y-2">{preview.result.checks.map((check, i) => <li key={i} className={`text-meta break-words rounded border p-2 ${["INVALID", "MISMATCH", "NOT_MET"].includes(check.status) ? "border-red-500/40 bg-red-500/5" : "border-line"}`}>
              <strong>{check.status}</strong> · {check.label}<br />{check.detail}
            </li>)}</ul>
            {!preview.result.checks.length ? <p className="text-meta mt-2">{t("Không có phép kiểm định lượng được cung cấp.", "No quantitative checks supplied.")}</p> : null}
          </section>
          <details className="border-line rounded border p-3"><summary className="text-meta min-h-8 cursor-pointer font-medium">{t("Phụ lục bằng chứng sẽ được thêm", "Evidence appendix to be added")}</summary><pre className="text-meta mt-2 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{preview.result.appendix.body}</pre></details>
          {stale ? <p role="alert" className="text-meta text-red-700">{t("Bản nháp, yêu cầu hoặc gói đã đổi. Hãy kiểm tra và xem trước lại.", "Draft, request or packet changed. Check and preview again.")}</p> : null}
          {preview.result.blocked ? <p role="alert" className="text-meta text-red-700">{t("Sửa phép kiểm sai hoặc không hợp lệ trước khi áp dụng.", "Correct mismatched or invalid checks before applying.")}</p> : null}
          <Button type="button" className="h-auto min-h-10 max-w-full whitespace-normal py-2" onClick={apply} disabled={!canWrite || stale || preview.result.blocked}>{t("Áp dụng toàn bộ vào bản nháp", "Apply all to draft")}</Button>
        </div> : null}
        {message ? <p role="status" className="text-meta text-ink break-words whitespace-pre-wrap">{message}</p> : null}
      </div>
    </details>
  );
}
