import { PrismaClient } from "@/utils/prisma";

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

//#-------------------------------

// import "dotenv/config";

// import { PrismaClient } from "@/prisma/generated/prisma/client";

// declare global {
//   // allow globalThis override for dev HMR
//   var prisma: PrismaClient | undefined;
// }

// const prismaClientSingleton = () => {
//   console.log(
//     "Creating PrismaClient – DATABASE_URL:",
//     process.env.DATABASE_URL,
//   ); // debug
//   return new PrismaClient({
//     // log: ["query", "info", "warn", "error"], // uncomment to see queries
//   });
// };

// type PrismaSingleton = ReturnType<typeof prismaClientSingleton>;
// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaSingleton | undefined;
// };

// export const db = globalForPrisma.prisma ?? prismaClientSingleton();

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

// //  default db;
