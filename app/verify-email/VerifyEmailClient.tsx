"use client";

import AuthMessageModal from "@/components/auth/AuthMessageModal";
import { Button } from "@/components/ui/button";
import { EMAIL_NOT_VERIFIED_ERROR_MESSAGE } from "@/utils/constants";
import { RelativeRoutes } from "@/utils/enum";
import { guardError } from "@/utils/error-helpers";
import { globalStore } from "@/store/zustand/globalStore";
import { CheckCircle2, Loader2, MailX } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type VerifyState = "loading" | "success" | "error";

function getFriendlyVerificationErrorMessage(error: unknown) {
  const message = guardError(error);

  if (
    message === "invalid_token" ||
    message === "token_expired" ||
    message === "user_not_found" ||
    message === "unauthorized"
  ) {
    return "This verification link is invalid or has expired. Please go back to login and request a new verification email.";
  }

  return message || EMAIL_NOT_VERIFIED_ERROR_MESSAGE;
}

export default function VerifyEmailClient({ token }: { token: string }) {
  const router = useRouter();
  const [state, setState] = useState<VerifyState>("loading");
  const [message, setMessage] = useState("Verifying your email address...");

  useEffect(() => {
    let active = true;

    async function verify() {
      if (!token) {
        setState("error");
        setMessage("The verification link is missing a token.");
        return;
      }

      const response = await fetch(
        `/api/auth/verify-email?token=${encodeURIComponent(token)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const payload = await response.json().catch(() => null);
      const error = response.ok
        ? null
        : (payload?.error?.message ?? payload?.message ?? payload?.error);

      if (!active) return;

      if (error) {
        setState("error");
        setMessage(getFriendlyVerificationErrorMessage(error));
        return;
      }

      globalStore.getState().openModal(
        <AuthMessageModal kind="email-verified" />,
        {
          size: "md",
        },
      );
      setState("success");
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          router.replace(RelativeRoutes.LOGIN_PAGE);
        });
      });
    }

    void verify();

    return () => {
      active = false;
    };
  }, [router, token]);

  if (state === "error") {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <MailX className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            Email verification failed
          </h1>
          <p className="text-sm leading-7 text-slate-600">{message}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            asChild
            className="h-12 rounded-2xl px-6 text-sm font-semibold"
          >
          <Link href={RelativeRoutes.LOGIN_PAGE}>Go to login</Link>
        </Button>
        <Link
          href={RelativeRoutes.SIGNUP_PAGE}
          className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Create account again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        {state === "success" ? (
          <CheckCircle2 className="h-8 w-8" />
        ) : (
          <Loader2 className="h-8 w-8 animate-spin" />
        )}
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
          {state === "success" ? "Email verified" : "Verifying email"}
        </h1>
        <p className="text-sm leading-7 text-slate-600">{message}</p>
      </div>

      {state === "success" ? (
        <p className="text-sm text-slate-500">
          Redirecting you to the welcome page...
        </p>
      ) : (
        <p className="text-sm text-slate-500">
          Please keep this page open while we finish checking your link.
        </p>
      )}
    </div>
  );
}
