-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "Program" ADD COLUMN     "cohort" TEXT;
ALTER TABLE "Program" ADD COLUMN     "coverImage" TEXT;
ALTER TABLE "Program" ADD COLUMN     "updatedById" TEXT;

-- CreateTable
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Program_cohort_idx" ON "Program"("cohort");

-- CreateIndex
CREATE INDEX "Program_updatedById_idx" ON "Program"("updatedById");

-- CreateIndex
CREATE INDEX "Announcement_programId_idx" ON "Announcement"("programId");

-- CreateIndex
CREATE INDEX "Announcement_createdAt_idx" ON "Announcement"("createdAt");

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;
