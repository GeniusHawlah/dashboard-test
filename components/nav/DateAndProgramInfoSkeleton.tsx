export default function DateAndProgramInfoSkeleton() {
  return (
    <>
      <div className="hidden min-w-0 items-center lg:flex lg:h-16">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 animate-pulse items-center justify-center rounded-full bg-slate-200" />

          <div className="min-w-0 space-y-1 animate-pulse">
            <div className="h-2.5 w-14 rounded bg-slate-200" />
            <div className="h-4 w-32 rounded bg-slate-200" />
          </div>

          <div className="h-9 w-px bg-slate-200" />

          <div className="min-w-0 space-y-1 animate-pulse">
            <div className="h-2.5 w-24 rounded bg-slate-200" />
            <div className="h-4 w-36 rounded bg-slate-200" />
          </div>
        </div>
      </div>

      <div className="relative z-[120] flex min-w-0 items-center lg:hidden">
        <div className="flex h-9 max-w-40 animate-pulse items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2 sm:max-w-52 sm:gap-1.5 sm:rounded-full sm:bg-white sm:px-2.5">
          <div className="hidden h-6 w-6 shrink-0 rounded-full bg-slate-200 sm:block" />
          <div className="h-2.5 w-20 rounded bg-slate-200 sm:w-24" />
          <div className="h-4 w-4 rounded bg-slate-200" />
        </div>
      </div>
    </>
  );
}
