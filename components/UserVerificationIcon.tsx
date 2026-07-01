"use client";

import { AppTooltip } from "@/components/ui/app-tooltip";
import { Icon } from "@iconify-icon/react";

function UserVerificationIcon({
  isVerified,
  label = "Email verification",
  className,
}: {
  isVerified: boolean;
  label?: string;
  className?: string;
}) {
  return (
    <AppTooltip
      content={`${label}: ${isVerified ? "Verified" : "Unverified"}`}
      enableHover
      enableClick
    >
      <button
        type="button"
        aria-label={`${label}: ${isVerified ? "Verified" : "Unverified"}`}
        className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 ${
          isVerified
            ? "text-emerald-600 hover:text-emerald-700 focus-visible:ring-emerald-200"
            : "text-rose-600 hover:text-rose-700 focus-visible:ring-rose-200"
        } ${className ?? ""}`}
      >
        <Icon
          icon={isVerified ? "ph:seal-check-fill" : "ph:x-circle-fill"}
          className="text-[0.95rem]"
        />
      </button>
    </AppTooltip>
  );
}

export default UserVerificationIcon;
