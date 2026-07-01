"use server";

import calculateProgramMenteePercentages from "@/actions/event-action/calculateProgramMenteePercentages";
import { db } from "@/lib/db";
import { getCachedSession } from "@/utils/getCachedSession";
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
import checkIsActiveAction from "@/actions/auth-actions/checkIsActiveAction";
import { isMentor } from "@/utils/auth-helpers";
import { updateTag } from "next/cache";
import { z } from "zod";

const UpdateEventScoreItemSchema = z.object({
  scoreId: z.string().min(1),
  score: z.coerce.number().int().min(0).max(100),
});

const UpdateEventScoresSchema = z.object({
  programId: z.string().min(1),
  eventId: z.string().min(1),
  scores: z.array(UpdateEventScoreItemSchema).min(1),
});

export type UpdateEventScoreItem = z.infer<typeof UpdateEventScoreItemSchema>;

export type UpdateEventScoresData = z.infer<typeof UpdateEventScoresSchema>;

export default async function updateEventScoresAction(
  data: UpdateEventScoresData,
): Promise<{
  success?: { message: string; updatedCount: number; updatedMenteeCount: number };
  error?: { message: string; statusCode?: number };
}> {
  logActionStart({
    action: "updateEventScoresAction",
    context: {
      programId: data.programId,
      eventId: data.eventId,
      scoreCount: data.scores.length,
    },
  });

  const validated = UpdateEventScoresSchema.safeParse(data);

  if (!validated.success) {
    await logActionFailure({
      action: "updateEventScoresAction",
      message: GENERAL_FORM_ERROR_MESSAGE,
      context: {
        programId: data.programId,
        eventId: data.eventId,
      },
    });

    return {
      error: {
        message: GENERAL_FORM_ERROR_MESSAGE,
        statusCode: 400,
      },
    };
  }

  const session = await getCachedSession();

  if (!session) {
    await logActionFailure({
      action: "updateEventScoresAction",
      message: AUTHENTICATION_ERROR_MESSAGE,
      context: {
        programId: data.programId,
        eventId: data.eventId,
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
      action: "updateEventScoresAction",
      message: INACTIVE_ERROR_MESSAGE,
      context: {
        actorId,
        programId: data.programId,
        eventId: data.eventId,
      },
    });

    return {
      error: {
        message: INACTIVE_ERROR_MESSAGE,
        statusCode: 403,
      },
    };
  }

  if (!isMentor({ session })) {
    await logActionFailure({
      action: "updateEventScoresAction",
      message: AUTHORIZATION_ERROR_MESSAGE,
      context: {
        actorId,
        programId: data.programId,
        eventId: data.eventId,
      },
    });

    return {
      error: {
        message: AUTHORIZATION_ERROR_MESSAGE,
        statusCode: 403,
      },
    };
  }

  try {
    const event = await db.event.findUnique({
      where: { id: data.eventId },
      select: {
        id: true,
        programId: true,
        program: {
          select: {
            id: true,
            mentors: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!event || event.programId !== data.programId) {
      await logActionFailure({
        action: "updateEventScoresAction",
        message: "Event record not found.",
        context: {
          actorId,
          programId: data.programId,
          eventId: data.eventId,
        },
      });

      return {
        error: {
          message: "Event record not found.",
          statusCode: 404,
        },
      };
    }

    if (!event.program.mentors.some((mentor) => mentor.id === actorId)) {
      await logActionFailure({
        action: "updateEventScoresAction",
        message: "You are not assigned to this program.",
        context: {
          actorId,
          programId: data.programId,
          eventId: data.eventId,
        },
      });

      return {
        error: {
          message: "You are not assigned to this program.",
          statusCode: 403,
        },
      };
    }

    const existingScores = await db.eventScore.findMany({
      where: {
        id: { in: data.scores.map((score) => score.scoreId) },
        eventId: event.id,
      },
      select: {
        id: true,
        isLocked: true,
      },
    });

    if (existingScores.length !== data.scores.length) {
      await logActionFailure({
        action: "updateEventScoresAction",
        message: "Some scores do not belong to this event.",
        context: {
          actorId,
          programId: data.programId,
          eventId: data.eventId,
        },
      });

      return {
        error: {
          message: "Some scores do not belong to this event.",
          statusCode: 403,
        },
      };
    }

    if (existingScores.some((score) => score.isLocked)) {
      await logActionFailure({
        action: "updateEventScoresAction",
        message: "Cannot update locked scores.",
        context: {
          actorId,
          programId: data.programId,
          eventId: data.eventId,
        },
      });

      return {
        error: {
          message: "Cannot update locked scores.",
          statusCode: 403,
        },
      };
    }

    const updated = await db.$transaction(async (tx) => {
      const updatedScores = await Promise.all(
        data.scores.map((score) =>
          tx.eventScore.update({
            where: { id: score.scoreId },
            data: {
              score: score.score,
              updatedAt: new Date(),
            },
            select: {
              id: true,
            },
          }),
        ),
      );

      const recalculation = await calculateProgramMenteePercentages(
        event.program.id,
        tx,
      );

      return {
        updatedCount: updatedScores.length,
        updatedMenteeCount: recalculation.updatedCount,
      };
    });

    updateTag("events");
    updateTag("programs");
    updateTag(`program-${event.program.id}`);
    updateTag(`getMentorScores-${actorId}`);
    updateTag(`getMentorEvents-${actorId}`);

    await logActionSuccess({
      action: "updateEventScoresAction",
      message: "Event scores updated successfully.",
      context: {
        actorId,
        programId: data.programId,
        eventId: data.eventId,
        updatedCount: updated.updatedCount,
        updatedMenteeCount: updated.updatedMenteeCount,
      },
    });

    return {
      success: {
        message: "Event scores updated successfully.",
        updatedCount: updated.updatedCount,
        updatedMenteeCount: updated.updatedMenteeCount,
      },
    };
  } catch (error) {
    const message = networkError(
      (error as { message?: string } | undefined)?.message,
    )
      ? NETWORK_ERROR_MESSAGE
      : guardError(error);

    await logActionFailure({
      action: "updateEventScoresAction",
      message,
      context: {
        actorId,
        programId: data.programId,
        eventId: data.eventId,
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
