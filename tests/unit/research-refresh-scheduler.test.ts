import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createResearchRefreshScheduler, RESEARCH_REFRESH_INTERVAL_MS } from "@/components/research/research-refresh-scheduler";

describe("research refresh single-flight scheduler", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  function setup() {
    const refresh = vi.fn();
    const scheduler = createResearchRefreshScheduler(refresh);
    scheduler.setVisible(true);
    scheduler.setActive(true);
    return { refresh, scheduler };
  }

  it("starts no earlier than 15 seconds, not the former 5-second interval", () => {
    const { refresh } = setup();
    expect(RESEARCH_REFRESH_INTERVAL_MS).toBe(15_000);
    vi.advanceTimersByTime(14_999);
    expect(refresh).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("locks manual and automatic requests before the pending render", () => {
    const { refresh, scheduler } = setup();
    scheduler.request();
    scheduler.request();
    // A void return or a pre-pending observation is not completion.
    scheduler.observeTransition(false);
    vi.advanceTimersByTime(120_000);
    scheduler.request();
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("waits for completion then schedules a full 15-second delay", () => {
    const { refresh, scheduler } = setup();
    vi.advanceTimersByTime(15_000);
    scheduler.observeTransition(true);
    vi.advanceTimersByTime(60_000);
    expect(refresh).toHaveBeenCalledTimes(1);
    scheduler.observeTransition(false);
    vi.advanceTimersByTime(14_999);
    expect(refresh).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(1);
    expect(refresh).toHaveBeenCalledTimes(2);
  });

  it("cancels hidden-tab polling and does not burst on visibility return", () => {
    const { refresh, scheduler } = setup();
    vi.advanceTimersByTime(10_000);
    scheduler.setVisible(false);
    scheduler.request();
    vi.advanceTimersByTime(120_000);
    expect(refresh).not.toHaveBeenCalled();
    scheduler.setVisible(true);
    vi.advanceTimersByTime(14_999);
    expect(refresh).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("does not unlock a pending flight when visibility changes", () => {
    const { refresh, scheduler } = setup();
    scheduler.request();
    scheduler.observeTransition(true);
    scheduler.setVisible(false);
    scheduler.setVisible(true);
    vi.advanceTimersByTime(120_000);
    scheduler.request();
    expect(refresh).toHaveBeenCalledTimes(1);
    scheduler.observeTransition(false);
    vi.advanceTimersByTime(15_000);
    expect(refresh).toHaveBeenCalledTimes(2);
  });

  it("stops automatic refresh while idle, but permits an explicit manual refresh", () => {
    const { refresh, scheduler } = setup();
    scheduler.setActive(false);
    vi.advanceTimersByTime(120_000);
    expect(refresh).not.toHaveBeenCalled();
    scheduler.request();
    scheduler.observeTransition(true);
    scheduler.observeTransition(false);
    vi.advanceTimersByTime(120_000);
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("does not reschedule when the server response marks the task idle", () => {
    const { refresh, scheduler } = setup();
    scheduler.request();
    scheduler.observeTransition(true);
    scheduler.setActive(false);
    scheduler.observeTransition(false);
    vi.advanceTimersByTime(120_000);
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("cleans up on unmount, including a completion arriving after disposal", () => {
    const { refresh, scheduler } = setup();
    scheduler.request();
    scheduler.observeTransition(true);
    scheduler.dispose();
    scheduler.observeTransition(false);
    scheduler.setVisible(true);
    scheduler.setActive(true);
    scheduler.request();
    vi.advanceTimersByTime(120_000);
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("does not automatically retry a synchronous request failure", () => {
    const refresh = vi.fn(() => { throw new Error("request failed"); });
    const scheduler = createResearchRefreshScheduler(refresh);
    scheduler.setVisible(true);
    scheduler.setActive(true);
    expect(() => scheduler.request()).toThrow("request failed");
    vi.advanceTimersByTime(120_000);
    expect(refresh).toHaveBeenCalledTimes(1);
    scheduler.dispose();
  });
});
