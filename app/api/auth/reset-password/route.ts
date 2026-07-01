import resetPasswordAction, {
  type ResetPasswordDataInterface,
} from "@/actions/auth-actions/resetPasswordAction";
import { GENERAL_FORM_ERROR_MESSAGE } from "@/utils/constants";
import {
  ResetPasswordErrorSchema,
  ResetPasswordSuccessSchema,
} from "@/utils/zod/resetPasswordSchema";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json(
      ResetPasswordErrorSchema.parse({
        error: {
          message: GENERAL_FORM_ERROR_MESSAGE,
        },
      }),
      { status: 400 },
    );
  }

  const result = await resetPasswordAction(payload as ResetPasswordDataInterface);

  if (result.error) {
    return Response.json(
      ResetPasswordErrorSchema.parse({
        error: {
          message: result.error.message,
          formErrors: result.error.formErrors,
        },
      }),
      { status: result.error.statusCode ?? 500 },
    );
  }

  return Response.json(
    ResetPasswordSuccessSchema.parse({
      success: {
        message:
          result.success?.message ??
          "Your password has been reset successfully.",
      },
    }),
    { status: 200 },
  );
}
