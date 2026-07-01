import createMenteeAction from "@/actions/auth-actions/createMenteeAction";
import {
  CreateMenteeErrorSchema,
  CreateMenteeSuccessSchema,
} from "@/utils/zod/createMenteeSchema";
import { type MenteeRegDataInterface } from "@/utils/types";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json(
      CreateMenteeErrorSchema.parse({
        error: {
          message: "Invalid form data.",
        },
      }),
      { status: 400 },
    );
  }

  const result = await createMenteeAction(payload as MenteeRegDataInterface);

  if (result.error) {
    return Response.json(
      CreateMenteeErrorSchema.parse({
        error: {
          message: result.error.message,
          formErrors: result.error.formErrors,
        },
      }),
      { status: result.error.statusCode ?? 500 },
    );
  }

  return Response.json(
    CreateMenteeSuccessSchema.parse({
      success: {
        message:
          result.success?.message ??
          "Mentee registered. Check your email to verify your account.",
      },
    }),
    { status: 201 },
  );
}
