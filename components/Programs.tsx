"use client";

import ValidImage from "@/components/ValidImage";
import ProgramPreviewModal from "@/components/programs/ProgramPreviewModal";
import ProgramShareButton from "@/components/programs/ProgramShareButton";
import { globalStore } from "@/store/zustand/globalStore";
import { programStore } from "@/store/zustand/programStore";
import { RelativeRoutes } from "@/utils/enum";
import type {
  ProgramItem,
  ProgramsResponse,
} from "@/utils/fetch-functions/getPrograms";
import OGImage from "@/public/images/OG_Image.webp";
import { formatProgramDuration } from "@/utils/utils";
import {
  getProgramStatus,
  getRegistrationStatus,
  statusPillToneClasses,
} from "@/utils/programStatus";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Programs({
  programsResponse,
  canApply,
  isAuthenticated,
}: {
  programsResponse: ProgramsResponse;
  canApply: boolean;
  isAuthenticated: boolean;
}) {
  const openModal = globalStore((state) => state.openModal);
  const applyProgramHandler = programStore(
    (state) => state.applyProgramHandler,
  );
  const router = useRouter();
  const [applyingProgramId, setApplyingProgramId] = useState<string | null>(
    null,
  );
  const programs = programsResponse.success?.data ?? [];
  const errorMessage = programsResponse.error?.message;

  async function handleApply(program: ProgramItem) {
    if (applyingProgramId) return;
    if (program.enrolledByUser) return;

    setApplyingProgramId(program.id);

    try {
      const applied = await applyProgramHandler(program.id);

      if (applied) {
        router.refresh();
      }
    } catch {
      // Handler already surfaces errors.
    } finally {
      setApplyingProgramId(null);
    }
  }

  return (
    <>
      {errorMessage ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      ) : null}

      {!errorMessage && programs.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-600">
          No active programs are available right now.
        </div>
      ) : null}

      {programs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {programs.map((program) => {
              const now = new Date();
              const programStatus = getProgramStatus(
                program.startsAt,
                program.endsAt,
                now,
              );
              const registrationStatus = getRegistrationStatus(
                program.applicationOpensAt,
                program.applicationClosesAt,
                now,
              );
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

              return (
                <article
                  key={program.id}
                  className="overflow-hidden rounded-[1.45rem] border border-sky-100 bg-sky-700 text-left text-white shadow-[0_18px_36px_-20px_rgba(15,23,42,0.55)]"
                >
                  <div className="relative h-48 w-full bg-blue-200 sm:h-56">
                    <ValidImage
                      src={program.coverImage}
                      fallbackSrc={OGImage}
                      alt={program.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />

                    <div className="absolute inset-0 bg-sky-950/20" />

                    <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-1 text-[0.68rem] font-medium uppercase tracking-wide ${statusPillToneClasses[programStatus.tone]}`}
                      >
                        {programStatus.label}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-1 text-[0.68rem] font-medium uppercase tracking-wide ${statusPillToneClasses[registrationStatus.tone]}`}
                      >
                        {registrationStatus.label}
                      </span>
                      {program.enrolledByUser ? (
                        <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[0.68rem] font-medium uppercase tracking-wide text-emerald-700">
                          Already Enrolled
                        </span>
                      ) : null}
                    </div>

                    <div className="absolute right-3 top-3">
                      <ProgramShareButton
                        programCohort={program.cohort}
                        programName={program.name}
                      />
                    </div>
                  </div>

                  <div className="p-4 text-center">
                    <h3 className="font-poppins text-lg font-semibold leading-tight text-white sm:text-[1.25rem]">
                      {program.name}
                    </h3>

                    <p className="mt-1 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-white/75">
                      {program.cohort ?? "Cohort pending"}
                    </p>

                    <p className="mt-2 text-justify text-[0.72rem] leading-5 text-white/80 sm:text-[0.8rem]">
                      {program.description}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          openModal(
                            <ProgramPreviewModal
                              program={program}
                              canApply={canApply}
                              isAuthenticated={isAuthenticated}
                            />,
                            {
                              size: "4xl",
                              position: "center",
                              className: "p-0",
                            },
                          )
                        }
                        className="inline-flex h-8 cursor-pointer items-center justify-center rounded-md border border-white/20 bg-white/10 px-4 text-[0.72rem] font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/15 hover:shadow-md sm:h-9"
                      >
                        Preview
                      </button>

                      {showApplyButton ? (
                        canApplyToProgram ? (
                          isAuthenticated ? (
                            <button
                              type="button"
                              onClick={() => handleApply(program)}
                              className="inline-flex h-8 cursor-pointer items-center justify-center rounded-md border border-sky-500 bg-sky-500 px-4 text-[0.72rem] font-semibold text-white transition hover:-translate-y-0.5 hover:border-sky-400 hover:bg-sky-400 hover:shadow-md sm:h-9"
                              disabled={Boolean(applyingProgramId)}
                            >
                              {applyingProgramId === program.id
                                ? "Applying..."
                                : "Apply"}
                            </button>
                          ) : (
                            <Link
                              href={RelativeRoutes.LOGIN_PAGE}
                              className="inline-flex h-8 items-center justify-center rounded-md border border-sky-500 bg-sky-500 px-4 text-[0.72rem] font-semibold text-white transition hover:-translate-y-0.5 hover:border-sky-400 hover:bg-sky-400 hover:shadow-md sm:h-9"
                            >
                              Apply
                            </Link>
                          )
                        ) : (
                          <button
                            type="button"
                            className="inline-flex h-8 cursor-default items-center justify-center rounded-md border border-white/20 bg-white/10 px-4 text-[0.72rem] font-semibold text-white/55 sm:h-9"
                            disabled
                          >
                            {program.enrolledByUser
                              ? "Already Enrolled"
                              : "Applications closed"}
                          </button>
                        )
                      ) : null}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[0.68rem] leading-5 text-white/70 sm:text-[0.72rem]">
                      <p>
                        <span className="font-semibold text-white/80">
                          duration:
                        </span>{" "}
                        {formatProgramDuration(
                          program.startsAt,
                          program.endsAt,
                        )}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-5 flex justify-start">
            <button
              type="button"
              className="inline-flex h-10 w-32 cursor-pointer items-center justify-center rounded-md bg-blue-600 px-7 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              View All
            </button>
          </div>
        </>
      ) : null}
    </>
  );
}
