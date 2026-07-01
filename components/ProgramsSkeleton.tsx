export default function ProgramsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <article
          key={index}
          className="overflow-hidden rounded-[1.45rem] bg-linear-to-br from-blue-600 via-blue-700 to-blue-950 text-white shadow-[0_18px_36px_-20px_rgba(15,23,42,0.65)]"
        >
          <div className="relative h-48 w-full bg-blue-200 sm:h-56">
            <div className="absolute inset-0 animate-pulse bg-white/10" />

            <div className="absolute left-3 top-3 flex flex-wrap gap-2">
              <div className="h-6 w-20 rounded-full bg-white/25" />
            </div>
          </div>

          <div className="px-4 pb-4 pt-3 text-center sm:px-5 sm:pb-5">
            <div className="mx-auto h-6 w-4/5 rounded-full bg-white/20" />
            <div className="mx-auto mt-2 h-3 w-32 rounded-full bg-white/12" />
            <div className="mt-2 h-3 w-full rounded-full bg-white/15" />
            <div className="mt-1 h-3 w-11/12 rounded-full bg-white/12" />

            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <div className="h-8 w-20 rounded-md bg-white/15 sm:h-9" />
              <div className="h-8 w-20 rounded-md bg-white/15 sm:h-9" />
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <div className="h-9 w-32 rounded-md bg-white/12" />
              <div className="h-9 w-32 rounded-md bg-white/12" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
