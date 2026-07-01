"use client";

import DefaultDP from "@/public/images/default_dp.webp";
import { authStore } from "@/store/zustand/authStore";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import Image from "next/image";
import { BiLogOut } from "react-icons/bi";
import { getPrimaryUserTechnicalRoleLabel } from "@/utils/auth-helpers";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ValidImage from "../ValidImage";

function CurrentUser({
  session,
}: {
  session: {
    user: {
      firstName: string;
      lastName: string;
      email: string;
      passport?: string | null;
      role?: string | string[];
    };
  };
}) {
  const logoutHandler = authStore((state) => state.logoutHandler);

  const initials = `${session.user.firstName.charAt(0)}${session.user.lastName.charAt(0)}`;
  const roleLabel = getPrimaryUserTechnicalRoleLabel({ session });

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex h-12 shrink-0 cursor-pointer items-center gap-2 rounded-2xl bg-white px-2.5 py-1.5 text-left shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition hover:shadow-[0_10px_28px_rgba(15,23,42,0.08)]"
          aria-label="Open account menu"
        >
          <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-slate-100 sm:h-10 sm:w-10">
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
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pry-blue text-xs font-bold text-white sm:h-10 sm:w-10 sm:text-sm">
                {initials}
              </div>
            )}
          </div>

          <div className="hidden min-w-0 flex-1 sm:block">
            <p className="truncate text-sm font-semibold leading-none text-slate-950">
              {session.user.firstName} {session.user.lastName}
            </p>
            <p className="truncate text-xs font-medium text-slate-500">
              {roleLabel}
            </p>
          </div>

          <Icon
            icon="mingcute:down-line"
            className="text-lg text-slate-500"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-72 bg-white p-3 shadow-2xl shadow-slate-300/30"
      >
        <div className="flex items-center gap-x-3 rounded-2xl bg-slate-50 p-2.5">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-white">
            {session.user.passport ? (
              <Image
                src={session.user.passport}
                alt="Profile Picture"
                fill
                sizes="(max-width: 640px) 36px, 40px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pry-blue text-xs font-bold text-white">
                {initials}
              </div>
            )}
          </div>

          <div className="min-w-0 space-y-0.5">
            <p className="truncate text-sm font-semibold leading-none text-slate-950">
              {session.user.firstName} {session.user.lastName}
            </p>
            <p className="truncate text-xs font-medium text-slate-500">
              {roleLabel}
            </p>
            <p className="truncate text-xs text-slate-400">
              {session.user.email}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator className="my-3" />

        <DropdownMenuItem
          onClick={() => logoutHandler()}
          className="gap-x-2 rounded-xl px-3 py-2.5 text-sm text-red-600 focus:text-red-600"
        >
          <BiLogOut className="text-base" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default CurrentUser;
