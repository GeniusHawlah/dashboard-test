"use server";

import { db } from "@/lib/db";
import { guardError } from "@/utils/error-helpers";

export default async function generateUserId(): Promise<{
  success?: {
    userId: string;
    message: string;
  };
  error?: {
    message: string;
    statusCode?: number;
  };
}> {
  const yearCode = new Date().getFullYear().toString().slice(-2);
  const counterId = `PROFAK-${yearCode}`;

  try {
    const counter = await db.counter.upsert({
      where: { id: counterId },
      update: { seq: { increment: 1 } },
      create: { id: counterId, seq: 1 },
    });

    const seqStr = counter.seq.toString().padStart(4, "0");

    return {
      success: {
        userId: `PROFAK${yearCode}-${seqStr}`,
        message: "User ID generated successfully.",
      },
    };
  } catch (error) {
    const message = guardError(error);

    return {
      error: {
        message,
      },
    };
  }
}
