import { z } from "zod";

export const PILOT_LEAN_IMAGE = "leanprovercommunity/mathlib@sha256:e251cad58fa2b8010782259d7df19eda2529dfbc1dcd0d511d3412d62eee7e3f";

/** A compiler/axiom-audit result is not a semantic or independent proof verdict. */
export const formalCheckSchema = z.object({
  version: z.literal(1), method: z.literal("PINNED_LEAN_AXIOM_AUDIT_V1"),
  status: z.enum(["KERNEL_ACCEPTED_ALIGNMENT_PENDING", "REJECTED", "UNAVAILABLE"]),
  reason: z.enum(["ALLOWED_AXIOMS", "COMPILER_ERROR", "UNSAFE_AXIOM", "OUTPUT_INVALID", "RUNTIME_UNAVAILABLE"]),
  targetDigest: z.string().regex(/^[a-f0-9]{64}$/),
  sourceDigest: z.string().regex(/^[a-f0-9]{64}$/),
  image: z.string().nullable(),
  toolchain: z.literal("Lean 4.10.0 / no mathlib import"),
  axioms: z.array(z.string()).max(20),
  outputDigest: z.string().regex(/^[a-f0-9]{64}$/).nullable(),
  diagnostic: z.string().max(400),
  compilerFeedback: z.string().max(2_000).nullable(),
}).strict();

export type FormalCheck = z.infer<typeof formalCheckSchema>;
