import { describe, expect, it } from "vitest";

import {
  classifyTransition,
  enumerateTransitions,
} from "@/modules/mission-kernel/state-machine";
import { computeProgress } from "@/modules/mission-kernel/progress";
import {
  assurancePolicy,
  isAssuranceDowngrade,
} from "@/modules/mission-kernel/assurance";

const ALL = [
  "DRAFT", "INTAKE", "SCOPED", "CONTRACT_REVIEW", "APPROVED",
  "EXPLORING", "BUILDING", "VERIFYING", "REVIEW", "RELEASED",
  "PARTIAL", "BLOCKED", "REFUTED", "CANCELLED", "ARCHIVED",
] as const;

describe("mission state machine (MK-34 table-driven)", () => {
  it("primary transitions include the implemented truth loop entry", () => {
    expect(classifyTransition("DRAFT", "INTAKE").kind).toBe("primary");
    expect(classifyTransition("INTAKE", "SCOPED").kind).toBe("primary");
    expect(classifyTransition("SCOPED", "CONTRACT_REVIEW").kind).toBe("primary");
    expect(classifyTransition("CONTRACT_REVIEW", "APPROVED").kind).toBe("primary");
    expect(classifyTransition("APPROVED", "EXPLORING").kind).toBe("primary");
  });

  it("execution and verification governance own the governed forward path", () => {
    expect(classifyTransition("EXPLORING", "BUILDING")).toMatchObject({ kind: "execution" });
    expect(classifyTransition("BUILDING", "VERIFYING")).toMatchObject({ kind: "verification" });
    expect(classifyTransition("VERIFYING", "REVIEW")).toMatchObject({ kind: "verification" });
    expect(classifyTransition("REVIEW", "RELEASED")).toMatchObject({ kind: "release" });
  });

  it("archived is terminal — no outgoing transition is valid", () => {
    for (const to of ALL) {
      expect(classifyTransition("ARCHIVED", to).kind).toBe("invalid");
    }
  });

  it("blockable states can be blocked; others cannot", () => {
    for (const from of ["INTAKE", "SCOPED", "CONTRACT_REVIEW", "APPROVED", "EXPLORING", "BUILDING", "VERIFYING", "REVIEW"] as const) {
      expect(classifyTransition(from, "BLOCKED").kind).toBe("block");
    }
    expect(classifyTransition("DRAFT", "BLOCKED").kind).toBe("invalid");
  });

  it("side-state destinations require a decision", () => {
    expect(classifyTransition("APPROVED", "CANCELLED").kind).toBe("decision");
    expect(classifyTransition("APPROVED", "PARTIAL").kind).toBe("decision");
    expect(classifyTransition("APPROVED", "REFUTED").kind).toBe("decision");
  });

  it("every enumerated transition classifies to its declared kind", () => {
    for (const t of enumerateTransitions()) {
      expect(classifyTransition(t.from, t.to).kind).toBe(t.kind);
    }
  });

  it("random cross products are invalid unless declared", () => {
    const declared = new Set(enumerateTransitions().map((t) => `${t.from}->${t.to}`));
    for (const from of ALL) {
      for (const to of ALL) {
        if (from === to) continue;
        const kind = classifyTransition(from, to).kind;
        const isResume = from === "BLOCKED" && to !== "ARCHIVED";
        if (!declared.has(`${from}->${to}`) && !isResume) {
          expect(kind).toBe("invalid");
        }
      }
    }
  });
});

describe("progress semantics (MK-18/19)", () => {
  it("counts only SATISFIED and WAIVED as closed", () => {
    const p = computeProgress([
      { status: "SATISFIED", weight: 2 },
      { status: "WAIVED", weight: 3 },
      { status: "OPEN", weight: 1 },
      { status: "IN_PROGRESS", weight: 2 },
      { status: "BLOCKED", weight: 2 },
    ]);
    expect(p.totalWeight).toBe(10);
    expect(p.closedWeight).toBe(5);
    expect(p.basisPoints).toBe(5000);
  });

  it("floors basis points", () => {
    const p = computeProgress([
      { status: "SATISFIED", weight: 1 },
      { status: "OPEN", weight: 2 },
    ]);
    expect(p.basisPoints).toBe(3333);
  });
});

describe("assurance policy", () => {
  it("Research and Regulated require verification with open gate templates", () => {
    expect(assurancePolicy("RESEARCH").gateTemplates.length).toBeGreaterThan(0);
    expect(assurancePolicy("REGULATED").approvalOwnerOnly).toBe(true);
    expect(assurancePolicy("QUICK").publicReleaseEligible).toBe(false);
  });

  it("detects downgrades", () => {
    expect(isAssuranceDowngrade("REGULATED", "QUICK")).toBe(true);
    expect(isAssuranceDowngrade("QUICK", "RESEARCH")).toBe(false);
  });
});
