-- Rename the misspelled column while keeping existing data intact.
ALTER TABLE "Program"
RENAME COLUMN "programBenifits" TO "programBenefits";
