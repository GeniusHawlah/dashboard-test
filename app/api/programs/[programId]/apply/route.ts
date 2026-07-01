import {
  ApplyProgramErrorSchema,
  ApplyProgramParamsSchema,
  ApplyProgramSuccessSchema,
} from "@/utils/zod/applyProgramSchema";
import applyProgramAction from "@/actions/program-action/applyProgramAction";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ programId: string }> },
) {
  const parsedParams = ApplyProgramParamsSchema.safeParse(await params);

  if (!parsedParams.success) {
    return Response.json(
      ApplyProgramErrorSchema.parse({
        error: {
          message: "Invalid program id.",
          statusCode: 400,
        },
      }),
      { status: 400 },
    );
  }

  const result = await applyProgramAction({
    programId: parsedParams.data.programId,
  });

  if (result.error) {
    return Response.json(
      ApplyProgramErrorSchema.parse({
        error: {
          message: result.error.message,
          statusCode: result.error.statusCode,
        },
      }),
      { status: result.error.statusCode ?? 500 },
    );
  }

  return Response.json(
    ApplyProgramSuccessSchema.parse({
      success: {
        message:
          result.success?.message ?? "Program application submitted successfully.",
        data: result.success?.data,
      },
    }),
    { status: 201 },
  );
}
