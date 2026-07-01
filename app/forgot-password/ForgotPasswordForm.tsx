"use client";

import { Button } from "@/components/ui/button";
import { RelativeRoutes } from "@/utils/enum";
import { authStore } from "@/store/zustand/authStore";
import { globalStore } from "@/store/zustand/globalStore";
import Link from "next/link";
import {
  type ChangeEvent,
  type SyntheticEvent,
  useEffect,
  useId,
  useState,
} from "react";

const RESEND_STORAGE_KEY = "profak:forgot-password-resend";
const RESEND_DELAY_SECONDS = 30;

type ResendCooldownRecord = {
  email: string;
  expiresAt: number;
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="mt-1 text-xs text-rose-600">{message}</p>;
}

function readStoredCooldown(): ResendCooldownRecord | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(RESEND_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as ResendCooldownRecord;

    if (!parsed.email || typeof parsed.expiresAt !== "number") {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function storeCooldown(record: ResendCooldownRecord) {
  window.localStorage.setItem(RESEND_STORAGE_KEY, JSON.stringify(record));
}

function clearCooldown() {
  window.localStorage.removeItem(RESEND_STORAGE_KEY);
}

function ForgotPasswordForm({ initialEmail = "" }: { initialEmail?: string }) {
  const emailId = useId();
  const generalLoading = globalStore((state) => state.generalLoading);
  const forgotPasswordFormState = authStore(
    (state) => state.forgotPasswordFormState,
  );
  const forgotPasswordHandler = authStore(
    (state) => state.forgotPasswordHandler,
  );
  const setForgotPasswordFormState = authStore(
    (state) => state.setForgotPasswordFormState,
  );

  const [formData, setFormData] = useState({
    email: initialEmail.trim().toLowerCase(),
  });
  const [cooldownEmail, setCooldownEmail] = useState("");
  const [cooldownExpiresAt, setCooldownExpiresAt] = useState<number | null>(
    null,
  );
  const [secondsLeft, setSecondsLeft] = useState(0);

  const normalizedEmail = formData.email.trim().toLowerCase();
  const cooldownApplies =
    Boolean(cooldownEmail) &&
    cooldownEmail === normalizedEmail &&
    secondsLeft > 0;

  useEffect(() => {
    const storedCooldown = readStoredCooldown();

    if (!storedCooldown) {
      return;
    }

    const remainingSeconds = Math.max(
      0,
      Math.ceil((storedCooldown.expiresAt - Date.now()) / 1000),
    );

    if (remainingSeconds <= 0) {
      clearCooldown();
      return;
    }

    setCooldownEmail(storedCooldown.email);
    setCooldownExpiresAt(storedCooldown.expiresAt);
    setSecondsLeft(remainingSeconds);
  }, []);

  useEffect(() => {
    if (!cooldownExpiresAt) {
      return;
    }

    const remainingSeconds = Math.max(
      0,
      Math.ceil((cooldownExpiresAt - Date.now()) / 1000),
    );

    setSecondsLeft(remainingSeconds);
  }, [cooldownExpiresAt]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      setCooldownExpiresAt(null);
      clearCooldown();
      return;
    }

    const timer = window.setTimeout(() => {
      setSecondsLeft((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [secondsLeft]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setForgotPasswordFormState({});
    setFormData((current) => ({
      ...current,
      [name]: name === "email" ? value.toLowerCase() : value,
    }));
  }

  function startCooldown(email: string) {
    const expiresAt = Date.now() + RESEND_DELAY_SECONDS * 1000;

    setCooldownEmail(email);
    setCooldownExpiresAt(expiresAt);
    setSecondsLeft(RESEND_DELAY_SECONDS);
    storeCooldown({
      email,
      expiresAt,
    });
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const email = normalizedEmail;

    if (!email) {
      return;
    }

    const success = await forgotPasswordHandler({
      email,
    });

    if (success) {
      startCooldown(email);
    }
  }

  const formErrors = forgotPasswordFormState.error?.formErrors;
  const message =
    forgotPasswordFormState.error?.message ||
    forgotPasswordFormState.success?.message;

  const buttonLabel = cooldownApplies
    ? `Resend Code in ${secondsLeft}s`
    : cooldownEmail
      ? "Resend Code"
      : "Send Code";

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label htmlFor={emailId} className="text-sm font-medium text-slate-900">
          Email Address
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          placeholder="Enter the email on your account"
          aria-invalid={Boolean(formErrors?.email)}
          className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white"
          required
        />
        <FieldError message={formErrors?.email?.errors?.[0]} />
      </div>

      <div
        id="forgot-password-form-message"
        aria-live="polite"
        className={`min-h-6 text-sm ${
          forgotPasswordFormState.success ? "text-emerald-600" : "text-rose-600"
        }`}
      >
        {message}
      </div>

      <Button
        type="submit"
        disabled={generalLoading || !normalizedEmail || cooldownApplies}
        className="h-12 w-full rounded-2xl text-base font-semibold"
      >
        {generalLoading ? "Sending..." : buttonLabel}
      </Button>

      <div className="space-y-3 text-center text-sm text-slate-600">
        {forgotPasswordFormState.success && (
          <Link
            href={`${RelativeRoutes.RESET_PASSWORD_PAGE}?email=${encodeURIComponent(
              normalizedEmail,
            )}`}
            className="font-semibold text-blue-600 transition hover:text-blue-700"
          >
            I have my code, continue to reset password
          </Link>
        )}

        <Link
          href={RelativeRoutes.LOGIN_PAGE}
          className="block font-semibold text-blue-600 transition hover:text-blue-700"
        >
          Back to login
        </Link>
      </div>
    </form>
  );
}

export default ForgotPasswordForm;
