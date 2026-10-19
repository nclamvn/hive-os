import { refuse } from "./bounded-json";
import type { CheckBudget, DomainLimits } from "./types";

export function createCheckBudget(limits: DomainLimits, now: () => number) {
  const start = now();
  let operations = 0;
  const budget: CheckBudget = {
    get operations() { return operations; },
    tick(amount = 1) {
      if (!Number.isSafeInteger(amount) || amount < 1 || operations + amount > limits.maxOperations) refuse("RESOURCE_REFUSED", "Checker operation ceiling");
      operations += amount;
      const elapsed = now() - start;
      if (!Number.isFinite(elapsed) || elapsed < 0 || elapsed > limits.maxCheckMilliseconds) refuse("RESOURCE_REFUSED", "Checker deadline");
    },
    integer(value) {
      budget.tick();
      if ((value < BigInt(0) ? -value : value).toString(2).length > limits.maxIntermediateBits) refuse("RESOURCE_REFUSED", "Intermediate arithmetic limit");
      return value;
    },
  };
  return { budget, elapsed: () => {
    const measured = now() - start;
    if (!Number.isFinite(measured) || measured < 0) refuse("INTEGRITY_REFUSED", "Invalid checker clock");
    return measured;
  } };
}
