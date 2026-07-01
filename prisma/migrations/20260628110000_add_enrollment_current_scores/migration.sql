-- Add live score columns to enrollments
ALTER TABLE "MenteeProgramEnrollment"
  ADD COLUMN IF NOT EXISTS "totalScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "averageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "percentage" DOUBLE PRECISION NOT NULL DEFAULT 0;

WITH score_totals AS (
  SELECT
    e."id" AS "enrollmentId",
    COALESCE(COUNT(a."id"), 0) AS "activityCount",
    COALESCE(SUM(ascore."score"), 0) AS "totalScore"
  FROM "MenteeProgramEnrollment" e
  LEFT JOIN "Activity" a
    ON a."programId" = e."programId"
   AND a."isActive" = true
  LEFT JOIN "ActivityScore" ascore
    ON ascore."activityId" = a."id"
   AND ascore."userId" = e."userId"
  GROUP BY e."id"
)
UPDATE "MenteeProgramEnrollment" enrollment
SET
  "totalScore" = score_totals."totalScore",
  "averageScore" = CASE
    WHEN score_totals."activityCount" > 0
      THEN ROUND((score_totals."totalScore" / score_totals."activityCount")::numeric, 2)::double precision
    ELSE 0
  END,
  "percentage" = CASE
    WHEN score_totals."activityCount" > 0
      THEN ROUND(((score_totals."totalScore" / (score_totals."activityCount" * 100.0)) * 100)::numeric, 2)::double precision
    ELSE 0
  END
FROM score_totals
WHERE enrollment."id" = score_totals."enrollmentId";
