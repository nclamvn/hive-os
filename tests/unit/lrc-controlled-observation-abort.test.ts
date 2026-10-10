import { EventEmitter } from "node:events";
import { spawn } from "node:child_process";
import { afterEach, describe, expect, it, vi } from "vitest";
import { runCodex } from "@/modules/research-sandbox/adapters/codex-local-math";
vi.mock("node:child_process", async original => ({ ...await original<typeof import("node:child_process")>(), spawn: vi.fn() }));
function child() {
  const events = new EventEmitter();
  const stdout = Object.assign(new EventEmitter(), { setEncoding: vi.fn() });
  const stderr = new EventEmitter();
  const kill = vi.fn(() => true);
  const stub = Object.assign(events, { stdout, stderr, kill, stdin: { end: vi.fn() } });
  vi.mocked(spawn).mockReturnValue(stub as unknown as ReturnType<typeof spawn>);
  return stub;
}
afterEach(() => { vi.useRealTimers(); vi.mocked(spawn).mockReset(); });
describe("TIP-062 owned Codex process cancellation (transport stubs, no CLI)", () => {
  it("already-aborted signal refuses without spawning", async () => {
    const controller = new AbortController(); controller.abort();
    await expect(runCodex("never", [], "/tmp", "", false, controller.signal)).rejects.toThrow(); expect(spawn).not.toHaveBeenCalled();
  });
  it("abort kills only owned child and waits for close; cleans timer/listener", async () => {
    vi.useFakeTimers(); const stub = child(); const controller = new AbortController();
    const remove = vi.spyOn(controller.signal, "removeEventListener");
    let settled = false; const operation = runCodex("never", [], "/tmp", "", false, controller.signal).catch(error => { settled = true; throw error; });
    controller.abort(); await Promise.resolve(); expect(stub.kill).toHaveBeenCalledWith("SIGKILL"); expect(settled).toBe(false);
    stub.emit("close", null); await expect(operation).rejects.toThrow(); expect(remove).toHaveBeenCalledWith("abort", expect.any(Function)); expect(vi.getTimerCount()).toBe(0);
  });
  it("successful close removes timer/listener and later abort cannot kill it", async () => {
    vi.useFakeTimers(); const stub = child(); const controller = new AbortController();
    const operation = runCodex("never", [], "/tmp", "", false, controller.signal);
    stub.stdout.emit("data", "ok"); stub.emit("close", 0); expect(await operation).toBe("ok");
    controller.abort(); expect(stub.kill).not.toHaveBeenCalled(); expect(vi.getTimerCount()).toBe(0);
  });
  it("spawn error removes timer/listener", async () => {
    vi.useFakeTimers(); const stub = child(); const controller = new AbortController();
    const operation = runCodex("never", [], "/tmp", "", false, controller.signal);
    stub.emit("error", new Error("stub")); await expect(operation).rejects.toThrow("stub");
    controller.abort(); expect(stub.kill).not.toHaveBeenCalled(); expect(vi.getTimerCount()).toBe(0);
  });
  it("unchanged 240-second child cap kills owned process", async () => {
    vi.useFakeTimers(); const stub = child(); const operation = runCodex("never", [], "/tmp", "");
    vi.advanceTimersByTime(239_999); expect(stub.kill).not.toHaveBeenCalled(); vi.advanceTimersByTime(1); expect(stub.kill).toHaveBeenCalledWith("SIGKILL");
    stub.emit("close", null); await expect(operation).rejects.toThrow();
  });
  it.each(["stdout", "stderr"] as const)("unchanged 1MiB %s cap kills owned process", async stream => {
    const stub = child(); const operation = runCodex("never", [], "/tmp", "");
    stub[stream].emit("data", stream === "stdout" ? "x".repeat(1_048_577) : Buffer.alloc(1_048_577));
    expect(stub.kill).toHaveBeenCalledWith("SIGKILL"); stub.emit("close", 0); await expect(operation).rejects.toThrow();
  });
});
