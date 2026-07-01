"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@iconify-icon/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authStore } from "@/store/zustand/authStore";
import { globalStore } from "@/store/zustand/globalStore";
import ValidImage from "./ValidImage";
import DefaultDP from "@/public/images/default_dp.webp";
import {
  getPrimaryUserTechnicalRoleLabel,
  getUserDashboardRoute,
} from "@/utils/auth-helpers";
import { RelativeRoutes } from "@/utils/enum";
import LandingNavbarUserMenuSkeleton from "./LandingNavbarUserMenuSkeleton";

type SessionData = {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    role?: string | string[];
    passport?: string | null;
  };
};

export default function LandingNavbarUserMenu({
  session,
}: {
  session: SessionData;
}) {
  const router = useRouter();
  const persistedDataReady = globalStore((s) => s.persistedDataReady);
  const logoutHandler = authStore((s) => s.logoutHandler);
  const dashboardHref =
    getUserDashboardRoute(session) ?? RelativeRoutes.HOMEPAGE;
  const initials = `${session.user.firstName.charAt(0)}${session.user.lastName.charAt(0)}`;
  const roleLabel = getPrimaryUserTechnicalRoleLabel({ session });

  if (!persistedDataReady) {
    return <LandingNavbarUserMenuSkeleton />;
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open account menu"
          className="flex h-9 items-center gap-2 cursor-pointer bg-transparent px-2 transition sm:h-10 sm:px-2.5"
        >
          <span className="relative flex size-8 shrink-0 overflow-hidden rounded-full border border-pry-blue bg-slate-100 sm:size-9">
            {session.user.passport ? (
              <ValidImage
                src={session.user.passport}
                fallbackSrc={DefaultDP}
                alt="Profile picture"
                fill
                sizes="36px"
                className="object-cover"
              />
            ) : (
              <span className="flex size-full items-center justify-center bg-pry-blue text-xs font-semibold text-white">
                {initials}
              </span>
            )}
          </span>

          <Icon icon="mingcute:down-line" className="text-xl text-slate-500" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 border border-slate-200 bg-white p-2.5 shadow-2xl shadow-slate-300/30 sm:w-72 sm:p-3"
      >
        <div className="flex items-center gap-x-2.5">
          <div className="relative h-9 w-9 overflow-hidden rounded-full bg-white sm:h-10 sm:w-10">
            {session.user.passport ? (
              <ValidImage
                src={session.user.passport}
                fallbackSrc={DefaultDP}
                alt="Profile Picture"
                fill
                sizes="(max-width: 640px) 36px, 40px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pry-blue text-xs font-bold text-white sm:h-10 sm:w-10">
                {initials}
              </div>
            )}
          </div>

          <div className="min-w-0 space-y-0.5">
            <p className="truncate text-sm font-semibold leading-none sm:text-base">
              {session.user.firstName} {session.user.lastName}
            </p>
            <p className="text-xs font-medium text-slate-500">{roleLabel}</p>
            <p className="truncate text-xs text-slate-400">
              {session.user.email}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator className="my-1.5" />

        <DropdownMenuItem
          onClick={() => router.push(dashboardHref)}
          className="cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-slate-700"
        >
          Dashboard
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => void logoutHandler()}
          className="cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-red-600 focus:text-red-600"
        >
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
