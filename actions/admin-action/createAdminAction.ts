"use server";

import checkIsActiveAction from "@/actions/auth-actions/checkIsActiveAction";
import generateUserId from "@/actions/student-action/generateUserId";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getCachedSession } from "@/utils/getCachedSession";
import { resolveImageInput } from "@/utils/cloudinaryUpload";
import {
  AUTHENTICATION_ERROR_MESSAGE,
  AUTHORIZATION_ERROR_MESSAGE,
  GENERAL_FORM_ERROR_MESSAGE,
  INACTIVE_ERROR_MESSAGE,
  NETWORK_ERROR_MESSAGE,
} from "@/utils/constants";
import { isSuperAdmin, isTechAdmin } from "@/utils/auth-helpers";
import { guardError, networkError } from "@/utils/error-helpers";
import {
  logActionFailure,
  logActionStart,
  logActionSuccess,
} from "@/utils/serverActionLogger";
import { RelativeRoutes } from "@/utils/enum";
import { capitalizeFirstLetter, formatTitledName } from "@/utils/utils";
import {
  CreateAdminSchema,
  type CreateAdminRequest,
} from "@/utils/zod/createAdminSchema";
import { UserRole, UserStatus } from "@/utils/prisma";
import { updateTag } from "next/cache";
import { z } from "zod";

export type CreateAdminData = CreateAdminRequest;

export interface CreateAdminFormErrors {
  role?: { errors: string[] };
  title?: { errors: string[] };
  firstName?: { errors: string[] };
  lastName?: { errors: string[] };
  email?: { errors: string[] };
  gender?: { errors: string[] };
  dateOfBirth?: { errors: string[] };
  phoneNumber?: { errors: string[] };
  address?: { errors: string[] };
  passport?: { errors: string[] };
  idCard?: { errors: string[] };
}

export interface CreateAdminFormStateInterface {
  error?: {
    message: string;
    formErrors?: CreateAdminFormErrors;
    statusCode?: number;
  };
  success?: {
    message: string;
  };
}

function normalizeText(value?: string | null) {
  return value?.trim() || "";
}

function getFormErrors(error: z.ZodError): CreateAdminFormErrors | undefined {
  const tree = z.treeifyError(error) as {
    properties?: CreateAdminFormErrors;
  };

  return tree.properties;
}

export default async function createAdminAction(
  adminData: CreateAdminData,
): Promise<CreateAdminFormStateInterface> {
  logActionStart({
    action: "createAdminAction",
    context: {
      email: adminData.email,
      role: adminData.role,
    },
  });

  const session = await getCachedSession();

  if (!session) {
    await logActionFailure({
      action: "createAdminAction",
      message: AUTHENTICATION_ERROR_MESSAGE,
      context: {
        email: adminData.email,
        role: adminData.role,
      },
    });

    return {
      error: {
        message: AUTHENTICATION_ERROR_MESSAGE,
        statusCode: 401,
      },
    };
  }

  const actorId = session.user.id;
  const actorIsActive = await checkIsActiveAction(actorId);

  if (!actorIsActive) {
    await logActionFailure({
      action: "createAdminAction",
      message: INACTIVE_ERROR_MESSAGE,
      context: {
        actorId,
        email: adminData.email,
        role: adminData.role,
      },
    });

    return {
      error: {
        message: INACTIVE_ERROR_MESSAGE,
        statusCode: 403,
      },
    };
  }

  const actorIsTechAdmin = isTechAdmin({ session });
  const actorIsSuperAdmin = isSuperAdmin({ session });

  if (!actorIsTechAdmin && !actorIsSuperAdmin) {
    await logActionFailure({
      action: "createAdminAction",
      message: AUTHORIZATION_ERROR_MESSAGE,
      context: {
        actorId,
        email: adminData.email,
        role: adminData.role,
      },
    });

    return {
      error: {
        message: AUTHORIZATION_ERROR_MESSAGE,
        statusCode: 403,
      },
    };
  }

  const validatedFields = CreateAdminSchema.safeParse(adminData);

  if (!validatedFields.success) {
    await logActionFailure({
      action: "createAdminAction",
      message: GENERAL_FORM_ERROR_MESSAGE,
      context: {
        actorId,
        email: adminData.email,
        role: adminData.role,
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

  const normalizedTitle = normalizeText(validatedFields.data.title);
  const normalizedFirstName = capitalizeFirstLetter(
    normalizeText(validatedFields.data.firstName),
  );
  const normalizedLastName = normalizeText(validatedFields.data.lastName).toUpperCase();
  const normalizedEmail = normalizeText(validatedFields.data.email).toLowerCase();
  const normalizedPhone = normalizeText(validatedFields.data.phoneNumber);
  const normalizedAddress = normalizeText(validatedFields.data.address);
  const defaultPassword = process.env.DEFAULT_USER_PASSWORD;
  const role = actorIsSuperAdmin
    ? UserRole.ADMIN
    : validatedFields.data.role ?? UserRole.ADMIN;

  if (!defaultPassword) {
    await logActionFailure({
      action: "createAdminAction",
      message: "Default user password is not configured.",
      context: {
        actorId,
        email: normalizedEmail,
        role,
      },
    });

    return {
      error: {
        message: "Default user password is not configured.",
        statusCode: 500,
      },
    };
  }

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
        action: "createAdminAction",
        message: "A user with this email or phone number already exists.",
        context: {
          actorId,
          email: normalizedEmail,
          phoneNumber: normalizedPhone,
          role,
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
        action: "createAdminAction",
        message: generatedId.error.message,
        context: {
          actorId,
          email: normalizedEmail,
          role,
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
        action: "createAdminAction",
        message: "There is a problem generating a user ID.",
        context: {
          actorId,
          email: normalizedEmail,
          role,
        },
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
      resolveImageInput(validatedFields.data.passport, {
        kind: "passport",
        folder: "admins/passports",
        publicIdPrefix: userId,
      }),
      resolveImageInput(validatedFields.data.idCard, {
        kind: "id-card",
        folder: "admins/id-cards",
        publicIdPrefix: userId,
      }),
    ]);

    await auth.api.signUpEmail({
      body: {
        title: normalizedTitle,
        firstName: normalizedFirstName,
        lastName: normalizedLastName,
        name: [normalizedFirstName, normalizedLastName]
          .filter(Boolean)
          .join(" "),
        email: normalizedEmail,
        password: defaultPassword,
        userId,
        gender: validatedFields.data.gender,
        dateOfBirth: validatedFields.data.dateOfBirth,
        phoneNumber: normalizedPhone || undefined,
        address: normalizedAddress || undefined,
        passport: passportUrl || undefined,
        idCard: idCardUrl || undefined,
        role,
        status: UserStatus.ACTIVE,
        isFirstLogin: true,
        callbackURL: RelativeRoutes.VERIFY_EMAIL_PAGE,
      },
    });

    const createdAdmin = await db.user.findUnique({
      where: { userId },
      select: {
        id: true,
        title: true,
        name: true,
        email: true,
        role: true,
      },
    });

    updateTag(`getAdmins-${actorId}`);
    updateTag(`getSuperAdminOverview-${actorId}`);
    updateTag(`getTechAdminOverview-${actorId}`);

    const displayName = createdAdmin
      ? formatTitledName(createdAdmin)
      : formatTitledName({
          title: normalizedTitle || null,
          name: [normalizedFirstName, normalizedLastName]
            .filter(Boolean)
            .join(" "),
        });

    await logActionSuccess({
      action: "createAdminAction",
      message: "Admin account created successfully.",
      context: {
        actorId,
        targetType: "admin",
        targetId: createdAdmin?.id,
        targetName: displayName,
        email: createdAdmin?.email ?? normalizedEmail,
        userId,
        role,
        storedRole: createdAdmin?.role ?? role,
        forcedInitialPasswordChange: true,
      },
    });

    return {
      success: {
        message:
          "Admin account created successfully. Check the email inbox to verify the account.",
      },
    };
  } catch (error) {
    const message = networkError(
      (error as { message?: string } | undefined)?.message,
    )
      ? NETWORK_ERROR_MESSAGE
      : guardError(error);

    await logActionFailure({
      action: "createAdminAction",
      message,
      context: {
        actorId,
        email: normalizedEmail,
        role,
      },
    });

    return {
      error: {
        message,
      },
    };
  }
}
