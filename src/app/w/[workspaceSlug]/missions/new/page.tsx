import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Panel, SectionHeader } from "@/components/ui/panel";
import { WorkspaceShell } from "@/components/shell/workspace-shell";
import {
  getWorkspacePolicy,
  hasCapability,
} from "@/modules/identity-workspace";
import { createMissionAction } from "@/app/actions/missions";
import { getMissionTemplate } from "@/modules/mission-templates";
import { loadWorkspacePage } from "@/server/auth/workspace-page";

export const dynamic = "force-dynamic";

const PROFILES = ["QUICK", "PROFESSIONAL", "RESEARCH", "REGULATED"] as const;

function Field({
  id,
  label,
  textarea = false,
  defaultValue,
}: {
  id: string;
  label: string;
  textarea?: boolean;
  defaultValue?: string;
}) {
  const cls =
    "text-body text-ink border-line focus:border-line-strong w-full rounded-md border bg-surface-subtle px-3 outline-none";
  return (
    <div className="mb-3">
      <label htmlFor={id} className="text-meta text-ink mb-1 block font-medium">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={id}
          rows={2}
          required
          defaultValue={defaultValue}
          className={`${cls} py-2 resize-y`}
        />
      ) : (
        <input
          id={id}
          name={id}
          required
          defaultValue={defaultValue}
          className={`${cls} h-10`}
        />
      )}
    </div>
  );
}

export default async function NewMissionPage({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceSlug: string }>;
  searchParams: Promise<{ template?: string }>;
}) {
  const { workspaceSlug } = await params;
  const { template: templateKey } = await searchParams;
  const template = getMissionTemplate(templateKey);
  const data = await loadWorkspacePage(workspaceSlug);
  if (!hasCapability(data.ctx.membership.role, "missions.create")) notFound();
  const policy = await getWorkspacePolicy(data.ctx);

  return (
    <WorkspaceShell
      data={data}
      title="New mission"
      subtitle={data.ctx.workspace.name}
    >
      <Panel className="p-[var(--shell-card-padding)]">
        <SectionHeader title="Define a mission" />
        <p className="text-meta text-ink-muted mt-1">
          {template
            ? `${template.name} v${template.version} has pre-filled this editable draft. Normal review and approval still apply.`
            : "A draft contract is captured with your objective, one requirement and one weighted obligation. You can review and approve it next."}
        </p>
        <form
          action={createMissionAction}
          className="mt-4 max-w-2xl"
          noValidate
        >
          <input type="hidden" name="slug" value={workspaceSlug} />
          <Field id="title" label="Mission title" />
          <Field
            id="objective"
            label="Objective"
            textarea
            defaultValue={template?.objective}
          />
          <Field
            id="scope"
            label="Scope"
            textarea
            defaultValue={template?.scope}
          />
          <Field
            id="successDefinition"
            label="Success definition"
            textarea
            defaultValue={template?.successDefinition}
          />

          <div className="mb-3">
            <label
              htmlFor="assuranceProfile"
              className="text-meta text-ink mb-1 block font-medium"
            >
              Assurance profile
            </label>
            <select
              id="assuranceProfile"
              name="assuranceProfile"
              defaultValue={
                template?.assuranceProfile ?? policy.defaultAssuranceProfile
              }
              className="text-body text-ink border-line bg-surface h-10 rounded-md border px-2"
            >
              {PROFILES.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0) + p.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <fieldset className="border-line mt-2 rounded-md border p-3">
            <legend className="text-meta text-ink-muted px-1">
              First requirement
            </legend>
            <Field
              id="requirementTitle"
              label="Requirement title"
              defaultValue={template?.requirementTitle}
            />
            <Field
              id="requirementCriteria"
              label="Acceptance criteria"
              textarea
              defaultValue={template?.requirementCriteria}
            />
          </fieldset>

          <fieldset className="border-line mt-3 rounded-md border p-3">
            <legend className="text-meta text-ink-muted px-1">
              First obligation
            </legend>
            <Field
              id="obligationTitle"
              label="Obligation title"
              defaultValue={template?.obligationTitle}
            />
            <div className="mb-1">
              <label
                htmlFor="obligationWeight"
                className="text-meta text-ink mb-1 block font-medium"
              >
                Weight (positive integer)
              </label>
              <input
                id="obligationWeight"
                name="obligationWeight"
                type="number"
                min={1}
                defaultValue={template?.obligationWeight ?? 1}
                required
                className="text-body text-ink border-line h-10 w-32 rounded-md border bg-surface-subtle px-3 outline-none"
              />
            </div>
          </fieldset>

          <div className="mt-4">
            <Button type="submit" variant="primary">
              Create mission
            </Button>
          </div>
        </form>
      </Panel>
    </WorkspaceShell>
  );
}
