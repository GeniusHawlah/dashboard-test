"use client";

import { globalStore } from "@/store/zustand/globalStore";
import { emailStore } from "@/store/zustand/emailStore";
import { type ContactUsFormErrors, type ContactUsFormInterface } from "@/utils/types";
import { Mail, MessageSquareText, User } from "lucide-react";
import { useId, useMemo, type SyntheticEvent } from "react";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="mt-1 text-xs text-rose-100">{message}</p>;
}

export default function Contact() {
  const nameId = useId();
  const subjectId = useId();
  const emailId = useId();
  const messageId = useId();

  const generalLoading = globalStore((state) => state.generalLoading);
  const contactFormState = emailStore((state) => state.contactFormState);
  const contactData = emailStore((state) => state.contactData);
  const contactUsHandler = emailStore((state) => state.contactUsHandler);
  const setContactFormState = emailStore((state) => state.setContactFormState);
  const resetContactData = emailStore((state) => state.resetContactData);
  const setContactData = emailStore((state) => state.setContactData);

  const formErrors = useMemo<ContactUsFormErrors | undefined>(
    () => contactFormState?.error?.formErrors,
    [contactFormState],
  );

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const sent = await contactUsHandler({
      name: contactData.name.trim(),
      email: contactData.email.trim().toLowerCase(),
      subject: contactData.subject.trim(),
      message: contactData.message.trim(),
    });

    if (!sent) {
      return;
    }

    resetContactData();
  }

  function updateField<K extends keyof ContactUsFormInterface>(
    name: K,
    value: ContactUsFormInterface[K],
  ) {
    setContactFormState(null);
    setContactData(name, value);
  }

  const canSubmit = useMemo(
    () =>
      Boolean(
        contactData.name.trim() &&
          contactData.email.trim() &&
          contactData.subject.trim() &&
          contactData.message.trim(),
      ),
    [contactData],
  );

  return (
    <section id="contact" className="bg-white py-8 sm:py-12 lg:py-16">
      <div className="global-pad mx-auto max-w-7xl">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_42px_-28px_rgba(15,23,42,0.45)]">
          <div className="grid md:grid-cols-[0.92fr_1.08fr]">
            <div className="flex items-center justify-center px-6 py-10 text-center sm:px-10 sm:py-12 md:px-12 md:py-16">
              <div className="max-w-sm">
                <p className="text-lg leading-tight font-medium text-slate-900 sm:text-xl lg:text-[1.7rem]">
                  Have questions or
                  <br />
                  you want to collaborate?
                </p>
                <h2 className="mt-2 font-poppins text-4xl leading-tight font-extrabold tracking-tight text-deep-blue sm:text-5xl lg:text-[3.1rem]">
                  Reach out to us
                </h2>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Send a quick note and we&apos;ll get back to you by email.
                </p>
              </div>
            </div>

            <div className="bg-linear-to-b from-blue-700 to-blue-950 px-5 py-6 sm:px-7 sm:py-7 md:px-8 md:py-8">
              <form className="space-y-3" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor={nameId}
                    className="mb-1.5 block text-base font-medium text-white sm:text-[1.05rem]"
                  >
                    Name
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id={nameId}
                      name="name"
                      type="text"
                      value={contactData.name}
                      onChange={(event) =>
                        updateField("name", event.target.value)
                      }
                      placeholder="Enter your name"
                      aria-invalid={Boolean(formErrors?.name)}
                      className="h-10 w-full rounded-lg border-0 bg-slate-200 px-4 pl-11 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-white/70 sm:h-11"
                      required
                    />
                  </div>
                  <FieldError message={formErrors?.name?.errors?.[0]} />
                </div>

                <div>
                  <label
                    htmlFor={subjectId}
                    className="mb-1.5 block text-base font-medium text-white sm:text-[1.05rem]"
                  >
                    Subject
                  </label>
                  <div className="relative">
                    <MessageSquareText className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id={subjectId}
                      name="subject"
                      type="text"
                      value={contactData.subject}
                      onChange={(event) =>
                        updateField("subject", event.target.value)
                      }
                      placeholder="Enter your subject"
                      aria-invalid={Boolean(formErrors?.subject)}
                      className="h-10 w-full rounded-lg border-0 bg-slate-200 px-4 pl-11 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-white/70 sm:h-11"
                      required
                    />
                  </div>
                  <FieldError message={formErrors?.subject?.errors?.[0]} />
                </div>

                <div>
                  <label
                    htmlFor={emailId}
                    className="mb-1.5 block text-base font-medium text-white sm:text-[1.05rem]"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id={emailId}
                      name="email"
                      type="email"
                      value={contactData.email}
                      onChange={(event) =>
                        updateField("email", event.target.value.toLowerCase())
                      }
                      placeholder="Enter your email"
                      aria-invalid={Boolean(formErrors?.email)}
                      className="h-10 w-full rounded-lg border-0 bg-slate-200 px-4 pl-11 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-white/70 sm:h-11"
                      required
                    />
                  </div>
                  <FieldError message={formErrors?.email?.errors?.[0]} />
                </div>

                <div>
                  <label
                    htmlFor={messageId}
                    className="mb-1.5 block text-base font-medium text-white sm:text-[1.05rem]"
                  >
                    Message
                  </label>
                  <textarea
                    id={messageId}
                    name="message"
                    rows={4}
                    value={contactData.message}
                    onChange={(event) =>
                      updateField("message", event.target.value)
                    }
                    placeholder="Write your message"
                    aria-invalid={Boolean(formErrors?.message)}
                    className="w-full rounded-lg border-0 bg-slate-200 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-white/70 sm:py-3.5"
                    required
                  />
                  <FieldError message={formErrors?.message?.errors?.[0]} />
                </div>

                <div
                  aria-live="polite"
                  className={`min-h-6 text-sm ${
                    contactFormState?.error
                      ? "text-rose-100"
                      : contactFormState?.success
                        ? "text-emerald-200"
                        : "text-slate-200"
                  }`}
                >
                  {contactFormState?.error?.message ||
                    contactFormState?.success?.message}
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit || generalLoading}
                  className="inline-flex h-10 items-center justify-center rounded-md bg-amber-400 px-4 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {generalLoading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
