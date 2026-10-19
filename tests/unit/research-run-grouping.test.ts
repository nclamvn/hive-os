import { describe, expect, it } from "vitest";

import { groupResearchRuns } from "@/components/research/group-research-runs";

const run = (id: string, question: string, missionId = "mission-a", created = 1) => ({
  id, question, missionId, createdAt: new Date(created), status: "FAILED",
  updatedAt: new Date(999),
});

describe("recent research grouping", () => {
  it("groups only whitespace-normalized questions in the same mission", () => {
    const attempts = [run("old", " Prove  A = B\n", "a", 1), run("new", "Prove A = B", "a", 2),
      run("other-mission", "Prove A = B", "b", 3)];
    const grouped = groupResearchRuns(attempts);
    expect(grouped).toHaveLength(2);
    expect(grouped[0].latest.id).toBe("other-mission");
    expect(grouped[1].latest.id).toBe("new");
    expect(grouped[1].previous.map((item) => item.id)).toEqual(["old"]);
    expect(attempts.map((item) => item.id)).toEqual(["old", "new", "other-mission"]);
  });

  it("does not merge case, mathematical symbols, punctuation or semantically similar statements", () => {
    const questions = ["A = B", "a = b", "A ≠ B", "A = B?", "B = A", "A=B"];
    expect(groupResearchRuns(questions.map((q, i) => run(String(i), q)))).toHaveLength(questions.length);
  });

  it("keeps latest attempt by creation time, not by old review update time", () => {
    const old = { ...run("old", "Q", "m", 1), updatedAt: new Date(9999), status: "APPROVED" };
    const latest = { ...run("new", "Q", "m", 2), updatedAt: new Date(2) };
    const grouped = groupResearchRuns([old, latest]);
    expect(grouped[0].latest).toBe(latest);
    expect(grouped[0].previous).toEqual([old]);
  });

  it("retains every earlier attempt, including active and reviewable ones", () => {
    const attempts = ["QUEUED", "RUNNING", "AWAITING_REVIEW", "APPROVED", "FAILED"].map((status, i) =>
      ({ ...run(String(i), "Q", "m", i), status }),
    );
    const grouped = groupResearchRuns(attempts);
    expect(grouped[0].latest.status).toBe("FAILED");
    expect(grouped[0].previous.map((item) => item.status)).toEqual(["APPROVED", "AWAITING_REVIEW", "RUNNING", "QUEUED"]);
    expect([grouped[0].latest, ...grouped[0].previous]).toHaveLength(attempts.length);
  });

  it("uses a deterministic ID tie break and avoids delimiter collisions", () => {
    const grouped = groupResearchRuns([run("a", "b:c", "a"), run("b", "c", "a:b"), run("z", "b:c", "a")]);
    expect(grouped).toHaveLength(2);
    expect(grouped[0].latest.id).toBe("z");
    expect(grouped[0].previous[0].id).toBe("a");
  });

  it("never conflates missing questions, and supports an empty list", () => {
    expect(groupResearchRuns([run("one", ""), run("two", " \n")])).toHaveLength(2);
    expect(groupResearchRuns([run("one", ""), run("two", "one")])).toHaveLength(2);
    expect(groupResearchRuns([])).toEqual([]);
  });
});
