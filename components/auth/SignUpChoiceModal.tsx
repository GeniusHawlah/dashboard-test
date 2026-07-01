"use client";

import { Button } from "@/components/ui/button";
import { globalStore } from "@/store/zustand/globalStore";
import { RelativeRoutes } from "@/utils/enum";
import Link from "next/link";

export default function SignUpChoiceModal() {
  const closeModal = globalStore((state) => state.closeModal);

  return (
    <section className="mx-auto w-full max-w-md rounded-[28px] border border-white/60 bg-white p-5 shadow-[0_30px_80px_rgba(15,23,42,0.18)] sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
        Sign up as
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-slate-950">
        Choose your path
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Pick the account type that matches how you want to join the platform.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Button asChild className="h-12 w-full rounded-2xl text-sm font-semibold">
          <Link href={RelativeRoutes.MENTEE_SIGNUP_PAGE} onClick={closeModal}>
            As Mentee
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-12 w-full rounded-2xl border-slate-200 text-sm font-semibold text-slate-700"
        >
          <Link href={RelativeRoutes.MENTOR_SIGNUP_PAGE} onClick={closeModal}>
            As Mentor
          </Link>
        </Button>
      </div>

      <button
        type="button"
        onClick={closeModal}
        className="mt-4 w-full rounded-2xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50"
      >
        Maybe later
      </button>
    </section>
  );
}
