"use server";

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
import checkIsActiveAction from "@/actions/auth-actions/checkIsActiveAction";
import { isAdmin } from "@/utils/auth-helpers";
import { guardError, networkError } from "@/utils/error-helpers";
import {
  logActionFailure,
  logActionStart,
  logActionSuccess,
} from "@/utils/serverActionLogger";
import {
  CreateProgramErrorSchema,
  CreateProgramSchema,
  type CreateProgramRequest,
} from "@/utils/zod/createProgramSchema";
import { updateTag } from "next/cache";
import { z } from "zod";
import { toTitleCase } from "@/utils/utils";
import { UserRole, UserStatus } from "@/utils/prisma";

const MONTH_ABBREVIATIONS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
] as const;

type CreateProgramFormErrors = z.infer<
  typeof CreateProgramErrorSchema
>["error"]["formErrors"];

export interface CreateProgramFormStateInterface {
  error?: {
    message: string;
    formErrors?: CreateProgramFormErrors;
    statusCode?: number;
  };
  success?: {
    message: string;
  };
}

function getFormErrors(
  error: z.ZodError,
): CreateProgramFormErrors | undefined {
  const tree = z.treeifyError(error) as {
    properties?: CreateProgramFormErrors;
  };

  return tree.properties;
}

function deriveProgramCohort(startsAt: Date) {
  const month = MONTH_ABBREVIATIONS[startsAt.getUTCMonth()];
  const year = startsAt.getUTCFullYear();

  return `COHORT-${month}-${year}`;
}

function normalizeStringList(values: string[]) {
  return Array.from(
    new Set(
      values
        .map((value) => value.trim())
        .filter((value) => value.length > 0),
    ),
  );
}

export default async function createProgramAction(
  programData: CreateProgramRequest,
): Promise<CreateProgramFormStateInterface> {
  logActionStart({
    action: "createProgramAction",
  });

  const validatedFields = CreateProgramSchema.safeParse(programData);

  if (!validatedFields.success) {
    await logActionFailure({
      action: "createProgramAction",
      message: GENERAL_FORM_ERROR_MESSAGE,
    });

    return {
      error: {
        message: GENERAL_FORM_ERROR_MESSAGE,
        formErrors: getFormErrors(validatedFields.error),
        statusCode: 400,
      },
    };
  }

  const session = await getCachedSession();

  if (!session) {
    await logActionFailure({
      action: "createProgramAction",
      message: AUTHENTICATION_ERROR_MESSAGE,
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
      action: "createProgramAction",
      message: INACTIVE_ERROR_MESSAGE,
      context: {
        actorId,
      },
    });

    return {
      error: {
        message: INACTIVE_ERROR_MESSAGE,
        statusCode: 403,
      },
    };
  }

  if (!isAdmin({ session })) {
    await logActionFailure({
      action: "createProgramAction",
      message: AUTHORIZATION_ERROR_MESSAGE,
      context: {
        actorId,
      },
    });

    return {
      error: {
        message: AUTHORIZATION_ERROR_MESSAGE,
        statusCode: 403,
      },
    };
  }

  const {
    name,
    description,
    price,
    isActive,
    applicationOpensAt,
    startsAt,
    endsAt,
    applicationClosesAt,
    programBenefits,
    requirements,
    mentorIds,
    coverImage,
  } = validatedFields.data;

  const cohort = deriveProgramCohort(startsAt);
  const normalizedName = toTitleCase(name.trim());
  const normalizedDescription = description?.trim() || null;
  const normalizedProgramBenefits = normalizeStringList(programBenefits);
  const normalizedRequirements = normalizeStringList(requirements);
  const normalizedMentorIds = Array.from(
    new Set(mentorIds.map((mentorId) => mentorId.trim()).filter(Boolean)),
  );
  const levelCount = 4;
  let normalizedCoverImage = "";

  try {
    normalizedCoverImage = await resolveImageInput(coverImage, {
      kind: "program-cover",
      folder: "programs/covers",
      publicIdPrefix: normalizedName,
    });

    const existingProgram = await db.program.findFirst({
      where: {
        cohort,
        name: {
          equals: normalizedName,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
      },
    });

    if (existingProgram) {
      await logActionFailure({
        action: "createProgramAction",
        message: "A program with this name and cohort already exists.",
        context: {
          name: normalizedName,
          cohort,
        },
      });

      return {
        error: {
          message: "A program with this name and cohort already exists.",
          statusCode: 409,
        },
      };
    }

    const mentors = await db.user.findMany({
      where: {
        id: { in: normalizedMentorIds },
        role: UserRole.MENTOR,
        status: UserStatus.ACTIVE,
      },
      select: {
        id: true,
      },
    });

    if (mentors.length !== normalizedMentorIds.length) {
      await logActionFailure({
        action: "createProgramAction",
        message: "Select at least one active mentor.",
        context: {
          actorId,
          name: normalizedName,
          cohort,
        },
      });

      return {
        error: {
          message: "Select at least one active mentor.",
          statusCode: 400,
        },
      };
    }

    const createdProgram = await db.program.create({
      data: {
        name: normalizedName,
        description: normalizedDescription,
        levelCount,
        isActive,
        price,
        cohort,
        coverImage: normalizedCoverImage,
        applicationOpensAt: applicationOpensAt ?? null,
        startsAt,
        endsAt: endsAt ?? null,
        applicationClosesAt: applicationClosesAt ?? null,
        programBenefits: normalizedProgramBenefits,
        requirements: normalizedRequirements,
        createdById: actorId,
        updatedById: actorId,
        mentors: {
          connect: normalizedMentorIds.map((id) => ({ id })),
        },
      },
    });

    updateTag("getNavbarProgramInfo");
    updateTag("programs");
    updateTag(`program-${createdProgram.id}`);

    await logActionSuccess({
      action: "createProgramAction",
      message: "Program created successfully.",
      context: {
        actorId,
        programId: createdProgram.id,
        programName: createdProgram.name,
        cohort: createdProgram.cohort,
      },
    });

    return {
      success: {
        message: "Program created successfully.",
      },
    };
  } catch (error) {
    if (networkError((error as { message?: string } | undefined)?.message)) {
      await logActionFailure({
        action: "createProgramAction",
        message: NETWORK_ERROR_MESSAGE,
        context: {
          name: normalizedName,
        },
      });

      return {
        error: {
          message: NETWORK_ERROR_MESSAGE,
          statusCode: 500,
        },
      };
    }

    const message = guardError(error);

    await logActionFailure({
      action: "createProgramAction",
      message,
      context: {
        name: normalizedName,
      },
    });

    return {
      error: {
        message,
        statusCode: 500,
      },
    };
  }
}
