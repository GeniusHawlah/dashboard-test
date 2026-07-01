"use server";

import { db } from "@/lib/db";
import { GENERAL_FORM_ERROR_MESSAGE } from "@/utils/constants";
import { guardError } from "@/utils/error-helpers";
import { buildPasswordResetSuccessEmail } from "@/utils/emailTemplates";
import {
  logActionFailure,
  logActionStart,
  logActionSuccess,
} from "@/utils/serverActionLogger";
import { sendEmail } from "@/utils/sendEmail";
import {
  ResetPasswordErrorSchema,
  ResetPasswordSchema,
  ResetPasswordSuccessSchema,
} from "@/utils/zod/resetPasswordSchema";
import { hashPassword } from "better-auth/crypto";
import { z } from "zod";

const RESET_CODE_PURPOSE = "FORGOT_PASSWORD";
const GENERIC_SUCCESS_MESSAGE = "Your password has been reset successfully.";
const GENERIC_FAILURE_MESSAGE = "Invalid or expired reset code.";

export interface ResetPasswordDataInterface {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordFormErrorsInterface {
  email?: { errors: string[] };
  code?: { errors: string[] };
  password?: { errors: string[] };
  confirmPassword?: { errors: string[] };
}

export interface ResetPasswordFormStateInterface {
  error?: {
    message: string;
    formErrors?: ResetPasswordFormErrorsInterface;
    statusCode?: number;
  };
  success?: {
    message: string;
  };
}

function getFormErrors(
  error: z.ZodError,
): ResetPasswordFormErrorsInterface | undefined {
  const tree = z.treeifyError(error) as {
    properties?: ResetPasswordFormErrorsInterface;
  };

  return tree.properties;
}

function getVerificationIdentifier(email: string) {
  return `${RESET_CODE_PURPOSE}:${email}`;
}

function getExpiryDate(expiresAt: Date) {
  return expiresAt.getTime() <= Date.now();
}

async function getUserByEmail(email: string) {
  return db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });
}

export default async function resetPasswordAction(
  resetPasswordData: ResetPasswordDataInterface,
): Promise<ResetPasswordFormStateInterface> {
  logActionStart({
    action: "resetPasswordAction",
    context: {
      email: resetPasswordData.email,
    },
  });

  const validatedFields = ResetPasswordSchema.safeParse(resetPasswordData);

  if (!validatedFields.success) {
    await logActionFailure({
      action: "resetPasswordAction",
      message: GENERAL_FORM_ERROR_MESSAGE,
      context: {
        email: resetPasswordData.email,
      },
    });

    return {
      error: {
        message: GENERAL_FORM_ERROR_MESSAGE,
        formErrors: getFormErrors(validatedFields.error),
        statusCode: 400,
      },
    };
  }

  const email = validatedFields.data.email.trim().toLowerCase();
  const code = validatedFields.data.code.trim().toUpperCase();
  const identifier = getVerificationIdentifier(email);

  try {
    const [user, verification] = await Promise.all([
      getUserByEmail(email),
      db.verification.findFirst({
        where: {
          identifier,
          value: code,
        },
        select: {
          id: true,
          expiresAt: true,
        },
      }),
    ]);

    if (!user || !verification) {
      await logActionFailure({
        action: "resetPasswordAction",
        message: GENERIC_FAILURE_MESSAGE,
        context: {
          email,
        },
      });

      return {
        error: {
          message: GENERIC_FAILURE_MESSAGE,
          statusCode: 400,
        },
      };
    }

    if (getExpiryDate(verification.expiresAt)) {
      await db.verification.deleteMany({
        where: {
          identifier,
        },
      });

      await logActionFailure({
        action: "resetPasswordAction",
        message: "Reset code has expired.",
        context: {
          email,
          userId: user.id,
        },
      });

      return {
        error: {
          message: "Reset code has expired. Please request a new one.",
          statusCode: 410,
        },
      };
    }

    const passwordHash = await hashPassword(validatedFields.data.password);

    const account = await db.account.findFirst({
      where: {
        userId: user.id,
        providerId: "credential",
      },
      select: {
        id: true,
      },
    });

    await db.$transaction(async (tx) => {
      if (account) {
        await tx.account.update({
          where: {
            id: account.id,
          },
          data: {
            password: passwordHash,
          },
          select: {
            id: true,
          },
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
          select: {
            id: true,
          },
        });
      }

      await tx.user.update({
        where: {
          id: user.id,
        },
        data: {
          isFirstLogin: false,
        },
        select: {
          id: true,
        },
      });

      await tx.verification.deleteMany({
        where: {
          identifier,
        },
      });

      await tx.session.deleteMany({
        where: {
          userId: user.id,
        },
      });
    });

    await logActionSuccess({
      action: "resetPasswordAction",
      message: "Password reset successfully.",
      context: {
        email,
        userId: user.id,
      },
    });

    await sendEmail({
      to: email,
      subject: "Your password has been updated",
      text: buildPasswordResetSuccessEmail(user.name || email),
    });

    return {
      success: {
        message: GENERIC_SUCCESS_MESSAGE,
      },
    };
  } catch (error) {
    const message = guardError(error);

    await logActionFailure({
      action: "resetPasswordAction",
      message,
      context: {
        email,
      },
    });

    return {
      error: {
        message:
          "Unable to reset your password right now. Please try again later.",
        statusCode: 500,
      },
    };
  }
}
