"use client";

import {
  Activity,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Command,
  Copy,
  Download,
  FileCheck2,
  GitBranch,
  Grid2X2,
  Network,
  PanelRightClose,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Timeline,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { usePreferences } from "@/components/preferences/preferences-provider";
import type { MissionCommandProjection } from "@/server/mission-command";

type SurfaceMode = "graph" | "grid" | "chronology";
type Mission = MissionCommandProjection["missions"]["nodes"][number];

const LANES = [
  "intake",
  "contract",
  "truth",
  "execution",
  "verification",
  "release",
] as const;

const MISSION_STATUSES = [
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
  "PARTIAL",
  "BLOCKED",
  "REFUTED",
  "CANCELLED",
  "ARCHIVED",
] as const;

function lifecycleLaneLabels(locale: "vi" | "en") {
  return [
    ct(locale, "Intake", "Tiếp nhận"),
    ct(locale, "Contract", "Hợp đồng"),
    ct(locale, "Truth", "Sự thật"),
    ct(locale, "Execution", "Thực thi"),
    ct(locale, "Verification", "Kiểm chứng"),
    ct(locale, "Release", "Phát hành"),
  ];
}

function ct(locale: "vi" | "en", en: string, vi: string) {
  return locale === "vi" ? vi : en;
}

function laneForStatus(status: string, blockedFromStatus: string | null) {
  const effective = status === "BLOCKED" && blockedFromStatus
    ? blockedFromStatus
    : status;
  if (["DRAFT", "INTAKE"].includes(effective)) return 0;
  if (["SCOPED", "CONTRACT_REVIEW", "APPROVED"].includes(effective)) return 1;
  if (effective === "EXPLORING") return 2;
  if (effective === "BUILDING") return 3;
  if (["VERIFYING", "REVIEW"].includes(effective)) return 4;
  return 5;
}

function formatDate(locale: "vi" | "en", value: string) {
  return new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function statusTone(status: string) {
  if (status === "BLOCKED" || status === "REFUTED") return "danger";
  if (["CONTRACT_REVIEW", "REVIEW", "PARTIAL"].includes(status)) return "warning";
  if (status === "RELEASED") return "success";
  return "neutral";
}

function StatusMark({
  status,
  locale,
}: {
  status: string;
  locale: "vi" | "en";
}) {
  const tone = statusTone(status);
  return (
    <span
      data-tone={tone}
      className="mission-status-mark text-meta tabular"
    >
      {locale === "vi"
        ? ({
            DRAFT: "Bản nháp",
            INTAKE: "Tiếp nhận",
            SCOPED: "Đã xác định",
            CONTRACT_REVIEW: "Duyệt hợp đồng",
            APPROVED: "Đã duyệt",
            EXPLORING: "Khảo sát",
            BUILDING: "Đang xây dựng",
            VERIFYING: "Đang kiểm chứng",
            REVIEW: "Rà soát",
            RELEASED: "Đã phát hành",
            PARTIAL: "Một phần",
            BLOCKED: "Bị chặn",
            REFUTED: "Đã bác bỏ",
            CANCELLED: "Đã hủy",
            ARCHIVED: "Đã lưu trữ",
          } as Record<string, string>)[status] ?? status
        : status.replaceAll("_", " ").toLowerCase()}
    </span>
  );
}

function ModeButton({
  id,
  active,
  label,
  icon,
  onClick,
}: {
  id?: string;
  active: boolean;
  label: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      id={id}
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className="mission-mode-button"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export function MissionCommandSurface({
  projection,
  basePath,
  initialMode = "graph",
  initialStatus = "",
  initialSort = "UPDATED_DESC",
}: {
  projection: MissionCommandProjection;
  basePath: string;
  initialMode?: SurfaceMode;
  initialStatus?: string;
  initialSort?: "UPDATED_DESC" | "CREATED_DESC";
}) {
  const { locale } = usePreferences();
  const router = useRouter();
  const [mode, setMode] = useState<SurfaceMode>(initialMode);
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(
    projection.missions.nodes[0]?.id ?? null,
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [bulkMessage, setBulkMessage] = useState("");
  const selectedMission =
    projection.missions.nodes.find(
      (mission) => mission.id === selectedMissionId,
    ) ?? null;
  const activeSavedView =
    projection.savedViews.find((view) => view.id === projection.view) ??
    projection.savedViews[0];
  const hasActiveQuery =
    projection.view !== "all" ||
    Boolean(initialStatus) ||
    initialSort !== "UPDATED_DESC";

  function updateQuery(
    changes: Record<string, string | null>,
    navigate = true,
  ) {
    const params = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(changes)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    const url = `${basePath}${params.size ? `?${params.toString()}` : ""}`;
    if (navigate) router.push(url);
    else window.history.replaceState(null, "", url);
  }

  function selectMode(next: SurfaceMode) {
    setMode(next);
    updateQuery({ mode: next === "graph" ? null : next }, false);
  }

  function toggleSelected(id: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const selectedRows = useMemo(
    () =>
      projection.missions.nodes.filter((mission) =>
        selectedIds.has(mission.id),
      ),
    [projection.missions.nodes, selectedIds],
  );

  async function copyReferences() {
    const value = selectedRows.map((row) => row.referenceCode).join("\n");
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setBulkMessage(
      ct(locale, "References copied", "Đã sao chép mã tham chiếu"),
    );
  }

  function exportSelection() {
    if (!selectedRows.length) return;
    const payload = selectedRows.map((row) => ({
      referenceCode: row.referenceCode,
      title: row.title,
      status: row.status,
      assuranceProfile: row.assuranceProfile,
      version: row.version,
      updatedAt: row.updatedAt,
    }));
    const blob = new Blob([`${JSON.stringify(payload, null, 2)}\n`], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `hive-os-mission-selection-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setBulkMessage(
      ct(locale, "Selection exported", "Đã xuất danh sách đã chọn"),
    );
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const viewLabels: Record<string, string> = {
    all: ct(locale, "All missions", "Tất cả nhiệm vụ"),
    attention: ct(locale, "Requires attention", "Cần chú ý"),
    "my-work": ct(locale, "My accountable work", "Công việc của tôi"),
  };

  return (
    <>
      <section
        aria-label={ct(
          locale,
          "Enterprise Mission Command Surface",
          "Mặt phẳng điều hành nhiệm vụ doanh nghiệp",
        )}
        className="mission-command-surface"
      >
        <header className="mission-command-hero">
          <div className="min-w-0">
            <p className="text-eyebrow text-ink-muted">
              {ct(
                locale,
                "Governed operational command",
                "Điều hành vận hành có quản trị",
              )}
            </p>
            <h2 className="mission-command-thesis">
              {ct(
                locale,
                "One scope. Every accountable trace.",
                "Một phạm vi. Mọi dấu vết trách nhiệm.",
              )}
            </h2>
            <p className="text-body text-ink-muted mt-2 max-w-3xl">
              {ct(
                locale,
                "Navigate real missions from intake to release without losing authority, provenance or operating context.",
                "Điều hướng nhiệm vụ thật từ tiếp nhận đến phát hành mà không mất thẩm quyền, nguồn gốc hay ngữ cảnh vận hành.",
              )}
            </p>
          </div>

          <div className="mission-command-tallies" aria-label="Operational totals">
            {[
              [
                projection.operational.counts.missions,
                ct(locale, "Missions", "Nhiệm vụ"),
              ],
              [
                projection.operational.counts.decisionsRequired,
                ct(locale, "Decisions", "Quyết định"),
              ],
              [
                projection.operational.counts.openEscalations,
                ct(locale, "Escalations", "Leo thang"),
              ],
              [
                projection.operational.counts.governedReleases,
                ct(locale, "Releases", "Phát hành"),
              ],
            ].map(([value, label]) => (
              <div key={String(label)} className="mission-command-tally">
                <strong className="tabular">{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </header>

        <div className="mission-command-toolbar">
          <div
            className="mission-view-switcher"
            role="group"
            aria-label={ct(locale, "View mode", "Chế độ hiển thị")}
          >
            <ModeButton
              id="mission-view-graph"
              active={mode === "graph"}
              label={ct(locale, "Graph", "Đồ thị")}
              icon={<Network aria-hidden="true" />}
              onClick={() => selectMode("graph")}
            />
            <ModeButton
              active={mode === "grid"}
              label={ct(locale, "Grid", "Lưới")}
              icon={<Grid2X2 aria-hidden="true" />}
              onClick={() => selectMode("grid")}
            />
            <ModeButton
              active={mode === "chronology"}
              label={ct(locale, "Chronology", "Thời tuyến")}
              icon={<Timeline aria-hidden="true" />}
              onClick={() => selectMode("chronology")}
            />
          </div>

          <div className="mission-command-filters">
            <label>
              <span className="sr-only">
                {ct(locale, "Saved view", "Chế độ đã lưu")}
              </span>
              <select
                value={projection.view}
                onChange={(event) =>
                  updateQuery({
                    view: event.target.value === "all"
                      ? null
                      : event.target.value,
                    after: null,
                    status: null,
                  })
                }
                className="mission-command-select"
              >
                {projection.savedViews.map((view) => (
                  <option key={view.id} value={view.id}>
                    {viewLabels[view.id]} · {view.visibility.toLowerCase()}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="sr-only">
                {ct(locale, "Mission status", "Trạng thái nhiệm vụ")}
              </span>
              <select
                value={initialStatus}
                onChange={(event) =>
                  updateQuery({
                    status: event.target.value || null,
                    view: null,
                    after: null,
                  })
                }
                className="mission-command-select"
              >
                <option value="">
                  {ct(locale, "Every status", "Mọi trạng thái")}
                </option>
                {MISSION_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="sr-only">
                {ct(locale, "Sort missions", "Sắp xếp nhiệm vụ")}
              </span>
              <select
                value={initialSort}
                onChange={(event) =>
                  updateQuery({
                    sort:
                      event.target.value === "CREATED_DESC"
                        ? "CREATED_DESC"
                        : null,
                    after: null,
                  })
                }
                className="mission-command-select"
              >
                <option value="UPDATED_DESC">
                  {ct(locale, "Recently updated", "Mới cập nhật")}
                </option>
                <option value="CREATED_DESC">
                  {ct(locale, "Recently created", "Mới tạo")}
                </option>
              </select>
            </label>
            {hasActiveQuery ? (
              <button
                type="button"
                className="mission-filter-reset"
                onClick={() =>
                  updateQuery({
                    view: null,
                    status: null,
                    sort: null,
                    after: null,
                  })
                }
              >
                <X aria-hidden="true" />
                {ct(locale, "Reset", "Đặt lại")}
              </button>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="mission-command-trigger"
            aria-label={ct(locale, "Open command palette", "Mở bảng lệnh")}
          >
            <Command aria-hidden="true" />
            <span>{ct(locale, "Commands", "Lệnh")}</span>
            <kbd>⌘K</kbd>
          </button>
        </div>

        <div
          className="mission-command-context"
          aria-label={ct(locale, "Active scope", "Phạm vi hiện tại")}
          role="region"
          tabIndex={0}
        >
          <ScopePart
            icon={<BriefcaseBusiness aria-hidden="true" />}
            label={ct(locale, "Organization", "Tổ chức")}
            value={projection.scope.organization.name}
          />
          <ChevronRight aria-hidden="true" />
          <ScopePart
            label={ct(locale, "Unit", "Đơn vị")}
            value={projection.scope.unit.name}
          />
          <ChevronRight aria-hidden="true" />
          <ScopePart
            label={ct(locale, "Portfolio", "Danh mục")}
            value={
              projection.scope.portfolio?.name ??
              ct(locale, "No portfolio assigned", "Chưa gán danh mục")
            }
            muted={!projection.scope.portfolio}
          />
          <ChevronRight aria-hidden="true" />
          <ScopePart
            label={ct(locale, "Workspace", "Không gian")}
            value={projection.scope.workspace.name}
          />
          <span className="mission-freshness">
            <Activity aria-hidden="true" />
            {projection.operational.freshness.refreshedAt
              ? (
                  <>
                    <span>
                      {ct(locale, "Projection", "Bản chiếu")}
                    </span>
                    <time
                      dateTime={projection.operational.freshness.refreshedAt}
                      className="tabular"
                    >
                      {formatDate(
                        locale,
                        projection.operational.freshness.refreshedAt,
                      )}
                    </time>
                  </>
                )
              : ct(locale, "Freshness unavailable", "Chưa có độ mới")}
          </span>
        </div>

        {selectedIds.size ? (
          <div className="mission-bulk-bar" role="status">
            <span className="tabular">
              {selectedIds.size}{" "}
              {ct(locale, "selected", "đã chọn")}
            </span>
            <button type="button" onClick={copyReferences}>
              <Copy aria-hidden="true" />
              {ct(locale, "Copy references", "Sao chép mã")}
            </button>
            <button type="button" onClick={exportSelection}>
              <Download aria-hidden="true" />
              {ct(locale, "Export selection", "Xuất danh sách")}
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              aria-label={ct(locale, "Clear selection", "Bỏ lựa chọn")}
            >
              <X aria-hidden="true" />
            </button>
            {bulkMessage ? <span>{bulkMessage}</span> : null}
          </div>
        ) : null}

        <div
          className={`mission-command-body ${
            inspectorOpen ? "" : "mission-command-body--closed"
          }`}
        >
          <div className="min-w-0">
            {projection.missions.nodes.length === 0 ? (
              <CommandEmptyState
                locale={locale}
                basePath={basePath}
                canCreate={projection.commands["missions.create"]}
                hasActiveQuery={hasActiveQuery}
                onReset={() =>
                  updateQuery({
                    view: null,
                    status: null,
                    sort: null,
                    after: null,
                  })
                }
              />
            ) : mode === "graph" ? (
              <MissionGraph
                locale={locale}
                missions={projection.missions.nodes}
                selectedMissionId={selectedMissionId}
                onSelect={(id) => {
                  setSelectedMissionId(id);
                  setInspectorOpen(true);
                }}
              />
            ) : mode === "grid" ? (
              <MissionGrid
                locale={locale}
                missions={projection.missions.nodes}
                selectedMissionId={selectedMissionId}
                selectedIds={selectedIds}
                onSelect={(id) => {
                  setSelectedMissionId(id);
                  setInspectorOpen(true);
                }}
                onToggleSelected={toggleSelected}
              />
            ) : (
              <MissionChronology
                locale={locale}
                missions={projection.missions.nodes}
                selectedMissionId={selectedMissionId}
                onSelect={(id) => {
                  setSelectedMissionId(id);
                  setInspectorOpen(true);
                }}
              />
            )}

            <div className="mission-page-ledger">
              <span>
                <strong className="tabular">
                  {projection.missions.nodes.length}
                </strong>{" "}
                {ct(locale, "visible", "đang hiển thị")}
                {" · "}
                <strong className="tabular">
                  {projection.missions.totalCount ?? "—"}
                </strong>{" "}
                {ct(locale, "matching", "phù hợp")}
                {" · "}
                {ct(locale, "bound 25", "giới hạn 25")}
              </span>
              {projection.missions.pageInfo.hasNextPage &&
              projection.missions.pageInfo.endCursor ? (
                <button
                  type="button"
                  onClick={() =>
                    updateQuery({
                      after: projection.missions.pageInfo.endCursor,
                    })
                  }
                >
                  {ct(locale, "Next 25", "25 mục tiếp")}
                  <ArrowRight aria-hidden="true" />
                </button>
              ) : (
                <span>{ct(locale, "End of bounded page", "Hết trang hữu hạn")}</span>
              )}
            </div>
          </div>

          {inspectorOpen ? (
            <MissionInspector
              locale={locale}
              mission={selectedMission}
              inbox={projection.inbox}
              basePath={basePath}
              commands={projection.commands}
              operatingContext={{
                viewLabel: viewLabels[projection.view],
                viewVisibility: activeSavedView.visibility,
                visibleCount: projection.missions.nodes.length,
                totalCount: projection.missions.totalCount,
                workspaceName: projection.scope.workspace.name,
                refreshedAt:
                  projection.operational.freshness.refreshedAt ?? null,
              }}
              onClose={() => setInspectorOpen(false)}
              onSelect={(id) => {
                setSelectedMissionId(id);
                setInspectorOpen(true);
              }}
            />
          ) : (
            <button
              type="button"
              className="mission-inspector-restore"
              onClick={() => setInspectorOpen(true)}
            >
              <PanelRightClose aria-hidden="true" />
              <span className="sr-only">
                {ct(locale, "Open inspector", "Mở bảng ngữ cảnh")}
              </span>
            </button>
          )}
        </div>
      </section>

      {paletteOpen ? (
        <CommandPalette
          locale={locale}
          basePath={basePath}
          commands={projection.commands}
          onClose={() => setPaletteOpen(false)}
        />
      ) : null}
    </>
  );
}

function ScopePart({
  icon,
  label,
  value,
  muted = false,
}: {
  icon?: ReactNode;
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <span className="mission-scope-part" data-muted={muted}>
      {icon}
      <span>
        <small>{label}</small>
        <strong>{value}</strong>
      </span>
    </span>
  );
}

function MissionGraph({
  locale,
  missions,
  selectedMissionId,
  onSelect,
}: {
  locale: "vi" | "en";
  missions: Mission[];
  selectedMissionId: string | null;
  onSelect: (id: string) => void;
}) {
  const laneLabels = lifecycleLaneLabels(locale);
  return (
    <div className="mission-graph" aria-label={ct(locale, "Mission graph", "Đồ thị nhiệm vụ")}>
      <div className="mission-graph-desktop">
        <div className="mission-graph-head">
          <span>{ct(locale, "Mission", "Nhiệm vụ")}</span>
          {laneLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
        {missions.map((mission) => {
          const activeLane = laneForStatus(
            mission.status,
            mission.blockedFromStatus,
          );
          return (
            <div
              key={mission.id}
              className="mission-graph-row"
              data-selected={selectedMissionId === mission.id}
            >
              <button
                type="button"
                data-mission-id={mission.id}
                className="mission-graph-identity"
                onClick={() => onSelect(mission.id)}
              >
                <span className="tabular">{mission.referenceCode}</span>
                <strong>{mission.title}</strong>
                <StatusMark status={mission.status} locale={locale} />
              </button>
              {LANES.map((lane, index) => (
                <button
                  type="button"
                  key={lane}
                  data-state={
                    index < activeLane
                      ? "traversed"
                      : index === activeLane
                        ? "active"
                        : "gap"
                  }
                  className="mission-lane-node"
                  onClick={() => onSelect(mission.id)}
                  aria-label={`${mission.referenceCode} · ${laneLabels[index]} · ${
                    index === activeLane
                      ? mission.status
                      : index < activeLane
                        ? ct(locale, "retained path", "đường đã qua")
                        : ct(locale, "explicit gap", "khoảng trống")
                  }`}
                >
                  <span className="mission-lane-trace" aria-hidden="true" />
                  <span className="mission-lane-dot" aria-hidden="true">
                    {index < activeLane ? <Check /> : null}
                  </span>
                  {index === activeLane ? (
                    <small>{mission.status.replaceAll("_", " ")}</small>
                  ) : null}
                </button>
              ))}
            </div>
          );
        })}
      </div>

      <div className="mission-graph-mobile">
        {missions.map((mission) => {
          const activeLane = laneForStatus(
            mission.status,
            mission.blockedFromStatus,
          );
          return (
            <button
              type="button"
              key={mission.id}
              data-mission-id={mission.id}
              onClick={() => onSelect(mission.id)}
              data-selected={selectedMissionId === mission.id}
              className="mission-mobile-record"
            >
              <span className="tabular">{mission.referenceCode}</span>
              <strong>{mission.title}</strong>
              <span className="mission-mobile-lane">
                {laneLabels[activeLane]}
                <ChevronRight aria-hidden="true" />
                <StatusMark status={mission.status} locale={locale} />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MissionGrid({
  locale,
  missions,
  selectedMissionId,
  selectedIds,
  onSelect,
  onToggleSelected,
}: {
  locale: "vi" | "en";
  missions: Mission[];
  selectedMissionId: string | null;
  selectedIds: Set<string>;
  onSelect: (id: string) => void;
  onToggleSelected: (id: string) => void;
}) {
  return (
    <div className="mission-grid">
      <table>
        <thead>
          <tr>
            <th className="w-10">
              <span className="sr-only">
                {ct(locale, "Select", "Chọn")}
              </span>
            </th>
            <th>{ct(locale, "Mission", "Nhiệm vụ")}</th>
            <th>{ct(locale, "State", "Trạng thái")}</th>
            <th>{ct(locale, "Assurance", "Bảo chứng")}</th>
            <th>{ct(locale, "Accountable", "Chịu trách nhiệm")}</th>
            <th>{ct(locale, "Updated", "Cập nhật")}</th>
          </tr>
        </thead>
        <tbody>
          {missions.map((mission) => (
            <tr
              key={mission.id}
              data-selected={selectedMissionId === mission.id}
            >
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.has(mission.id)}
                  onChange={() => onToggleSelected(mission.id)}
                  aria-label={`${ct(locale, "Select", "Chọn")} ${mission.referenceCode}`}
                />
              </td>
              <td>
                <button
                  type="button"
                  data-mission-id={mission.id}
                  onClick={() => onSelect(mission.id)}
                >
                  <span className="tabular">{mission.referenceCode}</span>
                  <strong>{mission.title}</strong>
                </button>
              </td>
              <td><StatusMark status={mission.status} locale={locale} /></td>
              <td className="tabular">{mission.assuranceProfile}</td>
              <td>
                {mission.accountability?.ownerName ??
                  ct(locale, "Unassigned", "Chưa phân công")}
              </td>
              <td className="tabular">
                {formatDate(locale, mission.updatedAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mission-grid-mobile">
        {missions.map((mission) => (
          <article
            key={mission.id}
            data-selected={selectedMissionId === mission.id}
          >
            <label>
              <input
                type="checkbox"
                checked={selectedIds.has(mission.id)}
                onChange={() => onToggleSelected(mission.id)}
              />
              <span className="sr-only">
                {ct(locale, "Select", "Chọn")} {mission.referenceCode}
              </span>
            </label>
            <button
              type="button"
              data-mission-id={mission.id}
              onClick={() => onSelect(mission.id)}
            >
              <span className="tabular">{mission.referenceCode}</span>
              <strong>{mission.title}</strong>
              <span>
                <StatusMark status={mission.status} locale={locale} />
                <small>{mission.assuranceProfile}</small>
              </span>
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

function MissionChronology({
  locale,
  missions,
  selectedMissionId,
  onSelect,
}: {
  locale: "vi" | "en";
  missions: Mission[];
  selectedMissionId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <ol className="mission-chronology">
      {missions.map((mission) => (
        <li key={mission.id} data-selected={selectedMissionId === mission.id}>
          <time className="tabular">{formatDate(locale, mission.updatedAt)}</time>
          <span className="mission-chronology-node" aria-hidden="true" />
          <button
            type="button"
            data-mission-id={mission.id}
            onClick={() => onSelect(mission.id)}
          >
            <span className="tabular">{mission.referenceCode}</span>
            <strong>{mission.title}</strong>
            <StatusMark status={mission.status} locale={locale} />
          </button>
        </li>
      ))}
    </ol>
  );
}

function CommandEmptyState({
  locale,
  basePath,
  canCreate,
  hasActiveQuery,
  onReset,
}: {
  locale: "vi" | "en";
  basePath: string;
  canCreate: boolean;
  hasActiveQuery: boolean;
  onReset: () => void;
}) {
  const laneLabels = lifecycleLaneLabels(locale);

  return (
    <div className="mission-command-empty">
      <div className="mission-empty-datum" aria-hidden="true">
        <span className="mission-empty-origin">
          <Target />
        </span>
        {laneLabels.map((label) => (
          <span key={label} className="mission-empty-lane">
            <small>{label}</small>
            <i />
          </span>
        ))}
      </div>
      <div className="mission-empty-copy">
        <p className="text-eyebrow text-ink-muted">
          {ct(locale, "Bounded mission set · 0 visible", "Tập nhiệm vụ hữu hạn · 0 hiển thị")}
        </p>
        <h3>
          {ct(
            locale,
            "No mission matches this operational view.",
            "Không có nhiệm vụ phù hợp với chế độ vận hành này.",
          )}
        </h3>
        <p>
          {ct(
            locale,
            "The lifecycle remains explicit. Reset this view or define a governed mission to establish the first retained trace.",
            "Vòng đời vẫn được biểu diễn tường minh. Đặt lại chế độ hoặc xác định một nhiệm vụ được quản trị để tạo dấu vết lưu giữ đầu tiên.",
          )}
        </p>
        <div className="mission-empty-actions">
          {hasActiveQuery ? (
            <button type="button" onClick={onReset}>
              <X aria-hidden="true" />
              {ct(locale, "Reset operational view", "Đặt lại chế độ vận hành")}
            </button>
          ) : null}
          {canCreate ? (
            <Link href={`${basePath}/missions/new`}>
              <Plus aria-hidden="true" />
              {ct(locale, "Define mission", "Xác định nhiệm vụ")}
            </Link>
          ) : (
            <span>{ct(locale, "Read-only scope", "Phạm vi chỉ đọc")}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function MissionInspector({
  locale,
  mission,
  inbox,
  basePath,
  commands,
  operatingContext,
  onClose,
  onSelect,
}: {
  locale: "vi" | "en";
  mission: Mission | null;
  inbox: MissionCommandProjection["inbox"];
  basePath: string;
  commands: MissionCommandProjection["commands"];
  operatingContext: {
    viewLabel: string;
    viewVisibility: string;
    visibleCount: number;
    totalCount: number | null;
    workspaceName: string;
    refreshedAt: string | null;
  };
  onClose: () => void;
  onSelect: (id: string) => void;
}) {
  return (
    <aside
      className="mission-inspector"
      aria-label={ct(locale, "Context inspector", "Bảng ngữ cảnh")}
    >
      <div className="mission-inspector-head">
        <div>
          <p className="text-eyebrow text-ink-muted">
            {ct(locale, "Context inspector", "Bảng ngữ cảnh")}
          </p>
          <h3>{mission?.referenceCode ?? ct(locale, "No selection", "Chưa chọn")}</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={ct(locale, "Close inspector", "Đóng bảng ngữ cảnh")}
        >
          <PanelRightClose aria-hidden="true" />
        </button>
      </div>

      {mission ? (
        <>
          <div className="mission-inspector-title">
            <h4>{mission.title}</h4>
            <StatusMark status={mission.status} locale={locale} />
          </div>

          <dl className="mission-inspector-facts">
            <div>
              <dt>{ct(locale, "Authority", "Thẩm quyền")}</dt>
              <dd>{ct(locale, "Mission Kernel", "Mission Kernel")}</dd>
            </div>
            <div>
              <dt>{ct(locale, "Accountable", "Chịu trách nhiệm")}</dt>
              <dd>
                {mission.accountability?.ownerName ??
                  ct(locale, "Explicitly unassigned", "Chưa phân công tường minh")}
              </dd>
            </div>
            <div>
              <dt>{ct(locale, "Assurance", "Bảo chứng")}</dt>
              <dd className="tabular">{mission.assuranceProfile}</dd>
            </div>
            <div>
              <dt>{ct(locale, "Record version", "Phiên bản bản ghi")}</dt>
              <dd className="tabular">v{mission.version}</dd>
            </div>
            <div>
              <dt>{ct(locale, "Approved contract", "Hợp đồng đã duyệt")}</dt>
              <dd className="tabular">
                {mission.approvedContractId
                  ? mission.approvedContractId.slice(0, 8)
                  : ct(locale, "Not available", "Chưa có")}
              </dd>
            </div>
            <div>
              <dt>{ct(locale, "Last retained change", "Thay đổi lưu gần nhất")}</dt>
              <dd className="tabular">
                {formatDate(locale, mission.updatedAt)}
              </dd>
            </div>
          </dl>

          <div className="mission-inspector-actions">
            <p className="text-eyebrow text-ink-muted">
              {ct(locale, "Permitted next actions", "Hành động được phép")}
            </p>
            <Link href={`${basePath}/missions/${mission.id}`}>
              <FileCheck2 aria-hidden="true" />
              {ct(locale, "Open governed dossier", "Mở hồ sơ quản trị")}
            </Link>
            {commands["truth.write"] ? (
              <Link href={`${basePath}/evidence`}>
                <GitBranch aria-hidden="true" />
                {ct(locale, "Preserve evidence", "Lưu giữ bằng chứng")}
              </Link>
            ) : null}
            {commands["verification.operate"] ? (
              <Link href={`${basePath}/verification`}>
                <ShieldCheck aria-hidden="true" />
                {ct(locale, "Open verification", "Mở kiểm chứng")}
              </Link>
            ) : null}
          </div>
        </>
      ) : (
        <div className="mission-inspector-empty">
          <p>
            {ct(
              locale,
              "Select a mission to inspect its governed context. The facts below describe the current bounded surface.",
              "Chọn một nhiệm vụ để xem ngữ cảnh được quản trị. Các dữ kiện dưới đây mô tả mặt phẳng hữu hạn hiện tại.",
            )}
          </p>
          <dl className="mission-inspector-facts">
            <div>
              <dt>{ct(locale, "Active view", "Chế độ hiện tại")}</dt>
              <dd>{operatingContext.viewLabel}</dd>
            </div>
            <div>
              <dt>{ct(locale, "Visibility", "Phạm vi xem")}</dt>
              <dd className="tabular">
                {operatingContext.viewVisibility.toLowerCase()}
              </dd>
            </div>
            <div>
              <dt>{ct(locale, "Visible set", "Tập hiển thị")}</dt>
              <dd className="tabular">
                {operatingContext.visibleCount} /{" "}
                {operatingContext.totalCount ?? "—"}
              </dd>
            </div>
            <div>
              <dt>{ct(locale, "Query bound", "Giới hạn truy vấn")}</dt>
              <dd className="tabular">25</dd>
            </div>
            <div>
              <dt>{ct(locale, "Workspace scope", "Phạm vi không gian")}</dt>
              <dd>{operatingContext.workspaceName}</dd>
            </div>
            <div>
              <dt>{ct(locale, "Projection time", "Thời điểm bản chiếu")}</dt>
              <dd className="tabular">
                {operatingContext.refreshedAt
                  ? formatDate(locale, operatingContext.refreshedAt)
                  : ct(locale, "Unavailable", "Chưa có")}
              </dd>
            </div>
          </dl>
        </div>
      )}

      <div className="mission-work-inbox">
        <div>
          <p className="text-eyebrow text-ink-muted">
            {ct(locale, "My accountable work", "Công việc của tôi")}
          </p>
          <span className="tabular">{inbox.length}</span>
        </div>
        {inbox.length ? (
          <ul>
            {inbox.slice(0, 5).map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(item.missionId);
                    requestAnimationFrame(() => {
                      const target = document.querySelector<HTMLElement>(
                        `[data-mission-id="${item.missionId}"]`,
                      );
                      target?.focus();
                    });
                  }}
                >
                  <span className="tabular">{item.referenceCode}</span>
                  <strong>{item.targetType.replaceAll("_", " ")}</strong>
                  <small>{item.slaState}</small>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>
            {ct(
              locale,
              "No active assignment is attributed to you in this workspace.",
              "Không có phân công đang hoạt động cho bạn trong không gian này.",
            )}
          </p>
        )}
      </div>
    </aside>
  );
}

function CommandPalette({
  locale,
  basePath,
  commands,
  onClose,
}: {
  locale: "vi" | "en";
  basePath: string;
  commands: MissionCommandProjection["commands"];
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const items = [
    {
      label: ct(locale, "Define a new mission", "Xác định nhiệm vụ mới"),
      href: `${basePath}/missions/new`,
      allowed: commands["missions.create"],
      icon: <Plus aria-hidden="true" />,
    },
    {
      label: ct(locale, "Open mission register", "Mở sổ nhiệm vụ"),
      href: `${basePath}/missions`,
      allowed: true,
      icon: <Target aria-hidden="true" />,
    },
    {
      label: ct(locale, "Find governed objects", "Tìm đối tượng được quản trị"),
      href: `${basePath}/control-room?find=1`,
      allowed: true,
      icon: <Search aria-hidden="true" />,
    },
    {
      label: ct(locale, "Preserve evidence", "Lưu giữ bằng chứng"),
      href: `${basePath}/evidence`,
      allowed: commands["truth.write"],
      icon: <GitBranch aria-hidden="true" />,
    },
    {
      label: ct(locale, "Operate execution", "Điều hành thực thi"),
      href: `${basePath}/execution`,
      allowed: commands["execution.operate"],
      icon: <Sparkles aria-hidden="true" />,
    },
    {
      label: ct(locale, "Review verification", "Rà soát kiểm chứng"),
      href: `${basePath}/verification`,
      allowed: commands["verification.operate"],
      icon: <ShieldCheck aria-hidden="true" />,
    },
  ].filter(
    (item) =>
      item.allowed &&
      item.label.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
  );

  useEffect(() => {
    inputRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
      if (event.key !== "Tab") return;
      const nodes = dialogRef.current?.querySelectorAll<HTMLElement>(
        'input, a[href], button:not([disabled])',
      );
      if (!nodes?.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="mission-palette-layer">
      <button
        type="button"
        className="mission-palette-backdrop"
        onClick={onClose}
        aria-label={ct(locale, "Close command palette", "Đóng bảng lệnh")}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={ct(locale, "Command palette", "Bảng lệnh")}
        className="mission-palette"
      >
        <div className="mission-palette-search">
          <Command aria-hidden="true" />
          <label htmlFor="mission-command-search" className="sr-only">
            {ct(locale, "Filter authorized commands", "Lọc lệnh được phép")}
          </label>
          <input
            ref={inputRef}
            id="mission-command-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={ct(
              locale,
              "Filter authorized commands",
              "Lọc lệnh được phép",
            )}
          />
          <button type="button" onClick={onClose} aria-label="Close">
            <X aria-hidden="true" />
          </button>
        </div>
        <div className="mission-palette-meta">
          <span>
            {ct(
              locale,
              "Authorization evaluated on the server",
              "Quyền được đánh giá trên máy chủ",
            )}
          </span>
          <kbd>ESC</kbd>
        </div>
        <nav>
          {items.length ? (
            items.map((item) => (
              <Link key={item.href} href={item.href} onClick={onClose}>
                {item.icon}
                <span>{item.label}</span>
                <ArrowRight aria-hidden="true" />
              </Link>
            ))
          ) : (
            <p>
              {ct(
                locale,
                "No authorized command matches.",
                "Không có lệnh được phép phù hợp.",
              )}
            </p>
          )}
        </nav>
      </div>
    </div>
  );
}
