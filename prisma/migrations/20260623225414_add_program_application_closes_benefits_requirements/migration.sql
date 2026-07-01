-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "applicationClosesAt" TIMESTAMP(3),
ADD COLUMN     "programBenifits" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "requirements" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE INDEX "Program_applicationClosesAt_idx" ON "Program"("applicationClosesAt");
