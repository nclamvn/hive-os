type ResearchAttempt = {
  id: string;
  missionId: string;
  question: string;
  createdAt: Date;
};

/** Presentation only. Case, symbols and punctuation remain significant. */
export function groupResearchRuns<T extends ResearchAttempt>(runs: readonly T[]) {
  const groups = new Map<string, T[]>();
  const ordered = [...runs].sort((a, b) =>
    b.createdAt.getTime() - a.createdAt.getTime() || b.id.localeCompare(a.id),
  );
  for (const run of ordered) {
    // Normalize whitespace only: mathematical statements must never be merged
    // using case folding, punctuation removal or semantic similarity.
    const question = run.question.trim().replace(/\s+/gu, " ");
    const key = JSON.stringify([run.missionId, question ? ["question", question] : ["missing", run.id]]);
    const attempts = groups.get(key);
    if (attempts) attempts.push(run);
    else groups.set(key, [run]);
  }
  return [...groups.values()].map(([latest, ...previous]) => ({ latest, previous }));
}
