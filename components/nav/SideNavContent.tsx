"use client";

import { globalStore } from "@/store/zustand/globalStore";
import { NavItemsInterface } from "@/utils/types";
import { useEffect } from "react";
import NavItem from "./NavItem";

export default function SideNavContent({
  navItems,
}: {
  navItems: NavItemsInterface[];
}) {
  const isDashboardMobileSidebarExpanded = globalStore(
    (state) => state.isDashboardMobileSidebarExpanded,
  );
  const setIsDashboardMobileSidebarExpanded = globalStore(
    (state) => state.setIsDashboardMobileSidebarExpanded,
  );

  useEffect(() => {
    if (!isDashboardMobileSidebarExpanded) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsDashboardMobileSidebarExpanded(false);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isDashboardMobileSidebarExpanded, setIsDashboardMobileSidebarExpanded]);

  return (
    <>
      {isDashboardMobileSidebarExpanded && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-[60] bg-slate-950/30 backdrop-blur-[1px] lg:hidden"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setIsDashboardMobileSidebarExpanded(false);
          }}
        />
      )}

      <aside
        className={`group/sidebar fixed top-0 left-0 z-[70] flex h-dvh w-20 max-w-[calc(100vw-1rem)] flex-col overflow-hidden border-r border-slate-200 bg-white text-slate-900 shadow-2xl shadow-slate-950/10 transition-transform duration-300 lg:relative lg:z-auto lg:h-full lg:w-full lg:max-w-none lg:translate-x-0 lg:shadow-none ${
          isDashboardMobileSidebarExpanded
            ? "translate-x-0"
            : "pointer-events-none -translate-x-full lg:pointer-events-auto"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex h-18 shrink-0 items-center justify-center border-b border-slate-200 px-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0d7bf1] text-sm font-semibold text-white shadow-[0_12px_24px_rgba(13,123,241,0.26)]">
            P
          </div>
        </div>

        <div className="sidebar-scrollbar flex flex-1 flex-col items-center gap-3 overflow-y-auto px-2 py-4 lg:py-5">
          {navItems.map((item) => (
            <NavItem
              slug={item.slug}
              icon={item.icon}
              title={item.title}
              key={item.title}
            />
          ))}
        </div>
      </aside>
    </>
  );
}
