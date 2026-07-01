"use client";

import AuthMessageModal from "@/components/auth/AuthMessageModal";
import { Button } from "@/components/ui/button";
import { ImageUploadInput } from "@/components/ImageUploadInput";
import { SuggestionInput } from "@/components/ui/suggestion-input";
import { globalStore } from "@/store/zustand/globalStore";
import { mentorStore } from "@/store/zustand/mentorStore";
import { TITLES } from "@/utils/constants";
import { RelativeRoutes } from "@/utils/enum";
import type { ImageInputValue } from "@/utils/imageUploadTypes";
import { capitalizeFirstLetter } from "@/utils/utils";
import { Gender } from "@/utils/prisma";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useState } from "react";

type SignUpFormState = {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: Gender;
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  passport: ImageInputValue;
  idCard: ImageInputValue;
};

function MentorSignUpForm() {
  const generalLoading = globalStore((state) => state.generalLoading);
  const regFormState = mentorStore((state) => state.regFormState);
  const regData = mentorStore((state) => state.regData);
  const registerHandler = mentorStore((state) => state.registerHandler);
  const resetRegData = mentorStore((state) => state.resetRegData);
  const setRegFormState = mentorStore((state) => state.setRegFormState);
  const setRegData = mentorStore((state) => state.setRegData);
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const maxDate = new Date().toISOString().slice(0, 10);
  const formErrors = regFormState?.error?.formErrors;

  function setField<K extends keyof SignUpFormState>(
    name: K,
    value: SignUpFormState[K],
  ) {
    setRegFormState({});
    setRegData(name, value);
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const registered = await registerHandler({
      title: regData.title.trim(),
      firstName: capitalizeFirstLetter(regData.firstName),
      lastName: regData.lastName.trim().toUpperCase(),
      email: regData.email.trim().toLowerCase(),
      password: regData.password,
      confirmPassword: regData.confirmPassword,
      gender: regData.gender,
      dateOfBirth: regData.dateOfBirth,
      phoneNumber: regData.phoneNumber.trim(),
      address: regData.address.trim(),
      passport: regData.passport,
      idCard: regData.idCard,
      programId: undefined,
    });

    if (!registered) {
      return;
    }

    resetRegData();
    setPasswordVisible(false);
    setConfirmPasswordVisible(false);
    setRegFormState({});

    globalStore.getState().openModal(
      <AuthMessageModal kind="verify-email-sent" />,
      {
        size: "md",
      },
    );
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        router.replace(RelativeRoutes.LOGIN_PAGE);
      });
    });
  }

  const canSubmit =
    regData.title.trim() &&
    regData.firstName.trim() &&
    regData.lastName.trim() &&
    regData.email.trim() &&
    regData.phoneNumber.trim() &&
    regData.address.trim() &&
    regData.password.trim() &&
    regData.confirmPassword.trim() &&
    regData.dateOfBirth.trim() &&
    regData.idCard;

  return (
    <form className="space-y-6" autoComplete="off" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm font-medium text-slate-900">Title</label>
          <SuggestionInput
            value={regData.title}
            suggestions={TITLES}
            onValueChange={(value) => setField("title", value)}
            className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white"
            placeholder="Enter title"
            required
          />
          {formErrors?.title?.errors?.[0] ? (
            <p className="text-xs text-rose-600">
              {formErrors.title.errors[0]}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-900">
            First Name
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              name="firstName"
              value={regData.firstName}
              onChange={(event) =>
                setField(
                  "firstName",
                  capitalizeFirstLetter(event.target.value),
                )
              }
              placeholder="Enter first name"
              autoComplete="given-name"
              aria-invalid={Boolean(formErrors?.firstName)}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white"
              required
            />
          </div>
          {formErrors?.firstName?.errors?.[0] ? (
            <p className="text-xs text-rose-600">
              {formErrors.firstName.errors[0]}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-900">
            Last Name (Surname)
          </label>
          <input
            name="lastName"
            value={regData.lastName}
            onChange={(event) =>
              setField("lastName", event.target.value.toUpperCase())
            }
            placeholder="Enter surname"
            autoComplete="family-name"
            aria-invalid={Boolean(formErrors?.lastName)}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white"
            required
          />
          {formErrors?.lastName?.errors?.[0] ? (
            <p className="text-xs text-rose-600">
              {formErrors.lastName.errors[0]}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-900">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              name="email"
              type="email"
              value={regData.email}
              onChange={(event) =>
                setField("email", event.target.value.toLowerCase())
              }
              placeholder="Enter email address"
              autoComplete="email"
              aria-invalid={Boolean(formErrors?.email)}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white"
              required
            />
          </div>
          {formErrors?.email?.errors?.[0] ? (
            <p className="text-xs text-rose-600">
              {formErrors.email.errors[0]}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-900">
            Phone Number
          </label>
            <input
              name="phoneNumber"
              type="tel"
              value={regData.phoneNumber}
              onChange={(event) => setField("phoneNumber", event.target.value)}
              placeholder="Enter phone number"
              autoComplete="new-password"
              inputMode="tel"
              aria-invalid={Boolean(formErrors?.phoneNumber)}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white"
              required
          />
          {formErrors?.phoneNumber?.errors?.[0] ? (
            <p className="text-xs text-rose-600">
              {formErrors.phoneNumber.errors[0]}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-900">Address</label>
        <input
          name="address"
          value={regData.address}
          onChange={(event) => setField("address", event.target.value)}
          placeholder="Enter address"
          autoComplete="street-address"
          aria-invalid={Boolean(formErrors?.address)}
          className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white"
          required
        />
        {formErrors?.address?.errors?.[0] ? (
          <p className="text-xs text-rose-600">
            {formErrors.address.errors[0]}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-900">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              name="password"
              type={passwordVisible ? "text" : "password"}
              value={regData.password}
              onChange={(event) => setField("password", event.target.value)}
              placeholder="Create password"
              autoComplete="new-password"
              aria-invalid={Boolean(formErrors?.password)}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white"
              required
            />
            <button
              type="button"
              onClick={() => setPasswordVisible((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-900"
              aria-label={passwordVisible ? "Hide password" : "Show password"}
            >
              {passwordVisible ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {formErrors?.password?.errors?.[0] ? (
            <p className="text-xs text-rose-600">
              {formErrors.password.errors[0]}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-900">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              name="confirmPassword"
              type={confirmPasswordVisible ? "text" : "password"}
              value={regData.confirmPassword}
              onChange={(event) =>
                setField("confirmPassword", event.target.value)
              }
              placeholder="Confirm password"
              autoComplete="new-password"
              aria-invalid={Boolean(formErrors?.confirmPassword)}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white"
              required
            />
            <button
              type="button"
              onClick={() => setConfirmPasswordVisible((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-900"
              aria-label={
                confirmPasswordVisible ? "Hide password" : "Show password"
              }
            >
              {confirmPasswordVisible ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {formErrors?.confirmPassword?.errors?.[0] ? (
            <p className="text-xs text-rose-600">
              {formErrors.confirmPassword.errors[0]}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-900">Gender</label>
          <select
            value={regData.gender}
            onChange={(event) =>
              setField("gender", event.target.value as Gender)
            }
            aria-invalid={Boolean(formErrors?.gender)}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
          >
            <option value={Gender.FEMALE}>Female</option>
            <option value={Gender.MALE}>Male</option>
          </select>
          {formErrors?.gender?.errors?.[0] ? (
            <p className="text-xs text-rose-600">
              {formErrors.gender.errors[0]}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-900">
            Date of Birth
          </label>
          <input
            name="dateOfBirth"
            type="date"
            value={regData.dateOfBirth}
            onChange={(event) => setField("dateOfBirth", event.target.value)}
            max={maxDate}
            aria-invalid={Boolean(formErrors?.dateOfBirth)}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            required
          />
          {formErrors?.dateOfBirth?.errors?.[0] ? (
            <p className="text-xs text-rose-600">
              {formErrors.dateOfBirth.errors[0]}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-3">
        <ImageUploadInput
          label="Passport Photograph"
          kind="passport"
          value={regData.passport}
          onChange={(value) => setField("passport", value)}
          required
          className={formErrors?.passport ? "rounded-2xl" : undefined}
        />
        {formErrors?.passport?.errors?.[0] ? (
          <p className="text-xs text-rose-600">
            {formErrors.passport.errors[0]}
          </p>
        ) : null}
      </div>

      <div className="space-y-3">
        <ImageUploadInput
          label="ID Card"
          kind="idCard"
          value={regData.idCard}
          onChange={(value) => setField("idCard", value)}
          required
          className={formErrors?.idCard ? "rounded-2xl" : undefined}
        />
        {formErrors?.idCard?.errors?.[0] ? (
          <p className="text-xs text-rose-600">
            {formErrors.idCard.errors[0]}
          </p>
        ) : null}
      </div>

      <div
        aria-live="polite"
        className={`min-h-6 text-sm ${
          regFormState.success ? "text-emerald-600" : "text-rose-600"
        }`}
      >
        {regFormState?.error?.message || regFormState?.success?.message}
      </div>

      <Button
        type="submit"
        disabled={Boolean(!canSubmit) || generalLoading}
        className="h-11 w-full rounded-2xl text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/20"
      >
        {generalLoading ? "Creating account..." : "Create Account"}
      </Button>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          href={RelativeRoutes.LOGIN_PAGE}
          className="font-semibold text-blue-600 transition hover:text-blue-700"
        >
          Login
        </Link>
      </p>
    </form>
  );
}

export default MentorSignUpForm;
