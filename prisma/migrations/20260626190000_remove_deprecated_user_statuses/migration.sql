-- AlterEnum
BEGIN;
UPDATE "public"."user"
SET "status" = 'INACTIVE'
WHERE "status" IN ('TRANSFERRED', 'EXPELLED', 'DECEASED');
CREATE TYPE "UserStatus_new" AS ENUM ('ACTIVE', 'INACTIVE', 'UNAPPROVED', 'SUSPENDED', 'GRADUATED', 'RESIGNED', 'SACKED');
ALTER TABLE "public"."user" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."user" ALTER COLUMN "status" TYPE "UserStatus_new" USING ("status"::text::"UserStatus_new");
ALTER TYPE "UserStatus" RENAME TO "UserStatus_old";
ALTER TYPE "UserStatus_new" RENAME TO "UserStatus";
DROP TYPE "public"."UserStatus_old";
ALTER TABLE "public"."user" ALTER COLUMN "status" SET DEFAULT 'UNAPPROVED';
COMMIT;
