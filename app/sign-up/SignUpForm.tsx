"use client";

import { Eye, EyeOff, ImagePlus, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { type ChangeEvent, type FormEvent, useId, useState } from "react";
import { UserRole } from "@prisma/client";

import { authStore } from "@/store/zustand/authStore";
import { globalStore } from "@/store/zustand/globalStore";
import { RelativeRoutes } from "@/utils/enum";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="mt-1 text-xs text-rose-600">{message}</p>;
}

export default function SignUpForm() {
  const firstNameId = useId();
  const lastNameId = useId();
  const emailId = useId();
  const passportId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();

  const generalLoading = globalStore((state) => state.generalLoading);
  const signUpFormState = authStore((state) => state.signUpFormState);
  const signUpHandler = authStore((state) => state.signUpHandler);
  const setSignUpFormState = authStore((state) => state.setSignUpFormState);
  const formErrors = signUpFormState.error?.formErrors;

  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    role: UserRole.ADMIN,
    passport: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setSignUpFormState({});
    setSignupData((prev) => ({
      ...prev,
      [name]: name === "email" ? value.toLowerCase() : value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await signUpHandler({
      ...signupData,
      firstName: signupData.firstName.trim(),
      lastName: signupData.lastName.trim(),
      role: UserRole.ADMIN,
      passport: signupData.passport.trim(),
      email: signupData.email.trim().toLowerCase(),
    });
  }

  return (
    <section className="flex min-h-full items-center justify-center bg-white px-5 py-10 sm:px-8 lg:px-10">
      <div className="w-full max-w-[390px]">
        <div className="mb-10 text-center lg:text-left">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-[2.15rem]">
            Create Account
          </h1>
          <p className="mt-2 text-base text-slate-500">
            Fill the form and we&apos;ll explain what a real signup would do.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <div className="relative">
              <ImagePlus className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
              <input
                id={passportId}
                name="passport"
                type="url"
                value={signupData.passport}
                onChange={handleChange}
                autoComplete="off"
                placeholder="Profile Picture URL"
                aria-invalid={Boolean(formErrors?.passport)}
                className="h-14 w-full rounded-full border border-slate-200 bg-white pl-12 pr-5 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-[#0c74e7] focus:shadow-[0_0_0_4px_rgba(12,116,231,0.08)]"
              />
            </div>
            <FieldError message={formErrors?.passport?.errors?.[0]} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <div className="relative">
                <User className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
                <input
                  id={firstNameId}
                  name="firstName"
                  type="text"
                  value={signupData.firstName}
                  onChange={handleChange}
                  autoComplete="given-name"
                  placeholder="First Name"
                  aria-invalid={Boolean(formErrors?.firstName)}
                  className="h-14 w-full rounded-full border border-slate-200 bg-white pl-12 pr-5 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-[#0c74e7] focus:shadow-[0_0_0_4px_rgba(12,116,231,0.08)]"
                  required
                />
              </div>
              <FieldError message={formErrors?.firstName?.errors?.[0]} />
            </div>

            <div>
              <div className="relative">
                <User className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
                <input
                  id={lastNameId}
                  name="lastName"
                  type="text"
                  value={signupData.lastName}
                  onChange={handleChange}
                  autoComplete="family-name"
                  placeholder="Last Name"
                  aria-invalid={Boolean(formErrors?.lastName)}
                  className="h-14 w-full rounded-full border border-slate-200 bg-white pl-12 pr-5 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-[#0c74e7] focus:shadow-[0_0_0_4px_rgba(12,116,231,0.08)]"
                  required
                />
              </div>
              <FieldError message={formErrors?.lastName?.errors?.[0]} />
            </div>
          </div>

          <div>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
              <input
                id={emailId}
                name="email"
                type="email"
                value={signupData.email}
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
                value={signupData.password}
                onChange={handleChange}
                autoComplete="new-password"
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

          <div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
              <input
                id={confirmPasswordId}
                name="confirmPassword"
                type={passwordVisible ? "text" : "password"}
                value={signupData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                placeholder="Confirm Password"
                aria-invalid={Boolean(formErrors?.confirmPassword)}
                className="h-14 w-full rounded-full border border-slate-200 bg-white pl-12 pr-5 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-[#0c74e7] focus:shadow-[0_0_0_4px_rgba(12,116,231,0.08)]"
                required
              />
            </div>
            <FieldError message={formErrors?.confirmPassword?.errors?.[0]} />
          </div>

          <button
            type="submit"
            disabled={generalLoading}
            className="mt-2 h-12 w-full rounded-full bg-[#0d7bf1] text-[15px] font-medium text-white shadow-[0_14px_32px_rgba(13,123,241,0.28)] transition hover:bg-[#0a6dd9] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {generalLoading ? "Creating account..." : "Sign up"}
          </button>

          <p
            aria-live="polite"
            className="min-h-5 text-center text-xs text-slate-500"
          >
            {signUpFormState.error?.message ||
              signUpFormState.success?.message ||
              ""}
          </p>

          <div className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href={RelativeRoutes.LOGIN_PAGE}
              className="font-medium text-[#0d7bf1] transition hover:text-[#0a6dd9]"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
