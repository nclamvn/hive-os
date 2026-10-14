"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import type { AssuranceProfile } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { translate, type Locale, type MessageKey } from "@/i18n/config";
import { enumLabel } from "@/i18n/format";
import type { MissionTemplate } from "@/modules/mission-templates/catalog";

const PROFILES = ["QUICK", "PROFESSIONAL", "RESEARCH", "REGULATED"] as const;
const controlClass = "text-body text-ink border-line focus:border-line-strong w-full rounded-md border bg-surface-subtle px-3 outline-none";

export function suggestedMissionContract(title: string, success: string, locale: Locale) {
  return {
    requirementTitle: title.trim(),
    requirementCriteria: success.trim(),
    obligationTitle: locale === "vi"
      ? "Rà soát bằng chứng và các giới hạn trước khi chấp nhận kết quả"
      : "Review evidence and limitations before accepting the result",
  };
}

function Submit({ locale }: { locale: Locale }) {
  const { pending } = useFormStatus();
  return <Button type="submit" variant="primary" disabled={pending}>
    {pending ? (locale === "vi" ? "Đang tạo…" : "Creating…") : (locale === "vi" ? "Tạo nhiệm vụ nháp" : "Create draft mission")}
  </Button>;
}

export function MissionIntakeForm({ workspaceSlug, locale, template, defaultProfile, action }: {
  workspaceSlug: string;
  locale: Locale;
  template?: MissionTemplate;
  defaultProfile: AssuranceProfile;
  action: (formData: FormData) => Promise<void>;
}) {
  const t = (key: MessageKey) => translate(locale, key);
  const details = useRef<HTMLDetailsElement>(null);
  const [title, setTitle] = useState("");
  const [success, setSuccess] = useState(template?.successDefinition ?? "");
  const [overrides, setOverrides] = useState<Partial<ReturnType<typeof suggestedMissionContract>>>({
    ...(template ? { requirementTitle: template.requirementTitle, requirementCriteria: template.requirementCriteria, obligationTitle: template.obligationTitle } : {}),
  });
  const draft = { ...suggestedMissionContract(title, success, locale), ...overrides };
  const field = (id: string, label: string, options: { textarea?: boolean; value?: string; defaultValue?: string; onChange?: (value: string) => void } = {}) => (
    <div className="mb-4" key={id}>
      <label htmlFor={id} className="text-meta text-ink mb-1.5 block font-medium">{label}</label>
      {options.textarea ? <textarea id={id} name={id} rows={3} required value={options.value} defaultValue={options.defaultValue}
        onChange={options.onChange ? (event) => options.onChange!(event.target.value) : undefined} className={`${controlClass} resize-y py-2`} />
        : <input id={id} name={id} required value={options.value} defaultValue={options.defaultValue}
          onChange={options.onChange ? (event) => options.onChange!(event.target.value) : undefined} className={`${controlClass} h-10`} />}
    </div>
  );
  return <form action={action} data-testid="bounded-page-form" className="mt-4 w-full" noValidate
    onSubmit={(event) => {
      // Expand invalid draft details before native validation tries to focus them.
      const form = event.currentTarget;
      const invalid = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(":invalid");
      if (invalid) {
        event.preventDefault();
        if (details.current?.contains(invalid)) details.current.open = true;
        invalid.focus();
        form.reportValidity();
      }
    }}>
    <input type="hidden" name="slug" value={workspaceSlug} />
    {field("title", t("mission.new.missionTitle"), { value: title, onChange: setTitle })}
    {field("objective", t("mission.new.objective"), { textarea: true, defaultValue: template?.objective })}
    {field("scope", t("mission.new.scope"), { textarea: true, defaultValue: template?.scope })}
    {field("successDefinition", t("mission.new.success"), { textarea: true, value: success, onChange: setSuccess })}
    <p className="text-meta text-ink-muted max-w-3xl">
      {locale === "vi"
        ? "Tên nhiệm vụ và kết quả mong muốn được dùng làm yêu cầu nháp, kèm một nghĩa vụ rà soát bằng chứng (hoặc nội dung mẫu đã chọn). Mở chi tiết để chỉnh sửa; chưa có nội dung nào được phê duyệt."
        : "Your title and desired result become a draft requirement, with an evidence-review obligation (or the selected template's details). Open the details to edit; nothing is approved yet."}
    </p>
    <details ref={details} data-testid="mission-contract-details" className="border-line my-5 rounded-md border">
      <summary className="text-body text-ink cursor-pointer px-4 py-3 font-medium">
        {locale === "vi" ? "Chi tiết bản nháp · có thể chỉnh sửa" : "Draft details · editable"}
      </summary>
      <div className="border-line border-t p-4">
        <p className="text-meta text-ink-muted mb-4 max-w-3xl">
          {locale === "vi"
            ? "Các trường dưới lấy từ mẫu đã chọn, hoặc tên nhiệm vụ và kết quả mong muốn. Nghĩa vụ rà soát là gợi ý cố định; không phải kế hoạch do AI tạo, phê duyệt hay bằng chứng hoàn thành. Mọi nội dung đều có thể sửa."
            : "Fields below use the selected template, or your mission title and desired result. The review obligation is a fixed suggestion—not an AI-generated plan, approval, or evidence of completion. All details are editable."}
        </p>
        <label htmlFor="assuranceProfile" className="text-meta text-ink mb-1.5 block font-medium">{t("mission.new.assurance")}</label>
        <select id="assuranceProfile" name="assuranceProfile" defaultValue={template?.assuranceProfile ?? defaultProfile} className={`${controlClass} mb-4 h-10`}>
          {PROFILES.map((profile) => <option key={profile} value={profile}>{enumLabel(locale, profile)}</option>)}
        </select>
        <fieldset className="border-line rounded-md border p-3">
          <legend className="text-meta text-ink-muted px-1">{t("mission.new.firstRequirement")}</legend>
          {field("requirementTitle", t("mission.new.requirementTitle"), { value: draft.requirementTitle, onChange: (value) => setOverrides((prev) => ({ ...prev, requirementTitle: value })) })}
          {field("requirementCriteria", t("mission.new.acceptance"), { textarea: true, value: draft.requirementCriteria, onChange: (value) => setOverrides((prev) => ({ ...prev, requirementCriteria: value })) })}
        </fieldset>
        <fieldset className="border-line mt-3 rounded-md border p-3">
          <legend className="text-meta text-ink-muted px-1">{t("mission.new.firstObligation")}</legend>
          {field("obligationTitle", t("mission.new.obligationTitle"), { value: draft.obligationTitle, onChange: (value) => setOverrides((prev) => ({ ...prev, obligationTitle: value })) })}
          <label htmlFor="obligationWeight" className="text-meta text-ink mb-1 block font-medium">{t("mission.new.weight")}</label>
          <input id="obligationWeight" name="obligationWeight" type="number" min={1} step={1} required defaultValue={template?.obligationWeight ?? 1} className={`${controlClass} h-10 max-w-32`} />
        </fieldset>
      </div>
    </details>
    <div className="flex flex-wrap items-center justify-between gap-4">
      <p className="text-meta text-ink-muted max-w-xl">{locale === "vi" ? "Chỉ tạo bản nháp để rà soát; không tự chạy AI hay phê duyệt nhiệm vụ." : "Creates a draft for review only; does not run AI or approve the mission."}</p>
      <Submit locale={locale} />
    </div>
  </form>;
}
