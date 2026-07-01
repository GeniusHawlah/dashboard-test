"use client";

import { globalStore } from "@/store/zustand/globalStore";
import { Icon } from "@iconify-icon/react";

export default function MobileSidebarToggle() {
  const isDashboardMobileSidebarExpanded = globalStore(
    (state) => state.isDashboardMobileSidebarExpanded,
  );
  const toggleDashboardMobileSidebar = globalStore(
    (state) => state.toggleDashboardMobileSidebar,
  );

  return (
    <button
      type="button"
      onClick={toggleDashboardMobileSidebar}
      aria-label={
        isDashboardMobileSidebarExpanded
          ? "Close navigation menu"
          : "Open navigation menu"
      }
      aria-pressed={isDashboardMobileSidebarExpanded}
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
    >
      <Icon
        icon={
          isDashboardMobileSidebarExpanded
            ? "solar:close-circle-outline"
            : "solar:hamburger-menu-outline"
        }
        className="text-[1.15rem]"
      />
    </button>
  );
}
