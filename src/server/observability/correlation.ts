const CORRELATION_ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;

export function isValidCorrelationId(value: string | null): value is string {
  return value !== null && CORRELATION_ID.test(value);
}

export function resolveCorrelationId(value: string | null): string {
  return isValidCorrelationId(value) ? value : crypto.randomUUID();
}
