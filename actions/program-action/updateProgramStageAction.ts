"use server";

import checkIsActiveAction from "@/actions/auth-actions/checkIsActiveAction";
import { db } from "@/lib/db";
import { getCachedSession } from "@/utils/getCachedSession";
import { isAdmin } from "@/utils/auth-helpers";
import {
  AUTHENTICATION_ERROR_MESSAGE,
  AUTHORIZATION_ERROR_MESSAGE,
  GENERAL_FORM_ERROR_MESSAGE,
  INACTIVE_ERROR_MESSAGE,
  NETWORK_ERROR_MESSAGE,
} from "@/utils/constants";
import { guardError, networkError } from "@/utils/error-helpers";
import {
  logActionFailure,
  logActionStart,
  logActionSuccess,
} from "@/utils/serverActionLogger";
import { AssignmentStatus, ProgramEnrollmentStatus } from "@prisma/client";
import { updateTag } from "next/cache";
import { z } from "zod";

const UpdateProgramStageActionSchema = z.object({
  programId: z.string().min(1, "Program is required"),
});

export interface UpdateProgramStageActionData {
  programId: string;
}

export default async function updateProgramStageAction(
  data: UpdateProgramStageActionData,
): Promise<{
  success?: { message: string };
  error?: { message: string; statusCode?: number };
}> {
  logActionStart({
    action: "updateProgramStageAction",
    context: {
      programId: data.programId,
    },
  });

  const session = await getCachedSession();

  if (!session) {
    await logActionFailure({
      action: "updateProgramStageAction",
      message: AUTHENTICATION_ERROR_MESSAGE,
      context: {
        programId: data.programId,
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
  const isActive = await checkIsActiveAction(actorId);

  if (!isActive) {
    await logActionFailure({
      action: "updateProgramStageAction",
      message: INACTIVE_ERROR_MESSAGE,
      context: {
        actorId,
        programId: data.programId,
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
      action: "updateProgramStageAction",
      message: AUTHORIZATION_ERROR_MESSAGE,
      context: {
        actorId,
        programId: data.programId,
      },
    });

    return {
      error: {
        message: AUTHORIZATION_ERROR_MESSAGE,
        statusCode: 403,
      },
    };
  }

  const validated = UpdateProgramStageActionSchema.safeParse(data);

  if (!validated.success) {
    await logActionFailure({
      action: "updateProgramStageAction",
      message: GENERAL_FORM_ERROR_MESSAGE,
      context: {
        actorId,
        programId: data.programId,
      },
    });

    return {
      error: {
        message: GENERAL_FORM_ERROR_MESSAGE,
        statusCode: 400,
      },
    };
  }

  try {
    const program = await db.program.findUnique({
      where: { id: validated.data.programId },
      select: {
        id: true,
        currentLevel: true,
        levelCount: true,
        applicationClosesAt: true,
        endsAt: true,
      },
    });

    if (!program) {
      await logActionFailure({
        action: "updateProgramStageAction",
        message: "Program record not found.",
        context: {
          actorId,
          programId: validated.data.programId,
        },
      });

      return {
        error: {
          message: "Program record not found.",
          statusCode: 404,
        },
      };
    }

    const isFinalLevel = program.currentLevel >= program.levelCount;
    const now = new Date();

    if (!isFinalLevel) {
      const nextLevel = Math.min(program.levelCount, program.currentLevel + 1);
      const activeEnrollments = await db.menteeProgramEnrollment.findMany({
        where: {
          programId: program.id,
          status: ProgramEnrollmentStatus.ACTIVE,
        },
        select: {
          id: true,
          userId: true,
          totalScore: true,
          averageScore: true,
          percentage: true,
        },
      });

      await db.$transaction(async (tx) => {
        await tx.program.update({
          where: { id: program.id },
          data: {
            currentLevel: nextLevel,
            updatedById: actorId,
          },
          select: { id: true },
        });

        if (activeEnrollments.length > 0) {
          await tx.enrollmentHistory.createMany({
            data: activeEnrollments.map((enrollment) => ({
              enrollmentId: enrollment.id,
              programId: program.id,
              fromLevel: program.currentLevel,
              toLevel: nextLevel,
              totalScore: enrollment.totalScore,
              averageScore: enrollment.averageScore,
              percentage: enrollment.percentage,
              performedById: actorId,
              movedAt: now,
            })),
          });
        }
      });

      const message = `Program stage advanced to Level ${nextLevel}.`;

      updateTag("getAdminOverview");
      updateTag(`getAdminOverview-${actorId}`);
      updateTag("getProgramsForAdmin");
      updateTag(`getProgramsForAdmin-${actorId}`);
      updateTag("programs");
      updateTag(`program-${program.id}`);

      for (const enrollment of activeEnrollments) {
        updateTag(`getMenteeOverview-${enrollment.userId}`);
        updateTag(`getNavbarProgramInfo-${enrollment.userId}`);
      }

      await logActionSuccess({
        action: "updateProgramStageAction",
        message,
        context: {
          actorId,
          programId: program.id,
          fromLevel: program.currentLevel,
          toLevel: nextLevel,
          stampedEnrollments: activeEnrollments.length,
        },
      });

      return { success: { message } };
    }

    // Final stage changes need to close out the live program and all related records together.
    const affectedEnrollments = await db.menteeProgramEnrollment.findMany({
      where: {
        programId: program.id,
        status: ProgramEnrollmentStatus.ACTIVE,
      },
      select: {
        id: true,
        userId: true,
      },
    });

    await db.$transaction(async (tx) => {
      // If registration is still open, close it now so no new enrollments can slip in.
      const shouldCloseRegistration =
        !program.applicationClosesAt || program.applicationClosesAt > now;

      await tx.program.update({
        where: { id: program.id },
        data: {
          currentLevel: program.levelCount,
          isActive: false,
          ...(shouldCloseRegistration ? { applicationClosesAt: now } : {}),
          endsAt: now,
          updatedById: actorId,
        },
        select: { id: true },
      });

      if (affectedEnrollments.length > 0) {
        // Active enrollments become completed before the current program link is cleared.
        await tx.menteeProgramEnrollment.updateMany({
          where: {
            id: { in: affectedEnrollments.map((item) => item.id) },
          },
          data: {
            status: ProgramEnrollmentStatus.COMPLETED,
            completedAt: now,
          },
        });

        // Once the enrollment is complete, the dashboard should stop treating this as the active program.
        await tx.user.updateMany({
          where: {
            id: { in: affectedEnrollments.map((item) => item.userId) },
          },
          data: {
            programId: null,
          },
        });
      }

      // End any live mentor assignments tied to the program at the same timestamp.
      await tx.mentorshipAssignment.updateMany({
        where: {
          programId: program.id,
          status: AssignmentStatus.ACTIVE,
        },
        data: {
          status: AssignmentStatus.COMPLETED,
          endedAt: now,
        },
      });
    });

    updateTag("getAdminOverview");
    updateTag(`getAdminOverview-${actorId}`);
    updateTag("getProgramsForAdmin");
    updateTag(`getProgramsForAdmin-${actorId}`);
    updateTag("programs");
    updateTag(`program-${program.id}`);
    updateTag("getNavbarProgramInfo");

    for (const enrollment of affectedEnrollments) {
      updateTag(`getMenteeOverview-${enrollment.userId}`);
      updateTag(`getNavbarProgramInfo-${enrollment.userId}`);
    }

    const message =
      program.endsAt && program.endsAt > now
        ? "Program ended early. This change cannot be reversed until the scheduled end date has passed."
        : "Program ended successfully.";

    await logActionSuccess({
      action: "updateProgramStageAction",
      message,
      context: {
        actorId,
        programId: program.id,
        currentLevel: program.currentLevel,
        levelCount: program.levelCount,
        endedEarly: Boolean(program.endsAt && program.endsAt > now),
      },
    });

    return { success: { message } };
  } catch (error) {
    const message = networkError(
      (error as { message?: string } | undefined)?.message,
    )
      ? NETWORK_ERROR_MESSAGE
      : guardError(error);

    await logActionFailure({
      action: "updateProgramStageAction",
      message,
      context: {
        actorId,
        programId: data.programId,
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
