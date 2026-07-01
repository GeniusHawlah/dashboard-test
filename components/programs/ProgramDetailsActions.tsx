"use client";

import { Button } from "@/components/ui/button";
import { AUTHORIZATION_ERROR_MESSAGE } from "@/utils/constants";
import { programStore } from "@/store/zustand/programStore";
import { RelativeRoutes } from "@/utils/enum";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function ProgramDetailsActions({
  programId,
  isAuthenticated,
  canApply,
  enrolledByUser,
  activeEnrollmentProgramId,
  applicationOpensAt,
  applicationClosesAt,
}: {
  programId: string;
  isAuthenticated: boolean;
  canApply: boolean;
  enrolledByUser: boolean;
  activeEnrollmentProgramId: string | null;
  applicationOpensAt: Date | null;
  applicationClosesAt: Date | null;
}) {
  const router = useRouter();
  const applyProgramHandler = programStore(
    (state) => state.applyProgramHandler,
  );
  const [isApplying, setIsApplying] = useState(false);
  const now = new Date();
  const canApplyToProgram =
    !enrolledByUser &&
    (!applicationOpensAt || now >= applicationOpensAt) &&
    (!applicationClosesAt || now < applicationClosesAt);
  const isEnrolledElsewhere = Boolean(
    activeEnrollmentProgramId && activeEnrollmentProgramId !== programId,
  );

  async function handleApply() {
    if (isApplying || !canApplyToProgram) return;

    if (!canApply) {
      toast.error(AUTHORIZATION_ERROR_MESSAGE);
      return;
    }

    setIsApplying(true);

    try {
      const applied = await applyProgramHandler(programId);

      if (applied) {
        router.refresh();
      }
    } catch {
      // The store already surfaces any errors.
    } finally {
      setIsApplying(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      {enrolledByUser ? (
        <Button
          type="button"
          disabled
          variant="outline"
          className="h-11 rounded-2xl border-sky-200 bg-sky-50 px-5 text-sm font-semibold text-sky-700"
        >
          Enrolled
        </Button>
      ) : isEnrolledElsewhere ? (
        <Button
          type="button"
          disabled
          variant="outline"
          className="h-11 rounded-2xl border-sky-200 bg-sky-50 px-5 text-sm font-semibold text-sky-700"
        >
          Enrolled to Another Program
        </Button>
      ) : canApplyToProgram ? (
        isAuthenticated ? (
          <Button
            type="button"
            onClick={handleApply}
            disabled={isApplying}
            className="h-11 rounded-2xl !bg-sky-600 px-5 text-sm font-semibold text-white shadow-[0_10px_25px_-15px_rgba(2,132,199,0.7)] hover:!bg-sky-700"
          >
            {isApplying ? "Applying..." : "Apply Now"}
          </Button>
        ) : (
          <Button
            asChild
            className="h-11 rounded-2xl !bg-sky-600 px-5 text-sm font-semibold text-white shadow-[0_10px_25px_-15px_rgba(2,132,199,0.7)] hover:!bg-sky-700"
          >
            <Link href={RelativeRoutes.LOGIN_PAGE}>Apply Now</Link>
          </Button>
        )
      ) : (
        <Button
          type="button"
          disabled
          variant="outline"
          className="h-11 rounded-2xl border-slate-200 px-5 text-sm font-semibold text-slate-700"
        >
          Applications Closed
        </Button>
      )}
    </div>
  );
}
