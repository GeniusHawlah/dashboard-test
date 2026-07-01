-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "generatedId" TEXT;

-- Backfill the new activity ID using the month, year, and per-month counter pattern.
WITH numbered_activities AS (
  SELECT
    "id",
    'PF' || to_char("createdAt", 'MMYY') || row_number() OVER (
      PARTITION BY date_trunc('month', "createdAt")
      ORDER BY "createdAt", "id"
    ) AS "generatedId"
  FROM "Activity"
)
UPDATE "Activity" AS activity
SET "generatedId" = numbered_activities."generatedId"
FROM numbered_activities
WHERE activity."id" = numbered_activities."id";

-- CreateIndex
CREATE UNIQUE INDEX "Activity_generatedId_key" ON "Activity"("generatedId");

-- Keep the counter table aligned with the highest existing generated IDs.
INSERT INTO "Counter" ("id", "seq")
SELECT
  'PF-' || to_char(date_trunc('month', "createdAt"), 'MMYY') AS "id",
  MAX(CAST(substring("generatedId" FROM 7) AS INTEGER)) AS "seq"
FROM "Activity"
WHERE "generatedId" IS NOT NULL
GROUP BY 1
ON CONFLICT ("id") DO UPDATE
SET "seq" = EXCLUDED."seq";

-- AlterTable
ALTER TABLE "Activity" ALTER COLUMN "generatedId" SET NOT NULL;
