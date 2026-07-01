import requestOtpAction, {
  type RequestOtpDataInterface,
} from "@/actions/auth-actions/requestOtpAction";
import { GENERAL_FORM_ERROR_MESSAGE } from "@/utils/constants";
import {
  RequestOtpErrorSchema,
  RequestOtpSuccessSchema,
} from "@/utils/zod/requestOtpSchema";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json(
      RequestOtpErrorSchema.parse({
        error: {
          message: GENERAL_FORM_ERROR_MESSAGE,
        },
      }),
      { status: 400 },
    );
  }

  const result = await requestOtpAction(payload as RequestOtpDataInterface);

  if (result.error) {
    return Response.json(
      RequestOtpErrorSchema.parse({
        error: {
          message: result.error.message,
          formErrors: result.error.formErrors,
        },
      }),
      { status: result.error.statusCode ?? 500 },
    );
  }

  return Response.json(
    RequestOtpSuccessSchema.parse({
      success: {
        message:
          result.success?.message ??
          "If an account matches that email, a code has been sent.",
      },
    }),
    { status: 200 },
  );
}
