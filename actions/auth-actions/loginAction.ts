"use server";

import { cookies } from "next/headers";
import { z } from "zod";

import {
  ACCESS_TOKEN_COOKIE_NAME,
  AUTH_COOKIE_REMEMBER_ME_MAX_AGE,
  AUTH_SESSION_COOKIE_NAME,
  GENERAL_FORM_ERROR_MESSAGE,
  NETWORK_ERROR_MESSAGE,
} from "@/utils/constants";
import type { DemoAccount } from "@/utils/demo-auth";
import type {
  LoginDataInterface,
  LoginFormErrors,
  LoginFormStateInterface,
} from "@/utils/types";
import {
  buildFakeAuthSession,
  serializeFakeAuthSession,
} from "@/utils/auth-session";
import { LoginSchema } from "@/utils/zod/loginSchema";

function buildSessionCookieOptions(rememberMe?: boolean) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    ...(rememberMe
      ? {
          maxAge: AUTH_COOKIE_REMEMBER_ME_MAX_AGE,
        }
      : {}),
  };
}

export default async function loginAction(
  loginData: LoginDataInterface,
  options?: { rememberMe?: boolean; account?: DemoAccount | null },
): Promise<LoginFormStateInterface> {
  const validatedFields = LoginSchema.safeParse(loginData);

  if (!validatedFields.success) {
    return {
      error: {
        message: GENERAL_FORM_ERROR_MESSAGE,
        formErrors: z.treeifyError(validatedFields.error)
          .properties as LoginFormErrors,
      },
    };
  }

  // In the real app, this is where the backend auth request would happen, the response would be validated, and API-level errors would be mapped into the form state.

  // Example of the real flow we are temporarily bypassing:

  // const response = await fetch(`${process.env.API_BASE}/auth/login`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({
  //     email: validatedFields.data.email.trim().toLowerCase(),
  //     password: validatedFields.data.password,
  //   }),
  // });
  // if (!response.ok) {
  //   const errorBody = await response.json().catch(() => null);
  //   return { error: { message: "Login failed", formErrors: ... } };
  // }

  await new Promise((resolve) => setTimeout(resolve, 2000));

  try {
    const session = buildFakeAuthSession(
      options?.account ?? validatedFields.data.email,
    );
    const cookieStore = await cookies();
    const cookieValue = serializeFakeAuthSession(session);
    const cookieOptions = buildSessionCookieOptions(options?.rememberMe);

    cookieStore.set(
      ACCESS_TOKEN_COOKIE_NAME,
      session.accessToken,
      cookieOptions,
    );
    cookieStore.set(AUTH_SESSION_COOKIE_NAME, cookieValue, cookieOptions);

    return {
      success: {
        message: "Login successful.",
        session,
      },
    };
  } catch (error) {
    return {
      error: {
        message: error instanceof Error ? error.message : NETWORK_ERROR_MESSAGE,
      },
    };
  }
}
