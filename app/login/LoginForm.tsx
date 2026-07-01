"use client";

import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { type ChangeEvent, type FormEvent, useId, useState } from "react";

import { authStore } from "@/store/zustand/authStore";
import { globalStore } from "@/store/zustand/globalStore";
import { getDemoAccount } from "@/utils/demo-auth";
import { RelativeRoutes } from "@/utils/enum";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="mt-1 text-xs text-rose-600">{message}</p>;
}

export default function LoginForm() {
  const emailId = useId();
  const passwordId = useId();

  const generalLoading = globalStore((state) => state.generalLoading);
  const loginFormState = authStore((state) => state.loginFormState);
  const loginHandler = authStore((state) => state.loginHandler);
  const setLoginFormState = authStore((state) => state.setLoginFormState);
  const formErrors = loginFormState.error?.formErrors;

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });
  const [passwordVisible, setPasswordVisible] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = event.target;
    const nextValue = name === "email" ? value.toLowerCase() : value;

    setLoginFormState({});
    setLoginData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : nextValue,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const savedAccount = getDemoAccount();

    if (!savedAccount) {
      setLoginFormState({
        error: {
          message: "No account was found. Please sign up first.",
        },
      });
      return;
    }

    const emailMatches =
      savedAccount.email.trim().toLowerCase() ===
      loginData.email.trim().toLowerCase();
    const passwordMatches = savedAccount.password === loginData.password;

    if (!emailMatches || !passwordMatches) {
      setLoginFormState({
        error: {
          message: "The email or password does not match the account details.",
        },
      });
      return;
    }

    await loginHandler({
      ...loginData,
      email: loginData.email.trim().toLowerCase(),
    });
  }

  return (
    <section className="flex min-h-full items-center justify-center bg-white px-5 py-10 sm:px-8 lg:px-10">
      <div className="w-full max-w-[390px]">
        <div className="mb-10 text-center lg:text-left">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-[2.15rem]">
            Hello Again!
          </h1>
          <p className="mt-2 text-base text-slate-500">Welcome Back</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
              <input
                id={emailId}
                name="email"
                type="email"
                value={loginData.email}
                onChange={handleChange}
                autoComplete="email"
                placeholder="Email Address"
                aria-invalid={Boolean(formErrors?.email)}
                className="h-14 w-full rounded-full border border-slate-200 bg-white pl-12 pr-5 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-[#0c74e7] focus:shadow-[0_0_0_4px_rgba(12,116,231,0.08)]"
                required
              />
            </div>
            <FieldError message={formErrors?.email?.errors?.[0]} />
          </div>

          <div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
              <input
                id={passwordId}
                name="password"
                type={passwordVisible ? "text" : "password"}
                value={loginData.password}
                onChange={handleChange}
                autoComplete="current-password"
                placeholder="Password"
                aria-invalid={Boolean(formErrors?.password)}
                className="h-14 w-full rounded-full border border-slate-200 bg-white pl-12 pr-12 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-[#0c74e7] focus:shadow-[0_0_0_4px_rgba(12,116,231,0.08)]"
                required
              />
              <button
                type="button"
                onClick={() => setPasswordVisible((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                aria-label={passwordVisible ? "Hide password" : "Show password"}
              >
                {passwordVisible ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <FieldError message={formErrors?.password?.errors?.[0]} />
          </div>

          <button
            type="submit"
            disabled={
              !loginData.email.trim() ||
              !loginData.password.trim() ||
              generalLoading
            }
            className="mt-2 h-12 w-full rounded-full bg-[#0d7bf1] text-[15px] font-medium text-white shadow-[0_14px_32px_rgba(13,123,241,0.28)] transition hover:bg-[#0a6dd9] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {generalLoading ? "Logging in..." : "Login"}
          </button>

          <div
            aria-live="polite"
            className="min-h-5 text-center text-xs text-slate-500"
          >
            {loginFormState.error?.message ||
              loginFormState.success?.message ||
              ""}
          </div>

          <div className="pt-1 text-center">
            <Link
              href={RelativeRoutes.FORGOT_PASSWORD_PAGE}
              className="text-sm text-slate-500 transition hover:text-slate-900"
            >
              Forgot Password
            </Link>
          </div>

          <div className="text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href={RelativeRoutes.SIGNUP_PAGE}
              className="font-medium text-[#0d7bf1] transition hover:text-[#0a6dd9]"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
