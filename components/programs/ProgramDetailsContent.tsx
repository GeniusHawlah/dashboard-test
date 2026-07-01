import ValidImage from "@/components/ValidImage";
import ProgramDetailsActions from "@/components/programs/ProgramDetailsActions";
import OGImage from "@/public/images/OG_Image.webp";
import type { ProgramDetailsItem } from "@/utils/fetch-functions/getProgram";
import { getProgramStatus, getRegistrationStatus } from "@/utils/programStatus";
import { formatDate, formatNaira, formatProgramDuration } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify-icon/react";
import Link from "next/link";

function DetailChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-sky-100 bg-sky-50/70 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700/70">
        {label}
      </p>
      <p className="mt-1.5 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function InfoList({
  title,
  items,
  emptyLabel,
}: {
  title: string;
  items: string[];
  emptyLabel: string;
}) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.2)] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-slate-950">{title}</h2>
        <span className="rounded-full border border-sky-100 bg-sky-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-700">
          {items.length}
        </span>
      </div>

      {items.length > 0 ? (
        <ul className="mt-4 space-y-2.5">
          {items.map((item, index) => (
            <li
              key={`${title}-${item}-${index}`}
              className="flex gap-3 rounded-2xl border border-sky-100 bg-sky-50/60 px-3.5 py-3 text-sm text-slate-700"
            >
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-sky-500" />
              <span className="leading-6">{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm leading-6 text-slate-500">{emptyLabel}</p>
      )}
    </section>
  );
}

export default function ProgramDetailsContent({
  program,
  isAuthenticated,
  canApply,
}: {
  program: ProgramDetailsItem;
  isAuthenticated: boolean;
  canApply: boolean;
}) {
  const now = new Date();
  const registrationStatus = getRegistrationStatus(
    program.applicationOpensAt,
    program.applicationClosesAt,
    now,
  );
  const programStatus = getProgramStatus(program.startsAt, program.endsAt, now);
  const heroNote = program.description?.trim()
    ? program.description
    : "This program is structured to guide participants through a focused mentorship journey with a clear timeline and practical support.";

  return (
    <div className="space-y-6 pb-10 sm:space-y-7">
      <section className="overflow-hidden rounded-[32px] border border-sky-100 bg-white shadow-[0_24px_70px_-44px_rgba(15,23,42,0.28)]">
        <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
          <div className="relative min-h-[18rem] bg-sky-100 sm:min-h-[24rem] lg:min-h-[34rem]">
            <ValidImage
              src={program.coverImage}
              fallbackSrc={OGImage}
              alt={`${program.name} cover image`}
              fill
              sizes="(max-width: 1024px) 100vw, 52vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-slate-950/18" />
            <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-5 lg:p-8">
              <div className="max-w-2xl rounded-[24px] border border-white/20 bg-slate-950/45 p-3 text-white backdrop-blur-sm sm:rounded-[28px] sm:p-5">
                <h1 className="text-[1.6rem] font-semibold tracking-tight text-white sm:text-4xl">
                  {program.name}
                </h1>
                <div className="mt-1.5 inline-flex rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/90 sm:mt-2 sm:px-2.5 sm:py-1">
                  {program.cohort ?? "Cohort pending"}
                </div>
                <p className="mt-2 max-w-xl text-[13px] leading-6 text-white/85 sm:mt-3 sm:text-[0.95rem]">
                  {heroNote}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5 p-5 sm:space-y-6 sm:p-7 lg:p-8">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
                {programStatus.label}
              </span>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
                {registrationStatus.label}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <DetailChip
                label="Price"
                value={formatNaira(program.price, {
                  compact: true,
                  decimals: 2,
                })}
              />
              <DetailChip
                label="Duration"
                value={formatProgramDuration(program.startsAt, program.endsAt)}
              />
              <DetailChip
                label="Registration"
                value={
                  program.applicationClosesAt
                    ? `Closes ${formatDate(program.applicationClosesAt)}`
                    : "Open-ended"
                }
              />
            </div>

            <div className="grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2">
              <DetailChip
                label="Applications Open"
                value={
                  program.applicationOpensAt
                    ? formatDate(program.applicationOpensAt)
                    : "Open now"
                }
              />
              <DetailChip
                label="Program Starts"
                value={program.startsAt ? formatDate(program.startsAt) : "Soon"}
              />
            </div>

            <div className="pt-1">
              <ProgramDetailsActions
                programId={program.id}
                isAuthenticated={isAuthenticated}
                canApply={canApply}
                enrolledByUser={program.enrolledByUser}
                activeEnrollmentProgramId={program.activeEnrollmentProgramId}
                applicationOpensAt={program.applicationOpensAt}
                applicationClosesAt={program.applicationClosesAt}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <InfoList
          title="Benefits"
          items={program.programBenefits}
          emptyLabel="No benefits listed yet."
        />
        <InfoList
          title="Requirements"
          items={program.requirements}
          emptyLabel="No requirements listed yet."
        />
      </div>

      <section className="flex flex-col gap-4 rounded-[28px] border border-sky-100 bg-sky-50/70 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-700/70">
            Browse more
          </p>
          <h2 className="text-lg font-semibold text-slate-950">
            Looking for another mentorship option?
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">
            You can compare more programs and come back here whenever you are
            ready.
          </p>
        </div>

        <Button
          asChild
          variant="outline"
          className="h-11 rounded-2xl !border-sky-200 !bg-white px-5 text-sm font-semibold !text-sky-700 shadow-sm hover:!border-sky-300 hover:!bg-sky-50 hover:!text-sky-800"
        >
          <Link href="/#program">
            Browse other programs
            <Icon icon="mdi:arrow-right" className="text-base" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
