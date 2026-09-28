import type { MathPilotContract } from "./math-pilot";
import { hasErdosStrausEquation } from "./math-certificates";

/** Curated, source-bound facts are a floor for novelty checks, not a claim that
 * the literature search is complete. Add a problem only after checking its
 * statement and source; an LLM's memory is never a source of record. */
export interface MathPriorArtFact {
  id: string;
  claim: string;
  sourceUrl: string;
  sourceTitle: string;
  modulus: number | null;
  residue: number | null;
  condition?: "FIRST_GATE_DIVISOR_MOD_3" | "SECOND_GATE_DIVISOR_MOD_7" | "GENERAL_DIVISOR_RESIDUE_GATE";
  sourceScope: "ALL_INTEGERS" | "ODD_PRIMES";
  scopeLift: string;
}

const ERDOS_STRAUS_FACTS: readonly MathPriorArtFact[] = [
  {
    id: "erdos-straus-n-2-mod-3",
    claim: "The Erdős–Straus equation has a positive-integer decomposition for every n ≡ 2 (mod 3).",
    sourceUrl: "https://scialert.net/fulltext/?doi=aja.2011.31.37",
    sourceTitle: "Kishan, Rani & Agarwal (2011), Asian Journal of Algebra",
    modulus: 3,
    residue: 2,
    sourceScope: "ALL_INTEGERS",
    scopeLift: "The cited construction is stated directly for every integer in this congruence class.",
  },
  {
    id: "erdos-straus-n-3-mod-4",
    claim: "The Erdős–Straus equation has a positive-integer decomposition for every n ≡ 3 (mod 4).",
    sourceUrl: "https://terrytao.wordpress.com/2011/07/07/on-the-number-of-solutions-to-4p-1n_1-1n_2-1n_3/",
    sourceTitle: "Tao (2011), Counting solutions to the Erdős–Straus equation",
    modulus: 4,
    residue: 3,
    sourceScope: "ODD_PRIMES",
    scopeLift: "Every n ≡ 3 (mod 4) has a prime divisor p ≡ 3 (mod 4); scaling a solution for p by n/p gives one for n.",
  },
  {
    id: "erdos-straus-n-5-mod-8",
    claim: "The Erdős–Straus equation has a positive-integer decomposition for every n ≡ 5 (mod 8).",
    sourceUrl: "https://terrytao.wordpress.com/2011/07/07/on-the-number-of-solutions-to-4p-1n_1-1n_2-1n_3/",
    sourceTitle: "Tao (2011), congruence identities for the Erdős–Straus equation",
    modulus: 8,
    residue: 5,
    sourceScope: "ODD_PRIMES",
    scopeLift: "Every n ≡ 5 (mod 8) has a prime divisor p ≡ 3 or 5 (mod 8); the p ≡ 3 class is covered by the mod-4 identity, and scaling denominators gives a solution for n.",
  },
  ...([2, 3] as const).map((residue): MathPriorArtFact => ({
    id: `erdos-straus-n-${residue}-mod-5`,
    claim: `The Erdős–Straus equation has a positive-integer decomposition for every n ≡ ${residue} (mod 5).`,
    sourceUrl: "https://arxiv.org/html/2404.01508v3",
    sourceTitle: "López (2024), A Complete Congruence System for the Erdős–Straus Conjecture",
    modulus: 5,
    residue,
    sourceScope: "ODD_PRIMES",
    scopeLift: "An integer congruent to 2 or 3 modulo 5 has a prime divisor congruent to 2 or 3 modulo 5: factors all congruent to 1 or 4 would multiply to 1 or 4. Scale the prime's denominators by n/p; the even prime 2 is elementary.",
  })),
  {
    id: "erdos-straus-first-gate-divisor-mod-3",
    claim: "For prime p ≡ 1 (mod 12), x=(p+3)/4 is a valid first denominator exactly when x has a prime divisor ≡ 2 (mod 3).",
    sourceUrl: "https://www.researchgate.net/publication/405220221_Erdos--Straus_Decompositions",
    sourceTitle: "Bhattacharjee (2026), Erdős–Straus Decompositions, Proposition 4.2 (preprint)",
    modulus: null,
    residue: null,
    condition: "FIRST_GATE_DIVISOR_MOD_3",
    sourceScope: "ODD_PRIMES",
    scopeLift: "Proposition 4.2 states the conditional first-denominator criterion; it does not prove that every residual prime has such a divisor.",
  },
  {
    id: "erdos-straus-second-gate-divisor-mod-7",
    claim: "For a residual prime p ≡ 1 (mod 7), x=(p+7)/4 and a divisor q of x with q ≡ 5 (mod 7) give a positive decomposition.",
    sourceUrl: "https://www.researchgate.net/publication/405220221_Erdos--Straus_Decompositions",
    sourceTitle: "Bhattacharjee (2026), Erdős–Straus Decompositions, Proposition 4.4(i) (preprint)",
    modulus: null,
    residue: null,
    condition: "SECOND_GATE_DIVISOR_MOD_7",
    sourceScope: "ODD_PRIMES",
    scopeLift: "The sourced criterion is conditional on the stated divisor and does not cover every prime in the residual class.",
  },
  {
    id: "erdos-straus-general-divisor-residue-gate",
    claim: "For prime p ≡ 1 (mod 4), a fixed x=(p+A)/4 reduces the two remaining unit fractions to a divisor-residue condition modulo A.",
    sourceUrl: "https://www.researchgate.net/publication/405220221_Erdos--Straus_Decompositions",
    sourceTitle: "Bhattacharjee (2026), Erdős–Straus Decompositions, Lemma 4.1 (preprint)",
    modulus: null,
    residue: null,
    condition: "GENERAL_DIVISOR_RESIDUE_GATE",
    sourceScope: "ODD_PRIMES",
    scopeLift: "This is a structural equivalence, not a proof that every prime satisfies one of its divisor conditions.",
  },
];

function normalized(value: string): string {
  return value.toLowerCase().replaceAll(" ", "").replaceAll("−", "-");
}

export function mathPriorArtFor(contract: MathPilotContract): readonly MathPriorArtFact[] {
  if (!hasErdosStrausEquation(contract)) return [];
  const definitions = normalized(contract.definitions);
  // Match the equation and quantified variables, not the title alone. A
  // different conjecture mentioning Erdős–Straus must not inherit this scope.
  return (/nisaninteger/.test(definitions) || /nisaprimeinteger/.test(definitions) || /nisprime/.test(definitions)) &&
    /x,y,zarestrictlypositiveintegers/.test(definitions)
    ? ERDOS_STRAUS_FACTS : [];
}

interface Congruence { modulus: number; residue: number }

/** Intentionally narrow: an unparsed task is UNKNOWN, never "novel". */
export function explicitCongruences(task: string): Congruence[] {
  const text = task.replaceAll("\\equiv", "≡").replaceAll("−", "-");
  const found: Congruence[] = [];
  const pattern = /\bn\s*≡\s*(\d+)\s*(?:\(\s*mod\s*(\d+)\s*\)|mod\s*(\d+))/gi;
  for (const match of text.matchAll(pattern)) {
    const residue = Number(match[1]);
    const modulus = Number(match[2] ?? match[3]);
    if (Number.isSafeInteger(residue) && Number.isSafeInteger(modulus) && modulus > 0 && modulus <= 1_000_000) {
      found.push({ modulus, residue: residue % modulus });
    }
  }
  const affine = /\bn\s*=\s*(\d+)\s*k\s*\+\s*(\d+)/gi;
  for (const match of text.matchAll(affine)) {
    const modulus = Number(match[1]);
    const residue = Number(match[2]);
    if (Number.isSafeInteger(residue) && Number.isSafeInteger(modulus) && modulus > 0 && modulus <= 1_000_000) {
      found.push({ modulus, residue: residue % modulus });
    }
  }
  return found;
}

export function knownScopeForTask(contract: MathPilotContract, task: string): MathPriorArtFact | null {
  const facts = mathPriorArtFor(contract);
  const compact = normalized(task);
  // A cited conditional formula is not a proof that its divisor condition
  // holds for every prime. Only screen an explicitly conditional construction.
  const conditionalConstruction = /(?:if|suppose|when|provided|with|whose).{0,180}(?:divisor|factor)/.test(compact);
  const mentionsFirstGate = /(?:\b[px]=\(?[np]\+3\)?\/4|\([np]\+3\)\/4)/.test(compact);
  const mentionsDivisor = /(?:primedivisor|divisor|factor)/.test(compact) &&
    /(?:≡|congruentto)2\(?mod3\)?/.test(compact);
  if (conditionalConstruction && mentionsFirstGate && mentionsDivisor) {
    return facts.find((fact) => fact.condition === "FIRST_GATE_DIVISOR_MOD_3") ?? null;
  }
  const mentionsSecondGate = /(?:\b[px]=\(?[np]\+7\)?\/4|\([np]\+7\)\/4)/.test(compact);
  const mentionsDivisor7 = /(?:divisor|factor)/.test(compact) &&
    /(?:≡|congruentto)5\(?mod7\)?/.test(compact);
  const hasMod7One = [...explicitCongruences(contract.statement), ...explicitCongruences(task)]
    .some(({ modulus, residue }) => modulus % 7 === 0 && residue % 7 === 1);
  if (conditionalConstruction && mentionsSecondGate && mentionsDivisor7 && hasMod7One) {
    return facts.find((fact) => fact.condition === "SECOND_GATE_DIVISOR_MOD_7") ?? null;
  }
  const classes = explicitCongruences(task);
  if (classes.length !== 1) return null;
  const target = classes[0]!;
  return facts.find((fact) => fact.modulus !== null && fact.residue !== null &&
    target.modulus % fact.modulus === 0 && target.residue % fact.modulus === fact.residue) ?? null;
}
