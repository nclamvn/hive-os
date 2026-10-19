import { aggregateOddCoreDecision } from "./aggregate-odd-core-check";
import { replayAggregateOddCore } from "./aggregate-odd-core-replay";

try {
  const decision = aggregateOddCoreDecision(), replay = replayAggregateOddCore(decision);
  console.log(JSON.stringify({ decision, replay }));
  if (replay.status !== "PASS") process.exitCode = 1;
} catch {
  console.log(JSON.stringify({ status: "UNAVAILABLE_OR_INCOMPLETE", scope: "Aggregate-block certification failed closed; no complete decision implied." }));
  process.exitCode = 1;
}
