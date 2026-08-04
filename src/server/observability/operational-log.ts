export interface OperationalEvent {
  level: "info" | "warn" | "error";
  event: string;
  outcome: "success" | "failure";
  correlationId?: string;
  errorType?: string;
  component?: string;
  durationMs?: number;
  count?: number;
  queueDepth?: number;
}

const SAFE_NAME = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;

function safe(value: string | undefined): string | undefined {
  return value && SAFE_NAME.test(value) ? value : undefined;
}

/**
 * Emit one-line machine-readable operational evidence. This API intentionally
 * accepts no arbitrary message, URL, address, token, or environment value.
 */
export function writeOperationalEvent(input: OperationalEvent): void {
  const metric = (value: number | undefined) =>
    value !== undefined && Number.isFinite(value) && value >= 0
      ? Math.round(value)
      : undefined;
  const record = {
    timestamp: new Date().toISOString(),
    level: input.level,
    event: safe(input.event) ?? "invalid_event_name",
    outcome: input.outcome,
    correlationId: safe(input.correlationId),
    errorType: safe(input.errorType),
    component: safe(input.component),
    durationMs: metric(input.durationMs),
    count: metric(input.count),
    queueDepth: metric(input.queueDepth),
  };
  const line = JSON.stringify(record);
  if (input.level === "error") console.error(line);
  else if (input.level === "warn") console.warn(line);
  else console.info(line);
}
