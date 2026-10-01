import { z } from "zod";

import { sha256 } from "./integrity";

const answerSchema = z.string().regex(/^(0|[1-9][0-9]{0,19})$/);

export const exactReplaySchema = z.object({
  method: z.literal("DOCKER_PYTHON_ANSWER_REPLAY_V1"),
  status: z.enum(["PASS", "COMPUTED", "FAIL", "UNAVAILABLE"]),
  codeDigest: z.string().regex(/^[a-f0-9]{64}$/),
  image: z.string().nullable(),
  observedAnswer: answerSchema.nullable(),
  claimedAnswer: answerSchema.nullable(),
  reason: z.enum(["MATCH", "UNCLAIMED_ANSWER", "NO_CODE_OR_ANSWER", "IMAGE_NOT_CONFIGURED", "EXECUTION_FAILED", "OUTPUT_MISMATCH"]),
}).strict();

export type ExactReplay = z.infer<typeof exactReplaySchema>;

export function validExactReplay(replay: ExactReplay | null | undefined, code: string | null | undefined,
  claimedAnswer: string | null | undefined): boolean {
  const parsed = exactReplaySchema.safeParse(replay);
  if (!parsed.success) return false;
  const value = parsed.data;
  return value.status === "PASS" && value.reason === "MATCH" &&
    Boolean(value.image && /^.+@sha256:[a-f0-9]{64}$/.test(value.image)) &&
    value.codeDigest === sha256(code ?? "") && value.claimedAnswer === claimedAnswer &&
    value.observedAnswer === claimedAnswer;
}
