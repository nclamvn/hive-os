import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { localizedActionError } from "@/i18n/action-errors";
import { executionCopy } from "@/i18n/execution-copy";
import { enumLabel } from "@/i18n/format";
import { truthCopy } from "@/i18n/truth-copy";
import { verificationCopy } from "@/i18n/verification-copy";

function shape(value: unknown): unknown {
  if (Array.isArray(value)) return "array";
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, child]) => [key, shape(child)]),
    );
  }
  return typeof value;
}

describe("TIP-002B core locale contract", () => {
  it.each([
    ["truth", truthCopy],
    ["execution", executionCopy],
    ["verification", verificationCopy],
  ])(
    "%s keeps Vietnamese and English namespace shapes identical",
    (_, copy) => {
      expect(shape(copy.vi)).toEqual(shape(copy.en));
    },
  );

  it("localizes stable action error codes without depending on kernel prose", () => {
    const failure = {
      errorCode: "EVIDENCE_SPAN_MISMATCH",
      error: "The exact quote was not found",
    };
    expect(localizedActionError("vi", failure)).toBe(
      "Đoạn trích không khớp với snapshot bất biến.",
    );
    expect(localizedActionError("en", failure)).toBe(
      "EVIDENCE_SPAN_MISMATCH: The exact quote was not found",
    );
  });

  it("keeps unknown technical enums readable in English", () => {
    expect(enumLabel("en", "workspace.created")).toBe("Workspace Created");
    expect(enumLabel("en", "READY_WITH_DEFERRED")).toBe("Ready With Deferred");
  });

  it("translates obligation workflow states instead of leaking English into Vietnamese", () => {
    expect(enumLabel("vi", "OPEN")).toBe("Chưa bắt đầu");
    expect(enumLabel("vi", "IN_PROGRESS")).toBe("Đang thực hiện");
    expect(enumLabel("vi", "SATISFIED")).toBe("Đã hoàn thành");
    expect(enumLabel("vi", "BLOCKED")).toBe("Đang bị chặn");
  });

  it("renders governed content fields directly instead of passing them through translation", () => {
    const root = process.cwd();
    const mission = readFileSync(
      path.join(root, "src/components/mission/mission-workspace.tsx"),
      "utf8",
    );
    const evidence = readFileSync(
      path.join(root, "src/app/w/[workspaceSlug]/evidence/page.tsx"),
      "utf8",
    );
    const claims = readFileSync(
      path.join(root, "src/app/w/[workspaceSlug]/claims/page.tsx"),
      "utf8",
    );

    expect(mission).toContain("{mission.title}");
    expect(mission).toContain("{contract.objective}");
    expect(evidence).toContain("{span.exactText}");
    expect(claims).toContain("{claim.versions[0]?.statement}");
  });
});
