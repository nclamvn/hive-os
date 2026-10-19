import { describe, expect, it } from "vitest";

import {
  decodeCursor,
  encodeCursor,
  normalizePageSize,
  QueryContractError,
  toConnection,
} from "@/modules/query-contracts/primitives";

describe("query contract primitives", () => {
  it("QUERY-01 round-trips versioned kind-bound opaque cursors", () => {
    const cursor = encodeCursor(
      "mission:updated_desc",
      [new Date("2026-07-30T00:00:00.000Z")],
      "mission-1",
    );
    expect(cursor).not.toContain("mission-1");
    expect(decodeCursor("mission:updated_desc", cursor)).toMatchObject({
      v: 1,
      k: "mission:updated_desc",
      s: ["2026-07-30T00:00:00.000Z"],
      i: "mission-1",
    });
    expect(() => decodeCursor("skill:updated_desc", cursor)).toThrowError(
      expect.objectContaining({ code: "CURSOR_KIND_MISMATCH" }),
    );
  });

  it("QUERY-01 rejects malformed cursors and out-of-range page sizes", () => {
    expect(() => decodeCursor("mission:updated_desc", "not-json")).toThrow(
      QueryContractError,
    );
    expect(() => normalizePageSize(0)).toThrowError(
      expect.objectContaining({ code: "INVALID_PAGE_SIZE" }),
    );
    expect(() => normalizePageSize(101)).toThrowError(
      expect.objectContaining({ code: "INVALID_PAGE_SIZE" }),
    );
  });

  it("QUERY-02 emits one lookahead row as pageInfo without disclosing it", () => {
    expect(
      toConnection(
        [{ id: "a" }, { id: "b" }, { id: "c" }],
        2,
        (row) => row.id,
      ),
    ).toEqual({
      nodes: [{ id: "a" }, { id: "b" }],
      pageInfo: { endCursor: "b", hasNextPage: true },
    });
  });
});
