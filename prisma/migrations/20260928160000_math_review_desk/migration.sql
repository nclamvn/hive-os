ALTER TABLE "math_pilot_assessment"
  ADD COLUMN "review_checklist" JSONB,
  ADD COLUMN "review_checklist_digest" TEXT;

ALTER TABLE "math_pilot_assessment"
  ADD CONSTRAINT "math_pilot_assessment_checklist_pair"
    CHECK (("review_checklist" IS NULL) = ("review_checklist_digest" IS NULL)),
  ADD CONSTRAINT "math_pilot_assessment_checklist_digest_shape"
    CHECK ("review_checklist_digest" IS NULL OR "review_checklist_digest" ~ '^[a-f0-9]{64}$'),
  ADD CONSTRAINT "math_pilot_assessment_checklist_object"
    CHECK ("review_checklist" IS NULL OR jsonb_typeof("review_checklist") = 'object');
