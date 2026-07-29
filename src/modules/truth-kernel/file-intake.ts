import { createHash } from "node:crypto";
import path from "node:path";

import { TruthError, TruthErrorCode } from "./errors";

export const MAX_EVIDENCE_FILE_BYTES = 10 * 1024 * 1024;

const MEDIA_BY_EXTENSION: Readonly<Record<string, string>> = {
  ".csv": "text/csv",
  ".json": "application/json",
  ".md": "text/markdown",
  ".markdown": "text/markdown",
  ".txt": "text/plain",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

const TEXT_MEDIA = new Set([
  "text/plain",
  "text/csv",
  "text/markdown",
  "application/json",
]);

export interface PreparedEvidenceFile {
  bytes: Uint8Array;
  contentHash: string;
  mediaType: string;
  originalName: string;
  snapshotContent: string;
  sizeBytes: number;
}

function normalizedFilename(value: string): string {
  const name = value
    .split(/[\\/]/)
    .pop()!
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim()
    .slice(0, 180);
  return name || "evidence-file";
}

function hasPrefix(bytes: Uint8Array, signature: readonly number[]): boolean {
  return signature.every((value, index) => bytes[index] === value);
}

function assertBinarySignature(mediaType: string, bytes: Uint8Array): void {
  const valid =
    mediaType === "application/pdf"
      ? hasPrefix(bytes, [0x25, 0x50, 0x44, 0x46, 0x2d])
      : mediaType === "image/png"
        ? hasPrefix(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
        : mediaType === "image/jpeg"
          ? hasPrefix(bytes, [0xff, 0xd8, 0xff])
          : mediaType === "image/webp"
            ? hasPrefix(bytes, [0x52, 0x49, 0x46, 0x46]) &&
              String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
            : true;
  if (!valid) {
    throw new TruthError(
      TruthErrorCode.Invariant,
      "File content does not match its declared media type",
    );
  }
}

function resolveMediaType(filename: string, declaredType: string): string {
  const extensionType = MEDIA_BY_EXTENSION[path.extname(filename).toLowerCase()];
  const normalizedDeclared = declaredType.split(";")[0]?.trim().toLowerCase();
  const mediaType = normalizedDeclared || extensionType;
  if (!mediaType || !Object.values(MEDIA_BY_EXTENSION).includes(mediaType)) {
    throw new TruthError(
      TruthErrorCode.Invariant,
      "Unsupported evidence file type",
    );
  }
  if (
    normalizedDeclared &&
    extensionType &&
    normalizedDeclared !== extensionType &&
    !(normalizedDeclared === "text/plain" && TEXT_MEDIA.has(extensionType))
  ) {
    throw new TruthError(
      TruthErrorCode.Invariant,
      "Filename extension does not match the declared media type",
    );
  }
  return extensionType && normalizedDeclared === "text/plain"
    ? extensionType
    : mediaType;
}

export function prepareEvidenceFile(input: {
  bytes: Uint8Array;
  filename: string;
  mediaType: string;
}): PreparedEvidenceFile {
  if (input.bytes.byteLength === 0) {
    throw new TruthError(TruthErrorCode.Invariant, "Evidence file is empty");
  }
  if (input.bytes.byteLength > MAX_EVIDENCE_FILE_BYTES) {
    throw new TruthError(
      TruthErrorCode.Invariant,
      `Evidence file exceeds ${MAX_EVIDENCE_FILE_BYTES} bytes`,
    );
  }

  const originalName = normalizedFilename(input.filename);
  const mediaType = resolveMediaType(originalName, input.mediaType);
  const contentHash = createHash("sha256").update(input.bytes).digest("hex");
  let snapshotContent: string;

  if (TEXT_MEDIA.has(mediaType)) {
    try {
      snapshotContent = new TextDecoder("utf-8", { fatal: true }).decode(
        input.bytes,
      );
    } catch {
      throw new TruthError(
        TruthErrorCode.Invariant,
        "Text evidence must be valid UTF-8",
      );
    }
    if (mediaType === "application/json") {
      try {
        JSON.parse(snapshotContent);
      } catch {
        throw new TruthError(
          TruthErrorCode.Invariant,
          "JSON evidence is not valid JSON",
        );
      }
    }
  } else {
    assertBinarySignature(mediaType, input.bytes);
    snapshotContent = JSON.stringify({
      kind: "binary-evidence-descriptor",
      mediaType,
      originalName,
      sha256: contentHash,
      sizeBytes: input.bytes.byteLength,
    });
  }

  return {
    bytes: input.bytes,
    contentHash,
    mediaType,
    originalName,
    snapshotContent,
    sizeBytes: input.bytes.byteLength,
  };
}

export function evidenceObjectKey(input: {
  workspaceId: string;
  missionId: string;
  sourceId: string;
  contentHash: string;
}): string {
  return [
    "workspaces",
    input.workspaceId,
    "missions",
    input.missionId,
    "evidence",
    input.sourceId,
    input.contentHash,
  ].join("/");
}
