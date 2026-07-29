"use client";

import {
  Activity,
  Archive,
  Braces,
  CheckCircle2,
  CircleDot,
  ClipboardCheck,
  FileSearch,
  GitBranch,
  Inbox,
  ListChecks,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type RefObject,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { Panel } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { ProvenanceRail } from "@/components/ui/provenance-rail";
import { usePreferences } from "@/components/preferences/preferences-provider";
import type { Locale } from "@/i18n/config";
import { enumLabel } from "@/i18n/format";
import type { ControlRoomProjection } from "@/server/control-room";

type Lens = "architecture" | "operations" | "audit";
type NodeState = "available" | "attention" | "planned";

interface SystemNode {
  id: string;
  code: string;
  title: string;
  description: string;
  authority: string;
  writes: string;
  cannot: string;
  state: NodeState;
  metric: string;
  metricLabel: string;
  icon: ReactNode;
}

interface SystemPlane {
  id: string;
  name: string;
  purpose: string;
  nodes: SystemNode[];
}

function createPlanes(
  counts: ControlRoomProjection["counts"],
  locale: Locale,
): SystemPlane[] {
  return [
    {
      id: "mission",
      name: ct(locale, "Mission", "Nhiệm vụ"),
      purpose: ct(
        locale,
        "Turn intent into an approved, inspectable contract.",
        "Biến ý định thành hợp đồng có thể kiểm tra và phê duyệt.",
      ),
      nodes: [
        {
          id: "mission-intake",
          code: "MSN-00",
          title: ct(locale, "Mission intake", "Tiếp nhận nhiệm vụ"),
          description: ct(
            locale,
            "Captures a bounded objective before governed work begins.",
            "Ghi nhận mục tiêu hữu hạn trước khi công việc được quản trị bắt đầu.",
          ),
          authority: "Mission Kernel",
          writes: ct(
            locale,
            "Mission and initial contract",
            "Nhiệm vụ và hợp đồng ban đầu",
          ),
          cannot: ct(
            locale,
            "Approve its own contract",
            "Tự phê duyệt hợp đồng",
          ),
          state: "available",
          metric: String(counts.missions),
          metricLabel: ct(locale, "missions", "nhiệm vụ"),
          icon: <Inbox aria-hidden="true" />,
        },
        {
          id: "mission-contract",
          code: "MCT-01",
          title: ct(locale, "Mission contracts", "Hợp đồng nhiệm vụ"),
          description: ct(
            locale,
            "Versions scope, success definitions, requirements and assurance.",
            "Quản lý phiên bản phạm vi, định nghĩa thành công, yêu cầu và bảo chứng.",
          ),
          authority: "Mission Kernel",
          writes: ct(
            locale,
            "Immutable approved contract definitions",
            "Định nghĩa hợp đồng đã duyệt bất biến",
          ),
          cannot: ct(
            locale,
            "Change approved content silently",
            "Âm thầm thay đổi nội dung đã duyệt",
          ),
          state: "available",
          metric: String(counts.approvedMissions),
          metricLabel: ct(locale, "approved", "đã duyệt"),
          icon: <ClipboardCheck aria-hidden="true" />,
        },
        {
          id: "mission-obligations",
          code: "OBL-02",
          title: ct(locale, "Obligations", "Nghĩa vụ"),
          description: ct(
            locale,
            "Derives real progress from weighted contract obligations.",
            "Dẫn xuất tiến độ thực từ nghĩa vụ hợp đồng có trọng số.",
          ),
          authority: "Mission Kernel",
          writes: ct(
            locale,
            "Runtime obligation state",
            "Trạng thái nghĩa vụ runtime",
          ),
          cannot: ct(locale, "Invent progress", "Bịa đặt tiến độ"),
          state: "available",
          metric: String(counts.obligations),
          metricLabel: ct(locale, "obligations", "nghĩa vụ"),
          icon: <ListChecks aria-hidden="true" />,
        },
        {
          id: "mission-decisions",
          code: "DEC-03",
          title: ct(locale, "Decisions", "Quyết định"),
          description: ct(
            locale,
            "Records material owner choices and governed exceptions.",
            "Ghi nhận lựa chọn trọng yếu của chủ sở hữu và ngoại lệ được quản trị.",
          ),
          authority: ct(
            locale,
            "Human command through Mission Kernel",
            "Con người ra lệnh qua Mission Kernel",
          ),
          writes: ct(locale, "Decision ledger", "Sổ cái quyết định"),
          cannot: ct(
            locale,
            "Resolve without an authorized actor",
            "Xử lý khi thiếu người có thẩm quyền",
          ),
          state: counts.decisionsRequired > 0 ? "attention" : "available",
          metric: String(counts.decisionsRequired),
          metricLabel: ct(locale, "required", "cần xử lý"),
          icon: <CircleDot aria-hidden="true" />,
        },
      ],
    },
    {
      id: "truth",
      name: ct(locale, "Truth", "Sự thật"),
      purpose: ct(
        locale,
        "Preserve evidence before interpretation and retain every conflict.",
        "Giữ bằng chứng trước diễn giải và lưu mọi xung đột.",
      ),
      nodes: [
        {
          id: "truth-sources",
          code: "SRC-10",
          title: ct(locale, "Evidence sources", "Nguồn bằng chứng"),
          description: ct(
            locale,
            "Identifies source independence and corroboration eligibility.",
            "Xác định tính độc lập và điều kiện đối chứng của nguồn.",
          ),
          authority: "Truth Kernel",
          writes: ct(
            locale,
            "Workspace-scoped source registry",
            "Danh mục nguồn theo workspace",
          ),
          cannot: ct(
            locale,
            "Corroborate by source count alone",
            "Đối chứng chỉ bằng số lượng nguồn",
          ),
          state: "available",
          metric: String(counts.evidenceSources),
          metricLabel: ct(locale, "sources", "nguồn"),
          icon: <FileSearch aria-hidden="true" />,
        },
        {
          id: "truth-snapshots",
          code: "SNP-11",
          title: ct(locale, "Snapshots and spans", "Snapshot và đoạn trích"),
          description: ct(
            locale,
            "Binds exact text spans to immutable captured content.",
            "Gắn đoạn văn chính xác với nội dung thu thập bất biến.",
          ),
          authority: ct(
            locale,
            "Truth Kernel and database triggers",
            "Truth Kernel và trigger cơ sở dữ liệu",
          ),
          writes: ct(
            locale,
            "Append-only snapshot and span ledger",
            "Sổ cái snapshot và đoạn trích chỉ ghi nối tiếp",
          ),
          cannot: ct(
            locale,
            "Rewrite captured evidence",
            "Viết lại bằng chứng đã thu thập",
          ),
          state: "available",
          metric: `${counts.snapshots} · ${counts.evidenceSpans}`,
          metricLabel: ct(locale, "snapshots · spans", "snapshot · đoạn trích"),
          icon: <Archive aria-hidden="true" />,
        },
        {
          id: "truth-claims",
          code: "CLM-12",
          title: ct(locale, "Claims and disputes", "Luận điểm và tranh chấp"),
          description: ct(
            locale,
            "Projects claim state from retained assertion and evidence ledgers.",
            "Chiếu trạng thái luận điểm từ sổ cái khẳng định và bằng chứng được lưu giữ.",
          ),
          authority: ct(
            locale,
            "Deterministic Truth Kernel rules",
            "Quy tắc Truth Kernel tất định",
          ),
          writes: ct(
            locale,
            "Claim versions, disputes and honest-null records",
            "Phiên bản luận điểm, tranh chấp và bản ghi honest-null",
          ),
          cannot: ct(
            locale,
            "Silently choose a winner",
            "Âm thầm chọn bên thắng",
          ),
          state: counts.disputes > 0 ? "attention" : "available",
          metric: `${counts.claims} · ${counts.disputes}`,
          metricLabel: ct(
            locale,
            "claims · disputes",
            "luận điểm · tranh chấp",
          ),
          icon: <Braces aria-hidden="true" />,
        },
        {
          id: "truth-lineage",
          code: "LIN-13",
          title: ct(locale, "Provenance", "Nguồn gốc"),
          description: ct(
            locale,
            "Connects evidence spans to every derived claim version.",
            "Nối đoạn bằng chứng với mọi phiên bản luận điểm dẫn xuất.",
          ),
          authority: ct(
            locale,
            "Append-only provenance ledger",
            "Sổ cái nguồn gốc chỉ ghi nối tiếp",
          ),
          writes: ct(
            locale,
            "Typed lineage edges",
            "Liên kết dòng nguồn gốc có kiểu",
          ),
          cannot: ct(
            locale,
            "Expose restricted fields in public projections",
            "Lộ trường hạn chế trong bản chiếu công khai",
          ),
          state: "available",
          metric: String(counts.provenanceEdges),
          metricLabel: ct(locale, "edges", "liên kết"),
          icon: <GitBranch aria-hidden="true" />,
        },
      ],
    },
    {
      id: "execution",
      name: ct(locale, "Execution", "Thực thi"),
      purpose: ct(
        locale,
        "Carry immutable instructions out and governed reports back in.",
        "Đưa chỉ dẫn bất biến ra ngoài và nhận báo cáo được quản trị trở lại.",
      ),
      nodes: [
        {
          id: "skill-registry",
          code: "SKL-20",
          title: ct(locale, "Skill registry", "Danh mục kỹ năng"),
          description: ct(
            locale,
            "Registers immutable capability contracts and activates versions explicitly.",
            "Đăng ký hợp đồng năng lực bất biến và kích hoạt phiên bản tường minh.",
          ),
          authority: "Deterministic Skill Registry",
          writes: ct(
            locale,
            "Skill versions and the governed active-version pointer",
            "Phiên bản kỹ năng và con trỏ phiên bản hoạt động được quản trị",
          ),
          cannot: ct(
            locale,
            "Execute a skill or mutate Mission and Truth state",
            "Thực thi kỹ năng hoặc sửa trạng thái Mission và Truth",
          ),
          state: "available",
          metric: `${counts.activeSkills} · ${counts.skillVersions}`,
          metricLabel: ct(locale, "active · versions", "hoạt động · phiên bản"),
          icon: <Sparkles aria-hidden="true" />,
        },
        {
          id: "execution-runs",
          code: "RUN-21",
          title: ct(locale, "Manual bridge", "Cầu nối thủ công"),
          description: ct(
            locale,
            "Retains provider-attributed attempts and appends every retry.",
            "Lưu lần thử có quy thuộc nhà cung cấp và ghi nối tiếp mọi lần thử lại.",
          ),
          authority: "Execution Fabric with an authorized human operator",
          writes: ct(
            locale,
            "Skill runs, agent attempts and strict Completion Reports",
            "Lượt kỹ năng, lần thử agent và Báo cáo hoàn thành nghiêm ngặt",
          ),
          cannot: ct(
            locale,
            "Treat a provider claim as independent verification",
            "Coi tuyên bố nhà cung cấp là kiểm chứng độc lập",
          ),
          state:
            counts.awaitingReports > 0 || counts.openExecutionDeviations > 0
              ? "attention"
              : "available",
          metric: `${counts.awaitingReports} · ${counts.completionReports}`,
          metricLabel: ct(locale, "awaiting · reports", "đang chờ · báo cáo"),
          icon: <Activity aria-hidden="true" />,
        },
        {
          id: "execution-artifacts",
          code: "ART-22",
          title: ct(locale, "Execution artifacts", "Artifact thực thi"),
          description: ct(
            locale,
            "SHA-256-addresses instructions and imported reports.",
            "Định địa chỉ SHA-256 cho chỉ dẫn và báo cáo nhập vào.",
          ),
          authority: "Append-only Execution Fabric ledger",
          writes: ct(
            locale,
            "Immutable instruction and report artifacts",
            "Artifact chỉ dẫn và báo cáo bất biến",
          ),
          cannot: ct(
            locale,
            "Overwrite an artifact or a prior run",
            "Ghi đè artifact hoặc lượt chạy trước",
          ),
          state: "available",
          metric: String(counts.executionArtifacts),
          metricLabel: ct(locale, "immutable artifacts", "artifact bất biến"),
          icon: <Archive aria-hidden="true" />,
        },
      ],
    },
    {
      id: "assurance",
      name: ct(locale, "Assurance", "Bảo chứng"),
      purpose: ct(
        locale,
        "Separate technical validity from permission to release.",
        "Tách tính hợp lệ kỹ thuật khỏi quyền phát hành.",
      ),
      nodes: [
        {
          id: "assurance-gates",
          code: "GAT-30",
          title: ct(locale, "Mission gates", "Cổng nhiệm vụ"),
          description: ct(
            locale,
            "Retains PASS, FAIL and INCOMPLETE as distinct results.",
            "Giữ PASS, FAIL và INCOMPLETE là các kết quả riêng biệt.",
          ),
          authority: "Mission Kernel",
          writes: ct(
            locale,
            "Append-only gate runs",
            "Lượt cổng chỉ ghi nối tiếp",
          ),
          cannot: ct(
            locale,
            "Treat INCOMPLETE as PASS",
            "Coi INCOMPLETE là PASS",
          ),
          state: "available",
          metric: `${counts.passedGates} · ${counts.runtimeGates}`,
          metricLabel: ct(locale, "passed · total", "đạt · tổng"),
          icon: <CheckCircle2 aria-hidden="true" />,
        },
        {
          id: "verification",
          code: "VER-31",
          title: ct(locale, "Verification", "Kiểm chứng"),
          description: ct(
            locale,
            "Binds exact coverage, required scenarios, technical health and corruption tests.",
            "Gắn độ phủ chính xác, kịch bản bắt buộc, sức khỏe kỹ thuật và kiểm tra sai hỏng.",
          ),
          authority: "Deterministic Verification Governance Kernel",
          writes: ct(
            locale,
            "Immutable Verify Reports and verifier independence records",
            "Báo cáo kiểm chứng bất biến và hồ sơ độc lập của người kiểm chứng",
          ),
          cannot: ct(
            locale,
            "Convert deferred or incomplete evidence into a pass",
            "Biến bằng chứng hoãn lại hoặc chưa hoàn tất thành đạt",
          ),
          state:
            counts.activeVerificationRuns > 0 ||
            counts.notReadyVerificationReports > 0
              ? "attention"
              : "available",
          metric: `${counts.verificationReports} · ${counts.verificationScenarios}`,
          metricLabel: ct(locale, "reports · scenarios", "báo cáo · kịch bản"),
          icon: <ShieldCheck aria-hidden="true" />,
        },
        {
          id: "release-governance",
          code: "RLS-32",
          title: ct(locale, "Release governance", "Quản trị phát hành"),
          description: ct(
            locale,
            "Freezes exact claims, artifacts, methods, limits and human approvals.",
            "Đóng băng luận điểm, artifact, phương pháp, giới hạn và phê duyệt của con người.",
          ),
          authority: "Verification Governance Kernel and authorized approvers",
          writes: ct(
            locale,
            "Evidence ceilings, sign-offs and immutable release manifests",
            "Trần bằng chứng, phê duyệt và manifest phát hành bất biến",
          ),
          cannot: ct(
            locale,
            "Expose a public projection before governed release",
            "Công khai bản chiếu trước phát hành được quản trị",
          ),
          state: "available",
          metric: `${counts.governedReleases} · ${counts.releaseManifests}`,
          metricLabel: ct(
            locale,
            "releases · manifests",
            "phát hành · manifest",
          ),
          icon: <Network aria-hidden="true" />,
        },
      ],
    },
  ];
}

export function ControlRoom({
  projection,
  basePath,
  initialCommandOpen = false,
  initialCommandQuery = "",
}: {
  projection: ControlRoomProjection;
  basePath: string;
  initialCommandOpen?: boolean;
  initialCommandQuery?: string;
}) {
  const { t, locale } = usePreferences();
  const planes = useMemo(
    () => createPlanes(projection.counts, locale),
    [locale, projection.counts],
  );
  const nodes = useMemo(() => planes.flatMap((plane) => plane.nodes), [planes]);
  const [lens, setLens] = useState<Lens>("architecture");
  const [selectedId, setSelectedId] = useState("mission-contract");
  const [commandOpen, setCommandOpen] = useState(initialCommandOpen);
  const commandTriggerRef = useRef<HTMLButtonElement>(null);
  const selected = nodes.find((node) => node.id === selectedId) ?? nodes[0];
  const activePlane = selectedId.startsWith("mission")
    ? 0
    : selectedId.startsWith("truth")
      ? 1
      : selectedId.startsWith("skill") || selectedId.startsWith("execution")
        ? 2
        : selectedId.startsWith("release")
          ? 4
          : 3;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(true);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <section className="instrument-panel overflow-hidden">
        <div className="flex flex-col gap-6 p-5 min-[900px]:flex-row min-[900px]:items-end min-[900px]:justify-between min-[900px]:p-7">
          <div className="min-w-0">
            <p className="text-eyebrow text-blue-600">{t("control.eyebrow")}</p>
            <h2 className="text-thesis text-ink-strong mt-3 max-w-4xl">
              {t("control.thesis")}
            </h2>
            <p className="text-body text-ink-muted mt-2 max-w-3xl">
              {t("control.hint")}
            </p>
          </div>
          <button
            ref={commandTriggerRef}
            type="button"
            onClick={() => setCommandOpen(true)}
            className="border-line bg-surface text-ink-muted hover:border-line-strong hover:text-ink flex h-10 min-w-0 w-full items-center gap-2 rounded-md border px-3 transition-colors min-[600px]:w-auto"
            aria-haspopup="dialog"
          >
            <Search className="size-4 shrink-0" aria-hidden="true" />
            <span className="text-body min-w-0 flex-1 truncate whitespace-nowrap text-left">
              {t("common.findGovernedObjects")}
            </span>
            <kbd className="text-meta border-line bg-surface-subtle shrink-0 rounded border px-1.5 py-0.5">
              ⌘K
            </kbd>
          </button>
        </div>
        <ProvenanceRail active={activePlane} />
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label={ct(
            locale,
            "Control Room lens",
            "Góc nhìn Phòng điều hành",
          )}
          className="border-line bg-surface inline-flex rounded-md border p-1"
        >
          {(["architecture", "operations", "audit"] as const).map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={lens === item}
              aria-controls={`control-${item}`}
              id={`lens-${item}`}
              onClick={() => setLens(item)}
              onKeyDown={(event) => activateLensFromArrow(event, setLens)}
              className={`text-meta rounded px-3 py-1.5 font-medium capitalize transition-colors ${
                lens === item
                  ? "bg-navy-800 text-white"
                  : "text-ink-muted hover:bg-surface-subtle hover:text-ink"
              }`}
            >
              {t(`control.${item}`)}
            </button>
          ))}
        </div>
        <p className="text-meta text-ink-muted">{t("control.countsNote")}</p>
      </div>

      {lens === "architecture" ? (
        <ArchitectureLens
          planes={planes}
          selected={selected}
          onSelect={setSelectedId}
        />
      ) : null}
      {lens === "operations" ? (
        <OperationsLens projection={projection} basePath={basePath} />
      ) : null}
      {lens === "audit" ? <AuditLens audit={projection.audit} /> : null}

      {commandOpen ? (
        <CommandDialog
          nodes={nodes}
          missions={projection.recentMissions}
          objects={projection.finderObjects}
          basePath={basePath}
          initialQuery={initialCommandQuery}
          onClose={() => setCommandOpen(false)}
          onSelectNode={(id) => {
            setSelectedId(id);
            setLens("architecture");
            setCommandOpen(false);
          }}
          returnFocusRef={commandTriggerRef}
        />
      ) : null}
    </div>
  );
}

function ArchitectureLens({
  planes,
  selected,
  onSelect,
}: {
  planes: SystemPlane[];
  selected: SystemNode;
  onSelect: (id: string) => void;
}) {
  const { locale } = usePreferences();
  return (
    <Panel className="overflow-hidden">
      <div
        id="control-architecture"
        role="tabpanel"
        aria-labelledby="lens-architecture"
        className="grid min-w-0 grid-cols-1 min-[1180px]:grid-cols-[minmax(0,1fr)_340px]"
      >
        <div className="min-w-0 p-4 min-[768px]:p-5">
          <div className="governed-spine space-y-5">
            {planes.map((plane, index) => (
              <section
                key={plane.id}
                className="control-plane grid min-w-0 grid-cols-1 gap-3 pl-7 min-[820px]:grid-cols-[150px_minmax(0,1fr)] min-[820px]:gap-5"
                aria-labelledby={`plane-${plane.id}`}
              >
                <div>
                  <p className="text-meta text-ink-muted tabular">
                    {ct(locale, "PLANE", "LỚP")}{" "}
                    {String(index).padStart(2, "0")}
                  </p>
                  <h3
                    id={`plane-${plane.id}`}
                    className="text-section-title text-ink-strong mt-0.5"
                  >
                    {plane.name}
                  </h3>
                  <p className="text-meta text-ink-muted mt-1">
                    {plane.purpose}
                  </p>
                </div>
                <div className="grid min-w-0 grid-cols-1 gap-2 min-[600px]:grid-cols-2">
                  {plane.nodes.map((node) => (
                    <SystemNodeButton
                      key={node.id}
                      node={node}
                      selected={selected.id === node.id}
                      onSelect={onSelect}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
        <NodeInspector node={selected} />
      </div>
    </Panel>
  );
}

function SystemNodeButton({
  node,
  selected,
  onSelect,
}: {
  node: SystemNode;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(node.id)}
      aria-pressed={selected}
      data-selected={selected}
      className="control-node border-line bg-surface hover:border-line-strong min-w-0 rounded-md border p-3 text-left transition-[border-color,box-shadow,background-color]"
    >
      <span className="flex items-start justify-between gap-2">
        <span className="text-meta text-ink-muted tabular">{node.code}</span>
        <NodeState state={node.state} />
      </span>
      <span className="mt-2 flex items-center gap-2">
        <span className="text-navy-700 [&>svg]:size-4">{node.icon}</span>
        <span className="text-body text-ink-strong font-semibold">
          {node.title}
        </span>
      </span>
      <span className="text-meta text-ink-muted mt-1.5 block">
        {node.description}
      </span>
      <span className="border-line mt-3 flex items-end justify-between gap-2 border-t pt-2">
        <span className="text-meta text-ink-muted">{node.metricLabel}</span>
        <span className="text-body text-ink tabular font-semibold">
          {node.metric}
        </span>
      </span>
    </button>
  );
}

function NodeState({ state }: { state: NodeState }) {
  const { locale } = usePreferences();
  const tone =
    state === "attention"
      ? "warning"
      : state === "planned"
        ? "neutral"
        : "success";
  return (
    <StatusBadge tone={tone}>
      {state === "attention"
        ? ct(locale, "attention", "cần chú ý")
        : state === "planned"
          ? ct(locale, "planned", "dự kiến")
          : ct(locale, "available", "sẵn sàng")}
    </StatusBadge>
  );
}

function NodeInspector({ node }: { node: SystemNode }) {
  const { locale } = usePreferences();
  return (
    <aside
      aria-label={ct(locale, "Context inspector", "Bộ kiểm tra ngữ cảnh")}
      aria-live="polite"
      className="border-line bg-surface-subtle border-t p-5 min-[1180px]:border-t-0 min-[1180px]:border-l"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-eyebrow text-ink-muted">
            {ct(locale, "Context inspector", "Bộ kiểm tra ngữ cảnh")}
          </p>
          <p className="text-meta text-navy-700 tabular mt-4">{node.code}</p>
          <h3 className="text-page-title text-ink-strong mt-1">{node.title}</h3>
        </div>
        <NodeState state={node.state} />
      </div>
      <p className="text-body text-ink-muted mt-3">{node.description}</p>

      <dl className="border-line mt-5 divide-y border-y">
        <InspectorRow
          label={ct(locale, "Authority", "Thẩm quyền")}
          value={node.authority}
        />
        <InspectorRow label={ct(locale, "Writes", "Ghi")} value={node.writes} />
        <InspectorRow
          label={ct(locale, "Cannot", "Không thể")}
          value={node.cannot}
        />
      </dl>

      <div className="border-line bg-surface mt-5 rounded-md border p-4">
        <p className="text-eyebrow text-ink-muted">
          {ct(locale, "Current projection", "Bản chiếu hiện tại")}
        </p>
        <p className="text-ink-strong tabular mt-2 text-2xl font-semibold">
          {node.metric}
        </p>
        <p className="text-meta text-ink-muted mt-1">{node.metricLabel}</p>
      </div>

      {node.state === "planned" ? (
        <p className="text-meta text-ink-muted mt-4">
          {ct(
            locale,
            "This boundary is visible for architectural continuity. It performs no work in the current build.",
            "Ranh giới này được hiển thị để bảo toàn tính liên tục kiến trúc. Nó không thực hiện công việc trong bản dựng hiện tại.",
          )}
        </p>
      ) : null}
    </aside>
  );
}

function InspectorRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[84px_minmax(0,1fr)] gap-3 py-3">
      <dt className="text-meta text-ink-muted">{label}</dt>
      <dd className="text-meta text-ink text-right">{value}</dd>
    </div>
  );
}

function OperationsLens({
  projection,
  basePath,
}: {
  projection: ControlRoomProjection;
  basePath: string;
}) {
  const { locale } = usePreferences();
  const metrics = [
    [ct(locale, "Missions", "Nhiệm vụ"), projection.counts.missions],
    [
      ct(locale, "Exploring", "Đang khảo sát"),
      projection.counts.exploringMissions,
    ],
    [
      ct(locale, "Execution TIPs", "TIP thực thi"),
      projection.counts.executionTips,
    ],
    [
      ct(locale, "Reports waiting", "Báo cáo đang chờ"),
      projection.counts.awaitingReports,
    ],
    [
      ct(locale, "Verify Reports", "Báo cáo kiểm chứng"),
      projection.counts.verificationReports,
    ],
    [
      ct(locale, "Governed releases", "Bản phát hành được quản trị"),
      projection.counts.governedReleases,
    ],
  ] as const;

  return (
    <div
      id="control-operations"
      role="tabpanel"
      aria-labelledby="lens-operations"
      className="grid grid-cols-1 gap-5 min-[1100px]:grid-cols-[minmax(0,1fr)_340px]"
    >
      <div className="min-w-0 space-y-5">
        <section
          className="grid grid-cols-2 gap-3 min-[700px]:grid-cols-3 min-[1180px]:grid-cols-6"
          aria-label={ct(locale, "Operational counts", "Số liệu vận hành")}
        >
          {metrics.map(([label, value]) => (
            <Panel key={label} className="p-4">
              <p className="text-meta text-ink-muted">{label}</p>
              <p className="text-page-title text-ink-strong tabular mt-2">
                {value}
              </p>
            </Panel>
          ))}
        </section>

        <ManualBridgePanel execution={projection.execution} />
        <VerificationPanel
          verification={projection.verification}
          counts={projection.counts}
        />

        <Panel>
          <div className="border-line border-b px-5 py-4">
            <h3 className="text-section-title text-ink-strong">
              {ct(locale, "Recent missions", "Nhiệm vụ gần đây")}
            </h3>
            <p className="text-meta text-ink-muted mt-0.5">
              {ct(
                locale,
                "Ordered by authoritative update time",
                "Sắp theo thời điểm cập nhật có thẩm quyền",
              )}
            </p>
          </div>
          {projection.recentMissions.length === 0 ? (
            <EmptyState
              title={ct(
                locale,
                "No missions in this workspace",
                "Workspace chưa có nhiệm vụ",
              )}
              hint={ct(
                locale,
                "Create a mission from the Dashboard.",
                "Tạo nhiệm vụ từ trang Tổng quan.",
              )}
            />
          ) : (
            <ul>
              {projection.recentMissions.map((mission) => (
                <li
                  key={mission.id}
                  className="border-line flex flex-col gap-2 border-b px-5 py-3 last:border-b-0 min-[620px]:flex-row min-[620px]:items-center min-[620px]:justify-between"
                >
                  <span className="min-w-0">
                    <Link
                      href={`${basePath}/missions/${mission.id}`}
                      className="text-body text-ink-strong block truncate font-semibold hover:underline"
                    >
                      {mission.title}
                    </Link>
                    <span className="text-meta text-ink-muted tabular">
                      {mission.referenceCode} ·{" "}
                      {enumLabel(locale, mission.assuranceProfile)}
                    </span>
                  </span>
                  <span className="flex items-center gap-3">
                    <StatusBadge tone="neutral">
                      {enumLabel(locale, mission.status)}
                    </StatusBadge>
                    <span className="text-meta text-ink-muted tabular">
                      {mission.updatedAt.slice(0, 10)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <Panel className="self-start">
        <div className="border-line border-b px-5 py-4">
          <h3 className="text-section-title text-ink-strong">
            {ct(locale, "Attention signals", "Tín hiệu cần chú ý")}
          </h3>
          <p className="text-meta text-ink-muted mt-0.5">
            {ct(
              locale,
              "Derived from governed unresolved records",
              "Dẫn xuất từ hồ sơ được quản trị chưa xử lý",
            )}
          </p>
        </div>
        {projection.signals.length === 0 ? (
          <EmptyState
            title={ct(
              locale,
              "No unresolved signals",
              "Không có tín hiệu chưa xử lý",
            )}
            hint={ct(
              locale,
              "No decision, dispute, escalation or review is currently due.",
              "Hiện không có quyết định, tranh chấp, chuyển cấp hoặc rà soát đến hạn.",
            )}
          />
        ) : (
          <ul>
            {projection.signals.map((signal) => (
              <li
                key={signal.key}
                className="border-line flex items-center justify-between gap-3 border-b px-5 py-3 last:border-b-0"
              >
                <span className="text-body text-ink">{signal.label}</span>
                <StatusBadge tone={signal.tone}>
                  {String(signal.count)}
                </StatusBadge>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

function VerificationPanel({
  verification,
  counts,
}: {
  verification: ControlRoomProjection["verification"];
  counts: ControlRoomProjection["counts"];
}) {
  const { locale } = usePreferences();
  const sequence = [
    [
      "01",
      ct(locale, "Requirement coverage", "Độ phủ yêu cầu"),
      `${counts.verificationScenarios} ${ct(locale, "governed scenarios", "kịch bản được quản trị")}`,
    ],
    [
      "02",
      ct(locale, "Scenario results", "Kết quả kịch bản"),
      `${counts.verificationReports} ${ct(locale, "immutable reports", "báo cáo bất biến")}`,
    ],
    [
      "03",
      ct(locale, "Technical health", "Sức khỏe kỹ thuật"),
      `${counts.notReadyVerificationReports} ${ct(locale, "not ready", "chưa sẵn sàng")}`,
    ],
    [
      "04",
      ct(locale, "Release ceiling", "Trần phát hành"),
      `${counts.releaseManifests} ${ct(locale, "frozen manifests", "manifest đã đóng băng")}`,
    ],
  ] as const;

  return (
    <Panel className="overflow-hidden">
      <div className="border-line flex flex-col gap-3 border-b px-5 py-4 min-[700px]:flex-row min-[700px]:items-start min-[700px]:justify-between">
        <div>
          <p className="text-eyebrow text-navy-700">
            {ct(
              locale,
              "Independent assurance corridor",
              "Hành lang bảo chứng độc lập",
            )}
          </p>
          <h3 className="text-section-title text-ink-strong mt-1">
            {ct(locale, "Verify before release", "Kiểm chứng trước phát hành")}
          </h3>
          <p className="text-meta text-ink-muted mt-1 max-w-2xl">
            {ct(
              locale,
              "A provider result becomes release-eligible only after exact coverage, independent review, corruption checks and an explicit evidence ceiling.",
              "Kết quả nhà cung cấp chỉ đủ điều kiện phát hành sau độ phủ chính xác, rà soát độc lập, kiểm tra sai hỏng và trần bằng chứng tường minh.",
            )}
          </p>
        </div>
        <StatusBadge
          tone={
            counts.activeVerificationRuns > 0 ||
            counts.notReadyVerificationReports > 0
              ? "warning"
              : "success"
          }
        >
          {ct(locale, "governed", "được quản trị")}
        </StatusBadge>
      </div>

      <ol
        aria-label={ct(
          locale,
          "Verification governance sequence",
          "Trình tự quản trị kiểm chứng",
        )}
        className="border-line bg-surface-subtle grid grid-cols-1 border-b min-[720px]:grid-cols-4"
      >
        {sequence.map(([code, label, detail], index) => (
          <li
            key={code}
            className={`relative px-5 py-4 ${
              index > 0
                ? "border-line border-t min-[720px]:border-t-0 min-[720px]:border-l"
                : ""
            }`}
          >
            <p className="text-meta text-navy-700 tabular">{code}</p>
            <p className="text-body text-ink-strong mt-1 font-semibold">
              {label}
            </p>
            <p className="text-meta text-ink-muted mt-0.5">{detail}</p>
          </li>
        ))}
      </ol>

      <section aria-labelledby="recent-verify-reports">
        <div className="border-line border-b px-5 py-3">
          <h4
            id="recent-verify-reports"
            className="text-body text-ink-strong font-semibold"
          >
            {ct(locale, "Recent Verify Reports", "Báo cáo kiểm chứng gần đây")}
          </h4>
        </div>
        {verification.recentReports.length === 0 ? (
          <EmptyState
            title={ct(
              locale,
              "No Verify Reports yet",
              "Chưa có Báo cáo kiểm chứng",
            )}
            hint={ct(
              locale,
              "Reports appear only after a governed verifier run is completed.",
              "Báo cáo chỉ xuất hiện sau khi hoàn tất lượt kiểm chứng được quản trị.",
            )}
          />
        ) : (
          <ul>
            {verification.recentReports.map((report) => (
              <li
                key={report.id}
                className="border-line grid grid-cols-1 gap-2 border-b px-5 py-3 last:border-b-0 min-[760px]:grid-cols-[minmax(0,1fr)_auto] min-[760px]:items-center"
              >
                <span className="min-w-0">
                  <span className="text-body text-ink-strong block truncate font-semibold">
                    {report.missionTitle}
                  </span>
                  <span className="text-meta text-ink-muted tabular block">
                    {report.missionReferenceCode} ·{" "}
                    {enumLabel(locale, report.independenceStatus)}
                    {" · "}
                    {report.contentHash.slice(0, 12)}
                  </span>
                </span>
                <span className="flex flex-wrap items-center gap-2">
                  <StatusBadge
                    tone={
                      report.overallStatus === "NOT_READY"
                        ? "danger"
                        : report.overallStatus === "READY_WITH_DEFERRED"
                          ? "warning"
                          : "success"
                    }
                  >
                    {enumLabel(locale, report.overallStatus)}
                  </StatusBadge>
                  <StatusBadge
                    tone={
                      report.corruptionResults.every(
                        (result) => result === "PASS",
                      )
                        ? "success"
                        : "warning"
                    }
                  >
                    {report.corruptionResults.length}{" "}
                    {ct(locale, "corruption", "kiểm tra sai hỏng")}
                  </StatusBadge>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Panel>
  );
}

function ManualBridgePanel({
  execution,
}: {
  execution: ControlRoomProjection["execution"];
}) {
  const { locale } = usePreferences();
  return (
    <Panel className="overflow-hidden">
      <div className="border-line flex flex-col gap-3 border-b px-5 py-4 min-[700px]:flex-row min-[700px]:items-start min-[700px]:justify-between">
        <div>
          <p className="text-eyebrow text-navy-700">
            {ct(locale, "Execution handoff", "Bàn giao thực thi")}
          </p>
          <h3 className="text-section-title text-ink-strong mt-1">
            Manual Provider Bridge
          </h3>
          <p className="text-meta text-ink-muted mt-1 max-w-2xl">
            {execution.disclaimer}
          </p>
        </div>
        <StatusBadge tone="success">
          {execution.mode.toLowerCase().replace("_", " ")}
        </StatusBadge>
      </div>

      <div
        aria-label={ct(
          locale,
          "Manual Bridge sequence",
          "Trình tự Manual Bridge",
        )}
        className="border-line bg-surface-subtle grid grid-cols-1 border-b min-[720px]:grid-cols-[1fr_auto_1fr_auto_1fr]"
      >
        <BridgeStep
          code="01"
          label={ct(locale, "Instruction", "Chỉ dẫn")}
          detail={ct(
            locale,
            "Immutable SHA-256 artifact",
            "Artifact SHA-256 bất biến",
          )}
        />
        <BridgeArrow />
        <BridgeStep
          code="02"
          label={ct(locale, "External operator", "Người vận hành bên ngoài")}
          detail={ct(
            locale,
            "Provider and model attributed",
            "Có quy thuộc nhà cung cấp và mô hình",
          )}
        />
        <BridgeArrow />
        <BridgeStep
          code="03"
          label={ct(locale, "Completion Report", "Báo cáo hoàn thành")}
          detail={ct(
            locale,
            "Strict schema import",
            "Nhập theo schema nghiêm ngặt",
          )}
        />
      </div>

      <div className="grid grid-cols-1 min-[900px]:grid-cols-[minmax(0,1fr)_320px]">
        <section aria-labelledby="recent-execution-tips">
          <div className="border-line border-b px-5 py-3">
            <h4
              id="recent-execution-tips"
              className="text-body text-ink-strong font-semibold"
            >
              {ct(locale, "Recent execution TIPs", "TIP thực thi gần đây")}
            </h4>
          </div>
          {execution.recentTips.length === 0 ? (
            <EmptyState
              title={ct(
                locale,
                "No execution TIPs yet",
                "Chưa có TIP thực thi",
              )}
              hint={ct(
                locale,
                "Execution starts only after a Mission enters exploration.",
                "Thực thi chỉ bắt đầu sau khi nhiệm vụ vào giai đoạn khảo sát.",
              )}
            />
          ) : (
            <ul>
              {execution.recentTips.map((tip) => (
                <li
                  key={tip.id}
                  className="border-line flex flex-col gap-2 border-b px-5 py-3 last:border-b-0 min-[620px]:flex-row min-[620px]:items-center min-[620px]:justify-between"
                >
                  <span className="min-w-0">
                    <span className="text-body text-ink-strong block truncate font-semibold">
                      {tip.title}
                    </span>
                    <span className="text-meta text-ink-muted tabular">
                      {tip.missionReferenceCode} · {tip.code}
                      {tip.latestAttempt
                        ? ` · ${ct(locale, "attempt", "lần thử")} ${tip.latestAttempt} · ${enumLabel(locale, tip.latestRole ?? "")}`
                        : ` · ${ct(locale, "not issued", "chưa phát hành")}`}
                    </span>
                  </span>
                  <StatusBadge
                    tone={
                      tip.status === "BLOCKED" ||
                      tip.status === "BLOCKED_DEVIATION"
                        ? "danger"
                        : tip.status === "IN_PROGRESS" ||
                            tip.status === "PARTIAL"
                          ? "warning"
                          : "neutral"
                    }
                  >
                    {enumLabel(locale, tip.status)}
                  </StatusBadge>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section
          aria-labelledby="execution-deviations"
          className="border-line border-t min-[900px]:border-t-0 min-[900px]:border-l"
        >
          <div className="border-line border-b px-5 py-3">
            <h4
              id="execution-deviations"
              className="text-body text-ink-strong font-semibold"
            >
              {ct(locale, "Deviation gate", "Cổng sai lệch")}
            </h4>
          </div>
          {execution.openDeviations.length === 0 ? (
            <EmptyState
              title={ct(
                locale,
                "No open deviations",
                "Không có sai lệch đang mở",
              )}
              hint={ct(
                locale,
                "Dependent TIPs are not deviation-blocked.",
                "TIP phụ thuộc không bị chặn bởi sai lệch.",
              )}
            />
          ) : (
            <ul>
              {execution.openDeviations.map((deviation) => (
                <li
                  key={deviation.id}
                  className="border-line border-b px-5 py-3 last:border-b-0"
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="text-body text-ink-strong font-semibold">
                      {deviation.title}
                    </span>
                    <StatusBadge
                      tone={
                        deviation.materiality === "MATERIAL"
                          ? "danger"
                          : "warning"
                      }
                    >
                      {enumLabel(locale, deviation.materiality)}
                    </StatusBadge>
                  </span>
                  <span className="text-meta text-ink-muted tabular mt-1 block">
                    {deviation.tipCode} · {deviation.code}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Panel>
  );
}

function BridgeStep({
  code,
  label,
  detail,
}: {
  code: string;
  label: string;
  detail: string;
}) {
  return (
    <div className="px-5 py-4">
      <p className="text-meta text-navy-700 tabular">{code}</p>
      <p className="text-body text-ink-strong mt-1 font-semibold">{label}</p>
      <p className="text-meta text-ink-muted mt-0.5">{detail}</p>
    </div>
  );
}

function BridgeArrow() {
  return (
    <div
      aria-hidden="true"
      className="border-line text-navy-700 hidden items-center border-x px-2 text-lg min-[720px]:flex"
    >
      →
    </div>
  );
}

function AuditLens({ audit }: { audit: ControlRoomProjection["audit"] }) {
  const { locale } = usePreferences();
  return (
    <Panel
      id="control-audit"
      role="tabpanel"
      aria-labelledby="lens-audit"
      className="overflow-hidden"
    >
      <div className="border-line border-b px-5 py-4">
        <h3 className="text-section-title text-ink-strong">
          {ct(locale, "Governed event ledger", "Sổ cái sự kiện được quản trị")}
        </h3>
        <p className="text-meta text-ink-muted mt-0.5">
          {ct(
            locale,
            "Recent immutable events visible to your role",
            "Sự kiện bất biến gần đây mà vai trò của bạn được phép xem",
          )}
        </p>
      </div>
      {!audit.allowed ? (
        <EmptyState
          title={ct(
            locale,
            "Audit access is restricted",
            "Quyền truy cập kiểm toán bị hạn chế",
          )}
          hint={ct(
            locale,
            "Only workspace owners and administrators can read the audit ledger.",
            "Chỉ chủ sở hữu và quản trị viên workspace có thể đọc sổ cái kiểm toán.",
          )}
        />
      ) : audit.events.length === 0 ? (
        <EmptyState
          title={ct(
            locale,
            "No governed events recorded",
            "Chưa ghi nhận sự kiện được quản trị",
          )}
        />
      ) : (
        <ul>
          {audit.events.map((event) => (
            <li
              key={event.id}
              className="border-line grid grid-cols-1 gap-1 border-b px-5 py-3 last:border-b-0 min-[700px]:grid-cols-[minmax(0,1fr)_180px_110px] min-[700px]:items-center min-[700px]:gap-4"
            >
              <span className="min-w-0">
                <span className="text-body text-ink block font-medium">
                  {enumLabel(locale, event.eventType)}
                </span>
                <span className="text-meta text-ink-muted tabular block truncate">
                  {event.entityType} · {event.entityId}
                </span>
              </span>
              <span className="text-meta text-ink-muted">
                {event.eventType}
              </span>
              <time
                className="text-meta text-ink-muted tabular"
                dateTime={event.createdAt}
              >
                {event.createdAt.slice(0, 10)}
              </time>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

function CommandDialog({
  nodes,
  missions,
  objects,
  basePath,
  initialQuery,
  onClose,
  onSelectNode,
  returnFocusRef,
}: {
  nodes: SystemNode[];
  missions: ControlRoomProjection["recentMissions"];
  objects: ControlRoomProjection["finderObjects"];
  basePath: string;
  initialQuery: string;
  onClose: () => void;
  onSelectNode: (id: string) => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
}) {
  const { locale } = usePreferences();
  const [query, setQuery] = useState(initialQuery);
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const normalized = query.trim().toLowerCase();
  const filteredNodes = nodes.filter((node) =>
    `${node.code} ${node.title} ${node.description}`
      .toLowerCase()
      .includes(normalized),
  );
  const filteredMissions = missions.filter((mission) =>
    `${mission.referenceCode} ${mission.title}`
      .toLowerCase()
      .includes(normalized),
  );
  const filteredObjects = objects.filter((object) =>
    `${object.kind} ${object.code} ${object.title} ${object.description} ${object.status}`
      .toLowerCase()
      .includes(normalized),
  );

  useEffect(() => {
    inputRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
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

  useEffect(
    () => () => {
      returnFocusRef.current?.focus();
    },
    [returnFocusRef],
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[10vh]">
      <button
        type="button"
        className="absolute inset-0 bg-navy-900/25"
        onClick={onClose}
        aria-label={ct(
          locale,
          "Close object finder",
          "Đóng trình tìm đối tượng",
        )}
        tabIndex={-1}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={ct(
          locale,
          "Find governed objects",
          "Tìm đối tượng được quản trị",
        )}
        className="border-line bg-surface relative z-10 flex max-h-[75vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border shadow-panel"
      >
        <div className="border-line flex min-w-0 items-center gap-3 border-b px-4">
          <Search
            className="text-ink-muted size-5 shrink-0"
            aria-hidden="true"
          />
          <label htmlFor="control-search" className="sr-only">
            {ct(locale, "Find governed objects", "Tìm đối tượng được quản trị")}
          </label>
          <div className="relative h-14 min-w-0 flex-1">
            <input
              ref={inputRef}
              id="control-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="text-body text-ink h-full w-full min-w-0 whitespace-nowrap bg-transparent outline-none"
            />
            {query.length === 0 ? (
              <span
                aria-hidden="true"
                className="text-body text-ink-faint pointer-events-none absolute inset-0 flex min-w-0 items-center"
              >
                <span
                  data-testid="control-search-placeholder"
                  className="block min-w-0 truncate whitespace-nowrap"
                >
                  {ct(
                    locale,
                    "Search modules, missions or governed records",
                    "Tìm mô-đun, nhiệm vụ hoặc hồ sơ được quản trị",
                  )}
                </span>
              </span>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={ct(
              locale,
              "Close object finder",
              "Đóng trình tìm đối tượng",
            )}
            className="text-ink-muted hover:bg-surface-subtle flex size-9 shrink-0 items-center justify-center rounded-md"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        <div className="overflow-y-auto p-2">
          {filteredNodes.length === 0 &&
          filteredMissions.length === 0 &&
          filteredObjects.length === 0 ? (
            <EmptyState
              title={ct(
                locale,
                "No matching governed objects",
                "Không có đối tượng phù hợp",
              )}
            />
          ) : (
            <>
              {filteredNodes.length > 0 ? (
                <SearchGroup
                  title={ct(locale, "System map", "Bản đồ hệ thống")}
                >
                  {filteredNodes.map((node) => (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => onSelectNode(node.id)}
                      className="hover:bg-surface-subtle flex w-full items-center gap-3 rounded-md px-3 py-2 text-left"
                    >
                      <span className="text-navy-700 [&>svg]:size-4">
                        {node.icon}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="text-body text-ink block font-medium">
                          {node.title}
                        </span>
                        <span className="text-meta text-ink-muted tabular">
                          {node.code}
                        </span>
                      </span>
                      <NodeState state={node.state} />
                    </button>
                  ))}
                </SearchGroup>
              ) : null}
              {filteredMissions.length > 0 ? (
                <SearchGroup
                  title={ct(locale, "Recent missions", "Nhiệm vụ gần đây")}
                >
                  {filteredMissions.map((mission) => (
                    <Link
                      key={mission.id}
                      href={`${basePath}/missions/${mission.id}`}
                      onClick={onClose}
                      className="hover:bg-surface-subtle flex items-center gap-3 rounded-md px-3 py-2"
                    >
                      <CircleDot
                        className="text-navy-700 size-4"
                        aria-hidden="true"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="text-body text-ink block truncate font-medium">
                          {mission.title}
                        </span>
                        <span className="text-meta text-ink-muted tabular">
                          {mission.referenceCode}
                        </span>
                      </span>
                    </Link>
                  ))}
                </SearchGroup>
              ) : null}
              {filteredObjects.length > 0 ? (
                <SearchGroup
                  title={ct(locale, "Governed records", "Hồ sơ được quản trị")}
                >
                  {filteredObjects.map((object) => (
                    <Link
                      key={`${object.kind}-${object.id}`}
                      href={`${basePath}/${object.href}`}
                      onClick={onClose}
                      className="hover:bg-surface-subtle flex items-center gap-3 rounded-md px-3 py-2"
                    >
                      <CircleDot
                        className="text-navy-700 size-4 shrink-0"
                        aria-hidden="true"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="text-body text-ink block truncate font-medium">
                          {object.title}
                        </span>
                        <span className="text-meta text-ink-muted tabular block truncate">
                          {enumLabel(locale, object.kind)} · {object.code} ·{" "}
                          {enumLabel(locale, object.status)}
                        </span>
                      </span>
                    </Link>
                  ))}
                </SearchGroup>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SearchGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-2 last:mb-0">
      <h3 className="text-eyebrow text-ink-muted px-3 py-2">{title}</h3>
      {children}
    </section>
  );
}

function ct(locale: Locale, en: string, vi: string): string {
  return locale === "vi" ? vi : en;
}

// Keeps tab activation keyboard-operable when focus is moved with arrow keys.
export function activateLensFromArrow(
  event: ReactKeyboardEvent<HTMLButtonElement>,
  setLens: (lens: Lens) => void,
) {
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
  const order: Lens[] = ["architecture", "operations", "audit"];
  const current = order.indexOf(
    event.currentTarget.id.replace("lens-", "") as Lens,
  );
  const delta = event.key === "ArrowRight" ? 1 : -1;
  const next = (current + delta + order.length) % order.length;
  event.preventDefault();
  setLens(order[next]);
  const tabs =
    event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
      '[role="tab"]',
    );
  tabs?.[next]?.focus();
}
