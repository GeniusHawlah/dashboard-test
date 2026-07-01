"use client";

import { Button } from "@/components/ui/button";
import { globalStore } from "@/store/zustand/globalStore";
import { programStore } from "@/store/zustand/programStore";
import type { ProgramItem } from "@/utils/fetch-functions/getPrograms";
import { RelativeRoutes } from "@/utils/enum";
import { formatDate, formatNaira, formatProgramDuration } from "@/utils/utils";
import {
  getProgramStatus,
  getRegistrationStatus,
  statusPillToneClasses,
} from "@/utils/programStatus";
import { Icon } from "@iconify-icon/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";

type ProgramPreviewItem = Omit<
  ProgramItem,
  "applicationOpensAt" | "startsAt" | "endsAt" | "applicationClosesAt"
> & {
  applicationOpensAt: Date | string | null;
  startsAt: Date | string | null;
  endsAt: Date | string | null;
  applicationClosesAt: Date | string | null;
};

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

export default function ProgramPreviewModal({
  program,
  canApply = false,
  isAuthenticated,
}: {
  program: ProgramPreviewItem;
  canApply?: boolean;
  isAuthenticated: boolean;
}) {
  const closeModal = globalStore((state) => state.closeModal);
  const applyProgramHandler = programStore(
    (state) => state.applyProgramHandler,
  );
  const router = useRouter();
  const [isApplying, setIsApplying] = useState(false);
  const now = new Date();
  const registrationStatus = getRegistrationStatus(
    program.applicationOpensAt,
    program.applicationClosesAt,
    now,
  );
  const programStatus = getProgramStatus(program.startsAt, program.endsAt, now);
  const applicationOpensAt = program.applicationOpensAt
    ? new Date(program.applicationOpensAt)
    : null;
  const applicationClosesAt = program.applicationClosesAt
    ? new Date(program.applicationClosesAt)
    : null;
  const canApplyToProgram =
    !program.enrolledByUser &&
    (!applicationOpensAt || now >= applicationOpensAt) &&
    (!applicationClosesAt || now < applicationClosesAt);
  const showApplyButton = canApply || !isAuthenticated;

  async function handleApply() {
    if (isApplying || !canApplyToProgram || !canApply) return;

    setIsApplying(true);

    try {
      const applied = await applyProgramHandler(program.id);

      if (applied) {
        closeModal();
        router.refresh();
      }
    } catch {
      // Handler already surfaces errors.
    } finally {
      setIsApplying(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl max-h-[80vh] overflow-y-auto rounded-[28px] border border-slate-200 bg-white text-slate-900">
      <div className="border-b border-slate-200 bg-[#f8fbff] px-4 py-4 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.22em] text-pry-blue">
              Program Preview
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-950">
              {program.name}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {program.description ?? "No description provided."}
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
        <div className="grid gap-3 md:grid-cols-3">
          <DetailBlock label="Registration">
            <div className="space-y-1">
              <p>
                <span className="font-semibold text-slate-700">Opens:</span>{" "}
                {program.applicationOpensAt
                  ? formatDate(program.applicationOpensAt)
                  : "Open now"}
              </p>
              <p>
                <span className="font-semibold text-slate-700">Closes:</span>{" "}
                {program.applicationClosesAt
                  ? formatDate(program.applicationClosesAt)
                  : "Open"}
              </p>
            </div>
          </DetailBlock>

          <DetailBlock label="Program">
            <div className="space-y-1">
              <p>
                <span className="font-semibold text-slate-700">Starts:</span>{" "}
                {program.startsAt
                  ? formatDate(program.startsAt)
                  : "Coming soon"}
              </p>
              <p>
                <span className="font-semibold text-slate-700">Ends:</span>{" "}
                {program.endsAt ? formatDate(program.endsAt) : "Coming soon"}
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
            {program.cohort ?? "Cohort pending"}
          </DetailBlock>
          <DetailBlock label="Price">{formatNaira(program.price)}</DetailBlock>
          <DetailBlock label="Duration">
            {formatProgramDuration(program.startsAt, program.endsAt)}
          </DetailBlock>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
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

        <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-2">
          {showApplyButton ? (
            canApplyToProgram ? (
              isAuthenticated ? (
                <Button
                  type="button"
                  onClick={handleApply}
                  disabled={isApplying}
                  className="h-9 rounded-xl border-slate-200 px-4 text-sm"
                >
                  {isApplying ? "Applying..." : "Apply Now"}
                </Button>
              ) : (
                <Button
                  asChild
                  className="h-9 rounded-xl border-slate-200 px-4 text-sm"
                >
                  <Link href={RelativeRoutes.LOGIN_PAGE} onClick={closeModal}>
                    Apply
                  </Link>
                </Button>
              )
            ) : (
              <Button
                type="button"
                disabled
                variant="outline"
                className="h-9 rounded-xl border-slate-200 px-4 text-sm"
              >
                {program.enrolledByUser
                  ? "Currently Enrolled"
                  : "Applications Closed"}
              </Button>
            )
          ) : null}
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
  );
}
