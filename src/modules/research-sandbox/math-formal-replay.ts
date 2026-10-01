import { z } from "zod";

/** A fresh Lean kernel replay of the compiled olean, not a semantic alignment verdict. */
export const formalReplaySchema = z.object({
  version: z.literal(1),
  method: z.literal("LEAN4CHECKER_FRESH_V1"),
  status: z.enum(["REPLAY_ACCEPTED", "REJECTED", "UNAVAILABLE"]),
  reason: z.enum(["FRESH_REPLAY_OK", "CHECKER_ERROR", "OUTPUT_INVALID", "RUNTIME_UNAVAILABLE"]),
  targetDigest: z.string().regex(/^[a-f0-9]{64}$/),
  sourceDigest: z.string().regex(/^[a-f0-9]{64}$/),
  primaryCheckDigest: z.string().regex(/^[a-f0-9]{64}$/),
  imageId: z.string().regex(/^sha256:[a-f0-9]{64}$/).nullable(),
  checkerCommit: z.literal("0c3323271991c2dfe75f8be7d21bf93886419736"),
  toolchain: z.literal("Lean 4.10.0 / Std / lean4checker --fresh"),
  outputDigest: z.string().regex(/^[a-f0-9]{64}$/).nullable(),
  diagnostic: z.string().max(400),
}).strict().superRefine((value, ctx) => {
  if ((value.status === "REPLAY_ACCEPTED") !== (value.reason === "FRESH_REPLAY_OK") ||
    (value.status === "UNAVAILABLE") !== (value.reason === "RUNTIME_UNAVAILABLE") ||
    (value.status === "REPLAY_ACCEPTED" && (!value.imageId || !value.outputDigest))) {
    ctx.addIssue({ code: "custom", message: "Fresh replay result is internally inconsistent" });
  }
});

export type FormalReplay = z.infer<typeof formalReplaySchema>;
