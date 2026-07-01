import { Bell, Grid2x2, Search, SquarePlus, SlidersHorizontal } from "lucide-react";
import { Suspense } from "react";

import CurrentUserWrapper from "./CurrentUserWrapper";
import MobileSidebarToggle from "./MobileSidebarToggle";

function Navbar() {
  return (
    <div className="flex h-full items-center justify-between gap-3 overflow-visible border-b border-slate-200 bg-white/95 px-3 shadow-[0_10px_30px_-24px_rgba(30,64,175,0.45)] backdrop-blur-md lg:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <MobileSidebarToggle />
        <label className="flex h-11 min-w-0 max-w-[22rem] flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-400 shadow-[0_1px_0_rgba(15,23,42,0.03)]">
          <Search className="h-4 w-4 shrink-0" />
          <input
            type="search"
            placeholder="Search by User ID, User Name, Date etc"
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </label>

        <button
          type="button"
          aria-label="Filter search"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-[0_1px_0_rgba(15,23,42,0.03)] transition hover:bg-slate-50"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          aria-label="Create new"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#0d7bf1]/30 bg-[#0d7bf1]/10 text-[#0d7bf1] transition hover:bg-[#0d7bf1]/15"
        >
          <SquarePlus className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Notifications"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
        >
          <Bell className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Apps"
          className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 sm:flex"
        >
          <Grid2x2 className="h-4 w-4" />
        </button>

        <Suspense>
          <CurrentUserWrapper />
        </Suspense>
      </div>
    </div>
  );
}

export default Navbar;
