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
import { CreateMentorSchema } from "@/utils/zod/createMentorSchema";
import { UserRole } from "@prisma/client";
import { z } from "zod";
import { type MentorRegDataInterface } from "@/utils/types";

export interface MentorRegFormErrorsInterface {
  title?: { errors: string[] };
  firstName?: { errors: string[] };
  lastName?: { errors: string[] };
  email?: { errors: string[] };
  password?: { errors: string[] };
  confirmPassword?: { errors: string[] };
  gender?: { errors: string[] };
  dateOfBirth?: { errors: string[] };
  phoneNumber?: { errors: string[] };
  address?: { errors: string[] };
  passport?: { errors: string[] };
  idCard?: { errors: string[] };
  programId?: { errors: string[] };
}

export interface MentorRegFormStateInterface {
  error?: {
    message: string;
    formErrors?: MentorRegFormErrorsInterface;
    statusCode?: number;
  };
  success?: {
    message: string;
  };
}

interface SignUpEmailBodyInterface extends Omit<
  MentorRegDataInterface,
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
): MentorRegFormErrorsInterface | undefined {
  const tree = z.treeifyError(error) as {
    properties?: MentorRegFormErrorsInterface;
  };

  return tree.properties;
}

function normalizeInput(mentorData: MentorRegDataInterface) {
  return {
    ...mentorData,
    title: mentorData.title ?? undefined,
    phoneNumber: mentorData.phoneNumber ?? undefined,
    address: mentorData.address ?? undefined,
    programId: mentorData.programId ?? undefined,
  };
}

export default async function createMentorAction(
  mentorData: MentorRegDataInterface,
): Promise<MentorRegFormStateInterface> {
  logActionStart({
    action: "createMentorAction",
    context: {
      email: mentorData.email,
      phoneNumber: mentorData.phoneNumber,
    },
  });

  const validatedFields = CreateMentorSchema.safeParse(
    normalizeInput(mentorData),
  );

  if (!validatedFields.success) {
    await logActionFailure({
      action: "createMentorAction",
      message: GENERAL_FORM_ERROR_MESSAGE,
      context: {
        email: mentorData.email,
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
    title,
    firstName,
    lastName,
    email,
    password,
    gender,
    dateOfBirth,
    phoneNumber,
    address,
    passport,
    idCard,
    programId,
  } = validatedFields.data;

  const normalizedTitle = normalizeText(title);
  const normalizedFirstName = capitalizeFirstLetter(normalizeText(firstName));
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
        action: "createMentorAction",
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
        action: "createMentorAction",
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
        action: "createMentorAction",
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
        folder: "mentors/passports",
        publicIdPrefix: userId,
      }),
      resolveImageInput(idCard, {
        kind: "id-card",
        folder: "mentors/id-cards",
        publicIdPrefix: userId,
      }),
    ]);

    const signUpBody = {
      title: normalizedTitle,
      name: [normalizedFirstName, normalizedLastName].filter(Boolean).join(" "),
      email: normalizedEmail,
      password,
      firstName: normalizedFirstName,
      lastName: normalizedLastName,
      userId,
      gender,
      dateOfBirth,
      phoneNumber: normalizedPhone,
      address: normalizedAddress,
      passport: passportUrl || undefined,
      idCard: idCardUrl || undefined,
      programId: programId || undefined,
      role: UserRole.MENTOR,
      callbackURL: RelativeRoutes.VERIFY_EMAIL_PAGE,
    } satisfies SignUpEmailBodyInterface;

    await auth.api.signUpEmail({
      body: signUpBody,
    });

    await logActionSuccess({
      action: "createMentorAction",
      message: "Mentor registered. Verification email sent.",
      context: {
        userId,
        email: normalizedEmail,
      },
    });

    return {
      success: {
        message: "Mentor registered. Check your email to verify your account.",
      },
    };
  } catch (error) {
    const message = guardError(error);
    const statusCode =
      (error as { statusCode?: number } | undefined)?.statusCode ?? 500;

    await logActionFailure({
      action: "createMentorAction",
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
