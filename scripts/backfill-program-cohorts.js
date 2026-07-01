require("dotenv/config");

const { PrismaClient } = require("@prisma/client");

async function main() {
  const prisma = new PrismaClient();

  try {
    const updatedRows = await prisma.$executeRawUnsafe(`
      UPDATE "Program"
      SET "cohort" = regexp_replace("cohort", '^GoFinance-', 'COHORT-')
      WHERE "cohort" LIKE 'GoFinance-%'
    `);

    console.log(`Updated ${updatedRows} program cohorts.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.log("[backfill-program-cohorts]", error);
  process.exitCode = 1;
});
