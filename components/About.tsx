import Image from "next/image";
import { Icon } from "@iconify-icon/react";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import brainBehind from "@/public/images/brain_behind.webp";
import { brainBehindContent } from "@/utils/constants";

const focusAreas = [
  {
    icon: "material-symbols:science-outline",
    label: "Science\nEducation",
  },
  {
    icon: "hugeicons:mentor",
    label: "Leadership\nDevelopment",
  },
  {
    icon: "ph:users-four",
    label: "Community\nImpact",
  },
  {
    icon: "streamline:artificial-intelligence-spark",
    label: "Innovation & AI\nExposure",
  },
];

const stats = [
  {
    value: "500+",
    label: "Students\nEmpowered",
  },
  {
    value: "20+",
    label: "Programs\nDelivered",
  },
  {
    value: "10+",
    label: "Active\nPartners",
  },
];

export default function About() {
  return (
    <section id="about" className="bg-white py-8 sm:py-12 ">
      <div className="global-pad mx-auto max-w-7xl">
        <SectionHeading title="FAKANLE FOUNDATION" />

        <div className="mx-auto mt-10 max-w-5xl">
          <div className="grid grid-cols-2 gap-0 bg-white sm:grid-cols-4">
            {focusAreas.map((item) => (
              <div
                key={item.label}
                className="flex min-h-28 flex-col items-center justify-center px-3 py-4 text-center sm:min-h-32 sm:px-4"
              >
                <Icon
                  icon={item.icon}
                  className="text-4xl text-blue-900 sm:text-5xl"
                />
                <p className="mt-3 whitespace-pre-line text-sm font-semibold leading-5 text-deep-blue sm:text-base">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-6xl lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 px-5 py-6 shadow-[0_18px_50px_-42px_rgba(15,23,42,0.55)] sm:px-7 sm:py-8 lg:flex lg:min-h-full lg:flex-col">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-800">
              About Us
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              Building access, guidance, and opportunity for young people
            </h3>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              Fakanle Foundation is committed to expanding access to quality
              science education, nurturing innovation, and equipping young
              people with the skills, mentorship, and opportunities needed to
              create meaningful impact in their communities and beyond.
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              The foundation exists to keep learning practical, mentorship
              close, and growth intentional, so students can build confidence,
              think creatively, and step into brighter futures with support.
            </p>

            <div className="mt-6 hidden lg:block rounded-[1.5rem] border border-slate-200 bg-white px-5 py-5 shadow-[0_14px_40px_-36px_rgba(15,23,42,0.45)] lg:mt-8">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-800">
                {brainBehindContent.eyebrow}
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                {brainBehindContent.title}
              </h3>
              <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 sm:text-base">
                {brainBehindContent.paragraphs.map((paragraph) => (
                  <p key={paragraph.parts.map((part) => part.text).join("")}>
                    {paragraph.parts.map((part, index) => (
                      <span key={`${part.text}-${index}`} className={part.className}>
                        {part.text}
                      </span>
                    ))}
                  </p>
                ))}
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-800">
                  {brainBehindContent.socialHeading}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {brainBehindContent.socialLinks.map((social) => (
                    <Link
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      referrerPolicy="no-referrer"
                      className="inline-flex size-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
                    >
                      <Icon icon={social.icon} className="text-sm" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_50px_-42px_rgba(15,23,42,0.55)] lg:hidden">
            <div className="grid gap-0 sm:grid-cols-[0.95fr_1.05fr]">
              <div className="relative min-h-72 bg-slate-100 sm:min-h-full">
                <Image
                  src={brainBehind}
                  alt={brainBehindContent.alt}
                  fill
                  className="object-cover object-top"
                  sizes="(min-width: 640px) 40vw, 100vw"
                />
              </div>

              <div className="flex flex-col justify-center px-5 py-6 sm:px-6 sm:py-8 lg:hidden">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-800">
                  {brainBehindContent.eyebrow}
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                  {brainBehindContent.title}
                </h3>

                <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 sm:text-base">
                  {brainBehindContent.paragraphs.map((paragraph) => (
                    <p key={paragraph.parts.map((part) => part.text).join("")}>
                      {paragraph.parts.map((part, index) => (
                        <span key={`${part.text}-${index}`} className={part.className}>
                          {part.text}
                        </span>
                      ))}
                    </p>
                  ))}
                </div>

                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-800">
                    {brainBehindContent.socialHeading}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {brainBehindContent.socialLinks.map((social) => (
                      <Link
                        key={social.label}
                        href={social.href}
                        aria-label={social.label}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        referrerPolicy="no-referrer"
                        className="inline-flex size-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
                      >
                        <Icon icon={social.icon} className="text-sm" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_50px_-42px_rgba(15,23,42,0.55)] lg:block lg:h-full">
            <div className="relative h-full min-h-[28rem]">
              <Image
                src={brainBehind}
                alt={brainBehindContent.alt}
                fill
                className="object-cover object-top"
                sizes="(min-width: 1024px) 38vw, 100vw"
              />
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-5xl">
          <div className="grid gap-8 rounded-[1.75rem] bg-linear-to-r from-blue-700 via-blue-800 to-slate-950 px-6 py-8 text-white shadow-[0_24px_60px_-30px_#0f172a8c] sm:px-8 sm:py-10 md:grid-cols-3 md:gap-4 lg:px-10 lg:py-12">
            {stats.map((item) => (
              <div key={item.label} className="text-center md:text-left">
                <p className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
                  {item.value}
                </p>
                <p className="mt-2 whitespace-pre-line text-2xl leading-tight text-white/95 sm:text-[2rem]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
