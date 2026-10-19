export const RESEARCH_REFRESH_INTERVAL_MS = 15_000;

/** Single flight across automatic and manual requests; completion is observed,
 * never inferred from the void return value of router.refresh(). */
export function createResearchRefreshScheduler(requestRefresh: () => void) {
  let active = false;
  let visible = false;
  let inFlight = false;
  let observedPending = false;
  let disposed = false;
  let timer: ReturnType<typeof setTimeout> | undefined;

  function clearTimer() {
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
  }

  function schedule() {
    clearTimer();
    if (!disposed && active && visible && !inFlight) {
      timer = setTimeout(request, RESEARCH_REFRESH_INTERVAL_MS);
    }
  }

  function request() {
    if (disposed || !visible || inFlight) return;
    clearTimer();
    // Lock synchronously, before React can render the disabled button.
    inFlight = true;
    observedPending = false;
    try {
      requestRefresh();
    } catch (error) {
      inFlight = false;
      // Do not schedule a retry after a synchronous failure.
      throw error;
    }
  }

  return {
    request,
    setActive(value: boolean) {
      active = value;
      schedule();
    },
    setVisible(value: boolean) {
      visible = value;
      schedule();
    },
    observeTransition(pending: boolean) {
      if (pending) {
        inFlight = true;
        observedPending = true;
        clearTimer();
      } else if (observedPending) {
        observedPending = false;
        inFlight = false;
        schedule();
      }
    },
    dispose() {
      disposed = true;
      clearTimer();
    },
  };
}
