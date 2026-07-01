"use server";

import checkIsActiveAction from "@/actions/auth-actions/checkIsActiveAction";
import { db } from "@/lib/db";
import { getCachedSession } from "@/utils/getCachedSession";
import { isMentee } from "@/utils/auth-helpers";
import {
  AUTHENTICATION_ERROR_MESSAGE,
  AUTHORIZATION_ERROR_MESSAGE,
  NETWORK_ERROR_MESSAGE,
} from "@/utils/constants";
import { guardError, networkError } from "@/utils/error-helpers";
import {
  logActionFailure,
  logActionStart,
  logActionSuccess,
} from "@/utils/serverActionLogger";
import {
  buildProgramApplicationMenteeSuccessEmail,
  buildProgramApplicationMentorNoticeEmail,
} from "@/utils/emailTemplates";
import { sendEmail } from "@/utils/sendEmail";
import { formatTitledName } from "@/utils/utils";
import {
  AssignmentStatus,
  Prisma,
  ProgramEnrollmentStatus,
} from "@prisma/client";
import { updateTag } from "next/cache";

export interface ApplyProgramActionParams {
  programId: string;
}

export interface ApplyProgramActionResponse {
  success?: {
    message: string;
    data: {
      programId: string;
      enrollmentId: string;
      userId: string;
      eventScoresCreated: number;
      mentorAssignmentsCreated: number;
    };
  };
  error?: {
    message: string;
    statusCode?: number;
  };
}

function isRegistrationOpen({
  applicationOpensAt,
  applicationClosesAt,
}: {
  applicationOpensAt: Date | null;
  applicationClosesAt: Date | null;
}) {
  const now = new Date();

  if (applicationOpensAt && now < applicationOpensAt) return false;
  if (applicationClosesAt && now > applicationClosesAt) return false;

  return true;
}

function getAppBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL?.trim() || "http://localhost:3000";
}

export default async function applyProgramAction(
  params: ApplyProgramActionParams,
): Promise<ApplyProgramActionResponse> {
  logActionStart({
    action: "applyProgramAction",
    context: {
      programId: params.programId,
    },
  });

  const session = await getCachedSession();

  if (!session?.user?.id) {
    await logActionFailure({
      action: "applyProgramAction",
      message: AUTHENTICATION_ERROR_MESSAGE,
      context: {
        programId: params.programId,
      },
    });

    return {
      error: {
        message: AUTHENTICATION_ERROR_MESSAGE,
        statusCode: 401,
      },
    };
  }

  if (!isMentee({ session })) {
    await logActionFailure({
      action: "applyProgramAction",
      message: AUTHORIZATION_ERROR_MESSAGE,
      context: {
        actorId: session.user.id,
        programId: params.programId,
      },
    });

    return {
      error: {
        message: AUTHORIZATION_ERROR_MESSAGE,
        statusCode: 403,
      },
    };
  }

  const actorId = session.user.id;
  const actorIsActive = await checkIsActiveAction(actorId);

  if (!actorIsActive) {
    await logActionFailure({
      action: "applyProgramAction",
      message: "Your account is not active.",
      context: {
        actorId,
        programId: params.programId,
      },
    });

    return {
      error: {
        message: "Your account is not active.",
        statusCode: 403,
      },
    };
  }

  try {
    const program = await db.program.findUnique({
      where: { id: params.programId },
      select: {
        id: true,
        name: true,
        isActive: true,
        applicationOpensAt: true,
        applicationClosesAt: true,
        endsAt: true,
        mentors: {
          select: {
            id: true,
            email: true,
            name: true,
            title: true,
          },
        },
        events: {
          where: { isActive: true },
          select: { id: true },
        },
      },
    });

    if (!program) {
      await logActionFailure({
        action: "applyProgramAction",
        message: "Program not found.",
        context: {
          actorId,
          programId: params.programId,
        },
      });

      return {
        error: { message: "Program not found.", statusCode: 404 },
      };
    }

    if (!program.isActive || (program.endsAt && new Date() > program.endsAt)) {
      await logActionFailure({
        action: "applyProgramAction",
        message: "This program is not open for applications.",
        context: {
          actorId,
          programId: params.programId,
        },
      });

      return {
        error: {
          message: "This program is not open for applications.",
          statusCode: 409,
        },
      };
    }

    if (!isRegistrationOpen(program)) {
      await logActionFailure({
        action: "applyProgramAction",
        message: "Applications are currently closed for this program.",
        context: {
          actorId,
          programId: params.programId,
        },
      });

      return {
        error: {
          message: "Applications are currently closed for this program.",
          statusCode: 409,
        },
      };
    }

    const existingActiveEnrollment = await db.menteeProgramEnrollment.findFirst(
      {
        where: {
          userId: actorId,
          status: ProgramEnrollmentStatus.ACTIVE,
          totalScore: 0,
          averageScore: 0,
          percentage: 0,
        },
        select: {
          id: true,
          programId: true,
        },
      },
    );

    if (existingActiveEnrollment) {
      const isSameProgram =
        existingActiveEnrollment.programId === params.programId;

      await logActionFailure({
        action: "applyProgramAction",
        message: isSameProgram
          ? "You are already enrolled in this program."
          : "You can only enroll in one program at a time.",
        context: {
          actorId,
          programId: params.programId,
          activeEnrollmentProgramId: existingActiveEnrollment.programId,
        },
      });

      return {
        error: {
          message: isSameProgram
            ? "You are already enrolled in this program."
            : "You can only enroll in one program at a time.",
          statusCode: 409,
        },
      };
    }

    if (program.mentors.length === 0) {
      await logActionFailure({
        action: "applyProgramAction",
        message: "There are no mentors for this program yet.",
        context: {
          actorId,
          programId: params.programId,
        },
      });

      return {
        error: {
          message: "There are no mentors for this program yet.",
          statusCode: 409,
        },
      };
    }

    const created = await db.$transaction(async (tx) => {
      const enrollment = await tx.menteeProgramEnrollment.create({
        data: {
          userId: actorId,
          programId: params.programId,
          status: ProgramEnrollmentStatus.ACTIVE,
          totalScore: 0,
          averageScore: 0,
          percentage: 0,
        },
        select: {
          id: true,
        },
      });

      const eventScoresCreated = program.events.length
        ? await tx.eventScore.createMany({
            data: program.events.map((event) => ({
              eventId: event.id,
              userId: actorId,
              score: 0,
            })),
          })
        : { count: 0 };

      const mentorAssignmentsCreated = program.mentors.length
        ? await tx.mentorshipAssignment.createMany({
            data: program.mentors.map((mentor) => ({
              mentorId: mentor.id,
              menteeId: actorId,
              programId: params.programId,
              status: AssignmentStatus.ACTIVE,
            })),
          })
        : { count: 0 };

      await tx.user.update({
        where: { id: actorId },
        data: { programId: params.programId },
      });

      return {
        enrollmentId: enrollment.id,
        eventScoresCreated: eventScoresCreated.count,
        mentorAssignmentsCreated: mentorAssignmentsCreated.count,
      };
    });

    const mentee = await db.user.findUnique({
      where: { id: actorId },
      select: {
        name: true,
        email: true,
      },
    });

    const appBaseUrl = getAppBaseUrl();
    const menteeDashboardUrl = `${appBaseUrl}/mentee`;
    const mentorScoresUrl = `${appBaseUrl}/mentor/scores`;

    const menteeEmail = mentee?.email ?? session.user.email;
    const menteeName = mentee?.name ?? session.user.name ?? "there";
    const emailTasks = [
      sendEmail({
        to: "geniusdecode@gmail.com",
        subject: `New mentee application: ${program.name}`,
        text: buildProgramApplicationMentorNoticeEmail({
          mentorName: formatTitledName({
            title: "Prof.",
            name: "Olasunkanmi AJIBOLA",
          }),
          menteeName,
          menteeEmail,
          programName: program.name,
          mentorScoresUrl,
        }),
      }),
      sendEmail({
        to: menteeEmail,
        subject: `Application received: ${program.name}`,
        text: buildProgramApplicationMenteeSuccessEmail({
          name: menteeName,
          programName: program.name,
          dashboardUrl: menteeDashboardUrl,
        }),
      }),
      ...program.mentors.map((mentor) =>
        sendEmail({
          to: mentor.email,
          subject: `New mentee application: ${program.name}`,
          text: buildProgramApplicationMentorNoticeEmail({
            mentorName: formatTitledName(mentor),
            menteeName,
            menteeEmail,
            programName: program.name,
            mentorScoresUrl,
          }),
        }),
      ),
    ];

    const emailResults = await Promise.allSettled(emailTasks);
    const failedEmails = emailResults.filter(
      (result) => result.status === "rejected",
    );

    if (failedEmails.length > 0) {
      console.warn(
        "[applyProgramAction] Some application emails failed to send",
        {
          actorId,
          programId: params.programId,
          failedEmails: failedEmails.length,
        },
      );
    }

    updateTag("programs");
    updateTag(`programs-${actorId}`);
    updateTag(`program-${params.programId}`);
    updateTag(`getMenteeOverview-${actorId}`);
    updateTag(`getNavbarProgramInfo-${actorId}`);
    updateTag("getNavbarProgramInfo");

    await logActionSuccess({
      action: "applyProgramAction",
      message: "Program application submitted successfully.",
      context: {
        actorId,
        programId: params.programId,
        enrollmentId: created.enrollmentId,
        mentorAssignmentsCreated: created.mentorAssignmentsCreated,
        failedEmails: failedEmails.length,
      },
    });

    return {
      success: {
        message: "Program application submitted successfully.",
        data: {
          programId: params.programId,
          enrollmentId: created.enrollmentId,
          userId: actorId,
          eventScoresCreated: created.eventScoresCreated,
          mentorAssignmentsCreated: created.mentorAssignmentsCreated,
        },
      },
    };
  } catch (error) {
    const message = networkError(
      (error as { message?: string } | undefined)?.message,
    )
      ? NETWORK_ERROR_MESSAGE
      : guardError(error);

    await logActionFailure({
      action: "applyProgramAction",
      message,
      context: {
        actorId,
        programId: params.programId,
      },
    });

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          error: {
            message: "You are already enrolled in this program.",
            statusCode: 409,
          },
        };
      }
    }

    return {
      error: {
        message,
        statusCode: 500,
      },
    };
  }
}

