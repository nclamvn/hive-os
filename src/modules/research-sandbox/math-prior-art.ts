import type { MathPilotContract } from "./math-pilot";

/** Curated, source-bound facts are a floor for novelty checks, not a claim that
 * the literature search is complete. Add a problem only after checking its
 * statement and source; an LLM's memory is never a source of record. */
export interface MathPriorArtFact {
  id: string;
  claim: string;
  sourceUrl: string;
  sourceTitle: string;
  modulus: number;
  residue: number;
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
];

function normalized(value: string): string {
  return value.toLowerCase().replaceAll(" ", "").replaceAll("−", "-");
}

export function mathPriorArtFor(contract: MathPilotContract): readonly MathPriorArtFact[] {
  if (contract.caseType !== "OPEN") return [];
  const statement = normalized(contract.statement);
  const definitions = normalized(contract.definitions);
  // Match the equation and quantified variables, not the title alone. A
  // different conjecture mentioning Erdős–Straus must not inherit this scope.
  return /4\/n=1\/x\+1\/y\+1\/z/.test(statement) &&
    /nisaninteger/.test(definitions) && /x,y,zarestrictlypositiveintegers/.test(definitions)
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
  const classes = explicitCongruences(task);
  if (classes.length !== 1) return null;
  const target = classes[0]!;
  return mathPriorArtFor(contract).find((fact) =>
    target.modulus % fact.modulus === 0 && target.residue % fact.modulus === fact.residue) ?? null;
}
