"use server";

import checkIsActiveAction from "@/actions/auth-actions/checkIsActiveAction";
import calculateProgramMenteePercentages from "@/actions/event-action/calculateProgramMenteePercentages";
import { db } from "@/lib/db";
import { getCachedSession } from "@/utils/getCachedSession";
import { isAdmin, isMentor } from "@/utils/auth-helpers";
import {
  AUTHENTICATION_ERROR_MESSAGE,
  AUTHORIZATION_ERROR_MESSAGE,
  GENERAL_FORM_ERROR_MESSAGE,
  INACTIVE_ERROR_MESSAGE,
  NETWORK_ERROR_MESSAGE,
} from "@/utils/constants";
import { buildEventUpdatedMenteeNoticeEmail, buildEventUpdatedMentorNoticeEmail } from "@/utils/emailTemplates";
import { guardError, networkError } from "@/utils/error-helpers";
import { sendEmail } from "@/utils/sendEmail";
import {
  logActionFailure,
  logActionStart,
  logActionSuccess,
} from "@/utils/serverActionLogger";
import { formatTitledName } from "@/utils/utils";
import {
  UpdateEventErrorSchema,
  UpdateEventSchema,
  type UpdateEventRequest,
} from "@/utils/zod/updateEventSchema";
import { ProgramEnrollmentStatus, UserStatus } from "@prisma/client";
import { updateTag } from "next/cache";
import { z } from "zod";
import { RelativeRoutes } from "@/utils/enum";

type UpdateEventFormErrors = z.infer<
  typeof UpdateEventErrorSchema
>["error"]["formErrors"];

export interface UpdateEventFormStateInterface {
  error?: {
    message: string;
    formErrors?: UpdateEventFormErrors;
    statusCode?: number;
  };
  success?: {
    message: string;
    data?: {
      eventId: string;
      eventGeneratedId: string;
      programId: string;
      updatedMenteeCount: number;
    };
  };
}

function getFormErrors(error: z.ZodError): UpdateEventFormErrors | undefined {
  const tree = z.treeifyError(error) as {
    properties?: UpdateEventFormErrors;
  };

  return tree.properties;
}

function getAppBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL?.trim() || "http://localhost:3000";
}

export default async function updateEventAction(
  eventData: UpdateEventRequest,
): Promise<UpdateEventFormStateInterface> {
  logActionStart({
    action: "updateEventAction",
    context: {
      eventId: eventData.eventId,
      title: eventData.title,
    },
  });

  const validatedFields = UpdateEventSchema.safeParse(eventData);

  if (!validatedFields.success) {
    await logActionFailure({
      action: "updateEventAction",
      message: GENERAL_FORM_ERROR_MESSAGE,
      context: {
        eventId: eventData.eventId,
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

  const session = await getCachedSession();

  if (!session) {
    await logActionFailure({
      action: "updateEventAction",
      message: AUTHENTICATION_ERROR_MESSAGE,
      context: {
        eventId: validatedFields.data.eventId,
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
      action: "updateEventAction",
      message: INACTIVE_ERROR_MESSAGE,
      context: {
        actorId,
        eventId: validatedFields.data.eventId,
      },
    });

    return {
      error: {
        message: INACTIVE_ERROR_MESSAGE,
        statusCode: 403,
      },
    };
  }

  if (!isAdmin({ session }) && !isMentor({ session })) {
    await logActionFailure({
      action: "updateEventAction",
      message: AUTHORIZATION_ERROR_MESSAGE,
      context: {
        actorId,
        eventId: validatedFields.data.eventId,
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
    eventId,
    title,
    description,
    note,
    venue,
    eventDate,
    eventTime,
  } = validatedFields.data;

  const normalizedTitle = title.trim();
  const normalizedDescription = description?.trim() || null;
  const normalizedNote = note?.trim() || null;
  const normalizedVenue = venue.trim();
  const normalizedEventTime = eventTime.trim();

  try {
    const event = await db.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        id: true,
        generatedId: true,
        title: true,
        description: true,
        note: true,
        venue: true,
        eventDate: true,
        eventTime: true,
        program: {
          select: {
            id: true,
            name: true,
            mentors: {
              select: {
                id: true,
                email: true,
                name: true,
                title: true,
                status: true,
              },
            },
            enrollments: {
              where: {
                status: ProgramEnrollmentStatus.ACTIVE,
              },
              select: {
                id: true,
                userId: true,
                user: {
                  select: {
                    id: true,
                    email: true,
                    name: true,
                    status: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!event) {
      await logActionFailure({
        action: "updateEventAction",
        message: "Event record not found.",
        context: {
          actorId,
          eventId,
        },
      });

      return {
        error: {
          message: "Event record not found.",
          statusCode: 404,
        },
      };
    }

    if (!isAdmin({ session }) && !event.program.mentors.some((mentor) => mentor.id === actorId)) {
      await logActionFailure({
        action: "updateEventAction",
        message: AUTHORIZATION_ERROR_MESSAGE,
        context: {
          actorId,
          eventId,
          programId: event.program.id,
        },
      });

      return {
        error: {
          message: AUTHORIZATION_ERROR_MESSAGE,
          statusCode: 403,
        },
      };
    }

    const updated = await db.$transaction(async (tx) => {
      const result = await tx.event.update({
        where: {
          id: event.id,
        },
        data: {
          updatedById: actorId,
          title: normalizedTitle,
          description: normalizedDescription,
          note: normalizedNote,
          venue: normalizedVenue,
          eventDate,
          eventTime: normalizedEventTime,
        },
        select: {
          id: true,
          generatedId: true,
        },
      });

      const recalculation = await calculateProgramMenteePercentages(
        event.program.id,
        tx,
      );

      return {
        eventId: result.id,
        eventGeneratedId: result.generatedId,
        programId: event.program.id,
        updatedMenteeCount: recalculation.updatedCount,
      };
    });

    const appBaseUrl = getAppBaseUrl();
    const menteeDashboardUrl = `${appBaseUrl}${RelativeRoutes.MENTEE_HOMEPAGE}`;
    const mentorScoresUrl = `${appBaseUrl}${RelativeRoutes.MENTOR_SCORES}`;

    const menteeRecipients = event.program.enrollments
      .map((enrollment) => enrollment.user)
      .filter(
        (user) =>
          user.status === UserStatus.ACTIVE && typeof user.email === "string",
      );
    const mentorRecipients = event.program.mentors.filter(
      (mentor) => mentor.status === UserStatus.ACTIVE && Boolean(mentor.email),
    );

    const emailTasks = [
      ...menteeRecipients.map((mentee) =>
        sendEmail({
          to: mentee.email,
          subject: `Event updated: ${event.program.name}`,
          text: buildEventUpdatedMenteeNoticeEmail({
            name: mentee.name,
            programName: event.program.name,
            eventTitle: normalizedTitle,
            eventGeneratedId: updated.eventGeneratedId,
            eventDescription: normalizedDescription ?? undefined,
            eventNote: normalizedNote ?? undefined,
            venue: normalizedVenue,
            eventDate,
            eventTime: normalizedEventTime,
            dashboardUrl: menteeDashboardUrl,
          }),
        }),
      ),
      ...mentorRecipients.map((mentor) =>
        sendEmail({
          to: mentor.email,
          subject: `Event updated: ${event.program.name}`,
          text: buildEventUpdatedMentorNoticeEmail({
            name: formatTitledName(mentor),
            programName: event.program.name,
            eventTitle: normalizedTitle,
            eventGeneratedId: updated.eventGeneratedId,
            eventDescription: normalizedDescription ?? undefined,
            eventNote: normalizedNote ?? undefined,
            venue: normalizedVenue,
            eventDate,
            eventTime: normalizedEventTime,
            dashboardUrl: mentorScoresUrl,
          }),
        }),
      ),
    ];

    const emailResults = await Promise.allSettled(emailTasks);
    const failedEmails = emailResults.filter(
      (result) => result.status === "rejected",
    );

    if (failedEmails.length > 0) {
      console.warn("[updateEventAction] Some event emails failed to send", {
        actorId,
        eventId,
        failedEmails: failedEmails.length,
      });
    }

    updateTag("events");
    updateTag("programs");
    updateTag(`program-${event.program.id}`);
    event.program.mentors.forEach((mentor) => {
      updateTag(`getMentorEvents-${mentor.id}`);
      updateTag(`getMentorScores-${mentor.id}`);
    });
    event.program.enrollments.forEach((enrollment) => {
      updateTag(`getMenteeOverview-${enrollment.userId}`);
    });

    await logActionSuccess({
      action: "updateEventAction",
      message: "Event updated successfully.",
      context: {
        actorId,
        eventId: event.id,
        eventGeneratedId: updated.eventGeneratedId,
        programId: event.program.id,
        updatedMenteeCount: updated.updatedMenteeCount,
        failedEmails: failedEmails.length,
      },
    });

    return {
      success: {
        message: "Event updated successfully.",
        data: {
          eventId: updated.eventId,
          eventGeneratedId: updated.eventGeneratedId,
          programId: updated.programId,
          updatedMenteeCount: updated.updatedMenteeCount,
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
      action: "updateEventAction",
      message,
      context: {
        actorId,
        eventId,
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

