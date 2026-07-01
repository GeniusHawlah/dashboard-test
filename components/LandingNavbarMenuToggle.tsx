"use client";

import { Icon } from "@iconify-icon/react";
import { globalStore } from "@/store/zustand/globalStore";
import LandingNavbarMenuToggleSkeleton from "./LandingNavbarMenuToggleSkeleton";

export default function LandingNavbarMenuToggle() {
  const persistedDataReady = globalStore((s) => s.persistedDataReady);
  const isLandingMobileSidebarExpanded = globalStore(
    (s) => s.isLandingMobileSidebarExpanded,
  );
  const toggleLandingMobileSidebar = globalStore(
    (s) => s.toggleLandingMobileSidebar,
  );

  if (!persistedDataReady) {
    return <LandingNavbarMenuToggleSkeleton />;
  }

  return (
    <button
      type="button"
      aria-label={
        isLandingMobileSidebarExpanded ? "Close menu" : "Open menu"
      }
      aria-expanded={isLandingMobileSidebarExpanded}
      aria-controls="mobile-navigation"
      className="inline-flex h-7.5 w-7.5 shrink-0 cursor-pointer items-center justify-center rounded-full text-deep-blue transition hover:bg-slate-50 800:hidden!"
      onClick={toggleLandingMobileSidebar}
    >
      <Icon
        icon={isLandingMobileSidebarExpanded ? "lucide:x" : "lucide:menu"}
        className="text-3xl"
      />
    </button>
  );
}
