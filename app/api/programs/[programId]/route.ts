import { getCachedSession } from "@/utils/getCachedSession";
import { getProgram } from "@/utils/fetch-functions/getProgram";
import {
  ProgramErrorSchema,
  ProgramSuccessSchema,
} from "@/utils/zod/getProgramSchema";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ programId: string }> },
) {
  const session = await getCachedSession();
  const result = await getProgram({
    programId: (await params).programId,
    userId: session?.user?.id,
  });

  if (result.error) {
    return Response.json(
      ProgramErrorSchema.parse({
        error: {
          message: result.error.message,
          statusCode: result.error.statusCode,
        },
      }),
      { status: result.error.statusCode ?? 500 },
    );
  }

  return Response.json(
    ProgramSuccessSchema.parse({
      success: {
        message: result.success?.message ?? "Program fetched successfully.",
        data: {
          ...result.success?.data,
          applicationOpensAt:
            result.success?.data.applicationOpensAt?.toISOString() ?? null,
          startsAt: result.success?.data.startsAt?.toISOString() ?? null,
          endsAt: result.success?.data.endsAt?.toISOString() ?? null,
          applicationClosesAt:
            result.success?.data.applicationClosesAt?.toISOString() ?? null,
          createdAt: result.success?.data.createdAt.toISOString(),
          updatedAt: result.success?.data.updatedAt.toISOString(),
        },
      },
    }),
    { status: 200 },
  );
}
