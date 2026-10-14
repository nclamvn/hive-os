"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  Braces,
  CheckCircle2,
  FileDown,
  FlaskConical,
  Plus,
  Save,
  ShieldAlert,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import { saveAuthoringRevisionAction } from "@/app/actions/authoring";
import { Button } from "@/components/ui/button";
import type { AuthoringCopy } from "@/i18n/authoring-copy";
import {
  COMPUTATIONAL_ARTIFACT_TYPES,
  SECTION_KINDS,
  type AuthoringCitation,
  type AuthoringContent,
  type AuthoringDocumentType,
  type AuthoringQualityReport,
  type ComputationalArtifact,
} from "@/modules/authoring/contracts";
import { assessAuthoringQuality, authoringIssueCategory } from "@/modules/authoring/quality";

interface RevisionSummary {
  id: string;
  revisionNumber: number;
  changeSummary: string;
  createdAt: string;
  quality: AuthoringQualityReport;
}

interface EvidenceSourceSummary {
  id: string;
  title: string;
  canonicalUri: string;
  publisher: string | null;
  sourceType: string;
  snapshots: Array<{ contentHash: string; capturedAt: string }>;
}

interface DiffSectionSummary {
  key: string;
  heading: string;
  status: "ADDED" | "REMOVED" | "MODIFIED" | "UNCHANGED";
  wordDelta: number;
}

interface Props {
  slug: string;
  documentId: string;
  documentType: AuthoringDocumentType;
  documentKey: string;
  status: string;
  revisionNumber: number;
  content: AuthoringContent;
  revisions: RevisionSummary[];
  changedSectionCount: number;
  diffSections: DiffSectionSummary[];
  evidenceSources: EvidenceSourceSummary[];
  copy: AuthoringCopy;
  locale: "vi" | "en";
  canWrite: boolean;
  canExport: boolean;
}

const control =
  "text-body text-ink border-line focus:border-line-strong w-full rounded-md border bg-surface px-3 outline-none";

function issueTone(severity: "BLOCKER" | "WARNING" | "NOTE") {
  if (severity === "BLOCKER") return "border-red-500/30 bg-red-500/5";
  if (severity === "WARNING") return "border-amber-500/30 bg-amber-500/5";
  return "border-line bg-surface-subtle";
}

function qualityLabel(copy: AuthoringCopy, quality: AuthoringQualityReport) {
  if (quality.status === "PASS") return copy.qualityPass;
  if (quality.status === "FAIL") return copy.qualityFail;
  return copy.qualityReview;
}

export function AuthoringWorkspace(props: Props) {
  const copy = props.copy;
  const router = useRouter();
  const [content, setContent] = useState(props.content);
  const [selectedKey, setSelectedKey] = useState(props.content.sections[0]?.key ?? "");
  const [changeSummary, setChangeSummary] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [citationDraft, setCitationDraft] = useState({
    key: "",
    title: "",
    canonicalUri: "",
    locator: "",
  });
  const [artifactDraft, setArtifactDraft] = useState({
    type: "LATEX_SOURCE" as ComputationalArtifact["type"],
    label: "",
    storageReference: "",
    contentHash: "",
  });
  const selectedIndex = Math.max(
    0,
    content.sections.findIndex((section) => section.key === selectedKey),
  );
  const selected = content.sections[selectedIndex];
  const quality = useMemo(
    () => assessAuthoringQuality(props.documentType, content),
    [content, props.documentType],
  );
  const retainedResearchSectionKeys = useMemo(
    () => new Set(content.researchImports.flatMap((item) => item.sectionKeys)),
    [content.researchImports],
  );

  function updateSelected(patch: Partial<(typeof content.sections)[number]>) {
    setContent((current) => ({
      ...current,
      sections: current.sections.map((section, index) =>
        index === selectedIndex ? { ...section, ...patch } : section,
      ),
    }));
  }

  function addSection() {
    const key = `section-${Date.now().toString(36)}`;
    setContent((current) => ({
      ...current,
      sections: [
        ...current.sections,
        {
          key,
          heading: props.locale === "vi" ? "Chương mục mới" : "New section",
          kind: "NARRATIVE",
          body: "",
        },
      ],
    }));
    setSelectedKey(key);
  }

  function removeSection() {
    if (content.sections.length <= 1) return;
    if (!selected) return;
    if (retainedResearchSectionKeys.has(selected.key)) return;
    const next = content.sections.filter((_, index) => index !== selectedIndex);
    setContent((current) => ({ ...current, sections: next }));
    setSelectedKey(next[Math.max(0, selectedIndex - 1)]?.key ?? next[0].key);
  }

  function moveSection(direction: -1 | 1) {
    const target = selectedIndex + direction;
    if (target < 0 || target >= content.sections.length) return;
    const next = [...content.sections];
    [next[selectedIndex], next[target]] = [next[target], next[selectedIndex]];
    setContent((current) => ({ ...current, sections: next }));
  }

  function addCitation() {
    if (!citationDraft.key || !citationDraft.title || !citationDraft.canonicalUri) return;
    const citation: AuthoringCitation = {
      ...citationDraft,
      authors: "",
      year: "",
      publisher: "",
      evidenceSourceId: null,
      researchRunId: null,
      researchSourceId: null,
      sourceDigest: null,
    };
    setContent((current) => ({
      ...current,
      citations: [...current.citations, citation],
    }));
    setCitationDraft({ key: "", title: "", canonicalUri: "", locator: "" });
  }

  function addEvidenceSource(source: EvidenceSourceSummary) {
    if (content.citations.some((citation) => citation.evidenceSourceId === source.id)) return;
    const baseKey = `sot-${source.id.slice(0, 8).toLowerCase()}`;
    let key = baseKey;
    let suffix = 2;
    while (content.citations.some((citation) => citation.key.toLowerCase() === key)) {
      key = `${baseKey}-${suffix}`;
      suffix += 1;
    }
    setContent((current) => ({
      ...current,
      citations: [
        ...current.citations,
        {
          key,
          title: source.title,
          authors: "",
          year: "",
          publisher: source.publisher ?? "",
          canonicalUri: source.canonicalUri,
          locator: source.snapshots[0]
            ? `Snapshot SHA-256 ${source.snapshots[0].contentHash}`
            : "",
          evidenceSourceId: source.id,
          researchRunId: null,
          researchSourceId: null,
          sourceDigest: source.snapshots[0]?.contentHash ?? null,
        },
      ],
    }));
  }

  function addArtifact() {
    if (
      !artifactDraft.label ||
      !artifactDraft.storageReference ||
      !/^[a-f0-9]{64}$/.test(artifactDraft.contentHash)
    )
      return;
    setContent((current) => ({
      ...current,
      computationalArtifacts: [
        ...current.computationalArtifacts,
        {
          ...artifactDraft,
          mediaType:
            artifactDraft.type === "JUPYTER_NOTEBOOK"
              ? "application/x-ipynb+json"
              : "text/plain",
          verifierNote: "",
        },
      ],
    }));
    setArtifactDraft({
      type: "LATEX_SOURCE",
      label: "",
      storageReference: "",
      contentHash: "",
    });
  }

  function save() {
    setMessage(null);
    startTransition(async () => {
      const result = await saveAuthoringRevisionAction(props.slug, {
        ...content,
        documentId: props.documentId,
        expectedRevisionNumber: props.revisionNumber,
        changeSummary:
          changeSummary.trim() ||
          (props.locale === "vi" ? "Cập nhật nội dung" : "Content updated"),
      });
      if (!result.ok) {
        setMessage(result.error ?? result.errorCode ?? "Save failed");
        return;
      }
      setMessage(copy.saveSuccess);
      setChangeSummary("");
      router.refresh();
    });
  }

  const exportBase = `/api/w/${props.slug}/authoring/${props.documentId}/export`;

  return (
    <div className="grid min-w-0 gap-4 min-[1180px]:grid-cols-[220px_minmax(0,1fr)_320px]">
      <aside className="border-line bg-surface self-start rounded-lg border min-[1180px]:sticky min-[1180px]:top-4">
        <div className="border-line border-b p-4">
          <p className="text-eyebrow text-ink-muted">{props.documentKey}</p>
          <p className="text-section-title text-ink mt-2">{copy.sections}</p>
        </div>
        <ol className="max-h-[62vh] overflow-y-auto p-2">
          {content.sections.map((section, index) => (
            <li key={section.key}>
              <button
                type="button"
                onClick={() => setSelectedKey(section.key)}
                className={`text-meta flex w-full items-start gap-2 rounded-md px-2.5 py-2 text-left transition-colors ${
                  section.key === selectedKey
                    ? "bg-surface-selected text-ink"
                    : "text-ink-muted hover:bg-surface-subtle hover:text-ink"
                }`}
              >
                <span className="tabular text-ink mt-px w-5 shrink-0 text-[10px]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">{section.heading}</span>
              </button>
            </li>
          ))}
        </ol>
        {props.canWrite ? (
          <div className="border-line border-t p-3">
            <button
              type="button"
              onClick={addSection}
              className="text-meta text-ink hover:bg-surface-subtle flex w-full items-center gap-2 rounded-md px-2 py-2 font-medium"
            >
              <Plus className="size-4" aria-hidden="true" /> {copy.addSection}
            </button>
          </div>
        ) : null}
      </aside>

      <section className="border-line bg-surface min-w-0 rounded-lg border">
        <div className="border-line flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
          <div>
            <p className="text-eyebrow text-ink-muted">{copy.editor}</p>
            <p className="text-meta text-ink-muted mt-1">
              {copy.revision} {props.revisionNumber} · {props.status}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Move section up"
              onClick={() => moveSection(-1)}
              disabled={!props.canWrite || selectedIndex === 0}
              className="text-ink-muted hover:bg-surface-subtle disabled:opacity-30 flex size-9 items-center justify-center rounded-md"
            >
              <ArrowUp className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Move section down"
              onClick={() => moveSection(1)}
              disabled={!props.canWrite || selectedIndex === content.sections.length - 1}
              className="text-ink-muted hover:bg-surface-subtle disabled:opacity-30 flex size-9 items-center justify-center rounded-md"
            >
              <ArrowDown className="size-4" />
            </button>
            <button
              type="button"
              aria-label={copy.removeSection}
              title={copy.removeSection}
              onClick={removeSection}
              disabled={
                !props.canWrite ||
                content.sections.length <= 1 ||
                retainedResearchSectionKeys.has(selected?.key ?? "")
              }
              className="text-ink-muted hover:bg-red-500/10 hover:text-red-600 disabled:opacity-30 flex size-9 items-center justify-center rounded-md"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>

        <div className="p-5 min-[760px]:p-7">
          <label className="text-meta text-ink block font-medium" htmlFor="authoring-document-title">
            {copy.documentTitle}
          </label>
          <input
            id="authoring-document-title"
            value={content.title}
            disabled={!props.canWrite}
            onChange={(event) => setContent((current) => ({ ...current, title: event.target.value }))}
            className={`${control} mt-1 h-11 text-[18px] font-semibold`}
          />

          <label className="text-meta text-ink mt-5 block font-medium" htmlFor="authoring-abstract">
            {copy.abstract}
          </label>
          <textarea
            id="authoring-abstract"
            rows={4}
            value={content.abstract}
            disabled={!props.canWrite}
            onChange={(event) => setContent((current) => ({ ...current, abstract: event.target.value }))}
            className={`${control} mt-1 resize-y py-3 leading-6`}
          />

          {selected ? (
            <div className="border-line mt-7 border-t pt-6">
              <div className="grid gap-3 min-[760px]:grid-cols-[minmax(0,1fr)_180px]">
                <div>
                  <label className="text-meta text-ink block font-medium" htmlFor="authoring-section-heading">
                    {copy.sectionHeading}
                  </label>
                  <input
                    id="authoring-section-heading"
                    value={selected.heading}
                    disabled={!props.canWrite}
                    onChange={(event) => updateSelected({ heading: event.target.value })}
                    className={`${control} mt-1 h-11 font-semibold`}
                  />
                </div>
                <div>
                  <label className="text-meta text-ink block font-medium" htmlFor="authoring-section-kind">
                    {copy.sectionType}
                  </label>
                  <select
                    id="authoring-section-kind"
                    value={selected.kind}
                    disabled={!props.canWrite}
                    onChange={(event) => updateSelected({ kind: event.target.value as (typeof SECTION_KINDS)[number] })}
                    className={`${control} mt-1 h-11`}
                  >
                    {SECTION_KINDS.map((kind) => (
                      <option key={kind} value={kind}>{copy.sectionKinds[kind]}</option>
                    ))}
                  </select>
                </div>
              </div>
              <label className="text-meta text-ink mt-4 block font-medium" htmlFor="authoring-section-body">
                {copy.sectionBody}
              </label>
              <textarea
                id="authoring-section-body"
                rows={20}
                value={selected.body}
                disabled={!props.canWrite}
                spellCheck
                onChange={(event) => updateSelected({ body: event.target.value })}
                className={`${control} mt-1 min-h-[440px] resize-y px-4 py-4 leading-7 ${selected.kind === "LATEX" ? "font-mono text-[13px]" : ""}`}
              />
            </div>
          ) : null}

          {props.canWrite ? (
            <div className="border-line mt-6 border-t pt-5">
              <label className="text-meta text-ink block font-medium" htmlFor="authoring-change-summary">
                {copy.changeSummary}
              </label>
              <div className="mt-1 flex flex-col gap-3 min-[760px]:flex-row">
                <input
                  id="authoring-change-summary"
                  value={changeSummary}
                  onChange={(event) => setChangeSummary(event.target.value)}
                  className={`${control} h-10 flex-1`}
                />
                <Button type="button" onClick={save} disabled={isPending}>
                  <Save className="size-4" aria-hidden="true" />
                  {isPending ? copy.saving : copy.saveRevision}
                </Button>
              </div>
              {message ? <p role="status" className="text-meta text-ink-muted mt-2">{message}</p> : null}
            </div>
          ) : null}
        </div>
      </section>

      <aside className="flex min-w-0 flex-col gap-4">
        <section className="border-line bg-surface rounded-lg border">
          <div className="border-line flex items-center justify-between gap-3 border-b p-4">
            <div>
              <p className="text-eyebrow text-ink-muted">{copy.quality}</p>
              <p className="text-section-title text-ink mt-1">{quality.score}/100</p>
            </div>
            {quality.status === "PASS" ? (
              <CheckCircle2 className="size-5 text-emerald-600" aria-hidden="true" />
            ) : (
              <ShieldAlert className={`size-5 ${quality.status === "FAIL" ? "text-red-600" : "text-amber-600"}`} aria-hidden="true" />
            )}
          </div>
          <div className="p-4">
            <p className="text-meta text-ink-muted mb-3">{copy.qualityHint}</p>
            <p className="text-body text-ink font-medium">{qualityLabel(copy, quality)}</p>
            <p className="text-meta text-ink-muted mt-1">
              {quality.blockerCount} {copy.blockers} · {quality.warningCount} {copy.warnings}
            </p>
            {(["CONTENT", "STYLE"] as const).map((category) => {
              const findings = quality.issues.filter((issue) => authoringIssueCategory(issue.code) === category);
              const label = category === "CONTENT" ? copy.contentFindings : copy.styleAdvice;
              return (
                <div key={category} className="mt-4">
                  <h3 className="text-meta text-ink font-semibold">{label} · {findings.length}</h3>
                  {category === "STYLE" ? <p className="text-[11px] text-ink-muted mt-1">{copy.styleHint}</p> : null}
                  {!findings.length && category === "CONTENT" ? <p className="text-[11px] text-ink-muted mt-1">{copy.noContentFindings}</p> : null}
                  {findings.length ? (
                    <ul
                      className="mt-3 max-h-80 space-y-2 overflow-y-auto"
                      tabIndex={0}
                      aria-label={label}
                    >
                      {findings.slice(0, 30).map((issue, index) => (
                        <li key={`${issue.code}-${issue.sectionKey}-${index}`} className={`rounded-md border p-2.5 ${issueTone(issue.severity)}`}>
                          <p className="text-meta text-ink font-medium">
                            {copy.issue[issue.code as keyof typeof copy.issue] ?? issue.code}
                          </p>
                          {issue.excerpt ? <p className="text-[11px] text-ink-muted mt-1 line-clamp-3">{issue.excerpt}</p> : null}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              );
            })}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {(["docx", "pdf"] as const).map((format) => {
                const disabled = !props.canExport || quality.blockerCount > 0;
                const label = format === "docx" ? copy.exportDocx : copy.exportPdf;
                return disabled ? (
                  <span key={format} title={copy.exportBlocked} aria-disabled="true" className="text-meta border-line bg-surface-subtle text-ink-muted flex h-9 cursor-not-allowed items-center justify-center gap-2 rounded-md border">
                    <FileDown className="size-4" /> {label.replace("Xuất ", "").replace("Export ", "")}
                  </span>
                ) : (
                  <a key={format} href={`${exportBase}/${format}`} className="text-meta border-line text-ink hover:bg-surface-subtle flex h-9 items-center justify-center gap-2 rounded-md border font-medium">
                    <FileDown className="size-4" /> {label.replace("Xuất ", "").replace("Export ", "")}
                  </a>
                );
              })}
            </div>
            <p className="text-[11px] text-ink-muted mt-2">{copy.exportSavedHint}</p>
          </div>
        </section>

        <details open className="border-line bg-surface rounded-lg border">
          <summary className="text-section-title text-ink cursor-pointer list-none p-4 [&::-webkit-details-marker]:hidden">
            <span className="inline-flex items-center gap-2"><BookOpen className="size-4" /> {copy.citations}</span>
          </summary>
          <div className="border-line border-t p-4">
            <p className="text-meta text-ink-muted">{copy.citationHint}</p>
            <div className="border-line mt-3 border-b pb-3">
              <p className="text-meta text-ink font-medium">{copy.sourceLedger}</p>
              <p className="text-[11px] text-ink-muted mt-1">{copy.sourceLedgerHint}</p>
              {props.evidenceSources.length ? (
                <ul className="mt-2 max-h-40 space-y-2 overflow-y-auto">
                  {props.evidenceSources.map((source) => {
                    const retained = content.citations.some(
                      (citation) => citation.evidenceSourceId === source.id,
                    );
                    return (
                      <li key={source.id} className="bg-surface-subtle rounded-md p-2.5">
                        <p className="text-meta text-ink font-medium">{source.title}</p>
                        <p className="text-[10px] text-ink-muted mt-0.5">{source.sourceType}</p>
                        {props.canWrite ? (
                          <button
                            type="button"
                            disabled={retained}
                            onClick={() => addEvidenceSource(source)}
                            className="text-[11px] text-ink mt-2 font-medium underline-offset-4 hover:underline disabled:opacity-45"
                          >
                            {retained ? copy.current : copy.addFromSot}
                          </button>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-[11px] text-ink-muted mt-2">{copy.noEvidenceSources}</p>
              )}
            </div>
            {content.citations.length ? (
              <ul className="mt-3 space-y-2">
                {content.citations.map((citation, index) => (
                  <li key={`${citation.key}-${index}`} className="border-line bg-surface-subtle rounded-md border p-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-meta text-ink font-medium">[@{citation.key}] {citation.title}</p>
                      {props.canWrite && !citation.researchRunId ? (
                        <button type="button" aria-label="Remove citation" onClick={() => setContent((current) => ({ ...current, citations: current.citations.filter((_, itemIndex) => itemIndex !== index) }))} className="text-ink-muted hover:text-red-600">
                          <Trash2 className="size-3.5" />
                        </button>
                      ) : null}
                    </div>
                    <p className="text-[11px] text-ink-muted mt-1 break-all">{citation.canonicalUri}</p>
                    {citation.researchRunId ? (
                      <p className="text-[10px] text-ink-muted mt-1 font-mono">
                        {copy.approvedDigest}: {citation.sourceDigest?.slice(0, 16)}…
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : <p className="text-meta text-ink-muted mt-3">{copy.noCitation}</p>}
            {props.canWrite ? (
              <div className="mt-3 space-y-2">
                <input aria-label={copy.citationKey} placeholder={copy.citationKey} value={citationDraft.key} onChange={(event) => setCitationDraft((current) => ({ ...current, key: event.target.value }))} className={`${control} h-9`} />
                <input aria-label={copy.citationTitle} placeholder={copy.citationTitle} value={citationDraft.title} onChange={(event) => setCitationDraft((current) => ({ ...current, title: event.target.value }))} className={`${control} h-9`} />
                <input aria-label={copy.citationUri} placeholder="https://" value={citationDraft.canonicalUri} onChange={(event) => setCitationDraft((current) => ({ ...current, canonicalUri: event.target.value }))} className={`${control} h-9`} />
                <input aria-label={copy.citationLocator} placeholder={copy.citationLocator} value={citationDraft.locator} onChange={(event) => setCitationDraft((current) => ({ ...current, locator: event.target.value }))} className={`${control} h-9`} />
                <button type="button" onClick={addCitation} className="text-meta text-ink hover:bg-surface-subtle border-line flex h-9 w-full items-center justify-center gap-2 rounded-md border font-medium">
                  <Plus className="size-4" /> {copy.addCitation}
                </button>
              </div>
            ) : null}
          </div>
        </details>

        <details className="border-line bg-surface rounded-lg border">
          <summary className="text-section-title text-ink cursor-pointer list-none p-4 [&::-webkit-details-marker]:hidden">
            <span className="inline-flex items-center gap-2"><Braces className="size-4" /> {copy.researchTools}</span>
          </summary>
          <div className="border-line border-t p-4">
            <p className="text-meta text-ink-muted">{copy.researchToolsHint}</p>
            {content.researchImports.length ? (
              <div className="border-line mt-3 border-b pb-3">
                <p className="text-meta text-ink flex items-center gap-2 font-medium">
                  <ShieldCheck className="size-4" aria-hidden="true" />
                  {copy.approvedResearch}
                </p>
                <p className="text-[11px] text-ink-muted mt-1">{copy.approvedResearchHint}</p>
                <ul className="mt-2 space-y-2">
                  {content.researchImports.map((researchImport) => (
                    <li key={researchImport.runId} className="border-line bg-surface-subtle rounded-md border p-2.5">
                      <p className="text-meta text-ink font-medium">
                        {researchImport.findingIds.length} {props.locale === "vi" ? "phát hiện đã duyệt" : "approved findings"}
                      </p>
                      <p className="text-[10px] text-ink-muted mt-1 font-mono">
                        {copy.approvedDigest}: {researchImport.approvedDigest.slice(0, 16)}…
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {content.computationalArtifacts.length ? (
              <ul className="mt-3 space-y-2">
                {content.computationalArtifacts.map((artifact, index) => (
                  <li key={`${artifact.contentHash}-${index}`} className="border-line bg-surface-subtle rounded-md border p-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-meta text-ink font-medium">{artifact.label}</p>
                        <p className="text-[10px] text-ink-muted mt-1">{artifact.type} · {artifact.contentHash.slice(0, 12)}</p>
                      </div>
                      {props.canWrite ? <button type="button" aria-label="Remove artifact" onClick={() => setContent((current) => ({ ...current, computationalArtifacts: current.computationalArtifacts.filter((_, itemIndex) => itemIndex !== index) }))} className="text-ink-muted hover:text-red-600"><Trash2 className="size-3.5" /></button> : null}
                    </div>
                  </li>
                ))}
              </ul>
            ) : <p className="text-meta text-ink-muted mt-3">{copy.noArtifacts}</p>}
            {props.canWrite ? (
              <div className="mt-3 space-y-2">
                <select aria-label="Artifact type" value={artifactDraft.type} onChange={(event) => setArtifactDraft((current) => ({ ...current, type: event.target.value as ComputationalArtifact["type"] }))} className={`${control} h-9`}>
                  {COMPUTATIONAL_ARTIFACT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
                <input aria-label={copy.artifactLabel} placeholder={copy.artifactLabel} value={artifactDraft.label} onChange={(event) => setArtifactDraft((current) => ({ ...current, label: event.target.value }))} className={`${control} h-9`} />
                <input aria-label={copy.artifactReference} placeholder="s3://, git:, doi:, file:" value={artifactDraft.storageReference} onChange={(event) => setArtifactDraft((current) => ({ ...current, storageReference: event.target.value }))} className={`${control} h-9`} />
                <input aria-label={copy.artifactHash} placeholder={copy.artifactHash} value={artifactDraft.contentHash} onChange={(event) => setArtifactDraft((current) => ({ ...current, contentHash: event.target.value.toLowerCase() }))} className={`${control} h-9 font-mono text-[11px]`} />
                <button type="button" onClick={addArtifact} className="text-meta text-ink hover:bg-surface-subtle border-line flex h-9 w-full items-center justify-center gap-2 rounded-md border font-medium">
                  <FlaskConical className="size-4" /> {copy.addArtifact}
                </button>
              </div>
            ) : null}
          </div>
        </details>

        <section className="border-line bg-surface rounded-lg border p-4">
          <p className="text-eyebrow text-ink-muted">{copy.revisionHistory}</p>
          <p className="text-[11px] text-ink-muted mt-1">{copy.recordedScore}</p>
          <p className="text-meta text-ink-muted mt-2">{props.changedSectionCount} {copy.changedSections}</p>
          {props.diffSections.length ? (
            <ul className="border-line mt-3 space-y-1 border-b pb-3">
              {props.diffSections
                .filter((section) => section.status !== "UNCHANGED")
                .map((section) => (
                  <li key={section.key} className="text-[11px] flex items-start justify-between gap-3">
                    <span className="text-ink min-w-0 truncate">{section.heading}</span>
                    <span className="text-ink-muted shrink-0 tabular">
                      {section.status === "ADDED"
                        ? copy.added
                        : section.status === "REMOVED"
                          ? copy.removed
                          : copy.modified} · {section.wordDelta > 0 ? "+" : ""}{section.wordDelta} {copy.words}
                    </span>
                  </li>
                ))}
            </ul>
          ) : null}
          <ol className="mt-3 space-y-2">
            {props.revisions.map((revision) => (
              <li key={revision.id} className="border-line flex items-start justify-between gap-3 border-t pt-2 first:border-t-0 first:pt-0">
                <div>
                  <p className="text-meta text-ink font-medium">v{revision.revisionNumber}{revision.revisionNumber === props.revisionNumber ? ` · ${copy.current}` : ""}</p>
                  <p className="text-[11px] text-ink-muted mt-0.5">{revision.changeSummary}</p>
                </div>
                <span className="text-[10px] text-ink-muted tabular">{revision.quality.score}</span>
              </li>
            ))}
          </ol>
        </section>
      </aside>
    </div>
  );
}
