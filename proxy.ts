import { NextRequest, NextResponse } from "next/server";
import { RelativeRoutes } from "./utils/enum";
import {
  getUserDashboardRoute,
  isAdmin,
  isMentor,
  isTechAdmin,
} from "./utils/auth-helpers";
import { getCachedSession } from "./utils/getCachedSession";

const protectedRoutes = [
  {
    route: RelativeRoutes.MENTOR_EVENTS,
    isAllowed: ({ session }: { session: any }) =>
      isMentor({ session }) || isAdmin({ session }),
  },
  {
    route: RelativeRoutes.MENTOR_HOMEPAGE,
    isAllowed: isMentor,
  },

  {
    route: RelativeRoutes.TECH_ADMIN_HOMEPAGE,
    isAllowed: isTechAdmin,
  },
];

function isRouteMatch(pathname: string, route: RelativeRoutes): boolean {
  return pathname === route || pathname.startsWith(`${route}/`);
}

export async function proxy(request: NextRequest) {
  const session = await getCachedSession();
  const pathname = request.nextUrl.pathname;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const matchedRoute = protectedRoutes.find(({ route }) =>
    isRouteMatch(pathname, route),
  );

  if (!matchedRoute) {
    return response;
  }

  if (!session) {
    return NextResponse.redirect(
      new URL(RelativeRoutes.LOGIN_PAGE, request.url),
    );
  }

  if (!matchedRoute.isAllowed({ session })) {
    const dashboardRoute =
      getUserDashboardRoute(session) ?? RelativeRoutes.LOGIN_PAGE;

    return NextResponse.redirect(new URL(dashboardRoute, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
