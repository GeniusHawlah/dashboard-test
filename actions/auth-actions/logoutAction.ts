"use server";

import { cookies } from "next/headers";

import {
  ACCESS_TOKEN_COOKIE_NAME,
  AUTH_SESSION_COOKIE_NAME,
} from "@/utils/constants";

export interface LogoutActionResult {
  success?: {
    message: string;
  };
  error?: {
    message: string;
  };
}

export default async function logoutAction(): Promise<LogoutActionResult> {
  const cookieStore = await cookies();
  const expiredOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };

  cookieStore.set(ACCESS_TOKEN_COOKIE_NAME, "", expiredOptions);
  cookieStore.set(AUTH_SESSION_COOKIE_NAME, "", expiredOptions);

  return {
    success: {
      message: "Logged out successfully.",
    },
  };
}
