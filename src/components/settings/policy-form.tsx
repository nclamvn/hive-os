"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import type {
  AssuranceProfile,
  ProviderPolicyMode,
  PublicReleasePolicy,
} from "@prisma/client";

import { updateWorkspacePolicyAction } from "@/app/actions/settings";
import type { Locale } from "@/i18n/config";
import { settingsValueLabel, type SettingsCopy } from "@/i18n/settings-copy";
import type { AllowedProvider } from "@/modules/identity-workspace";

const field =
  "text-body text-ink border-line focus:border-line-strong h-10 w-full min-w-0 rounded-md border bg-surface-subtle px-3 outline-none";
const area =
  "text-body text-ink border-line focus:border-line-strong w-full min-w-0 resize-y rounded-md border bg-surface-subtle px-3 py-2 outline-none";

export function PolicyForm({
  slug,
  canUpdate,
  policy,
  locale,
  copy,
}: {
  slug: string;
  canUpdate: boolean;
  locale: Locale;
  copy: SettingsCopy["policy"]["form"];
  policy: {
    defaultAssuranceProfile: AssuranceProfile;
    providerPolicyMode: ProviderPolicyMode;
    allowedProviders: AllowedProvider[];
    artifactRetentionDays: number;
    evidenceRetentionDays: number;
    auditRetentionDays: number;
    publicReleasePolicy: PublicReleasePolicy;
  };
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; error?: string } | null>(
    null,
  );

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setResult(null);
    const next = await updateWorkspacePolicyAction(
      slug,
      new FormData(event.currentTarget),
    );
    setBusy(false);
    setResult(next);
    if (next.ok) router.refresh();
  }

  const providerText = policy.allowedProviders
    .map(
      (provider) =>
        `${provider.providerName} | ${provider.modelNames.join(", ")}`,
    )
    .join("\n");

  if (!canUpdate) {
    return (
      <div className="grid gap-4 min-[720px]:grid-cols-2">
        {[
          [
            copy.defaultAssuranceSummary,
            settingsValueLabel(locale, policy.defaultAssuranceProfile),
          ],
          [
            copy.providerPolicySummary,
            settingsValueLabel(locale, policy.providerPolicyMode),
          ],
          [
            copy.artifactRetention,
            `${policy.artifactRetentionDays} ${copy.daysMinimum}`,
          ],
          [
            copy.evidenceRetention,
            `${policy.evidenceRetentionDays} ${copy.daysMinimum}`,
          ],
          [
            copy.auditRetention,
            `${policy.auditRetentionDays} ${copy.daysMinimum}`,
          ],
          [
            copy.publicReleaseSummary,
            settingsValueLabel(locale, policy.publicReleasePolicy),
          ],
        ].map(([label, value]) => (
          <div key={label} className="border-line border-b pb-3">
            <p className="text-meta text-ink-muted">{label}</p>
            <p className="text-body text-ink-strong mt-1 font-medium">
              {value}
            </p>
          </div>
        ))}
        <p className="text-meta text-ink-muted min-[720px]:col-span-2">
          {copy.readOnly}
        </p>
      </div>
    );
  }

  return (
    <form aria-label={copy.label} onSubmit={submit} className="space-y-5">
      <div className="grid gap-4 min-[720px]:grid-cols-2">
        <div>
          <label
            htmlFor="default-assurance"
            className="text-meta text-ink mb-1 block font-medium"
          >
            {copy.defaultAssurance}
          </label>
          <select
            id="default-assurance"
            name="defaultAssuranceProfile"
            defaultValue={policy.defaultAssuranceProfile}
            className={field}
          >
            {["QUICK", "PROFESSIONAL", "RESEARCH", "REGULATED"].map((value) => (
              <option key={value} value={value}>
                {settingsValueLabel(locale, value)}
              </option>
            ))}
          </select>
          <p className="text-meta text-ink-muted mt-1">
            {copy.defaultAssuranceHint}
          </p>
        </div>
        <div>
          <label
            htmlFor="public-release-policy"
            className="text-meta text-ink mb-1 block font-medium"
          >
            {copy.publicRelease}
          </label>
          <select
            id="public-release-policy"
            name="publicReleasePolicy"
            defaultValue={policy.publicReleasePolicy}
            className={field}
          >
            <option value="GOVERNED_PUBLIC">{copy.governedPublic}</option>
            <option value="INTERNAL_ONLY">{copy.internalOnly}</option>
          </select>
          <p className="text-meta text-ink-muted mt-1">
            {copy.publicReleaseHint}
          </p>
        </div>
      </div>

      <div className="border-line border-t pt-5">
        <div className="grid gap-4 min-[720px]:grid-cols-[260px_1fr]">
          <div>
            <label
              htmlFor="provider-policy"
              className="text-meta text-ink mb-1 block font-medium"
            >
              {copy.providerPolicy}
            </label>
            <select
              id="provider-policy"
              name="providerPolicyMode"
              defaultValue={policy.providerPolicyMode}
              className={field}
            >
              <option value="OPEN_MANUAL">{copy.openManual}</option>
              <option value="ALLOWLIST_MANUAL">{copy.allowlistManual}</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="allowed-providers"
              className="text-meta text-ink mb-1 block font-medium"
            >
              {copy.allowedProviders}
            </label>
            <textarea
              id="allowed-providers"
              name="allowedProviders"
              rows={5}
              defaultValue={providerText}
              placeholder={
                "provider-name | model-a, model-b\nindependent-provider | verifier-v1"
              }
              className={`${area} font-mono text-[12px]`}
            />
            <p className="text-meta text-ink-muted mt-1">
              {copy.allowedProvidersHint}
            </p>
          </div>
        </div>
      </div>

      <fieldset className="border-line border-t pt-5">
        <legend className="text-body text-ink-strong font-semibold">
          {copy.retentionTitle}
        </legend>
        <p className="text-meta text-ink-muted mt-1">{copy.retentionHint}</p>
        <div className="mt-3 grid gap-4 min-[620px]:grid-cols-3">
          {[
            [
              "artifactRetentionDays",
              copy.artifacts,
              policy.artifactRetentionDays,
              30,
            ],
            [
              "evidenceRetentionDays",
              copy.evidence,
              policy.evidenceRetentionDays,
              30,
            ],
            ["auditRetentionDays", copy.audit, policy.auditRetentionDays, 365],
          ].map(([name, label, value, min]) => (
            <div key={String(name)}>
              <label
                htmlFor={String(name)}
                className="text-meta text-ink mb-1 block font-medium"
              >
                {label} {copy.days}
              </label>
              <input
                id={String(name)}
                name={String(name)}
                type="number"
                min={Number(min)}
                max={36500}
                defaultValue={Number(value)}
                required
                className={field}
              />
            </div>
          ))}
        </div>
      </fieldset>

      {result ? (
        <p
          role={result.ok ? "status" : "alert"}
          className={`text-meta ${result.ok ? "text-success-600" : "text-danger-600"}`}
        >
          {result.ok
            ? copy.saved
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
