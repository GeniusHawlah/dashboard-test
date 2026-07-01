"use client";

export default function SideNavSkeleton() {
  return (
    <div className="hidden h-full w-full select-none flex-col overflow-hidden bg-pry-blue lg:flex">
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="flex animate-pulse items-center gap-2 rounded-xl px-3 py-2.5"
            >
              <div className="h-5 w-5 rounded-md bg-white/20" />
              <div className="h-8 w-full rounded-lg bg-white/15" />
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 px-3 py-3">
        <div className="flex animate-pulse items-center gap-2 rounded-xl border border-white/10 px-3 py-3">
          <div className="h-5 w-5 rounded-md bg-white/20" />
          <div className="h-4 w-20 rounded bg-white/15" />
        </div>
      </div>
    </div>
  );
}
