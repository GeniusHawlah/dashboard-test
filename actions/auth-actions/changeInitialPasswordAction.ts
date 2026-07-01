"use server";

import { db } from "@/lib/db";
import { getCachedSession } from "@/utils/getCachedSession";
import {
  AUTHENTICATION_ERROR_MESSAGE,
  GENERAL_FORM_ERROR_MESSAGE,
  NETWORK_ERROR_MESSAGE,
} from "@/utils/constants";
import {
  logActionFailure,
  logActionStart,
  logActionSuccess,
} from "@/utils/serverActionLogger";
import { getUserDashboardRoute } from "@/utils/auth-helpers";
import { RelativeRoutes } from "@/utils/enum";
import { guardError, networkError } from "@/utils/error-helpers";
import { InitialPasswordSchema } from "@/utils/zod/initialPasswordSchema";
import { hashPassword } from "better-auth/crypto";
import { z } from "zod";

export interface InitialPasswordData {
  newPassword: string;
  confirmNewPassword: string;
}

export interface InitialPasswordActionState {
  success?: {
    message: string;
    redirectTo: string;
  };
  error?: {
    message: string;
    formErrors?: {
      newPassword?: { errors: string[] };
      confirmNewPassword?: { errors: string[] };
    };
  };
}

export default async function changeInitialPasswordAction(
  data: InitialPasswordData,
): Promise<InitialPasswordActionState> {
  logActionStart({ action: "changeInitialPasswordAction" });

  const session = await getCachedSession();

  if (!session) {
    await logActionFailure({
      action: "changeInitialPasswordAction",
      message: AUTHENTICATION_ERROR_MESSAGE,
    });
    return { error: { message: AUTHENTICATION_ERROR_MESSAGE } };
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, isFirstLogin: true },
  });

  if (!user?.isFirstLogin) {
    await logActionFailure({
      action: "changeInitialPasswordAction",
      message: "This password setup link is no longer available.",
      context: { actorId: session.user.id },
    });
    return {
      error: {
        message: "This password setup link is no longer available.",
      },
    };
  }

  const validated = InitialPasswordSchema.safeParse(data);

  if (!validated.success) {
    await logActionFailure({
      action: "changeInitialPasswordAction",
      message: GENERAL_FORM_ERROR_MESSAGE,
      context: { actorId: session.user.id },
    });
    return {
      error: {
        message: GENERAL_FORM_ERROR_MESSAGE,
        formErrors: z.treeifyError(validated.error).properties,
      },
    };
  }

  try {
    const passwordHash = await hashPassword(validated.data.newPassword);
    const account = await db.account.findFirst({
      where: { userId: user.id, providerId: "credential" },
      select: { id: true },
    });

    await db.$transaction(async (tx) => {
      if (account) {
        await tx.account.update({
          where: { id: account.id },
          data: { password: passwordHash },
          select: { id: true },
        });
      } else {
        await tx.account.create({
          data: {
            id: crypto.randomUUID(),
            userId: user.id,
            accountId: user.id,
            providerId: "credential",
            password: passwordHash,
          },
          select: { id: true },
        });
      }

      await tx.user.update({
        where: { id: user.id },
        data: { isFirstLogin: false },
        select: { id: true },
      });
    });

    const redirectTo =
      getUserDashboardRoute(session) ?? RelativeRoutes.LOGIN_PAGE;

    await logActionSuccess({
      action: "changeInitialPasswordAction",
      message: "Password set successfully.",
      context: {
        actorId: session.user.id,
        targetType: "user",
        targetId: user.id,
        targetName: session.user.name,
        redirectTo,
      },
    });

    return {
      success: {
        message: "Password set successfully.",
        redirectTo,
      },
    };
  } catch (err: any) {
    const message = networkError(err?.message) ? NETWORK_ERROR_MESSAGE : guardError(err);

    await logActionFailure({
      action: "changeInitialPasswordAction",
      message,
      context: { actorId: session.user.id },
    });

    return {
      error: {
        message,
      },
    };
  }
}
