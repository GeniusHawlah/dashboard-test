-- Rename Activity to Event and ActivityScore to EventScore.
ALTER TABLE "Activity" RENAME TO "Event";
ALTER TABLE "ActivityScore" RENAME TO "EventScore";

-- Align key and index names with the renamed models.
ALTER INDEX IF EXISTS "Activity_programId_idx" RENAME TO "Event_programId_idx";
ALTER INDEX IF EXISTS "Activity_isActive_idx" RENAME TO "Event_isActive_idx";
ALTER INDEX IF EXISTS "Activity_generatedId_key" RENAME TO "Event_generatedId_key";
ALTER INDEX IF EXISTS "ActivityScore_activityId_userId_key" RENAME TO "EventScore_eventId_userId_key";
ALTER INDEX IF EXISTS "ActivityScore_activityId_idx" RENAME TO "EventScore_eventId_idx";
ALTER INDEX IF EXISTS "ActivityScore_userId_idx" RENAME TO "EventScore_userId_idx";

-- Add the new fields, backfill them, then remove the temporary defaults.
ALTER TABLE "Event" ADD COLUMN "note" TEXT;
ALTER TABLE "Event" ADD COLUMN "eventDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Event" ADD COLUMN "eventTime" TEXT NOT NULL DEFAULT '09:00';

UPDATE "Event"
SET "eventDate" = date_trunc('day', "createdAt"),
    "eventTime" = to_char("createdAt", 'HH24:MI');

ALTER TABLE "Event" ALTER COLUMN "eventDate" DROP DEFAULT;
ALTER TABLE "Event" ALTER COLUMN "eventTime" DROP DEFAULT;

-- Remove the retired ordering column.
DROP INDEX IF EXISTS "Activity_sortOrder_idx";
ALTER TABLE "Event" DROP COLUMN IF EXISTS "sortOrder";
