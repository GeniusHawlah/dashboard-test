-- AlterTable
ALTER TABLE "Result" DROP COLUMN "score";

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityResult" (
    "id" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "resultId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "score" DOUBLE PRECISION,
    "remark" TEXT,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActivityResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Activity_programId_idx" ON "Activity"("programId");

-- CreateIndex
CREATE INDEX "Activity_isActive_idx" ON "Activity"("isActive");

-- CreateIndex
CREATE INDEX "Activity_sortOrder_idx" ON "Activity"("sortOrder");

-- CreateIndex
CREATE INDEX "ActivityResult_activityId_idx" ON "ActivityResult"("activityId");

-- CreateIndex
CREATE INDEX "ActivityResult_resultId_idx" ON "ActivityResult"("resultId");

-- CreateIndex
CREATE INDEX "ActivityResult_userId_idx" ON "ActivityResult"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ActivityResult_activityId_resultId_key" ON "ActivityResult"("activityId", "resultId");

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityResult" ADD CONSTRAINT "ActivityResult_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityResult" ADD CONSTRAINT "ActivityResult_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "Result"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityResult" ADD CONSTRAINT "ActivityResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
