import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { LocalObjectStorage } from "@/server/storage/local";
import { assertValidObjectKey } from "@/server/storage/types";

describe("LocalObjectStorage", () => {
  let root: string;
  let storage: LocalObjectStorage;

  beforeEach(async () => {
    root = await mkdtemp(path.join(tmpdir(), "hiveos-storage-"));
    storage = new LocalObjectStorage(root);
  });

  afterEach(async () => {
    await rm(root, { recursive: true, force: true });
  });

  it("round-trips an object with content type", async () => {
    const body = new TextEncoder().encode("hello hive");
    const meta = await storage.put("ws1/artifacts/a.txt", body, {
      contentType: "text/plain",
    });
    expect(meta.size).toBe(body.byteLength);

    const read = await storage.get("ws1/artifacts/a.txt");
    expect(read).not.toBeNull();
    expect(new TextDecoder().decode(read!)).toBe("hello hive");

    const head = await storage.head("ws1/artifacts/a.txt");
    expect(head?.contentType).toBe("text/plain");
  });

  it("returns null for missing objects", async () => {
    expect(await storage.get("missing/key")).toBeNull();
    expect(await storage.head("missing/key")).toBeNull();
  });

  it("lists keys by prefix in sorted order", async () => {
    await storage.put("ws1/b.txt", new Uint8Array([1]));
    await storage.put("ws1/a.txt", new Uint8Array([1]));
    await storage.put("ws2/c.txt", new Uint8Array([1]));
    expect(await storage.list("ws1/")).toEqual(["ws1/a.txt", "ws1/b.txt"]);
    expect(await storage.list("")).toHaveLength(3);
  });

  it("deletes objects idempotently", async () => {
    await storage.put("ws1/x.txt", new Uint8Array([1]));
    await storage.delete("ws1/x.txt");
    await storage.delete("ws1/x.txt");
    expect(await storage.get("ws1/x.txt")).toBeNull();
  });

  it("rejects path traversal and malformed keys", async () => {
    for (const key of ["../etc/passwd", "/abs", "a\\b", "", "a\0b"]) {
      expect(() => assertValidObjectKey(key)).toThrowError(/Invalid object key/);
      await expect(storage.put(key, new Uint8Array([1]))).rejects.toThrow();
    }
  });
});
