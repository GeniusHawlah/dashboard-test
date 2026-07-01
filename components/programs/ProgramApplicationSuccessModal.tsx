"use client";

import { Button } from "@/components/ui/button";
import { globalStore } from "@/store/zustand/globalStore";
import { RelativeRoutes } from "@/utils/enum";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ProgramApplicationSuccessModal() {
  const closeModal = globalStore((state) => state.closeModal);

  return (
    <section className="mx-auto w-full max-w-md rounded-[28px] border border-emerald-100 bg-white p-5 shadow-[0_30px_80px_rgba(15,23,42,0.18)] sm:p-6">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
        <CheckCircle2 className="h-7 w-7" />
      </div>

      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-500">
        Application received
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-slate-950">
        Congratulations, your application is in
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Your program application was submitted successfully. The mentoring team
        has been notified and your dashboard is ready for the next step.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Button asChild className="h-12 w-full rounded-2xl text-sm font-semibold">
          <Link href={RelativeRoutes.DASHBOARD_HOMEPAGE} onClick={closeModal}>
            Go to Dashboard
          </Link>
        </Button>
        <Button
          variant="outline"
          className="h-12 w-full rounded-2xl border-slate-200 text-sm font-semibold text-slate-700"
          onClick={closeModal}
        >
          OK
        </Button>
      </div>
    </section>
  );
}
