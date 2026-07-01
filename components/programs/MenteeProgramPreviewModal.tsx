"use client";

import { Button } from "@/components/ui/button";
import { globalStore } from "@/store/zustand/globalStore";
import type { getMenteeOverview } from "@/utils/fetch-functions/getMenteeOverview";
import { formatDate, formatNaira, formatProgramDuration } from "@/utils/utils";
import {
  getProgramStatus,
  getRegistrationStatus,
  statusPillToneClasses,
} from "@/utils/programStatus";
import { Icon } from "@iconify-icon/react";
import type { ReactNode } from "react";

type MenteeOverviewData = NonNullable<
  Awaited<ReturnType<typeof getMenteeOverview>>["success"]
>["data"];

type ProgramHistoryItem = MenteeOverviewData["programHistory"]["items"][number];

function DetailBlock({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-slate-50/90 px-4 py-3 ${className}`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <div className="mt-1.5 text-sm font-medium text-slate-900">
        {children}
      </div>
    </div>
  );
}

function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: keyof typeof statusPillToneClasses;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusPillToneClasses[tone]}`}
    >
      {label}
    </span>
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
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-4">
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-sm font-semibold text-slate-950">{title}</h4>
        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
          {items.length}
        </span>
      </div>

      {items.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {items.map((item, index) => (
            <li
              key={`${title}-${item}-${index}`}
              className="flex gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
            >
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-pry-blue" />
              <span className="leading-6">{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-slate-500">{emptyLabel}</p>
      )}
    </section>
  );
}

function getFinalResultLabel(item: ProgramHistoryItem) {
  const finalResult = item.finalResult;

  if (typeof finalResult.percentage === "number") {
    return `${finalResult.percentage}%`;
  }

  return "-";
}

export default function MenteeProgramPreviewModal({
  item,
}: {
  item: ProgramHistoryItem;
}) {
  const closeModal = globalStore((state) => state.closeModal);
  const now = new Date();
  const registrationStatus = getRegistrationStatus(
    item.program.applicationOpensAt,
    item.program.applicationClosesAt,
    now,
  );
  const programStatus = getProgramStatus(
    item.program.startsAt,
    item.program.endsAt,
    now,
  );

  return (
    <div className="mx-auto w-full max-w-3xl tiny-scrollbar max-h-[80vh] overflow-y-auto bg-slate-50 p-3 sm:rounded-[28px] sm:p-4">
      <div className="rounded-[28px] border border-slate-200 bg-white text-slate-900">
        <div className="border-b border-slate-200 bg-[#f8fbff] px-4 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.22em] text-pry-blue">
                {item.isCurrent ? "Current enrollment" : "Previous enrollment"}
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                {item.program.name}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {item.program.description ?? "No description provided."}
              </p>
            </div>

            <button
              type="button"
              onClick={closeModal}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-pry-blue/30 hover:text-pry-blue"
              aria-label="Close preview"
            >
              <Icon icon="mdi:close" className="text-lg" />
            </button>
          </div>
        </div>

        <div className="space-y-5 p-4 sm:p-6">
          <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Result
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Score percentage for this program.
                </p>
              </div>
              <p className="text-3xl font-bold leading-none text-slate-950 sm:text-4xl">
                {getFinalResultLabel(item)}
              </p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <DetailBlock label="Registration">
              <div className="space-y-1">
                <p>
                  <span className="font-semibold text-slate-700">Opens:</span>{" "}
                  {item.program.applicationOpensAt
                    ? formatDate(item.program.applicationOpensAt)
                    : "Open now"}
                </p>
                <p>
                  <span className="font-semibold text-slate-700">Closes:</span>{" "}
                  {item.program.applicationClosesAt
                    ? formatDate(item.program.applicationClosesAt)
                    : "Open"}
                </p>
              </div>
            </DetailBlock>

            <DetailBlock label="Program">
              <div className="space-y-1">
                <p>
                  <span className="font-semibold text-slate-700">Starts:</span>{" "}
                  {item.program.startsAt
                    ? formatDate(item.program.startsAt)
                    : "Coming soon"}
                </p>
                <p>
                  <span className="font-semibold text-slate-700">Ends:</span>{" "}
                  {item.program.endsAt
                    ? formatDate(item.program.endsAt)
                    : "Coming soon"}
                </p>
              </div>
            </DetailBlock>

            <DetailBlock label="Status">
              <div className="flex flex-wrap gap-2">
                <StatusBadge
                  label={registrationStatus.label}
                  tone={registrationStatus.tone}
                />
                <StatusBadge
                  label={programStatus.label}
                  tone={programStatus.tone}
                />
              </div>
            </DetailBlock>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <DetailBlock label="Cohort">
              {item.program.cohort ?? "Cohort pending"}
            </DetailBlock>
            <DetailBlock label="Price">
              {formatNaira(item.program.price)}
            </DetailBlock>
            <DetailBlock label="Duration">
              {formatProgramDuration(
                item.program.startsAt,
                item.program.endsAt,
              )}
            </DetailBlock>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <InfoList
              title="Benefits"
              items={item.program.programBenefits}
              emptyLabel="No benefits listed yet."
            />
            <InfoList
              title="Requirements"
              items={item.program.requirements}
              emptyLabel="No requirements listed yet."
            />
          </div>

          {item.note ? (
            <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Note
              </p>
              <p className="mt-1.5 text-sm leading-6 text-slate-700">
                {item.note}
              </p>
            </div>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-3">
            <DetailBlock label="Enrolled At">
              {formatDate(item.enrolledAt)}
            </DetailBlock>
            <DetailBlock label="Completed At">
              {item.completedAt
                ? formatDate(item.completedAt)
                : "Not completed"}
            </DetailBlock>
            <DetailBlock label="Dropped At">
              {item.droppedAt ? formatDate(item.droppedAt) : "Not dropped"}
            </DetailBlock>
          </div>

          <div className="flex justify-end border-t border-slate-200 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
              className="h-9 rounded-xl border-slate-200 px-4 text-sm"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
