export const CURSOR_VERSION = 1;
export const DEFAULT_PAGE_SIZE = 25;
export const MAX_PAGE_SIZE = 100;

export class QueryContractError extends Error {
  constructor(
    message: string,
    readonly code:
      | "INVALID_CURSOR"
      | "CURSOR_KIND_MISMATCH"
      | "INVALID_PAGE_SIZE"
      | "INVALID_QUERY",
  ) {
    super(message);
    this.name = "QueryContractError";
  }
}

export interface PageRequest {
  first?: number;
  after?: string;
}

export interface PageInfo {
  endCursor: string | null;
  hasNextPage: boolean;
}

export interface Connection<T> {
  nodes: T[];
  pageInfo: PageInfo;
  totalCount?: number;
}

type CursorPayload = {
  v: typeof CURSOR_VERSION;
  k: string;
  s: string[];
  i: string;
};

export function normalizePageSize(
  first: number | undefined,
  maximum = MAX_PAGE_SIZE,
) {
  const value = first ?? DEFAULT_PAGE_SIZE;
  if (!Number.isInteger(value) || value < 1 || value > maximum) {
    throw new QueryContractError(
      `Page size must be an integer between 1 and ${maximum}`,
      "INVALID_PAGE_SIZE",
    );
  }
  return value;
}

export function encodeCursor(
  kind: string,
  sortValues: Array<string | Date>,
  id: string,
) {
  const payload: CursorPayload = {
    v: CURSOR_VERSION,
    k: kind,
    s: sortValues.map((value) =>
      value instanceof Date ? value.toISOString() : value,
    ),
    i: id,
  };
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

export function decodeCursor(kind: string, value: string): CursorPayload {
  if (!value || value.length > 2048) {
    throw new QueryContractError("Cursor is invalid", "INVALID_CURSOR");
  }
  try {
    const decoded = Buffer.from(value, "base64url").toString("utf8");
    const parsed = JSON.parse(decoded) as Partial<CursorPayload>;
    if (
      parsed.v !== CURSOR_VERSION ||
      typeof parsed.k !== "string" ||
      !Array.isArray(parsed.s) ||
      parsed.s.some((item) => typeof item !== "string") ||
      typeof parsed.i !== "string" ||
      !parsed.i
    ) {
      throw new Error("shape");
    }
    if (parsed.k !== kind) {
      throw new QueryContractError(
        "Cursor belongs to another collection or sort",
        "CURSOR_KIND_MISMATCH",
      );
    }
    return parsed as CursorPayload;
  } catch (error) {
    if (error instanceof QueryContractError) throw error;
    throw new QueryContractError("Cursor is invalid", "INVALID_CURSOR");
  }
}

export function toConnection<T>(
  rows: T[],
  first: number,
  cursorFor: (row: T) => string,
  totalCount?: number,
): Connection<T> {
  const hasNextPage = rows.length > first;
  const nodes = hasNextPage ? rows.slice(0, first) : rows;
  return {
    nodes,
    pageInfo: {
      endCursor: nodes.length ? cursorFor(nodes[nodes.length - 1]!) : null,
      hasNextPage,
    },
    ...(totalCount === undefined ? {} : { totalCount }),
  };
}
