import { db } from "@/lib/db";
import { NETWORK_ERROR_MESSAGE } from "@/utils/constants";
import { guardError, networkError } from "@/utils/error-helpers";
import { ProgramEnrollmentStatus } from "@/utils/prisma";
import { cacheLife, cacheTag } from "next/cache";

export interface ProgramItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  cohort: string | null;
  coverImage: string | null;
  applicationOpensAt: Date | null;
  startsAt: Date | null;
  endsAt: Date | null;
  applicationClosesAt: Date | null;
  programBenefits: string[];
  requirements: string[];
  isActive: boolean;
  enrolledByUser: boolean;
}

export interface ProgramsResponse {
  success?: {
    message: string;
    data: ProgramItem[];
    metadata: {
      total: number;
    };
  };
  error?: {
    message: string;
    statusCode?: number;
  };
}

function getApplicationPriority(
  program: Pick<ProgramItem, "applicationOpensAt" | "applicationClosesAt">,
  now: Date,
) {
  const opensAt = program.applicationOpensAt?.getTime();
  const closesAt = program.applicationClosesAt?.getTime();
  const nowTime = now.getTime();

  if (opensAt && nowTime < opensAt) {
    return 1;
  }

  if (closesAt && nowTime >= closesAt) {
    return 2;
  }

  return 0;
}

export async function getPrograms({
  userId,
}: {
  userId?: string;
} = {}): Promise<ProgramsResponse> {
  "use cache";

  cacheTag("programs");

  if (userId) {
    cacheTag(`programs-${userId}`);
  }

  cacheLife("ten_minutes");

  try {
    const now = new Date();

    const programs = await db.program.findMany({
      where: {
        isActive: true,
        endsAt: {
          gte: now,
        },
      },
      orderBy: [{ startsAt: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        cohort: true,
        coverImage: true,
        applicationOpensAt: true,
        startsAt: true,
        endsAt: true,
        applicationClosesAt: true,
        programBenefits: true,
        requirements: true,
        isActive: true,
        ...(userId
          ? {
              enrollments: {
                where: { userId, status: ProgramEnrollmentStatus.ACTIVE },
                select: {
                  id: true,
                },
              },
            }
          : {}),
      },
    });

    const data: ProgramItem[] = programs.map((program) => {
      const programWithEnrollments = program as typeof program & {
        enrollments?: { id: string }[];
      };

      return {
        id: program.id,
        name: program.name,
        description: program.description,
        price: program.price,
        cohort: program.cohort,
        coverImage: program.coverImage,
        applicationOpensAt: program.applicationOpensAt,
        startsAt: program.startsAt,
        endsAt: program.endsAt,
        applicationClosesAt: program.applicationClosesAt,
        programBenefits: program.programBenefits,
        requirements: program.requirements,
        isActive: program.isActive,
        enrolledByUser: Boolean(programWithEnrollments.enrollments?.length),
      };
    });

    data.sort((left, right) => {
      const leftPriority = getApplicationPriority(left, now);
      const rightPriority = getApplicationPriority(right, now);

      if (leftPriority !== rightPriority) {
        return leftPriority - rightPriority;
      }

      const leftStartsAt = left.startsAt?.getTime() ?? Number.POSITIVE_INFINITY;
      const rightStartsAt =
        right.startsAt?.getTime() ?? Number.POSITIVE_INFINITY;

      if (leftStartsAt !== rightStartsAt) {
        return leftStartsAt - rightStartsAt;
      }

      return left.name.localeCompare(right.name);
    });

    return {
      success: {
        message: "Programs fetched successfully.",
        data,
        metadata: {
          total: data.length,
        },
      },
    };
  } catch (error) {
    console.log("[getPrograms]", error);

    if (networkError((error as { message?: string } | undefined)?.message)) {
      return {
        error: {
          message: NETWORK_ERROR_MESSAGE,
        },
      };
    }

    return {
      error: {
        message: guardError(error) || "Failed to fetch programs.",
      },
    };
  }
}
