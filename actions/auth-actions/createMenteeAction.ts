"use server";

import generateUserId from "@/actions/student-action/generateUserId";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { GENERAL_FORM_ERROR_MESSAGE } from "@/utils/constants";
import { guardError } from "@/utils/error-helpers";
import { resolveImageInput } from "@/utils/cloudinaryUpload";
import { RelativeRoutes } from "@/utils/enum";
import { capitalizeFirstLetter } from "@/utils/utils";
import {
  logActionFailure,
  logActionStart,
  logActionSuccess,
} from "@/utils/serverActionLogger";
import { CreateMenteeSchema } from "@/utils/zod/createMenteeSchema";
import { UserRole } from "@/utils/prisma";
import { z } from "zod";
import { type MenteeRegDataInterface } from "@/utils/types";

export interface MenteeRegFormErrorsInterface {
  firstName?: { errors: string[] };
  middleName?: { errors: string[] };
  lastName?: { errors: string[] };
  email?: { errors: string[] };
  password?: { errors: string[] };
  confirmPassword?: { errors: string[] };
  educationLevel?: { errors: string[] };
  gender?: { errors: string[] };
  dateOfBirth?: { errors: string[] };
  phoneNumber?: { errors: string[] };
  address?: { errors: string[] };
  passport?: { errors: string[] };
  idCard?: { errors: string[] };
  programId?: { errors: string[] };
}

export interface MenteeRegFormStateInterface {
  error?: {
    message: string;
    formErrors?: MenteeRegFormErrorsInterface;
    statusCode?: number;
  };
  success?: {
    message: string;
  };
}

interface SignUpEmailBodyInterface extends Omit<
  MenteeRegDataInterface,
  "confirmPassword" | "dateOfBirth"
> {
  dateOfBirth: Date;
  name: string;
  userId: string;
  role: UserRole;
  callbackURL?: string;
}

function normalizeText(value?: string | null) {
  return value?.trim() || "";
}

function getFormErrors(
  error: z.ZodError,
): MenteeRegFormErrorsInterface | undefined {
  const tree = z.treeifyError(error) as {
    properties?: MenteeRegFormErrorsInterface;
  };

  return tree.properties;
}

function normalizeInput(menteeData: MenteeRegDataInterface) {
  return {
    ...menteeData,
    middleName: menteeData.middleName ?? undefined,
    phoneNumber: menteeData.phoneNumber ?? undefined,
    address: menteeData.address ?? undefined,
    programId: menteeData.programId ?? undefined,
  };
}

export default async function createMenteeAction(
  menteeData: MenteeRegDataInterface,
): Promise<MenteeRegFormStateInterface> {
  logActionStart({
    action: "createMenteeAction",
    context: {
      email: menteeData.email,
      phoneNumber: menteeData.phoneNumber,
    },
  });

  const validatedFields = CreateMenteeSchema.safeParse(
    normalizeInput(menteeData),
  );

  if (!validatedFields.success) {
    await logActionFailure({
      action: "createMenteeAction",
      message: GENERAL_FORM_ERROR_MESSAGE,
      context: {
        email: menteeData.email,
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

  const {
    firstName,
    middleName,
    lastName,
    email,
    password,
    educationLevel,
    gender,
    dateOfBirth,
    phoneNumber,
    address,
    passport,
    idCard,
    programId,
  } = validatedFields.data;

  const normalizedFirstName = capitalizeFirstLetter(normalizeText(firstName));
  const normalizedMiddleName = normalizeText(middleName);
  const normalizedLastName = normalizeText(lastName).toUpperCase();
  const normalizedEmail = normalizeText(email).toLowerCase();
  const normalizedPhone = normalizeText(phoneNumber);
  const normalizedAddress = normalizeText(address);

  try {
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { email: normalizedEmail },
          ...(normalizedPhone ? [{ phoneNumber: normalizedPhone }] : []),
        ],
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      await logActionFailure({
        action: "createMenteeAction",
        message: "A user with this email or phone number already exists.",
        context: {
          email: normalizedEmail,
          phoneNumber: normalizedPhone,
        },
      });

      return {
        error: {
          message: "A user with this email or phone number already exists.",
          statusCode: 409,
        },
      };
    }

    const generatedId = await generateUserId();

    if (generatedId.error) {
      await logActionFailure({
        action: "createMenteeAction",
        message: generatedId.error.message,
        context: {
          email: normalizedEmail,
        },
      });

      return {
        error: {
          message: generatedId.error.message,
          statusCode: generatedId.error.statusCode ?? 500,
        },
      };
    }

    if (!generatedId.success) {
      await logActionFailure({
        action: "createMenteeAction",
        message: "There is a problem generating a user ID.",
      });

      return {
        error: {
          message: "There is a problem generating a user ID.",
          statusCode: 500,
        },
      };
    }

    const userId = generatedId.success.userId;

    const [passportUrl, idCardUrl] = await Promise.all([
      resolveImageInput(passport, {
        kind: "passport",
        folder: "mentees/passports",
        publicIdPrefix: userId,
      }),
      resolveImageInput(idCard, {
        kind: "id-card",
        folder: "mentees/id-cards",
        publicIdPrefix: userId,
      }),
    ]);

    const signUpBody = {
      name: [normalizedFirstName, normalizedMiddleName, normalizedLastName]
        .filter(Boolean)
        .join(" "),
      email: normalizedEmail,
      password,
      educationLevel,
      firstName: normalizedFirstName,
      middleName: normalizedMiddleName || undefined,
      lastName: normalizedLastName,
      userId,
      gender,
      dateOfBirth,
      phoneNumber: normalizedPhone || undefined,
      address: normalizedAddress || undefined,
      passport: passportUrl || undefined,
      idCard: idCardUrl || undefined,
      programId: programId || undefined,
      role: UserRole.MENTEE,
      callbackURL: RelativeRoutes.LOGIN_PAGE,
    } satisfies SignUpEmailBodyInterface;

    await auth.api.signUpEmail({
      body: signUpBody,
    });

    await logActionSuccess({
      action: "createMenteeAction",
      message: "Mentee registered. Verification email sent.",
      context: {
        userId,
        email: normalizedEmail,
      },
    });

    return {
      success: {
        message: "Mentee registered. Check your email to verify your account.",
      },
    };
  } catch (error) {
    const message = guardError(error);
    const statusCode =
      (error as { statusCode?: number } | undefined)?.statusCode ?? 500;

    await logActionFailure({
      action: "createMenteeAction",
      message,
      context: {
        email: normalizedEmail,
      },
    });

    return {
      error: {
        message,
        statusCode,
      },
    };
  }
}
