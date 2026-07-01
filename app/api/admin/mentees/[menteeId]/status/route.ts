import updateMenteeStatusAction from "@/actions/mentee-action/updateMenteeStatusAction";
import type { UpdateMenteeStatusActionData } from "@/actions/mentee-action/updateMenteeStatusAction";
import {
  UpdateMenteeStatusParamsSchema,
  UpdateMenteeStatusBodySchema,
} from "@/utils/zod/updateMenteeStatusSchema";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ menteeId: string }> },
) {
  const parsedParams = UpdateMenteeStatusParamsSchema.safeParse(await params);

  if (!parsedParams.success) {
    return Response.json(
      {
        error: {
          message: "Invalid mentee id.",
          statusCode: 400,
        },
      },
      { status: 400 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      {
        error: {
          message: "Invalid request body.",
          statusCode: 400,
        },
      },
      { status: 400 },
    );
  }

  const parsedBody = UpdateMenteeStatusBodySchema.safeParse(body);

  if (!parsedBody.success) {
    return Response.json(
      {
        error: {
          message: "Invalid status.",
          statusCode: 400,
        },
      },
      { status: 400 },
    );
  }

  const payload: UpdateMenteeStatusActionData = {
    menteeId: parsedParams.data.menteeId,
    status: parsedBody.data.status,
  };

  const result = await updateMenteeStatusAction(payload);

  if (result.error) {
    return Response.json(
      {
        error: {
          message: result.error.message,
          statusCode: result.error.statusCode,
        },
      },
      { status: result.error.statusCode ?? 500 },
    );
  }

  return Response.json(
    {
      success: {
        message: result.success?.message ?? "Mentee status updated.",
      },
    },
    { status: 200 },
  );
}
