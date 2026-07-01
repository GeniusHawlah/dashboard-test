"use client";

import Link from "next/link";
import { globalStore } from "@/store/zustand/globalStore";
import { RelativeRoutes } from "@/utils/enum";
import LandingNavbarGetStartedSkeleton from "./LandingNavbarGetStartedSkeleton";

export default function LandingNavbarGetStarted() {
  const persistedDataReady = globalStore((s) => s.persistedDataReady);

  if (!persistedDataReady) {
    return <LandingNavbarGetStartedSkeleton />;
  }

  return (
    <Link
      href={RelativeRoutes.LOGIN_PAGE}
      className="inline-flex h-9 items-center justify-center rounded-lg bg-pry-blue px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-900 sm:h-10"
    >
      Get Started
    </Link>
  );
}
