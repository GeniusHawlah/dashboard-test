"use server";

import { db } from "@/lib/db";
import { guardError } from "@/utils/error-helpers";
import type { Prisma, PrismaClient } from "@prisma/client";

type EventDbClient = Prisma.TransactionClient | PrismaClient;

function padMonth(value: number) {
  return value.toString().padStart(2, "0");
}

function getCounterId(date: Date) {
  const month = padMonth(date.getUTCMonth() + 1);
  const year = date.getUTCFullYear().toString().slice(-2);

  return {
    counterId: `PF-${month}${year}`,
    prefix: `PF${month}${year}`,
  };
}

export default async function generateEventId(
  client: EventDbClient = db,
  referenceDate: Date = new Date(),
): Promise<{
  success?: {
    eventGeneratedId: string;
    message: string;
  };
  error?: {
    message: string;
    statusCode?: number;
  };
}> {
  const { counterId, prefix } = getCounterId(referenceDate);

  try {
    const counter = await client.counter.upsert({
      where: { id: counterId },
      update: { seq: { increment: 1 } },
      create: { id: counterId, seq: 1 },
    });

    return {
      success: {
        eventGeneratedId: `${prefix}${counter.seq}`,
        message: "Event ID generated successfully.",
      },
    };
  } catch (error) {
    return {
      error: {
        message: guardError(error),
      },
    };
  }
}
