-- Set the default after the enum value has already been committed.
ALTER TABLE "user" ALTER COLUMN "status" SET DEFAULT 'UNAPPROVED';
