"use server";

import { db } from "@/lib/db";
import { ProgramEnrollmentStatus, type Prisma, type PrismaClient } from "@/utils/prisma";

type EventDbClient = Prisma.TransactionClient | PrismaClient;

function roundScore(value: number) {
  return Number(value.toFixed(2));
}

export type ProgramMenteePercentageItem = {
  enrollmentId: string;
  userId: string;
  name: string;
  totalScore: number;
  averageScore: number;
  percentage: number;
  position: number | null;
  possibleScore: number;
};

export type CalculateProgramMenteePercentagesResult = {
  programId: string;
  eventCount: number;
  possibleScore: number;
  updatedCount: number;
  items: ProgramMenteePercentageItem[];
};

export default async function calculateProgramMenteePercentages(
  programId: string,
  client: EventDbClient = db,
): Promise<CalculateProgramMenteePercentagesResult> {
  const program = await client.program.findUnique({
    where: { id: programId },
    select: {
      id: true,
      events: {
        where: { isActive: true },
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
              name: true,
            },
          },
        },
      },
    },
  });

  if (!program) {
    return {
      programId,
      eventCount: 0,
      possibleScore: 0,
      updatedCount: 0,
      items: [],
    };
  }

  const eventIds = program.events.map((event) => event.id);
  const activeEnrollments = program.enrollments;
  const userIds = activeEnrollments.map((enrollment) => enrollment.userId);
  const possibleScore = eventIds.length * 100;

  if (!userIds.length) {
    return {
      programId,
      eventCount: eventIds.length,
      possibleScore,
      updatedCount: 0,
      items: [],
    };
  }

  const eventScores = eventIds.length
    ? await client.eventScore.findMany({
        where: {
          eventId: { in: eventIds },
          userId: { in: userIds },
        },
        select: {
          userId: true,
          score: true,
        },
      })
    : [];

  const scoreTotalByUserId = new Map<string, number>();

  for (const score of eventScores) {
    const currentScore = scoreTotalByUserId.get(score.userId) ?? 0;
    scoreTotalByUserId.set(score.userId, currentScore + score.score);
  }

  const items = activeEnrollments.map((enrollment) => {
    const totalScore = roundScore(scoreTotalByUserId.get(enrollment.userId) ?? 0);
    const averageScore = eventIds.length
      ? roundScore(totalScore / eventIds.length)
      : 0;
    const percentage = possibleScore
      ? roundScore((totalScore / possibleScore) * 100)
      : 0;

    return {
      enrollmentId: enrollment.id,
      userId: enrollment.userId,
      name: enrollment.user?.name ?? "",
      totalScore,
      averageScore,
      percentage,
      position: null,
      possibleScore,
    };
  });

  const positionedItems = [...items]
    .sort(
      (left, right) =>
        right.percentage - left.percentage ||
        right.totalScore - left.totalScore ||
        right.averageScore - left.averageScore ||
        left.name.localeCompare(right.name) ||
        left.userId.localeCompare(right.userId),
    )
    .map((item, index, sortedItems) => {
      const previous = sortedItems[index - 1];
      const isTie =
        previous &&
        previous.percentage === item.percentage &&
        previous.totalScore === item.totalScore &&
        previous.averageScore === item.averageScore;

      return {
        ...item,
        position:
          isTie && previous?.position ? previous.position : index + 1,
      };
    });

  await Promise.all(
    positionedItems.map(async (item) => {
      await client.menteeProgramEnrollment.update({
        where: {
          id: item.enrollmentId,
        },
        data: {
          totalScore: item.totalScore,
          averageScore: item.averageScore,
          percentage: item.percentage,
          position: item.position,
        },
        select: {
          id: true,
        },
      });
    }),
  );

  return {
    programId,
    eventCount: eventIds.length,
    possibleScore,
    updatedCount: positionedItems.length,
    items: positionedItems,
  };
}
