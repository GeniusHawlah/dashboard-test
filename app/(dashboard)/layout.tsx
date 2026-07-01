import { db } from "@/lib/db";
import { getCachedSession } from "@/utils/getCachedSession";
import { RelativeRoutes } from "@/utils/enum";
import { isAdmin } from "@/utils/auth-helpers";
import { Suspense } from "react";
import Navbar from "@/components/nav/Navbar";
import SideNav from "@/components/nav/SideNav";
import SideNavSkeleton from "@/components/nav/SideNavSkeleton";
import { redirect } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      id="dashboard-layout-root"
      className="relative h-dvh overflow-hidden bg-slate-100 text-light_pry_text"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-8 h-64 w-64 rounded-full bg-white/60 blur-3xl" />
        <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-white/60 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-white/70 to-transparent" />
      </div>

      <div className="relative grid h-full min-h-0 w-full grid-cols-1 grid-rows-[4.5rem_minmax(0,1fr)] lg:grid-cols-[5rem_minmax(0,1fr)] lg:grid-rows-[4.5rem_minmax(0,1fr)]">
        <div className="hidden lg:col-start-1 lg:row-span-2 lg:block">
          <div className="flex h-full flex-col">
            <Suspense fallback={<SideNavSkeleton />}>
              <SideNav />
            </Suspense>
          </div>
        </div>

        <header
          id="dashboard-navbar"
          className="z-40 lg:col-start-2 lg:row-start-1"
        >
          <Navbar />
        </header>

        <div className="contents lg:hidden">
          <Suspense fallback={<SideNavSkeleton />}>
            <SideNav />
          </Suspense>
        </div>

        <main
          id="dashboard-content-scroll-container"
          className="min-w-0 min-h-0 overflow-y-auto overflow-x-hidden px-3 py-3 lg:col-start-2 lg:row-start-2 lg:px-4 lg:py-4"
        >
          <div className="rounded-[24px] border border-slate-200 bg-white/80 p-4 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-sm lg:p-5">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

async function RedirectFirstLogin() {
  const session = await getCachedSession();

  if (!session) return null;

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { isFirstLogin: true, role: true },
  });

  if (user?.isFirstLogin && isAdmin({ session, providedRole: user.role })) {
    redirect(RelativeRoutes.CHANGE_INITIAL_PASSWORD_PAGE);
  }

  return null;
}
