import { redirect } from "next/navigation";
import { getUserDashboardRoute } from "@/utils/auth-helpers";
import { RelativeRoutes } from "@/utils/enum";
import { getCachedSession } from "@/utils/getCachedSession";

async function RedirectUnauthorizedRole({
  allowedRole,
}: {
  allowedRole: string | readonly string[];
}) {
  const session = await getCachedSession();

  if (!session) {
    redirect(RelativeRoutes.LOGIN_PAGE);
  }

  const sessionRoles = Array.isArray(session?.user?.role)
    ? session.user.role
    : session?.user?.role
      ? [session.user.role]
      : [];
  const allowedRoles = Array.isArray(allowedRole) ? allowedRole : [allowedRole];

  if (!sessionRoles.some((role) => allowedRoles.includes(role))) {
    redirect(getUserDashboardRoute(session) ?? RelativeRoutes.LOGIN_PAGE);
  }

  return null;
}

export default RedirectUnauthorizedRole;
