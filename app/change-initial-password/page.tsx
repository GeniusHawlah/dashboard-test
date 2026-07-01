import { db } from "@/lib/db";
import { getCachedSession } from "@/utils/getCachedSession";
import { getUserDashboardRoute } from "@/utils/auth-helpers";
import { RelativeRoutes } from "@/utils/enum";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import ChangeInitialPasswordForm from "./ChangeInitialPasswordForm";

export default function ChangeInitialPasswordPage() {
  return (
    <main className="flex min-h-dvh w-full items-center justify-center bg-bg_gray px-4 py-8">
      <section className="w-full max-w-md rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-7">
        <div className="space-y-1 text-center">
          <h1 className="text-xl font-semibold text-slate-950">
            Set New Password
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Create a private password before opening your dashboard.
          </p>
        </div>

        <ChangeInitialPasswordForm />
      </section>

      <Suspense>
        <InitialPasswordPageGuard />
      </Suspense>
    </main>
  );
}

async function InitialPasswordPageGuard() {
  const session = await getCachedSession();

  if (!session) {
    redirect(RelativeRoutes.LOGIN_PAGE);
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { isFirstLogin: true },
  });

  if (!user?.isFirstLogin) {
    redirect(getUserDashboardRoute(session) ?? RelativeRoutes.LOGIN_PAGE);
  }

  return null;
}
