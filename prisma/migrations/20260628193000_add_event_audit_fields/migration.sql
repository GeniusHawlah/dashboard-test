-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "createdById" TEXT;
ALTER TABLE "Event" ADD COLUMN     "updatedById" TEXT;

-- CreateIndex
CREATE INDEX "Event_createdById_idx" ON "Event"("createdById");
CREATE INDEX "Event_updatedById_idx" ON "Event"("updatedById");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Event" ADD CONSTRAINT "Event_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
