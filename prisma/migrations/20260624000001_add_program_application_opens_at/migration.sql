-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "applicationOpensAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Program_applicationOpensAt_idx" ON "Program"("applicationOpensAt");
