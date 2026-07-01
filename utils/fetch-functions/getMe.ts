import { cacheTag } from "next/cache";

import { AUTHENTICATION_ERROR_MESSAGE } from "@/utils/constants";
import type { FakeAuthSession } from "@/utils/auth-session";
import {
  logActionFailure,
  logActionSuccess,
} from "@/utils/ordinaryConsoleLogger";

type GetMeUserData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  passport?: string | null;
  userStatus?: string;
  emailVerified?: boolean;
  userId?: string;
  name?: string;
};

type GetMeResponse =
  | {
      success: {
        message: string;
        data: GetMeUserData;
      };
      error?: never;
    }
  | {
      error: {
        message: string;
        statusCode?: number;
      };
      success?: never;
    };

export async function getMe({
  session,
}: {
  session: FakeAuthSession | null;
}): Promise<GetMeResponse> {
  "use cache";

  if (!session?.accessToken || !session.user?.userId) {
    logActionFailure({
      action: "getMe",
      message: AUTHENTICATION_ERROR_MESSAGE,
      context: {
        statusCode: 401,
      },
    });

    return {
      error: {
        message: AUTHENTICATION_ERROR_MESSAGE,
        statusCode: 401,
      },
    };
  }

  cacheTag(`getMe-${session.user.userId}`);

  // In the real app, this is where the backend profile request would run,
  // the response would be validated, and the user payload would be mapped.
  // For now we reuse the cached local session that login wrote into cookies.
  //
  // const response = await fetch(`${process.env.API_BASE}/profile/me`, {
  //   method: "GET",
  //   headers: { Authorization: `Bearer ${session.accessToken}` },
  // });
  // if (!response.ok) {
  //   return { error: { message: "Unable to load profile" } };
  // }

  const user = session?.user ?? session?.data?.user;

  if (!user) {
    logActionFailure({
      action: "getMe",
      message: AUTHENTICATION_ERROR_MESSAGE,
      context: {
        statusCode: 401,
      },
    });

    return {
      error: {
        message: AUTHENTICATION_ERROR_MESSAGE,
        statusCode: 401,
      },
    };
  }

  const data: GetMeUserData = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: String(user.role),
    passport: user.passport ?? null,
    userStatus: user.status,
    emailVerified: user.emailVerified,
    userId: user.userId,
    name: user.name,
  };

  logActionSuccess({
    action: "getMe",
    message: "Profile fetched successfully.",
    context: {
      userId: data.id,
      username: data.email,
    },
  });

  return {
    success: {
      message: "Profile fetched successfully.",
      data,
    },
  };
}
