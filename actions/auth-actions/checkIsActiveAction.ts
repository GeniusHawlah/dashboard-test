"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { logActionFailure } from "@/utils/serverActionLogger";
import { UserStatus } from "@prisma/client";

export default async function checkIsActiveAction(
  userId: string | undefined,
): Promise<boolean> {
  if (!userId) {
    await logActionFailure({
      action: "checkIsActiveAction",
      message: "missing user id",
    });
    return false;
  }

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { status: true },
    });

    if (user?.status !== UserStatus.ACTIVE) {
      await auth.api.signOut();
      await logActionFailure({
        action: "checkIsActiveAction",
        message: "user is not active",
        context: {
          userId,
          status: user?.status,
        },
      });
      return false;
    }

    return true;
  } catch (error: unknown) {
    await logActionFailure({
      action: "checkIsActiveAction",
      message: error instanceof Error ? error.message : "unknown error",
      context: {
        userId,
      },
    });
    return false;
  }
}
