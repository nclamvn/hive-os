import { randomUUID } from "node:crypto";

import { ArrowLeft, ArrowRight, FlaskConical } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import {
  assessMathPilotCaseAction,
  requestMathResearchCycleAction,
  requestMathPilotAgentReviewAction,
  requestMathExactNumericVerificationAction,
  requestMathPilotFormalAttemptAction,
  requestMathPilotFormalReplayAction,
  attestMathPilotFormalAlignmentAction,
  reviewMathPilotResearchAction,
  requestMathPilotCaseAction,
} from "@/app/actions/research-sandbox";
import { ResearchLiveRefresh } from "@/components/research/research-live-refresh";
import { ResearchCampaignRegion } from "@/components/research/research-campaign-region";
import { Poly19ShowcaseRegion } from "@/components/research/poly19-showcase-region";
import { MathText } from "@/components/research/math-text";
import { MathMixedCorePowerPanel } from "@/components/research/math-mixed-core-power-panel";
import { MathAdaptiveStrategyPanel } from "@/components/research/math-adaptive-strategy-panel";
import { MathLemmaGraphPanel } from "@/components/research/math-lemma-graph-panel";
import { MathLrcEvidencePanel } from "@/components/research/math-lrc-evidence-panel";
import { MathLrcCampaignPanel } from "@/components/research/math-lrc-campaign-panel";
import { isLrcCampaignRecord } from "@/components/research/math-lrc-campaign-presentation";
import { isLrcProofUnitRunRecord } from "@/components/research/math-lrc-proof-unit-run-presentation";
import { MathLrcProofUnitRunPanel } from "@/components/research/math-lrc-proof-unit-run-panel";
import { isLrcResearchProgramRecord } from "@/components/research/math-lrc-research-cockpit-family";
import { MathLrcResearchCockpitPanel } from "@/components/research/math-lrc-research-cockpit-panel";
import { MathLrcLoopReadinessPanel } from "@/components/research/math-lrc-loop-readiness-panel";
import { frozenMethodUnitFiniteSourcePins } from "@/modules/research-sandbox/math-method-unit-source-registry";
import { WorkspaceShell } from "@/components/shell/workspace-shell";
import { Button } from "@/components/ui/button";
import { Panel, SectionHeader } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { getMathPilotCopy, getLrcCopy } from "@/i18n/math-pilot-copy";
import { getTranslator } from "@/i18n/server";
import { hasCapability } from "@/modules/identity-workspace";
import {
  digestMathPilotContract,
  MATH_PILOT_BENCHMARK,
  MATH_PILOT_EXACT_BENCHMARK,
  MATH_PILOT_CALIBRATIONS,
  MATH_LRC_PRESETS,
  MATH_REVIEW_CRITERIA,
  digestMathReviewChecklist,
  mathPilotContractSchema,
  mathReviewChecklistSchema,
} from "@/modules/research-sandbox/math-pilot";
import { digestResearchResult } from "@/modules/research-sandbox/integrity";
import { listMathPilotCases, listMathPilotCaseSummaries, listMathPilotCalibrationActivity, listResearchTargets } from "@/modules/research-sandbox/kernel";
import { listMathResearchCycles, listMathResearchCyclePage } from "@/modules/research-sandbox/math-cycle-kernel";
import { loadMathCalibrationReadiness } from "@/modules/research-sandbox/math-dossier-loader";
import { parseDossierQuery, encodeDossierCursor } from "@/modules/research-sandbox/math-dossier-pagination";
import { validateRecordedMathAgentReview } from "@/modules/research-sandbox/agent-review";
import { loadWorkspacePage } from "@/server/auth/workspace-page";
import { loadLrcLoopReadiness } from "@/server/operations/math-lrc-loop-readiness";
import { getEnv } from "@/server/env";
import { researchProviderUsageSchema } from "@/modules/research-sandbox/contracts";
import { mathModelAttemptSchema } from "@/modules/research-sandbox/contracts";
import { hasErdosStrausEquation, verifyErdosStrausWitness } from "@/modules/research-sandbox/math-certificates";
import { validateIndependentReplayReport } from "@/modules/research-sandbox/math-independent-replay";
import { priorFiniteFindingFromTrace } from "@/modules/research-sandbox/math-cycle";
import { projectMathProofObligations } from "@/modules/research-sandbox/math-proof-obligations";
import { summarizeMathPortfolio } from "@/modules/research-sandbox/math-portfolio";
import { knownScopeForTask, mathPriorArtFor } from "@/modules/research-sandbox/math-prior-art";
import { splitExactBenchmarkArgument } from "@/modules/research-sandbox/math-tex";
import { validateRecordedExactNumericAddendum } from "@/modules/research-sandbox/math-exact-numeric-addendum";
import { PILOT_LEAN_IMAGE } from "@/modules/research-sandbox/math-formal-check";
import { formalClaimForContractDigest } from "@/modules/research-sandbox/math-formal-claim";
import { validateRecordedMathFormalAttempt } from "@/modules/research-sandbox/math-formal-record";
import { validateRecordedMathFormalReplay } from "@/modules/research-sandbox/math-formal-replay-record";
import { FORMAL_ALIGNMENT_CHECKS, validateRecordedFormalAlignment } from "@/modules/research-sandbox/math-formal-alignment";
import type { MathPilotContract } from "@/modules/research-sandbox/math-pilot";

export const dynamic = "force-dynamic";

const inputClass =
  "text-body text-ink border-line mt-1 min-h-11 w-full rounded-md border bg-surface px-3 py-2 outline-none transition-colors focus:border-line-strong";

const alignmentLabels = {
  DOMAIN_AND_QUANTIFIERS: { vi: "Miền xác định và lượng từ", en: "Domain and quantifiers" },
  ASSUMPTIONS_AND_DEFINITIONS: { vi: "Giả thiết và định nghĩa", en: "Assumptions and definitions" },
  CONCLUSION_EQUIVALENCE: { vi: "Kết luận tương đương", en: "Equivalent conclusion" },
  BOUNDARY_AND_NOTATION: { vi: "Trường hợp biên và ký hiệu", en: "Boundary cases and notation" },
} as const;

export default async function MathPilotPage({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceSlug: string }>;
  searchParams: Promise<{ missionId?: string | string[]; request?: string; caseId?: string | string[];
    cycleId?: string | string[]; casesAfter?: string | string[]; cyclesAfter?: string | string[];
    campaignId?: string | string[]; campaignAction?: string }>;
}) {
  const [{ workspaceSlug }, query] = await Promise.all([params, searchParams]);
  const data = await loadWorkspacePage(workspaceSlug);
  const { locale } = await getTranslator();
  const copy = getMathPilotCopy(locale);
  const lrcCopy = getLrcCopy(locale);
  if (!hasCapability(data.ctx.membership.role, "research.read")) notFound();

  const targets = await listResearchTargets(data.ctx);
  const selectedMissionId = query.missionId === undefined ? targets.missions[0]?.id
    : typeof query.missionId === "string" && targets.missions.some((mission) => mission.id === query.missionId)
      ? query.missionId : undefined;
  const codexMode = getEnv().RESEARCH_CODEX_LOCAL_ENABLED;
  const pilotProvider = codexMode ? "codex-local" : "openai";
  const pilotModel = codexMode ? "gpt-6-sol" : "gpt-5.6-sol";
  let selection: ReturnType<typeof parseDossierQuery> | null = null;
  try { if (selectedMissionId) selection = parseDossierQuery(query, selectedMissionId); } catch { /* non-disclosing invalid query */ }
  const summaries = selectedMissionId && selection ? await listMathPilotCaseSummaries(data.ctx, selectedMissionId, selection.casesAfter)
    : { items: [], total: 0, nextCursor: null };
  const selectedId = selection?.caseId ?? summaries.items[0]?.id;
  const cases = selectedMissionId && selection && selectedId ? await listMathPilotCases(data.ctx, selectedMissionId, { ids: [selectedId] }) : [];
  const calibration = selectedMissionId ? await loadMathCalibrationReadiness(data.ctx, selectedMissionId, pilotProvider, pilotModel)
    : { passed: new Set<"CALIBRATION_PROOF" | "CALIBRATION_COUNTEREXAMPLE">(), complete: false, inspected: 0 };
  const passed = calibration.passed;
  const activeCalibrationTypes = selectedMissionId ? await listMathPilotCalibrationActivity(data.ctx, selectedMissionId, pilotProvider, pilotModel)
    : new Set<"CALIBRATION_PROOF" | "CALIBRATION_COUNTEREXAMPLE">();
  const selectedMethodUnit = cases[0] && isLrcResearchProgramRecord(cases[0].contract,cases[0].researchRun.mathModelAttempt,cases[0].agentReview?.ledger);
  const selectedProofUnit = selectedMethodUnit || cases[0] && isLrcProofUnitRunRecord(cases[0].contract,cases[0].researchRun.mathModelAttempt,cases[0].agentReview?.ledger);
  const historical064 = cases[0]?.id === "b396580a-7bc7-4a8d-a966-0ad3eaa3e246";
  const HistoryContainer = historical064 ? "details" : "section";
  const selectedCampaign = selectedProofUnit || cases[0] && isLrcCampaignRecord(cases[0].contract,cases[0].researchRun.mathModelAttempt,cases[0].agentReview?.ledger);
  const loopReadiness = selectedProofUnit && selectedMissionId && cases[0]
    ? await loadLrcLoopReadiness({ headers: new Headers(await headers()), workspaceSlug,
      missionId: selectedMissionId, caseIds: [cases[0].id] }) : null;
  const cyclePage = selectedMissionId && cases[0] && !selectedCampaign ? await listMathResearchCyclePage(data.ctx, selectedMissionId, cases[0].id,
    selection?.cyclesAfter, selection?.cycleId)
    : { items: [], total: 0, hasMore: false, last: null };
  const cycles = cyclePage.items;
  const selectedHistory = { mode: !selection || (selection.caseId && !cases.length) || (selection.cycleId && !cycles.length) ? "INVALID" : "SELECTED",
    selectedCaseId: cases[0]?.id ?? null, cases, cycles };
  const hrefFor = (extra: Record<string, string>) => `/w/${workspaceSlug}/research/math-pilot?${new URLSearchParams({
    missionId: selectedMissionId ?? "", ...(cases[0] ? { caseId: cases[0].id } : {}), ...extra })}`;
  const cyclesByCase = new Map<string, typeof cycles>();
  for (const cycle of selectedHistory.cycles) {
    const history = cyclesByCase.get(cycle.rootCaseId) ?? [];
    history.push(cycle);
    cyclesByCase.set(cycle.rootCaseId, history);
  }
  const canRequest = hasCapability(data.ctx.membership.role, "research.request");
  const canReview = hasCapability(data.ctx.membership.role, "research.review");
  const canInviteReviewer = hasCapability(data.ctx.membership.role, "members.invite");
  const queueEnabled = getEnv().MATH_PILOT_QUEUE_ENABLED;
  const hasActiveWork = selectedHistory.cases.some((item) => ["QUEUED", "RUNNING"].includes(item.researchRun.status) ||
    ["PENDING", "READY", "RUNNING"].includes(item.agentReviewJobStatus ?? "") ||
    ["PENDING", "READY", "RUNNING"].includes(item.numericVerificationJobStatus ?? "") ||
    ["PENDING", "READY", "RUNNING"].includes(item.formalAttemptJobStatus ?? "") ||
    ["PENDING", "READY", "RUNNING"].includes(item.formalReplayJobStatus ?? "")) ||
    selectedHistory.cycles.some((cycle) => ["QUEUED", "RUNNING"].includes(cycle.status));

  return (
    <WorkspaceShell data={data} title={copy.title} subtitle={copy.subtitle}>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 pb-8">
        <Link
          href={`/w/${workspaceSlug}/research`}
          className="text-meta text-ink-muted hover:text-ink inline-flex min-h-10 items-center gap-2 self-start"
        >
          <ArrowLeft className="size-4" aria-hidden="true" /> {copy.back}
        </Link>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-eyebrow text-ink-muted mb-2">MATH PILOT GATE</p>
            <h1 className="text-page-title text-ink-strong">{copy.title}</h1>
            <p className="text-body text-ink-muted mt-2 max-w-3xl">{copy.subtitle}</p>
          </div>
          {selectedCampaign ? <p className="text-meta text-ink-muted max-w-sm">{locale==="vi"?"Quan sát chỉ đọc · làm mới trang thủ công để xem dữ liệu đã lưu.":"Read-only observation · reload manually to view retained updates."}</p> : <ResearchLiveRefresh
            active={hasActiveWork}
            activeLabel={locale === "vi" ? "Đang theo dõi" : "Live tracking"}
            idleLabel={locale === "vi" ? "Không có tác vụ đang chạy" : "No active work"}
            refreshLabel={locale === "vi" ? "Làm mới" : "Refresh"}
            updatedLabel={locale === "vi" ? "lúc" : "at"}
          />}
        </div>

        {["development", "test"].includes(getEnv().NODE_ENV) &&
          (!getEnv().DEPLOYMENT_ENV || ["development", "test"].includes(getEnv().DEPLOYMENT_ENV!)) ? (
          <div className="grid min-w-0 gap-3"><Link href={`/w/${workspaceSlug}/research/math-tools`}
            className="border-line bg-surface text-body text-ink hover:border-line-strong rounded-panel flex min-h-12 flex-wrap items-center justify-between gap-2 border px-4 py-3">
            <span>{locale === "vi" ? "Bàn kiểm chứng số học · phát lại Python độc lập" : "Exact arithmetic workbench · independent Python replay"}</span>
            <span className="text-meta text-ink-muted">{locale === "vi" ? "Local · chỉ đọc →" : "Local · read only →"}</span>
          </Link>
          <Link href={`/w/${workspaceSlug}/research/math-tools?view=allikvere#allikvere`}
            className="border-line bg-surface text-body text-ink hover:border-line-strong rounded-panel flex min-h-12 flex-wrap items-center justify-between gap-2 border px-4 py-3">
            <span>{locale === "vi" ? "Allikvere p=199 · chứng chỉ mô-đun đã lưu" : "Allikvere p=199 · retained modular certificates"}</span>
            <span className="text-meta text-ink-muted">{locale === "vi" ? "Chỉ đọc · không chạy công cụ →" : "Retained only · no tool execution →"}</span>
          </Link></div>
        ) : null}

        {targets.missions.length ? (
          <form method="get" className="border-line bg-surface rounded-panel flex flex-wrap items-end gap-3 border p-4">
            <label className="text-meta text-ink min-w-0 flex-1 font-medium">
              {copy.mission}
              <select name="missionId" defaultValue={selectedMissionId} className={inputClass}>
                {targets.missions.map((mission) => (
                  <option key={mission.id} value={mission.id}>{mission.referenceCode} · {mission.title}</option>
                ))}
              </select>
            </label>
            <Button type="submit" variant="secondary">{copy.choose}</Button>
          </form>
        ) : (
          <Panel className="p-6"><p className="text-body text-ink">{copy.noMission}</p></Panel>
        )}

        <ResearchCampaignRegion ctx={data.ctx} locale={locale} workspaceSlug={workspaceSlug}
          missionId={selectedMissionId} campaignId={typeof query.campaignId === "string" ? query.campaignId : undefined}
          actionRefused={query.campaignAction === "refused"} canRequest={canRequest} canReview={canReview}/>

        <Poly19ShowcaseRegion ctx={data.ctx} locale={locale} workspaceSlug={workspaceSlug}
          missionId={selectedMissionId} canRequest={canRequest} canReview={canReview} compact/>

        {selectedMissionId ? (
          <form method="get" className="border-line bg-surface rounded-panel flex flex-wrap items-end gap-3 border p-4">
            <input type="hidden" name="missionId" value={selectedMissionId} />
            <label className="text-meta text-ink min-w-0 flex-1 font-medium">
              {locale === "vi" ? "Hồ sơ" : "Case"}
              <select name="caseId" key={`${selectedHistory.selectedCaseId ?? "none"}:${selection?.casesAfter?.id ?? "first"}`}
                defaultValue={selectedHistory.selectedCaseId ?? ""} className={inputClass}>
                <option value="">{locale === "vi" ? "Hồ sơ mới nhất trong trang" : "Latest case on this page"}</option>
                {cases[0] && !summaries.items.some((item) => item.id === cases[0].id) ? <option value={cases[0].id}>
                  {cases[0].caseType} · {cases[0].researchRun.question.slice(0, 96)} · {cases[0].id.slice(0, 8)}</option> : null}
                {summaries.items.map((item) => (
                  <option key={item.id} value={item.id}>{item.caseType} · {item.researchRun.question.slice(0, 96)} · {item.id.slice(0, 8)}</option>
                ))}
              </select>
            </label>
            <Button type="submit" variant="secondary">{locale === "vi" ? "Xem hồ sơ" : "View case"}</Button>
            {selection?.casesAfter ? <input type="hidden" name="casesAfter" value={query.casesAfter as string} /> : null}
            <p className="text-meta text-ink-muted w-full">
              {locale === "vi"
                ? `Trang có ${summaries.items.length}/${summaries.total} tóm tắt; tải chi tiết ${cases.length} hồ sơ. Hiệu chuẩn được kiểm tra riêng, không phụ thuộc lựa chọn.`
                : `Page contains ${summaries.items.length}/${summaries.total} summaries; ${cases.length} detailed case loaded. Calibration is checked separately, independent of selection.`}
            </p>
            {selectedHistory.mode === "INVALID" ? <p className="text-meta text-danger-700 w-full" role="alert">
              {locale === "vi" ? "Không thể truy cập lựa chọn này trong nhiệm vụ. Xóa tham số lựa chọn hoặc chọn hồ sơ hợp lệ."
                : "This selection is not available in this mission. Clear the selection parameters or choose an available case."}
            </p> : null}
            {selection?.casesAfter ? <Link prefetch={false} className="text-meta text-ink underline" href={hrefFor({})}>{locale === "vi" ? "Trang tóm tắt đầu" : "First summary page"}</Link> : null}
            {summaries.nextCursor ? <Link prefetch={false} className="text-meta text-ink underline" href={hrefFor({ casesAfter: summaries.nextCursor })}>{locale === "vi" ? "Tóm tắt cũ hơn" : "Older summaries"}</Link> : null}
          </form>
        ) : null}
        {summaries.items.length ? <details className="border-line rounded-panel border p-4">
          <summary className="text-meta text-ink cursor-pointer font-medium">{locale === "vi" ? "Danh sách tóm tắt hồ sơ" : "Case summary list"} ({summaries.items.length}/{summaries.total})</summary>
          <p className="text-meta text-ink-muted mt-2">{locale === "vi" ? "Chỉ là metadata vận hành, không phải chứng nhận kết quả toán học. Chọn một hồ sơ để tải nội dung đã niêm phong." : "Operational metadata only, not mathematical certification. Choose a case to load its sealed contents."}</p>
          <ol className="mt-3 space-y-2">{summaries.items.map((item) => <li key={item.id} className="min-w-0 border-t border-line pt-2">
            <Link prefetch={false} className="text-body text-ink break-words underline" href={hrefFor({ caseId: item.id,
              ...(selection?.casesAfter ? { casesAfter: query.casesAfter as string } : {}) })}>{item.caseType} · {item.researchRun.question.slice(0, 180)}</Link>
            <p className="text-meta text-ink-muted break-all">{item.researchRun.status} · {item.createdAt.toLocaleString(locale)} · {item.id}</p>
          </li>)}</ol>
        </details> : null}
        {query.missionId !== undefined && !selectedMissionId ? <Panel className="p-4" role="alert"><p className="text-meta text-danger-700">{locale === "vi" ? "Lựa chọn nhiệm vụ không hợp lệ hoặc không truy cập được." : "Mission selection is invalid or unavailable."}</p></Panel> : null}
        {selectedMissionId && !calibration.complete ? <Panel className="p-4" role="alert"><p className="text-meta text-ink-muted">{locale === "vi" ? "Chưa xác lập hiệu chuẩn: lượt đọc bằng chứng đã đạt giới hạn an toàn. Không xem đây là kết luận thất bại hiệu chuẩn." : "Calibration not established: evidence scan reached its safety limit. This is not a definitive calibration failure."}</p></Panel> : null}

        {!selectedProofUnit && query.request === "failed" ? (
          <Panel className="border-danger-500 p-4" role="alert">
            <p className="text-body text-ink">
              {locale === "vi"
                ? "Không thể giao ca thử nghiệm. Kiểm tra hiệu chuẩn, quyền truy cập và cấu hình nhà cung cấp trước khi thử lại."
                : "Could not queue this case. Check calibration, access, and provider configuration before retrying."}
            </p>
          </Panel>
        ) : null}
        {!selectedProofUnit && query.request === "formal-failed" ? <Panel className="border-danger-500 p-4" role="alert">
          <p className="text-body text-ink">{locale === "vi" ? "Không thể giao ca Lean. Kiểm tra trạng thái job trước đó, quyền truy cập và hồ sơ chứng minh đã niêm phong." : "Could not queue the Lean attempt. Check the previous job, access rights, and sealed proof case."}</p>
        </Panel> : null}
        {!selectedProofUnit && query.request === "replay-failed" ? <Panel className="border-danger-500 p-4" role="alert">
          <p className="text-body text-ink">{locale === "vi" ? "Không thể giao ca phát lại kernel. Kiểm tra image checker, trạng thái job và hồ sơ Lean đã niêm phong." : "Could not queue fresh kernel replay. Check the checker image, job status, and sealed Lean record."}</p>
        </Panel> : null}
        {!selectedProofUnit && query.request === "alignment-failed" ? <Panel className="border-danger-500 p-4" role="alert">
          <p className="text-body text-ink">{locale === "vi" ? "Không thể lưu đánh giá ánh xạ. Kiểm tra đủ bốn tiêu chí, ghi chú cụ thể và hồ sơ replay." : "Could not retain alignment review. Check all four criteria, detailed notes, and replay evidence."}</p>
        </Panel> : null}
        {!selectedProofUnit && (query.request === "cycle-conflict" || query.request === "cycle-failed") ? <Panel className="border-danger-500 p-4" role="alert">
          <p className="text-body text-ink">{query.request === "cycle-conflict"
            ? (locale === "vi" ? "Yêu cầu không được giao: khóa của hồ sơ này đã gắn với yêu cầu trước có người thực hiện hoặc giới hạn khác. Lịch sử được giữ nguyên; không tự chạy lại."
              : "Request not queued: this case's key is bound to an earlier request with a different actor or limits. History is preserved; no automatic retry.")
            : (locale === "vi" ? "Yêu cầu không được giao. Kiểm tra trạng thái đợt trước, quyền truy cập, phản biện gốc và cấu hình trước khi tiếp tục."
              : "Request not queued. Check the prior campaign, access, root review and configuration before proceeding.")}</p>
          <p className="text-meta text-ink-muted mt-2">{locale === "vi"
            ? "Để thử portfolio mới, tạo hồ sơ OPEN mới bằng biểu mẫu bên dưới, chờ phản biện AI rồi chọn khởi động. Không đổi khóa hoặc xóa lịch sử để vượt chốt."
            : "For a fresh portfolio, create a new OPEN case with the form below, await AI review, then start it. Do not change the key or delete history to bypass the gate."}</p>
        </Panel> : null}

        {selectedMissionId ? (
          <>
            {selectedProofUnit ? <Panel className="min-w-0 p-4" role="status"><p className="text-body text-ink max-w-[76ch]">
              {selectedMethodUnit ? (locale === "vi" ? "Hồ sơ method-unit được quan sát chỉ đọc. Các biểu mẫu giao bài, kiểm chứng và vòng lặp thông thường không áp dụng; không tự thử lại khi thiếu bằng chứng."
                : "This method-unit case is observation-only. Ordinary intake, verification and cycle forms do not apply; missing evidence never triggers an automatic retry.") : locale === "vi" ? "Hồ sơ proof-unit được quan sát chỉ đọc. Các biểu mẫu giao bài, kiểm chứng và vòng lặp thông thường không áp dụng tại đây; chọn hồ sơ khác để quay lại quy trình riêng."
                : "This proof-unit case is observation-only. Ordinary intake, verification and cycle forms do not apply here; select another case to return to its separate workflow."}
            </p></Panel> : <>
            <Panel className="p-4" role="status">
              <p className="text-body text-ink">{queueEnabled ? copy.dispatchReady : copy.dispatchLocked}</p>
              {codexMode ? <p className="text-meta text-ink-muted mt-2">{copy.codexMode}</p> : null}
            </Panel>
            <section aria-labelledby="math-calibration-title">
              <SectionHeader title={copy.calibration} id="math-calibration-title" />
              <p className="text-body text-ink-muted mt-2 max-w-3xl">{copy.calibrationHint}</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {(["CALIBRATION_PROOF", "CALIBRATION_COUNTEREXAMPLE"] as const).map((caseType) => {
                  const contract = MATH_PILOT_CALIBRATIONS[caseType];
                  const isPassed = passed.has(caseType);
                  const hasActiveCase = activeCalibrationTypes.has(caseType);
                  return (
                    <Panel key={caseType} className="flex min-w-0 flex-col p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-meta text-ink-muted font-semibold">
                          {caseType === "CALIBRATION_PROOF" ? copy.proofCase : copy.counterexampleCase}
                        </p>
                        <StatusBadge tone={isPassed ? "success" : "warning"}>
                          {isPassed ? copy.passed : copy.pending}
                        </StatusBadge>
                      </div>
                      <p className="text-section-title text-ink-strong mt-4 flex-1"><MathText text={contract.statement} /></p>
                      {canRequest ? (
                        <form action={requestMathPilotCaseAction} className="mt-5">
                          <input type="hidden" name="slug" value={workspaceSlug} />
                          <input type="hidden" name="missionId" value={selectedMissionId} />
                          <input type="hidden" name="caseType" value={caseType} />
                          <input type="hidden" name="idempotencyKey" value={`math-pilot:${randomUUID()}`} />
                          <Button type="submit" variant="secondary" disabled={isPassed || hasActiveCase || !queueEnabled}>
                            {copy.queueCase} <ArrowRight className="size-4" aria-hidden="true" />
                          </Button>
                        </form>
                      ) : null}
                    </Panel>
                  );
                })}
              </div>
            </section>

            <section aria-labelledby="math-exact-benchmark-title">
              <Panel className="p-5 sm:p-6">
                <SectionHeader title={copy.exactBenchmarkTitle} id="math-exact-benchmark-title" />
                <p className="text-body text-ink-muted mt-2 max-w-3xl">
                  {passed.size === 2 ? copy.exactBenchmarkHint : copy.benchmarkLocked}
                </p>
                <p className="text-meta text-ink-muted mt-2">
                  {copy.exactSource}: <a className="text-ink underline underline-offset-2" href="https://epoch.ai/frontiermath/tiers-1-4/benchmark-problems" target="_blank" rel="noreferrer">Epoch AI, FrontierMath sample problems</a>
                </p>
                <p className="text-section-title text-ink-strong mt-4 max-w-3xl"><MathText text={MATH_PILOT_EXACT_BENCHMARK.statement} /></p>
                <div className="border-line text-body text-ink mt-3 max-w-3xl border-l-2 pl-4">
                  <MathText text={String.raw`$$\left\lfloor 10^9\,\mathbb{E}[\operatorname{Perimeter}(R_O)]\right\rfloor$$`} />
                </div>
                {canRequest ? (
                  <form action={requestMathPilotCaseAction} className="mt-5">
                    <input type="hidden" name="slug" value={workspaceSlug} />
                    <input type="hidden" name="missionId" value={selectedMissionId} />
                    <input type="hidden" name="caseType" value="BENCHMARK_EXACT" />
                    <input type="hidden" name="idempotencyKey" value={`math-pilot:${randomUUID()}`} />
                    <Button type="submit" variant="secondary" disabled={passed.size !== 2 || !queueEnabled || cases.some((item) =>
                      item.caseType === "BENCHMARK_EXACT" &&
                      item.researchRun.providerName === pilotProvider && item.researchRun.modelName === pilotModel &&
                      (["QUEUED", "RUNNING"].includes(item.researchRun.status) ||
                        (item.researchRun.status === "AWAITING_REVIEW" && !item.agentReview &&
                          item.agentReviewJobStatus !== "DEAD_LETTER")),
                    )}>
                      {copy.exactBenchmarkRun} <ArrowRight className="size-4" aria-hidden="true" />
                    </Button>
                  </form>
                ) : null}
              </Panel>
            </section>

            <section aria-labelledby="math-benchmark-title">
              <Panel className="p-5 sm:p-6">
                <SectionHeader title={copy.benchmarkTitle} id="math-benchmark-title" />
                <p className="text-body text-ink-muted mt-2 max-w-3xl">
                  {passed.size === 2 ? copy.benchmarkHint : copy.benchmarkLocked}
                </p>
                <p className="text-section-title text-ink-strong mt-4 max-w-3xl"><MathText text={MATH_PILOT_BENCHMARK.statement} /></p>
                <div className="border-line text-body text-ink mt-3 max-w-3xl border-l-2 pl-4">
                  <MathText text={String.raw`$$\frac{a^2+b^2}{ab+1}=m^2,\qquad m\in\mathbb{Z}$$`} />
                </div>
                {canRequest ? (
                  <form action={requestMathPilotCaseAction} className="mt-5">
                    <input type="hidden" name="slug" value={workspaceSlug} />
                    <input type="hidden" name="missionId" value={selectedMissionId} />
                    <input type="hidden" name="caseType" value="BENCHMARK_PROOF" />
                    <input type="hidden" name="idempotencyKey" value={`math-pilot:${randomUUID()}`} />
                    <Button type="submit" variant="secondary" disabled={passed.size !== 2 || !queueEnabled || cases.some((item) =>
                      item.caseType === "BENCHMARK_PROOF" &&
                      item.researchRun.providerName === pilotProvider &&
                      item.researchRun.modelName === pilotModel &&
                      (["QUEUED", "RUNNING"].includes(item.researchRun.status) ||
                        (item.researchRun.status === "AWAITING_REVIEW" && !item.agentReview &&
                          item.agentReviewJobStatus !== "DEAD_LETTER")),
                    )}>
                      {copy.benchmarkRun} <ArrowRight className="size-4" aria-hidden="true" />
                    </Button>
                  </form>
                ) : null}
              </Panel>
            </section>

            <section aria-labelledby="math-open-title">
              <Panel className="overflow-hidden">
                <div className="border-line border-b p-5 sm:p-6">
                  <div className="flex items-center gap-3">
                    <FlaskConical className="text-ink-muted size-5" aria-hidden="true" />
                    <SectionHeader title={copy.openTitle} id="math-open-title" />
                  </div>
                  <p className="text-body text-ink-muted mt-2">{passed.size === 2 ? copy.openHint : copy.openLocked}</p>
                </div>
                {passed.size === 2 && canRequest && queueEnabled ? (
                  <form action={requestMathPilotCaseAction} className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
                    <input type="hidden" name="slug" value={workspaceSlug} />
                    <input type="hidden" name="missionId" value={selectedMissionId} />
                    <input type="hidden" name="caseType" value="OPEN" />
                    <input type="hidden" name="idempotencyKey" value={`math-pilot:${randomUUID()}`} />
                    {([
                      ["statement", copy.statement, 4000],
                      ["definitions", copy.definitions, 1000],
                      ["assumptions", copy.assumptions, 1000],
                      ["falsificationCriterion", copy.falsificationCriterion, 1000],
                      ["successCriterion", copy.successCriterion, 1000],
                      ["exclusions", copy.exclusions, 1000],
                    ] as const).map(([name, label, maxLength]) => (
                      <label key={name} className={`text-meta text-ink font-medium ${name === "statement" ? "sm:col-span-2" : ""}`}>
                        {label}
                        <textarea name={name} rows={name === "statement" ? 3 : 2} required maxLength={maxLength} className={inputClass} />
                      </label>
                    ))}
                    <p className="text-meta text-ink-muted sm:col-span-2">
                      {locale === "vi" ? "Có thể nhập công thức bằng $...$, $$...$$, \\(...\\) hoặc \\[...\\]. LaTeX chỉ thay đổi cách hiển thị, không thay đổi phát biểu đã niêm phong." :
                        "Use $...$, $$...$$, \\(...\\) or \\[...\\] for formulas. Rendering never changes the sealed statement."}
                    </p>
                    <div className="sm:col-span-2">
                      <Button type="submit">{copy.startOpen} <ArrowRight className="size-4" aria-hidden="true" /></Button>
                    </div>
                  </form>
                ) : null}
              </Panel>
            </section>

            <section aria-labelledby="math-lrc-title">
              <Panel className="min-w-0 p-5 sm:p-6">
                <SectionHeader title={lrcCopy.title} id="math-lrc-title" />
                <p className="text-body text-ink-muted mt-2">{lrcCopy.hint}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {(Object.keys(MATH_LRC_PRESETS) as (keyof typeof MATH_LRC_PRESETS)[]).map((preset) => <form key={preset} action={requestMathPilotCaseAction} className="border-line min-w-0 rounded-lg border p-4">
                    <input type="hidden" name="slug" value={workspaceSlug} /><input type="hidden" name="missionId" value={selectedMissionId} />
                    <input type="hidden" name="caseType" value="LRC_FINITE" /><input type="hidden" name="preset" value={preset} />
                    <input type="hidden" name="idempotencyKey" value={`math-lrc:${randomUUID()}`} />
                    <p className="text-meta text-ink mb-3 font-medium">{lrcCopy.presets[preset]}</p>
                    <Button type="submit" variant="secondary" disabled={!(passed.size === 2 && canRequest && queueEnabled && codexMode && ["development", "test"].includes(process.env.NODE_ENV))}>{lrcCopy.start}</Button>
                  </form>)}
                </div>
                {!(passed.size === 2 && canRequest && queueEnabled && codexMode && ["development", "test"].includes(process.env.NODE_ENV)) ? <p className="text-meta text-ink-muted mt-3">{lrcCopy.locked}</p> : null}
              </Panel>
            </section>

            </>}
            {loopReadiness ? <MathLrcLoopReadinessPanel locale={locale} readiness={loopReadiness} reloadHref={hrefFor({})} /> : null}
            {historical064 && cases[0] ? <MathLrcResearchCockpitPanel locale={locale} toolsBase={`/w/${workspaceSlug}/research/math-tools`} record={{
              caseId:cases[0].id,runId:cases[0].researchRun.id,runStatus:cases[0].researchRun.status,contract:cases[0].contract,contractDigest:cases[0].contractDigest,
              attempt:cases[0].researchRun.mathModelAttempt,attemptDigest:cases[0].researchRun.mathModelAttemptDigest,
              researchDigest:cases[0].researchIntegrityDigest,review:cases[0].agentReview,reviewJobStatus:cases[0].agentReviewJobStatus}} /> : null}
            <HistoryContainer aria-labelledby="math-history-title" className="min-w-0">
              {historical064 ? <summary className="text-body text-ink cursor-pointer font-medium">{locale === "vi" ? "Hồ sơ 064 nguyên trạng · lần chạy lịch sử" : "Unchanged 064 record · historical run"}</summary> : null}
              <SectionHeader title={copy.history} id="math-history-title" />
              <div className="mt-4 space-y-4">
                {selectedHistory.cases.length ? selectedHistory.cases.map((item) => {
                  const methodUnitCase = isLrcResearchProgramRecord(item.contract,item.researchRun.mathModelAttempt,item.agentReview?.ledger);
                  if (methodUnitCase) return <MathLrcResearchCockpitPanel key={item.id} locale={locale} toolsBase={`/w/${workspaceSlug}/research/math-tools`} record={{
                    caseId:item.id,runId:item.researchRun.id,runStatus:item.researchRun.status,contract:item.contract,contractDigest:item.contractDigest,
                    attempt:item.researchRun.mathModelAttempt,attemptDigest:item.researchRun.mathModelAttemptDigest,
                    researchDigest:item.researchIntegrityDigest,review:item.agentReview,reviewJobStatus:item.agentReviewJobStatus,reviewJobId:item.agentReview?.jobId,
                    finiteSourcePins:frozenMethodUnitFiniteSourcePins()}} />;
                  const proofUnitCase = isLrcProofUnitRunRecord(item.contract,item.researchRun.mathModelAttempt,item.agentReview?.ledger);
                  const campaignCase = proofUnitCase || isLrcCampaignRecord(item.contract,item.researchRun.mathModelAttempt,item.agentReview?.ledger);
                  const parsed = mathPilotContractSchema.safeParse(item.contract);
                  const contractValid = parsed.success && digestMathPilotContract(parsed.data) === item.contractDigest;
                  const usage = researchProviderUsageSchema.safeParse(item.researchRun.providerUsage);
                  const parsedAttempt = mathModelAttemptSchema.safeParse(item.researchRun.mathModelAttempt);
                  const attempt = parsedAttempt.success && digestResearchResult(parsedAttempt.data) === item.researchRun.mathModelAttemptDigest
                    ? parsedAttempt
                    : { success: false as const };
                  const attemptPriorArt = !proofUnitCase && parsed.success && attempt.success
                    ? knownScopeForTask(parsed.data, attempt.data.argument)
                    : null;
                  const independentReviewer = canReview && item.researchRun.requestedByMembershipId !== data.ctx.membership.id;
                  const attemptValid = item.researchRun.providerName !== "codex-local" || attempt.success;
                  const providerValid = item.researchRun.providerName !== "openai" || usage.success;
                  const checklist = item.assessment ? mathReviewChecklistSchema.safeParse(item.assessment.reviewChecklist) : null;
                  const checklistValid = checklist?.success && digestMathReviewChecklist(checklist.data) === item.assessment?.reviewChecklistDigest;
                  const agentLedger = proofUnitCase ? null : validateRecordedMathAgentReview({
                    contract: item.contract, contractDigest: item.contractDigest,
                    attempt: item.researchRun.mathModelAttempt, attemptDigest: item.researchRun.mathModelAttemptDigest,
                    researchDigest: item.researchIntegrityDigest, review: item.agentReview,
                  });
                  const exactArgument = item.caseType === "BENCHMARK_EXACT" && attempt.success
                    ? splitExactBenchmarkArgument(attempt.data.argument) : null;
                  const numericCertificate = item.caseType === "BENCHMARK_EXACT" ? validateRecordedExactNumericAddendum({
                    verification: item.numericVerification, contractDigest: item.contractDigest,
                    attemptDigest: item.researchRun.mathModelAttemptDigest,
                    researchDigest: item.researchIntegrityDigest,
                    claimedAnswer: attempt.success ? attempt.data.exactAnswer ?? null : null,
                  }) : null;
                  const formalTarget = ["CALIBRATION_PROOF", "BENCHMARK_PROOF"].includes(item.caseType)
                    ? formalClaimForContractDigest(item.contractDigest) : null;
                  const formalRecord = formalTarget ? validateRecordedMathFormalAttempt({
                    record: item.formalAttempts[0] ?? null,
                    contractDigest: item.contractDigest,
                    attemptDigest: item.researchRun.mathModelAttemptDigest,
                    researchDigest: item.researchIntegrityDigest,
                  }) : null;
                  const formalReplay = formalRecord && item.formalAttempts[0]?.replay
                    ? validateRecordedMathFormalReplay({ replay: item.formalAttempts[0].replay,
                      formalAttempt: item.formalAttempts[0] }) : null;
                  const formalAlignment = formalReplay && item.formalAttempts[0]?.alignment
                    ? validateRecordedFormalAlignment({ record: item.formalAttempts[0].alignment,
                      formalAttempt: item.formalAttempts[0] }) : null;
                  return (
                    <Panel key={item.id} className="min-w-0 overflow-hidden p-5 sm:p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-eyebrow text-ink-muted">{item.caseType === "BENCHMARK_PROOF" ? copy.benchmarkTitle : item.caseType === "BENCHMARK_EXACT" ? copy.exactBenchmarkTitle : item.caseType.replaceAll("_", " ")}</p>
                          <h3 aria-label={item.researchRun.question} className="text-section-title text-ink-strong mt-2 break-words">{proofUnitCase ? item.researchRun.question : <MathText text={item.researchRun.question} />}</h3>
                        </div>
                        <StatusBadge tone={item.researchRun.status === "APPROVED" ? "success" : item.researchRun.status === "FAILED" || item.researchRun.status === "REJECTED" ? "danger" : "warning"}>
                          {item.researchRun.status}
                        </StatusBadge>
                      </div>
                      <p className="text-meta text-ink-muted mt-3 break-all">{copy.contract}: {contractValid ? item.contractDigest : "INTEGRITY FAILURE"}</p>
                      {proofUnitCase ? <MathLrcProofUnitRunPanel locale={locale} toolsBase={`/w/${workspaceSlug}/research/math-tools`} record={{
                        caseId:item.id,runId:item.researchRun.id,runStatus:item.researchRun.status,contract:item.contract,contractDigest:item.contractDigest,
                        attempt:item.researchRun.mathModelAttempt,attemptDigest:item.researchRun.mathModelAttemptDigest,
                        researchDigest:item.researchIntegrityDigest,review:item.agentReview,reviewJobStatus:item.agentReviewJobStatus}} />
                        : campaignCase ? <MathLrcCampaignPanel locale={locale} toolsBase={`/w/${workspaceSlug}/research/math-tools`} record={{contract:item.contract,contractDigest:item.contractDigest,
                        attempt:item.researchRun.mathModelAttempt,attemptDigest:item.researchRun.mathModelAttemptDigest,
                        researchDigest:item.researchIntegrityDigest,review:item.agentReview,reviewJobStatus:item.agentReviewJobStatus}} />
                        : item.caseType === "OPEN" ? <MathLrcEvidencePanel scope={contractValid && parsed.success ? parsed.data.lrcFiniteScope : undefined} contractDigest={item.contractDigest} evidence={attempt.success ? attempt.data.lrcEvidence : null} locale={locale} /> : null}
                      {!campaignCase ? <>
                      <div className="border-line mt-3 border-t pt-3">
                        <p className="text-meta text-ink-muted font-semibold">{copy.providerUsage}</p>
                        <p className="text-meta text-ink-muted mt-1">
                          {attempt.success
                            ? `${copy.subscriptionTokens}: ${attempt.data.usage.inputTokens.toLocaleString(locale)} / ${attempt.data.usage.outputTokens.toLocaleString(locale)}`
                            : usage.success
                            ? `${copy.usageTokens}: ${usage.data.inputTokens.toLocaleString(locale)} / ${usage.data.outputTokens.toLocaleString(locale)} · ${copy.usageSearches}: ${usage.data.webSearchCalls}`
                            : copy.usageUnverified}
                        </p>
                        {usage.success ? <p className="text-meta text-ink-muted mt-1 break-all">{usage.data.modelName} · {usage.data.responseId}</p> : null}
                      </div>
                      {attempt.success && item.researchRun.mathModelAttemptDigest ? (
                        <div className="border-line mt-4 border-t pt-4">
                          <p className="text-meta text-ink-muted font-semibold">{copy.modelAttempt} · {attempt.data.attemptType.replaceAll("_", " ")}</p>
                          {attemptPriorArt ? <p role="alert" className="text-meta text-danger-700 mt-2">
                            {copy.modelAttemptPriorArt} <a className="underline underline-offset-2" href={attemptPriorArt.sourceUrl} target="_blank" rel="noreferrer">{attemptPriorArt.sourceTitle}</a>
                          </p> : null}
                          <p className="math-proof-body text-body text-ink mt-3 whitespace-pre-wrap break-words"><MathText text={exactArgument?.prose ?? attempt.data.argument} /></p>
                          {exactArgument?.embeddedCode && !attempt.data.computationPython ? <details className="border-line text-meta text-ink-muted mt-3 rounded-md border p-3">
                            <summary className="text-ink cursor-pointer font-medium">{copy.exactEmbeddedCode}</summary>
                            <pre className="mt-3 max-h-96 overflow-auto whitespace-pre font-mono text-xs leading-relaxed">{exactArgument.embeddedCode}</pre>
                          </details> : null}
                          <details className="text-meta text-ink-muted mt-3">
                            <summary className="text-ink cursor-pointer font-medium">
                              {locale === "vi" ? "Xem nguyên văn đã niêm phong" : "View sealed source text"}
                            </summary>
                            <p className="mt-2 whitespace-pre-wrap break-words">{attempt.data.argument}</p>
                          </details>
                          {attempt.data.candidateCounterexample ? <p className="text-body text-ink mt-3 break-words">{copy.attemptCounterexample}: <MathText text={attempt.data.candidateCounterexample} /></p> : null}
                          {attempt.data.selfChecks.length ? <p className="text-meta text-ink-muted mt-3 whitespace-pre-wrap">{copy.attemptChecks}: <MathText text={attempt.data.selfChecks.join(" · ")} /></p> : null}
                          {attempt.data.limitations.length ? <p className="text-meta text-ink-muted mt-2 whitespace-pre-wrap">{copy.attemptLimits}: <MathText text={attempt.data.limitations.join(" · ")} /></p> : null}
                          {item.caseType === "BENCHMARK_EXACT" ? (
                            <div className="border-line mt-4 border-l-2 pl-4">
                              <p className="text-meta text-ink-muted">{copy.exactCandidate}</p>
                              <p className="text-section-title text-ink-strong mt-1 tabular-nums">{attempt.data.exactAnswer ?? copy.exactNoAnswer}</p>
                              <details className="text-meta text-ink-muted mt-3">
                                <summary className="text-ink cursor-pointer font-medium">{copy.exactCode}</summary>
                                {attempt.data.computationOrigin === "EXTRACTED_FROM_ARGUMENT" ? <p className="mt-2">{copy.exactRecoveredCode}</p> : null}
                                <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words">{attempt.data.computationPython ?? copy.exactNoCode}</pre>
                              </details>
                              <p className="text-meta text-ink-muted mt-2">{copy.exactReplayCaution}</p>
                              <div className="border-line mt-4 border-t pt-3">
                                <p className="text-meta text-ink font-semibold">{copy.exactInterval}</p>
                                {numericCertificate ? <>
                                  <p className="text-meta text-success-700 mt-2 font-medium">
                                    {locale === "vi" ? "Đã chứng nhận số học độc lập" : "Independent numerical certificate retained"} · floor = {numericCertificate.floor}
                                  </p>
                                  <details className="text-meta text-ink-muted mt-2">
                                    <summary className="cursor-pointer">{copy.exactIntervalBounds}</summary>
                                    <p className="mt-2 break-all">[{numericCertificate.lowerScaled}, {numericCertificate.upperScaled}] / 10^{numericCertificate.scaleDigits}</p>
                                    <p className="mt-2 break-all">{copy.exactIntervalSource}: {numericCertificate.programDigest}</p>
                                    <p className="mt-1 break-all">Image: {numericCertificate.image}</p>
                                    <p className="mt-1 break-all">Output SHA-256: {numericCertificate.outputDigest}</p>
                                    <p className="mt-1 break-all">Certificate SHA-256: {item.numericVerification?.certificateDigest}</p>
                                  </details>
                                  <p className="text-meta text-ink-muted mt-2">{locale === "vi" ?
                                    "Chỉ chứng nhận bao khoảng số học theo mô hình hình học cố định; chưa chứng minh toàn bộ phép quy giản hình học hoặc nâng hạng phản biện AI lịch sử." :
                                    "Certifies numerical enclosure under the fixed geometric reduction only; it does not prove that reduction or upgrade the historical AI review."}</p>
                                </> : item.numericVerification ? <p role="alert" className="text-meta text-danger-700 mt-2">{copy.agentReviewIntegrityBad}</p>
                                  : item.numericVerificationJobStatus === "DEAD_LETTER" ? <p role="alert" className="text-meta text-danger-700 mt-2">
                                    {locale === "vi" ? "Job kiểm chứng thất bại; không có chứng chỉ được lưu." : "Verification job failed; no certificate was retained."}
                                  </p> : ["PENDING", "READY", "RUNNING"].includes(item.numericVerificationJobStatus ?? "") ? <p className="text-meta text-ink-muted mt-2">
                                    {locale === "vi" ? "Đang xếp hàng/chạy công cụ cố định…" : "Fixed-tool verification queued/running…"}
                                  </p> : canRequest && queueEnabled && codexMode && getEnv().MATH_EXACT_REPLAY_IMAGE &&
                                    ["AWAITING_REVIEW", "APPROVED"].includes(item.researchRun.status) && attempt.data.exactAnswer ?
                                    <form action={requestMathExactNumericVerificationAction} className="mt-3">
                                      <input type="hidden" name="slug" value={workspaceSlug} />
                                      <input type="hidden" name="caseId" value={item.id} />
                                      <Button type="submit" variant="secondary">{locale === "vi" ? "Chạy kiểm chứng khoảng độc lập" : "Run independent interval check"}</Button>
                                    </form> : null}
                              </div>
                            </div>
                          ) : null}
                          {parsed.success && hasErdosStrausEquation(parsed.data) && attempt.data.erdosStrausWitnesses?.length ? (
                            <div className="border-line mt-3 border-l-2 pl-3">
                              <p className="text-meta text-ink font-semibold">{copy.exactWitness}</p>
                              <ul className="text-meta mt-2 space-y-2">{attempt.data.erdosStrausWitnesses.map((witness, index) => {
                                const certificate = verifyErdosStrausWitness(witness);
                                return <li key={index} className="break-all">
                                  <span className={certificate.valid ? "text-success-700" : "text-danger-700"}>{certificate.classification}</span>
                                  {` · (n,x,y,z)=(${witness.n}, ${witness.x}, ${witness.y}, ${witness.z}) · ${certificate.reason}`}
                                  {certificate.identityDigest ? <span className="block">SHA-256: {certificate.identityDigest}</span> : null}
                                </li>;
                              })}</ul>
                              <p className="text-meta text-ink-muted mt-2">{copy.exactWitnessLimit}</p>
                            </div>
                          ) : null}
                          {formalTarget ? (
                            <section className="border-line bg-surface-subtle mt-5 min-w-0 rounded-lg border p-4" aria-label={locale === "vi" ? "Kiểm chứng hình thức" : "Formal proof check"}>
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <div>
                                  <p className="text-meta text-ink font-semibold">{locale === "vi" ? "Kiểm chứng hình thức · Lean" : "Formal proof check · Lean"}</p>
                                  <p className="text-meta text-ink-muted mt-1">{locale === "vi"
                                    ? "Mô hình chỉ viết tactic; phát biểu được cố định theo hợp đồng bài toán. Kết quả biên dịch không tự xác nhận rằng hình thức hóa đúng nghĩa đề gốc."
                                    : "The model writes tactics only; the statement is fixed by the problem contract. Compilation does not attest semantic alignment."}</p>
                                </div>
                                {formalRecord ? <StatusBadge tone={formalRecord.check.status === "KERNEL_ACCEPTED_ALIGNMENT_PENDING" ? "warning" : "danger"}>
                                  {formalRecord.check.status === "KERNEL_ACCEPTED_ALIGNMENT_PENDING"
                                    ? (locale === "vi" ? "Lean nhận · chờ đối chiếu" : "Lean accepted · alignment pending")
                                    : formalRecord.check.status === "REJECTED" ? (locale === "vi" ? "Bị từ chối" : "Rejected") : (locale === "vi" ? "Không khả dụng" : "Unavailable")}
                                </StatusBadge> : null}
                              </div>
                              <details className="text-meta text-ink-muted mt-3">
                                <summary className="text-ink cursor-pointer font-medium">{locale === "vi" ? "Xem phát biểu Lean và ánh xạ ngữ nghĩa" : "View Lean statement and semantic mapping"}</summary>
                                <pre className="border-line mt-3 overflow-x-auto rounded-md border p-3 font-mono text-xs">{formalTarget.declaration}</pre>
                                <dl className="mt-3 grid gap-2">{formalTarget.alignmentMap.map((mapping) => (
                                  <div key={mapping.informal} className="min-w-0"><dt className="text-ink">{mapping.informal}</dt><dd className="break-words font-mono text-xs">{mapping.formal}</dd></div>
                                ))}</dl>
                              </details>
                              {formalRecord ? <>
                                <p className="text-meta text-ink-muted mt-3">{formalRecord.check.diagnostic}</p>
                                <p className="text-meta text-ink-muted mt-2">{locale === "vi" ? "Số lượt kiểm tra:" : "Checker rounds:"} {formalRecord.trace.filter((event) => event.kind === "CHECKED").length}/2</p>
                                {formalRecord.check.compilerFeedback ? <details className="text-meta text-ink-muted mt-2">
                                  <summary className="text-ink cursor-pointer font-medium">{locale === "vi" ? "Xem lỗi biên dịch Lean" : "View Lean compiler feedback"}</summary>
                                  <pre className="border-line mt-2 max-h-64 overflow-auto rounded-md border p-3 font-mono text-xs">{formalRecord.check.compilerFeedback}</pre>
                                </details> : null}
                                {formalRecord.trace.at(-1)?.kind === "REPAIR_FAILED" ? <p role="alert" className="text-meta text-danger-700 mt-2">{locale === "vi" ? "Lượt sửa tactic không hoàn tất; giữ kết quả kiểm tra đầu tiên." : "The tactic repair did not complete; the first checker result was retained."}</p> : null}
                                <p className="text-meta text-ink-muted mt-2 break-all">Lean image: {formalRecord.check.image ?? "—"}</p>
                                <p className="text-meta text-ink-muted mt-1 break-all">Source SHA-256: {item.formalAttempts[0]?.proofSourceDigest}</p>
                                <p className="text-meta text-ink-muted mt-1 break-all">Audit SHA-256: {item.formalAttempts[0]?.checkDigest}</p>
                                <details className="text-meta text-ink-muted mt-3"><summary className="text-ink cursor-pointer font-medium">{locale === "vi" ? "Xem tactic nguyên văn" : "View exact tactic source"}</summary>
                                  <pre className="border-line mt-2 max-h-96 overflow-auto rounded-md border p-3 font-mono text-xs">{item.formalAttempts[0]?.proofTactics}</pre>
                                </details>
                                {formalRecord.check.status === "KERNEL_ACCEPTED_ALIGNMENT_PENDING" ? <div className="border-line mt-4 border-t pt-4">
                                  <p className="text-meta text-ink font-semibold">{locale === "vi" ? "Phát lại bằng checker tách biệt" : "Separate checker replay"}</p>
                                  <p className="text-meta text-ink-muted mt-1">{locale === "vi"
                                    ? "lean4checker được build riêng và phát lại .olean trong môi trường Lean mới, nhưng vẫn dùng kernel Lean cùng phiên bản; chưa xác nhận phát biểu hình thức tương đương đề gốc."
                                    : "Separately built lean4checker replays the olean in a fresh Lean environment, but uses the same Lean kernel version; informal-statement alignment remains unverified."}</p>
                                  {formalReplay ? <div className="mt-3">
                                    <StatusBadge tone={formalReplay.status === "REPLAY_ACCEPTED" ? "warning" : "danger"}>
                                      {formalReplay.status === "REPLAY_ACCEPTED"
                                        ? (locale === "vi" ? "Kernel phát lại đạt · chờ đối chiếu nghĩa" : "Kernel replay passed · alignment pending")
                                        : (locale === "vi" ? "Phát lại bị từ chối" : "Replay rejected")}
                                    </StatusBadge>
                                    <p className="text-meta text-ink-muted mt-2">{formalReplay.diagnostic}</p>
                                    <p className="text-meta text-ink-muted mt-1 break-all">Checker image ID: {formalReplay.imageId}</p>
                                    <p className="text-meta text-ink-muted mt-1 break-all">Replay SHA-256: {item.formalAttempts[0]?.replay?.resultDigest}</p>
                                  </div> : item.formalAttempts[0]?.replay ? <p role="alert" className="text-meta text-danger-700 mt-2">
                                    {locale === "vi" ? "Hồ sơ phát lại không vượt qua kiểm tra toàn vẹn." : "Replay record failed integrity validation."}
                                  </p> : item.formalReplayJobStatus === "DEAD_LETTER" ? <div className="mt-2">
                                    <p role="alert" className="text-meta text-danger-700">{locale === "vi" ? "Job phát lại thất bại; chưa có kết quả được lưu." : "Fresh replay job failed; no result was retained."}</p>
                                    {item.formalReplayDispatchCount === 1 && canRequest && queueEnabled && getEnv().MATH_FORMAL_REPLAY_IMAGE ?
                                      <form action={requestMathPilotFormalReplayAction} className="mt-3">
                                        <input type="hidden" name="slug" value={workspaceSlug} />
                                        <input type="hidden" name="formalAttemptId" value={item.formalAttempts[0]?.id} />
                                        <Button type="submit" variant="secondary">{locale === "vi" ? "Thử phát lại một lần" : "Retry replay once"}</Button>
                                      </form> : null}
                                  </div> : ["PENDING", "READY", "RUNNING"].includes(item.formalReplayJobStatus ?? "") ? <p className="text-meta text-ink-muted mt-2">
                                    {locale === "vi" ? "Đang xếp hàng/chạy phát lại kernel…" : "Fresh kernel replay queued/running…"}
                                  </p> : canRequest && queueEnabled && getEnv().MATH_FORMAL_REPLAY_IMAGE ?
                                    <form action={requestMathPilotFormalReplayAction} className="mt-3">
                                      <input type="hidden" name="slug" value={workspaceSlug} />
                                      <input type="hidden" name="formalAttemptId" value={item.formalAttempts[0]?.id} />
                                      <Button type="submit" variant="secondary">{locale === "vi" ? "Phát lại bằng lean4checker" : "Replay with lean4checker"}</Button>
                                    </form> : <p className="text-meta text-ink-muted mt-2">{locale === "vi" ? "Checker replay local chưa được cấu hình." : "Local replay checker is not configured."}</p>}
                                  {formalReplay?.status === "REPLAY_ACCEPTED" ? <div className="border-line mt-4 border-t pt-4">
                                    <p className="text-meta text-ink font-semibold">{locale === "vi" ? "Gate ánh xạ ngữ nghĩa" : "Semantic alignment gate"}</p>
                                    <p className="text-meta text-ink-muted mt-1">{locale === "vi"
                                      ? "Người vận hành đối chiếu chính xác miền, giả thiết, kết luận và biên của phát biểu Lean với hợp đồng gốc. Xác nhận này không phải phản biện chuyên gia để công bố."
                                      : "An operator checks the Lean domain, assumptions, conclusion and boundaries against the original contract. This is not expert publication review."}</p>
                                    {formalAlignment ? <div className="mt-3">
                                      <StatusBadge tone={formalAlignment.status === "ISSUE_FOUND" ? "danger" : "warning"}>
                                        {formalAlignment.status === "OPERATOR_ALIGNED"
                                          ? (locale === "vi" ? "Người vận hành xác nhận ánh xạ" : "Operator attested mapping")
                                          : formalAlignment.status === "ISSUE_FOUND" ? (locale === "vi" ? "Có vấn đề ánh xạ" : "Mapping issue found")
                                            : (locale === "vi" ? "Chưa xác định" : "Unresolved")}
                                      </StatusBadge>
                                      <p className="text-meta text-ink-muted mt-2">{formalAlignment.rationale}</p>
                                      <p className="text-meta text-ink-muted mt-1 break-all">Alignment SHA-256: {item.formalAttempts[0]?.alignment?.reportDigest}</p>
                                      <details className="text-meta text-ink-muted mt-2"><summary className="text-ink cursor-pointer font-medium">{locale === "vi" ? "Xem bốn tiêu chí" : "View four checks"}</summary>
                                        <ul className="mt-2 space-y-2">{formalAlignment.checks.map((check) => <li key={check.criterion}>
                                          <span className="text-ink font-medium">{alignmentLabels[check.criterion][locale]} · {check.verdict}</span>
                                          <span className="block">{check.note}</span>
                                        </li>)}</ul>
                                      </details>
                                    </div> : item.formalAttempts[0]?.alignment ? <p role="alert" className="text-meta text-danger-700 mt-2">
                                      {locale === "vi" ? "Hồ sơ ánh xạ không vượt qua kiểm tra toàn vẹn." : "Alignment record failed integrity validation."}
                                    </p> : canReview ? <details className="mt-3">
                                      <summary className="text-meta text-ink cursor-pointer font-medium">{locale === "vi" ? "Đánh giá ánh xạ và ghi nhận" : "Review and retain mapping"}</summary>
                                      <form action={attestMathPilotFormalAlignmentAction} className="mt-3 space-y-4">
                                        <input type="hidden" name="slug" value={workspaceSlug} />
                                        <input type="hidden" name="formalAttemptId" value={item.formalAttempts[0]?.id} />
                                        {FORMAL_ALIGNMENT_CHECKS.map((criterion) => <div key={criterion} className="border-line rounded-md border p-3">
                                          <label className="text-meta text-ink block font-medium">{alignmentLabels[criterion][locale]}
                                            <select name={`verdict_${criterion}`} defaultValue="UNRESOLVED" className={inputClass}>
                                              <option value="UNRESOLVED">{locale === "vi" ? "Chưa xác định" : "Unresolved"}</option>
                                              <option value="ALIGNED">{locale === "vi" ? "Khớp" : "Aligned"}</option>
                                              <option value="ISSUE">{locale === "vi" ? "Có vấn đề" : "Issue"}</option>
                                            </select>
                                          </label>
                                          <label className="text-meta text-ink mt-3 block font-medium">{locale === "vi" ? "Giải thích cụ thể" : "Specific reasoning"}
                                            <textarea name={`note_${criterion}`} required minLength={20} maxLength={1000} rows={2} className={inputClass} />
                                          </label>
                                        </div>)}
                                        <label className="text-meta text-ink block font-medium">{locale === "vi" ? "Kết luận và giới hạn" : "Conclusion and limits"}
                                          <textarea name="rationale" required minLength={40} maxLength={4000} rows={3} className={inputClass} />
                                        </label>
                                        <label className="text-meta text-ink flex items-start gap-2"><input type="checkbox" name="confirmed" className="mt-1" />
                                          <span>{locale === "vi" ? "Tôi đã tự đối chiếu phát biểu Lean với hợp đồng gốc; đánh giá này không xác nhận tính mới hoặc cho phép công bố." : "I personally compared the Lean statement with the original contract; this does not certify novelty or authorize publication."}</span>
                                        </label>
                                        <Button type="submit" variant="secondary">{locale === "vi" ? "Lưu đánh giá bất biến" : "Retain immutable review"}</Button>
                                      </form>
                                    </details> : <p className="text-meta text-ink-muted mt-2">{locale === "vi" ? "Cần quyền đánh giá nghiên cứu để ghi nhận gate này." : "Research-review permission is required for this gate."}</p>}
                                  </div> : null}
                                </div> : null}
                                <p className="text-meta text-warning-700 mt-3">{locale === "vi"
                                  ? (formalAlignment?.status === "OPERATOR_ALIGNED"
                                    ? "Ánh xạ đã được người vận hành xác nhận ở mức local; vẫn chưa có phản biện chuyên gia độc lập, kiểm tra tính mới hoặc quyết định công bố."
                                    : "Chưa phải định lý được nghiệm thu: cần đối chiếu phát biểu–đề gốc; kernel replay không thay thế gate ngữ nghĩa.")
                                  : (formalAlignment?.status === "OPERATOR_ALIGNED"
                                    ? "Operator mapping is locally attested; independent expert review, novelty check and publication approval remain open."
                                    : "Not an accepted theorem: statement alignment remains open; kernel replay does not replace that gate.")}</p>
                              </> : item.formalAttempts.length ? <p role="alert" className="text-meta text-danger-700 mt-3">{locale === "vi" ? "Hồ sơ kiểm chứng không vượt qua kiểm tra toàn vẹn." : "Formal record failed integrity validation."}</p>
                                : item.formalAttemptJobStatus === "DEAD_LETTER" ? <div className="mt-3">
                                  <p role="alert" className="text-meta text-danger-700">{locale === "vi" ? "Job hình thức hóa thất bại; chưa có kết quả được lưu." : "Formalization job failed; no result was retained."}</p>
                                  {item.formalAttemptDispatchCount === 1 && canRequest && queueEnabled && codexMode &&
                                    getEnv().MATH_FORMAL_LEAN_IMAGE === PILOT_LEAN_IMAGE ?
                                    <form action={requestMathPilotFormalAttemptAction} className="mt-3">
                                      <input type="hidden" name="slug" value={workspaceSlug} />
                                      <input type="hidden" name="caseId" value={item.id} />
                                      <Button type="submit" variant="secondary">{locale === "vi" ? "Thử lại một lần sau khi kiểm tra" : "Retry once after inspection"}</Button>
                                    </form> : null}
                                </div>
                                : ["PENDING", "READY", "RUNNING"].includes(item.formalAttemptJobStatus ?? "") ? <p className="text-meta text-ink-muted mt-3">{locale === "vi" ? "Đang xếp hàng/chạy kiểm chứng hình thức…" : "Formal check queued/running…"}</p>
                                : canRequest && queueEnabled && codexMode && getEnv().MATH_FORMAL_LEAN_IMAGE === PILOT_LEAN_IMAGE &&
                                  ["AWAITING_REVIEW", "APPROVED"].includes(item.researchRun.status) ?
                                  <form action={requestMathPilotFormalAttemptAction} className="mt-4">
                                    <input type="hidden" name="slug" value={workspaceSlug} />
                                    <input type="hidden" name="caseId" value={item.id} />
                                    <Button type="submit" variant="secondary">{locale === "vi" ? "Thử hình thức hóa và kiểm tra Lean" : "Attempt formalization and Lean check"}</Button>
                                  </form> : <p className="text-meta text-ink-muted mt-3">{locale === "vi" ? "Pilot Lean chưa được cấu hình hoặc hồ sơ chưa đủ điều kiện." : "Lean pilot is not configured or this case is not eligible."}</p>}
                            </section>
                          ) : null}
                          <p className="text-meta text-ink-muted mt-3 break-all">SHA-256: {item.researchRun.mathModelAttemptDigest}</p>
                        </div>
                      ) : null}
                      <div className="border-line mt-5 border-t pt-5">
                        <h4 className="text-section-title text-ink-strong">{copy.reviewDesk}</h4>
                        <p className="text-meta text-ink-muted mt-1">{copy.reviewPrinciple}</p>
                        <div className="mt-4 grid min-w-0 grid-cols-1 gap-5">
                          <section className="border-line min-w-0 border-l-2 pl-4" aria-label={copy.stageProtocol}>
                            <h5 className="text-meta text-ink font-semibold">{copy.stageProtocol}</h5>
                            <p className={`text-meta mt-2 font-medium ${contractValid ? "text-success-700" : "text-danger-700"}`}>
                              {contractValid ? copy.integrityGood : copy.integrityBad}
                            </p>
                            {parsed.success ? (
                              <dl className="text-meta text-ink-muted mt-3 grid gap-x-5 gap-y-2 sm:grid-cols-2">
                                {([
                                  [copy.definitions, parsed.data.definitions],
                                  [copy.assumptions, parsed.data.assumptions],
                                  [copy.falsificationCriterion, parsed.data.falsificationCriterion],
                                  [copy.successCriterion, parsed.data.successCriterion],
                                  [copy.exclusions, parsed.data.exclusions],
                                ] as const).map(([label, value]) => (
                                  <div key={label} className="min-w-0"><dt className="text-ink font-medium">{label}</dt><dd className="mt-1 whitespace-pre-wrap break-words"><MathText text={value} /></dd></div>
                                ))}
                              </dl>
                            ) : null}
                          </section>

                          <section className="border-line min-w-0 border-l-2 pl-4" aria-label={copy.stageEvidence}>
                            <h5 className="text-meta text-ink font-semibold">{copy.stageEvidence}</h5>
                            {!attemptValid ? <p role="alert" className="text-meta text-danger-700 mt-2">{copy.attemptIntegrityBad}</p> : null}
                            {item.researchRun.status === "APPROVED" && !item.approvedIntegrityValid ? <p role="alert" className="text-meta text-danger-700 mt-2">{copy.researchIntegrityBad}</p> : null}
                            {item.researchRun.sources.length ? (
                              <ul className="text-meta text-ink-muted mt-2 space-y-1">
                                {item.researchRun.sources.map((source) => <li key={source.canonicalUri} className="break-all">{copy.sourceLabel}: {source.canonicalUri}</li>)}
                              </ul>
                            ) : <p className="text-meta text-ink-muted mt-2">{copy.noExternalSource}</p>}
                            {!campaignCase && item.researchRun.status === "AWAITING_REVIEW" && independentReviewer && contractValid && attemptValid && providerValid ? (
                              <form action={reviewMathPilotResearchAction} className="mt-3 grid gap-4">
                                <input type="hidden" name="slug" value={workspaceSlug} />
                                <input type="hidden" name="runId" value={item.researchRun.id} />
                                {item.researchRun.findings.map((finding) => (
                                  <fieldset key={finding.id} className="border-line min-w-0 border-t pt-3">
                                    <input type="hidden" name="findingId" value={finding.id} />
                                    <legend className="text-meta text-ink font-medium">{copy.findingLabel} · {finding.kind}</legend>
                                    <p className="text-body text-ink mt-2 break-words"><MathText text={finding.claim} /></p>
                                    {finding.exactExcerpt ? <blockquote className="text-meta text-ink-muted border-line mt-2 border-l-2 pl-3">{finding.exactExcerpt}</blockquote> : null}
                                    <label className="text-meta text-ink mt-3 block font-medium">{copy.findingDecision}
                                      <select name={`decision:${finding.id}`} required defaultValue="" className={inputClass}>
                                        <option value="" disabled>{copy.chooseDecision}</option>
                                        <option value="ACCEPTED">{copy.acceptFinding}</option>
                                        <option value="REJECTED">{copy.rejectFinding}</option>
                                        <option value="FLAGGED">{copy.flagFinding}</option>
                                      </select>
                                    </label>
                                    <label className="text-meta text-ink mt-3 block font-medium">{copy.findingRationale}
                                      <textarea name={`rationale:${finding.id}`} required rows={2} maxLength={4000} className={inputClass} />
                                    </label>
                                  </fieldset>
                                ))}
                                <label className="text-meta text-ink font-medium">{copy.researchRationale}
                                  <textarea name="runRationale" required rows={2} maxLength={4000} className={inputClass} />
                                </label>
                                <p className="text-meta text-ink-muted">{copy.approveRule}</p>
                                <div className="flex flex-wrap gap-2">
                                  <Button type="submit" name="runDecision" value="APPROVED">{copy.approveResearch}</Button>
                                  <Button type="submit" name="runDecision" value="REJECTED" variant="secondary">{copy.rejectResearch}</Button>
                                </div>
                              </form>
                            ) : (
                              <p className="text-meta text-ink-muted mt-2">
                                {item.researchRun.status === "APPROVED" ? copy.researchApproved
                                  : item.researchRun.status === "REJECTED" ? copy.researchRejected
                                  : item.researchRun.status === "FAILED" ? copy.runFailed
                                  : ["QUEUED", "RUNNING"].includes(item.researchRun.status) ? copy.runInProgress
                                  : !independentReviewer && item.researchRun.status === "AWAITING_REVIEW" && !codexMode ? copy.reviewerNeeded
                                  : codexMode && item.researchRun.status === "AWAITING_REVIEW" ? copy.agentSourcePending
                                  : copy.waitingResearch}
                              </p>
                            )}
                            {item.researchRun.status === "AWAITING_REVIEW" && !independentReviewer && canInviteReviewer && !codexMode ? (
                              <Link href={`/w/${workspaceSlug}/settings/members`} className="text-meta text-ink mt-2 inline-flex min-h-10 items-center gap-1 font-medium">
                                {copy.reviewerLink} <ArrowRight className="size-4" aria-hidden="true" />
                              </Link>
                            ) : null}
                            {item.researchRun.reviewRationale ? <p className="text-meta text-ink-muted mt-2 whitespace-pre-wrap"><MathText text={item.researchRun.reviewRationale} /></p> : null}
                            {["APPROVED", "REJECTED"].includes(item.researchRun.status) ? (
                              <dl className="border-line mt-3 grid gap-3 border-t pt-3">
                                {item.researchRun.findings.map((finding) => (
                                  <div key={finding.id} className="min-w-0">
                                    <dt className="text-meta text-ink font-medium break-words"><MathText text={finding.claim} /></dt>
                                    <dd className="text-meta text-ink-muted mt-1 break-words">
                                      {finding.decision ? copy.findingOutcome[finding.decision.decision] : copy.chooseDecision}
                                      {finding.decision?.rationale ? <> · <MathText text={finding.decision.rationale} /></> : ""}
                                    </dd>
                                  </div>
                                ))}
                              </dl>
                            ) : null}
                          </section>

                          <section className="border-line min-w-0 border-l-2 pl-4" aria-label={copy.stageMath}>
                            <h5 className="text-meta text-ink font-semibold">{copy.stageMath}</h5>
                            {!campaignCase && codexMode && attempt.success && contractValid && ["AWAITING_REVIEW", "APPROVED"].includes(item.researchRun.status) ? (
                              <div className="border-line bg-surface-subtle mt-3 rounded-md border p-4">
                                <p className="text-body text-ink font-semibold">{copy.agentReviewTitle}</p>
                                <p className="text-meta text-ink-muted mt-1">{copy.agentReviewHint}</p>
                                {item.agentReview ? agentLedger ? (
                                  <div className="mt-3">
                                    <StatusBadge tone={agentLedger.disposition === "AI_REVIEWED" ? "success" : "warning"}>
                                      {agentLedger.disposition === "AI_REVIEWED" ? copy.agentReviewReviewed : copy.agentReviewInconclusive}
                                    </StatusBadge>
                                    <p className="text-meta text-ink-muted mt-2">{copy.conclusion[agentLedger.conclusion]}</p>
                                    {item.caseType === "BENCHMARK_EXACT" && agentLedger.exactReplay ? (
                                      <p className="text-meta text-ink-muted mt-2 break-all">
                                        {copy.exactReplay}: {agentLedger.exactReplay.status} · {agentLedger.exactReplay.reason}
                                        {agentLedger.exactReplay.image ? ` · ${agentLedger.exactReplay.image}` : ""}
                                        {agentLedger.exactReplay.observedAnswer ? ` · ${copy.exactObserved}: ${agentLedger.exactReplay.observedAnswer}` : ""}
                                        {` · SHA-256 ${agentLedger.exactReplay.codeDigest}`}
                                      </p>
                                    ) : null}
                                    {item.caseType === "BENCHMARK_EXACT" && agentLedger.exactInterval ? (
                                      <div className="border-line bg-surface mt-3 min-w-0 rounded-md border p-3">
                                        <p className="text-meta text-ink font-semibold">
                                          {copy.exactInterval}: {agentLedger.exactInterval.status} · {agentLedger.exactInterval.reason}
                                          {agentLedger.exactInterval.floor ? ` · ⌊10^9 E⌋ = ${agentLedger.exactInterval.floor}` : ""}
                                        </p>
                                        <p className="text-meta text-ink-muted mt-1">{copy.exactCaution}</p>
                                        {agentLedger.exactInterval.lowerScaled && agentLedger.exactInterval.upperScaled ? (
                                          <details className="text-meta text-ink-muted mt-2 min-w-0">
                                            <summary className="cursor-pointer">{copy.exactIntervalBounds}</summary>
                                            <p className="mt-2 break-all font-mono">[{agentLedger.exactInterval.lowerScaled}, {agentLedger.exactInterval.upperScaled}] / 10^80</p>
                                          </details>
                                        ) : null}
                                        <p className="text-meta text-ink-muted mt-2 break-all">
                                          {copy.exactIntervalSource}: SHA-256 {agentLedger.exactInterval.programDigest}
                                          {agentLedger.exactInterval.image ? ` · ${agentLedger.exactInterval.image}` : ""}
                                          {agentLedger.exactInterval.outputDigest ? ` · output SHA-256 ${agentLedger.exactInterval.outputDigest}` : ""}
                                        </p>
                                      </div>
                                    ) : null}
                                    <div className="border-line mt-3 grid gap-3 border-t pt-3">
                                      {agentLedger.reports.map((report) => (
                                        <div key={report.role} className="min-w-0">
                                          <p className="text-meta text-ink font-semibold">{copy.agentRole[report.role]} · {report.verdict}</p>
                                          {agentLedger.version >= 3 ? (
                                            <p className="text-meta text-ink-muted mt-1 break-all">
                                              {copy.agentRequestedModel}: {agentLedger.reviewerModels?.find((model) => model.role === report.role)?.requestedModelName}
                                              {` · ${copy.agentRequestedModelEvidence}`}
                                            </p>
                                          ) : null}
                                          <p className="text-meta text-ink-muted mt-1 whitespace-pre-wrap break-words"><MathText text={report.reasoning} /></p>
                                          {report.unresolvedGap ? <p className="text-meta text-danger-700 mt-1 whitespace-pre-wrap break-words"><MathText text={report.unresolvedGap} /></p> : null}
                                        </div>
                                      ))}
                                    </div>
                                    <p className="text-meta text-ink-muted mt-3">{agentLedger.oracle.note}</p>
                                    <p className="text-meta text-ink-muted mt-2 break-all">SHA-256: {item.agentReview.ledgerDigest}</p>
                                    <p className="text-meta text-ink-muted mt-2">{copy.agentReviewCaution}</p>
                                  </div>
                                ) : <p role="alert" className="text-meta text-danger-700 mt-2">{copy.agentReviewIntegrityBad}</p>
                                : item.agentReviewJobStatus === "DEAD_LETTER" ? <p role="alert" className="text-meta text-danger-700 mt-2">{copy.agentReviewFailed}</p>
                                : ["PENDING", "READY", "RUNNING"].includes(item.agentReviewJobStatus ?? "") ? <p className="text-meta text-ink-muted mt-2">{copy.agentReviewQueued}</p>
                                : canRequest ? (
                                  <form action={requestMathPilotAgentReviewAction} className="mt-3">
                                    <input type="hidden" name="slug" value={workspaceSlug} />
                                    <input type="hidden" name="caseId" value={item.id} />
                                    <Button type="submit" variant="secondary">{copy.agentReviewStart}</Button>
                                  </form>
                                ) : null}
                              </div>
                            ) : null}
                            {!campaignCase && codexMode && item.caseType === "OPEN" && agentLedger && contractValid && attempt.success && parsed.success && !parsed.data.lrcFiniteScope ? (
                              <div className="min-w-0">
                              <div className="text-meta text-ink-muted mb-3 flex flex-wrap items-center gap-3">
                                <span>{locale === "vi" ? `Đang hiển thị ${cycles.length}/${cyclePage.total} đợt, mỗi đợt tải trọn chuỗi sự kiện.` : `Showing ${cycles.length}/${cyclePage.total} campaigns, each with its full event chain.`}</span>
                                {selection?.cyclesAfter || selection?.cycleId ? <Link prefetch={false} className="text-ink underline" href={hrefFor({})}>{locale === "vi" ? "Đợt mới nhất" : "Latest campaigns"}</Link> : null}
                                {cycles.slice(1).map((cycle) => <Link key={cycle.id} prefetch={false} className="text-ink underline break-all" href={hrefFor({ cycleId: cycle.id })}>{locale === "vi" ? "Chi tiết đợt" : "Campaign details"} {cycle.id.slice(0, 8)}</Link>)}
                                {cyclePage.hasMore && cyclePage.last ? <Link prefetch={false} className="text-ink underline" href={hrefFor({ cyclesAfter: encodeDossierCursor({ missionId: selectedMissionId, scopeId: item.id,
                                  createdAt: cyclePage.last.createdAt.toISOString(), id: cyclePage.last.id }) })}>{locale === "vi" ? "Các đợt cũ hơn" : "Older campaigns"}</Link> : null}
                              </div>
                              <MathCycleDesk
                                cycle={cyclesByCase.get(item.id)?.[0]}
                                history={cyclesByCase.get(item.id)?.slice(1) ?? []}
                                locale={locale}
                                canRequest={canRequest && queueEnabled && !selection?.cyclesAfter && !selection?.cycleId}
                                slug={workspaceSlug}
                                caseId={item.id}
                                missionId={selectedMissionId}
                                rootContract={parsed.success ? parsed.data : null}
                                gaps={agentLedger.reports.map((report) => report.unresolvedGap).filter((gap): gap is string => Boolean(gap))}
                              />
                              </div>
                            ) : null}
                            {item.assessment ? (
                              <div className="mt-3">
                                <StatusBadge tone="info">{copy.conclusion[item.assessment.conclusion]}</StatusBadge>
                                <p className="text-body text-ink mt-3"><MathText text={item.assessment.rationale} /></p>
                                <p className="text-meta text-ink-muted mt-2 whitespace-pre-wrap"><MathText text={item.assessment.verificationNotes} /></p>
                                {checklistValid && checklist?.success ? (
                                  <div className="border-line mt-4 border-t pt-3">
                                    <p className="text-meta text-ink font-semibold">{copy.recordedChecklist}</p>
                                    <dl className="mt-3 grid gap-3">
                                      {checklist.data.checks.map((check) => (
                                        <div key={check.criterion} className="min-w-0">
                                          <dt className="text-meta text-ink font-medium">{copy.reviewCriteria[check.criterion]} · {copy.verdict[check.verdict]}</dt>
                                          <dd className="text-meta text-ink-muted mt-1 whitespace-pre-wrap break-words"><MathText text={check.note} /></dd>
                                        </div>
                                      ))}
                                    </dl>
                                    <p className="text-meta text-ink-muted mt-3 break-all">{copy.reviewDigest}: {item.assessment.reviewChecklistDigest}</p>
                                  </div>
                                ) : <p className="text-meta text-ink-muted mt-3">{item.assessment.reviewChecklist ? copy.integrityBad : copy.legacyChecklist}</p>}
                                <p className="text-meta text-ink-muted mt-3">{copy.positiveCaution}</p>
                              </div>
                            ) : !campaignCase && independentReviewer && contractValid && item.approvedIntegrityValid && item.researchRun.status === "APPROVED" && providerValid && attemptValid ? (
                              <form action={assessMathPilotCaseAction} className="mt-3 grid gap-4">
                                <input type="hidden" name="slug" value={workspaceSlug} />
                                <input type="hidden" name="caseId" value={item.id} />
                                <p className="text-meta text-ink-muted">{copy.reviewChecklistHint}</p>
                                <p className="text-meta text-ink-muted border-line border-l-2 pl-3">{copy.reviewGuide[item.caseType]}</p>
                                {MATH_REVIEW_CRITERIA.map((criterion) => (
                                  <fieldset key={criterion} className="border-line min-w-0 border-t pt-3">
                                    <legend className="text-meta text-ink font-semibold">{copy.reviewCriteria[criterion]}</legend>
                                    <select name={`verdict:${criterion}`} required defaultValue="" aria-label={`${copy.reviewCriteria[criterion]} — ${copy.chooseVerdict}`} className={inputClass}>
                                      <option value="" disabled>{copy.chooseVerdict}</option>
                                      {Object.entries(copy.verdict).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                                    </select>
                                    <label className="text-meta text-ink mt-2 block font-medium">{copy.checkNote}
                                      <textarea name={`note:${criterion}`} required rows={2} minLength={12} maxLength={1000} className={inputClass} />
                                    </label>
                                  </fieldset>
                                ))}
                                <label className="text-meta text-ink font-medium">{copy.assessment}
                                  <select name="conclusion" required className={inputClass} defaultValue="INCONCLUSIVE">
                                    {Object.entries(copy.conclusion).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                                  </select>
                                </label>
                                <label className="text-meta text-ink font-medium">{copy.rationale}
                                  <textarea name="rationale" required rows={2} maxLength={4000} className={inputClass} />
                                </label>
                                <label className="text-meta text-ink font-medium">{copy.notes}
                                  <textarea name="verificationNotes" required rows={3} maxLength={8000} className={inputClass} />
                                </label>
                                <label className="text-meta text-ink flex items-start gap-2 font-medium">
                                  <input type="checkbox" name="independentVerification" required className="mt-1 size-4" />
                                  <span>{copy.humanAttestation}</span>
                                </label>
                                <p className="text-meta text-ink-muted">{copy.positiveCaution}</p>
                                <Button type="submit" className="justify-self-start">{copy.submitAssessment}</Button>
                              </form>
                            ) : <p className="text-meta text-ink-muted mt-2">{
                              item.researchRun.providerName === "openai" && item.researchRun.status === "APPROVED" && !usage.success
                                ? copy.assessmentBlockedUsage
                                : codexMode && item.researchRun.status === "AWAITING_REVIEW" ? copy.agentMathPending
                                : item.researchRun.status === "APPROVED" && !independentReviewer ? copy.reviewerNeeded : copy.waitingMath
                            }</p>}
                          </section>
                        </div>
                      </div>
                      </> : null}
                      <Link href={`/w/${workspaceSlug}/research#research-runs`} className="text-meta text-ink mt-4 inline-flex min-h-10 items-center gap-2 font-medium">
                        {copy.research} <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                    </Panel>
                  );
                }) : <Panel className="p-6"><p className="text-body text-ink-muted">{copy.empty}</p></Panel>}
              </div>
            </HistoryContainer>
          </>
        ) : null}
      </div>
    </WorkspaceShell>
  );
}

function MathCycleDesk({ cycle, history, locale, canRequest, slug, caseId, missionId, rootContract, gaps }: {
  cycle: Awaited<ReturnType<typeof listMathResearchCycles>>[number] | undefined;
  history: Awaited<ReturnType<typeof listMathResearchCycles>>;
  locale: "vi" | "en"; canRequest: boolean; slug: string; caseId: string; missionId: string; rootContract: MathPilotContract | null; gaps: string[];
}) {
  const vi = locale === "vi";
  const label = vi ? {
    title: "Vòng lặp nghiên cứu có kiểm soát", subtitle: "AI tạo nhiệm vụ từ khoảng trống phản biện; một phiên độc lập kiểm tra trước khi thử nghiệm. Không phải chứng nhận định lý.",
    start: "Khởi động vòng lặp", rounds: "Số vòng tối đa", tokens: "Ngưỡng token quan sát", limit: "Giới hạn",
    calls: "lượt gọi đã bắt đầu", used: "token đã ghi nhận", time: "Hạn dừng", status: "Trạng thái",
    integrity: "Nhật ký không vượt qua kiểm tra toàn vẹn", noGap: "Phản biện chưa ghi khoảng trống cụ thể để tạo nhiệm vụ.",
    round: "Vòng", hypothesis: "Giả thuyết", task: "Nhiệm vụ", sourceGap: "Khoảng trống gốc",
    verification: "Kiểm tra độc lập", attempt: "Thử nghiệm", computation: "Khảo sát chính xác có giới hạn", testedPrimes: "số nguyên tố đã kiểm", outsideBound: "trường hợp chưa có nghiệm trong giới hạn", computationDetails: "Chi tiết phép tính và dấu băm", finiteOnly: "Chỉ kết luận trong khoảng và họ mẫu số đã ghi, không phải chứng minh tổng quát.", exactWitness: "Chứng chỉ nghiệm hữu hạn", noWitness: "Mô hình không xuất bộ nghiệm có cấu trúc để kiểm tra.", review: "Phản biện", pending: "Chưa có kết quả vòng này", exclusionAudit: "Kiểm toán loại trừ từng A", factorPairs: "cặp ước đã xét", admissiblePairs: "cặp hợp lệ", primeTrial: "Thử chia nguyên tố đến", auditScope: "Kiểm toán số học thứ hai, tự tính lại khi đọc; không phải chứng nhận định lý hay phản biện học thuật.", independentReplay: "Công cụ phát lại Python độc lập", replayMissing: "Vòng cũ chưa có bước phát lại độc lập.", replayLimit: "Đã đối chiếu số đếm và từng hàng loại trừ trong miền hữu hạn; chưa xác nhận mệnh đề tổng quát hoặc tính mới.",
    stopped: "Lý do dừng", ledger: "Dấu băm cuối của nhật ký", scope: "Giới hạn phạm vi", novelty: "Không trùng nhiệm vụ", falsifiability: "Khả năng bác bỏ",
    caution: "Token được ghi sau từng lượt; ngưỡng token và thời hạn được kiểm trước lượt kế tiếp, không ngắt một lượt đang chạy. Số lượt và giới hạn 4 phút/lượt là trần cứng. Các phiên cùng họ mô hình, không thay thế phản biện học thuật độc lập.",
    priorArt: "Kết quả đã biết có nguồn", priorArtWarning: "Nhiệm vụ này trùng một phép dựng đã có nguồn; phần trùng không được tính là khám phá mới.",
    unknownNovelty: "Danh mục nguồn hiện chưa bao phủ toàn bộ tài liệu. Tính mới ngoài danh mục vẫn chưa được xác minh.",
    retrospective: "Đối chiếu hồi cứu bằng danh mục hiện tại; nhật ký vòng cũ không được viết lại.",
    frontier: "Hồ sơ biên giới tri thức", frontierGate: "Cổng nguồn và phạm vi",
    frontierMissing: "Vòng cũ chưa có hồ sơ nguồn TIP-032; không thể suy ra tính mới từ vòng này.",
    frontierCoverage: "Nguồn chỉ bao phủ một phần; kết quả tìm kiếm không chứng minh tính mới.",
    sourceAssessment: "Phản biện nguồn", discovery: "Tìm tài liệu", captured: "Đoạn trích lưu giữ",
    externalDiscovery: "Tên và phát biểu toán học sẽ được gửi đến Crossref để tìm tài liệu. Không dùng vòng này cho bài toán mật.",
  } : {
    title: "Controlled research loop", subtitle: "AI turns review gaps into tasks; a separate context verifies each task before execution. This is not theorem certification.",
    start: "Start research loop", rounds: "Maximum rounds", tokens: "Observed token threshold", limit: "Limits",
    calls: "calls started", used: "tokens observed", time: "Deadline", status: "Status",
    integrity: "The event ledger failed integrity validation", noGap: "The review has no explicit gap from which to generate a task.",
    round: "Round", hypothesis: "Hypothesis", task: "Task", sourceGap: "Source review gap",
    verification: "Independent-context check", attempt: "Attempt", computation: "Bounded exact survey", testedPrimes: "primes checked", outsideBound: "cases without a witness within", computationDetails: "Computation details and digest", finiteOnly: "Only the recorded interval and denominator family are covered; this is not a universal proof.", exactWitness: "Finite witness certificate", noWitness: "The model supplied no structured tuple to check.", review: "Peer review", pending: "No round output yet", exclusionAudit: "Per-A exclusion audit", factorPairs: "factor pairs checked", admissiblePairs: "admissible pairs", primeTrial: "Primality trial division through", auditScope: "A second arithmetic audit, recomputed on read; not theorem certification or academic peer review.", independentReplay: "Independent Python tool replay", replayMissing: "This older round has no independent tool replay.", replayLimit: "Counts and per-A exclusions were compared within the finite scope; no universal theorem or novelty is certified.",
    stopped: "Stop reason", ledger: "Final ledger digest", scope: "Scope fidelity", novelty: "AI prior-task check", falsifiability: "Falsifiability",
    caution: "Tokens are recorded after each call; token threshold and deadline are checked before the next call, not mid-call. Call count and the four-minute per-call timeout are hard bounds. Separate sessions of one model family do not replace an independent academic referee.",
    priorArt: "Sourced known results", priorArtWarning: "This task overlaps a sourced known construction; that overlap is not a new discovery.",
    unknownNovelty: "The source catalog is not a complete literature review. Novelty beyond it remains unverified.",
    retrospective: "Retrospective check against the current catalog; the historical ledger is unchanged.",
    frontier: "Knowledge-frontier dossier", frontierGate: "Source and scope gate",
    frontierMissing: "This older round has no TIP-032 source dossier; novelty cannot be inferred from it.",
    frontierCoverage: "Source coverage is partial; search results do not establish novelty.",
    sourceAssessment: "Source assessment", discovery: "Literature discovery", captured: "Retained passage",
    externalDiscovery: "The mathematical statement is sent to Crossref for literature discovery. Do not use this loop for confidential problems.",
  };
  const obligationNames = vi ? {
    GAP: "Khoảng trống", CLAIM: "Giả thuyết", FALSIFICATION: "Phép bác bỏ",
    PROOF: "Nghĩa vụ chứng minh", PRIOR_ART: "Đối chiếu tài liệu",
  } : {
    GAP: "Review gap", CLAIM: "Hypothesis", FALSIFICATION: "Falsification",
    PROOF: "Proof obligation", PRIOR_ART: "Prior-art check",
  };
  const obligationStates = vi ? {
    OPEN: "Chưa khép", TASK_REJECTED: "Task bị từ chối", TASK_ACCEPTED: "Task được nhận",
    TYPED_REFUTATION: "Mệnh đề định kiểu bị bác bỏ", NOT_REFUTED_IN_BOUND: "Chưa bác bỏ trong giới hạn",
    FINITE_REPLAYED: "Đã phát lại hữu hạn", AI_ATTEMPTED: "AI đã thử",
    AI_REVIEWED: "AI đã phản biện", KNOWN_SCOPE: "Đã biết trong nguồn",
    SOURCE_HOLD: "Giữ ở cổng nguồn", RESEARCH_ONLY: "Chỉ được nghiên cứu",
  } : {
    OPEN: "Open", TASK_REJECTED: "Task rejected", TASK_ACCEPTED: "Task accepted",
    TYPED_REFUTATION: "Typed predicate refuted", NOT_REFUTED_IN_BOUND: "Not refuted in bound",
    FINITE_REPLAYED: "Finite replay passed", AI_ATTEMPTED: "AI attempted",
    AI_REVIEWED: "AI reviewed", KNOWN_SCOPE: "Known in captured sources",
    SOURCE_HOLD: "Source gate held", RESEARCH_ONLY: "Research only",
  };
  const priorArt = rootContract ? mathPriorArtFor(rootContract) : [];
  const retrospective = Boolean(cycle && cycle.trace && !cycle.trace.some((event) => event.phase === "PRIOR_ART"));
  const rounds = cycle?.trace ? [...new Set(cycle.trace.map((event) => event.round).filter((round) => round > 0))] : [];
  const obligations = cycle?.trace ? projectMathProofObligations({ cycleId: cycle.id,
    ledgerDigest: cycle.events.at(-1)?.digest ?? "", trace: cycle.trace }) : [];
  const guided = cycle?.trace?.find((event) => event.phase === "HUMAN_STEERED");
  const mixedEvidence = cycle?.trace?.find((event) => event.phase === "MIXED_CORE_EVIDENCE")?.evidence;
  const mixedRefutations = cycle?.trace?.filter((event) => event.phase === "MIXED_CORE_CLAIM_REFUTED") ?? [];
  const seededReplay = cycle?.trace?.find((event) => event.phase === "PRIOR_COUNTEREXAMPLE_REPLAY");
  const gateDossier = cycle?.trace?.find((event) => event.phase === "PRIOR_GATE_DOSSIER");
  const priorFindingEvent = cycle?.trace?.find((event) => event.phase === "PRIOR_FINDINGS");
  const portfolioEvent = cycle?.trace?.find((event) => event.phase === "PORTFOLIO_PLANNED");
  const portfolio = portfolioEvent?.phase === "PORTFOLIO_PLANNED" ? portfolioEvent.portfolio : null;
  const portfolioSummary = cycle?.trace && portfolio ? summarizeMathPortfolio(portfolio, cycle.trace) : [];
  const historicalFindings = history.flatMap((previous) => {
    if (!previous.trace) return [];
    const finding = priorFiniteFindingFromTrace({ cycleId: previous.id,
      sourceLedgerDigest: previous.events.at(-1)?.digest ?? "", trace: previous.trace });
    return finding ? [finding] : [];
  }).slice(0, 8);
  const visibleFindings = priorFindingEvent?.phase === "PRIOR_FINDINGS"
    ? priorFindingEvent.findings : historicalFindings;
  return (
    <section className="border-line bg-surface-subtle mt-5 min-w-0 rounded-md border p-4 sm:p-5" aria-label={label.title}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h5 className="text-section-title text-ink-strong">{label.title}</h5>
          <p className="text-meta text-ink-muted mt-1 max-w-2xl">{label.subtitle}</p>
        </div>
        {cycle ? <StatusBadge tone={cycle.status === "STOPPED" ? "neutral" : cycle.status === "FAILED" ? "danger" : "warning"}>
          {cycle.status}
        </StatusBadge> : null}
      </div>
      <div className="border-line text-meta text-ink-muted mt-4 border-t pt-3">
        <p className="text-ink font-medium">{label.priorArt}</p>
        {priorArt.length ? <ul className="mt-2 space-y-1">
          {priorArt.map((fact) => <li key={fact.id}><MathText text={fact.claim} /> <a className="underline underline-offset-2" href={fact.sourceUrl} target="_blank" rel="noreferrer">{fact.sourceTitle}</a>
            <span className="block"><MathText text={`${fact.sourceScope} · ${fact.scopeLift}`} /></span>
          </li>)}
        </ul> : null}
        <p className="mt-2">{label.unknownNovelty}</p>
        {retrospective ? <p className="mt-2">{label.retrospective}</p> : null}
      </div>
      {!cycle ? gaps.length && canRequest ? <>
        <MathPortfolioLaunchForm slug={slug} caseId={caseId} missionId={missionId} locale={locale} />
        {rootContract && hasErdosStrausEquation(rootContract) ? <details className="border-line mt-4 rounded-md border p-3 sm:p-4">
          <summary className="text-meta text-ink cursor-pointer font-semibold">{vi
            ? "Hoặc: định hướng một vòng bằng cửa A do người chọn"
            : "Alternatively: steer one round with a human-selected A gate"}</summary>
          <p className="text-meta text-ink-muted mt-2">{vi
            ? "Đây là chế độ thay thế, không chạy đồng thời với portfolio tự trị; đợt đã niêm phong không thể chuyển chế độ."
            : "This is an alternative mode, not concurrent with the autonomous portfolio; a sealed campaign cannot switch modes."}</p>
          <MathCycleSteeringForm slug={slug} caseId={caseId} missionId={missionId} locale={locale} />
        </details> : null}
      </> : <p className="text-meta text-ink-muted mt-3">{label.noGap}</p> : (
        <>
          <dl className="border-line text-meta mt-4 grid gap-3 border-y py-3 sm:grid-cols-3">
            <div><dt className="text-ink-muted">{label.limit}</dt><dd className="text-ink font-medium">{cycle.completedRounds}/{cycle.maxRounds} {label.rounds.toLowerCase()} · {cycle.callsStarted}/{cycle.maxCalls} {label.calls}</dd></div>
            <div><dt className="text-ink-muted">{label.tokens}</dt><dd className="text-ink font-medium">{cycle.observedTokens.toLocaleString(locale)} / {cycle.maxObservedTokens.toLocaleString(locale)} {label.used}</dd></div>
            <div><dt className="text-ink-muted">{label.time}</dt><dd className="text-ink font-medium">{cycle.deadlineAt.toLocaleString(locale)}</dd></div>
          </dl>
          {cycle.trace ? <MathAdaptiveStrategyPanel trace={cycle.trace} vi={vi} /> : null}
          {cycle.trace ? <MathLemmaGraphPanel trace={cycle.trace} locale={locale} /> : null}
          {portfolio ? <section className="border-line mt-4 rounded-md border p-3 sm:p-4"
            aria-label={vi ? "Danh mục nhánh nghiên cứu" : "Research branch portfolio"}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h6 className="text-meta text-ink font-semibold">{vi ? "Danh mục nhánh nghiên cứu" : "Research branch portfolio"}</h6>
                <p className="text-meta text-ink-muted mt-1">{vi
                  ? "Planner đề xuất tối đa 3 hướng; bộ điều phối chạy tối đa 2 vòng. Nhánh chưa chạy không phải kết quả âm tính."
                  : "The planner proposes up to 3 lines; the scheduler runs at most 2 rounds. An unrun branch is not a negative result."}</p>
              </div>
              <span className="text-meta text-ink-muted">{portfolio.branches.length} {vi ? "nhánh" : "branches"}</span>
            </div>
            <ol className="mt-3 grid gap-3 lg:grid-cols-2">{portfolio.branches.map((branch, index) => {
              const selected = cycle.trace?.find((event) => event.phase === "BRANCH_SELECTED" &&
                event.branchId === branch.branchId);
              const summary = portfolioSummary.find((item) => item.branchId === branch.branchId);
              const state = selected && summary?.state === "NOT_RUN" ? "RUNNING" : summary?.state ?? "NOT_RUN";
              return <li key={branch.branchId} className="border-line bg-surface min-w-0 rounded-md border p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-meta text-ink font-semibold">{index + 1}. {branch.strategy.replaceAll("_", " ")}</p>
                  <StatusBadge tone={state === "FAILED" ? "danger" : state === "AI_REVIEWED" ? "success" : "neutral"}>
                    {state === "NOT_RUN" ? (vi ? "Chưa chạy" : "Not run") : state}
                  </StatusBadge>
                </div>
                <p className="text-meta text-ink-muted mt-2"><MathText text={branch.proposal.hypothesis} /></p>
                <p className="text-meta text-ink-muted mt-2">{vi ? "Phép bác bỏ dự kiến" : "Anticipated falsifier"}: <MathText text={branch.anticipatedFalsifier} /></p>
                <p className="text-meta text-ink-muted mt-2">{vi ? "Công cụ" : "Tools"}: {branch.toolNeeds.join(", ") || (vi ? "Không" : "None")}
                  {` · ≤${branch.maxObservedTokens.toLocaleString(locale)} ${vi ? "token quan sát" : "observed tokens"}`}
                  {` · ≤${Math.floor(branch.maxWallSeconds / 60)} ${vi ? "phút trước lượt kế" : "minutes before next call"}`}</p>
                {summary && summary.state !== "NOT_RUN" ? <p className="text-meta text-ink-muted mt-1">{vi ? "Lý do" : "Reason"}: {summary.reason}</p> : null}
                {branch.parentObligationIds.length ? <p className="text-meta text-ink-muted mt-2 break-all">
                  {vi ? "Nghĩa vụ gốc" : "Parent obligations"}: {branch.parentObligationIds.map((id) => id.slice(0, 12)).join(", ")}</p> : null}
              </li>;
            })}</ol>
            <p className="text-meta text-ink-muted mt-3 break-all">SHA-256: {portfolio.portfolioDigest}</p>
          </section> : null}
          {guided ? <div className="border-line text-meta text-ink-muted mt-3 rounded-md border p-3">
              <p className="text-ink font-medium">{vi ? "Chỉ thị người dùng đã xác nhận" : "Human-confirmed research directive"}</p>
              <p className="mt-1">{guided.steering.focus} · A={guided.steering.targetA}</p>
              {guided.steering.note ? <p className="mt-1 whitespace-pre-wrap break-words"><MathText text={guided.steering.note} /></p> : null}
              <p className="mt-1 break-all">SHA-256: {guided.steeringDigest}</p>
            </div> : null}
          {mixedEvidence ? <details className="border-line text-meta text-ink-muted mt-3 min-w-0 rounded-md border p-3">
              <summary className="text-ink cursor-pointer font-medium">{vi ? "Chứng chỉ core hỗn hợp trước planner" : "Mixed-core evidence before planning"} · {mixedEvidence.method.slice(-2)} · {mixedEvidence.replay.status}{mixedEvidence.method !== "ERDOS_STRAUS_MIXED_CORE_AGENT_EVIDENCE_V1" ? ` / ${mixedEvidence.kernel.replay.status}` : ""}{mixedEvidence.method === "ERDOS_STRAUS_MIXED_CORE_AGENT_EVIDENCE_V3" ? ` / ${mixedEvidence.power.replay.status}` : ""}</summary>
              <p className="mt-2">{vi ? "Dữ liệu được lưu trong sổ sự kiện của đợt này, gắn với hợp đồng gốc và phát lại bằng Python độc lập. Không phải bản xem trước của workbench." : "Retained in this cycle's event ledger, bound to the root contract and independently Python-replayed. Not a workbench preview."}</p>
              <ul className="mt-2 space-y-1">{mixedEvidence.packet.certificates.map((c) => <li key={c.p}>
                p={c.p.toLocaleString(locale)} · {vi ? "core tối thiểu trong họ chuẩn hóa" : "minimum support in the normalized family"}: {c.minimumSupport ?? "?"}
                {` · ${c.singleCore.candidatesChecked} ${vi ? "ứng viên một-core đã kiểm" : "single-core candidates checked"}`}
              </li>)}</ul>
              <p className="mt-2"><MathText text={vi ? "Phản ví dụ occupancy: $m=1224$, $s=4895$; $105-12=93$ là cận trên, nhưng chỉ có 92 lớp tỷ số." : "Occupancy counterexample: $m=1224$, $s=4895$; $105-12=93$ is an upper bound, but there are only 92 ratio classes."} /></p>
              <p className="mt-2">{vi ? "Loại trừ một-core dùng kiểm tra hữu hạn và lập luận đuôi viết tay. Chưa kiểm chứng hình thức, tính mới hoặc giải bài toán gốc. Chốt typed chỉ nhận diện ID đã đăng ký, không phát hiện diễn đạt tương đương; nội dung khác vẫn cần phản biện." : "Single-core exclusion uses finite checks plus a written tail argument. No formal verification, novelty or root solution. The typed gate recognizes registered IDs, not semantic paraphrases; other prose still needs review."}</p>
              {mixedEvidence.method !== "ERDOS_STRAUS_MIXED_CORE_AGENT_EVIDENCE_V1" ? <section className="border-line mt-3 border-t pt-3" aria-label={vi ? "Kernel va chạm được lưu V2" : "Retained collision kernel V2"}>
                <p className="text-ink font-medium">{vi ? "Bổ sung kernel V2" : "V2 kernel supplement"} · {mixedEvidence.kernel.replay.status}</p>
                <ul className="mt-2 space-y-1">{mixedEvidence.kernel.packet.rows.filter((row) => row.sIsPrime && row.extraCollisions > 0).map((row) => <li key={row.m}>
                  <MathText text={`$m=${row.m}$, $s=${row.s}$ (${vi ? "nguyên tố" : "prime"}): $P-E=${row.knownRelationBound}$, $R=${row.residueCount}$; ${vi ? "cận dưới năng lượng" : "energy lower bound"} $R\\ge ${row.lowerBound}$.`} />
                </li>)}</ul>
                <p className="mt-2"><MathText text={vi ? "Họ $m=8d(8d+1)(16d+1)$, $d\\ge1$: $R\\le P-E-\\tau(d)$ có chứng minh viết tay. Phát lại chỉ kiểm 9 giá trị $d=1,\\ldots,9$ và 6 atlas cố định, không chứng nhận phép quét một triệu hàng hoặc định lý vô hạn." : "The family $m=8d(8d+1)(16d+1)$, $d\\ge1$, with $R\\le P-E-\\tau(d)$ has a written proof. Replay checks only 9 values $d=1,\\ldots,9$ and 6 fixed atlases, not the million-row scan or an infinite theorem."} /></p>
                <p className="mt-2">{vi ? `Cận năng lượng không đảm bảo đánh trúng lớp mục tiêu. Phạm vi packet ghi nguồn chẩn đoán; envelope ${mixedEvidence.method.slice(-2)} ghi việc sử dụng trong vòng agent, không nâng cấp kết luận toán học.` : `The energy bound does not guarantee hitting a target class. Packet scope records diagnostic origin; the ${mixedEvidence.method.slice(-2)} envelope records agent-cycle consumption without mathematical promotion.`}</p>
                <dl className="mt-2 space-y-1 break-all">
                  <div><dt className="inline">Kernel packet SHA-256: </dt><dd className="inline">{mixedEvidence.kernel.replay.primaryDigest}</dd></div>
                  <div><dt className="inline">Kernel Python SHA-256: </dt><dd className="inline">{mixedEvidence.kernel.replay.scriptDigest}</dd></div>
                  <div><dt className="inline">Kernel output SHA-256: </dt><dd className="inline">{mixedEvidence.kernel.replay.outputDigest ?? "n/a"}</dd></div>
                </dl>
              </section> : <p className="mt-2">{vi ? "Đợt V1 này không lưu chứng chỉ kernel mới hoặc phản ví dụ môđun nguyên tố của V2." : "This V1 cycle does not retain the newer kernel or V2 prime-modulus counterexamples."}</p>}
              {mixedEvidence.method === "ERDOS_STRAUS_MIXED_CORE_AGENT_EVIDENCE_V3"
                ? <MathMixedCorePowerPanel evidence={mixedEvidence.power} vi={vi} />
                : <p className="mt-2">{vi ? "Lịch sử V1/V2 này không lưu power-core V3; file G ngoài vòng không phải chứng cứ của đợt." : "This historical V1/V2 cycle has no retained V3 power-core evidence; standalone G files are not evidence for this cycle."}</p>}
              {mixedRefutations.map((event) => <p key={`${event.round}-${event.claim}`} className="text-danger-700 mt-2 break-words">{vi ? "Mệnh đề đã bị chặn trước solver" : "Claim blocked before solver"} · {event.claim} · {vi ? "vòng" : "round"} {event.round}</p>)}
              <dl className="mt-3 space-y-1 break-all">
                <div><dt className="inline">Root SHA-256: </dt><dd className="inline">{mixedEvidence.rootContractDigest}</dd></div>
                <div><dt className="inline">Evidence SHA-256: </dt><dd className="inline">{mixedEvidence.evidenceDigest}</dd></div>
                <div><dt className="inline">Python SHA-256: </dt><dd className="inline">{mixedEvidence.replay.scriptDigest}</dd></div>
                <div><dt className="inline">Output SHA-256: </dt><dd className="inline">{mixedEvidence.replay.outputDigest ?? "n/a"}</dd></div>
              </dl>
            </details> : <p className="text-meta text-ink-muted mt-3">{vi ? "Đợt này chưa lưu chứng chỉ core hỗn hợp. Không bổ sung chứng cứ mới vào lịch sử cũ; đợt Erdős–Straus mới sẽ phát lại trước planner." : "No mixed-core evidence retained for this cycle. Historical records are not retroactively rewritten; a new Erdős–Straus cycle replays it before planning."}</p>}
          {seededReplay?.phase === "PRIOR_COUNTEREXAMPLE_REPLAY" ? <details className="border-line text-meta text-ink-muted mt-3 rounded-md border p-3">
              <summary className="text-ink cursor-pointer font-medium">{vi ? "Chứng chỉ phản ví dụ trước planner" : "Counterexample replay before planning"} · {seededReplay.report.status} · p={seededReplay.candidate.prime.toLocaleString(locale)} · A≤{seededReplay.candidate.failedThroughA}</summary>
              <p className="mt-2">{vi ? "Kiểm bằng hai chương trình riêng trước cuộc gọi AI đầu tiên." : "Checked by two separate programs before the first AI call."}</p>
              <p className="mt-1">{vi ? "x₃ là số chính phương" : "x₃ is square"}: {String(seededReplay.report.a3Square)} ·
                {` ${vi ? "x₃ không có thừa số nguyên tố 2 mod 3" : "x₃ has no prime factor 2 mod 3"}: ${String(seededReplay.report.a3NoPrime2Mod3)}`} ·
                {` ${vi ? "x₇ không có ước 5 mod 7" : "x₇ has no divisor 5 mod 7"}: ${String(seededReplay.report.a7NoDivisor5Mod7)}`}</p>
              <ul className="mt-2 grid gap-1 sm:grid-cols-2">{seededReplay.report.rows.map((row) => <li key={row.a}>
                A={row.a} · x={row.x.toLocaleString(locale)} · {row.factorPairsChecked} {label.factorPairs} · {row.admissiblePairs} {label.admissiblePairs}
              </li>)}</ul>
              {seededReplay.report.mismatches.map((mismatch) => <p key={mismatch} role="alert" className="text-danger-700 mt-1">{mismatch}</p>)}
              <p className="mt-2">{vi ? "Chỉ là ràng buộc hữu hạn cho giả thuyết mới, không chứng minh bài toán gốc." :
                "A finite constraint for a new hypothesis, not a proof of the root problem."}</p>
              <p className="mt-1 break-all">Python SHA-256: {seededReplay.report.pythonScriptDigest ?? "n/a"} · Output SHA-256: {seededReplay.report.pythonOutputDigest ?? "n/a"} · Report SHA-256: {seededReplay.report.reportDigest}</p>
            </details> : null}
          {gateDossier?.phase === "PRIOR_GATE_DOSSIER" ? <details className="border-line text-meta text-ink-muted mt-3 rounded-md border p-3">
              <summary className="text-ink cursor-pointer font-medium">{vi ? "Hồ sơ đầy đủ các cửa A" : "Full A-gate dossier"} · p={gateDossier.dossier.candidate.prime.toLocaleString(locale)} · A={gateDossier.dossier.targetA}</summary>
              <p className="mt-2">{vi ? "Mỗi cửa trước mục tiêu được loại trừ bằng phép tính và phát lại độc lập; cửa mục tiêu có nghiệm chính xác. Đây chỉ là chứng cứ hữu hạn." :
                "Every earlier gate was excluded by computation and independent replay; the target has an exact witness. This is finite evidence only."}</p>
              <ul className="mt-2 grid gap-1 sm:grid-cols-2">{gateDossier.dossier.rows.map((row) => <li key={row.a}>
                A={row.a} · x={row.x.toLocaleString(locale)} · {row.xFactors.map((factor) => `${factor.prime}${factor.exponent > 1 ? `^${factor.exponent}` : ""}`).join("×")} · {row.factorPairsChecked} {label.factorPairs}
              </li>)}</ul>
              <p className="mt-2 break-all">A={gateDossier.dossier.firstSuccessA}: (x,y,z)=({gateDossier.dossier.witness.x}, {gateDossier.dossier.witness.y}, {gateDossier.dossier.witness.z})</p>
              <p className="mt-1 break-all">SHA-256: {gateDossier.dossier.dossierDigest}</p>
            </details> : null}
          {visibleFindings.length ? <div className="border-line text-meta text-ink-muted mt-3 rounded-md border p-3">
              <p className="text-ink font-medium">{vi ? "Chứng cứ hữu hạn đã phát lại từ đợt trước" : "Independently replayed prior finite evidence"}</p>
              <ul className="mt-1 space-y-1">{visibleFindings.map((finding) =>
                <li key={finding.sourceCycleId}>
                  p={finding.prime.toLocaleString(locale)} · A≤{finding.failedThroughA}: {vi ? "không có nghiệm trong họ này" : "no witness in this family"}
                  {finding.firstSuccessA ? ` · ${vi ? "nghiệm ở" : "witness at"} A=${finding.firstSuccessA}` : ""}
                  {finding.structuralFacts && finding.structuralFacts.a3Square !== null &&
                    finding.structuralFacts.a3NoPrime2Mod3 !== null &&
                    finding.structuralFacts.a7NoDivisor5Mod7 !== null ? <span className="block">
                    {vi ? "Tiền đề định kiểu" : "Typed premise facts"}: x₃ {finding.structuralFacts.a3Square ? (vi ? "là số chính phương" : "is square") : (vi ? "không là số chính phương" : "is not square")};
                    {" "}A=3 {finding.structuralFacts.a3NoPrime2Mod3 ? (vi ? "không có ước nguyên tố 2 mod 3" : "has no prime factor 2 mod 3") : (vi ? "có ước nguyên tố 2 mod 3" : "has a prime factor 2 mod 3")};
                    {" "}A=7 {finding.structuralFacts.a7NoDivisor5Mod7 ? (vi ? "không có ước 5 mod 7" : "has no divisor 5 mod 7") : (vi ? "có ước 5 mod 7" : "has a divisor 5 mod 7")}.
                  </span> : null}
                  <span className="block break-all">SHA-256: {finding.replayDigest}</span>
                </li>)}</ul>
              <p className="mt-2">{vi ? "Đây là ràng buộc phản ví dụ cho mệnh đề mới, không phải chứng minh phổ quát." :
                "These are counterexample constraints for new claims, not a universal proof."}</p>
            </div> : null}
          {cycle.trace === null ? <p className="text-meta text-danger-700 mt-3" role="alert">{label.integrity}</p> :
            rounds.length ? <ol className="mt-4 space-y-4">
              {rounds.map((round) => {
                const events = cycle.trace!.filter((event) => event.round === round);
                const proposed = events.find((event) => event.phase === "PROPOSED");
                const structuralProbe = events.find((event) => event.phase === "STRUCTURAL_PROBED");
                const frontier = events.find((event) => event.phase === "FRONTIER_DOSSIER");
                const frontierDecision = events.find((event) => event.phase === "FRONTIER_GATE");
                const sourceReviews = events.filter((event) => event.phase === "FRONTIER_REVIEWED");
                const verified = events.find((event) => event.phase === "VERIFIED");
                const computed = events.find((event) => event.phase === "COMPUTED");
                const replay = events.find((event) => event.phase === "INDEPENDENT_REPLAY");
                const attempted = events.find((event) => event.phase === "ATTEMPTED");
                const certificateChecked = events.find((event) => event.phase === "CERTIFICATE_CHECKED");
                const parametricChecked = events.find((event) => event.phase === "PARAMETRIC_CHECKED");
                const structuralReplay = events.find((event) => event.phase === "COUNTEREXAMPLE_REPLAY");
                const reviewed = events.filter((event) => event.phase === "REVIEWED");
                const roundObligations = obligations.filter((obligation) => obligation.round === round);
                const known = proposed?.phase === "PROPOSED" && rootContract
                  ? knownScopeForTask(rootContract, `${proposed.proposal.hypothesis}\n${proposed.proposal.taskStatement}`)
                    ?? knownScopeForTask(rootContract, proposed.proposal.taskStatement)
                    ?? knownScopeForTask(rootContract, proposed.proposal.hypothesis)
                  : null;
                return <li key={round} className="border-line min-w-0 border-l-2 pl-4">
                  <h6 className="text-meta text-ink font-semibold">{label.round} {round}</h6>
                  {proposed?.phase === "PROPOSED" ? <div className="text-meta text-ink-muted mt-2 space-y-2">
                    <p><span className="text-ink font-medium">{label.sourceGap}:</span> <MathText text={proposed.proposal.sourceGap} /></p>
                    <p><span className="text-ink font-medium">{label.hypothesis}:</span> <MathText text={proposed.proposal.hypothesis} /></p>
                    <p><span className="text-ink font-medium">{label.task}:</span> <MathText text={proposed.proposal.taskStatement} /></p>
                  </div> : <p className="text-meta text-ink-muted mt-2">{label.pending}</p>}
                  {roundObligations.length ? <details className="border-line mt-3 border-y py-3">
                    <summary className="text-meta text-ink cursor-pointer font-medium">
                      {vi ? "Bản đồ nghĩa vụ nghiên cứu" : "Research-obligation map"} · {roundObligations.length}
                    </summary>
                    <p className="text-meta text-ink-muted mt-2">{vi
                      ? "Trạng thái lấy từ nhật ký đã kiểm tra; AI phản biện và phép tính hữu hạn không đồng nghĩa chứng minh định lý."
                      : "States come from the validated ledger; AI review and finite computation are not theorem proofs."}</p>
                    <ol className="mt-3 space-y-2">{roundObligations.map((obligation) => <li key={obligation.id}
                      className={`text-meta min-w-0 ${obligation.parentId ? "border-line ml-3 border-l pl-3" : ""}`}>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                        <span className="text-ink font-medium">{obligationNames[obligation.kind]}</span>
                        <span className="text-ink-muted">{obligationStates[obligation.state]}</span>
                      </div>
                      <p className="text-ink-muted mt-1"><MathText text={obligation.statement} /></p>
                    </li>)}</ol>
                  </details> : null}
                  {structuralProbe?.phase === "STRUCTURAL_PROBED" ? <section className="border-line text-meta mt-3 border-t pt-3">
                    <h6 className="text-ink font-semibold">{vi ? "Dò phản ví dụ trước nghiệm thu task" : "Pre-acceptance counterexample probe"}</h6>
                    <p className={structuralProbe.report.status === "REFUTED" ? "text-danger-700 mt-1" : "text-ink-muted mt-1"}>
                      {structuralProbe.report.status === "REFUTED"
                        ? vi ? `Mệnh đề định kiểu bị bác bỏ bởi p=${structuralProbe.report.candidate?.prime}; các cửa A≤${structuralProbe.report.plan.targetA} đã phát lại độc lập.`
                          : `Typed implication refuted by p=${structuralProbe.report.candidate?.prime}; gates through A=${structuralProbe.report.plan.targetA} independently replayed.`
                        : vi ? `Chưa thấy phản ví dụ trong ${structuralProbe.report.eligiblePrimesTested.toLocaleString(locale)} số nguyên tố p≡1 (mod 840), p≤${structuralProbe.report.plan.upperInclusive.toLocaleString(locale)}. Đây không phải chứng minh.`
                          : `No counterexample among ${structuralProbe.report.eligiblePrimesTested.toLocaleString(locale)} primes p≡1 (mod 840), p≤${structuralProbe.report.plan.upperInclusive.toLocaleString(locale)}. This is not a proof.`}
                    </p>
                    {structuralProbe.report.candidate?.divisorWitnesses.length ? <p className="text-ink-muted mt-1">
                      {vi ? "Ước chia kiểm được" : "Checked divisor witnesses"}: {structuralProbe.report.candidate.divisorWitnesses.join(", ")}
                    </p> : null}
                    <p className="text-ink-muted mt-1 break-all">SHA-256: {structuralProbe.report.reportDigest}</p>
                  </section> : null}
                  {known ? <p role="alert" className="text-meta text-danger-700 mt-2">
                    {label.priorArtWarning} <a className="underline underline-offset-2" href={known.sourceUrl} target="_blank" rel="noreferrer">{known.sourceTitle}</a>
                  </p> : null}
                  {known && frontier?.phase === "FRONTIER_DOSSIER" &&
                    !frontier.dossier.sources.some((source) => source.id === known.id)
                    ? <p className="text-meta text-ink-muted mt-1">{label.retrospective}</p> : null}
                  {frontier?.phase === "FRONTIER_DOSSIER" ? <details className="text-meta text-ink-muted mt-3">
                    <summary className="text-ink cursor-pointer font-medium">{label.frontier} · {frontier.dossier.sources.length} {label.captured.toLowerCase()}</summary>
                    <p className="mt-2">{label.discovery}: {frontier.dossier.discovery.status} · Crossref · {frontier.dossier.discovery.candidates.length}</p>
                    <p className="mt-1">{label.frontierCoverage}</p>
                    <ul className="mt-2 space-y-2">{frontier.dossier.sources.map((source) => <li key={source.id} className="break-words">
                      <a className="text-ink underline underline-offset-2" href={source.canonicalUri} target="_blank" rel="noreferrer">{source.title}</a>
                      {` · ${source.authors} (${source.publicationYear}) · ${source.scope}`}
                      <p className="mt-1">{label.captured}: “{source.exactQuote}”</p>
                      <p className="break-all">SHA-256: {source.contentDigest}</p>
                    </li>)}</ul>
                    <p className="mt-2 break-all">Dossier SHA-256: {frontier.dossier.dossierDigest}</p>
                  </details> : proposed?.phase === "PROPOSED" && !frontierDecision ?
                    <p className="text-meta text-ink-muted mt-2">{label.frontierMissing}</p> : null}
                  {sourceReviews.map((event) => event.phase === "FRONTIER_REVIEWED" ? <p key={event.role} className="text-meta text-ink-muted mt-2">
                    <span className="text-ink font-medium">{label.sourceAssessment} · {event.role}:</span> {event.assessment.relevance} · {event.assessment.quantifiers} · {event.assessment.overlap} · {event.assessment.explanation}
                  </p> : null)}
                  {frontierDecision?.phase === "FRONTIER_GATE" ? <p role={frontierDecision.decision === "RESEARCH_ONLY" ? undefined : "alert"}
                    className={`text-meta mt-2 font-medium ${frontierDecision.decision === "RESEARCH_ONLY" ? "text-ink" : "text-danger-700"}`}>
                    {label.frontierGate}: {frontierDecision.decision} · {frontierDecision.reason}
                  </p> : null}
                  {verified?.phase === "VERIFIED" ? <details className="text-meta text-ink-muted mt-2">
                    <summary className="text-ink cursor-pointer font-medium">{label.verification} · {verified.accepted ? "ACCEPT" : "REJECT"}</summary>
                    <dl className="mt-2 grid gap-2">
                      <div><dt className="text-ink font-medium">{label.scope}</dt><dd>{verified.verification.scopeCheck}</dd></div>
                      <div><dt className="text-ink font-medium">{label.novelty}</dt><dd>{verified.verification.noveltyCheck}</dd></div>
                      <div><dt className="text-ink font-medium">{label.falsifiability}</dt><dd>{verified.verification.falsifiabilityCheck}</dd></div>
                    </dl>
                    <p className="mt-2">{verified.reason} · {verified.verification.unresolvedRisk}</p>
                  </details> : null}
                  {computed?.phase === "COMPUTED" ? <section aria-label={label.computation} className="border-line text-meta mt-3 border-t pt-3">
                    <h6 className="text-ink font-semibold">{label.computation}</h6>
                    <p className="text-ink mt-1 font-medium">
                      {computed.evidence.primeCount.toLocaleString(locale)} {label.testedPrimes} · {computed.evidence.failureCount.toLocaleString(locale)} {label.outsideBound} A≤{computed.evidence.plan.maxA}
                    </p>
                    <p className="text-ink-muted mt-1 break-words">p ≡ 1 (mod 840), {computed.evidence.plan.lowerExclusive.toLocaleString(locale)} &lt; p ≤ {computed.evidence.plan.upperInclusive.toLocaleString(locale)}; x=(p+A)/4.</p>
                    <p className="text-ink-muted mt-1">{label.finiteOnly}</p>
                    <details className="text-ink-muted mt-2">
                      <summary className="text-ink cursor-pointer font-medium">{label.computationDetails}</summary>
                      {computed.evidence.firstFailure ? <p className="mt-2 break-words">p={computed.evidence.firstFailure.n}: {vi ? "không có nghiệm trong giới hạn A" : "no witness within the A-bound"}.{computed.evidence.firstFailureRescue?.witness ? ` A=${computed.evidence.firstFailureRescue.firstA}: (${computed.evidence.firstFailureRescue.witness.x}, ${computed.evidence.firstFailureRescue.witness.y}, ${computed.evidence.firstFailureRescue.witness.z})` : ""}</p> : null}
                      <p className="mt-1 break-all">SHA-256: {computed.evidence.manifestDigest}</p>
                      {computed.evidence.firstFailureAudit ? <div className="border-line mt-3 border-t pt-3">
                        <p className="text-ink font-medium">{label.exclusionAudit} · p={computed.evidence.firstFailureAudit.n}</p>
                        <p className="mt-1">{label.primeTrial} ⌊√p⌋={computed.evidence.firstFailureAudit.primeTrialLimit}. {label.auditScope}</p>
                        <ul className="mt-2 grid gap-1 sm:grid-cols-2">
                          {computed.evidence.firstFailureAudit.rows.map((row) => <li key={row.a} className="break-words">
                            A={row.a} · x={row.x.toLocaleString(locale)}={row.xFactors.map((factor) => `${factor.prime}${factor.exponent > 1 ? `^${factor.exponent}` : ""}`).join("×")} · {row.factorPairsChecked} {label.factorPairs} · {row.admissiblePairs} {label.admissiblePairs}
                          </li>)}
                        </ul>
                        <p className="mt-2 break-all">Audit SHA-256: {computed.evidence.firstFailureAudit.auditDigest}</p>
                      </div> : null}
                    </details>
                  </section> : null}
                  {replay?.phase === "INDEPENDENT_REPLAY" ? <details className="text-meta text-ink-muted mt-2">
                    <summary className="text-ink cursor-pointer font-medium">{label.independentReplay} · {replay.report.status}</summary>
                    <p className="mt-2">{replay.report.primeCount.toLocaleString(locale)} {label.testedPrimes} · {replay.report.failureCount.toLocaleString(locale)} {label.outsideBound} A≤{computed?.phase === "COMPUTED" ? computed.evidence.plan.maxA : "?"} · {replay.report.auditedRows.length} A {label.factorPairs}</p>
                    <p className="mt-1">{label.replayLimit}</p>
                    {replay.report.mismatches.map((mismatch) => <p key={mismatch} role="alert" className="text-danger-700 mt-1">{mismatch}</p>)}
                    <p className="mt-2 break-all">Python SHA-256: {replay.report.intervalScriptDigest} · {replay.report.exclusionScriptDigest ?? "n/a"}</p>
                    <p className="mt-1 break-all">Replay SHA-256: {replay.report.reportDigest}</p>
                  </details> : computed?.phase === "COMPUTED" && attempted?.phase === "ATTEMPTED" ? <p className="text-meta text-ink-muted mt-2">{label.replayMissing}</p> : null}
                  {computed?.phase === "COMPUTED" && replay?.phase === "INDEPENDENT_REPLAY" &&
                    computed.evidence.firstFailure && validateIndependentReplayReport(computed.evidence, replay.report)
                    ? <p role="status" className="border-line bg-surface text-meta text-ink mt-3 rounded-md border px-3 py-2">
                      {vi ? "Cột mốc hữu hạn đã phát lại độc lập" : "Independently replayed finite milestone"}:
                      {` p=${computed.evidence.firstFailure.n}`} {vi ? "không có nghiệm trong họ mẫu số đầu" : "has no solution in the first-denominator family"} A≤{computed.evidence.plan.maxA}.
                      {computed.evidence.firstFailureRescue?.firstA ? ` ${vi ? "Có nghiệm ngoài giới hạn tại" : "A witness exists outside that bound at"} A=${computed.evidence.firstFailureRescue.firstA}.` : ""}
                      {` ${label.finiteOnly}`}
                    </p> : null}
                  {computed?.phase === "COMPUTED" && computed.evidence.firstFailure ? <p className="text-meta text-ink-muted mt-3">
                    {vi ? "Không tính thêm phân tích thừa số khi mở hồ sơ. Chẩn đoán hai cửa ngoài sổ sự kiện không phải chứng cứ được lưu của đợt này." : "Opening this dossier does not compute additional factorization. A two-gate diagnostic outside the event ledger is not retained evidence for this campaign."}
                  </p> : null}
                  {attempted?.phase === "ATTEMPTED" ? <details className="text-meta text-ink-muted mt-2">
                    <summary className="text-ink cursor-pointer font-medium">{label.attempt} · {attempted.attempt.attemptType}</summary>
                    <p className="math-proof-body mt-2 whitespace-pre-wrap break-words"><MathText text={attempted.attempt.argument} /></p>
                    <details className="mt-2">
                      <summary className="text-ink cursor-pointer font-medium">{vi ? "Xem nguyên văn đã niêm phong" : "View sealed source text"}</summary>
                      <p className="mt-2 whitespace-pre-wrap break-words">{attempted.attempt.argument}</p>
                    </details>
                    {rootContract && hasErdosStrausEquation(rootContract) && attempted.attempt.erdosStrausWitnesses?.length ? <ul className="mt-2 space-y-1">
                      {attempted.attempt.erdosStrausWitnesses.map((witness, index) => {
                        const certificate = verifyErdosStrausWitness(witness);
                        return <li key={index} className="break-all">{label.exactWitness}: {certificate.classification} · ({witness.n}, {witness.x}, {witness.y}, {witness.z}) · {certificate.reason}</li>;
                      })}
                    </ul> : null}
                    {attempted.attempt.limitations.length ? <p className="mt-2 whitespace-pre-wrap"><MathText text={attempted.attempt.limitations.join(" · ")} /></p> : null}
                  </details> : null}
                  {certificateChecked?.phase === "CERTIFICATE_CHECKED" ? <p className="text-meta text-ink-muted mt-2">
                    {label.exactWitness}: {certificateChecked.checks.length ? certificateChecked.checks.map((check) => `${check.witness.n}: ${check.valid ? "EXACT_IDENTITY" : "INVALID"}`).join(" · ") : label.noWitness}
                  </p> : null}
                  {structuralReplay?.phase === "COUNTEREXAMPLE_REPLAY" ? <details className="border-line text-meta text-ink-muted mt-3 rounded-md border p-3">
                    <summary className="text-ink cursor-pointer font-medium">
                      {vi ? "Phát lại phản ví dụ cấu trúc" : "Structural counterexample replay"} · {structuralReplay.report.status} · p={structuralReplay.candidate.prime}
                    </summary>
                    <p className="mt-2">A≤{structuralReplay.candidate.failedThroughA} · {structuralReplay.report.rows.length} {vi ? "cửa được kiểm" : "gates checked"} · TypeScript + Python.</p>
                    <p className="mt-1">{vi ? "u=(p+3)/4 là số chính phương" : "u=(p+3)/4 is a square"}: {String(structuralReplay.report.a3Square)} ·
                      {` ${vi ? "u không có thừa số nguyên tố 2 mod 3" : "u has no prime factor 2 mod 3"}: ${String(structuralReplay.report.a3NoPrime2Mod3)}`} ·
                      {` ${vi ? "v không có ước 5 mod 7" : "v has no divisor 5 mod 7"}: ${String(structuralReplay.report.a7NoDivisor5Mod7)}`}</p>
                    <ul className="mt-2 grid gap-1 sm:grid-cols-2">{structuralReplay.report.rows.map((row) => <li key={row.a}>
                      A={row.a} · x={row.x.toLocaleString(locale)} · {row.factorPairsChecked} {label.factorPairs} · {row.admissiblePairs} {label.admissiblePairs}
                    </li>)}</ul>
                    {structuralReplay.report.mismatches.map((mismatch) => <p key={mismatch} role="alert" className="text-danger-700 mt-1">{mismatch}</p>)}
                    <p className="mt-2">{vi ? "Chỉ chứng nhận loại trừ hữu hạn trong họ x=(p+A)/4; các tiền đề văn bản và mệnh đề tổng quát cần phản biện riêng." :
                      "Certifies only finite exclusions in x=(p+A)/4; textual premises and general claims need separate review."}</p>
                    <p className="mt-1 break-all">Python SHA-256: {structuralReplay.report.pythonScriptDigest ?? "n/a"} · Replay SHA-256: {structuralReplay.report.reportDigest}</p>
                  </details> : null}
                  {parametricChecked?.phase === "PARAMETRIC_CHECKED" ? <details className="text-meta text-ink-muted mt-2">
                    <summary className="text-ink cursor-pointer font-medium">{vi ? "Chứng chỉ đồng nhất thức tham số" : "Parametric identity certificate"} · {parametricChecked.checks.filter((check) => check.certificate.valid).length}/{parametricChecked.checks.length}</summary>
                    {parametricChecked.checks.map((check, index) => <div key={index} className="mt-2 break-words">
                      <p className={check.certificate.valid ? "text-ink" : "text-danger-700"}>{check.certificate.classification} · n(t)={check.family.n[0]}+{check.family.n[1]}t</p>
                      {check.certificate.firstDenominatorOffset ? <p>A=4x(t)−n(t)={check.certificate.firstDenominatorOffset}</p> : null}
                      <p>{check.certificate.reason}</p>
                      {check.certificate.identityDigest ? <p className="break-all">SHA-256: {check.certificate.identityDigest}</p> : null}
                    </div>)}
                    <p className="mt-2">{vi ? "Chỉ chứng minh đồng nhất thức trên cấp số được ghi. Giới hạn A/mẫu số đầu của bài toán gốc, toàn bộ lớp còn sót lại và tính mới cần kiểm riêng." : "Only the identity on this progression is checked. Root-specific A/first-denominator bounds, the full residual class and novelty need separate checks."}</p>
                  </details> : null}
                  {reviewed.map((event) => event.phase === "REVIEWED" ? <p key={event.role} className="text-meta text-ink-muted mt-2 whitespace-pre-wrap break-words">
                    <span className="text-ink font-medium">{label.review} · {event.role} · {event.report.verdict}:</span>
                    {event.reviewerModel ? ` ${vi ? "Mô hình yêu cầu" : "Requested model"}: ${event.reviewerModel.requestedModelName} (${vi ? "theo cấu hình CLI" : "CLI setting only"}). ` : " "}
                    <MathText text={event.report.reasoning} />
                    {event.report.unresolvedGap ? <> · <MathText text={event.report.unresolvedGap} /></> : ""}
                  </p> : null)}
                </li>;
              })}
            </ol> : <p className="text-meta text-ink-muted mt-3">{label.pending}</p>}
          {cycle.stopReason ? <p className="text-meta text-ink mt-4 font-medium">{label.stopped}: {cycle.stopReason}</p> : null}
          {cycle.stopReason === "COUNTEREXAMPLE_REJECTED" ? <p role="alert" className="text-meta text-danger-700 mt-1">
            {vi ? "Ứng viên phản ví dụ thiếu chứng chỉ định kiểu, lệch cửa A được duyệt, hoặc không qua kiểm toán số học. Không chuyển sang phản biện AI." :
              "The counterexample candidate lacked typed evidence, missed the approved A gate, or failed exact arithmetic replay. AI peer review was not dispatched."}
          </p> : null}
          {cycle.stopReason === "STRUCTURAL_REFUTED" ? <p role="alert" className="text-meta text-danger-700 mt-1">
            {vi ? "Giả thuyết định kiểu bị phản ví dụ số học bác bỏ trước lượt task verifier/solver; không suy diễn điều này thành lời giải bài toán gốc." :
              "An exact counterexample refuted the typed hypothesis before task verification or solving; this does not settle the root problem."}
          </p> : null}
          {cycle.stopReason === "STRUCTURAL_PROBE_HOLD" ? <p role="alert" className="text-meta text-danger-700 mt-1">
            {vi ? "Đề xuất cấu trúc thiếu phép dò định kiểu hoặc lệch cửa A được duyệt; vòng dừng trước phản biện và solver." :
              "The structural proposal lacks a supported typed probe or misses the approved A gate; review and solver were not dispatched."}
          </p> : null}
          {cycle.events.length ? <p className="text-meta text-ink-muted mt-2 break-all">{label.ledger}: {cycle.events.at(-1)?.digest}</p> : null}
          {cycle.status === "STOPPED" && canRequest && gaps.length && rootContract && hasErdosStrausEquation(rootContract)
            ? <MathCycleSteeringForm slug={slug} caseId={caseId} missionId={missionId} locale={locale} repeat /> : null}
        </>
      )}
      {history.length ? <details className="border-line text-meta text-ink-muted mt-4 rounded-md border p-3">
        <summary className="text-ink cursor-pointer font-medium">{vi ? "Các đợt gần đây đã niêm phong" : "Recent sealed campaigns"} ({history.length})</summary>
        <ol className="mt-3 space-y-3">{history.map((previous) => {
          const directive = previous.trace?.find((event) => event.phase === "HUMAN_STEERED");
          const proposal = previous.trace?.find((event) => event.phase === "PROPOSED");
          const frontier = previous.trace?.find((event) => event.phase === "FRONTIER_GATE");
          const review = previous.trace?.find((event) => event.phase === "ROUND_CLOSED");
          return <li key={previous.id} className="border-line border-t pt-3 first:border-t-0 first:pt-0">
            <p className="text-ink font-medium">{previous.createdAt.toLocaleString(locale)} · {previous.status}{previous.stopReason ? ` · ${previous.stopReason}` : ""}</p>
            {previous.trace === null ? <p role="alert" className="text-danger-700 mt-1">{label.integrity}</p> : <>
              {directive?.phase === "HUMAN_STEERED" ? <p className="mt-1">{directive.steering.focus} · A={directive.steering.targetA}</p> : null}
              {proposal?.phase === "PROPOSED" ? <p className="mt-1 whitespace-pre-wrap break-words"><MathText text={proposal.proposal.taskStatement} /></p> : null}
              {frontier?.phase === "FRONTIER_GATE" ? <p className="mt-1">{label.frontierGate}: {frontier.decision} · {frontier.reason}</p> : null}
              {review?.phase === "ROUND_CLOSED" ? <p className="mt-1">{label.review}: {review.conclusion}{review.nextGap ? <> · <MathText text={review.nextGap} /></> : ""}</p> : null}
            </>}
            <p className="mt-1 break-all">SHA-256: {previous.events.at(-1)?.digest ?? "—"}</p>
          </li>;
        })}</ol>
      </details> : null}
      <p className="text-meta text-ink-muted border-line mt-4 border-t pt-3">{label.caution}</p>
    </section>
  );
}

function MathPortfolioLaunchForm({ slug, caseId, missionId, locale }: {
  slug: string; caseId: string; missionId: string; locale: "vi" | "en";
}) {
  const vi = locale === "vi";
  return <form action={requestMathResearchCycleAction} className="border-line mt-4 flex flex-wrap items-end gap-3 border-t pt-4">
    <input type="hidden" name="slug" value={slug} />
    <input type="hidden" name="caseId" value={caseId} />
    <input type="hidden" name="missionId" value={missionId} />
    <p className="text-meta text-ink w-full font-semibold">{vi ? "Portfolio nghiên cứu tự trị" : "Autonomous research portfolio"}</p>
    <p className="text-meta text-ink-muted w-full">{vi
      ? "AI lập tối đa 3 hướng từ khoảng trống phản biện; bộ điều phối chọn tối đa 2 vòng và ghi rõ nhánh chưa chạy. Giới hạn được kiểm trước từng lượt gọi, không cắt ngang lượt đang chạy."
      : "AI plans up to 3 lines from review gaps; the scheduler selects at most 2 rounds and records unrun lines. Limits are checked before each call, not mid-call."}</p>
    <label className="text-meta text-ink min-w-36 flex-1 font-medium">{vi ? "Số vòng tối đa" : "Maximum rounds"}
      <select name="maxRounds" defaultValue="2" className={inputClass}>
        <option value="1">1</option><option value="2">2</option>
      </select>
    </label>
    <label className="text-meta text-ink min-w-40 flex-1 font-medium">{vi ? "Ngưỡng token quan sát" : "Observed token threshold"}
      <select name="maxObservedTokens" defaultValue="60000" className={inputClass}>
        <option value="20000">20,000</option><option value="60000">60,000</option><option value="120000">120,000</option><option value="200000">200,000</option>
      </select>
    </label>
    <Button type="submit" className="self-end">{vi ? "Khởi động portfolio" : "Start portfolio"}</Button>
    <p className="text-meta text-ink-muted w-full">{vi
      ? "Codex local dùng phiên đăng nhập ChatGPT, không gọi API trả phí. Kết quả AI không tự xác nhận định lý hoặc tính mới."
      : "Local Codex uses the ChatGPT login, not a paid API. AI output does not certify a theorem or novelty."}</p>
  </form>;
}

function MathCycleSteeringForm({ slug, caseId, missionId, locale, repeat = false }: {
  slug: string; caseId: string; missionId: string; locale: "vi" | "en"; repeat?: boolean;
}) {
  const vi = locale === "vi";
  return <form action={requestMathResearchCycleAction} className="border-line mt-4 grid gap-3 border-t pt-4 sm:grid-cols-2">
    <input type="hidden" name="slug" value={slug} />
    <input type="hidden" name="caseId" value={caseId} />
    <input type="hidden" name="missionId" value={missionId} />
    <input type="hidden" name="maxRounds" value="1" />
    <div className="sm:col-span-2">
      <p className="text-ink text-meta font-semibold">{repeat
        ? (vi ? "Điều chỉnh hướng và khởi động đợt kế tiếp" : "Adjust direction and start the next campaign")
        : (vi ? "Xác nhận hướng nghiên cứu tự trị" : "Confirm autonomous research direction")}</p>
      <p className="text-ink-muted text-meta mt-1">{vi
        ? "Mỗi đợt chạy một vòng có giới hạn. AI tự đề xuất và phản biện; bạn xem kết quả rồi điều chỉnh trước đợt sau. Không tự công bố định lý."
        : "Each campaign runs one bounded round. AI proposes and challenges; you review and adjust before the next campaign. No theorem is published automatically."}</p>
    </div>
    <label className="text-meta text-ink font-medium">{vi ? "Phương pháp ưu tiên" : "Research priority"}
      <select name="steeringFocus" defaultValue="STRUCTURAL_LEMMA" className={inputClass}>
        <option value="STRUCTURAL_LEMMA">{vi ? "Mệnh đề cấu trúc tổng quát" : "General structural lemma"}</option>
        <option value="FINITE_FALSIFICATION">{vi ? "Tìm phản ví dụ hữu hạn" : "Bounded falsification"}</option>
      </select>
    </label>
    <label className="text-meta text-ink font-medium">{vi ? "Cửa A cần khảo sát" : "Target A gate"}
      <select name="targetA" defaultValue="11" className={inputClass}>
        {[11, 15, 19, 23, 27, 31, 35, 39, 43, 47].map((a) => <option key={a} value={a}>A={a}</option>)}
      </select>
    </label>
    <label className="text-meta text-ink font-medium">{vi ? "Ngưỡng token quan sát" : "Observed token threshold"}
      <select name="maxObservedTokens" defaultValue="120000" className={inputClass}>
        <option value="60000">60,000</option><option value="120000">120,000</option><option value="200000">200,000</option>
      </select>
    </label>
    <div className="sm:col-span-2">
      <p className="text-meta text-ink font-medium">{vi ? "Phát lại phản ví dụ đã biết trước khi AI lập giả thuyết (tuỳ chọn)" :
        "Replay a known counterexample before AI plans (optional)"}</p>
      <p className="text-meta text-ink-muted mt-1">{vi ? "Nhập cả số nguyên tố p và cửa A cuối thất bại; công cụ sẽ tự kiểm, không tin mô tả văn bản." :
        "Enter both prime p and last failed A; the fixed tool verifies them rather than trusting prose."}</p>
    </div>
    <label className="text-meta text-ink font-medium">{vi ? "Số nguyên tố p" : "Prime p"}
      <input name="replayPrime" type="number" min="841" max="200000000" step="1" className={inputClass} />
    </label>
    <label className="text-meta text-ink font-medium">{vi ? "Thất bại đến A" : "Failed through A"}
      <select name="replayFailedThroughA" defaultValue="" className={inputClass}>
        <option value="">{vi ? "Không phát lại" : "No replay"}</option>
        {[3, 7, 11, 15, 19, 23, 27, 31, 35, 39, 43].map((a) => <option key={a} value={a}>A={a}</option>)}
      </select>
    </label>
    <label className="text-meta text-ink font-medium sm:col-span-2">{vi ? "Điều chỉnh của bạn (tuỳ chọn, tối đa 500 ký tự)" : "Your adjustment (optional, 500 characters max)"}
      <textarea name="steeringNote" rows={2} maxLength={500} className={inputClass} placeholder={vi
        ? "Ví dụ: ưu tiên chứng minh điều kiện đủ, không suy luận từ mẫu hữu hạn"
        : "For example: prioritize a sufficient condition, not extrapolation from finite samples"} />
    </label>
    <label className="text-meta text-ink flex items-start gap-2 font-medium sm:col-span-2">
      <input type="checkbox" name="confirmSteering" required className="mt-1 size-4" />
      <span>{vi ? "Tôi xác nhận hướng và giới hạn này; AI chỉ được tạo kết quả nghiên cứu có kiểm chứng, không tự chứng nhận định lý." :
        "I confirm this direction and these limits; AI may produce checked research evidence but cannot certify a theorem."}</span>
    </label>
    <p className="text-meta text-ink-muted sm:col-span-2">{vi
      ? "Ghi chú được gửi cho tác nhân Codex cục bộ; không nhập bí mật. Khảo sát hữu hạn sẽ dùng công cụ và phát lại độc lập."
      : "The note is sent to the local Codex agent; do not enter secrets. Finite surveys use fixed tools and independent replay."}</p>
    <Button type="submit" className="justify-self-start">{repeat
      ? (vi ? "Xác nhận đợt tiếp theo" : "Confirm next campaign")
      : (vi ? "Xác nhận và khởi động" : "Confirm and start")}</Button>
  </form>;
}
