"use server";

import { db } from "@/lib/db";
import { GENERAL_FORM_ERROR_MESSAGE } from "@/utils/constants";
import { guardError } from "@/utils/error-helpers";
import { buildForgotPasswordCodeEmail } from "@/utils/emailTemplates";
import {
  logActionFailure,
  logActionStart,
  logActionSuccess,
} from "@/utils/serverActionLogger";
import { sendEmail } from "@/utils/sendEmail";
import { RequestOtpSchema } from "@/utils/zod/requestOtpSchema";
import { randomInt } from "node:crypto";
import { z } from "zod";

const RESET_CODE_TTL_MINUTES = 15;
const RESET_CODE_PURPOSE = "FORGOT_PASSWORD";
const GENERIC_SUCCESS_MESSAGE =
  "If an account matches that email, a code has been sent.";
const ALPHANUMERIC_CODE_LENGTH = 8;
const ALPHANUMERIC_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export interface RequestOtpDataInterface {
  email: string;
}

export interface RequestOtpFormErrorsInterface {
  email?: { errors: string[] };
}

export interface RequestOtpFormStateInterface {
  error?: {
    message: string;
    formErrors?: RequestOtpFormErrorsInterface;
    statusCode?: number;
  };
  success?: {
    message: string;
  };
}

function getFormErrors(
  error: z.ZodError,
): RequestOtpFormErrorsInterface | undefined {
  const tree = z.treeifyError(error) as {
    properties?: RequestOtpFormErrorsInterface;
  };

  return tree.properties;
}

function getVerificationIdentifier(email: string) {
  return `${RESET_CODE_PURPOSE}:${email}`;
}

function generateResetCode() {
  return Array.from({ length: ALPHANUMERIC_CODE_LENGTH }, () =>
    ALPHANUMERIC_CHARSET[randomInt(0, ALPHANUMERIC_CHARSET.length)],
  ).join("");
}

async function findUserByEmail(email: string) {
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

export default async function requestOtpAction(
  otpData: RequestOtpDataInterface,
): Promise<RequestOtpFormStateInterface> {
  logActionStart({
    action: "requestOtpAction",
    context: {
      email: otpData.email,
    },
  });

  const validatedFields = RequestOtpSchema.safeParse(otpData);

  if (!validatedFields.success) {
    await logActionFailure({
      action: "requestOtpAction",
      message: GENERAL_FORM_ERROR_MESSAGE,
      context: {
        email: otpData.email,
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

  try {
    const user = await findUserByEmail(email);

    if (user) {
      const code = generateResetCode();
      const identifier = getVerificationIdentifier(email);
      const expiresAt = new Date(
        Date.now() + RESET_CODE_TTL_MINUTES * 60 * 1000,
      );

      await db.$transaction(async (tx) => {
        await tx.verification.deleteMany({
          where: {
            identifier,
          },
        });

        await tx.verification.create({
          data: {
            identifier,
            value: code,
            expiresAt,
          },
        });
      });

      await sendEmail({
        to: email,
        subject: "Password reset code",
        text: buildForgotPasswordCodeEmail({
          name: user.name,
          code,
          expiresInMinutes: RESET_CODE_TTL_MINUTES,
        }),
      });
    }

    await logActionSuccess({
      action: "requestOtpAction",
      message: "OTP request processed.",
      context: {
        email,
        userId: user?.id,
      },
    });

    return {
      success: {
        message: GENERIC_SUCCESS_MESSAGE,
      },
    };
  } catch (error) {
    const message = guardError(error);

    await logActionFailure({
      action: "requestOtpAction",
      message,
      context: {
        email,
      },
    });

    return {
      error: {
        message:
          "Unable to send the reset code right now. Please try again later.",
        statusCode: 500,
      },
    };
  }
}
