import { auth } from "@/lib/auth";
import {
  AUTH_LOGIN_EXPECTED_ERROR_MESSAGES,
  EMAIL_NOT_VERIFIED_ERROR_MESSAGE,
  GENERAL_FORM_ERROR_MESSAGE,
} from "@/utils/constants";
import { guardError } from "@/utils/error-helpers";
import { RelativeRoutes } from "@/utils/enum";
import {
  LoginErrorSchema,
  LoginSchema,
  LoginSuccessSchema,
  type LoginRequest,
} from "@/utils/zod/loginSchema";
import {
  logActionExpectedFailure,
  logActionFailure,
  logActionStart,
  logActionSuccess,
} from "@/utils/serverActionLogger";
import { headers } from "next/headers";
import { z } from "zod";

export interface LoginDataInterface {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginFormErrorsInterface {
  email?: { errors: string[] };
  password?: { errors: string[] };
}

export interface LoginFormStateInterface {
  error?: {
    message: string;
    formErrors?: LoginFormErrorsInterface;
  };
  success?: {
    message: string;
  };
}

function getFormErrors(
  error: z.ZodError,
): LoginFormErrorsInterface | undefined {
  const tree = z.treeifyError(error) as {
    properties?: LoginFormErrorsInterface;
  };

  return tree.properties;
}

function getErrorStatus(error: unknown) {
  const statusCode =
    (error as { status?: number } | undefined)?.status ??
    (error as { statusCode?: number } | undefined)?.statusCode;

  return typeof statusCode === "number" ? statusCode : 500;
}

function isExpectedLoginError(message: string, status: number) {
  const normalizedMessage = message.trim().toLowerCase();

  return (
    status === 400 ||
    status === 401 ||
    status === 403 ||
    AUTH_LOGIN_EXPECTED_ERROR_MESSAGES.some(
      (expectedMessage) => expectedMessage === normalizedMessage,
    )
  );
}

export async function POST(request: Request) {
  logActionStart({ action: "loginAction" });

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    await logActionExpectedFailure({
      action: "loginAction",
      message: GENERAL_FORM_ERROR_MESSAGE,
    });

    return Response.json(
      {
        error: {
          message: GENERAL_FORM_ERROR_MESSAGE,
        },
      } satisfies LoginFormStateInterface,
      { status: 400 },
    );
  }

  const requestBody = payload as LoginRequest;
  const validatedFields = LoginSchema.safeParse(requestBody);

  if (!validatedFields.success) {
    await logActionExpectedFailure({
      action: "loginAction",
      message: GENERAL_FORM_ERROR_MESSAGE,
    });

    return Response.json(
      {
        error: {
          message: GENERAL_FORM_ERROR_MESSAGE,
          formErrors: getFormErrors(validatedFields.error),
        },
      } satisfies LoginFormStateInterface,
      { status: 400 },
    );
  }

  const { email, password, rememberMe } = validatedFields.data;

  try {
    const result = await auth.api.signInEmail({
      body: {
        email: email.trim().toLowerCase(),
        password,
        rememberMe,
      },
      headers: await headers(),
      returnHeaders: true,
      returnStatus: true,
    });

    await logActionSuccess({
      action: "loginAction",
      message: "Login successful.",
      context: {
        userId: result.response.user.userId,
        email: result.response.user.email,
      },
    });

    return new Response(
      JSON.stringify(
        LoginSuccessSchema.parse({
          success: {
            message: "Login successful.",
            // redirect: result.response.redirect,
            token: result.response.token,
            // url: result.response.url,
            // user: result.response.user,
          },
        }),
      ),
      {
        status: result.status,
        headers: result.headers,
      },
    );
  } catch (error) {
    const message = guardError(error);
    const status = getErrorStatus(error);
    const displayMessage =
      message === "Email not verified"
        ? EMAIL_NOT_VERIFIED_ERROR_MESSAGE
        : message;
    const shouldLogExpected =
      message === "Email not verified" || isExpectedLoginError(message, status);

    if (message === "Email not verified") {
      await auth.api
        .sendVerificationEmail({
          body: {
            email: email.trim().toLowerCase(),
            callbackURL: RelativeRoutes.VERIFY_EMAIL_PAGE,
          },
        })
        .catch(() => {});
    }

    await (shouldLogExpected ? logActionExpectedFailure : logActionFailure)({
      action: "loginAction",
      message: displayMessage,
      context: {
        email: email.trim().toLowerCase(),
      },
    });

    return Response.json(
      LoginErrorSchema.parse({
        error: {
          message: displayMessage,
        },
      }),
      { status },
    );
  }
}
