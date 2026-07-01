"use client";

import { globalStore } from "@/store/zustand/globalStore";
import { NavItemsInterface } from "@/utils/types";
import { Icon } from "@iconify-icon/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const DASHBOARD_SCROLL_CONTAINER_ID = "dashboard-content-scroll-container";

function NavItem({ icon, title, slug }: NavItemsInterface) {
  const currentPath = usePathname();
  const setIsDashboardMobileSidebarExpanded = globalStore(
    (state) => state.setIsDashboardMobileSidebarExpanded,
  );
  const href = `/${slug}`;
  const isActive = currentPath.startsWith("/dashboard") && title === "Dashboard";

  return (
    <Link
      href={href}
      aria-label={title}
      title={title}
      onClick={(event) => {
        event.stopPropagation();

        const scrollContainer = document.getElementById(
          DASHBOARD_SCROLL_CONTAINER_ID,
        );

        setIsDashboardMobileSidebarExpanded(false);
        scrollContainer?.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }}
    >
      <span
        className={`group/item flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border text-slate-500 duration-150 ${
          isActive
            ? "border-[#0d7bf1]/20 bg-[#eef5ff] text-[#0d7bf1] shadow-[0_10px_24px_rgba(13,123,241,0.14)] ring-1 ring-[#0d7bf1]/10"
            : "border-transparent bg-transparent hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
        }`}
      >
        <Icon icon={icon} className="text-[1.15rem] font-normal" />
      </span>
    </Link>
  );
}

export default NavItem;
