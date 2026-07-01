"use client";

import { Button } from "@/components/ui/button";
import { buildProgramHref } from "@/utils/utils";
import { Icon } from "@iconify-icon/react";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ProgramShareButton({
  programName,
  programCohort,
  className = "",
}: {
  programName: string;
  programCohort: string | null | undefined;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const href = buildProgramHref({
    name: programName,
    cohort: programCohort,
  });

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(
        new URL(href, window.location.origin).toString(),
      );
      setCopied(true);
      toast.success("Program link copied.");

      window.setTimeout(() => {
        setCopied(false);
      }, 1400);
    } catch {
      toast.error("Unable to copy the program link.");
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={handleCopy}
      className={`rounded-full border border-sky-200 bg-white text-sky-700 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800 ${className}`}
      aria-label={`Copy link for ${programName}`}
      title={copied ? "Copied" : "Copy program link"}
    >
      <Icon
        icon={copied ? "mdi:check" : "ph:share-network"}
        className="text-base"
      />
    </Button>
  );
}
