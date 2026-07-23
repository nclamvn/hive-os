import { describe, expect, it } from "vitest";

import { assertExactSpan, evaluateTruth } from "@/modules/truth-kernel/rules";

describe("truth rules", () => {
  it("TK-U01 validates exact half-open spans", () => {
    expect(assertExactSpan("alpha beta", 6, 10, "beta")).toBe(true);
    expect(assertExactSpan("alpha beta", 6, 10, "Beta")).toBe(false);
    expect(assertExactSpan("alpha beta", -1, 4, "alph")).toBe(false);
  });

  it("TK-U02 requires two distinct qualifying independence keys", () => {
    const onePublisherTwice = [
      { normalizedValue: "42", relation: "SUPPORTS" as const, independenceKey: "publisher-a", qualifiesForCorroboration: true },
      { normalizedValue: "42", relation: "SUPPORTS" as const, independenceKey: "publisher-a", qualifiesForCorroboration: true },
    ];
    expect(evaluateTruth(onePublisherTwice, false).state).toBe("SOURCED");
    expect(
      evaluateTruth(
        [...onePublisherTwice, { ...onePublisherTwice[0], independenceKey: "publisher-b" }],
        false,
      ).state,
    ).toBe("CORROBORATED");
  });

  it("TK-U03 conflicts outrank source tier", () => {
    expect(
      evaluateTruth(
        [
          { normalizedValue: "42", relation: "SUPPORTS", independenceKey: "a", qualifiesForCorroboration: true },
          { normalizedValue: "43", relation: "SUPPORTS", independenceKey: "b", qualifiesForCorroboration: true },
        ],
        false,
      ).state,
    ).toBe("DISPUTED");
  });

  it("TK-U04 retained unsupported values still conflict", () => {
    expect(
      evaluateTruth(
        [
          { normalizedValue: "42", relation: null, independenceKey: null, qualifiesForCorroboration: false },
          { normalizedValue: "43", relation: null, independenceKey: null, qualifiesForCorroboration: false },
        ],
        false,
      ).state,
    ).toBe("DISPUTED");
  });
});
