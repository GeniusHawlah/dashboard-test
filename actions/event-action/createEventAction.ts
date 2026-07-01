"use server";

import checkIsActiveAction from "@/actions/auth-actions/checkIsActiveAction";
import calculateProgramMenteePercentages from "@/actions/event-action/calculateProgramMenteePercentages";
import generateEventId from "@/actions/event-action/generateEventId";
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
import { guardError, networkError } from "@/utils/error-helpers";
import {
  logActionFailure,
  logActionStart,
  logActionSuccess,
} from "@/utils/serverActionLogger";
import {
  CreateEventErrorSchema,
  CreateEventSchema,
  type CreateEventRequest,
} from "@/utils/zod/createEventSchema";
import { ProgramEnrollmentStatus, UserStatus } from "@prisma/client";
import { updateTag } from "next/cache";
import { z } from "zod";
import { sendEmail } from "@/utils/sendEmail";
import { formatTitledName } from "@/utils/utils";
import {
  buildEventCreatedMentorNoticeEmail,
  buildEventCreatedMenteeNoticeEmail,
} from "@/utils/emailTemplates";
import { RelativeRoutes } from "@/utils/enum";

type CreateEventFormErrors = z.infer<
  typeof CreateEventErrorSchema
>["error"]["formErrors"];

export interface CreateEventFormStateInterface {
  error?: {
    message: string;
    formErrors?: CreateEventFormErrors;
    statusCode?: number;
  };
  success?: {
    message: string;
    data?: {
      eventId: string;
      eventGeneratedId: string;
      programId: string;
      eventScoresCreated: number;
      updatedMenteeCount: number;
    };
  };
}

function getFormErrors(error: z.ZodError): CreateEventFormErrors | undefined {
  const tree = z.treeifyError(error) as {
    properties?: CreateEventFormErrors;
  };

  return tree.properties;
}

function getAppBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL?.trim() || "http://localhost:3000";
}

export default async function createEventAction(
  eventData: CreateEventRequest,
): Promise<CreateEventFormStateInterface> {
  logActionStart({
    action: "createEventAction",
    context: {
      programId: eventData.programId,
      title: eventData.title,
    },
  });

  const validatedFields = CreateEventSchema.safeParse(eventData);

  if (!validatedFields.success) {
    await logActionFailure({
      action: "createEventAction",
      message: GENERAL_FORM_ERROR_MESSAGE,
      context: {
        programId: eventData.programId,
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
      action: "createEventAction",
      message: AUTHENTICATION_ERROR_MESSAGE,
      context: {
        programId: validatedFields.data.programId,
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
      action: "createEventAction",
      message: INACTIVE_ERROR_MESSAGE,
      context: {
        actorId,
        programId: validatedFields.data.programId,
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
      action: "createEventAction",
      message: AUTHORIZATION_ERROR_MESSAGE,
      context: {
        actorId,
        programId: validatedFields.data.programId,
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
    programId,
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
    const program = await db.program.findUnique({
      where: {
        id: programId,
      },
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
        events: {
          select: {
            id: true,
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
    });

    if (!program) {
      await logActionFailure({
        action: "createEventAction",
        message: "Program record not found.",
        context: {
          actorId,
          programId,
        },
      });

      return {
        error: {
          message: "Program record not found.",
          statusCode: 404,
        },
      };
    }

    if (!isAdmin({ session }) && !program.mentors.some((mentor) => mentor.id === actorId)) {
      await logActionFailure({
        action: "createEventAction",
        message: AUTHORIZATION_ERROR_MESSAGE,
        context: {
          actorId,
          programId,
        },
      });

      return {
        error: {
          message: AUTHORIZATION_ERROR_MESSAGE,
          statusCode: 403,
        },
      };
    }

    const created = await db.$transaction(async (tx) => {
      const now = new Date();
      const generatedId = await generateEventId(tx, now);

      if (generatedId.error) {
        throw new Error(generatedId.error.message);
      }

      if (!generatedId.success) {
        throw new Error("There is a problem generating an event ID.");
      }

      const activeEnrollmentUserIds = program.enrollments.map(
        (enrollment) => enrollment.userId,
      );

      const event = await tx.event.create({
        data: {
          generatedId: generatedId.success.eventGeneratedId,
          programId,
          createdById: actorId,
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

      const eventScoresCreated = activeEnrollmentUserIds.length
        ? await tx.eventScore.createMany({
            data: activeEnrollmentUserIds.map((userId) => ({
              eventId: event.id,
              userId,
              score: 0,
            })),
            skipDuplicates: true,
          })
        : { count: 0 };

      const recalculation = await calculateProgramMenteePercentages(programId, tx);

      return {
        eventId: event.id,
        eventGeneratedId: event.generatedId,
        eventScoresCreated: eventScoresCreated.count,
        updatedMenteeCount: recalculation.updatedCount,
      };
    });

    const appBaseUrl = getAppBaseUrl();
    const menteeDashboardUrl = `${appBaseUrl}${RelativeRoutes.MENTEE_HOMEPAGE}`;
    const mentorScoresUrl = `${appBaseUrl}${RelativeRoutes.MENTOR_SCORES}`;

    const menteeRecipients = program.enrollments
      .map((enrollment) => enrollment.user)
      .filter(
        (user) =>
          user.status === UserStatus.ACTIVE && typeof user.email === "string",
      );
    const mentorRecipients = program.mentors.filter(
      (mentor) => mentor.status === UserStatus.ACTIVE && Boolean(mentor.email),
    );

    const emailTasks = [
      ...menteeRecipients.map((mentee) =>
        sendEmail({
          to: mentee.email,
          subject: `New event added: ${program.name}`,
          text: buildEventCreatedMenteeNoticeEmail({
            name: mentee.name,
            programName: program.name,
            eventTitle: normalizedTitle,
            eventGeneratedId: created.eventGeneratedId,
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
          subject: `New event added: ${program.name}`,
          text: buildEventCreatedMentorNoticeEmail({
            name: formatTitledName(mentor),
            programName: program.name,
            eventTitle: normalizedTitle,
            eventGeneratedId: created.eventGeneratedId,
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
      console.warn("[createEventAction] Some event emails failed to send", {
        actorId,
        programId,
        failedEmails: failedEmails.length,
      });
    }

    updateTag("programs");
    updateTag("events");
    updateTag(`program-${programId}`);
    program.mentors.forEach((mentor) => {
      updateTag(`getMentorEvents-${mentor.id}`);
      updateTag(`getMentorScores-${mentor.id}`);
    });
    program.enrollments.forEach((enrollment) => {
      updateTag(`getMenteeOverview-${enrollment.userId}`);
    });

    await logActionSuccess({
      action: "createEventAction",
      message: "Event created successfully.",
      context: {
        actorId,
        programId,
        eventId: created.eventId,
        eventGeneratedId: created.eventGeneratedId,
        eventScoresCreated: created.eventScoresCreated,
        updatedMenteeCount: created.updatedMenteeCount,
        failedEmails: failedEmails.length,
      },
    });

    return {
      success: {
        message: "Event created successfully.",
        data: {
          eventId: created.eventId,
          eventGeneratedId: created.eventGeneratedId,
          programId,
          eventScoresCreated: created.eventScoresCreated,
          updatedMenteeCount: created.updatedMenteeCount,
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
      action: "createEventAction",
      message,
      context: {
        actorId,
        programId,
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

