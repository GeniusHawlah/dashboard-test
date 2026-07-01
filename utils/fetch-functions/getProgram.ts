import { db } from "@/lib/db";
import { NETWORK_ERROR_MESSAGE } from "@/utils/constants";
import { guardError, networkError } from "@/utils/error-helpers";
import { ProgramEnrollmentStatus } from "@prisma/client";
import { cacheLife, cacheTag } from "next/cache";

export interface ProgramMentorBrief {
  id: string;
  title: string | null;
  name: string;
  email: string;
}

export interface ProgramDetailsItem {
  id: string;
  name: string;
  description: string | null;
  levelCount: number;
  currentLevel: number;
  isActive: boolean;
  price: number;
  cohort: string | null;
  coverImage: string | null;
  applicationOpensAt: Date | null;
  startsAt: Date | null;
  endsAt: Date | null;
  applicationClosesAt: Date | null;
  programBenefits: string[];
  requirements: string[];
  createdAt: Date;
  updatedAt: Date;
  mentors: ProgramMentorBrief[];
  _count: {
    enrollments: number;
  };
  enrolledByUser: boolean;
  activeEnrollmentProgramId: string | null;
}

export interface ProgramResponse {
  success?: {
    message: string;
    data: ProgramDetailsItem;
  };
  error?: {
    message: string;
    statusCode?: number;
  };
}

export async function getProgram({
  programId,
  userId,
}: {
  programId: string;
  userId?: string;
}): Promise<ProgramResponse> {
  "use cache";

  const normalizedProgramId = programId.trim();

  if (!normalizedProgramId) {
    return {
      error: {
        message: "Invalid program id.",
        statusCode: 400,
      },
    };
  }

  cacheTag("programs");
  cacheTag(`program-${normalizedProgramId}`);

  if (userId) {
    cacheTag(`programs-${userId}`);
  }

  cacheLife("ten_minutes");

  try {
    const program = await db.program.findUnique({
      where: { id: normalizedProgramId },
      select: {
        id: true,
        name: true,
        description: true,
        levelCount: true,
        currentLevel: true,
        isActive: true,
        price: true,
        cohort: true,
        coverImage: true,
        applicationOpensAt: true,
        startsAt: true,
        endsAt: true,
        applicationClosesAt: true,
        programBenefits: true,
        requirements: true,
        createdAt: true,
        updatedAt: true,
        mentors: {
          orderBy: [{ name: "asc" }],
          select: {
            id: true,
            title: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
        ...(userId
          ? {
              enrollments: {
                where: {
                  userId,
                  status: ProgramEnrollmentStatus.ACTIVE,
                },
                select: {
                  id: true,
                  programId: true,
                },
              },
            }
          : {}),
      },
    });

    if (!program) {
      return {
        error: {
          message: "Program not found.",
          statusCode: 404,
        },
      };
    }

    const programWithEnrollments = program as typeof program & {
      enrollments?: { id: string; programId: string }[];
    };
    const activeEnrollmentProgramId =
      programWithEnrollments.enrollments?.[0]?.programId ?? null;

    return {
      success: {
        message: "Program fetched successfully.",
        data: {
          id: program.id,
          name: program.name,
          description: program.description,
          levelCount: program.levelCount,
          currentLevel: program.currentLevel,
          isActive: program.isActive,
          price: program.price,
          cohort: program.cohort,
          coverImage: program.coverImage,
          applicationOpensAt: program.applicationOpensAt,
          startsAt: program.startsAt,
          endsAt: program.endsAt,
          applicationClosesAt: program.applicationClosesAt,
          programBenefits: program.programBenefits,
          requirements: program.requirements,
          createdAt: program.createdAt,
          updatedAt: program.updatedAt,
          mentors: program.mentors,
          _count: program._count,
          enrolledByUser: activeEnrollmentProgramId === program.id,
          activeEnrollmentProgramId,
        },
      },
    };
  } catch (error) {
    console.log("[getProgram]", error);

    if (networkError((error as { message?: string } | undefined)?.message)) {
      return {
        error: {
          message: NETWORK_ERROR_MESSAGE,
        },
      };
    }

    return {
      error: {
        message: guardError(error) || "Failed to fetch program.",
      },
    };
  }
}
