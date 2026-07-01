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
import {
  getFirstZodErrorMessage,
  guardError,
  networkError,
} from "@/utils/error-helpers";
import { buildMenteeStatusUpdateEmail } from "@/utils/emailTemplates";
import { RelativeRoutes } from "@/utils/enum";
import { sendEmail } from "@/utils/sendEmail";
import {
  formatUserStatus,
  MENTEE_STATUS_UPDATE_STATUSES,
} from "@/utils/user-status";
import { UpdateMenteeStatusActionSchema } from "@/utils/zod/updateMenteeStatusSchema";
import {
  logActionFailure,
  logActionStart,
  logActionSuccess,
} from "@/utils/serverActionLogger";
import {
  AssignmentStatus,
  ProgramEnrollmentStatus,
  UserRole,
  UserStatus,
} from "@/utils/prisma";
import { updateTag } from "next/cache";

export interface UpdateMenteeStatusActionData {
  menteeId: string;
  status: UserStatus;
}

export default async function updateMenteeStatusAction(
  data: UpdateMenteeStatusActionData,
): Promise<{
  success?: { message: string };
  error?: { message: string; statusCode?: number };
}> {
  logActionStart({
    action: "updateMenteeStatusAction",
    context: {
      menteeId: data.menteeId,
      status: data.status,
    },
  });

  const session = await getCachedSession();

  if (!session) {
    await logActionFailure({
      action: "updateMenteeStatusAction",
      message: AUTHENTICATION_ERROR_MESSAGE,
      context: {
        menteeId: data.menteeId,
        status: data.status,
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
      action: "updateMenteeStatusAction",
      message: INACTIVE_ERROR_MESSAGE,
      context: {
        actorId,
        menteeId: data.menteeId,
        status: data.status,
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
      action: "updateMenteeStatusAction",
      message: AUTHORIZATION_ERROR_MESSAGE,
      context: {
        actorId,
        menteeId: data.menteeId,
        status: data.status,
      },
    });

    return {
      error: {
        message: AUTHORIZATION_ERROR_MESSAGE,
        statusCode: 403,
      },
    };
  }

  const validated = UpdateMenteeStatusActionSchema.safeParse(data);

  if (!validated.success) {
    const message = getFirstZodErrorMessage(
      validated.error,
      GENERAL_FORM_ERROR_MESSAGE,
    );

    await logActionFailure({
      action: "updateMenteeStatusAction",
      message,
      context: {
        actorId,
        menteeId: data.menteeId,
        status: data.status,
      },
    });

    return { error: { message, statusCode: 400 } };
  }

  const { menteeId, status } = validated.data;

  if (!MENTEE_STATUS_UPDATE_STATUSES.includes(status)) {
    const message = `${formatUserStatus(status)} is not available for mentees.`;

    await logActionFailure({
      action: "updateMenteeStatusAction",
      message,
      context: {
        actorId,
        menteeId,
        status,
      },
    });

    return {
      error: {
        message,
        statusCode: 400,
      },
    };
  }

  try {
    const mentee = await db.user.findUnique({
      where: { id: menteeId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });

    if (!mentee) {
      await logActionFailure({
        action: "updateMenteeStatusAction",
        message: "Mentee record not found.",
        context: {
          actorId,
          menteeId,
          status,
        },
      });

      return {
        error: {
          message: "Mentee record not found.",
          statusCode: 404,
        },
      };
    }

    if (!mentee.role.includes(UserRole.MENTEE)) {
      await logActionFailure({
        action: "updateMenteeStatusAction",
        message: "Selected user is not a mentee.",
        context: {
          actorId,
          menteeId,
          status,
        },
      });

      return {
        error: {
          message: "Selected user is not a mentee.",
          statusCode: 400,
        },
      };
    }

    if (mentee.status === status) {
      const message = `${mentee.name} is already marked as ${formatUserStatus(status)}.`;

      await logActionSuccess({
        action: "updateMenteeStatusAction",
        message,
        context: {
          actorId,
          menteeId,
          status,
        },
      });

      return { success: { message } };
    }

    const now = new Date();
    const nextEnrollmentStatus =
      status === UserStatus.INACTIVE
        ? ProgramEnrollmentStatus.DROPPED
        : status === UserStatus.UNAPPROVED
          ? ProgramEnrollmentStatus.PAUSED
          : null;

    const activeEnrollment = await db.menteeProgramEnrollment.findFirst({
      where: {
        userId: menteeId,
        status: ProgramEnrollmentStatus.ACTIVE,
      },
      select: {
        id: true,
        programId: true,
      },
    });

    await db.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: menteeId },
        data:
          nextEnrollmentStatus === null
            ? { status }
            : { status, programId: null },
        select: { id: true },
      });

      if (activeEnrollment && nextEnrollmentStatus) {
        await tx.menteeProgramEnrollment.update({
          where: { id: activeEnrollment.id },
          data: {
            status: nextEnrollmentStatus,
            ...(nextEnrollmentStatus === ProgramEnrollmentStatus.DROPPED
              ? { droppedAt: now }
              : {}),
          },
          select: { id: true },
        });

        await tx.mentorshipAssignment.updateMany({
          where: {
            menteeId,
            programId: activeEnrollment.programId,
            status: AssignmentStatus.ACTIVE,
          },
          data: {
            status: AssignmentStatus.INACTIVE,
            endedAt: now,
          },
        });
      }
    });

    const appBaseUrl =
      process.env.NEXT_PUBLIC_BASE_URL?.trim() || "http://localhost:3000";
    const dashboardUrl =
      status === UserStatus.ACTIVE
        ? `${appBaseUrl}${RelativeRoutes.MENTEE_HOMEPAGE}`
        : undefined;

    try {
      await sendEmail({
        to: mentee.email,
        subject: `Your account status is now ${formatUserStatus(status)}`,
        text: buildMenteeStatusUpdateEmail({
          name: mentee.name,
          status: formatUserStatus(status),
          dashboardUrl,
        }),
      });
    } catch (emailError) {
      console.warn("[updateMenteeStatusAction] Status email failed", {
        menteeId,
        email: mentee.email,
        status,
        message:
          emailError instanceof Error
            ? emailError.message
            : "Unknown email error",
      });
    }

    updateTag(`getMenteesForAdmin-${actorId}`);
    updateTag(`getAdminOverview-${actorId}`);
    updateTag(`getMenteeOverview-${menteeId}`);
    updateTag(`getNavbarProgramInfo-${menteeId}`);
    updateTag("getNavbarProgramInfo");

    const message = `Mentee status updated to ${formatUserStatus(status)}.`;

    await logActionSuccess({
      action: "updateMenteeStatusAction",
      message,
      context: {
        actorId,
        menteeId,
        status,
      },
    });

    return { success: { message } };
  } catch (error) {
    const message = networkError((error as { message?: string } | undefined)?.message)
      ? NETWORK_ERROR_MESSAGE
      : guardError(error);

    await logActionFailure({
      action: "updateMenteeStatusAction",
      message,
      context: {
        actorId,
        menteeId,
        status,
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
