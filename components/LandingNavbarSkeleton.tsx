export default function LandingNavbarSkeleton() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-transparent bg-white/95 backdrop-blur-md">
      <div className="global-pad mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 800:h-20">
        <div className="h-16 w-32 shrink-0 rounded-2xl bg-slate-200/80 800:h-24 800:w-45.75" />

        <div className="hidden items-center gap-10 800:flex">
          <div className="h-4 w-18 rounded-full bg-slate-200/80" />
          <div className="h-4 w-16 rounded-full bg-slate-200/80" />
          <div className="h-4 w-14 rounded-full bg-slate-200/80" />
          <div className="h-4 w-16 rounded-full bg-slate-200/80" />
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden h-11 w-28 rounded-full bg-slate-200/80 800:block" />
          <div className="h-11 w-11 rounded-full bg-slate-200/80 800:hidden" />
        </div>
      </div>
    </header>
  );
}
