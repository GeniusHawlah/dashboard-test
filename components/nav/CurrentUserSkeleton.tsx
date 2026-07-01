import React from "react";

function CurrentUserSkeleton() {
  return (
    <div className="flex h-12 animate-pulse cursor-pointer items-center gap-1.5 px-1 py-1 sm:gap-2 sm:px-0">
      <div className="order-2 h-4 w-4 rounded bg-slate-300 sm:order-1 sm:h-5 sm:w-5" />
      <div className="order-1 relative h-9 w-9 rounded-full bg-slate-300 sm:order-2 sm:h-10 sm:w-10" />
      <div className="hidden flex-col space-y-1 sm:flex">
        <div className="h-3 w-24 rounded bg-slate-300" />
        <div className="h-3 w-16 rounded bg-slate-300" />
      </div>
    </div>
  );
}

export default CurrentUserSkeleton;
