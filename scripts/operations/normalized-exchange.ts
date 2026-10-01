import { createHash } from "node:crypto";
import { normalizedCoreFiniteBound } from "../../src/modules/research-sandbox/math-normalized-core-bound";

const B = BigInt;
export type NormalizedInput = { p: bigint; A: bigint; u: bigint; k: bigint; Q: bigint };
const gcd = (a: bigint, b: bigint): bigint => b ? gcd(b, a % b) : a;
const order = (a: bigint, b: bigint) => a < b ? -1 : a > b ? 1 : 0;

/** Arithmetic conditional ONLY: callers must separately justify h>=hFloor.
 * This is never a certificate that any first-denominator gate was excluded. */
export function representativeBoundGivenH(p: bigint, hFloor: bigint) {
  if (p < B(2) || hFloor <= B(0) || (p + hFloor) % B(4)) throw new RangeError("Invalid target/admissible h floor");
  return (p + hFloor) / (B(2) * hFloor);
}

/** ALL representations, not just representatives, for this residual class.
 * Written elementary h3/h7 argument is in the completion note. */
export function residualAllRepresentationBound(p: bigint) {
  if (p < B(2) || p % B(840) !== B(1)) throw new RangeError("Requires p>=2 and p1mod840");
  return (p + B(11)) * (p + B(15)) / B(176);
}

/** No primality assertion: arithmetic and exact p-divisibility hold for any
 * valid normalized input p>=2. Preserves the triple but NOT core subclasses. */
export function normalizeByExchange(input: NormalizedInput) {
  if (!Object.values(input).every((v) => typeof v === "bigint" && v > B(0)) || input.p < B(2)) throw new RangeError("Positive BigInt input required; p>=2");
  const { p, A, u, k, Q } = input, originalCore = A * u * k;
  if (gcd(A, u) !== B(1)) throw new Error("Original normalization gcd failure");
  if (A * p + u !== (B(4) * originalCore - B(1)) * Q) throw new Error("Original normalized equation failure");
  const T = u * k * Q, h = B(4) * T - p;
  if (h <= B(0) || A * h !== u + Q || gcd(A, Q) !== B(1)) throw new Error("Exchange gcd/positive h failure");
  const swapped = u > Q, chosenU = swapped ? Q : u, chosenQ = swapped ? u : Q;
  const chosenCore = A * chosenU * k;
  if (A * p + chosenU !== (B(4) * chosenCore - B(1)) * chosenQ) throw new Error("Exchanged equation failure");
  const original = [T, A * p * u * k, A * p * Q * k].sort(order);
  const exchanged = [T, A * p * chosenU * k, A * p * chosenQ * k].sort(order);
  if (original.some((d, i) => d !== exchanged[i])) throw new Error("Denominator preservation failure");
  const [x, y, z] = original;
  if (B(4) * x * y * z !== p * (x * y + x * z + y * z)) throw new Error("Exact identity failure");
  if (original.filter((d) => d % p === B(0)).length !== 2) throw new Error("Exact p-divisibility failure");
  const { t0, denominator, maxCore } = normalizedCoreFiniteBound(p);
  const representativeCoreBound = representativeBoundGivenH(p, denominator);
  if (T < t0 || T > (p + B(1)) / B(3) || originalCore > maxCore || chosenCore > representativeCoreBound) throw new Error("Bound violation");
  if (p % B(840) === B(1) && originalCore > residualAllRepresentationBound(p)) throw new Error("Residual all-representation bound violation");
  return { originalCore, chosenCore, chosenU, chosenQ, T, h, representativeCoreBound,
    swapped, strict: p > B(2) && x < y && y < z, denominators: original };
}

const targets = ["131433121", "159727681", "351121", "171348241"];
export function normalizedExchangeControls() {
  const digest = createHash("sha256");
  let checked = 0, swapped = 0, strict = 0, residual = 0;
  for (let m = 1; m <= 4096; m++) {
    // Small integer square-root divisor enumeration; Python uses full interval.
    const ds = [];
    for (let d = 1; d * d <= m; d++) if (m % d === 0) { ds.push(d); if (d * d !== m) ds.push(m / d); }
    ds.sort((a, b) => a - b);
    for (const A of ds) for (const u of ds) {
      if (m % (A * u) || gcd(B(A), B(u)) !== B(1)) continue;
      for (let Q = 1; Q <= 8; Q++) {
        const numerator = (4 * m - 1) * Q - u;
        if (numerator < 2 * A || numerator % A) continue;
        const p = numerator / A;
        if (m > 512 && p % 840 !== 1) continue;
        const k = m / (A * u), result = normalizeByExchange({ p: B(p), A: B(A), u: B(u), k: B(k), Q: B(Q) });
        checked++; if (result.swapped) swapped++; if (result.strict) strict++; if (p % 840 === 1) residual++;
        digest.update(JSON.stringify([String(p), String(A), String(u), String(k), String(Q), String(result.originalCore),
          String(result.chosenCore), String(result.representativeCoreBound), result.swapped, result.strict]) + "\n");
      }
    }
  }
  return { method: "NORMALIZED_EXCHANGE_BOUNDED_RESEARCH_V1", limits: { allInputsMaxM: 512, residualInputsMaxM: 4096, maxQ: 8 },
    checked, swapped, strict, residual, controlsDigest: digest.digest("hex"),
    targetBounds: targets.map((p) => {
      const t0 = B(p) / B(4) + B(1), h = B(4) * t0 - B(p);
      return { p, representativeCoreBound: String(representativeBoundGivenH(B(p), h)), allRepresentationResidualBound: String(residualAllRepresentationBound(B(p))) };
    }),
    conditionalGateExamples: targets.map((p, i) => ({ p, assumedNextH: ["27", "43", "3", "63"][i],
      representativeCoreBound: String(representativeBoundGivenH(B(p), B(["27", "43", "3", "63"][i]))),
      gateExclusionsCertifiedHere: false })),
    scope: "Known Type II exchange symmetry; representative/existence bound only, not a restricted-core tail. Residual all-m bound is a written arithmetic corollary, novelty unestablished. Finite controls are not full target searches; conditional h floors are assumptions, not new gate certificates." };
}
