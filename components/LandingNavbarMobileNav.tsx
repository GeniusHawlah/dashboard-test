"use client";

import { Icon } from "@iconify-icon/react";
import Link from "next/link";
import { useEffect } from "react";
import { authStore } from "@/store/zustand/authStore";
import { globalStore } from "@/store/zustand/globalStore";
import { RelativeRoutes } from "@/utils/enum";
import { getUserDashboardRoute } from "@/utils/auth-helpers";

const mobileNavItems = [
  { href: "/#program", label: "Program" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export default function LandingNavbarMobileNav({ session }: { session: any }) {
  const isLandingMobileSidebarExpanded = globalStore(
    (state) => state.isLandingMobileSidebarExpanded,
  );
  const setIsLandingMobileSidebarExpanded = globalStore(
    (state) => state.setIsLandingMobileSidebarExpanded,
  );
  const persistedDataReady = globalStore((state) => state.persistedDataReady);
  const logoutHandler = authStore((state) => state.logoutHandler);
  const open = isLandingMobileSidebarExpanded;
  const dashboardHref =
    (session && getUserDashboardRoute(session)) ?? RelativeRoutes.HOMEPAGE;
  const isAuthenticated = Boolean(session);

  useEffect(() => {
    if (!open) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    const originalHtmlScrollbarGutter =
      document.documentElement.style.scrollbarGutter;
    const originalBodyScrollbarGutter = document.body.style.scrollbarGutter;

    document.documentElement.style.scrollbarGutter = "stable";
    document.body.style.scrollbarGutter = "stable";
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsLandingMobileSidebarExpanded(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.documentElement.style.scrollbarGutter =
        originalHtmlScrollbarGutter;
      document.body.style.scrollbarGutter = originalBodyScrollbarGutter;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, setIsLandingMobileSidebarExpanded]);

  if (!persistedDataReady) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close menu"
        aria-hidden={!open}
        tabIndex={open ? 0 : -1}
        className={`fixed inset-0 z-40 bg-slate-950/20 transition-opacity duration-200 800:hidden ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsLandingMobileSidebarExpanded(false)}
      />

      <aside
        id="mobile-navigation"
        aria-hidden={!open}
        className={`fixed inset-y-0 right-0 z-50 h-dvh w-[min(88vw,22rem)] border-l border-slate-200 bg-white shadow-[0_24px_60px_-30px_rgba(15,23,42,0.35)] transition-transform duration-300 ease-out 800:hidden ${
          open
            ? "pointer-events-auto translate-x-0"
            : "pointer-events-none translate-x-full"
        }`}
      >
        <div className="global-pad flex h-18 items-center justify-end border-b border-slate-100">
          <button
            type="button"
            aria-label="Close navigation menu"
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-deep-blue transition hover:bg-slate-50"
            onClick={() => setIsLandingMobileSidebarExpanded(false)}
          >
            <Icon icon="lucide:x" className="text-3xl" />
          </button>
        </div>

        <div className="flex h-[calc(100dvh-5rem)] flex-col justify-between px-5 py-6">
          <nav className="flex flex-col gap-2">
            {mobileNavItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsLandingMobileSidebarExpanded(false)}
                className="flex items-center justify-between rounded-2xl px-4 py-3 text-base font-medium text-slate-800 transition hover:bg-slate-50"
              >
                <span>{item.label}</span>
                <Icon icon="solar:arrow-right-linear" className="text-lg" />
              </a>
            ))}
          </nav>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            {session ? (
              <>
                <p className="text-sm font-medium text-slate-500">
                  Welcome back.
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Jump into your dashboard or sign out from this device.
                </p>
                <Link
                  href={dashboardHref}
                  onClick={() => setIsLandingMobileSidebarExpanded(false)}
                  className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-full bg-pry-blue px-4 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={async () => {
                    setIsLandingMobileSidebarExpanded(false);
                    await logoutHandler();
                  }}
                  className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-red-600 transition hover:bg-slate-50"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-slate-500">
                  Ready to begin?
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Open the login page to continue into the mentorship platform.
                </p>
                <Link
                  href={RelativeRoutes.LOGIN_PAGE}
                  onClick={() => setIsLandingMobileSidebarExpanded(false)}
                  className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-full bg-pry-blue px-4 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
