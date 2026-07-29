"use client";

import { type FormEvent, type ReactNode, useState } from "react";
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
import { usePreferences } from "@/components/preferences/preferences-provider";
import { localizedActionError } from "@/i18n/action-errors";
import { useTruthCopy } from "@/i18n/use-core-copy";

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
    <label
      htmlFor={htmlFor}
      className="text-meta text-ink mb-1 block font-medium"
    >
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
  const { locale } = usePreferences();
  const copy = useTruthCopy();
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
    <form
      aria-label={label}
      onSubmit={submit}
      className={`space-y-3 ${className}`}
    >
      {children}
      {result ? (
        <p
          role={result.ok ? "status" : "alert"}
          className={`text-meta ${result.ok ? "text-success-600" : "text-danger-600"}`}
        >
          {result.ok ? successMessage : localizedActionError(locale, result)}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={busy}
        className="text-body bg-navy-800 hover:bg-navy-900 inline-flex h-10 items-center rounded-md px-4 font-medium text-white disabled:opacity-50"
      >
        {busy ? copy.common.saving : copy.common.save}
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
  const copy = useTruthCopy();
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <select id={id} name={name} required={required} className={field}>
        <option value="">
          {required ? copy.common.select : copy.common.none}
        </option>
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
  const copy = useTruthCopy();
  return (
    <div>
      <FieldLabel htmlFor={id}>{copy.common.accessLevel}</FieldLabel>
      <select
        id={id}
        name="accessLevel"
        defaultValue="WORKSPACE"
        className={field}
      >
        <option value="WORKSPACE">{copy.common.workspace}</option>
        <option value="RESTRICTED">{copy.common.restricted}</option>
        <option value="PUBLIC">{copy.common.publicCandidate}</option>
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
  const copy = useTruthCopy();
  return (
    <div className="instrument-panel grid overflow-hidden min-[900px]:grid-cols-3">
      <section className="border-line p-5 max-[899px]:border-b min-[900px]:border-r">
        <p className="text-eyebrow text-navy-700">{copy.evidence.sourceStep}</p>
        <h2 className="text-section-title text-ink-strong mt-1">
          {copy.evidence.sourceTitle}
        </h2>
        <p className="text-meta text-ink-muted mt-1 mb-4">
          {copy.evidence.sourceHint}
        </p>
        <ActionForm
          action={(data) => createEvidenceSourceAction(slug, data)}
          label={copy.evidence.sourceForm}
          successMessage={copy.evidence.sourceSuccess}
        >
          <Select
            id="source-mission"
            name="missionId"
            label={copy.common.mission}
            options={missions}
          />
          <div>
            <FieldLabel htmlFor="source-title">
              {copy.evidence.sourceName}
            </FieldLabel>
            <input id="source-title" name="title" required className={field} />
          </div>
          <div>
            <FieldLabel htmlFor="source-uri">
              {copy.evidence.canonicalUri}
            </FieldLabel>
            <input
              id="source-uri"
              name="canonicalUri"
              type="url"
              required
              className={field}
            />
          </div>
          <div className="grid gap-3 min-[480px]:grid-cols-2">
            <div>
              <FieldLabel htmlFor="source-type">
                {copy.evidence.sourceType}
              </FieldLabel>
              <input
                id="source-type"
                name="sourceType"
                defaultValue="document"
                className={field}
              />
            </div>
            <div>
              <FieldLabel htmlFor="independence-key">
                {copy.evidence.independenceKey}
              </FieldLabel>
              <input
                id="independence-key"
                name="independenceKey"
                required
                className={field}
              />
            </div>
          </div>
          <AccessSelect id="source-access" />
          <label className="text-meta text-ink flex items-start gap-2">
            <input
              name="qualifiesForCorroboration"
              type="checkbox"
              className="mt-0.5"
            />
            {copy.evidence.corroboration}
          </label>
        </ActionForm>
      </section>

      <section className="border-line p-5 max-[899px]:border-b min-[900px]:border-r">
        <p className="text-eyebrow text-navy-700">
          {copy.evidence.snapshotStep}
        </p>
        <h2 className="text-section-title text-ink-strong mt-1">
          {copy.evidence.snapshotTitle}
        </h2>
        <p className="text-meta text-ink-muted mt-1 mb-4">
          {copy.evidence.snapshotHint}
        </p>
        <ActionForm
          action={(data) => captureSnapshotAction(slug, data)}
          label={copy.evidence.snapshotForm}
          successMessage={copy.evidence.snapshotSuccess}
        >
          <Select
            id="snapshot-source"
            name="sourceId"
            label={copy.evidence.source}
            options={sources}
          />
          <div>
            <FieldLabel htmlFor="snapshot-content">
              {copy.evidence.capturedContent}
            </FieldLabel>
            <textarea
              id="snapshot-content"
              name="content"
              rows={10}
              required
              className={area}
            />
          </div>
          <div>
            <FieldLabel htmlFor="snapshot-media">
              {copy.evidence.mediaType}
            </FieldLabel>
            <input
              id="snapshot-media"
              name="mediaType"
              defaultValue="text/plain"
              className={field}
            />
          </div>
        </ActionForm>
      </section>

      <section className="p-5">
        <p className="text-eyebrow text-navy-700">{copy.evidence.spanStep}</p>
        <h2 className="text-section-title text-ink-strong mt-1">
          {copy.evidence.spanTitle}
        </h2>
        <p className="text-meta text-ink-muted mt-1 mb-4">
          {copy.evidence.spanHint}
        </p>
        <ActionForm
          action={(data) => createEvidenceSpanAction(slug, data)}
          label={copy.evidence.spanForm}
          successMessage={copy.evidence.spanSuccess}
        >
          <Select
            id="span-snapshot"
            name="snapshotId"
            label={copy.evidence.snapshot}
            options={snapshots}
          />
          <div>
            <FieldLabel htmlFor="span-quote">
              {copy.evidence.exactQuote}
            </FieldLabel>
            <textarea
              id="span-quote"
              name="exactText"
              rows={7}
              required
              className={area}
            />
          </div>
          <div>
            <FieldLabel htmlFor="span-label">
              {copy.evidence.extractionLabel}
            </FieldLabel>
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
  const copy = useTruthCopy();
  return (
    <div className="grid gap-5 min-[900px]:grid-cols-2">
      <section className="instrument-panel p-5">
        <p className="text-eyebrow text-navy-700">{copy.claims.newEyebrow}</p>
        <h2 className="text-section-title text-ink-strong mt-1 mb-4">
          {copy.claims.newTitle}
        </h2>
        <ActionForm
          action={(data) => createClaimAction(slug, data)}
          label={copy.claims.createForm}
          successMessage={copy.claims.createSuccess}
        >
          <Select
            id="claim-mission"
            name="missionId"
            label={copy.common.mission}
            options={missions}
          />
          <div>
            <FieldLabel htmlFor="claim-key">{copy.claims.claimKey}</FieldLabel>
            <input
              id="claim-key"
              name="claimKey"
              required
              className={field}
              placeholder="CLM-001"
            />
          </div>
          <div>
            <FieldLabel htmlFor="claim-statement">
              {copy.common.statement}
            </FieldLabel>
            <textarea
              id="claim-statement"
              name="statement"
              rows={4}
              required
              className={area}
            />
          </div>
          <div>
            <FieldLabel htmlFor="claim-value">
              {copy.common.normalizedValue}
            </FieldLabel>
            <input id="claim-value" name="normalizedValue" className={field} />
          </div>
          <Select
            id="claim-span"
            name="spanId"
            label={copy.common.evidenceSpan}
            options={spans}
            required={false}
          />
          <div className="grid gap-3 min-[480px]:grid-cols-2">
            <div>
              <FieldLabel htmlFor="claim-relation">
                {copy.common.evidenceRelation}
              </FieldLabel>
              <select id="claim-relation" name="relation" className={field}>
                <option value="SUPPORTS">{copy.common.supports}</option>
                <option value="CONTRADICTS">{copy.common.contradicts}</option>
              </select>
            </div>
            <AccessSelect id="claim-access" />
          </div>
          <label className="text-meta text-ink flex items-center gap-2">
            <input name="hypothesis" type="checkbox" />
            {copy.claims.explicitHypothesis}
          </label>
          <div>
            <FieldLabel htmlFor="claim-falsification">
              {copy.claims.falsification}
            </FieldLabel>
            <textarea
              id="claim-falsification"
              name="falsificationCriterion"
              rows={2}
              className={area}
            />
          </div>
          <p className="text-meta text-ink-muted">{copy.claims.ownerNote}</p>
        </ActionForm>
      </section>

      <div className="space-y-4">
        <section className="instrument-panel p-5">
          <p className="text-eyebrow text-navy-700">
            {copy.claims.ledgerEyebrow}
          </p>
          <h2 className="text-section-title text-ink-strong mt-1 mb-4">
            {copy.claims.ledgerTitle}
          </h2>
          <ActionForm
            action={(data) =>
              addClaimVersionAction(
                slug,
                String(data.get("claimId") ?? ""),
                data,
              )
            }
            label={copy.claims.appendForm}
            successMessage={copy.claims.appendSuccess}
          >
            <Select
              id="version-claim"
              name="claimId"
              label={copy.common.claim}
              options={claims}
            />
            <div>
              <FieldLabel htmlFor="version-statement">
                {copy.common.statement}
              </FieldLabel>
              <textarea
                id="version-statement"
                name="statement"
                rows={3}
                required
                className={area}
              />
            </div>
            <div>
              <FieldLabel htmlFor="version-value">
                {copy.common.normalizedValue}
              </FieldLabel>
              <input
                id="version-value"
                name="normalizedValue"
                className={field}
              />
            </div>
            <Select
              id="version-span"
              name="spanId"
              label={copy.common.evidenceSpan}
              options={spans}
              required={false}
            />
            <div>
              <FieldLabel htmlFor="version-relation">
                {copy.common.evidenceRelation}
              </FieldLabel>
              <select id="version-relation" name="relation" className={field}>
                <option value="SUPPORTS">{copy.common.supports}</option>
                <option value="CONTRADICTS">{copy.common.contradicts}</option>
              </select>
            </div>
            <AccessSelect id="version-access" />
          </ActionForm>
        </section>

        {canReview ? (
          <section className="instrument-panel p-5">
            <p className="text-eyebrow text-navy-700">
              {copy.claims.governanceEyebrow}
            </p>
            <h2 className="text-section-title text-ink-strong mt-1 mb-4">
              {copy.claims.reviewTitle}
            </h2>
            <ActionForm
              action={(data) =>
                reviewClaimAction(slug, String(data.get("claimId") ?? ""), data)
              }
              label={copy.claims.reviewForm}
              successMessage={copy.claims.reviewSuccess}
            >
              <Select
                id="review-claim"
                name="claimId"
                label={copy.common.claim}
                options={claims}
              />
              <div>
                <FieldLabel htmlFor="review-reason">
                  {copy.claims.reviewReason}
                </FieldLabel>
                <textarea
                  id="review-reason"
                  name="reason"
                  rows={2}
                  required
                  className={area}
                />
              </div>
              <AccessSelect id="review-access" />
              <div>
                <FieldLabel htmlFor="review-cadence">
                  {copy.claims.reviewCadence}
                </FieldLabel>
                <input
                  id="review-cadence"
                  name="reviewCadenceDays"
                  type="number"
                  min="1"
                  className={field}
                />
              </div>
            </ActionForm>
          </section>
        ) : null}

        <section className="instrument-panel p-5">
          <p className="text-eyebrow text-navy-700">
            {copy.claims.nullEyebrow}
          </p>
          <h2 className="text-section-title text-ink-strong mt-1 mb-4">
            {copy.claims.nullTitle}
          </h2>
          <ActionForm
            action={(data) =>
              assertHonestNullAction(
                slug,
                String(data.get("claimId") ?? ""),
                data,
              )
            }
            label={copy.claims.nullForm}
            successMessage={copy.claims.nullSuccess}
          >
            <Select
              id="null-claim"
              name="claimId"
              label={copy.common.claim}
              options={claims}
            />
            <div>
              <FieldLabel htmlFor="null-rationale">
                {copy.claims.rationale}
              </FieldLabel>
              <textarea
                id="null-rationale"
                name="rationale"
                rows={3}
                required
                className={area}
              />
            </div>
            <p className="text-meta text-ink-muted">{copy.claims.nullNote}</p>
          </ActionForm>
        </section>
      </div>
    </div>
  );
}
