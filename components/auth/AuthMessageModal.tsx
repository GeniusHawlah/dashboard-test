"use client";

import { Button } from "@/components/ui/button";
import { globalStore } from "@/store/zustand/globalStore";
import { RelativeRoutes } from "@/utils/enum";
import { CheckCircle2, Mail } from "lucide-react";
import Link from "next/link";

export type AuthMessageModalKind =
  | "verify-email-sent"
  | "account-not-verified"
  | "email-verified";

const MESSAGE_COPY: Record<
  AuthMessageModalKind,
  {
    eyebrow: string;
    title: string;
    body: string;
    icon: typeof Mail;
    iconClassName: string;
    primaryLabel: string;
    secondaryLabel: string;
  }
> = {
  "verify-email-sent": {
    eyebrow: "Registration started",
    title: "Your account is alsmost ready",
    body:
      "Registration started! We sent a verification link to the email you used when signing up. If you do not see it, check your spam or junk folder.",
    icon: Mail,
    iconClassName: "bg-amber-50 text-amber-600",
    primaryLabel: "Go to login",
    secondaryLabel: "OK",
  },
  "account-not-verified": {
    eyebrow: "Account check needed",
    title: "Verify your account to continue",
    body:
      "We found your account, but it still needs email verification before you can log in. We just sent a new verification link to your inbox so you can continue.",
    icon: Mail,
    iconClassName: "bg-amber-50 text-amber-600",
    primaryLabel: "Go to login",
    secondaryLabel: "OK",
  },
  "email-verified": {
    eyebrow: "Account verified",
    title: "Verification successful",
    body:
      "Your email is now verified. You will receive a mail whenever you mentorship application is approved.",
    icon: CheckCircle2,
    iconClassName: "bg-emerald-50 text-emerald-600",
    primaryLabel: "Go to login",
    secondaryLabel: "OK",
  },
};

export default function AuthMessageModal({
  kind,
}: {
  kind: AuthMessageModalKind;
}) {
  const closeModal = globalStore((state) => state.closeModal);
  const config = MESSAGE_COPY[kind];
  const Icon = config.icon;

  return (
    <section className="mx-auto w-full max-w-md rounded-[28px] border border-white/60 bg-white p-5 shadow-[0_30px_80px_rgba(15,23,42,0.18)] sm:p-6">
      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${config.iconClassName}`}>
        <Icon className="h-7 w-7" />
      </div>

      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
        {config.eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-slate-950">
        {config.title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">{config.body}</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Button
          asChild
          className="h-12 w-full rounded-2xl text-sm font-semibold"
        >
          <Link href={RelativeRoutes.LOGIN_PAGE} onClick={closeModal}>
            {config.primaryLabel}
          </Link>
        </Button>
        <Button
          variant="outline"
          className="h-12 w-full rounded-2xl border-slate-200 text-sm font-semibold text-slate-700"
          onClick={closeModal}
        >
          {config.secondaryLabel}
        </Button>
      </div>
    </section>
  );
}
