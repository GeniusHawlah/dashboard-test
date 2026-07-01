"use client";

import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { useEffect, useRef, useState } from "react";

interface DateAndProgramInfoPanelProps {
  todayLabel: string;
  programLabel: string;
  programValue: string;
  programEndDate?: string;
}

export default function DateAndProgramInfoPanel({
  todayLabel,
  programLabel,
  programValue,
  programEndDate,
}: DateAndProgramInfoPanelProps) {
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);
  const mobileDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent | TouchEvent) {
      if (
        showMobileDropdown &&
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target as Node)
      ) {
        setShowMobileDropdown(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowMobileDropdown(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showMobileDropdown]);

  const expandedContent = (
    <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-950/12 ring-1 ring-slate-200/80">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-1.5">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white">
          <Icon icon="solar:clock-circle-outline" className="text-sm" />
        </span>

        <div className="min-w-0">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Today
          </p>
          <p className="truncate text-xs font-semibold text-slate-800">
            {todayLabel}
          </p>
        </div>
      </div>

      <div className="mt-1.5 rounded-lg border border-slate-200 bg-white px-2 py-1.5 shadow-lg shadow-slate-950/8">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-slate-400">
            {programLabel}
          </span>
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
        </div>

        <p className="mt-0.5 text-[11px] font-semibold text-slate-700 sm:text-sm">
          {programValue}
        </p>

        {programEndDate && (
          <div className="mt-1 flex flex-wrap gap-1 text-[0.56rem] font-medium text-slate-500">
            <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-slate-600">
              Ends {programEndDate}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden min-w-0 items-center lg:flex lg:h-16">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white">
            <Icon icon="solar:calendar-outline" className="text-lg" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Today
            </p>
            <p className="truncate text-sm font-semibold text-slate-700">
              {todayLabel}
            </p>
          </div>

          <div className="h-9 w-px bg-slate-200" />

          <div className="min-w-0">
            <p className="truncate text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-slate-400">
              {programLabel}
            </p>
            <p className="truncate text-sm font-semibold text-slate-700">
              {programValue}
            </p>
          </div>
        </div>
      </div>

      <div
        ref={mobileDropdownRef}
        className="relative z-[120] flex min-w-0 items-center lg:hidden"
      >
        <button
          type="button"
          onClick={() => setShowMobileDropdown((current) => !current)}
          aria-label="Toggle date and program details"
          aria-expanded={showMobileDropdown}
          className="relative z-[120] flex h-9 max-w-40 items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2 text-slate-700 shadow-none transition hover:bg-white sm:max-w-52 sm:gap-1.5 sm:rounded-full sm:bg-white sm:px-2.5 sm:shadow-sm"
        >
          <span className="hidden h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white sm:flex">
            <Icon icon="solar:calendar-outline" className="text-sm" />
          </span>
          <span className="min-w-0 truncate text-[10px] font-semibold sm:text-[11px]">
            {todayLabel}
          </span>
          <Icon
            icon={showMobileDropdown ? "mingcute:up-line" : "mingcute:down-line"}
            className="shrink-0 text-sm text-slate-500 sm:text-base"
          />
        </button>

        {showMobileDropdown && (
          <div className="absolute left-0 top-full z-[130] mt-1.5 w-60 max-w-[calc(100vw-1rem)]">
            {expandedContent}
          </div>
        )}
      </div>
    </>
  );
}
