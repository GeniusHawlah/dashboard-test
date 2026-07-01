"use client";

import { globalStore } from "@/store/zustand/globalStore";
import { authStore } from "@/store/zustand/authStore";
import { Icon } from "@iconify-icon/react";

function LogoutButton() {
  const logoutHandler = authStore((s) => s.logoutHandler);
  const setIsDashboardMobileSidebarExpanded = globalStore(
    (state) => state.setIsDashboardMobileSidebarExpanded,
  );

  return (
    <button
      type="button"
      onPointerDown={(event) => {
        event.stopPropagation();
      }}
      onPointerUp={(event) => {
        event.stopPropagation();
      }}
      onClick={(event) => {
        event.stopPropagation();
        setIsDashboardMobileSidebarExpanded(false);
        logoutHandler();
      }}
      className="flex w-full cursor-pointer items-center gap-2 rounded-xl border border-white/10 px-3 py-3 text-base font-semibold text-white/90 duration-150 hover:bg-white/10 hover:text-white"
    >
      <Icon icon="solar:logout-outline" className="text-2xl font-normal" />
      <span>Logout</span>
    </button>
  );
}

export default LogoutButton;
