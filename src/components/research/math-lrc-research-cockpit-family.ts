const object = (value: unknown): Record<string, unknown> | null => value !== null && typeof value === "object" && !Array.isArray(value)
  ? value as Record<string, unknown> : null;
const keys = ["lrcMethodUnitScope", "lrcMethodUnitEvidence", "lrcMethodUnitFeedback", "lrcMethodUnitInput", "lrcMethodUnitAuditSummary",
  "lrcMethodUnitFiniteSeed", "lrcMethodUnitFiniteEvidence", "methodUnitEvidenceValid", "methodUnitInputBindingsValid", "methodUnitFindingsComplete", "methodInputBindingsValid", "finiteEvidenceValid"];
const marker = (value: unknown) => { const record = object(value); return !!record && keys.some(key => key in record); };

/** Broader than admission. A malformed new family must never regain legacy forms or cycles. */
export function isLrcResearchProgramRecord(contract: unknown, attempt?: unknown, ledger?: unknown): boolean {
  const c = object(contract), l = object(ledger);
  return !!(c?.version === 4 || c?.version === "4" || l?.version === 7 || l?.version === "7" ||
    marker(contract) || marker(attempt) || marker(ledger) || marker(l?.oracle) || marker(l?.reports) ||
    Array.isArray(l?.reports) && l.reports.some(marker));
}
