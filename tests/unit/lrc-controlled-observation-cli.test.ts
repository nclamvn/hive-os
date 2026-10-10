import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { assertObservationLocalEnvironment, writeCompleteObservationReceipt } from "@/server/operations/lrc-controlled-observation";

const entry = join(process.cwd(), "scripts/operations/lrc-controlled-observation.ts");
function refusedCli(args: string[]) {
  // Node process only. Production guard prevents import of DB/auth/provider runtime;
  // no Codex CLI/login or network/DB query occurs in these tests.
  return spawnSync(process.execPath, ["--import", "tsx", entry, ...args], {
    env: { PATH: process.env.PATH, NODE_ENV: "production", DATABASE_URL: "postgresql://never:secret@remote/never" },
    encoding: "utf8", timeout: 10_000,
  });
}
describe("TIP-062 CLI offline fail-closed receipt", () => {
  it("invalid environment refuses before runtime import and creates private sanitized receipt", async () => {
    const directory = await mkdtemp(join(tmpdir(), "tip062-cli-offline-")); const path = join(directory, "receipt.jsonl");
    const result = refusedCli(["preflight", "--actor-email", "explicit@test.invalid", "--receipt", path]);
    expect(result.status).toBe(1); expect(result.stdout + result.stderr).not.toContain("secret");
    const records = (await readFile(path, "utf8")).trim().split("\n").map(line => JSON.parse(line));
    expect(records.at(-1)).toMatchObject({ status: "NOT_RUN", code: "LOCAL_ENVIRONMENT_REQUIRED" });
    expect((await stat(path)).mode & 0o777).toBe(0o600);
    expect(JSON.stringify(records)).not.toContain("postgresql");
  });
  it("existing operator receipt is not replaced", async () => {
    const directory = await mkdtemp(join(tmpdir(), "tip062-cli-offline-")); const path = join(directory, "receipt.jsonl");
    await writeFile(path, "preserved receipt", { flag: "wx", mode: 0o600 });
    expect(refusedCli(["preflight", "--actor-user-id", "explicit", "--receipt", path]).status).toBe(1);
    expect(await readFile(path, "utf8")).toBe("preserved receipt");
  });
  it.each([
    { args: ["run", "--actor-user-id", "explicit"] },
    { args: ["preflight", "--activate-local", "--actor-user-id", "explicit"] },
    { args: ["preflight", "--actor-email", "a", "--actor-user-id", "b"] },
    { args: ["preflight", "--model", "gpt-other"] },
  ])("unsupported/unconfirmed invocation $args fails before import", ({ args }) => {
    const result = refusedCli(args); expect(result.status).toBe(1); expect(result.stderr).toContain("refused CLI invocation");
  });
  it.each(["RESEARCH_WORKER_ENABLED", "RESEARCH_OPENAI_ENABLED", "SANDBOX_DOCKER_ENABLED"])("pure guard refuses enabled %s", key => {
    expect(() => assertObservationLocalEnvironment({ NODE_ENV: "development", DATABASE_URL: "postgresql://x@localhost/hiveos_dev", [key]: "true" })).toThrow("UNSAFE_SHARED_CAPABILITY_OR_MODEL");
  });
  it("pure guard refuses model override and admits fixed local database without creating runtime", () => {
    expect(() => assertObservationLocalEnvironment({ NODE_ENV: "development", DATABASE_URL: "postgresql://x@localhost/hiveos_dev", MATH_REVIEW_ADVERSARY_MODEL: "other" })).toThrow();
    expect(() => assertObservationLocalEnvironment({ NODE_ENV: "development", DATABASE_URL: "postgresql://x@localhost/hiveos_dev" })).not.toThrow();
  });
  it.each([
    "host=remote.example", "host=%2Fprivate%2Ftmp", "h%6fst=remote.example",
    "hostaddr=192.0.2.1", "port=5433", "service=remote", "servicefile=%2Ftmp%2Fpg-service",
    "connectionString=postgresql%3A%2F%2Fremote%2Fother", "user=other", "password=other",
    "sslcert=%2Ftmp%2Fcertificate", "options=-c%20search_path%3Dother",
  ])("connection query override %s refuses before runtime import", query => {
    expect(() => assertObservationLocalEnvironment({ NODE_ENV: "development",
      DATABASE_URL: `postgresql://x@127.0.0.1/hiveos_dev?${query}` })).toThrow("DATABASE_CONNECTION_OVERRIDE_FORBIDDEN");
  });
  it("ordinary schema=public remains compatible without loading a database client", () => {
    expect(() => assertObservationLocalEnvironment({ NODE_ENV: "development",
      DATABASE_URL: "postgresql://x@127.0.0.1/hiveos_dev?schema=public" })).not.toThrow();
  });
  it.each(["schema=public&schema=public", "schema=other", "schema=public&host=remote"])("noncanonical schema query %s refuses", query => {
    expect(() => assertObservationLocalEnvironment({ NODE_ENV: "development",
      DATABASE_URL: `postgresql://x@127.0.0.1/hiveos_dev?${query}` })).toThrow("DATABASE_CONNECTION_OVERRIDE_FORBIDDEN");
  });
});

describe("TIP-062 injected complete-byte receipt writer", () => {
  it("serial short writes retain every UTF-8 byte and sync only once after completion", async () => {
    const text = `${JSON.stringify({ event: "FINAL", note: "Việt Nam 🐝", usage: null })}\n`;
    const chunks: Buffer[] = []; let call = 0;
    const sync = vi.fn(async () => { expect(Buffer.concat(chunks).toString("utf8")).toBe(text); });
    const write = vi.fn(async (buffer: Buffer, offset: number, length: number) => {
      const count = Math.min([1, 2, 7][call++ % 3], length);
      chunks.push(Buffer.from(buffer.subarray(offset, offset + count)));
      return { bytesWritten: count };
    });
    await writeCompleteObservationReceipt(text, { write, sync });
    expect(write.mock.calls.length).toBeGreaterThan(1); expect(sync).toHaveBeenCalledOnce();
    expect(Buffer.concat(chunks)).toEqual(Buffer.from(text, "utf8"));
  });
  it.each([0, -1, 999, 0.5, Number.NaN])("impossible/no-progress write count %s refuses without sync", async bytesWritten => {
    const sync = vi.fn(async () => {});
    await expect(writeCompleteObservationReceipt("record\n", { write: async () => ({ bytesWritten }), sync })).rejects.toThrow("RECEIPT_WRITE_NO_PROGRESS_OR_INVALID_COUNT");
    expect(sync).not.toHaveBeenCalled();
  });
  it("partial write followed by disk failure propagates without syncing or resetting offset", async () => {
    const offsets: number[] = []; const sync = vi.fn(async () => {});
    await expect(writeCompleteObservationReceipt("record\n", { write: async (_buffer, offset) => {
      offsets.push(offset); if (offset === 0) return { bytesWritten: 2 }; throw new Error("disk fault");
    }, sync })).rejects.toThrow("disk fault");
    expect(offsets).toEqual([0, 2]); expect(sync).not.toHaveBeenCalled();
  });
  it("sync failure after all bytes propagates and cannot claim durability", async () => {
    await expect(writeCompleteObservationReceipt("record\n", { write: async (_buffer, _offset, length) => ({ bytesWritten: length }),
      sync: async () => { throw new Error("sync fault"); } })).rejects.toThrow("sync fault");
  });
});
