-- CreateTable
CREATE TABLE "_ProgramMentors" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProgramMentors_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProgramMentors_B_index" ON "_ProgramMentors"("B");

-- AddForeignKey
ALTER TABLE "_ProgramMentors" ADD CONSTRAINT "_ProgramMentors_A_fkey" FOREIGN KEY ("A") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProgramMentors" ADD CONSTRAINT "_ProgramMentors_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
