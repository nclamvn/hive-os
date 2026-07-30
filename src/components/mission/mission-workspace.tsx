import type { MissionStatus } from "@prisma/client";
import {
  Archive,
  Blocks,
  Braces,
  ClipboardCheck,
  FileSearch,
  GitBranch,
  LayoutDashboard,
  Scale,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { DecisionControls } from "@/components/mission/decision-controls";
import { MissionActions } from "@/components/mission/mission-actions";
import { MissionStatusBadge } from "@/components/mission/mission-status-badge";
import { ObligationControls } from "@/components/mission/obligation-controls";
import { EmptyState } from "@/components/ui/empty-state";
import { Panel, SectionHeader } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { ProvenanceRail } from "@/components/ui/provenance-rail";
import { translate, type Locale, type MessageKey } from "@/i18n/config";
import { enumLabel } from "@/i18n/format";
import type {
  getMissionDetail,
  getMissionProgress,
} from "@/modules/mission-kernel";
import type { getMissionWorkspaceProjection } from "@/server/mission-workspace";

import type { MissionView } from "./workspace-views";

const LIFECYCLE: MissionStatus[] = [
  "DRAFT",
  "INTAKE",
  "SCOPED",
  "CONTRACT_REVIEW",
  "APPROVED",
  "EXPLORING",
  "BUILDING",
  "VERIFYING",
  "REVIEW",
  "RELEASED",
];

const VIEW_META: Array<{
  id: MissionView;
  labelKey: MessageKey;
  icon: ReactNode;
}> = [
  {
    id: "overview",
    labelKey: "mission.views.overview",
    icon: <LayoutDashboard />,
  },
  {
    id: "contract",
    labelKey: "mission.views.contract",
    icon: <ClipboardCheck />,
  },
  { id: "research", labelKey: "mission.views.research", icon: <GitBranch /> },
  { id: "evidence", labelKey: "mission.views.evidence", icon: <FileSearch /> },
  { id: "claims", labelKey: "mission.views.claims", icon: <Braces /> },
  { id: "build", labelKey: "mission.views.build", icon: <Blocks /> },
  { id: "verify", labelKey: "mission.views.verify", icon: <ShieldCheck /> },
  { id: "decisions", labelKey: "mission.views.decisions", icon: <Scale /> },
  { id: "release", labelKey: "mission.views.release", icon: <Archive /> },
];

type Detail = Awaited<ReturnType<typeof getMissionDetail>>;
type Progress = Awaited<ReturnType<typeof getMissionProgress>>;
type Projection = NonNullable<
  Awaited<ReturnType<typeof getMissionWorkspaceProjection>>
>;

export function MissionWorkspace({
  detail,
  progress,
  projection,
  view,
  basePath,
  canApprove,
  canResolve,
  canUpdateObligations,
  locale,
}: {
  detail: Detail;
  progress: Progress;
  projection: Projection;
  view: MissionView;
  basePath: string;
  canApprove: boolean;
  canResolve: boolean;
  canUpdateObligations: boolean;
  locale: Locale;
}) {
  const { mission } = detail;
  const lifecycleIndex = LIFECYCLE.indexOf(mission.status);
  const nextStage =
    lifecycleIndex >= 0 && lifecycleIndex < LIFECYCLE.length - 1
      ? LIFECYCLE[lifecycleIndex + 1]
      : null;
  const t = (key: MessageKey) => translate(locale, key);
  const activePlane =
    view === "research" || view === "evidence" || view === "claims"
      ? 1
      : view === "build"
        ? 2
        : view === "verify" || view === "decisions"
          ? 3
          : view === "release"
            ? 4
            : 0;

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <Panel className="overflow-hidden">
        <div className="flex flex-col gap-4 p-4 min-[760px]:p-5">
          <div className="flex flex-col gap-4 min-[760px]:flex-row min-[760px]:items-start min-[760px]:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-meta text-navy-700 tabular font-medium">
                  {mission.referenceCode}
                </span>
                <MissionStatusBadge status={mission.status} />
                <StatusBadge tone="neutral">
                  {enumLabel(locale, mission.assuranceProfile)}
                </StatusBadge>
              </div>
              <h2 className="text-ink-strong mt-2 text-[clamp(1.4rem,3vw,2rem)] leading-tight font-semibold tracking-[-0.025em]">
                {mission.title}
              </h2>
              <p className="text-meta text-ink-muted mt-1">
                {t("mission.governedDossier")} ·{" "}
                {dual(locale, "version", "phiên bản")} {mission.version}
                {nextStage
                  ? ` · ${t("mission.nextStage")} ${translate(locale, `mission.stages.${nextStage}`)}`
                  : ""}
              </p>
            </div>
            <MissionActions
              slug={basePath.split("/")[2]}
              missionId={mission.id}
              status={mission.status}
              canApprove={canApprove}
            />
          </div>
          <LifecycleRail
            current={mission.status}
            currentIndex={lifecycleIndex}
            locale={locale}
          />
        </div>
        <ProvenanceRail active={activePlane} />

        <nav
          aria-label={dual(locale, "Mission workspace", "Không gian nhiệm vụ")}
          className="border-line overflow-x-auto border-t"
        >
          <div className="flex min-w-max px-2">
            {VIEW_META.map((item) => (
              <Link
                key={item.id}
                href={`${basePath}?view=${item.id}`}
                aria-current={view === item.id ? "page" : undefined}
                className={`text-meta flex h-12 items-center gap-2 border-b-2 px-3 font-medium transition-colors [&>svg]:size-4 ${
                  view === item.id
                    ? "border-navy-700 text-navy-800"
                    : "border-transparent text-ink-muted hover:text-ink"
                }`}
              >
                {item.icon}
                {t(item.labelKey)}
              </Link>
            ))}
          </div>
        </nav>
      </Panel>

      {view === "overview" ? (
        <OverviewLens
          detail={detail}
          progress={progress}
          projection={projection}
          canUpdateObligations={canUpdateObligations}
          basePath={basePath}
          locale={locale}
        />
      ) : null}
      {view === "contract" ? (
        <ContractLens detail={detail} locale={locale} />
      ) : null}
      {view === "research" ? (
        <ResearchLens projection={projection} locale={locale} />
      ) : null}
      {view === "evidence" ? (
        <EvidenceLens projection={projection} locale={locale} />
      ) : null}
      {view === "claims" ? (
        <ClaimsLens projection={projection} locale={locale} />
      ) : null}
      {view === "build" ? (
        <BuildLens projection={projection} locale={locale} />
      ) : null}
      {view === "verify" ? (
        <VerifyLens projection={projection} locale={locale} />
      ) : null}
      {view === "decisions" ? (
        <DecisionsLens
          detail={detail}
          canResolve={canResolve}
          basePath={basePath}
          locale={locale}
        />
      ) : null}
      {view === "release" ? (
        <ReleaseLens projection={projection} locale={locale} />
      ) : null}
    </div>
  );
}

function LifecycleRail({
  current,
  currentIndex,
  locale,
}: {
  current: MissionStatus;
  currentIndex: number;
  locale: Locale;
}) {
  return (
    <ol
      aria-label={translate(locale, "mission.lifecycle")}
      className="border-line bg-surface-subtle grid grid-cols-2 overflow-hidden rounded-md border min-[560px]:grid-cols-5 min-[1180px]:grid-cols-10"
    >
      {LIFECYCLE.map((status, index) => {
        const reached = currentIndex >= 0 && index <= currentIndex;
        const active = status === current;
        return (
          <li
            key={status}
            aria-current={active ? "step" : undefined}
            className={`relative min-w-0 px-2.5 py-2.5 ${
              index > 0 ? "border-line border-l" : ""
            } ${active ? "bg-navy-800 text-white" : ""}`}
          >
            <span
              className={`text-meta tabular block ${
                active
                  ? "text-white/70"
                  : reached
                    ? "text-navy-700"
                    : "text-ink-muted"
              }`}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span
              className={`text-meta mt-0.5 block truncate font-medium ${
                active ? "text-white" : reached ? "text-ink" : "text-ink-muted"
              }`}
              title={translate(locale, `mission.stages.${status}`)}
            >
              {translate(locale, `mission.stages.${status}`)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function OverviewLens({
  detail,
  progress,
  projection,
  canUpdateObligations,
  basePath,
  locale,
}: {
  detail: Detail;
  progress: Progress;
  projection: Projection;
  canUpdateObligations: boolean;
  basePath: string;
  locale: Locale;
}) {
  const { contract, obligations, gates } = detail;
  return (
    <div className="grid min-w-0 grid-cols-1 gap-5 min-[1120px]:grid-cols-[minmax(0,1fr)_340px]">
      <div className="min-w-0 space-y-5">
        <Panel className="p-5">
          <SectionHeader
            title={dual(locale, "Mission brief", "Tóm tắt nhiệm vụ")}
          />
          {contract ? (
            <dl className="mt-4 grid grid-cols-1 gap-4 min-[720px]:grid-cols-3">
              <Field
                label={dual(locale, "Objective", "Mục tiêu")}
                value={contract.objective}
                locale={locale}
              />
              <Field
                label={dual(locale, "Scope", "Phạm vi")}
                value={contract.scope}
                locale={locale}
              />
              <Field
                label={dual(
                  locale,
                  "Success definition",
                  "Định nghĩa thành công",
                )}
                value={contract.successDefinition}
                locale={locale}
              />
            </dl>
          ) : (
            <EmptyState
              title={dual(
                locale,
                "No contract captured",
                "Chưa ghi nhận hợp đồng",
              )}
            />
          )}
        </Panel>

        <Panel className="overflow-hidden">
          <div className="border-line border-b p-5">
            <SectionHeader title={dual(locale, "Obligations", "Nghĩa vụ")} />
          </div>
          {obligations.length === 0 ? (
            <EmptyState
              title={dual(
                locale,
                "Obligations appear after approval",
                "Nghĩa vụ xuất hiện sau khi phê duyệt",
              )}
              hint={dual(
                locale,
                "Approve the Mission contract to create governed runtime obligations.",
                "Phê duyệt hợp đồng nhiệm vụ để tạo nghĩa vụ runtime được quản trị.",
              )}
            />
          ) : (
            <ul>
              {obligations.map((obligation) => (
                <li
                  key={obligation.id}
                  className="border-line flex flex-col gap-3 border-b px-5 py-3 last:border-b-0 min-[680px]:flex-row min-[680px]:items-center min-[680px]:justify-between"
                >
                  <span className="min-w-0">
                    <span className="text-body text-ink-strong block font-medium">
                      {obligation.contractObligation.code} ·{" "}
                      {obligation.contractObligation.title}
                    </span>
                    <span className="text-meta text-ink-muted">
                      {dual(locale, "Weight", "Trọng số")}{" "}
                      {obligation.contractObligation.weight}
                    </span>
                  </span>
                  <span className="flex flex-wrap items-center gap-2">
                    <StatusBadge
                      tone={
                        obligation.status === "SATISFIED"
                          ? "success"
                          : obligation.status === "BLOCKED"
                            ? "warning"
                            : "neutral"
                      }
                    >
                      {enumLabel(locale, obligation.status)}
                    </StatusBadge>
                    {canUpdateObligations ? (
                      <ObligationControls
                        slug={basePath.split("/")[2]}
                        obligationId={obligation.id}
                        status={obligation.status}
                      />
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="space-y-5">
        <Panel className="p-5">
          <p className="text-eyebrow text-ink-muted">
            {dual(locale, "Derived progress", "Tiến độ dẫn xuất")}
          </p>
          {progress ? (
            <>
              <p className="text-ink-strong tabular mt-2 text-3xl font-semibold">
                {(progress.basisPoints / 100).toFixed(2)}%
              </p>
              <div className="bg-surface-muted mt-3 h-2 overflow-hidden rounded-full">
                <div
                  className="bg-navy-700 h-full"
                  style={{ width: `${progress.basisPoints / 100}%` }}
                />
              </div>
              <p className="text-meta text-ink-muted mt-2">
                {progress.closedWeight} / {progress.totalWeight} weighted
                {dual(
                  locale,
                  "weighted obligations closed",
                  "nghĩa vụ có trọng số đã hoàn tất",
                )}
              </p>
            </>
          ) : (
            <p className="text-meta text-ink-muted mt-2">
              {dual(
                locale,
                "Progress is unavailable until the contract is approved.",
                "Tiến độ chưa khả dụng cho đến khi hợp đồng được phê duyệt.",
              )}
            </p>
          )}
        </Panel>

        <Panel className="p-5">
          <p className="text-eyebrow text-ink-muted">
            {dual(locale, "Governed records", "Hồ sơ được quản trị")}
          </p>
          <dl className="border-line mt-3 divide-y border-y">
            <MetricRow
              label={dual(locale, "Evidence sources", "Nguồn bằng chứng")}
              value={projection.evidenceSources.length}
            />
            <MetricRow
              label={dual(locale, "Claims", "Luận điểm")}
              value={projection.claims.length}
            />
            <MetricRow
              label={dual(locale, "Execution TIPs", "TIP thực thi")}
              value={projection.execution.tips.length}
            />
            <MetricRow
              label={dual(locale, "Verify Reports", "Báo cáo kiểm chứng")}
              value={projection.verification.reports.length}
            />
            <MetricRow
              label={dual(locale, "Releases", "Bản phát hành")}
              value={projection.releases.length}
            />
          </dl>
        </Panel>

        <Panel className="p-5">
          <SectionHeader title={dual(locale, "Gates", "Cổng")} />
          {gates.length === 0 ? (
            <p className="text-meta text-ink-muted mt-3">
              {dual(
                locale,
                "Gates appear after contract approval when required by assurance.",
                "Cổng xuất hiện sau khi hợp đồng được phê duyệt nếu hồ sơ bảo chứng yêu cầu.",
              )}
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {gates.map((gate) => (
                <li
                  key={gate.id}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="text-meta text-ink">
                    {gate.contractGate.title}
                  </span>
                  <StatusBadge
                    tone={gate.status === "PASSED" ? "success" : "neutral"}
                  >
                    {enumLabel(locale, gate.status)}
                  </StatusBadge>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}

function ContractLens({ detail, locale }: { detail: Detail; locale: Locale }) {
  const { contract } = detail;
  if (!contract) {
    return (
      <Panel>
        <EmptyState
          title={dual(locale, "No contract captured", "Chưa ghi nhận hợp đồng")}
        />
      </Panel>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-5 min-[1080px]:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-5">
        <Panel className="p-5">
          <SectionHeader
            title={dual(locale, "Approved intent", "Ý định đã duyệt")}
            action={
              <StatusBadge tone="neutral">
                v{contract.versionNumber} · {enumLabel(locale, contract.status)}
              </StatusBadge>
            }
          />
          <dl className="mt-4 space-y-4">
            <Field
              label={dual(locale, "Objective", "Mục tiêu")}
              value={contract.objective}
              locale={locale}
            />
            <Field
              label={dual(locale, "Scope", "Phạm vi")}
              value={contract.scope}
              locale={locale}
            />
            <Field
              label={dual(
                locale,
                "Success definition",
                "Định nghĩa thành công",
              )}
              value={contract.successDefinition}
              locale={locale}
            />
          </dl>
        </Panel>
        <RecordList
          title={dual(locale, "Requirements", "Yêu cầu")}
          empty={dual(locale, "No requirements", "Không có yêu cầu")}
          items={contract.requirements.map((item) => ({
            id: item.id,
            title: `${item.code} · ${item.title}`,
            detail: item.acceptanceCriteria,
            badge: item.required
              ? dual(locale, "required", "bắt buộc")
              : dual(locale, "optional", "tùy chọn"),
          }))}
        />
      </div>
      <div className="space-y-5">
        <RecordList
          title={dual(locale, "Assumptions", "Giả định")}
          empty={dual(locale, "No assumptions", "Không có giả định")}
          items={contract.assumptions.map((item) => ({
            id: item.id,
            title: item.statement,
          }))}
        />
        <RecordList
          title={dual(locale, "Constraints", "Ràng buộc")}
          empty={dual(locale, "No constraints", "Không có ràng buộc")}
          items={contract.constraints.map((item) => ({
            id: item.id,
            title: item.statement,
          }))}
        />
        <RecordList
          title={dual(locale, "Inputs", "Đầu vào")}
          empty={dual(locale, "No inputs", "Không có đầu vào")}
          items={contract.inputs.map((item) => ({
            id: item.id,
            title: item.label,
            detail: item.description,
          }))}
        />
      </div>
    </div>
  );
}

function ResearchLens({
  projection,
  locale,
}: {
  projection: Projection;
  locale: Locale;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 min-[1080px]:grid-cols-[320px_minmax(0,1fr)]">
      <Panel className="p-5">
        <p className="text-eyebrow text-ink-muted">
          {dual(locale, "Research graph", "Đồ thị nghiên cứu")}
        </p>
        <p className="text-section-title text-ink-strong mt-1">
          {dual(
            locale,
            "Retained lineage, not a generated diagram.",
            "Dòng nguồn gốc được lưu giữ, không phải sơ đồ được tạo sinh.",
          )}
        </p>
        <dl className="border-line mt-5 divide-y border-y">
          <MetricRow
            label={dual(locale, "Sources", "Nguồn")}
            value={projection.evidenceSources.length}
          />
          <MetricRow
            label={dual(locale, "Claims", "Luận điểm")}
            value={projection.claims.length}
          />
          <MetricRow
            label={dual(locale, "Edges", "Liên kết")}
            value={projection.provenanceEdges.length}
          />
          <MetricRow
            label={dual(locale, "Disputes", "Tranh chấp")}
            value={projection.disputes.length}
          />
        </dl>
      </Panel>
      <Panel className="overflow-hidden">
        <div className="border-line border-b p-5">
          <SectionHeader
            title={dual(
              locale,
              "Recent provenance edges",
              "Liên kết nguồn gốc gần đây",
            )}
          />
        </div>
        {projection.provenanceEdges.length === 0 ? (
          <EmptyState
            title={dual(
              locale,
              "No provenance edges yet",
              "Chưa có liên kết nguồn gốc",
            )}
            hint={dual(
              locale,
              "Create evidence-backed ClaimVersions to build the research graph.",
              "Tạo ClaimVersion có bằng chứng để xây dựng đồ thị nghiên cứu.",
            )}
          />
        ) : (
          <ul>
            {projection.provenanceEdges.map((edge) => (
              <li
                key={edge.id}
                className="border-line grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 border-b px-5 py-3 last:border-b-0"
              >
                <span className="text-meta text-ink min-w-0 truncate">
                  {edge.fromKind} · {edge.fromId.slice(0, 8)}
                </span>
                <StatusBadge tone="neutral">
                  {enumLabel(locale, edge.relation)}
                </StatusBadge>
                <span className="text-meta text-ink min-w-0 truncate text-right">
                  {edge.toKind} · {edge.toId.slice(0, 8)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

function EvidenceLens({
  projection,
  locale,
}: {
  projection: Projection;
  locale: Locale;
}) {
  return (
    <Panel className="overflow-hidden">
      <div className="border-line border-b p-5">
        <SectionHeader
          title={dual(locale, "Evidence ledger", "Sổ cái bằng chứng")}
          action={
            <StatusBadge tone="neutral">
              {projection.evidenceSources.length}{" "}
              {dual(locale, "sources", "nguồn")}
            </StatusBadge>
          }
        />
      </div>
      {projection.evidenceSources.length === 0 ? (
        <EmptyState
          title={dual(
            locale,
            "No evidence sources yet",
            "Chưa có nguồn bằng chứng",
          )}
          hint={dual(
            locale,
            "Evidence sources, immutable snapshots and exact spans appear during exploration.",
            "Nguồn bằng chứng, snapshot bất biến và đoạn trích chính xác xuất hiện trong giai đoạn khảo sát.",
          )}
        />
      ) : (
        <ul className="grid grid-cols-1 min-[760px]:grid-cols-2">
          {projection.evidenceSources.map((source) => (
            <li
              key={source.id}
              className="border-line border-b p-5 odd:min-[760px]:border-r"
            >
              <span className="flex items-start justify-between gap-3">
                <span className="text-body text-ink-strong font-semibold">
                  {source.title}
                </span>
                <StatusBadge tone="neutral">
                  {enumLabel(locale, source.accessLevel)}
                </StatusBadge>
              </span>
              <p className="text-meta text-ink-muted mt-1">
                {source.publisher || source.sourceType} ·{" "}
                {dual(locale, "independence", "độc lập")}{" "}
                {source.independenceKey}
              </p>
              <p className="text-meta text-ink-muted mt-3">
                {source._count.snapshots}{" "}
                {dual(locale, "immutable snapshots", "snapshot bất biến")} ·{" "}
                {source.qualifiesForCorroboration
                  ? dual(
                      locale,
                      "qualifies for corroboration",
                      "đủ điều kiện đối chứng",
                    )
                  : dual(
                      locale,
                      "not a corroboration source",
                      "không phải nguồn đối chứng",
                    )}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

function ClaimsLens({
  projection,
  locale,
}: {
  projection: Projection;
  locale: Locale;
}) {
  return (
    <Panel className="overflow-hidden">
      <div className="border-line border-b p-5">
        <SectionHeader
          title={dual(locale, "Claims and insights", "Luận điểm và phân tích")}
        />
      </div>
      {projection.claims.length === 0 ? (
        <EmptyState
          title={dual(locale, "No claims yet", "Chưa có luận điểm")}
          hint={dual(
            locale,
            "Create a sourced claim, an owned internal claim, or an explicit hypothesis.",
            "Tạo luận điểm có nguồn, luận điểm nội bộ có chủ sở hữu hoặc giả thuyết rõ ràng.",
          )}
        />
      ) : (
        <ul>
          {projection.claims.map((claim) => {
            const latest = claim.versions[0];
            return (
              <li
                key={claim.id}
                className="border-line grid grid-cols-1 gap-3 border-b px-5 py-4 last:border-b-0 min-[760px]:grid-cols-[minmax(0,1fr)_auto] min-[760px]:items-center"
              >
                <span className="min-w-0">
                  <span className="text-body text-ink-strong block font-semibold">
                    {latest?.statement || claim.claimKey}
                  </span>
                  <span className="text-meta text-ink-muted tabular block">
                    {claim.claimKey} · {claim._count.versions}{" "}
                    {dual(locale, "versions", "phiên bản")} ·{" "}
                    {claim._count.disputes}{" "}
                    {dual(locale, "disputes", "tranh chấp")}
                  </span>
                </span>
                <span className="flex flex-wrap items-center gap-2">
                  <StatusBadge
                    tone={
                      claim.state === "DISPUTED" ||
                      claim.state === "FALSIFIED" ||
                      claim.state === "RETRACTED"
                        ? "danger"
                        : claim.state === "CORROBORATED" ||
                            claim.state === "VALIDATED_BOUNDED" ||
                            claim.state === "PROVED_INTERNAL"
                          ? "success"
                          : "neutral"
                    }
                  >
                    {enumLabel(locale, claim.state)}
                  </StatusBadge>
                  <StatusBadge tone="neutral">
                    {enumLabel(locale, claim.accessLevel)}
                  </StatusBadge>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}

function BuildLens({
  projection,
  locale,
}: {
  projection: Projection;
  locale: Locale;
}) {
  return (
    <div className="space-y-5">
      <Panel className="p-5">
        <div className="flex flex-col gap-3 min-[700px]:flex-row min-[700px]:items-start min-[700px]:justify-between">
          <div>
            <p className="text-eyebrow text-navy-700">Manual Provider Bridge</p>
            <h3 className="text-section-title text-ink-strong mt-1">
              {dual(locale, "Governed execution", "Thực thi được quản trị")}
            </h3>
            <p className="text-meta text-ink-muted mt-1">
              {projection.execution.disclaimer}
            </p>
          </div>
          <span className="flex flex-wrap gap-2">
            <StatusBadge tone="neutral">
              {projection.execution.counts.artifacts}{" "}
              {dual(locale, "artifacts", "artifact")}
            </StatusBadge>
            <StatusBadge
              tone={
                projection.execution.counts.awaitingReports > 0
                  ? "warning"
                  : "neutral"
              }
            >
              {projection.execution.counts.awaitingReports}{" "}
              {dual(locale, "awaiting reports", "báo cáo đang chờ")}
            </StatusBadge>
          </span>
        </div>
      </Panel>
      <Panel className="overflow-hidden">
        <div className="border-line border-b p-5">
          <SectionHeader
            title={dual(locale, "Execution TIPs", "TIP thực thi")}
          />
        </div>
        {projection.execution.tips.length === 0 ? (
          <EmptyState
            title={dual(
              locale,
              "No execution TIPs yet",
              "Chưa có TIP thực thi",
            )}
            hint={dual(
              locale,
              "Execution packages appear after governed exploration defines the work.",
              "Gói thực thi xuất hiện sau khi khảo sát được quản trị xác định công việc.",
            )}
          />
        ) : (
          <ul>
            {projection.execution.tips.map((tip) => {
              const latest = tip.skillRuns[0]?.agentRuns[0];
              return (
                <li
                  key={tip.id}
                  className="border-line grid grid-cols-1 gap-3 border-b px-5 py-4 last:border-b-0 min-[760px]:grid-cols-[minmax(0,1fr)_auto] min-[760px]:items-center"
                >
                  <span className="min-w-0">
                    <span className="text-body text-ink-strong block font-semibold">
                      {tip.code} · {tip.title}
                    </span>
                    <span className="text-meta text-ink-muted block">
                      {tip.skillVersion.skill.displayName} v
                      {tip.skillVersion.semanticVersion}
                      {latest
                        ? ` · ${dual(locale, "attempt", "lần thử")} ${latest.attemptNumber} · ${enumLabel(locale, latest.executionRole)} · ${latest.providerName}`
                        : ` · ${dual(locale, "not issued", "chưa phát hành")}`}
                    </span>
                  </span>
                  <StatusBadge
                    tone={
                      tip.status === "BLOCKED" ||
                      tip.status === "BLOCKED_DEVIATION"
                        ? "danger"
                        : tip.status === "DONE"
                          ? "success"
                          : "neutral"
                    }
                  >
                    {enumLabel(locale, tip.status)}
                  </StatusBadge>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </div>
  );
}

function VerifyLens({
  projection,
  locale,
}: {
  projection: Projection;
  locale: Locale;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 min-[1080px]:grid-cols-[minmax(0,1fr)_340px]">
      <Panel className="overflow-hidden">
        <div className="border-line border-b p-5">
          <SectionHeader
            title={dual(locale, "Verify Reports", "Báo cáo kiểm chứng")}
          />
        </div>
        {projection.verification.reports.length === 0 ? (
          <EmptyState
            title={dual(
              locale,
              "No Verify Reports yet",
              "Chưa có Báo cáo kiểm chứng",
            )}
            hint={dual(
              locale,
              "A report appears after a governed verifier completes exact coverage, health and corruption checks.",
              "Báo cáo xuất hiện sau khi người kiểm chứng hoàn tất độ phủ chính xác, sức khỏe kỹ thuật và kiểm tra sai hỏng.",
            )}
          />
        ) : (
          <ul>
            {projection.verification.reports.map((report) => (
              <li
                key={report.id}
                className="border-line border-b px-5 py-4 last:border-b-0"
              >
                <span className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-body text-ink-strong font-semibold">
                    {report.contentHash.slice(0, 16)}
                  </span>
                  <StatusBadge
                    tone={
                      report.overallStatus === "READY"
                        ? "success"
                        : report.overallStatus === "NOT_READY"
                          ? "danger"
                          : "warning"
                    }
                  >
                    {enumLabel(locale, report.overallStatus)}
                  </StatusBadge>
                </span>
                <p className="text-meta text-ink-muted mt-2">
                  {enumLabel(locale, report.verificationRun.independenceStatus)}{" "}
                  · {report.verificationRun.corruptionRuns.length}{" "}
                  {dual(locale, "corruption tests", "kiểm tra sai hỏng")} ·{" "}
                  {report.deferredItems.length}{" "}
                  {dual(locale, "deferred", "hoãn lại")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Panel>
      <div className="space-y-5">
        <RecordList
          title={dual(locale, "Required scenarios", "Kịch bản bắt buộc")}
          empty={dual(
            locale,
            "No verification scenarios",
            "Không có kịch bản kiểm chứng",
          )}
          items={projection.verification.scenarios.map((scenario) => ({
            id: scenario.id,
            title: `${scenario.code} · ${scenario.title}`,
            detail: scenario.expectedOutcome,
            badge: scenario.required
              ? dual(locale, "required", "bắt buộc")
              : dual(locale, "optional", "tùy chọn"),
          }))}
        />
        <RecordList
          title={dual(locale, "Governance sign-offs", "Phê duyệt quản trị")}
          empty={dual(locale, "No sign-offs", "Không có phê duyệt")}
          items={projection.verification.signoffs.map((signoff) => ({
            id: signoff.id,
            title: `${enumLabel(locale, signoff.signoffType)} · ${enumLabel(locale, signoff.decision)}`,
            detail: signoff.rationale,
          }))}
        />
      </div>
    </div>
  );
}

function DecisionsLens({
  detail,
  canResolve,
  basePath,
  locale,
}: {
  detail: Detail;
  canResolve: boolean;
  basePath: string;
  locale: Locale;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 min-[1040px]:grid-cols-2">
      <Panel className="overflow-hidden">
        <div className="border-line border-b p-5">
          <SectionHeader
            title={dual(locale, "Decision ledger", "Sổ cái quyết định")}
          />
        </div>
        {detail.decisions.length === 0 ? (
          <EmptyState
            title={dual(
              locale,
              "No decisions recorded",
              "Chưa ghi nhận quyết định",
            )}
            hint={dual(
              locale,
              "Material changes and exceptions create governed Decisions.",
              "Thay đổi trọng yếu và ngoại lệ tạo ra quyết định được quản trị.",
            )}
          />
        ) : (
          <ul>
            {detail.decisions.map((decision) => (
              <li
                key={decision.id}
                className="border-line flex flex-col gap-3 border-b px-5 py-4 last:border-b-0 min-[620px]:flex-row min-[620px]:items-center min-[620px]:justify-between"
              >
                <span className="min-w-0">
                  <span className="text-body text-ink-strong block font-medium">
                    {enumLabel(locale, decision.decisionType)}
                  </span>
                  <span className="text-meta text-ink-muted block">
                    {decision.question}
                  </span>
                </span>
                {decision.status === "REQUIRED" && canResolve ? (
                  <DecisionControls
                    slug={basePath.split("/")[2]}
                    decisionId={decision.id}
                  />
                ) : (
                  <StatusBadge
                    tone={
                      decision.status === "REQUIRED" ? "warning" : "neutral"
                    }
                  >
                    {enumLabel(locale, decision.status)}
                  </StatusBadge>
                )}
              </li>
            ))}
          </ul>
        )}
      </Panel>
      <RecordList
        title={dual(locale, "Escalations", "Chuyển cấp")}
        empty={dual(locale, "No escalations", "Không có chuyển cấp")}
        items={detail.escalations.map((escalation) => ({
          id: escalation.id,
          title: escalation.reason,
          detail: `${escalation.severity} · ${enumLabel(locale, escalation.status)} · ${enumLabel(locale, escalation.sourceType)}`,
        }))}
      />
    </div>
  );
}

function ReleaseLens({
  projection,
  locale,
}: {
  projection: Projection;
  locale: Locale;
}) {
  return (
    <Panel className="overflow-hidden">
      <div className="border-line border-b p-5">
        <SectionHeader
          title={dual(
            locale,
            "Governed releases",
            "Bản phát hành được quản trị",
          )}
        />
      </div>
      {projection.releases.length === 0 ? (
        <EmptyState
          title={dual(
            locale,
            "No governed release yet",
            "Chưa có bản phát hành được quản trị",
          )}
          hint={dual(
            locale,
            "A release requires a ready Verify Report, required sign-offs, evidence-ceiling checks and an immutable manifest.",
            "Bản phát hành cần Báo cáo kiểm chứng sẵn sàng, phê duyệt bắt buộc, kiểm tra trần bằng chứng và manifest bất biến.",
          )}
        />
      ) : (
        <ul>
          {projection.releases.map((release) => (
            <li
              key={release.id}
              className="border-line grid grid-cols-1 gap-4 border-b p-5 last:border-b-0 min-[900px]:grid-cols-[minmax(0,1fr)_360px]"
            >
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-2">
                  <StatusBadge tone="success">
                    {enumLabel(locale, release.status)}
                  </StatusBadge>
                  <StatusBadge tone="neutral">
                    {enumLabel(locale, release.visibility)}
                  </StatusBadge>
                </span>
                <p className="text-meta text-ink-muted tabular mt-3 break-all">
                  Manifest{" "}
                  {release.manifest?.contentHash ||
                    dual(locale, "not available", "chưa khả dụng")}
                </p>
                <p className="text-meta text-ink-muted mt-2">
                  {jsonArrayLength(release.manifest?.claimVersions)}{" "}
                  {dual(
                    locale,
                    "exact claim versions",
                    "phiên bản luận điểm chính xác",
                  )}{" "}
                  · {jsonArrayLength(release.manifest?.artifacts)}{" "}
                  {dual(locale, "artifacts", "artifact")} ·{" "}
                  {release.manifest?.approverMembershipIds.length ?? 0}{" "}
                  {dual(locale, "approvers", "người phê duyệt")}
                </p>
              </span>
              <dl className="border-line divide-y border-y">
                <TextArrayRow
                  label={dual(locale, "Methods", "Phương pháp")}
                  values={release.manifest?.methods ?? []}
                  locale={locale}
                />
                <TextArrayRow
                  label={dual(locale, "Limitations", "Giới hạn")}
                  values={release.manifest?.limitations ?? []}
                  locale={locale}
                />
              </dl>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

function RecordList({
  title,
  empty,
  items,
}: {
  title: string;
  empty: string;
  items: Array<{
    id: string;
    title: string;
    detail?: string | null;
    badge?: string;
  }>;
}) {
  return (
    <Panel className="overflow-hidden">
      <div className="border-line border-b p-5">
        <SectionHeader title={title} />
      </div>
      {items.length === 0 ? (
        <EmptyState title={empty} />
      ) : (
        <ul>
          {items.map((item) => (
            <li
              key={item.id}
              className="border-line border-b px-5 py-3 last:border-b-0"
            >
              <span className="flex items-start justify-between gap-3">
                <span className="text-body text-ink block font-medium">
                  {item.title}
                </span>
                {item.badge ? (
                  <StatusBadge tone="neutral">{item.badge}</StatusBadge>
                ) : null}
              </span>
              {item.detail ? (
                <span className="text-meta text-ink-muted mt-1 block">
                  {item.detail}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

function MetricRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <dt className="text-meta text-ink-muted">{label}</dt>
      <dd className="text-body text-ink-strong tabular font-semibold">
        {value}
      </dd>
    </div>
  );
}

function Field({
  label,
  value,
  locale,
}: {
  label: string;
  value: string;
  locale: Locale;
}) {
  return (
    <div>
      <dt className="text-meta text-ink-muted">{label}</dt>
      <dd className="text-body text-ink mt-1 whitespace-pre-wrap">
        {value || dual(locale, "Not available", "Chưa khả dụng")}
      </dd>
    </div>
  );
}

function TextArrayRow({
  label,
  values,
  locale,
}: {
  label: string;
  values: string[];
  locale: Locale;
}) {
  return (
    <div className="py-3">
      <dt className="text-meta text-ink-muted">{label}</dt>
      <dd className="text-meta text-ink mt-1">
        {values.length > 0
          ? values.join(" · ")
          : dual(locale, "Not available", "Chưa khả dụng")}
      </dd>
    </div>
  );
}

function jsonArrayLength(value: unknown): number {
  return Array.isArray(value) ? value.length : 0;
}

function dual(locale: Locale, en: string, vi: string): string {
  return locale === "vi" ? vi : en;
}
