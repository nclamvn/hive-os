import { createHash } from "node:crypto";

import { describe, expect, it } from "vitest";

import {
  evidenceObjectKey,
  MAX_EVIDENCE_FILE_BYTES,
  prepareEvidenceFile,
} from "@/modules/truth-kernel/file-intake";
import { TruthError } from "@/modules/truth-kernel/errors";

describe("TIP-022 evidence file intake", () => {
  it("FILE-U01 retains exact UTF-8 text and hashes exact bytes", () => {
    const bytes = new TextEncoder().encode("motor_rpm,target\n1200,1250\n");
    const result = prepareEvidenceFile({
      bytes,
      filename: "bench.csv",
      mediaType: "text/csv",
    });
    expect(result.snapshotContent).toBe("motor_rpm,target\n1200,1250\n");
    expect(result.contentHash).toBe(
      createHash("sha256").update(bytes).digest("hex"),
    );
  });

  it("FILE-U02 retains a deterministic descriptor for binary evidence", () => {
    const bytes = Uint8Array.from([
      0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37,
    ]);
    const result = prepareEvidenceFile({
      bytes,
      filename: "../../flight-review.pdf",
      mediaType: "application/pdf",
    });
    expect(JSON.parse(result.snapshotContent)).toMatchObject({
      kind: "binary-evidence-descriptor",
      originalName: "flight-review.pdf",
      mediaType: "application/pdf",
      sizeBytes: 8,
    });
  });

  it.each([
    {
      name: "empty file",
      bytes: new Uint8Array(),
      filename: "empty.txt",
      mediaType: "text/plain",
    },
    {
      name: "oversized file",
      bytes: new Uint8Array(MAX_EVIDENCE_FILE_BYTES + 1),
      filename: "large.txt",
      mediaType: "text/plain",
    },
    {
      name: "unsupported media",
      bytes: new TextEncoder().encode("x"),
      filename: "run.exe",
      mediaType: "application/octet-stream",
    },
    {
      name: "forged PDF",
      bytes: new TextEncoder().encode("not a pdf"),
      filename: "forged.pdf",
      mediaType: "application/pdf",
    },
  ])("FILE-U03 rejects $name", (input) => {
    expect(() => prepareEvidenceFile(input)).toThrow(TruthError);
  });

  it("FILE-U04 creates a workspace and mission scoped digest key", () => {
    expect(
      evidenceObjectKey({
        workspaceId: "ws-1",
        missionId: "mission-2",
        sourceId: "source-3",
        contentHash: "a".repeat(64),
      }),
    ).toBe(
      `workspaces/ws-1/missions/mission-2/evidence/source-3/${"a".repeat(64)}`,
    );
  });
});
