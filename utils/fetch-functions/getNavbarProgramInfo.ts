import { isMentee } from "@/utils/auth-helpers";
import { db } from "@/lib/db";
import { ProgramEnrollmentStatus, UserRole } from "@prisma/client";
import { formatDate } from "@/utils/utils";
import { cacheLife, cacheTag } from "next/cache";

export interface NavbarProgramInfoResponse {
  todayLabel: string;
  programLabel: string;
  programValue: string;
  programEndDate?: string;
}

export async function getNavbarProgramInfo({
  userId,
  userRole,
}: {
  userId?: string;
  userRole?: UserRole | UserRole[];
} = {}): Promise<NavbarProgramInfoResponse> {
  "use cache";

  cacheTag("getNavbarProgramInfo");
  if (userId) {
    cacheTag(`getNavbarProgramInfo-${userId}`);
  }
  cacheLife("ten_minutes");

  const now = new Date();
  const roleSource = Array.isArray(userRole)
    ? { providedRoles: userRole }
    : { providedRole: userRole };

  try {
    if (userId && isMentee(roleSource)) {
      const user = await db.user.findUnique({
        where: { id: userId },
        select: {
          programEnrollments: {
            where: { status: ProgramEnrollmentStatus.ACTIVE },
            orderBy: { enrolledAt: "desc" },
            take: 1,
            select: {
              program: {
                select: {
                  name: true,
                  endsAt: true,
                },
              },
            },
          },
        },
      });

      const currentProgram = user?.programEnrollments[0]?.program;

      if (currentProgram) {
        return {
          todayLabel: formatDate(now),
          programLabel: "Current Enrolled Program",
          programValue: currentProgram.name,
          programEndDate: currentProgram.endsAt
            ? formatDate(currentProgram.endsAt)
            : undefined,
        };
      }
    }

    const ongoingProgram = await db.program.findFirst({
      where: {
        startsAt: { lte: now },
        OR: [{ endsAt: null }, { endsAt: { gte: now } }],
      },
      orderBy: [{ startsAt: "desc" }, { createdAt: "desc" }],
      select: {
        name: true,
        endsAt: true,
      },
    });

    return {
      todayLabel: formatDate(now),
      programLabel: "Latest Ongoing Program",
      programValue: ongoingProgram?.name ?? "No ongoing program",
      programEndDate: ongoingProgram?.endsAt
        ? formatDate(ongoingProgram.endsAt)
        : undefined,
    };
  } catch (error) {
    console.log("[getNavbarProgramInfo]", error);

    return {
      todayLabel: formatDate(now),
      programLabel: "Latest Ongoing Program",
      programValue: "No ongoing program",
    };
  }
}
