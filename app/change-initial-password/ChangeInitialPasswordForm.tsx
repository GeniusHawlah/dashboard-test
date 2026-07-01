"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authStore } from "@/store/zustand/authStore";
import { globalStore } from "@/store/zustand/globalStore";
import { Icon } from "@iconify-icon/react";
import { useState } from "react";

function fieldError(message?: string) {
  if (!message) return null;

  return <p className="text-[11px] text-red-600">{message}</p>;
}

export default function ChangeInitialPasswordForm() {
  const generalLoading = globalStore((s) => s.generalLoading);
  const initialPasswordFormState = authStore(
    (s) => s.initialPasswordFormState,
  );
  const changeInitialPasswordHandler = authStore(
    (s) => s.changeInitialPasswordHandler,
  );
  const [form, setForm] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  function updateField(name: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit() {
    await changeInitialPasswordHandler(form);
  }

  const isDisabled =
    generalLoading || Object.values(form).some((value) => value.trim() === "");
  const formErrors = initialPasswordFormState.error?.formErrors || {};
  const message =
    initialPasswordFormState.error?.message ||
    initialPasswordFormState.success?.message;

  return (
    <form action={handleSubmit} className="mt-6 space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="newPassword" className="text-xs font-medium sm:text-sm">
          New Password
        </label>
        <div className="relative">
          <Input
            id="newPassword"
            name="newPassword"
            value={form.newPassword}
            type={isPasswordVisible ? "text" : "password"}
            autoComplete="new-password"
            onChange={(event) => updateField("newPassword", event.target.value)}
            className="h-10 pr-10 text-sm"
          />
          <button
            type="button"
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-3 flex -translate-y-1/2 text-slate-500"
            onClick={() => setIsPasswordVisible((current) => !current)}
          >
            <Icon
              icon={isPasswordVisible ? "ri:eye-off-fill" : "ion:eye"}
              className="text-base"
            />
          </button>
        </div>
        {fieldError(formErrors.newPassword?.errors?.[0])}
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="confirmNewPassword"
          className="text-xs font-medium sm:text-sm"
        >
          Repeat New Password
        </label>
        <Input
          id="confirmNewPassword"
          name="confirmNewPassword"
          value={form.confirmNewPassword}
          type={isPasswordVisible ? "text" : "password"}
          autoComplete="new-password"
          onChange={(event) =>
            updateField("confirmNewPassword", event.target.value)
          }
          className="h-10 text-sm"
        />
        {fieldError(formErrors.confirmNewPassword?.errors?.[0])}
      </div>

      {message && (
        <p
          className={`text-center text-xs ${
            initialPasswordFormState.success ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <Button type="submit" disabled={isDisabled} className="h-10 w-full">
        {generalLoading ? "Setting Password..." : "Set Password"}
      </Button>
    </form>
  );
}
