import { FileCheck2, Fingerprint, ShieldCheck, TestTube2 } from "lucide-react";

import { VerificationOperationsForms } from "@/components/verification/verification-forms";
import { WorkspaceShell } from "@/components/shell/workspace-shell";
import { Panel } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { loadWorkspacePage } from "@/server/auth/workspace-page";
import { getVerificationOperationsProjection } from "@/server/verification-operations";

export const dynamic = "force-dynamic";

function humanize(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());
}

function tone(status: string) {
  if (["READY", "APPROVED", "RELEASED", "PASS"].includes(status)) {
    return "success" as const;
  }
  if (["NOT_READY", "REJECTED", "FAIL"].includes(status)) {
    return "danger" as const;
  }
  if (["READY_WITH_DEFERRED", "DEFERRED", "INCONCLUSIVE"].includes(status)) {
    return "warning" as const;
  }
  return "info" as const;
}

const health = {
  build: "PASS",
  typecheck: { errors: 0, warnings: 0 },
  lint: { errors: 0, warnings: 0 },
  unit: { passed: 0, failed: 0, skipped: 0 },
  integration: { passed: 0, failed: 0, skipped: 0 },
  e2e: { passed: 0, failed: 0, skipped: 0 },
  accessibilityViolations: 0,
  vulnerabilities: { critical: 0, high: 0, moderate: 0, low: 0 },
};

export default async function VerificationOperationsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const data = await loadWorkspacePage(workspaceSlug);
  const verification = await getVerificationOperationsProjection(data.ctx);

  const missionOption = (mission: (typeof verification.missions)[number]) => ({
    id: mission.id,
    label: `${mission.referenceCode} · ${mission.title} · ${humanize(mission.assuranceProfile)}`,
  });
  const buildingMissions = verification.missions
    .filter((mission) => mission.status === "BUILDING")
    .map(missionOption);
  const verifyingMissions = verification.missions
    .filter((mission) => mission.status === "VERIFYING")
    .map(missionOption);
  const reviewMissions = verification.missions
    .filter(
      (mission) => mission.status === "REVIEW" && !mission.governedReleases[0],
    )
    .map(missionOption);
  const releasableMissions = verification.missions
    .filter(
      (mission) =>
        mission.status === "REVIEW" &&
        Boolean(mission.governedReleases[0]?.manifest),
    )
    .map(missionOption);
  const requirements = verification.requirements.map((requirement) => ({
    id: requirement.id,
    label: `${requirement.code} · ${requirement.title}${requirement.required ? " · required" : ""}`,
  }));
  const verifierAttempts = verification.verifierAttempts.map((attempt) => ({
    id: attempt.id,
    label: `${attempt.mission.referenceCode} · ${attempt.providerName}/${attempt.modelName} · attempt ${attempt.attemptNumber}`,
  }));
  const activeRuns = verification.runs
    .filter((run) => run.status === "IN_PROGRESS")
    .map((run) => {
      const runRequirements = verification.requirements.filter(
        (requirement) =>
          requirement.contractId === run.mission.approvedContractId,
      );
      const runScenarios = verification.scenarios.filter(
        (scenario) => scenario.missionId === run.missionId && scenario.required,
      );
      const evidenceId =
        run.verifierAgentRun.outputArtifactId ??
        verification.artifacts.find(
          (artifact) => artifact.missionId === run.missionId,
        )?.id ??
        "REPLACE-WITH-EVIDENCE-ARTIFACT-UUID";
      return {
        id: run.id,
        label: `${run.mission.referenceCode} · ${humanize(run.independenceStatus)}`,
        template: JSON.stringify(
          {
            requirementCoverage: runRequirements.map((requirement) => ({
              requirementId: requirement.id,
              result: "PASS",
              method: `Verify ${requirement.code} against retained evidence.`,
              evidenceArtifactIds: [evidenceId],
            })),
            scenarioResults: runScenarios.map((scenario) => ({
              scenarioId: scenario.id,
              result: "PASS",
              severity: null,
              detail: "Expected governed behavior observed.",
              evidenceArtifactIds: [evidenceId],
            })),
            technicalHealth: health,
            corruptionTests:
              run.independenceStatus === "INDEPENDENT"
                ? [
                    {
                      code: "CORRUPT-01",
                      title: "Tampered evidence digest",
                      method:
                        "Mutate the retained digest and require deterministic rejection.",
                      result: "PASS",
                      severity: "P0",
                      detail: "Corrupt evidence was rejected.",
                      evidenceArtifactIds: [evidenceId],
                    },
                  ]
                : [],
            overallStatus: "READY",
            deferredItems: [],
          },
          null,
          2,
        ),
      };
    });
  const reviewableReports = verification.reports
    .filter((report) => report.overallStatus !== "NOT_READY" && !report.release)
    .map((report) => ({
      id: report.id,
      label: `${report.mission.referenceCode} · ${humanize(report.overallStatus)} · ${humanize(report.verificationRun.independenceStatus)}`,
    }));
  const releaseReports = verification.reports
    .filter((report) => report.mission.status === "REVIEW" && !report.release)
    .map((report) => ({
      id: report.id,
      label: `${report.mission.referenceCode} · ${humanize(report.overallStatus)}`,
    }));

  return (
    <WorkspaceShell
      data={data}
      title="Verification Operations"
      subtitle="Independent verification, human governance and immutable release authorization."
    >
      <div className="space-y-5">
        <Panel className="overflow-hidden">
          <div className="p-[var(--shell-card-padding)]">
            <p className="text-eyebrow text-navy-700">Release authority</p>
            <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-3xl">
                <h2 className="text-page-title text-ink-strong">
                  Evidence becomes releasable only after it survives the gate.
                </h2>
                <p className="text-body text-ink-muted mt-2">
                  Provider output remains a claim until exact coverage,
                  technical health, corruption resistance and authorized human
                  sign-off converge.
                </p>
              </div>
              <StatusBadge tone="info">deterministic governance</StatusBadge>
            </div>
          </div>
          <ol
            aria-label="Verification and release sequence"
            className="border-line grid border-t min-[760px]:grid-cols-6"
          >
            {[
              ["01", "Scenario"],
              ["02", "Verifier"],
              ["03", "Report"],
              ["04", "Sign-off"],
              ["05", "Manifest"],
              ["06", "Release"],
            ].map(([number, label]) => (
              <li
                key={number}
                className="border-line flex gap-3 border-b p-4 last:border-b-0 min-[760px]:border-r min-[760px]:border-b-0 min-[760px]:last:border-r-0"
              >
                <span className="text-meta text-navy-700 font-mono">
                  {number}
                </span>
                <span className="text-body text-ink-strong font-semibold">
                  {label}
                </span>
              </li>
            ))}
          </ol>
        </Panel>

        <dl className="grid grid-cols-2 gap-3 min-[760px]:grid-cols-6">
          {[
            ["Scenarios", verification.counts.scenarios],
            ["Active runs", verification.counts.activeRuns],
            ["Reports", verification.counts.reports],
            ["Not ready", verification.counts.notReady],
            ["Sign-offs", verification.counts.signoffs],
            ["Releases", verification.counts.releases],
          ].map(([label, value]) => (
            <Panel key={label} className="p-4">
              <dt className="text-meta text-ink-muted">{label}</dt>
              <dd className="text-page-title text-ink-strong mt-1 tabular">
                {value}
              </dd>
            </Panel>
          ))}
        </dl>

        <VerificationOperationsForms
          slug={workspaceSlug}
          buildingMissions={buildingMissions}
          verifyingMissions={verifyingMissions}
          reviewMissions={reviewMissions}
          releasableMissions={releasableMissions}
          requirements={requirements}
          verifierAttempts={verifierAttempts}
          activeRuns={activeRuns}
          reviewableReports={reviewableReports}
          releaseReports={releaseReports}
          canOperate={verification.permissions.canOperate}
          canReview={verification.permissions.canReview}
          canRelease={verification.permissions.canRelease}
        />

        <section aria-labelledby="verification-ledger-title">
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck aria-hidden="true" className="text-navy-700 size-4" />
            <h2
              id="verification-ledger-title"
              className="text-section-title text-ink-strong"
            >
              Verification ledger
            </h2>
          </div>
          {verification.reports.length ? (
            <div className="space-y-4">
              {verification.reports.map((report) => (
                <Panel key={report.id} className="overflow-hidden">
                  <div className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-meta text-ink-muted">
                          {report.mission.referenceCode} ·{" "}
                          {humanize(report.mission.assuranceProfile)}
                        </p>
                        <h3 className="text-section-title text-ink-strong mt-1">
                          {report.mission.title}
                        </h3>
                      </div>
                      <StatusBadge tone={tone(report.overallStatus)}>
                        {humanize(report.overallStatus)}
                      </StatusBadge>
                    </div>
                    <div className="mt-4 grid gap-3 min-[680px]:grid-cols-4">
                      {[
                        [
                          "Coverage",
                          report.verificationRun.requirementCoverage.length,
                        ],
                        [
                          "Scenarios",
                          report.verificationRun.scenarioResults.length,
                        ],
                        [
                          "Corruption",
                          report.verificationRun.corruptionRuns.length,
                        ],
                        ["Sign-offs", report.signoffs.length],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="bg-surface-subtle rounded-md p-3"
                        >
                          <p className="text-meta text-ink-muted">{label}</p>
                          <p className="text-body text-ink-strong mt-1 font-semibold tabular">
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="border-line mt-4 grid gap-3 border-t pt-4 min-[680px]:grid-cols-3">
                      <p className="text-meta text-ink-muted flex items-center gap-2">
                        <TestTube2 aria-hidden="true" className="size-4" />
                        {humanize(report.verificationRun.independenceStatus)}
                      </p>
                      <p className="text-meta text-ink-muted flex items-center gap-2">
                        <Fingerprint aria-hidden="true" className="size-4" />
                        <span className="truncate font-mono">
                          {report.contentHash}
                        </span>
                      </p>
                      <p className="text-meta text-ink-muted flex items-center gap-2">
                        <FileCheck2 aria-hidden="true" className="size-4" />
                        {report.release?.manifest
                          ? `${humanize(report.release.visibility)} manifest`
                          : "No release manifest"}
                      </p>
                    </div>
                  </div>
                </Panel>
              ))}
            </div>
          ) : (
            <Panel className="p-6">
              <p className="text-body text-ink-strong font-semibold">
                No Verify Report yet
              </p>
              <p className="text-body text-ink-muted mt-1">
                Complete execution, define required scenarios and begin an
                independent run.
              </p>
            </Panel>
          )}
        </section>
      </div>
    </WorkspaceShell>
  );
}
