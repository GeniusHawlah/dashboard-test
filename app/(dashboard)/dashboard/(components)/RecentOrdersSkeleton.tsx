export default function RecentOrdersSkeleton() {
  return (
    <section className="animate-pulse rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-4 w-32 rounded-full bg-slate-200" />
          <div className="h-3 w-20 rounded-full bg-slate-100" />
        </div>
        <div className="h-9 w-32 rounded-lg bg-slate-100" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="space-y-2.5">
          <div className="h-16 rounded-xl bg-slate-100" />
          <div className="h-16 rounded-xl bg-slate-100" />
          <div className="h-16 rounded-xl bg-slate-100" />
          <div className="h-16 rounded-xl bg-slate-100" />
        </div>

        <div className="rounded-2xl bg-slate-100 p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="h-3 w-24 rounded-full bg-white/80" />
            <div className="h-6 w-20 rounded-full bg-white/80" />
          </div>
          <div className="mt-3 h-48 rounded-xl bg-white/80 lg:h-56" />
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <div className="h-14 rounded-xl bg-white/80" />
            <div className="h-14 rounded-xl bg-white/80" />
            <div className="h-14 rounded-xl bg-white/80" />
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        <div className="h-14 rounded-xl bg-slate-100" />
        <div className="h-14 rounded-xl bg-slate-100" />
        <div className="h-14 rounded-xl bg-slate-100" />
      </div>
    </section>
  );
}
