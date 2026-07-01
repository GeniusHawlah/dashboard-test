import Link from "next/link";
import { RelativeRoutes } from "@/utils/enum";
import { getCachedSession } from "@/utils/getCachedSession";
import { getUserDashboardRoute } from "@/utils/auth-helpers";

export default async function HeroActions() {
  const session = await getCachedSession();
  const isLoggedIn = Boolean(session);
  const dashboardHref =
    (session && getUserDashboardRoute(session)) ?? RelativeRoutes.DASHBOARD_HOMEPAGE;

  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 800:justify-start">
      {!isLoggedIn ? (
        <>
          <Link
            href={RelativeRoutes.SIGNUP_PAGE}
            className="inline-flex h-8 items-center justify-center rounded-md bg-pry-blue px-3 text-xs font-semibold whitespace-nowrap text-white shadow-sm transition hover:bg-blue-700 sm:h-10 sm:px-5 sm:text-base"
          >
            Apply as a student
          </Link>

          <Link
            href={RelativeRoutes.SIGNUP_PAGE}
            className="inline-flex h-8 items-center justify-center rounded-md bg-blue-400 px-3 text-xs font-semibold whitespace-nowrap text-white shadow-sm transition hover:bg-blue-500 sm:h-10 sm:px-5 sm:text-base"
          >
            Be a Mentor
          </Link>
        </>
      ) : (
        <Link
          href={dashboardHref}
          className="inline-flex h-8 items-center justify-center rounded-md bg-pry-blue px-3 text-xs font-semibold whitespace-nowrap text-white shadow-sm transition hover:bg-blue-700 sm:h-10 sm:px-5 sm:text-base"
        >
          Go to Dashboard
        </Link>
      )}

      <Link
        href="#contact"
        className="basis-full 390:basis-auto inline-flex h-8 items-center justify-center rounded-md border border-slate-900 bg-white px-3 text-xs font-semibold whitespace-nowrap text-slate-950 transition hover:bg-slate-50 sm:h-10 sm:px-5 sm:text-base"
      >
        Support the Foundation
      </Link>
    </div>
  );
}
