import { getUserDashboardRoute } from "@/utils/auth-helpers";
import { RelativeRoutes } from "@/utils/enum";
import { getCachedSession } from "@/utils/getCachedSession";
import { redirect } from "next/navigation";

async function NonAuthPageRedirect() {
  const session = (await getCachedSession()) || false;

  if (session) {
    redirect(getUserDashboardRoute(session) ?? RelativeRoutes.MENTEE_HOMEPAGE);
  }

  return null;
}

export default NonAuthPageRedirect;
