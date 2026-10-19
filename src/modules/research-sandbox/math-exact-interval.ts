import { z } from "zod";

import { sha256 } from "./integrity";

export const EXACT_INTERVAL_101GON_PROGRAM_DIGEST = "3a643dbfad464d45b0090c16cf5eefb6133617d0208bbcd71e634c26fadbe81c";
const integer = z.string().regex(/^(0|[1-9][0-9]{0,119})$/);

export const exactIntervalSchema = z.object({
  method: z.literal("INTERVAL_101GON_V1"),
  status: z.enum(["CERTIFIED", "INCONCLUSIVE", "UNAVAILABLE", "FAIL"]),
  reason: z.enum(["UNIQUE_FLOOR", "STRADDLES_BOUNDARY", "IMAGE_NOT_CONFIGURED", "EXECUTION_FAILED", "OUTPUT_INVALID"]),
  programDigest: z.string().regex(/^[a-f0-9]{64}$/),
  image: z.string().nullable(),
  outputDigest: z.string().regex(/^[a-f0-9]{64}$/).nullable(),
  scaleDigits: z.literal(80).nullable(),
  lowerScaled: integer.nullable(),
  upperScaled: integer.nullable(),
  floor: z.string().regex(/^(0|[1-9][0-9]{0,19})$/).nullable(),
  eventCount: z.number().int().nonnegative().nullable(),
  crossingWidthScaled: integer.nullable(),
}).strict();

export type ExactInterval = z.infer<typeof exactIntervalSchema>;

/** Validate a retained result without executing a model-authored program. */
export function validExactInterval(value: ExactInterval | null | undefined, claimedAnswer: string | null | undefined): boolean {
  const parsed = exactIntervalSchema.safeParse(value);
  if (!parsed.success) return false;
  const data = parsed.data;
  if (data.status !== "CERTIFIED" || data.reason !== "UNIQUE_FLOOR" ||
    data.programDigest !== EXACT_INTERVAL_101GON_PROGRAM_DIGEST ||
    !data.image || !/^.+@sha256:[a-f0-9]{64}$/.test(data.image) ||
    !data.outputDigest || data.scaleDigits !== 80 ||
    !data.lowerScaled || !data.upperScaled || !data.floor ||
    data.eventCount !== 80_850 || !data.crossingWidthScaled ||
    data.floor !== claimedAnswer) return false;
  const scale = BigInt(10) ** BigInt(80);
  const lower = BigInt(data.lowerScaled);
  const upper = BigInt(data.upperScaled);
  const recordedOutput = JSON.stringify({
    method: data.method, scaleDigits: data.scaleDigits, lowerScaled: data.lowerScaled,
    upperScaled: data.upperScaled, floor: data.floor, eventCount: data.eventCount,
    crossingWidthScaled: data.crossingWidthScaled,
  });
  return lower <= upper && lower / scale === upper / scale && lower / scale === BigInt(data.floor) &&
    sha256(recordedOutput) === data.outputDigest &&
    BigInt(data.crossingWidthScaled) > BigInt(0) &&
    // The finite-position uncertainty alone must stay far below the floor margin.
    BigInt(data.crossingWidthScaled) * BigInt(10) ** BigInt(9) < scale;
}

export function exactIntervalOutputDigest(output: string): string {
  return sha256(output);
}
