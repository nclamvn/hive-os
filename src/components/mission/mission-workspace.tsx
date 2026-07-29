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
                  {mission.assuranceProfile.toLowerCase()}
                </StatusBadge>
              </div>
              <h2 className="text-ink-strong mt-2 text-[clamp(1.4rem,3vw,2rem)] leading-tight font-semibold tracking-[-0.025em]">
                {mission.title}
              </h2>
              <p className="text-meta text-ink-muted mt-1">
                {t("mission.governedDossier")} · version {mission.version}
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
          aria-label="Mission workspace"
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
        />
      ) : null}
      {view === "contract" ? <ContractLens detail={detail} /> : null}
      {view === "research" ? <ResearchLens projection={projection} /> : null}
      {view === "evidence" ? <EvidenceLens projection={projection} /> : null}
      {view === "claims" ? <ClaimsLens projection={projection} /> : null}
      {view === "build" ? <BuildLens projection={projection} /> : null}
      {view === "verify" ? <VerifyLens projection={projection} /> : null}
      {view === "decisions" ? (
        <DecisionsLens
          detail={detail}
          canResolve={canResolve}
          basePath={basePath}
        />
      ) : null}
      {view === "release" ? <ReleaseLens projection={projection} /> : null}
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
}: {
  detail: Detail;
  progress: Progress;
  projection: Projection;
  canUpdateObligations: boolean;
  basePath: string;
}) {
  const { contract, obligations, gates } = detail;
  return (
    <div className="grid min-w-0 grid-cols-1 gap-5 min-[1120px]:grid-cols-[minmax(0,1fr)_340px]">
      <div className="min-w-0 space-y-5">
        <Panel className="p-5">
          <SectionHeader title="Mission brief" />
          {contract ? (
            <dl className="mt-4 grid grid-cols-1 gap-4 min-[720px]:grid-cols-3">
              <Field label="Objective" value={contract.objective} />
              <Field label="Scope" value={contract.scope} />
              <Field
                label="Success definition"
                value={contract.successDefinition}
              />
            </dl>
          ) : (
            <EmptyState title="No contract captured" />
          )}
        </Panel>

        <Panel className="overflow-hidden">
          <div className="border-line border-b p-5">
            <SectionHeader title="Obligations" />
          </div>
          {obligations.length === 0 ? (
            <EmptyState
              title="Obligations appear after approval"
              hint="Approve the Mission contract to create governed runtime obligations."
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
                      Weight {obligation.contractObligation.weight}
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
                      {humanize(obligation.status)}
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
          <p className="text-eyebrow text-ink-muted">Derived progress</p>
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
                obligations closed
              </p>
            </>
          ) : (
            <p className="text-meta text-ink-muted mt-2">
              Progress is unavailable until the contract is approved.
            </p>
          )}
        </Panel>

        <Panel className="p-5">
          <p className="text-eyebrow text-ink-muted">Governed records</p>
          <dl className="border-line mt-3 divide-y border-y">
            <MetricRow
              label="Evidence sources"
              value={projection.evidenceSources.length}
            />
            <MetricRow label="Claims" value={projection.claims.length} />
            <MetricRow
              label="Execution TIPs"
              value={projection.execution.tips.length}
            />
            <MetricRow
              label="Verify Reports"
              value={projection.verification.reports.length}
            />
            <MetricRow label="Releases" value={projection.releases.length} />
          </dl>
        </Panel>

        <Panel className="p-5">
          <SectionHeader title="Gates" />
          {gates.length === 0 ? (
            <p className="text-meta text-ink-muted mt-3">
              Gates appear after contract approval when required by assurance.
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
                    {humanize(gate.status)}
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

function ContractLens({ detail }: { detail: Detail }) {
  const { contract } = detail;
  if (!contract) {
    return (
      <Panel>
        <EmptyState title="No contract captured" />
      </Panel>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-5 min-[1080px]:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-5">
        <Panel className="p-5">
          <SectionHeader
            title="Approved intent"
            action={
              <StatusBadge tone="neutral">
                v{contract.versionNumber} · {humanize(contract.status)}
              </StatusBadge>
            }
          />
          <dl className="mt-4 space-y-4">
            <Field label="Objective" value={contract.objective} />
            <Field label="Scope" value={contract.scope} />
            <Field
              label="Success definition"
              value={contract.successDefinition}
            />
          </dl>
        </Panel>
        <RecordList
          title="Requirements"
          empty="No requirements"
          items={contract.requirements.map((item) => ({
            id: item.id,
            title: `${item.code} · ${item.title}`,
            detail: item.acceptanceCriteria,
            badge: item.required ? "required" : "optional",
          }))}
        />
      </div>
      <div className="space-y-5">
        <RecordList
          title="Assumptions"
          empty="No assumptions"
          items={contract.assumptions.map((item) => ({
            id: item.id,
            title: item.statement,
          }))}
        />
        <RecordList
          title="Constraints"
          empty="No constraints"
          items={contract.constraints.map((item) => ({
            id: item.id,
            title: item.statement,
          }))}
        />
        <RecordList
          title="Inputs"
          empty="No inputs"
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

function ResearchLens({ projection }: { projection: Projection }) {
  return (
    <div className="grid grid-cols-1 gap-5 min-[1080px]:grid-cols-[320px_minmax(0,1fr)]">
      <Panel className="p-5">
        <p className="text-eyebrow text-ink-muted">Research graph</p>
        <p className="text-section-title text-ink-strong mt-1">
          Retained lineage, not a generated diagram.
        </p>
        <dl className="border-line mt-5 divide-y border-y">
          <MetricRow
            label="Sources"
            value={projection.evidenceSources.length}
          />
          <MetricRow label="Claims" value={projection.claims.length} />
          <MetricRow label="Edges" value={projection.provenanceEdges.length} />
          <MetricRow label="Disputes" value={projection.disputes.length} />
        </dl>
      </Panel>
      <Panel className="overflow-hidden">
        <div className="border-line border-b p-5">
          <SectionHeader title="Recent provenance edges" />
        </div>
        {projection.provenanceEdges.length === 0 ? (
          <EmptyState
            title="No provenance edges yet"
            hint="Create evidence-backed ClaimVersions to build the research graph."
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
                  {humanize(edge.relation)}
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

function EvidenceLens({ projection }: { projection: Projection }) {
  return (
    <Panel className="overflow-hidden">
      <div className="border-line border-b p-5">
        <SectionHeader
          title="Evidence ledger"
          action={
            <StatusBadge tone="neutral">
              {projection.evidenceSources.length} sources
            </StatusBadge>
          }
        />
      </div>
      {projection.evidenceSources.length === 0 ? (
        <EmptyState
          title="No evidence sources yet"
          hint="Evidence sources, immutable snapshots and exact spans appear during exploration."
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
                  {source.accessLevel.toLowerCase()}
                </StatusBadge>
              </span>
              <p className="text-meta text-ink-muted mt-1">
                {source.publisher || source.sourceType} · independence{" "}
                {source.independenceKey}
              </p>
              <p className="text-meta text-ink-muted mt-3">
                {source._count.snapshots} immutable snapshots ·{" "}
                {source.qualifiesForCorroboration
                  ? "qualifies for corroboration"
                  : "not a corroboration source"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

function ClaimsLens({ projection }: { projection: Projection }) {
  return (
    <Panel className="overflow-hidden">
      <div className="border-line border-b p-5">
        <SectionHeader title="Claims and insights" />
      </div>
      {projection.claims.length === 0 ? (
        <EmptyState
          title="No claims yet"
          hint="Create a sourced claim, an owned internal claim, or an explicit hypothesis."
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
                    {claim.claimKey} · {claim._count.versions} versions ·{" "}
                    {claim._count.disputes} disputes
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
                    {humanize(claim.state)}
                  </StatusBadge>
                  <StatusBadge tone="neutral">
                    {claim.accessLevel.toLowerCase()}
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

function BuildLens({ projection }: { projection: Projection }) {
  return (
    <div className="space-y-5">
      <Panel className="p-5">
        <div className="flex flex-col gap-3 min-[700px]:flex-row min-[700px]:items-start min-[700px]:justify-between">
          <div>
            <p className="text-eyebrow text-navy-700">Manual Provider Bridge</p>
            <h3 className="text-section-title text-ink-strong mt-1">
              Governed execution
            </h3>
            <p className="text-meta text-ink-muted mt-1">
              {projection.execution.disclaimer}
            </p>
          </div>
          <span className="flex flex-wrap gap-2">
            <StatusBadge tone="neutral">
              {projection.execution.counts.artifacts} artifacts
            </StatusBadge>
            <StatusBadge
              tone={
                projection.execution.counts.awaitingReports > 0
                  ? "warning"
                  : "neutral"
              }
            >
              {projection.execution.counts.awaitingReports} awaiting reports
            </StatusBadge>
          </span>
        </div>
      </Panel>
      <Panel className="overflow-hidden">
        <div className="border-line border-b p-5">
          <SectionHeader title="Execution TIPs" />
        </div>
        {projection.execution.tips.length === 0 ? (
          <EmptyState
            title="No execution TIPs yet"
            hint="Execution packages appear after governed exploration defines the work."
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
                        ? ` · attempt ${latest.attemptNumber} · ${latest.executionRole.toLowerCase()} · ${latest.providerName}`
                        : " · not issued"}
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
                    {humanize(tip.status)}
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

function VerifyLens({ projection }: { projection: Projection }) {
  return (
    <div className="grid grid-cols-1 gap-5 min-[1080px]:grid-cols-[minmax(0,1fr)_340px]">
      <Panel className="overflow-hidden">
        <div className="border-line border-b p-5">
          <SectionHeader title="Verify Reports" />
        </div>
        {projection.verification.reports.length === 0 ? (
          <EmptyState
            title="No Verify Reports yet"
            hint="A report appears after a governed verifier completes exact coverage, health and corruption checks."
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
                    {humanize(report.overallStatus)}
                  </StatusBadge>
                </span>
                <p className="text-meta text-ink-muted mt-2">
                  {humanize(report.verificationRun.independenceStatus)} ·{" "}
                  {report.verificationRun.corruptionRuns.length} corruption
                  tests · {report.deferredItems.length} deferred
                </p>
              </li>
            ))}
          </ul>
        )}
      </Panel>
      <div className="space-y-5">
        <RecordList
          title="Required scenarios"
          empty="No verification scenarios"
          items={projection.verification.scenarios.map((scenario) => ({
            id: scenario.id,
            title: `${scenario.code} · ${scenario.title}`,
            detail: scenario.expectedOutcome,
            badge: scenario.required ? "required" : "optional",
          }))}
        />
        <RecordList
          title="Governance sign-offs"
          empty="No sign-offs"
          items={projection.verification.signoffs.map((signoff) => ({
            id: signoff.id,
            title: `${humanize(signoff.signoffType)} · ${humanize(signoff.decision)}`,
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
}: {
  detail: Detail;
  canResolve: boolean;
  basePath: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 min-[1040px]:grid-cols-2">
      <Panel className="overflow-hidden">
        <div className="border-line border-b p-5">
          <SectionHeader title="Decision ledger" />
        </div>
        {detail.decisions.length === 0 ? (
          <EmptyState
            title="No decisions recorded"
            hint="Material changes and exceptions create governed Decisions."
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
                    {humanize(decision.decisionType)}
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
                    {humanize(decision.status)}
                  </StatusBadge>
                )}
              </li>
            ))}
          </ul>
        )}
      </Panel>
      <RecordList
        title="Escalations"
        empty="No escalations"
        items={detail.escalations.map((escalation) => ({
          id: escalation.id,
          title: escalation.reason,
          detail: `${escalation.severity} · ${humanize(escalation.status)} · ${humanize(escalation.sourceType)}`,
        }))}
      />
    </div>
  );
}

function ReleaseLens({ projection }: { projection: Projection }) {
  return (
    <Panel className="overflow-hidden">
      <div className="border-line border-b p-5">
        <SectionHeader title="Governed releases" />
      </div>
      {projection.releases.length === 0 ? (
        <EmptyState
          title="No governed release yet"
          hint="A release requires a ready Verify Report, required sign-offs, evidence-ceiling checks and an immutable manifest."
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
                    {humanize(release.status)}
                  </StatusBadge>
                  <StatusBadge tone="neutral">
                    {release.visibility.toLowerCase()}
                  </StatusBadge>
                </span>
                <p className="text-meta text-ink-muted tabular mt-3 break-all">
                  Manifest {release.manifest?.contentHash || "not available"}
                </p>
                <p className="text-meta text-ink-muted mt-2">
                  {jsonArrayLength(release.manifest?.claimVersions)} exact claim
                  versions · {jsonArrayLength(release.manifest?.artifacts)}{" "}
                  artifacts ·{" "}
                  {release.manifest?.approverMembershipIds.length ?? 0}{" "}
                  approvers
                </p>
              </span>
              <dl className="border-line divide-y border-y">
                <TextArrayRow
                  label="Methods"
                  values={release.manifest?.methods ?? []}
                />
                <TextArrayRow
                  label="Limitations"
                  values={release.manifest?.limitations ?? []}
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

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-meta text-ink-muted">{label}</dt>
      <dd className="text-body text-ink mt-1 whitespace-pre-wrap">
        {value || "Not available"}
      </dd>
    </div>
  );
}

function TextArrayRow({ label, values }: { label: string; values: string[] }) {
  return (
    <div className="py-3">
      <dt className="text-meta text-ink-muted">{label}</dt>
      <dd className="text-meta text-ink mt-1">
        {values.length > 0 ? values.join(" · ") : "Not available"}
      </dd>
    </div>
  );
}

function jsonArrayLength(value: unknown): number {
  return Array.isArray(value) ? value.length : 0;
}

function humanize(value: string): string {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
