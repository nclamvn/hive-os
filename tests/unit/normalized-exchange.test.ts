import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { normalizeByExchange, representativeBoundGivenH, residualAllRepresentationBound, normalizedExchangeControls } from "../../scripts/operations/normalized-exchange";

const B = BigInt;
describe("known normalized exchange and scoped bound research", () => {
  it("preserves strict denominators and gcd while reducing the larger orientation", () => {
    const result = normalizeByExchange({ p: B(7), A: B(3), u: B(2), k: B(1), Q: B(1) });
    expect(result).toMatchObject({ originalCore: B(6), chosenCore: B(3), representativeCoreBound: B(4),
      swapped: true, strict: true, chosenU: B(1), chosenQ: B(2), denominators: [B(2), B(21), B(42)] });
    // The representative bound is FALSE for all original representations.
    expect(result.originalCore).toBeGreaterThan(result.representativeCoreBound);
  });
  it("also disproves an all-representation linear bound inside the residual prime class", () => {
    const p = 26881;
    for (let d = 2; d * d <= p; d++) expect(p % d).not.toBe(0);
    const result = normalizeByExchange({ p: B(p), A: B(204), u: B(611), k: B(11), Q: B(1) });
    expect(result).toMatchObject({ originalCore: B(1371084), chosenCore: B(2244), representativeCoreBound: B(4480), strict: true, h: B(3) });
    expect(result.originalCore).toBeGreaterThan(result.representativeCoreBound);
  });
  it("handles equal-branch degeneracy and p2 boundary without strict acceptance", () => {
    const p2 = normalizeByExchange({ p: B(2), A: B(1), u: B(1), k: B(1), Q: B(1) });
    expect(p2.strict).toBe(false); expect(p2.denominators).toEqual([B(1), B(2), B(2)]);
    const p3 = normalizeByExchange({ p: B(3), A: B(2), u: B(1), k: B(1), Q: B(1) });
    expect(p3.strict).toBe(false); expect(p3.denominators).toEqual([B(1), B(6), B(6)]);
  });
  it("does not preserve a fixed prime-power subclass under exchange", () => {
    const first = normalizeByExchange({ p: B(131433121), A: B(4), u: B(9), k: B(1), Q: B(3676451) });
    const reverse = normalizeByExchange({ p: B(131433121), A: B(4), u: B(3676451), k: B(1), Q: B(9) });
    expect(first.denominators).toEqual(reverse.denominators);
    expect(first.originalCore).toBe(B(36)); expect(reverse.originalCore).toBe(B(14705804));
    expect(reverse.originalCore % B(3)).not.toBe(B(0));
    expect(reverse.chosenCore).toBe(B(36));
  });
  it("rejects positivity, equation, gcd and conditional-floor drift", () => {
    const base = { p: B(7), A: B(3), u: B(2), k: B(1), Q: B(1) };
    expect(() => normalizeByExchange({ ...base, p: B(1) })).toThrow(RangeError);
    expect(() => normalizeByExchange({ ...base, k: B(0) })).toThrow(RangeError);
    expect(() => normalizeByExchange({ ...base, A: B(6) })).toThrow("gcd");
    expect(() => normalizeByExchange({ ...base, Q: B(2) })).toThrow("equation");
    expect(() => representativeBoundGivenH(B(7), B(0))).toThrow(RangeError);
    expect(() => representativeBoundGivenH(B(7), B(3))).toThrow(RangeError);
    expect(() => residualAllRepresentationBound(B(7))).toThrow(RangeError);
  });
  it("checks h3 and h7 coefficient minima with residual prime controls", () => {
    expect(normalizeByExchange({ p: B(26881), A: B(204), u: B(1), k: B(11), Q: B(611) }).h).toBe(B(3));
    const p = 21001;
    for (let d = 2; d * d <= p; d++) expect(p % d).not.toBe(0);
    expect(normalizeByExchange({ p: B(p), A: B(15), u: B(4), k: B(13), Q: B(101) }).h).toBe(B(7));
  });
  it("matches independent bounded controls and labels conditional gates as assumptions", () => {
    const primary = normalizedExchangeControls();
    expect(primary).toMatchObject({ checked: 34354, swapped: 22587, strict: 32536, residual: 206,
      controlsDigest: "44d4cd52abb6e110e2868a6147c5cf0304429a65afd93a83860395cf29c15d9b" });
    expect(primary.targetBounds.map((t) => t.representativeCoreBound)).toEqual(["21905520", "26621280", "58520", "28558040"]);
    expect(primary.conditionalGateExamples.map((t) => t.representativeCoreBound)).toEqual(["2433947", "1857299", "58520", "1359907"]);
    expect(primary.conditionalGateExamples.every((t) => t.gateExclusionsCertifiedHere === false)).toBe(true);
    const run = spawnSync("python3", ["-I", "-S", "-B", "scripts/operations/normalized-exchange-replay.py"], { encoding: "utf8", timeout: 10000 });
    expect(run.status).toBe(0); expect(run.stderr).toBe("");
    expect(JSON.parse(run.stdout)).toEqual(primary);
  });
});
