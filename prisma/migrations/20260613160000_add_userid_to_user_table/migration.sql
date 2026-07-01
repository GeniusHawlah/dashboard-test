-- Add the Better Auth user identifier to the existing user table.
ALTER TABLE "user" ADD COLUMN "userId" TEXT;

-- Backfill existing rows so the new unique column is immediately valid.
UPDATE "user"
SET "userId" = "id"
WHERE "userId" IS NULL;

-- Enforce the constraint expected by the Prisma schema and Better Auth.
ALTER TABLE "user" ALTER COLUMN "userId" SET NOT NULL;
CREATE UNIQUE INDEX "user_userId_key" ON "user"("userId");
