import createMentorAction from "@/actions/auth-actions/createMentorAction";
import {
  CreateMentorErrorSchema,
  CreateMentorSuccessSchema,
} from "@/utils/zod/createMentorSchema";
import { type MentorRegDataInterface } from "@/utils/types";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json(
      CreateMentorErrorSchema.parse({
        error: {
          message: "Invalid form data.",
        },
      }),
      { status: 400 },
    );
  }

  const result = await createMentorAction(payload as MentorRegDataInterface);

  if (result.error) {
    return Response.json(
      CreateMentorErrorSchema.parse({
        error: {
          message: result.error.message,
          formErrors: result.error.formErrors,
        },
      }),
      { status: result.error.statusCode ?? 500 },
    );
  }

  return Response.json(
    CreateMentorSuccessSchema.parse({
      success: {
        message:
          result.success?.message ??
          "Mentor registered. Check your email to verify your account.",
      },
    }),
    { status: 201 },
  );
}
