-- Add program-wide ranking position to mentee enrollments.
ALTER TABLE "MenteeProgramEnrollment"
ADD COLUMN IF NOT EXISTS "position" INTEGER;
