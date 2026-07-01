"use server";

import { db } from "@/lib/db";
import { isMentee } from "@/utils/auth-helpers";
import {
  AUTHENTICATION_ERROR_MESSAGE,
  AUTHORIZATION_ERROR_MESSAGE,
  NETWORK_ERROR_MESSAGE,
} from "@/utils/constants";
import { guardError, networkError } from "@/utils/error-helpers";
import { formatDate, formatTitledName } from "@/utils/utils";
import {
  AssignmentStatus,
  ProgramEnrollmentStatus,
  UserRole,
} from "@prisma/client";
import { cacheLife, cacheTag } from "next/cache";

type MenteeOverviewResponse = {
  success?: {
    message: string;
    data: {
      profile: {
        id: string;
        displayName: string;
        email: string;
        status: string;
        educationLevel: string | null;
      };
      program: {
        id: string;
        name: string;
        description: string | null;
        levelCount: number;
        currentLevel: number;
        isActive: boolean;
        startsAt: string | null;
        endsAt: string | null;
        events: {
          id: string;
        }[];
      } | null;
      enrollment: {
        id: string;
        status: ProgramEnrollmentStatus;
        statusLabel: string;
        enrolledAt: string;
        completedAt: string | null;
        droppedAt: string | null;
        note: string | null;
      } | null;
      completion: {
        hasEnrollment: boolean;
        currentLevel: number | null;
        levelCount: number;
        currentProgramLevel: number | null;
        completedLevels: number;
        totalLevels: number;
        percentage: number;
        remainingLevels: number;
        nextLevel: number | null;
        status: ProgramEnrollmentStatus | null;
        statusLabel: string;
        note: string;
        totalDays: number;
        elapsedDays: number;
        remainingDays: number;
        programEndDate: string | null;
      };
      mentors: {
        activeCount: number;
        primaryMentor: {
          id: string;
          displayName: string;
          email: string;
        } | null;
        items: {
          id: string;
          displayName: string;
          email: string;
          isPrimary: boolean;
          programName: string | null;
          assignedAt: string;
        }[];
      };
      results: {
        total: number;
        published: number;
        average: number | null;
        scorePercentage: number;
        earnedScore: number;
        possibleScore: number;
        eventCount: number;
        latest: {
          id: string;
          programName: string;
          average: number | null;
          percentage: number | null;
          grade: string | null;
          published: boolean;
          locked: boolean;
          assessedAt: string;
          fromLevel: number | null;
          toLevel: number | null;
        } | null;
        recent: {
          id: string;
          programName: string;
          average: number | null;
          percentage: number | null;
          grade: string | null;
          published: boolean;
          locked: boolean;
          assessedAt: string;
          fromLevel: number | null;
          toLevel: number | null;
        }[];
      };
      programHistory: {
        total: number;
        items: {
          id: string;
          programId: string;
          programName: string;
          cohort: string | null;
          isActive: boolean;
          program: {
            id: string;
            name: string;
            description: string | null;
            price: number;
            cohort: string | null;
            coverImage: string | null;
            applicationOpensAt: string | null;
            startsAt: string | null;
            endsAt: string | null;
            applicationClosesAt: string | null;
            programBenefits: string[];
            requirements: string[];
            isActive: boolean;
            enrolledByUser: boolean;
          };
          status: ProgramEnrollmentStatus;
          statusLabel: string;
          fromLevel: number;
          toLevel: number;
          levelCount: number;
          currentLevel: number;
          completedLevels: number;
          percentage: number;
          enrolledAt: string;
          completedAt: string | null;
          droppedAt: string | null;
          note: string | null;
          scoreTotal: number | null;
          scoreAverage: number | null;
          performedByName: string | null;
          finalResult: {
            scoreTotal: number | null;
            scoreAverage: number | null;
            percentage: number | null;
            performedByName: string | null;
            assessedAt: string | null;
          };
          isCurrent: boolean;
        }[];
      };
    };
  };
  error?: {
    message: string;
    statusCode?: number;
  };
};

type EnrollmentSnapshot = {
  currentLevel: number;
  levelCount: number;
  currentProgramLevel: number;
  completedLevels: number;
  remainingLevels: number;
  totalLevels: number;
  percentage: number;
  nextLevel: number | null;
};

type ProgramTimelineSnapshot = {
  totalDays: number;
  elapsedDays: number;
  remainingDays: number;
  percentage: number;
  programEndDate: string | null;
};

function labelStatus(status: ProgramEnrollmentStatus) {
  switch (status) {
    case ProgramEnrollmentStatus.ACTIVE:
      return "Active";
    case ProgramEnrollmentStatus.COMPLETED:
      return "Completed";
    case ProgramEnrollmentStatus.PAUSED:
      return "Paused";
    case ProgramEnrollmentStatus.DROPPED:
      return "Dropped";
    default:
      return status;
  }
}

function humanize(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function average(values: number[]) {
  return values.length
    ? Math.round(
        (values.reduce((sum, value) => sum + value, 0) / values.length) * 10,
      ) / 10
    : null;
}

function toIso(value: Date) {
  return value.toISOString();
}

function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function snapshotProgramTimeline({
  startsAt,
  endsAt,
}: {
  startsAt: Date | null;
  endsAt: Date | null;
}): ProgramTimelineSnapshot {
  if (!startsAt || !endsAt) {
    return {
      totalDays: 0,
      elapsedDays: 0,
      remainingDays: 0,
      percentage: 0,
      programEndDate: endsAt ? toIso(endsAt) : null,
    };
  }

  const startDay = startOfLocalDay(startsAt);
  const endDay = startOfLocalDay(endsAt);
  const today = startOfLocalDay(new Date());
  const totalDays = Math.max(
    1,
    Math.round((endDay.getTime() - startDay.getTime()) / 86_400_000) + 1,
  );
  const elapsedRaw =
    Math.round((today.getTime() - startDay.getTime()) / 86_400_000) + 1;
  const elapsedDays = Math.min(totalDays, Math.max(0, elapsedRaw));
  const remainingDays = Math.max(0, totalDays - elapsedDays);
  const percentage = Math.min(
    100,
    Math.max(0, Math.round((elapsedDays / totalDays) * 100)),
  );

  return {
    totalDays,
    elapsedDays,
    remainingDays,
    percentage,
    programEndDate: toIso(endsAt),
  };
}

function snapshotEnrollment({
  currentLevel,
  levelCount,
}: {
  currentLevel: number;
  levelCount: number;
}): EnrollmentSnapshot {
  const currentProgramLevel = Math.max(1, currentLevel);
  const totalLevels = Math.max(1, levelCount);
  const completedLevels = Math.min(totalLevels, currentProgramLevel);
  const remainingLevels = Math.max(0, totalLevels - completedLevels);
  const percentage = Math.min(
    100,
    Math.round((completedLevels / totalLevels) * 100),
  );
  const nextLevel =
    remainingLevels > 0 ? Math.min(levelCount, currentProgramLevel + 1) : null;

  return {
    currentLevel: currentProgramLevel,
    levelCount,
    currentProgramLevel,
    completedLevels,
    remainingLevels,
    totalLevels,
    percentage,
    nextLevel,
  };
}

export async function getMenteeOverview({
  authSessionId,
  menteeId,
  userRole,
}: {
  authSessionId: string | undefined;
  menteeId: string | undefined;
  userRole: UserRole | UserRole[] | undefined;
}): Promise<MenteeOverviewResponse> {
  "use cache";

  if (!authSessionId || !menteeId) {
    return {
      error: {
        message: AUTHENTICATION_ERROR_MESSAGE,
        statusCode: 401,
      },
    };
  }

  const roles = Array.isArray(userRole)
    ? userRole
    : userRole
      ? [userRole]
      : undefined;

  if (!isMentee({ providedRoles: roles })) {
    return {
      error: {
        message: AUTHORIZATION_ERROR_MESSAGE,
        statusCode: 403,
      },
    };
  }

  cacheTag(`getMenteeOverview-${menteeId}`);
  cacheLife("ten_minutes");

  try {
    const user = await db.user.findUnique({
      where: { id: menteeId },
      select: {
        id: true,
        title: true,
        name: true,
        email: true,
        status: true,
        educationLevel: true,
        programEnrollments: {
          orderBy: { enrolledAt: "desc" },
          take: 6,
          select: {
            id: true,
            status: true,
            enrolledAt: true,
            completedAt: true,
            droppedAt: true,
            note: true,
            totalScore: true,
            averageScore: true,
            percentage: true,
            updatedAt: true,
            program: {
              select: {
                id: true,
                name: true,
                description: true,
                price: true,
                cohort: true,
                coverImage: true,
                levelCount: true,
                currentLevel: true,
                isActive: true,
                startsAt: true,
                endsAt: true,
                applicationOpensAt: true,
                applicationClosesAt: true,
                programBenefits: true,
                requirements: true,
                events: {
                  where: { isActive: true },
                  select: {
                    id: true,
                  },
                },
              },
            },
            histories: {
              orderBy: { movedAt: "desc" },
              select: {
                id: true,
                fromLevel: true,
                toLevel: true,
                totalScore: true,
                averageScore: true,
                percentage: true,
                note: true,
                movedAt: true,
                performedBy: {
                  select: {
                    id: true,
                    title: true,
                    name: true,
                  },
                },
                program: {
                  select: {
                    id: true,
                    name: true,
                    cohort: true,
                    levelCount: true,
                    currentLevel: true,
                    isActive: true,
                    startsAt: true,
                    endsAt: true,
                  },
                },
              },
            },
          },
        },
        mentorAssignmentsAsMentee: {
          where: { status: AssignmentStatus.ACTIVE },
          orderBy: { assignedAt: "desc" },
          select: {
            id: true,
            isPrimary: true,
            assignedAt: true,
            mentor: {
              select: {
                id: true,
                title: true,
                name: true,
                email: true,
              },
            },
            program: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return {
        error: {
          message: "Mentee record not found.",
          statusCode: 404,
        },
      };
    }

    const sortedEnrollments = [...user.programEnrollments].sort(
      (a, b) => b.enrolledAt.getTime() - a.enrolledAt.getTime(),
    );
    const currentEnrollment =
      sortedEnrollments.find(
        (enrollment) => enrollment.status === ProgramEnrollmentStatus.ACTIVE,
      ) ?? null;
    const orderedEnrollments = currentEnrollment
      ? [
          currentEnrollment,
          ...sortedEnrollments.filter(
            (enrollment) => enrollment.id !== currentEnrollment.id,
          ),
        ]
      : sortedEnrollments;

    const currentProgram = currentEnrollment?.program ?? null;
    const currentProgramLevel = currentProgram?.currentLevel ?? 1;
    const currentTimeline = snapshotProgramTimeline({
      startsAt: currentProgram?.startsAt ?? null,
      endsAt: currentProgram?.endsAt ?? null,
    });
    const currentProgramSummary = currentProgram
      ? {
          ...currentProgram,
          startsAt: currentProgram.startsAt
            ? toIso(currentProgram.startsAt)
            : null,
          endsAt: currentProgram.endsAt ? toIso(currentProgram.endsAt) : null,
        }
      : null;

    const currentSnapshot = currentEnrollment
      ? snapshotEnrollment({
          currentLevel: currentProgramLevel,
          levelCount: currentProgram?.levelCount ?? 1,
        })
      : {
          currentLevel: null,
          currentProgramLevel,
          levelCount: currentProgram?.levelCount ?? 0,
          completedLevels: 0,
          remainingLevels: 0,
          totalLevels: 0,
          percentage: 0,
          nextLevel: null,
        };

    const currentProgramEventCount = currentProgram?.events.length ?? 0;
    const currentProgramScoreTotal = currentEnrollment?.totalScore ?? 0;
    const currentProgramScoreAverage = currentEnrollment?.averageScore ?? 0;
    const currentProgramScorePercentage = currentEnrollment?.percentage ?? 0;

    const mentorItems = user.mentorAssignmentsAsMentee.map((assignment) => ({
      id: assignment.id,
      displayName: formatTitledName(assignment.mentor),
      email: assignment.mentor.email,
      isPrimary: assignment.isPrimary,
      programName: assignment.program?.name ?? null,
      assignedAt: toIso(assignment.assignedAt),
    }));

    const primaryMentor =
      mentorItems.find((mentor) => mentor.isPrimary) ?? mentorItems[0] ?? null;

    const resultItems = orderedEnrollments.map((enrollment) => {
      const latestHistory = enrollment.histories[0] ?? null;
      const isCurrentEnrollment = enrollment.id === currentEnrollment?.id;
      const scoreTotal = enrollment.totalScore;
      const scoreAverage = enrollment.averageScore;
      const scorePercentage = enrollment.percentage;
      const assessedAt = isCurrentEnrollment
        ? toIso(enrollment.updatedAt)
        : latestHistory?.movedAt
          ? toIso(latestHistory.movedAt)
          : toIso(enrollment.enrolledAt);

      return {
        id: latestHistory?.id ?? enrollment.id,
        programName: enrollment.program.name,
        average: scoreAverage,
        percentage: scorePercentage,
        grade: null,
        published:
          isCurrentEnrollment || Boolean(latestHistory) || scorePercentage > 0,
        locked: false,
        assessedAt,
        fromLevel: latestHistory?.fromLevel ?? null,
        toLevel: latestHistory?.toLevel ?? enrollment.program.currentLevel,
      };
    });

    const resultPercentages = resultItems
      .map((result) => result.percentage ?? result.average)
      .filter((value): value is number => typeof value === "number");

    const programHistory = orderedEnrollments.map((enrollment) => {
      const historyItems = enrollment.histories;
      const latestHistory = historyItems[0] ?? null;
      const snapshot = snapshotEnrollment({
        currentLevel: enrollment.program.currentLevel,
        levelCount: enrollment.program.levelCount,
      });
      const isCurrentEnrollment = enrollment.id === currentEnrollment?.id;
      const scoreTotal = enrollment.totalScore;
      const scoreAverage = enrollment.averageScore;
      const scorePercentage = enrollment.percentage;
      const assessedAt = isCurrentEnrollment
        ? toIso(enrollment.updatedAt)
        : latestHistory?.movedAt
          ? toIso(latestHistory.movedAt)
          : toIso(enrollment.enrolledAt);
      const fromLevel = latestHistory?.fromLevel ?? null;
      const toLevel =
        latestHistory?.toLevel ??
        (isCurrentEnrollment ? enrollment.program.currentLevel : null);

      return {
        id: enrollment.id,
        programId: enrollment.program.id,
        programName: enrollment.program.name,
        cohort: enrollment.program.cohort,
        isActive: enrollment.program.isActive,
        program: {
          id: enrollment.program.id,
          name: enrollment.program.name,
          description: enrollment.program.description,
          price: enrollment.program.price,
          cohort: enrollment.program.cohort,
          coverImage: enrollment.program.coverImage,
          applicationOpensAt: enrollment.program.applicationOpensAt
            ? toIso(enrollment.program.applicationOpensAt)
            : null,
          startsAt: enrollment.program.startsAt
            ? toIso(enrollment.program.startsAt)
            : null,
          endsAt: enrollment.program.endsAt
            ? toIso(enrollment.program.endsAt)
            : null,
          applicationClosesAt: enrollment.program.applicationClosesAt
            ? toIso(enrollment.program.applicationClosesAt)
            : null,
          programBenefits: enrollment.program.programBenefits,
          requirements: enrollment.program.requirements,
          isActive: enrollment.program.isActive,
          enrolledByUser: enrollment.status === ProgramEnrollmentStatus.ACTIVE,
        },
        status: enrollment.status,
        statusLabel: labelStatus(enrollment.status),
        fromLevel: fromLevel ?? 1,
        toLevel: toLevel ?? snapshot.currentLevel,
        levelCount: snapshot.levelCount,
        currentLevel: snapshot.currentLevel,
        completedLevels: snapshot.completedLevels,
        percentage: snapshot.percentage,
        enrolledAt: toIso(enrollment.enrolledAt),
        completedAt: enrollment.completedAt
          ? toIso(enrollment.completedAt)
          : null,
        droppedAt: enrollment.droppedAt ? toIso(enrollment.droppedAt) : null,
        note: enrollment.note,
        scoreTotal,
        scoreAverage,
        performedByName: latestHistory?.performedBy
          ? formatTitledName(latestHistory.performedBy)
          : null,
        finalResult: {
          scoreTotal,
          scoreAverage,
          percentage: scorePercentage,
          performedByName: latestHistory?.performedBy
            ? formatTitledName(latestHistory.performedBy)
            : null,
          assessedAt,
        },
        isCurrent: isCurrentEnrollment,
      };
    });

    const currentProgramLevelCount = currentProgram?.levelCount ?? 0;
    const completion = currentEnrollment
      ? {
          hasEnrollment: true,
          currentLevel: currentSnapshot.currentLevel,
          levelCount: currentProgramLevelCount,
          currentProgramLevel: currentProgram?.currentLevel ?? null,
          completedLevels: currentSnapshot.completedLevels,
          totalLevels: currentSnapshot.totalLevels,
          percentage: currentTimeline.percentage,
          remainingLevels: currentSnapshot.remainingLevels,
          nextLevel: currentSnapshot.nextLevel,
          status: currentEnrollment.status,
          statusLabel: labelStatus(currentEnrollment.status),
          note:
            currentEnrollment.note ??
            (currentProgram?.endsAt
              ? `Ends ${formatDate(currentProgram.endsAt)}`
              : null) ??
            (currentEnrollment.status === ProgramEnrollmentStatus.COMPLETED
              ? "You have completed this mentorship track."
              : currentTimeline.elapsedDays === 0
                ? "Program timeline has not started yet."
                : currentSnapshot.nextLevel
                  ? `Your next milestone is Level ${currentSnapshot.nextLevel}.`
                  : "You have reached the current end of this track."),
          totalDays: currentTimeline.totalDays,
          elapsedDays: currentTimeline.elapsedDays,
          remainingDays: currentTimeline.remainingDays,
          programEndDate: currentTimeline.programEndDate,
        }
      : {
          hasEnrollment: false,
          currentLevel: null,
          levelCount: 0,
          currentProgramLevel: null,
          completedLevels: 0,
          remainingLevels: 0,
          totalLevels: 0,
          percentage: 0,
          nextLevel: null,
          status: null,
          statusLabel: "No enrollment",
          note: "Enroll in a program to start tracking your mentorship completion.",
          totalDays: 0,
          elapsedDays: 0,
          remainingDays: 0,
          programEndDate: currentTimeline.programEndDate,
        };

    return {
      success: {
        message: "Mentee overview fetched",
        data: {
          profile: {
            id: user.id,
            displayName: formatTitledName(user),
            email: user.email,
            status: humanize(user.status),
            educationLevel: user.educationLevel ?? null,
          },
          program: currentProgramSummary,
          enrollment: currentEnrollment
            ? {
                id: currentEnrollment.id,
                status: currentEnrollment.status,
                statusLabel: labelStatus(currentEnrollment.status),
                enrolledAt: toIso(currentEnrollment.enrolledAt),
                completedAt: currentEnrollment.completedAt
                  ? toIso(currentEnrollment.completedAt)
                  : null,
                droppedAt: currentEnrollment.droppedAt
                  ? toIso(currentEnrollment.droppedAt)
                  : null,
                note: currentEnrollment.note,
              }
            : null,
          completion,
          mentors: {
            activeCount: mentorItems.length,
            primaryMentor,
            items: mentorItems,
          },
          results: {
            total: resultItems.length,
            published: resultItems.filter((result) => result.published).length,
            average: currentEnrollment
              ? currentProgramScoreAverage
              : average(resultPercentages),
            scorePercentage: currentProgramScorePercentage,
            earnedScore: currentProgramScoreTotal,
            possibleScore: currentProgramEventCount * 100,
            eventCount: currentProgramEventCount,
            latest: resultItems[0] ?? null,
            recent: resultItems,
          },
          programHistory: {
            total: orderedEnrollments.length,
            items: programHistory,
          },
        },
      },
    };
  } catch (err: any) {
    console.log("[getMenteeOverview]", err);

    if (networkError(err?.message)) {
      return { error: { message: NETWORK_ERROR_MESSAGE } };
    }

    return {
      error: {
        message: guardError(err) || "Failed to fetch mentee overview",
      },
    };
  }
}
