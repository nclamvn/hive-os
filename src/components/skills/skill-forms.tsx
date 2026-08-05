"use client";

import { type FormEvent, type ReactNode, useState } from "react";
import { useRouter } from "next/navigation";

import {
  activateSkillVersionAction,
  changeSkillStatusAction,
  registerSkillAction,
  registerSkillVersionAction,
  type SkillActionResult,
} from "@/app/actions/skills";
import type { Locale } from "@/i18n/config";
import { skillValueLabel, type SkillsCopy } from "@/i18n/skills-copy";

const field =
  "text-body text-ink border-line focus:border-line-strong h-10 w-full min-w-0 rounded-md border bg-surface-subtle px-3 outline-none";
const area =
  "text-body text-ink border-line focus:border-line-strong w-full min-w-0 resize-y rounded-md border bg-surface-subtle px-3 py-2 outline-none";

function Label({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-meta text-ink mb-1 block font-medium"
    >
      {children}
    </label>
  );
}

function GovernedForm({
  label,
  action,
  success,
  children,
  locale,
  copy,
}: {
  label: string;
  action: (data: FormData) => Promise<SkillActionResult>;
  success: string;
  children: ReactNode;
  locale: Locale;
  copy: SkillsCopy["form"];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<SkillActionResult | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setResult(null);
    const form = event.currentTarget;
    const next = await action(new FormData(form));
    setBusy(false);
    setResult(next);
    if (next.ok) {
      form.reset();
      router.refresh();
    }
  }

  return (
    <form aria-label={label} onSubmit={submit} className="space-y-3">
      {children}
      {result ? (
        <p
          role={result.ok ? "status" : "alert"}
          className={`text-meta ${result.ok ? "text-success-600" : "text-danger-600"}`}
        >
          {result.ok
            ? success
            : locale === "en"
              ? result.error
              : copy.actionError}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={busy}
        className="text-body bg-navy-800 hover:bg-navy-900 inline-flex min-h-10 items-center rounded-md px-4 font-medium text-white disabled:opacity-50"
      >
        {busy ? copy.saving : copy.save}
      </button>
    </form>
  );
}

function ContractFields({
  prefix,
  locale,
  copy,
}: {
  prefix: string;
  locale: Locale;
  copy: SkillsCopy["form"];
}) {
  return (
    <>
      <div className="grid gap-3 min-[520px]:grid-cols-2">
        <div>
          <Label htmlFor={`${prefix}-version`}>{copy.semanticVersion}</Label>
          <input
            id={`${prefix}-version`}
            name="semanticVersion"
            required
            placeholder="1.0.0"
            className={field}
          />
        </div>
        <div>
          <Label htmlFor={`${prefix}-verifier-key`}>{copy.verifierKey}</Label>
          <input
            id={`${prefix}-verifier-key`}
            name="verifierKey"
            required
            placeholder="registry-hygiene"
            className={field}
          />
        </div>
      </div>
      <div>
        <Label htmlFor={`${prefix}-capabilities`}>{copy.capabilities}</Label>
        <textarea
          id={`${prefix}-capabilities`}
          name="capabilities"
          required
          rows={2}
          placeholder="evidence_ingestion, deterministic_registry"
          className={area}
        />
      </div>
      <div className="grid gap-3 min-[520px]:grid-cols-2">
        <div>
          <Label htmlFor={`${prefix}-evidence`}>{copy.requiredEvidence}</Label>
          <textarea
            id={`${prefix}-evidence`}
            name="requiredEvidence"
            required
            rows={2}
            defaultValue="source_snapshot, exact_span"
            className={area}
          />
        </div>
        <div>
          <Label htmlFor={`${prefix}-failure`}>{copy.failureStates}</Label>
          <textarea
            id={`${prefix}-failure`}
            name="failureStates"
            required
            rows={2}
            defaultValue="OPEN_INCOMPLETE, BLOCKED"
            className={area}
          />
        </div>
      </div>
      <div className="grid gap-3 min-[520px]:grid-cols-2">
        <div>
          <Label htmlFor={`${prefix}-input-schema`}>{copy.inputSchema}</Label>
          <textarea
            id={`${prefix}-input-schema`}
            name="inputSchema"
            required
            rows={3}
            defaultValue={'{"type":"object"}'}
            className={`${area} font-mono text-[12px]`}
          />
        </div>
        <div>
          <Label htmlFor={`${prefix}-output-schema`}>{copy.outputSchema}</Label>
          <textarea
            id={`${prefix}-output-schema`}
            name="outputSchema"
            required
            rows={3}
            defaultValue={'{"type":"object"}'}
            className={`${area} font-mono text-[12px]`}
          />
        </div>
      </div>
      <div className="grid gap-3 min-[520px]:grid-cols-3">
        <div>
          <Label htmlFor={`${prefix}-verifier-kind`}>{copy.verifierKind}</Label>
          <select
            id={`${prefix}-verifier-kind`}
            name="verifierKind"
            defaultValue="DETERMINISTIC"
            className={field}
          >
            <option value="DETERMINISTIC">{copy.deterministic}</option>
            <option value="HUMAN">{copy.human}</option>
            <option value="EXTERNAL">{copy.external}</option>
          </select>
        </div>
        <div>
          <Label htmlFor={`${prefix}-duration`}>{copy.maxSeconds}</Label>
          <input
            id={`${prefix}-duration`}
            name="maxDurationSeconds"
            type="number"
            min="1"
            defaultValue="900"
            required
            className={field}
          />
        </div>
        <div>
          <Label htmlFor={`${prefix}-memory`}>{copy.maxMemory}</Label>
          <input
            id={`${prefix}-memory`}
            name="maxMemoryMb"
            type="number"
            min="16"
            defaultValue="1024"
            required
            className={field}
          />
        </div>
      </div>
      <fieldset>
        <legend className="text-meta text-ink mb-2 font-medium">
          {copy.assuranceCompatibility}
        </legend>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {["QUICK", "PROFESSIONAL", "RESEARCH", "REGULATED"].map((profile) => (
            <label
              key={profile}
              className="text-meta text-ink flex items-center gap-2"
            >
              <input
                type="checkbox"
                name="assuranceCompatibility"
                value={profile}
                defaultChecked={profile === "PROFESSIONAL"}
              />
              {skillValueLabel(locale, profile)}
            </label>
          ))}
        </div>
      </fieldset>
    </>
  );
}

export function RegisterSkillForm({
  slug,
  locale,
  copy,
}: {
  slug: string;
  locale: Locale;
  copy: SkillsCopy["form"];
}) {
  return (
    <GovernedForm
      label={copy.registerLabel}
      action={(data) => registerSkillAction(slug, data)}
      success={copy.registerSuccess}
      locale={locale}
      copy={copy}
    >
      <div className="grid gap-3 min-[520px]:grid-cols-2">
        <div>
          <Label htmlFor="skill-key">{copy.skillKey}</Label>
          <input
            id="skill-key"
            name="skillKey"
            required
            placeholder="refinery"
            className={field}
          />
        </div>
        <div>
          <Label htmlFor="skill-name">{copy.displayName}</Label>
          <input
            id="skill-name"
            name="displayName"
            required
            className={field}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="skill-description">{copy.description}</Label>
        <textarea
          id="skill-description"
          name="description"
          required
          rows={3}
          className={area}
        />
      </div>
      <ContractFields prefix="initial" locale={locale} copy={copy} />
    </GovernedForm>
  );
}

interface VersionOption {
  id: string;
  semanticVersion: string;
}

export function SkillGovernanceForms({
  slug,
  skillId,
  skillKey,
  version,
  status,
  activeVersionId,
  versions,
  locale,
  copy,
}: {
  slug: string;
  skillId: string;
  skillKey: string;
  version: number;
  status: "ACTIVE" | "DEPRECATED" | "ARCHIVED";
  activeVersionId: string;
  versions: VersionOption[];
  locale: Locale;
  copy: SkillsCopy["form"];
}) {
  const candidates = versions.filter(
    (candidate) => candidate.id !== activeVersionId,
  );

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      {status !== "ARCHIVED" ? (
        <section>
          <h4 className="text-body text-ink-strong mb-3 font-semibold">
            {copy.registerCandidate}
          </h4>
          <GovernedForm
            label={`${copy.registerVersionLabel} ${skillKey}`}
            action={(data) => registerSkillVersionAction(slug, skillId, data)}
            success={copy.registerVersionSuccess}
            locale={locale}
            copy={copy}
          >
            <ContractFields
              prefix={`candidate-${skillId}`}
              locale={locale}
              copy={copy}
            />
          </GovernedForm>
        </section>
      ) : null}

      <div className="space-y-5">
        {candidates.length && status !== "ARCHIVED" ? (
          <section>
            <h4 className="text-body text-ink-strong mb-3 font-semibold">
              {copy.activateCandidate}
            </h4>
            <GovernedForm
              label={`${copy.activateLabel} ${skillKey}`}
              action={(data) => activateSkillVersionAction(slug, skillId, data)}
              success={copy.activateSuccess}
              locale={locale}
              copy={copy}
            >
              <input type="hidden" name="expectedVersion" value={version} />
              <div>
                <Label htmlFor={`activate-${skillId}`}>
                  {copy.candidateVersion}
                </Label>
                <select
                  id={`activate-${skillId}`}
                  name="skillVersionId"
                  required
                  className={field}
                >
                  {candidates.map((candidate) => (
                    <option key={candidate.id} value={candidate.id}>
                      v{candidate.semanticVersion}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor={`activate-reason-${skillId}`}>
                  {copy.activationReason}
                </Label>
                <textarea
                  id={`activate-reason-${skillId}`}
                  name="reason"
                  required
                  rows={2}
                  className={area}
                />
              </div>
            </GovernedForm>
          </section>
        ) : null}

        {status !== "ARCHIVED" ? (
          <section>
            <h4 className="text-body text-ink-strong mb-3 font-semibold">
              {copy.lifecycle}
            </h4>
            <GovernedForm
              label={`${copy.changeStatusLabel} ${skillKey}`}
              action={(data) => changeSkillStatusAction(slug, skillId, data)}
              success={copy.changeStatusSuccess}
              locale={locale}
              copy={copy}
            >
              <input type="hidden" name="expectedVersion" value={version} />
              <div>
                <Label htmlFor={`status-${skillId}`}>{copy.nextStatus}</Label>
                <select
                  id={`status-${skillId}`}
                  name="status"
                  className={field}
                >
                  {(["ACTIVE", "DEPRECATED", "ARCHIVED"] as const)
                    .filter((next) => next !== status)
                    .map((next) => (
                      <option key={next} value={next}>
                        {skillValueLabel(locale, next)}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <Label htmlFor={`status-reason-${skillId}`}>
                  {copy.governanceReason}
                </Label>
                <textarea
                  id={`status-reason-${skillId}`}
                  name="reason"
                  required
                  rows={2}
                  className={area}
                />
              </div>
            </GovernedForm>
          </section>
        ) : (
          <p className="text-body text-ink-muted">{copy.archived}</p>
        )}
      </div>
    </div>
  );
}
