-- DropForeignKey
ALTER TABLE "MenteePromotion" DROP CONSTRAINT "MenteePromotion_approvedById_fkey";

-- DropForeignKey
ALTER TABLE "MenteePromotion" DROP CONSTRAINT "MenteePromotion_enrollmentId_fkey";

-- DropForeignKey
ALTER TABLE "MenteePromotion" DROP CONSTRAINT "MenteePromotion_performedById_fkey";

-- DropForeignKey
ALTER TABLE "MenteePromotion" DROP CONSTRAINT "MenteePromotion_programId_fkey";

-- DropIndex
DROP INDEX "MenteeProgramEnrollment_status_currentLevel_idx";

-- DropIndex
DROP INDEX "Result_programId_level_idx";

-- DropIndex
DROP INDEX "Result_userId_programId_level_key";

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "score";

-- AlterTable
ALTER TABLE "ActivityResult" ALTER COLUMN "score" SET NOT NULL,
ALTER COLUMN "score" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "MenteeProgramEnrollment" DROP COLUMN "currentLevel",
DROP COLUMN "entryLevel";

-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "currentLevel" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Result" DROP COLUMN "level",
ADD COLUMN     "historyId" TEXT,
ADD COLUMN     "total" DOUBLE PRECISION;

-- DropTable
DROP TABLE "MenteePromotion";

-- DropEnum
DROP TYPE "PromotionStatus";

-- CreateTable
CREATE TABLE "EnrollmentHistory" (
    "id" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "fromLevel" INTEGER NOT NULL,
    "toLevel" INTEGER NOT NULL,
    "totalScore" DOUBLE PRECISION,
    "averageScore" DOUBLE PRECISION,
    "percentage" DOUBLE PRECISION,
    "note" TEXT,
    "performedById" TEXT,
    "movedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resultId" TEXT,

    CONSTRAINT "EnrollmentHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EnrollmentHistory_resultId_key" ON "EnrollmentHistory"("resultId");

-- CreateIndex
CREATE INDEX "EnrollmentHistory_enrollmentId_movedAt_idx" ON "EnrollmentHistory"("enrollmentId", "movedAt");

-- CreateIndex
CREATE INDEX "EnrollmentHistory_programId_movedAt_idx" ON "EnrollmentHistory"("programId", "movedAt");

-- CreateIndex
CREATE INDEX "EnrollmentHistory_performedById_idx" ON "EnrollmentHistory"("performedById");

-- CreateIndex
CREATE INDEX "EnrollmentHistory_resultId_idx" ON "EnrollmentHistory"("resultId");

-- CreateIndex
CREATE INDEX "MenteeProgramEnrollment_status_idx" ON "MenteeProgramEnrollment"("status");

-- CreateIndex
CREATE INDEX "Program_currentLevel_idx" ON "Program"("currentLevel");

-- CreateIndex
CREATE INDEX "Result_programId_historyId_idx" ON "Result"("programId", "historyId");

-- CreateIndex
CREATE INDEX "Result_historyId_idx" ON "Result"("historyId");

-- CreateIndex
CREATE UNIQUE INDEX "Result_userId_programId_historyId_key" ON "Result"("userId", "programId", "historyId");

-- AddForeignKey
ALTER TABLE "EnrollmentHistory" ADD CONSTRAINT "EnrollmentHistory_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "MenteeProgramEnrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrollmentHistory" ADD CONSTRAINT "EnrollmentHistory_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrollmentHistory" ADD CONSTRAINT "EnrollmentHistory_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "Result"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrollmentHistory" ADD CONSTRAINT "EnrollmentHistory_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
