import { cookies } from "next/headers";
import { cache } from "react";

import {
  ACCESS_TOKEN_COOKIE_NAME,
  AUTH_SESSION_COOKIE_NAME,
} from "@/utils/constants";
import { parseFakeAuthSession } from "@/utils/auth-session";

async function getSessionFromRequest() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value;
  const sessionCookie = cookieStore.get(AUTH_SESSION_COOKIE_NAME)?.value;

  if (!accessToken || !sessionCookie) {
    return null;
  }

  const session = parseFakeAuthSession(sessionCookie);

  if (!session || session.accessToken !== accessToken) {
    return null;
  }

  return session;
}

const getDevCachedSession = cache(async () => {
  return getSessionFromRequest();
});

export async function getCachedSession() {
  return process.env.NODE_ENV === "production"
    ? getSessionFromRequest()
    : getDevCachedSession();
}
