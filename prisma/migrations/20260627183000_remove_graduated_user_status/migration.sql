BEGIN;

UPDATE "user"
SET "status" = 'ACTIVE'
WHERE "status" = 'GRADUATED';

ALTER TYPE "UserStatus" RENAME TO "UserStatus_old";

CREATE TYPE "UserStatus" AS ENUM (
  'ACTIVE',
  'INACTIVE',
  'UNAPPROVED',
  'SUSPENDED',
  'RESIGNED',
  'SACKED'
);

ALTER TABLE "user"
ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "status" TYPE "UserStatus"
USING ("status"::text::"UserStatus"),
ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

DROP TYPE "UserStatus_old";

COMMIT;
