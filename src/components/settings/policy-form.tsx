"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import type {
  AssuranceProfile,
  ProviderPolicyMode,
  PublicReleasePolicy,
} from "@prisma/client";

import { updateWorkspacePolicyAction } from "@/app/actions/settings";
import type { AllowedProvider } from "@/modules/identity-workspace";

const field =
  "text-body text-ink border-line focus:border-line-strong h-10 w-full min-w-0 rounded-md border bg-surface-subtle px-3 outline-none";
const area =
  "text-body text-ink border-line focus:border-line-strong w-full min-w-0 resize-y rounded-md border bg-surface-subtle px-3 py-2 outline-none";

function humanize(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());
}

export function PolicyForm({
  slug,
  canUpdate,
  policy,
}: {
  slug: string;
  canUpdate: boolean;
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
          ["Default assurance", humanize(policy.defaultAssuranceProfile)],
          ["Provider policy", humanize(policy.providerPolicyMode)],
          [
            "Artifact retention",
            `${policy.artifactRetentionDays} days minimum`,
          ],
          [
            "Evidence retention",
            `${policy.evidenceRetentionDays} days minimum`,
          ],
          ["Audit retention", `${policy.auditRetentionDays} days minimum`],
          ["Public release", humanize(policy.publicReleasePolicy)],
        ].map(([label, value]) => (
          <div key={label} className="border-line border-b pb-3">
            <p className="text-meta text-ink-muted">{label}</p>
            <p className="text-body text-ink-strong mt-1 font-medium">
              {value}
            </p>
          </div>
        ))}
        <p className="text-meta text-ink-muted min-[720px]:col-span-2">
          Your role can inspect effective policy but cannot change it.
        </p>
      </div>
    );
  }

  return (
    <form
      aria-label="Workspace operating policy"
      onSubmit={submit}
      className="space-y-5"
    >
      <div className="grid gap-4 min-[720px]:grid-cols-2">
        <div>
          <label
            htmlFor="default-assurance"
            className="text-meta text-ink mb-1 block font-medium"
          >
            Default Mission assurance
          </label>
          <select
            id="default-assurance"
            name="defaultAssuranceProfile"
            defaultValue={policy.defaultAssuranceProfile}
            className={field}
          >
            {["QUICK", "PROFESSIONAL", "RESEARCH", "REGULATED"].map((value) => (
              <option key={value} value={value}>
                {humanize(value)}
              </option>
            ))}
          </select>
          <p className="text-meta text-ink-muted mt-1">
            Prefills new drafts; authors may still choose a stricter profile.
          </p>
        </div>
        <div>
          <label
            htmlFor="public-release-policy"
            className="text-meta text-ink mb-1 block font-medium"
          >
            Public release ceiling
          </label>
          <select
            id="public-release-policy"
            name="publicReleasePolicy"
            defaultValue={policy.publicReleasePolicy}
            className={field}
          >
            <option value="GOVERNED_PUBLIC">Governed public</option>
            <option value="INTERNAL_ONLY">Internal only</option>
          </select>
          <p className="text-meta text-ink-muted mt-1">
            Internal only blocks public manifests inside the release kernel.
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
              Manual provider policy
            </label>
            <select
              id="provider-policy"
              name="providerPolicyMode"
              defaultValue={policy.providerPolicyMode}
              className={field}
            >
              <option value="OPEN_MANUAL">Open manual bridge</option>
              <option value="ALLOWLIST_MANUAL">Allowlist manual bridge</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="allowed-providers"
              className="text-meta text-ink mb-1 block font-medium"
            >
              Allowed provider and model identifiers
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
              One provider per line. Identifiers only; never enter API keys,
              tokens or connection secrets.
            </p>
          </div>
        </div>
      </div>

      <fieldset className="border-line border-t pt-5">
        <legend className="text-body text-ink-strong font-semibold">
          Minimum retention guardrails
        </legend>
        <p className="text-meta text-ink-muted mt-1">
          These values declare the minimum preservation window. They do not
          schedule deletion of immutable governed records.
        </p>
        <div className="mt-3 grid gap-4 min-[620px]:grid-cols-3">
          {[
            [
              "artifactRetentionDays",
              "Artifacts",
              policy.artifactRetentionDays,
              30,
            ],
            [
              "evidenceRetentionDays",
              "Evidence",
              policy.evidenceRetentionDays,
              30,
            ],
            ["auditRetentionDays", "Audit", policy.auditRetentionDays, 365],
          ].map(([name, label, value, min]) => (
            <div key={String(name)}>
              <label
                htmlFor={String(name)}
                className="text-meta text-ink mb-1 block font-medium"
              >
                {label} days
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
          {result.ok ? "Operating policy saved" : result.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={busy}
        className="text-body bg-navy-800 hover:bg-navy-900 inline-flex min-h-10 items-center rounded-md px-4 font-medium text-white disabled:opacity-50"
      >
        {busy ? "Saving…" : "Save operating policy"}
      </button>
    </form>
  );
}
