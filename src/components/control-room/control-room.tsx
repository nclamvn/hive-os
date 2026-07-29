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

function createPlanes(counts: ControlRoomProjection["counts"]): SystemPlane[] {
  return [
    {
      id: "mission",
      name: "Mission",
      purpose: "Turn intent into an approved, inspectable contract.",
      nodes: [
        {
          id: "mission-intake",
          code: "MSN-00",
          title: "Mission intake",
          description:
            "Captures a bounded objective before governed work begins.",
          authority: "Mission Kernel",
          writes: "Mission and initial contract",
          cannot: "Approve its own contract",
          state: "available",
          metric: String(counts.missions),
          metricLabel: "missions",
          icon: <Inbox aria-hidden="true" />,
        },
        {
          id: "mission-contract",
          code: "MCT-01",
          title: "Mission contracts",
          description:
            "Versions scope, success definitions, requirements and assurance.",
          authority: "Mission Kernel",
          writes: "Immutable approved contract definitions",
          cannot: "Change approved content silently",
          state: "available",
          metric: String(counts.approvedMissions),
          metricLabel: "approved",
          icon: <ClipboardCheck aria-hidden="true" />,
        },
        {
          id: "mission-obligations",
          code: "OBL-02",
          title: "Obligations",
          description:
            "Derives real progress from weighted contract obligations.",
          authority: "Mission Kernel",
          writes: "Runtime obligation state",
          cannot: "Invent progress",
          state: "available",
          metric: String(counts.obligations),
          metricLabel: "obligations",
          icon: <ListChecks aria-hidden="true" />,
        },
        {
          id: "mission-decisions",
          code: "DEC-03",
          title: "Decisions",
          description:
            "Records material owner choices and governed exceptions.",
          authority: "Human command through Mission Kernel",
          writes: "Decision ledger",
          cannot: "Resolve without an authorized actor",
          state: counts.decisionsRequired > 0 ? "attention" : "available",
          metric: String(counts.decisionsRequired),
          metricLabel: "required",
          icon: <CircleDot aria-hidden="true" />,
        },
      ],
    },
    {
      id: "truth",
      name: "Truth",
      purpose:
        "Preserve evidence before interpretation and retain every conflict.",
      nodes: [
        {
          id: "truth-sources",
          code: "SRC-10",
          title: "Evidence sources",
          description:
            "Identifies source independence and corroboration eligibility.",
          authority: "Truth Kernel",
          writes: "Workspace-scoped source registry",
          cannot: "Corroborate by source count alone",
          state: "available",
          metric: String(counts.evidenceSources),
          metricLabel: "sources",
          icon: <FileSearch aria-hidden="true" />,
        },
        {
          id: "truth-snapshots",
          code: "SNP-11",
          title: "Snapshots and spans",
          description: "Binds exact text spans to immutable captured content.",
          authority: "Truth Kernel and database triggers",
          writes: "Append-only snapshot and span ledger",
          cannot: "Rewrite captured evidence",
          state: "available",
          metric: `${counts.snapshots} · ${counts.evidenceSpans}`,
          metricLabel: "snapshots · spans",
          icon: <Archive aria-hidden="true" />,
        },
        {
          id: "truth-claims",
          code: "CLM-12",
          title: "Claims and disputes",
          description:
            "Projects claim state from retained assertion and evidence ledgers.",
          authority: "Deterministic Truth Kernel rules",
          writes: "Claim versions, disputes and honest-null records",
          cannot: "Silently choose a winner",
          state: counts.disputes > 0 ? "attention" : "available",
          metric: `${counts.claims} · ${counts.disputes}`,
          metricLabel: "claims · disputes",
          icon: <Braces aria-hidden="true" />,
        },
        {
          id: "truth-lineage",
          code: "LIN-13",
          title: "Provenance",
          description:
            "Connects evidence spans to every derived claim version.",
          authority: "Append-only provenance ledger",
          writes: "Typed lineage edges",
          cannot: "Expose restricted fields in public projections",
          state: "available",
          metric: String(counts.provenanceEdges),
          metricLabel: "edges",
          icon: <GitBranch aria-hidden="true" />,
        },
      ],
    },
    {
      id: "execution",
      name: "Execution",
      purpose: "Carry immutable instructions out and governed reports back in.",
      nodes: [
        {
          id: "skill-registry",
          code: "SKL-20",
          title: "Skill registry",
          description:
            "Registers immutable capability contracts and activates versions explicitly.",
          authority: "Deterministic Skill Registry",
          writes: "Skill versions and the governed active-version pointer",
          cannot: "Execute a skill or mutate Mission and Truth state",
          state: "available",
          metric: `${counts.activeSkills} · ${counts.skillVersions}`,
          metricLabel: "active · versions",
          icon: <Sparkles aria-hidden="true" />,
        },
        {
          id: "execution-runs",
          code: "RUN-21",
          title: "Manual bridge",
          description:
            "Retains provider-attributed attempts and appends every retry.",
          authority: "Execution Fabric with an authorized human operator",
          writes: "Skill runs, agent attempts and strict Completion Reports",
          cannot: "Treat a provider claim as independent verification",
          state:
            counts.awaitingReports > 0 || counts.openExecutionDeviations > 0
              ? "attention"
              : "available",
          metric: `${counts.awaitingReports} · ${counts.completionReports}`,
          metricLabel: "awaiting · reports",
          icon: <Activity aria-hidden="true" />,
        },
        {
          id: "execution-artifacts",
          code: "ART-22",
          title: "Execution artifacts",
          description: "SHA-256-addresses instructions and imported reports.",
          authority: "Append-only Execution Fabric ledger",
          writes: "Immutable instruction and report artifacts",
          cannot: "Overwrite an artifact or a prior run",
          state: "available",
          metric: String(counts.executionArtifacts),
          metricLabel: "immutable artifacts",
          icon: <Archive aria-hidden="true" />,
        },
      ],
    },
    {
      id: "assurance",
      name: "Assurance",
      purpose: "Separate technical validity from permission to release.",
      nodes: [
        {
          id: "assurance-gates",
          code: "GAT-30",
          title: "Mission gates",
          description: "Retains PASS, FAIL and INCOMPLETE as distinct results.",
          authority: "Mission Kernel",
          writes: "Append-only gate runs",
          cannot: "Treat INCOMPLETE as PASS",
          state: "available",
          metric: `${counts.passedGates} · ${counts.runtimeGates}`,
          metricLabel: "passed · total",
          icon: <CheckCircle2 aria-hidden="true" />,
        },
        {
          id: "verification",
          code: "VER-31",
          title: "Verification",
          description:
            "Binds exact coverage, required scenarios, technical health and corruption tests.",
          authority: "Deterministic Verification Governance Kernel",
          writes: "Immutable Verify Reports and verifier independence records",
          cannot: "Convert deferred or incomplete evidence into a pass",
          state:
            counts.activeVerificationRuns > 0 ||
            counts.notReadyVerificationReports > 0
              ? "attention"
              : "available",
          metric: `${counts.verificationReports} · ${counts.verificationScenarios}`,
          metricLabel: "reports · scenarios",
          icon: <ShieldCheck aria-hidden="true" />,
        },
        {
          id: "release-governance",
          code: "RLS-32",
          title: "Release governance",
          description:
            "Freezes exact claims, artifacts, methods, limits and human approvals.",
          authority: "Verification Governance Kernel and authorized approvers",
          writes:
            "Evidence ceilings, sign-offs and immutable release manifests",
          cannot: "Expose a public projection before governed release",
          state: "available",
          metric: `${counts.governedReleases} · ${counts.releaseManifests}`,
          metricLabel: "releases · manifests",
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
}: {
  projection: ControlRoomProjection;
  basePath: string;
  initialCommandOpen?: boolean;
}) {
  const { t } = usePreferences();
  const planes = useMemo(
    () => createPlanes(projection.counts),
    [projection.counts],
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
          aria-label="Control Room lens"
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
                    PLANE {String(index).padStart(2, "0")}
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
  const tone =
    state === "attention"
      ? "warning"
      : state === "planned"
        ? "neutral"
        : "success";
  return <StatusBadge tone={tone}>{state}</StatusBadge>;
}

function NodeInspector({ node }: { node: SystemNode }) {
  return (
    <aside
      aria-label="Context inspector"
      aria-live="polite"
      className="border-line bg-surface-subtle border-t p-5 min-[1180px]:border-t-0 min-[1180px]:border-l"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-eyebrow text-ink-muted">Context inspector</p>
          <p className="text-meta text-navy-700 tabular mt-4">{node.code}</p>
          <h3 className="text-page-title text-ink-strong mt-1">{node.title}</h3>
        </div>
        <NodeState state={node.state} />
      </div>
      <p className="text-body text-ink-muted mt-3">{node.description}</p>

      <dl className="border-line mt-5 divide-y border-y">
        <InspectorRow label="Authority" value={node.authority} />
        <InspectorRow label="Writes" value={node.writes} />
        <InspectorRow label="Cannot" value={node.cannot} />
      </dl>

      <div className="border-line bg-surface mt-5 rounded-md border p-4">
        <p className="text-eyebrow text-ink-muted">Current projection</p>
        <p className="text-ink-strong tabular mt-2 text-2xl font-semibold">
          {node.metric}
        </p>
        <p className="text-meta text-ink-muted mt-1">{node.metricLabel}</p>
      </div>

      {node.state === "planned" ? (
        <p className="text-meta text-ink-muted mt-4">
          This boundary is visible for architectural continuity. It performs no
          work in the current build.
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
  const metrics = [
    ["Missions", projection.counts.missions],
    ["Exploring", projection.counts.exploringMissions],
    ["Execution TIPs", projection.counts.executionTips],
    ["Reports waiting", projection.counts.awaitingReports],
    ["Verify Reports", projection.counts.verificationReports],
    ["Governed releases", projection.counts.governedReleases],
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
          aria-label="Operational counts"
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
              Recent missions
            </h3>
            <p className="text-meta text-ink-muted mt-0.5">
              Ordered by authoritative update time
            </p>
          </div>
          {projection.recentMissions.length === 0 ? (
            <EmptyState
              title="No missions in this workspace"
              hint="Create a mission from the Dashboard."
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
                      {mission.assuranceProfile.toLowerCase()}
                    </span>
                  </span>
                  <span className="flex items-center gap-3">
                    <StatusBadge tone="neutral">
                      {mission.status.toLowerCase()}
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
            Attention signals
          </h3>
          <p className="text-meta text-ink-muted mt-0.5">
            Derived from governed unresolved records
          </p>
        </div>
        {projection.signals.length === 0 ? (
          <EmptyState
            title="No unresolved signals"
            hint="No decision, dispute, escalation or review is currently due."
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
  const sequence = [
    [
      "01",
      "Requirement coverage",
      `${counts.verificationScenarios} governed scenarios`,
    ],
    [
      "02",
      "Scenario results",
      `${counts.verificationReports} immutable reports`,
    ],
    [
      "03",
      "Technical health",
      `${counts.notReadyVerificationReports} not ready`,
    ],
    ["04", "Release ceiling", `${counts.releaseManifests} frozen manifests`],
  ] as const;

  return (
    <Panel className="overflow-hidden">
      <div className="border-line flex flex-col gap-3 border-b px-5 py-4 min-[700px]:flex-row min-[700px]:items-start min-[700px]:justify-between">
        <div>
          <p className="text-eyebrow text-navy-700">
            Independent assurance corridor
          </p>
          <h3 className="text-section-title text-ink-strong mt-1">
            Verify before release
          </h3>
          <p className="text-meta text-ink-muted mt-1 max-w-2xl">
            A provider result becomes release-eligible only after exact
            coverage, independent review, corruption checks and an explicit
            evidence ceiling.
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
          governed
        </StatusBadge>
      </div>

      <ol
        aria-label="Verification governance sequence"
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
            Recent Verify Reports
          </h4>
        </div>
        {verification.recentReports.length === 0 ? (
          <EmptyState
            title="No Verify Reports yet"
            hint="Reports appear only after a governed verifier run is completed."
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
                    {report.independenceStatus
                      .toLowerCase()
                      .replaceAll("_", " ")}
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
                    {report.overallStatus.toLowerCase().replaceAll("_", " ")}
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
                    {report.corruptionResults.length} corruption
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
  return (
    <Panel className="overflow-hidden">
      <div className="border-line flex flex-col gap-3 border-b px-5 py-4 min-[700px]:flex-row min-[700px]:items-start min-[700px]:justify-between">
        <div>
          <p className="text-eyebrow text-navy-700">Execution handoff</p>
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
        aria-label="Manual Bridge sequence"
        className="border-line bg-surface-subtle grid grid-cols-1 border-b min-[720px]:grid-cols-[1fr_auto_1fr_auto_1fr]"
      >
        <BridgeStep
          code="01"
          label="Instruction"
          detail="Immutable SHA-256 artifact"
        />
        <BridgeArrow />
        <BridgeStep
          code="02"
          label="External operator"
          detail="Provider and model attributed"
        />
        <BridgeArrow />
        <BridgeStep
          code="03"
          label="Completion Report"
          detail="Strict schema import"
        />
      </div>

      <div className="grid grid-cols-1 min-[900px]:grid-cols-[minmax(0,1fr)_320px]">
        <section aria-labelledby="recent-execution-tips">
          <div className="border-line border-b px-5 py-3">
            <h4
              id="recent-execution-tips"
              className="text-body text-ink-strong font-semibold"
            >
              Recent execution TIPs
            </h4>
          </div>
          {execution.recentTips.length === 0 ? (
            <EmptyState
              title="No execution TIPs yet"
              hint="Execution starts only after a Mission enters exploration."
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
                        ? ` · attempt ${tip.latestAttempt} · ${tip.latestRole?.toLowerCase()}`
                        : " · not issued"}
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
                    {tip.status.toLowerCase().replace("_", " ")}
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
              Deviation gate
            </h4>
          </div>
          {execution.openDeviations.length === 0 ? (
            <EmptyState
              title="No open deviations"
              hint="Dependent TIPs are not deviation-blocked."
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
                      {deviation.materiality.toLowerCase()}
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
  return (
    <Panel
      id="control-audit"
      role="tabpanel"
      aria-labelledby="lens-audit"
      className="overflow-hidden"
    >
      <div className="border-line border-b px-5 py-4">
        <h3 className="text-section-title text-ink-strong">
          Governed event ledger
        </h3>
        <p className="text-meta text-ink-muted mt-0.5">
          Recent immutable events visible to your role
        </p>
      </div>
      {!audit.allowed ? (
        <EmptyState
          title="Audit access is restricted"
          hint="Only workspace owners and administrators can read the audit ledger."
        />
      ) : audit.events.length === 0 ? (
        <EmptyState title="No governed events recorded" />
      ) : (
        <ul>
          {audit.events.map((event) => (
            <li
              key={event.id}
              className="border-line grid grid-cols-1 gap-1 border-b px-5 py-3 last:border-b-0 min-[700px]:grid-cols-[minmax(0,1fr)_180px_110px] min-[700px]:items-center min-[700px]:gap-4"
            >
              <span className="min-w-0">
                <span className="text-body text-ink block font-medium">
                  {humanize(event.eventType)}
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
  onClose,
  onSelectNode,
  returnFocusRef,
}: {
  nodes: SystemNode[];
  missions: ControlRoomProjection["recentMissions"];
  objects: ControlRoomProjection["finderObjects"];
  basePath: string;
  onClose: () => void;
  onSelectNode: (id: string) => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
}) {
  const [query, setQuery] = useState("");
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
        aria-label="Close object finder"
        tabIndex={-1}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Find governed objects"
        className="border-line bg-surface relative z-10 flex max-h-[75vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border shadow-panel"
      >
        <div className="border-line flex min-w-0 items-center gap-3 border-b px-4">
          <Search
            className="text-ink-muted size-5 shrink-0"
            aria-hidden="true"
          />
          <label htmlFor="control-search" className="sr-only">
            Find governed objects
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
                  Search modules, missions or governed records
                </span>
              </span>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close object finder"
            className="text-ink-muted hover:bg-surface-subtle flex size-9 shrink-0 items-center justify-center rounded-md"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        <div className="overflow-y-auto p-2">
          {filteredNodes.length === 0 &&
          filteredMissions.length === 0 &&
          filteredObjects.length === 0 ? (
            <EmptyState title="No matching governed objects" />
          ) : (
            <>
              {filteredNodes.length > 0 ? (
                <SearchGroup title="System map">
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
                <SearchGroup title="Recent missions">
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
                <SearchGroup title="Governed records">
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
                          {humanize(object.kind)} · {object.code} ·{" "}
                          {humanize(object.status)}
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

function humanize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[._]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
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
