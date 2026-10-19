import { describe, expect, it } from "vitest";
import { searchDivisorLed } from "@/modules/research-sandbox/math-divisor-led";
import { compareDivisorReplay, parseDivisorLabQuery, replayDivisorLab } from "@/modules/research-sandbox/math-divisor-replay";

describe("local divisor workbench", () => {
  it("defaults only an untouched form and rejects malformed or unbounded scope", () => {
    expect(parseDivisorLabQuery({})).toEqual({ n: 131433121, maxS: 143, mode: "ALL" });
    for (const query of [
      { n: "841", maxS: "143", mode: "ALL" },
      { n: ["131433121", "2521"], maxS: "143", mode: "ALL" },
      { n: "131433121", maxS: "4096", mode: "ALL" },
      { n: "131433121", maxS: "1e3", mode: "ALL" },
      { n: "131433121", maxS: "143" },
      { n: "200000001", maxS: "143", mode: "ALL" },
      { n: "0131433121", maxS: "143", mode: "ALL" },
    ]) expect(() => parseDivisorLabQuery(query)).toThrow();
  });

  it("compares scope, first divisor, exact tuple, construction and identity digest", () => {
    const primary = searchDivisorLed(131433121, 143);
    const { n, maxS, mode, status, firstS, construction, witness, strictDigest } = primary;
    const raw = { n, maxS, mode, status, firstS, construction, witness, strictDigest };
    expect(compareDivisorReplay(primary, raw)).toEqual([]);
    expect(compareDivisorReplay(primary, { ...raw, maxS: 142 })).toEqual(["maxS"]);
    expect(compareDivisorReplay(primary, { ...raw, firstS: 139 })).toEqual(["firstS"]);
    expect(compareDivisorReplay(primary, { ...raw, witness: { ...witness, x: "1" } })).toEqual(["witness"]);
    expect(compareDivisorReplay(primary, { ...raw, strictDigest: "0".repeat(64) })).toEqual(["strictDigest"]);
    expect(() => compareDivisorReplay(primary, { ...raw, extra: true })).toThrow();
  });

  it("replays both successes and bounded misses through separate Python enumeration", async () => {
    for (const [n, maxS, mode] of [
      [131433121, 142, "ALL"], [131433121, 143, "ALL"],
      [131433121, 143, "PRIME_ONLY_DIAGNOSTIC"], [131433121, 311, "PRIME_ONLY_DIAGNOSTIC"],
      [351121, 19, "ALL"], [351121, 31, "ALL"],
    ] as const) {
      expect(await replayDivisorLab(searchDivisorLed(n, maxS, mode))).toMatchObject({ status: "PASS", mismatches: [] });
    }
    expect(await replayDivisorLab(searchDivisorLed(2521, 4096))).toMatchObject({ status: "UNAVAILABLE", outputDigest: null });
  });
});
