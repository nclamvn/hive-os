import { MathText } from "@/components/research/math-text";
import { getLrcCopy } from "@/i18n/math-pilot-copy";
import type { Locale } from "@/i18n/config";
import type { LrcFiniteScope } from "@/modules/research-sandbox/math-lrc-certificates";
import { lrcCertificateEvidenceSchema, validateRetainedLrcEvidence } from "@/modules/research-sandbox/math-lrc-replay";

/** Retained-only projection. No runner, filesystem read or subprocess occurs on GET. */
export function MathLrcEvidencePanel({ scope, contractDigest, evidence, locale }: {
  scope?: LrcFiniteScope; contractDigest: string; evidence: unknown; locale: Locale;
}) {
  const copy = getLrcCopy(locale);
  if (!scope) return <p className="text-meta text-ink-muted mt-3">{copy.absent}</p>;
  const parsed = lrcCertificateEvidenceSchema.safeParse(evidence);
  const valid = parsed.success && validateRetainedLrcEvidence(parsed.data, scope, contractDigest);
  return <section aria-label={copy.retained} className="border-line mt-4 min-w-0 rounded-lg border p-4">
    <h4 className="text-meta text-ink font-semibold">{copy.retained} · {valid ? "PASS" : "UNAVAILABLE / INVALID"}</h4>
    <p className="text-meta text-ink-muted mt-2"><MathText text={`${copy.domain}: $N=${scope.totalRunners}$, $M=${scope.modulus}$; $N-1$ ${copy.axes}.`} /></p>
    <p className="text-meta text-ink-muted mt-2 break-words">{scope.axes.map((axis) => `{${axis.join(", ")}}`).join(" × ")}</p>
    {valid && parsed.success ? <>
      <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
        {([[copy.covered, `${parsed.data.primary.coveredTuples}/${parsed.data.primary.totalTuples}`],
          [copy.witnesses, parsed.data.primary.witnessTuples], [copy.excluded, parsed.data.primary.gridExcludedTuples],
          [copy.unresolved, parsed.data.primary.unresolvedTuples]] as const).map(([label, value]) => <div key={label} className="min-w-0"><dt className="text-ink-muted">{label}</dt><dd className="text-ink mt-1 font-medium">{value}</dd></div>)}
      </dl>
      <div className="text-meta text-ink-muted mt-3 space-y-1 break-all">
        <p>Root SHA-256: {parsed.data.rootContractDigest}</p>
        <p>Scope SHA-256: {parsed.data.scopeDigest}</p><p>Certificate SHA-256: {parsed.data.primary.certificateDigest}</p>
        <p>Evidence SHA-256: {parsed.data.evidenceDigest}</p><p>Python SHA-256: {parsed.data.independent.scriptDigest}</p>
        <p>{parsed.data.primary.nodeCount} {copy.nodes} · {parsed.data.primary.leafCount} {copy.leaves} · {copy.replay}</p>
      </div>
    </> : <p role="status" className="text-meta text-ink-muted mt-3">{copy.invalid}</p>}
    <p className="text-meta text-ink-muted mt-3">{copy.limitation}</p>
  </section>;
}
