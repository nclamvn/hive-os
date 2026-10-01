ALTER TABLE "math_pilot_formal_attempt" ADD COLUMN "repair_trace" JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE "math_pilot_formal_attempt" ADD CONSTRAINT "math_pilot_formal_attempt_repair_trace_shape"
  CHECK (jsonb_typeof("repair_trace") = 'array' AND jsonb_array_length("repair_trace") BETWEEN 1 AND 3);
