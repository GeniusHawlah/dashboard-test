"use client";

import { Button } from "@/components/ui/button";
import { authStore } from "@/store/zustand/authStore";
import { globalStore } from "@/store/zustand/globalStore";
import { RelativeRoutes } from "@/utils/enum";
import Link from "next/link";
import {
  type ChangeEvent,
  type SyntheticEvent,
  useId,
  useState,
} from "react";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="mt-1 text-xs text-rose-600">{message}</p>;
}

function ResetPasswordForm({
  initialEmail = "",
  initialCode = "",
}: {
  initialEmail?: string;
  initialCode?: string;
}) {
  const emailId = useId();
  const codeId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();

  const generalLoading = globalStore((state) => state.generalLoading);
  const resetPasswordFormState = authStore(
    (state) => state.resetPasswordFormState,
  );
  const resetPasswordHandler = authStore(
    (state) => state.resetPasswordHandler,
  );
  const setResetPasswordFormState = authStore(
    (state) => state.setResetPasswordFormState,
  );

  const [formData, setFormData] = useState({
    email: initialEmail.trim().toLowerCase(),
    code: initialCode.trim().toUpperCase(),
    password: "",
    confirmPassword: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setResetPasswordFormState({});
    setFormData((current) => ({
      ...current,
      [name]:
        name === "email"
          ? value.toLowerCase()
          : name === "code"
            ? value.toUpperCase()
            : value,
    }));
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    await resetPasswordHandler({
      email: formData.email.trim().toLowerCase(),
      code: formData.code.trim().toUpperCase(),
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });
  }

  const formErrors = resetPasswordFormState.error?.formErrors;
  const message =
    resetPasswordFormState.error?.message ||
    resetPasswordFormState.success?.message;

  const isDisabled =
    generalLoading ||
    !formData.email.trim() ||
    !formData.code.trim() ||
    !formData.password.trim() ||
    !formData.confirmPassword.trim();

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
          placeholder="Enter the email that received the code"
          aria-invalid={Boolean(formErrors?.email)}
          className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white"
          required
        />
        <FieldError message={formErrors?.email?.errors?.[0]} />
      </div>

      <div className="space-y-2">
        <label htmlFor={codeId} className="text-sm font-medium text-slate-900">
          Reset Code
        </label>
        <input
          id={codeId}
          name="code"
          type="text"
          value={formData.code}
          onChange={handleChange}
          autoComplete="one-time-code"
          inputMode="text"
          maxLength={8}
          placeholder="A1B2C3D4"
          aria-invalid={Boolean(formErrors?.code)}
          className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-center text-sm tracking-[0.32em] uppercase outline-none transition placeholder:tracking-normal placeholder:text-slate-400 focus:border-blue-500 focus:bg-white"
          required
        />
        <FieldError message={formErrors?.code?.errors?.[0]} />
      </div>

      <div className="space-y-2">
        <label
          htmlFor={passwordId}
          className="text-sm font-medium text-slate-900"
        >
          New Password
        </label>
        <div className="relative">
          <input
            id={passwordId}
            name="password"
            type={passwordVisible ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            placeholder="Enter a new password"
            aria-invalid={Boolean(formErrors?.password)}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white"
            required
          />
          <button
            type="button"
            onClick={() => setPasswordVisible((current) => !current)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
            aria-label={passwordVisible ? "Hide password" : "Show password"}
          >
            {passwordVisible ? "Hide" : "Show"}
          </button>
        </div>
        <FieldError message={formErrors?.password?.errors?.[0]} />
      </div>

      <div className="space-y-2">
        <label
          htmlFor={confirmPasswordId}
          className="text-sm font-medium text-slate-900"
        >
          Confirm New Password
        </label>
        <input
          id={confirmPasswordId}
          name="confirmPassword"
          type={passwordVisible ? "text" : "password"}
          value={formData.confirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
          placeholder="Repeat the new password"
          aria-invalid={Boolean(formErrors?.confirmPassword)}
          className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white"
          required
        />
        <FieldError message={formErrors?.confirmPassword?.errors?.[0]} />
      </div>

      <div
        id="reset-password-form-message"
        aria-live="polite"
        className={`min-h-6 text-sm ${
          resetPasswordFormState.success ? "text-emerald-600" : "text-rose-600"
        }`}
      >
        {message}
      </div>

      <Button
        type="submit"
        disabled={isDisabled}
        className="h-12 w-full rounded-2xl text-base font-semibold"
      >
        {generalLoading ? "Resetting..." : "Reset Password"}
      </Button>

      <div className="space-y-3 text-center text-sm text-slate-600">
        <Link
          href={RelativeRoutes.FORGOT_PASSWORD_PAGE}
          className="block font-semibold text-blue-600 transition hover:text-blue-700"
        >
          Need a new code?
        </Link>
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

export default ResetPasswordForm;
