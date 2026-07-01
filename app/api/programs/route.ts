import { getCachedSession } from "@/utils/getCachedSession";
import {
  ProgramsErrorSchema,
  ProgramsSuccessSchema,
} from "@/utils/zod/getProgramsSchema";
import { getPrograms } from "@/utils/fetch-functions/getPrograms";

export async function GET() {
  const session = await getCachedSession();
  const result = await getPrograms({ userId: session?.user.id });

  if (result.error) {
    return Response.json(
      ProgramsErrorSchema.parse({
        error: {
          message: result.error.message,
          statusCode: result.error.statusCode,
        },
      }),
      { status: result.error.statusCode ?? 500 },
    );
  }

  return Response.json(
    ProgramsSuccessSchema.parse({
      success: {
        message: result.success?.message ?? "Programs fetched successfully.",
        data:
          result.success?.data?.map((program) => ({
            ...program,
            applicationOpensAt:
              program.applicationOpensAt?.toISOString() ?? null,
            startsAt: program.startsAt?.toISOString() ?? null,
            endsAt: program.endsAt?.toISOString() ?? null,
            applicationClosesAt:
              program.applicationClosesAt?.toISOString() ?? null,
            programBenefits: program.programBenefits,
          })) ?? [],
        metadata: {
          total: result.success?.metadata.total ?? 0,
        },
      },
    }),
    { status: 200 },
  );
}
