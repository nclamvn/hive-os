"use client";

import {
  type FormEvent,
  type ReactNode,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import {
  addClaimVersionAction,
  assertHonestNullAction,
  captureSnapshotAction,
  createClaimAction,
  createEvidenceSourceAction,
  createEvidenceSpanAction,
  reviewClaimAction,
  type TruthActionResult,
} from "@/app/actions/truth";

const field =
  "text-body text-ink border-line focus:border-line-strong h-10 w-full min-w-0 rounded-md border bg-surface-subtle px-3 outline-none";
const area =
  "text-body text-ink border-line focus:border-line-strong w-full min-w-0 resize-y rounded-md border bg-surface-subtle px-3 py-2 outline-none";

interface Option {
  id: string;
  label: string;
}

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="text-meta text-ink mb-1 block font-medium">
      {children}
    </label>
  );
}

function ActionForm({
  action,
  label,
  successMessage,
  children,
  className = "",
}: {
  action: (formData: FormData) => Promise<TruthActionResult>;
  label: string;
  successMessage: string;
  children: ReactNode;
  className?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<TruthActionResult | null>(null);

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
    <form aria-label={label} onSubmit={submit} className={`space-y-3 ${className}`}>
      {children}
      {result ? (
        <p
          role={result.ok ? "status" : "alert"}
          className={`text-meta ${result.ok ? "text-success-600" : "text-danger-600"}`}
        >
          {result.ok ? successMessage : result.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={busy}
        className="text-body bg-navy-800 hover:bg-navy-900 inline-flex h-10 items-center rounded-md px-4 font-medium text-white disabled:opacity-50"
      >
        {busy ? "Saving…" : "Save governed record"}
      </button>
    </form>
  );
}

function Select({
  id,
  name,
  label,
  options,
  required = true,
}: {
  id: string;
  name: string;
  label: string;
  options: Option[];
  required?: boolean;
}) {
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <select id={id} name={name} required={required} className={field}>
        <option value="">{required ? "Select…" : "None"}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function AccessSelect({ id }: { id: string }) {
  return (
    <div>
      <FieldLabel htmlFor={id}>Access level</FieldLabel>
      <select id={id} name="accessLevel" defaultValue="WORKSPACE" className={field}>
        <option value="WORKSPACE">Workspace</option>
        <option value="RESTRICTED">Restricted</option>
        <option value="PUBLIC">Public candidate</option>
      </select>
    </div>
  );
}

export function EvidenceForms({
  slug,
  missions,
  sources,
  snapshots,
}: {
  slug: string;
  missions: Option[];
  sources: Option[];
  snapshots: Option[];
}) {
  return (
    <div className="grid gap-4 min-[900px]:grid-cols-3">
      <section className="border-line bg-surface rounded-panel border p-5">
        <p className="text-eyebrow text-navy-700">01 · Source</p>
        <h2 className="text-section-title text-ink-strong mt-1">Register authority</h2>
        <p className="text-meta text-ink-muted mt-1 mb-4">
          Identify origin and independence before retaining content.
        </p>
        <ActionForm
          action={(data) => createEvidenceSourceAction(slug, data)}
          label="Register evidence source"
          successMessage="Evidence source registered"
        >
          <Select id="source-mission" name="missionId" label="Mission" options={missions} />
          <div>
            <FieldLabel htmlFor="source-title">Source title</FieldLabel>
            <input id="source-title" name="title" required className={field} />
          </div>
          <div>
            <FieldLabel htmlFor="source-uri">Canonical URI</FieldLabel>
            <input id="source-uri" name="canonicalUri" type="url" required className={field} />
          </div>
          <div className="grid gap-3 min-[480px]:grid-cols-2">
            <div>
              <FieldLabel htmlFor="source-type">Source type</FieldLabel>
              <input id="source-type" name="sourceType" defaultValue="document" className={field} />
            </div>
            <div>
              <FieldLabel htmlFor="independence-key">Independence key</FieldLabel>
              <input id="independence-key" name="independenceKey" required className={field} />
            </div>
          </div>
          <AccessSelect id="source-access" />
          <label className="text-meta text-ink flex items-start gap-2">
            <input name="qualifiesForCorroboration" type="checkbox" className="mt-0.5" />
            Independently qualifies for corroboration
          </label>
        </ActionForm>
      </section>

      <section className="border-line bg-surface rounded-panel border p-5">
        <p className="text-eyebrow text-navy-700">02 · Snapshot</p>
        <h2 className="text-section-title text-ink-strong mt-1">Freeze source content</h2>
        <p className="text-meta text-ink-muted mt-1 mb-4">
          The SHA-256 snapshot is immutable after capture.
        </p>
        <ActionForm
          action={(data) => captureSnapshotAction(slug, data)}
          label="Capture immutable snapshot"
          successMessage="Immutable snapshot captured"
        >
          <Select id="snapshot-source" name="sourceId" label="Evidence source" options={sources} />
          <div>
            <FieldLabel htmlFor="snapshot-content">Captured content</FieldLabel>
            <textarea id="snapshot-content" name="content" rows={10} required className={area} />
          </div>
          <div>
            <FieldLabel htmlFor="snapshot-media">Media type</FieldLabel>
            <input id="snapshot-media" name="mediaType" defaultValue="text/plain" className={field} />
          </div>
        </ActionForm>
      </section>

      <section className="border-line bg-surface rounded-panel border p-5">
        <p className="text-eyebrow text-navy-700">03 · Exact span</p>
        <h2 className="text-section-title text-ink-strong mt-1">Retain exact evidence</h2>
        <p className="text-meta text-ink-muted mt-1 mb-4">
          Paste one unique verbatim quote from the selected snapshot.
        </p>
        <ActionForm
          action={(data) => createEvidenceSpanAction(slug, data)}
          label="Retain exact evidence span"
          successMessage="Exact evidence span retained"
        >
          <Select id="span-snapshot" name="snapshotId" label="Snapshot" options={snapshots} />
          <div>
            <FieldLabel htmlFor="span-quote">Exact quote</FieldLabel>
            <textarea id="span-quote" name="exactText" rows={7} required className={area} />
          </div>
          <div>
            <FieldLabel htmlFor="span-label">Extraction label</FieldLabel>
            <input id="span-label" name="extractionLabel" className={field} />
          </div>
        </ActionForm>
      </section>
    </div>
  );
}

export function ClaimForms({
  slug,
  missions,
  spans,
  claims,
  canReview,
}: {
  slug: string;
  missions: Option[];
  spans: Option[];
  claims: Option[];
  canReview: boolean;
}) {
  return (
    <div className="grid gap-4 min-[900px]:grid-cols-2">
      <section className="border-line bg-surface rounded-panel border p-5">
        <p className="text-eyebrow text-navy-700">New governed claim</p>
        <h2 className="text-section-title text-ink-strong mt-1 mb-4">Create assertion v1</h2>
        <ActionForm
          action={(data) => createClaimAction(slug, data)}
          label="Create governed claim"
          successMessage="Claim created"
        >
          <Select id="claim-mission" name="missionId" label="Mission" options={missions} />
          <div>
            <FieldLabel htmlFor="claim-key">Claim key</FieldLabel>
            <input id="claim-key" name="claimKey" required className={field} placeholder="CLM-001" />
          </div>
          <div>
            <FieldLabel htmlFor="claim-statement">Statement</FieldLabel>
            <textarea id="claim-statement" name="statement" rows={4} required className={area} />
          </div>
          <div>
            <FieldLabel htmlFor="claim-value">Normalized value</FieldLabel>
            <input id="claim-value" name="normalizedValue" className={field} />
          </div>
          <Select id="claim-span" name="spanId" label="Evidence span" options={spans} required={false} />
          <div className="grid gap-3 min-[480px]:grid-cols-2">
            <div>
              <FieldLabel htmlFor="claim-relation">Evidence relation</FieldLabel>
              <select id="claim-relation" name="relation" className={field}>
                <option value="SUPPORTS">Supports</option>
                <option value="CONTRADICTS">Contradicts</option>
              </select>
            </div>
            <AccessSelect id="claim-access" />
          </div>
          <label className="text-meta text-ink flex items-center gap-2">
            <input name="hypothesis" type="checkbox" />
            Explicit hypothesis
          </label>
          <div>
            <FieldLabel htmlFor="claim-falsification">Falsification criterion</FieldLabel>
            <textarea id="claim-falsification" name="falsificationCriterion" rows={2} className={area} />
          </div>
          <p className="text-meta text-ink-muted">
            The current member is recorded as internal owner.
          </p>
        </ActionForm>
      </section>

      <div className="space-y-4">
        <section className="border-line bg-surface rounded-panel border p-5">
          <p className="text-eyebrow text-navy-700">Append-only ledger</p>
          <h2 className="text-section-title text-ink-strong mt-1 mb-4">Add assertion version</h2>
          <ActionForm
            action={(data) =>
              addClaimVersionAction(slug, String(data.get("claimId") ?? ""), data)
            }
            label="Append claim assertion"
            successMessage="Assertion version appended"
          >
            <Select id="version-claim" name="claimId" label="Claim" options={claims} />
            <div>
              <FieldLabel htmlFor="version-statement">Statement</FieldLabel>
              <textarea id="version-statement" name="statement" rows={3} required className={area} />
            </div>
            <div>
              <FieldLabel htmlFor="version-value">Normalized value</FieldLabel>
              <input id="version-value" name="normalizedValue" className={field} />
            </div>
            <Select id="version-span" name="spanId" label="Evidence span" options={spans} required={false} />
            <div>
              <FieldLabel htmlFor="version-relation">Evidence relation</FieldLabel>
              <select id="version-relation" name="relation" className={field}>
                <option value="SUPPORTS">Supports</option>
                <option value="CONTRADICTS">Contradicts</option>
              </select>
            </div>
            <AccessSelect id="version-access" />
          </ActionForm>
        </section>

        {canReview ? (
          <section className="border-line bg-surface rounded-panel border p-5">
            <p className="text-eyebrow text-navy-700">Human governance</p>
            <h2 className="text-section-title text-ink-strong mt-1 mb-4">Review claim</h2>
            <ActionForm
              action={(data) =>
                reviewClaimAction(slug, String(data.get("claimId") ?? ""), data)
              }
              label="Review governed claim"
              successMessage="Claim review retained"
            >
              <Select id="review-claim" name="claimId" label="Claim" options={claims} />
              <div>
                <FieldLabel htmlFor="review-reason">Review reason</FieldLabel>
                <textarea id="review-reason" name="reason" rows={2} required className={area} />
              </div>
              <AccessSelect id="review-access" />
              <div>
                <FieldLabel htmlFor="review-cadence">Review cadence (days)</FieldLabel>
                <input id="review-cadence" name="reviewCadenceDays" type="number" min="1" className={field} />
              </div>
            </ActionForm>
          </section>
        ) : null}

        <section className="border-line bg-surface rounded-panel border p-5">
          <p className="text-eyebrow text-navy-700">Honest null</p>
          <h2 className="text-section-title text-ink-strong mt-1 mb-4">Retain incomplete search</h2>
          <ActionForm
            action={(data) =>
              assertHonestNullAction(slug, String(data.get("claimId") ?? ""), data)
            }
            label="Retain honest null"
            successMessage="Honest-null record retained"
          >
            <Select id="null-claim" name="claimId" label="Claim" options={claims} />
            <div>
              <FieldLabel htmlFor="null-rationale">Rationale</FieldLabel>
              <textarea id="null-rationale" name="rationale" rows={3} required className={area} />
            </div>
            <p className="text-meta text-ink-muted">
              This records OPEN_INCOMPLETE. It never certifies absence.
            </p>
          </ActionForm>
        </section>
      </div>
    </div>
  );
}
