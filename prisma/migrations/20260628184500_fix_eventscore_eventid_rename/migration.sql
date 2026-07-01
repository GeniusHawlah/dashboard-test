-- Align the renamed EventScore table with the Prisma model field names.
ALTER TABLE "EventScore" RENAME COLUMN "activityId" TO "eventId";

-- Keep generated constraint and index names consistent with the Event model.
ALTER TABLE "EventScore" RENAME CONSTRAINT "ActivityResult_activityId_fkey" TO "EventScore_eventId_fkey";
ALTER TABLE "EventScore" RENAME CONSTRAINT "ActivityResult_pkey" TO "EventScore_pkey";
ALTER INDEX IF EXISTS "ActivityResult_activityId_idx" RENAME TO "EventScore_eventId_idx";
ALTER INDEX IF EXISTS "ActivityResult_userId_idx" RENAME TO "EventScore_userId_idx";
