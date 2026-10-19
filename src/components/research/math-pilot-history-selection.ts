/** Presentation-only selection from the current mission's already-authorized
 * loader results. Never use query IDs to fetch another case or widen scope. */
export function selectMathPilotHistory<Case extends { id: string }, Cycle extends { rootCaseId: string }>(
  cases: readonly Case[],
  cycles: readonly Cycle[],
  requestedCaseId: unknown,
) {
  const all = requestedCaseId === undefined || requestedCaseId === "";
  const selected = typeof requestedCaseId === "string"
    ? cases.find((item) => item.id === requestedCaseId) : undefined;
  const mode = all ? "ALL" : selected ? "SELECTED" : "INVALID";
  const visibleCases = all ? [...cases] : selected ? [selected] : [];
  const visibleIds = new Set(visibleCases.map((item) => item.id));
  return {
    mode,
    selectedCaseId: selected?.id ?? null,
    cases: visibleCases,
    cycles: cycles.filter((cycle) => visibleIds.has(cycle.rootCaseId)),
  };
}
