-- Rename the activity score table to match the new Prisma model name.
ALTER TABLE "ActivityResult" RENAME TO "ActivityScore";

-- Drop the legacy Result relation from activity scores.
ALTER TABLE "ActivityScore" DROP CONSTRAINT "ActivityResult_resultId_fkey";
DROP INDEX IF EXISTS "ActivityResult_activityId_resultId_key";
ALTER TABLE "ActivityScore" DROP COLUMN "resultId";

-- Recreate the uniqueness constraint for one score row per activity and user.
CREATE UNIQUE INDEX "ActivityScore_activityId_userId_key" ON "ActivityScore"("activityId", "userId");

-- Remove the legacy history link to Result.
ALTER TABLE "EnrollmentHistory" DROP CONSTRAINT "EnrollmentHistory_resultId_fkey";
DROP INDEX IF EXISTS "EnrollmentHistory_resultId_key";
DROP INDEX IF EXISTS "EnrollmentHistory_resultId_idx";
ALTER TABLE "EnrollmentHistory" DROP COLUMN "resultId";

-- Remove the retired Result table entirely.
DROP TABLE "Result";
