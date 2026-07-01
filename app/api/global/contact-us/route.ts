import contactUsAction from "@/actions/email-action/contactUsAction";
import { GENERAL_FORM_ERROR_MESSAGE } from "@/utils/constants";
import {
  ContactUsErrorSchema,
  ContactUsSuccessSchema,
  type ContactUsRequest,
} from "@/utils/zod/contactUsSchema";

async function parseRequestBody(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return request.json();
  }

  const formData = await request.formData();
  return Object.fromEntries(formData.entries());
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await parseRequestBody(request);
  } catch {
    return Response.json(
      ContactUsErrorSchema.parse({
        error: {
          message: GENERAL_FORM_ERROR_MESSAGE,
        },
      }),
      { status: 400 },
    );
  }

  const result = await contactUsAction(payload as ContactUsRequest);

  if (result.error) {
    return Response.json(
      ContactUsErrorSchema.parse({
        error: {
          message: result.error.message,
          formErrors: result.error.formErrors,
        },
      }),
      {
        status: result.error.formErrors ? 400 : 500,
      },
    );
  }

  return Response.json(
    ContactUsSuccessSchema.parse({
      success: {
        message:
          result.success?.message ?? "Your message has been sent successfully.",
      },
    }),
    { status: 200 },
  );
}
